/*
 * double-distributivite — développer et réduire (ax + b)(cx + d)
 * (leçon 2nde « Double distributivité »).
 *
 * Les formes suivent la leçon :
 *   P1  (x + p)(x + q), tout positif : choisir la forme développée parmi les
 *       fautes classiques (les deux produits croisés oubliés…), ou donner un
 *       coefficient du résultat ;
 *   P2  (ax + b)(cx + d), toujours positif, avec des coefficients devant x ;
 *   P3  les signes : mêmes questions, les leurres portent les fautes de
 *       signe ; et des vrai/faux sur une égalité juste ou fautive ;
 *   P4  un calcul astucieux (103 × 98 = (100 + 3)(100 − 2)), un facteur
 *       devant le produit k(x + p)(x + q), et une différence de deux
 *       produits (x + p)(x + q) − (x + r)(x + s).
 *
 * Tout est calculé sur les coefficients entiers [A, B, C] du trinôme, jamais
 * sur du texte. La correction écrit les quatre produits, leur valeur, puis
 * la forme réduite — toujours en dernière ligne, en gras.
 */
(function () {
  'use strict';

  // « 2x^2 », « -x », « 4 »
  function mono(k, deg) {
    if (deg === 0) return String(k);
    var n = Math.abs(k);
    return (k < 0 ? '-' : '') + (n === 1 ? '' : n) + (deg === 2 ? 'x^2' : 'x');
  }
  // une somme de monômes [[k, deg], …], sans les termes nuls : « 6x^2 - 8x - 3x + 4 »
  function somme(ts) {
    var out = '';
    ts.forEach(function (t) {
      if (t[0] === 0) return;
      out += out === '' ? mono(t[0], t[1]) : (t[0] < 0 ? ' - ' : ' + ') + mono(Math.abs(t[0]), t[1]);
    });
    return out === '' ? '0' : out;
  }
  function trinome(T) { return somme([[T[0], 2], [T[1], 1], [T[2], 0]]); }
  function facteur(k, m) { return somme([[k, 1], [m, 0]]); }
  function produit(a, b, c, d) { return '(' + facteur(a, b) + ')(' + facteur(c, d) + ')'; }
  // un terme dans un produit : entre parenthèses s'il est négatif
  function fact(k, deg) { var m = mono(k, deg); return k < 0 ? '(' + m + ')' : m; }
  function developpe(a, b, c, d) { return [a * c, a * d + b * c, b * d]; }
  function gras(t) { return '<b>\\(' + t + '\\)</b>'; }

  // les trois lignes de la correction : 4 produits, leurs valeurs, la forme réduite
  function lignes(a, b, c, d) {
    var P = [[a, 1, c, 1], [a, 1, d, 0], [b, 0, c, 1], [b, 0, d, 0]];
    var T = developpe(a, b, c, d), neg = a < 0 || b < 0 || c < 0 || d < 0;
    return [
      'Chaque terme de la première parenthèse multiplie chaque terme de la seconde — <b>4 produits</b> : \\(' + produit(a, b, c, d) + ' = ' +
        P.map(function (p) { return fact(p[0], p[1]) + ' \\times ' + fact(p[2], p[3]); }).join(' + ') + '\\).',
      'On calcule chaque produit' + (neg ? ', avec la règle des signes' : '') + ' : \\(' +
        somme(P.map(function (p) { return [p[0] * p[2], p[1] + p[3]]; })) + '\\).',
      (T[1] === 0 ? 'Les deux termes en \\(x\\) s\'annulent : ' : 'On regroupe les deux termes en \\(x\\) : ') + gras(trinome(T)) + '.'
    ];
  }
  var INDICES = ['Chaque terme de la première parenthèse multiplie chaque terme de la seconde : 4 produits.',
                 'N\'oublie pas les deux produits « croisés », puis regroupe les termes en x.'];

  // les coefficients selon le palier (aucun terme nul)
  function tire(rnd, palier) {
    var a = 1, c = 1, b, d;
    function nz(lo, hi) { var v; do { v = rnd.entier(lo, hi); } while (v === 0); return v; }
    do {
      if (palier === 1) { b = rnd.entier(1, 9); d = rnd.entier(1, 9); }
      else if (palier === 2) { a = rnd.entier(1, 4); c = rnd.entier(1, 4); b = rnd.entier(1, 7); d = rnd.entier(1, 7); }
      else { a = rnd.choix([1, 1, 2, 3, -1, -2]); c = rnd.choix([1, 1, 2, 3, 4]); b = nz(-7, 7); d = nz(-7, 7); }
    } while ((palier === 2 && a === 1 && c === 1) || (palier >= 3 && a > 0 && b > 0 && d > 0) || (a === c && b === d));
    return [a, b, c, d];
  }

  /* ======================================================================= */
  /* Choisir la forme développée                                             */
  /* ======================================================================= */
  function qcm(rnd, palier) {
    var v, T, faux, textes;
    do {
      v = tire(rnd, palier);
      var a = v[0], b = v[1], c = v[2], d = v[3];
      T = developpe(a, b, c, d);
      faux = [
        [T[0], 0, T[2]],                                  // les deux produits croisés oubliés
        [T[0], a * d - b * c, T[2]],                      // un produit croisé au mauvais signe
        palier >= 3 ? [T[0], T[1], -T[2]]                 // le signe du dernier produit
                    : [T[0], T[1], b + d],                // b + d au lieu de b × d
        palier >= 3 ? [T[0], -T[1], T[2]] : [T[0], b * d, b + d]
      ];
      textes = [trinome(T)].concat(rnd.melange(faux).slice(0, 3).map(trinome));
    } while (textes.some(function (t, i) { return textes.indexOf(t) !== i; }));
    var choix = rnd.melange(textes.slice());
    return {
      enonce: 'Développe et réduis. Quelle est la bonne réponse ?',
      tex: produit(v[0], v[1], v[2], v[3]),
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(textes[0]),
      etapes: lignes(v[0], v[1], v[2], v[3]),
      indices: INDICES,
      duree: palier === 1 ? 60 : 80
    };
  }

  /* ======================================================================= */
  /* Donner un coefficient du résultat                                       */
  /* ======================================================================= */
  function coefficient(rnd, palier) {
    var v, T;
    do { v = tire(rnd, palier); T = developpe(v[0], v[1], v[2], v[3]); } while (T[1] === 0);
    var quoi = palier === 1 ? rnd.choix(['x', 'x', 'c']) : rnd.choix(['x', 'x', 'x2', 'c']);
    var nomQ = quoi === 'x' ? 'le <strong>coefficient de \\(x\\)</strong>' : quoi === 'x2' ? 'le <strong>coefficient de \\(x^2\\)</strong>' : 'le <strong>terme constant</strong> (sans \\(x\\))';
    var rep = quoi === 'x' ? T[1] : quoi === 'x2' ? T[0] : T[2];
    var et = lignes(v[0], v[1], v[2], v[3]);
    et.push((quoi === 'x' ? 'Le coefficient de \\(x\\) est ' : quoi === 'x2' ? 'Le coefficient de \\(x^2\\) est ' : 'Le terme constant est ') + gras(String(rep)) + '.');
    return {
      enonce: 'On développe et on réduit cette expression. Quel est ' + nomQ + ' dans le résultat ?',
      tex: produit(v[0], v[1], v[2], v[3]),
      type: 'nombre', reponse: rep,
      etapes: et,
      indices: INDICES,
      duree: palier === 1 ? 60 : 80
    };
  }

  /* ======================================================================= */
  /* P3 — vrai ou faux                                                       */
  /* ======================================================================= */
  function vraiFaux(rnd) {
    var v, T, faute;
    do {
      v = tire(rnd, 3); T = developpe(v[0], v[1], v[2], v[3]);
      faute = rnd.choix([null, null, 'croises', 'signe', 'somme']);
    } while (T[1] === 0 || (faute === 'somme' && v[0] * v[3] - v[1] * v[2] === T[1]));
    var montre = faute === 'croises' ? [T[0], 0, T[2]] : faute === 'signe' ? [T[0], T[1], -T[2]] : faute === 'somme' ? [T[0], v[0] * v[3] - v[1] * v[2], T[2]] : T;
    var pourquoi = faute === 'croises' ? 'Il manque les deux produits croisés.' : faute === 'signe' ? 'Le dernier produit n\'a pas le bon signe.'
                 : faute === 'somme' ? 'Un des deux produits croisés a été pris avec le mauvais signe.' : 'Les quatre produits y sont, avec les bons signes.';
    var et = lignes(v[0], v[1], v[2], v[3]);
    et.unshift((faute ? '<b>Faux.</b> ' : '<b>Vrai.</b> ') + pourquoi);
    return {
      enonce: 'Vrai ou faux ? Pour tout nombre \\(x\\) :',
      tex: produit(v[0], v[1], v[2], v[3]) + ' = ' + trinome(montre),
      type: 'vraifaux', correct: faute ? 1 : 0,
      etapes: et,
      indices: ['Développe toi-même, ou teste avec une valeur simple : x = 1.'],
      duree: 70
    };
  }

  /* ======================================================================= */
  /* P4 — calcul astucieux, facteur devant, différence de deux produits      */
  /* ======================================================================= */
  function astuce(rnd) {
    var base = rnd.choix([100, 100, 50, 20, 30]), p, q;
    do { p = rnd.entier(-4, 4); q = rnd.entier(-4, 4); } while (p === 0 || q === 0 || (p > 0 && q > 0 && base === 100 && p + q < 3));
    var x = base + p, y = base + q;
    function ecrit(k) { return base + (k < 0 ? ' - ' : ' + ') + Math.abs(k); }
    var t = [base * base, base * q, p * base, p * q];
    function nums(ts) { return ts.map(function (n, i) { return i === 0 ? String(n) : (n < 0 ? ' - ' : ' + ') + Math.abs(n); }).join(''); }
    return {
      enonce: 'Calcule <strong>de tête</strong>, en écrivant chaque nombre à partir de ' + base + '.',
      tex: x + ' \\times ' + y,
      type: 'nombre', reponse: x * y,
      etapes: [
        'On écrit \\(' + x + ' = ' + ecrit(p) + '\\) et \\(' + y + ' = ' + ecrit(q) + '\\) : \\(' + x + ' \\times ' + y + ' = (' + ecrit(p) + ')(' + ecrit(q) + ')\\).',
        'Double distributivité, 4 produits : \\(' + nums(t) + '\\).',
        'On additionne : ' + gras(String(x * y)) + '.'
      ],
      indices: ['Écris ' + x + ' = ' + ecrit(p) + ' et ' + y + ' = ' + ecrit(q) + '.', 'Puis 4 produits : ' + base + ' × ' + base + ', et les trois autres.'],
      duree: 90
    };
  }
  function facteurDevant(rnd) {
    var k, p, q, T, textes;
    do {
      k = rnd.choix([2, 3, -1, -2, 5]);
      do { p = rnd.entier(-6, 6); q = rnd.entier(-6, 6); } while (p === 0 || q === 0 || p === q || p + q === 0);
      var U = [1, p + q, p * q];
      T = U.map(function (n) { return k * n; });
      textes = [trinome(T),
                trinome([k, p + q, p * q]),               // k distribué sur le seul premier terme
                trinome([k * k, k * k * (p + q), k * k * p * q]),   // k distribué dans les deux parenthèses
                trinome([k, k * (p + q), p * q])];
    } while (textes.some(function (t, i) { return textes.indexOf(t) !== i; }));
    var choix = rnd.melange(textes.slice());
    var dev = [1, p + q, p * q];
    return {
      enonce: 'Développe et réduis. Quelle est la bonne réponse ?',
      tex: (k === -1 ? '-' : k) + produit(1, p, 1, q),
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(textes[0]),
      etapes: [
        'On développe d\'abord le produit des deux parenthèses, en gardant le résultat <b>entre parenthèses</b> : \\(' + produit(1, p, 1, q) + ' = ' + trinome(dev) + '\\).',
        'Puis on multiplie <b>chaque terme</b> par \\(' + k + '\\) : \\(' + (k === -1 ? '-' : k) + '(' + trinome(dev) + ')\\).',
        'Résultat : ' + gras(trinome(T)) + '.'
      ],
      indices: ['Développe d\'abord les deux parenthèses, et garde le résultat entre parenthèses.', 'Le facteur de devant multiplie ensuite chacun des trois termes.'],
      duree: 100
    };
  }
  function difference(rnd) {
    var p, q, r, s, U, V, T, textes;
    do {
      p = rnd.entier(-5, 6); q = rnd.entier(-5, 6); r = rnd.entier(-5, 6); s = rnd.entier(-5, 6);
      U = [1, p + q, p * q]; V = [1, r + s, r * s];
      T = [0, U[1] - V[1], U[2] - V[2]];
      textes = [trinome(T),
                trinome([0, U[1] - V[1], U[2] + V[2]]),   // le « − » n'a pas atteint le dernier terme
                trinome([0, U[1] + V[1], U[2] + V[2]]),   // le « − » oublié partout (sauf sur x²)
                trinome([2, U[1] + V[1], U[2] + V[2]])];  // une somme au lieu d'une différence
    } while (p === 0 || q === 0 || r === 0 || s === 0 || T[1] === 0 || T[2] === 0 || V[1] === 0 || V[2] === 0 || U[1] === 0 ||
             textes.some(function (t, i) { return textes.indexOf(t) !== i; }));
    var choix = rnd.melange(textes.slice());
    return {
      enonce: 'Développe et réduis. Quelle est la bonne réponse ?',
      tex: produit(1, p, 1, q) + ' - ' + produit(1, r, 1, s),
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(textes[0]),
      etapes: [
        'On développe chaque produit, en gardant le second <b>entre parenthèses</b> à cause du signe « − » : \\(' + trinome(U) + ' - (' + trinome(V) + ')\\).',
        'Le « − » devant la parenthèse change <b>tous</b> les signes : \\(' + trinome(U) +
          [[-1, 2], [-V[1], 1], [-V[2], 0]].map(function (t) { return t[0] === 0 ? '' : (t[0] < 0 ? ' - ' : ' + ') + mono(Math.abs(t[0]), t[1]); }).join('') + '\\).',
        'Les \\(x^2\\) s\'annulent ; on regroupe le reste : ' + gras(trinome(T)) + '.'
      ],
      indices: ['Développe les deux produits séparément.', 'Le « − » s\'applique à tout le second développement : garde-le entre parenthèses.'],
      duree: 110
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'double-distributivite',
    competence: 'double-distributivite',
    level: '2nde',
    titre: 'Double distributivité',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1 || palier === 2) return rnd.booleen(0.5) ? qcm(rnd, palier) : coefficient(rnd, palier);
      if (palier === 3) {
        var f3 = rnd.choix(['qcm', 'qcm', 'coef', 'coef', 'vf']);
        return f3 === 'qcm' ? qcm(rnd, 3) : f3 === 'coef' ? coefficient(rnd, 3) : vraiFaux(rnd);
      }
      var f4 = rnd.choix(['astuce', 'devant', 'difference']);
      return f4 === 'astuce' ? astuce(rnd) : f4 === 'devant' ? facteurDevant(rnd) : difference(rnd);
    }
  });
})();
