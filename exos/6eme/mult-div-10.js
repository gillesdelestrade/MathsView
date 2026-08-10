/*
 * mult-div-10 — multiplier et diviser par 10, 100, 1000 (leçon 6ème du même nom).
 *
 * La correction ne dit jamais « on déplace la virgule » sans dire pourquoi :
 * multiplier par 10, c'est rendre chaque chiffre dix fois plus grand, donc le
 * décaler d'un rang. C'est cette phrase-là qui évite le décalage à l'envers.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'mult-div-10', competence: 'mult-div-10', level: '6eme',
    titre: 'Multiplier et diviser par 10, 100, 1000', paliers: 3,

    genere: function (rnd, palier) {
      var puissances = palier === 1 ? [10, 100] : [10, 100, 1000];
      var p = rnd.choix(puissances);
      var mult = rnd.booleen(0.5);
      var val = palier === 1 ? rnd.entier(1, 999)
              : rnd.entier(1, 99999) / Math.pow(10, rnd.entier(1, 2));
      var res = mult ? val * p : val / p;
      var rangs = String(p).length - 1;

      return {
        enonce: 'Calcule.',
        tex: O.tex(val) + (mult ? ' \\times ' : ' \\div ') + p,
        type: 'nombre', reponse: Math.round(res * 1e6) / 1e6,
        etapes: [
          mult
            ? 'Multiplier par ' + p + ', c\'est rendre chaque chiffre <b>' + p +
              ' fois plus grand</b> : chacun avance de ' + rangs + ' rang' +
              (rangs > 1 ? 's' : '') + ' vers la gauche.'
            : 'Diviser par ' + p + ', c\'est rendre chaque chiffre <b>' + p +
              ' fois plus petit</b> : chacun recule de ' + rangs + ' rang' +
              (rangs > 1 ? 's' : '') + ' vers la droite.',
          'Autrement dit, la virgule se décale de ' + rangs + ' rang' +
            (rangs > 1 ? 's' : '') + ' vers la ' + (mult ? 'droite' : 'gauche') +
            ' (on complète par des zéros s\'il en manque).',
          '\\(' + O.tex(val) + (mult ? ' \\times ' : ' \\div ') + p + ' = \\mathbf{' +
            O.tex(res, 6) + '}\\)'
        ],
        indices: [
          mult ? 'Le résultat doit être PLUS GRAND que le nombre de départ.'
               : 'Le résultat doit être PLUS PETIT que le nombre de départ.',
          'Compte les zéros de ' + p + ' : c\'est le nombre de rangs.'
        ],
        duree: 40
      };
    }
  });
})();
