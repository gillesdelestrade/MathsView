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
      // Cadre = carré de côté a.
      var frame = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A(); }, '#000', INK);
      frameBorder(frame);

      // a² : léger fond bleu sur tout le carré.
      var rWhole = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A(); }, C_A2);
      // Deux bandes ab (haut et droite), qui se chevauchent dans le coin b².
      var stripTop = region(K(ox), function () { return oy + A() - B(); },
        function () { return ox + A(); }, function () { return oy + A(); }, C_AB);
      var stripRight = region(function () { return ox + A() - B(); }, K(oy),
        function () { return ox + A(); }, function () { return oy + A(); }, C_AB);
      // Coin b² (le chevauchement, retiré deux fois → rajouté).
      var corner = region(function () { return ox + A() - B(); }, function () { return oy + A() - B(); },
        function () { return ox + A(); }, function () { return oy + A(); }, C_B2);
      // Carré résultat (a−b)², en bas à gauche.
      var inner = region(K(ox), K(oy),
        function () { return ox + A() - B(); }, function () { return oy + A() - B(); }, C_RES);

      var lWhole = label(function () { return ox + A() / 2; }, function () { return oy + A() - B() - 0.35; }, 'a²', '#1e3a8a');
      var lTop = label(function () { return ox + (A() - B()) / 2; }, function () { return oy + A() - B() / 2; }, 'ab', '#92400e');
      var lRight = label(function () { return ox + A() - B() / 2; }, function () { return oy + (A() - B()) / 2; }, 'ab', '#92400e');
      var lCorner = label(function () { return ox + A() - B() / 2; }, function () { return oy + A() - B() / 2; }, 'b²', '#065f46');
      var lInner = label(function () { return ox + (A() - B()) / 2; }, function () { return oy + (A() - B()) / 2; }, '(a−b)²', '#5b21b6');

      // Côtés : a = (a−b) + b sur les deux bords.
      var sBab = label(function () { return ox + (A() - B()) / 2; }, K(oy - 0.4), 'a−b', INK);
      var sBb = label(function () { return ox + A() - B() / 2; }, K(oy - 0.4), 'b', INK);
      var sLab = label(K(ox - 0.4), function () { return oy + (A() - B()) / 2; }, 'a−b', INK);
      var sLb = label(K(ox - 0.4), function () { return oy + A() - B() / 2; }, 'b', INK);

      function hideAll() {
        [rWhole, stripTop, stripRight, corner, inner].forEach(function (r) { reveal(r, 0, 0); });
        [lWhole, lTop, lRight, lCorner, lInner, sBab, sBb, sLab, sLb].forEach(function (t) { show(t, false); });
      }
      hideAll();

      current = {
        play: function () {
          hideAll();
          runSteps([
            { dur: 380, step: function (p) { reveal(rWhole, 0.14, p); },
              after: function () { show(lWhole, true); show(sBab, true); show(sBb, true); show(sLab, true); show(sLb, true); } },
            { dur: 560, step: function (p) { reveal(stripTop, 0.42, p); reveal(stripRight, 0.42, p); },
              after: function () { show(lTop, true); show(lRight, true); } },
            { dur: 420, step: function (p) { reveal(corner, 0.55, p); },
              after: function () { show(lCorner, true); } },
            { dur: 420, step: function (p) { reveal(inner, 0.42, p); },
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
      var sVal = 0;   // avancement du réarrangement (0 = carré troué, 1 = rectangle)

      // Pièce 1 (fixe) : bande du bas, a large × (a−b) haute.
      var P1 = region(K(ox), K(oy),
        function () { return ox + A(); }, function () { return oy + A() - B(); }, C_A2);
      // Pièce 2 (mobile) : rectangle (a−b) large × b haut, déplacé et pivoté.
      function p2c(sx, sy) {
        return function () {
          var Av = A(), Bv = B();
          var hw = (Av - Bv) / 2, hh = Bv / 2;
          var c0x = ox + (Av - Bv) / 2, c0y = oy + (Av - Bv) + Bv / 2;   // position départ
          var c1x = ox + Av + Bv / 2, c1y = oy + (Av - Bv) / 2;          // position arrivée
          var cx = c0x + (c1x - c0x) * sVal, cy = c0y + (c1y - c0y) * sVal;
          var th = (Math.PI / 2) * sVal;
          var lx = sx * hw, ly = sy * hh;
          return [cx + lx * Math.cos(th) - ly * Math.sin(th),
                  cy + lx * Math.sin(th) + ly * Math.cos(th)];
        };
      }
      var P2 = polyXY([p2c(-1, -1), p2c(1, -1), p2c(1, 1), p2c(-1, 1)], C_RES);

      // Coin b² retiré (état départ) : contour rouge tireté.
      var hole = region(function () { return ox + A() - B(); }, function () { return oy + A() - B(); },
        function () { return ox + A(); }, function () { return oy + A(); }, '#000', C_NEG);
      if (hole.borders) hole.borders.forEach(function (b) { b.setAttribute({ dash: 2 }); });

      // Contour du rectangle final (a+b)×(a−b) : guide tireté gris (état arrivée).
      var target = region(K(ox), K(oy),
        function () { return ox + A() + B(); }, function () { return oy + A() - B(); }, '#000', '#94a3b8');
      if (target.borders) target.borders.forEach(function (b) { b.setAttribute({ dash: 2 }); });

      var lHole = label(function () { return ox + A() - B() / 2; }, function () { return oy + A() - B() / 2; }, 'b²', C_NEG);
      var lArea = label(function () { return ox + A() / 2; }, function () { return oy + (A() - B()) / 2; }, 'a² − b²', '#1e3a8a');

      // Côtés.
      var sWa = label(function () { return ox + A() / 2; }, K(oy - 0.4), 'a', INK);            // largeur départ
      var sWab = label(function () { return ox + (A() + B()) / 2; }, K(oy - 0.4), 'a+b', INK); // largeur arrivée
      var sHab = label(K(ox - 0.4), function () { return oy + (A() - B()) / 2; }, 'a−b', INK); // hauteur (constante)

      function paint() {
        reveal(P1, 0.34, 1);
        reveal(P2, 0.42, 1);
        // Coin retiré et étiquettes « départ » : présents tant que sVal < 0,5.
        var early = sVal < 0.5 ? 1 : 0;
        if (hole.borders) hole.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: (1 - sVal) }); });
        show(lHole, early === 1);
        show(sWa, early === 1);
        show(lArea, early === 1);
        // Cible et étiquettes « arrivée » : à partir de sVal ≥ 0,5.
        var late = sVal >= 0.5 ? 1 : 0;
        if (target.borders) target.borders.forEach(function (b) { b.setAttribute({ strokeOpacity: sVal }); });
        show(sWab, late === 1);
        show(sHab, true);
      }

      function reset() { sVal = 0; paint(); }
      reset();

      current = {
        play: function () {
          sVal = 0; paint();
          animate(1500, function (p) { sVal = p; paint(); }, function () { sVal = 1; paint(); });
        },
        reset: reset
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
