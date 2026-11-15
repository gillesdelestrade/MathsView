/*
 * La quantité de matière : la mole (2nde, physique-chimie).
 *
 * Les atomes, les ions et les molécules sont bien trop petits et bien trop
 * nombreux pour être comptés un à un. On les compte donc par PAQUETS, comme
 * les œufs par douzaines : un paquet de 6,02 × 10²³ entités s'appelle une
 * mole. Trois volets, trois choses à retenir :
 *
 *  1. LA MOLE. Une entité (un atome, un ion ou une molécule, au choix), puis
 *     un sac qui en contient 6,02 × 10²³ : une mole. Puis n sacs : la quantité
 *     de matière n, en mol. Et le nombre d'entités N = n × N_A, où N_A est la
 *     constante d'Avogadro. Que le sac contienne des atomes, des ions ou des
 *     molécules, il en contient toujours le même nombre.
 *
 *  2. LA MASSE MOLAIRE. Une entité a une masse m_entité minuscule (un atome
 *     de carbone : 1,99 × 10⁻²³ g). Le sac d'une mole, posé sur la balance,
 *     pèse N_A fois plus : c'est la masse molaire M = m_entité × N_A, en
 *     g/mol. En pratique on la lit dans le tableau périodique (atome), on
 *     additionne celles des atomes (molécule), et celle d'un ion est celle de
 *     son atome (la masse des électrons est négligeable).
 *
 *  3. m, n ET M. Le triangle : m en haut, n et M en bas. On cache ce qu'on
 *     cherche : n = m ÷ M, m = n × M, M = m ÷ n. Cinq situations, dont deux
 *     vont jusqu'au nombre d'entités (N = n × N_A) et une en part.
 *
 * La figure est mise en page en pixels (640 × 480). Tout le dessin découle
 * d'un ÉTAT (le volet, l'espèce, la quantité, la situation, la phase et son
 * avancement) que refresh() traduit en attributs AVANT board.update().
 * Chaque étape pose un état absolu.
 */
MathsView.register({
  id: 'quantite-matiere',
  title: 'La quantité de matière',
  level: '2nde',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'Quantité de matière',
  exercices: ['pc-quantite-matiere'],
  theme: 'Compter les atomes, les ions et les molécules par paquets de 6,02 × 10²³ : la mole, la masse molaire, n = m ÷ M',
  description:
    'Les atomes, les ions et les molécules sont trop petits et trop nombreux pour être comptés un à un : on les ' +
    'compte par <strong>paquets</strong>. Un paquet de \\(6{,}02\\times10^{23}\\) entités est une <strong>mole</strong> ; ' +
    'ce nombre est la <strong>constante d\'Avogadro</strong> \\(N_A\\), et \\(N = n \\times N_A\\).' +
    '<br>Trois volets. <strong>La mole</strong> : une mole d\'atomes, d\'ions ou de molécules contient toujours le même ' +
    'nombre d\'entités. <strong>La masse molaire</strong> : la masse d\'une mole, \\(M = m_{\\text{entité}} \\times N_A\\), ' +
    'en g/mol. <strong>m, n et M</strong> : dans le triangle, cache ce que tu cherches — \\(n = \\dfrac{m}{M}\\).' +
    '<br>Choisis un volet et un exemple, puis clique sur <strong>▶ Rejouer</strong> (ou coche <strong>Pas à pas</strong>).',
  notes:
    '<ul>' +
    '<li><strong>La mole.</strong> Une mole est un paquet de \\(6{,}02\\times10^{23}\\) entités identiques : atomes, ions ' +
    'ou molécules. On précise toujours de quoi : une mole d\'atomes de fer, une mole d\'ions sodium, une mole de ' +
    'molécules d\'eau.</li>' +
    '<li><strong>La constante d\'Avogadro.</strong> \\(N_A = 6{,}02\\times10^{23}\\ \\text{mol}^{-1}\\) : le nombre d\'entités ' +
    '<em>par mole</em>.</li>' +
    '<li><strong>La quantité de matière</strong> \\(n\\) est le nombre de moles, en mol. Le nombre d\'entités est ' +
    '\\(N = n \\times N_A\\), et inversement \\(n = \\dfrac{N}{N_A}\\).</li>' +
    '<li><strong>La masse molaire</strong> \\(M\\) est la masse d\'une mole, en g/mol : \\(M = m_{\\text{entité}} \\times N_A\\). ' +
    'Atome de carbone : \\(1{,}99\\times10^{-23} \\times 6{,}02\\times10^{23} = 12{,}0\\) g/mol.</li>' +
    '<li><strong>En pratique.</strong> Pour un atome, on lit \\(M\\) dans le tableau périodique. Pour une molécule, on ' +
    'additionne : \\(M(\\text{H}_2\\text{O}) = 2 \\times 1{,}0 + 16{,}0 = 18{,}0\\) g/mol. Pour un ion, on prend la masse ' +
    'molaire de l\'atome : les électrons gagnés ou perdus ont une masse négligeable.</li>' +
    '<li><strong>La relation.</strong> \\(n = \\dfrac{m}{M}\\), donc \\(m = n \\times M\\) et \\(M = \\dfrac{m}{n}\\), avec ' +
    '\\(m\\) en g, \\(n\\) en mol et \\(M\\) en g/mol. 36,0 g d\'eau : \\(n = 36{,}0 \\div 18{,}0 = 2{,}00\\) mol, soit ' +
    '\\(2{,}00 \\times 6{,}02\\times10^{23} = 1{,}20\\times10^{24}\\) molécules.</li>' +
    '<li><strong>Ne pas confondre</strong> \\(m\\) (la masse de l\'échantillon, en g), \\(M\\) (la masse d\'une mole, en ' +
    'g/mol) et \\(m_{\\text{entité}}\\) (la masse d\'une seule entité, de l\'ordre de \\(10^{-23}\\) g).</li>' +
    '</ul>',
  board: {
    boundingbox: [0, 480, 640, 0], keepaspectratio: false,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'La quantité de matière : la mole',
    figures: [{
      legende: 'Le triangle : on cache ce qu\'on cherche. n = m ÷ M.',
      boundingbox: [0, 10, 10, 0],
      keepaspectratio: false,
      largeur: 50, hauteur: 40,
      dessine: function (board) {
        var g = '#1e293b';
        function s(p, q) { board.create('segment', [p, q], { strokeColor: g, strokeWidth: 1.6, fixed: true, highlight: false }); }
        function t(x, y, txt, col, fs) { board.create('text', [x, y, txt], { anchorX: 'middle', anchorY: 'middle', fontSize: fs || 13, color: col || g, cssStyle: 'font-weight:800', fixed: true, highlight: false }); }
        s([1, 1], [9, 1]); s([1, 1], [5, 9]); s([9, 1], [5, 9]); s([3, 5], [7, 5]); s([5, 1], [5, 5]);
        t(5, 6.6, 'm', '#c2410c'); t(3.6, 2.6, 'n', '#1d4ed8'); t(6.4, 2.6, 'M', '#15803d');
        t(5, 0.3, 'g   ·   mol   ·   g/mol', '#64748b', 8);
      }
    }],
    points: [
      'Une <b>mole</b> est un paquet de \\( 6{,}02 \\times 10^{23} \\) entités identiques (atomes, ions ou molécules).',
      '<b>Constante d\'Avogadro</b> : \\( N_A = 6{,}02 \\times 10^{23}\\ \\text{mol}^{-1} \\). Nombre d\'entités : \\( N = n \\times N_A \\).',
      '<b>Masse molaire</b> \\( M \\) : la masse d\'une mole, en g/mol. \\( M = m_{\\text{entité}} \\times N_A \\).',
      'Molécule : on additionne les masses molaires des atomes. Ion : celle de l\'atome.',
      '<b>Relation</b> : \\( n = \\dfrac{m}{M} \\), \\( m = n \\times M \\), \\( M = \\dfrac{m}{n} \\) (g, mol, g/mol).'
    ],
    exemples: [
      '\\( M(\\text{H}_2\\text{O}) = 2 \\times 1{,}0 + 16{,}0 = 18{,}0 \\) g/mol.',
      '36,0 g d\'eau : \\( n = 36{,}0 \\div 18{,}0 = 2{,}00 \\) mol, soit \\( N = 2{,}00 \\times 6{,}02 \\times 10^{23} = 1{,}20 \\times 10^{24} \\) molécules.',
      '0,50 mol de fer : \\( m = 0{,}50 \\times 55{,}8 = 27{,}9 \\) g.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les données                                                           */
    /* ==================================================================== */
    var NA = 6.02e23;
    var ATOMES = { H: 1.0, C: 12.0, O: 16.0, Na: 23.0, Cl: 35.5, Fe: 55.8 };       // masses molaires atomiques, g/mol
    // une espèce : son type, ses noms, sa formule, sa composition, et les disques qui la dessinent
    var ESPECES = [
      { cle: 'C', mole: 'd\'atomes de carbone', masseDe: 'du carbone', type: 'atome', nom: 'atome de carbone', noms: 'atomes de carbone', de: 'de carbone', f: 'C', comp: [['C', 1]], col: '#475569',
        disques: [[0, 0, 30, '#475569', 'C']] },
      { cle: 'Fe', mole: 'd\'atomes de fer', masseDe: 'du fer', type: 'atome', nom: 'atome de fer', noms: 'atomes de fer', de: 'de fer', f: 'Fe', comp: [['Fe', 1]], col: '#b45309',
        disques: [[0, 0, 34, '#b45309', 'Fe']] },
      { cle: 'Na', mole: 'd\'ions sodium', masseDe: 'des ions sodium', type: 'ion', nom: 'ion sodium', noms: 'ions sodium', de: 'd\'ions sodium', f: 'Na⁺', comp: [['Na', 1]], col: '#7c3aed',
        disques: [[0, 0, 30, '#7c3aed', 'Na⁺']] },
      { cle: 'Cl', mole: 'd\'ions chlorure', masseDe: 'des ions chlorure', type: 'ion', nom: 'ion chlorure', noms: 'ions chlorure', de: 'd\'ions chlorure', f: 'Cl⁻', comp: [['Cl', 1]], col: '#15803d',
        disques: [[0, 0, 36, '#15803d', 'Cl⁻']] },
      { cle: 'H2O', mole: 'de molécules d\'eau', masseDe: 'de l\'eau', type: 'molécule', nom: 'molécule d\'eau', noms: 'molécules d\'eau', de: 'd\'eau', f: 'H₂O', comp: [['H', 2], ['O', 1]], col: '#dc2626',
        disques: [[0, 6, 28, '#dc2626', 'O'], [-30, -20, 17, '#94a3b8', 'H'], [30, -20, 17, '#94a3b8', 'H']] },
      { cle: 'CO2', mole: 'de molécules de dioxyde de carbone', masseDe: 'du dioxyde de carbone', type: 'molécule', nom: 'molécule de dioxyde de carbone', noms: 'molécules de dioxyde de carbone', de: 'de dioxyde de carbone', f: 'CO₂',
        comp: [['C', 1], ['O', 2]], col: '#0f766e', disques: [[0, 0, 22, '#475569', 'C'], [-44, 0, 24, '#dc2626', 'O'], [44, 0, 24, '#dc2626', 'O']] }
    ];
    ESPECES.forEach(function (e) {
      e.M = Math.round(e.comp.reduce(function (s, c) { return s + ATOMES[c[0]] * c[1]; }, 0) * 10) / 10;
      e.mEntite = e.M / NA;
    });
    function espece(cle) { return ESPECES.filter(function (e) { return e.cle === cle; })[0]; }
    var QUANTITES = [0.5, 1, 2, 3];
    // les situations du volet 3 : ce qu'on cherche, l'espèce, et les valeurs écrites comme on les lit
    var SITUATIONS = [
      { cle: 'n-eau', cherche: 'n', esp: 'H2O', m: 36.0, mT: '36,0', n: 2.00, nT: '2,00', suite: 'N', nom: '36,0 g d\'eau' },
      { cle: 'm-fer', cherche: 'm', esp: 'Fe', m: 27.9, mT: '27,9', n: 0.500, nT: '0,500', suite: null, nom: '0,500 mol de fer' },
      { cle: 'M-gaz', cherche: 'M', esp: 'CO2', m: 132, mT: '132', n: 3.00, nT: '3,00', suite: null, nom: '3,00 mol d\'un gaz pèsent 132 g' },
      { cle: 'n-ion', cherche: 'n', esp: 'Na', m: 4.60, mT: '4,60', n: 0.200, nT: '0,200', suite: 'N', nom: '4,60 g d\'ions sodium' },
      { cle: 'm-N', cherche: 'm', esp: 'C', m: 6.00, mT: '6,00', n: 0.500, nT: '0,500', suite: 'depuisN', nom: '3,01 × 10²³ atomes de carbone' }
    ];
    var VOLETS = [{ cle: 'mole', nom: '1 · La mole' }, { cle: 'masse', nom: '2 · La masse molaire' }, { cle: 'relation', nom: '3 · m, n et M' }];
    var SEQ = { mole: ['repos', 'entite', 'paquet', 'sacs', 'nombre'], masse: ['repos', 'une', 'mole', 'calcul', 'pratique'],
                relation: ['repos', 'donnees', 'formule', 'calcul', 'entites'] };
    var DUREE = { entite: 800, paquet: 1300, sacs: 1100, nombre: 900, une: 800, mole: 1300, calcul: 1000, pratique: 1000, donnees: 800, formule: 900, entites: 1000 };

    /* ==================================================================== */
    /* Les écritures                                                         */
    /* ==================================================================== */
    var C_M = '#c2410c', C_N = '#1d4ed8', C_MM = '#15803d', C_INK = '#1e293b', C_GRIS = '#64748b', C_PALE = '#cbd5e1', C_NA = '#7c3aed';
    var EXPOSANTS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    function virgule(s) { return String(s).replace('.', ',').replace('-', '−'); }
    // l'écriture scientifique à trois chiffres significatifs : « 1,20 × 10²⁴ »
    function sci(v) {
      var e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
      if (Number(m.toFixed(2)) >= 10) { m /= 10; e++; }
      return virgule(m.toFixed(2)) + ' × 10' + String(e).split('').map(function (c) { return EXPOSANTS[c]; }).join('');
    }
    function fix(v, dec) { return virgule(v.toFixed(dec)); }
    function qte(n) { return virgule(String(n)); }                                   // « 0,5 », « 2 »
    var NA_TXT = sci(NA);
    // « M(H₂O) = 2 × M(H) + M(O) = 2 × 1,0 + 16,0 = 18,0 g/mol »
    function sommeMolaire(e) {
      var lettres = e.comp.map(function (c) { return (c[1] > 1 ? c[1] + ' × ' : '') + 'M(' + c[0] + ')'; }).join(' + ');
      var nombres = e.comp.map(function (c) { return (c[1] > 1 ? c[1] + ' × ' : '') + fix(ATOMES[c[0]], 1); }).join(' + ');
      return 'M(' + e.f + ') = ' + lettres + ' = ' + nombres + ' = ' + fix(e.M, 1) + ' g/mol';
    }
    function entites(e) { return e.noms; }
    function b(t) { return '<b>' + t + '</b>'; }
    function col(c, t) { return '<span style="color:' + c + '">' + t + '</span>'; }

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var volet = 'mole', phase = 'repos', frac = 0;
    var esp = ESPECES[0], quantite = 2, situation = SITUATIONS[0];
    function rang() { return SEQ[volet].indexOf(phase); }
    function depuis(ph) { return rang() >= SEQ[volet].indexOf(ph) && SEQ[volet].indexOf(ph) > 0; }
    function fini(ph) { var i = SEQ[volet].indexOf(ph); return i > 0 && (rang() > i || (phase === ph && frac >= 1)); }
    function especeCourante() { return volet === 'relation' ? espece(situation.esp) : esp; }
    function nbSacs() { return volet === 'mole' ? Math.ceil(quantite) : 1; }
    // la part remplie du sac i (0, 0,5 ou 1)
    function remplissage(i) {
      if (volet === 'masse') return i === 0 ? 1 : 0;
      if (volet !== 'mole') return 0;
      if (!depuis('sacs')) return i === 0 ? 1 : 0;                                    // d'abord un seul sac : une mole
      return Math.max(0, Math.min(1, quantite - i));
    }

    /* ==================================================================== */
    /* La figure                                                             */
    /* ==================================================================== */
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) { o._mv[key] = val; var t = {}; t[key] = val; o.setAttribute(t); }
    }
    function show(o, v) { attr(o, 'visible', !!v); }
    function texte(x, y, contenu, couleur, taille, opts) {
      var o = { anchorX: 'middle', anchorY: 'middle', fontSize: taille || 13, color: couleur || C_INK,
                cssStyle: 'font-weight:700;white-space:nowrap', fixed: true, highlight: false, layer: 9, visible: false };
      for (var k in (opts || {})) o[k] = opts[k];
      return board.create('text', [x, y, contenu], o);
    }
    function courbe(xs, ys, attrs) {
      var o = { strokeColor: C_INK, strokeWidth: 2, fixed: true, highlight: false, layer: 4, visible: false };
      for (var k in attrs) o[k] = attrs[k];
      return board.create('curve', [xs, ys], o);
    }

    // --- L'entité, dessinée en grand : jusqu'à trois disques -----------------
    var EX = 105, EY = 262;
    var DISQUES = [0, 1, 2].map(function (i) {
      var p = board.create('point', [function () { var d = especeCourante().disques[i]; return EX + (d ? d[0] : 0); },
                                     function () { var d = especeCourante().disques[i]; return EY + (d ? d[1] : 0); }],
        { name: '', size: 20, fillColor: '#475569', strokeColor: '#fff', strokeWidth: 2, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 6 - i, visible: false });
      p.mvRole = 'disque';
      var t = texte(function () { return p.X(); }, function () { return p.Y(); }, function () { var d = especeCourante().disques[i]; return d ? d[4] : ''; },
                    '#fff', 14, { cssStyle: 'font-weight:800' });
      return { p: p, t: t };
    });
    var labEntite = texte(EX, 185, function () { return '1 ' + especeCourante().nom.replace('de dioxyde de carbone', 'de CO₂'); }, C_INK, 13);
    var labMasseEntite = texte(EX, 160, function () { return 'm = ' + sci(esp.mEntite) + ' g'; }, C_M, 13);
    labMasseEntite.mvRole = 'masse-entite';

    // --- La flèche « × N_A » --------------------------------------------------
    var FLECHE = board.create('segment', [[190, EY], [262, EY]], { strokeColor: C_NA, strokeWidth: 3, lastArrow: { type: 2, size: 6 }, fixed: true, highlight: false, layer: 5, visible: false });
    var labFleche = texte(226, EY + 22, '× ' + NA_TXT, C_NA, 12);

    // --- Les sacs : chacun contient une mole ---------------------------------
    var SAC_X = [340, 450, 560], SAC_Y = 188;
    function sacX(i) { return volet === 'masse' ? 470 : SAC_X[i]; }
    // des grains rangés au hasard (mais toujours le même) dans le sac, du fond vers le haut
    var GRAINS = (function () {
      var g = [], s = 7;
      function alea() { s = (s * 16807) % 2147483647; return s / 2147483647; }
      for (var k = 0; k < 26; k++) g.push([(alea() - 0.5) * 62, 8 + alea() * 96]);
      return g.sort(function (u, v) { return u[1] - v[1]; });
    })();
    var SACS = [0, 1, 2].map(function (i) {
      var cx = function () { return sacX(i); };
      var forme = courbe([0], [0], { strokeColor: '#92400e', strokeWidth: 2.2, fillColor: '#fde68a', fillOpacity: 0.55, layer: 3 });
      forme.updateDataArray = function () {
        var x = cx(), y = SAC_Y;
        this.dataX = [x - 40, x + 40, x + 46, x + 17, x + 25, x - 25, x - 17, x - 46, x - 40];
        this.dataY = [y, y, y + 112, y + 134, y + 152, y + 152, y + 134, y + 112, y];
      };
      forme.mvRole = 'sac';
      var grains = GRAINS.map(function (g) {
        var p = board.create('point', [function () { return cx() + g[0]; }, SAC_Y + g[1]],
          { name: '', size: 3, fillColor: '#475569', strokeColor: '#fff', strokeWidth: 0.6, fixed: true, withLabel: false, showInfobox: false, highlight: false, layer: 5, visible: false });
        p.mvRole = 'grain';
        return p;
      });
      var etiquette = texte(cx, SAC_Y - 16, function () { var r = remplissage(i); return r > 0 && r < 1 ? qte(r) + ' mol' : '1 mol'; }, '#92400e', 13);
      etiquette.mvRole = 'etiquette-sac';
      return { forme: forme, grains: grains, etiquette: etiquette };
    });
    var labContenu = texte(function () { return sacX(0); }, SAC_Y + 168, function () { return NA_TXT + ' ' + entites(esp).replace('de dioxyde de carbone', 'de CO₂'); }, C_NA, 12);

    // --- La balance (volet 2) -------------------------------------------------
    var BALANCE = courbe([385, 555, 555, 385, 385], [150, 150, 186, 186, 150], { strokeColor: C_INK, fillColor: '#e2e8f0', fillOpacity: 1, layer: 3 });
    var labBalance = texte(470, 168, function () { return fix(esp.M, 1) + ' g'; }, C_MM, 16, { cssStyle: 'font-weight:800;background:#0f172a;color:#4ade80;padding:1px 10px;border-radius:5px;white-space:nowrap' });
    labBalance.mvRole = 'balance';

    // --- Le triangle (volet 3) ------------------------------------------------
    var TRI = courbe([55, 265, 160, 55, NaN, 107.5, 212.5, NaN, 160, 160], [150, 150, 330, 150, NaN, 240, 240, NaN, 150, 240], { strokeWidth: 2.5 });
    function lettre(x, y, l, c) {
      var t = texte(x, y, function () { return situation.cherche === l && !fini('formule') ? '?' : l; }, c, 26, { cssStyle: 'font-weight:800' });
      t.mvRole = 'lettre-' + l;
      return t;
    }
    var LETTRES = [lettre(160, 278, 'm', C_M), lettre(118, 188, 'n', C_N), lettre(202, 188, 'M', C_MM)];
    var labTri = texte(160, 128, 'm en g · n en mol · M en g/mol', C_GRIS, 11, { cssStyle: 'font-weight:400;white-space:nowrap' });

    // --- Les lignes de texte ---------------------------------------------------
    var titre = texte(320, 456, function () {
      var e = especeCourante();
      return volet === 'mole' ? 'Une mole ' + e.mole : volet === 'masse' ? 'La masse molaire ' + e.masseDe : situation.nom;
    }, C_INK, 19, { cssStyle: 'font-weight:800;white-space:nowrap' });
    titre.mvRole = 'titre';
    function legende() {
      var e = especeCourante();
      if (volet === 'mole') {
        if (depuis('nombre')) return 'Le nombre d\'entités : N = n × N_A, où N_A est la constante d\'Avogadro.';
        if (depuis('sacs')) return 'La quantité de matière n est le nombre de moles : ici n = ' + qte(quantite) + ' mol.';
        if (depuis('paquet')) return 'On compte par paquets : un paquet de ' + NA_TXT + ' ' + e.noms.split(' ')[0] + ' est une mole.';
        if (depuis('entite')) return 'Un' + (e.type === 'molécule' ? 'e' : '') + ' seul' + (e.type === 'molécule' ? 'e' : '') + ' ' + e.type + ' : bien trop petit' + (e.type === 'molécule' ? 'e' : '') + ' pour compter un à un.';
        return 'Combien y a-t-il d\'entités dans un échantillon ? On ne les compte pas une à une.';
      }
      if (volet === 'masse') {
        if (depuis('pratique')) return e.type === 'atome' ? 'En pratique, on lit M dans le tableau périodique.'
                                     : e.type === 'ion' ? 'Un ion a la masse molaire de son atome : la masse des électrons est négligeable.'
                                     : 'En pratique, on additionne les masses molaires des atomes de la molécule.';
        if (depuis('calcul')) return 'La masse molaire M est la masse d\'une mole : N_A fois la masse d\'une entité.';
        if (depuis('mole')) return 'Une mole, c\'est ' + NA_TXT + ' ' + e.noms.split(' ')[0] + ' : sur la balance, ' + fix(e.M, 1) + ' g.';
        if (depuis('une')) return 'Un' + (e.type === 'molécule' ? 'e' : '') + ' ' + e.type + ' a une masse minuscule : de l\'ordre de 10⁻²³ g.';
        return 'Combien pèse une mole ? Cela dépend de l\'espèce.';
      }
      if (depuis('entites')) return situation.suite === 'N' ? 'Et le nombre d\'entités : N = n × N_A.' : situation.suite === 'depuisN' ? 'On vérifie l\'ordre de grandeur : une demi-mole de carbone, la moitié de 12 g.' : situation.cherche === 'M' ? 'Une masse molaire de 44,0 g/mol : c\'est celle du dioxyde de carbone.' : 'On vérifie les unités : mol × g/mol = g.';
      if (depuis('calcul')) return 'On remplace par les valeurs, avec les unités.';
      if (depuis('formule')) return 'Dans le triangle, on cache ce qu\'on cherche : il reste la formule.';
      if (depuis('donnees')) return situation.suite === 'depuisN' ? 'On connaît le nombre d\'atomes : d\'abord n = N ÷ N_A.' : 'On repère ce qu\'on connaît et ce qu\'on cherche.';
      return 'Masse, quantité de matière, masse molaire : deux connues, on trouve la troisième.';
    }
    var labLegende = texte(320, 428, legende, C_GRIS, 13, { cssStyle: 'font-weight:400;white-space:nowrap' });
    labLegende.mvRole = 'legende';
    // les deux lignes du bas (volets 1 et 2)
    function ligne1() {
      var e = esp;
      if (volet === 'mole') return 'N = n × N_A = ' + qte(quantite) + ' × ' + NA_TXT + ' = ' + sci(quantite * NA) + ' ' + e.noms.replace('de dioxyde de carbone', 'de CO₂');
      return 'M = m × N_A = ' + sci(e.mEntite) + ' × ' + NA_TXT + ' = ' + fix(e.M, 1) + ' g/mol';
    }
    function ligne2() {
      var e = esp;
      if (volet === 'mole') return '1 douzaine = 12   ·   1 ramette = 500   ·   1 mole = ' + NA_TXT;
      return e.type === 'atome' ? 'Tableau périodique : M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol'
           : e.type === 'ion' ? 'M(' + e.f + ') = M(' + e.comp[0][0] + ') = ' + fix(e.M, 1) + ' g/mol'
           : sommeMolaire(e);
    }
    var labLigne1 = texte(320, 98, ligne1, C_INK, 15, { cssStyle: 'font-weight:800;white-space:nowrap;background:#f1f5f9;padding:3px 10px;border-radius:8px' });
    var labLigne2 = texte(320, 52, ligne2, C_GRIS, 13);
    labLigne1.mvRole = 'ligne1'; labLigne2.mvRole = 'ligne2';
    // les lignes du volet 3, à droite du triangle
    function relDonnees() {
      var s = situation, e = espece(s.esp);
      if (s.suite === 'depuisN') return 'N = ' + sci(s.n * NA) + ' atomes  →  n = N ÷ N_A = ' + s.nT + ' mol';
      return s.cherche === 'n' ? 'm = ' + s.mT + ' g   ·   M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol'
           : s.cherche === 'm' ? 'n = ' + s.nT + ' mol   ·   M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol'
           : 'm = ' + s.mT + ' g   ·   n = ' + s.nT + ' mol';
    }
    function relFormule() { return { n: 'n = m ÷ M', m: 'm = n × M', M: 'M = m ÷ n' }[situation.cherche]; }
    function relCalcul() {
      var s = situation, e = espece(s.esp), M = fix(e.M, 1);
      return s.cherche === 'n' ? 'n = ' + s.mT + ' ÷ ' + M + ' = ' + s.nT + ' mol'
           : s.cherche === 'm' ? 'm = ' + s.nT + ' × ' + M + ' = ' + s.mT + ' g'
           : 'M = ' + s.mT + ' ÷ ' + s.nT + ' = ' + M + ' g/mol';
    }
    function relSuite() {
      var s = situation, e = espece(s.esp);
      if (s.suite === 'N') return 'N = n × N_A = ' + s.nT + ' × ' + NA_TXT + ' = ' + sci(s.n * NA) + ' ' + e.noms;
      if (s.suite === 'depuisN') return sci(s.n * NA) + ' atomes de carbone pèsent ' + s.mT + ' g';
      if (s.cherche === 'M') return 'M = 44,0 g/mol = M(C) + 2 × M(O) : c\'est CO₂';
      return 'Vérification : n = m ÷ M = ' + s.mT + ' ÷ ' + fix(e.M, 1) + ' = ' + s.nT + ' mol';
    }
    var relD = texte(455, 318, relDonnees, C_INK, 13), relF = texte(455, 268, relFormule, C_INK, 22, { cssStyle: 'font-weight:800;white-space:nowrap' });
    var relC = texte(455, 215, relCalcul, C_INK, 16, { cssStyle: 'font-weight:800;white-space:nowrap;background:#f1f5f9;padding:3px 10px;border-radius:8px' });
    var relS = texte(320, 78, relSuite, C_NA, 14);
    relD.mvRole = 'rel-donnees'; relF.mvRole = 'rel-formule'; relC.mvRole = 'rel-calcul'; relS.mvRole = 'rel-suite';

    function refresh() {
      var e = especeCourante(), V1 = volet === 'mole', V2 = volet === 'masse', V3 = volet === 'relation';
      // l'entité
      var voirEntite = (V1 && depuis('entite')) || (V2 && depuis('une'));
      DISQUES.forEach(function (d, i) {
        var q = e.disques[i];
        show(d.p, voirEntite && !!q); show(d.t, voirEntite && !!q);
        if (q) { attr(d.p, 'size', q[2]); attr(d.p, 'fillColor', q[3]); }
      });
      show(labEntite, voirEntite);
      show(labMasseEntite, V2 && depuis('une'));
      // la flèche et les sacs
      var voirSac = (V1 && depuis('paquet')) || (V2 && depuis('mole'));
      show(FLECHE, voirSac); show(labFleche, voirSac);
      SACS.forEach(function (s, i) {
        var la = voirSac && i < nbSacs() && (i === 0 || (V1 && depuis('sacs'))), r = remplissage(i);
        show(s.forme, la); show(s.etiquette, la);
        var nb = Math.round(r * s.grains.length);
        s.grains.forEach(function (g, k) { show(g, la && k < nb); attr(g, 'fillColor', e.col); });
      });
      show(labContenu, voirSac);
      show(BALANCE, V2 && depuis('mole')); show(labBalance, V2 && depuis('mole'));
      // les lignes du bas
      show(labLigne1, (V1 && depuis('nombre')) || (V2 && depuis('calcul')));
      show(labLigne2, (V1 && depuis('paquet')) || (V2 && depuis('pratique')));
      // le triangle
      show(TRI, V3); show(labTri, V3);
      LETTRES.forEach(function (t) { show(t, V3); });
      show(relD, V3 && depuis('donnees')); show(relF, V3 && depuis('formule'));
      show(relC, V3 && depuis('calcul')); show(relS, V3 && depuis('entites'));
      show(titre, true); show(labLegende, true);
      ecrirePanneau();
      board.update();
    }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';
    function ecrirePanneau() {
      var e = especeCourante(), h = '';
      if (volet === 'mole') {
        h = '<div class="props-label">La mole</div>' +
            '<p style="margin:.2rem 0 .5rem">Une mole ' + e.mole + ', c\'est ' + b(NA_TXT + ' ' + e.noms) + '. Ce nombre est le même pour toutes les espèces : c\'est la ' +
            b('constante d\'Avogadro') + ', ' + col(C_NA, b('N_A = ' + NA_TXT + ' mol⁻¹')) + '.</p>' +
            '<div class="props-label">Le nombre d\'entités</div>' +
            '<p style="margin:.2rem 0 0">' + (fini('nombre')
              ? 'Dans ' + b(qte(quantite) + ' mol') + ' : N = n × N_A = ' + qte(quantite) + ' × ' + NA_TXT + ' = ' + b(col(C_N, sci(quantite * NA) + ' ' + e.noms)) + '.'
              : 'N = n × N_A : lance l\'animation.') + '</p>';
      } else if (volet === 'masse') {
        h = '<div class="props-label">La masse molaire</div>' +
            '<p style="margin:.2rem 0 .5rem">La masse molaire ' + b('M') + ' est la masse d\'' + b('une mole') + ', en ' + b('g/mol') + '. ' +
            (fini('calcul') ? 'Un' + (e.type === 'molécule' ? 'e ' : ' ') + e.nom + ' pèse ' + sci(e.mEntite) + ' g, donc ' +
              b(col(C_MM, 'M = ' + sci(e.mEntite) + ' × ' + NA_TXT + ' = ' + fix(e.M, 1) + ' g/mol')) + '.' : 'M = m × N_A : lance l\'animation.') + '</p>' +
            '<div class="props-label">En pratique</div>' +
            '<p style="margin:.2rem 0 0">' + (fini('pratique')
              ? (e.type === 'atome' ? 'On lit dans le tableau périodique : ' + b('M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol') + '.'
                : e.type === 'ion' ? 'Un ion a la masse molaire de son atome : ' + b('M(' + e.f + ') = M(' + e.comp[0][0] + ') = ' + fix(e.M, 1) + ' g/mol') + ', car la masse des électrons est négligeable.'
                : 'On additionne les masses molaires des atomes : ' + b(sommeMolaire(e)) + '.')
              : 'Atome : tableau périodique. Molécule : on additionne. Ion : comme l\'atome.') + '</p>';
      } else {
        var s = situation;
        h = '<div class="props-label">La relation</div>' +
            '<p style="margin:.2rem 0 .5rem">' + b(col(C_N, 'n') + ' = ' + col(C_M, 'm') + ' ÷ ' + col(C_MM, 'M')) + ', donc ' + b('m = n × M') + ' et ' + b('M = m ÷ n') +
            ' — avec m en g, n en mol, M en g/mol.</p>' +
            '<div class="props-label">Le résultat</div>' +
            '<p style="margin:.2rem 0 0">' + (fini('calcul') ? b(relCalcul()) + (fini('entites') ? '<br>' + relSuite() + '.' : '') : 'Lance l\'animation.') + '</p>';
      }
      panel.innerHTML = h;
    }

    /* ==================================================================== */
    /* Les animations et les choix                                           */
    /* ==================================================================== */
    var anim = null, chips = { volets: {}, especes: {}, quantites: {}, situations: {} }, rangees = {};
    function pose(ph, p) { phase = ph; frac = p; }
    function raz() { pose('repos', 0); refresh(); }
    function marquer() {
      VOLETS.forEach(function (v) { chips.volets[v.cle].className = 'ineq-preset qm-volet' + (v.cle === volet ? ' active' : ''); });
      ESPECES.forEach(function (e) { chips.especes[e.cle].className = 'ineq-preset qm-espece' + (e === esp ? ' active' : ''); });
      QUANTITES.forEach(function (q) { chips.quantites[q].className = 'ineq-preset qm-quantite' + (q === quantite ? ' active' : ''); });
      SITUATIONS.forEach(function (s) { chips.situations[s.cle].className = 'ineq-preset qm-situation' + (s === situation ? ' active' : ''); });
      rangees.especes.style.display = volet === 'relation' ? 'none' : '';
      rangees.quantites.style.display = volet === 'mole' ? '' : 'none';
      rangees.situations.style.display = volet === 'relation' ? '' : 'none';
    }
    function lancer() {
      anim.cancel(); marquer();
      var steps = SEQ[volet].slice(1).map(function (ph) {
        return { dur: DUREE[ph] || 800, step: function (p) { pose(ph, p); refresh(); }, after: function () { pose(ph, 1); refresh(); } };
      });
      raz();
      anim.runSteps(steps, raz);
    }
    function rangee(cls) { var d = document.createElement('div'); d.className = 'ineq-presets ' + cls; return d; }
    function pastille(rangeeEl, registre, cle, libelle, onclick) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset'; bt.textContent = libelle; bt.onclick = onclick;
      rangeeEl.appendChild(bt); registre[cle] = bt;
    }
    function intitule(rangeeEl, t) {
      var s = document.createElement('span');
      s.textContent = t; s.style.cssText = 'align-self:center;font-size:.85rem;color:#64748b;margin-right:.2rem';
      rangeeEl.appendChild(s);
    }
    var rowVolets = rangee('qm-volets');
    VOLETS.forEach(function (v) { pastille(rowVolets, chips.volets, v.cle, v.nom, function () { volet = v.cle; lancer(); }); });
    rangees.especes = rangee('qm-especes'); intitule(rangees.especes, 'Une mole de :');
    ESPECES.forEach(function (e) { pastille(rangees.especes, chips.especes, e.cle, e.f + ' · ' + e.type, function () { esp = e; lancer(); }); });
    rangees.quantites = rangee('qm-quantites'); intitule(rangees.quantites, 'Quantité de matière :');
    QUANTITES.forEach(function (q) { pastille(rangees.quantites, chips.quantites, q, 'n = ' + qte(q) + ' mol', function () { quantite = q; lancer(); }); });
    rangees.situations = rangee('qm-situations'); intitule(rangees.situations, 'Je cherche :');
    SITUATIONS.forEach(function (s) { pastille(rangees.situations, chips.situations, s.cle, s.cherche + ' = ? · ' + s.nom, function () { situation = s; lancer(); }); });
    [rowVolets, rangees.especes, rangees.quantites, rangees.situations].forEach(function (r) { mv.extras.appendChild(r); });

    mv.addControls([
      { type: 'button', id: 'rejouer', label: '▶ Rejouer', onClick: lancer }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);
    lancer();
  }
});
