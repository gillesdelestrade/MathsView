/*
 * distributivite — développer et factoriser k(a + b) (leçon 5ème du même nom).
 *
 * Les deux sens sont travaillés, parce que c'est le même geste lu à l'endroit
 * et à l'envers — et que la factorisation, elle, ne s'apprend qu'en cherchant
 * le facteur commun.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'distributivite', competence: 'distributivite', level: '5eme',
    titre: 'Distributivité', paliers: 4,

    genere: function (rnd, palier) {
      var k = rnd.entier(2, palier <= 2 ? 9 : 12);
      var a = rnd.entier(2, 12);
      var b = rnd.entier(2, 12);
      var plus = palier <= 2 ? true : rnd.booleen(0.6);
      var signeTxt = plus ? ' + ' : ' - ';

      /* --- développer, en numérique puis en littéral --------------------- */
      if (palier <= 2 || rnd.booleen(0.5)) {
        var litteral = palier >= 2;
        if (!litteral) {
          var res = k * (a + b);
          return {
            enonce: 'Développe puis calcule.',
            tex: k + ' \\times (' + a + ' + ' + b + ')',
            type: 'nombre', reponse: res,
            etapes: [
              'On distribue le ' + k + ' à <b>chacun</b> des deux termes.',
              '\\(' + k + ' \\times ' + a + ' + ' + k + ' \\times ' + b + ' = ' +
                (k * a) + ' + ' + (k * b) + '\\)',
              '\\(' + (k * a) + ' + ' + (k * b) + ' = \\mathbf{' + res + '}\\) ' +
                '(on retrouve bien ' + k + ' × ' + (a + b) + ')'
            ],
            indices: ['Le facteur du dehors multiplie les DEUX termes du dedans.'],
            duree: 45
          };
        }
        var attendu = O.fr(k * a) + 'x' + (plus ? ' + ' : ' − ') + O.fr(k * b);
        return {
          enonce: 'Développe et réduis.',
          tex: k + '(' + a + 'x' + signeTxt + b + ')',
          type: 'texte',
          reponse: [attendu, attendu.replace(/ /g, ''),
                    (k * a) + 'x' + (plus ? '+' : '-') + (k * b)],
          etapes: [
            'On distribue le ' + k + ' à chacun des deux termes de la parenthèse.',
            '\\(' + k + ' \\times ' + a + 'x = ' + (k * a) + 'x\\) et \\(' + k +
              ' \\times ' + b + ' = ' + (k * b) + '\\)',
            'D\'où <b>' + attendu + '</b>'
          ],
          indices: ['\\(k(a + b) = ka + kb\\) : le facteur touche les deux termes.',
                    'Écris ta réponse sous la forme « ' + (k * a) + 'x + … ».'],
          duree: 60
        };
      }

      /* --- factoriser ---------------------------------------------------- */
      var f = rnd.entier(2, 9);
      var m = rnd.entier(2, 9), n = rnd.entier(2, 9);
      if (m === n) n = m + 1;
      var att = f + '(' + m + 'x' + (plus ? ' + ' : ' − ') + n + ')';
      return {
        enonce: 'Factorise, c\'est-à-dire mets le facteur commun en évidence.',
        tex: (f * m) + 'x' + signeTxt + (f * n),
        type: 'texte',
        reponse: [att, att.replace(/ /g, ''),
                  f + '(' + m + 'x' + (plus ? '+' : '-') + n + ')'],
        etapes: [
          'On cherche un nombre qui divise à la fois ' + (f * m) + ' et ' + (f * n) + '.',
          '<b>' + f + '</b> convient : \\(' + (f * m) + ' = ' + f + ' \\times ' + m +
            '\\) et \\(' + (f * n) + ' = ' + f + ' \\times ' + n + '\\).',
          'On met ce facteur commun devant une parenthèse : <b>' + att + '</b>',
          'Vérification : en redéveloppant, on retombe bien sur \\(' + (f * m) + 'x' +
            signeTxt + (f * n) + '\\).'
        ],
        indices: ['Cherche le plus grand nombre qui divise les deux coefficients.',
                  'Écris ta réponse sous la forme « ' + f + '(… x ± …) ».'],
        duree: 70
      };
    }
  });
})();
