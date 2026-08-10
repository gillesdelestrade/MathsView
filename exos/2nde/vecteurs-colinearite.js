/*
 * vec-colin — produit par un réel et colinéarité (leçon 2nde « Multiplier un
 * vecteur par un nombre »).
 *
 * Deux idées, et la seconde découle de la première.
 *
 *   • \(k\vec{u}\) garde la DIRECTION de \(\vec{u}\). Le sens ne change que si
 *     \(k\) est négatif, et la longueur est multipliée par \(|k|\) — la valeur
 *     absolue, pas \(k\). C'est l'erreur classique : « \(k = -3\) donc la
 *     longueur est \(-3\) fois plus grande » n'a aucun sens.
 *
 *   • Deux vecteurs sont colinéaires s'il existe un tel \(k\). En pratique on
 *     le lit sur les coordonnées, et la leçon en donne le test :
 *     \(xy' - yx' = 0\).
 *
 * L'intérêt du chapitre n'est pas le calcul mais ce qu'il permet de DÉMONTRER :
 * trois points alignés, deux droites parallèles. Ces deux questions occupent le
 * palier 3, et la recherche d'une coordonnée manquante — où il faut résoudre
 * une équation — le palier 4.
 *
 * Le déterminant sert ici d'outil silencieux : il est nommé et calculé, mais
 * c'est le générateur « vec-det » qui l'étudie pour lui-même.
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  /* --- Produit par un réel ---------------------------------------------- */
  function qProduit(rnd) {
    var u = V.vecteur(rnd, 5), k = rnd.entierNonNul(-5, 5);
    var w = { x: k * u.x, y: k * u.y };
    return {
      enonce: 'On donne \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(k = ' + O.tex(k) +
              '\\). Détermine les coordonnées de \\(k\\vec{u}\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(w.x, w.y),
      etapes: [
        'On multiplie <b>chaque</b> coordonnée par \\(k\\) : \\(k\\vec{u}\\,(kx\\,;\\,ky)\\).',
        '\\(x = ' + O.tex(k) + ' \\times ' + V.parTex(u.x) + ' = ' + O.tex(w.x) + '\\)',
        '\\(y = ' + O.tex(k) + ' \\times ' + V.parTex(u.y) + ' = ' + O.tex(w.y) + '\\)',
        'Donc \\(k\\vec{u}\\,' + V.coordTex(w.x, w.y) + '\\).'
      ],
      indices: ['Les deux coordonnées sont multipliées, pas seulement la première.',
                'Fais attention aux règles de signes.'],
      duree: 50
    };
  }

  /* --- Ce que k fait au sens et à la longueur --------------------------- */
  function qEffetDeK(rnd) {
    var k = rnd.choix([-4, -3, -2, 2, 3, 4]);
    var bon = k > 0
      ? 'même sens, et une longueur ' + Math.abs(k) + ' fois plus grande'
      : 'sens opposé, et une longueur ' + Math.abs(k) + ' fois plus grande';
    var choix = rnd.melange([
      'même sens, et une longueur ' + Math.abs(k) + ' fois plus grande',
      'sens opposé, et une longueur ' + Math.abs(k) + ' fois plus grande',
      'même sens, et une longueur ' + Math.abs(k) + ' fois plus petite',
      'une direction différente de celle de \\(\\vec{u}\\)'
    ]);
    return {
      enonce: 'Soit \\(\\vec{u}\\) un vecteur non nul et \\(k = ' + O.tex(k) +
              '\\). Par rapport à \\(\\vec{u}\\), le vecteur \\(k\\vec{u}\\) a…',
      type: 'qcm', choix: choix, correct: choix.indexOf(bon),
      etapes: [
        'Quel que soit \\(k \\neq 0\\), le vecteur \\(k\\vec{u}\\) a toujours la ' +
          '<b>même direction</b> que \\(\\vec{u}\\) : les deux flèches restent parallèles.',
        k > 0
          ? 'Ici \\(k = ' + O.tex(k) + ' > 0\\) : le <b>sens est conservé</b>.'
          : 'Ici \\(k = ' + O.tex(k) + ' < 0\\) : le <b>sens est inversé</b>, la flèche ' +
            'est retournée.',
        'La longueur est multipliée par \\(|k| = ' + Math.abs(k) + '\\) — la <b>valeur ' +
          'absolue</b> de \\(k\\), qui est toujours positive. Une longueur négative ' +
          'n\'existe pas.'
      ],
      indices: ['La direction ne change jamais. Regarde seulement le signe de \\(k\\).',
                'Pour la longueur, c\'est \\(|k|\\) qui compte, pas \\(k\\).'],
      duree: 50
    };
  }

  /* --- Colinéaires ou non ? --------------------------------------------- */
  function qColineaires(rnd) {
    var u = V.vecteur(rnd, 6);
    var oui = rnd.booleen();
    var v;
    if (oui) {
      var k = rnd.entierNonNul(-3, 3);
      v = { x: k * u.x, y: k * u.y };
    } else {
      v = V.vecteur(rnd, 6);
      if (V.colineaires(u, v)) v = { x: -u.y, y: u.x };
    }
    var d = V.det(u, v);
    oui = (d === 0);
    return {
      enonce: 'Les vecteurs \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\) sont-ils <strong>colinéaires</strong> ?',
      type: 'vraifaux', correct: oui ? 0 : 1,
      etapes: [
        'Deux vecteurs sont colinéaires si et seulement si \\(xy\' - yx\' = 0\\) ' +
          '(leurs coordonnées sont proportionnelles).',
        '\\(' + O.tex(u.x) + ' \\times ' + V.parTex(v.y) + ' - ' + O.tex(u.y) +
          ' \\times ' + V.parTex(v.x) + ' = ' + O.tex(u.x * v.y) + ' - ' +
          V.parTex(u.y * v.x) + ' = ' + O.tex(d) + '\\)',
        oui
          ? 'Le résultat est <b>nul</b> : les deux vecteurs sont colinéaires, ' +
            'les droites qui les portent sont parallèles.'
          : 'Le résultat n\'est <b>pas nul</b> : les deux vecteurs ne sont pas colinéaires.'
      ],
      indices: ['Multiplie en croix, puis soustrais.',
                'Colinéaires ⟺ le résultat vaut exactement 0.'],
      duree: 60
    };
  }

  /* --- Le coefficient k -------------------------------------------------- */
  function qTrouveK(rnd) {
    var u = V.vecteur(rnd, 5), k = rnd.entierNonNul(-4, 4);
    var v = { x: k * u.x, y: k * u.y };
    return {
      enonce: 'On donne \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\). Ces vecteurs sont colinéaires. ' +
              'Détermine le réel \\(k\\) tel que \\(\\vec{v} = k\\,\\vec{u}\\).',
      type: 'nombre', reponse: k,
      etapes: [
        'Écrire \\(\\vec{v} = k\\,\\vec{u}\\), c\'est écrire \\(' + O.tex(v.x) + ' = k \\times ' +
          V.parTex(u.x) + '\\) et \\(' + O.tex(v.y) + ' = k \\times ' + V.parTex(u.y) + '\\).',
        (u.x !== 0
          ? 'La première donne \\(k = ' + O.tex(v.x) + ' \\div ' + V.parTex(u.x) + ' = ' +
            O.tex(k) + '\\).'
          : 'La première coordonnée est nulle des deux côtés : elle ne renseigne pas. ' +
            'On utilise la seconde : \\(k = ' + O.tex(v.y) + ' \\div ' + V.parTex(u.y) +
            ' = ' + O.tex(k) + '\\).'),
        'On vérifie sur l\'autre coordonnée : \\(' + O.tex(k) + ' \\times ' +
          V.parTex(u.x !== 0 ? u.y : u.x) + ' = ' + O.tex(u.x !== 0 ? v.y : v.x) +
          '\\). C\'est bien cela.'
      ],
      indices: ['Par quoi faut-il multiplier la première coordonnée de \\(\\vec{u}\\) ' +
                  'pour obtenir celle de \\(\\vec{v}\\) ?',
                'Le même nombre doit convenir pour les deux coordonnées.'],
      duree: 70
    };
  }

  /* --- Trois points alignés --------------------------------------------- */
  function qAlignes(rnd) {
    var n = V.noms(rnd, 3);
    var A = V.point(rnd, 5), u = V.vecteur(rnd, 3);
    var B = { x: A.x + u.x, y: A.y + u.y };
    var k = rnd.entierNonNul(-3, 3);
    var C = rnd.booleen()
      ? { x: A.x + k * u.x, y: A.y + k * u.y }                       // aligné
      : { x: A.x + k * u.x + rnd.entierNonNul(-2, 2), y: A.y + k * u.y };
    var AB = V.delta(A, B), AC = V.delta(A, C);
    var d = V.det(AB, AC);
    return {
      enonce: 'On donne \\(' + V.ptTex(n[0], A.x, A.y) + '\\), \\(' + V.ptTex(n[1], B.x, B.y) +
              '\\) et \\(' + V.ptTex(n[2], C.x, C.y) + '\\). Ces trois points sont-ils ' +
              '<strong>alignés</strong> ?',
      type: 'vraifaux', correct: d === 0 ? 0 : 1,
      etapes: [
        'Trois points sont alignés si et seulement si \\(' + V.vec(n[0] + n[1]) + '\\) et \\(' +
          V.vec(n[0] + n[2]) + '\\) sont <b>colinéaires</b>.',
        '\\(' + V.vecTex(n[0] + n[1], AB.x, AB.y) + '\\) et \\(' +
          V.vecTex(n[0] + n[2], AC.x, AC.y) + '\\)',
        '\\(' + O.tex(AB.x) + ' \\times ' + V.parTex(AC.y) + ' - ' + O.tex(AB.y) +
          ' \\times ' + V.parTex(AC.x) + ' = ' + O.tex(d) + '\\)',
        d === 0
          ? 'Nul : les vecteurs sont colinéaires, donc les trois points sont bien alignés.'
          : 'Non nul : les vecteurs ne sont pas colinéaires, les trois points ne sont ' +
            '<b>pas</b> alignés.'
      ],
      indices: ['Fabrique deux vecteurs à partir du <b>même</b> point.',
                'Alignés ⟺ ces deux vecteurs sont colinéaires.'],
      duree: 90
    };
  }

  /* --- Deux droites parallèles ------------------------------------------ */
  function qParalleles(rnd) {
    var n = V.noms(rnd, 4);
    var A = V.point(rnd, 5), u = V.vecteur(rnd, 3);
    var B = { x: A.x + u.x, y: A.y + u.y };
    var C = V.point(rnd, 5);
    var k = rnd.entierNonNul(-3, 3);
    var D = rnd.booleen()
      ? { x: C.x + k * u.x, y: C.y + k * u.y }
      : { x: C.x + k * u.x, y: C.y + k * u.y + rnd.entierNonNul(-2, 2) };
    var AB = V.delta(A, B), CD = V.delta(C, D);
    var d = V.det(AB, CD);
    return {
      enonce: 'On donne \\(' + V.ptTex(n[0], A.x, A.y) + '\\), \\(' + V.ptTex(n[1], B.x, B.y) +
              '\\), \\(' + V.ptTex(n[2], C.x, C.y) + '\\) et \\(' + V.ptTex(n[3], D.x, D.y) +
              '\\). Les droites \\((' + n[0] + n[1] + ')\\) et \\((' + n[2] + n[3] +
              ')\\) sont-elles <strong>parallèles</strong> ?',
      type: 'vraifaux', correct: d === 0 ? 0 : 1,
      etapes: [
        'Deux droites sont parallèles si et seulement si les vecteurs qui les dirigent ' +
          'sont <b>colinéaires</b>.',
        '\\(' + V.vecTex(n[0] + n[1], AB.x, AB.y) + '\\) et \\(' +
          V.vecTex(n[2] + n[3], CD.x, CD.y) + '\\)',
        '\\(' + O.tex(AB.x) + ' \\times ' + V.parTex(CD.y) + ' - ' + O.tex(AB.y) +
          ' \\times ' + V.parTex(CD.x) + ' = ' + O.tex(d) + '\\)',
        d === 0 ? 'Nul : les droites sont bien parallèles.'
                : 'Non nul : les droites se coupent, elles ne sont pas parallèles.'
      ],
      indices: ['Une droite \\((' + n[0] + n[1] + ')\\) est dirigée par le vecteur \\(' +
                  V.vec(n[0] + n[1]) + '\\).',
                'Parallèles ⟺ vecteurs directeurs colinéaires.'],
      duree: 90
    };
  }

  /* --- La coordonnée qui rend colinéaire -------------------------------- */
  function qCoordManquante(rnd) {
    var u = V.vecteur(rnd, 5);
    // Si l'abscisse de u était nulle, l'équation deviendrait 0 × m = 0 et
    // n'importe quel m conviendrait : la question n'aurait plus de réponse.
    if (u.x === 0) u.x = rnd.entierNonNul(-5, 5);
    // x' est choisi multiple de x pour que m tombe sur un entier.
    var k = rnd.entierNonNul(-3, 3);
    var xp = k * u.x, m = k * u.y;
    return {
      enonce: 'Pour quelle valeur de \\(m\\) les vecteurs \\(' + V.vecTex('u', u.x, u.y) +
              '\\) et \\(\\vec{v}\\,(' + O.tex(xp) + '\\,;\\,m)\\) sont-ils ' +
              '<strong>colinéaires</strong> ?',
      type: 'nombre', reponse: m,
      etapes: [
        'On écrit le test de colinéarité : \\(xy\' - yx\' = 0\\), soit \\(' + O.tex(u.x) +
          'm - ' + V.parTex(u.y) + ' \\times ' + V.parTex(xp) + ' = 0\\).',
        '\\(' + O.tex(u.x) + 'm = ' + O.tex(u.y * xp) + '\\)',
        '\\(m = ' + O.tex(u.y * xp) + ' \\div ' + V.parTex(u.x) + ' = ' + O.tex(m) + '\\)',
        'Vérification : \\(\\vec{v}\\,' + V.coordTex(xp, m) + ' = ' + O.tex(k) +
          '\\,\\vec{u}\\). Les deux vecteurs sont bien colinéaires.'
      ],
      indices: ['Pose l\'équation \\(xy\' - yx\' = 0\\) et résous-la en \\(m\\).',
                'Tu peux aussi chercher par quel nombre \\(\\vec{u}\\) a été multiplié.'],
      duree: 110
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 4, f: qProduit },
    { des: 1, poids: 3, f: qEffetDeK },
    { des: 2, poids: 4, f: qColineaires },
    { des: 2, poids: 3, f: qTrouveK },
    { des: 3, poids: 3, f: qAlignes },
    { des: 3, poids: 3, f: qParalleles },
    { des: 4, poids: 4, f: qCoordManquante }
  ];

  MathsExos.register({
    id: 'vec-colin', competence: 'vec-colin', level: '2nde',
    titre: 'Produit par un réel et colinéarité', paliers: 4,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
