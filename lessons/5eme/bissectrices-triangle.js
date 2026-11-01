/*
 * Les bissectrices d'un triangle et le cercle inscrit (5ème).
 *
 * ---------------------------------------------------------------------------
 * La quatrième d'une famille
 * ---------------------------------------------------------------------------
 * Construite comme « Les hauteurs », « Les médianes » et « Les médiatrices »,
 * pour que les quatre se lisent ensemble : même figure, même déroulé, même
 * bandeau. Ce qui change est ce qu'on va chercher : non plus un côté (son
 * milieu, sa perpendiculaire), mais l'ANGLE au sommet, qu'on partage en deux
 * angles égaux.
 *
 * L'animation trace les bissectrices UNE PAR UNE, chacune en deux temps :
 *   1. l'angle au sommet s'allume : c'est LUI qu'on va partager ;
 *   2. la bissectrice descend du sommet, et le codage des deux demi-angles
 *      égaux apparaît — c'est ce codage qui fait la définition.
 * Puis les trois demi-droites se révèlent concourantes en I, les trois
 * distances de I aux côtés se tracent (perpendiculaires, avec leur petit
 * carré), et le CERCLE INSCRIT se referme en touchant les trois côtés.
 *
 * ---------------------------------------------------------------------------
 * Ce que les triangles particuliers font voir
 * ---------------------------------------------------------------------------
 *   ACUTANGLE, RECTANGLE, OBTUSANGLE : I est TOUJOURS À L'INTÉRIEUR. Une
 *                 bissectrice part d'un sommet et entre dans l'angle : elle ne
 *                 peut pas sortir du triangle — c'est la grande différence avec
 *                 O, le centre du cercle circonscrit, que la case « Cercle
 *                 circonscrit » superpose pour qu'on le voie sortir.
 *   ISOCÈLE       la bissectrice du sommet principal est aussi la hauteur, la
 *                 médiane et la médiatrice de la base : UNE seule droite pour
 *                 quatre rôles. I est dessus, et O aussi.
 *   ÉQUILATÉRAL   les trois bissectrices sont aussi les trois médiatrices, les
 *                 hauteurs et les médianes : I, O, G et H sont CONFONDUS.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 *   - la BISSECTRICE issue d'un sommet est tracée pour ce qu'elle est : depuis
 *     le sommet, dans la direction qui partage l'angle en deux, c'est-à-dire la
 *     somme des deux vecteurs unitaires portés par les côtés ;
 *   - le CENTRE DU CERCLE INSCRIT est le point à égale distance des trois
 *     côtés : I = (a·A + b·B + c·C) / (a + b + c), où a, b, c sont les
 *     longueurs des côtés opposés à A, B, C. Il n'est pas cherché comme une
 *     intersection à l'écran : la concourance est une CONSÉQUENCE que la figure
 *     se contente de rendre visible ;
 *   - le RAYON est la distance de I à n'importe lequel des trois côtés (soit
 *     aire / demi-périmètre), et le bandeau vérifie en direct que les trois
 *     donnent bien la même valeur. Les trois points de contact sont les
 *     projetés orthogonaux de I sur les côtés.
 * Le déterminant du triangle s'annule quand les trois points s'alignent, et la
 * figure se met alors en veille.
 */
MathsView.register({
  id: 'bissectrices-triangle',
  title: 'Les bissectrices et le cercle inscrit',
  level: '5eme',
  rappels: ['2nde'],   // revue en seconde, telle quelle
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — bissectrices d\'un triangle et cercle inscrit',
  exercices: ['bissectrices'],
  description:
    'La <strong>bissectrice</strong> d\'un angle est la demi-droite qui part du sommet et ' +
    'partage l\'angle en <strong>deux angles égaux</strong>. Ses points sont exactement ceux ' +
    'qui sont à <strong>égale distance</strong> des deux côtés de l\'angle.' +
    '<br>Les trois bissectrices des angles d\'un triangle sont <strong>concourantes</strong> ' +
    'en un point \\(I\\) — à égale distance des trois côtés, donc centre d\'un cercle qui ' +
    'touche les trois : le <strong>cercle inscrit</strong>.' +
    '<br><strong>Change de triangle</strong> : quelle que soit sa forme, \\(I\\) reste ' +
    '<em>dedans</em>. Coche <strong>Cercle circonscrit</strong> pour comparer avec \\(O\\), ' +
    'qui, lui, peut sortir — et <strong>Les médianes</strong> pour voir, dans un triangle ' +
    'isocèle ou équilatéral, ces droites se confondre.',
  notes:
    '<ul>' +
    '<li><strong>La définition.</strong> La bissectrice de l\'angle \\(\\widehat{BAC}\\) est ' +
    'la demi-droite issue de \\(A\\) qui le partage en deux angles de même mesure : ' +
    '\\(\\widehat{BAI} = \\widehat{IAC}\\). Un point est dessus <em>si et seulement si</em> ' +
    'il est à égale distance des deux côtés \\((AB)\\) et \\((AC)\\).</li>' +
    '<li><strong>Pourquoi elles se coupent en un seul point.</strong> Le point commun aux ' +
    'bissectrices de \\(\\widehat{A}\\) et de \\(\\widehat{B}\\) est à égale distance de ' +
    '\\((AB)\\) et \\((AC)\\), et à égale distance de \\((BA)\\) et \\((BC)\\) : il est donc à ' +
    'égale distance de \\((CA)\\) et \\((CB)\\), et se trouve <em>forcément</em> sur la ' +
    'troisième bissectrice. Même démonstration que pour les médiatrices, avec les côtés à ' +
    'la place des sommets.</li>' +
    '<li><strong>Le cercle inscrit.</strong> \\(I\\) est à la même distance \\(r\\) des trois ' +
    'côtés : le cercle de centre \\(I\\) et de rayon \\(r\\) <strong>touche</strong> les ' +
    'trois côtés sans les traverser — on dit qu\'il leur est <em>tangent</em>. Le rayon se ' +
    'mesure <strong>perpendiculairement</strong> à un côté, jamais vers un sommet.</li>' +
    '<li><strong>Où tombe \\(I\\).</strong> Toujours <em>à l\'intérieur</em> : une bissectrice ' +
    'part d\'un sommet et entre dans l\'angle, elle ne peut pas sortir du triangle. Le centre ' +
    'du cercle <em>circonscrit</em>, lui, sort dès qu\'un angle est obtus.</li>' +
    '<li><strong>Triangle isocèle.</strong> La bissectrice du sommet principal est aussi la ' +
    'hauteur, la médiane et la médiatrice de la base : une seule droite, quatre rôles — ' +
    'l\'axe de symétrie du triangle.</li>' +
    '<li><strong>Triangle équilatéral.</strong> Les trois bissectrices sont aussi les trois ' +
    'médiatrices, hauteurs et médianes : le centre du cercle inscrit, celui du cercle ' +
    'circonscrit, le centre de gravité et l\'orthocentre sont <strong>confondus</strong>.</li>' +
    '<li><strong>Ne pas confondre.</strong> Le cercle <em>inscrit</em> est <em>dedans</em>, il ' +
    'touche les côtés, son centre est le point de concours des <strong>bissectrices</strong>. ' +
    'Le cercle <em>circonscrit</em> passe par les <em>sommets</em>, son centre est le point ' +
    'de concours des <strong>médiatrices</strong>. Coche la case et déplace un sommet.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  /* La fiche bristol à recopier (voir js/fiches.js). */
  fiche: {
    titre: 'Bissectrices et cercle inscrit',
    figures: [{
      legende: 'Les trois bissectrices se coupent en I, à égale distance des trois côtés.',
      boundingbox: [-4.6, 5.2, 5.8, -1.4],
      largeur: 56, hauteur: 40,
      dessine: function (board) {
        var PT = { size: 2, strokeColor: '#2563eb', fillColor: '#2563eb', fixed: true, highlight: false,
                   showInfobox: false, label: { fontSize: 12, cssStyle: 'font-weight:700', strokeColor: '#2563eb' } };
        var A = board.create('point', [0.6, 4.4], Object.assign({ name: 'A', label: { offset: [-4, 10] } }, PT));
        var B = board.create('point', [-3.4, 0], Object.assign({ name: 'B', label: { offset: [-14, -4] } }, PT));
        var C = board.create('point', [4.6, 0], Object.assign({ name: 'C', label: { offset: [6, -4] } }, PT));
        board.create('polygon', [A, B, C], {
          fillColor: '#2563eb', fillOpacity: .06, borders: { strokeColor: '#334155', strokeWidth: 2 },
          vertices: { visible: false }, highlight: false, fixed: true
        });
        [[B, A, C], [A, B, C], [A, C, B]].forEach(function (t) {
          board.create('bisector', t, { strokeColor: '#7c3aed', strokeWidth: 1.6, dash: 3, fixed: true, highlight: false,
            straightFirst: false, straightLast: true });
        });
        // Le codage des demi-angles : deux petits arcs égaux à chaque sommet.
        var I = board.create('incenter', [A, B, C], { name: 'I', size: 2.5, strokeColor: '#dc2626', fillColor: '#dc2626',
          fixed: true, highlight: false, showInfobox: false,
          label: { fontSize: 12, offset: [7, -4], strokeColor: '#dc2626', cssStyle: 'font-weight:700' } });
        [[A, B, C], [B, C, A], [C, A, B]].forEach(function (t) {
          var V = t[0], P1 = t[1], P2 = t[2];
          board.create('angle', [P1, V, I], { radius: 0.55, strokeColor: '#ea580c', fillColor: '#ea580c', fillOpacity: .18,
            strokeWidth: 1.2, fixed: true, highlight: false, withLabel: false, orthoType: 'sector' });
          board.create('angle', [I, V, P2], { radius: 0.55, strokeColor: '#ea580c', fillColor: '#ea580c', fillOpacity: .18,
            strokeWidth: 1.2, fixed: true, highlight: false, withLabel: false, orthoType: 'sector' });
        });
        board.create('incircle', [A, B, C], { strokeColor: '#dc2626', strokeWidth: 2, fixed: true, highlight: false,
          center: { visible: false } });
      }
    }],
    points: [
      'La <b>bissectrice</b> d\'un angle est la demi-droite issue du sommet qui le partage en <b>deux angles égaux</b>.',
      'Un point est sur la bissectrice de \\( \\widehat{BAC} \\) si et seulement s\'il est à <b>égale distance</b> des côtés (AB) et (AC).',
      'Les trois bissectrices des angles d\'un triangle sont <b>concourantes</b> en un point I.',
      'I est à égale distance des trois côtés : c\'est le centre du <b>cercle inscrit</b>, qui <b>touche</b> les trois côtés.',
      'I est <b>toujours à l\'intérieur</b> du triangle, quelle que soit sa forme.',
      '<b>Inscrit</b> : dedans, tangent aux côtés, centre I (bissectrices). <b>Circonscrit</b> : par les sommets, centre O (médiatrices).'
    ],
    exemples: [
      'Construire le cercle inscrit : tracer <b>deux</b> bissectrices, leur point commun est I ; ' +
        'le rayon est la distance de I à un côté, mesurée perpendiculairement.',
      '\\( \\widehat{BAC} = 70^\\circ \\) : sa bissectrice fait deux angles de \\( 35^\\circ \\).',
      'M est sur la bissectrice de \\( \\widehat{BAC} \\) et à 2 cm de (AB) : il est aussi à 2 cm de (AC).'
    ]
  },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette (celle des trois leçons sœurs)                                */
    /* ==================================================================== */
    var INK = '#334155';     // les côtés du triangle
    var SOM = '#2563eb';     // les sommets
    var ANG = '#059669';     // l'angle mis en avant pendant l'étape
    var BIS = '#7c3aed';     // les bissectrices
    var COD = '#ea580c';     // le codage des demi-angles, les perpendiculaires, l'angle droit
    var INSC = '#dc2626';    // I et le cercle inscrit
    var CIRC = '#0d9488';    // la couche « cercle circonscrit »
    var MEDI = '#65a30d';    // la couche « médianes »
    var GUIDE = '#94a3b8';

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas »                       */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function segCurve(p0, p1, style) {
      var prog = { v: 0 };
      var c = board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0, function () { return prog.v; }
      ], Object.assign({ numberPointsHigh: 2, numberPointsLow: 2 }, style));
      return { curve: c, prog: prog };
    }
    function brisee(ptsFn, n, style) {
      return board.create('curve', [
        function (t) { return ptsFn()[Math.round(t)][0]; },
        function (t) { return ptsFn()[Math.round(t)][1]; },
        0, n - 1
      ], Object.assign({ numberPointsHigh: n, numberPointsLow: n }, style));
    }
    // Un arc de sommet V, du côté `de` vers le côté `a` (le court chemin),
    // dont on ne trace qu'une fraction prog.v : c'est l'angle qui s'allume.
    function arcCurve(i, r, style) {
      var prog = { v: 0 };
      var c = board.create('curve', [
        function (t) { var g = geomAngle(i); return g.V[0] + r * Math.cos(g.a1 + g.d * t); },
        function (t) { var g = geomAngle(i); return g.V[1] + r * Math.sin(g.a1 + g.d * t); },
        0, function () { return prog.v; }
      ], Object.assign({ numberPointsHigh: 40, numberPointsLow: 40 }, style));
      return { curve: c, prog: prog };
    }
    // Afficher / masquer, en mémorisant : dans JSXGraph, setAttribute déclenche
    // à lui seul une mise à jour complète du tableau.
    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }

    /* ==================================================================== */
    /* Petite algèbre vectorielle                                            */
    /* ==================================================================== */
    function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
    function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
    function mul(a, k) { return [a[0] * k, a[1] * k]; }
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
    function len(a) { return Math.sqrt(dot(a, a)); }
    function unit(a) { var n = len(a); return n < 1e-9 ? [0, 0] : [a[0] / n, a[1] / n]; }
    function fr(v) { return v.toFixed(2).replace('.', ','); }

    /* ==================================================================== */
    /* Le triangle : trois sommets déplaçables                               */
    /* ==================================================================== */
    /* Les cinq formes : I reste dedans dans les trois premières — c'est ce
       qu'on veut faire constater — et les deux dernières font coïncider les
       droites. */
    var FORMES = [
      { nom: 'à trois angles aigus', p: [[-4.2, -2.6], [4.2, -2.6], [0.8, 3.2]] },
      { nom: 'rectangle', p: [[-4, -2.8], [3.8, -2.8], [-4, 3.2]] },
      { nom: 'obtusangle', p: [[-5, -2], [5, -2], [-3.5, 0.8]] },
      { nom: 'isocèle', p: [[-3.4, -2.6], [3.4, -2.6], [0, 3.6]] },
      { nom: 'équilatéral', p: [[-3.46, -2], [3.46, -2], [0, 3.99]] }
    ];
    var forme = 0;

    var NOMS = ['A', 'B', 'C'];
    var OPP = [[1, 2], [2, 0], [0, 1]];      // le côté opposé à chaque sommet
    var DECAL = [[-16, -6], [14, -6], [0, 16]];

    var S = FORMES[0].p.map(function (p, i) {
      return board.create('point', p, {
        name: NOMS[i], size: 4, color: SOM, showInfobox: false,
        label: { offset: DECAL[i], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
      });
    });
    board.create('polygon', S, {
      fillColor: SOM, fillOpacity: 0.07, highlight: false,
      borders: { strokeColor: INK, strokeWidth: 2.5, highlight: false },
      vertices: { visible: true }
    });

    function P(i) { return [S[i].X(), S[i].Y()]; }
    function aire2() {
      var a = P(0), b = P(1), c = P(2);
      return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    }
    function aplati() { return Math.abs(aire2()) < 0.35; }
    function cote(i) { var o = OPP[i]; return len(sub(P(o[1]), P(o[0]))); }   // le côté opposé à i

    // L'angle au sommet i : son sommet, le cap du premier côté, le balayage
    // signé jusqu'au second (le court chemin : c'est l'angle du triangle).
    function geomAngle(i) {
      var o = OPP[i], V = P(i);
      var u = unit(sub(P(o[0]), V)), w = unit(sub(P(o[1]), V));
      var a1 = Math.atan2(u[1], u[0]), d = Math.atan2(w[1], w[0]) - a1;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      return { V: V, a1: a1, d: d, u: u, w: w };
    }
    // La direction de la bissectrice : la somme des deux unitaires des côtés.
    function dirBis(i) { var g = geomAngle(i); return unit(add(g.u, g.w)); }
    // Le point où la bissectrice issue de i coupe le côté opposé : il partage
    // ce côté dans le rapport des côtés adjacents (théorème de la bissectrice).
    function piedBis(i) {
      var o = OPP[i];
      var l0 = len(sub(P(o[1]), P(i))), l1 = len(sub(P(o[0]), P(i)));   // adjacents à o[0], o[1]
      if (l0 + l1 < 1e-9) return P(o[0]);
      return add(mul(P(o[0]), l0 / (l0 + l1)), mul(P(o[1]), l1 / (l0 + l1)));
    }
    // Le bout de la demi-droite tracée : un peu au-delà du côté opposé.
    function boutBis(i) { return add(piedBis(i), mul(dirBis(i), 0.9)); }

    /* Le centre du cercle inscrit : le point à égale distance des trois côtés,
       barycentre des sommets pondérés par les côtés opposés. */
    function inscrit() {
      var a = cote(0), b = cote(1), c = cote(2), s = a + b + c;
      if (s < 1e-9) return P(0);
      return mul(add(add(mul(P(0), a), mul(P(1), b)), mul(P(2), c)), 1 / s);
    }
    function projete(p, u, v) {
      var d = sub(v, u), den = dot(d, d);
      if (den < 1e-9) return u.slice();
      return add(u, mul(d, dot(sub(p, u), d) / den));
    }
    // Le point de contact du cercle inscrit avec le côté opposé à i.
    function contact(i) { var o = OPP[i]; return projete(inscrit(), P(o[0]), P(o[1])); }
    function distCote(i) { return len(sub(inscrit(), contact(i))); }
    function rayon() { return distCote(0); }

    /* ==================================================================== */
    /* Une bissectrice = l'angle allumé, la demi-droite, les deux demi-angles */
    /* ==================================================================== */
    var BS = [];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        // a) l'angle au sommet, mis en avant pendant son étape
        var langle = arcCurve(i, 1.15,
          { strokeColor: ANG, strokeWidth: 6, strokeOpacity: 0.45, highlight: false, visible: false });

        // b) la bissectrice, qui part DU SOMMET et traverse le triangle
        var ray = segCurve(function () { return P(i); }, function () { return boutBis(i); },
          { strokeColor: BIS, strokeWidth: 2.6, highlight: false, visible: false });

        // c) le codage des deux demi-angles égaux : deux arcs de même rayon,
        //    chacun barré d'un petit trait
        var code1 = brisee(function () { return demiArc(i, 0); }, 13,
          { strokeColor: COD, strokeWidth: 2.5, highlight: false, visible: false });
        var code2 = brisee(function () { return demiArc(i, 1); }, 13,
          { strokeColor: COD, strokeWidth: 2.5, highlight: false, visible: false });
        var tick1 = brisee(function () { return tickPts(i, 0); }, 2,
          { strokeColor: COD, strokeWidth: 2.5, highlight: false, visible: false });
        var tick2 = brisee(function () { return tickPts(i, 1); }, 2,
          { strokeColor: COD, strokeWidth: 2.5, highlight: false, visible: false });

        BS[i] = { angle: langle, ray: ray, code1: code1, code2: code2, tick1: tick1, tick2: tick2, etat: 0 };
      })(i);
    }
    var R_COD = 0.78;
    // Le demi-arc `moitie` (0 : du premier côté à la bissectrice ; 1 : de la
    // bissectrice au second côté), en 13 points.
    function demiArc(i, moitie) {
      var g = geomAngle(i), pts = [], k;
      var debut = g.a1 + (moitie ? g.d / 2 : 0);
      for (k = 0; k <= 12; k++) {
        var a = debut + g.d / 2 * k / 12;
        pts.push([g.V[0] + R_COD * Math.cos(a), g.V[1] + R_COD * Math.sin(a)]);
      }
      return pts;
    }
    // Le petit trait en travers du milieu de chaque demi-arc.
    function tickPts(i, moitie) {
      var g = geomAngle(i), a = g.a1 + g.d / 4 + (moitie ? g.d / 2 : 0);
      var u = [Math.cos(a), Math.sin(a)];
      return [add(g.V, mul(u, R_COD - 0.16)), add(g.V, mul(u, R_COD + 0.16))];
    }

    /* ==================================================================== */
    /* I, le halo qui se referme, les distances aux côtés, le cercle inscrit */
    /* ==================================================================== */
    var halo = { v: 0 };
    var haloC = board.create('curve', [
      function (t) { return inscrit()[0] + halo.v * Math.cos(t); },
      function (t) { return inscrit()[1] + halo.v * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: INSC, strokeWidth: 2, dash: 2, highlight: false, visible: false });

    var ptI = board.create('point',
      [function () { return inscrit()[0]; }, function () { return inscrit()[1]; }],
      { name: 'I', size: 5, color: INSC, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [12, 10], fontSize: 16, strokeColor: INSC,
                 cssStyle: 'font-weight:700' } });

    // Le cercle se referme : il se dessine d'un tour complet.
    var tour = { v: 0 };
    var cercle = board.create('curve', [
      function (t) { return inscrit()[0] + rayon() * Math.cos(t); },
      function (t) { return inscrit()[1] + rayon() * Math.sin(t); },
      function () { return -Math.PI / 2; },
      function () { return -Math.PI / 2 + 2 * Math.PI * tour.v; }
    ], { numberPointsHigh: 120, numberPointsLow: 120, strokeColor: INSC, strokeWidth: 2.6,
         highlight: false, visible: false });

    // Les trois distances de I aux côtés : des PERPENDICULAIRES, avec leur
    // petit carré. Ce sont elles qui disent pourquoi le cercle touche les trois
    // côtés — et que le rayon ne se mesure pas vers un sommet.
    var distances = [0, 1, 2].map(function (i) {
      return segCurve(function () { return inscrit(); }, function () { return contact(i); },
        { strokeColor: COD, strokeWidth: 1.5, dash: 2, highlight: false, visible: false });
    });
    var equerres = [0, 1, 2].map(function (i) {
      return brisee(function () { return equerrePts(i); }, 4,
        { strokeColor: COD, strokeWidth: 2, highlight: false, visible: false });
    });
    function equerrePts(i) {
      var o = OPP[i], c = contact(i), r = 0.3;
      var d = unit(sub(P(o[1]), P(o[0])));
      // vers I, et le long du côté dans le sens qui reste dans le segment
      var versI = unit(sub(inscrit(), c));
      var u = mul(d, dot(d, sub(P(o[1]), c)) >= 0 ? r : -r), v = mul(versI, r);
      return [add(c, u), add(add(c, u), v), add(c, v), c];
    }

    /* ==================================================================== */
    /* Les couches « cercle circonscrit » et « médianes »                     */
    /* ==================================================================== */
    /* Le cercle circonscrit est là pour la comparaison qui fait la leçon : O
       sort du triangle dès qu'un angle est obtus, I jamais. Les médianes, pour
       voir que dans un triangle isocèle ou équilatéral les droites se
       confondent — et qu'ailleurs elles n'ont rien à voir. */
    function circonscrit() {
      var a = P(0), b = P(1), c = P(2);
      var d = 2 * ((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
      if (Math.abs(d) < 1e-9) return a;
      var na = dot(a, a), nb = dot(b, b), nc = dot(c, c);
      return [((nb - na) * (c[1] - a[1]) - (nc - na) * (b[1] - a[1])) / d,
              ((nc - na) * (b[0] - a[0]) - (nb - na) * (c[0] - a[0])) / d];
    }
    function milieu(i) { var o = OPP[i]; return mul(add(P(o[0]), P(o[1])), 0.5); }
    var mediatrices = [0, 1, 2].map(function (i) {
      var o = OPP[i];
      return board.create('line', [
        board.create('point', [function () { return milieu(i)[0]; }, function () { return milieu(i)[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [
          function () { var d = unit(sub(P(o[1]), P(o[0]))); return milieu(i)[0] - d[1]; },
          function () { var d = unit(sub(P(o[1]), P(o[0]))); return milieu(i)[1] + d[0]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: CIRC, strokeWidth: 1.4, dash: 3, fixed: true, highlight: false, visible: false });
    });
    var ptO = board.create('point',
      [function () { return circonscrit()[0]; }, function () { return circonscrit()[1]; }],
      { name: 'O', size: 4, color: CIRC, fixed: true, visible: false, highlight: false, showInfobox: false,
        label: { offset: [10, -18], fontSize: 15, strokeColor: CIRC, cssStyle: 'font-weight:700' } });
    var cercleO = board.create('curve', [
      function (t) { return circonscrit()[0] + len(sub(circonscrit(), P(0))) * Math.cos(t); },
      function (t) { return circonscrit()[1] + len(sub(circonscrit(), P(0))) * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: CIRC, strokeWidth: 1.8, dash: 3, highlight: false, visible: false });
    var medianes = [0, 1, 2].map(function (i) {
      return board.create('segment', [
        board.create('point', [function () { return P(i)[0]; }, function () { return P(i)[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return milieu(i)[0]; }, function () { return milieu(i)[1]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: MEDI, strokeWidth: 1.8, dash: 3, fixed: true, highlight: false, visible: false });
    });
    var voirCirc = false, voirMedianes = false;

    /* ==================================================================== */
    /* Le bandeau : ce que la figure montre, en direct                       */
    /* ==================================================================== */
    function egaux(u, v) { return Math.abs(u - v) < 0.008 * (u + v); }
    function angles() {
      return [0, 1, 2].map(function (i) {
        var g = geomAngle(i);
        return Math.abs(g.d) * 180 / Math.PI;
      });
    }
    function droit() {
      var a = angles();
      for (var i = 0; i < 3; i++) if (Math.abs(a[i] - 90) < 0.6) return i;
      return -1;
    }
    function obtus() {
      var a = angles();
      for (var i = 0; i < 3; i++) if (a[i] > 90.6) return i;
      return -1;
    }

    function bandeauTxt() {
      if (aplati()) {
        return 'Les trois points sont presque alignés : ce n\'est plus un triangle. ' +
               'Écarte un sommet.';
      }
      var a = cote(0), b = cote(1), c = cote(2);
      if (egaux(a, b) && egaux(b, c)) {
        return 'Triangle équilatéral : les trois bissectrices sont aussi les médiatrices, les ' +
               'hauteurs et les médianes. I, O, G et H sont CONFONDUS.';
      }
      var iso = egaux(a, b) ? 2 : egaux(b, c) ? 0 : egaux(a, c) ? 1 : -1;
      if (iso >= 0) {
        return 'Triangle isocèle en ' + NOMS[iso] + ' : la bissectrice de l\'angle ' + NOMS[iso] +
               ' est aussi hauteur, médiane et médiatrice de la base. I est dessus, O aussi.';
      }
      var d = droit();
      if (d >= 0) {
        return 'Triangle rectangle en ' + NOMS[d] + ' : I reste À L\'INTÉRIEUR, alors que O, ' +
               'lui, est au milieu de l\'hypoténuse.';
      }
      var ob = obtus();
      if (ob >= 0) {
        return 'L\'angle en ' + NOMS[ob] + ' est obtus : I reste À L\'INTÉRIEUR du triangle, ' +
               'alors que O en sort. Une bissectrice part d\'un sommet et entre dans l\'angle.';
      }
      return 'Les trois angles sont aigus : I est à l\'INTÉRIEUR du triangle — il l\'est ' +
             'toujours, quelle que soit la forme.';
    }
    var bandeau = board.create('text', [-7.7, 5.4, bandeauTxt],
      { fontSize: 15, color: INSC, strokeColor: INSC, cssStyle: 'font-weight:600',
        fixed: true, visible: false });

    // La vérification, en direct : les trois distances aux côtés sont-elles égales ?
    var noteRayons = board.create('text', [-7.7, -5.3, function () {
      return 'd(I, [BC]) = ' + fr(distCote(0)) + '   d(I, [CA]) = ' + fr(distCote(1)) +
             '   d(I, [AB]) = ' + fr(distCote(2)) + '  — trois distances égales : ' +
             'un seul cercle, tangent aux trois côtés.';
    }], { fontSize: 14, color: INSC, strokeColor: INSC, cssStyle: 'font-weight:600',
          fixed: true, visible: false });

    var noteCouches = board.create('text', [-7.7, -4.15, function () {
      if (!voirCirc && !voirMedianes) return '';
      var t = [];
      if (voirCirc) t.push('en vert : le CERCLE CIRCONSCRIT, ses médiatrices, O');
      if (voirMedianes) t.push('en vert clair : les MÉDIANES');
      var a = cote(0), b = cote(1), c = cote(2);
      var suite = (egaux(a, b) && egaux(b, c))
        ? ' — tout se confond, et O = I.'
        : (egaux(a, b) || egaux(b, c) || egaux(a, c))
          ? ' — une seule se confond avec une bissectrice : au sommet principal.'
          : ' — rien ne se confond' + (voirCirc ? ', et O n\'est pas I' : '') + '.';
      return t.join(' ; ') + suite;
    }], { fontSize: 14, color: CIRC, strokeColor: CIRC, cssStyle: 'font-weight:600',
          fixed: true, visible: false });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    var fini = false;                 // I a-t-il été révélé ?

    function rafraichir() {
      var ok = !aplati();
      BS.forEach(function (b) {
        show(b.ray.curve, b.etat >= 2 && ok);
        show(b.code1, b.etat >= 2 && ok);
        show(b.code2, b.etat >= 2 && ok);
        show(b.tick1, b.etat >= 2 && ok);
        show(b.tick2, b.etat >= 2 && ok);
      });
      show(ptI, fini && ok);
      distances.forEach(function (d) { show(d.curve, fini && ok && d.prog.v > 0.02); });
      equerres.forEach(function (e, i) { show(e, fini && ok && distances[i].prog.v > 0.98); });
      show(cercle, ok && tour.v > 0.01);
      mediatrices.forEach(function (m) { show(m, voirCirc && ok); });
      show(ptO, voirCirc && ok);
      show(cercleO, voirCirc && ok);
      medianes.forEach(function (m) { show(m, voirMedianes && ok); });
      show(noteRayons, fini && ok && tour.v > 0.9);
      show(noteCouches, (voirCirc || voirMedianes) && ok);
      var col = aplati() ? GUIDE : INSC;
      if (bandeau.__col !== col) {
        bandeau.__col = col;
        bandeau.setAttribute({ strokeColor: col });
      }
      board.update();
    }
    S.forEach(function (p) { p.on('drag', rafraichir); });

    /* ==================================================================== */
    /* États : effacer / jouer l'animation                                   */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      fini = false;
      halo.v = 0;
      tour.v = 0;
      show(haloC, false);
      BS.forEach(function (b) {
        b.etat = 0;
        b.angle.prog.v = 0;
        b.ray.prog.v = 0;
        b.angle.curve.setAttribute({ strokeOpacity: 0.45 });
        [b.angle.curve, b.ray.curve, b.code1, b.code2, b.tick1, b.tick2]
          .forEach(function (o) { show(o, false); });
      });
      distances.forEach(function (d) { d.prog.v = 0; });
      show(ptI, false);
      show(cercle, false);
      show(bandeau, false);
      show(noteRayons, false);
      rafraichir();
    }

    function tout() {
      anim.cancel();
      BS.forEach(function (b) {
        b.etat = 2;
        b.angle.prog.v = 1;
        b.angle.curve.setAttribute({ strokeOpacity: 0.18 });
        show(b.angle.curve, true);
        b.ray.prog.v = 1;
      });
      distances.forEach(function (d) { d.prog.v = 1; });
      halo.v = 0;
      tour.v = 1;
      fini = true;
      show(haloC, false);
      show(bandeau, true);
      rafraichir();
    }

    function jouer() {
      effacer();
      var steps = [];
      [0, 1, 2].forEach(function (i) {
        // 1. l'angle au sommet s'allume : c'est lui qu'on va partager
        steps.push({
          dur: 450,
          step: function (p) {
            BS[i].angle.prog.v = p;
            show(BS[i].angle.curve, true);
          },
          after: function () { BS[i].etat = 1; rafraichir(); }
        });
        // 2. la bissectrice descend du sommet, les deux demi-angles sont codés
        steps.push({
          dur: 800,
          step: function (p) {
            BS[i].ray.prog.v = p;
            BS[i].etat = 2;
            show(BS[i].ray.curve, true);
            [BS[i].code1, BS[i].code2, BS[i].tick1, BS[i].tick2].forEach(function (o) { show(o, true); });
          },
          after: function () {
            BS[i].angle.curve.setAttribute({ strokeOpacity: 0.18 });
            rafraichir();
          }
        });
      });
      // 3. les trois bissectrices passent par un même point
      steps.push({
        dur: 900,
        step: function (p) { halo.v = 1.8 * (1 - p); show(haloC, true); },
        after: function () {
          halo.v = 0;
          show(haloC, false);
          fini = true;
          show(bandeau, true);
          rafraichir();
        }
      });
      // 4. les trois distances aux côtés — perpendiculaires —, puis le cercle
      //    qui se referme en les touchant
      steps.push({
        dur: 500,
        step: function (p) { distances.forEach(function (d) { d.prog.v = p; }); rafraichir(); }
      });
      steps.push({
        dur: 900,
        step: function (p) { tour.v = p; rafraichir(); }
      });
      anim.runSteps(steps, effacer);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'forme', label: '🔺 Changer de triangle', onClick: function () {
          forme = (forme + 1) % FORMES.length;
          effacer();
          FORMES[forme].p.forEach(function (p, i) { S[i].moveTo(p, 350); });
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 420);
        } },
      { type: 'button', id: 'all', label: 'Tout afficher', onClick: tout },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'circ', label: 'Cercle circonscrit (médiatrices)', checked: false,
        onChange: function (v) { voirCirc = v; rafraichir(); } },
      { type: 'checkbox', id: 'medi', label: 'Les médianes', checked: false,
        onChange: function (v) { voirMedianes = v; rafraichir(); } }
    ]);

    jouer();
  }
});
