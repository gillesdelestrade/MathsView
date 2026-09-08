/*
 * Cercle trigonométrique — cosinus et sinus comme coordonnées d'un point.
 */
MathsView.register({
  id: 'cercle-trigonometrique',
  title: 'Cercle trigonométrique',
  level: '1ere',
  category: 'geometrie',
  theme: 'Trigonométrie — cosinus et sinus',
  description:
    'Sur le cercle de rayon 1, à un angle \\( \\theta \\) correspond un point \\( M \\). ' +
    'Son abscisse est \\( \\cos\\theta \\) (segment bleu) et son ordonnée est \\( \\sin\\theta \\) (segment vert). ' +
    'Fais tourner le point \\( M \\) autour du cercle et observe comment cosinus et sinus varient entre −1 et 1.',
  notes:
    '<ul>' +
    '<li>Un tour complet = \\( 2\\pi \\) radians = 360°.</li>' +
    '<li>Le théorème de Pythagore donne \\( \\cos^2\\theta + \\sin^2\\theta = 1 \\).</li>' +
    '<li>Repères utiles : \\( \\frac{\\pi}{6} \\), \\( \\frac{\\pi}{4} \\), \\( \\frac{\\pi}{3} \\), \\( \\frac{\\pi}{2} \\).</li>' +
    '</ul>',
  board: { boundingbox: [-1.8, 1.8, 1.8, -1.8], keepaspectratio: true },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Cercle trigonométrique',
    figures: [{
      legende: 'θ = π/3 : cos θ = 1/2 en bleu, sin θ = √3/2 en vert.',
      boundingbox: [-1.45, 1.45, 1.45, -1.45],
      largeur: 48, hauteur: 48,
      dessine: function (board) {
        var t = Math.PI / 3, M = [Math.cos(t), Math.sin(t)];
        var inv = { visible: false, fixed: true, withLabel: false };
        board.create('arrow', [[-1.35, 0], [1.4, 0]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('arrow', [[0, -1.35], [0, 1.4]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('circle', [board.create('point', [0, 0], inv), 1], { strokeColor: '#94a3b8', strokeWidth: 2, fillColor: '#ffffff', fillOpacity: 0, fixed: true, highlight: false });
        board.create('arc', [board.create('point', [0, 0], inv), board.create('point', [0.32, 0], inv),
                             board.create('point', [0.32 * M[0], 0.32 * M[1]], inv)], { strokeColor: '#f59e0b', strokeWidth: 2.5, fixed: true, highlight: false });
        board.create('segment', [[0, 0], M], { strokeColor: '#7c3aed', strokeWidth: 2, fixed: true, highlight: false });
        board.create('segment', [[0, 0], [M[0], 0]], { strokeColor: '#2563eb', strokeWidth: 4, fixed: true, highlight: false });
        board.create('segment', [[0, 0], [0, M[1]]], { strokeColor: '#0d9488', strokeWidth: 4, fixed: true, highlight: false });
        board.create('segment', [M, [M[0], 0]], { strokeColor: '#0d9488', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
        board.create('segment', [M, [0, M[1]]], { strokeColor: '#2563eb', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
        board.create('point', M, { name: '', size: 3, strokeColor: '#7c3aed', fillColor: '#7c3aed', fixed: true, highlight: false, showInfobox: false });
        function txt(x, y, t, col, ax, ay) {
          board.create('text', [x, y, t], { anchorX: ax || 'middle', anchorY: ay || 'middle', fontSize: 11, color: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        txt(M[0] + 0.08, M[1] + 0.1, 'M', '#7c3aed', 'left');
        txt(0.42, 0.16, 'θ', '#f59e0b', 'left');
        txt(M[0] / 2, -0.1, 'cos θ', '#2563eb', 'middle', 'top');
        txt(-0.08, M[1] / 2, 'sin θ', '#0d9488', 'right');
        txt(1.04, -0.08, '1', '#334155', 'left', 'top');
        txt(-0.08, 1.04, '1', '#334155', 'right', 'bottom');
        txt(-1.1, -0.08, '−1', '#334155', 'middle', 'top');
      }
    }],
    points: [
      'Le <b>cercle trigonométrique</b> a pour centre O et pour <b>rayon 1</b>. On le parcourt dans le sens <b>direct</b> (anti-horaire).',
      'À un angle θ correspond un point M du cercle : \\( M(\\cos\\theta\\,;\\,\\sin\\theta) \\).',
      '<b>cos θ</b> est l\'abscisse de M, <b>sin θ</b> son ordonnée : tous deux sont entre −1 et 1.',
      'Pythagore dans le triangle : \\( \\cos^2\\theta + \\sin^2\\theta = 1 \\).',
      'Un tour complet vaut <b>2π radians</b> = 360°. Donc π rad = 180° et π/2 rad = 90°.',
      'Valeurs à connaître : <b>cos π/3 = sin π/6 = 1/2</b> ; <b>cos π/4 = sin π/4 = √2/2</b> ; ' +
        '<b>cos π/6 = sin π/3 = √3/2</b>.'
    ],
    exemples: [
      'θ = π/3 (60°) : cos θ = 1/2 et sin θ = √3/2. Vérification : \\( \\left(\\tfrac{1}{2}\\right)^2 + \\left(\\tfrac{\\sqrt 3}{2}\\right)^2 = \\tfrac{1}{4} + \\tfrac{3}{4} = 1 \\). ✓',
      '\\( \\theta = \\pi \\) (180°) : M(−1 ; 0), donc \\( \\cos\\pi = -1 \\) et \\( \\sin\\pi = 0 \\).',
      'Convertir 45° en radians : \\( 45 \\times \\dfrac{\\pi}{180} = \\dfrac{\\pi}{4} \\) ; et 2π/3 rad = 120°.'
    ]
  },

  setup: function (board) {
    var O = board.create('point', [0, 0], { name: 'O', fixed: true, size: 2, color: '#334155', label: { visible: false } });
    board.create('circle', [O, 1], { strokeColor: '#94a3b8', strokeWidth: 2 });

    // Point mobile contraint au cercle.
    var M = board.create('glider', [Math.cos(1), Math.sin(1), board.create('circle', [O, 1], { visible: false })],
      { name: 'M', size: 5, color: '#7c3aed' });

    // Rayon OM.
    board.create('segment', [O, M], { strokeColor: '#7c3aed', strokeWidth: 2 });

    // Projections : cos sur l'axe x (bleu), sin sur l'axe y (vert).
    var Px = board.create('point', [function () { return M.X(); }, 0], { visible: false });
    var Py = board.create('point', [0, function () { return M.Y(); }], { visible: false });
    board.create('segment', [O, Px], { strokeColor: '#2563eb', strokeWidth: 4 });
    board.create('segment', [O, Py], { strokeColor: '#0d9488', strokeWidth: 4 });
    board.create('segment', [M, Px], { strokeColor: '#0d9488', dash: 2 });
    board.create('segment', [M, Py], { strokeColor: '#2563eb', dash: 2 });

    // Angle au centre.
    board.create('angle', [board.create('point', [1, 0], { visible: false, fixed: true }), O, M],
      { radius: 0.35, fillColor: '#f59e0b', name: 'θ' });

    // Valeurs numériques.
    board.create('text', [-1.7, 1.6, function () {
      var ang = Math.atan2(M.Y(), M.X());
      if (ang < 0) ang += 2 * Math.PI;
      var deg = ang * 180 / Math.PI;
      return 'θ = ' + deg.toFixed(0) + '°   cos θ = ' + M.X().toFixed(2) + '   sin θ = ' + M.Y().toFixed(2);
    }], { fontSize: 14, color: '#1e293b', cssStyle: 'font-weight:600' });
  }
});
