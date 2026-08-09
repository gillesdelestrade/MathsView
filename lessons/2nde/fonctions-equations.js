/*
 * Résoudre f(x) = k et f(x) < k (2nde) — graphiquement ET par le calcul.
 *
 * La leçon met côte à côte les deux façons de résoudre, sur la MÊME situation :
 *
 *   — la LECTURE GRAPHIQUE : on trace la droite horizontale d'équation y = k,
 *     on repère les points où la courbe la rencontre, et l'on descend lire
 *     leurs abscisses sur l'axe. Pour une inéquation, on garde en plus les x où
 *     la courbe est du bon côté de la droite ;
 *
 *   — la RÉSOLUTION ALGÉBRIQUE : on transforme la condition jusqu'à isoler x.
 *     Chaque fonction de référence a sa propre méthode (élever au carré, penser
 *     en distance à 0, séparer les cas selon le signe de x…), et c'est le pool
 *     js/fonctions-base.js qui la connaît : la leçon ne fait que l'afficher.
 *
 * Les deux résultats sont montrés ensemble, et l'on dit franchement ce qui les
 * sépare : la lecture graphique ne voit que la fenêtre affichée et ne donne que
 * des valeurs approchées, le calcul est exact et complet.
 *
 * L'animation déroule la lecture graphique en cinq temps : la courbe, la droite
 * y = k qui descend se placer, les points d'intersection, la descente sur l'axe
 * des abscisses, et enfin l'ensemble solution mis en évidence.
 *
 * Tout vient du pool : ajouter une fonction là-bas (avec son antec() et ses
 * etapes()) la fait apparaître ici, résolue, sans toucher à ce fichier.
 */
MathsView.register({
  id: 'fonctions-equations',
  title: 'Résoudre f(x) = k et f(x) < k',
  level: '2nde',
  category: 'analyse',
  subcategory: 'Fonctions',
  exercices: ['fn-resolution'],
  theme: 'Fonctions — résoudre une équation ou une inéquation, graphiquement et par le calcul',
  description:
    'Résoudre <strong>\\(f(x)=k\\)</strong>, c\'est chercher tous les nombres \\(x\\) dont ' +
    'l\'image vaut \\(k\\) : ce sont les <strong>antécédents</strong> de \\(k\\). Résoudre ' +
    '<strong>\\(f(x)&lt;k\\)</strong>, c\'est chercher tous les \\(x\\) dont l\'image est ' +
    'plus petite que \\(k\\).' +
    '<br>Sur le graphique, tout se joue avec la <strong>droite horizontale d\'équation ' +
    '\\(y=k\\)</strong> : les <strong>points d\'intersection</strong> donnent les solutions ' +
    'de l\'équation, et la partie de la courbe située <strong>sous</strong> (ou ' +
    '<strong>au-dessus de</strong>) cette droite donne celles de l\'inéquation. On lit les ' +
    'réponses <strong>sur l\'axe des abscisses</strong>.' +
    '<br><strong>Choisis une fonction</strong> et une <strong>relation</strong> ' +
    '(\\(=\\), \\(&lt;\\), \\(\\leqslant\\), \\(&gt;\\), \\(\\geqslant\\)), puis ' +
    '<strong>fais glisser la poignée rouge</strong> à droite pour changer \\(k\\) : le ' +
    'nombre de solutions change sous tes yeux.' +
    '<br><em>Le bouton <strong>▶ Animer</strong> refait la lecture graphique pas à pas ; le ' +
    'panneau montre en même temps la résolution par le calcul.</em>',
  notes:
    '<ul>' +
    '<li><strong>Équation ou inéquation ?</strong> \\(f(x)=k\\) a pour solutions des ' +
    '<em>nombres</em> — on les écrit entre accolades : \\(S=\\{-2\\,;2\\}\\). ' +
    '\\(f(x)&lt;k\\) a pour solutions des <em>intervalles</em> : \\(S=\\left]-2\\,;2\\right[\\). ' +
    'Dans les deux cas, \\(S\\) est l\'ensemble de <strong>tous</strong> les \\(x\\) qui ' +
    'conviennent, et d\'eux seuls.</li>' +
    '<li><strong>La droite \\(y=k\\).</strong> Elle est horizontale : tous ses points ont la ' +
    'même ordonnée \\(k\\). Un point de la courbe est sur cette droite exactement quand son ' +
    'ordonnée \\(f(x)\\) vaut \\(k\\) — d\'où les points d\'intersection.</li>' +
    '<li><strong>Crochets ouverts ou fermés ?</strong> Avec \\(&lt;\\) et \\(&gt;\\) les ' +
    'bornes sont <strong>exclues</strong> (crochets ouverts, ronds vides sur l\'axe) ; avec ' +
    '\\(\\leqslant\\) et \\(\\geqslant\\) elles sont <strong>incluses</strong> (crochets ' +
    'fermés, ronds pleins). Les bornes sont justement les solutions de \\(f(x)=k\\).</li>' +
    '<li><strong>Le nombre de solutions dépend de \\(k\\).</strong> Pour la fonction carré, ' +
    '\\(x^2=k\\) a deux solutions si \\(k&gt;0\\), une seule si \\(k=0\\), aucune si ' +
    '\\(k&lt;0\\) : un carré n\'est jamais négatif. Déplace \\(k\\) pour voir les trois cas.</li>' +
    '<li><strong>Ne pas multiplier par \\(x\\) à l\'aveugle.</strong> Pour ' +
    '\\(\\frac{1}{x}&lt;k\\), multiplier les deux membres par \\(x\\) est interdit tant qu\'on ' +
    'ignore le signe de \\(x\\) : l\'inégalité changerait de sens pour \\(x&lt;0\\). On ' +
    'sépare donc \\(x&lt;0\\) et \\(x&gt;0\\).</li>' +
    '<li><strong>Diviser par un nombre négatif change le sens.</strong> ' +
    '\\(-2x&lt;4\\) donne \\(x&gt;-2\\), et non \\(x&lt;-2\\). C\'est la faute la plus ' +
    'fréquente sur les inéquations.</li>' +
    '<li><strong>Graphique ou calcul ?</strong> Le graphique <em>montre</em> et fait deviner ' +
    'le nombre de solutions ; il ne donne que des valeurs <strong>approchées</strong> et ' +
    'seulement sur la fenêtre affichée. Le calcul donne la valeur <strong>exacte</strong> ' +
    '(\\(\\sqrt5\\) et non \\(2{,}24\\)) et l\'ensemble <strong>complet</strong>. Les deux se ' +
    'contrôlent l\'un l\'autre : c\'est ce que fait le panneau.</li>' +
    '</ul>',
  board: {
    boundingbox: [-6.6, 6.6, 6.6, -6.6],
    axis: true, grid: true, keepaspectratio: false, showNavigation: true
  },

  setup: function (board, mv) {
    var POOL = MathsView.fonctions;
    var FN = POOL.liste();

    /* ==================================================================== */
    /* État                                                                 */
    /* ==================================================================== */
    var X1 = -5, X2 = 5;               // la fenêtre d'étude, en abscisses
    var YMIN = -6, YMAX = 6;           // recalculées pour chaque fonction
    var pas = 0.5;                     // le pas de déplacement de k

    var sel = 0;                       // fonction choisie
    var par = POOL.defauts(FN[0]);     // ses paramètres : { a: 2, b: -1 }
    var rel = '=';                     // la relation : =, <, ⩽, >, ⩾
    var k = 2;                         // le second membre

    /* Avancement de l'animation — cinq nombres de 0 à 1, dans l'ordre de la
       lecture graphique : la courbe, la droite y = k qui descend, les points
       d'intersection, la descente sur l'axe, l'ensemble solution. */
    var pC = 1, pD = 1, pI = 1, pP = 1, pS = 1;

    var C_K   = '#dc2626';             // la droite y = k, et tout ce qui en découle
    var C_K2  = '#991b1b';             // les points d'intersection
    var SOFT  = '#94a3b8';
    var XK = X2 + 0.9;                 // l'abscisse de la poignée qui règle k

    function fn() { return FN[sel]; }
    function F(x) { return POOL.valeur(fn(), x, par); }
    function ok(x) { return POOL.defini(fn(), x, par); }
    function nb(v, d) { return POOL.nb(v, d); }
    function brs() { return POOL.branches(fn(), X1, X2); }
    function relH(r) { return POOL.relHtml(r); }

    // Pendant que la droite descend, elle n'est pas encore à sa place.
    function yk() { return YMAX + (k - YMAX) * pD; }

    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var a = {}; a[key] = val;
        o.setAttribute(a);
      }
    }
    function show(o, v) { attr(o, 'visible', !!v); }

    /* ==================================================================== */
    /* Ce que l'on cherche                                                  */
    /*                                                                      */
    /* Le pool résout exactement, sur tout l'ensemble de définition. La      */
    /* leçon, elle, ne peut MONTRER que ce qui tient dans la fenêtre : d'où  */
    /* deux versions de l'ensemble solution, et une remarque quand elles     */
    /* diffèrent (l'ensemble se prolonge au-delà du bord).                   */
    /* ==================================================================== */
    /* Ces quatre listes sont demandées par CHAQUE coordonnée de la figure, à
       chaque image de l'animation : on les calcule une fois par situation, et
       on les garde tant que ni la fonction, ni la relation, ni k ne changent. */
    var memo = { cle: null };
    function situation() { return sel + '|' + rel + '|' + k + '|' + JSON.stringify(par); }
    function frais(nom, calcul) {
      var c = situation();
      if (memo.cle !== c) { memo = { cle: c }; }
      if (memo[nom] === undefined) memo[nom] = calcul();
      return memo[nom];
    }

    function S() { return frais('S', function () { return POOL.solutions(fn(), rel, k, par); }); }

    // L'ensemble solution recoupé avec la fenêtre : ce qui est lisible.
    function Slu() { return frais('lu', calcSlu); }
    function calcSlu() {
      var s = S(), out = [];
      if (!s) return out;
      s.morceaux.forEach(function (m) {
        var a = Math.max(m.a, X1), b = Math.min(m.b, X2);
        if (b < a) return;
        if (b - a < 1e-12 && m.b - m.a > 1e-12) return;   // rogné jusqu'à disparaître
        out.push({
          a: a, b: b,
          oa: m.a >= X1 ? m.oa : false,
          ob: m.b <= X2 ? m.ob : false,
          ta: m.a >= X1 ? m.ta : nb(X1),
          tb: m.b <= X2 ? m.tb : nb(X2),
          coupeA: m.a < X1, coupeB: m.b > X2      // ça continue au-delà du bord
        });
      });
      return out;
    }

    // Les morceaux prêts à être surlignés SUR LA COURBE : recoupés avec les
    // branches, pour ne pas surligner par-dessus un trou (1/x en 0).
    function Strace() { return frais('tr', calcStrace); }
    function calcStrace() {
      var out = [];
      Slu().forEach(function (m) {
        if (m.b - m.a < 1e-12) return;            // une solution isolée n'est pas un arc
        brs().forEach(function (br) {
          var a = Math.max(m.a, br[0]), b = Math.min(m.b, br[1]);
          if (b - a > 1e-9) out.push([a, b]);
        });
      });
      return out;
    }

    // Les solutions de f(x) = k visibles : ce sont elles qui donnent les points
    // d'intersection, y compris quand on résout une inéquation (ce sont ses bornes).
    function racines() {
      return frais('rac', function () {
        var s = S();
        if (!s) return [];
        return s.points.filter(function (t) { return t.v >= X1 - 1e-9 && t.v <= X2 + 1e-9; });
      });
    }

    /* ==================================================================== */
    /* La figure                                                            */
    /* ==================================================================== */
    function pt(fx, fy, extra) {
      return board.create('point', [fx, fy], Object.assign({
        visible: false, fixed: true, name: '', withLabel: false, highlight: false
      }, extra || {}));
    }

    // La courbe, une par branche (l'hyperbole en a deux), tracée progressivement.
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
            return m ? m[0] + pC * (m[1] - m[0]) : 0;
          };
        })(b)
      ], { strokeWidth: 3, strokeColor: FN[0].couleur, highlight: false, layer: 6 }));
    }

    // Le surlignage : la portion de courbe où la condition est vraie.
    var MAXH = 4;
    var hauts = [];
    for (var h = 0; h < MAXH; h++) {
      hauts.push(board.create('curve', [
        function (t) { return t; },
        function (t) { return F(t); },
        (function (i) { return function () { var m = Strace()[i]; return m ? m[0] : 0; }; })(h),
        (function (i) {
          return function () {
            var m = Strace()[i];
            return m ? m[0] + pS * (m[1] - m[0]) : 0;
          };
        })(h)
      ], { strokeWidth: 7, strokeColor: C_K, strokeOpacity: 0.5, highlight: false,
           visible: false, layer: 5 }));
    }

    /* La droite y = k, et la poignée qui la règle -------------------------- */
    var rail = board.create('segment', [[XK, -100], [XK, 100]], { visible: false, fixed: true });
    var K = board.create('glider', [XK, 2, rail], {
      name: '', size: 6, fillColor: C_K, strokeColor: C_K2, strokeWidth: 2,
      showInfobox: false, layer: 12
    });
    var droite = board.create('line', [
      pt(X1 - 1, function () { return yk(); }),
      pt(X2 + 1, function () { return yk(); })
    ], { strokeColor: C_K, strokeWidth: 2.5, straightFirst: true, straightLast: true,
         dash: 0, fixed: true, highlight: false, layer: 4 });

    // Décalages exprimés en fraction de la fenêtre : ils restent lisibles quel
    // que soit le cadrage (la fonction carré monte jusqu'à 25).
    function bb() { return board.getBoundingBox(); }
    function dy() { return (bb()[1] - bb()[3]) * 0.035; }

    var labK = board.create('text', [X1 - 0.6, function () { return yk() + dy() * 0.6; },
      function () { return 'y = ' + nb(k); }
    ], { anchorX: 'left', anchorY: 'bottom', fontSize: 14, color: C_K,
         cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 12 });

    var labPoignee = board.create('text', [XK, function () { return k + dy() * 0.8; },
      function () { return 'k = ' + nb(k); }
    ], { anchorX: 'middle', anchorY: 'bottom', fontSize: 13, color: C_K2,
         cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 12 });

    /* Les points d'intersection, et leur descente sur l'axe ---------------- */
    var MAXR = 4;
    var inters = [], desc = [], labX = [];
    for (var r = 0; r < MAXR; r++) {
      (function (i) {
        function xi() { var t = racines()[i]; return t ? t.v : 0; }
        var haut = pt(xi, function () { return yk(); },
          { visible: false, size: 5, face: 'o', fillColor: C_K2, strokeColor: '#fff',
            strokeWidth: 2, layer: 11 });
        // Le trait descend du point d'intersection vers l'axe : c'est le geste
        // de la lecture graphique.
        var bas = pt(xi, function () { return yk() * (1 - pP); });
        inters.push(haut);
        desc.push(board.create('segment', [haut, bas], {
          strokeColor: C_K, strokeWidth: 2, dash: 2, fixed: true, highlight: false,
          visible: false, layer: 10
        }));
        labX.push(board.create('text', [xi, function () { return -dy(); },
          function () { var t = racines()[i]; return t ? t.txt : ''; }
        ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: C_K2,
             cssStyle: 'font-weight:800', fixed: true, highlight: false,
             visible: false, layer: 11 }));
      })(r);
    }

    /* L'ensemble solution, dessiné sur l'axe des abscisses ----------------- */
    var MAXI = 4;
    var barres = [], bouts = [];
    for (var s = 0; s < MAXI; s++) {
      (function (i) {
        function m() { return Slu()[i]; }
        function a() { var t = m(); return t ? t.a : 0; }
        function bfin() { var t = m(); return t ? t.a + pS * (t.b - t.a) : 0; }
        barres.push(board.create('segment', [pt(a, 0), pt(bfin, 0)], {
          strokeColor: C_K, strokeWidth: 7, strokeOpacity: 0.55, fixed: true,
          highlight: false, visible: false, layer: 3
        }));
        // Les bornes : rond PLEIN quand elle appartient à l'ensemble (⩽, ⩾, =),
        // rond VIDE quand elle en est exclue (<, >).
        [0, 1].forEach(function (cote) {
          var o = board.create('point', [
            function () { var t = m(); return t ? (cote ? t.b : t.a) : 0; }, 0
          ], { visible: false, fixed: true, name: '', withLabel: false, highlight: false,
               size: 4.5, face: 'o', strokeColor: C_K2, strokeWidth: 2,
               fillColor: C_K2, layer: 11 });
          o.mvI = i; o.mvCote = cote;      // à quel morceau, et de quel côté
          bouts.push(o);
        });
      })(s);
    }

    /* ==================================================================== */
    /* Cadrage : on ajuste la hauteur à la fonction                          */
    /* ==================================================================== */
    // Les points trop proches d'un trou sont écartés : près de 0, 1/x monte à
    // l'infini et écraserait tout le reste.
    function pres(x) {
      return (fn().trous || []).some(function (t) { return Math.abs(x - t) < 0.45; });
    }
    function fitView() {
      var ys = [0];
      for (var x = X1; x <= X2 + 1e-9; x += 0.5) {
        if (ok(x) && !pres(x)) ys.push(F(x));
      }
      var hi = Math.max.apply(null, ys), lo = Math.min.apply(null, ys);
      var m = Math.max(0.8, (hi - lo) * 0.15);
      YMIN = lo - m; YMAX = hi + m;
      pas = (YMAX - YMIN) > 14 ? 1 : 0.5;
      board.setBoundingBox([X1 - 1.6, YMAX, X2 + 1.6, YMIN], false);
    }

    // k est ramené dans la fenêtre, sur un multiple du pas.
    function poseK(v) {
      var lim = (YMAX - YMIN) * 0.06;
      k = Math.max(YMIN + lim, Math.min(YMAX - lim, Math.round(v / pas) * pas));
      K.setPosition(JXG.COORDS_BY_USER, [XK, k]);
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function refresh() {
      var f = fn(), nbr = brs().length;
      courbes.forEach(function (c, i) {
        show(c, pC > 0 && i < nbr);
        attr(c, 'strokeColor', f.couleur);
      });

      show(droite, pD > 0);
      show(labK, pD > 0.99);
      show(K, pD > 0.99);
      show(labPoignee, pD > 0.99);

      var rac = racines();
      inters.forEach(function (o, i) {
        show(o, pI > 0 && i < rac.length);
        attr(o, 'size', Math.round((3 + 3 * pI) * 10) / 10);
      });
      desc.forEach(function (o, i) { show(o, pP > 0 && i < rac.length); });
      labX.forEach(function (o, i) { show(o, pP > 0.98 && i < rac.length); });

      var lu = Slu();
      var arcs = Strace();
      hauts.forEach(function (o, i) { show(o, pS > 0 && i < arcs.length); });
      barres.forEach(function (o, i) {
        // Une solution isolée (x² ⩽ 0 → S = {0}) n'a pas de barre, juste son point.
        var m = lu[i];
        show(o, pS > 0 && !!m && m.b - m.a > 1e-12);
      });
      bouts.forEach(function (o) {
        var m = lu[o.mvI], cote = o.mvCote;
        // Rien à la coupure de la fenêtre : là, l'ensemble ne s'arrête pas, il
        // sort du cadre.
        var coupe = cote ? (m && m.coupeB) : (m && m.coupeA);
        show(o, !!m && pS > 0.99 && !coupe);
        // Rond PLEIN quand la borne appartient à l'ensemble, VIDE sinon.
        if (m) attr(o, 'fillColor', (cote ? m.ob : m.oa) ? '#ffffff' : C_K2);
      });

      renderPanel();
    }

    /* ==================================================================== */
    /* Le panneau : la lecture graphique et le calcul, côte à côte           */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var lastPanel = '';

    // « en dessous », « au-dessus »… : ce que la relation demande de regarder.
    var COTE = {
      '=': 'exactement <b>sur</b> la droite',
      '<': '<b>strictement en dessous</b> de la droite',
      '⩽': '<b>en dessous ou sur</b> la droite',
      '>': '<b>strictement au-dessus</b> de la droite',
      '⩾': '<b>au-dessus ou sur</b> la droite'
    };

    function condition() {
      return '<b>' + fn().expr(par) + ' ' + relH(rel) + ' ' + nb(k) + '</b>';
    }

    function renderPanel() {
      var f = fn(), s = S(), lu = Slu(), rac = racines();

      // L'ensemble lu sur le dessin, écrit avec les mêmes conventions que le
      // pool (accolades pour une équation, crochets pour un intervalle).
      var luTxt = !s ? '—'
        : !lu.length ? '∅'
        : rel === '=' ? '{' + lu.map(function (m) { return m.ta; }).join(' ; ') + '}'
        : POOL.ensembleTxt(lu);

      var tronque = lu.some(function (m) { return m.coupeA || m.coupeB; });
      var accord = s && !tronque && luTxt === s.txt;

      var h =
        '<div class="props-name" style="color:' + f.couleur + '">Résoudre ' +
          condition() + '</div>' +
        '<p class="fx-sub">' + f.nom.replace(/^La |^Une /, '') +
          ' — définie sur ' + (f.ensemble || 'ℝ') +
          '. Lecture graphique sur la fenêtre [' + nb(X1) + ' ; ' + nb(X2) + '].</p>';

      /* ① la lecture graphique -------------------------------------------- */
      var etape2 = rel === '=' && !rac.length
        ? 'La courbe <b>ne rencontre pas</b> la droite : aucune solution.'
        : 'On repère les points où la courbe rencontre la droite : leurs abscisses ' +
          'sont ' + (rac.length ? rac.map(function (t) { return '<b>' + t.txt + '</b>'; }).join(' et ')
                                : '<b>inexistantes ici</b>') + '.';

      h += '<div class="eqx-two">' +
        '<div class="eqx-col">' +
          '<div class="props-label">① Lecture graphique</div>' +
          '<ol class="eqx-steps">' +
            '<li>On trace la droite horizontale d\'équation <b>y = ' + nb(k) + '</b>.</li>' +
            '<li>' + etape2 + '</li>' +
            '<li>On garde les <i>x</i> pour lesquels la courbe est ' + COTE[rel] +
              ', et l\'on descend lire ces <i>x</i> sur l\'axe des abscisses.</li>' +
          '</ol>' +
          '<div class="eqx-S" style="color:' + C_K + '">S = ' + luTxt + '</div>' +
        '</div>';

      /* ② la résolution algébrique ---------------------------------------- */
      var et = POOL.etapes(f, rel, k, par);
      h += '<div class="eqx-col">' +
          '<div class="props-label">② Par le calcul</div>';
      if (et && s) {
        h += '<ol class="eqx-steps">' +
          et.map(function (e) {
            // Un <i>…</i> final est le commentaire de l'étape : on le pose à part.
            var m = e.match(/^(.*?)<i>(.*)<\/i>$/);
            return '<li>' + (m ? m[1] + '<span class="eqx-why">' + m[2] + '</span>' : e) +
                   '</li>';
          }).join('') + '</ol>' +
          '<div class="eqx-S" style="color:' + f.couleur + '">S = ' + s.txt + '</div>';
      } else {
        h += '<p class="fx-hint">Cette fonction n\'a pas (encore) de résolution ' +
             'algébrique dans le pool : seule la lecture graphique est proposée.</p>';
      }
      h += '</div></div>';

      /* Ce qui sépare les deux méthodes ------------------------------------ */
      if (s) {
        if (tronque) {
          h += '<p class="eqx-warn">La lecture graphique ne voit que la fenêtre : ' +
               'l\'ensemble solution <b>se prolonge au-delà du bord</b>. Le calcul, lui, ' +
               'le donne en entier : <b>' + s.txt + '</b>.</p>';
        } else if (accord) {
          h += '<p class="eqx-ok">✓ Les deux méthodes donnent le même ensemble.</p>';
        } else {
          h += '<p class="eqx-warn">La lecture graphique donne des valeurs ' +
               '<b>approchées</b> ; l\'écriture exacte est celle du calcul : <b>' +
               s.txt + '</b>.</p>';
        }
      }

      /* La vérification, pour une équation --------------------------------- */
      if (rel === '=' && rac.length) {
        h += '<div class="props-label">Vérification</div>' +
          '<ul class="props-list">' +
          rac.map(function (t) {
            var etapesCalc = f.calcul ? f.calcul(t.v, par) : [nb(F(t.v))];
            return '<li>f(' + t.txt + ') = ' + POOL.chaine(etapesCalc) + ' — ' +
              (Math.abs(F(t.v) - k) < 1e-9 ? 'on retombe bien sur ' + nb(k) + ' ✓'
                                           : 'valeur approchée, à ' + nb(k) + ' près') +
              '</li>';
          }).join('') + '</ul>';
      }

      // Le mot de la fin : combien de solutions, et ce que ça dépend de k.
      if (rel === '=') {
        var n = s ? (s.morceaux.length === 1 && s.morceaux[0].a !== s.morceaux[0].b
                      ? -1 : s.points.length) : rac.length;
        h += '<p class="fx-say">' +
          (n < 0 ? 'Tous les nombres conviennent : la fonction est constante et vaut ' +
                   nb(k) + '.'
           : n === 0 ? 'L\'équation n\'a <b>aucune solution</b> : la droite ne coupe pas ' +
                       'la courbe.'
           : 'L\'équation a <b>' + n + ' solution' + (n > 1 ? 's' : '') + '</b>. ' +
             'Fais glisser la poignée rouge : ce nombre change avec k.') + '</p>';
      }

      if (h !== lastPanel) { lastPanel = h; panel.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Choix de la fonction, de la relation, des paramètres                  */
    /* ==================================================================== */
    var pick = document.createElement('div');
    pick.className = 'fx-pick';
    var pickBtns = FN.map(function (f, i) {
      var btn = document.createElement('button');
      btn.innerHTML = '<span class="fx-btn-fx">f(x) =</span> ' + f.expr(POOL.defauts(f));
      btn.style.setProperty('--fx-col', f.couleur);
      btn.onclick = function () { choisirFn(i); };
      pick.appendChild(btn);
      return btn;
    });

    var relBox = document.createElement('div');
    relBox.className = 'fx-pick eqx-rels';
    var relBtns = POOL.relations.map(function (r) {
      var btn = document.createElement('button');
      btn.innerHTML = '<span class="fx-btn-fx">f(x)</span> ' + relH(r) +
                      ' <span class="fx-btn-fx">k</span>';
      btn.style.setProperty('--fx-col', C_K);
      btn.onclick = function () { choisirRel(r); };
      relBox.appendChild(btn);
      return btn;
    });

    var paramsBox = document.createElement('div');
    paramsBox.className = 'fx-params';

    function renderParams() {
      paramsBox.innerHTML = '';
      var specs = fn().params || [];
      paramsBox.style.display = specs.length ? '' : 'none';
      specs.forEach(function (sp) {
        var lab = document.createElement('label');
        var name = document.createElement('span');
        name.className = 'fx-param-name';
        name.textContent = sp.label || sp.name;
        var input = document.createElement('input');
        input.type = 'range';
        input.min = sp.min; input.max = sp.max; input.step = sp.step;
        input.value = par[sp.name];
        var val = document.createElement('span');
        val.className = 'fx-param-val';
        val.textContent = nb(par[sp.name]);
        input.oninput = function () {
          par[sp.name] = parseFloat(input.value);
          val.textContent = nb(par[sp.name]);
          fitView(); poseK(k); tout();
        };
        lab.appendChild(name); lab.appendChild(input); lab.appendChild(val);
        paramsBox.appendChild(lab);
      });
    }

    function majBoutons() {
      pickBtns.forEach(function (b, i) { b.classList.toggle('active', i === sel); });
      relBtns.forEach(function (b, i) {
        b.classList.toggle('active', POOL.relations[i] === rel);
      });
    }

    function choisirFn(i) {
      sel = i;
      par = POOL.defauts(fn());
      fitView();
      // Un k qui donne une situation intéressante : l'image d'un x bien choisi.
      poseK(F(2));
      majBoutons(); renderParams();
      play();                          // nouvelle fonction : on refait la lecture
    }
    function choisirRel(r) {
      rel = r;
      majBoutons();
      tout();
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function vide() { pC = 0; pD = 0; pI = 0; pP = 0; pS = 0; board.update(); }
    function tout() {
      anim.cancel();
      pC = 1; pD = 1; pI = 1; pP = 1; pS = 1;
      board.update();
    }
    function play() {
      anim.cancel();
      vide();
      anim.runSteps([
        { dur: 1100, step: function (q) { pC = q; } },
        { dur: 900,  step: function (q) { pD = q; } },
        { dur: 600,  step: function (q) { pI = q; } },
        { dur: 800,  step: function (q) { pP = q; } },
        { dur: 900,  step: function (q) { pS = q; } }
      ], vide);
    }

    // Déplacer k n'a de sens qu'une fois la figure en place.
    K.on('drag', function () {
      k = Math.round(K.Y() / pas) * pas;
      poseK(k);
      tout();
    });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout },
      { type: 'button', id: 'kmoins', label: 'k −', onClick: function () { poseK(k - pas); tout(); } },
      { type: 'button', id: 'kplus', label: 'k +', onClick: function () { poseK(k + pas); tout(); } }
    ]);

    mv.extras.appendChild(pick);
    mv.extras.appendChild(relBox);
    mv.extras.appendChild(paramsBox);
    mv.extras.appendChild(panel);

    board.on('update', refresh);

    majBoutons();
    renderParams();
    fitView();
    poseK(F(2));
    play();            // charge les étapes : en pas à pas, la figure attend l'appui
  }
});
