/*
 * relatifs — additionner et soustraire des nombres relatifs (leçon 5ème
 * « Nombres relatifs sur une droite »).
 *
 * La correction suit exactement le raisonnement de la leçon : on se DÉPLACE
 * sur la droite graduée, et le sens du déplacement dépend de l'opération et du
 * signe. Soustraire un nombre, c'est ajouter son opposé — la correction l'écrit
 * noir sur blanc à chaque soustraction.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'relatifs', competence: 'relatifs', level: '5eme',
    titre: 'Nombres relatifs', paliers: 4,

    genere: function (rnd, palier) {
      /* --- palier 1 : opposé et comparaison ---------------------------- */
      if (palier === 1 && rnd.booleen(0.5)) {
        var a1 = rnd.entierNonNul(-15, 15);
        var b1 = rnd.entierNonNul(-15, 15);
        if (a1 === b1) b1 = -a1;
        return {
          enonce: 'Compare : \\(' + O.tex(a1) + '\\) est … \\(' + O.tex(b1) + '\\)',
          type: 'qcm', choix: ['plus petit que', 'plus grand que'],
          correct: a1 < b1 ? 0 : 1,
          etapes: [
            'Sur la droite graduée, « plus grand » veut dire « <b>plus à droite</b> ».',
            (a1 < 0 && b1 > 0) || (b1 < 0 && a1 > 0)
              ? 'Un nombre négatif est toujours plus petit qu\'un nombre positif.'
              : (a1 < 0
                  ? 'Attention, les deux sont négatifs : le plus grand est celui dont ' +
                    'la distance à 0 est la plus <b>petite</b>.'
                  : 'Les deux sont positifs : on compare comme d\'habitude.'),
            '\\(' + O.tex(a1) + (a1 < b1 ? ' < ' : ' > ') + O.tex(b1) + '\\)'
          ],
          indices: ['Place mentalement les deux nombres sur la droite graduée.',
                    'Le plus à droite est le plus grand.'],
          duree: 35
        };
      }

      var a = rnd.entierNonNul(-12, 12);
      var b = rnd.entierNonNul(-12, 12);
      var moins = palier >= 2 ? rnd.booleen(0.5) : false;
      var dep = moins ? -b : b;                 // le déplacement signé
      var res = a + dep;

      return {
        enonce: 'Calcule.',
        tex: O.tex(a) + (moins ? ' - ' : ' + ') +
             (b < 0 ? '(' + O.tex(b) + ')' : O.tex(b)),
        type: 'nombre', reponse: res,
        etapes: [
          moins
            ? 'Soustraire un nombre, c\'est <b>ajouter son opposé</b> : \\(' +
              O.tex(a) + ' - ' + (b < 0 ? '(' + O.tex(b) + ')' : O.tex(b)) + ' = ' +
              O.tex(a) + ' + ' + (dep < 0 ? '(' + O.tex(dep) + ')' : O.tex(dep)) + '\\)'
            : 'On part de ' + O.fr(a) + ' sur la droite graduée.',
          'On ajoute ' + O.par(dep) + ' : on se déplace de ' + Math.abs(dep) +
            ' cran' + (Math.abs(dep) > 1 ? 's' : '') + ' vers la <b>' +
            (dep > 0 ? 'droite' : 'gauche') + '</b>.',
          'On arrive à <b>' + O.fr(res) + '</b>.'
        ],
        indices: [
          moins ? 'Commence par transformer la soustraction en addition de l\'opposé.'
                : 'Ajouter un positif : vers la droite. Ajouter un négatif : vers la gauche.',
          'Pars de ' + O.fr(a) + ' et déplace-toi de ' + Math.abs(dep) + ' crans.'
        ],
        duree: 45
      };
    }
  });
})();
