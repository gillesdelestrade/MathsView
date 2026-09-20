/*
 * Équations quotient nul (2nde) — résoudre (ax + b)/(cx + d) = 0.
 *
 * Un quotient est nul si, et seulement si, son NUMÉRATEUR est nul — et que son
 * dénominateur ne l'est pas. La leçon fait voir les deux moitiés de la règle :
 *
 *   1) la valeur interdite d'abord : le dénominateur est une droite, son zéro
 *      est marqué en rouge et un pointillé le traverse de haut en bas — on ne
 *      divise pas par 0, cette valeur ne sera jamais solution ;
 *   2) le numérateur : une droite, son zéro, la petite équation 2x − 4 = 0 ;
 *   3) la courbe du quotient y = (2x − 4)/(−x + 3) se trace : une hyperbole,
 *      qui s'envole le long du pointillé sans jamais le toucher, et qui coupe
 *      l'axe en un seul point, le zéro du numérateur ;
 *   4) S = {2} — ou S = ∅ quand le zéro du numérateur est la valeur interdite,
 *      comme dans (x − 1)/(2x − 2) = 0, où le quotient vaut 1/2 partout où il
 *      existe et ne s'annule jamais.
 *
 * Le point sur l'axe se déplace à la souris et refait le calcul ; posé sur la
 * valeur interdite, il dit « division par 0 ».
 *
 * Même discipline que les autres leçons animées : état absolu par étape,
 * rafraîchissement explicite, tout ce que lisent les textes calculé avant le
 * premier board.create.
 */
MathsView.register({
  id: 'equations-quotient-nul',
  title: 'Équations quotient nul',
  level: '2nde',
  category: 'algebre',
  theme: 'Algèbre — (ax + b)/(cx + d) = 0 : numérateur nul, dénominateur non nul',
  description:
    'Un <strong>quotient est nul</strong> si, et seulement si, son <strong>numérateur</strong> ' +
    'est nul — à condition que le dénominateur, lui, ne le soit pas : on ne divise pas par ' +
    '\\(0\\). Pour \\(\\dfrac{2x-4}{-x+3}=0\\), on écrit d\'abord la <strong>valeur ' +
    'interdite</strong> \\(x=3\\), puis on résout \\(2x-4=0\\).' +
    '<br>La figure le montre : la courbe du quotient s\'envole le long de la valeur interdite ' +
    'sans jamais la toucher, et coupe l\'axe en un seul point, le zéro du numérateur.' +
    '<br>Choisis une équation ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>). <strong>Déplace le point</strong> sur l\'axe pour ' +
    'calculer le quotient en une valeur.',
  notes:
    '<ul>' +
    '<li><strong>La règle.</strong> \\(\\dfrac{A}{B}=0\\iff A=0\\text{ et }B\\neq0\\). Un ' +
    'quotient de numérateur nul vaut \\(0\\) ; un quotient de numérateur non nul n\'est jamais ' +
    'nul ; et si \\(B=0\\), le quotient n\'existe pas.</li>' +
    '<li><strong>La méthode.</strong> D\'abord la <strong>valeur interdite</strong> : ' +
    '\\(-x+3=0\\iff x=3\\). Puis le numérateur : \\(2x-4=0\\iff x=2\\). Comme \\(2\\neq3\\), ' +
    '\\(S=\\{2\\}\\).</li>' +
    '<li><strong>Quand la solution est interdite.</strong> \\(\\dfrac{x-1}{2x-2}=0\\) : valeur ' +
    'interdite \\(1\\), numérateur nul en \\(1\\) aussi. Ce \\(1\\) est interdit : ' +
    '\\(S=\\varnothing\\). Le quotient vaut \\(\\frac12\\) partout où il existe.</li>' +
    '<li><strong>Le dénominateur ne donne jamais de solution.</strong> Ce n\'est pas ' +
    '« produit nul » : \\(-x+3=0\\) ne rend pas le quotient nul, il le rend impossible.</li>' +
    '<li><strong>Multiplier par le dénominateur ?</strong> C\'est permis pour une équation ' +
    '\\(=0\\), puisqu\'on a écarté la valeur qui l\'annule : on retrouve \\(2x-4=0\\). Mais ' +
    'la valeur interdite reste interdite, il faut l\'avoir écrite avant.</li>' +
    '<li><strong>Vérifier.</strong> Pour \\(x=2\\), \\(\\dfrac{0}{1}=0\\). Pour \\(x=3\\), rien ' +
    'à calculer — c\'est interdit.</li>' +
    '</ul>',
  board: {
    boundingbox: [-6.5, 11.0, 6.5, -9.4], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Équations quotient nul',
    figures: [{
      legende: '(2x − 4)/(−x + 3) = 0 : interdit 3, la courbe coupe l\'axe en 2 seulement.',
      boundingbox: [-0.8, 4.2, 6.2, -4.2],
      keepaspectratio: false,
      largeur: 60, hauteur: 36,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', no = '#dc2626', vio = '#7c3aed';
        board.create('segment', [[-0.6, 0], [6, 0]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        board.create('segment', [[0, -4], [0, 4]], { strokeColor: g, strokeWidth: 1.2, lastArrow: true, fixed: true, highlight: false });
        for (var i = 1; i <= 5; i++) {
          board.create('segment', [[i, -0.12], [i, 0.12]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false });
          board.create('text', [i, -0.5, String(i)], { anchorX: 'middle', anchorY: 'middle', fontSize: 8, color: '#64748b', fixed: true, highlight: false });
        }
        board.create('segment', [[3, -4], [3, 4]], { strokeColor: no, strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
        function q(x) { return (2 * x - 4) / (-x + 3); }
        board.create('functiongraph', [q, -0.6, 2.72], { strokeColor: vio, strokeWidth: 2, fixed: true, highlight: false });
        board.create('functiongraph', [q, 3.28, 6], { strokeColor: vio, strokeWidth: 2, fixed: true, highlight: false });
        board.create('point', [2, 0], { name: '', size: 3, fillColor: ok, strokeColor: ok, fixed: true, highlight: false, showInfobox: false });
        board.create('text', [2, 0.7, 'x = 2'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        board.create('text', [3.75, 3.5, '3 : interdit'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: no, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [1.0, -2.6, 'quotient'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: vio, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [1.3, 3.4, 'S = {2}'], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: ok, cssStyle: 'font-weight:800', fixed: true, highlight: false });
      }
    }],
    points: [
      'Un <b>quotient est nul</b> si et seulement si son <b>numérateur est nul</b> et son dénominateur ne l\'est pas.',
      'D\'abord la <b>valeur interdite</b> : celle qui annule le dénominateur. On l\'écrit avant tout.',
      'Puis on résout numérateur = 0 : une petite équation du premier degré.',
      'Si la valeur trouvée est la valeur interdite, elle n\'est pas solution : \\( S = \\varnothing \\).',
      'Le dénominateur ne donne <b>jamais</b> de solution : nul, il rend le quotient impossible, pas nul.',
      'Vérifier : pour la solution, le numérateur vaut 0 et le dénominateur non.'
    ],
    exemples: [
      '\\( \\dfrac{2x - 4}{-x + 3} = 0 \\) : interdit 3 ; \\( 2x - 4 = 0 \\iff x = 2 \\), et \\( 2 \\neq 3 \\). \\( S = \\{2\\} \\).',
      '\\( \\dfrac{x - 1}{2x - 2} = 0 \\) : interdit 1 ; \\( x - 1 = 0 \\iff x = 1 \\), interdit. \\( S = \\varnothing \\).',
      '\\( \\dfrac{x + 1}{3x - 2} = 0 \\) : interdit \\( \\tfrac23 \\) ; \\( x = -1 \\). \\( S = \\{-1\\} \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et écritures                                                  */
    /* ==================================================================== */
    var C1 = '#2563eb', C2 = '#ea580c', C_P = '#7c3aed';   // numérateur, dénominateur, quotient
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
    function sgn(v) { return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }

    /* ==================================================================== */
    /* Le problème et ce qu'on en tire                                       */
    /* ==================================================================== */
    var a = 2, b = -4, c = -1, d = 3;                    // (2x − 4)/(−x + 3) = 0
    var D = null;
    var XL = -6, XR = 6, YT = 7.2;

    function f1(x) { return a * x + b; }
    function f2(x) { return c * x + d; }
    function quot(x) { return f1(x) / f2(x); }
    function interdit(x) { return sgn(f2(x)) === 0; }
    function ok(x) { return !interdit(x) && sgn(f1(x)) === 0; }

    function calcule() {
      var z1 = -b / a, z2 = -d / c;
      var meme = Math.abs(z1 - z2) < 1e-9;          // le zéro du numérateur est la valeur interdite
      var zs = meme ? [] : [z1];                       // les solutions
      D = { z1: z1, z2: z2, zs: zs, meme: meme,
            z1Txt: zeroTxt(a, b), z2Txt: zeroTxt(c, d), z1Html: zeroHtml(a, b), z2Html: zeroHtml(c, d) };
      D.Stxt = meme ? '∅' : '{' + D.z1Txt + '}';
      D.Shtml = meme ? '∅' : '{' + D.z1Html + '}';
    }
    function bornesFenetre() {
      var lo = Math.min(D.z1, D.z2), hi = Math.max(D.z1, D.z2);
      XL = Math.floor(lo) - 3; XR = Math.ceil(hi) + 3;
      while (XR - XL < 8) { XL--; XR++; }
      board.setBoundingBox([XL - 0.6, 11.0, XR + 0.6, -9.4], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['f2', 'f1', 'prod', 'sol'];             // la valeur interdite d'abord, puis le numérateur
    var vis = { f1: 0, f2: 0, prod: 0, sol: 0 };
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
    var L1 = courbe(f1, 'f1', C1, 3), L2 = courbe(f2, 'f2', C2, 3);
    // La courbe du quotient : une hyperbole, en deux branches qui s'arrêtent
    // juste avant la valeur interdite. La gauche se trace sur la première
    // moitié de l'étape, la droite sur la seconde.
    var EPS = 0.03;
    var LPg = board.create('functiongraph', [quot, function () { return XL - 0.6; },
      function () { var p = Math.min(1, vis.prod * 2); return XL - 0.6 + p * (D.z2 - EPS - (XL - 0.6)); }],
      { strokeColor: C_P, strokeWidth: 3.5, fixed: true, highlight: false, layer: 5, visible: false });
    var LPd = board.create('functiongraph', [quot, function () { return D.z2 + EPS; },
      function () { var p = Math.max(0, vis.prod * 2 - 1); return D.z2 + EPS + p * (XR + 0.6 - (D.z2 + EPS)); }],
      { strokeColor: C_P, strokeWidth: 3.5, fixed: true, highlight: false, layer: 5, visible: false });
    function nomCourbe(f, txt, col) {
      return etiquette(function () { return XR + 0.2; }, function () { return Math.max(-YT + 0.5, Math.min(YT - 0.5, f(XR + 0.2))); },
                       txt, col, 12, { anchorX: 'right' });
    }
    var nomL1 = nomCourbe(f1, function () { return facteur(a, b); }, C1);
    var nomL2 = nomCourbe(f2, function () { return facteur(c, d); }, C2);
    var nomLP = etiquette(function () { return XL + 1.2; }, function () { return clip(quot(XL + 1.2)) + (quot(XL + 1.2) > 0 ? -0.9 : 0.9); },
                          'quotient', C_P, 12);

    // Les zéros : un point sur l'axe, une verticale pointillée, une étiquette.
    function zero(zf, key, col, dy) {
      var P = board.create('point', [zf, 0], { size: 4, face: 'o', fillColor: '#fff', strokeColor: col, strokeWidth: 2.5,
        fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
      // le zéro du dénominateur est interdit : pointillé rouge, sur toute la hauteur
      var V = board.create('segment', [pt(zf, function () { return -YT; }), pt(zf, function () { return YT; })],
        { strokeColor: key === 'f2' ? C_NO : col, strokeWidth: key === 'f2' ? 1.6 : 1, dash: 2, fixed: true, highlight: false, layer: 2, visible: false });
      var T = etiquette(zf, dy, function () { return key === 'f1' ? 'x = ' + D.z1Txt : 'x = ' + D.z2Txt + ' : interdit'; }, key === 'f2' ? C_NO : col, 12);
      return { P: P, V: V, T: T };
    }
    var Z1 = zero(function () { return D.z1; }, 'f1', C1, -1.25);
    var Z2 = zero(function () { return D.z2; }, 'f2', C2, function () { return Math.abs(D.z1 - D.z2) < 1.6 ? -2.05 : -1.25; });

    // Les solutions : de gros points verts sur l'axe, et S.
    var SOL = [];
    for (var m = 0; m < 1; m++) {
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
    function quotClip(x) { return interdit(x) ? 0 : clip(quot(x)); }
    var G = board.create('segment', [pt(function () { return xv; }, function () { return clip(Math.min(0, f1(xv), f2(xv), quotClip(xv))); }),
                                     pt(function () { return xv; }, function () { return clip(Math.max(0, f1(xv), f2(xv), quotClip(xv))); })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2 });
    function image(f, col) {
      return board.create('point', [function () { return xv; }, function () { return clip(f(xv)); }],
        { size: 4, fillColor: col, strokeColor: '#fff', strokeWidth: 1.5, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8 });
    }
    var P1 = image(f1, C1), P2 = image(f2, C2), PP = image(quotClip, C_P);
    function calcTxt() {
      var v1 = f1(xv), v2 = f2(xv);
      if (interdit(xv)) {
        return 'x = ' + fmt(xv) + ' : <span style="color:' + C2 + '">' + facteur(c, d) + ' = 0</span>, ' +
               '<span style="color:' + C_NO + '">division par 0 — valeur interdite ✗</span>';
      }
      return 'x = ' + fmt(xv) + ' : <span style="color:' + C1 + '">' + fmt(v1) + '</span> ÷ <span style="color:' + C2 + '">' +
             paren(v2) + '</span> = <span style="color:' + C_P + '">' + fmt(quot(xv)) + '</span> ' +
             (ok(xv) ? '<span style="color:' + C_OK + '">= 0 ✓ solution</span>' : '<span style="color:' + C_NO + '">≠ 0 ✗</span>');
    }
    var labP = etiquette(function () { return xv; }, function () { return -YT - 0.6; }, calcTxt, INK, 12);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    function titreTxt() {
      return '<span style="display:inline-block;vertical-align:middle;text-align:center;line-height:1.05">' +
             '<span style="display:block;border-bottom:2px solid ' + INK + ';padding:0 3px;color:' + C1 + '">' + facteur(a, b) + '</span>' +
             '<span style="display:block;padding:0 3px;color:' + C2 + '">' + facteur(c, d) + '</span></span> = 0';
    }
    board.create('text', [cx, 10.1, titreTxt], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function capHaut() {
      if (vis.sol > 0) return D.meme
        ? 'Le zéro du numérateur est la valeur interdite : <b style="color:' + C_OK + '">S = ∅</b>, aucune solution.'
        : 'Une seule solution, le zéro du numérateur : <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.';
      if (vis.prod > 0) return D.meme
        ? 'La courbe du <b style="color:' + C_P + '">quotient</b> ne coupe jamais l\'axe : le quotient vaut ' + fmt(a / c) + ' partout où il existe.'
        : 'La courbe du <b style="color:' + C_P + '">quotient</b> coupe l\'axe en ' + D.z1Txt + ' seulement, et s\'envole le long de la valeur interdite sans la toucher.';
      if (vis.f1 > 0) return '<b style="color:' + C1 + '">' + facteur(a, b) + ' = 0</b> ⟺ x = ' + D.z1Txt + ' : le numérateur s\'annule en ' + D.z1Txt +
                             (D.meme ? ' — <b style="color:' + C_NO + '">mais c\'est la valeur interdite</b>.' : ', qui n\'est pas interdit.');
      if (vis.f2 > 0) return 'D\'abord la <b style="color:' + C_NO + '">valeur interdite</b> : <b style="color:' + C2 + '">' + facteur(c, d) + ' = 0</b> ⟺ x = ' + D.z2Txt + '. On ne divise pas par 0.';
      return 'Un quotient est nul si, et seulement si, son numérateur est nul — et que son dénominateur ne l\'est pas.';
    }
    function capBas() {
      if (vis.sol >= 1) return 'Déplace le point : le quotient vaut 0 exactement sur la solution, et n\'existe pas en ' + D.z2Txt + '.';
      if (vis.prod > 0) return 'Le dénominateur ne donne jamais de solution : nul, il rend le quotient impossible, pas nul.';
      return '';
    }
    board.create('text', [cx, 8.7, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -9.0, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      show(L1, vis.f1 > 0); show(L2, vis.f2 > 0); show(LPg, vis.prod > 0); show(LPd, vis.prod > 0.5);
      show(nomL1, vis.f1 >= 0.5); show(nomL2, vis.f2 >= 0.5); show(nomLP, vis.prod >= 0.999);
      [[Z1, vis.f1], [Z2, vis.f2]].forEach(function (z) {
        show(z[0].P, z[1] >= 0.5 && !(vis.sol > 0 && !D.meme)); show(z[0].V, z[1] >= 0.5); show(z[0].T, z[1] >= 0.5);
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
      { label: '(2x − 4)/(−x + 3) = 0', set: function () { a = 2; b = -4; c = -1; d = 3; } },
      { label: '(x + 1)/(3x − 2) = 0', set: function () { a = 1; b = 1; c = 3; d = -2; } },
      { label: 'x/(x − 3) = 0', set: function () { a = 1; b = 0; c = 1; d = -3; } },
      { label: '(−2x + 5)/(x + 4) = 0', set: function () { a = -2; b = 5; c = 1; d = 4; } },
      { label: '(x − 1)/(2x − 2) = 0', set: function () { a = 1; b = -1; c = 2; d = -2; } }
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
    entry.appendChild(el('span', 'eq-plus', ') / ('));
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

    function fracHtml() {
      return '<span class="eq-frac"><span class="eq-num" style="color:' + C1 + '">' + facteur(a, b) + '</span>' +
             '<span class="eq-den" style="color:' + C2 + '">' + facteur(c, d) + '</span></span>';
    }
    function renderLines() {
      var lignes = [];
      function ligne(html, note, final) {
        lignes.push((note ? '<div class="eq-line-note">' + note + '</div>' : '') +
                    '<div class="eq-line' + (final ? ' eq-sol' : '') + '">' + html + '</div>');
      }
      ligne(fracHtml() + ' = 0');
      if (vis.f2 >= 0.999) {
        ligne('<span class="eq-ou">valeur interdite :</span> <span style="color:' + C2 + '">' + facteur(c, d) + '</span> = 0 ⟺ ' +
              '<span style="color:' + C_NO + '">x = ' + D.z2Html + '</span>',
              'On ne divise pas par 0 : la valeur qui annule le dénominateur est interdite, on l\'écrit avant tout.');
      }
      if (vis.f1 >= 0.999) {
        ligne('⟺ <span style="color:' + C1 + '">' + facteur(a, b) + '</span> = 0 <span class="eq-ou">et</span> x ≠ ' + D.z2Html,
              'Un quotient est nul si, et seulement si, son numérateur est nul — et que son dénominateur ne l\'est pas.');
      }
      if (vis.prod >= 0.999) {
        ligne('⟺ <span style="color:' + C1 + '">x = ' + D.z1Html + '</span>' +
              (D.meme ? ' <span class="eq-ou">et</span> <span style="color:' + C_NO + '">' + D.z1Html + ' est interdit</span>'
                      : ' <span class="eq-ou">et</span> ' + D.z1Html + ' ≠ ' + D.z2Html + ' ✓'),
              'Une équation du premier degré, puis on regarde si la valeur trouvée est interdite.');
      }
      if (vis.sol >= 0.999) {
        ligne('S = ' + D.Shtml, D.meme ? 'La seule valeur qui annule le numérateur est interdite : aucune solution.'
                                        : 'La solution, entre accolades.', true);
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderNote() {
      if (vis.sol >= 0.999) {
        noteEl.innerHTML = '<b style="color:' + C_OK + '">S = ' + D.Stxt + '</b> — ' +
          (D.meme ? 'le numérateur ne s\'annule qu\'en ' + D.z1Txt + ', qui est interdit.'
                  : 'le dénominateur, lui, ne donne jamais de solution : <b>' + D.z2Txt + ' est interdit</b>.');
      } else if (vis.prod > 0) {
        noteEl.innerHTML = 'La courbe du quotient coupe l\'axe au zéro du numérateur, et s\'envole le long de la valeur interdite.';
      } else if (vis.f2 > 0) {
        noteEl.innerHTML = 'Toujours commencer par la valeur interdite.';
      } else noteEl.innerHTML = '';
    }
    function renderPanel() {
      renderLines(); renderNote();
      var fini = vis.sol >= 0.999, v1 = f1(xv), v2 = f2(xv);
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'S = ' + D.Stxt : 'S = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">La règle</div>' +
        '<p style="margin:.2rem 0 .5rem">Un quotient est nul si et seulement si son <b>numérateur</b> est nul et son ' +
          '<b>dénominateur</b> ne l\'est pas. Le dénominateur nul ne donne pas 0 : il rend le quotient <b>impossible</b>.</p>' +
        '<div class="props-label">Le point de test</div>' +
        '<p style="margin:.2rem 0 0">x = <strong>' + fmt(xv) + '</strong> : ' +
          '<span style="color:' + C1 + '">' + facteur(a, b).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v1) + '</span>' +
          ' et <span style="color:' + C2 + '">' + facteur(c, d).replace('x', '× ' + paren(xv)).replace(/^−× /, '−') + ' = ' + fmt(v2) + '</span>' +
          (interdit(xv) ? ' ; <strong style="color:' + C_NO + '">division par 0 : valeur interdite</strong>'
                        : ' ; quotient ' + fmt(v1) + ' ÷ ' + paren(v2) + ' = <strong style="color:' + (ok(xv) ? C_OK : C_NO) + '">' + fmt(quot(xv)) + '</strong>' +
                          (ok(xv) ? ' : <strong style="color:' + C_OK + '">solution</strong>' : ' ≠ 0 : pas solution')) +
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
        return { dur: k === 'sol' ? 700 : k === 'prod' ? 1600 : 1200, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }

    /* ==================================================================== */
    /* Saisie et (re)démarrage                                               */
    /* ==================================================================== */
    function plainOrig() { return (b === 0 ? facteur(a, b) : '(' + facteur(a, b) + ')') + '/(' + facteur(c, d) + ') = 0'; }
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
      xv = clampX(D.z1 + 0.5);
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
