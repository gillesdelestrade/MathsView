/*
 * additions-20 — additions jusqu'à 20 (leçon 6ème du même nom).
 *
 * L'ordre des paliers suit celui de l'apprentissage, pas celui de la
 * difficulté apparente :
 *
 *   1. le COMPLÉMENT À 10 — 7 + ? = 10. C'est le socle : sans lui, rien ;
 *   2. les additions sans franchissement, où il n'y a qu'à réunir ;
 *   3. le PASSAGE DE LA DIZAINE, avec la décomposition écrite en toutes lettres ;
 *   4. la décomposition elle-même, demandée directement — savoir couper 5 en
 *      2 + 3 face à un 8, c'est là que se joue toute la stratégie.
 *
 * Les corrections parlent des boîtes de dix, comme la leçon : « la boîte est
 * pleine », « il en reste 3 ».
 */
(function () {
  'use strict';

  MathsExos.register({
    id: 'additions-20', competence: 'additions-20', level: '6eme',
    titre: 'Additions jusqu\'à 20', paliers: 4,

    genere: function (rnd, palier) {

      /* --- palier 1 : le complément à 10 --------------------------------- */
      if (palier === 1) {
        var a1 = rnd.entier(1, 9);
        return {
          enonce: 'Complète pour faire 10.',
          tex: a1 + ' + \\square = 10',
          type: 'nombre', reponse: 10 - a1,
          etapes: [
            'Dans une boîte de dix cases, ' + a1 + ' cases sont prises : il en reste ' +
              '<b>' + (10 - a1) + '</b> à remplir.',
            '\\(' + a1 + ' + ' + (10 - a1) + ' = 10\\)',
            'Les compléments à 10 sont à connaître par cœur : 1+9, 2+8, 3+7, 4+6, 5+5.'
          ],
          indices: ['Compte les cases vides de la boîte de dix.',
                    'Que faut-il ajouter à ' + a1 + ' pour arriver à 10 ?'],
          duree: 30
        };
      }

      /* --- palier 2 : sans franchir la dizaine --------------------------- */
      if (palier === 2) {
        var a2 = rnd.entier(2, 8);
        var b2 = rnd.entier(1, 10 - a2);
        return {
          enonce: 'Calcule.',
          tex: a2 + ' + ' + b2,
          type: 'nombre', reponse: a2 + b2,
          etapes: [
            'Les ' + (a2 + b2) + ' jetons tiennent dans une seule boîte : ' +
              'pas de dizaine à franchir.',
            '\\(' + a2 + ' + ' + b2 + ' = <b>' + (a2 + b2) + '</b>\\)',
            a2 === b2 ? 'C\'est un <b>double</b> : ils s\'apprennent tels quels.'
                      : 'Souviens-toi que l\'ordre ne change rien : ' + b2 + ' + ' + a2 +
                        ' donne la même chose.'
          ],
          indices: ['Pars du plus grand des deux et avance de l\'autre.'],
          duree: 30
        };
      }

      /* --- paliers 3-4 : le passage de la dizaine ------------------------ */
      var a = rnd.entier(4, 9);
      var b = rnd.entier(11 - a, 9);          // garantit le franchissement
      var manque = 10 - a, reste = b - manque;

      // Palier 4 : on demande la décomposition, pas le résultat.
      if (palier >= 4 && rnd.booleen(0.5)) {
        var vrai = manque + ' + ' + reste;
        /* Les leurres sont des coupures plausibles de b : l'ordre inversé, et
           des découpes voisines. Il en faut plus que nécessaire, car certaines
           coïncident quand le complément égale le reste (7 + 6 → 3 + 3). */
        var pool = [vrai, reste + ' + ' + manque,
                    (manque + 1) + ' + ' + (reste - 1),
                    (manque - 1) + ' + ' + (reste + 1),
                    (manque + 2) + ' + ' + (reste - 2),
                    (manque - 2) + ' + ' + (reste + 2)];
        var choix = [];
        pool.forEach(function (t) {
          var m = t.split(' + ').map(Number);
          // on n'accepte que des décompositions plausibles, et pas de doublon
          if (m[0] >= 0 && m[1] >= 0 && choix.indexOf(t) < 0) choix.push(t);
        });
        choix = rnd.melange(choix.slice(0, 4));
        return {
          enonce: 'Pour calculer \\(' + a + ' + ' + b + '\\) en passant par 10, ' +
                  'comment faut-il couper le <strong>' + b + '</strong> ?',
          type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
          etapes: [
            'Il manque <b>' + manque + '</b> à ' + a + ' pour remplir la boîte de dix.',
            'On coupe donc ' + b + ' en <b>' + manque + ' + ' + reste + '</b> : ' +
              manque + ' pour finir la boîte, ' + reste + ' pour la suite.',
            '\\(' + a + ' + ' + b + ' = ' + a + ' + ' + manque + ' + ' + reste +
              ' = 10 + ' + reste + ' = ' + (a + b) + '\\)'
          ],
          indices: ['Combien manque-t-il à ' + a + ' pour faire 10 ?',
                    'Le premier morceau, c\'est ce complément.'],
          duree: 60
        };
      }

      return {
        enonce: 'Calcule en passant par 10.',
        tex: a + ' + ' + b,
        type: 'nombre', reponse: a + b,
        etapes: [
          'Il manque <b>' + manque + '</b> à ' + a + ' pour remplir la boîte de dix.',
          'On coupe ' + b + ' en <b>' + manque + ' + ' + reste + '</b>.',
          '\\(' + a + ' + ' + manque + ' = 10\\) — la boîte est pleine.',
          '\\(10 + ' + reste + ' = <b>' + (a + b) + '</b>\\)',
          a === b ? 'C\'était aussi un <b>double</b> : ' + a + ' + ' + a + ' = ' + (a + b) + '.'
                  : (Math.abs(a - b) === 1
                      ? 'C\'était un <b>presque-double</b> : ' + Math.min(a, b) + ' + ' +
                        Math.min(a, b) + ' = ' + (2 * Math.min(a, b)) + ', plus 1.'
                      : 'Une boîte pleine ne se compte pas : elle se reconnaît.')
        ],
        indices: ['Combien manque-t-il à ' + a + ' pour faire 10 ?',
                  'Coupe ' + b + ' en ' + manque + ' + ' + reste + ', puis ajoute.'],
        duree: 50
      };
    }
  });
})();
