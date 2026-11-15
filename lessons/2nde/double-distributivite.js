/*
 * Double distributivité (2nde) — développer (ax + b)(cx + d).
 *
 * Chaque terme de la première parenthèse multiplie chaque terme de la
 * seconde : 2 termes × 2 termes = 4 produits. La leçon le montre deux fois,
 * en même temps :
 *
 *   - en haut, sur l'ÉCRITURE : quatre flèches partent des termes de la
 *     première parenthèse et vont se poser sur ceux de la seconde, l'une
 *     après l'autre, deux par-dessus et deux par-dessous ;
 *   - à gauche, sur un RECTANGLE de côtés (ax + b) et (cx + d), coupé en
 *     quatre : chaque flèche remplit une case, et l'aire du rectangle est la
 *     somme des quatre. Avec un signe « − », le même découpage se lit comme
 *     un tableau de produits : chaque case porte le signe de son produit.
 *
 *              ax        b
 *          ┌────────┬──────┐
 *       cx │ ax·cx  │ b·cx │
 *          ├────────┼──────┤
 *        d │ ax·d   │ b·d  │
 *          └────────┴──────┘
 *
 * Étapes : on coupe ; les quatre produits, dans l'ordre ac, ad, bc, bd ; on
 * calcule chacun (règle des signes) ; on réduit — les deux termes en x se
 * regroupent, ou s'annulent quand ils sont opposés : (x − 3)(x + 3) = x² − 9,
 * et la note fait alors le lien avec les identités remarquables.
 *
 * La figure est mise en page en PIXELS (la fenêtre du plan est réglée sur la
 * taille du dessin) : le rectangle est à l'échelle — x est dessiné comme
 * une longueur de 2,5 unités — et les cases ont de vraies proportions.
 *
 * Sous la figure, le calcul ligne à ligne, et une vérification : on choisit
 * une valeur de x, la forme factorisée et la forme développée donnent le
 * même nombre.
 *
 * Même discipline que les autres leçons animées : état absolu par étape,
 * rafraîchissement explicite, tout ce que lisent les textes calculé avant le
 * premier board.create.
 */
MathsView.register({
  id: 'double-distributivite',
  title: 'Double distributivité',
  level: '2nde',
  category: 'algebre',
  subcategory: 'Calcul littéral',
  exercices: ['double-distributivite'],
  theme: 'Calcul littéral — (a + b)(c + d) = ac + ad + bc + bd',
  description:
    'Pour développer \\((2x+3)(x+4)\\), <strong>chaque terme</strong> de la première ' +
    'parenthèse multiplie <strong>chaque terme</strong> de la seconde : 2 termes × 2 termes, ' +
    'cela fait <strong>4 produits</strong>. \\((a+b)(c+d)=ac+ad+bc+bd\\).' +
    '<br>La figure le montre deux fois : <strong>quatre flèches</strong> sur l\'écriture, et un ' +
    '<strong>rectangle</strong> de côtés \\(2x+3\\) et \\(x+4\\) coupé en quatre — son aire est ' +
    'la somme des quatre cases. On calcule ensuite chaque produit, puis on <strong>réduit</strong>.' +
    '<br>Choisis une expression ou saisis la tienne, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>La règle.</strong> \\((a+b)(c+d)=ac+ad+bc+bd\\) : on distribue \\(a\\) sur ' +
    '\\(c+d\\), puis \\(b\\) sur \\(c+d\\). C\'est la distributivité simple, appliquée deux fois : ' +
    '\\((a+b)(c+d)=a(c+d)+b(c+d)\\).</li>' +
    '<li><strong>Quatre produits, pas deux.</strong> L\'erreur classique : ' +
    '\\((x+3)(x+2)=x^2+6\\). Il manque les deux produits « croisés » \\(2x\\) et \\(3x\\) : ' +
    '\\((x+3)(x+2)=x^2+2x+3x+6=x^2+5x+6\\).</li>' +
    '<li><strong>Les signes.</strong> Chaque terme part avec son signe : dans \\((2x-1)(3x-4)\\), ' +
    'les termes sont \\(2x\\), \\(-1\\), \\(3x\\) et \\(-4\\). Puis la règle des signes : ' +
    '\\((-1)\\times(-4)=+4\\), \\(2x\\times(-4)=-8x\\).</li>' +
    '<li><strong>Réduire.</strong> Après le développement, on regroupe les termes de même ' +
    'nature : \\(6x^2-8x-3x+4=6x^2-11x+4\\).</li>' +
    '<li><strong>Les identités remarquables</strong> sont des doubles distributivités : ' +
    '\\((a+b)^2=(a+b)(a+b)=a^2+2ab+b^2\\) et \\((a+b)(a-b)=a^2-b^2\\), où les deux produits ' +
    'croisés s\'annulent.</li>' +
    '<li><strong>Vérifier.</strong> On remplace \\(x\\) par une valeur dans les deux formes : ' +
    'pour \\(x=2\\), \\((2x+3)(x+4)=7\\times6=42\\) et \\(2x^2+11x+12=8+22+12=42\\).</li>' +
    '</ul>',
  board: {
    boundingbox: [0, 480, 640, 0], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Double distributivité',
    figures: [{
      legende: '(2x + 3)(x + 4) : un rectangle coupé en 4, l\'aire est la somme des 4 cases.',
      boundingbox: [-2.6, 8.2, 9.4, -0.6],
      keepaspectratio: false,
      largeur: 60, hauteur: 40,
      dessine: function (board) {
        var g = '#334155', cols = ['#2563eb', '#ea580c', '#0d9488', '#7c3aed'];
        function t(x, y, s, col, fs) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: fs || 9, color: col, cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false });
        }
        function cell(x1, y1, x2, y2, col, s) {
          board.create('polygon', [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], { fillColor: col, fillOpacity: 0.22, fixed: true, highlight: false,
            vertices: { visible: false }, borders: { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false } });
          t((x1 + x2) / 2, (y1 + y2) / 2, s, col, 10);
        }
        // 2x = 5 de large, 3 ; x = 2,5 de haut, 4
        cell(0, 6.5, 5, 4, cols[0], '2x²'); cell(5, 6.5, 8, 4, cols[2], '3x');
        cell(0, 4, 5, 0, cols[1], '8x'); cell(5, 4, 8, 0, cols[3], '12');
        t(2.5, 7.3, '2x', g, 10); t(6.5, 7.3, '3', g, 10);
        t(-0.9, 5.25, 'x', g, 10); t(-0.9, 2, '4', g, 10);
      }
    }],
    points: [
      '<b>Chaque terme</b> de la première parenthèse multiplie <b>chaque terme</b> de la seconde : \\( (a + b)(c + d) = ac + ad + bc + bd \\).',
      '2 termes × 2 termes = <b>4 produits</b>. Ne pas oublier les deux produits « croisés ».',
      'Chaque terme part <b>avec son signe</b>, puis règle des signes : \\( (-1) \\times (-4) = +4 \\).',
      'On termine en <b>réduisant</b> : on regroupe les termes en \\( x \\).',
      'Vérifier avec une valeur de \\( x \\) : les deux formes donnent le même nombre.'
    ],
    exemples: [
      '\\( (2x + 3)(x + 4) = 2x^2 + 8x + 3x + 12 = 2x^2 + 11x + 12 \\).',
      '\\( (2x - 1)(3x - 4) = 6x^2 - 8x - 3x + 4 = 6x^2 - 11x + 4 \\).',
      '\\( (x - 3)(x + 3) = x^2 + 3x - 3x - 9 = x^2 - 9 \\) : les produits croisés s\'annulent.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et écritures                                                  */
    /* ==================================================================== */
    var COLS = ['#2563eb', '#ea580c', '#0d9488', '#7c3aed'];   // ac, ad, bc, bd
    var C_OK = '#16a34a', C_NO = '#dc2626';
    var INK = '#334155', SOFT = '#94a3b8';

    function fmt(v) {
      var t = Math.round(v * 100) / 100;
      if (Object.is(t, -0)) t = 0;
      return t.toString().replace('-', '−').replace('.', ',');
    }
    // un monôme : « 6x² », « −x », « 4 » (deg = 2, 1 ou 0)
    function mono(k, deg) {
      if (deg === 0) return fmt(k);
      var s = k < 0 ? '−' : '', n = Math.abs(k);
      return s + (n === 1 ? '' : n) + (deg === 2 ? 'x²' : 'x');
    }
    // une somme de monômes [[k, deg], …] : « 6x² − 8x − 3x + 4 », sans les termes nuls
    function somme(ts) {
      var out = '';
      ts.forEach(function (t) {
        if (t[0] === 0) return;
        if (out === '') out = mono(t[0], t[1]);
        else out += (t[0] < 0 ? ' − ' : ' + ') + mono(Math.abs(t[0]), t[1]);
      });
      return out === '' ? '0' : out;
    }
    // un terme dans un produit : entre parenthèses s'il est négatif
    function fact(k, deg) { var m = mono(k, deg); return k < 0 ? '(' + m + ')' : m; }
    // le second terme d'une parenthèse, avec son signe : « + 3 », « − 4 »
    function signe(k) { return (k < 0 ? '− ' : '+ ') + Math.abs(k); }
    function facteur(k, m) { return mono(k, 1) + ' ' + signe(m); }
    function exprTxt() { return '(' + facteur(a, b) + ')(' + facteur(c, d) + ')'; }
    function couleur(i, s) { return '<span style="color:' + COLS[i] + '">' + s + '</span>'; }

    /* ==================================================================== */
    /* Le problème et ce qu'on en tire                                       */
    /* ==================================================================== */
    var a = 2, b = 3, c = 1, d = 4;                      // (2x + 3)(x + 4)
    var xv = 2;                                          // la valeur de vérification
    var D = null;
    var X_LONG = 2.5;                                    // la longueur dessinée pour x

    function calcule() {
      // les quatre produits, dans l'ordre des flèches : ac, ad, bc, bd
      var P = [
        { u: [a, 1], v: [c, 1], k: a * c, deg: 2 },
        { u: [a, 1], v: [d, 0], k: a * d, deg: 1 },
        { u: [b, 0], v: [c, 1], k: b * c, deg: 1 },
        { u: [b, 0], v: [d, 0], k: b * d, deg: 0 }
      ];
      P.forEach(function (p) { p.ecrit = fact(p.u[0], p.u[1]) + ' × ' + fact(p.v[0], p.v[1]); p.res = mono(p.k, p.deg); });
      var B = a * d + b * c;
      D = { P: P, A: a * c, B: B, C: b * d,
            negatif: a < 0 || b < 0 || c < 0 || d < 0,
            brut: somme(P.map(function (p) { return [p.k, p.deg]; })),
            reduit: somme([[a * c, 2], [B, 1], [b * d, 0]]),
            carre: a === c && b === d, conj: a === c && b === -d };
    }
    calcule();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var PLAN = ['coupe', 'p1', 'p2', 'p3', 'p4', 'calc', 'red'];
    var vis = { coupe: 0, p1: 0, p2: 0, p3: 0, p4: 0, calc: 0, red: 0 };
    function pv(i) { return vis['p' + (i + 1)]; }
    function applyStage(i, p) {
      PLAN.forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      refresh(); renderPanel();
    }

    /* ==================================================================== */
    /* La mise en page, en pixels                                            */
    /* ==================================================================== */
    var CW = board.canvasWidth || 640, CH = board.canvasHeight || 480;
    board.setBoundingBox([0, CH, CW, 0], false);
    var KX = CW / 640;                                   // tout s'écarte moins sur un écran étroit
    var Y_EXP = CH - 62;                                 // la ligne de l'écriture
    var RX = 84 * KX, RY = CH - 172;                     // coin haut-gauche du rectangle
    var R_W = 250 * KX, R_H = RY - 66;             // la place qu'il peut prendre
    // les dimensions du rectangle, à l'échelle
    function ech() {
      var w = Math.abs(a) * X_LONG + Math.abs(b), h = Math.abs(c) * X_LONG + Math.abs(d);
      return Math.min(R_W / w, R_H / h, 42);
    }
    function w1() { return Math.abs(a) * X_LONG * ech(); }
    function w2() { return Math.abs(b) * ech(); }
    function h1() { return Math.abs(c) * X_LONG * ech(); }
    function h2() { return Math.abs(d) * ech(); }
    // la case i (0 = ac, 1 = ad, 2 = bc, 3 = bd) : [x0, y0, x1, y1], y0 en haut
    function caseBox(i) {
      var col = i < 2 ? 0 : 1, row = i % 2;              // ac, ad : colonne de gauche ; ac, bc : rangée du haut
      var x0 = RX + (col ? w1() : 0), x1 = x0 + (col ? w2() : w1());
      var y0 = RY - (row ? h1() : 0), y1 = y0 - (row ? h2() : h1());
      return [x0, y0, x1, y1];
    }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function pt(fx, fy) { return board.create('point', [fx, fy], { visible: false, fixed: true, name: '', withLabel: false }); }
    function texte(fx, fy, txt, col, taille, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: col,
                cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false, layer: 9 };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [fx, fy, txt], o);
    }

    // --- L'écriture et ses quatre flèches --------------------------------
    var XC = CW / 2;
    var TX = [XC - 132 * KX, XC - 62 * KX, XC + 62 * KX, XC + 132 * KX];     // les quatre termes
    [[XC - 172 * KX, '('], [XC - 22 * KX, ')'], [XC + 22 * KX, '('], [XC + 172 * KX, ')']].forEach(function (q) {
      texte(q[0], Y_EXP, q[1], INK, 24, { cssStyle: 'font-weight:400' });
    });
    var TERMES = [
      texte(TX[0], Y_EXP, function () { return mono(a, 1); }, INK, 22),
      texte(TX[1], Y_EXP, function () { return signe(b); }, INK, 22),
      texte(TX[2], Y_EXP, function () { return mono(c, 1); }, INK, 22),
      texte(TX[3], Y_EXP, function () { return signe(d); }, INK, 22)
    ];
    // la flèche i va du terme de la 1re parenthèse au terme de la 2de : deux par-dessus, deux par-dessous
    var ARCS = [[0, 2, 1, 19], [0, 3, 1, 32], [1, 2, -1, 17], [1, 3, -1, 29]].map(function (q, i) {
      var x1 = TX[q[0]], x2 = TX[q[1]], s = q[2], h = q[3], y0 = Y_EXP + s * 15;
      var cv = board.create('curve', [
        function (t) { return x1 + (x2 - x1) * t; },
        function (t) { return y0 + s * 4 * h * t * (1 - t); },
        0, function () { return Math.max(0.001, Math.min(1, pv(i) / 0.6)); }],
        { strokeColor: COLS[i], strokeWidth: 2.5, lastArrow: { type: 2, size: 5 }, doAdvancedPlot: false, numberPointsHigh: 48, numberPointsLow: 48, fixed: true, highlight: false, layer: 6, visible: false });
      cv.mvRole = 'fleche';
      return cv;
    });

    // --- Le rectangle coupé en quatre -------------------------------------
    var CASES = [0, 1, 2, 3].map(function (i) {
      var bx = function (k) { return function () { return caseBox(i)[k]; }; };
      var pg = board.create('polygon', [pt(bx(0), bx(1)), pt(bx(2), bx(1)), pt(bx(2), bx(3)), pt(bx(0), bx(3))],
        { fillColor: COLS[i], fillOpacity: 0, highlightFillOpacity: 0, fixed: true, highlight: false, layer: 2,
          vertices: { visible: false }, borders: { visible: false } });
      pg.mvRole = 'case';
      return pg;
    });
    function seg(x1, y1, x2, y2, o) {
      var at = { strokeColor: INK, strokeWidth: 2, fixed: true, highlight: false, layer: 5 };
      for (var k in (o || {})) at[k] = o[k];
      return board.create('segment', [pt(x1, y1), pt(x2, y2)], at);
    }
    function xr() { return RX + w1() + w2(); }
    function yb() { return RY - h1() - h2(); }
    function k0(v) { return function () { return v; }; }
    seg(k0(RX), k0(RY), xr, k0(RY)); seg(k0(RX), yb, xr, yb);
    seg(k0(RX), k0(RY), k0(RX), yb); seg(xr, k0(RY), xr, yb);
    var COUPES = [
      seg(function () { return RX + w1(); }, k0(RY), function () { return RX + w1(); }, yb, { strokeWidth: 1.5, dash: 2, visible: false }),
      seg(k0(RX), function () { return RY - h1(); }, xr, function () { return RY - h1(); }, { strokeWidth: 1.5, dash: 2, visible: false })
    ];
    // les côtés : les termes de la 1re parenthèse en haut, ceux de la 2de à gauche
    texte(function () { return RX + w1() / 2; }, RY + 14, function () { return mono(a, 1); }, INK, 14);
    texte(function () { return RX + w1() + w2() / 2; }, RY + 14, function () { return signe(b); }, INK, 14);
    texte(RX - 8, function () { return RY - h1() / 2; }, function () { return mono(c, 1); }, INK, 14, { anchorX: 'right' });
    texte(RX - 8, function () { return RY - h1() - h2() / 2; }, function () { return signe(d); }, INK, 14, { anchorX: 'right' });
    // dans chaque case : son produit, puis sa valeur
    var ETIQ = [0, 1, 2, 3].map(function (i) {
      var tx = texte(function () { var q = caseBox(i); return (q[0] + q[2]) / 2; }, function () { var q = caseBox(i); return (q[1] + q[3]) / 2; },
        function () { return D.P[i].res; }, COLS[i], 14);
      tx.mvRole = 'etiquette-case';
      return tx;
    });

    // --- À droite : les quatre produits, puis la somme et sa réduction ------
    var XD = CW - 148 * KX;
    var LISTE = [0, 1, 2, 3].map(function (i) {
      var tx = texte(XD, RY - 6 - 31 * i, function () { return D.P[i].ecrit + (vis.calc >= 0.5 ? ' = ' + D.P[i].res : ''); }, COLS[i], 15);
      tx.mvRole = 'produit';
      return tx;
    });
    var labBrut = texte(XD, RY - 150, function () { return '= ' + D.brut; }, INK, 15);
    var labRed = texte(XD, RY - 188, function () { return '= ' + D.reduit; }, C_OK, 19,
      { cssStyle: 'font-weight:800;white-space:nowrap;background:#ecfdf5;padding:2px 9px;border-radius:8px;box-shadow:0 0 0 1px #a7f3d0' });
    labBrut.mvRole = 'brut'; labRed.mvRole = 'reduit';

    // --- Les deux lignes qui racontent l'étape -----------------------------
    var ORD = ['1er', '2e'];
    function capHaut() {
      if (vis.red > 0) return D.B === 0
        ? 'On réduit : les deux termes en x sont opposés, ils s\'annulent.'
        : 'On réduit : les deux termes en x se regroupent, ' + somme([[a * d, 1], [b * c, 1]]) + ' = ' + mono(D.B, 1) + '.';
      if (vis.calc > 0) return 'On calcule chaque produit' + (D.negatif ? ' — attention à la règle des signes.' : '.');
      for (var i = 3; i >= 0; i--) {
        if (pv(i) > 0) return couleur(i, '<b>' + D.P[i].ecrit + '</b>') + ' : le ' + ORD[i < 2 ? 0 : 1] + ' terme de la première parenthèse × le ' +
                              ORD[i % 2] + ' de la seconde.';
      }
      if (vis.coupe > 0) return D.negatif
        ? 'Avec un signe −, le découpage se lit comme un tableau : 2 termes × 2 termes = 4 cases.'
        : 'Un rectangle de côtés ' + facteur(a, b) + ' et ' + facteur(c, d) + ', coupé en 4 : son aire est la somme des 4 cases.';
      return 'Développer : chaque terme de la première parenthèse multiplie chaque terme de la seconde.';
    }
    texte(XC, CH - 130, capHaut, INK, 13, { cssStyle: 'font-weight:400;white-space:nowrap' });
    texte(XC, 30, '(a + b)(c + d) = ac + ad + bc + bd', SOFT, 13);

    function refresh() {
      COUPES.forEach(function (s) { show(s, vis.coupe > 0); });
      for (var i = 0; i < 4; i++) {
        var v = pv(i);
        show(ARCS[i], v > 0);
        attr(CASES[i], 'fillOpacity', v <= 0 ? 0 : (v < 1 ? 0.5 : 0.24));
        show(ETIQ[i], v >= 0.6);
        attr(ETIQ[i], 'fontSize', Math.min(caseBox(i)[2] - caseBox(i)[0], caseBox(i)[1] - caseBox(i)[3]) < 30 ? 11 : 14);
        show(LISTE[i], v >= 0.6);
      }
      show(labBrut, vis.calc >= 0.5);
      show(labRed, vis.red >= 0.5);
    }

    /* ==================================================================== */
    /* Le panneau : le calcul, ligne à ligne                                 */
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
      { label: '(2x + 3)(x + 4)', v: [2, 3, 1, 4] },
      { label: '(x + 3)(x + 2)', v: [1, 3, 1, 2] },
      { label: '(2x − 1)(3x − 4)', v: [2, -1, 3, -4] },
      { label: '(x − 3)(x + 5)', v: [1, -3, 1, 5] },
      { label: '(−x + 2)(3x − 1)', v: [-1, 2, 3, -1] },
      { label: '(x − 3)(x + 3)', v: [1, -3, 1, 3] }
    ];
    var presetBtns = PRESETS.map(function (p) {
      var bt = el('button', 'ineq-preset', p.label);
      bt.type = 'button';
      bt.onclick = function () { a = p.v[0]; b = p.v[1]; c = p.v[2]; d = p.v[3]; syncInputs(); lastKey = null; arm(); };
      presets.appendChild(bt);
      return bt;
    });
    root.appendChild(presets);

    var entry = el('div', 'eq-entry');
    entry.appendChild(el('span', 'eq-entry-lab', 'Expression :'));
    function num(cls) { var i = el('input', cls); i.type = 'number'; i.step = '1'; return i; }
    var inA = num('eq-a'), inB = num('eq-b'), inC = num('eq-c'), inD = num('eq-d');
    entry.appendChild(el('span', 'eq-plus', '('));
    entry.appendChild(inA); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inB);
    entry.appendChild(el('span', 'eq-plus', ')('));
    entry.appendChild(inC); entry.appendChild(el('span', 'eq-x', 'x'));
    entry.appendChild(el('span', 'eq-plus', '+')); entry.appendChild(inD);
    entry.appendChild(el('span', 'eq-plus', ')'));
    var randBtn = el('button', 'eq-rand', '🎲 Autre expression'); randBtn.type = 'button';
    entry.appendChild(randBtn);
    root.appendChild(entry);
    var form = el('div', 'eq-form'); form.innerHTML = 'soit&nbsp; ';
    var formTxt = el('b', 'eq-form-txt'); form.appendChild(formTxt);
    root.appendChild(form);
    var stageEl = el('div', 'eq-stage'), linesEl = el('div', 'eq-lines');
    stageEl.appendChild(linesEl); root.appendChild(stageEl);
    var noteEl = el('div', 'eq-note');
    root.appendChild(noteEl);
    // la vérification : une valeur de x
    var verif = el('div', 'eq-entry');
    verif.appendChild(el('span', 'eq-entry-lab', 'Vérifier pour x ='));
    var inX = num('dd-x');
    verif.appendChild(inX);
    root.appendChild(verif);
    mv.extras.appendChild(root);
    var panel = el('div', 'props-panel');

    function renderLines() {
      var lignes = [];
      function ligne(html, note, final) {
        lignes.push((note ? '<div class="eq-line-note">' + note + '</div>' : '') +
                    '<div class="eq-line' + (final ? ' eq-sol' : '') + '">' + html + '</div>');
      }
      ligne(exprTxt());
      var faits = [0, 1, 2, 3].filter(function (i) { return pv(i) >= 0.999; });
      if (faits.length) {
        ligne('= ' + faits.map(function (i) { return couleur(i, D.P[i].ecrit); }).join(' + ') + (faits.length < 4 ? ' + …' : ''),
              'Chaque terme de la première parenthèse multiplie chaque terme de la seconde : 2 × 2 = <b>4 produits</b>.');
      }
      if (vis.calc >= 0.999) {
        var s = '';
        D.P.forEach(function (p, i) {
          s += (i === 0 ? couleur(i, p.res) : (p.k < 0 ? ' − ' : ' + ') + couleur(i, mono(Math.abs(p.k), p.deg)));
        });
        ligne('= ' + s, 'On calcule chaque produit' + (D.negatif ? ', avec la règle des signes : deux signes « − » donnent « + ».' : '.'));
      }
      if (vis.red >= 0.999) {
        ligne('= ' + D.reduit, D.B === 0 ? 'Les deux termes en x sont opposés : ils s\'annulent.'
                                         : 'On réduit : on regroupe les deux termes en x.', true);
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderNote() {
      if (vis.red >= 0.999) {
        noteEl.innerHTML = D.carre
          ? 'Les deux parenthèses sont les mêmes : c\'est <b>(' + facteur(a, b) + ')²</b>, une identité remarquable — le double produit vient des deux cases croisées.'
          : D.conj ? 'Les produits croisés s\'annulent : on retrouve l\'identité remarquable <b>(a + b)(a − b) = a² − b²</b>.'
          : '4 produits, puis 3 termes après réduction : <b>' + exprTxt() + ' = ' + D.reduit + '</b>.';
      } else if (vis.calc > 0) {
        noteEl.innerHTML = D.negatif ? 'Un seul signe « − » dans un produit : résultat négatif. Deux signes « − » : résultat positif.' : 'x × x = x², et un nombre × x reste un terme en x.';
      } else if (vis.p1 > 0) {
        noteEl.innerHTML = D.negatif ? 'Chaque terme part <b>avec son signe</b> : un terme précédé de « − » est un nombre négatif, écrit entre parenthèses dans le produit.'
                                     : 'Le piège : n\'écrire que deux produits. Il en faut <b>quatre</b>, les deux « croisés » compris.';
      } else noteEl.innerHTML = '';
    }
    function renderPanel() {
      renderLines(); renderNote();
      var fini = vis.red >= 0.999;
      var v1 = a * xv + b, v2 = c * xv + d, X = xv < 0 ? '(' + fmt(xv) + ')' : fmt(xv);
      var t2 = D.A * xv * xv, t1 = D.B * xv, dev = [t2].concat(D.B !== 0 ? [t1] : []).concat([D.C]);
      var devTxt = dev.map(function (v, i) { return i === 0 ? fmt(v) : (v < 0 ? ' − ' : ' + ') + fmt(Math.abs(v)); }).join('');
      panel.innerHTML =
        '<div class="props-label">Le résultat</div>' +
        '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? exprTxt() + ' = ' + D.reduit : exprTxt() + ' = … (lance l\'animation)') + '</p>' +
        '<div class="props-label">La règle</div>' +
        '<p style="margin:.2rem 0 .5rem"><b>(a + b)(c + d) = ac + ad + bc + bd</b> : chaque terme de la première parenthèse ' +
          'multiplie chaque terme de la seconde. C\'est la distributivité simple, deux fois : a(c + d) + b(c + d).</p>' +
        '<div class="props-label">Vérification pour x = ' + fmt(xv) + '</div>' +
        '<p style="margin:.2rem 0 0">Forme factorisée : ' + fmt(v1) + ' × ' + (v2 < 0 ? '(' + fmt(v2) + ')' : fmt(v2)) + ' = <strong>' + fmt(v1 * v2) + '</strong>.' +
          (fini ? '<br>Forme développée : ' + D.reduit.replace(/x²/g, ' × ' + X + '²').replace(/x/g, ' × ' + X).replace(/(^|[^\d,]) × /g, '$1') +
                  ' = ' + devTxt + ' = <strong style="color:' + C_OK + '">' + fmt(t2 + t1 + D.C) + '</strong> : le même nombre.'
                : '<br>Forme développée : à calculer une fois le développement terminé.') +
        '</p>';
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    function buildSteps() {
      return PLAN.map(function (k, i) {
        return { dur: k === 'coupe' ? 700 : k === 'calc' || k === 'red' ? 900 : 1300, step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }

    /* ==================================================================== */
    /* Saisie et (re)démarrage                                               */
    /* ==================================================================== */
    function clampInputs() {
      function lit(inp, lo, hi, cur) { var v = parseInt(inp.value, 10); return isNaN(v) ? cur : Math.max(lo, Math.min(hi, v)); }
      a = lit(inA, -3, 3, a); c = lit(inC, -3, 3, c); b = lit(inB, -6, 6, b); d = lit(inD, -6, 6, d);
      if (a === 0) a = 1;                                 // un terme nul, et il n'y a plus deux termes à distribuer
      if (c === 0) c = 1;
      if (b === 0) b = 1;
      if (d === 0) d = 1;
    }
    function syncInputs() { inA.value = a; inB.value = b; inC.value = c; inD.value = d; }
    var lastKey = null;
    function arm() {
      var key = [a, b, c, d].join(',');
      if (key === lastKey) return;
      lastKey = key;
      presetBtns.forEach(function (bt, i) { bt.className = 'ineq-preset' + (PRESETS[i].v.join(',') === key ? ' active' : ''); });
      formTxt.textContent = exprTxt();
      calcule();
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }
    function saisie() { clampInputs(); syncInputs(); arm(); }
    inA.oninput = inB.oninput = inC.oninput = inD.oninput = function () { clampInputs(); arm(); };
    inA.onchange = inB.onchange = inC.onchange = inD.onchange = saisie;
    function litX() { var v = parseInt(inX.value, 10); if (!isNaN(v)) xv = Math.max(-9, Math.min(9, v)); }
    inX.oninput = function () { litX(); renderPanel(); };
    inX.onchange = function () { litX(); inX.value = xv; renderPanel(); };
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    function nonzero(lo, hi) { var v; do { v = randInt(lo, hi); } while (v === 0); return v; }
    randBtn.onclick = function () {
      a = nonzero(-2, 3); c = nonzero(-2, 3);
      b = nonzero(-6, 6); d = nonzero(-6, 6);
      syncInputs(); lastKey = null; arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { lastKey = null; arm(); } }
    ]);
    mv.extras.appendChild(panel);
    syncInputs(); inX.value = xv;
    arm();
  }
});
