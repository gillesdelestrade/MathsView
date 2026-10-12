/*
 * Exercices « Le volume et ses unités » (5ème, physique-chimie).
 *
 * Huit familles :
 *   - notion : ce que mesure le volume, l'instrument, l'unité légale, le
 *     litre et le dm³, le mL et le cm³ — en QCM et vrai/faux ;
 *   - convertir : d'une unité à l'autre ; la correction compte les colonnes
 *     (trois par unité de volume, une par unité de litre), dit si on multiplie
 *     ou si on divise, et pose le calcul ;
 *   - éprouvette : lire le volume d'un liquide sur une éprouvette graduée
 *     dessinée (SVG), parfois à donner dans une autre unité ;
 *   - déplacement : le niveau monte quand on plonge un caillou ; son volume ;
 *   - pavé : longueur × largeur × hauteur, en cm³ puis en mL ou en L ;
 *   - comparer : le plus grand de deux (puis trois) volumes ;
 *   - composer : 1 L 25 cL en millilitres ;
 *   - piège : 1 m³ = 1 000 L (pas 100), 1 cm³ = 1 mL (pas 1 cL), 1 m³ =
 *     1 000 000 cm³ — en vrai/faux.
 *
 * Les paliers :
 *   P1  la notion, les conversions entières (L, mL, cL, m³, dm³, cm³), la
 *       lecture d'une éprouvette graduée de 10 en 10 ;
 *   P2  les décimaux, comparer, le piège, l'éprouvette graduée de 5 en 5 ou
 *       de 2 en 2 ;
 *   P3  deux sauts (m³ → cm³), le déplacement d'eau, le pavé, composer ;
 *   P4  les très grands nombres, trois volumes à comparer, l'éprouvette à
 *       lire puis convertir, le pavé en litres.
 *
 * Tout volume est tenu en MILLIMÈTRES CUBES entiers : les conversions sont
 * exactes, et l'écriture dans une unité se fait avec autant de décimales que
 * de colonnes à droite de cette unité.
 */
(function () {
  'use strict';

  // La colonne du chiffre des unités de chaque unité (douze colonnes, trois par unité de volume).
  var COL = { 'm³': 2, kL: 2, hL: 3, daL: 4, 'dm³': 5, L: 5, dL: 6, cL: 7, 'cm³': 8, mL: 8, 'mm³': 11 };
  var NOM = { 'm³': 'mètres cubes', 'dm³': 'décimètres cubes', 'cm³': 'centimètres cubes', 'mm³': 'millimètres cubes', L: 'litres', dL: 'décilitres', cL: 'centilitres', mL: 'millilitres', hL: 'hectolitres', daL: 'décalitres' };
  function enMm3(u) { return Math.pow(10, 11 - COL[u]); }

  function fmt(v, dec) {
    var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
    while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
    return e + out + (parts[1] ? ',' + parts[1] : '');
  }
  function val(Q, u) { return Q / enMm3(u); }
  function txt(Q, u) { return fmt(val(Q, u), 11 - COL[u]) + ' ' + u; }
  function b(t) { return '<b>' + t + '</b>'; }
  function pluriel(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }
  function cube(u) { return /³/.test(u); }

  /* La correction d'une conversion de Q (en mm³) de u0 vers u1. */
  function etapesConversion(Q, u0, u1) {
    var n = COL[u1] - COL[u0], k = Math.pow(10, Math.abs(n)), out = [];
    if (n === 0) {
      out.push('Dans le tableau, ' + b(u0) + ' et ' + b(u1) + ' sont dans la <b>même colonne</b> : ' + (cube(u0) ? '1 ' + u0 + ' = 1 ' + u1 : '1 ' + u0 + ' = 1 ' + u1) + '. Le nombre ne change pas.');
      out.push('Donc ' + b(txt(Q, u0) + ' = ' + txt(Q, u1)) + '.');
      return out;
    }
    var colonnes = 'Dans le tableau, de ' + b(u0) + ' à ' + b(u1) + ', il y a ' + b(pluriel(Math.abs(n), 'colonne')) + ' vers la ' + (n < 0 ? 'gauche' : 'droite');
    if (cube(u0) && cube(u1)) colonnes += ' (trois colonnes par unité de volume : un volume, c\'est trois longueurs)';
    else if (!cube(u0) && !cube(u1)) colonnes += ' (une colonne par unité de litre)';
    else colonnes += ' (le litre est sous le dm³, le millilitre sous le cm³)';
    out.push(colonnes + ' : la virgule se déplace d\'autant de rangs' + (n < 0 ? ', et on complète par des zéros si besoin.' : '.'));
    if (n < 0) out.push('L\'unité ' + u1 + ' est ' + b('plus grande') + ' : il en faut moins, le nombre devient plus petit. On ' + b('divise') + ' par ' + fmt(k) + '.');
    else out.push('L\'unité ' + u1 + ' est ' + b('plus petite') + ' : il en faut davantage, le nombre grandit. On ' + b('multiplie') + ' par ' + fmt(k) + '.');
    out.push(fmt(val(Q, u0), 11 - COL[u0]) + (n < 0 ? ' ÷ ' : ' × ') + fmt(k) + ' = ' + b(fmt(val(Q, u1), 11 - COL[u1])) + '.');
    out.push('Donc ' + b(txt(Q, u0) + ' = ' + txt(Q, u1)) + '.');
    return out;
  }
  var INDICES_CONV = ['Dans le tableau : trois colonnes par unité de volume (m³, dm³, cm³), une par unité de litre ; le L sous le dm³, le mL sous le cm³.',
                      '1 L = 1 dm³ · 1 mL = 1 cm³ · 1 m³ = 1 000 L · 1 L = 1 000 mL.'];

  /* ------------------------------------------------------------------ */
  /* La notion                                                           */
  /* ------------------------------------------------------------------ */
  var NOTION_QCM = [
    { q: 'Que mesure le <b>volume</b> d\'un objet ?', rep: 'la place qu\'il occupe', autres: ['la quantité de matière qu\'il contient', 'sa masse', 'sa longueur'], why: 'Le volume, c\'est l\'<b>espace occupé</b>. La quantité de matière, c\'est la masse.' },
    { q: 'Avec quel instrument mesure-t-on le <b>volume d\'un liquide</b> ?', rep: 'une éprouvette graduée', autres: ['une balance', 'un thermomètre', 'un chronomètre'], why: 'On verse le liquide dans une <b>éprouvette graduée</b> et on lit le niveau, au bas du ménisque.' },
    { q: 'Quelle est l\'<b>unité légale</b> de volume (celle du système international) ?', rep: 'le mètre cube (m³)', autres: ['le litre (L)', 'le kilogramme (kg)', 'le centimètre (cm)'], why: 'L\'unité légale est le <b>mètre cube</b>. Le litre est très utilisé pour les liquides : 1 L = 1 dm³.' },
    { q: 'À quel volume correspond <b>1 litre</b> ?', rep: '1 dm³ (un cube de 10 cm de côté)', autres: ['1 cm³ (un cube de 1 cm de côté)', '1 m³ (un cube de 1 m de côté)', '100 cm³'], why: '1 L = 1 dm³ : un cube de 1 dm = 10 cm de côté, soit 1 000 cm³.' },
    { q: 'À quel volume correspond <b>1 millilitre</b> ?', rep: '1 cm³', autres: ['1 dm³', '1 mm³', '10 cm³'], why: '1 mL = 1 cm³ : un petit cube de 1 cm de côté. Il y en a 1 000 dans un litre.' },
    { q: 'On verse 20 cL d\'eau d\'un verre dans une assiette. Quel est le volume de l\'eau dans l\'assiette ?', rep: '20 cL', autres: ['moins de 20 cL', 'plus de 20 cL', 'cela dépend de la forme de l\'assiette'], why: 'Un liquide prend la forme de son récipient mais garde son <b>volume</b> : toujours 20 cL.' },
    { q: 'Sur une éprouvette graduée, où lit-on le niveau du liquide ?', rep: 'au bas du ménisque, à hauteur des yeux', autres: ['en haut du ménisque', 'n\'importe où sur la courbe', 'au-dessus de l\'éprouvette'], why: 'La surface du liquide forme un creux, le <b>ménisque</b> : on lit la graduation au bas du creux, l\'œil à sa hauteur.', dur: true },
    { q: 'Comment calcule-t-on le volume d\'une boîte en forme de pavé ?', rep: 'longueur × largeur × hauteur', autres: ['longueur + largeur + hauteur', 'longueur × largeur', '2 × (longueur + largeur)'], why: 'Un volume, c\'est trois longueurs multipliées : <b>L × l × h</b>.', dur: true }
  ];
  var NOTION_VF = [
    { q: 'Le volume d\'un objet, c\'est la place qu\'il occupe.', vrai: true, why: 'C\'est la définition : l\'espace occupé.' },
    { q: '1 L = 1 dm³.', vrai: true, why: 'Un litre, c\'est le volume d\'un cube de 1 dm de côté.' },
    { q: '1 mL = 1 cm³.', vrai: true, why: 'Un millilitre, c\'est un petit cube de 1 cm de côté.' },
    { q: 'Un litre d\'eau et un litre d\'huile ont le même volume.', vrai: true, why: 'Un litre, c\'est un litre : même volume. Leurs masses, elles, sont différentes.' },
    { q: 'Deux objets de même masse ont forcément le même volume.', vrai: false, why: '1 kg de plumes prend beaucoup plus de place que 1 kg de plomb : même masse, volumes différents.' },
    { q: 'Le volume d\'un liquide se mesure avec une balance.', vrai: false, why: 'La balance mesure la masse. Le volume d\'un liquide se lit sur une <b>éprouvette graduée</b>.' },
    { q: 'Quand on verse un liquide dans un autre récipient, son volume change.', vrai: false, why: 'Le liquide change de <b>forme</b>, pas de volume.' },
    { q: 'Le volume se mesure en mètres cubes.', vrai: true, why: 'Le m³ est l\'unité légale ; le litre (1 dm³) sert pour les liquides.' },
    { q: 'Quand l\'eau gèle, son volume ne change pas.', vrai: false, why: 'La glace prend <b>plus de place</b> que l\'eau liquide : la bouteille pleine éclate au congélateur. La masse, elle, ne change pas.', dur: true }
  ];
  function notion(rnd, palier) {
    if (rnd.booleen(0.5)) {
      var pool = NOTION_QCM.filter(function (x) { return palier >= 3 || !x.dur; });
      var n = rnd.choix(pool), choix = rnd.melange([n.rep].concat(n.autres));
      return { famille: 'notion-qcm', enonce: '<p>' + n.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(n.rep),
               etapes: [n.why, 'Réponse : <b>' + n.rep + '</b>.'], indices: ['Le volume, c\'est la place occupée ; 1 L = 1 dm³, 1 mL = 1 cm³.'], duree: 30 };
    }
    var v = rnd.choix(NOTION_VF.filter(function (x) { return palier >= 3 || !x.dur; }));
    return { famille: 'notion-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
             etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'], indices: ['Volume : la place occupée. Masse : la quantité de matière.'], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Convertir                                                           */
  /* ------------------------------------------------------------------ */
  function tirerConversion(rnd, palier) {
    var c;
    if (palier === 1) c = rnd.choix([['L', 'mL', [1, 2, 3, 5, 8]], ['mL', 'L', [1000, 2000, 5000, 3000]], ['L', 'cL', [1, 2, 4, 7]], ['cL', 'L', [100, 300, 500]], ['m³', 'L', [1, 2, 3, 5]],
                                     ['m³', 'dm³', [2, 4, 7]], ['dm³', 'L', [3, 5, 12, 250]], ['cm³', 'mL', [3, 50, 125, 1000]], ['L', 'dm³', [2, 8, 15]], ['L', 'dL', [2, 3, 6]], ['dm³', 'cm³', [1, 2, 5]]]);
    else if (palier === 2) c = rnd.choix([['L', 'mL', [1.5, 0.5, 2.5, 0.75, 0.25]], ['cL', 'L', [25, 33, 75, 150, 20]], ['L', 'cL', [0.5, 1.5, 0.25, 2.5]], ['dL', 'mL', [2, 5, 1.5, 0.5]], ['mL', 'L', [250, 500, 750, 1500, 50]],
                                          ['cm³', 'L', [3500, 500, 250, 1500]], ['m³', 'L', [0.25, 0.5, 2.5, 0.8]], ['L', 'cm³', [2, 1.5, 0.5, 0.25]], ['mL', 'cL', [250, 50, 5, 125]], ['cL', 'mL', [33, 25, 1.5, 50]],
                                          ['dm³', 'cm³', [1.5, 0.5, 2.5]], ['L', 'm³', [500, 250, 1500, 750]], ['dL', 'L', [5, 25, 2.5]], ['hL', 'L', [2, 5, 1.5]]]);
    else if (palier === 3) c = rnd.choix([['m³', 'cm³', [0.5, 1.2, 0.25, 2]], ['cm³', 'm³', [250000, 500000, 1200000, 3000000]], ['mm³', 'mL', [500, 250, 1500, 50]], ['mL', 'mm³', [2.5, 0.5, 12, 3]], ['m³', 'cL', [1.2, 0.5, 0.25]],
                                          ['cL', 'm³', [50000, 120000, 25000]], ['cm³', 'dL', [250, 2500, 50]], ['L', 'mm³', [0.5, 0.002, 1.2]], ['m³', 'mL', [0.001, 0.0025, 0.5]], ['daL', 'cL', [2, 0.5, 1.5]]]);
    else c = rnd.choix([['m³', 'mL', [1, 2.5, 0.004]], ['mL', 'm³', [3500000, 250000, 1000]], ['m³', 'cL', [0.002, 1.5, 0.0125]], ['cm³', 'm³', [12500, 500, 2]], ['mm³', 'L', [500, 2500000, 1200]],
                        ['L', 'mm³', [0.0005, 2.5, 0.012]], ['hL', 'cm³', [0.5, 2, 1.25]], ['mm³', 'cL', [2500, 500, 120000]], ['kL', 'mL', [0.002, 1.5]], ['cm³', 'hL', [2500, 50000, 125]]]);
    var u0 = c[0], u1 = c[1], v = rnd.choix(c[2]);
    return { Q: Math.round(v * enMm3(u0)), u0: u0, u1: u1 };
  }
  function convertir(rnd, palier) {
    var t = tirerConversion(rnd, palier), Q = t.Q, u0 = t.u0, u1 = t.u1;
    return { famille: 'convertir', enonce: '<p>Convertis : ' + b(txt(Q, u0)) + ' = … ' + b(u1) + '</p><p>Donne le nombre de ' + NOM[u1] + '.</p>',
             type: 'nombre', reponse: val(Q, u1), unite: u1, etapes: etapesConversion(Q, u0, u1), indices: INDICES_CONV, duree: palier >= 3 ? 60 : 45 };
  }

  /* ------------------------------------------------------------------ */
  /* L'éprouvette graduée (SVG)                                          */
  /* ------------------------------------------------------------------ */
  var W = 150, H = 230, X0 = 55, X1 = 105, YH = 20, YB = 205;   // le tube, et la hauteur du zéro et du maximum
  function yDe(v, max) { return +(YB - v / max * (YB - YH + 10)).toFixed(1); }
  function eprouvetteSVG(max, pas, etiq, niveau) {
    var s = ['<svg class="exo-figure" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'];
    // le liquide, puis le tube par-dessus
    var yN = yDe(niveau, max);
    s.push('<rect class="liquide" x="' + (X0 + 1) + '" y="' + yN + '" width="' + (X1 - X0 - 2) + '" height="' + (YB + 8 - yN) + '" fill="#bae6fd"/>');
    s.push('<path d="M ' + (X0 + 1) + ' ' + yN + ' Q ' + (X0 + X1) / 2 + ' ' + (yN + 5) + ' ' + (X1 - 1) + ' ' + yN + '" fill="none" stroke="#0369a1" stroke-width="1.5"/>');
    s.push('<path d="M ' + X0 + ' ' + (YH - 12) + ' V ' + (YB + 8) + ' Q ' + X0 + ' ' + (YB + 14) + ' ' + (X0 + 6) + ' ' + (YB + 14) + ' H ' + (X1 - 6) + ' Q ' + X1 + ' ' + (YB + 14) + ' ' + X1 + ' ' + (YB + 8) + ' V ' + (YH - 12) + '" fill="none" stroke="#334155" stroke-width="2"/>');
    s.push('<path d="M ' + (X0 - 25) + ' ' + (YB + 22) + ' H ' + (X1 + 25) + '" stroke="#334155" stroke-width="3"/>');
    for (var v = 0; v <= max + 1e-9; v += pas) {
      var y = yDe(v, max), grosse = Math.abs(v / etiq - Math.round(v / etiq)) < 1e-9;
      s.push('<line class="grad" data-v="' + fmt(v) + '" x1="' + X0 + '" y1="' + y + '" x2="' + (X0 + (grosse ? 14 : 8)) + '" y2="' + y + '" stroke="#334155" stroke-width="' + (grosse ? 1.5 : 1) + '"/>');
      if (grosse) s.push('<text class="etiq" x="' + (X0 - 4) + '" y="' + (y + 3.5) + '" font-size="9" text-anchor="end" fill="#334155">' + fmt(v) + '</text>');
    }
    s.push('<text x="' + (X1 + 6) + '" y="' + (YH + 2) + '" font-size="9" fill="#334155">mL</text>');
    s.push('</svg>');
    return s.join('');
  }
  var GRADUATIONS = [
    { max: 100, pas: 10, etiq: 20, p: 1 }, { max: 50, pas: 5, etiq: 10, p: 1 },
    { max: 100, pas: 5, etiq: 20, p: 2 }, { max: 50, pas: 2, etiq: 10, p: 2 }, { max: 250, pas: 10, etiq: 50, p: 2 },
    { max: 25, pas: 1, etiq: 5, p: 3 }, { max: 200, pas: 5, etiq: 50, p: 3 }, { max: 10, pas: 0.5, etiq: 2, p: 3 }
  ];
  function eprouvette(rnd, palier) {
    var pool = GRADUATIONS.filter(function (g) { return g.p <= palier; });
    var g = rnd.choix(pool), n = Math.round(g.max / g.pas);
    var k = rnd.entier(2, n - 1), niveau = Math.round(k * g.pas * 10) / 10;
    var intro = eprouvetteSVG(g.max, g.pas, g.etiq, niveau) + '<p>On a versé de l\'eau dans cette éprouvette graduée en millilitres.</p>';
    var lecture = ['Deux grandes graduations se suivent : de ' + fmt(Math.floor(niveau / g.etiq) * g.etiq) + ' à ' + fmt(Math.floor(niveau / g.etiq) * g.etiq + g.etiq) + ' mL, il y a ' + Math.round(g.etiq / g.pas) + ' intervalles : chaque petite graduation vaut ' + b(fmt(g.pas) + ' mL') + '.',
                   'Le bas du ménisque est ' + (niveau % g.etiq === 0 ? 'sur la grande graduation ' : Math.round((niveau % g.etiq) / g.pas) + ' graduation' + (Math.round((niveau % g.etiq) / g.pas) > 1 ? 's' : '') + ' au-dessus de ' + fmt(Math.floor(niveau / g.etiq) * g.etiq) + ' : ') + b(fmt(niveau) + ' mL') + '.'];
    if (palier >= 4 && rnd.booleen(0.6)) {
      var u1 = rnd.choix(['cL', 'L', 'cm³', 'dL']), Q = Math.round(niveau * enMm3('mL'));
      return { famille: 'eprouvette-convertir', enonce: intro + '<p>Quel est le volume d\'eau, en ' + b(NOM[u1]) + ' ?</p>', type: 'nombre', reponse: val(Q, u1), unite: u1,
               etapes: lecture.concat(etapesConversion(Q, 'mL', u1)), indices: ['Lis d\'abord en mL, puis convertis.', 'Le bas du ménisque, à hauteur des yeux.'], duree: 70 };
    }
    return { famille: 'eprouvette', enonce: intro + '<p>Quel est le volume d\'eau, en millilitres ?</p>', type: 'nombre', reponse: niveau, unite: 'mL',
             etapes: lecture, indices: ['Compte les petites graduations entre deux nombres pour savoir ce que vaut chacune.', 'On lit au bas du ménisque.'], duree: 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Le déplacement d'eau, le pavé                                       */
  /* ------------------------------------------------------------------ */
  var OBJETS = ['un caillou', 'une bille', 'un boulon', 'une clé', 'un dé', 'une gomme'];
  function deplacement(rnd, palier) {
    var o = rnd.choix(OBJETS), v1 = rnd.entier(3, 12) * 5, dv = palier >= 4 ? rnd.entier(3, 40) : rnd.entier(1, 8) * 5, v2 = v1 + dv;
    var u1 = palier >= 4 && rnd.booleen(0.5) ? 'mL' : 'cm³', Q = dv * enMm3('mL');
    return { famille: 'deplacement', enonce: '<p>Une éprouvette contient ' + b(v1 + ' mL') + ' d\'eau. On y plonge ' + o + ' : le niveau monte à ' + b(v2 + ' mL') + '. Quel est le volume de l\'objet, en ' + b(u1) + ' ?</p>',
             type: 'nombre', reponse: val(Q, u1), unite: u1,
             etapes: ['L\'objet prend la place de l\'eau qu\'il repousse : son volume est la <b>montée du niveau</b>.', v2 + ' − ' + v1 + ' = ' + b(dv + ' mL') + '.',
                      '1 mL = 1 cm³, donc le volume de l\'objet est ' + b(txt(Q, u1)) + '.'],
             indices: ['volume de l\'objet = niveau après − niveau avant.', '1 mL = 1 cm³.'], duree: 50 };
  }
  var BOITES = ['Une boîte', 'Un aquarium', 'Un carton', 'Une brique de lait', 'Un bac'];
  function pave(rnd, palier) {
    var L = rnd.entier(2, 6) * 5, l = rnd.entier(1, 4) * 5, h = rnd.choix([2, 4, 5, 8, 10, 12]);
    if (l > L) { var t = L; L = l; l = t; }
    var cm3 = L * l * h, Q = cm3 * enMm3('cm³');
    var u1 = palier >= 4 ? rnd.choix(['L', 'mL', 'dm³', 'cL']) : 'cm³';
    var etapes = ['Un pavé : volume = longueur × largeur × hauteur.', L + ' × ' + l + ' × ' + h + ' = ' + fmt(L * l) + ' × ' + h + ' = ' + b(fmt(cm3) + ' cm³') + '.'];
    if (u1 !== 'cm³') etapes = etapes.concat(etapesConversion(Q, 'cm³', u1));
    return { famille: 'pave', enonce: '<p>' + rnd.choix(BOITES) + ' a la forme d\'un pavé droit de ' + b(L + ' cm') + ' de longueur, ' + b(l + ' cm') + ' de largeur et ' + b(h + ' cm') + ' de hauteur. Quel est son volume, en ' + b(u1) + ' ?</p>',
             type: 'nombre', reponse: val(Q, u1), unite: u1, etapes: etapes,
             indices: ['Multiplie les trois longueurs : des cm × des cm × des cm, ça fait des cm³.', u1 === 'cm³' ? '' : '1 cm³ = 1 mL, 1 000 cm³ = 1 L.'].filter(Boolean), duree: palier >= 4 ? 75 : 55 };
  }

  /* ------------------------------------------------------------------ */
  /* Comparer, composer                                                  */
  /* ------------------------------------------------------------------ */
  var VOISINES = { 'm³': ['L', 'hL', 'dm³'], L: ['cL', 'mL', 'dL', 'dm³', 'cm³', 'm³'], dL: ['L', 'cL', 'mL'], cL: ['L', 'mL', 'dL', 'cm³'], mL: ['L', 'cL', 'dL', 'cm³'],
                  'dm³': ['L', 'cm³', 'mL', 'm³'], 'cm³': ['mL', 'cL', 'L', 'dm³'], hL: ['L', 'm³'] };
  function comparer(rnd, palier) {
    var n = palier >= 4 ? 3 : 2;
    var u0 = rnd.choix(palier >= 3 ? ['m³', 'L', 'dL', 'cL', 'mL', 'dm³', 'cm³', 'hL'] : ['L', 'cL', 'mL', 'm³', 'dm³', 'cm³']);
    var v0 = rnd.choix([1.2, 1.5, 2.5, 0.8, 3, 0.75, 12, 25, 0.5, 4.5, 33]);
    var liste = [{ Q: Math.round(v0 * enMm3(u0)), u: u0 }], essais = 0;
    while (liste.length < n && essais < 300) {
      essais++;
      var u = rnd.choix(VOISINES[u0]);
      if (liste.some(function (x) { return x.u === u || COL[x.u] === COL[u]; })) continue;
      var pas = Math.max(1, enMm3(u) / 100), Q = Math.round(liste[0].Q * rnd.choix([0.5, 0.8, 0.9, 1.1, 1.2, 1.5, 2]) / pas) * pas;
      if (Q <= 0 || Q / enMm3(u) < 0.1 || liste.some(function (x) { return x.Q === Q; })) continue;
      liste.push({ Q: Q, u: u });
    }
    if (liste.length < n) { liste = [{ Q: 1500000, u: 'L' }, { Q: 1200000, u: 'cm³' }]; if (n === 3) liste.push({ Q: 900000, u: 'cL' }); }
    var grand = liste.reduce(function (a, x) { return x.Q > a.Q ? x : a; }, liste[0]);
    var choix = rnd.melange(liste.map(function (x) { return txt(x.Q, x.u); }));
    var ref = liste.reduce(function (a, x) { return COL[x.u] > COL[a.u] ? x : a; }, liste[0]).u;
    return { famille: 'comparer', enonce: '<p>Quel est le volume ' + b('le plus grand') + ' ?</p>', type: 'qcm', choix: choix, correct: choix.indexOf(txt(grand.Q, grand.u)),
             etapes: ['Pour comparer, on met tout dans la <b>même unité</b>, par exemple en ' + ref + ' : ' + liste.map(function (x) { return txt(x.Q, x.u) + ' = ' + txt(x.Q, ref); }).join(' ; ') + '.',
                      'Le plus grand est ' + b(txt(grand.Q, grand.u)) + '.'],
             indices: ['On ne compare pas des nombres dans des unités différentes : convertis d\'abord.'], duree: 45 };
  }
  function composer(rnd, palier) {
    var paire = rnd.choix([['L', 'cL'], ['L', 'mL'], ['L', 'cL'], ['m³', 'L']]), G = paire[0], P = paire[1];
    var e = rnd.entier(1, 9), f = G === 'L' && P === 'cL' ? rnd.choix([25, 5, 50, 75, 33, 2]) : rnd.choix([250, 500, 50, 5, 750, 125]);
    var Q = e * enMm3(G) + f * enMm3(P), cible = rnd.booleen(0.6) ? P : G;
    return { famille: 'composer', enonce: '<p>' + b(e + ' ' + G + ' ' + f + ' ' + P) + ' = … ' + b(cible) + '</p><p>Donne le nombre de ' + NOM[cible] + '.</p>',
             type: 'nombre', reponse: val(Q, cible), unite: cible,
             etapes: cible === P
               ? [e + ' ' + G + ' = ' + e + ' × ' + fmt(enMm3(G) / enMm3(P)) + ' ' + P + ' = ' + fmt(e * enMm3(G) / enMm3(P)) + ' ' + P + '.',
                  'Avec les ' + f + ' ' + P + ' : ' + fmt(e * enMm3(G) / enMm3(P)) + ' + ' + f + ' = ' + b(fmt(val(Q, P))) + '. Donc ' + b(e + ' ' + G + ' ' + f + ' ' + P + ' = ' + txt(Q, P)) + '.']
               : [f + ' ' + P + ' = ' + f + ' ÷ ' + fmt(enMm3(G) / enMm3(P)) + ' ' + G + ' = ' + fmt(f * enMm3(P) / enMm3(G), 11 - COL[G]) + ' ' + G + '.',
                  'Avec les ' + e + ' ' + G + ' : ' + e + ' + ' + fmt(f * enMm3(P) / enMm3(G), 11 - COL[G]) + ' = ' + b(fmt(val(Q, G), 11 - COL[G])) + '. Donc ' + b(e + ' ' + G + ' ' + f + ' ' + P + ' = ' + txt(Q, G)) + '.',
                  'Attention aux zéros : 5 cL = 0,05 L, et 5 mL = 0,005 L.'],
             indices: ['Convertis la partie en ' + (cible === P ? G : P) + ', puis ajoute.'], duree: 50 };
  }

  /* ------------------------------------------------------------------ */
  /* Les pièges                                                          */
  /* ------------------------------------------------------------------ */
  var PIEGES = [
    { q: '1 m³ = 100 L', vrai: false, why: '1 m³ = 1 000 dm³, et 1 dm³ = 1 L : 1 m³ = <b>1 000 L</b>. Trois colonnes, trois zéros.' },
    { q: '1 m³ = 1 000 L', vrai: true, why: '1 m³ = 1 000 dm³ = 1 000 L : un volume, c\'est trois longueurs, donc × 1 000 d\'une unité à l\'autre.' },
    { q: '1 cm³ = 1 cL', vrai: false, why: '1 cm³ = <b>1 mL</b>. Le centilitre vaut 10 mL = 10 cm³ (une barre du cube).' },
    { q: '1 cm³ = 1 mL', vrai: true, why: 'Le petit cube de 1 cm de côté, c\'est un millilitre : 1 000 dans le litre.' },
    { q: '1 L = 100 cL', vrai: true, why: 'Deux colonnes de litre entre L et cL : × 100.' },
    { q: '1 L = 1 000 cL', vrai: false, why: '1 L = 100 cL (deux colonnes). C\'est 1 000 <b>mL</b>.' },
    { q: '1 m = 100 cm, donc 1 m³ = 100 cm³', vrai: false, why: 'Un volume, c\'est trois longueurs : 1 m³ = 100 × 100 × 100 cm³ = <b>1 000 000 cm³</b>.' },
    { q: '1 m³ = 1 000 000 cm³', vrai: true, why: '100 cm × 100 cm × 100 cm = 1 000 000 cm³ : six colonnes dans le tableau.' },
    { q: '1 dm³ = 100 cm³', vrai: false, why: '10 cm × 10 cm × 10 cm = <b>1 000 cm³</b>.' },
    { q: '1 dm³ = 1 L', vrai: true, why: 'Le litre est défini comme le décimètre cube.' },
    { q: '1 L = 1 m³', vrai: false, why: 'Un litre, c\'est 1 dm³ : il en faut 1 000 pour faire un mètre cube.' },
    { q: '0,5 m³ = 50 L', vrai: false, why: '0,5 m³ = 0,5 × 1 000 L = <b>500 L</b>.' },
    { q: '0,5 m³ = 500 L', vrai: true, why: '1 m³ = 1 000 L, donc 0,5 m³ = 500 L.' },
    { q: '1 mL = 1 mm³', vrai: false, why: '1 mL = 1 <b>cm³</b>. Le mm³ est mille fois plus petit.' }
  ];
  function piege(rnd, palier) {
    if (rnd.booleen(0.45)) {
      var p = rnd.choix(PIEGES);
      return { famille: 'piege', enonce: '<p>Vrai ou faux : ' + b(p.q) + '</p>', type: 'vraifaux', correct: p.vrai ? 0 : 1,
               etapes: [p.why, 'Donc c\'est <b>' + (p.vrai ? 'vrai' : 'faux') + '</b>.'], indices: ['Trois colonnes par unité de volume ; une par unité de litre ; le L sous le dm³, le mL sous le cm³.'], duree: 35 };
    }
    // le piège de la virgule : 2,5 L = 2 L 50 cL, pas 2 L 5 cL
    var paire = rnd.choix([['L', 'cL', 100], ['L', 'mL', 1000], ['m³', 'L', 1000]]), G = paire[0], P = paire[1], k = paire[2];
    // f choisi pour que ses chiffres lus tels quels (« 1,5 » → 5) ne soient pas la bonne valeur
    var e = rnd.entier(1, 5), f = k === 100 ? rnd.choix([50, 20, 70, 80, 90]) : rnd.choix([500, 250, 750, 50, 200, 20]);
    var dec = (e + f / k).toFixed(3).replace(/0+$/, '').replace('.', ','), chiffres = dec.split(',')[1], leurre = parseInt(chiffres, 10);
    var vrai = rnd.booleen(0.5), ecrit = e + ' ' + G + ' ' + (vrai ? f : leurre) + ' ' + P;
    return { famille: 'piege-virgule', enonce: '<p>Vrai ou faux : ' + b(dec + ' ' + G + ' = ' + ecrit) + '</p>', type: 'vraifaux', correct: vrai ? 0 : 1,
             etapes: [dec + ' ' + G + ' = ' + e + ' ' + G + ' + 0,' + chiffres + ' ' + G + '. Et 0,' + chiffres + ' ' + G + ' = 0,' + chiffres + ' × ' + fmt(k) + ' ' + P + ' = ' + b(f + ' ' + P) + '.',
                      'Donc ' + dec + ' ' + G + ' = ' + b(e + ' ' + G + ' ' + f + ' ' + P) + (vrai ? ' : c\'est <b>vrai</b>.' : ', et pas ' + e + ' ' + G + ' ' + leurre + ' ' + P + ' : c\'est <b>faux</b>.')],
             indices: ['1 ' + G + ' = ' + fmt(k) + ' ' + P + ' : écris la partie décimale avec ' + String(k).length - 1 + ' chiffres.'], duree: 40 };
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'pc-volume',
    competence: 'pc-volume',
    level: '5eme',
    titre: 'Le volume et ses unités',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return r <= 35 ? notion(rnd, 1) : r <= 80 ? convertir(rnd, 1) : eprouvette(rnd, 1);
      if (palier === 2) return r <= 10 ? notion(rnd, 2) : r <= 45 ? convertir(rnd, 2) : r <= 60 ? eprouvette(rnd, 2) : r <= 75 ? comparer(rnd, 2) : piege(rnd, 2);
      if (palier === 3) return r <= 8 ? notion(rnd, 3) : r <= 30 ? convertir(rnd, 3) : r <= 45 ? deplacement(rnd, 3) : r <= 62 ? pave(rnd, 3) : r <= 75 ? composer(rnd, 3) : r <= 88 ? piege(rnd, 3) : eprouvette(rnd, 3);
      return r <= 10 ? notion(rnd, 4) : r <= 35 ? convertir(rnd, 4) : r <= 50 ? eprouvette(rnd, 4) : r <= 62 ? pave(rnd, 4) : r <= 74 ? comparer(rnd, 4) : r <= 84 ? deplacement(rnd, 4) : r <= 92 ? piege(rnd, 4) : composer(rnd, 4);
    }
  });
})();
