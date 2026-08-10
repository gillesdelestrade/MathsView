/*
 * Nombres relatifs (5ème) — l'opposé, la valeur absolue, l'addition et la
 * soustraction, lues sur une droite graduée.
 *
 * Trois temps, trois boutons :
 *
 *   L'OPPOSÉ      −3 et 3 sont de part et d'autre de 0, à la MÊME distance.
 *                 Deux arcs de même longueur le montrent, et leur somme fait 0.
 *
 *   LA VALEUR     Cette distance à 0 a un nom et une notation : |−3| = 3.
 *   ABSOLUE       Le même arc qu'au premier temps, mais c'est LUI qu'on regarde
 *                 maintenant, et il porte l'écriture |−3| = 3. Comme les deux
 *                 arcs ont la même longueur, deux nombres opposés ont la même
 *                 valeur absolue — qui n'est donc jamais négative.
 *
 *   AJOUTER /     Calculer, c'est se DÉPLACER sur la droite. Le point de départ
 *   SOUSTRAIRE    est a, le déplacement est donné par l'opération et par le
 *                 signe du nombre :
 *
 *                     ajouter un positif     →  vers la droite
 *                     ajouter un négatif     ←  vers la gauche
 *                     soustraire un positif  ←  vers la gauche
 *                     soustraire un négatif  →  vers la droite
 *
 * Ces quatre cas forment un tableau 2 × 2 sous la figure : la case du calcul en
 * cours s'allume, et CHAQUE CASE EST CLIQUABLE — le tableau est à la fois le
 * résumé de la leçon et le choix du calcul.
 *
 * Les deux lignes du bas du tableau disent la même chose que les deux du haut :
 * soustraire un nombre, c'est ajouter son opposé. La leçon l'écrit noir sur
 * blanc à chaque soustraction (a − b = a + (−b)) — c'est ce qui relie les deux
 * temps de la leçon.
 *
 * Le déplacement est un arc au-dessus de la droite, tracé progressivement et
 * fléché, à la couleur du sens (rouge vers la droite, bleu vers la gauche —
 * même convention que la leçon « Multiplier et diviser par 10 »).
 *
 * Toutes les coordonnées sont des FONCTIONS de a, de l'opération et du nombre :
 * bouger un curseur recalcule la figure en direct. Chaque étape règle un état
 * ABSOLU pour que « Précédent » puisse la rejouer.
 */
MathsView.register({
  id: 'relatifs-droite',
  title: 'Nombres relatifs sur une droite',
  level: '5eme',
  category: 'calcul',
  subcategory: 'Nombres relatifs',
  exercices: ['relatifs'],
  theme: 'Nombres relatifs — opposé, valeur absolue, addition et soustraction sur une droite graduée',
  description:
    'Un nombre relatif, c\'est un <strong>point</strong> sur une droite graduée ; ' +
    'calculer, c\'est <strong>se déplacer</strong> dessus.' +
    '<br>L\'<strong>opposé</strong> d\'un nombre est de l\'autre côté de <strong>0</strong>, ' +
    'à la <strong>même distance</strong> : l\'opposé de 3 est −3, et \\(3 + (-3) = 0\\).' +
    '<br>Cette <strong>distance à 0</strong> s\'appelle la <strong>valeur absolue</strong> ' +
    'et se note entre deux barres : \\(|-3| = 3\\). C\'est le nombre <strong>sans son ' +
    'signe</strong> — deux nombres opposés ont donc la même valeur absolue.' +
    '<br>Pour additionner ou soustraire, tout tient dans le <strong>sens du ' +
    'déplacement</strong> — le tableau sous la figure le résume, et ' +
    '<strong>chaque case est cliquable</strong>.' +
    '<br>Règle les curseurs, puis clique sur <strong>Animer</strong> (ou coche ' +
    '<strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>L\'opposé</strong> de \\(a\\) est le nombre situé de l\'autre côté de 0, ' +
    'à la même distance. On le note \\(-a\\). Et \\(a + (-a) = 0\\).</li>' +
    '<li><strong>La valeur absolue</strong> de \\(a\\) est sa <strong>distance à 0</strong> ' +
    'sur la droite graduée. On la note \\(|a|\\), entre deux barres : ' +
    '\\(|-7| = 7\\) et \\(|7| = 7\\). En pratique, c\'est le nombre ' +
    '<strong>débarrassé de son signe</strong>.</li>' +
    '<li>Une valeur absolue n\'est <strong>jamais négative</strong> : c\'est une longueur. ' +
    'Et deux nombres <strong>opposés</strong> ont la <strong>même valeur absolue</strong>, ' +
    'puisqu\'ils sont à la même distance de 0. Seul \\(|0| = 0\\).</li>' +
    '<li>Elle sert à <strong>comparer deux nombres négatifs</strong> : entre \\(-3\\) et ' +
    '\\(-8\\), le plus grand est celui dont la valeur absolue est la plus ' +
    '<strong>petite</strong>, donc \\(-3 > -8\\).</li>' +
    '<li><strong>Ajouter</strong> un nombre <strong>positif</strong> : on va vers la ' +
    '<strong>droite</strong>. Ajouter un nombre <strong>négatif</strong> : vers la ' +
    '<strong>gauche</strong>.</li>' +
    '<li><strong>Soustraire</strong> un nombre <strong>positif</strong> : vers la ' +
    '<strong>gauche</strong>. Soustraire un nombre <strong>négatif</strong> : vers la ' +
    '<strong>droite</strong>.</li>' +
    '<li>Ces quatre règles n\'en font que deux : <strong>soustraire un nombre, c\'est ' +
    'ajouter son opposé</strong>. \\(2 - (-5) = 2 + 5 = 7\\).</li>' +
    '<li>D\'ailleurs \\(2 + (-5)\\) et \\(2 - 5\\) donnent le même résultat : c\'est le ' +
    '<strong>même déplacement</strong>, 5 crans vers la gauche.</li>' +
    '<li>Le résultat est <strong>plus grand</strong> que le départ quand on va vers la droite, ' +
    '<strong>plus petit</strong> quand on va vers la gauche : sur la droite graduée, ' +
    '« plus grand » veut dire « plus à droite ».</li>' +
    '</ul>',
  board: { boundingbox: [-11, 1.9, 11, -1.5], keepaspectratio: false, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_DROITE = '#dc2626';   // on va vers la droite (le nombre grandit)
    var C_GAUCHE = '#2563eb';   // on va vers la gauche
    var C_DEP = '#7c3aed';      // le point de départ
    var C_RES = '#16a34a';      // le résultat
    var C_OPP = '#0891b2';      // l'opposé
    var INK = '#334155';
    var SOFT = '#94a3b8';

    var XMAX = 10;              // la droite va de −10 à 10

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var mode = 'oppose';        // 'oppose' | 'abs' | 'calcul'
    var aVal = 2;               // le point de départ
    var op = '+';               // '+' ou '−'
    var sgn = 1;                // le signe du nombre ajouté / soustrait
    var mb = 5;                 // sa valeur absolue
    var prog = 0;               // avancement de l'arc en cours (0 → 1)
    var progO = 0;              // avancement de l'arc de l'opposé

    function A() { return aVal; }
    function B() { return sgn * mb; }              // le nombre relatif en jeu
    function D() { return op === '+' ? B() : -B(); }  // le déplacement signé
    function RES() { return A() + D(); }
    function cle() { return (op === '+' ? 'a' : 's') + (sgn > 0 ? 'p' : 'n'); }
    function cSens(d) { return d > 0 ? C_DROITE : C_GAUCHE; }

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Écriture des nombres relatifs                                         */
    /* ==================================================================== */
    function num(v) { return String(v).replace('-', '−'); }
    // Un nombre négatif s'écrit entre parenthèses derrière un signe d'opération :
    // « 2 − (−5) », jamais « 2 − −5 ».
    function paren(v) { return v < 0 ? '(' + num(v) + ')' : num(v); }
    function span(t, c) { return '<span style="color:' + c + '">' + t + '</span>'; }
    // La valeur absolue s'écrit entre deux barres : |−3|.
    function abso(v) { return '|' + num(v) + '|'; }

    /* ==================================================================== */
    /* La droite graduée (commune aux trois modes)                           */
    /* ==================================================================== */
    board.create('segment', [[-XMAX - 0.6, 0], [XMAX + 0.6, 0]], {
      strokeColor: INK, strokeWidth: 2,
      firstArrow: { type: 2, size: 6 }, lastArrow: { type: 2, size: 6 },
      fixed: true, highlight: false, layer: 4
    });
    for (var v = -XMAX; v <= XMAX; v++) {
      (function (v) {
        board.create('segment', [[v, -0.1], [v, 0.1]], {
          strokeColor: v === 0 ? INK : SOFT, strokeWidth: v === 0 ? 2.5 : 1.5,
          fixed: true, highlight: false, layer: 4
        });
        board.create('text', [v, -0.36, num(v)], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 12,
          color: v === 0 ? INK : SOFT, cssStyle: v === 0 ? 'font-weight:800' : '',
          fixed: true, highlight: false, layer: 4
        });
      })(v);
    }

    /* ==================================================================== */
    /* Fabriques                                                             */
    /* ==================================================================== */
    // Un point posé sur la droite, avec son étiquette au-dessus.
    function pointSur(fx, couleur, ftxt) {
      var p = board.create('point', [fx, 0], {
        size: 5, strokeColor: '#fff', strokeWidth: 2, fillColor: couleur,
        fixed: true, withLabel: false, visible: false, highlight: false, layer: 8
      });
      var t = board.create('text', [fx, 0.34, ftxt], {
        anchorX: 'middle', anchorY: 'middle', fontSize: 16, color: couleur,
        cssStyle: 'font-weight:800', fixed: true, visible: false, highlight: false, layer: 8
      });
      return { pt: p, lab: t };
    }
    // Un arc au-dessus de la droite, de x0 à x1, tracé de 0 à `avance` : c'est
    // le « saut de puce » du cahier, avec sa flèche.
    function arc(fx0, fx1, fh, favance, couleur) {
      // t va de 0 à `avance` : l'arc se dessine en même temps qu'on avance,
      // et sa flèche est toujours à son extrémité.
      return board.create('curve', [
        function (t) { var x0 = fx0(); return x0 + (fx1() - x0) * t; },
        function (t) { return fh() * Math.sin(Math.PI * t); },
        0,
        function () { return Math.max(0.0001, favance()); }
      ], {
        strokeColor: couleur, strokeWidth: 3, lastArrow: { type: 2, size: 7 },
        fixed: true, visible: false, highlight: false, layer: 7
      });
    }
    function hauteur(d) { return 0.5 + Math.min(0.5, Math.abs(d) * 0.075); }
    function show(o, b) { o.setAttribute({ visible: !!b }); }
    function showPt(p, b) { show(p.pt, b); show(p.lab, b); }

    /* ==================================================================== */
    /* Modes « opposé » et « valeur absolue » : deux arcs de même longueur    */
    /* de part et d'autre de 0 — la même figure, deux lectures                */
    /* ==================================================================== */
    var oppA = pointSur(A, C_DEP, function () { return num(A()); });
    var oppB = pointSur(function () { return -A(); }, C_OPP, function () { return num(-A()); });
    // Les deux arcs partent de 0 : l'un vers a, l'autre vers son opposé.
    var arcA = arc(function () { return 0; }, A, function () { return hauteur(A()); },
      function () { return 1; }, C_DEP);
    var arcO = arc(function () { return 0; }, function () { return -A(); },
      function () { return hauteur(A()); }, function () { return progO; }, C_OPP);
    // La distance à 0, écrite au sommet de chaque arc — en crans dans le mode
    // « opposé », avec la notation elle-même dans le mode « valeur absolue » :
    // c'est le même arc, on le lit simplement autrement.
    function txtDist(v) {
      if (mode === 'abs') return abso(v) + ' = ' + Math.abs(v);
      return Math.abs(v) + ' cran' + (Math.abs(v) > 1 ? 's' : '');
    }
    var distA = board.create('text', [function () { return A() / 2; },
      function () { return hauteur(A()) + 0.22; },
      function () { return txtDist(A()); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_DEP,
      cssStyle: 'font-weight:700', fixed: true, visible: false, highlight: false, layer: 8
    });
    var distO = board.create('text', [function () { return -A() / 2; },
      function () { return hauteur(A()) + 0.22; },
      function () { return txtDist(-A()); }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: C_OPP,
      cssStyle: 'font-weight:700', fixed: true, visible: false, highlight: false, layer: 8
    });

    /* ==================================================================== */
    /* Mode « calcul » : un point de départ, un saut, un point d'arrivée      */
    /* ==================================================================== */
    var depart = pointSur(A, C_DEP, function () { return num(A()); });
    var arrivee = pointSur(RES, C_RES, function () { return num(RES()); });
    var saut = arc(A, RES, function () { return hauteur(D()); },
      function () { return prog; }, C_DROITE);
    // Le déplacement, écrit au sommet de l'arc : « 5 crans vers la droite ».
    var lblSaut = board.create('text', [
      function () { return A() + D() / 2; },
      function () { return hauteur(D()) + 0.24; },
      function () {
        return Math.abs(D()) + ' cran' + (Math.abs(D()) > 1 ? 's' : '') +
               (D() > 0 ? ' vers la droite ▶' : ' ◀ vers la gauche');
      }
    ], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 14,
      cssStyle: 'font-weight:800', fixed: true, visible: false, highlight: false, layer: 8
    });

    var TOUT = [oppA, oppB, depart, arrivee];
    function cacheFigure() {
      TOUT.forEach(function (p) { showPt(p, false); });
      [arcA, arcO, saut, distA, distO, lblSaut].forEach(function (o) { show(o, false); });
    }

    /* ==================================================================== */
    /* Le panneau : commentaire, calcul, et le tableau des quatre cas         */
    /* ==================================================================== */
    var root = document.createElement('div');
    root.className = 'rel-ui';
    root.innerHTML =
      '<div class="rel-cap"></div>' +
      '<div class="rel-calc"></div>' +
      '<table class="rel-table">' +
        '<tr><th class="rel-corner">on ajoute / on soustrait…</th>' +
          '<th class="rel-h pos">…un nombre <b>positif</b></th>' +
          '<th class="rel-h neg">…un nombre <b>négatif</b></th></tr>' +
        '<tr><th class="rel-op">ajouter</th>' +
          '<td data-k="ap"></td><td data-k="an"></td></tr>' +
        '<tr><th class="rel-op">soustraire</th>' +
          '<td data-k="sp"></td><td data-k="sn"></td></tr>' +
      '</table>';
    mv.extras.appendChild(root);

    var capEl = root.querySelector('.rel-cap');
    var calcEl = root.querySelector('.rel-calc');
    var tableEl = root.querySelector('.rel-table');
    var cases = {};
    ['ap', 'an', 'sp', 'sn'].forEach(function (k) {
      var td = tableEl.querySelector('[data-k="' + k + '"]');
      cases[k] = td;
      // Chaque case est un choix : elle fixe l'opération et le signe du nombre.
      td.onclick = function () {
        mode = 'calcul';
        op = k.charAt(0) === 'a' ? '+' : '−';
        sgn = k.charAt(1) === 'p' ? 1 : -1;
        arm();
      };
    });

    // Le contenu des cases suit les curseurs : ce sont des exemples vivants.
    function remplitCases() {
      ['ap', 'an', 'sp', 'sn'].forEach(function (k) {
        var o = k.charAt(0) === 'a' ? '+' : '−';
        var s = k.charAt(1) === 'p' ? 1 : -1;
        var d = (o === '+' ? 1 : -1) * s * mb;      // le déplacement de ce cas
        var c = cSens(d);
        cases[k].innerHTML =
          '<span class="rel-dir" style="color:' + c + '">' +
            (d > 0 ? 'vers la droite ▶' : '◀ vers la gauche') + '</span>' +
          '<span class="rel-mini">' + num(A()) + ' ' + o + ' ' + paren(s * mb) +
            ' = ' + num(A() + d) + '</span>';
      });
    }
    function majCases(actif) {
      ['ap', 'an', 'sp', 'sn'].forEach(function (k) {
        cases[k].classList.toggle('on', k === actif);
      });
    }

    var dernierCap = null;
    function cap(t) {
      if (t === dernierCap) return;
      dernierCap = t;
      capEl.innerHTML = t || '&nbsp;';
    }

    /* ==================================================================== */
    /* Ce qui s'écrit : le calcul, ligne à ligne                              */
    /* ==================================================================== */
    // niveau 0 : rien — 1 : le calcul posé — 2 : réécrit en addition (si
    // soustraction) — 3 : le résultat.
    // Appelée à chaque image : on ne réécrit que si le contenu change vraiment.
    var dernierCalc = null;
    function ecritCalcul(niveau) {
      var k = [mode, niveau, aVal, op, sgn, mb].join('|');
      if (k === dernierCalc) return;
      dernierCalc = k;
      dessineCalcul(niveau);
    }
    function dessineCalcul(niveau) {
      if (mode === 'oppose') {
        if (niveau < 1) { calcEl.innerHTML = ''; return; }
        var a = A();
        if (a === 0) {
          calcEl.innerHTML = span('0', C_DEP) + ' est son <b>propre opposé</b>.';
          return;
        }
        var n = Math.abs(a);
        // On n'annonce l'opposé qu'au moment où il apparaît sur la droite.
        var h = niveau < 2
          ? 'Distance à 0 : <b>' + n + ' cran' + (n > 1 ? 's' : '') + '</b>.'
          : 'L\'opposé de ' + span(num(a), C_DEP) + ' est ' + span(num(-a), C_OPP);
        if (niveau >= 3) {
          h += ' <span class="rel-sep">·</span> ' + span(num(a), C_DEP) + ' + ' +
               span(paren(-a), C_OPP) + ' = <b>0</b>';
        }
        calcEl.innerHTML = h;
        return;
      }
      if (mode === 'abs') {
        if (niveau < 1) { calcEl.innerHTML = ''; return; }
        var x = A();
        // niveau 1 : la notation seule — 2 : sa valeur — 3 et 4 : celle de
        // l'opposé, qui est la même.
        var h1 = span(abso(x), C_DEP);
        if (niveau >= 2) h1 += ' = <b>' + Math.abs(x) + '</b>';
        // 0 est son propre opposé : la seconde écriture serait la même.
        if (niveau >= 3 && x !== 0) {
          h1 += ' <span class="rel-sep">·</span> ' + span(abso(-x), C_OPP) +
                ' = <b>' + Math.abs(x) + '</b>';
        }
        if (niveau >= 4) {
          h1 += x === 0
            ? '<span class="rel-why">0 est son <b>propre opposé</b> : |0| = 0</span>'
            : '<span class="rel-why">deux nombres <b>opposés</b> ont la <b>même</b> ' +
              'valeur absolue</span>';
        } else if (niveau >= 2) {
          h1 += '<span class="rel-why">la <b>distance à 0</b>, donc le nombre ' +
                '<b>sans son signe</b></span>';
        }
        calcEl.innerHTML = h1;
        return;
      }
      if (niveau < 1) { calcEl.innerHTML = ''; return; }
      var dep = span(num(A()), C_DEP), nb = paren(B());
      var h2 = '<b>' + dep + ' ' + op + ' ' + nb + '</b>';
      // Soustraire, c'est ajouter l'opposé : on le montre à chaque soustraction.
      if (niveau >= 2 && op === '−') {
        h2 += ' <b class="rel-egal">=</b> <b>' + dep + ' + ' + paren(-B()) + '</b>';
      }
      if (niveau >= 3) {
        h2 += ' <b class="rel-egal">=</b> <b class="rel-res" style="color:' + C_RES + '">' +
              num(RES()) + '</b>';
      }
      // Le rappel reste en bout de ligne : il commente, il n'entre pas dans le calcul.
      if (niveau >= 2 && op === '−') {
        h2 += '<span class="rel-why">soustraire, c\'est <b>ajouter l\'opposé</b></span>';
      }
      calcEl.innerHTML = h2;
    }

    /* ==================================================================== */
    /* Les scénarios                                                         */
    /* ==================================================================== */
    function S(dur, txt, niv, fn) {
      return {
        dur: dur,
        step: function (p) { cap(txt); ecritCalcul(niv); fn(p); },
        after: function () { cap(txt); ecritCalcul(niv); fn(1); board.update(); }
      };
    }

    /* ---- L'opposé -------------------------------------------------------- */
    function stepsOppose() {
      return [
        S(600, 'On place le nombre sur la droite graduée.', 0, function (p) {
          progO = 0;
          showPt(oppA, p >= 1); showPt(oppB, false);
          show(arcA, false); show(arcO, false); show(distA, false); show(distO, false);
          show(saut, false); show(lblSaut, false);
        }),
        S(700, 'On mesure sa <b>distance à 0</b>, en crans.', 1, function (p) {
          progO = 0;
          showPt(oppA, true);
          show(arcA, A() !== 0); show(distA, A() !== 0 && p >= 0.5);
          show(arcO, false); show(distO, false); showPt(oppB, false);
        }),
        S(900, 'De l\'<b>autre côté de 0</b>, à la <b>même distance</b> : c\'est l\'<b>opposé</b>.', 2, function (p) {
          progO = p;
          show(arcO, A() !== 0); show(distO, A() !== 0 && p >= 0.8);
          showPt(oppB, p >= 0.9);
        }),
        S(650, 'Les deux nombres sont <b>symétriques par rapport à 0</b> : leur somme fait 0.', 3, function (p) {
          progO = 1;
          showPt(oppB, true); show(distO, A() !== 0);
        })
      ];
    }

    /* ---- La valeur absolue ------------------------------------------------ */
    // Même figure que l'opposé, lue autrement : ce qu'on regarde ici, c'est la
    // LONGUEUR des arcs — et le fait qu'ils soient égaux.
    function stepsAbs() {
      return [
        S(600, 'On place le nombre sur la droite graduée.', 1, function (p) {
          progO = 0;
          showPt(oppA, p >= 1); showPt(oppB, false);
          show(arcA, false); show(arcO, false); show(distA, false); show(distO, false);
          show(saut, false); show(lblSaut, false);
        }),
        S(850, 'Sa <b>valeur absolue</b>, c\'est sa <b>distance à 0</b> : on l\'écrit entre deux barres.', 2, function (p) {
          progO = 0;
          showPt(oppA, true);
          show(arcA, A() !== 0); show(distA, A() !== 0 && p >= 0.4);
          show(arcO, false); show(distO, false); showPt(oppB, false);
        }),
        S(900, 'Son <b>opposé</b> est de l\'autre côté de 0, à la <b>même distance</b>.', 3, function (p) {
          progO = p;
          show(arcO, A() !== 0); show(distO, A() !== 0 && p >= 0.8);
          showPt(oppB, p >= 0.9);
        }),
        S(700, 'Les deux arcs ont la <b>même longueur</b> : une valeur absolue n\'est <b>jamais négative</b>.', 4, function () {
          progO = 1;
          showPt(oppB, true); show(distO, A() !== 0);
        })
      ];
    }

    /* ---- Ajouter / soustraire -------------------------------------------- */
    function stepsCalcul() {
      return [
        S(550, 'On se place sur le <b>point de départ</b>.', 1, function (p) {
          prog = 0;
          showPt(depart, p >= 1); showPt(arrivee, false);
          show(saut, false); show(lblSaut, false);
          [oppA, oppB].forEach(function (o) { showPt(o, false); });
          [arcA, arcO, distA, distO].forEach(function (o) { show(o, false); });
          majCases(null);
        }),
        S(750, regleTxt(), 2, function (p) {
          prog = 0;
          showPt(depart, true);
          show(saut, false); show(lblSaut, false);
          majCases(p >= 0.3 ? cle() : null);
        }),
        S(1100, 'On se <b>déplace</b> sur la droite.', 2, function (p) {
          prog = p;
          saut.setAttribute({ strokeColor: cSens(D()) });
          lblSaut.setAttribute({ color: cSens(D()) });
          show(saut, true); show(lblSaut, p >= 0.25);
          showPt(arrivee, false);
          majCases(cle());
        }),
        S(650, 'On <b>arrive</b> sur le résultat.', 3, function (p) {
          prog = 1;
          show(saut, true); show(lblSaut, true);
          showPt(arrivee, p >= 0.3);
          majCases(cle());
        })
      ];
    }
    // Le texte de l'étape « règle » : c'est la case du tableau, en toutes lettres.
    function regleTxt() {
      var motOp = op === '+' ? 'ajoute' : 'soustrait';
      var motSg = sgn > 0 ? 'positif' : 'négatif';
      var sens = D() > 0 ? 'vers la <b class="rel-d">droite</b>' : 'vers la <b class="rel-g">gauche</b>';
      return 'On ' + motOp + ' un nombre <b>' + motSg + '</b> : on va donc ' + sens + '.';
    }

    /* ==================================================================== */
    /* Armement                                                              */
    /* ==================================================================== */
    function arm() {
      majBoutons();
      remplitCases();
      tableEl.style.display = mode === 'calcul' ? '' : 'none';

      function reset() {
        prog = 0; progO = 0;
        cacheFigure();
        // La couleur du saut fait partie de l'état : on la remet aussi, sinon
        // celle du calcul précédent survit à la remise à zéro.
        saut.setAttribute({ strokeColor: cSens(D()) });
        lblSaut.setAttribute({ color: cSens(D()) });
        majCases(null);
        cap(mode === 'oppose'
          ? 'Deux nombres opposés : de part et d\'autre de 0, à la même distance.'
          : mode === 'abs'
            ? 'La valeur absolue d\'un nombre, c\'est sa distance à 0.'
            : 'Calculer, c\'est se déplacer sur la droite graduée.');
        ecritCalcul(0);
        board.update();
      }
      reset();
      anim.runSteps(
        mode === 'oppose' ? stepsOppose() : mode === 'abs' ? stepsAbs() : stepsCalcul(),
        reset
      );
    }

    // Un curseur bouge : la figure suit toute seule (les coordonnées sont des
    // fonctions), il ne reste qu'à réécrire les cases du tableau.
    function majValeurs() {
      remplitCases();
      board.update();
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var refs = null;
    function majBoutons() {
      if (!refs) return;
      refs.oppose.classList.toggle('active', mode === 'oppose');
      refs.abs.classList.toggle('active', mode === 'abs');
      refs.calcul.classList.toggle('active', mode === 'calcul');
      // Le nombre ajouté ou soustrait n'a pas de sens dans le mode « opposé ».
      var vu = mode === 'calcul' ? '' : 'none';
      if (refs.b.parentNode) refs.b.parentNode.style.display = vu;
    }

    refs = mv.addControls([
      { type: 'button', id: 'oppose', label: 'L\'opposé', onClick: function () { mode = 'oppose'; arm(); } },
      { type: 'button', id: 'abs', label: 'La valeur absolue', onClick: function () { mode = 'abs'; arm(); } },
      { type: 'button', id: 'calcul', label: 'Ajouter / soustraire', onClick: function () { mode = 'calcul'; arm(); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { arm(); } },
      { type: 'slider', id: 'a', label: 'le nombre de départ', min: -5, max: 5, step: 1, value: 2,
        onInput: function (v) { aVal = v; majValeurs(); } },
      { type: 'slider', id: 'b', label: 'de combien', min: 1, max: 5, step: 1, value: 5,
        onInput: function (v) { mb = v; majValeurs(); } }
    ]);

    arm();
  }
});
