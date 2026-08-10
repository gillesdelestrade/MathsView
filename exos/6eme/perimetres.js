/*
 * perimetres — le tour des figures usuelles (leçon 6ème « Les périmètres »).
 *
 * Le générateur « aires » demande déjà le périmètre du carré, du rectangle et
 * du disque. Celui-ci ne le double pas : il prend en charge ce que la leçon
 * des périmètres ajoute, et qui est justement le plus discriminant.
 *
 *   • Les TROIS triangles. Le quelconque n'a aucune formule — on additionne,
 *     et c'est tout ce qu'il y a à comprendre. L'isocèle et l'équilatéral, eux,
 *     ne se distinguent que par le nombre de côtés égaux : c'est là que se joue
 *     la factorisation (3 × c contre b + 2 × c), et là que les élèves écrivent
 *     4 × c par réflexe de carré.
 *
 *   • Le cercle donné par son DIAMÈTRE autant que par son rayon. La faute
 *     classique n'est pas d'oublier π, c'est de multiplier le diamètre par 2
 *     alors qu'il vaut déjà deux rayons.
 *
 *   • Les questions INVERSES (périmètre donné, côté cherché). Une élève qui
 *     applique la formule sans la comprendre sait faire 4 × 7 ; elle bloque sur
 *     « le tour vaut 28, combien mesure le côté ». C'est le meilleur test de la
 *     notion, et le seul que le générateur « aires » ne propose jamais.
 *
 *   • Enfin quelques questions de sens : l'unité, le choix entre périmètre et
 *     aire selon ce qu'on veut faire (clôturer ou carreler), et le contre-
 *     exemple qui casse « même périmètre donc même aire ».
 *
 * Une note d'écriture : le gras des résultats est posé HORS des délimiteurs
 * \( \). Une balise <b> à l'intérieur coupe la formule en deux nœuds de texte,
 * et MathJax ne reconnaît alors plus la paire de délimiteurs.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function arrondi(v) { return Math.round(v * 10) / 10; }

  /* Tirage pondéré : toutes les questions d'un palier n'ont pas à sortir
     aussi souvent. Les questions de sens sont précieuses mais ne doivent pas
     manger la place du calcul. */
  function pondere(rnd, liste) {
    var total = 0, i;
    for (i = 0; i < liste.length; i++) total += liste[i].poids;
    var seuil = rnd.entier(1, total);
    for (i = 0; i < liste.length; i++) {
      seuil -= liste[i].poids;
      if (seuil <= 0) return liste[i];
    }
    return liste[liste.length - 1];
  }

  /* ===================================================================== */
  /* Périmètres directs                                                    */
  /* ===================================================================== */
  function qCarre(rnd) {
    var c = rnd.entier(3, 25);
    return {
      enonce: 'Calcule le <strong>périmètre</strong> d\'un carré de côté \\(' + c + '\\) cm.',
      type: 'nombre', reponse: 4 * c, unite: 'cm',
      etapes: [
        'Un carré a <b>4 côtés égaux</b> : faire le tour, c\'est parcourir 4 fois le côté.',
        '\\(\\mathcal{P} = c + c + c + c = 4 \\times c\\)',
        'Donc \\(\\mathcal{P} = 4 \\times ' + c + ' = ' + (4 * c) + '\\) cm.'
      ],
      indices: ['Le tour d\'un carré, c\'est côté + côté + côté + côté.',
                'Quatre côtés égaux : une seule multiplication suffit.'],
      duree: 40
    };
  }

  function qRectangle(rnd) {
    var L = rnd.entier(5, 20), l = rnd.entier(2, L - 1);
    return {
      enonce: 'Calcule le <strong>périmètre</strong> d\'un rectangle de longueur \\(' + L +
              '\\) cm et de largeur \\(' + l + '\\) cm.',
      type: 'nombre', reponse: 2 * (L + l), unite: 'cm',
      etapes: [
        'Le tour d\'un rectangle, c\'est <b>deux longueurs et deux largeurs</b>.',
        '\\(\\mathcal{P} = L + \\ell + L + \\ell = 2 \\times (L + \\ell)\\)',
        'Donc \\(\\mathcal{P} = 2 \\times (' + L + ' + ' + l + ') = 2 \\times ' + (L + l) +
          ' = ' + (2 * (L + l)) + '\\) cm.'
      ],
      indices: ['Il y a deux longueurs ET deux largeurs, pas une de chaque.',
                'Additionne d\'abord L + ℓ, puis double le résultat.'],
      duree: 45
    };
  }

  // Trois côtés deux à deux différents : a < b < c, avec c < a + b pour que le
  // triangle existe vraiment. Le tirage le garantit sans avoir à recommencer.
  function qTriangle(rnd) {
    var a = rnd.entier(4, 10);
    var b = a + rnd.entier(1, 4);
    var c = b + rnd.entier(1, Math.min(4, a - 1));
    var t = rnd.melange([a, b, c]), P = a + b + c;
    return {
      enonce: 'Un triangle a pour côtés \\(' + t[0] + '\\) cm, \\(' + t[1] + '\\) cm et \\(' +
              t[2] + '\\) cm. Calcule son <strong>périmètre</strong>.',
      type: 'nombre', reponse: P, unite: 'cm',
      etapes: [
        'Aucun côté n\'est égal à un autre : il n\'y a rien à factoriser, on <b>additionne les trois</b>.',
        '\\(\\mathcal{P} = a + b + c\\)',
        'Donc \\(\\mathcal{P} = ' + t[0] + ' + ' + t[1] + ' + ' + t[2] + ' = ' + P + '\\) cm.'
      ],
      indices: ['Le périmètre, c\'est le tour : on parcourt les trois côtés.',
                'Ici il n\'y a aucune formule à retenir — une simple addition.'],
      duree: 40
    };
  }

  function qEquilateral(rnd) {
    var c = rnd.entier(3, 25);
    return {
      enonce: 'Calcule le <strong>périmètre</strong> d\'un triangle <strong>équilatéral</strong> ' +
              'de côté \\(' + c + '\\) cm.',
      type: 'nombre', reponse: 3 * c, unite: 'cm',
      etapes: [
        '« Équilatéral » veut dire que les <b>3 côtés sont égaux</b>.',
        '\\(\\mathcal{P} = c + c + c = 3 \\times c\\)',
        'Donc \\(\\mathcal{P} = 3 \\times ' + c + ' = ' + (3 * c) + '\\) cm.'
      ],
      indices: ['Un triangle équilatéral a ses trois côtés de même longueur.',
                'Trois côtés, donc 3 × côté — et non 4 × côté comme pour le carré.'],
      duree: 40
    };
  }

  // Base et côtés égaux, avec 2c > b pour que le triangle se referme.
  function isoDims(rnd) {
    var c = rnd.entier(5, 16);
    var b = rnd.entier(3, Math.min(20, 2 * c - 1));
    if (b === c) b -= 1;                     // sinon il serait équilatéral
    return { b: b, c: c, P: b + 2 * c };
  }

  function qIsocele(rnd) {
    var d = isoDims(rnd);
    return {
      enonce: 'Un triangle <strong>isocèle</strong> a une base de \\(' + d.b +
              '\\) cm et deux côtés égaux de \\(' + d.c + '\\) cm chacun. ' +
              'Calcule son <strong>périmètre</strong>.',
      type: 'nombre', reponse: d.P, unite: 'cm',
      etapes: [
        'Un triangle isocèle a <b>deux côtés égaux</b> : on les compte deux fois, ' +
          'puis on ajoute la base.',
        '\\(\\mathcal{P} = b + c + c = b + 2 \\times c\\)',
        'Donc \\(\\mathcal{P} = ' + d.b + ' + 2 \\times ' + d.c + ' = ' + d.b + ' + ' +
          (2 * d.c) + ' = ' + d.P + '\\) cm.'
      ],
      indices: ['Il y a trois côtés en tout : la base, et deux côtés égaux.',
                'Le côté égal se compte deux fois, la base une seule.'],
      duree: 50
    };
  }

  function qCercleRayon(rnd) {
    var r = rnd.entier(2, 15), P = 2 * Math.PI * r, rep = arrondi(P);
    return {
      enonce: 'Calcule le <strong>périmètre</strong> d\'un cercle de <strong>rayon</strong> \\(' +
              r + '\\) cm. Donne l\'arrondi au <strong>dixième</strong> (π ≈ 3,14159).',
      type: 'nombre', reponse: rep, unite: 'cm',
      etapes: [
        'Le périmètre d\'un cercle — sa <b>circonférence</b> — vaut <b>2 × π × rayon</b>.',
        '\\(\\mathcal{P} = 2 \\times \\pi \\times ' + r + ' = \\pi \\times ' + (2 * r) + '\\)',
        'Soit environ \\(' + O.tex(P, 3) + '\\), donc <b>' + O.fr(rep) + '</b> cm au dixième.'
      ],
      indices: ['La formule utilise le rayon : 2 × π × r.',
                'Prends π ≈ 3,14159, et n\'arrondis qu\'à la toute fin.'],
      duree: 60
    };
  }

  // Le même cercle, mais donné par son diamètre : la faute attendue est de
  // multiplier encore par 2 un nombre qui vaut déjà deux rayons.
  function qCercleDiametre(rnd) {
    var d = rnd.entier(3, 30), P = Math.PI * d, rep = arrondi(P);
    return {
      enonce: 'Calcule le <strong>périmètre</strong> d\'un cercle de <strong>diamètre</strong> \\(' +
              d + '\\) cm. Donne l\'arrondi au <strong>dixième</strong> (π ≈ 3,14159).',
      type: 'nombre', reponse: rep, unite: 'cm',
      etapes: [
        'C\'est le <b>diamètre</b> qui est donné, pas le rayon. Avec le diamètre, ' +
          'la formule s\'écrit <b>π × d</b>.',
        '\\(\\mathcal{P} = \\pi \\times ' + d + '\\)',
        'Soit environ \\(' + O.tex(P, 3) + '\\), donc <b>' + O.fr(rep) + '</b> cm au dixième.'
      ],
      indices: ['\\(2 \\times \\pi \\times r\\) et \\(\\pi \\times d\\), c\'est la même ' +
                  'chose, puisque \\(d = 2 \\times r\\).',
                'Ne double pas le diamètre : il vaut déjà deux rayons.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* Questions inverses : le périmètre est donné, la dimension est cherchée */
  /* ===================================================================== */
  function qInverseCarre(rnd) {
    var c = rnd.entier(3, 25), P = 4 * c;
    return {
      enonce: 'Le périmètre d\'un carré vaut \\(' + P + '\\) cm. ' +
              'Quelle est la longueur de son <strong>côté</strong> ?',
      type: 'nombre', reponse: c, unite: 'cm',
      etapes: [
        'Le tour est fait de <b>4 côtés égaux</b> : \\(\\mathcal{P} = 4 \\times c\\).',
        'Pour remonter au côté, on fait l\'opération inverse de la multiplication : ' +
          'on <b>divise par 4</b>.',
        '\\(' + P + ' \\div 4 = ' + c + '\\) cm.'
      ],
      indices: ['Le périmètre vaut 4 fois le côté.',
                'Quelle opération défait une multiplication par 4 ?'],
      duree: 50
    };
  }

  function qInverseEquilateral(rnd) {
    var c = rnd.entier(3, 25), P = 3 * c;
    return {
      enonce: 'Un triangle équilatéral a un périmètre de \\(' + P + '\\) cm. ' +
              'Combien mesure <strong>chacun de ses côtés</strong> ?',
      type: 'nombre', reponse: c, unite: 'cm',
      etapes: [
        'Les <b>3 côtés sont égaux</b> : \\(\\mathcal{P} = 3 \\times c\\).',
        'On divise donc le périmètre par 3.',
        '\\(' + P + ' \\div 3 = ' + c + '\\) cm.'
      ],
      indices: ['Trois côtés égaux se partagent le tour.',
                'Attention : par 3, pas par 4 — ce n\'est pas un carré.'],
      duree: 50
    };
  }

  function qInverseRectangle(rnd) {
    var L = rnd.entier(6, 20), l = rnd.entier(2, L - 1), P = 2 * (L + l);
    return {
      enonce: 'Un rectangle a un périmètre de \\(' + P + '\\) cm et une longueur de \\(' + L +
              '\\) cm. Quelle est sa <strong>largeur</strong> ?',
      type: 'nombre', reponse: l, unite: 'cm',
      etapes: [
        'Le tour vaut \\(2 \\times (L + \\ell)\\). En divisant le périmètre par 2, ' +
          'on obtient <b>une longueur plus une largeur</b>.',
        '\\(' + P + ' \\div 2 = ' + (L + l) + '\\) cm, et c\'est \\(L + \\ell\\).',
        'Il ne reste qu\'à retirer la longueur : \\(' + (L + l) + ' - ' + L + ' = ' + l +
          '\\) cm.'
      ],
      indices: ['Commence par diviser le périmètre par 2 : tu obtiens L + ℓ.',
                'Ensuite, retire la longueur de ce résultat.'],
      duree: 70
    };
  }

  function qInverseIsocele(rnd) {
    var d = isoDims(rnd);
    return {
      enonce: 'Un triangle isocèle a un périmètre de \\(' + d.P + '\\) cm et une base de \\(' +
              d.b + '\\) cm. Combien mesure <strong>chacun de ses deux côtés égaux</strong> ?',
      type: 'nombre', reponse: d.c, unite: 'cm',
      etapes: [
        'Le tour vaut \\(b + 2 \\times c\\). On commence par <b>retirer la base</b>.',
        '\\(' + d.P + ' - ' + d.b + ' = ' + (2 * d.c) + '\\) cm : c\'est ce que mesurent ' +
          'les <b>deux</b> côtés égaux mis bout à bout.',
        'Chacun mesure donc \\(' + (2 * d.c) + ' \\div 2 = ' + d.c + '\\) cm.'
      ],
      indices: ['Retire d\'abord la base du périmètre.',
                'Ce qui reste, ce sont DEUX côtés égaux, pas un seul.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* Questions de sens                                                      */
  /* ===================================================================== */
  // Périmètre ou aire ? Et dans quelle unité ? Les deux erreurs vont ensemble,
  // on les teste donc dans la même question.
  function qUsage(rnd) {
    var CAS = [
      { txt: 'On veut poser une <strong>clôture</strong> tout autour d\'un jardin.', tour: true },
      { txt: 'On veut coudre un <strong>ruban</strong> sur tout le bord d\'une nappe.', tour: true },
      { txt: 'On veut <strong>carreler</strong> le sol d\'une pièce.', tour: false },
      { txt: 'On veut <strong>peindre</strong> toute la surface d\'un mur.', tour: false }
    ];
    var cas = rnd.choix(CAS);
    var bon = cas.tour ? 'le périmètre, en m' : 'l\'aire, en m²';
    var choix = rnd.melange(['le périmètre, en m', 'l\'aire, en m²',
                             'le périmètre, en m²', 'l\'aire, en m']);
    return {
      enonce: cas.txt + ' Que faut-il calculer, et dans quelle unité ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        cas.tour
          ? 'Une clôture, un ruban : on suit le <b>tour</b> de la figure. C\'est le périmètre.'
          : 'Carreler, peindre : on couvre une <b>surface</b>. C\'est l\'aire.',
        cas.tour
          ? 'Le périmètre est une <b>longueur</b> : il se mesure en m (ou en cm, en km…).'
          : 'L\'aire est une <b>surface</b> : elle se mesure en m² (ou en cm², en km²…).',
        'Réponse : <b>' + bon + '</b>.'
      ],
      indices: ['Demande-toi si on fait le tour de la figure, ou si on la recouvre.',
                'Une longueur se mesure en m, une surface en m².'],
      duree: 45
    };
  }

  function qPi(rnd) {
    var bon = 'environ 3,14 fois';
    var choix = rnd.melange([bon, 'exactement 3 fois', 'environ 6,28 fois', 'environ 2 fois']);
    return {
      enonce: 'Le tour d\'un cercle vaut combien de fois son <strong>diamètre</strong> ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        'Déroule le tour d\'un cercle sur une règle : il y tient <b>trois diamètres, ' +
          'plus un petit reste</b>.',
        'Ce reste vaut environ \\(0{,}14\\) diamètre — d\'où \\(3{,}14\\ldots\\)',
        'Et ce nombre est le même pour <b>tous</b> les cercles : c\'est \\(\\pi\\).'
      ],
      indices: ['Repense au déroulage : trois diamètres, et il reste un petit bout.',
                'Ce nombre porte un nom, et une lettre grecque.'],
      duree: 40
    };
  }

  // Le contre-exemple qui casse « même périmètre donc même aire », et deux
  // affirmations voisines pour que la bonne réponse ne soit pas toujours Faux.
  function qAffirmation(rnd) {
    var s = rnd.entier(9, 16);                       // demi-périmètre L + ℓ
    var L1 = rnd.entier(Math.floor(s / 2) + 2, s - 1), l1 = s - L1;
    var L2 = Math.floor(s / 2) + 1, l2 = s - L2;     // le plus « carré » des deux

    var A = [
      { txt: 'Deux rectangles qui ont le <strong>même périmètre</strong> ont forcément ' +
             'la <strong>même aire</strong>.',
        vrai: false,
        etapes: [
          'C\'est faux, et un seul contre-exemple suffit à le montrer.',
          'Le rectangle \\(' + L1 + ' \\times ' + l1 + '\\) et le rectangle \\(' + L2 +
            ' \\times ' + l2 + '\\) ont tous les deux un périmètre de \\(' + (2 * s) + '\\) cm.',
          'Mais leurs aires valent \\(' + (L1 * l1) + '\\) cm² et \\(' + (L2 * l2) +
            '\\) cm² : elles sont <b>différentes</b>. Périmètre et aire sont deux ' +
            'grandeurs indépendantes.'
        ],
        indices: ['Essaie de trouver deux rectangles de même tour mais de formes différentes.',
                  'Un rectangle très allongé et un presque carré peuvent avoir le même tour.'] },

      { txt: 'Si on <strong>double le côté</strong> d\'un carré, son <strong>périmètre ' +
             'double</strong> aussi.',
        vrai: true,
        etapes: [
          'Le périmètre vaut \\(4 \\times c\\).',
          'Si le côté devient \\(2 \\times c\\), le périmètre devient ' +
            '\\(4 \\times 2 \\times c = 2 \\times (4 \\times c)\\).',
          'Il a bien <b>doublé</b>. Attention : l\'aire, elle, serait multipliée par 4.'
        ],
        indices: ['Écris le périmètre avant, puis après.',
                  'Le périmètre est une longueur : il suit le côté.'] }
    ];

    var c = rnd.entier(3, 12);
    A.push({
      txt: 'Le périmètre d\'un carré de côté \\(' + c + '\\) cm vaut \\(' + (c * c) + '\\) cm.',
      vrai: false,
      etapes: [
        'Non : \\(' + c + ' \\times ' + c + ' = ' + (c * c) + '\\), c\'est l\'<b>aire</b> ' +
          'du carré, en cm².',
        'Le périmètre, c\'est le tour : \\(4 \\times ' + c + ' = ' + (4 * c) + '\\) cm.',
        'Deux grandeurs différentes, deux formules différentes, deux unités différentes.'
      ],
      indices: ['Côté × côté, est-ce bien le tour de la figure ?',
                'Compte les quatre côtés.']
    });

    var a = rnd.choix(A);
    return {
      enonce: a.txt,
      type: 'vraifaux', correct: a.vrai ? 0 : 1,
      etapes: a.etapes, indices: a.indices, duree: 50
    };
  }

  /* ===================================================================== */
  /* Le vivier, palier par palier                                          */
  /* ===================================================================== */
  var QUESTIONS = [
    { des: 1, poids: 3, f: qCarre },
    { des: 1, poids: 3, f: qRectangle },
    { des: 1, poids: 3, f: qTriangle },
    { des: 2, poids: 3, f: qEquilateral },
    { des: 2, poids: 3, f: qIsocele },
    { des: 2, poids: 2, f: qUsage },
    { des: 3, poids: 3, f: qCercleRayon },
    { des: 3, poids: 3, f: qCercleDiametre },
    { des: 3, poids: 2, f: qPi },
    { des: 3, poids: 2, f: qInverseCarre },
    { des: 3, poids: 2, f: qInverseEquilateral },
    { des: 4, poids: 3, f: qInverseRectangle },
    { des: 4, poids: 3, f: qInverseIsocele },
    { des: 4, poids: 2, f: qAffirmation }
  ];

  MathsExos.register({
    id: 'perimetres', competence: 'perimetres', level: '6eme',
    titre: 'Périmètres', paliers: 4,

    genere: function (rnd, palier) {
      var dispo = QUESTIONS.filter(function (q) { return q.des <= palier; });
      return pondere(rnd, dispo).f(rnd, palier);
    }
  });
})();
