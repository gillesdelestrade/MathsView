/*
 * ineq-quotient — les inéquations quotient (leçon 2nde « Inéquations quotient »).
 *
 * Le générateur des inéquations produit, avec ce qui fait la différence : la
 * VALEUR INTERDITE. Les formes suivent la progression de la leçon :
 *   P1  la valeur interdite de (ax + b)/(cx + d) (réponse exacte), le zéro
 *       d'un facteur, et l'intervalle où un facteur est positif ou négatif ;
 *   P2  le quotient avec des zéros entiers : la règle des signes sur une
 *       colonne (QCM), puis la résolution — la réponse est l'ensemble S, avec
 *       le crochet toujours ouvert du côté de la valeur interdite ;
 *   P3  des coefficients de tout signe, strictes et larges, et des vrai/faux
 *       sur les pièges (« −5 est solution de (x − 2)/(x + 5) ⩾ 0 », « on
 *       multiplie par le dénominateur ») ;
 *   P4  des zéros non entiers, le même zéro en haut et en bas (S = ℝ privé
 *       d'un point, ou ∅), et la lecture inverse.
 *
 * Tout part des ZÉROS ; la correction commence par écrire la valeur interdite,
 * refait le tableau de signes de la leçon — double barre sous cette valeur —
 * puis lit S. La réponse est comparée par structure (type « intervalle »).
 */
(function () {
  'use strict';

  var TEX = { '<': '<', '>': '>', '⩽': '\\leqslant', '⩾': '\\geqslant' };
  var RELS = ['<', '>', '⩽', '⩾'];

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
  function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
  // « 2x − 4 », « −x + 3 » — en TeX (tiret ASCII) ou en texte (tiret typographique)
  function facteur(k, m, tex) {
    var moins = tex ? '-' : '−';
    var t = (k < 0 ? moins : '') + absX(k);
    if (m !== 0) t += (m < 0 ? ' ' + moins + ' ' : ' + ') + Math.abs(m);
    return t;
  }
  function sgn(v) { return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }
  function signeTxt(s) { return s > 0 ? '+' : s < 0 ? '−' : '0'; }
  // −b/a en écriture exacte : { v, txt, tex }
  function zero(a, b) {
    var n = -b, d = a;
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d); n /= g; d /= g;
    if (d === 1) return { v: n, txt: fr(n), tex: texNb(n) };
    if (termine(d)) return { v: n / d, txt: fr(n / d), tex: texNb(n / d) };
    return { v: n / d, txt: (n < 0 ? '−' : '') + Math.abs(n) + '/' + d,
             tex: (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}' };
  }

  /* --------------------------------------------------------------------- */
  /* Le tableau de signes, et S                                            */
  /* --------------------------------------------------------------------- */
  function tableau(a, b, c, d, rel) {
    var z1 = zero(a, b), z2 = zero(c, d);
    var zs = Math.abs(z1.v - z2.v) < 1e-9 ? [z1] : (z1.v < z2.v ? [z1, z2] : [z2, z1]);
    var bornes = [-Infinity].concat(zs.map(function (z) { return z.v; }), [Infinity]);
    var cols = [];
    for (var i = 0; i + 1 < bornes.length; i++) {
      var lo = bornes[i], hi = bornes[i + 1];
      var mid = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
      cols.push({ lo: lo, hi: hi, s1: sgn(a * mid + b), s2: sgn(c * mid + d), sp: sgn((a * mid + b) * (c * mid + d)) });
    }
    var voulu = (rel === '>' || rel === '⩾') ? 1 : -1;
    var large = rel === '⩾' || rel === '⩽';
    var pieces = cols.filter(function (co) { return co.sp === voulu; })
                     .map(function (co) { return { a: co.lo, b: co.hi, oa: true, ob: true }; });
    if (large) {
      zs.forEach(function (z) {
        if (Math.abs(z.v - z2.v) < 1e-9) return;        // la valeur interdite, jamais
        var g = null, dr = null;
        pieces.forEach(function (p) { if (p.b === z.v) g = p; if (p.a === z.v) dr = p; });
        if (g) g.ob = false;
        if (dr) dr.oa = false;
        if (!g && !dr) pieces.push({ a: z.v, b: z.v, oa: false, ob: false });
      });
    }
    pieces.sort(function (p, q) { return p.a - q.a; });
    for (var j = 0; j + 1 < pieces.length;) {
      if (pieces[j].b === pieces[j + 1].a && !pieces[j].ob && !pieces[j + 1].oa) {
        pieces[j].b = pieces[j + 1].b; pieces[j].ob = pieces[j + 1].ob; pieces.splice(j + 1, 1);
      } else j++;
    }
    function borne(v) {
      if (v === -Infinity) return '−∞';
      if (v === Infinity) return '+∞';
      for (var k = 0; k < zs.length; k++) if (Math.abs(zs[k].v - v) < 1e-9) return zs[k].txt;
      return fr(v);
    }
    var txt = !pieces.length ? '∅'
      : (pieces.length === 1 && pieces[0].a === -Infinity && pieces[0].b === Infinity) ? 'ℝ'
      : pieces.map(function (p) {
          if (p.a === p.b) return '{' + borne(p.a) + '}';
          return (p.oa ? ']' : '[') + borne(p.a) + ' ; ' + borne(p.b) + (p.ob ? '[' : ']');
        }).join(' ∪ ');
    return { z1: z1, z2: z2, zs: zs, cols: cols, voulu: voulu, large: large, pieces: pieces, txt: txt,
             sansSolution: !pieces.length };
  }

  // Le tableau en HTML, celui de la leçon (classe sg-table de css/style.css).
  function tableHtml(a, b, c, d, T) {
    function cell(s) { return '<td class="' + (s > 0 ? 'sg-plus' : s < 0 ? 'sg-moins' : '') + '">' + signeTxt(s) + '</td>'; }
    // sous un zéro : « 0 » (le numérateur s'y annule), ‖ (valeur interdite), ou une barre
    function sousZero(key, z) {
      var estZ2 = Math.abs(z - T.z2.v) < 1e-9, estZ1 = Math.abs(z - T.z1.v) < 1e-9;
      if (key === 's1') return estZ1 ? '0' : '|';
      if (key === 's2') return estZ2 ? '‖' : '|';
      return estZ2 ? '‖' : '0';
    }
    function ligne(nom, key) {
      var h = '<tr><th>' + nom + '</th><td></td>';
      T.cols.forEach(function (co, i) {
        h += cell(key === 'p' ? co.sp : co[key]);
        if (i < T.zs.length) {
          var sz = sousZero(key, T.zs[i].v);
          h += '<td class="sg-bar' + (sz === '‖' ? ' sg-interdit' : '') + '">' +
               (sz === '0' ? '0' : sz === '‖' ? '<span class="sg-trait"></span><span class="sg-trait"></span>' : '<span class="sg-trait"></span>') + '</td>';
        }
      });
      return h + '<td></td></tr>';
    }
    var h = '<table class="sg-table"><tr><th>x</th><td>−∞</td>';
    T.cols.forEach(function (co, i) {
      h += '<td></td>';
      if (i < T.zs.length) h += '<td class="sg-bar' + (Math.abs(T.zs[i].v - T.z2.v) < 1e-9 ? ' sg-interdit' : '') + '">' + T.zs[i].txt + '</td>';
    });
    h += '<td>+∞</td></tr>';
    h += ligne(facteur(a, b), 's1') + ligne(facteur(c, d), 's2') + ligne('quotient', 'p');
    return h + '</table>';
  }

  function regleFacteur(k, m, z) {
    return '\\(' + facteur(k, m, true) + '\\) s\'annule en \\(x = ' + z.tex + '\\) ; à droite de ce zéro il a le signe de ' +
           (k < 0 ? '\\(' + k + '\\), <b>négatif</b>' : '\\(' + k + '\\), <b>positif</b>') + ', à gauche le signe contraire.';
  }
  function etapesProduit(a, b, c, d, rel, T) {
    var nbCols = T.cols.filter(function (co) { return co.sp === T.voulu; }).length;
    var meme = T.zs.length === 1;
    return [
      '<b>Valeur interdite</b> : on ne divise pas par 0. \\(' + facteur(c, d, true) + ' = 0\\) pour \\(x = ' + T.z2.tex +
      '\\) : cette valeur n\'est <b>jamais</b> solution.',
      regleFacteur(a, b, T.z1),
      regleFacteur(c, d, T.z2),
      'Le tableau de signes, comme pour un produit — une <b>double barre</b> sous la valeur interdite, dans la ligne du ' +
      'dénominateur et dans celle du quotient :' + tableHtml(a, b, c, d, T),
      'On garde les colonnes où le quotient est <b>' + signeTxt(T.voulu) + '</b>' +
      (nbCols ? ' (' + nbCols + ' colonne' + (nbCols > 1 ? 's' : '') + ')' : ' — il n\'y en a aucune') +
      (meme ? '' : (T.large ? ', et le zéro ' + T.z1.txt + ' du numérateur, puisque l\'inégalité est <b>large</b>'
                            : ' ; le zéro ' + T.z1.txt + ' du numérateur est exclu (inégalité stricte)')) +
      ' ; <b>' + T.z2.txt + ' est interdit</b>, crochet ouvert : <b>S = ' + T.txt + '</b>'
    ];
  }
  var INDICES_PROD = [
    'Commence par la valeur interdite : celle qui annule le dénominateur.',
    'Le tableau de signes est celui d\'un produit, avec une double barre sous la valeur interdite.',
    'Le zéro du numérateur est solution si l\'inégalité est large ; la valeur interdite, jamais.'
  ];
  var CONSIGNE = 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des solutions</strong>.';
  function questionProduit(rnd, a, b, c, d, rel, duree, indiceSup) {
    var T = tableau(a, b, c, d, rel);
    return {
      enonce: CONSIGNE + (indiceSup ? ' ' + indiceSup : ''),
      tex: '\\dfrac{' + facteur(a, b, true) + '}{' + facteur(c, d, true) + '} ' + TEX[rel] + ' 0',
      type: 'intervalle', reponse: T.txt, morceaux: T.pieces,
      etapes: etapesProduit(a, b, c, d, rel, T), indices: INDICES_PROD, duree: duree
    };
  }

  /* ======================================================================= */
  /* Les formes                                                              */
  /* ======================================================================= */

  // P1 — en quelle valeur s'annule ax + b ?
  function zeroFacteur(rnd, palier) {
    var a = rnd.entierNonNul(-5, 5), b = rnd.entierNonNul(-12, 12);
    if (palier === 1 && rnd.booleen(0.7)) { var x0 = rnd.entierNonNul(-6, 6); b = -a * x0; }
    var z = zero(a, b);
    return {
      enonce: 'Pour quelle valeur de \\(x\\) le facteur \\(' + facteur(a, b, true) + '\\) s\'annule-t-il ? ' +
              (z.txt.indexOf('/') >= 0 ? 'Donne la valeur <strong>exacte</strong> (une fraction).' : ''),
      type: 'nombre', reponse: z.v,
      etapes: [
        'On résout l\'équation \\(' + facteur(a, b, true) + ' = 0\\) : \\(' + absX(a).replace(/^x$/, 'x') + ' = ' + texNb(-b) + '\\)' +
        (a < 0 ? ' (avec le signe de ' + a + ')' : '') + ', donc \\(x = \\dfrac{' + texNb(-b) + '}{' + texNb(a) + '} = ' + z.tex + '\\).',
        'C\'est le <b>zéro</b> du facteur : la valeur qui sépare la zone où il est négatif de celle où il est positif.'
      ],
      indices: ['Résous ' + facteur(a, b) + ' = 0.'],
      duree: 40
    };
  }

  // P1 — la valeur interdite du quotient
  function valeurInterdite(rnd, palier) {
    var a = rnd.entierNonNul(-4, 4), b = rnd.entierNonNul(-9, 9), c = rnd.entierNonNul(-4, 4), d;
    if (palier === 1 && rnd.booleen(0.7)) d = -c * rnd.entierNonNul(-6, 6); else d = rnd.entierNonNul(-9, 9);
    if (d === 0) d = c;
    var z = zero(c, d), zn = zero(a, b);
    return {
      enonce: 'Quelle est la <strong>valeur interdite</strong> de \\(\\dfrac{' + facteur(a, b, true) + '}{' + facteur(c, d, true) + '}\\) ? ' +
              (z.txt.indexOf('/') >= 0 ? 'Donne la valeur <strong>exacte</strong> (une fraction).' : ''),
      type: 'nombre', reponse: z.v,
      etapes: [
        'On ne divise pas par 0 : la valeur interdite est celle qui annule le <b>dénominateur</b>, \\(' + facteur(c, d, true) + '\\).',
        '\\(' + facteur(c, d, true) + ' = 0 \\iff x = \\dfrac{' + texNb(-d) + '}{' + texNb(c) + '} = ' + z.tex + '\\). Valeur interdite : <b>' + z.txt + '</b>.',
        'Le numérateur, lui, s\'annule en \\(' + zn.tex + '\\) : le quotient y vaut 0, ce n\'est pas interdit.'
      ],
      indices: ['C\'est le dénominateur qui ne doit pas être nul.', 'Résous ' + facteur(c, d) + ' = 0.'],
      duree: 40
    };
  }

  // P1 — sur quel intervalle ax + b est-il positif / négatif ?
  function signeFacteur(rnd) {
    var a = rnd.choix([1, 2, 3, -1, -2, -3]), x0 = rnd.entierNonNul(-6, 6), b = -a * x0;
    var positif = rnd.booleen(0.5);
    var droite = (a > 0) === positif;                 // les solutions sont à droite du zéro
    var vrai = droite ? ']' + fr(x0) + ' ; +∞[' : ']−∞ ; ' + fr(x0) + '[';
    var pool = [vrai, droite ? ']−∞ ; ' + fr(x0) + '[' : ']' + fr(x0) + ' ; +∞[',
                ']' + fr(-x0) + ' ; +∞[', ']−∞ ; ' + fr(-x0) + '['];
    var choix = rnd.melange(pool.filter(function (t, i) { return pool.indexOf(t) === i; }).slice(0, 4));
    return {
      enonce: 'Sur quel intervalle le facteur \\(' + facteur(a, b, true) + '\\) est-il strictement <strong>' +
              (positif ? 'positif' : 'négatif') + '</strong> ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: [
        regleFacteur(a, b, zero(a, b)),
        'Il est donc ' + (a > 0 ? 'positif à droite de ' + fr(x0) + ', négatif à gauche' : 'négatif à droite de ' + fr(x0) + ', positif à gauche') +
        '. ' + (positif ? 'Positif' : 'Négatif') + ' strictement : <b>x ∈ ' + vrai + '</b>.',
        'Vérifie avec un nombre : pour \\(x = ' + texNb(x0 + (droite ? 1 : -1)) + '\\), \\(' + facteur(a, b, true) + ' = ' +
        texNb(a * (x0 + (droite ? 1 : -1)) + b) + '\\), bien ' + (positif ? 'positif' : 'négatif') + '.'
      ],
      indices: ['Trouve d\'abord le zéro du facteur.', 'À droite du zéro, le signe est celui de a = ' + fr(a) + '.'],
      duree: 50
    };
  }

  // P2 — la règle des signes, sur une colonne du tableau
  function signeColonne(rnd) {
    var s1 = rnd.signe(), s2 = rnd.signe(), a = rnd.choix([1, 2, 3]), c = rnd.choix([1, 2]);
    var z1 = rnd.entier(-4, 2), z2 = z1 + rnd.entier(2, 5);
    // sur ]z1 ; z2[, ax − a·z1 est +, cx − c·z2 est − : on ajuste les signes voulus
    var A = s1 * a, B = -A * z1, C = -s2 * c, D = -C * z2;
    var prod = s1 * s2;
    var choix = rnd.melange(['+', '−', 'cela dépend de x', '0']);
    return {
      enonce: 'Dans le tableau de signes de \\(\\dfrac{' + facteur(A, B, true) + '}{' + facteur(C, D, true) + '}\\), sur la colonne ' +
              '\\(]' + texNb(z1) + '\\,;' + texNb(z2) + '[\\), le numérateur est <b>' + signeTxt(s1) + '</b> et le dénominateur est <b>' +
              signeTxt(s2) + '</b>. Quel est le signe du <strong>quotient</strong> sur cette colonne ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(signeTxt(prod)),
      etapes: [
        'Règle des signes, la même que pour un produit : \\(\\dfrac{' + signeTxt(s1) + '}{' + signeTxt(s2) + '} = ' + signeTxt(prod) + '\\).',
        'Sur toute la colonne, numérateur et dénominateur gardent leur signe : le quotient aussi, il est <b>' + signeTxt(prod) + '</b> — sans dépendre de x.',
        'Vérifie en \\(x = ' + texNb((z1 + z2) / 2) + '\\) : \\(\\dfrac{' + texNb(A * (z1 + z2) / 2 + B) + '}{' + texNb(C * (z1 + z2) / 2 + D) + '} = ' +
        texNb(Math.round((A * (z1 + z2) / 2 + B) / (C * (z1 + z2) / 2 + D) * 100) / 100) + '\\).'
      ],
      indices: ['Deux signes contraires donnent −, deux signes identiques donnent +.'],
      duree: 30
    };
  }

  // P2 → P4 — résoudre (ax + b)/(cx + d) ⋈ 0
  function produit(rnd, palier) {
    var a, b, c, d, rel;
    if (palier === 2) {
      a = rnd.choix([1, 1, 2, 3]); c = rnd.choix([1, 1, 2, -1]);
      rel = rnd.choix(RELS);
    } else {
      a = rnd.entierNonNul(-3, 3); c = rnd.entierNonNul(-3, 3); rel = rnd.choix(RELS);
    }
    var x1 = rnd.entier(-5, 5), x2;
    do { x2 = rnd.entier(-5, 5); } while (x2 === x1);
    b = -a * x1; d = -c * x2;
    if (palier === 4) {
      var forme = rnd.choix(['fraction', 'fraction', 'double']);
      if (forme === 'fraction') {
        // un zéro non entier : on remplace b par un entier non multiple de a
        a = rnd.choix([2, 3, -2, 4, -3]);
        do { b = rnd.entierNonNul(-7, 7); } while (b % a === 0);
      } else {
        // le même zéro en haut et en bas : le quotient est constant, sauf le trou
        c = rnd.choix([1, 2, -1, -2, 3]); if (c === a) c = -c;
        d = -c * x1; b = -a * x1;
      }
    }
    return questionProduit(rnd, a, b, c, d, rel, palier === 2 ? 90 : 120,
      palier === 4 ? 'Deux morceaux se relient par ∪ ; s\'il n\'y a aucune solution, écris ∅.' : '');
  }

  // P3 — vrai ou faux
  var AFFIRMATIONS = [
    { t: '\\(-5\\) est solution de \\(\\dfrac{x - 2}{x + 5} \\geqslant 0\\).', ok: false,
      d: 'Pour \\(x = -5\\), le dénominateur vaut \\(0\\) : le quotient n\'existe pas. \\(-5\\) est la <b>valeur interdite</b>, jamais solution — même avec une inégalité large.' },
    { t: 'La valeur interdite de \\(\\dfrac{x + 1}{2x - 6}\\) est \\(3\\).', ok: true,
      d: 'Le dénominateur \\(2x - 6\\) s\'annule pour \\(x = 3\\) : on ne divise pas par 0.' },
    { t: 'La valeur interdite de \\(\\dfrac{x + 1}{2x - 6}\\) est \\(-1\\).', ok: false,
      d: '\\(-1\\) annule le <b>numérateur</b> : le quotient y vaut \\(0\\), ce qui est permis. La valeur interdite annule le dénominateur : c\'est \\(3\\).' },
    { t: 'Pour résoudre \\(\\dfrac{x + 3}{x - 1} \\leqslant 0\\), on peut multiplier les deux membres par \\(x - 1\\).', ok: false,
      d: '\\(x - 1\\) change de signe selon x : multiplier par lui retournerait l\'inégalité pour certains x et pas pour d\'autres. On fait un tableau de signes.' },
    { t: 'Là où il existe, \\(\\dfrac{x + 3}{x - 1}\\) a le même signe que \\((x + 3)(x - 1)\\).', ok: true,
      d: 'La règle des signes est la même pour un quotient et pour un produit : \\(\\frac{+}{-} = -\\) comme \\(+ \\times - = -\\). Seule la valeur interdite change les choses.' },
    { t: 'Les solutions de \\(\\dfrac{x - 1}{x - 4} \\leqslant 0\\) sont les x de \\([1\\,;4[\\).', ok: true,
      d: 'Entre 1 et 4 le quotient est négatif ; en \\(1\\) il vaut 0 (solution, inégalité large) ; \\(4\\) est interdit : crochet ouvert.' },
    { t: 'Les solutions de \\(\\dfrac{x - 1}{x - 4} \\leqslant 0\\) sont les x de \\([1\\,;4]\\).', ok: false,
      d: '\\(4\\) est la valeur interdite : le crochet doit être <b>ouvert</b> en 4. \\(S = [1\\,;4[\\).' },
    { t: '\\(\\dfrac{x - 2}{x - 2} \\geqslant 0\\) a pour ensemble de solutions \\(\\mathbb{R}\\).', ok: false,
      d: 'Le quotient vaut \\(1\\) partout… sauf en \\(2\\), où il n\'existe pas. \\(S = \\;]-\\infty\\,;2[\\;\\cup\\;]2\\,;+\\infty[\\).' },
    { t: 'Dans un tableau de signes, on met une double barre sous la valeur interdite.', ok: true,
      d: 'Dans la ligne du dénominateur et dans celle du quotient : le quotient n\'y est pas nul, il n\'existe pas.' },
    { t: 'Un quotient est nul quand son dénominateur est nul.', ok: false,
      d: 'Un quotient est nul quand son <b>numérateur</b> est nul. Un dénominateur nul, c\'est une valeur interdite.' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Rappel : un quotient se traite comme un produit dans le tableau de signes, et sa valeur interdite n\'est jamais solution.'],
      indices: ['Teste avec un nombre précis.'],
      duree: 40
    };
  }

  // P4 — quelle inéquation a pour solutions S ?
  function laquelle(rnd) {
    var x1 = rnd.entier(-4, 2), x2 = x1 + rnd.entier(1, 4);
    var a = rnd.choix([1, 1, 2, -1]), c = rnd.choix([1, 1, -1, 2]);
    var b = -a * x1, d = -c * x2, rel = rnd.choix(RELS);
    var T = tableau(a, b, c, d, rel);
    function eq(r, num, den) { return '\\(\\dfrac{' + (num || facteur(a, b, true)) + '}{' + (den || facteur(c, d, true)) + '} ' + TEX[r] + ' 0\\)'; }
    var MIROIR = { '<': '>', '>': '<', '⩽': '⩾', '⩾': '⩽' };
    var STRICT = { '<': '⩽', '⩽': '<', '>': '⩾', '⩾': '>' };
    var vrai = eq(rel);
    // Le quatrième leurre échange numérateur et dénominateur : mêmes colonnes,
    // mais la valeur interdite change de côté — visible seulement si
    // l'inégalité est large. Sinon, des zéros décalés.
    var quatre = T.large ? eq(rel, facteur(c, d, true), facteur(a, b, true))
                         : eq(rel, facteur(a, -a * (x1 + 1), true), facteur(c, -c * (x2 + 1), true));
    var pool = [vrai, eq(MIROIR[rel]), eq(STRICT[rel]), quatre];
    var choix = rnd.melange(pool.filter(function (t, i) { return pool.indexOf(t) === i; }));
    return {
      enonce: 'Quelle inéquation a pour ensemble de solutions \\(S = ' + T.txt.replace(/−/g, '-').replace(/∞/g, '\\infty').replace(/∪/g, '\\cup').replace(/;/g, '\\,;') + '\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: [
        'Les bornes de S sont les zéros du numérateur et du dénominateur : ' + T.zs.map(function (z) { return z.txt; }).join(' et ') +
        '. Le crochet <b>ouvert</b> en ' + T.z2.txt + ' quelle que soit l\'inégalité désigne la valeur interdite : ' +
        T.z2.txt + ' annule le dénominateur.',
        'Le tableau de signes :' + tableHtml(a, b, c, d, T),
        'S est fait des colonnes où le quotient est <b>' + signeTxt(T.voulu) + '</b>' +
        (T.large ? ', le zéro du numérateur compris (crochet fermé : inégalité large)' : ', le zéro du numérateur exclu (inégalité stricte)') +
        ' : c\'est ' + vrai + '.'
      ],
      indices: ['Le crochet ouvert quoi qu\'il arrive est du côté de la valeur interdite : c\'est le dénominateur qui s\'y annule.', 'Puis compare le signe du quotient dans une colonne de S.'],
      duree: 90
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'ineq-quotient',
    competence: 'ineq-quotient',
    level: '2nde',
    titre: 'Inéquations quotient',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) {
        var f1 = rnd.choix(['interdite', 'interdite', 'signe', 'zero']);
        return f1 === 'interdite' ? valeurInterdite(rnd, 1) : f1 === 'signe' ? signeFacteur(rnd) : zeroFacteur(rnd, 1);
      }
      if (palier === 2) {
        var f2 = rnd.choix(['produit', 'produit', 'colonne', 'interdite']);
        return f2 === 'produit' ? produit(rnd, 2) : f2 === 'colonne' ? signeColonne(rnd) : valeurInterdite(rnd, 2);
      }
      if (palier === 3) return rnd.booleen(0.7) ? produit(rnd, 3) : vraiFaux(rnd);
      var f4 = rnd.choix(['produit', 'produit', 'laquelle', 'vraifaux']);
      return f4 === 'produit' ? produit(rnd, 4) : f4 === 'laquelle' ? laquelle(rnd) : vraiFaux(rnd);
    }
  });
})();
