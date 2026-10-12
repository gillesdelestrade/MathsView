/*
 * Exercices « La masse volumique » (5ème, physique-chimie).
 *
 * Neuf familles :
 *   - notion : ce qu'est la masse volumique, sa formule, son unité, le fait
 *     qu'elle ne dépend pas de la taille du morceau — en QCM et vrai/faux ;
 *   - calculer ρ : ρ = m ÷ V, avec des unités qu'il faut d'abord accorder
 *     (230 g et 0,25 L, c'est 230 g et 250 mL) ;
 *   - calculer m : m = ρ × V ;  - calculer V : V = m ÷ ρ ;
 *   - convertir ρ : g/cm³ = g/mL = kg/L (même nombre), g/L et kg/m³ (× 1 000) ;
 *   - piège d'unité : « l'huile fait 0,92 g/L » (faux : mille fois trop
 *     léger), l'élève qui divise des g par des L et écrit des g/mL, les
 *     écritures égales à 0,92 g/mL ;
 *   - flotte ou coule : comparer à l'eau, quelle que soit l'unité donnée ;
 *   - identifier : retrouver la matière d'un objet dans une petite table ;
 *   - tare : la bouteille vide, la bouteille pleine, le liquide inconnu.
 *
 * Les paliers :
 *   P1  la notion et ρ = m ÷ V avec des g et des mL (ou cm³) ;
 *   P2  m et V à retrouver, les conversions « même nombre », le volume donné
 *       en cL ou en L, flotter ou couler en g/cm³, le premier piège ;
 *   P3  kg et L, g/L et kg/m³, l'élève qui se trompe d'unité, identifier une
 *       matière, flotter en kg/m³ ;
 *   P4  tout mélangé : kg/m³ avec des litres, la tare, identifier avec des
 *       unités dépareillées, les écritures égales.
 *
 * Les masses volumiques sont tenues en g/cm³ ; les volumes sont choisis pour
 * que les masses tombent juste (au dixième de gramme au plus).
 */
(function () {
  'use strict';
  var O = ExosOutils;

  /* Les matières : ρ en g/cm³. `de` et `le` servent aux phrases. */
  var MAT = [
    { nom: 'liège', de: 'de liège', le: 'le liège', rho: 0.24 },
    { nom: 'sapin', de: 'de sapin', le: 'le sapin', rho: 0.45 },
    { nom: 'chêne', de: 'de chêne', le: 'le chêne', rho: 0.7 },
    { nom: 'essence', de: 'd\'essence', le: 'l\'essence', rho: 0.75, liquide: true },
    { nom: 'alcool', de: 'd\'alcool', le: 'l\'alcool', rho: 0.79, liquide: true },
    { nom: 'huile', de: 'd\'huile', le: 'l\'huile', rho: 0.92, liquide: true },
    { nom: 'glace', de: 'de glace', le: 'la glace', rho: 0.92 },
    { nom: 'eau', de: 'd\'eau', le: 'l\'eau', rho: 1, liquide: true },
    { nom: 'lait', de: 'de lait', le: 'le lait', rho: 1.03, liquide: true },
    { nom: 'miel', de: 'de miel', le: 'le miel', rho: 1.4, liquide: true },
    { nom: 'béton', de: 'de béton', le: 'le béton', rho: 2.3 },
    { nom: 'verre', de: 'de verre', le: 'le verre', rho: 2.5 },
    { nom: 'aluminium', de: 'd\'aluminium', le: 'l\'aluminium', rho: 2.7 },
    { nom: 'fer', de: 'de fer', le: 'le fer', rho: 7.8 },
    { nom: 'cuivre', de: 'de cuivre', le: 'le cuivre', rho: 8.9 },
    { nom: 'argent', de: 'd\'argent', le: 'l\'argent', rho: 10.5 },
    { nom: 'plomb', de: 'de plomb', le: 'le plomb', rho: 11.3 },
    { nom: 'or', de: 'd\'or', le: 'l\'or', rho: 19.3 }
  ];
  // « du fer », « de la glace », « de l'huile » : le complément, d'après l'article.
  function du(m) { return m.le.indexOf('le ') === 0 ? 'du ' + m.le.slice(3) : 'de ' + m.le; }
  function Le(m) { return m.le.charAt(0).toUpperCase() + m.le.slice(1); }

  /* Les unités de masse volumique, et leur valeur en g/cm³ (= g/mL). */
  var RHO_U = { 'g/cm³': 1, 'g/mL': 1, 'kg/L': 1, 'kg/dm³': 1, 'g/L': 0.001, 'kg/m³': 0.001, 'mg/mL': 0.001 };
  var MASSE_G = { g: 1, kg: 1000, mg: 0.001 };
  var VOL_ML = { mL: 1, 'cm³': 1, cL: 10, dL: 100, L: 1000, 'dm³': 1000, 'm³': 1e6 };

  function fmt(v) {
    var s = (Math.round(v * 1e6) / 1e6).toString().replace('.', ','), parts = s.split(','), e = parts[0], out = '';
    while (e.length > 3) { out = ' ' + e.slice(-3) + out; e = e.slice(0, -3); }
    return e + out + (parts[1] ? ',' + parts[1] : '');
  }
  function arr(v) { return Math.round(v * 1e6) / 1e6; }
  function b(t) { return '<b>' + t + '</b>'; }
  function rhoEn(m, u) { return arr(m.rho / RHO_U[u]); }                 // la masse volumique de m dans l'unité u
  function rhoTxt(m, u) { return fmt(rhoEn(m, u)) + ' ' + u; }
  function unitesDe(uRho) {                                               // g/mL → { m: 'g', v: 'mL' }
    var p = uRho.split('/'); return { m: p[0], v: p[1] };
  }
  // Une masse « ronde » : V (en mL) tel que ρ × V ait au plus une décimale.
  function tirerV(rnd, m, choixV) {
    var ok = choixV.filter(function (V) { var g = m.rho * V; return Math.abs(g * 10 - Math.round(g * 10)) < 1e-9; });
    return rnd.choix(ok.length ? ok : [100]);
  }
  // Un solide se mesure en cm³ ou en dm³, un liquide en mL, cL ou L.
  function uVolPour(m, u) { return m.liquide ? u : { L: 'dm³', mL: 'cm³', cL: 'cm³', dL: 'cm³' }[u] || u; }
  var FAMILLE = 'Le même nombre en g/cm³, g/mL et kg/L ; mille fois plus en g/L et kg/m³.';

  /* ------------------------------------------------------------------ */
  /* La notion                                                           */
  /* ------------------------------------------------------------------ */
  var NOTION_QCM = [
    { q: 'Que représente la <b>masse volumique</b> d\'une matière ?', rep: 'la masse d\'une unité de volume de cette matière (par exemple d\'un cm³)', autres: ['la masse totale de l\'objet', 'la place qu\'occupe un gramme de cette matière', 'le volume total de l\'objet'], why: 'La masse volumique, c\'est la masse d\'<b>un</b> centimètre cube (ou d\'un litre…) de la matière : ρ = m ÷ V.' },
    { q: 'Quelle formule donne la masse volumique ρ à partir de la masse m et du volume V ?', rep: 'ρ = m ÷ V', autres: ['ρ = V ÷ m', 'ρ = m × V', 'ρ = m + V'], why: 'On divise la masse par le volume : la masse <b>par</b> unité de volume.' },
    { q: 'Si la masse est en grammes et le volume en centimètres cubes, la masse volumique est en…', rep: 'g/cm³', autres: ['cm³/g', 'g', 'kg/m³'], why: 'Des grammes divisés par des centimètres cubes : des <b>g/cm³</b>.' },
    { q: 'On coupe un bloc de fer en deux morceaux égaux. La masse volumique de chaque morceau est…', rep: 'la même que celle du bloc entier', autres: ['deux fois plus petite', 'deux fois plus grande', 'impossible à connaître'], why: 'La masse ET le volume sont divisés par deux : le quotient ne change pas. ρ caractérise la <b>matière</b>, pas le morceau.' },
    { q: 'Quelle est la masse volumique de l\'<b>eau</b> ?', rep: '1 g/mL, c\'est-à-dire 1 kg/L', autres: ['10 g/mL', '1 g/L', '100 kg/L'], why: '1 mL d\'eau pèse 1 g, donc 1 L (1 000 mL) pèse 1 000 g = 1 kg.' },
    { q: 'Deux cubes de même taille, l\'un en bois, l\'autre en fer. Lequel a la plus grande masse ?', rep: 'le cube de fer : sa masse volumique est plus grande', autres: ['le cube de bois', 'ils ont la même masse, puisqu\'ils ont le même volume', 'on ne peut pas savoir'], why: 'À volume égal, la masse est proportionnelle à la masse volumique : fer 7,8 g/cm³, bois moins de 1 g/cm³.' },
    { q: 'Un litre d\'huile (0,92 g/mL) et un litre d\'eau : lequel a la plus grande masse ?', rep: 'le litre d\'eau', autres: ['le litre d\'huile', 'ils ont la même masse', 'cela dépend de la bouteille'], why: 'Même volume ; l\'eau fait 1 g/mL, l\'huile 0,92 g/mL : un litre d\'eau pèse 1 000 g, un litre d\'huile 920 g.', dur: true }
  ];
  var NOTION_VF = [
    { q: 'La masse volumique d\'une matière ne dépend pas de la taille du morceau.', vrai: true, why: 'Deux fois plus de volume, deux fois plus de masse : le quotient m ÷ V est le même.' },
    { q: 'Un litre d\'huile a la même masse qu\'un litre d\'eau.', vrai: false, why: 'Même volume, mais l\'huile est moins dense (0,92 g/mL contre 1) : 920 g contre 1 000 g.' },
    { q: 'Un kilogramme de fer a le même volume qu\'un kilogramme de bois.', vrai: false, why: 'Même masse, mais le fer est bien plus dense : il prend beaucoup moins de place.' },
    { q: '1 g/cm³ = 1 g/mL.', vrai: true, why: '1 cm³ = 1 mL : c\'est la même unité sous deux noms.' },
    { q: '1 g/mL = 1 g/L.', vrai: false, why: 'Un litre, c\'est 1 000 mL : 1 g/mL = <b>1 000 g/L</b>.' },
    { q: '1 g/cm³ = 1 kg/L.', vrai: true, why: '1 000 cm³ = 1 L et 1 000 g = 1 kg : même nombre.' },
    { q: 'Plus la masse volumique d\'une matière est grande, plus un centimètre cube de cette matière est lourd.', vrai: true, why: 'C\'est la définition : la masse d\'un centimètre cube.' },
    { q: 'Un gros morceau de chêne a une masse volumique plus grande qu\'un petit morceau du même chêne.', vrai: false, why: 'Plus de masse, mais aussi plus de volume : même quotient, 0,7 g/cm³.' },
    { q: '1 kg/m³ = 1 g/L.', vrai: true, why: '1 kg = 1 000 g et 1 m³ = 1 000 L : les deux « × 1 000 » se compensent.', dur: true }
  ];
  function notion(rnd, palier) {
    if (rnd.booleen(0.5)) {
      var n = rnd.choix(NOTION_QCM.filter(function (x) { return palier >= 3 || !x.dur; })), choix = rnd.melange([n.rep].concat(n.autres));
      return { famille: 'notion-qcm', enonce: '<p>' + n.q + '</p>', type: 'qcm', choix: choix, correct: choix.indexOf(n.rep),
               etapes: [n.why, 'Réponse : <b>' + n.rep + '</b>.'], indices: ['ρ = m ÷ V : la masse d\'une unité de volume.'], duree: 30 };
    }
    var v = rnd.choix(NOTION_VF.filter(function (x) { return palier >= 3 || !x.dur; }));
    return { famille: 'notion-vf', enonce: '<p>Vrai ou faux : ' + v.q + '</p>', type: 'vraifaux', correct: v.vrai ? 0 : 1,
             etapes: [v.why, 'Donc c\'est <b>' + (v.vrai ? 'vrai' : 'faux') + '</b>.'], indices: [FAMILLE], duree: 30 };
  }

  /* ------------------------------------------------------------------ */
  /* Les trois calculs                                                   */
  /* ------------------------------------------------------------------ */
  // Un échantillon : la matière, V en mL, m en g.
  function echantillon(rnd, choixV, filtre) {
    var pool = MAT.filter(filtre || function () { return true; }), m = rnd.choix(pool), V = tirerV(rnd, m, choixV);
    return { m: m, V: V, masse: arr(m.rho * V) };
  }
  function phraseEch(e, uM, uV) {
    if (e.m.liquide) return 'On verse ' + b(fmt(e.V / VOL_ML[uV]) + ' ' + uV) + ' ' + e.m.de + ' dans une éprouvette, puis on pèse ce liquide : sa masse est ' + b(fmt(e.masse / MASSE_G[uM]) + ' ' + uM) + '.';
    return 'Un morceau ' + e.m.de + ' a un volume de ' + b(fmt(e.V / VOL_ML[uV]) + ' ' + uV) + ' et une masse de ' + b(fmt(e.masse / MASSE_G[uM]) + ' ' + uM) + '.';
  }
  // La ligne « unités accordées » : ce qu'il faut convertir pour obtenir l'unité demandée.
  function accorder(e, uM, uV, uRho) {
    var cible = unitesDe(uRho), lignes = [];
    if (uM !== cible.m) lignes.push('m = ' + fmt(e.masse / MASSE_G[uM]) + ' ' + uM + ' = ' + b(fmt(e.masse / MASSE_G[cible.m]) + ' ' + cible.m));
    if (uV !== cible.v && VOL_ML[uV] !== VOL_ML[cible.v]) lignes.push('V = ' + fmt(e.V / VOL_ML[uV]) + ' ' + uV + ' = ' + b(fmt(e.V / VOL_ML[cible.v]) + ' ' + cible.v));
    else if (uV !== cible.v) lignes.push('V = ' + fmt(e.V / VOL_ML[uV]) + ' ' + uV + ' = ' + b(fmt(e.V / VOL_ML[cible.v]) + ' ' + cible.v) + ' (même volume, autre nom)');
    if (!lignes.length) return 'Les unités vont ensemble : des ' + cible.m + ' et des ' + cible.v + ' donnent des ' + uRho + '.';
    return 'On veut des ' + b(uRho) + ' : il faut m en ' + cible.m + ' et V en ' + cible.v + '. ' + lignes.join(' ; ') + '.';
  }
  function calculerRho(rnd, palier) {
    var uM = 'g', uV = rnd.choix(['mL', 'cm³']), uRho = 'g/' + uV, e;
    if (palier === 1) e = echantillon(rnd, [10, 20, 50, 100, 200, 500]);
    else if (palier === 2) { e = echantillon(rnd, [250, 500, 1000, 2000, 100, 200]); uV = rnd.choix(e.V >= 1000 ? ['L', 'cL'] : ['cL', 'dL']); uRho = 'g/mL'; }
    else if (palier === 3) {
      e = echantillon(rnd, [500, 1000, 2000, 5000, 250]);
      var k = rnd.entier(0, 2);
      if (k === 0) { uM = 'kg'; uV = 'L'; uRho = rnd.choix(['kg/L', 'g/mL']); }
      else if (k === 1) { uM = 'g'; uV = 'L'; uRho = 'g/L'; }
      else { uM = 'kg'; uV = 'dm³'; uRho = 'kg/dm³'; }
    } else {
      e = echantillon(rnd, [500, 1000, 2000, 5000, 250, 100]);
      var k4 = rnd.entier(0, 3);
      if (k4 === 0) { uM = 'kg'; uV = 'dm³'; uRho = 'kg/m³'; }
      else if (k4 === 1) { uM = 'g'; uV = 'cL'; uRho = 'g/L'; }
      else if (k4 === 2) { uM = 'kg'; uV = 'L'; uRho = 'g/cm³'; }
      else { uM = 'g'; uV = 'L'; uRho = 'kg/m³'; }
    }
    uV = uVolPour(e.m, uV);
    var rep = rhoEn(e.m, uRho), cible = unitesDe(uRho);
    var mC = e.masse / MASSE_G[cible.m], vC = e.V / VOL_ML[cible.v];
    var etapes = [accorder(e, uM, uV, uRho),
                  'ρ = m ÷ V = ' + fmt(mC) + ' ÷ ' + fmt(vC) + ' = ' + b(fmt(rep) + ' ' + uRho) + '.'];
    if (RHO_U[uRho] === 1) etapes.push('C\'est aussi ' + fmt(e.m.rho) + ' g/cm³ = ' + fmt(e.m.rho) + ' kg/L, ou ' + fmt(e.m.rho * 1000) + ' g/L : la masse volumique ' + du(e.m) + '.');
    else etapes.push('Attention à l\'unité : ' + fmt(rep) + ' ' + uRho + ', c\'est ' + fmt(e.m.rho) + ' g/mL (mille fois moins), la masse volumique ' + du(e.m) + '.');
    return { famille: 'calculer-rho', enonce: '<p>' + phraseEch(e, uM, uV) + '</p><p>Quelle est la masse volumique de cette matière, en ' + b(uRho) + ' ?</p>',
             type: 'nombre', reponse: rep, unite: uRho, etapes: etapes,
             indices: ['ρ = m ÷ V. Mets d\'abord m et V dans les unités de la réponse : pour des ' + uRho + ', des ' + cible.m + ' et des ' + cible.v + '.', FAMILLE], duree: palier >= 3 ? 75 : 55 };
  }
  function calculerM(rnd, palier) {
    var e, uRho, uV, uM;
    if (palier <= 2) { e = echantillon(rnd, [10, 20, 50, 100, 200, 250, 500]); uRho = rnd.choix(['g/mL', 'g/cm³']); uV = unitesDe(uRho).v; uM = 'g'; }
    else if (palier === 3) {
      e = echantillon(rnd, [500, 1000, 2000, 250, 5000]);
      if (rnd.booleen(0.5)) { uRho = 'g/mL'; uV = 'L'; uM = rnd.choix(['g', 'kg']); } else { uRho = 'kg/L'; uV = 'L'; uM = 'kg'; }
    } else {
      e = echantillon(rnd, [500, 1000, 2000, 250, 5000, 100]);
      var k = rnd.entier(0, 2);
      if (k === 0) { uRho = 'kg/m³'; uV = 'L'; uM = 'kg'; } else if (k === 1) { uRho = 'g/L'; uV = 'cL'; uM = 'g'; } else { uRho = 'g/cm³'; uV = 'L'; uM = 'kg'; }
    }
    uV = uVolPour(e.m, uV);
    var c = unitesDe(uRho), rep = arr(e.masse / MASSE_G[uM]);
    var etapes = ['m = ρ × V. Pour multiplier, il faut V dans l\'unité de volume de ρ (des ' + c.v + ')' + (uV !== c.v ? ' : V = ' + fmt(e.V / VOL_ML[uV]) + ' ' + uV + ' = ' + b(fmt(e.V / VOL_ML[c.v]) + ' ' + c.v) : '') + '.',
                  'm = ' + fmt(rhoEn(e.m, uRho)) + ' × ' + fmt(e.V / VOL_ML[c.v]) + ' = ' + b(fmt(e.masse / MASSE_G[c.m]) + ' ' + c.m) + (c.m !== uM ? ' = ' + b(fmt(rep) + ' ' + uM) : '') + '.'];
    if (RHO_U[uRho] !== 1) etapes.push('Rappel : ' + fmt(rhoEn(e.m, uRho)) + ' ' + uRho + ', c\'est ' + fmt(e.m.rho) + ' g/mL : un litre ' + e.m.de + ' pèse ' + fmt(e.m.rho * 1000) + ' g.');
    return { famille: 'calculer-m', enonce: '<p>La masse volumique ' + du(e.m) + ' est ' + b(rhoTxt(e.m, uRho)) + '. Quelle est la masse de ' + b(fmt(e.V / VOL_ML[uV]) + ' ' + uV) + ' ' + e.m.de + ', en ' + b(uM) + ' ?</p>',
             type: 'nombre', reponse: rep, unite: uM, etapes: etapes,
             indices: ['m = ρ × V, avec V dans l\'unité de volume de ρ.', FAMILLE], duree: palier >= 3 ? 70 : 50 };
  }
  function calculerV(rnd, palier) {
    var e, uRho, uM, uV;
    if (palier <= 2) { e = echantillon(rnd, [10, 20, 50, 100, 200, 250, 500]); uRho = rnd.choix(['g/mL', 'g/cm³']); uM = 'g'; uV = unitesDe(uRho).v; }
    else if (palier === 3) { e = echantillon(rnd, [500, 1000, 2000, 250, 5000]); uRho = 'g/mL'; uM = rnd.choix(['g', 'kg']); uV = rnd.choix(['L', 'mL']); }
    else { e = echantillon(rnd, [500, 1000, 2000, 250, 5000]); if (rnd.booleen(0.5)) { uRho = 'kg/m³'; uM = 'kg'; uV = 'L'; } else { uRho = 'g/L'; uM = 'g'; uV = 'cL'; } }
    uV = uVolPour(e.m, uV);
    var c = unitesDe(uRho), rep = arr(e.V / VOL_ML[uV]);
    var etapes = ['V = m ÷ ρ. Il faut m dans l\'unité de masse de ρ (des ' + c.m + ')' + (uM !== c.m ? ' : m = ' + fmt(e.masse / MASSE_G[uM]) + ' ' + uM + ' = ' + b(fmt(e.masse / MASSE_G[c.m]) + ' ' + c.m) : '') + '.',
                  'V = ' + fmt(e.masse / MASSE_G[c.m]) + ' ÷ ' + fmt(rhoEn(e.m, uRho)) + ' = ' + b(fmt(e.V / VOL_ML[c.v]) + ' ' + c.v) + (VOL_ML[c.v] !== VOL_ML[uV] ? ' = ' + b(fmt(rep) + ' ' + uV) : c.v !== uV ? ' = ' + b(fmt(rep) + ' ' + uV) : '') + '.'];
    return { famille: 'calculer-V', enonce: '<p>La masse volumique ' + du(e.m) + ' est ' + b(rhoTxt(e.m, uRho)) + '. Quel volume occupent ' + b(fmt(e.masse / MASSE_G[uM]) + ' ' + uM) + ' ' + e.m.de + ', en ' + b(uV) + ' ?</p>',
             type: 'nombre', reponse: rep, unite: uV, etapes: etapes,
             indices: ['V = m ÷ ρ, avec m dans l\'unité de masse de ρ ; le résultat sort dans l\'unité de volume de ρ.', FAMILLE], duree: palier >= 3 ? 70 : 50 };
  }

  /* ------------------------------------------------------------------ */
  /* Convertir une masse volumique                                       */
  /* ------------------------------------------------------------------ */
  var POURQUOI = {
    '1': 'même nombre : soit c\'est le même volume sous deux noms (1 cm³ = 1 mL), soit la masse et le volume sont tous deux 1 000 fois plus grands (1 kg pour 1 L, c\'est 1 g pour 1 mL ; 1 kg pour 1 m³, c\'est 1 g pour 1 L) et les deux « × 1 000 » se compensent',
    '1000': 'un litre (ou un m³) contient 1 000 fois plus de matière qu\'un millilitre (ou qu\'un dm³) : le nombre est multiplié par 1 000',
    '0.001': 'on revient à une unité de volume 1 000 fois plus petite : le nombre est divisé par 1 000'
  };
  function convertirRho(rnd, palier) {
    var paires = palier === 2 ? [['g/cm³', 'g/mL'], ['g/mL', 'kg/L'], ['g/mL', 'g/L'], ['g/cm³', 'kg/L'], ['kg/L', 'g/mL']]
             : palier === 3 ? [['g/cm³', 'kg/m³'], ['kg/m³', 'g/cm³'], ['g/L', 'g/mL'], ['kg/L', 'g/L'], ['g/mL', 'kg/m³'], ['g/L', 'kg/L']]
             : [['g/L', 'kg/m³'], ['kg/m³', 'g/L'], ['mg/mL', 'g/L'], ['kg/L', 'kg/m³'], ['kg/m³', 'kg/L'], ['g/cm³', 'mg/mL'], ['kg/dm³', 'kg/m³']];
    var p = rnd.choix(paires), m = rnd.choix(MAT), u0 = p[0], u1 = p[1];
    var facteur = RHO_U[u0] / RHO_U[u1], rep = rhoEn(m, u1);
    var cle = facteur === 1 ? '1' : facteur > 1 ? '1000' : '0.001';
    return { famille: 'convertir-rho', enonce: '<p>La masse volumique ' + du(m) + ' est ' + b(rhoTxt(m, u0)) + '. Exprime-la en ' + b(u1) + '.</p>',
             type: 'nombre', reponse: rep, unite: u1,
             etapes: ['De ' + u0 + ' à ' + u1 + ' : ' + POURQUOI[cle] + '.',
                      fmt(rhoEn(m, u0)) + (facteur === 1 ? '' : facteur > 1 ? ' × 1 000' : ' ÷ 1 000') + ' = ' + b(fmt(rep) + ' ' + u1) + '.',
                      'Donc ' + b(rhoTxt(m, u0) + ' = ' + rhoTxt(m, u1)) + '.'],
             indices: [FAMILLE, 'Un litre pèse 1 000 fois plus qu\'un millilitre de la même matière.'], duree: 45 };
  }

  /* ------------------------------------------------------------------ */
  /* Les pièges d'unité                                                  */
  /* ------------------------------------------------------------------ */
  function piege(rnd, palier) {
    var r = rnd.entier(1, palier >= 3 ? 3 : 1);
    if (r === 1) {
      // « la masse volumique de l'huile est 0,92 g/L » : vrai ou faux ?
      var m = rnd.choix(MAT), u = rnd.choix(palier >= 3 ? ['g/mL', 'g/cm³', 'kg/L', 'g/L', 'kg/m³'] : ['g/mL', 'g/L', 'kg/L']);
      var vrai = rnd.booleen(0.5), valeur = vrai ? rhoEn(m, u) : arr(rhoEn(m, u) * (RHO_U[u] === 1 ? 1000 : 0.001));
      return { famille: 'piege-vf', enonce: '<p>Vrai ou faux : la masse volumique ' + du(m) + ' est ' + b(fmt(valeur) + ' ' + u) + '.</p>', type: 'vraifaux', correct: vrai ? 0 : 1,
               etapes: [Le(m) + ' : ' + fmt(m.rho) + ' g/cm³ = ' + fmt(m.rho) + ' g/mL = ' + fmt(m.rho) + ' kg/L, et ' + fmt(m.rho * 1000) + ' g/L = ' + fmt(m.rho * 1000) + ' kg/m³.',
                        'En ' + u + ', c\'est ' + b(rhoTxt(m, u)) + (vrai ? ' : <b>vrai</b>.' : '. ' + fmt(valeur) + ' ' + u + ' serait mille fois trop ' + (valeur < rhoEn(m, u) ? 'léger' : 'lourd') + ' : <b>faux</b>.')],
               indices: ['Dans un litre, il y a 1 000 mL : un litre pèse 1 000 fois plus qu\'un millilitre.', FAMILLE], duree: 40 };
    }
    if (r === 2) {
      // l'élève qui divise des g par des L et écrit des g/mL
      var e = echantillon(rnd, [250, 500, 2000, 1000], function (x) { return x.liquide; }), VL = e.V / 1000;
      var bon = 'Le nombre est juste mais pas l\'unité : des grammes divisés par des litres donnent des g/L. ρ = ' + fmt(e.masse / VL) + ' g/L, soit ' + fmt(e.m.rho) + ' g/mL.';
      var choix = rnd.melange([bon, 'Tout est juste : ρ = ' + fmt(e.masse / VL) + ' g/mL.', 'Il fallait multiplier : ρ = ' + fmt(e.masse) + ' × ' + fmt(VL) + '.', 'Il fallait diviser dans l\'autre sens : ρ = ' + fmt(VL) + ' ÷ ' + fmt(e.masse) + '.']);
      return { famille: 'piege-eleve', enonce: '<p>Un élève mesure ' + b('m = ' + fmt(e.masse) + ' g') + ' et ' + b('V = ' + fmt(VL) + ' L') + ' ' + e.m.de + '. Il calcule ' + fmt(e.masse) + ' ÷ ' + fmt(VL) + ' = ' + fmt(e.masse / VL) + ' et écrit ' + b('ρ = ' + fmt(e.masse / VL) + ' g/mL') + '. Qu\'en penses-tu ?</p>',
               type: 'qcm', choix: choix, correct: choix.indexOf(bon),
               etapes: ['ρ = m ÷ V, le calcul est bon : ' + fmt(e.masse) + ' ÷ ' + fmt(VL) + ' = ' + fmt(e.masse / VL) + '. Mais des g divisés par des L, ce sont des <b>g/L</b>, pas des g/mL.',
                        fmt(e.masse / VL) + ' g/mL serait mille fois trop lourd (le fer ne fait que 7,8 g/mL !). En g/mL : ' + fmt(e.masse) + ' g ÷ ' + fmt(e.V) + ' mL = ' + b(fmt(e.m.rho) + ' g/mL') + ', soit ' + b(fmt(e.masse / VL) + ' g/L') + '.'],
               indices: ['Regarde les unités du calcul : des g et des L.'], duree: 60 };
    }
    // les écritures égales à 0,92 g/mL
    var m3 = rnd.choix(MAT), u3 = rnd.choix(['g/L', 'kg/m³']), juste = rhoTxt(m3, u3);
    var leurres = [fmt(m3.rho) + ' ' + u3, fmt(arr(m3.rho * 100)) + ' ' + u3, fmt(arr(m3.rho * 10)) + ' ' + u3, fmt(arr(m3.rho * 1e6)) + ' ' + u3];
    var choix3 = rnd.melange([juste].concat(rnd.melange(leurres).slice(0, 3)));
    return { famille: 'piege-egal', enonce: '<p>Parmi ces écritures, laquelle est égale à ' + b(rhoTxt(m3, 'g/mL')) + ' ?</p>', type: 'qcm', choix: choix3, correct: choix3.indexOf(juste),
             etapes: ['1 L = 1 000 mL (et 1 m³ = 1 000 L avec 1 kg = 1 000 g) : la masse volumique en ' + u3 + ' est 1 000 fois plus grande qu\'en g/mL.',
                      fmt(m3.rho) + ' × 1 000 = ' + fmt(m3.rho * 1000) + ' : ' + b(rhoTxt(m3, 'g/mL') + ' = ' + juste) + '.'],
             indices: [FAMILLE], duree: 40 };
  }

  /* ------------------------------------------------------------------ */
  /* Flotte ou coule                                                     */
  /* ------------------------------------------------------------------ */
  function flotte(rnd, palier) {
    var pool = MAT.filter(function (x) { return x.rho !== 1; });
    if (palier >= 3 && rnd.booleen(0.4)) {
      // lequel flotte ? quatre matières, une seule du bon côté
      var cherche = rnd.booleen(0.5) ? 'flotte' : 'coule';
      var bons = rnd.melange(pool.filter(function (x) { return cherche === 'flotte' ? x.rho < 1 : x.rho > 1; }));
      var autres = rnd.melange(pool.filter(function (x) { return cherche === 'flotte' ? x.rho > 1 : x.rho < 1; })).slice(0, 3);
      var u = rnd.choix(palier >= 4 ? ['g/cm³', 'kg/m³', 'g/L', 'kg/L'] : ['g/cm³', 'kg/m³']);
      var liste = rnd.melange([bons[0]].concat(autres)), choix = liste.map(function (x) { return x.nom + ' : ' + rhoTxt(x, u); });
      return { famille: 'flotte-qcm', enonce: '<p>Lequel de ces matériaux ' + b(cherche + ' sur l\'eau') + ' ?</p>', type: 'qcm', choix: choix, correct: liste.indexOf(bons[0]),
               etapes: ['L\'eau : 1 g/cm³ = 1 kg/L = ' + (RHO_U[u] === 1 ? '1 ' + u : '1 000 ' + u) + '. Moins dense que l\'eau, ça flotte ; plus dense, ça coule.',
                        'Une seule valeur est ' + (cherche === 'flotte' ? 'en dessous' : 'au-dessus') + ' : ' + b(bons[0].le + ' (' + rhoTxt(bons[0], u) + ')') + ', qui ' + cherche + '.'],
               indices: ['Compare chaque valeur à celle de l\'eau, dans la même unité.'], duree: 50 };
    }
    var m = rnd.choix(pool), u2 = rnd.choix(palier <= 2 ? ['g/cm³', 'g/mL'] : palier === 3 ? ['kg/m³', 'g/L'] : ['g/cm³', 'kg/m³', 'g/L', 'kg/L']);
    var affirme = rnd.booleen(0.5) ? 'flotte' : 'coule', vrai = (m.rho < 1) === (affirme === 'flotte');
    return { famille: 'flotte-vf', enonce: '<p>La masse volumique ' + du(m) + ' est ' + b(rhoTxt(m, u2)) + '. Vrai ou faux : ' + (m.liquide ? 'versé doucement à la surface de l\'eau, ce liquide' : 'un morceau') + ' ' + b(affirme + ' sur l\'eau') + '.</p>',
             type: 'vraifaux', correct: vrai ? 0 : 1,
             etapes: ['L\'eau : 1 g/cm³ = 1 g/mL = 1 kg/L, soit ' + b('1 000 ' + (RHO_U[u2] === 1 ? 'g/L (ou kg/m³)' : u2)) + '.' + (RHO_U[u2] === 1 ? '' : ' Dans la même unité : ' + fmt(rhoEn(m, u2)) + ' contre 1 000.'),
                      Le(m) + ' est ' + (m.rho < 1 ? '<b>moins</b> dense que l\'eau : ça <b>flotte</b>' : '<b>plus</b> dense que l\'eau : ça <b>coule</b>') + '. Donc c\'est <b>' + (vrai ? 'vrai' : 'faux') + '</b>.'],
             indices: ['Compare à l\'eau dans la même unité : 1 g/mL, c\'est 1 000 g/L et 1 000 kg/m³.'], duree: 40 };
  }

  /* ------------------------------------------------------------------ */
  /* Identifier une matière                                              */
  /* ------------------------------------------------------------------ */
  function identifier(rnd, palier) {
    var pool = MAT.filter(function (x) { return !x.liquide; });
    var cibleM = rnd.choix(pool), autres = rnd.melange(pool.filter(function (x) { return Math.abs(x.rho - cibleM.rho) > 0.2; })).slice(0, 3);
    var liste = rnd.melange([cibleM].concat(autres)), V = tirerV(rnd, cibleM, palier >= 4 ? [500, 1000, 2000, 250] : [10, 20, 50, 100, 200]);
    var masse = arr(cibleM.rho * V), uM = palier >= 4 && masse >= 1000 && rnd.booleen(0.6) ? 'kg' : 'g', uV = palier >= 4 && rnd.booleen(0.5) ? 'L' : 'cm³';
    var table = liste.map(function (x) { return x.nom + ' : ' + fmt(x.rho) + ' g/cm³'; }).join(' · ');
    return { famille: 'identifier', enonce: '<p>Un objet a une masse de ' + b(fmt(masse / MASSE_G[uM]) + ' ' + uM) + ' et un volume de ' + b(fmt(V / VOL_ML[uV]) + ' ' + uV) + '.</p><p>Masses volumiques : ' + table + '.</p><p>De quelle matière est-il fait ?</p>',
             type: 'qcm', choix: liste.map(function (x) { return x.nom; }), correct: liste.indexOf(cibleM),
             etapes: ['On calcule sa masse volumique en g/cm³' + (uM !== 'g' || uV !== 'cm³' ? ', avec m = ' + fmt(masse) + ' g et V = ' + fmt(V) + ' cm³' : '') + ' : ρ = ' + fmt(masse) + ' ÷ ' + fmt(V) + ' = ' + b(fmt(cibleM.rho) + ' g/cm³') + '.',
                      'Dans la table, c\'est ' + b(cibleM.le) + '.'],
             indices: ['ρ = m ÷ V, puis cherche ce nombre dans la table.', uM !== 'g' || uV !== 'cm³' ? 'Mets d\'abord m en g et V en cm³ (1 L = 1 000 cm³, 1 kg = 1 000 g).' : 'Des g et des cm³ : des g/cm³ directement.'], duree: 70 };
  }

  /* ------------------------------------------------------------------ */
  /* La tare                                                             */
  /* ------------------------------------------------------------------ */
  function tare(rnd) {
    var e = echantillon(rnd, [250, 500, 750, 1000], function (x) { return x.liquide && x.rho !== 1; });
    var vide = rnd.entier(20, 60) * 10, plein = arr(vide + e.masse);
    return { famille: 'tare', enonce: '<p>Une bouteille vide pèse ' + b(fmt(vide) + ' g') + '. On y verse ' + b(fmt(e.V / 10) + ' cL') + ' d\'un liquide inconnu : elle pèse alors ' + b(fmt(plein) + ' g') + '. Quelle est la masse volumique du liquide, en ' + b('g/mL') + ' ?</p>',
             type: 'nombre', reponse: e.m.rho, unite: 'g/mL',
             etapes: ['La masse du liquide seul : ' + fmt(plein) + ' − ' + fmt(vide) + ' = ' + b(fmt(e.masse) + ' g') + '.',
                      'Son volume en mL : ' + fmt(e.V / 10) + ' cL = ' + b(fmt(e.V) + ' mL') + '.',
                      'ρ = m ÷ V = ' + fmt(e.masse) + ' ÷ ' + fmt(e.V) + ' = ' + b(fmt(e.m.rho) + ' g/mL') + ' : c\'est ' + e.m.le + '.'],
             indices: ['Masse du liquide = bouteille pleine − bouteille vide.', 'Des g/mL : il faut le volume en mL.'], duree: 80 };
  }

  /* ------------------------------------------------------------------ */
  MathsExos.register({
    id: 'pc-masse-volumique',
    competence: 'pc-masse-volumique',
    level: '5eme',
    titre: 'La masse volumique',
    paliers: 4,
    genere: function (rnd, palier) {
      var r = rnd.entier(1, 100);
      if (palier === 1) return r <= 45 ? notion(rnd, 1) : calculerRho(rnd, 1);
      if (palier === 2) return r <= 10 ? notion(rnd, 2) : r <= 30 ? calculerRho(rnd, 2) : r <= 45 ? calculerM(rnd, 2) : r <= 58 ? calculerV(rnd, 2) : r <= 73 ? convertirRho(rnd, 2) : r <= 88 ? flotte(rnd, 2) : piege(rnd, 2);
      if (palier === 3) return r <= 6 ? notion(rnd, 3) : r <= 24 ? calculerRho(rnd, 3) : r <= 36 ? calculerM(rnd, 3) : r <= 46 ? calculerV(rnd, 3) : r <= 58 ? convertirRho(rnd, 3) : r <= 74 ? piege(rnd, 3) : r <= 86 ? flotte(rnd, 3) : identifier(rnd, 3);
      return r <= 5 ? notion(rnd, 4) : r <= 20 ? calculerRho(rnd, 4) : r <= 32 ? calculerM(rnd, 4) : r <= 42 ? calculerV(rnd, 4) : r <= 54 ? convertirRho(rnd, 4) : r <= 70 ? piege(rnd, 4) : r <= 80 ? flotte(rnd, 4) : r <= 90 ? identifier(rnd, 4) : tare(rnd);
    }
  });
})();
