/*
 * Mélanges homogènes et hétérogènes (5ème, physique-chimie).
 *
 * Un bécher de 100 mL d'eau, six choses à y verser (sel, sucre, sirop, huile,
 * sable, terre) et une quantité réglable. Quatre gestes, dans l'ordre du
 * laboratoire : verser, agiter, laisser reposer, filtrer. À chaque geste, la
 * figure montre ce qu'on VOIT — des grains qui disparaissent ou qui restent,
 * des gouttelettes qui remontent en couche, une eau qui se trouble ou qui se
 * colore — et le panneau met le mot dessus : soluble, insoluble, soluté,
 * solvant, solution, saturée, miscible, non miscible, décantation, filtration.
 *
 * Le verdict (homogène / hétérogène) n'est jamais écrit d'avance : il découle
 * de l'état après repos. Homogène : on ne distingue pas les constituants à
 * l'œil nu. Hétérogène : on en distingue au moins deux (un dépôt, une couche,
 * un trouble). Le sel au-delà de 36 g pour 100 mL fait basculer le verdict :
 * la solution est saturée, le surplus reste au fond.
 *
 * Tout le dessin est piloté par un ÉTAT (substance, quantité, étape, avancement)
 * que refresh() traduit en positions, tailles, opacités et couleurs AVANT
 * board.update(). Les grains sont une réserve fixe de points réutilisés
 * (grains, gouttelettes, résidu dans le filtre), placés par un générateur
 * pseudo-aléatoire à graine fixe : la même figure à chaque rejeu.
 */
MathsView.register({
  id: 'melanges-homogenes-heterogenes',
  title: 'Mélanges homogènes et hétérogènes',
  level: '5eme',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'Mélanges et solutions',
  theme: 'Eau + sel, eau + huile, eau + sable : que voit-on après agitation, puis au repos ?',
  description:
    'Un bécher de <strong>100 mL d\'eau</strong>. Choisis ce que tu y verses et combien, puis ' +
    'fais les gestes du laboratoire : <strong>verser</strong>, <strong>agiter</strong>, ' +
    '<strong>laisser reposer</strong>, <strong>filtrer</strong>. ' +
    '<br>Après le repos, regarde : si le mélange a <em>le même aspect partout</em>, il est ' +
    '<strong>homogène</strong> ; si tu distingues au moins deux constituants (un dépôt, deux ' +
    'couches, un trouble), il est <strong>hétérogène</strong>. ' +
    'Essaie le sel au-delà de 36 g, et compare l\'huile et le sirop.',
  notes:
    '<ul>' +
    '<li><strong>Mélange ou corps pur ?</strong> Un corps pur ne contient qu\'une seule substance ' +
    '(l\'eau distillée). Un mélange en contient plusieurs — même quand on ne les voit pas.</li>' +
    '<li><strong>Homogène :</strong> on ne distingue pas les constituants à l\'œil nu (eau + sel, ' +
    'eau + sirop). <strong>Hétérogène :</strong> on en distingue au moins deux (eau + sable, ' +
    'eau + huile). Un mélange coloré peut très bien être homogène.</li>' +
    '<li><strong>Dissolution.</strong> Un solide qui disparaît dans l\'eau est <strong>soluble</strong> ' +
    '(sel, sucre) ; il est toujours là, dissous. Le solide est le <strong>soluté</strong>, l\'eau le ' +
    '<strong>solvant</strong>, l\'ensemble une <strong>solution</strong>. Un solide qui reste est ' +
    '<strong>insoluble</strong> (sable).</li>' +
    '<li><strong>Saturation.</strong> L\'eau ne dissout pas sans limite : au-delà de 36 g de sel ' +
    'pour 100 mL, le surplus reste au fond, la solution est <strong>saturée</strong>.</li>' +
    '<li><strong>Miscible ou non.</strong> Deux liquides qui se mélangent sont ' +
    '<strong>miscibles</strong> (eau + sirop) ; sinon ils sont <strong>non miscibles</strong> ' +
    '(eau + huile : deux couches, le moins dense au-dessus).</li>' +
    '<li><strong>Séparer.</strong> La <strong>décantation</strong> laisse le solide se déposer ' +
    '(ou deux liquides se superposer) ; la <strong>filtration</strong> retient un solide insoluble ' +
    'mais laisse passer ce qui est dissous. Pour récupérer le sel d\'une solution, il faut ' +
    '<strong>évaporer</strong> l\'eau.</li>' +
    '</ul>',
  board: { boundingbox: [-6, 7.6, 6, -1.4], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Mélanges homogènes et hétérogènes',
    figures: [{
      legende: 'Homogène : le même aspect partout. Hétérogène : on distingue les constituants.',
      boundingbox: [-7.2, 4.4, 7.2, -1.6],
      largeur: 66, hauteur: 32,
      dessine: function (board) {
        function becher(cx, w, h) {
          board.create('curve', [[cx - w / 2 - 0.15, cx - w / 2, cx - w / 2, cx + w / 2, cx + w / 2, cx + w / 2 + 0.15],
                                 [h, h, 0, 0, h, h]],
            { strokeColor: '#334155', strokeWidth: 1.4, fixed: true, highlight: false });
        }
        function bloc(cx, w, y1, y2, col, op) {
          board.create('curve', [[cx - w / 2, cx + w / 2, cx + w / 2, cx - w / 2, cx - w / 2], [y1, y1, y2, y2, y1]],
            { strokeColor: col, strokeWidth: 0.6, fillColor: col, fillOpacity: op, fixed: true, highlight: false });
        }
        function grain(x, y, col, s) {
          board.create('point', [x, y], { name: '', size: s || 1.2, fillColor: col, strokeColor: col, fixed: true, highlight: false });
        }
        function nom(x, y, s, col, taille) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 9, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        var W = 3.2, H = 3.2;
        // eau + sel : homogène
        bloc(-4.6, W, 0, 2.2, '#60a5fa', .35); becher(-4.6, W, H);
        nom(-4.6, 3.8, 'eau + sel', '#334155'); nom(-4.6, -1.0, 'HOMOGÈNE', '#15803d', 9);
        // eau + huile : deux couches
        bloc(0, W, 0, 2.0, '#60a5fa', .35); bloc(0, W, 2.0, 2.7, '#facc15', .85); becher(0, W, H);
        nom(0, 3.8, 'eau + huile', '#334155'); nom(0, -1.0, 'HÉTÉROGÈNE', '#c2410c', 9);
        nom(1.05, 2.35, 'huile', '#a16207', 7);
        // eau + sable : un dépôt
        bloc(4.6, W, 0, 2.2, '#60a5fa', .35);
        var r = 7;
        for (var i = 0; i < 22; i++) { r = (r * 1664525 + 1013904223) % 4294967296; var u = r / 4294967296;
          r = (r * 1664525 + 1013904223) % 4294967296; var v = r / 4294967296;
          grain(4.6 - W / 2 + 0.25 + u * (W - 0.5), 0.1 + v * 0.35, '#a16207', 1.1); }
        becher(4.6, W, H);
        nom(4.6, 3.8, 'eau + sable', '#334155'); nom(4.6, -1.0, 'HÉTÉROGÈNE', '#c2410c', 9);
        nom(5.75, 0.35, 'dépôt', '#a16207', 7);
      }
    }, {
      legende: 'Filtration : le solide insoluble est retenu, le dissous passe.',
      boundingbox: [-4.4, 5.6, 4.4, -1.2],
      largeur: 40, hauteur: 30,
      dessine: function (board) {
        var cx = 0;
        // bécher du bas
        board.create('curve', [[-1.9, -1.75, -1.75, 1.75, 1.75, 1.9], [2.6, 2.6, 0, 0, 2.6, 2.6]],
          { strokeColor: '#334155', strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('curve', [[-1.75, 1.75, 1.75, -1.75, -1.75], [0, 0, 1.3, 1.3, 0]],
          { strokeColor: '#60a5fa', strokeWidth: 0.6, fillColor: '#60a5fa', fillOpacity: .35, fixed: true, highlight: false });
        // entonnoir
        board.create('curve', [[cx - 1.9, cx - 0.18, cx - 0.18, cx + 0.18, cx + 0.18, cx + 1.9], [5.2, 3.4, 1.9, 1.9, 3.4, 5.2]],
          { strokeColor: '#334155', strokeWidth: 1.4, fixed: true, highlight: false });
        // le filtre (papier plié)
        board.create('curve', [[cx - 1.6, cx, cx + 1.6], [4.95, 3.55, 4.95]],
          { strokeColor: '#64748b', strokeWidth: 1, dash: 2, fixed: true, highlight: false });
        // le résidu
        var r = 11;
        for (var i = 0; i < 16; i++) { r = (r * 1664525 + 1013904223) % 4294967296; var u = r / 4294967296;
          r = (r * 1664525 + 1013904223) % 4294967296; var v = r / 4294967296;
          var y = 3.7 + v * 0.7, hw = 0.1 + (y - 3.55) * 1.05;
          board.create('point', [cx + (u - 0.5) * 2 * hw * 0.85, y], { name: '', size: 1.1, fillColor: '#a16207', strokeColor: '#a16207', fixed: true, highlight: false }); }
        // les gouttes
        [[cx, 1.75], [cx, 1.5]].forEach(function (g) {
          board.create('point', g, { name: '', size: 1, fillColor: '#60a5fa', strokeColor: '#60a5fa', fixed: true, highlight: false });
        });
        function nom(x, y, s, col, taille) {
          board.create('text', [x, y, s], { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 8, color: col || '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        }
        nom(2.9, 4.6, 'filtre', '#64748b'); nom(2.75, 3.75, 'résidu', '#a16207');
        nom(2.9, 0.65, 'filtrat', '#1d4ed8'); nom(-2.9, 0.65, 'limpide', '#1d4ed8');
      }
    }],
    points: [
      'Un <b>mélange</b> contient plusieurs substances ; un <b>corps pur</b> n\'en contient qu\'une (eau distillée).',
      '<b>Homogène :</b> on ne distingue pas les constituants à l\'œil nu (eau + sel, eau + sirop). Coloré n\'est pas hétérogène !',
      '<b>Hétérogène :</b> on distingue au moins deux constituants (eau + sable : un dépôt ; eau + huile : deux couches).',
      '<b>Soluble</b> (sel, sucre) : se dissout, mais reste là. <b>Insoluble</b> (sable) : ne se dissout pas.',
      '<b>Solution</b> = <b>solvant</b> (eau) + <b>soluté</b> (sel dissous). Au-delà de 36 g de sel pour 100 mL : <b>saturée</b>.',
      'Deux liquides qui se mélangent sont <b>miscibles</b> (eau + sirop), sinon <b>non miscibles</b> (eau + huile, le moins dense au-dessus).',
      'Séparer : <b>décantation</b> (laisser reposer) ; <b>filtration</b> (retient le solide insoluble, pas ce qui est dissous).'
    ],
    exemples: [
      'Eau + 20 g de sel, agités : homogène (solution salée). Eau + 40 g : saturée, un dépôt reste, hétérogène.',
      'Eau + huile : hétérogène, l\'huile remonte en couche. Eau + sirop : homogène, même coloré.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les substances                                                        */
    /* ==================================================================== */
    var SUBS = {
      sel:   { nom: 'sel', de: 'de sel', type: 'soluble', solubilite: 36, unite: 'g',
               grain: '#f1f5f9', bord: '#94a3b8', taille: 2.8 },
      sucre: { nom: 'sucre', de: 'de sucre', type: 'soluble', solubilite: 200, unite: 'g',
               grain: '#fffbeb', bord: '#d6d3d1', taille: 2.8 },
      sirop: { nom: 'sirop de menthe', de: 'de sirop de menthe', type: 'miscible', unite: 'mL',
               teinte: '#16a34a' },
      huile: { nom: 'huile', de: 'd\'huile', type: 'nonmiscible', unite: 'mL',
               teinte: '#facc15', grain: '#fde047', bord: '#ca8a04' },
      sable: { nom: 'sable', de: 'de sable', type: 'insoluble', unite: 'g',
               grain: '#d4a373', bord: '#a16207', taille: 3 },
      terre: { nom: 'terre', de: 'de terre', type: 'insoluble', fin: true, unite: 'g',
               grain: '#92400e', bord: '#78350f', taille: 2, teinte: '#92400e' }
    };
    var ORDRE = ['sel', 'sucre', 'sirop', 'huile', 'sable', 'terre'];
    var LIBELLES = { sel: '🧂 Sel', sucre: '🍬 Sucre', sirop: '🍃 Sirop de menthe', huile: '🫒 Huile', sable: '🏖 Sable', terre: '🪴 Terre' };

    /* ==================================================================== */
    /* La géométrie du laboratoire                                           */
    /* ==================================================================== */
    var B1 = { x1: -5.4, x2: -1.6, h: 5.2 };      // le bécher de gauche : le mélange
    var B2 = { x1: 1.6, x2: 5.4, h: 3.4 };        // le bécher de droite : le filtrat
    var CX1 = (B1.x1 + B1.x2) / 2, CX2 = (B2.x1 + B2.x2) / 2;
    var EAU = 3.0;                                 // hauteur de 100 mL d'eau
    var FILTRAT_H = 2.4;                           // hauteur du filtrat, une fois tout passé
    var CONE = { haut: 6.6, bas: 4.6, demi: 1.5, tige: 2.8, col: 0.16 };
    var N = 36;                                    // la réserve de grains
    var QMAX = 50;
    var C_EAU = '#60a5fa', OP_EAU = 0.35;

    /* Un générateur à graine fixe : les mêmes positions à chaque rejeu. */
    function alea(graine) {
      var s = graine;
      return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    }
    var rnd = alea(2024);
    var TAS = [], DISPERSE = [], DESSUS = [], FILTRE = [];
    for (var i = 0; i < N; i++) {
      TAS.push({ x: B1.x1 + 0.35 + rnd() * (B1.x2 - B1.x1 - 0.7), y: 0.12 + rnd() * 0.5 });
      DISPERSE.push({ x: B1.x1 + 0.35 + rnd() * (B1.x2 - B1.x1 - 0.7), y: 0.4 + rnd() * 2.3 });
      DESSUS.push({ x: CX1 + (rnd() - 0.5) * 1.4, y: 6.3 + rnd() * 0.8 });
      var yf = 4.95 + rnd() * 0.85, hw = CONE.col + (yf - CONE.bas) / (CONE.haut - CONE.bas) * (CONE.demi - CONE.col);
      FILTRE.push({ x: CX2 + (rnd() - 0.5) * 2 * hw * 0.8, y: yf });
    }

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var sub = 'sel', q = 20;
    var phase = 0;      // 0 eau seule · 1 versé · 2 agité · 3 au repos · 4 filtré
    var prog = 1;       // avancement de la transition (phase − 1) → phase
    var refs = null, chips = {};

    function mix(a, b, t) {
      function h(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
      var A = h(a), B = h(b), out = '#';
      for (var i = 0; i < 3; i++) { var v = Math.round(A[i] + (B[i] - A[i]) * t); out += (v < 16 ? '0' : '') + v.toString(16); }
      return out;
    }
    function S() { return SUBS[sub]; }
    function nVisibles() { return Math.round(N * q / QMAX); }
    function nReste() {        // grains de soluble qui ne se dissolvent pas (saturation)
      var s = S(); if (s.type !== 'soluble' || q === 0) return 0;
      return Math.round(nVisibles() * Math.max(0, q - s.solubilite) / q);
    }

    // Le bilan ne dépend que de la substance et de la quantité : c'est la
    // physique. Le dessin, lui, doit le MONTRER — le contrôle s'en assure.
    function bilan() {
      var s = S();
      if (q === 0) return { code: 'pur', homogene: null };
      if (s.type === 'soluble') return q <= s.solubilite ? { code: 'dissous', homogene: true } : { code: 'sature', homogene: false };
      if (s.type === 'miscible') return { code: 'miscible', homogene: true };
      if (s.type === 'nonmiscible') return { code: 'nonmiscible', homogene: false };
      return { code: s.fin ? 'trouble' : 'depot', homogene: false };
    }

    /* La disposition visée à la fin d'une phase. Tout y est numérique pour
       pouvoir interpoler entre deux phases. */
    function disposition(ph) {
      var s = S(), nv = nVisibles(), nr = nReste(), i;
      var D = { niveau: EAU, eau: { col: C_EAU, op: OP_EAU }, haut: 0, bas: 0, grains: [],
                montre: 0, filtrat: { niveau: 0, col: C_EAU, op: OP_EAU, haut: 0 }, residus: [] };
      var tailleG = s.taille || 0;
      for (i = 0; i < N; i++) { D.grains.push({ x: DESSUS[i].x, y: DESSUS[i].y, taille: tailleG, op: 0 }); D.residus.push({ x: FILTRE[i].x, y: FILTRE[i].y, taille: tailleG, op: 0 }); }
      if (ph === 0 || q === 0) return D;
      var liquide = s.type === 'miscible' || s.type === 'nonmiscible';
      var ep = q * 0.02;                                    // épaisseur d'un liquide versé
      var teinteSirop = { col: mix(C_EAU, s.teinte || C_EAU, 0.15 + 0.8 * q / QMAX), op: 0.75 };
      var trouble = { col: mix(C_EAU, s.teinte || C_EAU, 0.9 * q / QMAX), op: 0.55 + 0.35 * q / QMAX };
      var presque = { col: mix(C_EAU, s.teinte || C_EAU, 0.22 * q / QMAX), op: 0.55 };

      function tas(k) { for (i = 0; i < k; i++) D.grains[i] = { x: TAS[i].x, y: TAS[i].y, taille: tailleG, op: 1 }; }
      function disperse(a, b, taille, op) { for (i = a; i < b; i++) D.grains[i] = { x: DISPERSE[i].x, y: DISPERSE[i].y, taille: taille, op: op }; }

      /* --- versé -------------------------------------------------------- */
      if (!liquide) { D.niveau = EAU + q * 0.004; tas(nv); }
      else if (s.type === 'nonmiscible') { D.haut = ep; for (i = 0; i < nv; i++) D.grains[i] = { x: DISPERSE[i].x, y: EAU + ep / 2, taille: 5.5, op: 0 }; }
      else { D.bas = ep; D.niveau = EAU + ep; }
      if (ph === 1) return D;

      /* --- agité -------------------------------------------------------- */
      if (s.type === 'soluble') { disperse(nr, nv, 0, 0); }
      else if (s.type === 'insoluble') { disperse(0, nv, tailleG, 1); if (s.fin) D.eau = trouble; }
      else if (s.type === 'nonmiscible') { D.haut = 0; D.niveau = EAU + ep; disperse(0, nv, 5.5, 0.95); }
      else { D.bas = 0; D.eau = teinteSirop; }
      if (ph === 2) return D;

      /* --- au repos ----------------------------------------------------- */
      if (s.type === 'insoluble') { tas(nv); D.eau = s.fin ? presque : { col: C_EAU, op: OP_EAU }; }
      else if (s.type === 'nonmiscible') {
        D.haut = ep; D.niveau = EAU;
        for (i = 0; i < nv; i++) D.grains[i] = { x: DISPERSE[i].x, y: EAU + ep / 2, taille: 5.5, op: 0 };
      }
      if (ph === 3) return D;

      /* --- filtré ------------------------------------------------------- */
      D.montre = 1;
      D.filtrat.niveau = 1;
      if (s.type === 'miscible') D.filtrat = { niveau: 1, col: teinteSirop.col, op: teinteSirop.op, haut: 0 };
      else if (s.type === 'nonmiscible') D.filtrat = { niveau: 1, col: C_EAU, op: OP_EAU, haut: ep * 0.8 };
      var retenus = s.type === 'insoluble' ? nv : nr;
      for (i = 0; i < retenus; i++) D.residus[i].op = 1;
      return D;
    }

    function lerp(a, b, t) { return a + (b - a) * t; }
    function entre(A, B, t) {
      if (t >= 1) return B;
      var D = { niveau: lerp(A.niveau, B.niveau, t), haut: lerp(A.haut, B.haut, t), bas: lerp(A.bas, B.bas, t),
                eau: { col: mix(A.eau.col, B.eau.col, t), op: lerp(A.eau.op, B.eau.op, t) },
                // Le dispositif de filtration apparaît dès qu'on commence à filtrer.
                montre: Math.max(A.montre, B.montre), grains: [], residus: [],
                filtrat: { niveau: lerp(A.filtrat.niveau, B.filtrat.niveau, t), col: mix(A.filtrat.col, B.filtrat.col, t),
                           op: lerp(A.filtrat.op, B.filtrat.op, t), haut: lerp(A.filtrat.haut, B.filtrat.haut, t) } };
      for (var i = 0; i < N; i++) {
        var ga = A.grains[i], gb = B.grains[i];
        // Un grain qui apparaît le fait d'un coup (on le verse) ; un grain qui
        // s'efface le fait lentement (il se dissout, la goutte rejoint la couche).
        var wo = gb.op > ga.op ? Math.min(1, t * 4) : t;
        D.grains.push({ x: lerp(ga.x, gb.x, t), y: lerp(ga.y, gb.y, t), taille: lerp(ga.taille, gb.taille, t), op: lerp(ga.op, gb.op, wo) });
        var ra = A.residus[i], rb = B.residus[i];
        D.residus.push({ x: rb.x, y: rb.y, taille: rb.taille, op: lerp(ra.op, rb.op, t) });
      }
      return D;
    }
    var L = disposition(0);      // la disposition courante, lue par les courbes

    /* ==================================================================== */
    /* Les objets                                                            */
    /* ==================================================================== */
    function becher(B) {
      board.create('curve', [[B.x1 - 0.18, B.x1, B.x1, B.x2, B.x2, B.x2 + 0.18], [B.h, B.h, 0, 0, B.h, B.h]],
        { strokeColor: '#334155', strokeWidth: 2.2, fixed: true, highlight: false, layer: 9 });
    }
    function bloc(fx1, fx2, fy1, fy2, col, op, extra) {
      var c = board.create('curve', [[0], [0]], Object.assign({ strokeWidth: 0.8, fillColor: col, strokeColor: col, fillOpacity: op, strokeOpacity: op, fixed: true, highlight: false }, extra || {}));
      c.updateDataArray = function () {
        var x1 = fx1(), x2 = fx2(), y1 = fy1(), y2 = fy2();
        this.dataX = [x1, x2, x2, x1, x1]; this.dataY = [y1, y1, y2, y2, y1];
      };
      return c;
    }
    var eau = bloc(function () { return B1.x1; }, function () { return B1.x2; }, function () { return L.bas; }, function () { return L.niveau; }, C_EAU, OP_EAU);
    var coucheBas = bloc(function () { return B1.x1; }, function () { return B1.x2; }, function () { return 0; }, function () { return L.bas; }, '#16a34a', 0.8);
    var coucheHaut = bloc(function () { return B1.x1; }, function () { return B1.x2; }, function () { return L.niveau; }, function () { return L.niveau + L.haut; }, '#facc15', 0.85);
    var filtrat = bloc(function () { return B2.x1; }, function () { return B2.x2; }, function () { return 0; }, function () { return L.filtrat.niveau * FILTRAT_H; }, C_EAU, OP_EAU);
    var filtratHaut = bloc(function () { return B2.x1; }, function () { return B2.x2; }, function () { return L.filtrat.niveau * FILTRAT_H; }, function () { return L.filtrat.niveau * (FILTRAT_H + L.filtrat.haut); }, '#facc15', 0.85);
    becher(B1);
    var becher2 = board.create('curve', [[B2.x1 - 0.18, B2.x1, B2.x1, B2.x2, B2.x2, B2.x2 + 0.18], [B2.h, B2.h, 0, 0, B2.h, B2.h]],
      { strokeColor: '#334155', strokeWidth: 2.2, fixed: true, highlight: false, layer: 9 });
    var entonnoir = board.create('curve', [[CX2 - CONE.demi - 0.1, CX2 - CONE.col, CX2 - CONE.col, CX2 + CONE.col, CX2 + CONE.col, CX2 + CONE.demi + 0.1],
                                           [CONE.haut, CONE.bas, CONE.tige, CONE.tige, CONE.bas, CONE.haut]],
      { strokeColor: '#334155', strokeWidth: 2, fixed: true, highlight: false, layer: 9 });
    var papier = board.create('curve', [[CX2 - CONE.demi * 0.85, CX2, CX2 + CONE.demi * 0.85], [CONE.haut - 0.35, CONE.bas + 0.2, CONE.haut - 0.35]],
      { strokeColor: '#64748b', strokeWidth: 1.2, dash: 2, fixed: true, highlight: false });
    var goutte = board.create('point', [CX2, CONE.tige - 0.25], { name: '', size: 2.5, fillColor: C_EAU, strokeColor: C_EAU, fixed: true, highlight: false });

    function point(p, col, bord) {
      return board.create('point', [p.x, p.y], { name: '', withLabel: false, size: 2, fillColor: col, strokeColor: bord, strokeWidth: 1, fixed: true, highlight: false, visible: false, layer: 8 });
    }
    var grains = [], residus = [];
    for (i = 0; i < N; i++) { grains.push(point(DESSUS[i], '#fff', '#94a3b8')); residus.push(point(FILTRE[i], '#fff', '#94a3b8')); }

    function texte(x, y, f, taille, col, anchorX) {
      return board.create('text', [x, y, f], { anchorX: anchorX || 'middle', anchorY: 'middle', fontSize: taille, strokeColor: col, cssStyle: 'font-weight:700', fixed: true, highlight: false });
    }
    // Le verdict part du bord gauche du bécher : les plus longs s'étalent vers la droite, au-dessus de l'entonnoir.
    var verdict = texte(B1.x1 - 0.2, 7.0, verdictTexte, 15, '#64748b', 'left');
    var legende1 = texte(CX1, -0.75, legendeTexte, 13, '#334155');
    var legende2 = texte(CX2, -0.75, filtratTexte, 13, '#1d4ed8');
    var lblFiltre = texte(CX2 + CONE.demi + 0.55, CONE.haut - 0.55, function () { return 'filtre'; }, 12, '#64748b');
    var lblEau = texte(B1.x1 + 0.45, EAU + 0.22, function () { return q === 0 || phase === 0 ? '100 mL' : ''; }, 10, '#1d4ed8');

    function fmtQ() { return q + ' ' + S().unite; }
    function verdictTexte() {
      var b = bilan();
      if (phase === 0 || b.code === 'pur') return 'Eau seule : un corps pur, pas un mélange';
      if (phase === 1) return 'Eau + ' + S().nom + ' : on vient de verser';
      if (phase === 2) {
        return b.homogene ? 'Mélange homogène' :
          b.code === 'sature' ? 'Mélange hétérogène : un dépôt reste' :
          b.code === 'nonmiscible' ? 'Mélange hétérogène : des gouttelettes' :
          b.code === 'trouble' ? 'Mélange hétérogène : l\'eau est trouble' : 'Mélange hétérogène : des grains en suspension';
      }
      return b.homogene ? 'Mélange homogène : rien ne se sépare' :
        b.code === 'nonmiscible' ? 'Mélange hétérogène : deux couches' :
        b.code === 'trouble' ? 'Mélange hétérogène : un dépôt, l\'eau reste trouble' : 'Mélange hétérogène : un dépôt au fond';
    }
    function legendeTexte() {
      return q === 0 ? 'Eau (100 mL)' : 'Eau (100 mL) + ' + fmtQ() + ' ' + S().de;
    }
    function filtratTexte() {
      if (phase < 4 || q === 0) return '';
      var b = bilan();
      if (b.code === 'miscible') return 'Filtrat : du sirop dilué, homogène';
      if (b.code === 'nonmiscible') return 'Filtrat : eau + huile, toujours deux couches';
      if (b.code === 'dissous' || b.code === 'sature') return 'Filtrat : limpide… et salé';
      return 'Filtrat : de l\'eau limpide';
    }

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function refresh() {
      L = phase === 0 ? disposition(0) : entre(disposition(phase - 1), disposition(phase), prog);
      var s = S(), i;
      eau.setAttribute({ fillColor: L.eau.col, strokeColor: L.eau.col, fillOpacity: L.eau.op, strokeOpacity: L.eau.op });
      coucheHaut.setAttribute({ visible: L.haut > 0.001 });
      coucheBas.setAttribute({ visible: L.bas > 0.001, fillColor: s.teinte || '#16a34a', strokeColor: s.teinte || '#16a34a' });
      var m = L.montre > 0.5;
      [becher2, entonnoir, papier, lblFiltre, legende2].forEach(function (o) { o.setAttribute({ visible: m }); });
      filtrat.setAttribute({ visible: m && L.filtrat.niveau > 0.001, fillColor: L.filtrat.col, strokeColor: L.filtrat.col, fillOpacity: L.filtrat.op, strokeOpacity: L.filtrat.op });
      filtratHaut.setAttribute({ visible: m && L.filtrat.haut > 0.001 });
      goutte.setAttribute({ visible: m && L.filtrat.niveau > 0.001 && L.filtrat.niveau < 0.999 });
      var colG = s.grain || '#fff', bordG = s.bord || '#94a3b8';
      for (i = 0; i < N; i++) {
        var g = L.grains[i], v = g.op > 0.02 && g.taille > 0.2;
        grains[i].setPosition(JXG.COORDS_BY_USER, [g.x, g.y]);
        grains[i].setAttribute({ visible: v, size: g.taille, fillOpacity: g.op, strokeOpacity: g.op, fillColor: colG, strokeColor: bordG });
        var r = L.residus[i], vr = m && r.op > 0.02 && r.taille > 0.2;
        residus[i].setPosition(JXG.COORDS_BY_USER, [r.x, r.y]);
        residus[i].setAttribute({ visible: vr, size: r.taille, fillOpacity: r.op, strokeOpacity: r.op, fillColor: colG, strokeColor: bordG });
      }
      var b = bilan();
      verdict.setAttribute({ strokeColor: phase < 2 || b.code === 'pur' ? '#64748b' : b.homogene ? '#15803d' : '#c2410c' });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Le panneau : un mot sur chaque geste                                  */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    // (ajouté sous les contrôles, plus bas : on choisit, on agit, puis on lit)

    function texteEtape(ph) {
      var s = S(), b = bilan(), nom = s.nom;
      if (ph === 1) {
        if (s.type === 'nonmiscible') return 'On verse ' + fmtQ() + ' ' + s.de + ' : elle reste <b>au-dessus</b> de l\'eau, elle est moins dense.';
        if (s.type === 'miscible') return 'On verse ' + fmtQ() + ' ' + s.de + ' : plus dense, il tombe au <b>fond</b>.';
        return 'On verse ' + fmtQ() + ' ' + s.de + ' : les grains tombent au fond.';
      }
      if (ph === 2) {
        if (b.code === 'dissous') return 'On agite : les grains disparaissent, le ' + nom + ' se <b>dissout</b>. Il est toujours là (goûte !), mais on ne le voit plus. Le ' + nom + ' est le <b>soluté</b>, l\'eau le <b>solvant</b> : on a fabriqué une <b>solution</b>.';
        if (b.code === 'sature') return 'On agite : une partie du ' + nom + ' se dissout, mais ' + s.solubilite + ' g suffisent à <b>saturer</b> 100 mL d\'eau. Le reste ne se dissout plus et retombe au fond.';
        if (b.code === 'depot') return 'On agite : les grains se dispersent dans l\'eau mais ne disparaissent pas. Le ' + nom + ' est <b>insoluble</b>.';
        if (b.code === 'trouble') return 'On agite : la terre ne se dissout pas, elle est <b>insoluble</b>. Ses particules les plus fines restent en suspension : l\'eau devient <b>trouble</b>.';
        if (b.code === 'nonmiscible') return 'On agite : l\'huile se disperse en <b>gouttelettes</b>, mais elle ne se dissout pas. L\'eau et l\'huile ne sont pas <b>miscibles</b>.';
        return 'On agite : le sirop se répartit partout, l\'eau et le sirop sont <b>miscibles</b>. Le mélange est coloré, mais on ne distingue plus le sirop de l\'eau.';
      }
      if (ph === 3) {
        if (b.code === 'dissous') return 'On laisse reposer : rien ne se dépose, le ' + nom + ' reste dissous. Le mélange a le même aspect partout : il est <b>homogène</b>.';
        if (b.code === 'sature') return 'On laisse reposer : le ' + nom + ' en trop reste au fond. On distingue deux constituants : le mélange est <b>hétérogène</b>. La solution au-dessus est <b>saturée</b>.';
        if (b.code === 'depot') return 'On laisse reposer : les grains se déposent au fond, c\'est la <b>décantation</b>. On distingue l\'eau et le sable : mélange <b>hétérogène</b>.';
        if (b.code === 'trouble') return 'On laisse reposer : les grains les plus gros se déposent (<b>décantation</b>), mais l\'eau reste un peu trouble. Mélange <b>hétérogène</b>.';
        if (b.code === 'nonmiscible') return 'On laisse reposer : les gouttelettes remontent et se rassemblent. L\'huile, moins dense, forme une couche au-dessus de l\'eau : deux couches, mélange <b>hétérogène</b>.';
        return 'On laisse reposer : rien ne se sépare, le mélange reste <b>homogène</b>.';
      }
      if (b.code === 'depot') return 'On filtre : le filtre retient le sable, le <b>filtrat</b> est de l\'eau limpide. La <b>filtration</b> sépare un solide insoluble d\'un liquide.';
      if (b.code === 'trouble') return 'On filtre : le filtre retient la terre, même les particules fines. Le <b>filtrat</b> est limpide : la <b>filtration</b> réussit là où la décantation ne suffisait pas.';
      if (b.code === 'dissous') return 'On filtre : le filtrat est limpide… mais toujours salé ! Le ' + nom + ' dissous passe à travers le filtre. La <b>filtration</b> ne sépare pas un mélange homogène ; pour récupérer le ' + nom + ', il faut faire <b>évaporer</b> l\'eau.';
      if (b.code === 'sature') return 'On filtre : le filtre retient le ' + nom + ' non dissous ; le filtrat reste une solution saturée, limpide et salée.';
      if (b.code === 'nonmiscible') return 'On filtre : l\'eau et l\'huile passent toutes les deux, la <b>filtration</b> ne sépare pas deux liquides. Pour les séparer, on <b>décante</b> (dans une ampoule à décanter).';
      return 'On filtre : tout passe, le filtre ne retient rien d\'un mélange homogène.';
    }
    var NOMS = ['', 'Verser', 'Agiter', 'Laisser reposer', 'Filtrer'];
    function ecrirePanneau() {
      var b = bilan(), html = '<div class="props-label">' + legendeTexte() + '</div>';
      if (q === 0) {
        html += '<p>Pas de mélange : l\'eau seule est un <b>corps pur</b>. Choisis une quantité à verser.</p>';
      } else if (phase === 0) {
        html += '<p>Lance les gestes : verser, agiter, laisser reposer, filtrer. Le verdict vient <em>après le repos</em>.</p>';
      } else {
        html += '<ol class="melange-etapes">';
        for (var ph = 1; ph <= phase; ph++) {
          html += '<li class="' + (ph === phase ? 'courante' : '') + '"><b>' + NOMS[ph] + '.</b> ' + texteEtape(ph) + '</li>';
        }
        html += '</ol>';
        if (phase >= 3) {
          html += '<p class="melange-bilan ' + (b.homogene ? 'homogene' : 'heterogene') + '">Eau + ' + S().nom + ' : mélange <b>' +
            (b.homogene ? 'homogène' : 'hétérogène') + '</b> — ' +
            (b.homogene ? 'on ne distingue pas ses constituants à l\'œil nu.' : 'on distingue au moins deux constituants.') + '</p>';
        }
      }
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les gestes, en quatre étapes absolues                                 */
    /* ==================================================================== */
    var anim = null;   // créé sous les contrôles, pour que la ligne « pas à pas » s'y range
    function raz() { phase = 0; prog = 1; redraw(); }
    function etape(ph, dur) {
      return { dur: dur, step: function (p) { phase = ph; prog = p; refresh(); },
               after: function () { phase = ph; prog = 1; refresh(); } };
    }
    function gestes() {
      raz();
      anim.runSteps([etape(1, 900), etape(2, 1400), etape(3, 1600), etape(4, 1600)], raz);
    }

    /* ==================================================================== */
    /* Les choix : la substance, la quantité                                 */
    /* ==================================================================== */
    var choix = document.createElement('div');
    choix.className = 'ineq-presets melange-choix';
    ORDRE.forEach(function (k) {
      var bt = document.createElement('button');
      bt.type = 'button';
      bt.className = 'ineq-preset' + (k === sub ? ' active' : '');
      bt.textContent = LIBELLES[k];
      bt.onclick = function () { choisir(k); };
      choix.appendChild(bt);
      chips[k] = bt;
    });
    mv.extras.appendChild(choix);

    function choisir(k) {
      if (!SUBS[k]) return;
      sub = k;
      ORDRE.forEach(function (j) { chips[j].className = 'ineq-preset' + (j === sub ? ' active' : ''); });
      anim.cancel();
      gestes();
    }
    function quantite(v) {
      q = Math.max(0, Math.min(QMAX, Math.round(v)));
      anim.cancel();
      gestes();
    }

    refs = mv.addControls([
      { type: 'slider', id: 'quantite', label: 'Quantité versée (g ou mL)', min: 0, max: QMAX, step: 1, value: q, onInput: quantite },
      { type: 'button', id: 'gestes', label: '▶ Verser, agiter, reposer, filtrer', onClick: function () { anim.cancel(); gestes(); } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); raz(); } }
    ]);

    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    gestes();   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
