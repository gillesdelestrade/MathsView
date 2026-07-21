/*
 * Symétrie axiale (6ème) — l'image d'un polygone par rapport à un axe.
 *
 * Un polygone (6 sommets) est posé d'un côté d'un AXE que l'on peut déplacer.
 * L'animation :
 *   1. pour CHAQUE sommet, trace le trait perpendiculaire à l'axe qui rejoint
 *      son symétrique de l'autre côté (à égale distance), puis pose ce point ;
 *   2. relie tous les points images pour dessiner le polygone symétrique.
 * Ensuite, on peut faire glisser (ou pivoter) l'axe : l'image suit en direct.
 *
 * ---------------------------------------------------------------------------
 * Le symétrique d'un point par rapport à une droite
 * ---------------------------------------------------------------------------
 * Axe = droite passant par deux points L1, L2 (déplaçables). Pour un point P :
 *   - on projette P sur l'axe → pied F (perpendiculaire) ;
 *   - le symétrique est P' = 2F − P (F est le milieu de [PP']).
 * Comme l'image de chaque sommet est une FONCTION de L1, L2 et du sommet, tout
 * reste juste quand on bouge l'axe ou qu'on déplace un sommet.
 *
 * ---------------------------------------------------------------------------
 * Tracés « qui s'allongent »
 * ---------------------------------------------------------------------------
 * Chaque trait animé est une courbe paramétrée dont on fait varier la borne
 * `prog` de 0 à 1 (voir segCurve et la courbe du contour). Voir aussi la leçon
 * « Constructions au compas » qui utilise le même moteur d'animation.
 */
MathsView.register({
  id: 'symetrie-axiale',
  title: 'Symétrie axiale',
  level: '6eme',
  theme: 'Géométrie — symétrie par rapport à une droite',
  description:
    'Le <strong>symétrique</strong> d\'une figure par rapport à un <strong>axe</strong> : ' +
    'chaque sommet a une image de l\'autre côté de l\'axe, à <strong>égale distance</strong>, ' +
    'sur la <strong>perpendiculaire</strong> à l\'axe. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> pour construire l\'image sommet par ' +
    'sommet, puis <strong>déplace l\'axe</strong> (ses deux points) : l\'image bouge en direct. ' +
    'Tu peux aussi déplacer les sommets bleus.',
  notes:
    '<ul>' +
    '<li>L\'axe est la <strong>médiatrice</strong> de chaque segment reliant un point à son ' +
    'image : \\( L \\) est au milieu et le trait \\( [PP\'] \\) lui est perpendiculaire.</li>' +
    '<li>La figure et son image sont <strong>superposables</strong> : mêmes longueurs, mêmes ' +
    'angles. La symétrie <strong>conserve</strong> les distances et les angles.</li>' +
    '<li>Si l\'axe traverse la figure, une partie de l\'image peut recouvrir la figure de départ.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var ORIG = '#2563eb';    // figure de départ (bleu)
    var IMG = '#7c3aed';     // image par symétrie (violet)
    var AXIS = '#059669';    // axe de symétrie (vert)
    var GUIDE = '#94a3b8';   // traits de construction (gris)
    var INK = '#334155';

    /* ==================================================================== */
    /* Moteur d'animation (identique à la leçon compas)                      */
    /* ==================================================================== */
    var raf = null;
    function cancelAnim() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function runSteps(steps) {
      var i = 0;
      function next() {
        if (i >= steps.length) return;
        var s = steps[i++];
        animate(s.dur, s.step, function () { if (s.after) s.after(); next(); });
      }
      next();
    }
    function animate(dur, onStep, onDone) {
      cancelAnim();
      var t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        try {
          onStep(p);
          board.update();
        } catch (e) { raf = null; return; }   // board libéré (on a quitté la leçon)
        if (p < 1) raf = requestAnimationFrame(frame);
        else { raf = null; if (onDone) onDone(); }
      }
      raf = requestAnimationFrame(frame);
    }
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
    /* Axe de symétrie : droite passant par deux points déplaçables          */
    /* ==================================================================== */
    var L1 = board.create('point', [0, -4], { name: '', size: 4, color: AXIS, snapToGrid: false });
    var L2 = board.create('point', [0, 4], { name: '', size: 4, color: AXIS, snapToGrid: false });
    board.create('line', [L1, L2],
      { strokeColor: AXIS, strokeWidth: 2, dash: 2, straightFirst: true, straightLast: true, fixed: true });
    board.create('text', [function () { return L2.X() + 0.3; }, function () { return L2.Y() - 0.2; }, '(d)'],
      { fontSize: 15, color: AXIS, cssStyle: 'font-weight:600', fixed: true });

    // Symétrique de (px,py) par rapport à l'axe : renvoie [x', y', xPied, yPied].
    function reflect(px, py) {
      var x1 = L1.X(), y1 = L1.Y(), dx = L2.X() - x1, dy = L2.Y() - y1;
      var den = dx * dx + dy * dy;
      if (den < 1e-9) return [px, py, px, py];       // axe dégénéré : on ne bouge pas
      var t = ((px - x1) * dx + (py - y1) * dy) / den;
      var fx = x1 + t * dx, fy = y1 + t * dy;         // pied de la perpendiculaire
      return [2 * fx - px, 2 * fy - py, fx, fy];
    }

    /* ==================================================================== */
    /* Figure de départ : polygone à 6 sommets (déplaçables)                 */
    /* ==================================================================== */
    // Sommets choisis à gauche de l'axe, forme volontairement asymétrique.
    var START = [
      [-5, -1], [-2, -2.5], [-0.5, -0.5], [-1, 2], [-3, 3], [-5, 1.5]
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
    /* Image : points symétriques (fonctions des sommets et de l'axe)        */
    /* ==================================================================== */
    // Coordonnées image du sommet i (recalculées en direct).
    function img(i) { var r = reflect(V[i].X(), V[i].Y()); return [r[0], r[1]]; }

    var VI = [];      // points images (cachés au départ)
    var conn = [];    // traits de construction Vi → Vi' (perpendiculaires à l'axe)
    for (var i = 0; i < n; i++) {
      (function (i) {
        VI[i] = board.create('point',
          [function () { return img(i)[0]; }, function () { return img(i)[1]; }],
          { name: NAMES[i] + "'", size: 4, color: IMG, fixed: true, visible: false,
            showInfobox: false, label: { offset: [8, 8], strokeColor: IMG } });
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
    /* Traits de construction : affichage optionnel                          */
    /* ==================================================================== */
    var showConstruction = true;
    function applyConstruction() {
      conn.forEach(function (c) { show(c.curve, showConstruction && c.prog.v > 0); });
    }

    /* ==================================================================== */
    /* États : effacer / jouer l'animation                                   */
    /* ==================================================================== */
    function hideDrawing() {
      cancelAnim();
      conn.forEach(function (c) { c.prog.v = 0; show(c.curve, false); });
      VI.forEach(function (p) { show(p, false); });
      perimProg.v = 0;
      show(imgPoly, false);
      board.update();
    }

    function play() {
      hideDrawing();
      var steps = [];
      // Phase 1 : un sommet après l'autre, on trace la perpendiculaire et l'image.
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
      runSteps(steps);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: play },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: hideDrawing },
      { type: 'checkbox', id: 'cons', label: 'Traits de construction', checked: true,
        onChange: function (v) { showConstruction = v; applyConstruction(); board.update(); } }
    ]);

    // Démarrage : on joue l'animation une première fois.
    play();
  }
});
