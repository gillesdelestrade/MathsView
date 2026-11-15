/*
 * Équations produit nul (2nde) — résoudre (ax + b)(cx + d) = 0.
 *
 * Un produit est nul si, et seulement si, l'un de ses facteurs est nul. La
 * leçon insiste sur les deux moitiés de la phrase, sans aucune courbe :
 *
 *   - il SUFFIT qu'un facteur soit nul : 0 × n'importe quoi = 0 ;
 *   - il le FAUT : deux nombres non nuls ont un produit non nul ;
 *   - donc, pour avoir TOUTES les solutions, on résout CHAQUE facteur = 0.
 *
 * La figure est en deux colonnes, une par facteur, reliées par « ou » :
 *
 *   1) on écrit la règle : chaque facteur = 0 ;
 *   2) première colonne : 2x − 4 = 0 ⟺ 2x = 4 ⟺ x = 2 ;
 *   3) seconde colonne : −x + 3 = 0 ⟺ −x = −3 ⟺ x = 3 ;
 *   4) les deux colonnes se rejoignent : S = {2 ; 3}.
 *
 * Dessous, la zone d'essai : un point à déplacer sur une droite graduée, et
 * le calcul « facteur 1 × facteur 2 = produit » dans trois cases. Une case
 * passe au vert dès qu'elle vaut 0, et le verdict le dit : un seul facteur
 * nul suffit. À la fin de chaque colonne, le point va se poser sur le zéro
 * qu'on vient de trouver.
 *
 * Deux pièges sont traités, pas évités : x(x − 3) = 0, où « simplifier par x »
 * ferait perdre la solution 0 (le panneau prévient dès qu'un facteur est x) ;
 * et la tentation de développer — le panneau montre ce que donnerait
 * −2x² + 10x − 12 = 0, pour dire qu'on ne saurait plus rien en faire. Le cas
 * des deux facteurs qui s'annulent pour la même valeur — (x − 1)(2x − 2) = 0 —
 * donne une seule solution, écrite une fois.
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
  subcategory: 'Équations',
  exercices: ['eq-produit-nul'],
  theme: 'Algèbre — (ax + b)(cx + d) = 0 : un produit nul a un facteur nul',
  description:
    'Pour résoudre \\((2x-4)(-x+3)=0\\), inutile de développer : un <strong>produit est ' +
    'nul si, et seulement si, l\'un de ses facteurs est nul</strong>. On résout donc ' +
    '\\(2x-4=0\\) <strong>ou</strong> \\(-x+3=0\\), deux petites équations du premier degré.' +
    '<br>Il <strong>suffit</strong> qu\'un seul facteur soit nul pour que le produit le soit, ' +
    'et il le <strong>faut</strong> : pour trouver <strong>toutes</strong> les solutions, on ' +
    'résout donc <strong>chaque</strong> facteur \\(=0\\), une colonne par facteur.' +
    '<br>Choisis une équation ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>). <strong>Déplace le point</strong> sur la droite ' +
    'graduée pour essayer une valeur : le produit vaut 0 dès qu\'un facteur vaut 0.',
  notes:
    '<ul>' +
    '<li><strong>La règle.</strong> \\(A\\times B=0\\iff A=0\\text{ ou }B=0\\). Dans un sens : ' +
    '<strong>il suffit</strong> qu\'un facteur soit nul pour que le produit le soit, car \\(0\\times B=0\\) quel que soit \\(B\\). Dans l\'autre, <strong>il le faut</strong> : si le produit est nul et qu\'un ' +
    'facteur ne l\'est pas, on peut diviser par ce facteur, et l\'autre est nul.</li>' +
    '<li><strong>La méthode.</strong> \\((2x-4)(-x+3)=0\\iff 2x-4=0\\text{ ou }-x+3=0' +
    '\\iff x=2\\text{ ou }x=3\\). D\'où \\(S=\\{2\\,;3\\}\\) : deux solutions, entre accolades.</li>' +
    '<li><strong>Résoudre chaque facteur.</strong> Chaque facteur peut apporter une solution : ' +
    's\'arrêter après \\(2x-4=0\\) ferait oublier \\(3\\). L\'ensemble des solutions réunit ' +
    'celles de <strong>tous</strong> les facteurs — trois facteurs, trois équations.</li>' +
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
    boundingbox: [-6.5, 14.0, 6.5, -4.5], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Équations produit nul',
    figures: [{
      legende: 'Un facteur par colonne, reliés par « ou » : on les résout tous les deux.',
      boundingbox: [0, 10, 10, 0],
      keepaspectratio: false,
      largeur: 60, hauteur: 36,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', b1 = '#2563eb', b2 = '#ea580c';
        function t(x, y, s, col, fs) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: fs || 9, color: col, cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false });
        }
        function cadre(x1, x2, col) {
          board.create('polygon', [[x1, 2.7], [x2, 2.7], [x2, 7.5], [x1, 7.5]], { fillColor: col, fillOpacity: 0.08, fixed: true, highlight: false,
            vertices: { visible: false }, borders: { strokeColor: col, strokeWidth: 1, fixed: true, highlight: false } });
        }
        t(5, 9, '(2x − 4)(−x + 3) = 0', g, 11);
        cadre(0.3, 4.4, b1); cadre(5.6, 9.7, b2);
        t(2.35, 6.6, '2x − 4 = 0', b1); t(2.35, 5.1, '2x = 4', b1); t(2.35, 3.6, 'x = 2', b1, 10);
        t(7.65, 6.6, '−x + 3 = 0', b2); t(7.65, 5.1, '−x = −3', b2); t(7.65, 3.6, 'x = 3', b2, 10);
        t(5, 5.1, 'ou', g, 10);
        board.create('segment', [[2.35, 2.5], [4.0, 1.5]], { strokeColor: ok, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        board.create('segment', [[7.65, 2.5], [6.0, 1.5]], { strokeColor: ok, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        t(5, 1.0, 'S = {2 ; 3}', ok, 11);
      }
    }],
    points: [
      'Un <b>produit est nul</b> si et seulement si l\'un de ses <b>facteurs est nul</b> : \\( A \\times B = 0 \\iff A = 0 \\) ou \\( B = 0 \\).',
      'Il <b>suffit</b> qu\'un seul facteur soit nul : \\( 0 \\times B = 0 \\). Il le <b>faut</b> : non nul × non nul ≠ 0.',
      'Pour avoir <b>toutes</b> les solutions, on résout <b>chaque</b> facteur = 0, reliés par <b>ou</b>.',
      'On écrit les solutions entre accolades : \\( S = \\{2\\,;3\\} \\). Le même zéro deux fois : une seule solution.',
      '<b>Ne pas développer</b> : une équation = 0 se résout sur la forme <b>factorisée</b>. Sinon, factoriser d\'abord.',
      'Ne jamais « simplifier par x » : \\( x(x - 3) = 0 \\) a DEUX solutions, 0 et 3.'
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
    var XL = -6, XR = 6, Y_HAUT = 14.0, Y_BAS = -4.5;

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
      board.setBoundingBox([XL - 0.6, Y_HAUT, XR + 0.6, Y_BAS], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['ou', 'f1', 'f2', 'sol'];
    var vis = { ou: 0, f1: 0, f2: 0, sol: 0 };
    var xv = 2.5;
    function applyStage(i, p) {
      PLAN.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      // une fois un facteur résolu, le point d'essai va se poser sur son zéro :
      // on y lit « 0 × … = 0 », un seul facteur nul suffit
      if (i === 1 && p >= 1) xv = D.z1;
      if (i === 2 && p >= 1) xv = D.z2;
      syncPX(); refresh(); renderPanel();
    }
    // le point d'essai s'accroche aux demi-entiers et aux deux zéros
    function clampX(v) {
      var best = Math.round(v * 2) / 2;
      [D.z1, D.z2].forEach(function (z) { if (Math.abs(v - z) < Math.abs(v - best)) best = z; });
      return Math.max(XL, Math.min(XR, best));
    }
    function xTxt() {
      if (Math.abs(xv - D.z1) < 1e-9) return D.z1Txt;
      if (Math.abs(xv - D.z2) < 1e-9) return D.z2Txt;
      return fmt(xv);
    }
    function xParen() { var t = xTxt(); return (xv < 0 || t.indexOf('/') >= 0) ? '(' + t + ')' : t; }

    /* ==================================================================== */
    /* La figure : deux colonnes, une par facteur, puis la zone d'essai      */
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
    function W() { return XR - XL + 1.2; }
    function colX(s) { return function () { return cx() + s * 0.255 * W(); }; }   // s = −1 : gauche, +1 : droite

    // Les deux cadres : un facteur par colonne.
    function cadre(s, col) {
      var x1 = function () { return cx() + s * 0.045 * W(); }, x2 = function () { return cx() + s * 0.47 * W(); };
      var yb = function () { return 6.15; }, yh = function () { return 10.45; };
      return board.create('polygon', [pt(x1, yb), pt(x2, yb), pt(x2, yh), pt(x1, yh)],
        { fillColor: col, fillOpacity: 0.07, highlightFillOpacity: 0.07, fixed: true, highlight: false, layer: 1,
          vertices: { visible: false }, borders: { strokeColor: col, strokeWidth: 1.5, strokeOpacity: 0.55, fixed: true, highlight: false } });
    }
    cadre(-1, C1); cadre(1, C2);
    function tete(s, txt) {
      return board.create('text', [colX(s), 10.95, txt],
        { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: SOFT, cssStyle: 'font-weight:700;white-space:nowrap', fixed: true, highlight: false, layer: 9 });
    }
    tete(-1, '1er facteur'); tete(1, '2e facteur');

    // « 2x = 4 » : l'étape du milieu, sautée quand le coefficient vaut 1
    function milieu(k, m) { return k === 1 ? null : (k < 0 ? '−' : '') + absX(k) + ' = ' + fmt(-m); }
    function colonne(s, col, key, kf, mf, zTxt) {
      var aMilieu = function () { return milieu(kf(), mf()) !== null; };
      var r1 = etiquette(colX(s), 9.55, function () { return facteur(kf(), mf()) + (vis.ou >= 0.5 ? ' = 0' : ''); }, col, 17);
      var r2 = etiquette(colX(s), 8.3, function () { return '⟺ ' + (milieu(kf(), mf()) || ''); }, col, 15, { cssStyle: 'font-weight:700;white-space:nowrap' });
      var r3 = etiquette(colX(s), function () { return aMilieu() ? 7.05 : 7.8; }, function () { return '⟺ x = ' + zTxt(); }, col, 18);
      return { r1: r1, r2: r2, r3: r3, aMilieu: aMilieu, key: key };
    }
    var K1 = colonne(-1, C1, 'f1', function () { return a; }, function () { return b; }, function () { return D.z1Txt; });
    var K2 = colonne(1, C2, 'f2', function () { return c; }, function () { return d; }, function () { return D.z2Txt; });
    var motOu = etiquette(cx, 8.3, 'ou', INK, 16);

    // Les deux flèches qui ramènent les solutions vers S, et S.
    function fleche(s) {
      return board.create('segment', [pt(colX(s), function () { return 6.0; }),
                                      pt(function () { return cx() + s * 0.1 * W(); }, function () { return 5.35; })],
        { strokeColor: C_OK, strokeWidth: 2, lastArrow: ARROW, fixed: true, highlight: false, layer: 4, visible: false });
    }
    var FL = [fleche(-1), fleche(1)];
    var labS = etiquette(cx, 5.1, function () { return 'S = ' + D.Stxt; }, C_OK, 20);

    // La zone d'essai : une droite graduée, un point à déplacer, le calcul.
    board.create('segment', [pt(function () { return XL - 0.4; }, function () { return 4.15; }),
                             pt(function () { return XR + 0.4; }, function () { return 4.15; })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 2, fixed: true, highlight: false, layer: 2 });
    board.create('segment', [pt(function () { return XL - 0.6; }, function () { return 0; }),
                             pt(function () { return XR + 0.6; }, function () { return 0; })],
      { strokeColor: INK, strokeWidth: 1.6, firstArrow: ARROW, lastArrow: ARROW, fixed: true, highlight: false, layer: 3 });
    for (var i = 0; i < 17; i++) {
      (function (i) {
        var gx = function () { return XL + i; }, dans = function () { return XL + i <= XR; };
        board.create('segment', [pt(gx, function () { return -0.2; }), pt(gx, function () { return 0.2; })],
          { strokeColor: SOFT, strokeWidth: 1, fixed: true, highlight: false, layer: 3, visible: dans });
        board.create('text', [gx, -0.75, function () { return fmt(XL + i); }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: SOFT, fixed: true, highlight: false, layer: 3, visible: dans });
      })(i);
    }

    // Les zéros des facteurs, reportés sur la droite.
    function zero(zf, key, col, dy) {
      var P = board.create('point', [zf, 0], { size: 4, face: 'o', fillColor: '#fff', strokeColor: col, strokeWidth: 2.5,
        fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
      var T = etiquette(zf, dy, function () { return 'x = ' + (key === 'f1' ? D.z1Txt : D.z2Txt); }, col, 12);
      return { P: P, T: T };
    }
    var Z1 = zero(function () { return D.z1; }, 'f1', C1, -1.7);
    var Z2 = zero(function () { return D.z2; }, 'f2', C2, function () { return Math.abs(D.z1 - D.z2) < 1.6 ? -2.55 : -1.7; });

    // Les solutions : de gros points verts sur la droite.
    var SOL = [];
    for (var m = 0; m < 2; m++) {
      (function (m) {
        var zx = function () { return D.zs[m] != null ? D.zs[m] : XL; };
        SOL.push(board.create('point', [zx, 0], { size: 6, face: 'o', fillColor: C_OK, strokeColor: '#fff', strokeWidth: 2,
          fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false }));
      })(m);
    }

    // Le point d'essai et son calcul : la valeur de chaque facteur, puis le produit.
    var PX = board.create('point', [xv, 0], { size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_NO, fixed: false,
      withLabel: false, showInfobox: false, layer: 9 });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [xv, 0]); }
    board.create('segment', [pt(function () { return xv; }, function () { return 0; }), pt(function () { return xv; }, function () { return 1.35; })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2 });
    function boite(txt, col, nul) {
      return '<span style="display:inline-block;padding:1px 7px;border:2px solid ' + (nul ? C_OK : col) + ';border-radius:7px;color:' +
             (nul ? C_OK : col) + ';background:' + (nul ? '#dcfce7' : '#fff') + '">' + txt + '</span>';
    }
    function calcTxt() {
      var v1 = f1(xv), v2 = f2(xv);
      return 'Pour x = ' + xTxt() + ' :&nbsp; ' + boite(facteur(a, b) + ' = ' + fmt(v1), C1, sgn(v1) === 0) + ' × ' +
             boite(facteur(c, d) + ' = ' + fmt(v2), C2, sgn(v2) === 0) + ' = ' + boite(fmt(prod(xv)), C_P, ok(xv));
    }
    function verdictTxt() {
      var n1 = sgn(f1(xv)) === 0, n2 = sgn(f2(xv)) === 0;
      if (n1 && n2) return '<span style="color:' + C_OK + '">Les deux facteurs sont nuls : le produit est nul ✓</span>';
      if (n1 || n2) return '<span style="color:' + C_OK + '">Le ' + (n1 ? '1er' : '2e') + ' facteur est nul : cela suffit, le produit est nul ✓</span>';
      return '<span style="color:' + C_NO + '">Aucun facteur n\'est nul : le produit ne peut pas être nul ✗</span>';
    }
    etiquette(cx, 3.2, calcTxt, INK, 13, { cssStyle: 'font-weight:700;white-space:nowrap' });
    var labP = etiquette(cx, 2.05, verdictTxt, INK, 13);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    board.create('text', [cx, 13.1, function () { return produitTxt() + ' = 0'; }],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 21, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function capHaut() {
      if (vis.sol > 0) return D.meme
        ? 'Les deux facteurs s\'annulent pour la même valeur : une seule solution, <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.'
        : 'Chaque facteur a donné sa solution, il les faut <b>toutes les deux</b> : <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.';
      if (vis.f2 > 0) return 'Il faut aussi résoudre <b style="color:' + C2 + '">' + facteur(c, d) + ' = 0</b> : pour x = ' + D.z2Txt +
                             ', le produit vaut ' + fmt(f1(D.z2)) + ' × 0 = 0.';
      if (vis.f1 > 0) return '<b style="color:' + C1 + '">' + facteur(a, b) + ' = 0</b> ⟺ x = ' + D.z1Txt + ' : pour x = ' + D.z1Txt +
                             ', le produit vaut 0 × ' + paren(f2(D.z1)) + ' = 0, quel que soit l\'autre facteur.';
      if (vis.ou > 0) return 'Il <b>suffit</b> qu\'un facteur soit nul (0 × 7 = 0), et il le <b>faut</b> (5 × 7 ≠ 0) : on écrit chaque facteur = 0.';
      return 'Pour quelles valeurs de x ce produit vaut-il 0 ? On ne développe pas : on regarde ses deux facteurs.';
    }
    function capBas() {
      return 'Déplace le point : le produit vaut 0 dès qu\'un facteur vaut 0, et jamais autrement.';
    }
    board.create('text', [cx, 11.95, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -3.75, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      [[K1, vis.f1, Z1], [K2, vis.f2, Z2]].forEach(function (t) {
        var K = t[0], v = t[1], Z = t[2];
        show(K.r2, v >= 0.3 && K.aMilieu());
        show(K.r3, v >= 0.7);
        show(Z.P, v >= 0.999 && !(vis.sol > 0)); show(Z.T, v >= 0.999);
      });
      show(motOu, vis.ou >= 0.5);
      FL.forEach(function (f) { show(f, vis.sol > 0); });
      show(labS, vis.sol >= 0.5);
      SOL.forEach(function (s, m) { show(s, vis.sol > 0 && D.zs[m] != null); });
      attr(PX, 'fillColor', ok(xv) ? C_OK : C_NO);
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
              'Deux équations du premier degré : il faut les résoudre toutes les deux.');
      }
      if (vis.sol >= 0.999) {
        ligne('S = ' + D.Shtml, D.meme ? 'Les deux facteurs donnent la même solution : on ne l\'écrit qu\'une fois.'
                                        : 'Toutes les solutions, entre accolades : celle de chaque facteur.', true);
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderNote() {
      if (vis.sol >= 0.999) {
        noteEl.innerHTML = '<b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>' +
          (D.pieges.length ? ' — et non pas seulement ' + (D.z1 === 0 ? D.z2Txt : D.z1Txt) +
            ' : « simplifier par x » aurait fait perdre la solution <b>0</b>.'
            : D.meme ? '' : ' — ne résoudre qu\'un seul facteur aurait fait oublier une solution.');
      } else if (vis.f1 > 0) {
        noteEl.innerHTML = 'Un facteur nul suffit à annuler le produit : chaque facteur peut donc apporter une solution, on les résout <b>tous</b>.';
      } else if (vis.ou > 0) {
        noteEl.innerHTML = D.pieges.length
          ? '<b style="color:' + C_NO + '">Attention</b> : un des facteurs est <b>x</b>. On ne « simplifie » pas par x — ce serait diviser par quelque chose qui peut être nul, et perdre la solution 0.'
          : 'Il suffit qu\'<b>un seul</b> facteur soit nul pour que le produit le soit — et si aucun ne l\'est, le produit ne l\'est pas.';
      } else noteEl.innerHTML = '';
    }
    function renderPanel() {
      renderLines(); renderNote();
      var fini = vis.sol >= 0.999, v1 = f1(xv), v2 = f2(xv), vp = prod(xv);
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'S = ' + D.Stxt : 'S = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">La règle</div>' +
        '<p style="margin:.2rem 0 .5rem">Pour qu\'un produit soit nul, il <b>suffit</b> qu\'un de ses facteurs soit nul, et il le ' +
          '<b>faut</b>. Pour avoir <b>toutes</b> les solutions, on résout donc <b>chaque</b> facteur = 0.</p>' +
        '<div class="props-label">Pourquoi ne pas développer</div>' +
        '<p style="margin:.2rem 0 .5rem">Développé, cela donnerait <b>' + D.dev + ' = 0</b> : sous cette forme, on ne sait plus ' +
          'résoudre. La forme <b>factorisée</b> est la bonne.</p>' +
        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 0">x = <strong>' + xTxt() + '</strong> : ' +
          '<span style="color:' + C1 + '">' + facteur(a, b).replace('x', '× ' + xParen()).replace(/^−× /, '−') + ' = ' + fmt(v1) + '</span>' +
          ' et <span style="color:' + C2 + '">' + facteur(c, d).replace('x', '× ' + xParen()).replace(/^−× /, '−') + ' = ' + fmt(v2) + '</span>' +
          ' ; produit ' + fmt(v1) + ' × ' + paren(v2) + ' = <strong style="color:' + (ok(xv) ? C_OK : C_NO) + '">' + fmt(vp) + '</strong>' +
          (ok(xv) ? ' : <strong style="color:' + C_OK + '">solution</strong>' : ' ≠ 0 : pas solution') +
          (fini ? ', et en effet ' + xTxt() + (ok(xv) ? ' ∈ ' : ' ∉ ') + D.Stxt + '.' : '.') +
        '</p>';
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    function buildSteps() {
      return PLAN.map(function (k, i) {
        return { dur: k === 'ou' ? 700 : k === 'sol' ? 700 : 1400, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
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
