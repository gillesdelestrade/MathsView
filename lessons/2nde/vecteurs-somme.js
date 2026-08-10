/*
 * Somme de deux vecteurs (2nde) — relation de Chasles et parallélogramme.
 *
 * Pour additionner deux vecteurs u et v, on met le second BOUT À BOUT au
 * premier : on translate v pour que son origine vienne sur l'extrémité de u.
 * La somme est alors la flèche qui va de l'origine du premier à l'extrémité
 * du second — c'est la relation de Chasles :
 *
 *      AB + BE = AE      avec BE = CD = v
 *
 * L'animation reprend exactement cette construction :
 *   1. on tire deux vecteurs AU HASARD dans le plan (u = AB, v = CD) ;
 *   2. on fait GLISSER v jusqu'à ce que son origine se pose sur B ;
 *   3. on trace la somme u + v de A jusqu'à E ;
 *   4. (bonus) on referme le PARALLÉLOGRAMME ABEF, qui montre que
 *      v + u = u + v : peu importe l'ordre, on arrive au même point.
 *
 * Tout est fonction des quatre points A, B, C, D : on peut les déplacer à la
 * souris à tout moment, la figure et le calcul des coordonnées suivent.
 */
MathsView.register({
  id: 'vecteurs-somme',
  title: 'Somme de deux vecteurs',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  exercices: ['vec-somme'],
  theme: 'Vecteurs — addition, relation de Chasles, parallélogramme',
  description:
    'Pour additionner deux vecteurs, on les met <strong>bout à bout</strong> : ' +
    'on fait glisser le second pour que son <strong>origine</strong> se pose sur ' +
    'l\'<strong>extrémité</strong> du premier. La somme est la flèche qui va du départ ' +
    'du premier à l\'arrivée du second.' +
    '<br>Clique sur <strong>▶ Animer</strong> pour voir la construction pas à pas ' +
    '(bouton <em>Suivante</em> ou barre espace), et sur <strong>🎲 Nouveaux vecteurs</strong> ' +
    'pour tirer deux nouveaux vecteurs au hasard.' +
    '<br><em>Les points A, B, C et D se déplacent à la souris : la somme se recalcule ' +
    'toute seule.</em>',
  notes:
    '<ul>' +
    '<li><strong>Bout à bout (relation de Chasles).</strong> Pour tous points ' +
    '\\(A\\), \\(B\\), \\(E\\) : \\(\\vec{AB}+\\vec{BE}=\\vec{AE}\\). ' +
    'Le point intermédiaire « disparaît » : c\'est la règle la plus utile du chapitre.</li>' +
    '<li><strong>Coordonnées.</strong> Si \\(\\vec{u}\\,(x\\,;\\,y)\\) et ' +
    '\\(\\vec{v}\\,(x\'\\,;\\,y\')\\), alors \\(\\vec{u}+\\vec{v}\\,(x+x\'\\,;\\,y+y\')\\) : ' +
    'on additionne les coordonnées une à une.</li>' +
    '<li><strong>Règle du parallélogramme.</strong> Si on place \\(\\vec{u}\\) et ' +
    '\\(\\vec{v}\\) à partir du <em>même</em> point \\(A\\), la somme est la ' +
    '<strong>diagonale</strong> du parallélogramme construit sur les deux flèches.</li>' +
    '<li><strong>L\'addition est commutative</strong> : ' +
    '\\(\\vec{u}+\\vec{v}=\\vec{v}+\\vec{u}\\) (les deux chemins du parallélogramme ' +
    'mènent au même point), et \\(\\vec{u}+\\vec{0}=\\vec{u}\\).</li>' +
    '<li><strong>Vecteur opposé.</strong> \\(\\vec{AB}+\\vec{BA}=\\vec{AA}=\\vec{0}\\), ' +
    'donc \\(\\vec{BA}=-\\vec{AB}\\).</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: true, grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_U = '#2563eb';     // vecteur u = AB (bleu)
    var C_V = '#ea580c';     // vecteur v = CD (orange)
    var C_GHOST = '#fdba74'; // v laissé à sa place de départ (orange pâle)
    var C_S = '#0d9488';     // somme u + v (vert)
    var C_PAR = '#94a3b8';   // côtés du parallélogramme (gris)

    function fmt(x) {
      var v = Math.round(x * 10) / 10;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('.', ',');
    }
    // N'appelle setAttribute que si la visibilité change vraiment : la figure
    // est rafraîchie à chaque frame d'animation.
    function show(o, v) {
      v = !!v;
      if (o._mvVis !== v) { o._mvVis = v; o.setAttribute({ visible: v }); }
    }

    /* ==================================================================== */
    /* Avancement des différentes phases de l'animation (0 → 1)              */
    /* ==================================================================== */
    var pU = { v: 1 };    // tracé de u
    var pV = { v: 1 };    // tracé de v
    var tau = { v: 1 };   // glissement de v : origine de C (0) vers B (1)
    var pS = { v: 1 };    // tracé de la somme
    var pP = { v: 1 };    // fermeture du parallélogramme (maître)
    var pPa = { v: 1 };   // ... son 1er côté : A → F (on avance de v)
    var pPb = { v: 1 };   // ... son 2e côté  : F → E (puis de u)
    var showPara = true;  // case « règle du parallélogramme »

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Les quatre points libres : u = AB, v = CD                             */
    /* ==================================================================== */
    var GRID = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };  // coordonnées entières

    function mkPoint(x, y, name, color, off) {
      return board.create('point', [x, y], Object.assign({
        name: name, size: 4, color: color, label: { offset: off, strokeColor: color },
        showInfobox: false
      }, GRID));
    }
    var A = mkPoint(-6, -2, 'A', C_U, [-14, -8]);
    var B = mkPoint(-3, 1, 'B', C_U, [-6, 12]);
    var C = mkPoint(1, -4, 'C', C_V, [-14, -8]);
    var D = mkPoint(5, -3, 'D', C_V, [8, -10]);

    function ux() { return B.X() - A.X(); }
    function uy() { return B.Y() - A.Y(); }
    function vx() { return D.X() - C.X(); }
    function vy() { return D.Y() - C.Y(); }

    // Point invisible défini par deux fonctions de coordonnées.
    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }

    /* ==================================================================== */
    /* Points construits : E = B + v (arrivée), F = A + v (parallélogramme)   */
    /* ==================================================================== */
    var E = board.create('point',
      [function () { return B.X() + vx(); }, function () { return B.Y() + vy(); }],
      { name: 'E', size: 4, color: C_S, fixed: true, showInfobox: false,
        label: { offset: [10, 8], strokeColor: C_S } });
    var F = board.create('point',
      [function () { return A.X() + vx(); }, function () { return A.Y() + vy(); }],
      { name: 'F', size: 3, color: C_PAR, fixed: true, showInfobox: false,
        label: { offset: [-14, 8], strokeColor: C_PAR } });

    /* ==================================================================== */
    /* Flèches « qui poussent » : de P vers P + prog × (dx ; dy)              */
    /* ==================================================================== */
    function arrow(P, dxf, dyf, prog, style) {
      var tip = pt(function () { return P.X() + prog.v * dxf(); },
                   function () { return P.Y() + prog.v * dyf(); });
      var a = board.create('arrow', [P, tip], Object.assign({
        strokeWidth: 3.5, lastArrow: { type: 2, size: 7 }, highlight: false, layer: 7
      }, style));
      return { a: a, tip: tip, prog: prog };
    }

    // Origine du vecteur v pendant le glissement : de C (tau = 0) vers B (tau = 1).
    var M = pt(function () { return C.X() + tau.v * (B.X() - C.X()); },
               function () { return C.Y() + tau.v * (B.Y() - C.Y()); });

    // u = AB (bleu)
    var arU = arrow(A, ux, uy, pU, { strokeColor: C_U });
    // v qui glisse : part de M, toujours égal à v (orange)
    var arV = arrow(M, vx, vy, pV, { strokeColor: C_V });
    // La trace pâle de v à sa position de départ (visible dès qu'il a bougé)
    var arGhost = board.create('arrow', [C, D], {
      strokeColor: C_GHOST, strokeWidth: 3, dash: 2, lastArrow: { type: 2, size: 6 },
      highlight: false, layer: 5, visible: false
    });
    // La somme u + v = AE (vert)
    var arS = arrow(A, function () { return ux() + vx(); },
                       function () { return uy() + vy(); }, pS,
      { strokeColor: C_S, strokeWidth: 4.5, lastArrow: { type: 2, size: 8 }, layer: 6 });
    // Parallélogramme : l'autre chemin A → F → E (v puis u)
    var arP1 = arrow(A, vx, vy, pPa,
      { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2, lastArrow: { type: 2, size: 6 }, layer: 4 });
    var arP2 = arrow(F, ux, uy, pPb,
      { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2, lastArrow: { type: 2, size: 6 }, layer: 4 });
    var quad = board.create('polygon', [A, B, E, F], {
      fillColor: C_S, fillOpacity: 0.07, highlight: false, withLabel: false,
      borders: { strokeOpacity: 0 }, vertices: { visible: false }, visible: false, layer: 1
    });

    // Traits de déplacement : chaque extrémité de v laisse une trace pointillée.
    function trail(P, Q) {
      return board.create('segment', [P, Q], {
        strokeColor: C_GHOST, strokeWidth: 1.5, dash: 1, highlight: false,
        fixed: true, visible: false, layer: 3
      });
    }
    var trail1 = trail(C, M);
    var trail2 = trail(D, arV.tip);

    /* ==================================================================== */
    /* Étiquettes des flèches                                                */
    /* ==================================================================== */
    // Texte posé au milieu du segment PQ, décalé perpendiculairement.
    function midText(px, py, qx, qy, txt, color, side) {
      return board.create('text', [
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (px() + qx()) / 2 - side * 0.5 * (qy() - py()) / d;
        },
        function () {
          var d = Math.hypot(qx() - px(), qy() - py()) || 1;
          return (py() + qy()) / 2 + side * 0.5 * (qx() - px()) / d;
        },
        txt
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: color,
           cssStyle: 'font-weight:800', fixed: true, highlight: false, visible: false });
    }
    function X(P) { return function () { return P.X(); }; }
    function Y(P) { return function () { return P.Y(); }; }

    var tU = midText(X(A), Y(A), X(arU.tip), Y(arU.tip), function () { return 'u'; }, C_U, -1);
    var tV = midText(X(M), Y(M), X(arV.tip), Y(arV.tip), function () { return 'v'; }, C_V, -1);
    var tG = midText(X(C), Y(C), X(D), Y(D), function () { return 'v'; }, C_GHOST, -1);
    var tS = midText(X(A), Y(A), X(arS.tip), Y(arS.tip), function () { return 'u + v'; }, C_S, 1);

    /* ==================================================================== */
    /* Rafraîchissement : visibilité selon l'avancement                      */
    /* ==================================================================== */
    function refresh() {
      show(A, pU.v > 0.005);
      show(arU.a, pU.v > 0.005);
      show(tU, pU.v > 0.45);
      show(B, pU.v > 0.99);

      show(C, pV.v > 0.005);
      show(arV.a, pV.v > 0.005);
      show(tV, pV.v > 0.45);
      show(D, pV.v > 0.99);

      // Le vecteur v a commencé à glisser : on garde sa trace de départ.
      var moved = tau.v > 0.02;
      show(arGhost, moved);
      show(tG, moved);
      show(trail1, moved);
      show(trail2, moved);

      show(E, tau.v > 0.98 || pS.v > 0.02);
      show(arS.a, pS.v > 0.005);
      show(tS, pS.v > 0.45);

      var par = showPara && pP.v > 0.005;
      show(arP1.a, par && pPa.v > 0.005);
      show(arP2.a, par && pPb.v > 0.005);
      show(F, par && pPa.v > 0.98);
      show(quad, par && pPb.v > 0.98);
    }

    /* ==================================================================== */
    /* Panneau : les coordonnées et la relation de Chasles                   */
    /* ==================================================================== */
    // (ajouté à la page tout en bas de setup, après la barre de boutons)
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    // Notations colorées en HTML (le panneau se redessine à chaque frame :
    // on évite de relancer MathJax en continu).
    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }
    var vU = vec('u', C_U), vV = vec('v', C_V);
    var vAB = vec('AB', C_U), vCD = vec('CD', C_V);
    var vBE = vec('BE', C_V), vAE = vec('AE', C_S);

    function coords(x, y) { return '(' + fmt(x) + ' ; ' + fmt(y) + ')'; }
    function signed(x) { return (x < 0 ? '− ' : '+ ') + fmt(Math.abs(x)); }

    function renderPanel() {
      var uxv = ux(), uyv = uy(), vxv = vx(), vyv = vy();

      // Où en est la construction ? Le commentaire suit l'animation.
      var head;
      if (pV.v < 0.99) {
        head = 'Deux vecteurs tirés au hasard dans le plan : ' + vU + ' = ' + vAB +
          ' et ' + vV + ' = ' + vCD + '.';
      } else if (tau.v < 0.98) {
        head = '<span style="color:' + C_V + '">On fait glisser ' + vV + ' : son origine ' +
          'vient se poser sur <strong>B</strong></span>, l\'extrémité de ' + vU +
          '. Le vecteur ne change pas — on le translate seulement.';
      } else if (pS.v < 0.99) {
        head = 'Les deux flèches sont <strong>bout à bout</strong> : de <strong>A</strong> ' +
          'on va en <strong>B</strong>, puis de <strong>B</strong> en <strong>E</strong>.';
      } else {
        head = '<span style="color:' + C_S + '">La somme ' + vU + ' + ' + vV + ' = ' + vAE +
          '</span> : elle relie directement le <strong>départ A</strong> à ' +
          'l\'<strong>arrivée E</strong>.';
      }

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_S + '">' + vU + ' + ' + vV + ' = ' +
          coords(uxv + vxv, uyv + vyv) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +
        '<div class="props-label">Coordonnées</div>' +
        '<ul class="props-list">' +
          '<li>' + vU + ' = ' + vAB + ' ' + coords(uxv, uyv) + '</li>' +
          '<li>' + vV + ' = ' + vCD + ' = ' + vBE + ' ' + coords(vxv, vyv) + '</li>' +
          '<li>' + vU + ' + ' + vV + ' ( ' + fmt(uxv) + ' ' + signed(vxv) + ' ; ' +
            fmt(uyv) + ' ' + signed(vyv) + ' ) = ' + coords(uxv + vxv, uyv + vyv) +
            '</li>' +
        '</ul>' +
        '<div class="props-label">Relation de Chasles</div>' +
        '<p style="margin:.2rem 0 0;font-weight:700">' + vAB + ' + ' + vBE + ' = ' + vAE +
          '</p>' +
        '<p style="margin:.25rem 0 0;font-size:.9rem;color:var(--ink-soft)">' +
          'Comme ' + vBE + ' = ' + vCD + ' = ' + vV + ' (c\'est le même vecteur, ' +
          'simplement déplacé), on a bien ' + vU + ' + ' + vV + ' = ' + vAE + '. ' +
          'Le point de passage <strong>B</strong> disparaît du résultat.</p>' +
        (showPara
          ? '<p style="margin:.45rem 0 0;font-size:.9rem;color:var(--ink-soft)">' +
            '<strong>ABEF est un parallélogramme</strong> : en partant de A par ' + vV +
            ' puis ' + vU + ' (chemin gris), on arrive au même point E. Donc ' +
            vU + ' + ' + vV + ' = ' + vV + ' + ' + vU + '.</p>'
          : '');
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Tirage au hasard des deux vecteurs                                    */
    /* ==================================================================== */
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function inside(x, y) { return Math.abs(x) <= 7.1 && Math.abs(y) <= 5.2; }

    function newVectors() {
      for (var i = 0; i < 400; i++) {
        var uxv = rnd(-5, 5), uyv = rnd(-5, 5);
        var vxv = rnd(-5, 5), vyv = rnd(-5, 5);
        var lu = Math.hypot(uxv, uyv), lv = Math.hypot(vxv, vyv);
        if (lu < 2.5 || lu > 6.5 || lv < 2.5 || lv > 6.5) continue;
        // Vecteurs trop proches de la même direction : la figure serait plate.
        if (Math.abs(uxv * vyv - uyv * vxv) < 0.4 * lu * lv) continue;

        var ax = rnd(-6, 5), ay = rnd(-5, 5);
        // A, B, E et F doivent tous tenir dans le cadre.
        var quadPts = [[ax, ay], [ax + uxv, ay + uyv],
                       [ax + uxv + vxv, ay + uyv + vyv], [ax + vxv, ay + vyv]];
        if (!quadPts.every(function (p) { return inside(p[0], p[1]); })) continue;

        // Position de départ de v : dans le cadre et à l'écart de la construction.
        for (var j = 0; j < 120; j++) {
          var cx = rnd(-6, 6), cy = rnd(-5, 5);
          if (!inside(cx, cy) || !inside(cx + vxv, cy + vyv)) continue;
          var probes = [[cx, cy], [cx + vxv, cy + vyv],
                        [cx + vxv / 2, cy + vyv / 2]];
          var ok = probes.every(function (q) {
            return quadPts.every(function (p) {
              return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1.8;
            });
          });
          if (!ok) continue;

          A.setPosition(JXG.COORDS_BY_USER, [ax, ay]);
          B.setPosition(JXG.COORDS_BY_USER, [ax + uxv, ay + uyv]);
          C.setPosition(JXG.COORDS_BY_USER, [cx, cy]);
          D.setPosition(JXG.COORDS_BY_USER, [cx + vxv, cy + vyv]);
          return;
        }
      }
      // Repli si le tirage n'a rien donné (extrêmement rare) : figure de départ.
      A.setPosition(JXG.COORDS_BY_USER, [-6, -2]);
      B.setPosition(JXG.COORDS_BY_USER, [-3, 1]);
      C.setPosition(JXG.COORDS_BY_USER, [1, -4]);
      D.setPosition(JXG.COORDS_BY_USER, [5, -3]);
    }

    /* ==================================================================== */
    /* Animation                                                             */
    /* ==================================================================== */
    function clearFigure() {
      pU.v = 0; pV.v = 0; tau.v = 0; pS.v = 0; pP.v = 0; pPa.v = 0; pPb.v = 0;
      board.update();
    }
    function showAll() {
      anim.cancel();
      pU.v = 1; pV.v = 1; tau.v = 1; pS.v = 1; pP.v = 1; pPa.v = 1; pPb.v = 1;
      board.update();
    }

    function play() {
      clearFigure();
      var steps = [
        // 1. le premier vecteur apparaît
        { dur: 700, step: function (p) { pU.v = p; } },
        // 2. le second vecteur apparaît, ailleurs dans le plan
        { dur: 700, step: function (p) { pV.v = p; } },
        // 3. il glisse jusqu'à ce que son origine se pose sur l'extrémité de u
        { dur: 1100, step: function (p) { tau.v = p; } },
        // 4. la somme relie le départ à l'arrivée
        { dur: 800, step: function (p) { pS.v = p; } }
      ];
      if (showPara) {
        // 5. l'autre chemin (v puis u) ferme le parallélogramme : u + v = v + u
        steps.push({
          dur: 1200,
          step: function (p) {
            pP.v = p;
            pPa.v = Math.min(1, 2 * p);        // d'abord A → F (on avance de v)
            pPb.v = Math.max(0, 2 * p - 1);    // puis F → E (on ajoute u)
          }
        });
      }
      anim.runSteps(steps, clearFigure);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'dice', label: '🎲 Nouveaux vecteurs',
        onClick: function () { anim.cancel(); newVectors(); play(); } },
      { type: 'button', id: 'all', label: '↺ Figure complète', onClick: showAll },
      { type: 'checkbox', id: 'para', label: 'Règle du parallélogramme', checked: true,
        onChange: function (v) {
          showPara = v;
          if (!v) { pP.v = 0; pPa.v = 0; pPb.v = 0; }
          else if (pS.v > 0.99) { pP.v = 1; pPa.v = 1; pPb.v = 1; }
          board.update();
        } }
    ]);

    mv.extras.appendChild(panel);

    newVectors();
    showAll();
  }
});
