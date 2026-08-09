/*
 * valeur-absolue — résoudre |x − a| ⋈ r (leçon 2nde « Inéquation |x − a| ⩽ r »).
 *
 * Quatre formes, qui suivent exactement la progression de la leçon :
 *   ⩽  →  l'intervalle fermé [a − r ; a + r] ;
 *   <  →  le même, ouvert ;
 *   ⩾  →  les DEUX morceaux : ]−∞ ; a − r] ∪ [a + r ; +∞[ ;
 *   et la question retournée : « quelle inéquation a pour solution [1 ; 5] ? »,
 *   qui vérifie que centre et rayon sont compris, et pas seulement récités.
 *
 * Le piège du signe est systématiquement tiré au sort : avec a négatif,
 * l'inéquation s'écrit |x + 4| ⩽ 2, et le centre est −4, pas 4.
 */
(function () {
  'use strict';

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  // |x − a| écrit correctement : |x − 3|, |x + 4|, |x|
  function absTex(a) {
    if (a === 0) return '\\left|x\\right|';
    return '\\left|x ' + (a < 0 ? '+ ' + texNb(-a) : '- ' + texNb(a)) + '\\right|';
  }
  function absTxt(a) {
    if (a === 0) return '|x|';
    return '|x ' + (a < 0 ? '+ ' + fr(-a) : '− ' + fr(a)) + '|';
  }
  var TEX = { '⩽': '\\leqslant', '<': '<', '⩾': '\\geqslant', '>': '>' };

  MathsExos.register({
    id: 'val-abs',
    competence: 'val-abs',
    level: '2nde',
    titre: 'Inéquations avec valeur absolue',
    paliers: 4,

    genere: function (rnd, palier) {
      var a = palier === 1 ? rnd.entier(1, 6)
            : palier >= 4 && rnd.booleen(0.3) ? rnd.entier(-6, 6) + 0.5
            : rnd.entier(-6, 6);
      var r = palier >= 4 && rnd.booleen(0.3) ? rnd.entier(1, 8) / 2 : rnd.entier(1, 5);
      var rel = palier === 1 ? '⩽'
              : palier === 2 ? rnd.choix(['⩽', '<'])
              : rnd.choix(['⩽', '<', '⩾', '>']);
      var large = (rel === '⩽' || rel === '⩾');
      var dehors = (rel === '⩾' || rel === '>');
      var g = a - r, d = a + r;

      /* --- palier 3+ : la question retournée (QCM) ------------------------ */
      if (palier >= 3 && rnd.booleen(0.3)) {
        // Avec un centre nul, |x − a| et |x + a| s'écrivent pareil : le leurre
        // du signe deviendrait la bonne réponse. On décale le centre.
        if (a === 0) { a = rnd.booleen(0.5) ? 2 : -2; g = a - r; d = a + r; }
        var vrai = absTxt(a) + ' ⩽ ' + fr(r);
        var pool = [vrai];
        [absTxt(-a) + ' ⩽ ' + fr(r),                      // le signe du centre
         absTxt(a) + ' ⩽ ' + fr(2 * r),                   // rayon = amplitude
         absTxt(g) + ' ⩽ ' + fr(r),                       // centre = borne gauche
         absTxt(d) + ' ⩽ ' + fr(r),                       // centre = borne droite
         absTxt(a) + ' ⩽ ' + fr(r + 1)
        ].forEach(function (t) { if (pool.indexOf(t) < 0) pool.push(t); });
        var choix = rnd.melange(pool.slice(0, 4));
        return {
          enonce: 'Quelle inéquation a pour ensemble de solutions ' +
                  '\\([' + texNb(g) + ' ; ' + texNb(d) + ']\\) ?',
          type: 'qcm',
          choix: choix,
          correct: choix.indexOf(vrai),
          etapes: [
            'Le <b>centre</b> de l\'intervalle est \\(\\dfrac{' + texNb(g) + ' + ' +
            texNb(d) + '}{2} = ' + texNb(a) + '\\) : c\'est le nombre dont on mesure ' +
            'la distance, donc celui que l\'on <b>soustrait</b>.',
            'Le <b>rayon</b> est la moitié de la longueur : ' +
            '\\(\\dfrac{' + texNb(d) + ' - ' + texNb(g) + '}{2} = ' + texNb(r) + '\\).',
            'D\'où <b>' + vrai + '</b>.'
          ],
          indices: [
            'Le centre est le milieu de l\'intervalle, le rayon sa demi-longueur.',
            'Attention au signe : \\(|x + 4|\\) a pour centre \\(-4\\).'
          ],
          duree: 60
        };
      }

      /* --- la résolution -------------------------------------------------- */
      var morceaux, txt, chaine;
      if (!dehors) {
        morceaux = [{ a: g, b: d, oa: !large, ob: !large }];
        txt = (large ? '[' : ']') + fr(g) + ' ; ' + fr(d) + (large ? ']' : '[');
        chaine = [
          '\\(' + absTex(a) + ' ' + TEX[rel] + ' ' + texNb(r) + '\\) veut dire : la ' +
          '<b>distance</b> entre \\(x\\) et ' + fr(a) + ' est au plus ' + fr(r) + '.',
          'Une distance à 0 majorée donne un encadrement : \\(' + texNb(-r) + ' ' +
          TEX[rel] + ' x - ' + texNb(a) + ' ' + TEX[rel] + ' ' + texNb(r) + '\\).',
          'On <b>ajoute ' + fr(a) + '</b> aux trois membres (l\'ordre est conservé) : ' +
          '\\(' + texNb(g) + ' ' + TEX[rel] + ' x ' + TEX[rel] + ' ' + texNb(d) + '\\).',
          'L\'intervalle est <b>centré en ' + fr(a) + '</b>, de rayon ' + fr(r) +
          ' : <b>S = ' + txt + '</b>'
        ];
      } else {
        morceaux = [
          { a: -Infinity, b: g, oa: true, ob: !large },
          { a: d, b: Infinity, oa: !large, ob: true }
        ];
        txt = ']−∞ ; ' + fr(g) + (large ? ']' : '[') + ' ∪ ' +
              (large ? '[' : ']') + fr(d) + ' ; +∞[';
        chaine = [
          '\\(' + absTex(a) + ' ' + TEX[rel] + ' ' + texNb(r) + '\\) veut dire : la ' +
          '<b>distance</b> entre \\(x\\) et ' + fr(a) + ' est au moins ' + fr(r) + '.',
          'Cette fois \\(x\\) est <b>en dehors</b> de l\'intervalle centré en ' + fr(a) +
          ' : il y a <b>deux</b> morceaux.',
          '\\(x - ' + texNb(a) + ' ' + TEX[large ? '⩽' : '<'] + ' ' + texNb(-r) +
          '\\) ou \\(x - ' + texNb(a) + ' ' + TEX[rel] + ' ' + texNb(r) + '\\).',
          'On ajoute ' + fr(a) + ' dans les deux : <b>S = ' + txt + '</b>'
        ];
      }

      return {
        enonce: 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des ' +
                'solutions</strong>.',
        tex: absTex(a) + ' ' + TEX[rel] + ' ' + texNb(r),
        type: 'intervalle',
        reponse: txt,
        morceaux: morceaux,
        etapes: chaine,
        indices: [
          '\\(' + absTex(a) + '\\) est la <b>distance</b> entre \\(x\\) et ' + fr(a) + '.',
          dehors
            ? 'Être à une distance <b>au moins</b> ' + fr(r) + ' de ' + fr(a) + ', ' +
              'c\'est être en dehors de l\'intervalle : la réponse a deux morceaux (∪).'
            : 'Le centre est ' + fr(a) + ', le rayon ' + fr(r) + ' : ' +
              'l\'intervalle va de centre − rayon à centre + rayon.'
        ],
        duree: 75
      };
    }
  });

})();
