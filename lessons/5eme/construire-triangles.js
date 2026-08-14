/*
 * Construire un triangle à partir de données partielles (5ème).
 *
 * ---------------------------------------------------------------------------
 * Trois données suffisent — mais lesquelles ?
 * ---------------------------------------------------------------------------
 * On ne donne jamais tout : trois renseignements bien choisis suffisent à fixer
 * un triangle. Trois cas, trois gestes, et l'animation les exécute réellement,
 * l'instrument à l'écran :
 *
 *   TROIS LONGUEURS          on trace le premier côté, puis deux arcs de compas
 *                            dont les rayons sont les deux autres longueurs.
 *                            Leur croisement est le troisième sommet.
 *   DEUX LONGUEURS ET        on trace un côté, on pose le RAPPORTEUR sur son
 *   L'ANGLE ENTRE ELLES      extrémité pour ouvrir l'angle, puis on reporte la
 *                            seconde longueur au compas le long de la demi-droite.
 *   UNE LONGUEUR ET          on trace le côté, puis on ouvre un angle à CHAQUE
 *   LES DEUX ANGLES          extrémité : les deux demi-droites se coupent au
 *   QUI LUI SONT ADJACENTS   troisième sommet.
 *
 * ---------------------------------------------------------------------------
 * Ce que les curseurs servent à découvrir
 * ---------------------------------------------------------------------------
 * Les données sont réglables, et c'est là tout l'intérêt : en les poussant, on
 * tombe sur les cas où le triangle N'EXISTE PAS, et l'animation le montre au
 * lieu de le dire.
 *   — trois longueurs : si la plus grande dépasse la somme des deux autres, les
 *     deux arcs ne se croisent jamais. C'est l'INÉGALITÉ TRIANGULAIRE, et on la
 *     voit à l'œil : les arcs restent à distance ;
 *   — une longueur et deux angles : si les deux angles font déjà 180° ou plus,
 *     les demi-droites s'écartent ou restent parallèles, et ne se rencontrent
 *     jamais. C'est la somme des angles d'un triangle, vue par l'autre bout.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Rien n'est placé à la main. Le côté [AB] est posé sur l'horizontale, A à
 * l'origine, et le troisième sommet est CALCULÉ selon le cas : intersection de
 * deux cercles, report d'une longueur sur une demi-droite, ou intersection de
 * deux demi-droites. Le triangle affiché est donc exactement celui que la
 * construction produit — et les longueurs et angles annoncés dans le bandeau
 * sont remesurés sur lui, jamais recopiés des curseurs.
 */
MathsView.register({
  id: 'construire-triangles',
  title: 'Construire un triangle',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — construire un triangle à partir de trois données',
  exercices: ['construire-triangles'],
  description:
    'Trois renseignements bien choisis suffisent à fixer un triangle. ' +
    '<strong>Choisis un cas</strong> et lance l\'animation : le premier côté se ' +
    'trace, puis l\'instrument entre en scène — le <strong>compas</strong> pour ' +
    'reporter une longueur, le <strong>rapporteur</strong> pour ouvrir un angle.' +
    '<br><strong>Règle les curseurs</strong> et regarde ce qui se passe quand les ' +
    'données ne vont plus ensemble : avec trois longueurs, les deux arcs finissent ' +
    'par ne plus se croiser ; avec deux angles, les demi-droites ne se rencontrent ' +
    'plus. Dans ces cas-là, <strong>le triangle n\'existe pas</strong>.',
  notes:
    '<ul>' +
    '<li><strong>Trois longueurs.</strong> On trace le plus grand côté, puis un arc ' +
    'de compas depuis chaque extrémité, de rayon les deux autres longueurs. Le ' +
    'croisement des arcs donne le troisième sommet. Il y a deux croisements, ' +
    'symétriques par rapport au côté tracé : les deux triangles obtenus sont ' +
    'superposables, c\'est donc bien <em>le même</em> triangle.</li>' +
    '<li><strong>L\'inégalité triangulaire.</strong> Un triangle n\'existe que si ' +
    'chaque côté est <strong>plus court que la somme des deux autres</strong>. ' +
    'Sinon les arcs ne se croisent pas : pour aller de \\(A\\) à \\(B\\), le chemin ' +
    'direct est toujours le plus court.</li>' +
    '<li><strong>Deux longueurs et l\'angle entre elles.</strong> L\'angle doit être ' +
    '<em>entre</em> les deux côtés donnés — on dit qu\'il leur est <em>compris</em>. ' +
    'On l\'ouvre au rapporteur depuis le côté déjà tracé, puis on reporte la seconde ' +
    'longueur au compas sur la demi-droite obtenue.</li>' +
    '<li><strong>Une longueur et deux angles.</strong> Les deux angles doivent être ' +
    '<em>adjacents</em> au côté donné, un à chaque extrémité. Leur somme doit être ' +
    '<strong>inférieure à 180°</strong>, sans quoi les demi-droites ne se coupent ' +
    'pas — c\'est exactement la propriété de la somme des angles d\'un triangle.</li>' +
    '<li><strong>Toujours commencer par une figure à main levée.</strong> On y ' +
    'reporte les données, et elle sert de plan : on voit où seront les sommets ' +
    'avant de sortir les instruments.</li>' +
    '<li><strong>Ce qui ne suffit pas.</strong> Trois <em>angles</em> ne suffisent ' +
    'pas : ils fixent la forme, pas la taille. On obtient une infinité de triangles ' +
    'de tailles différentes.</li>' +
    '</ul>',
  board: { boundingbox: [-3.4, 7.6, 12.6, -3.4], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var INK = '#334155';        // les côtés du triangle
    var SOM = '#2563eb';        // les sommets
    var DONNE = '#0f172a';      // le côté de départ, celui qu'on trace en premier
    var ARC = '#7c3aed';        // les arcs de compas
    var RAPP = '#ea580c';       // le rapporteur
    var TROUVE = '#dc2626';     // le sommet trouvé
    var GUIDE = '#94a3b8';

    var anim = mv.createAnimator();

    function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
    function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
    function mul(a, k) { return [a[0] * k, a[1] * k]; }
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
    function len(a) { return Math.sqrt(dot(a, a)); }
    function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
    function pol(c, a, r) { return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; }
    function fr(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }

    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }

    /* ==================================================================== */
    /* Les trois cas, et leurs données                                      */
    /* ==================================================================== */
    /* Le côté [AB] est toujours celui qu'on trace en premier : A à l'origine,
       B sur l'horizontale. Seul C change de mode de calcul. */
    var CAS = [
      { cle: 'lll', nom: 'Trois longueurs',
        curseurs: [{ n: 'c', lab: 'AB', min: 4, max: 9, pas: 0.5, val: 7 },
                   { n: 'b', lab: 'AC', min: 2, max: 8, pas: 0.5, val: 5 },
                   { n: 'a', lab: 'BC', min: 2, max: 8, pas: 0.5, val: 4 }] },
      { cle: 'lal', nom: 'Deux longueurs et l\'angle entre elles',
        curseurs: [{ n: 'c', lab: 'AB', min: 4, max: 9, pas: 0.5, val: 6.5 },
                   { n: 'alpha', lab: 'angle en A', min: 20, max: 130, pas: 5, val: 55 },
                   { n: 'b', lab: 'AC', min: 2, max: 8, pas: 0.5, val: 5 }] },
      { cle: 'ala', nom: 'Une longueur et les deux angles',
        curseurs: [{ n: 'c', lab: 'AB', min: 4, max: 9, pas: 0.5, val: 7 },
                   { n: 'alpha', lab: 'angle en A', min: 15, max: 140, pas: 5, val: 50 },
                   { n: 'beta', lab: 'angle en B', min: 15, max: 140, pas: 5, val: 65 }] }
    ];
    var cas = 0;
    var D = {};
    function chargeDefauts() {
      D = {};
      CAS[cas].curseurs.forEach(function (s) { D[s.n] = s.val; });
    }
    chargeDefauts();

    function A() { return [0, 0]; }
    function B() { return [D.c, 0]; }
    var RAD = Math.PI / 180;

    /* Le troisième sommet, calculé selon le cas. `null` quand il n'existe pas. */
    function C() {
      if (CAS[cas].cle === 'lll') {
        // intersection des cercles (A ; b) et (B ; a), celle du dessus
        var d = D.c;
        if (D.b + D.a <= d || Math.abs(D.b - D.a) >= d) return null;
        var x = (D.b * D.b - D.a * D.a + d * d) / (2 * d);
        var h2 = D.b * D.b - x * x;
        if (h2 <= 0) return null;
        return [x, Math.sqrt(h2)];
      }
      if (CAS[cas].cle === 'lal') {
        return pol(A(), D.alpha * RAD, D.b);
      }
      // ala : les deux demi-droites se coupent si la somme des angles < 180
      if (D.alpha + D.beta >= 180) return null;
      var t = Math.tan(D.alpha * RAD), u = Math.tan(D.beta * RAD);
      // y = t·x et y = u·(c − x)
      var x2 = u * D.c / (t + u);
      return [x2, t * x2];
    }
    function possible() { return C() !== null; }

    /* ==================================================================== */
    /* Avancement                                                           */
    /* ==================================================================== */
    var p1 = 0;      // le côté [AB]
    var p2 = 0;      // le premier instrument (arc depuis A, ou rapporteur en A)
    var p3 = 0;      // le second (arc depuis B, rapporteur en B, ou report au compas)
    var p4 = 0;      // le sommet C
    var p5 = 0;      // les deux côtés qui restent, et le codage

    /* ==================================================================== */
    /* La figure                                                            */
    /* ==================================================================== */
    // le côté de départ, qui se trace de A vers B
    var cote1 = board.create('curve', [
      function (t) { return A()[0] + (B()[0] - A()[0]) * t; },
      function (t) { return A()[1] + (B()[1] - A()[1]) * t; },
      0, function () { return p1; }
    ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: DONNE, strokeWidth: 3,
         highlight: false });

    var ptA = board.create('point', [function () { return A()[0]; },
                                     function () { return A()[1]; }], {
      name: 'A', size: 4, color: SOM, fixed: true, showInfobox: false, highlight: false,
      label: { offset: [-18, -14], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
    });
    var ptB = board.create('point', [function () { return B()[0]; },
                                     function () { return B()[1]; }], {
      name: 'B', size: 4, color: SOM, fixed: true, showInfobox: false, highlight: false,
      label: { offset: [10, -14], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
    });
    var labAB = board.create('text', [
      function () { return D.c / 2; }, function () { return -0.55; },
      function () { return fr(D.c) + ' cm'; }
    ], { fontSize: 14, color: DONNE, cssStyle: 'font-weight:700', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });

    /* -- les arcs de compas ---------------------------------------------
       Un arc qui s'ouvre : le compas tourne, il ne surgit pas d'un coup. */
    function arcCompas(centre, rayon, depart, ouverture, prog, couleur) {
      return board.create('curve', [
        function (u) {
          return pol(centre(), depart() + ouverture() * u * prog(), rayon())[0];
        },
        function (u) {
          return pol(centre(), depart() + ouverture() * u * prog(), rayon())[1];
        },
        0, 1
      ], { numberPointsHigh: 60, numberPointsLow: 60, strokeColor: couleur,
           strokeWidth: 2, dash: 0, highlight: false, visible: false });
    }
    /* On ne trace pas un demi-cercle : sur le papier, on ouvre un petit arc LÀ OÙ
       il va croiser l'autre. L'arc est donc centré sur la direction du sommet
       cherché — sauf quand ce sommet n'existe pas, où l'on balaie largement pour
       qu'on voie bien les deux arcs se manquer. */
    var DEMI = 38 * RAD;                     // la demi-ouverture de l'arc
    function versC(depuis, defaut) {
      var c = C();
      if (!c) return defaut * RAD;
      var d = sub(c, depuis());
      return Math.atan2(d[1], d[0]);
    }
    function debutA() { return C() ? versC(A, 60) - DEMI : 25 * RAD; }
    function ouvA() { return C() ? 2 * DEMI : 130 * RAD; }
    function debutB() { return C() ? versC(B, 120) + DEMI : 155 * RAD; }
    function ouvB() { return C() ? -2 * DEMI : -130 * RAD; }

    var arcA = arcCompas(A, function () { return D.b; }, debutA, ouvA,
      function () { return p2; }, ARC);
    var arcB = arcCompas(B, function () { return D.a; }, debutB, ouvB,
      function () { return p3; }, ARC);
    // le rayon du compas, montré comme un écartement
    function traitRayon(de, vers, prog, couleur) {
      return board.create('curve', [
        function (t) { var u = de(), v = vers(); return u[0] + (v[0] - u[0]) * t * prog(); },
        function (t) { var u = de(), v = vers(); return u[1] + (v[1] - u[1]) * t * prog(); },
        0, 1
      ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: couleur, strokeWidth: 1.6,
           dash: 2, highlight: false, visible: false });
    }
    // l'écartement du compas, montré au départ de l'arc
    var ecartA = traitRayon(A, function () { return pol(A(), debutA(), D.b); },
      function () { return Math.min(1, p2 * 3); }, ARC);
    var ecartB = traitRayon(B, function () { return pol(B(), debutB(), D.a); },
      function () { return Math.min(1, p3 * 3); }, ARC);
    // la mesure, portée par la pointe du compas pendant qu'elle tourne
    var labArcA = board.create('text', [
      function () { return pol(A(), debutA() + ouvA() * p2, D.b + 0.55)[0]; },
      function () { return pol(A(), debutA() + ouvA() * p2, D.b + 0.55)[1]; },
      function () { return fr(D.b) + ' cm'; }
    ], { fontSize: 13, color: ARC, cssStyle: 'font-weight:700', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });
    var labArcB = board.create('text', [
      function () { return pol(B(), debutB() + ouvB() * p3, D.a + 0.55)[0]; },
      function () { return pol(B(), debutB() + ouvB() * p3, D.a + 0.55)[1]; },
      function () { return fr(D.a) + ' cm'; }
    ], { fontSize: 13, color: ARC, cssStyle: 'font-weight:700', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });

    /* -- le rapporteur ---------------------------------------------------
       Un demi-disque gradué, posé sur le sommet et aligné sur le côté déjà
       tracé. Les graduations sont dessinées d'un seul trait : la courbe se
       coupe en renvoyant NaN, ce qui lève le crayon. */
    /* Le rapporteur se pose sur le sommet, son zéro aligné sur le côté déjà
       tracé : en A, ce côté part vers B (angle 0) et l'on tourne dans le sens
       direct ; en B, il part vers A (angle 180°) et l'on tourne dans l'autre
       sens. Dans les deux cas le demi-disque couvre le demi-plan du HAUT, celui
       où le triangle se construit. */
    var RR = 2.6;
    function rapporteur(sommet, base, sens, prog) {
      function point(a, r) { return pol(sommet(), base + sens * a, r); }
      var demi = board.create('curve', [
        function (u) { return point(Math.PI * u, RR * prog())[0]; },
        function (u) { return point(Math.PI * u, RR * prog())[1]; },
        0, 1
      ], { numberPointsHigh: 60, numberPointsLow: 60, strokeColor: RAPP, strokeWidth: 2,
           fillColor: RAPP, fillOpacity: 0.07, highlight: false, visible: false });
      function grad(u, xy) {
        var i = Math.floor(u * 19), k = u * 19 - i;
        if (i > 18 || k > 0.66) return NaN;            // au-delà : on lève le crayon
        var r = RR * (k < 0.33 ? 1 : (i % 3 === 0 ? 0.84 : 0.91));
        return point(i * 10 * RAD, r * prog())[xy];
      }
      var grads = board.create('curve', [
        function (u) { return grad(u, 0); },
        function (u) { return grad(u, 1); },
        0, 1
      ], { numberPointsHigh: 19 * 12, numberPointsLow: 19 * 12, strokeColor: RAPP,
           strokeWidth: 1.4, highlight: false, visible: false });
      return { demi: demi, grads: grads };
    }
    var rappA = rapporteur(A, 0, 1, function () { return p2; });
    var rappB = rapporteur(B, Math.PI, -1, function () { return p3; });

    /* La demi-droite ouverte au rapporteur : elle part du côté déjà tracé et
       tourne jusqu'à l'angle voulu — même repère que le rapporteur ci-dessus. */
    function demiDroite(sommet, base, sens, angleFin, prog, longueur) {
      function dir() { return base + sens * angleFin() * prog() * RAD; }
      return board.create('curve', [
        function (t) { return pol(sommet(), dir(), longueur() * t)[0]; },
        function (t) { return pol(sommet(), dir(), longueur() * t)[1]; },
        0, 1
      ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: RAPP, strokeWidth: 2.2,
           highlight: false, visible: false });
    }
    var rayonA = demiDroite(A, 0, 1, function () { return D.alpha; },
      function () { return p2; }, function () { return 9.5; });
    var rayonB = demiDroite(B, Math.PI, -1, function () { return D.beta; },
      function () { return p3; }, function () { return 9.5; });
    // la mesure qui défile pendant que l'angle s'ouvre
    var labAngA = board.create('text', [
      function () { return pol(A(), D.alpha * p2 / 2 * RAD, 1.5)[0]; },
      function () { return pol(A(), D.alpha * p2 / 2 * RAD, 1.5)[1]; },
      function () { return Math.round(D.alpha * p2) + '°'; }
    ], { fontSize: 15, color: RAPP, cssStyle: 'font-weight:800', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });
    var labAngB = board.create('text', [
      function () { return pol(B(), Math.PI - D.beta * p3 / 2 * RAD, 1.5)[0]; },
      function () { return pol(B(), Math.PI - D.beta * p3 / 2 * RAD, 1.5)[1]; },
      function () { return Math.round(D.beta * p3) + '°'; }
    ], { fontSize: 15, color: RAPP, cssStyle: 'font-weight:800', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });

    /* Le report d'une longueur au compas, sur la demi-droite (cas « lal »). */
    var arcReport = board.create('curve', [
      function (u) {
        return pol(A(), (D.alpha - 22 + 44 * u) * RAD, D.b * (p3 > 0 ? 1 : 0))[0];
      },
      function (u) {
        return pol(A(), (D.alpha - 22 + 44 * u) * RAD, D.b * (p3 > 0 ? 1 : 0))[1];
      },
      0, function () { return Math.min(1, p3 * 1.4); }
    ], { numberPointsHigh: 30, numberPointsLow: 30, strokeColor: ARC, strokeWidth: 2,
         highlight: false, visible: false });

    /* -- le sommet trouvé, et la fin du triangle ------------------------- */
    var ptC = board.create('point', [
      function () { var c = C(); return c ? c[0] : 0; },
      function () { var c = C(); return c ? c[1] : 0; }
    ], { name: 'C', size: 5, color: TROUVE, fixed: true, showInfobox: false,
         highlight: false, visible: false,
         label: { offset: [0, 16], fontSize: 16, strokeColor: TROUVE,
                  cssStyle: 'font-weight:700' } });

    function coteFinal(de) {
      return board.create('curve', [
        function (t) {
          var c = C(); if (!c) return 0;
          var u = de(); return u[0] + (c[0] - u[0]) * t * p5;
        },
        function (t) {
          var c = C(); if (!c) return 0;
          var u = de(); return u[1] + (c[1] - u[1]) * t * p5;
        },
        0, 1
      ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: INK, strokeWidth: 3,
           highlight: false, visible: false });
    }
    var coteAC = coteFinal(A), coteBC = coteFinal(B);

    // le message quand le triangle n'existe pas
    var alerte = board.create('text', [D.c / 2, 4.6, ''], {
      fontSize: 15, color: '#b91c1c', cssStyle: 'font-weight:800', fixed: true,
      anchorX: 'middle', highlight: false, visible: false
    });

    /* ==================================================================== */
    /* Le bandeau : le programme de construction                            */
    /* ==================================================================== */
    var panneau = document.createElement('div');
    panneau.className = 'ctr-panneau';
    var dernier = '';

    /* Les étapes, en toutes lettres. C'est ce qu'on écrit sur son cahier avant
       de sortir les instruments — et c'est ce que l'animation exécute. */
    function programme() {
      var k = CAS[cas].cle;
      if (k === 'lll') {
        return ['Tracer le segment \\([AB]\\) de <b>' + fr(D.c) + ' cm</b>.',
                'Tracer l\'arc de cercle de centre \\(A\\) et de rayon <b>' + fr(D.b) +
                  ' cm</b>.',
                'Tracer l\'arc de cercle de centre \\(B\\) et de rayon <b>' + fr(D.a) +
                  ' cm</b>.',
                'Les deux arcs se croisent en \\(C\\).',
                'Tracer \\([AC]\\) et \\([BC]\\).'];
      }
      if (k === 'lal') {
        return ['Tracer le segment \\([AB]\\) de <b>' + fr(D.c) + ' cm</b>.',
                'Au rapporteur, ouvrir un angle de <b>' + Math.round(D.alpha) +
                  '°</b> en \\(A\\), à partir de \\([AB]\\).',
                'Au compas, reporter <b>' + fr(D.b) + ' cm</b> depuis \\(A\\) sur cette ' +
                  'demi-droite : c\'est \\(C\\).',
                'Tracer \\([BC]\\).'];
      }
      return ['Tracer le segment \\([AB]\\) de <b>' + fr(D.c) + ' cm</b>.',
              'Au rapporteur, ouvrir un angle de <b>' + Math.round(D.alpha) +
                '°</b> en \\(A\\).',
              'Au rapporteur, ouvrir un angle de <b>' + Math.round(D.beta) +
                '°</b> en \\(B\\), de l\'autre côté.',
              'Les deux demi-droites se coupent en \\(C\\).'];
    }
    // Jusqu'où l'animation est allée : sert à mettre l'étape en cours en avant.
    function etapeCourante() {
      var k = CAS[cas].cle;
      if (p5 > 0) return 99;
      if (p4 > 0) return k === 'lal' ? 2 : 3;
      if (p3 > 0) return 2;
      if (p2 > 0) return 1;
      if (p1 > 0) return 0;
      return -1;
    }

    function pourquoiImpossible() {
      var k = CAS[cas].cle;
      if (k === 'lll') {
        var L = [{ n: 'AB', v: D.c, s: D.b + D.a }, { n: 'AC', v: D.b, s: D.c + D.a },
                 { n: 'BC', v: D.a, s: D.c + D.b }];
        var mauvais = L.filter(function (x) { return x.v >= x.s; })[0];
        if (!mauvais) return '';
        return 'Le côté <b>' + mauvais.n + '</b> mesure ' + fr(mauvais.v) + ' cm, alors ' +
          'que les deux autres réunis n\'en font que ' + fr(mauvais.s) + '. Les deux arcs ' +
          'ne peuvent pas se croiser : <b>ce triangle n\'existe pas</b>. Dans un triangle, ' +
          'chaque côté est plus court que la somme des deux autres — c\'est ' +
          'l\'<b>inégalité triangulaire</b>.';
      }
      if (k === 'ala') {
        return 'Les deux angles font déjà ' + Math.round(D.alpha) + '° + ' +
          Math.round(D.beta) + '° = <b>' + Math.round(D.alpha + D.beta) + '°</b>. ' +
          'Or les trois angles d\'un triangle font 180° en tout : il ne reste ' +
          (D.alpha + D.beta === 180 ? 'rien' : 'moins que rien') + ' pour le troisième. ' +
          'Les deux demi-droites ne se rencontrent jamais.';
      }
      return '';
    }

    function rendrePanneau() {
      var h = '<div class="ctr-titre">Programme de construction</div>';
      var ok = possible(), etape = etapeCourante();
      h += '<ol class="ctr-etapes">' + programme().map(function (t, i) {
        var etat = (etape === 99 || i < etape) ? ' faite' : (i === etape ? ' encours' : '');
        return '<li class="ctr-etape' + etat + '">' + t + '</li>';
      }).join('') + '</ol>';
      if (!ok) {
        h += '<p class="ctr-alerte">' + pourquoiImpossible() + '</p>';
      } else if (p5 > 0.9) {
        // les mesures sont RELUES sur le triangle construit, pas recopiées
        var a = C(), ab = D.c, ac = len(sub(a, A())), bc = len(sub(a, B()));
        function angle(s, u, v) {
          return Math.acos(Math.max(-1, Math.min(1,
            dot(unit(sub(u, s)), unit(sub(v, s)))))) * 180 / Math.PI;
        }
        h += '<p class="ctr-bilan">Le triangle obtenu : <b>AB = ' + fr(ab) +
          ' cm</b>, <b>AC = ' + fr(ac) + ' cm</b>, <b>BC = ' + fr(bc) + ' cm</b> — et ses ' +
          'angles mesurent <b>' + Math.round(angle(A(), B(), a)) + '°</b>, <b>' +
          Math.round(angle(B(), A(), a)) + '°</b> et <b>' +
          Math.round(angle(a, A(), B())) + '°</b>.<br>' +
          'Ces mesures sont relues sur la figure construite. Les trois données de ' +
          'départ s\'y retrouvent : c\'est bien le triangle demandé.</p>';
      }
      if (h !== dernier) {
        dernier = h;
        panneau.innerHTML = h;
        if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([panneau]);
      }
    }

    /* ==================================================================== */
    /* Rafraîchissement                                                     */
    /* ==================================================================== */
    function rafraichir() {
      var k = CAS[cas].cle, ok = possible();
      show(labAB, p1 > 0.9);

      var compasA = k === 'lll';
      var compasB = k === 'lll';
      show(arcA, compasA && p2 > 0.01);
      show(ecartA, compasA && p2 > 0.01);
      show(labArcA, compasA && p2 > 0.05);
      show(arcB, compasB && p3 > 0.01);
      show(ecartB, compasB && p3 > 0.01);
      show(labArcB, compasB && p3 > 0.05);

      var rapA = k === 'lal' || k === 'ala';
      show(rappA.demi, rapA && p2 > 0.01 && p2 < 0.999);
      show(rappA.grads, rapA && p2 > 0.01 && p2 < 0.999);
      show(rayonA, rapA && p2 > 0.01);
      show(labAngA, rapA && p2 > 0.05);

      var rapB = k === 'ala';
      show(rappB.demi, rapB && p3 > 0.01 && p3 < 0.999);
      show(rappB.grads, rapB && p3 > 0.01 && p3 < 0.999);
      show(rayonB, rapB && p3 > 0.01);
      show(labAngB, rapB && p3 > 0.05);

      show(arcReport, k === 'lal' && p3 > 0.01);

      show(ptC, ok && p4 > 0.4);
      show(coteAC, ok && p5 > 0.01 && k !== 'lal');
      show(coteBC, ok && p5 > 0.01);
      // en « lal », [AC] est déjà porté par la demi-droite : on le trace quand même
      if (k === 'lal') show(coteAC, ok && p5 > 0.01);

      var mot = !ok && p3 > 0.5;
      show(alerte, mot);
      if (mot) {
        alerte.setText(k === 'lll' ? 'les arcs ne se croisent pas'
                                   : 'les demi-droites ne se coupent pas');
      }
      rendrePanneau();
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      p1 = 0; p2 = 0; p3 = 0; p4 = 0; p5 = 0;
      board.update();
    }
    function tout() {
      anim.cancel();
      p1 = 1; p2 = 1; p3 = 1; p4 = 1; p5 = 1;
      board.update();
    }
    function jouer() {
      anim.cancel();
      effacer();
      anim.runSteps([
        { dur: 700,  step: function (q) { p1 = q; } },
        { dur: 1100, step: function (q) { p1 = 1; p2 = q; } },
        { dur: 1100, step: function (q) { p2 = 1; p3 = q; } },
        { dur: 500,  step: function (q) { p3 = 1; p4 = q; } },
        { dur: 800,  step: function (q) { p4 = 1; p5 = q; } }
      ], effacer);
    }

    /* ==================================================================== */
    /* Les commandes                                                        */
    /* ==================================================================== */
    var choix = document.createElement('div');
    choix.className = 'ctr-choix';
    var boutons = CAS.map(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = c.nom;
      b.onclick = function () { cas = i; chargeDefauts(); majChoix(); rendreCurseurs(); jouer(); };
      choix.appendChild(b);
      return b;
    });
    function majChoix() {
      boutons.forEach(function (b, i) { b.classList.toggle('active', i === cas); });
    }

    var curseurs = document.createElement('div');
    curseurs.className = 'ctr-curseurs';
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    function rendreCurseurs() {
      curseurs.innerHTML = '';
      CAS[cas].curseurs.forEach(function (s) {
        var lab = document.createElement('label');
        var nom = document.createElement('span');
        nom.className = 'ctr-nom';
        nom.textContent = s.lab;
        var input = document.createElement('input');
        input.type = 'range';
        input.min = s.min; input.max = s.max; input.step = s.pas;
        input.value = D[s.n];
        var val = document.createElement('span');
        val.className = 'ctr-val';
        val.textContent = /angle/.test(s.lab) ? Math.round(D[s.n]) + '°' : fr(D[s.n]) + ' cm';
        input.oninput = function () {
          D[s.n] = parseFloat(input.value);
          val.textContent = /angle/.test(s.lab) ? Math.round(D[s.n]) + '°'
                                                : fr(D[s.n]) + ' cm';
          tout();
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 700);
        };
        lab.appendChild(nom); lab.appendChild(input); lab.appendChild(val);
        curseurs.appendChild(lab);
      });
    }

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer la construction', onClick: jouer },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    mv.extras.appendChild(choix);
    mv.extras.appendChild(curseurs);
    mv.extras.appendChild(panneau);

    board.on('update', rafraichir);
    majChoix();
    rendreCurseurs();
    jouer();
  }
});
