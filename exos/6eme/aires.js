/*
 * aires — périmètres et aires des figures usuelles (leçon 6ème « Aires »).
 *
 * Le piège du chapitre n'est pas la formule : c'est de confondre périmètre et
 * aire, et d'oublier l'unité. Les deux sont donc demandés en alternance, et
 * l'unité est toujours affichée à côté du champ.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'aires', competence: 'aires', level: '6eme',
    titre: 'Périmètres et aires', paliers: 4,

    genere: function (rnd, palier) {
      var FIGS = ['carre', 'rectangle'];
      if (palier >= 2) FIGS.push('triangle');
      if (palier >= 3) FIGS.push('disque');
      var f = rnd.choix(FIGS);
      var aire = rnd.booleen(palier === 1 ? 0.5 : 0.6);

      if (f === 'carre') {
        var c = rnd.entier(3, 20);
        return finir(aire, 'un carré de côté \\(' + c + '\\) cm',
          aire ? c * c : 4 * c, aire ? 'cm²' : 'cm',
          aire ? ['L\'aire d\'un carré vaut <b>côté × côté</b>.',
                  '\\(' + c + ' \\times ' + c + ' = \\mathbf{' + (c * c) + '}\\) cm²']
               : ['Le périmètre d\'un carré vaut <b>4 × côté</b> : c\'est le tour de la figure.',
                  '\\(4 \\times ' + c + ' = \\mathbf{' + (4 * c) + '}\\) cm']);
      }
      if (f === 'rectangle') {
        var L = rnd.entier(4, 20), l = rnd.entier(2, L - 1);
        return finir(aire, 'un rectangle de longueur \\(' + L + '\\) cm et de largeur \\(' +
          l + '\\) cm', aire ? L * l : 2 * (L + l), aire ? 'cm²' : 'cm',
          aire ? ['L\'aire d\'un rectangle vaut <b>longueur × largeur</b>.',
                  '\\(' + L + ' \\times ' + l + ' = \\mathbf{' + (L * l) + '}\\) cm²']
               : ['Le périmètre fait le tour : deux longueurs et deux largeurs.',
                  '\\(2 \\times (' + L + ' + ' + l + ') = 2 \\times ' + (L + l) +
                  ' = \\mathbf{' + (2 * (L + l)) + '}\\) cm']);
      }
      if (f === 'triangle') {
        var b = rnd.entier(2, 12) * 2;             // base paire : l'aire tombe juste
        var h = rnd.entier(3, 15);
        return {
          enonce: 'Calcule l\'<strong>aire</strong> d\'un triangle de base \\(' + b +
                  '\\) cm et de hauteur \\(' + h + '\\) cm.',
          type: 'nombre', reponse: b * h / 2, unite: 'cm²',
          etapes: [
            'L\'aire d\'un triangle vaut <b>(base × hauteur) ÷ 2</b> : c\'est la moitié ' +
              'du rectangle qui l\'entoure.',
            '\\(' + b + ' \\times ' + h + ' = ' + (b * h) + '\\)',
            '\\(' + (b * h) + ' \\div 2 = \\mathbf{' + (b * h / 2) + '}\\) cm²'
          ],
          indices: ['Un triangle, c\'est la moitié d\'un rectangle.',
                    'N\'oublie pas de diviser par 2.'],
          duree: 55
        };
      }
      // disque : on demande une valeur arrondie, sinon la réponse n'est pas
      // écrivable dans un champ de saisie.
      var r = rnd.entier(2, 12);
      var val = aire ? Math.PI * r * r : 2 * Math.PI * r;
      return {
        enonce: 'Calcule ' + (aire ? 'l\'<strong>aire</strong>' :
                'le <strong>périmètre</strong>') + ' d\'un disque de rayon \\(' + r +
                '\\) cm. Donne l\'arrondi au <strong>dixième</strong> (π ≈ 3,14159).',
        type: 'nombre', reponse: Math.round(val * 10) / 10, unite: aire ? 'cm²' : 'cm',
        etapes: aire
          ? ['L\'aire d\'un disque vaut <b>π × rayon × rayon</b>.',
             '\\(\\pi \\times ' + r + ' \\times ' + r + ' = \\pi \\times ' + (r * r) +
               ' \\approx ' + O.tex(val, 3) + '\\)',
             'Arrondi au dixième : <b>' + O.fr(Math.round(val * 10) / 10) + '</b> cm²']
          : ['Le périmètre d\'un disque (sa circonférence) vaut <b>2 × π × rayon</b>.',
             '\\(2 \\times \\pi \\times ' + r + ' \\approx ' + O.tex(val, 3) + '\\)',
             'Arrondi au dixième : <b>' + O.fr(Math.round(val * 10) / 10) + '</b> cm'],
        indices: ['Aire : π × r × r. Périmètre : 2 × π × r.',
                  'Prends π ≈ 3,14159, puis arrondis à la fin seulement.'],
        duree: 70
      };

      function finir(estAire, quoi, rep, unite, etapes) {
        return {
          enonce: 'Calcule ' + (estAire ? 'l\'<strong>aire</strong>' :
                  'le <strong>périmètre</strong>') + ' de ' + quoi + '.',
          type: 'nombre', reponse: rep, unite: unite, etapes: etapes,
          indices: [estAire ? 'L\'aire, c\'est la surface : elle se mesure en cm².'
                            : 'Le périmètre, c\'est le tour : il se mesure en cm.',
                    'Ne confonds pas les deux formules.'],
          duree: 50
        };
      }
    }
  });
})();
