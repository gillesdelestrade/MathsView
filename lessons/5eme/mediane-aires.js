/*
 * Une médiane partage le triangle en deux triangles de même aire (5ème).
 *
 * C'est une DÉMONSTRATION, pas une constatation : la figure ne se contente pas
 * de montrer que les deux morceaux se ressemblent, elle déroule l'argument.
 *
 *   1. l'aire d'un triangle vaut (base × hauteur) ÷ 2. On trace la hauteur h
 *      issue de A, avec son angle droit, et l'on écrit S = (BC × h) ÷ 2 ;
 *   2. A' est le milieu de [BC] : les deux demi-côtés sont codés égaux, et
 *      BA' = A'C = BC ÷ 2 ;
 *   3. on COUPE le long de la médiane et l'on ÉCARTE les deux morceaux, pour
 *      qu'ils deviennent deux triangles qu'on regarde chacun pour soi ;
 *   4. dans chacun on retrace la hauteur : c'est la MÊME. Deux droites
 *      parallèles apparaissent alors — celle qui porte les deux bases et celle
 *      qui passe par les deux sommets — et l'égalité des deux hauteurs se voit
 *      d'un coup d'œil, sans calcul ;
 *   5. il reste S1 = (BA' × h) ÷ 2 et S2 = (A'C × h) ÷ 2, deux produits faits
 *      des mêmes nombres : S1 = S2 = S ÷ 2.
 *
 * POURQUOI ÉCARTER LE LONG DE (BC), et pas dans une autre direction. Une
 * translation le long d'une droite laisse cette droite en place : en glissant
 * les deux morceaux parallèlement à (BC), les deux bases restent portées par la
 * MÊME droite et les deux sommets restent sur la MÊME parallèle. C'est ce qui
 * permet de dessiner les deux droites parallèles de l'étape 4 et de rendre
 * l'égalité des hauteurs évidente. Écarter dans n'importe quelle autre
 * direction aurait cassé l'argument, ou obligé à le remplacer par du calcul.
 *
 * CE QUI RESTE VRAI QUAND ON DÉPLACE UN SOMMET. Toutes les longueurs et toutes
 * les aires du panneau sont recalculées à partir des trois sommets ; on peut
 * donc déformer le triangle autant qu'on veut, les deux aires restent égales.
 * La hauteur d'un des deux morceaux peut alors tomber EN DEHORS de sa base
 * (comme dans la leçon « Les hauteurs d'un triangle ») : le côté est prolongé
 * en pointillés, et cela ne change rien à la démonstration, puisque la hauteur
 * est la distance du sommet à la droite qui porte la base.
 */
MathsView.register({
  id: 'mediane-aires',
  title: 'Une médiane partage le triangle en deux aires égales',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — démontrer avec les aires',
  exercices: ['medianes'],
  description:
    'Pourquoi une <strong>médiane</strong> coupe-t-elle un triangle en deux morceaux de ' +
    '<strong>même aire</strong> ? Ce n\'est pas parce qu\'ils « se ressemblent » : ça se ' +
    '<strong>démontre</strong>, avec la formule de l\'aire d\'un triangle. ' +
    '<br>Clique sur <strong>Lancer la démonstration</strong> : la hauteur \\( h \\) apparaît, ' +
    'puis le milieu \\( A\' \\), puis les deux triangles s\'<strong>écartent</strong> pour qu\'on ' +
    'les regarde chacun pour soi — même hauteur, bases égales. Le raisonnement s\'écrit ligne à ' +
    'ligne sous la figure. ' +
    '<br>Ensuite, <strong>déplace les sommets</strong> : les nombres changent, la conclusion non.',
  notes:
    '<p><strong>La démonstration, en trois lignes.</strong></p>' +
    '<ul>' +
    '<li>Les triangles \\( ABA\' \\) et \\( ACA\' \\) ont la <strong>même hauteur</strong> : ' +
    'c\'est la distance du sommet \\( A \\) à la droite \\( (BC) \\), et leurs deux bases sont ' +
    'portées par cette même droite.</li>' +
    '<li>Ils ont des <strong>bases égales</strong> : \\( A\' \\) est le milieu de \\( [BC] \\), ' +
    'donc \\( BA\' = A\'C = \\dfrac{BC}{2} \\).</li>' +
    '<li>Donc \\( S_1 = \\dfrac{BA\' \\times h}{2} = \\dfrac{A\'C \\times h}{2} = S_2 \\), et ' +
    'chacune vaut la moitié de \\( S = \\dfrac{BC \\times h}{2} \\).</li>' +
    '</ul>' +
    '<p><strong>Ce qu\'il faut retenir de la méthode.</strong> Pour comparer deux aires, on ne ' +
    'les mesure pas : on compare les <em>bases</em> et les <em>hauteurs</em>. Deux triangles qui ' +
    'ont la même hauteur et des bases égales ont la même aire — même s\'ils n\'ont pas du tout ' +
    'la même forme, ce que l\'on voit très bien ici.</p>' +
    '<p>Attention : « même aire » ne veut pas dire « superposables ». Les deux morceaux ne se ' +
    'ressemblent pas, et pourtant ils occupent exactement la même surface. C\'est aussi pour ' +
    'cela que la démonstration est nécessaire.</p>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var INK = '#334155';     // les côtés
    var SOM = '#2563eb';     // les sommets déplaçables
    var UN = '#2563eb';      // le triangle ABA' (aire S1)
    var DEUX = '#7c3aed';    // le triangle ACA' (aire S2)
    var HAUT = '#dc2626';    // la hauteur h et son angle droit
    var MIL = '#ea580c';     // le milieu A' et le codage des demi-côtés
    var BASE = '#059669';    // les bases mises en avant
    var GUIDE = '#94a3b8';   // droites parallèles et prolongements

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas » (voir app.js)         */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    function segCurve(p0, p1, style) {
      var prog = { v: 0 };
      var c = board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0, function () { return prog.v; }
      // Un segment n'a besoin que de ses deux extrémités : sans cela JSXGraph
      // l'échantillonne sur des centaines de points à chaque mise à jour.
      ], Object.assign({ numberPointsHigh: 2, numberPointsLow: 2 }, style));
      return { curve: c, prog: prog };
    }
    // Ligne brisée réactive de n points. L'indice est arrondi : le tracé reste
    // juste quel que soit l'échantillonnage de la courbe.
    function brisee(ptsFn, n, style) {
      return board.create('curve', [
        function (t) { return ptsFn()[Math.round(t)][0]; },
        function (t) { return ptsFn()[Math.round(t)][1]; },
        0, n - 1
      ], Object.assign({ numberPointsHigh: n, numberPointsLow: n }, style));
    }
    // Afficher / masquer. On MÉMORISE l'état : dans JSXGraph, setAttribute
    // déclenche à lui seul une mise à jour complète du tableau, et l'animation
    // repasse par ici à chaque image. Ne rien faire quand rien ne change fait
    // toute la différence entre une animation fluide et une animation qui rame.
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
    function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
    function fr(v) { return (Math.round(v * 10) / 10).toString().replace('.', ','); }

    /* ==================================================================== */
    /* Le triangle : A au sommet, [BC] pour base                             */
    /* ==================================================================== */
    // Départ choisi pour que les nombres tombent juste : BC = 10, h = 5,6,
    // donc S = 28 et chaque moitié 14.
    var DEPART = [[0.8, 3], [-5, -2.6], [5, -2.6]];
    var NOMS = ['A', 'B', 'C'];
    var DECAL = [[0, 18], [-16, -8], [16, -8]];

    var S = DEPART.map(function (p, i) {
      return board.create('point', p, {
        name: NOMS[i], size: 4, color: SOM, snapToGrid: false,
        label: { offset: DECAL[i], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
      });
    });
    function P(i) { return [S[i].X(), S[i].Y()]; }          // 0 = A, 1 = B, 2 = C

    function aire2() {
      var a = P(0), b = P(1), c = P(2);
      return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    }
    function aplati() { return Math.abs(aire2()) < 0.5; }

    // Le milieu de [BC], et la direction de (BC).
    function Apr() { return mul(add(P(1), P(2)), 0.5); }
    function dir() { return unit(sub(P(2), P(1))); }
    // La normale à (BC) qui s'éloigne de A : le « dessous » de la figure, là où
    // l'on pose les étiquettes de base sans rien recouvrir.
    function dessous() {
      var d = dir(), n = [-d[1], d[0]];
      return dot(n, sub(P(0), P(1))) > 0 ? mul(n, -1) : n;
    }

    // Le pied de la hauteur issue de A : son projeté orthogonal sur (BC).
    function pied() {
      var b = P(1), d = sub(P(2), b), den = dot(d, d);
      if (den < 1e-9) return b;
      return add(b, mul(d, dot(sub(P(0), b), d) / den));
    }
    // Les longueurs qui font toute la démonstration.
    function BC() { return len(sub(P(2), P(1))); }
    function h() { return len(sub(P(0), pied())); }
    function aire() { return BC() * h() / 2; }

    /* ==================================================================== */
    /* L'écartement : une translation LE LONG de (BC)                         */
    /* ==================================================================== */
    // Une translation le long de (BC) laisse (BC) en place : les deux bases
    // restent sur la même droite, les deux sommets sur la même parallèle.
    var ecart = { v: 0 };
    var ECART_MAX = 1.35;
    function decal(sens) { return mul(dir(), sens * ecart.v); }
    function separe() { return ecart.v > 0.02; }

    // Les sommets des deux morceaux : ABA' à gauche, ACA' à droite.
    function T1(k) { return add([P(0), P(1), Apr()][k], decal(-1)); }
    function T2(k) { return add([P(0), Apr(), P(2)][k], decal(1)); }
    function pied1() { return add(pied(), decal(-1)); }
    function pied2() { return add(pied(), decal(1)); }

    /* ==================================================================== */
    /* Le triangle entier (avant la coupe), puis les deux morceaux            */
    /* ==================================================================== */
    var polyEntier = board.create('polygon', S, {
      fillColor: UN, fillOpacity: 0.12, highlight: false,
      borders: { strokeColor: INK, strokeWidth: 2.5, highlight: false },
      vertices: { visible: true }
    });

    function ptsCaches(f) {
      return [0, 1, 2].map(function (k) {
        return board.create('point',
          [function () { return f(k)[0]; }, function () { return f(k)[1]; }],
          { visible: false, fixed: true, name: '' });
      });
    }
    var poly1 = board.create('polygon', ptsCaches(T1), {
      fillColor: UN, fillOpacity: 0.16, highlight: false, visible: false,
      borders: { strokeColor: UN, strokeWidth: 2.5, highlight: false },
      vertices: { visible: false }
    });
    var poly2 = board.create('polygon', ptsCaches(T2), {
      fillColor: DEUX, fillOpacity: 0.16, highlight: false, visible: false,
      borders: { strokeColor: DEUX, strokeWidth: 2.5, highlight: false },
      vertices: { visible: false }
    });

    // Les noms des sommets, portés par les morceaux quand ils sont écartés.
    function etiq(f, k, nom, dx, dy, col) {
      return board.create('text', [
        function () { return f(k)[0] + dx; },
        function () { return f(k)[1] + dy; }, nom
      ], { fontSize: 15, color: col, strokeColor: col, cssStyle: 'font-weight:700',
           fixed: true, visible: false, anchorX: 'middle' });
    }
    var noms1 = [etiq(T1, 0, 'A', 0, 0.45, UN), etiq(T1, 1, 'B', -0.45, -0.55, UN),
                 etiq(T1, 2, "A'", 0.4, -0.55, MIL)];
    var noms2 = [etiq(T2, 0, 'A', 0, 0.45, DEUX), etiq(T2, 1, "A'", -0.4, -0.55, MIL),
                 etiq(T2, 2, 'C', 0.45, -0.55, DEUX)];

    /* ==================================================================== */
    /* Le milieu A' et le codage des deux demi-côtés égaux                    */
    /* ==================================================================== */
    var ptApr = board.create('point',
      [function () { return Apr()[0]; }, function () { return Apr()[1]; }],
      { name: "A'", size: 5, color: MIL, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [4, -20], fontSize: 15, strokeColor: MIL,
                 cssStyle: 'font-weight:700' } });

    // Un petit trait en travers, au milieu de chaque demi-côté : deux traits
    // identiques disent que les deux longueurs sont égales.
    function codePts(f, a, b) {
      var u = f(a), v = f(b), c = mul(add(u, v), 0.5);
      var d = unit(sub(v, u)), n = [-d[1], d[0]];
      return [add(c, mul(n, 0.26)), add(c, mul(n, -0.26))];
    }
    var code1 = brisee(function () { return codePts(T1, 1, 2); }, 2,
      { strokeColor: MIL, strokeWidth: 3, highlight: false, visible: false });
    var code2 = brisee(function () { return codePts(T2, 1, 2); }, 2,
      { strokeColor: MIL, strokeWidth: 3, highlight: false, visible: false });

    // La médiane [AA'], tracée avant la coupe : c'est le long d'elle qu'on coupe.
    var mediane = segCurve(function () { return P(0); }, function () { return Apr(); },
      { strokeColor: MIL, strokeWidth: 3, highlight: false, visible: false });

    /* ==================================================================== */
    /* Les hauteurs : celle du grand triangle, puis celle de chaque morceau    */
    /* ==================================================================== */
    // Le petit carré de l'angle droit, posé au pied, entre la base et la hauteur.
    var COTE_EQ = 0.5;
    function equerrePts(f, sommet, e1, e2, foot, taille) {
      var loin = len(sub(f(e1), foot)) > len(sub(f(e2), foot)) ? f(e1) : f(e2);
      var u = mul(unit(sub(loin, foot)), taille), v = mul(unit(sub(f(sommet), foot)), taille);
      return [foot, add(foot, u), add(add(foot, u), v), add(foot, v), foot];
    }
    function faireHauteur(sommetFn, footFn, equerreFn, col) {
      var taille = { v: 0 };
      var trait = segCurve(sommetFn, footFn,
        { strokeColor: col, strokeWidth: 3, highlight: false, visible: false });
      var eq = brisee(function () { return equerreFn(taille.v); }, 5,
        { strokeColor: col, strokeWidth: 3, fillColor: col, fillOpacity: 0.35,
          highlight: false, visible: false, layer: 9 });
      // Le « h », posé À CÔTÉ du trait : on décale le long de (BC), donc
      // perpendiculairement à la hauteur, du côté de B.
      var lab = board.create('text', [
        function () { return mul(add(sommetFn(), footFn()), 0.5)[0] - 0.42 * dir()[0]; },
        function () { return mul(add(sommetFn(), footFn()), 0.5)[1] - 0.42 * dir()[1]; },
        'h'
      ], { fontSize: 17, color: col, strokeColor: col, cssStyle: 'font-weight:800',
           fixed: true, visible: false, anchorX: 'middle' });
      return { trait: trait, eq: eq, lab: lab, taille: taille };
    }

    var hTot = faireHauteur(function () { return P(0); }, pied,
      function (t) { return equerrePts(function (k) { return [P(0), P(1), P(2)][k]; },
                                       0, 1, 2, pied(), t); }, HAUT);
    var h1 = faireHauteur(function () { return T1(0); }, pied1,
      function (t) { return equerrePts(T1, 0, 1, 2, pied1(), t); }, HAUT);
    var h2 = faireHauteur(function () { return T2(0); }, pied2,
      function (t) { return equerrePts(T2, 0, 1, 2, pied2(), t); }, HAUT);

    // Quand le pied tombe en dehors de la base d'un morceau, on prolonge la
    // base en pointillés pour aller le chercher — exactement comme dans la
    // leçon « Les hauteurs d'un triangle ».
    function prolonge(f, foot) {
      return board.create('curve', [
        function (t) { var p = bout(f, foot()); return p[0] + (foot()[0] - p[0]) * t; },
        function (t) { var p = bout(f, foot()); return p[1] + (foot()[1] - p[1]) * t; },
        0, 1
      ], { strokeColor: GUIDE, strokeWidth: 2, dash: 2, highlight: false, visible: false });
    }
    // L'extrémité de la base la plus proche du pied (celle d'où l'on prolonge).
    function bout(f, foot) {
      return len(sub(f(1), foot)) < len(sub(f(2), foot)) ? f(1) : f(2);
    }
    // Le pied est-il en dehors de la base [f(1) ; f(2)] ?
    function dehors(f, foot) {
      var d = sub(f(2), f(1)), den = dot(d, d);
      if (den < 1e-9) return false;
      var t = dot(sub(foot, f(1)), d) / den;
      return t < 0 || t > 1;
    }
    var prol1 = prolonge(T1, pied1), prol2 = prolonge(T2, pied2);

    /* ==================================================================== */
    /* Les deux droites parallèles : c'est elles qui montrent « même hauteur » */
    /* ==================================================================== */
    function droite(ptFn, style) {
      return board.create('line', [
        board.create('point', [function () { return ptFn()[0]; },
                               function () { return ptFn()[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return add(ptFn(), dir())[0]; },
                               function () { return add(ptFn(), dir())[1]; }],
          { visible: false, fixed: true, name: '' })
      ], style);
    }
    var STYLE_PAR = { strokeColor: GUIDE, strokeWidth: 1.4, dash: 2, fixed: true,
                      highlight: false, visible: false };
    var parBas = droite(function () { return P(1); }, STYLE_PAR);
    var parHaut = droite(function () { return T1(0); }, STYLE_PAR);

    /* ==================================================================== */
    /* Les bases mises en avant, et les aires écrites dans les morceaux        */
    /* ==================================================================== */
    var baseTot = segCurve(function () { return P(1); }, function () { return P(2); },
      { strokeColor: BASE, strokeWidth: 6, strokeOpacity: 0.4, highlight: false,
        visible: false });
    var base1 = segCurve(function () { return T1(1); }, function () { return T1(2); },
      { strokeColor: BASE, strokeWidth: 6, strokeOpacity: 0.4, highlight: false,
        visible: false });
    var base2 = segCurve(function () { return T2(1); }, function () { return T2(2); },
      { strokeColor: BASE, strokeWidth: 6, strokeOpacity: 0.4, highlight: false,
        visible: false });

    // L'étiquette d'une base : son nom et sa longueur, posés sous le segment.
    function labBase(f, a, b, nom, valFn) {
      return board.create('text', [
        function () { return mul(add(f(a), f(b)), 0.5)[0] + 0.78 * dessous()[0]; },
        function () { return mul(add(f(a), f(b)), 0.5)[1] + 0.78 * dessous()[1]; },
        function () { return nom + ' = ' + fr(valFn()); }
      ], { fontSize: 14, color: BASE, strokeColor: BASE, cssStyle: 'font-weight:700',
           fixed: true, visible: false, anchorX: 'middle' });
    }
    var labBC = labBase(function (k) { return [P(0), P(1), P(2)][k]; }, 1, 2, 'BC', BC);
    var labB1 = labBase(T1, 1, 2, "BA'", function () { return BC() / 2; });
    var labB2 = labBase(T2, 1, 2, "A'C", function () { return BC() / 2; });

    // L'aire, écrite au centre de chaque morceau.
    function labAire(f, txt, col) {
      return board.create('text', [
        function () { return (f(0)[0] + f(1)[0] + f(2)[0]) / 3; },
        function () { return (f(0)[1] + f(1)[1] + f(2)[1]) / 3; },
        txt
      ], { fontSize: 20, color: col, strokeColor: col, cssStyle: 'font-weight:800',
           fixed: true, visible: false, anchorX: 'middle' });
    }
    var labS = labAire(function (k) { return [P(0), P(1), P(2)][k]; }, 'S', INK);
    var labS1 = labAire(T1, 'S₁', UN);
    var labS2 = labAire(T2, 'S₂', DEUX);

    /* ==================================================================== */
    /* Le panneau : la démonstration s'écrit ligne à ligne                    */
    /* ==================================================================== */
    var panneau = document.createElement('div');
    panneau.className = 'props-panel';
    // Il est ajouté au DOM tout à la fin, pour venir SOUS la barre de boutons.

    function coul(t, c) { return '<b style="color:' + c + '">' + t + '</b>'; }
    var phase = 0;         // jusqu'où la démonstration est allée (0 → 7)

    var dernier = null;
    function ecrire() {
      // Reconstruire le panneau à chaque image serait du gâchis : on ne le
      // refait que si son contenu a bougé.
      var cle = [phase, aplati(), fr(BC()), fr(h())].join('|');
      if (cle === dernier) return;
      dernier = cle;
      var l = [];
      l.push('<div class="props-name">Une médiane partage le triangle en deux aires égales</div>');
      if (aplati()) {
        l.push('<div class="calc-warn">Les trois points sont presque alignés : ' +
               'il n\'y a plus de triangle. Écarte un sommet.</div>');
        panneau.innerHTML = l.join('');
        return;
      }
      if (phase >= 1) {
        l.push('<div class="calc-line">Aire d\'un triangle : ' +
               'S = (base × hauteur) ÷ 2.</div>');
      }
      if (phase >= 2) {
        l.push('<div class="calc-line">Ici la base est ' + coul('BC = ' + fr(BC()), BASE) +
               ' et la hauteur issue de A est ' + coul('h = ' + fr(h()), HAUT) + '.</div>');
        l.push('<div class="calc-line">S = (' + fr(BC()) + ' × ' + fr(h()) + ') ÷ 2 = ' +
               '<b>' + fr(aire()) + '</b></div>');
      }
      if (phase >= 3) {
        l.push('<div class="calc-line">' + coul("A'", MIL) + ' est le milieu de [BC], donc ' +
               coul("BA' = A'C = BC ÷ 2 = " + fr(BC() / 2), MIL) + '.</div>');
      }
      if (phase >= 5) {
        l.push('<div class="calc-line">Les deux triangles ont le même sommet A et leurs bases ' +
               'sont sur la même droite (BC) : ils ont donc la ' +
               coul('même hauteur h = ' + fr(h()), HAUT) + '.</div>');
      }
      if (phase >= 6) {
        l.push('<div class="calc-line">' + coul('S₁', UN) + " = (BA' × h) ÷ 2 = (" +
               fr(BC() / 2) + ' × ' + fr(h()) + ') ÷ 2 = <b>' + fr(aire() / 2) + '</b></div>');
        l.push('<div class="calc-line">' + coul('S₂', DEUX) + " = (A'C × h) ÷ 2 = (" +
               fr(BC() / 2) + ' × ' + fr(h()) + ') ÷ 2 = <b>' + fr(aire() / 2) + '</b></div>');
      }
      if (phase >= 7) {
        l.push('<div class="calc-result">S₁ = S₂ = S ÷ 2 = ' + fr(aire() / 2) + '</div>');
        l.push('<div class="calc-line">Mêmes bases, même hauteur : les deux triangles ont la ' +
               'même aire, alors qu\'ils n\'ont pas la même forme.</div>');
      }
      panneau.innerHTML = l.join('');
    }

    /* ==================================================================== */
    /* Mise à jour de tout ce qui dépend de la figure                         */
    /* ==================================================================== */
    var refs = null;

    function rafraichir() {
      var ok = !aplati(), sep = separe();

      // Avant la coupe : le triangle entier. Après : les deux morceaux.
      show(polyEntier, phase < 4 && ok);
      polyEntier.borders.forEach(function (b) { show(b, phase < 4 && ok); });
      show(poly1, phase >= 4 && ok);
      show(poly2, phase >= 4 && ok);

      // Les poignées ne sont là que quand les morceaux sont en place : sinon
      // elles flotteraient loin des sommets qu'elles portent.
      S.forEach(function (p) { show(p, !sep); });
      noms1.forEach(function (t) { show(t, sep && phase >= 4 && ok); });
      noms2.forEach(function (t) { show(t, sep && phase >= 4 && ok); });

      show(hTot.trait.curve, phase >= 1 && phase < 4 && ok);
      show(hTot.eq, phase >= 1 && phase < 4 && ok);
      show(hTot.lab, phase >= 1 && phase < 4 && ok);
      show(baseTot.curve, phase >= 2 && phase < 4 && ok);
      show(labBC, phase >= 2 && phase < 4 && ok);
      show(labS, phase >= 2 && phase < 4 && ok);

      show(ptApr, phase >= 3 && !sep && ok);
      show(code1, phase >= 3 && ok);
      show(code2, phase >= 3 && ok);
      show(mediane.curve, phase >= 3 && phase < 4 && ok);

      show(labS1, phase >= 4 && ok);
      show(labS2, phase >= 4 && ok);

      [h1, h2].forEach(function (x) {
        show(x.trait.curve, phase >= 5 && ok);
        show(x.eq, phase >= 5 && ok);
        show(x.lab, phase >= 5 && ok);
      });
      show(parBas, phase >= 5 && ok);
      show(parHaut, phase >= 5 && ok);
      show(prol1, phase >= 5 && ok && dehors(T1, pied1()));
      show(prol2, phase >= 5 && ok && dehors(T2, pied2()));

      show(base1.curve, phase >= 6 && ok);
      show(base2.curve, phase >= 6 && ok);
      show(labB1, phase >= 6 && ok);
      show(labB2, phase >= 6 && ok);

      if (refs && refs.sep && refs.sep.checked !== sep) refs.sep.checked = sep;
      ecrire();
      board.update();
    }
    S.forEach(function (p) { p.on('drag', rafraichir); });

    /* ==================================================================== */
    /* États : effacer / dérouler la démonstration                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      phase = 0;
      ecart.v = 0;
      dernier = null;
      [hTot, h1, h2].forEach(function (x) {
        x.trait.prog.v = 0; x.taille.v = 0;
      });
      mediane.prog.v = 0;
      [baseTot, base1, base2].forEach(function (b) { b.prog.v = 0; });
      rafraichir();
    }

    function jouer() {
      effacer();
      anim.runSteps([
        // 1. la hauteur du grand triangle, avec son angle droit
        { dur: 700,
          step: function (p) {
            phase = 1;
            hTot.trait.prog.v = p;
            hTot.taille.v = COTE_EQ * Math.max(0, (p - 0.7) / 0.3);
            rafraichir();
          } },
        // 2. la base, et l'aire S
        { dur: 500,
          step: function (p) { phase = 2; baseTot.prog.v = p; rafraichir(); } },
        // 3. le milieu A', les deux demi-côtés codés égaux, la médiane
        { dur: 600,
          step: function (p) { phase = 3; mediane.prog.v = p; rafraichir(); } },
        // 4. on écarte les deux morceaux le long de (BC)
        { dur: 900,
          step: function (p) { phase = 4; ecart.v = ECART_MAX * p; rafraichir(); } },
        // 5. dans chacun, la MÊME hauteur — et les deux parallèles qui le disent
        { dur: 700,
          step: function (p) {
            phase = 5;
            h1.trait.prog.v = p; h2.trait.prog.v = p;
            h1.taille.v = h2.taille.v = COTE_EQ * Math.max(0, (p - 0.7) / 0.3);
            rafraichir();
          } },
        // 6. les deux bases, égales puisque A' est le milieu
        { dur: 600,
          step: function (p) {
            phase = 6; base1.prog.v = p; base2.prog.v = p; rafraichir();
          } },
        // 7. la conclusion
        { dur: 400, step: function () { phase = 7; rafraichir(); } }
      ], effacer);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    refs = mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer la démonstration', onClick: jouer },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'sep', label: 'Écarter les deux triangles', checked: false,
        onChange: function (v) {
          // Rapprocher les morceaux redonne les poignées : on peut déformer le
          // triangle, puis les écarter de nouveau.
          ecart.v = v ? ECART_MAX : 0;
          if (v && phase < 4) phase = 4;
          rafraichir();
        } }
    ]);

    mv.extras.appendChild(panneau);

    // Démarrage : on déroule la démonstration une première fois.
    jouer();
  }
});
