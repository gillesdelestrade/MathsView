/*
 * Triangle inscrit dans un demi-cercle (2nde) — le cercle et l'angle droit.
 *
 * [AB] est un diamètre du cercle de centre O. Quel que soit le point M du
 * cercle (A et B exceptés), le triangle AMB est rectangle en M. La figure le
 * montre d'abord (M glisse sur le cercle, l'équerre reste posée en M, et un
 * tour complet laisse la trace de tous les triangles), puis le DÉMONTRE :
 *
 *   OA = OB = OM = R (trois rayons)
 *   → OAM est isocèle en O : ses angles en A et en M sont égaux (α)
 *   → OBM est isocèle en O : ses angles en B et en M sont égaux (β)
 *   → dans AMB, α + β + (α + β) = 180°, donc α + β = 90° : AMB est droit.
 *
 * Et la réciproque, par l'expérience : M libre dans le plan, l'angle AMB se
 * mesure en direct — obtus dedans, aigu dehors, droit pile sur le cercle.
 * Donc le cercle circonscrit d'un triangle rectangle a l'hypoténuse pour
 * diamètre : son centre est le milieu de l'hypoténuse.
 *
 * Toutes les marques d'angle sont des courbes recalculées (updateDataArray) :
 * l'orientation du triangle change quand A ou M bougent, et une marque
 * d'angle JSXGraph ne suit pas toujours l'angle intérieur.
 */
MathsView.register({
  id: 'cercle-triangle-rectangle',
  title: 'Triangle inscrit dans un demi-cercle',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Figures planes',
  exercices: ['cercle-demi'],
  theme: 'Cercle — un côté est un diamètre, le triangle est rectangle',
  description:
    '[AB] est un <strong>diamètre</strong> du cercle. Prends n\'importe quel point M du cercle : ' +
    'le triangle AMB est <strong>rectangle en M</strong>. ' +
    '<br><strong>Déplace M</strong> le long du cercle (et A, pour tourner le diamètre) : ' +
    'l\'équerre reste posée en M. <strong>« M fait le tour »</strong> le montre pour tous les ' +
    'points d\'un coup, et <strong>« Pourquoi ? »</strong> le démontre avec trois rayons et ' +
    'deux triangles isocèles. ' +
    '<br>Avec <strong>« M libre »</strong>, M quitte le cercle : l\'angle n\'est plus droit — ' +
    'il ne l\'est que <em>sur</em> le cercle. C\'est la réciproque.',
  notes:
    '<ul>' +
    '<li><strong>Théorème.</strong> Si M est un point du cercle de diamètre [AB] (autre que A et B), ' +
    'alors le triangle AMB est rectangle en M.</li>' +
    '<li><strong>Pourquoi ?</strong> O est le centre : \\( OA = OB = OM \\) (des rayons). ' +
    'Donc OAM et OBM sont isocèles en O, et leurs angles à la base sont égaux deux à deux. ' +
    'Dans AMB, la somme des angles vaut \\( \\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ \\), ' +
    'd\'où \\( \\alpha + \\beta = 90^\\circ \\) : c\'est l\'angle en M.</li>' +
    '<li><strong>Réciproque.</strong> Si AMB est rectangle en M, alors M est sur le cercle de ' +
    'diamètre [AB]. Autrement dit : le cercle circonscrit à un triangle rectangle a pour centre ' +
    'le <strong>milieu de l\'hypoténuse</strong>, et \\( OM = \\tfrac{AB}{2} \\).</li>' +
    '<li>Hors du cercle, l\'angle AMB est <strong>aigu</strong> ; à l\'intérieur, il est ' +
    '<strong>obtus</strong>. Le cercle est exactement la frontière des 90°.</li>' +
    '<li>À quoi ça sert ? À <em>prouver</em> qu\'un angle est droit sans équerre ni mesure, et à ' +
    'placer un point sur un cercle sans compas : il suffit d\'un diamètre.</li>' +
    '</ul>',
  board: { boundingbox: [-7.2, 6, 7.2, -4.7], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Triangle inscrit dans un demi-cercle',
    figures: [{
      legende: '[AB] diamètre, M sur le cercle : AMB est rectangle en M.',
      boundingbox: [-4.8, 4.6, 4.8, -3.6],
      largeur: 50, hauteur: 42,
      dessine: function (board) {
        var R = 3.2, t = 2.0;
        var A = [-R, 0], B = [R, 0], O = [0, 0], M = [R * Math.cos(t), R * Math.sin(t)];
        board.create('circle', [O, R], { strokeColor: '#334155', strokeWidth: 1.2, fixed: true, highlight: false });
        board.create('polygon', [A, M, B], {
          fillColor: '#dbeafe', fillOpacity: .6, borders: { strokeColor: '#1d4ed8', strokeWidth: 1.6 },
          vertices: { visible: false }, highlight: false, fixed: true
        });
        board.create('segment', [A, B], { strokeColor: '#b45309', strokeWidth: 2.2, fixed: true, highlight: false });
        // L'équerre en M : un petit carré le long de [MA] et [MB].
        var s = 0.45, ua = [(A[0] - M[0]), (A[1] - M[1])], ub = [(B[0] - M[0]), (B[1] - M[1])];
        var la = Math.hypot(ua[0], ua[1]), lb = Math.hypot(ub[0], ub[1]);
        ua = [ua[0] / la * s, ua[1] / la * s]; ub = [ub[0] / lb * s, ub[1] / lb * s];
        board.create('curve', [[M[0] + ua[0], M[0] + ua[0] + ub[0], M[0] + ub[0]],
                               [M[1] + ua[1], M[1] + ua[1] + ub[1], M[1] + ub[1]]],
          { strokeColor: '#dc2626', strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('point', O, { name: '', size: 1.5, color: '#334155', fixed: true, highlight: false });
        function nom(x, y, s, col) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(-R - 0.45, -0.1, 'A'); nom(R + 0.45, -0.1, 'B'); nom(0, -0.5, 'O');
        nom(M[0] - 0.35, M[1] + 0.5, 'M', '#1d4ed8');
        nom(0, -1.5, 'diamètre', '#b45309');
      }
    }, {
      legende: 'Trois rayons égaux, deux triangles isocèles : α + β = 90°.',
      boundingbox: [-4.8, 4.6, 4.8, -3.6],
      largeur: 50, hauteur: 42,
      dessine: function (board) {
        var R = 3.2, t = 2.0;
        var A = [-R, 0], B = [R, 0], O = [0, 0], M = [R * Math.cos(t), R * Math.sin(t)];
        board.create('circle', [O, R], { strokeColor: '#94a3b8', strokeWidth: 1, dash: 2, fixed: true, highlight: false });
        board.create('polygon', [A, M, B], {
          fillColor: '#ffffff', fillOpacity: 0, borders: { strokeColor: '#334155', strokeWidth: 1.4 },
          vertices: { visible: false }, highlight: false, fixed: true
        });
        board.create('segment', [O, M], { strokeColor: '#334155', strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('point', O, { name: '', size: 1.5, color: '#334155', fixed: true, highlight: false });
        // Marques d'angle : α en A et en M (violet), β en B et en M (vert).
        function arc(V, P, Q, r, col) {
          var a1 = Math.atan2(P[1] - V[1], P[0] - V[0]), a2 = Math.atan2(Q[1] - V[1], Q[0] - V[0]);
          var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          var X = [], Y = [], n = 16, i;
          for (i = 0; i <= n; i++) { X.push(V[0] + r * Math.cos(a1 + d * i / n)); Y.push(V[1] + r * Math.sin(a1 + d * i / n)); }
          board.create('curve', [X, Y], { strokeColor: col, strokeWidth: 1.6, fixed: true, highlight: false });
        }
        arc(A, B, M, 0.9, '#7c3aed'); arc(M, A, O, 0.9, '#7c3aed');
        arc(B, M, A, 0.9, '#0d9488'); arc(M, O, B, 0.9, '#0d9488');
        function nom(x, y, s, col) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(-R - 0.45, -0.1, 'A'); nom(R + 0.45, -0.1, 'B'); nom(0, -0.5, 'O');
        nom(M[0] - 0.35, M[1] + 0.5, 'M');
        nom(-R + 1.35, 0.45, 'α', '#7c3aed'); nom(M[0] - 0.75, M[1] - 0.9, 'α', '#7c3aed');
        nom(R - 1.3, 0.55, 'β', '#0d9488'); nom(M[0] + 0.35, M[1] - 1.05, 'β', '#0d9488');
        nom(0, -2.6, 'OA = OB = OM = R', '#334155');
      }
    }],
    points: [
      '<b>Théorème :</b> si M est sur le cercle de <b>diamètre</b> [AB] (M ≠ A, B), alors AMB est <b>rectangle en M</b>.',
      '<b>Preuve :</b> OA = OB = OM (rayons), donc OAM et OBM sont <b>isocèles</b> en O.',
      'Dans AMB : \\( \\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ \\), donc \\( \\alpha + \\beta = 90^\\circ \\).',
      '<b>Réciproque :</b> si AMB est rectangle en M, alors M est sur le cercle de diamètre [AB].',
      'Le centre du cercle circonscrit à un triangle rectangle est le <b>milieu de l\'hypoténuse</b>.',
      'Dedans, l\'angle est <b>obtus</b> ; dehors, il est <b>aigu</b> ; sur le cercle, il est <b>droit</b>.'
    ],
    exemples: [
      'AB = 10 et M sur le cercle de diamètre [AB] : AMB est rectangle en M, et \\( OM = 5 \\).',
      'ABC rectangle en C avec AB = 8 : C est sur le cercle de centre le milieu de [AB], de rayon 4.',
      'M sur le cercle, \\( \\widehat{MAB} = 35^\\circ \\) : alors \\( \\widehat{MBA} = 90 - 35 = 55^\\circ \\).'
    ]
  },

  setup: function (board, mv) {
    var INK = '#334155', C_DIAM = '#b45309', C_TRI = '#1d4ed8', C_RIGHT = '#dc2626';
    var C_A = '#7c3aed', C_B = '#0d9488', C_RAY = '#f59e0b', C_TRACE = '#94a3b8';
    var R = 4;
    var EPS = 1e-6;

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var libre = false;          // M libre dans le plan (réciproque) ?
    var tourP = -1;             // avancement du tour de M (−1 : pas de tour en cours)
    var tourDepart = 0;         // angle de M au début du tour
    var phase = 0;              // étape de la démonstration déjà révélée (0..4)
    var alphaMark = 0, betaMark = 0, sumMark = 0;   // opacités des marques (0..1)
    var rayonsP = 0;            // opacité des rayons

    /* ==================================================================== */
    /* Les points                                                            */
    /* ==================================================================== */
    var O = board.create('point', [0, 0],
      { name: 'O', size: 2, color: INK, fixed: true, highlight: false, label: { offset: [6, -12] } });
    var cercle = board.create('circle', [O, R],
      { strokeColor: INK, strokeWidth: 1.6, fixed: true, highlight: false, fillColor: 'none' });

    // A glisse sur le cercle, B est son symétrique par rapport à O.
    var A = board.create('glider', [-R, 0, cercle],
      { name: 'A', size: 3, color: C_DIAM, highlight: false, label: { offset: [-16, -6] } });
    var B = board.create('point', [function () { return -A.X(); }, function () { return -A.Y(); }],
      { name: 'B', size: 3, color: C_DIAM, fixed: true, highlight: false, label: { offset: [8, -6] } });

    // Deux incarnations de M : sur le cercle (glider) ou libre. L'autre est cachée.
    var Mc = board.create('glider', [R * Math.cos(2.0), R * Math.sin(2.0), cercle],
      { name: 'M', size: 3, color: C_TRI, highlight: false, label: { offset: [-6, 10] } });
    var Ml = board.create('point', [R * Math.cos(2.0) * 0.7, R * Math.sin(2.0) * 0.7],
      { name: 'M', size: 3, color: C_TRI, highlight: false, visible: false, label: { offset: [-6, 10] } });
    function M() { return libre ? Ml : Mc; }
    function MX() { return M().X(); }
    function MY() { return M().Y(); }

    // Pendant « M fait le tour », M est posé à un angle absolu : state-based.
    function poseM(p) {
      var t = tourDepart + p * 2 * Math.PI;
      Mc.setPosition(JXG.COORDS_BY_USER, [R * Math.cos(t), R * Math.sin(t)]);
    }
    function angleDe(P) { return Math.atan2(P.Y(), P.X()); }

    /* ==================================================================== */
    /* Géométrie du triangle                                                 */
    /* ==================================================================== */
    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }
    function degenere() { return dist(M(), A) < 0.05 || dist(M(), B) < 0.05; }
    // Mesure de l'angle AMB, en degrés.
    function angleAMB() {
      var m = M();
      var ax = A.X() - m.X(), ay = A.Y() - m.Y(), bx = B.X() - m.X(), by = B.Y() - m.Y();
      var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      if (la < EPS || lb < EPS) return NaN;
      var c = (ax * bx + ay * by) / (la * lb);
      return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
    }
    // Où est M par rapport au cercle ? 'sur', 'dedans', 'dehors'.
    function position() {
      if (!libre) return 'sur';
      var d = Math.hypot(MX(), MY());
      if (Math.abs(d - R) < 0.08) return 'sur';
      return d < R ? 'dedans' : 'dehors';
    }

    // JSXGraph veut des points, pas une fonction qui en renvoie un : Mv est un
    // point « miroir » qui copie l'incarnation active de M, et tout le reste
    // de la figure s'appuie sur lui.
    var Mv = board.create('point', [MX, MY], { visible: false, name: '', fixed: true });
    var triangle = board.create('polygon', [A, Mv, B], {
      fillColor: C_TRI, fillOpacity: 0.10, highlight: false, fixed: true,
      borders: { strokeColor: C_TRI, strokeWidth: 2.2, highlight: false }, vertices: { visible: false }
    });
    var diametre = board.create('segment', [A, B],
      { strokeColor: C_DIAM, strokeWidth: 3, fixed: true, highlight: false, layer: 8 });

    /* Marques d'angle : des courbes recalculées. ----------------------- */
    // Arc de centre V, de P vers Q (le plus court), rayon r ; k arcs concentriques.
    function arcData(X, Y, V, P, Q, r, k) {
      var a1 = Math.atan2(P.Y() - V.Y(), P.X() - V.X()), a2 = Math.atan2(Q.Y() - V.Y(), Q.X() - V.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      var n = 20, i, j;
      for (j = 0; j < k; j++) {
        var rr = r + j * 0.16;
        for (i = 0; i <= n; i++) { X.push(V.X() + rr * Math.cos(a1 + d * i / n)); Y.push(V.Y() + rr * Math.sin(a1 + d * i / n)); }
        X.push(NaN); Y.push(NaN);
      }
    }
    function marque(col, width) {
      var c = board.create('curve', [[], []],
        { strokeColor: col, strokeWidth: width || 2, strokeOpacity: 0, fillColor: 'none', fixed: true, highlight: false, layer: 9 });
      return c;
    }
    // L'équerre en M (petit carré sur [MA] et [MB]), visible quand l'angle est droit.
    var equerre = board.create('curve', [[], []],
      { strokeColor: C_RIGHT, strokeWidth: 2, fillColor: C_RIGHT, fillOpacity: 0.15, fixed: true, highlight: false, layer: 9 });
    equerre.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      var m = M();
      if (degenere() || Math.abs(angleAMB() - 90) > 0.5) return;
      var s = 0.55;
      var ax = A.X() - m.X(), ay = A.Y() - m.Y(), bx = B.X() - m.X(), by = B.Y() - m.Y();
      var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      ax = ax / la * s; ay = ay / la * s; bx = bx / lb * s; by = by / lb * s;
      this.dataX = [m.X() + ax, m.X() + ax + bx, m.X() + bx];
      this.dataY = [m.Y() + ay, m.Y() + ay + by, m.Y() + by];
    };
    // En mode libre, un arc marque l'angle AMB (qui n'est plus droit).
    var arcLibre = marque(C_RIGHT, 2);
    arcLibre.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (!libre || degenere() || Math.abs(angleAMB() - 90) <= 0.5) return;
      arcData(this.dataX, this.dataY, M(), A, B, 0.7, 1);
    };
    arcLibre.setAttribute({ strokeOpacity: 1 });

    // Les rayons de la démonstration.
    var rayons = [board.create('segment', [O, A], { strokeColor: C_RAY, strokeWidth: 3, strokeOpacity: 0, fixed: true, highlight: false, layer: 8 }),
                  board.create('segment', [O, B], { strokeColor: C_RAY, strokeWidth: 3, strokeOpacity: 0, fixed: true, highlight: false, layer: 8 }),
                  board.create('segment', [O, Mv], { strokeColor: C_RAY, strokeWidth: 3, strokeOpacity: 0, fixed: true, highlight: false, layer: 8 })];
    // Un petit trait sur chaque rayon : « même longueur ».
    var ticks = board.create('curve', [[], []], { strokeColor: C_RAY, strokeWidth: 2, strokeOpacity: 0, fixed: true, highlight: false, layer: 9 });
    ticks.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      var X = this.dataX, Y = this.dataY;
      [A, B, Mv].forEach(function (P) {
        var l = Math.hypot(P.X(), P.Y()); if (l < EPS) return;
        var ux = P.X() / l, uy = P.Y() / l, cx = ux * l / 2, cy = uy * l / 2;
        X.push(cx - uy * 0.18, cx + uy * 0.18, NaN); Y.push(cy + ux * 0.18, cy - ux * 0.18, NaN);
      });
    };

    // α : en A (entre [AB) et [AM)) et en M (entre [MA) et [MO)) — un arc.
    var alphaA = marque(C_A, 2.4), alphaM = marque(C_A, 2.4);
    alphaA.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcData(this.dataX, this.dataY, A, B, Mv, 0.85, 1); };
    alphaM.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcData(this.dataX, this.dataY, Mv, A, O, 0.85, 1); };
    // β : en B et en M — deux arcs.
    var betaB = marque(C_B, 2.4), betaM = marque(C_B, 2.4);
    betaB.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcData(this.dataX, this.dataY, B, Mv, A, 0.75, 2); };
    betaM.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcData(this.dataX, this.dataY, Mv, O, B, 0.75, 2); };
    // Le triangle OAM et OBM colorés (fond léger), pour voir les isocèles.
    var triOAM = board.create('polygon', [O, A, Mv], { fillColor: C_A, fillOpacity: 0, highlight: false, fixed: true, borders: { visible: false }, vertices: { visible: false } });
    var triOBM = board.create('polygon', [O, B, Mv], { fillColor: C_B, fillOpacity: 0, highlight: false, fixed: true, borders: { visible: false }, vertices: { visible: false } });

    /* La trace du tour : les triangles déjà passés, en gris léger. ------- */
    var trace = board.create('curve', [[], []],
      { strokeColor: C_TRACE, strokeWidth: 1, strokeOpacity: 0.7, fillColor: 'none', fixed: true, highlight: false, layer: 3 });
    trace.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (tourP < 0) return;
      var X = this.dataX, Y = this.dataY, N = 36, k;
      for (k = 1; k <= N; k++) {
        if (k / N > tourP + 1e-9) break;
        var t = tourDepart + k / N * 2 * Math.PI;
        var mx = R * Math.cos(t), my = R * Math.sin(t);
        X.push(A.X(), mx, B.X(), NaN); Y.push(A.Y(), my, B.Y(), NaN);
        // la petite équerre de chaque triangle passé
        var ax = A.X() - mx, ay = A.Y() - my, bx = B.X() - mx, by = B.Y() - my;
        var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
        if (la < 0.3 || lb < 0.3) continue;
        var s = 0.3; ax = ax / la * s; ay = ay / la * s; bx = bx / lb * s; by = by / lb * s;
        X.push(mx + ax, mx + ax + bx, mx + bx, NaN); Y.push(my + ay, my + ay + by, my + by, NaN);
      }
    };

    /* Étiquettes vivantes --------------------------------------------- */
    function lbl(fx, fy, fn, col, size) {
      return board.create('text', [fx, fy, fn], {
        anchorX: 'middle', anchorY: 'middle', fontSize: size || 14, color: col,
        cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 10
      });
    }
    function fmtDeg(x) { return String(Math.round(x * 10) / 10).replace('.', ',') + '°'; }
    // Le verdict, en haut à gauche.
    var verdict = lbl(-7.0, 5.5, function () {
      if (degenere()) return 'M est confondu avec A ou B : plus de triangle.';
      var a = angleAMB(), pos = position();
      if (pos === 'sur') return 'AMB = ' + fmtDeg(a) + '  →  rectangle en M';
      if (pos === 'dedans') return 'AMB = ' + fmtDeg(a) + ' > 90°  →  M est à l\'intérieur, angle obtus';
      return 'AMB = ' + fmtDeg(a) + ' < 90°  →  M est à l\'extérieur, angle aigu';
    }, INK, 15);
    verdict.setAttribute({ anchorX: 'left' });
    // Lettres α et β près des marques.
    function midDir(V, P, Q, r) {
      var a1 = Math.atan2(P.Y() - V.Y(), P.X() - V.X()), a2 = Math.atan2(Q.Y() - V.Y(), Q.X() - V.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      return [V.X() + r * Math.cos(a1 + d / 2), V.Y() + r * Math.sin(a1 + d / 2)];
    }
    var lblAlphaA = lbl(function () { return midDir(A, B, Mv, 1.3)[0]; }, function () { return midDir(A, B, Mv, 1.3)[1]; }, function () { return 'α'; }, C_A);
    var lblAlphaM = lbl(function () { return midDir(Mv, A, O, 1.3)[0]; }, function () { return midDir(Mv, A, O, 1.3)[1]; }, function () { return 'α'; }, C_A);
    var lblBetaB  = lbl(function () { return midDir(B, Mv, A, 1.3)[0]; }, function () { return midDir(B, Mv, A, 1.3)[1]; }, function () { return 'β'; }, C_B);
    var lblBetaM  = lbl(function () { return midDir(Mv, O, B, 1.3)[0]; }, function () { return midDir(Mv, O, B, 1.3)[1]; }, function () { return 'β'; }, C_B);
    // « R » au milieu de chaque rayon, décalé du côté opposé à M (pour OA et OB :
    // hors du triangle) ; pour OM, du côté de B.
    function posR(P, loin) {
      var l = Math.hypot(P.X(), P.Y()); if (l < EPS) return [0, 0];
      var nx = -P.Y() / l, ny = P.X() / l;                  // normale au rayon
      var s = (nx * loin.X() + ny * loin.Y() > 0) ? -1 : 1; // du côté opposé à `loin`
      return [P.X() / 2 + s * nx * 0.4, P.Y() / 2 + s * ny * 0.4];
    }
    var lblR = [lbl(function () { return posR(A, Mv)[0]; }, function () { return posR(A, Mv)[1]; }, function () { return 'R'; }, C_RAY, 13),
                lbl(function () { return posR(B, Mv)[0]; }, function () { return posR(B, Mv)[1]; }, function () { return 'R'; }, C_RAY, 13),
                lbl(function () { return posR(Mv, B)[0]; }, function () { return posR(Mv, B)[1]; }, function () { return 'R'; }, C_RAY, 13)];
    var lettres = [lblAlphaA, lblAlphaM, lblBetaB, lblBetaM].concat(lblR);

    /* ==================================================================== */
    /* Panneau : la démonstration, ligne à ligne                             */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel cercle-demo';
    mv.extras.appendChild(panel);
    function sp(t, col) { return '<span style="color:' + col + ';font-weight:700">' + t + '</span>'; }
    function ligne(n, html, visible) {
      return '<li class="cercle-ligne" style="' + (visible ? '' : 'display:none') + '" data-n="' + n + '">' + html + '</li>';
    }
    function ecrirePanneau() {
      if (libre) {
        var a = angleAMB(), pos = position();
        panel.innerHTML =
          '<div class="props-label">Réciproque : et si M quitte le cercle ?</div>' +
          '<ul class="props-list">' +
          (degenere() ? ligne(1, 'M est confondu avec A ou B.', true)
            : ligne(1, 'Déplace M. En ce moment ' + sp('AMB ≈ ' + fmtDeg(a), C_RIGHT) + ' : M est ' +
              (pos === 'sur' ? sp('sur le cercle', '#047857') + ', l\'angle est droit.'
               : pos === 'dedans' ? sp('à l\'intérieur', C_RIGHT) + ', l\'angle est obtus.'
               : sp('à l\'extérieur', C_RIGHT) + ', l\'angle est aigu.'), true)) +
          ligne(2, 'L\'angle vaut 90° <b>exactement sur le cercle</b> : si AMB est rectangle en M, alors M est sur le cercle de diamètre [AB].', true) +
          ligne(3, 'Autrement dit, le cercle circonscrit à un triangle rectangle a pour centre le <b>milieu de l\'hypoténuse</b>.', true) +
          '</ul>';
        return;
      }
      panel.innerHTML =
        '<div class="props-label">Pourquoi AMB est-il rectangle en M ?</div>' +
        '<ul class="props-list">' +
        ligne(1, sp('OA = OB = OM = R', C_RAY) + ' : ce sont trois rayons du cercle.', phase >= 1) +
        ligne(2, 'Donc ' + sp('OAM', C_A) + ' est <b>isocèle en O</b> : ses angles en A et en M sont égaux, notons-les ' + sp('α', C_A) + '.', phase >= 2) +
        ligne(3, 'Et ' + sp('OBM', C_B) + ' est <b>isocèle en O</b> : ses angles en B et en M sont égaux, notons-les ' + sp('β', C_B) + '.', phase >= 3) +
        ligne(4, 'Dans le triangle AMB, la somme des angles fait 180° : ' +
          sp('α', C_A) + ' + ' + sp('β', C_B) + ' + (' + sp('α', C_A) + ' + ' + sp('β', C_B) + ') = 180°, ' +
          'donc ' + sp('α + β = 90°', C_RIGHT) + '. Or l\'angle en M est justement ' + sp('α', C_A) + ' + ' + sp('β', C_B) + ' : <b>AMB est rectangle en M</b>.', phase >= 4) +
        (phase === 0 ? ligne(0, 'Clique sur <b>« Pourquoi ? »</b> puis <b>Suivante ▶</b> pour dérouler la démonstration.', true) : '') +
        '</ul>';
    }

    /* ==================================================================== */
    /* Rafraîchissement : les attributs AVANT board.update()                 */
    /* ==================================================================== */
    function refresh() {
      Mc.setAttribute({ visible: !libre });
      Ml.setAttribute({ visible: libre });
      var demo = !libre;
      rayons.forEach(function (s) { s.setAttribute({ strokeOpacity: demo ? rayonsP : 0 }); });
      ticks.setAttribute({ strokeOpacity: demo ? rayonsP : 0 });
      lblR.forEach(function (t) { t.setAttribute({ visible: demo && rayonsP > 0.01, cssStyle: 'font-weight:700;opacity:' + rayonsP }); });
      alphaA.setAttribute({ strokeOpacity: demo ? alphaMark : 0 });
      alphaM.setAttribute({ strokeOpacity: demo ? alphaMark : 0 });
      triOAM.setAttribute({ fillOpacity: demo ? 0.12 * alphaMark : 0 });
      lblAlphaA.setAttribute({ visible: demo && alphaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + alphaMark });
      lblAlphaM.setAttribute({ visible: demo && alphaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + alphaMark });
      betaB.setAttribute({ strokeOpacity: demo ? betaMark : 0 });
      betaM.setAttribute({ strokeOpacity: demo ? betaMark : 0 });
      triOBM.setAttribute({ fillOpacity: demo ? 0.12 * betaMark : 0 });
      lblBetaB.setAttribute({ visible: demo && betaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + betaMark });
      lblBetaM.setAttribute({ visible: demo && betaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + betaMark });
      // Pendant la conclusion, l'équerre et le triangle s'allument.
      equerre.setAttribute({ strokeWidth: 2 + 1.5 * sumMark, fillOpacity: 0.15 + 0.35 * sumMark });
      triangle.setAttribute({ fillOpacity: 0.10 + 0.08 * sumMark });
      // En mode libre, A reste déplaçable ; pendant un tour, A est bloqué.
      A.setAttribute({ fixed: tourP >= 0 && tourP < 1 });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Animations                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function razDemo() {
      phase = 0; alphaMark = 0; betaMark = 0; sumMark = 0; rayonsP = 0;
      redraw();
    }
    function razTour() { tourP = -1; redraw(); }
    function raz() { tourP = -1; razDemo(); }

    // « Pourquoi ? » : la démonstration en quatre étapes, chacune absolue.
    function pourquoi() {
      if (libre) basculeLibre(false);
      tourP = -1;
      razDemo();
      anim.runSteps([
        { dur: 700, step: function (p) { phase = Math.max(phase, 0); rayonsP = p; refresh(); },
          after: function () { phase = 1; refresh(); } },
        { dur: 700, step: function (p) { rayonsP = 1; phase = Math.max(phase, 1); alphaMark = p; refresh(); },
          after: function () { phase = 2; refresh(); } },
        { dur: 700, step: function (p) { rayonsP = 1; alphaMark = 1; phase = Math.max(phase, 2); betaMark = p; refresh(); },
          after: function () { phase = 3; refresh(); } },
        { dur: 900, step: function (p) { rayonsP = 1; alphaMark = 1; betaMark = 1; phase = Math.max(phase, 3); sumMark = p; refresh(); },
          after: function () { phase = 4; refresh(); } }
      ], razDemo);
    }

    // « M fait le tour » : M parcourt le cercle, la trace garde chaque triangle.
    function tour() {
      if (libre) basculeLibre(false);
      razDemo();
      tourDepart = angleDe(Mc);
      tourP = 0;
      redraw();
      anim.runSteps([
        { dur: 6000, step: function (p) { tourP = p; poseM(p); refresh(); },
          after: function () { tourP = 1; refresh(); } }
      ], function () { tourP = -1; poseM(0); redraw(); });
    }

    function basculeLibre(on) {
      libre = !!on;
      if (libre) {
        // M libre part de là où était M sur le cercle, un peu vers l'intérieur.
        Ml.setPosition(JXG.COORDS_BY_USER, [Mc.X() * 0.75, Mc.Y() * 0.75]);
        anim.cancel();
        tourP = -1; phase = 0; alphaMark = 0; betaMark = 0; sumMark = 0; rayonsP = 0;
      }
      if (refs && refs.libre) refs.libre.checked = libre;
      redraw();
    }

    // Les points bougent à la main : le panneau suit (le verdict, lui, est un texte vivant).
    [A, Mc, Ml].forEach(function (P) { P.on('drag', ecrirePanneau); });

    var refs = mv.addControls([
      { type: 'button', id: 'tour', label: '▶ M fait le tour', onClick: tour },
      { type: 'button', id: 'pourquoi', label: '❓ Pourquoi ?', onClick: pourquoi },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); raz(); } },
      { type: 'checkbox', id: 'libre', label: 'M libre (réciproque)', checked: false, onChange: basculeLibre }
    ]);

    raz();
    pourquoi();   // charge les étapes : en pas à pas la figure est prête, on déroule à la main
  }
});
