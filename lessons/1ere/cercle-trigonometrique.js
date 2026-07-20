/*
 * Cercle trigonométrique — cosinus et sinus comme coordonnées d'un point.
 */
MathsView.register({
  id: 'cercle-trigonometrique',
  title: 'Cercle trigonométrique',
  level: '1ere',
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
