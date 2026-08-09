/*
 * MathsProgression — maîtrise, ceintures, jardin (SPEC §5).
 *
 * Le mécanisme central n'est pas le score : c'est sa DÉCROISSANCE. Une
 * compétence non retravaillée perd 5 % par semaine, et le jardin le montre —
 * la plante fane. C'est de la répétition espacée sans jamais prononcer le mot,
 * et c'est ce qui ramène les élèves sur d'anciennes notions.
 *
 * Trois précautions, toutes voulues par le SPEC :
 *   • la décroissance est calculée À LA LECTURE, jamais par un minuteur : rien
 *     ne tourne en tâche de fond, et fermer l'onglet trois mois ne casse rien ;
 *   • elle a un PLANCHER à 30 % du meilleur score jamais atteint : on rappelle,
 *     on ne décourage pas ;
 *   • la ceinture affichée est la MEILLEURE jamais obtenue. On ne retire pas
 *     une ceinture : on signale, par un liseré, qu'elle demande à être
 *     entretenue.
 *
 * Anti-farming : enchaîner 50 questions trop faciles ne doit rien rapporter.
 * Une question deux crans en dessous du palier courant vaut 20 % des points.
 */
(function (global) {
  'use strict';

  var SEMAINE = 7 * 24 * 3600 * 1000;
  var DECROISSANCE = 0.95;          // par semaine
  var PLANCHER = 0.30;              // du meilleur score jamais atteint
  var SEUILS = [25, 50, 75, 100];   // franchissements qui font monter d'un palier
  var FACTEUR = [0.4, 0.8, 1.2, 1.6];

  var CEINTURES = [
    { min: 0,  nom: 'blanche', couleur: '#e5e7eb', encre: '#475569', pieces: 0 },
    { min: 15, nom: 'jaune',   couleur: '#facc15', encre: '#713f12', pieces: 10 },
    { min: 35, nom: 'orange',  couleur: '#fb923c', encre: '#7c2d12', pieces: 15 },
    { min: 55, nom: 'verte',   couleur: '#22c55e', encre: '#14532d', pieces: 20 },
    { min: 75, nom: 'bleue',   couleur: '#3b82f6', encre: '#1e3a8a', pieces: 30 },
    { min: 90, nom: 'noire',   couleur: '#1e293b', encre: '#f8fafc', pieces: 40 }
  ];

  function maintenant() { return Date.now(); }

  function neuve() {
    return { score: 0, palier: 1, derniere: 0, serie: 0,
             tentatives: 0, reussites: 0, meilleur: 0 };
  }

  /* ===================================================================== */
  /* La maîtrise, telle qu'on la LIT (décroissance comprise)               */
  /* ===================================================================== */
  function scoreCourant(m, t) {
    if (!m || !m.derniere) return m ? m.score : 0;
    var semaines = ((t || maintenant()) - m.derniere) / SEMAINE;
    if (semaines <= 0) return m.score;
    var estompe = m.score * Math.pow(DECROISSANCE, semaines);
    // On ne descend jamais sous 30 % du meilleur score jamais atteint — ni,
    // évidemment, sous le score courant s'il est déjà plus bas.
    var plancher = Math.min(m.score, PLANCHER * (m.meilleur || m.score));
    return Math.max(estompe, plancher);
  }

  function maitrise(id, code) {
    var e = MathsProfils.etat(id);
    var m = e.maitrises[code];
    if (!m) return neuve();
    var copie = {};
    Object.keys(m).forEach(function (k) { copie[k] = m[k]; });
    copie.score = scoreCourant(m);
    return copie;
  }

  /* ===================================================================== */
  /* Les ceintures                                                         */
  /* ===================================================================== */
  function ceinture(score) {
    var c = CEINTURES[0];
    CEINTURES.forEach(function (x) { if (score >= x.min) c = x; });
    return c;
  }
  // Ce qu'on affiche : la meilleure jamais obtenue, et si elle a besoin d'être
  // entretenue (le score courant est retombé sous son seuil).
  function ceintureAffichee(m) {
    var acquise = ceinture(m.meilleur || 0);
    var courante = ceinture(m.score || 0);
    return { nom: acquise.nom, couleur: acquise.couleur, encre: acquise.encre,
             aEntretenir: courante.min < acquise.min };
  }

  /* ===================================================================== */
  /* Après chaque question                                                 */
  /* ===================================================================== */
  /* `info` : { comp, gen, seed, palier, maxPaliers, ok, indices, indicesDispo,
                duree } — tout ce que le moteur sait déjà. */
  function apresQuestion(id, info) {
    var e = MathsProfils.etat(id);
    var brut = e.maitrises[info.comp] || neuve();

    // On matérialise d'abord la décroissance, sinon elle serait perdue au
    // moment où l'on réécrit le score.
    var m = {};
    Object.keys(brut).forEach(function (k) { m[k] = brut[k]; });
    m.score = scoreCourant(brut);

    var avant = ceintureAffichee(m);
    var maxP = info.maxPaliers || 4;
    var pal = Math.max(1, Math.min(FACTEUR.length, info.palier || 1));
    var facteur = FACTEUR[pal - 1];

    // Malus d'indices : demander de l'aide reste possible, mais rapporte moins.
    var dispo = info.indicesDispo || 0;
    var malus = dispo ? (1 - 0.5 * (info.indices || 0) / dispo) : 1;

    // Anti-farming : une question deux crans sous le palier courant ne vaut
    // presque rien.
    var facile = pal <= (m.palier || 1) - 2;

    var gain = 0, xp = 0;
    if (info.ok) {
      gain = 8 * facteur * malus * (facile ? 0.2 : 1);
      m.score = Math.min(100, m.score + gain);
      m.serie = (m.serie || 0) + 1;
      m.reussites = (m.reussites || 0) + 1;
      xp = Math.max(1, Math.round(gain));
    } else {
      m.score = Math.max(0, m.score - 5);
      m.serie = 0;
    }
    m.tentatives = (m.tentatives || 0) + 1;
    m.derniere = maintenant();
    m.meilleur = Math.max(m.meilleur || 0, m.score);

    // Le palier monte quand le score franchit 25 / 50 / 75 avec au moins trois
    // réussites d'affilée.
    var seuil = SEUILS[(m.palier || 1) - 1];
    if (m.palier < maxP && m.score >= seuil && m.serie >= 3) {
      m.palier++;
      m.serie = 0;
    }

    var apres = ceintureAffichee(m);
    var pieces = 0;
    if (ceinture(m.meilleur).min > ceinture(brut.meilleur || 0).min) {
      pieces = ceinture(m.meilleur).pieces;      // nouvelle ceinture obtenue
    }

    e.maitrises[info.comp] = m;
    e.xp = (e.xp || 0) + xp;
    e.pieces = (e.pieces || 0) + pieces;
    MathsProfils.setEtat(id, e);

    MathsProfils.ajouteJournal(id, {
      t: m.derniere, type: 'tentative', comp: info.comp, gen: info.gen,
      seed: info.seed, palier: pal, ok: !!info.ok, duree: info.duree || 0,
      indices: info.indices || 0, xp: xp, pieces: pieces,
      // Tronquée : le journal est plafonné, une réponse d'élève tient en peu
      // de caractères, et on ne veut pas qu'un copier-coller le fasse gonfler.
      saisie: info.saisie === undefined ? '' : String(info.saisie).slice(0, 60)
    });

    return { gain: gain, xp: xp, pieces: pieces, maitrise: m,
             ceintureAvant: avant, ceintureApres: apres,
             nouvelleCeinture: apres.nom !== avant.nom, facile: facile };
  }

  /* ===================================================================== */
  /* Fin de série : la régularité, seule source de pièces avec les ceintures*/
  /* ===================================================================== */
  function finSession(id) {
    var e = MathsProfils.etat(id);
    var t = maintenant();
    e.sessions = (e.sessions || []).filter(function (x) { return t - x < 90 * 86400000; });
    e.sessions.push(t);

    var recentes = e.sessions.filter(function (x) { return t - x < SEMAINE; }).length;
    var pieces = 0;
    if (recentes >= 3 && (!e.derniereRegularite || t - e.derniereRegularite >= SEMAINE)) {
      pieces = 15;                       // trois séries dans la semaine
      e.derniereRegularite = t;
      e.pieces = (e.pieces || 0) + pieces;
    }
    MathsProfils.setEtat(id, e);
    return { pieces: pieces, sessionsSemaine: recentes };
  }

  /* ===================================================================== */
  /* Le jardin : une plante par compétence                                 */
  /* ===================================================================== */
  function jardin(id) {
    var cat = (global.MathsExos && MathsExos.catalogue) || [];
    var t = maintenant();
    return cat.map(function (c) {
      var m = maitrise(id, c.code);
      var jamais = !m.tentatives;
      var jours = m.derniere ? Math.floor((t - m.derniere) / 86400000) : null;
      var perte = Math.max(0, (m.meilleur || 0) - m.score);
      return {
        code: c.code, libelle: c.libelle, chapitre: c.chapitre, niveau: c.niveau,
        score: Math.round(m.score), meilleur: Math.round(m.meilleur || 0),
        palier: m.palier, tentatives: m.tentatives, reussites: m.reussites,
        ceinture: ceintureAffichee(m), jamais: jamais, jours: jours,
        // « Besoin d'arrosage » : ce qu'on a perdu, et depuis combien de temps.
        besoin: jamais ? 0 : perte + Math.min(30, (jours || 0) / 2),
        // L'état de la plante, de 0 (graine) à 4 (en fleur).
        pousse: jamais ? 0 : Math.min(4, 1 + Math.floor(m.score / 25))
      };
    });
  }

  // Les compétences à réviser en priorité : celles qui ont le plus fané.
  // Sinon, celles qui n'ont jamais été travaillées (dans l'ordre du catalogue).
  function aReviser(id, n) {
    n = n || 3;
    var j = jardin(id);
    var vues = j.filter(function (x) { return !x.jamais; })
                .sort(function (a, b) { return b.besoin - a.besoin; });
    var codes = vues.slice(0, n).map(function (x) { return x.code; });
    if (codes.length < n) {
      j.filter(function (x) { return x.jamais; }).forEach(function (x) {
        if (codes.length < n) codes.push(x.code);
      });
    }
    return codes;
  }

  // Résumé pour l'accueil : XP, pièces, ceintures obtenues, jardin à arroser.
  function resume(id) {
    var e = MathsProfils.etat(id);
    var j = jardin(id);
    var parCeinture = {};
    j.forEach(function (x) {
      if (x.jamais) return;
      parCeinture[x.ceinture.nom] = (parCeinture[x.ceinture.nom] || 0) + 1;
    });
    return {
      xp: e.xp || 0, pieces: e.pieces || 0,
      travaillees: j.filter(function (x) { return !x.jamais; }).length,
      total: j.length,
      ceintures: parCeinture,
      aArroser: j.filter(function (x) { return !x.jamais && x.besoin > 5; }).length
    };
  }

  /* ===================================================================== */
  global.MathsProgression = {
    neuve: neuve, maitrise: maitrise, scoreCourant: scoreCourant,
    ceinture: ceinture, ceintureAffichee: ceintureAffichee, ceintures: CEINTURES,
    apresQuestion: apresQuestion, finSession: finSession,
    jardin: jardin, aReviser: aReviser, resume: resume
  };

})(window);
