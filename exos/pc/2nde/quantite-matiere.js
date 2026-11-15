/*
 * pc-quantite-matiere — la mole, la constante d'Avogadro, la masse molaire
 * et la relation n = m ÷ M (leçon 2nde « La quantité de matière »).
 *
 * Les formes suivent les trois volets de la leçon :
 *   P1  la mole : passer du nombre d'entités à la quantité de matière
 *       (n = N ÷ N_A), choisir le nombre d'entités d'un échantillon
 *       (N = n × N_A, en QCM : le résultat s'écrit en puissances de dix), et
 *       des vrai/faux sur ce qu'est une mole ;
 *   P2  la masse molaire : celle d'une molécule (somme des masses molaires
 *       atomiques), celle d'un ion (celle de l'atome), et M = m_entité × N_A ;
 *   P3  la relation : n = m ÷ M et m = n × M, la masse molaire étant donnée ;
 *   P4  les enchaînements : masse → nombre d'entités, nombre d'entités →
 *       masse, masse molaire à calculer d'abord, et l'espèce à identifier par
 *       sa masse molaire (M = m ÷ n).
 *
 * Les masses sont toujours construites comme n × M à partir de quantités de
 * matière simples : les divisions tombent juste. L'écriture scientifique a
 * trois chiffres significatifs, avec N_A = 6,02 × 10²³ mol⁻¹. Tout est écrit
 * en texte (pas de LaTeX), comme les autres générateurs de physique-chimie.
 */
(function () {
  'use strict';

  var NA = 6.02e23;
  var AT = { H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, S: 32.1, Cl: 35.5, Fe: 55.8, Cu: 63.5, Zn: 65.4, Al: 27.0, Mg: 24.3, Ca: 40.1, K: 39.1 };
  var INDICE = { '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '12': '₁₂' };
  function esp(type, nom, noms, du, comp, f) {
    var M = Math.round(comp.reduce(function (s, c) { return s + AT[c[0]] * c[1]; }, 0) * 10) / 10;
    return { type: type, nom: nom, noms: noms, du: du, comp: comp, M: M,
             f: f || comp.map(function (c) { return c[0] + (c[1] > 1 ? INDICE[c[1]] : ''); }).join('') };
  }
  var ATOMES = [
    esp('atome', 'atome de fer', 'atomes de fer', 'de fer', [['Fe', 1]]), esp('atome', 'atome de cuivre', 'atomes de cuivre', 'de cuivre', [['Cu', 1]]),
    esp('atome', 'atome de carbone', 'atomes de carbone', 'de carbone', [['C', 1]]), esp('atome', 'atome d\'aluminium', 'atomes d\'aluminium', 'd\'aluminium', [['Al', 1]]),
    esp('atome', 'atome de zinc', 'atomes de zinc', 'de zinc', [['Zn', 1]]), esp('atome', 'atome de magnésium', 'atomes de magnésium', 'de magnésium', [['Mg', 1]])
  ];
  var IONS = [
    esp('ion', 'ion sodium', 'ions sodium', 'd\'ions sodium', [['Na', 1]], 'Na⁺'), esp('ion', 'ion chlorure', 'ions chlorure', 'd\'ions chlorure', [['Cl', 1]], 'Cl⁻'),
    esp('ion', 'ion cuivre(II)', 'ions cuivre(II)', 'd\'ions cuivre(II)', [['Cu', 1]], 'Cu²⁺'), esp('ion', 'ion calcium', 'ions calcium', 'd\'ions calcium', [['Ca', 1]], 'Ca²⁺'),
    esp('ion', 'ion potassium', 'ions potassium', 'd\'ions potassium', [['K', 1]], 'K⁺')
  ];
  var MOLECULES = [
    esp('molécule', 'molécule d\'eau', 'molécules d\'eau', 'd\'eau', [['H', 2], ['O', 1]]),
    esp('molécule', 'molécule de dioxyde de carbone', 'molécules de dioxyde de carbone', 'de dioxyde de carbone', [['C', 1], ['O', 2]]),
    esp('molécule', 'molécule de dioxygène', 'molécules de dioxygène', 'de dioxygène', [['O', 2]]),
    esp('molécule', 'molécule de diazote', 'molécules de diazote', 'de diazote', [['N', 2]]),
    esp('molécule', 'molécule de méthane', 'molécules de méthane', 'de méthane', [['C', 1], ['H', 4]]),
    esp('molécule', 'molécule d\'ammoniac', 'molécules d\'ammoniac', 'd\'ammoniac', [['N', 1], ['H', 3]]),
    esp('molécule', 'molécule d\'éthanol', 'molécules d\'éthanol', 'd\'éthanol', [['C', 2], ['H', 6], ['O', 1]]),
    esp('molécule', 'molécule de glucose', 'molécules de glucose', 'de glucose', [['C', 6], ['H', 12], ['O', 6]])
  ];
  var TOUTES = ATOMES.concat(IONS).concat(MOLECULES);
  var QUANTITES = [0.1, 0.2, 0.25, 0.5, 1.5, 2, 3, 4, 5, 0.05, 2.5];

  /* --- Les écritures ---------------------------------------------------- */
  var EXP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function arr(v, dec) { var k = Math.pow(10, dec === undefined ? 4 : dec); return Math.round(v * k) / k; }
  function fmt(v) { return String(arr(v)).replace('.', ',').replace('-', '−'); }
  function fix(v, dec) { return v.toFixed(dec).replace('.', ',').replace('-', '−'); }
  // l'écriture scientifique à trois chiffres significatifs : « 1,20 × 10²⁴ »
  function sci(v) {
    var e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
    if (Number(m.toFixed(2)) >= 10) { m /= 10; e++; }
    return fix(m, 2) + ' × 10' + String(e).split('').map(function (c) { return EXP[c]; }).join('');
  }
  var NA_T = sci(NA);
  function b(t) { return '<b>' + t + '</b>'; }
  function p(t) { return '<p>' + t + '</p>'; }
  // « M(H₂O) = 2 × M(H) + M(O) = 2 × 1,0 + 16,0 = 18,0 g/mol »
  function sommeMolaire(e) {
    return 'M(' + e.f + ') = ' + e.comp.map(function (c) { return (c[1] > 1 ? c[1] + ' × ' : '') + 'M(' + c[0] + ')'; }).join(' + ') + ' = ' +
           e.comp.map(function (c) { return (c[1] > 1 ? c[1] + ' × ' : '') + fix(AT[c[0]], 1); }).join(' + ') + ' = ' + b(fix(e.M, 1) + ' g/mol');
  }
  function donneesAtomiques(e) { return e.comp.map(function (c) { return 'M(' + c[0] + ') = ' + fix(AT[c[0]], 1) + ' g/mol'; }).join(' ; '); }
  // une quantité de matière dont n × M tombe sur au plus deux décimales
  function tireN(rnd, e) {
    var n;
    do { n = rnd.choix(QUANTITES); } while (Math.abs(n * e.M * 100 - Math.round(n * e.M * 100)) > 1e-6);
    return n;
  }

  /* ======================================================================= */
  /* P1 — la mole                                                            */
  /* ======================================================================= */
  function nDepuisN(rnd) {
    var e = rnd.choix(TOUTES), n = rnd.choix([0.5, 2, 3, 0.1, 5, 10, 0.2, 4]);
    return { famille: 'n-depuis-N', enonce: p('Un échantillon contient ' + b(sci(n * NA) + ' ' + e.noms) + '.') + p('Quelle est la quantité de matière correspondante ? On donne N_A = ' + NA_T + ' mol⁻¹.'),
             type: 'nombre', reponse: n, unite: 'mol',
             etapes: ['Une mole contient ' + NA_T + ' entités : la quantité de matière est le nombre de « paquets » de cette taille.',
                      'n = N ÷ N_A = ' + sci(n * NA) + ' ÷ ' + NA_T + ' = ' + b(fmt(n) + ' mol') + '.'],
             indices: ['Combien de paquets de ' + NA_T + ' ?', 'n = N ÷ N_A.'], duree: 60 };
  }
  function NDepuisn(rnd) {
    var e, n, N, choix;
    do {
      e = rnd.choix(TOUTES); n = rnd.choix([0.5, 2, 3, 0.1, 5, 0.2, 4, 1.5]); N = n * NA;
      choix = [sci(N), sci(NA / n), sci(N / 10), sci(N * 10)];
    } while (choix.some(function (c, i) { return choix.indexOf(c) !== i; }));
    var bon = choix[0]; choix = rnd.melange(choix);
    return { famille: 'N-depuis-n', enonce: p('Combien y a-t-il ' + (e.type === 'atome' ? 'd\'atomes' : e.type === 'ion' ? 'd\'ions' : 'de molécules') + ' dans ' + b(fmt(n) + ' mol ' + e.du) + ' ?') + p('On donne N_A = ' + NA_T + ' mol⁻¹.'),
             type: 'qcm', choix: choix, correct: choix.indexOf(bon),
             etapes: ['Chaque mole contient ' + NA_T + ' entités, quelle que soit l\'espèce.',
                      'N = n × N_A = ' + fmt(n) + ' × ' + NA_T + ' = ' + b(bon + ' ' + e.noms) + '.'],
             indices: ['N = n × N_A.', 'On multiplie ' + fmt(n) + ' par 6,02, puis on ajuste la puissance de dix.'], duree: 70 };
  }
  var NOTIONS = [
    { q: 'une mole d\'atomes de fer et une mole de molécules d\'eau contiennent le même nombre d\'entités', vrai: true, d: 'Une mole, c\'est toujours ' + NA_T + ' entités, quelle que soit l\'espèce.' },
    { q: 'une mole d\'atomes de fer et une mole de molécules d\'eau ont la même masse', vrai: false, d: 'Elles contiennent le même nombre d\'entités, mais ces entités n\'ont pas la même masse : 55,8 g pour le fer, 18,0 g pour l\'eau.' },
    { q: 'la constante d\'Avogadro s\'exprime en mol⁻¹', vrai: true, d: 'C\'est un nombre d\'entités <em>par mole</em> : N_A = ' + NA_T + ' mol⁻¹.' },
    { q: 'la quantité de matière s\'exprime en grammes', vrai: false, d: 'La quantité de matière n s\'exprime en moles (mol). C\'est la masse m qui s\'exprime en grammes.' },
    { q: 'la masse molaire s\'exprime en g/mol', vrai: true, d: 'C\'est la masse d\'une mole : des grammes par mole.' },
    { q: 'dans 2 mol d\'eau, il y a 2 molécules d\'eau', vrai: false, d: 'Il y a 2 × ' + NA_T + ' = ' + sci(2 * NA) + ' molécules : la mole est un paquet, pas une entité.' },
    { q: 'la masse molaire d\'un ion est pratiquement celle de son atome', vrai: true, d: 'La masse des électrons gagnés ou perdus est négligeable devant celle du noyau.' },
    { q: 'plus la masse molaire d\'une espèce est grande, plus une mole de cette espèce contient d\'entités', vrai: false, d: 'Une mole contient toujours ' + NA_T + ' entités. Une masse molaire plus grande veut dire des entités plus lourdes.' },
    { q: 'pour obtenir la masse molaire d\'une molécule, on additionne les masses molaires de ses atomes', vrai: true, d: 'Par exemple M(H₂O) = 2 × 1,0 + 16,0 = 18,0 g/mol.' },
    { q: 'la masse d\'un atome est de l\'ordre de 10⁻²³ g', vrai: true, d: 'Un atome de carbone pèse 1,99 × 10⁻²³ g : il en faut ' + NA_T + ' pour faire 12,0 g.' }
  ];
  function notion(rnd) {
    var v = rnd.choix(NOTIONS);
    return { famille: 'notion-vf', enonce: p('Vrai ou faux : ' + v.q + '.'), type: 'vraifaux', correct: v.vrai ? 0 : 1,
             etapes: [(v.vrai ? b('Vrai.') : b('Faux.')) + ' ' + v.d, 'À retenir : n en mol, m en g, M en g/mol, et N = n × N_A.'],
             indices: ['Une mole est un paquet de ' + NA_T + ' entités.'], duree: 40 };
  }

  /* ======================================================================= */
  /* P2 — la masse molaire                                                   */
  /* ======================================================================= */
  function masseMolaireMolecule(rnd) {
    var e = rnd.choix(MOLECULES);
    return { famille: 'M-molecule', enonce: p('Calcule la masse molaire ' + (e.du.indexOf('d\'') === 0 ? 'de l\'' + e.du.slice(2) : 'du ' + e.du.slice(3)) + ', de formule ' + b(e.f) + '.') + p('Données : ' + donneesAtomiques(e) + '.'),
             type: 'nombre', reponse: e.M, unite: 'g/mol',
             etapes: ['On additionne les masses molaires de tous les atomes de la molécule, en comptant chacun autant de fois qu\'il apparaît.', sommeMolaire(e) + '.'],
             indices: ['Compte les atomes de chaque sorte dans la formule.', 'Chaque indice multiplie la masse molaire de l\'atome qu\'il suit.'], duree: 80 };
  }
  function masseMolaireIon(rnd) {
    var e = rnd.choix(IONS), a = e.comp[0][0];
    return { famille: 'M-ion', enonce: p('La masse molaire atomique de l\'élément ' + a + ' est M(' + a + ') = ' + b(fix(e.M, 1) + ' g/mol') + '.') + p('Quelle est la masse molaire de l\'' + e.nom + ' ' + b(e.f) + ' ?'),
             type: 'nombre', reponse: e.M, unite: 'g/mol',
             etapes: ['Un ion est un atome qui a gagné ou perdu un ou plusieurs électrons.',
                      'La masse d\'un électron est négligeable devant celle de l\'atome : M(' + e.f + ') = M(' + a + ') = ' + b(fix(e.M, 1) + ' g/mol') + '.'],
             indices: ['Que pèse un électron, comparé à un atome ?'], duree: 45 };
  }
  function masseMolaireEntite(rnd) {
    var e = rnd.choix(ATOMES.concat(MOLECULES.slice(0, 4))), mE = e.M / NA;
    // la réponse est celle que donne le calcul avec la masse ARRONDIE de l'énoncé (trois chiffres
    // significatifs) : elle peut différer d'un ou deux dixièmes de la valeur du tableau périodique
    var ex = Math.floor(Math.log10(mE)), mant = Number((mE / Math.pow(10, ex)).toFixed(2));
    var rep = Math.round(mant * 6.02 * Math.pow(10, ex + 23) * 10) / 10;
    return { famille: 'M-entite', enonce: p('Un' + (e.type === 'molécule' ? 'e ' : ' ') + e.nom + ' a une masse de ' + b(sci(mE) + ' g') + '.') + p('Quelle est la masse molaire correspondante, arrondie au dixième ? On donne N_A = ' + NA_T + ' mol⁻¹.'),
             type: 'nombre', reponse: rep, tolerance: 0.15, unite: 'g/mol',
             etapes: ['La masse molaire est la masse d\'une mole, c\'est-à-dire de ' + NA_T + ' entités.',
                      'M = m × N_A = ' + sci(mE) + ' × ' + NA_T + ' ≈ ' + b(fix(rep, 1) + ' g/mol') + ' (les puissances de dix se regroupent : 10' + (ex === -23 ? '⁻²³ × 10²³ = 1' : '⁻²² × 10²³ = 10') + ').' +
                      (Math.abs(rep - e.M) > 0.05 ? ' Le tableau périodique donne ' + fix(e.M, 1) + ' g/mol : l\'écart vient de l\'arrondi de la masse.' : '')],
             indices: ['M = m(entité) × N_A.', 'Multiplie les deux nombres de devant, puis regroupe les puissances de dix.'], duree: 80 };
  }

  /* ======================================================================= */
  /* P3 — n = m ÷ M et m = n × M                                             */
  /* ======================================================================= */
  function echantillon(e) { return e.type === 'ion' ? e.du : e.du; }
  function calculerN(rnd, donnerM) {
    var e = rnd.choix(TOUTES), n = tireN(rnd, e), m = arr(n * e.M, 2);
    var et = donnerM ? [] : ['D\'abord la masse molaire : ' + sommeMolaire(e) + '.'];
    et.push('n = m ÷ M = ' + fmt(m) + ' ÷ ' + fix(e.M, 1) + ' = ' + b(fmt(n) + ' mol') + '.');
    et.push('Les unités : des g divisés par des g/mol donnent des mol.');
    return { famille: donnerM ? 'n' : 'n-M-a-calculer', enonce: p('Un échantillon contient ' + b(fmt(m) + ' g ' + echantillon(e)) + ' (' + e.f + ').') +
             p(donnerM ? 'Sa masse molaire est M = ' + fix(e.M, 1) + ' g/mol.' : 'Données : ' + donneesAtomiques(e) + '.') + p('Quelle est la quantité de matière ?'),
             type: 'nombre', reponse: n, unite: 'mol', etapes: et,
             indices: [donnerM ? 'Dans le triangle, cache n : il reste m ÷ M.' : 'Calcule d\'abord la masse molaire de ' + e.f + '.', 'n = m ÷ M.'], duree: donnerM ? 60 : 100 };
  }
  function calculerM(rnd, donnerM) {
    var e = rnd.choix(TOUTES), n = tireN(rnd, e), m = arr(n * e.M, 2);
    var et = donnerM ? [] : ['D\'abord la masse molaire : ' + sommeMolaire(e) + '.'];
    et.push('m = n × M = ' + fmt(n) + ' × ' + fix(e.M, 1) + ' = ' + b(fmt(m) + ' g') + '.');
    et.push('Les unités : des mol multipliées par des g/mol donnent des g.');
    return { famille: donnerM ? 'm' : 'm-M-a-calculer', enonce: p('On veut prélever ' + b(fmt(n) + ' mol ' + echantillon(e)) + ' (' + e.f + ').') +
             p(donnerM ? 'Sa masse molaire est M = ' + fix(e.M, 1) + ' g/mol.' : 'Données : ' + donneesAtomiques(e) + '.') + p('Quelle masse faut-il peser ?'),
             type: 'nombre', reponse: m, unite: 'g', etapes: et,
             indices: [donnerM ? 'Dans le triangle, cache m : il reste n × M.' : 'Calcule d\'abord la masse molaire de ' + e.f + '.', 'm = n × M.'], duree: donnerM ? 60 : 100 };
  }

  /* ======================================================================= */
  /* P4 — les enchaînements                                                  */
  /* ======================================================================= */
  function masseVersN(rnd) {
    var e, n, m, N, choix;
    do {
      e = rnd.choix(TOUTES); n = tireN(rnd, e); m = arr(n * e.M, 2); N = n * NA;
      choix = [sci(N), sci(m * NA), sci(NA / n), sci(N / 10)];           // juste ; m pris pour n ; division à l'envers ; puissance de dix
    } while (choix.some(function (c, i) { return choix.indexOf(c) !== i; }));
    var bon = choix[0]; choix = rnd.melange(choix);
    return { famille: 'm-vers-N', enonce: p('Combien y a-t-il ' + (e.type === 'atome' ? 'd\'atomes' : e.type === 'ion' ? 'd\'ions' : 'de molécules') + ' dans ' + b(fmt(m) + ' g ' + echantillon(e)) + ' ?') +
             p('Données : M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol ; N_A = ' + NA_T + ' mol⁻¹.'),
             type: 'qcm', choix: choix, correct: choix.indexOf(bon),
             etapes: ['On passe d\'abord par la quantité de matière : n = m ÷ M = ' + fmt(m) + ' ÷ ' + fix(e.M, 1) + ' = ' + b(fmt(n) + ' mol') + '.',
                      'Puis le nombre d\'entités : N = n × N_A = ' + fmt(n) + ' × ' + NA_T + ' = ' + b(bon + ' ' + e.noms) + '.'],
             indices: ['Deux étapes : la masse donne n, puis n donne N.', 'n = m ÷ M, puis N = n × N_A.'], duree: 110 };
  }
  function NVersMasse(rnd) {
    var e = rnd.choix(TOUTES), n = tireN(rnd, e), m = arr(n * e.M, 2);
    return { famille: 'N-vers-m', enonce: p('Un échantillon contient ' + b(sci(n * NA) + ' ' + e.noms) + '.') +
             p('Données : M(' + e.f + ') = ' + fix(e.M, 1) + ' g/mol ; N_A = ' + NA_T + ' mol⁻¹.') + p('Quelle est sa masse ?'),
             type: 'nombre', reponse: m, unite: 'g',
             etapes: ['D\'abord la quantité de matière : n = N ÷ N_A = ' + sci(n * NA) + ' ÷ ' + NA_T + ' = ' + b(fmt(n) + ' mol') + '.',
                      'Puis la masse : m = n × M = ' + fmt(n) + ' × ' + fix(e.M, 1) + ' = ' + b(fmt(m) + ' g') + '.'],
             indices: ['Deux étapes : N donne n, puis n donne m.', 'n = N ÷ N_A, puis m = n × M.'], duree: 110 };
  }
  function identifier(rnd) {
    var pool = rnd.melange(MOLECULES).slice(0, 4), e = pool[0], n = tireN(rnd, e), m = arr(n * e.M, 2), liste = rnd.melange(pool);
    return { famille: 'identifier', enonce: p(b(fmt(n) + ' mol') + ' d\'une espèce inconnue ont une masse de ' + b(fmt(m) + ' g') + '.') +
             p('Masses molaires : ' + liste.map(function (x) { return x.f + ' : ' + fix(x.M, 1) + ' g/mol'; }).join(' · ') + '.') + p('De quelle espèce s\'agit-il ?'),
             type: 'qcm', choix: liste.map(function (x) { return x.f; }), correct: liste.indexOf(e),
             etapes: ['On calcule sa masse molaire : M = m ÷ n = ' + fmt(m) + ' ÷ ' + fmt(n) + ' = ' + b(fix(e.M, 1) + ' g/mol') + '.',
                      'Dans la liste, c\'est la masse molaire de ' + b(e.f) + ', ' + e.nom.replace(/^molécule (de |d')/, 'le $1').replace('le d\'', 'l\'').replace('le de ', 'le ') + '.'],
             indices: ['Dans le triangle, cache M : il reste m ÷ n.', 'Compare le résultat aux masses molaires de la liste.'], duree: 90 };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'pc-quantite-matiere',
    competence: 'pc-quantite-matiere',
    level: '2nde',
    titre: 'La quantité de matière',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return r <= 40 ? nDepuisN(rnd) : r <= 75 ? NDepuisn(rnd) : notion(rnd);
      if (palier === 2) return r <= 50 ? masseMolaireMolecule(rnd) : r <= 70 ? masseMolaireIon(rnd) : r <= 90 ? masseMolaireEntite(rnd) : notion(rnd);
      if (palier === 3) return r <= 50 ? calculerN(rnd, true) : calculerM(rnd, true);
      return r <= 22 ? masseVersN(rnd) : r <= 44 ? NVersMasse(rnd) : r <= 62 ? calculerN(rnd, false) : r <= 80 ? calculerM(rnd, false) : identifier(rnd);
    }
  });
})();
