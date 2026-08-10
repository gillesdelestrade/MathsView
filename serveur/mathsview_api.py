#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MathsView — service de synchronisation de la progression.

Le site reste entièrement statique : ce service ne sert QUE le stockage, sous
/api. Le navigateur garde une copie locale de tout et continue de fonctionner
si ce service est éteint ; il se resynchronise dès qu'il revient.

Aucune dépendance : http.server et sqlite3 sont dans la bibliothèque standard.
Écoute sur 127.0.0.1:8001, nginx expose /api/ devant (cf. deploy/nginx.conf).

MODÈLE — c'est le même que côté navigateur : un dictionnaire clé → valeur JSON,
les clés « mv.* » de MathsProfils. Rien de plus. Le serveur ne comprend ni les
profils, ni les trophées, ni les pièces : il ne fait que stocker et arbitrer.
C'est volontaire — toute la logique métier reste dans le JavaScript, et faire
évoluer le format de données ne demandera jamais de toucher à ce fichier.

DEUX APPAREILS À LA FOIS — chaque clé porte un numéro de version. Une écriture
qui part d'une version périmée est refusée (409) au lieu d'écraser le travail
d'un autre appareil. Le « bail » (/api/bail) évite d'en arriver là : un profil
n'est ouvert en écriture que sur un appareil à la fois, et le client sait le
dire à l'élève au lieu d'afficher une erreur.

RÉSEAU LOCAL UNIQUEMENT — il n'y a pas d'authentification, exactement comme le
site aujourd'hui. Ne l'expose pas sur Internet en l'état.
"""

import json
import os
import re
import sqlite3
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

HOTE = os.environ.get('MV_HOTE', '127.0.0.1')
PORT = int(os.environ.get('MV_PORT', '8001'))
BASE = os.environ.get('MV_BASE', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mathsview.sqlite3'))

DUREE_BAIL = 90          # secondes ; le client renouvelle toutes les 30 s
TAILLE_MAX = 8 * 1024 * 1024   # garde-fou sur le corps d'une requête

_horloge = threading.Lock()


def maintenant():
    """Secondes epoch. Isolé pour que les tests puissent le figer."""
    import time
    return int(time.time())


# ===================================================================== #
# Base                                                                  #
# ===================================================================== #
def connexion():
    c = sqlite3.connect(BASE, timeout=10)
    c.isolation_level = None            # on gère BEGIN/COMMIT à la main
    c.execute('PRAGMA journal_mode=WAL')
    c.execute('PRAGMA synchronous=NORMAL')
    return c


def prepare():
    c = connexion()
    try:
        c.execute('''CREATE TABLE IF NOT EXISTS donnees (
                       cle     TEXT PRIMARY KEY,
                       valeur  TEXT,               -- JSON ; NULL = clé supprimée
                       version INTEGER NOT NULL,
                       maj     INTEGER NOT NULL
                     )''')
        c.execute('''CREATE TABLE IF NOT EXISTS baux (
                       profil   TEXT PRIMARY KEY,
                       appareil TEXT NOT NULL,
                       nom      TEXT,
                       jusqua   INTEGER NOT NULL
                     )''')
    finally:
        c.close()


# ===================================================================== #
# Opérations                                                            #
# ===================================================================== #
def instantane():
    """Tout le contenu, tel que le navigateur l'attend au démarrage."""
    c = connexion()
    try:
        donnees, versions = {}, {}
        # Les clés supprimées gardent une ligne (valeur NULL) : on renvoie leur
        # version sans leur contenu. Sans ça, un client qui réécrirait une clé
        # effacée repartirait de la version 0 et se ferait refuser sans fin.
        for cle, valeur, version in c.execute('SELECT cle, valeur, version FROM donnees'):
            versions[cle] = version
            if valeur is not None:
                donnees[cle] = valeur
        return {'donnees': donnees, 'versions': versions}
    finally:
        c.close()


def ecrit(cles):
    """
    Écriture groupée et atomique. `cles` : {cle: {valeur: <json|null>, version: n}}
    où `version` est celle dont part le client (0 = clé encore inexistante).

    Renvoie (200, {versions}) ou (409, {conflits}) — dans le second cas RIEN
    n'est écrit, pas même les clés qui n'étaient pas en conflit : soit l'appareil
    est à jour, soit il se resynchronise.
    """
    c = connexion()
    try:
        c.execute('BEGIN IMMEDIATE')
        conflits = {}
        for cle, o in cles.items():
            ligne = c.execute('SELECT valeur, version FROM donnees WHERE cle=?', (cle,)).fetchone()
            actuelle = ligne[1] if ligne else 0
            if actuelle != int(o.get('version', 0)):
                conflits[cle] = {'valeur': ligne[0] if ligne else None, 'version': actuelle}

        if conflits:
            c.execute('ROLLBACK')
            return 409, {'conflits': conflits}

        t = maintenant()
        versions = {}
        for cle, o in cles.items():
            v = int(o.get('version', 0)) + 1
            c.execute('''INSERT INTO donnees (cle, valeur, version, maj) VALUES (?,?,?,?)
                         ON CONFLICT(cle) DO UPDATE SET valeur=excluded.valeur,
                                                        version=excluded.version,
                                                        maj=excluded.maj''',
                      (cle, o.get('valeur'), v, t))
            versions[cle] = v
        c.execute('COMMIT')
        return 200, {'versions': versions}
    except Exception:
        try:
            c.execute('ROLLBACK')
        except Exception:
            pass
        raise
    finally:
        c.close()


def prend_bail(profil, appareil, nom, force=False):
    """
    Réserve l'écriture d'un profil pour un appareil. Si un autre appareil le
    tient encore, on refuse et on dit lequel — c'est au client de proposer
    « reprendre ici ». `force` accorde le bail malgré tout (l'élève a confirmé).
    """
    c = connexion()
    try:
        c.execute('BEGIN IMMEDIATE')
        t = maintenant()
        ligne = c.execute('SELECT appareil, nom, jusqua FROM baux WHERE profil=?', (profil,)).fetchone()
        if ligne and ligne[0] != appareil and ligne[2] > t and not force:
            c.execute('ROLLBACK')
            return 409, {'ok': False, 'appareil': ligne[1] or 'un autre appareil',
                         'restant': ligne[2] - t}
        c.execute('''INSERT INTO baux (profil, appareil, nom, jusqua) VALUES (?,?,?,?)
                     ON CONFLICT(profil) DO UPDATE SET appareil=excluded.appareil,
                                                       nom=excluded.nom,
                                                       jusqua=excluded.jusqua''',
                  (profil, appareil, nom, t + DUREE_BAIL))
        c.execute('COMMIT')
        return 200, {'ok': True, 'duree': DUREE_BAIL}
    finally:
        c.close()


def rend_bail(profil, appareil):
    c = connexion()
    try:
        c.execute('DELETE FROM baux WHERE profil=? AND appareil=?', (profil, appareil))
        return 200, {'ok': True}
    finally:
        c.close()


# ===================================================================== #
# HTTP                                                                  #
# ===================================================================== #
# En production nginx sert le site et l'API sur la même origine : aucune
# en-tête CORS n'est nécessaire. On les ajoute uniquement pour les origines
# manifestement locales, afin qu'on puisse développer sur son portable en
# tapant sur le Pi (window.MV_API dans la console).
PRIVEE = re.compile(
    r'^https?://('
    r'localhost|127\.0\.0\.1|\[::1\]|'
    r'[\w-]+\.local|'
    r'10\.\d+\.\d+\.\d+|'
    r'192\.168\.\d+\.\d+|'
    r'172\.(1[6-9]|2\d|3[01])\.\d+\.\d+'
    r')(:\d+)?$')


class Service(BaseHTTPRequestHandler):
    server_version = 'MathsView/1'
    protocol_version = 'HTTP/1.1'

    # ------------------------------------------------------------------ #
    def repond(self, code, objet):
        corps = json.dumps(objet).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(corps)))
        self.send_header('Cache-Control', 'no-store')
        origine = self.headers.get('Origin')
        if origine and PRIVEE.match(origine):
            self.send_header('Access-Control-Allow-Origin', origine)
            self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(corps)

    def corps_json(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0:
            return {}
        if n > TAILLE_MAX:
            raise ValueError('corps trop volumineux')
        return json.loads(self.rfile.read(n).decode('utf-8'))

    def chemin(self):
        return urlparse(self.path).path.rstrip('/') or '/'

    def log_message(self, fmt, *a):
        # systemd horodate déjà ; on ne garde que les erreurs.
        pass

    # ------------------------------------------------------------------ #
    def do_OPTIONS(self):
        self.repond(204, {})

    def do_GET(self):
        p = self.chemin()
        try:
            if p == '/api/instantane':
                return self.repond(200, instantane())
            if p == '/api/sante':
                return self.repond(200, {'ok': True})
        except Exception as e:
            return self.repond(500, {'erreur': str(e)})
        self.repond(404, {'erreur': 'route inconnue'})

    def do_PUT(self):
        p = self.chemin()
        try:
            if p == '/api/donnees':
                cles = (self.corps_json() or {}).get('cles') or {}
                if not isinstance(cles, dict):
                    return self.repond(400, {'erreur': '« cles » doit être un objet'})
                code, out = ecrit(cles)
                return self.repond(code, out)
        except ValueError as e:
            return self.repond(400, {'erreur': str(e)})
        except Exception as e:
            return self.repond(500, {'erreur': str(e)})
        self.repond(404, {'erreur': 'route inconnue'})

    def do_POST(self):
        p = self.chemin()
        try:
            if p == '/api/bail':
                o = self.corps_json() or {}
                if not o.get('profil') or not o.get('appareil'):
                    return self.repond(400, {'erreur': 'profil et appareil requis'})
                code, out = prend_bail(str(o['profil']), str(o['appareil']),
                                       str(o.get('nom') or ''), bool(o.get('force')))
                return self.repond(code, out)
        except ValueError as e:
            return self.repond(400, {'erreur': str(e)})
        except Exception as e:
            return self.repond(500, {'erreur': str(e)})
        self.repond(404, {'erreur': 'route inconnue'})

    def do_DELETE(self):
        p = self.chemin()
        try:
            if p == '/api/bail':
                o = self.corps_json() or {}
                code, out = rend_bail(str(o.get('profil') or ''), str(o.get('appareil') or ''))
                return self.repond(code, out)
        except Exception as e:
            return self.repond(500, {'erreur': str(e)})
        self.repond(404, {'erreur': 'route inconnue'})


def main():
    prepare()
    srv = ThreadingHTTPServer((HOTE, PORT), Service)
    sys.stderr.write('MathsView — stockage sur http://%s:%d/api  (base : %s)\n' % (HOTE, PORT, BASE))
    sys.stderr.flush()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        srv.server_close()


if __name__ == '__main__':
    main()
