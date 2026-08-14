/*
 * variations — lire un sens de variation dans un tableau de valeurs produit par
 * un script Python (2nde, leçon « Variations et tableau de variations »).
 *
 * ---------------------------------------------------------------------------
 * Le principe
 * ---------------------------------------------------------------------------
 * L'énoncé donne un SCRIPT, pas une courbe. L'élève l'exécute — dans la console
 * de la page, ou sur sa calculatrice, où le même programme donne les mêmes
 * lignes — puis répond sur ce qu'il affiche : où la colonne se retourne, quel
 * est le plus petit nombre affiché, combien de lignes sortent, sur quel
 * intervalle f décroît.
 *
 * Deux compétences se travaillent donc en même temps, et c'est voulu : lire un
 * tableau de valeurs, et comprendre la boucle qui l'a produit. La deuxième
 * n'est pas un décor — range ne compte que d'entier en entier, si bien qu'un
 * pas de 0,5 s'obtient en bouclant sur des entiers et en divisant. C'est
 * exactement là que les scripts se trompent.
 *
 * ---------------------------------------------------------------------------
 * Ce qui est garanti
 * ---------------------------------------------------------------------------
 *   — le sommet de la fonction tombe TOUJOURS sur un point de la grille, sinon
 *     le tableau ne montrerait pas le retournement au bon endroit ;
 *   — les réponses sont calculées sur le tableau ARRONDI comme print l'affiche
 *     (arrondi au pair de Python, qui n'est pas celui de JavaScript), jamais sur
 *     les valeurs exactes : on interroge ce que l'élève voit ;
 *   — le vocabulaire reste prudent — « d'après le tableau, f SEMBLE croissante ».
 *     Un tableau de valeurs ne démontre rien, et une des familles de questions
 *     porte précisément là-dessus.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  /* ===================================================================== */
  /* Les fonctions, avec leur écriture Python                              */
  /* ===================================================================== */
  /* Chacune sait se calculer, s'écrire au tableau et s'écrire en Python. Le
     sommet est donné, pas cherché : c'est lui qui décide de la grille. */

  function trinome(rnd) {
    // a(x − s)² + k, développé : le sommet est en s, sur la grille par
    // construction. a entier non nul pour que les valeurs restent lisibles.
    var a = rnd.choix([1, 1, 2, -1, -2]);
    var s = rnd.entier(-3, 3);
    var k = rnd.entier(-6, 6);
    var b = -2 * a * s, c = a * s * s + k;
    return {
      f: function (x) { return a * x * x + b * x + c; },
      py: pyPoly([[a, 2], [b, 1], [c, 0]]),
      html: htmlPoly([[a, 2], [b, 1], [c, 0]]),
      sommets: [{ x: s, creux: a > 0 }],
      // un sommet entier tombe aussi sur une grille de 0,5 : le pas peut varier
      den: rnd.choix([1, 1, 2])
    };
  }

  function valeurAbsolue(rnd) {
    // |x − s| + k : un sommet anguleux, toujours un minimum (ou un maximum si
    // on met un moins devant).
    var s = rnd.entier(-3, 3), k = rnd.entier(-4, 4);
    var neg = rnd.booleen(0.3);
    return {
      f: function (x) { return (neg ? -1 : 1) * Math.abs(x - s) + k; },
      py: (neg ? '-' : '') + 'abs(' + pyDecal(s) + ')' + finConstante(k),
      html: (neg ? '−' : '') + '|' + htmlDecal(s) + '|' + finHtml(k),
      sommets: [{ x: s, creux: !neg }],
      den: rnd.choix([1, 2])
    };
  }

  function cubiqueDouble(rnd) {
    // x³ − 3k²x : deux sommets, en −k et en +k. Les seules cubiques dont les
    // sommets tombent sur des entiers.
    var k = rnd.entier(1, 2), signe = rnd.booleen(0.25) ? -1 : 1;
    var c = 3 * k * k;
    return {
      f: function (x) { return signe * (x * x * x - c * x); },
      py: (signe < 0 ? '-(x**3 - ' + c + '*x)' : 'x**3 - ' + c + '*x'),
      html: (signe < 0 ? '−(x³ − ' + c + 'x)' : 'x³ − ' + c + 'x'),
      sommets: [{ x: -k, creux: signe < 0 }, { x: k, creux: signe > 0 }],
      den: 1
    };
  }

  function affine(rnd) {
    var a = rnd.choix([-3, -2, -1, 1, 2, 3]), b = rnd.entier(-5, 5);
    return {
      f: function (x) { return a * x + b; },
      py: pyPoly([[a, 1], [b, 0]]),
      html: htmlPoly([[a, 1], [b, 0]]),
      sommets: [], den: 1
    };
  }

  function racine(rnd) {
    var k = rnd.entier(0, 3);
    return {
      f: function (x) { return Math.sqrt(x) + k; },
      py: 'sqrt(x)' + finConstante(k),
      html: '√x' + finHtml(k),
      imports: ['from math import sqrt'], garde: 'x >= 0',
      defini: function (x) { return x >= 0; },
      sommets: [], den: 1
    };
  }

  function inverse(rnd) {
    var k = rnd.entier(-2, 2);
    return {
      f: function (x) { return 1 / x + k; },
      py: '1 / x' + finConstante(k),
      html: '1/x' + finHtml(k),
      garde: 'x != 0',
      defini: function (x) { return x !== 0; },
      sommets: [], den: 1, decroit: true
    };
  }

  /* -- l'écriture des polynômes, des deux côtés ----------------------- */
  function pyPoly(termes) {
    var s = '';
    termes.forEach(function (t) {
      var c = t[0], d = t[1];
      if (c === 0) return;
      // un moins en TÊTE se colle au terme : « -2*x**2 », pas « - 2*x**2 »
      var signe = c < 0 ? (s ? ' - ' : '-') : (s ? ' + ' : '');
      var abs = Math.abs(c);
      var corps = d === 0 ? String(abs)
                : (abs === 1 ? '' : abs + '*') + (d === 1 ? 'x' : 'x**' + d);
      s += signe + corps;
    });
    return s || '0';
  }
  function htmlPoly(termes) {
    var s = '';
    termes.forEach(function (t) {
      var c = t[0], d = t[1];
      if (c === 0) return;
      var signe = c < 0 ? (s ? ' − ' : '−') : (s ? ' + ' : '');
      var abs = Math.abs(c);
      var corps = d === 0 ? String(abs)
                : (abs === 1 ? '' : String(abs)) + (d === 1 ? 'x' : 'x' + ['', '', '²', '³'][d]);
      s += signe + corps;
    });
    return s || '0';
  }
  /* « x − s », sans les maladresses : x − (−1) s'écrit x + 1, et x − 0 s'écrit x. */
  function pyDecal(s) { return s === 0 ? 'x' : (s > 0 ? 'x - ' + s : 'x + ' + (-s)); }
  function htmlDecal(s) { return s === 0 ? 'x' : (s > 0 ? 'x − ' + s : 'x + ' + (-s)); }

  function finConstante(k) { return k === 0 ? '' : (k > 0 ? ' + ' + k : ' - ' + (-k)); }
  function finHtml(k) { return k === 0 ? '' : (k > 0 ? ' + ' + k : ' − ' + (-k)); }

  var FAMILLES = [trinome, valeurAbsolue, cubiqueDouble, affine, racine, inverse];

  /* ===================================================================== */
  /* La grille, le script, le tableau affiché                              */
  /* ===================================================================== */
  /* L'arrondi de Python vise le PAIR le plus proche quand on tombe pile au
     milieu : round(0.625, 2) donne 0.62, pas 0.63. On interroge ce que print
     affiche, donc on arrondit comme lui. */
  function arrondiPython(x, n) {
    var f = Math.pow(10, n), y = x * f;
    var bas = Math.floor(y), r = y - bas;
    var e = Math.abs(r - 0.5) < 1e-9 ? (bas % 2 === 0 ? bas : bas + 1) : Math.round(y);
    return e / f;
  }
  // Ce que print écrit d'un nombre : « 3 » pour un entier, « 3.0 » pour un
  // flottant entier, comme Python.
  function ecrit(v, flottant) {
    if (!flottant && Number.isInteger(v)) return String(v);
    var s = String(v);
    return /^-?\d+$/.test(s) ? s + '.0' : s;
  }
  function fr(v) { return O.fr(v); }

  function grille(F, x1, x2, den) {
    var out = [];
    for (var i = Math.round(x1 * den); i <= Math.round(x2 * den); i++) {
      var x = den === 1 ? i : i / den;
      if (F.defini && !F.defini(x)) continue;
      out.push({ x: x, exact: F.f(x) });
    }
    return out;
  }
  /* Le tableau tel qu'il s'affiche, arrondi comme le script le fera. */
  function tableau(F, x1, x2, den) {
    var brut = grille(F, x1, x2, den);
    var entier = brut.every(function (v) { return Number.isInteger(v.exact); });
    var dec = entier ? null : 2;
    return {
      dec: dec,
      lignes: brut.map(function (v) {
        return { x: v.x, y: dec === null ? v.exact : arrondiPython(v.exact, dec) };
      })
    };
  }
  function script(F, x1, x2, den, dec) {
    var L = [];
    (F.imports || []).forEach(function (im) { L.push(im); });
    if (L.length) L.push('');
    L.push('def f(x):');
    L.push('    return ' + F.py);
    L.push('');
    var appel = dec === null ? 'f(x)' : 'round(f(x), ' + dec + ')';
    if (den === 1) {
      L.push('for x in range(' + x1 + ', ' + (x2 + 1) + '):');
      if (F.garde) { L.push('    if ' + F.garde + ':'); L.push('        print(x, ' + appel + ')'); }
      else L.push('    print(x, ' + appel + ')');
    } else {
      L.push('for i in range(' + (x1 * den) + ', ' + (x2 * den + 1) + '):');
      L.push('    x = i / ' + den);
      if (F.garde) { L.push('    if ' + F.garde + ':'); L.push('        print(x, ' + appel + ')'); }
      else L.push('    print(x, ' + appel + ')');
    }
    return L.join('\n');
  }

  /* La console, posée sous l'énoncé. C'est le même composant que la leçon. */
  function console_(src) {
    return function (zone) {
      MathsConsole.monte(zone, {
        script: src, lignes: Math.min(12, src.split('\n').length + 1),
        titre: 'Le script',
        aide: 'Appuie sur <b>Exécuter</b> — ou tape le script sur ta calculatrice, ' +
              'il y donnera exactement les mêmes lignes.'
      });
    };
  }

  /* Un tirage complet : une fonction, une fenêtre où ses sommets tombent.
     `denForce` impose le pas — les questions sur les bogues du « for » n'ont
     de sens qu'avec un pas décimal, il faut donc pouvoir l'exiger. */
  function tire(rnd, palier, denForce) {
    var F = rnd.choix(palier === 1 ? [affine, trinome, valeurAbsolue]
                    : palier === 2 ? [trinome, valeurAbsolue, affine, racine]
                    : palier === 3 ? [trinome, valeurAbsolue, cubiqueDouble, inverse, racine]
                                   : FAMILLES)(rnd);
    // La fenêtre : tous les sommets dedans, et de la marge de chaque côté pour
    // qu'on voie bien la colonne se retourner AVANT et APRÈS.
    var xs = F.sommets.map(function (s) { return s.x; });
    var lo = xs.length ? Math.min.apply(null, xs) : 0;
    var hi = xs.length ? Math.max.apply(null, xs) : 0;
    var x1 = Math.max(-9, lo - rnd.entier(2, 4));
    var x2 = Math.min(9, hi + rnd.entier(2, 4));
    if (F.defini && !F.defini(x1)) x1 = 1;                 // √x : on part de 1
    if (F.garde === 'x >= 0') x1 = Math.max(x1, 0);
    // un sommet entier tombe sur toutes ces grilles : forcer le pas ne le
    // décale jamais
    var den = denForce || F.den;
    var T = tableau(F, x1, x2, den);
    return { F: F, x1: x1, x2: x2, den: den, T: T,
             src: script(F, x1, x2, den, T.dec) };
  }

  function inter(a, b) { return '[' + fr(a) + ' ; ' + fr(b) + ']'; }

  /* ===================================================================== */
  /* 1. Sur quel intervalle f semble-t-elle croître / décroître ?          */
  /* ===================================================================== */
  function qSens(rnd, palier) {
    var t = tire(rnd, palier);
    var S = t.F.sommets;
    if (!S.length) return qExtremum(rnd, palier);          // sans sommet, pas de découpe
    var s = rnd.choix(S);
    var i = S.indexOf(s);
    // le morceau à gauche du sommet, puis celui à droite
    var gA = i === 0 ? t.x1 : S[i - 1].x, gB = s.x;
    var dA = s.x, dB = (i === S.length - 1) ? t.x2 : S[i + 1].x;
    // à gauche du sommet : la fonction va VERS un creux → elle décroît
    var croitAGauche = !s.creux;
    var veutCroissant = rnd.booleen(0.5);
    var bon = veutCroissant === croitAGauche ? inter(gA, gB) : inter(dA, dB);

    /* Les mauvaises réponses doivent être VRAIMENT mauvaises. Un sous-intervalle
       du bon intervalle conviendrait tout autant — la question aurait alors deux
       réponses. On ne propose donc que des intervalles qui ENJAMBENT le
       retournement (la fonction y change de sens, donc aucun des deux mots ne
       s'y applique), plus l'autre versant du sommet, où le sens est l'inverse. */
    var serreG = Math.max(t.x1, s.x - rnd.entier(1, 2));
    var serreD = Math.min(t.x2, s.x + rnd.entier(1, 2));
    var props = rnd.melange([
      bon,
      veutCroissant === croitAGauche ? inter(dA, dB) : inter(gA, gB),
      inter(t.x1, t.x2),
      inter(serreG, serreD)
    ].filter(function (v, k, arr) { return arr.indexOf(v) === k; }));

    return {
      enonce: 'Voici un script qui affiche un tableau de valeurs de la fonction ' +
        '\\(f\\) définie par <b>f(x) = ' + t.F.html + '</b>.<br>Exécute-le, puis lis la ' +
        'colonne de droite.<br><b>Sur quel intervalle \\(f\\) semble-t-elle ' +
        (veutCroissant ? 'croissante' : 'décroissante') + ' ?</b>',
      type: 'qcm',
      outil: console_(t.src),
      choix: props,
      correct: props.indexOf(bon),
      etapes: [
        'Le script affiche les valeurs de \\(x\\) <b>dans l\'ordre croissant</b>. Il suffit ' +
          'donc de suivre la colonne de droite de haut en bas : tant qu\'elle augmente, ' +
          '\\(f\\) croît ; dès qu\'elle diminue, \\(f\\) décroît.',
        'Ici la colonne se retourne en <b>x = ' + fr(s.x) + '</b> : c\'est un <b>' +
          (s.creux ? 'minimum' : 'maximum') + '</b>.',
        '\\(f\\) est donc ' + (veutCroissant ? 'croissante' : 'décroissante') +
          ' sur <b>' + bon + '</b>.',
        '<b>Attention au mot « semble ».</b> Un tableau ne donne que des valeurs choisies : ' +
          'entre deux d\'entre elles, on ne sait rien. Il fournit une <b>conjecture</b>, ' +
          'pas une démonstration.'
      ],
      indices: ['Suis la colonne de droite de haut en bas, et repère la ligne où elle ' +
                'change de sens.',
                'Le retournement a lieu en x = ' + fr(s.x) + '.'],
      duree: 240
    };
  }

  /* ===================================================================== */
  /* 2. L'extremum affiché                                                 */
  /* ===================================================================== */
  function qExtremum(rnd, palier) {
    var t = tire(rnd, palier);
    var L = t.T.lignes;
    var mini = rnd.booleen(0.5);
    var best = L[0];
    L.forEach(function (v) {
      if (mini ? v.y < best.y : v.y > best.y) best = v;
    });
    // deux lignes ne doivent pas se partager l'extremum : la réponse serait double
    var exaequo = L.filter(function (v) { return v.y === best.y; });
    if (exaequo.length > 1) return qCombien(rnd, palier);

    var surX = rnd.booleen(0.5);
    return {
      enonce: 'Le script ci-dessous affiche un tableau de valeurs de \\(f\\), avec ' +
        '<b>f(x) = ' + t.F.html + '</b>.<br>Exécute-le.<br><b>' +
        (surX ? 'Pour quelle valeur de \\(x\\) la ' + (mini ? 'plus petite' : 'plus grande') +
                ' valeur est-elle affichée ?'
              : 'Quelle est la ' + (mini ? 'plus petite' : 'plus grande') +
                ' valeur affichée ?') + '</b>',
      type: 'nombre',
      outil: console_(t.src),
      reponse: surX ? best.x : best.y,
      etapes: [
        'On parcourt la colonne de droite et on retient la ' +
          (mini ? 'plus petite' : 'plus grande') + ' valeur.',
        'C\'est <b>' + fr(best.y) + '</b>, affichée pour <b>x = ' + fr(best.x) + '</b>. ' +
          'La ligne est donc « ' + ecrit(best.x, t.den !== 1) + ' ' +
          ecrit(best.y, t.T.dec !== null) + ' ».',
        (t.F.sommets.length
          ? 'Sur cette fenêtre, \\(f\\) admet donc un <b>' + (mini ? 'minimum' : 'maximum') +
            '</b> en ' + fr(best.x) + ', égal à ' + fr(best.y) + '.'
          : '\\(f\\) est monotone ici : l\'extremum est atteint à une <b>borne</b> de la ' +
            'fenêtre, pas à un sommet. Changer les bornes du script changerait la réponse.')
      ],
      indices: ['Lis la colonne de droite, ligne par ligne.',
                'La ' + (mini ? 'plus petite' : 'plus grande') + ' valeur est ' +
                fr(best.y) + '.'],
      duree: 200
    };
  }

  /* ===================================================================== */
  /* 3. Combien de lignes le script affiche-t-il ?                         */
  /* ===================================================================== */
  function qCombien(rnd, palier) {
    var t = tire(rnd, palier);
    return {
      enonce: 'Sans forcément l\'exécuter, réponds : <b>combien de lignes ce script ' +
        'affiche-t-il ?</b>',
      type: 'nombre',
      outil: console_(t.src),
      reponse: t.T.lignes.length,
      etapes: [
        t.den === 1
          ? '\\(\\texttt{range(' + t.x1 + ', ' + (t.x2 + 1) + ')}\\) parcourt les entiers ' +
            'de <b>' + fr(t.x1) + '</b> à <b>' + fr(t.x2) + '</b> : la borne de droite est ' +
            '<b>exclue</b>. Cela fait ' + fr(t.x2 + 1) + ' − ' + O.par(t.x1) + ' = <b>' +
            (t.x2 - t.x1 + 1) + '</b> tours de boucle.'
          : '\\(\\texttt{range(' + (t.x1 * t.den) + ', ' + (t.x2 * t.den + 1) + ')}\\) fait ' +
            '<b>' + (t.x2 * t.den - t.x1 * t.den + 1) + '</b> tours ; chacun donne un ' +
            '\\(x\\) valant \\(i/' + t.den + '\\).',
        t.F.garde
          ? 'Mais le test <b>' + t.F.garde.replace('>=', '⩾').replace('!=', '≠') +
            '</b> écarte les \\(x\\) qui n\'ont pas d\'image : il ne reste que <b>' +
            t.T.lignes.length + '</b> lignes affichées.'
          : 'Chaque tour affiche une ligne : <b>' + t.T.lignes.length + '</b> lignes.',
        '<b>Le piège habituel</b> : croire que \\(\\texttt{range(a, b)}\\) va jusqu\'à b. ' +
          'Il s\'arrête <b>juste avant</b>. Pour aller jusqu\'à b compris, il faut écrire ' +
          '\\(\\texttt{range(a, b + 1)}\\).'
      ],
      indices: ['\\(\\texttt{range(a, b)}\\) s\'arrête <b>avant</b> b : cela fait b − a valeurs.',
                t.F.garde ? 'Attention : le test « if » écarte certaines valeurs.'
                          : 'Chaque tour de boucle affiche exactement une ligne.'],
      duree: 150
    };
  }

  /* ===================================================================== */
  /* 4. Que vaut f pour un x donné, tel que le script l'affiche ?          */
  /* ===================================================================== */
  function qValeur(rnd, palier) {
    var t = tire(rnd, palier);
    var v = rnd.choix(t.T.lignes);
    return {
      enonce: 'Exécute le script ci-dessous, puis lis la ligne qui commence par ' +
        '<b>' + ecrit(v.x, t.den !== 1) + '</b>.<br><b>Quelle valeur y est affichée ' +
        'à côté ?</b>',
      type: 'nombre',
      outil: console_(t.src),
      reponse: v.y,
      etapes: [
        'La ligne affichée est « <b>' + ecrit(v.x, t.den !== 1) + ' ' +
          ecrit(v.y, t.T.dec !== null) + '</b> ».',
        'Le calcul : \\(f(' + fr(v.x) + ')\\) = ' + fr(t.F.f(v.x)) +
          (t.T.dec !== null && t.F.f(v.x) !== v.y
            ? ', que \\(\\texttt{round(f(x), 2)}\\) arrondit à <b>' + fr(v.y) + '</b>.'
            : '.'),
        t.T.dec !== null
          ? 'Le script arrondit à 2 décimales : c\'est la valeur <b>arrondie</b> qui ' +
            's\'affiche, pas la valeur exacte.'
          : 'Ici toutes les valeurs sont entières : le script n\'a pas besoin d\'arrondir.'
      ],
      indices: ['Repère la ligne dont le premier nombre est ' + ecrit(v.x, t.den !== 1) + '.',
                'La réponse est le second nombre de cette ligne.'],
      duree: 150
    };
  }

  /* ===================================================================== */
  /* 5. Le script fautif                                                   */
  /* ===================================================================== */
  var BOGUES = [
    {
      casse: function (src, t) { return src.replace(/range\((-?\d+), (-?\d+)\)/,
        function (m, a, b) { return 'range(' + a + ', ' + (parseInt(b, 10) - 1) + ')'; }); },
      quoi: 'Il manque la dernière ligne : \\(\\texttt{range}\\) s\'arrête <b>avant</b> sa ' +
            'borne de droite, il faut donc écrire \\(\\texttt{b + 1}\\) pour aller jusqu\'à b.',
      choix: 'Il affiche une ligne de moins que prévu.'
    },
    {
      casse: function (src, t) { return src.replace('    x = i / ' + t.den + '\n', ''); },
      quoi: 'La variable \\(\\texttt{x}\\) n\'est jamais calculée : le script s\'arrête sur ' +
            'une erreur, car \\(\\texttt{x}\\) n\'existe pas.',
      choix: 'Il s\'arrête sur une erreur : x n\'est pas défini.',
      exigeDen: true
    },
    {
      casse: function (src, t) {
        return src.replace(/for i in range\((-?\d+), (-?\d+)\)/,
          function (m, a, b) { return 'for x in range(' + (a / t.den) + ', ' +
            (Math.round(b / t.den)) + ', 0.5)'; }).replace('    x = i / ' + t.den + '\n', '');
      },
      quoi: '\\(\\texttt{range}\\) ne compte que d\'entier en entier : un pas de 0,5 est ' +
            '<b>refusé</b>. C\'est pour cela qu\'on boucle sur des entiers et qu\'on divise.',
      choix: 'Il s\'arrête sur une erreur : range n\'accepte pas un pas décimal.',
      exigeDen: true
    }
  ];

  function qBogue(rnd, palier) {
    // On choisit d'abord la panne, et on tire ENSUITE un script qui puisse la
    // porter : sinon les deux pannes les plus instructives — celles qui
    // touchent au pas décimal — ne sortiraient presque jamais.
    var b = rnd.choix(BOGUES);
    var t = tire(rnd, palier, b.exigeDen ? 2 : 0);
    var casse = b.casse(t.src, t);
    if (casse === t.src) return qCombien(rnd, palier);      // rien n'a été cassé

    var props = rnd.melange([
      { t: b.choix, bon: true },
      { t: 'Il affiche exactement le bon tableau.', bon: false },
      { t: 'Il affiche toutes les valeurs, mais dans le désordre.', bon: false },
      { t: 'Il affiche deux fois chaque ligne.', bon: false }
    ]);
    return {
      enonce: 'Ce script <b>ne fait pas ce qu\'on voulait</b> : il devait afficher les ' +
        'valeurs de \\(f\\) pour \\(x\\) allant de ' + fr(t.x1) + ' à ' + fr(t.x2) +
        (t.den === 1 ? ' de 1 en 1' : ' par pas de ' + fr(1 / t.den)) + '.<br>' +
        '<b>Que se passe-t-il ?</b> (tu peux l\'exécuter pour voir)',
      type: 'qcm',
      outil: console_(casse),
      choix: props.map(function (p) { return p.t; }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: [b.quoi,
        'Le script correct est celui-ci :<br><pre class="exo-code">' +
          O.echappe(t.src) + '</pre>'],
      indices: ['Exécute-le et compare ce qui sort avec ce qui était demandé.',
                'Regarde de près la ligne du \\(\\texttt{for}\\).'],
      duree: 200
    };
  }

  /* ===================================================================== */
  /* 6. Écrire la bonne boucle                                             */
  /* ===================================================================== */
  function qBoucle(rnd, palier) {
    var den = rnd.choix([2, 4, 10]);
    var x1 = rnd.entier(-4, 0), x2 = x1 + rnd.entier(2, 5);
    var bon = 'for i in range(' + (x1 * den) + ', ' + (x2 * den + 1) + '):\n' +
              '    x = i / ' + den;
    var props = rnd.melange([
      { t: bon, bon: true },
      { t: 'for x in range(' + x1 + ', ' + (x2 + 1) + ', ' + fr(1 / den).replace(',', '.') +
           '):', bon: false },
      { t: 'for i in range(' + (x1 * den) + ', ' + (x2 * den) + '):\n    x = i / ' + den,
        bon: false },
      { t: 'for i in range(' + x1 + ', ' + (x2 + 1) + '):\n    x = i / ' + den, bon: false }
    ]);
    return {
      enonce: 'On veut afficher les valeurs de \\(f\\) pour \\(x\\) allant de <b>' + fr(x1) +
        '</b> à <b>' + fr(x2) + '</b> inclus, <b>par pas de ' + fr(1 / den) + '</b>.<br>' +
        'Quelle boucle écrire ?',
      type: 'qcm',
      choix: props.map(function (p) { return '<pre class="exo-code">' + O.echappe(p.t) + '</pre>'; }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: [
        '\\(\\texttt{range}\\) ne connaît que les <b>entiers</b> : on ne peut pas lui ' +
          'demander un pas de ' + fr(1 / den) + '. On boucle donc sur des entiers, et on ' +
          'divise pour obtenir \\(x\\).',
        'Pour un pas de ' + fr(1 / den) + ', on divise par <b>' + den + '</b>. Il faut donc ' +
          'que \\(i\\) aille de ' + fr(x1) + ' × ' + den + ' = <b>' + (x1 * den) + '</b> à ' +
          fr(x2) + ' × ' + den + ' = <b>' + (x2 * den) + '</b>, cette dernière valeur ' +
          '<b>comprise</b>.',
        'D\'où \\(\\texttt{range(' + (x1 * den) + ', ' + (x2 * den + 1) + ')}\\) — le ' +
          '<b>+ 1</b> parce que la borne de droite est exclue — puis ' +
          '\\(\\texttt{x = i / ' + den + '}\\).'
      ],
      indices: ['\\(\\texttt{range}\\) refuse un pas décimal : il faut boucler sur des entiers.',
                'N\'oublie pas le « + 1 » : la borne de droite de range est exclue.'],
      duree: 150
    };
  }

  /* ===================================================================== */
  /* 7. Ce qu'un tableau prouve — et ce qu'il ne prouve pas                */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Si toutes les valeurs affichées augmentent, alors \\(f\\) est <b>certainement</b> ' +
         'croissante sur l\'intervalle.', ok: false,
      d: 'Non. Le tableau ne donne que des valeurs <b>choisies</b> : entre deux d\'entre ' +
         'elles, \\(f\\) peut très bien redescendre puis remonter. Un tableau fournit une ' +
         '<b>conjecture</b>, qu\'il faut ensuite démontrer.' },
    { t: 'Resserrer le pas rend la conjecture plus sûre, sans jamais la démontrer.',
      ok: true,
      d: 'Oui : avec plus de points on risque moins de manquer un accident, mais il ' +
         'restera toujours des trous entre les valeurs calculées.' },
    { t: '\\(\\texttt{range(0, 10)}\\) parcourt les entiers de 0 à 10 <b>inclus</b>.',
      ok: false,
      d: 'Non : la borne de droite est <b>exclue</b>. Il parcourt 0, 1, …, 9, soit ' +
         '<b>10</b> valeurs. Pour aller jusqu\'à 10, il faut \\(\\texttt{range(0, 11)}\\).' },
    { t: '\\(\\texttt{range(-5, 6)}\\) affiche 11 valeurs.', ok: true,
      d: 'Oui : de −5 à 5 inclus, cela fait 6 − (−5) = 11 valeurs.' },
    { t: 'On peut écrire \\(\\texttt{range(0, 5, 0.5)}\\) pour avancer de 0,5 en 0,5.',
      ok: false,
      d: 'Non : \\(\\texttt{range}\\) n\'accepte que des entiers. On boucle sur des entiers ' +
         'et on divise : \\(\\texttt{for i in range(0, 11)}\\) puis \\(\\texttt{x = i / 2}\\).' },
    { t: 'En Python, \\(\\texttt{3 / 2}\\) vaut \\(1{,}5\\).', ok: true,
      d: 'Oui : la barre de division donne toujours un nombre à virgule, même entre deux ' +
         'entiers. C\'est \\(\\texttt{3 // 2}\\) qui vaut 1.' },
    { t: 'Le plus petit nombre affiché est forcément le minimum de \\(f\\) sur \\(\\mathbb{R}\\).',
      ok: false,
      d: 'Non : c\'est le plus petit <b>parmi les valeurs calculées</b>, sur la <b>fenêtre ' +
         'choisie</b>. En dehors, ou entre deux points, \\(f\\) peut descendre plus bas.' },
    { t: 'Si la colonne des \\(f(x)\\) diminue puis augmente, \\(f\\) semble admettre un ' +
         '<b>minimum</b> au retournement.', ok: true,
      d: 'Oui — et c\'est exactement ce que résume le tableau de variations : une flèche ' +
         'qui descend, puis une qui monte, avec la valeur du minimum entre les deux.' }
  ];

  function qConjecture(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Un tableau de valeurs <b>suggère</b> ; il ne démontre pas.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'variations', competence: 'variations', level: '2nde',
    titre: 'Variations et tableau de valeurs', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['conjecture', 'valeur', 'combien', 'extremum'] :
        palier === 2 ? ['valeur', 'extremum', 'sens', 'combien', 'conjecture'] :
        palier === 3 ? ['sens', 'sens', 'extremum', 'boucle', 'bogue', 'conjecture'] :
                       ['sens', 'bogue', 'boucle', 'extremum', 'conjecture']);

      if (quoi === 'conjecture') return qConjecture(rnd, palier);
      if (quoi === 'valeur') return qValeur(rnd, palier);
      if (quoi === 'combien') return qCombien(rnd, palier);
      if (quoi === 'extremum') return qExtremum(rnd, palier);
      if (quoi === 'boucle') return qBoucle(rnd, palier);
      if (quoi === 'bogue') return qBogue(rnd, palier);
      return qSens(rnd, palier);
    }
  });

})();
