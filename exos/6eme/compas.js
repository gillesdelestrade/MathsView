/*
 * compas — construire à la règle et au compas (leçon 6ème « Constructions au
 * compas »).
 *
 * ---------------------------------------------------------------------------
 * Le principe : on construit pour CHERCHER, on répond en cochant
 * ---------------------------------------------------------------------------
 * Une médiatrice ou une bissectrice ne se calcule pas, elle se trace. L'énoncé
 * pose donc une figure — un segment [AB], ou un angle — et quatre points autour.
 * La question est « lesquels de ces points sont sur la médiatrice ? », et la
 * réponse se coche. Mais elle est INTROUVABLE à l'œil : les points hors de la
 * droite n'en sont écartés que de deux ou trois millimètres. Il faut donc
 * réellement construire.
 *
 * D'où les deux outils, sous la figure :
 *
 *   COMPAS  on appuie sur le centre, on tire jusqu'au rayon voulu, on relâche.
 *           Le rayon s'affiche pendant le tracé, arrondi au millimètre — c'est
 *           ce qui permet de refaire DEUX arcs de même rayon, geste sans lequel
 *           aucune de ces constructions ne marche.
 *   RÈGLE   on appuie sur un point, on tire jusqu'à un autre, la droite est
 *           tracée (prolongée des deux côtés, comme une vraie droite).
 *
 * ---------------------------------------------------------------------------
 * Ce qui rend la construction réellement faisable
 * ---------------------------------------------------------------------------
 * Sur le papier, le crayon se pose « là où les arcs se croisent ». À l'écran,
 * il faut le rendre possible : chaque tracé AIMANTE les points remarquables —
 * les points nommés, et surtout les INTERSECTIONS des cercles entre eux et des
 * cercles avec les côtés de la figure, calculées et marquées d'un petit point
 * dès qu'elles apparaissent. Sans cela, tracer la droite qui passe par les deux
 * croisements d'arcs serait une affaire de pixels, et l'exercice porterait sur
 * l'adresse à la souris au lieu de la géométrie.
 *
 * ---------------------------------------------------------------------------
 * Les réponses sont calculées, jamais posées à la main
 * ---------------------------------------------------------------------------
 * Un point est sur la médiatrice de [AB] lorsqu'il est à égale distance de A et
 * de B ; sur la bissectrice lorsqu'il est à égale distance des deux côtés. Le
 * générateur place les points À PARTIR de cette propriété, puis vérifie chacun
 * par le calcul avant de composer la réponse : impossible d'annoncer un point
 * comme étant sur la droite s'il ne l'est pas.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var ENCRE = '#334155', BLEU = '#2563eb', ORANGE = '#ea580c';
  var TRACE = '#7c3aed', AIMANT = '#94a3b8';

  /* ===================================================================== */
  /* Un peu de géométrie                                                   */
  /* ===================================================================== */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function unit(a) { var n = len(a); return n < 1e-9 ? [1, 0] : [a[0] / n, a[1] / n]; }
  function mil(a, b) { return mul(add(a, b), 0.5); }
  function dist(a, b) { return len(sub(a, b)); }
  // La distance d'un point à la droite (uv).
  function distDroite(p, u, v) {
    var d = sub(v, u);
    return Math.abs(d[0] * (p[1] - u[1]) - d[1] * (p[0] - u[0])) / len(d);
  }
  function tourne(v, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }

  /* ===================================================================== */
  /* Les instruments                                                       */
  /* ===================================================================== */
  /* Compas, règle, aimantation aux croisements : tout cela vit dans
     exos/instruments.js, partagé avec les constructions de triangles de 5ème.
     Ici on se contente de dire quels outils on met à disposition. */
  function fabriqueFigure(donnees) {
    return MathsInstruments.figure(donnees, { outils: ['compas', 'regle'] });
  }

  /* ===================================================================== */
  /* Poser les quatre points à juger                                        */
  /* ===================================================================== */
  /*
   * Deux points exactement sur la droite (base, dir), deux légèrement à côté.
   * Trois contraintes se contredisent et doivent être tenues ensemble :
   *   — l'écart des points « à côté » doit rester INVISIBLE à l'œil nu (sinon
   *     la construction ne sert à rien) mais franc une fois la droite tracée :
   *     3 à 7 mm, soit un bon millimètre à l'écran ;
   *   — les quatre points doivent être assez espacés pour que les étiquettes
   *     C, D, E, F ne se chevauchent pas ;
   *   — tout doit tenir dans le cadre, étiquette comprise.
   * On tire donc les positions et on REJETTE tant que ce n'est pas le cas,
   * plutôt que de bricoler les points après coup — les rattraper d'un coup de
   * pouce, c'était risquer de faire passer un point « à côté » sur la droite.
   */
  var CADRE = [-9, 5.2, 9, -5.2];
  // Jusqu'où peut-on avancer depuis `base` dans la direction `dir` en restant
  // dans le cadre ? Sert à borner le tirage au lieu de tirer puis rejeter.
  function portee(base, dir) {
    var t = 0;
    while (t < 12 && dansCadre(add(base, mul(dir, t + 0.1)))) t += 0.1;
    return t;
  }
  function dansCadre(p) {
    // La marge est plus large en haut : c'est de ce côté que l'étiquette d'un
    // point se dessine, et une lettre coupée par le bord est illisible.
    return p[0] > CADRE[0] + 0.8 && p[0] < CADRE[2] - 0.9 &&
           p[1] < CADRE[1] - 0.9 && p[1] > CADRE[3] + 0.5;
  }
  function posePoints(rnd, base, dir, tmin, tmax) {
    var perp = [-dir[1], dir[0]];
    for (var essai = 0; essai < 300; essai++) {
      var places = rnd.melange([1, 1, 0, 0]);      // 1 : sur la droite
      var ts = [], t = tmin + rnd.entier(0, 8) / 10, ok = true;
      for (var i = 0; i < 4; i++) { ts.push(t); t += 1.3 + rnd.entier(0, 7) / 10; }
      if (ts[3] > tmax) continue;
      // on décale l'ensemble au hasard dans la place restante
      var jeu = rnd.entier(0, Math.max(0, Math.floor((tmax - ts[3]) * 10))) / 10;
      var pts = ts.map(function (v, k) {
        var e = places[k] ? 0 : (rnd.booleen(0.5) ? 1 : -1) * (0.3 + rnd.entier(0, 4) / 10);
        return add(add(base, mul(dir, v + jeu)), mul(perp, e));
      });
      pts.forEach(function (p) { if (!dansCadre(p)) ok = false; });
      for (i = 1; i < 4 && ok; i++) {
        for (var j = 0; j < i; j++) if (dist(pts[i], pts[j]) < 1.2) ok = false;
      }
      if (ok) return pts;
    }
    return null;
  }

  // Où poser l'étiquette d'un point ? Du côté opposé à la figure : une lettre
  // couchée sur un trait ne se lit plus. `dir` est la direction à fuir.
  function etiquette(dir) {
    var w = unit(dir);
    return [Math.round(w[0] * 20), Math.round(w[1] * 20)];
  }

  /* ===================================================================== */
  /* 1. Quels points sont sur la médiatrice ?                              */
  /* ===================================================================== */
  function qMediatrice(rnd, palier) {
    // Un segment franchement oblique : une médiatrice horizontale ou verticale
    // se devinerait sans rien construire.
    var ang = rnd.entier(20, 70) * (rnd.booleen(0.5) ? 1 : -1);
    var L = rnd.entier(6, 8);
    var u = tourne([1, 0], ang * Math.PI / 180);
    var M = [rnd.entier(-2, 2) / 2, rnd.entier(-1, 1) / 2];
    var A = add(M, mul(u, -L / 2)), B = add(M, mul(u, L / 2));
    var n = [-u[1], u[0]];                       // la direction de la médiatrice

    // Les points se répartissent de part et d'autre de [AB], le long de la
    // médiatrice : on en pose deux d'un côté, deux de l'autre.
    var noms = ['C', 'D', 'E', 'F'];
    var pts = posePoints(rnd, M, n, -portee(M, mul(n, -1)), portee(M, n));
    if (!pts) return qEtapes(rnd, palier);       // figure impossible : on change de question
    // Le verdict est CALCULÉ, jamais recopié du tirage.
    var corrects = [];
    pts.forEach(function (p, k) {
      if (Math.abs(dist(p, A) - dist(p, B)) < 1e-9) corrects.push(k);
    });

    var donnees = {
      points: [{ nom: 'A', p: A, offset: etiquette(mul(u, -1)) },
               { nom: 'B', p: B, offset: etiquette(u) }].concat(
        pts.map(function (p, k) {
          // le long de [AB], donc jamais sur la médiatrice une fois tracée
          return { nom: noms[k], p: p, role: 'test', offset: etiquette(u) };
        })),
      traits: [[A, B]]
    };

    return {
      enonce: 'Voici un segment ' + '\\([AB]\\)' + ' et quatre points.<br>' +
        '<b>Construis la médiatrice de ' + '\\([AB]\\)' + '</b> avec le compas et la règle, ' +
        'puis coche les points qui sont dessus.',
      type: 'qcm-multi',
      figure: fabriqueFigure(donnees),
      board: { boundingbox: [-9, 5.2, 9, -5.2], keepaspectratio: true },
      consigneFig: 'Deux arcs de même rayon, l\'un centré sur A, l\'autre sur B : la droite qui ' +
        'joint leurs deux croisements est la médiatrice.',
      choix: noms.map(function (x) { return 'Le point ' + x; }),
      corrects: corrects,
      etapes: [
        '<b>La construction.</b> On pique le compas sur ' + '\\(A\\)' + ' et on trace un arc ' +
          'assez grand (plus que la moitié de ' + '\\(AB\\)' + '). Sans changer l\'écartement, ' +
          'on pique sur ' + '\\(B\\)' + ' et on trace un second arc. Les deux arcs se croisent ' +
          'en deux points : la droite qui les joint est la <b>médiatrice</b>.',
        '<b>Pourquoi ça marche.</b> Chacun des deux croisements est à la même distance de ' +
          '\\(A\\)' + ' et de ' + '\\(B\\)' + ' — c\'est le même écartement de compas. Or les ' +
          'points à égale distance de ' + '\\(A\\)' + ' et de ' + '\\(B\\)' + ' forment ' +
          'exactement la médiatrice.',
        '<b>La propriété à retenir.</b> Un point est sur la médiatrice de ' + '\\([AB]\\)' +
          ' <b>si et seulement si</b> il est à égale distance de ' + '\\(A\\)' + ' et de ' +
          '\\(B\\)' + '. C\'est aussi la droite <b>perpendiculaire</b> à ' + '\\([AB]\\)' +
          ' qui passe par son <b>milieu</b>.',
        'Ici : ' + pts.map(function (p, k) {
          var da = dist(p, A), db = dist(p, B);
          return noms[k] + ' est à ' + O.fr(Math.round(da * 10) / 10) + ' cm de A et ' +
            O.fr(Math.round(db * 10) / 10) + ' cm de B → ' +
            (corrects.indexOf(k) >= 0 ? '<b>sur</b> la médiatrice' : 'à côté');
        }).join(' ; ') + '.'
      ],
      indices: [
        'Écarte le compas de plus de la moitié de ' + '\\(AB\\)' + ', pique sur A, trace un arc ; ' +
          'puis <b>sans rien changer</b>, pique sur B et trace un second arc.',
        'La droite passe par les <b>deux</b> croisements des arcs. Le crayon s\'aimante dessus.'
      ],
      duree: 180
    };
  }

  /* ===================================================================== */
  /* 2. Quels points sont sur la bissectrice ?                             */
  /* ===================================================================== */
  function qBissectrice(rnd, palier) {
    // Le sommet se place à gauche, l'angle s'ouvre vers la droite : c'est là
    // qu'il reste de la place pour la bissectrice et les quatre points.
    var O0 = [rnd.entier(-14, -10) / 2, rnd.entier(-4, 2) / 2];
    var ouv = rnd.entier(40, 72) * Math.PI / 180;      // l'ouverture de l'angle
    var dep = (rnd.entier(-30, 30) - ouv * 90 / Math.PI) * Math.PI / 180;
    var u1 = tourne([1, 0], dep), u2 = tourne([1, 0], dep + ouv);
    var b = unit(add(u1, u2));                          // la bissectrice

    // Les côtés sont coupés à la longueur qui tient dans le cadre : un côté qui
    // sort emporterait son étiquette hors de l'écran, et surtout le premier arc
    // le couperait en un point qu'on ne verrait pas.
    var L1 = portee(O0, u1), L2 = portee(O0, u2);
    if (L1 < 4.5 || L2 < 4.5) return qMediatrice(rnd, palier);
    var P1 = add(O0, mul(u1, L1)), P2 = add(O0, mul(u2, L2));

    var noms = ['C', 'D', 'E', 'F'];
    var pts = posePoints(rnd, O0, b, 1.6, portee(O0, b));
    if (!pts) return qEtapes(rnd, palier);
    // Sur la bissectrice ⟺ à égale distance des deux côtés.
    var corrects = [];
    pts.forEach(function (p, k) {
      if (Math.abs(distDroite(p, O0, P1) - distDroite(p, O0, P2)) < 1e-9) corrects.push(k);
    });

    var donnees = {
      points: [{ nom: 'O', p: O0, offset: etiquette(mul(b, -1)) },
               { nom: 'M', p: add(O0, mul(u1, L1 * 0.88)), offset: etiquette(sub(u1, b)) },
               { nom: 'N', p: add(O0, mul(u2, L2 * 0.88)), offset: etiquette(sub(u2, b)) }]
        .concat(pts.map(function (p, k) {
          // perpendiculairement à la bissectrice : l'étiquette reste lisible
          // même quand la droite finit par passer sur le point
          return { nom: noms[k], p: p, role: 'test', offset: etiquette([-b[1], b[0]]) };
        })),
      traits: [[O0, P1], [O0, P2]]
    };

    return {
      enonce: 'Voici un angle ' + '\\(\\widehat{MON}\\)' + ' et quatre points.<br>' +
        '<b>Construis la bissectrice de cet angle</b> avec le compas et la règle, puis coche ' +
        'les points qui sont dessus.',
      type: 'qcm-multi',
      figure: fabriqueFigure(donnees),
      board: { boundingbox: [-9, 5.2, 9, -5.2], keepaspectratio: true },
      consigneFig: 'Un arc centré sur O coupe les deux côtés ; deux arcs de même rayon centrés ' +
        'sur ces croisements se coupent sur la bissectrice.',
      choix: noms.map(function (x) { return 'Le point ' + x; }),
      corrects: corrects,
      etapes: [
        '<b>La construction.</b> On pique le compas sur ' + '\\(O\\)' + ' et on trace un arc qui ' +
          'coupe les <b>deux côtés</b> de l\'angle. De chacun de ces deux croisements, on trace ' +
          'un arc — le <b>même écartement</b> pour les deux. Ces deux derniers arcs se croisent ' +
          'en un point ; la droite qui le joint à ' + '\\(O\\)' + ' est la <b>bissectrice</b>.',
        '<b>Pourquoi ça marche.</b> Le premier arc donne deux points à égale distance de ' +
          '\\(O\\)' + ', un sur chaque côté. Les deux arcs suivants, de même rayon, se croisent ' +
          'en un point à égale distance de ces deux-là : la figure est <b>symétrique</b> par ' +
          'rapport à la droite obtenue, qui partage donc l\'angle en deux parts égales.',
        '<b>La propriété à retenir.</b> La bissectrice partage l\'angle en <b>deux angles ' +
          'égaux</b>. Ses points sont à <b>égale distance des deux côtés</b>.',
        'Ici : ' + pts.map(function (p, k) {
          return noms[k] + ' est à ' + O.fr(Math.round(distDroite(p, O0, P1) * 10) / 10) +
            ' cm d\'un côté et ' + O.fr(Math.round(distDroite(p, O0, P2) * 10) / 10) +
            ' cm de l\'autre → ' +
            (corrects.indexOf(k) >= 0 ? '<b>sur</b> la bissectrice' : 'à côté');
        }).join(' ; ') + '.'
      ],
      indices: [
        'Commence par un arc centré sur ' + '\\(O\\)' + ' : il doit couper les deux côtés.',
        'Puis deux arcs de <b>même rayon</b>, centrés sur ces deux croisements. La bissectrice ' +
          'joint ' + '\\(O\\)' + ' à leur point de rencontre.'
      ],
      duree: 200
    };
  }

  /* ===================================================================== */
  /* 3. L'ordre des étapes                                                 */
  /* ===================================================================== */
  function qEtapes(rnd, palier) {
    var mediatrice = rnd.booleen(0.5);
    var bonnes = mediatrice
      ? ['On pique le compas sur A et on trace un arc.',
         'Sans changer l\'écartement, on pique sur B et on trace un second arc.',
         'On trace la droite qui passe par les deux croisements des arcs.']
      : ['On pique le compas sur O et on trace un arc qui coupe les deux côtés.',
         'Du même écartement, on trace un arc depuis chacun des deux croisements.',
         'On trace la droite qui joint O au point de rencontre de ces deux arcs.'];
    var fausses = mediatrice
      ? ['On mesure AB à la règle et on marque le milieu au jugé.',
         'On trace un arc depuis A, puis un arc <b>plus petit</b> depuis B.',
         'On trace la droite qui joint A au croisement des arcs.']
      : ['On mesure l\'angle au rapporteur et on partage la mesure en deux.',
         'On trace un arc depuis O, puis on relie directement les deux croisements.',
         'On trace un arc depuis O, puis deux arcs de <b>rayons différents</b>.'];
    var etape = rnd.entier(0, 2);
    var prop = rnd.melange([{ c: 'bon', t: bonnes[etape] }].concat(
      fausses.map(function (t) { return { c: 'faux', t: t }; })));

    return {
      enonce: 'On construit la <b>' + (mediatrice ? 'médiatrice d\'un segment [AB]' :
        'bissectrice d\'un angle de sommet O') + '</b> au compas.<br>' +
        'Quelle est la <b>' + ['première', 'deuxième', 'troisième'][etape] + '</b> étape ?',
      type: 'qcm',
      choix: prop.map(function (p) { return p.t; }),
      correct: prop.map(function (p) { return p.c; }).indexOf('bon'),
      etapes: ['La construction complète, dans l\'ordre :']
        .concat(bonnes.map(function (t, i) { return '<b>' + (i + 1) + '.</b> ' + t; }))
        .concat([mediatrice
          ? 'Le point clé est de <b>ne pas changer l\'écartement</b> entre les deux arcs : c\'est ' +
            'lui qui garantit que les croisements sont à égale distance de A et de B.'
          : 'Le point clé est là aussi le <b>même écartement</b> pour les deux derniers arcs : ' +
            'c\'est ce qui rend la figure symétrique.']),
      indices: ['Repense au geste : où pique-t-on le compas en premier ?',
                'Ce qui fait marcher la construction, c\'est de <b>garder le même écartement</b>.'],
      duree: 60
    };
  }

  /* ===================================================================== */
  /* 4. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Un point de la médiatrice de \\([AB]\\) est à <b>égale distance</b> de \\(A\\) et de ' +
         '\\(B\\).', ok: true,
      d: 'Oui, et c\'est même sa définition : la médiatrice est l\'ensemble de ces points.' },
    { t: 'La médiatrice de \\([AB]\\) passe par le <b>milieu</b> de \\([AB]\\).', ok: true,
      d: 'Oui, et elle lui est <b>perpendiculaire</b> : c\'est l\'autre façon de la définir.' },
    { t: 'La médiatrice de \\([AB]\\) est <b>parallèle</b> à \\([AB]\\).', ok: false,
      d: 'Non : elle lui est <b>perpendiculaire</b>. Deux droites parallèles ne se couperaient ' +
         'jamais, alors que la médiatrice coupe \\([AB]\\) en son milieu.' },
    { t: 'Pour tracer une médiatrice au compas, les deux arcs doivent avoir le <b>même ' +
         'écartement</b>.', ok: true,
      d: 'Oui : c\'est ce qui garantit que leurs croisements sont à égale distance de \\(A\\) et ' +
         'de \\(B\\). Avec deux écartements différents, la droite obtenue serait fausse.' },
    { t: 'La bissectrice d\'un angle le partage en <b>deux angles égaux</b>.', ok: true,
      d: 'Oui, c\'est sa définition. Ses points sont à égale distance des deux côtés.' },
    { t: 'On a besoin d\'un <b>rapporteur</b> pour tracer une bissectrice.', ok: false,
      d: 'Non : le compas et la règle suffisent, et c\'est bien plus précis que de partager une ' +
         'mesure en deux.' },
    { t: 'La médiatrice d\'un segment est <b>unique</b>.', ok: true,
      d: 'Oui : il n\'y a qu\'une droite perpendiculaire à \\([AB]\\) passant par son milieu.' },
    { t: 'Un point à égale distance des deux côtés d\'un angle est sur sa bissectrice.',
      ok: true,
      d: 'Oui — c\'est la propriété qui permet de reconnaître les points de la bissectrice sans ' +
         'la tracer.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Médiatrice : à égale distance des deux <b>extrémités</b>. Bissectrice : à ' +
                'égale distance des deux <b>côtés</b>.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'compas', competence: 'compas', level: '6eme',
    titre: 'Constructions au compas', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['proprietes', 'etapes', 'etapes', 'mediatrice'] :
        palier === 2 ? ['etapes', 'mediatrice', 'mediatrice', 'proprietes'] :
        palier === 3 ? ['mediatrice', 'mediatrice', 'bissectrice', 'etapes', 'proprietes'] :
                       ['mediatrice', 'bissectrice', 'bissectrice', 'proprietes']);

      if (quoi === 'bissectrice') return qBissectrice(rnd, palier);
      if (quoi === 'etapes') return qEtapes(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qMediatrice(rnd, palier);
    }
  });

})();
