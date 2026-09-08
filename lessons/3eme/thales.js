/*
 * Théorème de Thalès — deux droites sécantes coupées par deux parallèles.
 */
MathsView.register({
  id: 'thales',
  title: 'Théorème de Thalès',
  level: '3eme',
  category: 'geometrie',
  exercices: ['thales'],
  theme: 'Géométrie — configuration de Thalès',
  description:
    'Deux droites passant par un point \\( A \\) sont coupées par deux parallèles \\( (BC) \\) et \\( (DE) \\). ' +
    'Alors les longueurs sont proportionnelles : ' +
    '\\[ \\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC} \\] ' +
    'Déplace \\( D \\) le long de la demi-droite : le rapport reste le même sur les trois quotients.',
  notes:
    '<ul>' +
    '<li>La droite \\((DE)\\) est construite parallèle à \\((BC)\\) : elle le reste quand tu bouges D.</li>' +
    '<li>Les trois rapports affichés sont toujours égaux — c\'est ça, le théorème de Thalès.</li>' +
    '</ul>',
  board: { boundingbox: [-2, 8, 12, -2], keepaspectratio: true },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Théorème de Thalès',
    figures: [{
      legende: '(DE) ∥ (BC) : les trois rapports sont égaux.',
      boundingbox: [-0.2, 8.2, 10.6, 0],
      largeur: 58, hauteur: 44,
      dessine: function (board) {
        var A = [1, 1], B = [9, 2], C = [6, 7], D = [5, 1.5], E = [3.5, 4];
        board.create('segment', [A, B], { strokeColor: '#64748b', strokeWidth: 1.5, fixed: true, highlight: false });
        board.create('segment', [A, C], { strokeColor: '#64748b', strokeWidth: 1.5, fixed: true, highlight: false });
        board.create('segment', [B, C], { strokeColor: '#2563eb', strokeWidth: 2.5, fixed: true, highlight: false });
        board.create('segment', [D, E], { strokeColor: '#7c3aed', strokeWidth: 2.5, fixed: true, highlight: false });
        function pt(P, nom, dx, dy, col) {
          board.create('point', P, { name: '', size: 2.5, strokeColor: col, fillColor: col, fixed: true, highlight: false, showInfobox: false });
          board.create('text', [P[0] + dx, P[1] + dy, nom], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, cssStyle: 'font-weight:700', color: col, fixed: true, highlight: false });
        }
        pt(A, 'A', -0.5, -0.1, '#334155');
        pt(B, 'B', 0.5, -0.1, '#2563eb');
        pt(C, 'C', 0.2, 0.55, '#2563eb');
        pt(D, 'D', 0.1, -0.6, '#7c3aed');
        pt(E, 'E', -0.55, 0.15, '#7c3aed');
      }
    }],
    points: [
      '<b>Configuration :</b> deux droites qui se coupent en A ; D sur (AB), E sur (AC), et <b>(DE) ∥ (BC)</b>.',
      '<b>Théorème de Thalès :</b> alors \\( \\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC} \\).',
      'Les longueurs du petit triangle ADE et du grand triangle ABC sont <b>proportionnelles</b>.',
      'Il sert à <b>calculer une longueur</b> manquante, par un produit en croix.',
      'Ne pas oublier de <b>vérifier</b> le parallélisme avant de l\'appliquer, et de partir toujours du point A.',
      '<b>Réciproque :</b> si \\( \\dfrac{AD}{AB} = \\dfrac{AE}{AC} \\) (points dans le même ordre), alors (DE) ∥ (BC).'
    ],
    exemples: [
      'AD = 4, AB = 8, AC = 6 : \\( \\dfrac{4}{8} = \\dfrac{AE}{6} \\), donc \\( AE = \\dfrac{4 \\times 6}{8} = 3 \\).',
      'AD = 4, AB = 8, BC = 5 : \\( DE = \\dfrac{4 \\times 5}{8} = 2{,}5 \\).',
      'AD = 3, AB = 9, AE = 2, AC = 6 : \\( \\dfrac{3}{9} = \\dfrac{2}{6} = \\dfrac{1}{3} \\), donc (DE) ∥ (BC).'
    ]
  },

  setup: function (board) {
    var A = board.create('point', [1, 1], { name: 'A', fixed: true, size: 3, color: '#334155' });
    var B = board.create('point', [9, 2], { name: 'B', size: 4, color: '#2563eb' });
    var C = board.create('point', [6, 7], { name: 'C', size: 4, color: '#2563eb' });

    board.create('segment', [A, B], { strokeColor: '#64748b' });
    board.create('segment', [A, C], { strokeColor: '#64748b' });
    board.create('segment', [B, C], { strokeColor: '#2563eb', strokeWidth: 2 });

    // D : point mobile sur [AB].
    var D = board.create('glider', [5, 1.5, board.create('line', [A, B], { visible: false })],
      { name: 'D', size: 4, color: '#7c3aed' });
    D.on('drag', function () {
      // Reste entre A et B (rapport dans [0,1]).
      var t = (D.X() - A.X()) / (B.X() - A.X());
      if (t < 0.05) D.moveTo([A.X() + 0.05 * (B.X() - A.X()), A.Y() + 0.05 * (B.Y() - A.Y())]);
      if (t > 0.98) D.moveTo([A.X() + 0.98 * (B.X() - A.X()), A.Y() + 0.98 * (B.Y() - A.Y())]);
    });

    // Parallèle à (BC) passant par D, coupant (AC) en E.
    var para = board.create('parallel', [board.create('line', [B, C], { visible: false }), D], { visible: false });
    var E = board.create('intersection', [para, board.create('line', [A, C], { visible: false }), 0],
      { name: 'E', size: 4, color: '#7c3aed' });
    board.create('segment', [D, E], { strokeColor: '#7c3aed', strokeWidth: 2 });

    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }

    board.create('text', [-1.6, 7.4, function () {
      var r1 = dist(A, D) / dist(A, B);
      var r2 = dist(A, E) / dist(A, C);
      var r3 = dist(D, E) / dist(B, C);
      return 'AD/AB = ' + r1.toFixed(2) + '   AE/AC = ' + r2.toFixed(2) + '   DE/BC = ' + r3.toFixed(2);
    }], { fontSize: 15, color: '#1e293b', cssStyle: 'font-weight:600' });
  }
});
