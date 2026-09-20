/*
 * Équations produit nul (2nde) — résoudre (ax + b)(cx + d) = 0.
 *
 * Un produit est nul si, et seulement si, l'un de ses facteurs est nul. C'est
 * la seule idée de la leçon, et tout est fait pour qu'on la VOIE :
 *
 *   1) on écrit la règle : (2x − 4)(−x + 3) = 0 ⟺ 2x − 4 = 0 ou −x + 3 = 0 ;
 *   2) chaque facteur est une droite ; on la trace, on marque son zéro, et on
 *      résout la petite équation : x = 2 ;
 *   3) pareil pour le second : x = 3 ;
 *   4) la courbe du produit y = (2x − 4)(−x + 3) se trace : elle coupe l'axe
 *      exactement en 2 et en 3, nulle part ailleurs — le produit est nul là où
 *      un facteur est nul, et seulement là ;
 *   5) S = {2 ; 3}, les deux points sur l'axe.
 *
 * Le point sur l'axe se déplace à la souris et refait le calcul : la valeur de
 * chaque facteur, celle du produit, vert quand il est nul.
 *
 * Deux pièges sont traités, pas évités : x(x − 3) = 0, où « simplifier par x »
 * ferait perdre la solution 0 (le panneau prévient dès qu'un facteur est x) ;
 * et la tentation de développer — le panneau montre ce que donnerait
 * −2x² + 10x − 12 = 0, pour dire qu'on ne saurait plus rien en faire : la
 * forme factorisée est la bonne. Le cas des deux facteurs qui s'annulent au
 * même endroit — (x − 1)(2x − 2) = 0 — donne une seule solution, écrite une
 * fois.
 *
 * Même discipline que les autres leçons animées : état absolu par étape,
 * rafraîchissement explicite, tout ce que lisent les textes calculé avant le
 * premier board.create.
 */
MathsView.register({
  id: 'equations-produit-nul',
  title: 'Équations produit nul',
  level: '2nde',
  category: 'algebre',
  exercices: ['eq-produit-nul'],
  theme: 'Algèbre — (ax + b)(cx + d) = 0 : un produit nul a un facteur nul',
  description:
    'Pour résoudre \\((2x-4)(-x+3)=0\\), inutile de développer : un <strong>produit est ' +
    'nul si, et seulement si, l\'un de ses facteurs est nul</strong>. On résout donc ' +
    '\\(2x-4=0\\) <strong>ou</strong> \\(-x+3=0\\), deux petites équations du premier degré.' +
    '<br>La figure le montre : chaque facteur est une droite qui coupe l\'axe en son zéro, et ' +
    'la courbe du produit coupe l\'axe <strong>exactement</strong> en ces deux points, nulle ' +
    'part ailleurs.' +
    '<br>Choisis une équation ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>). <strong>Déplace le point</strong> sur l\'axe pour ' +
    'calculer le produit en une valeur.',
  notes:
    '<ul>' +
    '<li><strong>La règle.</strong> \\(A\\times B=0\\iff A=0\\text{ ou }B=0\\). Dans un sens : ' +
    'si un facteur est nul, le produit l\'est. Dans l\'autre : si le produit est nul et qu\'un ' +
    'facteur ne l\'est pas, on peut diviser par ce facteur, et l\'autre est nul.</li>' +
    '<li><strong>La méthode.</strong> \\((2x-4)(-x+3)=0\\iff 2x-4=0\\text{ ou }-x+3=0' +
    '\\iff x=2\\text{ ou }x=3\\). D\'où \\(S=\\{2\\,;3\\}\\) : deux solutions, entre accolades.</li>' +
    '<li><strong>Ne développe pas.</strong> \\((2x-4)(-x+3)=-2x^2+10x-12\\) : sous cette ' +
    'forme, on ne sait plus résoudre. Une équation \\(=0\\) se résout sur la <strong>forme ' +
    'factorisée</strong> — et si elle ne l\'est pas, on commence par factoriser : ' +
    '\\(x^2=3x\\iff x^2-3x=0\\iff x(x-3)=0\\iff x=0\\text{ ou }x=3\\).</li>' +
    '<li><strong>Le piège de la simplification.</strong> Dans \\(x(x-3)=0\\), « simplifier ' +
    'par \\(x\\) » pour obtenir \\(x-3=0\\) fait perdre la solution \\(0\\) : on ne divise ' +
    'jamais par quelque chose qui peut être nul.</li>' +
    '<li><strong>Le même zéro deux fois.</strong> \\((x-1)(2x-2)=0\\) donne \\(x=1\\) ou ' +
    '\\(x=1\\) : une seule solution, \\(S=\\{1\\}\\).</li>' +
    '<li><strong>Vérifier.</strong> On remplace : pour \\(x=2\\), \\((4-4)(-2+3)=0\\times1=0\\). ' +
    'Pour \\(x=2{,}5\\), \\(1\\times0{,}5=0{,}5\\neq0\\) : pas solution.</li>' +
    '</ul>',
  board: {
    boundingbox: [-6.5, 10.2, 6.5, -9.4], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Équations produit nul',
    figures: [{
      legende: '(2x − 4)(−x + 3) = 0 : la courbe du produit coupe l\'axe en 2 et en 3.',
      boundingbox: [-0.8, 3.4, 5.8, -3.2],
      keepaspectratio: false,
      largeur: 60, hauteur: 36,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', b1 = '#2563eb', b2 = '#ea580c', vio = '#7c3aed';
        board.create('segment', [[-0.6, 0], [5.6, 0]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        board.create('segment', [[0, -3], [0, 3.2]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        for (var i = 1; i <= 5; i++) {
          board.create('segment', [[i, -0.1], [i, 0.1]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false });
          board.create('text', [i, -0.4, String(i)], { anchorX: 'middle', anchorY: 'middle', fontSize: 8, color: '#64748b', fixed: true, highlight: false });
        }
        board.create('functiongraph', [function (x) { return (2 * x - 4) / 2; }, -0.6, 5.6], { strokeColor: b1, strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return (-x + 3); }, -0.6, 5.6], { strokeColor: b2, strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return (2 * x - 4) * (-x + 3); }, 0.9, 4.1], { strokeColor: vio, strokeWidth: 2, fixed: true, highlight: false });
        [2, 3].forEach(function (z) {
          board.create('point', [z, 0], { name: '', size: 3, fillColor: ok, strokeColor: ok, fixed: true, highlight: false, showInfobox: false });
          board.create('text', [z, 0.55, 'x = ' + z], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        });
        board.create('text', [4.6, 2.6, '2x − 4'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: b1, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [4.9, -1.3, '−x + 3'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: b2, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [1.2, -2.2, 'produit'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: vio, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [2.5, 2.7, 'S = {2 ; 3}'], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
      }
    }],
    points: [
      'Un <b>produit est nul</b> si et seulement si l\'un de ses <b>facteurs est nul</b> : \\( A \\times B = 0 \\iff A = 0 \\) ou \\( B = 0 \\).',
      'On résout chaque facteur = 0 : deux petites équations du premier degré, reliées par <b>ou</b>.',
      'On écrit les solutions entre accolades : \\( S = \\{2\\,;3\\} \\). Le même zéro deux fois : une seule solution.',
      '<b>Ne pas développer</b> : une équation = 0 se résout sur la forme <b>factorisée</b>. Sinon, factoriser d\'abord.',
      'Ne jamais « simplifier par x » : \\( x(x - 3) = 0 \\) a DEUX solutions, 0 et 3.',
      'Vérifier en remplaçant x par chaque solution : le produit doit valoir 0.'
    ],
    exemples: [
      '\\( (2x - 4)(-x + 3) = 0 \\iff 2x - 4 = 0 \\) ou \\( -x + 3 = 0 \\iff x = 2 \\) ou \\( x = 3 \\). \\( S = \\{2\\,;3\\} \\).',
      '\\( x^2 = 3x \\iff x^2 - 3x = 0 \\iff x(x - 3) = 0 \\iff x = 0 \\) ou \\( x = 3 \\). \\( S = \\{0\\,;3\\} \\) — pas seulement 3.',
      '\\( (x + 1)(3x - 2) = 0 \\iff x = -1 \\) ou \\( x = \\tfrac{2}{3} \\). \\( S = \\{-1\\,;\\tfrac{2}{3}\\} \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et écritures                                                  */
    /* ==================================================================== */
    var C1 = '#2563eb', C2 = '#ea580c', C_P = '#7c3aed';   // facteur 1, facteur 2, produit
    var C_OK = '#16a34a', C_NO = '#dc2626';
    var INK = '#334155', SOFT = '#94a3b8';
    var ARROW = { type: 2, size: 7 };

    function fmt(v) {
      var t = Math.round(v * 100) / 100;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    function paren(v) { return v < 0 ? '(' + fmt(v) + ')' : fmt(v); }
    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
    // −b/a en écriture exacte : « 2 », « 0,5 », « −1/3 » (et sa fraction HTML)
    function zeroTxt(a, b) {
      var n = -b, d = a;
      if (d < 0) { n = -n; d = -d; }
      var g = pgcd(n, d); n /= g; d /= g;
      if (d === 1) return fmt(n);
      return termine(d) ? fmt(n / d) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;
    }
    function zeroHtml(a, b) {
      var n = -b, d = a;
      if (d < 0) { n = -n; d = -d; }
      var g = pgcd(n, d); n /= g; d /= g;
      if (d === 1) return fmt(n);
      return (n < 0 ? '−' : '') + '<span class="eq-frac"><span class="eq-num">' + Math.abs(n) + '</span><span class="eq-den">' + d + '</span></span>';
    }
    function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
    function facteur(k, m) {
      var t = (k < 0 ? '−' : '') + absX(k);
      if (m !== 0) t += (m < 0 ? ' − ' : ' + ') + Math.abs(m);
      return t;
    }
    // « (2x − 4)(−x + 3) », mais « x(x − 3) » : un facteur d'un seul terme se
    // passe de parenthèses
    function produitTxt() {
      function wrap(k, m) { var t = facteur(k, m); return m === 0 ? t : '(' + t + ')'; }
      return wrap(a, b) + wrap(c, d);
    }
    // le trinôme développé : « −2x² + 10x − 12 »
    function developpe(A, B, C) {
      var t = (A < 0 ? '−' : '') + (Math.abs(A) === 1 ? '' : Math.abs(A)) + 'x²';
      if (B !== 0) t += (B < 0 ? ' − ' : ' + ') + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'x';
      if (C !== 0) t += (C < 0 ? ' − ' : ' + ') + Math.abs(C);
      return t;
    }
    function sgn(v) { return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }

    /* ==================================================================== */
    /* Le problème et ce qu'on en tire                                       */
    /* ==================================================================== */
    var a = 2, b = -4, c = -1, d = 3;                    // (2x − 4)(−x + 3) = 0
    var D = null;
    var XL = -6, XR = 6, YT = 7.2;

    function f1(x) { return a * x + b; }
    function f2(x) { return c * x + d; }
    function prod(x) { return f1(x) * f2(x); }
    function ok(x) { return sgn(prod(x)) === 0; }

    function calcule() {
      var z1 = -b / a, z2 = -d / c;
      var meme = Math.abs(z1 - z2) < 1e-9;
      var zs = meme ? [z1] : (z1 < z2 ? [z1, z2] : [z2, z1]);
      D = { z1: z1, z2: z2, zs: zs, meme: meme,
            z1Txt: zeroTxt(a, b), z2Txt: zeroTxt(c, d), z1Html: zeroHtml(a, b), z2Html: zeroHtml(c, d),
            dev: developpe(a * c, a * d + b * c, b * d),
            pieges: (b === 0 ? [a] : []).concat(d === 0 ? [c] : []) };
      D.Stxt = '{' + (meme ? D.z1Txt : (z1 < z2 ? D.z1Txt + ' ; ' + D.z2Txt : D.z2Txt + ' ; ' + D.z1Txt)) + '}';
      D.Shtml = '{' + (meme ? D.z1Html : (z1 < z2 ? D.z1Html + ' ; ' + D.z2Html : D.z2Html + ' ; ' + D.z1Html)) + '}';
    }
    function bornesFenetre() {
      var lo = Math.min.apply(null, D.zs), hi = Math.max.apply(null, D.zs);
      XL = Math.floor(lo) - 3; XR = Math.ceil(hi) + 3;
      while (XR - XL < 8) { XL--; XR++; }
      board.setBoundingBox([XL - 0.6, 10.2, XR + 0.6, -9.4], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['ou', 'f1', 'f2', 'prod', 'sol'];
    var vis = { ou: 0, f1: 0, f2: 0, prod: 0, sol: 0 };
    var xv = 2.5;
    function applyStage(i, p) {
      PLAN.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      syncPX(); refresh(); renderPanel();
    }
    function clampX(v) { return Math.max(XL, Math.min(XR, Math.round(v * 2) / 2)); }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
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
    function clip(v) { return Math.max(-YT - 0.3, Math.min(YT + 0.3, v)); }

    // Les axes.
    board.create('segment', [pt(function () { return XL - 0.6; }, function () { return 0; }),
                             pt(function () { return XR + 0.6; }, function () { return 0; })],
      { strokeColor: INK, strokeWidth: 1.6, firstArrow: ARROW, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    board.create('segment', [pt(function () { return 0; }, function () { return -YT; }), pt(function () { return 0; }, function () { return YT; })],
      { strokeColor: INK, strokeWidth: 1.6, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
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
      board.create('segment', [pt(function () { return -0.15; }, function () { return y; }), pt(function () { return 0.15; }, function () { return y; })],
        { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3 });
      board.create('text', [-0.3, y, fmt(y)], { anchorX: 'right', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3 });
    }

    // Les deux droites et la courbe du produit, tracées de gauche à droite.
    function courbe(f, key, col, w, dash) {
      return board.create('functiongraph', [f, function () { return XL - 0.6; },
                                            function () { return XL - 0.6 + vis[key] * (XR - XL + 1.2); }],
        { strokeColor: col, strokeWidth: w, dash: dash || 0, fixed: true, highlight: false, layer: 5, visible: false });
    }
    var L1 = courbe(f1, 'f1', C1, 3), L2 = courbe(f2, 'f2', C2, 3), LP = courbe(prod, 'prod', C_P, 3.5);
    function nomCourbe(f, txt, col) {
      return etiquette(function () { return XR + 0.2; }, function () { return Math.max(-YT + 0.5, Math.min(YT - 0.5, f(XR + 0.2))); },
                       txt, col, 12, { anchorX: 'right' });
    }
    var nomL1 = nomCourbe(f1, function () { return facteur(a, b); }, C1);
    var nomL2 = nomCourbe(f2, function () { return facteur(c, d); }, C2);
    var nomLP = etiquette(function () { return D.zs[0] - 1.2; }, function () { return clip(prod(D.zs[0] - 1.2)) + (prod(D.zs[0] - 1.2) > 0 ? -0.9 : 0.9); },
                          'produit', C_P, 12);

    // Les zéros : un point sur l'axe, une verticale pointillée, une étiquette.
    function zero(zf, key, col, dy) {
      var P = board.create('point', [zf, 0], { size: 4, face: 'o', fillColor: '#fff', strokeColor: col, strokeWidth: 2.5,
        fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
      var V = board.create('segment', [pt(zf, function () { return -YT; }), pt(zf, function () { return YT; })],
        { strokeColor: col, strokeWidth: 1, dash: 2, fixed: true, highlight: false, layer: 2, visible: false });
      var T = etiquette(zf, dy, function () { return 'x = ' + (key === 'f1' ? D.z1Txt : D.z2Txt); }, col, 12);
      return { P: P, V: V, T: T };
    }
    var Z1 = zero(function () { return D.z1; }, 'f1', C1, -1.25);
    var Z2 = zero(function () { return D.z2; }, 'f2', C2, function () { return Math.abs(D.z1 - D.z2) < 1.6 ? -2.05 : -1.25; });

    // Les solutions : de gros points verts sur l'axe, et S.
    var SOL = D.zs.length ? [] : [];
    for (var m = 0; m < 2; m++) {
      (function (m) {
        var zx = function () { return D.zs[m] != null ? D.zs[m] : XL; };
        SOL.push(board.create('point', [zx, 0], { size: 6, face: 'o', fillColor: C_OK, strokeColor: '#fff', strokeWidth: 2,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false }));
      })(m);
    }

    // Le point de test, ses images sur les droites et sur la courbe.
    var PX = board.create('point', [xv, 0], { size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_NO, fixed: false,
      withLabel: false, showInfobox: false, layer: 9 });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [xv, 0]); }
    var G = board.create('segment', [pt(function () { return xv; }, function () { return clip(Math.min(0, f1(xv), f2(xv), prod(xv))); }),
                                     pt(function () { return xv; }, function () { return clip(Math.max(0, f1(xv), f2(xv), prod(xv))); })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2 });
    function image(f, col) {
      return board.create('point', [function () { return xv; }, function () { return clip(f(xv)); }],
        { size: 4, fillColor: col, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8 });
    }
    var P1 = image(f1, C1), P2 = image(f2, C2), PP = image(prod, C_P);
    function calcTxt() {
      var v1 = f1(xv), v2 = f2(xv), vp = prod(xv);
      return 'x = ' + fmt(xv) + ' : <span style="color:' + C1 + '">' + fmt(v1) + '</span> × <span style="color:' + C2 + '">' +
             paren(v2) + '</span> = <span style="color:' + C_P + '">' + fmt(vp) + '</span> ' +
             (ok(xv) ? '<span style="color:' + C_OK + '">= 0 ✓ solution</span>' : '<span style="color:' + C_NO + '">≠ 0 ✗</span>');
    }
    var labP = etiquette(function () { return xv; }, function () { return -YT - 0.6; }, calcTxt, INK, 12);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    board.create('text', [cx, 9.55, function () { return produitTxt() + ' = 0'; }],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 21, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function capHaut() {
      if (vis.sol > 0) return D.meme
        ? 'Les deux facteurs s\'annulent au même endroit : une seule solution, <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.'
        : 'Deux solutions, et pas une de plus : <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.';
      if (vis.prod > 0) return 'La courbe du <b style="color:' + C_P + '">produit</b> coupe l\'axe exactement en ' + D.zs.map(function (z, i) { return i === 0 ? D.zs[0] === D.z1 ? D.z1Txt : D.z2Txt : D.zs[1] === D.z1 ? D.z1Txt : D.z2Txt; }).join(' et ') + ' : là où un facteur est nul, et seulement là.';
      if (vis.f2 > 0) return '<b style="color:' + C2 + '">' + facteur(c, d) + ' = 0</b> ⟺ x = ' + D.z2Txt + ' : la droite coupe l\'axe en ' + D.z2Txt + '.';
      if (vis.f1 > 0) return '<b style="color:' + C1 + '">' + facteur(a, b) + ' = 0</b> ⟺ x = ' + D.z1Txt + ' : la droite coupe l\'axe en ' + D.z1Txt + '.';
      if (vis.ou > 0) return 'Un produit est nul si, et seulement si, <b>l\'un de ses facteurs est nul</b> : on résout chaque facteur = 0.';
      return 'On ne développe pas : on cherche où chaque facteur s\'annule.';
    }
    function capBas() {
      if (vis.sol >= 1) return 'Déplace le point : le produit vaut 0 exactement sur les solutions.';
      if (vis.prod > 0) return 'Ailleurs, le produit n\'est pas nul : ni au-dessus, ni en dessous de l\'axe.';
      return '';
    }
    board.create('text', [cx, 8.55, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -9.0, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      show(L1, vis.f1 > 0); show(L2, vis.f2 > 0); show(LP, vis.prod > 0);
      show(nomL1, vis.f1 >= 0.5); show(nomL2, vis.f2 >= 0.5); show(nomLP, vis.prod >= 0.999);
      [[Z1, vis.f1], [Z2, vis.f2]].forEach(function (z) {
        show(z[0].P, z[1] >= 0.5 && !(vis.sol > 0)); show(z[0].V, z[1] >= 0.5); show(z[0].T, z[1] >= 0.5);
      });
      SOL.forEach(function (s, m) { show(s, vis.sol > 0 && D.zs[m] != null); });
      attr(PX, 'fillColor', ok(xv) ? C_OK : C_NO);
      show(P1, vis.f1 >= 0.999); show(P2, vis.f2 >= 0.999); show(PP, vis.prod >= 0.999);
      attr(labP, 'anchorX', xv > XR - 3 ? 'right' : xv < XL + 3 ? 'left' : 'middle');
    }

    /* ==================================================================== */
    /* Le panneau : la résolution, ligne à ligne                             */
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
      { label: '(2x − 4)(−x + 3) = 0', set: function () { a = 2; b = -4; c = -1; d = 3; } },
      { label: '(x + 1)(3x − 2) = 0', set: function () { a = 1; b = 1; c = 3; d = -2; } },
      { label: 'x(x − 3) = 0', set: function () { a = 1; b = 0; c = 1; d = -3; } },
      { label: '(−2x + 5)(x + 4) = 0', set: function () { a = -2; b = 5; c = 1; d = 4; } },
      { label: '(x − 1)(2x − 2) = 0', set: function () { a = 1; b = -1; c = 2; d = -2; } }
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
    entry.appendChild(el('span', 'eq-entry-lab', 'Équation :'));
    function num(cls) { var i = el('input', cls); i.type = 'number'; i.step = '1'; return i; }
    var inA = num('eq-a'), inB = num('eq-b'), inC = num('eq-c'), inD = num('eq-d');
    entry.appendChild(el('span', 'eq-plus', '('));
    entry.appendChild(inA); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inB);
    entry.appendChild(el('span', 'eq-plus', ')('));
    entry.appendChild(inC); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inD);
    entry.appendChild(el('span', 'eq-plus', ') = 0'));
    var randBtn = el('button', 'eq-rand', '🎲 Autre équation'); randBtn.type = 'button';
    entry.appendChild(randBtn);
    root.appendChild(entry);
    var form = el('div', 'eq-form'); form.innerHTML = 'soit&nbsp; ';
    var formTxt = el('b', 'eq-form-txt'); form.appendChild(formTxt);
    root.appendChild(form);
    var stageEl = el('div', 'eq-stage'), linesEl = el('div', 'eq-lines');
    stageEl.appendChild(linesEl); root.appendChild(stageEl);
    var noteEl = el('div', 'eq-note');
    root.appendChild(noteEl);
    mv.extras.appendChild(root);
    var panel = el('div', 'props-panel');

    function xEgale(html) { return 'x = ' + html; }
    function renderLines() {
      var lignes = [];
      function ligne(html, note, final) {
        lignes.push((note ? '<div class="eq-line-note">' + note + '</div>' : '') +
                    '<div class="eq-line' + (final ? ' eq-sol' : '') + '">' + html + '</div>');
      }
      var facs = function (col1, col2) {
        return '<span style="color:' + col1 + '">' + facteur(a, b) + '</span> = 0 <span class="eq-ou">ou</span> ' +
               '<span style="color:' + col2 + '">' + facteur(c, d) + '</span> = 0';
      };
      ligne(produitTxt() + ' = 0');
      if (vis.ou >= 0.999) ligne('⟺ ' + facs(C1, C2), 'Un produit est nul si, et seulement si, l\'un de ses facteurs est nul.');
      if (vis.f1 >= 0.999) {
        var x2 = vis.f2 >= 0.999 ? '<span style="color:' + C2 + '">' + xEgale(D.z2Html) + '</span>' : '…';
        ligne('⟺ <span style="color:' + C1 + '">' + xEgale(D.z1Html) + '</span> <span class="eq-ou">ou</span> ' + x2,
              'Deux équations du premier degré, résolues chacune de son côté.');
      }
      if (vis.sol >= 0.999) {
        ligne('S = ' + D.Shtml, D.meme ? 'Les deux facteurs donnent la même solution : on ne l\'écrit qu\'une fois.'
                                        : 'Les solutions, entre accolades.', true);
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderNote() {
      if (vis.sol >= 0.999) {
        noteEl.innerHTML = '<b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>' +
          (D.pieges.length ? ' — et non pas seulement ' + (D.z1 === 0 ? D.z2Txt : D.z1Txt) +
            ' : « simplifier par x » aurait fait perdre la solution <b>0</b>.' : '');
      } else if (vis.prod > 0) {
        noteEl.innerHTML = 'La courbe du produit passe par l\'axe exactement aux zéros des facteurs.';
      } else if (vis.ou > 0) {
        noteEl.innerHTML = D.pieges.length
          ? '<b style="color:' + C_NO + '">Attention</b> : un des facteurs est <b>x</b>. On ne « simplifie » pas par x — ce serait diviser par quelque chose qui peut être nul, et perdre la solution 0.'
          : 'On ne développe pas : la forme factorisée est celle qui permet de résoudre.';
      } else noteEl.innerHTML = '';
    }
    function renderPanel() {
      renderLines(); renderNote();
      var fini = vis.sol >= 0.999, v1 = f1(xv), v2 = f2(xv), vp = prod(xv);
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'S = ' + D.Stxt : 'S = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">Pourquoi ne pas développer</div>' +
        '<p style="margin:.2rem 0 .5rem">Développé, cela donnerait <b>' + D.dev + ' = 0</b> : sous cette forme, on ne sait plus ' +
          'résoudre. La forme <b>factorisée</b> est la bonne.</p>' +
        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 0">x = <strong>' + fmt(xv) + '</strong> : ' +
          '<span style="color:' + C1 + '">' + facteur(a, b).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v1) + '</span>' +
          ' et <span style="color:' + C2 + '">' + facteur(c, d).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v2) + '</span>' +
          ' ; produit ' + fmt(v1) + ' × ' + paren(v2) + ' = <strong style="color:' + (ok(xv) ? C_OK : C_NO) + '">' + fmt(vp) + '</strong>' +
          (ok(xv) ? ' : <strong style="color:' + C_OK + '">solution</strong>' : ' ≠ 0 : pas solution') +
          (fini ? ', et en effet ' + fmt(xv) + (ok(xv) ? ' ∈ ' : ' ∉ ') + D.Stxt + '.' : '.') +
        '</p>';
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    function buildSteps() {
      return PLAN.map(function (k, i) {
        return { dur: k === 'ou' ? 500 : k === 'sol' ? 700 : 1200, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }

    /* ==================================================================== */
    /* Saisie et (re)démarrage                                               */
    /* ==================================================================== */
    function plainOrig() { return produitTxt() + ' = 0'; }
    function clampInputs() {
      function lit(inp, lo, hi, cur) { var v = parseInt(inp.value, 10); return isNaN(v) ? cur : Math.max(lo, Math.min(hi, v)); }
      a = lit(inA, -6, 6, a); c = lit(inC, -6, 6, c); b = lit(inB, -12, 12, b); d = lit(inD, -12, 12, d);
      if (a === 0) a = 1;                                 // sans x, ce n'est plus un facteur du premier degré
      if (c === 0) c = 1;
    }
    function syncInputs() { inA.value = a; inB.value = b; inC.value = c; inD.value = d; }
    var lastKey = null;
    function arm() {
      var key = [a, b, c, d].join(',');
      if (key === lastKey) return;
      lastKey = key;
      presetBtns.forEach(function (bt, i) { bt.className = 'ineq-preset' + (PRESETS[i].label === plainOrig() ? ' active' : ''); });
      formTxt.textContent = plainOrig();
      calcule();
      bornesFenetre();
      xv = clampX(D.zs[0] + 0.5);
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }
    function saisie() { clampInputs(); syncInputs(); arm(); }
    inA.oninput = inB.oninput = inC.oninput = inD.oninput = function () { clampInputs(); arm(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange = saisie;
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    randBtn.onclick = function () {
      a = nonzero(-3, 3); c = nonzero(-3, 3);
      b = randInt(-6, 6); d = randInt(-6, 6);
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
