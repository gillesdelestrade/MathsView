/*
 * sym-axiale — la symétrie axiale (leçon 6ème « Symétrie axiale »).
 *
 * Le pendant exact du générateur de symétrie centrale (5ème), et c'est voulu :
 * les deux transformations s'apprennent l'une contre l'autre, et la plupart des
 * erreurs viennent de leur confusion. Là où le centre demandait « O est le
 * milieu de [MM'] », l'axe demande « (d) est la MÉDIATRICE de [MM'] » — le
 * segment lui est perpendiculaire, et il le coupe en son milieu.
 *
 *   coord       lire M sur un quadrillage, donner les coordonnées de son
 *               symétrique par rapport à une droite verticale ou horizontale.
 *               Les mauvaises réponses proposées sont les erreurs classiques :
 *               la symétrie par rapport à l'AUTRE axe, le demi-tour (les deux
 *               coordonnées changées), et le décompte fait une fois au lieu de
 *               deux ;
 *   image       parmi trois figures, laquelle est l'image par la symétrie ?
 *               Les deux leurres sont une TRANSLATION (figure non retournée) et
 *               une SYMÉTRIE CENTRALE (figure tournée) — les deux confusions
 *               que la leçon cherche à défaire ;
 *   axe         on donne M et M', on cherche l'axe : c'est la médiatrice ;
 *   axesFigure  combien d'axes de symétrie a un carré, un rectangle, un
 *               parallélogramme ? La question du chapitre, et celle qui se
 *               confond avec le centre de symétrie ;
 *   longueur    l'axe coupe [MM'] en son milieu : MM' vaut le double de la
 *               distance de M à l'axe ;
 *   proprietes  vrai/faux, dont ce qui distingue l'axiale de la centrale.
 *
 * Aucune coordonnée n'est calculée en virgule flottante : tout est entier, et
 * les figures sont dessinées par exos/repere-outils.js.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var R = RepereOutils;

  var BLEU = '#2563eb', VIOLET = '#7c3aed', VERT = '#059669';

  function pt(s) { return '\\(' + s + '\\)'; }

  // Le symétrique par rapport à une droite verticale x = k, ou horizontale y = k.
  function symAxe(p, axe) {
    return axe.x !== undefined ? [2 * axe.x - p[0], p[1]] : [p[0], 2 * axe.y - p[1]];
  }
  function autreAxe(axe) { return axe.x !== undefined ? { y: 0 } : { x: 0 }; }

  /* ===================================================================== */
  /* 1. Les coordonnées du symétrique                                      */
  /* ===================================================================== */
  function qCoord(rnd, palier) {
    // Palier 1 : l'axe est un axe du repère, on lit le résultat au signe près.
    var vertical = rnd.booleen(0.5);
    var k = palier === 1 ? 0 : rnd.entier(-3, 3);
    var axe = vertical ? { x: k } : { y: k };
    var M = null;
    for (var essai = 0; essai < 80 && !M; essai++) {
      var q = [rnd.entier(-5, 5), rnd.entier(-5, 5)];
      // On écarte M de l'axe : un point SUR l'axe est son propre symétrique,
      // et la question n'aurait plus d'intérêt. On l'écarte aussi de l'autre
      // droite, sinon plusieurs réponses coïncideraient.
      if (vertical ? (q[0] !== k && q[1] !== 0 && Math.abs(q[0] - k) >= 2)
                   : (q[1] !== k && q[0] !== 0 && Math.abs(q[1] - k) >= 2)) M = q;
    }
    if (!M) M = vertical ? [k + 2, 1] : [1, k + 2];

    var bon = symAxe(M, axe);
    var leurres = [
      { p: symAxe(M, autreAxe(axe)), cle: 'autreAxe' },
      { p: [2 * (axe.x !== undefined ? axe.x : 0) - M[0],
            2 * (axe.y !== undefined ? axe.y : 0) - M[1]], cle: 'demiTour' },
      { p: vertical ? [k - M[0], M[1]] : [M[0], k - M[1]], cle: 'unefois' }
    ];
    var vus = {}, choix = [{ p: bon, cle: 'bon' }];
    vus[bon.join()] = 1;
    rnd.melange(leurres).forEach(function (l) {
      if (vus[l.p.join()]) return;
      vus[l.p.join()] = 1;
      choix.push(l);
    });
    while (choix.length < 4) {
      var f = [bon[0] + rnd.entierNonNul(-2, 2), bon[1] + rnd.entierNonNul(-2, 2)];
      if (!vus[f.join()]) { vus[f.join()] = 1; choix.push({ p: f, cle: 'autre' }); }
    }
    choix = rnd.melange(choix);

    var dit = vertical ? 'la droite <b>verticale</b> d\'équation ' + pt('x = ' + O.tex(k))
                       : 'la droite <b>horizontale</b> d\'équation ' + pt('y = ' + O.tex(k));
    var dist = vertical ? Math.abs(M[0] - k) : Math.abs(M[1] - k);
    var expl = {
      autreAxe: 'C\'est le symétrique par rapport à l\'<b>autre</b> droite : on a retourné dans ' +
                'le mauvais sens.',
      demiTour: 'C\'est l\'image par un <b>demi-tour</b> (une symétrie centrale) : les <b>deux</b> ' +
                'coordonnées ont changé, alors qu\'une seule doit bouger.',
      unefois: 'Ici on n\'a compté les carreaux qu\'<b>une fois</b> : il faut aller deux fois ' +
               'plus loin, puisque l\'axe doit passer au <b>milieu</b>.',
      autre: 'Ce point ne vérifie pas « (d) est la médiatrice de ' + pt('[MM\']') + ' ».'
    };

    return {
      enonce: 'Sur ce repère, ' + pt('(d)') + ' est ' + dit + '.' +
        R.repere({ points: [{ p: M, nom: 'M', couleur: BLEU }], axe: axe,
                   cadre: choix.map(function (c) { return c.p; }) }) +
        'Quelles sont les coordonnées du symétrique de ' + pt('M') + ' par rapport à ' +
        pt('(d)') + ' ?',
      type: 'qcm',
      choix: choix.map(function (c) { return R.coord(c.p); }),
      correct: choix.map(function (c) { return c.cle; }).indexOf('bon'),
      etapes: [
        'Le symétrique de ' + pt('M') + ' par rapport à ' + pt('(d)') + ' est de l\'<b>autre ' +
          'côté</b> de la droite, à la <b>même distance</b>, sur la perpendiculaire à ' +
          pt('(d)') + '.',
        pt('M') + R.coord(M) + ' est à <b>' + O.fr(dist) + ' carreau' + (dist > 1 ? 'x' : '') +
          '</b> de ' + pt('(d)') + '. Son image est donc à ' + O.fr(dist) + ' carreau' +
          (dist > 1 ? 'x' : '') + ' de l\'autre côté.',
        vertical
          ? 'La droite est verticale : seule l\'<b>abscisse</b> change, l\'ordonnée reste ' +
            pt(O.tex(M[1])) + '. On obtient ' + R.coord(bon) + '.'
          : 'La droite est horizontale : seule l\'<b>ordonnée</b> change, l\'abscisse reste ' +
            pt(O.tex(M[0])) + '. On obtient ' + R.coord(bon) + '.'
      ].concat(choix.filter(function (c) { return c.cle !== 'bon' && expl[c.cle]; })
        .map(function (c) { return '✘ ' + R.coord(c.p) + ' — ' + expl[c.cle]; })),
      indices: [
        'Compte les carreaux qui séparent ' + pt('M') + ' de la droite, puis compte-en autant ' +
          'de l\'autre côté.',
        'Une seule des deux coordonnées change : celle qui traverse la droite.'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 2. Quelle figure est l'image ?                                        */
  /* ===================================================================== */
  function qImage(rnd, palier) {
    var vertical = rnd.booleen(0.5);
    var axe = vertical ? { x: 0 } : { y: 0 };
    var F = null, cand = null;
    for (var essai = 0; essai < 200 && !cand; essai++) {
      // Une figure franchement dissymétrique, dans un coin : sans dissymétrie,
      // le retournement et le demi-tour se ressembleraient.
      var x = rnd.entier(2, 3), y = rnd.entier(2, 3);
      var f = [[x, y], [x + rnd.entier(2, 3), y + rnd.entier(0, 1)],
               [x + rnd.entier(1, 2), y + rnd.entier(2, 3)], [x, y + rnd.entier(1, 2)]];
      var bon = f.map(function (q) { return symAxe(q, axe); });
      var tour = f.map(function (q) { return [-q[0], -q[1]]; });
      // Le décalage est tiré UNE FOIS, avant la boucle : à l'intérieur, chaque
      // sommet se décalerait d'une valeur différente et la « translation »
      // déformerait la figure au lieu de la déplacer.
      var dec = rnd.entier(1, 2);
      var tr = f.map(function (q) {
        return vertical ? [q[0], q[1] - 2 * y - dec] : [q[0] - 2 * x - dec, q[1]];
      });
      if (R.chevauche(bon, tour) || R.chevauche(bon, tr) || R.chevauche(tour, tr)) continue;
      if (R.chevauche(f, bon) || R.chevauche(f, tour) || R.chevauche(f, tr)) continue;
      F = f;
      cand = rnd.melange([{ pts: bon, cle: 'bon' }, { pts: tour, cle: 'tour' },
                          { pts: tr, cle: 'trans' }]);
    }
    if (!cand) {
      F = [[2, 2], [5, 2], [4, 5], [2, 4]];
      cand = rnd.melange([
        { pts: F.map(function (q) { return symAxe(q, axe); }), cle: 'bon' },
        { pts: F.map(function (q) { return [-q[0], -q[1]]; }), cle: 'tour' },
        { pts: F.map(function (q) { return [q[0], q[1] - 8]; }), cle: 'trans' }]);
    }
    // Une isométrie du carré tirée au sort, pour que la bonne figure ne soit
    // pas toujours dans le même quadrant. Elle échange les rôles des deux
    // droites, donc l'axe la suit.
    var tr2 = rnd.booleen(0.5), sx = rnd.booleen(0.5) ? -1 : 1, sy = rnd.booleen(0.5) ? -1 : 1;
    function deco(q) { var a = tr2 ? [q[1], q[0]] : q; return [sx * a[0], sy * a[1]]; }
    F = F.map(deco);
    cand = cand.map(function (c) { return { pts: c.pts.map(deco), cle: c.cle }; });
    var axeFinal = tr2 ? (vertical ? { y: 0 } : { x: 0 }) : axe;

    var COUL = ['#7c3aed', '#ea580c', '#0d9488'];
    var bonne = cand.map(function (c) { return c.cle; }).indexOf('bon');

    return {
      enonce: 'La figure <b>bleue</b> est la figure de départ, et ' + pt('(d)') + ' est l\'axe ' +
        'de symétrie.' +
        R.repere({
          axe: axeFinal,
          polygones: [{ pts: F, couleur: BLEU }].concat(cand.map(function (c, k) {
            return { pts: c.pts, couleur: COUL[k], num: String(k + 1) };
          }))
        }) +
        'Laquelle des trois figures est l\'<b>image</b> de la figure bleue par la symétrie ' +
        'd\'axe ' + pt('(d)') + ' ?',
      type: 'qcm',
      choix: ['La figure 1', 'La figure 2', 'La figure 3'],
      correct: bonne,
      etapes: [
        'Pour trouver l\'image, on prend <b>chaque sommet</b> et on cherche son symétrique : de ' +
          'l\'autre côté de ' + pt('(d)') + ', à la <b>même distance</b>, sur la ' +
          'perpendiculaire à la droite.',
        'Le sommet ' + R.coord(F[0]) + ' a pour image ' + R.coord(symAxe(F[0], axeFinal)) +
          ', et ainsi de suite.',
        'C\'est la <b>figure ' + (bonne + 1) + '</b> : elle est de l\'autre côté de l\'axe, et ' +
          '<b>retournée</b> comme dans un miroir.',
        '✘ Une des deux autres a fait un <b>demi-tour</b> (symétrie centrale) : elle a tourné, ' +
          'mais elle n\'est pas retournée — son sens de lecture n\'a pas changé.',
        '✘ L\'autre a seulement <b>glissé</b> (une translation) : même orientation, mauvaise ' +
          'place.'
      ],
      indices: [
        'Choisis <b>un seul</b> sommet et compte les carreaux qui le séparent de l\'axe.',
        'Une symétrie axiale <b>retourne</b> la figure, comme dans un miroir : la gauche et la ' +
          'droite s\'échangent.'
      ],
      duree: 80
    };
  }

  /* ===================================================================== */
  /* 3. Retrouver l'axe                                                    */
  /* ===================================================================== */
  function qAxe(rnd, palier) {
    var vertical = rnd.booleen(0.5);
    var k = rnd.entier(-2, 2);
    var d = rnd.entier(1, 3);
    var M = vertical ? [k - d, rnd.entier(-4, 4)] : [rnd.entier(-4, 4), k - d];
    var Mp = vertical ? [k + d, M[1]] : [M[0], k + d];
    var prop = [{ cle: 'bon', txt: vertical ? 'x = ' + O.tex(k) : 'y = ' + O.tex(k) }];
    var vus = {}; vus[prop[0].txt] = 1;
    [vertical ? 'x = ' + O.tex(M[0]) : 'y = ' + O.tex(M[1]),
     vertical ? 'y = ' + O.tex(k) : 'x = ' + O.tex(k),
     vertical ? 'x = ' + O.tex(k + d) : 'y = ' + O.tex(k + d)].forEach(function (t) {
      if (!vus[t]) { vus[t] = 1; prop.push({ cle: 'faux', txt: t }); }
    });
    var j = 1;
    while (prop.length < 4) {
      var t2 = vertical ? 'x = ' + O.tex(k + j) : 'y = ' + O.tex(k + j);
      if (!vus[t2]) { vus[t2] = 1; prop.push({ cle: 'faux', txt: t2 }); }
      j++;
    }
    prop = rnd.melange(prop);

    return {
      enonce: 'Sur ce repère, ' + pt('M\'') + ' est le symétrique de ' + pt('M') + ' par ' +
        'rapport à une droite qui n\'est pas dessinée.' +
        R.repere({ points: [{ p: M, nom: 'M', couleur: BLEU },
                            { p: Mp, nom: "M'", couleur: VIOLET, place: 'bas' }],
                   segments: [{ de: M, a: Mp, couleur: '#94a3b8', dash: true }] }) +
        'Quelle est cette droite ?',
      type: 'qcm',
      choix: prop.map(function (p) { return pt(p.txt); }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'L\'axe d\'une symétrie est la <b>médiatrice</b> du segment qui joint un point à son ' +
          'image : il lui est <b>perpendiculaire</b> et il le coupe en son <b>milieu</b>.',
        pt('[MM\']') + ' est ' + (vertical ? 'horizontal' : 'vertical') + ' : l\'axe lui est ' +
          'perpendiculaire, il est donc ' + (vertical ? '<b>vertical</b>' : '<b>horizontal</b>') +
          '.',
        'Le milieu de ' + pt('[MM\']') + ' est ' + R.coord(vertical ? [k, M[1]] : [M[0], k]) +
          ' : l\'axe est la droite ' + pt(vertical ? 'x = ' + O.tex(k) : 'y = ' + O.tex(k)) + '.',
        'On vérifie : ' + pt('M') + ' et ' + pt('M\'') + ' sont chacun à <b>' + O.fr(d) +
          ' carreau' + (d > 1 ? 'x' : '') + '</b> de cette droite.'
      ],
      indices: ['L\'axe passe par le <b>milieu</b> de ' + pt('[MM\']') + '.',
                'Il est <b>perpendiculaire</b> à ' + pt('[MM\']') + ' : si le segment est ' +
                  'horizontal, l\'axe est vertical.'],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 4. Combien d'axes de symétrie ?                                       */
  /* ===================================================================== */
  var FIGURES = [
    { nom: 'Le carré', n: 4, d: 'les deux médiatrices des côtés et les deux diagonales' },
    { nom: 'Le rectangle', n: 2, d: 'les deux médiatrices des côtés — mais pas les diagonales' },
    { nom: 'Le losange', n: 2, d: 'ses deux diagonales' },
    { nom: 'Le triangle équilatéral', n: 3, d: 'une par sommet' },
    { nom: 'Le triangle isocèle', n: 1, d: 'la médiatrice de sa base' },
    { nom: 'Le parallélogramme quelconque', n: 0,
      d: 'il a un <b>centre</b> de symétrie, mais aucun axe' },
    { nom: 'Le triangle quelconque', n: 0, d: 'aucune de ses droites ne le partage en deux ' +
      'moitiés superposables' }
  ];

  function qAxesFigure(rnd, palier) {
    var f = rnd.choix(palier <= 2
      ? FIGURES.filter(function (x) { return x.n > 0; })
      : FIGURES);
    var vus = {}, prop = [{ cle: 'bon', v: f.n }];
    vus[f.n] = 1;
    rnd.melange([f.n + 1, f.n + 2, Math.max(0, f.n - 1), 4]).forEach(function (v) {
      if (!vus[v] && v >= 0 && prop.length < 4) { vus[v] = 1; prop.push({ cle: 'faux', v: v }); }
    });
    var k = 0;
    while (prop.length < 4) { if (!vus[k]) { vus[k] = 1; prop.push({ cle: 'faux', v: k }); } k++; }
    prop = rnd.melange(prop);

    return {
      enonce: 'Combien d\'<b>axes de symétrie</b> a la figure suivante ?<br><b>' + f.nom + '</b>',
      type: 'qcm',
      choix: prop.map(function (p) { return String(p.v); }),
      correct: prop.map(function (p) { return p.cle; }).indexOf('bon'),
      etapes: [
        'Un <b>axe de symétrie</b> est une droite qui partage la figure en deux moitiés qui se ' +
          'superposent exactement quand on plie le long de cette droite.',
        f.nom + ' en a <b>' + f.n + '</b> : ' + f.d + '.',
        '<b>À retenir :</b> carré 4, rectangle 2, losange 2, triangle équilatéral 3, triangle ' +
          'isocèle 1, parallélogramme quelconque 0, cercle une infinité.',
        '<b>Ne pas confondre</b> avec le <b>centre</b> de symétrie : le parallélogramme en a un ' +
          'sans avoir d\'axe, et le triangle isocèle a un axe sans avoir de centre.'
      ],
      indices: ['Imagine que tu plies la figure : le long de quelles droites les deux moitiés ' +
                  'se superposent-elles ?',
                'Attention aux diagonales : elles sont des axes pour le losange et le carré, ' +
                  'mais pas pour le rectangle.'],
      duree: 50
    };
  }

  /* ===================================================================== */
  /* 5. Les longueurs : l'axe coupe [MM'] en son milieu                    */
  /* ===================================================================== */
  function qLongueur(rnd, palier) {
    var d = rnd.entier(2, 9) + (palier >= 3 && rnd.booleen(0.5) ? 0.5 : 0);
    var sens = rnd.booleen(0.5);

    return {
      enonce: 'Le point ' + pt('M\'') + ' est le symétrique du point ' + pt('M') + ' par ' +
        'rapport à une droite ' + pt('(d)') + ', et ' + pt('H') + ' est le point où ' +
        pt('[MM\']') + ' coupe ' + pt('(d)') + '.<br>' +
        (sens ? 'On sait que ' + pt('MH = ' + O.tex(d)) + ' cm. Combien mesure ' + pt('MM\'') + ' ?'
              : 'On sait que ' + pt('MM\' = ' + O.tex(2 * d)) + ' cm. Combien mesure ' +
                pt('MH') + ' ?'),
      type: 'nombre', reponse: sens ? 2 * d : d, unite: 'cm',
      etapes: [
        'L\'axe ' + pt('(d)') + ' est la <b>médiatrice</b> de ' + pt('[MM\']') + ' : il le coupe ' +
          'en son <b>milieu</b>, et perpendiculairement.',
        pt('H') + ' est donc le milieu de ' + pt('[MM\']') + ' : ' + pt('MH = HM\'') + ', et ' +
          pt('MM\' = 2 \\times MH') + '.',
        sens ? pt('MM\' = 2 \\times ' + O.tex(d) + ' = ' + O.tex(2 * d)) + ' cm'
             : pt('MH = ' + O.tex(2 * d) + ' \\div 2 = ' + O.tex(d)) + ' cm'
      ],
      indices: ['L\'axe passe au <b>milieu</b> de ' + pt('[MM\']') + '.',
                sens ? 'Il y a deux morceaux de même longueur : on multiplie par 2.'
                     : 'Il y a deux morceaux de même longueur : on divise par 2.'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'L\'axe de symétrie est la <b>médiatrice</b> du segment qui joint un point à son image.',
      ok: true,
      d: 'Oui : il lui est perpendiculaire et le coupe en son milieu. C\'est la définition même.' },
    { t: 'Un point situé <b>sur</b> l\'axe est son propre symétrique.', ok: true,
      d: 'Oui : sa distance à l\'axe est nulle, il ne bouge pas.' },
    { t: 'La symétrie axiale <b>conserve les longueurs</b>.', ok: true,
      d: 'Oui : une figure et son image sont superposables. Les longueurs et les angles ne ' +
         'changent pas.' },
    { t: 'Par une symétrie axiale, une figure est <b>retournée</b>, comme dans un miroir.',
      ok: true,
      d: 'Oui, et c\'est ce qui la distingue de la symétrie centrale : le demi-tour fait ' +
         '<b>tourner</b> la figure sans la retourner.' },
    { t: 'Une symétrie axiale et une symétrie centrale donnent toujours la même image.',
      ok: false,
      d: 'Non : l\'axiale <b>retourne</b> la figure, la centrale la fait <b>tourner</b>. Les ' +
         'deux images ne sont pas au même endroit et n\'ont pas le même sens de lecture.' },
    { t: 'Un <b>rectangle</b> a 4 axes de symétrie.', ok: false,
      d: 'Non, il en a <b>2</b> : les médiatrices de ses côtés. Ses diagonales n\'en sont pas — ' +
         'si on plie le long d\'une diagonale, les deux moitiés ne se superposent pas. Le carré, ' +
         'lui, en a bien 4.' },
    { t: 'Un <b>parallélogramme quelconque</b> n\'a aucun axe de symétrie.', ok: true,
      d: 'Oui — mais il a un <b>centre</b> de symétrie. Axe et centre sont deux choses ' +
         'différentes.' },
    { t: 'Si ' + '\\(M\'\\)' + ' est le symétrique de ' + '\\(M\\)' + ' par rapport à ' +
         '\\((d)\\)' + ', alors ' + '\\(M\\)' + ' est le symétrique de ' + '\\(M\'\\)' +
         ' par rapport à ' + '\\((d)\\)' + '.', ok: true,
      d: 'Oui : la droite est la médiatrice de ' + '\\([MM\']\\)' + ', et cela ne dépend pas du ' +
         'sens dans lequel on lit le segment.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense à la définition : l\'axe est la <b>médiatrice</b> de ' +
                '\\([MM\']\\)' + ' — et une symétrie axiale <b>retourne</b> la figure.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'symetrie-axiale', competence: 'sym-axiale', level: '6eme',
    titre: 'Symétrie axiale', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['coord', 'coord', 'axesFigure', 'longueur', 'proprietes'] :
        palier === 2 ? ['coord', 'coord', 'image', 'axesFigure', 'longueur', 'proprietes'] :
        palier === 3 ? ['coord', 'image', 'axe', 'axesFigure', 'longueur', 'proprietes'] :
                       ['image', 'image', 'axe', 'axe', 'axesFigure', 'proprietes']);

      if (quoi === 'image') return qImage(rnd, palier);
      if (quoi === 'axe') return qAxe(rnd, palier);
      if (quoi === 'axesFigure') return qAxesFigure(rnd, palier);
      if (quoi === 'longueur') return qLongueur(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qCoord(rnd, palier);
    }
  });

})();
