/*
 * fractions — simplifier, comparer, prendre une fraction d'une quantité
 * (leçons 6ème « Les fractions », « Fractions égales », « Opérations »).
 *
 * On demande toujours la fraction SIMPLIFIÉE, et la correction montre le
 * diviseur commun utilisé : c'est le geste à installer, pas le résultat.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'fractions', competence: 'fractions', level: '6eme',
    titre: 'Fractions', paliers: 4,

    genere: function (rnd, palier) {
      var forme = palier === 1 ? 0 : rnd.entier(0, Math.min(3, palier - 1));

      /* --- 0 : simplifier ------------------------------------------------ */
      if (forme === 0) {
        var base = O.reduit(rnd.entier(1, 9), rnd.entier(2, 9));
        var k = rnd.entier(2, palier <= 2 ? 5 : 9);
        var n = base.n * k, d = base.d * k;
        return {
          enonce: 'Simplifie cette fraction au maximum.',
          tex: '\\dfrac{' + n + '}{' + d + '}',
          type: 'texte', reponse: O.fracFormes(n, d),
          etapes: [
            'On cherche un nombre qui divise à la fois ' + n + ' et ' + d + '.',
            'Ici <b>' + O.pgcd(n, d) + '</b> convient : \\(' + n + ' = ' +
              O.pgcd(n, d) + ' \\times ' + (n / O.pgcd(n, d)) + '\\) et \\(' + d + ' = ' +
              O.pgcd(n, d) + ' \\times ' + (d / O.pgcd(n, d)) + '\\).',
            'On simplifie : \\(\\dfrac{' + n + '}{' + d + '} = ' +
              O.fracTex(base.n, base.d) + '\\)'
          ],
          indices: ['Cherche un nombre qui divise le numérateur ET le dénominateur.',
                    'Essaie 2, puis 3, puis 5… ou trouve directement le plus grand.'],
          duree: 50
        };
      }

      /* --- 1 : une fraction d'une quantité ------------------------------- */
      if (forme === 1) {
        var dd = rnd.choix([2, 3, 4, 5, 6, 8, 10]);
        var nn = rnd.entier(1, dd - 1);
        var q = dd * rnd.entier(2, 12);
        return {
          enonce: 'Combien font les \\(' + O.fracTex(nn, dd) + '\\) de \\(' + q + '\\) ?',
          type: 'nombre', reponse: nn * q / dd,
          etapes: [
            'Prendre les ' + nn + '/' + dd + ' d\'un nombre, c\'est le partager en ' +
              dd + ', puis en garder ' + nn + '.',
            '\\(' + q + ' \\div ' + dd + ' = ' + (q / dd) + '\\) (un ' +
              dd + '<sup>e</sup> de ' + q + ')',
            '\\(' + (q / dd) + ' \\times ' + nn + ' = <b>' + (nn * q / dd) + '</b>\\)'
          ],
          indices: ['Divise d\'abord par le dénominateur.',
                    'Puis multiplie par le numérateur.'],
          duree: 50
        };
      }

      /* --- 2 : comparer -------------------------------------------------- */
      if (forme === 2) {
        var d1 = rnd.choix([2, 3, 4, 5, 6]);
        var mult = rnd.entier(2, 4);
        var d2 = d1 * mult;                        // dénominateurs multiples
        var n1 = rnd.entier(1, d1 - 1), n2 = rnd.entier(1, d2 - 1);
        var v1 = n1 / d1, v2 = n2 / d2;
        var choix = ['inférieur à', 'égal à', 'supérieur à'];
        var bon = Math.abs(v1 - v2) < 1e-9 ? 1 : (v1 < v2 ? 0 : 2);
        return {
          enonce: 'Compare : \\(' + O.fracTex(n1, d1) + '\\) est … \\(' +
                  O.fracTex(n2, d2) + '\\)',
          type: 'qcm', choix: choix, correct: bon,
          etapes: [
            'Pour comparer, on met les deux fractions <b>au même dénominateur</b>.',
            '\\(' + O.fracTex(n1, d1) + ' = \\dfrac{' + n1 + ' \\times ' + mult +
              '}{' + d1 + ' \\times ' + mult + '} = \\dfrac{' + (n1 * mult) + '}{' + d2 + '}\\)',
            'On compare alors les numérateurs : ' + (n1 * mult) + ' ' +
              (bon === 0 ? '&lt;' : bon === 1 ? '=' : '&gt;') + ' ' + n2 + '.'
          ],
          indices: ['Un des deux dénominateurs est un multiple de l\'autre.',
                    'Multiplie numérateur et dénominateur par le même nombre.'],
          duree: 55
        };
      }

      /* --- 3 : additionner ----------------------------------------------- */
      var db = rnd.choix([3, 4, 5, 6, 8]);
      var m2 = rnd.entier(2, 3);
      var da = db * m2;
      var na = rnd.entier(1, da - 1), nb = rnd.entier(1, db - 1);
      var som = O.reduit(na + nb * m2, da);
      return {
        enonce: 'Calcule et simplifie si c\'est possible.',
        tex: '\\dfrac{' + na + '}{' + da + '} + \\dfrac{' + nb + '}{' + db + '}',
        type: 'texte', reponse: O.fracFormes(som.n, som.d),
        etapes: [
          'On ne peut additionner que des fractions de <b>même dénominateur</b>.',
          '\\(\\dfrac{' + nb + '}{' + db + '} = \\dfrac{' + nb + ' \\times ' + m2 +
            '}{' + db + ' \\times ' + m2 + '} = \\dfrac{' + (nb * m2) + '}{' + da + '}\\)',
          '\\(\\dfrac{' + na + '}{' + da + '} + \\dfrac{' + (nb * m2) + '}{' + da +
            '} = \\dfrac{' + (na + nb * m2) + '}{' + da + '}\\)' +
            (som.d === da ? '' : ' , que l\'on simplifie en \\(' +
              O.fracTex(som.n, som.d) + '\\)'),
          'Résultat : <b>' + O.fracTxt(som.n, som.d) + '</b>'
        ],
        indices: ['Mets les deux fractions au même dénominateur.',
                  'On additionne les numérateurs, jamais les dénominateurs.'],
        duree: 70
      };
    }
  });
})();
