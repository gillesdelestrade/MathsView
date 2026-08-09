/*
 * Les trophées (SPEC §6).
 *
 * Deux règles, et elles font toute la différence :
 *
 *   1. ils sont NARRATIFS. Jamais « 100 exercices réussis » — ça, c'est un
 *      compteur, et un compteur ne raconte rien. « Revenir le lendemain sur une
 *      notion ratée et la réussir », voilà une histoire ;
 *   2. le parent peut en attribuer à la main, et même en inventer sur le
 *      moment (§9.4), pour récompenser ce qu'aucun algorithme ne verra jamais —
 *      avoir expliqué une correction à sa sœur, s'être accrochée un soir de
 *      fatigue.
 *
 * Chaque test lit le JOURNAL, jamais un compteur mis à jour au fil de l'eau :
 * si la règle d'un trophée change, il suffit de relancer l'évaluation, et
 * l'historique complet est réexaminé.
 */
(function (global) {
  'use strict';

  var JOUR = 86400000;

  function jourDe(t) {
    var d = new Date(t);
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  }
  function tentatives(j) {
    return j.filter(function (e) { return e.type === 'tentative'; });
  }
  function sessions(j) {
    return j.filter(function (e) { return e.type === 'session'; });
  }
  function comp(code) {
    return ((global.MathsExos && MathsExos.catalogue) || [])
      .filter(function (c) { return c.code === code; })[0];
  }

  var LISTE = [
    { id: 'sans-filet', nom: 'Sans filet', emoji: '🎯',
      desc: '5 bonnes réponses d\'affilée sans utiliser d\'indice', pieces: 15,
      test: function (j) {
        var n = 0, out = false;
        tentatives(j).forEach(function (e) {
          n = (e.ok && !e.indices) ? n + 1 : 0;
          if (n >= 5) out = true;
        });
        return out;
      } },

    { id: 'revanche', nom: 'Revanche', emoji: '🔁',
      desc: 'Rater une notion, revenir le lendemain et la réussir', pieces: 20,
      test: function (j) {
        var rate = {}, out = false;
        tentatives(j).forEach(function (e) {
          if (!e.ok) { if (!rate[e.comp]) rate[e.comp] = e.t; return; }
          if (rate[e.comp] && jourDe(e.t) !== jourDe(rate[e.comp])) out = true;
        });
        return out;
      } },

    { id: 'archeologue', nom: 'Archéologue', emoji: '🏺',
      desc: 'Réviser une compétence laissée de côté depuis plus de 3 semaines',
      pieces: 15,
      test: function (j) {
        var vu = {}, out = false;
        tentatives(j).forEach(function (e) {
          if (vu[e.comp] && e.t - vu[e.comp] > 21 * JOUR) out = true;
          vu[e.comp] = e.t;
        });
        return out;
      } },

    /* « Le pont » : réussir un exercice dont la compétence s'appuie sur une
       autre d'un CHAPITRE différent. Ainsi résoudre f(x) < k (chapitre
       Fonctions) demande de savoir écrire un intervalle (chapitre Nombres) —
       c'est exactement le genre de passerelle qu'on veut saluer. */
    { id: 'le-pont', nom: 'Le pont', emoji: '🌉',
      desc: 'Réussir un exercice qui combine deux chapitres différents', pieces: 25,
      test: function (j) {
        return tentatives(j).some(function (e) {
          if (!e.ok) return false;
          var c = comp(e.comp);
          if (!c || !c.prerequis || !c.prerequis.length) return false;
          return c.prerequis.some(function (p) {
            var q = comp(p);
            return q && q.chapitre && q.chapitre !== c.chapitre;
          });
        });
      } },

    { id: 'leve-tot', nom: 'Lève-tôt', emoji: '🌅',
      desc: 'Une série terminée avant 9 h', pieces: 10,
      test: function (j) {
        return sessions(j).some(function (e) { return new Date(e.t).getHours() < 9; });
      } },

    { id: 'marathon', nom: 'Marathon', emoji: '🏃',
      desc: 'Une série par jour pendant 5 jours', pieces: 30,
      test: function (j) {
        var jours = {};
        sessions(j).forEach(function (e) {
          var d = new Date(e.t);
          jours[Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / JOUR)] = 1;
        });
        var l = Object.keys(jours).map(Number).sort(function (a, b) { return a - b; });
        var suite = 1;
        for (var i = 1; i < l.length; i++) {
          suite = (l[i] === l[i - 1] + 1) ? suite + 1 : 1;
          if (suite >= 5) return true;
        }
        return l.length >= 5 && suite >= 5;
      } },

    { id: 'ceinture-noire', nom: 'Ceinture noire', emoji: '🥋',
      desc: 'Atteindre la ceinture noire sur une compétence', pieces: 40,
      test: function (j, etat) {
        var m = etat.maitrises || {};
        return Object.keys(m).some(function (k) { return (m[k].meilleur || 0) >= 90; });
      } },

    /* Deviendra « un boss de chapitre réussi sans aucune erreur » quand les boss
       existeront (lot 7). En attendant, la même exigence sur une série longue. */
    { id: 'sans-erreur', nom: 'Parcours parfait', emoji: '💎',
      desc: 'Une série de 8 questions ou plus sans aucune erreur', pieces: 50,
      test: function (j) {
        return sessions(j).some(function (e) { return e.n >= 8 && e.justes === e.n; });
      } },

    { id: 'le-prof', nom: 'Le prof', emoji: '👩‍🏫',
      desc: 'Expliquer une correction à sa sœur', pieces: 25, manuel: true }
  ];

  /* ===================================================================== */
  /* Évaluation                                                            */
  /* ===================================================================== */
  function acquis(etat) {
    return (etat.trophees || []).map(function (t) { return t.id; });
  }

  // Passe tout le journal en revue et crédite les trophées nouvellement gagnés.
  // Appelé en fin de série ; rejouable sans risque (un trophée déjà obtenu est
  // ignoré).
  function evalue(id) {
    var etat = MathsProfils.etat(id);
    var j = MathsProfils.journal(id);
    var deja = acquis(etat);
    var neufs = [];

    LISTE.forEach(function (tr) {
      if (tr.manuel || !tr.test || deja.indexOf(tr.id) >= 0) return;
      var gagne = false;
      try { gagne = !!tr.test(j, etat); }
      catch (e) { console.warn('Trophée « ' + tr.id + ' » : ' + e.message); }
      if (!gagne) return;
      etat.trophees.push({ id: tr.id, obtenuLe: Date.now() });
      etat.pieces = (etat.pieces || 0) + tr.pieces;
      neufs.push(tr);
    });

    if (neufs.length) MathsProfils.setEtat(id, etat);
    return neufs;
  }

  // Attribution manuelle par le parent (§9.4).
  function attribue(id, tropheeId) {
    var tr = LISTE.filter(function (t) { return t.id === tropheeId; })[0];
    if (!tr) return null;
    var etat = MathsProfils.etat(id);
    if (acquis(etat).indexOf(tropheeId) >= 0) return null;
    etat.trophees.push({ id: tr.id, obtenuLe: Date.now(), manuel: true });
    etat.pieces = (etat.pieces || 0) + tr.pieces;
    MathsProfils.setEtat(id, etat);
    return tr;
  }

  // Un trophée inventé sur le moment : nom, description, pièces (§9.4).
  function libre(id, infos) {
    var etat = MathsProfils.etat(id);
    var tr = {
      id: 'libre-' + Date.now(), nom: infos.nom || 'Trophée', emoji: infos.emoji || '🏅',
      desc: infos.desc || '', pieces: Math.max(0, parseInt(infos.pieces, 10) || 0),
      libre: true
    };
    etat.trophees.push({ id: tr.id, obtenuLe: Date.now(), manuel: true,
                         nom: tr.nom, desc: tr.desc, emoji: tr.emoji, pieces: tr.pieces });
    etat.pieces = (etat.pieces || 0) + tr.pieces;
    MathsProfils.setEtat(id, etat);
    return tr;
  }

  function definition(tropheeId, obtenu) {
    var tr = LISTE.filter(function (t) { return t.id === tropheeId; })[0];
    if (tr) return tr;
    // Un trophée libre porte sa définition dans l'entrée du profil.
    if (obtenu && obtenu.nom) {
      return { id: obtenu.id, nom: obtenu.nom, desc: obtenu.desc || '',
               emoji: obtenu.emoji || '🏅', pieces: obtenu.pieces || 0, libre: true };
    }
    return { id: tropheeId, nom: tropheeId, desc: '', emoji: '🏅', pieces: 0 };
  }

  // Ce qu'un profil a obtenu, prêt à afficher.
  function obtenus(id) {
    var etat = MathsProfils.etat(id);
    return (etat.trophees || []).map(function (o) {
      var d = definition(o.id, o);
      return { id: o.id, nom: d.nom, desc: d.desc, emoji: d.emoji,
               pieces: d.pieces, obtenuLe: o.obtenuLe, manuel: !!o.manuel };
    });
  }

  global.MathsTrophees = {
    liste: function () { return LISTE.slice(); },
    evalue: evalue, attribue: attribue, libre: libre,
    obtenus: obtenus, definition: definition
  };
  // Le SPEC les nomme MathsExos.trophees : on garde cette adresse.
  if (global.MathsExos) global.MathsExos.trophees = LISTE;

})(window);
