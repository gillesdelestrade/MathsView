/*
 * puissances — découvrir les puissances (leçon 5ème « Découvrir les
 * puissances »).
 *
 * Deux choses doivent finir par se savoir SANS calculer, et elles ont chacune
 * leur famille de questions, présentes à tous les paliers :
 *
 *   carres        les carrés des entiers de 0 à 12, dans les deux sens :
 *                 « combien vaut 7² ? » et « quel nombre au carré donne 81 ? » ;
 *   dix           les puissances de 10 : la valeur, le nombre de zéros, et
 *                 l'écriture inverse (10 000 = 10 puissance combien ?).
 *
 * Autour d'elles, ce qui fait comprendre la notation plutôt que la réciter :
 *
 *   ecrire        un produit répété à écrire en puissance, et l'inverse ;
 *   calcul        une petite puissance à calculer ;
 *   piege         3⁴ ou 3 × 4 ? 2³ ou 3² ? Les deux confusions du chapitre ;
 *   proprietes    vrai/faux sur le vocabulaire et sur ce que compte l'exposant.
 *
 * Tout est entier et calculé par multiplications successives — jamais
 * Math.pow, qui rend un flottant : 10^7 y vaut 10000000.000000002 sur certaines
 * machines, et une réponse juste serait refusée.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  function m(s) { return '\\(' + s + '\\)'; }
  function pw(a, n) { return m(a + '^{' + n + '}'); }
  // Une puissance exacte, par multiplications successives.
  function puissance(a, n) { var r = 1; for (var i = 0; i < n; i++) r *= a; return r; }
  // 1 000 000 → « 1 000 000 » (espaces insécables, à la française)
  function fr(n) {
    var s = String(n), out = '', c = 0, i;
    for (i = s.length - 1; i >= 0; i--) {
      out = s.charAt(i) + out;
      if (++c % 3 === 0 && i > 0) out = '&nbsp;' + out;
    }
    return out;
  }

  /* ===================================================================== */
  /* 1. Les carrés de 0 à 12                                               */
  /* ===================================================================== */
  function qCarres(rnd, palier) {
    // Aux premiers paliers, on reste dans les carrés les plus familiers.
    var n = rnd.entier(palier <= 2 ? 2 : 0, palier <= 2 ? 10 : 12);
    var direct = rnd.booleen(palier <= 2 ? 0.75 : 0.55);
    var c = n * n;

    if (direct) {
      return {
        enonce: 'Combien vaut ' + pw(n, 2) + ' ?',
        type: 'nombre', reponse: c,
        etapes: [
          pw(n, 2) + ' se lit « ' + n + ' au carré » : c\'est ' +
            m(n + ' \\times ' + n) + '.',
          m(n + ' \\times ' + n + ' = ' + c) + '.',
          '<b>Les carrés de 0 à 12, à savoir par cœur :</b> 0, 1, 4, 9, 16, 25, 36, 49, 64, ' +
            '81, 100, 121, 144.'
        ],
        indices: ['Au carré, c\'est le nombre multiplié par lui-même.',
                  m(n + ' \\times ' + n) + ' — pas ' + m(n + ' \\times 2') + '.'],
        duree: 25
      };
    }
    // Le sens inverse : on donne le carré, on cherche le nombre.
    return {
      enonce: 'Quel est le nombre entier dont le <b>carré</b> vaut ' + m(String(c)) + ' ?',
      type: 'nombre', reponse: n,
      etapes: [
        'On cherche le nombre qui, multiplié par lui-même, donne ' + m(String(c)) + '.',
        m(n + ' \\times ' + n + ' = ' + c) + ', donc ce nombre est <b>' + n + '</b>.',
        'Connaître la liste des carrés de 0 à 12 permet de répondre immédiatement, sans essayer ' +
          'un nombre après l\'autre.'
      ],
      indices: ['Passe en revue les carrés que tu connais : 1, 4, 9, 16, 25, 36…',
                'Le nombre cherché est plus petit que 13.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 2. Les puissances de 10                                               */
  /* ===================================================================== */
  function qDix(rnd, palier) {
    var n = rnd.entier(2, palier <= 2 ? 5 : 9);
    var v = puissance(10, n);
    var quoi = rnd.choix(palier <= 2 ? ['valeur', 'valeur', 'zeros']
                                     : ['valeur', 'zeros', 'inverse', 'inverse']);

    if (quoi === 'valeur') {
      return {
        enonce: 'Écris ' + pw(10, n) + ' sous forme d\'un nombre entier.',
        type: 'nombre', reponse: v,
        etapes: [
          pw(10, n) + ', c\'est le produit de <b>' + n + '</b> facteurs égaux à 10.',
          'Chaque facteur 10 ajoute un <b>zéro</b> : ' + pw(10, n) + ' s\'écrit donc ' +
            '<b>1 suivi de ' + n + ' zéros</b>.',
          pw(10, n) + ' = <b>' + fr(v) + '</b>.'
        ],
        indices: ['L\'exposant donne directement le nombre de zéros.',
                  '1 suivi de ' + n + ' zéros.'],
        duree: 30
      };
    }
    if (quoi === 'zeros') {
      // La bonne réponse est posée EN PREMIER, et c'est elle qui réserve sa
      // valeur : si on dédoublonnait après mélange, un leurre de même valeur
      // pourrait l'évincer, et la réinsérer ensuite la mettrait en double.
      var vus = {}, choix = [{ c: 'bon', v: n }];
      vus[n] = 1;
      rnd.melange([{ c: 'faux', v: n + 1 }, { c: 'faux', v: n - 1 },
                   { c: 'faux', v: n * 2 }]).forEach(function (p) {
        if (!vus[p.v] && p.v > 0) { vus[p.v] = 1; choix.push(p); }
      });
      var k = n + 2;
      while (choix.length < 4) { if (!vus[k]) { vus[k] = 1; choix.push({ c: 'faux', v: k }); } k++; }
      choix = rnd.melange(choix);
      return {
        enonce: 'Combien de <b>zéros</b> compte l\'écriture décimale de ' + pw(10, n) + ' ?',
        type: 'qcm',
        choix: choix.map(function (p) { return String(p.v); }),
        correct: choix.map(function (p) { return p.c; }).indexOf('bon'),
        etapes: [
          pw(10, n) + ' = ' + m(new Array(n + 1).join('10 \\times ') + '10').replace(' \\times \\)', '\\)'),
          'Chaque facteur 10 ajoute un zéro : il y en a donc <b>' + n + '</b>, autant que ' +
            'l\'exposant.',
          pw(10, n) + ' = <b>' + fr(v) + '</b>.'
        ],
        indices: ['Compte les facteurs 10 : chacun apporte un zéro.'],
        duree: 30
      };
    }
    // L'écriture inverse : de l'entier vers la puissance.
    var prop2 = rnd.melange([
      { c: 'bon', n: n }, { c: 'faux', n: n + 1 }, { c: 'faux', n: n - 1 },
      { c: 'faux', n: n + 2 }
    ]);
    return {
      enonce: 'Le nombre ' + m(fr(v).replace(/&nbsp;/g, '\\,')) + ' s\'écrit… ?',
      type: 'qcm',
      choix: prop2.map(function (p) { return pw(10, p.n); }),
      correct: prop2.map(function (p) { return p.c; }).indexOf('bon'),
      etapes: [
        'On compte les <b>zéros</b> de ' + m(fr(v).replace(/&nbsp;/g, '\\,')) + ' : il y en a <b>' +
          n + '</b>.',
        'Or ' + pw(10, 'n') + ' s\'écrit 1 suivi de n zéros : l\'exposant est donc <b>' + n +
          '</b>.',
        m(fr(v).replace(/&nbsp;/g, '\\,')) + ' = ' + pw(10, n) + '.'
      ],
      indices: ['Compte les zéros.',
                'L\'exposant d\'une puissance de 10, c\'est le nombre de zéros.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 3. Écrire en puissance, ou développer                                 */
  /* ===================================================================== */
  function qEcrire(rnd, palier) {
    var a = rnd.entier(2, 9), n = rnd.entier(2, palier <= 2 ? 4 : 6);
    while (a === n) n = rnd.entier(2, 6);
    var versPuissance = rnd.booleen(0.5);
    var produit = new Array(n + 1).join(a + ' \\times ').slice(0, -8);

    if (versPuissance) {
      var prop = rnd.melange([
        { c: 'bon', tex: a + '^{' + n + '}' },
        { c: 'inv', tex: n + '^{' + a + '}' },       // base et exposant échangés
        { c: 'mul', tex: a + ' \\times ' + n },      // l'exposant pris pour un facteur
        { c: 'som', tex: a + ' + ' + n }
      ]);
      return {
        enonce: 'Comment écrit-on plus simplement ' + m(produit) + ' ?',
        type: 'qcm',
        choix: prop.map(function (p) { return m(p.tex); }),
        correct: prop.map(function (p) { return p.c; }).indexOf('bon'),
        etapes: [
          'Il y a <b>' + n + ' facteurs</b>, tous égaux à <b>' + a + '</b>.',
          'Le nombre répété devient la <b>base</b>, et le nombre de facteurs l\'<b>exposant</b> : ' +
            m(produit + ' = ' + a + '^{' + n + '}') + '.',
          '✘ ' + pw(n, a) + ' échangerait les deux rôles, et ✘ ' + m(a + ' \\times ' + n) +
            ' prendrait l\'exposant pour un facteur : ' + m(a + ' \\times ' + n + ' = ' + (a * n)) +
            ', alors que ' + m(a + '^{' + n + '} = ' + puissance(a, n)) + '.'
        ],
        indices: ['Compte les facteurs : combien y en a-t-il ?',
                  'Le nombre répété va en bas, le nombre de fois en haut.'],
        duree: 40
      };
    }
    var prop2 = rnd.melange([
      { c: 'bon', tex: produit },
      { c: 'nfois', tex: new Array(a + 1).join(n + ' \\times ').slice(0, -8) },
      { c: 'mul', tex: a + ' \\times ' + n },
      { c: 'unDeMoins', tex: new Array(n).join(a + ' \\times ').slice(0, -8) }
    ]);
    return {
      enonce: 'Que vaut ' + pw(a, n) + ', écrit sous forme de produit ?',
      type: 'qcm',
      choix: prop2.map(function (p) { return m(p.tex); }),
      correct: prop2.map(function (p) { return p.c; }).indexOf('bon'),
      etapes: [
        pw(a, n) + ' est le produit de <b>' + n + '</b> facteurs tous égaux à <b>' + a + '</b>.',
        'On écrit donc ' + m(a) + ' <b>' + n + ' fois</b> : ' + m(produit) + '.',
        'Attention à ne pas en oublier un : l\'exposant compte les <b>facteurs</b>, pas les ' +
          'signes ×.'
      ],
      indices: ['L\'exposant dit combien de fois le nombre apparaît.',
                'Il faut écrire ' + m(String(a)) + ' exactement ' + n + ' fois.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 4. Calculer une petite puissance                                      */
  /* ===================================================================== */
  function qCalcul(rnd, palier) {
    var a, n;
    for (var i = 0; i < 200; i++) {
      a = rnd.entier(2, palier <= 2 ? 5 : 9);
      n = rnd.entier(2, palier <= 2 ? 3 : 5);
      if (a !== n && puissance(a, n) <= 3000) break;
    }
    if (a === n || puissance(a, n) > 3000) { a = 2; n = 5; }
    var v = puissance(a, n);
    // Le détail du calcul, de gauche à droite.
    var det = String(a), r = a;
    for (var k = 1; k < n; k++) { r *= a; det += ' \\times ' + a + ' = ' + r; }

    return {
      enonce: 'Calcule ' + pw(a, n) + '.',
      type: 'nombre', reponse: v,
      etapes: [
        pw(a, n) + ' = ' + m(new Array(n + 1).join(a + ' \\times ').slice(0, -8)) + ' : ' +
          n + ' facteurs égaux à ' + a + '.',
        'On multiplie de gauche à droite : ' + m(det) + '.',
        pw(a, n) + ' = <b>' + fr(v) + '</b>.' +
          (n === 2 ? ' (C\'est ' + a + ' au carré.)' : (n === 3 ? ' (C\'est ' + a + ' au cube.)' : ''))
      ],
      indices: ['Écris d\'abord le produit en entier, puis calcule pas à pas.',
                'Il y a ' + n + ' facteurs, pas ' + (n - 1) + '.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  /* 5. Les deux pièges du chapitre                                        */
  /* ===================================================================== */
  function qPiege(rnd, palier) {
    if (rnd.booleen(0.5)) {
      // 3⁴ ou 3 × 4 ?
      var a = rnd.entier(2, 6), n = rnd.entier(3, 5);
      while (a === n) n = rnd.entier(3, 5);
      var v = puissance(a, n), p = a * n;
      // Même précaution : la bonne réponse réserve sa valeur d'abord. Sans
      // cela, un leurre pourrait l'évincer — 2⁴ et 4² valent tous deux 16 —
      // et le rattrapage la remettrait en double.
      var vus = {}, choix = [{ c: 'bon', v: v }];
      vus[v] = 1;
      rnd.melange([{ c: 'mul', v: p }, { c: 'inv', v: puissance(n, a) },
                   { c: 'som', v: a + n }]).forEach(function (x) {
        if (!vus[x.v]) { vus[x.v] = 1; choix.push(x); }
      });
      var extra = v + 1;
      while (choix.length < 4) { if (!vus[extra]) { vus[extra] = 1; choix.push({ c: 'faux', v: extra }); } extra++; }
      choix = rnd.melange(choix);
      return {
        enonce: 'Combien vaut ' + pw(a, n) + ' ?',
        type: 'qcm',
        choix: choix.map(function (x) { return String(x.v); }),
        correct: choix.map(function (x) { return x.c; }).indexOf('bon'),
        etapes: [
          'L\'exposant <b>ne se multiplie pas</b> : il <b>compte</b> les facteurs.',
          pw(a, n) + ' = ' + m(new Array(n + 1).join(a + ' \\times ').slice(0, -8) + ' = ' + v) + '.',
          '✘ ' + m(a + ' \\times ' + n + ' = ' + p) + ' : c\'est l\'erreur classique, et le ' +
            'résultat n\'a rien à voir.',
          '✘ ' + pw(n, a) + ' = ' + m(String(puissance(n, a))) + ' : on ne peut pas échanger la ' +
            'base et l\'exposant.'
        ],
        indices: ['Développe d\'abord : écris le produit en entier.',
                  'L\'exposant compte les facteurs, il n\'en est pas un.'],
        duree: 45
      };
    }
    // 2³ ou 3² ? Deux puissances aux mêmes chiffres, échangés.
    var b = rnd.entier(2, 5), e = rnd.entier(2, 5);
    for (var i = 0; i < 60 && (b === e || puissance(b, e) === puissance(e, b)); i++) {
      e = rnd.entier(2, 5);
    }
    if (b === e || puissance(b, e) === puissance(e, b)) { b = 2; e = 5; }
    var v1 = puissance(b, e), v2 = puissance(e, b);
    var ordre = rnd.melange([
      { c: 'a', txt: pw(b, e) + ' est le plus grand' },
      { c: 'b', txt: pw(e, b) + ' est le plus grand' },
      { c: 'eg', txt: 'Ils sont égaux' }
    ]);
    return {
      enonce: 'Compare ' + pw(b, e) + ' et ' + pw(e, b) + '.',
      type: 'qcm',
      choix: ordre.map(function (x) { return x.txt; }),
      correct: ordre.map(function (x) { return x.c; }).indexOf(v1 > v2 ? 'a' : 'b'),
      etapes: [
        pw(b, e) + ' = ' + m(new Array(e + 1).join(b + ' \\times ').slice(0, -8) + ' = ' + v1) + '.',
        pw(e, b) + ' = ' + m(new Array(b + 1).join(e + ' \\times ').slice(0, -8) + ' = ' + v2) + '.',
        'Donc ' + m(v1 > v2 ? v1 + ' > ' + v2 : v1 + ' < ' + v2) + ' : c\'est <b>' +
          (v1 > v2 ? pw(b, e) : pw(e, b)) + '</b> le plus grand.',
        'La base et l\'exposant ne jouent pas le même rôle : les <b>échanger change le ' +
          'nombre</b>.'
      ],
      indices: ['Calcule les deux, il n\'y a pas de raccourci.',
                'Développe chaque puissance en produit.'],
      duree: 55
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: '\\(5^3\\) est le produit de <b>trois</b> facteurs égaux à 5.', ok: true,
      d: 'Oui : \\(5^3 = 5 \\times 5 \\times 5 = 125\\). L\'exposant compte les facteurs.' },
    { t: '\\(3^4 = 3 \\times 4\\).', ok: false,
      d: 'Non : \\(3^4 = 3 \\times 3 \\times 3 \\times 3 = 81\\), alors que ' +
         '\\(3 \\times 4 = 12\\). L\'exposant n\'est pas un facteur.' },
    { t: '\\(2^3\\) et \\(3^2\\) sont égaux.', ok: false,
      d: 'Non : \\(2^3 = 8\\) et \\(3^2 = 9\\). On ne peut pas échanger la base et l\'exposant.' },
    { t: '\\(10^5\\) s\'écrit 1 suivi de <b>5 zéros</b>.', ok: true,
      d: 'Oui : \\(10^5 = 100\\,000\\). Pour les puissances de 10, l\'exposant donne directement ' +
         'le nombre de zéros.' },
    { t: '\\(7^2\\) se lit « 7 au carré ».', ok: true,
      d: 'Oui, et \\(7^3\\) se lit « 7 au cube ». \\(7^2 = 49\\).' },
    { t: 'Dans \\(6^4\\), le nombre 6 s\'appelle l\'exposant.', ok: false,
      d: 'Non : 6 est la <b>base</b> — le nombre qu\'on répète. L\'exposant est 4, celui qui ' +
         'compte les facteurs.' },
    { t: '\\(1^{100} = 1\\).', ok: true,
      d: 'Oui : quel que soit le nombre de facteurs, multiplier des 1 entre eux donne toujours 1.' },
    { t: '\\(12^2 = 144\\).', ok: true,
      d: 'Oui — c\'est le dernier des carrés à connaître par cœur, de 0 à 12.' },
    { t: 'Le carré d\'un nombre entier est toujours plus grand que ce nombre.', ok: false,
      d: 'Non : \\(0^2 = 0\\) et \\(1^2 = 1\\). C\'est vrai à partir de 2, mais pas pour 0 ni ' +
         'pour 1.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Développe la puissance en produit : tout devient clair.'],
      duree: 35
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'puissances', competence: 'puissances', level: '5eme',
    titre: 'Découvrir les puissances', paliers: 4,

    genere: function (rnd, palier) {
      // Les carrés et les puissances de 10 reviennent à TOUS les paliers :
      // ce sont eux qui doivent finir par se savoir sans calculer.
      var quoi = rnd.choix(
        palier === 1 ? ['carres', 'carres', 'dix', 'ecrire', 'proprietes'] :
        palier === 2 ? ['carres', 'dix', 'dix', 'ecrire', 'calcul', 'proprietes'] :
        palier === 3 ? ['carres', 'dix', 'calcul', 'ecrire', 'piege', 'proprietes'] :
                       ['carres', 'dix', 'calcul', 'piege', 'piege', 'proprietes']);

      if (quoi === 'dix') return qDix(rnd, palier);
      if (quoi === 'ecrire') return qEcrire(rnd, palier);
      if (quoi === 'calcul') return qCalcul(rnd, palier);
      if (quoi === 'piege') return qPiege(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qCarres(rnd, palier);
    }
  });

})();
