/*
 * Identités remarquables (3ème) — preuve par les aires.
 *
 * Trois identités, une par bouton, illustrées en découpant un carré ou un
 * rectangle en carrés et rectangles dont on additionne les aires :
 *
 *   (a + b)²      = a² + 2ab + b²      → grand carré de côté (a+b)
 *   (a − b)²      = a² − 2ab + b²      → carré a² dont on retire deux bandes ab
 *                                        (le coin b² est retiré deux fois : +b²)
 *   (a + b)(a − b) = a² − b²           → on réarrange l'aire a² − b² en rectangle
 *
 * Les deux longueurs a et b sont réglées par des curseurs ; toutes les
 * coordonnées sont des FONCTIONS de a et b, donc la figure et les aires se
 * recalculent en direct. Le moteur d'animation (runSteps / animate) est le même
 * que dans les leçons « Constructions au compas » et « Symétrie axiale ».
 */
MathsView.register({
  id: 'identites-remarquables',
  title: 'Identités remarquables',
  level: '3eme',
  theme: 'Calcul littéral — preuve des identités par les aires',
  description:
    'Chaque identité remarquable se lit sur une figure : l\'aire d\'un grand carré ' +
    'est la somme des aires des carrés et rectangles qui le composent. ' +
    '<br><strong>Choisis une identité</strong>, règle <strong>a</strong> et ' +
    '<strong>b</strong>, et clique sur <strong>Animer</strong> pour voir apparaître ' +
    'chaque terme. La vérification numérique s\'affiche dessous.',
  notes:
    '<ul>' +
    '<li><strong>(a + b)²</strong> : le carré de côté \\(a+b\\) se découpe en un carré ' +
    '\\(a^2\\), un carré \\(b^2\\) et <strong>deux</strong> rectangles \\(ab\\).</li>' +
    '<li><strong>(a − b)²</strong> : dans le carré \\(a^2\\) on enlève deux bandes \\(ab\\) ; ' +
    'leur coin commun \\(b^2\\) est enlevé deux fois, on le <strong>rajoute</strong> : ' +
    '\\(a^2 - 2ab + b^2\\).</li>' +
    '<li><strong>(a + b)(a − b)</strong> : l\'aire \\(a^2 - b^2\\) (le carré privé d\'un coin ' +
    '\\(b^2\\)) se <strong>réarrange</strong> en un rectangle de côtés \\(a+b\\) et \\(a-b\\).</li>' +
    '</ul>' +
    '<p>Ces égalités d\'aires sont vraies pour toutes les valeurs de \\(a\\) et \\(b\\) : ' +
    'ce sont des <strong>identités</strong>.</p>',
  board: { boundingbox: [-4.5, 4.5, 5.5, -4.5], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_A2 = '#3b82f6';   // a²  (bleu)
    var C_AB = '#f59e0b';   // ab  (ambre)
    var C_B2 = '#10b981';   // b²  (vert)
    var C_RES = '#7c3aed';  // résultat / pièce déplacée (violet)
    var C_NEG = '#ef4444';  // ce qu'on retire (rouge)
    var INK = '#334155';

    var ox = -3.2, oy = -3.2;   // coin bas-gauche des figures

    /* ==================================================================== */
    /* État                                                                  */
    /* ==================================================================== */
    var mode = 'sum';
    var aVal = 3, bVal = 2;
    var items = [];
    var current = null;
    var raf = null;

    function A() { return aVal; }
    // Pour (a−b)² et (a+b)(a−b) il faut a > b : on borne b à a − 0,5.
    function B() { return (mode === 'sum') ? bVal : Math.min(bVal, aVal - 0.5); }

    function track(o) { items.push(o); return o; }
    function cancelAnim() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function clearFigure() {
      cancelAnim();
      items.forEach(function (o) { try { board.removeObject(o); } catch (e) {} });
      items = [];
    }

    /* ==================================================================== */
    /* Moteur d'animation                                                    */
    /* ==================================================================== */
    function runSteps(steps) {
      var i = 0;
      function next() {
        if (i >= steps.length) return;
        var s = steps[i++];
        animate(s.dur, s.step, function () { if (s.after) s.after(); next(); });
      }
      next();
    }
    function animate(dur, onStep, onDone) {
      cancelAnim();
      var t0 = null;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        try { onStep(p); board.update(); }
        catch (e) { raf = null; return; }   // board libéré (on a quitté la leçon)
        if (p < 1) raf = requestAnimationFrame(frame);
        else { raf = null; if (onDone) onDone(); }
      }
      raf = requestAnimationFrame(frame);
    }

    /* ==================================================================== */
    /* Fabriques d'objets géométriques (coordonnées = fonctions de a, b)     */
    /* ==================================================================== */
    function pt(fx, fy) {
      return track(board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false }));
    }
    // Rectangle défini par quatre fonctions de coordonnées ; renvoie le polygone.
    function region(fx0, fy0, fx1, fy1, fill, stroke) {
      var pg = track(board.create('polygon',
        [pt(fx0, fy0), pt(fx1, fy0), pt(fx1, fy1), pt(fx0, fy1)],
        { fillColor: fill, fillOpacity: 0, highlight: false, withLabel: false,
          borders: { strokeColor: stroke || fill, strokeWidth: 2, strokeOpacity: 0 },
          vertices: { visible: false } }));
      return pg;
    }
    // Polygone quelconque à partir de fonctions renvoyant [x,y].
    function polyXY(cornerFns, fill, stroke) {
      var pts = cornerFns.map(function (f) {
        return pt(function () { return f()[0]; }, function () { return f()[1]; });
      });
      return track(board.create('polygon', pts,
        { fillColor: fill, fillOpacity: 0, highlight: false, withLabel: false,
          borders: { strokeColor: stroke || fill, strokeWidth: 2, strokeOpacity: 0 },
          vertices: { visible: false } }));
    }
    function label(fx, fy, txt, color) {
      return track(board.create('text', [fx, fy, txt],
        { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: color,
          cssStyle: 'font-weight:700', fixed: true, visible: false, highlight: false }));
    }
    // Affiche/masque une région (remplissage + bord) avec une opacité 0→1.
    function reveal(pg, fillT, p) {
      pg.setAttribute({ fillOpacity: fillT * p });
      if (pg.borders) pg.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: p }); });
    }
    function frameBorder(pg) {   // rend le bord d'un cadre visible en permanence
      if (pg.borders) pg.borders.forEach(function (b) {
        b.setAttribute({ strokeOpacity: 1, strokeColor: INK, strokeWidth: 2.5 });
      });
    }
    function show(o, v) { o.setAttribute({ visible: v }); }

    /* raccourcis de coordonnées ------------------------------------------- */
    function K(v) { return function () { return v; }; }            // constante
    function XO() { return ox; }
    function YO() { return oy; }

    /* ==================================================================== */
    /* Identité 1 — (a + b)² = a² + 2ab + b²                                  */
    /* ==================================================================== */
    function buildSum() {
      clearFigure();
      // Cadre extérieur, côté a+b (toujours visible).
      var frame = region(K(ox), K(oy),
        function () { return ox + A() + B(); }, function () { return oy + A() + B(); }, '#000', INK);
      frameBorder(frame);

      // Quatre régions.
      var rA = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A(); }, C_A2);
      var rAb1 = region(function () { return ox + A(); }, K(oy),
        function () { return ox + A() + B(); }, function () { return oy + A(); }, C_AB);
      var rAb2 = region(K(ox), function () { return oy + A(); },
        function () { return ox + A(); }, function () { return oy + A() + B(); }, C_AB);
      var rB = region(function () { return ox + A(); }, function () { return oy + A(); },
        function () { return ox + A() + B(); }, function () { return oy + A() + B(); }, C_B2);

      // Étiquettes d'aire (au centre de chaque région).
      var lA = label(function () { return ox + A() / 2; }, function () { return oy + A() / 2; }, 'a²', '#1e3a8a');
      var lAb1 = label(function () { return ox + A() + B() / 2; }, function () { return oy + A() / 2; }, 'ab', '#92400e');
      var lAb2 = label(function () { return ox + A() / 2; }, function () { return oy + A() + B() / 2; }, 'ab', '#92400e');
      var lB = label(function () { return ox + A() + B() / 2; }, function () { return oy + A() + B() / 2; }, 'b²', '#065f46');

      // Étiquettes de côté.
      var sBa = label(function () { return ox + A() / 2; }, K(oy - 0.4), 'a', INK);
      var sBb = label(function () { return ox + A() + B() / 2; }, K(oy - 0.4), 'b', INK);
      var sLa = label(K(ox - 0.4), function () { return oy + A() / 2; }, 'a', INK);
      var sLb = label(K(ox - 0.4), function () { return oy + A() + B() / 2; }, 'b', INK);

      function hideAll() {
        [rA, rAb1, rAb2, rB].forEach(function (r) { reveal(r, 0, 0); });
        [lA, lAb1, lAb2, lB, sBa, sBb, sLa, sLb].forEach(function (t) { show(t, false); });
      }
      hideAll();

      current = {
        play: function () {
          hideAll();
          runSteps([
            { dur: 380, step: function (p) { reveal(rA, 0.38, p); },
              after: function () { show(lA, true); show(sBa, true); show(sLa, true); } },
            { dur: 520, step: function (p) { reveal(rAb1, 0.42, p); reveal(rAb2, 0.42, p); },
              after: function () { show(lAb1, true); show(lAb2, true); show(sBb, true); show(sLb, true); } },
            { dur: 420, step: function (p) { reveal(rB, 0.42, p); },
              after: function () { show(lB, true); } }
          ]);
        },
        reset: hideAll
      };
    }

    /* ==================================================================== */
    /* Identité 2 — (a − b)² = a² − 2ab + b²                                  */
    /* ==================================================================== */
    function buildDiff() {
      clearFigure();

      /* Coordonnées clés (fonctions de a, b) --------------------------------
       * Le carré de côté a est découpé en 4 pièces disjointes :
       *   pInner  (a−b)×(a−b)  bas-gauche   → le résultat (a−b)²
       *   pTL     (a−b)×b      haut-gauche  ┐ ensemble : rectangle du haut a×b
       *   pCorner b×b          haut-droite  ┘
       *   pBR     b×(a−b)      bas-droite   ┐ + pCorner : rectangle de droite a×b
       * Les deux rectangles a×b partagent donc le coin b² : en les retirant
       * tous les deux on enlève ce coin DEUX fois, il faut le rajouter. */
      function Xi() { return ox + A() - B(); }   // frontière verticale interne
      function Yi() { return oy + A() - B(); }   // frontière horizontale interne
      function Xt() { return ox + A(); }         // bord droit du carré
      function Yt() { return oy + A(); }         // bord haut du carré
      function DY() { return B() + 0.8; }        // distance de sortie vers le haut
      function DX() { return B() + 0.8; }        // distance de sortie vers la droite

      var slideTop = 0;    // 0 → 1 : le rectangle du haut glisse hors du carré
      var slideRight = 0;  // 0 → 1 : le rectangle de droite glisse hors du carré

      // Cadre = carré de côté a (toujours visible).
      var frame = region(K(ox), K(oy), Xt, Yt, '#000', INK);
      frameBorder(frame);

      // Les 4 pièces bleues (a²) — bords invisibles : le carré paraît plein.
      var pInner = region(K(ox), K(oy), Xi, Yi, C_A2);
      var pTL = region(K(ox), Yi, Xi, Yt, C_A2);
      var pBR = region(Xi, K(oy), Xt, Yi, C_A2);
      var pCorner = region(Xi, Yi, Xt, Yt, C_A2);

      // Remplissage sans toucher aux bords (garde le carré « plein », sans grille).
      function fR(pg, ft, p) { pg.setAttribute({ fillOpacity: ft * p }); }

      // Guides pointillés marquant le report de b (côté a = (a−b) + b).
      function guide(fx0, fy0, fx1, fy1) {
        return track(board.create('segment', [pt(fx0, fy0), pt(fx1, fy1)],
          { strokeColor: INK, strokeWidth: 1.5, dash: 2, visible: false,
            fixed: true, highlight: false, withLabel: false,
            straightFirst: false, straightLast: false }));
      }
      var gH = guide(K(ox), Yi, Xt, Yi);
      var gV = guide(Xi, K(oy), Xi, Yt);

      // Rectangle mobile du HAUT (a×b) : glisse vers le haut de slideTop·DY.
      var mTop = polyXY([
        function () { return [ox, oy + A() - B() + slideTop * DY()]; },
        function () { return [ox + A(), oy + A() - B() + slideTop * DY()]; },
        function () { return [ox + A(), oy + A() + slideTop * DY()]; },
        function () { return [ox, oy + A() + slideTop * DY()]; }
      ], C_NEG);
      // Son coin b² (à droite) — mis en évidence : c'est lui qui sera compté 2 fois.
      var mTopCorner = polyXY([
        function () { return [ox + A() - B(), oy + A() - B() + slideTop * DY()]; },
        function () { return [ox + A(), oy + A() - B() + slideTop * DY()]; },
        function () { return [ox + A(), oy + A() + slideTop * DY()]; },
        function () { return [ox + A() - B(), oy + A() + slideTop * DY()]; }
      ], C_B2);

      // Rectangle mobile de DROITE (b×a) : glisse vers la droite de slideRight·DX.
      var mRight = polyXY([
        function () { return [ox + A() - B() + slideRight * DX(), oy]; },
        function () { return [ox + A() + slideRight * DX(), oy]; },
        function () { return [ox + A() + slideRight * DX(), oy + A()]; },
        function () { return [ox + A() - B() + slideRight * DX(), oy + A()]; }
      ], C_NEG);
      // Son coin b² (en haut) — le même carré, retiré une seconde fois.
      var mRightCorner = polyXY([
        function () { return [ox + A() - B() + slideRight * DX(), oy + A() - B()]; },
        function () { return [ox + A() + slideRight * DX(), oy + A() - B()]; },
        function () { return [ox + A() + slideRight * DX(), oy + A()]; },
        function () { return [ox + A() - B() + slideRight * DX(), oy + A()]; }
      ], C_B2);

      // Carré b² rajouté à la fin, dans le coin haut-droit du carré.
      var addCorner = region(Xi, Yi, Xt, Yt, C_B2);

      /* Étiquettes ---------------------------------------------------------- */
      var lA2 = label(function () { return ox + A() / 2; }, function () { return oy + A() / 2; }, 'a²', '#1e3a8a');
      var sBottomA = label(function () { return ox + A() / 2; }, K(oy - 0.4), 'a', INK);
      var sLeftA = label(K(ox - 0.4), function () { return oy + A() / 2; }, 'a', INK);
      var sBab = label(function () { return ox + (A() - B()) / 2; }, K(oy - 0.4), 'a−b', INK);
      var sBb = label(function () { return ox + A() - B() / 2; }, K(oy - 0.4), 'b', INK);
      var sLab = label(K(ox - 0.4), function () { return oy + (A() - B()) / 2; }, 'a−b', INK);
      var sLb = label(K(ox - 0.4), function () { return oy + A() - B() / 2; }, 'b', INK);
      // Étiquettes portées par les rectangles mobiles.
      var lNegTop = label(function () { return ox + (A() - B()) / 2; },
        function () { return oy + A() - B() / 2 + slideTop * DY(); }, '−ab', '#b91c1c');
      var lCornTop = label(function () { return ox + A() - B() / 2; },
        function () { return oy + A() - B() / 2 + slideTop * DY(); }, 'b²', '#065f46');
      var lNegRight = label(function () { return ox + A() - B() / 2 + slideRight * DX(); },
        function () { return oy + (A() - B()) / 2; }, '−ab', '#b91c1c');
      var lCornRight = label(function () { return ox + A() - B() / 2 + slideRight * DX(); },
        function () { return oy + A() - B() / 2; }, 'b²', '#065f46');
      var lAdd = label(function () { return ox + A() - B() / 2; }, function () { return oy + A() - B() / 2; }, '+b²', '#065f46');
      var lInner = label(function () { return ox + (A() - B()) / 2; }, function () { return oy + (A() - B()) / 2; }, '(a−b)²', '#5b21b6');

      // Légende pas-à-pas (coin haut-droit dégagé du plan).
      var caption = track(board.create('text', [1.1, 4.15, ''],
        { anchorX: 'left', anchorY: 'top', fontSize: 13, color: INK,
          cssStyle: 'max-width:210px;line-height:1.35;font-weight:600',
          fixed: true, visible: false, highlight: false }));
      function cap(txt) { caption.setAttribute({ visible: true }); caption.setText(txt); }

      function hideAll() {
        slideTop = 0; slideRight = 0;
        [pInner, pTL, pBR, pCorner, addCorner, mTop, mTopCorner, mRight, mRightCorner]
          .forEach(function (r) { r.setAttribute({ fillOpacity: 0 }); });
        [mTop, mRight, mTopCorner, mRightCorner, addCorner].forEach(function (r) {
          if (r.borders) r.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: 0 }); });
        });
        if (pInner.borders) pInner.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: 0, strokeColor: C_A2 }); });
        pInner.setAttribute({ fillColor: C_A2 });
        [gH, gV].forEach(function (g) { g.setAttribute({ visible: false, strokeOpacity: 0 }); });
        [lA2, sBottomA, sLeftA, sBab, sBb, sLab, sLb,
         lNegTop, lCornTop, lNegRight, lCornRight, lAdd, lInner]
          .forEach(function (t) { show(t, false); });
        caption.setAttribute({ visible: false });
        board.update();
      }
      hideAll();

      current = {
        play: function () {
          hideAll();
          runSteps([
            // ① Le carré de côté a, d'aire a².
            { dur: 550, step: function (p) {
                cap('Carré de côté a : son aire vaut a²');
                fR(pInner, 0.30, p); fR(pTL, 0.30, p); fR(pBR, 0.30, p); fR(pCorner, 0.30, p);
              },
              after: function () { show(lA2, true); show(sBottomA, true); show(sLeftA, true); } },
            // ② On reporte la longueur b : le côté se partage en (a−b) et b.
            { dur: 650, step: function (p) {
                cap('On reporte la longueur b : le côté se partage en (a − b) et b');
                [gH, gV].forEach(function (g) { g.setAttribute({ visible: true, strokeOpacity: p }); });
              },
              after: function () {
                show(sBottomA, false); show(sLeftA, false);
                show(sBab, true); show(sBb, true); show(sLab, true); show(sLb, true);
              } },
            // ③ On retire le rectangle du haut (a×b) : −ab.
            { dur: 1000, step: function (p) {
                cap('On retire un rectangle a × b : −ab');
                show(lA2, false);
                var fin = Math.min(1, p / 0.30);
                reveal(mTop, 0.28, fin); reveal(mTopCorner, 0.50, fin);
                var sl = Math.max(0, (p - 0.30) / 0.70); slideTop = sl;
                fR(pTL, 0.30, 1 - sl); fR(pCorner, 0.30, 1 - sl);
              },
              after: function () {
                slideTop = 1; fR(pTL, 0.30, 0); fR(pCorner, 0.30, 0);
                show(lNegTop, true); show(lCornTop, true);
              } },
            // ④ On retire le rectangle de droite (a×b) : encore −ab.
            { dur: 1000, step: function (p) {
                cap('On retire l’autre rectangle a × b : encore −ab');
                var fin = Math.min(1, p / 0.30);
                reveal(mRight, 0.28, fin); reveal(mRightCorner, 0.50, fin);
                var sl = Math.max(0, (p - 0.30) / 0.70); slideRight = sl;
                fR(pBR, 0.30, 1 - sl);
              },
              after: function () {
                slideRight = 1; fR(pBR, 0.30, 0);
                show(lNegRight, true); show(lCornRight, true);
              } },
            // ⑤ Le coin b² a été enlevé deux fois (un dans chaque rectangle).
            { dur: 900, step: function (p) {
                cap('Attention : le carré b² a été retiré deux fois !');
                var pulse = 0.42 + 0.20 * Math.abs(Math.sin(p * Math.PI * 2));
                mTopCorner.setAttribute({ fillOpacity: pulse });
                mRightCorner.setAttribute({ fillOpacity: pulse });
              },
              after: function () {
                mTopCorner.setAttribute({ fillOpacity: 0.50 });
                mRightCorner.setAttribute({ fillOpacity: 0.50 });
              } },
            // ⑥ On rajoute donc une fois b².
            { dur: 700, step: function (p) {
                cap('On rajoute donc une fois b² : + b²');
                reveal(addCorner, 0.50, p);
              },
              after: function () { show(lAdd, true); } },
            // ⑦ Il reste (a−b)² = a² − 2ab + b².
            { dur: 700, step: function (p) {
                cap('Il reste (a − b)² = a² − 2ab + b²');
                pInner.setAttribute({ fillColor: C_RES, fillOpacity: 0.30 + 0.16 * p });
                if (pInner.borders) pInner.borders.forEach(function (b) {
                  b.setAttribute({ strokeColor: C_RES, strokeWidth: 2.5, strokeOpacity: p });
                });
              },
              after: function () { show(lInner, true); } }
          ]);
        },
        reset: hideAll
      };
    }

    /* ==================================================================== */
    /* Identité 3 — (a + b)(a − b) = a² − b²  (réarrangement)                 */
    /* ==================================================================== */
    function buildProd() {
      clearFigure();

      /* Idée : on part du rectangle (a+b)(a−b) et on le rassemble dans le carré a².
       * Ce rectangle = une pièce a×(a−b) DANS le carré (en bas)
       *              + une pièce b×(a−b) qui DÉPASSE à droite.
       * La pièce qui dépasse, pivotée de 90°, comble la bande du haut à gauche ;
       * il reste alors un trou b² en haut à droite → l'aire colorée vaut a²−b².
       * Enfin un carré b² (autre couleur) coulisse dans le trou pour compléter a². */
      var sMove = 0;   // 0 → 1 : déplacement + rotation de la pièce qui dépasse
      var sFill = 0;   // 0 → 1 : glissement du carré b² dans le trou

      function fR(pg, ft, p) { pg.setAttribute({ fillOpacity: ft * p }); }

      // Carré de côté a — référence en pointillés (bord gris, sans remplissage).
      var sq = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A(); }, '#000', '#94a3b8');
      if (sq.borders) sq.borders.forEach(function (b) { b.setAttribute({ dash: 2 }); });

      // Pièce L (fixe) : partie du rectangle située DANS le carré, a × (a−b).
      var pL = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A() - B(); }, C_A2);

      // Pièce R (mobile) : partie qui DÉPASSE, b × (a−b) ; se déplace et pivote
      // de 90° pour venir se coucher dans la bande haute gauche, (a−b) × b.
      function rC(sx, sy) {
        return function () {
          var Av = A(), Bv = B();
          var hw = Bv / 2, hh = (Av - Bv) / 2;
          var c0x = ox + Av + Bv / 2, c0y = oy + (Av - Bv) / 2;   // départ (à droite)
          var c1x = ox + (Av - Bv) / 2, c1y = oy + Av - Bv / 2;   // arrivée (bande haute gauche)
          var cx = c0x + (c1x - c0x) * sMove, cy = c0y + (c1y - c0y) * sMove;
          var th = (Math.PI / 2) * sMove;
          var lx = sx * hw, ly = sy * hh;
          return [cx + lx * Math.cos(th) - ly * Math.sin(th),
                  cy + lx * Math.sin(th) + ly * Math.cos(th)];
        };
      }
      var pR = polyXY([rC(-1, -1), rC(1, -1), rC(1, 1), rC(-1, 1)], C_A2);

      // Trou b² (haut-droite du carré) : contour vert tireté, révélé après la rotation.
      var hole = region(function () { return ox + A() - B(); }, function () { return oy + A() - B(); },
        function () { return ox + A(); }, function () { return oy + A(); }, '#000', C_B2);
      if (hole.borders) hole.borders.forEach(function (b) { b.setAttribute({ dash: 2 }); });

      // Carré b² (autre couleur) qui coulisse depuis la droite jusque dans le trou.
      var pB2 = region(
        function () { return ox + A() - B() + (1 - sFill) * (B() + 1.2); },
        function () { return oy + A() - B(); },
        function () { return ox + A() + (1 - sFill) * (B() + 1.2); },
        function () { return oy + A(); }, C_B2);

      /* Étiquettes ---------------------------------------------------------- */
      var lBotA = label(function () { return ox + A() / 2; }, K(oy - 0.4), 'a', INK);
      var lBotB = label(function () { return ox + A() + B() / 2; }, K(oy - 0.4), 'b', INK);      // +b en largeur
      var lLeftA = label(K(ox - 0.4), function () { return oy + A() / 2; }, 'a', INK);
      var lLeftAB = label(K(ox - 0.4), function () { return oy + (A() - B()) / 2; }, 'a−b', INK); // hauteur colorée
      var lLeftB = label(K(ox - 0.4), function () { return oy + A() - B() / 2; }, 'b', INK);      // −b en hauteur
      var lRect = label(function () { return ox + (A() + B()) / 2; }, function () { return oy + (A() - B()) / 2; }, '(a+b)(a−b)', '#1e3a8a');
      var lGnomon = label(function () { return ox + A() / 2; }, function () { return oy + (A() - B()) / 2; }, 'a²−b²', '#1e3a8a');
      var lB2 = label(function () { return ox + A() - B() / 2; }, function () { return oy + A() - B() / 2; }, 'b²', '#065f46');

      var caption = track(board.create('text', [1.1, 4.15, ''],
        { anchorX: 'left', anchorY: 'top', fontSize: 13, color: INK,
          cssStyle: 'max-width:210px;line-height:1.35;font-weight:600',
          fixed: true, visible: false, highlight: false }));
      function cap(txt) { caption.setAttribute({ visible: true }); caption.setText(txt); }

      function hideAll() {
        sMove = 0; sFill = 0;
        [sq, pL, pR, pB2, hole].forEach(function (o) { o.setAttribute({ fillOpacity: 0 }); });
        [sq, pL, pR, pB2, hole].forEach(function (o) {
          if (o.borders) o.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: 0 }); });
        });
        [lBotA, lBotB, lLeftA, lLeftAB, lLeftB, lRect, lGnomon, lB2]
          .forEach(function (t) { show(t, false); });
        caption.setAttribute({ visible: false });
        board.update();
      }
      hideAll();

      current = {
        play: function () {
          hideAll();
          runSteps([
            // ① Carré de côté a (référence en pointillés).
            { dur: 600, step: function (p) {
                cap('Carré de côté a : notre référence (en pointillés)');
                reveal(sq, 0, p);
              },
              after: function () { show(lBotA, true); show(lLeftA, true); } },
            // ② +b en largeur, −b en hauteur → rectangle (a+b)(a−b) coloré.
            { dur: 750, step: function (p) {
                cap('On ajoute b en largeur et on retire b en hauteur : le rectangle (a + b)(a − b)');
                reveal(pL, 0.34, p); reveal(pR, 0.34, p);
              },
              after: function () {
                show(lLeftA, false);
                show(lBotB, true); show(lLeftAB, true); show(lLeftB, true); show(lRect, true);
              } },
            // ③ On déplace + pivote la pièce qui dépasse (même surface, même couleur).
            { dur: 1500, step: function (p) {
                cap('On déplace le rectangle qui dépasse et on le fait pivoter : même surface, même couleur');
                show(lRect, false); show(lBotB, false);
                sMove = p;
              },
              after: function () { sMove = 1; } },
            // ④ Il reste le carré a² privé d'un carré b².
            { dur: 600, step: function (p) {
                cap('Il reste le carré de côté a privé d’un carré b² : l’aire colorée vaut a² − b²');
                reveal(hole, 0, p);
              },
              after: function () { show(lGnomon, true); } },
            // ⑤ Le carré b² (autre couleur) coulisse dans le trou.
            { dur: 1000, step: function (p) {
                cap('Le carré b² vient combler le trou : (a + b)(a − b) = a² − b²');
                reveal(pB2, 0.42, Math.min(1, p * 1.3));
                sFill = p;
              },
              after: function () { sFill = 1; reveal(pB2, 0.42, 1); show(lB2, true); } }
          ]);
        },
        reset: hideAll
      };
    }

    var BUILD = { sum: buildSum, diff: buildDiff, prod: buildProd };

    /* ==================================================================== */
    /* Panneau : identité (LaTeX) + vérification numérique                   */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.style.cssText = 'margin:.8rem 0;padding:.8rem 1rem;border:1px solid #e2e8f0;' +
      'border-radius:10px;background:#f8fafc;max-width:640px';
    panel.innerHTML =
      '<div class="ri-id" style="font-size:1.05rem;margin-bottom:.4rem"></div>' +
      '<div class="ri-num" style="font-family:ui-monospace,Menlo,monospace;font-size:.95rem;color:#334155;line-height:1.6"></div>';
    mv.extras.appendChild(panel);
    var idEl = panel.querySelector('.ri-id');
    var numEl = panel.querySelector('.ri-num');

    var IDENTITY = {
      sum: '\\((a+b)^2 = a^2 + 2ab + b^2\\)',
      diff: '\\((a-b)^2 = a^2 - 2ab + b^2\\)',
      prod: '\\((a+b)(a-b) = a^2 - b^2\\)'
    };
    function updateIdentity() { idEl.innerHTML = IDENTITY[mode]; mv.typeset(); }

    // Nombre en écriture française (virgule, zéros inutiles retirés).
    function f(x) { return (Math.round(x * 100) / 100).toString().replace('.', ','); }
    function updatePanel() {
      var a = A(), b = B(), a2 = a * a, b2 = b * b, ab = a * b, html = '';
      if (mode === 'sum') {
        html = '(' + f(a) + ' + ' + f(b) + ')² = ' + f(a) + '² + 2×' + f(a) + '×' + f(b) + ' + ' + f(b) + '²<br>' +
               f(a + b) + '² = ' + f(a2) + ' + ' + f(2 * ab) + ' + ' + f(b2) +
               ' = <strong>' + f((a + b) * (a + b)) + '</strong>';
      } else if (mode === 'diff') {
        html = '(' + f(a) + ' − ' + f(b) + ')² = ' + f(a) + '² − 2×' + f(a) + '×' + f(b) + ' + ' + f(b) + '²<br>' +
               f(a - b) + '² = ' + f(a2) + ' − ' + f(2 * ab) + ' + ' + f(b2) +
               ' = <strong>' + f((a - b) * (a - b)) + '</strong>';
      } else {
        html = '(' + f(a) + ' + ' + f(b) + ')(' + f(a) + ' − ' + f(b) + ') = ' + f(a) + '² − ' + f(b) + '²<br>' +
               f(a + b) + ' × ' + f(a - b) + ' = ' + f(a2) + ' − ' + f(b2) +
               ' = <strong>' + f(a2 - b2) + '</strong>';
      }
      if (mode !== 'sum' && bVal > aVal - 0.5) {
        html += '<br><span style="color:#b45309">b est limité à a − 0,5 (il faut a &gt; b)</span>';
      }
      numEl.innerHTML = html;
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var modeBtns = {};
    function setMode(key) {
      mode = key;
      Object.keys(modeBtns).forEach(function (k) { modeBtns[k].classList.toggle('active', k === key); });
      BUILD[key]();
      updateIdentity();
      updatePanel();
      board.update();
      current.play();
    }

    var refs = mv.addControls([
      { type: 'button', id: 'sum', label: '(a+b)²', onClick: function () { setMode('sum'); } },
      { type: 'button', id: 'diff', label: '(a−b)²', onClick: function () { setMode('diff'); } },
      { type: 'button', id: 'prod', label: '(a+b)(a−b)', onClick: function () { setMode('prod'); } },
      { type: 'button', id: 'play', label: '▶ Animer', onClick: function () { if (current) current.play(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { if (current) current.reset(); board.update(); } },
      { type: 'slider', id: 'a', label: 'a', min: 1, max: 4, step: 0.5, value: 3,
        onInput: function (v) { aVal = v; board.update(); updatePanel(); } },
      { type: 'slider', id: 'b', label: 'b', min: 0.5, max: 2.5, step: 0.5, value: 2,
        onInput: function (v) { bVal = v; board.update(); updatePanel(); } }
    ]);
    modeBtns.sum = refs.sum;
    modeBtns.diff = refs.diff;
    modeBtns.prod = refs.prod;

    // Démarrage sur (a+b)².
    setMode('sum');
  }
});
