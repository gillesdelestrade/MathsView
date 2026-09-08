/*
 * Constructions au compas (6ème) — médiatrice d'un segment et bissectrice d'un angle.
 *
 * Une seule leçon, deux constructions au choix (boutons, comme la leçon
 * « conversions »). Le bouton « Lancer l'animation » trace les étapes DANS
 * L'ORDRE du protocole de construction ; « Réinitialiser » efface le tracé et
 * ne laisse que la donnée de départ.
 *
 * ---------------------------------------------------------------------------
 * MÉDIATRICE de [AB]
 * ---------------------------------------------------------------------------
 *   1. Cercle centré en A, de rayon r.
 *   2. Cercle centré en B, de MÊME rayon r.
 *   3. La droite qui passe par les deux points d'intersection est la médiatrice.
 *   Condition sur le rayon : d/2 < r < d (d = AB). En dessous de d/2 les cercles
 *   ne se coupent pas ; le curseur « ouverture » est borné pour rester valide.
 *
 * ---------------------------------------------------------------------------
 * BISSECTRICE de l'angle de sommet O
 * ---------------------------------------------------------------------------
 *   1. Un arc centré en O coupe les deux côtés en I et J.
 *   2. Deux arcs de MÊME rayon, centrés en I puis en J, se coupent en K.
 *   3. La demi-droite [OK) est la bissectrice.
 *
 * ---------------------------------------------------------------------------
 * Comment on « dessine » un tracé qui s'allonge
 * ---------------------------------------------------------------------------
 * Chaque cercle / arc / segment animé est une courbe paramétrée dont on fait
 * varier la borne supérieure `prog` de 0 à 1 (voir arcCurve / segCurve). Les
 * points (A, B, O, I, J, K…) sont définis par des FONCTIONS des points mobiles,
 * donc tout reste juste quand on déplace la figure ou qu'on bouge le curseur.
 */
MathsView.register({
  id: 'compas',
  title: 'Constructions au compas',
  level: '6eme',
  category: 'geometrie',
  subcategory: 'Constructions',
  theme: 'Géométrie — médiatrice et bissectrice à la règle et au compas',
  exercices: ['compas'],
  description:
    'Deux constructions classiques, tracées pas à pas. La <strong>médiatrice</strong> ' +
    'd\'un segment : deux cercles de même rayon centrés sur les extrémités. La ' +
    '<strong>bissectrice</strong> d\'un angle : un arc au sommet, puis deux arcs de ' +
    'même écartement. ' +
    '<br><strong>Choisis une construction</strong>, règle l\'<strong>ouverture du ' +
    'compas</strong>, puis clique sur <strong>Lancer l\'animation</strong>. ' +
    'Tu peux déplacer les points de la figure.',
  notes:
    '<ul>' +
    '<li><strong>Médiatrice</strong> : le rayon des deux cercles doit être ' +
    '<strong>plus grand que la moitié</strong> du segment (sinon les cercles ne se ' +
    'coupent pas) et <strong>plus petit que le segment</strong>. Les deux points ' +
    'd\'intersection sont à égale distance de A et de B : la droite qui les joint ' +
    'coupe [AB] en son milieu et perpendiculairement.</li>' +
    '<li><strong>Bissectrice</strong> : on reporte le <strong>même écartement</strong> ' +
    'de compas depuis I et depuis J ; leur point de rencontre K est à égale distance ' +
    'des deux côtés, donc [OK) partage l\'angle en deux angles égaux.</li>' +
    '</ul>' +
    '<p>Au compas, on ne mesure jamais : on <strong>reporte des longueurs égales</strong>. ' +
    'C\'est cette égalité qui garantit la construction.</p>',
  board: { boundingbox: [-7, 6, 7, -6], keepaspectratio: true },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Constructions au compas',
    figures: [{
      legende: 'Médiatrice de [AB] : deux arcs de même rayon.',
      boundingbox: [-5.4, 2.7, 5.4, -2.7],
      largeur: 54, hauteur: 28,
      dessine: function (board) {
        var A = [-2, 0], B = [2, 0], r = 2.5, D = Math.PI / 180;
        var cache = { visible: false, name: '', withLabel: false, fixed: true, showInfobox: false };
        function arc(C, P1, P2, attr) {
          return board.create('arc', [board.create('point', C, cache), board.create('point', P1, cache), board.create('point', P2, cache)], attr);
        }
        function pt(P, nom, dx, dy, col) {
          board.create('point', P, { name: '', size: 2.5, color: col, fixed: true, highlight: false, showInfobox: false });
          board.create('text', [P[0] + dx, P[1] + dy, nom], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        board.create('segment', [A, B], { strokeColor: '#0f172a', strokeWidth: 2, fixed: true, highlight: false });
        // Arc centré en A (vers la droite) et arc centré en B (vers la gauche).
        arc(A, [A[0] + r * Math.cos(-62 * D), r * Math.sin(-62 * D)], [A[0] + r * Math.cos(62 * D), r * Math.sin(62 * D)],
          { strokeColor: '#2563eb', strokeWidth: 1.5, fixed: true, highlight: false });
        arc(B, [B[0] + r * Math.cos(118 * D), r * Math.sin(118 * D)], [B[0] + r * Math.cos(242 * D), r * Math.sin(242 * D)],
          { strokeColor: '#2563eb', strokeWidth: 1.5, fixed: true, highlight: false });
        var h = Math.sqrt(r * r - 4);
        board.create('line', [board.create('point', [0, h], cache), board.create('point', [0, -h], cache)], { strokeColor: '#059669', strokeWidth: 2, fixed: true, highlight: false });
        board.create('polygon', [[0, 0], [0.3, 0], [0.3, 0.3], [0, 0.3]], {
          fillColor: 'none', fillOpacity: 0, borders: { strokeColor: '#059669', strokeWidth: 1 }, vertices: { visible: false }, highlight: false, fixed: true
        });
        pt(A, 'A', -0.35, -0.4, '#0f172a'); pt(B, 'B', 0.35, -0.4, '#0f172a');
        pt([0, h], 'M', 0.45, 0.05, '#059669'); pt([0, -h], 'N', 0.45, -0.05, '#059669');
      }
    }, {
      legende: 'Bissectrice : un arc en O, puis deux arcs égaux depuis I et J.',
      boundingbox: [-0.6, 3.4, 5.2, -0.9],
      largeur: 54, hauteur: 28,
      dessine: function (board) {
        var D = Math.PI / 180, a = 70, r = 2, r2 = 1.8;
        var I = [r, 0], J = [r * Math.cos(a * D), r * Math.sin(a * D)];
        var t = 3.026, K = [t * Math.cos(35 * D), t * Math.sin(35 * D)];
        var cache = { visible: false, name: '', withLabel: false, fixed: true, showInfobox: false };
        function pt(P, nom, dx, dy, col) {
          board.create('point', P, { name: '', size: 2.5, color: col, fixed: true, highlight: false, showInfobox: false });
          board.create('text', [P[0] + dx, P[1] + dy, nom], { anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        function arc(C, r, a1, a2, col) {
          board.create('arc', [board.create('point', C, cache), board.create('point', [C[0] + r * Math.cos(a1 * D), C[1] + r * Math.sin(a1 * D)], cache), board.create('point', [C[0] + r * Math.cos(a2 * D), C[1] + r * Math.sin(a2 * D)], cache)],
            { strokeColor: col, strokeWidth: 1.5, fixed: true, highlight: false });
        }
        board.create('segment', [[0, 0], [4.8, 0]], { strokeColor: '#0f172a', strokeWidth: 2, fixed: true, highlight: false });
        board.create('segment', [[0, 0], [4.8 * Math.cos(a * D), 4.8 * Math.sin(a * D)]], { strokeColor: '#0f172a', strokeWidth: 2, fixed: true, highlight: false });
        arc([0, 0], r, -12, 82, '#2563eb');
        arc(I, r2, 50, 100, '#2563eb');
        arc(J, r2, -30, 20, '#2563eb');
        board.create('line', [board.create('point', [0, 0], cache), board.create('point', K, cache)], { straightFirst: false, strokeColor: '#059669', strokeWidth: 2, fixed: true, highlight: false });
        pt([0, 0], 'O', -0.3, -0.3, '#0f172a');
        pt(I, 'I', 0.35, 0.3, '#2563eb'); pt(J, 'J', -0.35, 0.1, '#2563eb');
        pt(K, 'K', 0.35, -0.3, '#059669');
      }
    }],
    points: [
      'Au compas, on ne mesure pas : on <b>reporte des longueurs égales</b>. C\'est ce qui garantit la construction.',
      '<b>Médiatrice</b> de [AB] : deux arcs de <b>même rayon</b>, centrés en A puis en B, se coupent en M et N.',
      'La droite (MN) coupe [AB] en son <b>milieu</b>, <b>perpendiculairement</b>. Le rayon doit dépasser la moitié de AB.',
      '<b>Bissectrice</b> d\'un angle de sommet O : un arc centré en O coupe les côtés en I et J.',
      'Depuis I et J, deux arcs de <b>même écartement</b> se coupent en K.',
      'La demi-droite [OK) partage l\'angle en deux angles <b>égaux</b>.'
    ],
    exemples: [
      'AB = 6 cm : on prend un écartement de 4 cm (plus que 3 cm) pour tracer les deux arcs.',
      'Tout point de la médiatrice est à égale distance de A et de B : MA = MB.',
      'Angle de 70° : sa bissectrice le partage en deux angles de 35°.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var DATA = '#2563eb';   // donnée de départ (segment, côtés de l'angle)
    var GUIDE = '#94a3b8';  // cercles / arcs de construction (gris)
    var RESULT = '#7c3aed'; // le tracé final (médiatrice / bissectrice)
    var INK = '#334155';    // sommets, points

    /* ==================================================================== */
    /* État partagé                                                          */
    /* ==================================================================== */
    var mode = 'mediatrice';
    var items = [];         // objets JSXGraph de la figure courante (à effacer au changement)
    var current = null;     // API { play, reset } de la construction affichée

    // Moteur d'animation partagé (runSteps / animate) + mode « pas à pas »
    // (case à cocher, bouton « Suivante » et barre espace) fournis par le harness.
    var anim = mv.createAnimator();
    function cancelAnim() { anim.cancel(); }
    function runSteps(steps, reset) { anim.runSteps(steps, reset); }

    function add(obj) { items.push(obj); return obj; }
    function show(obj, v) { obj.setAttribute({ visible: v }); }

    function clearFigure() {
      cancelAnim();
      items.forEach(function (o) { try { board.removeObject(o); } catch (e) {} });
      items = [];
    }

    /* ==================================================================== */
    /* Fabriques de tracés « qui s'allongent »                               */
    /* ==================================================================== */
    // Arc de cercle : centre (cx,cy fns), rayon rad (fn), de l'angle a0 à a1
    // (fns, en radians). On révèle la portion [0, prog] du balayage a0→a1.
    function arcCurve(cx, cy, rad, a0, a1, style) {
      var prog = { v: 0 };
      var c = add(board.create('curve', [
        function (t) { return cx() + rad() * Math.cos(a0() + (a1() - a0()) * t); },
        function (t) { return cy() + rad() * Math.sin(a0() + (a1() - a0()) * t); },
        0,
        function () { return prog.v; }
      ], style));
      return { curve: c, prog: prog };
    }
    // Segment : de p0 à p1 (fns renvoyant [x,y]), révélé de 0 à prog.
    function segCurve(p0, p1, style) {
      var prog = { v: 0 };
      var c = add(board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0,
        function () { return prog.v; }
      ], style));
      return { curve: c, prog: prog };
    }

    // Normalise un angle dans ]-π, π] (pour balayer un angle par le plus court).
    function norm(a) {
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a <= -Math.PI) a += 2 * Math.PI;
      return a;
    }
    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }

    /* ==================================================================== */
    /* Construction 1 — MÉDIATRICE de [AB]                                   */
    /* ==================================================================== */
    function buildMediatrice() {
      clearFigure();

      var A = add(board.create('point', [-2, -1], { name: 'A', size: 4, color: DATA }));
      var B = add(board.create('point', [2, 1], { name: 'B', size: 4, color: DATA }));
      add(board.create('segment', [A, B], { strokeColor: INK, strokeWidth: 2 }));

      // Longueur du segment et rayon commun des deux cercles. Le curseur (fracVal
      // dans ]0,55 ; 0,95[) garantit d/2 < rad < d, condition pour qu'ils se coupent.
      function d() { return dist(A, B); }
      function rad() { return fracVal * d(); }

      // Milieu de [AB] et normale unitaire à (AB).
      function mx() { return (A.X() + B.X()) / 2; }
      function my() { return (A.Y() + B.Y()) / 2; }
      function nx() { return -(B.Y() - A.Y()) / d(); }
      function ny() { return (B.X() - A.X()) / d(); }
      // Demi-corde : distance des intersections au milieu = sqrt(r² - (d/2)²).
      function hh() { var rr = rad(), hf = d() / 2; return Math.sqrt(Math.max(0, rr * rr - hf * hf)); }

      function Ppt() { return [mx() + hh() * nx(), my() + hh() * ny()]; }
      function Qpt() { return [mx() - hh() * nx(), my() - hh() * ny()]; }

      // Points d'intersection (cachés jusqu'à ce que les deux cercles soient tracés).
      var P = add(board.create('point', [function () { return Ppt()[0]; }, function () { return Ppt()[1]; }],
        { name: '', size: 3, color: RESULT, fixed: true, visible: false, showInfobox: false }));
      var Q = add(board.create('point', [function () { return Qpt()[0]; }, function () { return Qpt()[1]; }],
        { name: '', size: 3, color: RESULT, fixed: true, visible: false, showInfobox: false }));
      // Milieu, révélé à la fin (le pied de la médiatrice sur [AB]).
      var M = add(board.create('point', [mx, my],
        { name: '', size: 2, color: RESULT, fixed: true, visible: false, showInfobox: false }));

      // Les deux cercles de construction (même rayon rad).
      var cA = arcCurve(function () { return A.X(); }, function () { return A.Y(); }, rad,
        function () { return 0; }, function () { return 2 * Math.PI; },
        { strokeColor: GUIDE, strokeWidth: 1.5, dash: 0, highlight: false });
      var cB = arcCurve(function () { return B.X(); }, function () { return B.Y(); }, rad,
        function () { return 0; }, function () { return 2 * Math.PI; },
        { strokeColor: GUIDE, strokeWidth: 1.5, dash: 0, highlight: false });

      // La médiatrice : le segment qui joint les deux intersections (tracé en dernier).
      var med = segCurve(Ppt, Qpt, { strokeColor: RESULT, strokeWidth: 2.5, highlight: false });

      // Petit L d'angle droit au pied M (montre la perpendicularité), révélé à la fin.
      // Deux segments c1–c2 et c2–c3, tracés le long de (AB) et de la normale.
      var e = 0.35;
      function ux() { return (B.X() - A.X()) / d(); }
      function uy() { return (B.Y() - A.Y()) / d(); }
      var hidden = { visible: false, fixed: true, name: '', withLabel: false, showInfobox: false };
      var c1 = add(board.create('point',
        [function () { return mx() + e * ux(); }, function () { return my() + e * uy(); }], hidden));
      var c2 = add(board.create('point',
        [function () { return mx() + e * ux() + e * nx(); }, function () { return my() + e * uy() + e * ny(); }], hidden));
      var c3 = add(board.create('point',
        [function () { return mx() + e * nx(); }, function () { return my() + e * ny(); }], hidden));
      var sqA = add(board.create('segment', [c1, c2],
        { strokeColor: RESULT, strokeWidth: 1, visible: false, highlight: false, fixed: true }));
      var sqB = add(board.create('segment', [c2, c3],
        { strokeColor: RESULT, strokeWidth: 1, visible: false, highlight: false, fixed: true }));

      // Étiquette du résultat.
      var lab = add(board.create('text',
        [function () { return Ppt()[0] + 0.2; }, function () { return Ppt()[1] + 0.2; },
         'médiatrice'],
        { fontSize: 13, color: RESULT, cssStyle: 'font-weight:600', visible: false, fixed: true }));

      function hideDrawing() {
        cA.prog.v = cB.prog.v = med.prog.v = 0;
        show(P, false); show(Q, false); show(M, false);
        show(sqA, false); show(sqB, false); show(lab, false);
      }
      hideDrawing();

      current = {
        play: function () {
          hideDrawing();
          runSteps([
            { dur: 850, step: function (p) { cA.prog.v = p; } },
            { dur: 850, step: function (p) { cB.prog.v = p; }, after: function () { show(P, true); show(Q, true); } },
            { dur: 750, step: function (p) { med.prog.v = p; },
              after: function () { show(M, true); show(sqA, true); show(sqB, true); show(lab, true); } }
          ], hideDrawing);
        },
        reset: hideDrawing
      };
    }

    /* ==================================================================== */
    /* Construction 2 — BISSECTRICE de l'angle de sommet O                   */
    /* ==================================================================== */
    function buildBissectrice() {
      clearFigure();

      var O = add(board.create('point', [-2.5, -2.5], { name: 'O', size: 4, color: INK }));
      var A = add(board.create('point', [4, -0.5], { name: '', size: 3, color: DATA }));
      var B = add(board.create('point', [0.5, 4], { name: '', size: 3, color: DATA }));
      add(board.create('segment', [O, A], { strokeColor: DATA, strokeWidth: 2 }));
      add(board.create('segment', [O, B], { strokeColor: DATA, strokeWidth: 2 }));

      function aA() { return Math.atan2(A.Y() - O.Y(), A.X() - O.X()); }
      function aB() { return Math.atan2(B.Y() - O.Y(), B.X() - O.X()); }
      function minSide() { return Math.min(dist(O, A), dist(O, B)); }
      // Rayon de l'arc centré en O : une fraction du plus court côté (< au côté,
      // donc l'arc coupe bien les deux côtés à l'intérieur des segments).
      function rho() { return fracVal * minSide(); }

      // I et J : intersections de l'arc avec les deux côtés.
      function Ipt() { return [O.X() + rho() * Math.cos(aA()), O.Y() + rho() * Math.sin(aA())]; }
      function Jpt() { return [O.X() + rho() * Math.cos(aB()), O.Y() + rho() * Math.sin(aB())]; }
      var I = add(board.create('point', [function () { return Ipt()[0]; }, function () { return Ipt()[1]; }],
        { name: '', size: 3, color: RESULT, fixed: true, visible: false, showInfobox: false }));
      var J = add(board.create('point', [function () { return Jpt()[0]; }, function () { return Jpt()[1]; }],
        { name: '', size: 3, color: RESULT, fixed: true, visible: false, showInfobox: false }));

      // Écartement commun des deux petits arcs : un peu plus que la moitié de IJ
      // (garantit qu'ils se coupent, quel que soit l'angle).
      function dij() { var i = Ipt(), j = Jpt(); return Math.hypot(j[0] - i[0], j[1] - i[1]); }
      function s() { return 0.75 * dij(); }

      // K : intersection des deux petits arcs, choisie du côté opposé à O
      // (à l'intérieur de l'angle) → c'est le point de la bissectrice.
      function Kpt() {
        var i = Ipt(), j = Jpt();
        var mx = (i[0] + j[0]) / 2, myy = (i[1] + j[1]) / 2;
        var dd = dij();
        var hk = Math.sqrt(Math.max(0, s() * s() - (dd / 2) * (dd / 2)));
        var ux = (j[0] - i[0]) / dd, uy = (j[1] - i[1]) / dd; // I→J unitaire
        var nx = -uy, ny = ux;                                // normale
        var k1 = [mx + hk * nx, myy + hk * ny];
        var k2 = [mx - hk * nx, myy - hk * ny];
        var d1 = Math.hypot(k1[0] - O.X(), k1[1] - O.Y());
        var d2 = Math.hypot(k2[0] - O.X(), k2[1] - O.Y());
        return d1 >= d2 ? k1 : k2;    // le plus loin de O = à l'intérieur de l'angle
      }
      var K = add(board.create('point', [function () { return Kpt()[0]; }, function () { return Kpt()[1]; }],
        { name: '', size: 3, color: RESULT, fixed: true, visible: false, showInfobox: false }));

      // Arc centré en O, balayé du côté A vers le côté B par le plus court chemin.
      var arcO = arcCurve(function () { return O.X(); }, function () { return O.Y(); }, rho,
        function () { return aA(); }, function () { return aA() + norm(aB() - aA()); },
        { strokeColor: GUIDE, strokeWidth: 1.5, highlight: false });

      // Deux petits arcs (rayon s) centrés en I et J, ouverts autour de la direction de K.
      var w = 0.6; // demi-ouverture angulaire des petits arcs (radians)
      function phiI() { var i = Ipt(), k = Kpt(); return Math.atan2(k[1] - i[1], k[0] - i[0]); }
      function phiJ() { var j = Jpt(), k = Kpt(); return Math.atan2(k[1] - j[1], k[0] - j[0]); }
      var arcI = arcCurve(function () { return Ipt()[0]; }, function () { return Ipt()[1]; }, s,
        function () { return phiI() - w; }, function () { return phiI() + w; },
        { strokeColor: GUIDE, strokeWidth: 1.5, highlight: false });
      var arcJ = arcCurve(function () { return Jpt()[0]; }, function () { return Jpt()[1]; }, s,
        function () { return phiJ() - w; }, function () { return phiJ() + w; },
        { strokeColor: GUIDE, strokeWidth: 1.5, highlight: false });

      // La bissectrice : de O vers K, prolongée un peu au-delà.
      function endPt() { var k = Kpt(); return [O.X() + 1.35 * (k[0] - O.X()), O.Y() + 1.35 * (k[1] - O.Y())]; }
      var bis = segCurve(function () { return [O.X(), O.Y()]; }, endPt,
        { strokeColor: RESULT, strokeWidth: 2.5, highlight: false });

      // Marques d'angles égaux (révélées à la fin) : les deux moitiés de l'angle.
      var ang1 = add(board.create('angle', [A, O, K],
        { radius: 0.9, fillColor: RESULT, fillOpacity: 0.18, strokeColor: RESULT,
          name: '', withLabel: false, visible: false, fixed: true }));
      var ang2 = add(board.create('angle', [K, O, B],
        { radius: 0.9, fillColor: RESULT, fillOpacity: 0.18, strokeColor: RESULT,
          name: '', withLabel: false, visible: false, fixed: true }));

      var lab = add(board.create('text',
        [function () { return endPt()[0] + 0.15; }, function () { return endPt()[1] + 0.15; },
         'bissectrice'],
        { fontSize: 13, color: RESULT, cssStyle: 'font-weight:600', visible: false, fixed: true }));

      function hideDrawing() {
        arcO.prog.v = arcI.prog.v = arcJ.prog.v = bis.prog.v = 0;
        show(I, false); show(J, false); show(K, false);
        show(ang1, false); show(ang2, false); show(lab, false);
      }
      hideDrawing();

      current = {
        play: function () {
          hideDrawing();
          runSteps([
            { dur: 900, step: function (p) { arcO.prog.v = p; }, after: function () { show(I, true); show(J, true); } },
            { dur: 600, step: function (p) { arcI.prog.v = p; } },
            { dur: 600, step: function (p) { arcJ.prog.v = p; }, after: function () { show(K, true); } },
            { dur: 800, step: function (p) { bis.prog.v = p; },
              after: function () { show(ang1, true); show(ang2, true); show(lab, true); } }
          ], hideDrawing);
        },
        reset: hideDrawing
      };
    }

    /* ==================================================================== */
    /* Le curseur pilote `fracVal` (partagé par les deux constructions)      */
    /* ==================================================================== */
    // 55 % → 95 % : pour la médiatrice, rayon entre 0,55·d et 0,95·d (donc bien
    // entre d/2 et d) ; pour la bissectrice, arc entre 0,55 et 0,95 du côté.
    var fracVal = 0.75;

    /* ==================================================================== */
    /* Interface : choix de la construction + boutons + curseur              */
    /* ==================================================================== */
    var modeBtns = {};
    function setMode(key) {
      mode = key;
      Object.keys(modeBtns).forEach(function (k) {
        modeBtns[k].classList.toggle('active', k === key);
      });
      if (key === 'mediatrice') buildMediatrice(); else buildBissectrice();
      board.update();
      current.play();   // on montre tout de suite la construction
    }

    var refs = mv.addControls([
      { type: 'button', id: 'mediatrice', label: 'Médiatrice d\'un segment', onClick: function () { setMode('mediatrice'); } },
      { type: 'button', id: 'bissectrice', label: 'Bissectrice d\'un angle', onClick: function () { setMode('bissectrice'); } },
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: function () { if (current) current.play(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { if (current) current.reset(); board.update(); } },
      { type: 'slider', id: 'open', label: 'Ouverture du compas', min: 55, max: 95, step: 1, value: 75,
        onInput: function (v) { fracVal = v / 100; board.update(); } }
    ]);
    modeBtns.mediatrice = refs.mediatrice;
    modeBtns.bissectrice = refs.bissectrice;

    // Démarrage sur la médiatrice.
    setMode('mediatrice');
  }
});
