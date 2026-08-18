/*
 * Croissance, décroissance, monotonie — et le tableau de variations (2nde).
 *
 * Une seule animation, lue deux fois : un point parcourt la courbe de la gauche
 * vers la droite, et l'on écrit EN MÊME TEMPS ce qu'il fait dans le tableau de
 * variations. La courbe monte → la flèche du tableau monte. La courbe descend →
 * la flèche descend. Le tableau n'est rien d'autre que le résumé du voyage.
 *
 *   1) LE BALAYAGE. La courbe se trace derrière le point, surlignée en vert là
 *      où f croît, en rouge là où f décroît ; dans le tableau, la flèche du
 *      morceau en cours s'allonge, et les valeurs se posent aux extrémités.
 *   2) LES CHANGEMENTS DE SENS. Aux sommets, l'extremum est marqué sur la
 *      figure et sa valeur apparaît dans le tableau.
 *   3) LA DÉFINITION. Deux points a < b que l'on déplace : croissante veut dire
 *      « l'ordre est conservé » (a < b donne f(a) < f(b)), décroissante « l'ordre
 *      est renversé ». Les placer de part et d'autre d'un sommet — ou de la
 *      valeur interdite de 1/x — montre pourquoi on précise TOUJOURS l'intervalle.
 *
 * Rien n'est écrit ici : le tableau vient du pool js/fonctions-base.js
 * (POOL.variations), qui découpe le domaine aux sommets et aux valeurs
 * interdites, puis trouve le sens de chaque morceau. Ajouter une fonction
 * là-bas la fait apparaître ici, avec son tableau, sans toucher ce fichier.
 */
MathsView.register({
  id: 'fonctions-variations',
  title: 'Variations et tableau de variations',
  level: '2nde',
  category: 'analyse',
  subcategory: 'Fonctions',
  theme: 'Fonctions — croissance, décroissance, monotonie et tableau de variations',
  exercices: ['variations'],
  description:
    'Parcourir la courbe de \\(f\\) <strong>de la gauche vers la droite</strong>, c\'est ' +
    'faire grandir \\(x\\). Pendant ce temps, \\(f(x)\\) monte ou descend : sur un ' +
    'intervalle où elle monte, \\(f\\) est <strong>croissante</strong> ; sur un intervalle ' +
    'où elle descend, <strong>décroissante</strong>. Une fonction qui garde le même sens ' +
    'sur tout un intervalle y est dite <strong>monotone</strong>.' +
    '<br>Le <strong>tableau de variations</strong> résume ce voyage en une ligne de ' +
    'flèches : \\(\\nearrow\\) quand \\(f\\) croît, \\(\\searrow\\) quand elle décroît, avec ' +
    'les valeurs aux extrémités et une <strong>double barre</strong> aux valeurs interdites.' +
    '<br><strong>Choisis une fonction</strong> et lance l\'animation : la courbe se trace, ' +
    'et le tableau s\'écrit <strong>en même temps</strong>, flèche après flèche.' +
    '<br><em>Ensuite, déplace les deux points \\(a\\) et \\(b\\) : ils comparent \\(f(a)\\) ' +
    'et \\(f(b)\\). Place-les de part et d\'autre d\'un sommet pour voir pourquoi on ' +
    'précise toujours l\'intervalle.</em>',
  notes:
    '<ul>' +
    '<li><strong>Les définitions.</strong> \\(f\\) est <em>croissante</em> sur un ' +
    'intervalle \\(I\\) si, pour tous \\(a\\) et \\(b\\) de \\(I\\), \\(a&lt;b\\) entraîne ' +
    '\\(f(a)\\leqslant f(b)\\) : elle <strong>conserve l\'ordre</strong>. Elle est ' +
    '<em>décroissante</em> si \\(a&lt;b\\) entraîne \\(f(a)\\geqslant f(b)\\) : elle ' +
    '<strong>renverse l\'ordre</strong>. Avec des inégalités strictes, on dit ' +
    '<em>strictement</em> croissante ou décroissante — c\'est le cas de toutes les ' +
    'fonctions de cette leçon, sauf la fonction constante.</li>' +
    '<li><strong>Toujours préciser l\'intervalle.</strong> « \\(f\\) est croissante » ne veut ' +
    'rien dire tout seul : \\(x^2\\) est décroissante sur \\(]-\\infty\\,;0]\\) et croissante ' +
    'sur \\([0\\,;+\\infty[\\). Une fonction est <strong>monotone</strong> sur \\(I\\) quand ' +
    'elle y garde le même sens ; \\(x^2\\) n\'est pas monotone sur \\(\\mathbb{R}\\).</li>' +
    '<li><strong>Le piège de \\(\\frac1x\\).</strong> Elle est décroissante sur ' +
    '\\(]-\\infty\\,;0[\\) <em>et</em> sur \\(]0\\,;+\\infty[\\), mais <strong>pas</strong> sur ' +
    'la réunion des deux : \\(-1&lt;1\\) et pourtant \\(f(-1)=-1&lt;f(1)=1\\). On ne ' +
    '« traverse » jamais une double barre.</li>' +
    '<li><strong>Lire un tableau.</strong> Ligne du haut : les \\(x\\), rangés dans l\'ordre ' +
    'croissant, avec les bornes de l\'intervalle d\'étude et les changements de sens. Ligne ' +
    'du bas : une flèche par morceau, et les valeurs de \\(f\\) au départ et à l\'arrivée de ' +
    'chaque flèche. Une flèche ne dit <em>pas</em> la forme de la courbe — seulement son ' +
    'sens.</li>' +
    '<li><strong>Extremum.</strong> Là où la fonction passe de \\(\\searrow\\) à ' +
    '\\(\\nearrow\\), elle atteint un <strong>minimum</strong> ; de \\(\\nearrow\\) à ' +
    '\\(\\searrow\\), un <strong>maximum</strong>. On dit toujours <em>où</em> il est ' +
    'atteint et <em>combien</em> il vaut : « \\(f\\) admet un minimum en \\(0\\), égal à ' +
    '\\(0\\) ».</li>' +
    '<li><strong>Le tableau dépend de l\'intervalle d\'étude.</strong> Ici, tout est lu sur ' +
    '\\([-5\\,;5]\\) : les valeurs \\(-5\\) et \\(5\\) des colonnes extrêmes ne sont pas des ' +
    'propriétés de la fonction, mais le bord de la fenêtre choisie.</li>' +
    '<li><strong>Le tableau de valeurs, à la machine.</strong> Un script Python qui ' +
    'affiche \\(f(x)\\) pour des \\(x\\) rangés dans l\'ordre croissant donne les ' +
    'variations à lire dans la colonne de droite. Attention à \\(\\texttt{range}\\), qui ' +
    'ne compte que d\'entier en entier : pour avancer de 0,5 en 0,5, on boucle sur des ' +
    'entiers et on divise (\\(\\texttt{x = i / 2}\\)).</li>' +
    '<li><strong>Un tableau ne démontre rien.</strong> Il ne donne que des valeurs ' +
    '<em>choisies</em> : entre deux d\'entre elles, la fonction peut faire tout autre ' +
    'chose. Le tableau <strong>suggère</strong> le sens de variation — c\'est une ' +
    '<em>conjecture</em>, qu\'il faut ensuite démontrer. Resserrer le pas rend la ' +
    'conjecture plus sûre, jamais certaine.</li>' +
    '<li><strong>Croissante n\'est pas positive.</strong> Deux idées différentes : ' +
    '\\(f(x)=2x-1\\) est croissante partout, et pourtant négative pour \\(x&lt;0{,}5\\). Le ' +
    'sens de variation parle de la <em>façon dont f varie</em>, pas du signe de ses ' +
    'valeurs.</li>' +
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
    var X1 = -5, X2 = 5;               // l'intervalle d'étude
    var PAS = 0.5;                     // le pas des points a et b

    var sel = 0;                       // fonction choisie
    var par = POOL.defauts(FN[0]);     // ses paramètres : { a: 2, b: -1 }

    /* Avancement de l'animation : le balayage de la courbe (qui écrit le
       tableau), les extremums, puis la comparaison de f(a) et f(b). */
    var pB = 1, pE = 1, pO = 1;

    var C_UP   = '#16a34a';            // f croît
    var C_DOWN = '#dc2626';            // f décroît
    var C_FLAT = '#64748b';            // f est constante
    var C_AB   = '#7c3aed';            // les deux points a et b
    var SENS = { croissante: C_UP, decroissante: C_DOWN,
                 constante: C_FLAT, variable: C_FLAT };
    var FLECHE = { croissante: '↗', decroissante: '↘', constante: '→', variable: '?' };

    function fn() { return FN[sel]; }
    function F(x) { return POOL.valeur(fn(), x, par); }
    function ok(x) { return POOL.defini(fn(), x, par); }
    function nb(v, d) { return POOL.nb(v, d); }
    function brs() { return POOL.branches(fn(), X1, X2); }

    // Le tableau du pool, demandé par la figure ET par le tableau HTML à chaque
    // image : on le garde tant que la fonction ne change pas.
    var memo = { cle: null, val: null };
    function T() {
      var c = sel + '|' + JSON.stringify(par);
      if (memo.cle !== c) memo = { cle: c, val: POOL.variations(fn(), par, X1, X2) };
      return memo.val;
    }
    function arcs() { return T().arcs; }
    function cols() { return T().cols; }

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
    /* Le balayage                                                          */
    /*                                                                      */
    /* Le point parcourt le domaine d'un bout à l'autre, à vitesse          */
    /* constante — en sautant par-dessus les valeurs interdites. `pB` est   */
    /* la fraction du chemin déjà faite, toutes branches confondues.        */
    /* ==================================================================== */
    function chemin() {
      var out = [], tot = 0;
      brs().forEach(function (br) {
        out.push({ a: br[0], b: br[1], off: tot });
        tot += br[1] - br[0];
      });
      return { list: out, tot: tot || 1 };
    }
    // Jusqu'où la branche i est tracée.
    function traceFin(i) {
      var c = chemin(), b = c.list[i];
      if (!b) return 0;
      return b.a + Math.max(0, Math.min(b.b - b.a, pB * c.tot - b.off));
    }
    // L'abscisse du point qui balaie (le « stylo »).
    function balaiX() {
      var c = chemin(), pos = pB * c.tot, b = c.list[0];
      for (var i = 0; i < c.list.length; i++) {
        b = c.list[i];
        if (pos <= b.off + (b.b - b.a) || i === c.list.length - 1) break;
      }
      return Math.max(b.a, Math.min(b.b, b.a + (pos - b.off)));
    }
    // La part d'un morceau déjà parcourue : c'est elle qui allonge la flèche.
    function part(arc) {
      if (!arc || arc.b <= arc.a) return 0;
      return Math.max(0, Math.min(1, (balaiX() - arc.a) / (arc.b - arc.a)));
    }
    // Une colonne est-elle atteinte ? (sa valeur s'écrit alors dans le tableau)
    function atteinte(c) { return pB > 0 && balaiX() >= c.v - 1e-9; }

    /* ==================================================================== */
    /* La figure                                                            */
    /* ==================================================================== */
    function pt(fx, fy, extra) {
      return board.create('point', [fx, fy], Object.assign({
        visible: false, fixed: true, name: '', withLabel: false, highlight: false,
        showInfobox: false
      }, extra || {}));
    }

    // La courbe, une par branche, tracée derrière le stylo.
    var NB_BR = 1;
    FN.forEach(function (f) { NB_BR = Math.max(NB_BR, (f.trous || []).length + 1); });

    var courbes = [];
    for (var b = 0; b < NB_BR; b++) {
      (function (i) {
        courbes.push(board.create('curve', [
          function (t) { return t; },
          function (t) { return F(t); },
          function () { var m = brs()[i]; return m ? m[0] : 0; },
          function () { return traceFin(i); }
        ], { strokeWidth: 3, strokeColor: FN[0].couleur, highlight: false, layer: 6 }));
      })(b);
    }

    /* Combien de morceaux, et combien de sommets, au plus ? On le DEMANDE au
       pool plutôt que de l'y lire : sur [−5 ; 5], la parabole n'a qu'une flèche
       et un sommet, la cubique trois et deux, le sinus cinq et quatre. Les
       compter ici, c'est n'avoir toujours rien à changer dans cette leçon quand
       une fonction s'ajoute au pool. */
    var MAXA = 1, MAXS = 0;
    FN.forEach(function (f) {
      var v = POOL.variations(f, POOL.defauts(f), X1, X2);
      MAXA = Math.max(MAXA, v.arcs.length);
      MAXS = Math.max(MAXS, v.cols.filter(function (c) { return c.sommet; }).length);
    });

    /* Le surlignage : un trait épais à la couleur du SENS sur chaque morceau,
       qui s'allonge en même temps que la flèche correspondante du tableau. */
    var surlignes = [];
    for (var a = 0; a < MAXA; a++) {
      (function (i) {
        function arc() { return arcs()[i]; }
        surlignes.push(board.create('curve', [
          function (t) { return t; },
          function (t) { return F(t); },
          function () { var r = arc(); return r ? r.a : 0; },
          function () { var r = arc(); return r ? r.a + part(r) * (r.b - r.a) : 0; }
        ], { strokeWidth: 9, strokeColor: C_UP, strokeOpacity: 0.3, highlight: false,
             visible: false, layer: 5 }));
      })(a);
    }

    // Le stylo : le point qui parcourt la courbe, et ce qu'il est en train de faire.
    var M = pt(balaiX, function () { return F(balaiX()); },
      { size: 5, fillColor: '#0f172a', strokeColor: '#fff', strokeWidth: 2, layer: 13 });

    function bb() { return board.getBoundingBox(); }
    function dy() { return (bb()[1] - bb()[3]) * 0.035; }
    function dx() { return (bb()[2] - bb()[0]) * 0.02; }

    // Le morceau en cours de balayage.
    function arcCourant() {
      var A = arcs(), x = balaiX();
      for (var i = 0; i < A.length; i++) {
        if (x >= A[i].a - 1e-9 && x <= A[i].b + 1e-9) return A[i];
      }
      return null;
    }
    var labM = board.create('text', [
      function () { return balaiX() + dx(); },
      function () { return F(balaiX()) + dy() * 0.5; },
      function () {
        var r = arcCourant();
        if (!r) return '';
        return FLECHE[r.sens] + ' f ' + (r.sens === 'croissante' ? 'croît'
                                       : r.sens === 'decroissante' ? 'décroît'
                                       : 'ne varie pas');
      }
    ], { anchorX: 'left', anchorY: 'bottom', fontSize: 14, color: C_UP,
         cssStyle: 'font-weight:800', fixed: true, highlight: false,
         visible: false, layer: 13 });

    /* Les changements de sens : le point du sommet, son trait, son étiquette */
    var somPts = [], somTraits = [], somLabs = [];
    for (var s = 0; s < MAXS; s++) {
      (function (i) {
        function c() { return cols().filter(function (u) { return u.sommet; })[i]; }
        function cx() { var u = c(); return u ? u.v : 0; }
        function cy() { var u = c(); return u ? u.val : 0; }
        var P = pt(cx, cy, { size: 5.5, fillColor: '#fff', strokeColor: '#0f172a',
                             strokeWidth: 2.5, layer: 12 });
        somPts.push(P);
        somTraits.push(board.create('segment', [pt(cx, 0), P], {
          strokeColor: '#94a3b8', strokeWidth: 1.5, dash: 2, fixed: true,
          highlight: false, visible: false, layer: 9
        }));
        somLabs.push(board.create('text', [
          function () { return cx(); }, function () { return cy() - dy() * 0.6; },
          function () {
            var u = c();
            if (!u) return '';
            return (mini(u) ? 'minimum ' : 'maximum ') + u.txtVal;
          }
        ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: '#0f172a',
             cssStyle: 'font-weight:800', fixed: true, highlight: false,
             visible: false, layer: 12 }));
      })(s);
    }
    // Un sommet est un minimum quand la fonction y arrête de descendre.
    function mini(col) {
      var C = cols(), i = C.indexOf(col), A = arcs();
      return i > 0 && A[i - 1] && A[i - 1].sens === 'decroissante';
    }

    /* Les deux points a et b : la définition, à la main ---------------------- */
    var rail = board.create('segment', [[X1, 0], [X2, 0]], { visible: false, fixed: true });
    function glid(x0) {
      return board.create('glider', [x0, 0, rail], {
        name: '', size: 5, fillColor: C_AB, strokeColor: '#5b21b6', strokeWidth: 2,
        showInfobox: false, snapToGrid: true, snapSizeX: PAS, visible: false, layer: 13
      });
    }
    var Ga = glid(-2.5), Gb = glid(2.5);
    function xa() { return Math.round(Ga.X() / PAS) * PAS; }
    function xb() { return Math.round(Gb.X() / PAS) * PAS; }
    // On nomme a le point de GAUCHE : la définition parle de a < b.
    function xg() { return Math.min(xa(), xb()); }
    function xd() { return Math.max(xa(), xb()); }

    function paire(getx, lettre) {
      var P = pt(getx, function () { return ok(getx()) ? F(getx()) : 0; },
        { size: 5, fillColor: C_AB, strokeColor: '#fff', strokeWidth: 2, layer: 13 });
      var vert = board.create('segment', [pt(getx, 0), P], {
        strokeColor: C_AB, strokeWidth: 1.5, dash: 2, fixed: true,
        highlight: false, visible: false, layer: 10
      });
      var horiz = board.create('segment', [P, pt(0, function () {
        return ok(getx()) ? F(getx()) : 0;
      })], { strokeColor: C_AB, strokeWidth: 1.5, dash: 2, fixed: true,
             highlight: false, visible: false, layer: 10 });
      var lab = board.create('text', [
        function () { return -dx() * 0.4; },
        function () { return ok(getx()) ? F(getx()) : 0; },
        function () { return ok(getx()) ? 'f(' + lettre() + ')' : ''; }
      ], { anchorX: 'right', anchorY: 'middle', fontSize: 13, color: C_AB,
           cssStyle: 'font-weight:800', fixed: true, highlight: false,
           visible: false, layer: 13 });
      var labX = board.create('text', [
        getx, function () { return -dy() * 0.4; },
        function () { return lettre() + ' = ' + nb(getx()); }
      ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: C_AB,
           cssStyle: 'font-weight:800', fixed: true, highlight: false,
           visible: false, layer: 13 });
      return { P: P, vert: vert, horiz: horiz, lab: lab, labX: labX,
               get: getx, ok: function () { return ok(getx()); } };
    }
    // La lettre suit la position : le point de gauche s'appelle toujours a.
    var PA = paire(xg, function () { return 'a'; });
    var PB = paire(xd, function () { return 'b'; });

    // L'intervalle [a ; b], posé sur l'axe des abscisses.
    var barreAB = board.create('segment', [pt(xg, 0), pt(xd, 0)], {
      strokeColor: C_AB, strokeWidth: 6, strokeOpacity: 0.3, fixed: true,
      highlight: false, visible: false, layer: 4
    });

    /* ==================================================================== */
    /* Cadrage                                                              */
    /* ==================================================================== */
    function pres(x) {
      return (fn().trous || []).some(function (t) { return Math.abs(x - t) < 0.45; });
    }
    function fitView() {
      var ys = [0];
      for (var x = X1; x <= X2 + 1e-9; x += PAS) if (ok(x) && !pres(x)) ys.push(F(x));
      var hi = Math.max.apply(null, ys), lo = Math.min.apply(null, ys);
      var mar = Math.max(0.9, (hi - lo) * 0.14);
      board.setBoundingBox([X1 - 1.4, hi + mar, X2 + 1.4, lo - mar], false);
    }
    // a et b sont posés au quart et aux trois quarts du domaine visible : de
    // part et d'autre du sommet, ou de la valeur interdite. C'est là que la
    // comparaison est la plus instructive.
    function poseAB() {
      var c = chemin().list;
      var g = c.length ? c[0].a : X1, d = c.length ? c[c.length - 1].b : X2;
      var q = function (t) {
        return Math.round((g + (d - g) * t) / PAS) * PAS;
      };
      Ga.setPosition(JXG.COORDS_BY_USER, [q(0.25), 0]);
      Gb.setPosition(JXG.COORDS_BY_USER, [q(0.75), 0]);
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function dansEcran(y) { return y >= bb()[3] && y <= bb()[1]; }

    function refresh() {
      var f = fn(), nbr = brs().length, A = arcs(), C = cols();

      courbes.forEach(function (c, i) {
        show(c, pB > 0 && i < nbr);
        attr(c, 'strokeColor', f.couleur);
      });
      surlignes.forEach(function (c, i) {
        show(c, pB > 0 && i < A.length && part(A[i]) > 0);
        if (A[i]) attr(c, 'strokeColor', SENS[A[i].sens]);
      });

      // Le stylo n'est là que pendant le balayage, et tant qu'il reste visible
      // (près d'une valeur interdite, la courbe file hors de l'écran).
      var r = arcCourant();
      var penOn = pB > 0 && pB < 1 && ok(balaiX()) && dansEcran(F(balaiX()));
      show(M, penOn);
      show(labM, penOn && !!r);
      if (r) attr(labM, 'color', SENS[r.sens]);

      var somm = C.filter(function (u) { return u.sommet; });
      somPts.forEach(function (o, i) {
        var u = somm[i];
        show(o, !!u && pB > 0 && balaiX() >= u.v - 1e-9);
      });
      somTraits.forEach(function (o, i) { show(o, !!somm[i] && pE > 0.2); });
      somLabs.forEach(function (o, i) { show(o, !!somm[i] && pE > 0.9); });

      var abOn = pO > 0.05;
      [Ga, Gb, barreAB].forEach(function (o) { show(o, abOn); });
      [PA, PB].forEach(function (q) {
        show(q.P, abOn && q.ok());
        show(q.vert, abOn && q.ok());
        show(q.horiz, abOn && q.ok());
        show(q.lab, abOn && q.ok());
        show(q.labX, abOn);
      });

      renderTab();
      renderPanel();
    }

    /* ==================================================================== */
    /* Le tableau de variations (HTML), écrit pendant le balayage            */
    /* ==================================================================== */
    var wrap = document.createElement('div');
    wrap.className = 'var-wrap';
    var lastTab = '';

    var LARG = 116, HAUT = 78, MARGE = 11;   // la case d'une flèche, en pixels

    /* Une flèche, tracée en SVG : le trait part du coin de départ et s'allonge
       avec q, la pointe le suivant comme au bout d'un crayon. */
    function fleche(sens, q) {
      var haut = MARGE, bas = HAUT - MARGE, mil = HAUT / 2;
      var y0 = sens === 'croissante' ? bas : sens === 'decroissante' ? haut : mil;
      var y1 = sens === 'croissante' ? haut : sens === 'decroissante' ? bas : mil;
      var x0 = 10, x1 = LARG - 10;
      var tx = x0 + q * (x1 - x0), ty = y0 + q * (y1 - y0);
      var col = SENS[sens] || C_FLAT;
      var s = '<svg width="' + LARG + '" height="' + HAUT + '" viewBox="0 0 ' + LARG +
              ' ' + HAUT + '" class="var-svg">';
      // Rien tant que le stylo n'est pas arrivé : la case reste vide.
      if (q > 0.005) {
        s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + tx.toFixed(1) + '" y2="' +
             ty.toFixed(1) + '" stroke="' + col + '" stroke-width="2.6" ' +
             'stroke-linecap="round"/>';
      }
      if (q > 0.04) {
        var ang = Math.atan2(y1 - y0, x1 - x0), L = 11, d = 0.45;
        var p1 = [tx - L * Math.cos(ang - d), ty - L * Math.sin(ang - d)];
        var p2 = [tx - L * Math.cos(ang + d), ty - L * Math.sin(ang + d)];
        s += '<polyline points="' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1) + ' ' +
             tx.toFixed(1) + ',' + ty.toFixed(1) + ' ' + p2[0].toFixed(1) + ',' +
             p2[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="2.6" ' +
             'stroke-linecap="round" stroke-linejoin="round"/>';
      }
      return s + '</svg>';
    }

    // À quelle hauteur s'écrit la valeur d'une colonne : en bas si les flèches
    // voisines y arrivent (ou en partent) par le bas, en haut sinon.
    function hauteur(i) {
      var A = arcs(), g = A[i - 1], d = A[i];
      if (d) {                                   // la flèche qui part de la colonne
        return d.sens === 'croissante' ? 'bottom'
             : d.sens === 'decroissante' ? 'top' : 'middle';
      }
      if (g) {                                   // dernière colonne : la flèche arrive
        return g.sens === 'croissante' ? 'top'
             : g.sens === 'decroissante' ? 'bottom' : 'middle';
      }
      return 'middle';
    }

    function renderTab() {
      var C = cols(), A = arcs();
      var lx = '<th class="var-head">x</th>', lf = '<th class="var-head">f(x)</th>';
      C.forEach(function (c, i) {
        lx += '<td class="var-x">' + (pB > 0 ? c.txt : '') + '</td>';
        var cont = c.bar ? '<span class="var-bar"></span>'
                 : (atteinte(c) && c.txtVal !== null ? c.txtVal : '');
        lf += '<td class="var-v" style="vertical-align:' + hauteur(i) + '">' +
              cont + '</td>';
        if (A[i]) {
          var q = part(A[i]);
          var chaud = q > 0 && q < 1;
          lx += '<td class="var-a' + (chaud ? ' is-hot' : '') + '"></td>';
          lf += '<td class="var-a' + (chaud ? ' is-hot' : '') + '">' +
                fleche(A[i].sens, q) + '</td>';
        }
      });
      var html = '<table class="var-tab"><tr>' + lx + '</tr><tr>' + lf + '</tr></table>';
      if (html !== lastTab) { lastTab = html; wrap.innerHTML = html; }
    }

    /* ==================================================================== */
    /* Le panneau                                                           */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var lastPanel = '';

    var NOM = { croissante: 'croissante', decroissante: 'décroissante',
                constante: 'constante', variable: 'de sens variable' };

    // L'intervalle d'un morceau, écrit avec les bons crochets : une borne où la
    // fonction n'est pas définie est exclue.
    function interTxt(i) {
      var C = cols(), A = arcs()[i];
      if (!A) return '';
      return POOL.intervalleTxt({ a: A.a, b: A.b, oa: !C[i].defini, ob: !C[i + 1].defini,
                                  ta: C[i].txt, tb: C[i + 1].txt });
    }
    function img(x) { return POOL.ecrire(fn(), x, par); }

    /* La portion de [−5 ; 5] réellement étudiée : c'est [−5 ; 5] tout entier,
       sauf quand la fonction n'y est pas partout définie — √x ne commence qu'en
       0, et 1/x laisse un trou qui coupe l'intervalle en deux. */
    function etude() {
      var C = cols();
      if (!C.length) return '∅';
      var out = [], deb = C[0];
      C.forEach(function (c, i) {
        if (!c.bar && i !== C.length - 1) return;
        out.push(POOL.intervalleTxt({ a: deb.v, b: c.v, oa: !deb.defini, ob: !c.defini,
                                      ta: deb.txt, tb: c.txt }));
        deb = c;
      });
      return out.join(' ∪ ');
    }

    function renderPanel() {
      var f = fn(), A = arcs(), C = cols();
      var n = 0, NUM = ['①', '②', '③', '④', '⑤'];
      function num() { return NUM[n++]; }
      var tout = etude(), partiel = C.length && (C[0].v > X1 || C[C.length - 1].v < X2);

      var h =
        '<div class="props-name" style="color:' + f.couleur + '">' + f.nom + '</div>' +
        '<div class="fx-formula" style="color:' + f.couleur + '">f(x) = ' + f.expr(par) +
          '</div>' +
        '<p class="fx-sub">Définie sur ' + (f.ensemble || 'ℝ') + ' — variations lues sur <b>' +
          tout + '</b>' +
          (partiel ? ', la partie de [' + nb(X1) + ' ; ' + nb(X2) + '] où f est définie.'
                   : ', l\'intervalle d\'étude choisi.') + '</p>';

      /* ① le sens, morceau par morceau ------------------------------------ */
      h += '<div class="props-label">' + num() + ' Le sens de variation</div>' +
        '<ul class="props-list">' +
        A.map(function (r, i) {
          return '<li>Sur <b>' + interTxt(i) + '</b>, f est <b style="color:' +
                 SENS[r.sens] + '">' + NOM[r.sens] + '</b>' +
                 (r.sens === 'croissante' ? ' : quand x augmente, f(x) augmente.'
                  : r.sens === 'decroissante' ? ' : quand x augmente, f(x) diminue.'
                  : '.') + '</li>';
        }).join('') + '</ul>';

      /* ② monotone ? ------------------------------------------------------- */
      var barre = C.some(function (c) { return c.bar; });
      var memeSens = A.length > 0 && A.every(function (r) { return r.sens === A[0].sens; });
      h += '<div class="props-label">' + num() + ' Monotone sur ' + tout + ' ?</div>';
      if (memeSens && !barre) {
        h += '<p class="eqx-ok">Oui : f garde le même sens sur tout l\'intervalle — elle y ' +
             'est <b>monotone</b>.</p>';
      } else if (barre && memeSens) {
        h += '<p class="eqx-warn"><b>Non.</b> f est ' + NOM[A[0].sens] + ' sur <b>chacun</b> ' +
             'des deux intervalles, mais <b>pas sur leur réunion</b> : on ne traverse pas la ' +
             'double barre. C\'est l\'erreur classique sur la fonction inverse.</p>';
      } else {
        h += '<p class="eqx-warn"><b>Non</b> : f change de sens en ' +
             C.filter(function (c) { return c.sommet; })
              .map(function (c) { return '<b>' + c.txt + '</b>'; }).join(', ') +
             '. Elle n\'est monotone que sur chacun des morceaux du tableau.</p>';
      }

      /* ③ extremum --------------------------------------------------------- */
      var somm = C.filter(function (c) { return c.sommet; });
      if (somm.length) {
        h += '<div class="props-label">' + num() + ' Extremum</div><ul class="props-list">' +
          somm.map(function (c) {
            return '<li>f admet un <b>' + (mini(c) ? 'minimum' : 'maximum') +
              '</b> en x = <b>' + c.txt + '</b> ; il vaut <b>' + c.txtVal + '</b>' +
              (mini(c) ? ' : aucune image n\'est plus petite.'
                       : ' : aucune image n\'est plus grande.') + '</li>';
          }).join('') + '</ul>';
      }

      /* ④ la définition, sur les deux points a et b ------------------------ */
      h += '<div class="props-label">' + num() + ' Comparer f(a) et f(b)</div>';
      var g = xg(), d = xd();
      if (!ok(g) || !ok(d)) {
        h += '<p class="fx-calc fx-warn">' + nb(ok(g) ? d : g) + ' n\'a pas d\'image : ' +
             'déplace le point dans l\'ensemble de définition.</p>';
      } else if (g === d) {
        h += '<p class="fx-say">a et b sont confondus : écarte-les pour comparer leurs ' +
             'images.</p>';
      } else {
        var fa = F(g), fb = F(d);
        var signe = Math.abs(fa - fb) < 1e-9 ? '=' : fa < fb ? '&lt;' : '&gt;';
        // Deux lignes : l'ordre des x, puis celui de leurs images. C'est la
        // comparaison des deux qui définit le sens de variation.
        h += '<p class="par-cmp"><span class="par-eq">a = ' + nb(g) + '</span>' +
          '<span>&lt;</span><span class="par-eq">b = ' + nb(d) + '</span></p>' +
          '<p class="par-cmp"><span class="par-eq">f(a) = ' + img(g) + '</span>' +
          '<span>' + signe + '</span><span class="par-eq">f(b) = ' + img(d) + '</span></p>';

        // a et b sont-ils dans le même morceau du tableau ?
        var barreEntre = C.some(function (c) { return c.bar && c.v > g && c.v < d; });
        var sommetEntre = C.some(function (c) { return c.sommet && c.v > g && c.v < d; });
        if (barreEntre) {
          h += '<p class="eqx-warn">a et b sont <b>de part et d\'autre de la double ' +
            'barre</b> : ils ne sont pas dans le même intervalle. Comparer leurs images ne ' +
            'dit <b>rien</b> du sens de variation — c\'est exactement pourquoi 1/x n\'est ' +
            'pas décroissante sur tout son ensemble de définition.</p>';
        } else if (sommetEntre) {
          h += '<p class="eqx-warn">a et b encadrent un <b>changement de sens</b> : f n\'est ' +
            'pas monotone sur [' + nb(g) + ' ; ' + nb(d) + '], et cette comparaison ne permet ' +
            'de conclure à rien. Rapproche-les d\'un même côté du sommet.</p>';
        } else {
          var r = A.filter(function (u) { return g >= u.a - 1e-9 && d <= u.b + 1e-9; })[0];
          var sens = r ? r.sens : 'variable';
          h += '<p class="eqx-ok">a et b sont dans le même intervalle, où f est <b>' +
            NOM[sens] + '</b> : ' +
            (sens === 'croissante' ? 'l\'ordre est <b>conservé</b> (a &lt; b donne f(a) &lt; f(b)).'
             : sens === 'decroissante' ? 'l\'ordre est <b>renversé</b> (a &lt; b donne f(a) &gt; f(b)).'
             : 'toutes les images sont égales.') + '</p>';
        }
      }

      if (f.remarque) {
        h += '<div class="props-label">À retenir</div>' +
             '<p class="fx-note">' + f.remarque + '</p>';
      }
      if (h !== lastPanel) { lastPanel = h; panel.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Le même tableau, en Python                                           */
    /*                                                                      */
    /* Le tableau de variations se lit sur la courbe ; il se lit tout aussi */
    /* bien sur une COLONNE DE NOMBRES. C'est même ainsi qu'on procède quand */
    /* on n'a pas la courbe : on fait calculer f(x) pour beaucoup de x, et  */
    /* on regarde où la colonne se retourne. Le script est modifiable et    */
    /* s'exécute ici ; tapé tel quel sur une calculatrice, il donne la même */
    /* chose.                                                               */
    /* ==================================================================== */
    var pySection = document.createElement('div');
    pySection.className = 'py-section';
    pySection.innerHTML =
      '<div class="py-titre">Le même tableau, écrit en Python</div>' +
      '<p class="py-intro">Une machine ne « voit » pas la courbe : elle calcule ' +
      '\\(f(x)\\) pour beaucoup de valeurs de \\(x\\), rangées dans l\'ordre croissant, ' +
      'et les affiche. Il ne reste qu\'à lire la colonne de droite — <b>tant qu\'elle ' +
      'augmente, f croît ; quand elle se met à diminuer, f décroît</b>. Le retournement ' +
      'de la colonne, c\'est le sommet de la courbe.</p>';

    var pyLecture = document.createElement('p');
    pyLecture.className = 'py-lecture';

    function scriptPourFonction() {
      return POOL.scriptPython(fn(), par, { x1: X1, x2: X2, den: Math.round(1 / PAS) });
    }

    /* La phrase qui relie la colonne de nombres au tableau de variations. Elle
       n'est écrite que si le script affiché est bien celui de la fonction
       choisie : commenter un script qu'on n'a pas écrit, c'est risquer de
       raconter n'importe quoi. */
    function lectureTxt() {
      var C = cols(), A = arcs();
      if (!A.length) return '';
      var somm = C.filter(function (c) { return c.sommet; });
      if (somm.length === 1) {
        var creux = mini(somm[0]);
        return 'Lis la colonne de droite : elle ' + (creux ? 'diminue' : 'augmente') +
          ' jusqu\'à <b>x = ' + somm[0].txt + '</b>, puis elle ' +
          (creux ? 'augmente' : 'diminue') + '. Ce retournement, c\'est le ' +
          (creux ? 'minimum' : 'maximum') + ' — et c\'est exactement là que la flèche ' +
          'du tableau de variations change de sens.';
      }
      if (somm.length > 1) {
        return 'La colonne de droite se retourne en ' + somm.map(function (c) {
          return '<b>x = ' + c.txt + '</b>';
        }).join(' puis en ') + ' : autant de changements de sens que de flèches dans ' +
          'le tableau.';
      }
      if (C.some(function (c) { return c.bar; })) {
        return 'La colonne ne se retourne jamais, mais le script <b>saute</b> une valeur : ' +
          'celle qui n\'a pas d\'image. C\'est la double barre du tableau de variations.';
      }
      return 'La colonne de droite ne se retourne jamais : f garde le même sens sur tout ' +
        'l\'intervalle, elle y est <b>monotone</b>. Une seule flèche suffit.';
    }

    var pyConsole = MathsConsole.monte(pySection, {
      script: scriptPourFonction(),
      aide: 'Le même script, tapé sur une calculatrice qui a Python (Numworks, TI, ' +
            'Casio), affiche exactement les mêmes lignes. <b>range</b> ne sait compter ' +
            'que d\'entier en entier : pour avancer de 0,5 en 0,5, on boucle sur des ' +
            'entiers et on divise.',
      surSortie: function (lignes, erreur, intact) {
        pyLecture.innerHTML = (!erreur && lignes.length && intact) ? lectureTxt() : '';
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([pyLecture]);
      }
    });
    pySection.appendChild(pyLecture);

    /* On ne réécrit le script que s'il n'a pas été retouché : sinon, bouger un
       curseur effacerait ce que l'élève vient d'écrire. */
    function majScript(force) {
      if (!force && !pyConsole.intact()) return;
      pyConsole.remettre(scriptPourFonction());
    }


    /* ==================================================================== */
    /* Choix de la fonction et de ses paramètres                            */
    /* ==================================================================== */
    var pick = document.createElement('div');
    pick.className = 'fx-pick';
    var pickBtns = FN.map(function (f, i) {
      var btn = document.createElement('button');
      btn.innerHTML = '<span class="fx-btn-fx">f(x) =</span> ' + f.expr(POOL.defauts(f));
      btn.style.setProperty('--fx-col', f.couleur);
      btn.onclick = function () { choisir(i); };
      pick.appendChild(btn);
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
          fitView(); tout(); majScript(false);
        };
        lab.appendChild(name); lab.appendChild(input); lab.appendChild(val);
        paramsBox.appendChild(lab);
      });
    }

    function majBoutons() {
      pickBtns.forEach(function (b, i) { b.classList.toggle('active', i === sel); });
    }

    function choisir(i) {
      sel = i;
      par = POOL.defauts(fn());
      fitView();
      poseAB();
      majBoutons(); renderParams(); majScript(true);
      play();                          // nouvelle fonction : on réécrit le tableau
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function vide() { pB = 0; pE = 0; pO = 0; board.update(); }
    function tout() {
      anim.cancel();
      pB = 1; pE = 1; pO = 1;
      board.update();
    }
    function play() {
      anim.cancel();
      vide();
      anim.runSteps([
        { dur: 3400, step: function (q) { pB = q; } },
        { dur: 700,  step: function (q) { pE = q; } },
        { dur: 800,  step: function (q) { pO = q; } }
      ], vide);
    }

    // Déplacer a ou b avant la fin de l'animation : on affiche tout, puisque
    // c'est la comparaison qui intéresse alors.
    [Ga, Gb].forEach(function (G) {
      G.on('drag', function () { if (pO < 1) tout(); else board.update(); });
    });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout }
    ]);

    mv.extras.appendChild(pick);
    mv.extras.appendChild(paramsBox);
    mv.extras.appendChild(wrap);
    mv.extras.appendChild(panel);
    mv.extras.appendChild(pySection);

    board.on('update', refresh);

    majBoutons();
    renderParams();
    majScript(true);
    fitView();
    poseAB();
    play();            // charge les étapes : en pas à pas, la figure attend l'appui
  }
});
