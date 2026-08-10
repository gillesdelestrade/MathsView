/*
 * Les outils communs aux six générateurs du chapitre « Vecteurs » (2nde),
 * sur le modèle de exos/fonctions/outils.js.
 *
 * Six générateurs pour six leçons, et une seule façon d'écrire un vecteur :
 * sans ce fichier, chacun réinventerait sa notation et l'élève verrait
 * \(\vec{AB}\,(3\,;\,-2)\) ici et « AB = (3, -2) » là.
 *
 * Deux décisions valent d'être expliquées.
 *
 * 1. Les réponses en COORDONNÉES sont de type « texte », avec les écritures
 *    acceptées listées par formesCoord(). Le validateur retire déjà les
 *    espaces et ramène tous les tirets à « - » : il ne reste qu'à accepter la
 *    forme avec et sans parenthèses. La consigne affiche le format attendu,
 *    pour qu'aucune bonne réponse ne soit refusée sur un détail d'écriture.
 *
 * 2. Les réponses qui sont un VECTEUR NOMMÉ (Chasles : \(\vec{AB}+\vec{BC}\))
 *    sont des QCM, jamais du texte libre. « AC », « vec(AC) », « \vec{AC} »,
 *    « [AC] » : il y a trop de façons d'écrire la même chose, et refuser une
 *    bonne réponse pour une flèche mal notée n'apprend rien à personne.
 *
 * À charger APRÈS exos/outils.js, dont il se sert.
 */
(function (global) {
  'use strict';
  var O = ExosOutils;

  var LETTRES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'N', 'P', 'R', 'S', 'T'];

  /* --- Écriture --------------------------------------------------------- */
  function vec(nom) { return '\\vec{' + nom + '}'; }
  function coordTex(x, y) { return '(' + O.tex(x) + '\\,;\\,' + O.tex(y) + ')'; }
  function vecTex(nom, x, y) { return vec(nom) + '\\,' + coordTex(x, y); }
  function ptTex(nom, x, y) { return nom + '\\,' + coordTex(x, y); }
  // Hors formule (dans une phrase de correction), on écrit à la française.
  function coordTxt(x, y) { return '(' + O.fr(x) + ' ; ' + O.fr(y) + ')'; }
  /* « (-3) » pour enchaîner une soustraction sur un négatif. O.par() ferait le
     même travail, mais avec le « − » typographique : parfait en prose, il n'a
     rien à faire dans une formule, où seul le « - » ASCII est du LaTeX. */
  function parTex(v) { return v < 0 ? '(' + O.tex(v) + ')' : O.tex(v); }

  function formesCoord(x, y) {
    return ['(' + x + ';' + y + ')', x + ';' + y];
  }
  var CONSIGNE = 'Écris ta réponse sous la forme <strong>(x ; y)</strong>.';

  /* --- Tirages ---------------------------------------------------------- */
  function point(rnd, max) {
    var m = max || 6;
    return { x: rnd.entier(-m, m), y: rnd.entier(-m, m) };
  }
  // Deux points distincts : un vecteur nul n'a ni direction ni sens, et la
  // moitié des questions du chapitre n'auraient alors plus de réponse.
  function deuxPoints(rnd, max) {
    var A = point(rnd, max), B, garde = 0;
    do { B = point(rnd, max); garde++; } while (B.x === A.x && B.y === A.y && garde < 20);
    if (B.x === A.x && B.y === A.y) B = { x: A.x + 1, y: A.y + 2 };
    return [A, B];
  }
  // Un vecteur non nul donné par ses coordonnées.
  function vecteur(rnd, max) {
    var m = max || 6, x, y, garde = 0;
    do { x = rnd.entier(-m, m); y = rnd.entier(-m, m); garde++; }
    while (x === 0 && y === 0 && garde < 20);
    if (x === 0 && y === 0) x = 1;
    return { x: x, y: y };
  }
  // Deux vecteurs NON colinéaires, quand la question a besoin qu'ils le soient.
  function deuxVecteursLibres(rnd, max) {
    var u = vecteur(rnd, max), v, garde = 0;
    do { v = vecteur(rnd, max); garde++; } while (det(u, v) === 0 && garde < 30);
    if (det(u, v) === 0) v = { x: -u.y, y: u.x };       // perpendiculaire : jamais colinéaire
    return [u, v];
  }
  // n lettres distinctes, pour nommer des points sans jamais répéter.
  function noms(rnd, n) { return rnd.melange(LETTRES).slice(0, n); }

  /* Des coordonnées dont la norme est entière. Sans cela, « calcule la
     longueur » donnerait une racine que l'élève ne peut pas saisir dans un
     champ, et la question deviendrait un exercice d'arrondi. */
  var TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15],
                  [8, 15, 17], [12, 16, 20], [7, 24, 25], [20, 21, 29]];
  function vecteurEntier(rnd) {
    var t = rnd.choix(TRIPLETS);
    var a = t[0] * rnd.signe(), b = t[1] * rnd.signe();
    return rnd.booleen() ? { x: a, y: b, n: t[2] } : { x: b, y: a, n: t[2] };
  }

  /* --- Calculs ---------------------------------------------------------- */
  function delta(A, B) { return { x: B.x - A.x, y: B.y - A.y }; }   // vecteur AB
  function det(u, v) { return u.x * v.y - u.y * v.x; }
  function colineaires(u, v) { return det(u, v) === 0; }

  /* --- Vivier ----------------------------------------------------------- */
  /* Toutes les questions d'un palier n'ont pas à sortir aussi souvent : les
     questions de sens sont précieuses mais ne doivent pas manger la place du
     calcul. Chaque générateur décrit son vivier sous la forme
     { des: <palier d'apparition>, poids: <fréquence>, f: <constructeur> }. */
  function pondere(rnd, liste) {
    var total = 0, i;
    for (i = 0; i < liste.length; i++) total += liste[i].poids;
    var seuil = rnd.entier(1, total);
    for (i = 0; i < liste.length; i++) { seuil -= liste[i].poids; if (seuil <= 0) return liste[i]; }
    return liste[liste.length - 1];
  }
  // Le tirage complet : on filtre le vivier par palier, puis on pondère.
  function tire(rnd, palier, vivier) {
    return pondere(rnd, vivier.filter(function (q) { return q.des <= palier; })).f(rnd, palier);
  }

  global.VecOutils = {
    vec: vec, coordTex: coordTex, vecTex: vecTex, ptTex: ptTex, coordTxt: coordTxt, parTex: parTex,
    formesCoord: formesCoord, CONSIGNE: CONSIGNE,
    point: point, deuxPoints: deuxPoints, vecteur: vecteur,
    deuxVecteursLibres: deuxVecteursLibres, noms: noms, vecteurEntier: vecteurEntier,
    delta: delta, det: det, colineaires: colineaires, LETTRES: LETTRES,
    pondere: pondere, tire: tire
  };

})(window);
