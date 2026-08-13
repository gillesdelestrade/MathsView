/*
 * angles-6e — reconnaître et mesurer un angle (leçon 6ème « Mesurer un angle
 * au rapporteur »).
 *
 * Trois choses à savoir faire en sixième, et le générateur ne fait que les
 * décliner :
 *
 *   nature      d'après le DESSIN : cet angle est-il aigu, droit, obtus, plat ?
 *   natureNb    d'après la MESURE : 118°, c'est quoi ? L'inverse du précédent,
 *               et beaucoup plus facile — d'où sa place au premier palier ;
 *   estime      d'après le dessin encore, mais cette fois on demande un nombre.
 *               Les propositions sont très écartées : on estime, on ne mesure
 *               pas, et c'est justement ce qu'il faut apprendre à faire avant
 *               de prendre le rapporteur ;
 *   rapporteur  la vraie difficulté du chapitre. Le côté croise le bord entre
 *               DEUX nombres, et il faut choisir. La figure est un vrai
 *               rapporteur à deux graduations, et le leurre principal est
 *               toujours 180 − la bonne réponse : c'est l'erreur qu'on fait ;
 *   nommer      le vocabulaire : sommet, côtés, et la notation d'un angle ;
 *   proprietes  vrai/faux sur les mesures de référence et sur ce qu'un angle
 *               n'est pas (une longueur).
 *
 * Les figures viennent de exos/6eme/geo-outils.js.
 */
(function () {
  'use strict';
  var O = ExosOutils;
  var G = GeoOutils;

  var LETTRES = ['A', 'B', 'C', 'D', 'E', 'F', 'M', 'N', 'P', 'R', 'S', 'T'];

  function ang(s) { return '\\(' + s + '\\)'; }
  function chapeau(s) { return '\\(\\widehat{' + s + '}\\)'; }

  // Une orientation de départ qui ne pose pas l'angle bêtement à plat : on
  // évite les côtés horizontaux, sinon la nature se lit sans réfléchir.
  function depart(rnd, mesure) {
    for (var i = 0; i < 60; i++) {
      var a = rnd.entier(-40, 200);
      if (a + mesure > 210 || a < -45) continue;
      if (Math.abs(a % 180) < 8 || Math.abs((a + mesure) % 180) < 8) continue;
      return a;
    }
    return 15;
  }

  /* ===================================================================== */
  /* 1. La nature d'un angle, d'après le dessin                            */
  /* ===================================================================== */
  function qNature(rnd, palier) {
    // On écarte les mesures ambiguës : un angle de 88° dessiné n'est pas
    // reconnaissable à l'œil, et la question deviendrait un piège.
    var quoi = rnd.choix(palier >= 3 ? ['aigu', 'droit', 'obtus', 'plat']
                                     : ['aigu', 'droit', 'obtus']);
    var m = quoi === 'droit' ? 90 : quoi === 'plat' ? 180
          : quoi === 'aigu' ? rnd.entier(20, 72) : rnd.entier(108, 165);
    var lettres = rnd.melange(LETTRES.slice()).slice(0, 3);

    var ordre = rnd.melange(['aigu', 'droit', 'obtus', 'plat']);
    var LIB = { aigu: 'Un angle aigu', droit: 'Un angle droit',
                obtus: 'Un angle obtus', plat: 'Un angle plat' };

    return {
      enonce: 'Observe cet angle.' +
        G.angleFig({ mesure: m, depart: quoi === 'plat' ? 0 : depart(rnd, m),
                     noms: lettres, droit: quoi === 'droit' }) +
        'Quelle est sa <b>nature</b> ?',
      type: 'qcm',
      choix: ordre.map(function (k) { return LIB[k]; }),
      correct: ordre.indexOf(quoi),
      etapes: [
        'On compare toujours à l\'<b>angle droit</b>, qui mesure <b>90°</b> — le coin d\'une ' +
          'équerre, ou le coin d\'une feuille.',
        quoi === 'droit'
          ? 'Ici le <b>petit carré</b> dessiné au sommet code l\'angle droit : cet angle mesure ' +
            'exactement <b>90°</b>.'
          : quoi === 'plat'
            ? 'Ici les deux côtés sont dans le <b>prolongement</b> l\'un de l\'autre : ils forment ' +
              'une droite. C\'est un angle <b>plat</b>, il mesure <b>180°</b>.'
            : quoi === 'aigu'
              ? 'Ici l\'angle est <b>plus fermé</b> qu\'un angle droit : il est <b>aigu</b> ' +
                '(sa mesure est inférieure à 90°).'
              : 'Ici l\'angle est <b>plus ouvert</b> qu\'un angle droit, mais ses côtés ne sont ' +
                'pas alignés : il est <b>obtus</b> (sa mesure est comprise entre 90° et 180°).',
        '<b>À retenir :</b> aigu < 90° &nbsp;·&nbsp; droit = 90° &nbsp;·&nbsp; 90° < obtus < 180° ' +
          '&nbsp;·&nbsp; plat = 180°.'
      ],
      indices: ['Compare avec le coin d\'une feuille de papier : l\'angle est-il plus fermé ou ' +
                  'plus ouvert ?',
                'Si les deux côtés forment une droite, l\'angle est plat.'],
      duree: 40
    };
  }

  /* ===================================================================== */
  /* 2. La nature, d'après la mesure                                       */
  /* ===================================================================== */
  function qNatureNb(rnd, palier) {
    var quoi = rnd.choix(['aigu', 'aigu', 'droit', 'obtus', 'obtus', 'plat']);
    var m = quoi === 'droit' ? 90 : quoi === 'plat' ? 180
          : quoi === 'aigu' ? rnd.entier(1, 89) : rnd.entier(91, 179);
    var ordre = rnd.melange(['aigu', 'droit', 'obtus', 'plat']);
    var LIB = { aigu: 'Aigu', droit: 'Droit', obtus: 'Obtus', plat: 'Plat' };

    return {
      enonce: 'Un angle mesure <b>' + O.fr(m) + '°</b>. Quelle est sa nature ?',
      type: 'qcm',
      choix: ordre.map(function (k) { return LIB[k]; }),
      correct: ordre.indexOf(quoi),
      etapes: [
        'Il suffit de comparer la mesure à <b>90°</b> et à <b>180°</b>.',
        O.fr(m) + '° ' + (quoi === 'aigu' ? 'est <b>plus petit</b> que 90° : l\'angle est <b>aigu</b>.'
          : quoi === 'droit' ? 'est exactement 90° : l\'angle est <b>droit</b>.'
          : quoi === 'obtus' ? 'est compris <b>entre 90° et 180°</b> : l\'angle est <b>obtus</b>.'
          : 'est exactement 180° : l\'angle est <b>plat</b>, ses côtés forment une droite.'),
        '<b>À retenir :</b> aigu < 90° &nbsp;·&nbsp; droit = 90° &nbsp;·&nbsp; 90° < obtus < 180° ' +
          '&nbsp;·&nbsp; plat = 180°.'
      ],
      indices: ['Range la mesure par rapport à 90° et à 180°.'],
      duree: 25
    };
  }

  /* ===================================================================== */
  /* 3. Estimer la mesure d'un angle dessiné                               */
  /* ===================================================================== */
  function qEstime(rnd, palier) {
    // Les propositions sont écartées d'au moins 35° : on veut une estimation,
    // pas une mesure à l'œil, qui serait injuste.
    var m = rnd.entier(2, 16) * 10;                      // de 20° à 160°
    if (m === 90) m = rnd.booleen(0.5) ? 70 : 110;
    var ecart = palier >= 3 ? 35 : 45;
    var props = [m];
    [-2, -1, 1, 2].forEach(function (k) {
      var v = m + k * ecart;
      if (v > 5 && v < 180 && props.length < 4 &&
          props.every(function (x) { return Math.abs(x - v) >= ecart; })) props.push(v);
    });
    for (var essai = 0; essai < 60 && props.length < 4; essai++) {
      var v2 = rnd.entier(1, 17) * 10;
      if (props.every(function (x) { return Math.abs(x - v2) >= ecart; })) props.push(v2);
    }
    // Repli déterministe : on balaie les mesures possibles et on prend les plus
    // écartées, pour ne jamais rester bloqué avec moins de quatre propositions.
    for (var v3 = 10; v3 <= 170 && props.length < 4; v3 += 10) {
      if (props.every(function (x) { return Math.abs(x - v3) >= ecart; })) props.push(v3);
    }
    for (var v4 = 10; v4 <= 170 && props.length < 4; v4 += 10) {
      if (props.indexOf(v4) < 0) props.push(v4);
    }
    props = rnd.melange(props);

    return {
      enonce: 'Voici un angle, dessiné sans rapporteur.' +
        G.angleFig({ mesure: m, depart: depart(rnd, m), valeur: '?' }) +
        'À ton avis, quelle est sa mesure ?',
      type: 'qcm',
      choix: props.map(function (v) { return O.fr(v) + '°'; }),
      correct: props.indexOf(m),
      etapes: [
        'Pas besoin de rapporteur pour ranger un angle : on se sert de <b>repères</b>.',
        'Un angle <b>droit</b> vaut 90°, un <b>demi</b> angle droit vaut 45°, un angle ' +
          '<b>plat</b> vaut 180°.',
        m < 90 ? 'Cet angle est nettement plus fermé qu\'un angle droit : sa mesure est ' +
                   'inférieure à 90°.'
               : 'Cet angle est plus ouvert qu\'un angle droit : sa mesure est supérieure à 90°.',
        'La bonne estimation est <b>' + O.fr(m) + '°</b>.'
      ],
      indices: ['Commence par te demander si l\'angle est plus petit ou plus grand qu\'un angle ' +
                  'droit : cela élimine déjà la moitié des propositions.',
                'Compare aussi à la moitié d\'un angle droit (45°).'],
      duree: 45
    };
  }

  /* ===================================================================== */
  /* 4. Lire une mesure sur le rapporteur                                  */
  /* ===================================================================== */
  function qRapporteur(rnd, palier) {
    // Le cœur du chapitre : le côté croise le bord entre DEUX nombres.
    var m = rnd.entier(3, 34) * 5;                       // multiple de 5, de 15° à 170°
    if (m === 90) m = rnd.booleen(0.5) ? 85 : 95;
    var base = palier >= 3 && rnd.booleen(0.5) ? 'gauche' : 'droite';
    var autre = 180 - m;

    var props = rnd.melange([m, autre, m + 10 <= 175 ? m + 10 : m - 10,
                             autre - 10 > 5 ? autre - 10 : autre + 10]);
    // On enlève les doublons éventuels, puis on complète.
    var vus = {}, choix = [];
    props.forEach(function (v) { if (!vus[v]) { vus[v] = 1; choix.push(v); } });
    while (choix.length < 4) {
      var v = rnd.entier(1, 35) * 5;
      if (!vus[v]) { vus[v] = 1; choix.push(v); }
    }
    choix = rnd.melange(choix.slice(0, 4));
    if (choix.indexOf(m) < 0) choix[0] = m;

    return {
      enonce: 'Un rapporteur a été posé sur l\'angle : son <b>centre</b> est sur le sommet ' +
        ang('O') + ', et un côté est posé sur le <b>0</b> ' +
        (base === 'gauche' ? '<b>de gauche</b>' : '<b>de droite</b>') + '.' +
        G.rapporteurFig({ mesure: m, base: base }) +
        'Quelle est la mesure de cet angle ?',
      type: 'qcm',
      choix: choix.map(function (v) { return O.fr(v) + '°'; }),
      correct: choix.indexOf(m),
      etapes: [
        'Le second côté croise le bord entre <b>deux</b> nombres : ' + O.fr(m) + ' et ' +
          O.fr(autre) + '. Toute la question est de choisir le bon.',
        'La règle sûre : on suit la graduation qui part de <b>0 sur le côté posé</b>. Ici le 0 ' +
          'est ' + (base === 'gauche' ? 'à gauche, on suit donc la graduation ' +
            '<span style="color:#e11d48;font-weight:700">rose</span>'
            : 'à droite, on suit donc la graduation ' +
            '<span style="color:#2563eb;font-weight:700">bleue</span>') + '.',
        'On peut vérifier autrement : l\'angle est <b>' + (m < 90 ? 'aigu' : 'obtus') +
          '</b>, donc sa mesure est ' + (m < 90 ? 'plus petite' : 'plus grande') + ' que 90°. ' +
          'Des deux nombres, c\'est bien <b>' + O.fr(m) + '</b>.',
        'L\'angle mesure <b>' + O.fr(m) + '°</b>.'
      ],
      indices: [
        'Deux nombres sont possibles : ' + O.fr(Math.min(m, autre)) + ' et ' +
          O.fr(Math.max(m, autre)) + '. Regarde si l\'angle est plus fermé ou plus ouvert ' +
          'qu\'un angle droit.',
        'Angle aigu → on prend le plus petit des deux. Angle obtus → on prend le plus grand.'
      ],
      duree: 70
    };
  }

  /* ===================================================================== */
  /* 5. Le vocabulaire : sommet, côtés, notation                           */
  /* ===================================================================== */
  function qNommer(rnd, palier) {
    var l = rnd.melange(LETTRES.slice()).slice(0, 3);
    var A = l[0], S = l[1], B = l[2];
    var m = rnd.entier(30, 150);
    var quoi = rnd.choix(['sommet', 'notation']);

    if (quoi === 'sommet') {
      var ordre = rnd.melange([S, A, B]);
      return {
        enonce: 'Voici l\'angle ' + chapeau(A + S + B) + '.' +
          G.angleFig({ mesure: m, depart: depart(rnd, m), noms: [A, S, B] }) +
          'Quel est le <b>sommet</b> de cet angle ?',
        type: 'qcm',
        choix: ordre.map(function (x) { return 'Le point ' + x; }),
        correct: ordre.indexOf(S),
        etapes: [
          'Dans la notation ' + chapeau(A + S + B) + ', le sommet est la lettre du <b>milieu</b>.',
          'Ici c\'est donc le point ' + ang(S) + ' — et on le voit bien sur la figure : c\'est le ' +
            'point d\'où partent les deux côtés.',
          'Les deux autres lettres, ' + ang(A) + ' et ' + ang(B) + ', indiquent seulement sur ' +
            'quels côtés on se place.'
        ],
        indices: ['La lettre du milieu, dans la notation d\'un angle, est toujours le sommet.'],
        duree: 30
      };
    }
    var bonnes = [chapeau(A + S + B), chapeau(B + S + A)];
    var mauvaises = [chapeau(S + A + B), chapeau(A + B + S), chapeau(S + B + A)];
    var prop = rnd.melange([bonnes[rnd.entier(0, 1)], mauvaises[0], mauvaises[1], mauvaises[2]]);
    return {
      enonce: 'Sur cette figure, l\'angle a pour sommet ' + ang(S) + ', et ses deux côtés ' +
        'passent par ' + ang(A) + ' et par ' + ang(B) + '.' +
        G.angleFig({ mesure: m, depart: depart(rnd, m), noms: [A, S, B] }) +
        'Comment peut-on <b>noter</b> cet angle ?',
      type: 'qcm',
      choix: prop,
      correct: prop.map(function (x) { return bonnes.indexOf(x) >= 0; }).indexOf(true),
      etapes: [
        'On note un angle avec <b>trois lettres</b>, et le <b>sommet au milieu</b>.',
        'Le sommet est ' + ang(S) + ', les côtés passent par ' + ang(A) + ' et ' + ang(B) +
          ' : on écrit donc ' + chapeau(A + S + B) + ' — ou ' + chapeau(B + S + A) + ', c\'est ' +
          'le même angle.',
        'Les autres écritures placent le sommet ailleurs qu\'au milieu : elles désignent un ' +
          'autre angle, ou rien du tout.'
      ],
      indices: ['Le sommet se met <b>au milieu</b> des trois lettres.'],
      duree: 35
    };
  }

  /* ===================================================================== */
  /* 6. Vrai ou faux                                                       */
  /* ===================================================================== */
  var AFFIRMATIONS = [
    { t: 'Un angle droit mesure <b>90°</b>.', ok: true,
      d: 'Oui : c\'est le coin d\'une équerre, ou le coin d\'une feuille.' },
    { t: 'Un angle plat mesure <b>360°</b>.', ok: false,
      d: 'Non, un angle plat mesure <b>180°</b> : ses deux côtés sont dans le prolongement l\'un ' +
         'de l\'autre et forment une droite.' },
    { t: 'Un angle aigu est <b>plus fermé</b> qu\'un angle droit.', ok: true,
      d: 'Oui : sa mesure est inférieure à 90°.' },
    { t: 'Un angle obtus mesure <b>plus de 180°</b>.', ok: false,
      d: 'Non : un angle obtus mesure <b>entre 90° et 180°</b>. Plus de 180°, ce ne serait même ' +
         'plus un angle saillant.' },
    { t: 'On mesure un angle en <b>centimètres</b>.', ok: false,
      d: 'Non : un angle se mesure en <b>degrés</b> (°). Les centimètres mesurent des longueurs. ' +
         'D\'ailleurs, allonger les côtés d\'un angle ne change pas sa mesure.' },
    { t: 'Si on <b>rallonge les côtés</b> d\'un angle, sa mesure augmente.', ok: false,
      d: 'Non : la mesure d\'un angle ne dépend que de son <b>ouverture</b>, pas de la longueur ' +
         'des traits qu\'on a dessinés.' },
    { t: 'Pour mesurer un angle, on pose le <b>centre</b> du rapporteur sur le <b>sommet</b>.',
      ok: true,
      d: 'Oui, et on pose ensuite le <b>0</b> sur l\'un des deux côtés. C\'est ce 0 qui dit quelle ' +
         'graduation suivre.' },
    { t: 'Le rapporteur porte deux graduations parce qu\'il y a deux façons de poser le 0.',
      ok: true,
      d: 'Oui : une pour le 0 à droite, l\'autre pour le 0 à gauche. On suit celle qui part de 0 ' +
         'sur le côté posé.' }
  ];

  function qProprietes(rnd, palier) {
    var a = rnd.choix(AFFIRMATIONS);
    return {
      enonce: 'Vrai ou faux ?<br>' + a.t,
      type: 'vraifaux',
      correct: a.ok ? 0 : 1,
      etapes: [(a.ok ? '<b>Vrai.</b> ' : '<b>Faux.</b> ') + a.d],
      indices: ['Repense aux trois mesures de référence : 90° pour l\'angle droit, 180° pour ' +
                'l\'angle plat, et le degré comme unité.'],
      duree: 30
    };
  }

  /* ===================================================================== */
  MathsExos.register({
    id: 'angles-6e', competence: 'angles-6e', level: '6eme',
    titre: 'Reconnaître et mesurer un angle', paliers: 4,

    genere: function (rnd, palier) {
      var quoi = rnd.choix(
        palier === 1 ? ['natureNb', 'natureNb', 'nature', 'nature', 'proprietes'] :
        palier === 2 ? ['nature', 'natureNb', 'nommer', 'estime', 'proprietes'] :
        palier === 3 ? ['nature', 'nommer', 'estime', 'rapporteur', 'rapporteur', 'proprietes'] :
                       ['estime', 'rapporteur', 'rapporteur', 'rapporteur', 'nommer',
                        'proprietes']);

      if (quoi === 'natureNb') return qNatureNb(rnd, palier);
      if (quoi === 'estime') return qEstime(rnd, palier);
      if (quoi === 'rapporteur') return qRapporteur(rnd, palier);
      if (quoi === 'nommer') return qNommer(rnd, palier);
      if (quoi === 'proprietes') return qProprietes(rnd, palier);
      return qNature(rnd, palier);
    }
  });

})();
