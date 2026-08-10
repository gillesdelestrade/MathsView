/*
 * Multiplier un vecteur par un nombre réel — colinéarité (2nde).
 *
 * Le produit d'un vecteur u par un réel k est le vecteur k·u :
 *   - même DIRECTION que u (c'est ce qui fait la colinéarité) ;
 *   - même SENS que u si k > 0, sens OPPOSÉ si k < 0 ;
 *   - LONGUEUR |k| × ||u||   (et 0·u = vecteur nul).
 * En coordonnées : si u(x ; y) alors k·u (kx ; ky).
 *
 * Deux vecteurs sont COLINÉAIRES s'il existe un réel k tel que v = k·u :
 * ils portent alors des droites parallèles. Le test pratique est le
 * déterminant : x·y' − y·x' = 0.
 *
 * Figure :
 *   - AB (bleu)    : le vecteur u. A et B se déplacent (extrémités, sens,
 *                    longueur) ; la poignée carrée au milieu translate la
 *                    flèche entière sans la modifier.
 *   - CD (violet)  : le vecteur v = k·u, tracé depuis C. C (ou la poignée)
 *                    déplace la flèche ; D se déplace le long de la droite et
 *                    règle k directement à la souris.
 *   - Les deux droites pointillées restent PARALLÈLES quoi qu'on fasse.
 *   - Les graduations sur v montrent combien de fois u tient dans k·u.
 */
MathsView.register({
  id: 'vecteurs-colinearite',
  title: 'Multiplier un vecteur par un nombre',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  exercices: ['vec-colin'],
  theme: 'Vecteurs — produit par un réel et colinéarité',
  description:
    'Multiplier un vecteur \\(\\vec{u}\\) par un nombre réel \\(k\\) donne un vecteur ' +
    '\\(k\\vec{u}\\) qui garde la <strong>même direction</strong> : sa longueur est ' +
    '\\(|k|\\times\\|\\vec{u}\\|\\) et son sens est celui de \\(\\vec{u}\\) si \\(k>0\\). ' +
    'Deux vecteurs liés par une telle relation sont <strong>colinéaires</strong> : ' +
    'les droites qui les portent sont <strong>parallèles</strong>.' +
    '<br>Ici \\(\\vec{CD}=k\\,\\vec{AB}\\). Règle \\(k\\) avec le curseur (de 0 à 10), ' +
    'déplace les deux flèches avec la souris : elles restent <em>toujours</em> parallèles.' +
    '<br><em>Déplace A et B (direction, sens, longueur de \\(\\vec{u}\\)), la poignée ' +
    'carrée (translation), C (position de \\(k\\vec{u}\\)) et D (règle \\(k\\) directement).</em>',
  notes:
    '<ul>' +
    '<li><strong>Définition.</strong> Pour \\(k\\neq 0\\) et \\(\\vec{u}\\neq\\vec{0}\\), le vecteur ' +
    '\\(k\\vec{u}\\) a la <strong>même direction</strong> que \\(\\vec{u}\\), le ' +
    '<strong>même sens</strong> si \\(k>0\\) (sens opposé si \\(k<0\\)) et pour longueur ' +
    '\\(\\|k\\vec{u}\\|=|k|\\times\\|\\vec{u}\\|\\). De plus \\(0\\,\\vec{u}=\\vec{0}\\).</li>' +
    '<li><strong>Coordonnées.</strong> Si \\(\\vec{u}\\,(x\\,;\\,y)\\) alors ' +
    '\\(k\\vec{u}\\,(kx\\,;\\,ky)\\) : on multiplie chaque coordonnée par \\(k\\).</li>' +
    '<li><strong>Colinéarité.</strong> \\(\\vec{u}\\) et \\(\\vec{v}\\) sont colinéaires ' +
    's\'il existe un réel \\(k\\) tel que \\(\\vec{v}=k\\vec{u}\\) (avec \\(\\vec{u}\\neq\\vec{0}\\)). ' +
    'Le <strong>vecteur nul est colinéaire à tout vecteur</strong>.</li>' +
    '<li><strong>Test du déterminant.</strong> \\(\\vec{u}\\,(x\\,;\\,y)\\) et ' +
    '\\(\\vec{v}\\,(x\'\\,;\\,y\')\\) sont colinéaires <strong>si et seulement si</strong> ' +
    '\\(xy\'-yx\'=0\\).</li>' +
    '<li><strong>À quoi ça sert.</strong> \\(A\\), \\(B\\), \\(C\\) sont <strong>alignés</strong> ' +
    'si \\(\\vec{AB}\\) et \\(\\vec{AC}\\) sont colinéaires ; les droites \\((AB)\\) et \\((CD)\\) ' +
    'sont <strong>parallèles</strong> si \\(\\vec{AB}\\) et \\(\\vec{CD}\\) sont colinéaires.</li>' +
    '</ul>',
  board: { boundingbox: [-10, 7.5, 10, -7.5], keepaspectratio: true, axis: true,
           grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_U = '#2563eb';     // vecteur u = AB (bleu)
    var C_V = '#7c3aed';     // vecteur v = k·u = CD (violet)
    var C_LINE = '#c7d2fe';  // droites support (pointillés)
    var C_OK = '#0d9488';    // vert « c'est vérifié »
    var GREY = '#94a3b8';

    var STEP = 0.5;          // pas de la grille sur lequel A, B et C s'alignent

    function fmt(x, n) {
      var p = Math.pow(10, n == null ? 1 : n);
      var v = Math.round(x * p) / p;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('.', ',');
    }

    /* ==================================================================== */
    /* État : le coefficient k                                              */
    /* ==================================================================== */
    var K = 3;               // valeur absolue du coefficient (curseur 0 → 10)
    var NEG = false;         // case « coefficient opposé » : k = −K
    function coef() { return NEG ? -K : K; }
    function sgn() { return NEG ? -1 : 1; }

    var refs = null;         // contrôles (curseur, cases) — remplis plus bas

    /* ==================================================================== */
    /* Le vecteur u = AB                                                    */
    /* ==================================================================== */
    var A = board.create('point', [-8, -1], {
      name: 'A', size: 4, color: C_U, label: { offset: [-14, -6] },
      snapToGrid: true, snapSizeX: STEP, snapSizeY: STEP
    });
    var B = board.create('point', [-7, -0.5], {
      name: 'B', size: 4, color: C_U, label: { offset: [8, 6] },
      snapToGrid: true, snapSizeX: STEP, snapSizeY: STEP
    });
    function ux() { return B.X() - A.X(); }
    function uy() { return B.Y() - A.Y(); }
    function un2() { return ux() * ux() + uy() * uy(); }
    function ulen() { return Math.sqrt(un2()); }

    // Droite support de u (direction commune aux deux vecteurs).
    var lineU = board.create('line', [A, B], {
      strokeColor: C_LINE, strokeWidth: 2, dash: 2, fixed: true, highlight: false, layer: 2
    });
    board.create('arrow', [A, B], {
      strokeColor: C_U, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 }, layer: 7
    });

    /* Poignée de translation de u : déplace A et B ensemble ---------------- */
    var Hu = board.create('point', [(A.X() + B.X()) / 2, (A.Y() + B.Y()) / 2], {
      name: '', face: '[]', size: 4, color: '#93c5fd', strokeColor: C_U, strokeWidth: 1,
      withLabel: false, layer: 9
    });
    function placeHu() {
      Hu.setPosition(JXG.COORDS_BY_USER, [(A.X() + B.X()) / 2, (A.Y() + B.Y()) / 2]);
    }
    Hu.on('drag', function () {
      // On translate d'un nombre entier de pas de grille pour que A et B
      // restent sur les demi-unités (coordonnées lisibles dans le panneau).
      var mx = (A.X() + B.X()) / 2, my = (A.Y() + B.Y()) / 2;
      var dx = Math.round((Hu.X() - mx) / STEP) * STEP;
      var dy = Math.round((Hu.Y() - my) / STEP) * STEP;
      A.setPosition(JXG.COORDS_BY_USER, [A.X() + dx, A.Y() + dy]);
      B.setPosition(JXG.COORDS_BY_USER, [B.X() + dx, B.Y() + dy]);
      placeHu();
      syncD();
      board.update();
    });

    /* ==================================================================== */
    /* Le vecteur v = k·u, tracé depuis C                                    */
    /* ==================================================================== */
    var C = board.create('point', [-6, -6], {
      name: 'C', size: 4, color: C_V, label: { offset: [-14, -6] },
      snapToGrid: true, snapSizeX: STEP, snapSizeY: STEP, layer: 8
    });
    // Point auxiliaire invisible : sert à définir la droite support de v même
    // quand k = 0 (D est alors confondu avec C).
    var Cu = board.create('point', [function () { return C.X() + ux(); },
                                    function () { return C.Y() + uy(); }],
      { visible: false, fixed: true, withLabel: false });
    var lineV = board.create('line', [C, Cu], {
      strokeColor: C_LINE, strokeWidth: 2, dash: 2, fixed: true, highlight: false, layer: 2
    });

    // D est LIBRE : on peut l'attraper pour régler k à la souris. Il est
    // reprojeté sur la droite (et donc sur C + k·u) à chaque manipulation.
    var D = board.create('point', [C.X() + 3 * ux(), C.Y() + 3 * uy()], {
      name: 'D', size: 4, color: C_V, label: { offset: [10, 6] }, layer: 10
    });
    var arrowV = board.create('arrow', [C, D], {
      strokeColor: C_V, strokeWidth: 3.5, lastArrow: { type: 2, size: 7 }, layer: 7
    });

    function syncD() {
      var k = coef();
      D.setPosition(JXG.COORDS_BY_USER, [C.X() + k * ux(), C.Y() + k * uy()]);
    }

    // Régler k en tirant D : on projette D sur la droite, on lit le rapport.
    D.on('drag', function () {
      if (un2() < 1e-9) { syncD(); board.update(); return; }
      var t = ((D.X() - C.X()) * ux() + (D.Y() - C.Y()) * uy()) / un2();
      NEG = t < 0;
      if (refs) {
        refs.neg.checked = NEG;
        // Le curseur arrondit tout seul au pas de 0,1 puis met K à jour.
        refs.k.value = Math.min(10, Math.abs(t));
        refs.k.dispatchEvent(new Event('input'));
      } else {
        K = Math.min(10, Math.abs(t));
      }
      syncD();
      board.update();
    });

    /* Poignée de translation de v : déplace C (donc toute la flèche) -------- */
    var Hv = board.create('point', [0, 0], {
      name: '', face: '[]', size: 4, color: '#ddd6fe', strokeColor: C_V, strokeWidth: 1,
      withLabel: false, layer: 9
    });
    function placeHv() {
      Hv.setPosition(JXG.COORDS_BY_USER, [(C.X() + D.X()) / 2, (C.Y() + D.Y()) / 2]);
    }
    placeHv();
    Hv.on('drag', function () {
      var mx = (C.X() + D.X()) / 2, my = (C.Y() + D.Y()) / 2;
      var dx = Math.round((Hv.X() - mx) / STEP) * STEP;
      var dy = Math.round((Hv.Y() - my) / STEP) * STEP;
      C.setPosition(JXG.COORDS_BY_USER, [C.X() + dx, C.Y() + dy]);
      syncD();
      placeHv();
      board.update();
    });

    // Repère du vecteur nul (k = 0 : la flèche se réduit à un point).
    var nullTag = board.create('text', [
      function () { return C.X() + 0.35; },
      function () { return C.Y() + 0.55; },
      function () { return 'vecteur nul'; }
    ], { fontSize: 12, color: C_V, cssStyle: 'font-weight:700', fixed: true,
         highlight: false, visible: false });

    /* Aimantation de C sur A (mêmes origines) ------------------------------ */
    function snapC() {
      if (Math.hypot(C.X() - A.X(), C.Y() - A.Y()) < 0.4) {
        C.setPosition(JXG.COORDS_BY_USER, [A.X(), A.Y()]);
      }
    }

    A.on('drag', function () { placeHu(); syncD(); placeHv(); board.update(); });
    B.on('drag', function () { placeHu(); syncD(); placeHv(); board.update(); });
    C.on('drag', function () { snapC(); syncD(); placeHv(); board.update(); });

    /* ==================================================================== */
    /* Graduations : combien de fois u tient-il dans k·u ?                   */
    /* ==================================================================== */
    var MARKS = [];
    for (var i = 1; i <= 10; i++) {
      (function (i) {
        function bx() { return C.X() + i * sgn() * ux(); }
        function by() { return C.Y() + i * sgn() * uy(); }
        function nx() { return -uy() / (ulen() || 1); }
        function ny() { return ux() / (ulen() || 1); }
        var P1 = board.create('point', [function () { return bx() + 0.22 * nx(); },
                                        function () { return by() + 0.22 * ny(); }],
          { visible: false, fixed: true, withLabel: false });
        var P2 = board.create('point', [function () { return bx() - 0.22 * nx(); },
                                        function () { return by() - 0.22 * ny(); }],
          { visible: false, fixed: true, withLabel: false });
        var seg = board.create('segment', [P1, P2], {
          strokeColor: C_V, strokeWidth: 2, fixed: true, highlight: false,
          visible: false, layer: 8
        });
        var lab = board.create('text', [
          function () { return bx() + 0.48 * nx(); },
          function () { return by() + 0.48 * ny(); },
          function () { return String(i); }
        ], { fontSize: 11, color: C_V, anchorX: 'middle', anchorY: 'middle',
             fixed: true, highlight: false, visible: false, layer: 8 });
        MARKS.push({ seg: seg, lab: lab, shown: false });
      })(i);
    }

    var showMarks = true;
    function updateMarks() {
      var n = showMarks ? Math.floor(K + 1e-9) : 0;
      MARKS.forEach(function (m, idx) {
        var want = (idx + 1) <= n;
        if (want !== m.shown) {
          m.shown = want;
          m.seg.setAttribute({ visible: want });
          m.lab.setAttribute({ visible: want });
        }
      });
    }

    /* ==================================================================== */
    /* Étiquettes des deux flèches                                           */
    /* ==================================================================== */
    function midLabel(P, Q, color, textFn, side) {
      return board.create('text', [
        function () {
          var d = Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1;
          return (P.X() + Q.X()) / 2 - side * 0.45 * (Q.Y() - P.Y()) / d;
        },
        function () {
          var d = Math.hypot(Q.X() - P.X(), Q.Y() - P.Y()) || 1;
          return (P.Y() + Q.Y()) / 2 + side * 0.45 * (Q.X() - P.X()) / d;
        },
        textFn
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: color,
           cssStyle: 'font-weight:800', fixed: true, highlight: false });
    }
    midLabel(A, B, C_U, function () { return 'u'; }, -1);
    midLabel(C, D, C_V, function () {
      return (NEG ? '−' : '') + fmt(K, 1) + ' × u';
    }, -1);

    /* ==================================================================== */
    /* Panneau explicatif                                                   */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    mv.extras.appendChild(panel);

    // Notations colorées en HTML : le panneau se redessine à chaque frame de
    // déplacement, on évite donc de relancer MathJax en continu.
    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }
    var vU = vec('u', C_U), vV = vec('v', C_V);
    var vAB = vec('AB', C_U), vCD = vec('CD', C_V);

    function renderPanel() {
      var k = coef();
      var uxv = ux(), uyv = uy(), uL = ulen();
      var vxv = k * uxv, vyv = k * uyv, vL = Math.abs(k) * uL;

      var det = uxv * vyv - uyv * vxv;
      if (Math.abs(det) < 1e-9) det = 0;

      arrowV.setAttribute({ visible: vL > 0.02 });
      Hv.setAttribute({ visible: vL > 0.9 });
      nullTag.setAttribute({ visible: vL <= 0.02 });
      updateMarks();

      // Sens / longueur selon la valeur de k.
      var effet;
      if (K === 0) {
        effet = '<span style="color:' + C_V + '">k = 0 : ' + vV + ' est le ' +
          '<strong>vecteur nul</strong>. Il est colinéaire à tous les vecteurs.</span>';
      } else if (K === 1) {
        effet = 'k = 1 : ' + vV + (NEG ? ' est l\'<strong>opposé</strong> de ' + vU +
          ' (même longueur, sens contraire).' : ' = ' + vU + ' exactement.');
      } else if (K > 1) {
        effet = vV + ' est ' + fmt(K, 1) + ' fois <strong>plus long</strong> que ' + vU +
          (NEG ? ', et de <strong>sens opposé</strong>.' : ', et de <strong>même sens</strong>.');
      } else {
        effet = vV + ' est <strong>plus court</strong> que ' + vU + ' (' + fmt(K, 1) +
          ' fois sa longueur)' +
          (NEG ? ', et de <strong>sens opposé</strong>.' : ', et de <strong>même sens</strong>.');
      }

      var kTxt = (NEG ? '−' : '') + fmt(K, 1);
      var degenere = uL < 1e-6;

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_V + '">' + vV + ' = ' + kTxt +
          ' × ' + vU + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + effet + '</p>' +
        '<div class="props-label">Coordonnées</div>' +
        '<ul class="props-list">' +
          '<li>' + vU + ' (' + fmt(uxv, 1) + ' ; ' + fmt(uyv, 1) + ')' +
            ' — longueur ≈ ' + fmt(uL, 2) + '</li>' +
          '<li>' + vV + ' = ' + kTxt + ' × (' + fmt(uxv, 1) + ' ; ' + fmt(uyv, 1) + ') = (' +
            fmt(vxv, 2) + ' ; ' + fmt(vyv, 2) + ')' +
            ' — longueur = ' + fmt(Math.abs(k), 1) + ' × ' + fmt(uL, 2) + ' ≈ ' +
            fmt(vL, 2) + '</li>' +
        '</ul>' +
        '<div class="props-label">Colinéarité</div>' +
        '<p style="margin:.2rem 0 .4rem">Déterminant : ' +
          fmt(uxv, 1) + ' × ' + fmt(vyv, 2) + ' − ' + fmt(uyv, 1) + ' × ' + fmt(vxv, 2) +
          ' = <strong style="color:' + C_OK + '">' + fmt(det, 2) + '</strong>' +
          ' <span style="color:' + C_OK + '">✓</span></p>' +
        '<p style="margin:.2rem 0 0;font-weight:700;color:' + (degenere ? GREY : C_OK) + '">' +
          (degenere
            ? 'Place A et B en deux points distincts pour définir une direction.'
            : vU + ' et ' + vV + ' sont colinéaires : les droites (' +
              '<span style="color:' + C_U + '">AB</span>) et (' +
              '<span style="color:' + C_V + '">CD</span>) sont parallèles — ' +
              'et ce, quoi que tu déplaces.') +
        '</p>' +
        '<p style="margin:.45rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          vAB + ' et ' + vCD + ' portent la même direction : c\'est exactement la ' +
          'définition de deux vecteurs colinéaires.</p>';
    }

    board.on('update', renderPanel);

    /* ==================================================================== */
    /* Animation « poser v sur A » (mêmes origines)                          */
    /* ==================================================================== */
    var raf = null;
    function stopTween() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    mv.onCleanup(stopTween);

    function moveCto(tx, ty) {
      stopTween();
      var sx = C.X(), sy = C.Y(), t0 = null, dur = 650;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;  // easeInOut
        C.setPosition(JXG.COORDS_BY_USER, [sx + (tx - sx) * e, sy + (ty - sy) * e]);
        syncD(); placeHv();
        board.update();
        raf = p < 1 ? requestAnimationFrame(frame) : null;
      }
      raf = requestAnimationFrame(frame);
    }

    /* ==================================================================== */
    /* Contrôles                                                            */
    /* ==================================================================== */
    refs = mv.addControls([
      {
        type: 'slider', id: 'k', label: 'k =', min: 0, max: 10, step: 0.1, value: 3,
        onInput: function (val) { K = val; syncD(); placeHv(); board.update(); }
      },
      {
        type: 'checkbox', id: 'neg', label: 'coefficient opposé (−k)', checked: false,
        onChange: function (on) { NEG = on; syncD(); placeHv(); board.update(); }
      },
      {
        type: 'checkbox', id: 'marks', label: 'reports de u', checked: true,
        onChange: function (on) { showMarks = on; board.update(); }
      },
      {
        type: 'checkbox', id: 'lines', label: 'droites support', checked: true,
        onChange: function (on) {
          lineU.setAttribute({ visible: on });
          lineV.setAttribute({ visible: on });
        }
      },
      {
        type: 'button', id: 'same', label: 'Même origine (poser en A)',
        onClick: function () { moveCto(A.X(), A.Y()); }
      },
      {
        type: 'button', id: 'reset', label: 'Réinitialiser',
        onClick: function () {
          stopTween();
          A.setPosition(JXG.COORDS_BY_USER, [-8, -1]);
          B.setPosition(JXG.COORDS_BY_USER, [-7, -0.5]);
          C.setPosition(JXG.COORDS_BY_USER, [-6, -6]);
          NEG = false; refs.neg.checked = false;
          refs.k.value = 3; refs.k.dispatchEvent(new Event('input'));
          placeHu(); syncD(); placeHv();
          board.update();
        }
      }
    ]);

    syncD();
    placeHv();
    renderPanel();
  }
});
