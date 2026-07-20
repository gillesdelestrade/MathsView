/*
 * Nombre dérivé et tangente — la pente de la tangente en un point vaut f'(x).
 */
MathsView.register({
  id: 'derivee-tangente',
  title: 'Dérivée et tangente',
  level: '1ere',
  theme: 'Analyse — nombre dérivé',
  description:
    'Le <strong>nombre dérivé</strong> \\( f\'(a) \\) est le coefficient directeur de la ' +
    '<strong>tangente</strong> à la courbe au point d\'abscisse \\( a \\). ' +
    'Déplace le point \\( M \\) le long de la courbe : la tangente pivote, et sa pente ' +
    'est la valeur de \\( f\'(a) \\).',
  notes:
    '<ul>' +
    '<li>Là où la courbe monte, \\( f\'(a) &gt; 0 \\) ; là où elle descend, \\( f\'(a) &lt; 0 \\).</li>' +
    '<li>Aux sommets (maximum / minimum), la tangente est horizontale : \\( f\'(a) = 0 \\).</li>' +
    '<li>Change de fonction avec les boutons pour comparer.</li>' +
    '</ul>',
  board: { boundingbox: [-6, 8, 6, -8] },

  setup: function (board, mv) {
    var funcs = {
      'x³ − 3x': { f: function (x) { return x * x * x - 3 * x; }, d: function (x) { return 3 * x * x - 3; } },
      'x²':       { f: function (x) { return x * x; },             d: function (x) { return 2 * x; } },
      'sin(x)':   { f: function (x) { return Math.sin(x); },       d: function (x) { return Math.cos(x); } }
    };
    var currentKey = 'x³ − 3x';
    var current = funcs[currentKey];

    var graph = board.create('functiongraph', [function (x) { return current.f(x); }],
      { strokeColor: '#2563eb', strokeWidth: 3 });

    // Point mobile sur la courbe.
    var M = board.create('glider', [1, 0, graph], { name: 'M', size: 5, color: '#7c3aed' });

    // Tangente : droite passant par M de pente f'(a).
    board.create('line', [
      function () { return [M.X(), current.f(M.X())]; },
      function () { return [M.X() + 1, current.f(M.X()) + current.d(M.X())]; }
    ], { strokeColor: '#f59e0b', strokeWidth: 2, dash: 0 });

    // Affichage du nombre dérivé.
    board.create('text', [-5.7, 7.2, function () {
      return 'a = ' + M.X().toFixed(2) + '     f\'(a) = ' + current.d(M.X()).toFixed(2);
    }], { fontSize: 16, color: '#1e293b', cssStyle: 'font-weight:600' });

    // Boutons de changement de fonction.
    mv.addControls([
      { type: 'button', id: 'f1', label: 'f(x) = x³ − 3x', onClick: function () { swap('x³ − 3x'); } },
      { type: 'button', id: 'f2', label: 'f(x) = x²', onClick: function () { swap('x²'); } },
      { type: 'button', id: 'f3', label: 'f(x) = sin(x)', onClick: function () { swap('sin(x)'); } }
    ]);

    function swap(key) {
      current = funcs[key];
      // Ramène M sur la nouvelle courbe.
      board.update();
    }
  }
});
