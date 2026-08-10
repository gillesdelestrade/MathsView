/*
 * vec-somme — addition de vecteurs (leçon 2nde « Somme de deux vecteurs »).
 *
 * La leçon dit que Chasles est « la règle la plus utile du chapitre ». Ce
 * générateur la travaille sous ses deux visages, qui n'ont rien à voir pour
 * un élève de seconde :
 *
 *   • en COORDONNÉES, où additionner deux vecteurs est une addition de plus,
 *     sans mystère ;
 *   • en SYMBOLIQUE, où \(\vec{AB}+\vec{BC}=\vec{AC}\) demande de repérer le
 *     point intermédiaire qui « disparaît ». C'est là que ça coince, parce
 *     qu'il n'y a rien à calculer — seulement à lire les lettres.
 *
 * Les réponses symboliques sont des QCM (voir vecteurs-outils.js) : les
 * distracteurs sont les erreurs réelles — inverser les lettres, garder le
 * point intermédiaire, oublier que l'ordre compte.
 *
 * La soustraction n'arrive qu'au dernier palier. \(\vec{AB}-\vec{AC}=\vec{CB}\)
 * n'a rien d'évident, et la correction passe systématiquement par l'opposé.
 */
(function () {
  'use strict';
  var O = ExosOutils, V = VecOutils;

  /* --- Somme en coordonnées --------------------------------------------- */
  function qSommeCoord(rnd) {
    var u = V.vecteur(rnd, 7), v = V.vecteur(rnd, 7);
    var w = { x: u.x + v.x, y: u.y + v.y };
    return {
      enonce: 'On donne \\(' + V.vecTex('u', u.x, u.y) + '\\) et \\(' +
              V.vecTex('v', v.x, v.y) + '\\). Détermine les coordonnées de \\(' +
              '\\vec{u} + \\vec{v}\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(w.x, w.y),
      etapes: [
        'On additionne les coordonnées <b>une à une</b> : les abscisses ensemble, ' +
          'les ordonnées ensemble.',
        '\\(x = ' + O.tex(u.x) + O.signeTex(v.x) + ' = ' + O.tex(w.x) + '\\)',
        '\\(y = ' + O.tex(u.y) + O.signeTex(v.y) + ' = ' + O.tex(w.y) + '\\)',
        'Donc \\(\\vec{u} + \\vec{v}\\,' + V.coordTex(w.x, w.y) + '\\).'
      ],
      indices: ['Abscisse avec abscisse, ordonnée avec ordonnée.',
                'Il n\'y a aucun croisement : c\'est une simple addition.'],
      duree: 55
    };
  }

  /* --- Chasles : le point du milieu disparaît --------------------------- */
  function qChaslesSimple(rnd) {
    var n = V.noms(rnd, 3), A = n[0], B = n[1], C = n[2];
    // Les distracteurs sont les fautes réelles : inverser les lettres, garder
    // seulement l'un des deux vecteurs.
    var bon = A + C;
    var choix = rnd.melange([bon, C + A, A + B, B + C]);
    return {
      enonce: 'Simplifie \\(' + V.vec(A + B) + ' + ' + V.vec(B + C) + '\\).',
      type: 'qcm', choix: choix.map(function (s) { return '\\(' + V.vec(s) + '\\)'; }),
      correct: choix.indexOf(bon),
      etapes: [
        'C\'est la <b>relation de Chasles</b> : on va de ' + A + ' à ' + B + ', puis de ' +
          B + ' à ' + C + '. Au total, on est allé de ' + A + ' à ' + C + '.',
        'Le point d\'arrivée du premier vecteur est le point de départ du second : ' +
          'ce point intermédiaire <b>disparaît</b>.',
        '\\(' + V.vec(A + B) + ' + ' + V.vec(B + C) + ' = ' + V.vec(A + C) + '\\)'
      ],
      indices: ['Lis les lettres comme un trajet : ' + A + ' → ' + B + ' → ' + C + '.',
                'Il ne reste que le tout premier point et le tout dernier.'],
      duree: 45
    };
  }

  function qChaslesChaine(rnd) {
    var n = V.noms(rnd, 4), A = n[0], B = n[1], C = n[2], D = n[3];
    var bon = A + D;
    var choix = rnd.melange([bon, D + A, A + C, B + D]);
    return {
      enonce: 'Simplifie \\(' + V.vec(A + B) + ' + ' + V.vec(B + C) + ' + ' +
              V.vec(C + D) + '\\).',
      type: 'qcm', choix: choix.map(function (s) { return '\\(' + V.vec(s) + '\\)'; }),
      correct: choix.indexOf(bon),
      etapes: [
        'On applique Chasles deux fois de suite. D\'abord \\(' + V.vec(A + B) + ' + ' +
          V.vec(B + C) + ' = ' + V.vec(A + C) + '\\).',
        'Il reste \\(' + V.vec(A + C) + ' + ' + V.vec(C + D) + ' = ' + V.vec(A + D) + '\\).',
        'Autrement dit : le trajet ' + A + ' → ' + B + ' → ' + C + ' → ' + D +
          ' revient à aller directement de ' + A + ' à ' + D + '.'
      ],
      indices: ['Enchaîne les points comme les étapes d\'un trajet.',
                'Tous les points du milieu s\'effacent, l\'un après l\'autre.'],
      duree: 55
    };
  }

  /* --- Le vecteur opposé ------------------------------------------------ */
  function qOppose(rnd) {
    var n = V.noms(rnd, 2), A = n[0], B = n[1];
    var choix = rnd.melange(['\\(\\vec{0}\\)', '\\(' + V.vec(A + B) + '\\)',
                             '\\(' + V.vec(B + A) + '\\)', '\\(2\\,' + V.vec(A + B) + '\\)']);
    return {
      enonce: 'Simplifie \\(' + V.vec(A + B) + ' + ' + V.vec(B + A) + '\\).',
      type: 'qcm', choix: choix, correct: choix.indexOf('\\(\\vec{0}\\)'),
      etapes: [
        'Chasles s\'applique aussi ici : \\(' + V.vec(A + B) + ' + ' + V.vec(B + A) +
          ' = ' + V.vec(A + A) + '\\).',
        'Or aller de ' + A + ' à ' + A + ', c\'est ne pas bouger : \\(' + V.vec(A + A) +
          ' = \\vec{0}\\).',
        'On retrouve que \\(' + V.vec(B + A) + ' = -' + V.vec(A + B) +
          '\\) : les deux vecteurs sont <b>opposés</b>.'
      ],
      indices: ['Applique Chasles sans réfléchir aux flèches : ' + A + ' → ' + B + ' → ' + A + '.',
                'On revient au point de départ.'],
      duree: 45
    };
  }

  /* --- Règle du parallélogramme ----------------------------------------- */
  function qParallelogramme(rnd) {
    var choix = rnd.melange(['\\(\\vec{AC}\\)', '\\(\\vec{BD}\\)',
                             '\\(\\vec{AB}\\)', '\\(\\vec{CA}\\)']);
    return {
      enonce: '\\(ABCD\\) est un <strong>parallélogramme</strong>. Simplifie ' +
              '\\(\\vec{AB} + \\vec{AD}\\).',
      type: 'qcm', choix: choix, correct: choix.indexOf('\\(\\vec{AC}\\)'),
      etapes: [
        'Les deux vecteurs partent du <b>même point</b> \\(A\\) : on ne peut pas appliquer ' +
          'Chasles directement. On utilise la <b>règle du parallélogramme</b>.',
        'Dans le parallélogramme \\(ABCD\\), on a \\(\\vec{AD} = \\vec{BC}\\) ' +
          '(côtés opposés).',
        'Donc \\(\\vec{AB} + \\vec{AD} = \\vec{AB} + \\vec{BC} = \\vec{AC}\\) : ' +
          'la somme est la <b>diagonale</b> issue de \\(A\\).',
        'Attention à l\'ordre des sommets : dans \\(ABCD\\), la diagonale issue de ' +
          '\\(A\\) est \\([AC]\\), pas \\([AD]\\).'
      ],
      indices: ['Deux vecteurs de même origine : pense au parallélogramme.',
                'Remplace \\(\\vec{AD}\\) par un vecteur égal qui part de \\(B\\).'],
      duree: 60
    };
  }

  /* --- Retrouver le second terme d'une somme ---------------------------- */
  function qTermeManquant(rnd) {
    var u = V.vecteur(rnd, 6), v = V.vecteur(rnd, 6);
    var w = { x: u.x + v.x, y: u.y + v.y };
    return {
      enonce: 'On sait que \\(' + V.vecTex('u', u.x, u.y) + '\\) et que \\(\\vec{u} + ' +
              '\\vec{v}\\,' + V.coordTex(w.x, w.y) + '\\). Détermine les coordonnées de ' +
              '\\(\\vec{v}\\). ' + V.CONSIGNE,
      type: 'texte', reponse: V.formesCoord(v.x, v.y),
      etapes: [
        'Si \\(\\vec{u} + \\vec{v} = \\vec{w}\\), alors \\(\\vec{v} = \\vec{w} - \\vec{u}\\) : ' +
          'on <b>retire</b> les coordonnées de \\(\\vec{u}\\).',
        '\\(x = ' + O.tex(w.x) + ' - ' + V.parTex(u.x) + ' = ' + O.tex(v.x) + '\\)',
        '\\(y = ' + O.tex(w.y) + ' - ' + V.parTex(u.y) + ' = ' + O.tex(v.y) + '\\)',
        'Donc \\(' + V.vecTex('v', v.x, v.y) + '\\).'
      ],
      indices: ['C\'est une soustraction, coordonnée par coordonnée.',
                'Vérifie à la fin en additionnant : tu dois retomber sur \\(\\vec{w}\\).'],
      duree: 80
    };
  }

  /* --- La différence ---------------------------------------------------- */
  function qDifference(rnd) {
    var n = V.noms(rnd, 3), A = n[0], B = n[1], C = n[2];
    var bon = C + B;
    var choix = rnd.melange([bon, B + C, A + A, B + A]);
    return {
      enonce: 'Simplifie \\(' + V.vec(A + B) + ' - ' + V.vec(A + C) + '\\).',
      type: 'qcm', choix: choix.map(function (s) { return '\\(' + V.vec(s) + '\\)'; }),
      correct: choix.indexOf(bon),
      etapes: [
        'Soustraire un vecteur, c\'est ajouter son <b>opposé</b> : \\(-' + V.vec(A + C) +
          ' = ' + V.vec(C + A) + '\\).',
        'L\'expression devient \\(' + V.vec(A + B) + ' + ' + V.vec(C + A) + '\\), ' +
          'que l\'on réordonne en \\(' + V.vec(C + A) + ' + ' + V.vec(A + B) + '\\) ' +
          '(l\'addition est commutative).',
        'Chasles s\'applique alors : \\(' + V.vec(C + A) + ' + ' + V.vec(A + B) + ' = ' +
          V.vec(C + B) + '\\).',
        'À retenir : \\(' + V.vec(A + B) + ' - ' + V.vec(A + C) + ' = ' + V.vec(C + B) +
          '\\) — les deux vecteurs partaient du même point, le résultat va du ' +
          '<b>second</b> vers le <b>premier</b>.'
      ],
      indices: ['Commence par transformer la soustraction en addition de l\'opposé.',
                'Retourne \\(' + V.vec(A + C) + '\\) en \\(' + V.vec(C + A) +
                  '\\), puis applique Chasles.'],
      duree: 90
    };
  }

  var QUESTIONS = [
    { des: 1, poids: 4, f: qSommeCoord },
    { des: 1, poids: 4, f: qChaslesSimple },
    { des: 2, poids: 3, f: qChaslesChaine },
    { des: 2, poids: 3, f: qOppose },
    { des: 3, poids: 3, f: qParallelogramme },
    { des: 3, poids: 3, f: qTermeManquant },
    { des: 4, poids: 4, f: qDifference }
  ];

  MathsExos.register({
    id: 'vec-somme', competence: 'vec-somme', level: '2nde',
    titre: 'Somme de deux vecteurs', paliers: 4,

    genere: function (rnd, palier) { return V.tire(rnd, palier, QUESTIONS); }
  });
})();
