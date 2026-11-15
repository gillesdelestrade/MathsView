/*
 * quotients-division — l'inverse d'un quotient et la division de deux
 * quotients (leçon 2nde « Inverse et division de quotients »).
 *
 * Les formes suivent la leçon :
 *   P1  l'inverse d'un quotient, d'un entier, de 1/n — à écrire, ou à
 *       reconnaître parmi l'opposé, l'opposé de l'inverse et le nombre
 *       lui-même ;
 *   P2  diviser deux quotients positifs, un quotient par un entier, un entier
 *       par un quotient ;
 *   P3  les mêmes avec des signes, l'inverse d'un nombre négatif, et des
 *       vrai/faux sur les fautes classiques (retourner le premier quotient,
 *       confondre inverse et opposé, l'inverse de 0) ;
 *   P4  l'écriture à étages, la priorité de la division dans un calcul à
 *       trois termes, le nombre manquant, et un quotient littéral.
 *
 * Tout est calculé en fractions exactes (numérateur, dénominateur), jamais en
 * flottants : la correction écrit le produit par l'inverse, la fraction
 * obtenue, puis sa forme irréductible — toujours en dernière ligne, en gras.
 * La réponse est comparée par sa valeur : 9/8 et 1,125 sont acceptés.
 */
(function () {
  'use strict';

  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  // une fraction exacte, réduite, dénominateur positif
  function Q(n, d) { if (d < 0) { n = -n; d = -d; } var g = pgcd(n, d); return { n: n / g, d: d / g }; }
  function fois(x, y) { return Q(x.n * y.n, x.d * y.d); }
  function inverse(x) { return Q(x.d, x.n); }
  function plus(x, y) { return Q(x.n * y.d + y.n * x.d, x.d * y.d); }
  function moins(x, y) { return Q(x.n * y.d - y.n * x.d, x.d * y.d); }
  function valeur(x) { return x.n / x.d; }
  // « \dfrac{3}{4} », « -\dfrac{3}{4} », « 5 »
  function tex(x) { return x.d === 1 ? String(x.n) : (x.n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(x.n) + '}{' + x.d + '}'; }
  // entre parenthèses s'il est négatif : pour suivre un ÷ ou un ×
  function par(x) { return x.n < 0 ? '\\left(' + tex(x) + '\\right)' : tex(x); }
  function gras(x) { return '<b>\\(' + tex(x) + '\\)</b>'; }
  // un produit écrit, sans le facteur 1 : « 3 \times 4 », « 4 »
  function prod(u, v) { return u === 1 ? String(v) : v === 1 ? String(u) : u + ' \\times ' + v; }

  // un quotient irréductible qui n'est ni un entier ni 1
  function tireQ(rnd, negatif) {
    var n, d;
    do { d = rnd.entier(2, 9); n = rnd.entier(1, 9); } while (pgcd(n, d) !== 1);
    return Q(negatif ? -n : n, d);
  }
  var CONSIGNE = 'Calcule. Donne le résultat sous forme de <strong>fraction irréductible</strong> (ou d\'entier), par exemple 9/8.';

  /* ======================================================================= */
  /* P1, P3 — l'inverse                                                      */
  /* ======================================================================= */
  function unNombre(rnd, negatif) {
    var f = rnd.choix(['quotient', 'quotient', 'entier', 'unite']);
    var x = f === 'quotient' ? tireQ(rnd, false) : f === 'entier' ? Q(rnd.entier(2, 9), 1) : Q(1, rnd.entier(2, 9));
    return negatif ? Q(-x.n, x.d) : x;
  }
  function explInverse(x) {
    var s = x.d === 1 ? 'On écrit \\(' + x.n + ' = ' + (x.n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(x.n) + '}{1}\\), puis on échange numérateur et dénominateur'
                      : 'On échange numérateur et dénominateur';
    return s + (x.n < 0 ? ' ; le signe ne change pas' : '') + ' : l\'inverse de \\(' + tex(x) + '\\) est ' + gras(inverse(x)) + '.';
  }
  function inverseNombre(rnd, negatif) {
    var x = unNombre(rnd, negatif), inv = inverse(x);
    return {
      enonce: 'Quel est l\'<strong>inverse</strong> de \\(' + tex(x) + '\\) ? Réponds par une fraction ou un entier.',
      type: 'nombre', reponse: valeur(inv),
      etapes: [
        'L\'inverse d\'un nombre non nul est celui qui, multiplié par lui, donne 1.',
        'Vérification : \\(' + tex(x) + ' \\times ' + par(inv) + ' = 1\\).',
        explInverse(x)
      ],
      indices: ['Par quoi multiplier ce nombre pour obtenir 1 ?', 'Échange le numérateur et le dénominateur' + (negatif ? ', et garde le signe.' : '.')],
      duree: 40
    };
  }
  function inverseQcm(rnd) {
    var x = tireQ(rnd, false), inv = inverse(x);
    var choix = rnd.melange([inv, Q(-x.n, x.d), Q(-inv.n, inv.d), x]);
    return {
      enonce: 'Lequel de ces nombres est l\'<strong>inverse</strong> de \\(' + tex(x) + '\\) ?',
      type: 'qcm', choix: choix.map(function (c) { return '\\(' + tex(c) + '\\)'; }), correct: choix.indexOf(inv),
      etapes: [
        'L\'inverse est le nombre qui, multiplié par \\(' + tex(x) + '\\), donne 1 : \\(' + tex(x) + ' \\times ' + tex(inv) + ' = 1\\).',
        'À ne pas confondre avec l\'<b>opposé</b> \\(' + tex(Q(-x.n, x.d)) + '\\), dont la <em>somme</em> avec \\(' + tex(x) + '\\) vaut 0. L\'inverse garde le signe.',
        explInverse(x)
      ],
      indices: ['Inverse : le produit vaut 1. Opposé : la somme vaut 0.'],
      duree: 40
    };
  }

  /* ======================================================================= */
  /* P2, P3, P4 — diviser                                                    */
  /* ======================================================================= */
  // les lignes « produit par l'inverse → fraction → forme irréductible » de A ÷ B
  function lignesDivision(A, B) {
    var inv = inverse(B), R = fois(A, inv);
    var negatifs = (A.n < 0 ? 1 : 0) + (B.n < 0 ? 1 : 0);
    var num = Math.abs(A.n) * Math.abs(inv.n), den = A.d * inv.d, signe = negatifs === 1 ? '-' : '';
    var brut = den === 1 ? signe + num : signe + '\\dfrac{' + num + '}{' + den + '}';
    var out = [
      'Diviser par \\(' + tex(B) + '\\), c\'est <b>multiplier par son inverse</b> \\(' + tex(inv) + '\\) : \\(' +
      tex(A) + ' \\div ' + par(B) + ' = ' + tex(A) + ' \\times ' + par(inv) + '\\).',
      (negatifs === 1 ? 'Un seul signe « − » : le résultat est négatif. ' : negatifs === 2 ? 'Deux signes « − » : le résultat est positif. ' : '') +
      'On multiplie les numérateurs entre eux et les dénominateurs entre eux : \\(' + signe + (den === 1 ? prod(Math.abs(A.n), Math.abs(inv.n)) : '\\dfrac{' + prod(Math.abs(A.n), Math.abs(inv.n)) +
      '}{' + prod(A.d, inv.d) + '}') + ' = ' + brut + '\\).'
    ];
    var g = pgcd(num, den);
    out.push(g > 1 ? 'On simplifie par ' + g + ' : ' + gras(R) + '.' : (R.d === 1 ? 'Le résultat est ' : 'La fraction est irréductible : ') + gras(R) + '.');
    return out;
  }
  function division(rnd, palier, etages) {
    var A, B, R;
    do {
      var forme = etages ? 'qq' : rnd.choix(['qq', 'qq', 'qq', 'qe', 'eq']);
      A = forme === 'eq' ? Q(rnd.entier(2, 9), 1) : tireQ(rnd, false);
      B = forme === 'qe' ? Q(rnd.entier(2, 9), 1) : tireQ(rnd, false);
      if (palier >= 3) {
        var s = rnd.choix(['-+', '+-', '--', '-+', '+-']);
        if (s.charAt(0) === '-') A = Q(-A.n, A.d);
        if (s.charAt(1) === '-') B = Q(-B.n, B.d);
      }
      R = fois(A, inverse(B));
    } while (Math.abs(valeur(R)) === 1);
    var etapes = lignesDivision(A, B);
    if (etages) etapes.unshift('Le grand trait de fraction est une division : \\(\\dfrac{' + tex(A) + '}{' + tex(B) + '} = ' + tex(A) + ' \\div ' + par(B) + '\\).');
    return {
      enonce: CONSIGNE,
      tex: etages ? '\\dfrac{\\;' + tex(A) + '\\;}{' + tex(B) + '}' : tex(A) + ' \\div ' + par(B),
      type: 'nombre', reponse: valeur(R),
      etapes: etapes,
      indices: ['Diviser par un quotient, c\'est multiplier par son inverse.',
                'On ne retourne que le second quotient — celui par lequel on divise.',
                'Pense à simplifier le résultat.'],
      duree: palier === 2 ? 70 : 85
    };
  }

  /* ======================================================================= */
  /* P3 — vrai ou faux                                                       */
  /* ======================================================================= */
  var AFFIRMATIONS = [
    { t: 'L\'inverse de \\(\\dfrac{3}{5}\\) est \\(-\\dfrac{3}{5}\\).', ok: false,
      d: '\\(-\\dfrac{3}{5}\\) est son <b>opposé</b>. Son inverse est \\(\\dfrac{5}{3}\\) : \\(\\dfrac{3}{5} \\times \\dfrac{5}{3} = 1\\).' },
    { t: 'Diviser par \\(\\dfrac{1}{2}\\), c\'est multiplier par \\(2\\).', ok: true,
      d: 'L\'inverse de \\(\\dfrac{1}{2}\\) est \\(2\\). Il y a deux demis dans chaque unité : diviser par un demi double.' },
    { t: '\\(\\dfrac{2}{3} \\div \\dfrac{4}{5} = \\dfrac{3}{2} \\times \\dfrac{4}{5}\\).', ok: false,
      d: 'On ne retourne que le <b>second</b> quotient : \\(\\dfrac{2}{3} \\div \\dfrac{4}{5} = \\dfrac{2}{3} \\times \\dfrac{5}{4} = \\dfrac{5}{6}\\).' },
    { t: 'Le nombre \\(0\\) n\'a pas d\'inverse.', ok: true,
      d: 'Aucun nombre multiplié par 0 ne donne 1 : c\'est pour cela qu\'on ne divise jamais par 0.' },
    { t: 'L\'inverse de \\(-4\\) est \\(\\dfrac{1}{4}\\).', ok: false,
      d: 'L\'inverse garde le signe : c\'est \\(-\\dfrac{1}{4}\\), car \\(-4 \\times \\left(-\\dfrac{1}{4}\\right) = 1\\).' },
    { t: '\\(6 \\div \\dfrac{1}{3} = 2\\).', ok: false,
      d: '\\(6 \\div \\dfrac{1}{3} = 6 \\times 3 = 18\\) : il y a dix-huit tiers dans 6. C\'est \\(6 \\div 3\\) qui vaut 2.' },
    { t: 'Le produit d\'un nombre non nul par son inverse vaut \\(1\\).', ok: true,
      d: 'C\'est la définition de l\'inverse.' },
    { t: 'Quand on divise un nombre positif par \\(\\dfrac{3}{4}\\), on obtient un nombre plus grand.', ok: true,
      d: 'Diviser par \\(\\dfrac{3}{4}\\), c\'est multiplier par \\(\\dfrac{4}{3}\\), qui est plus grand que 1.' },
    { t: '\\(\\dfrac{5}{7} \\div 5 = \\dfrac{1}{7}\\).', ok: true,
      d: '\\(\\dfrac{5}{7} \\div 5 = \\dfrac{5}{7} \\times \\dfrac{1}{5} = \\dfrac{5}{35} = \\dfrac{1}{7}\\).' },
    { t: 'L\'inverse de l\'inverse de \\(\\dfrac{2}{9}\\) est \\(\\dfrac{2}{9}\\).', ok: true,
      d: 'L\'inverse de \\(\\dfrac{2}{9}\\) est \\(\\dfrac{9}{2}\\), et l\'inverse de \\(\\dfrac{9}{2}\\) est \\(\\dfrac{2}{9}\\) : on a échangé deux fois.' },
    { t: '\\(\\dfrac{3}{4} \\div \\dfrac{3}{4} = 0\\).', ok: false,
      d: 'Un nombre non nul divisé par lui-même vaut \\(1\\) : \\(\\dfrac{3}{4} \\times \\dfrac{4}{3} = 1\\). C\'est la <em>différence</em> qui vaut 0.' },
    { t: 'L\'inverse de \\(\\dfrac{1}{6}\\) est \\(6\\).', ok: true,
      d: '\\(\\dfrac{1}{6} \\times 6 = 1\\).' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Rappel : l\'inverse de \\(\\dfrac{b}{d}\\) est \\(\\dfrac{d}{b}\\), et diviser par un quotient, c\'est multiplier par son inverse.'],
      indices: ['Fais le calcul, ou vérifie par un produit.'],
      duree: 40
    };
  }

  /* ======================================================================= */
  /* P4 — priorité de la division                                            */
  /* ======================================================================= */
  function ppcm(x, y) { return x * y / pgcd(x, y); }
  // « \dfrac{9}{12} + \dfrac{8}{12} » : x ± y au même dénominateur
  function memeDenominateur(x, y, op) {
    var m = ppcm(x.d, y.d);
    if (m === 1) return x.n + ' ' + op + ' ' + y.n;
    return '\\dfrac{' + (x.n * m / x.d) + '}{' + m + '} ' + op + ' \\dfrac{' + (y.n * m / y.d) + '}{' + m + '}';
  }
  function priorite(rnd) {
    var A, B, C, R, etapes, texte;
    for (;;) {
      A = tireQ(rnd, false); B = tireQ(rnd, false); C = tireQ(rnd, false);
      if (A.d > 6 || B.d > 6 || C.d > 6) continue;
      if (rnd.booleen(0.55)) {
        // A + B ÷ C : la division d'abord
        var op = rnd.choix(['+', '-']), q = fois(B, inverse(C));
        R = op === '+' ? plus(A, q) : moins(A, q);
        if (R.n <= 0 || q.d > 12 || valeur(q) === 1) continue;
        texte = tex(A) + ' ' + op + ' ' + tex(B) + ' \\div ' + tex(C);
        etapes = [
          'La <b>division est prioritaire</b> sur ' + (op === '+' ? 'l\'addition' : 'la soustraction') + ' : on calcule d\'abord \\(' + tex(B) + ' \\div ' + tex(C) + ' = ' +
          tex(B) + ' \\times ' + tex(inverse(C)) + ' = ' + tex(q) + '\\).',
          'Puis \\(' + tex(A) + ' ' + op + ' ' + tex(q) + ' = ' + memeDenominateur(A, q, op) + '\\).',
          'Le résultat est ' + gras(R) + '.'
        ];
      } else {
        // (A − B) ÷ C : les parenthèses d'abord
        var op2 = rnd.choix(['+', '-']), s = op2 === '+' ? plus(A, B) : moins(A, B);
        if (s.n <= 0 || s.d === 1 || valeur(s) === valeur(C)) continue;
        R = fois(s, inverse(C));
        texte = '\\left(' + tex(A) + ' ' + op2 + ' ' + tex(B) + '\\right) \\div ' + tex(C);
        etapes = [
          'Les <b>parenthèses d\'abord</b> : \\(' + tex(A) + ' ' + op2 + ' ' + tex(B) + ' = ' + memeDenominateur(A, B, op2) + ' = ' + tex(s) + '\\).',
          'Puis on divise, c\'est-à-dire qu\'on multiplie par l\'inverse : \\(' + tex(s) + ' \\div ' + tex(C) + ' = ' + tex(s) + ' \\times ' + tex(inverse(C)) + '\\).',
          'Le résultat est ' + gras(R) + '.'
        ];
      }
      if (R.d <= 60) break;
    }
    return {
      enonce: CONSIGNE, tex: texte,
      type: 'nombre', reponse: valeur(R),
      etapes: etapes,
      indices: ['Dans quel ordre fait-on les opérations ?', 'Diviser par un quotient, c\'est multiplier par son inverse.'],
      duree: 120
    };
  }

  /* ======================================================================= */
  /* P4 — le nombre manquant                                                 */
  /* ======================================================================= */
  function manquant(rnd) {
    var A, X, R;
    do { A = tireQ(rnd, false); X = rnd.booleen(0.3) ? Q(rnd.entier(2, 6), 1) : tireQ(rnd, false); R = fois(A, inverse(X)); }
    while (valeur(R) === 1 || valeur(X) === valeur(A) || R.d > 40);
    var inv = inverse(R), num = A.n * inv.n, den = A.d * inv.d;
    return {
      enonce: 'Quel nombre faut-il écrire dans la case ? Réponds par une fraction irréductible ou un entier.',
      tex: tex(A) + ' \\div \\square = ' + tex(R),
      type: 'nombre', reponse: valeur(X),
      etapes: [
        'Si \\(' + tex(A) + ' \\div \\square = ' + tex(R) + '\\), alors \\(\\square = ' + tex(A) + ' \\div ' + tex(R) + '\\) : le diviseur est le dividende divisé par le quotient.',
        '\\(' + tex(A) + ' \\div ' + tex(R) + ' = ' + tex(A) + ' \\times ' + tex(inv) + ' = ' + (den === 1 ? prod(A.n, inv.n) : '\\dfrac{' + prod(A.n, inv.n) + '}{' + prod(A.d, inv.d) + '}') + ' = ' +
        (den === 1 ? num : '\\dfrac{' + num + '}{' + den + '}') + '\\).',
        (pgcd(num, den) > 1 ? 'On simplifie : ' : 'Le nombre cherché est ') + gras(X) + '.'
      ],
      indices: ['Comme dans 12 ÷ ? = 3 : le nombre cherché est 12 ÷ 3.', 'Divise le premier nombre par le résultat.'],
      duree: 110
    };
  }

  /* ======================================================================= */
  /* P4 — un quotient littéral                                               */
  /* ======================================================================= */
  // « \dfrac{5x}{6} », « 3x », « \dfrac{x}{2} »
  function enX(q) { var n = q.n === 1 ? 'x' : q.n + 'x'; return q.d === 1 ? n : '\\dfrac{' + n + '}{' + q.d + '}'; }
  // « \dfrac{6}{5x} », « \dfrac{1}{3x} »
  function surX(q) { return '\\dfrac{' + q.n + '}{' + (q.d === 1 ? 'x' : q.d + 'x') + '}'; }
  function litteral(rnd) {
    var A, B, textes;
    do {
      do { A = Q(rnd.entier(1, 5), rnd.entier(2, 7)); } while (A.d === 1);
      do { B = tireQ(rnd, false); } while (B.n === 1);       // un inverse qui reste un quotient
      var bon = fois(A, inverse(B));
      textes = [enX(bon),                       // (A·x) ÷ B = A/B · x
                enX(fois(A, B)),                // second quotient non retourné
                surX(fois(inverse(A), B)),      // premier quotient retourné
                surX(inverse(fois(A, B)))];     // les deux retournés
    } while (textes.some(function (t, i) { return textes.indexOf(t) !== i; }) || valeur(fois(A, inverse(B))) === 1);
    var choix = rnd.melange(textes.slice()), inv = inverse(B), R = fois(A, inv);
    return {
      enonce: 'Pour tout nombre \\(x\\), l\'expression \\(' + enX(A) + ' \\div ' + tex(B) + '\\) est égale à :',
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(textes[0]),
      etapes: [
        'La règle vaut aussi avec des lettres : diviser par \\(' + tex(B) + '\\), c\'est multiplier par son inverse \\(' + tex(inv) + '\\).',
        '\\(' + enX(A) + ' \\times ' + tex(inv) + ' = \\dfrac{' + (A.n === 1 ? '' : A.n + ' \\times ') + 'x \\times ' + inv.n + '}{' + A.d + ' \\times ' + inv.d + '}\\).',
        'Après simplification : <b>\\(' + enX(R) + '\\)</b>. On n\'a retourné que le second quotient, et \\(x\\) est resté au numérateur.'
      ],
      indices: ['Multiplie par l\'inverse du second quotient.', 'Vérifie avec une valeur simple de x, par exemple x = 1.'],
      duree: 90
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'quotients-division',
    competence: 'quotients-division',
    level: '2nde',
    titre: 'Inverse et division de quotients',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.6) ? inverseNombre(rnd, false) : inverseQcm(rnd);
      if (palier === 2) return division(rnd, 2, false);
      if (palier === 3) {
        var f3 = rnd.choix(['div', 'div', 'div', 'inv', 'vf', 'vf']);
        return f3 === 'div' ? division(rnd, 3, false) : f3 === 'inv' ? inverseNombre(rnd, true) : vraiFaux(rnd);
      }
      var f4 = rnd.choix(['priorite', 'priorite', 'etages', 'manquant', 'litteral']);
      return f4 === 'priorite' ? priorite(rnd) : f4 === 'etages' ? division(rnd, 4, true) : f4 === 'manquant' ? manquant(rnd) : litteral(rnd);
    }
  });
})();
