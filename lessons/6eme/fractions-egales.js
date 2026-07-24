/*
 * Égalités de fractions (6ème) — pourquoi 3/4 = 6/8 = 9/12.
 *
 * Trois barres EMPILÉES, toutes de la même largeur (= une unité) :
 *   - en haut   : a/b            (l'unité coupée en b parts, a coloriées)
 *   - au milieu : (a×2)/(b×2)     (coupée deux fois plus finement)
 *   - en bas    : (a×3)/(b×3)     (trois fois plus finement)
 * La LONGUEUR coloriée est identique sur les trois barres : une ligne
 * pointillée verticale, posée au bord du coloriage, le montre d'un coup d'œil.
 * D'où l'égalité : on multiplie le numérateur ET le dénominateur par le même
 * nombre sans changer la valeur.
 *
 * Technique (comme la leçon « fractions ») : le nombre de parts change avec b,
 * donc on n'en crée/détruit jamais — un pool FIXE de courbes par barre, chacune
 * avec un updateDataArray() qui se recalcule depuis (a, b) et s'efface quand son
 * emplacement ne sert pas. Bar r (mult = r+1) a au plus mult·B_MAX parts.
 */
MathsView.register({
  id: 'fractions-egales',
  title: 'Égalités de fractions',
  level: '6eme',
  theme: 'Nombres — fractions égales',
  description:
    'Deux fractions différentes peuvent désigner le <strong>même nombre</strong>. ' +
    'Si on multiplie le <strong>numérateur et le dénominateur par le même nombre</strong>, ' +
    'la fraction ne change pas de valeur : \\( \\frac{3}{4} = \\frac{6}{8} = \\frac{9}{12} \\).' +
    '<br><strong>Saisis un numérateur et un dénominateur</strong> : les trois barres, de même ' +
    'largeur, montrent la <strong>même longueur coloriée</strong>.',
  notes:
    '<ul>' +
    '<li>Multiplier en haut <b>et</b> en bas par 2 : chaque part est coupée en deux, ' +
    'il y a deux fois plus de parts coloriées — la quantité ne bouge pas.</li>' +
    '<li>De même par 3, par 4… on obtient autant de fractions égales qu\'on veut.</li>' +
    '<li>À l\'inverse, <strong>simplifier</strong> c\'est <em>diviser</em> le numérateur et le ' +
    'dénominateur par un même nombre : \\( \\frac{6}{8} = \\frac{3}{4} \\).</li>' +
    '<li>La ligne pointillée tombe au même endroit sur les trois barres : c\'est la preuve ' +
    'visuelle que les fractions sont égales.</li>' +
    '</ul>',
  board: { boundingbox: [-3.3, 5.7, 11.3, -1.3], keepaspectratio: false, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var a = 3, b = 4;
    var B_MAX = 8;                 // dénominateur de base ≤ 8 (parts lisibles)
    var MULT = [1, 2, 3];          // les trois barres

    var PLEIN = '#0d9488', VIDE = '#eef2f7', TRAIT = '#334155';
    var ACCENT = '#2563eb', TAG = '#7c3aed';

    var X0 = 0, W = 10;            // barre = une unité, largeur W
    // Géométrie verticale des trois barres.
    var BAR = [
      { yTop: 4.65, yBot: 3.45 },
      { yTop: 2.70, yBot: 1.50 },
      { yTop: 0.75, yBot: -0.45 }
    ];
    function midY(r) { return (BAR[r].yTop + BAR[r].yBot) / 2; }
    function xFill() { return X0 + (a / b) * W; }   // bord du coloriage (identique aux 3)

    /* ==================================================================== */
    /* Les parts : un pool fixe de courbes par barre                         */
    /* ==================================================================== */
    for (var r = 0; r < 3; r++) {
      var mult = MULT[r];
      var pool = mult * B_MAX;     // nombre maxi de parts pour cette barre
      for (var i = 0; i < pool; i++) {
        (function (rr, m, idx) {
          var cell = board.create('curve', [[], []], {
            strokeColor: TRAIT, strokeWidth: 1,
            fillColor: function () { return idx < a * m ? PLEIN : VIDE; },
            fillOpacity: 0.9, highlight: false, fixed: true
          });
          cell.updateDataArray = function () {
            var parts = b * m;
            if (idx >= parts) { this.dataX = []; this.dataY = []; return; }
            var xL = X0 + idx * W / parts, xR = X0 + (idx + 1) * W / parts;
            this.dataX = [xL, xR, xR, xL, xL];
            this.dataY = [BAR[rr].yBot, BAR[rr].yBot, BAR[rr].yTop, BAR[rr].yTop, BAR[rr].yBot];
          };
        })(r, mult, i);
      }
    }

    /* ==================================================================== */
    /* Ligne pointillée d'égalité (au bord du coloriage)                     */
    /* ==================================================================== */
    var guide = board.create('curve', [[], []],
      { strokeColor: ACCENT, strokeWidth: 2, dash: 2, fixed: true, highlight: false, layer: 8 });
    guide.updateDataArray = function () {
      var x = xFill();
      this.dataX = [x, x];
      this.dataY = [BAR[0].yTop + 0.35, BAR[2].yBot - 0.35];
    };
    board.create('text', [xFill, function () { return BAR[0].yTop + 0.6; },
      function () { return a > 0 && a < b ? 'même longueur coloriée' : ''; }],
      { anchorX: 'middle', fontSize: 12, color: ACCENT, cssStyle: 'font-weight:700',
        fixed: true, highlight: false });

    /* ==================================================================== */
    /* Étiquettes : la fraction de chaque barre + le facteur ×2 / ×3          */
    /* ==================================================================== */
    for (var rr = 0; rr < 3; rr++) {
      (function (r, m) {
        board.create('text', [-1.6, function () { return midY(r); },
          function () { return (a * m) + '/' + (b * m); }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 22,
            cssStyle: 'font-weight:800', color: '#1e293b', fixed: true, highlight: false });
        if (m > 1) {
          board.create('text', [-2.95, function () { return midY(r); },
            function () { return '×' + m; }],
            { anchorX: 'middle', anchorY: 'middle', fontSize: 16,
              cssStyle: 'font-weight:700', color: TAG, fixed: true, highlight: false });
        }
      })(rr, MULT[rr]);
    }
    // Rappel « à partir de la 1re barre » sous forme de flèches légères.
    board.create('text', [X0 + W + 0.4, midY(0), 'l\'unité'],
      { anchorX: 'left', anchorY: 'middle', fontSize: 12, color: '#94a3b8', fixed: true, highlight: false });

    /* ==================================================================== */
    /* Saisie du numérateur et du dénominateur                               */
    /* ==================================================================== */
    var form = document.createElement('div');
    form.className = 'frac-entry';
    form.innerHTML =
      '<label>Numérateur <input class="frac-a" type="number" min="0" max="8" step="1"></label>' +
      '<span class="frac-bar">/</span>' +
      '<label>Dénominateur <input class="frac-b" type="number" min="1" max="8" step="1"></label>' +
      '<span class="frac-msg"></span>';
    mv.extras.appendChild(form);
    var inA = form.querySelector('.frac-a');
    var inB = form.querySelector('.frac-b');
    var msg = form.querySelector('.frac-msg');

    /* ==================================================================== */
    /* Panneau : l'arithmétique des égalités                                 */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function frac(n, d) { return '\\( \\frac{' + n + '}{' + d + '} \\)'; }
    function fracMul(n, d, k) { return '\\( \\frac{' + n + '\\times ' + k + '}{' + d + '\\times ' + k + '} \\)'; }

    function render() {
      var html = '';
      html += '<div class="props-label">Trois fractions égales</div>';
      html += '<div class="calc-result">' + frac(a, b) + ' = ' + frac(2 * a, 2 * b) +
              ' = ' + frac(3 * a, 3 * b) + '</div>';
      html += '<div class="props-label">Pourquoi</div>';
      html += '<div class="calc-line">On multiplie le numérateur <b>et</b> le dénominateur ' +
              'par le même nombre :</div>';
      html += '<div class="calc-line">' + frac(a, b) + ' = ' + fracMul(a, b, 2) + ' = ' +
              frac(2 * a, 2 * b) + '</div>';
      html += '<div class="calc-line">' + frac(a, b) + ' = ' + fracMul(a, b, 3) + ' = ' +
              frac(3 * a, 3 * b) + '</div>';
      html += '<div class="calc-line">Les trois barres ont la <b>même longueur coloriée</b> : ' +
              'ces écritures désignent le <b>même nombre</b>.</div>';
      html += '<div class="props-label">À l\'inverse</div>';
      html += '<div class="calc-line"><b>Simplifier</b>, c\'est <em>diviser</em> les deux termes par ' +
              'le même nombre : ' + frac(2 * a, 2 * b) + ' = ' + frac(a, b) + '.</div>';
      panel.innerHTML = html;
      mv.typeset();   // le panneau contient du LaTeX \frac{}{}
    }

    /* ==================================================================== */
    /* Mise à jour + garde-fous de saisie                                    */
    /* ==================================================================== */
    function syncInputs() { inA.value = a; inB.value = b; }

    function clampFromInputs() {
      var na = parseInt(inA.value, 10);
      var nb = parseInt(inB.value, 10);
      var note = '';
      if (isNaN(nb)) nb = b;
      if (nb < 1) { nb = 1; }
      if (nb > B_MAX) { nb = B_MAX; note = 'Dénominateur limité à ' + B_MAX + ' (parts lisibles).'; }
      if (isNaN(na)) na = a;
      if (na < 0) na = 0;
      if (na > nb) { na = nb; note = 'Pour cette illustration, le numérateur reste ≤ dénominateur (fraction ≤ 1).'; }
      a = na; b = nb;
      msg.textContent = note;
    }

    var lastA = null, lastB = null;
    function refresh() {
      if (a === lastA && b === lastB) return;
      lastA = a; lastB = b;
      board.update();   // déclenche tous les updateDataArray
      render();
    }

    // « input » : on redessine en direct avec les valeurs bornées, sans réécrire
    // le champ (pour pouvoir l'effacer et retaper). « change » (blur/Entrée) :
    // on normalise l'affichage du champ sur la valeur retenue.
    inA.oninput = function () { clampFromInputs(); refresh(); };
    inB.oninput = function () { clampFromInputs(); refresh(); };
    inA.onchange = function () { clampFromInputs(); syncInputs(); refresh(); };
    inB.onchange = function () { clampFromInputs(); syncInputs(); refresh(); };

    // Démarrage : 3/4.
    syncInputs();
    board.update();
    render();
  }
});
