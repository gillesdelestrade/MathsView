/*
 * identites — les trois identités remarquables (leçon 3ème du même nom).
 *
 * Développer ET factoriser, parce que c'est la même identité lue dans les deux
 * sens — et que la factorisation ne s'apprend qu'en reconnaissant la forme.
 * La correction nomme toujours l'identité utilisée avant de l'appliquer.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  // Les écritures d'une même réponse que l'on accepte (² ou ^2, avec ou sans
  // espaces — la normalisation s'occupe déjà de la casse et des espaces).
  function formes(s) {
    return [s, s.replace(/²/g, '^2'), s.replace(/\s/g, ''),
            s.replace(/²/g, '^2').replace(/\s/g, '')];
  }

  MathsExos.register({
    id: 'identites', competence: 'identites', level: '3eme',
    titre: 'Identités remarquables', paliers: 4,

    genere: function (rnd, palier) {
      var a = palier === 1 ? 1 : rnd.entier(1, 5);
      var b = rnd.entier(1, 9);
      var quelle = palier === 1 ? rnd.entier(0, 1) : rnd.entier(0, 2);
      var ax = (a === 1 ? 'x' : a + 'x');
      var axTex = (a === 1 ? 'x' : a + 'x');
      var a2 = a * a;
      var carre = (a2 === 1 ? 'x²' : a2 + 'x²');
      var doubleAb = 2 * a * b;

      /* --- développer ----------------------------------------------------- */
      if (palier <= 2 || rnd.booleen(0.55)) {
        var enonceTex, rep, nom, detail;
        if (quelle === 0) {
          enonceTex = '(' + axTex + ' + ' + b + ')^2';
          rep = carre + ' + ' + doubleAb + 'x + ' + (b * b);
          nom = '\\((a+b)^2 = a^2 + 2ab + b^2\\)';
          detail = '\\(a = ' + axTex + '\\) et \\(b = ' + b + '\\) : ' +
            '\\(a^2 = ' + carre.replace('²', '^2') + '\\), ' +
            '\\(2ab = 2 \\times ' + axTex + ' \\times ' + b + ' = ' + doubleAb + 'x\\), ' +
            '\\(b^2 = ' + (b * b) + '\\).';
        } else if (quelle === 1) {
          enonceTex = '(' + axTex + ' - ' + b + ')^2';
          rep = carre + ' − ' + doubleAb + 'x + ' + (b * b);
          nom = '\\((a-b)^2 = a^2 - 2ab + b^2\\)';
          detail = 'Attention au signe du terme du milieu : il est <b>négatif</b>, ' +
            'mais \\(b^2 = ' + (b * b) + '\\) reste positif.';
        } else {
          enonceTex = '(' + axTex + ' + ' + b + ')(' + axTex + ' - ' + b + ')';
          rep = carre + ' − ' + (b * b);
          nom = '\\((a+b)(a-b) = a^2 - b^2\\)';
          detail = 'Les termes en \\(x\\) se compensent : il ne reste que la ' +
            'différence des carrés.';
        }
        return {
          enonce: 'Développe et réduis.',
          tex: enonceTex, type: 'texte', reponse: formes(rep),
          etapes: [
            'On reconnaît l\'identité ' + nom + '.',
            detail,
            'D\'où <b>' + rep + '</b>'
          ],
          indices: ['Laquelle des trois identités remarquables reconnais-tu ?',
                    'Repère \\(a\\) et \\(b\\), puis applique la formule telle quelle.'],
          duree: 70
        };
      }

      /* --- factoriser ----------------------------------------------------- */
      if (quelle === 2) {
        var expr = carre + ' - ' + (b * b);
        var res = '(' + ax + ' + ' + b + ')(' + ax + ' − ' + b + ')';
        return {
          enonce: 'Factorise.',
          tex: carre.replace('²', '^2') + ' - ' + (b * b),
          type: 'texte',
          reponse: formes(res).concat(formes('(' + ax + ' − ' + b + ')(' + ax + ' + ' + b + ')')),
          etapes: [
            'On reconnaît une <b>différence de deux carrés</b> : ' +
              '\\(a^2 - b^2 = (a+b)(a-b)\\).',
            'Ici \\(a^2 = ' + carre.replace('²', '^2') + '\\) donc \\(a = ' + ax +
              '\\), et \\(b^2 = ' + (b * b) + '\\) donc \\(b = ' + b + '\\).',
            'D\'où <b>' + res + '</b>'
          ],
          indices: ['Les deux termes sont-ils des carrés ?',
                    '\\(' + (b * b) + ' = ' + b + '^2\\) — et le premier terme ?'],
          duree: 80
        };
      }
      var plus = quelle === 0;
      var expr2 = carre + (plus ? ' + ' : ' - ') + doubleAb + 'x + ' + (b * b);
      var res2 = '(' + ax + (plus ? ' + ' : ' − ') + b + ')²';
      return {
        enonce: 'Factorise.',
        tex: carre.replace('²', '^2') + (plus ? ' + ' : ' - ') + doubleAb + 'x + ' + (b * b),
        type: 'texte', reponse: formes(res2),
        etapes: [
          'Trois termes, dont deux carrés : on pense à \\((a' + (plus ? '+' : '-') +
            'b)^2 = a^2 ' + (plus ? '+' : '-') + ' 2ab + b^2\\).',
          '\\(a^2 = ' + carre.replace('²', '^2') + '\\) donc \\(a = ' + ax +
            '\\) ; \\(b^2 = ' + (b * b) + '\\) donc \\(b = ' + b + '\\).',
          'On vérifie le terme du milieu : \\(2ab = 2 \\times ' + ax + ' \\times ' + b +
            ' = ' + doubleAb + 'x\\) — c\'est bien celui de l\'énoncé.',
          'D\'où <b>' + res2 + '</b>'
        ],
        indices: ['Repère les deux carrés, aux extrémités.',
                  'Vérifie toujours le terme du milieu : c\'est lui qui confirme.'],
        duree: 90
      };
    }
  });
})();
