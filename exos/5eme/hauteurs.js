/*
 * hauteurs — les hauteurs d'un triangle (leçon 5ème « Les hauteurs d'un
 * triangle »).
 *
 * Une hauteur ne se reconnaît pas à sa position mais à DEUX conditions, et
 * l'élève n'en retient souvent qu'une : passer par un sommet, et être
 * perpendiculaire au côté opposé. Tout le générateur tourne autour de ça.
 *
 *   choix       trois droites partent du même sommet ; une seule est la
 *               hauteur, les autres passent par le milieu du côté opposé (la
 *               médiane) ou par un point quelconque. Aucun codage n'est
 *               dessiné : c'est à l'élève de reconnaître l'angle droit ;
 *   lire        une seule droite est tracée, AVEC son codage — petit carré ou
 *               marques de milieu — et l'on demande ce que c'est. L'exercice
 *               réciproque du précédent : ici on lit le codage au lieu de
 *               l'inférer ;
 *   concours    comment s'appelle le point où se coupent les trois hauteurs ?
 *               Les quatre points remarquables sont proposés ensemble, car
 *               c'est là que la confusion se joue ;
 *   position    à l'intérieur, sur un sommet ou à l'extérieur ? La figure ne
 *               montre que le triangle : il faut reconnaître sa nature ;
 *   proprietes  vrai/faux sur ce qui distingue vraiment une hauteur.
 *
 * Les triangles sont tirés au hasard mais jamais n'importe comment : le module
 * exos/5eme/triangle-outils.js refuse les triangles trop plats ou trop pointus,
 * et sait construire un vrai triangle rectangle plutôt que d'en espérer un.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var T = TriOutils;

  var NOMS = ['A', 'B', 'C'];
  var VIOLET = '#7c3aed', ORANGE = '#ea580c', VERT = '#059669';

  // Les quatre points remarquables, toujours proposés ensemble : c'est en les
  // voyant côte à côte qu'on apprend à ne plus les confondre.
  var CENTRES = [
    { cle: 'ortho', nom: 'L\'orthocentre', quoi: 'le point de concours des <b>hauteurs</b>' },
    { cle: 'gravite', nom: 'Le centre de gravité',
      quoi: 'le point de concours des <b>médianes</b>' },
    { cle: 'circonscrit', nom: 'Le centre du cercle circonscrit',
      quoi: 'le point de concours des <b>médiatrices</b>' },
    { cle: 'inscrit', nom: 'Le centre du cercle inscrit',
      quoi: 'le point de concours des <b>bissectrices</b>' }
  ];

  function ang(s) { return '\\(' + s + '\\)'; }

  /* ===================================================================== */
  /* 1. Laquelle de ces trois droites est la hauteur ?                     */
  /* ===================================================================== */
  function qChoix(rnd, palier) {
    // Au palier 4, le pied tombe parfois en dehors du côté : il faut alors
    // prolonger, et c'est exactement là que l'exercice devient intéressant.
    // Le sommet est choisi de façon que la hauteur et la médiane issues de lui
    // soient bien distinctes : sinon deux des trois droites seraient confondues.
    var tir = T.trianglePlusSommet(rnd,
      palier >= 4 && rnd.booleen(0.5) ? 'obtusangle' : 'acutangle');
    var P = tir.P, i = tir.i, o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var S = P[i], U = P[o1], V = P[o2];

    var pied = T.projete(S, U, V);
    var milieu = T.mil(U, V);
    var L = T.len(T.sub(V, U));
    var tPied = T.dot(T.sub(pied, U), T.sub(V, U)) / (L * L);   // position du pied

    // Un troisième point du côté opposé, franchement à l'écart du pied ET du
    // milieu — sinon deux des trois droites seraient presque confondues — et
    // pas trop près des extrémités, sans quoi la droite longerait un côté.
    var libres = [], t;
    for (t = 0.26; t <= 0.741; t += 0.04) {
      if (Math.abs(t - tPied) > 0.2 && Math.abs(t - 0.5) > 0.2) libres.push(t);
    }
    if (!libres.length) {            // repli : le point le plus dégagé de la grille
      var best = 0.5, score = -1;
      for (t = 0.26; t <= 0.741; t += 0.04) {
        var d = Math.min(Math.abs(t - tPied), Math.abs(t - 0.5));
        if (d > score) { score = d; best = t; }
      }
      libres = [best];
    }
    var quart = T.add(U, T.mul(T.sub(V, U), rnd.choix(libres)));

    // Le pied de la hauteur peut sortir du côté : on prolonge alors le côté en
    // pointillés, sinon le trait s'arrêterait dans le vide.
    var d = T.sub(V, U), tPied = T.dot(T.sub(pied, U), d) / T.dot(d, d);
    var dehors = tPied < 0 || tPied > 1;

    var cibles = rnd.melange([{ p: pied, cle: 'hauteur' },
                              { p: milieu, cle: 'mediane' },
                              { p: quart, cle: 'autre' }]);
    var traits = cibles.map(function (c, k) {
      return { de: S, a: c.p, couleur: VIOLET, num: String(k + 1) };
    });
    if (dehors) {
      traits.push({ de: tPied < 0 ? U : V, a: pied, couleur: '#94a3b8', dash: true, ep: 2 });
    }

    var bonne = cibles.map(function (c) { return c.cle; }).indexOf('hauteur');

    return {
      enonce: 'Dans le triangle ' + ang(NOMS.join('')) + ', trois droites sont tracées à partir ' +
        'du sommet ' + ang(NOMS[i]) + '.' +
        T.figure({ P: P, noms: NOMS, traits: traits }) +
        'Laquelle est la <b>hauteur issue de ' + NOMS[i] + '</b> ?',
      type: 'qcm',
      choix: ['La droite 1', 'La droite 2', 'La droite 3'],
      correct: bonne,
      etapes: [
        'La <b>hauteur issue de ' + NOMS[i] + '</b> est la droite qui passe par ' +
          ang(NOMS[i]) + ' et qui est <b>perpendiculaire</b> au côté opposé ' +
          ang('[' + NOMS[o1] + NOMS[o2] + ']') + '.',
        'Les trois droites passent bien par ' + ang(NOMS[i]) + ' : ce n\'est donc pas ça qui ' +
          'les distingue. Il faut regarder <b>l\'angle</b> qu\'elles font avec ' +
          ang('(' + NOMS[o1] + NOMS[o2] + ')') + '.',
        'Seule la droite <b>' + (bonne + 1) + '</b> forme un <b>angle droit</b> avec ' +
          ang('(' + NOMS[o1] + NOMS[o2] + ')') + ' : c\'est la hauteur.',
        (cibles[(bonne + 1) % 3].cle === 'mediane' || cibles[(bonne + 2) % 3].cle === 'mediane')
          ? 'Attention : celle qui va au <b>milieu</b> du côté opposé est la ' +
            '<b>médiane</b>, pas la hauteur. Les deux ne sont confondues que dans un ' +
            'triangle isocèle.'
          : 'Les autres droites coupent bien le côté opposé, mais pas à angle droit.'
      ].concat(dehors ? ['Ici le <b>pied</b> de la hauteur tombe <b>en dehors</b> du côté : ' +
        'on prolonge le côté (en pointillés) pour aller le chercher. Une hauteur est une ' +
        '<b>droite</b>, pas un segment enfermé dans le triangle.'] : []),
      indices: [
        'Une hauteur, ce n\'est pas « la droite qui coupe le côté en deux » : c\'est celle qui ' +
          'le coupe <b>à angle droit</b>.',
        'Imagine une équerre posée sur le côté ' + ang('[' + NOMS[o1] + NOMS[o2] + ']') +
          ' : laquelle des trois droites suit son bord ?'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 2. Une seule droite, avec son codage : qu'est-ce que c'est ?          */
  /* ===================================================================== */
  function qLire(rnd, palier) {
    var tir = T.trianglePlusSommet(rnd, 'acutangle');
    var P = tir.P, i = tir.i, o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var S = P[i], U = P[o1], V = P[o2];
    var estHauteur = rnd.booleen(0.5);
    var but = estHauteur ? T.projete(S, U, V) : T.mil(U, V);

    var opts = { P: P, noms: NOMS,
                 traits: [{ de: S, a: but, couleur: VIOLET }] };
    if (estHauteur) {
      // Le petit carré au pied : c'est LUI qui dit « hauteur ».
      opts.equerres = [{ pied: but, vers: S, base: U }];
    } else {
      // Deux marques identiques de part et d'autre : c'est ça qui dit « milieu ».
      opts.codes = [{ a: U, b: but, n: 1 }, { a: but, b: V, n: 1 }];
    }

    var ordre = rnd.melange(['hauteur', 'mediane']);
    var LIB = {
      hauteur: 'La <b>hauteur</b> issue de ' + NOMS[i],
      mediane: 'La <b>médiane</b> issue de ' + NOMS[i]
    };

    return {
      enonce: 'Une droite a été tracée à partir du sommet ' + ang(NOMS[i]) +
        ' du triangle ' + ang(NOMS.join('')) + '. Regarde bien le <b>codage</b> de la figure.' +
        T.figure(opts) +
        'De quelle droite s\'agit-il ?',
      type: 'qcm',
      choix: ordre.map(function (k) { return LIB[k]; }),
      correct: ordre.indexOf(estHauteur ? 'hauteur' : 'mediane'),
      etapes: estHauteur
        ? ['Le <b>petit carré</b> dessiné au pied signale un <b>angle droit</b>.',
           'La droite passe par ' + ang(NOMS[i]) + ' et elle est perpendiculaire au côté ' +
             'opposé : c\'est la <b>hauteur</b> issue de ' + NOMS[i] + '.',
           'Rien ne dit ici qu\'elle coupe le côté en son milieu — et en général, elle ne le ' +
             'fait pas.']
        : ['Les <b>deux marques identiques</b> de part et d\'autre du point disent que les deux ' +
             'morceaux du côté ont la <b>même longueur</b> : ce point est le <b>milieu</b>.',
           'La droite joint ' + ang(NOMS[i]) + ' au milieu du côté opposé : c\'est la ' +
             '<b>médiane</b> issue de ' + NOMS[i] + '.',
           'Rien ne dit ici qu\'il y a un angle droit — et en général, il n\'y en a pas.'],
      indices: [
        'Deux codages différents, deux droites différentes : le <b>petit carré</b> annonce un ' +
          'angle droit, les <b>marques en travers</b> annoncent deux longueurs égales.',
        'Hauteur → angle droit. Médiane → milieu.'
      ],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 3. Le point de concours : comment s'appelle-t-il ?                    */
  /* ===================================================================== */
  function qConcours(rnd, palier) {
    // Dans un sens (« comment s'appelle le point de concours des hauteurs ? »)
    // ou dans l'autre (« l'orthocentre est le point de concours de quoi ? »).
    var sens = palier >= 3 ? rnd.booleen(0.5) : true;
    var ordre = rnd.melange(CENTRES.slice());
    var bon = CENTRES[0];                       // l'orthocentre

    if (sens) {
      return {
        enonce: 'Dans un triangle, les <b>trois hauteurs</b> se coupent toutes les trois en un ' +
          'même point. Comment s\'appelle ce point ?',
        type: 'qcm',
        choix: ordre.map(function (c) { return c.nom; }),
        correct: ordre.map(function (c) { return c.cle; }).indexOf('ortho'),
        etapes: ['Les trois hauteurs sont <b>concourantes</b> : leur point de concours s\'appelle ' +
          'l\'<b>orthocentre</b>.'].concat(CENTRES.slice(1).map(function (c) {
            return '✘ ' + c.nom + ' est ' + c.quoi + '.';
          })),
        indices: ['« Ortho » veut dire « droit », comme dans « angle droit » — et la hauteur, ' +
                    'c\'est justement l\'angle droit.',
                  'Médianes → centre de gravité. Médiatrices → cercle circonscrit. ' +
                    'Bissectrices → cercle inscrit. Il reste les hauteurs.'],
        duree: 40
      };
    }
    var lignes = rnd.melange(['les hauteurs', 'les médianes', 'les médiatrices',
                              'les bissectrices']);
    return {
      enonce: 'L\'<b>orthocentre</b> d\'un triangle est le point de concours de… ?',
      type: 'qcm',
      choix: lignes.map(function (l) { return l.charAt(0).toUpperCase() + l.slice(1); }),
      correct: lignes.indexOf('les hauteurs'),
      etapes: ['L\'<b>orthocentre</b> est le point où se coupent les <b>trois hauteurs</b>.']
        .concat(CENTRES.slice(1).map(function (c) { return '✘ ' + c.quoi + ' donne ' +
          c.nom.toLowerCase().replace('le ', '').replace('l\'', '') + '.'; })),
      indices: ['Regarde le mot : « ortho » = droit, comme l\'angle droit d\'une hauteur.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 4. Où se trouve l'orthocentre ?                                       */
  /* ===================================================================== */
  function qPosition(rnd, palier) {
    var quoi = rnd.choix(['acutangle', 'obtusangle', 'rectangle']);
    var P, droit = -1;
    if (quoi === 'rectangle') { var r = T.rectangle(rnd); P = r.P; droit = r.droit; }
    else P = T.triangle(rnd, quoi);

    var opts = { P: P, noms: NOMS };
    if (quoi === 'rectangle') {
      // On code l'angle droit : sans ça, la question devient un exercice de vue.
      var o1 = (droit + 1) % 3, o2 = (droit + 2) % 3;
      opts.equerres = [{ pied: P[droit], vers: P[o1], base: P[o2] }];
    }

    var REP = [
      { cle: 'dedans', txt: 'À l\'intérieur du triangle' },
      { cle: 'sommet', txt: 'Sur un sommet du triangle' },
      { cle: 'dehors', txt: 'À l\'extérieur du triangle' }
    ];
    var attendu = quoi === 'acutangle' ? 'dedans' : quoi === 'rectangle' ? 'sommet' : 'dehors';
    var ordre = rnd.melange(REP.slice());
    var nat = T.nature(P);

    var pourquoi = {
      acutangle: 'Ce triangle a ses <b>trois angles aigus</b> (tous plus petits que 90°) : on dit ' +
        'qu\'il est <b>acutangle</b>. Ses trois hauteurs se coupent <b>à l\'intérieur</b>.',
      rectangle: 'Ce triangle est <b>rectangle en ' + NOMS[droit] + '</b>. Les deux côtés de ' +
        'l\'angle droit sont déjà perpendiculaires l\'un à l\'autre : chacun est donc la hauteur ' +
        'issue de l\'autre sommet. Ces deux hauteurs se coupent <b>en ' + NOMS[droit] + '</b>, ' +
        'et la troisième y passe aussi.',
      obtusangle: 'Ce triangle a un <b>angle obtus</b> en ' + NOMS[nat.sommet] + ' (plus grand ' +
        'que 90°) : on dit qu\'il est <b>obtusangle</b>. Deux de ses hauteurs tombent en dehors ' +
        'du triangle, et le point de concours est <b>à l\'extérieur</b>.'
    };

    return {
      enonce: 'On veut construire l\'<b>orthocentre</b> de ce triangle, c\'est-à-dire le point ' +
        'où se coupent ses trois hauteurs.' +
        T.figure(opts) +
        'Sans rien tracer, où va-t-il se trouver ?',
      type: 'qcm',
      choix: ordre.map(function (r) { return r.txt; }),
      correct: ordre.map(function (r) { return r.cle; }).indexOf(attendu),
      etapes: [pourquoi[quoi],
        '<b>À retenir :</b> orthocentre <b>à l\'intérieur</b> si le triangle est acutangle, ' +
          '<b>sur le sommet de l\'angle droit</b> s\'il est rectangle, <b>à l\'extérieur</b> ' +
          's\'il est obtusangle.'],
      indices: [
        'Commence par regarder les angles du triangle : y en a-t-il un qui est droit ? un qui ' +
          'est obtus (plus ouvert qu\'un angle droit) ?',
        'Trois angles aigus → dedans. Un angle droit → sur ce sommet. Un angle obtus → dehors.'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 5. Vrai ou faux : ce qui fait vraiment une hauteur                    */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Une hauteur d\'un triangle passe toujours par un <b>sommet</b>.', ok: true,
      d: 'C\'est la première des deux conditions : une hauteur part d\'un sommet, et elle est ' +
         'perpendiculaire au côté opposé.' },
    { t: 'Une hauteur coupe toujours le côté opposé en son <b>milieu</b>.', ok: false,
      d: 'Non : celle qui passe par le milieu est la <b>médiane</b>. Une hauteur coupe le côté ' +
         'opposé <b>à angle droit</b>, et en général pas en son milieu. Les deux ne sont ' +
         'confondues que dans un triangle isocèle, depuis le sommet principal.' },
    { t: 'Le <b>pied</b> d\'une hauteur est toujours situé sur le côté opposé, entre ses deux ' +
         'extrémités.', ok: false,
      d: 'Non : dans un triangle <b>obtusangle</b>, le pied tombe en dehors du côté, et il faut ' +
         '<b>prolonger</b> ce côté pour l\'atteindre.' },
    { t: 'Un triangle a <b>trois</b> hauteurs.', ok: true,
      d: 'Une par sommet, donc trois — et elles sont concourantes en l\'orthocentre.' },
    { t: 'Dans un triangle <b>rectangle</b>, deux des trois hauteurs sont des <b>côtés</b> du ' +
         'triangle.', ok: true,
      d: 'Oui : les deux côtés de l\'angle droit sont perpendiculaires entre eux, donc chacun ' +
         'est la hauteur issue de l\'autre sommet. C\'est pour cela que l\'orthocentre est sur ' +
         'le sommet de l\'angle droit.' },
    { t: 'Les trois hauteurs d\'un triangle se coupent au centre du <b>cercle circonscrit</b>.',
      ok: false,
      d: 'Non : elles se coupent en l\'<b>orthocentre</b>. Le centre du cercle circonscrit est ' +
         'le point de concours des <b>médiatrices</b>, ce n\'est pas le même point.' },
    { t: 'Une hauteur est une <b>droite</b> : on peut la prolonger au-delà du triangle.',
      ok: true,
      d: 'Oui, et c\'est indispensable dans un triangle obtusangle, où les hauteurs ne se ' +
         'rencontrent qu\'en dehors du triangle.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense aux deux conditions : passer par un <b>sommet</b>, et être ' +
                '<b>perpendiculaire</b> au côté opposé.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'hauteurs', competence: 'hauteurs', level: '5eme',
    titre: 'Les hauteurs d\'un triangle', paliers: 4,

    genere: function (rnd, palier) {
      // On installe d'abord la définition (reconnaître, lire un codage), puis
      // le vocabulaire du point de concours, et enfin ce qui se déduit sans
      // rien tracer.
      var quoi = rnd.choix(
        palier === 1 ? ['choix', 'choix', 'lire', 'lire'] :
        palier === 2 ? ['choix', 'lire', 'lire', 'concours', 'proprietes'] :
        palier === 3 ? ['choix', 'lire', 'concours', 'position', 'proprietes'] :
                       ['choix', 'concours', 'position', 'position', 'proprietes',
                        'proprietes']);

      if (quoi === 'lire') return qLire(rnd, palier);
      if (quoi === 'concours') return qConcours(rnd, palier);
      if (quoi === 'position') return qPosition(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qChoix(rnd, palier);
    }
  });

})();
