/*
 * Les aires (6ème) — carré, rectangle, triangle, disque.
 *
 * On choisit une forme, on déplace ses sommets (ou son rayon), et le site
 * recalcule l'aire en direct en montrant la formule et le calcul.
 *
 * Un quadrillage d'unités rappelle que l'aire, c'est « combien de petits carrés
 * d'une unité de côté tiennent dans la figure » : pour le rectangle et le carré,
 * c'est littéralement le nombre de cases.
 *
 * ---------------------------------------------------------------------------
 * Rappels techniques (voir la leçon fractions, mêmes pièges JSXGraph) :
 *  - les fonctions de calcul sont définies APRÈS la création des points, mais
 *    ne sont appelées qu'à la mise à jour, donc jamais avant que les points
 *    existent ;
 *  - toute forme dont la géométrie change est une `curve` pilotée par
 *    updateDataArray (jamais board.create('curve', [fx, fy]), qui donnerait une
 *    courbe paramétrique).
 */
MathsView.register({
  id: 'aires',
  title: 'Les aires',
  level: '6eme',
  theme: 'Grandeurs — aire des figures usuelles',
  description:
    'L\'<strong>aire</strong> d\'une figure, c\'est la taille de la surface qu\'elle ' +
    'occupe. On la mesure en <strong>unités d\'aire</strong> : le petit carré du ' +
    'quadrillage, de 1 unité de côté, vaut 1 unité d\'aire.' +
    '<br><strong>Choisis une forme</strong> ci-dessous, puis <strong>déplace ses points</strong> ' +
    '(bleus) : l\'aire et son calcul se mettent à jour tout seuls.',
  notes:
    '<ul>' +
    '<li><strong>Carré</strong> de côté \\( c \\) : \\( \\mathcal{A} = c \\times c = c^2 \\).</li>' +
    '<li><strong>Rectangle</strong> de longueur \\( L \\) et largeur \\( \\ell \\) : ' +
    '\\( \\mathcal{A} = L \\times \\ell \\).</li>' +
    '<li><strong>Triangle</strong> de base \\( b \\) et hauteur \\( h \\) : ' +
    '\\( \\mathcal{A} = \\dfrac{b \\times h}{2} \\). La hauteur est le segment ' +
    'perpendiculaire à la base, tracé en pointillés.</li>' +
    '<li><strong>Disque</strong> de rayon \\( r \\) : \\( \\mathcal{A} = \\pi \\times r^2 \\), ' +
    'avec \\( \\pi \\approx 3,14 \\). L\'aire n\'est presque jamais un nombre rond, ' +
    'd\'où le signe « ≈ ».</li>' +
    '</ul>',
  board: { boundingbox: [-1.5, 8.5, 12.5, -2], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ---- État ----------------------------------------------------------- */
    var shape = 'carre';       // 'carre' | 'rectangle' | 'triangle' | 'disque'
    var sqSide = 4;            // côté courant du carré (maintenu par les drags)

    /* ---- Petits outils vectoriels -------------------------------------- */
    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }
    function cross3(A, B, C) {  // produit vectoriel (AB, AC), signé
      return (B.X() - A.X()) * (C.Y() - A.Y()) - (B.Y() - A.Y()) * (C.X() - A.X());
    }
    function fr(x, dec) {       // nombre à la française : virgule décimale
      var d = dec == null ? 1 : dec;
      return x.toFixed(d).replace('.', ',');
    }

    var ACCENT = '#2563eb', TRAIT = '#334155';

    /* ==================================================================== */
    /* Quadrillage d'unités (statique) : une seule courbe, NaN en séparateur */
    /* ==================================================================== */
    var GX = [], GY = [];
    for (var x = 0; x <= 12; x++) { GX.push(x, x, NaN); GY.push(0, 8, NaN); }
    for (var y = 0; y <= 8; y++)  { GX.push(0, 12, NaN); GY.push(y, y, NaN); }
    var grille = board.create('curve', [GX, GY],
      { strokeColor: '#e2e8f0', strokeWidth: 1, fixed: true, highlight: false });

    /* ==================================================================== */
    /* Les points déplaçables (créés AVANT les textes qui les lisent)        */
    /* ==================================================================== */
    function pt(x, y, name) {
      return board.create('point', [x, y],
        { name: name || '', size: 4, color: ACCENT, withLabel: !!name,
          label: { offset: [8, 8], fontSize: 13 }, snapToGrid: false });
    }

    // Carré : coin bas-gauche + coin haut-droit (maintenu sur la diagonale).
    var sqA = pt(1, 1, 'A'), sqC = pt(1 + sqSide, 1 + sqSide, '');
    // Rectangle : deux coins opposés, libres.
    var reA = pt(1, 1, 'A'), reC = pt(7, 4, 'C');
    // Triangle : trois sommets libres.
    var trA = pt(4, 6, 'A'), trB = pt(1, 1, 'B'), trC = pt(9, 1, 'C');
    // Disque : centre + poignée de rayon.
    var dkO = pt(6, 3.5, 'O'), dkR = pt(9.5, 3.5, '');

    /* ==================================================================== */
    /* Mesures (appelées seulement à la mise à jour → points déjà créés)     */
    /* ==================================================================== */
    function rectDims() {
      return { L: Math.abs(reC.X() - reA.X()), l: Math.abs(reC.Y() - reA.Y()) };
    }
    function triMetrics() {
      var base = dist(trB, trC);
      var aire = Math.abs(cross3(trB, trC, trA)) / 2;   // ½ |produit vectoriel|
      var h = base > 1e-9 ? 2 * aire / base : 0;
      // Pied de la hauteur : projection de A sur la droite (BC).
      var ux = trC.X() - trB.X(), uy = trC.Y() - trB.Y();
      var L2 = ux * ux + uy * uy || 1;
      var t = ((trA.X() - trB.X()) * ux + (trA.Y() - trB.Y()) * uy) / L2;
      return { base: base, h: h, aire: aire, foot: [trB.X() + t * ux, trB.Y() + t * uy] };
    }
    function diskR() { return dist(dkO, dkR); }

    function aire() {
      if (shape === 'carre') return sqSide * sqSide;
      if (shape === 'rectangle') { var d = rectDims(); return d.L * d.l; }
      if (shape === 'triangle') return triMetrics().aire;
      return Math.PI * diskR() * diskR();
    }

    /* ==================================================================== */
    /* Les corps des formes : des courbes pilotées par updateDataArray       */
    /* ==================================================================== */
    function bodyCurve(fill, stroke) {
      return board.create('curve', [[], []], {
        strokeColor: stroke, strokeWidth: 2, fillColor: fill, fillOpacity: 0.45,
        fixed: true, highlight: false
      });
    }

    var carre = bodyCurve('#93c5fd', '#1d4ed8');
    carre.updateDataArray = function () {
      var ax = sqA.X(), ay = sqA.Y(), s = sqSide;
      this.dataX = [ax, ax + s, ax + s, ax, ax];
      this.dataY = [ay, ay, ay + s, ay + s, ay];
    };

    var rect = bodyCurve('#5eead4', '#0d9488');
    rect.updateDataArray = function () {
      var x1 = Math.min(reA.X(), reC.X()), x2 = Math.max(reA.X(), reC.X());
      var y1 = Math.min(reA.Y(), reC.Y()), y2 = Math.max(reA.Y(), reC.Y());
      this.dataX = [x1, x2, x2, x1, x1];
      this.dataY = [y1, y1, y2, y2, y1];
    };

    var tri = bodyCurve('#fde68a', '#f59e0b');
    tri.updateDataArray = function () {
      this.dataX = [trB.X(), trC.X(), trA.X(), trB.X()];
      this.dataY = [trB.Y(), trC.Y(), trA.Y(), trB.Y()];
    };

    var disque = bodyCurve('#ddd6fe', '#7c3aed');
    disque.updateDataArray = function () {
      var r = diskR(), cx = dkO.X(), cy = dkO.Y(), N = 60, X = [], Y = [];
      for (var k = 0; k <= N; k++) {
        var a = 2 * Math.PI * k / N;
        X.push(cx + r * Math.cos(a)); Y.push(cy + r * Math.sin(a));
      }
      this.dataX = X; this.dataY = Y;
    };

    // Hauteur du triangle (pointillés) + petit angle droit au pied.
    var hauteur = board.create('curve', [[], []],
      { strokeColor: '#b45309', strokeWidth: 1.5, dash: 2, fixed: true, highlight: false });
    hauteur.updateDataArray = function () {
      var m = triMetrics();
      this.dataX = [trA.X(), m.foot[0]];
      this.dataY = [trA.Y(), m.foot[1]];
    };
    var angleDroit = board.create('curve', [[], []],
      { strokeColor: '#b45309', strokeWidth: 1.2, fixed: true, highlight: false });
    angleDroit.updateDataArray = function () {
      var m = triMetrics(), F = m.foot, sgn = 0.35;
      var bx = trC.X() - trB.X(), by = trC.Y() - trB.Y(), bn = Math.hypot(bx, by) || 1;
      var ux = bx / bn, uy = by / bn;             // le long de la base
      var ax = trA.X() - F[0], ay = trA.Y() - F[1], an = Math.hypot(ax, ay) || 1;
      var vx = ax / an, vy = ay / an;             // vers le sommet
      this.dataX = [F[0] + ux * sgn, F[0] + ux * sgn + vx * sgn, F[0] + vx * sgn];
      this.dataY = [F[1] + uy * sgn, F[1] + uy * sgn + vy * sgn, F[1] + vy * sgn];
    };

    // Rayon du disque (trait plein du centre à la poignée) + label r.
    var rayon = board.create('curve', [[], []],
      { strokeColor: '#7c3aed', strokeWidth: 2, fixed: true, highlight: false });
    rayon.updateDataArray = function () {
      this.dataX = [dkO.X(), dkR.X()]; this.dataY = [dkO.Y(), dkR.Y()];
    };

    /* ==================================================================== */
    /* Étiquettes de dimensions sur la figure                                */
    /* ==================================================================== */
    function midText(fx, fy, ftxt, color) {
      return board.create('text', [fx, fy, ftxt],
        { fontSize: 14, color: color || TRAIT, anchorX: 'middle', anchorY: 'middle',
          cssStyle: 'font-weight:600', fixed: true, highlight: false });
    }

    // Carré : côté sous l'arête du bas.
    var lblCarre = midText(
      function () { return sqA.X() + sqSide / 2; },
      function () { return sqA.Y() - 0.4; },
      function () { return 'c = ' + fr(sqSide); });

    // Rectangle : L en bas, l à gauche.
    var lblRectL = midText(
      function () { return (reA.X() + reC.X()) / 2; },
      function () { return Math.min(reA.Y(), reC.Y()) - 0.4; },
      function () { return 'L = ' + fr(rectDims().L); });
    var lblRectl = midText(
      function () { return Math.min(reA.X(), reC.X()) - 0.5; },
      function () { return (reA.Y() + reC.Y()) / 2; },
      function () { return 'ℓ = ' + fr(rectDims().l); });

    // Triangle : base sous [BC], hauteur à côté du trait pointillé.
    var lblBase = midText(
      function () { return (trB.X() + trC.X()) / 2; },
      function () { return Math.min(trB.Y(), trC.Y()) - 0.4; },
      function () { return 'base = ' + fr(triMetrics().base); });
    var lblH = midText(
      function () { var m = triMetrics(); return (trA.X() + m.foot[0]) / 2 + 0.35; },
      function () { var m = triMetrics(); return (trA.Y() + m.foot[1]) / 2; },
      function () { return 'h = ' + fr(triMetrics().h); }, '#b45309');

    // Disque : rayon au milieu du trait.
    var lblR = midText(
      function () { return (dkO.X() + dkR.X()) / 2; },
      function () { return (dkO.Y() + dkR.Y()) / 2 - 0.35; },
      function () { return 'r = ' + fr(diskR()); }, '#7c3aed');

    // Titre sur la figure : nom de la forme + aire.
    var NOMS = { carre: 'Carré', rectangle: 'Rectangle', triangle: 'Triangle', disque: 'Disque' };
    board.create('text', [-1, 8.1, function () {
      return NOMS[shape] + ' — aire ' + (shape === 'disque' ? '≈ ' : '= ') +
             fr(aire()) + ' unités²';
    }], { fontSize: 18, cssStyle: 'font-weight:700', color: '#1e293b', fixed: true });

    /* ==================================================================== */
    /* Regroupement des éléments par forme, pour l'affichage sélectif        */
    /* ==================================================================== */
    var groups = {
      carre:     [carre, sqA, sqC, lblCarre],
      rectangle: [rect, reA, reC, lblRectL, lblRectl],
      triangle:  [tri, trA, trB, trC, hauteur, angleDroit, lblBase, lblH],
      disque:    [disque, dkO, dkR, rayon, lblR]
    };

    function applyVisibility() {
      Object.keys(groups).forEach(function (name) {
        var on = (name === shape);
        groups[name].forEach(function (el) { el.setAttribute({ visible: on }); });
      });
    }

    /* ==================================================================== */
    /* Contraintes de déplacement (carré : coin sur la diagonale)            */
    /* ==================================================================== */
    // On garde le carré carré : le coin suit toujours (côté, côté) depuis A.
    sqC.on('drag', function () {
      var s = Math.max(sqC.X() - sqA.X(), sqC.Y() - sqA.Y());
      sqSide = Math.max(0.5, s);
      sqC.setPosition(JXG.COORDS_BY_USER, [sqA.X() + sqSide, sqA.Y() + sqSide]);
      board.update();
    });
    // Déplacer A translate le carré : le coin garde le côté courant.
    sqA.on('drag', function () {
      sqC.setPosition(JXG.COORDS_BY_USER, [sqA.X() + sqSide, sqA.Y() + sqSide]);
      board.update();
    });

    /* ==================================================================== */
    /* Panneau : formule + calcul (HTML simple, pas de MathJax en direct)    */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function render() {
      var html = '', A = aire();
      if (shape === 'carre') {
        var c = fr(sqSide);
        html = titre('Aire du carré') +
          ligne('côté&nbsp;: <b>c = ' + c + '</b> unités') +
          ligne('A = c × c = c<sup>2</sup>') +
          resultat('A = ' + c + ' × ' + c + ' = ' + fr(A) + ' unités²');
      } else if (shape === 'rectangle') {
        var d = rectDims();
        html = titre('Aire du rectangle') +
          ligne('longueur <b>L = ' + fr(d.L) + '</b> · largeur <b>ℓ = ' + fr(d.l) + '</b>') +
          ligne('A = L × ℓ') +
          resultat('A = ' + fr(d.L) + ' × ' + fr(d.l) + ' = ' + fr(A) + ' unités²');
      } else if (shape === 'triangle') {
        var m = triMetrics();
        html = titre('Aire du triangle') +
          ligne('base <b>b = ' + fr(m.base) + '</b> · hauteur <b>h = ' + fr(m.h) + '</b>') +
          ligne('A = (b × h) ÷ 2') +
          resultat('A = (' + fr(m.base) + ' × ' + fr(m.h) + ') ÷ 2 = ' + fr(A) + ' unités²');
      } else {
        var r = fr(diskR());
        html = titre('Aire du disque') +
          ligne('rayon&nbsp;: <b>r = ' + r + '</b> unités') +
          ligne('A = π × r × r = π × r<sup>2</sup>') +
          resultat('A = π × ' + r + '<sup>2</sup> ≈ ' + fr(A) + ' unités²');
      }
      panel.innerHTML = html;
    }
    function titre(t) { return '<div class="props-name">' + t + '</div>'; }
    function ligne(t) { return '<div class="calc-line">' + t + '</div>'; }
    function resultat(t) { return '<div class="calc-result">' + t + '</div>'; }

    /* ==================================================================== */
    /* Sélecteur de forme + quadrillage                                      */
    /* ==================================================================== */
    function setShape(name) {
      shape = name;
      Object.keys(refs).forEach(function (id) {
        if (NOMS[id]) refs[id].classList.toggle('active', id === name);
      });
      applyVisibility();
      board.update();
      render();
    }

    var refs = mv.addControls([
      { type: 'button', id: 'carre', label: 'Carré', onClick: function () { setShape('carre'); } },
      { type: 'button', id: 'rectangle', label: 'Rectangle', onClick: function () { setShape('rectangle'); } },
      { type: 'button', id: 'triangle', label: 'Triangle', onClick: function () { setShape('triangle'); } },
      { type: 'button', id: 'disque', label: 'Disque', onClick: function () { setShape('disque'); } },
      { type: 'checkbox', id: 'grille', label: 'Afficher le quadrillage', checked: true,
        onChange: function (on) { grille.setAttribute({ visible: on }); } }
    ]);

    // La liste (aire + valeurs) suit chaque déplacement de point. Léger : on
    // réécrit du HTML simple, pas de MathJax.
    board.on('update', render);

    setShape('carre');
  }
});
