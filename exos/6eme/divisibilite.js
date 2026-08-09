/*
 * divisibilite — les critères de divisibilité (leçon 6ème du même nom).
 *
 * Le fond du chapitre n'est pas de savoir SI un nombre est divisible : c'est de
 * savoir POURQUOI, sans poser la division. Les corrections montrent donc à
 * chaque fois le critère appliqué au nombre — la somme des chiffres calculée,
 * le chiffre des unités désigné.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var CRITERES = {
    2: { txt: 'son chiffre des unités est 0, 2, 4, 6 ou 8 (le nombre est pair)',
         montre: function (n) { return 'son chiffre des unités est <b>' + (n % 10) + '</b>'; } },
    3: { txt: 'la somme de ses chiffres est dans la table de 3',
         montre: function (n) { return sommeTxt(n, 3); } },
    4: { txt: 'le nombre formé par ses deux derniers chiffres est dans la table de 4',
         montre: function (n) { return 'ses deux derniers chiffres forment <b>' +
           (n % 100) + '</b>, et ' + (n % 100) + ' ' + (n % 4 === 0 ? 'est' : 'n\'est pas') +
           ' dans la table de 4'; } },
    5: { txt: 'son chiffre des unités est 0 ou 5',
         montre: function (n) { return 'son chiffre des unités est <b>' + (n % 10) + '</b>'; } },
    9: { txt: 'la somme de ses chiffres est dans la table de 9',
         montre: function (n) { return sommeTxt(n, 9); } },
    10: { txt: 'son chiffre des unités est 0',
          montre: function (n) { return 'son chiffre des unités est <b>' + (n % 10) + '</b>'; } }
  };

  // Le plus petit diviseur autre que 1 : au-delà de √n, il n'y a plus rien à
  // trouver — si aucun n'a été vu, le nombre est premier et se divise par
  // lui-même.
  function plusPetitDiviseur(n) {
    for (var d = 2; d * d <= n; d++) if (n % d === 0) return d;
    return n;
  }

  function chiffres(n) { return String(n).split('').map(Number); }
  function somme(n) { return chiffres(n).reduce(function (a, b) { return a + b; }, 0); }
  function sommeTxt(n, d) {
    var s = somme(n);
    return 'la somme de ses chiffres vaut ' + chiffres(n).join(' + ') + ' = <b>' + s +
      '</b>, et ' + s + ' ' + (s % d === 0 ? 'est' : 'n\'est pas') + ' dans la table de ' + d;
  }

  MathsExos.register({
    id: 'divisibilite', competence: 'divisibilite', level: '6eme',
    titre: 'Critères de divisibilité', paliers: 3,

    genere: function (rnd, palier) {
      var DIVS = palier === 1 ? [2, 5, 10] : palier === 2 ? [2, 3, 5, 9, 10] : [2, 3, 4, 5, 9, 10];
      var d = rnd.choix(DIVS);
      var n = rnd.entier(palier === 1 ? 20 : 100, palier === 1 ? 200 : 9999);
      // Une question sur deux tombe sur un multiple : sinon, presque toutes les
      // réponses seraient « faux », et l'élève le devinerait sans réfléchir.
      if (rnd.booleen(0.5)) n = n - (n % d);
      var oui = n % d === 0;

      /* --- palier 3 : le plus petit diviseur, une vraie recherche -------- */
      if (palier >= 3 && rnd.booleen(0.35)) {
        // On écarte les nombres premiers : la question porte sur les critères,
        // pas sur la primalité — et « son plus petit diviseur est lui-même »
        // n'est pas le raisonnement qu'on veut faire travailler ici.
        var m, petit;
        for (var essai = 0; essai < 60; essai++) {
          m = rnd.entier(102, 999);
          petit = plusPetitDiviseur(m);
          if (petit <= 20) break;
        }
        if (petit > 20) { m = 102; petit = 2; }
        return {
          enonce: 'Quel est le plus petit diviseur de \\(' + m + '\\), autre que 1 ?',
          type: 'nombre', reponse: petit,
          etapes: [
            'On essaie dans l\'ordre : 2, puis 3, puis 5…',
            m % 2 === 0 ? '\\(' + m + '\\) est pair, donc divisible par <b>2</b>.'
                        : '\\(' + m + '\\) est impair : 2 ne convient pas. ' +
                          (m % 3 === 0 ? sommeTxt(m, 3) + ', donc <b>3</b> convient.'
                                       : 'On continue : le plus petit est <b>' + petit + '</b>.'),
            '\\(' + m + ' = ' + petit + ' \\times ' + (m / petit) + '\\)'
          ],
          indices: ['Commence par 2 : le nombre est-il pair ?',
                    'Puis 3 : que vaut la somme de ses chiffres ?'],
          duree: 50
        };
      }

      return {
        enonce: 'Vrai ou faux : \\(' + n + '\\) est divisible par \\(' + d + '\\) ?',
        type: 'vraifaux', correct: oui ? 0 : 1,
        etapes: [
          'Le critère : un nombre est divisible par ' + d + ' quand ' + CRITERES[d].txt + '.',
          'Ici, ' + CRITERES[d].montre(n) + '.',
          oui ? '\\(' + n + '\\) est donc bien divisible par ' + d +
                ' : \\(' + n + ' = ' + d + ' \\times ' + (n / d) + '\\).'
              : '\\(' + n + '\\) n\'est donc <b>pas</b> divisible par ' + d +
                ' (il reste ' + (n % d) + ').'
        ],
        indices: ['Rappelle-toi le critère de divisibilité par ' + d + '.',
                  CRITERES[d].txt.charAt(0).toUpperCase() + CRITERES[d].txt.slice(1) + '.'],
        duree: 35
      };
    }
  });
})();
