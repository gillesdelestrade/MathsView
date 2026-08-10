/*
 * thales — le théorème de Thalès (leçon 3ème du même nom).
 *
 * Les longueurs sont construites à partir d'un rapport d'agrandissement entier
 * ou demi-entier : la réponse tombe juste. La correction écrit toujours la
 * triple égalité AVANT de passer au produit en croix — c'est cette écriture
 * qui structure la rédaction attendue au brevet.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'thales', competence: 'thales', level: '3eme',
    titre: 'Théorème de Thalès', paliers: 3,

    genere: function (rnd, palier) {
      // Le petit triangle ADE, le grand ABC, avec (DE) // (BC).
      var k = palier === 1 ? rnd.entier(2, 4) : rnd.entier(3, 8) / 2;   // rapport
      var AD = rnd.entier(2, 9);
      var AE = rnd.entier(2, 9);
      var DE = rnd.entier(2, 9);
      var AB = AD * k, AC = AE * k, BC = DE * k;
      var papillon = palier >= 3 && rnd.booleen(0.4);

      // Ce que l'on cherche : BC (le plus fréquent), ou AB.
      var cherche = rnd.booleen(0.6) ? 'BC' : 'AB';
      var rep = cherche === 'BC' ? BC : AB;

      var config = papillon
        ? 'Les droites \\((BC)\\) et \\((DE)\\) sont parallèles, et les points ' +
          '\\(A\\), \\(D\\), \\(B\\) d\'une part, \\(A\\), \\(E\\), \\(C\\) d\'autre ' +
          'part sont alignés — \\(A\\) étant <em>entre</em> les deux parallèles ' +
          '(configuration « papillon »).'
        : 'Les points \\(A\\), \\(D\\), \\(B\\) sont alignés, ainsi que \\(A\\), ' +
          '\\(E\\), \\(C\\), et \\((DE)\\) est parallèle à \\((BC)\\).';

      var donnees = cherche === 'BC'
        ? '\\(AD = ' + O.tex(AD) + '\\) cm, \\(AB = ' + O.tex(AB) + '\\) cm et \\(DE = ' +
          O.tex(DE) + '\\) cm'
        : '\\(AD = ' + O.tex(AD) + '\\) cm, \\(DE = ' + O.tex(DE) + '\\) cm et \\(BC = ' +
          O.tex(BC) + '\\) cm';

      return {
        enonce: config + ' On donne ' + donnees + '. Calcule \\(' + cherche + '\\).',
        type: 'nombre', reponse: rep, unite: 'cm',
        etapes: [
          'Les droites \\((DE)\\) et \\((BC)\\) sont parallèles : d\'après le théorème ' +
            'de Thalès, les longueurs sont proportionnelles.',
          '\\(\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}\\)',
          'On garde les deux rapports où l\'on connaît trois longueurs sur quatre : ' +
            '\\(\\dfrac{' + O.tex(AD) + '}{' + O.tex(AB) + '} = \\dfrac{' + O.tex(DE) +
            '}{' + O.tex(BC) + '}\\)',
          cherche === 'BC'
            ? 'Produit en croix : \\(' + cherche + ' = \\dfrac{' + O.tex(AB) +
              ' \\times ' + O.tex(DE) + '}{' + O.tex(AD) + '} = \\mathbf{' + O.tex(rep) +
              '}\\) cm'
            : 'Produit en croix : \\(' + cherche + ' = \\dfrac{' + O.tex(AD) +
              ' \\times ' + O.tex(BC) + '}{' + O.tex(DE) + '} = \\mathbf{' + O.tex(rep) +
              '}\\) cm',
          'Le rapport d\'agrandissement vaut ' + O.fr(k) + ' : chaque longueur du ' +
            'grand triangle est ' + O.fr(k) + ' fois celle du petit.'
        ],
        indices: ['Écris d\'abord la triple égalité des rapports.',
                  'Choisis les deux rapports où tu connais trois longueurs sur quatre.'],
        duree: 110
      };
    }
  });
})();
