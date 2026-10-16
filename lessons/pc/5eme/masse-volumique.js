/*
 * La masse volumique (5ème, physique-chimie).
 *
 * Un litre d'huile pèse moins qu'un litre d'eau, un litre de fer bien plus :
 * à volume égal, les matières n'ont pas la même masse. La masse volumique
 * d'une matière, c'est la masse d'UNE unité de volume : ρ = m / V.
 *
 * Trois volets, trois choses à retenir :
 *
 *  1. LES FORMULES. Le triangle : m en haut, ρ et V en bas côte à côte. On
 *     cache la lettre qu'on cherche, et ce qui reste se lit comme la formule :
 *     ρ = m ÷ V, m = ρ × V, V = m ÷ ρ. Six exemples numériques, deux par
 *     lettre, avec les unités qui suivent le calcul.
 *
 *  2. LES UNITÉS. La masse volumique se donne en g/cm³, g/mL, kg/dm³ ou kg/L :
 *     une unité de masse SUR une unité de volume qui vont ensemble — et ces
 *     quatre-là valent le même nombre. Quand les données ne vont pas ensemble
 *     (920 g et 1 L), on choisit l'unité de ρ, on convertit, et SEULEMENT
 *     ENSUITE on divise. Six situations, dont deux où il n'y a rien à faire.
 *
 *  3. FLOTTE OU COULE. Un aquarium d'eau (1 g/cm³) où l'on plonge des solides
 *     et des liquides : moins dense que l'eau, ça flotte (et ça s'enfonce
 *     d'autant plus que ρ est proche de 1) ; plus dense, ça coule. L'huile se
 *     range au-dessus de l'eau, le miel au fond. À droite, l'axe des masses
 *     volumiques avec la ligne de l'eau : tout se lit dessus.
 *
 * Tout le dessin découle d'un ÉTAT (le volet, la sélection, la phase et son
 * avancement) que refresh() traduit en positions et attributs AVANT
 * board.update(). Chaque étape pose un état absolu.
 */
MathsView.register({
  id: 'masse-volumique',
  title: 'La masse volumique',
  level: '5eme',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'Masse, volume, masse volumique',
  exercices: ['pc-masse-volumique'],
  theme: 'Trois formules dans un triangle, des unités qui vont ensemble, et l\'eau pour juge : ça flotte ou ça coule',
  description:
    'La <strong>masse volumique</strong> d\'une matière, c\'est la masse d\'<strong>une unité de volume</strong> : ' +
    '\\( \\rho = \\dfrac{m}{V} \\). Un litre d\'huile pèse moins qu\'un litre d\'eau, un litre de fer bien plus.' +
    '<br>Trois volets. <strong>Les formules</strong> : dans le triangle, m en haut, ρ et V en bas ; cache ce que tu ' +
    'cherches, il reste la formule. <strong>Les unités</strong> : avant de diviser, une masse et un volume qui vont ' +
    'ensemble (g et cm³, g et mL, kg et dm³, kg et L), quitte à convertir d\'abord. <strong>Flotte ou coule</strong> : ' +
    'on plonge dans l\'eau (1 g/cm³) des solides et des liquides de toutes masses volumiques.',
  notes:
    '<ul>' +
    '<li><strong>Définition.</strong> La masse volumique d\'une matière est la masse d\'une unité de ' +
    'volume : \\( \\rho = \\dfrac{m}{V} \\). Elle caractérise la matière, pas l\'objet : 10 cm³ ou 200 cm³ de fer, ' +
    'toujours 7,8 g/cm³.</li>' +
    '<li><strong>Les trois formules.</strong> Dans le triangle (m en haut, ρ et V en bas), on cache ce qu\'on cherche : ' +
    '\\( \\rho = \\dfrac{m}{V} \\), \\( m = \\rho \\times V \\), \\( V = \\dfrac{m}{\\rho} \\). Connaissant deux des ' +
    'trois grandeurs, on trouve la troisième.</li>' +
    '<li><strong>Les unités.</strong> Une masse <em>sur</em> un volume qui vont ensemble : <strong>g/cm³</strong>, ' +
    '<strong>g/mL</strong>, <strong>kg/dm³</strong>, <strong>kg/L</strong>. Comme 1 cm³ = 1 mL et 1 dm³ = 1 L, ces ' +
    'quatre unités donnent le <strong>même nombre</strong> : l\'eau, c\'est 1 g/cm³ = 1 g/mL = 1 kg/dm³ = 1 kg/L.</li>' +
    '<li><strong>Convertir avant de diviser.</strong> 920 g et 1 L ne vont pas ensemble : on passe le litre en ' +
    'millilitres (1 L = 1 000 mL) et alors ρ = 920 ÷ 1 000 = 0,92 g/mL. Diviser directement donnerait « 920 g/L », ' +
    'ce qui est juste mais mille fois plus grand : 1 g/mL = 1 000 g/L, et 1 g/cm³ = 1 000 kg/m³.</li>' +
    '<li><strong>Flotter ou couler.</strong> L\'eau fait 1 g/cm³. Moins dense (ρ &lt; 1), ça flotte : liège, bois, ' +
    'glace, huile — et ça s\'enfonce d\'autant plus que ρ est proche de 1. Plus dense (ρ &gt; 1), ça coule : verre, ' +
    'métaux, miel. Un liquide qui ne se mélange pas à l\'eau se range de la même façon : l\'huile au-dessus, le miel ' +
    'au fond.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6.2, 8, -3.4], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'La masse volumique',
    figures: [{
      legende: 'Le triangle : cache ce que tu cherches, il reste la formule.',
      boundingbox: [-2, 36, 52, -2],
      keepaspectratio: false,
      largeur: 50, hauteur: 34,
      dessine: function (board) {
        var A = [11, 32], B = [0, 2], C = [22, 2], yd = 14, xg = 4.4, xd = 17.6;
        function seg(a, b) { board.create('segment', [a, b], { strokeColor: '#1e293b', strokeWidth: 1.4, fixed: true, highlight: false }); }
        seg(A, B); seg(B, C); seg(C, A); seg([xg, yd], [xd, yd]); seg([11, 2], [11, yd]);
        board.create('text', [11, 22, 'm'], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: '#1e293b', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [7, 7.5, 'ρ'], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: '#1e293b', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [15, 7.5, 'V'], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: '#1e293b', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        [['ρ = m ÷ V', 'cache ρ : m au-dessus de V', 30], ['m = ρ × V', 'cache m : ρ et V côte à côte', 19], ['V = m ÷ ρ', 'cache V : m au-dessus de ρ', 8]].forEach(function (f) {
          board.create('text', [27, f[2], f[0]], { anchorX: 'left', anchorY: 'middle', fontSize: 8, color: '#c2410c', cssStyle: 'font-weight:700', fixed: true, highlight: false });
          board.create('text', [27, f[2] - 4.5, f[1]], { anchorX: 'left', anchorY: 'middle', fontSize: 5.5, color: '#64748b', fixed: true, highlight: false });
        });
      }
    }],
    points: [
      'La <b>masse volumique</b> d\'une matière, c\'est la masse d\'<b>une unité de volume</b> : \\( \\rho = \\dfrac{m}{V} \\). Même nombre quel que soit le morceau : elle caractérise la <b>matière</b>.',
      'Les trois formules du triangle : \\( \\rho = \\dfrac{m}{V} \\), \\( m = \\rho \\times V \\), \\( V = \\dfrac{m}{\\rho} \\).',
      'Des unités qui vont ensemble : g avec cm³ ou mL, kg avec dm³ ou L. <b>1 g/cm³ = 1 g/mL = 1 kg/dm³ = 1 kg/L</b> : même nombre.',
      'Avant de diviser, convertis : 920 g et 1 L → 920 g et 1 000 mL → ρ = 0,92 g/mL. Piège : g/L et kg/m³, c\'est × 1 000 (0,92 g/mL = 920 g/L).',
      'Eau : 1 g/cm³. ρ < 1, ça <b>flotte</b> (liège 0,24 ; chêne 0,7 ; huile 0,92 ; glace 0,92). ρ > 1, ça <b>coule</b> (miel 1,4 ; verre 2,5 ; fer 7,8).',
      'Un liquide qui ne se mélange pas à l\'eau se range pareil : l\'huile au-dessus de l\'eau, le miel au fond.'
    ],
    exemples: [
      'Fer : 390 g pour 50 cm³ → ρ = 390 ÷ 50 = 7,8 g/cm³. Il coule.',
      'Huile : ρ = 0,92 g/mL et V = 500 mL → m = 0,92 × 500 = 460 g.',
      'Or : m = 386 g et ρ = 19,3 g/cm³ → V = 386 ÷ 19,3 = 20 cm³.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les données des trois volets                                          */
    /* ==================================================================== */
    // 1. Les formules : ce qu'on cherche, et les deux données.
    var FORMULES = [
      { cle: 'rho-fer', cherche: 'rho', nom: 'un bloc de fer', m: 390, um: 'g', V: 50, uv: 'cm³', rho: 7.8, ur: 'g/cm³', bilan: 'chaque cm³ de fer pèse 7,8 g' },
      { cle: 'rho-lait', cherche: 'rho', nom: 'un verre de lait', m: 206, um: 'g', V: 200, uv: 'mL', rho: 1.03, ur: 'g/mL', bilan: 'chaque mL de lait pèse 1,03 g' },
      { cle: 'm-huile', cherche: 'm', nom: 'une bouteille d\'huile', m: 460, um: 'g', V: 500, uv: 'mL', rho: 0.92, ur: 'g/mL', bilan: '500 mL d\'huile pèsent 460 g' },
      { cle: 'm-alu', cherche: 'm', nom: 'un cube d\'aluminium', m: 270, um: 'g', V: 100, uv: 'cm³', rho: 2.7, ur: 'g/cm³', bilan: '100 cm³ d\'aluminium pèsent 270 g' },
      { cle: 'V-or', cherche: 'V', nom: 'un lingot d\'or', m: 386, um: 'g', V: 20, uv: 'cm³', rho: 19.3, ur: 'g/cm³', bilan: '386 g d\'or tiennent dans 20 cm³' },
      { cle: 'V-essence', cherche: 'V', nom: 'un bidon d\'essence', m: 30, um: 'kg', V: 40, uv: 'L', rho: 0.75, ur: 'kg/L', bilan: '30 kg d\'essence remplissent 40 L' }
    ];
    var LETTRE = { rho: 'ρ', m: 'm', V: 'V' };
    var FORMS = [
      { cle: 'rho', txt: 'ρ = m ÷ V', lecture: 'm au-dessus de V', y: 4.0 },
      { cle: 'm', txt: 'm = ρ × V', lecture: 'ρ et V côte à côte', y: 2.9 },
      { cle: 'V', txt: 'V = m ÷ ρ', lecture: 'm au-dessus de ρ', y: 1.8 }
    ];
    // 2. Les unités : les quatre couples qui vont ensemble, et six situations.
    var PAIRES = [['g', 'cm³', 'g/cm³'], ['g', 'mL', 'g/mL'], ['kg', 'dm³', 'kg/dm³'], ['kg', 'L', 'kg/L']];
    // conv : ce qu'on convertit (m ou V), la valeur convertie et son unité ; alt : l'autre chemin possible.
    var UNITES = [
      { cle: 'huile', nom: 'une bouteille d\'huile', m: 920, um: 'g', V: 1, uv: 'L', ur: 'g/mL',
        conv: { quoi: 'V', val: 1000, u: 'mL', facteur: '× 1 000' }, alt: '920 g = 0,92 kg, et 0,92 ÷ 1 = 0,92 kg/L' },
      { cle: 'or', nom: 'un lingot d\'or', m: 1.93, um: 'kg', V: 100, uv: 'cm³', ur: 'g/cm³',
        conv: { quoi: 'm', val: 1930, u: 'g', facteur: '× 1 000' }, alt: '100 cm³ = 0,1 dm³, et 1,93 ÷ 0,1 = 19,3 kg/dm³' },
      { cle: 'lait', nom: 'un verre de lait', m: 206, um: 'g', V: 20, uv: 'cL', ur: 'g/mL',
        conv: { quoi: 'V', val: 200, u: 'mL', facteur: '× 10' }, alt: null },
      { cle: 'glace', nom: 'un bloc de glace', m: 4.6, um: 'kg', V: 5000, uv: 'cm³', ur: 'g/cm³',
        conv: { quoi: 'm', val: 4600, u: 'g', facteur: '× 1 000' }, alt: '5 000 cm³ = 5 dm³, et 4,6 ÷ 5 = 0,92 kg/dm³' },
      { cle: 'beton', nom: 'un pavé de béton', m: 11.5, um: 'kg', V: 5, uv: 'L', ur: 'kg/L', conv: null, alt: null },
      { cle: 'bille', nom: 'une bille de verre', m: 5, um: 'g', V: 2, uv: 'cm³', ur: 'g/cm³', conv: null, alt: null }
    ];
    // 3. Flotte ou coule : des solides, puis des liquides qui ne se mélangent pas à l'eau (ρ en g/cm³).
    var OBJETS = [
      { cle: 'liege', nom: 'liège', rho: 0.24, col: '#d6b38c', bord: '#92400e' },
      { cle: 'chene', nom: 'chêne', rho: 0.7, col: '#c08552', bord: '#78350f' },
      { cle: 'pomme', nom: 'pomme', rho: 0.8, col: '#86efac', bord: '#15803d' },
      { cle: 'glace', nom: 'glace', rho: 0.92, col: '#e0f2fe', bord: '#0284c7' },
      { cle: 'verre', nom: 'verre', rho: 2.5, col: '#ccfbf1', bord: '#0f766e' },
      { cle: 'aluminium', nom: 'aluminium', rho: 2.7, col: '#e2e8f0', bord: '#475569' },
      { cle: 'fer', nom: 'fer', rho: 7.8, col: '#94a3b8', bord: '#334155' },
      { cle: 'or', nom: 'or', rho: 19.3, col: '#facc15', bord: '#854d0e' },
      { cle: 'essence', nom: 'essence', rho: 0.75, col: '#fecaca', bord: '#b91c1c', liquide: true },
      { cle: 'huile', nom: 'huile', rho: 0.92, col: '#fde047', bord: '#a16207', liquide: true },
      { cle: 'miel', nom: 'miel', rho: 1.4, col: '#f59e0b', bord: '#92400e', liquide: true }
    ];
    var VOLETS = [
      { cle: 'formules', nom: '1 · Les trois formules', titre: 'Le triangle des formules' },
      { cle: 'unites', nom: '2 · Les unités', titre: 'Des unités qui vont ensemble, avant de diviser' },
      { cle: 'flotte', nom: '3 · Flotte ou coule ?', titre: 'Plus dense ou moins dense que l\'eau ?' }
    ];
    var SEQ = { formules: ['triangle', 'cache', 'calcul'], unites: ['donnees', 'unite', 'conversion', 'calcul'], flotte: ['compare', 'tombe', 'verdict'] };
    var DUREE = { triangle: 700, cache: 700, calcul: 800, donnees: 500, unite: 700, conversion: 700, compare: 500, tombe: 1300, verdict: 500 };

    var C_BLEU = '#1d4ed8', C_ORANGE = '#c2410c', C_GRIS = '#64748b', C_EAU = '#0369a1', C_VERT = '#15803d', C_ROUGE = '#dc2626', C_INK = '#1e293b', C_PALE = '#94a3b8';

    function fmt(v, dec) {
      var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
      while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
      return e + out + (parts[1] ? ',' + parts[1] : '');
    }
    function arrondi(v, dec) { var k = Math.pow(10, dec); return Math.round(v * k) / k; }
    function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
    function b(t) { return '<b>' + t + '</b>'; }

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var volet = 'formules';
    var phase = 'repos';
    var frac = 0;
    var exemple = FORMULES[0], situation = UNITES[0], objet = OBJETS[1];
    var chips = { volets: {}, formules: {}, unites: {}, flotte: {} }, rangees = {};
    function rang() { return SEQ[volet].indexOf(phase); }
    function depuis(ph) { return rang() >= SEQ[volet].indexOf(ph); }               // l'étape ph est commencée (ou passée)
    function fini(ph) { return rang() > SEQ[volet].indexOf(ph) || (phase === ph && frac >= 1); }
    function avance(ph, seuil) { return rang() > SEQ[volet].indexOf(ph) || (phase === ph && frac >= seuil); }

    /* ==================================================================== */
    /* La géométrie : un registre d'éléments, chacun attaché à un volet      */
    /* ==================================================================== */
    var fixe = { fixed: true, highlight: false };
    function opts(o) { var r = {}; for (var k in fixe) r[k] = fixe[k]; for (k in o) r[k] = o[k]; return r; }
    var registre = [];
    function cree(type, parents, attrs, vol, quand) {
      var e = board.create(type, parents, opts(attrs));
      registre.push({ e: e, vol: vol, quand: quand });
      return e;
    }
    function texte(x, y, contenu, attrs, vol, quand) { return cree('text', [x, y, contenu], attrs, vol, quand); }
    // une boîte rectangulaire dont les coins [x1, y1, x2, y2] viennent d'une fonction (null : rien)
    function boite(fnBox, attrs, vol, quand) {
      var c = cree('curve', [[0], [0]], attrs, vol, quand);
      c.updateDataArray = function () {
        var bx = fnBox();
        if (!bx) { this.dataX = [NaN]; this.dataY = [NaN]; return; }
        this.dataX = [bx[0], bx[2], bx[2], bx[0], bx[0]]; this.dataY = [bx[1], bx[1], bx[3], bx[3], bx[1]];
      };
      return c;
    }
    var TITRES = {};
    VOLETS.forEach(function (v) { TITRES[v.cle] = v.titre; });
    texte(0, 5.8, function () { return TITRES[volet]; }, { anchorX: 'middle', anchorY: 'middle', fontSize: 14, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'all');

    /* -------------------------------------------------------------------- */
    /* Volet 1 : le triangle                                                 */
    /* -------------------------------------------------------------------- */
    var T = { A: [-4.3, 4.6], B: [-7.2, -0.2], C: [-1.4, -0.2], yDiv: 2.0 };
    function bordGauche(y) { var t = (y - T.B[1]) / (T.A[1] - T.B[1]); return T.B[0] + (T.A[0] - T.B[0]) * t; }
    function bordDroit(y) { var t = (y - T.C[1]) / (T.A[1] - T.C[1]); return T.C[0] + (T.A[0] - T.C[0]) * t; }
    var POS = { m: [T.A[0], 3.1], rho: [-5.3, 0.85], V: [-3.3, 0.85] };
    // le contour se trace pendant l'étape « triangle » : le tour, puis la barre, puis la cloison
    var CHAINES = [[T.A, T.B, T.C, T.A], [[bordGauche(T.yDiv), T.yDiv], [bordDroit(T.yDiv), T.yDiv]], [[T.A[0], T.B[1]], [T.A[0], T.yDiv]]];
    function longueur(a, c) { return Math.sqrt((c[0] - a[0]) * (c[0] - a[0]) + (c[1] - a[1]) * (c[1] - a[1])); }
    var LTOT = 0;
    CHAINES.forEach(function (ch) { for (var i = 1; i < ch.length; i++) LTOT += longueur(ch[i - 1], ch[i]); });
    var triangle = cree('curve', [[0], [0]], { strokeColor: C_INK, strokeWidth: 2.5, layer: 3 }, 'formules');
    triangle.updateDataArray = function () {
      var p = phase === 'triangle' ? frac : 1;     // au repos, le triangle entier : c'est la référence
      var reste = p * LTOT, X = [], Y = [];
      for (var c = 0; c < CHAINES.length && reste > 1e-9; c++) {
        var ch = CHAINES[c];
        if (c) { X.push(NaN); Y.push(NaN); }
        X.push(ch[0][0]); Y.push(ch[0][1]);
        for (var i = 1; i < ch.length && reste > 1e-9; i++) {
          var l = longueur(ch[i - 1], ch[i]);
          if (l <= reste) { X.push(ch[i][0]); Y.push(ch[i][1]); reste -= l; }
          else { var t = reste / l; X.push(ch[i - 1][0] + (ch[i][0] - ch[i - 1][0]) * t); Y.push(ch[i - 1][1] + (ch[i][1] - ch[i - 1][1]) * t); reste = 0; }
        }
      }
      if (!X.length) { X = [NaN]; Y = [NaN]; }
      this.dataX = X; this.dataY = Y;
    };
    function cacheActif() { return depuis('cache') && (phase !== 'cache' || frac >= 0.5); }
    var lettres = {};
    ['m', 'rho', 'V'].forEach(function (k) {
      lettres[k] = texte(POS[k][0], POS[k][1], LETTRE[k], { anchorX: 'middle', anchorY: 'middle', fontSize: 26, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'formules',
        function () { return (phase !== 'triangle' || frac >= 1) && !(cacheActif() && exemple.cherche === k); });
    });
    // le cache : une boîte grise sur la lettre cherchée, qui s'opacifie, et un « ? » dessus
    var DIM = { m: [0.55, 0.5], rho: [0.7, 0.6], V: [0.7, 0.6] };
    var cache = boite(function () {
      var k = exemple.cherche, d = DIM[k];
      return [POS[k][0] - d[0], POS[k][1] - d[1], POS[k][0] + d[0], POS[k][1] + d[1]];
    }, { strokeColor: '#475569', strokeWidth: 1.2, fillColor: '#64748b', fillOpacity: 0.9, layer: 6 }, 'formules', function () { return depuis('cache'); });
    texte(function () { return POS[exemple.cherche][0]; }, function () { return POS[exemple.cherche][1]; }, '?',
      { anchorX: 'middle', anchorY: 'middle', fontSize: 24, strokeColor: '#fff', cssStyle: 'font-weight:700' }, 'formules', cacheActif);
    texte(T.A[0], 5.25, function () { return exemple.nom; }, { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'formules');
    function formeActive() { return FORMS.filter(function (f) { return f.cle === exemple.cherche; })[0]; }
    texte(T.A[0], -1.0, function () { return 'on cache ' + LETTRE[exemple.cherche] + ' : il reste ' + formeActive().lecture; },
      { anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'formules', cacheActif);
    texte(T.A[0], -1.7, function () { return 'donc ' + formeActive().txt; },
      { anchorX: 'middle', anchorY: 'middle', fontSize: 14, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'formules', function () { return fini('cache'); });
    // à droite : les trois formules, puis le calcul
    texte(0.6, 5.0, 'Les trois formules', { anchorX: 'left', anchorY: 'middle', fontSize: 12, strokeColor: C_GRIS }, 'formules');
    var formTxt = [], lectureTxt = [];
    FORMS.forEach(function (f) {
      formTxt.push(texte(0.6, f.y, f.txt, { anchorX: 'left', anchorY: 'middle', fontSize: 18, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'formules'));
      lectureTxt.push(texte(4.3, f.y, '← ' + f.lecture, { anchorX: 'left', anchorY: 'middle', fontSize: 11, strokeColor: C_ORANGE }, 'formules',
        function () { return cacheActif() && f.cle === exemple.cherche; }));
    });
    function donnees(ex) {
      var d = [];
      if (ex.cherche !== 'm') d.push('m = ' + fmt(ex.m) + ' ' + ex.um);
      if (ex.cherche !== 'V') d.push('V = ' + fmt(ex.V) + ' ' + ex.uv);
      if (ex.cherche !== 'rho') d.push('ρ = ' + fmt(ex.rho) + ' ' + ex.ur);
      return d.join(' et ');
    }
    function calcul(ex) {
      if (ex.cherche === 'rho') return 'ρ = ' + fmt(ex.m) + ' ÷ ' + fmt(ex.V) + ' = ' + fmt(ex.rho) + ' ' + ex.ur;
      if (ex.cherche === 'm') return 'm = ' + fmt(ex.rho) + ' × ' + fmt(ex.V) + ' = ' + fmt(ex.m) + ' ' + ex.um;
      return 'V = ' + fmt(ex.m) + ' ÷ ' + fmt(ex.rho) + ' = ' + fmt(ex.V) + ' ' + ex.uv;
    }
    function unitesDuCalcul(ex) {
      if (ex.cherche === 'rho') return 'les unités suivent : ' + ex.um + ' ÷ ' + ex.uv + ' → ' + ex.ur;
      if (ex.cherche === 'm') return 'les unités suivent : ' + ex.ur + ' × ' + ex.uv + ' → ' + ex.um;
      return 'les unités suivent : ' + ex.um + ' ÷ ' + ex.ur + ' → ' + ex.uv;
    }
    texte(0.6, 0.5, function () { return 'Données : ' + donnees(exemple); }, { anchorX: 'left', anchorY: 'middle', fontSize: 13, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }, 'formules', function () { return depuis('calcul'); });
    texte(0.6, -0.5, function () { return calcul(exemple); }, { anchorX: 'left', anchorY: 'middle', fontSize: 17, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'formules', function () { return avance('calcul', 0.5); });
    texte(0.6, -1.3, function () { return unitesDuCalcul(exemple); }, { anchorX: 'left', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }, 'formules', function () { return fini('calcul'); });
    texte(0.6, -2.1, function () { return exemple.nom + ' : ' + exemple.bilan; }, { anchorX: 'left', anchorY: 'middle', fontSize: 12, strokeColor: C_INK }, 'formules', function () { return fini('calcul'); });

    /* -------------------------------------------------------------------- */
    /* Volet 2 : les unités                                                  */
    /* -------------------------------------------------------------------- */
    var TAB = { xm: -6.7, xv: -5.3, xf: -4.2, xr: -2.9, yTete: 4.6, y0: 3.75, dy: 0.9, x1: -7.5, x2: -1.4 };
    function yPaire(i) { return TAB.y0 - i * TAB.dy; }
    function paireChoisie() { for (var i = 0; i < PAIRES.length; i++) if (PAIRES[i][2] === situation.ur) return i; return -1; }
    function uniteMasse() { return situation.conv && situation.conv.quoi === 'm' ? situation.conv.u : situation.um; }
    function uniteVolume() { return situation.conv && situation.conv.quoi === 'V' ? situation.conv.u : situation.uv; }
    function valeurMasse() { return situation.conv && situation.conv.quoi === 'm' ? situation.conv.val : situation.m; }
    function valeurVolume() { return situation.conv && situation.conv.quoi === 'V' ? situation.conv.val : situation.V; }
    function rhoSituation() { return arrondi(valeurMasse() / valeurVolume(), 3); }
    function vontEnsemble() { return !situation.conv; }
    texte((TAB.x1 + TAB.x2) / 2, 5.25, 'Des unités qui vont ensemble', { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'unites');
    texte(TAB.xm, TAB.yTete, 'masse', { anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }, 'unites');
    texte(TAB.xv, TAB.yTete, 'volume', { anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }, 'unites');
    texte(TAB.xr, TAB.yTete, 'ρ', { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_GRIS, cssStyle: 'font-weight:700' }, 'unites');
    cree('segment', [[TAB.x1, TAB.yTete - 0.4], [TAB.x2, TAB.yTete - 0.4]], { strokeColor: C_PALE, strokeWidth: 1 }, 'unites');
    // la ligne choisie, surlignée pendant l'étape « unite »
    boite(function () { var i = paireChoisie(); if (i < 0) return null; return [TAB.x1, yPaire(i) - 0.4, TAB.x2, yPaire(i) + 0.4]; },
      { strokeColor: C_ORANGE, strokeWidth: 1, fillColor: '#fdba74', fillOpacity: 0.35, layer: 1 }, 'unites', function () { return avance('unite', 0.4); });
    PAIRES.forEach(function (p, i) {
      texte(TAB.xm, yPaire(i), p[0], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'unites');
      texte(TAB.xv, yPaire(i), p[1], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'unites');
      texte(TAB.xf, yPaire(i), '→', { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_GRIS }, 'unites');
      texte(TAB.xr, yPaire(i), p[2], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'unites');
    });
    texte((TAB.x1 + TAB.x2) / 2, -0.1, 'quatre noms, le même nombre :', { anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }, 'unites');
    texte((TAB.x1 + TAB.x2) / 2, -0.65, '1 g/cm³ = 1 g/mL = 1 kg/dm³ = 1 kg/L', { anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'unites');
    texte((TAB.x1 + TAB.x2) / 2, -1.2, '(1 cm³ = 1 mL et 1 dm³ = 1 L)', { anchorX: 'middle', anchorY: 'middle', fontSize: 10.5, strokeColor: C_GRIS }, 'unites');
    texte((TAB.x1 + TAB.x2) / 2, -2.0, 'Piège : g/L et kg/m³, c\'est × 1 000', { anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_ROUGE, cssStyle: 'font-weight:700' }, 'unites');
    texte((TAB.x1 + TAB.x2) / 2, -2.5, '1 g/mL = 1 000 g/L et 1 g/cm³ = 1 000 kg/m³', { anchorX: 'middle', anchorY: 'middle', fontSize: 10.5, strokeColor: C_ROUGE }, 'unites');
    // à droite : la fiche de calcul en quatre temps
    function etiquette(y, t, ph) { texte(0.6, y, t, { anchorX: 'left', anchorY: 'middle', fontSize: 10, strokeColor: C_GRIS, cssStyle: 'letter-spacing:.06em' }, 'unites', function () { return depuis(ph); }); }
    texte(0.6, 5.25, function () { return situation.nom; }, { anchorX: 'left', anchorY: 'middle', fontSize: 13, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'unites');
    etiquette(4.6, '1. LES DONNÉES', 'donnees');
    texte(0.8, 4.0, function () { return 'm = ' + fmt(situation.m) + ' ' + situation.um; }, { anchorX: 'left', anchorY: 'middle', fontSize: 16, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }, 'unites', function () { return avance('donnees', 0.3); });
    texte(4.4, 4.0, function () { return 'V = ' + fmt(situation.V) + ' ' + situation.uv; }, { anchorX: 'left', anchorY: 'middle', fontSize: 16, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }, 'unites', function () { return avance('donnees', 0.7); });
    etiquette(3.0, '2. L\'UNITÉ DE ρ', 'unite');
    var verdictUnites = texte(0.8, 2.4, function () {
      return vontEnsemble() ? situation.um + ' avec ' + situation.uv + ' : même ligne du tableau ✓' : situation.um + ' avec ' + situation.uv + ' : pas sur la même ligne ✗';
    }, { anchorX: 'left', anchorY: 'middle', fontSize: 13, strokeColor: C_VERT, cssStyle: 'font-weight:700' }, 'unites', function () { return avance('unite', 0.3); });
    texte(0.8, 1.8, function () {
      if (vontEnsemble()) return 'ρ sera en ' + situation.ur + ' : rien à convertir';
      return 'ρ sera en ' + situation.ur + ' : je convertis ' + (situation.conv.quoi === 'm' ? 'la masse en ' : 'le volume en ') + situation.conv.u;
    }, { anchorX: 'left', anchorY: 'middle', fontSize: 13, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'unites', function () { return fini('unite'); });
    etiquette(1.0, '3. CONVERTIR', 'conversion');
    function conversion() {
      var c = situation.conv;
      if (!c) return 'rien à convertir';
      return (c.quoi === 'm' ? fmt(situation.m) + ' ' + situation.um : fmt(situation.V) + ' ' + situation.uv) + ' = ' + fmt(c.val) + ' ' + c.u + '  (' + c.facteur + ')';
    }
    texte(0.8, 0.4, conversion, { anchorX: 'left', anchorY: 'middle', fontSize: 15, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'unites', function () { return avance('conversion', 0.3); });
    etiquette(-0.5, '4. CALCULER', 'calcul');
    texte(0.8, -1.1, function () { return 'ρ = ' + fmt(valeurMasse()) + ' ÷ ' + fmt(valeurVolume()) + ' = ' + fmt(rhoSituation()) + ' ' + situation.ur; },
      { anchorX: 'left', anchorY: 'middle', fontSize: 17, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'unites', function () { return avance('calcul', 0.3); });
    texte(0.8, -1.9, function () {
      var r = fmt(rhoSituation());
      return PAIRES.filter(function (p) { return p[2] !== situation.ur; }).map(function (p) { return r + ' ' + p[2]; }).join(' = ');
    }, { anchorX: 'left', anchorY: 'middle', fontSize: 11, strokeColor: C_INK }, 'unites', function () { return fini('calcul'); });
    texte(0.8, -1.5, '= même nombre dans les trois autres unités :', { anchorX: 'left', anchorY: 'middle', fontSize: 9.5, strokeColor: C_GRIS }, 'unites', function () { return fini('calcul'); });
    texte(0.8, -2.6, function () { return situation.alt ? 'Autre chemin : ' + situation.alt : ''; }, { anchorX: 'left', anchorY: 'middle', fontSize: 10.5, strokeColor: C_GRIS }, 'unites', function () { return fini('calcul'); });

    /* -------------------------------------------------------------------- */
    /* Volet 3 : l'aquarium et l'axe des masses volumiques                  */
    /* -------------------------------------------------------------------- */
    var AQ = { x1: -7.3, x2: -1.3, fond: -2.8, haut: 3.0, eau: 1.4, cx: -4.8, S: 1.4, ep: 0.5, yDepart: 3.4 };
    // la couche d'un liquide : son étalement s (0 : encore un bloc, 1 : couche entière)
    function etalement() {
      if (!objet.liquide) return 0;
      if (fini('tombe')) return 1;
      if (phase !== 'tombe') return 0;
      return Math.max(0, (frac - 0.5) * 2);
    }
    function epaisseurDense() { return objet.liquide && objet.rho > 1 ? AQ.ep * etalement() : 0; }
    // le bloc (ou la couche) : [x1, y1, x2, y2]
    function bloc() {
      if (!depuis('compare')) return null;
      var x1 = AQ.cx - AQ.S / 2, x2 = AQ.cx + AQ.S / 2, h = AQ.S, bas;
      if (objet.liquide) {
        var s = etalement(), chute = phase === 'tombe' ? Math.min(1, frac * 2) : (depuis('tombe') ? 1 : 0);
        bas = AQ.yDepart + (AQ.eau - AQ.yDepart) * ease(chute);
        if (s > 0) {   // le bloc s'étale d'une paroi à l'autre, en une couche sur l'eau ou au fond
          x1 += (AQ.x1 - x1) * s; x2 += (AQ.x2 - x2) * s; h = AQ.S + (AQ.ep - AQ.S) * s;
          bas = objet.rho < 1 ? AQ.eau : AQ.eau + (AQ.fond - AQ.eau) * s;
        }
      } else {
        var arrivee = objet.rho < 1 ? AQ.eau - objet.rho * AQ.S : AQ.fond;     // flotte : enfoncé d'une fraction ρ (ρ_eau = 1) ; coule : au fond
        var p = phase === 'tombe' ? ease(frac) : (depuis('tombe') ? 1 : 0);
        bas = AQ.yDepart + (arrivee - AQ.yDepart) * p;
      }
      return [x1, bas, x2, bas + h];
    }
    // l'eau, soulevée par une couche dense au fond
    var eau = boite(function () { var e = epaisseurDense(); return [AQ.x1, AQ.fond + e, AQ.x2, AQ.eau + e]; },
      { strokeColor: C_EAU, strokeWidth: 1, fillColor: '#93c5fd', fillOpacity: 0.55, layer: 2 }, 'flotte');
    cree('curve', [[AQ.x1, AQ.x1, AQ.x2, AQ.x2], [AQ.haut, AQ.fond, AQ.fond, AQ.haut]], { strokeColor: C_INK, strokeWidth: 2.5, layer: 3 }, 'flotte');
    texte(AQ.x2 - 0.2, function () { return AQ.eau + epaisseurDense() - 0.35; }, 'eau : ρ = 1 g/cm³', { anchorX: 'right', anchorY: 'middle', fontSize: 12, strokeColor: C_EAU, cssStyle: 'font-weight:700' }, 'flotte');
    var corps = boite(bloc, { strokeColor: C_INK, strokeWidth: 1.8, fillColor: '#fff', fillOpacity: 1, layer: 5 }, 'flotte', function () { return depuis('compare'); });
    texte(AQ.cx, function () { var bx = bloc(); return bx ? bx[3] + 0.35 : 0; }, function () { return objet.nom + ' : ' + fmt(objet.rho) + ' g/cm³'; },
      { anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'flotte', function () { return depuis('compare'); });
    // l'axe des masses volumiques, de 0 à 3 g/cm³, la ligne de l'eau à 1
    var AX = { x: 1.6, y0: -2.8, parUnite: 2, max: 3, xZone: 7.5 };
    function yRho(r) { return AX.y0 + Math.min(r, AX.max + 0.2) * AX.parUnite; }
    cree('arrow', [[AX.x, AX.y0], [AX.x, yRho(AX.max) + 0.45]], { strokeColor: C_INK, strokeWidth: 1.2 }, 'flotte');
    cree('segment', [[AX.x - 0.5, AX.y0], [AX.xZone, AX.y0]], { strokeColor: C_PALE, strokeWidth: 1 }, 'flotte');
    texte(AX.x, yRho(AX.max) + 0.95, 'ρ (g/cm³)', { anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_INK, cssStyle: 'font-weight:700' }, 'flotte');
    [0, 0.5, 1, 1.5, 2, 2.5, 3].forEach(function (r) {
      cree('segment', [[AX.x - 0.1, yRho(r)], [AX.x + 0.1, yRho(r)]], { strokeColor: C_INK, strokeWidth: 1 }, 'flotte');
      texte(AX.x - 0.2, yRho(r), fmt(r), { anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: C_INK }, 'flotte');
    });
    cree('segment', [[AX.x - 0.4, yRho(1)], [AX.xZone, yRho(1)]], { strokeColor: C_EAU, strokeWidth: 1.6, dash: 2 }, 'flotte');
    texte(AX.xZone, yRho(1) + 0.25, 'eau : 1', { anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: C_EAU, cssStyle: 'font-weight:700' }, 'flotte');
    var zoneCoule = texte(AX.xZone, yRho(2.2), 'au-dessus : ça coule', { anchorX: 'right', anchorY: 'middle', fontSize: 11, strokeColor: C_ROUGE, cssStyle: 'font-weight:700' }, 'flotte');
    var zoneFlotte = texte(AX.xZone, yRho(0.3), 'en dessous : ça flotte', { anchorX: 'right', anchorY: 'middle', fontSize: 11, strokeColor: C_VERT, cssStyle: 'font-weight:700' }, 'flotte');
    // chaque objet a sa marque ; les étiquettes trop proches passent à la colonne suivante
    var COLONNES = [AX.x + 0.4, AX.x + 2.1, AX.x + 3.8], dernieres = [-9, -9, -9];
    OBJETS.slice().sort(function (a, c) { return a.rho - c.rho; }).forEach(function (o) {
      var y = yRho(o.rho), col = 0;
      while (col < COLONNES.length - 1 && y - dernieres[col] < 0.32) col++;
      dernieres[col] = y;
      o.xEtiquette = COLONNES[col];
    });
    OBJETS.forEach(function (o) {
      var y = yRho(o.rho), horsEchelle = o.rho > AX.max;
      cree('point', [AX.x, y], { name: '', withLabel: false, size: 2, fillColor: C_PALE, strokeColor: C_PALE, layer: 4 }, 'flotte', function () { return !(fini('verdict') && o === objet); });
      cree('point', [AX.x, y], { name: '', withLabel: false, size: 4, fillColor: o.col, strokeColor: o.bord, strokeWidth: 2, layer: 9 }, 'flotte', function () { return fini('verdict') && o === objet; });
      var lbl = texte(o.xEtiquette, y, o.nom + ' ' + fmt(o.rho) + (horsEchelle ? ' ↑' : ''), { anchorX: 'left', anchorY: 'middle', fontSize: 10, strokeColor: C_PALE }, 'flotte');
      o.etiquette = lbl;
    });
    // en haut à droite : la comparaison, puis le verdict
    texte(4.6, 5.2, function () {
      if (!depuis('compare')) return '';
      return fmt(objet.rho) + (objet.rho < 1 ? ' < 1' : ' > 1') + ' : ' + (objet.rho < 1 ? 'moins dense' : 'plus dense') + ' que l\'eau';
    }, { anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }, 'flotte', function () { return depuis('compare'); });
    var verdictTxt = texte(4.6, 4.5, function () { return objet.rho < 1 ? 'ça flotte !' : 'ça coule !'; },
      { anchorX: 'middle', anchorY: 'middle', fontSize: 20, strokeColor: C_VERT, cssStyle: 'font-weight:700' }, 'flotte', function () { return fini('verdict'); });

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function refresh() {
      registre.forEach(function (r) {
        var v = (r.vol === 'all' || r.vol === volet) && (!r.quand || !!r.quand());
        r.e.setAttribute({ visible: v });
      });
      // volet 1 : la formule cherchée en orange, les autres s'effacent
      FORMS.forEach(function (f, i) {
        var actif = depuis('cache') && f.cle === exemple.cherche;
        formTxt[i].setAttribute({ strokeColor: actif ? C_ORANGE : (depuis('cache') ? C_PALE : C_INK) });
      });
      cache.setAttribute({ fillOpacity: phase === 'cache' ? 0.9 * Math.min(1, frac * 2) : 0.9 });
      // volet 2 : vert si les unités vont ensemble, rouge sinon
      verdictUnites.setAttribute({ strokeColor: vontEnsemble() ? C_VERT : C_ROUGE });
      // volet 3 : la couleur de l'objet, le verdict, l'étiquette mise en valeur
      corps.setAttribute({ fillColor: objet.col, strokeColor: objet.bord });
      verdictTxt.setAttribute({ strokeColor: objet.rho < 1 ? C_VERT : C_ROUGE });
      OBJETS.forEach(function (o) {
        var enValeur = fini('verdict') && o === objet;
        o.etiquette.setAttribute({ strokeColor: enValeur ? o.bord : C_PALE, cssStyle: enValeur ? 'font-weight:700' : '' });
      });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    function panneauFormules() {
      var ex = exemple, f = formeActive(), html = '';
      if (phase === 'repos') {
        html += '<div class="props-label">Trois formules, un seul triangle</div>';
        html += '<p>' + b('m') + ' en haut, ' + b('ρ') + ' et ' + b('V') + ' en bas, côte à côte. Choisis ce que tu cherches : on cache la lettre, et ce qui reste se lit comme la formule.</p>';
      } else if (phase === 'triangle') {
        html += '<div class="props-label">1. Le triangle</div>';
        html += '<p>Une seule chose à retenir : ' + b('m') + ' en haut, ' + b('ρ') + ' et ' + b('V') + ' en bas. Une barre au milieu, comme un trait de fraction : ce qui est en haut se divise par ce qui est en bas ; ce qui est côte à côte se multiplie.</p>';
      } else if (phase === 'cache') {
        html += '<div class="props-label">2. Cacher ce qu\'on cherche</div>';
        html += '<p>On cache ' + b(LETTRE[ex.cherche]) + ' : il reste ' + b(f.lecture) + ', donc ' + b(f.txt) + '.</p>';
      } else {
        html += '<div class="props-label">3. Calculer</div>';
        html += '<p>' + ex.nom + ' : ' + donnees(ex) + '. ' + b(calcul(ex)) + ' : ' + ex.bilan + '.</p>';
        html += '<p>' + unitesDuCalcul(ex).replace(/^l/, 'L') + '.</p>';
      }
      return html + '<p class="etats-molecules">ρ = m ÷ V · m = ρ × V · V = m ÷ ρ</p>';
    }
    function panneauUnites() {
      var s = situation, html = '';
      if (phase === 'repos') {
        html += '<div class="props-label">Regarde les unités avant de diviser</div>';
        html += '<p>La masse volumique se donne en ' + b('g/cm³') + ', ' + b('g/mL') + ', ' + b('kg/dm³') + ' ou ' + b('kg/L') + ' : une masse <em>sur</em> un volume qui vont ensemble. Si les données ne vont pas ensemble, on convertit d\'abord. Choisis une situation.</p>';
      } else if (phase === 'donnees') {
        html += '<div class="props-label">1. Les données</div>';
        html += '<p>' + s.nom + ' : ' + b('m = ' + fmt(s.m) + ' ' + s.um) + ' et ' + b('V = ' + fmt(s.V) + ' ' + s.uv) + '. Avant de diviser, regarde les deux unités.</p>';
      } else if (phase === 'unite') {
        html += '<div class="props-label">2. Quelle unité pour ρ ?</div>';
        if (vontEnsemble()) html += '<p>' + b(s.um) + ' et ' + b(s.uv) + ' sont sur la même ligne du tableau : ils vont ensemble. ρ sera en ' + b(s.ur) + ', et il n\'y a rien à convertir.</p>';
        else html += '<p>' + b(s.um) + ' et ' + b(s.uv) + ' ne sont pas sur la même ligne : on ne divise pas encore. On garde ' + (s.conv.quoi === 'V' ? 'la masse en ' + s.um + ' et on passe le volume en ' + s.conv.u : 'le volume en ' + s.uv + ' et on passe la masse en ' + s.conv.u) + ' : ρ sera en ' + b(s.ur) + '.</p>';
      } else if (phase === 'conversion') {
        html += '<div class="props-label">3. Convertir</div>';
        html += vontEnsemble() ? '<p>Rien à convertir : ' + s.um + ' et ' + s.uv + ' vont ensemble.</p>' : '<p>' + b(conversion().replace(/\s+\(/, ' (')) + '. Maintenant les deux unités vont ensemble.</p>';
      } else {
        html += '<div class="props-label">4. Calculer</div>';
        var r = fmt(rhoSituation());
        html += '<p>' + b('ρ = ' + fmt(valeurMasse()) + ' ÷ ' + fmt(valeurVolume()) + ' = ' + r + ' ' + s.ur) + '. Même nombre dans les quatre unités : ' + PAIRES.map(function (p) { return r + ' ' + p[2]; }).join(' = ') + '.</p>';
        html += '<p><span style="color:' + C_ROUGE + '">Piège :</span> ' + r + ' g/L serait mille fois trop léger ; en g/L, c\'est ' + fmt(arrondi(rhoSituation() * 1000, 3)) + '.' + (s.alt ? ' Autre chemin possible : ' + s.alt + '.' : '') + '</p>';
      }
      return html + '<p class="etats-molecules">g/cm³ = g/mL = kg/dm³ = kg/L · 1 cm³ = 1 mL · 1 dm³ = 1 L · 1 g/mL = 1 000 g/L</p>';
    }
    function panneauFlotte() {
      var o = objet, html = '', le = o.liquide ? 'l\'' : (o.cle === 'glace' || o.cle === 'pomme' ? 'la ' : 'le ');
      if (phase === 'repos') {
        html += '<div class="props-label">L\'eau pour juge</div>';
        html += '<p>L\'eau fait ' + b('1 g/cm³') + '. Choisis un solide ou un liquide : on compare sa masse volumique à celle de l\'eau, puis on le plonge.</p>';
      } else if (phase === 'compare') {
        html += '<div class="props-label">1. Comparer à l\'eau</div>';
        html += '<p>ρ(' + o.nom + ') = ' + b(fmt(o.rho) + ' g/cm³') + ' et ρ(eau) = 1 g/cm³ : ' + b(fmt(o.rho) + (o.rho < 1 ? ' < 1' : ' > 1')) + ', ' + le + o.nom + ' est ' + b(o.rho < 1 ? 'moins dense' : 'plus dense') + ' que l\'eau.</p>';
      } else if (phase === 'tombe') {
        html += '<div class="props-label">2. On plonge</div>';
        html += '<p>' + (o.rho < 1 ? 'Moins dense que l\'eau : l\'eau le porte.' : 'Plus dense que l\'eau : l\'eau ne le retient pas.') + '</p>';
      } else {
        html += '<div class="props-label">3. Flotte ou coule</div>';
        if (o.rho < 1) {
          html += '<p>Moins dense que l\'eau : ' + b('ça flotte') + '. ';
          html += o.liquide ? 'L\'' + o.nom + ' ne se mélange pas à l\'eau : elle forme une couche ' + b('au-dessus') + '.</p>'
                            : 'Le bloc s\'enfonce de ' + fmt(Math.round(o.rho * 100)) + ' % : plus ρ est proche de 1, plus ça s\'enfonce (la glace, 0,92, est presque entièrement sous l\'eau).</p>';
        } else {
          html += '<p>Plus dense que l\'eau : ' + b('ça coule') + '. ';
          html += o.liquide ? 'Le ' + o.nom + ' ne se mélange pas à l\'eau : il se dépose ' + b('au fond') + ', sous l\'eau.</p>' : 'Le bloc descend jusqu\'au fond.</p>';
        }
        html += '<p>La règle : ρ &lt; 1 g/cm³, ça flotte ; ρ &gt; 1 g/cm³, ça coule. Sur l\'axe, la ligne de l\'eau sépare les deux.</p>';
      }
      return html + '<p class="etats-molecules">eau : 1 g/cm³ · ρ &lt; 1 : flotte · ρ &gt; 1 : coule</p>';
    }
    function ecrirePanneau() {
      panel.innerHTML = volet === 'formules' ? panneauFormules() : volet === 'unites' ? panneauUnites() : panneauFlotte();
    }

    /* ==================================================================== */
    /* Les animations                                                        */
    /* ==================================================================== */
    var anim = null;
    function pose(ph, p) { phase = ph; frac = p; }
    function raz() { pose('repos', 0); redraw(); }
    function marquerChips() {
      VOLETS.forEach(function (v) { chips.volets[v.cle].className = 'ineq-preset' + (v.cle === volet ? ' active' : ''); rangees[v.cle].style.display = v.cle === volet ? '' : 'none'; });
      FORMULES.forEach(function (x) { chips.formules[x.cle].className = 'ineq-preset' + (x === exemple ? ' active' : ''); });
      UNITES.forEach(function (x) { chips.unites[x.cle].className = 'ineq-preset' + (x === situation ? ' active' : ''); });
      OBJETS.forEach(function (x) { chips.flotte[x.cle].className = 'ineq-preset' + (x === objet ? ' active' : ''); });
    }
    function lancer() {
      anim.cancel();
      marquerChips();
      var steps = SEQ[volet].map(function (ph) {
        return { dur: DUREE[ph] || 700, step: function (p) { pose(ph, p); refresh(); }, after: function () { pose(ph, 1); refresh(); } };
      });
      raz();
      anim.runSteps(steps, raz);
    }

    /* ==================================================================== */
    /* Les choix                                                             */
    /* ==================================================================== */
    function rangee(cls) { var d = document.createElement('div'); d.className = 'ineq-presets melange-choix ' + cls; return d; }
    function pastille(rangeeEl, registreChips, cle, libelle, onclick) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset'; bt.textContent = libelle; bt.onclick = onclick;
      rangeeEl.appendChild(bt); registreChips[cle] = bt;
    }
    function intitule(rangeeEl, t) {
      var s = document.createElement('span');
      s.textContent = t; s.style.cssText = 'align-self:center;font-size:.85rem;color:#64748b;margin-right:.2rem';
      rangeeEl.appendChild(s);
    }
    var rowVolets = rangee('mv-volets');
    VOLETS.forEach(function (v) { pastille(rowVolets, chips.volets, v.cle, v.nom, function () { volet = v.cle; lancer(); }); });
    mv.extras.appendChild(rowVolets);
    rangees.formules = rangee('mv-choix-formules');
    intitule(rangees.formules, 'Je cherche :');
    FORMULES.forEach(function (x) { pastille(rangees.formules, chips.formules, x.cle, LETTRE[x.cherche] + ' = ? · ' + x.nom, function () { exemple = x; lancer(); }); });
    rangees.unites = rangee('mv-choix-unites');
    UNITES.forEach(function (x) { pastille(rangees.unites, chips.unites, x.cle, x.nom + ' : ' + fmt(x.m) + ' ' + x.um + ', ' + fmt(x.V) + ' ' + x.uv, function () { situation = x; lancer(); }); });
    rangees.flotte = rangee('mv-choix-flotte');
    intitule(rangees.flotte, 'Solides :');
    OBJETS.filter(function (o) { return !o.liquide; }).forEach(function (x) { pastille(rangees.flotte, chips.flotte, x.cle, x.nom + ' (' + fmt(x.rho) + ')', function () { objet = x; lancer(); }); });
    intitule(rangees.flotte, 'Liquides :');
    OBJETS.filter(function (o) { return o.liquide; }).forEach(function (x) { pastille(rangees.flotte, chips.flotte, x.cle, x.nom + ' (' + fmt(x.rho) + ')', function () { objet = x; lancer(); }); });
    [rangees.formules, rangees.unites, rangees.flotte].forEach(function (r) { mv.extras.appendChild(r); });

    mv.addControls([
      { type: 'button', id: 'rejouer', label: '▶ Rejouer', onClick: lancer },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () {
        anim.cancel(); marquerChips();
        [chips.formules, chips.unites, chips.flotte].forEach(function (r) { for (var k in r) r[k].className = 'ineq-preset'; });
        raz();
      } }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    lancer();   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
