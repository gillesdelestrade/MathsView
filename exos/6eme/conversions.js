/*
 * conversions — les unités de longueur, de masse, de contenance et d'aire
 * (leçon 6ème « Conversions »).
 *
 * La correction dit toujours dans quel SENS on va (vers une unité plus petite
 * → on multiplie) et de combien de rangs : c'est ce raisonnement qui évite
 * d'apprendre le tableau par cœur.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var FAMILLES = {
    longueur:   { unites: ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'], pas: 10, nom: 'longueur' },
    masse:      { unites: ['mg', 'cg', 'dg', 'g', 'dag', 'hg', 'kg'], pas: 10, nom: 'masse' },
    contenance: { unites: ['mL', 'cL', 'dL', 'L'],                     pas: 10, nom: 'contenance' },
    aire:       { unites: ['mm²', 'cm²', 'dm²', 'm²'],                 pas: 100, nom: 'aire' }
  };

  MathsExos.register({
    id: 'conversions', competence: 'conversions', level: '6eme',
    titre: 'Conversions d\'unités', paliers: 4,

    genere: function (rnd, palier) {
      var cles = palier <= 2 ? ['longueur', 'masse'] : Object.keys(FAMILLES);
      var F = FAMILLES[rnd.choix(cles)];
      var i = rnd.entier(0, F.unites.length - 1), j;
      var ecart = palier === 1 ? 1 : palier === 2 ? rnd.entier(1, 2) : rnd.entier(1, 3);
      j = rnd.booleen(0.5) ? i + ecart : i - ecart;
      j = Math.max(0, Math.min(F.unites.length - 1, j));
      if (j === i) j = i + (i === 0 ? 1 : -1);

      var rangs = j - i;                    // > 0 : vers une unité plus grande
      var facteur = Math.pow(F.pas, -rangs);
      var val = palier <= 2 ? rnd.entier(1, 999) : rnd.entier(1, 9999) / 10;
      var res = val * facteur;

      return {
        enonce: 'Convertis : \\(' + O.tex(val) + '\\ \\text{' + F.unites[i] +
                '}\\) = … \\(\\text{' + F.unites[j] + '}\\)',
        type: 'nombre', reponse: Math.round(res * 1e6) / 1e6, unite: F.unites[j],
        etapes: [
          'On va de <b>' + F.unites[i] + '</b> vers <b>' + F.unites[j] + '</b>, soit ' +
            Math.abs(rangs) + ' rang' + (Math.abs(rangs) > 1 ? 's' : '') +
            ' vers la ' + (rangs > 0 ? 'gauche' : 'droite') + ' du tableau.',
          rangs > 0
            ? 'On va vers une unité <b>plus grande</b> : le nombre devient plus petit, ' +
              'on <b>divise</b> par ' + F.pas + (Math.abs(rangs) > 1 ?
              ' à chaque rang, soit par ' + Math.pow(F.pas, rangs) : '') + '.'
            : 'On va vers une unité <b>plus petite</b> : il en faut davantage, ' +
              'on <b>multiplie</b> par ' + F.pas + (Math.abs(rangs) > 1 ?
              ' à chaque rang, soit par ' + Math.pow(F.pas, -rangs) : '') + '.',
          '\\(' + O.tex(val) + '\\ \\text{' + F.unites[i] + '} = <b>' + O.tex(res, 6) +
            '</b>\\ \\text{' + F.unites[j] + '}\\)'
        ],
        indices: [
          'Vers une unité plus petite, il en faut plus : on multiplie.',
          F.pas === 100 ? 'Attention : pour les aires, chaque rang vaut 100, pas 10.'
                        : 'Chaque rang du tableau vaut ' + F.pas + '.'
        ],
        duree: 55
      };
    }
  });
})();
