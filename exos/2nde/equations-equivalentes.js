/*
 * eq-equivalentes — les opérations qui donnent une équation équivalente (leçon
 * 2nde « Équations équivalentes »).
 *
 * Les formes suivent les trois volets de la leçon :
 *   P1  ajouter ou soustraire : « on ajoute 3 aux deux membres, quelle équation
 *       obtient-on ? », et la lecture inverse, « quelle opération fait passer
 *       de l'une à l'autre ? » ;
 *   P2  multiplier ou diviser, nombres négatifs compris, et des vrai/faux sur
 *       les règles (× 0, un seul côté, développer) ;
 *   P3  « ces deux équations sont-elles équivalentes ? » — l'opération a été
 *       faite des deux côtés, ou d'un seul, ou sur les seuls termes en x, ou
 *       avec deux signes différents — et la réécriture d'un membre :
 *       développer, réduire ;
 *   P4  factoriser (où « simplifier par x » perd la solution 0), et retrouver
 *       le nombre : par combien a-t-on multiplié pour chasser le dénominateur ?
 *
 * Les leurres sont les fautes réelles : l'opération d'un seul côté, les
 * nombres oubliés dans une multiplication, un signe changé, un terme non
 * distribué. Aucun leurre n'est équivalent à l'équation de départ : le
 * générateur le vérifie en retrouvant les solutions de chaque proposition, et
 * retire tant que ce n'est pas le cas.
 */
(function () {
  'use strict';

  function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function absX(k) { var n = Math.abs(k); return n === 1 ? 'x' : n + 'x'; }
  // le membre p·x + q en TeX : « 2x - 1 », « -x + 2 », « 3x », « 6 »
  function aff(p, q) {
    if (p === 0) return String(q);
    var t = (p < 0 ? '-' : '') + absX(p);
    if (q !== 0) t += (q < 0 ? ' - ' : ' + ') + Math.abs(q);
    return t;
  }
  function eqTex(E) { return aff(E.a, E.b) + ' = ' + aff(E.c, E.d); }
  function fracTex(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d); n /= g; d /= g;
    return d === 1 ? String(n) : (n < 0 ? '-' : '') + '\\dfrac{' + Math.abs(n) + '}{' + d + '}';
  }
  // la solution de a·x + b = c·x + d, en TeX ; null s'il n'y en a pas une seule
  function solTex(E) { return E.a === E.c ? null : fracTex(E.d - E.b, E.a - E.c); }
  function memeSolution(E, xs) { return E.a !== E.c && Math.abs((E.d - E.b) - xs * (E.a - E.c)) < 1e-9; }

  /* Une équation a·x + b = c·x + d dont la solution est un entier non nul, et
     dont les deux membres ne valent pas 0 à la solution : c'est ce qui garantit
     que « d'un seul côté » change vraiment la solution. */
  function tire(rnd) {
    var xs = rnd.entierNonNul(-5, 5), y0 = rnd.entierNonNul(-6, 6);
    var a = rnd.entierNonNul(-4, 5), c;
    do { c = rnd.entier(-3, 4); } while (c === a);
    return { a: a, b: y0 - a * xs, c: c, d: y0 - c * xs, xs: xs };
  }
  // une opération : { t: 'add' | 'addx' | 'mul' | 'div', k }
  function applique(E, op) {
    var k = op.k;
    if (op.t === 'add') return { a: E.a, b: E.b + k, c: E.c, d: E.d + k };
    if (op.t === 'addx') return { a: E.a + k, b: E.b, c: E.c + k, d: E.d };
    if (op.t === 'mul') return { a: E.a * k, b: E.b * k, c: E.c * k, d: E.d * k };
    return { a: E.a / k, b: E.b / k, c: E.c / k, d: E.d / k };
  }
  function nbTex(k) { return '\\(' + k + '\\)'; }
  // « ajoute 3 », « soustrait 2x », « multiplie par \(-2\) », « divise par \(3\) »
  function geste(op) {
    if (op.t === 'add') return (op.k < 0 ? 'soustrait ' : 'ajoute ') + Math.abs(op.k);
    if (op.t === 'addx') return (op.k < 0 ? 'soustrait ' : 'ajoute ') + absX(op.k);
    return (op.t === 'mul' ? 'multiplie par ' : 'divise par ') + nbTex(op.k);
  }
  function phrase(op) {
    var g = geste(op);
    return op.t === 'mul' || op.t === 'div' ? 'On ' + g.replace(' par ', ' les deux membres par ') : 'On ' + g + ' aux deux membres';
  }
  // le membre avec l'opération écrite, avant toute réduction
  function explicite(p, q, op) {
    var m = aff(p, q), deux = p !== 0 && q !== 0, k = op.k;
    if (op.t === 'add') return m + (k < 0 ? ' - ' : ' + ') + Math.abs(k);
    if (op.t === 'addx') return m + (k < 0 ? ' - ' : ' + ') + absX(k);
    if (op.t === 'div') return '\\dfrac{' + m + '}{' + k + '}';
    if (deux) return (k === -1 ? '-' : k) + '(' + m + ')';
    return k + ' \\times ' + (m.charAt(0) === '-' ? '(' + m + ')' : m);
  }
  function eqExplicite(E, op) { return explicite(E.a, E.b, op) + ' = ' + explicite(E.c, E.d, op); }

  // l'équation et l'opération d'une famille : 'add' (volet 1) ou 'mul' (volet 2)
  function situation(rnd, famille) {
    var E = tire(rnd), op;
    if (famille === 'add') {
      if (rnd.booleen(0.6)) op = { t: 'add', k: rnd.booleen(0.5) && E.b !== 0 ? -E.b : rnd.entierNonNul(-9, 9) };
      else op = { t: 'addx', k: E.c !== 0 ? -E.c : rnd.entierNonNul(-3, 3) };
    } else if (rnd.booleen(0.5)) {
      op = { t: 'mul', k: rnd.choix([2, 3, -1, -2, 4, 5, -3]) };
    } else {
      op = { t: 'div', k: rnd.choix([2, 3, -2, 4, 5, -1, -3]) };
      var xs = E.xs;
      E = applique(E, { t: 'mul', k: op.k }); E.xs = xs;      // des coefficients divisibles
    }
    return { E: E, op: op, bon: applique(E, op) };
  }

  /* ======================================================================= */
  /* P1, P2 — quelle équation obtient-on ?                                   */
  /* ======================================================================= */
  function resultat(rnd, famille) {
    var S, E, op, bon, leurres, textes;
    for (var essai = 0; essai < 200; essai++) {
      S = situation(rnd, famille); E = S.E; op = S.op; bon = S.bon;
      var autre = famille === 'add'
        ? (function () { var inv = applique(E, { t: op.t, k: -op.k }); return { a: bon.a, b: bon.b, c: inv.c, d: inv.d }; })()   // + à gauche, − à droite
        : { a: bon.a, b: E.b, c: bon.c, d: E.d };                                                                            // les nombres oubliés
      leurres = [{ a: bon.a, b: bon.b, c: E.c, d: E.d },      // à gauche seulement
                 { a: E.a, b: E.b, c: bon.c, d: bon.d },      // à droite seulement
                 autre];
      textes = [bon].concat(leurres).map(eqTex);
      var distincts = textes.every(function (t, i) { return textes.indexOf(t) === i; });
      if (distincts && leurres.every(function (L) { return L.a !== L.c && !memeSolution(L, E.xs); })) break;
    }
    var choix = rnd.melange(textes.slice());
    var g = geste(op);
    return {
      enonce: 'On <strong>' + g + '</strong> ' + (famille === 'add' ? 'aux deux membres' : 'les deux membres') +
              ' de l\'équation \\(' + eqTex(E) + '\\). Quelle équation obtient-on ?',
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(textes[0]),
      etapes: [
        'On fait la <b>même opération des deux côtés</b> : \\(' + eqExplicite(E, op) + '\\).',
        (op.t === 'mul' ? 'On développe chaque membre' : op.t === 'div' ? 'On divise chaque terme' : 'On réduit chaque membre') + ' : <b>\\(' + eqTex(bon) + '\\)</b>.',
        'Les deux équations sont <b>équivalentes</b> : elles ont la même solution, \\(x = ' + E.xs + '\\).',
        famille === 'add'
          ? 'Faire l\'opération d\'un seul côté, ou ajouter d\'un côté et soustraire de l\'autre, donnerait une équation qui n\'a plus cette solution.'
          : 'Il faut ' + (op.t === 'mul' ? 'multiplier' : 'diviser') + ' <b>tout</b> chaque membre — les termes en \\(x\\) et les nombres — et des deux côtés.'
      ],
      indices: ['La même opération, sur les deux membres en entier.',
                famille === 'add' ? 'Écris d\'abord l\'opération à droite de chaque membre, puis réduis.'
                                  : 'Mets chaque membre entre parenthèses, puis ' + (op.t === 'mul' ? 'développe.' : 'divise chaque terme.')],
      duree: 60
    };
  }

  /* ======================================================================= */
  /* P1, P2 — quelle opération fait passer de l'une à l'autre ?              */
  /* ======================================================================= */
  function operation(rnd, famille) {
    var S, E, op, bon, ops;
    function pareil(U, V) { return ['a', 'b', 'c', 'd'].every(function (k) { return Math.abs(U[k] - V[k]) < 1e-9; }); }
    for (var essai = 0; essai < 200; essai++) {
      S = situation(rnd, famille); E = S.E; op = S.op; bon = S.bon;
      var k = Math.abs(op.k);
      if (op.t === 'add') ops = k < 2 ? null : [op, { t: 'add', k: -op.k }, { t: 'mul', k: k }, { t: 'div', k: k }];
      else if (op.t === 'addx') ops = [op, { t: 'addx', k: -op.k }, { t: 'add', k: k }, { t: 'add', k: -k }];
      else if (op.k < 0) ops = [op, { t: op.t === 'mul' ? 'div' : 'mul', k: op.k }, { t: 'mul', k: k }, { t: 'div', k: k }];
      else ops = [op, { t: op.t === 'mul' ? 'div' : 'mul', k: k }, { t: 'add', k: k }, { t: 'add', k: -k }];
      // une seule opération proposée doit mener à la seconde équation
      if (ops && ops.every(function (o, i) { return pareil(applique(E, o), bon) === (i === 0); })) break;
    }
    var textes = ops.map(function (o) { return phrase(o) + '.'; });
    var choix = rnd.melange(textes.slice());
    return {
      enonce: 'Quelle opération fait passer de l\'équation \\(' + eqTex(E) + '\\) à l\'équation \\(' + eqTex(bon) + '\\) ?',
      type: 'qcm', choix: choix, correct: choix.indexOf(textes[0]),
      etapes: [
        'On compare membre à membre : à gauche, \\(' + aff(E.a, E.b) + '\\) est devenu \\(' + aff(bon.a, bon.b) + '\\) ; à droite, \\(' +
        aff(E.c, E.d) + '\\) est devenu \\(' + aff(bon.c, bon.d) + '\\).',
        '<b>' + phrase(op) + '</b> : \\(' + eqExplicite(E, op) + '\\), c\'est-à-dire \\(' + eqTex(bon) + '\\).',
        'C\'est la même opération des deux côtés' + (op.t === 'mul' || op.t === 'div' ? ', par un nombre non nul' : '') +
        ' : les deux équations sont <b>équivalentes</b>, de solution \\(x = ' + E.xs + '\\).'
      ],
      indices: ['Compare les deux membres de gauche, puis les deux membres de droite.',
                'Essaie chaque opération proposée sur la première équation.'],
      duree: 60
    };
  }

  /* ======================================================================= */
  /* P2, P3 — vrai ou faux sur les règles                                    */
  /* ======================================================================= */
  var AFFIRMATIONS = [
    { t: 'Ajouter un même nombre aux deux membres d\'une équation donne une équation équivalente.', ok: true,
      d: 'C\'est la première règle : \\(A = B \\iff A + k = B + k\\). On revient en arrière en soustrayant \\(k\\).' },
    { t: 'Multiplier les deux membres d\'une équation par \\(0\\) donne une équation équivalente.', ok: false,
      d: 'On obtient \\(0 = 0\\), vraie pour tous les nombres : toutes les solutions de départ sont noyées. On multiplie par un nombre <b>non nul</b>.' },
    { t: 'Les équations \\(3x = 12\\) et \\(x = 4\\) sont équivalentes.', ok: true,
      d: 'On a divisé les deux membres par \\(3\\), qui n\'est pas nul.' },
    { t: 'Les équations \\(x + 5 = 8\\) et \\(x = 13\\) sont équivalentes.', ok: false,
      d: 'Pour isoler \\(x\\), on <b>soustrait</b> 5 aux deux membres : \\(x = 8 - 5 = 3\\). Ici, 5 a été soustrait à gauche et ajouté à droite.' },
    { t: 'Développer un membre d\'une équation change ses solutions.', ok: false,
      d: 'Développer change l\'<b>écriture</b> du membre, pas sa valeur : pour chaque \\(x\\), il vaut le même nombre. Les solutions sont les mêmes.' },
    { t: 'Les équations \\(x^2 = 2x\\) et \\(x = 2\\) sont équivalentes.', ok: false,
      d: 'On aurait « divisé par \\(x\\) », qui peut être nul. \\(0\\) est solution de \\(x^2 = 2x\\) mais pas de \\(x = 2\\) : une solution a été perdue.' },
    { t: 'Deux équations équivalentes ont exactement les mêmes solutions.', ok: true,
      d: 'C\'est la définition : ni une de plus, ni une de moins.' },
    { t: 'Les équations \\(\\dfrac{x}{3} = 2\\) et \\(x = 6\\) sont équivalentes.', ok: true,
      d: 'On a multiplié les deux membres par \\(3\\), non nul : \\(3 \\times \\dfrac{x}{3} = 3 \\times 2\\).' },
    { t: 'Pour passer de \\(2x + 1 = 7\\) à \\(2x = 6\\), on a soustrait \\(1\\) aux deux membres.', ok: true,
      d: '\\(2x + 1 - 1 = 7 - 1\\), soit \\(2x = 6\\).' },
    { t: 'Les équations \\(2(x + 1) = 6\\) et \\(2x + 1 = 6\\) sont équivalentes.', ok: false,
      d: 'Le développement est faux : \\(2(x + 1) = 2x + 2\\). La première a pour solution \\(2\\), la seconde \\(\\dfrac{5}{2}\\).' },
    { t: 'Soustraire \\(x\\) aux deux membres de \\(3x = x + 4\\) donne \\(2x = 4\\).', ok: true,
      d: '\\(3x - x = x + 4 - x\\), soit \\(2x = 4\\). On peut ajouter ou soustraire une expression qui contient \\(x\\).' },
    { t: 'Diviser les deux membres de \\(-2x = 6\\) par \\(-2\\) donne \\(x = 3\\).', ok: false,
      d: '\\(\\dfrac{-2x}{-2} = \\dfrac{6}{-2}\\), soit \\(x = -3\\) : le membre de droite se divise par \\(-2\\) lui aussi, signe compris.' }
  ];
  function vraiFaux(rnd) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d,
               'Rappel : on obtient une équation équivalente en ajoutant ou soustrayant un même nombre aux deux membres, en les multipliant ou divisant par un même nombre non nul, ou en développant, factorisant, réduisant un membre.'],
      indices: ['Cherche les solutions de chaque équation, ou l\'opération qui a été faite.'],
      duree: 40
    };
  }

  /* ======================================================================= */
  /* P3, P4 — ces deux équations sont-elles équivalentes ?                   */
  /* ======================================================================= */
  function equivalentes(rnd) {
    var E, E2, op, mode, pourquoi;
    for (var essai = 0; essai < 200; essai++) {
      E = tire(rnd);
      mode = rnd.choix(['ok', 'ok', 'ok', 'un-cote', 'un-cote', 'x-seuls', 'signes']);
      var t = rnd.choix(['add', 'add', 'addx', 'mul']);
      if (mode === 'x-seuls') t = 'mul';
      if (mode === 'signes' && t === 'mul') t = 'add';
      op = { t: t, k: t === 'mul' ? rnd.choix([2, 3, -2, 4, -1]) : t === 'addx' ? rnd.entierNonNul(-3, 3) : rnd.entierNonNul(-8, 8) };
      var R = applique(E, op), inv = applique(E, { t: op.t, k: -op.k });
      if (mode === 'ok') { E2 = R; break; }
      if (mode === 'un-cote') {
        E2 = { a: R.a, b: R.b, c: E.c, d: E.d };
        pourquoi = 'On ' + geste(op).replace(' par ', ' le membre de gauche par ') + (op.t === 'mul' ? '' : ' au membre de gauche') + ', mais on ne fait rien à droite.';
      } else if (mode === 'x-seuls') {
        E2 = { a: R.a, b: E.b, c: R.c, d: E.d };
        pourquoi = 'Seuls les termes en \\(x\\) ont été multipliés par ' + nbTex(op.k) + ' : il fallait multiplier <b>tout</b> chaque membre, les nombres aussi.';
      } else {
        E2 = { a: R.a, b: R.b, c: inv.c, d: inv.d };
        pourquoi = 'On ' + geste(op) + ' à gauche, mais on ' + geste({ t: op.t, k: -op.k }) + ' à droite : ce n\'est pas la même opération.';
      }
      // l'équation fausse doit avoir une solution, différente, et ne pas ressembler à la vraie
      if (E2.a !== E2.c && !memeSolution(E2, E.xs) && eqTex(E2) !== eqTex(E) && eqTex(E2) !== eqTex(R)) break;
    }
    var vrai = mode === 'ok';
    return {
      enonce: 'Vrai ou faux ?<br>Les équations \\(' + eqTex(E) + '\\) et \\(' + eqTex(E2) + '\\) sont <strong>équivalentes</strong>.',
      type: 'vraifaux', correct: vrai ? 0 : 1,
      etapes: vrai ? [
        '<b>Vrai.</b> Pour passer de la première à la seconde, ' + phrase(op).replace(/^On/, 'on') + ' : \\(' + eqExplicite(E, op) + '\\).',
        'C\'est la même opération des deux côtés' + (op.t === 'mul' ? ', par un nombre non nul' : '') + ' : les équations sont <b>équivalentes</b>.',
        'Vérification : toutes deux ont pour solution \\(x = ' + E.xs + '\\).'
      ] : [
        '<b>Faux.</b> ' + pourquoi,
        'Faite correctement, l\'opération aurait donné \\(' + eqTex(applique(E, op)) + '\\).',
        'Vérification : la première a pour solution \\(x = ' + E.xs + '\\), la seconde \\(x = ' + solTex(E2) + '\\). Elles ne sont <b>pas équivalentes</b>.'
      ],
      indices: ['Compare les membres de gauche entre eux, puis les membres de droite : est-ce la même opération ?',
                'En cas de doute, résous les deux équations.'],
      duree: 75
    };
  }

  /* ======================================================================= */
  /* P3, P4 — réécrire un membre : développer, réduire, factoriser           */
  /* ======================================================================= */
  // les solutions de L(x) = R(x), degré ⩽ 2 : un tableau, ou 'R' si tout x convient
  function racines(L, R) {
    function P(x) { return L(x) - R(x); }
    var p0 = P(0), p1 = P(1), p2 = P(-1), A = (p1 + p2) / 2 - p0, B = (p1 - p2) / 2, C = p0;
    if (Math.abs(A) < 1e-12) return Math.abs(B) < 1e-12 ? (Math.abs(C) < 1e-12 ? 'R' : []) : [-C / B];
    var dl = B * B - 4 * A * C;
    if (dl < -1e-12) return [];
    if (dl < 1e-12) return [-B / (2 * A)];
    var r1 = (-B - Math.sqrt(dl)) / (2 * A), r2 = (-B + Math.sqrt(dl)) / (2 * A);
    return [Math.min(r1, r2), Math.max(r1, r2)];
  }
  function memesRacines(u, v) {
    return u !== 'R' && v !== 'R' && u.length === v.length && u.every(function (x, i) { return Math.abs(x - v[i]) < 1e-9; });
  }
  function lin(p, q) { return function (x) { return p * x + q; }; }
  function signe(v) { return (v < 0 ? ' - ' : ' + ') + Math.abs(v); }

  function reecriture(rnd, formes) {
    var forme = rnd.choix(formes), orig, props, etapes, verbe;
    for (var essai = 0; essai < 300; essai++) {
      if (forme === 'dev') {
        // k(x + m) = px + q
        var k = rnd.choix([2, 3, 4, 5, -2, -3]), m = rnd.entierNonNul(-5, 5), p = rnd.entier(-3, 4), xs = rnd.entier(-5, 5);
        if (p === k) continue;
        var q = k * (xs + m) - p * xs;
        orig = { tex: k + '(' + aff(1, m) + ') = ' + aff(p, q), L: function (x) { return k * (x + m); }, R: lin(p, q) };
        props = [{ a: k, b: k * m, c: p, d: q },           // le bon développement
                 { a: k, b: m, c: p, d: q },               // k non distribué au nombre
                 { a: k, b: k * m, c: k * p, d: k * q },   // le membre de droite multiplié aussi
                 { a: 1, b: k * m, c: p, d: q }]           // k non distribué à x
          .map(function (E) { return { tex: eqTex(E), L: lin(E.a, E.b), R: lin(E.c, E.d) }; });
        verbe = 'développe';
        etapes = [
          'On <b>développe</b> le membre de gauche : \\(' + k + '(' + aff(1, m) + ') = ' + k + ' \\times x + ' + (k < 0 ? '(' + k + ')' : k) + ' \\times ' + (m < 0 ? '(' + m + ')' : m) + ' = ' + aff(k, k * m) + '\\).',
          'Le membre de droite ne change pas : <b>\\(' + props[0].tex + '\\)</b>. Développer change l\'écriture d\'un membre, pas sa valeur : l\'équation est <b>équivalente</b>.',
          'Vérification : les deux ont pour solution \\(x = ' + xs + '\\).',
          'Dans les autres propositions, le nombre ' + nbTex(k) + ' n\'a pas été distribué aux deux termes, ou bien le membre de droite a été modifié : les solutions ne sont plus les mêmes.'
        ];
      } else if (forme === 'red') {
        // ax + b + cx + d = e
        var a = rnd.entier(2, 6), c = rnd.entierNonNul(-4, 4), b = rnd.entierNonNul(-6, 6), d = rnd.entierNonNul(-6, 6), xr = rnd.entier(-5, 5);
        if (a + c === 0 || a + b + c + d === 0) continue;
        var e = (a + c) * xr + b + d;
        orig = { tex: aff(a, b) + (c < 0 ? ' - ' : ' + ') + absX(c) + signe(d) + ' = ' + e, L: lin(a + c, b + d), R: lin(0, e) };
        props = [{ a: a + c, b: b + d, c: 0, d: e },          // la bonne réduction
                 { a: a + c, b: b - d, c: 0, d: e },          // signe du second nombre
                 { a: a - c, b: b + d, c: 0, d: e },          // signe du second terme en x
                 { a: a + b + c + d, b: 0, c: 0, d: e }]      // x et nombres mélangés
          .map(function (E) { return { tex: eqTex(E), L: lin(E.a, E.b), R: lin(E.c, E.d) }; });
        verbe = 'réduit';
        etapes = [
          'On <b>réduit</b> le membre de gauche : les termes en \\(x\\) ensemble, \\(' + absX(a) + (c < 0 ? ' - ' : ' + ') + absX(c) + ' = ' + aff(a + c, 0) + '\\) ; les nombres ensemble, \\(' +
          b + signe(d) + ' = ' + (b + d) + '\\).',
          'Le membre de droite ne change pas : <b>\\(' + props[0].tex + '\\)</b>. Réduire change l\'écriture d\'un membre, pas sa valeur : l\'équation est <b>équivalente</b>.',
          'Vérification : les deux ont pour solution \\(x = ' + xr + '\\).',
          'On n\'ajoute jamais un terme en \\(x\\) et un nombre, et chaque terme garde le signe écrit devant lui.'
        ];
      } else {
        // x² + kx = 0
        var kk = rnd.entierNonNul(-6, 6);
        orig = { tex: 'x^2' + (kk < 0 ? ' - ' : ' + ') + absX(kk) + ' = 0', L: function (x) { return x * x + kk * x; }, R: lin(0, 0) };
        props = [{ tex: 'x(' + aff(1, kk) + ') = 0', L: function (x) { return x * (x + kk); }, R: lin(0, 0) },      // la bonne factorisation
                 { tex: 'x(' + aff(1, -kk) + ') = 0', L: function (x) { return x * (x - kk); }, R: lin(0, 0) },     // signe changé
                 { tex: aff(1, kk) + ' = 0', L: lin(1, kk), R: lin(0, 0) },                                         // « simplifié par x »
                 { tex: aff(2, kk) + ' = 0', L: lin(2, kk), R: lin(0, 0) }];                                        // x² pris pour 2x
        verbe = 'factorise';
        etapes = [
          '\\(x\\) est un <b>facteur commun</b> : \\(x^2' + (kk < 0 ? ' - ' : ' + ') + absX(kk) + ' = x \\times x' + (kk < 0 ? ' - ' : ' + ') + Math.abs(kk) + ' \\times x = x(' + aff(1, kk) + ')\\).',
          'Factoriser change l\'écriture d\'un membre, pas sa valeur : <b>\\(' + props[0].tex + '\\)</b> est <b>équivalente</b> à l\'équation de départ.',
          'Attention : « simplifier par \\(x\\) » pour écrire \\(' + aff(1, kk) + ' = 0\\) ferait perdre la solution \\(0\\). On ne divise jamais par ce qui peut être nul.',
          'Les solutions sont \\(0\\) et \\(' + (-kk) + '\\) (règle du produit nul).'
        ];
      }
      var R0 = racines(orig.L, orig.R), textes = props.map(function (pr) { return pr.tex; });
      var distincts = textes.every(function (t, i) { return textes.indexOf(t) === i; });
      // une seule proposition a les solutions de l'équation de départ : la première
      if (distincts && props.every(function (pr, i) { return memesRacines(racines(pr.L, pr.R), R0) === (i === 0); })) break;
    }
    var choix = rnd.melange(props.map(function (pr) { return pr.tex; }));
    return {
      enonce: 'Laquelle de ces équations est <strong>équivalente</strong> à \\(' + orig.tex + '\\) ?',
      type: 'qcm', choix: choix.map(function (t) { return '\\(' + t + '\\)'; }), correct: choix.indexOf(props[0].tex),
      etapes: etapes,
      indices: ['On ' + verbe + ' le membre de gauche, sans toucher à celui de droite.',
                'Vérifie ta réponse avec une valeur de x : les deux membres de gauche doivent donner le même nombre.'],
      duree: forme === 'fac' ? 90 : 80
    };
  }

  /* ======================================================================= */
  /* P4 — retrouver le nombre                                                */
  /* ======================================================================= */
  function parQuel(rnd) {
    var mode = rnd.choix(['mul', 'mul', 'add', 'div']);
    if (mode === 'mul') {
      // x/k + m = n  →  × k  →  x + km = kn
      var k = rnd.choix([2, 3, 4, 5, 6, -2, -3]), m = rnd.entierNonNul(-5, 5), n;
      do { n = rnd.entier(-6, 6); } while (n === m);
      var gauche = (k < 0 ? '-' : '') + '\\dfrac{x}{' + Math.abs(k) + '}' + signe(m);
      return {
        enonce: 'Par quel nombre a-t-on <strong>multiplié</strong> les deux membres pour passer de \\(' + gauche + ' = ' + n +
                '\\) à \\(' + aff(1, k * m) + ' = ' + (k * n) + '\\) ?',
        type: 'nombre', reponse: k,
        etapes: [
          'Pour chasser le dénominateur, on multiplie par ' + nbTex(k) + ' : \\(' + k + ' \\times ' + (k < 0 ? '\\left(-\\dfrac{x}{' + (-k) + '}\\right)' : '\\dfrac{x}{' + k + '}') + ' = x\\).',
          'Il faut multiplier <b>tout</b> le membre de gauche, et celui de droite : \\(' + k + ' \\times ' + (m < 0 ? '(' + m + ')' : m) + ' = ' + (k * m) +
          '\\) et \\(' + k + ' \\times ' + (n < 0 ? '(' + n + ')' : n) + ' = ' + (k * n) + '\\).',
          'On a multiplié les deux membres par <b>' + nbTex(k) + '</b>, qui n\'est pas nul : les équations sont équivalentes.'
        ],
        indices: ['Regarde ce que le membre de droite est devenu.', 'Le dénominateur a disparu : par quoi faut-il multiplier pour cela ?'],
        duree: 70
      };
    }
    var S = situation(rnd, mode === 'add' ? 'add' : 'mul');
    while ((mode === 'add' && S.op.t !== 'add') || (mode === 'div' && (S.op.t !== 'div' || S.op.k === -1))) S = situation(rnd, mode === 'add' ? 'add' : 'mul');
    var E = S.E, op = S.op, bon = S.bon;
    return {
      enonce: mode === 'add'
        ? 'Quel nombre a-t-on <strong>ajouté</strong> aux deux membres pour passer de \\(' + eqTex(E) + '\\) à \\(' + eqTex(bon) +
          '\\) ? (Si on a soustrait, réponds par un nombre négatif.)'
        : 'Par quel nombre a-t-on <strong>divisé</strong> les deux membres pour passer de \\(' + eqTex(E) + '\\) à \\(' + eqTex(bon) + '\\) ?',
      type: 'nombre', reponse: op.k,
      etapes: [
        'On compare membre à membre : à gauche, \\(' + aff(E.a, E.b) + '\\) est devenu \\(' + aff(bon.a, bon.b) + '\\) ; à droite, \\(' +
        aff(E.c, E.d) + '\\) est devenu \\(' + aff(bon.c, bon.d) + '\\).',
        mode === 'add'
          ? (op.k < 0 ? 'On a soustrait ' + (-op.k) + ', c\'est-à-dire ajouté <b>' + nbTex(op.k) + '</b>' : 'On a ajouté <b>' + op.k + '</b>') + ' : \\(' + eqExplicite(E, op) + '\\).'
          : 'On a divisé par <b>' + nbTex(op.k) + '</b> : \\(' + eqExplicite(E, op) + '\\).',
        'C\'est la même opération des deux côtés : les équations sont équivalentes, de solution \\(x = ' + E.xs + '\\).'
      ],
      indices: ['Compare les nombres seuls d\'une équation à l\'autre.', 'Vérifie ensuite sur l\'autre membre.'],
      duree: 60
    };
  }

  /* ======================================================================= */
  MathsExos.register({
    id: 'eq-equivalentes',
    competence: 'eq-equivalentes',
    level: '2nde',
    titre: 'Équations équivalentes',
    paliers: 4,

    genere: function (rnd, palier) {
      if (palier === 1) return rnd.booleen(0.6) ? resultat(rnd, 'add') : operation(rnd, 'add');
      if (palier === 2) {
        var f2 = rnd.choix(['resultat', 'resultat', 'operation', 'vf']);
        return f2 === 'resultat' ? resultat(rnd, 'mul') : f2 === 'operation' ? operation(rnd, 'mul') : vraiFaux(rnd);
      }
      if (palier === 3) {
        var f3 = rnd.choix(['equiv', 'equiv', 'equiv', 'reecrit', 'reecrit', 'vf']);
        return f3 === 'equiv' ? equivalentes(rnd) : f3 === 'reecrit' ? reecriture(rnd, ['dev', 'red']) : vraiFaux(rnd);
      }
      var f4 = rnd.choix(['reecrit', 'reecrit', 'quel', 'quel', 'equiv']);
      return f4 === 'reecrit' ? reecriture(rnd, ['fac', 'fac', 'dev', 'red']) : f4 === 'quel' ? parQuel(rnd) : equivalentes(rnd);
    }
  });
})();
