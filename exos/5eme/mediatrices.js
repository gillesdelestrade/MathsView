/*
 * mediatrices — les médiatrices d'un triangle et le cercle circonscrit
 * (leçon 5ème « Les médiatrices et le cercle circonscrit »).
 *
 * Troisième volet de la série, construit comme exos/5eme/hauteurs.js et
 * exos/5eme/medianes.js. La logique est la même : une médiatrice se reconnaît à
 * DEUX conditions — être perpendiculaire au côté ET passer par son milieu — et
 * l'élève doit apprendre à les lire sur une figure autant qu'à les réciter.
 *
 *   choix       trois droites coupent le même côté ; l'une n'est pas
 *               perpendiculaire, l'autre ne passe pas par le milieu ;
 *   lire        une droite avec son codage : médiatrice, hauteur ou médiane ?
 *   concours    le point de concours s'appelle le centre du cercle circonscrit ;
 *   position    où tombe O selon la forme du triangle — le cœur de la leçon ;
 *   rayon       dans un triangle rectangle, le cercle circonscrit a
 *               l'hypoténuse pour diamètre, dans les deux sens ;
 *   equidistant un point de la médiatrice est à égale distance des extrémités ;
 *   proprietes  vrai/faux sur ce qui distingue vraiment une médiatrice.
 *
 * ---------------------------------------------------------------------------
 * Les deux leurres ne sont pas interchangeables
 * ---------------------------------------------------------------------------
 * Dans la famille « choix », chaque mauvaise droite échoue sur UNE condition et
 * une seule : la première passe bien par le milieu mais penche, la seconde est
 * bien perpendiculaire mais tombe à côté du milieu. C'est ce qui oblige à
 * vérifier les deux — un élève qui n'en retient qu'une se trompe une fois sur
 * deux. Et les écarts sont francs, jamais à un millimètre près : on ne demande
 * pas de départager deux droites à l'œil de lynx.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var T = TriOutils;

  var NOMS = ['A', 'B', 'C'];
  var VIOLET = '#7c3aed', ORANGE = '#ea580c';

  var CENTRES = [
    { cle: 'circonscrit', nom: 'Le centre du cercle circonscrit',
      quoi: 'le point de concours des <b>médiatrices</b>' },
    { cle: 'gravite', nom: 'Le centre de gravité',
      quoi: 'le point de concours des <b>médianes</b>' },
    { cle: 'ortho', nom: 'L\'orthocentre', quoi: 'le point de concours des <b>hauteurs</b>' },
    { cle: 'inscrit', nom: 'Le centre du cercle inscrit',
      quoi: 'le point de concours des <b>bissectrices</b>' }
  ];

  function ang(s) { return '\\(' + s + '\\)'; }
  function cote(o1, o2) { return ang('[' + NOMS[o1] + NOMS[o2] + ']'); }
  function tourne(v, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }

  /* ===================================================================== */
  /* 1. Laquelle des trois est la médiatrice ?                             */
  /* ===================================================================== */
  function qChoix(rnd, palier) {
    var P = T.triangle(rnd);
    var i = rnd.entier(0, 2), o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var U = P[o1], V = P[o2];
    var L = T.len(T.sub(V, U));
    var mil = T.mil(U, V);
    var dir = T.unit(T.sub(V, U));
    var n = [-dir[1], dir[0]];                 // la direction perpendiculaire
    // du côté du triangle où se trouve le sommet opposé : la droite doit
    // traverser la figure, pas la longer par l'extérieur
    if (T.dot(n, T.sub(P[i], mil)) < 0) n = [-n[0], -n[1]];

    var demi = L * 0.34;                       // toutes de la même longueur
    function droite(centre, u) {
      return { c: centre, u: u,
               de: T.add(centre, T.mul(u, demi)), a: T.add(centre, T.mul(u, -demi)) };
    }
    // Le numéro se pose où on veut le long du trait : tout au bout d'un côté ou
    // de l'autre, jamais près du croisement.
    var POSES = [0.06, 0.94];
    function etiquette(d, pos) { return T.add(d.de, T.mul(T.sub(d.a, d.de), pos)); }

    /* Les deux leurres, chacun fautif sur UNE condition :
         — penché : il passe par le milieu, mais n'est pas perpendiculaire ;
         — décalé : il est perpendiculaire, mais rate le milieu.
       Les écarts sont francs — 25° au moins, un cinquième du côté au moins. */
    var incline = (rnd.booleen(0.5) ? 1 : -1) * (25 + rnd.entier(0, 20)) * Math.PI / 180;
    var penche = droite(mil, tourne(n, incline));
    var t = rnd.booleen(0.5) ? 0.18 + rnd.entier(0, 12) / 100
                             : 0.70 + rnd.entier(0, 12) / 100;
    var decale = droite(T.add(U, T.mul(T.sub(V, U), t)), n);
    var bonne = droite(mil, n);

    var cibles = rnd.melange([{ d: bonne, cle: 'mediatrice' },
                              { d: penche, cle: 'penche' },
                              { d: decale, cle: 'decale' }]);
    /* Deux de ces droites passent par le MÊME point — le milieu du côté — et
       leurs numéros se poseraient l'un sur l'autre. Chaque numéro va donc à l'un
       des deux bouts de son trait, celui qui l'éloigne le plus des numéros déjà
       posés. */
    var poses = [];
    cibles.forEach(function (c) {
      var choisi = POSES[0], mieux = -1;
      POSES.forEach(function (pos) {
        var e = etiquette(c.d, pos);
        var d = poses.length ? Math.min.apply(null, poses.map(function (q) {
          return T.len(T.sub(q, e));
        })) : Infinity;
        if (d > mieux) { mieux = d; choisi = pos; }
      });
      c.pos = choisi;
      poses.push(etiquette(c.d, choisi));
    });
    var rang = {};
    cibles.forEach(function (c, k) { rang[c.cle] = k + 1; });

    return {
      enonce: 'Dans le triangle ' + ang(NOMS.join('')) + ', trois droites coupent le côté ' +
        cote(o1, o2) + '.' +
        T.figure({ P: P, noms: NOMS,
                   traits: cibles.map(function (c, k) {
                     return { de: c.d.de, a: c.d.a, couleur: VIOLET, num: String(k + 1),
                              pos: c.pos };
                   }) }) +
        'Laquelle est la <b>médiatrice de ' + cote(o1, o2) + '</b> ?',
      type: 'qcm',
      choix: ['La droite 1', 'La droite 2', 'La droite 3'],
      correct: rang.mediatrice - 1,
      etapes: [
        'La médiatrice de ' + cote(o1, o2) + ' doit vérifier <b>deux</b> conditions : être ' +
          '<b>perpendiculaire</b> à ce côté, <b>et</b> passer par son <b>milieu</b>. Il faut ' +
          'vérifier les deux.',
        'La droite <b>' + rang.penche + '</b> passe bien par le milieu, mais elle <b>penche</b> : ' +
          'elle ne coupe pas le côté à angle droit. Ce n\'est pas la médiatrice.',
        'La droite <b>' + rang.decale + '</b> est bien perpendiculaire au côté, mais elle le ' +
          'coupe <b>à côté du milieu</b>. Ce n\'est pas la médiatrice non plus.',
        'Seule la droite <b>' + rang.mediatrice + '</b> réunit les deux conditions : c\'est la ' +
          'médiatrice de ' + cote(o1, o2) + '.'
      ],
      indices: [
        'Deux choses à vérifier, pas une : l\'<b>angle droit</b> avec le côté, et le ' +
          '<b>milieu</b> du côté.',
        'Une droite qui passe par le milieu sans être perpendiculaire n\'est pas une ' +
          'médiatrice — et l\'inverse non plus.'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 2. Une droite avec son codage : médiatrice, hauteur ou médiane ?      */
  /* ===================================================================== */
  function qLire(rnd, palier) {
    var tir = T.trianglePlusSommet(rnd, 'acutangle');
    var P = tir.P, i = tir.i, o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var S = P[i], U = P[o1], V = P[o2];
    var mil = T.mil(U, V), pied = T.projete(S, U, V);
    var dir = T.unit(T.sub(V, U)), n = [-dir[1], dir[0]];
    if (T.dot(n, T.sub(S, mil)) < 0) n = [-n[0], -n[1]];
    var L = T.len(T.sub(V, U));

    /* Trois objets, trois codages — et c'est le codage seul qui tranche :
         médiatrice : le petit carré ET les deux demi-côtés marqués ;
         hauteur    : le petit carré seul, et elle part du sommet ;
         médiane    : les deux demi-côtés marqués seuls, et elle part du sommet. */
    var quoi = rnd.choix(['mediatrice', 'hauteur', 'mediane']);
    var opts = { P: P, noms: NOMS, traits: [], codes: [], equerres: [] };
    if (quoi === 'mediatrice') {
      opts.traits.push({ de: T.add(mil, T.mul(n, L * 0.45)),
                         a: T.add(mil, T.mul(n, -L * 0.2)), couleur: VIOLET });
      opts.equerres.push({ pied: mil, vers: V, base: T.add(mil, n) });
      opts.codes.push({ a: U, b: mil }, { a: mil, b: V });
    } else if (quoi === 'hauteur') {
      opts.traits.push({ de: S, a: pied, couleur: VIOLET });
      opts.equerres.push({ pied: pied, vers: V, base: S });
    } else {
      opts.traits.push({ de: S, a: mil, couleur: VIOLET });
      opts.codes.push({ a: U, b: mil }, { a: mil, b: V });
    }

    var REP = [
      { cle: 'mediatrice', txt: 'La médiatrice de ' + cote(o1, o2) },
      { cle: 'hauteur', txt: 'La hauteur issue de ' + ang(NOMS[i]) },
      { cle: 'mediane', txt: 'La médiane issue de ' + ang(NOMS[i]) }
    ];
    var ordre = rnd.melange(REP.slice());

    var POURQUOI = {
      mediatrice: 'Le <b>petit carré</b> dit l\'angle droit avec ' + cote(o1, o2) + ', et les ' +
        '<b>deux marques</b> disent que le point de croisement est le <b>milieu</b> du côté. ' +
        'Les deux conditions de la médiatrice sont codées. Remarque qu\'elle ne part ' +
        '<b>d\'aucun sommet</b> : c\'est ce qui la distingue au premier coup d\'œil.',
      hauteur: 'Le <b>petit carré</b> dit l\'angle droit, mais rien ne dit que le pied est au ' +
        'milieu — et la droite <b>part du sommet ' + NOMS[i] + '</b>. C\'est la <b>hauteur</b> ' +
        'issue de ' + NOMS[i] + '.',
      mediane: 'Les <b>deux marques</b> disent que le côté est coupé en son milieu, mais il n\'y ' +
        'a <b>pas d\'angle droit</b> — et la droite <b>part du sommet ' + NOMS[i] + '</b>. ' +
        'C\'est la <b>médiane</b> issue de ' + NOMS[i] + '.'
    };

    return {
      enonce: 'Voici une droite tracée dans le triangle ' + ang(NOMS.join('')) + ', avec son ' +
        'codage.' + T.figure(opts) + '<b>Qu\'est-ce que cette droite ?</b>',
      type: 'qcm',
      choix: ordre.map(function (r) { return r.txt; }),
      correct: ordre.map(function (r) { return r.cle; }).indexOf(quoi),
      etapes: [POURQUOI[quoi],
        '<b>Le tableau à retenir.</b> Médiatrice : angle droit <b>+</b> milieu, et elle ne part ' +
          'd\'aucun sommet. Hauteur : angle droit, depuis un sommet. Médiane : milieu, depuis ' +
          'un sommet.'],
      indices: ['Regarde le codage : y a-t-il un angle droit ? des marques de milieu ? les deux ?',
                'Regarde aussi d\'où part la droite — d\'un sommet, ou de nulle part ?'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 3. Comment s'appelle leur point de concours ?                         */
  /* ===================================================================== */
  function qConcours(rnd, palier) {
    var ordre = rnd.melange(CENTRES.slice());
    return {
      enonce: 'Les trois <b>médiatrices</b> d\'un triangle se coupent en un même point.<br>' +
        '<b>Comment s\'appelle ce point ?</b>',
      type: 'qcm',
      choix: ordre.map(function (c) { return c.nom; }),
      correct: ordre.map(function (c) { return c.cle; }).indexOf('circonscrit'),
      etapes: [
        'Ce point est à <b>égale distance des trois sommets</b> : c\'est donc le centre d\'un ' +
          'cercle qui passe par les trois. On l\'appelle le <b>centre du cercle circonscrit</b>, ' +
          'et on le note souvent \\(O\\).',
        'Pourquoi les trois se coupent-elles au même endroit ? Le point commun aux médiatrices ' +
          'de ' + ang('[AB]') + ' et de ' + ang('[BC]') + ' est à égale distance de \\(A\\) et ' +
          '\\(B\\), et à égale distance de \\(B\\) et \\(C\\) : il est donc à égale distance de ' +
          '\\(A\\) et de \\(C\\), et se trouve <b>forcément</b> sur la troisième.',
        'Les autres réponses vont par paires à ne pas mélanger : ' +
          CENTRES.filter(function (c) { return c.cle !== 'circonscrit'; })
                 .map(function (c) { return c.nom.toLowerCase() + ' est ' + c.quoi; })
                 .join(', ') + '.'
      ],
      indices: ['Une médiatrice, ce sont les points à égale distance des deux extrémités d\'un côté.',
                'Un point à égale distance des trois sommets est le centre d\'un cercle qui les ' +
                  'contient tous les trois.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 4. Où tombe O ? — le cœur de la leçon                                 */
  /* ===================================================================== */
  function qPosition(rnd, palier) {
    var quoi = rnd.choix(['acutangle', 'obtusangle', 'rectangle']);
    var P, droit = -1;
    if (quoi === 'rectangle') { var r = T.rectangle(rnd); P = r.P; droit = r.droit; }
    else P = T.triangle(rnd, quoi);

    var opts = { P: P, noms: NOMS };
    if (quoi === 'rectangle') {
      // On code l'angle droit : sans ça, la question devient un exercice de vue.
      var d1 = (droit + 1) % 3, d2 = (droit + 2) % 3;
      opts.equerres = [{ pied: P[droit], vers: P[d1], base: P[d2] }];
    }
    var nat = T.nature(P);

    var REP = [
      { cle: 'dedans', txt: 'À l\'intérieur du triangle' },
      { cle: 'hypo', txt: 'Sur le milieu de l\'hypoténuse' },
      { cle: 'dehors', txt: 'À l\'extérieur du triangle' },
      { cle: 'sommet', txt: 'Sur un sommet du triangle' }
    ];
    var attendu = quoi === 'acutangle' ? 'dedans' : quoi === 'rectangle' ? 'hypo' : 'dehors';
    var ordre = rnd.melange(REP.slice());

    var pourquoi = {
      acutangle: 'Ce triangle a ses <b>trois angles aigus</b> : on dit qu\'il est ' +
        '<b>acutangle</b>. Le centre du cercle circonscrit tombe <b>à l\'intérieur</b>.',
      rectangle: 'Ce triangle est <b>rectangle en ' + NOMS[droit] + '</b>. Le centre du cercle ' +
        'circonscrit est alors le <b>milieu de l\'hypoténuse</b> ' +
        cote((droit + 1) % 3, (droit + 2) % 3) + ' : le cercle circonscrit a l\'hypoténuse pour ' +
        '<b>diamètre</b>. C\'est LA propriété à retenir du triangle rectangle.',
      obtusangle: 'Ce triangle a un <b>angle obtus</b> en ' + NOMS[nat.sommet] + ' : on dit ' +
        'qu\'il est <b>obtusangle</b>. Le centre du cercle circonscrit tombe <b>à ' +
        'l\'extérieur</b> du triangle.'
    };

    return {
      enonce: 'On veut construire le <b>cercle circonscrit</b> à ce triangle, c\'est-à-dire le ' +
        'cercle qui passe par ses trois sommets.' + T.figure(opts) +
        'Sans rien tracer, où se trouve son <b>centre</b> ?',
      type: 'qcm',
      choix: ordre.map(function (x) { return x.txt; }),
      correct: ordre.map(function (x) { return x.cle; }).indexOf(attendu),
      etapes: [pourquoi[quoi],
        '<b>À retenir :</b> trois angles aigus → centre <b>dedans</b> ; un angle droit → centre ' +
          'au <b>milieu de l\'hypoténuse</b> ; un angle obtus → centre <b>dehors</b>.',
        'Rien n\'oblige ce centre à rester dans le triangle : une médiatrice ne part d\'aucun ' +
          'sommet, elle ne s\'appuie que sur un côté.'],
      indices: ['Commence par regarder les angles : y en a-t-il un droit ? un obtus ?',
                'Trois angles aigus → dedans. Un angle droit → milieu de l\'hypoténuse. ' +
                  'Un angle obtus → dehors.'],
      duree: 65
    };
  }

  /* ===================================================================== */
  /* 5. Le triangle rectangle : hypoténuse et rayon                        */
  /* ===================================================================== */
  function qRayon(rnd, palier) {
    var r = T.rectangle(rnd);
    var droit = r.droit, o1 = (droit + 1) % 3, o2 = (droit + 2) % 3;
    var opts = { P: r.P, noms: NOMS,
                 equerres: [{ pied: r.P[droit], vers: r.P[o1], base: r.P[o2] }] };
    // des nombres qui tombent juste : l'exercice porte sur la propriété
    var vers = rnd.booleen(0.5);               // hypoténuse → rayon, ou l'inverse
    var rayon = rnd.entier(5, 24) / 2;         // 2,5 à 12 cm, au demi près
    var hypo = 2 * rayon;

    return {
      enonce: 'Le triangle ' + ang(NOMS.join('')) + ' est rectangle en ' + ang(NOMS[droit]) +
        '.' + T.figure(opts) +
        (vers
          ? 'Son hypoténuse ' + cote(o1, o2) + ' mesure <b>' + O.fr(hypo) + ' cm</b>.<br>' +
            '<b>Quel est le rayon de son cercle circonscrit, en cm ?</b>'
          : 'Son cercle circonscrit a pour rayon <b>' + O.fr(rayon) + ' cm</b>.<br>' +
            '<b>Combien mesure son hypoténuse ' + cote(o1, o2) + ', en cm ?</b>'),
      type: 'nombre',
      reponse: vers ? rayon : hypo,
      etapes: [
        'Dans un triangle rectangle, le centre du cercle circonscrit est le <b>milieu de ' +
          'l\'hypoténuse</b> : le cercle a donc l\'hypoténuse pour <b>diamètre</b>.',
        'Or le rayon est la <b>moitié</b> du diamètre.',
        vers
          ? 'Le rayon vaut donc \\(' + O.fr(hypo) + ' \\div 2 = <b>' + O.fr(rayon) + '</b>\\), ' +
            'soit <b>' + O.fr(rayon) + ' cm</b>.'
          : 'L\'hypoténuse vaut donc \\(' + O.fr(rayon) + ' \\times 2 = <b>' + O.fr(hypo) +
            '</b>\\), soit <b>' + O.fr(hypo) + ' cm</b>.',
        'Autrement dit : dans un triangle rectangle, la <b>médiane issue de l\'angle droit</b> ' +
          'vaut la moitié de l\'hypoténuse — c\'est le rayon.'
      ],
      indices: ['Où est le centre du cercle circonscrit d\'un triangle rectangle ?',
                'L\'hypoténuse est un <b>diamètre</b> : le rayon en est la moitié.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 6. Un point de la médiatrice est à égale distance                     */
  /* ===================================================================== */
  function qEquidistant(rnd, palier) {
    var d = rnd.entier(15, 95) / 10;           // de 1,5 à 9,5 cm
    var surM = rnd.booleen(0.6);               // le point est-il sur la médiatrice ?
    /* L'écart se prend vers le haut quand MA est petit : une longueur négative
       n'existe pas, et « MB = −1,2 cm » n'aurait aucun sens sur une figure. */
    var ecart = rnd.entier(5, 30) / 10;
    var autre = surM ? d : (d - ecart < 0.5 ? d + ecart : d + (rnd.booleen(0.5) ? ecart : -ecart));

    if (surM) {
      return {
        enonce: 'Le point \\(M\\) est sur la <b>médiatrice</b> du segment ' + ang('[AB]') +
          '.<br>On sait que \\(MA = ' + O.fr(d) + '\\) cm.<br>' +
          '<b>Combien mesure \\(MB\\), en cm ?</b>',
        type: 'nombre',
        reponse: d,
        etapes: [
          'La médiatrice de ' + ang('[AB]') + ' est l\'ensemble des points situés à <b>égale ' +
            'distance</b> de \\(A\\) et de \\(B\\).',
          '\\(M\\) est dessus, donc \\(MB = MA = <b>' + O.fr(d) + '</b>\\) cm.',
          'C\'est cette propriété qui explique tout le reste : le point de concours des trois ' +
            'médiatrices est à égale distance des trois sommets, donc centre d\'un cercle qui ' +
            'passe par les trois.'
        ],
        indices: ['Que sait-on des points de la médiatrice de ' + ang('[AB]') + ' ?',
                  'Ils sont à égale distance de \\(A\\) et de \\(B\\).'],
        duree: 60
      };
    }
    return {
      enonce: 'On sait que \\(MA = ' + O.fr(d) + '\\) cm et \\(MB = ' + O.fr(autre) +
        '\\) cm.<br>Vrai ou faux : <b>le point \\(M\\) est sur la médiatrice de ' +
        ang('[AB]') + '</b>.',
      type: 'vraifaux',
      correct: 1,
      etapes: [
        '<b>Faux.</b> Un point est sur la médiatrice de ' + ang('[AB]') + ' <b>si et seulement ' +
          'si</b> il est à égale distance de \\(A\\) et de \\(B\\).',
        'Ici \\(MA = ' + O.fr(d) + '\\) cm et \\(MB = ' + O.fr(autre) + '\\) cm : ces deux ' +
          'distances sont différentes, donc \\(M\\) n\'est <b>pas</b> sur la médiatrice. Il est ' +
          'plus près de ' + (d < autre ? '\\(A\\)' : '\\(B\\)') + '.'
      ],
      indices: ['Compare les deux distances.'],
      duree: 55
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux : ce qui fait vraiment une médiatrice                 */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'La médiatrice d\'un côté est <b>perpendiculaire</b> à ce côté.', ok: true,
      d: 'Oui, c\'est la première des deux conditions — l\'autre étant de passer par son ' +
         'milieu. Les deux sont nécessaires.' },
    { t: 'Une médiatrice d\'un triangle passe toujours par un <b>sommet</b>.', ok: false,
      d: 'Non : elle ne s\'appuie que sur un <b>côté</b>. Ce sont les hauteurs et les médianes ' +
         'qui partent d\'un sommet. Une médiatrice ne passe par un sommet que dans un triangle ' +
         'isocèle — celle de la base, et elle seule.' },
    { t: 'Les points de la médiatrice de \\([AB]\\) sont à <b>égale distance</b> de ' +
         '\\(A\\) et de \\(B\\).', ok: true,
      d: 'Oui, et c\'est même sa définition la plus utile : c\'est elle qui sert dans toutes ' +
         'les démonstrations.' },
    { t: 'Le centre du cercle circonscrit est toujours <b>à l\'intérieur</b> du triangle.',
      ok: false,
      d: 'Non : il est dedans si le triangle a trois angles aigus, sur le milieu de ' +
         'l\'hypoténuse s\'il est rectangle, et <b>dehors</b> s\'il a un angle obtus.' },
    { t: 'Dans un triangle rectangle, le cercle circonscrit a l\'<b>hypoténuse</b> pour ' +
         'diamètre.', ok: true,
      d: 'Oui : le centre est le milieu de l\'hypoténuse, et le cercle passe par les deux ' +
         'extrémités de ce segment. Le rayon vaut donc la moitié de l\'hypoténuse.' },
    { t: 'Dans un triangle <b>isocèle</b>, la médiatrice de la base est aussi la hauteur, la ' +
         'médiane et la bissectrice issues du sommet principal.', ok: true,
      d: 'Oui : une seule droite pour quatre rôles. C\'est l\'axe de symétrie du triangle.' },
    { t: 'Une droite qui coupe un côté en son milieu est une <b>médiatrice</b>.', ok: false,
      d: 'Non, il y manque l\'angle droit. Une droite qui passe par le milieu sans être ' +
         'perpendiculaire n\'est pas une médiatrice — c\'est d\'ailleurs le cas de presque ' +
         'toutes les médianes.' },
    { t: 'Un triangle a <b>un seul</b> cercle circonscrit.', ok: true,
      d: 'Oui : les trois médiatrices n\'ont qu\'un point commun, donc un seul centre possible, ' +
         'et un seul rayon.' },
    { t: 'Dans un triangle <b>équilatéral</b>, le centre du cercle circonscrit et le centre de ' +
         'gravité sont confondus.', ok: true,
      d: 'Oui, et l\'orthocentre et le centre du cercle inscrit aussi : les quatre points sont ' +
         'au même endroit. C\'est le seul triangle où cela arrive.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Une médiatrice, ce sont <b>deux</b> conditions : perpendiculaire au côté, et ' +
               'passant par son milieu. Et elle ne part d\'aucun sommet.'],
      indices: ['Reviens aux deux conditions de la définition.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'mediatrices', competence: 'mediatrices', level: '5eme',
    titre: 'Les médiatrices et le cercle circonscrit', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'concours', 'choix', 'equidistant'] :
        palier === 2 ? ['choix', 'lire', 'concours', 'equidistant', 'proprietes'] :
        palier === 3 ? ['lire', 'position', 'choix', 'rayon', 'proprietes'] :
                       ['position', 'rayon', 'lire', 'position', 'equidistant']);

      if (quoi === 'choix') return qChoix(rnd, palier);
      if (quoi === 'lire') return qLire(rnd, palier);
      if (quoi === 'concours') return qConcours(rnd, palier);
      if (quoi === 'position') return qPosition(rnd, palier);
      if (quoi === 'rayon') return qRayon(rnd, palier);
      if (quoi === 'equidistant') return qEquidistant(rnd, palier);
      return qProprietes(rnd, palier);
    }
  });

})();
