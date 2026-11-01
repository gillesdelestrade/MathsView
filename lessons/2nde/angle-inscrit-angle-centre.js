/*
 * Angle inscrit et angle au centre (2nde) — l'angle au centre vaut le double.
 *
 * A et B sont deux points du cercle de centre O, M un troisième point du
 * cercle. L'angle AMB est un angle INSCRIT, l'angle AOB un angle AU CENTRE,
 * et tous deux « interceptent » le même arc AB (celui qui ne contient pas M,
 * en rouge). Théorème : AOB = 2 × AMB.
 *
 * La figure le MONTRE avant de le démontrer, avec les deux mesures écrites
 * en permanence (dans le bandeau et près de chaque angle) :
 *   – M glisse sur le cercle (« M parcourt son arc ») : l'angle inscrit ne
 *     change pas, l'angle au centre non plus — tant que l'arc est le même ;
 *   – B glisse (« L'arc s'ouvre ») : les deux angles changent ensemble, et
 *     l'angle au centre reste exactement le double. Passé 90° pour AMB,
 *     l'angle au centre dépasse 180° : il devient rentrant, et c'est encore
 *     le double.
 * Puis le DÉMONTRE (« Pourquoi ? »), avec le diamètre [MD] :
 *   OMA isocèle en O → ses angles en M et en A valent α → AOD = 2α
 *   OMB isocèle en O → ses angles en M et en B valent β → BOD = 2β
 *   AOB = 2α + 2β = 2(α + β) = 2 × AMB   (ou 2β − 2α si O est hors de l'angle)
 *
 * Les points A, B, M s'accrochent aux degrés entiers quand on les déplace :
 * les mesures affichées sont alors des nombres lisibles (37° et 74°, jamais
 * 36,97° et 73,94°), et l'angle inscrit vaut au pire un demi-degré près.
 * Toutes les marques d'angle sont des courbes recalculées (updateDataArray) :
 * l'angle au centre peut dépasser 180°, ce qu'une marque JSXGraph ne sait pas
 * suivre.
 */
MathsView.register({
  id: 'angle-inscrit-angle-centre',
  title: 'Angle inscrit et angle au centre',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Angles',
  exercices: ['angle-inscrit'],
  theme: 'Cercle — l\'angle au centre vaut le double de l\'angle inscrit',
  description:
    'A, B et M sont trois points du cercle de centre O. L\'angle <strong>AMB</strong>, dont le sommet est ' +
    '<em>sur</em> le cercle, est un <strong>angle inscrit</strong> ; l\'angle <strong>AOB</strong>, dont le sommet ' +
    'est le centre, est un <strong>angle au centre</strong>. Tous deux s\'ouvrent sur le même <strong>arc AB</strong> ' +
    '(en rouge) : alors \\( \\widehat{AOB} = 2 \\times \\widehat{AMB} \\). ' +
    '<br><strong>Déplace M, A ou B</strong> : les deux mesures s\'écrivent en permanence. ' +
    '<strong>« M parcourt son arc »</strong> montre que l\'angle inscrit ne bouge pas tant que l\'arc est le même ; ' +
    '<strong>« L\'arc s\'ouvre »</strong> fait grandir les deux angles ensemble, le second toujours double du premier ' +
    '— même quand il dépasse 180°. <strong>« Pourquoi ? »</strong> le démontre avec un diamètre et deux triangles isocèles.',
  notes:
    '<ul>' +
    '<li><strong>Vocabulaire.</strong> Un angle <em>inscrit</em> a son sommet sur le cercle et ses côtés coupent le cercle ' +
    'en A et B. L\'angle <em>au centre</em> associé a pour sommet O et pour côtés [OA) et [OB). Ils <em>interceptent</em> ' +
    'l\'arc AB qui n\'est pas du côté de M.</li>' +
    '<li><strong>Théorème.</strong> L\'angle au centre vaut le double de l\'angle inscrit qui intercepte le même arc : ' +
    '\\( \\widehat{AOB} = 2\\,\\widehat{AMB} \\).</li>' +
    '<li><strong>Conséquence.</strong> Deux angles inscrits qui interceptent le même arc sont <strong>égaux</strong> : ' +
    'ils valent tous deux la moitié du même angle au centre. C\'est pour cela que M peut glisser sur son arc sans que ' +
    'l\'angle AMB change.</li>' +
    '<li><strong>Pourquoi ?</strong> On trace le diamètre [MD]. \\( OM = OA \\) : le triangle OMA est isocèle en O, ' +
    'ses angles en M et en A valent \\( \\alpha \\), et l\'angle \\( \\widehat{AOD} \\), qui prolonge l\'angle en O, vaut ' +
    '\\( 2\\alpha \\). De même \\( \\widehat{BOD} = 2\\beta \\). En ajoutant : \\( \\widehat{AOB} = 2\\alpha + 2\\beta = ' +
    '2(\\alpha + \\beta) = 2\\,\\widehat{AMB} \\). (Si O n\'est pas dans l\'angle AMB, on soustrait au lieu d\'ajouter.)</li>' +
    '<li><strong>Angle rentrant.</strong> Si M est sur le petit arc, l\'angle inscrit est obtus et l\'angle au centre ' +
    'dépasse 180° : c\'est le grand secteur, et il vaut toujours le double.</li>' +
    '<li><strong>Cas du diamètre.</strong> Si [AB] est un diamètre, l\'angle au centre est plat (180°) et l\'angle ' +
    'inscrit vaut 90° : on retrouve le triangle rectangle inscrit dans un demi-cercle.</li>' +
    '</ul>',
  board: { boundingbox: [-7.2, 6.2, 7.2, -4.7], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Angle inscrit et angle au centre',
    figures: [{
      legende: 'Même arc AB : l\'angle au centre AOB est le double de l\'angle inscrit AMB.',
      boundingbox: [-4.8, 4.6, 4.8, -3.8],
      largeur: 50, hauteur: 44,
      dessine: function (board) {
        var R = 3.2, d2r = Math.PI / 180;
        function P(deg) { return [R * Math.cos(deg * d2r), R * Math.sin(deg * d2r)]; }
        var O = [0, 0], A = P(210), B = P(330), M = P(100);
        board.create('circle', [O, R], { strokeColor: '#334155', strokeWidth: 1.2, fixed: true, highlight: false });
        // L'arc intercepté, en rouge épais.
        var X = [], Y = [], i;
        for (i = 0; i <= 24; i++) { var t = (210 + 120 * i / 24) * d2r; X.push(R * Math.cos(t)); Y.push(R * Math.sin(t)); }
        board.create('curve', [X, Y], { strokeColor: '#dc2626', strokeWidth: 3, fixed: true, highlight: false });
        board.create('segment', [M, A], { strokeColor: '#1d4ed8', strokeWidth: 1.6, fixed: true, highlight: false });
        board.create('segment', [M, B], { strokeColor: '#1d4ed8', strokeWidth: 1.6, fixed: true, highlight: false });
        board.create('segment', [O, A], { strokeColor: '#d97706', strokeWidth: 1.6, fixed: true, highlight: false });
        board.create('segment', [O, B], { strokeColor: '#d97706', strokeWidth: 1.6, fixed: true, highlight: false });
        function arc(V, P1, P2, r, col) {
          var a1 = Math.atan2(P1[1] - V[1], P1[0] - V[0]), a2 = Math.atan2(P2[1] - V[1], P2[0] - V[0]);
          var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          var X = [], Y = [], n = 16, i;
          for (i = 0; i <= n; i++) { X.push(V[0] + r * Math.cos(a1 + d * i / n)); Y.push(V[1] + r * Math.sin(a1 + d * i / n)); }
          board.create('curve', [X, Y], { strokeColor: col, strokeWidth: 1.6, fixed: true, highlight: false });
        }
        arc(M, A, B, 0.8, '#1d4ed8'); arc(O, A, B, 0.8, '#d97706');
        board.create('point', O, { name: '', size: 1.5, color: '#334155', fixed: true, highlight: false });
        [A, B, M].forEach(function (p, k) {
          board.create('point', p, { name: '', size: 1.8, color: k < 2 ? '#dc2626' : '#1d4ed8', fixed: true, highlight: false });
        });
        function nom(x, y, s, col) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(A[0] - 0.4, A[1] - 0.3, 'A', '#dc2626'); nom(B[0] + 0.4, B[1] - 0.3, 'B', '#dc2626');
        nom(M[0] - 0.3, M[1] + 0.45, 'M', '#1d4ed8'); nom(0.35, 0.3, 'O');
        nom(M[0] + 0.05, M[1] - 1.35, '60°', '#1d4ed8'); nom(0, -1.4, '120°', '#d97706');
      }
    }, {
      legende: 'M glisse sur son arc : l\'angle inscrit ne change pas.',
      boundingbox: [-4.8, 4.6, 4.8, -3.8],
      largeur: 50, hauteur: 44,
      dessine: function (board) {
        var R = 3.2, d2r = Math.PI / 180;
        function P(deg) { return [R * Math.cos(deg * d2r), R * Math.sin(deg * d2r)]; }
        var O = [0, 0], A = P(210), B = P(330), M1 = P(130), M2 = P(60), M3 = P(5);
        board.create('circle', [O, R], { strokeColor: '#334155', strokeWidth: 1.2, fixed: true, highlight: false });
        var X = [], Y = [], i;
        for (i = 0; i <= 24; i++) { var t = (210 + 120 * i / 24) * d2r; X.push(R * Math.cos(t)); Y.push(R * Math.sin(t)); }
        board.create('curve', [X, Y], { strokeColor: '#dc2626', strokeWidth: 3, fixed: true, highlight: false });
        function arc(V, P1, P2, r, col) {
          var a1 = Math.atan2(P1[1] - V[1], P1[0] - V[0]), a2 = Math.atan2(P2[1] - V[1], P2[0] - V[0]);
          var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          var X = [], Y = [], n = 16, i;
          for (i = 0; i <= n; i++) { X.push(V[0] + r * Math.cos(a1 + d * i / n)); Y.push(V[1] + r * Math.sin(a1 + d * i / n)); }
          board.create('curve', [X, Y], { strokeColor: col, strokeWidth: 1.6, fixed: true, highlight: false });
        }
        [[M1, '#1d4ed8'], [M2, '#7c3aed'], [M3, '#0d9488']].forEach(function (c) {
          board.create('segment', [c[0], A], { strokeColor: c[1], strokeWidth: 1.4, fixed: true, highlight: false });
          board.create('segment', [c[0], B], { strokeColor: c[1], strokeWidth: 1.4, fixed: true, highlight: false });
          arc(c[0], A, B, 0.7, c[1]);
          board.create('point', c[0], { name: '', size: 1.8, color: c[1], fixed: true, highlight: false });
        });
        board.create('point', O, { name: '', size: 1.5, color: '#334155', fixed: true, highlight: false });
        [A, B].forEach(function (p) {
          board.create('point', p, { name: '', size: 1.8, color: '#dc2626', fixed: true, highlight: false });
        });
        function nom(x, y, s, col) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(A[0] - 0.4, A[1] - 0.3, 'A', '#dc2626'); nom(B[0] + 0.4, B[1] - 0.3, 'B', '#dc2626');
        nom(M1[0] - 0.45, M1[1] + 0.4, 'M', '#1d4ed8'); nom(M2[0] + 0.1, M2[1] + 0.5, 'M\'', '#7c3aed'); nom(M3[0] + 0.55, M3[1] + 0.2, 'M\'\'', '#0d9488');
        nom(0, -2.45, '60° partout', '#334155');
      }
    }],
    points: [
      '<b>Angle inscrit :</b> sommet <b>sur</b> le cercle (AMB). <b>Angle au centre :</b> sommet en O (AOB). Tous deux interceptent l\'arc AB.',
      '<b>Théorème :</b> \\( \\widehat{AOB} = 2 \\times \\widehat{AMB} \\) — l\'angle au centre est le <b>double</b> de l\'angle inscrit.',
      '<b>Conséquence :</b> deux angles inscrits qui interceptent le <b>même arc</b> sont <b>égaux</b>.',
      '<b>Preuve :</b> diamètre [MD] ; OMA et OMB isocèles en O, donc \\( \\widehat{AOD} = 2\\alpha \\), \\( \\widehat{BOD} = 2\\beta \\), et \\( \\widehat{AOB} = 2(\\alpha + \\beta) \\).',
      'Si AMB est <b>obtus</b>, l\'angle au centre dépasse 180° (il est <b>rentrant</b>) : c\'est encore le double.',
      '[AB] diamètre : angle au centre 180°, angle inscrit <b>90°</b>.'
    ],
    exemples: [
      '\\( \\widehat{AMB} = 35^\\circ \\), donc \\( \\widehat{AOB} = 70^\\circ \\).',
      '\\( \\widehat{AOB} = 150^\\circ \\), donc \\( \\widehat{AMB} = 75^\\circ \\).',
      'N sur le même arc que M, \\( \\widehat{AMB} = 52^\\circ \\) : alors \\( \\widehat{ANB} = 52^\\circ \\) aussi.'
    ]
  },

  setup: function (board, mv) {
    var INK = '#334155', C_INS = '#1d4ed8', C_CEN = '#d97706', C_ARC = '#dc2626';
    var C_A = '#7c3aed', C_B = '#0d9488', C_TRACE = '#94a3b8', C_DIAM = '#64748b';
    var R = 4, EPS = 1e-9, D2R = Math.PI / 180;

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var mode = 'demo';          // 'demo' | 'parcours' | 'ouverture'
    var phase = 0;              // étape de la démonstration déjà révélée (0..4)
    var rayP = 0, alphaMark = 0, betaMark = 0, sumMark = 0;   // opacités (0..1)
    var ghosts = [];            // angles (radians) des positions de M gardées en trace
    var animEnCours = false;    // A, B, M bloqués pendant une animation

    /* ==================================================================== */
    /* Les points — tous sur le cercle, accrochés aux degrés entiers         */
    /* ==================================================================== */
    var O = board.create('point', [0, 0],
      { name: 'O', size: 2, color: INK, fixed: true, highlight: false, label: { offset: [6, -12] } });
    var cercle = board.create('circle', [O, R],
      { strokeColor: INK, strokeWidth: 1.6, fixed: true, highlight: false, fillColor: 'none' });
    function surCercle(deg) { return [R * Math.cos(deg * D2R), R * Math.sin(deg * D2R)]; }
    var A = board.create('glider', surCercle(210).concat([cercle]),
      { name: 'A', size: 3, color: C_ARC, highlight: false, label: { offset: [-16, -8] } });
    var B = board.create('glider', surCercle(330).concat([cercle]),
      { name: 'B', size: 3, color: C_ARC, highlight: false, label: { offset: [8, -8] } });
    var M = board.create('glider', surCercle(100).concat([cercle]),
      { name: 'M', size: 3, color: C_INS, highlight: false, label: { offset: [-6, 12] } });

    function pol(P) { return Math.atan2(P.Y(), P.X()); }
    function degDe(P) { return pol(P) / D2R; }
    function mod360(x) { x = x % 360; if (x < 0) x += 360; return x; }
    function pose(P, deg) {
      deg = Math.round(deg);   // degrés entiers : des mesures lisibles
      P.setPosition(JXG.COORDS_BY_USER, surCercle(deg));
    }
    // À la main, chaque point s'accroche au degré entier le plus proche ; et si
    // une animation vient de finir, sa trace et son panneau s'effacent.
    [A, B, M].forEach(function (P) {
      P.on('drag', function () {
        pose(P, degDe(P));
        if (mode !== 'demo') { mode = 'demo'; ghosts = []; refresh(); }
      });
    });

    /* ==================================================================== */
    /* Géométrie                                                             */
    /* ==================================================================== */
    function dist(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()); }
    function degenere() { return dist(M, A) < 0.05 || dist(M, B) < 0.05; }
    function angle(V, P, Q) {   // angle PVQ non orienté, en degrés
      var px = P.X() - V.X(), py = P.Y() - V.Y(), qx = Q.X() - V.X(), qy = Q.Y() - V.Y();
      var lp = Math.hypot(px, py), lq = Math.hypot(qx, qy);
      if (lp < EPS || lq < EPS) return NaN;
      var c = (px * qx + py * qy) / (lp * lq);
      return Math.acos(Math.max(-1, Math.min(1, c))) / D2R;
    }
    function angleInscrit() { return degenere() ? NaN : angle(M, A, B); }
    // L'arc intercepté : de A vers B, du côté où M n'est pas. Balayage signé
    // en degrés (positif = sens direct), entre −360 et 360.
    function arcIntercepte() {
      var s = mod360(degDe(B) - degDe(A));             // de A à B en sens direct
      var mDessus = mod360(degDe(M) - degDe(A)) < s;   // M est-il sur cet arc-là ?
      return mDessus ? s - 360 : s;
    }
    function angleCentre() { return degenere() ? NaN : Math.abs(arcIntercepte()); }
    // La démonstration : D diamétralement opposé à M, α = OMA, β = OMB.
    function alpha() { return angle(M, A, O); }
    function beta() { return angle(M, B, O); }
    // O est-il à l'intérieur de l'angle AMB ? (alors AMB = α + β, sinon |β − α|)
    function oDedans() {
      var a = alpha(), b = beta(), t = angleInscrit();
      return Math.abs(a + b - t) < 1e-6;
    }
    function rentrant() { return angleCentre() > 180 + 1e-9; }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    var D = board.create('point', [function () { return -M.X(); }, function () { return -M.Y(); }],
      { name: 'D', size: 2.5, color: C_DIAM, fixed: true, highlight: false, visible: false, label: { offset: [6, -12] } });
    var diametre = board.create('segment', [M, D],
      { strokeColor: C_DIAM, strokeWidth: 1.4, dash: 2, strokeOpacity: 0, fixed: true, highlight: false, layer: 6 });
    var cotesIns = [board.create('segment', [M, A], { strokeColor: C_INS, strokeWidth: 2.2, fixed: true, highlight: false, layer: 7 }),
                    board.create('segment', [M, B], { strokeColor: C_INS, strokeWidth: 2.2, fixed: true, highlight: false, layer: 7 })];
    var cotesCen = [board.create('segment', [O, A], { strokeColor: C_CEN, strokeWidth: 2.2, fixed: true, highlight: false, layer: 7 }),
                    board.create('segment', [O, B], { strokeColor: C_CEN, strokeWidth: 2.2, fixed: true, highlight: false, layer: 7 })];

    // Un arc de centre (cx, cy), du cap a1 (radians) sur un balayage d (radians signé).
    function pushArc(X, Y, cx, cy, r, a1, d, n) {
      for (var i = 0; i <= n; i++) { X.push(cx + r * Math.cos(a1 + d * i / n)); Y.push(cy + r * Math.sin(a1 + d * i / n)); }
    }
    // L'arc intercepté, sur le cercle, en rouge épais.
    var arcAB = board.create('curve', [[], []],
      { strokeColor: C_ARC, strokeWidth: 5, fillColor: 'none', fixed: true, highlight: false, layer: 8 });
    arcAB.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (degenere()) return;
      pushArc(this.dataX, this.dataY, 0, 0, R, pol(A), arcIntercepte() * D2R, 60);
    };
    // Le secteur de l'angle inscrit en M (le plus court chemin de [MA) à [MB)).
    var secteurIns = board.create('curve', [[], []],
      { strokeColor: C_INS, strokeWidth: 2.4, fillColor: C_INS, fillOpacity: 0.15, fixed: true, highlight: false, layer: 9 });
    secteurIns.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (degenere()) return;
      var a1 = Math.atan2(A.Y() - M.Y(), A.X() - M.X()), a2 = Math.atan2(B.Y() - M.Y(), B.X() - M.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      this.dataX.push(M.X()); this.dataY.push(M.Y());
      pushArc(this.dataX, this.dataY, M.X(), M.Y(), 0.9, a1, d, 24);
      this.dataX.push(M.X()); this.dataY.push(M.Y());
    };
    // Le secteur de l'angle au centre : de [OA) à [OB), du côté de l'arc rouge
    // (il peut dépasser 180°).
    var secteurCen = board.create('curve', [[], []],
      { strokeColor: C_CEN, strokeWidth: 2.4, fillColor: C_CEN, fillOpacity: 0.18, fixed: true, highlight: false, layer: 9 });
    secteurCen.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      if (degenere()) return;
      this.dataX.push(0); this.dataY.push(0);
      pushArc(this.dataX, this.dataY, 0, 0, 1.1, pol(A), arcIntercepte() * D2R, 48);
      this.dataX.push(0); this.dataY.push(0);
    };

    /* Marques de la démonstration : courbes recalculées, opacité 0 au repos. */
    function marque(col, width) {
      return board.create('curve', [[], []],
        { strokeColor: col, strokeWidth: width || 2.2, strokeOpacity: 0, fillColor: 'none', fixed: true, highlight: false, layer: 10 });
    }
    // k arcs concentriques de sommet V, de [VP) vers [VQ) (le plus court chemin).
    function arcsSommet(X, Y, V, P, Q, r, k) {
      var a1 = Math.atan2(P.Y() - V.Y(), P.X() - V.X()), a2 = Math.atan2(Q.Y() - V.Y(), Q.X() - V.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      for (var j = 0; j < k; j++) { pushArc(X, Y, V.X(), V.Y(), r + j * 0.16, a1, d, 24); X.push(NaN); Y.push(NaN); }
    }
    // α : en M (entre [MA) et [MO)) et en A (entre [AM) et [AO)) — un arc.
    var alphaM = marque(C_A), alphaA = marque(C_A);
    alphaM.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, M, A, O, 1.25, 1); };
    alphaA.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, A, M, O, 0.85, 1); };
    // β : en M (entre [MO) et [MB)) et en B — deux arcs.
    var betaM = marque(C_B), betaB = marque(C_B);
    betaM.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, M, O, B, 1.45, 2); };
    betaB.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, B, O, M, 0.75, 2); };
    // Au centre : AOD = 2α (un arc violet) et BOD = 2β (deux arcs verts).
    var deuxAlpha = marque(C_A, 2.6), deuxBeta = marque(C_B, 2.6);
    deuxAlpha.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, O, D, A, 1.55, 1); };
    deuxBeta.updateDataArray = function () { this.dataX = []; this.dataY = []; if (!degenere()) arcsSommet(this.dataX, this.dataY, O, D, B, 1.85, 2); };
    // Les deux triangles isocèles, en fond léger.
    var triOMA = board.create('polygon', [O, M, A], { fillColor: C_A, fillOpacity: 0, highlight: false, fixed: true, borders: { visible: false }, vertices: { visible: false } });
    var triOMB = board.create('polygon', [O, M, B], { fillColor: C_B, fillOpacity: 0, highlight: false, fixed: true, borders: { visible: false }, vertices: { visible: false } });
    // Un petit trait sur chaque rayon : « même longueur ».
    var ticks = board.create('curve', [[], []], { strokeColor: C_DIAM, strokeWidth: 2, strokeOpacity: 0, fixed: true, highlight: false, layer: 10 });
    ticks.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      var X = this.dataX, Y = this.dataY;
      [A, B, M].forEach(function (P) {
        var ux = P.X() / R, uy = P.Y() / R, cx = P.X() / 2, cy = P.Y() / 2;
        X.push(cx - uy * 0.18, cx + uy * 0.18, NaN); Y.push(cy + ux * 0.18, cy - ux * 0.18, NaN);
      });
    };

    /* La trace de « M parcourt son arc » : les positions passées, en gris. */
    var trace = board.create('curve', [[], []],
      { strokeColor: C_TRACE, strokeWidth: 1.2, strokeOpacity: 0.8, fillColor: 'none', fixed: true, highlight: false, layer: 3 });
    trace.updateDataArray = function () {
      this.dataX = []; this.dataY = [];
      var X = this.dataX, Y = this.dataY;
      ghosts.forEach(function (t) {
        var mx = R * Math.cos(t), my = R * Math.sin(t);
        X.push(A.X(), mx, B.X(), NaN); Y.push(A.Y(), my, B.Y(), NaN);
        var a1 = Math.atan2(A.Y() - my, A.X() - mx), a2 = Math.atan2(B.Y() - my, B.X() - mx);
        var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        pushArc(X, Y, mx, my, 0.6, a1, d, 16); X.push(NaN); Y.push(NaN);
      });
    };

    /* ==================================================================== */
    /* Étiquettes vivantes                                                   */
    /* ==================================================================== */
    function fmtDeg(x) {
      if (isNaN(x)) return '—';
      return String(Math.round(x * 10) / 10).replace('.', ',') + '°';
    }
    function lbl(fx, fy, fn, col, size) {
      return board.create('text', [fx, fy, fn], {
        anchorX: 'middle', anchorY: 'middle', fontSize: size || 14, color: col,
        cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 11
      });
    }
    // Le bandeau : les deux mesures, toujours.
    var bandeauIns = lbl(-7.0, 5.7, function () {
      if (degenere()) return 'M est confondu avec A ou B : plus d\'angle inscrit.';
      return 'Angle inscrit  AMB = ' + fmtDeg(angleInscrit());
    }, C_INS, 15);
    var bandeauCen = lbl(-7.0, 5.0, function () {
      if (degenere()) return '';
      var c = angleCentre(), i = angleInscrit();
      return 'Angle au centre  AOB = ' + fmtDeg(c) + '  =  2 × ' + fmtDeg(i) + (rentrant() ? '   (angle rentrant)' : '');
    }, C_CEN, 15);
    bandeauIns.setAttribute({ anchorX: 'left' });
    bandeauCen.setAttribute({ anchorX: 'left' });
    // La mesure près de chaque angle, sur sa bissectrice.
    function bissIns(r) {
      var a1 = Math.atan2(A.Y() - M.Y(), A.X() - M.X()), a2 = Math.atan2(B.Y() - M.Y(), B.X() - M.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      return [M.X() + r * Math.cos(a1 + d / 2), M.Y() + r * Math.sin(a1 + d / 2)];
    }
    function bissCen(r) {
      var a = pol(A) + arcIntercepte() * D2R / 2;
      return [r * Math.cos(a), r * Math.sin(a)];
    }
    var mesureIns = lbl(function () { return bissIns(1.45)[0]; }, function () { return bissIns(1.45)[1]; },
      function () { return fmtDeg(angleInscrit()); }, C_INS, 13);
    var mesureCen = lbl(function () { return bissCen(1.7)[0]; }, function () { return bissCen(1.7)[1]; },
      function () { return fmtDeg(angleCentre()); }, C_CEN, 13);
    // Les lettres de la démonstration.
    function midDir(V, P, Q, r) {
      var a1 = Math.atan2(P.Y() - V.Y(), P.X() - V.X()), a2 = Math.atan2(Q.Y() - V.Y(), Q.X() - V.X());
      var d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      return [V.X() + r * Math.cos(a1 + d / 2), V.Y() + r * Math.sin(a1 + d / 2)];
    }
    function lettre(V, P, Q, r, txt, col) {
      return lbl(function () { return midDir(V, P, Q, r)[0]; }, function () { return midDir(V, P, Q, r)[1]; }, function () { return txt; }, col, 13);
    }
    var lblAlphaM = lettre(M, A, O, 1.75, 'α', C_A), lblAlphaA = lettre(A, M, O, 1.3, 'α', C_A);
    var lblBetaM = lettre(M, O, B, 2.1, 'β', C_B), lblBetaB = lettre(B, O, M, 1.3, 'β', C_B);
    var lbl2Alpha = lettre(O, D, A, 2.2, '2α', C_A), lbl2Beta = lettre(O, D, B, 2.55, '2β', C_B);
    var lettresAlpha = [lblAlphaM, lblAlphaA, lbl2Alpha], lettresBeta = [lblBetaM, lblBetaB, lbl2Beta];

    /* ==================================================================== */
    /* Panneau                                                               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel cercle-demo';
    mv.extras.appendChild(panel);
    function sp(t, col) { return '<span style="color:' + col + ';font-weight:700">' + t + '</span>'; }
    function ligne(n, html, visible) {
      return '<li class="cercle-ligne" style="' + (visible ? '' : 'display:none') + '" data-n="' + n + '">' + html + '</li>';
    }
    function ecrirePanneau() {
      var i = angleInscrit(), c = angleCentre();
      if (mode === 'parcours') {
        panel.innerHTML =
          '<div class="props-label">M parcourt son arc</div>' +
          '<ul class="props-list">' +
          ligne(1, 'M glisse d\'un bout à l\'autre de son arc, et ' + sp('AMB = ' + fmtDeg(i), C_INS) + ' ne change pas : ' +
            'tant que l\'arc ' + sp('AB', C_ARC) + ' est le même, l\'angle inscrit est le même.', true) +
          ligne(2, 'L\'angle au centre non plus : ' + sp('AOB = ' + fmtDeg(c), C_CEN) + ', toujours ' + sp('2 × ' + fmtDeg(i), C_INS) + '.', true) +
          '</ul>';
        return;
      }
      if (mode === 'ouverture') {
        panel.innerHTML =
          '<div class="props-label">L\'arc s\'ouvre</div>' +
          '<ul class="props-list">' +
          ligne(1, 'B glisse : l\'arc ' + sp('AB', C_ARC) + ' change, et les deux angles avec lui — ' +
            sp('AMB = ' + fmtDeg(i), C_INS) + ', ' + sp('AOB = ' + fmtDeg(c), C_CEN) + ' : toujours le double.', true) +
          ligne(2, rentrant()
            ? 'AMB dépasse 90° : l\'angle au centre dépasse 180°, il est ' + sp('rentrant', C_CEN) + ' — c\'est le grand secteur, et il vaut encore ' + sp('2 × ' + fmtDeg(i), C_INS) + '.'
            : 'Tant que AMB reste aigu, l\'angle au centre reste inférieur à 180°. Passé 90°, il deviendra <b>rentrant</b>.', true) +
          '</ul>';
        return;
      }
      var a = alpha(), b = beta(), dedans = oDedans();
      var conclusion;
      if (dedans) {
        conclusion = sp('AOB', C_CEN) + ' = ' + sp('AOD', C_A) + ' + ' + sp('BOD', C_B) + ' = ' + sp('2α', C_A) + ' + ' + sp('2β', C_B) +
          ' = 2(' + sp('α', C_A) + ' + ' + sp('β', C_B) + ') = ' + sp('2 × AMB', C_INS) +
          '. Ici : 2 × ' + fmtDeg(a) + ' + 2 × ' + fmtDeg(b) + ' = ' + sp(fmtDeg(c), C_CEN) + ' = 2 × ' + sp(fmtDeg(i), C_INS) + '.';
      } else if (b >= a) {
        conclusion = 'O est hors de l\'angle AMB, on soustrait : ' + sp('AOB', C_CEN) + ' = ' + sp('BOD', C_B) + ' − ' + sp('AOD', C_A) + ' = ' + sp('2β', C_B) + ' − ' + sp('2α', C_A) +
          ' = 2(' + sp('β', C_B) + ' − ' + sp('α', C_A) + ') = ' + sp('2 × AMB', C_INS) +
          '. Ici : 2 × ' + fmtDeg(b) + ' − 2 × ' + fmtDeg(a) + ' = ' + sp(fmtDeg(c), C_CEN) + ' = 2 × ' + sp(fmtDeg(i), C_INS) + '.';
      } else {
        conclusion = 'O est hors de l\'angle AMB, on soustrait : ' + sp('AOB', C_CEN) + ' = ' + sp('AOD', C_A) + ' − ' + sp('BOD', C_B) + ' = ' + sp('2α', C_A) + ' − ' + sp('2β', C_B) +
          ' = 2(' + sp('α', C_A) + ' − ' + sp('β', C_B) + ') = ' + sp('2 × AMB', C_INS) +
          '. Ici : 2 × ' + fmtDeg(a) + ' − 2 × ' + fmtDeg(b) + ' = ' + sp(fmtDeg(c), C_CEN) + ' = 2 × ' + sp(fmtDeg(i), C_INS) + '.';
      }
      panel.innerHTML =
        '<div class="props-label">Pourquoi l\'angle au centre est-il le double ?</div>' +
        '<ul class="props-list">' +
        (degenere() ? ligne(0, 'M est confondu avec A ou B : écarte-le pour avoir un angle inscrit.', true) : '') +
        ligne(1, 'On trace le diamètre ' + sp('[MD]', C_DIAM) + '. ' + sp('OA = OB = OM = R', C_DIAM) + ' : ce sont trois rayons.', phase >= 1) +
        ligne(2, sp('OMA', C_A) + ' est <b>isocèle en O</b> : ses angles en M et en A sont égaux, notons-les ' + sp('α', C_A) + '. ' +
          'Son angle en O vaut 180° − 2α ; comme M, O, D sont alignés, ' + sp('AOD = 180° − (180° − 2α) = 2α', C_A) + '.', phase >= 2) +
        ligne(3, 'De même ' + sp('OMB', C_B) + ' est <b>isocèle en O</b> : ses angles en M et en B valent ' + sp('β', C_B) + ', et ' +
          sp('BOD = 2β', C_B) + '.', phase >= 3) +
        ligne(4, conclusion + (rentrant() ? ' L\'angle AOB est ici rentrant (plus de 180°) : la règle tient encore.' : ''), phase >= 4) +
        (phase === 0 && !degenere() ? ligne(0, 'Clique sur <b>« Pourquoi ? »</b> puis <b>Suivante ▶</b> pour dérouler la démonstration.', true) : '') +
        '</ul>';
    }

    /* ==================================================================== */
    /* Rafraîchissement : les attributs AVANT board.update()                 */
    /* ==================================================================== */
    function refresh() {
      var demo = mode === 'demo';
      var enDemo = demo && rayP > 0.01;
      D.setAttribute({ visible: enDemo });
      diametre.setAttribute({ strokeOpacity: demo ? rayP : 0 });
      ticks.setAttribute({ strokeOpacity: demo ? rayP : 0 });
      alphaM.setAttribute({ strokeOpacity: demo ? alphaMark : 0 });
      alphaA.setAttribute({ strokeOpacity: demo ? alphaMark : 0 });
      deuxAlpha.setAttribute({ strokeOpacity: demo ? alphaMark : 0 });
      triOMA.setAttribute({ fillOpacity: demo ? 0.12 * alphaMark : 0 });
      lettresAlpha.forEach(function (t) { t.setAttribute({ visible: demo && alphaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + alphaMark }); });
      betaM.setAttribute({ strokeOpacity: demo ? betaMark : 0 });
      betaB.setAttribute({ strokeOpacity: demo ? betaMark : 0 });
      deuxBeta.setAttribute({ strokeOpacity: demo ? betaMark : 0 });
      triOMB.setAttribute({ fillOpacity: demo ? 0.12 * betaMark : 0 });
      lettresBeta.forEach(function (t) { t.setAttribute({ visible: demo && betaMark > 0.01, cssStyle: 'font-weight:700;opacity:' + betaMark }); });
      // Pendant la démonstration, les lettres prennent la place des mesures près
      // des angles ; le bandeau, lui, garde toujours les deux nombres.
      mesureIns.setAttribute({ visible: !enDemo && !degenere() });
      mesureCen.setAttribute({ visible: !enDemo && !degenere() });
      // La conclusion allume les deux secteurs.
      secteurIns.setAttribute({ fillOpacity: 0.15 + 0.25 * (demo ? sumMark : 0), strokeWidth: 2.4 + 1.2 * (demo ? sumMark : 0) });
      secteurCen.setAttribute({ fillOpacity: 0.18 + 0.25 * (demo ? sumMark : 0), strokeWidth: 2.4 + 1.2 * (demo ? sumMark : 0) });
      trace.setAttribute({ visible: mode === 'parcours' });
      // Pendant une animation, les points sont bloqués (ils sont posés par l'étape).
      A.setAttribute({ fixed: animEnCours });
      B.setAttribute({ fixed: animEnCours });
      M.setAttribute({ fixed: animEnCours });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Animations                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function razDemo() { phase = 0; alphaMark = 0; betaMark = 0; sumMark = 0; rayP = 0; }
    function raz() {
      mode = 'demo'; animEnCours = false; ghosts = [];
      razDemo();
      redraw();
    }

    // L'arc du cercle qui contient P, délimité par U et V : { phi0, span } en
    // degrés, sens direct depuis phi0 ; et la position u0 de P sur cet arc.
    function arcContenant(U, V, P) {
      var dU = degDe(U), dV = degDe(V), dP = degDe(P);
      var s = mod360(dV - dU);
      if (mod360(dP - dU) < s) return { phi0: dU, span: s, u0: mod360(dP - dU) };
      return { phi0: dV, span: 360 - s, u0: mod360(dP - dV) };
    }
    var MARGE = 4;   // degrés gardés à chaque bout : M ne se confond jamais avec A ou B

    // « M parcourt son arc » : trois étapes absolues — M va à un bout, traverse
    // tout l'arc (la trace garde douze positions), puis revient à sa place.
    function parcours() {
      anim.cancel();
      raz();
      var arc = arcContenant(A, B, M);
      if (arc.span < 2 * MARGE + 2) { redraw(); return; }   // pas d'arc où glisser
      mode = 'parcours'; animEnCours = true; ghosts = [];
      redraw();
      var u0 = arc.u0, uA = MARGE, uB = arc.span - MARGE, N = 12;
      function poseU(u) { pose(M, arc.phi0 + u); }
      anim.runSteps([
        { dur: 1200, step: function (p) { ghosts = []; poseU(u0 + (uA - u0) * p); refresh(); },
          after: function () { poseU(uA); refresh(); } },
        { dur: 6000, step: function (p) {
            ghosts = [];
            for (var k = 1; k <= N; k++) if (k / N <= p + 1e-9) ghosts.push((arc.phi0 + uA + (uB - uA) * k / N) * D2R);
            poseU(uA + (uB - uA) * p); refresh();
          },
          after: function () { poseU(uB); refresh(); } },
        { dur: 1500, step: function (p) {
            ghosts = []; for (var k = 1; k <= N; k++) ghosts.push((arc.phi0 + uA + (uB - uA) * k / N) * D2R);
            poseU(uB + (u0 - uB) * p); refresh();
          },
          after: function () { poseU(u0); animEnCours = false; refresh(); } }
      ], function () { ghosts = []; animEnCours = true; poseU(u0); redraw(); });
    }

    // « L'arc s'ouvre » : B se referme sur A, s'ouvre jusqu'à M, puis revient.
    function ouverture() {
      anim.cancel();
      raz();
      var arc = arcContenant(A, M, B);
      if (arc.span < 2 * MARGE + 2) { redraw(); return; }
      mode = 'ouverture'; animEnCours = true;
      redraw();
      var u0 = arc.u0, uA = MARGE, uM = arc.span - MARGE;
      // L'arc va de A (u = 0) à M (u = span) ou l'inverse : on part du côté de A.
      var versA = Math.abs(mod360(arc.phi0 - degDe(A))) < 1e-9;
      var uFerme = versA ? uA : uM, uOuvert = versA ? uM : uA;
      function poseU(u) { pose(B, arc.phi0 + u); }
      anim.runSteps([
        { dur: 1500, step: function (p) { poseU(u0 + (uFerme - u0) * p); refresh(); },
          after: function () { poseU(uFerme); refresh(); } },
        { dur: 6000, step: function (p) { poseU(uFerme + (uOuvert - uFerme) * p); refresh(); },
          after: function () { poseU(uOuvert); refresh(); } },
        { dur: 1500, step: function (p) { poseU(uOuvert + (u0 - uOuvert) * p); refresh(); },
          after: function () { poseU(u0); animEnCours = false; refresh(); } }
      ], function () { animEnCours = true; poseU(u0); redraw(); });
    }

    // « Pourquoi ? » : la démonstration en quatre étapes, chacune absolue.
    function pourquoi() {
      anim.cancel();
      raz();
      anim.runSteps([
        { dur: 700, step: function (p) { rayP = p; refresh(); },
          after: function () { phase = 1; refresh(); } },
        { dur: 700, step: function (p) { rayP = 1; phase = Math.max(phase, 1); alphaMark = p; refresh(); },
          after: function () { phase = 2; refresh(); } },
        { dur: 700, step: function (p) { rayP = 1; alphaMark = 1; phase = Math.max(phase, 2); betaMark = p; refresh(); },
          after: function () { phase = 3; refresh(); } },
        { dur: 900, step: function (p) { rayP = 1; alphaMark = 1; betaMark = 1; phase = Math.max(phase, 3); sumMark = p; refresh(); },
          after: function () { phase = 4; refresh(); } }
      ], function () { razDemo(); redraw(); });
    }

    // Les points bougent à la main : le panneau suit (le bandeau est un texte vivant).
    [A, B, M].forEach(function (P) { P.on('drag', ecrirePanneau); });

    mv.addControls([
      { type: 'button', id: 'parcours', label: '▶ M parcourt son arc', onClick: parcours },
      { type: 'button', id: 'ouverture', label: '▶ L\'arc s\'ouvre', onClick: ouverture },
      { type: 'button', id: 'pourquoi', label: '❓ Pourquoi ?', onClick: pourquoi },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); raz(); } }
    ]);

    raz();
    pourquoi();   // charge les étapes : en pas à pas la figure est prête, on déroule à la main
  }
});
