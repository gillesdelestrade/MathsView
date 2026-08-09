/*
 * encadrement-decimal — troncature, arrondi, encadrement à 10⁻ⁿ près (leçon
 * 2nde « Encadrement décimal d'un réel »).
 *
 * Deux confusions à travailler, et ce sont elles qui dictent les questions :
 *   troncature ≠ arrondi   — on coupe, ou on prend la borne la plus proche ;
 *   « décimal » ≠ « qui a des chiffres après la virgule » — 1/3 n'est pas
 *   décimal, 7/8 l'est.
 *
 * Toutes les troncatures sont calculées avec un epsilon : sans lui,
 * 2,45 × 100 vaut 244,999… en flottant, et l'exercice donnerait 2,44.
 */
(function () {
  'use strict';

  var NOMBRES = [
    { tex: '\\pi',        v: Math.PI,        dec: false, pourquoi: 'ses décimales ne s\'arrêtent jamais et ne se répètent pas (\\(\\pi\\) est irrationnel)' },
    { tex: '\\sqrt{2}',   v: Math.SQRT2,     dec: false, pourquoi: '\\(\\sqrt{2}\\) est irrationnel : son écriture décimale ne s\'arrête pas' },
    { tex: '\\sqrt{3}',   v: Math.sqrt(3),   dec: false, pourquoi: '\\(\\sqrt{3}\\) est irrationnel : son écriture décimale ne s\'arrête pas' },
    { tex: '\\dfrac{1}{3}', v: 1 / 3,        dec: false, pourquoi: '\\(\\frac13 = 0{,}333\\dots\\) : l\'écriture est périodique, elle ne s\'arrête jamais' },
    { tex: '\\dfrac{2}{3}', v: 2 / 3,        dec: false, pourquoi: '\\(\\frac23 = 0{,}666\\dots\\) : l\'écriture ne s\'arrête jamais' },
    { tex: '\\dfrac{5}{6}', v: 5 / 6,        dec: false, pourquoi: 'le dénominateur 6 contient un 3 : l\'écriture décimale ne s\'arrête pas' },
    { tex: '\\dfrac{22}{7}', v: 22 / 7,      dec: false, pourquoi: 'le dénominateur 7 n\'a que des 7 : l\'écriture décimale ne s\'arrête pas' },
    { tex: '\\dfrac{7}{8}', v: 0.875,        dec: true,  pourquoi: '\\(\\frac78 = 0{,}875\\) : le dénominateur ne contient que des 2, l\'écriture s\'arrête' },
    { tex: '\\dfrac{9}{4}', v: 2.25,         dec: true,  pourquoi: '\\(\\frac94 = 2{,}25\\) : l\'écriture décimale s\'arrête' },
    { tex: '2{,}45',      v: 2.45,           dec: true,  pourquoi: 'son écriture a un nombre fini de chiffres après la virgule' },
    { tex: '3{,}7412',    v: 3.7412,         dec: true,  pourquoi: 'son écriture a un nombre fini de chiffres après la virgule' }
  ];

  function tronc(x, n) { var k = Math.pow(10, n); return Math.floor(x * k + 1e-9) / k; }
  function arrondi(x, n) { var k = Math.pow(10, n); return Math.round(x * k) / k; }
  function fr(v, n) { return v.toFixed(n).replace('.', ','); }
  function ampli(n) { return n === 0 ? '1' : fr(Math.pow(10, -n), n); }
  function expo(n) { return n === 0 ? '10^{0}' : '10^{-' + n + '}'; }

  MathsExos.register({
    id: 'encadrement',
    competence: 'encadrement',
    level: '2nde',
    titre: 'Encadrement décimal',
    paliers: 4,

    genere: function (rnd, palier) {
      var x = palier === 1
        ? rnd.choix(NOMBRES.filter(function (m) { return m.dec; }))
        : rnd.choix(NOMBRES);
      var n = palier === 1 ? rnd.entier(1, 2)
            : palier === 2 ? rnd.entier(1, 3)
            : rnd.entier(1, 4);

      var a = tronc(x.v, n), b = a + Math.pow(10, -n);
      var ar = arrondi(x.v, n);
      var forme = palier <= 2 ? 0 : rnd.entier(0, 3);

      /* --- 0 : la troncature --------------------------------------------- */
      if (forme === 0) {
        return {
          enonce: 'Donne la <strong>troncature</strong> de \\(' + x.tex + '\\) à ' +
                  '\\(' + expo(n) + '\\) près.',
          type: 'nombre',
          reponse: a,
          etapes: [
            '\\(' + x.tex + ' = ' + fr(x.v, Math.min(n + 3, 8)) + '\\dots\\)',
            'Tronquer, c\'est <b>couper</b> après la ' + n + '<sup>e</sup> décimale, ' +
            'sans toucher aux chiffres gardés.',
            'Troncature : <b>' + fr(a, n) + '</b>'
          ],
          indices: [
            'On ne modifie aucun chiffre : on coupe, simplement.',
            'Il faut exactement ' + n + ' chiffre' + (n > 1 ? 's' : '') + ' après la virgule.'
          ],
          duree: 45
        };
      }

      /* --- 1 : l'arrondi -------------------------------------------------- */
      if (forme === 1) {
        return {
          enonce: 'Donne l\'<strong>arrondi</strong> de \\(' + x.tex + '\\) à ' +
                  '\\(' + expo(n) + '\\) près.',
          type: 'nombre',
          reponse: ar,
          etapes: [
            '\\(' + x.tex + ' = ' + fr(x.v, Math.min(n + 3, 8)) + '\\dots\\)',
            'L\'encadrement à \\(' + expo(n) + '\\) près est ' +
            '\\(' + fr(a, n) + ' \\leqslant ' + x.tex + ' < ' + fr(b, n) + '\\).',
            'L\'arrondi est celle des deux bornes dont le nombre est le <b>plus ' +
            'proche</b> : <b>' + fr(ar, n) + '</b>' +
            (Math.abs(ar - a) < 1e-12
              ? ' (la décimale suivante est inférieure à 5).'
              : ' (la décimale suivante vaut 5 ou plus : on monte).')
          ],
          indices: [
            'Regarde la décimale <b>suivante</b> : 5 ou plus, on monte ; sinon, on garde.',
            'Attention : l\'arrondi n\'est pas la troncature.'
          ],
          duree: 45
        };
      }

      /* --- 2 : l'encadrement, sous forme d'intervalle --------------------- */
      if (forme === 2) {
        return {
          enonce: 'Entre quels deux décimaux consécutifs à \\(' + expo(n) + '\\) près se ' +
                  'trouve \\(' + x.tex + '\\) ? Réponds sous la forme <strong>[a ; b]</strong>.',
          type: 'intervalle',
          reponse: '[' + fr(a, n) + ' ; ' + fr(b, n) + ']',
          morceaux: [{ a: a, b: b, oa: false, ob: false }],
          etapes: [
            '\\(' + x.tex + ' = ' + fr(x.v, Math.min(n + 3, 8)) + '\\dots\\)',
            'La borne de gauche est la <b>troncature</b> ' + fr(a, n) + ', celle de ' +
            'droite vaut troncature + \\(' + expo(n) + '\\) = ' + fr(b, n) + '.',
            'D\'où \\(' + fr(a, n) + ' \\leqslant ' + x.tex + ' < ' + fr(b, n) + '\\), ' +
            'un encadrement d\'<b>amplitude</b> ' + ampli(n) + '.'
          ],
          indices: [
            'La borne de gauche, c\'est la troncature.',
            'La borne de droite, c\'est la troncature + \\(' + expo(n) + '\\).'
          ],
          duree: 60
        };
      }

      /* --- 3 : ce nombre est-il décimal ? --------------------------------- */
      return {
        enonce: 'Vrai ou faux : \\(' + x.tex + '\\) est un <strong>nombre décimal</strong> ' +
                '(\\(' + x.tex + ' \\in \\mathbb{D}\\)) ?',
        type: 'vraifaux',
        correct: x.dec ? 0 : 1,
        etapes: [
          'Un décimal s\'écrit \\(\\frac{a}{10^{n}}\\) : autrement dit, son écriture ' +
          'décimale a un nombre <b>fini</b> de chiffres après la virgule.',
          'Ici, ' + x.pourquoi + '.',
          x.dec ? '\\(' + x.tex + '\\) est donc bien un décimal.'
                : '\\(' + x.tex + '\\) n\'est <b>pas</b> décimal — on ne peut que ' +
                  'l\'encadrer par des décimaux, d\'aussi près qu\'on veut.'
        ],
        indices: [
          'Une fraction irréductible est décimale si son dénominateur ne contient ' +
          'que des 2 et des 5.',
          'Un irrationnel n\'est jamais décimal.'
        ],
        duree: 40
      };
    }
  });

})();
