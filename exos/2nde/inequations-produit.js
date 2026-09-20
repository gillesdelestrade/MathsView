/*
 * ineq-produit — les inéquations produit (leçon 2nde « Inéquations produit »).
 *
 * Les formes suivent la progression de la leçon :
 *   P1  le signe d'UN facteur : en quelle valeur s'annule ax + b (réponse
 *       exacte, une fraction si besoin), et sur quel intervalle il est positif
 *       ou négatif (QCM : le zéro, et le signe de a à droite) ;
 *   P2  le produit, avec des zéros entiers : on lit la colonne (la règle des
 *       signes, en QCM), puis on résout (ax + b)(cx + d) ⋈ 0 — la réponse est
 *       l'ensemble S, un ou deux morceaux ;
 *   P3  des coefficients de tout signe, des inégalités strictes et larges, et
 *       des vrai/faux sur les pièges (« un produit positif a un facteur
 *       positif », « on divise par le premier facteur ») ;
 *   P4  des zéros non entiers (1/2, −2/3), le zéro double (S = {1}, ou ℝ privé
 *       d'un point), et la lecture inverse : quelle inéquation a pour
 *       solutions cet ensemble ?
 *
 * Tout part des ZÉROS : on les choisit, on fabrique les facteurs autour, et la
 * correction refait le tableau de signes — un vrai tableau, celui de la leçon —
 * avant de lire S. La réponse est comparée par structure (type « intervalle »),
 * bornes, crochets et morceaux compris.
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
    return { z1: z1, z2: z2, zs: zs, cols: cols, voulu: voulu, large: large, pieces: pieces, txt: txt };
  }

  // Le tableau en HTML, celui de la leçon (classe sg-table de css/style.css).
  function tableHtml(a, b, c, d, T) {
    function cell(s) { return '<td class="' + (s > 0 ? 'sg-plus' : s < 0 ? 'sg-moins' : '') + '">' + signeTxt(s) + '</td>'; }
    function ligne(nom, key, zf) {
      var h = '<tr><th>' + nom + '</th><td></td>';
      T.cols.forEach(function (co, i) {
        h += cell(key === 'p' ? co.sp : co[key]);
        if (i < T.zs.length) {
          var nul = key === 'p' || Math.abs(T.zs[i].v - zf) < 1e-9;
          h += '<td class="sg-bar">' + (nul ? '0' : '<span class="sg-trait"></span>') + '</td>';
        }
      });
      return h + '<td></td></tr>';
    }
    var h = '<table class="sg-table"><tr><th>x</th><td>−∞</td>';
    T.cols.forEach(function (co, i) { h += '<td></td>'; if (i < T.zs.length) h += '<td class="sg-bar">' + T.zs[i].txt + '</td>'; });
    h += '<td>+∞</td></tr>';
    h += ligne(facteur(a, b), 's1', T.z1.v) + ligne(facteur(c, d), 's2', T.z2.v) + ligne('produit', 'p', null);
    return h + '</table>';
  }

  function regleFacteur(k, m, z) {
    return '\\(' + facteur(k, m, true) + '\\) s\'annule en \\(x = ' + z.tex + '\\) ; à droite de ce zéro il a le signe de ' +
           (k < 0 ? '\\(' + k + '\\), <b>négatif</b>' : '\\(' + k + '\\), <b>positif</b>') + ', à gauche le signe contraire.';
  }
  function etapesProduit(a, b, c, d, rel, T) {
    var nbCols = T.cols.filter(function (co) { return co.sp === T.voulu; }).length;
    return [
      regleFacteur(a, b, T.z1),
      regleFacteur(c, d, T.z2),
      'Le tableau de signes, zéros dans l\'ordre croissant, et la ligne du produit par la <b>règle des signes</b> :' +
      tableHtml(a, b, c, d, T),
      'On garde les colonnes où le produit est <b>' + signeTxt(T.voulu) + '</b>' +
      (nbCols ? ' (' + nbCols + ' colonne' + (nbCols > 1 ? 's' : '') + ')' : ' — il n\'y en a aucune') +
      (T.large ? ', et les zéros, puisque l\'inégalité est <b>large</b>' : ' ; les zéros sont <b>exclus</b> (inégalité stricte)') +
      ' : <b>S = ' + T.txt + '</b>'
    ];
  }
  var INDICES_PROD = [
    'Trouve le zéro de chaque facteur, puis fais le tableau de signes.',
    'Ligne produit : + × − = −, − × − = +. Puis garde les colonnes du signe demandé.',
    'Inégalité large : les zéros sont solutions (crochets fermés). Stricte : exclus.'
  ];
  var CONSIGNE = 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des solutions</strong>.';
  function questionProduit(rnd, a, b, c, d, rel, duree, indiceSup) {
    var T = tableau(a, b, c, d, rel);
    return {
      enonce: CONSIGNE + (indiceSup ? ' ' + indiceSup : ''),
      tex: '(' + facteur(a, b, true) + ')(' + facteur(c, d, true) + ') ' + TEX[rel] + ' 0',
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
      enonce: 'Dans le tableau de signes de \\((' + facteur(A, B, true) + ')(' + facteur(C, D, true) + ')\\), sur la colonne ' +
              '\\(]' + texNb(z1) + '\\,;' + texNb(z2) + '[\\), le premier facteur est <b>' + signeTxt(s1) + '</b> et le second est <b>' +
              signeTxt(s2) + '</b>. Quel est le signe du <strong>produit</strong> sur cette colonne ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(signeTxt(prod)),
      etapes: [
        'Règle des signes : \\(' + signeTxt(s1) + ' \\times ' + signeTxt(s2) + ' = ' + signeTxt(prod) + '\\).',
        'Sur toute la colonne, chaque facteur garde son signe : le produit aussi, il est <b>' + signeTxt(prod) + '</b> — sans dépendre de x.',
        'Vérifie en \\(x = ' + texNb((z1 + z2) / 2) + '\\) : \\((' + facteur(A, B, true) + ')(' + facteur(C, D, true) + ') = ' +
        texNb((A * (z1 + z2) / 2 + B) * (C * (z1 + z2) / 2 + D)) + '\\).'
      ],
      indices: ['Deux signes contraires donnent −, deux signes identiques donnent +.'],
      duree: 30
    };
  }

  // P2 → P4 — résoudre (ax + b)(cx + d) ⋈ 0
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
        // le zéro double : les deux facteurs s'annulent au même endroit
        c = rnd.choix([1, 2, -1, -2, 3]); if (c === a) c = -c;
        d = -c * x1; b = -a * x1;
      }
    }
    return questionProduit(rnd, a, b, c, d, rel, palier === 2 ? 90 : 120,
      palier === 4 ? 'Un morceau réduit à un point s\'écrit {1} ; deux morceaux se relient par ∪.' : '');
  }

  // P3 — vrai ou faux
  var AFFIRMATIONS = [
    { t: 'Si \\((x - 2)(x + 5) > 0\\), alors \\(x - 2 > 0\\) ou \\(x + 5 > 0\\).', ok: false,
      d: 'Un produit positif peut venir de deux facteurs <b>négatifs</b> : pour \\(x = -6\\), \\((-8)(-1) = 8 > 0\\) alors qu\'aucun facteur n\'est positif. C\'est pour cela qu\'on fait un tableau de signes.' },
    { t: 'Un produit de deux facteurs est nul si et seulement si l\'un des facteurs est nul.', ok: true,
      d: 'C\'est la règle du produit nul : elle donne les zéros, c\'est-à-dire les colonnes du tableau où le produit vaut 0.' },
    { t: 'Sur un intervalle où les deux facteurs sont négatifs, le produit est positif.', ok: true,
      d: '\\(- \\times - = +\\) : par exemple \\((-2)(-3) = 6\\).' },
    { t: 'Les solutions de \\((x - 1)(x - 4) \\leqslant 0\\) sont les x de \\([1\\,;4]\\).', ok: true,
      d: 'Entre les deux zéros, \\(x - 1 > 0\\) et \\(x - 4 < 0\\) : le produit est négatif. Inégalité large : \\(1\\) et \\(4\\) sont solutions. \\(S = [1\\,;4]\\).' },
    { t: 'Les solutions de \\((x - 1)(x - 4) < 0\\) sont les x de \\([1\\,;4]\\).', ok: false,
      d: 'Inégalité <b>stricte</b> : en \\(x = 1\\) le produit vaut \\(0\\), et \\(0 < 0\\) est faux. \\(S = \;]1\\,;4[\\).' },
    { t: 'Pour résoudre \\((x + 3)(2x - 1) \\geqslant 0\\), on peut diviser les deux membres par \\(x + 3\\).', ok: false,
      d: '\\(x + 3\\) change de signe selon x : diviser par lui retournerait l\'inégalité pour certains x et pas pour d\'autres — et il vaut 0 en \\(-3\\). On fait un tableau de signes.' },
    { t: 'Le facteur \\(-2x + 6\\) est positif pour \\(x > 3\\).', ok: false,
      d: 'À droite de son zéro \\(3\\), \\(-2x + 6\\) a le signe de \\(-2\\) : il est <b>négatif</b>. Pour \\(x = 4\\), \\(-8 + 6 = -2\\).' },
    { t: 'L\'inéquation \\((x - 2)^2 \\leqslant 0\\) a une seule solution.', ok: true,
      d: 'Un carré est toujours positif ou nul : \\((x - 2)^2 \\leqslant 0\\) impose \\((x - 2)^2 = 0\\), donc \\(x = 2\\). \\(S = \\{2\\}\\).' },
    { t: 'L\'inéquation \\((x - 2)^2 > 0\\) n\'a aucune solution.', ok: false,
      d: 'C\'est presque le contraire : un carré est strictement positif partout sauf en son zéro. \\(S = \;]-\\infty\\,;2[\;\\cup\;]2\\,;+\\infty[\\).' },
    { t: 'Dans un tableau de signes, on place les zéros dans l\'ordre croissant.', ok: true,
      d: 'La première ligne est celle de x, qui croît de \\(-\\infty\\) à \\(+\\infty\\) : les zéros y apparaissent dans l\'ordre.' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Rappel : le signe d\'un produit se lit sur le signe de ses facteurs, dans un tableau de signes.'],
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
    function eq(r) { return '\\((' + facteur(a, b, true) + ')(' + facteur(c, d, true) + ') ' + TEX[r] + ' 0\\)'; }
    var MIROIR = { '<': '>', '>': '<', '⩽': '⩾', '⩾': '⩽' };
    var STRICT = { '<': '⩽', '⩽': '<', '>': '⩾', '⩾': '>' };
    var vrai = eq(rel);
    // Le quatrième leurre a les zéros opposés (l'erreur « x − 2 s'annule en −2 »)
    // — sauf si les zéros sont déjà opposés l'un de l'autre : le leurre aurait
    // alors les mêmes zéros, et pourrait être une bonne réponse. On les décale.
    var sym = x2 === -x1;
    var b4 = sym ? -a * (x1 + 1) : -b, d4 = sym ? -c * (x2 + 1) : -d;
    var pool = [vrai, eq(MIROIR[rel]), eq(STRICT[rel]),
                '\\((' + facteur(a, b4, true) + ')(' + facteur(c, d4, true) + ') ' + TEX[rel] + ' 0\\)'];
    var choix = rnd.melange(pool.filter(function (t, i) { return pool.indexOf(t) === i; }));
    return {
      enonce: 'Quelle inéquation a pour ensemble de solutions \\(S = ' + T.txt.replace(/−/g, '-').replace(/∞/g, '\\infty').replace(/∪/g, '\\cup').replace(/;/g, '\\,;') + '\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: [
        'Les bornes de S sont les zéros des facteurs : ' + T.zs.map(function (z) { return z.txt; }).join(' et ') +
        '. Trois propositions ont ces zéros, la quatrième non.',
        'Le tableau de signes des deux facteurs :' + tableHtml(a, b, c, d, T),
        'S est fait des colonnes où le produit est <b>' + signeTxt(T.voulu) + '</b>' +
        (T.large ? ', zéros compris (crochets fermés : inégalité large)' : ', zéros exclus (crochets ouverts : inégalité stricte)') +
        ' : c\'est ' + vrai + '.'
      ],
      indices: ['Les zéros des facteurs sont les bornes de S.', 'Crochets fermés : inégalité large. Puis compare le signe du produit dans une colonne de S.'],
      duree: 90
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'ineq-produit',
    competence: 'ineq-produit',
    level: '2nde',
    titre: 'Inéquations produit',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.5) ? zeroFacteur(rnd, 1) : signeFacteur(rnd);
      if (palier === 2) {
        var f2 = rnd.choix(['produit', 'produit', 'colonne', 'zero']);
        return f2 === 'produit' ? produit(rnd, 2) : f2 === 'colonne' ? signeColonne(rnd) : zeroFacteur(rnd, 2);
      }
      if (palier === 3) return rnd.booleen(0.7) ? produit(rnd, 3) : vraiFaux(rnd);
      var f4 = rnd.choix(['produit', 'produit', 'laquelle', 'vraifaux']);
      return f4 === 'produit' ? produit(rnd, 4) : f4 === 'laquelle' ? laquelle(rnd) : vraiFaux(rnd);
    }
  });
})();
