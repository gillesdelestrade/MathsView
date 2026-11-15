/*
 * Équations quotient nul (2nde) — résoudre (ax + b)/(cx + d) = 0.
 *
 * Un quotient est nul si, et seulement si, son NUMÉRATEUR est nul ET son
 * DÉNOMINATEUR non nul. La leçon insiste sur les deux conditions, et surtout
 * sur la seconde — sans aucune courbe. La figure est en deux colonnes,
 * reliées par « et » :
 *
 *   1) à gauche, en rouge, le dénominateur : −x + 3 ≠ 0 ⟺ −x ≠ −3 ⟺ x ≠ 3.
 *      C'est la valeur interdite, on l'écrit avant tout ;
 *   2) à droite, le numérateur : 2x − 4 = 0 ⟺ 2x = 4 ⟺ x = 2 ;
 *   3) on confronte : 2 ≠ 3, la valeur trouvée n'est pas interdite ;
 *   4) S = {2} — ou S = ∅ quand le zéro du numérateur est la valeur interdite,
 *      comme dans (x − 1)/(2x − 2) = 0.
 *
 * Dessous, la zone d'essai : un point à déplacer sur une droite graduée, où
 * la valeur interdite est barrée d'une croix rouge, et le calcul
 * « numérateur ÷ dénominateur = quotient » dans trois cases. Posé sur la
 * valeur interdite, le point dit « impossible » ; sur le zéro du numérateur,
 * « quotient nul ». Après chaque colonne, le point va se poser sur la valeur
 * qu'on vient de trouver.
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
  subcategory: 'Équations',
  exercices: ['eq-quotient-nul'],
  theme: 'Algèbre — (ax + b)/(cx + d) = 0 : numérateur nul, dénominateur non nul',
  description:
    'Un <strong>quotient est nul</strong> si, et seulement si, son <strong>numérateur</strong> ' +
    'est nul — à condition que le dénominateur, lui, ne le soit pas : on ne divise pas par ' +
    '\\(0\\). Pour \\(\\dfrac{2x-4}{-x+3}=0\\), on écrit d\'abord la <strong>valeur ' +
    'interdite</strong> \\(x=3\\), puis on résout \\(2x-4=0\\).' +
    '<br>Deux conditions <strong>à la fois</strong> : numérateur nul <strong>et</strong> ' +
    'dénominateur <strong>non nul</strong>. La valeur trouvée n\'est solution que si elle ' +
    'n\'est pas interdite — sinon, il n\'y a aucune solution.' +
    '<br>Choisis une équation ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>). <strong>Déplace le point</strong> sur la droite ' +
    'graduée pour essayer une valeur — en particulier la valeur interdite.',
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
    boundingbox: [-6.5, 14.6, 6.5, -4.5], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Équations quotient nul',
    figures: [{
      legende: 'Deux conditions à la fois : dénominateur NON nul et numérateur nul.',
      boundingbox: [0, 10, 10, 0],
      keepaspectratio: false,
      largeur: 60, hauteur: 36,
      dessine: function (board) {
        var g = '#334155', ok = '#16a34a', no = '#dc2626', b1 = '#2563eb';
        function t(x, y, s, col, fs) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: fs || 9, color: col, cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false });
        }
        function cadre(x1, x2, col) {
          board.create('polygon', [[x1, 2.7], [x2, 2.7], [x2, 7.3], [x1, 7.3]], { fillColor: col, fillOpacity: 0.08, fixed: true, highlight: false,
            vertices: { visible: false }, borders: { strokeColor: col, strokeWidth: 1, fixed: true, highlight: false } });
        }
        t(4.1, 9.4, '2x − 4', b1, 10); t(4.1, 8.3, '−x + 3', no, 10); t(5.9, 8.85, '= 0', g, 11);
        board.create('segment', [[2.9, 8.85], [5.3, 8.85]], { strokeColor: g, strokeWidth: 1.2, fixed: true, highlight: false });
        cadre(0.3, 4.4, no); cadre(5.6, 9.7, b1);
        t(2.35, 6.5, '−x + 3 ≠ 0', no); t(2.35, 5.0, 'x ≠ 3', no, 10); t(2.35, 3.6, '3 interdit', no, 8);
        t(7.65, 6.5, '2x − 4 = 0', b1); t(7.65, 5.0, 'x = 2', b1, 10); t(7.65, 3.6, '2 ≠ 3 : permis', ok, 8);
        t(5, 5.0, 'et', g, 10);
        t(5, 1.3, 'S = {2}', ok, 11);
      }
    }],
    points: [
      'Un <b>quotient est nul</b> si et seulement si son <b>numérateur est nul</b> ET son <b>dénominateur non nul</b> : \\( \\dfrac{A}{B} = 0 \\iff A = 0 \\) et \\( B \\neq 0 \\).',
      '<b>D\'abord le dénominateur</b> : on écrit \\( B \\neq 0 \\) et on trouve la <b>valeur interdite</b>.',
      'Puis on résout numérateur = 0 : une petite équation du premier degré.',
      'On <b>confronte</b> : si la valeur trouvée est la valeur interdite, elle n\'est pas solution, \\( S = \\varnothing \\).',
      'Le dénominateur ne donne <b>jamais</b> de solution : nul, il rend le quotient impossible, pas nul.'
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
    var C1 = '#2563eb', C2 = '#dc2626', C_P = '#7c3aed';   // numérateur, dénominateur (en rouge : il doit être NON nul), quotient
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
    var XL = -6, XR = 6, Y_HAUT = 14.6, Y_BAS = -4.5;

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
      board.setBoundingBox([XL - 0.6, Y_HAUT, XR + 0.6, Y_BAS], false);
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['f2', 'f1', 'conf', 'sol'];             // le dénominateur d'abord, puis le numérateur, puis on confronte
    var vis = { f1: 0, f2: 0, conf: 0, sol: 0 };
    var xv = 2.5;
    function applyStage(i, p) {
      PLAN.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      // le point d'essai va se poser sur la valeur qu'on vient de trouver :
      // sur la valeur interdite, on lit « division par 0 » ; sur le zéro du
      // numérateur, « 0 ÷ … = 0 »
      if (i === 0 && p >= 1) xv = D.z2;
      if (i === 1 && p >= 1) xv = D.z1;
      syncPX(); refresh(); renderPanel();
    }
    // le point d'essai s'accroche aux demi-entiers et aux deux valeurs remarquables
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
    /* La figure : la colonne du dénominateur, celle du numérateur, l'essai  */
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

    // Les deux cadres : à gauche le dénominateur (la condition), à droite le numérateur.
    function cadre(s, col) {
      var x1 = function () { return cx() + s * 0.045 * W(); }, x2 = function () { return cx() + s * 0.47 * W(); };
      var yb = function () { return 6.15; }, yh = function () { return 10.45; };
      return board.create('polygon', [pt(x1, yb), pt(x2, yb), pt(x2, yh), pt(x1, yh)],
        { fillColor: col, fillOpacity: 0.07, highlightFillOpacity: 0.07, fixed: true, highlight: false, layer: 1,
          vertices: { visible: false }, borders: { strokeColor: col, strokeWidth: 1.5, strokeOpacity: 0.55, fixed: true, highlight: false } });
    }
    cadre(-1, C_NO); cadre(1, C1);
    function tete(s, txt, col) {
      return board.create('text', [colX(s), 10.95, txt],
        { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: col, cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false, layer: 9 });
    }
    tete(-1, 'Dénominateur : NON nul', C_NO); tete(1, 'Numérateur : nul', C1);

    // « 2x = 4 » ou « −x ≠ −3 » : l'étape du milieu, sautée quand le coefficient vaut 1
    function milieu(k, m, rel) { return k === 1 ? null : (k < 0 ? '−' : '') + absX(k) + rel + fmt(-m); }
    function colonne(s, col, key, kf, mf, zTxt, rel) {
      var aMilieu = function () { return milieu(kf(), mf(), rel) !== null; };
      var r1 = etiquette(colX(s), 9.55, function () { return facteur(kf(), mf()) + (vis[key] > 0 ? rel + '0' : ''); }, col, 17);
      var r2 = etiquette(colX(s), 8.3, function () { return '⟺ ' + (milieu(kf(), mf(), rel) || ''); }, col, 15, { cssStyle: 'font-weight:700;white-space:nowrap' });
      var r3 = etiquette(colX(s), function () { return aMilieu() ? 7.05 : 7.8; }, function () { return '⟺ x' + rel + zTxt(); }, col, 18);
      return { r1: r1, r2: r2, r3: r3, aMilieu: aMilieu, key: key };
    }
    var K2 = colonne(-1, C_NO, 'f2', function () { return c; }, function () { return d; }, function () { return D.z2Txt; }, ' ≠ ');
    var K1 = colonne(1, C1, 'f1', function () { return a; }, function () { return b; }, function () { return D.z1Txt; }, ' = ');
    var motEt = etiquette(cx, 8.3, 'et', INK, 16);

    // La confrontation : la valeur trouvée est-elle interdite ? Puis S.
    function confTxt() {
      var t = D.meme
        ? '<span style="color:' + C_NO + '">' + D.z1Txt + ' est la valeur interdite ✗</span>'
        : '<span style="color:' + C_OK + '">' + D.z1Txt + ' ≠ ' + D.z2Txt + ' : la valeur trouvée n\'est pas interdite</span>';
      if (vis.sol >= 0.5) t += ' ⟹ <span style="color:' + C_OK + ';font-size:1.3em">S = ' + D.Stxt + '</span>';
      return t;
    }
    var labConf = etiquette(cx, 5.15, confTxt, INK, 14);

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

    // Sur la droite : la valeur interdite, barrée d'une croix rouge, et le zéro du numérateur.
    var ZI = board.create('point', [function () { return D.z2; }, 0], { size: 5, face: 'x', strokeColor: C_NO, fillColor: C_NO, strokeWidth: 3,
      fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false });
    var ZIT = etiquette(function () { return D.z2; }, -1.7, function () { return D.z2Txt + ' : interdit'; }, C_NO, 12);
    var ZN = board.create('point', [function () { return D.z1; }, 0], { size: 4, face: 'o', fillColor: '#fff', strokeColor: C1, strokeWidth: 2.5,
      fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 7, visible: false });
    var ZNT = etiquette(function () { return D.z1; }, function () { return Math.abs(D.z1 - D.z2) < 2.4 ? -2.55 : -1.7; },
                        function () { return 'x = ' + D.z1Txt; }, C1, 12);

    // La solution : un gros point vert (absent quand S = ∅).
    var SOL = [board.create('point', [function () { return D.zs.length ? D.zs[0] : XL; }, 0],
      { size: 6, face: 'o', fillColor: C_OK, strokeColor: '#fff', strokeWidth: 2,
        fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 8, visible: false })];

    // Le point d'essai et son calcul : numérateur, dénominateur, quotient.
    var PX = board.create('point', [xv, 0], { size: 6, strokeWidth: 2, strokeColor: '#fff', fillColor: C_NO, fixed: false,
      withLabel: false, showInfobox: false, layer: 9 });
    function syncPX() { PX.setPosition(JXG.COORDS_BY_USER, [xv, 0]); }
    board.create('segment', [pt(function () { return xv; }, function () { return 0; }), pt(function () { return xv; }, function () { return 1.35; })],
      { strokeColor: SOFT, strokeWidth: 1, dash: 1, fixed: true, highlight: false, layer: 2 });
    function boite(txt, col, fond) {
      return '<span style="display:inline-block;padding:1px 7px;border:2px solid ' + col + ';border-radius:7px;color:' + col +
             ';background:' + (fond || '#fff') + '">' + txt + '</span>';
    }
    function calcTxt() {
      var v1 = f1(xv), v2 = f2(xv), n1 = sgn(v1) === 0, n2 = sgn(v2) === 0;
      return 'Pour x = ' + xTxt() + ' :&nbsp; ' + boite(facteur(a, b) + ' = ' + fmt(v1), n1 && !n2 ? C_OK : C1, n1 && !n2 ? '#dcfce7' : '') + ' ÷ ' +
             boite(facteur(c, d) + ' = ' + fmt(v2), n2 ? C_NO : C2, n2 ? '#fee2e2' : '') + ' = ' +
             (n2 ? boite('impossible', C_NO, '#fee2e2') : boite(fmt(quot(xv)), ok(xv) ? C_OK : C_P, ok(xv) ? '#dcfce7' : ''));
    }
    function verdictTxt() {
      var n1 = sgn(f1(xv)) === 0, n2 = sgn(f2(xv)) === 0;
      if (n2) return '<span style="color:' + C_NO + '">Le dénominateur est nul : on ne divise pas par 0, ' + xTxt() + ' est la valeur interdite ✗</span>';
      if (n1) return '<span style="color:' + C_OK + '">Numérateur nul, dénominateur non nul : le quotient est nul ✓</span>';
      return '<span style="color:' + C_NO + '">Le numérateur n\'est pas nul : le quotient ne peut pas être nul ✗</span>';
    }
    etiquette(cx, 3.2, calcTxt, INK, 13, { cssStyle: 'font-weight:700;white-space:nowrap' });
    var labP = etiquette(cx, 2.05, verdictTxt, INK, 13);
    PX.on('drag', function () {
      xv = clampX(PX.X());
      syncPX(); refresh(); renderPanel();
      board.update();
    });

    // Le titre et les deux lignes qui racontent l'étape.
    function titreTxt() {
      return '<span style="display:inline-block;vertical-align:middle;text-align:center;line-height:1.05">' +
             '<span style="display:block;border-bottom:2px solid ' + INK + ';padding:0 3px;color:' + C1 + '">' + facteur(a, b) + '</span>' +
             '<span style="display:block;padding:0 3px;color:' + C_NO + '">' + facteur(c, d) + '</span></span> = 0';
    }
    board.create('text', [cx, 13.45, titreTxt], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK, cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9 });
    function capHaut() {
      if (vis.sol > 0) return D.meme
        ? 'La seule valeur qui annule le numérateur est interdite : <b style="color:' + C_OK + '">S = ∅</b>, aucune solution.'
        : 'Numérateur nul <b>et</b> dénominateur non nul : <b style="color:' + C_OK + '">S = ' + D.Stxt + '</b>.';
      if (vis.conf > 0) return D.meme
        ? 'On confronte : ' + D.z1Txt + ' annule le numérateur, <b style="color:' + C_NO + '">mais aussi le dénominateur</b> — il est interdit.'
        : 'On confronte : ' + D.z1Txt + ' annule le numérateur <b>sans</b> annuler le dénominateur, puisque ' + D.z1Txt + ' ≠ ' + D.z2Txt + '.';
      if (vis.f1 > 0) return 'Ensuite le numérateur : <b style="color:' + C1 + '">' + facteur(a, b) + ' = 0</b> ⟺ x = ' + D.z1Txt + '. Un quotient n\'est nul que si son numérateur l\'est.';
      if (vis.f2 > 0) return 'D\'abord le dénominateur : il doit être <b style="color:' + C_NO + '">non nul</b>. ' + facteur(c, d) + ' ≠ 0 ⟺ x ≠ ' + D.z2Txt + ' : <b style="color:' + C_NO + '">' + D.z2Txt + ' est interdit</b>.';
      return 'Un quotient est nul si, et seulement si, son numérateur est nul <b>et</b> son dénominateur <b>non nul</b>.';
    }
    function capBas() {
      return 'Déplace le point : numérateur nul → quotient nul ; dénominateur nul → quotient impossible.';
    }
    board.create('text', [cx, 11.95, capHaut], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK, fixed: true, highlight: false, layer: 9 });
    board.create('text', [cx, -3.75, capBas], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT, fixed: true, highlight: false, layer: 9 });

    function refresh() {
      [[K2, vis.f2], [K1, vis.f1]].forEach(function (t) {
        var K = t[0], v = t[1];
        show(K.r2, v >= 0.3 && K.aMilieu());
        show(K.r3, v >= 0.7);
      });
      show(motEt, vis.f1 > 0);
      show(ZI, vis.f2 >= 0.999); show(ZIT, vis.f2 >= 0.999);
      show(ZN, vis.f1 >= 0.999 && !(vis.sol > 0 && !D.meme)); show(ZNT, vis.f1 >= 0.999);
      show(labConf, vis.conf >= 0.5);
      SOL.forEach(function (s) { show(s, vis.sol > 0 && D.zs.length > 0); });
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
              'Le dénominateur doit être non nul : la valeur qui l\'annule est interdite, on l\'écrit avant tout.');
      }
      if (vis.f1 >= 0.999) {
        ligne('⟺ <span style="color:' + C1 + '">' + facteur(a, b) + '</span> = 0 <span class="eq-ou">et</span> x ≠ ' + D.z2Html,
              'Un quotient est nul si, et seulement si, son numérateur est nul — et que son dénominateur ne l\'est pas.');
      }
      if (vis.conf >= 0.999) {
        ligne('⟺ <span style="color:' + C1 + '">x = ' + D.z1Html + '</span>' +
              (D.meme ? ' <span class="eq-ou">et</span> <span style="color:' + C_NO + '">' + D.z1Html + ' est interdit</span>'
                      : ' <span class="eq-ou">et</span> ' + D.z1Html + ' ≠ ' + D.z2Html + ' ✓'),
              'Une équation du premier degré, puis on confronte : la valeur trouvée est-elle interdite ?');
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
      } else if (vis.conf > 0) {
        noteEl.innerHTML = 'Annuler le numérateur ne suffit pas : il faut encore que la valeur trouvée ne soit pas la valeur interdite.';
      } else if (vis.f2 > 0) {
        noteEl.innerHTML = 'Toujours commencer par le dénominateur : il doit être <b>non nul</b>. La valeur qui l\'annule est interdite.';
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
        '<p style="margin:.2rem 0 0">x = <strong>' + xTxt() + '</strong> : ' +
          '<span style="color:' + C1 + '">' + facteur(a, b).replace('x', '× ' + xParen()).replace(/^−× /, '−') + ' = ' + fmt(v1) + '</span>' +
          ' et <span style="color:' + C2 + '">' + facteur(c, d).replace('x', '× ' + xParen()).replace(/^−× /, '−') + ' = ' + fmt(v2) + '</span>' +
          (interdit(xv) ? ' ; <strong style="color:' + C_NO + '">division par 0 : valeur interdite</strong>'
                        : ' ; quotient ' + fmt(v1) + ' ÷ ' + paren(v2) + ' = <strong style="color:' + (ok(xv) ? C_OK : C_NO) + '">' + fmt(quot(xv)) + '</strong>' +
                          (ok(xv) ? ' : <strong style="color:' + C_OK + '">solution</strong>' : ' ≠ 0 : pas solution')) +
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
        return { dur: k === 'sol' ? 700 : k === 'conf' ? 900 : 1400, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
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
