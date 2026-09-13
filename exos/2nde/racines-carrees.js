/*
 * racines — la racine carrée (leçon 2nde « Racine carrée : la fonction carré
 * retournée »).
 *
 * Les formes suivent la progression de la leçon :
 *   P1  √ d'un carré parfait (√49 = 7), et « lequel n'a pas de racine carrée ? »
 *       — un carré n'est jamais négatif ;
 *   P2  √(a²) pour a négatif ou décimal : c'est |a|, le signe est effacé ; et des
 *       vrai/faux sur les pièges classiques (√(a²) = a, √16 = ±4, √(9 + 16)…) ;
 *   P3  (√a)² = a, le produit √a × √b = √(ab), et la simplification √12 = 2√3 ;
 *   P4  l'encadrement de √n entre deux entiers consécutifs, √ d'un carré
 *       d'expression (√((3 − 8)²) = 5), et les solutions de x² = k — les DEUX
 *       antécédents, là où √k n'en garde qu'un.
 *
 * Tout est exact : les carrés parfaits sont énumérés, les produits √a × √b
 * sont choisis pour tomber sur un carré, la simplification demande l'écriture
 * a√b en texte libre (une valeur approchée ne peut pas passer).
 */
(function () {
  'use strict';

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function par(v) { return v < 0 ? '(' + texNb(v) + ')' : texNb(v); }   // (−7)² mais 7²
  function carre(v) { return Math.round(v * v * 100) / 100; }

  var RAPPEL = 'Rappel : \\(\\sqrt{x}\\) est le nombre <b>positif</b> dont le carré vaut ' +
               '\\(x\\), et il n\'existe que pour \\(x \\geqslant 0\\).';

  // Les entiers dont on demande le carré ou la racine, palier par palier.
  var PETITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  var GRANDS = [13, 14, 15, 20, 25, 30, 40, 50, 100];

  // √a × √b avec ab carré parfait : [a, b, √(ab)]
  var PRODUITS = [[2, 8, 4], [3, 12, 6], [5, 20, 10], [2, 18, 6], [3, 27, 9],
                  [6, 24, 12], [2, 32, 8], [5, 45, 15], [7, 28, 14], [3, 48, 12]];
  // √(k² m) = k√m, m sans facteur carré
  var SANS_CARRE = [2, 3, 5, 6, 7, 10];

  /* ======================================================================= */
  /* Les formes                                                              */
  /* ======================================================================= */

  // P1 — √ d'un carré parfait
  function racineCarreParfait(rnd, palier) {
    var n = palier === 1 ? rnd.choix(PETITS) : rnd.choix(PETITS.concat(GRANDS));
    var c = n * n;
    return {
      enonce: 'Calcule \\(\\sqrt{' + c + '}\\).',
      type: 'nombre',
      reponse: n,
      etapes: [
        'On cherche le nombre <b>positif</b> dont le carré vaut ' + c + '.',
        '\\(' + n + ' \\geqslant 0\\) et \\(' + n + '^2 = ' + c + '\\), donc ' +
        '<b>\\(\\sqrt{' + c + '} = ' + n + '\\)</b>.' +
        (n > 0 ? ' Pas \\(-' + n + '\\) : son carré vaut aussi ' + c +
                 ', mais une racine carrée n\'est jamais négative.' : '')
      ],
      indices: ['Quel nombre positif, multiplié par lui-même, donne ' + c + ' ?',
                'Repense au tableau de x² lu à l\'envers.'],
      duree: 30
    };
  }

  // P1 — lequel n'a pas de racine carrée ?
  function existe(rnd) {
    var neg = -rnd.choix([1, 4, 9, 16, 25, 2, 7, 10]);
    var pool = [fr(neg)];
    var autres = [0, 1, 4, 9, 16, 25, 2, 7, 10, 0.25, 0.5];
    while (pool.length < 4) {
      var v = rnd.choix(autres);
      if (pool.indexOf(fr(v)) < 0) pool.push(fr(v));
    }
    var choix = rnd.melange(pool);
    return {
      enonce: 'Parmi ces nombres, lequel <strong>n\'a pas</strong> de racine carrée ?',
      type: 'qcm',
      choix: choix,
      correct: choix.indexOf(fr(neg)),
      etapes: [
        'Un carré n\'est <b>jamais négatif</b> : aucun nombre, multiplié par lui-même, ' +
        'ne donne \\(' + texNb(neg) + '\\).',
        'Donc \\(\\sqrt{' + texNb(neg) + '}\\) n\'existe pas. Les trois autres sont positifs ' +
        'ou nuls : ils ont chacun une racine carrée — même \\(0\\) (\\(\\sqrt{0}=0\\)), même ' +
        'ceux qui ne sont pas des carrés parfaits (\\(\\sqrt{2}\\) existe, elle ne s\'écrit ' +
        'juste pas avec une virgule).'
      ],
      indices: ['Dans le tableau de x² retourné, quelles entrées peut-on trouver ?',
                'Un carré peut-il être négatif ?'],
      duree: 30
    };
  }

  // P2 — √(a²) pour a signé : c'est |a|
  function racineDuCarre(rnd, palier) {
    var a = palier >= 3 && rnd.booleen(0.35)
      ? rnd.choix([1.5, 2.5, 0.5, 3.5, 0.1, 1.2]) * rnd.signe()
      : rnd.entier(1, palier === 2 ? 9 : 15) * (palier === 2 || rnd.booleen(0.7) ? -1 : 1);
    var c = carre(a), r = Math.abs(a);
    var direct = rnd.booleen(0.5);
    return {
      enonce: direct
        ? 'Calcule \\(\\sqrt{' + par(a) + '^2}\\).'
        : 'On pose \\(a = ' + texNb(a) + '\\). Combien vaut \\(\\sqrt{a^2}\\) ?',
      type: 'nombre',
      reponse: r,
      etapes: [
        'D\'abord le carré : \\(' + par(a) + '^2 = ' + texNb(c) + '\\) — un carré est ' +
        'toujours positif.',
        'Puis la racine : le nombre <b>positif</b> dont le carré vaut ' + fr(c) + ' est ' +
        '\\(' + texNb(r) + '\\). Donc <b>\\(\\sqrt{' + par(a) + '^2} = ' + texNb(r) + '\\)</b>' +
        (a < 0 ? ', et non \\(' + texNb(a) + '\\)' : '') + '.',
        'C\'est la règle \\(\\sqrt{a^2} = |a|\\) : la racine carrée <b>efface le signe</b>. ' +
        'Ici \\(|' + texNb(a) + '| = ' + texNb(r) + '\\).'
      ],
      indices: ['Calcule d\'abord le carré : que devient le signe ?',
                '\\(\\sqrt{a^2} = |a|\\).'],
      duree: 40
    };
  }

  // P2 — vrai ou faux
  var AFFIRMATIONS = [
    { t: 'Pour tout nombre \\(a\\), \\(\\sqrt{a^2} = a\\).', ok: false,
      d: 'C\'est vrai seulement si \\(a \\geqslant 0\\). Pour \\(a = -3\\) : ' +
         '\\(\\sqrt{(-3)^2} = \\sqrt{9} = 3 \\neq -3\\). La bonne règle est ' +
         '\\(\\sqrt{a^2} = |a|\\).' },
    { t: 'Pour tout nombre \\(a\\), \\(\\sqrt{a^2} = |a|\\).', ok: true,
      d: 'La racine carrée efface le signe : \\(\\sqrt{(-3)^2} = 3 = |-3|\\) et ' +
         '\\(\\sqrt{3^2} = 3 = |3|\\).' },
    { t: '\\(\\sqrt{16} = \\pm 4\\).', ok: false,
      d: '\\(\\sqrt{16}\\) est <b>un seul</b> nombre, le positif : \\(\\sqrt{16} = 4\\). ' +
         'Ce sont les solutions de \\(x^2 = 16\\) qui sont \\(4\\) et \\(-4\\).' },
    { t: '\\(\\sqrt{-4} = -2\\).', ok: false,
      d: '\\((-2)^2 = 4\\), pas \\(-4\\). Aucun nombre n\'a pour carré \\(-4\\) : ' +
         '\\(\\sqrt{-4}\\) n\'existe pas.' },
    { t: '\\((\\sqrt{5})^2 = 5\\).', ok: true,
      d: '\\(\\sqrt{5}\\) est <em>par définition</em> le nombre positif dont le carré ' +
         'vaut \\(5\\).' },
    { t: '\\(\\sqrt{0} = 0\\).', ok: true,
      d: '\\(0 \\geqslant 0\\) et \\(0^2 = 0\\) : \\(0\\) est bien sa propre racine carrée.' },
    { t: '\\(\\sqrt{9 + 16} = \\sqrt{9} + \\sqrt{16}\\).', ok: false,
      d: 'À gauche \\(\\sqrt{25} = 5\\), à droite \\(3 + 4 = 7\\). La racine carrée ' +
         'd\'une somme n\'est <b>pas</b> la somme des racines.' },
    { t: '\\(\\sqrt{9 \\times 16} = \\sqrt{9} \\times \\sqrt{16}\\).', ok: true,
      d: 'À gauche \\(\\sqrt{144} = 12\\), à droite \\(3 \\times 4 = 12\\). Pour un ' +
         '<b>produit</b>, ça marche toujours : \\(\\sqrt{ab} = \\sqrt{a}\\sqrt{b}\\).' },
    { t: '\\(\\sqrt{2}\\) n\'existe pas, car \\(2\\) n\'est pas un carré parfait.', ok: false,
      d: '\\(2 \\geqslant 0\\), donc \\(\\sqrt{2}\\) existe : c\'est le nombre positif dont ' +
         'le carré vaut \\(2\\), environ \\(1{,}414\\). Il ne s\'écrit simplement pas avec ' +
         'une virgule.' },
    { t: 'Si \\(a < 0\\), alors \\(\\sqrt{a^2} = -a\\).', ok: true,
      d: 'Pour \\(a = -3\\) : \\(\\sqrt{9} = 3 = -(-3) = -a\\). Quand \\(a\\) est négatif, ' +
         '\\(|a| = -a\\), qui est positif.' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Teste l\'affirmation avec un nombre négatif, par exemple \\(-3\\).'],
      duree: 40
    };
  }

  // P3 — (√a)² = a
  function carreDeRacine(rnd) {
    var a = rnd.choix([2, 3, 5, 6, 7, 10, 11, 13, 17, 0.5, 1.5]);
    return {
      enonce: 'Calcule \\(\\left(\\sqrt{' + texNb(a) + '}\\right)^2\\).',
      type: 'nombre',
      reponse: a,
      etapes: [
        '\\(\\sqrt{' + texNb(a) + '}\\) est, <em>par définition</em>, le nombre positif dont ' +
        'le carré vaut \\(' + texNb(a) + '\\).',
        'Donc <b>\\(\\left(\\sqrt{' + texNb(a) + '}\\right)^2 = ' + texNb(a) + '\\)</b>. Pas ' +
        'besoin de connaître la valeur de \\(\\sqrt{' + texNb(a) + '}\\).'
      ],
      indices: ['Que sait-on du carré de \\(\\sqrt{' + texNb(a) + '}\\), sans calculer ?'],
      duree: 30
    };
  }

  // P3 — √a × √b = √(ab)
  function produit(rnd) {
    var p = rnd.choix(PRODUITS);
    var a = p[0], b = p[1], r = p[2];
    if (rnd.booleen(0.5)) { a = p[1]; b = p[0]; }
    return {
      enonce: 'Calcule \\(\\sqrt{' + a + '} \\times \\sqrt{' + b + '}\\).',
      type: 'nombre',
      reponse: r,
      etapes: [
        'Pour un produit, les racines se regroupent : \\(\\sqrt{' + a + '} \\times ' +
        '\\sqrt{' + b + '} = \\sqrt{' + a + ' \\times ' + b + '} = \\sqrt{' + (a * b) + '}\\).',
        '\\(' + (a * b) + '\\) est un carré parfait : \\(' + r + '^2 = ' + (a * b) + '\\). ' +
        'Donc <b>\\(\\sqrt{' + a + '} \\times \\sqrt{' + b + '} = ' + r + '\\)</b>.'
      ],
      indices: ['\\(\\sqrt{a} \\times \\sqrt{b} = \\sqrt{a \\times b}\\).',
                'Multiplie ' + a + ' par ' + b + ' : reconnais-tu un carré parfait ?'],
      duree: 45
    };
  }

  // P3 — √(k² m) = k√m
  function simplifie(rnd, palier) {
    var m = rnd.choix(SANS_CARRE);
    var k = rnd.entier(2, palier >= 4 ? 7 : 5);
    var n = k * k * m;
    var forme = k + '√' + m;
    return {
      enonce: 'Écris \\(\\sqrt{' + n + '}\\) sous la forme \\(a\\sqrt{b}\\), avec \\(b\\) ' +
              'le plus petit possible. (Écris par exemple <code>2√3</code> ou ' +
              '<code>2*rac(3)</code>.)',
      type: 'texte',
      reponse: [forme, k + '*√' + m, k + '×√' + m, k + 'x√' + m, k + '√(' + m + ')',
                k + '*√(' + m + ')', k + 'rac(' + m + ')', k + '*rac(' + m + ')',
                k + 'racine(' + m + ')', k + '*racine(' + m + ')', k + 'sqrt(' + m + ')',
                k + '*sqrt(' + m + ')', k + 'rac' + m, k + 'racine' + m, k + 'v' + m,
                k + 'V' + m],
      etapes: [
        'On cherche le plus grand carré parfait qui divise \\(' + n + '\\) : ' +
        '\\(' + n + ' = ' + (k * k) + ' \\times ' + m + '\\), et \\(' + (k * k) + ' = ' +
        k + '^2\\).',
        '\\(\\sqrt{' + n + '} = \\sqrt{' + k + '^2 \\times ' + m + '} = \\sqrt{' + k +
        '^2} \\times \\sqrt{' + m + '} = ' + k + '\\sqrt{' + m + '}\\).',
        '<b>\\(\\sqrt{' + n + '} = ' + k + '\\sqrt{' + m + '}\\)</b>, et \\(' + m + '\\) ' +
        'n\'est divisible par aucun carré parfait autre que \\(1\\) : on ne peut pas ' +
        'aller plus loin.'
      ],
      indices: ['Décompose ' + n + ' en un carré parfait fois un autre nombre.',
                n + ' = ' + (k * k) + ' × ' + m + '.'],
      duree: 60
    };
  }

  // P4 — √n entre deux entiers consécutifs
  function encadre(rnd) {
    var p = rnd.entier(2, 10);
    var n = rnd.entier(p * p + 1, (p + 1) * (p + 1) - 1);
    var bon = p + ' et ' + (p + 1);
    var pool = [bon, (p - 1) + ' et ' + p, (p + 1) + ' et ' + (p + 2),
                (n - 1) + ' et ' + (n + 1)];
    var choix = rnd.melange(pool);
    return {
      enonce: '\\(\\sqrt{' + n + '}\\) est compris entre deux entiers consécutifs. Lesquels ?',
      type: 'qcm',
      choix: choix,
      correct: choix.indexOf(bon),
      etapes: [
        'On encadre \\(' + n + '\\) par deux carrés parfaits : \\(' + (p * p) + ' < ' + n +
        ' < ' + ((p + 1) * (p + 1)) + '\\), c\'est-à-dire \\(' + p + '^2 < ' + n + ' < ' +
        (p + 1) + '^2\\).',
        'La racine carrée est <b>croissante</b> : l\'ordre est conservé. ' +
        '\\(' + p + ' < \\sqrt{' + n + '} < ' + (p + 1) + '\\).',
        '<b>\\(\\sqrt{' + n + '}\\) est entre ' + p + ' et ' + (p + 1) + '</b> ' +
        '(\\(\\approx ' + texNb(Math.round(Math.sqrt(n) * 100) / 100) + '\\)).'
      ],
      indices: ['Quels carrés parfaits encadrent ' + n + ' ?',
                'La racine carrée conserve l\'ordre : si \\(a < b\\) alors ' +
                '\\(\\sqrt{a} < \\sqrt{b}\\).'],
      duree: 45
    };
  }

  // P4 — √ du carré d'une expression
  function expression(rnd) {
    var a = rnd.entier(1, 9), b = rnd.entier(a + 1, 12);      // a − b < 0 : le piège
    var v = a - b, r = b - a;
    var inverse = rnd.booleen(0.3);
    var e = inverse ? b + ' - ' + a : a + ' - ' + b;
    var val = inverse ? r : v;
    return {
      enonce: 'Calcule \\(\\sqrt{(' + e + ')^2}\\).',
      type: 'nombre',
      reponse: r,
      etapes: [
        'La parenthèse d\'abord : \\(' + e + ' = ' + texNb(val) + '\\).',
        'Puis \\(\\sqrt{' + par(val) + '^2} = |' + texNb(val) + '| = ' + r + '\\) : la ' +
        'racine carrée d\'un carré, c\'est la valeur absolue.',
        '<b>\\(\\sqrt{(' + e + ')^2} = ' + r + '\\)</b>' +
        (val < 0 ? ' — positif, alors que la parenthèse valait \\(' + texNb(val) + '\\).' : '.')
      ],
      indices: ['Calcule la parenthèse, puis souviens-toi que \\(\\sqrt{a^2} = |a|\\).'],
      duree: 45
    };
  }

  // P4 — les solutions de x² = k : les deux antécédents
  function equation(rnd) {
    var n = rnd.choix(PETITS.filter(function (x) { return x >= 2; }).concat([15, 20]));
    var k = n * n;
    var bon = '{−' + n + ' ; ' + n + '}';
    var pool = [bon, '{' + n + '}', '{' + k + '}', '{−' + k + ' ; ' + k + '}'];
    var choix = rnd.melange(pool);
    return {
      enonce: 'Quel est l\'ensemble des solutions de l\'équation \\(x^2 = ' + k + '\\) ?',
      type: 'qcm',
      choix: choix,
      correct: choix.indexOf(bon),
      etapes: [
        'Deux nombres ont pour carré \\(' + k + '\\) : \\(' + n + '\\) et \\(-' + n +
        '\\), puisque \\(' + n + '^2 = (-' + n + ')^2 = ' + k + '\\).',
        'Ne pas confondre avec \\(\\sqrt{' + k + '}\\), qui ne désigne que le positif, ' +
        '\\(' + n + '\\).',
        '<b>\\(S = \\{-' + n + '\\,;\\ ' + n + '\\}\\)</b>.'
      ],
      indices: ['Dans le tableau de x², combien de x ont pour image ' + k + ' ?',
                'Pense aux deux signes.'],
      duree: 45
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'racines',
    competence: 'racines',
    level: '2nde',
    titre: 'Racines carrées',
    paliers: 4,

    genere: function (rnd, palier) {
      var f;
      if (palier === 1) {
        f = rnd.booleen(0.7) ? racineCarreParfait : existe;
      } else if (palier === 2) {
        f = rnd.choix([racineDuCarre, racineDuCarre, vraiFaux, racineCarreParfait]);
      } else if (palier === 3) {
        f = rnd.choix([carreDeRacine, produit, simplifie, racineDuCarre, vraiFaux]);
      } else {
        f = rnd.choix([encadre, expression, equation, simplifie, produit, vraiFaux]);
      }
      return f(rnd, palier);
    }
  });

})();
