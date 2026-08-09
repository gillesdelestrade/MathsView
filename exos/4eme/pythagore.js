/*
 * pythagore — le théorème, dans les deux sens (leçon 4ème « Pythagore »).
 *
 * Les longueurs sont tirées de triplets pythagoriciens, éventuellement
 * agrandis : la réponse tombe alors toujours juste, et l'élève n'a pas à
 * écrire √53 dans un champ de saisie.
 *
 * La réciproque est traitée à part, et c'est important : on n'y calcule pas
 * une longueur, on COMPARE deux nombres pour conclure. Beaucoup d'élèves
 * appliquent le théorème direct à une question de réciproque sans le voir.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var TRIPLETS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17],
                  [9, 12, 15], [7, 24, 25], [20, 21, 29], [12, 16, 20],
                  [10, 24, 26], [15, 20, 25], [18, 24, 30], [12, 35, 37]];

  MathsExos.register({
    id: 'pythagore', competence: 'pythagore', level: '4eme',
    titre: 'Théorème de Pythagore', paliers: 4,

    genere: function (rnd, palier) {
      var t = rnd.choix(TRIPLETS);
      var k = palier >= 3 ? rnd.entier(1, 3) : (palier === 2 ? rnd.entier(1, 2) : 1);
      var a = t[0] * k, b = t[1] * k, c = t[2] * k;

      /* --- palier 4 : la réciproque -------------------------------------- */
      if (palier >= 4 && rnd.booleen(0.5)) {
        var rectangle = rnd.booleen(0.5);
        var c2 = rectangle ? c : c + rnd.choix([1, 2, -1]);
        var g = a * a + b * b, h = c2 * c2;
        return {
          enonce: 'Un triangle \\(ABC\\) a pour côtés \\(AB = ' + a + '\\) cm, \\(AC = ' +
                  b + '\\) cm et \\(BC = ' + c2 + '\\) cm. Est-il rectangle ?',
          type: 'vraifaux', correct: rectangle ? 0 : 1,
          etapes: [
            'Le plus grand côté est \\(BC = ' + c2 + '\\) : c\'est lui qui serait ' +
              'l\'hypoténuse.',
            'On calcule séparément les deux membres :',
            '\\(BC^2 = ' + c2 + '^2 = ' + h + '\\)',
            '\\(AB^2 + AC^2 = ' + a + '^2 + ' + b + '^2 = ' + (a * a) + ' + ' + (b * b) +
              ' = ' + g + '\\)',
            rectangle
              ? 'Les deux résultats sont <b>égaux</b> : d\'après la réciproque du ' +
                'théorème de Pythagore, le triangle <b>est rectangle en A</b>.'
              : 'Les deux résultats sont <b>différents</b> (' + h + ' ≠ ' + g + ') : ' +
                'le triangle n\'est <b>pas</b> rectangle.'
          ],
          indices: ['Repère d\'abord le plus grand côté.',
                    'Calcule les deux membres séparément, puis compare-les.'],
          duree: 90
        };
      }

      /* --- calculer l'hypoténuse ----------------------------------------- */
      if (palier <= 1 || rnd.booleen(0.5)) {
        return {
          enonce: 'Le triangle \\(ABC\\) est rectangle en \\(A\\), avec \\(AB = ' + a +
                  '\\) cm et \\(AC = ' + b + '\\) cm. Calcule \\(BC\\).',
          type: 'nombre', reponse: c, unite: 'cm',
          etapes: [
            'Le triangle est rectangle en \\(A\\), donc d\'après le théorème de ' +
              'Pythagore : \\(BC^2 = AB^2 + AC^2\\).',
            '\\(BC^2 = ' + a + '^2 + ' + b + '^2 = ' + (a * a) + ' + ' + (b * b) +
              ' = ' + (c * c) + '\\)',
            '\\(BC = \\sqrt{' + (c * c) + '} = <b>' + c + '</b>\\) cm'
          ],
          indices: ['Quel côté est l\'hypoténuse ?',
                    'L\'hypoténuse est le côté opposé à l\'angle droit : c\'est \\(BC\\).'],
          duree: 75
        };
      }

      /* --- calculer un côté de l'angle droit ------------------------------ */
      return {
        enonce: 'Le triangle \\(ABC\\) est rectangle en \\(A\\), avec \\(BC = ' + c +
                '\\) cm et \\(AB = ' + a + '\\) cm. Calcule \\(AC\\).',
        type: 'nombre', reponse: b, unite: 'cm',
        etapes: [
          'Le triangle est rectangle en \\(A\\) : \\(BC^2 = AB^2 + AC^2\\).',
          'Ici c\'est \\(AC\\) qu\'on cherche, donc on <b>soustrait</b> : ' +
            '\\(AC^2 = BC^2 - AB^2\\).',
          '\\(AC^2 = ' + c + '^2 - ' + a + '^2 = ' + (c * c) + ' - ' + (a * a) +
            ' = ' + (b * b) + '\\)',
          '\\(AC = \\sqrt{' + (b * b) + '} = <b>' + b + '</b>\\) cm'
        ],
        indices: ['Attention : ici on ne cherche pas l\'hypoténuse.',
                  'L\'hypoténuse \\(BC\\) est donnée : il faut soustraire, pas ajouter.'],
        duree: 85
      };
    }
  });
})();
