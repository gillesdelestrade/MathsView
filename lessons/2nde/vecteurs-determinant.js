/*
 * Le déterminant de deux vecteurs (2nde) — et le cas particulier des
 * vecteurs colinéaires.
 *
 * Pour u(x ; y) et v(x' ; y'), le déterminant est le nombre
 *
 *        det(u, v) = x·y' − y·x'        (produit « en croix »)
 *
 * Ce nombre n'est pas sorti d'un chapeau : sa valeur absolue est l'AIRE du
 * parallélogramme construit sur les deux vecteurs, et son signe dit dans quel
 * sens on tourne pour aller de u à v.
 *
 * D'où le cas particulier, qui est tout l'intérêt de l'outil en 2nde :
 *
 *        det(u, v) = 0  ⟺  le parallélogramme est APLATI
 *                       ⟺  u et v sont COLINÉAIRES
 *
 * Figure : trois points A, B, C sur le quadrillage, les deux vecteurs AB
 * (bleu) et AC (violet) partant de la même origine A, et le parallélogramme
 * ABDC qu'ils engendrent, colorié selon le signe du déterminant.
 *   - A translate toute la figure (les deux vecteurs ne changent pas) ;
 *   - B et C règlent les vecteurs ;
 *   - le bouton « Rendre colinéaires » fait tourner AC jusqu'à la droite (AB) :
 *     le parallélogramme s'aplatit, l'aire tombe à 0, le déterminant aussi,
 *     et A, B, C se retrouvent alignés.
 */
MathsView.register({
  id: 'vecteurs-determinant',
  title: 'Déterminant de deux vecteurs',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  exercices: ['vec-det'],
  theme: 'Vecteurs — déterminant, aire du parallélogramme et test de colinéarité',
  description:
    'Le <strong>déterminant</strong> de deux vecteurs \\(\\vec{u}\\,(x\\,;\\,y)\\) et ' +
    '\\(\\vec{v}\\,(x\'\\,;\\,y\')\\) est le nombre \\(\\det(\\vec{u},\\vec{v})=xy\'-yx\'\\) : ' +
    'on multiplie <strong>en croix</strong>, puis on soustrait.' +
    '<br>Ce nombre se <em>voit</em> sur la figure : sa valeur absolue est l\'<strong>aire ' +
    'du parallélogramme</strong> construit sur les deux vecteurs (et son signe indique le ' +
    'sens dans lequel on tourne pour aller de \\(\\vec{u}\\) vers \\(\\vec{v}\\)).' +
    '<br><strong>Cas particulier</strong> : si le parallélogramme s\'aplatit, son aire ' +
    'devient nulle — c\'est exactement le cas où les deux vecteurs sont ' +
    '<strong>colinéaires</strong>. D\'où le test : ' +
    '\\(\\vec{u}\\) et \\(\\vec{v}\\) colinéaires \\(\\iff xy\'-yx\'=0\\).' +
    '<br>Clique sur <strong>▶ Animer</strong> pour la construction pas à pas, puis sur ' +
    '<strong>Rendre colinéaires</strong> pour voir l\'aire — et le déterminant — tomber à zéro.' +
    '<br><em>Déplace B et C (les deux vecteurs) et A (toute la figure se translate).</em>',
  notes:
    '<ul>' +
    '<li><strong>Définition.</strong> Pour \\(\\vec{u}\\,(x\\,;\\,y)\\) et ' +
    '\\(\\vec{v}\\,(x\'\\,;\\,y\')\\), on pose ' +
    '\\(\\det(\\vec{u},\\vec{v})=\\begin{vmatrix}x&x\'\\\\y&y\'\\end{vmatrix}=xy\'-yx\'\\). ' +
    'Les <em>colonnes</em> du tableau sont les deux vecteurs.</li>' +
    '<li><strong>Théorème (test de colinéarité).</strong> \\(\\vec{u}\\) et \\(\\vec{v}\\) sont ' +
    '<strong>colinéaires</strong> si et seulement si \\(\\det(\\vec{u},\\vec{v})=0\\), ' +
    'c\'est-à-dire \\(xy\'=yx\'\\). C\'est le <em>produit en croix</em> : les coordonnées ' +
    'des deux vecteurs sont proportionnelles.</li>' +
    '<li><strong>Pourquoi ça marche.</strong> \\(|\\det(\\vec{u},\\vec{v})|\\) est l\'aire du ' +
    'parallélogramme construit sur \\(\\vec{u}\\) et \\(\\vec{v}\\) : ' +
    '\\(\\text{aire}=\\text{base}\\times\\text{hauteur}\\). L\'aire est nulle exactement quand ' +
    'la hauteur l\'est, c\'est-à-dire quand les deux vecteurs ont la même direction.</li>' +
    '<li><strong>Signe.</strong> \\(\\det(\\vec{u},\\vec{v})>0\\) si l\'on tourne de \\(\\vec{u}\\) ' +
    'vers \\(\\vec{v}\\) dans le <em>sens direct</em> (antihoraire), négatif dans l\'autre sens. ' +
    'En échangeant les deux vecteurs on change le signe : ' +
    '\\(\\det(\\vec{v},\\vec{u})=-\\det(\\vec{u},\\vec{v})\\) — l\'aire, elle, ne change pas.</li>' +
    '<li><strong>Points alignés.</strong> \\(A\\), \\(B\\) et \\(C\\) sont alignés si et seulement si ' +
    '\\(\\det(\\vec{AB},\\vec{AC})=0\\). C\'est la figure de cette page.</li>' +
    '<li><strong>Droites parallèles.</strong> \\((AB)\\parallel(CD)\\) si et seulement si ' +
    '\\(\\det(\\vec{AB},\\vec{CD})=0\\).</li>' +
    '<li><strong>Cas du vecteur nul.</strong> Si \\(\\vec{u}=\\vec{0}\\), le déterminant est nul ' +
    'quel que soit \\(\\vec{v}\\) : le vecteur nul est colinéaire à tous les vecteurs.</li>' +
    '<li><strong>Lien avec \\(k\\).</strong> Quand \\(\\det(\\vec{u},\\vec{v})=0\\) et ' +
    '\\(\\vec{u}\\neq\\vec{0}\\), il existe un réel \\(k\\) tel que \\(\\vec{v}=k\\,\\vec{u}\\) : ' +
    'on retrouve la définition de la colinéarité.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: true, grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_U    = '#2563eb';   // vecteur AB (bleu)
    var C_V    = '#7c3aed';   // vecteur AC (violet)
    var C_UP   = '#93c5fd';   // copie de AB (côté [CD] du parallélogramme)
    var C_VP   = '#c4b5fd';   // copie de AC (côté [BD])
    var C_POS  = '#16a34a';   // det > 0 : sens direct
    var C_NEG  = '#ea580c';   // det < 0 : sens indirect
    var C_NUL  = '#0d9488';   // det = 0 : vecteurs colinéaires
    var C_LINE = '#c7d2fe';   // droite (AB), en pointillés
    var INK    = '#334155';
    var GREY   = '#94a3b8';

    var EPS = 1e-6;           // en dessous, le déterminant est nul
    var FILL = 0.22;          // opacité du parallélogramme une fois construit

    var BG = 'background:rgba(255,255,255,.85);padding:0 3px;border-radius:5px;' +
             'white-space:nowrap;';

    function fmt(x, n) {
      var p = Math.pow(10, n == null ? 0 : n);
      var v = Math.round(x * p) / p;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('-', '−').replace('.', ',');
    }
    // Un nombre négatif s'écrit entre parenthèses dans un produit.
    function paren(x, n) { return x < 0 ? '(' + fmt(x, n) + ')' : fmt(x, n); }
    function coords(x, y, n) { return '(' + fmt(x, n) + ' ; ' + fmt(y, n) + ')'; }

    // N'appelle setAttribute que si la visibilité change vraiment : la figure
    // est rafraîchie à chaque frame d'animation.
    function show(o, v) {
      v = !!v;
      if (o._mvVis !== v) { o._mvVis = v; o.setAttribute({ visible: v }); }
    }
    // Angle ramené dans ]−π ; π].
    function wrap(t) {
      while (t <= -Math.PI) t += 2 * Math.PI;
      while (t > Math.PI) t -= 2 * Math.PI;
      return t;
    }

    /* ==================================================================== */
    /* Avancement des phases de l'animation (0 → 1)                          */
    /* ==================================================================== */
    var pAB   = { v: 1 };   // tracé du vecteur AB
    var pAC   = { v: 1 };   // tracé du vecteur AC
    var pPAR  = { v: 1 };   // construction du parallélogramme
    var pAIR  = { v: 1 };   // affichage de l'aire
    var pFLAT = { v: 0 };   // aplatissement (rotation de AC sur la droite (AB))

    var showH = false;      // décomposition aire = base × hauteur
    var showLine = true;    // droite (AB)
    var showCoords = true;  // coordonnées à côté des points

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les trois points libres (aimantés sur les nœuds du quadrillage)       */
    /* ==================================================================== */
    var GRID = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    function mkPoint(x, y, color) {
      return board.create('point', [x, y], Object.assign({
        size: 4, color: color, withLabel: false, showInfobox: false, layer: 10
      }, GRID));
    }
    var A = mkPoint(-3, -3, INK);
    var B = mkPoint(1, -2, C_U);
    var C = mkPoint(-2, 0, C_V);

    function ux() { return B.X() - A.X(); }
    function uy() { return B.Y() - A.Y(); }
    function vx() { return C.X() - A.X(); }
    function vy() { return C.Y() - A.Y(); }
    function ulen() { return Math.hypot(ux(), uy()); }
    function vlen() { return Math.hypot(vx(), vy()); }
    function det() {
      var d = ux() * vy() - uy() * vx();
      return Math.abs(d) < EPS ? 0 : d;
    }

    // Point invisible défini par deux fonctions de coordonnées.
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }

    /* A translate TOUTE la figure : les deux vecteurs ne changent pas. ----- */
    var lastA = [A.X(), A.Y()];
    A.on('drag', function () {
      var dx = A.X() - lastA[0], dy = A.Y() - lastA[1];
      lastA = [A.X(), A.Y()];
      B.setPosition(JXG.COORDS_BY_USER, [B.X() + dx, B.Y() + dy]);
      C.setPosition(JXG.COORDS_BY_USER, [C.X() + dx, C.Y() + dy]);
      board.update();
    });
    // Modifier un vecteur à la souris annule l'aplatissement en cours.
    B.on('drag', function () { pFLAT.v = 0; });
    C.on('drag', function () { pFLAT.v = 0; });

    function setFigure(ax, ay, uX, uY, vX, vY) {
      A.setPosition(JXG.COORDS_BY_USER, [ax, ay]);
      B.setPosition(JXG.COORDS_BY_USER, [ax + uX, ay + uY]);
      C.setPosition(JXG.COORDS_BY_USER, [ax + vX, ay + vY]);
      lastA = [ax, ay];
      pFLAT.v = 0;
    }

    /* ==================================================================== */
    /* La droite (AB) : c'est sur elle que C vient se poser quand det = 0    */
    /* ==================================================================== */
    var lineAB = board.create('line', [A, B], {
      strokeColor: C_LINE, strokeWidth: 2, dash: 2, fixed: true,
      highlight: false, layer: 2
    });

    /* ==================================================================== */
    /* Le parallélogramme ABDC                                               */
    /* ==================================================================== */
    // D = A + u + v : le quatrième sommet. Défini par des fonctions, donc
    // impossible à attraper — il suit B et C.
    var D = board.create('point', [
      function () { return B.X() + vx(); },
      function () { return B.Y() + vy(); }
    ], { size: 3, color: GREY, withLabel: false, showInfobox: false,
         fixed: true, highlight: false, layer: 9, visible: false });

    var para = board.create('polygon', [A, B, D, C], {
      fillColor: C_POS, fillOpacity: 0, withLines: false,
      borders: { visible: false }, hasInnerPoints: false,
      fixed: true, highlight: false, layer: 3
    });
    var curFill = -1, curFillCol = '';
    function setFill(op, col) {
      op = Math.round(op * 100) / 100;
      if (op !== curFill || col !== curFillCol) {
        curFill = op; curFillCol = col;
        para.setAttribute({ fillOpacity: op, fillColor: col });
      }
    }

    /* ==================================================================== */
    /* Les deux vecteurs, et les deux copies qui ferment le parallélogramme  */
    /* ==================================================================== */
    // Flèche qui pousse : de P vers P + prog×(dx ; dy).
    function arrow(P, dxf, dyf, prog, color, w, dash) {
      var tip = pt(function () { return P.X() + prog.v * dxf(); },
                   function () { return P.Y() + prog.v * dyf(); });
      var a = board.create('arrow', [P, tip], {
        strokeColor: color, strokeWidth: w, dash: dash || 0,
        lastArrow: { type: 2, size: 7 }, highlight: false, layer: 8, visible: false
      });
      return { a: a, tip: tip };
    }
    var aAB = arrow(A, ux, uy, pAB, C_U, 3.5);          // u = AB
    var aAC = arrow(A, vx, vy, pAC, C_V, 3.5);          // v = AC
    // [BD] est une copie de AC, [CD] une copie de AB : c'est ce qui ferme
    // le parallélogramme.
    var aBD = arrow(B, vx, vy, pPAR, C_VP, 2.5, 2);
    var aCD = arrow(C, ux, uy, pPAR, C_UP, 2.5, 2);

    /* ==================================================================== */
    /* L'arc orienté de u vers v : il montre le SENS, donc le signe          */
    /* ==================================================================== */
    var arc = board.create('curve', [[0], [0]], {
      strokeColor: C_POS, strokeWidth: 2, highlight: false, fixed: true,
      lastArrow: { type: 2, size: 5 }, layer: 6, visible: false
    });
    arc.updateDataArray = function () {
      var r = 1.15;
      var t0 = Math.atan2(uy(), ux());
      var d = wrap(Math.atan2(vy(), vx()) - t0);
      var n = 28, xs = [], ys = [];
      for (var i = 0; i <= n; i++) {
        var t = t0 + d * (i / n);
        xs.push(A.X() + r * Math.cos(t));
        ys.push(A.Y() + r * Math.sin(t));
      }
      this.dataX = xs;
      this.dataY = ys;
    };
    var curArcCol = '';
    function setArcColor(col) {
      if (col !== curArcCol) { curArcCol = col; arc.setAttribute({ strokeColor: col }); }
    }

    /* ==================================================================== */
    /* Décomposition aire = base × hauteur                                   */
    /*                                                                       */
    /* H est le pied de la perpendiculaire abaissée de C sur la droite (AB). */
    /* La hauteur du parallélogramme est CH = |det| / ||AB|| : elle est nulle */
    /* exactement quand C est SUR la droite (AB), donc quand det = 0.        */
    /* ==================================================================== */
    function tproj() {
      var n2 = ux() * ux() + uy() * uy();
      return n2 < 1e-9 ? 0 : (vx() * ux() + vy() * uy()) / n2;
    }
    function hx() { return A.X() + tproj() * ux(); }
    function hy() { return A.Y() + tproj() * uy(); }
    var H = board.create('point', [hx, hy], {
      size: 2, color: GREY, withLabel: false, showInfobox: false,
      fixed: true, highlight: false, visible: false, layer: 7
    });
    var segH = board.create('segment', [C, H], {
      strokeColor: GREY, strokeWidth: 2, dash: 2, fixed: true,
      highlight: false, visible: false, layer: 6
    });
    // Le petit carré de l'angle droit en H.
    function e1x() { return ux() / (ulen() || 1); }
    function e1y() { return uy() / (ulen() || 1); }
    function chl() { return Math.hypot(C.X() - hx(), C.Y() - hy()) || 1; }
    function e2x() { return (C.X() - hx()) / chl(); }
    function e2y() { return (C.Y() - hy()) / chl(); }
    var Q1 = pt(function () { return hx() + 0.28 * e1x(); },
                function () { return hy() + 0.28 * e1y(); });
    var Q2 = pt(function () { return hx() + 0.28 * e1x() + 0.28 * e2x(); },
                function () { return hy() + 0.28 * e1y() + 0.28 * e2y(); });
    var Q3 = pt(function () { return hx() + 0.28 * e2x(); },
                function () { return hy() + 0.28 * e2y(); });
    var sq1 = board.create('segment', [Q1, Q2], {
      strokeColor: GREY, strokeWidth: 1.5, fixed: true, highlight: false,
      visible: false, layer: 6
    });
    var sq2 = board.create('segment', [Q2, Q3], {
      strokeColor: GREY, strokeWidth: 1.5, fixed: true, highlight: false,
      visible: false, layer: 6
    });

    /* ==================================================================== */
    /* Textes posés sur la figure                                            */
    /* ==================================================================== */
    // Étiquette au milieu d'un segment, décalée perpendiculairement. `sidef`
    // renvoie +1 (à gauche du sens de parcours) ou −1 : on s'en sert pour fuir
    // le côté encombré.
    function midText(px, py, qx, qy, txt, color, sidef, size) {
      return board.create('text', [
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (px() + qx()) / 2 - sidef() * 0.6 * (qy() - py()) / d;
        },
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (py() + qy()) / 2 + sidef() * 0.6 * (qx() - px()) / d;
        },
        txt
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: size || 15, color: color,
           cssStyle: 'font-weight:800;' + BG, fixed: true, highlight: false,
           layer: 9, visible: false });
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
    // Les noms des deux vecteurs se posent à l'EXTÉRIEUR du parallélogramme.
    // Celui-ci est du côté de l'autre vecteur : le signe du déterminant dit
    // précisément de quel côté, et les étiquettes basculent avec lui quand on
    // fait passer C de l'autre côté de la droite (AB).
    function outAB() { return det() >= 0 ? -1 : 1; }
    function outAC() { return det() >= 0 ? 1 : -1; }
    var nAB = midText(X(A), Y(A), X(aAB.tip), Y(aAB.tip), nameOf('AB'), C_U, outAB);
    var nAC = midText(X(A), Y(A), X(aAC.tip), Y(aAC.tip), nameOf('AC'), C_V, outAC);

    // Les copies, en plus petit et en pâle : ce sont les MÊMES vecteurs.
    // Elles bordent le parallélogramme par l'autre flanc : leur étiquette part
    // donc du côté opposé à celle du vecteur qu'elles recopient.
    var nBD = midText(X(B), Y(B), X(aBD.tip), Y(aBD.tip), nameOf('AC'), C_VP,
      function () { return -outAC(); }, 12);
    var nCD = midText(X(C), Y(C), X(aCD.tip), Y(aCD.tip), nameOf('AB'), C_UP,
      function () { return -outAB(); }, 12);

    // L'aire, au centre du parallélogramme (= milieu de la diagonale [AD]).
    var tAire = board.create('text', [
      function () { return (A.X() + D.X()) / 2; },
      function () { return (A.Y() + D.Y()) / 2; },
      function () {
        return det() === 0 ? 'aire = 0' : 'aire = ' + fmt(Math.abs(det()), 2);
      }
    ], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: C_POS,
         cssStyle: 'font-weight:800;' + BG, fixed: true, highlight: false,
         layer: 9, visible: false });

    // La hauteur, le long du segment [CH].
    var tH = midText(X(C), Y(C), X(H), Y(H), function () {
      return 'h = ' + fmt(ulen() < 1e-9 ? 0 : Math.abs(det()) / ulen(), 2);
    }, GREY, function () { return 1; }, 13);

    /* ==================================================================== */
    /* Étiquettes des points : « A(−3 ; −3) »                                */
    /*                                                                       */
    /* Chaque étiquette fuit le centre du parallélogramme : elle se pose      */
    /* toujours du côté extérieur, là où rien ne la recouvre.                */
    /* ==================================================================== */
    // Décalage de l'étiquette : dans la direction qui s'éloigne du centre.
    function away(P, i) {
      var cx = (A.X() + D.X()) / 2, cy = (A.Y() + D.Y()) / 2;
      var dx = P.X() - cx, dy = P.Y() - cy;
      var d = Math.hypot(dx, dy);
      if (d < 0.2) return i === 0 ? 0 : -0.7;            // figure aplatie
      return i === 0 ? 1.25 * dx / d : 0.62 * dy / d;
    }
    function ptLabel(P, letter, withCoords) {
      return board.create('text', [
        function () { return P.X() + away(P, 0); },
        function () { return P.Y() + away(P, 1); },
        function () {
          return '<b>' + letter + '</b>' +
            (withCoords && showCoords ? '(' + fmt(P.X(), 2) + ' ; ' + fmt(P.Y(), 2) + ')' : '');
        }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: INK,
           cssStyle: BG, fixed: true, highlight: false, layer: 10, visible: false });
    }
    var lA = ptLabel(A, 'A', true);
    var lB = ptLabel(B, 'B', true);
    var lC = ptLabel(C, 'C', true);
    var lD = ptLabel(D, 'D', false);

    /* ==================================================================== */
    /* Rafraîchissement de la figure                                         */
    /* ==================================================================== */
    function refresh() {
      var d = det();
      var col = d > 0 ? C_POS : d < 0 ? C_NEG : C_NUL;
      var built = pPAR.v > 0.99;

      show(A, pAB.v > 0.005);
      show(lA, pAB.v > 0.005);
      show(aAB.a, pAB.v > 0.005 && ulen() > 1e-6);
      show(nAB, pAB.v > 0.45 && ulen() > 0.6);
      show(B, pAB.v > 0.99);
      show(lB, pAB.v > 0.99);
      show(lineAB, showLine && pAB.v > 0.99 && ulen() > 1e-6);

      show(aAC.a, pAC.v > 0.005 && vlen() > 1e-6);
      show(nAC, pAC.v > 0.45 && vlen() > 0.6);
      show(C, pAC.v > 0.99);
      show(lC, pAC.v > 0.99);
      // L'arc n'a de sens que si les deux vecteurs existent et ne sont pas
      // déjà confondus.
      show(arc, pAC.v > 0.99 && ulen() > 1.6 && vlen() > 1.6 && d !== 0);
      setArcColor(col);

      show(aBD.a, pPAR.v > 0.005 && vlen() > 1e-6);
      show(aCD.a, pPAR.v > 0.005 && ulen() > 1e-6);
      show(nBD, built && vlen() > 1.2 && d !== 0);
      show(nCD, built && ulen() > 1.2 && d !== 0);
      show(D, built && Math.hypot(D.X() - A.X(), D.Y() - A.Y()) > 0.2);
      show(lD, built && Math.hypot(D.X() - A.X(), D.Y() - A.Y()) > 0.6);
      setFill(FILL * pPAR.v, col);

      show(tAire, pAIR.v > 0.5 && built);
      if (tAire._mvCol !== col) { tAire._mvCol = col; tAire.setAttribute({ color: col }); }

      var wantH = showH && built && d !== 0;
      show(H, wantH);
      show(segH, wantH);
      show(sq1, wantH);
      show(sq2, wantH);
      show(tH, wantH);
    }

    /* ==================================================================== */
    /* Panneau : le calcul du déterminant, et ce qu'il raconte               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    // Notations colorées en HTML (le panneau se redessine à chaque frame :
    // on évite de relancer MathJax en continu).
    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }
    var sAB = vec('AB', C_U), sAC = vec('AC', C_V);

    // Le tableau 2×2 entre barres verticales : une colonne par vecteur.
    function detArray() {
      return '<span style="display:inline-grid;grid-template-columns:auto auto;' +
        'gap:.1rem 1rem;justify-items:center;padding:.15rem .5rem;margin:0 .2rem;' +
        'border-left:2px solid ' + INK + ';border-right:2px solid ' + INK + ';' +
        'vertical-align:middle">' +
        '<b style="color:' + C_U + '">' + fmt(ux(), 2) + '</b>' +
        '<b style="color:' + C_V + '">' + fmt(vx(), 2) + '</b>' +
        '<b style="color:' + C_U + '">' + fmt(uy(), 2) + '</b>' +
        '<b style="color:' + C_V + '">' + fmt(vy(), 2) + '</b>' +
        '</span>';
    }

    function renderPanel() {
      var uX = ux(), uY = uy(), vX = vx(), vY = vy();
      var d = det();
      var p1 = uX * vY, p2 = uY * vX;
      var col = d > 0 ? C_POS : d < 0 ? C_NEG : C_NUL;
      var degU = ulen() < 1e-9, degV = vlen() < 1e-9;

      /* Le commentaire suit l'animation, puis l'état de la figure ---------- */
      var head;
      if (pAB.v < 0.99) {
        head = 'Un premier vecteur ' + sAB + ', tracé depuis le point <strong>A</strong>.';
      } else if (pAC.v < 0.99) {
        head = 'Un second vecteur ' + sAC + ', tracé depuis <strong>la même origine</strong> A. ' +
          'C\'est ce couple de vecteurs dont on va calculer le déterminant.';
      } else if (pPAR.v < 0.99) {
        head = 'On <strong>ferme le parallélogramme</strong> ABDC : depuis B on reporte ' +
          sAC + ', depuis C on reporte ' + sAB + '. Les deux reports se rejoignent en D.';
      } else if (pAIR.v < 0.99) {
        head = 'L\'<strong>aire</strong> de ce parallélogramme, c\'est exactement ' +
          '<strong>|det(' + sAB + ', ' + sAC + ')|</strong>.';
      } else if (pFLAT.v > 0.001 && pFLAT.v < 0.999) {
        head = '<span style="color:' + C_NUL + '">On fait tourner ' + sAC +
          ' vers la droite (AB) : le parallélogramme s\'<strong>aplatit</strong>, ' +
          'son aire diminue… et le déterminant avec elle.</span>';
      } else if (degU || degV) {
        head = '<span style="color:' + C_NUL + '">Un des deux vecteurs est le ' +
          '<strong>vecteur nul</strong> : il n\'y a plus de parallélogramme, et le ' +
          'déterminant est nul. Le vecteur nul est colinéaire à tous les vecteurs.</span>';
      } else if (d === 0) {
        head = '<span style="color:' + C_NUL + '">Le parallélogramme est <strong>aplati</strong> : ' +
          'son aire est nulle, donc le déterminant aussi. ' + sAB + ' et ' + sAC +
          ' sont <strong>colinéaires</strong>, et A, B, C sont <strong>alignés</strong>.</span>';
      } else {
        head = 'Le déterminant vaut <strong style="color:' + col + '">' + fmt(d, 2) +
          '</strong> : il n\'est <strong>pas nul</strong>, donc ' + sAB + ' et ' + sAC +
          ' ne sont <strong>pas colinéaires</strong> — le parallélogramme a une vraie aire.';
      }

      /* Le coefficient k, quand les vecteurs sont bien colinéaires --------- */
      var kTxt = '';
      if (d === 0 && !degU) {
        var k = (Math.abs(uX) > Math.abs(uY)) ? vX / uX : vY / uY;
        kTxt = '<p style="margin:.25rem 0 0">Et l\'on retrouve bien un coefficient : ' +
          sAC + ' = <strong>' + fmt(k, 2) + '</strong> × ' + sAB +
          (k < 0 ? ' (négatif : les deux flèches pointent en sens opposés).' : '.') + '</p>';
      }

      /* Aire = base × hauteur, si l'option est cochée --------------------- */
      var hTxt = '';
      if (showH && !degU) {
        var h = Math.abs(d) / ulen();
        hTxt = '<p style="margin:.25rem 0 0">base × hauteur = ' + fmt(ulen(), 2) +
          ' × ' + fmt(h, 2) + ' = <strong>' + fmt(ulen() * h, 2) + '</strong>' +
          (d === 0
            ? ' — la <strong>hauteur est nulle</strong> : C est sur la droite (AB).'
            : ' : on retrouve |det|.') + '</p>';
      }

      /* Signe et orientation ---------------------------------------------- */
      var signTxt;
      if (d > 0) {
        signTxt = '<span style="color:' + C_POS + '">Le déterminant est <strong>positif</strong> : ' +
          'pour aller de ' + sAB + ' vers ' + sAC + ' on tourne dans le ' +
          '<strong>sens direct</strong> (antihoraire).</span>';
      } else if (d < 0) {
        signTxt = '<span style="color:' + C_NEG + '">Le déterminant est <strong>négatif</strong> : ' +
          'pour aller de ' + sAB + ' vers ' + sAC + ' on tourne dans le ' +
          '<strong>sens indirect</strong> (horaire). L\'aire, elle, reste ' +
          fmt(Math.abs(d), 2) + '.</span>';
      } else {
        signTxt = '<span style="color:' + C_NUL + '">Déterminant nul : il n\'y a plus de sens de ' +
          'rotation, les deux vecteurs ont la <strong>même direction</strong>.</span>';
      }

      panel.innerHTML =
        '<div class="props-name" style="color:' + col + '">det(' + sAB + ', ' + sAC +
          ') = ' + fmt(d, 2) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +

        '<div class="props-label">Les deux vecteurs</div>' +
        '<ul class="props-list">' +
          '<li>' + sAB + ' ' + coords(uX, uY, 2) + ' &nbsp;&nbsp; ' +
            sAC + ' ' + coords(vX, vY, 2) + '</li>' +
        '</ul>' +

        '<div class="props-label">Le calcul : on multiplie en croix</div>' +
        '<p style="margin:.3rem 0 .2rem;line-height:2.1">det = ' + detArray() +
          ' = ' + paren(uX, 2) + ' × ' + paren(vY, 2) + ' − ' +
          paren(uY, 2) + ' × ' + paren(vX, 2) + '</p>' +
        '<p style="margin:0 0 .2rem">&nbsp;&nbsp;&nbsp;&nbsp;= ' + fmt(p1, 2) + ' − ' +
          paren(p2, 2) + ' = <strong style="color:' + col + '">' + fmt(d, 2) +
          '</strong></p>' +

        '<div class="props-label">Ce que ce nombre raconte</div>' +
        '<ul class="props-list">' +
          '<li>Aire du parallélogramme ABDC = |det| = <strong>' +
            fmt(Math.abs(d), 2) + '</strong></li>' +
          '<li>' + signTxt + '</li>' +
          '<li>Si on échange les deux vecteurs : det(' + sAC + ', ' + sAB + ') = ' +
            fmt(-d, 2) + ' — même aire, signe opposé.</li>' +
        '</ul>' +
        hTxt +

        '<div class="props-label">Cas particulier : les vecteurs colinéaires</div>' +
        '<p style="margin:.2rem 0 0;font-weight:700;color:' + (d === 0 ? C_NUL : GREY) + '">' +
          (d === 0
            ? 'det = 0 ✓ &nbsp;' + sAB + ' et ' + sAC + ' sont colinéaires, ' +
              'donc A, B et C sont alignés.'
            : 'det = ' + fmt(d, 2) + ' ≠ 0 : pas colinéaires, A, B et C ne sont pas alignés. ' +
              'Fais tourner C (ou clique sur « Rendre colinéaires ») pour aplatir le ' +
              'parallélogramme.') +
        '</p>' + kTxt +
        '<p style="margin:.45rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'À retenir : <strong>det(u, v) = 0 ⟺ u et v colinéaires</strong>. ' +
          'C\'est le test qui sert à prouver que trois points sont alignés ou que ' +
          'deux droites sont parallèles.</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Aplatissement : on fait tourner AC jusqu'à la direction de AB         */
    /* ==================================================================== */
    var flatFrom = null;      // { th, r } : direction et longueur de AC au départ
    var snapped = true;       // C est-il aimanté sur le quadrillage ?
    function snapC(on) {
      if (on !== snapped) { snapped = on; C.setAttribute({ snapToGrid: on }); }
    }
    function grabFlat() {
      flatFrom = { th: Math.atan2(vy(), vx()), r: vlen() };
    }
    function flatStep(p) {
      if (!flatFrom || flatFrom.r < 1e-9) return;
      var th0 = flatFrom.th;
      // On vise la direction de AB la PLUS PROCHE : la rotation est minimale
      // (parfois vers AB, parfois vers son opposé — la colinéarité est la même).
      var thu = Math.atan2(uy(), ux());
      var d1 = wrap(thu - th0), d2 = wrap(thu + Math.PI - th0);
      var dth = Math.abs(d1) <= Math.abs(d2) ? d1 : d2;
      var th = th0 + p * dth;
      C.setPosition(JXG.COORDS_BY_USER, [A.X() + flatFrom.r * Math.cos(th),
                                         A.Y() + flatFrom.r * Math.sin(th)]);
    }

    /* ==================================================================== */
    /* Tirage au hasard de deux vecteurs lisibles                            */
    /* ==================================================================== */
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function newVectors() {
      var uX, uY, vX, vY, d, tries = 0;
      do {
        uX = rnd(-5, 5); uY = rnd(-4, 4);
        vX = rnd(-5, 5); vY = rnd(-4, 4);
        d = uX * vY - uY * vX;
        tries++;
      } while (tries < 300 && (Math.abs(d) < 5 || Math.abs(d) > 22 ||
               Math.hypot(uX, uY) < 2.5 || Math.hypot(vX, vY) < 2.5 ||
               Math.abs(uX) + Math.abs(uY) + Math.abs(vX) + Math.abs(vY) > 14));

      // A choisi pour que les quatre sommets tiennent dans le cadre.
      var xs = [0, uX, vX, uX + vX], ys = [0, uY, vY, uY + vY];
      var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
      var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
      snapC(true);
      setFigure(rnd(-7 - xmin, 7 - xmax), rnd(-5 - ymin, 5 - ymax), uX, uY, vX, vY);
    }

    /* ==================================================================== */
    /* Animation                                                             */
    /* ==================================================================== */
    var C0 = null;            // position de C avant l'aplatissement

    function clearFigure() {
      pAB.v = 0; pAC.v = 0; pPAR.v = 0; pAIR.v = 0; pFLAT.v = 0;
      if (C0) C.setPosition(JXG.COORDS_BY_USER, C0);
      snapC(true);
      board.update();
    }
    function showAll() {
      anim.cancel();
      pAB.v = 1; pAC.v = 1; pPAR.v = 1; pAIR.v = 1;
      board.update();
    }

    function play() {
      C0 = [C.X(), C.Y()];
      grabFlat();
      clearFigure();
      anim.runSteps([
        // 1. le premier vecteur
        { dur: 650, step: function (p) { pAB.v = p; } },
        // 2. le second, de même origine
        { dur: 650, step: function (p) { pAC.v = p; } },
        // 3. on ferme le parallélogramme avec les deux copies
        { dur: 900, step: function (p) { pPAR.v = p; } },
        // 4. son aire, c'est |det|
        { dur: 600, step: function (p) { pAIR.v = p; } },
        // 5. on aplatit : l'aire — et le déterminant — tombent à 0
        { dur: 1600,
          step: function (p) { snapC(false); pFLAT.v = p; flatStep(p); },
          after: function () { snapC(true); } }
      ], clearFigure);
    }

    // Le même aplatissement, tout seul, depuis la figure telle qu'elle est.
    function flatten() {
      anim.cancel();
      showAll();
      C0 = [C.X(), C.Y()];
      grabFlat();
      snapC(false);
      anim.animate(1600,
        function (p) { pFLAT.v = p; flatStep(p); },
        function () { snapC(true); });
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'flat', label: '∥ Rendre colinéaires', onClick: flatten },
      { type: 'button', id: 'dice', label: '🎲 Nouveaux vecteurs',
        onClick: function () { anim.cancel(); newVectors(); play(); } },
      { type: 'button', id: 'all', label: '↺ Figure complète', onClick: showAll },
      { type: 'checkbox', id: 'height', label: 'aire = base × hauteur', checked: false,
        onChange: function (v) { showH = v; board.update(); } },
      { type: 'checkbox', id: 'line', label: 'droite (AB)', checked: true,
        onChange: function (v) { showLine = v; board.update(); } },
      { type: 'checkbox', id: 'coords', label: 'coordonnées des points', checked: true,
        onChange: function (v) { showCoords = v; board.update(); } }
    ]);

    mv.extras.appendChild(panel);

    newVectors();
    showAll();
  }
});
