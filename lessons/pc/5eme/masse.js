/*
 * La masse et ses unités (5ème, physique-chimie).
 *
 * La masse d'un objet, c'est la quantité de matière qu'il contient. On la
 * mesure avec une balance, et l'unité du système international est le
 * kilogramme. À gauche, une balance de Roberval : on pose l'objet sur un
 * plateau, il descend ; on pose des masses marquées sur l'autre, une à une,
 * jusqu'à l'équilibre — la masse de l'objet est la somme des masses marquées.
 * À droite, le tableau de conversion (t, kg, hg, dag, g, dg, cg, mg) : la
 * masse mesurée s'y écrit un chiffre par colonne, et changer d'unité, c'est
 * déplacer la virgule derrière une autre colonne — une colonne, c'est × 10 ou
 * ÷ 10 ; trois colonnes, × 1000 ou ÷ 1000 — en complétant par des zéros.
 *
 * Neuf objets à peser, quatre unités d'arrivée. Une voiture ne tient pas sur
 * la balance : un pont-bascule indique 1,2 t, et la tonne entre au tableau.
 *
 * Tout le dessin découle d'un ÉTAT (l'objet, l'unité cible, la phase, la
 * fraction de la phase, le nombre de masses marquées posées) que refresh()
 * traduit en positions et attributs AVANT board.update(). Chaque étape pose
 * un état absolu : « Précédent » redonne exactement la même figure.
 */
MathsView.register({
  id: 'masse',
  title: 'La masse et ses unités',
  level: '5eme',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'Masse, volume, masse volumique',
  exercices: ['pc-masse'],
  theme: 'La quantité de matière, pesée sur une balance : kg, g, mg, et le tableau pour passer de l\'une à l\'autre',
  description:
    'La <strong>masse</strong> d\'un objet, c\'est la <strong>quantité de matière</strong> qu\'il ' +
    'contient. On la mesure avec une <strong>balance</strong>, en <strong>kilogrammes</strong> (kg), ' +
    'en grammes (g) ou en milligrammes (mg) selon l\'objet.' +
    '<br>Choisis un objet : il est posé sur le plateau de gauche, puis des <strong>masses ' +
    'marquées</strong> sont posées à droite jusqu\'à l\'<strong>équilibre</strong>. La masse se ' +
    'lit alors, puis s\'écrit dans le <strong>tableau de conversion</strong> : changer d\'unité, ' +
    'c\'est déplacer la virgule — une colonne par unité, trois colonnes de g à kg.',
  notes:
    '<ul>' +
    '<li><strong>Ce que c\'est.</strong> La masse mesure la quantité de matière. Elle ne dépend ni ' +
    'de la forme (une boule ou une galette de la même pâte ont la même masse), ni du lieu (sur la ' +
    'Lune, ta masse est la même — c\'est ton <em>poids</em> qui change), ni de l\'état (100 g de glace ' +
    'fondent en 100 g d\'eau).</li>' +
    '<li><strong>Comment on la mesure.</strong> Avec une balance : à plateaux, en équilibrant avec des ' +
    'masses marquées ; ou électronique, qui affiche directement la valeur. Pour une voiture, un ' +
    'pont-bascule.</li>' +
    '<li><strong>Les unités.</strong> L\'unité légale est le <strong>kilogramme</strong> (kg). ' +
    '1 kg = 1 000 g, 1 g = 1 000 mg, 1 t = 1 000 kg. Entre deux, les unités intermédiaires : ' +
    'hg, dag, g, dg, cg, mg — chacune vaut dix fois la suivante.</li>' +
    '<li><strong>Convertir.</strong> Dans le tableau, un chiffre par colonne, le chiffre des unités ' +
    'dans la colonne de l\'unité de départ. Pour changer d\'unité, on déplace la virgule derrière la ' +
    'nouvelle colonne et on complète avec des zéros. Vers une unité plus grande (g → kg), le nombre ' +
    'devient plus petit : on divise. Vers une unité plus petite (kg → g), on multiplie.</li>' +
    '<li><strong>Le piège.</strong> 1,5 kg, ce n\'est pas 1 kg et 50 g : c\'est 1 kg et ' +
    '<strong>500 g</strong> (1,500 kg). Et 0,25 kg = 250 g, pas 25 g.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6.2, 8, -3.4], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'La masse et ses unités',
    figures: [{
      legende: 'À l\'équilibre, la masse de l\'objet est la somme des masses marquées.',
      boundingbox: [-4.4, 2.6, 4.4, -2.4],
      largeur: 50, hauteur: 28,
      dessine: function (board) {
        var P = [0, 0.9], L = 2.6, h = 1.5;
        function seg(a, b, col, w) { board.create('segment', [a, b], { strokeColor: col || '#334155', strokeWidth: w || 1.2, fixed: true, highlight: false }); }
        board.create('polygon', [[-0.7, -1.9], [0.7, -1.9], P], { borders: { strokeColor: '#334155', strokeWidth: 1 }, fillColor: '#e2e8f0', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        seg([P[0] - L, P[1]], [P[0] + L, P[1]], '#334155', 2);
        [-1, 1].forEach(function (s) {
          var E = [P[0] + s * L, P[1]], C = [E[0], E[1] - h];
          seg(E, [C[0] - 0.9, C[1]]); seg(E, [C[0] + 0.9, C[1]]);
          seg([C[0] - 1.0, C[1]], [C[0] + 1.0, C[1]], '#334155', 3);
        });
        board.create('polygon', [[-3.2, -0.6], [-2.0, -0.6], [-2.0, 0.3], [-3.2, 0.3]], { borders: { strokeColor: '#b45309', strokeWidth: 1 }, fillColor: '#fcd34d', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        board.create('text', [-2.6, -0.15, 'beurre'], { anchorX: 'middle', anchorY: 'middle', fontSize: 6, color: '#78350f', fixed: true, highlight: false });
        board.create('polygon', [[2.0, -0.6], [3.0, -0.6], [3.0, -0.1], [2.0, -0.1]], { borders: { strokeColor: '#475569', strokeWidth: 1 }, fillColor: '#cbd5e1', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        board.create('polygon', [[2.2, -0.1], [2.8, -0.1], [2.8, 0.3], [2.2, 0.3]], { borders: { strokeColor: '#475569', strokeWidth: 1 }, fillColor: '#cbd5e1', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        board.create('text', [3.15, -0.35, '200 g'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#334155', fixed: true, highlight: false });
        board.create('text', [2.95, 0.1, '50 g'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#334155', fixed: true, highlight: false });
        board.create('text', [0, 2.2, 'm = 200 g + 50 g = 250 g'], { anchorX: 'middle', anchorY: 'middle', fontSize: 7, color: '#1d4ed8', cssStyle: 'font-weight:700', fixed: true, highlight: false });
      }
    }, {
      legende: 'Un chiffre par colonne ; la virgule derrière l\'unité choisie.',
      boundingbox: [-0.3, 2.4, 10.3, -1.4],
      largeur: 50, hauteur: 22,
      dessine: function (board) {
        var U = ['t', '', '', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
        function seg(a, b, w) { board.create('segment', [a, b], { strokeColor: '#334155', strokeWidth: w || 0.8, fixed: true, highlight: false }); }
        for (var i = 0; i <= 10; i++) seg([i, 1.8], [i, 0], i === 0 || i === 10 ? 1.2 : 0.8);
        seg([0, 1.8], [10, 1.8], 1.2); seg([0, 0.9], [10, 0.9], 0.8); seg([0, 0], [10, 0], 1.2);
        U.forEach(function (u, i) {
          if (!u) { board.create('polygon', [[i, 1.8], [i + 1, 1.8], [i + 1, 0.9], [i, 0.9]], { borders: { visible: false }, fillColor: '#e2e8f0', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false }); return; }
          board.create('text', [i + 0.5, 1.35, u], { anchorX: 'middle', anchorY: 'middle', fontSize: 6.5, color: '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        });
        [[3, '0'], [4, '1'], [5, '5'], [6, '0']].forEach(function (c) {
          board.create('text', [c[0] + 0.5, 0.45, c[1]], { anchorX: 'middle', anchorY: 'middle', fontSize: 7.5, color: c[0] === 3 ? '#c2410c' : '#1d4ed8', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        });
        board.create('text', [4.02, 0.2, ','], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: '#c2410c', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [5, -0.7, '150 g = 0,15 kg (÷ 1000 : trois colonnes vers la gauche)'], { anchorX: 'middle', anchorY: 'middle', fontSize: 6.2, color: '#1d4ed8', fixed: true, highlight: false });
      }
    }],
    points: [
      'La <b>masse</b> d\'un objet mesure la <b>quantité de matière</b> qu\'il contient. Elle ne change ni avec la forme, ni avec le lieu, ni avec l\'état.',
      'On la mesure avec une <b>balance</b>. Unité légale : le <b>kilogramme</b> (kg).',
      '1 t = 1 000 kg · 1 kg = 1 000 g · 1 g = 1 000 mg. Chaque colonne du tableau vaut dix fois la suivante : t, kg, hg, dag, g, dg, cg, mg.',
      'Convertir : un chiffre par colonne, la virgule derrière l\'unité de départ ; on la déplace derrière l\'unité d\'arrivée et on complète par des zéros.',
      'Vers une unité plus grande, le nombre devient plus petit (on divise) ; vers une unité plus petite, il grandit (on multiplie).'
    ],
    exemples: [
      '2,5 kg = 2 500 g ; 250 g = 0,25 kg ; 4 g = 4 000 mg ; 1,2 t = 1 200 kg.',
      '1,5 kg = 1 kg 500 g (et pas 1 kg 50 g !).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les objets, les masses marquées, les unités                           */
    /* ==================================================================== */
    // m en grammes. `court` est l'étiquette dessinée sur le plateau.
    var OBJETS = [
      { cle: 'comprime', nom: 'un comprimé', court: 'comprimé', m: 0.5, l: 0.5, h: 0.25, col: '#f8fafc', bord: '#64748b' },
      { cle: 'trombone', nom: 'un trombone', court: 'trombone', m: 1, l: 0.9, h: 0.22, col: '#e2e8f0', bord: '#475569' },
      { cle: 'piece', nom: 'une pièce de 2 €', court: '2 €', m: 8.5, l: 0.6, h: 0.6, col: '#fde68a', bord: '#b45309' },
      { cle: 'pomme', nom: 'une pomme', court: 'pomme', m: 150, l: 0.9, h: 0.9, col: '#fca5a5', bord: '#b91c1c' },
      { cle: 'beurre', nom: 'une plaquette de beurre', court: 'beurre', m: 250, l: 1.3, h: 0.7, col: '#fcd34d', bord: '#b45309' },
      { cle: 'farine', nom: 'un paquet de farine', court: 'farine', m: 1000, l: 1.1, h: 1.3, col: '#fef3c7', bord: '#a16207' },
      { cle: 'dico', nom: 'un dictionnaire', court: 'dico', m: 1200, l: 1.4, h: 1.0, col: '#c7d2fe', bord: '#3730a3' },
      { cle: 'bouteille', nom: 'une bouteille d\'eau pleine (1,5 L)', court: 'eau 1,5 L', m: 1500, l: 0.7, h: 1.6, col: '#bae6fd', bord: '#0369a1' },
      { cle: 'voiture', nom: 'une voiture', court: 'voiture', m: 1200000, lourd: true }
    ];
    // La boîte de masses marquées : 1 - 2 - 2 - 5 à chaque ordre de grandeur.
    var MARQUEES = [2000, 1000, 500, 200, 200, 100, 50, 20, 20, 10, 5, 2, 2, 1, 0.5, 0.2, 0.2, 0.1];
    // Les colonnes du tableau. Entre la tonne et le kilogramme, deux colonnes
    // sans nom usuel (le quintal et la dizaine de kilos) : elles sont là pour
    // que « 1 t = 1 000 kg » fasse bien trois colonnes.
    var UNITES = ['t', '', '', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
    var NCOL = UNITES.length;
    var EN_MG = {};
    UNITES.forEach(function (u, i) { if (u) EN_MG[u] = Math.pow(10, NCOL - 1 - i); });
    var CIBLES = ['t', 'kg', 'g', 'mg'];
    var C_BLEU = '#1d4ed8', C_ORANGE = '#c2410c', C_GRIS = '#64748b', C_VIRGULE = '#c2410c';

    function decompose(m) {
      var reste = Math.round(m * 1000), out = [];
      MARQUEES.forEach(function (mm) { var v = Math.round(mm * 1000); if (reste >= v) { reste -= v; out.push(mm); } });
      return out;
    }
    function fmt(v, dec) {
      // écriture française d'un nombre : virgule décimale, espaces fines par
      // milliers ; `dec` fixe le nombre de décimales (les zéros de queue tombent)
      var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
      while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
      return e + out + (parts[1] ? ',' + parts[1] : '');
    }
    function etiquette(mm) { return mm >= 1000 ? fmt(mm / 1000) + ' kg' : mm >= 1 ? fmt(mm) + ' g' : fmt(mm * 1000) + ' mg'; }
    // L'unité « naturelle » de la mesure : kg au-delà du kilo, mg sous le gramme.
    function uniteMesure(o) { return o.lourd ? 't' : o.m >= 1000 ? 'kg' : o.m < 1 ? 'mg' : 'g'; }
    function valeur(o, u) { return Math.round(o.m * 1000) / EN_MG[u]; }
    function ecrit(o, u) { return fmt(valeur(o, u), NCOL - 1 - UNITES.indexOf(u)) + ' ' + u; }
    function cibleParDefaut(o) { var u = uniteMesure(o); return u === 'g' ? 'kg' : u === 'kg' ? 'g' : u === 'mg' ? 'g' : 'kg'; }

    /* Les chiffres du tableau : la masse en mg, un chiffre par colonne, et
       l'étendue à montrer pour une unité donnée (de la colonne du premier
       chiffre non nul — ou de l'unité si le nombre est plus petit que 1 — à la
       colonne du dernier chiffre non nul, ou de l'unité). */
    function chiffres(o) {
      var s = String(Math.round(o.m * 1000)), d = [];
      for (var i = 0; i < NCOL; i++) d[i] = 0;
      for (i = 0; i < s.length && i < NCOL; i++) d[NCOL - 1 - i] = +s[s.length - 1 - i];
      return d;
    }
    function etendue(d, u) {
      var cu = UNITES.indexOf(u), g = NCOL - 1, dr = 0;
      for (var i = 0; i < NCOL; i++) if (d[i]) { g = Math.min(g, i); dr = Math.max(dr, i); }
      return { g: Math.min(g, cu), d: Math.max(dr, cu) };
    }

    /* ==================================================================== */
    /* La géométrie                                                          */
    /* ==================================================================== */
    var PIVOT = [-4.3, 0.3], DEMI = 2.7, FIL = 1.7, PLATEAU = 1.15, SOCLE_Y = -2.7, ANGLE_MAX = 11 * Math.PI / 180;
    var TABLE = { x0: 0.6, w: 0.7, yHaut: 5.6, yMilieu: 4.85, yBas: 3.95 };
    function xCol(i) { return TABLE.x0 + i * TABLE.w; }
    var N_MARQUEES = 5;   // au plus cinq masses marquées dessinées : la boîte 1-2-2-5 n'en demande jamais plus

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var objet = OBJETS[3];          // la pomme
    var cible = cibleParDefaut(objet);
    var phase = 'repos';            // repos | objet | masses | lecture | lourd | tableau | glisse
    var frac = 0;                   // avancement de la phase (0..1)
    var nPoses = 0;                 // masses marquées posées
    var chipsObjets = {}, chipsUnites = {};

    function marquees() { return objet.lourd ? [] : decompose(objet.m); }
    function sommePosee() { var s = 0; marquees().slice(0, nPoses).forEach(function (mm) { s += mm; }); return Math.round(s * 1000) / 1000; }
    // L'angle du fléau : positif quand la gauche descend. Il suit l'écart,
    // plafonné, et apparaît progressivement quand on pose l'objet.
    function angle() {
      if (objet.lourd || phase === 'repos') return 0;
      var ecart = objet.m - sommePosee(), k = Math.max(-1, Math.min(1, ecart / objet.m));
      var a = ANGLE_MAX * k;
      if (phase === 'objet') a *= frac;
      else if (phase === 'masses' && frac < 1) {
        // la masse en train de tomber ne compte pas encore
        var avant = objet.m - (sommePosee() - marquees()[nPoses - 1]);
        a = ANGLE_MAX * Math.max(-1, Math.min(1, avant / objet.m)) * (1 - frac) + a * frac;
      }
      return a;
    }
    function bout(s) { var a = angle(); return [PIVOT[0] + s * DEMI * Math.cos(a), PIVOT[1] + s * DEMI * Math.sin(a)]; }
    function plateau(s) { var E = bout(s); return [E[0], E[1] - FIL]; }
    var auTableau = { tableau: 1, glisse: 1 };
    function montreTableau() { return !!auTableau[phase]; }
    function objetVisible() { return !objet.lourd && phase !== 'repos'; }

    /* ==================================================================== */
    /* La balance                                                            */
    /* ==================================================================== */
    var fixe = { fixed: true, highlight: false };
    function opts(o) { var r = {}; for (var k in fixe) r[k] = fixe[k]; for (k in o) r[k] = o[k]; return r; }
    board.create('polygon', [[PIVOT[0] - 1.2, SOCLE_Y], [PIVOT[0] + 1.2, SOCLE_Y], PIVOT],
      opts({ borders: { strokeColor: '#334155', strokeWidth: 1.5 }, fillColor: '#e2e8f0', fillOpacity: 1, vertices: { visible: false } }));
    var G = board.create('point', [function () { return bout(-1)[0]; }, function () { return bout(-1)[1]; }], opts({ visible: false }));
    var D = board.create('point', [function () { return bout(1)[0]; }, function () { return bout(1)[1]; }], opts({ visible: false }));
    var fleau = board.create('segment', [G, D], opts({ strokeColor: '#334155', strokeWidth: 4 }));
    board.create('point', PIVOT, opts({ name: '', withLabel: false, size: 3, fillColor: '#334155', strokeColor: '#334155' }));
    // l'aiguille, perpendiculaire au fléau, et son zéro
    board.create('segment', [PIVOT, [function () { return PIVOT[0] + 1.1 * Math.sin(angle()); }, function () { return PIVOT[1] - 1.1 * Math.cos(angle()); }]],
      opts({ strokeColor: '#dc2626', strokeWidth: 2 }));
    board.create('segment', [[PIVOT[0], PIVOT[1] - 1.25], [PIVOT[0], PIVOT[1] - 1.5]], opts({ strokeColor: '#334155', strokeWidth: 1.5 }));
    board.create('text', [PIVOT[0], PIVOT[1] - 1.72, '0'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: '#334155' }));
    [-1, 1].forEach(function (s) {
      var E = [function () { return bout(s)[0]; }, function () { return bout(s)[1]; }];
      [-1, 1].forEach(function (c) {
        board.create('segment', [E, [function () { return plateau(s)[0] + c * (PLATEAU - 0.15); }, function () { return plateau(s)[1]; }]],
          opts({ strokeColor: '#64748b', strokeWidth: 1 }));
      });
      board.create('segment', [[function () { return plateau(s)[0] - PLATEAU; }, function () { return plateau(s)[1]; }],
                               [function () { return plateau(s)[0] + PLATEAU; }, function () { return plateau(s)[1]; }]],
        opts({ strokeColor: '#334155', strokeWidth: 5 }));
    });

    // --- l'objet, sur le plateau de gauche ---
    var formeObjet = board.create('curve', [[0], [0]], opts({ strokeColor: '#334155', strokeWidth: 1.5, fillColor: '#fff', fillOpacity: 1 }));
    formeObjet.updateDataArray = function () {
      var P = plateau(-1), o = objet, l = o.l || 1, h = o.h || 1, y0 = P[1] + 0.05;
      // l'objet descend sur le plateau pendant la phase « objet »
      if (phase === 'objet') y0 += (1 - frac) * 2.2;
      this.dataX = [P[0] - l / 2, P[0] + l / 2, P[0] + l / 2, P[0] - l / 2, P[0] - l / 2];
      this.dataY = [y0, y0, y0 + h, y0 + h, y0];
    };
    var nomObjet = board.create('text', [function () { return plateau(-1)[0]; },
                                         function () { var h = objet.h || 1; return plateau(-1)[1] + 0.05 + Math.max(h / 2, 0.3) + (phase === 'objet' ? (1 - frac) * 2.2 : 0); },
                                         function () { return objet.court; }],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: '#1e293b', cssStyle: 'font-weight:700', layer: 9 }));

    // --- les masses marquées, empilées sur le plateau de droite ---
    var formesMasses = [], nomsMasses = [];
    function largeurMasse(mm) { return 0.45 + 0.17 * Math.log10(mm * 1000 / 100); }   // 100 mg → 0,45 ; 2 kg → 1,2
    function hauteurMasse(mm) { return 0.3 + 0.06 * Math.log10(mm * 1000 / 100); }
    function placeMasse(i) {
      var P = plateau(1), liste = marquees(), y = P[1] + 0.05;
      for (var k = 0; k < i; k++) y += hauteurMasse(liste[k]);
      var tombe = phase === 'masses' && i === nPoses - 1 ? (1 - frac) * 2.4 : 0;
      return { x: P[0], y: y + tombe, l: largeurMasse(liste[i]), h: hauteurMasse(liste[i]), visible: i < nPoses && objetVisible() };
    }
    for (var i = 0; i < N_MARQUEES; i++) {
      (function (i) {
        var f = board.create('curve', [[0], [0]], opts({ strokeColor: '#475569', strokeWidth: 1.2, fillColor: '#cbd5e1', fillOpacity: 1 }));
        f.updateDataArray = function () {
          var p = placeMasse(i);
          if (!p.visible) { this.dataX = [NaN]; this.dataY = [NaN]; return; }
          this.dataX = [p.x - p.l / 2, p.x + p.l / 2, p.x + p.l / 2, p.x - p.l / 2, p.x - p.l / 2];
          this.dataY = [p.y, p.y, p.y + p.h, p.y + p.h, p.y];
        };
        formesMasses.push(f);
        nomsMasses.push(board.create('text', [function () { return placeMasse(i).x + PLATEAU + 0.15; },
                                              function () { var p = placeMasse(i); return p.y + p.h / 2; },
                                              function () { return i < marquees().length ? etiquette(marquees()[i]) : ''; }],
          opts({ anchorX: 'left', anchorY: 'middle', fontSize: 10, strokeColor: '#334155', visible: false })));
      })(i);
    }
    // la lecture, sous la balance
    var lecture = board.create('text', [PIVOT[0], SOCLE_Y - 0.5, function () {
      if (objet.lourd) return phase === 'repos' ? '' : 'pont-bascule : ' + ecrit(objet, 't');
      if (phase === 'repos' || phase === 'objet') return '';
      if (phase === 'masses' && nPoses < marquees().length) return 'pas encore en équilibre';
      return 'm = ' + ecrit(objet, uniteMesure(objet));
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 13, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }));

    /* ==================================================================== */
    /* Le tableau de conversion                                              */
    /* ==================================================================== */
    for (i = 0; i <= NCOL; i++) board.create('segment', [[xCol(i), TABLE.yHaut], [xCol(i), TABLE.yBas]], opts({ strokeColor: '#334155', strokeWidth: i === 0 || i === NCOL ? 1.5 : 0.8 }));
    [TABLE.yHaut, TABLE.yMilieu, TABLE.yBas].forEach(function (y, k) {
      board.create('segment', [[xCol(0), y], [xCol(NCOL), y]], opts({ strokeColor: '#334155', strokeWidth: k === 1 ? 0.8 : 1.5 }));
    });
    UNITES.forEach(function (u, i) {
      if (!u) {   // une colonne sans nom : grisée
        board.create('polygon', [[xCol(i), TABLE.yHaut], [xCol(i + 1), TABLE.yHaut], [xCol(i + 1), TABLE.yMilieu], [xCol(i), TABLE.yMilieu]],
          opts({ borders: { visible: false }, fillColor: '#e2e8f0', fillOpacity: 1, vertices: { visible: false }, layer: 0 }));
        return;
      }
      board.create('text', [xCol(i) + TABLE.w / 2, (TABLE.yHaut + TABLE.yMilieu) / 2, u], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: '#334155', cssStyle: 'font-weight:700' }));
    });
    board.create('text', [xCol(NCOL / 2), TABLE.yHaut + 0.4, 'Tableau de conversion des masses'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    // l'unité de départ et l'unité d'arrivée, pendant le glissement
    function colDepart() { return UNITES.indexOf(uniteMesure(objet)); }
    function colCible() { return UNITES.indexOf(cible); }
    // la colonne derrière laquelle est la virgule, interpolée pendant le glissement
    function colVirgule() { return phase === 'glisse' ? colDepart() + (colCible() - colDepart()) * frac : colDepart(); }
    // les chiffres : ceux de la mesure dès la phase tableau, les zéros ajoutés à la fin du glissement
    var cellules = [];
    function etatCellule(i) {
      if (!montreTableau()) return null;
      var d = chiffres(objet), e0 = etendue(d, uniteMesure(objet));
      var dedans0 = i >= e0.g && i <= e0.d;
      if (dedans0) return { txt: String(d[i]), ajoute: false };
      if (phase === 'glisse' && frac >= 1) {
        var e1 = etendue(d, cible);
        if (i >= e1.g && i <= e1.d) return { txt: '0', ajoute: true };
      }
      return null;
    }
    for (i = 0; i < NCOL; i++) {
      (function (i) {
        cellules.push(board.create('text', [xCol(i) + TABLE.w / 2, (TABLE.yMilieu + TABLE.yBas) / 2, function () { var c = etatCellule(i); return c ? c.txt : ''; }],
          opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: C_BLEU, cssStyle: 'font-weight:700' })));
      })(i);
    }
    var virgule = board.create('text', [function () { return xCol(colVirgule() + 1) + 0.02; }, TABLE.yBas + 0.2, ','],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 20, strokeColor: C_VIRGULE, cssStyle: 'font-weight:700', visible: false, layer: 9 }));
    // la flèche du saut, au-dessus du tableau, avec son facteur
    function facteur() {
      var n = colCible() - colDepart();
      if (!n) return '';
      return (n < 0 ? '÷ ' : '× ') + fmt(Math.pow(10, Math.abs(n)));
    }
    var saut = board.create('arrow', [[function () { return xCol(colDepart() + 1); }, TABLE.yBas - 0.35],
                                      [function () { return xCol(colVirgule() + 1); }, TABLE.yBas - 0.35]],
      opts({ strokeColor: C_ORANGE, strokeWidth: 2.5, lastArrow: { type: 2, size: 6 }, visible: false }));
    var facteurTxt = board.create('text', [function () { return (xCol(colDepart() + 1) + xCol(colCible() + 1)) / 2; }, TABLE.yBas - 0.75, facteur],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_ORANGE, cssStyle: 'font-weight:700', visible: false }));
    // l'égalité, sous le tableau
    var egalite = board.create('text', [xCol(NCOL / 2), TABLE.yBas - 1.5, function () {
      if (!montreTableau()) return '';
      var s = ecrit(objet, uniteMesure(objet));
      if (phase === 'glisse' && frac >= 1 && cible !== uniteMesure(objet)) s += ' = ' + ecrit(objet, cible);
      return s;
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }));
    // les repères, en bas à droite
    board.create('text', [xCol(NCOL / 2), TABLE.yBas - 2.4, '1 t = 1 000 kg · 1 kg = 1 000 g · 1 g = 1 000 mg'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    board.create('text', [xCol(NCOL / 2), TABLE.yBas - 2.95, '→ une colonne vers la droite : × 10 · ← une colonne vers la gauche : ÷ 10'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function refresh() {
      formeObjet.setAttribute({ visible: objetVisible(), fillColor: objet.col || '#fff', strokeColor: objet.bord || '#334155' });
      nomObjet.setAttribute({ visible: objetVisible() });
      var liste = marquees();
      for (var i = 0; i < N_MARQUEES; i++) {
        var v = objetVisible() && i < nPoses && i < liste.length;
        formesMasses[i].setAttribute({ visible: v });
        nomsMasses[i].setAttribute({ visible: v });
      }
      for (i = 0; i < NCOL; i++) {
        var c = etatCellule(i);
        cellules[i].setAttribute({ strokeColor: c && c.ajoute ? C_ORANGE : C_BLEU });
      }
      virgule.setAttribute({ visible: montreTableau() });
      var glisse = phase === 'glisse' && colCible() !== colDepart();
      saut.setAttribute({ visible: glisse && frac > 0 });
      facteurTxt.setAttribute({ visible: glisse && frac >= 1 });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    function ecrirePanneau() {
      var o = objet, html = '', liste = marquees(), u0 = uniteMesure(o);
      function b(t) { return '<b>' + t + '</b>'; }
      if (phase === 'repos') {
        html += '<div class="props-label">La masse : combien de matière ?</div>';
        html += '<p>La masse d\'un objet, c\'est la quantité de matière qu\'il contient. On la mesure avec une <b>balance</b>. Choisis un objet à peser, et l\'unité dans laquelle tu veux lire sa masse.</p>';
      } else if (o.lourd) {
        html += '<div class="props-label">' + o.nom + ' : trop lourd pour la balance</div>';
        html += '<p>Pas de masses marquées assez grosses ! Un <b>pont-bascule</b> indique ' + b(ecrit(o, 't')) + ' : la <b>tonne</b> (t), c\'est 1 000 kg.</p>';
      } else if (phase === 'objet') {
        html += '<div class="props-label">On pose ' + o.nom + '</div>';
        html += '<p>Le plateau de gauche descend. Pour connaître la masse, on va poser des <b>masses marquées</b> à droite, jusqu\'à l\'<b>équilibre</b>.</p>';
      } else if (phase === 'masses' || phase === 'lecture') {
        var posees = liste.slice(0, nPoses).map(etiquette);
        html += '<div class="props-label">' + (nPoses < liste.length ? 'On pose des masses marquées' : 'Équilibre !') + '</div>';
        html += '<p>À droite : ' + b(posees.join(' + ')) + (nPoses > 1 ? ' = ' + b(ecrit({ m: sommePosee() }, u0)) : '') + '.' +
                (nPoses < liste.length ? ' L\'aiguille n\'est pas encore au zéro : il manque ' + b(ecrit({ m: Math.round((o.m - sommePosee()) * 1000) / 1000 }, uniteMesure({ m: o.m - sommePosee() }))) + '.' :
                 ' L\'aiguille est au zéro : ' + o.nom + ' a la même masse que les masses marquées. ' + b('m = ' + ecrit(o, u0)) + '.') + '</p>';
      }
      if (montreTableau()) {
        var d = chiffres(o), e0 = etendue(d, u0), cu0 = UNITES.indexOf(u0);
        html += '<div class="props-label">' + (phase === 'tableau' ? 'On écrit ' + ecrit(o, u0) + ' dans le tableau' : 'On lit en ' + cible) + '</div>';
        html += '<p>Un chiffre par colonne : le chiffre des <b>unités</b> (' + d[cu0] + ') dans la colonne <b>' + u0 + '</b>' +
                (e0.g < cu0 ? ', les autres à sa gauche' : '') + (e0.d > cu0 ? ', les décimales à sa droite' : '') +
                '. La <b>virgule</b> est derrière la colonne ' + u0 + '.</p>';
        if (phase === 'glisse') {
          var n = colCible() - colDepart();
          if (!n) html += '<p>C\'est déjà l\'unité demandée : ' + b(ecrit(o, cible)) + '.</p>';
          else {
            html += '<p>Pour lire en <b>' + cible + '</b>, on déplace la virgule derrière la colonne ' + cible + ' : ' + b(Math.abs(n) + ' colonne' + (Math.abs(n) > 1 ? 's' : '') + ' vers la ' + (n < 0 ? 'gauche' : 'droite')) +
                    ', c\'est ' + b(facteur()) + '. ' + (n < 0 ? 'L\'unité est plus grande, le nombre devient plus petit.' : 'L\'unité est plus petite, il en faut davantage.') +
                    (frac >= 1 ? ' On complète les colonnes vides par des <b style="color:' + C_ORANGE + '">zéros</b> : ' + b(ecrit(o, u0) + ' = ' + ecrit(o, cible)) + '.' : '') + '</p>';
          }
        }
      }
      html += '<p class="etats-molecules">1 t = 1 000 kg · 1 kg = 1 000 g · 1 g = 1 000 mg</p>';
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les animations                                                        */
    /* ==================================================================== */
    var anim = null;
    function pose(ph, p, n) { phase = ph; frac = p; nPoses = n || 0; }
    function raz() { pose('repos', 0, 0); redraw(); }
    function lancer() {
      anim.cancel();
      var o = objet, liste = marquees(), steps = [];
      OBJETS.forEach(function (x) { chipsObjets[x.cle].className = 'ineq-preset' + (x === o ? ' active' : ''); });
      CIBLES.forEach(function (u) { chipsUnites[u].className = 'ineq-preset' + (u === cible ? ' active' : ''); });
      if (o.lourd) {
        steps.push({ dur: 700, step: function (p) { pose('lourd', p, 0); refresh(); }, after: function () { pose('lourd', 1, 0); refresh(); } });
      } else {
        steps.push({ dur: 900, step: function (p) { pose('objet', p, 0); refresh(); }, after: function () { pose('objet', 1, 0); refresh(); } });
        liste.forEach(function (mm, i) {
          steps.push({ dur: 700, step: function (p) { pose('masses', p, i + 1); refresh(); }, after: function () { pose('masses', 1, i + 1); refresh(); } });
        });
        steps.push({ dur: 500, step: function (p) { pose('lecture', p, liste.length); refresh(); }, after: function () { pose('lecture', 1, liste.length); refresh(); } });
      }
      steps.push({ dur: 800, step: function (p) { pose('tableau', p, liste.length); refresh(); }, after: function () { pose('tableau', 1, liste.length); refresh(); } });
      steps.push({ dur: 1300, step: function (p) { pose('glisse', p, liste.length); refresh(); }, after: function () { pose('glisse', 1, liste.length); refresh(); } });
      raz();
      anim.runSteps(steps, raz);
    }

    /* ==================================================================== */
    /* Les choix                                                             */
    /* ==================================================================== */
    var choix = document.createElement('div');
    choix.className = 'ineq-presets melange-choix';
    OBJETS.forEach(function (o) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset';
      bt.textContent = o.nom;
      bt.onclick = function () { objet = o; cible = cibleParDefaut(o); lancer(); };
      choix.appendChild(bt); chipsObjets[o.cle] = bt;
    });
    mv.extras.appendChild(choix);
    var choixU = document.createElement('div');
    choixU.className = 'ineq-presets melange-choix';
    var lab = document.createElement('span'); lab.textContent = 'Lire en : '; lab.className = 'props-label';
    choixU.appendChild(lab);
    CIBLES.forEach(function (u) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset';
      bt.textContent = u === 't' ? 'tonnes (t)' : u === 'kg' ? 'kilogrammes (kg)' : u === 'g' ? 'grammes (g)' : 'milligrammes (mg)';
      bt.onclick = function () { cible = u; lancer(); };
      choixU.appendChild(bt); chipsUnites[u] = bt;
    });
    mv.extras.appendChild(choixU);

    mv.addControls([
      { type: 'button', id: 'peser', label: '⚖️ Peser et convertir', onClick: lancer },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); OBJETS.forEach(function (x) { chipsObjets[x.cle].className = 'ineq-preset'; }); CIBLES.forEach(function (u) { chipsUnites[u].className = 'ineq-preset'; }); raz(); } }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    lancer();   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
