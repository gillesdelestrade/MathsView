/*
 * medianes — les médianes d'un triangle (leçon 5ème « Les médianes d'un
 * triangle »).
 *
 * Construit comme son voisin exos/5eme/hauteurs.js, et pour la même raison :
 * une médiane se reconnaît à deux conditions — passer par un sommet, et
 * atteindre le MILIEU du côté opposé — et l'élève doit apprendre à les lire
 * sur une figure autant qu'à les réciter.
 *
 *   choix       trois droites partent du même sommet ; une seule va au milieu ;
 *   lire        une droite, son codage (marques de milieu ou petit carré), et
 *               la question « médiane ou hauteur ? » ;
 *   concours    le point de concours s'appelle le centre de gravité ;
 *   deuxtiers   la propriété des DEUX TIERS, dans les trois sens : on donne la
 *               médiane entière, ou AG, ou GA', et l'on demande le reste ;
 *   aires       une médiane partage le triangle en deux aires égales — le lien
 *               avec la leçon « Une médiane partage le triangle en deux aires
 *               égales » ;
 *   proprietes  vrai/faux sur ce qui distingue vraiment une médiane.
 *
 * Les nombres de la partie « deux tiers » tombent juste : on part toujours
 * d'une médiane multiple de 3, pour que le tiers et les deux tiers soient des
 * entiers. Rien n'empêcherait le contraire, mais l'exercice porte sur la
 * propriété, pas sur la division.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var T = TriOutils;

  var NOMS = ['A', 'B', 'C'];
  var VIOLET = '#7c3aed', ORANGE = '#ea580c';

  var CENTRES = [
    { cle: 'gravite', nom: 'Le centre de gravité',
      quoi: 'le point de concours des <b>médianes</b>' },
    { cle: 'ortho', nom: 'L\'orthocentre', quoi: 'le point de concours des <b>hauteurs</b>' },
    { cle: 'circonscrit', nom: 'Le centre du cercle circonscrit',
      quoi: 'le point de concours des <b>médiatrices</b>' },
    { cle: 'inscrit', nom: 'Le centre du cercle inscrit',
      quoi: 'le point de concours des <b>bissectrices</b>' }
  ];

  function ang(s) { return '\\(' + s + '\\)'; }
  function prime(i) { return NOMS[i] + '\''; }

  /* ===================================================================== */
  /* 1. Laquelle de ces trois droites est la médiane ?                     */
  /* ===================================================================== */
  function qChoix(rnd, palier) {
    var P = T.triangle(rnd);
    var i = rnd.entier(0, 2), o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var S = P[i], U = P[o1], V = P[o2];
    var milieu = T.mil(U, V);

    // Deux leurres, franchement décalés du milieu : on ne demande pas à
    // l'élève de départager deux points à un millimètre près.
    var gauche = [], droite = [], t;
    for (t = 0.14; t <= 0.865; t += 0.03) {
      if (t < 0.36) gauche.push(t); else if (t > 0.64) droite.push(t);
    }
    // Trois dispositions possibles, tirées au sort : les deux leurres de part et
    // d'autre du milieu, ou tous les deux du même côté. Sans cela la médiane
    // serait TOUJOURS la droite du milieu du dessin, et l'exercice se devinerait
    // sans jamais regarder les longueurs.
    var cote = rnd.entier(0, 2), tL;
    if (cote === 0) {
      tL = [rnd.choix(gauche), rnd.choix(droite)];
    } else {
      var pool = cote === 1 ? gauche : droite;
      var a = rnd.choix(pool);
      var loin = pool.filter(function (u) { return Math.abs(u - a) > 0.1; });
      tL = [a, loin.length ? rnd.choix(loin) : pool[pool.length - 1 - pool.indexOf(a)]];
    }
    var leurres = tL.map(function (u) { return T.add(U, T.mul(T.sub(V, U), u)); });

    var cibles = rnd.melange([{ p: milieu, cle: 'mediane' },
                              { p: leurres[0], cle: 'autre1' },
                              { p: leurres[1], cle: 'autre2' }]);
    var bonne = cibles.map(function (c) { return c.cle; }).indexOf('mediane');

    return {
      enonce: 'Dans le triangle ' + ang(NOMS.join('')) + ', trois droites sont tracées à partir ' +
        'du sommet ' + ang(NOMS[i]) + '.' +
        T.figure({ P: P, noms: NOMS,
                   traits: cibles.map(function (c, k) {
                     return { de: S, a: c.p, couleur: VIOLET, num: String(k + 1) };
                   }) }) +
        'Laquelle est la <b>médiane issue de ' + NOMS[i] + '</b> ?',
      type: 'qcm',
      choix: ['La droite 1', 'La droite 2', 'La droite 3'],
      correct: bonne,
      etapes: [
        'La <b>médiane issue de ' + NOMS[i] + '</b> joint ' + ang(NOMS[i]) + ' au ' +
          '<b>milieu</b> du côté opposé ' + ang('[' + NOMS[o1] + NOMS[o2] + ']') + '.',
        'Les trois droites partent bien de ' + ang(NOMS[i]) + ' : ce qui les distingue, c\'est ' +
          '<b>où elles arrivent</b> sur le côté opposé.',
        'Seule une des trois arrive exactement au milieu de ' +
          ang('[' + NOMS[o1] + NOMS[o2] + ']') + ', c\'est-à-dire coupe ce côté en deux ' +
          'morceaux de même longueur.',
        'Attention à ne pas confondre avec la <b>hauteur</b>, qui arrive à angle droit sur le ' +
          'côté opposé — et presque jamais en son milieu.'
      ],
      indices: [
        'Ne regarde pas l\'angle que fait la droite : regarde le <b>point d\'arrivée</b> sur le ' +
          'côté opposé.',
        'Lequel de ces trois points partage le côté ' +
          ang('[' + NOMS[o1] + NOMS[o2] + ']') + ' en <b>deux morceaux égaux</b> ?'
      ],
      duree: 55
    };
  }

  /* ===================================================================== */
  /* 2. Une droite avec son codage : médiane ou hauteur ?                  */
  /* ===================================================================== */
  function qLire(rnd, palier) {
    var tir = T.trianglePlusSommet(rnd, 'acutangle');
    var P = tir.P, i = tir.i, o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var S = P[i], U = P[o1], V = P[o2];
    var estMediane = rnd.booleen(0.5);
    var but = estMediane ? T.mil(U, V) : T.projete(S, U, V);

    var opts = { P: P, noms: NOMS, traits: [{ de: S, a: but, couleur: VIOLET }] };
    if (estMediane) opts.codes = [{ a: U, b: but, n: 1 }, { a: but, b: V, n: 1 }];
    else opts.equerres = [{ pied: but, vers: S, base: U }];

    var ordre = rnd.melange(['mediane', 'hauteur']);
    var LIB = {
      mediane: 'La <b>médiane</b> issue de ' + NOMS[i],
      hauteur: 'La <b>hauteur</b> issue de ' + NOMS[i]
    };

    return {
      enonce: 'Une droite a été tracée à partir du sommet ' + ang(NOMS[i]) + ' du triangle ' +
        ang(NOMS.join('')) + '. Regarde bien le <b>codage</b> de la figure.' +
        T.figure(opts) +
        'De quelle droite s\'agit-il ?',
      type: 'qcm',
      choix: ordre.map(function (k) { return LIB[k]; }),
      correct: ordre.indexOf(estMediane ? 'mediane' : 'hauteur'),
      etapes: estMediane
        ? ['Les <b>deux marques identiques</b> de part et d\'autre du point d\'arrivée disent ' +
             'que les deux morceaux du côté ont la <b>même longueur</b>.',
           'Ce point est donc le <b>milieu</b> de ' + ang('[' + NOMS[o1] + NOMS[o2] + ']') +
             ', et la droite est la <b>médiane</b> issue de ' + NOMS[i] + '.',
           'Aucun angle droit n\'est codé : rien ne dit que c\'est une hauteur, et en général ' +
             'ce n\'en est pas une.']
        : ['Le <b>petit carré</b> signale un <b>angle droit</b> avec le côté opposé.',
           'La droite passe par ' + ang(NOMS[i]) + ' perpendiculairement à ' +
             ang('(' + NOMS[o1] + NOMS[o2] + ')') + ' : c\'est la <b>hauteur</b> issue de ' +
             NOMS[i] + '.',
           'Aucune marque de milieu n\'est codée : le pied n\'est pas au milieu du côté.'],
      indices: ['Marques en travers → deux longueurs égales → milieu → médiane.',
                'Petit carré → angle droit → hauteur.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 3. Le point de concours                                               */
  /* ===================================================================== */
  function qConcours(rnd, palier) {
    var sens = palier >= 3 ? rnd.booleen(0.5) : true;
    var ordre = rnd.melange(CENTRES.slice());
    if (sens) {
      return {
        enonce: 'Dans un triangle, les <b>trois médianes</b> se coupent toutes les trois en un ' +
          'même point. Comment s\'appelle ce point ?',
        type: 'qcm',
        choix: ordre.map(function (c) { return c.nom; }),
        correct: ordre.map(function (c) { return c.cle; }).indexOf('gravite'),
        etapes: ['Les trois médianes sont <b>concourantes</b> : leur point de concours s\'appelle ' +
          'le <b>centre de gravité</b> du triangle. C\'est le point d\'équilibre : une plaque ' +
          'triangulaire tiendrait en équilibre sur une pointe placée là.']
          .concat(CENTRES.slice(1).map(function (c) {
            return '✘ ' + c.nom + ' est ' + c.quoi + '.';
          })),
        indices: ['Ce point porte un nom qui parle d\'équilibre, pas d\'angle ni de cercle.'],
        duree: 40
      };
    }
    var lignes = rnd.melange(['les médianes', 'les hauteurs', 'les médiatrices',
                              'les bissectrices']);
    return {
      enonce: 'Le <b>centre de gravité</b> d\'un triangle est le point de concours de… ?',
      type: 'qcm',
      choix: lignes.map(function (l) { return l.charAt(0).toUpperCase() + l.slice(1); }),
      correct: lignes.indexOf('les médianes'),
      etapes: ['Le <b>centre de gravité</b> est le point où se coupent les <b>trois médianes</b>.']
        .concat(CENTRES.slice(1).map(function (c) { return '✘ ' + c.quoi + '.'; })),
      indices: ['Ne pas confondre avec l\'orthocentre (les hauteurs) ni avec les centres des ' +
                'deux cercles (médiatrices et bissectrices).'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 4. La propriété des deux tiers, dans les trois sens                   */
  /* ===================================================================== */
  function qDeuxTiers(rnd, palier) {
    var i = rnd.entier(0, 2), A = NOMS[i], Ap = prime(i);
    var m = 3 * rnd.entier(2, palier >= 3 ? 12 : 6);        // la médiane entière
    var AG = 2 * m / 3, GAp = m / 3;
    // Trois façons de poser la même propriété : c'est la troisième qui montre
    // si elle est comprise ou seulement récitée.
    var sens = rnd.choix(palier >= 3 ? ['med', 'ag', 'gap', 'gap'] : ['med', 'med', 'ag']);

    var donne, cherche, rep, calcul;
    if (sens === 'med') {
      donne = A + Ap + ' = ' + O.fr(m); cherche = A + 'G'; rep = AG;
      calcul = ang(A + 'G = \\dfrac{2}{3} \\times ' + O.tex(m) + ' = ' + O.tex(AG)) + ' cm';
    } else if (sens === 'ag') {
      donne = A + 'G = ' + O.fr(AG); cherche = 'G' + Ap; rep = GAp;
      calcul = 'Comme ' + ang(A + 'G = 2 \\times G' + Ap) + ', on divise par 2 : ' +
        ang('G' + Ap + ' = ' + O.tex(AG) + ' \\div 2 = ' + O.tex(GAp)) + ' cm';
    } else {
      donne = 'G' + Ap + ' = ' + O.fr(GAp); cherche = A + Ap; rep = m;
      calcul = ang('G' + Ap) + ' est le <b>tiers</b> de la médiane, donc ' +
        ang(A + Ap + ' = 3 \\times ' + O.tex(GAp) + ' = ' + O.tex(m)) + ' cm';
    }

    return {
      enonce: 'Dans le triangle ' + ang(NOMS.join('')) + ', ' + ang(Ap) + ' est le milieu de ' +
        ang('[' + NOMS[(i + 1) % 3] + NOMS[(i + 2) % 3] + ']') + ' et ' + ang('G') +
        ' est le <b>centre de gravité</b>.<br>On sait que ' + ang(donne) + ' cm.' +
        '<br>Combien vaut ' + ang(cherche) + ' ?',
      type: 'nombre', reponse: rep, unite: 'cm',
      etapes: [
        'Le centre de gravité est situé aux <b>deux tiers</b> de chaque médiane, en partant du ' +
          '<b>sommet</b> : ' + ang(A + 'G = \\dfrac{2}{3}\\,' + A + Ap) + ' et ' +
          ang('G' + Ap + ' = \\dfrac{1}{3}\\,' + A + Ap) + '.',
        'Autrement dit, ' + ang(A + 'G = 2 \\times G' + Ap) + ' : le morceau du côté du sommet ' +
          'est <b>deux fois plus long</b> que l\'autre.',
        calcul,
        'Vérification : ' + ang(A + 'G + G' + Ap + ' = ' + O.tex(AG) + ' + ' + O.tex(GAp) +
          ' = ' + O.tex(m)) + ' cm, c\'est bien la médiane entière.'
      ],
      indices: [
        'La médiane est coupée par ' + ang('G') + ' en <b>trois parts égales</b> : deux du côté ' +
          'du sommet, une du côté du milieu.',
        'Si tu appelles ' + ang('t') + ' le tiers de la médiane : ' + ang(A + 'G = 2t') + ', ' +
          ang('G' + Ap + ' = t') + ', ' + ang(A + Ap + ' = 3t') + '.'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 5. Les deux aires                                                     */
  /* ===================================================================== */
  function qAires(rnd, palier) {
    var i = rnd.entier(0, 2), o1 = (i + 1) % 3, o2 = (i + 2) % 3;
    var A = NOMS[i], B = NOMS[o1], C = NOMS[o2], Ap = prime(i);
    var moitie = rnd.entier(4, 30);
    var S = 2 * moitie;
    var inverse = palier >= 3 && rnd.booleen(0.4);

    return {
      enonce: 'Dans le triangle ' + ang(NOMS.join('')) + ', ' + ang(Ap) + ' est le <b>milieu</b> ' +
        'de ' + ang('[' + B + C + ']') + ' : ' + ang('[' + A + Ap + ']') + ' est donc une ' +
        '<b>médiane</b>.<br>' +
        (inverse
          ? 'On sait que l\'aire du triangle ' + ang(A + B + Ap) + ' est de ' + O.fr(moitie) +
            ' cm². Quelle est l\'aire du triangle ' + ang(NOMS.join('')) + ' ?'
          : 'On sait que l\'aire du triangle ' + ang(NOMS.join('')) + ' est de ' + O.fr(S) +
            ' cm². Quelle est l\'aire du triangle ' + ang(A + B + Ap) + ' ?'),
      type: 'nombre', reponse: inverse ? S : moitie, unite: 'cm²',
      etapes: [
        'Une médiane partage le triangle en <b>deux triangles de même aire</b>.',
        'Pourquoi : ' + ang(A + B + Ap) + ' et ' + ang(A + C + Ap) + ' ont la <b>même hauteur</b> ' +
          '(celle issue de ' + ang(A) + ', puisque leurs bases sont sur la même droite ' +
          ang('(' + B + C + ')') + ') et des <b>bases égales</b> (' +
          ang(B + Ap + ' = ' + Ap + C) + ', car ' + ang(Ap) + ' est le milieu).',
        'Chacun a donc pour aire la <b>moitié</b> de celle de ' + ang(NOMS.join('')) + '.',
        inverse
          ? 'Ici : ' + ang(O.tex(moitie) + ' \\times 2 = ' + O.tex(S)) + ' cm².'
          : 'Ici : ' + ang(O.tex(S) + ' \\div 2 = ' + O.tex(moitie)) + ' cm².'
      ],
      indices: [
        'Les deux morceaux ont la même hauteur et des bases égales : que peut-on en dire ?',
        'Aire = (base × hauteur) ÷ 2. Mêmes bases, même hauteur → mêmes aires.'
      ],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Une médiane d\'un triangle passe par le <b>milieu</b> d\'un côté.', ok: true,
      d: 'Oui : elle joint un sommet au milieu du côté opposé.' },
    { t: 'Une médiane est <b>perpendiculaire</b> au côté qu\'elle coupe.', ok: false,
      d: 'Non : celle qui est perpendiculaire au côté opposé est la <b>hauteur</b>. Une médiane ' +
         'vise le <b>milieu</b>, sans se soucier de l\'angle. Les deux ne sont confondues que ' +
         'dans un triangle isocèle, depuis le sommet principal.' },
    { t: 'Le centre de gravité est toujours <b>à l\'intérieur</b> du triangle.', ok: true,
      d: 'Oui, toujours — contrairement à l\'orthocentre, qui sort du triangle quand celui-ci ' +
         'est obtusangle.' },
    { t: 'Une médiane partage le triangle en deux triangles de <b>même aire</b>.', ok: true,
      d: 'Oui : les deux morceaux ont la même hauteur et des bases égales, donc la même aire — ' +
         'même s\'ils n\'ont pas du tout la même forme.' },
    { t: 'Une médiane partage le triangle en deux triangles <b>superposables</b>.', ok: false,
      d: 'Non : ils ont la même <b>aire</b>, mais en général pas la même <b>forme</b>. Ils ne ' +
         'sont superposables que si le triangle est isocèle, depuis le sommet principal.' },
    { t: 'Le centre de gravité est situé aux <b>deux tiers</b> de chaque médiane, en partant du ' +
         'sommet.', ok: true,
      d: 'Oui : ' + '\\(AG = \\dfrac{2}{3}AA\'\\)' + ', et donc ' + '\\(AG = 2 \\times GA\'\\)' + '.' },
    { t: 'Les trois médianes se coupent au centre du <b>cercle inscrit</b>.', ok: false,
      d: 'Non : elles se coupent au <b>centre de gravité</b>. Le centre du cercle inscrit est le ' +
         'point de concours des <b>bissectrices</b>.' },
    { t: 'Un triangle a <b>trois</b> médianes.', ok: true,
      d: 'Une par sommet, donc trois — et elles sont concourantes au centre de gravité.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Une médiane, c\'est un <b>sommet</b> et le <b>milieu</b> du côté opposé. ' +
                'Ni angle droit, ni cercle.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'medianes', competence: 'medianes', level: '5eme',
    titre: 'Les médianes d\'un triangle', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['choix', 'choix', 'lire', 'lire'] :
        palier === 2 ? ['choix', 'lire', 'concours', 'deuxtiers', 'proprietes'] :
        palier === 3 ? ['choix', 'lire', 'concours', 'deuxtiers', 'deuxtiers', 'aires',
                        'proprietes'] :
                       ['concours', 'deuxtiers', 'deuxtiers', 'aires', 'aires', 'proprietes',
                        'proprietes']);

      if (quoi === 'lire') return qLire(rnd, palier);
      if (quoi === 'concours') return qConcours(rnd, palier);
      if (quoi === 'deuxtiers') return qDeuxTiers(rnd, palier);
      if (quoi === 'aires') return qAires(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qChoix(rnd, palier);
    }
  });

})();
