/*
 * Fonctions paires et impaires (2nde) — f(−x) = f(x) ou f(−x) = −f(x).
 *
 * Deux égalités, deux symétries. Toute la leçon consiste à faire voir que
 * l'égalité du calcul et la symétrie du dessin sont la MÊME chose :
 *
 *   — f PAIRE : f(−x) = f(x) pour tout x. Les nombres opposés ont la même
 *     image ; la courbe est symétrique par rapport à l'axe des ordonnées ;
 *   — f IMPAIRE : f(−x) = −f(x) pour tout x. Les nombres opposés ont des images
 *     opposées ; la courbe est symétrique par rapport à l'origine du repère.
 *
 * La figure met la symétrie à l'épreuve, en deux temps :
 *
 *   1) SUR UN POINT. On prend x, on va chercher son opposé −x sur l'axe, on
 *      monte aux deux points de la courbe, et l'on applique à A(x ; f(x)) la
 *      symétrie testée. Le point obtenu tombe-t-il sur la courbe, c'est-à-dire
 *      sur B(−x ; f(−x)) ? Un halo vert dit oui, un écart orange dit non.
 *   2) SUR LA COURBE ENTIÈRE. La même transformation est alors appliquée à
 *      toute la courbe : elle se replie comme une page (symétrie par rapport à
 *      l'axe des ordonnées) ou fait un demi-tour autour de O (symétrie par
 *      rapport à l'origine). Le fantôme retombe exactement sur la courbe… ou
 *      pas. Les deux symétries sont proposées pour chaque fonction : tester
 *      celle qui échoue est aussi instructif que voir réussir l'autre.
 *
 * Rien n'est écrit ici : les fonctions, le calcul de f(−x) et le verdict
 * viennent du pool js/fonctions-base.js (POOL.parite). Le pool classe une
 * fonction en comparant f(−x) et f(x) sur une série de nombres d'essai : en
 * ajouter une là-bas la fait apparaître ici, classée, sans toucher ce fichier.
 */
MathsView.register({
  id: 'fonctions-parite',
  title: 'Fonctions paires et impaires',
  level: '2nde',
  category: 'analyse',
  subcategory: 'Fonctions',
  theme: 'Fonctions — parité : f(−x) = f(x), f(−x) = −f(x) et les symétries de la courbe',
  description:
    'Comparer \\(f(-x)\\) et \\(f(x)\\), c\'est se demander ce que devient l\'image ' +
    'quand on <strong>change le nombre en son opposé</strong>.' +
    '<br>Si \\(f(-x)=f(x)\\) <em>pour tout</em> \\(x\\), la fonction est ' +
    '<strong>paire</strong> : deux nombres opposés ont la <strong>même</strong> image, et ' +
    'la courbe est symétrique par rapport à l\'<strong>axe des ordonnées</strong>. ' +
    'Si \\(f(-x)=-f(x)\\) <em>pour tout</em> \\(x\\), la fonction est ' +
    '<strong>impaire</strong> : les images sont <strong>opposées</strong>, et la courbe est ' +
    'symétrique par rapport à l\'<strong>origine</strong> du repère.' +
    '<br><strong>Choisis une fonction</strong>, puis la <strong>symétrie à tester</strong>. ' +
    'L\'animation prend un point \\(A(x\\,;f(x))\\), lui applique la symétrie, et regarde ' +
    'si le point obtenu tombe sur \\(B(-x\\,;f(-x))\\) — puis elle fait subir la même ' +
    'transformation à la courbe entière : le <strong>fantôme en pointillés</strong> ' +
    'retombe sur la courbe, ou à côté.' +
    '<br><em>Fais glisser le point rouge sur l\'axe des abscisses pour changer \\(x\\).</em>',
  notes:
    '<ul>' +
    '<li><strong>Les deux définitions.</strong> \\(f\\) est <em>paire</em> si ' +
    '\\(f(-x)=f(x)\\) pour tout \\(x\\) de l\'ensemble de définition ; <em>impaire</em> si ' +
    '\\(f(-x)=-f(x)\\) pour tout \\(x\\). Le « pour tout » est essentiel : une égalité ' +
    'vraie pour un seul \\(x\\) ne prouve rien.</li>' +
    '<li><strong>D\'abord le domaine.</strong> Pour comparer \\(f(-x)\\) et \\(f(x)\\), il ' +
    'faut que \\(-x\\) ait une image dès que \\(x\\) en a une : l\'ensemble de définition ' +
    'doit être <strong>symétrique par rapport à \\(0\\)</strong>. Ce n\'est pas le cas de ' +
    '\\(\\sqrt{x}\\), définie sur \\([0\\,;+\\infty[\\) : la question de sa parité ne se ' +
    'pose même pas.</li>' +
    '<li><strong>« Impaire » ne veut pas dire « pas paire ».</strong> La plupart des ' +
    'fonctions ne sont <em>ni</em> paires <em>ni</em> impaires : \\(f(x)=2x-1\\) en est un ' +
    'exemple. Ce sont deux propriétés particulières, pas deux cas qui se partagent tout.</li>' +
    '<li><strong>Prouver, ou réfuter.</strong> Pour affirmer « \\(f\\) est paire », il faut ' +
    'le <strong>calcul</strong> : partir de \\(f(-x)\\), le transformer, et retomber sur ' +
    '\\(f(x)\\) — ce qui vaut alors pour tout \\(x\\). Pour affirmer « \\(f\\) n\'est pas ' +
    'paire », <strong>un seul contre-exemple suffit</strong> : \\(f(-1)\\ne f(1)\\) clôt la ' +
    'question.</li>' +
    '<li><strong>La courbe le dit aussi.</strong> Paire ⟺ symétrique par rapport à l\'axe ' +
    'des ordonnées (le pliage le long de cet axe superpose les deux moitiés). Impaire ⟺ ' +
    'symétrique par rapport à l\'origine (un demi-tour autour de \\(O\\) la ramène sur ' +
    'elle-même). Mais un dessin ne <em>prouve</em> rien : il ne montre qu\'une fenêtre, et ' +
    'à peu près.</li>' +
    '<li><strong>Une fonction impaire définie en \\(0\\) passe par l\'origine.</strong> ' +
    'En effet \\(f(-0)=-f(0)\\) donne \\(f(0)=-f(0)\\), donc \\(f(0)=0\\). C\'est le cas de ' +
    '\\(x\\mapsto x\\) ; \\(x\\mapsto\\frac1x\\), elle, est impaire sans être définie en ' +
    '\\(0\\).</li>' +
    '<li><strong>Le cas de la fonction affine.</strong> \\(f(x)=ax+b\\) est impaire quand ' +
    '\\(b=0\\) (la droite passe par l\'origine), paire quand \\(a=0\\) (la droite est ' +
    'horizontale : toute fonction constante est paire), et ni l\'une ni l\'autre sinon. ' +
    'Bouge les curseurs \\(a\\) et \\(b\\) pour parcourir les trois cas — et \\(a=b=0\\) ' +
    'pour rencontrer la seule fonction à la fois paire et impaire : la fonction nulle.</li>' +
    '<li><strong>À quoi ça sert.</strong> Connaître la parité divise le travail par deux : ' +
    'on étudie la fonction pour \\(x\\geqslant 0\\), et l\'on complète la courbe par ' +
    'symétrie. C\'est aussi un moyen rapide de repérer une erreur : si un calcul donne une ' +
    'courbe non symétrique pour \\(x^2\\), c\'est qu\'il est faux.</li>' +
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
    var PAS = 0.5;                     // le pas de déplacement de x

    var sel = 0;                       // fonction choisie
    var par = POOL.defauts(FN[0]);     // ses paramètres : { a: 2, b: -1 }
    var test = 'origine';              // la symétrie mise à l'épreuve

    /* Avancement de l'animation — cinq nombres de 0 à 1, dans l'ordre du
       raisonnement : la courbe, l'opposé −x sur l'axe, les deux points de la
       courbe, la symétrie appliquée au point A, puis à la courbe entière. */
    var pC = 1, pX = 1, pA = 1, pL = 1, pT = 1;

    var C_AXE = '#dc2626';             // la symétrie par rapport à l'axe des ordonnées
    var C_ORI = '#0891b2';             // la symétrie par rapport à l'origine
    var C_X   = '#334155';             // x et −x, sur l'axe des abscisses
    var C_OK  = '#16a34a';             // le point symétrique tombe sur la courbe
    var C_NON = '#b45309';             // il tombe à côté

    function fn() { return FN[sel]; }
    function F(x) { return POOL.valeur(fn(), x, par); }
    function ok(x) { return POOL.defini(fn(), x, par); }
    function nb(v, d) { return POOL.nb(v, d); }
    function brs() { return POOL.branches(fn(), X1, X2); }
    function CT() { return test === 'ordonnees' ? C_AXE : C_ORI; }

    // Le verdict du pool, demandé par tout le panneau : on le garde tant que ni
    // la fonction, ni ses paramètres ne changent.
    var memo = { cle: null, val: null };
    function P() {
      var c = sel + '|' + JSON.stringify(par);
      if (memo.cle !== c) memo = { cle: c, val: POOL.parite(fn(), par) };
      return memo.val;
    }

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
    /* La symétrie testée, jouée au ralenti                                 */
    /*                                                                      */
    /* q = 0 laisse le point sur place, q = 1 l'amène sur son symétrique.   */
    /*   axe des ordonnées : l'abscisse passe de x à −x en s'écrasant sur   */
    /*     l'axe — la figure se replie comme une page ;                     */
    /*   origine : la figure fait un demi-tour autour de O.                 */
    /* ==================================================================== */
    function trX(x, y, q) {
      if (test === 'ordonnees') return x * Math.cos(Math.PI * q);
      var t = Math.PI * q;
      return x * Math.cos(t) - y * Math.sin(t);
    }
    function trY(x, y, q) {
      if (test === 'ordonnees') return y;
      var t = Math.PI * q;
      return x * Math.sin(t) + y * Math.cos(t);
    }

    /* ==================================================================== */
    /* La figure                                                            */
    /* ==================================================================== */
    function pt(fx, fy, extra) {
      return board.create('point', [fx, fy], Object.assign({
        visible: false, fixed: true, name: '', withLabel: false, highlight: false,
        showInfobox: false
      }, extra || {}));
    }

    /* La courbe (une par branche : l'hyperbole en a deux), tracée
       progressivement, et son FANTÔME — la même courbe, à qui l'on fait subir
       la symétrie testée. */
    var NB_BR = 1;
    FN.forEach(function (f) { NB_BR = Math.max(NB_BR, (f.trous || []).length + 1); });

    var courbes = [], fantomes = [];
    for (var b = 0; b < NB_BR; b++) {
      (function (i) {
        function deb() { var m = brs()[i]; return m ? m[0] : 0; }
        function fin() { var m = brs()[i]; return m ? m[1] : 0; }
        courbes.push(board.create('curve', [
          function (t) { return t; },
          function (t) { return F(t); },
          deb,
          function () { var m = brs()[i]; return m ? m[0] + pC * (m[1] - m[0]) : 0; }
        ], { strokeWidth: 3, strokeColor: FN[0].couleur, highlight: false, layer: 6 }));

        fantomes.push(board.create('curve', [
          function (t) { return trX(t, F(t), pT); },
          function (t) { return trY(t, F(t), pT); },
          deb, fin
        ], { strokeWidth: 3, strokeColor: C_ORI, dash: 2, strokeOpacity: 0.9,
             highlight: false, visible: false, layer: 7 }));
      })(b);
    }

    /* x et son opposé, sur l'axe des abscisses ----------------------------- */
    var rail = board.create('segment', [[X1, 0], [X2, 0]], { visible: false, fixed: true });
    var G = board.create('glider', [2, 0, rail], {
      name: '', size: 5, fillColor: '#dc2626', strokeColor: '#b91c1c', strokeWidth: 2,
      showInfobox: false, snapToGrid: true, snapSizeX: PAS, layer: 12
    });
    function xc() { return Math.round(G.X() / PAS) * PAS; }

    // Le point qui part de x et traverse 0 pour aller se poser sur −x.
    var Mx = pt(function () { return xc() * (1 - 2 * pX); }, 0,
      { size: 5, face: 'o', fillColor: C_X, strokeColor: '#fff', strokeWidth: 2, layer: 12 });

    // Décalages en fraction de la fenêtre : lisibles quel que soit le cadrage.
    function bb() { return board.getBoundingBox(); }
    function dy() { return (bb()[1] - bb()[3]) * 0.035; }
    function dx() { return (bb()[2] - bb()[0]) * 0.02; }

    var labX = board.create('text', [function () { return xc(); },
      function () { return -dy() * 0.4; }, function () { return 'x = ' + nb(xc()); }
    ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: '#b91c1c',
         cssStyle: 'font-weight:800', fixed: true, highlight: false, layer: 12 });

    var labMx = board.create('text', [function () { return -xc(); },
      function () { return -dy() * 0.4; }, function () { return '−x = ' + nb(-xc()); }
    ], { anchorX: 'middle', anchorY: 'top', fontSize: 13, color: C_X,
         cssStyle: 'font-weight:800', fixed: true, highlight: false,
         visible: false, layer: 12 });

    /* Les deux points de la courbe : A(x ; f(x)) et B(−x ; f(−x)) ---------- */
    function ya() { return ok(xc()) ? F(xc()) * pA : 0; }
    function yb() { return ok(-xc()) ? F(-xc()) * pA : 0; }

    var A = pt(function () { return xc(); }, ya,
      { size: 5, fillColor: FN[0].couleur, strokeColor: '#fff', strokeWidth: 2, layer: 11 });
    var B = pt(function () { return -xc(); }, yb,
      { size: 5, fillColor: FN[0].couleur, strokeColor: '#fff', strokeWidth: 2, layer: 11 });

    var segA = board.create('segment', [pt(function () { return xc(); }, 0), A], {
      strokeColor: '#94a3b8', strokeWidth: 1.5, dash: 2, fixed: true,
      highlight: false, visible: false, layer: 9
    });
    var segB = board.create('segment', [pt(function () { return -xc(); }, 0), B], {
      strokeColor: '#94a3b8', strokeWidth: 1.5, dash: 2, fixed: true,
      highlight: false, visible: false, layer: 9
    });

    // La valeur lue en A et en B, écrite à côté du point.
    function val(x) {
      var v = F(x);
      return (POOL.exact(v) ? '' : '≈ ') + nb(v);
    }
    function decale(v) { return v + (v >= 0 ? dx() : -dx()) * 0.6; }

    var labA = board.create('text', [function () { return decale(xc()); },
      function () { return ya() + dy() * 0.35; },
      function () { return 'f(' + nb(xc()) + ') = ' + val(xc()); }
    ], { anchorX: 'left', anchorY: 'bottom', fontSize: 13, color: FN[0].couleur,
         cssStyle: 'font-weight:800', fixed: true, highlight: false,
         visible: false, layer: 12 });

    var labB = board.create('text', [function () { return decale(-xc()); },
      function () { return yb() + dy() * 0.35; },
      function () { return 'f(' + nb(-xc()) + ') = ' + val(-xc()); }
    ], { anchorX: 'right', anchorY: 'bottom', fontSize: 13, color: FN[0].couleur,
         cssStyle: 'font-weight:800', fixed: true, highlight: false,
         visible: false, layer: 12 });

    // Quand −x n'a pas d'image (√x), il n'y a rien à comparer : on le dit sur place.
    var noB = board.create('text', [function () { return -xc(); },
      function () { return dy() * 0.6; }, function () { return 'pas d\'image'; }
    ], { anchorX: 'middle', anchorY: 'bottom', fontSize: 12, color: C_NON,
         cssStyle: 'font-weight:700', fixed: true, highlight: false,
         visible: false, layer: 12 });

    /* Le symétrique de A, et ce qu'il devient ------------------------------ */
    function fa() { return ok(xc()) ? F(xc()) : 0; }
    var Ap = pt(function () { return trX(xc(), fa(), pL); },
                function () { return trY(xc(), fa(), pL); },
      { size: 6, face: 'o', fillColor: C_ORI, strokeColor: '#fff', strokeWidth: 2, layer: 13 });

    // Le chemin parcouru par A : horizontal pour le pliage, passant par O pour
    // le demi-tour (A et son symétrique sont alors de part et d'autre de O).
    var lien = board.create('segment', [A, Ap], {
      strokeColor: C_ORI, strokeWidth: 2, dash: 2, fixed: true,
      highlight: false, visible: false, layer: 10
    });

    // Le verdict, sur ce point : halo vert si le symétrique de A est bien le
    // point B de la courbe, écart orange sinon.
    var halo = pt(function () { return -xc(); }, function () { return yb(); },
      { size: 12, face: 'o', fillColor: C_OK, fillOpacity: 0.22, strokeColor: C_OK,
        strokeOpacity: 0.6, strokeWidth: 2, layer: 8 });
    var ecart = board.create('segment', [Ap, B], {
      strokeColor: C_NON, strokeWidth: 3, dash: 3, fixed: true,
      highlight: false, visible: false, layer: 10
    });

    // L'axe ou le centre de la symétrie testée, mis en évidence.
    var axeSym = board.create('segment', [[0, -100], [0, 100]], {
      strokeColor: C_AXE, strokeWidth: 5, strokeOpacity: 0.22, fixed: true,
      highlight: false, visible: false, layer: 2
    });
    // Le centre est posé au-dessus des axes (couche 11), qui le masqueraient.
    var centreSym = pt(0, 0, { size: 6, face: 'o', fillColor: C_ORI,
      strokeColor: '#fff', strokeWidth: 2, layer: 12 });

    /* ==================================================================== */
    /* Le symétrique de A tombe-t-il sur la courbe ?                         */
    /* ==================================================================== */
    function comparable() { return ok(xc()) && ok(-xc()); }
    function meme() {
      if (!comparable()) return false;
      var a = F(xc()), c = F(-xc());
      return Math.abs(test === 'ordonnees' ? c - a : c + a) < 1e-9;
    }

    /* ==================================================================== */
    /* Cadrage                                                              */
    /* ==================================================================== */
    // Les x trop proches d'un trou sont écartés : près de 0, 1/x monte à
    // l'infini et écraserait tout le reste.
    function pres(x) {
      return (fn().trous || []).some(function (t) { return Math.abs(x - t) < 0.45; });
    }
    function fitView() {
      var ys = [0];
      for (var x = X1; x <= X2 + 1e-9; x += PAS) if (ok(x) && !pres(x)) ys.push(F(x));
      var hi = Math.max.apply(null, ys), lo = Math.min.apply(null, ys);
      // Le demi-tour envoie les ordonnées sur leurs opposées : on réserve la
      // place, sans quoi le fantôme sortirait de l'écran.
      if (test === 'origine') {
        var m = Math.max(Math.abs(hi), Math.abs(lo));
        hi = m; lo = -m;
      }
      var mar = Math.max(0.8, (hi - lo) * 0.12);
      board.setBoundingBox([X1 - 1.2, hi + mar, X2 + 1.2, lo - mar], false);
    }
    function poseX(v) {
      G.setPosition(JXG.COORDS_BY_USER,
        [Math.max(X1, Math.min(X2, Math.round(v / PAS) * PAS)), 0]);
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function refresh() {
      var f = fn(), nbr = brs().length, x = xc();
      var defA = ok(x), defB = ok(-x), col = CT();

      courbes.forEach(function (c, i) {
        show(c, pC > 0 && i < nbr);
        attr(c, 'strokeColor', f.couleur);
      });
      fantomes.forEach(function (c, i) {
        show(c, pT > 0 && i < nbr);
        attr(c, 'strokeColor', col);
      });

      show(G, pC > 0.99);
      show(labX, pC > 0.99);
      show(Mx, pX > 0);
      show(labMx, pX > 0.98);

      [A, B].forEach(function (o) { attr(o, 'fillColor', f.couleur); });
      [labA, labB].forEach(function (o) { attr(o, 'color', f.couleur); });
      show(A, pA > 0 && defA); show(segA, pA > 0 && defA);
      show(B, pA > 0 && defB); show(segB, pA > 0 && defB);
      show(labA, pA > 0.98 && defA);
      show(labB, pA > 0.98 && defB);
      show(noB, pA > 0.5 && !defB);
      // Les étiquettes s'écartent du repère, chacune de son côté.
      attr(labA, 'anchorX', x >= 0 ? 'left' : 'right');
      attr(labB, 'anchorX', -x >= 0 ? 'left' : 'right');

      show(Ap, pL > 0 && defA);
      show(lien, pL > 0 && defA);
      attr(Ap, 'fillColor', col);
      attr(lien, 'strokeColor', col);
      show(axeSym, pL > 0 && test === 'ordonnees');
      show(centreSym, pL > 0 && test === 'origine');

      var fini = pL > 0.99 && comparable();
      show(halo, fini && meme());
      show(ecart, fini && !meme());

      renderPanel();
    }

    /* ==================================================================== */
    /* Le panneau : le domaine, le calcul, le verdict, le point courant      */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    var lastPanel = '';

    var MOT = {
      paire:   { txt: 'f est paire', col: C_AXE },
      impaire: { txt: 'f est impaire', col: C_ORI },
      deux:    { txt: 'f est à la fois paire et impaire', col: '#7c3aed' },
      aucune:  { txt: 'f n\'est ni paire ni impaire', col: C_NON },
      domaine: { txt: 'On ne peut pas parler de parité', col: C_NON }
    };
    var SYM = {
      ordonnees: 'l\'axe des ordonnées',
      origine: 'l\'origine du repère'
    };

    // Un nombre du domaine dont l'opposé n'y est pas : c'est lui qui montre que
    // le domaine n'est pas symétrique.
    function temoinAsym() {
      var L = [1, 2, 3, 0.5, 4];
      for (var i = 0; i < L.length; i++) {
        if (ok(L[i]) && !ok(-L[i])) return L[i];
        if (ok(-L[i]) && !ok(L[i])) return -L[i];
      }
      return 2;
    }
    function img(x) { return POOL.ecrire(fn(), x, par); }

    function renderPanel() {
      var f = fn(), p = P(), x = xc();
      var h =
        '<div class="props-name" style="color:' + f.couleur + '">' + f.nom + '</div>' +
        '<div class="fx-formula" style="color:' + f.couleur + '">f(x) = ' + f.expr(par) +
          '</div>';

      /* ① le domaine : la question a-t-elle un sens ? ---------------------- */
      h += '<div class="props-label">① Le domaine est-il symétrique ?</div>';
      if (p.type === 'domaine') {
        var t = temoinAsym();
        h += '<p class="fx-calc fx-warn">f est définie sur ' + (f.ensemble || 'ℝ') +
          ' : ' + nb(t) + ' y est, mais son opposé ' + nb(-t) + ' n\'y est pas. ' +
          'f(' + nb(-t) + ') n\'existe pas, il n\'y a donc rien à comparer — ' +
          '<b>on ne parle pas de parité pour cette fonction</b>.</p>';
      } else {
        h += '<p class="fx-say">f est définie sur ' + (f.ensemble || 'ℝ') +
          ' : dès qu\'un nombre x y est, son opposé −x y est aussi. On peut donc ' +
          'comparer f(−x) et f(x).</p>';
      }

      /* ② le calcul de f(−x) ---------------------------------------------- */
      if (p.type !== 'domaine' && p.calcul) {
        var suite = POOL.chaine(p.calcul);
        if (p.type === 'paire') suite += ' = f(x)';
        else if (p.type === 'impaire') suite += ' = −f(x)';
        h += '<div class="props-label">② Le calcul de f(−x)</div>' +
             '<p class="fx-calc">f(−x) = ' + suite + '</p>';
        if (p.type === 'aucune') {
          h += '<p class="fx-say">or f(x) = ' + f.expr(par) + ' et −f(x) = −(' +
               f.expr(par) + ') : f(−x) <b>n\'est ni l\'un ni l\'autre</b>.</p>';
        } else if (p.type === 'deux') {
          h += '<p class="fx-say">f est la fonction nulle : f(−x), f(x) et −f(x) valent ' +
               'tous 0. C\'est la <b>seule</b> fonction à vérifier les deux égalités.</p>';
        } else {
          h += '<p class="fx-say">et cette égalité est vraie <b>pour tout x</b> : c\'est ' +
               'une démonstration, pas une vérification sur un exemple.</p>';
        }
      }

      /* Le verdict --------------------------------------------------------- */
      var m = MOT[p.type];
      h += '<div class="par-verdict" style="color:' + m.col + '">' + m.txt + '</div>';

      /* ③ ce que l'on voit sur le graphique -------------------------------- */
      h += '<div class="props-label">③ Sur le graphique</div>';
      if (p.type === 'deux') {
        h += '<p class="fx-say">La courbe — l\'axe des abscisses lui-même — est symétrique ' +
             'par rapport à <b>' + SYM.ordonnees + '</b> <i>et</i> par rapport à <b>' +
             SYM.origine + '</b> : les deux symétries la laissent en place.</p>';
      } else if (p.sym) {
        h += '<p class="fx-say">La courbe est symétrique par rapport à <b>' + SYM[p.sym] +
             '</b>.</p>';
      } else if (p.type === 'aucune') {
        h += '<p class="fx-say">La courbe n\'a <b>aucune</b> de ces deux symétries : le ' +
             'pliage comme le demi-tour la déplacent.</p>';
      } else {
        h += '<p class="fx-say">La courbe n\'occupe qu\'un côté de l\'axe des ordonnées : ' +
             'il n\'y a rien en face à quoi la comparer.</p>';
      }
      var reussi = p.sym === test || p.type === 'deux';
      h += '<p class="' + (reussi ? 'eqx-ok' : 'eqx-warn') + '">' +
        'Tu testes la symétrie par rapport à <b>' + SYM[test] + '</b> : le fantôme ' +
        (reussi ? 'retombe <b>exactement</b> sur la courbe. ✓'
                : 'tombe <b>à côté</b> de la courbe — cette symétrie-là n\'est pas la bonne.') +
        '</p>';

      /* ④ le point courant, et ce qu'il prouve ----------------------------- */
      h += '<div class="props-label">④ Le point que tu déplaces</div>';
      if (!ok(x)) {
        h += '<p class="fx-calc fx-warn">' + nb(x) + ' n\'a pas d\'image : choisis un ' +
             'autre x.</p>';
      } else if (!ok(-x)) {
        h += '<p class="fx-calc fx-warn">f(' + nb(x) + ') = ' + img(x) + ', mais f(' +
             nb(-x) + ') n\'existe pas : la comparaison est impossible.</p>';
      } else if (x === 0) {
        h += '<p class="fx-say">0 est son propre opposé : ce point ne peut rien apprendre. ' +
             'Déplace-le.</p>';
      } else {
        var a = F(x), c = F(-x);
        var eg = Math.abs(c - a) < 1e-9, op = Math.abs(c + a) < 1e-9;
        h += '<p class="par-cmp"><span class="par-eq">f(' + nb(-x) + ') = ' + img(-x) +
          '</span><span>' + (eg ? '=' : op ? 'est l\'opposé de' : '≠') + '</span>' +
          '<span class="par-eq">f(' + nb(x) + ') = ' + img(x) + '</span></p>';
        if (p.type === 'domaine' || p.type === 'aucune') {
          var ct = p.contre;
          h += '<p class="fx-say">Un seul contre-exemple suffit à conclure' +
            (ct ? ' : f(' + nb(-ct.x) + ') = ' + nb(ct.fmx) + ', alors que f(' + nb(ct.x) +
                  ') = ' + nb(ct.fx) + ' et −f(' + nb(ct.x) + ') = ' + nb(-ct.fx) + '. '
                : '. ') +
            'f n\'est donc <b>ni paire ni impaire</b>.</p>';
        } else {
          h += '<p class="fx-say">' + (eg ? 'Les deux images sont <b>égales</b>'
                                          : op ? 'Les deux images sont <b>opposées</b>'
                                               : 'Les deux images diffèrent') +
            ', comme le prévoit le calcul. Mais <b>un exemple ne prouve rien</b> : c\'est ' +
            'le calcul du ② qui vaut pour tous les x à la fois.</p>';
        }
      }

      if (f.remarque) {
        h += '<div class="props-label">À retenir</div>' +
             '<p class="fx-note">' + f.remarque + '</p>';
      }
      if (h !== lastPanel) { lastPanel = h; panel.innerHTML = h; }
    }

    /* ==================================================================== */
    /* Choix de la fonction, de la symétrie testée, des paramètres           */
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

    var symBox = document.createElement('div');
    symBox.className = 'fx-pick par-tests';
    var TESTS = [
      { key: 'ordonnees', label: 'Plier : axe des ordonnées', col: C_AXE },
      { key: 'origine',   label: 'Demi-tour : origine',       col: C_ORI }
    ];
    var symBtns = TESTS.map(function (t) {
      var btn = document.createElement('button');
      btn.innerHTML = '<span class="fx-btn-fx">Tester</span> ' + t.label;
      btn.style.setProperty('--fx-col', t.col);
      btn.onclick = function () { choisirTest(t.key); };
      symBox.appendChild(btn);
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
        var val2 = document.createElement('span');
        val2.className = 'fx-param-val';
        val2.textContent = nb(par[sp.name]);
        input.oninput = function () {
          par[sp.name] = parseFloat(input.value);
          val2.textContent = nb(par[sp.name]);
          fitView(); tout();
        };
        lab.appendChild(name); lab.appendChild(input); lab.appendChild(val2);
        paramsBox.appendChild(lab);
      });
    }

    function majBoutons() {
      pickBtns.forEach(function (b, i) { b.classList.toggle('active', i === sel); });
      symBtns.forEach(function (b, i) {
        b.classList.toggle('active', TESTS[i].key === test);
      });
    }

    function choisirFn(i) {
      sel = i;
      par = POOL.defauts(fn());
      // On met d'abord à l'épreuve la symétrie que la fonction possède ; l'autre
      // reste à un clic, et l'échec est tout aussi parlant.
      test = P().sym || 'ordonnees';
      fitView();
      poseX(2);
      majBoutons(); renderParams();
      play();                          // nouvelle fonction : on refait le raisonnement
    }
    function choisirTest(t) {
      test = t;
      fitView();
      majBoutons();
      tout();                          // la comparaison est immédiate
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function vide() { pC = 0; pX = 0; pA = 0; pL = 0; pT = 0; board.update(); }
    function tout() {
      anim.cancel();
      pC = 1; pX = 1; pA = 1; pL = 1; pT = 1;
      board.update();
    }
    function play() {
      anim.cancel();
      vide();
      anim.runSteps([
        { dur: 1000, step: function (q) { pC = q; } },
        { dur: 700,  step: function (q) { pX = q; } },
        { dur: 700,  step: function (q) { pA = q; } },
        { dur: 900,  step: function (q) { pL = q; } },
        { dur: 1200, step: function (q) { pT = q; } }
      ], vide);
    }

    G.on('drag', function () { poseX(G.X()); tout(); });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout },
      { type: 'button', id: 'xmoins', label: 'x −',
        onClick: function () { poseX(xc() - PAS); tout(); } },
      { type: 'button', id: 'xplus', label: 'x +',
        onClick: function () { poseX(xc() + PAS); tout(); } }
    ]);

    mv.extras.appendChild(pick);
    mv.extras.appendChild(symBox);
    mv.extras.appendChild(paramsBox);
    mv.extras.appendChild(panel);

    board.on('update', refresh);

    test = P().sym || 'ordonnees';
    majBoutons();
    renderParams();
    fitView();
    poseX(2);
    play();            // charge les étapes : en pas à pas, la figure attend l'appui
  }
});
