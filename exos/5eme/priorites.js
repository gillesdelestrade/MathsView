/*
 * priorites — les priorités opératoires (leçon 5ème « Priorités »).
 *
 * Chaque étape de la correction ne fait qu'UNE opération, et dit laquelle et
 * pourquoi : « les parenthèses d'abord », puis « la multiplication avant
 * l'addition ». Une correction qui saute deux calculs à la fois n'apprend rien.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'priorites', competence: 'priorites', level: '5eme',
    titre: 'Priorités opératoires', paliers: 4,

    genere: function (rnd, palier) {
      var a = rnd.entier(2, 12), b = rnd.entier(2, 12), c = rnd.entier(2, 9);
      var d = rnd.entier(2, 9);

      /* --- palier 1 : une multiplication au milieu d'une addition ------- */
      if (palier === 1) {
        var plus = rnd.booleen(0.5);
        var res1 = plus ? a + b * c : a - b * c;
        return {
          enonce: 'Calcule.',
          tex: a + (plus ? ' + ' : ' - ') + b + ' \\times ' + c,
          type: 'nombre', reponse: res1,
          etapes: [
            'La <b>multiplication</b> est prioritaire sur l\'addition et la soustraction.',
            'On calcule d\'abord \\(' + b + ' \\times ' + c + ' = ' + (b * c) + '\\).',
            '\\(' + a + (plus ? ' + ' : ' - ') + (b * c) + ' = <b>' + res1 + '</b>\\)'
          ],
          indices: ['Quelle opération est prioritaire ici ?',
                    'On ne calcule pas de gauche à droite : la multiplication passe avant.'],
          duree: 40
        };
      }

      /* --- palier 2 : des parenthèses ------------------------------------ */
      if (palier === 2) {
        var res2 = (a + b) * c;
        return {
          enonce: 'Calcule.',
          tex: '(' + a + ' + ' + b + ') \\times ' + c,
          type: 'nombre', reponse: res2,
          etapes: [
            'Les <b>parenthèses</b> passent avant tout le reste.',
            '\\(' + a + ' + ' + b + ' = ' + (a + b) + '\\)',
            '\\(' + (a + b) + ' \\times ' + c + ' = <b>' + res2 + '</b>\\)'
          ],
          indices: ['Commence toujours par l\'intérieur des parenthèses.'],
          duree: 40
        };
      }

      /* --- paliers 3 et 4 : tout ensemble -------------------------------- */
      var e = rnd.entier(2, 9);
      var forme = palier === 3 ? 0 : rnd.entier(0, 1);
      if (forme === 0) {
        var res3 = a + b * c - d;
        return {
          enonce: 'Calcule.',
          tex: a + ' + ' + b + ' \\times ' + c + ' - ' + d,
          type: 'nombre', reponse: res3,
          etapes: [
            'On repère d\'abord la multiplication : elle est prioritaire.',
            '\\(' + b + ' \\times ' + c + ' = ' + (b * c) + '\\)',
            'Il ne reste que des additions et des soustractions : on calcule alors ' +
              '<b>de gauche à droite</b>.',
            '\\(' + a + ' + ' + (b * c) + ' = ' + (a + b * c) + '\\), puis \\(' +
              (a + b * c) + ' - ' + d + ' = <b>' + res3 + '</b>\\)'
          ],
          indices: ['Multiplication d\'abord, puis de gauche à droite.'],
          duree: 55
        };
      }
      var res4 = (a + b) * c - d * e;
      return {
        enonce: 'Calcule.',
        tex: '(' + a + ' + ' + b + ') \\times ' + c + ' - ' + d + ' \\times ' + e,
        type: 'nombre', reponse: res4,
        etapes: [
          'Les parenthèses d\'abord : \\(' + a + ' + ' + b + ' = ' + (a + b) + '\\).',
          'Puis les deux multiplications : \\(' + (a + b) + ' \\times ' + c + ' = ' +
            ((a + b) * c) + '\\) et \\(' + d + ' \\times ' + e + ' = ' + (d * e) + '\\).',
          'La soustraction en dernier : \\(' + ((a + b) * c) + ' - ' + (d * e) +
            ' = <b>' + res4 + '</b>\\)'
        ],
        indices: ['Parenthèses, puis multiplications, puis additions et soustractions.',
                  'Écris chaque étape sur une ligne : c\'est ce qui évite les erreurs.'],
        duree: 70
      };
    }
  });
})();
