/*
 * ensembles-nombres — à quel ensemble appartient ce nombre ? (leçon 2nde du
 * même nom).
 *
 * Toute la difficulté du chapitre tient en une phrase : c'est le NOMBRE qui
 * appartient à un ensemble, pas la façon de l'écrire. D'où les « déguisements »
 * à partir du palier 3 — √16, 12/4, 7/8 — qui sont le vrai contenu de la
 * notion : √16 est un entier naturel, et 7/8 est un décimal.
 *
 * Les cinq ensembles sont rangés ℕ ⊂ ℤ ⊂ 𝔻 ⊂ ℚ ⊂ ℝ : un nombre dont le plus
 * petit ensemble est d'indice i appartient exactement aux ensembles d'indice
 * ⩾ i. Tout le reste du générateur en découle.
 */
(function () {
  'use strict';

  var ENS = [
    { cle: 'N', tex: '\\mathbb{N}', nom: 'les entiers naturels' },
    { cle: 'Z', tex: '\\mathbb{Z}', nom: 'les entiers relatifs' },
    { cle: 'D', tex: '\\mathbb{D}', nom: 'les décimaux' },
    { cle: 'Q', tex: '\\mathbb{Q}', nom: 'les rationnels' },
    { cle: 'R', tex: '\\mathbb{R}', nom: 'les réels' }
  ];
  var CARRES = [[4, 2], [9, 3], [16, 4], [25, 5], [36, 6], [49, 7], [64, 8], [81, 9]];
  var NON_CARRES = [2, 3, 5, 6, 7, 8, 10, 11, 13, 15];
  var DEN_DEC = [2, 4, 5, 8, 10, 20, 25, 40, 50];       // que des 2 et des 5
  var DEN_NON = [3, 6, 7, 9, 11, 12, 13, 14, 18, 21];   // pas seulement des 2 et des 5

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }

  /* Tire un nombre dont on connaît le plus petit ensemble (`i`), son écriture
     LaTeX et la raison — c'est cette raison qui deviendra la correction. */
  function tireNombre(rnd, palier, i) {
    var deguise = palier >= 3 && rnd.booleen(0.55);
    var n, c, d;

    if (i === 0) {                                  // ℕ
      if (deguise) {
        if (rnd.booleen(0.5)) {
          c = rnd.choix(CARRES);
          return { tex: '\\sqrt{' + c[0] + '}', i: 0,
                   pourquoi: '\\(\\sqrt{' + c[0] + '} = ' + c[1] + '\\) : c\'est un ' +
                             '<b>entier naturel</b>, même si l\'écriture ne le montre pas.' };
        }
        n = rnd.entier(2, 9); d = rnd.entier(2, 6);
        return { tex: '\\dfrac{' + (n * d) + '}{' + d + '}', i: 0,
                 pourquoi: '\\(\\dfrac{' + (n * d) + '}{' + d + '} = ' + n + '\\) : une ' +
                           'écriture fractionnaire, mais le nombre est un <b>entier ' +
                           'naturel</b>.' };
      }
      n = rnd.entier(0, 40);
      return { tex: String(n), i: 0,
               pourquoi: '\\(' + n + '\\) s\'écrit sans signe « − » et sans virgule : ' +
                         'c\'est un <b>entier naturel</b>.' };
    }

    if (i === 1) {                                  // ℤ (donc négatif entier)
      if (deguise) {
        c = rnd.choix(CARRES);
        return { tex: '-\\sqrt{' + c[0] + '}', i: 1,
                 pourquoi: '\\(-\\sqrt{' + c[0] + '} = ' + fr(-c[1]) + '\\) : un ' +
                           '<b>entier relatif</b>, négatif donc pas naturel.' };
      }
      n = rnd.entier(1, 40);
      return { tex: '-' + n, i: 1,
               pourquoi: '\\(' + fr(-n) + '\\) est entier mais <b>négatif</b> : il est ' +
                         'dans \\(\\mathbb{Z}\\), pas dans \\(\\mathbb{N}\\).' };
    }

    if (i === 2) {                                  // 𝔻 non entier
      if (deguise) {
        d = rnd.choix(DEN_DEC);
        do { n = rnd.entierNonNul(-40, 40); } while (n % d === 0);
        return { tex: '\\dfrac{' + n + '}{' + d + '}', i: 2,
                 pourquoi: '\\(\\dfrac{' + n + '}{' + d + '} = ' + fr(n / d) + '\\) : ' +
                           'l\'écriture décimale <b>s\'arrête</b>, c\'est un décimal. ' +
                           '(Le dénominateur ne contient que des 2 et des 5.)' };
      }
      var dec = rnd.entier(1, 3);
      do { n = rnd.entierNonNul(-400, 400); } while (n % Math.pow(10, dec) === 0);
      var v = n / Math.pow(10, dec);
      return { tex: fr(v).replace('−', '-').replace(',', '{,}'), i: 2,
               pourquoi: '\\(' + fr(v).replace('−', '-').replace(',', '{,}') + '\\) a un ' +
                         '<b>nombre fini</b> de chiffres après la virgule : c\'est un ' +
                         'décimal, mais pas un entier.' };
    }

    if (i === 3) {                                  // ℚ non décimal
      d = rnd.choix(DEN_NON);
      do { n = rnd.entierNonNul(-30, 30); } while (n % d === 0);
      return { tex: '\\dfrac{' + n + '}{' + d + '}', i: 3,
               pourquoi: 'Le dénominateur ' + d + ' ne contient pas que des 2 et des 5 : ' +
                         'l\'écriture décimale ne s\'arrête <b>jamais</b>. C\'est un ' +
                         'rationnel <b>non décimal</b>.' };
    }

    // ℝ non rationnel
    if (rnd.booleen(0.3)) {
      return { tex: (rnd.booleen(0.3) ? '-' : '') + '\\pi', i: 4,
               pourquoi: '\\(\\pi\\) est <b>irrationnel</b> : aucune fraction d\'entiers ' +
                         'ne lui est égale, et ses décimales ne s\'arrêtent jamais.' };
    }
    n = rnd.choix(NON_CARRES);
    return { tex: (rnd.booleen(0.25) ? '-' : '') + '\\sqrt{' + n + '}', i: 4,
             pourquoi: '\\(' + n + '\\) n\'est pas un carré parfait, donc ' +
                       '\\(\\sqrt{' + n + '}\\) est <b>irrationnel</b>.' };
  }

  MathsExos.register({
    id: 'ens-nombres',
    competence: 'ensembles',
    level: '2nde',
    titre: 'Les ensembles de nombres',
    paliers: 4,

    genere: function (rnd, palier) {
      var iMax = palier === 1 ? 2 : palier === 2 ? 3 : 4;
      var nombre = tireNombre(rnd, palier, rnd.entier(0, iMax));

      /* --- paliers 3–4 : l'appartenance à UN ensemble donné -------------- */
      /* C'est le piège le plus utile : 0,25 appartient à ℚ (car 𝔻 ⊂ ℚ), même
         si son « plus petit » ensemble est 𝔻. */
      if (palier >= 3 && rnd.booleen(0.5)) {
        var j = rnd.entier(0, 4);
        var dedans = nombre.i <= j;
        return {
          enonce: 'Vrai ou faux : \\(' + nombre.tex + ' \\in ' + ENS[j].tex + '\\) ?',
          type: 'vraifaux',
          correct: dedans ? 0 : 1,
          etapes: [
            nombre.pourquoi,
            dedans
              ? 'Son plus petit ensemble est \\(' + ENS[nombre.i].tex + '\\), et ' +
                '\\(' + ENS[nombre.i].tex + ' \\subset ' + ENS[j].tex + '\\) (ou c\'est ' +
                'le même) : il appartient donc bien à \\(' + ENS[j].tex + '\\).'
              : 'Son plus petit ensemble est \\(' + ENS[nombre.i].tex + '\\), qui ' +
                '<b>contient</b> \\(' + ENS[j].tex + '\\) sans y être inclus : le nombre ' +
                'n\'appartient donc pas à \\(' + ENS[j].tex + '\\).'
          ],
          indices: [
            'Souviens-toi de l\'emboîtement : \\(\\mathbb{N}\\subset\\mathbb{Z}\\subset' +
            '\\mathbb{D}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\).',
            'Commence par simplifier l\'écriture du nombre.'
          ],
          duree: 40
        };
      }

      /* --- le plus petit ensemble qui contient ce nombre ------------------ */
      return {
        enonce: 'Quel est le <strong>plus petit</strong> ensemble auquel appartient ' +
                'ce nombre ?',
        tex: nombre.tex,
        type: 'qcm',
        choix: ENS.map(function (e) { return '\\(' + e.tex + '\\)  ' + e.nom; }),
        correct: nombre.i,
        etapes: [
          nombre.pourquoi,
          'Le plus petit ensemble qui le contient est donc \\(' + ENS[nombre.i].tex +
          '\\) — il appartient aussi à tous les suivants.'
        ],
        indices: [
          'Écris d\'abord le nombre le plus simplement possible.',
          'Son écriture décimale s\'arrête-t-elle ? Est-il un quotient d\'entiers ?'
        ],
        duree: 40
      };
    }
  });

})();
