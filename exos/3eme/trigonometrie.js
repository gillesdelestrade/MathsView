/*
 * trigo — cosinus, sinus, tangente dans le triangle rectangle (leçon 3ème
 * « Trigonométrie »).
 *
 * Toute la difficulté est de choisir LA bonne ligne trigonométrique : la
 * correction commence donc toujours par nommer les côtés (hypoténuse, adjacent,
 * opposé) par rapport à l'angle en jeu, avant d'écrire quoi que ce soit.
 *
 * Les réponses sont demandées arrondies, et l'arrondi est annoncé dans
 * l'énoncé : sinon aucune valeur ne serait écrivable dans un champ.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var LIGNES = {
    cos: { nom: 'cosinus', form: '\\cos', quoi: 'adjacent', sur: 'hypoténuse',
           moyen: 'CAH : Cosinus = Adjacent / Hypoténuse' },
    sin: { nom: 'sinus', form: '\\sin', quoi: 'opposé', sur: 'hypoténuse',
           moyen: 'SOH : Sinus = Opposé / Hypoténuse' },
    tan: { nom: 'tangente', form: '\\tan', quoi: 'opposé', sur: 'adjacent',
           moyen: 'TOA : Tangente = Opposé / Adjacent' }
  };

  MathsExos.register({
    id: 'trigo', competence: 'trigo', level: '3eme',
    titre: 'Trigonométrie', paliers: 3,

    genere: function (rnd, palier) {
      var cle = palier === 1 ? rnd.choix(['cos', 'sin']) : rnd.choix(['cos', 'sin', 'tan']);
      var L = LIGNES[cle];
      var ang = rnd.entier(20, 70);
      var hyp = rnd.entier(5, 20);

      /* --- chercher une longueur ----------------------------------------- */
      if (palier <= 2 || rnd.booleen(0.5)) {
        var r = ang * Math.PI / 180;
        var cote, formule, calcul;
        if (cle === 'cos') {
          cote = hyp * Math.cos(r);
          formule = '\\cos(\\widehat{B}) = \\dfrac{AB}{BC}';
          calcul = 'AB = BC \\times \\cos(\\widehat{B}) = ' + hyp + ' \\times \\cos(' +
                   ang + '°)';
        } else if (cle === 'sin') {
          cote = hyp * Math.sin(r);
          formule = '\\sin(\\widehat{B}) = \\dfrac{AC}{BC}';
          calcul = 'AC = BC \\times \\sin(\\widehat{B}) = ' + hyp + ' \\times \\sin(' +
                   ang + '°)';
        } else {
          cote = hyp * Math.tan(r);
          formule = '\\tan(\\widehat{B}) = \\dfrac{AC}{AB}';
          calcul = 'AC = AB \\times \\tan(\\widehat{B}) = ' + hyp + ' \\times \\tan(' +
                   ang + '°)';
        }
        var quel = cle === 'cos' ? 'AB' : 'AC';
        var donne = cle === 'tan' ? 'AB' : 'BC';
        return {
          enonce: 'Le triangle \\(ABC\\) est rectangle en \\(A\\). On sait que ' +
                  '\\(\\widehat{B} = ' + ang + '°\\) et \\(' + donne + ' = ' + hyp +
                  '\\) cm. Calcule \\(' + quel + '\\), arrondi au <strong>dixième</strong>.',
          type: 'nombre', reponse: Math.round(cote * 10) / 10, unite: 'cm',
          etapes: [
            'Par rapport à l\'angle \\(\\widehat{B}\\) : \\(AB\\) est le côté ' +
              '<b>adjacent</b>, \\(AC\\) le côté <b>opposé</b>, et \\(BC\\) ' +
              'l\'<b>hypoténuse</b> (elle fait toujours face à l\'angle droit).',
            'On connaît ' + donne + ' et on cherche ' + quel + ' : c\'est le <b>' +
              L.nom + '</b> qu\'il faut (' + L.moyen + ').',
            '\\(' + formule + '\\)',
            '\\(' + calcul + ' \\approx ' + O.tex(cote, 3) + '\\)',
            'Arrondi au dixième : <b>' + O.fr(Math.round(cote * 10) / 10) + '</b> cm'
          ],
          indices: ['Nomme d\'abord les côtés par rapport à l\'angle donné.',
                    'CAH · SOH · TOA : laquelle utilise les deux côtés en jeu ?'],
          duree: 110
        };
      }

      /* --- chercher un angle ---------------------------------------------- */
      var adj = rnd.entier(3, 12);
      var hyp2 = adj + rnd.entier(2, 10);
      var angle = Math.acos(adj / hyp2) * 180 / Math.PI;
      return {
        enonce: 'Le triangle \\(ABC\\) est rectangle en \\(A\\), avec \\(AB = ' + adj +
                '\\) cm et \\(BC = ' + hyp2 + '\\) cm. Calcule l\'angle ' +
                '\\(\\widehat{B}\\), arrondi au <strong>degré</strong>.',
        type: 'nombre', reponse: Math.round(angle), unite: '°',
        etapes: [
          'Par rapport à \\(\\widehat{B}\\), \\(AB\\) est le côté <b>adjacent</b> et ' +
            '\\(BC\\) l\'<b>hypoténuse</b> : c\'est donc le <b>cosinus</b> (CAH).',
          '\\(\\cos(\\widehat{B}) = \\dfrac{AB}{BC} = \\dfrac{' + adj + '}{' + hyp2 +
            '} \\approx ' + O.tex(adj / hyp2, 4) + '\\)',
          'On remonte à l\'angle avec la touche \\(\\cos^{-1}\\) de la calculatrice :',
          '\\(\\widehat{B} \\approx ' + O.tex(angle, 2) + '°\\), soit <b>' +
            Math.round(angle) + '°</b> au degré près.'
        ],
        indices: ['Quels côtés connais-tu par rapport à l\'angle cherché ?',
                  'Une fois le cosinus calculé, utilise la touche \\(\\cos^{-1}\\).'],
        duree: 110
      };
    }
  });
})();
