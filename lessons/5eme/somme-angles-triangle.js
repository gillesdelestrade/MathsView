/*
 * La somme des angles d'un triangle (5ème) — 180°, et pourquoi.
 *
 * ---------------------------------------------------------------------------
 * L'idée de la figure : deux moitiés qui se répondent
 * ---------------------------------------------------------------------------
 * À GAUCHE, un triangle dont on déplace librement les trois sommets. À DROITE,
 * un point posé sur une droite. L'animation prend les trois angles du triangle,
 * en fabrique une COPIE, et va les poser l'un contre l'autre autour de ce point.
 * Les trois copies remplissent exactement le demi-tour — et cela reste vrai
 * quel que soit le triangle qu'on fabrique en tirant sur les sommets.
 *
 * Un angle qui voyage ne doit jamais changer de taille : pendant tout le trajet,
 * seuls le CENTRE et l'ORIENTATION du secteur bougent. Son ouverture, elle, est
 * celle du triangle, et le reste. C'est la seule façon pour que l'empilement
 * démontre quelque chose plutôt que de le suggérer.
 *
 * ---------------------------------------------------------------------------
 * Constater ne suffit pas : la démonstration
 * ---------------------------------------------------------------------------
 * L'empilement montre que ça marche sur CE triangle-ci, puis sur celui-là. Ce
 * n'est pas une preuve. La suite de l'animation trace donc, par le sommet C, la
 * PARALLÈLE au côté [AB]. Deux angles alternes-internes apparaissent :
 *   — entre cette parallèle et (CA), un angle égal à Â ;
 *   — entre cette parallèle et (CB), un angle égal à B̂.
 * Ces deux-là, plus Ĉ, se suivent le long d'une droite : leur somme est un
 * angle plat. Donc Â + B̂ + Ĉ = 180°, pour TOUS les triangles à la fois.
 * C'est exactement la propriété des angles alternes-internes vue dans la leçon
 * « Angles et droites parallèles » — d'où l'intérêt de l'avoir faite avant.
 *
 * ---------------------------------------------------------------------------
 * Les mesures affichées
 * ---------------------------------------------------------------------------
 * Les trois angles sont calculés à partir des coordonnées : ce sont des nombres
 * à virgule, presque jamais entiers. On les arrondit au degré, mais PAS chacun
 * dans son coin — trois arrondis indépendants donneraient parfois 179 ou 181,
 * et l'élève aurait sous les yeux une somme fausse dans une leçon qui affirme
 * le contraire. On répartit donc l'arrondi (méthode dite du plus fort reste) de
 * sorte que les trois entiers affichés fassent toujours exactement 180.
 */
MathsView.register({
  id: 'somme-angles-triangle',
  title: 'La somme des angles d\'un triangle',
  level: '5eme',
  category: 'geometrie',
  subcategory: 'Figures planes',
  theme: 'Géométrie — la somme des angles d\'un triangle vaut 180°',
  exercices: ['somme-angles'],
  description:
    'Dans <strong>n\'importe quel</strong> triangle, la somme des trois angles vaut ' +
    '<strong>180°</strong> — un <strong>angle plat</strong>.' +
    '<br>À gauche, le triangle : <strong>déplace ses sommets</strong>, il change de forme. ' +
    'À droite, l\'animation <strong>recopie ses trois angles</strong> et les pose l\'un ' +
    'contre l\'autre autour d\'un point : ensemble, ils forment toujours exactement un ' +
    'demi-tour.' +
    '<br>La fin de l\'animation montre <strong>pourquoi</strong> : en traçant la parallèle ' +
    'à \\((AB)\\) qui passe par \\(C\\), les angles \\(\\widehat{A}\\) et ' +
    '\\(\\widehat{B}\\) se retrouvent <strong>à côté de</strong> \\(\\widehat{C}\\), le long ' +
    'd\'une droite.',
  notes:
    '<ul>' +
    '<li><strong>La propriété.</strong> Dans tout triangle \\(ABC\\) : ' +
    '\\(\\widehat{A} + \\widehat{B} + \\widehat{C} = 180°\\). Elle ne dépend ni de la ' +
    'forme, ni de la taille du triangle.</li>' +
    '<li><strong>À quoi ça sert.</strong> Connaissant deux angles, on trouve le troisième ' +
    'par une soustraction : \\(\\widehat{C} = 180° - \\widehat{A} - \\widehat{B}\\).</li>' +
    '<li><strong>La démonstration.</strong> On trace la parallèle à \\((AB)\\) passant par ' +
    '\\(C\\). La sécante \\((AC)\\) coupe deux parallèles : les angles ' +
    '<em>alternes-internes</em> qu\'elle forme sont égaux, donc l\'angle entre la parallèle ' +
    'et \\((CA)\\) vaut \\(\\widehat{A}\\). De même de l\'autre côté avec \\((BC)\\) : on ' +
    'retrouve \\(\\widehat{B}\\). Ces deux angles et \\(\\widehat{C}\\) se suivent le long ' +
    'de la parallèle : leur somme est un <strong>angle plat</strong>.</li>' +
    '<li><strong>Constater n\'est pas démontrer.</strong> Empiler les angles de dix ' +
    'triangles ne prouve rien pour le onzième. La démonstration, elle, vaut d\'un coup ' +
    'pour tous : c\'est ce qui la rend indispensable.</li>' +
    '<li><strong>Conséquences immédiates.</strong> Un triangle ne peut avoir ' +
    '<em>qu\'un seul</em> angle droit ou obtus (deux feraient déjà 180° à eux seuls). ' +
    'Dans un triangle <em>équilatéral</em>, les trois angles valent \\(180 \\div 3 = 60°\\). ' +
    'Dans un triangle <em>rectangle</em>, les deux angles aigus font ensemble ' +
    '\\(180° - 90° = 90°\\) : ils sont <em>complémentaires</em>.</li>' +
    '<li><strong>Attention au triangle aplati.</strong> Si les trois points sont alignés, ' +
    'il n\'y a plus de triangle : la figure le signale.</li>' +
    '</ul>',
  board: { boundingbox: [-11.5, 6.4, 11.5, -6.4], keepaspectratio: true, axis: false },

  setup: function (board, mv) {
    /* ==================================================================== */
    /* Palette — une couleur par angle, tenue d'un bout à l'autre           */
    /* ==================================================================== */
    /* C'est elle qui fait le lien entre les deux moitiés de la figure : le
       secteur rouge de gauche et le secteur rouge de droite sont le même
       angle. Sans cette constance, l'empilement ne raconterait rien. */
    var INK = '#334155';                                   // les côtés
    var SOM = '#2563eb';                                   // les sommets
    var COUL = ['#dc2626', '#059669', '#7c3aed'];          // Â, B̂, Ĉ
    var GUIDE = '#94a3b8';
    var PARA = '#ea580c';                                  // la parallèle
    var PLAT = '#0f172a';

    /* ==================================================================== */
    /* Outillage                                                            */
    /* ==================================================================== */
    var anim = mv.createAnimator();

    function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
    function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
    function mul(a, k) { return [a[0] * k, a[1] * k]; }
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
    function cross(a, b) { return a[0] * b[1] - a[1] * b[0]; }
    function len(a) { return Math.sqrt(dot(a, a)); }
    function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
    function pol(c, a, r) { return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]; }

    // Afficher / masquer, en mémorisant : dans JSXGraph, setAttribute déclenche
    // à lui seul une mise à jour complète du tableau, et l'animation repasse par
    // ici à chaque image.
    function show(o, v) {
      v = !!v;
      if (o.__vu === v) return;
      o.__vu = v;
      o.setAttribute({ visible: v });
    }
    function attr(o, k, v) {
      if (!o.__a) o.__a = {};
      if (o.__a[k] === v) return;
      o.__a[k] = v;
      var d = {}; d[k] = v;
      o.setAttribute(d);
    }

    /* ==================================================================== */
    /* Le triangle                                                          */
    /* ==================================================================== */
    /* Les formes ne sont pas décoratives : le rectangle et l'équilatéral sont
       les deux cas dont on tire des conséquences dans les notes. */
    var FORMES = [
      { nom: 'quelconque', p: [[-9.4, -3.4], [-2.2, -4.2], [-5.2, 3.4]] },
      { nom: 'rectangle', p: [[-9.2, -3.6], [-2.6, -3.6], [-9.2, 3.2]] },
      { nom: 'équilatéral', p: [[-9.2, -3.4], [-2.6, -3.4], [-5.9, 2.31]] },
      { nom: 'aplati', p: [[-9.4, -1.2], [-2.4, 0.6], [-6.2, -0.38]] }
    ];
    var forme = 0;

    var NOMS = ['A', 'B', 'C'];
    var DECAL = [[-18, -8], [14, -10], [0, 18]];

    var S = FORMES[0].p.map(function (p, i) {
      return board.create('point', p, {
        name: NOMS[i], size: 4, color: SOM, showInfobox: false,
        label: { offset: DECAL[i], fontSize: 17, strokeColor: SOM,
                 cssStyle: 'font-weight:700' }
      });
    });
    function P(i) { return [S[i].X(), S[i].Y()]; }

    // Les sommets restent dans la moitié gauche : la moitié droite appartient
    // à l'empilement, et un triangle qui viendrait s'y promener rendrait la
    // figure illisible.
    S.forEach(function (pt) {
      pt.on('drag', function () {
        var x = Math.max(-10.6, Math.min(-1.4, pt.X()));
        var y = Math.max(-5.4, Math.min(5.4, pt.Y()));
        if (x !== pt.X() || y !== pt.Y()) pt.setPosition(JXG.COORDS_BY_USER, [x, y]);
      });
    });

    board.create('polygon', [S[0], S[1], S[2]], {
      borders: { strokeColor: INK, strokeWidth: 2.6, highlight: false },
      fillColor: '#2563eb', fillOpacity: 0.05, vertices: { visible: false },
      highlight: false, hasInnerPoints: false
    });

    /* -- les trois angles, mesurés ---------------------------------------
       Pour chaque sommet : l'ouverture (toujours entre 0 et 180°) et la
       direction depuis laquelle il faut tourner DANS LE SENS DIRECT pour
       balayer l'angle. C'est cette direction de départ qui permettra de faire
       pivoter la copie sans jamais la déformer. */
    function angles() {
      var out = [];
      for (var i = 0; i < 3; i++) {
        var V = P(i), u = unit(sub(P((i + 1) % 3), V)), w = unit(sub(P((i + 2) % 3), V));
        var ouv = Math.acos(Math.max(-1, Math.min(1, dot(u, w))));
        var d = cross(u, w) > 0 ? u : w;         // tourner de d vers l'autre côté
        out.push({ V: V, ouv: ouv, a0: Math.atan2(d[1], d[0]) });
      }
      return out;
    }
    function plat() {                            // les trois points alignés ?
      var A = P(0), B = P(1), C = P(2);
      return Math.abs(cross(sub(B, A), sub(C, A))) < 0.25;
    }

    /* Le rayon des secteurs : le même pour les trois, sinon l'empilement ne
       ferait pas un demi-disque propre. On le limite au tiers du plus court
       côté pour que les marques ne se chevauchent pas dans un triangle étroit. */
    function rayon() {
      var m = Infinity;
      for (var i = 0; i < 3; i++) m = Math.min(m, len(sub(P((i + 1) % 3), P(i))));
      return Math.max(0.75, Math.min(1.7, m / 3));
    }

    /* Les mesures affichées, en degrés entiers dont la somme fait 180.
       On arrondit vers le bas, puis on rend les degrés manquants aux angles
       dont la partie décimale est la plus grande. */
    function mesures() {
      var A = angles().map(function (a) { return a.ouv * 180 / Math.PI; });
      var bas = A.map(Math.floor);
      var reste = 180 - (bas[0] + bas[1] + bas[2]);
      var ordre = [0, 1, 2].sort(function (i, j) {
        return (A[j] - bas[j]) - (A[i] - bas[i]);
      });
      for (var k = 0; k < reste && k < 3; k++) bas[ordre[k]]++;
      return bas;
    }

    /* ==================================================================== */
    /* Un secteur angulaire, dessiné à la main                              */
    /* ==================================================================== */
    /* `get()` rend { c, a0, ouv, r } : centre, direction de départ, ouverture,
       rayon. Le tracé part du centre, sort jusqu'au bord, décrit l'arc, et
       revient : la courbe est fermée, donc remplie. */
    var N_SEC = 44;
    function secteur(get, style) {
      function pt(u) {
        var g = get();
        var BORD = 0.14;                       // la part des deux rayons
        if (u < BORD) return pol(g.c, g.a0, g.r * (u / BORD));
        if (u > 1 - BORD) return pol(g.c, g.a0 + g.ouv, g.r * ((1 - u) / BORD));
        return pol(g.c, g.a0 + g.ouv * ((u - BORD) / (1 - 2 * BORD)), g.r);
      }
      return board.create('curve', [
        function (u) { return pt(u)[0]; },
        function (u) { return pt(u)[1]; },
        0, 1
      ], Object.assign({
        numberPointsHigh: N_SEC, numberPointsLow: N_SEC, fillOpacity: 0.3,
        strokeWidth: 2.2, highlight: false, visible: false
      }, style));
    }

    /* ==================================================================== */
    /* La moitié droite : le point O et sa droite                           */
    /* ==================================================================== */
    var O = [4.6, -2.9];
    var LARG = 5.6;

    var droite = board.create('segment',
      [[O[0] - LARG, O[1]], [O[0] + LARG, O[1]]],
      { strokeColor: PLAT, strokeWidth: 2.6, fixed: true, highlight: false, visible: false });
    var ptO = board.create('point', O, {
      name: 'O', size: 3.5, color: PLAT, fixed: true, showInfobox: false, visible: false,
      label: { offset: [-6, -20], fontSize: 15, strokeColor: PLAT, cssStyle: 'font-weight:700' }
    });

    /* ==================================================================== */
    /* Avancement de l'animation                                            */
    /* ==================================================================== */
    var pMarque = 0;              // les angles apparaissent sur le triangle
    var pVol = [0, 0, 0];         // le voyage de chaque copie
    var pPlat = 0;                // la droite, l'accolade, « 180° »
    var pPara = 0;                // la parallèle par C
    var pAlt = 0;                 // les deux angles alternes-internes
    var pConc = 0;                // la conclusion

    /* Où en est la copie i : entre son sommet et le point O. */
    function copie(i) {
      var A = angles(), a = A[i], r = rayon(), t = pVol[i];
      // l'angle de départ visé : les copies se posent l'une après l'autre
      var vise = 0;
      for (var k = 0; k < i; k++) vise += A[k].ouv;
      // on tourne par le plus court chemin
      var ecart = vise - a.a0;
      while (ecart > Math.PI) ecart -= 2 * Math.PI;
      while (ecart < -Math.PI) ecart += 2 * Math.PI;
      return {
        c: add(a.V, mul(sub(O, a.V), t)),
        a0: a.a0 + ecart * t,
        ouv: a.ouv,                            // JAMAIS touchée : c'est une copie
        r: r
      };
    }

    /* ==================================================================== */
    /* Les objets                                                           */
    /* ==================================================================== */
    // 1. les trois angles marqués sur le triangle (ils RESTENT en place)
    var marques = [0, 1, 2].map(function (i) {
      return secteur(function () {
        var a = angles()[i];
        return { c: a.V, a0: a.a0, ouv: a.ouv, r: rayon() * pMarque };
      }, { strokeColor: COUL[i], fillColor: COUL[i] });
    });
    // leur étiquette : la lettre, au milieu de l'ouverture
    var etiqTri = [0, 1, 2].map(function (i) {
      return board.create('text', [
        function () { var a = angles()[i]; return pol(a.V, a.a0 + a.ouv / 2, rayon() * 0.62)[0]; },
        function () { var a = angles()[i]; return pol(a.V, a.a0 + a.ouv / 2, rayon() * 0.62)[1]; },
        function () { return ['A', 'B', 'C'][i]; }
      ], { fontSize: 14, color: COUL[i], cssStyle: 'font-weight:800', fixed: true,
           anchorX: 'middle', anchorY: 'middle', highlight: false, visible: false });
    });

    // 2. les trois copies qui voyagent
    var volants = [0, 1, 2].map(function (i) {
      return secteur(function () { return copie(i); },
        { strokeColor: COUL[i], fillColor: COUL[i], dash: 0 });
    });
    var etiqVol = [0, 1, 2].map(function (i) {
      return board.create('text', [
        function () { var g = copie(i); return pol(g.c, g.a0 + g.ouv / 2, g.r * 0.66)[0]; },
        function () { var g = copie(i); return pol(g.c, g.a0 + g.ouv / 2, g.r * 0.66)[1]; },
        function () { return mesures()[i] + '°'; }
      ], { fontSize: 14, color: COUL[i], cssStyle: 'font-weight:800', fixed: true,
           anchorX: 'middle', anchorY: 'middle', highlight: false, visible: false });
    });

    // 3. « 180° », sous la droite
    var texte180 = board.create('text', [O[0], O[1] - 0.95, function () {
      var m = mesures();
      return m[0] + '° + ' + m[1] + '° + ' + m[2] + '° = 180°';
    }], { fontSize: 17, color: PLAT, cssStyle: 'font-weight:800', fixed: true,
          anchorX: 'middle', highlight: false, visible: false });
    var texteAngle = board.create('text', [O[0], O[1] + 2.6, 'un angle plat'], {
      fontSize: 14, color: GUIDE, cssStyle: 'font-style:italic', fixed: true,
      anchorX: 'middle', highlight: false, visible: false });

    /* ==================================================================== */
    /* La démonstration : la parallèle à (AB) par C                         */
    /* ==================================================================== */
    /* Le sens de (AB) est celui qui va de A vers B. Vue de C, la parallèle
       part donc d'un côté vers −u (du côté de A) et de l'autre vers +u (du
       côté de B) : c'est ce qui met l'angle égal à Â du côté de A. */
    function uAB() { return unit(sub(P(1), P(0))); }
    var paraSeg = board.create('curve', [
      function (t) { return P(2)[0] + uAB()[0] * (t * 2 - 1) * 4.2 * pPara; },
      function (t) { return P(2)[1] + uAB()[1] * (t * 2 - 1) * 4.2 * pPara; },
      0, 1
    ], { numberPointsHigh: 2, numberPointsLow: 2, strokeColor: PARA, strokeWidth: 2.4,
         dash: 2, highlight: false, visible: false });

    /* Les deux angles alternes-internes, au sommet C.
       `entre` rend le secteur qui va de d1 à d2 dans le sens direct, en
       choisissant celui des deux qui mesure moins d'un angle plat. */
    function entre(centre, d1, d2, r) {
      var a1 = Math.atan2(d1[1], d1[0]), a2 = Math.atan2(d2[1], d2[0]);
      var ouv = a2 - a1;
      while (ouv < 0) ouv += 2 * Math.PI;
      if (ouv > Math.PI) { a1 = a2; ouv = 2 * Math.PI - ouv; }
      return { c: centre, a0: a1, ouv: ouv, r: r };
    }
    function rayonC() { return Math.max(0.6, rayon() * 0.8); }
    // du côté de A : entre la parallèle (sens −u) et (CA) → c'est Â
    var altA = secteur(function () {
      return entre(P(2), mul(uAB(), -1), unit(sub(P(0), P(2))), rayonC() * pAlt);
    }, { strokeColor: COUL[0], fillColor: COUL[0] });
    // du côté de B : entre (CB) et la parallèle (sens +u) → c'est B̂
    var altB = secteur(function () {
      return entre(P(2), unit(sub(P(1), P(2))), uAB(), rayonC() * pAlt);
    }, { strokeColor: COUL[1], fillColor: COUL[1] });
    var etiqAlt = [0, 1].map(function (k) {
      return board.create('text', [
        function () {
          var g = k === 0 ? entre(P(2), mul(uAB(), -1), unit(sub(P(0), P(2))), rayonC())
                          : entre(P(2), unit(sub(P(1), P(2))), uAB(), rayonC());
          return pol(g.c, g.a0 + g.ouv / 2, g.r * 0.68)[0];
        },
        function () {
          var g = k === 0 ? entre(P(2), mul(uAB(), -1), unit(sub(P(0), P(2))), rayonC())
                          : entre(P(2), unit(sub(P(1), P(2))), uAB(), rayonC());
          return pol(g.c, g.a0 + g.ouv / 2, g.r * 0.68)[1];
        },
        function () { return mesures()[k] + '°'; }
      ], { fontSize: 13, color: COUL[k], cssStyle: 'font-weight:800', fixed: true,
           anchorX: 'middle', anchorY: 'middle', highlight: false, visible: false });
    });
    var texteDemo = board.create('text', [
      function () { return P(2)[0]; },
      function () { return P(2)[1] + rayonC() + 0.75; },
      'le long de la parallèle : un angle plat'
    ], { fontSize: 13, color: PARA, cssStyle: 'font-weight:700', fixed: true,
         anchorX: 'middle', highlight: false, visible: false });

    /* ==================================================================== */
    /* Le bandeau                                                           */
    /* ==================================================================== */
    var panneau = document.createElement('div');
    panneau.className = 'sat-panneau';
    var dernier = '';

    function rendrePanneau() {
      var m = mesures(), h;
      if (plat()) {
        h = '<p class="sat-alerte">Les trois points sont <b>alignés</b> : il n\'y a plus ' +
            'de triangle. Écarte un sommet de la droite formée par les deux autres.</p>';
      } else {
        h = '<div class="sat-lignes">' +
          [0, 1, 2].map(function (i) {
            return '<span class="sat-mes" style="color:' + COUL[i] + '">' +
              '<b>' + NOMS[i] + '</b> <span class="sat-val">' + m[i] + '°</span></span>';
          }).join('<span class="sat-plus">+</span>') +
          '<span class="sat-plus">=</span>' +
          '<span class="sat-somme">180°</span></div>' +
          '<p class="sat-sous">Les mesures sont arrondies au degré, mais leur somme est ' +
          '<b>exactement</b> 180° : c\'est une propriété, pas une coïncidence de calcul.</p>';
        if (pConc > 0.9) {
          h += '<div class="sat-demo"><b>La démonstration.</b> La parallèle à ' +
            '\\((AB)\\) passant par \\(C\\) est coupée par la sécante \\((AC)\\) : les ' +
            'angles <b>alternes-internes</b> sont égaux, donc l\'angle entre cette ' +
            'parallèle et \\((CA)\\) vaut \\(\\widehat{A}\\). De même avec \\((BC)\\) : on ' +
            'retrouve \\(\\widehat{B}\\). Ces deux angles et \\(\\widehat{C}\\) se suivent ' +
            'le long d\'une droite : leur somme est un <b>angle plat</b>.<br>' +
            'Ce raisonnement ne parle d\'aucun triangle en particulier : il vaut ' +
            '<b>pour tous</b>.</div>';
        } else if (pPlat > 0.9) {
          h += '<p class="sat-note">Les trois copies remplissent le demi-tour <b>sans trou ' +
            'ni chevauchement</b>. Déplace un sommet : elles changent de taille, mais elles ' +
            'continuent de le remplir exactement.</p>';
        }
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
      var aplati = plat();
      [0, 1, 2].forEach(function (i) {
        show(marques[i], pMarque > 0.02 && !aplati);
        show(etiqTri[i], pMarque > 0.9 && !aplati);
        show(volants[i], pVol[i] > 0.02 && !aplati);
        show(etiqVol[i], pVol[i] > 0.55 && !aplati);
      });
      show(droite, pVol[0] > 0.02 && !aplati);
      show(ptO, pVol[0] > 0.02 && !aplati);
      show(texte180, pPlat > 0.5 && !aplati);
      show(texteAngle, pPlat > 0.2 && !aplati);
      show(paraSeg, pPara > 0.02 && !aplati);
      show(altA, pAlt > 0.02 && !aplati);
      show(altB, pAlt > 0.02 && !aplati);
      show(etiqAlt[0], pAlt > 0.9 && !aplati);
      show(etiqAlt[1], pAlt > 0.9 && !aplati);
      show(texteDemo, pConc > 0.3 && !aplati);
      rendrePanneau();
    }

    /* ==================================================================== */
    /* Animation                                                            */
    /* ==================================================================== */
    function effacer() {
      anim.cancel();
      pMarque = 0; pVol = [0, 0, 0]; pPlat = 0; pPara = 0; pAlt = 0; pConc = 0;
      board.update();
    }
    function tout() {
      anim.cancel();
      pMarque = 1; pVol = [1, 1, 1]; pPlat = 1; pPara = 1; pAlt = 1; pConc = 1;
      board.update();
    }
    function jouer() {
      anim.cancel();
      effacer();
      anim.runSteps([
        { dur: 800,  step: function (q) { pMarque = q; } },
        { dur: 1200, step: function (q) { pMarque = 1; pVol[0] = q; } },
        { dur: 1200, step: function (q) { pVol[0] = 1; pVol[1] = q; } },
        { dur: 1200, step: function (q) { pVol[1] = 1; pVol[2] = q; } },
        { dur: 700,  step: function (q) { pVol[2] = 1; pPlat = q; } },
        { dur: 800,  step: function (q) { pPlat = 1; pPara = q; } },
        { dur: 800,  step: function (q) { pPara = 1; pAlt = q; } },
        { dur: 600,  step: function (q) { pAlt = 1; pConc = q; } }
      ], effacer);
    }

    /* ==================================================================== */
    /* Contrôles                                                            */
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
      { type: 'button', id: 'reset', label: '↺ Réinitialiser', onClick: effacer }
    ]);

    mv.extras.appendChild(panneau);
    board.on('update', rafraichir);
    jouer();
  }
});
