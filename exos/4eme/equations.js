/*
 * eq1 — les équations du premier degré (leçon 4ème du même nom).
 *
 * La correction fait UNE opération par ligne, toujours annoncée : « on
 * soustrait 2x aux deux membres ». C'est la règle de la balance, et c'est elle
 * qu'on veut voir apparaître, pas le résultat.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  MathsExos.register({
    id: 'eq1', competence: 'eq1', level: '4eme',
    titre: 'Équations du premier degré', paliers: 4,

    genere: function (rnd, palier) {
      /* On part de la SOLUTION et on fabrique l'équation autour : c'est ce qui
         garantit une réponse propre, entière aux premiers paliers. */
      var x = palier <= 3 ? rnd.entierNonNul(-9, 12) : rnd.entierNonNul(-9, 12);
      var a = O.coef(rnd, palier === 1 ? 6 : 9);
      var b = rnd.entierNonNul(-12, 12);

      /* --- palier 1 : ax + b = c ----------------------------------------- */
      if (palier === 1) {
        a = Math.abs(a);
        var c = a * x + b;
        return {
          enonce: 'Résous cette équation.',
          tex: a + 'x' + O.signeTex(b) + ' = ' + c,
          type: 'nombre', reponse: x,
          etapes: [
            'On isole le terme en \\(x\\) : on ' + (b > 0 ? 'soustrait ' : 'ajoute ') +
              Math.abs(b) + ' aux <b>deux</b> membres.',
            '\\(' + a + 'x = ' + c + (b > 0 ? ' - ' : ' + ') + Math.abs(b) + ' = ' +
              (a * x) + '\\)',
            'On divise les deux membres par ' + a + ' : \\(x = \\dfrac{' + (a * x) +
              '}{' + a + '} = <b>' + O.tex(x) + '</b>\\)'
          ],
          indices: ['Ce qu\'on fait d\'un côté, on le fait de l\'autre.',
                    'Commence par faire disparaître le nombre seul.'],
          duree: 60
        };
      }

      /* --- paliers 2 et 3 : ax + b = cx + d ------------------------------ */
      if (palier <= 3) {
        var c2 = a + rnd.entierNonNul(-5, 5);       // second coefficient, différent
        if (c2 === a) c2 = a + 1;
        var d2 = (a - c2) * x + b;                  // pour que la solution soit x
        var diff = a - c2;
        return {
          enonce: 'Résous cette équation.',
          tex: a + 'x' + O.signeTex(b) + ' = ' + c2 + 'x' + O.signeTex(d2),
          type: 'nombre', reponse: x,
          etapes: [
            'On regroupe les \\(x\\) d\'un côté : on ' + (c2 > 0 ? 'soustrait ' : 'ajoute ') +
              Math.abs(c2) + 'x aux deux membres.',
            '\\(' + diff + 'x' + O.signeTex(b) + ' = ' + O.tex(d2) + '\\)',
            'Puis les nombres de l\'autre : on ' + (b > 0 ? 'soustrait ' : 'ajoute ') +
              Math.abs(b) + '.',
            '\\(' + diff + 'x = ' + O.tex(d2 - b) + '\\)',
            'Enfin on divise par ' + diff + ' : \\(x = \\dfrac{' + O.tex(d2 - b) + '}{' +
              diff + '} = <b>' + O.tex(x) + '</b>\\)' +
              (diff < 0 ? ' (attention au signe : on divise par un négatif)' : '')
          ],
          indices: ['Regroupe les \\(x\\) d\'un côté, les nombres de l\'autre.',
                    'Chaque opération se fait sur les deux membres à la fois.'],
          duree: 90
        };
      }

      /* --- palier 4 : avec des parenthèses, et une solution fractionnaire - */
      var k = rnd.entier(2, 5);
      var m = rnd.entierNonNul(-6, 6);
      var p = rnd.entierNonNul(-9, 9);
      // k(x + m) = p  →  x = p/k − m
      var sol = p / k - m;
      var formes = O.fracFormes(p - k * m, k);
      return {
        enonce: 'Résous cette équation. Donne la valeur <strong>exacte</strong> ' +
                '(une fraction si besoin).',
        tex: k + '(x' + O.signeTex(m) + ') = ' + p,
        type: 'nombre', reponse: sol,
        etapes: [
          'On développe le membre de gauche : \\(' + k + 'x' + O.signeTex(k * m) +
            ' = ' + p + '\\)',
          'On ' + (k * m > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(k * m) +
            ' aux deux membres : \\(' + k + 'x = ' + O.tex(p - k * m) + '\\)',
          'On divise par ' + k + ' : \\(x = ' + O.fracTex(p - k * m, k) + '\\)' +
            (formes.length > 1 && formes[formes.length - 1].indexOf(',') >= 0
              ? ' , c\'est-à-dire ' + formes[formes.length - 1] : ''),
          'Solution : <b>' + O.fracTxt(p - k * m, k) + '</b>'
        ],
        indices: ['Développe d\'abord la parenthèse.',
                  'Tu peux aussi diviser les deux membres par ' + k + ' dès le départ.'],
        duree: 110
      };
    }
  });
})();
