/*
 * Les fractions (6ème) — une fraction a/b, montrée de trois façons à la fois :
 * en parts (barre ou disque), sur une droite graduée, et en toutes lettres.
 *
 * ---------------------------------------------------------------------------
 * Le point pédagogique
 * ---------------------------------------------------------------------------
 * a/b, c'est « on partage l'unité en b parts égales, et on en prend a ».
 * Quand a > b, une seule unité ne suffit plus : on en dessine plusieurs et on
 * continue à remplir. C'est de là que sort 7/4 = 1 entier + 3/4.
 *
 * ---------------------------------------------------------------------------
 * Le point technique : un pool fixe d'éléments, jamais de création/destruction
 * ---------------------------------------------------------------------------
 * Le nombre de parts change avec b. La tentation serait de détruire puis
 * recréer b éléments à chaque cran de curseur — mauvaise idée : « oninput » se
 * déclenche à chaque pixel de glissement, et board.removeObject() appelé pendant
 * une mise à jour mute la liste que JSXGraph est en train de parcourir.
 *
 * À la place : un pool FIXE de 24 courbes, chacune portant un updateDataArray()
 * qui recalcule sa propre géométrie depuis (a, b, mode), et écrit un tableau
 * vide quand son emplacement ne sert pas. 24 suffit toujours, car le nombre de
 * parts dessinées vaut ceil(a/b)·b ≤ a + b − 1 ≤ 23.
 *
 * Le remplissage est lui aussi déclaratif : JSXGraph évalue les attributs
 * donnés sous forme de fonction, donc « les a premières parts sont pleines »
 * s'écrit littéralement fillColor: () => i < a ? PLEIN : VIDE.
 */
MathsView.register({
  id: 'fractions',
  title: 'Les fractions',
  level: '6eme',
  theme: 'Nombres — partager l\'unité',
  description:
    'Une <strong>fraction</strong> \\( \\frac{a}{b} \\) se lit « a sur b » : on partage ' +
    'l\'unité en <strong>b parts égales</strong> (le <em>dénominateur</em>, qui dit en ' +
    'combien on coupe) et on en prend <strong>a</strong> (le <em>numérateur</em>, qui dit ' +
    'combien on en garde).' +
    '<br><strong>Bouge les deux curseurs</strong> et regarde les parts se remplir, ' +
    'et le point avancer sur la droite graduée.',
  notes:
    '<ul>' +
    '<li>Si \\( a < b \\), la fraction est <strong>plus petite que 1</strong> : ' +
    'une seule unité suffit.</li>' +
    '<li>Si \\( a = b \\), la fraction <strong>vaut 1</strong> : ' +
    '\\( \\frac{4}{4} = 1 \\).</li>' +
    '<li>Si \\( a > b \\), elle est <strong>plus grande que 1</strong> : il faut ' +
    'plusieurs unités, et on peut l\'écrire « entier + reste », par exemple ' +
    '\\( \\frac{7}{4} = 1 + \\frac{3}{4} \\).</li>' +
    '<li>Deux fractions différentes peuvent désigner le <strong>même nombre</strong> : ' +
    '\\( \\frac{6}{4} = \\frac{3}{2} \\). On <em>simplifie</em> en divisant le ' +
    'numérateur et le dénominateur par leur plus grand diviseur commun.</li>' +
    '</ul>' +
    '<p>Essaie \\( \\frac{7}{4} \\), puis \\( \\frac{12}{1} \\), puis \\( \\frac{1}{3} \\) : ' +
    'la dernière ne tombe jamais juste en écriture décimale, c\'est pourquoi le site ' +
    'écrit « ≈ » et non « = ».</p>',
  board: { boundingbox: [-1, 6.5, 11, -2.5], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ---- État réglé par les curseurs ----------------------------------- */
    var a = 3, b = 4, mode = 'barre';

    var A_MAX = 12, B_MAX = 12;
    var MAX_CELLS = 24; // ceil(a/b)·b ≤ a + b − 1 ≤ 23, donc 24 suffit toujours

    /* ---- Disposition, en coordonnées du repère -------------------------- */
    var X0 = 0, W = 10;      // bande horizontale utile
    var TOP = 5.8, BAND = 4.6; // bande des parts
    var NL_Y = -1.0;         // hauteur de la droite graduée

    var PLEIN = '#0d9488', VIDE = '#e2e8f0', TRAIT = '#334155', REPERE = '#2563eb';

    // Nombre d'unités à dessiner : 7/4 en demande 2, 0/5 en demande 1.
    function units() { return Math.max(1, Math.ceil(a / b)); }

    // Position sur la droite graduée : la droite couvre toujours 0 → units().
    function nlX(v) { return X0 + (v / units()) * W; }

    /* ==================================================================== */
    /* Lecture en toutes lettres                                             */
    /* -------------------------------------------------------------------- */
    /* Défini AVANT toute création d'élément : JSXGraph évalue la fonction   */
    /* de contenu d'un texte dès sa création, et le titre appelle lire().    */
    /* ==================================================================== */
    var UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six',
                  'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'];

    // b = 2, 3, 4 sont irréguliers (demi, tiers, quart) ; au-delà c'est régulier.
    // « tiers » est invariable : il finit déjà par un s.
    var DEN_SG = [null, 'entier', 'demi', 'tiers', 'quart', 'cinquième', 'sixième',
                  'septième', 'huitième', 'neuvième', 'dixième', 'onzième', 'douzième'];
    var DEN_PL = [null, 'entiers', 'demis', 'tiers', 'quarts', 'cinquièmes', 'sixièmes',
                  'septièmes', 'huitièmes', 'neuvièmes', 'dixièmes', 'onzièmes', 'douzièmes'];

    // Pluriel dès 2 : « zéro quart », « un quart », mais « deux quarts ».
    function lire(n, d) {
      if (n === 0) return 'zéro';
      return UNITES[n] + ' ' + (n >= 2 ? DEN_PL[d] : DEN_SG[d]);
    }

    /* ==================================================================== */
    /* Les parts : un pool fixe de courbes                                  */
    /* ==================================================================== */
    function barMetrics() {
      var step = Math.min(1.0, BAND / units());
      return { step: step, h: step * 0.82 };
    }

    function discMetrics() {
      var U = units();
      var cols = Math.min(U, 4), rows = Math.ceil(U / cols);
      var cw = W / cols, ch = BAND / rows;
      return { cols: cols, cw: cw, ch: ch, r: 0.42 * Math.min(cw, ch) };
    }

    for (var i = 0; i < MAX_CELLS; i++) {
      (function (idx) {
        var cell = board.create('curve', [[], []], {
          strokeColor: TRAIT,
          strokeWidth: 1.2,
          fillColor: function () { return idx < a ? PLEIN : VIDE; },
          fillOpacity: 0.85,
          highlight: false,
          fixed: true
        });

        cell.updateDataArray = function () {
          var U = units(), u = Math.floor(idx / b), k = idx % b;
          if (u >= U) { this.dataX = []; this.dataY = []; return; } // emplacement inutilisé

          if (mode === 'barre') {
            var m = barMetrics();
            var yTop = TOP - u * m.step, yBot = yTop - m.h;
            // Toutes les rangées ont la même largeur : sinon « 7/4 = 1 + 3/4 »
            // n'est pas lisible.
            var xL = X0 + k * W / b, xR = X0 + (k + 1) * W / b;
            this.dataX = [xL, xR, xR, xL, xL];
            this.dataY = [yBot, yBot, yTop, yTop, yBot];
          } else {
            var d = discMetrics();
            var cx = X0 + (u % d.cols + 0.5) * d.cw;
            var cy = TOP - (Math.floor(u / d.cols) + 0.5) * d.ch;
            // Départ à midi, sens horaire : comme on coupe un camembert.
            var t0 = Math.PI / 2 - 2 * Math.PI * k / b;
            var t1 = Math.PI / 2 - 2 * Math.PI * (k + 1) / b;
            var n = Math.max(2, Math.ceil(Math.abs(t1 - t0) / (Math.PI / 36)));
            var X = [cx], Y = [cy];
            for (var s = 0; s <= n; s++) {
              var t = t0 + (t1 - t0) * s / n;
              X.push(cx + d.r * Math.cos(t));
              Y.push(cy + d.r * Math.sin(t));
            }
            X.push(cx); Y.push(cy);
            this.dataX = X; this.dataY = Y;
          }
        };
      })(i);
    }

    /* ==================================================================== */
    /* La droite graduée                                                     */
    /* ==================================================================== */
    board.create('arrow', [[X0 - 0.3, NL_Y], [X0 + W + 0.5, NL_Y]],
      { strokeColor: TRAIT, strokeWidth: 2, fixed: true, highlight: false });

    // Graduations : une seule courbe, les NaN séparant les traits. Le nombre de
    // traits peut donc varier librement sans créer ni détruire d'élément.
    var majeures = board.create('curve', [[], []],
      { strokeColor: TRAIT, strokeWidth: 2, fixed: true, highlight: false });
    majeures.updateDataArray = function () {
      var U = units(), X = [], Y = [];
      for (var u = 0; u <= U; u++) {
        X.push(nlX(u), nlX(u), NaN);
        Y.push(NL_Y - 0.28, NL_Y + 0.28, NaN);
      }
      this.dataX = X; this.dataY = Y;
    };

    var mineures = board.create('curve', [[], []],
      { strokeColor: '#94a3b8', strokeWidth: 1, fixed: true, highlight: false });
    mineures.updateDataArray = function () {
      var U = units(), X = [], Y = [], lo = 0, hi = U * b;
      // Garde de densité : 12/12 ferait 144 graduations à 4 px l'une de l'autre.
      // Au-delà de 48, on ne subdivise que l'unité où se trouve a/b.
      if (U * b > 48) { lo = Math.floor(a / b) * b; hi = lo + b; }
      for (var k = lo; k <= hi; k++) {
        if (k % b === 0) continue;              // déjà une graduation principale
        X.push(nlX(k / b), nlX(k / b), NaN);
        Y.push(NL_Y - 0.15, NL_Y + 0.15, NaN);
      }
      this.dataX = X; this.dataY = Y;
    };

    // Étiquettes des entiers : pool fixe, masquées en renvoyant une chaîne vide.
    for (var u = 0; u <= A_MAX; u++) {
      (function (n) {
        board.create('text', [
          function () { return nlX(n); },
          NL_Y - 0.78,
          function () { return n <= units() ? String(n) : ''; }
        ], { fontSize: 13, color: '#475569', anchorX: 'middle', fixed: true, highlight: false });
      })(u);
    }

    // Le chemin parcouru de 0 à a/b. On passe par updateDataArray : avec deux
    // fonctions, board.create('curve', [fx, fy]) serait interprété comme une
    // courbe PARAMÉTRIQUE (fx(t), fy(t) attendus numériques), pas comme des
    // données — et le segment ne s'afficherait pas.
    var chemin = board.create('curve', [[], []],
      { strokeColor: REPERE, strokeWidth: 5, fixed: true, highlight: false });
    chemin.updateDataArray = function () {
      this.dataX = [X0, nlX(a / b)];
      this.dataY = [NL_Y, NL_Y];
    };

    board.create('point', [function () { return nlX(a / b); }, NL_Y],
      { name: '', size: 4, color: REPERE, fixed: true, highlight: false, withLabel: false });

    board.create('text', [
      function () { return nlX(a / b); }, NL_Y + 0.42,
      function () { return a + '/' + b; }
    ], { fontSize: 15, cssStyle: 'font-weight:700', color: REPERE, anchorX: 'middle', fixed: true });

    // Titre : la fraction et sa lecture, au-dessus des parts.
    board.create('text', [X0, 6.15, function () { return a + '/' + b + '  —  ' + lire(a, b); }],
      { fontSize: 18, cssStyle: 'font-weight:700', color: '#1e293b', fixed: true });

    function pgcd(x, y) {
      x = Math.abs(x); y = Math.abs(y);
      while (y) { var t = y; y = x % y; x = t; }
      return x;                                   // pgcd(0, b) = b
    }

    function reduite(n, d) {
      if (n === 0) return { n: 0, d: 1, g: d };
      var g = pgcd(n, d);
      return { n: n / g, d: d / g, g: g };
    }

    function mixte(n, d) {
      var q = Math.floor(n / d);
      return { q: q, r: n - q * d };
    }

    // Le développement décimal est fini ssi, une fois la fraction réduite, le
    // dénominateur ne contient plus que des 2 et des 5. Sinon on écrit « ≈ »
    // plutôt que de raconter que 1/3 = 0,3333.
    function decimalExact(d) {
      while (d % 2 === 0) d /= 2;
      while (d % 5 === 0) d /= 5;
      return d === 1;
    }

    function fr(x) { return String(x).replace('.', ','); }

    /* ==================================================================== */
    /* Panneau de résultats                                                  */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function frac(n, d) { return '\\( \\frac{' + n + '}{' + d + '} \\)'; }

    function render() {
      var red = reduite(a, b), mix = mixte(a, b), val = a / b;
      var html = '';

      html += '<div class="props-label">On lit</div>' +
              '<div class="calc-result">' + lire(a, b) + '</div>';

      // Comparaison à 1 : c'est tout l'intérêt du dessin à plusieurs unités.
      html += '<div class="calc-line">' + frac(a, b) + ' est ' +
        (a < b ? '<b>plus petite que 1</b> : une seule unité suffit.'
               : a === b ? '<b>égale à 1</b> : l\'unité est exactement remplie.'
                         : '<b>plus grande que 1</b> : il faut ' + units() + ' unités.') +
        '</div>';

      html += '<div class="props-label">Écriture décimale</div>' +
              '<div class="calc-line">' + frac(a, b) + ' = ' + a + ' ÷ ' + b + ' ' +
              (decimalExact(red.d) ? '=' : '≈') + ' <b>' +
              fr(decimalExact(red.d) ? val : val.toFixed(4)) + '</b></div>';

      html += '<div class="props-label">Fraction irréductible</div>';
      if (a === 0) {
        html += '<div class="calc-line">' + frac(0, b) + ' = <b>0</b> : ' +
                'on ne prend aucune part.</div>';
      } else if (red.g === 1) {
        html += '<div class="calc-line">' + frac(a, b) + ' est <b>déjà irréductible</b> : ' +
                a + ' et ' + b + ' n\'ont aucun diviseur commun (à part 1).</div>';
      } else {
        html += '<div class="calc-line">On divise les deux termes par leur plus grand ' +
                'diviseur commun, <b>' + red.g + '</b> : ' +
                frac(a, b) + ' = ' + frac(red.n, red.d) +
                (red.d === 1 ? ' = <b>' + red.n + '</b>, c\'est un nombre entier.' : '') +
                '</div>';
      }

      if (a > b) {
        html += '<div class="props-label">Entier + reste</div>';
        html += mix.r === 0
          ? '<div class="calc-line">' + frac(a, b) + ' = <b>' + mix.q + '</b> : ' +
            mix.q + ' unités exactement remplies.</div>'
          : '<div class="calc-line">' + frac(a, b) + ' = <b>' + mix.q + '</b> + ' +
            frac(mix.r, b) + ' : ' + mix.q + (mix.q > 1 ? ' unités remplies' : ' unité remplie') +
            ', puis ' + lire(mix.r, b) + '.</div>';
      }

      panel.innerHTML = html;
      mv.typeset();   // le panneau contient du LaTeX \frac{}{}
    }

    /* ==================================================================== */
    /* Curseurs                                                              */
    /* ==================================================================== */
    // Garde anti-répétition : « oninput » se déclenche à chaque pixel de
    // glissement, même quand la valeur entière n'a pas bougé. Sans ce test, on
    // relancerait MathJax des dizaines de fois par seconde.
    var lastA = null, lastB = null, lastMode = null;
    function refresh() {
      if (a === lastA && b === lastB && mode === lastMode) return;
      lastA = a; lastB = b; lastMode = mode;
      board.update();   // déclenche tous les updateDataArray
      render();
    }

    mv.addControls([
      { type: 'slider', id: 'a', label: 'numérateur a', min: 0, max: A_MAX, step: 1, value: a,
        onInput: function (v) { a = v; refresh(); } },
      { type: 'slider', id: 'b', label: 'dénominateur b', min: 1, max: B_MAX, step: 1, value: b,
        onInput: function (v) { b = v; refresh(); } },
      { type: 'checkbox', id: 'disque', label: 'Voir en disque (camembert)', checked: false,
        onChange: function (on) { mode = on ? 'disque' : 'barre'; refresh(); } }
    ]);

    board.update();
    render();
  }
});
