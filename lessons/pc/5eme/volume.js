/*
 * Le volume et ses unités (5ème, physique-chimie).
 *
 * Le volume d'un objet, c'est la place qu'il occupe. Un volume, c'est trois
 * longueurs : voilà pourquoi les unités de volume vont de 1 000 en 1 000, et
 * pourquoi le tableau de conversion a TROIS colonnes par unité. À gauche, un
 * cube de 1 dm de côté — un litre — qu'on découpe : en 10 tranches (1 dL
 * chacune), en 100 barres (1 cL), en 1 000 petits cubes de 1 cm de côté : un
 * centimètre cube, c'est un millilitre. À droite, le tableau : m³, dm³, cm³,
 * mm³ en haut, et les litres qui se glissent dessous — le litre sous le dm³,
 * le millilitre sous le cm³. Un volume mesuré s'y écrit un chiffre par
 * colonne, et changer d'unité, c'est déplacer la virgule.
 *
 * Dix objets à convertir (de la goutte à la piscine), six unités d'arrivée,
 * et le bouton « Le cube de 1 dm » qui joue le découpage.
 *
 * Tout le dessin découle d'un ÉTAT (l'objet ou le découpage, l'unité cible,
 * la phase et son avancement) que refresh() traduit en positions et attributs
 * AVANT board.update(). Chaque étape pose un état absolu.
 */
MathsView.register({
  id: 'volume',
  title: 'Le volume et ses unités',
  level: '5eme',
  matiere: 'pc',
  category: 'chimie',
  subcategory: 'Masse, volume, masse volumique',
  exercices: ['pc-volume'],
  theme: 'La place qu\'occupe un objet : m³, dm³ et cm³, litres et millilitres, et le tableau à trois colonnes par unité',
  description:
    'Le <strong>volume</strong> d\'un objet, c\'est la <strong>place qu\'il occupe</strong>. ' +
    'On le mesure en <strong>mètres cubes</strong> (m³) et ses sous-multiples, ou en ' +
    '<strong>litres</strong> pour les liquides : <strong>1 L = 1 dm³</strong>, un cube de 10 cm de ' +
    'côté, et <strong>1 mL = 1 cm³</strong>.' +
    '<br>Lance <strong>« Le cube de 1 dm »</strong> pour le voir se découper en 10 tranches, ' +
    '100 barres, 1 000 petits cubes. Puis choisis un objet : son volume s\'écrit dans le ' +
    'tableau, et la virgule glisse vers l\'unité demandée — <strong>trois colonnes</strong> par ' +
    'unité de volume, une par unité de litre.',
  notes:
    '<ul>' +
    '<li><strong>Ce que c\'est.</strong> Le volume mesure l\'espace occupé. Un liquide prend la forme ' +
    'de son récipient mais garde son volume ; on le mesure avec une <strong>éprouvette ' +
    'graduée</strong> (on lit au bas du ménisque). Le volume d\'un solide se calcule (un pavé : ' +
    'longueur × largeur × hauteur) ou se mesure par déplacement d\'eau.</li>' +
    '<li><strong>Trois longueurs.</strong> 1 dm = 10 cm, donc 1 dm³ = 10 × 10 × 10 = 1 000 cm³. ' +
    'C\'est pourquoi les unités de volume vont de <strong>1 000 en 1 000</strong> : ' +
    '1 m³ = 1 000 dm³, 1 dm³ = 1 000 cm³, 1 cm³ = 1 000 mm³.</li>' +
    '<li><strong>Les litres.</strong> 1 L = 1 dm³ et 1 mL = 1 cm³. Entre les deux, dL et cL : ' +
    '1 L = 10 dL = 100 cL = 1 000 mL. Le litre se range sous le dm³, le millilitre sous le cm³, ' +
    'et 1 m³ = 1 000 L.</li>' +
    '<li><strong>Convertir.</strong> Dans le tableau, trois colonnes par unité de volume : le chiffre ' +
    'des unités dans la colonne de droite de son unité. Pour changer d\'unité, on déplace la virgule ' +
    'et on complète par des zéros.</li>' +
    '<li><strong>Les pièges.</strong> 1 m³, ce n\'est pas 100 L mais <strong>1 000 L</strong>. ' +
    '1 m = 100 cm, mais 1 m³ = <strong>1 000 000 cm³</strong>. Et 1 cm³, c\'est 1 mL, pas 1 cL.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6.2, 8, -3.4], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Le volume et ses unités',
    figures: [{
      legende: '1 L = 1 dm³ = un cube de 10 cm de côté = 1 000 cm³ = 1 000 mL.',
      boundingbox: [-0.8, 8.2, 8.2, -0.8],
      largeur: 40, hauteur: 40,
      dessine: function (board) {
        var k = 0.3;
        function P(x, y, z) { return [x * 0.5 + z * k, y * 0.5 + z * k]; }
        function seg(a, b, w, col) { board.create('segment', [a, b], { strokeColor: col || '#334155', strokeWidth: w || 0.5, fixed: true, highlight: false }); }
        for (var i = 0; i <= 10; i++) {
          seg(P(i, 0, 0), P(i, 10, 0)); seg(P(0, i, 0), P(10, i, 0));
          seg(P(i, 10, 0), P(i, 10, 10)); seg(P(0, 10, i), P(10, 10, i));
          seg(P(10, i, 0), P(10, i, 10)); seg(P(10, 0, i), P(10, 10, i));
        }
        board.create('polygon', [P(0, 9, 0), P(1, 9, 0), P(1, 10, 0), P(0, 10, 0)], { borders: { strokeColor: '#c2410c', strokeWidth: 0.8 }, fillColor: '#fdba74', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        board.create('polygon', [P(0, 10, 0), P(1, 10, 0), P(1, 10, 1), P(0, 10, 1)], { borders: { strokeColor: '#c2410c', strokeWidth: 0.8 }, fillColor: '#fed7aa', fillOpacity: 1, vertices: { visible: false }, fixed: true, highlight: false });
        board.create('text', [2.5, -0.45, '10 cm = 1 dm'], { anchorX: 'middle', anchorY: 'middle', fontSize: 6, color: '#334155', fixed: true, highlight: false });
        board.create('text', [6.8, 2.5, '1 cm³ = 1 mL'], { anchorX: 'left', anchorY: 'middle', fontSize: 6, color: '#c2410c', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [-0.5, 7.6, '1 dm³ = 1 L'], { anchorX: 'left', anchorY: 'middle', fontSize: 7, color: '#1d4ed8', cssStyle: 'font-weight:700', fixed: true, highlight: false });
      }
    }, {
      legende: 'Trois colonnes par unité de volume, une par unité de litre.',
      boundingbox: [-0.3, 3.4, 12.3, -1.6],
      largeur: 60, hauteur: 25,
      dessine: function (board) {
        function seg(a, b, w) { board.create('segment', [a, b], { strokeColor: '#334155', strokeWidth: w || 0.6, fixed: true, highlight: false }); }
        for (var i = 0; i <= 12; i++) seg([i, i % 3 === 0 ? 2.8 : 1.9], [i, 0], i % 3 === 0 ? 1.2 : 0.6);
        seg([0, 2.8], [12, 2.8], 1.2); seg([0, 1.9], [12, 1.9]); seg([0, 1.0], [12, 1.0]); seg([0, 0], [12, 0], 1.2);
        ['m³', 'dm³', 'cm³', 'mm³'].forEach(function (u, i) {
          board.create('text', [3 * i + 1.5, 2.35, u], { anchorX: 'middle', anchorY: 'middle', fontSize: 6.5, color: '#334155', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        });
        [[2, 'kL'], [3, 'hL'], [4, 'daL'], [5, 'L'], [6, 'dL'], [7, 'cL'], [8, 'mL']].forEach(function (c) {
          board.create('text', [c[0] + 0.5, 1.45, c[1]], { anchorX: 'middle', anchorY: 'middle', fontSize: 5.5, color: '#0369a1', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        });
        [[5, '1'], [6, '5'], [7, '0'], [8, '0']].forEach(function (c) {
          board.create('text', [c[0] + 0.5, 0.5, c[1]], { anchorX: 'middle', anchorY: 'middle', fontSize: 7.5, color: c[0] >= 7 ? '#c2410c' : '#1d4ed8', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        });
        board.create('text', [6.02, 0.2, ','], { anchorX: 'middle', anchorY: 'middle', fontSize: 9, color: '#c2410c', cssStyle: 'font-weight:700', fixed: true, highlight: false });
        board.create('text', [6, -0.8, '1,5 L = 1 500 mL = 1 500 cm³ (× 1 000 : trois colonnes vers la droite)'], { anchorX: 'middle', anchorY: 'middle', fontSize: 6, color: '#1d4ed8', fixed: true, highlight: false });
      }
    }],
    points: [
      'Le <b>volume</b> d\'un objet, c\'est la <b>place qu\'il occupe</b>. Un liquide se mesure à l\'<b>éprouvette graduée</b> ; un pavé, par longueur × largeur × hauteur.',
      'Unité légale : le <b>mètre cube</b> (m³). Un volume, c\'est trois longueurs : les unités vont de <b>1 000 en 1 000</b>. 1 m³ = 1 000 dm³ ; 1 dm³ = 1 000 cm³.',
      'Pour les liquides, le <b>litre</b> : <b>1 L = 1 dm³</b>, <b>1 mL = 1 cm³</b>, 1 L = 10 dL = 100 cL = 1 000 mL, 1 m³ = 1 000 L.',
      'Dans le tableau, <b>trois colonnes</b> par unité de volume, <b>une</b> par unité de litre ; le litre sous le dm³, le mL sous le cm³.',
      'Convertir : la virgule derrière l\'unité de départ, on la déplace derrière l\'unité d\'arrivée, on complète par des zéros.'
    ],
    exemples: [
      '33 cL = 0,33 L = 330 mL = 330 cm³ ; 2,5 L = 2 500 cm³ ; 0,5 m³ = 500 L.',
      '1 m³ = 1 000 L (pas 100 !) ; 1 m³ = 1 000 000 cm³ ; 1 cm³ = 1 mL (pas 1 cL).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Les unités, les objets                                                */
    /* ==================================================================== */
    // Les douze colonnes : trois par unité de volume. Le chiffre des unités
    // d'un volume en dm³ va dans la colonne 5, celle du litre.
    var NCOL = 12;
    var GROUPES = ['m³', 'dm³', 'cm³', 'mm³'];
    var LITRES = { 2: 'kL', 3: 'hL', 4: 'daL', 5: 'L', 6: 'dL', 7: 'cL', 8: 'mL' };
    var COL = { 'm³': 2, kL: 2, hL: 3, daL: 4, 'dm³': 5, L: 5, dL: 6, cL: 7, 'cm³': 8, mL: 8, 'mm³': 11 };
    function enMm3(u) { return Math.pow(10, NCOL - 1 - COL[u]); }
    var CIBLES = ['m³', 'dm³', 'L', 'cL', 'mL', 'cm³'];
    // v dans l'unité u.
    var OBJETS = [
      { cle: 'goutte', nom: 'une goutte d\'eau', v: 50, u: 'mm³' },
      { cle: 'de', nom: 'un dé à jouer', v: 1, u: 'cm³' },
      { cle: 'cuillere', nom: 'une cuillère à café', v: 5, u: 'mL' },
      { cle: 'canette', nom: 'une canette', v: 33, u: 'cL' },
      { cle: 'lait', nom: 'une brique de lait', v: 1, u: 'L' },
      { cle: 'bouteille', nom: 'une bouteille d\'eau', v: 1.5, u: 'L' },
      { cle: 'boite', nom: 'une boîte à chaussures (30 cm × 20 cm × 10 cm)', v: 6000, u: 'cm³' },
      { cle: 'seau', nom: 'un seau', v: 10, u: 'L' },
      { cle: 'baignoire', nom: 'une baignoire', v: 200, u: 'L' },
      { cle: 'piscine', nom: 'une piscine', v: 50, u: 'm³' }
    ];
    var C_BLEU = '#1d4ed8', C_ORANGE = '#c2410c', C_GRIS = '#64748b', C_LITRE = '#0369a1';

    function fmt(v, dec) {
      var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
      while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
      return e + out + (parts[1] ? ',' + parts[1] : '');
    }
    function mm3(o) { return Math.round(o.v * enMm3(o.u)); }
    function valeur(o, u) { return mm3(o) / enMm3(u); }
    function ecrit(o, u) { return fmt(valeur(o, u), NCOL - 1 - COL[u]) + ' ' + u; }
    function cibleParDefaut(o) { return { 'mm³': 'mL', 'cm³': 'L', mL: 'cm³', cL: 'L', L: 'mL', 'm³': 'L' }[o.u]; }
    function chiffres(o) {
      var s = String(mm3(o)), d = [];
      for (var i = 0; i < NCOL; i++) d[i] = 0;
      for (i = 0; i < s.length && i < NCOL; i++) d[NCOL - 1 - i] = +s[s.length - 1 - i];
      return d;
    }
    function etendue(d, u) {
      var cu = COL[u], g = NCOL - 1, dr = 0;
      for (var i = 0; i < NCOL; i++) if (d[i]) { g = Math.min(g, i); dr = Math.max(dr, i); }
      return { g: Math.min(g, cu), d: Math.max(dr, cu) };
    }

    /* ==================================================================== */
    /* L'état                                                                */
    /* ==================================================================== */
    var mode = 'repos';             // repos | objet | principe
    var objet = OBJETS[3];          // la canette
    var cible = cibleParDefaut(objet);
    var phase = 'repos';            // repos | unite | tableau | glisse
    var frac = 0;
    var niveau = 0;                 // le découpage du cube : 0 entier, 1 tranches, 2 barres, 3 petits cubes
    var chipsObjets = {}, chipsUnites = {};
    // Le principe est une suite de « mesures » du même litre : 1 L, 10 dL, 100 cL, 1 000 mL.
    var PRINCIPE = [
      { u: 'L', niveau: 0, titre: 'Un cube de 1 dm de côté : 1 dm³, c\'est 1 litre', txt: '1 dm = 10 cm. Le cube fait 10 cm × 10 cm × 10 cm. Son volume est <b>1 dm³</b>, et c\'est exactement <b>1 L</b> : la brique de lait.' },
      { u: 'dL', niveau: 1, titre: 'Découpé en 10 tranches : 1 tranche = 1 dL', txt: 'Chaque tranche fait 10 cm × 10 cm × 1 cm = <b>100 cm³</b>. Dix tranches dans le litre : une tranche, c\'est un <b>décilitre</b> (1 dL = 100 mL).' },
      { u: 'cL', niveau: 2, titre: 'Chaque tranche en 10 barres : 1 barre = 1 cL', txt: 'Chaque barre fait 10 cm × 1 cm × 1 cm = <b>10 cm³</b>. Cent barres dans le litre : une barre, c\'est un <b>centilitre</b> (1 cL = 10 mL).' },
      { u: 'mL', niveau: 3, titre: 'Chaque barre en 10 petits cubes : 1 cm³ = 1 mL', txt: 'Chaque petit cube fait 1 cm × 1 cm × 1 cm = <b>1 cm³</b>. Mille petits cubes dans le litre : <b>1 cm³ = 1 mL</b>, et <b>1 L = 1 000 mL = 1 000 cm³</b>. Trois longueurs, trois zéros.' }
    ];
    var LITRE = { v: 1, u: 'L' };
    // La mesure affichée au tableau, son unité de départ et son unité d'arrivée.
    function mesure() { return mode === 'principe' ? LITRE : objet; }
    function uniteDepart() { return mesure().u; }
    function uniteCible() { return mode === 'principe' ? PRINCIPE[niveau].u : cible; }
    function montreTableau() { return mode === 'principe' || phase === 'tableau' || phase === 'glisse'; }
    function enGlisse() { return mode === 'principe' ? niveau > 0 : phase === 'glisse'; }
    function colVirgule() {
      var c0 = COL[uniteDepart()], c1 = COL[uniteCible()];
      if (mode === 'principe') { var cp = niveau > 0 ? COL[PRINCIPE[niveau - 1].u] : c0; return cp + (c1 - cp) * frac; }
      return phase === 'glisse' ? c0 + (c1 - c0) * frac : c0;
    }
    // Ce que le cube met en valeur : 0 le cube entier, 1 une tranche, 2 une barre, 3 un petit cube, −1 rien.
    function niveauCube() {
      if (mode === 'principe') return niveau;
      if (mode !== 'objet' || phase === 'repos') return -1;
      return { L: 0, 'dm³': 0, dL: 1, cL: 2, mL: 3, 'cm³': 3 }[objet.u] === undefined ? -1 : { L: 0, 'dm³': 0, dL: 1, cL: 2, mL: 3, 'cm³': 3 }[objet.u];
    }
    function decoupage() { var n = niveauCube(); return n < 0 ? 0 : n; }

    /* ==================================================================== */
    /* Le cube de 1 dm, en perspective cavalière                             */
    /* ==================================================================== */
    var X0 = -7.4, Y0 = -2.9, E = 0.5, K = 0.177;   // 1 cm = 0,5 unité ; la profondeur fuit à 45°, réduite de moitié
    function P(x, y, z) { return [X0 + x * E + z * K, Y0 + y * E + z * K]; }
    var fixe = { fixed: true, highlight: false };
    function opts(o) { var r = {}; for (var k in fixe) r[k] = fixe[k]; for (k in o) r[k] = o[k]; return r; }
    // les trois faces visibles
    function face(pts, fond) {
      board.create('polygon', pts, opts({ borders: { strokeColor: '#334155', strokeWidth: 1.5 }, fillColor: fond, fillOpacity: 1, vertices: { visible: false }, layer: 1 }));
    }
    face([P(0, 0, 0), P(10, 0, 0), P(10, 10, 0), P(0, 10, 0)], '#dbeafe');
    face([P(0, 10, 0), P(10, 10, 0), P(10, 10, 10), P(0, 10, 10)], '#eff6ff');
    face([P(10, 0, 0), P(10, 0, 10), P(10, 10, 10), P(10, 10, 0)], '#bfdbfe');
    // les traits du découpage, une courbe par face (NaN sépare les traits)
    function grille(lignes) {
      var c = board.create('curve', [[0], [0]], opts({ strokeColor: '#1e3a8a', strokeWidth: 0.8, layer: 3 }));
      c.updateDataArray = function () {
        var X = [], Y = [], n = decoupage();
        lignes(n).forEach(function (s) { X.push(s[0][0], s[1][0], NaN); Y.push(s[0][1], s[1][1], NaN); });
        this.dataX = X.length ? X : [NaN]; this.dataY = Y.length ? Y : [NaN];
      };
      return c;
    }
    var grilleFace = grille(function (n) {
      var out = [];
      for (var i = 1; i < 10; i++) {
        if (n >= 1) out.push([P(i, 0, 0), P(i, 10, 0)]);     // les tranches : coupes verticales
        if (n >= 2) out.push([P(0, i, 0), P(10, i, 0)]);     // les barres : coupes horizontales
      }
      return out;
    });
    var grilleDessus = grille(function (n) {
      var out = [];
      for (var i = 1; i < 10; i++) {
        if (n >= 1) out.push([P(i, 10, 0), P(i, 10, 10)]);
        if (n >= 3) out.push([P(0, 10, i), P(10, 10, i)]);   // les petits cubes : coupes en profondeur
      }
      return out;
    });
    var grilleCote = grille(function (n) {
      var out = [];
      for (var i = 1; i < 10; i++) {
        if (n >= 2) out.push([P(10, i, 0), P(10, i, 10)]);
        if (n >= 3) out.push([P(10, 0, i), P(10, 10, i)]);
      }
      return out;
    });
    // l'élément mis en valeur : sa face avant et son dessus
    function enValeur() {
      var n = niveauCube();
      if (n === 0) return { x: 10, y: 10, z: 10 };          // le cube entier
      if (n === 1) return { x: 1, y: 10, z: 10 };           // une tranche, à gauche
      if (n === 2) return { x: 1, y: 1, z: 10 };            // une barre, en haut à gauche
      if (n === 3) return { x: 1, y: 1, z: 1 };             // un petit cube, en haut à gauche devant
      return null;
    }
    var devant = board.create('curve', [[0], [0]], opts({ strokeColor: C_ORANGE, strokeWidth: 1.5, fillColor: '#fdba74', fillOpacity: 1, layer: 2 }));
    devant.updateDataArray = function () {
      var e = enValeur();
      if (!e) { this.dataX = [NaN]; this.dataY = [NaN]; return; }
      var a = P(0, 10 - e.y, 0), b = P(e.x, 10 - e.y, 0), c = P(e.x, 10, 0), d = P(0, 10, 0);
      this.dataX = [a[0], b[0], c[0], d[0], a[0]]; this.dataY = [a[1], b[1], c[1], d[1], a[1]];
    };
    var dessus = board.create('curve', [[0], [0]], opts({ strokeColor: C_ORANGE, strokeWidth: 1.5, fillColor: '#fed7aa', fillOpacity: 1, layer: 2 }));
    dessus.updateDataArray = function () {
      var e = enValeur();
      if (!e) { this.dataX = [NaN]; this.dataY = [NaN]; return; }
      var a = P(0, 10, 0), b = P(e.x, 10, 0), c = P(e.x, 10, e.z), d = P(0, 10, e.z);
      this.dataX = [a[0], b[0], c[0], d[0], a[0]]; this.dataY = [a[1], b[1], c[1], d[1], a[1]];
    };
    var cote = board.create('curve', [[0], [0]], opts({ strokeColor: C_ORANGE, strokeWidth: 1.5, fillColor: '#fb923c', fillOpacity: 1, layer: 2 }));
    cote.updateDataArray = function () {
      var e = enValeur();
      if (!e || e.x < 10) { this.dataX = [NaN]; this.dataY = [NaN]; return; }   // le côté droit n'est visible que pour le cube entier
      var a = P(10, 0, 0), b = P(10, 0, 10), c = P(10, 10, 10), d = P(10, 10, 0);
      this.dataX = [a[0], b[0], c[0], d[0], a[0]]; this.dataY = [a[1], b[1], c[1], d[1], a[1]];
    };
    // les cotes et les légendes
    board.create('segment', [P(0, -0.8, 0), P(10, -0.8, 0)], opts({ strokeColor: C_GRIS, strokeWidth: 1, firstArrow: { type: 2, size: 4 }, lastArrow: { type: 2, size: 4 } }));
    board.create('text', [P(5, -1.35, 0)[0], P(5, -1.35, 0)[1], '10 cm = 1 dm'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    board.create('text', [P(-0.6, 5, 0)[0], P(-0.6, 5, 0)[1], '1 dm'], opts({ anchorX: 'right', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    var LEGENDES = ['Le cube entier : 1 dm³ = 1 L', '1 tranche : 10 × 10 × 1 = 100 cm³ = 1 dL', '1 barre : 10 × 1 × 1 = 10 cm³ = 1 cL', '1 petit cube : 1 cm³ = 1 mL'];
    var COMPTES = ['', '10 tranches dans le litre', '100 barres dans le litre', '1 000 petits cubes dans le litre'];
    var legende = board.create('text', [P(0, 10, 10)[0] - 0.2, P(0, 10, 10)[1] + 0.95, function () { var n = niveauCube(); return n < 0 ? 'Un cube de 1 dm de côté : 1 L' : LEGENDES[n]; }],
      opts({ anchorX: 'left', anchorY: 'middle', fontSize: 12, strokeColor: C_ORANGE, cssStyle: 'font-weight:700' }));
    var compte = board.create('text', [P(0, 10, 10)[0] - 0.2, P(0, 10, 10)[1] + 0.45, function () { var n = niveauCube(); return n < 0 ? '' : COMPTES[n]; }],
      opts({ anchorX: 'left', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));

    /* ==================================================================== */
    /* Le tableau de conversion                                              */
    /* ==================================================================== */
    var TABLE = { x0: 0.3, w: 0.62, yHaut: 5.75, yGroupe: 5.15, yLitre: 4.6, yBas: 3.8 };
    function xCol(i) { return TABLE.x0 + i * TABLE.w; }
    for (var i = 0; i <= NCOL; i++) {
      var gros = i % 3 === 0;
      board.create('segment', [[xCol(i), gros ? TABLE.yHaut : TABLE.yGroupe], [xCol(i), TABLE.yBas]], opts({ strokeColor: '#334155', strokeWidth: gros ? 1.5 : 0.7 }));
    }
    [[TABLE.yHaut, 1.5], [TABLE.yGroupe, 0.7], [TABLE.yLitre, 0.7], [TABLE.yBas, 1.5]].forEach(function (r) {
      board.create('segment', [[xCol(0), r[0]], [xCol(NCOL), r[0]]], opts({ strokeColor: '#334155', strokeWidth: r[1] }));
    });
    GROUPES.forEach(function (u, g) {
      board.create('text', [xCol(3 * g + 1.5), (TABLE.yHaut + TABLE.yGroupe) / 2, u], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: '#334155', cssStyle: 'font-weight:700' }));
    });
    Object.keys(LITRES).forEach(function (c) {
      board.create('text', [xCol(+c + 0.5), (TABLE.yGroupe + TABLE.yLitre) / 2, LITRES[c]], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10, strokeColor: C_LITRE, cssStyle: 'font-weight:700' }));
    });
    board.create('text', [xCol(NCOL / 2), TABLE.yHaut + 0.35, 'Tableau de conversion des volumes'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    var cellules = [];
    function etatCellule(i) {
      if (!montreTableau()) return null;
      var m = mesure(), d = chiffres(m), e0 = etendue(d, m.u);
      if (i >= e0.g && i <= e0.d) return { txt: String(d[i]), ajoute: false };
      if (enGlisse() && frac >= 1) {
        var e1 = etendue(d, uniteCible());
        if (i >= e1.g && i <= e1.d) return { txt: '0', ajoute: true };
      }
      return null;
    }
    for (i = 0; i < NCOL; i++) {
      (function (i) {
        cellules.push(board.create('text', [xCol(i) + TABLE.w / 2, (TABLE.yLitre + TABLE.yBas) / 2, function () { var c = etatCellule(i); return c ? c.txt : ''; }],
          opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 15, strokeColor: C_BLEU, cssStyle: 'font-weight:700' })));
      })(i);
    }
    var virgule = board.create('text', [function () { return xCol(colVirgule() + 1) + 0.02; }, TABLE.yBas + 0.2, ','],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 20, strokeColor: C_ORANGE, cssStyle: 'font-weight:700', visible: false, layer: 9 }));
    function sauts() { return COL[uniteCible()] - COL[uniteDepart()]; }
    function facteur() { var n = sauts(); return n ? (n < 0 ? '÷ ' : '× ') + fmt(Math.pow(10, Math.abs(n))) : ''; }
    var saut = board.create('arrow', [[function () { return xCol(COL[uniteDepart()] + 1); }, TABLE.yBas - 0.35], [function () { return xCol(colVirgule() + 1); }, TABLE.yBas - 0.35]],
      opts({ strokeColor: C_ORANGE, strokeWidth: 2.5, lastArrow: { type: 2, size: 6 }, visible: false }));
    var facteurTxt = board.create('text', [function () { return (xCol(COL[uniteDepart()] + 1) + xCol(COL[uniteCible()] + 1)) / 2; }, TABLE.yBas - 0.75, facteur],
      opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 12, strokeColor: C_ORANGE, cssStyle: 'font-weight:700', visible: false }));
    var egalite = board.create('text', [xCol(NCOL / 2), TABLE.yBas - 1.5, function () {
      if (!montreTableau()) return '';
      var m = mesure(), s = ecrit(m, m.u);
      if (enGlisse() && frac >= 1 && uniteCible() !== m.u) s += ' = ' + ecrit(m, uniteCible());
      return s;
    }], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: C_BLEU, cssStyle: 'font-weight:700' }));
    board.create('text', [xCol(NCOL / 2), TABLE.yBas - 2.4, '1 m³ = 1 000 dm³ = 1 000 L · 1 dm³ = 1 000 cm³ = 1 L · 1 cm³ = 1 mL'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 11, strokeColor: C_GRIS }));
    board.create('text', [xCol(NCOL / 2), TABLE.yBas - 2.95, 'trois colonnes par unité de volume : × 1 000 ou ÷ 1 000 · une colonne par unité de litre : × 10 ou ÷ 10'], opts({ anchorX: 'middle', anchorY: 'middle', fontSize: 10.5, strokeColor: C_GRIS }));

    /* ==================================================================== */
    /* Du state au dessin                                                    */
    /* ==================================================================== */
    function refresh() {
      for (var i = 0; i < NCOL; i++) {
        var c = etatCellule(i);
        cellules[i].setAttribute({ strokeColor: c && c.ajoute ? C_ORANGE : C_BLEU });
      }
      virgule.setAttribute({ visible: montreTableau() });
      var g = enGlisse() && sauts() !== 0;
      saut.setAttribute({ visible: g && frac > 0 });
      facteurTxt.setAttribute({ visible: g && frac >= 1 });
      ecrirePanneau();
    }
    function redraw() { refresh(); board.update(); }

    /* ==================================================================== */
    /* Le panneau                                                            */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel melange-panel';
    var UNITE_MOT = { 'mm³': 'un millimètre cube, le millième d\'un petit cube de 1 cm', 'cm³': 'un petit cube de 1 cm de côté : 1 mL', mL: 'un petit cube de 1 cm de côté : 1 cm³',
                      cL: 'une barre du cube : 10 cm³', dL: 'une tranche du cube : 100 cm³', L: 'le cube entier : 1 dm³', 'dm³': 'le cube entier : 1 L', 'm³': 'un cube de 1 m de côté : 1 000 cubes de 1 dm, soit 1 000 L' };
    function ecrirePanneau() {
      var html = '';
      function b(t) { return '<b>' + t + '</b>'; }
      if (mode === 'repos') {
        html += '<div class="props-label">Le volume : combien de place ?</div>';
        html += '<p>Le volume d\'un objet, c\'est la place qu\'il occupe. Lance <b>« Le cube de 1 dm »</b> pour voir d\'où viennent les unités, ou choisis un objet et l\'unité dans laquelle tu veux lire son volume.</p>';
      } else if (mode === 'principe') {
        var pr = PRINCIPE[niveau];
        html += '<div class="props-label">' + pr.titre + '</div><p>' + pr.txt + '</p>';
        if (niveau > 0 && frac >= 1) html += '<p>Au tableau : ' + b('1 L = ' + ecrit(LITRE, pr.u)) + ' — ' + niveau + ' colonne' + (niveau > 1 ? 's' : '') + ' vers la droite, c\'est ' + b(facteur()) + '.</p>';
      } else {
        var o = objet, d = chiffres(o), e0 = etendue(d, o.u), cu0 = COL[o.u];
        if (phase === 'unite') {
          html += '<div class="props-label">' + o.nom + ' : ' + ecrit(o, o.u) + '</div>';
          html += '<p>' + ecrit(o, o.u) + ', c\'est ' + b(fmt(o.v) + ' fois 1 ' + o.u) + ', et 1 ' + o.u + ', c\'est ' + UNITE_MOT[o.u] + '.</p>';
        } else {
          html += '<div class="props-label">' + (phase === 'tableau' ? 'On écrit ' + ecrit(o, o.u) + ' dans le tableau' : 'On lit en ' + cible) + '</div>';
          html += '<p>Un chiffre par colonne : le chiffre des <b>unités</b> (' + d[cu0] + ') dans la colonne ' + b(o.u) +
                  (LITRES[cu0] && LITRES[cu0] !== o.u ? ' (celle du ' + LITRES[cu0] + ')' : GROUPES.indexOf(o.u) < 0 && o.u !== 'L' ? ' (la colonne de droite du ' + GROUPES[Math.floor(cu0 / 3)] + ')' : '') +
                  (e0.g < cu0 ? ', les autres à sa gauche' : '') + (e0.d > cu0 ? ', les décimales à sa droite' : '') + '. La <b>virgule</b> est derrière la colonne ' + o.u + '.</p>';
          if (phase === 'glisse') {
            var n = sauts();
            if (!n) html += '<p>' + (cible === o.u ? 'C\'est déjà l\'unité demandée' : 'Même colonne : ' + o.u + ' et ' + cible + ', c\'est la même chose') + ' : ' + b(ecrit(o, cible)) + '.</p>';
            else html += '<p>Pour lire en ' + b(cible) + ', on déplace la virgule derrière la colonne ' + cible + ' : ' + b(Math.abs(n) + ' colonne' + (Math.abs(n) > 1 ? 's' : '') + ' vers la ' + (n < 0 ? 'gauche' : 'droite')) +
                         ', c\'est ' + b(facteur()) + '. ' + (n < 0 ? 'L\'unité est plus grande, le nombre devient plus petit.' : 'L\'unité est plus petite, il en faut davantage.') +
                         (frac >= 1 ? ' On complète par des <b style="color:' + C_ORANGE + '">zéros</b> : ' + b(ecrit(o, o.u) + ' = ' + ecrit(o, cible)) + '.' : '') + '</p>';
          }
        }
      }
      html += '<p class="etats-molecules">1 L = 1 dm³ · 1 mL = 1 cm³ · 1 m³ = 1 000 L</p>';
      panel.innerHTML = html;
    }

    /* ==================================================================== */
    /* Les animations                                                        */
    /* ==================================================================== */
    var anim = null;
    function pose(md, ph, p, nv) { mode = md; phase = ph; frac = p; niveau = nv || 0; }
    function raz() { pose('repos', 'repos', 0, 0); redraw(); }
    function pastilles() {
      OBJETS.forEach(function (x) { chipsObjets[x.cle].className = 'ineq-preset' + (mode === 'objet' && x === objet ? ' active' : ''); });
      CIBLES.forEach(function (u) { chipsUnites[u].className = 'ineq-preset' + (mode === 'objet' && u === cible ? ' active' : ''); });
    }
    function lancerObjet() {
      anim.cancel();
      mode = 'objet'; pastilles();
      var steps = [
        { dur: 800, step: function (p) { pose('objet', 'unite', p); refresh(); }, after: function () { pose('objet', 'unite', 1); refresh(); } },
        { dur: 800, step: function (p) { pose('objet', 'tableau', p); refresh(); }, after: function () { pose('objet', 'tableau', 1); refresh(); } },
        { dur: 1300, step: function (p) { pose('objet', 'glisse', p); refresh(); }, after: function () { pose('objet', 'glisse', 1); refresh(); } }
      ];
      raz();
      anim.runSteps(steps, raz);
    }
    function lancerPrincipe() {
      anim.cancel();
      mode = 'principe'; pastilles();
      var steps = PRINCIPE.map(function (pr, k) {
        return { dur: k ? 1300 : 800, step: function (p) { pose('principe', 'glisse', p, k); refresh(); }, after: function () { pose('principe', 'glisse', 1, k); refresh(); } };
      });
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
      bt.onclick = function () { objet = o; cible = cibleParDefaut(o); lancerObjet(); };
      choix.appendChild(bt); chipsObjets[o.cle] = bt;
    });
    mv.extras.appendChild(choix);
    var choixU = document.createElement('div');
    choixU.className = 'ineq-presets melange-choix';
    var lab = document.createElement('span'); lab.textContent = 'Lire en : '; lab.className = 'props-label';
    choixU.appendChild(lab);
    var NOMS_U = { 'm³': 'mètres cubes (m³)', 'dm³': 'décimètres cubes (dm³)', L: 'litres (L)', cL: 'centilitres (cL)', mL: 'millilitres (mL)', 'cm³': 'centimètres cubes (cm³)' };
    CIBLES.forEach(function (u) {
      var bt = document.createElement('button');
      bt.type = 'button'; bt.className = 'ineq-preset';
      bt.textContent = NOMS_U[u];
      bt.onclick = function () { cible = u; lancerObjet(); };
      choixU.appendChild(bt); chipsUnites[u] = bt;
    });
    mv.extras.appendChild(choixU);

    mv.addControls([
      { type: 'button', id: 'principe', label: '🧊 Le cube de 1 dm', onClick: lancerPrincipe },
      { type: 'button', id: 'convertir', label: '📏 Convertir', onClick: lancerObjet },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: function () { anim.cancel(); mode = 'repos'; pastilles(); raz(); } }
    ]);
    anim = mv.createAnimator();
    mv.extras.appendChild(panel);

    lancerPrincipe();   // charge les étapes : en pas à pas, la figure attend le premier « Suivante »
  }
});
