/*
 * relatifs — opposé, valeur absolue, addition et soustraction des nombres
 * relatifs (leçon 5ème « Nombres relatifs sur une droite »).
 *
 * La correction suit exactement le raisonnement de la leçon : on se DÉPLACE
 * sur la droite graduée, et le sens du déplacement dépend de l'opération et du
 * signe. Soustraire un nombre, c'est ajouter son opposé — la correction l'écrit
 * noir sur blanc à chaque soustraction.
 *
 * La VALEUR ABSOLUE est lue partout comme la leçon la montre : une distance à
 * 0, donc le nombre sans son signe. C'est ce qui explique qu'elle ne soit
 * jamais négative, que deux opposés aient la même, et que le plus grand de
 * deux nombres négatifs soit celui dont la valeur absolue est la plus petite.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  // |−7| : entre deux barres, en LaTeX comme au tableau.
  function absTex(v) { return '\\left|' + O.tex(v) + '\\right|'; }

  /*
   * Les questions sur la valeur absolue. Quatre formes, dans l'ordre où elles
   * deviennent utiles :
   *   0  la lire — |−7| ;
   *   1  la question retournée : quels nombres ont pour valeur absolue 6 ?
   *      (il y en a DEUX, et c'est tout l'intérêt) ;
   *   2  le vrai/faux du signe, où l'on vérifie que |−4| ne vaut pas −4 ;
   *   3  un petit calcul : les barres se comportent comme des parenthèses, on
   *      les évalue AVANT l'opération.
   */
  function valeurAbsolue(rnd, palier) {
    var forme = palier === 1 ? (rnd.booleen(0.75) ? 0 : 1)
              : rnd.entier(0, palier >= 3 ? 3 : 2);

    /* --- 0 : lire une valeur absolue ---------------------------------- */
    if (forme === 0) {
      var a = rnd.entierNonNul(-20, 20);
      var n = Math.abs(a);
      return {
        enonce: 'Calcule.',
        tex: absTex(a),
        type: 'nombre', reponse: n,
        etapes: [
          'La valeur absolue d\'un nombre, c\'est sa <b>distance à 0</b> sur la ' +
            'droite graduée.',
          O.fr(a) + ' est à ' + n + ' cran' + (n > 1 ? 's' : '') + ' de 0.',
          '\\(' + absTex(a) + ' = ' + n + '\\)' +
            (a < 0 ? ' — en pratique, on enlève le signe −.' : '')
        ],
        indices: [
          'Une valeur absolue est une distance : elle n\'est <b>jamais négative</b>.',
          'Il suffit d\'effacer le signe du nombre.'
        ],
        duree: 30
      };
    }

    /* --- 1 : la question retournée ------------------------------------ */
    if (forme === 1) {
      var m = rnd.entier(2, 15);
      var vrai = O.fr(m) + ' et ' + O.fr(-m);
      var choix = rnd.melange([
        vrai,
        O.fr(m) + ' seulement',
        O.fr(-m) + ' seulement',
        O.fr(2 * m) + ' et ' + O.fr(-2 * m)
      ]);
      return {
        enonce: 'Quels sont <b>tous</b> les nombres dont la valeur absolue vaut ' +
                O.fr(m) + ' ?',
        type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
        etapes: [
          'On cherche les nombres situés à <b>' + m + ' crans de 0</b>.',
          'Il y en a <b>deux</b> : un de chaque côté de 0.',
          '\\(' + absTex(m) + ' = ' + m + '\\) et \\(' + absTex(-m) + ' = ' + m +
            '\\) : ce sont ' + O.fr(m) + ' et ' + O.fr(-m) + ', deux nombres ' +
            '<b>opposés</b>.'
        ],
        indices: [
          'Sur la droite graduée, deux points sont à la même distance de 0.',
          'Pense à l\'opposé.'
        ],
        duree: 40
      };
    }

    /* --- 2 : le vrai/faux du signe ------------------------------------ */
    if (forme === 2) {
      var b = rnd.entierNonNul(-15, 15);
      var c = rnd.entierNonNul(-15, 15);
      // Deux valeurs absolues égales rendraient la comparaison indécidable.
      if (Math.abs(c) === Math.abs(b)) c = b + (b > 0 ? 1 : -1);
      // Chaque forme peut tomber vraie ou fausse : sinon l'élève retiendrait la
      // réponse au lieu de la règle.
      var vaut = rnd.booleen(0.5) ? Math.abs(b) : -Math.abs(b);
      var opp = rnd.booleen(0.5);
      var pool = [
        { tex: absTex(b) + ' = ' + O.tex(vaut), vrai: vaut > 0,
          quoi: vaut > 0
            ? '\\(' + absTex(b) + '\\) est la distance de ' + O.fr(b) + ' à 0, ' +
              'soit ' + Math.abs(b) + '.'
            : 'Non : une valeur absolue est une distance, elle n\'est <b>jamais ' +
              'négative</b>. \\(' + absTex(b) + ' = ' + Math.abs(b) + '\\).' },
        { tex: absTex(b) + ' = ' + absTex(opp ? -b : c), vrai: opp,
          quoi: opp
            ? 'Deux nombres <b>opposés</b> sont à la même distance de 0 : ils ont ' +
              'la même valeur absolue, ici ' + Math.abs(b) + '.'
            : 'Non : \\(' + absTex(b) + ' = ' + Math.abs(b) + '\\) mais \\(' +
              absTex(c) + ' = ' + Math.abs(c) + '\\). Seuls deux nombres ' +
              '<b>opposés</b> ont la même valeur absolue.' },
        { tex: absTex(b) + ' > ' + absTex(c), vrai: Math.abs(b) > Math.abs(c),
          quoi: '\\(' + absTex(b) + ' = ' + Math.abs(b) + '\\) et \\(' + absTex(c) +
                ' = ' + Math.abs(c) + '\\) : il reste à comparer ' + Math.abs(b) +
                ' et ' + Math.abs(c) + '.' }
      ];
      var enonce = rnd.choix(pool);
      return {
        enonce: 'Vrai ou faux ?',
        tex: enonce.tex,
        type: 'vraifaux', correct: enonce.vrai ? 0 : 1,
        etapes: [
          'On remplace chaque valeur absolue par sa valeur : c\'est la distance à 0.',
          enonce.quoi
        ],
        indices: [
          'Calcule d\'abord chaque valeur absolue.',
          'Une valeur absolue n\'est jamais négative.'
        ],
        duree: 35
      };
    }

    /* --- 3 : les barres jouent le rôle de parenthèses ------------------ */
    var p = rnd.entierNonNul(-12, 12);
    var q = rnd.entierNonNul(-12, 12);
    var plus = rnd.booleen(0.5);
    var res = plus ? Math.abs(p) + Math.abs(q) : Math.abs(p) - Math.abs(q);
    return {
      enonce: 'Calcule.',
      tex: absTex(p) + (plus ? ' + ' : ' - ') + absTex(q),
      type: 'nombre', reponse: res,
      etapes: [
        'Les barres se comportent comme des <b>parenthèses</b> : on calcule ' +
          'chaque valeur absolue <b>d\'abord</b>.',
        '\\(' + absTex(p) + ' = ' + Math.abs(p) + '\\) et \\(' + absTex(q) + ' = ' +
          Math.abs(q) + '\\).',
        'Il reste ' + Math.abs(p) + (plus ? ' + ' : ' − ') + Math.abs(q) +
          ' = <b>' + O.fr(res) + '</b>.'
      ],
      indices: [
        'Chaque valeur absolue est la distance à 0 : elle se calcule avant l\'opération.',
        plus ? 'Deux distances qu\'on ajoute : le résultat est forcément positif.'
             : 'Attention, le résultat de la soustraction, lui, peut être négatif.'
      ],
      duree: 45
    };
  }

  MathsExos.register({
    id: 'relatifs', competence: 'relatifs', level: '5eme',
    titre: 'Nombres relatifs', paliers: 4,

    genere: function (rnd, palier) {
      /* --- la valeur absolue ------------------------------------------- */
      // Au palier 1 elle occupe une question sur trois — c'est là qu'on
      // l'installe ; ensuite elle revient plus rarement, sous ses formes
      // piégeuses, pour qu'elle ne s'oublie pas.
      if (rnd.booleen(palier === 1 ? 0.34 : 0.2)) return valeurAbsolue(rnd, palier);

      /* --- palier 1 : opposé et comparaison ---------------------------- */
      if (palier === 1 && rnd.booleen(0.5)) {
        var a1 = rnd.entierNonNul(-15, 15);
        var b1 = rnd.entierNonNul(-15, 15);
        if (a1 === b1) b1 = -a1;
        return {
          enonce: 'Compare : \\(' + O.tex(a1) + '\\) est … \\(' + O.tex(b1) + '\\)',
          type: 'qcm', choix: ['plus petit que', 'plus grand que'],
          correct: a1 < b1 ? 0 : 1,
          etapes: [
            'Sur la droite graduée, « plus grand » veut dire « <b>plus à droite</b> ».',
            (a1 < 0 && b1 > 0) || (b1 < 0 && a1 > 0)
              ? 'Un nombre négatif est toujours plus petit qu\'un nombre positif.'
              : (a1 < 0
                  ? 'Attention, les deux sont négatifs : le plus grand est celui dont ' +
                    'la <b>valeur absolue</b> — sa distance à 0 — est la plus ' +
                    '<b>petite</b>. Ici \\(' + absTex(a1) + ' = ' + Math.abs(a1) +
                    '\\) et \\(' + absTex(b1) + ' = ' + Math.abs(b1) + '\\).'
                  : 'Les deux sont positifs : on compare comme d\'habitude.'),
            '\\(' + O.tex(a1) + (a1 < b1 ? ' < ' : ' > ') + O.tex(b1) + '\\)'
          ],
          indices: ['Place mentalement les deux nombres sur la droite graduée.',
                    'Le plus à droite est le plus grand.'],
          duree: 35
        };
      }

      var a = rnd.entierNonNul(-12, 12);
      var b = rnd.entierNonNul(-12, 12);
      var moins = palier >= 2 ? rnd.booleen(0.5) : false;
      var dep = moins ? -b : b;                 // le déplacement signé
      var res = a + dep;

      return {
        enonce: 'Calcule.',
        tex: O.tex(a) + (moins ? ' - ' : ' + ') +
             (b < 0 ? '(' + O.tex(b) + ')' : O.tex(b)),
        type: 'nombre', reponse: res,
        etapes: [
          moins
            ? 'Soustraire un nombre, c\'est <b>ajouter son opposé</b> : \\(' +
              O.tex(a) + ' - ' + (b < 0 ? '(' + O.tex(b) + ')' : O.tex(b)) + ' = ' +
              O.tex(a) + ' + ' + (dep < 0 ? '(' + O.tex(dep) + ')' : O.tex(dep)) + '\\)'
            : 'On part de ' + O.fr(a) + ' sur la droite graduée.',
          'On ajoute ' + O.par(dep) + ' : on se déplace de ' + Math.abs(dep) +
            ' cran' + (Math.abs(dep) > 1 ? 's' : '') + ' vers la <b>' +
            (dep > 0 ? 'droite' : 'gauche') + '</b>.',
          'On arrive à <b>' + O.fr(res) + '</b>.'
        ],
        indices: [
          moins ? 'Commence par transformer la soustraction en addition de l\'opposé.'
                : 'Ajouter un positif : vers la droite. Ajouter un négatif : vers la gauche.',
          'Pars de ' + O.fr(a) + ' et déplace-toi de ' + Math.abs(dep) + ' crans.'
        ],
        duree: 45
      };
    }
  });
})();
