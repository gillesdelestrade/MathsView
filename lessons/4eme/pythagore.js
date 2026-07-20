/*
 * Théorème de Pythagore — carrés construits sur les trois côtés.
 * Modèle : chaque cours appelle MathsView.register({...}).
 */
MathsView.register({
  id: 'pythagore',
  title: 'Théorème de Pythagore',
  level: '4eme',
  theme: 'Géométrie — triangle rectangle',
  description:
    'Dans un triangle rectangle, l\'aire du grand carré (sur l\'hypoténuse) est ' +
    'égale à la somme des aires des deux petits carrés : \\( a^2 + b^2 = c^2 \\). ' +
    '<br><strong>Déplace les points A et B</strong> et observe que l\'égalité reste toujours vraie.',
  notes:
    '<ul>' +
    '<li>Le carré bleu et le carré vert (sur les côtés de l\'angle droit) valent ensemble le carré orange.</li>' +
    '<li>L\'angle droit est en C : il ne change jamais.</li>' +
    '</ul>',
  board: { boundingbox: [-7, 8, 9, -7], keepaspectratio: true },

  setup: function (board) {
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
    board.create('polygon', [C, A, p1, p2], { fillColor: '#2563eb', fillOpacity: 0.25, vertices: { visible: false }, borders: { strokeColor: '#2563eb' } });

    // Carré sur CB (côté vert) — vers la gauche.
    var q1 = board.create('point', [function () { return -b(); }, function () { return b(); }], { visible: false });
    var q2 = board.create('point', [function () { return -b(); }, 0], { visible: false });
    board.create('polygon', [C, B, q1, q2], { fillColor: '#0d9488', fillOpacity: 0.25, vertices: { visible: false }, borders: { strokeColor: '#0d9488' } });

    // Carré sur l'hypoténuse AB (côté orange) — vers l'extérieur.
    var r1 = board.create('point', [function () { return b(); }, function () { return b() + a(); }], { visible: false });
    var r2 = board.create('point', [function () { return a() + b(); }, function () { return a(); }], { visible: false });
    board.create('polygon', [A, B, r1, r2], { fillColor: '#f59e0b', fillOpacity: 0.3, vertices: { visible: false }, borders: { strokeColor: '#f59e0b' } });

    // Affichage vivant de l'égalité.
    board.create('text', [-6.5, 7, function () {
      var av = a(), bv = b();
      var c2 = av * av + bv * bv;
      return 'a² + b² = ' + (av * av).toFixed(1) + ' + ' + (bv * bv).toFixed(1) +
        ' = ' + c2.toFixed(1) + ' = c²';
    }], { fontSize: 16, color: '#1e293b', cssStyle: 'font-weight:600' });
  }
});
