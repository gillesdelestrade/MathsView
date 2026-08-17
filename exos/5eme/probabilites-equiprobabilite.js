/*
 * probabilites-equiprobabilite — attribuer des probabilités dans des cas
 * simples (leçon 5ème « Attribuer des probabilités : pourquoi 1/6 pour chaque
 * face »).
 *
 *   issue         quelle est la probabilité d'obtenir CETTE issue-là ? (1/n)
 *   evenement     et celle d'un événement qui en regroupe plusieurs ? (k/n)
 *   couleurs      un sac de jetons de couleurs : ce sont les JETONS qui se
 *                 valent, pas les couleurs
 *   combien       l'inverse : on donne la probabilité, on demande le nombre de
 *                 cas favorables — ou le nombre total
 *   somme1        la somme de toutes les probabilités vaut 1 : le complémentaire
 *                 et la probabilité manquante, sans équiprobabilité
 *   equiprobable  parmi quatre expériences, laquelle n'a PAS des issues
 *                 équiprobables ?
 *   deuxdes       le contre-exemple : la somme de deux dés, calculée sur les 36
 *                 couples
 *   proprietes    vrai/faux sur les règles.
 *
 * ---------------------------------------------------------------------------
 * Ce qui doit être évalué, et ce qui ne le serait pas
 * ---------------------------------------------------------------------------
 * « 1/6 pour chaque face » se récite. Ce qui ne se récite pas, c'est de savoir
 * QUAND on a le droit de diviser par le nombre d'issues — et cette leçon ne
 * vaut que par là. Trois familles s'y attaquent de front :
 *
 *   COULEURS met l'erreur au centre : un sac de 12 jetons dont 5 rouges a douze
 *   issues équiprobables et trois couleurs qui ne le sont pas. Qui répond 1/3
 *   n'a pas compris ce qu'est une issue, et aucun QCM ne l'aurait montré.
 *
 *   EQUIPROBABLE demande de repérer l'intruse parmi quatre expériences. C'est
 *   la seule question qui porte sur la CONDITION plutôt que sur le calcul, et
 *   elle est à quatre propositions : on ne la devine pas une fois sur deux.
 *
 *   DEUXDES fait calculer 6/36, avec les six couples énumérés dans la
 *   correction. Une élève qui écrit 1/11 se voit répondre pourquoi.
 *
 * COMBIEN, enfin, remonte le calcul à l'envers : on donne la probabilité, on
 * demande le nombre de cas. On ne peut pas y répondre en récitant une formule
 * dans le bon sens, il faut savoir ce que chaque nombre désigne.
 *
 * ---------------------------------------------------------------------------
 * Les réponses
 * ---------------------------------------------------------------------------
 * Une probabilité s'écrit 4/10, 2/5 ou 0,4 — les trois sont justes, et le
 * module de validation compare les VALEURS (SPEC §2.4). La réponse est donc
 * donnée sous la forme { n, d } : la fraction simplifiée s'affiche dans la
 * correction, mais rien n'oblige l'élève à simplifier. Une valeur arrondie,
 * elle, est refusée avec le message dédié — 0,17 n'est pas 1/6.
 *
 * Rien n'est écrit à la main : les issues favorables d'un événement sont
 * produites par un FILTRE sur l'univers, et le nombre annoncé est la longueur
 * de la liste obtenue. Les poids des sommes de deux dés viennent du
 * dénombrement des 36 couples.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function ens(t, max) {
    // l'univers en accolades, tronqué au-delà de dix : une liste de vingt
    // numéros n'apprend rien de plus que « … » et déborde de la ligne
    var l = t.map(String);
    if (l.length > (max || 10)) l = l.slice(0, 4).concat(['…', l[l.length - 1]]);
    return '{ ' + l.join(' ; ') + ' }';
  }
  // « 4/12 = 1/3 » — la simplifiée n'apparaît que si elle diffère.
  function pf(n, d) {
    var f = O.reduit(n, d);
    return n + '/' + d + (f.d !== d ? ' = <b>' + O.fracTxt(f.n, f.d) + '</b>' : '');
  }
  function pct(n, d) { return O.fr(n / d * 100, 1) + ' %'; }
  // La réponse attendue, sous la forme que la validation sait comparer.
  function rep(n, d) { var f = O.reduit(n, d); return { n: f.n, d: f.d }; }
  /* Les autres écritures de la même probabilité. 1/8 vaut 0,125 ; 1/6 ne vaut
     PAS 0,167 — et une correction qui écrirait « = » là où il faut « environ »
     apprendrait qu'un arrondi est une égalité. */
  function ecritures(n, d) {
    var f = O.reduit(n, d), v = f.n / f.d;
    var exact = Math.abs(v * 10000 - Math.round(v * 10000)) < 1e-9;
    return 'On peut aussi l\'écrire ' + (exact ? '' : 'environ ') + O.fr(v, 4) +
      ', ou ' + (exact ? '' : 'environ ') + pct(n, d) + '.';
  }

  var RAPPEL = 'Quand les issues sont <b>équiprobables</b>, la certitude — qui vaut ' +
    '<b>1</b> — se partage en parts <b>égales</b> : avec <i>n</i> issues, chacune vaut ' +
    '<b>1/<i>n</i></b>. La probabilité d\'un événement est alors le <b>nombre de cas ' +
    'favorables</b> divisé par le <b>nombre de cas possibles</b>.';

  /* ===================================================================== */
  /* Les expériences à issues équiprobables                                */
  /* ===================================================================== */
  /* Chacune porte SA raison d'être équiprobable : c'est elle qui autorise le
     partage égal, et toutes les corrections la répètent. Sans elle, la règle
     deviendrait « on divise par le nombre d'issues », qui est l'erreur. */
  function numerique(rnd) {
    var quoi = rnd.choix(['de', 'de', 'sac', 'roue', 'carte']);
    var n, x;
    if (quoi === 'de') {
      n = rnd.choix([6, 6, 6, 8, 10, 12, 20]);
      x = { n: n, sujet: 'le nombre obtenu',
        phrase: 'On lance un dé <b>équilibré</b> à <b>' + n + ' faces</b>, numérotées de 1 ' +
          'à ' + n + ', et on note le nombre obtenu.',
        pourquoi: 'Le dé est équilibré : ses ' + n + ' faces ont la même forme et le même ' +
          'poids, aucune n\'a de raison de sortir plus souvent qu\'une autre.' };
    } else if (quoi === 'sac') {
      n = rnd.entier(8, 20);
      x = { n: n, sujet: 'le numéro tiré',
        phrase: 'Un sac contient <b>' + n + ' boules</b> numérotées de 1 à ' + n +
          '. Elles ont toutes la même taille, et on en tire une <b>sans regarder</b>.',
        pourquoi: 'Les ' + n + ' boules sont identiques au toucher et on tire sans ' +
          'regarder : aucune n\'est favorisée.' };
    } else if (quoi === 'roue') {
      n = rnd.choix([6, 8, 10, 12]);
      x = { n: n, sujet: 'le numéro du secteur',
        phrase: 'Une roue est partagée en <b>' + n + ' secteurs de même angle</b>, ' +
          'numérotés de 1 à ' + n + '. On la fait tourner et on note le secteur sur lequel ' +
          'elle s\'arrête.',
        pourquoi: 'Les ' + n + ' secteurs ont le même angle (360° ÷ ' + n + ' = ' +
          O.fr(360 / n) + '°) : la roue n\'a pas plus de place pour s\'arrêter sur l\'un ' +
          'que sur l\'autre.' };
    } else {
      n = rnd.choix([10, 12, 15, 20]);
      x = { n: n, sujet: 'le numéro de la carte',
        phrase: 'On mélange <b>' + n + ' cartes</b> numérotées de 1 à ' + n +
          ', puis on en retourne une <b>au hasard</b>.',
        pourquoi: 'Le paquet est bien mélangé et les cartes sont indiscernables de dos : ' +
          'chacune a la même chance d\'être retournée.' };
    }
    x.issues = [];
    for (var i = 1; i <= x.n; i++) x.issues.push(i);
    x.evts = evtsNumeriques(rnd, x.n);
    return x;
  }

  function piece() {
    return {
      n: 2, sujet: 'le côté obtenu', issues: ['Pile', 'Face'],
      phrase: 'On lance une pièce <b>non truquée</b> et on note le côté obtenu.',
      pourquoi: 'La pièce n\'est pas truquée : ses deux côtés jouent exactement le même ' +
        'rôle, rien ne la pousse à retomber de l\'un plutôt que de l\'autre.',
      evts: [{ t: 'obtenir Pile', f: function (v) { return v === 'Pile'; } },
             { t: 'obtenir Face', f: function (v) { return v === 'Face'; } }]
    };
  }

  /* Les événements, écrits comme des FILTRES : c'est le filtre qui produit la
     liste des issues favorables, et la liste qui donne le nombre. */
  function evtsNumeriques(rnd, n) {
    var l = [
      { t: 'obtenir un nombre pair', f: function (v) { return v % 2 === 0; } },
      { t: 'obtenir un nombre impair', f: function (v) { return v % 2 === 1; } }
    ];
    var k = rnd.choix([3, 4, 5]);
    if (k < n) {
      l.push({ t: 'obtenir un multiple de ' + k, f: function (v) { return v % k === 0; } });
    }
    var s = rnd.entier(2, n - 2);
    l.push({ t: 'obtenir un nombre strictement plus grand que ' + s,
             f: function (v) { return v > s; } });
    l.push({ t: 'obtenir un nombre inférieur ou égal à ' + s,
             f: function (v) { return v <= s; } });
    if (n >= 12) {
      l.push({ t: 'obtenir un nombre à deux chiffres', f: function (v) { return v >= 10; } });
    }
    return l;
  }
  function evenement(x, e) { return { t: e.t, a: x.issues.filter(e.f) }; }
  // Un événement ni impossible ni certain : les deux extrêmes se traitent à
  // part dans la leçon, et une question de calcul n'y apprendrait rien.
  function evtStrict(rnd, x) {
    for (var i = 0; i < 40; i++) {
      var e = evenement(x, rnd.choix(x.evts));
      if (e.a.length && e.a.length < x.issues.length) return e;
    }
    return null;
  }

  /* ===================================================================== */
  /* 1. La probabilité d'une issue : 1/n                                   */
  /* ===================================================================== */
  function qIssue(rnd, palier) {
    var x = rnd.booleen(0.18) ? piece() : numerique(rnd);
    var cible = rnd.choix(x.issues);
    var dit = typeof cible === 'number' ? 'le nombre <b>' + cible + '</b>' : '<b>' + cible + '</b>';
    return {
      enonce: x.phrase + '<br><b>Quelle est la probabilité d\'obtenir ' + dit + ' ?</b>',
      type: 'nombre', reponse: rep(1, x.n),
      etapes: [RAPPEL,
        'Les issues possibles sont ' + ens(x.issues) + ' : il y en a <b>' + x.n + '</b>.',
        x.pourquoi + ' Les ' + x.n + ' issues sont donc <b>équiprobables</b>.',
        'La certitude vaut 1 et se partage en ' + x.n + ' parts égales : chaque issue a ' +
          'pour probabilité <b>1/' + x.n + '</b>. Vérification : ' + x.n + ' × 1/' + x.n +
          ' = 1.',
        ecritures(1, x.n)],
      indices: ['Compte d\'abord toutes les issues possibles.',
                'Elles se valent toutes : la certitude (1) se partage en parts égales.'],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 2. La probabilité d'un événement : favorables sur possibles           */
  /* ===================================================================== */
  function qEvenement(rnd, palier) {
    var x, e;
    for (var i = 0; i < 40; i++) {
      x = numerique(rnd);
      e = evtStrict(rnd, x);
      if (e && e.a.length >= 2) break;
    }
    if (!e) return qIssue(rnd, palier);

    return {
      enonce: x.phrase + '<br>On considère l\'événement <b>« ' + e.t + ' »</b>.' +
        '<br><b>Quelle est la probabilité de cet événement ?</b>',
      type: 'nombre', reponse: rep(e.a.length, x.n),
      etapes: [RAPPEL,
        x.pourquoi + ' Les <b>' + x.n + '</b> issues sont équiprobables : chacune vaut 1/' +
          x.n + '.',
        'Les issues favorables à « ' + e.t +' » sont ' + ens(e.a) + ' : il y en a <b>' +
          e.a.length + '</b>.',
        'L\'événement ramasse donc ' + e.a.length + ' parts de 1/' + x.n + ' : ' +
          'P = ' + pf(e.a.length, x.n) + '.',
        ecritures(e.a.length, x.n)],
      indices: ['Écris les issues qui vérifient la condition, puis compte-les.',
                'P = nombre de cas favorables ÷ nombre de cas possibles.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 3. Les couleurs : ce sont les JETONS qui se valent                    */
  /* ===================================================================== */
  /* La question la plus utile du lot : trois couleurs, douze jetons, et la
     réponse 1/3 qui vient toute seule. L'univers n'est pas ce qu'on regarde. */
  /* Le genre est porté par le support, pas par la couleur : « un jeton bleu »
     mais « une boule bleue ». Écrire les quatre formes évite d'aller les
     fabriquer à coups d'expressions régulières — « rouges » n'a pas de
     masculin en retirant un « e ». */
  var SUPPORTS = [
    { obj: 'jeton', objs: 'jetons', un: 'un jeton', g: 'm', pron: 'ils',
      debut: 'Un sac contient',
      pareil: 'Tous les jetons ont la même taille et la même forme',
      tire: 'on en tire un <b>sans regarder</b>' },
    { obj: 'boule', objs: 'boules', un: 'une boule', g: 'f', pron: 'elles',
      debut: 'Une urne contient',
      pareil: 'Toutes les boules sont identiques au toucher',
      tire: 'on en tire une <b>sans regarder</b>' },
    { obj: 'bille', objs: 'billes', un: 'une bille', g: 'f', pron: 'elles',
      debut: 'Une boîte contient',
      pareil: 'Toutes les billes ont la même taille',
      tire: 'on en prend une <b>les yeux fermés</b>' }
  ];
  var COULEURS = [
    { m: 'rouge', f: 'rouge', mp: 'rouges', fp: 'rouges' },
    { m: 'bleu', f: 'bleue', mp: 'bleus', fp: 'bleues' },
    { m: 'vert', f: 'verte', mp: 'verts', fp: 'vertes' },
    { m: 'jaune', f: 'jaune', mp: 'jaunes', fp: 'jaunes' },
    { m: 'noir', f: 'noire', mp: 'noirs', fp: 'noires' }
  ];

  function tireSac(rnd) {
    var sup = rnd.choix(SUPPORTS);
    var couls = rnd.melange(COULEURS.slice()).slice(0, rnd.choix([2, 3, 3, 4]));
    var lot;
    for (var essai = 0; essai < 40; essai++) {
      lot = couls.map(function (c) { return { c: c, k: rnd.entier(1, 7) }; });
      // des effectifs tous égaux feraient de « 1 sur le nombre de couleurs » une
      // bonne réponse : le piège de la question disparaîtrait
      var tousPareils = lot.every(function (v) { return v.k === lot[0].k; });
      if (!tousPareils) break;
    }
    var total = lot.reduce(function (s, v) { return s + v.k; }, 0);
    var un = function (c) { return sup.g === 'm' ? c.m : c.f; };
    var pl = function (c) { return sup.g === 'm' ? c.mp : c.fp; };
    var listeTxt = lot.map(function (v) { return '<b>' + v.k + ' ' + pl(v.c) + '</b>'; });
    var phrase = sup.debut + ' <b>' + total + ' ' + sup.objs + '</b> : ' +
      listeTxt.slice(0, -1).join(', ') + ' et ' + listeTxt[listeTxt.length - 1] + '. ' +
      sup.pareil + ', et ' + sup.tire + '.';
    return { sup: sup, lot: lot, total: total, phrase: phrase, un: un, pl: pl };
  }

  function qCouleurs(rnd, palier) {
    var s = tireSac(rnd);
    var quoi = s.lot.length >= 3
      ? rnd.choix(['une', 'pas', 'une', 'deux']) : rnd.choix(['une', 'pas']);
    var favo, question, detail;

    if (quoi === 'une') {
      var vise = rnd.choix(s.lot);
      favo = vise.k;
      question = 'de tirer ' + s.sup.un + ' <b>' + s.un(vise.c) + '</b>';
      detail = 'Les cas favorables sont les <b>' + vise.k + '</b> ' + s.sup.objs + ' ' +
        s.pl(vise.c) + '.';
    } else if (quoi === 'pas') {
      var v2 = rnd.choix(s.lot);
      favo = s.total - v2.k;
      question = 'de <b>ne pas</b> tirer de ' + s.sup.obj + ' ' + s.un(v2.c);
      detail = 'Les cas favorables sont tous les autres ' + s.sup.objs + ' : ' + s.total +
        ' − ' + v2.k + ' = <b>' + favo + '</b>.';
    } else {
      var deux = rnd.melange(s.lot.slice()).slice(0, 2);
      favo = deux[0].k + deux[1].k;
      question = 'de tirer ' + s.sup.un + ' <b>' + s.un(deux[0].c) + ' ou ' +
        s.un(deux[1].c) + '</b>';
      detail = 'Les cas favorables sont les ' + deux[0].k + ' ' + s.pl(deux[0].c) + ' et les ' +
        deux[1].k + ' ' + s.pl(deux[1].c) + ' : ' + deux[0].k + ' + ' + deux[1].k +
        ' = <b>' + favo + '</b>.';
    }

    return {
      enonce: s.phrase + '<br><b>Quelle est la probabilité ' + question + ' ?</b>',
      type: 'nombre', reponse: rep(favo, s.total),
      etapes: [RAPPEL,
        '<b>Attention au piège.</b> Il y a ' + s.lot.length + ' couleurs, mais ce ne sont ' +
          '<b>pas les couleurs</b> qui sont équiprobables : elles ne sont pas présentes en ' +
          'même nombre. Ce qui se vaut, ce sont les <b>' + s.total + ' ' + s.sup.objs +
          '</b> — ' + s.sup.pron + ' sont identiques, et on tire sans regarder.',
        'Il y a donc <b>' + s.total + '</b> issues équiprobables, chacune de probabilité 1/' +
          s.total + '.',
        detail,
        'P = ' + pf(favo, s.total) + '. ' + ecritures(favo, s.total)],
      indices: ['Le nombre d\'issues n\'est pas le nombre de couleurs : compte les ' +
                s.sup.objs + '.',
                'P = nombre de cas favorables ÷ nombre total de ' + s.sup.objs + '.'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 4. Le calcul à l'envers : combien de cas ?                            */
  /* ===================================================================== */
  /* On donne la probabilité, on demande un nombre de cas. Impossible d'y
     répondre en récitant la formule dans le bon sens : il faut savoir ce que
     chaque nombre désigne. */
  function qCombien(rnd, palier) {
    var b = rnd.choix([2, 3, 4, 5]);
    // la probabilité donnée doit être irréductible : « 2/4 » se lirait déjà
    // comme « 2 cas sur 4 », et il n'y aurait plus rien à chercher
    var a = rnd.entier(1, b - 1);
    while (O.pgcd(a, b) !== 1) a = rnd.entier(1, b - 1);
    // le total doit rester crédible : une roue à quatre secteurs se compte à
    // vue, et la question ne demanderait plus rien
    var m = rnd.entier(Math.max(2, Math.ceil(8 / b)), 6);
    var c = rnd.choix(COULEURS);

    if (rnd.booleen()) {
      // on connaît le total, on cherche les cas favorables
      var total = b * m, favo = a * m;
      var support = rnd.choix([
        { p: 'Une roue est partagée en <b>' + total + ' secteurs de même angle</b>. ' +
             'Certains sont ' + c.mp + ', les autres blancs.',
          u: 'secteurs ' + c.mp, tire: 'tomber sur un secteur ' + c.m,
          q: 'Combien de secteurs sont ' + c.mp + ' ?' },
        { p: 'Un sac contient <b>' + total + ' jetons</b> identiques, dont certains sont ' +
             c.mp + '.',
          u: 'jetons ' + c.mp, tire: 'tirer un jeton ' + c.m,
          q: 'Combien de jetons sont ' + c.mp + ' ?' }
      ]);
      return {
        enonce: support.p + ' La probabilité de ' + support.tire +
          ' est <b>' + a + '/' + b + '</b>.<br><b>' + support.q + '</b>',
        type: 'nombre', reponse: favo,
        etapes: [RAPPEL,
          'Les ' + total + ' issues sont équiprobables. La probabilité cherchée s\'écrit ' +
            'donc <b>(nombre de cas favorables) / ' + total + '</b>.',
          'On sait qu\'elle vaut ' + a + '/' + b + '. Or ' + a + '/' + b + ' = ' + favo +
            '/' + total + ' (on multiplie en haut et en bas par ' + m + ').',
          'Il y a donc <b>' + favo + '</b> ' + support.u + '. Autre chemin : ' + total +
            ' × ' + a + '/' + b + ' = ' + favo + '.'],
        indices: ['La probabilité s\'écrit « quelque chose sur ' + total + ' ».',
                  'Transforme ' + a + '/' + b + ' en une fraction de dénominateur ' + total + '.'],
        duree: 130
      };
    }

    // on connaît les cas favorables, on cherche le total
    var favo2 = a * m, total2 = b * m;
    var autre = rnd.choix(COULEURS.filter(function (v) { return v.m !== c.m; }));
    return {
      enonce: 'Un sac contient des boules ' + c.fp + ' et des boules ' + autre.fp +
        ', toutes identiques au toucher. Il y a <b>' + favo2 + ' boules ' + c.fp +
        '</b>, et la probabilité de tirer une boule ' + c.f + ' est <b>' + a + '/' + b +
        '</b>.<br><b>Combien y a-t-il de boules en tout ?</b>',
      type: 'nombre', reponse: total2,
      etapes: [RAPPEL,
        'Les boules sont indiscernables : chacune a la même probabilité, et P(' + c.f +
          ') = ' + favo2 + ' / (nombre total de boules).',
        'Cette probabilité vaut ' + a + '/' + b + '. Comme ' + favo2 + ' = ' + a + ' × ' +
          m + ', il faut aussi multiplier le dénominateur par ' + m + ' : ' + a + '/' + b +
          ' = ' + favo2 + '/' + total2 + '.',
        'Il y a donc <b>' + total2 + '</b> boules en tout — dont ' + (total2 - favo2) +
          ' ' + autre.fp + '.'],
      indices: ['Écris la probabilité sous la forme « ' + favo2 + ' sur le total ».',
                'Quelle fraction de dénominateur inconnu est égale à ' + a + '/' + b + ' ?'],
      duree: 130
    };
  }

  /* ===================================================================== */
  /* 5. La somme de toutes les probabilités vaut 1                         */
  /* ===================================================================== */
  /* Et ici, pas besoin d'équiprobabilité : c'est vrai de toute expérience.
     Deux des trois situations sont d'ailleurs truquées exprès. */
  function qSomme1(rnd, palier) {
    var d = rnd.choix([10, 10, 20, 100]);

    if (rnd.booleen()) {
      var a = rnd.entier(1, d - 1);
      var jeu = rnd.choix([
        { p: 'À une loterie, la probabilité de <b>gagner un lot</b> est <b>' + a + '/' + d +
             '</b>.', q: 'Quelle est la probabilité de <b>ne rien gagner</b> ?',
          e: 'gagner un lot', f: 'ne rien gagner' },
        { p: 'Dans un jeu, la probabilité que la joueuse <b>gagne la partie</b> est <b>' +
             a + '/' + d + '</b> (il n\'y a pas de match nul).',
          q: 'Quelle est la probabilité qu\'elle <b>perde</b> ?',
          e: 'gagner', f: 'perdre' }
      ]);
      return {
        enonce: jeu.p + '<br><b>' + jeu.q + '</b>',
        type: 'nombre', reponse: rep(d - a, d),
        etapes: ['La somme des probabilités de <b>toutes</b> les issues vaut toujours ' +
            '<b>1</b> : à chaque partie, il se passe une chose et une seule.',
          'Ici il n\'y a que deux issues : « ' + jeu.e + ' » et « ' + jeu.f + ' ». Donc ' +
            'P(' + jeu.e + ') + P(' + jeu.f + ') = 1.',
          'P(' + jeu.f + ') = 1 − ' + a + '/' + d + ' = ' + d + '/' + d + ' − ' + a + '/' +
            d + ' = ' + pf(d - a, d) + '.',
          '<b>À retenir :</b> cette règle ne demande <i>pas</i> que les issues soient ' +
            'équiprobables. Elle est vraie de toute expérience aléatoire.'],
        indices: ['Il ne peut se produire que deux choses, et il s\'en produit toujours une.',
                  '1 s\'écrit aussi ' + d + '/' + d + '.'],
        duree: 110
      };
    }

    // la probabilité manquante d'une troisième couleur
    var c = rnd.melange(COULEURS.slice()).slice(0, 3);
    var p1 = rnd.entier(1, d - 2), p2 = rnd.entier(1, d - p1 - 1);
    var p3 = d - p1 - p2;
    return {
      enonce: 'Une roue <b>truquée</b> ne comporte que trois couleurs. Elle s\'arrête sur ' +
        'le ' + c[0].m + ' avec une probabilité de <b>' + p1 + '/' + d + '</b>, et sur le ' +
        c[1].m + ' avec une probabilité de <b>' + p2 + '/' + d + '</b>.' +
        '<br><b>Quelle est la probabilité qu\'elle s\'arrête sur le ' + c[2].m + ' ?</b>',
      type: 'nombre', reponse: rep(p3, d),
      etapes: ['La somme des probabilités de <b>toutes</b> les issues vaut toujours <b>1</b> : ' +
          'la roue s\'arrête forcément sur une couleur, et sur une seule.',
        'Ici : P(' + c[0].m + ') + P(' + c[1].m + ') + P(' + c[2].m + ') = 1, c\'est-à-dire ' +
          p1 + '/' + d + ' + ' + p2 + '/' + d + ' + P(' + c[2].m + ') = ' + d + '/' + d + '.',
        'Les deux premières font ' + (p1 + p2) + '/' + d + '. Il reste ' + d + '/' + d +
          ' − ' + (p1 + p2) + '/' + d + ' = ' + pf(p3, d) + '.',
        '<b>À retenir :</b> la roue est truquée, ses trois couleurs ne sont donc <i>pas</i> ' +
          'équiprobables — et pourtant la somme fait 1. Cette règle-là ne dépend pas de ' +
          'l\'équiprobabilité.'],
      indices: ['La roue s\'arrête toujours sur une couleur : le total des probabilités ' +
                'fait 1.',
                '1 s\'écrit aussi ' + d + '/' + d + '.'],
      duree: 130
    };
  }

  /* ===================================================================== */
  /* 6. Où l'équiprobabilité est-elle en défaut ?                          */
  /* ===================================================================== */
  /* La seule question qui porte sur la CONDITION plutôt que sur le calcul.
     Quatre propositions : on ne la devine pas une fois sur deux. */
  var EQUI = [
    { t: 'On lance un dé équilibré à six faces et on note le nombre obtenu.',
      d: 'les six faces sont identiques' },
    { t: 'On lance une pièce non truquée et on note le côté obtenu.',
      d: 'les deux côtés jouent le même rôle' },
    { t: 'Une roue est partagée en 8 secteurs de même angle, numérotés de 1 à 8 ; on note ' +
         'le numéro obtenu.', d: 'les huit secteurs ont le même angle' },
    { t: 'Un sac contient 20 boules identiques numérotées de 1 à 20 ; on en tire une sans ' +
         'regarder et on note son numéro.', d: 'les vingt boules sont indiscernables' },
    { t: 'On mélange 32 cartes toutes différentes et on en retourne une ; on note laquelle.',
      d: 'le paquet est mélangé et les cartes sont identiques de dos' }
  ];
  var PAS_EQUI = [
    { t: 'On lance deux dés équilibrés et on note la somme des deux nombres.',
      d: 'les onze sommes ne se valent pas : il y a <b>six</b> façons de faire 7 (1+6, 2+5, ' +
         '3+4, 4+3, 5+2, 6+1) et une <b>seule</b> d\'en faire 2. Ce sont les 36 couples de ' +
         'dés qui sont équiprobables, pas les sommes' },
    { t: 'Un sac contient 5 jetons rouges et 2 jetons bleus ; on tire un jeton et on note sa ' +
         'couleur.',
      d: 'les deux couleurs ne se valent pas : il y a plus de rouges que de bleus. Ce sont ' +
         'les <b>7 jetons</b> qui sont équiprobables, pas les couleurs' },
    { t: 'Une roue est partagée en trois secteurs : un demi-disque rouge, un quart bleu et ' +
         'un quart vert ; on note la couleur obtenue.',
      d: 'les trois secteurs n\'ont pas le même angle : le rouge occupe la moitié de la ' +
         'roue, il sort deux fois plus souvent' },
    { t: 'On lance un dé <b>pipé</b>, dont la face 6 a été alourdie, et on note le nombre ' +
         'obtenu.',
      d: 'le dé est truqué : c\'est précisément ce que veut dire « pipé », une face sort ' +
         'plus souvent que les autres' },
    { t: 'On note s\'il pleuvra demain ou non.',
      d: 'les deux issues n\'ont aucune raison de se valoir — la météo n\'est pas un dé, ' +
         'et deux issues ne font pas une chance sur deux' }
  ];

  function qEquiprobable(rnd, palier) {
    var mauvaise = rnd.choix(PAS_EQUI);
    var bonnes = rnd.melange(EQUI.slice()).slice(0, 3);
    var props = rnd.melange([{ x: mauvaise, bon: true }].concat(
      bonnes.map(function (b) { return { x: b, bon: false }; })));
    return {
      enonce: '<b>Dans laquelle de ces expériences les issues ne sont-elles PAS ' +
        'équiprobables ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return p.x.t; }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: ['Les issues d\'une expérience sont <b>équiprobables</b> quand <b>rien ne les ' +
          'distingue</b> : même forme, même poids, même angle, objets indiscernables. C\'est ' +
          'cette raison-là — jamais le comptage — qui autorise à partager la certitude en ' +
          'parts égales.',
        '<b>La bonne réponse :</b> « ' + mauvaise.t + ' » — ' + mauvaise.d + '.'].concat(
        bonnes.map(function (b) {
          return '✔ « ' + b.t + ' » : ' + b.d + ', les issues sont bien équiprobables.';
        })).concat(['<b>À retenir :</b> compter les issues ne suffit pas. Avant d\'écrire ' +
          '1/<i>n</i>, il faut s\'assurer qu\'aucune issue n\'est privilégiée.']),
      indices: ['Demande-toi à chaque fois : y a-t-il une raison pour qu\'un résultat sorte ' +
                'plus souvent qu\'un autre ?',
                'Méfie-toi des expériences où l\'on regroupe des résultats (une couleur, ' +
                'une somme) : les paquets n\'ont pas tous la même taille.'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 7. Le contre-exemple calculé : la somme de deux dés                   */
  /* ===================================================================== */
  /* Les couples ne sont pas recopiés : on les énumère. Le nombre annoncé dans
     la correction est la longueur de la liste obtenue. */
  var COUPLES = (function () {
    var c = {};
    for (var a = 1; a <= 6; a++) {
      for (var b = 1; b <= 6; b++) { (c[a + b] = c[a + b] || []).push(a + '+' + b); }
    }
    return c;
  })();

  function qDeuxDes(rnd, palier) {
    var s = rnd.entier(2, 12);
    var favo = COUPLES[s].length;
    return {
      enonce: 'On lance <b>deux dés équilibrés</b> à six faces et on note la <b>somme</b> ' +
        'des deux nombres obtenus.<br><b>Quelle est la probabilité d\'obtenir une somme ' +
        'égale à ' + s + ' ?</b>',
      type: 'nombre', reponse: rep(favo, 36),
      etapes: ['<b>Le piège :</b> les sommes possibles vont de 2 à 12, cela fait onze ' +
          'issues — mais la réponse n\'est <b>pas</b> 1/11. Partager en parts égales n\'est ' +
          'permis que si rien ne distingue les issues, et ici quelque chose les distingue.',
        'Ce qui se vaut, ce sont les <b>couples de dés</b> : le premier dé a six faces ' +
          'égales, le second aussi, cela fait 6 × 6 = <b>36 couples équiprobables</b>, ' +
          'chacun de probabilité 1/36.',
        'Les couples qui donnent la somme ' + s + ' sont : ' + COUPLES[s].join(', ') +
          '. Il y en a <b>' + favo + '</b>.',
        'P(somme = ' + s + ') = ' + pf(favo, 36) + ', soit environ ' + pct(favo, 36) + '.',
        '<b>À retenir :</b> quand les issues ne se valent pas, on redescend jusqu\'à des ' +
          'cas qui, eux, se valent — ici les 36 couples.'],
      indices: ['Ne divise pas par 11 : les onze sommes ne sont pas également probables.',
                'Compte les couples (premier dé, second dé) qui donnent cette somme. Il y ' +
                'en a 36 en tout.'],
      duree: 150
    };
  }

  /* ===================================================================== */
  /* 8. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Une probabilité peut être égale à 1,5.', ok: false,
      d: 'Une probabilité est toujours comprise entre <b>0</b> et <b>1</b> : c\'est une part ' +
         'de la certitude, elle ne peut pas être plus grande que le tout.' },
    { t: 'Un événement impossible a pour probabilité 0.', ok: true,
      d: 'Il ne regroupe aucune issue : il ne reçoit aucune part.' },
    { t: 'Un événement certain a pour probabilité 1.', ok: true,
      d: 'Il regroupe toutes les issues : il reçoit toute la certitude.' },
    { t: 'La somme des probabilités de toutes les issues d\'une expérience vaut 1.', ok: true,
      d: 'À chaque expérience il sort une issue et une seule : la certitude est entièrement ' +
         'partagée, sans reste.' },
    { t: 'Si une expérience a 5 issues, chacune a pour probabilité 1/5.', ok: false,
      d: 'Seulement si les cinq issues sont <b>équiprobables</b>. Compter les issues ne ' +
         'suffit jamais : il faut d\'abord s\'assurer qu\'aucune n\'est privilégiée.' },
    { t: 'Avec un dé équilibré à six faces, la probabilité d\'obtenir 6 est 1/6.', ok: true,
      d: 'Les six faces sont identiques : la certitude se partage en six parts égales.' },
    { t: 'On lance deux dés et on note la somme : il y a onze issues, donc chacune a pour ' +
         'probabilité 1/11.', ok: false,
      d: 'Les onze sommes ne se valent pas. Ce sont les <b>36 couples</b> de dés qui sont ' +
         'équiprobables : P(7) = 6/36 = 1/6, mais P(2) = 1/36.' },
    { t: 'Un sac contient 3 boules rouges et 1 boule verte : comme il y a deux couleurs, la ' +
         'probabilité de tirer une rouge est 1/2.', ok: false,
      d: 'Ce sont les <b>4 boules</b> qui sont équiprobables, pas les deux couleurs : ' +
         'P(rouge) = 3/4.' },
    { t: 'Si la probabilité d\'un événement est 1/4, la probabilité qu\'il ne se réalise pas ' +
         'est 3/4.', ok: true,
      d: 'Les deux font 1 à elles deux : 1 − 1/4 = 3/4.' },
    { t: 'Une probabilité peut s\'écrire sous forme de fraction, de nombre décimal ou de ' +
         'pourcentage.', ok: true,
      d: '1/4, 0,25 et 25 % désignent la même part de certitude.' },
    { t: 'Sur une roue partagée en secteurs, les secteurs ont forcément la même probabilité.',
      ok: false,
      d: 'Seulement s\'ils ont le <b>même angle</b>. Un secteur deux fois plus large sort ' +
         'deux fois plus souvent.' },
    { t: 'Si on lance un dé équilibré 60 fois, on obtient forcément 10 fois le 6.', ok: false,
      d: 'La probabilité annonce une <b>tendance</b>, pas une garantie. Sur 60 lancers on ' +
         'obtient un nombre de 6 proche de 10, presque jamais exactement 10 — et plus on ' +
         'lance, plus la <i>fréquence</i> se rapproche de 1/6.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux', correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Repense au partage : la certitude vaut 1, et elle se partage en parts ' +
                'égales seulement si rien ne distingue les issues.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'probabilites-equiprobabilite', competence: 'probabilites-equiprobabilite',
    level: '5eme',
    titre: 'Attribuer des probabilités', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['issue', 'issue', 'evenement', 'proprietes'] :
        palier === 2 ? ['issue', 'evenement', 'evenement', 'couleurs', 'proprietes'] :
        palier === 3 ? ['evenement', 'couleurs', 'somme1', 'combien', 'equiprobable'] :
                       ['combien', 'couleurs', 'deuxdes', 'equiprobable', 'somme1']);

      if (quoi === 'issue') return qIssue(rnd, palier);
      if (quoi === 'evenement') return qEvenement(rnd, palier);
      if (quoi === 'couleurs') return qCouleurs(rnd, palier);
      if (quoi === 'combien') return qCombien(rnd, palier);
      if (quoi === 'somme1') return qSomme1(rnd, palier);
      if (quoi === 'equiprobable') return qEquiprobable(rnd, palier);
      if (quoi === 'deuxdes') return qDeuxDes(rnd, palier);
      return qProprietes(rnd, palier);
    }
  });

})();
