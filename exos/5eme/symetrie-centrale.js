/*
 * sym-centrale — la symétrie centrale (leçon 5ème « Symétrie centrale »).
 *
 * Une seule définition, tenue d'un bout à l'autre : M' est le symétrique de M
 * par rapport à O lorsque O est le MILIEU de [MM']. Tout le reste en découle,
 * et le générateur ne demande jamais autre chose que d'en tirer les
 * conséquences.
 *
 *   coord       lire M et O sur un quadrillage, donner les coordonnées de M'.
 *               Les mauvaises réponses proposées ne sont pas au hasard : ce
 *               sont les erreurs classiques — la symétrie axiale d'axe
 *               horizontal ou vertical (on n'a retourné que dans un sens), et
 *               le décompte fait une fois au lieu de deux ;
 *   centre      la question à l'envers : on donne M et M', on cherche O. C'est
 *               le milieu, et c'est là qu'on voit si la définition est comprise
 *               ou seulement appliquée ;
 *   image       parmi trois figures, laquelle est l'image par le demi-tour ?
 *               Les deux leurres sont une TRANSLATION (bonne forme, mauvaise
 *               place) et une SYMÉTRIE AXIALE (figure retournée) : les deux
 *               confusions que la leçon cherche à défaire ;
 *   longueur    O est le milieu de [MM'], donc MM' = 2 × OM. Dans les deux sens ;
 *   proprietes  vrai/faux sur ce que la symétrie centrale conserve, et sur ce
 *               qui la distingue de la symétrie axiale ;
 *   figures     quelles figures usuelles possèdent un centre de symétrie ?
 *
 * Les figures sont dessinées par exos/repere-outils.js, qui cadre tout
 * seul et garde les carreaux carrés — sans quoi un demi-tour aurait l'air
 * d'une déformation.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var R = RepereOutils;

  var BLEU = '#2563eb', VIOLET = '#7c3aed', ORANGE = '#ea580c', VERT = '#059669';

  function pt(s) { return '\\(' + s + '\\)'; }

  /* ===================================================================== */
  /* 1. Les coordonnées du symétrique                                      */
  /* ===================================================================== */
  function qCoord(rnd, palier) {
    // Palier 1 : le centre est l'origine, on lit le résultat au signe près.
    // Ensuite le centre se promène, et il faut vraiment compter les carreaux.
    var C = palier === 1 ? [0, 0]
          : [rnd.entier(-3, 3), rnd.entier(-3, 3)];
    var M = null;
    for (var essai = 0; essai < 80 && !M; essai++) {
      var q = [rnd.entier(-5, 5), rnd.entier(-5, 5)];
      // On écarte M du centre, et on évite les points alignés sur un axe du
      // centre : sinon la symétrie axiale donnerait la même réponse que la
      // symétrie centrale, et le QCM aurait deux bonnes cases.
      if (q[0] !== C[0] && q[1] !== C[1] &&
          Math.abs(q[0] - C[0]) + Math.abs(q[1] - C[1]) >= 3) M = q;
    }
    if (!M) M = [C[0] + 2, C[1] + 1];

    var bon = R.sym(M, C);
    var leurres = [R.symH(M, C), R.symV(M, C), [C[0] - M[0], C[1] - M[1]]];
    // On ne garde que des leurres distincts du bon, et distincts entre eux.
    var vus = {}, choix = [{ p: bon, cle: 'bon' }];
    vus[bon.join()] = 1;
    leurres.forEach(function (l, i) {
      if (vus[l.join()]) return;
      vus[l.join()] = 1;
      choix.push({ p: l, cle: ['axeH', 'axeV', 'unefois'][i] });
    });
    while (choix.length < 4) {
      var f = [bon[0] + rnd.entierNonNul(-2, 2), bon[1] + rnd.entierNonNul(-2, 2)];
      if (!vus[f.join()]) { vus[f.join()] = 1; choix.push({ p: f, cle: 'autre' }); }
    }
    choix = rnd.melange(choix).slice(0, 4);
    if (!choix.some(function (c) { return c.cle === 'bon'; })) choix[0] = { p: bon, cle: 'bon' };
    choix = rnd.melange(choix);

    var expliqueLeurre = {
      axeH: 'C\'est le symétrique de ' + pt('M') + ' par rapport à la droite <b>horizontale</b> ' +
            'passant par ' + pt('O') + ' : on n\'a retourné que de haut en bas.',
      axeV: 'C\'est le symétrique de ' + pt('M') + ' par rapport à la droite <b>verticale</b> ' +
            'passant par ' + pt('O') + ' : on n\'a retourné que de gauche à droite.',
      unefois: 'Ici on n\'a compté les carreaux qu\'<b>une fois</b> : il faut aller deux fois ' +
               'plus loin, puisque ' + pt('O') + ' doit être au <b>milieu</b>.',
      autre: 'Ce point ne vérifie pas « ' + pt('O') + ' est le milieu de ' + pt('[MM\']') + ' ».'
    };

    return {
      enonce: 'Sur ce repère, place mentalement le symétrique du point ' + pt('M') +
        ' par rapport au point ' + pt('O') + '.' +
        R.repere({ points: [{ p: M, nom: 'M', couleur: BLEU },
                            { p: C, nom: 'O', couleur: VERT, place: 'droite' }],
                   // toutes les réponses proposées doivent tenir dans le repère :
                   // l'élève doit pouvoir aller vérifier où elles tombent
                   cadre: choix.map(function (c) { return c.p; }) }) +
        'Quelles sont les coordonnées de ' + pt('M\'') + ', le symétrique de ' + pt('M') +
        ' par rapport à ' + pt('O') + ' ?',
      type: 'qcm',
      choix: choix.map(function (c) { return R.coord(c.p); }),
      correct: choix.map(function (c) { return c.cle; }).indexOf('bon'),
      etapes: [
        pt('M\'') + ' est le symétrique de ' + pt('M') + ' par rapport à ' + pt('O') +
          ' veut dire : ' + pt('O') + ' est le <b>milieu</b> de ' + pt('[MM\']') + '.',
        'On part de ' + pt('M') + R.coord(M) + ' et on va jusqu\'à ' + pt('O') + R.coord(C) +
          ' : on se déplace de <b>' + O.fr(C[0] - M[0]) + '</b> en abscisse et de <b>' +
          O.fr(C[1] - M[1]) + '</b> en ordonnée.',
        'Pour que ' + pt('O') + ' soit au milieu, il faut <b>continuer d\'autant</b> : ' +
          pt('M\'') + R.coord(bon) + '.',
        'Autrement dit : ' + pt('x_{M\'} = 2 \\times ' + O.tex(C[0]) + ' - ' + O.tex(M[0]) +
          ' = ' + O.tex(bon[0])) + ' et ' +
          pt('y_{M\'} = 2 \\times ' + O.tex(C[1]) + ' - ' + O.tex(M[1]) + ' = ' + O.tex(bon[1])) + '.'
      ].concat(choix.filter(function (c) { return c.cle !== 'bon' && expliqueLeurre[c.cle]; })
        .map(function (c) { return '✘ ' + R.coord(c.p) + ' — ' + expliqueLeurre[c.cle]; })),
      indices: [
        'Compte les carreaux de ' + pt('M') + ' jusqu\'à ' + pt('O') + ', puis recompte-en ' +
          '<b>autant</b> en continuant dans le même sens.',
        pt('O') + ' doit se retrouver <b>au milieu</b> du segment ' + pt('[MM\']') + ', et les ' +
          'trois points doivent être <b>alignés</b>.'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 2. La question à l'envers : trouver le centre                         */
  /* ===================================================================== */
  function qCentre(rnd, palier) {
    // On choisit d'abord le centre, puis M, et l'on ne montre que M et M' :
    // les coordonnées du centre tombent juste, puisqu'il est le milieu.
    var C = [rnd.entier(-3, 3), rnd.entier(-3, 3)];
    var d = [rnd.entierNonNul(-3, 3), rnd.entierNonNul(-3, 3)];
    var M = [C[0] - d[0], C[1] - d[1]], Mp = [C[0] + d[0], C[1] + d[1]];

    var leurres = [[M[0] + Mp[0], M[1] + Mp[1]],          // somme au lieu de moyenne
                   [Mp[0] - M[0], Mp[1] - M[1]],          // l'écart, pas le milieu
                   [C[0] + rnd.entierNonNul(-2, 2), C[1] + rnd.entierNonNul(-2, 2)]];
    var vus = {}, choix = [{ p: C, cle: 'bon' }];
    vus[C.join()] = 1;
    leurres.forEach(function (l, i) {
      if (vus[l.join()]) return;
      vus[l.join()] = 1;
      choix.push({ p: l, cle: ['somme', 'ecart', 'autre'][i] });
    });
    while (choix.length < 4) {
      var f = [C[0] + rnd.entierNonNul(-3, 3), C[1] + rnd.entierNonNul(-3, 3)];
      if (!vus[f.join()]) { vus[f.join()] = 1; choix.push({ p: f, cle: 'autre' }); }
    }
    choix = rnd.melange(choix).slice(0, 4);
    if (!choix.some(function (c) { return c.cle === 'bon'; })) choix[0] = { p: C, cle: 'bon' };
    choix = rnd.melange(choix);

    return {
      enonce: 'Sur ce repère, le point ' + pt('M\'') + ' est le symétrique de ' + pt('M') +
        ' par rapport à un certain point ' + pt('O') + ', qui n\'est pas dessiné.' +
        R.repere({ points: [{ p: M, nom: 'M', couleur: BLEU },
                            { p: Mp, nom: "M'", couleur: VIOLET, place: 'bas' }],
                   segments: [{ de: M, a: Mp, couleur: '#94a3b8', dash: true }],
                   cadre: choix.map(function (c) { return c.p; }) }) +
        'Quelles sont les coordonnées du <b>centre</b> ' + pt('O') + ' ?',
      type: 'qcm',
      choix: choix.map(function (c) { return R.coord(c.p); }),
      correct: choix.map(function (c) { return c.cle; }).indexOf('bon'),
      etapes: [
        'Si ' + pt('M\'') + ' est le symétrique de ' + pt('M') + ' par rapport à ' + pt('O') +
          ', alors ' + pt('O') + ' est le <b>milieu</b> de ' + pt('[MM\']') + '.',
        'Le milieu se trouve à mi-chemin : on prend la <b>moyenne</b> des abscisses et celle ' +
          'des ordonnées.',
        pt('x_O = (' + O.tex(M[0]) + ' + ' + O.tex(Mp[0]) + ') \\div 2 = ' + O.tex(C[0])) +
          '  et  ' + pt('y_O = (' + O.tex(M[1]) + ' + ' + O.tex(Mp[1]) + ') \\div 2 = ' +
          O.tex(C[1])) + '.',
        'Donc ' + pt('O') + R.coord(C) + ' — et l\'on vérifie sur le dessin qu\'il tombe bien ' +
          'au milieu du segment tracé en pointillés.'
      ],
      indices: ['Le centre d\'une symétrie centrale est toujours le <b>milieu</b> du segment ' +
                  'qui joint un point à son image.',
                'Cherche le point qui est à mi-chemin entre ' + pt('M') + ' et ' + pt('M\'') +
                  ' : compte les carreaux et coupe en deux.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 3. Quelle figure est l'image par le demi-tour ?                       */
  /* ===================================================================== */
  function qImage(rnd, palier) {
    var C = [0, 0];
    var F = null, cand = null;
    for (var essai = 0; essai < 200 && !cand; essai++) {
      // Une figure volontairement dissymétrique, dans un coin du repère : sans
      // dissymétrie, l'image par translation et l'image par symétrie axiale se
      // ressembleraient trop.
      var x = rnd.entier(2, 3), y = rnd.entier(2, 3);
      var f = [[x, y], [x + rnd.entier(2, 3), y + rnd.entier(0, 1)],
               [x + rnd.entier(1, 2), y + rnd.entier(2, 3)], [x, y + rnd.entier(1, 2)]];
      var bon = f.map(function (q) { return R.sym(q, C); });
      // Le décalage est tiré UNE FOIS : à l'intérieur du map, chaque sommet se
      // décalerait différemment et la figure serait déformée, pas déplacée.
      var dec = rnd.entier(1, 2);
      var tr = f.map(function (q) { return R.trans(q, [-2 * x - dec, 0]); });
      var ax = f.map(function (q) { return R.symH(q, C); });
      // Les trois propositions doivent être bien séparées, sinon le dessin est
      // illisible et la question injuste.
      if (R.chevauche(bon, tr) || R.chevauche(bon, ax) || R.chevauche(tr, ax)) continue;
      if (R.chevauche(f, bon) || R.chevauche(f, tr) || R.chevauche(f, ax)) continue;
      F = f;
      cand = rnd.melange([{ pts: bon, cle: 'bon' }, { pts: tr, cle: 'trans' },
                          { pts: ax, cle: 'axe' }]);
    }
    if (!cand) {         // repli : une configuration connue pour tenir
      F = [[2, 2], [5, 2], [4, 5], [2, 4]];
      cand = rnd.melange([
        { pts: F.map(function (q) { return R.sym(q, C); }), cle: 'bon' },
        { pts: F.map(function (q) { return R.trans(q, [-7, 0]); }), cle: 'trans' },
        { pts: F.map(function (q) { return R.symH(q, C); }), cle: 'axe' }]);
    }

    // La configuration se construit toujours de la même façon (figure en haut à
    // droite, image en bas à gauche) : on lui applique pour finir une isométrie
    // du carré tirée au sort — transposition et retournements. Elle laisse O en
    // place et transforme une symétrie centrale en symétrie centrale, une
    // symétrie axiale en symétrie axiale, une translation en translation : les
    // trois propositions restent donc exactement ce qu'elles étaient, mais la
    // figure n'a plus toujours la même allure.
    var tr = rnd.booleen(0.5), sx = rnd.booleen(0.5) ? -1 : 1, sy = rnd.booleen(0.5) ? -1 : 1;
    function deco(q) { var a = tr ? [q[1], q[0]] : q; return [sx * a[0], sy * a[1]]; }
    F = F.map(deco);
    cand = cand.map(function (c) { return { pts: c.pts.map(deco), cle: c.cle }; });

    var COUL = ['#7c3aed', '#ea580c', '#0d9488'];
    var bonne = cand.map(function (c) { return c.cle; }).indexOf('bon');

    return {
      enonce: 'La figure <b>bleue</b> est la figure de départ, et ' + pt('O') +
        ' est le centre de symétrie.' +
        R.repere({
          points: [{ p: C, nom: 'O', couleur: VERT, place: 'droite' }],
          polygones: [{ pts: F, couleur: BLEU }].concat(cand.map(function (c, k) {
            return { pts: c.pts, couleur: COUL[k], num: String(k + 1) };
          }))
        }) +
        'Laquelle des trois figures est l\'<b>image</b> de la figure bleue par la symétrie de ' +
        'centre ' + pt('O') + ' (le demi-tour autour de ' + pt('O') + ') ?',
      type: 'qcm',
      choix: ['La figure 1', 'La figure 2', 'La figure 3'],
      correct: bonne,
      etapes: [
        'Pour trouver l\'image, on prend <b>chaque sommet</b> et on cherche son symétrique par ' +
          'rapport à ' + pt('O') + ' : ' + pt('O') + ' doit être le <b>milieu</b> du segment ' +
          'qui joint le sommet à son image.',
        'Le sommet ' + R.coord(F[0]) + ' a donc pour image ' + R.coord(R.sym(F[0], C)) +
          ', et ainsi de suite pour les autres.',
        'C\'est la <b>figure ' + (bonne + 1) + '</b> : elle est de l\'autre côté de ' + pt('O') +
          ', et elle a fait un <b>demi-tour</b>.',
        '✘ Une des deux autres est simplement <b>glissée</b> (une translation) : elle a gardé ' +
          'la même orientation, elle n\'a pas tourné.',
        '✘ L\'autre est <b>retournée comme dans un miroir</b> (une symétrie axiale) : ce n\'est ' +
          'pas la même chose qu\'un demi-tour, et le sens de lecture de la figure a changé.'
      ],
      indices: [
        'Choisis <b>un seul</b> sommet de la figure bleue, trace mentalement la droite qui le ' +
          'joint à ' + pt('O') + ', et prolonge d\'autant de l\'autre côté.',
        'Un demi-tour <b>fait tourner</b> la figure : elle se retrouve « à l\'envers », mais ' +
          'sans être retournée comme dans un miroir.'
      ],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 4. O est le milieu : les longueurs                                    */
  /* ===================================================================== */
  function qLongueur(rnd, palier) {
    var demi = rnd.entier(2, 9) + (palier >= 3 && rnd.booleen(0.5) ? 0.5 : 0);
    var total = 2 * demi;
    var sens = rnd.booleen(0.5);

    return {
      enonce: 'Le point ' + pt('M\'') + ' est le symétrique du point ' + pt('M') +
        ' par rapport au point ' + pt('O') + '.<br>' +
        (sens ? 'On sait que ' + pt('OM = ' + O.tex(demi)) + ' cm. Combien mesure ' +
                  pt('MM\'') + ' ?'
              : 'On sait que ' + pt('MM\' = ' + O.tex(total)) + ' cm. Combien mesure ' +
                  pt('OM') + ' ?'),
      type: 'nombre', reponse: sens ? total : demi, unite: 'cm',
      etapes: [
        pt('M\'') + ' est le symétrique de ' + pt('M') + ' par rapport à ' + pt('O') +
          ' : donc ' + pt('O') + ' est le <b>milieu</b> de ' + pt('[MM\']') + '.',
        'Le point ' + pt('O') + ' coupe donc ' + pt('[MM\']') + ' en <b>deux morceaux de même ' +
          'longueur</b> : ' + pt('OM = OM\'') + ', et ' + pt('MM\' = OM + OM\' = 2 \\times OM') + '.',
        sens ? pt('MM\' = 2 \\times ' + O.tex(demi) + ' = ' + O.tex(total)) + ' cm'
             : pt('OM = ' + O.tex(total) + ' \\div 2 = ' + O.tex(demi)) + ' cm'
      ],
      indices: [pt('O') + ' est au <b>milieu</b> : les deux morceaux ont la même longueur.',
                sens ? 'Il y a deux morceaux identiques : on multiplie par 2.'
                     : 'Il y a deux morceaux identiques : on divise par 2.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 5. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Une symétrie centrale de centre ' + pt('O') + ' est un <b>demi-tour</b> autour de ' +
         pt('O') + '.', ok: true,
      d: 'Oui : c\'est une rotation d\'un angle de <b>180°</b> autour de ' + pt('O') + '.' },
    { t: 'Le symétrique du centre ' + pt('O') + ' est ' + pt('O') + ' lui-même.', ok: true,
      d: 'Oui : c\'est le seul point qui ne bouge pas, puisqu\'il est déjà le milieu de ' +
         'lui-même.' },
    { t: 'La symétrie centrale <b>conserve les longueurs</b>.', ok: true,
      d: 'Oui : une figure et son image sont <b>superposables</b>. Les longueurs et les angles ' +
         'sont conservés.' },
    { t: 'La symétrie centrale <b>agrandit</b> la figure.', ok: false,
      d: 'Non : la figure et son image ont exactement la même taille. Rien n\'est agrandi ni ' +
         'réduit.' },
    { t: 'Par une symétrie centrale, une figure est <b>retournée comme dans un miroir</b>.',
      ok: false,
      d: 'Non, ça c\'est la symétrie <b>axiale</b>. Un demi-tour garde le <b>même sens de ' +
         'lecture</b> : on peut faire glisser la figure sur son image en la faisant tourner, ' +
         'sans jamais la retourner.' },
    { t: 'L\'image d\'une droite par une symétrie centrale est une droite qui lui est ' +
         '<b>parallèle</b>.', ok: true,
      d: 'Oui — et c\'est la même droite lorsqu\'elle passe par le centre.' },
    { t: 'Si ' + pt('M\'') + ' est le symétrique de ' + pt('M') + ' par rapport à ' + pt('O') +
         ', alors les points ' + pt('M') + ', ' + pt('O') + ' et ' + pt('M\'') + ' sont ' +
         '<b>alignés</b>.', ok: true,
      d: 'Oui : ' + pt('O') + ' est le milieu de ' + pt('[MM\']') + ', il est donc forcément ' +
         'sur ce segment.' },
    { t: 'Si ' + pt('M\'') + ' est le symétrique de ' + pt('M') + ' par rapport à ' + pt('O') +
         ', alors ' + pt('M') + ' est le symétrique de ' + pt('M\'') + ' par rapport à ' +
         pt('O') + '.', ok: true,
      d: 'Oui : ' + pt('O') + ' est le milieu de ' + pt('[MM\']') + ', et cela ne dépend pas du ' +
         'sens dans lequel on lit le segment. Refaire un demi-tour ramène au point de départ.' },
    { t: 'Le symétrique d\'un segment de 5 cm est un segment de 10 cm.', ok: false,
      d: 'Non : les longueurs sont <b>conservées</b>. Le symétrique d\'un segment de 5 cm est ' +
         'un segment de 5 cm. (Ce qui vaut le double, c\'est ' + pt('MM\'') + ' par rapport à ' +
         pt('OM') + ', mais c\'est une autre histoire.)' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense à la définition : ' + pt('O') + ' est le <b>milieu</b> de ' +
                pt('[MM\']') + ' — et au <b>demi-tour</b>, qui fait tourner sans retourner.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 6. Quelles figures ont un centre de symétrie ?                        */
  /* ===================================================================== */
  var FIGURES = [
    { nom: 'Le parallélogramme', ok: true,
      d: 'son centre de symétrie est le point d\'intersection de ses diagonales' },
    { nom: 'Le rectangle', ok: true, d: 'c\'est un parallélogramme' },
    { nom: 'Le losange', ok: true, d: 'c\'est aussi un parallélogramme' },
    { nom: 'Le carré', ok: true, d: 'c\'est à la fois un rectangle et un losange' },
    { nom: 'Le cercle', ok: true, d: 'son centre de symétrie est son centre' },
    { nom: 'Le triangle équilatéral', ok: false,
      d: 'il a trois axes de symétrie, mais aucun centre de symétrie' },
    { nom: 'Le triangle isocèle', ok: false, d: 'il a un axe de symétrie, mais pas de centre' },
    { nom: 'Le trapèze isocèle', ok: false, d: 'il a un axe de symétrie, mais pas de centre' }
  ];

  function qFigures(rnd, palier) {
    var lot = rnd.melange(FIGURES.slice()).slice(0, 5);
    // On garantit au moins une bonne et au moins une mauvaise réponse.
    if (!lot.some(function (f) { return f.ok; })) {
      lot[0] = rnd.choix(FIGURES.filter(function (f) { return f.ok; }));
    }
    if (lot.every(function (f) { return f.ok; })) {
      lot[lot.length - 1] = rnd.choix(FIGURES.filter(function (f) { return !f.ok; }));
    }
    var corrects = [];
    lot.forEach(function (f, i) { if (f.ok) corrects.push(i); });

    return {
      enonce: 'Une figure a un <b>centre de symétrie</b> lorsqu\'elle est sa propre image par ' +
        'une symétrie centrale : en lui faisant faire un <b>demi-tour</b> autour de ce point, ' +
        'elle se retrouve exactement sur elle-même.<br>' +
        'Coche <b>toutes</b> les figures qui ont un centre de symétrie.',
      type: 'qcm-multi',
      choix: lot.map(function (f) { return f.nom; }),
      corrects: corrects,
      etapes: lot.map(function (f) {
        return (f.ok ? '✔ ' : '✘ ') + '<b>' + f.nom + '</b> — ' + (f.ok ? 'oui, ' : 'non, ') +
               f.d + '.';
      }).concat(['<b>Le piège :</b> avoir un <b>axe</b> de symétrie et avoir un <b>centre</b> de ' +
        'symétrie sont deux choses différentes. Le triangle équilatéral a trois axes et aucun ' +
        'centre ; le parallélogramme quelconque a un centre et aucun axe.']),
      indices: [
        'Fais tourner la figure d\'un demi-tour dans ta tête : retombe-t-elle exactement sur ' +
          'elle-même ?',
        'Un <b>axe</b> de symétrie, ce n\'est pas un <b>centre</b> de symétrie : le triangle ' +
          'isocèle a le premier, pas le second.'
      ],
      duree: 90
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'symetrie-centrale', competence: 'sym-centrale', level: '5eme',
    titre: 'Symétrie centrale', paliers: 4,

    genere: function (rnd, palier) {
      // On installe d'abord la construction (coordonnées, longueurs), puis la
      // reconnaissance d'une image, et enfin ce qui se raisonne sans dessin.
      var quoi = rnd.choix(
        palier === 1 ? ['coord', 'coord', 'longueur', 'proprietes'] :
        palier === 2 ? ['coord', 'coord', 'longueur', 'image', 'proprietes'] :
        palier === 3 ? ['coord', 'centre', 'image', 'longueur', 'proprietes', 'figures'] :
                       ['centre', 'centre', 'image', 'image', 'figures', 'proprietes']);

      if (quoi === 'centre') return qCentre(rnd, palier);
      if (quoi === 'image') return qImage(rnd, palier);
      if (quoi === 'longueur') return qLongueur(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      if (quoi === 'figures') return qFigures(rnd, palier);
      return qCoord(rnd, palier);
    }
  });

})();
