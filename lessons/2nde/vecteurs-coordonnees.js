/*
 * Coordonnées d'un vecteur (2nde) — lire, calculer, additionner.
 *
 * Deux idées, dans cet ordre :
 *
 *  1) LIRE les coordonnées de AB sur le quadrillage. Pour aller de A à B on
 *     fait un « escalier » : un déplacement HORIZONTAL puis un déplacement
 *     VERTICAL. Ces deux déplacements SONT les coordonnées du vecteur :
 *
 *         AB ( x_B − x_A  ;  y_B − y_A )      « arrivée moins départ »
 *
 *  2) MONTRER que l'addition se fait coordonnée par coordonnée. Avec un
 *     troisième point C, la relation de Chasles donne AB + BC = AC. Sur la
 *     figure on le VOIT : on fait glisser le déplacement horizontal de BC sur
 *     la ligne de celui de AB (ils se mettent bout à bout), et le déplacement
 *     vertical de AB sur la colonne de celui de BC. Les quatre morceaux
 *     forment alors exactement l'escalier de AC :
 *
 *         horizontal :  (x_B − x_A) + (x_C − x_B) = x_C − x_A
 *         vertical   :  (y_B − y_A) + (y_C − y_B) = y_C − y_A
 *
 * Tout est fonction des trois points A, B et C : on peut les déplacer à la
 * souris (ils s'aimantent sur les nœuds du quadrillage), la figure et les
 * calculs du panneau suivent.
 */
MathsView.register({
  id: 'vecteurs-coordonnees',
  title: 'Coordonnées d\'un vecteur',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  exercices: ['vec-coord'],
  theme: 'Vecteurs — coordonnées dans un repère et addition des coordonnées',
  description:
    'Pour aller de <strong>A</strong> à <strong>B</strong>, on se déplace ' +
    '<strong>horizontalement</strong> puis <strong>verticalement</strong> : ces deux ' +
    'déplacements sont les <strong>coordonnées</strong> du vecteur \\(\\vec{AB}\\). ' +
    'On les calcule en faisant <strong>arrivée moins départ</strong> : ' +
    '\\(\\vec{AB}\\,(x_B-x_A\\,;\\,y_B-y_A)\\).' +
    '<br>Avec un troisième point <strong>C</strong>, la figure montre pourquoi ' +
    '\\(\\vec{AC}=\\vec{AB}+\\vec{BC}\\) <strong>coordonnée par coordonnée</strong> : ' +
    'les déplacements horizontaux se mettent bout à bout, les verticaux aussi.' +
    '<br>Clique sur <strong>▶ Animer</strong> pour voir la construction pas à pas ' +
    '(bouton <em>Suivante</em> ou barre espace), et sur <strong>🎲 Nouveaux points</strong> ' +
    'pour changer la figure.' +
    '<br><em>Les points A, B et C se déplacent à la souris : tout se recalcule tout seul.</em>',
  notes:
    '<ul>' +
    '<li><strong>Coordonnées d\'un vecteur.</strong> Dans un repère, ' +
    '\\(\\vec{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}\\) : on soustrait les ' +
    'coordonnées du <em>départ</em> à celles de l\'<em>arrivée</em>. ' +
    'Attention à l\'ordre : \\(\\vec{BA}=-\\vec{AB}\\).</li>' +
    '<li><strong>Ce ne sont pas les coordonnées d\'un point.</strong> Un point est ' +
    '<em>quelque part</em> ; un vecteur est un <em>déplacement</em>. Deux flèches ' +
    'dessinées à des endroits différents ont les mêmes coordonnées si elles ' +
    'représentent le même déplacement.</li>' +
    '<li><strong>Somme.</strong> Si \\(\\vec{u}\\,(x\\,;\\,y)\\) et \\(\\vec{v}\\,(x\'\\,;\\,y\')\\), ' +
    'alors \\(\\vec{u}+\\vec{v}\\,(x+x\'\\,;\\,y+y\')\\) : on additionne les coordonnées ' +
    'une à une.</li>' +
    '<li><strong>Chasles en coordonnées.</strong> ' +
    '\\((x_B-x_A)+(x_C-x_B)=x_C-x_A\\) : les termes intermédiaires se simplifient. ' +
    'C\'est exactement \\(\\vec{AB}+\\vec{BC}=\\vec{AC}\\).</li>' +
    '<li><strong>Deux vecteurs sont égaux</strong> si et seulement s\'ils ont les ' +
    '<strong>mêmes coordonnées</strong>. En particulier ' +
    '\\(\\vec{AB}=\\vec{CD}\\iff\\) ABDC est un parallélogramme.</li>' +
    '<li><strong>Milieu et norme (rappels utiles).</strong> ' +
    '\\(\\|\\vec{AB}\\|=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}\\) dans un repère orthonormé.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: true, grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_AB = '#2563eb';   // vecteur AB et ses déplacements (bleu)
    var C_BC = '#ea580c';   // vecteur BC et ses déplacements (orange)
    var C_AC = '#0d9488';   // vecteur AC = AB + BC (vert)
    var C_GH = '#cbd5e1';   // traces laissées par les déplacements qui glissent
    var INK  = '#334155';   // les points et leurs étiquettes

    function fmt(x) {
      var v = Math.round(x * 10) / 10;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('-', '−').replace('.', ',');
    }
    // « + 3 » / « − 3 » : espacé pour une addition posée, collé pour un nombre
    // relatif qu'on cite (« (−3) »).
    function signed(x) { return (x < 0 ? '− ' : '+ ') + fmt(Math.abs(x)); }
    function tight(x) { return signed(x).replace(' ', ''); }
    // Un nombre négatif s'écrit entre parenthèses dans une soustraction.
    function par(x) { return x < 0 ? '(' + fmt(x) + ')' : fmt(x); }
    function coords(x, y) { return '(' + fmt(x) + ' ; ' + fmt(y) + ')'; }

    // N'appelle setAttribute que si la visibilité change vraiment : la figure
    // est rafraîchie à chaque frame d'animation.
    function show(o, v) {
      v = !!v;
      if (o._mvVis !== v) { o._mvVis = v; o.setAttribute({ visible: v }); }
    }

    /* ==================================================================== */
    /* Avancement des différentes phases de l'animation (0 → 1)              */
    /* ==================================================================== */
    var pAB = { v: 1 };   // tracé du vecteur AB
    var pH1 = { v: 1 };   // déplacement horizontal de AB
    var pV1 = { v: 1 };   // déplacement vertical de AB
    var pBC = { v: 1 };   // tracé du vecteur BC
    var pH2 = { v: 1 };   // déplacement horizontal de BC
    var pV2 = { v: 1 };   // déplacement vertical de BC
    var pAC = { v: 1 };   // tracé du vecteur AC
    var sl  = { v: 1 };   // glissement : les déplacements se mettent bout à bout
    var showCoords = true;

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les trois points libres (aimantés sur le quadrillage)                 */
    /* ==================================================================== */
    var GRID = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    function mkPoint(x, y) {
      return board.create('point', [x, y], Object.assign({
        size: 4, color: INK, withLabel: false, showInfobox: false, layer: 9
      }, GRID));
    }
    var A = mkPoint(-5, -3);
    var B = mkPoint(-1, 1);
    var C = mkPoint(4, 3);

    function ax() { return A.X(); }
    function ay() { return A.Y(); }
    function bx() { return B.X(); }
    function by() { return B.Y(); }
    function cx() { return C.X(); }
    function cy() { return C.Y(); }

    // Les six coordonnées de vecteurs, une bonne fois pour toutes.
    function abx() { return bx() - ax(); }
    function aby() { return by() - ay(); }
    function bcx() { return cx() - bx(); }
    function bcy() { return cy() - by(); }
    function acx() { return cx() - ax(); }
    function acy() { return cy() - ay(); }

    // Point invisible défini par deux fonctions de coordonnées.
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }

    /* ==================================================================== */
    /* Étiquettes des points : « A(−5 ; −3) »                                */
    /* ==================================================================== */
    // Un fond blanc translucide : les étiquettes restent lisibles même
    // posées sur le quadrillage, un axe ou une flèche.
    var BG = 'background:rgba(255,255,255,.82);padding:0 3px;border-radius:5px;' +
             'white-space:nowrap;';

    // Le décalage par rapport au point est donné par deux fonctions : il est
    // choisi au dernier moment, une fois le reste de la figure connu
    // (voir « Placement des étiquettes de points » plus bas).
    function ptLabel(P, letter, dxf, dyf) {
      return board.create('text', [
        function () { return P.X() + dxf(); },
        function () { return P.Y() + dyf(); },
        function () {
          return '<b>' + letter + '</b>' +
            (showCoords ? '(' + fmt(P.X()) + ' ; ' + fmt(P.Y()) + ')' : '');
        }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
           cssStyle: BG, fixed: true, highlight: false, layer: 9, visible: false });
    }
    // Les trois étiquettes sont créées plus bas : leur emplacement se choisit
    // en fonction de tout ce qui est déjà posé sur la figure.

    /* ==================================================================== */
    /* Les trois vecteurs (flèches qui poussent : de P vers P + prog×(dx;dy)) */
    /* ==================================================================== */
    function arrow(P, dxf, dyf, prog, color, w) {
      var tip = pt(function () { return P.X() + prog.v * dxf(); },
                   function () { return P.Y() + prog.v * dyf(); });
      var a = board.create('arrow', [P, tip], {
        strokeColor: color, strokeWidth: w, lastArrow: { type: 2, size: 7 },
        highlight: false, layer: 8, visible: false
      });
      return { a: a, tip: tip };
    }
    var vAB = arrow(A, abx, aby, pAB, C_AB, 3.5);
    var vBC = arrow(B, bcx, bcy, pBC, C_BC, 3.5);
    var vAC = arrow(A, acx, acy, pAC, C_AC, 4.5);

    /* ==================================================================== */
    /* Les quatre déplacements de l'escalier                                 */
    /*                                                                       */
    /* Position AU DÉPART (sl = 0) : chaque vecteur a son propre escalier.    */
    /*   AB : horizontal sur la ligne y = y_A, vertical sur la colonne x = x_B */
    /*   BC : horizontal sur la ligne y = y_B, vertical sur la colonne x = x_C */
    /* Position À L'ARRIVÉE (sl = 1) : on a fait glisser                       */
    /*   - l'horizontal de BC sur la ligne y = y_A (bout à bout avec celui de  */
    /*     AB) ;                                                               */
    /*   - le vertical de AB sur la colonne x = x_C (bout à bout avec celui de */
    /*     BC).                                                                */
    /* Les quatre morceaux forment alors l'escalier de AC :                    */
    /*   A → (x_C ; y_A) → C                                                   */
    /* ==================================================================== */
    // Colonne où se trouve le vertical de AB : de x_B (départ) vers x_C.
    function colV1() { return bx() + sl.v * (cx() - bx()); }
    // Ligne où se trouve l'horizontal de BC : de y_B (départ) vers y_A.
    function ligH2() { return by() + sl.v * (ay() - by()); }

    function step(x0f, y0f, x1f, y1f, prog, color) {
      var tail = pt(x0f, y0f);
      var tip = pt(function () { return x0f() + prog.v * (x1f() - x0f()); },
                   function () { return y0f() + prog.v * (y1f() - y0f()); });
      var a = board.create('arrow', [tail, tip], {
        strokeColor: color, strokeWidth: 2.5, dash: 2,
        lastArrow: { type: 2, size: 6 }, highlight: false, layer: 6, visible: false
      });
      return { a: a, tail: tail, tip: tip, x0: x0f, y0: y0f, x1: x1f, y1: y1f };
    }

    var h1 = step(ax, ay, bx, ay, pH1, C_AB);            // ne bouge jamais
    var v1 = step(colV1, ay, colV1, by, pV1, C_AB);      // glisse vers x = x_C
    var h2 = step(bx, ligH2, cx, ligH2, pH2, C_BC);      // glisse vers y = y_A
    var v2 = step(cx, by, cx, cy, pV2, C_BC);            // ne bouge jamais

    // Traces pâles laissées aux positions de départ par les deux qui glissent.
    function ghost(x0f, y0f, x1f, y1f) {
      return board.create('segment', [pt(x0f, y0f), pt(x1f, y1f)], {
        strokeColor: C_GH, strokeWidth: 2, dash: 1, highlight: false,
        fixed: true, visible: false, layer: 3
      });
    }
    var gV1 = ghost(bx, ay, bx, by);   // le vertical de AB était sur x = x_B
    var gH2 = ghost(bx, by, cx, by);   // l'horizontal de BC était sur y = y_B

    // Le coin de l'escalier de AC : le point (x_C ; y_A).
    var K = board.create('point', [cx, ay], {
      name: '', withLabel: false, size: 2, color: '#94a3b8', fixed: true,
      showInfobox: false, visible: false, layer: 7
    });

    /* ==================================================================== */
    /* Étiquettes des déplacements (la valeur signée, le long de la flèche)   */
    /* ==================================================================== */
    // Un déplacement vertical se légende à sa droite ; un horizontal se légende
    // DU CÔTÉ DE LA MONTÉE (à l'intérieur de l'escalier) — c'est-à-dire à
    // l'opposé de l'étiquette du point d'où il part, qui reste ainsi lisible.
    function stepLabel(s, dx, dyf, valf, color) {
      return board.create('text', [
        function () { return (s.x0() + s.x1()) / 2 + dx; },
        function () { return (s.y0() + s.y1()) / 2 + dyf(); },
        function () { return tight(valf()); }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: color,
           cssStyle: 'font-weight:800;' + BG, fixed: true, highlight: false,
           layer: 7, visible: false });
    }
    function inside(dyf) {   // côté vers lequel on monte (ou descend)
      return function () { return dyf() >= 0 ? 0.42 : -0.42; };
    }
    function flat() { return 0; }

    var tH1 = stepLabel(h1, 0, inside(aby), abx, C_AB);
    var tV1 = stepLabel(v1, 0.5, flat, aby, C_AB);
    var tH2 = stepLabel(h2, 0, inside(bcy), bcx, C_BC);
    var tV2 = stepLabel(v2, 0.5, flat, bcy, C_BC);

    /* ==================================================================== */
    /* Noms des vecteurs, posés au milieu de chaque flèche                   */
    /* ==================================================================== */
    // Le nom se pose au milieu de la flèche, décalé perpendiculairement d'un
    // côté ou de l'autre. `sidef` renvoie +1 (à gauche du sens de parcours) ou
    // −1 : on s'en sert pour fuir ce qui encombre l'autre côté.
    function midText(px, py, qx, qy, txt, color, sidef) {
      return board.create('text', [
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (px() + qx()) / 2 - sidef() * 0.7 * (qy() - py()) / d;
        },
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (py() + qy()) / 2 + sidef() * 0.7 * (qx() - px()) / d;
        },
        txt
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: color,
           cssStyle: 'font-weight:800;' + BG, fixed: true, highlight: false,
           layer: 8, visible: false });
    }
    function X(P) { return function () { return P.X(); }; }
    function Y(P) { return function () { return P.Y(); }; }

    // La petite pointe rappelle qu'on nomme un VECTEUR, pas un segment.
    // (Contenu donné sous forme de fonction : JSXGraph n'essaie pas de
    // l'interpréter comme une formule.)
    function nameOf(txt) {
      return function () {
        return txt + '<span style="font-size:.7em;vertical-align:.6em">▸</span>';
      };
    }
    // AB et BC : leur nom va du côté OPPOSÉ à leur escalier, qui occupe déjà
    // l'autre flanc de la flèche avec ses deux valeurs.
    function awayFromStep(dxf, dyf) {
      return function () { return dxf() * dyf() >= 0 ? 1 : -1; };
    }
    var nAB = midText(X(A), Y(A), X(vAB.tip), Y(vAB.tip), nameOf('AB'), C_AB,
      awayFromStep(abx, aby));
    var nBC = midText(X(B), Y(B), X(vBC.tip), Y(vBC.tip), nameOf('BC'), C_BC,
      awayFromStep(bcx, bcy));
    // AC frôle toujours B (le chemin passe par là) : son nom fuit ce côté-là.
    var nAC = midText(X(A), Y(A), X(vAC.tip), Y(vAC.tip), nameOf('AC'), C_AC,
      function () { return acx() * aby() - acy() * abx() > 0 ? -1 : 1; });

    /* ==================================================================== */
    /* Placement des étiquettes de points                                    */
    /*                                                                       */
    /* « B(3 ; 2) » est un pavé large : posé toujours du même côté, il finit  */
    /* par recouvrir la valeur d'un déplacement ou le nom d'un vecteur — B    */
    /* est particulièrement à l'étroit, les deux escaliers s'y rejoignent et  */
    /* AC lui passe à côté. On essaie donc huit positions autour du point et  */
    /* on garde la première qui est franchement dégagée, en commençant par le */
    /* côté naturel. Les trois étiquettes se placent à la suite (A, puis C,   */
    /* puis B), chacune évitant les précédentes.                             */
    /* ==================================================================== */
    // Huit positions candidates (en unités du repère), l'ellipse autour du point.
    var RING = [[0, -0.68], [0, 0.68], [-1.15, 0], [1.15, 0],
                [-1.05, -0.52], [1.05, -0.52], [-1.05, 0.52], [1.05, 0.52]];

    // Chaque gêneur est un pavé [x, y, demi-largeur, demi-hauteur] déjà
    // augmenté de la demi-taille de l'étiquette qu'on cherche à poser.
    function clearance(x, y, obs) {
      if (Math.abs(x) > 7.5 || Math.abs(y) > 5.6) return 0;   // hors du cadre
      var worst = 9;
      for (var i = 0; i < obs.length; i++) {
        var s = Math.max(Math.abs(x - obs[i][0]) / obs[i][2],
                         Math.abs(y - obs[i][1]) / obs[i][3]);
        if (s < worst) worst = s;
      }
      return worst;   // ≥ 1 : aucun contact
    }

    function placeLabels() {
      // Appelée plusieurs fois par image (une fois par coordonnée) : on garde
      // le résultat tant que la figure n'a pas bougé.
      var sig = [ax(), ay(), bx(), by(), cx(), cy(), sl.v, showCoords].join(',');
      if (placeLabels._sig === sig) return placeLabels._res;

      // On compte aussi les étiquettes pas encore affichées : le placement
      // reste alors le même du début à la fin de l'animation, sans sauter.
      var obs = [];
      [tH1, tV1, tH2, tV2].forEach(function (t) {
        obs.push([t.X(), t.Y(), 1.10, 0.42]);
      });
      [nAB, nBC, nAC].forEach(function (t) {
        obs.push([t.X(), t.Y(), 1.20, 0.42]);
      });
      [A, B, C].forEach(function (P) { obs.push([P.X(), P.Y(), 0.95, 0.31]); });

      function best(P, prefer) {
        var pick = prefer, score = -1;
        var cands = [prefer].concat(RING);
        for (var i = 0; i < cands.length; i++) {
          var s = clearance(P.X() + cands[i][0], P.Y() + cands[i][1], obs);
          if (s > score) { score = s; pick = cands[i]; }
          if (score >= 1) break;      // dégagé : on garde le plus « naturel »
        }
        obs.push([P.X() + pick[0], P.Y() + pick[1], 1.70, 0.42]);
        return pick;
      }

      var up = aby() >= 0;
      var res = {
        A: best(A, [0, up ? -0.68 : 0.68]),
        C: best(C, [0, bcy() >= 0 ? 0.68 : -0.68]),
        B: best(B, [0, up ? 0.68 : -0.68])
      };
      placeLabels._sig = sig;
      placeLabels._res = res;
      return res;
    }
    function slot(letter, i) {
      return function () { return placeLabels()[letter][i]; };
    }

    var lA = ptLabel(A, 'A', slot('A', 0), slot('A', 1));
    var lB = ptLabel(B, 'B', slot('B', 0), slot('B', 1));
    var lC = ptLabel(C, 'C', slot('C', 0), slot('C', 1));

    /* ==================================================================== */
    /* Rafraîchissement : visibilité selon l'avancement                      */
    /* ==================================================================== */
    // Une flèche de longueur nulle ne se dessine pas : inutile de l'afficher.
    function alive(s) {
      return Math.abs(s.x1() - s.x0()) > 0.001 || Math.abs(s.y1() - s.y0()) > 0.001;
    }
    function refresh() {
      show(A, pAB.v > 0.005);
      show(lA, pAB.v > 0.005);
      show(vAB.a, pAB.v > 0.005);
      show(nAB, pAB.v > 0.45);
      show(B, pAB.v > 0.99);
      show(lB, pAB.v > 0.99);

      show(h1.a, pH1.v > 0.005 && alive(h1));
      show(tH1, pH1.v > 0.45 && alive(h1));
      show(v1.a, pV1.v > 0.005 && alive(v1));
      show(tV1, pV1.v > 0.45 && alive(v1));

      show(vBC.a, pBC.v > 0.005);
      show(nBC, pBC.v > 0.45);
      show(C, pBC.v > 0.99);
      show(lC, pBC.v > 0.99);

      show(h2.a, pH2.v > 0.005 && alive(h2));
      show(tH2, pH2.v > 0.45 && alive(h2));
      show(v2.a, pV2.v > 0.005 && alive(v2));
      show(tV2, pV2.v > 0.45 && alive(v2));

      show(vAC.a, pAC.v > 0.005);
      show(nAC, pAC.v > 0.45);

      // Les morceaux ont commencé à glisser : on garde leur trace de départ.
      var moved = sl.v > 0.02;
      show(gV1, moved);
      show(gH2, moved);
      show(K, sl.v > 0.98);
    }

    /* ==================================================================== */
    /* Panneau : les calculs de coordonnées                                  */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    // Notations colorées en HTML (le panneau se redessine à chaque frame :
    // on évite de relancer MathJax en continu).
    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }
    var sAB = vec('AB', C_AB), sBC = vec('BC', C_BC), sAC = vec('AC', C_AC);

    function renderPanel() {
      var abxv = abx(), abyv = aby(), bcxv = bcx(), bcyv = bcy();
      var acxv = acx(), acyv = acy();

      // Où en est la construction ? Le commentaire suit l'animation.
      var head;
      if (pAB.v < 0.99) {
        head = 'Deux points <strong>A</strong> et <strong>B</strong> dans le repère, ' +
          'et le vecteur ' + sAB + ' qui va de A à B.';
      } else if (pV1.v < 0.99) {
        head = '<span style="color:' + C_AB + '">Pour aller de A à B, on se déplace de ' +
          fmt(Math.abs(abxv)) + (abxv < 0 ? ' vers la gauche' : ' vers la droite') +
          ' (' + tight(abxv) + '), puis de ' + fmt(Math.abs(abyv)) +
          (abyv < 0 ? ' vers le bas' : ' vers le haut') + ' (' + tight(abyv) + ').</span> ' +
          'Ces deux déplacements <strong>sont</strong> les coordonnées de ' + sAB + '.';
      } else if (pBC.v < 0.99) {
        head = 'On ajoute un point <strong>C</strong> : le vecteur ' + sBC +
          ' continue le chemin, de B jusqu\'à C.';
      } else if (pV2.v < 0.99) {
        head = '<span style="color:' + C_BC + '">Même travail pour ' + sBC +
          '</span> : son escalier donne ses coordonnées ' + coords(bcxv, bcyv) + '.';
      } else if (pAC.v < 0.99) {
        head = '<span style="color:' + C_AC + '">Le vecteur ' + sAC +
          ' va directement de A à C</span>, sans passer par B.';
      } else if (sl.v < 0.98) {
        head = 'On fait <strong>glisser</strong> les déplacements pour les mettre ' +
          '<strong>bout à bout</strong> : les deux horizontaux sur la ligne de A, ' +
          'les deux verticaux sur la colonne de C.';
      } else {
        head = '<span style="color:' + C_AC + '">Les quatre morceaux forment ' +
          'exactement l\'escalier de ' + sAC + '</span> : les déplacements ' +
          'horizontaux s\'additionnent entre eux, les verticaux aussi. ' +
          'C\'est ça, additionner deux vecteurs en coordonnées.';
      }

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_AC + '">' + sAB + ' + ' + sBC +
          ' = ' + sAC + ' ' + coords(acxv, acyv) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +

        '<div class="props-label">Coordonnées des points</div>' +
        '<ul class="props-list">' +
          '<li>A ' + coords(ax(), ay()) + ' &nbsp; B ' + coords(bx(), by()) +
            ' &nbsp; C ' + coords(cx(), cy()) + '</li>' +
        '</ul>' +

        '<div class="props-label">Arrivée moins départ</div>' +
        '<ul class="props-list">' +
          '<li>' + sAB + ' ( ' + fmt(bx()) + ' − ' + par(ax()) + ' ; ' +
            fmt(by()) + ' − ' + par(ay()) + ' ) = ' + coords(abxv, abyv) + '</li>' +
          '<li>' + sBC + ' ( ' + fmt(cx()) + ' − ' + par(bx()) + ' ; ' +
            fmt(cy()) + ' − ' + par(by()) + ' ) = ' + coords(bcxv, bcyv) + '</li>' +
          '<li>' + sAC + ' ( ' + fmt(cx()) + ' − ' + par(ax()) + ' ; ' +
            fmt(cy()) + ' − ' + par(ay()) + ' ) = ' + coords(acxv, acyv) + '</li>' +
        '</ul>' +

        '<div class="props-label">On additionne coordonnée par coordonnée</div>' +
        '<p style="margin:.2rem 0 0;font-weight:700">' +
          sAB + ' + ' + sBC + ' ( ' + fmt(abxv) + ' ' + signed(bcxv) + ' ; ' +
          fmt(abyv) + ' ' + signed(bcyv) + ' ) = ' + coords(acxv, acyv) + ' = ' +
          sAC + ' <span style="color:' + C_AC + '">✓</span></p>' +
        '<p style="margin:.25rem 0 0;font-size:.9rem;color:var(--ink-soft)">' +
          'Le calcul le dit aussi tout seul : ' +
          '(x<sub>B</sub> − x<sub>A</sub>) + (x<sub>C</sub> − x<sub>B</sub>) = ' +
          'x<sub>C</sub> − x<sub>A</sub>. Le point de passage <strong>B</strong> ' +
          'se simplifie — c\'est la relation de Chasles ' + sAB + ' + ' + sBC +
          ' = ' + sAC + ', lue en coordonnées.</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Tirage au hasard des trois points                                     */
    /* ==================================================================== */
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function newPoints() {
      // Les deux déplacements vont dans le même sens : l'escalier de AC
      // s'étire sans revenir en arrière, la figure reste lisible.
      var sx = Math.random() < 0.5 ? -1 : 1;
      var sy = Math.random() < 0.5 ? -1 : 1;
      var dx1 = sx * rnd(2, 5), dx2 = sx * rnd(2, 5);
      var dy1 = sy * rnd(1, 4), dy2 = sy * rnd(1, 4);

      // A choisi pour que A, B et C tiennent tous dans le cadre.
      var x0 = sx > 0 ? rnd(-7, 7 - (dx1 + dx2)) : rnd(-7 - (dx1 + dx2), 7);
      var y0 = sy > 0 ? rnd(-5, 5 - (dy1 + dy2)) : rnd(-5 - (dy1 + dy2), 5);

      A.setPosition(JXG.COORDS_BY_USER, [x0, y0]);
      B.setPosition(JXG.COORDS_BY_USER, [x0 + dx1, y0 + dy1]);
      C.setPosition(JXG.COORDS_BY_USER, [x0 + dx1 + dx2, y0 + dy1 + dy2]);
    }

    /* ==================================================================== */
    /* Animation                                                             */
    /* ==================================================================== */
    function clearFigure() {
      pAB.v = 0; pH1.v = 0; pV1.v = 0;
      pBC.v = 0; pH2.v = 0; pV2.v = 0;
      pAC.v = 0; sl.v = 0;
      board.update();
    }
    function showAll() {
      anim.cancel();
      pAB.v = 1; pH1.v = 1; pV1.v = 1;
      pBC.v = 1; pH2.v = 1; pV2.v = 1;
      pAC.v = 1; sl.v = 1;
      board.update();
    }

    function play() {
      clearFigure();
      anim.runSteps([
        // 1. le vecteur AB
        { dur: 700, step: function (p) { pAB.v = p; } },
        // 2. son escalier : d'abord l'horizontal, puis le vertical
        { dur: 1000, step: function (p) {
            pH1.v = Math.min(1, 2 * p);
            pV1.v = Math.max(0, 2 * p - 1);
          } },
        // 3. le vecteur BC prolonge le chemin
        { dur: 700, step: function (p) { pBC.v = p; } },
        // 4. son escalier à lui
        { dur: 1000, step: function (p) {
            pH2.v = Math.min(1, 2 * p);
            pV2.v = Math.max(0, 2 * p - 1);
          } },
        // 5. le raccourci : AC, directement de A à C
        { dur: 800, step: function (p) { pAC.v = p; } },
        // 6. les déplacements glissent et se mettent bout à bout
        { dur: 1400, step: function (p) { sl.v = p; } }
      ], clearFigure);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'dice', label: '🎲 Nouveaux points',
        onClick: function () { anim.cancel(); newPoints(); play(); } },
      { type: 'button', id: 'all', label: '↺ Figure complète', onClick: showAll },
      { type: 'checkbox', id: 'coords', label: 'Coordonnées des points', checked: true,
        onChange: function (v) { showCoords = v; board.update(); } }
    ]);

    mv.extras.appendChild(panel);

    newPoints();
    showAll();
  }
});
