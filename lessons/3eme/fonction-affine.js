/*
 * Fonction affine y = m·x + p — retrouver l'équation à partir de DEUX points.
 * On place A et B, on calcule m = (yB - yA)/(xB - xA), puis on déduit p.
 */
MathsView.register({
  id: 'fonction-affine',
  title: 'Fonction affine (par 2 points)',
  level: '3eme',
  category: 'analyse',
  theme: 'Fonctions — équation d\'une droite',
  exercices: ['fonction-affine'],
  description:
    'La droite passe par les deux points \\( A \\) et \\( B \\). ' +
    'À partir de leurs coordonnées, on calcule le <strong>coefficient directeur</strong> ' +
    '\\[ m = \\frac{y_B - y_A}{x_B - x_A} \\] ' +
    'puis on déduit l\'<strong>ordonnée à l\'origine</strong> \\( p = y_A - m\\,x_A \\) ' +
    '(on trouve la même valeur avec B). ' +
    '<br><strong>Déplace A et B</strong> (ils s\'accrochent aux points entiers) et regarde le calcul se faire.',
  notes:
    '<ul>' +
    '<li>\\( \\Delta y = y_B - y_A \\) (montée) et \\( \\Delta x = x_B - x_A \\) (avancée) : ' +
    'le coefficient directeur est le rapport des deux.</li>' +
    '<li>\\( p \\) se lit aussi directement : c\'est l\'ordonnée du point où la droite ' +
    'croise l\'axe vertical.</li>' +
    '<li>Si \\( x_A = x_B \\), la droite est verticale : ce n\'est pas une fonction affine.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 8, 8, -8] },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Fonction affine',
    figures: [{
      legende: 'f(x) = 2x − 1 : de A à B, on avance de 2 et on monte de 4.',
      boundingbox: [-2.6, 6.2, 4.6, -2.6],
      axis: true,
      largeur: 56, hauteur: 52,
      dessine: function (board) {
        var m = 2, p = -1;
        var A = [1, 1], B = [3, 5];
        board.create('functiongraph', [function (x) { return m * x + p; }, -2.5, 4.5], {
          strokeColor: '#0284c7', strokeWidth: 2.2, fixed: true, highlight: false
        });
        // L'escalier Δx puis Δy.
        board.create('segment', [A, [B[0], A[1]]], { strokeColor: '#dc2626', strokeWidth: 1.6, dash: 2, fixed: true, highlight: false });
        board.create('segment', [[B[0], A[1]], B], { strokeColor: '#16a34a', strokeWidth: 1.6, dash: 2, fixed: true, highlight: false });
        board.create('text', [2, 0.55, 'Δx = 2'], { anchorX: 'middle', anchorY: 'top', fontSize: 11, color: '#dc2626', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [3.25, 3, 'Δy = 4'], { anchorX: 'left', anchorY: 'middle', fontSize: 11, color: '#16a34a', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        // Les noms sont posés à l'écart de l'escalier : A en haut à gauche du
        // point, B à droite, pour ne rien recouvrir.
        function pt(P, nom, dx, dy, ancre) {
          board.create('point', P, { name: '', size: 3, strokeColor: '#0f172a', fillColor: '#0f172a', fixed: true, highlight: false, showInfobox: false });
          board.create('text', [P[0] + dx, P[1] + dy, nom], { anchorX: ancre, anchorY: 'middle', fontSize: 12, cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        pt(A, 'A (1 ; 1)', -0.2, 0.5, 'right');
        pt(B, 'B (3 ; 5)', 0.25, 0.15, 'left');
        // L'ordonnée à l'origine.
        board.create('point', [0, p], { name: '', size: 3, strokeColor: '#7c3aed', fillColor: '#7c3aed', fixed: true, highlight: false, showInfobox: false });
        board.create('text', [-0.25, p, 'p = −1'], { anchorX: 'right', anchorY: 'middle', fontSize: 11, color: '#7c3aed', cssStyle: 'font-weight:700', fixed: true, highlight: false });
      }
    }],
    points: [
      'Une <b>fonction affine</b> s\'écrit \\( f(x) = mx + p \\). Sa représentation graphique est une <b>droite</b>.',
      '\\( m \\) est le <b>coefficient directeur</b> : quand x augmente de 1, f(x) augmente de m.',
      '\\( p \\) est l\'<b>ordonnée à l\'origine</b> : la droite coupe l\'axe des ordonnées au point (0 ; p).',
      'Avec deux points A et B de la droite : \\( m = \\dfrac{y_B - y_A}{x_B - x_A} \\), puis \\( p = y_A - m \\, x_A \\).',
      'Si m > 0 la droite <b>monte</b> ; si m < 0 elle <b>descend</b> ; si m = 0 elle est horizontale.',
      'Si p = 0, la fonction est <b>linéaire</b> : la droite passe par l\'origine.'
    ],
    exemples: [
      'A (1 ; 1) et B (3 ; 5) : \\( m = \\dfrac{5 - 1}{3 - 1} = \\dfrac{4}{2} = 2 \\), ' +
        '\\( p = 1 - 2 \\times 1 = -1 \\). Donc \\( f(x) = 2x - 1 \\).',
      'Vérification avec B : \\( f(3) = 2 \\times 3 - 1 = 5 \\). ✓',
      '\\( g(x) = -3x + 4 \\) : m = −3, la droite descend ; p = 4. Image de 2 : \\( g(2) = -6 + 4 = -2 \\).'
    ]
  },

  setup: function (board, mv) {
    var opts = {
      size: 5, snapToGrid: true, snapSizeX: 1, snapSizeY: 1,
      label: { offset: [10, 10], fontSize: 15 }
    };
    var A = board.create('point', [-3, -1], Object.assign({ name: 'A', color: '#2563eb' }, opts));
    var B = board.create('point', [2, 4], Object.assign({ name: 'B', color: '#0d9488' }, opts));

    // La droite (AB) — gère aussi le cas vertical.
    board.create('line', [A, B], { strokeColor: '#2563eb', strokeWidth: 3 });

    function m() { var dx = B.X() - A.X(); return dx === 0 ? Infinity : (B.Y() - A.Y()) / dx; }
    function p() { var mm = m(); return isFinite(mm) ? A.Y() - mm * A.X() : NaN; }

    // Point (0 ; p) sur l'axe des ordonnées.
    board.create('point', [0, function () { return p(); }],
      { name: '(0 ; p)', size: 3, color: '#f59e0b', fixed: true, label: { offset: [10, -6] } });

    // Triangle de pente entre A et B : avancée Δx puis montée Δy.
    var corner = board.create('point', [function () { return B.X(); }, function () { return A.Y(); }], { visible: false });
    board.create('segment', [A, corner], { strokeColor: '#64748b', dash: 2 });
    board.create('segment', [corner, B], { strokeColor: '#64748b', dash: 2 });
    board.create('text', [
      function () { return (A.X() + B.X()) / 2; },
      function () { return A.Y() - 0.5; },
      function () { return 'Δx = ' + (B.X() - A.X()); }
    ], { fontSize: 13, color: '#475569', anchorX: 'middle' });
    board.create('text', [
      function () { return B.X() + 0.3; },
      function () { return (A.Y() + B.Y()) / 2; },
      function () { return 'Δy = ' + (B.Y() - A.Y()); }
    ], { fontSize: 13, color: '#475569' });

    // ---- Panneau de calcul, mis à jour en direct ----------------------- //
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function par(n) { return n < 0 ? '(−' + Math.abs(n) + ')' : '' + n; }
    function fmt(n) { return Number.isInteger(n) ? '' + n : n.toFixed(2); }

    function render() {
      var xA = A.X(), yA = A.Y(), xB = B.X(), yB = B.Y();
      var dx = xB - xA, dy = yB - yA;

      var head =
        '<div class="props-label">Coordonnées</div>' +
        '<div class="calc-line">A(' + fmt(xA) + ' ; ' + fmt(yA) + ')&nbsp;&nbsp;&nbsp;' +
        'B(' + fmt(xB) + ' ; ' + fmt(yB) + ')</div>';

      if (dx === 0) {
        panel.innerHTML = head +
          '<div class="calc-warn">x<sub>A</sub> = x<sub>B</sub> : la droite est verticale, ' +
          'ce n\'est pas une fonction affine (le coefficient m n\'existe pas).</div>';
        return;
      }

      var mm = dy / dx, pp = yA - mm * xA;
      var signe = pp >= 0 ? '+ ' + fmt(pp) : '− ' + fmt(Math.abs(pp));

      panel.innerHTML = head +
        '<div class="props-label">Coefficient directeur</div>' +
        '<div class="calc-line">m = (y<sub>B</sub> − y<sub>A</sub>) / (x<sub>B</sub> − x<sub>A</sub>) = (' +
        par(yB) + ' − ' + par(yA) + ') / (' + par(xB) + ' − ' + par(xA) + ') = ' +
        fmt(dy) + ' / ' + fmt(dx) + ' = <b>' + fmt(mm) + '</b></div>' +

        '<div class="props-label">Ordonnée à l\'origine</div>' +
        '<div class="calc-line">à partir de A : p = y<sub>A</sub> − m·x<sub>A</sub> = ' +
        par(yA) + ' − ' + fmt(mm) + '×' + par(xA) + ' = <b>' + fmt(pp) + '</b></div>' +
        '<div class="calc-line">à partir de B : p = y<sub>B</sub> − m·x<sub>B</sub> = ' +
        par(yB) + ' − ' + fmt(mm) + '×' + par(xB) + ' = <b>' + fmt(yB - mm * xB) + '</b></div>' +

        '<div class="props-label">Équation de la droite</div>' +
        '<div class="calc-result">f(x) = ' + fmt(mm) + ' x ' + signe + '</div>';
    }

    A.on('drag', render);
    B.on('drag', render);
    board.on('update', render);
    render();
  }
});
