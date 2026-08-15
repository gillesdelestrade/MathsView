/*
 * Les médiatrices d'un triangle et le cercle circonscrit (5ème).
 *
 * ---------------------------------------------------------------------------
 * La troisième d'une famille
 * ---------------------------------------------------------------------------
 * Construite comme « Les hauteurs d'un triangle » et « Les médianes d'un
 * triangle », pour que les trois se lisent ensemble : même figure, même déroulé,
 * même bandeau. Ce qui change est ce qu'on va chercher sur le côté — non plus le
 * pied d'une perpendiculaire, non plus le milieu, mais la droite qui est À LA
 * FOIS perpendiculaire au côté ET passe par son milieu.
 *
 * L'animation trace les médiatrices UNE PAR UNE, chacune en deux temps :
 *   1. le côté s'allume, son MILIEU apparaît avec le codage des deux demi-côtés
 *      égaux, et le petit carré de l'angle droit ;
 *   2. la médiatrice s'ouvre de part et d'autre de ce milieu.
 * Puis les trois droites se révèlent concourantes en O, et le CERCLE CIRCONSCRIT
 * se referme en passant par les trois sommets.
 *
 * ---------------------------------------------------------------------------
 * Pourquoi les triangles particuliers sont le vrai sujet
 * ---------------------------------------------------------------------------
 * La position de O ne se retient pas, elle se constate — et elle dépend de la
 * forme du triangle. Le bouton parcourt les cinq cas, et c'est là que la leçon
 * se joue :
 *
 *   ACUTANGLE     O est À L'INTÉRIEUR du triangle.
 *   RECTANGLE     O est le MILIEU DE L'HYPOTÉNUSE, et le cercle circonscrit a
 *                 donc l'hypoténuse pour DIAMÈTRE. C'est la propriété à retenir.
 *   OBTUSANGLE    O est À L'EXTÉRIEUR du triangle — une médiatrice n'a aucune
 *                 raison de rester dedans, elle n'part d'aucun sommet.
 *   ISOCÈLE       la médiatrice de la base est aussi la hauteur, la médiane et
 *                 la bissectrice issues du sommet principal : UNE seule droite
 *                 pour quatre rôles. O est dessus.
 *   ÉQUILATÉRAL   les trois médiatrices sont aussi les trois hauteurs et les
 *                 trois médianes : O, G, H et I sont CONFONDUS.
 *
 * Les deux cases « Les hauteurs » et « Les médianes » superposent ces droites-là
 * à la figure. C'est le seul moyen honnête de faire voir une coïncidence : on ne
 * l'affirme pas, on montre les deux tracés et on constate qu'ils se confondent —
 * puis on déplace un sommet et on les voit se séparer.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 *   - la MÉDIATRICE d'un côté est la droite qui passe par son milieu,
 *     perpendiculairement à lui : milieu (P+Q)/2, direction la normale à PQ ;
 *   - le CENTRE DU CERCLE CIRCONSCRIT est le point équidistant des trois
 *     sommets. Il est obtenu en résolvant ce système, pas en cherchant une
 *     intersection à l'écran : la concourance est donc une CONSÉQUENCE, que la
 *     figure se contente de rendre visible ;
 *   - le RAYON est la distance de O à n'importe lequel des trois sommets — et
 *     le bandeau vérifie en direct que les trois donnent bien la même valeur.
 */
MathsView.register({
  id: 'mediatrices-triangle',
  title: 'Les médiatrices et le cercle circonscrit',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — médiatrices d\'un triangle et cercle circonscrit',
  exercices: ['mediatrices'],
  description:
    'La <strong>médiatrice</strong> d\'un côté est la droite <strong>perpendiculaire</strong> ' +
    'à ce côté qui passe par son <strong>milieu</strong>. Ses points sont exactement ceux ' +
    'qui sont à <strong>égale distance</strong> des deux extrémités.' +
    '<br>Les trois médiatrices d\'un triangle sont <strong>concourantes</strong> en un point ' +
    '\\(O\\) — à égale distance des trois sommets, donc centre d\'un cercle qui passe par ' +
    'les trois : le <strong>cercle circonscrit</strong>.' +
    '<br><strong>Change de triangle</strong> : selon sa forme, \\(O\\) tombe dedans, dehors, ' +
    'ou pile sur un côté. Et coche <strong>Les hauteurs</strong> ou <strong>Les médianes</strong> ' +
    'pour voir, dans un triangle isocèle ou équilatéral, ces droites se confondre.',
  notes:
    '<ul>' +
    '<li><strong>La définition.</strong> La médiatrice de \\([AB]\\) est la droite ' +
    'perpendiculaire à \\([AB]\\) passant par son milieu. Un point est dessus ' +
    '<em>si et seulement si</em> il est à égale distance de \\(A\\) et de \\(B\\).</li>' +
    '<li><strong>Pourquoi elles se coupent en un seul point.</strong> Le point commun aux ' +
    'médiatrices de \\([AB]\\) et de \\([BC]\\) est à égale distance de \\(A\\) et \\(B\\), ' +
    'et à égale distance de \\(B\\) et \\(C\\) : il est donc à égale distance de \\(A\\) et ' +
    'de \\(C\\), et se trouve <em>forcément</em> sur la troisième médiatrice. La concourance ' +
    'n\'est pas un hasard, elle se démontre en deux lignes.</li>' +
    '<li><strong>Le cercle circonscrit.</strong> \\(OA = OB = OC\\) : le cercle de centre ' +
    '\\(O\\) et de rayon \\(OA\\) passe par les trois sommets. Il est unique.</li>' +
    '<li><strong>Triangle rectangle.</strong> \\(O\\) est le <strong>milieu de ' +
    'l\'hypoténuse</strong> : le cercle circonscrit a l\'hypoténuse pour <strong>diamètre' +
    '</strong>. Autrement dit, dans un triangle rectangle, la médiane issue de l\'angle ' +
    'droit vaut la moitié de l\'hypoténuse.</li>' +
    '<li><strong>Où tombe \\(O\\).</strong> Triangle à trois angles aigus : \\(O\\) est ' +
    '<em>dedans</em>. Triangle rectangle : \\(O\\) est <em>sur</em> l\'hypoténuse. Triangle ' +
    'ayant un angle obtus : \\(O\\) est <em>dehors</em>. Une médiatrice ne part d\'aucun ' +
    'sommet : rien ne l\'oblige à rester dans le triangle.</li>' +
    '<li><strong>Triangle isocèle.</strong> La médiatrice de la base passe par le sommet ' +
    'principal : elle y est aussi hauteur, médiane et bissectrice. Une seule droite, quatre ' +
    'rôles — c\'est l\'axe de symétrie du triangle.</li>' +
    '<li><strong>Triangle équilatéral.</strong> Les trois médiatrices sont aussi les trois ' +
    'hauteurs, médianes et bissectrices : le centre du cercle circonscrit, celui du cercle ' +
    'inscrit, le centre de gravité et l\'orthocentre sont <strong>confondus</strong>. C\'est ' +
    'le seul triangle où cela arrive.</li>' +
    '<li><strong>Ne pas confondre.</strong> Une médiatrice concerne un <em>côté</em> ; une ' +
    'hauteur et une médiane partent d\'un <em>sommet</em>. Dans un triangle quelconque, ' +
    'elles n\'ont rien à voir : coche les cases et déplace un sommet pour le voir.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette (celle des deux leçons sœurs)                                 */
    /* ==================================================================== */
    var INK = '#334155';     // les côtés du triangle
    var SOM = '#2563eb';     // les sommets
    var COTE = '#059669';    // le côté mis en avant pendant l'étape
    var MED = '#7c3aed';     // les médiatrices
    var MIL = '#ea580c';     // les milieux, leur codage, l'angle droit
    var CIRC = '#dc2626';    // O et le cercle circonscrit
    var HAUT = '#0891b2';    // la couche « hauteurs »
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
    /* Les cinq formes ne sont pas décoratives : ce sont les cinq positions
       possibles de O, et c'est tout le sujet de la leçon. */
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

    // Le milieu du côté opposé au sommet i — celui dont on trace la médiatrice.
    function milieu(i) { var o = OPP[i]; return mul(add(P(o[0]), P(o[1])), 0.5); }
    // La direction du côté opposé, et sa normale : celle de la médiatrice.
    function dirCote(i) { var o = OPP[i]; return unit(sub(P(o[1]), P(o[0]))); }
    function normale(i) { var d = dirCote(i); return [-d[1], d[0]]; }
    function cote(i) { var o = OPP[i]; return len(sub(P(o[1]), P(o[0]))); }

    /* Le centre du cercle circonscrit : le point équidistant des trois sommets.
       On résout le système des deux médiatrices — la troisième s'y trouve
       forcément, et c'est bien le fond de la leçon. */
    function circonscrit() {
      var a = P(0), b = P(1), c = P(2);
      var d = 2 * ((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
      if (Math.abs(d) < 1e-9) return a;
      var na = dot(a, a), nb = dot(b, b), nc = dot(c, c);
      return [((nb - na) * (c[1] - a[1]) - (nc - na) * (b[1] - a[1])) / d,
              ((nc - na) * (b[0] - a[0]) - (nb - na) * (c[0] - a[0])) / d];
    }
    function rayon() { return len(sub(circonscrit(), P(0))); }

    /* ==================================================================== */
    /* Une médiatrice = le côté, son milieu codé, l'angle droit, la droite    */
    /* ==================================================================== */
    // Assez longue pour traverser tout le cadre, quelle que soit la forme.
    var PORTEE = 13;

    var MS = [];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var o = OPP[i];

        // a) le côté concerné, mis en avant pendant son étape
        var lecote = segCurve(function () { return P(o[0]); }, function () { return P(o[1]); },
          { strokeColor: COTE, strokeWidth: 5, strokeOpacity: 0.45, highlight: false,
            visible: false });

        // b) son milieu, et le codage des deux demi-côtés égaux
        var ptMil = board.create('point',
          [function () { return milieu(i)[0]; }, function () { return milieu(i)[1]; }],
          { name: '', size: 4, color: MIL, fixed: true, visible: false,
            highlight: false, showInfobox: false });
        var code1 = brisee(function () { return codePts(i, 0); }, 2,
          { strokeColor: MIL, strokeWidth: 2.5, highlight: false, visible: false });
        var code2 = brisee(function () { return codePts(i, 1); }, 2,
          { strokeColor: MIL, strokeWidth: 2.5, highlight: false, visible: false });

        // c) le petit carré de l'angle droit, au milieu du côté
        var equerre = brisee(function () { return equerrePts(i); }, 4,
          { strokeColor: MIL, strokeWidth: 2.2, highlight: false, visible: false });

        // d) la médiatrice, qui s'ouvre DE PART ET D'AUTRE du milieu : c'est le
        //    geste qui dit qu'elle ne part d'aucun sommet.
        var haut = segCurve(function () { return milieu(i); },
          function () { return add(milieu(i), mul(normale(i), PORTEE)); },
          { strokeColor: MED, strokeWidth: 2.6, highlight: false, visible: false });
        var bas = segCurve(function () { return milieu(i); },
          function () { return add(milieu(i), mul(normale(i), -PORTEE)); },
          { strokeColor: MED, strokeWidth: 2.6, highlight: false, visible: false });

        MS[i] = { cote: lecote, mil: ptMil, code1: code1, code2: code2, equerre: equerre,
                  haut: haut, bas: bas, etat: 0 };
      })(i);
    }

    // Le codage du milieu : un trait en travers de chaque demi-côté.
    function codePts(i, moitie) {
      var o = OPP[i], m = milieu(i), bout = P(o[moitie]);
      var c = mul(add(m, bout), 0.5);
      var d = unit(sub(m, bout)), n = [-d[1], d[0]];
      return [add(c, mul(n, 0.24)), add(c, mul(n, -0.24))];
    }
    // Le petit carré : posé au milieu, entre le côté et la médiatrice.
    function equerrePts(i) {
      var m = milieu(i), r = 0.42;
      var u = mul(dirCote(i), r), v = mul(normale(i), r);
      return [add(m, u), add(add(m, u), v), add(m, v), m];
    }

    /* ==================================================================== */
    /* O, le halo qui se referme, et le cercle circonscrit                   */
    /* ==================================================================== */
    var halo = { v: 0 };
    var haloC = board.create('curve', [
      function (t) { return circonscrit()[0] + halo.v * Math.cos(t); },
      function (t) { return circonscrit()[1] + halo.v * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: CIRC, strokeWidth: 2, dash: 2, highlight: false, visible: false });

    var ptO = board.create('point',
      [function () { return circonscrit()[0]; }, function () { return circonscrit()[1]; }],
      { name: 'O', size: 5, color: CIRC, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [12, 10], fontSize: 16, strokeColor: CIRC,
                 cssStyle: 'font-weight:700' } });

    // Le cercle se referme : il se dessine d'un tour complet.
    var tour = { v: 0 };
    var cercle = board.create('curve', [
      function (t) { return circonscrit()[0] + rayon() * Math.cos(t); },
      function (t) { return circonscrit()[1] + rayon() * Math.sin(t); },
      function () { return -Math.PI / 2; },
      function () { return -Math.PI / 2 + 2 * Math.PI * tour.v; }
    ], { numberPointsHigh: 120, numberPointsLow: 120, strokeColor: CIRC, strokeWidth: 2.6,
         highlight: false, visible: false });

    // Les trois rayons OA, OB, OC : ce sont eux qui disent pourquoi le cercle
    // passe par les trois sommets.
    var rayons = [0, 1, 2].map(function (i) {
      return segCurve(function () { return circonscrit(); }, function () { return P(i); },
        { strokeColor: CIRC, strokeWidth: 1.5, dash: 2, highlight: false, visible: false });
    });

    /* ==================================================================== */
    /* Les couches « hauteurs » et « médianes »                              */
    /* ==================================================================== */
    /* Elles ne sont pas là pour décorer : dans un triangle isocèle ou
       équilatéral, elles viennent se confondre avec les médiatrices, et c'est
       en les superposant qu'on le CONSTATE — puis en déplaçant un sommet qu'on
       les voit se séparer. */
    function projete(p, u, v) {
      var d = sub(v, u), den = dot(d, d);
      if (den < 1e-9) return u.slice();
      return add(u, mul(d, dot(sub(p, u), d) / den));
    }
    var hauteurs = [0, 1, 2].map(function (i) {
      var o = OPP[i];
      function pied() { return projete(P(i), P(o[0]), P(o[1])); }
      return board.create('line', [
        board.create('point', [function () { return P(i)[0]; }, function () { return P(i)[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return pied()[0]; }, function () { return pied()[1]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: HAUT, strokeWidth: 1.6, dash: 3, fixed: true,
           highlight: false, visible: false });
    });
    var medianes = [0, 1, 2].map(function (i) {
      return board.create('segment', [
        board.create('point', [function () { return P(i)[0]; }, function () { return P(i)[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return milieu(i)[0]; },
                               function () { return milieu(i)[1]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: MEDI, strokeWidth: 1.8, dash: 3, fixed: true,
           highlight: false, visible: false });
    });
    var voirHauteurs = false, voirMedianes = false;

    /* ==================================================================== */
    /* Le bandeau : ce que la figure montre, en direct                       */
    /* ==================================================================== */
    function egaux(u, v) { return Math.abs(u - v) < 0.008 * (u + v); }
    // Les angles du triangle, pour savoir où tombe O.
    function angles() {
      return [0, 1, 2].map(function (i) {
        var o = OPP[i];
        var u = unit(sub(P(o[0]), P(i))), v = unit(sub(P(o[1]), P(i)));
        return Math.acos(Math.max(-1, Math.min(1, dot(u, v)))) * 180 / Math.PI;
      });
    }
    function droit() {                       // l'indice du sommet à angle droit
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
        return 'Triangle équilatéral : les trois médiatrices sont aussi les hauteurs et les ' +
               'médianes. O, G, H et I sont CONFONDUS.';
      }
      var d = droit();
      if (d >= 0) {
        var o = OPP[d];
        return 'Triangle rectangle en ' + NOMS[d] + ' : O est le MILIEU de l\'hypoténuse [' +
               NOMS[o[0]] + NOMS[o[1]] + ']. Le cercle circonscrit a l\'hypoténuse pour ' +
               'DIAMÈTRE.';
      }
      var iso = egaux(a, b) ? 2 : egaux(b, c) ? 0 : egaux(a, c) ? 1 : -1;
      if (iso >= 0) {
        return 'Triangle isocèle en ' + NOMS[iso] + ' : la médiatrice de la base passe par ' +
               NOMS[iso] + '. Elle y est aussi hauteur, médiane et bissectrice.';
      }
      var ob = obtus();
      if (ob >= 0) {
        return 'L\'angle en ' + NOMS[ob] + ' est obtus : O tombe À L\'EXTÉRIEUR du triangle. ' +
               'Une médiatrice ne part d\'aucun sommet, rien ne la retient dedans.';
      }
      return 'Les trois angles sont aigus : O est à l\'INTÉRIEUR du triangle.';
    }
    var bandeau = board.create('text', [-7.7, 5.4, bandeauTxt],
      { fontSize: 15, color: CIRC, strokeColor: CIRC, cssStyle: 'font-weight:600',
        fixed: true, visible: false });

    // La vérification, en direct : les trois rayons sont-ils bien égaux ?
    var noteRayons = board.create('text', [-7.7, -5.3, function () {
      var O = circonscrit();
      return 'OA = ' + fr(len(sub(O, P(0)))) + '   OB = ' + fr(len(sub(O, P(1)))) +
             '   OC = ' + fr(len(sub(O, P(2)))) + '  — trois distances égales, ' +
             'donc un seul cercle.';
    }], { fontSize: 14, color: CIRC, strokeColor: CIRC, cssStyle: 'font-weight:600',
          fixed: true, visible: false });

    var noteCouches = board.create('text', [-7.7, -4.55, function () {
      if (!voirHauteurs && !voirMedianes) return '';
      var t = [];
      if (voirHauteurs) t.push('en bleu les HAUTEURS');
      if (voirMedianes) t.push('en vert les MÉDIANES');
      var a = cote(0), b = cote(1), c = cote(2);
      var suite = (egaux(a, b) && egaux(b, c))
        ? ' — elles se confondent toutes avec les médiatrices.'
        : (egaux(a, b) || egaux(b, c) || egaux(a, c))
          ? ' — une seule se confond avec une médiatrice : celle du sommet principal.'
          : ' — aucune ne se confond avec une médiatrice.';
      return t.join(', ') + suite;
    }], { fontSize: 14, color: HAUT, strokeColor: HAUT, cssStyle: 'font-weight:600',
          fixed: true, visible: false });

    /* ==================================================================== */
    /* Rafraîchissement                                                      */
    /* ==================================================================== */
    var fini = false;                 // O a-t-il été révélé ?

    function rafraichir() {
      var ok = !aplati();
      MS.forEach(function (m) {
        show(m.mil, m.etat >= 1 && ok);
        show(m.code1, m.etat >= 1 && ok);
        show(m.code2, m.etat >= 1 && ok);
        show(m.equerre, m.etat >= 2 && ok);
        show(m.haut.curve, m.etat >= 2 && ok);
        show(m.bas.curve, m.etat >= 2 && ok);
      });
      show(ptO, fini && ok);
      rayons.forEach(function (r) { show(r.curve, fini && ok && tour.v > 0.05); });
      show(cercle, ok && tour.v > 0.01);
      hauteurs.forEach(function (h) { show(h, voirHauteurs && ok); });
      medianes.forEach(function (m) { show(m, voirMedianes && ok); });
      show(noteRayons, fini && ok && tour.v > 0.9);
      show(noteCouches, (voirHauteurs || voirMedianes) && ok);
      var col = aplati() ? GUIDE : CIRC;
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
      MS.forEach(function (m) {
        m.etat = 0;
        m.cote.prog.v = 0;
        m.haut.prog.v = 0;
        m.bas.prog.v = 0;
        m.cote.curve.setAttribute({ strokeOpacity: 0.45 });
        [m.cote.curve, m.mil, m.code1, m.code2, m.equerre, m.haut.curve, m.bas.curve]
          .forEach(function (o) { show(o, false); });
      });
      rayons.forEach(function (r) { r.prog.v = 0; });
      show(ptO, false);
      show(cercle, false);
      show(bandeau, false);
      show(noteRayons, false);
      rafraichir();
    }

    function tout() {
      anim.cancel();
      MS.forEach(function (m) {
        m.etat = 2;
        m.cote.prog.v = 1;
        m.cote.curve.setAttribute({ strokeOpacity: 0.18 });
        m.haut.prog.v = 1;
        m.bas.prog.v = 1;
      });
      rayons.forEach(function (r) { r.prog.v = 1; });
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
        // 1. le côté s'allume, son milieu apparaît, les demi-côtés sont codés
        steps.push({
          dur: 450,
          step: function (p) {
            MS[i].cote.prog.v = p;
            show(MS[i].cote.curve, true);
          },
          after: function () { MS[i].etat = 1; rafraichir(); }
        });
        // 2. la médiatrice s'ouvre de part et d'autre du milieu
        steps.push({
          dur: 800,
          step: function (p) {
            MS[i].haut.prog.v = p;
            MS[i].bas.prog.v = p;
            MS[i].etat = 2;
            show(MS[i].haut.curve, true);
            show(MS[i].bas.curve, true);
            show(MS[i].equerre, true);
          },
          after: function () {
            MS[i].cote.curve.setAttribute({ strokeOpacity: 0.18 });
            rafraichir();
          }
        });
      });
      // 3. les trois médiatrices passent par un même point
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
      // 4. les trois rayons, puis le cercle qui se referme dessus
      steps.push({
        dur: 500,
        step: function (p) { rayons.forEach(function (r) { r.prog.v = p; }); rafraichir(); }
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
      { type: 'checkbox', id: 'haut', label: 'Les hauteurs', checked: false,
        onChange: function (v) { voirHauteurs = v; rafraichir(); } },
      { type: 'checkbox', id: 'medi', label: 'Les médianes', checked: false,
        onChange: function (v) { voirMedianes = v; rafraichir(); } }
    ]);

    jouer();
  }
});
