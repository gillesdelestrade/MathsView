/*
 * tables — les tables de multiplication jusqu'à 10 (leçon 6ème du même nom).
 *
 * Trois façons d'interroger une table, et ce n'est pas du remplissage : ce sont
 * trois compétences distinctes.
 *
 *   7 × 3 = ?        le sens direct, celui qu'on récite ;
 *   ? × 7 = 42       le sens INVERSE — c'est lui qui sert pour les divisions et
 *                    pour simplifier les fractions, et c'est le plus fragile ;
 *   où trouve-t-on 24 ?   la lecture transversale, qui prépare la recherche de
 *                    diviseurs.
 *
 * Les corrections reprennent les deux images de la leçon : le rectangle
 * (7 lignes de 3) et l'addition répétée, plus le rappel de commutativité —
 * chaque résultat appris en donne deux.
 */
(function () {
  'use strict';

  // La table de n, ce sont n×1 … n×10 : un nombre y figure si son quotient
  // tombe juste ET reste sous 10.
  function tablesDe(p) {
    var out = [];
    for (var n = 2; n <= 10; n++) if (p % n === 0 && p / n <= 10) out.push(n);
    return out;
  }

  MathsExos.register({
    id: 'tables', competence: 'tables', level: '6eme',
    titre: 'Tables de multiplication', paliers: 4,

    /* ------------------------------------------------------------------ */
    /* Les FAITS, pour le mode flash                                       */
    /* ------------------------------------------------------------------ */
    /* Le mode flash ne mesure pas la compréhension mais l'AUTOMATISME : il
       faut donc du rappel pur, et rien d'autre. Les paliers 3 et 4 de ce
       générateur — « quel nombre manque ? », « où trouve-t-on 24 ? » — sont de
       vraies compétences, mais elles se raisonnent : les chronométrer à trois
       secondes n'aurait aucun sens. Le flash ne connaît donc que le sens
       direct, énuméré ici fait par fait.

       Les 81 produits sont tous listés, y compris les tables de 2 et de 10 qui
       s'automatisent d'elles-mêmes : c'est le tirage pondéré qui les mettra de
       côté une fois qu'elles seront sues, sans qu'on ait à en décider ici. */
    flash: {
      libelle: 'Tables de multiplication',
      faits: function () {
        var out = [];
        for (var a = 2; a <= 10; a++) {
          for (var b = 2; b <= 10; b++) {
            out.push({ cle: a + 'x' + b, texte: a + ' × ' + b, reponse: a * b });
          }
        }
        return out;
      }
    },

    genere: function (rnd, palier) {
      var maxi = palier === 1 ? 5 : 10;
      var a = rnd.entier(2, maxi), b = rnd.entier(2, maxi);
      var p = a * b;

      /* --- palier 4 : dans quelles tables ce nombre se trouve-t-il ? ----- */
      if (palier >= 4 && rnd.booleen(0.4)) {
        var cible, tab;
        for (var essai = 0; essai < 40; essai++) {
          cible = rnd.entier(2, 10) * rnd.entier(2, 10);
          tab = tablesDe(cible);
          if (tab.length >= 2 && tab.length <= 5) break;
        }
        var choix = [], corrects = [];
        for (var n = 2; n <= 10; n++) {
          if (tab.indexOf(n) >= 0) corrects.push(choix.length);
          choix.push('la table de ' + n);
        }
        return {
          enonce: 'Coche <strong>toutes</strong> les tables dans lesquelles on ' +
                  'trouve le nombre <strong>' + cible + '</strong>.',
          type: 'qcm-multi', choix: choix, corrects: corrects,
          etapes: ['On cherche toutes les façons d\'écrire ' + cible +
                   ' comme un produit de deux nombres <b>inférieurs ou égaux à 10</b>.']
            .concat(tab.filter(function (n2) { return n2 <= cible / n2; })
              .map(function (n2) {
                return '\\(' + cible + ' = ' + n2 + ' \\times ' + (cible / n2) +
                  '\\) → il est donc dans la table de <b>' + n2 + '</b>' +
                  (n2 !== cible / n2 ? ' et dans celle de <b>' + (cible / n2) + '</b>'
                                     : ' (c\'est un carré)') + '.';
              }))
            .concat(['Ces nombres-là sont exactement les <b>diviseurs</b> de ' +
                     cible + ' qui ne dépassent pas 10.']),
          indices: ['Essaie de couper ' + cible + ' en deux facteurs : 2 fois quoi ? ' +
                    '3 fois quoi ?',
                    'Chaque décomposition en donne deux d\'un coup, puisque l\'ordre ' +
                    'ne change rien.'],
          duree: 90
        };
      }

      /* --- paliers 3-4 : le facteur manquant ----------------------------- */
      if (palier >= 3 && rnd.booleen(0.5)) {
        var suite = [];
        for (var k = 1; k <= 10; k++) suite.push(b * k);
        return {
          enonce: 'Quel nombre manque ?',
          tex: '\\square \\times ' + b + ' = ' + p,
          type: 'nombre', reponse: a,
          etapes: [
            'On cherche <b>combien de fois ' + b + '</b> tient dans ' + p + '.',
            'La table de ' + b + ' : ' + suite.slice(0, Math.max(a, 3)).join(', ') +
              (a < 10 ? '…' : '') + ' — ' + p + ' est le <b>' + a +
              '<sup>e</sup></b> de la liste.',
            '\\(' + a + ' \\times ' + b + ' = ' + p + '\\)',
            'C\'est cette lecture-là qui sert pour les divisions : ' +
              '\\(' + p + ' \\div ' + b + ' = ' + a + '\\).'
          ],
          indices: ['Récite la table de ' + b + ' jusqu\'à tomber sur ' + p + '.',
                    'Autrement dit : ' + p + ' ÷ ' + b + ' = ?'],
          duree: 55
        };
      }

      /* --- le produit, tout simplement ----------------------------------- */
      var addition = Array.apply(null, Array(Math.min(b, 6)))
        .map(function () { return a; }).join(' + ') + (b > 6 ? ' + …' : '');
      return {
        enonce: 'Calcule.',
        tex: a + ' \\times ' + b,
        type: 'nombre', reponse: p,
        etapes: [
          '\\(' + a + ' \\times ' + b + '\\), c\'est <b>' + b + ' fois le nombre ' + a +
            '</b> : ' + addition + '.',
          'On peut aussi le voir comme un rectangle de ' + a + ' lignes de ' + b +
            ' points.',
          '\\(' + a + ' \\times ' + b + ' = \\mathbf{' + p + '}\\)',
          a === b ? 'C\'est un <b>carré</b> : ' + a + ' × ' + a + '.'
                  : 'Et l\'ordre ne change rien : \\(' + b + ' \\times ' + a + ' = ' + p +
                    '\\) aussi. Un résultat appris, deux cases retenues.'
        ],
        indices: ['Récite la table de ' + Math.max(a, b) + '.',
                  'Si tu bloques, pars d\'un résultat voisin : ' +
                  (b > 1 ? a + ' × ' + (b - 1) + ' = ' + (a * (b - 1)) + ', puis ajoute ' + a
                         : 'commence par ' + a + ' × 2') + '.'],
        duree: 35
      };
    }
  });
})();
