/*
 * Exercices « Les trois états de l'eau » (5ème, physique-chimie).
 *
 * Cinq familles :
 *   - nommer : le passage d'un état à l'autre, en QCM puis en réponse écrite ;
 *   - sens : la liquéfaction, c'est de quel état à quel état ?
 *   - exemple : la buée, le givre, la flaque qui sèche… quel changement d'état ?
 *   - température et palier : 0 °C, 100 °C, la température qui ne bouge pas
 *     pendant le changement d'état ; et la lecture d'une courbe de chauffage
 *     dessinée (un point rouge : dans quel état ? à quelle température ?
 *     combien de temps dure la fusion ?) ;
 *   - masse et molécules : la masse se conserve, le volume non ; les
 *     molécules rangées, en désordre ou dispersées.
 *
 * La courbe est un SVG maison, relu par le contrôle : la position du point
 * sur la ligne rouge dit l'état et la température, sans faire confiance à
 * la réponse annoncée.
 */
(function () {
  'use strict';
  var O = ExosOutils;

  var ETAT = { solide: 'solide', liquide: 'liquide', gaz: 'gaz' };
  var TRANS = [
    { nom: 'fusion', de: 'solide', a: 'liquide', T: '0 °C' },
    { nom: 'solidification', de: 'liquide', a: 'solide', T: '0 °C' },
    { nom: 'vaporisation', de: 'liquide', a: 'gaz', T: '100 °C (ébullition)' },
    { nom: 'liquéfaction', de: 'gaz', a: 'liquide', T: '100 °C' },
    { nom: 'sublimation', de: 'solide', a: 'gaz', T: 'en dessous de 0 °C' },
    { nom: 'condensation', de: 'gaz', a: 'solide', T: 'en dessous de 0 °C' }
  ];
  var NOMS = TRANS.map(function (t) { return t.nom; });
  function trans(nom) { return TRANS.filter(function (t) { return t.nom === nom; })[0]; }
  function sens(t) { return ETAT[t.de] + ' → ' + ETAT[t.a]; }
  var ACCEPTE = {
    fusion: ['fusion', 'la fusion'], solidification: ['solidification', 'la solidification'],
    vaporisation: ['vaporisation', 'la vaporisation', 'ébullition', 'évaporation'],
    'liquéfaction': ['liquéfaction', 'la liquéfaction', 'liquefaction', 'condensation liquide'],
    sublimation: ['sublimation', 'la sublimation'],
    condensation: ['condensation', 'la condensation', 'condensation solide']
  };

  /* ------------------------------------------------------------------ */
  /* Nommer, et le sens                                                  */
  /* ------------------------------------------------------------------ */
  function nommer(rnd, palier) {
    var t = rnd.choix(TRANS);
    var q = '<p>Comment s\'appelle le passage de l\'état <b>' + t.de + '</b> à l\'état <b>' + t.a + '</b> ?</p>';
    var etapes = ['De ' + t.de + ' à ' + t.a + ', c\'est la <b>' + t.nom + '</b>.',
                  'Elle se produit ' + (/dessous/.test(t.T) ? t.T : 'à ' + t.T) + ' pour l\'eau pure.'];
    if (palier >= 3) {
      return { famille: 'nommer-texte', enonce: q + '<p>Écris le nom de ce changement d\'état.</p>', type: 'texte', reponse: ACCEPTE[t.nom], etapes: etapes,
               indices: ['Les six noms : fusion, solidification, vaporisation, liquéfaction, sublimation, condensation.'], duree: 35 };
    }
    var autres = rnd.melange(NOMS.filter(function (n) { return n !== t.nom; })).slice(0, 3);
    var choix = rnd.melange([t.nom].concat(autres));
    return { famille: 'nommer-qcm', enonce: q, type: 'qcm', choix: choix, correct: choix.indexOf(t.nom), etapes: etapes,
             indices: ['Fusion : le solide fond. Vaporisation : le liquide devient gaz. Les noms en « -ification » et « -faction » vont vers le solide et le liquide.'], duree: 30 };
  }
  function sensQ(rnd, palier) {
    var t = rnd.choix(TRANS);
    var autres = rnd.melange(TRANS.filter(function (x) { return x !== t; })).slice(0, 3).map(sens);
    var choix = rnd.melange([sens(t)].concat(autres));
    return { famille: 'sens', enonce: '<p>La <b>' + t.nom + '</b>, c\'est le passage…</p>', type: 'qcm', choix: choix, correct: choix.indexOf(sens(t)),
             etapes: ['La ' + t.nom + ' fait passer l\'eau de l\'état <b>' + t.de + '</b> à l\'état <b>' + t.a + '</b>.',
                      (t.de === 'solide' && t.a === 'gaz') || (t.de === 'gaz' && t.a === 'solide') ? 'Sans passer par l\'état liquide !' : 'Pour l\'eau pure, cela se passe à ' + t.T + '.'],
             indices: ['Repère d\'abord si on chauffe (vers le liquide puis le gaz) ou si on refroidit.'], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Des exemples de la vie courante                                     */
  /* ------------------------------------------------------------------ */
  var EXEMPLES = [
    { ex: 'un glaçon fond dans un verre', nom: 'fusion' },
    { ex: 'la neige fond au soleil', nom: 'fusion' },
    { ex: 'l\'eau du bac à glaçons gèle au congélateur', nom: 'solidification' },
    { ex: 'la surface du lac gèle en hiver', nom: 'solidification' },
    { ex: 'l\'eau bout dans la casserole', nom: 'vaporisation' },
    { ex: 'une flaque sèche au soleil', nom: 'vaporisation' },
    { ex: 'le linge mouillé sèche sur le fil', nom: 'vaporisation' },
    { ex: 'de la buée se forme sur une vitre froide', nom: 'liquéfaction' },
    { ex: 'la rosée se dépose sur l\'herbe au petit matin', nom: 'liquéfaction' },
    { ex: 'des gouttes se forment sous le couvercle de la casserole', nom: 'liquéfaction' },
    { ex: 'du givre se forme sur le pare-brise par une nuit très froide', nom: 'condensation', dur: true },
    { ex: 'des flocons de neige naissent dans un nuage glacé, directement à partir de la vapeur', nom: 'condensation', dur: true },
    { ex: 'par grand froid sec, la neige disparaît peu à peu sans fondre', nom: 'sublimation', dur: true },
    { ex: 'le linge gelé finit par sécher sans dégeler', nom: 'sublimation', dur: true }
  ];
  function exemple(rnd, palier) {
    var pool = palier >= 3 ? EXEMPLES : EXEMPLES.filter(function (e) { return !e.dur; });
    if (palier >= 4) pool = EXEMPLES.filter(function (e) { return e.dur; }).concat(EXEMPLES.slice(4, 10));
    var e = rnd.choix(pool), t = trans(e.nom);
    var autres = rnd.melange(NOMS.filter(function (n) { return n !== e.nom; })).slice(0, 3);
    var choix = rnd.melange([e.nom].concat(autres));
    return { famille: 'exemple', enonce: '<p>Quel changement d\'état se produit quand <b>' + e.ex + '</b> ?</p>', type: 'qcm', choix: choix, correct: choix.indexOf(e.nom),
             etapes: ['L\'eau passe de l\'état <b>' + t.de + '</b> à l\'état <b>' + t.a + '</b>.', 'C\'est la <b>' + t.nom + '</b>.'],
             indices: ['Dans quel état est l\'eau avant ? Et après ?'], duree: 35 };
  }

  /* ------------------------------------------------------------------ */
  /* Température, palier, et la courbe de chauffage                      */
  /* ------------------------------------------------------------------ */
  var TEMP = [
    { q: 'À quelle température l\'eau pure se met-elle à geler ?', rep: 0, why: 'L\'eau pure se solidifie à <b>0 °C</b>.' },
    { q: 'À quelle température la glace fond-elle ?', rep: 0, why: 'La glace fond à <b>0 °C</b> : fusion et solidification se font à la même température.' },
    { q: 'À quelle température l\'eau pure bout-elle, à la pression normale ?', rep: 100, why: 'L\'eau pure bout à <b>100 °C</b>.' },
    { q: 'Un thermomètre est plongé dans un mélange d\'eau et de glace en train de fondre. Qu\'indique-t-il ?', rep: 0, why: 'Tant qu\'il reste de la glace qui fond, la température reste à <b>0 °C</b> : c\'est le palier de fusion.' },
    { q: 'De l\'eau bout dans une casserole depuis cinq minutes. Qu\'indique le thermomètre plongé dedans ?', rep: 100, why: 'Tant que l\'eau bout, sa température reste à <b>100 °C</b> : c\'est le palier d\'ébullition. Chauffer plus fort ne la fait pas monter.' }
  ];
  var PALIER_VF = [
    { q: 'Pendant que la glace fond, la température du mélange eau + glace augmente.', vrai: false, why: 'Pendant toute la fusion, la température reste à 0 °C : c\'est un palier. La chaleur sert à faire fondre, pas à chauffer.' },
    { q: 'Pendant que l\'eau bout, sa température reste à 100 °C.', vrai: true, why: 'Tant qu\'il reste de l\'eau liquide, la température ne dépasse pas 100 °C : c\'est le palier d\'ébullition.' },
    { q: 'En chauffant plus fort une casserole d\'eau qui bout, on fait monter la température de l\'eau au-dessus de 100 °C.', vrai: false, why: 'Non : l\'eau bout plus vite, mais reste à 100 °C tant qu\'il en reste.' },
    { q: 'L\'eau pure gèle et la glace fond à la même température, 0 °C.', vrai: true, why: 'Fusion et solidification se font à la même température : 0 °C pour l\'eau pure.' },
    { q: 'La vapeur d\'eau est visible : c\'est le nuage blanc au-dessus de la casserole.', vrai: false, why: 'La vapeur d\'eau est un gaz invisible. Le nuage blanc, c\'est déjà de l\'eau liquide en fines gouttelettes (une liquéfaction).' }
  ];
  function temperature(rnd, palier) {
    if (rnd.booleen(0.5)) {
      var v = rnd.choix(PALIER_VF);
      return { famille: 'palier-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
               etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'], indices: ['Pense à la courbe de chauffage : les paliers sont horizontaux.'], duree: 35 };
    }
    var t = rnd.choix(TEMP);
    return { famille: 'temperature', enonce: '<p>' + t.q + '</p>', type: 'nombre', reponse: t.rep, unite: '°C',
             etapes: [t.why, 'Ces températures sont celles de l\'eau pure, à la pression normale.'], indices: ['0 °C ou 100 °C ?'], duree: 30 };
  }

  /* La courbe de chauffage dessinée : t en minutes, T en °C. */
  var W = 300, H = 190, X0 = 42, X1 = 282, Y0 = 160, Y1 = 22, TMIN = -20, TMAX = 120;
  function sx(t, tmax) { return +(X0 + t / tmax * (X1 - X0)).toFixed(1); }
  function sy(T) { return +(Y0 - (T - TMIN) / (TMAX - TMIN) * (Y0 - Y1)).toFixed(1); }
  function courbeSVG(coudes, tmax, instant) {
    var s = ['<svg class="exo-figure" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'];
    s.push('<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + (X1 + 8) + '" y2="' + Y0 + '" stroke="#334155" stroke-width="1.5"/>');
    s.push('<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="' + (Y1 - 8) + '" stroke="#334155" stroke-width="1.5"/>');
    for (var k = 0; k <= tmax; k++) {
      s.push('<line x1="' + sx(k, tmax) + '" y1="' + Y0 + '" x2="' + sx(k, tmax) + '" y2="' + (Y0 + 4) + '" stroke="#334155"/>');
      s.push('<text class="tick-t" x="' + sx(k, tmax) + '" y="' + (Y0 + 15) + '" font-size="10" text-anchor="middle" fill="#334155">' + k + '</text>');
    }
    [0, 100].forEach(function (T) {
      s.push('<line class="repere" x1="' + X0 + '" y1="' + sy(T) + '" x2="' + X1 + '" y2="' + sy(T) + '" stroke="#94a3b8" stroke-dasharray="3 3"/>');
      s.push('<text class="tick-T" x="' + (X0 - 4) + '" y="' + (sy(T) + 4) + '" font-size="10" text-anchor="end" fill="#334155">' + T + '</text>');
    });
    s.push('<text x="' + (X1 + 4) + '" y="' + (Y0 - 6) + '" font-size="10" text-anchor="end" fill="#334155">temps (min)</text>');
    s.push('<text x="' + (X0 + 4) + '" y="' + (Y1 - 4) + '" font-size="10" fill="#334155">T (°C)</text>');
    s.push('<polyline class="courbe" points="' + coudes.map(function (c) { return sx(c[0], tmax) + ',' + sy(c[1]); }).join(' ') + '" fill="none" stroke="#dc2626" stroke-width="2.5"/>');
    if (instant) s.push('<circle class="instant" cx="' + sx(instant[0], tmax) + '" cy="' + sy(instant[1]) + '" r="5" fill="#dc2626" stroke="#7f1d1d"/>');
    s.push('</svg>');
    return s.join('');
  }
  // Une courbe au hasard : glace de −20 °C, fusion, chauffe, ébullition, vapeur.
  function tirerCourbe(rnd) {
    var t1 = rnd.entier(1, 2), d1 = rnd.entier(1, 3), d2 = rnd.entier(2, 3), d3 = rnd.entier(1, 3);
    var t2 = t1 + d1, t3 = t2 + d2, t4 = t3 + d3, tmax = t4 + 1;
    return { coudes: [[0, -20], [t1, 0], [t2, 0], [t3, 100], [t4, 100], [tmax, 120]], tmax: tmax, t1: t1, t2: t2, t3: t3, t4: t4 };
  }
  var ETATS_COURBE = ['solide (de la glace)', 'en train de fondre : solide et liquide', 'liquide', 'en train de bouillir : liquide et gaz', 'gaz (de la vapeur)'];
  function courbe(rnd, palier) {
    var c = tirerCourbe(rnd);
    var forme = palier >= 4 ? rnd.choix(['etat', 'temperature', 'duree', 'duree']) : palier === 3 ? rnd.choix(['etat', 'temperature', 'duree']) : 'etat';
    var intro = '<p>La courbe montre la température de l\'eau qu\'on chauffe, de la glace jusqu\'à la vapeur.</p>';
    if (forme === 'duree') {
      var fusion = rnd.booleen(0.5);
      var duree = fusion ? c.t2 - c.t1 : c.t4 - c.t3;
      return { famille: 'courbe-duree', enonce: courbeSVG(c.coudes, c.tmax, null) + intro + '<p>Combien de temps dure ' + (fusion ? 'la <b>fusion</b> de la glace' : 'l\'<b>ébullition</b> (la vaporisation)') + ' ?</p>',
               type: 'nombre', reponse: duree, unite: 'min',
               etapes: ['Pendant un changement d\'état, la température ne bouge pas : c\'est le <b>palier</b> horizontal, à ' + (fusion ? '0' : '100') + ' °C.',
                        'Il va de ' + (fusion ? c.t1 + ' min à ' + c.t2 : c.t3 + ' min à ' + c.t4) + ' min : il dure <b>' + duree + ' min</b>.'],
               indices: ['Cherche le palier horizontal à ' + (fusion ? '0' : '100') + ' °C et lis ses deux extrémités sur l\'axe du temps.'], duree: 50 };
    }
    // Un instant sur un segment, à bonne distance des coudes.
    var seg = rnd.entier(0, 4), a = c.coudes[seg], b = c.coudes[seg + 1], t, T;
    if (forme === 'temperature') {
      if (seg === 1 || seg === 3) { T = a[1]; t = a[0] + (b[0] - a[0]) * rnd.entier(3, 7) / 10; }
      else {
        // une température « ronde » sur un segment qui monte
        var choixT = seg === 0 ? [-10] : seg === 2 ? [20, 40, 50, 60, 80] : [110];
        T = rnd.choix(choixT); t = a[0] + (b[0] - a[0]) * (T - a[1]) / (b[1] - a[1]);
      }
      return { famille: 'courbe-temperature', enonce: courbeSVG(c.coudes, c.tmax, [t, T]) + intro + '<p>Quelle est la température de l\'eau à l\'instant marqué par le point rouge ?</p>',
               type: 'nombre', reponse: T, unite: '°C',
               etapes: ['On lit la hauteur du point rouge sur l\'axe des températures, en s\'aidant des repères 0 et 100.', 'Le point est à <b>' + O.fr(T) + ' °C</b>' + (seg === 1 || seg === 3 ? ' : sur le palier, la température ne change pas.' : '.')],
               indices: ['Les pointillés marquent 0 °C et 100 °C.'], duree: 45 };
    }
    t = a[0] + (b[0] - a[0]) * rnd.entier(3, 7) / 10; T = a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    return { famille: 'courbe-etat', enonce: courbeSVG(c.coudes, c.tmax, [t, T]) + intro + '<p>À l\'instant marqué par le point rouge, dans quel état est l\'eau ?</p>',
             type: 'qcm', choix: ETATS_COURBE.slice(), correct: seg,
             etapes: ['Avant le premier palier, c\'est de la glace ; sur le palier à 0 °C, la glace fond ; entre les deux paliers, de l\'eau liquide ; sur le palier à 100 °C, l\'eau bout ; après, de la vapeur.',
                      'Le point rouge est ' + ['avant le palier de fusion', 'sur le palier de fusion', 'entre les deux paliers', 'sur le palier d\'ébullition', 'après le palier d\'ébullition'][seg] + ' : <b>' + ETATS_COURBE[seg] + '</b>.'],
             indices: ['Repère les deux paliers horizontaux : à 0 °C et à 100 °C.'], duree: 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Masse, volume, molécules                                            */
  /* ------------------------------------------------------------------ */
  var MOLECULES = [
    { q: 'Dans la <b>glace</b>, comment sont les molécules d\'eau ?', rep: 'ordonnées et serrées, elles vibrent sur place', autres: ['désordonnées et serrées, elles glissent', 'désordonnées et dispersées, très agitées'] },
    { q: 'Dans l\'<b>eau liquide</b>, comment sont les molécules d\'eau ?', rep: 'désordonnées et serrées, elles glissent', autres: ['ordonnées et serrées, elles vibrent sur place', 'désordonnées et dispersées, très agitées'] },
    { q: 'Dans la <b>vapeur d\'eau</b>, comment sont les molécules d\'eau ?', rep: 'désordonnées et dispersées, très agitées', autres: ['ordonnées et serrées, elles vibrent sur place', 'désordonnées et serrées, elles glissent'] },
    { q: 'Quand la glace fond, que deviennent les molécules d\'eau ?', rep: 'les mêmes molécules, mais en désordre', autres: ['des molécules différentes', 'elles disparaissent'] }
  ];
  var MASSE_VF = [
    { q: 'Quand l\'eau gèle, sa masse augmente.', vrai: false, why: 'La masse se conserve lors d\'un changement d\'état : 100 g d\'eau donnent 100 g de glace.' },
    { q: 'Quand l\'eau gèle, son volume augmente.', vrai: true, why: 'La glace prend plus de place que l\'eau liquide : une bouteille pleine éclate au congélateur.' },
    { q: 'Un glaçon de 30 g donne, en fondant, 30 g d\'eau liquide.', vrai: true, why: 'La masse se conserve : ce sont les mêmes molécules, seulement rangées autrement.' },
    { q: 'La glace flotte sur l\'eau parce qu\'elle est moins dense que l\'eau liquide.', vrai: true, why: 'Même masse, plus de volume : la glace est moins dense, donc elle flotte.' }
  ];
  function masseMolecules(rnd, palier) {
    var r = rnd.entier(1, 3);
    if (r === 1) {
      var m = rnd.entier(2, 40) * 5;
      var sensM = rnd.booleen(0.5);
      return { famille: 'masse', enonce: '<p>' + (sensM ? 'Un glaçon de <b>' + m + ' g</b> fond entièrement. Quelle est la masse de l\'eau liquide obtenue ?' : 'On met <b>' + m + ' g</b> d\'eau liquide au congélateur. Quelle est la masse de la glace obtenue ?') + '</p>',
               type: 'nombre', reponse: m, unite: 'g',
               etapes: ['Lors d\'un changement d\'état, la <b>masse se conserve</b> : ce sont les mêmes molécules, rangées autrement.', 'On obtient donc <b>' + m + ' g</b>' + (sensM ? ' d\'eau liquide.' : ' de glace (qui prend plus de place, mais pèse pareil).')],
               indices: ['Les molécules d\'eau sont-elles les mêmes avant et après ?'], duree: 30 };
    }
    if (r === 2) {
      var v = rnd.choix(MASSE_VF);
      return { famille: 'masse-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
               etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'], indices: ['La masse se conserve ; le volume, lui, change.'], duree: 30 };
    }
    var mq = rnd.choix(MOLECULES);
    var choix = rnd.melange([mq.rep].concat(mq.autres));
    return { famille: 'molecules', enonce: '<p>' + mq.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(mq.rep),
             etapes: ['Solide : ordonnées et serrées. Liquide : désordonnées et serrées. Gaz : désordonnées et dispersées.', 'Réponse : <b>' + mq.rep + '</b>.'],
             indices: ['Un solide garde sa forme, un liquide coule, un gaz occupe tout l\'espace : à quoi cela tient-il ?'], duree: 35 };
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'pc-etats-eau',
    competence: 'pc-etats-eau',
    level: '5eme',
    titre: 'Les trois états de l\'eau',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return r <= 40 ? nommer(rnd, 1) : r <= 75 ? exemple(rnd, 1) : sensQ(rnd, 1);
      if (palier === 2) return r <= 25 ? exemple(rnd, 2) : r <= 45 ? sensQ(rnd, 2) : r <= 70 ? temperature(rnd, 2) : courbe(rnd, 2);
      if (palier === 3) return r <= 20 ? nommer(rnd, 3) : r <= 50 ? courbe(rnd, 3) : r <= 70 ? temperature(rnd, 3) : r <= 85 ? masseMolecules(rnd, 3) : exemple(rnd, 3);
      return r <= 35 ? courbe(rnd, 4) : r <= 55 ? nommer(rnd, 4) : r <= 75 ? masseMolecules(rnd, 4) : r <= 90 ? exemple(rnd, 4) : temperature(rnd, 4);
    }
  });
})();
