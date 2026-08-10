/*
 * vec-egalite — direction, sens, longueur (leçon 2nde « Vecteurs : direction,
 * sens, longueur »).
 *
 * La leçon insiste sur un point que les élèves confondent presque toujours :
 * DIRECTION et SENS ne sont pas la même chose. La direction, c'est
 * l'inclinaison de la droite — deux droites parallèles ont la même direction ;
 * sur cette direction il reste deux sens opposés, et c'est la pointe de la
 * flèche qui tranche.
 *
 * D'où la question centrale de ce générateur : on donne deux vecteurs et on
 * demande ce qu'ils ont en commun. Les trois réponses possibles (même sens,
 * sens opposés, directions différentes) forcent à séparer les deux notions.
 *
 * Le second piège est la LONGUEUR seule : \(\vec{u}(3;4)\) et \(\vec{v}(4;3)\)
 * mesurent tous les deux 5, et beaucoup d'élèves en concluent qu'ils sont
 * égaux. Une question leur est consacrée.
 *
 * On ne calcule des longueurs qu'ici de façon qualitative — le calcul de
 * \(\|\vec{AB}\|\) appartient au générateur « vec-coord ».
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  /* --- Direction et sens : le cœur de la leçon -------------------------- */
  function qDirectionSens(rnd) {
    var u = V.vecteur(rnd, 5);
    var cas = rnd.entier(1, 3), v, bon;

    if (cas === 1) {                                  // v = k u, k > 0
      var k1 = rnd.entier(2, 3);
      v = { x: k1 * u.x, y: k1 * u.y };
      bon = 'même direction et même sens';
    } else if (cas === 2) {                           // v = k u, k < 0
      var k2 = -rnd.entier(1, 3);
      v = { x: k2 * u.x, y: k2 * u.y };
      bon = 'même direction, mais sens opposés';
    } else {                                          // non colinéaires
      v = V.deuxVecteursLibres(rnd, 5)[1];
      if (V.colineaires(u, v)) v = { x: -u.y, y: u.x };
      bon = 'des directions différentes';
    }

    var choix = rnd.melange(['même direction et même sens',
                             'même direction, mais sens opposés',
                             'des directions différentes']);
    var d = V.det(u, v);
    return {
      enonce: 'On donne \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\). Que peut-on dire de ces deux vecteurs ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        'Deux vecteurs ont la <b>même direction</b> lorsque leurs coordonnées sont ' +
          'proportionnelles, c\'est-à-dire lorsque \\(xy\' - yx\' = 0\\).',
        'Ici \\(' + O.tex(u.x) + ' \\times ' + O.tex(v.y) + ' - ' + O.tex(u.y) +
          ' \\times ' + O.tex(v.x) + ' = ' + O.tex(d) + '\\)' +
          (d === 0 ? ', donc même direction.' : ', donc les directions sont différentes.'),
        d === 0
          ? (cas === 1
              ? 'On passe de l\'un à l\'autre en multipliant par un nombre <b>positif</b> : ' +
                'les flèches pointent du <b>même côté</b>, le sens est le même.'
              : 'On passe de l\'un à l\'autre en multipliant par un nombre <b>négatif</b> : ' +
                'la flèche est retournée, le sens est <b>opposé</b>.')
          : 'Les droites qui portent les deux flèches ne sont pas parallèles : ' +
            'la question du sens ne se pose même pas.'
      ],
      indices: ['Regarde d\'abord si les coordonnées sont proportionnelles : c\'est la direction.',
                'Si elles le sont, le signe du coefficient donne le sens.'],
      duree: 55
    };
  }

  /* --- La longueur ne suffit pas ---------------------------------------- */
  function qLongueurSeule(rnd) {
    var t = V.vecteurEntier(rnd);
    var u = { x: t.x, y: t.y };
    var meme = rnd.booleen(0.35);
    // Échanger les coordonnées garde la longueur mais change la direction.
    var v = meme ? { x: u.x, y: u.y } : { x: u.y, y: u.x };
    if (!meme && v.x === u.x && v.y === u.y) v = { x: -u.y, y: u.x };

    var bon = meme
      ? 'ils sont égaux'
      : 'ils ont la même longueur, mais pas la même direction';
    var choix = rnd.melange(['ils sont égaux',
                             'ils ont la même longueur, mais pas la même direction',
                             'ils ont la même direction, mais pas la même longueur',
                             'ils n\'ont ni la même direction ni la même longueur']);
    return {
      enonce: 'On donne \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\). Que peut-on dire ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        'Les deux longueurs : \\(\\|\\vec{u}\\| = \\sqrt{' + (u.x * u.x) + ' + ' + (u.y * u.y) +
          '} = ' + t.n + '\\) et \\(\\|\\vec{v}\\| = \\sqrt{' + (v.x * v.x) + ' + ' +
          (v.y * v.y) + '} = ' + t.n + '\\) : elles sont <b>égales</b>.',
        meme
          ? 'Et les coordonnées sont les mêmes : les deux vecteurs sont bien <b>égaux</b>.'
          : 'Mais \\(' + O.tex(u.x) + ' \\times ' + O.tex(v.y) + ' - ' + O.tex(u.y) +
            ' \\times ' + O.tex(v.x) + ' = ' + O.tex(V.det(u, v)) + ' \\neq 0\\) : les ' +
            'directions sont <b>différentes</b>.',
        meme
          ? 'Deux vecteurs sont égaux exactement quand ils ont les mêmes coordonnées.'
          : 'Avoir la même longueur ne suffit pas : il faut aussi la même direction ' +
            '<b>et</b> le même sens.'
      ],
      indices: ['Calcule les deux longueurs avant de conclure.',
                'Trois caractéristiques doivent coïncider, pas une seule.'],
      duree: 55
    };
  }

  /* --- Égalité de deux vecteurs définis par des points ------------------ */
  function qEgaliteABCD(rnd) {
    var n = V.noms(rnd, 4);
    var A = V.point(rnd, 5), B = V.point(rnd, 5);
    if (A.x === B.x && A.y === B.y) B = { x: A.x + 2, y: A.y + 1 };
    var u = V.delta(A, B);
    var C = V.point(rnd, 5);
    var vrai = rnd.booleen();
    var D = vrai ? { x: C.x + u.x, y: C.y + u.y }
                 : { x: C.x + u.x + rnd.entierNonNul(-2, 2), y: C.y + u.y };
    var w = V.delta(C, D);
    if (w.x === u.x && w.y === u.y) vrai = true;       // le tirage a pu retomber juste

    return {
      enonce: 'On donne \\(' + V.ptTex(n[0], A.x, A.y) + '\\), \\(' + V.ptTex(n[1], B.x, B.y) +
              '\\), \\(' + V.ptTex(n[2], C.x, C.y) + '\\) et \\(' + V.ptTex(n[3], D.x, D.y) +
              '\\). A-t-on \\(' + V.vec(n[0] + n[1]) + ' = ' + V.vec(n[2] + n[3]) + '\\) ?',
      type: 'vraifaux', correct: vrai ? 0 : 1,
      etapes: [
        'Deux vecteurs sont égaux <b>si et seulement si</b> ils ont les mêmes coordonnées.',
        '\\(' + V.vec(n[0] + n[1]) + '\\,(' + O.tex(B.x) + ' - ' + O.tex(A.x) + '\\,;\\,' +
          O.tex(B.y) + ' - ' + O.tex(A.y) + ') = ' + V.coordTex(u.x, u.y) + '\\)',
        '\\(' + V.vec(n[2] + n[3]) + '\\,(' + O.tex(D.x) + ' - ' + O.tex(C.x) + '\\,;\\,' +
          O.tex(D.y) + ' - ' + O.tex(C.y) + ') = ' + V.coordTex(w.x, w.y) + '\\)',
        vrai
          ? 'Mêmes coordonnées : les deux vecteurs sont bien égaux, et ' + n[0] + n[1] +
            n[3] + n[2] + ' est un parallélogramme.'
          : 'Les coordonnées diffèrent : les deux vecteurs ne sont <b>pas</b> égaux.'
      ],
      indices: ['Calcule les coordonnées de chacun : arrivée moins départ.',
                'Il suffit qu\'une seule des deux coordonnées diffère.'],
      duree: 70
    };
  }

  /* --- Le vecteur opposé ------------------------------------------------ */
  function qOppose(rnd) {
    var n = V.noms(rnd, 2);
    var u = V.vecteur(rnd, 7);
    return {
      enonce: 'On sait que \\(' + V.vecTex(n[0] + n[1], u.x, u.y) + '\\). ' +
              'Quelles sont les coordonnées de \\(' + V.vec(n[1] + n[0]) + '\\) ? ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(-u.x, -u.y),
      etapes: [
        'Aller de ' + n[1] + ' à ' + n[0] + ', c\'est faire exactement le chemin inverse : ' +
          '\\(' + V.vec(n[1] + n[0]) + ' = -' + V.vec(n[0] + n[1]) + '\\).',
        'On change donc le signe des deux coordonnées.',
        '\\(' + V.vec(n[1] + n[0]) + '\\,' + V.coordTex(-u.x, -u.y) + '\\)'
      ],
      indices: ['Le vecteur ' + n[1] + n[0] + ' est l\'opposé du vecteur ' + n[0] + n[1] + '.',
                'Les deux coordonnées changent de signe, pas une seule.'],
      duree: 45
    };
  }

  /* --- Construire le quatrième point d'un parallélogramme --------------- */
  function qParallelogramme(rnd) {
    var A = V.point(rnd, 5), B = V.point(rnd, 5), C = V.point(rnd, 5);
    if (A.x === B.x && A.y === B.y) B = { x: A.x + 2, y: A.y + 3 };
    var u = V.delta(A, B);
    var D = { x: C.x + u.x, y: C.y + u.y };
    return {
      enonce: 'On donne \\(' + V.ptTex('A', A.x, A.y) + '\\), \\(' + V.ptTex('B', B.x, B.y) +
              '\\) et \\(' + V.ptTex('C', C.x, C.y) + '\\). Détermine les coordonnées du ' +
              'point \\(D\\) tel que \\(\\vec{AB} = \\vec{CD}\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(D.x, D.y),
      etapes: [
        '\\(\\vec{AB}\\,' + V.coordTex(u.x, u.y) + '\\)',
        'Écrire \\(\\vec{CD} = \\vec{AB}\\), c\'est écrire \\(x_D - ' + O.tex(C.x) + ' = ' +
          O.tex(u.x) + '\\) et \\(y_D - ' + O.tex(C.y) + ' = ' + O.tex(u.y) + '\\).',
        'Donc \\(x_D = ' + O.tex(C.x) + ' + ' + O.tex(u.x) + ' = ' + O.tex(D.x) +
          '\\) et \\(y_D = ' + O.tex(C.y) + ' + ' + O.tex(u.y) + ' = ' + O.tex(D.y) + '\\).',
        'Soit \\(D\\,' + V.coordTex(D.x, D.y) + '\\) — et <b>ABDC</b> est un parallélogramme ' +
          '(attention à l\'ordre des lettres).'
      ],
      indices: ['Commence par calculer les coordonnées de \\(\\vec{AB}\\).',
                'Pour trouver D, on part de C et on ajoute les coordonnées de \\(\\vec{AB}\\).'],
      duree: 90
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 3, f: qDirectionSens },
    { des: 1, poids: 3, f: qEgaliteABCD },
    { des: 2, poids: 3, f: qOppose },
    { des: 2, poids: 3, f: qLongueurSeule },
    { des: 3, poids: 4, f: qParallelogramme }
  ];

  MathsExos.register({
    id: 'vec-egalite', competence: 'vec-egalite', level: '2nde',
    titre: 'Direction, sens, longueur', paliers: 3,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
