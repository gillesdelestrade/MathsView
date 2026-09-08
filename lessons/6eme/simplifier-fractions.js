/*
 * Simplifier une fraction (6ème) — de 6/8 à 3/4, et savoir quand s'arrêter.
 *
 * La leçon « Égalités de fractions » multiplie : 3/4 = 6/8 = 9/12. Celle-ci
 * fait le chemin inverse, celui qu'on demande vraiment à l'élève : partir de
 * 6/8 et trouver une écriture plus simple du MÊME nombre.
 *
 * Le geste, tel qu'on le fait en 6ème, en trois temps répétés :
 *   1) chercher un nombre qui divise le numérateur ET le dénominateur ;
 *   2) diviser les deux par ce nombre : la fraction ne change pas de valeur ;
 *   3) recommencer… jusqu'à ce que le seul diviseur commun soit 1.
 * On prend à chaque fois le PLUS PETIT diviseur commun (2, puis 2, puis 3…) :
 * c'est plus long qu'en divisant par 6 d'un coup, mais on ne peut pas se
 * tromper, et le résumé final montre le raccourci.
 *
 * La figure : une barre par étape, toutes de la même largeur (= une unité).
 * La barre de 6/8 a 8 parts, 6 coloriées. Diviser par 2, c'est REGROUPER les
 * parts deux par deux : des traits épais le montrent sur la barre, puis la
 * barre suivante apparaît, avec 4 parts dont 3 coloriées. La longueur
 * coloriée n'a pas bougé — une ligne pointillée verticale en témoigne.
 *
 * Technique : le nombre de parts change avec la fraction saisie, donc on ne
 * crée/détruit jamais de courbe. Un pool FIXE par barre (B_MAX parts), chaque
 * part se recalcule dans updateDataArray() et s'efface quand elle ne sert pas.
 */
MathsView.register({
  id: 'simplifier-fractions',
  title: 'Simplifier une fraction',
  level: '6eme',
  category: 'calcul',
  subcategory: 'Fractions',
  exercices: ['fractions'],
  theme: 'Nombres — simplifier une fraction, fraction irréductible',
  description:
    '<strong>Simplifier</strong> une fraction, c\'est trouver une écriture plus simple ' +
    'du <strong>même nombre</strong> : \\( \\frac{6}{8} = \\frac{3}{4} \\). On y arrive en ' +
    '<strong>divisant le numérateur et le dénominateur par un même nombre</strong>.' +
    '<br><strong>Saisis une fraction</strong>, puis lance l\'animation : on cherche un ' +
    'diviseur commun, on divise, et on recommence jusqu\'à ne plus pouvoir — la fraction ' +
    'est alors <strong>irréductible</strong>.' +
    '<br><em>Le bouton <strong>▶ Animer</strong> déroule les étapes une à une ' +
    '(bouton <em>Suivante</em> ou barre espace).</em>',
  notes:
    '<ul>' +
    '<li><strong>Pourquoi ça marche.</strong> Diviser le numérateur <b>et</b> le dénominateur ' +
    'par 2, c\'est regrouper les parts deux par deux : il y a deux fois moins de parts, ' +
    'chacune deux fois plus grande — la longueur coloriée ne bouge pas. C\'est l\'égalité ' +
    'de fractions, lue à l\'envers.</li>' +
    '<li><strong>Un diviseur <em>commun</em>.</strong> Il faut un nombre qui divise les ' +
    '<em>deux</em> termes. Diviser seulement le haut, ou le haut par 2 et le bas par 3, ' +
    'change la valeur de la fraction.</li>' +
    '<li><strong>Quand s\'arrêter ?</strong> Quand le seul diviseur commun est 1. La fraction ' +
    'est alors <strong>irréductible</strong> : on ne peut plus la simplifier. ' +
    '\\( \\frac{3}{4} \\), \\( \\frac{5}{7} \\), \\( \\frac{2}{9} \\) sont irréductibles.</li>' +
    '<li><strong>Petit à petit, ou d\'un coup.</strong> \\( \\frac{12}{18} \\) se simplifie par 2 ' +
    'puis par 3… ou directement par 6, le plus grand des diviseurs communs. Le résultat ' +
    'est le même : \\( \\frac{2}{3} \\). En cas de doute, diviser par un petit nombre et ' +
    'recommencer est une méthode sûre.</li>' +
    '<li><strong>Les critères de divisibilité</strong> aident à trouver un diviseur commun : ' +
    'deux nombres pairs se divisent par 2 ; si la somme des chiffres de chacun est dans ' +
    'la table de 3, on divise par 3 ; deux nombres finissant par 0 ou 5, par 5.</li>' +
    '</ul>',
  board: { boundingbox: [-3.4, 6.2, 11.4, -1.3], keepaspectratio: false, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Simplifier une fraction',
    figures: [{
      legende: '6/8 et 3/4 : la même longueur coloriée.',
      boundingbox: [-1.3, 3.2, 9.3, -0.4],
      keepaspectratio: false,
      largeur: 62, hauteur: 34,
      dessine: function (board) {
        // Une barre = une unité (8 de large), coloriée sur n parts sur d.
        function barre(y, n, d, txt) {
          var w = 8 / d;
          for (var i = 0; i < d; i++) {
            board.create('polygon', [[i * w, y], [(i + 1) * w, y], [(i + 1) * w, y + 1], [i * w, y + 1]], {
              fillColor: i < n ? '#0d9488' : '#ffffff', fillOpacity: i < n ? .55 : 1,
              borders: { strokeColor: '#334155', strokeWidth: 1.2 }, vertices: { visible: false },
              highlight: false, fixed: true
            });
          }
          board.create('text', [-0.35, y + 0.5, txt], {
            anchorX: 'right', anchorY: 'middle', fontSize: 13, cssStyle: 'font-weight:700', fixed: true, highlight: false
          });
        }
        barre(1.8, 6, 8, '6/8');
        barre(0.2, 3, 4, '3/4');
        // La longueur coloriée n'a pas bougé.
        board.create('segment', [[6, -0.2], [6, 3.0]], {
          strokeColor: '#dc2626', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false
        });
      }
    }],
    points: [
      '<b>Simplifier</b> une fraction, c\'est écrire le <b>même nombre</b> avec un ' +
        'numérateur et un dénominateur plus petits.',
      'On <b>divise</b> le numérateur <b>et</b> le dénominateur par un <b>même</b> nombre.',
      'Ce nombre doit diviser les deux : c\'est un <b>diviseur commun</b>.',
      'On recommence tant qu\'on trouve un diviseur commun.',
      'Quand le seul diviseur commun est 1, la fraction est <b>irréductible</b>.',
      'Pour trouver un diviseur commun : deux nombres pairs → ÷ 2 ; ' +
        'deux nombres finissant par 0 ou 5 → ÷ 5 ; sommes des chiffres dans la table de 3 → ÷ 3.'
    ],
    exemples: [
      '\\( \\dfrac{6}{8} = \\dfrac{6 \\div 2}{8 \\div 2} = \\dfrac{3}{4} \\)',
      '\\( \\dfrac{12}{18} = \\dfrac{12 \\div 2}{18 \\div 2} = \\dfrac{6}{9} = ' +
        '\\dfrac{6 \\div 3}{9 \\div 3} = \\dfrac{2}{3} \\) — ou d\'un coup : ÷ 6.',
      '\\( \\dfrac{5}{7} \\) est irréductible : 5 et 7 n\'ont que 1 comme diviseur commun.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var a = 6, b = 8;
    var B_MAX = 20;                // dénominateur ≤ 20 : les parts restent lisibles
    var MAX_BARS = 5;              // 16/16 : ÷2 quatre fois → 5 barres

    var PLEIN = '#0d9488', VIDE = '#eef2f7', TRAIT = '#334155';
    var ACCENT = '#2563eb', TAG = '#7c3aed', GROUPE = '#7c3aed';

    var X0 = 0, W = 10;            // barre = une unité, largeur W
    var H = 1.15, GAP = 0.65;      // hauteur d'une barre, espace entre deux
    var Y_TOP = 5.0;               // haut de la première barre

    // La chaîne des étapes : [{ a, b, d }], d = diviseur qui a mené ICI
    // (absent pour la première). Recalculée à chaque saisie.
    var chaine = [];

    // Avancement, en nombre d'étapes jouées :
    //   0            : la barre de départ seule
    //   2k+1         : on cherche un diviseur commun à la fraction n° k
    //   2k+2         : on a divisé — regroupement sur la barre k, barre k+1 visible
    //   2n+1 (final) : plus de diviseur commun, la fraction n° n est irréductible
    // Et `q` (0 → 1) : la barre en train d'apparaître se remplit progressivement.
    var prog = 0, q = 1;

    function pgcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
    function diviseurs(n) {
      var out = [];
      for (var d = 1; d <= n; d++) if (n % d === 0) out.push(d);
      return out;
    }
    function communs(x, y) {
      return diviseurs(x).filter(function (d) { return y % d === 0; });
    }
    // Le plus petit diviseur commun autre que 1 (c'est forcément un nombre premier).
    function plusPetitCommun(x, y) {
      var c = communs(x, y);
      return c.length > 1 ? c[1] : 1;
    }

    function calculeChaine() {
      chaine = [{ a: a, b: b }];
      var x = a, y = b;
      while (chaine.length < MAX_BARS) {
        var d = plusPetitCommun(x, y);
        if (d === 1) break;
        x /= d; y /= d;
        chaine.push({ a: x, b: y, d: d });
      }
    }
    function nDiv() { return chaine.length - 1; }         // nombre de divisions
    function progMax() { return 2 * nDiv() + 1; }

    function yTop(k) { return Y_TOP - k * (H + GAP); }
    function yBot(k) { return yTop(k) - H; }
    function midY(k) { return yTop(k) - H / 2; }
    function xFill() { return X0 + (a / b) * W; }        // bord du coloriage (commun)

    // La barre k est-elle visible ? La barre 0 toujours ; la barre k+1 dès que
    // la division n° k est jouée (prog ≥ 2k+2).
    function barreVisible(k) { return k === 0 || prog >= 2 * k; }
    // Fraction de la barre k déjà « apparue » (1 sauf pour celle qui s'anime).
    function barreQ(k) { return (k > 0 && prog === 2 * k) ? q : 1; }
    // Le regroupement sur la barre k est dessiné dès que la division k est jouée.
    function groupeVisible(k) { return k < nDiv() && prog >= 2 * k + 2; }

    /* ==================================================================== */
    /* Les parts : un pool fixe de courbes par barre                        */
    /* ==================================================================== */
    for (var r = 0; r < MAX_BARS; r++) {
      for (var i = 0; i < B_MAX; i++) {
        (function (k, idx) {
          var cell = board.create('curve', [[], []], {
            strokeColor: TRAIT, strokeWidth: 1,
            fillColor: function () {
              var st = chaine[k];
              if (!st) return VIDE;
              // pendant l'apparition, les parts coloriées viennent une à une
              return idx < Math.floor(st.a * barreQ(k) + 1e-9) ? PLEIN : VIDE;
            },
            fillOpacity: 0.9, highlight: false, fixed: true
          });
          cell.updateDataArray = function () {
            var st = chaine[k];
            if (!st || !barreVisible(k) || idx >= st.b) { this.dataX = []; this.dataY = []; return; }
            var xL = X0 + idx * W / st.b, xR = X0 + (idx + 1) * W / st.b;
            this.dataX = [xL, xR, xR, xL, xL];
            this.dataY = [yBot(k), yBot(k), yTop(k), yTop(k), yBot(k)];
          };
        })(r, i);
      }
    }

    /* Le regroupement : des traits épais tous les d parts, sur la barre k.
       Un seul tracé par barre, les NaN lèvent le crayon entre deux traits. */
    for (var g = 0; g < MAX_BARS; g++) {
      (function (k) {
        var grp = board.create('curve', [[], []], {
          strokeColor: GROUPE, strokeWidth: 4, fixed: true, highlight: false, layer: 7
        });
        grp.updateDataArray = function () {
          this.dataX = []; this.dataY = [];
          if (!groupeVisible(k)) return;
          var st = chaine[k], d = chaine[k + 1].d;
          for (var j = 0; j <= st.b; j += d) {
            var x = X0 + j * W / st.b;
            this.dataX.push(x, x, NaN);
            this.dataY.push(yBot(k) - 0.12, yTop(k) + 0.12, NaN);
          }
        };
      })(g);
    }

    /* ==================================================================== */
    /* Ligne pointillée : la longueur coloriée ne bouge pas                 */
    /* ==================================================================== */
    var guide = board.create('curve', [[], []],
      { strokeColor: ACCENT, strokeWidth: 2, dash: 2, fixed: true, highlight: false, layer: 8 });
    guide.updateDataArray = function () {
      var k = derniereBarre();
      if (k === 0 || a === 0) { this.dataX = []; this.dataY = []; return; }
      var x = xFill();
      this.dataX = [x, x];
      this.dataY = [yTop(0) + 0.3, yBot(k) - 0.3];
    };
    // L'indice de la dernière barre visible.
    function derniereBarre() {
      var k = 0;
      while (k + 1 < chaine.length && barreVisible(k + 1)) k++;
      return k;
    }
    board.create('text', [xFill, function () { return yTop(0) + 0.55; },
      function () { return derniereBarre() > 0 && a > 0 && a < b ? 'même longueur coloriée' : ''; }],
      { anchorX: 'middle', fontSize: 12, color: ACCENT, cssStyle: 'font-weight:700',
        fixed: true, highlight: false });

    /* ==================================================================== */
    /* Étiquettes : la fraction de chaque barre, et « ÷ d » entre deux       */
    /* ==================================================================== */
    for (var e = 0; e < MAX_BARS; e++) {
      (function (k) {
        board.create('text', [-1.6, function () { return midY(k); },
          function () {
            var st = chaine[k];
            return st && barreVisible(k) ? st.a + '/' + st.b : '';
          }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 22,
            cssStyle: 'font-weight:800', color: '#1e293b', fixed: true, highlight: false });
        board.create('text', [-1.6, function () { return yBot(k) - GAP / 2; },
          function () {
            var st = chaine[k + 1];
            return st && barreVisible(k + 1) ? '÷' + st.d : '';
          }],
          { anchorX: 'middle', anchorY: 'middle', fontSize: 15,
            cssStyle: 'font-weight:700', color: TAG, fixed: true, highlight: false });
        // « irréductible » en face de la dernière barre, quand c'est prouvé
        board.create('text', [X0 + W + 0.35, function () { return midY(k); },
          function () {
            return (k === nDiv() && prog >= progMax()) ? 'irréductible' : '';
          }],
          { anchorX: 'left', anchorY: 'middle', fontSize: 13, color: PLEIN,
            cssStyle: 'font-weight:800', fixed: true, highlight: false });
      })(e);
    }
    board.create('text', [X0 + W + 0.35, function () { return midY(0); },
      function () { return prog >= progMax() && nDiv() === 0 ? '' : 'l\'unité'; }],
      { anchorX: 'left', anchorY: 'middle', fontSize: 12, color: '#94a3b8',
        fixed: true, highlight: false });

    // La fenêtre suit le nombre de barres : deux barres n'ont pas besoin de la
    // place de cinq.
    function cadre() {
      var bas = yBot(nDiv()) - 0.9;
      board.setBoundingBox([-3.4, Y_TOP + 1.2, 11.4, bas], false);
    }

    /* ==================================================================== */
    /* Saisie de la fraction                                                */
    /* ==================================================================== */
    var form = document.createElement('div');
    form.className = 'frac-entry';
    form.innerHTML =
      '<label>Numérateur <input class="frac-a" type="number" min="1" max="' + B_MAX + '" step="1"></label>' +
      '<span class="frac-bar">/</span>' +
      '<label>Dénominateur <input class="frac-b" type="number" min="1" max="' + B_MAX + '" step="1"></label>' +
      '<span class="frac-msg"></span>';
    mv.extras.appendChild(form);
    var inA = form.querySelector('.frac-a');
    var inB = form.querySelector('.frac-b');
    var msg = form.querySelector('.frac-msg');

    // Quelques fractions toutes prêtes : une par cas de figure.
    var EXEMPLES = [[6, 8], [12, 18], [10, 15], [8, 16], [16, 20], [5, 7]];
    var pick = document.createElement('div');
    pick.className = 'fx-pick';
    EXEMPLES.forEach(function (ex) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = ex[0] + '/' + ex[1];
      btn.dataset.a = ex[0]; btn.dataset.b = ex[1];
      btn.onclick = function () { a = ex[0]; b = ex[1]; syncInputs(); msg.textContent = ''; play(); };
      pick.appendChild(btn);
    });
    mv.extras.appendChild(pick);

    /* ==================================================================== */
    /* Panneau : le raisonnement, étape par étape                           */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel simp-panel';
    mv.extras.appendChild(panel);

    function frac(n, d) { return '\\( \\frac{' + n + '}{' + d + '} \\)'; }
    function fracDiv(n, d, k) { return '\\( \\frac{' + n + '\\div ' + k + '}{' + d + '\\div ' + k + '} \\)'; }
    function liste(t) { return t.join(', '); }

    // Les diviseurs de x et de y, ceux en commun mis en valeur.
    function blocDiviseurs(x, y) {
      var c = communs(x, y);
      function ligne(n) {
        return '<div class="calc-line simp-div">Diviseurs de <b>' + n + '</b> : ' +
          diviseurs(n).map(function (d) {
            return c.indexOf(d) >= 0 && d > 1 ? '<span class="simp-commun">' + d + '</span>' : String(d);
          }).join(', ') + '</div>';
      }
      return ligne(x) + ligne(y);
    }

    var lastPanel = '';
    function render() {
      var n = nDiv(), h = '';
      var st0 = chaine[0];

      h += '<div class="props-label">La fraction de départ</div>' +
           '<div class="calc-result">' + frac(st0.a, st0.b) + '</div>';

      // Les divisions déjà jouées, dans l'ordre.
      for (var k = 0; k < n; k++) {
        var st = chaine[k], nx = chaine[k + 1];
        if (prog < 2 * k + 1) break;
        h += '<div class="props-label">Étape ' + (k + 1) + ' — un diviseur commun ?</div>' +
             blocDiviseurs(st.a, st.b);
        var c = communs(st.a, st.b);
        h += '<div class="calc-line">En commun (à part 1) : <b>' +
             liste(c.slice(1)) + '</b>. On divise par le plus petit, <b>' + nx.d + '</b>.</div>';
        if (prog < 2 * k + 2) break;
        h += '<div class="calc-line simp-egal">' + frac(st.a, st.b) + ' = ' +
             fracDiv(st.a, st.b, nx.d) + ' = ' + frac(nx.a, nx.b) + '</div>' +
             '<div class="calc-line">Sur la barre : les parts sont regroupées <b>' + nx.d +
             ' par ' + nx.d + '</b>. La longueur coloriée est la même — c\'est le même nombre.</div>';
      }

      // Le verdict : plus de diviseur commun.
      if (prog >= progMax()) {
        var fin = chaine[n];
        h += '<div class="props-label">' + (n ? 'Peut-on continuer ?' : 'Un diviseur commun ?') + '</div>' +
             blocDiviseurs(fin.a, fin.b) +
             '<div class="calc-line">En commun : <b>seulement 1</b>. On ne peut plus diviser : ' +
             frac(fin.a, fin.b) + ' est <b>irréductible</b>.</div>';
        h += '<div class="props-label">Résumé</div>';
        if (n === 0) {
          h += '<div class="calc-result">' + frac(fin.a, fin.b) + ' est déjà irréductible</div>';
        } else {
          h += '<div class="calc-result">' + frac(st0.a, st0.b) + ' = ' + frac(fin.a, fin.b) + '</div>';
          if (n > 1) {
            var g = pgcd(st0.a, st0.b);
            h += '<div class="calc-line">Plus court : ' + chaine.slice(1).map(function (s) { return '÷' + s.d; }).join(' puis ') +
                 ', c\'est diviser d\'un coup par <b>' + g + '</b>, le plus grand des diviseurs communs : ' +
                 frac(st0.a, st0.b) + ' = ' + fracDiv(st0.a, st0.b, g) + ' = ' + frac(fin.a, fin.b) + '.</div>';
          }
        }
      } else if (prog === 0) {
        h += '<div class="calc-line simp-hint">Lance l\'animation : on cherche un nombre qui divise ' +
             'le numérateur <b>et</b> le dénominateur.</div>';
      }

      if (h !== lastPanel) {
        lastPanel = h;
        panel.innerHTML = h;
        mv.typeset();               // le panneau contient du LaTeX \frac{}{}
      }
    }

    /* ==================================================================== */
    /* Saisie : garde-fous                                                  */
    /* ==================================================================== */
    function syncInputs() { inA.value = a; inB.value = b; }

    function clampFromInputs() {
      var na = parseInt(inA.value, 10);
      var nb = parseInt(inB.value, 10);
      var note = '';
      if (isNaN(nb)) nb = b;
      if (nb < 1) nb = 1;
      if (nb > B_MAX) { nb = B_MAX; note = 'Dénominateur limité à ' + B_MAX + ' (parts lisibles).'; }
      if (isNaN(na)) na = a;
      if (na < 1) na = 1;               // 0/8 n'a rien à simplifier
      if (na > nb) { na = nb; note = 'Pour cette illustration, le numérateur reste ≤ dénominateur (fraction ≤ 1).'; }
      a = na; b = nb;
      msg.textContent = note;
    }

    inA.oninput = function () { clampFromInputs(); play(); };
    inB.oninput = function () { clampFromInputs(); play(); };
    inA.onchange = function () { clampFromInputs(); syncInputs(); play(); };
    inB.onchange = function () { clampFromInputs(); syncInputs(); play(); };

    /* ==================================================================== */
    /* Animation : chercher → diviser → … → irréductible                    */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function refresh() { board.update(); render(); }

    function reset() { prog = 0; q = 1; refresh(); }

    // Chaque étape règle un état ABSOLU (prog), jamais un incrément.
    function etapes() {
      var S = [], n = nDiv();
      for (var k = 0; k < n; k++) {
        (function (k) {
          S.push({ dur: 500, step: function () { prog = 2 * k + 1; q = 1; },
                   after: function () { refresh(); } });
          S.push({ dur: 1200, step: function (p) { prog = 2 * k + 2; q = p; },
                   after: function () { q = 1; refresh(); } });
        })(k);
      }
      S.push({ dur: 400, step: function () { prog = progMax(); q = 1; },
               after: function () { refresh(); } });
      return S;
    }

    function play() {
      anim.cancel();
      calculeChaine();
      cadre();
      reset();
      anim.runSteps(etapes(), reset);
    }
    function tout() {
      anim.cancel();
      calculeChaine();
      cadre();
      prog = progMax(); q = 1;
      refresh();
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout }
    ]);

    board.on('update', function () { render(); });

    // Démarrage : 6/8.
    syncInputs();
    play();
  }
});
