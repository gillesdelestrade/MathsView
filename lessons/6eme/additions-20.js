/*
 * Les additions jusqu'à 20 (6ème) — et surtout : le passage de la dizaine.
 *
 * 8 + 5 ne se compte pas sur les doigts : on COMPLÈTE À 10, puis on ajoute ce
 * qui reste. La figure ne fait rien d'autre que rendre ce geste visible, avec
 * deux boîtes de dix cases :
 *
 *      8 + 5   →   il manque 2 pour remplir la première boîte
 *              →   on y met 2 des 5 jetons : la boîte est pleine, c'est 10
 *              →   les 3 jetons restants vont dans la deuxième boîte
 *              →   10 + 3 = 13
 *
 * Une boîte pleine se lit d'un coup d'œil, sans compter : c'est tout l'intérêt
 * du cadre de dix. Les jetons ajoutés sont d'une autre couleur que ceux du
 * départ, et ceux qui servent à compléter la dizaine changent encore de teinte
 * — on voit ainsi les 5 se couper en 2 + 3 sans qu'on ait à l'expliquer.
 *
 * La droite graduée, en dessous, raconte la même chose en deux sauts : de 8 on
 * bondit à 10, puis de 10 à 13. C'est la même stratégie, écrite autrement.
 *
 * Quand il n'y a pas de dizaine à franchir (3 + 4), la figure le dit et ne
 * fabrique pas d'étape inutile : la première boîte suffit.
 */
MathsView.register({
  id: 'additions-20',
  title: 'Les additions jusqu\'à 20',
  level: '6eme',
  category: 'calcul',
  subcategory: 'Calcul mental',
  exercices: ['additions-20'],
  theme: 'Calcul mental — additions jusqu\'à 20 et passage de la dizaine',
  description:
    'Pour calculer \\(8+5\\), on ne compte pas sur ses doigts : on ' +
    '<strong>complète d\'abord à 10</strong>, puis on ajoute ce qui reste.' +
    '<br>Les deux <strong>boîtes de dix</strong> le montrent : il manque ' +
    '<strong>2</strong> pour remplir la première, donc on coupe les 5 en ' +
    '<strong>2 + 3</strong>. La boîte pleine vaut 10, et il reste 3 : ' +
    '\\(10+3=13\\).' +
    '<br>Une boîte pleine se reconnaît <strong>sans compter</strong> — c\'est ' +
    'justement à ça qu\'elle sert.' +
    '<br>Bouge les deux curseurs, puis clique sur <strong>▶ Animer</strong> ' +
    '(ou coche <strong>Pas à pas</strong>) pour voir le calcul se faire.',
  notes:
    '<ul>' +
    '<li><strong>Le complément à 10.</strong> C\'est la première chose à savoir par ' +
    'cœur : 1+9, 2+8, 3+7, 4+6, 5+5. Tout le reste en découle.</li>' +
    '<li><strong>Passer par 10.</strong> Pour \\(8+5\\) : il manque 2 à 8 pour faire 10, ' +
    'donc \\(8+5 = 8+2+3 = 10+3 = 13\\). On coupe le deuxième nombre en deux morceaux, ' +
    'et jamais le premier.</li>' +
    '<li><strong>Pourquoi ça marche.</strong> Additionner, c\'est réunir : on peut ' +
    'regrouper les nombres dans l\'ordre qu\'on veut. \\(8+(2+3)\\) et \\((8+2)+3\\) ' +
    'donnent le même total.</li>' +
    '<li><strong>Les doubles.</strong> \\(7+7=14\\), \\(8+8=16\\), \\(9+9=18\\) : ils ' +
    's\'apprennent tels quels, et ils dépannent souvent. \\(7+8\\), c\'est ' +
    '\\(7+7+1 = 15\\) : un double, plus un.</li>' +
    '<li><strong>L\'ordre ne change rien</strong> : \\(3+9 = 9+3\\). Il vaut mieux ' +
    'commencer par le plus grand — on a moins de chemin à faire.</li>' +
    '<li><strong>Une boîte pleine ne se compte pas.</strong> On la <em>reconnaît</em>. ' +
    'C\'est ce qui distingue le calcul du comptage, et c\'est ce qui permet ensuite ' +
    'd\'aller vite.</li>' +
    '<li><strong>Et après ?</strong> La même stratégie servira pour \\(48+5\\) ' +
    '(compléter à 50), pour \\(0{,}8+0{,}5\\), et pour toutes les additions posées : ' +
    'la retenue, c\'est exactement cette boîte qui déborde.</li>' +
    '</ul>',
  board: {
    boundingbox: [-11, 8.2, 11, -8.2], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_A    = '#2563eb';   // bleu : les jetons du départ
    var C_COMP = '#f59e0b';   // orange : ceux qui complètent la dizaine
    var C_RESTE = '#dc2626';  // rouge : ceux qui débordent dans la 2e boîte
    var C_PLEIN = '#16a34a';  // vert : une boîte pleine
    var INK    = '#334155';
    var SOFT   = '#94a3b8';

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var a = 8, b = 5;
    // Avancement des cinq étapes (1 = acquise).
    var rv = { pose: 1, manque: 1, complete: 1, reste: 1, lire: 1 };
    var ORDRE = ['pose', 'manque', 'complete', 'reste', 'lire'];
    function etape() {
      var e = -1;
      ORDRE.forEach(function (k, i) { if (rv[k] > 0.05) e = i; });
      return e;
    }

    function manque() { return Math.max(0, 10 - a); }          // pour remplir la 1re boîte
    function pris() { return Math.min(b, manque()); }          // ce qu'on y met
    function reste() { return b - pris(); }                    // ce qui déborde
    function franchit() { return a + b > 10; }                 // la 2e boîte sert-elle ?
    // Quand le premier nombre vaut déjà 10, il n'y a rien à compléter : la
    // boîte est pleine d'entrée, et tout le reste va dans la seconde.
    function aCompleter() { return franchit() && manque() > 0; }
    function total() { return a + b; }

    function attr(o, k, v) {
      if (!o._mv) o._mv = {};
      if (o._mv[k] !== v) { o._mv[k] = v; var t = {}; t[k] = v; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }

    /* ==================================================================== */
    /* Les deux boîtes de dix                                               */
    /*                                                                       */
    /* Cinq cases par rangée, deux rangées : c'est cette disposition qui       */
    /* permet de reconnaître une quantité sans la compter.                    */
    /* ==================================================================== */
    var CASE = 1.05, YB = 5.9;
    var BX = [-6.4, 0.9];                 // abscisse du coin gauche de chaque boîte

    function caseXY(boite, n) {            // n = 0..9, rangée du haut d'abord
      var li = Math.floor(n / 5), co = n % 5;
      return [BX[boite] + co * CASE + CASE / 2, YB - li * CASE - CASE / 2];
    }

    [0, 1].forEach(function (boite) {
      for (var n = 0; n <= 10; n++) {
        (function (n) {
          if (n <= 5) {                    // les traits verticaux
            board.create('segment', [[BX[boite] + n * CASE, YB],
                                     [BX[boite] + n * CASE, YB - 2 * CASE]], {
              strokeColor: '#cbd5e1', strokeWidth: n === 0 || n === 5 ? 2 : 1,
              fixed: true, highlight: false, layer: 4
            });
          }
          if (n <= 2) {                    // les traits horizontaux
            board.create('segment', [[BX[boite], YB - n * CASE],
                                     [BX[boite] + 5 * CASE, YB - n * CASE]], {
              strokeColor: '#cbd5e1', strokeWidth: n === 0 || n === 2 ? 2 : 1,
              fixed: true, highlight: false, layer: 4
            });
          }
        })(n);
      }
    });

    // Le cadre vert d'une boîte pleine : on la reconnaît sans la compter.
    var cadres = [0, 1].map(function (boite) {
      return board.create('curve', [
        [BX[boite], BX[boite] + 5 * CASE, BX[boite] + 5 * CASE, BX[boite], BX[boite]],
        [YB, YB, YB - 2 * CASE, YB - 2 * CASE, YB]
      ], { strokeColor: C_PLEIN, strokeWidth: 4, fixed: true, highlight: false,
           visible: false, layer: 6 });
    });
    var etiqPleine = board.create('text', [BX[0] + 2.5 * CASE, YB + 0.5, 'pleine : 10'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: C_PLEIN,
      cssStyle: 'font-weight:800', fixed: true, highlight: false, visible: false, layer: 7
    });

    /* Les vingt jetons ------------------------------------------------------ */
    var jetons = [];
    [0, 1].forEach(function (boite) {
      for (var n = 0; n < 10; n++) {
        (function (boite, n) {
          var xy = caseXY(boite, n);
          jetons.push({
            rang: boite * 10 + n,          // sa position parmi les vingt
            p: board.create('point', [xy[0], xy[1]], {
              size: 9, face: 'o', fillColor: C_A, strokeColor: '#fff', strokeWidth: 2,
              fixed: true, withLabel: false, showInfobox: false, highlight: false,
              visible: false, layer: 8
            })
          });
        })(boite, n);
      }
    });

    // Les cases qu'il reste à remplir dans la première boîte : en pointillé.
    var trous = [];
    for (var t = 0; t < 10; t++) {
      (function (t) {
        var xy = caseXY(0, t);
        trous.push({ n: t, p: board.create('point', [xy[0], xy[1]], {
          size: 9, face: 'o', fillColor: '#fff', strokeColor: C_COMP, strokeWidth: 2,
          dash: 2, fixed: true, withLabel: false, showInfobox: false, highlight: false,
          visible: false, layer: 7
        }) });
      })(t);
    }

    /* ==================================================================== */
    /* La droite graduée : le même calcul, en deux sauts                     */
    /* ==================================================================== */
    var YL = -1.4, X0 = -8.6, PAS = 0.86;      // 0 à 20
    function xn(n) { return X0 + n * PAS; }

    board.create('segment', [[xn(0) - 0.5, YL], [xn(20) + 0.5, YL]], {
      strokeColor: INK, strokeWidth: 2, lastArrow: { type: 2, size: 6 },
      fixed: true, highlight: false, layer: 4
    });
    for (var n2 = 0; n2 <= 20; n2++) {
      (function (n2) {
        var gros = n2 % 5 === 0;
        board.create('segment', [[xn(n2), YL - (gros ? 0.22 : 0.12)],
                                 [xn(n2), YL + (gros ? 0.22 : 0.12)]], {
          strokeColor: gros ? INK : SOFT, strokeWidth: gros ? 2 : 1,
          fixed: true, highlight: false, layer: 4
        });
        if (gros || n2 === 10) {
          board.create('text', [xn(n2), YL - 0.62, String(n2)], {
            anchorX: 'middle', anchorY: 'middle', fontSize: 12,
            color: n2 === 10 ? C_PLEIN : SOFT,
            cssStyle: n2 === 10 ? 'font-weight:800' : '', fixed: true,
            highlight: false, layer: 4
          });
        }
      })(n2);
    }

    // Les deux sauts, tracés au fur et à mesure.
    function arc(fde, fvers, hauteur, favance, couleur) {
      return board.create('curve', [
        function (s) { var d = fde(); return xn(d + (fvers() - d) * s * favance()); },
        function (s) { return YL + hauteur * Math.sin(Math.PI * s * favance()); },
        0, 1
      ], { strokeColor: couleur, strokeWidth: 3, lastArrow: { type: 2, size: 7 },
           fixed: true, highlight: false, visible: false, layer: 6 });
    }
    var saut1 = arc(function () { return a; }, function () { return a + pris(); },
      0.9, function () { return rv.complete; }, C_COMP);
    var saut2 = arc(function () { return a + pris(); }, function () { return total(); },
      0.9, function () { return rv.reste; }, C_RESTE);

    var etiqSaut1 = board.create('text', [
      function () { return xn(a + pris() / 2); }, YL + 1.25,
      function () { return '+ ' + pris(); }
    ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: C_COMP,
         cssStyle: 'font-weight:800', fixed: true, highlight: false, visible: false, layer: 7 });
    var etiqSaut2 = board.create('text', [
      function () { return xn(a + pris() + reste() / 2); }, YL + 1.25,
      function () { return '+ ' + reste(); }
    ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: C_RESTE,
         cssStyle: 'font-weight:800', fixed: true, highlight: false, visible: false, layer: 7 });

    var ptDepart = board.create('point', [function () { return xn(a); }, YL], {
      size: 5, fillColor: C_A, strokeColor: '#fff', strokeWidth: 2, fixed: true,
      withLabel: false, showInfobox: false, highlight: false, layer: 8
    });
    var ptFin = board.create('point', [function () { return xn(total()); }, YL], {
      size: 6, fillColor: C_PLEIN, strokeColor: '#fff', strokeWidth: 2, fixed: true,
      withLabel: false, showInfobox: false, highlight: false, visible: false, layer: 8
    });
    var etiqFin = board.create('text', [function () { return xn(total()); }, YL - 1.15,
      function () { return '<b>' + total() + '</b>'; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: C_PLEIN,
      fixed: true, highlight: false, visible: false, layer: 8 });

    /* ==================================================================== */
    /* Le calcul écrit, ligne par ligne                                     */
    /* ==================================================================== */
    board.create('text', [0, 7.5, function () {
      return '<span style="color:' + C_A + '">' + a + '</span> + ' +
             '<span style="color:' + C_RESTE + '">' + b + '</span> = ?';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 24, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 8 });

    board.create('text', [0, 3.0, function () {
      var e = etape();
      if (e < 0) return 'Combien font ' + a + ' + ' + b + ' ?';
      if (!franchit()) {
        return e < 4
          ? 'Ici, pas besoin de deuxième boîte : ' + a + ' + ' + b + ' tient dans la ' +
            'première.'
          : '<b>' + a + ' + ' + b + ' = ' + total() + '</b> — une seule boîte a suffi.';
      }
      if (e === 0) return 'On pose d\'abord les <b style="color:' + C_A + '">' + a +
                          '</b> premiers jetons.';
      if (!aCompleter()) {
        return e < 4
          ? 'La première boîte est <b>déjà pleine</b> : les ' + b +
            ' jetons vont tous dans la deuxième.'
          : '<b>10 + ' + b + ' = ' + total() + '</b>';
      }
      if (e === 1) return 'Il manque <b style="color:' + C_COMP + '">' + manque() +
                          '</b> pour remplir la boîte : c\'est le <b>complément à 10</b>.';
      if (e === 2) return 'On prend <b style="color:' + C_COMP + '">' + pris() +
                          '</b> jetons sur les ' + b + ' : la boîte est <b>pleine</b>.';
      if (e === 3) return 'Il en reste <b style="color:' + C_RESTE + '">' + reste() +
                          '</b> : ils vont dans la deuxième boîte.';
      return '<b>10 + ' + reste() + ' = ' + total() + '</b>';
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: INK,
          fixed: true, highlight: false, layer: 8 });

    board.create('text', [0, 1.7, function () {
      var e = etape();
      if (e < 2 || !aCompleter()) return '';
      var s = '<span style="color:' + C_A + '">' + a + '</span> + <span style="color:' +
        C_RESTE + '">' + b + '</span> = ' + a + ' + (<span style="color:' + C_COMP + '">' +
        pris() + '</span> + <span style="color:' + C_RESTE + '">' + reste() + '</span>)';
      if (e >= 3) s += ' = <b style="color:' + C_PLEIN + '">10</b> + <span style="color:' +
        C_RESTE + '">' + reste() + '</span>';
      if (e >= 4) s += ' = <b>' + total() + '</b>';
      return s;
    }], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, color: INK,
          cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 8 });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function refresh() {
      var e = etape();
      // La première boîte est pleine dès que le total atteint 10 — que ce soit
      // par le complément, ou parce que le premier nombre valait déjà 10.
      var pleine = Math.min(total(), 10) === 10 &&
        (aCompleter() ? rv.complete > 0.9 : rv.pose > 0.5);

      jetons.forEach(function (o) {
        var r = o.rang;
        var vu, couleur;
        if (r < a) { vu = rv.pose > 0.35; couleur = C_A; }
        else if (r < a + pris()) { vu = rv.complete > 0.35; couleur = C_COMP; }
        else if (r < total()) { vu = rv.reste > 0.35; couleur = C_RESTE; }
        else { vu = false; couleur = C_A; }
        // Sans dizaine à franchir, tout arrive d'un coup : on ne fabrique pas
        // d'étapes qui n'existent pas.
        if (!franchit() && r < total()) vu = rv.pose > 0.35 || r < a;
        show(o.p, vu);
        attr(o.p, 'fillColor', couleur);
      });

      // Les cases vides de la première boîte, tant qu'elle n'est pas remplie.
      trous.forEach(function (o) {
        show(o.p, franchit() && rv.manque > 0.35 && rv.complete < 0.35 &&
                  o.n >= a && o.n < 10);
      });

      show(cadres[0], pleine);
      show(etiqPleine, pleine);
      show(cadres[1], false);

      show(saut1, aCompleter() && rv.complete > 0.02);
      show(etiqSaut1, aCompleter() && rv.complete > 0.5);
      show(saut2, franchit() && rv.reste > 0.02);
      show(etiqSaut2, franchit() && rv.reste > 0.5);
      show(ptFin, rv.lire > 0.5 || (!franchit() && rv.pose > 0.9));
      show(etiqFin, rv.lire > 0.5 || (!franchit() && rv.pose > 0.9));
      // Sans complément, les jetons du départ et ceux ajoutés se distinguent
      // quand même : c'est le seul repère qui reste.
    }

    /* ==================================================================== */
    /* Panneau                                                               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function renderPanel() {
      var double = a === b;
      var presque = Math.abs(a - b) === 1;
      panel.innerHTML =
        '<div class="props-name" style="color:' + INK + '">' + a + ' + ' + b +
          ' = ' + total() + '</div>' +
        (!franchit()
          ? '<p style="margin:.3rem 0 .6rem">Pas de dizaine à franchir ici : les ' +
            total() + ' jetons tiennent dans la première boîte. On peut compter ' +
            'directement.</p>'
          : !aCompleter()
          ? '<p style="margin:.3rem 0 .6rem">La première boîte est <b>déjà pleine</b> : ' +
            'rien à compléter. Les ' + b + ' jetons vont dans la deuxième, et on lit ' +
            'directement <b>10 + ' + b + ' = ' + total() + '</b>.</p>'
          : '<p style="margin:.3rem 0 .6rem">Il faut <b>franchir la dizaine</b> : ' +
            'on complète d\'abord ' + a + ' à 10, puis on ajoute ce qui reste.</p>' +
            '<div class="props-label">Le calcul, étape par étape</div>' +
            '<ul class="props-list">' +
              '<li>Il manque <b style="color:' + C_COMP + '">' + manque() +
                '</b> à ' + a + ' pour faire 10.</li>' +
              '<li>On coupe ' + b + ' en <b style="color:' + C_COMP + '">' + pris() +
                '</b> + <b style="color:' + C_RESTE + '">' + reste() + '</b>.</li>' +
              '<li>' + a + ' + ' + pris() + ' = <b style="color:' + C_PLEIN +
                '">10</b> — la boîte est pleine.</li>' +
              '<li>10 + ' + reste() + ' = <b>' + total() + '</b>.</li>' +
            '</ul>') +

        '<div class="props-label">Le complément à 10</div>' +
        '<p style="margin:.2rem 0 .5rem">' +
          [1, 2, 3, 4, 5].map(function (x) {
            var fort = (a === x || a === 10 - x);
            return (fort ? '<b style="color:' + C_COMP + '">' : '<span style="color:' +
              'var(--ink-soft)">') + x + ' + ' + (10 - x) + (fort ? '</b>' : '</span>');
          }).join(' &nbsp;·&nbsp; ') +
        '</p>' +

        (double || presque
          ? '<div class="props-label">Une autre façon de voir</div>' +
            '<p style="margin:.2rem 0 0">' +
              (double
                ? 'C\'est un <b>double</b> : ' + a + ' + ' + a + ' = ' + total() +
                  '. Les doubles s\'apprennent tels quels, ils dépannent souvent.'
                : 'C\'est <b>presque un double</b> : ' + Math.min(a, b) + ' + ' +
                  Math.min(a, b) + ' = ' + (2 * Math.min(a, b)) + ', et il suffit ' +
                  'd\'ajouter 1 → <b>' + total() + '</b>.') +
            '</p>'
          : '<p style="margin:.5rem 0 0;font-size:.9rem;color:var(--ink-soft)">' +
            'Une boîte pleine ne se compte pas : elle se <b>reconnaît</b>. C\'est ' +
            'ce qui fait la différence entre calculer et compter sur ses doigts.</p>');
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Animation                                                             */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function reset() { ORDRE.forEach(function (k) { rv[k] = 0; }); board.update(); }
    function play() {
      reset();
      var durees = [600, 700, 800, 700, 500];
      anim.runSteps(ORDRE.map(function (k, i) {
        return { dur: durees[i], step: function (p) {
          // État absolu : « Précédent » rejoue exactement la même figure.
          ORDRE.forEach(function (c, j) { rv[c] = j < i ? 1 : (j === i ? p : 0); });
        } };
      }), reset);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'slider', id: 'a', label: 'premier nombre', min: 1, max: 10, step: 1,
        value: a, onInput: function (v) { a = v; board.update(); } },
      { type: 'slider', id: 'b', label: 'nombre ajouté', min: 1, max: 10, step: 1,
        value: b, onInput: function (v) { b = v; board.update(); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play }
    ]);

    mv.extras.appendChild(panel);
    board.update();
  }
});
