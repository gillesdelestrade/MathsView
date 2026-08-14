/*
 * MathsReponse — normalisation et comparaison des réponses (SPEC §2.4).
 *
 * Règle d'or : une bonne réponse refusée pour une virgule est une source
 * d'abandon immédiat. On normalise donc largement AVANT de comparer, et on
 * distingue trois issues :
 *
 *     ok: true                    la réponse est juste ;
 *     tolerance                   quand la question demande une MESURE lue sur
 *                                 une figure : l'écart accepté, en unités de la
 *                                 réponse (2 pour « à deux degrés près »).
 *     forme: 'approchee'          juste au millième près, mais on attendait la
 *                                 valeur exacte (1/3, pas 0,33) ;
 *     forme: 'malformee'          la saisie n'a pas pu être lue — ce n'est PAS
 *                                 un échec, on laisse réessayer sans pénalité.
 *
 * Ce que l'on tolère partout : les espaces (insécables comprises), la virgule
 * décimale, les trois sortes de tirets, les préfixes « x = », « S = », « x ∈ ».
 *
 * Les intervalles sont comparés par STRUCTURE, jamais par leur chaîne : les
 * bornes et le sens des crochets, rien d'autre. « ]-2;2[ », « ] −2 ; 2 [ » et
 * « ]−2,0 ; 2[ » sont donc la même réponse.
 */
(function (global) {
  'use strict';

  var MOINS   = /[−–—‐‑]/g;   // − – — ‐ ‑  →  -
  var ESPACES = /[\s   ]/g;             // espaces, insécables comprises
  var ACCENTS = /[̀-ͯ]/g;                    // diacritiques décomposés

  /* --------------------------------------------------------------------- */
  /* Normalisation                                                         */
  /* --------------------------------------------------------------------- */
  function normalise(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(ESPACES, '')
      .replace(MOINS, '-')
      .replace(/^(x|y|z|s|t)(=|∈|appartient(a|à)?)/i, '')   // « x = », « S = », « x ∈ »
      .replace(/^=/, '');
  }

  // Pour le type `texte` : on ignore aussi la casse et les accents.
  function sansAccent(s) {
    var t = normalise(s).toLowerCase();
    return t.normalize ? t.normalize('NFD').replace(ACCENTS, '') : t;
  }

  /* --------------------------------------------------------------------- */
  /* Les nombres                                                           */
  /*                                                                       */
  /* On accepte : 12   −2,5   3/4   −3/4   √5   −√5   √5/2   2π   +∞        */
  /* --------------------------------------------------------------------- */
  var INFINI = /^[+-]?(∞|inf(ini|inity)?)$/i;

  function unFacteur(t) {                // un nombre, √n, π, ou 2π
    if (!t) return null;
    if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t);
    var m = /^√(\d+(\.\d+)?)$/.exec(t);              // √5
    if (m) return Math.sqrt(parseFloat(m[1]));
    m = /^∛(\d+(\.\d+)?)$/.exec(t);                  // ∛5
    if (m) return Math.cbrt(parseFloat(m[1]));
    if (/^(π|pi)$/i.test(t)) return Math.PI;
    m = /^(\d+(\.\d+)?)(π|pi)$/i.exec(t);            // 2π
    if (m) return parseFloat(m[1]) * Math.PI;
    return null;
  }

  // Renvoie { v } ou null si la saisie n'est pas un nombre lisible.
  function nombre(saisie) {
    var s = normalise(saisie).replace(/,/g, '.');
    if (s === '') return null;
    if (INFINI.test(s)) return { v: s.charAt(0) === '-' ? -Infinity : Infinity };

    var sgn = 1;
    while (s.charAt(0) === '-' || s.charAt(0) === '+') {
      if (s.charAt(0) === '-') sgn = -sgn;
      s = s.slice(1);
    }
    var parts = s.split('/');
    if (parts.length > 2) return null;
    var n = unFacteur(parts[0]);
    if (n === null) return null;
    if (parts.length === 2) {
      var d = unFacteur(parts[1]);
      if (d === null || d === 0) return null;
      n = n / d;
    }
    return { v: sgn * n };
  }

  // Un nombre « qui tombe juste » : au plus 4 décimales. Sert à décider si une
  // valeur approchée mérite le message dédié plutôt qu'un simple « faux ».
  function tombeJuste(v) {
    return isFinite(v) && Math.abs(v * 10000 - Math.round(v * 10000)) < 1e-6;
  }

  /* --------------------------------------------------------------------- */
  /* Les intervalles                                                       */
  /*                                                                       */
  /* Un morceau vaut { a, b, oa, ob } — oa/ob disent si la borne est EXCLUE, */
  /* exactement comme les morceaux du pool de fonctions.                    */
  /* --------------------------------------------------------------------- */
  var VIDE  = /^(∅|vide|aucunesolution|aucune|\{\})$/i;
  var REELS = /^(ℝ|r|ir|reels?)$/i;

  /* La virgule est ambiguë : séparateur pour les uns (« [1,5] »), décimale pour
     les autres (« {0,5} »). Plutôt que de trancher — et de refuser une bonne
     réponse une fois sur deux — on LIT LES DEUX FAÇONS et on accepte si l'une
     des deux tombe juste. Le point-virgule, lui, est sans ambiguïté et gagne
     toujours. */
  function coupe(inner, virguleSepare) {
    if (inner.indexOf(';') >= 0) return inner.split(';');
    if (virguleSepare) return inner.split(',');
    return [inner];
  }

  function intervalle(saisie, virguleSepare) {
    var s = normalise(saisie);
    if (s === '') return null;
    if (VIDE.test(s)) return [];

    var parts = s.split(/[∪Uu]/).filter(function (p) { return p !== ''; });
    if (!parts.length) return null;

    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (REELS.test(p)) { out.push({ a: -Infinity, b: Infinity, oa: true, ob: true }); continue; }

      // Un ensemble de points : { −2 ; 2 }
      var m = /^\{(.*)\}$/.exec(p);
      if (m) {
        var pts = coupe(m[1], virguleSepare);
        for (var j = 0; j < pts.length; j++) {
          var v = nombre(pts[j]);
          if (!v) return null;
          out.push({ a: v.v, b: v.v, oa: false, ob: false });
        }
        continue;
      }

      // Un intervalle : [a;b]  ]a;b[  [a;b[  ]a;b]  — et (a;b) toléré.
      m = /^([\[\]\(])(.*)([\[\]\)])$/.exec(p);
      if (!m) return null;
      var deux = coupe(m[2], virguleSepare);
      if (deux.length !== 2) return null;
      var ga = nombre(deux[0]), dr = nombre(deux[1]);
      if (!ga || !dr || dr.v < ga.v) return null;
      out.push({
        a: ga.v, b: dr.v,
        oa: m[1] !== '[' || !isFinite(ga.v),
        ob: m[3] !== ']' || !isFinite(dr.v)
      });
    }
    return out;
  }

  // Les deux lectures possibles d'une saisie (cf. `coupe`), sans doublon.
  function candidats(saisie) {
    var out = [];
    [false, true].forEach(function (sep) {
      var t = intervalle(saisie, sep);
      if (!t) return;
      var cle = JSON.stringify(t);
      if (!out.some(function (u) { return JSON.stringify(u) === cle; })) out.push(t);
    });
    return out.length ? out : null;
  }

  function egal(u, v) {
    if (u === v) return true;                       // ±Infinity compris
    return isFinite(u) && isFinite(v) && Math.abs(u - v) < 1e-9;
  }
  function tri(t) {
    return t.slice().sort(function (m, n) { return (m.a - n.a) || (m.b - n.b); });
  }
  // Deux ensembles sont égaux si, une fois triés, leurs morceaux coïncident.
  function memeEnsemble(A, B) {
    if (!A || !B || A.length !== B.length) return false;
    var x = tri(A), y = tri(B);
    for (var i = 0; i < x.length; i++) {
      if (!egal(x[i].a, y[i].a) || !egal(x[i].b, y[i].b)) return false;
      if (!!x[i].oa !== !!y[i].oa || !!x[i].ob !== !!y[i].ob) return false;
    }
    return true;
  }
  // Mêmes bornes, mais des crochets différents : c'est LA faute du chapitre,
  // elle mérite un message à elle.
  function memesBornes(A, B) {
    if (!A || !B || A.length !== B.length) return false;
    var x = tri(A), y = tri(B);
    for (var i = 0; i < x.length; i++) {
      if (!egal(x[i].a, y[i].a) || !egal(x[i].b, y[i].b)) return false;
    }
    return true;
  }

  /* --------------------------------------------------------------------- */
  /* La validation, par type de question                                   */
  /* --------------------------------------------------------------------- */
  function malformee(msg) {
    return { ok: false, forme: 'malformee',
             message: msg || 'Je n\'ai pas compris ta réponse — vérifie l\'écriture.' };
  }
  function juste(msg) { return { ok: true, forme: 'exacte', message: msg || '' }; }
  function faux(msg) { return { ok: false, forme: 'exacte', message: msg || '' }; }

  function valide(q, saisie, ctx) {
    switch (q.type) {

      case 'qcm':
      case 'vraifaux':
        if (saisie === null || saisie === undefined || saisie === '') {
          return malformee('Choisis une réponse.');
        }
        return Number(saisie) === Number(q.correct) ? juste() : faux();

      /* Cases à cocher : la réponse est un ENSEMBLE d'indices, comparé comme
         tel. Le message distingue « il en manque » de « il y en a trop » —
         c'est une aide réelle, qui ne donne pas la réponse pour autant. */
      case 'qcm-multi': {
        var att = (q.corrects || []).map(Number).sort(function (u, v) { return u - v; });
        var lu = [].concat(saisie || []).map(Number).sort(function (u, v) { return u - v; });
        if (!lu.length) return malformee('Coche au moins une case.');
        var memes = lu.length === att.length && lu.every(function (v, i) { return v === att[i]; });
        if (memes) return juste();
        var tousDedans = lu.every(function (v) { return att.indexOf(v) >= 0; });
        var toutTrouve = att.every(function (v) { return lu.indexOf(v) >= 0; });
        return faux(tousDedans ? 'Ce que tu as coché est juste, mais il en manque.'
                  : toutTrouve ? 'Tu as bien tout trouvé, mais tu en as coché en trop.'
                  : '');
      }

      case 'jsx':
        return q.verifie(ctx && ctx.board, ctx) ? juste() : faux();

      case 'texte': {
        if (normalise(saisie) === '') return malformee('Écris ta réponse.');
        var cible = sansAccent(saisie);
        var ok = [].concat(q.reponse).some(function (r) { return sansAccent(r) === cible; });
        return ok ? juste() : faux();
      }

      case 'intervalle': {
        var att = q.morceaux ||
                  (Array.isArray(q.reponse) ? q.reponse : intervalle(q.reponse, false));
        var lus = candidats(saisie);
        if (!lus) {
          return malformee('Je n\'ai pas compris — écris par exemple ]−2 ; 5] , ' +
                           '[0 ; +∞[ , {3} ou ∅.');
        }
        if (lus.some(function (l) { return memeEnsemble(l, att); })) return juste();
        return faux(lus.some(function (l) { return memesBornes(l, att); })
          ? 'Les bornes sont bonnes — regarde le sens des crochets.' : '');
      }

      default: {                                     // 'nombre'
        var n = nombre(saisie);
        if (!n) {
          return malformee('Je n\'ai pas compris ce nombre — tu peux écrire 2,5 ou 5/2.');
        }
        var att2 = (q.reponse && typeof q.reponse === 'object')
          ? q.reponse.n / q.reponse.d : Number(q.reponse);
        /* Une valeur LUE SUR UNE FIGURE ne tombera jamais au millionième : quand
           la question annonce une tolérance, c'est qu'elle demande une mesure,
           pas un calcul. Sans elle, un élève qui a parfaitement construit et
           correctement lu son rapporteur serait compté faux pour un demi-degré. */
        var tol = Math.max(1e-9, Number(q.tolerance) || 0);
        if (Math.abs(n.v - att2) <= tol) return juste();
        // Une valeur arrondie là où l'exact était attendu : message dédié,
        // plutôt qu'un « faux » sec qui laisserait l'élève perplexe.
        if (!q.tolerance && !tombeJuste(att2) &&
            Math.abs(n.v - att2) <= Math.max(5e-3, Math.abs(att2) * 5e-3)) {
          return { ok: false, forme: 'approchee',
                   message: 'Donne la valeur exacte, pas une valeur approchée.' };
        }
        return faux();
      }
    }
  }

  global.MathsReponse = {
    normalise: normalise, sansAccent: sansAccent,
    nombre: nombre, intervalle: intervalle, candidats: candidats,
    memeEnsemble: memeEnsemble, memesBornes: memesBornes,
    valide: valide
  };

})(window);
