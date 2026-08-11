/*
 * Angles et droites parallèles (5ème) — alternes-internes et correspondants.
 *
 * LA CONFIGURATION. Deux droites (d1) et (d2) coupées par une SÉCANTE : deux
 * points d'intersection A et B, et huit angles. La leçon montre lesquels sont
 * égaux, et surtout POURQUOI.
 *
 * DEUX ANIMATIONS, DEUX TRANSFORMATIONS. C'est le cœur de la leçon : on ne
 * dit pas « ces angles sont égaux », on fait GLISSER ou TOURNER l'angle de A
 * jusqu'à B et l'on regarde s'il tombe pile dessus.
 *   - angles CORRESPONDANTS : on fait glisser l'angle le long de la sécante
 *     (translation de A vers B) ;
 *   - angles ALTERNES-INTERNES (et alternes-externes) : on fait faire à
 *     l'angle un DEMI-TOUR autour du milieu I de [AB] — la symétrie centrale
 *     de la leçon précédente.
 * Quand les droites sont parallèles, la copie se superpose exactement. Sinon,
 * elle tombe à côté : c'est visible à l'œil.
 *
 * LA CARACTÉRISATION. Le curseur « Tourner (d2) » fait pivoter (d2) autour de
 * B. À 0 les droites sont parallèles et les angles sont égaux ; dès qu'on
 * bouge le curseur, les deux mesures se séparent — et l'écart entre elles est
 * exactement l'angle dont on a tourné (d2). Les angles sont donc égaux SI ET
 * SEULEMENT SI les droites sont parallèles : c'est la propriété ET sa
 * réciproque, dans un seul geste.
 *
 * ---------------------------------------------------------------------------
 * La géométrie
 * ---------------------------------------------------------------------------
 * (d1) est la droite horizontale y = +H, la sécante passe par l'origine avec
 * l'angle s, donc A = (H/tan s ; H) et B = (−H/tan s ; −H) est son point de
 * percée de la droite y = −H. (d2) est la droite passant par B et dirigée par
 * l'angle `tilt` : à tilt = 0 c'est exactement la parallèle à (d1), et faire
 * varier tilt fait pivoter (d2) AUTOUR DE B — A et B ne bougent donc jamais.
 *
 * Les quatre rayons issus de A sont dirigés par les angles 0, s, 180, 180+s ;
 * ceux issus de B par tilt, s, 180+tilt, 180+s. Chaque angle de la figure est
 * un secteur [a1 ; a2] entre deux de ces directions, ce qui donne :
 *      correspondants        A[180+s ; 360]      B[180+s ; 360+tilt]
 *      alternes-internes     A[180 ; 180+s]      B[tilt ; s]
 *      alternes-externes     A[0 ; s]            B[180+tilt ; 180+s]
 * Les mesures valent respectivement 180−s et 180−s+tilt, puis s et s−tilt :
 * elles diffèrent toujours de `tilt`, nulles seulement si (d1) ∥ (d2).
 *
 * Une translation de A vers B laisse les directions inchangées ; un demi-tour
 * les augmente de 180°. On retrouve bien, dans les deux cas, le secteur de B
 * lorsque tilt = 0 — les animations ne font que rendre ce calcul visible.
 */
MathsView.register({
  id: 'angles-paralleles',
  title: 'Angles et droites parallèles',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Angles',
  theme: 'Géométrie — caractériser le parallélisme par les angles',
  exercices: ['angles-paralleles'],
  description:
    'Deux droites coupées par une <strong>sécante</strong> forment huit angles. ' +
    'Lesquels sont <strong>égaux</strong> ? ' +
    '<br>Clique sur <strong>Correspondants</strong> : l\'angle <strong>glisse</strong> le long de ' +
    'la sécante jusqu\'à l\'autre croisement. Clique sur <strong>Alternes-internes</strong> : ' +
    'l\'angle fait un <strong>demi-tour</strong> autour du milieu \\( I \\) de \\( [AB] \\). ' +
    'S\'il tombe pile sur l\'autre angle, c\'est qu\'ils sont égaux. ' +
    '<br>Puis utilise le curseur <strong>Tourner (d₂)</strong> : dès que les droites ne sont ' +
    '<strong>plus parallèles</strong>, la copie tombe à côté et les deux mesures se séparent.',
  notes:
    '<p><strong>Le vocabulaire.</strong> Les angles <em>internes</em> sont ceux situés ' +
    '<strong>entre</strong> les deux droites, les <em>externes</em> à l\'extérieur. ' +
    '<em>Alternes</em> veut dire « de part et d\'autre de la sécante » ; ' +
    '<em>correspondants</em> veut dire « du même côté de la sécante et à la même place » ' +
    '(l\'un intérieur, l\'autre extérieur).</p>' +
    '<ul>' +
    '<li><strong>Propriété.</strong> Si deux droites <strong>parallèles</strong> sont coupées par ' +
    'une sécante, alors les angles <strong>alternes-internes</strong> sont égaux, et les angles ' +
    '<strong>correspondants</strong> sont égaux.</li>' +
    '<li><strong>Réciproque.</strong> Si deux droites coupées par une sécante forment des angles ' +
    'alternes-internes (ou correspondants) <strong>égaux</strong>, alors ces deux droites sont ' +
    '<strong>parallèles</strong>. C\'est ce qui permet de <em>démontrer</em> qu\'elles le sont.</li>' +
    '<li><strong>Pourquoi ça marche.</strong> Les angles correspondants se déduisent l\'un de ' +
    'l\'autre en <strong>glissant</strong> le long de la sécante ; les alternes-internes par un ' +
    '<strong>demi-tour</strong> autour du milieu de \\( [AB] \\). Glisser et tourner ne changent ni ' +
    'les longueurs ni les angles : les deux angles sont donc superposables.</li>' +
    '<li>Attention&nbsp;: si les droites ne sont <strong>pas</strong> parallèles, ces angles ne ' +
    'sont plus égaux du tout — l\'écart entre les deux mesures est exactement l\'angle dont on a ' +
    'fait tourner \\( (d_2) \\).</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var PAR = '#2563eb';     // les deux droites (d1) et (d2)
    var SEC = '#334155';     // la sécante
    var EQ = '#7c3aed';      // la paire d'angles, quand ils sont ÉGAUX
    var BAD = '#dc2626';     // la paire d'angles, quand ils ne le sont plus
    var MOVE = '#ea580c';    // la copie qui glisse ou qui tourne
    var GUIDE = '#94a3b8';   // traits de construction
    var INK = '#64748b';

    var H = 2.3;             // demi-écart entre les deux droites
    var R = 1.15;            // rayon des secteurs d'angle

    function rad(d) { return d * Math.PI / 180; }
    function show(o, v) { o.setAttribute({ visible: v }); }

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas » (voir app.js)         */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* État : inclinaison de la sécante, rotation de (d2) autour de B         */
    /* ==================================================================== */
    var sDeg = 62;      // angle de la sécante avec (d1)
    var tiltDeg = 0;    // (d2) tournée de cet angle ; 0 → droites parallèles
    var cur = null;     // paire affichée : 'corr' | 'alt' | 'ext'
    var openA = { v: 0 };   // ouverture du secteur en A (0 → 1)
    var openB = { v: 0 };   // ouverture du secteur en B
    var mvp = { v: 0 };     // avancement de la copie qui se déplace (0 → 1)

    function parallele() { return tiltDeg === 0; }

    /* ==================================================================== */
    /* Les deux points d'intersection (ils ne bougent pas quand on tourne d2) */
    /* ==================================================================== */
    function Apt() { return [H / Math.tan(rad(sDeg)), H]; }
    function Bpt() { return [-H / Math.tan(rad(sDeg)), -H]; }
    function Ipt() { var a = Apt(), b = Bpt(); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }

    /* ==================================================================== */
    /* Secteur d'angle : courbe fermée sommet → arc → sommet                 */
    /* Le chemin part du sommet, longe l'arc de a1 à a2 puis revient : le    */
    /* remplissage dessine donc bien le SECTEUR (et pas seulement l'arc).    */
    /* ==================================================================== */
    function sectorCurve(vFn, a1Fn, a2Fn, style) {
      var c = board.create('curve', [
        function (t) {
          var v = vFn();
          if (t < 0) return v[0] + (1 + t / 0.12) * R * Math.cos(a1Fn());
          if (t > 1) return v[0] + (1 - (t - 1) / 0.12) * R * Math.cos(a2Fn());
          var a = a1Fn(); return v[0] + R * Math.cos(a + (a2Fn() - a) * t);
        },
        function (t) {
          var v = vFn();
          if (t < 0) return v[1] + (1 + t / 0.12) * R * Math.sin(a1Fn());
          if (t > 1) return v[1] + (1 - (t - 1) / 0.12) * R * Math.sin(a2Fn());
          var a = a1Fn(); return v[1] + R * Math.sin(a + (a2Fn() - a) * t);
        },
        -0.12, 1.12
      ], style);
      return c;
    }

    /* ==================================================================== */
    /* Les trois paires d'angles                                             */
    /* Chaque secteur est décrit par ses deux directions, en degrés.         */
    /* ==================================================================== */
    var PAIRS = {
      corr: {
        label: 'angles correspondants',
        how: 'on fait GLISSER l\'angle le long de la sécante',
        move: 'trans',
        angA: function () { return [180 + sDeg, 360]; },
        angB: function () { return [180 + sDeg, 360 + tiltDeg]; }
      },
      alt: {
        label: 'angles alternes-internes',
        how: 'on fait faire à l\'angle un DEMI-TOUR autour de I',
        move: 'rot',
        angA: function () { return [180, 180 + sDeg]; },
        angB: function () { return [tiltDeg, sDeg]; }
      },
      ext: {
        label: 'angles alternes-externes',
        how: 'on fait faire à l\'angle un DEMI-TOUR autour de I',
        move: 'rot',
        angA: function () { return [0, sDeg]; },
        angB: function () { return [180 + tiltDeg, 180 + sDeg]; }
      }
    };
    function P() { return PAIRS[cur] || PAIRS.alt; }          // paire courante
    function angA() { return P().angA(); }
    function angB() { return P().angB(); }
    function mesA() { var a = angA(); return a[1] - a[0]; }   // mesures, en degrés
    function mesB() { var a = angB(); return a[1] - a[0]; }

    /* ==================================================================== */
    /* Les droites                                                           */
    /* ==================================================================== */
    // (d1) : horizontale, en haut.
    board.create('line', [[-9, H], [9, H]],
      { strokeColor: PAR, strokeWidth: 2.5, fixed: true, highlight: false });
    // (d2) : passe par B, dirigée par `tilt` (parallèle à (d1) quand tilt = 0).
    function d2Pt(k) {
      var b = Bpt(), t = rad(tiltDeg);
      return [b[0] + k * Math.cos(t), b[1] + k * Math.sin(t)];
    }
    board.create('line', [
      board.create('point', [function () { return d2Pt(-9)[0]; }, function () { return d2Pt(-9)[1]; }],
        { visible: false, fixed: true, name: '' }),
      board.create('point', [function () { return d2Pt(9)[0]; }, function () { return d2Pt(9)[1]; }],
        { visible: false, fixed: true, name: '' })
    ], { strokeColor: PAR, strokeWidth: 2.5, fixed: true, highlight: false });
    // La sécante : passe par l'origine, inclinée de sDeg.
    function secPt(k) { return [k * Math.cos(rad(sDeg)), k * Math.sin(rad(sDeg))]; }
    board.create('line', [
      board.create('point', [function () { return secPt(-9)[0]; }, function () { return secPt(-9)[1]; }],
        { visible: false, fixed: true, name: '' }),
      board.create('point', [function () { return secPt(9)[0]; }, function () { return secPt(9)[1]; }],
        { visible: false, fixed: true, name: '' })
    ], { strokeColor: SEC, strokeWidth: 2, fixed: true, highlight: false });

    // Étiquettes des droites.
    board.create('text', [7.1, H + 0.35, '(d\u2081)'],
      { fontSize: 15, color: PAR, cssStyle: 'font-weight:700', fixed: true });
    board.create('text', [
      7.1,   // le point de (d2) d'abscisse 7,1 : on suit la droite quand elle pivote
      function () { var b = Bpt(); return b[1] + (7.1 - b[0]) * Math.tan(rad(tiltDeg)) + 0.35; },
      '(d\u2082)'
    ], { fontSize: 15, color: PAR, cssStyle: 'font-weight:700', fixed: true });
    board.create('text', [
      function () { return secPt(5.6)[0] + 0.25; },
      function () { return secPt(5.6)[1]; },
      'sécante'
    ], { fontSize: 14, color: SEC, cssStyle: 'font-weight:600', fixed: true });

    // Codage du parallélisme : un chevron sur chaque droite (si elles le sont).
    function chevron(pFn, uFn) {
      // Trois points : bras du haut, pointe, bras du bas. L'indice est ARRONDI
      // plutôt que comparé à l'identique : le tracé reste juste même si
      // JSXGraph échantillonne la courbe plus finement que demandé.
      function pts() {
        var p = pFn(), u = uFn(), c = Math.cos(u), s = Math.sin(u);
        function q(d, e) { return [p[0] + d * c - e * s, p[1] + d * s + e * c]; }
        return [q(-0.1, 0.22), q(0.26, 0), q(-0.1, -0.22)];
      }
      return board.create('curve', [
        function (t) { return pts()[Math.round(t)][0]; },
        function (t) { return pts()[Math.round(t)][1]; },
        0, 2
      ], { strokeColor: PAR, strokeWidth: 2, highlight: false, numberPointsHigh: 3, numberPointsLow: 3 });
    }
    // (ils ne sont affichés que lorsque tilt = 0, donc (d2) y est horizontale)
    var chev1 = chevron(function () { return [-6.2, H]; }, function () { return 0; });
    var chev2 = chevron(function () { return [-6.2, -H]; }, function () { return 0; });

    /* ==================================================================== */
    /* Les points A, B et le milieu I                                        */
    /* ==================================================================== */
    var A = board.create('point', [function () { return Apt()[0]; }, function () { return Apt()[1]; }],
      { name: 'A', size: 4, color: SEC, fixed: true, highlight: false, showInfobox: false,
        label: { offset: [-16, 10], fontSize: 15, cssStyle: 'font-weight:700' } });
    var B = board.create('point', [function () { return Bpt()[0]; }, function () { return Bpt()[1]; }],
      { name: 'B', size: 4, color: SEC, fixed: true, highlight: false, showInfobox: false,
        label: { offset: [-16, -18], fontSize: 15, cssStyle: 'font-weight:700' } });
    var I = board.create('point', [function () { return Ipt()[0]; }, function () { return Ipt()[1]; }],
      { name: 'I', size: 3, color: MOVE, fixed: true, visible: false, highlight: false,
        showInfobox: false, label: { offset: [10, 6], fontSize: 14, strokeColor: MOVE } });

    /* ==================================================================== */
    /* Les deux secteurs de la paire, et la copie qui se déplace              */
    /* ==================================================================== */
    function col() { return parallele() ? EQ : BAD; }

    var secA = sectorCurve(Apt,
      function () { return rad(angA()[0]); },
      function () { return rad(angA()[0] + (angA()[1] - angA()[0]) * openA.v); },
      { strokeColor: EQ, strokeWidth: 2, fillColor: EQ, fillOpacity: 0.22,
        highlight: false, visible: false });
    var secB = sectorCurve(Bpt,
      function () { return rad(angB()[0]); },
      function () { return rad(angB()[0] + (angB()[1] - angB()[0]) * openB.v); },
      { strokeColor: EQ, strokeWidth: 2, fillColor: EQ, fillOpacity: 0.22,
        highlight: false, visible: false });

    // La copie : elle part de l'angle en A, puis glisse (translation) ou
    // tourne d'un demi-tour autour de I, selon la paire choisie.
    function copyOff() { return P().move === 'rot' ? 180 * mvp.v : 0; }
    function copyV() {
      var a = Apt(), b = Bpt();
      if (P().move === 'trans') {
        return [a[0] + (b[0] - a[0]) * mvp.v, a[1] + (b[1] - a[1]) * mvp.v];
      }
      var i = Ipt(), th = Math.PI * mvp.v, c = Math.cos(th), s = Math.sin(th);
      var dx = a[0] - i[0], dy = a[1] - i[1];
      return [i[0] + dx * c - dy * s, i[1] + dx * s + dy * c];
    }
    var copy = sectorCurve(copyV,
      function () { return rad(angA()[0] + copyOff()); },
      function () { return rad(angA()[1] + copyOff()); },
      { strokeColor: MOVE, strokeWidth: 2.5, dash: 2, fillColor: MOVE, fillOpacity: 0.25,
        highlight: false, visible: false, layer: 9 });

    // Trajectoire du sommet pendant le déplacement (segment ou demi-cercle).
    var trace = board.create('curve', [
      function (t) {
        var a = Apt();
        if (P().move === 'trans') { var b = Bpt(); return a[0] + (b[0] - a[0]) * t; }
        var i = Ipt(), th = Math.PI * t;
        return i[0] + (a[0] - i[0]) * Math.cos(th) - (a[1] - i[1]) * Math.sin(th);
      },
      function (t) {
        var a = Apt();
        if (P().move === 'trans') { var b = Bpt(); return a[1] + (b[1] - a[1]) * t; }
        var i = Ipt(), th = Math.PI * t;
        return i[1] + (a[0] - i[0]) * Math.sin(th) + (a[1] - i[1]) * Math.cos(th);
      },
      0, function () { return mvp.v; }
    ], { strokeColor: MOVE, strokeWidth: 1.5, dash: 2, strokeOpacity: 0.8,
         highlight: false, visible: false });

    /* ==================================================================== */
    /* Les mesures, au milieu de chaque secteur                              */
    /* ==================================================================== */
    function midTxt(vFn, angFn) {
      // Placée sur la bissectrice du secteur, un peu en retrait de l'arc.
      function mid(angFn) { var a = angFn(); return rad((a[0] + a[1]) / 2); }
      return board.create('text', [
        function () { return vFn()[0] + 0.68 * R * Math.cos(mid(angFn)); },
        function () { return vFn()[1] + 0.68 * R * Math.sin(mid(angFn)); },
        function () { var a = angFn(); return Math.round(a[1] - a[0]) + '°'; }
      ], { fontSize: 15, color: EQ, cssStyle: 'font-weight:700', fixed: true, visible: false,
           anchorX: 'middle', anchorY: 'middle' });
    }
    var txtA = midTxt(Apt, angA);
    var txtB = midTxt(Bpt, angB);

    /* ==================================================================== */
    /* Bandeau : nom de la paire, et verdict égaux / pas égaux                */
    /* ==================================================================== */
    var titre = board.create('text', [-7.7, 5.4, function () {
      return cur ? 'Les ' + P().label : 'Choisis une paire d\'angles ci-dessous.';
    }], { fontSize: 17, color: SEC, cssStyle: 'font-weight:700', fixed: true });

    var verdict = board.create('text', [-7.7, 4.6, function () {
      if (!cur) return '';
      var a = Math.round(mesA()), b = Math.round(mesB());
      if (parallele()) {
        return a + '° = ' + b + '° — les droites sont parallèles, les angles sont ÉGAUX';
      }
      return a + '° ≠ ' + b + '° — les droites ne sont pas parallèles, les angles diffèrent';
    }], { fontSize: 15, color: EQ, cssStyle: 'font-weight:600', fixed: true, visible: false });

    // Repères de vocabulaire : où est l'intérieur, où est l'extérieur.
    board.create('text', [-7.7, 3.6, 'extérieur'],
      { fontSize: 13, color: INK, cssStyle: 'font-style:italic', fixed: true });
    board.create('text', [-7.7, 0, 'intérieur'],
      { fontSize: 13, color: INK, cssStyle: 'font-style:italic', fixed: true });
    board.create('text', [-7.7, -3.6, 'extérieur'],
      { fontSize: 13, color: INK, cssStyle: 'font-style:italic', fixed: true });

    /* ==================================================================== */
    /* Rafraîchissement : couleurs (égaux / pas égaux) et codage ∥            */
    /* ==================================================================== */
    function refresh() {
      var c = col();
      [secA, secB].forEach(function (o) { o.setAttribute({ strokeColor: c, fillColor: c }); });
      [txtA, txtB, verdict].forEach(function (o) { o.setAttribute({ color: c }); });
      show(chev1, parallele());
      show(chev2, parallele());
      board.update();
    }

    /* ==================================================================== */
    /* États : effacer / montrer une paire                                   */
    /* ==================================================================== */
    function hideAll() {
      anim.cancel();
      openA.v = 0; openB.v = 0; mvp.v = 0;
      [secA, secB, copy, trace, txtA, txtB, verdict, I].forEach(function (o) { show(o, false); });
      refresh();
    }

    function play(key) {
      hideAll();
      cur = key;
      var rot = PAIRS[key].move === 'rot';
      anim.runSteps([
        // 1. On ouvre l'angle en A, comme au rapporteur.
        { dur: 600,
          step: function (p) { openA.v = p; show(secA, true); },
          after: function () { show(txtA, true); } },
        // 2. La copie glisse ou fait son demi-tour, de A jusqu'à B.
        { dur: 1500,
          step: function (p) {
            mvp.v = p;
            show(copy, true); show(trace, true);
            if (rot) show(I, true);
          } },
        // 3. On ouvre l'angle en B : la copie tombe pile dessus… ou pas.
        { dur: 600,
          step: function (p) { openB.v = p; show(secB, true); },
          after: function () { show(txtB, true); show(verdict, true); } }
      ], hideAll);
      refresh();
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'corr', label: '▶ Correspondants', onClick: function () { play('corr'); } },
      { type: 'button', id: 'alt', label: '▶ Alternes-internes', onClick: function () { play('alt'); } },
      { type: 'button', id: 'ext', label: '▶ Alternes-externes', onClick: function () { play('ext'); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { cur = null; hideAll(); } },
      { type: 'slider', id: 'sec', label: 'Sécante (°)', min: 30, max: 150, step: 1, value: sDeg,
        onInput: function (v) { sDeg = v; refresh(); } },
      { type: 'slider', id: 'tilt', label: 'Tourner (d₂) de (°)', min: -25, max: 25, step: 1, value: 0,
        onInput: function (v) { tiltDeg = v; refresh(); } }
    ]);

    // Démarrage : on montre les angles alternes-internes.
    play('alt');
  }
});
