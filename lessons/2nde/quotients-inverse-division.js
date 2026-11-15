/*
 * Inverse et division de quotients (2nde) — diviser, c'est multiplier par
 * l'inverse.
 *
 * Deux volets, deux règles de la fiche « Quotients », et chacune se VOIT.
 *
 *   1) L'inverse de b/d est d/b. Un rectangle de largeur b/d et de hauteur d/b
 *      est posé à côté du carré unité, tous deux quadrillés par les MÊMES
 *      petites cases (1/d de large, 1/b de haut). Le carré unité en contient
 *      d × b, le rectangle b × d : autant. Son aire vaut donc 1, et
 *      b/d × d/b = 1 — c'est la définition de l'inverse.
 *
 *   2) a/c ÷ b/d = a/c × d/b. Diviser, c'est chercher combien de fois b/d
 *      rentre dans a/c. On trace la barre a/c et la pièce b/d, on les recoupe
 *      au même dénominateur c × d : la barre fait a × d petites parts, la
 *      pièce b × c. On reporte la pièce le long de la barre : elle y rentre
 *      (a × d) ÷ (b × c) fois — des copies entières, puis un morceau de copie.
 *      Or (a × d)/(c × b), c'est a/c × d/b : on a multiplié par l'inverse.
 *
 * Deux choses que la figure dit toute seule : diviser par un nombre plus
 * petit que 1 donne un résultat plus GRAND (la pièce est petite, elle rentre
 * souvent), et quand la pièce est plus longue que la barre le quotient est
 * plus petit que 1 (une fraction de pièce suffit).
 *
 * Technique : le nombre de cases et de copies dépend des fractions saisies,
 * donc rien n'est créé ni détruit — des réserves fixes de courbes, chacune
 * avec un updateDataArray() qui se recalcule depuis l'état et se vide quand
 * elle ne sert pas. Chaque courbe porte un `mvRole` que le contrôle relit.
 * État absolu par étape, rafraîchissement explicite.
 */
MathsView.register({
  id: 'quotients-inverse-division',
  title: 'Inverse et division de quotients',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Quotients',
  exercices: ['quotients-division'],
  theme: 'Calcul — diviser par un quotient, c\'est multiplier par son inverse',
  description:
    '<strong>L\'inverse</strong> de \\(\\dfrac{b}{d}\\) est \\(\\dfrac{d}{b}\\) : leur produit vaut 1. ' +
    'Et <strong>diviser</strong> par un quotient, c\'est <strong>multiplier par son inverse</strong> : ' +
    '\\(\\dfrac{a}{c}\\div\\dfrac{b}{d}=\\dfrac{a}{c}\\times\\dfrac{d}{b}\\).' +
    '<br>Le premier volet montre pourquoi le produit vaut 1 : le rectangle \\(\\frac{b}{d}\\times\\frac{d}{b}\\) ' +
    'contient autant de petites cases que le carré unité. Le second reporte la pièce \\(\\frac{b}{d}\\) le long de ' +
    'la barre \\(\\frac{a}{c}\\) et compte combien de fois elle y rentre.' +
    '<br>Choisis un volet et un exemple, ou saisis tes nombres, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>L\'inverse.</strong> L\'inverse d\'un nombre non nul \\(x\\) est le nombre \\(\\dfrac{1}{x}\\), celui qui ' +
    'donne 1 quand on le multiplie par \\(x\\). Pour un quotient, on <strong>échange</strong> numérateur et ' +
    'dénominateur : l\'inverse de \\(\\dfrac{2}{3}\\) est \\(\\dfrac{3}{2}\\), car ' +
    '\\(\\dfrac{2}{3}\\times\\dfrac{3}{2}=\\dfrac{6}{6}=1\\).</li>' +
    '<li><strong>Cas particuliers.</strong> L\'inverse de \\(5=\\dfrac{5}{1}\\) est \\(\\dfrac{1}{5}\\) ; l\'inverse de ' +
    '\\(\\dfrac{1}{4}\\) est \\(4\\). <strong>Zéro n\'a pas d\'inverse</strong> : aucun nombre multiplié par 0 ne donne 1.</li>' +
    '<li><strong>Inverse n\'est pas opposé.</strong> L\'opposé de \\(\\dfrac{2}{3}\\) est \\(-\\dfrac{2}{3}\\) (leur ' +
    '<em>somme</em> vaut 0) ; son inverse est \\(\\dfrac{3}{2}\\) (leur <em>produit</em> vaut 1). L\'inverse garde le signe : ' +
    'l\'inverse de \\(-\\dfrac{2}{3}\\) est \\(-\\dfrac{3}{2}\\).</li>' +
    '<li><strong>Diviser.</strong> \\(\\dfrac{a}{c}\\div\\dfrac{b}{d}=\\dfrac{a}{c}\\times\\dfrac{d}{b}=\\dfrac{a\\times d}{c\\times b}\\), ' +
    'avec \\(b\\), \\(c\\) et \\(d\\) non nuls. On ne retourne que le <strong>second</strong> quotient, celui par lequel on divise.</li>' +
    '<li><strong>Simplifier avant de multiplier.</strong> \\(\\dfrac{5}{6}\\div\\dfrac{5}{3}=\\dfrac{5}{6}\\times\\dfrac{3}{5}' +
    '=\\dfrac{5\\times3}{2\\times3\\times5}=\\dfrac{1}{2}\\).</li>' +
    '<li><strong>Écriture à étages.</strong> \\(\\dfrac{\\;\\frac{3}{4}\\;}{\\frac{2}{3}}\\) se lit ' +
    '\\(\\dfrac{3}{4}\\div\\dfrac{2}{3}=\\dfrac{3}{4}\\times\\dfrac{3}{2}=\\dfrac{9}{8}\\). Le grand trait est la division principale.</li>' +
    '<li><strong>Plus grand ou plus petit ?</strong> Diviser par un nombre plus petit que 1 <em>agrandit</em> : ' +
    '\\(\\dfrac{3}{2}\\div\\dfrac{1}{4}=6\\), il y a six quarts dans \\(\\dfrac{3}{2}\\).</li>' +
    '</ul>',
  board: {
    boundingbox: [-0.25, 4.9, 2.25, -0.7], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Inverse et division de quotients',
    figures: [{
      legende: '3/2 ÷ 1/4 = 6 : la pièce d\'un quart rentre six fois dans trois demis.',
      boundingbox: [-0.15, 1.75, 2.15, -0.5],
      keepaspectratio: false,
      largeur: 62, hauteur: 30,
      dessine: function (board) {
        var g = '#334155', b1 = '#2563eb', b2 = '#ea580c';
        function boite(x0, y0, x1, y1, a) {
          var o = { borders: { strokeColor: g, strokeWidth: 1 }, vertices: { visible: false }, highlight: false, fixed: true, fillOpacity: 0 };
          for (var k in a) o[k] = a[k];
          board.create('polygon', [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], o);
        }
        boite(0, 0.95, 1.5, 1.4, { fillColor: b1, fillOpacity: 0.35 });
        boite(1.5, 0.95, 2, 1.4, { borders: { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2 } });
        board.create('segment', [[1, 0.95], [1, 1.4]], { strokeColor: g, strokeWidth: 1.6, fixed: true, highlight: false });
        board.create('segment', [[0.5, 0.95], [0.5, 1.4]], { strokeColor: g, strokeWidth: 1, fixed: true, highlight: false });
        for (var i = 0; i < 6; i++) {
          boite(i * 0.25, 0.35, (i + 1) * 0.25, 0.8, { fillColor: b2, fillOpacity: i % 2 ? 0.25 : 0.5 });
          board.create('text', [i * 0.25 + 0.125, 0.575, String(i + 1)], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: '#9a3412', cssStyle: 'font-weight:800', fixed: true, highlight: false });
        }
        board.create('text', [0.75, 1.6, '3/2'], { anchorX: 'middle', anchorY: 'middle', fontSize: 10, color: b1, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        board.create('text', [0.125, 0.12, '1/4'], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: b2, cssStyle: 'font-weight:800', fixed: true, highlight: false });
        [0, 1, 2].forEach(function (u) {
          board.create('text', [u, -0.3, String(u)], { anchorX: 'middle', anchorY: 'middle', fontSize: 8, color: '#64748b', fixed: true, highlight: false });
        });
      }
    }],
    points: [
      'L\'<b>inverse</b> d\'un nombre non nul est le nombre qui, multiplié par lui, donne <b>1</b>.',
      'L\'inverse de \\( \\dfrac{b}{d} \\) est \\( \\dfrac{d}{b} \\) : on <b>échange</b> numérateur et dénominateur. Zéro n\'a pas d\'inverse.',
      'Inverse n\'est pas opposé : l\'inverse garde le <b>signe</b>.',
      '<b>Diviser</b> par un quotient, c\'est <b>multiplier par son inverse</b> : \\( \\dfrac{a}{c} \\div \\dfrac{b}{d} = \\dfrac{a}{c} \\times \\dfrac{d}{b} \\).',
      'On ne retourne que le <b>second</b> quotient. On simplifie avant de multiplier.'
    ],
    exemples: [
      'L\'inverse de \\( \\dfrac{2}{3} \\) est \\( \\dfrac{3}{2} \\) ; celui de 5 est \\( \\dfrac{1}{5} \\) ; celui de \\( -\\dfrac{1}{4} \\) est \\( -4 \\).',
      '\\( \\dfrac{3}{4} \\div \\dfrac{2}{3} = \\dfrac{3}{4} \\times \\dfrac{3}{2} = \\dfrac{9}{8} \\) ; \\( \\dfrac{5}{6} \\div \\dfrac{5}{3} = \\dfrac{5}{6} \\times \\dfrac{3}{5} = \\dfrac{1}{2} \\).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette et écritures                                                  */
    /* ==================================================================== */
    var C1 = '#2563eb', C2 = '#ea580c', C_OK = '#16a34a', C_NO = '#dc2626';
    var INK = '#334155', SOFT = '#94a3b8', PALE = '#e2e8f0';

    function pgcd(x, y) { x = Math.abs(x); y = Math.abs(y); while (y) { var t = y; y = x % y; x = t; } return x || 1; }
    function reduit(n, d) { var g = pgcd(n, d); return { n: n / g, d: d / g }; }
    // une fraction en texte (« 3/4 », « 3 » si le dénominateur vaut 1)…
    function fr(n, d) { return d === 1 ? String(n) : n + '/' + d; }
    // … et en HTML, numérateur au-dessus du dénominateur
    function frH(n, d, col) {
      var s = d === 1 ? String(n)
        : '<span class="eq-frac"><span class="eq-num">' + n + '</span><span class="eq-den">' + d + '</span></span>';
      return col ? '<span style="color:' + col + '">' + s + '</span>' : s;
    }

    /* ==================================================================== */
    /* Les deux volets et leurs exemples                                     */
    /* ==================================================================== */
    var VOLETS = [{ cle: 'inv', nom: '1 · L\'inverse' }, { cle: 'div', nom: '2 · Diviser' }];
    var PLANS = { inv: ['unite', 'rect', 'compte', 'regle'], div: ['barre', 'piece', 'meme', 'report', 'regle'] };
    var DUREES = { unite: 800, rect: 1200, compte: 700, regle: 700, barre: 900, piece: 900, meme: 900, report: 2200 };
    var CAS = {
      inv: [{ b: 2, d: 3 }, { b: 3, d: 4 }, { b: 5, d: 2 }, { b: 1, d: 4 }, { b: 3, d: 1 }],
      div: [{ a: 3, c: 2, b: 1, d: 4 }, { a: 3, c: 4, b: 2, d: 3 }, { a: 1, c: 2, b: 3, d: 4 },
            { a: 2, c: 1, b: 2, d: 3 }, { a: 5, c: 6, b: 5, d: 3 }]
    };
    function nomCas(v, cs) {
      return v === 'inv' ? 'inverse de ' + fr(cs.b, cs.d) : fr(cs.a, cs.c) + ' ÷ ' + fr(cs.b, cs.d);
    }

    var volet = 'inv', iCas = 0;
    var a = 3, c = 2, b = 2, d = 3;        // a/c ÷ b/d ; le volet 1 n'utilise que b/d
    var D = null;
    var N_COPIES = 19, N_CASES = 36;

    function calcule() {
      if (volet === 'inv') {
        D = { w: b / d, h: d / b, n: b * d };
      } else {
        var q = reduit(a * d, c * b);
        D = { L: a / c, s: b / d, m: c * d, pa: a * d, pb: b * c, q: (a * d) / (b * c), qn: q.n, qd: q.d,
              entier: Math.floor((a * d) / (b * c) + 1e-9) };
        var reste = reduit(a * d - D.entier * b * c, b * c);
        D.rn = reste.n; D.rd = reste.d;                           // la fraction de pièce qui reste
      }
    }
    function bornesFenetre() {
      if (volet === 'inv') {
        // même échelle en x et en y (le carré unité doit être carré), le haut
        // de la fenêtre étant réservé au titre et à la phrase
        var W = 1.5 + Math.max(D.w, 1), H = Math.max(D.h, 1);
        var lx = W + 0.9, ly = (H + 1.3) / 0.78;
        var cw = board.canvasWidth || 640, ch = board.canvasHeight || 480;
        var u = Math.min(cw / lx, ch / ly), larg = cw / u, haut = ch / u;
        var y2 = -1.15 - 0.25 * (haut - ly);
        board.setBoundingBox([W / 2 - larg / 2, y2 + haut, W / 2 + larg / 2, y2], false);
      } else {
        var X = Math.max(Math.ceil(D.L - 1e-9), Math.ceil(D.s - 1e-9), 1);
        if (D.rn !== 0) X = Math.max(X, (D.entier + 1) * D.s);      // la copie qui dépasse reste dans le cadre
        board.setBoundingBox([-0.08 * X - 0.05, 4.9, X + 0.08 * X + 0.05, -0.7], false);
      }
    }
    calcule();
    bornesFenetre();

    /* ==================================================================== */
    /* État de l'animation (absolu)                                          */
    /* ==================================================================== */
    var vis = {};
    function applyStage(i, p) {
      ['unite', 'rect', 'compte', 'regle', 'barre', 'piece', 'meme', 'report'].forEach(function (k) { vis[k] = 0; });
      PLANS[volet].forEach(function (k, j) { vis[k] = j < i ? 1 : (j === i ? p : 0); });
      renderPanel();
    }
    applyStage(-1, 0);
    function inv() { return volet === 'inv'; }

    /* ==================================================================== */
    /* La figure : des réserves de courbes qui se recalculent                */
    /* ==================================================================== */
    function vide(cv) { cv.dataX = []; cv.dataY = []; }
    function rect(cv, x0, y0, x1, y1) { cv.dataX = [x0, x1, x1, x0, x0]; cv.dataY = [y0, y0, y1, y1, y0]; }
    function courbe(role, attrs, maj) {
      var o = { strokeColor: INK, strokeWidth: 1.5, fixed: true, highlight: false, layer: 5 };
      for (var k in attrs) o[k] = attrs[k];
      var cv = board.create('curve', [[], []], o);
      cv.mvRole = role;
      cv.updateDataArray = function () { maj(this); };
      return cv;
    }
    // un quadrillage : nx colonnes, ny lignes, dans [x0 ; x1] × [y0 ; y1]
    function quadrille(cv, x0, y0, x1, y1, nx, ny) {
      var X = [], Y = [], k;
      for (k = 0; k <= nx; k++) { var x = x0 + (x1 - x0) * k / nx; X.push(x, x, NaN); Y.push(y0, y1, NaN); }
      for (k = 0; k <= ny; k++) { var y = y0 + (y1 - y0) * k / ny; X.push(x0, x1, NaN); Y.push(y, y, NaN); }
      cv.dataX = X; cv.dataY = Y;
    }
    // des traits verticaux aux multiples de `pas`, de 0 à `fin`
    function traits(cv, pas, fin, y0, y1) {
      var X = [], Y = [], n = Math.round(fin / pas);
      for (var k = 0; k <= n; k++) { X.push(k * pas, k * pas, NaN); Y.push(y0, y1, NaN); }
      cv.dataX = X; cv.dataY = Y;
    }

    /* ---- Volet 1 : le carré unité et le rectangle b/d × d/b --------------- */
    var RX = 1.5;                                       // abscisse du rectangle
    courbe('unite', { fillColor: PALE, fillOpacity: 0.7, strokeWidth: 2 }, function (cv) {
      if (!inv() || vis.unite <= 0) return vide(cv);
      rect(cv, 0, 0, 1, 1);
    });
    courbe('grille-unite', { strokeColor: SOFT, strokeWidth: 1 }, function (cv) {
      if (!inv() || vis.unite < 0.5) return vide(cv);
      quadrille(cv, 0, 0, 1, 1, d, b);                  // d colonnes de 1/d, b lignes de 1/b
    });
    courbe('rectangle', { fillColor: C1, fillOpacity: 0.3, strokeColor: C1, strokeWidth: 2.5 }, function (cv) {
      if (!inv() || vis.rect <= 0) return vide(cv);
      rect(cv, RX, 0, RX + D.w, D.h * vis.rect);        // il monte jusqu'à sa hauteur d/b
    });
    courbe('grille-rect', { strokeColor: C1, strokeWidth: 1 }, function (cv) {
      if (!inv() || vis.rect < 1) return vide(cv);
      quadrille(cv, RX, 0, RX + D.w, D.h, b, d);        // b colonnes, d lignes : les mêmes cases
    });
    // une case mise en valeur dans chaque figure, quand on compte
    courbe('case-unite', { fillColor: C_OK, fillOpacity: 0.55, strokeColor: C_OK, strokeWidth: 2, layer: 6 }, function (cv) {
      if (!inv() || vis.compte <= 0) return vide(cv);
      rect(cv, 0, 0, 1 / d, 1 / b);
    });
    courbe('case-rect', { fillColor: C_OK, fillOpacity: 0.55, strokeColor: C_OK, strokeWidth: 2, layer: 6 }, function (cv) {
      if (!inv() || vis.compte <= 0) return vide(cv);
      rect(cv, RX, 0, RX + 1 / d, 1 / b);
    });

    /* ---- Volet 2 : la barre a/c, la pièce b/d, les copies ----------------- */
    var Y_B = [2.7, 3.45], Y_C = [1.95, 2.55], Y_P = [0.45, 1.2];
    function unites() { return Math.max(1, Math.ceil(D.L - 1e-9)); }
    courbe('cadre-barre', { strokeColor: SOFT, strokeWidth: 1.2, dash: 2 }, function (cv) {
      if (inv() || vis.barre <= 0) return vide(cv);
      quadrille(cv, 0, Y_B[0], unites(), Y_B[1], unites(), 1);
    });
    courbe('barre', { fillColor: C1, fillOpacity: 0.35, strokeColor: C1, strokeWidth: 2.5 }, function (cv) {
      if (inv() || vis.barre <= 0) return vide(cv);
      rect(cv, 0, Y_B[0], D.L * vis.barre, Y_B[1]);
    });
    courbe('parts-barre', { strokeColor: C1, strokeWidth: 2 }, function (cv) {
      if (inv() || vis.barre < 1) return vide(cv);
      traits(cv, 1 / c, unites(), Y_B[0], Y_B[1]);
    });
    courbe('fines-barre', { strokeColor: C1, strokeWidth: 0.8 }, function (cv) {
      if (inv() || vis.meme <= 0) return vide(cv);
      traits(cv, 1 / D.m, D.L, Y_B[0], Y_B[0] + (Y_B[1] - Y_B[0]) * vis.meme);
    });
    courbe('cadre-piece', { strokeColor: SOFT, strokeWidth: 1.2, dash: 2 }, function (cv) {
      if (inv() || vis.piece <= 0) return vide(cv);
      var u = Math.max(1, Math.ceil(D.s - 1e-9));
      quadrille(cv, 0, Y_P[0], u, Y_P[1], u, 1);
    });
    courbe('piece', { fillColor: C2, fillOpacity: 0.4, strokeColor: C2, strokeWidth: 2.5 }, function (cv) {
      if (inv() || vis.piece <= 0) return vide(cv);
      rect(cv, 0, Y_P[0], D.s * vis.piece, Y_P[1]);
    });
    courbe('parts-piece', { strokeColor: C2, strokeWidth: 2 }, function (cv) {
      if (inv() || vis.piece < 1) return vide(cv);
      traits(cv, 1 / d, Math.max(1, Math.ceil(D.s - 1e-9)), Y_P[0], Y_P[1]);
    });
    courbe('fines-piece', { strokeColor: C2, strokeWidth: 0.8 }, function (cv) {
      if (inv() || vis.meme <= 0) return vide(cv);
      traits(cv, 1 / D.m, D.s, Y_P[0], Y_P[0] + (Y_P[1] - Y_P[0]) * vis.meme);
    });
    // Les copies de la pièce, reportées bout à bout le long de la barre.
    function finCopie(k) { return Math.min((k + 1) * D.s, D.L * vis.report); }
    for (var k = 0; k < N_COPIES; k++) {
      (function (k) {
        courbe('copie', { fillColor: C2, fillOpacity: k % 2 ? 0.22 : 0.48, strokeColor: C2, strokeWidth: 1.8 }, function (cv) {
          if (inv() || vis.report <= 0 || k * D.s >= D.L * vis.report - 1e-9) return vide(cv);
          rect(cv, k * D.s, Y_C[0], finCopie(k), Y_C[1]);
        });
        board.create('text', [function () { return inv() ? 0 : (k * D.s + Math.min((k + 1) * D.s, D.L)) / 2; }, (Y_C[0] + Y_C[1]) / 2,
          function () { return k < D.entier ? String(k + 1) : fr(D.rn, D.rd); }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: '#9a3412', cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 9,
            visible: function () { return !inv() && k * D.s < D.L - 1e-9 && finCopie(k) >= Math.min((k + 1) * D.s, D.L) - 1e-9 && vis.report > 0; } });
      })(k);
    }
    // La dernière copie, quand elle dépasse : son contour entier, en pointillé.
    courbe('depasse', { strokeColor: C2, strokeWidth: 1.2, dash: 2 }, function (cv) {
      if (inv() || vis.report < 1 || D.rn === 0) return vide(cv);
      rect(cv, D.entier * D.s, Y_C[0], (D.entier + 1) * D.s, Y_C[1]);
    });

    /* ---- Les textes -------------------------------------------------------- */
    function bb() { return board.getBoundingBox(); }
    function cx() { var B = bb(); return (B[0] + B[2]) / 2; }
    function yHaut(f) { var B = bb(); return B[1] - f * (B[1] - B[3]); }
    function texte(fx, fy, fn, col, taille, quand, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: col || INK,
                cssStyle: 'font-weight:800;white-space:nowrap', fixed: true, highlight: false, layer: 9, visible: quand || true };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [fx, fy, fn], o);
    }
    // les graduations des unités, sous chaque barre du volet 2
    for (var u = 0; u <= 3; u++) {
      (function (u) {
        texte(u, Y_B[0] - 0.14, String(u), SOFT, 10, function () { return !inv() && vis.barre > 0 && u <= unites() && !(vis.report > 0); }, { cssStyle: '' });
        texte(u, Y_P[0] - 0.16, String(u), SOFT, 10, function () { return !inv() && vis.piece > 0 && u <= Math.max(1, Math.ceil(D.s - 1e-9)); }, { cssStyle: '' });
      })(u);
    }
    texte(function () { return D.L / 2; }, Y_B[1] + 0.22, function () {
      return fr(a, c) + (vis.meme >= 1 && D.m !== c ? ' = ' + fr(D.pa, D.m) : '') + (vis.meme >= 1 ? ' : ' + D.pa + ' petite' + (D.pa > 1 ? 's' : '') + ' part' + (D.pa > 1 ? 's' : '') : '');
    }, C1, 13, function () { return !inv() && vis.barre >= 1; });
    texte(function () { return D.s / 2; }, Y_P[1] + 0.22, function () {
      return fr(b, d) + (vis.meme >= 1 && D.m !== d ? ' = ' + fr(D.pb, D.m) : '') + (vis.meme >= 1 ? ' : ' + D.pb + ' petite' + (D.pb > 1 ? 's' : '') + ' part' + (D.pb > 1 ? 's' : '') : '');
    }, C2, 13, function () { return !inv() && vis.piece >= 1; }, { anchorX: function () { return D.s < 0.5 ? 'left' : 'middle'; } });
    // les cotes du volet 1
    texte(0.5, -0.2, '1', INK, 12, function () { return inv() && vis.unite > 0; });
    texte(-0.12, 0.5, '1', INK, 12, function () { return inv() && vis.unite > 0; });
    texte(function () { return RX + D.w / 2; }, -0.2, function () { return fr(b, d); }, C1, 13, function () { return inv() && vis.rect > 0; });
    texte(function () { return RX - 0.1; }, function () { return D.h / 2; }, function () { return fr(d, b); }, C1, 13,
      function () { return inv() && vis.rect >= 1; }, { anchorX: 'right' });
    texte(0.5, -0.52, function () { return d + ' × ' + b + ' = ' + D.n + ' cases'; }, C_OK, 12, function () { return inv() && vis.compte > 0; });
    texte(function () { return RX + D.w / 2; }, -0.84, function () { return b + ' × ' + d + ' = ' + D.n + ' cases'; }, C_OK, 12,
      function () { return inv() && vis.compte > 0; });

    // Le titre et la phrase qui raconte l'étape.
    function titre() {
      if (inv()) return fr(b, d) + ' × ' + fr(d, b) + (vis.regle > 0 ? ' = 1' : ' = ?');
      return fr(a, c) + ' ÷ ' + fr(b, d) + (vis.regle > 0 ? ' = ' + fr(a, c) + ' × ' + fr(d, b) + ' = ' + fr(D.qn, D.qd) : vis.report >= 1 ? ' = ' + fr(D.qn, D.qd) : ' = ?');
    }
    function fois(n, dn) {                       // « 6 fois », « 9/8 de fois », « 2/3 de fois »
      return dn === 1 ? n + ' fois' : fr(n, dn) + ' de fois';
    }
    function capHaut() {
      if (inv()) {
        if (vis.regle > 0) return 'Le produit vaut 1 : <b style="color:' + C_OK + '">' + fr(d, b) + ' est l\'inverse de ' + fr(b, d) + '</b>.';
        if (vis.compte > 0) return 'Les mêmes petites cases, en même nombre : le rectangle a la <b>même aire</b> que le carré unité.';
        if (vis.rect > 0) return 'Un rectangle de largeur <b style="color:' + C1 + '">' + fr(b, d) + '</b> et de hauteur <b style="color:' + C1 + '">' + fr(d, b) + '</b> : son aire est leur produit.';
        if (vis.unite > 0) return 'Le carré unité, d\'aire 1, coupé en ' + d + ' colonne' + (d > 1 ? 's' : '') + ' et ' + b + ' ligne' + (b > 1 ? 's' : '') + '.';
        return 'Que vaut le produit d\'un quotient par le quotient « retourné » ?';
      }
      if (vis.regle > 0) return 'Diviser par ' + fr(b, d) + ', c\'est <b style="color:' + C_OK + '">multiplier par son inverse ' + fr(d, b) + '</b>.';
      if (vis.report > 0) return 'On reporte la pièce le long de la barre : elle y rentre <b style="color:' + C2 + '">' + fois(D.qn, D.qd) + '</b>.';
      if (vis.meme > 0) return 'Au même dénominateur ' + D.m + ' : la barre fait <b style="color:' + C1 + '">' + D.pa + '</b> petites parts, la pièce <b style="color:' + C2 + '">' + D.pb + '</b>.';
      if (vis.piece > 0) return 'Diviser, c\'est chercher <b>combien de fois</b> <b style="color:' + C2 + '">' + fr(b, d) + '</b> rentre dans <b style="color:' + C1 + '">' + fr(a, c) + '</b>.';
      if (vis.barre > 0) return 'La barre : <b style="color:' + C1 + '">' + fr(a, c) + '</b> d\'unité.';
      return 'Combien de fois ' + fr(b, d) + ' rentre-t-il dans ' + fr(a, c) + ' ?';
    }
    function capBas() {
      if (inv() || vis.report < 1) return '';
      if (D.q < 1 - 1e-9) return 'La pièce est plus longue que la barre : une fraction de pièce suffit, le résultat est plus petit que 1.';
      if (D.q > D.L + 1e-9) return 'La pièce est plus petite que 1 : le résultat est plus grand que ' + fr(a, c) + '.';
      return '';
    }
    texte(cx, function () { return yHaut(0.055); }, titre, INK, 20);
    texte(cx, function () { return yHaut(0.125); }, capHaut, INK, 13, true, { cssStyle: 'white-space:nowrap' });
    texte(cx, function () { return yHaut(0.965); }, capBas, INK, 13, true, { cssStyle: 'white-space:nowrap' });

    /* ==================================================================== */
    /* Les choix : volet, exemple, saisie                                    */
    /* ==================================================================== */
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    function pastille(parent, cls, txt, onclick) {
      var bt = el('button', 'ineq-preset ' + cls, txt);
      bt.type = 'button'; bt.onclick = onclick;
      parent.appendChild(bt);
      return bt;
    }
    var root = el('div', 'eq-ui ineq-ui');
    var rowVolets = el('div', 'ineq-presets melange-choix mv-volets');
    var voletBtns = VOLETS.map(function (v) { return pastille(rowVolets, 'qd-volet', v.nom, function () { choisirVolet(v.cle); }); });
    root.appendChild(rowVolets);
    var rowCas = {}, casBtns = {};
    VOLETS.forEach(function (v) {
      var row = el('div', 'ineq-presets');
      casBtns[v.cle] = CAS[v.cle].map(function (cs, i) { return pastille(row, 'qd-cas', nomCas(v.cle, cs), function () { choisirCas(i); }); });
      rowCas[v.cle] = row;
      root.appendChild(row);
    });

    // La saisie : a/c ÷ b/d (le volet 1 ne montre que b/d).
    var entry = el('div', 'eq-entry');
    var labSaisie = el('span', 'eq-entry-lab', '');
    entry.appendChild(labSaisie);
    function num(cls) { var i = el('input', cls); i.type = 'number'; i.step = '1'; i.min = '1'; return i; }
    var inA = num('qd-a'), inC = num('qd-c'), inB = num('qd-b'), inD = num('qd-d');
    var blocAC = el('span', 'qd-bloc-ac');
    blocAC.appendChild(inA); blocAC.appendChild(el('span', 'eq-plus', '/')); blocAC.appendChild(inC);
    blocAC.appendChild(el('span', 'eq-plus', '÷'));
    entry.appendChild(blocAC);
    entry.appendChild(inB); entry.appendChild(el('span', 'eq-plus', '/')); entry.appendChild(inD);
    var randBtn = el('button', 'eq-rand', '🎲 Autre exemple'); randBtn.type = 'button';
    entry.appendChild(randBtn);
    root.appendChild(entry);

    var stageEl = el('div', 'eq-stage'), linesEl = el('div', 'eq-lines');
    stageEl.appendChild(linesEl); root.appendChild(stageEl);
    var noteEl = el('div', 'eq-note');
    root.appendChild(noteEl);
    mv.extras.appendChild(root);
    var panel = el('div', 'props-panel');

    function marquer() {
      VOLETS.forEach(function (v, i) {
        voletBtns[i].className = 'ineq-preset qd-volet' + (v.cle === volet ? ' active' : '');
        rowCas[v.cle].style.display = v.cle === volet ? '' : 'none';
        casBtns[v.cle].forEach(function (bt, j) { bt.className = 'ineq-preset qd-cas' + (v.cle === volet && j === iCas ? ' active' : ''); });
      });
      blocAC.style.display = inv() ? 'none' : '';
      labSaisie.textContent = inv() ? 'Le quotient :' : 'La division :';
      inA.value = a; inC.value = c; inB.value = b; inD.value = d;
    }

    /* ==================================================================== */
    /* Le panneau : le calcul, ligne à ligne                                 */
    /* ==================================================================== */
    function renderLines() {
      var lignes = [];
      function ligne(html, note, final) {
        lignes.push((note ? '<div class="eq-line-note">' + note + '</div>' : '') +
                    '<div class="eq-line' + (final ? ' eq-sol' : '') + '">' + html + '</div>');
      }
      if (inv()) {
        ligne(frH(b, d, C1) + ' × ' + frH(d, b, C1));
        if (vis.compte >= 1) ligne('= ' + frH(b + ' × ' + d, d + ' × ' + b) + ' = ' + frH(D.n, D.n),
                                   'Le rectangle contient ' + b + ' × ' + d + ' cases, le carré unité ' + d + ' × ' + b + '.');
        if (vis.regle >= 1) ligne('= 1', 'Un produit égal à 1 : chacun des deux nombres est l\'<b>inverse</b> de l\'autre.', true);
      } else {
        ligne(frH(a, c, C1) + ' ÷ ' + frH(b, d, C2));
        if (vis.meme >= 1) ligne('= ' + frH(D.pa, D.m, C1) + ' ÷ ' + frH(D.pb, D.m, C2),
                                 'Au même dénominateur ' + c + ' × ' + d + ' = ' + D.m + '.');
        if (vis.report >= 1) ligne('= ' + frH(a + ' × ' + d, c + ' × ' + b),
                                   D.pa + ' petites parts en contiennent ' + D.pb + ' : ' + D.pa + ' ÷ ' + D.pb + ', soit ' + fois(D.qn, D.qd) + '.');
        if (vis.regle >= 1) {
          ligne('= ' + frH(a, c, C1) + ' × ' + frH(d, b, C2), 'C\'est le produit par l\'<b>inverse</b> : on a retourné le second quotient.');
          ligne('= ' + frH(D.qn, D.qd), D.qn === a * d ? 'La fraction est irréductible.' : 'On simplifie.', true);
        }
      }
      linesEl.innerHTML = lignes.join('');
    }
    function renderPanel() {
      if (!linesEl) return;
      renderLines();
      var fini = vis.regle >= 1, html;
      if (inv()) {
        noteEl.innerHTML = fini ? '<b style="color:' + C_OK + '">L\'inverse de ' + fr(b, d) + ' est ' + fr(d, b) + '</b>' +
          (d === 1 ? ' : l\'inverse d\'un entier est 1 sur cet entier.' : b === 1 ? ' : l\'inverse de 1 sur un entier est cet entier.' : ' : on échange numérateur et dénominateur.') : '';
        html = '<div class="props-label">La règle</div>' +
          '<p style="margin:.2rem 0 .5rem">L\'<b>inverse</b> d\'un nombre non nul est le nombre qui, multiplié par lui, donne <b>1</b>. ' +
          'Pour un quotient, on échange numérateur et dénominateur.</p>' +
          '<div class="props-label">Le résultat</div>' +
          '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? 'inverse de ' + fr(b, d) + ' = ' + fr(d, b) : '… (lance l\'animation)') + '</p>' +
          '<div class="props-label">À ne pas confondre</div>' +
          '<p style="margin:.2rem 0 0">L\'<b>opposé</b> de ' + fr(b, d) + ' est −' + fr(b, d) + ' (leur somme vaut 0). L\'<b>inverse</b> est ' + fr(d, b) +
          ' (leur produit vaut 1). <b style="color:' + C_NO + '">Zéro n\'a pas d\'inverse.</b></p>';
      } else {
        noteEl.innerHTML = fini ? '<b style="color:' + C_OK + '">' + fr(a, c) + ' ÷ ' + fr(b, d) + ' = ' + fr(D.qn, D.qd) + '</b>' : '';
        html = '<div class="props-label">La règle</div>' +
          '<p style="margin:.2rem 0 .5rem"><b>Diviser</b> par un quotient, c\'est <b>multiplier par son inverse</b>. On ne retourne que le second quotient.</p>' +
          '<div class="props-label">Le résultat</div>' +
          '<p style="margin:.2rem 0 .5rem;font-size:1.15rem;font-weight:800;color:' + (fini ? C_OK : SOFT) + '">' +
          (fini ? fr(a, c) + ' ÷ ' + fr(b, d) + ' = ' + fr(a, c) + ' × ' + fr(d, b) + ' = ' + fr(D.qn, D.qd) : '… (lance l\'animation)') + '</p>' +
          '<div class="props-label">Vérifier</div>' +
          '<p style="margin:.2rem 0 0">Une division se vérifie par une multiplication : ' + fr(D.qn, D.qd) + ' × ' + fr(b, d) + ' = ' +
          fr(D.qn * b, D.qd * d) + (D.qn * b === a && D.qd * d === c ? '' : ' = ' + fr(reduit(a, c).n, reduit(a, c).d)) + ', on retrouve bien ' + fr(a, c) + '.</p>';
      }
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les étapes                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function reset() { applyStage(-1, 0); }
    function buildSteps() {
      return PLANS[volet].map(function (k, i) {
        return { dur: DUREES[k], step: function (p) { applyStage(i, p); }, after: function () { applyStage(i, 1); } };
      });
    }
    function arm() {
      calcule();
      bornesFenetre();
      marquer();
      reset();
      anim.runSteps(buildSteps(), reset);
      board.update();
    }
    function prendre(cs) { if (cs.a != null) { a = cs.a; c = cs.c; } b = cs.b; d = cs.d; }
    function choisirCas(i) { iCas = i; prendre(CAS[volet][i]); arm(); }
    function choisirVolet(v) { volet = v; choisirCas(0); }

    // La saisie, bornée pour que la figure reste lisible : dénominateurs
    // jusqu'à 6, barre et pièce d'au plus 3 unités.
    function lire() {
      function lit(inp, lo, hi, cur) { var v = parseInt(inp.value, 10); return isNaN(v) ? cur : Math.max(lo, Math.min(hi, v)); }
      if (inv()) { b = lit(inB, 1, 5, b); d = lit(inD, 1, 5, d); }
      else {
        c = lit(inC, 1, 6, c); d = lit(inD, 1, 6, d);
        a = lit(inA, 1, 3 * c, a); b = lit(inB, 1, 3 * d, b);
      }
      iCas = -1;
      CAS[volet].forEach(function (cs, i) { if ((inv() || (cs.a === a && cs.c === c)) && cs.b === b && cs.d === d) iCas = i; });
      arm();
    }
    inA.onchange = inC.onchange = inB.onchange = inD.onchange = lire;
    function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
    randBtn.onclick = function () {
      if (inv()) { do { b = randInt(1, 5); d = randInt(1, 5); } while (b === d); }
      else {
        do { c = randInt(1, 6); d = randInt(2, 6); a = randInt(1, 3 * c); b = randInt(1, Math.min(2 * d, 9)); }
        while (a % c === 0 && b % d === 0);
      }
      iCas = -1;
      arm();
    };

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { arm(); } }
    ]);
    mv.extras.appendChild(panel);
    arm();
  }
});
