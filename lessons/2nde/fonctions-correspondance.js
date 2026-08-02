/*
 * De x à f(x) : le tableau de valeurs, puis la courbe (2nde).
 *
 * La leçon d'entrée du chapitre « Fonctions » : une fonction, c'est un procédé
 * qui, à chaque nombre x, associe UN SEUL nombre f(x). Tout part de là.
 *
 * L'animation raconte la même histoire en trois temps, dans cet ordre :
 *
 *   1) le TABLEAU DE VALEURS se remplit, colonne par colonne : pour chaque x
 *      de −5 à 5, on calcule f(x) et on l'écrit en face ;
 *   2) chaque colonne devient un POINT du repère, de coordonnées (x ; f(x)) ;
 *   3) la COURBE est tracée : elle passe exactement par ces points.
 *
 * Une fois la courbe tracée, le point rouge se déplace le long de l'axe des
 * abscisses : les pointillés font la lecture graphique de f(x), y compris pour
 * des x qui ne sont PAS dans le tableau (c'est tout l'intérêt de la courbe).
 *
 * Les fonctions proposées ne sont pas écrites ici : elles viennent du pool
 * commun js/fonctions-base.js. En ajouter une là-bas la fait apparaître ici,
 * avec ses paramètres, son domaine et ses calculs détaillés.
 */
MathsView.register({
  id: 'fonctions-correspondance',
  title: 'De x à f(x) : tableau et courbe',
  level: '2nde',
  category: 'analyse',
  subcategory: 'Fonctions',
  theme: 'Fonctions — image, tableau de valeurs et courbe représentative',
  description:
    'Une <strong>fonction</strong> \\(f\\) est une machine à transformer les nombres : ' +
    'à chaque nombre \\(x\\) elle associe <strong>un seul</strong> nombre, noté ' +
    '\\(f(x)\\) et appelé l\'<strong>image</strong> de \\(x\\).' +
    '<br><strong>Choisis une fonction</strong>, puis lance l\'animation : le ' +
    '<strong>tableau de valeurs</strong> se remplit colonne par colonne, chaque ' +
    'colonne devient un <strong>point</strong> \\((x\\,;f(x))\\) du repère, et la ' +
    '<strong>courbe</strong> vient enfin passer par tous ces points.' +
    '<br>Ensuite, <strong>déplace le point rouge</strong> sur l\'axe des abscisses (ou ' +
    'clique sur une colonne du tableau) : les pointillés lisent \\(f(x)\\) sur la courbe, ' +
    'même pour un \\(x\\) qui n\'est pas dans le tableau.' +
    '<br><em>Le bouton <strong>▶ Animer</strong> déroule les trois étapes pas à pas ' +
    '(bouton <em>Suivante</em> ou barre espace).</em>',
  notes:
    '<ul>' +
    '<li><strong>Le vocabulaire.</strong> Si \\(f(3)=9\\), on dit que \\(9\\) est ' +
    '<strong>l\'image</strong> de \\(3\\) par \\(f\\), et que \\(3\\) est ' +
    '<strong>un antécédent</strong> de \\(9\\). Attention à l\'article : l\'image est ' +
    'unique, alors qu\'un nombre peut avoir plusieurs antécédents ' +
    '(\\((-3)^2=3^2=9\\)) — ou aucun.</li>' +
    '<li><strong>Un seul f(x) pour chaque x.</strong> C\'est la règle du jeu : sur la ' +
    'courbe, une verticale ne peut jamais rencontrer deux points. Une machine qui ' +
    'renverrait deux résultats ne serait pas une fonction.</li>' +
    '<li><strong>Le tableau de valeurs.</strong> Ligne du haut : les \\(x\\) choisis. ' +
    'Ligne du bas : les images calculées. Un tableau ne donne qu\'un ' +
    '<em>échantillon</em> — ici 11 nombres — alors que la fonction en transforme une ' +
    'infinité. La courbe, elle, les montre tous.</li>' +
    '<li><strong>La courbe représentative.</strong> C\'est l\'ensemble des points de ' +
    'coordonnées \\((x\\,;f(x))\\). Un point est sur la courbe <em>si et seulement si</em> ' +
    'son ordonnée est l\'image de son abscisse.</li>' +
    '<li><strong>L\'ensemble de définition.</strong> Certains \\(x\\) n\'ont pas d\'image : ' +
    '\\(\\sqrt{x}\\) n\'existe pas pour \\(x&lt;0\\), et \\(\\frac{1}{x}\\) n\'existe pas pour ' +
    '\\(x=0\\) — on ne divise jamais par \\(0\\). Ces colonnes restent barrées dans le ' +
    'tableau, et la courbe s\'arrête là : elle ne commence qu\'en \\(0\\) pour la racine ' +
    'carrée, elle est coupée en <em>deux branches</em> pour l\'inverse.</li>' +
    '<li><strong>Lire une image.</strong> On part de \\(x\\) sur l\'axe des abscisses, on ' +
    'monte (ou on descend) jusqu\'à la courbe, puis on lit l\'ordonnée : c\'est ' +
    '\\(f(x)\\). Les pointillés de la figure font exactement ce trajet.</li>' +
    '<li><strong>Calculée ou lue ?</strong> La valeur <em>calculée</em> est exacte ' +
    '(\\(f(2)=\\sqrt2\\)), la valeur <em>lue</em> sur un graphique est approchée ' +
    '(\\(\\approx 1{,}41\\)). Le signe \\(\\approx\\) du tableau signale les images qu\'on ' +
    'ne peut écrire qu\'arrondies.</li>' +
    '<li><strong>Le repère.</strong> Coché, « repère orthonormé » impose la même unité ' +
    'sur les deux axes : c\'est la vraie forme de la courbe. Décoché, la figure étire ' +
    'l\'axe des abscisses pour mieux voir la fonction carré, qui monte jusqu\'à ' +
    '\\(f(5)=25\\) — c\'est ce que font les manuels, mais les distances y sont ' +
    'déformées.</li>' +
    '</ul>',
  board: {
    boundingbox: [-6.5, 6.5, 6.5, -6.5],
    axis: true, grid: true, keepaspectratio: true,
    showNavigation: true
  },

  setup: function (board, mv) {
    var POOL = MathsView.fonctions;
    var FN = POOL.liste();

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var XS = [];                       // les abscisses du tableau : −5, −4, … 5
    for (var k = -5; k <= 5; k++) XS.push(k);
    var N = XS.length;

    var sel = 0;                       // fonction choisie (indice dans FN)
    var par = POOL.defauts(FN[0]);     // valeurs de ses paramètres : { a: 2, b: -1 }

    // Avancement de l'animation. Ces trois nombres pilotent TOUTE la figure :
    //   shown   0 → N : nombre de cases f(x) écrites dans le tableau
    //   plotted 0 → N : nombre de points placés dans le repère
    //   traced  0 → 1 : fraction de la courbe tracée
    var shown = 0, plotted = 0, traced = 0;
    var ortho = true;                  // même unité sur les deux axes

    function fn() { return FN[sel]; }
    function F(x)  { return POOL.valeur(fn(), x, par); }
    function ok(x) { return POOL.defini(fn(), x, par); }
    function nb(v, d) { return POOL.nb(v, d); }

    // Les morceaux de [−5 ; 5] où la fonction est définie, un par branche de la
    // courbe : [[0 ; 5]] pour √x, [[−5 ; 0[, ]0 ; 5]] pour 1/x.
    function brs() { return POOL.branches(fn(), -5, 5); }

    var C_CUR = '#dc2626';             // le rouge du curseur de lecture
    var SOFT = '#64748b';              // le gris des traits de construction

    // Ne pose un attribut que s'il change : la figure est rafraîchie à chaque
    // frame d'animation et à chaque déplacement du curseur.
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

    // Les 11 points du tableau. Leurs coordonnées sont des FONCTIONS : ils
    // suivent tout seuls le changement de fonction ou de paramètre.
    var PTS = XS.map(function (x) {
      return board.create('point', [x, function () { return ok(x) ? F(x) : 0; }], {
        size: 4, face: 'o', fixed: true, highlight: false,
        withLabel: false, showInfobox: false, visible: false, layer: 10
      });
    });

    /* La courbe, tracée progressivement : la borne droite de chaque morceau
       avance avec `traced`. Une fonction peut avoir un TROU (1/x en 0) : sa
       courbe est alors faite de plusieurs branches, tracées chacune par une
       courbe distincte — sinon un trait vertical viendrait les relier. On
       prépare le nombre maximal de branches du pool ; les inutiles restent
       invisibles. */
    var NB_BR = 1;
    FN.forEach(function (f) { NB_BR = Math.max(NB_BR, (f.trous || []).length + 1); });

    var courbes = [];
    for (var b = 0; b < NB_BR; b++) {
      courbes.push(board.create('curve', [
        function (t) { return t; },
        function (t) { return F(t); },
        (function (i) { return function () { var m = brs()[i]; return m ? m[0] : 0; }; })(b),
        (function (i) {
          return function () {
            var m = brs()[i];
            return m ? m[0] + traced * (m[1] - m[0]) : 0;
          };
        })(b)
      ], { strokeWidth: 3, strokeColor: FN[0].couleur, highlight: false,
           visible: false, layer: 8 }));
    }

    // Le trait vertical qui accompagne le point en cours de placement : il
    // relie l'abscisse lue dans le tableau au point (x ; f(x)).
    var guideX = { v: 0 };
    var gBas = board.create('point', [function () { return guideX.v; }, 0], { visible: false });
    var gHaut = board.create('point', [
      function () { return guideX.v; },
      function () { return ok(guideX.v) ? F(guideX.v) : 0; }
    ], { visible: false });
    var guide = board.create('segment', [gBas, gHaut], {
      strokeColor: SOFT, strokeWidth: 1.5, dash: 2, highlight: false,
      fixed: true, visible: false, layer: 7
    });

    /* Le curseur de lecture ------------------------------------------------ */
    // Un rail invisible posé sur l'axe des abscisses : le point rouge y glisse
    // sans pouvoir sortir de [−5 ; 5].
    var rail = board.create('segment', [[-5, 0], [5, 0]], { visible: false, fixed: true });
    var P = board.create('glider', [3, 0, rail], {
      name: '', size: 5, fillColor: C_CUR, strokeColor: '#b91c1c', strokeWidth: 2,
      showInfobox: false, snapToGrid: true, snapSizeX: 0.5, visible: false, layer: 12
    });
    // M = (x ; f(x)) : le point de la courbe qu'on est en train de lire.
    var M = board.create('point', [
      function () { return P.X(); },
      function () { return ok(P.X()) ? F(P.X()) : 0; }
    ], { name: '', size: 4.5, fillColor: C_CUR, strokeColor: '#b91c1c', strokeWidth: 2,
         fixed: true, highlight: false, showInfobox: false, visible: false, layer: 12 });
    // Le pied de l'ordonnée, sur l'axe vertical.
    var Y0 = board.create('point', [0, function () { return ok(P.X()) ? F(P.X()) : 0; }],
      { visible: false });

    var segV = board.create('segment', [P, M], {
      strokeColor: C_CUR, strokeWidth: 2, dash: 2, highlight: false, visible: false, layer: 11
    });
    var segH = board.create('segment', [M, Y0], {
      strokeColor: C_CUR, strokeWidth: 2, dash: 2, highlight: false, visible: false, layer: 11
    });

    // Décalages des étiquettes, exprimés en fraction de la fenêtre : ils
    // restent lisibles quel que soit le zoom (la fonction carré dézoome fort).
    function bb() { return board.getBoundingBox(); }
    function dy() { return (bb()[1] - bb()[3]) * 0.04; }
    function dx() { return (bb()[2] - bb()[0]) * 0.015; }

    var labX = board.create('text', [
      function () { return P.X(); }, function () { return -dy(); },
      function () { return 'x = ' + nb(P.X(), 1); }
    ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: C_CUR,
         cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 12 });

    var labY = board.create('text', [
      function () { return -dx(); }, function () { return ok(P.X()) ? F(P.X()) : 0; },
      function () {
        if (!ok(P.X())) return '';
        var v = F(P.X());
        return (POOL.exact(v) ? '' : '≈ ') + nb(v);
      }
    ], { anchorX: 'right', anchorY: 'middle', fontSize: 13, color: C_CUR,
         cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 12 });

    // Message affiché à la place de la lecture quand x n'a pas d'image (√ des négatifs).
    var labNo = board.create('text', [
      function () { return P.X(); }, function () { return dy() * 1.2; },
      function () { return 'pas d\'image'; }
    ], { anchorX: 'middle', anchorY: 'bottom', fontSize: 12, color: '#b45309',
         cssStyle: 'font-weight:700', fixed: true, highlight: false, visible: false, layer: 12 });

    /* ==================================================================== */
    /* Cadrage de la fenêtre                                                */
    /*                                                                      */
    /* On calcule la hauteur nécessaire pour que TOUS les points du tableau  */
    /* tiennent à l'écran (la fonction carré monte jusqu'à 25). En repère    */
    /* orthonormé, JSXGraph élargit alors l'axe des abscisses d'autant : la  */
    /* courbe paraît plus étroite, mais les unités restent égales.          */
    /* ==================================================================== */
    function fitView() {
      var ys = [0];
      XS.forEach(function (x) { if (ok(x)) ys.push(F(x)); });
      var hi = Math.max.apply(null, ys), lo = Math.min.apply(null, ys);
      var m = Math.max(1, (hi - lo) * 0.12);
      if (board.setAttribute) board.setAttribute({ keepaspectratio: ortho });
      board.setBoundingBox([-6.5, hi + m, 6.5, lo - m], ortho);
    }

    /* ==================================================================== */
    /* Rafraîchissement de la figure                                        */
    /* ==================================================================== */

    // La colonne « en cours » : celle qu'on est en train de remplir, puis celle
    // qu'on est en train de placer. −1 quand rien ne bouge.
    function hotCol() {
      if (plotted > 0 && plotted < N) return Math.floor(plotted);
      if (shown > 0 && shown < N) return Math.floor(shown);
      return -1;
    }
    // La colonne pointée par le curseur de lecture (si son abscisse est entière).
    function readCol() {
      if (!cursorOn()) return -1;
      var x = Math.round(P.X());
      return (Math.abs(P.X() - x) < 1e-6 && x >= -5 && x <= 5) ? x + 5 : -1;
    }
    function cursorOn() { return traced >= 1; }

    function refresh() {
      var f = fn();

      // Les points du tableau, dans l'ordre.
      var upTo = Math.floor(plotted + 1e-9);
      PTS.forEach(function (pt, i) {
        attr(pt, 'visible', i < upTo && ok(XS[i]));
        attr(pt, 'fillColor', f.couleur);
        attr(pt, 'strokeColor', f.couleur);
      });

      // Le trait qui montre d'où vient le point en cours de placement.
      var hc = hotCol();
      var placing = plotted > 0 && plotted < N && hc >= 0 && ok(XS[hc]);
      if (placing) guideX.v = XS[hc];
      attr(guide, 'visible', placing);

      // La courbe, branche par branche.
      var nbr = brs().length;
      courbes.forEach(function (c, i) {
        attr(c, 'visible', traced > 0 && i < nbr);
        attr(c, 'strokeColor', f.couleur);
      });

      // Le curseur de lecture : il n'apparaît qu'une fois la courbe tracée.
      var on = cursorOn(), def = on && ok(P.X());
      attr(P, 'visible', on);
      attr(M, 'visible', def);
      attr(segV, 'visible', def);
      attr(segH, 'visible', def);
      attr(labX, 'visible', on);
      attr(labY, 'visible', def);
      attr(labNo, 'visible', on && !def);

      renderTable();
      renderPanel();
    }

    /* ==================================================================== */
    /* Le tableau de valeurs (HTML)                                         */
    /* ==================================================================== */
    var wrap = document.createElement('div');
    wrap.className = 'fx-tablewrap';
    var lastTable = '';

    // Le contenu d'une case f(x) : la valeur, arrondie et signalée par ≈ si
    // elle ne tombe pas juste, ou une croix quand x n'a pas d'image.
    function cellFx(x) {
      if (!ok(x)) return '<span class="fx-no">✗</span>';
      var v = F(x);
      return (POOL.exact(v) ? '' : '<span class="fx-approx">≈</span>') + nb(v);
    }

    function renderTable() {
      var upTo = Math.floor(shown + 1e-9), hc = hotCol(), rc = readCol();
      var rx = '', rf = '';
      XS.forEach(function (x, i) {
        var cls = (i === rc ? ' is-read' : '') + (i === hc ? ' is-hot' : '');
        rx += '<td data-i="' + i + '" class="fx-x' + cls + '">' + nb(x) + '</td>';
        rf += '<td data-i="' + i + '" class="fx-fx' + cls +
              (ok(x) ? '' : ' is-undef') + '">' +
              (i < upTo ? cellFx(x) : '') + '</td>';
      });
      var html =
        '<table class="fx-table">' +
          '<tr><th>x</th>' + rx + '</tr>' +
          '<tr><th class="fx-head-f">f(x)</th>' + rf + '</tr>' +
        '</table>';
      if (html !== lastTable) { lastTable = html; wrap.innerHTML = html; }
    }

    // Un clic sur une colonne : on affiche tout, puis on y amène le curseur.
    wrap.addEventListener('click', function (e) {
      var td = e.target.closest ? e.target.closest('td[data-i]') : null;
      if (!td) return;
      var i = parseInt(td.dataset.i, 10);
      if (!cursorOn()) showAll();
      P.moveTo([XS[i], 0], 250);
      board.update();
    });

    /* ==================================================================== */
    /* Le panneau : la fonction, et le calcul de l'image en cours           */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel fx-panel';
    var lastPanel = '';

    // De quel x parle-t-on ? De la colonne en cours pendant l'animation, du
    // curseur de lecture ensuite.
    function focusX() {
      var hc = hotCol();
      if (hc >= 0) return XS[hc];
      if (cursorOn()) return P.X();
      if (shown >= N) return XS[N - 1];
      return null;
    }

    // L'image de x telle qu'on l'écrit : √5 plutôt que 2,24 quand la valeur
    // ne tombe pas juste (2,24 n'en est qu'un arrondi).
    function img(x) { return POOL.ecrire(fn(), x, par); }

    function machine(x) {
      var f = fn();
      var out = !ok(x) ? '<span class="fx-no-txt">rien</span>'
        : POOL.exact(F(x)) ? nb(F(x))
        : img(x) + ' ≈ ' + nb(F(x));
      return '<div class="fx-machine">' +
        '<span class="fx-in">' + nb(x, 1) + '</span>' +
        '<span class="fx-arrow">→</span>' +
        '<span class="fx-box" style="border-color:' + f.couleur + ';color:' + f.couleur + '">' +
          'f</span>' +
        '<span class="fx-arrow">→</span>' +
        '<span class="fx-out">' + out + '</span>' +
      '</div>';
    }

    function renderPanel() {
      var f = fn(), x = focusX();
      var h =
        '<div class="props-name" style="color:' + f.couleur + '">' + f.nom + '</div>' +
        '<div class="fx-formula" style="color:' + f.couleur + '">f(x) = ' + f.expr(par) + '</div>' +
        '<p class="fx-sub">Définie sur ' + (f.ensemble || 'ℝ') +
          (f.courbe ? ' — sa courbe est ' + f.courbe : '') + '.</p>';

      if (x === null) {
        h += '<p class="fx-hint">Lance l\'animation : le tableau se remplit, ' +
             'les points se placent, puis la courbe apparaît.</p>';
      } else {
        h += '<div class="props-label">La machine, pour x = ' + nb(x, 1) + '</div>' +
             machine(x);
        if (ok(x)) {
          var etapes = f.calcul ? f.calcul(x, par) : [nb(F(x))];
          h += '<p class="fx-calc">f(' + nb(x, 1) + ') = ' + POOL.chaine(etapes) + '</p>' +
               '<p class="fx-say"><strong>' + img(x) + '</strong> est l\'image de <strong>' +
               nb(x, 1) + '</strong> par f&nbsp;; <strong>' + nb(x, 1) +
               '</strong> est un antécédent de <strong>' + img(x) + '</strong>.</p>';
        } else {
          h += '<p class="fx-calc fx-warn">f(' + nb(x, 1) + ') n\'existe pas : ' +
               nb(x, 1) + ' n\'est pas dans l\'ensemble de définition ' +
               (f.ensemble || '') + '.</p>';
        }
      }

      if (f.remarque) {
        h += '<div class="props-label">À retenir</div>' +
             '<p class="fx-note">' + f.remarque + '</p>';
      }
      if (h !== lastPanel) { lastPanel = h; panel.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Choix de la fonction et de ses paramètres                            */
    /* ==================================================================== */
    var pick = document.createElement('div');
    pick.className = 'fx-pick';
    var pickBtns = FN.map(function (f, i) {
      var b = document.createElement('button');
      b.innerHTML = '<span class="fx-btn-fx">f(x) =</span> ' + f.expr(POOL.defauts(f));
      b.style.setProperty('--fx-col', f.couleur);
      b.onclick = function () { choose(i); };
      pick.appendChild(b);
      return b;
    });

    var paramsBox = document.createElement('div');
    paramsBox.className = 'fx-params';

    function renderParams() {
      paramsBox.innerHTML = '';
      var specs = fn().params || [];
      paramsBox.style.display = specs.length ? '' : 'none';
      specs.forEach(function (s) {
        var lab = document.createElement('label');
        var name = document.createElement('span');
        name.className = 'fx-param-name';
        name.textContent = s.label || s.name;
        var input = document.createElement('input');
        input.type = 'range';
        input.min = s.min; input.max = s.max; input.step = s.step;
        input.value = par[s.name];
        var val = document.createElement('span');
        val.className = 'fx-param-val';
        val.textContent = nb(par[s.name]);
        input.oninput = function () {
          par[s.name] = parseFloat(input.value);
          val.textContent = nb(par[s.name]);
          fitView();
          board.update();
        };
        lab.appendChild(name); lab.appendChild(input); lab.appendChild(val);
        paramsBox.appendChild(lab);
      });
    }

    function updatePick() {
      pickBtns.forEach(function (b, i) { b.classList.toggle('active', i === sel); });
    }

    function choose(i) {
      if (i === sel) { play(); return; }
      sel = i;
      par = POOL.defauts(fn());
      updatePick();
      renderParams();
      fitView();
      play();                       // nouvelle fonction : on repart du tableau vide
    }

    /* ==================================================================== */
    /* Animation : tableau → points → courbe                                */
    /* ==================================================================== */
    mv.extras.appendChild(pick);
    mv.extras.appendChild(paramsBox);

    var anim = mv.createAnimator();

    function reset() {
      shown = 0; plotted = 0; traced = 0;
      board.update();
    }
    function play() {
      anim.cancel();
      reset();
      anim.runSteps([
        { dur: 3000, step: function (q) { shown = q * N; },
          after: function () { shown = N; board.update(); } },
        { dur: 2400, step: function (q) { plotted = q * N; },
          after: function () { plotted = N; board.update(); } },
        { dur: 1600, step: function (q) { traced = q; },
          after: function () { traced = 1; board.update(); } }
      ], reset);
    }
    function showAll() {
      anim.cancel();
      shown = N; plotted = N; traced = 1;
      board.update();
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: showAll },
      { type: 'checkbox', id: 'ortho', label: 'Repère orthonormé', checked: true,
        onChange: function (v) { ortho = v; fitView(); board.update(); } }
    ]);

    mv.extras.appendChild(wrap);
    mv.extras.appendChild(panel);

    board.on('update', refresh);

    updatePick();
    renderParams();
    fitView();
    play();            // charge les étapes : en pas à pas, la figure attend l'appui
  }
});
