/*
 * Découvrir les vecteurs (2nde) — direction, sens, longueur, et égalité.
 *
 * Un vecteur est défini par TROIS caractéristiques :
 *   - sa DIRECTION : l'inclinaison de la droite qui le porte ;
 *   - son SENS     : indiqué par la pointe de la flèche ;
 *   - sa LONGUEUR  : la distance entre l'origine et l'extrémité (sa norme).
 *
 * Deux vecteurs sont ÉGAUX s'ils ont la même direction, le même sens ET la même
 * longueur — autrement dit les mêmes coordonnées. La position dans le plan n'a
 * aucune importance : un même vecteur peut être dessiné n'importe où.
 *
 * Figure :
 *   - AB (bleu)  : le vecteur étudié u = AB. On déplace A et B pour le changer.
 *   - CD (vert)  : D = C + u, donc CD = AB PAR CONSTRUCTION (déplace C : la
 *                  copie égale se pose ailleurs, toujours identique).
 *   - EF (orange): E et F libres, réglés au départ DIFFÉRENTS de u.
 *   - un VECTEUR MOBILE violet (poignée + boutons) : posé sur C il recouvre
 *     exactement CD (égaux) ; posé sur E, sa pointe tombe en E+u, PAS sur F,
 *     ce qui montre en direct que EF n'est pas le même vecteur.
 */
MathsView.register({
  id: 'vecteurs-egalite',
  title: 'Vecteurs : direction, sens, longueur',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  theme: 'Vecteurs — définition et égalité de deux vecteurs',
  description:
    'Un <strong>vecteur</strong> est déterminé par trois choses : sa ' +
    '<strong>direction</strong> (l\'inclinaison de la droite), son ' +
    '<strong>sens</strong> (la pointe de la flèche) et sa <strong>longueur</strong>. ' +
    'Deux vecteurs sont <strong>égaux</strong> s\'ils partagent ces trois caractéristiques — ' +
    'peu importe l\'endroit où on les dessine.' +
    '<br>Ici <strong>D = C + \\(\\vec{AB}\\)</strong>, donc \\(\\vec{CD}=\\vec{AB}\\) toujours. ' +
    'Attrape le <strong>vecteur violet</strong> (ou les boutons) et pose-le sur <strong>C</strong> ' +
    'puis sur <strong>E</strong> : sur C il se superpose à \\(\\vec{CD}\\) ; sur E, sa pointe ne ' +
    'tombe pas sur F, donc \\(\\vec{EF}\\neq\\vec{AB}\\).' +
    '<br><em>Déplace A, B (le vecteur), C (la copie égale), E et F (l\'autre vecteur).</em>',
  notes:
    '<ul>' +
    '<li>Le vecteur \\(\\vec{AB}\\) a pour <strong>coordonnées</strong> ' +
    '\\((x_B-x_A\\,;\\,y_B-y_A)\\).</li>' +
    '<li>\\(\\vec{AB}=\\vec{CD}\\) <strong>si et seulement si</strong> ils ont les mêmes ' +
    'coordonnées, ce qui revient à dire que <strong>ABDC est un parallélogramme</strong>.</li>' +
    '<li>Passer de \\(\\vec{AB}\\) à \\(\\vec{CD}\\), c\'est faire <strong>glisser</strong> la ' +
    'flèche (une translation) sans la tourner ni l\'étirer : c\'est le même vecteur.</li>' +
    '<li>Si une seule des trois caractéristiques change (direction, sens ou longueur), ' +
    'ce n\'est <strong>plus le même vecteur</strong>.</li>' +
    '</ul>',
  board: { boundingbox: [-7.5, 5.6, 7.5, -6.4], keepaspectratio: true, axis: true,
           grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_AB = '#2563eb';   // vecteur étudié u = AB (bleu)
    var C_CD = '#0d9488';   // copie égale CD (vert)
    var C_EF = '#ea580c';   // autre vecteur EF (orange)
    var C_MOB = '#7c3aed';  // vecteur mobile (violet)
    var INK = '#334155';
    var GREY = '#94a3b8';

    function fmt(x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); }
    function near(P, Q) { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()) < 0.08; }

    /* ==================================================================== */
    /* Le vecteur u = AB (A et B déplaçables)                                */
    /* ==================================================================== */
    var A = board.create('point', [-6, -3], { name: 'A', size: 4, color: C_AB, label: { offset: [-14, -4] } });
    var B = board.create('point', [-3, -2], { name: 'B', size: 4, color: C_AB, label: { offset: [8, 6] } });
    function ux() { return B.X() - A.X(); }
    function uy() { return B.Y() - A.Y(); }
    board.create('arrow', [A, B], { strokeColor: C_AB, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* La copie égale CD : D = C + u  ⇒  vecteur CD = vecteur AB              */
    /* ==================================================================== */
    var C = board.create('point', [-1, 1], { name: 'C', size: 4, color: C_CD, label: { offset: [-14, -4] } });
    var D = board.create('point', [function () { return C.X() + ux(); }, function () { return C.Y() + uy(); }],
      { name: 'D', size: 4, color: C_CD, fixed: true, label: { offset: [8, 6] } });
    board.create('arrow', [C, D], { strokeColor: C_CD, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* L'autre vecteur EF (E et F libres, différent de u au départ)          */
    /* ==================================================================== */
    var E = board.create('point', [2, -4], { name: 'E', size: 4, color: C_EF, label: { offset: [-14, -4] } });
    var F = board.create('point', [4, -2], { name: 'F', size: 4, color: C_EF, label: { offset: [8, 6] } });
    board.create('arrow', [E, F], { strokeColor: C_EF, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 } });

    /* ==================================================================== */
    /* Le vecteur mobile violet : même u, posé où on veut                    */
    /* ==================================================================== */
    var M = board.create('point', [-2, 3], {
      name: '', size: 6, color: C_MOB, strokeColor: '#4c1d95', strokeWidth: 1,
      face: 'o', layer: 9
    });
    var Mh = board.create('point', [function () { return M.X() + ux(); }, function () { return M.Y() + uy(); }],
      { name: '', size: 2, color: C_MOB, fixed: true, withLabel: false, layer: 9 });
    board.create('arrow', [M, Mh], { strokeColor: C_MOB, strokeWidth: 4.5, lastArrow: { type: 2, size: 8 }, layer: 8 });

    // Trait en pointillés reliant la pointe du vecteur mobile au point F :
    // visible seulement quand le vecteur est posé en E et diffère de EF.
    var gap = board.create('segment', [Mh, F],
      { strokeColor: GREY, strokeWidth: 1.5, dash: 2, visible: false, fixed: true, highlight: false });

    /* ==================================================================== */
    /* Longueurs (étiquettes au milieu de chaque flèche)                     */
    /* ==================================================================== */
    function lenLabel(P, Q, color) {
      return board.create('text', [
        function () { return (P.X() + Q.X()) / 2 - 0.15 * (Q.Y() - P.Y()) / (Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1); },
        function () { return (P.Y() + Q.Y()) / 2 + 0.15 * (Q.X() - P.X()) / (Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1); },
        function () { return fmt(Math.hypot(Q.X() - P.X(), Q.Y() - P.Y())); }
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: color, cssStyle: 'font-weight:700',
           fixed: true, highlight: false });
    }
    lenLabel(A, B, C_AB);
    lenLabel(E, F, C_EF);

    /* ==================================================================== */
    /* Déplacement du vecteur mobile : aimantation sur A, C ou E             */
    /* ==================================================================== */
    var raf = null;
    function stopTween() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    mv.onCleanup(stopTween);

    function snap() {
      var best = null;
      [A, C, E].forEach(function (T) {
        var dd = Math.hypot(T.X() - M.X(), T.Y() - M.Y());
        if (dd < 0.6 && (best === null || dd < best.d)) best = { x: T.X(), y: T.Y(), d: dd };
      });
      if (best) M.setPosition(JXG.COORDS_BY_USER, [best.x, best.y]);
    }

    M.on('drag', function () { stopTween(); snap(); board.update(); });

    function moveMto(tx, ty) {
      stopTween();
      var sx = M.X(), sy = M.Y(), t0 = null, dur = 650;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;  // easeInOut
        M.setPosition(JXG.COORDS_BY_USER, [sx + (tx - sx) * e, sy + (ty - sy) * e]);
        board.update();
        if (p < 1) raf = requestAnimationFrame(frame); else { raf = null; }
      }
      raf = requestAnimationFrame(frame);
    }

    /* ==================================================================== */
    /* Panneau explicatif                                                   */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    function renderPanel() {
      var uxv = ux(), uyv = uy(), uLen = Math.hypot(uxv, uyv);
      var efx = F.X() - E.X(), efy = F.Y() - E.Y(), efLen = Math.hypot(efx, efy);
      var cross = uxv * efy - uyv * efx, dot = uxv * efx + uyv * efy;
      var TOL = 0.05;
      var parEF = Math.abs(cross) < TOL * (uLen * efLen) + 1e-6;
      var sameDir = parEF && dot > 0;
      var sameLen = Math.abs(uLen - efLen) < TOL * Math.max(uLen, efLen, 1);
      var equalEF = sameDir && sameLen;

      var slot = 'free';
      if (near(M, A)) slot = 'AB'; else if (near(M, C)) slot = 'CD'; else if (near(M, E)) slot = 'EF';

      gap.setAttribute({ visible: slot === 'EF' && !equalEF });

      // Notations colorées (pas de LaTeX ici : ce panneau se redessine à chaque
      // frame de déplacement, on évite de relancer MathJax en continu).
      function vec(name, color) {
        return '<b style="color:' + color + '">' + name + '</b>' +
          '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
      }
      var vAB = vec('AB', C_AB), vCD = vec('CD', C_CD), vEF = vec('EF', C_EF);

      // Message principal selon la position du vecteur mobile.
      var head;
      if (slot === 'CD') {
        head = '<span style="color:' + C_CD + '">✓ Posé sur C, le vecteur violet recouvre ' +
          'exactement ' + vCD + '.</span> Donc ' + vAB + ' = ' + vCD + ' : même direction, ' +
          'même sens, même longueur.';
      } else if (slot === 'AB') {
        head = 'Le vecteur mobile est posé sur son origine : il coïncide avec ' + vAB + '.';
      } else if (slot === 'EF') {
        if (equalEF) {
          head = '<span style="color:' + C_CD + '">Tu as réglé E et F pour que ' + vEF + ' = ' +
            vAB + ' : la pointe tombe pile sur F.</span>';
        } else {
          head = '<span style="color:' + C_EF + '">✗ Posé en E, la pointe du vecteur ne tombe ' +
            '<strong>pas</strong> sur F</span> (voir le pointillé). Donc ' + vEF + ' ≠ ' + vAB +
            ' : ce n\'est pas le même vecteur.';
        }
      } else {
        head = 'Fais glisser le <span style="color:' + C_MOB + '">vecteur violet</span> ' +
          '(ou utilise les boutons) et pose-le sur <strong>C</strong> puis sur <strong>E</strong>.';
      }

      // Comparaison détaillée AB / EF.
      function tag(ok) {
        return ok ? '<span style="color:' + C_CD + ';font-weight:700">même</span>'
                  : '<span style="color:' + C_EF + ';font-weight:700">différente</span>';
      }
      var sensTxt = parEF ? (dot > 0 ? '<span style="color:' + C_CD + ';font-weight:700">même</span>'
                                     : '<span style="color:' + C_EF + ';font-weight:700">opposé</span>')
                          : '<span style="color:var(--ink-soft)">— (directions différentes)</span>';

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_AB + '">Vecteur ' + vAB +
          ' : coordonnées (' + fmt(uxv) + ' ; ' + fmt(uyv) + '), longueur ≈ ' + fmt(uLen) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +
        '<div class="props-label">Comparaison ' + vAB + ' et ' + vEF + '</div>' +
        '<ul class="props-list">' +
          '<li>Direction : ' + tag(parEF) + '</li>' +
          '<li>Sens : ' + sensTxt + '</li>' +
          '<li>Longueur : ' + tag(sameLen) + ' (' + fmt(uLen) + ' contre ' + fmt(efLen) + ')</li>' +
        '</ul>' +
        '<p style="margin:.4rem 0 0;font-weight:700;color:' + (equalEF ? C_CD : C_EF) + '">' +
          vEF + (equalEF ? ' = ' : ' ≠ ') + vAB + '</p>';
    }

    board.on('update', renderPanel);

    /* ==================================================================== */
    /* Boutons                                                              */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'toAB', label: 'Poser sur AB', onClick: function () { moveMto(A.X(), A.Y()); } },
      { type: 'button', id: 'toCD', label: 'Poser sur CD (C)', onClick: function () { moveMto(C.X(), C.Y()); } },
      { type: 'button', id: 'toEF', label: 'Poser sur EF (E)', onClick: function () { moveMto(E.X(), E.Y()); } }
    ]);

    renderPanel();
  }
});
