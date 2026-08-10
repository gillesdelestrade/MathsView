#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MathsView en local — le site ET son stockage, dans un seul processus.

En production ces deux rôles sont séparés (nginx sert les fichiers, systemd
fait tourner mathsview_api.py). Pour travailler sur son portable, ce mélange
évite d'avoir à monter un proxy : les fichiers viennent du disque, et tout ce
qui commence par /api part dans le service de stockage.

    python3 serveur/dev.py        →  http://localhost:8000

La base de test est serveur/mathsview.sqlite3 (ignorée par git). L'effacer
remet la progression locale à zéro.
"""

import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mathsview_api as api          # noqa: E402

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get('MV_PORT', '8000'))


class Local(api.Service, SimpleHTTPRequestHandler):
    """/api → le stockage ; tout le reste → les fichiers du site."""

    def do_GET(self):
        if self.path.startswith('/api'):
            return api.Service.do_GET(self)
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_HEAD(self):
        return SimpleHTTPRequestHandler.do_HEAD(self)

    def end_headers(self):
        # Les leçons changent à chaque enregistrement : on ne veut jamais
        # recharger une version en cache pendant qu'on travaille dessus.
        if not self.path.startswith('/api'):
            self.send_header('Cache-Control', 'no-store')
        SimpleHTTPRequestHandler.end_headers(self)

    def log_message(self, fmt, *a):
        # api.Service fait taire les journaux ; en local on veut les voir.
        sys.stderr.write('%s  %s\n' % (self.log_date_time_string(), fmt % a))


def main():
    api.prepare()
    handler = functools.partial(Local, directory=RACINE)
    srv = ThreadingHTTPServer(('0.0.0.0', PORT), handler)
    print('MathsView en ligne sur  →  http://localhost:%d' % PORT)
    print('Stockage : %s' % api.BASE)
    print('(Ctrl+C pour arrêter)')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('')
        srv.server_close()


if __name__ == '__main__':
    main()
