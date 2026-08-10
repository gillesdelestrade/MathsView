/*
 * La translation de vecteur u (2nde) — l'image d'une figure, point par point.
 *
 * Définition : l'image du point M par la translation de vecteur u est l'unique
 * point M' tel que  MM' = u.  Traduire une figure, c'est donc appliquer cette
 * construction à CHACUN de ses points.
 *
 * L'animation suit exactement ce raisonnement :
 *   1. on se donne le vecteur u ;
 *   2. on reporte u depuis A : le point glisse le long de la flèche jusqu'en A' ;
 *   3. 4. 5. la même chose pour B, C puis D — la MÊME flèche à chaque fois,
 *      c'est ce qui fait que la figure ne se déforme pas ;
 *   6. les quatre images étant construites, on trace le quadrilatère A'B'C'D' ;
 *   7. enfin la figure entière reglisse d'un bloc : une translation, c'est un
 *      glissement, sans rotation ni retournement.
 *
 * Les quatre flèches AA', BB', CC', DD' sont dessinées de la même couleur que
 * u : elles sont toutes égales à u, et ABB'A' (comme BCC'B'…) est un
 * parallélogramme — c'est la case à cocher du même nom.
 *
 * Tout est déplaçable : les quatre sommets du quadrilatère, et les deux
 * extrémités du vecteur u (en bas à gauche), qui pilote toute l'image.
 */
MathsView.register({
  id: 'vecteurs-translation',
  title: 'La translation',
  level: '2nde',
  category: 'geometrie',
  subcategory: 'Vecteurs',
  exercices: ['vec-translation'],
  theme: 'Vecteurs — translation d\'une figure par un vecteur',
  description:
    'L\'image d\'un point \\(M\\) par la <strong>translation de vecteur</strong> ' +
    '\\(\\vec{u}\\) est le point \\(M\'\\) tel que \\(\\vec{MM\'}=\\vec{u}\\). ' +
    'Traduire une figure, c\'est faire cela pour <strong>chacun</strong> de ses points.' +
    '<br>Clique sur <strong>▶ Animer</strong> : on reporte le vecteur \\(\\vec{u}\\) depuis ' +
    '\\(A\\), puis \\(B\\), puis \\(C\\), puis \\(D\\) — la <strong>même flèche à chaque ' +
    'fois</strong> — et une fois les quatre images construites, on trace le quadrilatère ' +
    '\\(A\'B\'C\'D\'\\). La dernière étape fait glisser la figure entière d\'un bloc.' +
    '<br>Comme \\(\\vec{AA\'}=\\vec{BB\'}=\\vec{CC\'}=\\vec{DD\'}=\\vec{u}\\), la figure ' +
    '<strong>glisse sans se déformer</strong> : mêmes longueurs, mêmes angles, même aire, ' +
    'et elle n\'est ni tournée ni retournée.' +
    '<br><em>Déplace les sommets A, B, C, D, et les deux bouts du vecteur \\(\\vec{u}\\) ' +
    'en bas à gauche : toute l\'image suit.</em>',
  notes:
    '<ul>' +
    '<li><strong>Définition.</strong> \\(M\'\\) est l\'image de \\(M\\) par la translation ' +
    'de vecteur \\(\\vec{u}\\) si et seulement si \\(\\vec{MM\'}=\\vec{u}\\). ' +
    'Le vecteur \\(\\vec{u}\\) donne la <em>direction</em>, le <em>sens</em> et la ' +
    '<em>distance</em> du glissement.</li>' +
    '<li><strong>Construction.</strong> Pour construire l\'image d\'une figure, il suffit ' +
    'de construire l\'image de ses <strong>points caractéristiques</strong> (ici les quatre ' +
    'sommets), puis de les relier comme dans la figure de départ.</li>' +
    '<li><strong>Parallélogrammes.</strong> Puisque \\(\\vec{AA\'}=\\vec{BB\'}\\), le ' +
    'quadrilatère \\(ABB\'A\'\\) est un <strong>parallélogramme</strong>. Attention à ' +
    'l\'ordre des lettres : c\'est \\(ABB\'A\'\\), pas \\(ABA\'B\'\\).</li>' +
    '<li><strong>Ce que la translation conserve.</strong> Les longueurs, les angles, les ' +
    'aires, le parallélisme, l\'alignement, les milieux… et aussi le ' +
    '<strong>sens de parcours</strong> : la figure n\'est pas retournée, contrairement à ce ' +
    'qui se passe avec une symétrie axiale.</li>' +
    '<li><strong>Image d\'une droite.</strong> L\'image d\'une droite \\(d\\) est une droite ' +
    '<strong>parallèle</strong> à \\(d\\) ; l\'image d\'un segment est un segment de même ' +
    'longueur ; l\'image d\'un cercle est un cercle de même rayon.</li>' +
    '<li><strong>En coordonnées.</strong> Si \\(\\vec{u}\\,(a\\,;\\,b)\\) et \\(M\\,(x\\,;\\,y)\\), ' +
    'alors \\(M\'\\,(x+a\\,;\\,y+b)\\) : on ajoute les coordonnées du vecteur à celles du ' +
    'point.</li>' +
    '<li><strong>Cas particulier.</strong> La translation de vecteur nul laisse tous les ' +
    'points à leur place : elle ne change rien.</li>' +
    '<li><strong>Enchaîner deux translations.</strong> Appliquer la translation de vecteur ' +
    '\\(\\vec{u}\\) puis celle de vecteur \\(\\vec{v}\\) revient à appliquer une seule ' +
    'translation, de vecteur \\(\\vec{u}+\\vec{v}\\) — c\'est la relation de Chasles à ' +
    'l\'œuvre.</li>' +
    '</ul>',
  board: { boundingbox: [-10, 7.5, 10, -7.5], keepaspectratio: true, axis: true, grid: true },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_SRC = '#2563eb';   // la figure de départ ABCD (bleu)
    var C_IMG = '#16a34a';   // la figure image A'B'C'D' (vert)
    var C_U   = '#ea580c';   // le vecteur u, et les quatre reports (orange)
    var C_PAR = '#7c3aed';   // le parallélogramme ABB'A' (violet)
    var GREY  = '#94a3b8';

    var BG = 'background:rgba(255,255,255,.85);padding:0 3px;border-radius:5px;' +
             'white-space:nowrap;';
    var NAMES = ['A', 'B', 'C', 'D'];

    function fmt(x) {
      var v = Math.round(x * 10) / 10;
      if (Object.is(v, -0)) v = 0;
      return v.toString().replace('-', '−').replace('.', ',');
    }
    function signed(x) { return (x < 0 ? '− ' : '+ ') + fmt(Math.abs(x)); }
    function coords(x, y) { return '(' + fmt(x) + ' ; ' + fmt(y) + ')'; }

    function show(o, v) {
      v = !!v;
      if (o._mvVis !== v) { o._mvVis = v; o.setAttribute({ visible: v }); }
    }
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var t = {}; t[key] = val;
        o.setAttribute(t);
      }
    }

    /* ==================================================================== */
    /* Avancement des phases de l'animation (0 → 1)                          */
    /* ==================================================================== */
    var pU = { v: 1 };                                   // le vecteur u
    var pV = [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }];   // un par sommet
    var pQ = { v: 1 };                                   // le quadrilatère image
    var pS = { v: 0 };                                   // le glissement final

    var showArrows = true;   // les reports AA', BB', CC', DD'
    var showCoords = true;   // les coordonnées à côté des points
    var showPara = false;    // le parallélogramme ABB'A'

    var anim = mv.createAnimator();

    /* ==================================================================== */
    /* Le vecteur u, défini en bas à gauche par deux points libres           */
    /* ==================================================================== */
    var GRID = { snapToGrid: true, snapSizeX: 1, snapSizeY: 1 };
    function mkPoint(x, y, color) {
      return board.create('point', [x, y], Object.assign({
        size: 4, color: color, withLabel: false, showInfobox: false, layer: 10
      }, GRID));
    }
    var P = mkPoint(-9, -6, C_U);      // origine du vecteur u
    var Q = mkPoint(-3, -4, C_U);      // extrémité : c'est elle qui règle u

    function ux() { return Q.X() - P.X(); }
    function uy() { return Q.Y() - P.Y(); }
    function unul() { return Math.abs(ux()) < 1e-9 && Math.abs(uy()) < 1e-9; }

    function pt(fx, fy) {
      return board.create('point', [fx, fy],
        { visible: false, fixed: true, name: '', withLabel: false });
    }

    var arrU = board.create('arrow', [P, Q], {
      strokeColor: C_U, strokeWidth: 4, lastArrow: { type: 2, size: 8 },
      highlight: false, layer: 8, visible: false
    });

    /* ==================================================================== */
    /* Le quadrilatère de départ ABCD                                        */
    /* ==================================================================== */
    var V = [mkPoint(-8, 0, C_SRC), mkPoint(-6, 3, C_SRC),
             mkPoint(-3, 2, C_SRC), mkPoint(-5, -1, C_SRC)];

    var srcPoly = board.create('polygon', V, {
      fillColor: C_SRC, fillOpacity: 0.12, hasInnerPoints: false,
      borders: { strokeColor: C_SRC, strokeWidth: 3, highlight: false, fixed: true },
      fixed: true, highlight: false, layer: 4
    });

    /* ==================================================================== */
    /* Les quatre images : chacune avance à son rythme le long de u          */
    /*                                                                       */
    /* Un seul point par sommet : il PART de V[i] et arrive en V[i] + u.      */
    /* Tant que son avancement n'est pas terminé, c'est le point qui voyage ; */
    /* à l'arrivée, c'est l'image A' (B', C', D').                            */
    /* ==================================================================== */
    var W = V.map(function (M, i) {
      return board.create('point', [
        function () { return M.X() + pV[i].v * ux(); },
        function () { return M.Y() + pV[i].v * uy(); }
      ], { size: 4, color: C_IMG, withLabel: false, showInfobox: false,
           fixed: true, highlight: false, layer: 10, visible: false });
    });

    // Le report de u depuis chaque sommet : la flèche pousse avec le point.
    var arrows = V.map(function (M, i) {
      return board.create('arrow', [M, W[i]], {
        strokeColor: C_U, strokeWidth: 2.5, dash: 2,
        lastArrow: { type: 2, size: 6 }, highlight: false,
        layer: 7, visible: false
      });
    });

    var imgPoly = board.create('polygon', W, {
      fillColor: C_IMG, fillOpacity: 0.14, hasInnerPoints: false,
      borders: { strokeColor: C_IMG, strokeWidth: 3, highlight: false, fixed: true },
      fixed: true, highlight: false, layer: 5, visible: false
    });

    /* Le glissement final : la figure de départ recopiée, qui se déplace --- */
    var ghost = board.create('polygon', V.map(function (M) {
      return pt(function () { return M.X() + pS.v * ux(); },
                function () { return M.Y() + pS.v * uy(); });
    }), { fillColor: C_SRC, fillOpacity: 0.22, hasInnerPoints: false,
          borders: { strokeColor: C_SRC, strokeWidth: 3, dash: 2,
                     highlight: false, fixed: true },
          fixed: true, highlight: false, layer: 6, visible: false });

    /* Le parallélogramme ABB'A' (case à cocher) --------------------------- */
    var para = board.create('polygon', [V[0], V[1], W[1], W[0]], {
      fillColor: C_PAR, fillOpacity: 0.16, hasInnerPoints: false,
      borders: { strokeColor: C_PAR, strokeWidth: 2, dash: 1,
                 highlight: false, fixed: true },
      fixed: true, highlight: false, layer: 3, visible: false
    });

    /* ==================================================================== */
    /* Étiquettes                                                            */
    /* ==================================================================== */
    // Chaque étiquette fuit le centre de son quadrilatère : elle se pose du
    // côté extérieur, là où rien ne la recouvre.
    function labelFor(pts, i, nameFn, color) {
      function cx() { var s = 0; pts.forEach(function (M) { s += M.X(); }); return s / 4; }
      function cy() { var s = 0; pts.forEach(function (M) { s += M.Y(); }); return s / 4; }
      function off(k) {
        var dx = pts[i].X() - cx(), dy = pts[i].Y() - cy();
        var d = Math.hypot(dx, dy);
        if (d < 0.2) return k === 0 ? 0 : -0.7;
        return k === 0 ? 1.15 * dx / d : 0.58 * dy / d;
      }
      return board.create('text', [
        function () { return pts[i].X() + off(0); },
        function () { return pts[i].Y() + off(1); },
        nameFn
      ], { anchorX: 'middle', anchorY: 'middle', fontSize: 14, color: color,
           cssStyle: BG, fixed: true, highlight: false, layer: 11, visible: false });
    }

    var labV = V.map(function (M, i) {
      return labelFor(V, i, function () {
        return '<b>' + NAMES[i] + '</b>' +
          (showCoords ? coords(M.X(), M.Y()) : '');
      }, C_SRC);
    });
    var labW = W.map(function (M, i) {
      return labelFor(W, i, function () {
        return '<b>' + NAMES[i] + '\'</b>' +
          (showCoords ? coords(M.X(), M.Y()) : '');
      }, C_IMG);
    });

    // Le nom du vecteur, posé au milieu de sa flèche.
    board.create('text', [
      function () { return (P.X() + Q.X()) / 2 - 0.45 * (Q.Y() - P.Y()) /
        (Math.hypot(ux(), uy()) || 1); },
      function () { return (P.Y() + Q.Y()) / 2 + 0.45 * (Q.X() - P.X()) /
        (Math.hypot(ux(), uy()) || 1); },
      function () {
        return 'u<span style="font-size:.7em;vertical-align:.6em">▸</span> ' +
          coords(ux(), uy());
      }
    ], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color: C_U,
         cssStyle: 'font-weight:800;' + BG, fixed: true, highlight: false, layer: 9 });

    board.create('text', [-9, -7, function () {
      return 'le vecteur de la translation';
    }], { anchorX: 'left', anchorY: 'middle', fontSize: 12, color: GREY,
          fixed: true, highlight: false, layer: 9 });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function refresh() {
      show(arrU, pU.v > 0.005 && !unul());

      var glisse = pS.v > 0.005 && pS.v < 0.999;
      for (var i = 0; i < 4; i++) {
        var p = pV[i].v;
        show(arrows[i], showArrows && p > 0.005 && !unul());
        show(W[i], p > 0.005);
        show(labW[i], p > 0.99);
        show(labV[i], true);
      }
      show(imgPoly, pQ.v > 0.005);
      imgPoly.borders.forEach(function (b) {
        attr(b, 'strokeOpacity', Math.round(100 * pQ.v) / 100);
      });
      attr(imgPoly, 'fillOpacity', Math.round(14 * pQ.v) / 100);

      show(ghost, glisse);
      show(para, showPara && pV[0].v > 0.99 && pV[1].v > 0.99);
    }

    /* ==================================================================== */
    /* Panneau                                                               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function vec(name, color) {
      return '<b style="color:' + color + '">' + name + '</b>' +
        '<span style="color:' + color + ';font-size:.7em;vertical-align:.6em">▸</span>';
    }
    var sU = vec('u', C_U);

    function renderPanel() {
      var a = ux(), b = uy();

      // Le commentaire suit l'animation.
      var head;
      var done = pV.filter(function (p) { return p.v > 0.99; }).length;
      if (pU.v < 0.99) {
        head = 'On se donne un vecteur ' + sU + ' : c\'est lui qui décide de la ' +
          '<strong>direction</strong>, du <strong>sens</strong> et de la ' +
          '<strong>distance</strong> du glissement.';
      } else if (done < 4) {
        var n = Math.min(3, done);
        head = 'On reporte ' + sU + ' depuis <strong>' + NAMES[n] + '</strong> : l\'image ' +
          '<strong>' + NAMES[n] + '\'</strong> est le point tel que <b>' + NAMES[n] +
          NAMES[n] + '\'</b> = ' + sU + '.' +
          (done > 0 ? ' Remarque : c\'est la <strong>même flèche</strong> qu\'aux étapes ' +
            'précédentes.' : '');
      } else if (pQ.v < 0.99) {
        head = 'Les quatre images sont construites : il ne reste qu\'à les <strong>relier ' +
          'dans le même ordre</strong> pour obtenir le quadrilatère image A\'B\'C\'D\'.';
      } else if (pS.v > 0.005 && pS.v < 0.999) {
        head = 'Vu autrement : la figure entière <strong>glisse d\'un bloc</strong>, sans ' +
          'tourner ni se retourner.';
      } else if (unul()) {
        head = 'Le vecteur ' + sU + ' est <strong>nul</strong> : la translation ne déplace ' +
          'rien, chaque point est sa propre image.';
      } else {
        head = 'A\'B\'C\'D\' est l\'image de ABCD par la translation de vecteur ' + sU +
          '. Les deux quadrilatères sont <strong>superposables</strong> : la translation ' +
          'ne déforme rien.';
      }

      var lignes = V.map(function (M, i) {
        return '<li>' + NAMES[i] + ' ' + coords(M.X(), M.Y()) + ' → ' +
          '<strong>' + NAMES[i] + '\'</strong> ( ' +
          fmt(M.X()) + ' ' + signed(a) + ' ; ' + fmt(M.Y()) + ' ' + signed(b) + ' ) = ' +
          '<strong>' + coords(M.X() + a, M.Y() + b) + '</strong></li>';
      }).join('');

      panel.innerHTML =
        '<div class="props-name" style="color:' + C_IMG + '">A\'B\'C\'D\' = image de ABCD ' +
          'par la translation de vecteur ' + sU + ' ' + coords(a, b) + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + head + '</p>' +

        '<div class="props-label">Chaque point se translate : (x ; y) → (x ' + signed(a) +
          ' ; y ' + signed(b) + ')</div>' +
        '<ul class="props-list">' + lignes + '</ul>' +

        '<div class="props-label">Ce que dit la figure</div>' +
        '<ul class="props-list">' +
          '<li><b>AA\'</b> = <b>BB\'</b> = <b>CC\'</b> = <b>DD\'</b> = ' + sU +
            ' : les quatre flèches oranges sont le <strong>même vecteur</strong>.</li>' +
          '<li>Donc <strong>ABB\'A\'</strong> est un <strong>parallélogramme</strong> ' +
            '(coche la case pour le voir), comme BCC\'B\' et les autres.</li>' +
          '<li>La translation conserve les <strong>longueurs</strong>, les ' +
            '<strong>angles</strong>, l\'<strong>aire</strong> et le ' +
            '<strong>sens de parcours</strong> : la figure glisse, elle n\'est ni ' +
            'tournée ni retournée.</li>' +
        '</ul>' +
        '<p style="margin:.45rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'Pour construire l\'image d\'une figure, on construit l\'image de ses points ' +
          'caractéristiques — ici les quatre sommets — puis on les relie dans le même ' +
          'ordre. Tous les autres points suivent.</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Tirage d'une nouvelle figure                                          */
    /* ==================================================================== */
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    function newFigure() {
      // Quatre points tirés au hasard, puis triés autour de leur centre de
      // gravité : le quadrilatère obtenu ne se croise jamais.
      var pts, cx, cy, ok = false, tries = 0;
      while (!ok && tries++ < 200) {
        pts = [];
        for (var i = 0; i < 4; i++) pts.push([rnd(-9, -4), rnd(-1, 4)]);
        cx = (pts[0][0] + pts[1][0] + pts[2][0] + pts[3][0]) / 4;
        cy = (pts[0][1] + pts[1][1] + pts[2][1] + pts[3][1]) / 4;
        pts.sort(function (m, n) {
          return Math.atan2(m[1] - cy, m[0] - cx) - Math.atan2(n[1] - cy, n[0] - cx);
        });
        // On refuse les figures écrasées : chaque sommet doit être assez loin
        // du centre, et les côtés assez longs.
        ok = pts.every(function (m) { return Math.hypot(m[0] - cx, m[1] - cy) > 1.2; });
        for (var j = 0; ok && j < 4; j++) {
          var k = (j + 1) % 4;
          if (Math.hypot(pts[j][0] - pts[k][0], pts[j][1] - pts[k][1]) < 1.8) ok = false;
        }
      }
      pts.forEach(function (m, i) { V[i].setPosition(JXG.COORDS_BY_USER, m); });

      // Un vecteur qui envoie la figure à droite, sans sortir du cadre.
      var xmax = Math.max(pts[0][0], pts[1][0], pts[2][0], pts[3][0]);
      var xmin = Math.min(pts[0][0], pts[1][0], pts[2][0], pts[3][0]);
      var ymax = Math.max(pts[0][1], pts[1][1], pts[2][1], pts[3][1]);
      var ymin = Math.min(pts[0][1], pts[1][1], pts[2][1], pts[3][1]);
      var a = rnd(xmax - xmin + 1, Math.min(9 - xmax, 11));
      var b = rnd(Math.max(-2, -6 - ymin), Math.min(2, 6 - ymax));

      // Le vecteur reste dans la bande libre du bas : on choisit sa hauteur de
      // départ selon qu'il monte ou qu'il descend, pour qu'il ne sorte pas.
      var py = b >= 0 ? -6.5 : -4.5;
      P.setPosition(JXG.COORDS_BY_USER, [-9, py]);
      Q.setPosition(JXG.COORDS_BY_USER, [-9 + a, py + b]);
    }

    /* ==================================================================== */
    /* Animation                                                             */
    /* ==================================================================== */
    function clearFigure() {
      pU.v = 0; pQ.v = 0; pS.v = 0;
      pV.forEach(function (p) { p.v = 0; });
      board.update();
    }
    function showAll() {
      anim.cancel();
      pU.v = 1; pQ.v = 1; pS.v = 0;
      pV.forEach(function (p) { p.v = 1; });
      board.update();
    }

    function play() {
      clearFigure();
      var steps = [
        // 1. le vecteur de la translation
        { dur: 600, step: function (p) { pU.v = p; } }
      ];
      // 2 à 5. chaque sommet part le long de u, l'un après l'autre
      for (var i = 0; i < 4; i++) {
        (function (i) {
          steps.push({ dur: 750, step: function (p) { pV[i].v = p; } });
        })(i);
      }
      // 6. les quatre images étant là, on trace le quadrilatère
      steps.push({ dur: 750, step: function (p) { pQ.v = p; } });
      // 7. et l'on voit la figure glisser d'un bloc
      steps.push({ dur: 1500, step: function (p) { pS.v = p; } });
      anim.runSteps(steps, clearFigure);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Animer', onClick: play },
      { type: 'button', id: 'dice', label: '🎲 Nouvelle figure',
        onClick: function () { anim.cancel(); newFigure(); play(); } },
      { type: 'button', id: 'all', label: '↺ Figure complète', onClick: showAll },
      { type: 'checkbox', id: 'arrows', label: 'reports AA\', BB\', CC\', DD\'',
        checked: true,
        onChange: function (v) { showArrows = v; board.update(); } },
      { type: 'checkbox', id: 'para', label: 'parallélogramme ABB\'A\'', checked: false,
        onChange: function (v) { showPara = v; board.update(); } },
      { type: 'checkbox', id: 'coords', label: 'coordonnées des points', checked: true,
        onChange: function (v) { showCoords = v; board.update(); } }
    ]);

    mv.extras.appendChild(panel);

    showAll();
  }
});
