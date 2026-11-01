/*
 * bissectrices — les bissectrices des angles d'un triangle et le cercle
 * inscrit (leçon 5ème « Les bissectrices et le cercle inscrit »).
 *
 * Quatrième volet de la série, construit comme exos/5eme/hauteurs.js,
 * medianes.js et mediatrices.js. Une bissectrice se reconnaît à UNE chose —
 * elle partage l'angle en deux angles égaux — et se confond facilement avec
 * les deux autres droites qui partent du même sommet : la médiane (qui va au
 * milieu du côté opposé) et la hauteur (perpendiculaire au côté opposé).
 *
 *   choix       trois demi-droites partent du même sommet, sans codage : la
 *               bissectrice, la médiane et la hauteur — laquelle partage
 *               l'angle en deux ?
 *   lire        une demi-droite avec son codage : deux arcs égaux, un petit
 *               carré ou deux marques de milieu — bissectrice, hauteur ou
 *               médiane ?
 *   concours    le point de concours s'appelle le centre du cercle inscrit ;
 *   moitie      l'angle est donné, on cherche le demi-angle — ou l'inverse ;
 *   distance    un point de la bissectrice est à égale distance des deux
 *               côtés ; le rayon du cercle inscrit est la distance de I à un
 *               côté ;
 *   position    où tombe le centre du cercle INSCRIT (toujours dedans), et,
 *               pour ne pas confondre, celui du cercle CIRCONSCRIT ;
 *   proprietes  vrai/faux sur ce qui distingue vraiment une bissectrice.
 *
 * ---------------------------------------------------------------------------
 * Les leurres sont de vraies droites remarquables
 * ---------------------------------------------------------------------------
 * Dans « choix », les deux mauvaises réponses ne sont pas des traits au
 * hasard : ce sont la médiane et la hauteur issues du même sommet, tracées
 * exactement. C'est la confusion réelle — trois droites qui partent d'un
 * sommet et traversent le triangle — et c'est l'angle, et lui seul, qui
 * tranche. Le triangle est choisi pour que les trois soient franchement
 * écartées (au moins 9° entre deux d'entre elles au sommet).
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var T = TriOutils;

  var NOMS = ['A', 'B', 'C'];
  var VIOLET = '#7c3aed', ORANGE = '#ea580c';
  var DEG = Math.PI / 180;

  var CENTRES = [
    { cle: 'inscrit', nom: 'Le centre du cercle inscrit',
      quoi: 'le point de concours des <b>bissectrices</b>' },
    { cle: 'circonscrit', nom: 'Le centre du cercle circonscrit',
      quoi: 'le point de concours des <b>médiatrices</b>' },
    { cle: 'gravite', nom: 'Le centre de gravité',
      quoi: 'le point de concours des <b>médianes</b>' },
    { cle: 'ortho', nom: 'L\'orthocentre', quoi: 'le point de concours des <b>hauteurs</b>' }
  ];

  function tex(s) { return '\\(' + s + '\\)'; }
  function angleNom(i) { return tex('\\widehat{' + NOMS[(i + 1) % 3] + NOMS[i] + NOMS[(i + 2) % 3] + '}'); }
  function cote(o1, o2) { return tex('[' + NOMS[o1] + NOMS[o2] + ']'); }
  function droite(o1, o2) { return tex('(' + NOMS[o1] + NOMS[o2] + ')'); }
  function angleEntre(u, v) {
    return Math.acos(Math.max(-1, Math.min(1, T.dot(T.unit(u), T.unit(v))))) / DEG;
  }
  // Le point où la bissectrice issue de i coupe le côté opposé (il partage ce
  // côté dans le rapport des côtés adjacents).
  function piedBis(P, i) {
    var o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var l1 = T.len(T.sub(P[o2], P[i])), l2 = T.len(T.sub(P[o1], P[i]));
    return T.add(T.mul(P[o1], l1 / (l1 + l2)), T.mul(P[o2], l2 / (l1 + l2)));
  }
  // Un triangle acutangle et un sommet où bissectrice, médiane et hauteur
  // font entre elles au moins `ecart` degrés.
  function triangleEcarte(rnd, ecart) {
    for (var essai = 0; essai < 120; essai++) {
      var P = T.triangle(rnd, 'acutangle');
      var bons = [0, 1, 2].filter(function (i) {
        var o1 = (i + 1) % 3, o2 = (i + 2) % 3;
        var dB = T.sub(piedBis(P, i), P[i]), dM = T.sub(T.mil(P[o1], P[o2]), P[i]),
            dH = T.sub(T.projete(P[i], P[o1], P[o2]), P[i]);
        return angleEntre(dB, dM) >= ecart && angleEntre(dB, dH) >= ecart && angleEntre(dM, dH) >= ecart;
      });
      if (bons.length) return { P: P, i: rnd.choix(bons) };
    }
    return { P: [[-6, 6], [-8, -4], [8, -4]], i: 0 };
  }

  /* ===================================================================== */
  /* 1. Laquelle des trois est la bissectrice ?                            */
  /* ===================================================================== */
  function qChoix(rnd, palier) {
    var tir = triangleEcarte(rnd, 9), P = tir.P, i = tir.i;
    var o1 = (i + 1) % 3, o2 = (i + 2) % 3, S = P[i];
    var cibles = rnd.melange([
      { cle: 'bissectrice', bout: piedBis(P, i) },
      { cle: 'mediane', bout: T.mil(P[o1], P[o2]) },
      { cle: 'hauteur', bout: T.projete(S, P[o1], P[o2]) }
    ]);
    var rang = {};
    cibles.forEach(function (c, k) { rang[c.cle] = k + 1; });
    return {
      enonce: 'Dans le triangle ' + tex(NOMS.join('')) + ', trois demi-droites partent du sommet ' +
        tex(NOMS[i]) + '.' +
        T.figure({ P: P, noms: NOMS,
                   traits: cibles.map(function (c, k) {
                     return { de: S, a: c.bout, couleur: VIOLET, num: String(k + 1), pos: 0.9 };
                   }) }) +
        'Laquelle est la <b>bissectrice de l\'angle ' + angleNom(i) + '</b> ?',
      type: 'qcm',
      choix: ['La droite 1', 'La droite 2', 'La droite 3'],
      correct: rang.bissectrice - 1,
      etapes: [
        'La bissectrice de l\'angle ' + angleNom(i) + ' partage cet angle en <b>deux angles égaux</b> : ' +
          'elle fait le même angle avec ' + cote(i, o1) + ' et avec ' + cote(i, o2) + '. Elle ne regarde ' +
          '<b>pas</b> le côté opposé.',
        'La droite <b>' + rang.mediane + '</b> va au <b>milieu</b> du côté opposé ' + cote(o1, o2) +
          ' : c\'est la <b>médiane</b>. Elle ne partage pas l\'angle en deux (sauf dans un triangle isocèle).',
        'La droite <b>' + rang.hauteur + '</b> arrive <b>perpendiculairement</b> sur ' + cote(o1, o2) +
          ' : c\'est la <b>hauteur</b>. Elle non plus ne partage pas l\'angle en deux.',
        'Seule la droite <b>' + rang.bissectrice + '</b> fait deux angles égaux en ' + tex(NOMS[i]) +
          ' : c\'est la bissectrice.'
      ],
      indices: ['Regarde l\'angle au sommet ' + tex(NOMS[i]) + ', pas le côté opposé : laquelle le coupe en deux parts égales ?',
                'Celle qui va au milieu du côté est la médiane ; celle qui arrive à angle droit est la hauteur.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 2. Une demi-droite avec son codage : bissectrice, hauteur, médiane ?  */
  /* ===================================================================== */
  function qLire(rnd, palier) {
    var tir = triangleEcarte(rnd, 7), P = tir.P, i = tir.i;
    var o1 = (i + 1) % 3, o2 = (i + 2) % 3, S = P[i], U = P[o1], V = P[o2];
    var quoi = rnd.choix(['bissectrice', 'bissectrice', 'hauteur', 'mediane']);
    var opts = { P: P, noms: NOMS, traits: [], codes: [], equerres: [], arcs: [] };
    if (quoi === 'bissectrice') {
      var D = piedBis(P, i);
      opts.traits.push({ de: S, a: D, couleur: VIOLET });
      opts.arcs.push({ V: S, de: U, a: D, n: 1 }, { V: S, de: D, a: V, n: 1 });
    } else if (quoi === 'hauteur') {
      var H = T.projete(S, U, V);
      opts.traits.push({ de: S, a: H, couleur: VIOLET });
      opts.equerres.push({ pied: H, vers: V, base: S });
    } else {
      var M = T.mil(U, V);
      opts.traits.push({ de: S, a: M, couleur: VIOLET });
      opts.codes.push({ a: U, b: M }, { a: M, b: V });
    }
    var REP = [
      { cle: 'bissectrice', txt: 'La bissectrice de l\'angle ' + angleNom(i) },
      { cle: 'hauteur', txt: 'La hauteur issue de ' + tex(NOMS[i]) },
      { cle: 'mediane', txt: 'La médiane issue de ' + tex(NOMS[i]) }
    ];
    var ordre = rnd.melange(REP.slice());
    var POURQUOI = {
      bissectrice: 'Les <b>deux arcs</b> marqués du même trait disent que les deux angles en ' + tex(NOMS[i]) +
        ' sont <b>égaux</b> : la demi-droite partage l\'angle en deux. C\'est la <b>bissectrice</b> de ' +
        angleNom(i) + '. Rien n\'est dit du côté opposé — ni angle droit, ni milieu.',
      hauteur: 'Le <b>petit carré</b> dit l\'angle droit avec ' + cote(o1, o2) + ' : la demi-droite est ' +
        '<b>perpendiculaire</b> au côté opposé. C\'est la <b>hauteur</b> issue de ' + tex(NOMS[i]) +
        '. Rien ne dit qu\'elle partage l\'angle en deux — et elle ne le fait pas.',
      mediane: 'Les <b>deux marques</b> sur ' + cote(o1, o2) + ' disent que la demi-droite arrive au ' +
        '<b>milieu</b> du côté opposé. C\'est la <b>médiane</b> issue de ' + tex(NOMS[i]) +
        '. Rien ne dit qu\'elle partage l\'angle en deux — et elle ne le fait pas.'
    };
    return {
      enonce: 'Voici une demi-droite issue de ' + tex(NOMS[i]) + ' dans le triangle ' + tex(NOMS.join('')) +
        ', avec son codage.' + T.figure(opts) + '<b>Qu\'est-ce que cette demi-droite ?</b>',
      type: 'qcm',
      choix: ordre.map(function (r) { return r.txt; }),
      correct: ordre.map(function (r) { return r.cle; }).indexOf(quoi),
      etapes: [POURQUOI[quoi],
        '<b>Le tableau à retenir.</b> Bissectrice : deux angles égaux <b>au sommet</b>. Hauteur : angle ' +
          'droit <b>sur le côté opposé</b>. Médiane : <b>milieu</b> du côté opposé. Les trois partent d\'un sommet.'],
      indices: ['Où est le codage : au sommet, ou sur le côté opposé ?',
                'Deux arcs égaux au sommet → bissectrice. Petit carré → hauteur. Marques de milieu → médiane.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 3. Comment s'appelle leur point de concours ?                         */
  /* ===================================================================== */
  function qConcours(rnd, palier) {
    var ordre = rnd.melange(CENTRES.slice());
    return {
      enonce: 'Les trois <b>bissectrices</b> des angles d\'un triangle se coupent en un même point.<br>' +
        '<b>Comment s\'appelle ce point ?</b>',
      type: 'qcm',
      choix: ordre.map(function (c) { return c.nom; }),
      correct: ordre.map(function (c) { return c.cle; }).indexOf('inscrit'),
      etapes: [
        'Ce point est à <b>égale distance des trois côtés</b> : c\'est donc le centre d\'un cercle qui ' +
          '<b>touche</b> les trois côtés. On l\'appelle le <b>centre du cercle inscrit</b>, et on le note souvent \\(I\\).',
        'Pourquoi les trois se coupent-elles au même endroit ? Le point commun aux bissectrices de ' +
          tex('\\widehat{A}') + ' et de ' + tex('\\widehat{B}') + ' est à égale distance de \\((AB)\\) et \\((AC)\\), ' +
          'et de \\((BA)\\) et \\((BC)\\) : il est donc à égale distance de \\((CA)\\) et \\((CB)\\), et se trouve ' +
          '<b>forcément</b> sur la troisième.',
        'Les autres réponses vont par paires à ne pas mélanger : ' +
          CENTRES.filter(function (c) { return c.cle !== 'inscrit'; })
                 .map(function (c) { return c.nom.toLowerCase() + ' est ' + c.quoi; }).join(', ') + '.'
      ],
      indices: ['Une bissectrice, ce sont les points à égale distance des deux côtés d\'un angle.',
                'Un point à égale distance des trois côtés est le centre d\'un cercle qui les touche tous les trois.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 4. L'angle et son demi-angle                                          */
  /* ===================================================================== */
  // Un triangle dont l'angle au sommet i vaut exactement `a` degrés, tourné
  // au hasard : la figure est à l'échelle de ce qu'elle écrit.
  function triangleAngle(rnd, a) {
    var th = rnd.entier(0, 359) * DEG, l1 = rnd.entier(7, 10), l2 = rnd.entier(7, 10);
    var S = [0, 0];
    var U = [l1 * Math.cos(th), l1 * Math.sin(th)];
    var V = [l2 * Math.cos(th + a * DEG), l2 * Math.sin(th + a * DEG)];
    var i = rnd.entier(0, 2), P = [];
    P[i] = S; P[(i + 1) % 3] = U; P[(i + 2) % 3] = V;
    return { P: P, i: i };
  }
  function qMoitie(rnd, palier) {
    var inverse = palier >= 3 && rnd.booleen(0.5);
    var a = palier <= 2 ? rnd.entier(20, 65) * 2 : rnd.entier(41, 131);
    if (inverse) a = rnd.entier(20, 65) * 2;                    // le demi-angle est entier
    var tri = triangleAngle(rnd, a), P = tri.P, i = tri.i;
    var o1 = (i + 1) % 3, o2 = (i + 2) % 3, D = piedBis(P, i);
    var demi = a / 2;
    var opts = { P: P, noms: NOMS, traits: [{ de: P[i], a: D, couleur: VIOLET }],
                 // Deux rayons bien distincts : les demi-arcs près du sommet, l'arc
                 // de l'angle entier plus loin, pour que les deux étiquettes ne se
                 // marchent pas dessus. La mesure de l'angle entier n'est écrite sur
                 // la figure que si c'est elle qu'on cherche : sinon elle est dans
                 // l'énoncé, et la répéter collerait deux textes au même sommet.
                 arcs: inverse
                   ? [{ V: P[i], de: P[o1], a: D, n: 1, r: 0.07, txt: O.fr(demi) + '°' }, { V: P[i], de: D, a: P[o2], n: 1, r: 0.07 }]
                   : [{ V: P[i], de: P[o1], a: D, n: 1, r: 0.07, txt: '?' }, { V: P[i], de: D, a: P[o2], n: 1, r: 0.07 }],
                 marques: inverse ? [{ i: i, txt: '?', couleur: '#dc2626', r: 0.17 }] : [{ i: i, couleur: '#dc2626', r: 0.15 }] };
    if (inverse) {
      return {
        enonce: 'La demi-droite tracée est la <b>bissectrice</b> de l\'angle ' + angleNom(i) + '. Elle fait avec ' +
          cote(i, o1) + ' un angle de ' + O.fr(demi) + '°.' + T.figure(opts) +
          '<b>Combien mesure l\'angle ' + angleNom(i) + ', en degrés ?</b>',
        type: 'nombre', reponse: a,
        etapes: [
          'La bissectrice partage l\'angle en <b>deux angles égaux</b> : l\'autre moitié mesure aussi ' + O.fr(demi) + '°.',
          'L\'angle entier est la somme des deux : \\(' + O.tex(demi) + ' + ' + O.tex(demi) + ' = 2 \\times ' + O.tex(demi) +
            ' = \\mathbf{' + a + '}°\\).'
        ],
        indices: ['Les deux angles de part et d\'autre de la bissectrice sont égaux.', 'L\'angle entier vaut le double du demi-angle.'],
        duree: 45
      };
    }
    return {
      enonce: 'Dans le triangle ' + tex(NOMS.join('')) + ', l\'angle ' + angleNom(i) + ' mesure ' + a + '°. ' +
        'La demi-droite tracée est sa <b>bissectrice</b>.' + T.figure(opts) +
        '<b>Combien mesure l\'angle marqué « ? », en degrés ?</b>',
      type: 'nombre', reponse: demi,
      etapes: [
        'La bissectrice partage l\'angle ' + angleNom(i) + ' en <b>deux angles égaux</b>.',
        'Chacun vaut la moitié : \\(' + a + ' \\div 2 = \\mathbf{' + O.tex(demi) + '}°\\).'
      ],
      indices: ['Que fait une bissectrice d\'un angle ?', 'Elle le coupe en deux angles de même mesure : divise par 2.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 5. Égale distance aux deux côtés, et le rayon du cercle inscrit       */
  /* ===================================================================== */
  function qDistance(rnd, palier) {
    var d = rnd.entier(12, 68) / 10;           // de 1,2 à 6,8 cm
    var forme = rnd.choix(['point', 'point', 'rayon', 'faux']);
    if (forme === 'rayon') {
      var k = rnd.entier(0, 2), o1 = (k + 1) % 3, o2 = (k + 2) % 3;
      return {
        enonce: '\\(I\\) est le centre du <b>cercle inscrit</b> dans le triangle ' + tex(NOMS.join('')) + '. La distance de ' +
          '\\(I\\) au côté ' + cote(o1, o2) + ' est ' + O.fr(d) + ' cm.<br><b>Quel est le rayon du cercle inscrit, en cm ?</b>',
        type: 'nombre', reponse: d,
        etapes: [
          'Le cercle inscrit <b>touche</b> chaque côté du triangle : son rayon est la distance de son centre \\(I\\) à un côté, ' +
            'mesurée <b>perpendiculairement</b>.',
          'Cette distance est la même pour les trois côtés (c\'est ce qui fait de \\(I\\) le centre) : le rayon vaut <b>' + O.fr(d) + ' cm</b>.',
          'Attention : la distance de \\(I\\) à un <b>sommet</b> n\'est pas le rayon — le cercle inscrit ne passe pas par les sommets.'
        ],
        indices: ['Le cercle inscrit touche les côtés : où se mesure son rayon ?'],
        duree: 50
      };
    }
    if (forme === 'faux') {
      var ecart = rnd.entier(4, 25) / 10, autre = d + ecart;
      return {
        enonce: 'Le point \\(M\\) est à ' + O.fr(d) + ' cm de la droite \\((AB)\\) et à ' + O.fr(autre) + ' cm de la droite \\((AC)\\).<br>' +
          'Vrai ou faux : <b>\\(M\\) est sur la bissectrice de l\'angle ' + angleNom(0) + '</b>.',
        type: 'vraifaux', correct: 1,
        etapes: [
          '<b>Faux.</b> Un point est sur la bissectrice de ' + angleNom(0) + ' <b>si et seulement si</b> il est à égale distance ' +
            'des deux côtés \\((AB)\\) et \\((AC)\\).',
          'Ici ' + O.fr(d) + ' cm et ' + O.fr(autre) + ' cm : les deux distances sont différentes, donc \\(M\\) n\'est <b>pas</b> ' +
            'sur la bissectrice. Il est plus près de \\((AB)\\).'
        ],
        indices: ['Compare les deux distances.'],
        duree: 50
      };
    }
    return {
      enonce: 'Le point \\(M\\) est sur la <b>bissectrice</b> de l\'angle ' + angleNom(0) + '. Sa distance à la droite \\((AB)\\) ' +
        'est ' + O.fr(d) + ' cm.<br><b>Quelle est sa distance à la droite \\((AC)\\), en cm ?</b>',
      type: 'nombre', reponse: d,
      etapes: [
        'La bissectrice d\'un angle est l\'ensemble des points situés à <b>égale distance</b> des deux côtés de l\'angle.',
        '\\(M\\) est dessus, donc sa distance à \\((AC)\\) est la même qu\'à \\((AB)\\) : <b>' + O.fr(d) + ' cm</b>.',
        'C\'est cette propriété qui explique le cercle inscrit : le point commun aux trois bissectrices est à égale distance des ' +
          'trois côtés, donc centre d\'un cercle qui les touche tous les trois.'
      ],
      indices: ['Que sait-on des points de la bissectrice d\'un angle ?', 'Ils sont à égale distance des deux côtés.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  /* 6. Où tombe le centre ? — inscrit (toujours dedans) ou circonscrit    */
  /* ===================================================================== */
  function qPosition(rnd, palier) {
    var quoi = rnd.choix(['acutangle', 'obtusangle', 'rectangle']);
    var inscrit = rnd.booleen(0.6);
    var P, droit = -1;
    if (quoi === 'rectangle') { var r = T.rectangle(rnd); P = r.P; droit = r.droit; }
    else P = T.triangle(rnd, quoi);
    var opts = { P: P, noms: NOMS };
    if (quoi === 'rectangle') {
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
    var attendu = inscrit ? 'dedans' : quoi === 'acutangle' ? 'dedans' : quoi === 'rectangle' ? 'hypo' : 'dehors';
    var ordre = rnd.melange(REP.slice());
    var nature = quoi === 'acutangle' ? 'a ses <b>trois angles aigus</b>'
               : quoi === 'rectangle' ? 'est <b>rectangle en ' + NOMS[droit] + '</b>'
               : 'a un <b>angle obtus</b> en ' + NOMS[nat.sommet];
    var etapes = inscrit
      ? ['Le centre du cercle <b>inscrit</b> est le point de concours des <b>bissectrices</b>. Une bissectrice part d\'un sommet ' +
           'et entre dans l\'angle : elle ne peut pas sortir du triangle.',
         'Ce triangle ' + nature + ' — peu importe : le centre du cercle inscrit est <b>toujours à l\'intérieur</b>, et le cercle touche les trois côtés de l\'intérieur.',
         'C\'est le centre du cercle <b>circonscrit</b> (les médiatrices) qui, lui, sort du triangle quand un angle est obtus.']
      : ['Le centre du cercle <b>circonscrit</b> est le point de concours des <b>médiatrices</b>, et une médiatrice ne part d\'aucun sommet : rien ne la retient dans le triangle.',
         'Ce triangle ' + nature + ' : le centre du cercle circonscrit est donc ' +
           (quoi === 'acutangle' ? '<b>à l\'intérieur</b>.' : quoi === 'rectangle' ? 'au <b>milieu de l\'hypoténuse</b> ' + cote((droit + 1) % 3, (droit + 2) % 3) + '.' : '<b>à l\'extérieur</b>.'),
         'Le centre du cercle <b>inscrit</b>, lui, serait dedans dans tous les cas.'];
    return {
      enonce: 'On veut construire le <b>cercle ' + (inscrit ? 'inscrit</b> dans ce triangle, c\'est-à-dire le cercle qui touche ses trois côtés.'
                                                               : 'circonscrit</b> à ce triangle, c\'est-à-dire le cercle qui passe par ses trois sommets.') +
        T.figure(opts) + 'Sans rien tracer, où se trouve son <b>centre</b> ?',
      type: 'qcm',
      choix: ordre.map(function (x) { return x.txt; }),
      correct: ordre.map(function (x) { return x.cle; }).indexOf(attendu),
      etapes: etapes,
      indices: [inscrit ? 'De quelles droites ce centre est-il le point de concours ? D\'où partent-elles ?'
                        : 'Regarde les angles : y en a-t-il un droit ? un obtus ?',
                inscrit ? 'Une bissectrice entre dans le triangle par un sommet : elle ne peut pas en sortir.'
                        : 'Trois angles aigus → dedans. Un angle droit → milieu de l\'hypoténuse. Un angle obtus → dehors.'],
      duree: 65
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux : ce qui fait vraiment une bissectrice                */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'La bissectrice d\'un angle le partage en <b>deux angles égaux</b>.', ok: true,
      d: 'Oui, c\'est sa définition : les deux angles de part et d\'autre ont la même mesure.' },
    { t: 'La bissectrice issue de \\(A\\) passe toujours par le <b>milieu</b> de \\([BC]\\).', ok: false,
      d: 'Non : c\'est la médiane qui va au milieu. La bissectrice partage l\'angle, pas le côté opposé — elles ne se confondent que dans un triangle isocèle en \\(A\\).' },
    { t: 'Les points de la bissectrice de \\(\\widehat{BAC}\\) sont à <b>égale distance</b> des droites \\((AB)\\) et \\((AC)\\).', ok: true,
      d: 'Oui, et c\'est la propriété qui sert pour le cercle inscrit.' },
    { t: 'Le centre du cercle inscrit peut être <b>à l\'extérieur</b> du triangle.', ok: false,
      d: 'Non : il est toujours à l\'intérieur. Une bissectrice part d\'un sommet et entre dans l\'angle, elle ne sort pas du triangle. C\'est le centre du cercle circonscrit qui peut sortir.' },
    { t: 'Le cercle inscrit <b>passe par les trois sommets</b> du triangle.', ok: false,
      d: 'Non : il <b>touche les trois côtés</b>, de l\'intérieur. C\'est le cercle circonscrit qui passe par les sommets.' },
    { t: 'Le rayon du cercle inscrit est la <b>distance de son centre à un côté</b>.', ok: true,
      d: 'Oui : le cercle touche le côté, et cette distance se mesure perpendiculairement au côté. Ce n\'est pas la distance à un sommet.' },
    { t: 'Dans un triangle <b>isocèle</b>, la bissectrice du sommet principal est aussi la hauteur, la médiane et la médiatrice de la base.', ok: true,
      d: 'Oui : une seule droite pour quatre rôles, l\'axe de symétrie du triangle.' },
    { t: 'Dans un triangle <b>équilatéral</b>, le centre du cercle inscrit et le centre du cercle circonscrit sont confondus.', ok: true,
      d: 'Oui, avec le centre de gravité et l\'orthocentre : les quatre points sont au même endroit. C\'est le seul triangle où cela arrive.' },
    { t: 'Un triangle a <b>un seul</b> cercle inscrit.', ok: true,
      d: 'Oui : les trois bissectrices n\'ont qu\'un point commun, donc un seul centre possible, et un seul rayon.' },
    { t: 'La bissectrice issue de \\(A\\) est <b>perpendiculaire</b> au côté \\([BC]\\).', ok: false,
      d: 'Non : c\'est la hauteur qui est perpendiculaire au côté opposé. La bissectrice ne l\'est que dans un triangle isocèle en \\(A\\).' }
  ];
  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Une bissectrice partage un <b>angle</b> en deux angles égaux ; ses points sont à égale distance des deux côtés. ' +
               'Les trois bissectrices d\'un triangle se coupent au centre du cercle <b>inscrit</b>, toujours dedans.'],
      indices: ['Reviens à la définition : la bissectrice concerne un angle, pas un côté.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'bissectrices', competence: 'bissectrices', level: '5eme',
    titre: 'Les bissectrices et le cercle inscrit', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'concours', 'moitie', 'distance', 'choix'] :
        palier === 2 ? ['choix', 'lire', 'moitie', 'concours', 'distance', 'proprietes'] :
        palier === 3 ? ['lire', 'position', 'choix', 'moitie', 'distance', 'proprietes'] :
                       ['position', 'lire', 'moitie', 'position', 'distance', 'choix']);
      if (quoi === 'choix') return qChoix(rnd, palier);
      if (quoi === 'lire') return qLire(rnd, palier);
      if (quoi === 'concours') return qConcours(rnd, palier);
      if (quoi === 'moitie') return qMoitie(rnd, palier);
      if (quoi === 'distance') return qDistance(rnd, palier);
      if (quoi === 'position') return qPosition(rnd, palier);
      return qProprietes(rnd, palier);
    }
  });
})();
