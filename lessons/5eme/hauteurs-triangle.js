/*
 * Les hauteurs d'un triangle (5ème) — les trois hauteurs et l'orthocentre.
 *
 * L'animation trace les hauteurs UNE PAR UNE, et chacune en deux temps :
 *   1. le côté opposé s'allume (c'est LUI qu'on doit rencontrer à angle droit),
 *      prolongé en pointillés si le pied tombe en dehors ;
 *   2. la hauteur descend du sommet jusqu'à son pied, et le codage de l'ANGLE
 *      DROIT apparaît — c'est la définition, pas une décoration.
 * Puis un dernier temps montre que les trois droites passent par un même
 * point : l'ORTHOCENTRE.
 *
 * Ensuite les trois sommets se déplacent : tout est recalculé en direct, y
 * compris le prolongement des côtés et la position de l'orthocentre.
 *
 * ---------------------------------------------------------------------------
 * Attention à ne pas confondre (le point le plus fréquemment confondu)
 * ---------------------------------------------------------------------------
 * Le point de concours des HAUTEURS est l'ORTHOCENTRE. Le centre du cercle
 * CIRCONSCRIT, lui, est le point de concours des MÉDIATRICES : ce sont deux
 * points différents, et c'est justement pour qu'on le voie que la case
 * « Cercle circonscrit » superpose les médiatrices (en vert) et le cercle à la
 * figure des hauteurs (en violet). Il suffit de déplacer un sommet pour voir
 * les deux points s'éloigner l'un de l'autre — sauf dans le cas d'un triangle
 * équilatéral, où ils sont confondus.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est calculé
 * ---------------------------------------------------------------------------
 * Rien n'est dessiné à la main. Pour la hauteur issue de A :
 *   - le PIED est le projeté orthogonal de A sur la droite (BC) : on écrit
 *     H = B + t·(C − B) avec t = ((A − B)·(C − B)) / ‖C − B‖², et le signe de
 *     t dit tout de suite si le pied est sur le côté (0 ⩽ t ⩽ 1) ou en dehors
 *     (c'est alors qu'il faut prolonger) ;
 *   - la hauteur est la droite (A ; pied).
 * L'ORTHOCENTRE est l'unique point H tel que (H − A)·(C − B) = 0 et
 * (H − B)·(C − A) = 0 : deux équations linéaires, un système 2×2 dont le
 * déterminant est l'aire du triangle (au facteur 2 près). Il s'annule quand
 * les trois points sont alignés — le triangle est alors « aplati » et la
 * figure se met en veille plutôt que d'envoyer l'orthocentre à l'infini.
 * Le CENTRE DU CERCLE CIRCONSCRIT s'obtient du même coup, par le système
 * ‖O − A‖² = ‖O − B‖² = ‖O − C‖².
 *
 * Comme tout est fonction des trois sommets, les trois cas du programme se
 * constatent en tirant un point : orthocentre à l'intérieur (triangle
 * acutangle), sur le sommet de l'angle droit (triangle rectangle), à
 * l'extérieur (triangle obtusangle). Le bandeau du haut le dit en direct.
 */
MathsView.register({
  id: 'hauteurs-triangle',
  title: 'Les hauteurs d\'un triangle',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — hauteurs d\'un triangle et orthocentre',
  exercices: ['hauteurs'],
  description:
    'Une <strong>hauteur</strong> d\'un triangle est la <strong>droite</strong> qui passe par ' +
    'un <strong>sommet</strong> et qui est <strong>perpendiculaire au côté opposé</strong>. ' +
    'Le point où elle rencontre ce côté s\'appelle le <strong>pied</strong> de la hauteur. ' +
    '<br>Clique sur <strong>Lancer l\'animation</strong> : les trois hauteurs se tracent une ' +
    'par une, avec le codage de l\'angle droit à chaque fois. Elles se coupent toutes les ' +
    'trois au même point, l\'<strong>orthocentre</strong>. ' +
    '<br>Ensuite, <strong>déplace les sommets</strong> : tout suit en direct. Regarde ce que ' +
    'devient l\'orthocentre quand le triangle devient rectangle, puis obtusangle.',
  notes:
    '<ul>' +
    '<li>Une hauteur est une <strong>droite</strong>, pas un segment : quand le pied tombe ' +
    '<strong>en dehors</strong> du côté, on <strong>prolonge le côté</strong> (en pointillés ' +
    'sur la figure) pour aller le chercher. C\'est le cas dans un triangle ' +
    '<strong>obtusangle</strong>.</li>' +
    '<li>Les trois hauteurs sont <strong>concourantes</strong> : elles passent toutes par un ' +
    'même point, appelé l\'<strong>orthocentre</strong>. Deux hauteurs suffisent donc à le ' +
    'construire — la troisième passe forcément par ce point.</li>' +
    '<li>Où est l\'orthocentre&nbsp;? <strong>À l\'intérieur</strong> si le triangle est ' +
    'acutangle (tous ses angles aigus), <strong>sur le sommet de l\'angle droit</strong> si le ' +
    'triangle est rectangle, <strong>à l\'extérieur</strong> si le triangle est obtusangle.</li>' +
    '<li><strong>Ne pas confondre.</strong> L\'orthocentre est le point de concours des ' +
    '<strong>hauteurs</strong>. Le <strong>centre du cercle circonscrit</strong>, lui, est le ' +
    'point de concours des <strong>médiatrices</strong> des côtés : ce n\'est pas le même point. ' +
    'Coche « Cercle circonscrit » pour afficher les deux en même temps et déplace un sommet : ' +
    'ils s\'éloignent l\'un de l\'autre (ils ne sont confondus que si le triangle est ' +
    '<strong>équilatéral</strong>).</li>' +
    '<li>L\'aire du triangle se calcule avec <em>n\'importe laquelle</em> des trois hauteurs : ' +
    '\\( \\mathcal{A} = \\dfrac{\\text{côté} \\times \\text{hauteur correspondante}}{2} \\). ' +
    'C\'est pour cela qu\'on en a trois.</li>' +
    '</ul>',
  board: { boundingbox: [-8, 6, 8, -6], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette                                                              */
    /* ==================================================================== */
    var INK = '#334155';     // les côtés du triangle
    var SOM = '#2563eb';     // les sommets
    var COTE = '#059669';    // le côté opposé, mis en avant pendant l'étape
    var HAUT = '#7c3aed';    // les hauteurs
    var DROIT = '#ea580c';   // le codage de l'angle droit (et les pieds)
    var ORTHO = '#dc2626';   // l'orthocentre
    var CIRC = '#0d9488';    // médiatrices et cercle circonscrit
    var GUIDE = '#94a3b8';   // prolongement des côtés

    /* ==================================================================== */
    /* Moteur d'animation partagé + mode « pas à pas » (voir app.js)         */
    /* ==================================================================== */
    var anim = mv.createAnimator();
    // Segment de p0 à p1 (fns → [x,y]), révélé de 0 à prog.
    function segCurve(p0, p1, style) {
      var prog = { v: 1 };
      var c = board.create('curve', [
        function (t) { var a = p0(), b = p1(); return a[0] + (b[0] - a[0]) * t; },
        function (t) { var a = p0(), b = p1(); return a[1] + (b[1] - a[1]) * t; },
        0, function () { return prog.v; }
      // Un segment n'a besoin que de ses deux extrémités : sans cela JSXGraph
      // l'échantillonne sur des centaines de points à chaque mise à jour.
      ], Object.assign({ numberPointsHigh: 2, numberPointsLow: 2 }, style));
      return { curve: c, prog: prog };
    }
    // Ligne brisée réactive de n points (fn → tableau de [x,y]).
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
    function unit(a) { var n = len(a); return n < 1e-9 ? [0, 0] : [a[0] / n, a[1] / n]; }

    /* ==================================================================== */
    /* Le triangle : trois sommets déplaçables                               */
    /* ==================================================================== */
    // Trois formes prêtes à l'emploi : les trois cas de figure du programme.
    var FORMES = [
      { nom: 'acutangle', p: [[-4.5, -2.5], [4, -3], [1, 3.2]] },
      { nom: 'rectangle', p: [[-4, -2.6], [4, -2.6], [-4, 3]] },
      { nom: 'obtusangle', p: [[-4, -0.8], [3.5, -0.8], [-1.6, 1.9]] }
    ];
    var forme = 0;

    var NOMS = ['A', 'B', 'C'];
    var OPP = [[1, 2], [2, 0], [0, 1]];      // le côté opposé à chaque sommet
    var DECAL = [[-16, -6], [14, -6], [0, 16]];

    var S = FORMES[0].p.map(function (p, i) {
      return board.create('point', p, {
        name: NOMS[i], size: 4, color: SOM, snapToGrid: false,
        label: { offset: DECAL[i], fontSize: 16, strokeColor: SOM, cssStyle: 'font-weight:700' }
      });
    });
    board.create('polygon', S, {
      fillColor: SOM, fillOpacity: 0.07, highlight: false,
      borders: { strokeColor: INK, strokeWidth: 2.5, highlight: false },
      vertices: { visible: true }
    });

    function P(i) { return [S[i].X(), S[i].Y()]; }

    // Le déterminant du système : c'est l'aire du triangle (au facteur 2 près).
    // S'il s'annule, les trois points sont alignés : plus de triangle, plus
    // d'orthocentre. On préfère mettre la figure en veille.
    function aire2() {
      var a = P(0), b = P(1), c = P(2);
      return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
    }
    function aplati() { return Math.abs(aire2()) < 0.35; }

    /* ==================================================================== */
    /* Pied de la hauteur : le projeté orthogonal du sommet sur le côté opposé */
    /* ==================================================================== */
    // Renvoie { p: [x,y], t: position le long du côté }. t hors de [0 ; 1]
    // signifie que le pied tombe en dehors du côté : il faut le prolonger.
    function pied(i) {
      var o = OPP[i], u = P(o[0]), v = P(o[1]), s = P(i);
      var d = sub(v, u), den = dot(d, d);
      if (den < 1e-9) return { p: u, t: 0 };
      var t = dot(sub(s, u), d) / den;
      return { p: add(u, mul(d, t)), t: t };
    }
    // Le point de la hauteur situé un peu AU-DELÀ du pied : le trait animé ne
    // s'arrête pas pile dessus, il le dépasse comme on le fait à la règle.
    function auDela(i) { var f = pied(i).p, s = P(i); return add(f, mul(sub(f, s), 0.16)); }

    /* ==================================================================== */
    /* L'orthocentre : (H−A)·(C−B) = 0 et (H−B)·(C−A) = 0                    */
    /* ==================================================================== */
    function orthocentre() {
      var a = P(0), b = P(1), c = P(2);
      var a1 = c[0] - b[0], b1 = c[1] - b[1], c1 = a[0] * a1 + a[1] * b1;
      var a2 = c[0] - a[0], b2 = c[1] - a[1], c2 = b[0] * a2 + b[1] * b2;
      var det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-9) return a;
      return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
    }

    // Le centre du cercle circonscrit : ‖O−A‖ = ‖O−B‖ = ‖O−C‖.
    function circonscrit() {
      var a = P(0), b = P(1), c = P(2);
      var a1 = 2 * (b[0] - a[0]), b1 = 2 * (b[1] - a[1]);
      var c1 = dot(b, b) - dot(a, a);
      var a2 = 2 * (c[0] - a[0]), b2 = 2 * (c[1] - a[1]);
      var c2 = dot(c, c) - dot(a, a);
      var det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-9) return a;
      return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
    }

    /* ==================================================================== */
    /* Une hauteur = quatre objets, tous fonctions des sommets                */
    /* ==================================================================== */
    var HS = [];
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var o = OPP[i];

        // a) le côté opposé, mis en avant pendant l'étape qui le concerne
        var cote = segCurve(function () { return P(o[0]); }, function () { return P(o[1]); },
          { strokeColor: COTE, strokeWidth: 5, strokeOpacity: 0.45, highlight: false,
            visible: false });

        // b) son prolongement en pointillés, quand le pied tombe en dehors
        var prol = board.create('curve', [
          function (t) { var f = pied(i); return prolPt(i, f, t)[0]; },
          function (t) { var f = pied(i); return prolPt(i, f, t)[1]; },
          0, 1
        ], { strokeColor: GUIDE, strokeWidth: 2, dash: 2, highlight: false, visible: false });

        // c) la hauteur : le trait qui se trace, puis la droite entière
        var trait = segCurve(function () { return P(i); }, function () { return auDela(i); },
          { strokeColor: HAUT, strokeWidth: 3, highlight: false, visible: false });
        var droite = board.create('line', [
          board.create('point', [function () { return P(i)[0]; }, function () { return P(i)[1]; }],
            { visible: false, fixed: true, name: '' }),
          board.create('point', [function () { return pied(i).p[0]; },
                                 function () { return pied(i).p[1]; }],
            { visible: false, fixed: true, name: '' })
        ], { strokeColor: HAUT, strokeWidth: 1.2, strokeOpacity: 0.55, fixed: true,
             highlight: false, visible: false });

        // d) le pied et son angle droit — la définition rendue visible.
        //    Le petit CARRÉ est ce qui dit « perpendiculaire » : on le veut
        //    plein, franc, et par-dessus tout le reste.
        var ptPied = board.create('point',
          [function () { return pied(i).p[0]; }, function () { return pied(i).p[1]; }],
          { name: '', size: 3, color: DROIT, fixed: true, visible: false,
            highlight: false, showInfobox: false });
        var taille = { v: 0 };
        var equerre = brisee(function () { return equerrePts(i, taille.v); }, 5,
          { strokeColor: DROIT, strokeWidth: 3, fillColor: DROIT, fillOpacity: 0.35,
            highlight: false, visible: false, layer: 9 });

        HS[i] = { cote: cote, prol: prol, trait: trait, droite: droite,
                  pied: ptPied, equerre: equerre, taille: taille, etat: 0 };
      })(i);
    }

    // Le prolongement va de l'extrémité la plus proche du pied jusqu'au pied.
    function prolPt(i, f, t) {
      var o = OPP[i], bout = f.t > 1 ? P(o[1]) : P(o[0]);
      return add(bout, mul(sub(f.p, bout), t));
    }

    // Le codage de l'angle droit, au pied de la hauteur : le petit carré posé
    // entre le côté et la hauteur, du côté où il y a la place. Le contour est
    // FERMÉ (il repasse par le pied) pour que le carré soit rempli.
    var COTE_EQ = 0.52;                      // côté du carré, en unités du repère
    function equerrePts(i, r) {
      var f = pied(i).p, o = OPP[i];
      var e1 = P(o[0]), e2 = P(o[1]);
      var loin = len(sub(e1, f)) > len(sub(e2, f)) ? e1 : e2;
      var u = mul(unit(sub(loin, f)), r), v = mul(unit(sub(P(i), f)), r);
      return [f, add(f, u), add(add(f, u), v), add(f, v), f];
    }

    /* ==================================================================== */
    /* L'orthocentre, et le halo qui vient se refermer dessus                 */
    /* ==================================================================== */
    var halo = { v: 0 };
    var haloC = board.create('curve', [
      function (t) { return orthocentre()[0] + halo.v * Math.cos(t); },
      function (t) { return orthocentre()[1] + halo.v * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: ORTHO, strokeWidth: 2, dash: 2, highlight: false, visible: false });

    var ptOrtho = board.create('point',
      [function () { return orthocentre()[0]; }, function () { return orthocentre()[1]; }],
      { name: 'H', size: 5, color: ORTHO, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [12, 10], fontSize: 16, strokeColor: ORTHO,
                 cssStyle: 'font-weight:700' } });

    /* ==================================================================== */
    /* La couche « cercle circonscrit » : les MÉDIATRICES, pas les hauteurs   */
    /* ==================================================================== */
    var med = OPP.map(function (o) {
      // Médiatrice du côté opposé : elle passe par son milieu, perpendiculairement.
      function mil() { return mul(add(P(o[0]), P(o[1])), 0.5); }
      function nor() { var d = sub(P(o[1]), P(o[0])); return unit([-d[1], d[0]]); }
      return board.create('line', [
        board.create('point', [function () { return add(mil(), mul(nor(), -1))[0]; },
                               function () { return add(mil(), mul(nor(), -1))[1]; }],
          { visible: false, fixed: true, name: '' }),
        board.create('point', [function () { return add(mil(), nor())[0]; },
                               function () { return add(mil(), nor())[1]; }],
          { visible: false, fixed: true, name: '' })
      ], { strokeColor: CIRC, strokeWidth: 1.4, dash: 2, fixed: true,
           highlight: false, visible: false });
    });

    var ptCirc = board.create('point',
      [function () { return circonscrit()[0]; }, function () { return circonscrit()[1]; }],
      { name: 'O', size: 4, color: CIRC, fixed: true, visible: false, highlight: false,
        showInfobox: false,
        label: { offset: [10, -18], fontSize: 15, strokeColor: CIRC,
                 cssStyle: 'font-weight:700' } });

    var cercle = board.create('curve', [
      function (t) { var o = circonscrit(); return o[0] + len(sub(P(0), o)) * Math.cos(t); },
      function (t) { var o = circonscrit(); return o[1] + len(sub(P(0), o)) * Math.sin(t); },
      0, 2 * Math.PI
    ], { strokeColor: CIRC, strokeWidth: 2, highlight: false, visible: false });

    var voirCercle = false;

    /* ==================================================================== */
    /* Le bandeau : la nature du triangle, et où se trouve l'orthocentre      */
    /* ==================================================================== */
    // Les trois angles, en degrés, pour dire acutangle / rectangle / obtusangle.
    function angles() {
      return [0, 1, 2].map(function (i) {
        var o = OPP[i];
        var u = sub(P(o[0]), P(i)), v = sub(P(o[1]), P(i));
        var d = len(u) * len(v);
        if (d < 1e-9) return 0;
        return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / d))) * 180 / Math.PI;
      });
    }
    function nature() {
      if (aplati()) return { txt: 'Les trois points sont presque alignés : ce n\'est plus ' +
                                  'un triangle. Écarte un sommet.', col: GUIDE };
      var a = angles(), max = Math.max(a[0], a[1], a[2]), i = a.indexOf(max);
      if (Math.abs(max - 90) < 1.5) {
        return { txt: 'Triangle rectangle en ' + NOMS[i] + ' : l\'orthocentre est EN ' +
                      NOMS[i] + ', le sommet de l\'angle droit.', col: ORTHO };
      }
      if (max > 90) {
        return { txt: 'Triangle obtusangle (angle obtus en ' + NOMS[i] + ') : l\'orthocentre ' +
                      'est À L\'EXTÉRIEUR du triangle.', col: ORTHO };
      }
      return { txt: 'Triangle acutangle (trois angles aigus) : l\'orthocentre est ' +
                    'À L\'INTÉRIEUR du triangle.', col: ORTHO };
    }

    var bandeau = board.create('text', [-7.7, 5.4, function () { return nature().txt; }],
      { fontSize: 15, cssStyle: 'font-weight:600', fixed: true, visible: false });

    var noteCirc = board.create('text', [-7.7, -5.3, function () {
      if (!voirCercle) return '';
      return 'En vert : les MÉDIATRICES et le cercle circonscrit, de centre O. ' +
             'O n\'est pas H : ce ne sont pas les mêmes droites.';
    }], { fontSize: 14, color: CIRC, cssStyle: 'font-weight:600', fixed: true, visible: false });

    /* ==================================================================== */
    /* Mise à jour de tout ce qui dépend de la forme du triangle              */
    /* ==================================================================== */
    var fini = false;                 // l'orthocentre a-t-il été révélé ?

    function rafraichir() {
      var ok = !aplati();
      HS.forEach(function (h, i) {
        // Le prolongement n'a de sens que si le pied tombe hors du côté.
        var t = pied(i).t;
        show(h.prol, h.etat >= 1 && ok && (t < 0 || t > 1));
        show(h.equerre, (h.etat >= 2 || h.taille.v > 0.01) && ok);
        show(h.pied, h.etat >= 2 && ok);
        show(h.droite, h.etat >= 2 && ok);
      });
      show(ptOrtho, fini && ok);
      show(ptCirc, voirCercle && ok);
      show(cercle, voirCercle && ok);
      med.forEach(function (m) { show(m, voirCercle && ok); });
      show(noteCirc, voirCercle);
      // Même précaution que pour show() : on ne repeint le bandeau que si sa
      // couleur change vraiment.
      var col = nature().col;
      if (bandeau.__col !== col) { bandeau.__col = col; bandeau.setAttribute({ strokeColor: col }); }
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
      show(haloC, false);
      HS.forEach(function (h) {
        h.etat = 0;
        h.trait.prog.v = 0;
        h.cote.prog.v = 0;
        h.taille.v = 0;
        h.cote.curve.setAttribute({ strokeOpacity: 0.45 });
        [h.cote.curve, h.prol, h.trait.curve, h.droite, h.pied, h.equerre]
          .forEach(function (o) { show(o, false); });
      });
      show(ptOrtho, false);
      show(bandeau, false);
      rafraichir();
    }

    function jouer() {
      effacer();
      var steps = [];
      [0, 1, 2].forEach(function (i) {
        var o = OPP[i];
        // 1. le côté opposé s'allume (et se prolonge si le pied est dehors)
        steps.push({
          dur: 450,
          step: function (p) {
            HS[i].cote.prog.v = p;
            HS[i].etat = 1;
            show(HS[i].cote.curve, true);
            rafraichir();
          }
        });
        // 2. la hauteur descend jusqu'à son pied, puis l'angle droit apparaît
        steps.push({
          dur: 800,
          step: function (p) {
            HS[i].trait.prog.v = p;
            show(HS[i].trait.curve, true);
            // Le carré se déplie juste au moment où le trait arrive sur le pied.
            HS[i].taille.v = COTE_EQ * Math.max(0, (p - 0.7) / 0.3);
            if (HS[i].taille.v > 0) show(HS[i].equerre, true);
          },
          after: function () {
            HS[i].etat = 2;
            HS[i].taille.v = COTE_EQ;
            HS[i].cote.curve.setAttribute({ strokeOpacity: 0.18 });
            rafraichir();
          }
        });
      });
      // 3. les trois droites passent par un même point
      steps.push({
        dur: 1000,
        step: function (p) { halo.v = 1.8 * (1 - p); show(haloC, true); },
        after: function () {
          halo.v = 0;
          show(haloC, false);
          fini = true;
          show(bandeau, true);
          rafraichir();
        }
      });
      anim.runSteps(steps, effacer);
    }

    /* ==================================================================== */
    /* Contrôles                                                             */
    /* ==================================================================== */
    // Un minuteur traîne entre le déplacement des sommets et la relance de
    // l'animation : il doit mourir avec la leçon, sinon il rejouerait sur un
    // tableau déjà libéré.
    var minuteur = null;
    mv.onCleanup(function () { clearTimeout(minuteur); });

    mv.addControls([
      { type: 'button', id: 'play', label: '▶ Lancer l\'animation', onClick: jouer },
      { type: 'button', id: 'forme', label: '🔺 Changer de triangle', onClick: function () {
          forme = (forme + 1) % FORMES.length;
          effacer();
          FORMES[forme].p.forEach(function (p, i) { S[i].moveTo(p, 350); });
          // On laisse les sommets glisser jusqu'à leur place, puis on rejoue.
          clearTimeout(minuteur);
          minuteur = setTimeout(jouer, 420);
        } },
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer },
      { type: 'checkbox', id: 'circ', label: 'Cercle circonscrit (médiatrices)', checked: false,
        onChange: function (v) { voirCercle = v; rafraichir(); } }
    ]);

    // Démarrage : on joue l'animation une première fois.
    jouer();
  }
});
