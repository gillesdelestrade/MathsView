/*
 * Symétrie centrale (5ème) — l'image d'un polygone par rapport à un point.
 *
 * C'est la leçon « Symétrie axiale » (6ème) transposée : là-bas l'axe était une
 * DROITE et l'on traçait des perpendiculaires ; ici le centre est un POINT O et
 * l'on trace des droites QUI PASSENT PAR O.
 *
 * L'animation, en deux temps :
 *   1. « Lancer l'animation » — pour CHAQUE sommet M, on trace la demi-droite
 *      [MO) que l'on prolonge d'autant de l'autre côté : O est le MILIEU de
 *      [MM']. Puis on relie les images pour dessiner le polygone symétrique ;
 *   2. « Le demi-tour » — la figure de départ pivote de 180° autour de O et
 *      vient se poser EXACTEMENT sur son image. C'est le nom même de la
 *      transformation : la symétrie centrale est un demi-tour.
 * Ensuite on déplace O (ou les sommets bleus) : l'image suit en direct.
 *
 * ---------------------------------------------------------------------------
 * Le symétrique d'un point par rapport à un point
 * ---------------------------------------------------------------------------
 * Pour un point M, le symétrique est M' = 2O − M (traduction exacte de « O est
 * le milieu de [MM'] »). Comme l'image de chaque sommet est une FONCTION de O
 * et du sommet, tout reste juste quand on bouge O ou un sommet.
 *
 * Le demi-tour utilise, lui, la rotation d'angle a autour de O :
 *   x' = xO + (x − xO)·cos a − (y − yO)·sin a
 *   y' = yO + (x − xO)·sin a + (y − yO)·cos a
 * et pour a = 180° on retrouve bien 2O − M : les deux constructions donnent la
 * même figure, ce que l'animation fait CONSTATER au lieu de l'affirmer.
 *
 * ---------------------------------------------------------------------------
 * Tracés « qui s'allongent »
 * ---------------------------------------------------------------------------
 * Chaque trait animé est une courbe paramétrée dont on fait varier la borne
 * `prog` de 0 à 1 (voir segCurve, les arcs du demi-tour et le contour). Voir
 * aussi « Symétrie axiale » et « Constructions au compas », même moteur.
 */
MathsView.register({
  id: 'symetrie-centrale',
  title: 'Symétrie centrale',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Transformations',
  theme: 'Géométrie — symétrie par rapport à un point',
  description:
    'Le <strong>symétrique</strong> d\'une figure par rapport à un <strong>centre</strong> \\( O \\) : ' +
    'chaque sommet \\( M \\) a une image \\( M\' \\) telle que \\( O \\) soit le ' +
    '<strong>milieu</strong> de \\( [MM\'] \\) — les trois points sont alignés. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> pour construire l\'image sommet par ' +
    'sommet, puis sur <strong>Le demi-tour</strong> : la figure pivote de <strong>180°</strong> ' +
    'autour de \\( O \\) et se pose sur son image. ' +
    'Tu peux déplacer le <strong>centre</strong> \\( O \\) et les sommets bleus : tout suit en direct.',
  notes:
    '<ul>' +
    '<li>La symétrie centrale de centre \\( O \\) est le <strong>demi-tour</strong> autour de ' +
    '\\( O \\) : une rotation d\'un <strong>angle de 180°</strong>.</li>' +
    '<li>\\( M\' \\) est le symétrique de \\( M \\) veut dire : \\( O \\) est le <strong>milieu</strong> ' +
    'de \\( [MM\'] \\). Donc \\( M \\), \\( O \\) et \\( M\' \\) sont <strong>alignés</strong> et ' +
    '\\( OM = OM\' \\).</li>' +
    '<li>La figure et son image sont <strong>superposables</strong> : mêmes longueurs, mêmes ' +
    'angles. La symétrie centrale <strong>conserve</strong> les distances et les angles.</li>' +
    '<li>Différence avec la <strong>symétrie axiale</strong> : par rapport à un axe, la figure est ' +
    '« retournée » comme dans un miroir ; par un demi-tour, elle garde le <strong>même sens</strong> ' +
    'de lecture — on peut la faire glisser en tournant, sans la retourner.</li>' +
    '<li>Le symétrique du centre \\( O \\) est \\( O \\) lui-même : c\'est le seul point qui ne ' +
    'bouge pas.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var ORIG = '#2563eb';    // figure de départ (bleu)
    var IMG = '#7c3aed';     // image par symétrie (violet)
    var CTR = '#059669';     // centre de symétrie (vert)
    var TURN = '#ea580c';    // figure en train de faire le demi-tour (orange)
    var GUIDE = '#94a3b8';   // traits de construction (gris)

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas »                       */
    /* (case à cocher, bouton « Suivante » et barre espace) — voir app.js.   */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function cancelAnim() { anim.cancel(); }
    function runSteps(steps, reset) { anim.runSteps(steps, reset); }
    // Segment de p0 à p1 (fns → [x,y]), révélé de 0 à prog.
    function segCurve(p0, p1, style) {
      var prog = { v: 0 };
      var c = board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0, function () { return prog.v; }
      ], style);
      return { curve: c, prog: prog };
    }
    function show(obj, v) { obj.setAttribute({ visible: v }); }

    /* ==================================================================== */
    /* Centre de symétrie : un point, déplaçable                             */
    /* ==================================================================== */
    var O = board.create('point', [0, 0], {
      name: 'O', size: 5, color: CTR, snapToGrid: false,
      label: { offset: [10, -16], strokeColor: CTR, fontSize: 16 }
    });

    // Symétrique de (px,py) par rapport à O : O est le milieu de [MM'].
    function reflect(px, py) { return [2 * O.X() - px, 2 * O.Y() - py]; }

    // Rotation de (px,py) autour de O d'un angle a (en radians).
    function rotate(px, py, a) {
      var dx = px - O.X(), dy = py - O.Y(), c = Math.cos(a), s = Math.sin(a);
      return [O.X() + dx * c - dy * s, O.Y() + dx * s + dy * c];
    }

    /* ==================================================================== */
    /* Figure de départ : polygone à 6 sommets (déplaçables)                 */
    /* ==================================================================== */
    // Sommets choisis d'un côté de O, forme volontairement asymétrique.
    var START = [
      [-5.2, 0.7], [-3, 0.3], [-1.7, 1.7], [-2.4, 3.4], [-3.8, 3.8], [-5.2, 2.6]
    ];
    var NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];
    var n = START.length;

    var V = START.map(function (p, i) {
      return board.create('point', p,
        { name: NAMES[i], size: 4, color: ORIG, label: { offset: [-12, 8], strokeColor: ORIG } });
    });
    board.create('polygon', V, {
      fillColor: ORIG, fillOpacity: 0.12, highlight: false,
      borders: { strokeColor: ORIG, strokeWidth: 2 }, vertices: { visible: true }
    });

    /* ==================================================================== */
    /* Image : points symétriques (fonctions des sommets et du centre)       */
    /* ==================================================================== */
    // Coordonnées image du sommet i (recalculées en direct).
    function img(i) { return reflect(V[i].X(), V[i].Y()); }

    var VI = [];      // points images (cachés au départ)
    var conn = [];    // traits de construction Vi → O → Vi' (alignés, O au milieu)
    for (var i = 0; i < n; i++) {
      (function (i) {
        VI[i] = board.create('point',
          [function () { return img(i)[0]; }, function () { return img(i)[1]; }],
          { name: NAMES[i] + "'", size: 4, color: IMG, fixed: true, visible: false,
            showInfobox: false, label: { offset: [8, 8], strokeColor: IMG } });
        // Le trait part du sommet, passe par O à mi-chemin (car OM = OM')
        // et s'arrête sur l'image : le « milieu » se voit à l'œil.
        conn[i] = segCurve(
          function () { return [V[i].X(), V[i].Y()]; },
          function () { return img(i); },
          { strokeColor: GUIDE, strokeWidth: 1.5, dash: 2, highlight: false });
      })(i);
    }

    // Contour de l'image, dessiné d'un trait (courbe le long du polygone fermé).
    var perimProg = { v: 0 };
    board.create('curve', [
      function (sp) {
        var seg = Math.floor(sp + 1e-9), t = sp - seg;
        if (seg >= n) { seg = n - 1; t = 1; }
        var a = img(seg), b = img((seg + 1) % n);
        return a[0] + (b[0] - a[0]) * t;
      },
      function (sp) {
        var seg = Math.floor(sp + 1e-9), t = sp - seg;
        if (seg >= n) { seg = n - 1; t = 1; }
        var a = img(seg), b = img((seg + 1) % n);
        return a[1] + (b[1] - a[1]) * t;
      },
      0, function () { return perimProg.v * n; }
    ], { strokeColor: IMG, strokeWidth: 2.5, highlight: false });

    // Polygone image final (rempli), affiché une fois le contour tracé.
    var imgPoly = board.create('polygon', VI, {
      fillColor: IMG, fillOpacity: 0.12, highlight: false, visible: false,
      borders: { strokeColor: IMG, strokeWidth: 2 }, vertices: { visible: false }
    });

    /* ==================================================================== */
    /* Le demi-tour : la figure de départ pivote de 0° à 180° autour de O     */
    /* ==================================================================== */
    var turn = { v: 0 };            // angle courant, en radians

    // Copie de la figure, tournée de `turn.v` : à 180° elle est sur l'image.
    var VT = V.map(function (p, i) {
      return board.create('point',
        [function () { return rotate(V[i].X(), V[i].Y(), turn.v)[0]; },
         function () { return rotate(V[i].X(), V[i].Y(), turn.v)[1]; }],
        { name: '', size: 3, color: TURN, fixed: true, visible: false, showInfobox: false });
    });
    var turnPoly = board.create('polygon', VT, {
      fillColor: TURN, fillOpacity: 0.2, highlight: false, visible: false,
      borders: { strokeColor: TURN, strokeWidth: 2 }, vertices: { visible: false }
    });

    // Trajectoire de chaque sommet : l'arc de cercle de centre O parcouru
    // depuis le sommet jusqu'à l'angle courant.
    var arcs = V.map(function (p, i) {
      return board.create('curve', [
        function (a) { return rotate(V[i].X(), V[i].Y(), a)[0]; },
        function (a) { return rotate(V[i].X(), V[i].Y(), a)[1]; },
        0, function () { return turn.v; }
      ], { strokeColor: TURN, strokeWidth: 1, dash: 2, strokeOpacity: 0.7, highlight: false, visible: false });
    });

    // Affichage de l'angle parcouru, à côté du centre.
    var angleTxt = board.create('text', [
      function () { return O.X() + 0.4; },
      function () { return O.Y() + 0.5; },
      function () { return Math.round(turn.v * 180 / Math.PI) + '°'; }
    ], { fontSize: 16, color: TURN, cssStyle: 'font-weight:700', fixed: true, visible: false });

    /* ==================================================================== */
    /* Traits de construction : affichage optionnel                          */
    /* ==================================================================== */
    var showConstruction = true;
    function applyConstruction() {
      conn.forEach(function (c) { show(c.curve, showConstruction && c.prog.v > 0); });
      arcs.forEach(function (a) { show(a, showConstruction && turn.v > 0); });
    }

    /* ==================================================================== */
    /* États : effacer / construire point par point / faire le demi-tour     */
    /* ==================================================================== */
    function hideDrawing() {
      cancelAnim();
      conn.forEach(function (c) { c.prog.v = 0; show(c.curve, false); });
      VI.forEach(function (p) { show(p, false); });
      perimProg.v = 0;
      show(imgPoly, false);
      turn.v = 0;
      VT.forEach(function (p) { show(p, false); });
      arcs.forEach(function (a) { show(a, false); });
      show(turnPoly, false);
      show(angleTxt, false);
      board.update();
    }

    function play() {
      hideDrawing();
      var steps = [];
      // Phase 1 : un sommet après l'autre, on trace [MM'] (qui passe par O)
      // puis on pose l'image.
      for (var i = 0; i < n; i++) {
        (function (i) {
          steps.push({
            dur: 500,
            step: function (p) { conn[i].prog.v = p; if (showConstruction) show(conn[i].curve, true); },
            after: function () { show(VI[i], true); }
          });
        })(i);
      }
      // Phase 2 : on relie tous les points images (contour tracé d'un trait).
      steps.push({
        dur: 1100,
        step: function (p) { perimProg.v = p; },
        after: function () { show(imgPoly, true); perimProg.v = 0; }
      });
      runSteps(steps, hideDrawing);
    }

    function halfTurn() {
      hideDrawing();
      // On fait tourner la figure d'un quart de tour, puis du second : à 180°
      // elle se pose exactement sur son symétrique.
      function spin(from, to) {
        return {
          dur: 1000,
          step: function (p) {
            turn.v = (from + (to - from) * p) * Math.PI / 180;
            VT.forEach(function (q) { show(q, true); });
            show(turnPoly, true);
            show(angleTxt, true);
            if (showConstruction) arcs.forEach(function (a) { show(a, true); });
          }
        };
      }
      runSteps([
        spin(0, 90),
        Object.assign(spin(90, 180), {
          after: function () {
            // La figure tournée EST l'image : on la remplace par le symétrique.
            VI.forEach(function (p) { show(p, true); });
            show(imgPoly, true);
            VT.forEach(function (q) { show(q, false); });
            show(turnPoly, false);
          }
        })
      ], hideDrawing);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: play },
      { type: 'button', id: 'turn', label: '↻ Le demi-tour', onClick: halfTurn },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: hideDrawing },
      { type: 'checkbox', id: 'cons', label: 'Traits de construction', checked: true,
        onChange: function (v) { showConstruction = v; applyConstruction(); board.update(); } }
    ]);

    // Démarrage : on joue l'animation une première fois.
    play();
  }
});
