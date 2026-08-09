/*
 * intervalles — passer des inégalités aux intervalles, et retour (leçon 2nde
 * « Les intervalles »).
 *
 * L'essentiel du chapitre est une traduction, dans les deux sens, plus la
 * question qui départage vraiment : une borne appartient-elle à l'intervalle ?
 * D'où les trois formes de questions, et le soin mis à tomber PILE sur une
 * borne dans le test d'appartenance — c'est là que se joue le crochet.
 */
(function () {
  'use strict';

  function fr(v) {
    if (v === -Infinity) return '−∞';
    if (v === Infinity) return '+∞';
    return String(v).replace('.', ',').replace('-', '−');
  }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function crochets(m) {
    return (m.oa ? ']' : '[') + fr(m.a) + ' ; ' + fr(m.b) + (m.ob ? '[' : ']');
  }
  // L'inégalité correspondante, en LaTeX.
  function inegTex(m) {
    if (m.a === -Infinity) return 'x ' + (m.ob ? '<' : '\\leqslant') + ' ' + texNb(m.b);
    if (m.b === Infinity) return 'x ' + (m.oa ? '>' : '\\geqslant') + ' ' + texNb(m.a);
    return texNb(m.a) + ' ' + (m.oa ? '<' : '\\leqslant') + ' x ' +
           (m.ob ? '<' : '\\leqslant') + ' ' + texNb(m.b);
  }
  function phrase(m) {
    var g = m.oa ? 'strictement supérieurs à ' : 'supérieurs ou égaux à ';
    var d = m.ob ? 'strictement inférieurs à ' : 'inférieurs ou égaux à ';
    if (m.a === -Infinity) return 'les nombres ' + d + fr(m.b);
    if (m.b === Infinity) return 'les nombres ' + g + fr(m.a);
    return 'les nombres à la fois ' + g + fr(m.a) + ' et ' + d + fr(m.b);
  }

  // Un intervalle tiré au sort : borné, ou avec une borne infinie.
  function tire(rnd, palier) {
    var infini = palier >= 2 && rnd.booleen(0.35);
    var a = rnd.entier(-8, 4);
    var b = a + rnd.entier(1, 7);
    if (palier >= 4 && rnd.booleen(0.4)) {          // des demi-entiers
      a += 0.5; b += 0.5;
    }
    var m = { a: a, b: b, oa: rnd.booleen(0.5), ob: rnd.booleen(0.5) };
    if (infini) {
      if (rnd.booleen(0.5)) { m.a = -Infinity; m.oa = true; }
      else { m.b = Infinity; m.ob = true; }
    }
    return m;
  }

  MathsExos.register({
    id: 'intervalles-ecriture',
    competence: 'intervalles',
    level: '2nde',
    titre: 'Les intervalles',
    paliers: 4,

    genere: function (rnd, palier) {
      var m = tire(rnd, palier);
      var forme = palier === 1 ? 0 : rnd.entier(0, palier >= 3 ? 2 : 1);

      /* --- 0 : de l'inégalité vers l'intervalle -------------------------- */
      if (forme === 0) {
        var depuisPhrase = palier >= 4 && rnd.booleen(0.4);
        return {
          enonce: depuisPhrase
            ? 'Écris sous forme d\'<strong>intervalle</strong> l\'ensemble de tous ' +
              phrase(m) + '.'
            : 'Écris sous forme d\'<strong>intervalle</strong> l\'ensemble des ' +
              'nombres \\(x\\) tels que :',
          tex: depuisPhrase ? null : inegTex(m),
          type: 'intervalle',
          reponse: crochets(m),
          morceaux: [m],
          etapes: [
            'La borne de gauche est ' + fr(m.a) + ', celle de droite ' + fr(m.b) + '.',
            m.a === -Infinity || m.b === Infinity
              ? 'Du côté de l\'infini, le crochet est <b>toujours ouvert</b> : ' +
                '\\(\\pm\\infty\\) n\'est pas un nombre, il ne peut pas être compris.'
              : 'Une inégalité <b>large</b> (⩽) ferme le crochet, une inégalité ' +
                '<b>stricte</b> (&lt;) l\'ouvre.',
            'D\'où <b>' + crochets(m) + '</b>.'
          ],
          indices: [
            'Le crochet est tourné <b>vers l\'intervalle</b> quand la borne est comprise.',
            'Rappel : du côté de l\'infini, le crochet reste toujours ouvert.'
          ],
          duree: 60
        };
      }

      /* --- 1 : de l'intervalle vers l'inégalité (QCM) --------------------- */
      if (forme === 1) {
        var vrai = inegTex(m);
        /* Les leurres : on retourne les crochets, puis — pour un intervalle à
           borne infinie, où un seul crochet compte et où les variantes se
           répètent — on renverse le sens et on décale la borne. On dédoublonne
           SYSTÉMATIQUEMENT : proposer deux fois la bonne réponse rendrait le
           QCM insoluble. */
        var leurres = [
          inegTex({ a: m.a, b: m.b, oa: !m.oa, ob: m.ob }),
          inegTex({ a: m.a, b: m.b, oa: m.oa, ob: !m.ob }),
          inegTex({ a: m.a, b: m.b, oa: !m.oa, ob: !m.ob })
        ];
        if (m.a === -Infinity) {
          leurres.push(inegTex({ a: m.b, b: Infinity, oa: m.ob, ob: true }));
          leurres.push(inegTex({ a: -Infinity, b: m.b + 1, oa: true, ob: m.ob }));
          leurres.push(inegTex({ a: -Infinity, b: m.b + 1, oa: true, ob: !m.ob }));
        } else if (m.b === Infinity) {
          leurres.push(inegTex({ a: -Infinity, b: m.a, oa: true, ob: m.oa }));
          leurres.push(inegTex({ a: m.a - 1, b: Infinity, oa: m.oa, ob: true }));
          leurres.push(inegTex({ a: m.a - 1, b: Infinity, oa: !m.oa, ob: true }));
        }
        var pool = [vrai];
        leurres.forEach(function (t) { if (pool.indexOf(t) < 0) pool.push(t); });
        var cles = rnd.melange(pool.slice(0, 4));
        return {
          enonce: 'Par quelles inégalités se traduit \\(x \\in ' +
                  crochets(m).replace(/−/g, '-') + '\\) ?',
          type: 'qcm',
          choix: cles.map(function (c) { return '\\(' + c + '\\)'; }),
          correct: cles.indexOf(vrai),
          etapes: [
            'Crochet <b>fermé</b> \\([\\;]\\) : la borne est comprise, l\'inégalité est ' +
            '<b>large</b> (⩽). Crochet <b>ouvert</b> \\(]\\;[\\) : elle est exclue, ' +
            'l\'inégalité est <b>stricte</b> (&lt;).',
            '\\(x \\in ' + crochets(m).replace(/−/g, '-') + '\\) équivaut donc à ' +
            '\\(' + vrai + '\\).'
          ],
          indices: ['Regarde chaque borne séparément, en commençant par la gauche.'],
          duree: 45
        };
      }

      /* --- 2 : appartenance, avec un point souvent posé SUR une borne ----- */
      var finies = [m.a, m.b].filter(isFinite);
      var x = rnd.booleen(0.55) && finies.length
        ? rnd.choix(finies)                      // pile sur une borne : le vrai test
        : rnd.entier(-9, 9) + (rnd.booleen(0.3) ? 0.5 : 0);
      var dedans = (x > m.a || (x === m.a && !m.oa)) &&
                   (x < m.b || (x === m.b && !m.ob));
      var raison;
      if (x === m.a) {
        raison = 'Le nombre tombe <b>pile sur la borne gauche</b>, et le crochet est ' +
                 (m.oa ? '<b>ouvert</b> : elle est exclue.' : '<b>fermé</b> : elle est comprise.');
      } else if (x === m.b) {
        raison = 'Le nombre tombe <b>pile sur la borne droite</b>, et le crochet est ' +
                 (m.ob ? '<b>ouvert</b> : elle est exclue.' : '<b>fermé</b> : elle est comprise.');
      } else {
        raison = dedans
          ? 'Le nombre est bien situé entre les deux bornes.'
          : 'Le nombre est <b>en dehors</b> de l\'intervalle : ' +
            (x <= m.a ? 'il est trop à gauche.' : 'il est trop à droite.');
      }
      return {
        enonce: 'Vrai ou faux : \\(' + texNb(x) + ' \\in ' +
                crochets(m).replace(/−/g, '-') + '\\) ?',
        type: 'vraifaux',
        correct: dedans ? 0 : 1,
        etapes: [
          raison,
          'En inégalités : \\(x \\in ' + crochets(m).replace(/−/g, '-') + '\\) s\'écrit ' +
          '\\(' + inegTex(m) + '\\).'
        ],
        indices: ['Écris l\'intervalle sous forme d\'inégalités, puis vérifie-les une à une.'],
        duree: 40
      };
    }
  });

})();
