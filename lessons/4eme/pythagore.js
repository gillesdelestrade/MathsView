/*
 * Théorème de Pythagore — carrés construits sur les trois côtés.
 * Modèle : chaque cours appelle MathsView.register({...}).
 */
MathsView.register({
  id: 'pythagore',
  title: 'Théorème de Pythagore',
  level: '4eme',
  category: 'geometrie',
  exercices: ['pythagore'],
  theme: 'Géométrie — triangle rectangle',
  description:
    'Dans un triangle rectangle, l\'aire du grand carré (sur l\'hypoténuse) est ' +
    'égale à la somme des aires des deux petits carrés : \\( a^2 + b^2 = c^2 \\). ' +
    '<br><strong>Déplace les points A et B</strong> et observe que l\'égalité reste toujours vraie.' +
    '<br><strong>« ✂ Découper et transvaser »</strong> coupe les deux petits carrés en ' +
    'une multitude de carrés minuscules et les verse dans le grand : ils le remplissent ' +
    'jusqu\'au bord. C\'est la même surface, morceau par morceau.',
  notes:
    '<ul>' +
    '<li>Le carré bleu et le carré vert (sur les côtés de l\'angle droit) valent ensemble le carré orange.</li>' +
    '<li>L\'angle droit est en C : il ne change jamais.</li>' +
    '<li>Le pas de découpe (0,5 · 0,25 · 0,1 · 0,05) change la taille des petits carrés. ' +
    'Avec le triangle de départ (3 ; 4 ; 5) et un pas de 0,05, cela fait ' +
    '3 600 + 6 400 = 10 000 carrés, et le grand carré en contient exactement 100 × 100.</li>' +
    '<li>Le bleu se dépose en partant de l\'hypoténuse, le vert en partant du bord opposé : ' +
    'les deux flots se rejoignent pile au milieu quand la dernière pièce est posée.</li>' +
    '<li>Si tu déplaces A ou B, les longueurs ne tombent plus rond : il peut alors rester ' +
    'une petite encoche en haut, parce qu\'un nombre entier de carrés ne pave pas ' +
    'toujours exactement le grand carré. Prends un pas plus fin et elle disparaît.</li>' +
    '</ul>',
  board: { boundingbox: [-7, 8, 9, -7], keepaspectratio: true },

  setup: function (board, mv) {
    var BLUE = '#2563eb', GREEN = '#0d9488', ORANGE = '#f59e0b';

    // Sommet de l'angle droit (fixe) et deux points mobiles sur les axes.
    var C = board.create('point', [0, 0], { name: 'C', fixed: true, size: 3, color: '#334155' });
    var A = board.create('glider', [4, 0, board.create('line', [[0, 0], [1, 0]], { visible: false })],
      { name: 'A', size: 4, color: '#2563eb' });
    var B = board.create('glider', [0, 3, board.create('line', [[0, 0], [0, 1]], { visible: false })],
      { name: 'B', size: 4, color: '#0d9488' });

    // Empêche A et B de passer du mauvais côté.
    A.on('drag', function () { if (A.X() < 0.5) A.moveTo([0.5, 0]); });
    B.on('drag', function () { if (B.Y() < 0.5) B.moveTo([0, 0.5]); });

    var a = function () { return A.X(); };
    var b = function () { return B.Y(); };

    // Le triangle rectangle.
    board.create('polygon', [C, A, B], {
      fillColor: '#e2e8f0', fillOpacity: 0.6, borders: { strokeColor: '#334155', strokeWidth: 2 }
    });
    board.create('angle', [A, C, B], { radius: 0.6, type: 'square', fillColor: '#f59e0b' });

    // Carré sur CA (côté bleu) — vers le bas.
    var p1 = board.create('point', [function () { return a(); }, function () { return -a(); }], { visible: false });
    var p2 = board.create('point', [0, function () { return -a(); }], { visible: false });
    var sqA = board.create('polygon', [C, A, p1, p2], { fillColor: BLUE, fillOpacity: 0.25, vertices: { visible: false }, borders: { strokeColor: BLUE } });

    // Carré sur CB (côté vert) — vers la gauche.
    var q1 = board.create('point', [function () { return -b(); }, function () { return b(); }], { visible: false });
    var q2 = board.create('point', [function () { return -b(); }, 0], { visible: false });
    var sqB = board.create('polygon', [C, B, q1, q2], { fillColor: GREEN, fillOpacity: 0.25, vertices: { visible: false }, borders: { strokeColor: GREEN } });

    // Carré sur l'hypoténuse AB (côté orange) — vers l'extérieur.
    var r1 = board.create('point', [function () { return b(); }, function () { return b() + a(); }], { visible: false });
    var r2 = board.create('point', [function () { return a() + b(); }, function () { return a(); }], { visible: false });
    var sqC = board.create('polygon', [A, B, r1, r2], { fillColor: ORANGE, fillOpacity: 0.3, vertices: { visible: false }, borders: { strokeColor: ORANGE } });

    // Affichage vivant de l'égalité.
    board.create('text', [-6.5, 7, function () {
      var av = a(), bv = b();
      var c2 = av * av + bv * bv;
      return 'a² + b² = ' + (av * av).toFixed(1) + ' + ' + (bv * bv).toFixed(1) +
        ' = ' + c2.toFixed(1) + ' = c²';
    }], { fontSize: 16, color: '#1e293b', cssStyle: 'font-weight:600' });

    /* ------------------------------------------------------------------ *
     * Découpage en petits carrés et transvasement                        *
     *                                                                    *
     * On découpe les deux carrés des côtés de l'angle droit en mailles   *
     * carrées, puis on les fait voler une à une dans le carré de         *
     * l'hypoténuse : elles le remplissent EXACTEMENT, sans trou ni       *
     * débordement. C'est a² + b² = c² rendu tangible.                    *
     *                                                                    *
     * Coût d'affichage. Une maille de 0,05 sur un triangle 3-4-5, cela   *
     * fait 3600 + 6400 = 10 000 petits carrés : impossible d'en faire    *
     * 10 000 éléments JSXGraph. On s'en sort en n'en dessinant JAMAIS    *
     * plus de ~200 à la fois :                                           *
     *   - les mailles pas encore parties forment toujours un « ruban »   *
     *     d'indices consécutifs, donc au plus 3 quadrilatères (le reste  *
     *     d'une rangée, le bloc des rangées pleines, le début de la      *
     *     dernière) — même chose pour les mailles déjà arrivées ;        *
     *   - seules les mailles EN VOL sont dessinées une par une.          *
     * Tout est calculé à partir de l'indice de la maille : aucun tableau *
     * de 10 000 objets n'est jamais construit.                           *
     *                                                                    *
     * Découpage exact. Le nombre de mailles par côté est arrondi         *
     * (m = round(a/pas)) : les mailles pavent donc les carrés bleu et    *
     * vert EXACTEMENT, quelle que soit la position de A et B. Côté       *
     * hypoténuse les N mailles se rangent dans une grille K × R de cases *
     * c/K sur c/R, K étant choisi près de √N (cases presque carrées).    *
     * Pour un triplet pythagoricien — 3-4-5 au pas de 0,05 : 60² + 80² = *
     * 100² — le compte tombe juste et le remplissage est PARFAIT. Sinon  *
     * le carré ne se laisse pas paver par N cases entières et il reste   *
     * une encoche en haut à droite, de K·R − N cases, soit typiquement   *
     * moins de 2 %. On préfère cette encoche à un débordement : rien ne  *
     * doit jamais sortir du carré de l'hypoténuse.                       *
     * ------------------------------------------------------------------ */

    var STEPS = [0.5, 0.25, 0.1, 0.05];   // pas de découpe proposés
    var step = 0.25;                      // pas courant

    // État du découpage. Tout est recalculé par plan() au lancement, puis
    // seul `L` bouge : c'est le nombre de mailles déjà lancées (il court de
    // 0 à N + VOL, une maille mettant VOL « rangs » à traverser).
    var cut = {
      on: false, L: 0,
      av: 0, bv: 0, cv: 0,
      m: 0, n: 0, sa: 0, sb: 0,           // découpe des carrés bleu et vert
      Nb: 0, Ng: 0, N: 0,
      K: 0, R: 0, wd: 0, hd: 0,           // grille d'accueil (carré orange)
      ax: 0, ay: 0, ux: 0, uy: 0, vx: 0, vy: 0
    };

    function plan() {
      var av = a(), bv = b(), cv = Math.sqrt(av * av + bv * bv);
      cut.av = av; cut.bv = bv; cut.cv = cv;
      cut.m = Math.max(1, Math.round(av / step));
      cut.n = Math.max(1, Math.round(bv / step));
      cut.sa = av / cut.m; cut.sb = bv / cut.n;
      cut.Nb = cut.m * cut.m; cut.Ng = cut.n * cut.n;
      cut.N = cut.Nb + cut.Ng;
      // K colonnes sur R rangées pour ranger les N mailles dans le carré de
      // l'hypoténuse, une case mesurant c/K sur c/R. On prend K autour de √N
      // (cases presque carrées) en choisissant celui qui laisse le moins de
      // cases vides : K·R − N, c'est l'encoche qui restera en haut.
      // Le remplissage prime — c'est ce que la leçon démontre — et la forme
      // des cases ne départage qu'à égalité de cases vides.
      var k0 = Math.max(1, Math.round(Math.sqrt(cut.N))), best = null, k, r, ratio, waste, sq;
      for (k = Math.max(1, Math.floor(k0 * 0.7)); k <= Math.ceil(k0 * 1.43); k++) {
        r = Math.ceil(cut.N / k);
        ratio = r / k;
        if (ratio < 0.7 || ratio > 1.43) continue;      // cases trop allongées
        waste = k * r - cut.N;
        sq = Math.abs(ratio - 1);
        if (!best || waste < best.w || (waste === best.w && sq < best.s)) {
          best = { k: k, r: r, w: waste, s: sq };
        }
      }
      cut.K = best ? best.k : k0;
      cut.R = best ? best.r : Math.ceil(cut.N / k0);
      cut.wd = cv / cut.K; cut.hd = cv / cut.R;
      // Repère du carré de l'hypoténuse : origine A, u vers B, v vers
      // l'extérieur (perpendiculaire à AB). Une case (s ; t) est en
      // A + s·u + t·v, donc t = 0 est le bord AB : le carré se remplit en
      // s'éloignant du triangle.
      cut.ax = av; cut.ay = 0;
      cut.ux = -av / cv; cut.uy = bv / cv;
      cut.vx = bv / cv;  cut.vy = av / cv;
      cut.L = 0;
    }

    // Durée du vol d'une maille, exprimée en « nombre de mailles lancées » :
    // c'est donc aussi le nombre de mailles en l'air à un instant donné.
    function vol() { return Math.max(18, Math.min(200, cut.N * 0.05)); }

    function departed() { return Math.max(0, Math.min(cut.N, Math.floor(cut.L))); }
    function arrived() { return Math.max(0, Math.min(cut.N, Math.floor(cut.L - vol()))); }

    function PX(s, t) { return cut.ax + s * cut.ux + t * cut.vx; }
    function PY(s, t) { return cut.ay + s * cut.uy + t * cut.vy; }

    // Ajoute un quadrilatère fermé (4 sommets à plat) suivi d'un NaN : un
    // seul `curve` peut ainsi porter autant de morceaux qu'on veut.
    function quad(X, Y, pts) {
      for (var i = 0; i < 8; i += 2) { X.push(pts[i]); Y.push(pts[i + 1]); }
      X.push(pts[0], NaN); Y.push(pts[1], NaN);
    }
    function seg(X, Y, x1, y1, x2, y2) { X.push(x1, x2, NaN); Y.push(y1, y2, NaN); }

    // Les mailles d'indices [lo ; hi) d'une grille rangée par bandes de
    // `per` cases : au plus 3 quadrilatères, quel que soit leur nombre.
    // `f(bande0, bande1, case0, case1)` dessine le bloc correspondant.
    function ribbon(lo, hi, per, f) {
      if (hi <= lo) return;
      var b0 = Math.floor(lo / per), o0 = lo - b0 * per;
      var b1 = Math.floor((hi - 1) / per), o1 = hi - b1 * per;
      if (b0 === b1) { f(b0, b0 + 1, o0, o1); return; }
      var full0 = b0, full1 = b1 + 1;
      if (o0 > 0) { f(b0, b0 + 1, o0, per); full0 = b0 + 1; }
      if (o1 < per) { f(b1, b1 + 1, 0, o1); full1 = b1; }
      if (full1 > full0) f(full0, full1, 0, per);
    }

    /* Carré bleu : bandes = rangées, la 0 est celle du HAUT (les mailles
       partent par le haut, au plus près du carré de l'hypoténuse). */
    function blueQuad(X, Y) {
      return function (r0, r1, c0, c1) {
        var s = cut.sa;
        quad(X, Y, [c0 * s, -r0 * s, c1 * s, -r0 * s, c1 * s, -r1 * s, c0 * s, -r1 * s]);
      };
    }
    function blueCell(k) {                      // centre + demi-côté
      var r = Math.floor(k / cut.m), c = k % cut.m, s = cut.sa;
      return [(c + 0.5) * s, -(r + 0.5) * s, s / 2];
    }

    /* Carré vert : bandes = colonnes, la 0 est celle de DROITE. */
    function greenQuad(X, Y) {
      return function (q0, q1, r0, r1) {
        var s = cut.sb, bv = cut.bv;
        quad(X, Y, [-q0 * s, bv - r0 * s, -q1 * s, bv - r0 * s,
                    -q1 * s, bv - r1 * s, -q0 * s, bv - r1 * s]);
      };
    }
    function greenCell(j) {
      var q = Math.floor(j / cut.n), r = j % cut.n, s = cut.sb;
      return [-(q + 0.5) * s, cut.bv - (r + 0.5) * s, s / 2];
    }

    /* Carré de l'hypoténuse : bandes = rangées parallèles à AB. */
    function dstQuad(X, Y) {
      return function (r0, r1, c0, c1) {
        var t0 = r0 * cut.hd, t1 = r1 * cut.hd, s0 = c0 * cut.wd, s1 = c1 * cut.wd;
        quad(X, Y, [PX(s0, t0), PY(s0, t0), PX(s1, t0), PY(s1, t0),
                    PX(s1, t1), PY(s1, t1), PX(s0, t1), PY(s0, t1)]);
      };
    }
    // Case d'accueil de la maille k : le bleu remplit depuis le bord AB, le
    // vert depuis le haut ; les deux flots se rejoignent au milieu.
    function slotOf(k) { return k < cut.Nb ? k : cut.N - 1 - (k - cut.Nb); }
    function dstCenter(k) {
      var sl = slotOf(k), r = Math.floor(sl / cut.K), c = sl % cut.K;
      return [PX((c + 0.5) * cut.wd, (r + 0.5) * cut.hd),
              PY((c + 0.5) * cut.wd, (r + 0.5) * cut.hd)];
    }

    /* Les six courbes : ce qui reste, ce qui vole, ce qui est arrivé. ---- */
    function area(color) {
      return { strokeColor: color, strokeWidth: 1, fillColor: color, fillOpacity: 0.45,
               fixed: true, highlight: false, layer: 6, visible: true };
    }
    function makeCurve(color, fn) {
      var cv = board.create('curve', [[], []], area(color));
      cv.updateDataArray = function () {
        this.dataX = []; this.dataY = [];
        if (cut.on) fn(this.dataX, this.dataY);
      };
      return cv;
    }

    // Ce qui n'est pas encore parti.
    makeCurve(BLUE, function (X, Y) {
      ribbon(Math.min(departed(), cut.Nb), cut.Nb, cut.m, blueQuad(X, Y));
    });
    makeCurve(GREEN, function (X, Y) {
      ribbon(Math.max(0, departed() - cut.Nb), cut.Ng, cut.n, greenQuad(X, Y));
    });
    // Ce qui est arrivé dans le carré de l'hypoténuse.
    makeCurve(BLUE, function (X, Y) {
      ribbon(0, Math.min(arrived(), cut.Nb), cut.K, dstQuad(X, Y));
    });
    makeCurve(GREEN, function (X, Y) {
      var ag = Math.max(0, arrived() - cut.Nb);
      ribbon(cut.N - ag, cut.N, cut.K, dstQuad(X, Y));
    });

    // Ce qui vole : seules ces mailles-là sont dessinées une par une.
    function flying(X, Y, kLo, kHi, cellOf, offset) {
      var V = vol();
      for (var k = kLo; k < kHi; k++) {
        var p = (cut.L - k) / V;
        if (p < 0) p = 0; else if (p > 1) p = 1;
        var e = p * p * (3 - 2 * p);                  // départ et arrivée en douceur
        var src = cellOf(k - offset), dst = dstCenter(k);
        var cx = src[0] + (dst[0] - src[0]) * e;
        var cy = src[1] + (dst[1] - src[1]) * e;
        var h = src[2];
        quad(X, Y, [cx - h, cy - h, cx + h, cy - h, cx + h, cy + h, cx - h, cy + h]);
      }
    }
    makeCurve(BLUE, function (X, Y) {
      flying(X, Y, Math.min(arrived(), cut.Nb), Math.min(departed(), cut.Nb), blueCell, 0);
    });
    makeCurve(GREEN, function (X, Y) {
      flying(X, Y, Math.max(arrived(), cut.Nb), Math.max(departed(), cut.Nb), greenCell, cut.Nb);
    });

    /* Le quadrillage de la découpe. Il ne couvre que les rangées encore
       pleines (côté départ) ou déjà pleines (côté arrivée) : le trait ne
       traîne jamais sur du vide. Au-delà de ~500 mailles de côté les traits
       se toucheraient, on les abandonne. */
    var grid = board.create('curve', [[], []], {
      strokeColor: '#475569', strokeWidth: 0.6, strokeOpacity: 0,
      fillColor: 'none', fixed: true, highlight: false, layer: 7
    });
    grid.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (!cut.on || cut.m + cut.n > 500) return;
      var X = this.dataX, Y = this.dataY, i, d = departed(), arr = arrived();

      var rg = Math.ceil(Math.min(d, cut.Nb) / cut.m);        // rangées bleues parties
      if (rg < cut.m) {
        for (i = 0; i <= cut.m; i++) seg(X, Y, i * cut.sa, -cut.av, i * cut.sa, -rg * cut.sa);
        for (i = rg; i <= cut.m; i++) seg(X, Y, 0, -i * cut.sa, cut.av, -i * cut.sa);
      }
      var cg = Math.ceil(Math.max(0, d - cut.Nb) / cut.n);    // colonnes vertes parties
      if (cg < cut.n) {
        for (i = cg; i <= cut.n; i++) seg(X, Y, -i * cut.sb, 0, -i * cut.sb, cut.bv);
        for (i = 0; i <= cut.n; i++) seg(X, Y, -cut.bv, i * cut.sb, -cg * cut.sb, i * cut.sb);
      }
      // Côté arrivée : rangées complètes du flot bleu puis du flot vert.
      var top = Math.floor((cut.N - 1) / cut.K) + 1;
      dstGrid(X, Y, 0, Math.floor(Math.min(arr, cut.Nb) / cut.K));
      dstGrid(X, Y, Math.ceil((cut.N - Math.max(0, arr - cut.Nb)) / cut.K), top);
    };
    function dstGrid(X, Y, r0, r1) {
      if (r1 <= r0) return;
      var t0 = r0 * cut.hd, t1 = r1 * cut.hd, i;
      for (i = 0; i <= cut.K; i++) {
        seg(X, Y, PX(i * cut.wd, t0), PY(i * cut.wd, t0), PX(i * cut.wd, t1), PY(i * cut.wd, t1));
      }
      for (i = r0; i <= r1; i++) {
        seg(X, Y, PX(0, i * cut.hd), PY(0, i * cut.hd), PX(cut.cv, i * cut.hd), PY(cut.cv, i * cut.hd));
      }
    }

    // Le compte des mailles, en clair.
    function nb(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
    board.create('text', [-6.5, 6.1, function () {
      if (!cut.on) return '';
      return nb(cut.Nb) + ' + ' + nb(cut.Ng) + ' = ' + nb(cut.N) +
             ' carrés de ' + String(step).replace('.', ',');
    }], { fontSize: 14, color: '#475569' });

    /* Pilotage ---------------------------------------------------------- */
    // Pendant le transvasement A et B sont bloqués : la découpe a été
    // calculée pour CE triangle-là.
    function lock(on) {
      A.setAttribute({ fixed: on });
      B.setAttribute({ fixed: on });
      sqA.setAttribute({ fillOpacity: on ? 0 : 0.25 });
      sqB.setAttribute({ fillOpacity: on ? 0 : 0.25 });
      sqC.setAttribute({ fillOpacity: on ? 0 : 0.3 });
    }

    var anim = mv.createAnimator();

    function rewind() {                    // remet la figure entière à zéro
      cut.on = false; cut.L = 0;
      grid.setAttribute({ strokeOpacity: 0 });
      lock(false);
      board.update();
    }

    function play() {
      rewind();
      plan();
      anim.runSteps([
        // 1. la découpe apparaît
        { dur: 900, step: function (p) {
            if (!cut.on) { cut.on = true; lock(true); }   // aussi au rejeu (« Précédent »)
            grid.setAttribute({ strokeOpacity: 0.35 * p });
          } },
        // 2. les mailles passent dans le carré de l'hypoténuse
        { dur: 5200, step: function (p) { cut.L = p * (cut.N + vol()); } }
      ], rewind);
    }

    var refs = mv.addControls([
      { type: 'button', id: 'play', label: '✂ Découper et transvaser', onClick: play },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: rewind },
      { type: 'button', id: 's0', label: '0,5', onClick: function () { pick(0, true); } },
      { type: 'button', id: 's1', label: '0,25', onClick: function () { pick(1, true); } },
      { type: 'button', id: 's2', label: '0,1', onClick: function () { pick(2, true); } },
      { type: 'button', id: 's3', label: '0,05', onClick: function () { pick(3, true); } }
    ]);
    function pick(i, andPlay) {
      step = STEPS[i];
      STEPS.forEach(function (_, j) { refs['s' + j].className = j === i ? 'active' : ''; });
      if (andPlay) play(); else rewind();
    }
    pick(1, false);   // pas de 0,25 au départ, figure au repos
  }
});
