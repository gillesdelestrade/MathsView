/*
 * somme-relatifs — additionner et soustraire des décimaux relatifs (leçon 5ème
 * « Additionner et soustraire des relatifs »).
 *
 * Une somme de relatifs se joue en deux temps, et l'élève qui se trompe rate
 * presque toujours le PREMIER : décider ce qu'on fait des distances à zéro, et
 * quel sera le signe. Le générateur pose donc les deux questions séparément
 * avant de les poser ensemble.
 *
 *   signe       on ne demande QUE le signe du résultat. Pas de calcul : c'est
 *               la règle des signes, isolée ;
 *   somme       le calcul complet de la somme de deux relatifs ;
 *   difference  une différence — donc l'opposé, puis la règle ;
 *   opposee     la seule réécriture : « a − b s'écrit aussi… ». On vérifie que
 *               la transformation est comprise avant de la faire calculer ;
 *   poser       la question de l'ALIGNEMENT, celle que la leçon met en avant :
 *               quand on pose 12,7 + 5,45, qu'écrit-on sous le 7 ? Les leurres
 *               sont exactement ce qu'écrit un élève qui aligne à droite ;
 *   plusieurs   une somme de quatre termes, à regrouper ;
 *   proprietes  vrai/faux sur les règles et sur les cas particuliers.
 *
 * Tous les nombres sont des ENTIERS de centièmes ; la division par 100 n'a lieu
 * qu'à l'affichage et dans la réponse attendue. Sans cela, 0,1 + 0,2 vaudrait
 * 0,30000000000000004 et l'exercice refuserait la bonne réponse.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  /* ===================================================================== */
  /* Les nombres, en centièmes                                             */
  /* ===================================================================== */
  function val(c) { return c / 100; }                 // pour la réponse attendue
  function fmt(c) { return O.fr(c / 100); }           // « −12,7 »
  function tex(c) { return O.tex(c / 100); }
  function par(c) { return '\\((' + (c < 0 ? '-' : '+') + tex(Math.abs(c)) + ')\\)'; }
  function m(s) { return '\\(' + s + '\\)'; }

  // Un décimal « qui a de l'allure » : une ou deux décimales, jamais rond.
  function tire(rnd, maxEnt, dec) {
    var e = rnd.entier(0, maxEnt || 15);
    var d = dec === 1 ? rnd.entier(1, 9) * 10 : rnd.entier(1, 99);
    if (e === 0 && d === 0) d = rnd.entier(1, 99);
    return e * 100 + d;
  }
  function signe(rnd) { return rnd.booleen(0.5) ? 1 : -1; }

  // Deux relatifs, avec ou sans le même signe, de distances à zéro distinctes.
  function couple(rnd, meme, palier) {
    var dec = palier <= 2 ? (rnd.booleen(0.5) ? 1 : 2) : 2;
    var a = tire(rnd, palier <= 2 ? 9 : 19, dec);
    var b = tire(rnd, palier <= 2 ? 9 : 12, palier <= 2 ? dec : (rnd.booleen(0.5) ? 1 : 2));
    while (a === b) b = tire(rnd, 12, 2);
    var s = signe(rnd);
    return meme ? [s * a, s * b] : [s * a, -s * b];
  }

  /* ===================================================================== */
  /* 1. Le signe du résultat, sans le calculer                             */
  /* ===================================================================== */
  function qSigne(rnd, palier) {
    var meme = rnd.booleen(0.45);
    var t = couple(rnd, meme, palier);
    var a = t[0], b = t[1], s = a + b;
    var ordre = rnd.melange([
      { cle: 'plus', txt: 'Positif' }, { cle: 'moins', txt: 'Négatif' },
      { cle: 'zero', txt: 'Nul' }
    ]);
    var bon = s > 0 ? 'plus' : s < 0 ? 'moins' : 'zero';
    var grand = Math.abs(a) >= Math.abs(b) ? a : b;

    return {
      enonce: 'Sans calculer le résultat, dis quel sera le <b>signe</b> de la somme :<br>' +
        m('A = (' + (a < 0 ? '-' : '+') + tex(Math.abs(a)) + ') + (' +
          (b < 0 ? '-' : '+') + tex(Math.abs(b)) + ')'),
      type: 'qcm',
      choix: ordre.map(function (r) { return r.txt; }),
      correct: ordre.map(function (r) { return r.cle; }).indexOf(bon),
      etapes: meme
        ? ['Les deux nombres ont le <b>même signe</b> (' + (a < 0 ? '−' : '+') + ').',
           'Quand on additionne deux nombres de même signe, on s\'éloigne encore de zéro dans ' +
             'la même direction : le résultat garde ce signe.',
           'Le résultat est donc <b>' + (a < 0 ? 'négatif' : 'positif') + '</b> (c\'est ' +
             fmt(s) + ', mais on n\'avait pas besoin de le calculer).']
        : ['Les deux nombres sont de <b>signes contraires</b> : ils tirent chacun de leur côté, ' +
             'et c\'est le plus <b>éloigné de zéro</b> qui l\'emporte.',
           'Distances à zéro : ' + fmt(Math.abs(a)) + ' et ' + fmt(Math.abs(b)) + '. La plus ' +
             'grande est <b>' + fmt(Math.abs(grand)) + '</b>, celle de ' + par(grand) + '.',
           'Le résultat prend donc le signe de ' + par(grand) + ' : il est <b>' +
             (grand < 0 ? 'négatif' : 'positif') + '</b> (c\'est ' + fmt(s) + ').'],
      indices: [
        'Mêmes signes → on garde le signe. Signes contraires → c\'est le plus loin de zéro qui ' +
          'décide.',
        'Compare les <b>distances à zéro</b> : ' + fmt(Math.abs(a)) + ' et ' + fmt(Math.abs(b)) + '.'
      ],
      duree: 35
    };
  }

  /* ===================================================================== */
  /* 2. La somme de deux relatifs                                          */
  /* ===================================================================== */
  function qSomme(rnd, palier) {
    // Au palier 1 on reste sur des signes identiques : une seule règle à la fois.
    var meme = palier === 1 ? true : rnd.booleen(0.4);
    var t = couple(rnd, meme, palier);
    var a = t[0], b = t[1], s = a + b;
    var da = Math.abs(a), db = Math.abs(b);
    var grand = da >= db ? a : b;

    return {
      enonce: 'Calcule :<br>' + m('A = (' + (a < 0 ? '-' : '+') + tex(da) + ') + (' +
        (b < 0 ? '-' : '+') + tex(db) + ')'),
      type: 'nombre', reponse: val(s),
      etapes: meme
        ? ['Les deux nombres ont le <b>même signe</b> : on <b>additionne</b> les distances à ' +
             'zéro et on garde ce signe.',
           'On pose l\'addition en alignant les <b>virgules</b> : ' +
             m(tex(da) + ' + ' + tex(db) + ' = ' + tex(da + db)) + '.',
           'On remet le signe : ' + m('A = ' + tex(s)) + '.']
        : ['Les deux nombres sont de <b>signes contraires</b> : on <b>soustrait</b> la plus ' +
             'petite distance à zéro de la plus grande.',
           'Distances à zéro : ' + fmt(da) + ' et ' + fmt(db) + '. La plus grande est <b>' +
             fmt(Math.max(da, db)) + '</b>, celle de ' + par(grand) + '.',
           'On pose la soustraction en alignant les <b>virgules</b> : ' +
             m(tex(Math.max(da, db)) + ' - ' + tex(Math.min(da, db)) + ' = ' +
               tex(Math.abs(s))) + '.',
           'On prend le signe de ' + par(grand) + ' : ' + m('A = ' + tex(s)) + '.'],
      indices: [
        'Commence par regarder les <b>signes</b> : sont-ils les mêmes ou contraires ?',
        meme ? 'Mêmes signes : on additionne les distances à zéro, et on garde le signe.'
             : 'Signes contraires : on soustrait la plus petite distance de la plus grande, et ' +
               'on garde le signe du plus éloigné de zéro.'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 3. Une différence                                                     */
  /* ===================================================================== */
  function qDifference(rnd, palier) {
    var t = couple(rnd, rnd.booleen(0.5), palier);
    var a = t[0], b = t[1], s = a - b;
    var op = -b, meme = (a > 0) === (op > 0);
    var grand = Math.abs(a) >= Math.abs(op) ? a : op;

    return {
      enonce: 'Calcule :<br>' + m('A = (' + (a < 0 ? '-' : '+') + tex(Math.abs(a)) + ') - (' +
        (b < 0 ? '-' : '+') + tex(Math.abs(b)) + ')'),
      type: 'nombre', reponse: val(s),
      etapes: [
        '<b>Soustraire, c\'est ajouter l\'opposé.</b> L\'opposé de ' + par(b) + ' est ' +
          par(op) + '.',
        'Le calcul devient ' + m('A = (' + (a < 0 ? '-' : '+') + tex(Math.abs(a)) + ') + (' +
          (op < 0 ? '-' : '+') + tex(Math.abs(op)) + ')') + '.',
        meme
          ? 'Les deux nombres ont maintenant le <b>même signe</b> : on additionne les distances ' +
            'à zéro (' + fmt(Math.abs(a)) + ' + ' + fmt(Math.abs(op)) + ' = ' +
            fmt(Math.abs(a) + Math.abs(op)) + ') et on garde ce signe.'
          : 'Les deux nombres sont de <b>signes contraires</b> : on soustrait la plus petite ' +
            'distance à zéro de la plus grande (' + fmt(Math.max(Math.abs(a), Math.abs(op))) +
            ' − ' + fmt(Math.min(Math.abs(a), Math.abs(op))) + ' = ' + fmt(Math.abs(s)) +
            ') et on prend le signe de ' + par(grand) + '.',
        m('A = ' + tex(s))
      ],
      indices: ['Ne calcule rien tant que la soustraction n\'est pas devenue une addition.',
                'L\'opposé de ' + par(b) + ', c\'est ' + par(op) + '.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 4. La réécriture : a − b = a + (−b)                                   */
  /* ===================================================================== */
  function qOpposee(rnd, palier) {
    var t = couple(rnd, rnd.booleen(0.5), palier);
    var a = t[0], b = t[1];
    function ecrit(x, y) {
      return m('(' + (x < 0 ? '-' : '+') + tex(Math.abs(x)) + ') + (' +
               (y < 0 ? '-' : '+') + tex(Math.abs(y)) + ')');
    }
    var prop = rnd.melange([
      { cle: 'bon', txt: ecrit(a, -b) },
      { cle: 'sansOpp', txt: ecrit(a, b) },        // on n'a pas changé le signe
      { cle: 'lesDeux', txt: ecrit(-a, -b) },      // on a changé les deux
      { cle: 'premier', txt: ecrit(-a, b) }        // on a changé le mauvais
    ]);

    return {
      enonce: 'Le calcul ' + m('(' + (a < 0 ? '-' : '+') + tex(Math.abs(a)) + ') - (' +
        (b < 0 ? '-' : '+') + tex(Math.abs(b)) + ')') + ' peut aussi s\'écrire… ?',
      type: 'qcm',
      choix: prop.map(function (p) { return p.txt; }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        '<b>Soustraire, c\'est ajouter l\'opposé :</b> ' + m('a - b = a + (-b)') + '.',
        'Seul le nombre qu\'on <b>retranche</b> change de signe. Ici, l\'opposé de ' + par(b) +
          ' est ' + par(-b) + '.',
        'Le premier terme, lui, ne bouge pas : il reste ' + par(a) + '.',
        'Donc le calcul s\'écrit ' + ecrit(a, -b) + '.'
      ],
      indices: ['Un seul des deux nombres change de signe. Lequel ?',
                'C\'est celui qui est <b>derrière</b> le signe −, celui qu\'on retranche.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 5. Poser l'opération : l'alignement des virgules                      */
  /* ===================================================================== */
  function qPoser(rnd, palier) {
    // Un nombre à 1 décimale et un à 2 : c'est là que l'alignement se joue.
    var a = tire(rnd, 19, 1);                     // par exemple 12,7
    var b = tire(rnd, 9, 2);
    while (b % 10 === 0) b = tire(rnd, 9, 2);     // il lui faut deux décimales
    var da = Math.floor((a % 100) / 10);          // le chiffre des dixièmes de a
    var db1 = Math.floor((b % 100) / 10);         // dixièmes de b
    var db2 = b % 10;                             // centièmes de b

    var prop = rnd.melange([
      { cle: 'bon', txt: 'Le chiffre <b>' + db1 + '</b> (les dixièmes de ' + fmt(b) + ')' },
      { cle: 'droite', txt: 'Le chiffre <b>' + db2 + '</b> (le dernier chiffre de ' + fmt(b) + ')' },
      { cle: 'rien', txt: 'Rien du tout : ' + fmt(a) + ' n\'a pas de chiffre à cet endroit' },
      { cle: 'virgule', txt: 'La virgule de ' + fmt(b) }
    ]);

    return {
      enonce: 'On veut poser l\'addition ' + m(tex(a) + ' + ' + tex(b)) + ' en colonnes.<br>' +
        'Sous le chiffre des <b>dixièmes</b> de ' + m(tex(a)) + ' (le <b>' + da + '</b>), ' +
        'qu\'écrit-on ?',
      type: 'qcm',
      choix: prop.map(function (p) { return p.txt; }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'Pour poser une addition de décimaux, on aligne les <b>virgules</b> : les unités sous ' +
          'les unités, les dixièmes sous les dixièmes, les centièmes sous les centièmes.',
        'Le chiffre des dixièmes de ' + m(tex(b)) + ' est <b>' + db1 + '</b> : c\'est lui qui ' +
          'se met sous le <b>' + da + '</b>.',
        '<b>Le piège :</b> aligner sur la droite, comme pour des entiers. On écrirait alors le ' +
          db2 + ' sous le ' + da + ', et le calcul serait faux.',
        'Comme ' + m(tex(a)) + ' n\'a pas de centièmes, on complète par un <b>zéro</b> : on pose ' +
          'en fait ' + m(tex(a) + '0 + ' + tex(b)) + '.'
      ],
      indices: ['Ce sont les <b>virgules</b> qu\'on aligne, pas les derniers chiffres.',
                'Dixièmes sous dixièmes : quel est le chiffre des dixièmes de ' + fmt(b) + ' ?'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 6. Plusieurs termes                                                   */
  /* ===================================================================== */
  function qPlusieurs(rnd, palier) {
    var n = palier >= 4 ? 4 : 3, i, t = [];
    for (i = 0; i < n; i++) t.push(signe(rnd) * tire(rnd, 9, rnd.booleen(0.5) ? 1 : 2));
    if (t.every(function (x) { return x > 0; })) t[0] = -t[0];
    if (t.every(function (x) { return x < 0; })) t[0] = -t[0];
    var s = t.reduce(function (x, y) { return x + y; }, 0);
    var pos = t.filter(function (x) { return x > 0; });
    var neg = t.filter(function (x) { return x < 0; });
    var sp = pos.reduce(function (x, y) { return x + y; }, 0);
    var sn = -neg.reduce(function (x, y) { return x + y; }, 0);

    return {
      enonce: 'Calcule :<br>' + m('A = ' + t.map(function (x) {
        return '(' + (x < 0 ? '-' : '+') + tex(Math.abs(x)) + ')';
      }).join(' + ')),
      type: 'nombre', reponse: val(s),
      etapes: [
        'Dans une somme, on peut <b>changer l\'ordre</b> des termes : on regroupe les positifs ' +
          'd\'un côté et les négatifs de l\'autre.',
        'Somme des <b>positifs</b> : ' + pos.map(function (x) { return fmt(x); }).join(' + ') +
          ' = <b>' + fmt(sp) + '</b>.',
        'Somme des <b>négatifs</b> : ' + neg.map(function (x) { return fmt(x); }).join(' + ') +
          ' = <b>' + fmt(-sn) + '</b>.',
        'Il reste ' + par(sp) + ' + ' + par(-sn) + ' : deux nombres de <b>signes contraires</b>. ' +
          'On soustrait la plus petite distance à zéro de la plus grande : ' +
          fmt(Math.max(sp, sn)) + ' − ' + fmt(Math.min(sp, sn)) + ' = ' + fmt(Math.abs(s)) + '.',
        'Le signe est celui de ' + par(sp >= sn ? sp : -sn) + ' : ' + m('A = ' + tex(s)) + '.'
      ],
      indices: ['Ne calcule pas de gauche à droite : regroupe d\'abord les positifs entre eux et ' +
                  'les négatifs entre eux.',
                'Tu obtiendras deux nombres seulement, de signes contraires.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 7. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'La somme de deux nombres <b>négatifs</b> est toujours négative.', ok: true,
      d: 'Oui : on additionne les distances à zéro et on garde le signe −. On s\'éloigne encore ' +
         'de zéro du côté des négatifs.' },
    { t: 'La somme de deux nombres de <b>signes contraires</b> est toujours négative.', ok: false,
      d: 'Non : c\'est le nombre le plus <b>éloigné de zéro</b> qui donne son signe. ' +
         '\\((-2,5) + (+9) = +6,5\\) est positif.' },
    { t: 'La somme de deux nombres <b>opposés</b> est nulle.', ok: true,
      d: 'Oui : \\((-4,3) + (+4,3) = 0\\). Ils ont la même distance à zéro et des signes ' +
         'contraires, ils s\'annulent.' },
    { t: 'Soustraire un nombre, c\'est ajouter son <b>opposé</b>.', ok: true,
      d: 'Oui : \\(a - b = a + (-b)\\). C\'est ce qui permet de ne retenir qu\'une seule règle, ' +
         'celle de l\'addition.' },
    { t: 'Ajouter un nombre <b>négatif</b>, c\'est toujours <b>diminuer</b>.', ok: true,
      d: 'Oui : \\((+5) + (-3) = +2\\), et \\((-5) + (-3) = -8\\). Dans les deux cas on a reculé.' },
    { t: 'Pour poser une addition de décimaux, on aligne les <b>derniers chiffres</b> à droite.',
      ok: false,
      d: 'Non : on aligne les <b>virgules</b>. On complète avec des zéros pour que les deux ' +
         'nombres aient autant de décimales. \\(12,7 + 5,45\\) se pose \\(12,70 + 5,45\\).' },
    { t: 'On peut changer l\'<b>ordre</b> des termes dans une somme de relatifs.', ok: true,
      d: 'Oui, et c\'est bien pratique : on regroupe les positifs entre eux et les négatifs ' +
         'entre eux.' },
    { t: 'Le résultat de \\((-3,4) - (-3,4)\\) est \\(-6,8\\).', ok: false,
      d: 'Non : soustraire \\((-3,4)\\), c\'est ajouter \\((+3,4)\\). Donc ' +
         '\\((-3,4) + (+3,4) = 0\\).' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense aux deux règles : mêmes signes → on additionne les distances ; signes ' +
                'contraires → on soustrait, et c\'est le plus loin de zéro qui donne le signe.'],
      duree: 35
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'somme-relatifs', competence: 'somme-relatifs', level: '5eme',
    titre: 'Additionner et soustraire des relatifs', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['signe', 'signe', 'somme', 'somme', 'proprietes'] :
        palier === 2 ? ['signe', 'somme', 'somme', 'poser', 'opposee', 'proprietes'] :
        palier === 3 ? ['somme', 'difference', 'difference', 'opposee', 'poser',
                        'plusieurs', 'proprietes'] :
                       ['difference', 'difference', 'plusieurs', 'plusieurs', 'somme',
                        'poser', 'proprietes']);

      if (quoi === 'signe') return qSigne(rnd, palier);
      if (quoi === 'difference') return qDifference(rnd, palier);
      if (quoi === 'opposee') return qOpposee(rnd, palier);
      if (quoi === 'poser') return qPoser(rnd, palier);
      if (quoi === 'plusieurs') return qPlusieurs(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qSomme(rnd, palier);
    }
  });

})();
