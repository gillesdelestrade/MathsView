/*
 * eq-quotient-nul — les équations quotient nul (leçon 2nde « Équations
 * quotient nul »).
 *
 * Les formes suivent la progression de la leçon :
 *   P1  la valeur interdite de (ax + b)/(cx + d) (réponse exacte), et « lequel
 *       de ces nombres est solution ? » — la valeur interdite est parmi les
 *       leurres ;
 *   P2  (ax + b)/(cx + d) = 0 : S = {zéro du numérateur}, ou ∅ quand ce zéro
 *       est la valeur interdite ; et des vrai/faux sur les pièges (« le
 *       dénominateur donne aussi une solution », « 3 est solution de
 *       (x − 3)/(x − 3) = 0 ») ;
 *   P3  un numérateur produit, (x − 2)(x + 5)/(x − 2) = 0 : deux zéros en
 *       haut, dont l'un peut être interdit — il faut les confronter à la
 *       valeur interdite un par un ;
 *   P4  la lecture inverse : quelle équation a pour solutions {2} ? Les
 *       leurres échangent numérateur et dénominateur, changent un signe, ou
 *       n'ont aucune solution.
 *
 * Tout part des zéros : on les choisit, on fabrique l'équation autour, et la
 * correction commence toujours par la valeur interdite. La réponse est
 * comparée par structure (type « intervalle » : {2}, ∅).
 */
(function () {
  'use strict';

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
  function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
  function facteur(k, m, tex) {
    var moins = tex ? '-' : '−';
    var t = (k < 0 ? moins : '') + absX(k);
    if (m !== 0) t += (m < 0 ? ' ' + moins + ' ' : ' + ') + Math.abs(m);
    return t;
  }
  function wrap(k, m, tex) { var t = facteur(k, m, tex); return m === 0 ? t : '(' + t + ')'; }
  function zero(a, b) {
    var n = -b, d = a;
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d); n /= g; d /= g;
    if (d === 1) return { v: n, txt: fr(n), tex: texNb(n) };
    if (termine(d)) return { v: n / d, txt: fr(n / d), tex: texNb(n / d) };
    return { v: n / d, txt: (n < 0 ? '−' : '') + Math.abs(n) + '/' + d,
             tex: (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}' };
  }
  function quotientTex(num, den) { return '\\dfrac{' + num + '}{' + den + '} = 0'; }
  // l'ensemble des solutions à partir des zéros du numérateur et de la valeur interdite
  function ensemble(zerosNum, interdite) {
    var sols = zerosNum.filter(function (z) { return Math.abs(z.v - interdite.v) > 1e-9; })
                       .sort(function (u, v) { return u.v - v.v; });
    return {
      sols: sols,
      txt: sols.length ? '{' + sols.map(function (z) { return z.txt; }).join(' ; ') + '}' : '∅',
      tex: sols.length ? '\\{' + sols.map(function (z) { return z.tex; }).join('\\,;\\ ') + '\\}' : '\\varnothing',
      morceaux: sols.map(function (z) { return { a: z.v, b: z.v, oa: false, ob: false }; })
    };
  }
  var REGLE = 'Un quotient est nul si, et seulement si, son <b>numérateur</b> est nul — et que son dénominateur ne l\'est pas.';
  function ligneInterdite(c, d, zi) {
    return '<b>Valeur interdite</b> : on ne divise pas par 0. \\(' + facteur(c, d, true) + ' = 0 \\iff x = ' + zi.tex +
           '\\) : cette valeur n\'est jamais solution.';
  }
  var CONSIGNE = 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des solutions</strong>, par exemple {2} — ou ∅ s\'il n\'y en a aucune.';
  var INDICES = [
    'Commence par la valeur interdite : celle qui annule le dénominateur.',
    'Un quotient est nul quand son numérateur est nul. Résous numérateur = 0.',
    'Compare la valeur trouvée à la valeur interdite : si c\'est la même, elle n\'est pas solution.'
  ];

  /* ======================================================================= */
  /* Les formes                                                              */
  /* ======================================================================= */

  // P1 — la valeur interdite
  function valeurInterdite(rnd) {
    var a = rnd.entierNonNul(-4, 4), b = rnd.entierNonNul(-9, 9), c = rnd.entierNonNul(-4, 4), d;
    if (rnd.booleen(0.7)) d = -c * rnd.entierNonNul(-6, 6); else d = rnd.entierNonNul(-9, 9);
    var zi = zero(c, d), zn = zero(a, b);
    return {
      enonce: 'Quelle est la <strong>valeur interdite</strong> de l\'équation \\(' + quotientTex(facteur(a, b, true), facteur(c, d, true)) + '\\) ? ' +
              (zi.txt.indexOf('/') >= 0 ? 'Donne la valeur <strong>exacte</strong> (une fraction).' : ''),
      type: 'nombre', reponse: zi.v,
      etapes: [
        'On ne divise pas par 0 : la valeur interdite est celle qui annule le <b>dénominateur</b>, \\(' + facteur(c, d, true) + '\\).',
        '\\(' + facteur(c, d, true) + ' = 0 \\iff x = \\dfrac{' + texNb(-d) + '}{' + texNb(c) + '} = ' + zi.tex + '\\). Valeur interdite : <b>' + zi.txt + '</b>.',
        'Le numérateur, lui, s\'annule en \\(' + zn.tex + '\\) : c\'est là que le quotient vaut 0' +
        (Math.abs(zn.v - zi.v) < 1e-9 ? ' — sauf que c\'est la valeur interdite : l\'équation n\'a alors aucune solution.' : ', c\'est la solution de l\'équation.')
      ],
      indices: ['C\'est le dénominateur qui ne doit pas être nul.', 'Résous ' + facteur(c, d) + ' = 0.'],
      duree: 40
    };
  }

  // P1 — lequel de ces nombres est solution ? (la valeur interdite est un leurre)
  function lequel(rnd) {
    var x1 = rnd.entier(-5, 5), x2; do { x2 = rnd.entier(-5, 5); } while (x2 === x1);
    var a = rnd.choix([1, 2, -1]), c = rnd.choix([1, 1, 3, -1]), b = -a * x1, d = -c * x2;
    var pool = [x1, x2];
    [-x1, -x2, x1 + x2, x1 + 1, x2 - 1, 0, 1, -1, 2, -2, 3, -3].forEach(function (v) { if (pool.indexOf(v) < 0) pool.push(v); });
    var choix = rnd.melange([x1, x2].concat(rnd.melange(pool.slice(2)).slice(0, 2)));
    return {
      enonce: 'Parmi ces nombres, lequel est <strong>solution</strong> de l\'équation \\(' + quotientTex(facteur(a, b, true), facteur(c, d, true)) + '\\) ?',
      type: 'qcm', choix: choix.map(fr), correct: choix.indexOf(x1),
      etapes: [
        REGLE,
        'Pour \\(x = ' + texNb(x1) + '\\) : numérateur \\(' + texNb(a * x1 + b) + '\\), dénominateur \\(' + texNb(c * x1 + d) + '\\) : le quotient vaut \\(0\\). <b>' + fr(x1) + ' est solution.</b>',
        'Pour \\(x = ' + texNb(x2) + '\\) : le <b>dénominateur</b> vaut \\(0\\). Ce n\'est pas une solution, c\'est la <b>valeur interdite</b> : le quotient n\'existe pas.',
        'Pour les autres, le numérateur n\'est pas nul, donc le quotient non plus. \\(S = \\{' + texNb(x1) + '\\}\\).'
      ],
      indices: ['Remplace \\(x\\) par chaque nombre : le numérateur doit valoir 0, pas le dénominateur.', 'Le nombre qui annule le dénominateur est interdit.'],
      duree: 45
    };
  }

  // P2 — (ax + b)/(cx + d) = 0
  function quotient(rnd, palier) {
    var forme = rnd.choix(['entier', 'entier', 'fraction', 'vide', 'x']);
    var x1 = rnd.entier(-6, 6), x2; do { x2 = rnd.entier(-6, 6); } while (x2 === x1);
    var a = rnd.choix([1, 1, 2, -1, 3]), c = rnd.choix([1, 1, 2, -1]), b = -a * x1, d = -c * x2;
    if (forme === 'fraction') { a = rnd.choix([2, 3, -2, 4]); do { b = rnd.entierNonNul(-7, 7); } while (b % a === 0); }
    else if (forme === 'vide') { if (x1 === 0) x1 = 2; b = -a * x1; d = -c * x1; }
    else if (forme === 'x') { b = 0; if (x2 === 0) { x2 = 3; d = -c * x2; } }
    var zn = zero(a, b), zi = zero(c, d), S = ensemble([zn], zi);
    return {
      enonce: CONSIGNE, tex: quotientTex(facteur(a, b, true), facteur(c, d, true)),
      type: 'intervalle', reponse: S.txt, morceaux: S.morceaux,
      etapes: [
        ligneInterdite(c, d, zi),
        REGLE + ' On résout donc \\(' + facteur(a, b, true) + ' = 0 \\iff x = ' + zn.tex + '\\).',
        S.sols.length
          ? '\\(' + zn.tex + ' \\neq ' + zi.tex + '\\) : cette valeur n\'est pas interdite. <b>\\(S = ' + S.tex + '\\)</b>' +
            (b === 0 ? ' — 0 est bien une solution : c\'est le numérateur qui est nul, pas le dénominateur.' : '')
          : 'Mais \\(' + zn.tex + '\\) est la <b>valeur interdite</b> : le quotient n\'y existe pas. Il n\'y a <b>aucune solution</b> : \\(S = \\varnothing\\).'
      ],
      indices: INDICES, duree: 75
    };
  }

  // P2 — vrai ou faux
  var AFFIRMATIONS = [
    { t: 'L\'équation \\(\\dfrac{x - 2}{x + 5} = 0\\) a deux solutions, \\(2\\) et \\(-5\\).', ok: false,
      d: '\\(-5\\) annule le <b>dénominateur</b> : c\'est la valeur interdite, pas une solution. Seule \\(2\\) annule le numérateur : \\(S = \\{2\\}\\).' },
    { t: '\\(3\\) est solution de \\(\\dfrac{x - 3}{x - 3} = 0\\).', ok: false,
      d: 'Pour \\(x = 3\\), le dénominateur vaut \\(0\\) : le quotient n\'existe pas. Le numérateur ne s\'annule qu\'en \\(3\\), qui est interdit : \\(S = \\varnothing\\).' },
    { t: 'Un quotient est nul si et seulement si son numérateur est nul et son dénominateur non nul.', ok: true,
      d: 'C\'est la règle : \\(\\frac{A}{B} = 0 \\iff A = 0\\) et \\(B \\neq 0\\).' },
    { t: 'Si le dénominateur d\'un quotient est nul, le quotient vaut \\(0\\).', ok: false,
      d: 'Si le dénominateur est nul, le quotient n\'<b>existe pas</b>. C\'est le numérateur nul qui donne \\(0\\).' },
    { t: 'L\'équation \\(\\dfrac{x + 1}{x - 4} = 0\\) a pour unique solution \\(-1\\).', ok: true,
      d: 'Valeur interdite \\(4\\) ; numérateur nul en \\(-1\\), qui n\'est pas interdit : \\(S = \\{-1\\}\\).' },
    { t: 'Pour résoudre \\(\\dfrac{2x - 6}{x + 1} = 0\\), on peut multiplier les deux membres par \\(x + 1\\).', ok: true,
      d: 'Une fois la valeur interdite \\(-1\\) écartée, \\(x + 1 \\neq 0\\) et on peut multiplier : on retrouve \\(2x - 6 = 0\\), soit \\(x = 3\\). Mais la valeur interdite doit avoir été écrite avant.' },
    { t: 'L\'équation \\(\\dfrac{x}{x - 2} = 0\\) n\'a pas de solution, car \\(0\\) « n\'est pas un nombre ».', ok: false,
      d: '\\(0\\) est un nombre comme un autre : pour \\(x = 0\\), le numérateur vaut \\(0\\) et le dénominateur \\(-2\\). \\(S = \\{0\\}\\).' },
    { t: 'Dans \\(\\dfrac{x - 1}{2x + 6} = 0\\), la valeur interdite est \\(-3\\).', ok: true,
      d: '\\(2x + 6 = 0 \\iff x = -3\\). La solution, elle, est \\(1\\).' },
    { t: 'Dans \\(\\dfrac{x - 1}{2x + 6} = 0\\), la valeur interdite est \\(1\\).', ok: false,
      d: '\\(1\\) annule le <b>numérateur</b> : c\'est la solution. La valeur interdite annule le dénominateur : \\(-3\\).' },
    { t: 'L\'équation \\(\\dfrac{x - 5}{x - 5} = 0\\) a pour solution \\(5\\).', ok: false,
      d: 'Le numérateur s\'annule en \\(5\\)… mais le dénominateur aussi : \\(5\\) est interdit. \\(S = \\varnothing\\).' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, 'Rappel : ' + REGLE],
      indices: ['Regarde qui s\'annule : le numérateur, ou le dénominateur ?'],
      duree: 40
    };
  }

  // P3 — un numérateur produit : deux zéros en haut, à confronter à la valeur interdite
  function numerateurProduit(rnd) {
    var p = rnd.entier(-5, 5), q; do { q = rnd.entier(-5, 5); } while (q === p);
    var r = rnd.booleen(0.5) ? p : (function () { var v; do { v = rnd.entier(-5, 5); } while (v === p || v === q); return v; })();
    var a = rnd.choix([1, 1, 2]), b = -a * p;
    var zp = zero(a, b), zq = zero(1, -q), zi = zero(1, -r), S = ensemble([zp, zq], zi);
    var num = wrap(a, b, true) + wrap(1, -q, true);
    return {
      enonce: CONSIGNE, tex: quotientTex(num, facteur(1, -r, true)),
      type: 'intervalle', reponse: S.txt, morceaux: S.morceaux,
      etapes: [
        ligneInterdite(1, -r, zi),
        REGLE + ' Le numérateur est un <b>produit</b> : \\(' + num + ' = 0 \\iff ' + facteur(a, b, true) + ' = 0\\ \\text{ou}\\ ' +
        facteur(1, -q, true) + ' = 0 \\iff x = ' + zp.tex + '\\ \\text{ou}\\ x = ' + zq.tex + '\\).',
        (r === p
          ? 'Mais \\(' + zp.tex + '\\) est la <b>valeur interdite</b> : on l\'écarte. Il reste \\(' + zq.tex + '\\), qui n\'est pas interdit.'
          : 'Aucune des deux n\'est la valeur interdite \\(' + zi.tex + '\\) : on garde les deux.') +
        ' <b>\\(S = ' + S.tex + '\\)</b>'
      ],
      indices: ['La valeur interdite d\'abord.', 'Le numérateur est un produit nul : deux zéros. Compare chacun à la valeur interdite.'],
      duree: 100
    };
  }

  // P4 — quelle équation a pour solutions S ?
  function laquelle(rnd) {
    var x1 = rnd.entierNonNul(-4, 4), x2; do { x2 = rnd.entierNonNul(-4, 4); } while (x2 === x1 || x2 === -x1);
    var a = rnd.choix([1, 1, 2]), c = rnd.choix([1, 3, -1]), b = -a * x1, d = -c * x2;
    var S = ensemble([zero(a, b)], zero(c, d));
    function eq(num, den) { return '\\(' + quotientTex(num, den) + '\\)'; }
    var vrai = eq(facteur(a, b, true), facteur(c, d, true));
    var pool = [vrai,
                eq(facteur(c, d, true), facteur(a, b, true)),                  // numérateur et dénominateur échangés
                eq(facteur(a, -b, true), facteur(c, d, true)),                 // le signe du numérateur
                eq(facteur(a, b, true), facteur(1, b / a, true))];             // même zéro en bas : aucune solution
    var choix = rnd.melange(pool);
    return {
      enonce: 'Quelle équation a pour ensemble de solutions \\(S = ' + S.tex + '\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: [
        'La solution annule le <b>numérateur</b> sans annuler le dénominateur. Il faut donc un numérateur nul en \\(' + S.sols[0].tex + '\\) : \\(' +
        facteur(a, b, true) + '\\) — et pas \\(' + facteur(a, -b, true) + '\\), qui s\'annule en \\(' + texNb(-x1) + '\\).',
        'Et un dénominateur qui ne s\'annule pas en \\(' + S.sols[0].tex + '\\) : \\(' + facteur(c, d, true) + '\\) convient (valeur interdite \\(' + texNb(x2) + '\\)), ' +
        'alors que \\(' + facteur(1, b / a, true) + '\\) au dénominateur rendrait \\(' + S.sols[0].tex + '\\) interdit — aucune solution.',
        'Numérateur et dénominateur échangés, la solution serait \\(' + texNb(x2) + '\\). C\'est donc ' + vrai + '.'
      ],
      indices: ['La solution doit annuler le numérateur, et surtout pas le dénominateur.', 'x − 2 s\'annule en 2, x + 2 en −2.'],
      duree: 70
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'eq-quotient-nul',
    competence: 'eq-quotient-nul',
    level: '2nde',
    titre: 'Équations quotient nul',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.55) ? valeurInterdite(rnd) : lequel(rnd);
      if (palier === 2) return rnd.booleen(0.65) ? quotient(rnd, 2) : vraiFaux(rnd);
      if (palier === 3) return rnd.booleen(0.75) ? numerateurProduit(rnd) : quotient(rnd, 3);
      var f4 = rnd.choix(['laquelle', 'laquelle', 'produit', 'vraifaux']);
      return f4 === 'laquelle' ? laquelle(rnd) : f4 === 'produit' ? numerateurProduit(rnd) : vraiFaux(rnd);
    }
  });
})();
