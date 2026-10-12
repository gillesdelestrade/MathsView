/*
 * Exercices « La masse et ses unités » (5ème, physique-chimie).
 *
 * Six familles :
 *   - notion : ce que mesure la masse, l'instrument, l'unité légale, et ce qui
 *     ne la change pas (le lieu, la forme, l'état) — en QCM et vrai/faux ;
 *   - convertir : d'une unité à l'autre, dans le tableau ; la correction compte
 *     les colonnes, dit si on multiplie ou si on divise, et pose le calcul ;
 *   - comparer : la plus grande de deux (puis trois) masses d'unités différentes ;
 *   - composer : 2 kg 350 g en grammes ou en kilogrammes, et l'inverse ;
 *   - tare : le pot vide, le pot plein, la masse du contenu ;
 *   - piège : 1,5 kg, c'est 1 kg 500 g et pas 1 kg 50 g — en vrai/faux.
 *
 * Les paliers :
 *   P1  la notion, et les conversions entières entre t, kg, g, mg ;
 *   P2  les décimaux, les unités intermédiaires (hg, dag, dg, cg), comparer,
 *       le piège de la virgule ;
 *   P3  deux sauts de mille (t → g, mg → kg), les masses composées, la tare ;
 *   P4  les très petits et les très grands nombres, trois masses à comparer,
 *       la tare avec des unités mélangées, les notions difficiles.
 *
 * Toute masse est tenue en MILLIGRAMMES entiers : les conversions sont alors
 * exactes, et l'écriture dans une unité se fait avec autant de décimales que
 * de colonnes à droite de cette unité.
 */
(function () {
  'use strict';

  // Les rangs des colonnes du tableau (deux colonnes sans nom entre t et kg).
  var RANG = { t: 0, kg: 3, hg: 4, dag: 5, g: 6, dg: 7, cg: 8, mg: 9 };
  var NOM = { t: 'tonnes', kg: 'kilogrammes', hg: 'hectogrammes', dag: 'décagrammes', g: 'grammes', dg: 'décigrammes', cg: 'centigrammes', mg: 'milligrammes' };
  function enMg(u) { return Math.pow(10, 9 - RANG[u]); }

  function fmt(v, dec) {
    var s = dec === undefined ? String(v) : v.toFixed(dec).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    var parts = s.replace('.', ',').split(','), e = parts[0], out = '';
    while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
    return e + out + (parts[1] ? ',' + parts[1] : '');
  }
  function val(M, u) { return M / enMg(u); }
  function txt(M, u) { return fmt(val(M, u), 9 - RANG[u]) + ' ' + u; }
  function b(t) { return '<b>' + t + '</b>'; }
  function pluriel(n, mot) { return n + ' ' + mot + (n > 1 ? 's' : ''); }

  /* La correction d'une conversion de M (en mg) de u0 vers u1. */
  function etapesConversion(M, u0, u1) {
    var n = RANG[u1] - RANG[u0], k = Math.pow(10, Math.abs(n));
    var out = ['Dans le tableau, de ' + b(u0) + ' à ' + b(u1) + ', il y a ' + b(pluriel(Math.abs(n), 'colonne')) + ' vers la ' + (n < 0 ? 'gauche' : 'droite') + ' : la virgule se déplace d\'autant de rangs' + (n < 0 ? ', et on complète par des zéros si besoin.' : '.')];
    if (n < 0) out.push('L\'unité ' + u1 + ' est ' + b('plus grande') + ' : il en faut moins, le nombre devient plus petit. On ' + b('divise') + ' par ' + fmt(k) + '.');
    else out.push('L\'unité ' + u1 + ' est ' + b('plus petite') + ' : il en faut davantage, le nombre grandit. On ' + b('multiplie') + ' par ' + fmt(k) + '.');
    out.push(fmt(val(M, u0), 9 - RANG[u0]) + (n < 0 ? ' ÷ ' : ' × ') + fmt(k) + ' = ' + b(fmt(val(M, u1), 9 - RANG[u1])) + '.');
    out.push('Donc ' + b(txt(M, u0) + ' = ' + txt(M, u1)) + '.');
    return out;
  }
  var INDICES_CONV = ['Écris le nombre dans le tableau, le chiffre des unités dans la colonne de l\'unité de départ, puis déplace la virgule.',
                      '1 t = 1 000 kg · 1 kg = 1 000 g · 1 g = 1 000 mg. Chaque colonne vaut dix fois la suivante.'];

  /* ------------------------------------------------------------------ */
  /* La notion                                                           */
  /* ------------------------------------------------------------------ */
  var NOTION_QCM = [
    { q: 'Que mesure la <b>masse</b> d\'un objet ?', rep: 'la quantité de matière qu\'il contient', autres: ['la place qu\'il occupe', 'sa hauteur', 'sa température'], why: 'La masse mesure la <b>quantité de matière</b>. La place occupée, c\'est le <b>volume</b>.' },
    { q: 'Avec quel instrument mesure-t-on une <b>masse</b> ?', rep: 'une balance', autres: ['une éprouvette graduée', 'un thermomètre', 'une règle graduée'], why: 'On pèse avec une <b>balance</b> (à plateaux ou électronique). L\'éprouvette mesure un volume, le thermomètre une température.' },
    { q: 'Quelle est l\'<b>unité légale</b> de masse (celle du système international) ?', rep: 'le kilogramme (kg)', autres: ['le gramme (g)', 'le litre (L)', 'la tonne (t)'], why: 'L\'unité légale est le <b>kilogramme</b>. Le gramme et la tonne en sont des multiples ; le litre est une unité de volume.' },
    { q: 'Un astronaute a une masse de 70 kg sur la Terre. Quelle est sa masse sur la <b>Lune</b> ?', rep: '70 kg', autres: ['environ 12 kg', '0 kg', '420 kg'], why: 'La masse, c\'est la quantité de matière : elle ne change pas avec le lieu. Sur la Lune, c\'est son <b>poids</b> qui est six fois plus faible, pas sa masse.', dur: true },
    { q: 'On aplatit une boule de pâte à modeler de 50 g en une galette. Quelle est la masse de la galette ?', rep: '50 g', autres: ['moins de 50 g', 'plus de 50 g', 'cela dépend de l\'épaisseur'], why: 'Changer la forme ne change pas la quantité de matière : la masse reste <b>50 g</b>.' },
    { q: 'Qu\'est-ce qui a la plus grande masse : 1 kg de plumes ou 1 kg de plomb ?', rep: 'ils ont la même masse', autres: ['le plomb', 'les plumes', 'on ne peut pas savoir'], why: '1 kg, c\'est 1 kg : la même masse. Les plumes prennent beaucoup plus de <b>place</b> (un plus grand volume), mais pas plus de masse.' },
    { q: 'Un glaçon de 40 g fond entièrement. Quelle est la masse de l\'eau obtenue ?', rep: '40 g', autres: ['moins de 40 g', 'plus de 40 g', '0 g'], why: 'Lors d\'un changement d\'état, la masse se <b>conserve</b> : ce sont les mêmes molécules.' }
  ];
  var NOTION_VF = [
    { q: 'Sur la Lune, la masse d\'un objet est plus petite que sur la Terre.', vrai: false, why: 'La masse ne dépend pas du lieu. C\'est le <b>poids</b> (l\'attraction de la planète) qui est plus faible sur la Lune.', dur: true },
    { q: '100 g de glace donnent 100 g d\'eau en fondant.', vrai: true, why: 'La masse se conserve lors d\'un changement d\'état.' },
    { q: 'Une balance sert à mesurer le volume d\'un objet.', vrai: false, why: 'Une balance mesure la <b>masse</b>. Le volume se mesure à l\'éprouvette graduée ou se calcule.' },
    { q: 'Deux objets de la même taille ont forcément la même masse.', vrai: false, why: 'Même volume ne veut pas dire même masse : une boule de fer et une boule de liège de même taille n\'ont pas la même masse.' },
    { q: 'L\'unité légale de masse est le kilogramme.', vrai: true, why: 'Le kilogramme (kg) est l\'unité du système international.' },
    { q: 'Si on coupe un objet en deux, la somme des masses des deux morceaux est égale à la masse de l\'objet entier.', vrai: true, why: 'Couper ne crée ni ne détruit de matière : les masses s\'ajoutent.' },
    { q: 'Quand on dissout 10 g de sel dans 100 g d\'eau, la solution pèse 110 g.', vrai: true, why: 'Le sel est toujours là, même dissous : les masses s\'ajoutent.', dur: true },
    { q: '1 t = 100 kg.', vrai: false, why: 'Une tonne, c\'est <b>1 000 kg</b>.' },
    { q: '1 kg = 1 000 g.', vrai: true, why: 'Trois colonnes du tableau entre kg et g : × 1 000.' },
    { q: '1 g = 100 mg.', vrai: false, why: 'Un gramme, c\'est <b>1 000 mg</b> (trois colonnes : dg, cg, mg).' }
  ];
  function notion(rnd, palier) {
    if (rnd.booleen(0.5)) {
      var pool = NOTION_QCM.filter(function (x) { return palier >= 3 || !x.dur; });
      var n = rnd.choix(pool), choix = rnd.melange([n.rep].concat(n.autres));
      return { famille: 'notion-qcm', enonce: '<p>' + n.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(n.rep),
               etapes: [n.why, 'Réponse : <b>' + n.rep + '</b>.'], indices: ['La masse, c\'est la quantité de matière ; on la pèse avec une balance, en kilogrammes.'], duree: 30 };
    }
    var poolV = NOTION_VF.filter(function (x) { return palier >= 3 || !x.dur; });
    var v = rnd.choix(poolV);
    return { famille: 'notion-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
             etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'], indices: ['La masse ne change ni avec le lieu, ni avec la forme, ni avec l\'état.'], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Convertir                                                           */
  /* ------------------------------------------------------------------ */
  // Une masse en mg et ses deux unités, tirées selon le palier.
  function tirerConversion(rnd, palier) {
    var u0, u1, v;
    if (palier === 1) {
      var c = rnd.choix([['kg', 'g'], ['g', 'mg'], ['t', 'kg'], ['g', 'kg'], ['kg', 't'], ['mg', 'g']]);
      u0 = c[0]; u1 = c[1];
      v = RANG[u1] < RANG[u0] ? 1000 * rnd.entier(2, 9) : rnd.entier(2, 9);   // vers le grand, ça tombe juste
    } else if (palier === 2) {
      var c2 = rnd.choix([['kg', 'g', [1.5, 2.5, 0.5, 3.2, 0.75, 1.25]], ['g', 'kg', [250, 500, 750, 1500, 2500, 75, 125]], ['t', 'kg', [0.8, 2.5, 1.2, 0.5, 3.6]],
                          ['g', 'mg', [2.5, 0.4, 1.5, 0.25, 7.5]], ['mg', 'g', [500, 2500, 250, 750, 50]], ['hg', 'g', [3, 5, 2.5, 12]], ['dag', 'g', [45, 7, 2.5, 30]],
                          ['g', 'cg', [5, 2.5, 12, 0.4]], ['g', 'dag', [350, 45, 7, 1200]], ['kg', 'hg', [2, 3.5, 0.7]], ['dg', 'g', [25, 4, 150]]]);
      u0 = c2[0]; u1 = c2[1]; v = rnd.choix(c2[2]);
    } else if (palier === 3) {
      var c3 = rnd.choix([['t', 'g', [2.5, 1.2, 0.8, 3]], ['g', 't', [3500000, 1200000, 500000, 2000000]], ['kg', 'mg', [0.5, 2, 1.25, 0.075]], ['mg', 'kg', [2500000, 500000, 1200000, 750000]],
                          ['hg', 'g', [2.5, 0.75, 12.5]], ['cg', 'g', [125, 50, 2500]], ['kg', 'dag', [3.2, 0.45, 1.05]], ['dag', 'kg', [25, 350, 4]], ['t', 'hg', [0.5, 1.2]]]);
      u0 = c3[0]; u1 = c3[1]; v = rnd.choix(c3[2]);
    } else {
      var c4 = rnd.choix([['kg', 'mg', [0.004, 0.0125, 0.0007]], ['mg', 'kg', [25, 4000, 750]], ['t', 'g', [0.0005, 0.012, 0.25]], ['g', 't', [500, 12000, 250000]],
                          ['cg', 'kg', [12500, 250, 300000]], ['kg', 'cg', [0.025, 1.2, 0.0004]], ['t', 'mg', [0.000002, 0.0015]], ['mg', 't', [2000000, 1500000000]]]);
      u0 = c4[0]; u1 = c4[1]; v = rnd.choix(c4[2]);
    }
    return { M: Math.round(v * enMg(u0)), u0: u0, u1: u1 };
  }
  function convertir(rnd, palier) {
    var t = tirerConversion(rnd, palier), M = t.M, u0 = t.u0, u1 = t.u1;
    return { famille: 'convertir', enonce: '<p>Convertis : ' + b(txt(M, u0)) + ' = … ' + b(u1) + '</p><p>Donne le nombre de ' + NOM[u1] + '.</p>',
             type: 'nombre', reponse: val(M, u1), unite: u1, etapes: etapesConversion(M, u0, u1), indices: INDICES_CONV, duree: palier >= 3 ? 60 : 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Comparer                                                            */
  /* ------------------------------------------------------------------ */
  // Des masses du même ordre de grandeur, dans des unités voisines : il faut
  // vraiment convertir pour les ranger (1 200 g, 1,5 kg, 0,9 kg…).
  function comparer(rnd, palier) {
    var n = palier >= 4 ? 3 : 2;
    var unites = palier >= 3 ? ['t', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'] : ['t', 'kg', 'g', 'mg'];
    // la tonne n'a qu'une voisine (le kg) : elle ne sert pas de départ à trois masses
    var u0 = rnd.choix(n === 3 ? unites.slice(1) : unites), v0 = rnd.choix([1.2, 1.5, 2.5, 0.8, 3, 0.75, 12, 25, 0.5, 4.5]);
    var liste = [{ M: Math.round(v0 * enMg(u0)), u: u0 }], essais = 0;
    while (liste.length < n && essais < 300) {
      essais++;
      var u = rnd.choix(unites);
      if (u === u0 || Math.abs(RANG[u] - RANG[u0]) > 3 || liste.some(function (x) { return x.u === u; })) continue;
      var ratio = rnd.choix([0.5, 0.8, 0.9, 1.1, 1.2, 1.5, 2]);
      var pas = Math.max(1, enMg(u) / 100);                        // deux décimales au plus dans l'unité u
      var M = Math.round(liste[0].M * ratio / pas) * pas;
      if (M <= 0 || M / enMg(u) < 0.1 || liste.some(function (x) { return x.M === M; })) continue;
      liste.push({ M: M, u: u });
    }
    if (liste.length < n) { liste = [{ M: 1500000, u: 'kg' }, { M: 1200000, u: 'g' }]; if (n === 3) liste.push({ M: 9000000, u: 'hg' }); }
    var grande = liste.reduce(function (a, x) { return x.M > a.M ? x : a; }, liste[0]);
    var choix = rnd.melange(liste.map(function (x) { return txt(x.M, x.u); }));
    var ref = liste.reduce(function (a, x) { return RANG[x.u] > RANG[a.u] ? x : a; }, liste[0]).u;   // tout en la plus petite unité
    return { famille: 'comparer', enonce: '<p>Quelle est la masse ' + b('la plus grande') + ' ?</p>', type: 'qcm', choix: choix, correct: choix.indexOf(txt(grande.M, grande.u)),
             etapes: ['Pour comparer, on met tout dans la <b>même unité</b>, par exemple en ' + ref + ' : ' + liste.map(function (x) { return txt(x.M, x.u) + ' = ' + txt(x.M, ref); }).join(' ; ') + '.',
                      'La plus grande est ' + b(txt(grande.M, grande.u)) + '.'],
             indices: ['On ne compare pas des nombres dans des unités différentes : convertis d\'abord.'], duree: 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Composer : 2 kg 350 g                                               */
  /* ------------------------------------------------------------------ */
  function composer(rnd, palier) {
    var paire = rnd.choix([['kg', 'g'], ['kg', 'g'], ['t', 'kg'], ['g', 'mg']]), G = paire[0], P = paire[1];
    var e = rnd.entier(1, 9), f = rnd.choix([350, 250, 500, 75, 5, 50, 125, 800, 20]);
    var M = e * enMg(G) + f * enMg(P);
    var forme = rnd.entier(0, 2);
    if (forme === 2) {
      // l'inverse : écrire 2 350 g en kg et g
      return { famille: 'composer-texte', enonce: '<p>Écris ' + b(txt(M, P)) + ' en ' + NOM[G] + ' et ' + NOM[P] + ' (par exemple « 3 ' + G + ' 20 ' + P + ' »).</p>',
               type: 'texte', reponse: [e + ' ' + G + ' ' + f + ' ' + P, e + G + f + P, e + ' ' + G + ' et ' + f + ' ' + P],
               etapes: ['1 ' + G + ' = ' + fmt(enMg(G) / enMg(P)) + ' ' + P + '. Combien de ' + G + ' entiers dans ' + txt(M, P) + ' ? ' + fmt(val(M, P)) + ' = ' + fmt(enMg(G) / enMg(P)) + ' × ' + e + ' + ' + f + '.',
                        'Donc ' + b(txt(M, P) + ' = ' + e + ' ' + G + ' ' + f + ' ' + P) + '.'],
               indices: ['Cherche d\'abord combien de ' + G + ' entiers ; le reste s\'écrit en ' + P + '.'], duree: 50 };
    }
    var cible = forme === 0 ? P : G;
    return { famille: 'composer', enonce: '<p>' + b(e + ' ' + G + ' ' + f + ' ' + P) + ' = … ' + b(cible) + '</p><p>Donne le nombre de ' + NOM[cible] + '.</p>',
             type: 'nombre', reponse: val(M, cible), unite: cible,
             etapes: cible === P
               ? [e + ' ' + G + ' = ' + e + ' × ' + fmt(enMg(G) / enMg(P)) + ' ' + P + ' = ' + fmt(e * enMg(G) / enMg(P)) + ' ' + P + '.',
                  'Avec les ' + f + ' ' + P + ' : ' + fmt(e * enMg(G) / enMg(P)) + ' + ' + f + ' = ' + b(fmt(val(M, P))) + '. Donc ' + b(e + ' ' + G + ' ' + f + ' ' + P + ' = ' + txt(M, P)) + '.']
               : [f + ' ' + P + ' = ' + f + ' ÷ ' + fmt(enMg(G) / enMg(P)) + ' ' + G + ' = ' + fmt(f * enMg(P) / enMg(G), 9 - RANG[G]) + ' ' + G + ' (trois colonnes vers la gauche).',
                  'Avec les ' + e + ' ' + G + ' : ' + e + ' + ' + fmt(f * enMg(P) / enMg(G), 9 - RANG[G]) + ' = ' + b(fmt(val(M, G), 9 - RANG[G])) + '. Donc ' + b(e + ' ' + G + ' ' + f + ' ' + P + ' = ' + txt(M, G)) + '.',
                  'Attention aux zéros : 50 ' + P + ' = 0,050 ' + G + ' (pas 0,5), et 5 ' + P + ' = 0,005 ' + G + '.'],
             indices: ['Convertis la partie en ' + (cible === P ? G : P) + ', puis ajoute.'], duree: 50 };
  }

  /* ------------------------------------------------------------------ */
  /* La tare                                                             */
  /* ------------------------------------------------------------------ */
  var CONTENANTS = [
    { vide: 'Un pot vide', plein: 'Rempli de confiture, il', contenu: 'de la confiture' },
    { vide: 'Une boîte vide', plein: 'Remplie de biscuits, elle', contenu: 'des biscuits' },
    { vide: 'Un bocal vide', plein: 'Rempli de cornichons, il', contenu: 'des cornichons' },
    { vide: 'Une bouteille vide', plein: 'Remplie d\'eau, elle', contenu: 'de l\'eau' },
    { vide: 'Un sac vide', plein: 'Rempli de farine, il', contenu: 'de la farine' },
    { vide: 'Une casserole vide', plein: 'Remplie de soupe, elle', contenu: 'de la soupe' }
  ];
  function tare(rnd, palier) {
    var c = rnd.choix(CONTENANTS), vide = rnd.entier(6, 60) * 10, contenu = rnd.entier(15, 180) * 10;
    var plein = vide + contenu;
    if (palier >= 4 && plein >= 1000) {
      // le plein en kg, le vide en g : il faut d'abord tout mettre en grammes
      return { famille: 'tare-mixte', enonce: '<p>' + c.vide + ' pèse ' + b(vide + ' g') + '. ' + c.plein + ' pèse ' + b(fmt(plein / 1000, 3) + ' kg') + '. Quelle est la masse ' + c.contenu + ', en grammes ?</p>',
               type: 'nombre', reponse: contenu, unite: 'g',
               etapes: ['Deux unités différentes : on met tout en grammes. ' + fmt(plein / 1000, 3) + ' kg = ' + fmt(plein / 1000, 3) + ' × 1 000 g = ' + fmt(plein) + ' g.',
                        'Le contenu, c\'est le plein moins le vide : ' + fmt(plein) + ' − ' + vide + ' = ' + b(fmt(contenu) + ' g') + '.'],
               indices: ['Même unité d\'abord : combien de grammes dans ' + fmt(plein / 1000, 3) + ' kg ?', 'masse du contenu = masse pleine − masse vide.'], duree: 60 };
    }
    return { famille: 'tare', enonce: '<p>' + c.vide + ' pèse ' + b(vide + ' g') + '. ' + c.plein + ' pèse ' + b(fmt(plein) + ' g') + '. Quelle est la masse ' + c.contenu + ' ?</p>',
             type: 'nombre', reponse: contenu, unite: 'g',
             etapes: ['La balance pèse le récipient ET le contenu. Le contenu seul, c\'est la différence.', fmt(plein) + ' − ' + vide + ' = ' + b(fmt(contenu) + ' g') + '.'],
             indices: ['masse du contenu = masse pleine − masse du récipient vide.'], duree: 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Le piège de la virgule                                              */
  /* ------------------------------------------------------------------ */
  function piege(rnd, palier) {
    var paire = rnd.choix([['kg', 'g'], ['kg', 'g'], ['t', 'kg'], ['g', 'mg']]), G = paire[0], P = paire[1];
    var e = rnd.entier(1, 5), f = rnd.choix([500, 250, 750, 50, 200, 20]);
    var decimale = (e + f / 1000).toFixed(3).replace(/0+$/, '').replace('.', ',');     // « 1,5 »
    var chiffres = decimale.split(',')[1], leurre = parseInt(chiffres, 10);          // « 1 kg 5 g »
    var vrai = rnd.booleen(0.5);
    var ecrit = e + ' ' + G + ' ' + (vrai ? f : leurre) + ' ' + P;
    return { famille: 'piege', enonce: '<p>Vrai ou faux : ' + b(decimale + ' ' + G + ' = ' + ecrit) + '</p>', type: 'vraifaux', correct: vrai ? 0 : 1,
             etapes: [decimale + ' ' + G + ' = ' + e + ' ' + G + ' + 0,' + chiffres + ' ' + G + '. Et 0,' + chiffres + ' ' + G + ' = 0,' + chiffres + ' × 1 000 ' + P + ' = ' + b(f + ' ' + P) + ' (trois colonnes vers la droite : ' + (e + f / 1000).toFixed(3).replace('.', ',') + ' ' + G + ').',
                      'Donc ' + decimale + ' ' + G + ' = ' + b(e + ' ' + G + ' ' + f + ' ' + P) + (vrai ? ' : c\'est <b>vrai</b>.' : ', et pas ' + e + ' ' + G + ' ' + leurre + ' ' + P + ' : c\'est <b>faux</b>.')],
             indices: ['Écris la partie décimale avec trois chiffres : 0,' + chiffres + ' = 0,' + (chiffres + '000').slice(0, 3) + '.'], duree: 40 };
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'pc-masse',
    competence: 'pc-masse',
    level: '5eme',
    titre: 'La masse et ses unités',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return r <= 45 ? notion(rnd, 1) : convertir(rnd, 1);
      if (palier === 2) return r <= 15 ? notion(rnd, 2) : r <= 55 ? convertir(rnd, 2) : r <= 70 ? comparer(rnd, 2) : r <= 85 ? piege(rnd, 2) : composer(rnd, 2);
      if (palier === 3) return r <= 10 ? notion(rnd, 3) : r <= 40 ? convertir(rnd, 3) : r <= 60 ? composer(rnd, 3) : r <= 80 ? tare(rnd, 3) : r <= 90 ? piege(rnd, 3) : comparer(rnd, 3);
      return r <= 15 ? notion(rnd, 4) : r <= 45 ? convertir(rnd, 4) : r <= 60 ? comparer(rnd, 4) : r <= 75 ? tare(rnd, 4) : r <= 88 ? composer(rnd, 4) : piege(rnd, 4);
    }
  });
})();
