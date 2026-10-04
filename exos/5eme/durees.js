/*
 * durees — convertir des durées (leçon 5ème « Convertir des durées »).
 *
 * Les durées ne se convertissent pas de 10 en 10 : on compte des paquets de
 * 60 (secondes, minutes) puis de 24 (heures). La correction suit la leçon :
 * vers une unité plus grande on DIVISE et le reste garde l'ancienne unité,
 * vers une unité plus petite on MULTIPLIE, et chaque étape est posée avec les
 * nombres de l'énoncé (« 10 000 = 60 × 166 + 40 »).
 *
 * Les paliers :
 *   P1  une seule conversion, sans reste : min → s, h → min, h → s, et
 *       s → min quand ça tombe juste ;
 *   P2  le reste apparaît (250 min = 4 h 10 min), les durées composées se
 *       ramènent à une unité (3 h 20 min = 200 min), et le piège de la
 *       virgule (1,5 h = 1 h 30 min, pas 1 h 50) ;
 *   P3  les jours entrent en jeu, les décompositions en deux étapes
 *       (10 000 s = 2 h 46 min 40 s), et « laquelle est la plus longue ? » ;
 *   P4  les grands nombres : un million de secondes en jours, et une durée
 *       en j h min s à écrire tout en secondes.
 *
 * Une décomposition se répond en texte : « 2 h 46 min 40 s », avec ou sans
 * espaces, « mn » ou « min », les zéros omis ; une conversion vers une seule
 * unité se répond par un nombre.
 */
(function () {
  'use strict';

  var NOM = { j: 'j', h: 'h', m: 'min', s: 's' };
  var LONG = { j: 'jours', h: 'heures', m: 'minutes', s: 'secondes' };
  var MOD = { s: 60, m: 60, h: 24 };               // combien pour passer au suivant
  var SUIV = { s: 'm', m: 'h', h: 'j' }, PREC = { j: 'h', h: 'm', m: 's' };
  var RANG = { s: 0, m: 1, h: 2, j: 3 };
  var ORDRE = ['j', 'h', 'm', 's'];
  var FACT = { j: 86400, h: 3600, m: 60, s: 1 };   // en secondes

  function fmtN(n) {
    var s = String(Math.round(n)), out = '';
    while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
    return s + out;
  }
  function texN(n) {
    var s = String(Math.round(n)), out = '';
    while (s.length > 3) { out = '\\,' + s.slice(-3) + out; s = s.slice(0, -3); }
    return s + out;
  }
  function b(t) { return '<b>' + t + '</b>'; }
  function total(v) { return (v.s || 0) + 60 * (v.m || 0) + 3600 * (v.h || 0) + 86400 * (v.j || 0); }
  function duree(v) {
    var p = [];
    ORDRE.forEach(function (u) { if (v[u]) p.push(fmtN(v[u]) + ' ' + NOM[u]); });
    return p.length ? p.join(' ') : '0 s';
  }
  function dureeTex(v) {
    var p = [];
    ORDRE.forEach(function (u) { if (v[u]) p.push(texN(v[u]) + '~\\text{' + NOM[u] + '}'); });
    return p.length ? p.join('~') : '0~\\text{s}';
  }
  // Les écritures acceptées pour « 2 h 46 min 40 s » : les unités s'abrègent
  // de plusieurs façons, et les espaces sont déjà ignorés par le lecteur.
  function formes(v) {
    var out = {}, parts = ORDRE.filter(function (u) { return v[u]; });
    var variantes = { j: ['j', 'jour', 'jours'], h: ['h', 'heure', 'heures'], m: ['min', 'mn', 'm', 'minute', 'minutes'], s: ['s', 'sec', 'seconde', 'secondes'] };
    function combine(i, acc) {
      if (i === parts.length) { out[acc.join(' ')] = 1; return; }
      var u = parts[i];
      variantes[u].forEach(function (x) { combine(i + 1, acc.concat([fmtN(v[u]) + ' ' + x])); });
    }
    if (parts.length) combine(0, []);
    // « 4h10 » : les minutes sans unité quand elles terminent l'écriture
    if (parts.length >= 2 && parts[parts.length - 1] === 'm' && parts[parts.length - 2] === 'h') {
      out[(v.j ? fmtN(v.j) + ' j ' : '') + fmtN(v.h) + ' h ' + fmtN(v.m)] = 1;
      out[(v.j ? fmtN(v.j) + ' j ' : '') + fmtN(v.h) + ' h ' + (v.m < 10 ? '0' : '') + fmtN(v.m)] = 1;
    }
    return Object.keys(out);
  }
  // La décomposition complète d'une durée (toutes les unités en dessous de leur maximum).
  function decompose(v) {
    var cur = { s: v.s || 0, m: v.m || 0, h: v.h || 0, j: v.j || 0 }, lignes = [];
    ['s', 'm', 'h'].forEach(function (u) {
      if (cur[u] < MOD[u]) return;
      var q = Math.floor(cur[u] / MOD[u]), r = cur[u] % MOD[u], n = SUIV[u], av = cur[u];
      cur[u] = r; cur[n] += q;
      lignes.push(fmtN(av) + ' ' + NOM[u] + ' : combien de paquets de ' + MOD[u] + ' ? On ' + b('divise') + ' : ' +
                  fmtN(av) + ' ÷ ' + MOD[u] + ' = ' + fmtN(q) + ' reste ' + fmtN(r) + ', c\'est-à-dire ' +
                  b(fmtN(av) + ' = ' + MOD[u] + ' × ' + fmtN(q) + ' + ' + fmtN(r)) + '. Donc ' + fmtN(av) + ' ' + NOM[u] +
                  ' = ' + fmtN(q) + ' ' + NOM[n] + (r ? ' ' + fmtN(r) + ' ' + NOM[u] : '') +
                  (cur[n] !== q ? ', et avec les ' + fmtN(cur[n] - q) + ' ' + NOM[n] + ' déjà là : ' + fmtN(cur[n]) + ' ' + NOM[n] : '') + '.');
    });
    return { v: cur, lignes: lignes };
  }
  // Tout en une seule unité, de haut en bas : on multiplie.
  function vide(v, cible) {
    var cur = { s: v.s || 0, m: v.m || 0, h: v.h || 0, j: v.j || 0 }, lignes = [];
    ['j', 'h', 'm'].forEach(function (u) {
      if (RANG[u] <= RANG[cible] || !cur[u]) return;
      var n = PREC[u], prod = cur[u] * MOD[n], deja = cur[n];
      lignes.push('Chaque ' + { j: 'jour', h: 'heure', m: 'minute' }[u] + ' vaut ' + MOD[n] + ' ' + NOM[n] + ' : on ' + b('multiplie') +
                  ', ' + fmtN(cur[u]) + ' × ' + MOD[n] + ' = ' + b(fmtN(prod) + ' ' + NOM[n]) +
                  (deja ? ', et avec les ' + fmtN(deja) + ' ' + NOM[n] + ' de l\'énoncé : ' + fmtN(prod) + ' + ' + fmtN(deja) + ' = ' +
                          b(fmtN(prod + deja) + ' ' + NOM[n]) : '') + '.');
      cur[n] += prod; cur[u] = 0;
    });
    return { v: cur, lignes: lignes };
  }

  /* ------------------------------------------------------------------ */
  /* Les quatre formes                                                   */
  /* ------------------------------------------------------------------ */
  // Vers une seule unité : réponse numérique.
  function versUnite(rnd, palier) {
    var v = { j: 0, h: 0, m: 0, s: 0 }, cible;
    if (palier === 1) {
      var k = rnd.entier(0, 3);
      if (k === 0) { v.m = rnd.entier(2, 12); cible = 's'; }
      else if (k === 1) { v.h = rnd.entier(2, 9); cible = 'm'; }
      else if (k === 2) { v.h = rnd.entier(1, 3); cible = 's'; }
      else { v.s = 60 * rnd.entier(2, 15); cible = 'm'; }           // ça tombe juste : on divise
    } else if (palier === 2) {
      if (rnd.booleen(0.6)) { v.h = rnd.entier(1, 9); v.m = rnd.entier(1, 59); cible = 'm'; }
      else { v.m = rnd.entier(1, 20); v.s = rnd.entier(1, 59); cible = 's'; }
    } else if (palier === 3) {
      if (rnd.booleen(0.5)) { v.j = rnd.entier(1, 9); v.h = rnd.entier(0, 23); cible = 'h'; }
      else { v.h = rnd.entier(1, 5); v.m = rnd.entier(0, 59); v.s = rnd.entier(0, 59); cible = 's'; }
    } else {
      v.j = rnd.entier(1, 12); v.h = rnd.entier(0, 23); v.m = rnd.entier(0, 59); v.s = rnd.entier(0, 59);
      cible = rnd.choix(['s', 's', 'm']);
      if (cible === 'm') v.s = 0;                                 // en minutes, il faut que ça tombe juste
    }
    var estDivision = false;
    var r;
    if (v.s && cible === 'm') {                                     // le seul cas où l'on divise
      var q = v.s / 60;
      r = { reponse: q, lignes: ['On va vers une unité plus ' + b('grande') + ' : on ' + b('divise') + ' par 60. ' +
             fmtN(v.s) + ' ÷ 60 = ' + fmtN(q) + ', sans reste.'] };
      estDivision = true;
    } else {
      var w = vide(v, cible);
      r = { reponse: w.v[cible], lignes: w.lignes };
    }
    r.lignes.push('D\'où ' + duree(v) + ' = ' + b(fmtN(r.reponse) + ' ' + NOM[cible]) + '.');
    return {
      enonce: 'Convertis cette durée en ' + b(LONG[cible]) + ' :',
      tex: dureeTex(v) + ' = \\ldots~\\text{' + NOM[cible] + '}',
      type: 'nombre',
      reponse: r.reponse,
      unite: NOM[cible],
      etapes: r.lignes,
      indices: [
        estDivision ? 'Vers une unité plus grande, on divise : combien de paquets de 60 secondes ?'
                    : 'Vers une unité plus petite, il en faut davantage : on multiplie.',
        '1 j = 24 h, 1 h = 60 min, 1 min = 60 s.'
      ],
      duree: palier >= 3 ? 75 : 50
    };
  }

  // En j, h, min et s : réponse en texte.
  function versDecomposee(rnd, palier) {
    var v = { j: 0, h: 0, m: 0, s: 0 }, unites;
    if (palier <= 2) {
      if (rnd.booleen(0.5)) { v.m = rnd.entier(61, 400); if (v.m % 60 === 0) v.m += 7; unites = 'heures et minutes'; }
      else { v.s = rnd.entier(61, 599); if (v.s % 60 === 0) v.s += 5; unites = 'minutes et secondes'; }
    } else if (palier === 3) {
      var k3 = rnd.entier(0, 2);
      if (k3 === 0) { v.s = rnd.entier(3700, 30000); unites = 'heures, minutes et secondes'; }
      else if (k3 === 1) { v.h = rnd.entier(25, 200); unites = 'jours et heures'; }
      else { v.m = rnd.entier(1500, 5000); unites = 'jours, heures et minutes'; }
    } else {
      v.s = rnd.booleen(0.4) ? 1000000 : rnd.entier(100000, 2000000);
      unites = 'jours, heures, minutes et secondes';
    }
    var d = decompose(v);
    d.lignes.push('D\'où ' + duree(v) + ' = ' + b(duree(d.v)) + '.');
    return {
      enonce: 'Écris cette durée en ' + b(unites) + ' (par exemple « 2 h 5 min 30 s ») :',
      tex: dureeTex(v),
      type: 'texte',
      reponse: formes(d.v),
      etapes: d.lignes,
      indices: [
        'Vers une unité plus grande, on divise par 60 (ou par 24) : le quotient change d\'unité, le reste garde la sienne.',
        'Sur une montre, chaque unité fait moins d\'un tour : 0 à 59 s, 0 à 59 min, 0 à 23 h.'
      ],
      duree: palier >= 4 ? 90 : 60
    };
  }

  // Le piège de la virgule : 1,5 h n'est pas 1 h 50 min.
  function piegeVirgule(rnd) {
    var entier = rnd.entier(1, 5);
    var frac = rnd.choix([{ t: '5', part: 30 }, { t: '25', part: 15 }, { t: '75', part: 45 }]);
    var heures = rnd.booleen(0.7);
    var grande = heures ? 'h' : 'min', petite = heures ? 'min' : 's';
    var bon = entier + ' ' + grande + ' ' + frac.part + ' ' + petite;
    var faux1 = entier + ' ' + grande + ' ' + frac.t + (frac.t.length === 1 ? '0' : '') + ' ' + petite;   // 1 h 50 min
    var faux2 = entier + ' ' + grande + ' ' + frac.t + ' ' + petite;                                     // 1 h 5 min
    var faux3 = (entier * 60 + frac.part) + ' ' + grande;                                                 // l'unité fausse
    var pool = [bon, faux1, faux2, faux3].filter(function (x, i, t) { return t.indexOf(x) === i; });
    var choix = rnd.melange(pool);
    var decimalTxt = entier + ',' + frac.t, decimalTex = entier + '{,}' + frac.t;
    return {
      enonce: 'Combien de temps dure \\(' + decimalTex + '~\\text{' + grande + '}\\) ?',
      type: 'qcm',
      choix: choix,
      correct: choix.indexOf(bon),
      etapes: [
        'La virgule ne découpe pas une ' + (heures ? 'heure' : 'minute') + ' en 100, mais en ' + b('60 ' + petite) + '.',
        '0,' + frac.t + ' ' + grande + ', c\'est ' + { '5': 'la moitié', '25': 'le quart', '75': 'les trois quarts' }[frac.t] +
        ' de 60 ' + petite + ' : ' + b(frac.part + ' ' + petite) + '.',
        'D\'où ' + decimalTxt + ' ' + grande + ' = ' + b(bon) + '.'
      ],
      indices: ['Une demi-heure, c\'est 30 min, pas 50.', 'Découpe en 60, jamais en 100.'],
      duree: 40
    };
  }

  // Laquelle est la plus longue ? On ramène tout à la même unité.
  function plusLongue(rnd, palier) {
    var cands = [], tries = 0;
    while (cands.length < 3 && tries++ < 50) {
      var v = { j: 0, h: 0, m: 0, s: 0 }, k = rnd.entier(0, 3);
      if (k === 0) v.s = rnd.entier(100, 9000);
      else if (k === 1) v.m = rnd.entier(2, 150);
      else if (k === 2) { v.h = rnd.entier(1, 3); v.m = rnd.entier(0, 59); }
      else if (palier >= 4) { v.j = 1; v.h = rnd.entier(0, 3); } else { v.m = rnd.entier(60, 200); }
      var t = total(v);
      if (t > 150000 || cands.some(function (c) { return Math.abs(total(c) - t) < 60; })) continue;
      cands.push(v);
    }
    var totaux = cands.map(total), max = Math.max.apply(null, totaux);
    var choix = cands.map(function (c) { return '\\(' + dureeTex(c) + '\\)'; });
    return {
      enonce: 'Laquelle de ces durées est la ' + b('plus longue') + ' ?',
      type: 'qcm',
      choix: choix,
      correct: totaux.indexOf(max),
      etapes: [
        'Pour comparer, on écrit tout dans la ' + b('même unité') + ' : ici, en secondes.'
      ].concat(cands.map(function (c) {
        var w = vide(c, 's');
        return duree(c) + ' = ' + (w.lignes.length ? w.lignes.map(function (l) { return l.replace(/<\/?b>/g, ''); }).join(' ') + ' Soit ' : '') +
               b(fmtN(total(c)) + ' s') + '.';
      })).concat(['La plus longue est donc ' + b(duree(cands[totaux.indexOf(max)])) + '.']),
      indices: ['Convertis tout en secondes (ou tout en minutes) avant de comparer.'],
      duree: 70
    };
  }

  MathsExos.register({
    id: 'durees',
    competence: 'durees',
    level: '5eme',
    titre: 'Convertir des durées',
    paliers: 4,

    genere: function (rnd, palier) {
      var formesDispo = palier === 1 ? ['unite', 'unite', 'decomp']
                      : palier === 2 ? ['unite', 'decomp', 'decomp', 'virgule']
                      : palier === 3 ? ['unite', 'decomp', 'decomp', 'virgule', 'longue']
                      : ['unite', 'decomp', 'decomp', 'longue', 'virgule'];
      var f = rnd.choix(formesDispo);
      if (f === 'unite') return versUnite(rnd, palier);
      if (f === 'decomp') return versDecomposee(rnd, palier);
      if (f === 'virgule') return piegeVirgule(rnd);
      return plusLongue(rnd, palier);
    }
  });
})();
