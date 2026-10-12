/*
 * La masse volumique (5ème, physique-chimie).
 *
 * Un litre d'huile pèse moins qu'un litre d'eau, un litre de fer bien plus :
 * à volume égal, les matières n'ont pas la même masse. La masse volumique
 * d'une matière, c'est la masse d'UNE unité de volume : ρ = m / V, en g/cm³
 * (ou g/mL, c'est pareil). Elle ne dépend pas de la taille de l'échantillon :
 * un gros morceau et un petit morceau du même bois donnent le même quotient.
 *
 * À gauche, un cube de la matière choisie, dont le volume se règle au curseur,
 * posé sur une balance électronique. À droite, le graphique de m en fonction
 * de V : les points d'une même matière sont alignés sur une droite qui passe
 * par l'origine — m et V sont PROPORTIONNELS, et ρ est le coefficient. La
 * droite de l'eau (ρ = 1 g/cm³) sert de repère : au-dessus, ça coule ; en
 * dessous, ça flotte.
 *
 * Quatre étapes : mesurer le volume, peser, diviser, comparer à l'eau — avec
 * les unités qui changent de nom sans changer de nombre (g/cm³ = g/mL = kg/L)
 * et celles qui changent de nombre (g/L, kg/m³ : × 1 000). Treize matières.
 *
 * Tout le dessin découle d'un ÉTAT (la matière, le volume, la phase et son
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
  theme: 'La masse d\'un centimètre cube : ρ = m ÷ V, le même nombre quelle que soit la taille du morceau',
  description:
    'Un litre d\'huile pèse <strong>moins</strong> qu\'un litre d\'eau, un litre de fer <strong>bien ' +
    'plus</strong>. À volume égal, les matières n\'ont pas la même masse : ce qui les distingue, c\'est ' +
    'la <strong>masse volumique</strong>, la masse d\'<strong>une unité de volume</strong> : ' +
    '\\( \\rho = \\dfrac{m}{V} \\), en g/cm³ (ou g/mL : c\'est la même chose).' +
    '<br>Choisis une matière et un volume : le cube est pesé, on divise, et le point ' +
    '\\( (V\\,;\\,m) \\) se place sur le graphique. Change le volume : le point glisse sur une ' +
    '<strong>droite qui passe par l\'origine</strong> — \\( m \\) et \\( V \\) sont proportionnels, ' +
    'et \\( \\rho \\) ne change pas. Au-dessus de la droite de l\'eau, ça coule ; en dessous, ça flotte.',
  notes:
    '<ul>' +
    '<li><strong>Définition.</strong> La masse volumique d\'une matière est la masse d\'une unité de ' +
    'volume : \\( \\rho = \\dfrac{m}{V} \\). Avec \\( m \\) en g et \\( V \\) en cm³, elle est en ' +
    '<strong>g/cm³</strong>. Elle caractérise la matière, pas l\'objet : 10 cm³ ou 200 cm³ de fer, ' +
    'toujours 7,8 g/cm³.</li>' +
    '<li><strong>Les unités.</strong> 1 cm³ = 1 mL et 1 dm³ = 1 L, donc <strong>g/cm³ = g/mL = ' +
    'kg/L</strong> : même nombre. Mais 1 L = 1 000 mL, donc <strong>1 g/mL = 1 000 g/L</strong>, et ' +
    '<strong>1 g/cm³ = 1 000 kg/m³</strong>. L\'eau : 1 g/mL = 1 kg/L = 1 000 g/L = 1 000 kg/m³.</li>' +
    '<li><strong>Le piège des unités.</strong> Avant de diviser, mets \\( m \\) et \\( V \\) dans des ' +
    'unités qui vont ensemble : 230 g et 0,25 L, c\'est 230 g et 250 mL → 0,92 g/mL. ' +
    'Écrire « 0,92 g/L » serait mille fois trop léger : 0,92 g par litre, c\'est un gaz.</li>' +
    '<li><strong>Flotter ou couler.</strong> Une matière moins dense que l\'eau (ρ &lt; 1 g/cm³) ' +
    'flotte sur l\'eau : huile, glace, bois, liège. Plus dense (ρ &gt; 1 g/cm³) : elle coule : ' +
    'métaux, verre, miel.</li>' +
    '<li><strong>Les deux autres formules.</strong> \\( m = \\rho \\times V \\) et ' +
    '\\( V = \\dfrac{m}{\\rho} \\) : connaissant deux des trois grandeurs, on trouve la troisième.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6.2, 8, -3.4], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'La masse volumique',
    figures: [{
      legende: 'm est proportionnelle à V : la pente de la droite est ρ.',
      boundingbox: [-25, 230, 125, -45],
      keepaspectratio: false,
      largeur: 50, hauteur: 34,
      dessine: function (board) {
        board.create('arrow', [[0, 0], [118, 0]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('arrow', [[0, 0], [0, 215]], { strokeColor: '#334155', strokeWidth: 1, fixed: true, highlight: false });
        board.create('text', [112, -18, 'V (cm³)'], { anchorX: 'right', anchorY: 'middle', fontSize: 6.5, color: '#334155', fixed: true, highlight: false });
        board.create('text', [4, 208, 'm (g)'], { anchorX: 'left', anchorY: 'middle', fontSize: 6.5, color: '#334155', fixed: true, highlight: false });
        board.create('segment', [[0, 0], [100, 100]], { strokeColor: '#0369a1', strokeWidth: 1.4, dash: 2, fixed: true, highlight: false });
        board.create('segment', [[0, 0], [100, 70]], { strokeColor: '#b45309', strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('segment', [[0, 0], [75, 202]], { strokeColor: '#475569', strokeWidth: 1.4, fixed: true, highlight: false });
        board.create('text', [103, 100, 'eau : 1 g/cm³'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#0369a1', fixed: true, highlight: false });
        board.create('text', [103, 68, 'chêne : 0,7 (flotte)'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#b45309', fixed: true, highlight: false });
        board.create('text', [78, 200, 'aluminium : 2,7 (coule)'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#475569', fixed: true, highlight: false });
        board.create('point', [50, 135], { name: '', size: 1.5, fillColor: '#dc2626', strokeColor: '#dc2626', fixed: true, highlight: false });
        board.create('segment', [[50, 0], [50, 135]], { strokeColor: '#dc2626', strokeWidth: 0.6, dash: 1, fixed: true, highlight: false });
        board.create('segment', [[0, 135], [50, 135]], { strokeColor: '#dc2626', strokeWidth: 0.6, dash: 1, fixed: true, highlight: false });
        board.create('text', [50, -16, '50'], { anchorX: 'middle', anchorY: 'middle', fontSize: 6, color: '#dc2626', fixed: true, highlight: false });
        board.create('text', [-3, 135, '135'], { anchorX: 'right', anchorY: 'middle', fontSize: 6, color: '#dc2626', fixed: true, highlight: false });
        board.create('text', [-3, -16, '0'], { anchorX: 'right', anchorY: 'middle', fontSize: 6, color: '#334155', fixed: true, highlight: false });
      }
    }],
    points: [
      'La <b>masse volumique</b> d\'une matière, c\'est la masse d\'<b>une unité de volume</b> : \\( \\rho = \\dfrac{m}{V} \\). En g/cm³ si m est en g et V en cm³.',
      'Elle caractérise la <b>matière</b>, pas l\'objet : un gros et un petit morceau de fer donnent le même quotient, 7,8 g/cm³.',
      '<b>1 g/cm³ = 1 g/mL = 1 kg/L</b> (même nombre). Mais 1 g/mL = <b>1 000 g/L</b>, et 1 g/cm³ = <b>1 000 kg/m³</b>.',
      'Avant de diviser, des unités qui vont ensemble : g avec mL (ou cm³), kg avec L. 230 g et 0,25 L → 230 ÷ 250 = 0,92 g/mL.',
      'Eau : 1 g/cm³. Moins dense, ça <b>flotte</b> (huile 0,92 ; chêne 0,7 ; glace 0,92). Plus dense, ça <b>coule</b> (aluminium 2,7 ; fer 7,8).',
      'Les deux autres formules : \\( m = \\rho \\times V \\) et \\( V = \\dfrac{m}{\\rho} \\).'
    ],
    exemples: [
      '135 g d\'aluminium pour 50 cm³ : ρ = 135 ÷ 50 = 2,7 g/cm³ = 2 700 kg/m³.',
      'Huile : 0,92 g/mL = 920 g/L (pas 0,92 g/L !). Un litre d\'huile pèse 920 g.'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les matières (ρ en g/cm³) et les unités                               */
    /* ==================================================================== */
    var MATIERES = [
      { cle: 'liege', nom: 'liège', rho: 0.24, col: '#d6b38c', bord: '#92400e' },
      { cle: 'chene', nom: 'chêne', rho: 0.7, col: '#c08552', bord: '#78350f' },
      { cle: 'alcool', nom: 'alcool', rho: 0.79, col: '#e9d5ff', bord: '#7e22ce', liquide: true },
      { cle: 'huile', nom: 'huile', rho: 0.92, col: '#fde047', bord: '#a16207', liquide: true },
      { cle: 'glace', nom: 'glace', rho: 0.92, col: '#e0f2fe', bord: '#0284c7' },
      { cle: 'eau', nom: 'eau', rho: 1, col: '#93c5fd', bord: '#1d4ed8', liquide: true },
      { cle: 'lait', nom: 'lait', rho: 1.03, col: '#f8fafc', bord: '#64748b', liquide: true },
      { cle: 'miel', nom: 'miel', rho: 1.4, col: '#f59e0b', bord: '#92400e', liquide: true },
      { cle: 'verre', nom: 'verre', rho: 2.5, col: '#ccfbf1', bord: '#0f766e' },
      { cle: 'aluminium', nom: 'aluminium', rho: 2.7, col: '#e2e8f0', bord: '#475569' },
      { cle: 'fer', nom: 'fer', rho: 7.8, col: '#94a3b8', bord: '#334155' },
      { cle: 'cuivre', nom: 'cuivre', rho: 8.9, col: '#fdba74', bord: '#9a3412' },
      { cle: 'or', nom: 'or', rho: 19.3, col: '#facc15', bord: '#854d0e' }
    ];
    var C_EAU = '#0369a1', C_POINT = '#dc2626', C_GRIS = '#64748b', C_BLEU = '#1d4ed8', C_ORANGE = '#c2410c';

    function fmt(v, dec) {
      var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
      while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
      return e + out + (parts[1] ? ',' + parts[1] : '');
    }
    function arrondi(v, dec) { var k = Math.pow(10, dec); return Math.round(v * k) / k; }

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var matiere = MATIERES[9];       // l'aluminium
    var V = 50;                      // cm³
    var phase = 'repos';             // repos | volume | masse | quotient | eau
    var frac = 0;
    var chips = {}, refs = null;
    function masse() { return arrondi(matiere.rho * V, 2); }      // g
    function rho() { return matiere.rho; }

    /* ==================================================================== */
    /* La géométrie                                                          */
    /* ==================================================================== */
    var fixe = { fixed: true, highlight: false };
    function opts(o) { var r = {}; for (var k in fixe) r[k] = fixe[k]; for (k in o) r[k] = o[k]; return r; }
    // le cube : côté ∛V en cm, 1 cm = 0,42 unité ; posé sur la balance
    var ECH = 0.42, K = 0.35, CX = -4.6, BAL_Y = -1.3;
    function cote() { return Math.cbrt(V); }
    function P(x, y, z) { var c = cote() * ECH; return [CX - c / 2 + x * c + z * K * c, BAL_Y + y * c + z * K * c]; }
    // la balance électronique
    board.create('polygon', [[CX - 2.6, BAL_Y - 1.9], [CX + 2.6, BAL_Y - 1.9], [CX + 2.6, BAL_Y - 0.1], [CX - 2.6, BAL_Y - 0.1]],
      opts({ borders: { strokeColor: '#334155', strokeWidth: 1.5 }, fillColor: '#e2e8f0', fillOpacity: 1, vertices: { visible: false } }));
    board.create('segment', [[CX - 2.3, BAL_Y], [CX + 2.3, BAL_Y]], opts({ strokeColor: '#334155', strokeWidth: 4 }));
    board.create('polygon', [[CX - 1.5, BAL_Y - 1.6], [CX + 1.5, BAL_Y - 1.6], [CX + 1.5, BAL_Y - 0.6], [CX - 1.5, BAL_Y - 0.6]],
      opts({ borders: { strokeColor: '#334155', strokeWidth: 1 }, fillColor: '#0f172a', fillOpacity: 1, vertices: { visible: false } }));
    var afficheur = board.create('text', [CX, BAL_Y - 1.1, function () {
      if (phase === 'repos' || phase === 'volume') return '0,00 g';
      if (phase === 'masse' && frac < 1) return fmt(arrondi(masse() * frac, 2), 2) + ' g';
      return fmt(masse(), 2) + ' g';
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: '#4ade80', cssStyle: 'font-weight:700;font-family:monospace' }));
    board.create('text', [CX, BAL_Y - 2.25, 'balance électronique'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: C_GRIS }));
    // les trois faces du cube
    function face(coins, teinte) {
      var c = board.create('curve', [[0], [0]], opts({ strokeColor: '#334155', strokeWidth: 1.2, fillColor: '#fff', fillOpacity: 1, layer: 2 }));
      c.updateDataArray = function () {
        var pts = coins.map(function (q) { return P(q[0], q[1], q[2]); });
        this.dataX = pts.map(function (p) { return p[0]; }).concat([pts[0][0]]);
        this.dataY = pts.map(function (p) { return p[1]; }).concat([pts[0][1]]);
      };
      c.teinte = teinte;
      return c;
    }
    var faces = [face([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], 0), face([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], 1), face([[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]], 2)];
    function assombrir(col, k) {   // k < 0 assombrit, k > 0 éclaircit
      var r = parseInt(col.slice(1, 3), 16), g = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
      function f(c) { c = k < 0 ? c * (1 + k) : c + (255 - c) * k; return ('0' + Math.round(Math.max(0, Math.min(255, c))).toString(16)).slice(-2); }
      return '#' + f(r) + f(g) + f(b);
    }
    var nomMatiere = board.create('text', [function () { return P(0.5, 1, 1)[0]; }, function () { return P(0.5, 1, 1)[1] + 0.45; }, function () { return matiere.nom; }],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: '#1e293b', cssStyle: 'font-weight:700' }));
    // la cote du volume
    var coteTxt = board.create('text', [function () { return P(1, 0, 0)[0] + 0.25; }, function () { return P(1, 0.5, 0)[1]; }, function () {
      return phase === 'repos' ? '' : 'V = ' + fmt(V) + ' cm³';
    }], opts({ anchorX: 'left', anchorY: 'middle', fontSize: 12, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }));
    var coteCm = board.create('text', [function () { return P(1, 0, 0)[0] + 0.25; }, function () { return P(1, 0.5, 0)[1] - 0.4; }, function () {
      return phase === 'repos' ? '' : '(un cube de ' + fmt(arrondi(cote(), 1)) + ' cm de côté)';
    }], opts({ anchorX: 'left', anchorY: 'middle', fontSize: 9, strokeColor: C_GRIS }));
    // le bilan, sous la balance
    var bilan = board.create('text', [CX, BAL_Y - 2.85, function () {
      if (phase === 'quotient' || phase === 'eau') return 'ρ = ' + fmt(masse(), 2) + ' ÷ ' + fmt(V) + ' = ' + fmt(rho()) + ' g/cm³';
      return '';
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 14, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }));

    /* ==================================================================== */
    /* Le graphique m en fonction de V                                       */
    /* ==================================================================== */
    var G = { x0: 1.0, x1: 7.4, y0: -2.6, y1: 5.2, Vmax: 100, mmax: 2000 };
    function gx(v) { return G.x0 + v / G.Vmax * (G.x1 - G.x0); }
    function gy(m) { return G.y0 + m / G.mmax * (G.y1 - G.y0); }
    board.create('arrow', [[G.x0, G.y0], [G.x1 + 0.3, G.y0]], opts({ strokeColor: '#334155', strokeWidth: 1.2 }));
    board.create('arrow', [[G.x0, G.y0], [G.x0, G.y1 + 0.4]], opts({ strokeColor: '#334155', strokeWidth: 1.2 }));
    board.create('text', [G.x1 + 0.3, G.y0 - 0.35, 'V (cm³)'], opts({ anchorX: 'right', anchorY: 'middle', fontSize: 11, strokeColor: '#334155' }));
    board.create('text', [G.x0 + 0.15, G.y1 + 0.45, 'm (g)'], opts({ anchorX: 'left', anchorY: 'middle', fontSize: 11, strokeColor: '#334155' }));
    [25, 50, 75, 100].forEach(function (v) {
      board.create('segment', [[gx(v), G.y0], [gx(v), G.y0 - 0.1]], opts({ strokeColor: '#334155', strokeWidth: 1 }));
      board.create('text', [gx(v), G.y0 - 0.32, String(v)], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: '#334155' }));
    });
    [500, 1000, 1500, 2000].forEach(function (m) {
      board.create('segment', [[G.x0, gy(m)], [G.x0 - 0.1, gy(m)]], opts({ strokeColor: '#334155', strokeWidth: 1 }));
      board.create('text', [G.x0 - 0.15, gy(m), fmt(m)], opts({ anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: '#334155' }));
    });
    board.create('text', [G.x0 - 0.15, G.y0 - 0.32, '0'], opts({ anchorX: 'right', anchorY: 'middle', fontSize: 10, strokeColor: '#334155' }));
    // la droite de l'eau, en pointillé, toujours là
    board.create('segment', [[G.x0, G.y0], [gx(100), gy(100)]], opts({ strokeColor: C_EAU, strokeWidth: 1.6, dash: 2 }));
    board.create('text', [gx(100) + 0.1, gy(100), 'eau : 1 g/cm³'], opts({ anchorX: 'left', anchorY: 'middle', fontSize: 10, strokeColor: C_EAU }));
    // la droite de la matière : jusqu'au bord du graphique
    var droite = board.create('curve', [[0], [0]], opts({ strokeWidth: 2.2, strokeColor: '#334155', layer: 4 }));
    droite.updateDataArray = function () {
      if (phase !== 'eau' && phase !== 'quotient') { this.dataX = [NaN]; this.dataY = [NaN]; return; }
      // toutes les matières tiennent : l'or, 19,3 g/cm³, donne 1 930 g pour 100 cm³
      var vFin = Math.min(G.Vmax, G.mmax / rho());
      var p = phase === 'quotient' ? frac : 1;
      this.dataX = [G.x0, gx(vFin * p)]; this.dataY = [G.y0, gy(rho() * vFin * p)];
    };
    // l'étiquette de la droite, à son bout droit, décalée vers le haut ou le bas selon qu'elle est au-dessus ou en dessous de l'eau
    var etiquetteDroite = board.create('text', [gx(100) + 0.1, function () { return gy(Math.min(rho() * 100, G.mmax)) + (rho() >= 1 ? 0.32 : -0.32); },
                                                function () { return phase === 'eau' && matiere.cle !== 'eau' ? matiere.nom + ' : ' + fmt(rho()) + ' g/cm³' : ''; }],
      opts({ anchorX: 'left', anchorY: 'middle', fontSize: 11, cssStyle: 'font-weight:700' }));
    // le point (V ; m) et ses pointillés
    function pointVisible() { return phase === 'masse' || phase === 'quotient' || phase === 'eau'; }
    function pointHorsCadre() { return masse() > G.mmax; }
    var point = board.create('point', [function () { return gx(V); }, function () { return gy(Math.min(masse(), G.mmax)); }],
      opts({ name: '', withLabel: false, size: 5, fillColor: C_POINT, strokeColor: '#7f1d1d', layer: 9, visible: false }));
    var pointV = board.create('segment', [[function () { return gx(V); }, G.y0], point], opts({ strokeColor: C_POINT, strokeWidth: 1, dash: 2, visible: false }));
    var pointM = board.create('segment', [[G.x0, function () { return gy(Math.min(masse(), G.mmax)); }], point], opts({ strokeColor: C_POINT, strokeWidth: 1, dash: 2, visible: false }));
    var lectureV = board.create('text', [function () { return gx(V); }, G.y0 - 0.65, function () { return 'V = ' + fmt(V); }],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_POINT, cssStyle: 'font-weight:700', visible: false }));
    var lectureM = board.create('text', [G.x0 - 0.15, function () { return gy(Math.min(masse(), G.mmax)) + 0.3; }, function () { return pointHorsCadre() ? 'm = ' + fmt(masse(), 2) + ' (hors cadre)' : 'm = ' + fmt(masse(), 2); }],
      opts({ anchorX: 'right', anchorY: 'middle', fontSize: 11, strokeColor: C_POINT, cssStyle: 'font-weight:700', visible: false }));
    var titreGraphe = board.create('text', [(G.x0 + G.x1) / 2, G.y1 + 0.9, function () {
      if (phase === 'eau') return rho() > 1 ? 'au-dessus de l\'eau : plus dense, ça coule' : rho() < 1 ? 'en dessous de l\'eau : moins dense, ça flotte' : 'c\'est l\'eau : 1 g/cm³';
      if (phase === 'quotient') return 'm et V sont proportionnels : ρ est la pente';
      return 'la masse en fonction du volume';
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_GRIS, cssStyle: 'font-weight:700' }));

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function refresh() {
      faces.forEach(function (f) {
        var teintes = [0, 0.3, -0.25];
        f.setAttribute({ fillColor: assombrir(matiere.col, teintes[f.teinte]), strokeColor: matiere.bord, visible: phase !== 'repos' });
      });
      nomMatiere.setAttribute({ visible: phase !== 'repos' });
      var pv = pointVisible();
      point.setAttribute({ visible: pv }); pointV.setAttribute({ visible: pv }); pointM.setAttribute({ visible: pv });
      lectureV.setAttribute({ visible: pv }); lectureM.setAttribute({ visible: pv });
      droite.setAttribute({ strokeColor: matiere.bord });
      etiquetteDroite.setAttribute({ strokeColor: matiere.bord });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    function b(t) { return '<b>' + t + '</b>'; }
    function ecrirePanneau() {
      var html = '', m = masse(), r = rho();
      if (phase === 'repos') {
        html += '<div class="props-label">À volume égal, pas la même masse</div>';
        html += '<p>Choisis une matière et règle le volume du cube : on le mesure, on le pèse, et on divise. Le quotient ' + b('ρ = m ÷ V') + ' est la <b>masse volumique</b> : la masse d\'un seul centimètre cube.</p>';
      } else if (phase === 'volume') {
        html += '<div class="props-label">1. Mesurer le volume</div>';
        html += '<p>Le cube de ' + matiere.nom + ' fait ' + b('V = ' + fmt(V) + ' cm³') + (matiere.liquide ? ' (pour un liquide, on lirait ' + fmt(V) + ' mL à l\'éprouvette : 1 cm³ = 1 mL).' : '.') + '</p>';
      } else if (phase === 'masse') {
        html += '<div class="props-label">2. Peser</div>';
        html += '<p>La balance indique ' + b('m = ' + fmt(m, 2) + ' g') + '. Sur le graphique, on place le point (V ; m) : ' + fmt(V) + ' cm³ en abscisse, ' + fmt(m, 2) + ' g en ordonnée.</p>';
      } else if (phase === 'quotient') {
        html += '<div class="props-label">3. Diviser : la masse d\'un seul cm³</div>';
        html += '<p>' + b('ρ = m ÷ V = ' + fmt(m, 2) + ' ÷ ' + fmt(V) + ' = ' + fmt(r) + ' g/cm³') + ' : chaque centimètre cube de ' + matiere.nom + ' pèse ' + fmt(r) + ' g.</p>';
        html += '<p>Change le volume : le point glisse sur une <b>droite qui passe par l\'origine</b>. m et V sont <b>proportionnels</b>, et le quotient ne change pas : ρ caractérise la matière, pas le morceau.</p>';
      } else {
        html += '<div class="props-label">4. Comparer à l\'eau, et dire l\'unité</div>';
        html += '<p>L\'eau : 1 g/cm³. ' + (r > 1 ? 'Le ' + matiere.nom + ' est <b>plus dense</b> (' + fmt(r) + ' > 1) : sa droite est au-dessus, il <b>coule</b>.' : r < 1 ? 'Le ' + matiere.nom + ' est <b>moins dense</b> (' + fmt(r) + ' < 1) : sa droite est en dessous, il <b>flotte</b>.' : 'C\'est la référence.') + '</p>';
        html += '<p>Même nombre, trois noms : ' + b(fmt(r) + ' g/cm³ = ' + fmt(r) + ' g/mL = ' + fmt(r) + ' kg/L') + ' (1 cm³ = 1 mL, et 1 kg pour 1 L, c\'est 1 g pour 1 mL).</p>';
        html += '<p>Autre nombre : un litre, c\'est 1 000 mL, donc ' + b(fmt(r) + ' g/mL = ' + fmt(arrondi(r * 1000, 3)) + ' g/L') + ', et ' + b(fmt(r) + ' g/cm³ = ' + fmt(arrondi(r * 1000, 3)) + ' kg/m³') +
                '. <span style="color:' + C_ORANGE + '">Écrire ' + fmt(r) + ' g/L serait mille fois trop léger.</span></p>';
      }
      html += '<p class="etats-molecules">ρ = m ÷ V · g/cm³ = g/mL = kg/L · 1 g/mL = 1 000 g/L · eau : 1 g/cm³</p>';
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les animations                                                        */
    /* ==================================================================== */
    var anim = null;
    function pose(ph, p) { phase = ph; frac = p; }
    function raz() { pose('repos', 0); redraw(); }
    function lancer() {
      anim.cancel();
      MATIERES.forEach(function (x) { chips[x.cle].className = 'ineq-preset' + (x === matiere ? ' active' : ''); });
      var steps = ['volume', 'masse', 'quotient', 'eau'].map(function (ph) {
        return { dur: ph === 'quotient' ? 1200 : 800, step: function (p) { pose(ph, p); refresh(); }, after: function () { pose(ph, 1); refresh(); } };
      });
      raz();
      anim.runSteps(steps, raz);
    }

    /* ==================================================================== */
    /* Les choix                                                             */
    /* ==================================================================== */
    var choix = document.createElement('div');
    choix.className = 'ineq-presets melange-choix';
    MATIERES.forEach(function (x) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset';
      bt.textContent = x.nom + ' (' + fmt(x.rho) + ')';
      bt.onclick = function () { matiere = x; lancer(); };
      choix.appendChild(bt); chips[x.cle] = bt;
    });
    mv.extras.appendChild(choix);

    refs = mv.addControls([
      { type: 'slider', id: 'volume', label: 'Volume V (cm³)', min: 10, max: 100, step: 10, value: V,
        onInput: function (v) { V = v; lancer(); } },
      { type: 'button', id: 'mesurer', label: '⚖️ Mesurer, peser, diviser', onClick: lancer },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); MATIERES.forEach(function (x) { chips[x.cle].className = 'ineq-preset'; }); raz(); } }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    lancer();   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
