/*
 * L'émulation entre profils (SPEC §10).
 *
 * Le principe directeur du SPEC est ici une contrainte, pas une préférence :
 * avec des niveaux scolaires différents, **la comparaison directe est injuste
 * et démotivante**. On ne classe donc JAMAIS par score absolu. Trois mécaniques,
 * dans l'ordre croissant d'efficacité constatée :
 *
 *   1. le CLASSEMENT HEBDOMADAIRE se fait en points de progression, chacune sur
 *      son propre programme : la question devient « qui a le plus progressé
 *      cette semaine », pas « qui est la meilleure en maths » ;
 *
 *   2. le DÉFI est généré au palier de la DÉFIÉE, jamais à celui de la
 *      défieuse — sinon une grande sœur écraserait la petite sans effort. Les
 *      deux jouent exactement la même série, ce que garantit la graine ;
 *
 *   3. l'OBJECTIF COMMUN n'est atteint que si TOUTES y arrivent. C'est la seule
 *      mécanique qui crée de l'entraide au lieu de la rivalité — et d'après le
 *      SPEC, la plus efficace du lot.
 */
(function (global) {
  'use strict';

  var SEMAINE = 7 * 24 * 3600 * 1000;

  function admin() {
    var a = MathsProfils.lire('mv.admin', null) || {};
    if (!a.defis) a.defis = [];
    if (!a.objectif) a.objectif = { series: 3, recompense: 'une sortie tous ensemble' };
    return a;
  }
  function setAdmin(a) { MathsProfils.ecrire('mv.admin', a); }
  function actifs() {
    return MathsProfils.profils().filter(function (p) { return !p.archive; });
  }

  /* ===================================================================== */
  /* 1. Le classement hebdomadaire, en progression                         */
  /* ===================================================================== */
  /* La progression d'une élève, ce sont les points de maîtrise gagnés cette
     semaine, rapportés au nombre de compétences de SON niveau : autrement dit
     « de combien de points son jardin a avancé ». Une 6ème et une 2nde peuvent
     alors se comparer sans que ça n'ait rien d'injuste. */
  function progressionSemaine(id) {
    var t = Date.now();
    var gains = 0;
    MathsProfils.journal(id).forEach(function (e) {
      if (e.type !== 'tentative' || t - e.t > SEMAINE) return;
      gains += e.xp || 0;
    });
    var p = MathsProfils.profil(id);
    var comps = ((global.MathsExos && MathsExos.catalogue) || [])
      .filter(function (c) { return !p || c.niveau === p.niveau; });
    var n = Math.max(1, comps.length);
    return { points: gains, pourcent: Math.round(10 * gains / n) / 10, comps: n };
  }

  function classement() {
    return actifs().map(function (p) {
      var pr = progressionSemaine(p.id);
      return { profil: p, pourcent: pr.pourcent, points: pr.points };
    }).sort(function (a, b) { return b.pourcent - a.pourcent; });
  }

  /* ===================================================================== */
  /* 2. Les défis                                                          */
  /* ===================================================================== */
  function defis() { return admin().defis; }

  function defisDe(id) {
    return defis().filter(function (d) { return d.de === id || d.vers === id; })
      .sort(function (a, b) { return b.date - a.date; });
  }
  function recus(id) {
    return defis().filter(function (d) { return d.vers === id && d.statut === 'lance'; });
  }

  // La défieuse choisit une compétence et une mise ; la série sera tirée au
  // palier de la défiée.
  function lancer(de, vers, comp, mise) {
    mise = Math.max(0, parseInt(mise, 10) || 0);
    var etat = MathsProfils.etat(de);
    if ((etat.pieces || 0) < mise) {
      return { ok: false, raison: 'Il te manque des pièces pour cette mise.' };
    }
    if (de === vers) return { ok: false, raison: 'On ne se défie pas soi-même.' };
    var palierVers = MathsProgression.maitrise(vers, comp).palier || 1;
    var d = {
      id: 'd' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      de: de, vers: vers, comp: comp, mise: mise,
      graine: MathsAlea.graine(),          // la série sera strictement identique
      palier: palierVers,                  // …et au palier de la DÉFIÉE
      nb: 6, date: Date.now(), statut: 'lance',
      scoreDe: null, scoreVers: null
    };
    etat.pieces -= mise;                   // la mise part en réserve
    MathsProfils.setEtat(de, etat);
    var a = admin();
    a.defis.push(d);
    setAdmin(a);
    return { ok: true, defi: d };
  }

  function trouve(defiId) {
    return defis().filter(function (d) { return d.id === defiId; })[0] || null;
  }

  /* Enregistre le score d'une des deux joueuses. Quand les deux ont joué, on
     tranche : si la défiée fait au moins aussi bien, elle empoche le double ;
     sinon la défieuse récupère sa mise. */
  function enregistre(defiId, profilId, justes, total) {
    var a = admin();
    var d = a.defis.filter(function (x) { return x.id === defiId; })[0];
    if (!d) return null;
    var score = total ? justes / total : 0;
    if (profilId === d.de) d.scoreDe = score;
    else if (profilId === d.vers) d.scoreVers = score;
    else return null;

    var fini = d.scoreDe !== null && d.scoreVers !== null;
    if (fini) {
      d.statut = 'termine';
      d.gagnant = d.scoreVers >= d.scoreDe ? d.vers : d.de;
      var gain = d.gagnant === d.vers ? d.mise * 2 : d.mise;
      var e = MathsProfils.etat(d.gagnant);
      e.pieces = (e.pieces || 0) + gain;
      if (d.gagnant === d.vers) e.defisGagnes = (e.defisGagnes || 0) + 1;
      MathsProfils.setEtat(d.gagnant, e);
      d.gain = gain;
    } else if (profilId === d.de) {
      d.statut = 'lance';                  // la défieuse a joué, à l'autre de jouer
    }
    setAdmin(a);
    return d;
  }

  function annuler(defiId) {
    var a = admin();
    var d = a.defis.filter(function (x) { return x.id === defiId; })[0];
    if (!d || d.statut === 'termine') return false;
    var e = MathsProfils.etat(d.de);
    e.pieces = (e.pieces || 0) + d.mise;   // la mise revient
    MathsProfils.setEtat(d.de, e);
    d.statut = 'annule';
    setAdmin(a);
    return true;
  }

  /* ===================================================================== */
  /* 3. L'objectif commun                                                  */
  /* ===================================================================== */
  function objectif() { return admin().objectif; }
  function setObjectif(o) {
    var a = admin();
    if (o.series !== undefined) a.objectif.series = Math.max(1, parseInt(o.series, 10) || 1);
    if (o.recompense !== undefined) a.objectif.recompense = o.recompense;
    setAdmin(a);
  }

  // Où en est la famille cette semaine ? Le tout ne compte que si CHACUNE y est.
  function etatObjectif() {
    var o = objectif();
    var t = Date.now();
    var lignes = actifs().map(function (p) {
      var n = MathsProfils.journal(p.id).filter(function (e) {
        return e.type === 'session' && t - e.t < SEMAINE;
      }).length;
      return { profil: p, series: n, atteint: n >= o.series };
    });
    return {
      cible: o.series, recompense: o.recompense, lignes: lignes,
      atteint: lignes.length > 0 && lignes.every(function (l) { return l.atteint; })
    };
  }

  global.MathsDefis = {
    progressionSemaine: progressionSemaine, classement: classement,
    defis: defis, defisDe: defisDe, recus: recus, lancer: lancer,
    trouve: trouve, enregistre: enregistre, annuler: annuler,
    objectif: objectif, setObjectif: setObjectif, etatObjectif: etatObjectif
  };

})(window);
