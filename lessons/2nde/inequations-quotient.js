/*
 * Inéquations quotient (2nde) — résoudre (ax + b)/(cx + d) ⩾ 0 avec un tableau
 * de signes.
 *
 * Tout ce que sait faire la leçon « Inéquations produit » sert ici tel quel :
 * le signe d'un quotient se lit sur le signe du numérateur et du dénominateur,
 * avec la même règle des signes. Une seule chose change, et c'est tout
 * l'objet de cette leçon : le dénominateur ne doit JAMAIS être nul. Sa valeur
 * d'annulation est une VALEUR INTERDITE : dans le tableau, une double barre à
 * sa colonne ; dans la réponse, un crochet toujours ouvert de ce côté, que
 * l'inégalité soit stricte ou large.
 *
 *   1) le numérateur ax + b : une droite, son zéro, sa bande de signe ;
 *   2) le dénominateur cx + d : pareil, mais son zéro est barré deux fois — on
 *      ne divise pas par 0 — et la figure le marque d'un pointillé sur toute
 *      la hauteur ;
 *   3) la bande du quotient : la règle des signes colonne par colonne, un 0
 *      sous le zéro du numérateur, une double barre sous la valeur interdite ;
 *   4) on garde les colonnes du signe demandé ; le zéro du numérateur est
 *      solution si l'inégalité est large, la valeur interdite ne l'est jamais.
 *
 * Le cas où numérateur et dénominateur s'annulent au même endroit —
 * (x − 1)/(2x − 2) ⩾ 0 — n'est pas écarté : le quotient vaut 1/2 partout où il
 * existe, et S est ℝ privé de 1 — deux morceaux, un trou.
 *
 * Le point sur l'axe se déplace à la souris et refait le calcul ; posé sur la
 * valeur interdite, il dit « division par 0 ».
 *
 * Même discipline que les autres leçons animées : état absolu par étape,
 * rafraîchissement explicite, tout ce que lisent les textes calculé avant le
 * premier board.create, et un polygone par couleur (JSXGraph 1.11 ne redessine
 * pas un polygone dont fillColor change).
 */
MathsView.register({
  id: 'inequations-quotient',
  title: 'Inéquations quotient',
  level: '2nde',
  category: 'algebre',
  theme: 'Algèbre — le tableau de signes de (ax + b)/(cx + d), et la valeur interdite',
  description:
    'Un quotient se traite <strong>comme un produit</strong> : son signe se lit sur le signe ' +
    'du numérateur et du dénominateur, avec la même règle des signes et le même tableau.' +
    '<br>Une seule chose change : on ne divise pas par \\(0\\). La valeur qui annule le ' +
    'dénominateur est une <strong>valeur interdite</strong> — une double barre dans le ' +
    'tableau, et jamais une solution, même si l\'inégalité est large.' +
    '<br>La figure trace le numérateur puis le dénominateur, remplit leurs bandes de signe, ' +
    'puis celle du quotient ; il ne reste qu\'à garder les colonnes du signe demandé, avec le ' +
    'bon crochet à chaque bout.' +
    '<br>Choisis une inéquation ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>). <strong>Déplace le point</strong> sur l\'axe pour ' +
    'vérifier le signe en une valeur.',
  notes:
    '<ul>' +
    '<li><strong>La valeur interdite.</strong> \\(\\dfrac{2x-4}{-x+3}\\) n\'existe pas pour ' +
    '\\(x=3\\) : le dénominateur y vaut \\(0\\). Avant tout tableau, on l\'écrit : ' +
    '« valeur interdite : \\(x=3\\) ». Elle n\'est jamais solution.</li>' +
    '<li><strong>Le signe d\'un quotient.</strong> C\'est celui du produit : ' +
    '\\(\\dfrac{+}{-}=-\\), \\(\\dfrac{-}{-}=+\\). Le tableau est le même que pour un produit ' +
    '— une ligne par facteur, une pour le quotient — avec une <strong>double barre</strong> ' +
    'sous la valeur interdite, dans la ligne du dénominateur et dans celle du quotient.</li>' +
    '<li><strong>Lire la réponse.</strong> \\(\\dfrac{2x-4}{-x+3}\\geqslant 0\\) : on garde la ' +
    'colonne où le quotient est \\(+\\), le zéro \\(2\\) du numérateur (inégalité large, le ' +
    'quotient y vaut \\(0\\)), mais pas \\(3\\) : \\(S=[2\\,;3[\\). Le crochet est ' +
    '<strong>ouvert en \\(3\\)</strong> quoi qu\'il arrive.</li>' +
    '<li><strong>Le piège classique.</strong> Multiplier les deux membres par \\(-x+3\\) pour ' +
    '« faire disparaître la fraction » est interdit : ce facteur change de signe selon ' +
    '\\(x\\), l\'inégalité se retournerait pour certains \\(x\\) et pas pour d\'autres. On ' +
    'passe par le tableau de signes.</li>' +
    '<li><strong>Le même zéro en haut et en bas.</strong> \\(\\dfrac{x-1}{2x-2}\\) vaut ' +
    '\\(\\dfrac12\\) partout où il existe, c\'est-à-dire pour \\(x\\neq 1\\). Ainsi ' +
    '\\(\\dfrac{x-1}{2x-2}\\geqslant 0\\) a pour solutions ' +
    '\\(]-\\infty\\,;1[\\;\\cup\\;]1\\,;+\\infty[\\) : tout, sauf le trou.</li>' +
    '<li><strong>Vérifier.</strong> Pour \\(x=2{,}5\\), \\(2x-4=1\\) et \\(-x+3=0{,}5\\), ' +
    'quotient \\(2\\), positif : c\'est bien la colonne gardée. Pour \\(x=3\\), rien à ' +
    'calculer — c\'est interdit.</li>' +
    '</ul>',
  board: {
    boundingbox: [-6.5, 10.8, 6.5, -11.6], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Inéquations quotient',
    figures: [{
      legende: '(2x − 4)/(−x + 3) ⩾ 0 : valeur interdite 3, double barre, et S = [2 ; 3[.',
      boundingbox: [-0.4, 4.6, 10.4, -0.6],
      keepaspectratio: false,
      largeur: 62, hauteur: 34,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', no = '#dc2626', b1 = '#2563eb', b2 = '#ea580c';
        var X = [0, 2.6, 4.6, 6.6, 8.6, 10], Y = [4.2, 3.2, 2.2, 1.2, 0.2];
        Y.forEach(function (y) { board.create('segment', [[X[0], y], [X[5], y]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false }); });
        [X[0], X[1], X[5]].forEach(function (x) { board.create('segment', [[x, Y[0]], [x, Y[4]]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false }); });
        function t(x, y, s, col, taille) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 10, color: col || g, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        function barre(x, y, double) {
          var dx = double ? 0.09 : 0;
          board.create('segment', [[x - dx, y - 0.45], [x - dx, y + 0.45]], { strokeColor: double ? no : g, strokeWidth: double ? 1.6 : 1, fixed: true, highlight: false });
          if (double) board.create('segment', [[x + dx, y - 0.45], [x + dx, y + 0.45]], { strokeColor: no, strokeWidth: 1.6, fixed: true, highlight: false });
        }
        t(1.3, 3.7, 'x'); t(1.3, 2.7, '2x − 4', b1); t(1.3, 1.7, '−x + 3', b2); t(1.3, 0.7, 'quotient');
        t(3.0, 3.7, '−∞'); t(X[2], 3.7, '2'); t(X[3], 3.7, '3', no); t(9.6, 3.7, '+∞');
        var rows = [[2.7, ['−', '0', '+', '|', '+']], [1.7, ['+', '|', '+', '‖', '−']], [0.7, ['−', '0', '+', '‖', '−']]];
        rows.forEach(function (r) {
          var y = r[0], s = r[1];
          t(3.6, y, s[0], s[0] === '+' ? ok : no, 12); t(5.6, y, s[2], s[2] === '+' ? ok : no, 12); t(7.6, y, s[4], s[4] === '+' ? ok : no, 12);
          [[X[2], s[1]], [X[3], s[3]]].forEach(function (z) {
            if (z[1] === '0') t(z[0], y, '0', g, 11); else barre(z[0], y, z[1] === '‖');
          });
        });
        board.create('polygon', [[X[2], 0.2], [X[3], 0.2], [X[3], 1.2], [X[2], 1.2]], { fillColor: ok, fillOpacity: .18, borders: { visible: false }, vertices: { visible: false }, highlight: false, fixed: true });
        t(5.0, -0.25, 'S = [2 ; 3[', ok, 12);
        t(8.7, -0.25, '3 : interdit', no, 9);
      }
    }],
    points: [
      'On ne divise pas par 0 : la valeur qui annule le <b>dénominateur</b> est <b>interdite</b>. On l\'écrit avant tout.',
      'Le signe d\'un quotient se lit <b>comme celui d\'un produit</b> : même tableau, même règle des signes.',
      'Sous la valeur interdite : une <b>double barre</b>, dans la ligne du dénominateur et dans celle du quotient.',
      'Le zéro du numérateur est solution si l\'inégalité est large ; la valeur interdite ne l\'est <b>jamais</b> : crochet ouvert.',
      'Ne jamais multiplier par le dénominateur : il change de signe selon x.',
      'Même zéro en haut et en bas : le quotient est constant, S est ℝ privé de ce point (ou vide).'
    ],
    exemples: [
      '\\( \\dfrac{2x - 4}{-x + 3} \\geqslant 0 \\) : interdit 3 ; zéro 2 ; quotient − 0 + ‖ − ; \\( S = [2\\,;3[ \\).',
      '\\( \\dfrac{x + 1}{x - 3} \\leqslant 0 \\) : interdit 3 ; quotient + 0 − ‖ + ; \\( S = [-1\\,;3[ \\) — fermé en −1, ouvert en 3.',
      '\\( \\dfrac{x - 1}{2x - 2} \\geqslant 0 \\) : le quotient vaut \\( \\tfrac12 \\) pour \\( x \\neq 1 \\) ; \\( S = \\;]-\\infty\\,;1[ \\;\\cup\\; ]1\\,;+\\infty[ \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C1 = '#2563eb', C2 = '#ea580c', C_P = '#7c3aed';   // numérateur, dénominateur, quotient
    var C_OK = '#16a34a', C_NO = '#dc2626';               // + / solution, −
    var INK = '#334155', SOFT = '#94a3b8';
    var ARROW = { type: 2, size: 7 };
    var REL = { lt: '<', gt: '>', le: '⩽', ge: '⩾' };
    var RELH = { lt: '&lt;', gt: '&gt;', le: '⩽', ge: '⩾' };

    /* ==================================================================== */
    /* Écritures                                                            */
    /* ==================================================================== */
    function fmt(v) {
      var t = Math.round(v * 100) / 100;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    function paren(v) { return v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
    // −b/a en écriture exacte : « 2 », « 0,5 », « −1/3 ».
    function zeroTxt(a, b) {
      var n = -b, d = a;
      if (d < 0) { n = -n; d = -d; }
      var g = pgcd(n, d); n /= g; d /= g;
      if (d === 1) return fmt(n);
      return termine(d) ? fmt(n / d) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;
    }
    function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
    function facteur(k, m) {          // « 2x − 4 », « −x + 3 », « x »
      var t = (k < 0 ? '−' : '') + absX(k);
      if (m !== 0) t += (m < 0 ? ' − ' : ' + ') + Math.abs(m);
      return t;
    }
    function sgn(v) { return v > 1e-12 ? 1 : v < -1e-12 ? -1 : 0; }
    function signeTxt(s) { return s > 0 ? '+' : s < 0 ? '−' : '0'; }
    function couleur(s) { return s > 0 ? C_OK : s < 0 ? C_NO : INK; }

    /* ==================================================================== */
    /* Le problème et tout ce qu'on en tire                                  */
    /* ==================================================================== */
    var a = 2, b = -4, c = -1, d = 3, rel = 'ge';       // (2x − 4)/(−x + 3) ⩾ 0
    var D = null;                                       // le tableau, calculé
    var XL = -6, XR = 6;

    function f1(x) { return a * x + b; }
    function f2(x) { return c * x + d; }
    function quot(x) { return f1(x) / f2(x); }
    function interdit(x) { return sgn(f2(x)) === 0; }
    function ok(x) {
      if (interdit(x)) return false;                    // on ne divise pas par 0
      var v = quot(x), e = 1e-9;
      return rel === 'lt' ? v < -e : rel === 'gt' ? v > e : rel === 'le' ? v <= e : v >= -e;
    }

    function calcule() {
      var z1 = -b / a, z2 = -d / c;
      var zs = Math.abs(z1 - z2) < 1e-9 ? [z1] : [Math.min(z1, z2), Math.max(z1, z2)];
      var bornes = [-Infinity].concat(zs, [Infinity]);
      var cols = [];
      for (var i = 0; i + 1 < bornes.length; i++) {
        var lo = bornes[i], hi = bornes[i + 1];
        var mid = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
        cols.push({ lo: lo, hi: hi, mid: mid, s1: sgn(f1(mid)), s2: sgn(f2(mid)), sp: sgn(f1(mid)) * sgn(f2(mid)) });
      }
      var voulu = (rel === 'gt' || rel === 'ge') ? 1 : -1;
      var large = rel === 'ge' || rel === 'le';
      // Les morceaux de S : les colonnes du bon signe, puis, si l'inégalité
      // est large, le zéro du numérateur — rattaché à un voisin gardé, ou
      // seul. La valeur interdite, elle, n'entre jamais.
      var pieces = cols.filter(function (co) { return co.sp === voulu; })
                       .map(function (co) { return { a: co.lo, b: co.hi, oa: true, ob: true }; });
      if (large) {
        zs.forEach(function (z) {
          if (Math.abs(z - z2) < 1e-9) return;          // interdit
          var g = null, dr = null;
          pieces.forEach(function (p) { if (p.b === z) g = p; if (p.a === z) dr = p; });
          if (g) g.ob = false;
          if (dr) dr.oa = false;
          if (!g && !dr) pieces.push({ a: z, b: z, oa: false, ob: false });
        });
      }
      pieces.sort(function (p, q) { return p.a - q.a; });
      for (var j = 0; j + 1 < pieces.length;) {
        if (pieces[j].b === pieces[j + 1].a && !pieces[j].ob && !pieces[j + 1].oa) {
          pieces[j].b = pieces[j + 1].b; pieces[j].ob = pieces[j + 1].ob; pieces.splice(j + 1, 1);
        } else j++;
      }
      D = { z1: z1, z2: z2, zs: zs, cols: cols, voulu: voulu, large: large, pieces: pieces,
            zTxt: zs.map(function (z) { return Math.abs(z - z1) < 1e-9 ? zeroTxt(a, b) : zeroTxt(c, d); }),
            z1Txt: zeroTxt(a, b), z2Txt: zeroTxt(c, d) };
      D.Stxt = ensembleTxt(pieces);
    }
    function borneTxt(v) {
      if (v === -Infinity) return '−∞';
      if (v === Infinity) return '+∞';
      for (var i = 0; i < D.zs.length; i++) if (Math.abs(D.zs[i] - v) < 1e-9) return D.zTxt[i];
      return fmt(v);
    }
    function ensembleTxt(pieces) {
      if (!pieces.length) return '∅';
      if (pieces.length === 1 && pieces[0].a === -Infinity && pieces[0].b === Infinity) return 'ℝ';
      return pieces.map(function (p) {
        if (p.a === p.b) return '{' + borneTxt(p.a) + '}';
        return (p.oa ? ']' : '[') + borneTxt(p.a) + ' ; ' + borneTxt(p.b) + (p.ob ? '[' : ']');
      }).join(' ∪ ');
    }
    function bornesFenetre() {
      var lo = Math.min.apply(null, D.zs), hi = Math.max.apply(null, D.zs);
      XL = Math.floor(lo) - 3; XR = Math.ceil(hi) + 3;
      while (XR - XL < 8) { XL--; XR++; }
      board.setBoundingBox([XL - 0.6, 10.8, XR + 0.6, -11.6], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['f1', 'f2', 'prod', 'sol'];
    // Ce qu'on écrit sous le zéro z dans la ligne key : « 0 » (le numérateur
    // s'y annule), « ‖ » (valeur interdite), ou une simple barre.
    function celluleZero(key, z) {
      var estZ2 = Math.abs(z - D.z2) < 1e-9, estZ1 = Math.abs(z - D.z1) < 1e-9;
      if (key === 'f1') return estZ1 ? '0' : '|';
      if (key === 'f2') return estZ2 ? '‖' : '|';
      return estZ2 ? '‖' : '0';
    }
    var vis = { f1: 0, f2: 0, prod: 0, sol: 0 };
    var xv = 2.5;                                       // le point de test
    function applyStage(i, p) {
      PLAN.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      syncPX(); refresh(); renderPanel();
    }
    function clampX(v) { return Math.max(XL, Math.min(XR, Math.round(v * 2) / 2)); }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    var YT = 6.5;                                       // le repère va de −YT à YT
    var ROWS = { f1: -7.7, f2: -8.9, prod: -10.1 };     // les trois bandes du tableau
    var HB = 0.42;                                      // demi-hauteur d'une bande

    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function pt(fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, name: '', withLabel: false }); }
    function etiquette(fx, fy, txt, col, taille, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: col,
                cssStyle: 'font-weight:800;background:rgba(255,255,255,.92);padding:0 4px;border-radius:5px;white-space:nowrap',
                fixed: true, highlight: false, layer: 9 };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [fx, fy, txt], o);
    }
    function cx() { return (XL + XR) / 2; }

    // Les axes.
    board.create('segment', [pt(function () { return XL - 0.6; }, function () { return 0; }),
                             pt(function () { return XR + 0.6; }, function () { return 0; })],
      { strokeColor: INK, strokeWidth: 1.6, firstArrow: ARROW, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    board.create('segment', [[0, -YT], [0, YT]], { strokeColor: INK, strokeWidth: 1.6, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    for (var i = 0; i < 17; i++) {
      (function (i) {
        var gx = function () { return XL + i; }, dans = function () { return XL + i <= XR; };
        board.create('segment', [pt(gx, function () { return -0.18; }), pt(gx, function () { return 0.18; })],
          { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3, visible: dans });
        board.create('text', [gx, -0.62, function () { return fmt(XL + i); }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3, visible: dans });
      })(i);
    }
    for (var y = -6; y <= 6; y += 2) {
      if (y === 0) continue;
      board.create('segment', [[-0.15, y], [0.15, y]], { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3 });
      board.create('text', [-0.3, y, fmt(y)], { anchorX: 'right', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3 });
    }
    // Le fond des trois bandes.
    board.create('polygon', [pt(function () { return XL - 0.6; }, function () { return ROWS.prod - HB - 0.25; }),
                             pt(function () { return XR + 0.6; }, function () { return ROWS.prod - HB - 0.25; }),
                             pt(function () { return XR + 0.6; }, function () { return ROWS.f1 + HB + 0.25; }),
                             pt(function () { return XL - 0.6; }, function () { return ROWS.f1 + HB + 0.25; })],
      { fillColor: '#f1f5f9', fillOpacity: 1, borders: { visible: false }, vertices: { visible: false }, highlight: false, fixed: true, layer: 0 });

    // Les deux droites, tracées de gauche à droite.
    function droite(f, key, col) {
      return board.create('functiongraph', [f, function () { return XL - 0.6; },
                                            function () { return XL - 0.6 + vis[key] * (XR - XL + 1.2); }],
        { strokeColor: col, strokeWidth: 3, fixed: true, highlight: false, layer: 5, visible: false });
    }
    var L1 = droite(f1, 'f1', C1), L2 = droite(f2, 'f2', C2);
    var nomL1 = etiquette(function () { return XR + 0.2; }, function () { return Math.max(-YT + 0.5, Math.min(YT - 0.5, f1(XR + 0.2))); },
                          function () { return facteur(a, b); }, C1, 12, { anchorX: 'right' });
    var nomL2 = etiquette(function () { return XR + 0.2; }, function () { return Math.max(-YT + 0.5, Math.min(YT - 0.5, f2(XR + 0.2))); },
                          function () { return facteur(c, d); }, C2, 12, { anchorX: 'right' });

    // Les zéros : un point sur l'axe, une verticale en pointillé jusqu'aux bandes.
    function zero(zf, key, col, dy) {
      var P = board.create('point', [zf, 0], { size: 4, face: 'o', fillColor: '#fff', strokeColor: col, strokeWidth: 2.5,
        fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
      // le zéro du dénominateur est interdit : son pointillé, rouge, traverse tout le repère
      var V = board.create('segment', [pt(zf, function () { return key === 'f2' ? YT : 0; }), pt(zf, function () { return ROWS.prod - HB - 0.25; })],
        { strokeColor: key === 'f2' ? C_NO : col, strokeWidth: key === 'f2' ? 1.6 : 1.2, dash: 2, fixed: true, highlight: false, layer: 2, visible: false });
      var T = etiquette(zf, dy, function () { return key === 'f1' ? 'x = ' + D.z1Txt : 'x = ' + D.z2Txt + ' : interdit'; }, key === 'f2' ? C_NO : col, 12);
      return { P: P, V: V, T: T };
    }
    var Z1 = zero(function () { return D.z1; }, 'f1', C1, 0.85);
    var Z2 = zero(function () { return D.z2; }, 'f2', C2, function () { return Math.abs(D.z1 - D.z2) < 1.6 ? 1.75 : 0.85; });

    // Les bandes de signe : trois cellules par ligne, remplies de gauche à droite.
    function bande(key) {
      var y = ROWS[key], cells = [], zeros = [];
      for (var i = 0; i < 3; i++) {
        (function (i) {
          function lo() { var co = D.cols[i]; return !co ? XL : co.lo === -Infinity ? XL - 0.6 : co.lo; }
          function hi() { var co = D.cols[i]; return !co ? XL : co.hi === Infinity ? XR + 0.6 : co.hi; }
          // remplissage progressif : la ligne d'un facteur sur la seconde
          // moitié de son étape, la ligne du produit colonne par colonne
          function av() {
            var p = vis[key];
            if (key === 'prod') return Math.max(0, Math.min(1, p * D.cols.length - i));
            return Math.max(0, Math.min(1, (p - 0.5) * 2 * D.cols.length - i));
          }
          function hiv() { return lo() + (hi() - lo()) * av(); }
          // JSXGraph 1.11 ne redessine pas un polygone dont fillColor change
          // après coup : une cellule est donc DEUX polygones, un vert et un
          // rouge, et on montre celui du signe.
          function poly(col) {
            return board.create('polygon', [pt(lo, function () { return y - HB; }), pt(hiv, function () { return y - HB; }),
                                            pt(hiv, function () { return y + HB; }), pt(lo, function () { return y + HB; })],
              { fillColor: col, fillOpacity: 0.28, borders: { visible: false }, vertices: { visible: false }, highlight: false, fixed: true, layer: 1, visible: false });
          }
          var polyG = poly(C_OK), polyR = poly(C_NO);
          var txt = board.create('text', [function () { return (Math.max(lo(), XL - 0.6) + Math.min(hi(), XR + 0.6)) / 2; }, y,
                                          function () { var co = D.cols[i]; return co ? signeTxt(key === 'f1' ? co.s1 : key === 'f2' ? co.s2 : co.sp) : ''; }],
            { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK, cssStyle: 'font-weight:900', fixed: true, highlight: false, layer: 6, visible: false });
          cells.push({ polyG: polyG, polyR: polyR, txt: txt, av: av });
        })(i);
      }
      for (var j = 0; j < 2; j++) {
        (function (j) {
          var zx = function () { return D.zs[j] != null ? D.zs[j] : XL; };
          zeros.push(board.create('text', [zx, y, function () {
            var z = D.zs[j]; if (z == null) return '';
            var t = celluleZero(key, z);
            return t === '‖' ? '<span style="color:' + C_NO + '">‖</span>' : t;
          }], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
                cssStyle: 'font-weight:900;background:#fff;padding:0 3px;border-radius:4px', fixed: true, highlight: false, layer: 7, visible: false }));
        })(j);
      }
      var nom = etiquette(function () { return XL - 0.45; }, y,
        function () { return key === 'f1' ? facteur(a, b) : key === 'f2' ? facteur(c, d) : 'quotient'; },
        key === 'f1' ? C1 : key === 'f2' ? C2 : C_P, 12, { anchorX: 'left' });
      return { cells: cells, zeros: zeros, nom: nom };
    }
    var B1 = bande('f1'), B2 = bande('f2'), BP = bande('prod');

    // Les solutions sur l'axe : jusqu'à trois morceaux, chacun avec ses crochets.
    var SOL = [];
    for (var m = 0; m < 3; m++) {
      (function (m) {
        function piece() { return D.pieces[m]; }
        function lo() { var p = piece(); return !p ? XL : p.a === -Infinity ? XL - 0.6 : p.a; }
        function hi() { var p = piece(); return !p ? XL : p.b === Infinity ? XR + 0.6 : p.b; }
        function hiv() { return lo() + (hi() - lo()) * Math.min(1, vis.sol * 1.15); }
        var seg = board.create('segment', [pt(lo, function () { return 0; }), pt(hiv, function () { return 0; })],
          { strokeColor: C_OK, strokeWidth: 7, fixed: true, highlight: false, layer: 4, visible: false });
        var dot = board.create('point', [lo, 0], { size: 5, face: 'o', fillColor: C_OK, strokeColor: C_OK,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
        function crochet(xf, dirF) {
          var H = 0.32, o = { strokeWidth: 4, strokeColor: C_OK, lineCap: 'round', fixed: true, highlight: false, layer: 8, visible: false };
          var V1 = pt(xf, function () { return -H; }), V2 = pt(xf, function () { return H; });
          var A1 = pt(function () { return xf() + 0.3 * dirF(); }, function () { return H; });
          var A2 = pt(function () { return xf() + 0.3 * dirF(); }, function () { return -H; });
          return [board.create('segment', [V1, V2], o), board.create('segment', [V2, A1], o), board.create('segment', [V1, A2], o)];
        }
        // crochet fermé : bras vers l'intérieur ; ouvert : vers l'extérieur
        var crL = crochet(lo, function () { var p = piece(); return p && !p.oa ? 1 : -1; });
        var crR = crochet(hi, function () { var p = piece(); return p && !p.ob ? -1 : 1; });
        SOL.push({ seg: seg, dot: dot, crL: crL, crR: crR });
      })(m);
    }

    // Le point de test, et ses deux images sur les droites.
    var PX = board.create('point', [xv, 0], { size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_OK, fixed: false,
      withLabel: false, showInfobox: false, layer: 9 });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [xv, 0]); }
    function clip(v) { return Math.max(-YT, Math.min(YT, v)); }
    var G = board.create('segment', [pt(function () { return xv; }, function () { return clip(Math.min(0, f1(xv), f2(xv))); }),
                                     pt(function () { return xv; }, function () { return clip(Math.max(0, f1(xv), f2(xv))); })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2 });
    var P1 = board.create('point', [function () { return xv; }, function () { return clip(f1(xv)); }],
      { size: 4, fillColor: C1, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8 });
    var P2 = board.create('point', [function () { return xv; }, function () { return clip(f2(xv)); }],
      { size: 4, fillColor: C2, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8 });
    function calcTxt() {
      var v1 = f1(xv), v2 = f2(xv);
      if (interdit(xv)) {
        return 'x = ' + fmt(xv) + ' : <span style="color:' + C2 + '">' + facteur(c, d) + ' = 0</span>, ' +
               '<span style="color:' + C_NO + '">division par 0 — valeur interdite ✗</span>';
      }
      var vp = quot(xv);
      return 'x = ' + fmt(xv) + ' : <span style="color:' + C1 + '">' + fmt(v1) + '</span> ÷ <span style="color:' + C2 + '">' +
             paren(v2) + '</span> = <span style="color:' + couleur(sgn(vp)) + '">' + fmt(vp) + '</span> ' +
             '<span style="color:' + (ok(xv) ? C_OK : C_NO) + '">' + RELH[rel] + ' 0 ' + (ok(xv) ? '✓' : '✗') + '</span>';
    }
    var labP = etiquette(function () { return xv; }, function () { return -YT + 0.7; }, calcTxt, INK, 12);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    function titreTxt() {
      return '<span style="display:inline-block;vertical-align:middle;text-align:center;line-height:1.05">' +
             '<span style="display:block;border-bottom:2px solid ' + INK + ';padding:0 3px;color:' + C1 + '">' + facteur(a, b) + '</span>' +
             '<span style="display:block;padding:0 3px;color:' + C2 + '">' + facteur(c, d) + '</span></span> ' + RELH[rel] + ' 0';
    }
    board.create('text', [cx, 9.95, titreTxt], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function regle(k, col) {
      return '<b style="color:' + col + '">' + facteur(k === 1 ? a : c, k === 1 ? b : d) + '</b> s\'annule en x = ' +
             (k === 1 ? D.z1Txt : D.z2Txt + ' — <b style="color:' + C_NO + '">valeur interdite</b>, on ne divise pas par 0') +
             ' ; à droite, il a le signe de ' + (k === 1 ? 'a = ' + fmt(a) : 'c = ' + fmt(c)) +
             ' (<b>' + ((k === 1 ? a : c) > 0 ? '+' : '−') + '</b>), à gauche le contraire.';
    }
    function capHaut() {
      if (vis.sol > 0) {
        return 'On garde les colonnes où le quotient est <b style="color:' + couleur(D.voulu) + '">' + signeTxt(D.voulu) + '</b>' +
               (D.large ? ', le zéro du numérateur compris (inégalité large)' : ', le zéro du numérateur exclu (inégalité stricte)') +
               ' — et <b style="color:' + C_NO + '">jamais ' + D.z2Txt + '</b>.';
      }
      if (vis.prod > 0) return 'Le <b style="color:' + C_P + '">quotient</b> : la règle des signes, colonne par colonne — même règle qu\'un produit ; ‖ sous la valeur interdite.';
      if (vis.f2 > 0) return regle(2, C2);
      if (vis.f1 > 0) return regle(1, C1);
      return 'Le signe d\'un quotient se lit sur le signe du numérateur et du dénominateur : on les étudie l\'un après l\'autre.';
    }
    function capBas() {
      if (vis.sol >= 1) return '<b style="color:' + C_OK + '">S = ' + D.Stxt + '</b> — déplace le point pour vérifier le signe en une valeur.';
      if (vis.prod > 0 && D.zs.length === 1) return 'Le même zéro en haut et en bas : le quotient vaut ' + fmt(a / c) + ' partout où il existe — et n\'existe pas en ' + D.z2Txt + '.';
      return '';
    }
    board.create('text', [cx, 8.35, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -11.1, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      show(L1, vis.f1 > 0); show(L2, vis.f2 > 0);
      show(nomL1, vis.f1 >= 0.5); show(nomL2, vis.f2 >= 0.5);
      [[Z1, vis.f1], [Z2, vis.f2]].forEach(function (z) {
        show(z[0].P, z[1] >= 0.5); show(z[0].V, z[1] >= 0.5); show(z[0].T, z[1] >= 0.5);
      });
      [['f1', B1], ['f2', B2], ['prod', BP]].forEach(function (r) {
        var key = r[0], Bd = r[1], on = vis[key] > (key === 'prod' ? 0 : 0.5);
        show(Bd.nom, true);
        Bd.cells.forEach(function (cell, i) {
          var co = D.cols[i], vu = on && !!co && cell.av() > 0;
          var s = co ? (key === 'f1' ? co.s1 : key === 'f2' ? co.s2 : co.sp) : 0;
          show(cell.polyG, vu && s > 0);
          show(cell.polyR, vu && s < 0);
          show(cell.txt, vu && cell.av() >= 0.999);
          if (co) {
            attr(cell.txt, 'color', couleur(s));
            // à la dernière étape, les colonnes gardées ressortent, les autres s'effacent
            var garde = co.sp === D.voulu;
            var op = vis.sol > 0 && key === 'prod' ? (garde ? 0.55 : 0.12) : 0.28;
            attr(cell.polyG, 'fillOpacity', op); attr(cell.polyR, 'fillOpacity', op);
          }
        });
        Bd.zeros.forEach(function (z, j) { show(z, on && D.zs[j] != null && vis[key] >= 0.999); });
      });
      SOL.forEach(function (s, m) {
        var p = D.pieces[m], vu = vis.sol > 0 && !!p;
        var point = vu && p.a === p.b;
        show(s.seg, vu && !point);
        show(s.dot, point);
        s.crL.forEach(function (o) { show(o, vu && !point && p.a !== -Infinity); });
        s.crR.forEach(function (o) { show(o, vu && !point && p.b !== Infinity && vis.sol >= 0.85); });
      });
      attr(PX, 'fillColor', ok(xv) ? C_OK : C_NO);
      attr(labP, 'anchorX', xv > XR - 3 ? 'right' : xv < XL + 3 ? 'left' : 'middle');
    }

    /* ==================================================================== */
    /* Le panneau : le tableau de signes, comme sur la copie                 */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    var root = el('div', 'eq-ui ineq-ui');
    var presets = el('div', 'ineq-presets');
    var PRESETS = [
      { label: '(2x − 4)/(−x + 3) ⩾ 0', set: function () { a = 2; b = -4; c = -1; d = 3; rel = 'ge'; } },
      { label: '(x + 1)/(x − 3) ⩽ 0', set: function () { a = 1; b = 1; c = 1; d = -3; rel = 'le'; } },
      { label: '(−3x + 6)/(2x + 2) > 0', set: function () { a = -3; b = 6; c = 2; d = 2; rel = 'gt'; } },
      { label: '(2x − 1)/(x + 2) ⩽ 0', set: function () { a = 2; b = -1; c = 1; d = 2; rel = 'le'; } },
      { label: '(x − 1)/(2x − 2) ⩾ 0', set: function () { a = 1; b = -1; c = 2; d = -2; rel = 'ge'; } }
    ];
    var presetBtns = PRESETS.map(function (p) {
      var bt = el('button', 'ineq-preset', p.label);
      bt.type = 'button';
      bt.onclick = function () { p.set(); syncInputs(); lastKey = null; arm(); };
      presets.appendChild(bt);
      return bt;
    });
    root.appendChild(presets);

    var entry = el('div', 'eq-entry');
    entry.appendChild(el('span', 'eq-entry-lab', 'Inéquation :'));
    function num(cls) { var i = el('input', cls); i.type = 'number'; i.step = '1'; return i; }
    var inA = num('eq-a'), inB = num('eq-b'), inC = num('eq-c'), inD = num('eq-d');
    var sel = el('select', 'ineq-sel');
    ['lt', 'le', 'gt', 'ge'].forEach(function (k) { var o = el('option', null, REL[k]); o.value = k; sel.appendChild(o); });
    entry.appendChild(el('span', 'eq-plus', '('));
    entry.appendChild(inA); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inB);
    entry.appendChild(el('span', 'eq-plus', ') / ('));
    entry.appendChild(inC); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inD);
    entry.appendChild(el('span', 'eq-plus', ')'));
    entry.appendChild(sel);
    entry.appendChild(el('span', 'eq-plus', '0'));
    var randBtn = el('button', 'eq-rand', '🎲 Autre inéquation'); randBtn.type = 'button';
    entry.appendChild(randBtn);
    root.appendChild(entry);
    var form = el('div', 'eq-form'); form.innerHTML = 'soit&nbsp; ';
    var formTxt = el('b', 'eq-form-txt'); form.appendChild(formTxt);
    root.appendChild(form);
    var tableEl = el('div', 'sg-wrap');
    root.appendChild(tableEl);
    var noteEl = el('div', 'eq-note');
    root.appendChild(noteEl);
    mv.extras.appendChild(root);

    var panel = el('div', 'props-panel');

    function cellSigne(s, cls) {
      return '<td class="' + (cls || '') + (s > 0 ? ' sg-plus' : s < 0 ? ' sg-moins' : '') + '">' + signeTxt(s) + '</td>';
    }
    function ligneTable(key, vue, nb) {
      // nb : nombre de colonnes d'intervalle déjà remplies (produit) — sinon toutes
      var col = key === 'f1' ? C1 : key === 'f2' ? C2 : C_P;
      var h = '<tr class="' + (vue ? '' : 'off') + '"><th style="color:' + col + '">' +
              (key === 'f1' ? facteur(a, b) : key === 'f2' ? facteur(c, d) : '(' + facteur(a, b) + ') / (' + facteur(c, d) + ')') + '</th><td></td>';
      D.cols.forEach(function (co, i) {
        var s = key === 'f1' ? co.s1 : key === 'f2' ? co.s2 : co.sp;
        var garde = key === 'prod' && vis.sol > 0 && co.sp === D.voulu;
        h += (nb != null && i >= nb) ? '<td></td>' : cellSigne(s, garde ? 'is-sol' : '');
        if (i < D.zs.length) {
          var z = D.zs[i], cz = celluleZero(key, z);
          var gardeZ = key === 'prod' && vis.sol > 0 && D.large && cz === '0';
          h += (nb != null && i >= nb) ? '<td class="sg-bar"></td>'
             : '<td class="sg-bar' + (gardeZ ? ' is-sol' : '') + (cz === '‖' ? ' sg-interdit' : '') + '">' +
               (cz === '0' ? '0' : cz === '‖' ? '<span class="sg-trait"></span><span class="sg-trait"></span>' : '<span class="sg-trait"></span>') + '</td>';
        }
      });
      return h + '<td></td></tr>';
    }
    function renderTable() {
      var h = '<table class="sg-table"><tr><th>x</th><td>−∞</td>';
      D.cols.forEach(function (co, i) {
        h += '<td></td>';
        if (i < D.zs.length) h += '<td class="sg-bar' + (Math.abs(D.zs[i] - D.z2) < 1e-9 ? ' sg-interdit' : '') + '">' + D.zTxt[i] + '</td>';
      });
      h += '<td>+∞</td></tr>';
      h += ligneTable('f1', vis.f1 >= 0.999);
      h += ligneTable('f2', vis.f2 >= 0.999);
      h += ligneTable('prod', vis.prod > 0, vis.prod >= 0.999 ? null : Math.floor(vis.prod * D.cols.length));
      tableEl.innerHTML = h + '</table>';
    }
    function renderNote() {
      if (vis.sol >= 0.999) {
        var nbc = D.cols.filter(function (co) { return co.sp === D.voulu; }).length;
        noteEl.innerHTML = 'Le quotient est <b style="color:' + couleur(D.voulu) + '">' + signeTxt(D.voulu) + '</b> dans ' +
          (nbc || 'aucune') + ' colonne' + (nbc > 1 ? 's' : '') +
          (D.zs.length === 2
            ? (D.large ? ', et nul en ' + D.z1Txt + ' : ce zéro est solution' : ' ; le zéro ' + D.z1Txt + ' est exclu (inégalité stricte)')
            : '') +
          '. <b style="color:' + C_NO + '">' + D.z2Txt + ' est interdit</b> : crochet ouvert. <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>';
      } else if (vis.prod > 0) {
        noteEl.innerHTML = 'Règle des signes, comme pour un produit : + / + = +, + / − = −, − / − = +. Un 0 sous le zéro du numérateur, ‖ sous la valeur interdite.';
      } else if (vis.f2 > 0) noteEl.innerHTML = regle(2, C2);
      else if (vis.f1 > 0) noteEl.innerHTML = regle(1, C1);
      else noteEl.innerHTML = 'Les zéros, dans l\'ordre croissant : ' + D.zTxt.join(' puis ') + '.';
    }
    function renderPanel() {
      renderTable(); renderNote();
      var fini = vis.sol >= 0.999, v1 = f1(xv), v2 = f2(xv), vp = interdit(xv) ? NaN : quot(xv);
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'S = ' + D.Stxt : 'S = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 0">x = <strong>' + fmt(xv) + '</strong> : ' +
          '<span style="color:' + C1 + '">' + facteur(a, b).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v1) + '</span>' +
          ' (' + signeTxt(sgn(v1)) + ') et <span style="color:' + C2 + '">' + facteur(c, d).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v2) + '</span>' +
          ' (' + signeTxt(sgn(v2)) + ') ; ' + (interdit(xv) ? '<strong style="color:' + C_NO + '">division par 0, valeur interdite</strong>' : 'quotient ' + fmt(vp) + ' → <strong style="color:' + (ok(xv) ? C_OK : C_NO) + '">' +
          (ok(xv) ? 'vrai' : 'faux') + '</strong>') + (fini ? ', et en effet ' + fmt(xv) + (ok(xv) ? ' ∈ ' : ' ∉ ') + D.Stxt + '.' : '.') +
        '</p>';
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    function buildSteps() {
      return PLAN.map(function (k, i) {
        return { dur: k === 'sol' ? 900 : 1300, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }

    /* ==================================================================== */
    /* Saisie et (re)démarrage                                               */
    /* ==================================================================== */
    function plainOrig() { return '(' + facteur(a, b) + ')/(' + facteur(c, d) + ') ' + REL[rel] + ' 0'; }
    function clampInputs() {
      function lit(inp, lo, hi, cur) { var v = parseInt(inp.value, 10); return isNaN(v) ? cur : Math.max(lo, Math.min(hi, v)); }
      a = lit(inA, -6, 6, a); c = lit(inC, -6, 6, c); b = lit(inB, -12, 12, b); d = lit(inD, -12, 12, d);
      if (a === 0) a = 1;                                 // sans x, ce n'est plus un facteur du premier degré
      if (c === 0) c = 1;
      if (['lt', 'le', 'gt', 'ge'].indexOf(sel.value) >= 0) rel = sel.value;
    }
    function syncInputs() { inA.value = a; inB.value = b; inC.value = c; inD.value = d; sel.value = rel; }
    var lastKey = null;
    function arm() {
      var key = [a, b, c, d, rel].join(',');
      if (key === lastKey) return;
      lastKey = key;
      presetBtns.forEach(function (bt, i) { bt.className = 'ineq-preset' + (PRESETS[i].label === plainOrig() ? ' active' : ''); });
      formTxt.textContent = plainOrig();
      calcule();
      bornesFenetre();
      xv = clampX(D.zs.length === 2 ? (D.zs[0] + D.zs[1]) / 2 : D.zs[0] + 1);
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }
    function saisie() { clampInputs(); syncInputs(); arm(); }
    inA.oninput = inB.oninput = inC.oninput = inD.oninput = function () { clampInputs(); arm(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange = saisie;
    sel.onchange = saisie;
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    randBtn.onclick = function () {
      a = nonzero(-3, 3); c = nonzero(-3, 3);
      b = randInt(-6, 6); d = randInt(-6, 6);
      rel = ['lt', 'le', 'gt', 'ge'][randInt(0, 3)];
      syncInputs(); lastKey = null; arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { lastKey = null; arm(); } }
    ]);
    mv.extras.appendChild(panel);
    syncInputs();
    arm();
  }
});
