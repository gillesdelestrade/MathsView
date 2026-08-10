/*
 * volumes — volumes des solides usuels (leçon 5ème « Perspective cavalière »).
 *
 * Une seule idée, déclinée quatre fois :
 *
 *              V = aire d'une base × hauteur
 *
 * pavé droit, cube, prisme droit, cylindre. Les questions vont dans les deux
 * sens, et c'est le second qui fait la différence en classe :
 *
 *     DIRECT     on donne les dimensions, on demande le volume ;
 *     INVERSE    on donne le volume et le reste, on demande la dimension
 *                qui manque — donc une division, pas une multiplication.
 *
 * Les nombres sont choisis pour tomber juste (la hauteur cherchée est un
 * entier, l'arête d'un cube est la racine cubique d'un cube parfait). Seul le
 * cylindre garde son π : on demande alors l'arrondi au dixième, comme le font
 * déjà les générateurs d'aires et de périmètres.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var CUBES = [8, 27, 64, 125, 216, 343, 512, 729, 1000];   // les cubes parfaits
  function arrondi(v) { return Math.round(v * 10) / 10; }

  // Deux dimensions dont le produit est « rond » : de quoi retrouver la
  // troisième par une division qui tombe juste.
  function paire(rnd, max) {
    var a = rnd.entier(2, max || 9);
    var b = rnd.entier(2, max || 9);
    return [a, b];
  }

  /* ===================================================================== */
  /* Les volumes, dans le sens direct                                      */
  /* ===================================================================== */
  function qPave(rnd, palier) {
    var L = rnd.entier(3, palier >= 3 ? 15 : 9);
    var l = rnd.entier(2, palier >= 3 ? 12 : 8);
    var h = rnd.entier(2, palier >= 3 ? 10 : 7);
    // Au palier 4, une dimension décimale : le calcul reste simple, mais il
    // faut savoir multiplier des décimaux.
    if (palier >= 4 && rnd.booleen(0.5)) h = h + 0.5;
    var V = L * l * h;
    return {
      enonce: 'Un <b>pavé droit</b> a pour longueur ' + O.fr(L) + ' cm, pour largeur ' +
              O.fr(l) + ' cm et pour hauteur ' + O.fr(h) + ' cm.<br>Quel est son ' +
              '<b>volume</b> ?',
      type: 'nombre', reponse: V, unite: 'cm³',
      etapes: [
        'Pour un pavé droit : <b>V = aire de la base × hauteur</b>.',
        'L\'aire de la base est \\(' + O.tex(L) + ' \\times ' + O.tex(l) + ' = ' +
          O.tex(L * l) + '\\) cm².',
        'Donc \\(V = ' + O.tex(L * l) + ' \\times ' + O.tex(h) + ' = ' + O.tex(V) +
          '\\) cm³ — c\'est aussi \\(' + O.tex(L) + ' \\times ' + O.tex(l) +
          ' \\times ' + O.tex(h) + '\\).'
      ],
      indices: ['V = longueur × largeur × hauteur.',
                'Le résultat s\'exprime en <b>cm³</b> : on multiplie trois longueurs.'],
      duree: 50
    };
  }

  function qCube(rnd, palier) {
    var a = rnd.entier(2, palier >= 3 ? 12 : 6);
    var V = a * a * a;
    return {
      enonce: 'Un <b>cube</b> a une arête de ' + O.fr(a) + ' cm.<br>Quel est son ' +
              '<b>volume</b> ?',
      type: 'nombre', reponse: V, unite: 'cm³',
      etapes: [
        'Les 12 arêtes d\'un cube ont la même longueur : sa base est un carré de ' +
          'côté ' + O.fr(a) + ' cm.',
        'Aire de la base : \\(' + O.tex(a) + ' \\times ' + O.tex(a) + ' = ' +
          O.tex(a * a) + '\\) cm².',
        '\\(V = ' + O.tex(a * a) + ' \\times ' + O.tex(a) + ' = ' + O.tex(a) +
          '^3 = ' + O.tex(V) + '\\) cm³'
      ],
      indices: ['V = a × a × a, c\'est-à-dire a³.',
                'Multiplie l\'arête par elle-même, deux fois.'],
      duree: 40
    };
  }

  function qPrisme(rnd, palier) {
    var triangle = palier >= 3 ? rnd.booleen(0.6) : true;
    var h = rnd.entier(3, 12);                     // la hauteur du prisme
    if (triangle) {
      var b = rnd.entier(2, 12), ht = rnd.entier(2, 11);
      if ((b * ht) % 2) b += 1;                    // pour que l'aire tombe juste
      var B = b * ht / 2, V = B * h;
      return {
        enonce: 'Un <b>prisme droit</b> a pour base un <b>triangle</b> de base ' +
                O.fr(b) + ' cm et de hauteur ' + O.fr(ht) + ' cm.<br>Sa hauteur ' +
                'est de ' + O.fr(h) + ' cm. Quel est son <b>volume</b> ?',
        type: 'nombre', reponse: V, unite: 'cm³',
        etapes: [
          'D\'abord l\'<b>aire de la base</b>. Pour un triangle : ' +
            '\\(\\dfrac{\\text{base} \\times \\text{hauteur}}{2}\\).',
          '\\(\\mathcal{B} = \\dfrac{' + O.tex(b) + ' \\times ' + O.tex(ht) + '}{2} = ' +
            O.tex(B) + '\\) cm².',
          'Ensuite \\(V = \\mathcal{B} \\times h = ' + O.tex(B) + ' \\times ' +
            O.tex(h) + ' = ' + O.tex(V) + '\\) cm³.'
        ],
        indices: [
          'Ne confonds pas les deux hauteurs : celle du <b>triangle</b> sert à ' +
            'calculer l\'aire de la base, celle du <b>prisme</b> multiplie ensuite.',
          'V = aire de la base × hauteur du prisme.'
        ],
        duree: 70
      };
    }
    var B2 = rnd.entier(6, 40), V2 = B2 * h;
    return {
      enonce: 'Un <b>prisme droit</b> a une base d\'aire ' + O.fr(B2) +
              ' cm² et une hauteur de ' + O.fr(h) + ' cm.<br>Quel est son ' +
              '<b>volume</b> ?',
      type: 'nombre', reponse: V2, unite: 'cm³',
      etapes: [
        'La forme de la base n\'a aucune importance : seule son <b>aire</b> compte.',
        '\\(V = \\mathcal{B} \\times h = ' + O.tex(B2) + ' \\times ' + O.tex(h) +
          ' = ' + O.tex(V2) + '\\) cm³'
      ],
      indices: ['V = aire de la base × hauteur.'],
      duree: 40
    };
  }

  function qCylindre(rnd, palier) {
    var parDiametre = palier >= 3 && rnd.booleen(0.4);
    var r = rnd.entier(2, 9), h = rnd.entier(3, 12);
    var V = Math.PI * r * r * h;
    return {
      enonce: 'Un <b>cylindre de révolution</b> a une base de ' +
              (parDiametre ? '<b>diamètre</b> ' + O.fr(2 * r) : '<b>rayon</b> ' + O.fr(r)) +
              ' cm et une hauteur de ' + O.fr(h) + ' cm.<br>Quel est son ' +
              '<b>volume</b> ? Donne l\'arrondi au <b>dixième</b> (π ≈ 3,14159).',
      type: 'nombre', reponse: arrondi(V), unite: 'cm³',
      etapes: [
        (parDiametre
          ? 'Le rayon est la moitié du diamètre : \\(' + O.tex(2 * r) + ' \\div 2 = ' +
            O.tex(r) + '\\) cm.'
          : 'La base est un disque de rayon ' + O.fr(r) + ' cm.'),
        'Aire de la base : \\(\\mathcal{B} = \\pi \\times ' + O.tex(r) + '^2 = ' +
          O.tex(r * r) + '\\pi \\approx ' + O.tex(arrondi(Math.PI * r * r)) + '\\) cm².',
        '\\(V = \\mathcal{B} \\times h = ' + O.tex(r * r) + '\\pi \\times ' + O.tex(h) +
          ' = ' + O.tex(r * r * h) + '\\pi \\approx ' + O.tex(arrondi(V)) + '\\) cm³',
        'On n\'arrondit qu\'à la <b>toute fin</b> : arrondir en cours de route ' +
          'fausserait le résultat.'
      ],
      indices: [
        'L\'aire d\'un disque vaut \\(\\pi r^2\\) : commence par elle.' +
          (parDiametre ? ' Attention, on te donne le <b>diamètre</b>.' : ''),
        'Puis V = aire de la base × hauteur.'
      ],
      duree: 75
    };
  }

  /* ===================================================================== */
  /* Le sens inverse : une longueur, connaissant le volume                 */
  /* ===================================================================== */
  function qPaveInverse(rnd, palier) {
    var d = paire(rnd, palier >= 3 ? 12 : 8);
    var L = d[0], l = d[1], h = rnd.entier(2, palier >= 3 ? 15 : 9);
    var V = L * l * h;
    // On cache l'une des trois dimensions — la hauteur le plus souvent, mais
    // pas toujours : la formule doit se lire dans tous les sens.
    var quoi = rnd.choix(['hauteur', 'hauteur', 'largeur', 'longueur']);
    var connu = quoi === 'hauteur' ? [L, l] : quoi === 'largeur' ? [L, h] : [l, h];
    var nomsConnus = quoi === 'hauteur' ? ['longueur', 'largeur']
                   : quoi === 'largeur' ? ['longueur', 'hauteur'] : ['largeur', 'hauteur'];
    var cherche = quoi === 'hauteur' ? h : quoi === 'largeur' ? l : L;
    var prod = connu[0] * connu[1];
    return {
      enonce: 'Un <b>pavé droit</b> a un volume de ' + O.fr(V) + ' cm³. Sa ' +
              nomsConnus[0] + ' mesure ' + O.fr(connu[0]) + ' cm et sa ' +
              nomsConnus[1] + ' ' + O.fr(connu[1]) + ' cm.<br>Quelle est sa <b>' +
              quoi + '</b> ?',
      type: 'nombre', reponse: cherche, unite: 'cm',
      etapes: [
        'On sait que \\(V = \\text{longueur} \\times \\text{largeur} \\times ' +
          '\\text{hauteur}\\) : ici \\(' + O.tex(V) + ' = ' + O.tex(connu[0]) +
          ' \\times ' + O.tex(connu[1]) + ' \\times \\text{' + quoi + '}\\).',
        'Les deux dimensions connues donnent \\(' + O.tex(connu[0]) + ' \\times ' +
          O.tex(connu[1]) + ' = ' + O.tex(prod) + '\\).',
        'La dimension cherchée s\'obtient donc par une <b>division</b> : \\(' +
          O.tex(V) + ' \\div ' + O.tex(prod) + ' = ' + O.tex(cherche) + '\\) cm.'
      ],
      indices: [
        'Multiplie d\'abord les deux dimensions que tu connais.',
        'Puis divise le volume par ce produit — la multiplication se défait par ' +
          'une division.'
      ],
      duree: 70
    };
  }

  function qCubeInverse(rnd) {
    var V = rnd.choix(CUBES);
    var a = Math.round(Math.cbrt(V));
    return {
      enonce: 'Un <b>cube</b> a un volume de ' + O.fr(V) + ' cm³.<br>Quelle est la ' +
              'longueur de son <b>arête</b> ?',
      type: 'nombre', reponse: a, unite: 'cm',
      etapes: [
        'Pour un cube d\'arête \\(a\\) : \\(V = a \\times a \\times a\\).',
        'On cherche donc le nombre qui, multiplié <b>trois fois</b> par lui-même, ' +
          'donne ' + O.fr(V) + '.',
        '\\(' + O.tex(a) + ' \\times ' + O.tex(a) + ' \\times ' + O.tex(a) + ' = ' +
          O.tex(V) + '\\) : l\'arête mesure <b>' + O.fr(a) + ' cm</b>.'
      ],
      indices: [
        'Procède par essais : 2 × 2 × 2 = 8, 3 × 3 × 3 = 27, 4 × 4 × 4 = 64…',
        'La réponse est en <b>cm</b>, pas en cm³ : c\'est une longueur.'
      ],
      duree: 60
    };
  }

  function qBaseInverse(rnd, palier) {
    var B = rnd.entier(5, 40), h = rnd.entier(2, 14), V = B * h;
    var cherche = rnd.booleen(0.5) ? 'hauteur' : 'aire';
    var cylindre = palier >= 4 && rnd.booleen(0.4);
    var quoiSolide = cylindre ? 'cylindre de révolution' : 'prisme droit';
    if (cherche === 'hauteur') {
      return {
        enonce: 'Un <b>' + quoiSolide + '</b> a un volume de ' + O.fr(V) +
                ' cm³ et une base d\'aire ' + O.fr(B) + ' cm².<br>Quelle est sa ' +
                '<b>hauteur</b> ?',
        type: 'nombre', reponse: h, unite: 'cm',
        etapes: [
          '\\(V = \\mathcal{B} \\times h\\), donc \\(' + O.tex(V) + ' = ' + O.tex(B) +
            ' \\times h\\).',
          'On <b>divise</b> le volume par l\'aire de la base : \\(' + O.tex(V) +
            ' \\div ' + O.tex(B) + ' = ' + O.tex(h) + '\\) cm.'
        ],
        indices: ['La hauteur s\'obtient en divisant le volume par l\'aire de la base.',
                  'Une longueur s\'exprime en cm.'],
        duree: 55
      };
    }
    return {
      enonce: 'Un <b>' + quoiSolide + '</b> a un volume de ' + O.fr(V) +
              ' cm³ et une hauteur de ' + O.fr(h) + ' cm.<br>Quelle est l\'<b>aire ' +
              'de sa base</b> ?',
      type: 'nombre', reponse: B, unite: 'cm²',
      etapes: [
        '\\(V = \\mathcal{B} \\times h\\), donc \\(' + O.tex(V) + ' = \\mathcal{B} ' +
          '\\times ' + O.tex(h) + '\\).',
        'On <b>divise</b> le volume par la hauteur : \\(' + O.tex(V) + ' \\div ' +
          O.tex(h) + ' = ' + O.tex(B) + '\\) cm².'
      ],
      indices: ['L\'aire de la base s\'obtient en divisant le volume par la hauteur.',
                'Une aire s\'exprime en cm².'],
      duree: 55
    };
  }

  function qCylindreInverse(rnd) {
    // Avec un volume donné « en π », la division tombe juste et la formule
    // reste lisible : c'est la façon la plus honnête de faire le calcul à
    // l'envers sans traîner un arrondi.
    var r = rnd.entier(2, 8), h = rnd.entier(3, 12);
    var V = r * r * h;                              // le volume vaut V × π
    return {
      enonce: 'Un <b>cylindre de révolution</b> a un volume de ' + O.fr(V) +
              'π cm³ (c\'est-à-dire ' + O.fr(V) + ' × π) et un rayon de ' + O.fr(r) +
              ' cm.<br>Quelle est sa <b>hauteur</b> ?',
      type: 'nombre', reponse: h, unite: 'cm',
      etapes: [
        'L\'aire de la base vaut \\(\\pi \\times ' + O.tex(r) + '^2 = ' + O.tex(r * r) +
          '\\pi\\) cm².',
        '\\(V = \\mathcal{B} \\times h\\) donne \\(' + O.tex(V) + '\\pi = ' +
          O.tex(r * r) + '\\pi \\times h\\).',
        'On divise par \\(' + O.tex(r * r) + '\\pi\\) : \\(h = ' + O.tex(V) +
          ' \\div ' + O.tex(r * r) + ' = ' + O.tex(h) + '\\) cm. Le π se simplifie !'
      ],
      indices: [
        'Commence par l\'aire de la base : \\(\\pi r^2\\).',
        'Le π est présent des deux côtés : il se simplifie, il reste une division.'
      ],
      duree: 80
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'volumes', competence: 'volumes', level: '5eme',
    titre: 'Volumes des solides usuels', paliers: 4,

    genere: function (rnd, palier) {
      var forme = rnd.choix(
        // On installe d'abord les deux solides les plus simples, puis on ouvre
        // aux quatre, et le calcul « à l'envers » prend enfin la moitié de la
        // place : c'est lui qui distingue une formule apprise d'une formule
        // comprise.
        palier === 1 ? ['pave', 'pave', 'cube', 'cube', 'prisme'] :
        palier === 2 ? ['pave', 'cube', 'prisme', 'cylindre', 'paveInv'] :
        palier === 3 ? ['pave', 'prisme', 'cylindre', 'paveInv', 'cubeInv', 'baseInv'] :
                       ['cylindre', 'prisme', 'paveInv', 'cubeInv', 'baseInv',
                        'cylindreInv', 'cylindreInv']);

      if (forme === 'cube') return qCube(rnd, palier);
      if (forme === 'prisme') return qPrisme(rnd, palier);
      if (forme === 'cylindre') return qCylindre(rnd, palier);
      if (forme === 'paveInv') return qPaveInverse(rnd, palier);
      if (forme === 'cubeInv') return qCubeInverse(rnd);
      if (forme === 'baseInv') return qBaseInverse(rnd, palier);
      if (forme === 'cylindreInv') return qCylindreInverse(rnd);
      return qPave(rnd, palier);
    }
  });

})();
