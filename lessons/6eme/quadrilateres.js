/*
 * Les quadrilatères — deux façons de jouer, la liste de cases restant toujours
 * visible sous la figure :
 *
 *  1. exploration libre : on déplace A, B, C, D, le site reconnaît la famille ;
 *  2. construction : on coche des propriétés — l'animation démarre alors toute
 *     seule et parcourt TOUTES les formes qui les vérifient.
 *
 * ---------------------------------------------------------------------------
 * Comment marche le mode construction (la partie mathématique intéressante)
 * ---------------------------------------------------------------------------
 * Un quadrilatère convexe est entièrement déterminé par ses DEUX DIAGONALES :
 * leur point d'intersection I, l'angle φ entre elles, et les quatre distances
 *     a = IA,  b = IB,  c = IC,  d = ID.
 * Dans ce paramétrage, chacune des sept propriétés devient une équation simple :
 *
 *   diagonales se coupant en leur milieu ......  a = c  et  b = d
 *   côtés opposés parallèles deux à deux ......  a = c  et  b = d   (équivalent !)
 *   diagonales de même longueur ...............  a + c = b + d
 *   diagonales perpendiculaires ...............  φ = 90°
 *   quatre côtés de même longueur .............  a = c, b = d, φ = 90°   (losange)
 *   quatre angles droits ......................  a = c, b = d, a+c = b+d (rectangle)
 *   au moins deux côtés parallèles (trapèze) ..  a·d = b·c
 *
 * (la dernière vient de Thalès : si (AB)∥(DC), les triangles IAB et ICD sont
 *  semblables, donc IA/IC = IB/ID.)
 *
 * Les sept cases se ramènent donc à quatre contraintes indépendantes. On fait
 * osciller les paramètres restés libres et on résout les autres exactement :
 * la figure balaie ainsi toute la famille demandée. Exemple : « milieu » +
 * « perpendiculaires » donne a = c, b = d, φ = 90° avec a et b libres, c'est
 * la famille des losanges — et le carré apparaît exactement quand a = b.
 */
MathsView.register({
  id: 'quadrilateres',
  title: 'Les quadrilatères',
  level: '6eme',
  theme: 'Géométrie — familles de quadrilatères',
  description:
    'Un <strong>quadrilatère</strong> a quatre côtés. Selon que ses côtés sont ' +
    'parallèles, de même longueur, ou forment des angles droits, il porte un nom précis.' +
    '<br><strong>Déplace A, B, C, D</strong> : le site reconnaît tout seul la famille.' +
    '<br><strong>Ou coche les propriétés</strong> que tu veux dans la liste sous la figure : ' +
    'elle s\'anime alors en parcourant toutes les formes qui les vérifient.',
  notes:
    '<ul>' +
    '<li><strong>Parallélogramme</strong> : les côtés opposés sont parallèles deux à deux.</li>' +
    '<li><strong>Rectangle</strong> : un parallélogramme avec un angle droit (donc quatre).</li>' +
    '<li><strong>Losange</strong> : un parallélogramme avec quatre côtés de même longueur.</li>' +
    '<li><strong>Carré</strong> : à la fois rectangle et losange.</li>' +
    '<li><strong>Trapèze</strong> : au moins une paire de côtés parallèles.</li>' +
    '</ul>' +
    '<p>Les diagonales racontent la même histoire : dans un parallélogramme elles se ' +
    'coupent en leur milieu ; dans un rectangle elles ont la même longueur ; dans un ' +
    'losange elles sont perpendiculaires. C\'est pourquoi cocher « diagonales qui se ' +
    'coupent en leur milieu » revient exactement à cocher « côtés opposés parallèles ' +
    'deux à deux » : les cases <em>impliquées</em> par ton choix s\'allument toutes seules.</p>',
  board: { boundingbox: [-7.2, 5.6, 7.2, -5.6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    var CENTER = [0, -0.3]; // centre de la figure animée

    var A = board.create('point', [-3, -2.3], { name: 'A', size: 4, color: '#2563eb' });
    var B = board.create('point', [3, -2.3], { name: 'B', size: 4, color: '#2563eb' });
    var C = board.create('point', [3.8, 1.8], { name: 'C', size: 4, color: '#2563eb' });
    var D = board.create('point', [-2.2, 1.8], { name: 'D', size: 4, color: '#2563eb' });

    var quad = board.create('polygon', [A, B, C, D], {
      fillColor: '#93c5fd', fillOpacity: 0.35,
      borders: { strokeColor: '#1d4ed8', strokeWidth: 2 }
    });

    // Diagonales [AC] et [BD] + leur point d'intersection.
    var diag1 = board.create('segment', [A, C], { strokeColor: '#f59e0b', dash: 2, strokeWidth: 2 });
    var diag2 = board.create('segment', [B, D], { strokeColor: '#f59e0b', dash: 2, strokeWidth: 2 });
    board.create('intersection', [diag1, diag2, 0], { name: '', size: 2, color: '#f59e0b', withLabel: false });

    // Longueurs des côtés, au milieu de chaque côté.
    function sideLabel(P, Q) {
      board.create('text', [
        function () { return (P.X() + Q.X()) / 2; },
        function () { return (P.Y() + Q.Y()) / 2; },
        function () { return Math.hypot(P.X() - Q.X(), P.Y() - Q.Y()).toFixed(1); }
      ], { fontSize: 12, color: '#475569', anchorX: 'middle', anchorY: 'middle' });
    }
    sideLabel(A, B); sideLabel(B, C); sideLabel(C, D); sideLabel(D, A);

    /* ==================================================================== */
    /* Reconnaissance : travaille sur des couples [x, y], pas sur des points */
    /* (comme ça on peut aussi analyser des formes calculées, non affichées) */
    /* ==================================================================== */
    function vec(p, q) { return [q[0] - p[0], q[1] - p[1]]; }
    function norm(u) { return Math.hypot(u[0], u[1]); }
    function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }
    function dot(u, v) { return u[0] * v[0] + u[1] * v[1]; }
    function xy(pt) { return [pt.X(), pt.Y()]; }

    var TOL = 0.04; // tolérance relative (~4 %)

    function parallel(u, v) {
      var n = norm(u) * norm(v);
      return n > 0 && Math.abs(cross(u, v)) / n < TOL;
    }
    function perpendicular(u, v) {
      var n = norm(u) * norm(v);
      return n > 0 && Math.abs(dot(u, v)) / n < TOL;
    }
    function sameLength(a, b) {
      return Math.abs(a - b) / Math.max(a, b, 1e-9) < TOL;
    }

    function classify(pA, pB, pC, pD) {
      var AB = vec(pA, pB), BC = vec(pB, pC), CD = vec(pC, pD), DA = vec(pD, pA);
      var DC = vec(pD, pC), AD = vec(pA, pD);
      var ab = norm(AB), bc = norm(BC), cd = norm(CD), da = norm(DA);

      var isPara = parallel(AB, DC) && parallel(BC, AD) && sameLength(ab, cd) && sameLength(bc, da);

      if (isPara) {
        var right = perpendicular(AB, BC);
        var equalAdj = sameLength(ab, bc);
        if (right && equalAdj) return { name: 'Carré', color: '#7c3aed' };
        if (right) return { name: 'Rectangle', color: '#0d9488' };
        if (equalAdj) return { name: 'Losange', color: '#0d9488' };
        return { name: 'Parallélogramme', color: '#2563eb' };
      }
      if (parallel(AB, DC) || parallel(BC, AD)) return { name: 'Trapèze', color: '#2563eb' };
      return { name: 'Quadrilatère quelconque', color: '#64748b' };
    }

    // Les sept propriétés, dans l'ordre des cases à cocher.
    var PROPS = [
      { key: 'par1',   label: 'Deux côtés parallèles' },
      { key: 'par2',   label: 'Côtés opposés parallèles deux à deux' },
      { key: 'milieu', label: 'Diagonales qui se coupent en leur milieu' },
      { key: 'diagEq', label: 'Diagonales de même longueur' },
      { key: 'diagPerp', label: 'Diagonales perpendiculaires' },
      { key: 'cotes4', label: 'Quatre côtés de même longueur' },
      { key: 'angles4', label: 'Quatre angles droits' }
    ];

    // Quelles propriétés une figure donnée vérifie-t-elle réellement ?
    function checkProps(pA, pB, pC, pD) {
      var AB = vec(pA, pB), CD = vec(pC, pD), DC = vec(pD, pC), AD = vec(pA, pD), BC = vec(pB, pC);
      var ab = norm(AB), bc = norm(BC), cd = norm(CD), da = norm(vec(pD, pA));
      var AC = vec(pA, pC), BD = vec(pB, pD);

      var p1 = parallel(AB, DC), p2 = parallel(BC, AD);
      var midAC = [(pA[0] + pC[0]) / 2, (pA[1] + pC[1]) / 2];
      var midBD = [(pB[0] + pD[0]) / 2, (pB[1] + pD[1]) / 2];
      var scale = Math.max((norm(AC) + norm(BD)) / 2, 1e-9);

      var rc = 0;
      if (perpendicular(vec(pA, pB), vec(pA, pD))) rc++;
      if (perpendicular(vec(pB, pA), vec(pB, pC))) rc++;
      if (perpendicular(vec(pC, pB), vec(pC, pD))) rc++;
      if (perpendicular(vec(pD, pC), vec(pD, pA))) rc++;

      return {
        par1: p1 || p2,
        par2: p1 && p2,
        milieu: Math.hypot(midAC[0] - midBD[0], midAC[1] - midBD[1]) < 0.05 * scale,
        diagEq: sameLength(norm(AC), norm(BD)),
        diagPerp: perpendicular(AC, BD),
        cotes4: sameLength(ab, bc) && sameLength(bc, cd) && sameLength(cd, da),
        angles4: rc === 4
      };
    }

    /* ==================================================================== */
    /* Mode construction : de « cases cochées » à une famille de figures     */
    /* ==================================================================== */

    // Cases cochées par l'utilisateur.
    var wanted = { par1: false, par2: false, milieu: false, diagEq: false, diagPerp: false, cotes4: false, angles4: false };

    // Les sept cases se ramènent à quatre contraintes indépendantes
    // sur (a, b, c, d, φ). Voir l'en-tête du fichier.
    function constraints() {
      return {
        bisect:  wanted.par2 || wanted.milieu || wanted.cotes4 || wanted.angles4, // a=c, b=d
        perp:    wanted.diagPerp || wanted.cotes4,                                // φ = 90°
        equalD:  wanted.diagEq || wanted.angles4,                                 // a+c = b+d
        trapez:  wanted.par1                                                      // a·d = b·c
      };
    }

    // Propriétés IMPLIQUÉES par les contraintes (donc vraies même non cochées).
    function implied() {
      var k = constraints();
      return {
        par1: k.trapez || k.bisect,
        par2: k.bisect,
        milieu: k.bisect,
        diagEq: k.equalD,
        diagPerp: k.perp,
        cotes4: k.bisect && k.perp,
        angles4: k.bisect && k.equalD
      };
    }

    // Construit la figure de la famille à « l'instant » t (période 2π).
    // Les paramètres libres oscillent, les contraints sont résolus exactement.
    function shape(t) {
      var k = constraints();
      function osc(phase, lo, hi) { return lo + (hi - lo) * 0.5 * (1 + Math.sin(t + phase)); }
      var LO = 1.6, HI = 3.6;
      var a, b, c, d;
      var phi = k.perp ? Math.PI / 2 : osc(1.1, 0.95, 2.2); // ~55° … 126°

      if (k.bisect) {
        // a = c, b = d. Si en plus a+c = b+d, alors b = a (rectangle).
        a = osc(0, LO, HI);
        b = k.equalD ? a : osc(2.2, LO, HI);
        c = a; d = b;
      } else if (k.equalD && k.trapez) {
        // a+c = b+d ET a·d = b·c  ⟹  (a+c)(a−b) = 0  ⟹  b = a et d = c.
        a = osc(0, LO, HI); c = osc(2.0, LO, HI);
        b = a; d = c;
      } else if (k.equalD) {
        // a+c = b+d : on choisit a, c, puis b entre 25 % et 75 % de la somme
        // (ça garde d = a+c−b confortablement positif).
        a = osc(0, LO, HI); c = osc(2.0, LO, HI);
        var s = a + c;
        b = osc(3.9, 0.25 * s, 0.75 * s);
        d = s - b;
      } else if (k.trapez) {
        a = osc(0, LO, HI); c = osc(2.0, LO, HI); b = osc(3.9, LO, HI);
        d = b * c / a;
      } else {
        a = osc(0, LO, HI); b = osc(1.6, LO, HI); c = osc(3.1, LO, HI); d = osc(4.7, LO, HI);
      }

      // Mise à l'échelle pour tenir dans la fenêtre. Une homothétie conserve
      // parallélisme, perpendicularité et rapports : toutes les propriétés
      // demandées restent vraies.
      var kk = 3.8 / Math.max(a, b, c, d);
      a *= kk; b *= kk; c *= kk; d *= kk;

      // Diagonales placées symétriquement autour de l'horizontale : la figure
      // reste bien posée quand φ varie.
      var h = phi / 2, cx = CENTER[0], cy = CENTER[1];
      return {
        A: [cx + a * Math.cos(-h), cy + a * Math.sin(-h)],
        B: [cx + b * Math.cos(h),  cy + b * Math.sin(h)],
        C: [cx - c * Math.cos(-h), cy - c * Math.sin(-h)],
        D: [cx - d * Math.cos(h),  cy - d * Math.sin(h)]
      };
    }

    // Échantillonne une période pour savoir quelles formes la famille traverse,
    // et à quelle fréquence (sert aussi à ralentir sur les formes rares).
    var tour = { names: [], freq: {} };
    function resample() {
      var N = 720, counts = {};
      for (var i = 0; i < N; i++) {
        var s = shape(i * 2 * Math.PI / N);
        var n = classify(s.A, s.B, s.C, s.D).name;
        counts[n] = (counts[n] || 0) + 1;
      }
      var names = Object.keys(counts).sort(function (x, y) { return counts[y] - counts[x]; });
      var freq = {};
      names.forEach(function (n) { freq[n] = counts[n] / N; });
      tour = { names: names, freq: freq };
    }

    /* ==================================================================== */
    /* Interface                                                             */
    /* ==================================================================== */
    var mode = 'libre';          // 'libre' | 'construction'
    var playing = true, speed = 1, t = 0, lastFrame = null;

    var root = document.createElement('div');
    root.className = 'quad-ui';
    mv.extras.appendChild(root);

    // Les cases sont visibles d'emblée : c'est le cœur de la leçon. Cocher une
    // case bascule toute seule en mode animation ; le bouton « Déplacer les
    // sommets » ramène à l'exploration libre.
    root.innerHTML =
      '<div class="quad-build">' +
        '<div class="props-label">Je veux un quadrilatère qui a…</div>' +
        '<div class="quad-checks"></div>' +
        '<div class="quad-anim">' +
          '<button class="quad-mode"></button>' +
          '<button class="quad-play"></button>' +
          '<label class="quad-speed-wrap">Vitesse <input class="quad-speed" type="range" min="0.2" max="3" step="0.1" value="1"></label>' +
          '<button class="quad-reset">Tout décocher</button>' +
        '</div>' +
        '<div class="quad-tour"></div>' +
      '</div>' +
      '<div class="props-panel"></div>';

    var checksBox = root.querySelector('.quad-checks');
    var tourBox = root.querySelector('.quad-tour');
    var playBtn = root.querySelector('.quad-play');
    var modeBtn = root.querySelector('.quad-mode');
    var speedWrap = root.querySelector('.quad-speed-wrap');
    var panel = root.querySelector('.props-panel');

    // Une case par propriété.
    var boxes = {};
    PROPS.forEach(function (p) {
      var lab = document.createElement('label');
      lab.className = 'quad-check';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.onchange = function () {
        wanted[p.key] = input.checked;
        setMode('construction');   // cocher une case lance l'animation
        refreshFamily();
      };
      lab.appendChild(input);
      lab.appendChild(document.createTextNode(' ' + p.label));
      var tag = document.createElement('span');
      tag.className = 'quad-implied';
      tag.textContent = 'automatique';
      lab.appendChild(tag);
      checksBox.appendChild(lab);
      boxes[p.key] = { input: input, label: lab };
    });

    // Une propriété impliquée mais non cochée est signalée « automatique ».
    function syncChecks() {
      var imp = implied();
      PROPS.forEach(function (p) {
        var b = boxes[p.key];
        b.label.classList.toggle('is-implied', imp[p.key] && !wanted[p.key]);
      });
    }

    function renderTour() {
      if (mode !== 'construction') {
        tourBox.innerHTML = '<span class="quad-tour-label">Coche une propriété</span> ' +
          'pour que la figure parcoure toutes les formes qui la vérifient.';
        return;
      }
      tourBox.innerHTML = '<span class="quad-tour-label">L\'animation parcourt :</span> ' +
        tour.names.map(function (n) { return '<strong>' + n + '</strong>'; }).join(' ↔ ');
    }

    // Recalcule la famille visée et rafraîchit tout l'affichage.
    function refreshFamily() { resample(); syncChecks(); renderTour(); }

    function setMode(m) {
      if (mode === m) return;
      mode = m;
      var draggable = (mode === 'libre');
      [A, B, C, D].forEach(function (P) { P.setAttribute({ fixed: !draggable, highlight: draggable }); });
      modeBtn.textContent = draggable ? '▶ Animer' : '✋ Déplacer les sommets';
      playBtn.hidden = draggable;
      speedWrap.hidden = draggable;
      if (!draggable) t = 0;
      board.update();
      renderPanel();
    }

    modeBtn.onclick = function () { setMode(mode === 'libre' ? 'construction' : 'libre'); refreshFamily(); };
    playBtn.onclick = function () { playing = !playing; playBtn.textContent = playing ? '❚❚ Pause' : '▶ Lecture'; };
    playBtn.textContent = '❚❚ Pause';
    root.querySelector('.quad-speed').oninput = function () { speed = parseFloat(this.value); };
    root.querySelector('.quad-reset').onclick = function () {
      PROPS.forEach(function (p) { wanted[p.key] = false; boxes[p.key].input.checked = false; });
      refreshFamily();
    };

    // État initial : exploration libre, mais les cases sont bien visibles.
    modeBtn.textContent = '▶ Animer';
    playBtn.hidden = true;
    speedWrap.hidden = true;
    syncChecks();
    renderTour();

    /* ---- Panneau de reconnaissance (identique dans les deux modes) ------ */
    function renderPanel() {
      var pA = xy(A), pB = xy(B), pC = xy(C), pD = xy(D);
      var r = classify(pA, pB, pC, pD);
      var has = checkProps(pA, pB, pC, pD);
      var items = PROPS.filter(function (p) { return has[p.key]; })
        .map(function (p) { return '<li>' + p.label + '</li>'; }).join('');
      quad.setAttribute({ fillColor: r.color });
      panel.innerHTML =
        '<div class="props-name" style="color:' + r.color + '">' + r.name + '</div>' +
        '<div class="props-label">Propriétés vérifiées :</div>' +
        '<ul class="props-list">' + (items || '<li>aucune propriété particulière</li>') + '</ul>';
    }
    board.on('update', renderPanel);

    /* ---- Boucle d'animation --------------------------------------------- */
    function frame(now) {
      if (!root.isConnected) return;           // leçon quittée : on arrête tout
      var dt = lastFrame == null ? 0 : Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;

      if (mode === 'construction' && playing) {
        var s = shape(t);
        A.setPosition(JXG.COORDS_BY_USER, s.A);
        B.setPosition(JXG.COORDS_BY_USER, s.B);
        C.setPosition(JXG.COORDS_BY_USER, s.C);
        D.setPosition(JXG.COORDS_BY_USER, s.D);
        board.update();

        // On ralentit sur les formes rares (le carré au milieu des losanges…)
        // pour laisser le temps de les voir passer.
        var cur = classify(s.A, s.B, s.C, s.D).name;
        var rare = tour.freq[cur] != null && tour.freq[cur] < 0.3;
        t += dt * speed * (rare ? 0.25 : 1) * 0.55;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* ==================================================================== */
    /* Aimantation des configurations remarquables (mode libre uniquement)  */
    /* ==================================================================== */
    var SNAP = 0.35;
    function unit(u) { var n = norm(u); return n > 1e-9 ? [u[0] / n, u[1] / n] : null; }

    function makeSticky(P, n1, n2, diagFrom, diagTo, diagPartner) {
      P.on('drag', function () {
        if (mode !== 'libre') return;
        var px = P.X(), py = P.Y(), best = null;
        function consider(tx, ty) {
          var dd = Math.hypot(tx - px, ty - py);
          if (dd < SNAP && (best === null || dd < best.d)) best = { tx: tx, ty: ty, d: dd };
        }
        // (1) Angle droit en P ⇔ P sur le cercle de diamètre [n1 ; n2] (Thalès).
        var mx = (n1.X() + n2.X()) / 2, my = (n1.Y() + n2.Y()) / 2;
        var r = Math.hypot(n1.X() - n2.X(), n1.Y() - n2.Y()) / 2;
        var vx = px - mx, vy = py - my, vlen = Math.hypot(vx, vy);
        if (vlen > 1e-6 && r > 1e-6) consider(mx + r * vx / vlen, my + r * vy / vlen);
        // (2) Diagonales perpendiculaires.
        var dir = unit(vec(xy(diagFrom), xy(diagTo)));
        if (dir) {
          var pd = px * dir[0] + py * dir[1];
          var cd = diagPartner.X() * dir[0] + diagPartner.Y() * dir[1];
          consider(px - (pd - cd) * dir[0], py - (pd - cd) * dir[1]);
        }
        if (best) { P.setPosition(JXG.COORDS_BY_USER, [best.tx, best.ty]); board.update(); }
        renderPanel();
      });
    }
    makeSticky(A, B, D, B, D, C);
    makeSticky(B, A, C, A, C, D);
    makeSticky(C, B, D, B, D, A);
    makeSticky(D, A, C, A, C, B);

    renderPanel();
  }
});
