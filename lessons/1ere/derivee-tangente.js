/*
 * Nombre dérivé et tangente — la pente de la tangente en un point vaut f'(x).
 */
MathsView.register({
  id: 'derivee-tangente',
  title: 'Dérivée et tangente',
  level: '1ere',
  category: 'analyse',
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

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Nombre dérivé et tangente',
    figures: [{
      legende: 'f(x) = x² : en M (1 ; 1), la tangente (orange) a pour pente f′(1) = 2.',
      boundingbox: [-2.6, 5.2, 3.2, -1.8],
      axis: true,
      largeur: 54, hauteur: 50,
      dessine: function (board) {
        var a = 1, fa = 1, m = 2;
        board.create('functiongraph', [function (x) { return x * x; }, -2.25, 2.25], {
          strokeColor: '#2563eb', strokeWidth: 2.4, fixed: true, highlight: false
        });
        board.create('functiongraph', [function (x) { return fa + m * (x - a); }, -0.3, 2.95], {
          strokeColor: '#f59e0b', strokeWidth: 2, fixed: true, highlight: false
        });
        // La pente lue sur la tangente : +1 en x, +2 en y.
        board.create('segment', [[a, fa], [a + 1, fa]], { strokeColor: '#dc2626', strokeWidth: 1.4, dash: 2, fixed: true, highlight: false });
        board.create('segment', [[a + 1, fa], [a + 1, fa + m]], { strokeColor: '#16a34a', strokeWidth: 1.4, dash: 2, fixed: true, highlight: false });
        board.create('point', [a, fa], { name: '', size: 3, strokeColor: '#7c3aed', fillColor: '#7c3aed', fixed: true, highlight: false, showInfobox: false });
        board.create('text', [a - 0.2, fa + 0.35, 'M'], { anchorX: 'right', anchorY: 'middle', fontSize: 12, color: '#7c3aed', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [-1.5, 0.9, 'y = x²'], { anchorX: 'right', anchorY: 'middle', fontSize: 11, color: '#2563eb', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [1.5, 0.55, '+1'], { anchorX: 'middle', anchorY: 'top', fontSize: 10, color: '#dc2626', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [2.15, 2, '+2 = f′(1)'], { anchorX: 'left', anchorY: 'middle', fontSize: 10, color: '#16a34a', cssStyle: 'font-weight:700', fixed: true, highlight: false });
      }
    }],
    points: [
      'Le <b>nombre dérivé</b> de f en a, noté \\( f\'(a) \\), est la limite du taux de variation \\( \\dfrac{f(a+h) - f(a)}{h} \\) quand h tend vers 0.',
      'C\'est le <b>coefficient directeur</b> de la <b>tangente</b> à la courbe au point d\'abscisse a.',
      'Équation de la tangente : \\( y = f\'(a)\\,(x - a) + f(a) \\).',
      'Si \\( f\'(a) > 0 \\), la courbe <b>monte</b> en a ; si \\( f\'(a) < 0 \\), elle <b>descend</b>.',
      'Si \\( f\'(a) = 0 \\), la tangente est <b>horizontale</b> : souvent un maximum ou un minimum.',
      'Dérivées à connaître : \\( (x^2)\' = 2x \\), \\( (x^3)\' = 3x^2 \\), \\( (\\sin x)\' = \\cos x \\).'
    ],
    exemples: [
      '\\( f(x) = x^2 \\), a = 2 : \\( f\'(2) = 2 \\times 2 = 4 \\). Tangente : \\( y = 4(x - 2) + 4 = 4x - 4 \\).',
      '\\( f(x) = x^3 - 3x \\) : \\( f\'(x) = 3x^2 - 3 \\), nul pour x = −1 et x = 1 : deux tangentes horizontales.',
      'Par le taux : \\( \\dfrac{(2+h)^2 - 4}{h} = \\dfrac{4h + h^2}{h} = 4 + h \\to 4 \\) quand h → 0.'
    ]
  },

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
