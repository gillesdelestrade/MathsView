/*
 * MathsProfils — les profils et le stockage (SPEC §7).
 *
 * RÈGLE ABSOLUE : personne d'autre que ce fichier ne touche à `localStorage`.
 * Tout passe par lire()/ecrire(). C'est ce qui permettra de basculer vers une
 * API serveur plus tard sans rien réécrire ailleurs — et c'est aussi ce qui
 * rend l'export/import possible en une seule fonction.
 *
 * Deux précautions qui comptent :
 *   • si le stockage est indisponible (navigation privée, quota plein), on
 *     bascule sur une mémoire de session plutôt que de planter : l'élève perd
 *     sa progression mais peut travailler ;
 *   • le JOURNAL est append-only et plafonné : au-delà de 2000 entrées, les
 *     plus anciennes sont agrégées en compteurs mensuels au lieu d'être jetées
 *     (SPEC §7.3), pour que les statistiques restent justes.
 *
 * L'export/import (§7.5) est traité comme une fonctionnalité de première
 * classe : avec localStorage, une purge de navigateur efface tout.
 */
(function (global) {
  'use strict';

  var VERSION = 1;
  var PLAFOND_JOURNAL = 2000;      // entrées gardées telles quelles
  var LOT_ARCHIVE = 200;           // combien on agrège d'un coup au-delà

  /* ===================================================================== */
  /* Le stockage, et lui seul                                              */
  /* ===================================================================== */
  var memoire = {};                // repli si localStorage est inutilisable
  var STOCKE = (function () {
    try {
      global.localStorage.setItem('mv.test', '1');
      global.localStorage.removeItem('mv.test');
      return true;
    } catch (e) {
      return false;
    }
  })();

  function lire(cle, defaut) {
    var brut;
    try {
      brut = STOCKE ? global.localStorage.getItem(cle) : memoire[cle];
    } catch (e) { brut = null; }
    if (brut === null || brut === undefined) return defaut === undefined ? null : defaut;
    try { return JSON.parse(brut); }
    catch (e) {
      console.warn('MathsProfils : données illisibles pour « ' + cle + ' »');
      return defaut === undefined ? null : defaut;
    }
  }

  function ecrire(cle, val) {
    var s = JSON.stringify(val);
    try {
      if (STOCKE) global.localStorage.setItem(cle, s);
      else memoire[cle] = s;
    } catch (e) {
      // Quota dépassé : on prévient une fois, on ne casse rien.
      console.warn('MathsProfils : impossible d\'écrire « ' + cle + ' » — ' + e.message);
    }
  }

  function efface(cle) {
    try {
      if (STOCKE) global.localStorage.removeItem(cle);
      else delete memoire[cle];
    } catch (e) { /* rien à faire */ }
  }

  // Toutes les clés « mv.* », pour l'export et pour la remise à zéro.
  function clesMV() {
    var out = [];
    try {
      if (STOCKE) {
        for (var i = 0; i < global.localStorage.length; i++) {
          var k = global.localStorage.key(i);
          if (k && k.indexOf('mv.') === 0) out.push(k);
        }
      } else {
        for (var k2 in memoire) if (memoire.hasOwnProperty(k2)) out.push(k2);
      }
    } catch (e) { /* rien à faire */ }
    return out.sort();
  }

  /* ===================================================================== */
  /* Les profils                                                           */
  /* ===================================================================== */
  var COULEURS = ['#7c3aed', '#0d9488', '#e11d48', '#2563eb', '#ea580c', '#c026d3'];
  var EMOJIS = ['🦊', '🐬', '🦉', '🐨', '🦋', '🐙', '🦔', '🐝'];

  function profils() { return lire('mv.profils', []); }

  function profil(id) {
    return profils().filter(function (p) { return p.id === id; })[0] || null;
  }

  function identifiant(prenom) {
    var base = String(prenom).toLowerCase()
      .normalize ? String(prenom).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
                 : String(prenom).toLowerCase();
    base = base.replace(/[^a-z0-9]/g, '') || 'eleve';
    var pris = profils().map(function (p) { return p.id; });
    if (pris.indexOf(base) < 0) return base;
    var n = 2;
    while (pris.indexOf(base + n) >= 0) n++;
    return base + n;
  }

  function creer(infos) {
    infos = infos || {};
    var liste = profils();
    var p = {
      id: identifiant(infos.prenom || 'Élève'),
      prenom: infos.prenom || 'Élève',
      couleur: infos.couleur || COULEURS[liste.length % COULEURS.length],
      emoji: infos.emoji || EMOJIS[liste.length % EMOJIS.length],
      niveau: infos.niveau || '2nde',
      creeLe: Date.now()
    };
    liste.push(p);
    ecrire('mv.profils', liste);
    ecrire('mv.version', VERSION);
    ecrire(cleEtat(p.id), etatNeuf());
    ecrire(cleJournal(p.id), []);
    if (!courant()) setCourant(p.id);
    return p;
  }

  function modifier(id, infos) {
    var liste = profils();
    liste.forEach(function (p) {
      if (p.id !== id) return;
      // Liste blanche : on ne laisse pas un import ou un appel maladroit
      // injecter n'importe quel champ dans un profil.
      ['prenom', 'couleur', 'emoji', 'niveau', 'archive'].forEach(function (k) {
        if (infos[k] !== undefined) p[k] = infos[k];
      });
    });
    ecrire('mv.profils', liste);
  }

  function supprimer(id) {
    ecrire('mv.profils', profils().filter(function (p) { return p.id !== id; }));
    efface(cleEtat(id));
    efface(cleJournal(id));
    efface(cleArchive(id));
    if (courant() === id) {
      var reste = profils();
      setCourant(reste.length ? reste[0].id : null);
    }
  }

  function courant() { return lire('mv.courant', null); }
  function setCourant(id) {
    if (id === null) efface('mv.courant'); else ecrire('mv.courant', id);
  }

  /* ===================================================================== */
  /* L'état d'un profil                                                    */
  /* ===================================================================== */
  function cleEtat(id) { return 'mv.profil.' + id + '.etat'; }
  function cleJournal(id) { return 'mv.profil.' + id + '.journal'; }
  function cleArchive(id) { return 'mv.profil.' + id + '.archive'; }

  function etatNeuf() {
    return {
      xp: 0, pieces: 0,
      maitrises: {},          // code de compétence → objet maîtrise (cf. progression.js)
      trophees: [],
      achats: [],
      sessions: [],           // horodatages des séries terminées (régularité)
      reglages: { son: false, clavierMaths: true }
    };
  }

  function etat(id) {
    var e = lire(cleEtat(id), null);
    if (!e) { e = etatNeuf(); ecrire(cleEtat(id), e); }
    // Complète les champs d'une sauvegarde plus ancienne que le code.
    var neuf = etatNeuf();
    Object.keys(neuf).forEach(function (k) { if (e[k] === undefined) e[k] = neuf[k]; });
    return e;
  }
  function setEtat(id, e) { ecrire(cleEtat(id), e); }

  /* ===================================================================== */
  /* Le journal (append-only)                                              */
  /* ===================================================================== */
  function journal(id) { return lire(cleJournal(id), []); }

  // Au-delà du plafond, les plus anciennes entrées ne sont pas jetées : elles
  // sont agrégées par mois, ce qui garde les totaux justes.
  function ajouteJournal(id, evt) {
    var j = journal(id);
    j.push(evt);
    if (j.length > PLAFOND_JOURNAL) {
      var vieilles = j.splice(0, LOT_ARCHIVE);
      var arch = lire(cleArchive(id), {});
      vieilles.forEach(function (e) {
        var d = new Date(e.t);
        var mois = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
        var a = arch[mois] || { tentatives: 0, reussites: 0, duree: 0 };
        a.tentatives++;
        if (e.ok) a.reussites++;
        a.duree += e.duree || 0;
        arch[mois] = a;
      });
      ecrire(cleArchive(id), arch);
    }
    ecrire(cleJournal(id), j);
  }
  function archive(id) { return lire(cleArchive(id), {}); }

  /* ===================================================================== */
  /* Export / import (SPEC §7.5) — la vraie sauvegarde                     */
  /* ===================================================================== */
  function exporte() {
    var donnees = {};
    clesMV().forEach(function (k) { donnees[k] = lire(k); });
    return {
      application: 'MathsView',
      version: VERSION,
      exporteLe: Date.now(),
      profils: profils().map(function (p) { return p.prenom; }),
      donnees: donnees
    };
  }

  function nomFichier() {
    var d = new Date();
    return 'mathsview-sauvegarde-' + d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.json';
  }

  // Déclenche le téléchargement, et note la date pour le rappel des 30 jours.
  function telecharge() {
    var contenu = JSON.stringify(exporte(), null, 2);
    var blob = new global.Blob([contenu], { type: 'application/json' });
    var url = global.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = nomFichier();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
    ecrire('mv.dernierExport', Date.now());
  }

  // Analyse un fichier SANS rien écrire : la page peut afficher ce qu'elle
  // s'apprête à remplacer avant que l'utilisateur confirme.
  function analyse(texte) {
    var o;
    try { o = JSON.parse(texte); }
    catch (e) { return { ok: false, erreur: 'Ce fichier n\'est pas un JSON valide.' }; }
    if (!o || o.application !== 'MathsView' || !o.donnees) {
      return { ok: false, erreur: 'Ce fichier n\'est pas une sauvegarde MathsView.' };
    }
    var prof = (o.donnees['mv.profils'] || []);
    return {
      ok: true, objet: o, date: o.exporteLe,
      profils: prof.map(function (p) { return p.prenom + ' (' + p.id + ')'; })
    };
  }

  // Remplace TOUT le contenu mv.* par celui de la sauvegarde.
  function importe(objet) {
    if (!objet || !objet.donnees) return false;
    clesMV().forEach(efface);
    Object.keys(objet.donnees).forEach(function (k) { ecrire(k, objet.donnees[k]); });
    return true;
  }

  // Depuis combien de jours n'a-t-on pas exporté ? (null = jamais)
  function joursDepuisExport() {
    var t = lire('mv.dernierExport', null);
    return t ? Math.floor((Date.now() - t) / 86400000) : null;
  }

  function reinitialise(id) {
    if (id) { ecrire(cleEtat(id), etatNeuf()); ecrire(cleJournal(id), []); efface(cleArchive(id)); }
    else clesMV().forEach(efface);
  }

  // La place occupée, en Ko — le quota tourne autour de 5 Mo (SPEC §9.5).
  function taille() {
    var n = 0;
    clesMV().forEach(function (k) { n += JSON.stringify(lire(k)).length + k.length; });
    return Math.round(n / 102.4) / 10;
  }

  /* ===================================================================== */
  global.MathsProfils = {
    // stockage brut (le reste du code ne doit PAS utiliser localStorage)
    lire: lire, ecrire: ecrire, efface: efface, cles: clesMV, disponible: STOCKE,
    // profils
    profils: profils, profil: profil, creer: creer, modifier: modifier,
    supprimer: supprimer, courant: courant, setCourant: setCourant,
    couleurs: COULEURS, emojis: EMOJIS,
    // état et journal
    etat: etat, setEtat: setEtat, etatNeuf: etatNeuf,
    journal: journal, ajouteJournal: ajouteJournal, archive: archive,
    // sauvegarde
    exporte: exporte, telecharge: telecharge, analyse: analyse, importe: importe,
    nomFichier: nomFichier, joursDepuisExport: joursDepuisExport,
    reinitialise: reinitialise, taille: taille, version: VERSION
  };

})(window);
