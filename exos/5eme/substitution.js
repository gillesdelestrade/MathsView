/*
 * substitution — calculer une expression littérale en remplaçant la lettre par
 * sa valeur (leçon 5ème « Calculer une expression littérale »).
 *
 *   calcule     une expression, une valeur, un nombre à trouver ;
 *   negatif     la même chose avec une valeur NÉGATIVE — là où les parenthèses
 *               décident du résultat ;
 *   ecriture    quelle est la bonne écriture après substitution ? (les deux
 *               fautes classiques y sont : le × oublié, et les parenthèses) ;
 *   formule     une vraie formule — aire, poids, distance — avec son unité ;
 *   deux        une formule à deux lettres ;
 *   tableau     la même expression pour trois valeurs : on en demande une ;
 *   proprietes  vrai/faux sur ce qu'est une lettre.
 *
 * ---------------------------------------------------------------------------
 * Les nombres sont choisis pour que la faute se VOIE
 * ---------------------------------------------------------------------------
 * Dans « 3x avec x = 4 », l'élève qui oublie le signe × écrit 34 : la mauvaise
 * réponse est alors très loin de la bonne, et le générateur la propose comme
 * leurre. De même pour les parenthèses : avec x = −3, x² vaut 9 et −x² vaudrait
 * −9 — deux nombres opposés, impossible de tomber juste par hasard.
 *
 * Les coefficients restent entiers et les valeurs de la lettre aussi, si bien
 * que toutes les réponses sont exactes. Les seules décimales viennent des vraies
 * formules (9,81 × m, 3,14 × r²), et elles tombent au centième près.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var PI = 3.14;
  function fr(v) { return O.fr(Math.round(v * 100) / 100); }
  // Entre parenthèses dès que c'est négatif : la règle qu'on veut installer.
  function par(v) { return v < 0 ? '(' + fr(v) + ')' : fr(v); }
  function tex(s) { return '\\(' + s + '\\)'; }

  /* ===================================================================== */
  /* Les expressions littérales                                            */
  /* ===================================================================== */
  /* Chacune sait s'écrire, s'écrire une fois substituée, et se calculer. Les
     trois viennent du même endroit : impossible que l'énoncé, la correction et
     la réponse racontent trois choses différentes. */
  function affine(rnd) {
    var a = rnd.choix([2, 3, 4, 5, 6, 10]), b = rnd.entier(1, 12);
    var moins = rnd.booleen(0.35);
    return {
      ecrit: a + 'x ' + (moins ? '−' : '+') + ' ' + b,
      subst: function (x) { return a + ' × ' + par(x) + ' ' + (moins ? '−' : '+') + ' ' + b; },
      f: function (x) { return a * x + (moins ? -b : b); },
      detail: function (x) {
        return [a + ' × ' + par(x) + ' = ' + fr(a * x),
                fr(a * x) + ' ' + (moins ? '−' : '+') + ' ' + b + ' = ' + fr(a * x + (moins ? -b : b))];
      }
    };
  }
  function carre(rnd) {
    var a = rnd.entier(1, 5);
    return {
      ecrit: 'x² ' + (rnd.booleen(0.5) ? '+ ' : '− ') + a + 'x',
      construit: function (plus) {
        return {
          ecrit: 'x² ' + (plus ? '+ ' : '− ') + a + 'x',
          subst: function (x) {
            return par(x) + ' × ' + par(x) + ' ' + (plus ? '+' : '−') + ' ' + a + ' × ' + par(x);
          },
          f: function (x) { return x * x + (plus ? a * x : -a * x); },
          detail: function (x) {
            return [par(x) + ' × ' + par(x) + ' = ' + fr(x * x),
                    a + ' × ' + par(x) + ' = ' + fr(a * x),
                    fr(x * x) + ' ' + (plus ? '+' : '−') + ' ' + fr(a * x) + ' = ' +
                      fr(x * x + (plus ? a * x : -a * x))];
          }
        };
      }
    };
  }
  function facteur(rnd) {
    var a = rnd.entier(2, 6), b = rnd.entier(1, 9);
    var moins = rnd.booleen(0.3);
    return {
      ecrit: a + '(x ' + (moins ? '−' : '+') + ' ' + b + ')',
      subst: function (x) {
        return a + ' × (' + fr(x) + ' ' + (moins ? '−' : '+') + ' ' + b + ')';
      },
      f: function (x) { return a * (x + (moins ? -b : b)); },
      detail: function (x) {
        var d = x + (moins ? -b : b);
        return ['la parenthèse d\'abord : ' + fr(x) + ' ' + (moins ? '−' : '+') + ' ' + b +
                  ' = ' + fr(d),
                a + ' × ' + par(d) + ' = ' + fr(a * d)];
      }
    };
  }
  function tireExpr(rnd, palier) {
    var quoi = rnd.choix(palier <= 2 ? [affine, affine, facteur] : [affine, facteur, 'carre']);
    if (quoi === 'carre') return carre(rnd).construit(rnd.booleen(0.5));
    return quoi(rnd);
  }

  /* ===================================================================== */
  /* Les formules du réel                                                  */
  /* ===================================================================== */
  var FORMULES = [
    { nom: 'S', quoi: 'l\'aire d\'un disque de rayon r', ecrit: 'S = 3,14 × r²',
      lettre: 'r', unite: 'cm²', uLettre: 'cm', min: 2, max: 12,
      subst: function (v) { return 'S = 3,14 × ' + par(v) + ' × ' + par(v); },
      f: function (v) { return PI * v * v; },
      detail: function (v) { return [par(v) + ' × ' + par(v) + ' = ' + fr(v * v),
                                     '3,14 × ' + fr(v * v) + ' = ' + fr(PI * v * v)]; } },
    { nom: 'P', quoi: 'le poids d\'un objet de masse m', ecrit: 'P = 9,81 × m',
      lettre: 'm', unite: 'N', uLettre: 'kg', min: 1, max: 40,
      subst: function (v) { return 'P = 9,81 × ' + fr(v); },
      f: function (v) { return 9.81 * v; },
      detail: function (v) { return ['9,81 × ' + fr(v) + ' = ' + fr(9.81 * v)]; } },
    { nom: 'd', quoi: 'la distance parcourue à la vitesse v pendant 3 heures',
      ecrit: 'd = v × 3', lettre: 'v', unite: 'km', uLettre: 'km/h', min: 10, max: 120,
      subst: function (v) { return 'd = ' + fr(v) + ' × 3'; },
      f: function (v) { return v * 3; },
      detail: function (v) { return [fr(v) + ' × 3 = ' + fr(v * 3)]; } },
    { nom: 'p', quoi: 'le périmètre d\'un carré de côté c', ecrit: 'p = 4 × c',
      lettre: 'c', unite: 'cm', uLettre: 'cm', min: 2, max: 25,
      subst: function (v) { return 'p = 4 × ' + fr(v); },
      f: function (v) { return 4 * v; },
      detail: function (v) { return ['4 × ' + fr(v) + ' = ' + fr(4 * v)]; } }
  ];

  var RAPPEL = 'Une lettre est un <b>nombre</b> : on la remplace par sa valeur, ' +
    '<b>entre parenthèses</b>, puis on calcule.';

  function correction(e, x, lettre) {
    return [RAPPEL,
      'On rétablit les signes × sous-entendus, puis on remplace ' + tex(lettre) + ' par ' +
        tex(par(x)) + ' : ' + tex(e.subst(x)) + '.',
      'Il ne reste qu\'un calcul, dans l\'ordre des priorités : ' +
        e.detail(x).join(', puis ') + '.'];
  }

  /* ===================================================================== */
  /* 1. Calculer, valeur positive puis négative                            */
  /* ===================================================================== */
  function qCalcule(rnd, palier, negatif) {
    var e = tireExpr(rnd, palier);
    var x = negatif ? -rnd.entier(1, 8) : rnd.entier(1, 10);
    return {
      enonce: 'On donne l\'expression ' + tex('A = ' + e.ecrit) + '.<br>' +
        '<b>Calcule ' + tex('A') + ' pour ' + tex('x = ' + fr(x)) + '.</b>',
      type: 'nombre',
      reponse: e.f(x),
      etapes: correction(e, x, 'x').concat(negatif ? [
        '<b>Le rôle des parenthèses.</b> On écrit ' + tex(par(x)) + ' et non ' + fr(x) +
          ' tout nu : sans elles, ' + tex('x^2') + ' deviendrait ' + tex('-' + fr(-x) + '^2') +
          ', qui vaut l\'<b>opposé</b> du bon résultat. Sur un nombre positif cela ne change ' +
          'rien — c\'est bien pour cela qu\'on prend l\'habitude sur les négatifs.'
      ] : []),
      indices: ['Remplace chaque ' + tex('x') + ' par ' + tex(par(x)) + ', puis calcule.',
                negatif ? 'N\'oublie pas les parenthèses autour du nombre négatif.'
                        : 'Attention aux priorités : la multiplication avant l\'addition.'],
      duree: negatif ? 110 : 90
    };
  }

  /* ===================================================================== */
  /* 2. Quelle est la bonne écriture ?                                     */
  /* ===================================================================== */
  function qEcriture(rnd, palier) {
    /* Les leurres doivent être FAUX en valeur, pas seulement en écriture : avec
       a = 2 et x = 2, « 2 + 2 » donne le même nombre que « 2 × 2 », et deux
       propositions seraient alors également justes. On retire donc ces
       coïncidences. */
    var a, b, x;
    for (var essai = 0; essai < 200; essai++) {
      a = rnd.choix([2, 3, 4, 5, 6]);
      b = rnd.entier(2, 9);
      x = rnd.booleen(0.4) ? -rnd.entier(2, 6) : rnd.entier(2, 9);
      var vrai = a * x + b;
      if (a + x + b === vrai) continue;          // le × devenu +
      if (a * x * b === vrai) continue;          // le + devenu ×
      break;
    }
    var expr = a + 'x + ' + b;
    var bonne = a + ' × ' + par(x) + ' + ' + b;

    var faux = [
      // le signe × oublié : les chiffres se collent
      String(a) + fr(Math.abs(x)) + ' + ' + b,
      // le × devenu +
      a + ' + ' + par(x) + ' + ' + b,
      // le nombre ajouté à la lettre au lieu d'être multiplié
      a + ' × ' + par(x) + ' × ' + b
    ];
    var vues = {}, props = [{ t: bonne, bon: true }];
    vues[bonne] = 1;
    faux.forEach(function (t) {
      if (vues[t]) return;
      vues[t] = 1;
      props.push({ t: t, bon: false });
    });
    props = rnd.melange(props);

    return {
      enonce: 'On veut calculer ' + tex('A = ' + expr) + ' pour ' + tex('x = ' + fr(x)) +
        '.<br><b>Quelle écriture obtient-on après avoir remplacé ' + tex('x') +
        ' par sa valeur ?</b>',
      type: 'qcm',
      choix: props.map(function (p) { return tex(p.t.replace(/−/g, '-')); }),
      correct: props.map(function (p) { return p.bon; }).indexOf(true),
      etapes: [
        'Dans ' + tex(a + 'x') + ', le signe × est <b>sous-entendu</b> : cela veut dire ' +
          tex(a + ' \\times x') + '. Il faut le <b>rétablir</b> avant de remplacer.',
        'On obtient ' + tex(bonne.replace(/−/g, '-')) + '.',
        '<b>La faute à éviter</b> : écrire ' + tex(String(a) + fr(Math.abs(x))) +
          ' en collant les chiffres. ' + tex(a + 'x') + ' n\'est pas un nombre à deux ' +
          'chiffres, c\'est une multiplication.',
        x < 0 ? 'Et la valeur négative se met <b>entre parenthèses</b> : ' + tex(par(x)) + '.'
              : 'Sur un nombre positif les parenthèses ne changent rien, mais on les met ' +
                'quand même : c\'est l\'habitude qui sauve, le jour où la valeur est négative.'
      ],
      indices: ['Que veut dire ' + tex(a + 'x') + ' exactement ?',
                'Le signe × est caché : il faut le remettre.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 3. Une vraie formule, avec son unité                                  */
  /* ===================================================================== */
  function qFormule(rnd, palier) {
    var f = rnd.choix(FORMULES);
    var v = rnd.entier(f.min, f.max);
    return {
      enonce: 'La formule ' + tex(f.ecrit.replace(/,/g, '{,}')) + ' donne ' + f.quoi + '.<br>' +
        '<b>Calcule ' + tex(f.nom) + ' pour ' + tex(f.lettre + ' = ' + fr(v)) + ' ' +
        f.uLettre + '.</b>',
      type: 'nombre',
      reponse: Math.round(f.f(v) * 100) / 100,
      etapes: [RAPPEL,
        'On remplace ' + tex(f.lettre) + ' par ' + tex(fr(v)) + ' : ' +
          tex(f.subst(v).replace(/,/g, '{,}')) + '.',
        'On calcule : ' + f.detail(v).join(', puis ') + '.',
        '<b>Résultat : ' + f.nom + ' = ' + fr(f.f(v)) + ' ' + f.unite + '.</b> ' +
          'L\'unité suit la grandeur : ' + tex(f.lettre) + ' était en ' + f.uLettre + ', ' +
          'le résultat est en ' + f.unite + '.'],
      indices: ['Remplace ' + tex(f.lettre) + ' par ' + fr(v) + ' dans la formule.',
                'N\'oublie pas de donner l\'unité dans ta phrase de réponse.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 4. Deux lettres à la fois                                             */
  /* ===================================================================== */
  function qDeux(rnd, palier) {
    var quoi = rnd.choix([
      { ecrit: 'P = 2 × (L + l)', quoi: 'le périmètre d\'un rectangle', unite: 'cm',
        l1: 'L', l2: 'l', min: 2, max: 18,
        subst: function (a, b) { return 'P = 2 × (' + fr(a) + ' + ' + fr(b) + ')'; },
        f: function (a, b) { return 2 * (a + b); },
        detail: function (a, b) { return ['la parenthèse d\'abord : ' + fr(a) + ' + ' + fr(b) +
          ' = ' + fr(a + b), '2 × ' + fr(a + b) + ' = ' + fr(2 * (a + b))]; } },
      { ecrit: 'A = b × h ÷ 2', quoi: 'l\'aire d\'un triangle', unite: 'cm²',
        l1: 'b', l2: 'h', min: 2, max: 16,
        subst: function (a, b) { return 'A = ' + fr(a) + ' × ' + fr(b) + ' ÷ 2'; },
        f: function (a, b) { return a * b / 2; },
        detail: function (a, b) { return [fr(a) + ' × ' + fr(b) + ' = ' + fr(a * b),
          fr(a * b) + ' ÷ 2 = ' + fr(a * b / 2)]; } },
      { ecrit: 'd = v × t', quoi: 'la distance parcourue', unite: 'km',
        l1: 'v', l2: 't', min: 2, max: 12,
        subst: function (a, b) { return 'd = ' + fr(a) + ' × ' + fr(b); },
        f: function (a, b) { return a * b; },
        detail: function (a, b) { return [fr(a) + ' × ' + fr(b) + ' = ' + fr(a * b)]; } }
    ]);
    var a = rnd.entier(quoi.min, quoi.max), b = rnd.entier(quoi.min, quoi.max);
    if (quoi.l1 === 'v') a = rnd.entier(5, 12) * 10;      // une vitesse plausible

    return {
      enonce: 'La formule ' + tex(quoi.ecrit) + ' donne ' + quoi.quoi + '.<br>' +
        '<b>Calcule pour ' + tex(quoi.l1 + ' = ' + fr(a)) + ' et ' +
        tex(quoi.l2 + ' = ' + fr(b)) + '.</b>',
      type: 'nombre',
      reponse: Math.round(quoi.f(a, b) * 100) / 100,
      etapes: [RAPPEL,
        'Ici il y a <b>deux</b> lettres : on remplace les deux, chacune par sa valeur. ' +
          'On obtient ' + tex(quoi.subst(a, b)) + '.',
        'On calcule : ' + quoi.detail(a, b).join(', puis ') + '.',
        '<b>Résultat : ' + fr(quoi.f(a, b)) + ' ' + quoi.unite + '.</b>'],
      indices: ['Remplace ' + tex(quoi.l1) + ' et ' + tex(quoi.l2) + ' par leurs valeurs.',
                'Puis calcule dans l\'ordre des priorités.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 5. Une case du tableau de valeurs                                     */
  /* ===================================================================== */
  function qTableau(rnd, palier) {
    var e = tireExpr(rnd, palier);
    var xs = rnd.melange([-3, -1, 0, 2, 4, 5]).slice(0, 3).sort(function (u, v) {
      return u - v;
    });
    var k = rnd.entier(0, 2);
    var lignes = xs.map(function (x, i) {
      return '<td>' + (i === k ? '<b>?</b>' : O.fr(e.f(x))) + '</td>';
    }).join('');

    return {
      enonce: 'Voici un tableau de valeurs de l\'expression ' + tex('A = ' + e.ecrit) +
        '.<br><table class="exo-tab"><tr><th>x</th>' +
        xs.map(function (x) { return '<td>' + O.fr(x) + '</td>'; }).join('') + '</tr>' +
        '<tr><th>A</th>' + lignes + '</tr></table>' +
        '<b>Quelle valeur manque, celle pour ' + tex('x = ' + O.fr(xs[k])) + ' ?</b>',
      type: 'nombre',
      reponse: e.f(xs[k]),
      etapes: correction(e, xs[k], 'x').concat([
        '<b>Une formule n\'est pas un calcul.</b> La même expression donne un résultat ' +
          '<b>différent pour chaque valeur</b> de la lettre — c\'est tout l\'intérêt d\'un ' +
          'tableau de valeurs.'
      ]),
      indices: ['Refais le même travail que pour les autres colonnes, avec ' +
                  tex('x = ' + O.fr(xs[k])) + '.',
                'Remplace, puis calcule.'],
      duree: 110
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Dans une formule, une lettre représente un <b>nombre</b>.', ok: true,
      d: 'Oui — celui qu\'on ne connaît pas encore. Dès qu\'on le connaît, on le met à sa ' +
         'place et la formule redevient un calcul ordinaire.' },
    { t: 'Pour \\(x = 4\\), l\'expression \\(3x\\) vaut <b>34</b>.', ok: false,
      d: 'Non : \\(3x\\) veut dire \\(3 \\times x\\). Pour \\(x = 4\\) cela fait ' +
         '\\(3 \\times 4 = 12\\). Le signe × est sous-entendu, pas absent.' },
    { t: 'Pour \\(x = 5\\), l\'expression \\(2x + 1\\) vaut <b>11</b>.', ok: true,
      d: 'Oui : \\(2 \\times 5 + 1 = 10 + 1 = 11\\). La multiplication avant l\'addition.' },
    { t: 'Pour \\(x = -3\\), l\'expression \\(x^2\\) vaut <b>−9</b>.', ok: false,
      d: 'Non : \\(x^2 = (-3)^2 = (-3) \\times (-3) = 9\\). C\'est \\(-3^2\\) qui vaudrait ' +
         '−9 — et ce n\'est pas la même chose. D\'où les parenthèses.' },
    { t: 'Une même expression peut donner des résultats différents.', ok: true,
      d: 'Oui, selon la valeur donnée à la lettre. C\'est même ce qui fait la force d\'une ' +
         'formule : elle vaut pour tous les nombres à la fois.' },
    { t: 'Si \\(r\\) est en cm, alors \\(3{,}14 \\times r^2\\) est en <b>cm</b>.', ok: false,
      d: 'Non : c\'est une <b>aire</b>, donc en <b>cm²</b>. La lettre porte un nombre, mais ' +
         'la grandeur qu\'elle mesure porte une unité, et le calcul la transforme.' },
    { t: 'On peut calculer \\(2x + 3\\) sans connaître \\(x\\).', ok: false,
      d: 'Non : tant que \\(x\\) est inconnu, l\'expression ne vaut aucun nombre précis. On ' +
         'peut la transformer (la réduire, la développer), mais pas la calculer.' },
    { t: 'Pour \\(x = 0\\), l\'expression \\(5x + 7\\) vaut <b>7</b>.', ok: true,
      d: 'Oui : \\(5 \\times 0 + 7 = 0 + 7 = 7\\). Multiplier par zéro donne zéro, il ne ' +
         'reste que le 7.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d, RAPPEL],
      indices: ['Une lettre est un nombre : remplace, puis calcule.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'substitution', competence: 'substitution', level: '5eme',
    titre: 'Calculer une expression littérale', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'calcule', 'ecriture', 'formule'] :
        palier === 2 ? ['calcule', 'ecriture', 'formule', 'tableau', 'proprietes'] :
        palier === 3 ? ['negatif', 'calcule', 'deux', 'tableau', 'formule', 'ecriture'] :
                       ['negatif', 'negatif', 'deux', 'tableau', 'calcule']);

      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      if (quoi === 'ecriture') return qEcriture(rnd, palier);
      if (quoi === 'formule') return qFormule(rnd, palier);
      if (quoi === 'deux') return qDeux(rnd, palier);
      if (quoi === 'tableau') return qTableau(rnd, palier);
      if (quoi === 'negatif') return qCalcule(rnd, palier, true);
      return qCalcule(rnd, palier, false);
    }
  });

})();
