/*
 * vec-coord — coordonnées d'un vecteur (leçon 2nde « Coordonnées d'un vecteur »).
 *
 * Toute la leçon tient dans « ARRIVÉE MOINS DÉPART », et toute la difficulté
 * dans l'ordre de la soustraction : \(\vec{BA} = -\vec{AB}\). Le générateur
 * attaque donc la formule dans les trois sens.
 *
 *   • Le sens direct : deux points sont donnés, on cherche le vecteur.
 *   • Le sens inverse : le départ et le vecteur sont donnés, on cherche
 *     l'arrivée — puis, plus dur, l'arrivée et le vecteur, on cherche le
 *     départ. C'est là qu'on voit qui a compris la soustraction et qui
 *     récite une formule.
 *   • L'ordre : on demande \(\vec{BA}\) après avoir donné \(\vec{AB}\).
 *
 * S'y ajoutent Chasles en coordonnées — où les termes intermédiaires se
 * simplifient sous les yeux — et la longueur, calculée sur des coordonnées
 * choisies pour que la racine tombe juste (voir vecteurEntier dans les outils).
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  /* --- Le sens direct --------------------------------------------------- */
  function qCoordAB(rnd) {
    var n = V.noms(rnd, 2), p = V.deuxPoints(rnd, 7), A = p[0], B = p[1];
    var u = V.delta(A, B);
    return {
      enonce: 'Dans un repère, \\(' + V.ptTex(n[0], A.x, A.y) + '\\) et \\(' +
              V.ptTex(n[1], B.x, B.y) + '\\). Détermine les coordonnées de \\(' +
              V.vec(n[0] + n[1]) + '\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(u.x, u.y),
      etapes: [
        'Les coordonnées d\'un vecteur, c\'est <b>l\'arrivée moins le départ</b> : ' +
          '\\(' + V.vec(n[0] + n[1]) + '\\,(x_' + n[1] + ' - x_' + n[0] + '\\,;\\,y_' +
          n[1] + ' - y_' + n[0] + ')\\).',
        '\\(x = ' + O.tex(B.x) + ' - ' + V.parTex(A.x) + ' = ' + O.tex(u.x) + '\\)',
        '\\(y = ' + O.tex(B.y) + ' - ' + V.parTex(A.y) + ' = ' + O.tex(u.y) + '\\)',
        'Donc \\(' + V.vecTex(n[0] + n[1], u.x, u.y) + '\\).'
      ],
      indices: ['Arrivée moins départ, coordonnée par coordonnée.',
                'Attention aux signes quand une coordonnée est négative.'],
      duree: 60
    };
  }

  /* --- L'ordre des lettres ---------------------------------------------- */
  function qCoordBA(rnd) {
    var n = V.noms(rnd, 2), p = V.deuxPoints(rnd, 7), A = p[0], B = p[1];
    var u = V.delta(B, A);
    return {
      enonce: 'Dans un repère, \\(' + V.ptTex(n[0], A.x, A.y) + '\\) et \\(' +
              V.ptTex(n[1], B.x, B.y) + '\\). Détermine les coordonnées de \\(' +
              V.vec(n[1] + n[0]) + '\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(u.x, u.y),
      etapes: [
        'Attention à l\'ordre : ici le départ est ' + n[1] + ' et l\'arrivée est ' + n[0] + '.',
        '\\(x = ' + O.tex(A.x) + ' - ' + V.parTex(B.x) + ' = ' + O.tex(u.x) + '\\)',
        '\\(y = ' + O.tex(A.y) + ' - ' + V.parTex(B.y) + ' = ' + O.tex(u.y) + '\\)',
        'Donc \\(' + V.vecTex(n[1] + n[0], u.x, u.y) + '\\) — c\'est l\'opposé de \\(' +
          V.vec(n[0] + n[1]) + '\\).'
      ],
      indices: ['La première lettre est le départ, la seconde l\'arrivée.',
                'Si tu as calculé \\(' + V.vec(n[0] + n[1]) + '\\), change les deux signes.'],
      duree: 60
    };
  }

  /* --- Le sens inverse : retrouver l'arrivée ---------------------------- */
  function qTrouveArrivee(rnd) {
    var n = V.noms(rnd, 2), A = V.point(rnd, 6), u = V.vecteur(rnd, 6);
    var B = { x: A.x + u.x, y: A.y + u.y };
    return {
      enonce: 'On sait que \\(' + V.ptTex(n[0], A.x, A.y) + '\\) et que \\(' +
              V.vecTex(n[0] + n[1], u.x, u.y) + '\\). Détermine les coordonnées du point \\(' +
              n[1] + '\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(B.x, B.y),
      etapes: [
        'Par définition \\(x_' + n[1] + ' - x_' + n[0] + ' = ' + O.tex(u.x) + '\\), ' +
          'donc \\(x_' + n[1] + ' = x_' + n[0] + ' + ' + O.tex(u.x) + '\\).',
        '\\(x_' + n[1] + ' = ' + O.tex(A.x) + ' + ' + V.parTex(u.x) + ' = ' + O.tex(B.x) + '\\)',
        '\\(y_' + n[1] + ' = ' + O.tex(A.y) + ' + ' + V.parTex(u.y) + ' = ' + O.tex(B.y) + '\\)',
        'Donc \\(' + V.ptTex(n[1], B.x, B.y) + '\\).'
      ],
      indices: ['On part de ' + n[0] + ' et on applique le déplacement.',
                'Cette fois on ADDITIONNE les coordonnées du vecteur.'],
      duree: 70
    };
  }

  /* --- Le sens inverse, version difficile : retrouver le départ --------- */
  function qTrouveDepart(rnd) {
    var n = V.noms(rnd, 2), B = V.point(rnd, 6), u = V.vecteur(rnd, 6);
    var A = { x: B.x - u.x, y: B.y - u.y };
    return {
      enonce: 'On sait que \\(' + V.ptTex(n[1], B.x, B.y) + '\\) et que \\(' +
              V.vecTex(n[0] + n[1], u.x, u.y) + '\\). Détermine les coordonnées du point \\(' +
              n[0] + '\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(A.x, A.y),
      etapes: [
        'Ici c\'est le <b>départ</b> qui est inconnu. On repart de la définition : ' +
          '\\(x_' + n[1] + ' - x_' + n[0] + ' = ' + O.tex(u.x) + '\\).',
        'Donc \\(x_' + n[0] + ' = x_' + n[1] + ' - ' + V.parTex(u.x) + ' = ' + O.tex(B.x) +
          ' - ' + V.parTex(u.x) + ' = ' + O.tex(A.x) + '\\).',
        '\\(y_' + n[0] + ' = ' + O.tex(B.y) + ' - ' + V.parTex(u.y) + ' = ' + O.tex(A.y) + '\\)',
        'Donc \\(' + V.ptTex(n[0], A.x, A.y) + '\\). On peut vérifier : ' +
          'arrivée moins départ redonne bien \\(' + V.coordTex(u.x, u.y) + '\\).'
      ],
      indices: ['Attention : le point cherché est le DÉPART, pas l\'arrivée.',
                'Il faut donc retirer les coordonnées du vecteur, pas les ajouter.'],
      duree: 90
    };
  }

  /* --- Chasles en coordonnées ------------------------------------------- */
  function qChasles(rnd) {
    var n = V.noms(rnd, 3);
    var A = V.point(rnd, 5), B = V.point(rnd, 5), C = V.point(rnd, 5);
    var u = V.delta(A, B), v = V.delta(B, C), w = V.delta(A, C);
    return {
      enonce: 'On donne \\(' + V.ptTex(n[0], A.x, A.y) + '\\), \\(' + V.ptTex(n[1], B.x, B.y) +
              '\\) et \\(' + V.ptTex(n[2], C.x, C.y) + '\\). Détermine les coordonnées de \\(' +
              V.vec(n[0] + n[1]) + ' + ' + V.vec(n[1] + n[2]) + '\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(w.x, w.y),
      etapes: [
        '\\(' + V.vecTex(n[0] + n[1], u.x, u.y) + '\\) et \\(' +
          V.vecTex(n[1] + n[2], v.x, v.y) + '\\).',
        'On additionne coordonnée par coordonnée : \\(' + O.tex(u.x) + O.signeTex(v.x) +
          ' = ' + O.tex(w.x) + '\\) et \\(' + O.tex(u.y) + O.signeTex(v.y) + ' = ' +
          O.tex(w.y) + '\\).',
        'On retrouve \\(' + V.vec(n[0] + n[2]) + '\\,' + V.coordTex(w.x, w.y) + '\\) : ' +
          'le point ' + n[1] + ' a disparu, c\'est la <b>relation de Chasles</b>.'
      ],
      indices: ['Calcule les deux vecteurs, puis additionne leurs coordonnées.',
                'Tu peux aussi remarquer directement que la somme vaut \\(' +
                  V.vec(n[0] + n[2]) + '\\).'],
      duree: 90
    };
  }

  /* --- La longueur ------------------------------------------------------ */
  function qNorme(rnd) {
    var n = V.noms(rnd, 2), t = V.vecteurEntier(rnd);
    var A = V.point(rnd, 4);
    var B = { x: A.x + t.x, y: A.y + t.y };
    return {
      enonce: 'Dans un repère <strong>orthonormé</strong>, \\(' + V.ptTex(n[0], A.x, A.y) +
              '\\) et \\(' + V.ptTex(n[1], B.x, B.y) + '\\). Calcule la longueur \\(\\|' +
              V.vec(n[0] + n[1]) + '\\|\\).',
      type: 'nombre', reponse: t.n,
      etapes: [
        'D\'abord les coordonnées : \\(' + V.vecTex(n[0] + n[1], t.x, t.y) + '\\).',
        'Puis Pythagore : \\(\\|' + V.vec(n[0] + n[1]) + '\\| = \\sqrt{x^2 + y^2}\\).',
        '\\(\\sqrt{' + O.tex(t.x) + '^2 + ' + O.tex(t.y) + '^2} = \\sqrt{' + (t.x * t.x) +
          ' + ' + (t.y * t.y) + '} = \\sqrt{' + (t.x * t.x + t.y * t.y) + '} = ' + t.n + '\\)'
      ],
      indices: ['Commence par les coordonnées du vecteur.',
                'La longueur est la racine carrée de la somme des carrés — les carrés ' +
                  'effacent les signes.'],
      duree: 90
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 4, f: qCoordAB },
    { des: 1, poids: 3, f: qCoordBA },
    { des: 2, poids: 3, f: qTrouveArrivee },
    { des: 2, poids: 3, f: qChasles },
    { des: 3, poids: 3, f: qNorme },
    { des: 4, poids: 3, f: qTrouveDepart }
  ];

  MathsExos.register({
    id: 'vec-coord', competence: 'vec-coord', level: '2nde',
    titre: 'Coordonnées d\'un vecteur', paliers: 4,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
