/*
 * angles-par — angles et droites parallèles (leçon 5ème « Angles et droites
 * parallèles »).
 *
 * TOUJOURS LA MÊME FIGURE, et c'est voulu : la droite (AB) est parallèle à la
 * droite (CD), la sécante (EF) coupe (AB) en G et (CD) en H. Huit angles :
 *
 *          AGE   EGB          au croisement G
 *          AGF   FGB
 *          CHE   EHD          au croisement H
 *          CHF   FHD
 *
 * L'élève retrouve la même configuration à chaque question — ce qui compte
 * n'est pas de déchiffrer un nouveau dessin, mais de savoir LIRE celui-là.
 *
 * ---------------------------------------------------------------------------
 * Le modèle : trois bits par angle
 * ---------------------------------------------------------------------------
 * Chaque angle est repéré par trois informations seulement :
 *   - son SOMMET          : G ou H ;
 *   - le côté de la droite : gauche (A, C) ou droite (B, D) ;
 *   - le côté de la sécante: haut (E) ou bas (F).
 * Tout le reste s'en déduit, sans aucune table écrite à la main :
 *   - la MESURE : les quatre angles (droite,haut) et (gauche,bas) valent a,
 *     les quatre autres valent 180 − a. D'où deux paquets de quatre angles
 *     égaux, et c'est la réponse attendue par la question principale ;
 *   - le NOM de la relation entre deux angles : même sommet et les deux côtés
 *     opposés → opposés par le sommet ; sommets différents et mêmes côtés →
 *     correspondants ; sommets différents et les deux côtés opposés →
 *     alternes-internes ou alternes-externes selon qu'ils sont entre les
 *     droites ou non ;
 *   - les DIRECTIONS des deux demi-droites qui bordent l'angle, donc le
 *     secteur à colorier sur la figure.
 * Ajouter un angle ou une question ne demande donc jamais de ressaisir quoi
 * que ce soit : les quatre familles de questions lisent le même modèle.
 *
 * ---------------------------------------------------------------------------
 * Les quatre familles de questions
 * ---------------------------------------------------------------------------
 *   egaux       on donne un angle et sa mesure, l'élève coche TOUS les angles
 *               qui lui sont égaux (cases à cocher) — le cœur de la leçon ;
 *   mesure      on donne un angle, on en demande un autre : parfois le même
 *               paquet (égalité), parfois l'autre (supplémentaire), et la
 *               correction passe alors par un angle intermédiaire ;
 *   nom         comment s'appelle cette paire ? (vocabulaire) ;
 *   reciproque  deux mesures données, les droites sont-elles parallèles ?
 *               C'est la RÉCIPROQUE, celle qui sert à démontrer. La figure y
 *               est volontairement fausse (et le dit) pour qu'on ne puisse pas
 *               répondre à l'œil.
 *
 * La figure est un SVG écrit ici même : deux droites, une sécante, les huit
 * points, et le ou les secteurs coloriés. Elle est tracée à partir du VRAI
 * angle a, donc elle est juste, et le sens de la sécante change d'une question
 * à l'autre (elle penche à droite ou à gauche) pour qu'on ne retienne pas des
 * positions mais un raisonnement.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  /* ===================================================================== */
  /* Le modèle des huit angles                                             */
  /* ===================================================================== */
  // c : côté de la droite, 'g' (vers A ou C) ou 'd' (vers B ou D)
  // v : côté de la sécante, 'h' (vers E) ou 'b' (vers F)
  var ANGLES = [
    { nom: 'AGE', s: 'G', c: 'g', v: 'h' },
    { nom: 'EGB', s: 'G', c: 'd', v: 'h' },
    { nom: 'AGF', s: 'G', c: 'g', v: 'b' },
    { nom: 'FGB', s: 'G', c: 'd', v: 'b' },
    { nom: 'CHE', s: 'H', c: 'g', v: 'h' },
    { nom: 'EHD', s: 'H', c: 'd', v: 'h' },
    { nom: 'CHF', s: 'H', c: 'g', v: 'b' },
    { nom: 'FHD', s: 'H', c: 'd', v: 'b' }
  ];

  // Les deux paquets : 1 → mesure a, 0 → mesure 180 − a.
  function groupe(a) { return (a.c === 'd') === (a.v === 'h') ? 1 : 0; }

  // Un angle est « interne » s'il est situé entre les deux droites.
  function interne(a) { return a.s === 'G' ? a.v === 'b' : a.v === 'h'; }

  // La mesure, en degrés. `tilt` (rotation de (CD)) n'est non nul que dans les
  // questions sur la réciproque, où les droites ne sont pas parallèles.
  function mesure(a, alpha, tilt) {
    var t = (a.s === 'H' ? (tilt || 0) : 0);
    return groupe(a) === 1 ? alpha - t : 180 - alpha + t;
  }

  // Comment s'appelle la paire (a ; b) ?
  function relation(a, b) {
    if (a.nom === b.nom) return 'meme';
    if (a.s === b.s) return (a.c !== b.c && a.v !== b.v) ? 'opposes' : 'adjacents';
    if (a.c === b.c && a.v === b.v) return 'correspondants';
    if (a.c !== b.c && a.v !== b.v) {
      return interne(a) ? 'alternes-internes' : 'alternes-externes';
    }
    return 'aucune';      // même côté de la sécante mais pas la même place
  }

  var NOMS = {
    'opposes': 'opposés par le sommet',
    'correspondants': 'correspondants',
    'alternes-internes': 'alternes-internes',
    'alternes-externes': 'alternes-externes',
    'adjacents': 'adjacents supplémentaires'
  };
  // Les quatre relations qui portent un nom au programme (les angles adjacents
  // supplémentaires, eux, ne font pas partie du vocabulaire à reconnaître).
  var NOMMEES = ['correspondants', 'alternes-internes', 'alternes-externes', 'opposes'];
  function nommee(rel) { return NOMMEES.indexOf(rel) >= 0; }
  // Pourquoi ce nom-là : la phrase qui fait comprendre le vocabulaire.
  function pourquoi(rel, a, b) {
    if (rel === 'opposes') {
      return 'ils ont le même sommet et leurs côtés sont dans le prolongement ' +
             'l\'un de l\'autre (ils forment un « papillon »)';
    }
    if (rel === 'correspondants') {
      return 'ils sont du même côté de la sécante et occupent la même place à ' +
             'chacun des deux croisements (tous les deux au-dessus de leur droite, ' +
             'ou tous les deux en dessous)';
    }
    if (rel === 'alternes-internes') {
      return 'ils sont tous les deux <b>entre</b> les deux droites (internes) et ' +
             'de part et d\'autre de la sécante (alternes)';
    }
    if (rel === 'alternes-externes') {
      return 'ils sont tous les deux <b>à l\'extérieur</b> des deux droites ' +
             '(externes) et de part et d\'autre de la sécante (alternes)';
    }
    return 'ils ont le même sommet et un côté commun : ensemble ils forment un ' +
           'angle plat';
  }

  function ang(a) { return '\\(\\widehat{' + (a.nom || a) + '}\\)'; }
  function deg(v) { return O.fr(v) + '°'; }

  /* ===================================================================== */
  /* La figure, en SVG                                                     */
  /* ===================================================================== */
  var W = 440, HH = 300, YT = 85, YB = 215, XC = 220, R = 32;
  var C_DROITE = '#2563eb', C_SEC = '#334155', C_PT = '#334155';
  var C_M1 = '#7c3aed', C_M2 = '#ea580c';

  function rad(d) { return d * Math.PI / 180; }
  function n1(v) { return Math.round(v * 10) / 10; }

  // Les quatre points remarquables, calculés à partir du vrai angle.
  function points(alpha) {
    var t = Math.tan(rad(alpha));
    var dx = (YB - YT) / t;                 // décalage de H par rapport à G
    var xG = XC + dx / 2, xH = XC - dx / 2;
    var d = 53;                             // de combien E et F dépassent
    return { G: [xG, YT], H: [xH, YB],
             E: [xG + d / t, YT - d], F: [xH - d / t, YB + d] };
  }

  // Les directions (en degrés, repère mathématique) des deux demi-drotes qui
  // bordent l'angle : celle de la droite, puis celle de la sécante.
  function directions(a, alpha, tilt) {
    var t = tilt || 0;
    var dl = a.s === 'G' ? (a.c === 'g' ? 180 : 0)
                         : (a.c === 'g' ? 180 + t : t);
    return [dl, a.v === 'h' ? alpha : alpha + 180];
  }

  function trait(x1, y1, x2, y2, col, ep) {
    return '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) +
           '" y2="' + n1(y2) + '" stroke="' + col + '" stroke-width="' + ep +
           '" stroke-linecap="round"/>';
  }
  function pastille(p, col) {
    return '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="3.4" fill="' +
           (col || C_PT) + '"/>';
  }
  // Un texte lisible même par-dessus un secteur colorié : liseré blanc.
  function texte(x, y, s, col, taille, ancre) {
    return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + (taille || 15) +
           '" font-weight="700" font-family="system-ui, sans-serif" fill="' +
           (col || C_PT) + '" stroke="#fff" stroke-width="3.5" paint-order="stroke" ' +
           'text-anchor="' + (ancre || 'middle') + '">' + s + '</text>';
  }

  // Le secteur : on part du sommet, on longe l'arc, on revient. On choisit le
  // sens qui donne l'angle SAILLANT (moins de 180°), jamais son rentrant.
  function secteur(v, d1, d2, col) {
    var ecart = ((d2 - d1) % 360 + 360) % 360;
    var a1 = ecart < 180 ? d1 : d2, a2 = ecart < 180 ? d2 : d1;
    var ouv = ((a2 - a1) % 360 + 360) % 360;
    var p = 'M ' + n1(v[0]) + ' ' + n1(v[1]);
    for (var k = 0; k <= 24; k++) {
      var a = rad(a1 + ouv * k / 24);
      p += ' L ' + n1(v[0] + R * Math.cos(a)) + ' ' + n1(v[1] - R * Math.sin(a));
    }
    return { path: '<path d="' + p + ' Z" fill="' + col + '" fill-opacity="0.22" ' +
                   'stroke="' + col + '" stroke-width="2"/>',
             milieu: rad(a1 + ouv / 2) };
  }

  /*
   * o = {
   *   alpha    : l'angle de la sécante avec (AB), en degrés ;
   *   tilt     : rotation de (CD) autour de H (0 → droites parallèles) ;
   *   marques  : [{ a: angle, txt: '118°', couleur: '…' }] ;
   *   codage   : afficher les chevrons du parallélisme ?
   * }
   */
  function figure(o) {
    var alpha = o.alpha, tilt = o.tilt || 0, p = points(alpha);
    var tt = Math.tan(rad(tilt));
    function yCD(x) { return YB - (x - p.H[0]) * tt; }

    var s = ['<svg viewBox="0 0 ' + W + ' ' + HH + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="max-width:' + W + 'px;width:100%;height:auto;display:block;margin:0.7rem auto" ' +
      'role="img" aria-label="Les droites (AB) et (CD) coupées par la sécante (EF) ' +
      'en G et en H.">'];

    // 1. les secteurs coloriés, sous les traits
    var etiquettes = [];
    (o.marques || []).forEach(function (m) {
      var v = p[m.a.s], d = directions(m.a, alpha, tilt);
      var sec = secteur(v, d[0], d[1], m.couleur || C_M1);
      s.push(sec.path);
      if (m.txt) {
        // La mesure se lit JUSTE AU-DELÀ de l'arc, sur la bissectrice : dans un
        // secteur de 40° elle ne tiendrait pas à l'intérieur.
        etiquettes.push(texte(v[0] + 1.22 * R * Math.cos(sec.milieu),
                              v[1] - 1.22 * R * Math.sin(sec.milieu) + 5,
                              m.txt, m.couleur || C_M1, 14));
      }
    });

    // 2. les trois droites
    s.push(trait(25, YT, 415, YT, C_DROITE, 2.5));
    s.push(trait(25, yCD(25), 415, yCD(415), C_DROITE, 2.5));
    s.push(trait(p.E[0], p.E[1], p.F[0], p.F[1], C_SEC, 2));

    // 3. le codage du parallélisme (jamais quand les droites ne le sont pas)
    if (o.codage) {
      s.push('<polyline points="84,' + (YT - 6) + ' 92,' + YT + ' 84,' + (YT + 6) +
             '" fill="none" stroke="' + C_DROITE + '" stroke-width="2"/>');
      s.push('<polyline points="84,' + (YB - 6) + ' 92,' + YB + ' 84,' + (YB + 6) +
             '" fill="none" stroke="' + C_DROITE + '" stroke-width="2"/>');
    }

    // 4. les points et leurs noms
    var A = [30, YT], B = [410, YT], C = [30, yCD(30)], D = [410, yCD(410)];
    [A, B, C, D, p.E, p.F].forEach(function (q) { s.push(pastille(q)); });
    s.push(pastille(p.G, C_SEC)); s.push(pastille(p.H, C_SEC));
    s.push(texte(A[0], A[1] - 11, 'A'));
    s.push(texte(B[0], B[1] - 11, 'B'));
    s.push(texte(C[0], C[1] + 20, 'C'));
    s.push(texte(D[0], D[1] + 20, 'D'));
    s.push(texte(p.E[0], p.E[1] - 10, 'E'));
    s.push(texte(p.F[0], p.F[1] + 20, 'F'));
    s.push(texte(p.G[0] - 15, p.G[1] - 10, 'G'));
    s.push(texte(p.H[0] - 15, p.H[1] + 21, 'H'));

    // 5. les mesures, tout en haut de la pile : elles doivent rester lisibles
    etiquettes.forEach(function (e) { s.push(e); });

    s.push('</svg>');
    return s.join('');
  }

  // L'énoncé commence toujours par le rappel de la configuration.
  var CONFIG = 'Sur la figure, la droite \\((AB)\\) est <b>parallèle</b> à la droite ' +
    '\\((CD)\\). La <b>sécante</b> \\((EF)\\) coupe \\((AB)\\) en \\(G\\) et ' +
    '\\((CD)\\) en \\(H\\).';

  // Sécante penchée à droite ou à gauche : la figure change vraiment de tête,
  // et les angles égaux ne sont jamais aux mêmes endroits.
  function tirageAlpha(rnd) {
    return rnd.booleen(0.5) ? rnd.entier(38, 72) : rnd.entier(108, 142);
  }

  /* ===================================================================== */
  /* 1. « Lesquels sont égaux ? » — la question principale                  */
  /* ===================================================================== */
  function qEgaux(rnd, palier) {
    var alpha = tirageAlpha(rnd);
    var donne = rnd.choix(ANGLES);
    var m = mesure(donne, alpha, 0), autre = 180 - m;
    var marque = palier <= 2;          // aux premiers paliers, l'angle est colorié
    var autreSommet = donne.s === 'G' ? 'H' : 'G';

    var ordre = rnd.melange(ANGLES.filter(function (a) { return a.nom !== donne.nom; }));
    var corrects = [];
    ordre.forEach(function (a, i) { if (groupe(a) === groupe(donne)) corrects.push(i); });

    // La correction : chaque angle égal, avec le NOM de la relation qui le
    // justifie — c'est cela qu'on veut voir réutilisé dans une démonstration.
    var etapes = [
      'Les droites \\((AB)\\) et \\((CD)\\) sont parallèles : les angles ' +
        '<b>correspondants</b> sont égaux, et les angles <b>alternes-internes</b> ' +
        'aussi. On ajoute les angles <b>opposés par le sommet</b>, égaux dans tous ' +
        'les cas.'
    ];
    corrects.forEach(function (i) {
      var a = ordre[i], rel = relation(donne, a);
      etapes.push(ang(a) + ' et ' + ang(donne) + ' sont <b>' + NOMS[rel] + '</b> : ' +
        pourquoi(rel, donne, a) + '. Donc ' + ang(a) + ' = ' + deg(m) + '.');
    });
    etapes.push('Les quatre autres angles sont les <b>supplémentaires</b> de ' +
      ang(donne) + ' : ils mesurent \\(180° - ' + O.tex(m) + '° = ' + O.tex(autre) +
      '°\\). Ce sont ' +
      ordre.filter(function (a, i) { return corrects.indexOf(i) < 0; })
           .map(function (a) { return ang(a); }).join(', ') + '.');
    etapes.push('<b>À retenir :</b> dans cette figure il n\'y a que <b>deux mesures</b>, ' +
      deg(m) + ' et ' + deg(autre) + ', et elles alternent autour de chaque croisement.');

    return {
      enonce: CONFIG + '<br>On sait que ' + ang(donne) + ' \\(= ' + O.tex(m) + '°\\).' +
        figure({ alpha: alpha, codage: true,
                 marques: marque ? [{ a: donne, txt: deg(m), couleur: C_M1 }] : [] }) +
        'Coche <b>tous</b> les angles qui mesurent eux aussi ' + deg(m) + '.',
      type: 'qcm-multi',
      choix: ordre.map(function (a) { return ang(a); }),
      corrects: corrects,
      etapes: etapes,
      indices: [
        'Commence par le sommet \\(' + donne.s + '\\) : quel angle est <b>opposé par ' +
          'le sommet</b> à ' + ang(donne) + ' ? Il lui est égal.',
        'Passe ensuite au sommet \\(' + autreSommet + '\\) : les angles y sont disposés ' +
          '<b>exactement de la même façon</b> qu\'en \\(' + donne.s + '\\), puisque les ' +
          'droites sont parallèles.'
      ],
      duree: 100
    };
  }

  /* ===================================================================== */
  /* 2. « Combien mesure cet angle ? »                                     */
  /* ===================================================================== */
  function qMesure(rnd, palier) {
    var alpha = tirageAlpha(rnd);
    var donne = rnd.choix(ANGLES);
    // Aux paliers élevés, on demande plus souvent le supplémentaire : il faut
    // alors enchaîner deux raisonnements au lieu d'un.
    var memeGroupe = rnd.booleen(palier >= 3 ? 0.35 : 0.65);
    var cibles = ANGLES.filter(function (a) {
      return a.nom !== donne.nom && (groupe(a) === groupe(donne)) === memeGroupe;
    });
    var cible = rnd.choix(cibles);
    var m = mesure(donne, alpha, 0), r = mesure(cible, alpha, 0);

    var etapes = [];
    if (memeGroupe) {
      var rel = relation(donne, cible);
      etapes.push(ang(donne) + ' et ' + ang(cible) + ' sont <b>' + NOMS[rel] + '</b> : ' +
        pourquoi(rel, donne, cible) + '.');
      etapes.push((rel === 'opposes'
          ? 'Deux angles opposés par le sommet sont toujours égaux.'
          : 'Les droites étant <b>parallèles</b>, deux angles ' + NOMS[rel] +
            ' sont égaux.') +
        ' Donc ' + ang(cible) + ' = ' + ang(donne) + ' = ' + deg(r) + '.');
    } else if (donne.s === cible.s) {
      etapes.push(ang(donne) + ' et ' + ang(cible) + ' sont <b>adjacents</b> et leurs ' +
        'côtés extérieurs sont alignés : ensemble ils forment un <b>angle plat</b>.');
      etapes.push('Donc ' + ang(cible) + ' \\(= 180° - ' + O.tex(m) + '° = ' +
        O.tex(r) + '°\\).');
    } else {
      // Sommets différents ET paquets différents : on passe par un angle relais.
      var relais = ANGLES.filter(function (a) {
        return a.s === cible.s && groupe(a) === groupe(donne) &&
               relation(donne, a) === 'correspondants';
      })[0] || ANGLES.filter(function (a) {
        return a.s === cible.s && groupe(a) === groupe(donne) &&
               relation(donne, a) !== 'aucune';
      })[0];
      var rel2 = relation(donne, relais);
      etapes.push('On passe par ' + ang(relais) + ', qui a le même sommet que ' +
        ang(cible) + '.');
      etapes.push(ang(relais) + ' et ' + ang(donne) + ' sont <b>' + NOMS[rel2] +
        '</b> : les droites sont parallèles, donc ' + ang(relais) + ' = ' + deg(m) + '.');
      etapes.push(ang(relais) + ' et ' + ang(cible) + ' sont <b>adjacents</b> et forment ' +
        'un angle plat, donc ' + ang(cible) + ' \\(= 180° - ' + O.tex(m) + '° = ' +
        O.tex(r) + '°\\).');
    }

    return {
      enonce: CONFIG + '<br>On sait que ' + ang(donne) + ' \\(= ' + O.tex(m) + '°\\).' +
        figure({ alpha: alpha, codage: true,
                 marques: [{ a: donne, txt: deg(m), couleur: C_M1 },
                           { a: cible, txt: '?', couleur: C_M2 }] }) +
        'Quelle est la mesure de ' + ang(cible) + ' ?',
      type: 'nombre', reponse: r, unite: '°',
      etapes: etapes,
      indices: [
        'Les deux angles sont-ils <b>égaux</b> ou <b>supplémentaires</b> ? Regarde ' +
          's\'ils occupent la même place autour de leur croisement.',
        'Dans cette figure il n\'y a que deux mesures possibles : ' + deg(m) + ' et ' +
          '\\(180° - ' + O.tex(m) + '°\\).'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 3. « Comment s'appelle cette paire ? » — le vocabulaire                */
  /* ===================================================================== */
  function qNom(rnd, palier) {
    var alpha = tirageAlpha(rnd);
    // Toutes les paires qui portent un nom, l'élève doit reconnaître laquelle.
    var paires = [];
    ANGLES.forEach(function (a) {
      ANGLES.forEach(function (b) {
        var rel = relation(a, b);
        if (a.nom < b.nom && nommee(rel)) paires.push({ a: a, b: b, rel: rel });
      });
    });
    var p = rnd.choix(paires);
    var cles = ['correspondants', 'alternes-internes', 'alternes-externes', 'opposes'];
    var ordre = rnd.melange(cles);

    return {
      enonce: CONFIG +
        figure({ alpha: alpha, codage: true,
                 marques: [{ a: p.a, couleur: C_M1 }, { a: p.b, couleur: C_M2 }] }) +
        'Comment s\'appellent les angles ' + ang(p.a) + ' et ' + ang(p.b) + ' ' +
        '(coloriés sur la figure) ?',
      type: 'qcm',
      choix: ordre.map(function (k) { return 'Des angles ' + NOMS[k]; }),
      correct: ordre.indexOf(p.rel),
      etapes: [
        'Ce sont des angles <b>' + NOMS[p.rel] + '</b> : ' + pourquoi(p.rel, p.a, p.b) + '.',
        p.rel === 'opposes'
          ? 'Deux angles opposés par le sommet sont égaux — et cela n\'a rien à voir ' +
            'avec le parallélisme, c\'est vrai à n\'importe quel croisement.'
          : 'Comme \\((AB)\\) et \\((CD)\\) sont parallèles, ces deux angles sont ' +
            '<b>égaux</b> : ils mesurent tous les deux ' +
            deg(mesure(p.a, alpha, 0)) + '.'
      ],
      indices: [
        'Deux questions à se poser : ont-ils le <b>même sommet</b> ? Sont-ils <b>entre</b> ' +
          'les deux droites ou à l\'extérieur ?',
        '« Alternes » = de part et d\'autre de la sécante. « Correspondants » = du ' +
          'même côté de la sécante, à la même place aux deux croisements.'
      ],
      duree: 55
    };
  }

  /* ===================================================================== */
  /* 4. La réciproque : ces droites sont-elles parallèles ?                 */
  /* ===================================================================== */
  function qReciproque(rnd, palier) {
    var alpha = tirageAlpha(rnd);
    var paires = [];
    ANGLES.forEach(function (a) {
      ANGLES.forEach(function (b) {
        var rel = relation(a, b);
        if (a.s === 'G' && b.s === 'H' && nommee(rel)) paires.push({ a: a, b: b, rel: rel });
      });
    });
    var p = rnd.choix(paires);
    var vrai = rnd.booleen(0.5);
    var mA = mesure(p.a, alpha, 0);
    var ecart = rnd.entier(6, 16) * rnd.signe();
    var mB = vrai ? mA : mA + ecart;
    // La figure est tracée avec un léger décalage DANS LES DEUX CAS : elle ne
    // doit surtout pas donner la réponse à l'œil. On le dit franchement.
    var faux = rnd.booleen(0.5) ? 5 : -5;

    return {
      enonce: 'La sécante \\((EF)\\) coupe la droite \\((AB)\\) en \\(G\\) et la droite ' +
        '\\((CD)\\) en \\(H\\). On mesure ' + ang(p.a) + ' \\(= ' + O.tex(mA) + '°\\) et ' +
        ang(p.b) + ' \\(= ' + O.tex(mB) + '°\\).' +
        figure({ alpha: alpha, tilt: faux, codage: false,
                 marques: [{ a: p.a, txt: deg(mA), couleur: C_M1 },
                           { a: p.b, txt: deg(mB), couleur: C_M2 }] }) +
        '<b>⚠️ La figure n\'est pas en vraie grandeur</b> : elle ne permet pas de ' +
        'conclure, il faut raisonner.<br>Peut-on affirmer que \\((AB)\\) et \\((CD)\\) ' +
        'sont <b>parallèles</b> ?',
      type: 'vraifaux',
      correct: vrai ? 0 : 1,
      etapes: [
        ang(p.a) + ' et ' + ang(p.b) + ' sont des angles <b>' + NOMS[p.rel] + '</b> : ' +
          pourquoi(p.rel, p.a, p.b) + '.',
        '<b>Réciproque :</b> si deux droites coupées par une sécante forment des angles ' +
          NOMS[p.rel] + ' <b>égaux</b>, alors ces deux droites sont parallèles.',
        vrai
          ? 'Ici \\(' + O.tex(mA) + '° = ' + O.tex(mB) + '°\\) : les deux angles sont ' +
            'égaux, donc <b>oui</b>, \\((AB)\\) et \\((CD)\\) sont parallèles.'
          : 'Ici \\(' + O.tex(mA) + '° \\neq ' + O.tex(mB) + '°\\) : les deux angles ne ' +
            'sont pas égaux, donc <b>non</b>, les droites ne sont pas parallèles — elles ' +
            'se coupent quelque part, loin de la figure.'
      ],
      indices: [
        'Commence par nommer la paire : ' + ang(p.a) + ' et ' + ang(p.b) + ', quelle ' +
          'relation ?',
        'Si ces deux angles étaient égaux, que pourrais-tu en conclure ? Et s\'ils ne ' +
          'le sont pas ?'
      ],
      duree: 80
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'angles-paralleles', competence: 'angles-par', level: '5eme',
    titre: 'Angles et droites parallèles', paliers: 4,

    genere: function (rnd, palier) {
      // La question « lesquels sont égaux ? » reste majoritaire à tous les
      // paliers : c'est elle qui installe la configuration. Le vocabulaire
      // arrive ensuite, et la réciproque — celle qui sert à démontrer — en
      // dernier.
      var quoi = rnd.choix(
        palier === 1 ? ['egaux', 'egaux', 'egaux', 'mesure'] :
        palier === 2 ? ['egaux', 'egaux', 'mesure', 'nom'] :
        palier === 3 ? ['egaux', 'egaux', 'mesure', 'nom', 'reciproque'] :
                       ['egaux', 'egaux', 'mesure', 'mesure', 'nom',
                        'reciproque', 'reciproque']);

      if (quoi === 'mesure') return qMesure(rnd, palier);
      if (quoi === 'nom') return qNom(rnd, palier);
      if (quoi === 'reciproque') return qReciproque(rnd, palier);
      return qEgaux(rnd, palier);
    }
  });

})();
