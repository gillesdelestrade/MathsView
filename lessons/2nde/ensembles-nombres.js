/*
 * Les ensembles de nombres ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ (2nde).
 *
 * Deux représentations du MÊME objet, l'une au-dessus de l'autre :
 *
 *  1) Le diagramme d'ensembles : cinq ellipses emboîtées. Chacune contient la
 *     précédente — c'est ça, l'inclusion. On clique dans une couronne pour
 *     choisir l'ensemble ; les nombres écrits à l'intérieur (0, −3, 0,75, 1/3,
 *     √2…) passent en ROUGE dès qu'ils appartiennent à l'ensemble choisi.
 *
 *  2) La droite graduée : les mêmes nombres, mais vus comme des POINTS. Les
 *     points rouges sont ceux de l'ensemble sélectionné, les petits cercles
 *     blancs sont les « trous » — les nombres qui n'y sont pas.
 *
 * Le fil rouge est la densité, qui se voit d'un coup d'œil :
 *     ℕ  → quelques points isolés, à partir de 0 ;
 *     ℤ  → les mêmes, prolongés à gauche ;
 *     𝔻  → des points dispersés partout, mais avec des trous ;
 *     ℚ  → presque tous les points… sauf √2, π et les autres irrationnels ;
 *     ℝ  → toute la droite, sans aucun trou.
 *
 * Les nuages de points de 𝔻 et de ℚ ne sont pas décoratifs : ceux de 𝔻 sont
 * tirés au hasard parmi les nombres à deux décimales, ceux de ℚ parmi les
 * fractions p/q à dénominateur non décimal (3, 6, 7, 9…).
 */
MathsView.register({
  id: 'ensembles-nombres',
  title: 'Les ensembles de nombres',
  level: '2nde',
  category: 'calcul',
  subcategory: 'Ensembles de nombres',
  theme: 'Nombres — ℕ, ℤ, 𝔻, ℚ, ℝ : emboîtement et droite graduée',
  description:
    'Les nombres sont rangés dans des ensembles <strong>emboîtés</strong> : ' +
    '\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{D}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\). ' +
    'Chaque ensemble contient tout le précédent, et ajoute de nouveaux nombres : ' +
    'les <em>négatifs</em>, puis la <em>virgule</em>, puis les <em>fractions</em>, ' +
    'puis les <em>irrationnels</em>.' +
    '<br><strong>Clique dans une ellipse</strong> (ou sur un bouton) pour choisir un ' +
    'ensemble : les nombres qui lui appartiennent passent en <strong ' +
    'style="color:#dc2626">rouge</strong>, dans le diagramme comme sur la droite graduée. ' +
    'Les petits cercles blancs sont les <strong>trous</strong> : les nombres qui n\'y sont pas.' +
    '<br>Regarde surtout la droite graduée se remplir : quelques points isolés pour ' +
    '\\(\\mathbb{N}\\), presque toute la droite pour \\(\\mathbb{Q}\\), et enfin ' +
    '<em>toute</em> la droite pour \\(\\mathbb{R}\\).' +
    '<br><em>Le bouton <strong>▶ Animer</strong> parcourt les cinq ensembles pas à pas ' +
    '(bouton <em>Suivante</em> ou barre espace).</em>',
  notes:
    '<ul>' +
    '<li><strong>Les notations.</strong> \\(x\\in E\\) se lit « \\(x\\) appartient à \\(E\\) », ' +
    '\\(x\\notin E\\) « n\'appartient pas à ». \\(E\\subset F\\) se lit « \\(E\\) est inclus ' +
    'dans \\(F\\) » : tous les éléments de \\(E\\) sont aussi dans \\(F\\).</li>' +
    '<li><strong>\\(\\mathbb{N}\\), les entiers naturels.</strong> \\(0,1,2,3,\\dots\\) — ceux avec ' +
    'lesquels on compte. Ni signe moins, ni virgule.</li>' +
    '<li><strong>\\(\\mathbb{Z}\\), les entiers relatifs.</strong> On ajoute les opposés : ' +
    '\\(\\dots,-3,-2,-1,0,1,2,3,\\dots\\)</li>' +
    '<li><strong>\\(\\mathbb{D}\\), les décimaux.</strong> Les nombres qui s\'écrivent avec un ' +
    '<strong>nombre fini</strong> de chiffres après la virgule, autrement dit de la forme ' +
    '\\(\\dfrac{a}{10^{n}}\\) avec \\(a\\in\\mathbb{Z}\\). Par exemple ' +
    '\\(3{,}25=\\dfrac{325}{100}\\).</li>' +
    '<li><strong>\\(\\mathbb{Q}\\), les rationnels.</strong> Les quotients \\(\\dfrac{a}{b}\\) avec ' +
    '\\(a\\in\\mathbb{Z}\\), \\(b\\in\\mathbb{Z}^*\\). Leur écriture décimale est ' +
    '<strong>finie ou périodique</strong> : \\(\\frac13=0{,}333\\dots\\), ' +
    '\\(\\frac{11}{6}=1{,}8333\\dots\\)</li>' +
    '<li><strong>\\(\\mathbb{R}\\), les réels.</strong> Tous les nombres de la droite graduée : ' +
    'à chaque point correspond exactement un réel, et réciproquement. Les réels non ' +
    'rationnels s\'appellent les <strong>irrationnels</strong> : \\(\\sqrt2\\), \\(\\pi\\), ' +
    '\\(\\sqrt3\\)…</li>' +
    '<li><strong>Quand une fraction est-elle décimale ?</strong> Une fois la fraction rendue ' +
    'irréductible, elle est décimale si et seulement si son dénominateur ne contient que ' +
    'des \\(2\\) et des \\(5\\) : \\(\\frac{7}{8}=0{,}875\\) oui, \\(\\frac13\\) non ' +
    '(le \\(3\\) est de trop).</li>' +
    '<li><strong>Les inclusions sont strictes.</strong> Chaque ensemble apporte des nombres ' +
    'vraiment nouveaux : \\(-3\\in\\mathbb{Z}\\) mais \\(-3\\notin\\mathbb{N}\\) ; ' +
    '\\(0{,}5\\in\\mathbb{D}\\) mais \\(0{,}5\\notin\\mathbb{Z}\\) ; ' +
    '\\(\\frac13\\in\\mathbb{Q}\\) mais \\(\\frac13\\notin\\mathbb{D}\\) ; ' +
    '\\(\\sqrt2\\in\\mathbb{R}\\) mais \\(\\sqrt2\\notin\\mathbb{Q}\\).</li>' +
    '<li><strong>Piège classique.</strong> C\'est le <em>nombre</em> qui appartient à un ' +
    'ensemble, pas la façon de l\'écrire : \\(\\frac{4}{2}\\) a beau ressembler à une ' +
    'fraction, c\'est \\(2\\), donc \\(\\frac42\\in\\mathbb{N}\\). De même ' +
    '\\(\\sqrt{4}=2\\in\\mathbb{N}\\), alors que \\(\\sqrt2\\notin\\mathbb{Q}\\).</li>' +
    '<li><strong>Un ensemble particulier.</strong> \\(\\sqrt2\\) est irrationnel : aucune ' +
    'fraction d\'entiers ne vaut exactement \\(\\sqrt2\\) (cela se démontre par l\'absurde). ' +
    'C\'est ce genre de nombres qui bouche les derniers trous de la droite.</li>' +
    '</ul>',
  board: {
    boundingbox: [-10, 7.5, 10, -7.5], keepaspectratio: true,
    axis: false, grid: false, showNavigation: false,
    pan: { enabled: false }, zoom: { enabled: false, wheel: false, pinch: false }
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var C_IN  = '#dc2626';   // rouge : le nombre appartient à l'ensemble choisi
    var C_OUT = '#94a3b8';   // gris : il n'y appartient pas (un « trou »)
    var INK   = '#334155';
    var SOFT  = '#64748b';

    // Une police qui possède les lettres ajourées ℕ ℤ 𝔻 ℚ ℝ.
    var MATHFONT = "'STIX Two Math','Cambria Math','Latin Modern Math'," +
                   "'DejaVu Serif','Times New Roman',serif";

    /* ==================================================================== */
    /* Les cinq ensembles, du plus petit au plus grand                       */
    /*                                                                       */
    /* `a` et `b` sont les demi-axes de l'ellipse, `ex` les nombres écrits    */
    /* dans la couronne (à gauche et à droite, deux lignes possibles).        */
    /* Un nombre de « niveau » k appartient à l'ensemble i si k ≤ i : c'est   */
    /* toute la logique de la figure, emboîtement compris.                    */
    /* ==================================================================== */
    var CX = 0, CY = 2.5;          // centre commun des ellipses
    var SETS = [
      { key: 'N', sym: 'ℕ', nom: 'entiers naturels',  color: '#0d9488',
        a: 2.2, b: 1.15, exL: '0<br>1',        exR: '2<br>7' },
      { key: 'Z', sym: 'ℤ', nom: 'entiers relatifs',  color: '#2563eb',
        a: 3.7, b: 2.00, exL: '−1<br>−8',      exR: '−3<br>−25' },
      { key: 'D', sym: '𝔻', nom: 'décimaux',          color: '#7c3aed',
        a: 5.2, b: 2.85, exL: '0,5<br>1,25',   exR: '−2,75<br>3,4' },
      { key: 'Q', sym: 'ℚ', nom: 'rationnels',        color: '#c026d3',
        a: 6.7, b: 3.70, exL: '1/3<br>2/9',    exR: '−5/7<br>11/6' },
      { key: 'R', sym: 'ℝ', nom: 'réels',             color: '#ea580c',
        a: 8.2, b: 4.55, exL: '√2<br>−√3',     exR: 'π<br>√5' }
    ];
    var sel = 0;                   // ensemble sélectionné (indice dans SETS)
    var hover = -1;                // ensemble survolé à la souris
    var reveal = { v: 1 };         // apparition de la sélection (0 → 1)

    function symCol(i) {
      return '<span style="font-family:' + MATHFONT + ';color:' + SETS[i].color +
        ';font-weight:700">' + SETS[i].sym + '</span>';
    }
    // Un nombre de niveau k est-il dans l'ensemble sélectionné ?
    function inSel(k) { return k <= sel; }

    // Ne pose l'attribut que s'il change vraiment : la figure est rafraîchie
    // à chaque frame d'animation.
    function attr(o, key, val) {
      if (!o._mv) o._mv = {};
      if (o._mv[key] !== val) {
        o._mv[key] = val;
        var a = {}; a[key] = val;
        o.setAttribute(a);
      }
    }
    function paint(o, k) {          // colorie un TEXTE selon l'appartenance
      attr(o, 'color', inSel(k) ? C_IN : C_OUT);
    }

    /* ==================================================================== */
    /* 1. Le diagramme : cinq ellipses emboîtées                             */
    /* ==================================================================== */
    // Dessinées de la plus grande à la plus petite : les traits des petites
    // restent au-dessus des remplissages des grandes.
    var ELL = [];
    for (var i = SETS.length - 1; i >= 0; i--) {
      (function (i) {
        var s = SETS[i];
        ELL[i] = board.create('curve', [
          function (t) { return CX + s.a * Math.cos(t); },
          function (t) { return CY + s.b * Math.sin(t); },
          0, 2 * Math.PI
        ], { strokeColor: s.color, strokeWidth: 2, fillColor: s.color, fillOpacity: 0,
             highlight: false, fixed: true, layer: 4 + (SETS.length - i) });
      })(i);
    }

    // Le symbole de l'ensemble, posé en haut de SA couronne.
    // Le sommet de la couronne i est compris entre b(i−1) et b(i).
    SETS.forEach(function (s, i) {
      var bIn = i === 0 ? 0 : SETS[i - 1].b;
      board.create('text', [CX, CY + (bIn + s.b) / 2, function () {
        return '<span style="font-family:' + MATHFONT + '">' + s.sym + '</span>';
      }], { anchorX: 'middle', anchorY: 'middle', fontSize: 18, color: s.color,
            cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9 });
    });

    // Les exemples de nombres, à gauche et à droite de chaque couronne (là où
    // elle est la plus large). Ils rougissent quand ils appartiennent à
    // l'ensemble sélectionné.
    var EX = [];
    SETS.forEach(function (s, i) {
      var aIn = i === 0 ? 0 : SETS[i - 1].a;
      var x = (aIn + s.a) / 2;
      [[-x, s.exL], [x, s.exR]].forEach(function (p) {
        var t = board.create('text', [p[0], CY, function () { return p[1]; }], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: C_OUT,
          cssStyle: 'font-weight:700;line-height:1.25;text-align:center',
          fixed: true, highlight: false, layer: 9
        });
        EX.push({ t: t, k: i });
      });
    });

    /* ==================================================================== */
    /* 2. La droite graduée                                                  */
    /*                                                                       */
    /* Un nombre v est placé en x = 2v : la droite va de −4,5 à 4,5.          */
    /* ==================================================================== */
    var YL = -4.9;                 // hauteur de la droite
    function px(v) { return 2 * v; }

    board.create('segment', [[-9.3, YL], [9.3, YL]], {
      strokeColor: INK, strokeWidth: 2, lastArrow: { type: 2, size: 6 },
      fixed: true, highlight: false, layer: 5
    });
    // Les graduations entières, et leur étiquette sous la droite.
    for (var v = -4; v <= 4; v++) {
      (function (v) {
        board.create('segment', [[px(v), YL - 0.18], [px(v), YL + 0.18]], {
          strokeColor: INK, strokeWidth: v === 0 ? 2.5 : 1.5,
          fixed: true, highlight: false, layer: 5
        });
        board.create('text', [px(v), YL - 0.62, function () { return String(v).replace('-', '−'); }], {
          anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT,
          fixed: true, highlight: false, layer: 5
        });
      })(v);
    }

    /* Les nombres remarquables posés sur la droite ------------------------ */
    /* niveau 0 : entiers naturels — 1 : entiers négatifs — 2 : décimaux non  */
    /* entiers — 3 : rationnels non décimaux — 4 : irrationnels.             */
    var LINE = [
      { v: 0, k: 0 }, { v: 1, k: 0 }, { v: 2, k: 0 }, { v: 3, k: 0 }, { v: 4, k: 0 },
      { v: -1, k: 1 }, { v: -2, k: 1 }, { v: -3, k: 1 }, { v: -4, k: 1 },

      { v: -3.75, k: 2, t: '−3,75' }, { v: -2.25, k: 2, t: '−2,25' },
      { v: -0.5,  k: 2, t: '−0,5'  }, { v: 0.75,  k: 2, t: '0,75'  },
      { v: 2.5,   k: 2, t: '2,5'   }, { v: 3.75,  k: 2, t: '3,75'  },

      { v: -8 / 3, k: 3, t: '−8/3' }, { v: -4 / 3, k: 3, t: '−4/3' },
      { v: 1 / 3,  k: 3, t: '1/3'  }, { v: 11 / 6, k: 3, t: '11/6' },

      { v: -Math.PI, k: 4, t: '−π' }, { v: -Math.sqrt(3), k: 4, t: '−√3' },
      { v: Math.sqrt(2), k: 4, t: '√2' }, { v: Math.PI, k: 4, t: 'π' }
    ];

    // Les étiquettes des nombres non entiers vont AU-DESSUS de la droite, sur
    // deux rangées en quinconce : elles ne se marchent pas dessus.
    var above = LINE.filter(function (d) { return d.t; })
                    .sort(function (p, q) { return p.v - q.v; });
    above.forEach(function (d, n) { d.row = n % 2; });

    var DOTS = [];
    LINE.forEach(function (d) {
      // Au-dessus de la droite pleine de ℝ : jusqu'à ℚ, les cercles blancs
      // des irrationnels doivent rester visibles comme des trous.
      var p = board.create('point', [px(d.v), YL], {
        size: 3.5, face: 'o', fillColor: C_OUT, strokeColor: C_OUT, strokeWidth: 1.5,
        fixed: true, highlight: false, withLabel: false, showInfobox: false, layer: 9
      });
      var lab = null;
      if (d.t) {
        lab = board.create('text', [px(d.v), YL + (d.row ? 0.98 : 0.45),
          function () { return d.t; }
        ], { anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: C_OUT,
             cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 8 });
      }
      DOTS.push({ p: p, lab: lab, k: d.k });
    });

    /* Les nuages : « dispersés partout » pour 𝔻, « presque tous » pour ℚ --- */
    // Un paquet de traits verticaux minuscules dessinés d'un seul tenant :
    // les NaN coupent le trait entre deux points.
    function cloud(values, h, w) {
      var xs = [], ys = [];
      values.forEach(function (v) {
        xs.push(px(v), px(v), NaN);
        ys.push(YL - h, YL + h, NaN);
      });
      return board.create('curve', [xs, ys], {
        strokeColor: C_IN, strokeWidth: w, highlight: false, fixed: true,
        visible: false, layer: 7
      });
    }
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

    // 𝔻 : des nombres à deux décimales, tirés au hasard.
    var decs = [];
    for (var n = 0; n < 34; n++) decs.push(rnd(-440, 440) / 100);
    var cloudD = cloud(decs, 0.15, 3);

    // ℚ : des fractions p/q dont le dénominateur n'est ni 2 ni 5 — elles ne
    // sont donc PAS décimales. Il en faut beaucoup : « presque tous ».
    var QD = [3, 6, 7, 9, 11, 12, 13, 14, 18, 21];
    var fracs = [];
    for (var m = 0; m < 300; m++) {
      var q = QD[rnd(0, QD.length - 1)];
      var lim = Math.floor(4.4 * q);
      fracs.push(rnd(-lim, lim) / q);        // p/q, avec q ∈ {3, 6, 7, 9, …}
    }
    var cloudQ = cloud(fracs, 0.15, 3);

    // ℝ : plus un seul trou. La droite est reprise EN ENTIER, flèches
    // comprises, en trait épais et au-dessus de tout le reste : ni les
    // graduations ni les nuages ne doivent la trouer.
    var fullR = board.create('segment', [[-9.3, YL], [9.3, YL]], {
      strokeColor: C_IN, strokeWidth: 8,
      firstArrow: { type: 2, size: 6 }, lastArrow: { type: 2, size: 6 },
      fixed: true, highlight: false, visible: false, layer: 8
    });

    /* Légendes autour de la droite ---------------------------------------- */
    // Ce que la droite montre pour l'ensemble choisi, au-dessus…
    var CAPTION = [
      'Sur la droite : des points <strong>isolés</strong>, à partir de 0.',
      'On prolonge <strong>à gauche de 0</strong> : les mêmes points, en négatif.',
      'Beaucoup plus de points, <strong>dispersés partout</strong>…',
      '<strong>Presque tous</strong> les points de la droite…',
      '<strong>Toute</strong> la droite : plus un seul trou.'
    ];
    // … et ce qui manque encore, en dessous.
    var HINT = [
      'Entre 3 et 4, aucun entier naturel : il reste d\'immenses trous.',
      'Toujours des trous : 0,5 n\'est pas un entier.',
      'Il reste des trous : 1/3 = 0,333… ne s\'arrête jamais.',
      '… mais √2 et π manquent toujours à l\'appel : ce sont des irrationnels.',
      'À chaque point de la droite correspond un réel, et un seul.'
    ];

    board.create('text', [0, -3.45, function () { return CAPTION[sel]; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 13, color: INK,
      cssStyle: 'font-weight:700', fixed: true, highlight: false, layer: 9
    });
    board.create('text', [0, -6.35, function () { return HINT[sel]; }], {
      anchorX: 'middle', anchorY: 'middle', fontSize: 12, color: SOFT,
      fixed: true, highlight: false, layer: 9
    });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    function refresh() {
      // Ellipses : seule la sélectionnée est remplie — donc tout ce qu'elle
      // contient (les ensembles plus petits) est colorié avec elle.
      ELL.forEach(function (e, i) {
        attr(e, 'fillOpacity', i === sel ? Math.round(15 * reveal.v) / 100 : 0);
        attr(e, 'strokeWidth', i === sel ? 3.5 : (i === hover ? 3 : 2));
      });
      // Les nombres écrits dans les couronnes.
      EX.forEach(function (o) { paint(o.t, o.k); });

      // Les points de la droite : rouge plein s'ils appartiennent, petit
      // cercle blanc (un « trou ») sinon.
      DOTS.forEach(function (o) {
        var on = inSel(o.k);
        attr(o.p, 'fillColor', on ? C_IN : '#ffffff');
        attr(o.p, 'strokeColor', on ? C_IN : C_OUT);
        attr(o.p, 'size', on ? 4 : 3);
        if (o.lab) paint(o.lab, o.k);
      });

      // Les nuages et la droite pleine, avec un fondu à l'apparition.
      // `upto` : les nuages s'effacent une fois ℝ atteint — la droite pleine
      // les remplace, et leurs traits ne dépassent plus autour d'elle.
      function fade(o, level, upto) {
        var on = sel >= level && (upto === undefined || sel <= upto);
        attr(o, 'visible', on);
        attr(o, 'strokeOpacity', sel === level ? Math.round(100 * reveal.v) / 100 : 1);
      }
      fade(cloudD, 2, 3);
      fade(cloudQ, 3, 3);
      fade(fullR, 4);
    }

    /* ==================================================================== */
    /* Les textes de la figure et du panneau                                 */
    /* ==================================================================== */
    var INFO = [
      { head: 'Les entiers avec lesquels on <strong>compte</strong> : 0, 1, 2, 3, … ' +
              'Ni signe moins, ni virgule.',
        quoi: ['Écriture : que des chiffres, rien après la virgule.',
               'Il y en a une infinité, mais ils sont espacés de 1 en 1.'],
        pas:  '−3 (négatif) et 0,5 (avec une virgule) ne sont pas des entiers naturels.' },
      { head: 'Les entiers naturels <strong>et leurs opposés</strong> : … −3, −2, −1, 0, 1, 2, 3 … ' +
              'Le « Z » vient de <em>Zahl</em>, « nombre » en allemand.',
        quoi: ['Nouveauté par rapport à ℕ : les nombres <strong>négatifs</strong>.',
               'Tout entier naturel est un entier relatif : ℕ ⊂ ℤ.'],
        pas:  '0,5 n\'est toujours pas dedans : ce n\'est pas un entier.' },
      { head: 'Les nombres qui s\'écrivent avec un <strong>nombre fini de chiffres après ' +
              'la virgule</strong> : 3,25 ; −0,5 ; 7 (car 7 = 7,0).',
        quoi: ['Autrement dit de la forme a / 10<sup>n</sup> : 3,25 = 325 / 100.',
               'Nouveauté par rapport à ℤ : la <strong>virgule</strong>.'],
        pas:  '1/3 = 0,333… n\'est pas décimal : son écriture ne s\'arrête jamais.' },
      { head: 'Les <strong>quotients de deux entiers</strong> a/b (avec b ≠ 0) : ' +
              '1/3 ; −5/7 ; 11/6 — et aussi 3,25 = 13/4, et 7 = 7/1.',
        quoi: ['Leur écriture décimale est <strong>finie ou périodique</strong> : ' +
               '11/6 = 1,8333…',
               'Une fraction est décimale seulement si son dénominateur (réduit) ' +
               'ne contient que des 2 et des 5.'],
        pas:  '√2 et π ne sont le quotient d\'aucune paire d\'entiers : ils manquent encore.' },
      { head: 'Tous les nombres de la <strong>droite graduée</strong>. On a bouché les ' +
              'derniers trous avec les <strong>irrationnels</strong> : √2, π, √3…',
        quoi: ['À chaque point de la droite correspond un réel, et un seul.',
               'Un réel qui n\'est pas rationnel s\'appelle un <strong>irrationnel</strong>.'],
        pas:  'Plus rien ne manque : ℝ est l\'ensemble de tous les nombres du programme.' }
    ];

    /* ==================================================================== */
    /* Panneau                                                               */
    /* ==================================================================== */
    var panel = document.createElement('div');
    panel.className = 'props-panel';

    function chain() {
      // ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ, avec le sélectionné mis en avant.
      return SETS.map(function (s, i) {
        var st = 'font-family:' + MATHFONT + ';font-weight:700;' +
          (i === sel
            ? 'color:' + s.color + ';font-size:1.25em'
            : 'color:' + C_OUT);
        return '<span style="' + st + '">' + s.sym + '</span>';
      }).join('<span style="color:' + C_OUT + '"> ⊂ </span>');
    }

    function renderPanel() {
      var s = SETS[sel], info = INFO[sel];
      var dedans = SETS.slice(0, sel).map(function (t, i) { return symCol(i); });

      panel.innerHTML =
        '<div class="props-name" style="color:' + s.color + '">' + symCol(sel) +
          ' — les ' + s.nom + '</div>' +
        '<p style="margin:.3rem 0 .6rem">' + info.head + '</p>' +

        '<div class="props-label">Ce qu\'il faut retenir</div>' +
        '<ul class="props-list">' +
          info.quoi.map(function (q) { return '<li>' + q + '</li>'; }).join('') +
          (dedans.length
            ? '<li>' + symCol(sel) + ' contient déjà tout ' + dedans.join(', ') +
              ' : c\'est ce que montrent les ellipses emboîtées.</li>'
            : '<li>C\'est le plus petit des cinq : il est contenu dans tous les autres.</li>') +
        '</ul>' +

        '<div class="props-label">Ce qui n\'y est pas encore</div>' +
        '<p style="margin:.2rem 0 .5rem;color:' + (sel === 4 ? '#0d9488' : INK) + '">' +
          info.pas + '</p>' +

        '<div class="props-label">Les inclusions</div>' +
        '<p style="margin:.2rem 0 0;font-size:1.15rem;letter-spacing:.04em">' + chain() + '</p>' +
        '<p style="margin:.35rem 0 0;font-size:.85rem;color:var(--ink-soft)">' +
          'Chaque flèche se lit « est inclus dans » : tout nombre de l\'un est aussi un ' +
          'nombre du suivant. La réciproque est fausse — c\'est précisément ce que les ' +
          'nouveaux points rouges ajoutent à chaque étape.</p>';
    }

    board.on('update', function () { refresh(); renderPanel(); });

    /* ==================================================================== */
    /* Sélection : par les boutons, ou en cliquant dans une ellipse          */
    /* ==================================================================== */
    var btns = {};
    function updateButtons() {
      SETS.forEach(function (s, i) {
        if (btns[s.key]) btns[s.key].classList.toggle('active', i === sel);
      });
    }

    // Petit fondu à l'apparition de la sélection.
    var raf = null;
    function stopTween() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    mv.onCleanup(stopTween);

    function tween(dur) {
      stopTween();
      var t0 = null;
      reveal.v = 0;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        reveal.v = Math.min(1, (ts - t0) / dur);
        board.update();
        raf = reveal.v < 1 ? requestAnimationFrame(frame) : null;
      }
      raf = requestAnimationFrame(frame);
    }

    function setSel(i, smooth) {
      if (i === sel) return;
      sel = i;
      updateButtons();
      if (smooth) tween(420);
      else { stopTween(); reveal.v = 1; board.update(); }
    }

    /* Où a-t-on cliqué ? Dans la PLUS PETITE ellipse qui contient le point : */
    /* c'est exactement la couronne visée.                                    */
    function ringAt(x, y) {
      for (var i = 0; i < SETS.length; i++) {
        var dx = (x - CX) / SETS[i].a, dy = (y - CY) / SETS[i].b;
        if (dx * dx + dy * dy <= 1) return i;
      }
      return -1;
    }
    function eventCoords(e) {
      var idx = (e.targetTouches && e.targetTouches.length) ? 0 : undefined;
      var c = board.getCoordsTopLeftCorner(e, idx);
      var a = JXG.getPosition(e, idx);
      return new JXG.Coords(JXG.COORDS_BY_SCREEN, [a[0] - c[0], a[1] - c[1]], board).usrCoords;
    }

    board.on('down', function (e) {
      var u = eventCoords(e);
      var i = ringAt(u[1], u[2]);
      if (i >= 0) { anim.cancel(); setSel(i, true); }
    });
    board.on('move', function (e) {
      var u = eventCoords(e);
      var i = ringAt(u[1], u[2]);
      if (i !== hover) {
        hover = i;
        board.containerObj.style.cursor = i >= 0 ? 'pointer' : '';
        board.update();
      }
    });

    /* ==================================================================== */
    /* Animation : on parcourt les cinq ensembles, du plus petit au plus grand*/
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function reset() {
      stopTween();
      sel = 0; reveal.v = 1;
      updateButtons();
      board.update();
    }
    function play() {
      stopTween();
      reset();
      anim.runSteps(SETS.map(function (s, i) {
        return { dur: i === 0 ? 400 : 700, step: function (p) {
          if (sel !== i) { sel = i; updateButtons(); }
          reveal.v = p;
        } };
      }), reset);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var specs = SETS.map(function (s, i) {
      return { type: 'button', id: 'set' + s.key, label: s.sym + '  ' + s.nom,
               onClick: function () { anim.cancel(); setSel(i, true); } };
    });
    specs.push({ type: 'button', id: 'play', label: '▶ Animer', onClick: play });

    var refs = mv.addControls(specs);
    SETS.forEach(function (s) {
      btns[s.key] = refs['set' + s.key];
      // Le symbole de l'ensemble mérite sa belle police, même sur un bouton.
      btns[s.key].innerHTML = '<span style="font-family:' + MATHFONT +
        ';font-weight:700;font-size:1.15em">' + s.sym + '</span> ' + s.nom;
    });

    mv.extras.appendChild(panel);

    updateButtons();
    board.update();
  }
});
