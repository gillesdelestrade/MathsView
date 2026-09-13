/*
 * Racine carrée : la fonction carré retournée (2nde).
 *
 * ---------------------------------------------------------------------------
 * Une racine carrée, c'est un tableau de valeurs lu à l'envers
 * ---------------------------------------------------------------------------
 * On ne DÉFINIT pas √x, on le fabrique. Le tableau de f(x) = x² se remplit
 * (0 → 0, 1 → 1, 2 → 4, 3 → 9 …), ses colonnes deviennent des points, la
 * courbe passe dessus. Puis on DUPLIQUE le tableau et on le RETOURNE : la
 * ligne des carrés devient la ligne d'entrée, la ligne des x devient la
 * sortie. Lire ce tableau retourné, c'est chercher « le nombre dont le carré
 * vaut … » : c'est la racine carrée. Dans le repère, le retournement est une
 * symétrie par rapport à la droite y = x — chaque point (x ; x²) glisse vers
 * (x² ; x), et la courbe de x² se couche en celle de √x.
 *
 * ---------------------------------------------------------------------------
 * Le retournement fait apparaître le problème, et sa solution
 * ---------------------------------------------------------------------------
 * Le tableau de x² contient aussi les négatifs : (−3)² = 9. Retourné, il dit
 * 9 → 3 ET 9 → −3 : deux sorties pour la même entrée, ce qu'une fonction
 * interdit. On garde la sortie POSITIVE — √9 = 3, jamais −3 — et l'on
 * découvre en même temps que √(a²) vaut |a| : la racine carrée efface le
 * signe. Les colonnes rejetées restent barrées à l'écran, sous les yeux.
 *
 * Et aucune entrée du tableau retourné n'est négative : un carré ne l'est
 * jamais. Voilà pourquoi la racine carrée d'un nombre négatif n'existe pas —
 * on le VOIT sur l'axe des abscisses, resté vide à gauche de 0.
 *
 * ---------------------------------------------------------------------------
 * Ce que la figure montre en plus
 * ---------------------------------------------------------------------------
 * Les deux courbes sont croissantes sur [0 ; +∞[, mais x² monte de plus en
 * plus vite et √x de moins en moins vite : c'est le même dessin vu de part
 * et d'autre de la diagonale. Le curseur « a » fait défiler la chaîne
 * a → a² → √(a²) et la compare à |a|, pour a négatif comme positif.
 *
 * Chaque étape de l'animation règle un état ABSOLU (jamais un incrément) :
 * « Précédent » rejoue donc exactement la même figure.
 */
MathsView.register({
  id: 'racine-carree',
  title: 'Racine carrée : la fonction carré retournée',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Racines carrées',
  theme: 'Nombres — √x n\'existe que pour x ⩾ 0, et √(a²) = |a|',
  description:
    'La <strong>racine carrée</strong> d\'un nombre positif \\( x \\) est le nombre ' +
    '<strong>positif</strong> dont le carré vaut \\( x \\). On la note \\( \\sqrt{x} \\).' +
    '<br>L\'animation remplit le <strong>tableau de valeurs</strong> de \\( f(x)=x^2 \\), ' +
    'trace sa courbe, puis <strong>duplique le tableau et le retourne</strong> : lire ' +
    '\\( x^2 \\) à l\'envers, c\'est chercher \\( \\sqrt{x} \\). Le retournement fait ' +
    'apparaître deux choses : \\( 9 \\) aurait deux racines, \\( 3 \\) et \\( -3 \\) — on ' +
    'garde la positive, d\'où \\( \\sqrt{a^2}=|a| \\) — et aucun nombre négatif n\'a de ' +
    'racine carrée.' +
    '<br>Le curseur <strong>a</strong> fait ensuite tourner la chaîne ' +
    '\\( a \\to a^2 \\to \\sqrt{a^2} \\) et la compare à \\( |a| \\).' +
    '<br><em>Le bouton <strong>▶ Animer</strong> déroule les sept étapes pas à pas ' +
    '(bouton <em>Suivante</em> ou barre espace).</em>',
  notes:
    '<ul>' +
    '<li><strong>La définition.</strong> Pour \\( x \\geqslant 0 \\), \\( \\sqrt{x} \\) est ' +
    '<em>le</em> nombre positif dont le carré vaut \\( x \\) : \\( \\sqrt{9}=3 \\) parce que ' +
    '\\( 3 \\geqslant 0 \\) et \\( 3^2=9 \\). Deux conditions, pas une : \\( -3 \\) a aussi ' +
    '\\( 9 \\) pour carré, mais il est négatif.</li>' +
    '<li><strong>Le tableau retourné.</strong> Le tableau de \\( x^2 \\) donne \\( 0\\to0 \\), ' +
    '\\( 1\\to1 \\), \\( 2\\to4 \\), \\( 3\\to9 \\)… Lu à l\'envers — \\( 0\\to0 \\), ' +
    '\\( 1\\to1 \\), \\( 4\\to2 \\), \\( 9\\to3 \\) — c\'est le tableau de \\( \\sqrt{x} \\). ' +
    'La courbe suit : celle de \\( \\sqrt{x} \\) est la courbe de \\( x^2 \\) (pour ' +
    '\\( x \\geqslant 0 \\)) <em>retournée</em> par rapport à la droite \\( y=x \\).</li>' +
    '<li><strong>Pourquoi pas les négatifs.</strong> Un carré n\'est jamais négatif : ' +
    'dans le tableau retourné, aucune entrée n\'est négative. \\( \\sqrt{-4} \\) n\'existe ' +
    'pas — il n\'y a aucun nombre dont le carré vaille \\( -4 \\). L\'ensemble de ' +
    'définition de \\( \\sqrt{x} \\) est \\( [0\\,;+\\infty[ \\).</li>' +
    '<li><strong>\\( \\sqrt{a^2}=|a| \\).</strong> Pour \\( a=-3 \\) : \\( a^2=9 \\) et ' +
    '\\( \\sqrt{9}=3=|-3| \\). Pour \\( a=5 \\) : \\( \\sqrt{25}=5=|5| \\). La racine carrée ' +
    'd\'un carré redonne le nombre <em>sans son signe</em>. Écrire \\( \\sqrt{a^2}=a \\) est ' +
    'faux dès que \\( a \\) est négatif.</li>' +
    '<li><strong>Deux croissances.</strong> Sur \\( [0\\,;+\\infty[ \\), \\( x^2 \\) et ' +
    '\\( \\sqrt{x} \\) sont toutes deux croissantes : plus \\( x \\) est grand, plus son carré ' +
    'et sa racine le sont. Mais \\( x^2 \\) monte de plus en plus vite (\\( 5^2=25 \\)) et ' +
    '\\( \\sqrt{x} \\) de moins en moins vite (\\( \\sqrt{25}=5 \\)) : c\'est la même courbe vue ' +
    'de part et d\'autre de la diagonale.</li>' +
    '<li><strong>Entre les colonnes.</strong> Le tableau ne donne que des carrés parfaits. ' +
    'La courbe, elle, donne tout : \\( \\sqrt{2} \\) existe (c\'est l\'abscisse \\( 2 \\) lue ' +
    'sur la courbe verte), mais ne s\'écrit pas avec une virgule — \\( \\sqrt{2}\\approx1{,}41 \\) ' +
    'n\'est qu\'un arrondi, \\( \\sqrt{2} \\) est la valeur exacte.</li>' +
    '</ul>',
  board: {
    boundingbox: [-7, 27, 27, -7],
    axis: true, grid: true, keepaspectratio: true,
    showNavigation: true
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Racine carrée',
    figures: [{
      legende: 'La courbe de √x est celle de x² retournée par rapport à y = x.',
      boundingbox: [-1.4, 10.4, 10.4, -1.4],
      keepaspectratio: true,
      axis: true,
      largeur: 52, hauteur: 52,
      dessine: function (board) {
        board.create('line', [[0, 0], [1, 1]], { straightFirst: true, straightLast: true, strokeColor: '#94a3b8', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return x * x; }, 0, 3.2], { strokeColor: '#0284c7', strokeWidth: 2.2, fixed: true, highlight: false });
        board.create('functiongraph', [function (x) { return Math.sqrt(x); }, 0, 10.3], { strokeColor: '#059669', strokeWidth: 2.2, fixed: true, highlight: false });
        [[2, 4], [3, 9]].forEach(function (p) {
          board.create('point', p, { name: '', size: 2.4, strokeColor: '#0284c7', fillColor: '#0284c7', fixed: true, highlight: false, showInfobox: false });
          board.create('point', [p[1], p[0]], { name: '', size: 2.4, strokeColor: '#059669', fillColor: '#059669', fixed: true, highlight: false, showInfobox: false });
        });
        board.create('segment', [[3, 9], [9, 3]], { strokeColor: '#dc2626', strokeWidth: 1.2, dash: 1, fixed: true, highlight: false });
        board.create('text', [3.3, 9.4, '(3 ; 9)'], { anchorX: 'left', anchorY: 'middle', fontSize: 10, color: '#0284c7', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [9.1, 2.3, '(9 ; 3)'], { anchorX: 'right', anchorY: 'top', fontSize: 10, color: '#059669', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [0.4, 9.2, 'y = x²'], { anchorX: 'left', anchorY: 'middle', fontSize: 11, color: '#0284c7', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [7.6, 3.6, 'y = √x'], { anchorX: 'left', anchorY: 'bottom', fontSize: 11, color: '#059669', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [8.4, 9.0, 'y = x'], { anchorX: 'left', anchorY: 'middle', fontSize: 10, color: '#64748b', fixed: true, highlight: false });
      }
    }],
    points: [
      'La <b>racine carrée</b> d\'un nombre positif x est le nombre <b>positif</b> dont le carré vaut x. Notation : \\( \\sqrt{x} \\).',
      '\\( \\sqrt{x} \\) n\'existe que pour x ⩾ 0 : un carré n\'est jamais négatif, donc aucun nombre négatif n\'a de racine carrée.',
      'Le tableau de \\( \\sqrt{x} \\) est le tableau de x² lu à l\'envers : 0 → 0, 1 → 1, 4 → 2, 9 → 3, 16 → 4, 25 → 5.',
      'Pour tout nombre a : \\( \\sqrt{a^2} = |a| \\). La racine carrée efface le signe.',
      'x² et \\( \\sqrt{x} \\) sont croissantes sur [0 ; +∞[ : x² monte de plus en plus vite, \\( \\sqrt{x} \\) de moins en moins vite.'
    ],
    exemples: [
      '\\( \\sqrt{9} = 3 \\) car 3 ⩾ 0 et 3² = 9. Pas −3 : la racine carrée est toujours positive.',
      '\\( \\sqrt{(-3)^2} = \\sqrt{9} = 3 = |-3| \\) ; \\( \\sqrt{5^2} = 5 \\) ; \\( \\sqrt{(-7)^2} = 7 \\).',
      '\\( \\sqrt{2} \\approx 1{,}41 \\) (valeur exacte : \\( \\sqrt{2} \\)) ; \\( \\sqrt{-4} \\) n\'existe pas.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var XS = [];                       // les x du tableau de x² : −5, −4, … 5
    for (var k = -5; k <= 5; k++) XS.push(k);
    var N = XS.length;
    var PROPRES = [0, 1, 2, 3, 4, 5];  // les x ⩾ 0 : le tableau de √x, une fois nettoyé

    // Avancement de l'animation. Ces sept nombres pilotent TOUTE la figure :
    //   shown   0 → N : cases x² écrites dans le tableau
    //   plotted 0 → N : points (x ; x²) placés
    //   traced  0 → 1 : fraction de la courbe de x² tracée
    //   copied  0 → 1 : la copie du tableau (et des points) apparaît
    //   flip    0 → 1 : la copie se retourne — (x ; x²) glisse vers (x² ; x)
    //   rejet   0 → 1 : les doublons venus des x négatifs s'effacent
    //   propre  0 → 1 : le tableau de √x, nettoyé, apparaît
    var shown = 0, plotted = 0, traced = 0, copied = 0, flip = 0, rejet = 0, propre = 0;
    var A = -3;                        // le nombre du curseur, pour √(a²) = |a|

    var C_CARRE = '#0284c7';           // bleu : la fonction carré
    var C_RAC   = '#059669';           // vert : la copie, qui devient √x
    var C_GHOST = '#ea580c';           // orange : les doublons à rejeter
    var C_DIAG  = '#94a3b8';           // gris : la droite y = x
    var C_CUR   = '#dc2626';           // rouge : le nombre a du curseur
    var C_WARN  = '#b45309';           // ambre : « pas de racine carrée ici »

    // Le retournement, adouci aux deux bouts. C'est une fonction de l'état,
    // jamais un compteur : rejouer donne la même position.
    function ease(t) { return t * t * (3 - 2 * t); }
    function q() { return ease(flip); }
    function sq(x) { return x * x; }
    function nb(v) { return String(v).replace('-', '−'); }

    // Ne pose un attribut que s'il change : la figure est rafraîchie à chaque
    // frame d'animation.
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var a = {}; a[key] = val;
        o.setAttribute(a);
      }
    }

    /* ==================================================================== */
    /* La figure                                                            */
    /* ==================================================================== */
    var PT_ATTR = { size: 4, face: 'o', fixed: true, highlight: false,
                    withLabel: false, showInfobox: false, visible: false };

    // Les 11 points (x ; x²) du tableau : ils ne bougent jamais.
    var PTS = XS.map(function (x) {
      var o = {}; Object.keys(PT_ATTR).forEach(function (k) { o[k] = PT_ATTR[k]; });
      o.fillColor = C_CARRE; o.strokeColor = C_CARRE; o.layer = 10;
      return board.create('point', [x, sq(x)], o);
    });

    // Leur copie : posée sur eux, puis glissant vers (x² ; x) avec le
    // retournement. Ceux qui viennent d'un x négatif finissent SOUS l'axe :
    // ce sont les doublons.
    var CP = XS.map(function (x) {
      var o = {}; Object.keys(PT_ATTR).forEach(function (k) { o[k] = PT_ATTR[k]; });
      o.fillColor = C_RAC; o.strokeColor = C_RAC; o.layer = 11;
      return board.create('point', [
        function () { var t = q(); return (1 - t) * x + t * sq(x); },
        function () { var t = q(); return (1 - t) * sq(x) + t * x; }
      ], o);
    });

    // La courbe de x², en deux branches tracées depuis 0 vers les bords.
    function courbe(xf, yf, tmin, tmax, couleur, layer) {
      return board.create('curve', [xf, yf, tmin, tmax], {
        strokeWidth: 3, strokeColor: couleur, highlight: false, visible: false, layer: layer
      });
    }
    var cPos = courbe(function (t) { return t; }, sq, 0, function () { return 5 * traced; }, C_CARRE, 8);
    var cNeg = courbe(function (t) { return t; }, sq, function () { return -5 * traced; }, 0, C_CARRE, 8);

    // Sa copie, qui se retourne : (t ; t²) → (t² ; t).
    function cx(t) { var s = q(); return (1 - s) * t + s * sq(t); }
    function cy(t) { var s = q(); return (1 - s) * sq(t) + s * t; }
    var kPos = courbe(cx, cy, 0, 5, C_RAC, 9);
    var kNeg = courbe(cx, cy, -5, 0, C_RAC, 9);

    // La droite y = x, l'axe du retournement.
    var diag = board.create('line', [[0, 0], [1, 1]], {
      straightFirst: true, straightLast: true, strokeColor: C_DIAG, strokeWidth: 1.5,
      dash: 2, fixed: true, highlight: false, visible: false, layer: 5
    });

    // La partie négative de l'axe des abscisses, quand on constate qu'elle
    // reste vide : aucun nombre négatif n'a de racine carrée.
    var interdit = board.create('segment', [[-7, 0], [0, 0]], {
      strokeColor: '#f59e0b', strokeWidth: 6, strokeOpacity: 0.55, fixed: true,
      highlight: false, visible: false, layer: 4
    });

    function label(x, y, txt, couleur, opts) {
      var o = { anchorX: 'left', anchorY: 'middle', fontSize: 13, color: couleur,
                cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 12 };
      Object.keys(opts || {}).forEach(function (k) { o[k] = opts[k]; });
      return board.create('text', [x, y, txt], o);
    }
    var labCarre = label(5.6, 25, 'y = x²', C_CARRE);
    var labRac   = label(25, 6.6, 'y = √x', C_RAC, { anchorX: 'right', anchorY: 'bottom' });
    var labDiag  = label(21.5, 20.3, 'y = x', C_DIAG, { anchorY: 'top' });
    var labNo    = label(-3.5, 1.4, 'pas de racine carrée', C_WARN,
                         { anchorX: 'middle', anchorY: 'bottom', fontSize: 12 });
    var labGhost = label(10, -3.6, '9 → −3 ? non : une seule image', C_GHOST,
                         { anchorX: 'left', anchorY: 'top', fontSize: 12 });

    // Le nombre a du curseur, lu sur les deux courbes : (a ; a²) puis (a² ; |a|).
    var pA = board.create('point', [function () { return A; }, function () { return sq(A); }], {
      name: '', size: 5, fillColor: C_CUR, strokeColor: '#b91c1c', strokeWidth: 2,
      fixed: true, highlight: false, showInfobox: false, visible: false, layer: 13
    });
    var pR = board.create('point', [function () { return sq(A); }, function () { return Math.abs(A); }], {
      name: '', size: 5, fillColor: C_CUR, strokeColor: '#b91c1c', strokeWidth: 2,
      fixed: true, highlight: false, showInfobox: false, visible: false, layer: 13
    });
    var segAR = board.create('segment', [pA, pR], {
      strokeColor: C_CUR, strokeWidth: 1.5, dash: 2, fixed: true, highlight: false,
      visible: false, layer: 12
    });
    var labA = board.create('text', [
      function () { return A + (A < 0 ? -0.6 : 0.6); }, function () { return sq(A) + 1.2; },
      function () { return 'a = ' + nb(A); }
    ], { anchorX: A < 0 ? 'right' : 'left', anchorY: 'bottom', fontSize: 13, color: C_CUR,
         cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 13 });
    var labR = board.create('text', [
      function () { return sq(A) + 0.8; }, function () { return Math.abs(A) - 0.6; },
      function () { return '√(a²) = ' + Math.abs(A); }
    ], { anchorX: 'left', anchorY: 'top', fontSize: 13, color: C_CUR,
         cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 13 });

    /* ==================================================================== */
    /* Rafraîchissement de la figure                                        */
    /* ==================================================================== */
    // La colonne « en cours » : celle qu'on remplit, puis celle qu'on place.
    function hotCol() {
      if (plotted > 0 && plotted < N) return Math.floor(plotted);
      if (shown > 0 && shown < N) return Math.floor(shown);
      return -1;
    }

    /* Le rafraîchissement est appelé AVANT board.update(), jamais depuis son
       événement « update » : des attributs posés pendant l'update ne
       recalculent pas la géométrie des objets encore invisibles. */
    function refresh() {
      var upTo = Math.floor(plotted + 1e-9);
      PTS.forEach(function (pt, i) { attr(pt, 'visible', i < upTo); });

      attr(cPos, 'visible', traced > 0);
      attr(cNeg, 'visible', traced > 0);
      attr(labCarre, 'visible', traced >= 1);

      // La copie : verte, et ses doublons orange dès que le retournement
      // commence, effacés quand on les rejette.
      var vis = copied > 0, ghostOn = flip > 0;
      var op = Math.max(0, 1 - rejet);
      CP.forEach(function (pt, i) {
        var neg = XS[i] < 0;
        attr(pt, 'visible', vis && (!neg || rejet < 1));
        attr(pt, 'fillColor', neg && ghostOn ? C_GHOST : C_RAC);
        attr(pt, 'strokeColor', neg && ghostOn ? C_GHOST : C_RAC);
        attr(pt, 'fillOpacity', neg ? op : 1);
        attr(pt, 'strokeOpacity', neg ? op : 1);
      });
      attr(kPos, 'visible', vis);
      attr(kNeg, 'visible', vis && rejet < 1);
      attr(kNeg, 'strokeColor', ghostOn ? C_GHOST : C_RAC);
      attr(kNeg, 'strokeOpacity', op);
      attr(kNeg, 'dash', ghostOn ? 2 : 0);

      attr(diag, 'visible', flip > 0);
      attr(labDiag, 'visible', flip > 0);
      attr(labRac, 'visible', flip >= 1);
      attr(labGhost, 'visible', flip >= 1 && rejet < 1);
      attr(interdit, 'visible', rejet >= 1);
      attr(labNo, 'visible', rejet >= 1);

      var fin = propre >= 1;
      [pA, pR, segAR, labA, labR].forEach(function (o) { attr(o, 'visible', fin); });
      attr(labA, 'anchorX', A < 0 ? 'right' : 'left');

      renderTables();
      renderPanel();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Les tableaux de valeurs (HTML)                                       */
    /* ==================================================================== */
    var tables = document.createElement('div');
    tables.className = 'rc-tables';
    var t1 = document.createElement('div'); t1.className = 'fx-tablewrap rc-t1';
    var t2 = document.createElement('div'); t2.className = 'fx-tablewrap rc-copy';
    var t3 = document.createElement('div'); t3.className = 'fx-tablewrap rc-t3';
    tables.appendChild(t1); tables.appendChild(t2); tables.appendChild(t3);
    var last = { t1: '', t2: '', t3: '' };

    function row(head, cells, cls) {
      return '<tr><th' + (cls ? ' class="' + cls + '"' : '') + '>' + head + '</th>' + cells + '</tr>';
    }
    function td(cls, val, i) {
      return '<td data-i="' + i + '" class="' + cls + '">' + val + '</td>';
    }

    // Le tableau de x², tel qu'il se remplit.
    function htmlCarre(upTo, hc) {
      var rx = '', rf = '';
      XS.forEach(function (x, i) {
        var hot = i === hc ? ' is-hot' : '';
        rx += td('fx-x' + hot, nb(x), i);
        rf += td('fx-fx' + hot, i < upTo ? nb(sq(x)) : '', i);
      });
      return '<table class="fx-table rc-table">' + row('x', rx) + row('x²', rf, 'fx-head-f') + '</table>' +
             '<div class="rc-cap" style="color:' + C_CARRE + '">f(x) = x²</div>';
    }

    // Sa copie retournée : les carrés en entrée, les x en sortie. Les colonnes
    // venues d'un x négatif sont des doublons : marquées, puis barrées.
    function htmlRetourne() {
      var rx = '', rf = '';
      XS.forEach(function (x, i) {
        var cls = x < 0 ? (flip >= 1 ? ' is-ghost' : '') + (rejet >= 1 ? ' is-rejete' : '') : '';
        rx += td('fx-x' + cls, nb(sq(x)), i);
        rf += td('fx-fx' + cls, nb(x), i);
      });
      var cap = rejet >= 1
        ? 'Retourné : 9 → 3 et 9 → −3 ? Une entrée, une seule sortie — on garde la positive.'
        : flip >= 1 ? 'Retourné : les carrés en entrée, les x en sortie. Mais 9 sort deux fois…'
        : 'On retourne la copie…';
      return '<table class="fx-table rc-table">' + row('x', rx) + row('√x', rf, 'fx-head-f') + '</table>' +
             '<div class="rc-cap" style="color:' + C_RAC + '">' + cap + '</div>';
    }

    function htmlPropre() {
      var rx = '', rf = '';
      PROPRES.forEach(function (x, i) {
        rx += td('fx-x', nb(sq(x)), i);
        rf += td('fx-fx', nb(x), i);
      });
      return '<table class="fx-table rc-table">' + row('x', rx) + row('√x', rf, 'fx-head-f') + '</table>' +
             '<div class="rc-cap" style="color:' + C_RAC + '">f(x) = √x — la racine carrée : ' +
             'le nombre positif dont le carré vaut x</div>';
    }

    function renderTables() {
      var hc = hotCol();
      var h1 = htmlCarre(Math.floor(shown + 1e-9), hc);
      if (h1 !== last.t1) { last.t1 = h1; t1.innerHTML = h1; }

      // La copie apparaît, puis bascule : jusqu'à mi-course on voit son
      // recto (le tableau de x²), ensuite son verso (le tableau retourné),
      // remis à l'endroit pour que ça se lise.
      var h2 = copied <= 0 ? '' : flip < 0.5 ? htmlCarre(N, -1) : htmlRetourne();
      if (h2 !== last.t2) { last.t2 = h2; t2.innerHTML = h2; }
      var angle = 180 * q();
      if (flip >= 0.5) angle -= 180;
      t2.style.opacity = String(copied);
      t2.style.transform = 'rotateX(' + angle.toFixed(1) + 'deg)';

      var h3 = propre > 0 ? htmlPropre() : '';
      if (h3 !== last.t3) { last.t3 = h3; t3.innerHTML = h3; }
      t3.style.opacity = String(propre);
    }

    /* ==================================================================== */
    /* Le panneau : où en est-on, et la chaîne a → a² → √(a²)               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel rc-panel';
    var lastPanel = '';

    function stage() {
      if (propre > 0) return 'fin';
      if (rejet > 0) return 'rejet';
      if (flip >= 1) return 'retourne';
      if (flip > 0) return 'flip';
      if (copied > 0) return 'copie';
      if (traced >= 1) return 'courbe';
      if (plotted > 0) return 'points';
      if (shown > 0) return 'tableau';
      return 'vide';
    }

    var RECIT = {
      vide: 'Lance l\'animation : le tableau de x² se remplit, puis on le retourne.',
      tableau: 'Le tableau de <b>f(x) = x²</b> : à chaque x son carré. Remarque que ' +
               '<b>(−3)² = 3² = 9</b> — deux x différents, le même carré.',
      points: 'Chaque colonne devient un point <b>(x ; x²)</b> du repère.',
      courbe: 'La courbe de x² passe par tous ces points. Elle est <b>croissante</b> pour ' +
              'x ⩾ 0, et monte de plus en plus vite : de 4 à 5, elle grimpe de 16 à 25.',
      copie: 'On <b>duplique</b> le tableau et les points : la copie, en vert, va servir à ' +
             'fabriquer une nouvelle fonction.',
      flip: 'On <b>retourne</b> la copie : la ligne des carrés passe en entrée, la ligne des ' +
            'x en sortie. Dans le repère, chaque point (x ; x²) glisse vers <b>(x² ; x)</b> — ' +
            'une symétrie par rapport à la droite y = x.',
      retourne: 'Lire le tableau retourné, c\'est chercher <b>« le nombre dont le carré ' +
                'vaut … »</b> : voilà la racine carrée. Mais il y a un problème : ' +
                '<b>9 sort deux fois</b>, vers 3 et vers −3. Une fonction ne peut donner ' +
                'qu\'<b>une seule</b> image.',
      rejet: 'On garde la sortie <b>positive</b> : <b>√9 = 3</b>, jamais −3. Et regarde ' +
             'l\'axe des abscisses : rien à gauche de 0. Un carré n\'est jamais négatif, ' +
             'donc <b>aucun nombre négatif n\'a de racine carrée</b>.',
      fin: 'Le tableau de <b>√x</b> est le tableau de x² lu à l\'envers, et sa courbe est ' +
           'celle de x² retournée. Elle aussi est <b>croissante</b>, mais de moins en ' +
           'moins vite : de 16 à 25, elle ne monte que de 4 à 5.'
    };

    function chaine() {
      var a = A, c = sq(a), r = Math.abs(a);
      var h = '<div class="props-label">La chaîne, pour a = ' + nb(a) + '</div>' +
        '<div class="rc-chain">' +
          '<span class="rc-in">a = ' + nb(a) + '</span><span class="rc-arrow">→</span>' +
          '<span class="rc-mid">a² = ' + c + '</span><span class="rc-arrow">→</span>' +
          '<span class="rc-out">√(a²) = √' + c + ' = ' + r + '</span>' +
        '</div>' +
        '<p class="rc-abs">et <b>|a| = |' + nb(a) + '| = ' + r + '</b> : ' +
        (a < 0
          ? 'la racine carrée a <b>effacé le signe</b>. √(' + nb(a) + ')² = ' + r + ', pas ' + nb(a) + '.'
          : a === 0
          ? 'pour a = 0, tout vaut 0.'
          : 'a est déjà positif, la racine carrée le redonne tel quel.') +
        '</p>';
      return h;
    }

    function renderPanel() {
      var s = stage();
      var h = '<div class="props-name">' + (s === 'fin' || s === 'rejet' ? 'La racine carrée' : 'La fonction carré') + '</div>' +
              '<p class="rc-recit">' + RECIT[s] + '</p>';
      if (s === 'fin') {
        h += chaine() +
             '<div class="props-label">À retenir</div>' +
             '<p class="rc-note"><b>√x</b> est le nombre <b>positif</b> dont le carré vaut x ; ' +
             'il n\'existe que pour <b>x ⩾ 0</b>. Et pour tout a : <b>√(a²) = |a|</b>.</p>';
      }
      if (h !== lastPanel) { lastPanel = h; panel.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Animation : tableau → points → courbe → copie → retournement →       */
    /*             rejet des doublons → tableau de √x                        */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function reset() {
      shown = 0; plotted = 0; traced = 0; copied = 0; flip = 0; rejet = 0; propre = 0;
      redraw();
    }
    function play() {
      anim.cancel();
      reset();
      anim.runSteps([
        { dur: 2500, step: function (p) { shown = p * N; refresh(); },
          after: function () { shown = N; redraw(); } },
        { dur: 2000, step: function (p) { plotted = p * N; refresh(); },
          after: function () { plotted = N; redraw(); } },
        { dur: 1400, step: function (p) { traced = p; refresh(); },
          after: function () { traced = 1; redraw(); } },
        { dur: 800,  step: function (p) { copied = p; refresh(); },
          after: function () { copied = 1; redraw(); } },
        { dur: 2200, step: function (p) { flip = p; refresh(); },
          after: function () { flip = 1; redraw(); } },
        { dur: 1200, step: function (p) { rejet = p; refresh(); },
          after: function () { rejet = 1; redraw(); } },
        { dur: 800,  step: function (p) { propre = p; refresh(); },
          after: function () { propre = 1; redraw(); } }
      ], reset);
    }
    function showAll() {
      anim.cancel();
      shown = N; plotted = N; traced = 1; copied = 1; flip = 1; rejet = 1; propre = 1;
      redraw();
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: showAll },
      { type: 'slider', id: 'a', label: 'a', min: -5, max: 5, step: 1, value: A,
        onInput: function (v) { A = Math.round(v); redraw(); } }
    ]);

    mv.extras.appendChild(tables);
    mv.extras.appendChild(panel);

    play();            // charge les étapes : en pas à pas, la figure attend l'appui
  }
});
