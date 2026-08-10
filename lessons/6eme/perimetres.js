/*
 * Les périmètres (6ème) — carré, rectangle, triangles, cercle.
 *
 * L'idée directrice : un périmètre n'est pas une formule, c'est une LONGUEUR.
 * C'est la ficelle qu'il faudrait pour faire le tour de la figure. Tant que
 * l'élève ne l'a pas vue tendue et posée sur une règle, « 4 × c » reste une
 * incantation — et c'est exactement là que naît la confusion avec l'aire.
 *
 * D'où le dispositif : la figure en haut, une RÈGLE GRADUÉE en bas, et un
 * bouton qui DÉROULE le tour de la figure sur cette règle, côté par côté. Le
 * trait épais avance sur la figure en même temps que le ruban s'allonge sur la
 * règle : les deux longueurs sont la même, on la lit simplement.
 *
 * La couleur code l'ÉGALITÉ des côtés, et rien d'autre : quatre côtés bleus
 * pour le carré (donc 4 × c), deux bleus et deux verts pour le rectangle (donc
 * 2 × (L + ℓ)), deux bleus et une base verte pour l'isocèle. La formule se lit
 * sur le ruban avant d'être écrite.
 *
 * Le cercle est le cas intéressant. On ne le déroule pas d'un bloc : on le
 * déroule en QUATRE morceaux, trois diamètres puis un petit reste. On voit
 * alors ce que π veut dire — le tour fait un peu plus de trois diamètres, et
 * ce « un peu plus » vaut 0,14 diamètre. Le π ≈ 3,14 cesse d'être un nombre
 * tombé du ciel.
 *
 * ---------------------------------------------------------------------------
 * Rappels techniques (mêmes pièges JSXGraph que la leçon « aires ») :
 *  - les fonctions de mesure sont définies APRÈS les points, mais ne sont
 *    appelées qu'à la mise à jour, donc jamais avant que les points existent ;
 *  - toute forme dont la géométrie change est une `curve` pilotée par
 *    updateDataArray (jamais board.create('curve', [fx, fy]), qui donnerait une
 *    courbe paramétrique) ;
 *  - les couleurs des côtés ne changent qu'au changement de forme : on les pose
 *    avec setAttribute depuis setShape(), et surtout pas depuis updateDataArray
 *    (qui rejouerait une mise à jour du tableau à chaque image).
 */
MathsView.register({
  id: 'perimetres',
  title: 'Les périmètres',
  level: '6eme',
  category: 'geometrie',
  subcategory: 'Grandeurs et mesures',
  exercices: ['perimetres'],
  theme: 'Grandeurs — périmètre des figures usuelles',
  description:
    'Le <strong>périmètre</strong> d\'une figure, c\'est la <strong>longueur de son ' +
    'tour</strong> : la ficelle qu\'il faudrait pour en faire le tour complet. ' +
    'C\'est une <strong>longueur</strong>, elle se mesure en cm, en m… — jamais en cm².' +
    '<br><strong>Choisis une forme</strong>, <strong>déplace ses points bleus</strong>, ' +
    'puis clique sur <strong>▶ Dérouler le tour</strong> : le contour se pose côté ' +
    'par côté sur la règle du bas, et il n\'y a plus qu\'à lire la longueur.' +
    '<br>Regarde les <strong>couleurs</strong> : deux côtés de la même couleur ont la ' +
    '<strong>même longueur</strong>. C\'est de là que viennent les multiplications ' +
    'des formules.',
  notes:
    '<p>Le périmètre est une <strong>longueur</strong>, l\'aire est une ' +
    '<strong>surface</strong> : ce sont deux grandeurs différentes, qui ne se ' +
    'mesurent pas dans les mêmes unités. Deux figures peuvent avoir le même ' +
    'périmètre et des aires très différentes.</p>' +
    '<ul>' +
    '<li><strong>Carré</strong> de côté \\( c \\) : les 4 côtés sont égaux, donc ' +
    '\\( \\mathcal{P} = c + c + c + c = 4 \\times c \\).</li>' +
    '<li><strong>Rectangle</strong> de longueur \\( L \\) et largeur \\( \\ell \\) : ' +
    'deux longueurs et deux largeurs, donc ' +
    '\\( \\mathcal{P} = L + \\ell + L + \\ell = 2 \\times (L + \\ell) \\).</li>' +
    '<li><strong>Triangle quelconque</strong> de côtés \\( a \\), \\( b \\), \\( c \\) : ' +
    'aucun côté n\'est égal à un autre, il n\'y a rien à factoriser — ' +
    '\\( \\mathcal{P} = a + b + c \\).</li>' +
    '<li><strong>Triangle isocèle</strong> de base \\( b \\) et de côtés égaux ' +
    '\\( c \\) : \\( \\mathcal{P} = b + 2 \\times c \\).</li>' +
    '<li><strong>Triangle équilatéral</strong> de côté \\( c \\) : les 3 côtés sont ' +
    'égaux, donc \\( \\mathcal{P} = 3 \\times c \\).</li>' +
    '<li><strong>Cercle</strong> de rayon \\( r \\) et de diamètre \\( d = 2 \\times r \\) : ' +
    '\\( \\mathcal{P} = 2 \\times \\pi \\times r = \\pi \\times d \\).</li>' +
    '</ul>' +
    '<p><strong>D\'où sort \\( \\pi \\) ?</strong> Déroule le cercle : le tour se ' +
    'découpe en <strong>trois diamètres</strong> et un <strong>petit reste</strong>. ' +
    'Ce reste vaut environ \\( 0{,}14 \\) diamètre. Le tour d\'un cercle vaut donc ' +
    'toujours \\( 3{,}14\\ldots \\) fois son diamètre, quel que soit le cercle : ce ' +
    'nombre-là, c\'est \\( \\pi \\).</p>' +
    '<p>Le périmètre d\'un cercle porte aussi un nom à lui : sa ' +
    '<strong>circonférence</strong>.</p>',
  board: { boundingbox: [-0.75, 8.5, 15.25, -3.5], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Repères de mise en page                                              */
    /* ==================================================================== */
    var RY = -1.9;          // ligne de la règle graduée
    var RX0 = 0.3;          // abscisse de la graduation 0
    var RLEN = 14;          // longueur dessinée de la règle
    var BY = RY + 0.45;     // hauteur du ruban des côtés déroulés
    // Périmètre maximal admis. Il borne AUSSI les dimensions de départ des
    // figures, pas seulement les déplacements : un ruban plus long que la
    // règle sortirait du cadre.
    var PMAX = RLEN;

    // Zone dans laquelle les figures ont le droit de se promener.
    var FX0 = 0.6, FX1 = 10.6, FY0 = 0.7, FY1 = 7.4;

    // La couleur ne décore pas : elle dit quels côtés sont égaux.
    var C1 = '#2563eb', C2 = '#0d9488', C3 = '#f59e0b';
    var VIO = '#7c3aed', RESTE = '#dc2626', TRAIT = '#64748b';

    var shape = 'carre';    // 'carre'|'rectangle'|'quelconque'|'isocele'|'equilateral'|'cercle'
    var unroll = 0;         // longueur de contour déjà déroulée sur la règle
    var anim = null;        // animateur partagé (créé plus bas)

    var NOMS = {
      carre: 'Carré', rectangle: 'Rectangle', quelconque: 'Triangle quelconque',
      isocele: 'Triangle isocèle', equilateral: 'Triangle équilatéral', cercle: 'Cercle'
    };

    /* ---- Petits outils --------------------------------------------------- */
    function fr(x, dec) {       // nombre à la française : virgule décimale
      var d = dec == null ? 1 : dec;
      return x.toFixed(d).replace('.', ',');
    }
    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }
    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

    /* ==================================================================== */
    /* La règle graduée (statique) : une seule courbe, NaN en séparateur     */
    /* ==================================================================== */
    var GX = [], GY = [];
    GX.push(RX0, RX0 + RLEN, NaN); GY.push(RY, RY, NaN);          // le trait
    for (var u = 0; u <= RLEN; u++) {                              // les graduations
      GX.push(RX0 + u, RX0 + u, NaN); GY.push(RY, RY - 0.2, NaN);
    }
    board.create('curve', [GX, GY],
      { strokeColor: '#94a3b8', strokeWidth: 1.5, fixed: true, highlight: false });
    for (var g = 0; g <= RLEN; g++) {
      board.create('text', [RX0 + g, RY - 0.52, String(g)],
        { fontSize: 11, color: TRAIT, anchorX: 'middle', anchorY: 'middle',
          fixed: true, highlight: false });
    }
    board.create('text', [RX0, BY + 1.0,
      'Le tour de la figure, déroulé sur la règle :'],
      { fontSize: 13, color: TRAIT, cssStyle: 'font-style:italic',
        anchorX: 'left', anchorY: 'middle', fixed: true, highlight: false });

    /* ==================================================================== */
    /* Les points (créés AVANT tout ce qui les lit)                          */
    /* ==================================================================== */
    function pt(x, y, name, mobile) {
      return board.create('point', [x, y], {
        name: name || '', size: mobile === false ? 2 : 4,
        color: mobile === false ? '#94a3b8' : C1,
        fixed: mobile === false, withLabel: !!name,
        label: { offset: [8, 8], fontSize: 13 }, snapToGrid: false
      });
    }

    // Carré : coin bas-gauche (translation) + coin haut-droit (taille).
    var sqSide = 3;
    var sqA = pt(1.2, 1.2, 'A'), sqC = pt(1.2 + sqSide, 1.2 + sqSide, '');
    // Rectangle : coin bas-gauche (translation) + coin haut-droit (taille).
    var reL = 4, reW = 2.5;
    var reA = pt(1.2, 1.2, 'A'), reC = pt(1.2 + reL, 1.2 + reW, 'C');
    // Triangle quelconque : trois sommets libres.
    var quB = pt(1.2, 1.2, 'B'), quC = pt(5.7, 1.2, 'C'), quA = pt(2.6, 5.0, 'A');
    // Triangle isocèle : base symétrique autour d'un axe, sommet sur l'axe.
    var isoCx = 4, isoY = 1.2, isoHalf = 1.8, isoH = 4.2;
    var isB = pt(isoCx - isoHalf, isoY, 'B'), isC = pt(isoCx + isoHalf, isoY, 'C');
    var isA = pt(isoCx, isoY + isoH, 'A');
    // Triangle équilatéral : seule la demi-base est réglable, le sommet suit.
    var eqCx = 4, eqY = 1.2, eqSide = 4;
    var eqB = pt(eqCx - eqSide / 2, eqY, 'B'), eqC = pt(eqCx + eqSide / 2, eqY, 'C');
    var eqA = pt(eqCx, eqY + eqSide * Math.sqrt(3) / 2, 'A', false);
    // Cercle : centre (translation) + poignée de rayon.
    var ceRad = 2.1;
    var ceO = pt(4.2, 4.0, 'O'), ceR = pt(4.2 + ceRad, 4.0, '');

    /* ==================================================================== */
    /* Description de la figure courante : sommets, côtés, couleurs          */
    /* ==================================================================== */
    // Une couleur par côté. Deux côtés de même couleur = deux côtés égaux.
    var COLS = {
      carre:       [C1, C1, C1, C1],
      rectangle:   [C1, C2, C1, C2],   // bas, droite, haut, gauche
      quelconque:  [C1, C2, C3],
      isocele:     [C2, C1, C1],       // base, puis les deux côtés égaux
      equilateral: [C1, C1, C1]
    };

    function verts() {
      if (shape === 'carre') {
        var ax = sqA.X(), ay = sqA.Y(), s = sqSide;
        return [[ax, ay], [ax + s, ay], [ax + s, ay + s], [ax, ay + s]];
      }
      if (shape === 'rectangle') {
        var x1 = Math.min(reA.X(), reC.X()), x2 = Math.max(reA.X(), reC.X());
        var y1 = Math.min(reA.Y(), reC.Y()), y2 = Math.max(reA.Y(), reC.Y());
        return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
      }
      if (shape === 'quelconque') {
        return [[quB.X(), quB.Y()], [quC.X(), quC.Y()], [quA.X(), quA.Y()]];
      }
      if (shape === 'isocele') {
        return [[isB.X(), isB.Y()], [isC.X(), isC.Y()], [isA.X(), isA.Y()]];
      }
      return [[eqB.X(), eqB.Y()], [eqC.X(), eqC.Y()], [eqA.X(), eqA.Y()]];
    }

    // Le cercle n'est pas déroulé d'un bloc : trois diamètres, puis le reste.
    // C'est toute la démonstration de π, et elle tient dans ce découpage.
    function info() {
      if (shape === 'cercle') {
        var r = dist(ceO, ceR), d = 2 * r, P = 2 * Math.PI * r;
        return {
          circle: true, cx: ceO.X(), cy: ceO.Y(), r: r, d: d, P: P,
          sides: [
            { len: d, color: VIO, nom: 'd' },
            { len: d, color: VIO, nom: 'd' },
            { len: d, color: VIO, nom: 'd' },
            { len: Math.max(0, P - 3 * d), color: RESTE, nom: '0,14 × d' }
          ]
        };
      }
      var pts = verts(), cols = COLS[shape], sides = [], P = 0;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], q = pts[(i + 1) % pts.length];
        var len = Math.hypot(q[0] - p[0], q[1] - p[1]);
        sides.push({ len: len, color: cols[i], from: p, to: q, nom: '' });
        P += len;
      }
      return { circle: false, pts: pts, sides: sides, P: P };
    }

    function debut(inf, i) {   // abscisse curviligne du début du côté i
      var c = 0;
      for (var k = 0; k < i; k++) c += inf.sides[k].len;
      return c;
    }
    function perim() { return info().P; }

    /* ==================================================================== */
    /* Les corps des formes : des courbes pilotées par updateDataArray       */
    /* ==================================================================== */
    function bodyCurve(fill, stroke) {
      return board.create('curve', [[], []], {
        strokeColor: stroke, strokeWidth: 1.5, fillColor: fill, fillOpacity: 0.2,
        fixed: true, highlight: false
      });
    }
    function polyBody(fill, stroke, wanted) {
      var c = bodyCurve(fill, stroke);
      c.updateDataArray = function () {
        if (shape !== wanted) { this.dataX = []; this.dataY = []; return; }
        var pts = verts(), X = [], Y = [];
        pts.forEach(function (p) { X.push(p[0]); Y.push(p[1]); });
        X.push(pts[0][0]); Y.push(pts[0][1]);
        this.dataX = X; this.dataY = Y;
      };
      return c;
    }

    var bCarre = polyBody('#bfdbfe', '#94a3b8', 'carre');
    var bRect  = polyBody('#bfdbfe', '#94a3b8', 'rectangle');
    var bQuel  = polyBody('#fde68a', '#94a3b8', 'quelconque');
    var bIso   = polyBody('#fde68a', '#94a3b8', 'isocele');
    var bEqui  = polyBody('#fde68a', '#94a3b8', 'equilateral');

    var bCercle = bodyCurve('#ddd6fe', '#94a3b8');
    bCercle.updateDataArray = function () {
      if (shape !== 'cercle') { this.dataX = []; this.dataY = []; return; }
      var inf = info(), N = 72, X = [], Y = [];
      for (var k = 0; k <= N; k++) {
        var a = 2 * Math.PI * k / N;
        X.push(inf.cx + inf.r * Math.cos(a)); Y.push(inf.cy + inf.r * Math.sin(a));
      }
      this.dataX = X; this.dataY = Y;
    };

    // Le diamètre du cercle, tracé en pointillés : c'est l'étalon de la mesure.
    var diam = board.create('curve', [[], []],
      { strokeColor: VIO, strokeWidth: 2, dash: 2, fixed: true, highlight: false });
    diam.updateDataArray = function () {
      if (shape !== 'cercle') { this.dataX = []; this.dataY = []; return; }
      var inf = info();
      this.dataX = [inf.cx - inf.r, inf.cx + inf.r];
      this.dataY = [inf.cy, inf.cy];
    };
    // Les coordonnées sont évaluées même quand l'élément est masqué : sans ce
    // garde-fou, elles vaudraient NaN dès qu'on quitte le cercle.
    var lblDiam = board.create('text', [
      function () { return shape === 'cercle' ? info().cx : 0; },
      function () { return shape === 'cercle' ? info().cy + 0.35 : 0; },
      function () { return shape === 'cercle' ? 'd = ' + fr(info().d) : ''; }
    ], { fontSize: 14, color: VIO, cssStyle: 'font-weight:600',
         anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false });

    /* ==================================================================== */
    /* Le déroulage : même longueur tracée sur la figure et sur la règle     */
    /* ==================================================================== */
    var NMAX = 4;                       // au plus 4 côtés (carré, rectangle, cercle)
    var traceFig = [], traceBar = [], lblBar = [], lblFig = [];

    // Portion visible du côté i, en longueur : ce qui a déjà été déroulé.
    function portion(inf, i) {
      var s = inf.sides[i];
      if (!s) return 0;
      return clamp(unroll - debut(inf, i), 0, s.len);
    }

    function makeTrace(i) {
      // Sur la figure : le contour parcouru, épais, à la couleur du côté.
      var f = board.create('curve', [[], []],
        { strokeColor: C1, strokeWidth: 6, strokeOpacity: 0.95, lineCap: 'round',
          fixed: true, highlight: false });
      f.updateDataArray = function () {
        var inf = info(), s = inf.sides[i], vis = portion(inf, i);
        if (!s || vis <= 1e-9) { this.dataX = []; this.dataY = []; return; }
        if (inf.circle) {
          var a0 = debut(inf, i) / inf.r, a1 = (debut(inf, i) + vis) / inf.r;
          var N = Math.max(2, Math.ceil((a1 - a0) / 0.06)), X = [], Y = [];
          for (var k = 0; k <= N; k++) {
            var a = a0 + (a1 - a0) * k / N;
            X.push(inf.cx + inf.r * Math.cos(a)); Y.push(inf.cy + inf.r * Math.sin(a));
          }
          this.dataX = X; this.dataY = Y;
        } else {
          var t = vis / s.len;
          this.dataX = [s.from[0], s.from[0] + (s.to[0] - s.from[0]) * t];
          this.dataY = [s.from[1], s.from[1] + (s.to[1] - s.from[1]) * t];
        }
      };

      // Sur la règle : le même côté, posé bout à bout avec les précédents.
      var b = board.create('curve', [[], []],
        { strokeColor: C1, strokeWidth: 10, lineCap: 'butt',
          fixed: true, highlight: false });
      b.updateDataArray = function () {
        var inf = info(), vis = portion(inf, i);
        if (vis <= 1e-9) { this.dataX = []; this.dataY = []; return; }
        var c0 = RX0 + debut(inf, i);
        this.dataX = [c0, c0 + vis]; this.dataY = [BY, BY];
      };

      // L'étiquette n'apparaît qu'une fois le côté entièrement posé.
      var t = board.create('text', [
        function () { var inf = info(); return RX0 + debut(inf, i) + (inf.sides[i] ? inf.sides[i].len / 2 : 0); },
        BY + 0.42,
        function () {
          var inf = info(), s = inf.sides[i];
          if (!s || portion(inf, i) < s.len - 1e-6 || s.len < 1e-6) return '';
          return inf.circle ? s.nom : fr(s.len);
        }
      ], { fontSize: 12, color: '#1e293b', cssStyle: 'font-weight:700',
           anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false });

      traceFig.push(f); traceBar.push(b); lblBar.push(t);
    }
    for (var i = 0; i < NMAX; i++) makeTrace(i);

    // Longueur de chaque côté, écrite le long de la figure (polygones seulement).
    function makeFigLabel(i) {
      function coord(k) {
        return function () {
          var inf = info(), s = inf.sides[i];
          if (inf.circle || !s) return 0;
          var mx = (s.from[0] + s.to[0]) / 2, my = (s.from[1] + s.to[1]) / 2;
          var cx = 0, cy = 0;
          inf.pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
          cx /= inf.pts.length; cy /= inf.pts.length;
          // On pousse l'étiquette vers l'extérieur, à l'opposé du centre.
          var dx = mx - cx, dy = my - cy, n = Math.hypot(dx, dy) || 1;
          return k === 0 ? mx + dx / n * 0.5 : my + dy / n * 0.5;
        };
      }
      var t = board.create('text', [coord(0), coord(1), function () {
        var inf = info(), s = inf.sides[i];
        return (inf.circle || !s) ? '' : fr(s.len);
      }], { fontSize: 13, color: '#1e293b', cssStyle: 'font-weight:600',
            anchorX: 'middle', anchorY: 'middle', fixed: true, highlight: false });
      lblFig.push(t);
    }
    for (var j = 0; j < NMAX; j++) makeFigLabel(j);

    // Petits traits de séparation entre deux côtés posés : on compte à l'œil.
    var separateurs = board.create('curve', [[], []],
      { strokeColor: '#ffffff', strokeWidth: 2, fixed: true, highlight: false });
    separateurs.updateDataArray = function () {
      var inf = info(), X = [], Y = [], c = 0;
      for (var k = 0; k < inf.sides.length - 1; k++) {
        c += inf.sides[k].len;
        if (unroll >= c - 1e-9 && c > 1e-9) {
          X.push(RX0 + c, RX0 + c, NaN); Y.push(BY - 0.16, BY + 0.16, NaN);
        }
      }
      this.dataX = X; this.dataY = Y;
    };

    // Titre au-dessus de la figure : nom de la forme + périmètre.
    board.create('text', [-0.4, 8.15, function () {
      var inf = info();
      return NOMS[shape] + ' — périmètre ' + (inf.circle ? '≈ ' : '= ') +
             fr(inf.P) + ' unités';
    }], { fontSize: 18, cssStyle: 'font-weight:700', color: '#1e293b',
          anchorX: 'left', fixed: true, highlight: false });

    /* ==================================================================== */
    /* Affichage sélectif                                                    */
    /* ==================================================================== */
    var groups = {
      carre:       [bCarre, sqA, sqC],
      rectangle:   [bRect, reA, reC],
      quelconque:  [bQuel, quA, quB, quC],
      isocele:     [bIso, isA, isB, isC],
      equilateral: [bEqui, eqA, eqB, eqC],
      cercle:      [bCercle, ceO, ceR, diam, lblDiam]
    };

    function applyVisibility() {
      Object.keys(groups).forEach(function (name) {
        var on = (name === shape);
        groups[name].forEach(function (el) { el.setAttribute({ visible: on }); });
      });
      // Couleurs et étiquettes des côtés : elles ne bougent qu'ici, jamais
      // pendant une mise à jour du tableau.
      var inf = info();
      for (var k = 0; k < NMAX; k++) {
        var s = inf.sides[k];
        var col = s ? s.color : C1;
        traceFig[k].setAttribute({ strokeColor: col, visible: !!s });
        traceBar[k].setAttribute({ strokeColor: col, visible: !!s });
        lblBar[k].setAttribute({ visible: !!s });
        lblFig[k].setAttribute({ visible: !!s && !inf.circle });
      }
    }

    /* ==================================================================== */
    /* Contraintes de déplacement                                            */
    /*                                                                       */
    /* Deux règles : la figure reste dans sa zone, et le périmètre ne dépasse */
    /* jamais la longueur de la règle (sans quoi le ruban sortirait du cadre).*/
    /* ==================================================================== */
    function keepIn(P, xmin, xmax, ymin, ymax) {
      var x = clamp(P.X(), xmin, xmax), y = clamp(P.Y(), ymin, ymax);
      if (x !== P.X() || y !== P.Y()) P.setPosition(JXG.COORDS_BY_USER, [x, y]);
    }
    // Après toute manipulation : le ruban montre de nouveau le tour complet.
    function afterDrag() {
      if (anim) anim.cancel();
      unroll = perim();
      board.update();
      render();
    }

    /* -- Carré : le coin suit toujours la diagonale, le côté reste un côté - */
    function syncCarre() {
      sqC.setPosition(JXG.COORDS_BY_USER, [sqA.X() + sqSide, sqA.Y() + sqSide]);
    }
    sqC.on('drag', function () {
      sqSide = clamp(Math.max(sqC.X() - sqA.X(), sqC.Y() - sqA.Y()), 0.8, 3.5);
      syncCarre(); afterDrag();
    });
    sqA.on('drag', function () {
      keepIn(sqA, FX0, FX1 - sqSide, FY0, FY1 - sqSide);
      syncCarre(); afterDrag();
    });

    /* -- Rectangle : L et ℓ bornés, et leur somme bornée aussi -------------
          Les dimensions sont MÉMORISÉES, pas relues sur les points : déplacer
          le coin A ne doit que translater le rectangle. Les redéduire des
          positions après coup reviendrait à l'étirer à chaque translation. */
    function syncRect() {
      reC.setPosition(JXG.COORDS_BY_USER, [reA.X() + reL, reA.Y() + reW]);
    }
    reC.on('drag', function () {
      var L = clamp(reC.X() - reA.X(), 0.8, 5);
      var l = clamp(reC.Y() - reA.Y(), 0.8, 3.5);
      if (L + l > PMAX / 2) {            // 2 × (L + ℓ) ⩽ PMAX
        l = Math.max(0.8, PMAX / 2 - L);
        L = Math.min(L, PMAX / 2 - l);
      }
      reL = L; reW = l;
      syncRect(); afterDrag();
    });
    reA.on('drag', function () {
      keepIn(reA, FX0, FX1 - reL, FY0, FY1 - reW);
      syncRect(); afterDrag();
    });

    /* -- Triangle quelconque : sommets libres, mais on annule un déplacement
          qui ferait déborder le ruban ------------------------------------- */
    var quLast = {};
    function quRemember() {
      quLast.A = [quA.X(), quA.Y()];
      quLast.B = [quB.X(), quB.Y()];
      quLast.C = [quC.X(), quC.Y()];
    }
    quRemember();
    // On mesure CE triangle, et pas perim() — qui rend le périmètre de la forme
    // affichée. Les deux coïncident tant que le triangle est à l'écran, mais
    // faire dépendre une contrainte de l'onglet courant est un piège à retardement.
    function quPerim() {
      return dist(quA, quB) + dist(quB, quC) + dist(quC, quA);
    }
    function quDrag(P, key) {
      return function () {
        keepIn(P, FX0, FX1, FY0, FY1);
        if (quPerim() > PMAX) P.setPosition(JXG.COORDS_BY_USER, quLast[key]);
        else quRemember();
        afterDrag();
      };
    }
    quA.on('drag', quDrag(quA, 'A'));
    quB.on('drag', quDrag(quB, 'B'));
    quC.on('drag', quDrag(quC, 'C'));

    /* -- Triangle isocèle : base symétrique, sommet sur l'axe -------------- */
    function isoPerim(half, h) {
      return 2 * half + 2 * Math.hypot(half, h);
    }
    function syncIso() {
      isB.setPosition(JXG.COORDS_BY_USER, [isoCx - isoHalf, isoY]);
      isC.setPosition(JXG.COORDS_BY_USER, [isoCx + isoHalf, isoY]);
      isA.setPosition(JXG.COORDS_BY_USER, [isoCx, isoY + isoH]);
    }
    function setIso(half, h) {
      half = clamp(half, 0.5, 3.5);
      h = clamp(h, 0.8, FY1 - isoY);
      if (isoPerim(half, h) <= PMAX) { isoHalf = half; isoH = h; }
      syncIso(); afterDrag();
    }
    isB.on('drag', function () { setIso(isoCx - isB.X(), isoH); });
    isC.on('drag', function () { setIso(isC.X() - isoCx, isoH); });
    isA.on('drag', function () { setIso(isoHalf, isA.Y() - isoY); });

    /* -- Triangle équilatéral : une seule dimension, le côté --------------- */
    function syncEqui() {
      eqB.setPosition(JXG.COORDS_BY_USER, [eqCx - eqSide / 2, eqY]);
      eqC.setPosition(JXG.COORDS_BY_USER, [eqCx + eqSide / 2, eqY]);
      eqA.setPosition(JXG.COORDS_BY_USER, [eqCx, eqY + eqSide * Math.sqrt(3) / 2]);
    }
    function setEqui(side) {
      eqSide = clamp(side, 0.8, Math.min(4.7, PMAX / 3));
      syncEqui(); afterDrag();
    }
    eqB.on('drag', function () { setEqui(2 * (eqCx - eqB.X())); });
    eqC.on('drag', function () { setEqui(2 * (eqC.X() - eqCx)); });

    /* -- Cercle : rayon borné par la longueur de la règle ------------------
          Même précaution que pour le rectangle : le rayon est mémorisé, sans
          quoi déplacer le centre le ferait grandir. La poignée garde sa
          direction, seule sa distance au centre est imposée. */
    function syncCercle() {
      var dx = ceR.X() - ceO.X(), dy = ceR.Y() - ceO.Y(), n = Math.hypot(dx, dy);
      if (n < 1e-9) { dx = 1; dy = 0; n = 1; }
      ceR.setPosition(JXG.COORDS_BY_USER,
        [ceO.X() + dx / n * ceRad, ceO.Y() + dy / n * ceRad]);
    }
    ceR.on('drag', function () {
      ceRad = clamp(dist(ceO, ceR), 0.6, PMAX / (2 * Math.PI));
      syncCercle(); afterDrag();
    });
    ceO.on('drag', function () {
      keepIn(ceO, FX0 + ceRad, FX1 - ceRad, FY0 + ceRad, FY1 - ceRad);
      syncCercle(); afterDrag();
    });

    /* ==================================================================== */
    /* Panneau : formule + calcul (HTML simple, pas de MathJax en direct)    */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function titre(t) { return '<div class="props-name">' + t + '</div>'; }
    function ligne(t) { return '<div class="calc-line">' + t + '</div>'; }
    function alerte(t) { return '<div class="calc-line calc-warn">' + t + '</div>'; }
    function resultat(t) { return '<div class="calc-result">' + t + '</div>'; }

    function render() {
      var inf = info(), P = inf.P, html;

      if (shape === 'carre') {
        var c = fr(sqSide);
        html = titre('Périmètre du carré') +
          ligne('côté&nbsp;: <b>c = ' + c + '</b> unités — les 4 côtés sont égaux') +
          ligne('P = c + c + c + c = 4 × c') +
          resultat('P = 4 × ' + c + ' = ' + fr(P) + ' unités');

      } else if (shape === 'rectangle') {
        var L = inf.sides[0].len, l = inf.sides[1].len;
        html = titre('Périmètre du rectangle') +
          ligne('longueur <b>L = ' + fr(L) + '</b> · largeur <b>ℓ = ' + fr(l) + '</b>') +
          ligne('P = L + ℓ + L + ℓ = 2 × (L + ℓ)') +
          resultat('P = 2 × (' + fr(L) + ' + ' + fr(l) + ') = ' + fr(P) + ' unités');

      } else if (shape === 'quelconque') {
        var a = inf.sides[0].len, b = inf.sides[1].len, cc = inf.sides[2].len;
        html = titre('Périmètre du triangle') +
          ligne('<b>a = ' + fr(a) + '</b> · <b>b = ' + fr(b) + '</b> · <b>c = ' + fr(cc) + '</b>') +
          ligne('Aucun côté n\'est égal à un autre : on additionne, c\'est tout.') +
          ligne('P = a + b + c') +
          resultat('P = ' + fr(a) + ' + ' + fr(b) + ' + ' + fr(cc) + ' = ' + fr(P) + ' unités');

      } else if (shape === 'isocele') {
        var base = inf.sides[0].len, cote = inf.sides[1].len;
        html = titre('Périmètre du triangle isocèle') +
          ligne('base <b>b = ' + fr(base) + '</b> · les deux côtés égaux <b>c = ' + fr(cote) + '</b>') +
          ligne('P = b + c + c = b + 2 × c') +
          resultat('P = ' + fr(base) + ' + 2 × ' + fr(cote) + ' = ' + fr(P) + ' unités');

      } else if (shape === 'equilateral') {
        var e = fr(eqSide);
        html = titre('Périmètre du triangle équilatéral') +
          ligne('côté&nbsp;: <b>c = ' + e + '</b> unités — les 3 côtés sont égaux') +
          ligne('P = c + c + c = 3 × c') +
          resultat('P = 3 × ' + e + ' = ' + fr(P) + ' unités');

      } else {
        var r = fr(inf.r), d = fr(inf.d);
        html = titre('Périmètre du cercle') +
          ligne('rayon <b>r = ' + r + '</b> · diamètre <b>d = 2 × r = ' + d + '</b>') +
          ligne('P = 2 × π × r = π × d') +
          resultat('P = 3,14 × ' + d + ' ≈ ' + fr(P) + ' unités') +
          alerte('Sur la règle : trois diamètres, plus un petit reste de ' +
                 fr(inf.sides[3].len, 2) + ' — soit 0,14 diamètre. ' +
                 'Le tour vaut 3,14… fois le diamètre : c\'est π.');
      }
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    function setShape(name) {
      shape = name;
      if (anim) anim.cancel();
      Object.keys(NOMS).forEach(function (k) {
        if (refs[k]) refs[k].classList.toggle('active', k === name);
      });
      applyVisibility();
      unroll = perim();
      board.update();
      render();
    }

    // Une étape d'animation par côté : en « pas à pas », on pose le contour
    // côté par côté — et pour le cercle, diamètre par diamètre.
    function derouler() {
      var inf = info(), steps = [], c0 = 0;
      inf.sides.forEach(function (s) {
        var depart = c0, len = s.len;
        c0 += len;
        if (len <= 1e-9) return;
        steps.push({
          dur: Math.max(350, len * 260),
          step: function (p) { unroll = depart + len * p; },
          after: function () { unroll = depart + len; render(); }
        });
      });
      unroll = 0;
      board.update();
      render();
      anim.runSteps(steps, function () { unroll = 0; board.update(); render(); });
    }

    var refs = mv.addControls([
      { type: 'button', id: 'carre', label: 'Carré', onClick: function () { setShape('carre'); } },
      { type: 'button', id: 'rectangle', label: 'Rectangle', onClick: function () { setShape('rectangle'); } },
      { type: 'button', id: 'quelconque', label: 'Triangle quelconque', onClick: function () { setShape('quelconque'); } },
      { type: 'button', id: 'isocele', label: 'Triangle isocèle', onClick: function () { setShape('isocele'); } },
      { type: 'button', id: 'equilateral', label: 'Triangle équilatéral', onClick: function () { setShape('equilateral'); } },
      { type: 'button', id: 'cercle', label: 'Cercle', onClick: function () { setShape('cercle'); } },
      { type: 'button', id: 'derouler', label: '▶ Dérouler le tour', onClick: function () { derouler(); } }
    ]);

    anim = mv.createAnimator();

    // Le panneau suit chaque déplacement de point : on réécrit du HTML simple.
    board.on('update', render);

    setShape('carre');
  }
});
