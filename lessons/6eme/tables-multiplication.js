/*
 * Les tables de multiplication jusqu'à 10 (6ème).
 *
 * Une table de multiplication n'est pas une liste à réciter : c'est un
 * RECTANGLE. 7 × 3, ce sont 7 lignes de 3 points, et le résultat est le nombre
 * de points. La figure met les deux côte à côte — la case de la table de
 * Pythagore à gauche, le rectangle de points à droite — pour qu'aucune des deux
 * ne soit jamais seule.
 *
 * De là découle tout le reste, et notamment la seule bonne nouvelle du
 * chapitre : la COMMUTATIVITÉ. 7 × 3 et 3 × 7, c'est le même rectangle tourné
 * d'un quart de tour, donc le même nombre de points. La case miroir s'allume
 * en même temps que la case choisie, et le compteur du panneau montre ce que
 * cela économise : sur les 100 cases, il n'y a que 55 résultats différents à
 * connaître — et en retirant les tables de 1, de 2, de 5 et de 10, qui se
 * devinent, il en reste 36.
 *
 * L'animation parcourt une table entière (1 × 7, 2 × 7, 3 × 7…) : le rectangle
 * grandit d'une ligne à chaque fois, et l'on voit que passer d'un résultat au
 * suivant, c'est simplement AJOUTER 7. Une table, c'est une addition répétée.
 */
MathsView.register({
  id: 'tables-multiplication',
  title: 'Les tables de multiplication',
  level: '6eme',
  category: 'calcul',
  subcategory: 'Calcul mental',
  exercices: ['tables'],
  theme: 'Calcul mental — les tables jusqu\'à 10, vues comme des rectangles',
  description:
    'Une multiplication, c\'est un <strong>rectangle</strong> : \\(7\\times 3\\), ce sont ' +
    '<strong>7 lignes de 3 points</strong>, et le résultat est le nombre de points.' +
    '<br><strong>Clique sur une case</strong> de la table de Pythagore (ou bouge les ' +
    'curseurs) : le rectangle correspondant se dessine à droite.' +
    '<br>Regarde surtout la <strong>case miroir</strong>, qui s\'allume en même temps : ' +
    '\\(7\\times 3\\) et \\(3\\times 7\\) donnent le même nombre, parce que c\'est le ' +
    '<strong>même rectangle tourné</strong>. C\'est ce qui divise presque par deux ce ' +
    'qu\'il y a à apprendre.' +
    '<br><em>Le bouton <strong>▶ Animer</strong> parcourt une table entière : le ' +
    'rectangle gagne une ligne à chaque fois, et le résultat augmente toujours du ' +
    'même nombre.</em>',
  notes:
    '<ul>' +
    '<li><strong>Multiplier, c\'est répéter une addition.</strong> ' +
    '\\(4\\times 7 = 7+7+7+7\\). C\'est pour cela que dans la table de 7, on passe ' +
    'd\'un résultat au suivant en ajoutant 7 : 7, 14, 21, 28…</li>' +
    '<li><strong>L\'ordre ne change rien</strong> (on dit que la multiplication est ' +
    '<em>commutative</em>) : \\(7\\times 3 = 3\\times 7 = 21\\). Le rectangle de ' +
    '7 lignes de 3 points contient autant de points que celui de 3 lignes de 7 : ' +
    'c\'est le même, tourné d\'un quart de tour.</li>' +
    '<li><strong>Conséquence directe : il y a deux fois moins à apprendre.</strong> ' +
    'Les 100 cases de la table ne contiennent que <strong>55 résultats différents</strong> ' +
    '— tout ce qui est au-dessus de la diagonale se retrouve en dessous.</li>' +
    '<li><strong>Les tables faciles.</strong> ×1 ne change rien. ×10 ajoute un zéro. ' +
    '×2, c\'est le double. ×5, c\'est la moitié de ×10. En les retirant, il ne reste ' +
    'que <strong>36 résultats</strong> à vraiment mémoriser.</li>' +
    '<li><strong>Les carrés.</strong> Sur la diagonale se trouvent \\(1\\times 1\\), ' +
    '\\(2\\times 2\\), \\(3\\times 3\\)… Ce sont les seuls rectangles qui sont des ' +
    'carrés, et ce sont souvent les plus faciles à retenir : 16, 25, 36, 49, 64, 81.</li>' +
    '<li><strong>Une astuce pour la table de 9.</strong> Les chiffres du résultat ' +
    's\'additionnent toujours pour faire 9 : 18 (1+8), 27 (2+7), 36 (3+6)… Et le ' +
    'chiffre des dizaines augmente de 1 pendant que celui des unités diminue de 1.</li>' +
    '<li><strong>À quoi ça sert.</strong> Sans les tables, plus rien ne marche : les ' +
    'divisions, les fractions à simplifier, les critères de divisibilité, le calcul ' +
    'des aires. C\'est l\'outil que l\'on utilisera le plus souvent, pendant des ' +
    'années.</li>' +
    '</ul>',
  board: {
    boundingbox: [-11.5, 8.6, 11.5, -8.6], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_SEL  = '#dc2626';   // rouge : la case choisie, et son rectangle
    var C_MIR  = '#2563eb';   // bleu : la case miroir (commutativité)
    var C_BANDE = '#fecaca';  // la ligne et la colonne de la case choisie
    var C_DIAG = '#fef3c7';   // la diagonale des carrés
    var INK    = '#334155';
    var SOFT   = '#94a3b8';

    /* ==================================================================== */
    /* Géométrie de la table de Pythagore                                   */
    /* ==================================================================== */
    var C = 0.72;                       // côté d'une case
    var TX = -10.6, TY = 7.4;           // coin haut-gauche de la table
    function cx(j) { return TX + j * C + C / 2; }   // j = 0 (en-tête) puis 1..10
    function cy(i) { return TY - i * C - C / 2; }

    var a = 7, b = 3;                   // la case choisie : a lignes, b colonnes
    var miroir = true;

    function attr(o, k, v) {
      if (!o._mv) o._mv = {};
      if (o._mv[k] !== v) { o._mv[k] = v; var t = {}; t[k] = v; o.setAttribute(t); }
    }

    /* ==================================================================== */
    /* Les surlignages, dessinés SOUS la table                              */
    /* ==================================================================== */
    function rect(fx, fy, fw, fh, couleur, opacite, couche) {
      var c = board.create('curve', [[], []], {
        strokeColor: couleur, strokeWidth: 0, fillColor: couleur,
        fillOpacity: opacite, fixed: true, highlight: false, layer: couche
      });
      c.updateDataArray = function () {
        var x = fx(), y = fy(), w = fw(), h = fh();
        this.dataX = [x, x + w, x + w, x, x];
        this.dataY = [y, y, y - h, y - h, y];
      };
      return c;
    }

    // La diagonale des carrés : un repère visuel permanent.
    for (var d = 1; d <= 10; d++) {
      (function (d) {
        rect(function () { return TX + d * C; }, function () { return TY - d * C; },
             function () { return C; }, function () { return C; }, C_DIAG, 1, 2);
      })(d);
    }

    // La ligne et la colonne de la case choisie : elles montrent d'où vient le
    // résultat qu'on lit.
    rect(function () { return TX; }, function () { return TY - a * C; },
         function () { return 11 * C; }, function () { return C; }, C_BANDE, 0.75, 3);
    rect(function () { return TX + b * C; }, function () { return TY; },
         function () { return C; }, function () { return 11 * C; }, C_BANDE, 0.75, 3);

    // La case choisie, et sa jumelle.
    var caseSel = rect(function () { return TX + b * C; }, function () { return TY - a * C; },
      function () { return C; }, function () { return C; }, C_SEL, 0.35, 4);
    var caseMir = rect(function () { return TX + a * C; }, function () { return TY - b * C; },
      function () { return C; }, function () { return C; }, C_MIR, 0.3, 4);

    /* ==================================================================== */
    /* Le quadrillage et les nombres                                        */
    /* ==================================================================== */
    for (var k = 0; k <= 11; k++) {
      (function (k) {
        board.create('segment', [[TX, TY - k * C], [TX + 11 * C, TY - k * C]], {
          strokeColor: k <= 1 ? INK : '#e2e8f0', strokeWidth: k <= 1 ? 1.5 : 1,
          fixed: true, highlight: false, layer: 5
        });
        board.create('segment', [[TX + k * C, TY], [TX + k * C, TY - 11 * C]], {
          strokeColor: k <= 1 ? INK : '#e2e8f0', strokeWidth: k <= 1 ? 1.5 : 1,
          fixed: true, highlight: false, layer: 5
        });
      })(k);
    }

    board.create('text', [cx(0), cy(0), '×'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: INK,
      cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 6
    });

    var cellules = [];                  // les 100 produits, pour les colorier
    for (var i = 1; i <= 10; i++) {
      for (var j = 1; j <= 10; j++) {
        (function (i, j) {
          var t = board.create('text', [cx(j), cy(i), String(i * j)], {
            anchorX: 'middle', anchorY: 'middle', fontSize: 11, color: INK,
            fixed: true, highlight: false, layer: 6
          });
          cellules.push({ t: t, i: i, j: j });
        })(i, j);
      }
    }
    // Les en-têtes : ils rappellent qu'une case est le croisement de deux nombres.
    var entetes = [];
    for (var e = 1; e <= 10; e++) {
      (function (e) {
        entetes.push({ t: board.create('text', [cx(e), cy(0), String(e)], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 6
        }), n: e, col: true });
        entetes.push({ t: board.create('text', [cx(0), cy(e), String(e)], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: INK,
          cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 6
        }), n: e, col: false });
      })(e);
    }

    board.create('text', [TX + 5.5 * C, TY + 0.55, 'Table de Pythagore'], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 6
    });

    /* ==================================================================== */
    /* Le rectangle de points                                               */
    /*                                                                       */
    /* a lignes de b points : c'est CETTE image qu'il faut associer à        */
    /* « a × b », et c'est elle qui rend la commutativité évidente.          */
    /* ==================================================================== */
    var PX = 1.4, PY = 5.6, PAS = 0.58;
    var points = [];
    for (var li = 0; li < 10; li++) {
      for (var co = 0; co < 10; co++) {
        (function (li, co) {
          var p = board.create('point', [PX + co * PAS, PY - li * PAS], {
            size: 4, face: 'o', fillColor: C_SEL, strokeColor: '#fff', strokeWidth: 1,
            fixed: true, withLabel: false, showInfobox: false, highlight: false,
            layer: 7
          });
          points.push({ p: p, li: li, co: co });
        })(li, co);
      }
    }

    // Le contour du rectangle : il donne à voir « a lignes de b ».
    var contour = board.create('curve', [[], []], {
      strokeColor: C_SEL, strokeWidth: 2, dash: 2, fillColor: C_SEL,
      fillOpacity: 0.06, fixed: true, highlight: false, layer: 6
    });
    contour.updateDataArray = function () {
      var x1 = PX - PAS / 2, y1 = PY + PAS / 2;
      var x2 = x1 + Math.max(1, b) * PAS, y2 = y1 - Math.max(1, a) * PAS;
      this.dataX = [x1, x2, x2, x1, x1];
      this.dataY = [y1, y1, y2, y2, y1];
    };

    // Les accolades de lecture : « a lignes », « b points par ligne ».
    board.create('text', [PX - 0.75, function () { return PY - (a - 1) * PAS / 2; },
      function () { return '<b>' + a + '</b><br>lignes'; }], {
      anchorX: 'right', anchorY: 'middle', fontSize: 12, color: C_SEL,
      cssStyle: 'text-align:right;line-height:1.15', fixed: true, highlight: false, layer: 8
    });
    board.create('text', [function () { return PX + (b - 1) * PAS / 2; }, PY + 0.85,
      function () { return '<b>' + b + '</b> points par ligne'; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: C_SEL,
      fixed: true, highlight: false, layer: 8
    });

    /* ==================================================================== */
    /* L'écriture, sous le rectangle                                        */
    /* ==================================================================== */
    board.create('text', [4.2, -2.2, function () {
      return '<span style="color:' + C_SEL + '">' + a + ' × ' + b + '</span> = <b>' +
             (a * b) + '</b>';
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 26, color: INK,
      cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 8
    });
    board.create('text', [4.2, -3.5, function () {
      if (!miroir) return '';
      return a === b
        ? '<span style="color:' + C_MIR + '">' + a + ' × ' + a + ' : c\'est un ' +
          '<b>carré</b>, il n\'a pas de jumeau.</span>'
        : '<span style="color:' + C_MIR + '">et ' + b + ' × ' + a + ' = ' + (a * b) +
          ' aussi</span> — le même rectangle, tourné.';
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
      fixed: true, highlight: false, layer: 8
    });
    board.create('text', [4.2, -4.7, function () {
      return '<span style="color:' + SOFT + '">' + a + ' × ' + b + ' = ' +
        (b === 1 ? String(a) : Array.apply(null, Array(Math.min(b, 6)))
          .map(function () { return a; }).join(' + ') + (b > 6 ? ' + …' : '')) +
        '</span>';
    }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: SOFT,
      fixed: true, highlight: false, layer: 8
    });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function refresh() {
      // Les points du rectangle : allumés s'ils sont dans les a premières
      // lignes et les b premières colonnes.
      points.forEach(function (o) {
        attr(o.p, 'visible', o.li < a && o.co < b);
      });
      attr(caseMir, 'visible', miroir && a !== b);

      // Les nombres de la table : la case choisie et sa jumelle ressortent.
      cellules.forEach(function (o) {
        var sel = o.i === a && o.j === b;
        var mir = miroir && o.i === b && o.j === a && a !== b;
        attr(o.t, 'color', sel ? C_SEL : mir ? C_MIR : INK);
        attr(o.t, 'fontSize', sel || mir ? 13 : 11);
        attr(o.t, 'cssStyle', sel || mir ? 'font-weight:800' : '');
      });
      entetes.forEach(function (o) {
        var actif = o.col ? o.n === b : o.n === a;
        attr(o.t, 'color', actif ? C_SEL : INK);
      });
    }

    /* ==================================================================== */
    /* Panneau : ce que la commutativité fait gagner                        */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function renderPanel() {
      var facile = (a <= 2 || a === 5 || a === 10 || b <= 2 || b === 5 || b === 10);
      panel.innerHTML =
        '<div class="props-name" style="color:' + C_SEL + '">' + a + ' × ' + b +
          ' = ' + (a * b) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">Un rectangle de <b>' + a + ' lignes</b> de <b>' +
          b + ' points</b> contient <b>' + (a * b) + '</b> points. C\'est aussi ' +
          b + ' fois le nombre ' + a + ', ajouté à lui-même.</p>' +

        '<div class="props-label">L\'ordre ne change rien</div>' +
        '<p style="margin:.2rem 0 .5rem">' +
          (a === b
            ? '<b>' + a + ' × ' + a + '</b> est sur la diagonale : son rectangle est un ' +
              '<b>carré</b>, il est son propre miroir.'
            : '<b>' + a + ' × ' + b + '</b> et <b>' + b + ' × ' + a + '</b> donnent le ' +
              'même résultat. Tu n\'as donc qu\'<b>un seul</b> des deux à apprendre : ' +
              'l\'autre est offert.') + '</p>' +

        '<div class="props-label">Ce qu\'il reste vraiment à apprendre</div>' +
        '<ul class="props-list">' +
          '<li>La table complète compte <b>100 cases</b>…</li>' +
          '<li>… mais seulement <b>55 résultats différents</b>, puisque tout ce qui ' +
            'est au-dessus de la diagonale se retrouve en dessous.</li>' +
          '<li>En enlevant les tables de <b>1</b>, <b>2</b>, <b>5</b> et <b>10</b>, qui ' +
            'se devinent, il ne reste que <b>36</b> résultats à mémoriser.</li>' +
        '</ul>' +

        '<p style="margin:.5rem 0 0;font-size:.9rem;color:var(--ink-soft)">' +
          (facile
            ? 'Celui-ci fait partie des faciles : ' +
              (a === 1 || b === 1 ? 'multiplier par 1 ne change rien.'
               : a === 10 || b === 10 ? 'multiplier par 10, c\'est ajouter un zéro.'
               : a === 2 || b === 2 ? 'multiplier par 2, c\'est doubler.'
               : 'multiplier par 5, c\'est la moitié de multiplier par 10.')
            : 'Celui-ci fait partie des ' + 36 + ' à savoir par cœur — il n\'y a pas ' +
              'd\'astuce, mais le rectangle aide à le reconstruire en cas de doute.') +
        '</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Choisir une case : à la souris, ou aux curseurs                       */
    /* ==================================================================== */
    var refs = null;
    function setAB(na, nb) {
      a = Math.max(1, Math.min(10, na));
      b = Math.max(1, Math.min(10, nb));
      if (refs) { refs.a.value = a; refs.b.value = b; syncVal(); }
      board.update();
    }
    function syncVal() {
      // Les curseurs de mv.addControls affichent leur valeur dans un <span>
      // voisin : on le remet à jour quand c'est le clic qui a décidé.
      if (!refs) return;
      [['a', a], ['b', b]].forEach(function (x) {
        var s = refs[x[0]].nextSibling;
        if (s) s.textContent = String(x[1]);
      });
    }

    function eventCoords(ev) {
      var idx = (ev.targetTouches && ev.targetTouches.length) ? 0 : undefined;
      var c = board.getCoordsTopLeftCorner(ev, idx);
      var p = JXG.getPosition(ev, idx);
      return new JXG.Coords(JXG.COORDS_BY_SCREEN, [p[0] - c[0], p[1] - c[1]], board).usrCoords;
    }
    board.on('down', function (ev) {
      var u = eventCoords(ev);
      var j = Math.floor((u[1] - TX) / C);
      var i = Math.floor((TY - u[2]) / C);
      if (i >= 1 && i <= 10 && j >= 1 && j <= 10) { anim.cancel(); setAB(i, j); }
    });
    board.on('move', function (ev) {
      var u = eventCoords(ev);
      var j = Math.floor((u[1] - TX) / C), i = Math.floor((TY - u[2]) / C);
      var dedans = i >= 1 && i <= 10 && j >= 1 && j <= 10;
      board.containerObj.style.cursor = dedans ? 'pointer' : '';
    });

    /* ==================================================================== */
    /* Animation : parcourir une table entière                              */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function reset() { setAB(a, 1); }
    function play() {
      var table = a;
      setAB(table, 1);
      anim.runSteps([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) {
        return { dur: 420, step: function (p) {
          // Un cran par étape : l'état est absolu, « Précédent » le rejoue.
          if (b !== n || a !== table) { a = table; b = n; if (refs) syncVal(); }
        } };
      }), function () { setAB(table, 1); });
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    refs = mv.addControls([
      { type: 'slider', id: 'a', label: 'lignes', min: 1, max: 10, step: 1, value: a,
        onInput: function (v) { anim.cancel(); a = v; board.update(); } },
      { type: 'slider', id: 'b', label: 'colonnes', min: 1, max: 10, step: 1, value: b,
        onInput: function (v) { anim.cancel(); b = v; board.update(); } },
      { type: 'checkbox', id: 'mir', label: 'montrer la case miroir', checked: true,
        onChange: function (on) { miroir = on; board.update(); } },
      { type: 'button', id: 'play', label: '▶ Animer la table', onClick: play }
    ]);

    mv.extras.appendChild(panel);
    board.update();
  }
});
