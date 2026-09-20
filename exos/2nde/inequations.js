/*
 * inequations — les inéquations du premier degré (leçon 2nde du même nom).
 *
 * Les formes suivent la progression de la leçon :
 *   P1  ax + b ⋈ c avec a > 0 : exactement comme une équation, on isole x, le
 *       sens ne bouge pas ; et « quel nombre est solution ? » (un QCM où l'on
 *       remplace x et on regarde) ;
 *   P2  le cœur de la leçon : −ax ⋈ c, ou ax + b ⋈ c avec a < 0 — on divise par
 *       un négatif, le sens se retourne ; et des vrai/faux sur les règles ;
 *   P3  des x des deux côtés, ax + b ⋈ cx + d, où le signe de a − c décide ;
 *       et « quelle inéquation a pour solutions ]−∞ ; 2[ ? » (la lecture
 *       inverse) ;
 *   P4  la fraction (p + qx)/n + r ⋈ k de la leçon, et des solutions non
 *       entières : x < −1/3, écrit en intervalle avec sa fraction.
 *
 * On part toujours de la FRONTIÈRE x₀ et on fabrique l'inéquation autour :
 * la réponse est donc toujours propre (entière aux trois premiers paliers).
 * La réponse est l'ensemble S, lu par structure (type « intervalle ») : la
 * borne, l'ouverture du crochet et le côté doivent tous être justes ; le
 * moteur signale « les bornes sont bonnes, regarde les crochets » et, pour
 * les erreurs de sens, la correction rappelle le test d'un nombre de chaque
 * côté de la frontière, comme sur la figure de la leçon.
 */
(function () {
  'use strict';

  var TEX = { '<': '<', '>': '>', '⩽': '\\leqslant', '⩾': '\\geqslant' };
  var MIROIR = { '<': '>', '>': '<', '⩽': '⩾', '⩾': '⩽' };
  var RELS = ['<', '>', '⩽', '⩾'];

  function fr(v) { return String(v).replace('.', ',').replace('-', '−'); }
  function texNb(v) { return String(v).replace('.', '{,}'); }
  function par(v) { return v < 0 ? '(' + texNb(v) + ')' : texNb(v); }
  function large(rel) { return rel === '⩽' || rel === '⩾'; }
  function cmp(rel, u, v) {
    return rel === '<' ? u < v : rel === '>' ? u > v : rel === '⩽' ? u <= v : u >= v;
  }
  // « 3x », « −x », « x » en TeX ; kx + b avec le signe de b explicite.
  function kx(k) { return k === 1 ? 'x' : k === -1 ? '-x' : k + 'x'; }
  function kxb(k, b) { return kx(k) + (b === 0 ? '' : (b < 0 ? ' - ' : ' + ') + Math.abs(b)); }
  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

  // L'ensemble des solutions : x rel x0 → { txt, morceaux, tex }.
  function solution(rel, x0, x0Tex, x0Txt) {
    var gauche = rel === '<' || rel === '⩽', ferme = large(rel);
    var txt = gauche ? ']−∞ ; ' + x0Txt + (ferme ? ']' : '[')
                     : (ferme ? '[' : ']') + x0Txt + ' ; +∞[';
    var tex = gauche ? '\\left]-\\infty\\,;\\ ' + x0Tex + (ferme ? '\\right]' : '\\right[')
                     : (ferme ? '\\left[' : '\\left]') + x0Tex + '\\,;\\ +\\infty\\right[';
    var morceaux = gauche ? [{ a: -Infinity, b: x0, oa: true, ob: !ferme }]
                          : [{ a: x0, b: Infinity, oa: !ferme, ob: true }];
    return { txt: txt, tex: tex, morceaux: morceaux, gauche: gauche };
  }

  // Le test d'un nombre de chaque côté de la frontière, sur la forme k·x ⋈ R :
  // c'est l'argument de la figure, et il ne dépend d'aucune règle de signe.
  function testCotes(k, R, rel, x0) {
    var g = Math.floor(x0) === x0 ? x0 - 1 : Math.floor(x0);
    var d = Math.ceil(x0) === x0 ? x0 + 1 : Math.ceil(x0);
    function un(x) {
      var v = k * x, ok = cmp(rel, v, R);
      return 'pour \\(x = ' + texNb(x) + '\\) : \\(' + (k === 1 ? '' : k === -1 ? '-' : k + ' \\times ') +
             (k === 1 ? texNb(x) : par(x)) + ' = ' + texNb(v) + '\\), ' +
             (ok ? 'et \\(' + texNb(v) + ' ' + TEX[rel] + ' ' + texNb(R) + '\\) est <b>vrai</b>'
                 : 'or \\(' + texNb(v) + ' ' + TEX[rel] + ' ' + texNb(R) + '\\) est <b>faux</b>');
    }
    return 'Vérification, comme sur la droite graduée — ' + un(g) + ' ; ' + un(d) + '.';
  }

  // Les étapes communes à partir de k·x ⋈ R (k ≠ 0), jusqu'à S.
  function finir(k, R, rel, etapes) {
    var relSol = k < 0 ? MIROIR[rel] : rel;
    var n = R, d = k;
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d); n /= g; d /= g;
    var x0 = R / k;
    var x0Tex = d === 1 ? texNb(n) : (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
    var x0Txt = d === 1 ? fr(n) : (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;
    var S = solution(relSol, x0, x0Tex, x0Txt);
    if (k === 1) {
      etapes.push('\\(x\\) est déjà seul : \\(x ' + TEX[rel] + ' ' + texNb(R) + '\\).');
    } else if (k < 0) {
      etapes.push('On divise les deux membres par \\(' + texNb(k) + '\\), un nombre <b>négatif</b> : ' +
                  'le sens de l\'inégalité <b>change</b>, \\(' + TEX[rel] + '\\) devient \\(' + TEX[relSol] + '\\). ' +
                  '\\(x ' + TEX[relSol] + ' \\dfrac{' + texNb(R) + '}{' + texNb(k) + '} = ' + x0Tex + '\\).');
      etapes.push(testCotes(k, R, rel, x0));
    } else {
      etapes.push('On divise les deux membres par \\(' + k + '\\), un nombre <b>positif</b> : ' +
                  'le sens ne change pas. \\(x ' + TEX[rel] + ' \\dfrac{' + texNb(R) + '}{' + k + '} = ' + x0Tex + '\\).');
    }
    etapes.push('Inégalité ' + (large(relSol) ? '<b>large</b> : crochet fermé en ' : '<b>stricte</b> : crochet ouvert en ') +
                x0Txt + '. <b>\\(S = ' + S.tex + '\\)</b>');
    return { S: S, relSol: relSol, x0: x0 };
  }

  var CONSIGNE = 'Résous dans \\(\\mathbb{R}\\), puis donne l\'<strong>ensemble des solutions</strong>.';
  var INDICES = [
    'Fais comme pour une équation : les \\(x\\) d\'un côté, les nombres de l\'autre.',
    'Si tu divises par un nombre <b>négatif</b>, le sens de l\'inégalité change.',
    'Vérifie avec un nombre de chaque côté de la frontière.'
  ];

  /* ======================================================================= */
  /* Les formes                                                              */
  /* ======================================================================= */

  // P1 — ax + b ⋈ c, a > 0 : le sens ne bouge pas.
  // P2 — la même avec a < 0 : il se retourne.
  function simple(rnd, palier, negatif) {
    var x0 = rnd.entier(-8, 8);
    var a = rnd.entier(2, palier === 1 ? 5 : 7) * (negatif ? -1 : 1);
    if (negatif && palier === 2 && rnd.booleen(0.3)) a = -1;     // −x > 5
    var b = palier === 1 && rnd.booleen(0.2) ? 0 : rnd.entierNonNul(-9, 9);
    var rel = rnd.choix(RELS);
    var c = a * x0 + b, R = c - b;
    var etapes = [];
    if (b !== 0) {
      etapes.push('Les nombres vont à droite : on ' + (b > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(b) +
                  ' aux <b>deux</b> membres — l\'ordre est conservé. \\(' + kx(a) + ' ' + TEX[rel] + ' ' +
                  texNb(c) + (b > 0 ? ' - ' : ' + ') + Math.abs(b) + ' = ' + texNb(R) + '\\)');
    }
    var f = finir(a, R, rel, etapes);
    return {
      enonce: CONSIGNE,
      tex: kxb(a, b) + ' ' + TEX[rel] + ' ' + texNb(c),
      type: 'intervalle', reponse: f.S.txt, morceaux: f.S.morceaux,
      etapes: etapes, indices: INDICES, duree: negatif ? 75 : 60
    };
  }

  // P1 — quel nombre est solution ? On remplace, on regarde.
  function lequel(rnd) {
    var x0 = rnd.entier(-5, 5), a = rnd.entier(2, 4) * rnd.signe(), b = rnd.entierNonNul(-6, 6);
    var rel = rnd.choix(['<', '>']);
    var c = a * x0 + b;                              // frontière x0, exclue
    var cands = [x0 - 3, x0 - 1, x0, x0 + 1, x0 + 3].filter(function (x) { return cmp(rel, a * x + b, c) !== undefined; });
    var bons = cands.filter(function (x) { return cmp(rel, a * x + b, c); });
    var faux = cands.filter(function (x) { return !cmp(rel, a * x + b, c); });
    var bon = rnd.choix(bons);
    var choix = rnd.melange([bon].concat(rnd.melange(faux).slice(0, 3)));
    function calc(x) { return kx(a).replace('x', '\\times ' + par(x)).replace(/^\\times /, '') + (b < 0 ? ' - ' : ' + ') + Math.abs(b) + ' = ' + texNb(a * x + b); }
    return {
      enonce: 'Parmi ces nombres, lequel est <strong>solution</strong> de l\'inéquation ' +
              '\\(' + kxb(a, b) + ' ' + TEX[rel] + ' ' + texNb(c) + '\\) ?',
      type: 'qcm',
      choix: choix.map(fr), correct: choix.indexOf(bon),
      etapes: [
        'Un nombre est solution s\'il rend l\'inégalité <b>vraie</b> quand on le met à la place de \\(x\\).',
        'Pour \\(x = ' + texNb(bon) + '\\) : \\(' + calc(bon) + '\\), et \\(' + texNb(a * bon + b) + ' ' + TEX[rel] + ' ' +
        texNb(c) + '\\) est vrai. <b>' + fr(bon) + ' est solution.</b>',
        'Pour les autres, par exemple \\(x = ' + texNb(choix.filter(function (x) { return x !== bon; })[0]) + '\\) : \\(' +
        calc(choix.filter(function (x) { return x !== bon; })[0]) + '\\), et l\'inégalité est fausse.',
        'La frontière est \\(x = ' + texNb(x0) + '\\) (là où les deux membres sont égaux) ; les solutions sont toutes ' +
        (cmp(rel, a * (x0 - 1) + b, c) ? 'à gauche' : 'à droite') + '.'
      ],
      indices: ['Remplace \\(x\\) par chaque nombre et calcule.', 'Il n\'y a qu\'un seul nombre qui rend l\'inégalité vraie.'],
      duree: 45
    };
  }

  // P2 — vrai ou faux
  var AFFIRMATIONS = [
    { t: 'Si \\(-2x > 6\\), alors \\(x > -3\\).', ok: false,
      d: 'On divise par \\(-2\\), un nombre négatif : le sens change, \\(x < -3\\). Vérifie : \\(x = -4\\) donne \\(-2 \\times (-4) = 8 > 6\\), vrai ; \\(x = 0\\) donne \\(0 > 6\\), faux.' },
    { t: 'Si \\(-x > 5\\), alors \\(x < -5\\).', ok: true,
      d: 'Les nombres qui conviennent sont \\(-6\\), \\(-10\\), \\(-100\\)… tous plus petits que \\(-5\\). Diviser par \\(-1\\) retourne le sens.' },
    { t: 'Si \\(3x \\leqslant 12\\), alors \\(x \\leqslant 4\\).', ok: true,
      d: 'On divise par \\(3\\), un nombre positif : le sens ne change pas.' },
    { t: 'Si \\(x + 5 > 2\\), alors \\(x < -3\\).', ok: false,
      d: 'On soustrait \\(5\\) aux deux membres : soustraire ne change jamais le sens. \\(x > -3\\).' },
    { t: 'Ajouter le même nombre aux deux membres d\'une inéquation ne change pas son sens.', ok: true,
      d: 'C\'est la règle de base, la même que pour les équations : \\(-3 < 2\\) donne \\(-3 + 7 < 2 + 7\\).' },
    { t: 'Multiplier les deux membres d\'une inéquation par \\(-1\\) ne change pas son sens.', ok: false,
      d: '\\(2 < 5\\) est vrai, mais \\(-2 < -5\\) est faux : multiplier par un négatif <b>retourne</b> le sens, \\(-2 > -5\\).' },
    { t: 'Les solutions de \\(2x - 3 \\leqslant 5\\) forment l\'intervalle \\(]-\\infty\\,; 4]\\).', ok: true,
      d: '\\(2x \\leqslant 8\\), puis \\(x \\leqslant 4\\) : inégalité large, le crochet est fermé en \\(4\\).' },
    { t: 'Les solutions de \\(2x - 3 < 5\\) forment l\'intervalle \\(]-\\infty\\,; 4]\\).', ok: false,
      d: '\\(x < 4\\) : inégalité <b>stricte</b>, \\(4\\) n\'est pas solution (\\(2 \\times 4 - 3 = 5\\), et \\(5 < 5\\) est faux). C\'est \\(]-\\infty\\,; 4[\\).' },
    { t: 'L\'inéquation \\(3x + 1 > 3x - 2\\) n\'a aucune solution.', ok: false,
      d: 'Les \\(x\\) s\'éliminent et il reste \\(1 > -2\\), qui est <b>toujours</b> vrai : tous les réels sont solutions, \\(S = \\mathbb{R}\\).' },
    { t: 'Si \\(-4x \\geqslant -8\\), alors \\(x \\leqslant 2\\).', ok: true,
      d: 'On divise par \\(-4\\) : le sens change, \\(x \\leqslant \\dfrac{-8}{-4} = 2\\). Vérifie : \\(x = 0\\) donne \\(0 \\geqslant -8\\), vrai.' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Rappel : on résout une inéquation comme une équation, sauf qu\'en multipliant ou divisant par un ' +
               'nombre <b>négatif</b>, le sens de l\'inégalité change.'],
      indices: ['Teste avec un nombre : par exemple \\(x = 0\\), ou \\(x = -10\\).'],
      duree: 40
    };
  }

  // P3 — ax + b ⋈ cx + d : le signe de a − c décide.
  function deuxCotes(rnd, palier) {
    var x0 = rnd.entier(-7, 7);
    var k = rnd.entierNonNul(-5, 5);                 // a − c
    var c = rnd.entierNonNul(-5, 5), a = k + c;
    if (a === 0) { c = c + 1; a = k + c; }
    var b = rnd.entierNonNul(-9, 9), rel = rnd.choix(RELS);
    var d = k * x0 + b, R = d - b;
    var etapes = [
      'Les \\(x\\) vont à gauche : on ' + (c > 0 ? 'soustrait ' : 'ajoute ') + kx(Math.abs(c)) +
      ' aux deux membres — comme pour une équation. \\(' + kxb(k, b) + ' ' + TEX[rel] + ' ' + texNb(d) + '\\)',
      'Les nombres vont à droite : on ' + (b > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(b) + '. \\(' +
      kx(k) + ' ' + TEX[rel] + ' ' + texNb(R) + '\\)'
    ];
    var f = finir(k, R, rel, etapes);
    return {
      enonce: CONSIGNE,
      tex: kxb(a, b) + ' ' + TEX[rel] + ' ' + kxb(c, d),
      type: 'intervalle', reponse: f.S.txt, morceaux: f.S.morceaux,
      etapes: etapes, indices: INDICES, duree: 90
    };
  }

  // P3 — quelle inéquation a pour solutions S ? (la lecture inverse)
  function laquelle(rnd) {
    var x0 = rnd.entier(-6, 6), rel = rnd.choix(RELS), a = rnd.choix([2, 3, -2, -3, -1]);
    var relI = a < 0 ? MIROIR[rel] : rel;            // le sens dans l'inéquation
    var b = rnd.entierNonNul(-5, 5), c = a * x0 + b;
    var S = solution(rel, x0, texNb(x0), fr(x0));
    var vrai = kxb(a, b) + ' ' + TEX[relI] + ' ' + texNb(c);
    var pool = [vrai];
    [kxb(a, b) + ' ' + TEX[MIROIR[relI]] + ' ' + texNb(c),               // le sens oublié
     kxb(-a, b) + ' ' + TEX[relI] + ' ' + texNb(-a * x0 + b),           // le signe de a
     kxb(a, b) + ' ' + TEX[large(relI) ? (relI === '⩽' ? '<' : '>') : (relI === '<' ? '⩽' : '⩾')] + ' ' + texNb(c), // le crochet
     kxb(a, -b) + ' ' + TEX[relI] + ' ' + texNb(c)
    ].forEach(function (t) { if (pool.indexOf(t) < 0) pool.push(t); });
    var choix = rnd.melange(pool.slice(0, 4));
    return {
      enonce: 'Quelle inéquation a pour ensemble de solutions \\(' + S.tex + '\\) ?',
      type: 'qcm',
      choix: choix.map(function (t) { return '\\(' + t + '\\)'; }),
      correct: choix.indexOf(vrai),
      etapes: [
        'La frontière est \\(' + texNb(x0) + '\\) : c\'est la solution de l\'équation associée. Dans chaque proposition, ' +
        '\\(' + kx(a) + ' ' + (b < 0 ? '- ' : '+ ') + Math.abs(b) + ' = ' + texNb(c) + '\\) donne bien \\(x = ' + texNb(x0) + '\\).',
        'Reste le sens : on résout \\(' + vrai + '\\). \\(' + kx(a) + ' ' + TEX[relI] + ' ' + texNb(c - b) + '\\), puis on divise par \\(' +
        texNb(a) + '\\)' + (a < 0 ? ', un nombre <b>négatif</b> : le sens change' : ', positif : le sens ne change pas') +
        ' : \\(x ' + TEX[rel] + ' ' + texNb(x0) + '\\).',
        (large(rel) ? 'Inégalité large, crochet fermé' : 'Inégalité stricte, crochet ouvert') + ' : <b>\\(S = ' + S.tex + '\\)</b>.'
      ],
      indices: ['Résous chaque proposition, ou teste un nombre de l\'intervalle dans chacune.',
                'Deux propositions ne diffèrent que par le sens : laquelle est retournée par une division par un négatif ?'],
      duree: 75
    };
  }

  // P4 — (p + qx)/n + r ⋈ k, comme dans la leçon.
  function fraction(rnd) {
    var x0 = rnd.entier(-6, 6), q = rnd.entierNonNul(-5, 5), n = rnd.entier(2, 4);
    var p = rnd.entierNonNul(-6, 6), r = rnd.entierNonNul(-8, 8), rel = rnd.choix(RELS);
    // (p + q x0)/n doit être entier : on ajuste p.
    while ((p + q * x0) % n !== 0) p++;
    if (p === 0) p += n;
    var k = (p + q * x0) / n + r, k1 = k - r, R = n * k1 - p;
    var etapes = [
      'On isole la fraction : on ' + (r > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(r) + ' aux deux membres. ' +
      '\\(\\dfrac{' + kxb(q, 0).replace(/^/, '') + (p < 0 ? ' - ' : ' + ') + Math.abs(p) + '}{' + n + '} ' + TEX[rel] + ' ' + texNb(k1) + '\\)',
      'On multiplie les deux membres par \\(' + n + '\\), un nombre <b>positif</b> : le sens ne change pas. ' +
      '\\(' + kxb(q, p) + ' ' + TEX[rel] + ' ' + texNb(n * k1) + '\\)',
      'Les nombres vont à droite : on ' + (p > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(p) + '. \\(' +
      kx(q) + ' ' + TEX[rel] + ' ' + texNb(R) + '\\)'
    ];
    var f = finir(q, R, rel, etapes);
    var num = (p < 0 ? '' : '') + texNb(p) + (q < 0 ? ' - ' : ' + ') + kx(Math.abs(q));
    return {
      enonce: CONSIGNE,
      tex: '\\dfrac{' + num + '}{' + n + '}' + (r < 0 ? ' - ' : ' + ') + Math.abs(r) + ' ' + TEX[rel] + ' ' + texNb(k),
      type: 'intervalle', reponse: f.S.txt, morceaux: f.S.morceaux,
      etapes: etapes,
      indices: ['Commence par isoler la fraction, puis multiplie par ' + n + '.'].concat(INDICES.slice(1)),
      duree: 120
    };
  }

  // P4 — une solution non entière : la fraction reste dans l'intervalle.
  function nonEntiere(rnd) {
    var k = rnd.choix([-3, -2, 2, 3, -4, 4, -5, 5]);
    var R;
    do { R = rnd.entierNonNul(-9, 9); } while (R % k === 0);
    var b = rnd.entierNonNul(-9, 9), c = rnd.choix([0, 0, rnd.entierNonNul(-4, 4)]);
    if (c === k || c === -k) c = 0;                  // ni x qui disparaît, ni 0x
    var a = k + c, rel = rnd.choix(RELS), d = R + b;
    var etapes = [];
    if (c !== 0) {
      etapes.push('Les \\(x\\) vont à gauche : on ' + (c > 0 ? 'soustrait ' : 'ajoute ') + kx(Math.abs(c)) +
                  ' aux deux membres. \\(' + kxb(k, b) + ' ' + TEX[rel] + ' ' + texNb(d) + '\\)');
    }
    etapes.push('Les nombres vont à droite : on ' + (b > 0 ? 'soustrait ' : 'ajoute ') + Math.abs(b) + '. \\(' +
                kx(k) + ' ' + TEX[rel] + ' ' + texNb(R) + '\\)');
    var f = finir(k, R, rel, etapes);
    return {
      enonce: CONSIGNE + ' Donne la borne <strong>exacte</strong> (une fraction si besoin).',
      tex: kxb(a, b) + ' ' + TEX[rel] + ' ' + (c === 0 ? texNb(d) : kxb(c, d)),
      type: 'intervalle', reponse: f.S.txt, morceaux: f.S.morceaux,
      etapes: etapes,
      indices: INDICES.concat(['La borne peut être une fraction : écris-la telle quelle, par exemple ]−∞ ; −1/3[.']),
      duree: 100
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'inequations',
    competence: 'inequations',
    level: '2nde',
    titre: 'Inéquations du premier degré',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.7) ? simple(rnd, 1, false) : lequel(rnd);
      if (palier === 2) {
        var f2 = rnd.choix([simple, simple, simple, vraiFaux, vraiFaux, simple]);
        return f2 === simple ? simple(rnd, 2, rnd.booleen(0.8)) : vraiFaux(rnd);
      }
      if (palier === 3) return rnd.choix([deuxCotes, deuxCotes, laquelle, vraiFaux])(rnd, 3);
      return rnd.choix([fraction, nonEntiere, deuxCotes, laquelle])(rnd, 4);
    }
  });
})();
