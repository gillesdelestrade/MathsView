/*
 * eq-produit-nul — les équations produit nul (leçon 2nde « Équations produit
 * nul »).
 *
 * Les formes suivent la progression de la leçon :
 *   P1  (ax + b)(cx + d) = 0 avec des zéros entiers, et « lequel de ces nombres
 *       est solution ? » (on remplace, on regarde) ;
 *   P2  des zéros fractionnaires (2/3), le facteur x tout seul — x(x − 3) = 0,
 *       où « simplifier par x » perd la solution 0 —, un facteur constant
 *       3(x − 2)(x + 5) = 0 qui ne donne aucune solution, et des vrai/faux ;
 *   P3  factoriser d'abord : x² = 3x, (x − 3)² − 16 = 0 (a² − b²), et le
 *       facteur commun (x − 1)(2x + 3) + (x − 1)(x − 5) = 0 ;
 *   P4  le même zéro deux fois (S = {1}), et la lecture inverse : quelle
 *       équation a pour solutions {−1 ; 2/3} ?
 *
 * Tout part des SOLUTIONS : on les choisit, on fabrique l'équation autour, et
 * la correction écrit la règle, les deux petites équations, puis S entre
 * accolades — après avoir factorisé quand il le faut. La réponse est comparée
 * par structure (type « intervalle » : {2 ; 3} et {3 ; 2} sont le même
 * ensemble), et une réponse amputée d'une solution est fausse.
 */
(function () {
  'use strict';

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function termine(dn) { dn = Math.abs(dn); while (dn % 2 === 0) dn /= 2; while (dn % 5 === 0) dn /= 5; return dn === 1; }
  function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
  // « 2x − 4 », « −x + 3 » — en TeX (tiret ASCII) ou en texte (tiret typographique)
  function facteur(k, m, tex) {
    var moins = tex ? '-' : '−';
    var t = (k < 0 ? moins : '') + absX(k);
    if (m !== 0) t += (m < 0 ? ' ' + moins + ' ' : ' + ') + Math.abs(m);
    return t;
  }
  // un facteur entre parenthèses, sauf s'il n'a qu'un terme : x(x − 3)
  function wrap(k, m, tex) { var t = facteur(k, m, tex); return m === 0 ? t : '(' + t + ')'; }
  // le produit des deux facteurs : un facteur d'un seul terme s'écrit devant —
  // 3x(x − 2), jamais (x − 2)3x ; deux facteurs d'un seul terme, avec un ×
  function produitTex(a, b, c, d, tex) {
    if (b === 0 && d === 0) return wrap(a, b, tex) + (tex ? ' \\times ' : ' × ') + wrap(c, d, tex);
    if (d === 0) return wrap(c, d, tex) + wrap(a, b, tex);
    return wrap(a, b, tex) + wrap(c, d, tex);
  }
  // −b/a en écriture exacte : { v, txt, tex }
  function zero(a, b) {
    var n = -b, d = a;
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d); n /= g; d /= g;
    if (d === 1) return { v: n, txt: fr(n), tex: texNb(n) };
    if (termine(d)) return { v: n / d, txt: fr(n / d), tex: texNb(n / d) };
    return { v: n / d, txt: (n < 0 ? '−' : '') + Math.abs(n) + '/' + d,
             tex: (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}' };
  }
  // l'ensemble des solutions d'un produit de deux facteurs : { txt, tex, morceaux, zs }
  function solutions(a, b, c, d) {
    var z1 = zero(a, b), z2 = zero(c, d), meme = Math.abs(z1.v - z2.v) < 1e-9;
    var zs = meme ? [z1] : (z1.v < z2.v ? [z1, z2] : [z2, z1]);
    return {
      z1: z1, z2: z2, zs: zs, meme: meme,
      txt: '{' + zs.map(function (z) { return z.txt; }).join(' ; ') + '}',
      tex: '\\{' + zs.map(function (z) { return z.tex; }).join('\\,;\\ ') + '\\}',
      morceaux: zs.map(function (z) { return { a: z.v, b: z.v, oa: false, ob: false }; })
    };
  }
  var REGLE = 'Un produit est nul si, et seulement si, l\'un de ses facteurs est nul.';
  // les trois lignes de la résolution d'un produit factorisé
  function lignesProduit(a, b, c, d, S, prefixe) {
    return [
      (prefixe || '') + REGLE + ' \\(' + produitTex(a, b, c, d, true) + ' = 0 \\iff ' + facteur(a, b, true) + ' = 0' +
      '\\ \\text{ou}\\ ' + facteur(c, d, true) + ' = 0\\).',
      'Deux équations du premier degré : \\(' + facteur(a, b, true) + ' = 0 \\iff x = ' + S.z1.tex + '\\) et \\(' +
      facteur(c, d, true) + ' = 0 \\iff x = ' + S.z2.tex + '\\).' +
      (S.meme ? ' Les deux facteurs donnent la <b>même</b> valeur : une seule solution.' : ''),
      '<b>\\(S = ' + S.tex + '\\)</b>' + (b === 0 || d === 0
        ? ' — et non pas seulement ' + (b === 0 ? S.z2.txt : S.z1.txt) + ' : « simplifier par x » aurait fait perdre la solution 0.' : '')
    ];
  }
  var CONSIGNE = 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des solutions</strong>, par exemple {2 ; 3}.';
  var INDICES = [
    'Un produit est nul si et seulement si l\'un de ses facteurs est nul.',
    'Résous chaque facteur = 0 séparément, puis écris toutes les solutions entre accolades.',
    'Vérifie en remplaçant x par chaque solution : le produit doit valoir 0.'
  ];

  /* ======================================================================= */
  /* Les formes                                                              */
  /* ======================================================================= */

  // P1, P2, P4 — (ax + b)(cx + d) = 0, éventuellement avec un facteur constant devant
  function produit(rnd, palier) {
    var a, b, c, d, k = 1, x1 = rnd.entier(-6, 6), x2;
    do { x2 = rnd.entier(-6, 6); } while (x2 === x1);
    if (palier === 1) { a = rnd.choix([1, 1, 2, -1]); c = rnd.choix([1, 1, 3, -2]); b = -a * x1; d = -c * x2; }
    else if (palier === 2) {
      var forme = rnd.choix(['fraction', 'x', 'constante', 'fraction']);
      a = rnd.choix([2, 3, -2, 4]); c = rnd.choix([1, 1, 2, -1]); b = -a * x1; d = -c * x2;
      if (forme === 'fraction') { do { b = rnd.entierNonNul(-7, 7); } while (b % a === 0); }
      else if (forme === 'x') { b = 0; a = rnd.choix([1, 1, -1, 2]); if (x2 === 0) { x2 = 3; d = -c * x2; } }
      else {                                         // un facteur constant devant deux facteurs à deux termes
        k = rnd.choix([2, 3, -2, 5]); a = rnd.choix([1, 1, -1]);
        if (x1 === 0) x1 = 4; if (x2 === 0) x2 = -3;
        b = -a * x1; d = -c * x2;
      }
    } else {                                           // palier 4 : le même zéro deux fois
      if (x1 === 0) x1 = rnd.choix([-2, 2, 3]);          // (pas x × 2x : deux facteurs d'un terme)
      a = rnd.choix([1, 2, -1, 3]); c = rnd.choix([1, 2, -2, 3]); if (c === a) c = -c;
      b = -a * x1; d = -c * x1;
    }
    var S = solutions(a, b, c, d);
    var tex = (k === 1 ? '' : texNb(k)) + produitTex(a, b, c, d, true) + ' = 0';
    var etapes = lignesProduit(a, b, c, d, S, k === 1 ? '' :
      'Le facteur \\(' + k + '\\) n\'est jamais nul : il ne donne aucune solution, on peut l\'oublier (ou diviser les deux membres par ' + k + '). ');
    return {
      enonce: CONSIGNE, tex: tex,
      type: 'intervalle', reponse: S.txt, morceaux: S.morceaux,
      etapes: etapes, indices: INDICES, duree: palier === 1 ? 60 : 80
    };
  }

  // P1 — lequel de ces nombres est solution ?
  function lequel(rnd) {
    var x1 = rnd.entier(-5, 5), x2; do { x2 = rnd.entier(-5, 5); } while (x2 === x1);
    var a = rnd.choix([1, 2, -1]), c = rnd.choix([1, 1, 3]), b = -a * x1, d = -c * x2;
    var bon = rnd.booleen(0.5) ? x1 : x2, autre = bon === x1 ? x2 : x1;
    var pool = [bon];
    [-x1, -x2, x1 + x2, x1 + 1, x2 - 1, 0, 1, -1, 2, -2, x1 - 2, x2 + 2, 3, -3]
      .forEach(function (v) { if (v !== x1 && v !== x2 && pool.indexOf(v) < 0) pool.push(v); });
    var choix = rnd.melange([bon].concat(rnd.melange(pool.slice(1)).slice(0, 3)));
    function calc(x) { return '\\((' + texNb(a * x + b) + ')\\times(' + texNb(c * x + d) + ') = ' + texNb((a * x + b) * (c * x + d)) + '\\)'; }
    return {
      enonce: 'Parmi ces nombres, lequel est <strong>solution</strong> de l\'équation \\(' + produitTex(a, b, c, d, true) + ' = 0\\) ?',
      type: 'qcm', choix: choix.map(fr), correct: choix.indexOf(bon),
      etapes: [
        'Un nombre est solution s\'il rend le produit <b>nul</b> quand on le met à la place de \\(x\\).',
        'Pour \\(x = ' + texNb(bon) + '\\) : ' + calc(bon) + '. <b>' + fr(bon) + ' est solution</b> — il annule le facteur \\(' +
        (a * bon + b === 0 ? facteur(a, b, true) : facteur(c, d, true)) + '\\).',
        'Pour les autres, aucun facteur n\'est nul, donc le produit non plus : par exemple \\(x = ' + texNb(choix.filter(function (v) { return v !== bon; })[0]) +
        '\\) donne ' + calc(choix.filter(function (v) { return v !== bon; })[0]) + '.',
        'L\'autre solution de l\'équation est \\(' + texNb(autre) + '\\) : \\(S = \\{' + texNb(Math.min(x1, x2)) + '\\,;\\ ' + texNb(Math.max(x1, x2)) + '\\}\\).'
      ],
      indices: ['Remplace \\(x\\) par chaque nombre : le produit doit valoir 0.', 'Il suffit qu\'UN facteur soit nul.'],
      duree: 45
    };
  }

  // P2 — vrai ou faux
  var AFFIRMATIONS = [
    { t: 'Si \\(x(x - 3) = 0\\), alors \\(x = 3\\).', ok: false,
      d: '\\(x = 3\\) est une solution, mais \\(x = 0\\) aussi : \\(0 \\times (-3) = 0\\). « Simplifier par x » perd cette solution — on ne divise pas par ce qui peut être nul. \\(S = \\{0\\,;3\\}\\).' },
    { t: 'L\'équation \\((x - 2)(x + 5) = 0\\) a exactement deux solutions.', ok: true,
      d: 'Un produit nul a un facteur nul : \\(x = 2\\) ou \\(x = -5\\). Deux solutions, pas davantage — ailleurs, aucun facteur n\'est nul.' },
    { t: 'Pour résoudre \\((2x - 1)(x + 4) = 0\\), il faut d\'abord développer.', ok: false,
      d: 'Au contraire : développé, \\(2x^2 + 7x - 4 = 0\\) ne se résout plus. La forme <b>factorisée</b> est la bonne : \\(x = \\frac12\\) ou \\(x = -4\\).' },
    { t: 'L\'équation \\((x - 2)(x - 2) = 0\\) a une seule solution.', ok: true,
      d: 'Les deux facteurs s\'annulent pour la même valeur, \\(2\\). \\(S = \\{2\\}\\) — on n\'écrit pas deux fois le même nombre.' },
    { t: 'L\'équation \\(3(x - 1) = 0\\) a pour solutions \\(3\\) et \\(1\\).', ok: false,
      d: 'Le facteur \\(3\\) n\'est jamais nul : il ne donne aucune solution. Seul \\(x - 1 = 0\\) compte : \\(S = \\{1\\}\\).' },
    { t: 'Si \\(A \\times B = 0\\), alors \\(A = 0\\) ou \\(B = 0\\).', ok: true,
      d: 'C\'est la règle du produit nul. Si \\(A \\neq 0\\), on peut diviser par \\(A\\) et \\(B = 0\\).' },
    { t: 'Si \\(A \\times B = 6\\), alors \\(A = 6\\) ou \\(B = 6\\).', ok: false,
      d: 'La règle ne marche que pour \\(0\\) : \\(2 \\times 3 = 6\\) sans qu\'aucun facteur vaille 6. Pour résoudre \\((x - 1)(x + 2) = 6\\), il faut d\'abord se ramener à \\(= 0\\).' },
    { t: '\\(-2\\) est solution de \\((x + 2)(x - 5) = 0\\).', ok: true,
      d: 'Pour \\(x = -2\\), le premier facteur vaut \\(0\\) : \\(0 \\times (-7) = 0\\).' },
    { t: 'L\'équation \\(x^2 = 5x\\) a pour unique solution \\(5\\).', ok: false,
      d: 'On ne divise pas par \\(x\\). \\(x^2 - 5x = 0 \\iff x(x - 5) = 0 \\iff x = 0\\) ou \\(x = 5\\). \\(S = \\{0\\,;5\\}\\).' },
    { t: 'Les solutions de \\((x + 1)(3x - 2) = 0\\) sont \\(-1\\) et \\(\\dfrac{2}{3}\\).', ok: true,
      d: '\\(x + 1 = 0 \\iff x = -1\\) et \\(3x - 2 = 0 \\iff x = \\frac23\\).' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, 'Rappel : ' + REGLE + ' Et seulement pour zéro.'],
      indices: ['Teste avec un nombre précis.'],
      duree: 40
    };
  }

  // P3 — factoriser d'abord
  function factoriser(rnd) {
    var forme = rnd.choix(['x2', 'x2', 'carre', 'commun']);
    if (forme === 'x2') {
      // a x² = b x  →  x(ax − b) = 0
      var a = rnd.choix([1, 1, 2, 3]), b = rnd.entierNonNul(-6, 6) * (a === 1 ? 1 : a);
      var S = solutions(1, 0, a, -b);
      return {
        enonce: CONSIGNE, tex: (a === 1 ? '' : a) + 'x^2 = ' + facteur(b, 0, true),
        type: 'intervalle', reponse: S.txt, morceaux: S.morceaux,
        etapes: [
          'Surtout pas de division par \\(x\\) : on perdrait une solution. On ramène tout à gauche : \\(' + (a === 1 ? '' : a) + 'x^2 ' +
          (b < 0 ? '+ ' : '- ') + absX(Math.abs(b)) + ' = 0\\).',
          'On <b>factorise</b> par \\(x\\) : \\(x(' + facteur(a, -b, true) + ') = 0\\).'
        ].concat(lignesProduit(1, 0, a, -b, S)),
        indices: ['Ramène tout du même côté, puis factorise par x.'].concat(INDICES.slice(0, 2)),
        duree: 100
      };
    }
    if (forme === 'carre') {
      // (x − p)² − q² = 0  →  (x − p − q)(x − p + q) = 0
      var p = rnd.entier(-4, 4), q = rnd.entier(1, 5);
      var S2 = solutions(1, -(p + q), 1, -(p - q));
      return {
        enonce: CONSIGNE, tex: '(x ' + (p < 0 ? '+ ' + (-p) : p === 0 ? '' : '- ' + p) + ')^2 - ' + (q * q) + ' = 0',
        type: 'intervalle', reponse: S2.txt, morceaux: S2.morceaux,
        etapes: [
          'On reconnaît \\(A^2 - B^2\\) avec \\(A = ' + facteur(1, -p, true) + '\\) et \\(B = ' + q + '\\) : c\'est \\((A - B)(A + B)\\).',
          'On <b>factorise</b> : \\(' + produitTex(1, -(p + q), 1, -(p - q), true) + ' = 0\\).'
        ].concat(lignesProduit(1, -(p + q), 1, -(p - q), S2)),
        indices: ['C\'est une différence de deux carrés : a² − b² = (a − b)(a + b).'].concat(INDICES.slice(0, 2)),
        duree: 110
      };
    }
    // facteur commun : (x − r)(ax + b) + (x − r)(cx + d) = 0  →  (x − r)((a + c)x + (b + d)) = 0
    var r = rnd.entier(-4, 4), A = rnd.choix([1, 2, 3]), B = rnd.entierNonNul(-5, 5), C = rnd.choix([1, 2, -1]), D = rnd.entierNonNul(-5, 5);
    if (A + C === 0) C = 1;
    if (B + D === 0) D += 1;
    var S3 = solutions(1, -r, A + C, B + D);
    return {
      enonce: CONSIGNE, tex: wrap(1, -r, true) + wrap(A, B, true) + ' + ' + wrap(1, -r, true) + wrap(C, D, true) + ' = 0',
      type: 'intervalle', reponse: S3.txt, morceaux: S3.morceaux,
      etapes: [
        'Le facteur \\(' + facteur(1, -r, true) + '\\) est <b>commun</b> aux deux termes : on <b>factorise</b> par ce facteur. \\(' +
        wrap(1, -r, true) + '\\big[(' + facteur(A, B, true) + ') + (' + facteur(C, D, true) + ')\\big] = 0\\).',
        'On réduit le crochet : \\(' + produitTex(1, -r, A + C, B + D, true) + ' = 0\\).'
      ].concat(lignesProduit(1, -r, A + C, B + D, S3)),
      indices: ['Les deux termes ont un facteur commun : mets-le en facteur.'].concat(INDICES.slice(0, 2)),
      duree: 120
    };
  }

  // P4 — quelle équation a pour solutions S ?
  function laquelle(rnd) {
    // des zéros non nuls et non opposés : sinon le leurre « signe changé »
    // aurait les mêmes solutions que la bonne réponse
    var x1 = rnd.entierNonNul(-4, 4), x2; do { x2 = rnd.entierNonNul(-4, 4); } while (x2 === x1 || x2 === -x1);
    var a = rnd.choix([1, 1, 2]), c = rnd.choix([1, 3, -1]), b = -a * x1, d = -c * x2;
    var S = solutions(a, b, c, d);
    function eq(k1, m1, k2, m2) { return '\\(' + produitTex(k1, m1, k2, m2, true) + ' = 0\\)'; }
    var vrai = eq(a, b, c, d);
    var pool = [vrai, eq(a, -b, c, -d), eq(a, -b, c, d), eq(a, b, c, -d)];
    var choix = rnd.melange(pool);
    return {
      enonce: 'Quelle équation a pour ensemble de solutions \\(S = ' + S.tex + '\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(vrai),
      etapes: [
        'Une solution annule un facteur. Pour que \\(' + S.zs[0].tex + '\\) soit solution, il faut un facteur nul en ' + S.zs[0].txt +
        ' : \\(' + (S.zs[0].v === S.z1.v ? facteur(a, b, true) : facteur(c, d, true)) + '\\) convient — attention au signe : \\(x - 2\\) s\'annule en \\(2\\), pas en \\(-2\\).',
        'De même pour \\(' + S.zs[1].tex + '\\) : \\(' + (S.zs[1].v === S.z1.v ? facteur(a, b, true) : facteur(c, d, true)) + '\\).',
        'C\'est ' + vrai + '. Vérification : chaque solution annule bien l\'un des facteurs.'
      ],
      indices: ['Remplace x par chaque solution dans chaque équation : un facteur doit s\'annuler.', 'x − 2 s\'annule en 2, x + 2 en −2.'],
      duree: 70
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'eq-produit-nul',
    competence: 'eq-produit-nul',
    level: '2nde',
    titre: 'Équations produit nul',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.65) ? produit(rnd, 1) : lequel(rnd);
      if (palier === 2) return rnd.booleen(0.65) ? produit(rnd, 2) : vraiFaux(rnd);
      if (palier === 3) return rnd.booleen(0.8) ? factoriser(rnd) : vraiFaux(rnd);
      var f4 = rnd.choix(['meme', 'factoriser', 'laquelle', 'factoriser']);
      return f4 === 'meme' ? produit(rnd, 4) : f4 === 'laquelle' ? laquelle(rnd) : factoriser(rnd);
    }
  });
})();
