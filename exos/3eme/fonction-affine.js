/*
 * fn-affine — retrouver une fonction affine (3ème, leçon « Fonction affine
 * (par 2 points) »).
 *
 * ---------------------------------------------------------------------------
 * Le fil conducteur
 * ---------------------------------------------------------------------------
 * Une droite non verticale, c'est deux nombres : le coefficient directeur m —
 * de combien on monte quand on avance de 1 — et l'ordonnée à l'origine p — où
 * la droite coupe l'axe vertical. Tout le chapitre consiste à passer d'une
 * représentation à l'autre : de deux points à l'équation, de l'équation à un
 * graphique, d'un graphique aux deux nombres.
 *
 * Les familles suivent ce va-et-vient : calculer m, calculer p, écrire
 * l'équation, la lire sur un dessin, s'en servir pour une image ou un
 * antécédent, dire si un point est sur la droite, et les propriétés (le sens
 * de variation, le cas vertical qui n'est pas une fonction).
 *
 * ---------------------------------------------------------------------------
 * Comment les nombres sont choisis
 * ---------------------------------------------------------------------------
 * On tire la DROITE d'abord — m = mn/md sous forme réduite, p entier — puis on
 * prend ses points aux abscisses multiples de md. Ainsi A et B ont toujours des
 * coordonnées entières, m est exactement mn/md, et p ne traîne pas de virgule.
 * Là où l'élève doit taper m, on s'en tient à md = 1 ou 2, pour que la réponse
 * s'écrive exactement (3 ou 1,5) ; les tiers et les quarts n'apparaissent que
 * dans les questions à choix, où la fraction est écrite telle quelle.
 *
 * Les mauvaises réponses ne sont pas décoratives : ce sont les erreurs qu'on
 * fait vraiment — le rapport inversé Δx/Δy, le signe de p oublié, m et p
 * échangés.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var R = RepereOutils;

  var BLEU = '#2563eb', VERT = '#0d9488', ORANGE = '#ea580c';

  /* ===================================================================== */
  /* Tirer une droite, et deux de ses points                               */
  /* ===================================================================== */
  /* `denoms` : les dénominateurs autorisés pour m. On ne met 3 ou 4 que
     lorsque la réponse n'a pas à être tapée au clavier. */
  function tireDroite(rnd, denoms, maxN) {
    var md = rnd.choix(denoms || [1, 1, 1, 2]);
    var mn, M = maxN || 6;
    do { mn = rnd.entier(-M, M); } while (mn === 0 || O.pgcd(Math.abs(mn), md) !== 1);
    var p = rnd.entier(-6, 6);
    // Les abscisses multiples de md : ce sont celles qui donnent un y entier.
    var i1 = rnd.entier(-3, 1), i2 = i1 + rnd.entier(1, 3);
    var xA = i1 * md, xB = i2 * md;
    return {
      mn: mn, md: md, m: mn / md, p: p,
      A: [xA, (mn * xA) / md + p],
      B: [xB, (mn * xB) / md + p],
      y: function (x) { return (mn * x) / md + p; }
    };
  }

  /* -- écriture -------------------------------------------------------
     Deux jeux, et il faut s'y tenir : `…Tex` pour ce qui part dans un bloc
     \( … \), où une fraction s'écrit \dfrac ; `…Txt` pour la prose, où
     « 3/2 » se lit très bien et où le moins est le vrai signe français. */
  function mTex(d) { return d.md === 1 ? O.tex(d.mn) : O.fracTex(d.mn, d.md); }
  function mTxt(d) { return d.md === 1 ? O.fr(d.mn) : O.fracTxt(d.mn, d.md); }

  function equationTex(d) {
    var t = d.mn === d.md ? 'x' : d.mn === -d.md ? '-x' : mTex(d) + 'x';
    if (d.p === 0) return 'y = ' + t;
    return 'y = ' + t + (d.p > 0 ? ' + ' + d.p : ' - ' + (-d.p));
  }
  function equationTxt(d) {
    var t = d.mn === d.md ? 'x' : d.mn === -d.md ? '−x' : mTxt(d) + 'x';
    if (d.p === 0) return 'y = ' + t;
    return 'y = ' + t + (d.p > 0 ? ' + ' + d.p : ' − ' + (-d.p));
  }
  function fTex(d) { return equationTex(d).replace('y =', 'f(x) ='); }
  function coord(P) { return '(' + O.fr(P[0]) + ' ; ' + O.fr(P[1]) + ')'; }

  /* La figure : la droite, et selon les cas les deux points qui la définissent. */
  function figure(d, avecPoints, cadre) {
    return R.repere({
      droites: [{ m: d.m, p: d.p, couleur: BLEU, nom: '(d)' }],
      points: avecPoints ? [{ p: d.A, nom: 'A', couleur: VERT },
                            { p: d.B, nom: 'B', couleur: VERT }] : [],
      cadre: (cadre || []).concat([d.A, d.B])
    });
  }

  /* ===================================================================== */
  /* 1. Calculer le coefficient directeur                                  */
  /* ===================================================================== */
  function qCoefficient(rnd, palier) {
    var d = tireDroite(rnd, palier <= 2 ? [1, 1, 1] : [1, 1, 2]);
    var dx = d.B[0] - d.A[0], dy = d.B[1] - d.A[1];
    return {
      enonce: 'La droite \\((d)\\) passe par les points \\(A\\,' + coord(d.A) +
        '\\) et \\(B\\,' + coord(d.B) + '\\).<br><b>Calcule son coefficient ' +
        'directeur \\(m\\).</b>',
      type: 'nombre',
      reponse: d.m,
      etapes: [
        'Le coefficient directeur est le rapport de la <b>montée</b> sur ' +
          'l\'<b>avancée</b> : \\(m = \\dfrac{y_B - y_A}{x_B - x_A}\\).',
        'Ici \\(\\Delta y = ' + O.fr(d.B[1]) + ' - ' + O.par(d.A[1]) + ' = ' + O.fr(dy) +
          '\\) et \\(\\Delta x = ' + O.fr(d.B[0]) + ' - ' + O.par(d.A[0]) + ' = ' +
          O.fr(dx) + '\\).',
        'Donc \\(m = \\dfrac{' + O.fr(dy) + '}{' + O.fr(dx) + '} = ' + mTex(d) + '\\)' +
          (d.md === 1
            ? ' : quand on avance de 1, on ' + (d.mn > 0 ? 'monte' : 'descend') + ' de ' +
              Math.abs(d.mn) + '.'
            : '.'),
        '<b>L\'erreur à éviter</b> : écrire \\(\\dfrac{x_B - x_A}{y_B - y_A}\\). C\'est ' +
          'la montée qu\'on divise par l\'avancée, pas l\'inverse.'
      ],
      indices: ['\\(m = \\dfrac{y_B - y_A}{x_B - x_A}\\) — la différence des ordonnées ' +
                'sur celle des abscisses.',
                '\\(\\Delta y = ' + O.fr(dy) + '\\) et \\(\\Delta x = ' + O.fr(dx) + '\\).'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 2. Calculer l'ordonnée à l'origine                                    */
  /* ===================================================================== */
  function qOrdonnee(rnd, palier) {
    var d = tireDroite(rnd, palier <= 2 ? [1, 1, 1] : [1, 1, 2]);
    var parM = palier >= 2 && rnd.booleen(0.5);   // m est-il donné ?
    return {
      enonce: parM
        ? 'Une droite a pour coefficient directeur \\(m = ' + mTex(d) + '\\) et passe par ' +
          'le point \\(A\\,' + coord(d.A) + '\\).<br><b>Calcule son ordonnée à ' +
          'l\'origine \\(p\\).</b>'
        : 'La droite passe par \\(A\\,' + coord(d.A) + '\\) et \\(B\\,' + coord(d.B) +
          '\\).<br><b>Calcule son ordonnée à l\'origine \\(p\\).</b>',
      type: 'nombre',
      reponse: d.p,
      etapes: ([]).concat(
        parM ? [] : ['D\'abord le coefficient directeur : \\(m = \\dfrac{' +
          O.fr(d.B[1] - d.A[1]) + '}{' + O.fr(d.B[0] - d.A[0]) + '} = ' + mTex(d) + '\\).'],
        ['Le point \\(A\\) est sur la droite, donc ses coordonnées vérifient ' +
          '\\(y = mx + p\\) : \\(' + O.fr(d.A[1]) + ' = ' + mTex(d) + ' \\times ' +
          O.par(d.A[0]) + ' + p\\).',
         '\\(' + mTex(d) + ' \\times ' + O.par(d.A[0]) + ' = ' + O.fr(d.m * d.A[0]) +
          '\\), donc \\(p = ' + O.fr(d.A[1]) + ' - ' + O.par(d.m * d.A[0]) + ' = <b>' +
          O.fr(d.p) + '</b>\\).',
         'On peut vérifier avec \\(B\\) : ' + mTxt(d) + ' × ' + O.par(d.B[0]) + ' + ' +
          O.par(d.p) + ' = ' + O.fr(d.B[1]) + ' ✓. Et \\(p\\) est bien l\'ordonnée du ' +
          'point où la droite coupe l\'axe vertical.']),
      indices: ['Remplace \\(x\\) et \\(y\\) par les coordonnées de \\(A\\) dans ' +
                '\\(y = mx + p\\).',
                '\\(p = y_A - m\\,x_A\\).'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 3. Écrire l'équation                                                  */
  /* ===================================================================== */
  function qEquation(rnd, palier) {
    var d = tireDroite(rnd, palier <= 2 ? [1, 1, 1] : [1, 1, 2, 2, 3, 4]);
    // Les leurres : les erreurs qu'on fait vraiment.
    var inverse = { mn: d.B[0] - d.A[0], md: d.B[1] - d.A[1], p: d.p };   // Δx/Δy
    if (inverse.md < 0) { inverse.mn = -inverse.mn; inverse.md = -inverse.md; }
    var g = O.pgcd(Math.abs(inverse.mn), Math.abs(inverse.md)) || 1;
    inverse.mn /= g; inverse.md /= g;

    var faux = [
      { mn: d.mn, md: d.md, p: -d.p },                       // signe de p oublié
      { mn: -d.mn, md: d.md, p: d.p },                       // signe de m oublié
      inverse.md !== 0 ? inverse : { mn: d.p, md: 1, p: d.mn }   // rapport inversé
    ];
    var vues = { }, props = [{ d: d, bon: true }];
    vues[equationTex(d)] = 1;
    faux.forEach(function (f) {
      var e = equationTex(f);
      if (vues[e]) return;
      vues[e] = 1;
      props.push({ d: f, bon: false });
    });
    if (props.length < 3) return qCoefficient(rnd, palier);
    props = rnd.melange(props);

    return {
      enonce: 'Une droite passe par \\(A\\,' + coord(d.A) + '\\) et \\(B\\,' + coord(d.B) +
        '\\).<br><b>Quelle est son équation ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return '\\(' + equationTex(x.d) + '\\)'; }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [
        '\\(m = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{' + O.fr(d.B[1] - d.A[1]) + '}{' +
          O.fr(d.B[0] - d.A[0]) + '} = ' + mTex(d) + '\\).',
        'Puis \\(p = y_A - m\\,x_A = ' + O.fr(d.A[1]) + ' - ' + O.par(d.m * d.A[0]) + ' = ' +
          O.fr(d.p) + '\\).',
        'L\'équation est donc <b>' + equationTxt(d) + '</b>.',
        'Pour vérifier sans se fatiguer, on remplace : avec \\(x = ' + O.fr(d.B[0]) +
          '\\), on doit retomber sur \\(y = ' + O.fr(d.B[1]) + '\\).'
      ],
      indices: ['Commence par le coefficient directeur, puis remplace dans \\(y = mx + p\\).',
                'Une équation fausse se repère en y remplaçant \\(x\\) par ' + O.fr(d.A[0]) +
                ' : on doit trouver ' + O.fr(d.A[1]) + '.'],
      duree: 150
    };
  }

  /* ===================================================================== */
  /* 4. Lire la droite sur un graphique                                    */
  /* ===================================================================== */
  function qLecture(rnd, palier) {
    // Sur un quadrillage, une pente de 6 ne se COMPTE pas : la droite traverse
    // le cadre presque à la verticale. On s'en tient à des inclinaisons qu'un
    // œil peut suivre carreau par carreau.
    var d = tireDroite(rnd, palier <= 2 ? [1, 1] : [1, 1, 2], 3);
    var quoi = palier <= 1 ? 'p' : rnd.choix(['m', 'p', 'equation']);

    if (quoi === 'equation') {
      var props = rnd.melange([
        { t: equationTex(d), bon: true },
        { t: equationTex({ mn: d.mn, md: d.md, p: -d.p }), bon: false },
        { t: equationTex({ mn: -d.mn, md: d.md, p: d.p }), bon: false },
        { t: equationTex({ mn: d.p, md: 1, p: d.mn }), bon: false }
      ].filter(function (x, i, arr) {
        return arr.findIndex(function (y) { return y.t === x.t; }) === i;
      }));
      if (props.length < 3) return qLecture(rnd, 1);
      return {
        enonce: 'Voici la droite \\((d)\\) dans un repère.<br><b>Quelle est son ' +
          'équation ?</b>' + figure(d, false),
        type: 'qcm',
        choix: props.map(function (x) { return '\\(' + x.t + '\\)'; }),
        correct: props.map(function (x) { return x.bon; }).indexOf(true),
        etapes: [
          'On lit d\'abord <b>où la droite coupe l\'axe vertical</b> : c\'est ' +
            '\\(p = ' + O.fr(d.p) + '\\).',
          'Puis on compte : en avançant de ' + (d.md === 1 ? '1' : O.fr(d.md)) +
            ' vers la droite, la droite ' + (d.mn > 0 ? 'monte' : 'descend') + ' de ' +
            Math.abs(d.mn) + '. Donc \\(m = ' + mTex(d) + '\\).',
          'L\'équation est <b>' + equationTxt(d) + '</b>.'
        ],
        indices: ['L\'ordonnée à l\'origine se lit là où la droite croise l\'axe vertical.',
                  'Pour \\(m\\), compte de combien on monte quand on avance de 1.'],
        duree: 150
      };
    }

    var estM = quoi === 'm';
    return {
      enonce: 'Voici la droite \\((d)\\) dans un repère.<br><b>Lis ' +
        (estM ? 'son coefficient directeur \\(m\\)' : 'son ordonnée à l\'origine \\(p\\)') +
        '.</b>' + figure(d, false),
      type: 'nombre',
      reponse: estM ? d.m : d.p,
      etapes: estM
        ? ['Le coefficient directeur se <b>compte sur le quadrillage</b> : on part d\'un ' +
             'point de la droite, on avance de 1 vers la droite, et on regarde de combien ' +
             'on ' + (d.mn > 0 ? 'monte' : 'descend') + '.',
           'Ici, en avançant de ' + (d.md === 1 ? '1' : O.fr(d.md)) + ', la droite ' +
             (d.mn > 0 ? 'monte' : 'descend') + ' de ' + Math.abs(d.mn) + ' : ' +
             '\\(m = ' + mTex(d) + '\\).',
           'Le signe se voit tout de suite : une droite qui <b>' +
             (d.mn > 0 ? 'monte' : 'descend') + '</b> de gauche à droite a un coefficient ' +
             '<b>' + (d.mn > 0 ? 'positif' : 'négatif') + '</b>.']
        : ['L\'ordonnée à l\'origine, c\'est l\'ordonnée du point où la droite <b>coupe ' +
             'l\'axe vertical</b> — celui des \\(y\\).',
           'On lit \\(p = <b>' + O.fr(d.p) + '</b>\\).',
           'C\'est aussi \\(f(0)\\) : en remplaçant \\(x\\) par 0 dans \\(y = mx + p\\), ' +
             'il ne reste que \\(p\\).'],
      indices: estM
        ? ['Pars d\'un point où la droite passe par un coin du quadrillage.',
           'Avance de 1, compte la montée : c\'est \\(m\\).']
        : ['Regarde l\'axe vertical.', 'C\'est la valeur de \\(f(0)\\).'],
      duree: 120
    };
  }

  /* ===================================================================== */
  /* 5. Image et antécédent                                                */
  /* ===================================================================== */
  function qImage(rnd, palier) {
    var d = tireDroite(rnd, [1, 1, 2]);
    var antecedent = palier >= 3 && rnd.booleen(0.5);
    // une abscisse qui donne une image entière
    var x = rnd.entier(-4, 4) * d.md;
    var y = d.y(x);

    if (antecedent) {
      return {
        enonce: 'Soit \\(f\\) la fonction affine définie par \\(' +
          fTex(d) + '\\).<br><b>Quel nombre a pour image ' + O.fr(y) +
          ' ?</b>',
        type: 'nombre',
        reponse: x,
        etapes: [
          'On cherche \\(x\\) tel que \\(' + mTex(d) + 'x' +
            (d.p >= 0 ? ' + ' + d.p : ' - ' + (-d.p)) + ' = ' + O.fr(y) + '\\).',
          'On enlève ' + O.fr(d.p) + ' des deux côtés : \\(' + mTex(d) + 'x = ' +
            O.fr(y) + ' - ' + O.par(d.p) + ' = ' + O.fr(y - d.p) + '\\).',
          'Puis on divise par ' + mTxt(d) + ' : \\(x = ' + O.fr(y - d.p) + ' \\div ' +
            mTex(d) + ' = <b>' + O.fr(x) + '</b>\\).',
          'Vérification : \\(f(' + O.fr(x) + ') = ' + O.fr(y) + '\\) ✓.'
        ],
        indices: ['Il s\'agit de résoudre l\'équation \\(' + mTex(d) + 'x' +
                  (d.p >= 0 ? ' + ' + d.p : ' - ' + (-d.p)) + ' = ' + O.fr(y) + '\\).',
                  'Commence par isoler le terme en \\(x\\).'],
        duree: 120
      };
    }
    return {
      enonce: 'Soit \\(f\\) la fonction affine définie par \\(' +
        fTex(d) + '\\).<br><b>Calcule \\(f(' + O.fr(x) + ')\\).</b>',
      type: 'nombre',
      reponse: y,
      etapes: [
        'On remplace \\(x\\) par ' + O.par(x) + ' : \\(f(' + O.fr(x) + ') = ' + mTex(d) +
          ' \\times ' + O.par(x) + (d.p >= 0 ? ' + ' + d.p : ' - ' + (-d.p)) + '\\).',
        '\\(' + mTex(d) + ' \\times ' + O.par(x) + ' = ' + O.fr(d.m * x) + '\\), donc ' +
          '\\(f(' + O.fr(x) + ') = ' + O.fr(d.m * x) + (d.p >= 0 ? ' + ' + d.p
            : ' - ' + (-d.p)) + ' = <b>' + O.fr(y) + '</b>\\).',
        'Autrement dit, le point ' + coord([x, y]) + ' est sur la droite.'
      ],
      indices: ['Remplace \\(x\\) par ' + O.par(x) + ' dans l\'expression.',
                'Attention aux signes en multipliant.'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 6. Ce point est-il sur la droite ?                                    */
  /* ===================================================================== */
  function qAppartient(rnd, palier) {
    var d = tireDroite(rnd, [1, 1, 2]);
    var x = rnd.entier(-4, 4) * d.md;
    var dessus = rnd.booleen(0.5);
    // à côté : on décale l'ordonnée, jamais de 0
    var y = d.y(x) + (dessus ? 0 : (rnd.booleen(0.5) ? 1 : -1) * rnd.entier(1, 3));
    var vrai = Math.abs(y - d.y(x)) < 1e-9;

    return {
      enonce: 'Soit \\(f\\) définie par \\(' + fTex(d) + '\\).<br>' +
        'Vrai ou faux : <b>le point \\(C\\,' + coord([x, y]) + '\\) est sur la droite ' +
        'représentant \\(f\\).</b>',
      type: 'vraifaux',
      correct: vrai ? 0 : 1,
      etapes: [
        'Un point est sur la droite exactement lorsque ses coordonnées <b>vérifient ' +
          'l\'équation</b>. On calcule donc \\(f(' + O.fr(x) + ')\\) et on compare à ' +
          'l\'ordonnée de \\(C\\).',
        '\\(f(' + O.fr(x) + ') = ' + mTex(d) + ' \\times ' + O.par(x) +
          (d.p >= 0 ? ' + ' + d.p : ' - ' + (-d.p)) + ' = ' + O.fr(d.y(x)) + '\\).',
        vrai
          ? 'C\'est bien l\'ordonnée de \\(C\\) : le point est <b>sur</b> la droite.'
          : 'Or \\(C\\) a pour ordonnée ' + O.fr(y) + ', et ' + O.fr(y) + ' ≠ ' +
            O.fr(d.y(x)) + ' : le point n\'est <b>pas</b> sur la droite. Il est ' +
            (y > d.y(x) ? 'au-dessus' : 'au-dessous') + '.'
      ],
      indices: ['Calcule \\(f(' + O.fr(x) + ')\\).',
                'Compare le résultat à l\'ordonnée de \\(C\\).'],
      duree: 90
    };
  }

  /* ===================================================================== */
  /* 7. Les propriétés                                                     */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Si \\(m > 0\\), la fonction affine est <b>croissante</b>.', ok: true,
      d: 'Oui : quand on avance de 1, on monte de \\(m\\). La droite monte de gauche à ' +
         'droite.' },
    { t: 'Si \\(m &lt; 0\\), la droite <b>monte</b> de gauche à droite.', ok: false,
      d: 'Non : avec \\(m &lt; 0\\), on <b>descend</b> de \\(|m|\\) chaque fois qu\'on avance ' +
         'de 1. La fonction est décroissante.' },
    { t: '\\(p\\) est l\'ordonnée du point où la droite coupe l\'axe vertical.', ok: true,
      d: 'Oui, et c\'est aussi \\(f(0)\\) : en remplaçant \\(x\\) par 0, il ne reste que ' +
         '\\(p\\).' },
    { t: 'Deux points distincts suffisent à déterminer une droite.', ok: true,
      d: 'Oui : par deux points distincts il passe une droite et une seule.' },
    { t: 'Si \\(x_A = x_B\\) (et \\(y_A \\neq y_B\\)), on peut quand même calculer \\(m\\).',
      ok: false,
      d: 'Non : \\(\\Delta x = 0\\), et on ne divise pas par zéro. La droite est ' +
         '<b>verticale</b> — et ce n\'est alors pas la représentation d\'une fonction, ' +
         'puisqu\'un même \\(x\\) aurait plusieurs images.' },
    { t: 'Une fonction <b>linéaire</b> est une fonction affine dont \\(p = 0\\).', ok: true,
      d: 'Oui : \\(f(x) = mx\\). Sa droite passe par l\'<b>origine</b>.' },
    { t: 'Deux droites de même coefficient directeur sont <b>parallèles</b>.', ok: true,
      d: 'Oui : même inclinaison. Si en plus elles ont le même \\(p\\), elles sont ' +
         'confondues.' },
    { t: 'Une fonction affine peut changer de sens de variation.', ok: false,
      d: 'Non : \\(m\\) est le même partout, donc le sens ne change jamais. Sa ' +
         'représentation est une droite, pas une courbe qui se retourne.' },
    { t: 'Si \\(f\\) est affine et que \\(f(0) = 3\\), alors \\(p = 3\\).', ok: true,
      d: 'Oui : \\(f(0) = m \\times 0 + p = p\\).' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['\\(m\\) dit l\'inclinaison, \\(p\\) dit la hauteur au départ.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  /* 8. Le sens de variation, à partir des données                         */
  /* ===================================================================== */
  function qSens(rnd, palier) {
    var d = tireDroite(rnd, [1, 1, 2]);
    var parPoints = rnd.booleen(0.5);
    var props = rnd.melange([
      { t: 'Croissante', bon: d.mn > 0 },
      { t: 'Décroissante', bon: d.mn < 0 },
      { t: 'Constante', bon: false },
      { t: 'On ne peut pas le savoir', bon: false }
    ]);
    return {
      enonce: (parPoints
        ? 'Une fonction affine \\(f\\) vérifie \\(f(' + O.fr(d.A[0]) + ') = ' +
          O.fr(d.A[1]) + '\\) et \\(f(' + O.fr(d.B[0]) + ') = ' + O.fr(d.B[1]) + '\\).'
        : 'Soit \\(f\\) définie par \\(' + fTex(d) + '\\).') +
        '<br><b>Cette fonction est-elle croissante ou décroissante ?</b>',
      type: 'qcm',
      choix: props.map(function (x) { return x.t; }),
      correct: props.map(function (x) { return x.bon; }).indexOf(true),
      etapes: [
        'Le sens de variation d\'une fonction affine ne dépend que du <b>signe de ' +
          '\\(m\\)</b> : positif elle croît, négatif elle décroît.',
        parPoints
          ? '\\(m = \\dfrac{' + O.fr(d.B[1]) + ' - ' + O.par(d.A[1]) + '}{' + O.fr(d.B[0]) +
            ' - ' + O.par(d.A[0]) + '} = ' + mTex(d) + '\\), qui est <b>' +
            (d.mn > 0 ? 'positif' : 'négatif') + '</b>.'
          : 'Ici \\(m = ' + mTex(d) + '\\), qui est <b>' +
            (d.mn > 0 ? 'positif' : 'négatif') + '</b>.',
        'La fonction est donc <b>' + (d.mn > 0 ? 'croissante' : 'décroissante') +
          '</b> — et elle l\'est sur \\(\\mathbb{R}\\) tout entier, car \\(m\\) ne ' +
          'change pas.',
        '\\(p = ' + O.fr(d.p) + '\\) ne joue <b>aucun rôle</b> ici : il déplace la droite ' +
          'vers le haut ou vers le bas, sans changer son inclinaison.'
      ],
      indices: ['Seul le signe de \\(m\\) compte.',
                parPoints ? 'Calcule d\'abord \\(m\\).' : '\\(m = ' + mTex(d) + '\\).'],
      duree: 90
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'fonction-affine', competence: 'fn-affine', level: '3eme',
    titre: 'Fonction affine', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'image', 'lecture', 'coefficient', 'sens'] :
        palier === 2 ? ['coefficient', 'image', 'lecture', 'ordonnee', 'sens', 'proprietes'] :
        palier === 3 ? ['ordonnee', 'equation', 'lecture', 'appartient', 'image',
                        'coefficient', 'proprietes'] :
                       ['equation', 'equation', 'appartient', 'ordonnee', 'lecture',
                        'image', 'sens']);

      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      if (quoi === 'coefficient') return qCoefficient(rnd, palier);
      if (quoi === 'ordonnee') return qOrdonnee(rnd, palier);
      if (quoi === 'equation') return qEquation(rnd, palier);
      if (quoi === 'lecture') return qLecture(rnd, palier);
      if (quoi === 'image') return qImage(rnd, palier);
      if (quoi === 'appartient') return qAppartient(rnd, palier);
      return qSens(rnd, palier);
    }
  });

})();
