/*
 * La leçon « Le volume et ses unités » (5ème, physique-chimie), montée avec
 * le VRAI JSXGraph (renderer « no »).
 *
 * Le cube est relu sur ses traits de découpe — 18 traits pour les tranches,
 * 36 pour les barres, 54 pour les petits cubes — et sur l'élément mis en
 * valeur, dont on remesure les dimensions en centimètres (1 × 10 × 10 pour
 * une tranche, 1 × 1 × 10 pour une barre, 1 × 1 × 1 pour un petit cube). Le
 * tableau est relu dans ses cellules : les chiffres par colonne, la virgule
 * par sa position, l'unité par l'en-tête (le litre sous le dm³, le mL sous le
 * cm³) ; le nombre reconstitué doit valoir le volume, dans l'unité de départ
 * puis d'arrivée, et le facteur affiché la bonne puissance de 10. Le principe
 * (1 L = 10 dL = 100 cL = 1 000 mL), chaque objet, chaque unité cible, et le
 * rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var H = monter('lessons/pc/5eme/volume.js');
var L = H.lecon, board = H.board;
var err = [];
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }

if (L.matiere !== 'pc' || L.category !== 'chimie' || L.level !== '5eme') ko('la leçon doit être en physique-chimie (pc), domaine chimie, niveau 5ème');
if (!L.exercices || L.exercices.indexOf('pc-volume') < 0) ko('la leçon doit mener aux exercices pc-volume');
if (avertissements.length) ko('le moteur se plaint de la déclaration : ' + avertissements[0]);
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);

/* La géométrie, telle que la figure l'expose. */
var TABLE = { x0: 0.3, w: 0.62, yHaut: 5.75, yGroupe: 5.15, yLitre: 4.6, yBas: 3.8 }, NCOL = 12, E = 0.5, K = 0.177;
var COL = { 'm³': 2, kL: 2, hL: 3, daL: 4, 'dm³': 5, L: 5, dL: 6, cL: 7, 'cm³': 8, mL: 8, 'mm³': 11 };
function enMm3(u) { return Math.pow(10, NCOL - 1 - COL[u]); }
var OBJETS = { 'une goutte d\'eau': [50, 'mm³'], 'un dé à jouer': [1, 'cm³'], 'une cuillère à café': [5, 'mL'], 'une canette': [33, 'cL'],
               'une brique de lait': [1, 'L'], 'une bouteille d\'eau': [1.5, 'L'], 'une boîte à chaussures': [6000, 'cm³'], 'un seau': [10, 'L'],
               'une baignoire': [200, 'L'], 'une piscine': [50, 'm³'] };
var CIBLE_DEFAUT = { 'mm³': 'mL', 'cm³': 'L', mL: 'cm³', cL: 'L', L: 'mL', 'm³': 'L' };
var UNITES_CIBLES = { 'mètres cubes': 'm³', 'décimètres cubes': 'dm³', 'litres': 'L', 'centilitres': 'cL', 'millilitres': 'mL', 'centimètres cubes': 'cm³' };
var NIVEAU_U = { L: 0, 'dm³': 0, dL: 1, cL: 2, mL: 3, 'cm³': 3, 'm³': -1, 'mm³': -1 };

var chips = H.chips();
if (chips.length !== 16) ko('dix objets et six unités attendus, ' + chips.length + ' pastilles');
Object.keys(OBJETS).forEach(function (n) { if (!H.chip(n)) ko('pas de pastille « ' + n + ' »'); });
Object.keys(UNITES_CIBLES).forEach(function (n) { if (!H.chip(n)) ko('pas de pastille « ' + n + ' »'); });
if (!H.controle('principe') || !H.controle('convertir') || !H.controle('reset')) ko('il manque un bouton (principe, convertir, reset)');
if (!H.steps || H.steps.length !== 4) ko('au chargement, le principe du cube doit être prêt : 4 étapes, ' + (H.steps ? H.steps.length : 'aucune'));
if (!H.parClasse('props-panel').length) ko('le panneau manque');

/* ------------------------------------------------------------------ */
/* Lecture de la figure                                                */
/* ------------------------------------------------------------------ */
// Les traits de découpe du cube : les courbes bleu nuit, découpées par les NaN.
function traits() {
  var n = 0;
  board.objectsList.forEach(function (o) {
    if (o.elType !== 'curve' || String(o.visProp.strokecolor) !== '#1e3a8a' || !o.dataX) return;
    for (var i = 0; i < o.dataX.length; i++) if (!isNaN(o.dataX[i]) && (i === 0 || isNaN(o.dataX[i - 1]))) n++;
  });
  return n;
}
// L'élément mis en valeur : { x, y, z } en cm, lu sur sa face avant et son dessus, ou null.
function enValeur() {
  var devant = null, dessus = null;
  board.objectsList.forEach(function (o) {
    if (o.elType !== 'curve' || !o.dataX) return;
    var f = String(o.visProp.fillcolor);
    if (f === '#fdba74') devant = o; else if (f === '#fed7aa') dessus = o;
  });
  if (!devant || !dessus) return { illisible: 'courbes absentes' };
  var xs = devant.dataX.filter(function (v) { return !isNaN(v); }), ys = devant.dataY.filter(function (v) { return !isNaN(v); });
  if (!xs.length) return null;
  var ex = (Math.max.apply(null, xs) - Math.min.apply(null, xs)) / E, ey = (Math.max.apply(null, ys) - Math.min.apply(null, ys)) / E;
  var xd = dessus.dataX.filter(function (v) { return !isNaN(v); });
  var ez = ((Math.max.apply(null, xd) - Math.min.apply(null, xd)) - ex * E) / K;
  return { x: Math.round(ex * 10) / 10, y: Math.round(ey * 10) / 10, z: Math.round(ez * 10) / 10 };
}
function legende() { return H.textes().filter(function (t) { return t.x < 0 && t.y > 4 && t.x > -8; }).map(function (t) { return t.t; }).join(' | '); }
function colonneDe(x) { return Math.floor((x - TABLE.x0) / TABLE.w); }
function enTete() {
  var groupes = [], litres = [];
  H.textes().forEach(function (t) {
    if (t.x < TABLE.x0 || t.x > TABLE.x0 + NCOL * TABLE.w) return;
    if (t.y > TABLE.yGroupe && t.y < TABLE.yHaut) groupes[Math.floor(colonneDe(t.x) / 3)] = t.t;
    else if (t.y > TABLE.yLitre && t.y < TABLE.yGroupe) litres[colonneDe(t.x)] = t.t;
  });
  return { groupes: groupes, litres: litres };
}
// Le nombre écrit dans le tableau : { valeur, unites (les noms possibles de la colonne de la virgule) } ou null.
function tableau() {
  var cells = [], virgule = null, et = enTete();
  H.textes().forEach(function (t) {
    if (t.x < TABLE.x0 - 0.05 || t.x > TABLE.x0 + NCOL * TABLE.w + 0.05) return;
    if (t.t === ',' && t.y < TABLE.yBas + 0.4 && t.y > TABLE.yBas) virgule = Math.round((t.x - TABLE.x0) / TABLE.w) - 1;
    else if (t.y > TABLE.yBas && t.y < TABLE.yLitre && /^\d$/.test(t.t)) cells[colonneDe(t.x)] = { c: t.t, col: String(t.o.visProp.strokecolor) };
  });
  var n = 0; for (var i = 0; i < NCOL; i++) if (cells[i]) n++;
  if (!n && virgule === null) return null;
  if (virgule === null) return { illisible: 'pas de virgule' };
  var unites = [];
  if (et.litres[virgule]) unites.push(et.litres[virgule]);
  if (virgule % 3 === 2 && et.groupes[(virgule - 2) / 3]) unites.push(et.groupes[(virgule - 2) / 3]);
  if (!unites.length) return { illisible: 'virgule derrière une colonne sans unité (' + virgule + ')' };
  var gauche = NCOL, droite = -1;
  for (i = 0; i < NCOL; i++) if (cells[i]) { gauche = Math.min(gauche, i); droite = Math.max(droite, i); }
  for (i = gauche; i <= droite; i++) if (!cells[i]) return { illisible: 'un trou dans les chiffres' };
  if (virgule < gauche || virgule > droite) return { illisible: 'la virgule est hors des chiffres' };
  var s = '';
  for (i = gauche; i <= droite; i++) s += cells[i].c + (i === virgule && i < droite ? '.' : '');
  var ajoutes = 0; for (i = 0; i < NCOL; i++) if (cells[i] && cells[i].col === '#c2410c') ajoutes++;
  return { valeur: parseFloat(s), col: virgule, unites: unites, texte: s.replace('.', ','), ajoutes: ajoutes, mm3: parseFloat(s) * Math.pow(10, NCOL - 1 - virgule) };
}
var RE_U = '(m³|dm³|cm³|mm³|kL|hL|daL|L|dL|cL|mL)';
function egalite() { return H.textes().filter(function (t) { return t.x > 0 && t.y > 2 && t.y < 3 && / = /.test(t.t); })[0]; }
function facteur() { return H.textes().filter(function (t) { return t.x > 0 && t.y > 2.8 && t.y < 3.3 && /^[×÷] /.test(t.t); })[0]; }
function instantane() { return JSON.stringify(H.textes().map(function (t) { return [t.t, +t.x.toFixed(4), +t.y.toFixed(4)]; }).concat([traits()])); }
function nu(t) { return t.replace(/^0+(?=\d)/, '').replace(/(,\d*?)0+$/, '$1').replace(/,$/, ''); }

/* Le découpage du cube attendu au niveau n. */
function controlerCube(nom, n) {
  var attendu = [0, 18, 36, 54][n < 0 ? 0 : n];
  if (traits() !== attendu) ko(nom + ' : ' + traits() + ' traits de découpe sur le cube, attendu ' + attendu);
  var e = enValeur();
  if (n < 0) { if (e) ko(nom + ' : rien ne doit être mis en valeur sur le cube'); return; }
  if (!e || e.illisible) { ko(nom + ' : l\'élément mis en valeur est illisible'); return; }
  var dims = [[10, 10, 10], [1, 10, 10], [1, 1, 10], [1, 1, 1]][n];
  if (e.x !== dims[0] || e.y !== dims[1] || e.z !== dims[2]) ko(nom + ' : l\'élément mis en valeur fait ' + e.x + ' × ' + e.y + ' × ' + e.z + ' cm, attendu ' + dims.join(' × '));
  var mots = ['1 L', '1 dL', '1 cL', '1 mL'];
  if (legende().indexOf(mots[n]) < 0) ko(nom + ' : la légende du cube devrait parler de ' + mots[n] + ' (' + legende() + ')');
}
/* Le tableau attendu : v dans u0, lu en u1. */
function controlerTableau(nom, mm3, u0, u1, converti) {
  var tb = tableau();
  if (!tb || tb.illisible) { ko(nom + ' : tableau illisible (' + (tb ? tb.illisible : 'vide') + ')'); return; }
  var u = converti ? u1 : u0;
  if (tb.unites.indexOf(u) < 0) ko(nom + ' : la virgule devrait être derrière la colonne ' + u + ', elle est derrière ' + tb.unites.join('/'));
  if (Math.abs(tb.mm3 - mm3) > 1e-6 * mm3) ko(nom + ' : le tableau dit ' + tb.texte + ' ' + tb.unites[0] + ', attendu ' + mm3 + ' mm³');
  var attenduTxt = (mm3 / enMm3(u)).toFixed(11).replace('.', ',');
  if (nu(tb.texte) !== nu(attenduTxt)) ko(nom + ' : le tableau écrit ' + tb.texte + ' ' + u + ', attendu ' + nu(attenduTxt));
  var sauts = COL[u1] - COL[u0], fa = facteur(), eg = egalite();
  if (!converti || !sauts) {
    if (tb.ajoutes) ko(nom + ' : pas de zéro ajouté ' + (converti ? 'quand la colonne ne change pas' : 'avant le glissement'));
    if (fa) ko(nom + ' : pas de facteur ' + (converti ? 'quand la colonne ne change pas' : 'avant le glissement'));
    // même colonne, autre nom (mL et cm³) : l'égalité dit qu'ils sont égaux ; même unité : rien
    if (converti && u1 !== u0) {
      if (!eg || eg.t !== nu(tb.texte) + ' ' + u0 + ' = ' + nu(tb.texte) + ' ' + u1) ko(nom + ' : l\'égalité devrait dire « ' + nu(tb.texte) + ' ' + u0 + ' = ' + nu(tb.texte) + ' ' + u1 + ' » (' + (eg ? eg.t : 'absente') + ')');
    } else if (eg) ko(nom + ' : pas d\'égalité ' + (converti ? 'quand l\'unité ne change pas' : 'avant le glissement') + ' (' + eg.t + ')');
    return;
  }
  if (!fa) ko(nom + ' : le facteur du saut manque');
  else {
    var fm = /^([×÷]) ([\d ]+)$/.exec(fa.t), attenduF = (sauts > 0 ? '×' : '÷') + ' ' + Math.pow(10, Math.abs(sauts));
    if (!fm || fm[1] + ' ' + lireNombre(fm[2]) !== attenduF) ko(nom + ' : facteur « ' + fa.t + ' », attendu ' + attenduF);
  }
  if (!eg) ko(nom + ' : l\'égalité manque');
  else {
    var em = new RegExp('^([\\d\\u202f,]+) ' + RE_U + ' = ([\\d\\u202f,]+) ' + RE_U + '$').exec(eg.t);
    if (!em) ko(nom + ' : égalité illisible « ' + eg.t + ' »');
    else {
      if (em[2] !== u0 || em[4] !== u1) ko(nom + ' : l\'égalité va de ' + em[2] + ' à ' + em[4] + ', attendu ' + u0 + ' → ' + u1);
      if (Math.abs(lireNombre(em[1]) * enMm3(em[2]) - mm3) > 1e-6 * mm3 || Math.abs(lireNombre(em[3]) * enMm3(em[4]) - mm3) > 1e-6 * mm3) ko(nom + ' : égalité fausse « ' + eg.t + ' »');
    }
  }
}

/* ------------------------------------------------------------------ */
/* 1. Le principe : 1 L = 10 dL = 100 cL = 1 000 mL                    */
/* ------------------------------------------------------------------ */
var joues = 0;
if (!err.length) {
  try {
    var SUITE = ['L', 'dL', 'cL', 'mL'];
    H.jouer(0);
    if (traits() !== 0 || enValeur()) ko('principe au départ : le cube entier, sans découpe ni mise en valeur');
    if (tableau()) ko('principe au départ : le tableau est vide');
    SUITE.forEach(function (u, k) {
      var nom = 'principe étape ' + (k + 1);
      H.remiseAZero(); for (var j = 0; j < k; j++) { H.steps[j].step(1); H.steps[j].after(); } H.steps[k].step(0.5); board.update(); H.sain(nom + ' (mi-course)', ko);
      H.jouer(k + 1);
      controlerCube(nom, k);
      controlerTableau(nom, 1e6, 'L', u, k > 0);
      if (!/dm/.test(H.panneau())) ko(nom + ' : le panneau doit parler de dm');
      joues++;
    });
    if (!/Trois longueurs, trois zéros/.test(H.panneau())) ko('la dernière étape du principe doit conclure : trois longueurs, trois zéros');
  } catch (ex) { ko('principe : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
}

/* ------------------------------------------------------------------ */
/* 2. Chaque objet, dans son unité par défaut puis dans chaque unité   */
/* ------------------------------------------------------------------ */
function controlerObjet(nom, v, u0, u1) {
  var mm3 = Math.round(v * enMm3(u0));
  if (!H.steps || H.steps.length !== 3) { ko(nom + ' : trois étapes attendues (unité, tableau, glisse), ' + (H.steps ? H.steps.length : 'aucune')); return; }
  try {
    H.jouer(0);
    if (tableau() || traits() || enValeur()) ko(nom + ' : au départ, ni tableau ni découpe');
    H.jouer(1);
    controlerCube(nom + ' (unité)', NIVEAU_U[u0]);
    if (tableau()) ko(nom + ' : le tableau attend l\'étape suivante');
    if (!/fois 1 /.test(H.panneau())) ko(nom + ' : le panneau doit dire « … fois 1 ' + u0 + ' »');
    H.jouer(2);
    controlerTableau(nom + ' (tableau)', mm3, u0, u1, false);
    H.remiseAZero(); H.steps[0].step(1); H.steps[0].after(); H.steps[1].step(1); H.steps[1].after(); H.steps[2].step(0.5); board.update(); H.sain(nom + ' (glissement)', ko);
    H.jouer(3);
    controlerTableau(nom + ' (converti)', mm3, u0, u1, true);
    var p = H.panneau(), sauts = COL[u1] - COL[u0];
    if (sauts && (p.indexOf('virgule') < 0 || p.indexOf(u1) < 0)) ko(nom + ' : le panneau doit parler de la virgule et de l\'unité ' + u1);
    if (!sauts && !/déjà|même chose/.test(p)) ko(nom + ' : le panneau doit dire que c\'est la même colonne');
    if (sauts < 0 && !/plus petit/.test(p)) ko(nom + ' : vers une unité plus grande, le nombre devient plus petit');
    if (sauts > 0 && !/davantage/.test(p)) ko(nom + ' : vers une unité plus petite, il en faut davantage');
    joues += 3;
  } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
}
if (!err.length) {
  Object.keys(OBJETS).forEach(function (n) {
    H.chip(n).onclick();
    controlerObjet(n, OBJETS[n][0], OBJETS[n][1], CIBLE_DEFAUT[OBJETS[n][1]]);
    if (H.chip(n).className.indexOf('active') < 0) ko('la pastille « ' + n + ' » doit être active');
  });
}
if (!err.length) {
  ['une canette', 'une piscine', 'un dé à jouer', 'une bouteille d\'eau'].forEach(function (n) {
    Object.keys(UNITES_CIBLES).forEach(function (nomU) {
      H.chip(n).onclick(); H.chip(nomU).onclick();
      controlerObjet(n + ' en ' + nomU, OBJETS[n][0], OBJETS[n][1], UNITES_CIBLES[nomU]);
      if (H.chip(nomU).className.indexOf('active') < 0) ko('la pastille « ' + nomU + ' » doit être active');
    });
  });
}

/* ------------------------------------------------------------------ */
/* 3. Rejouer redonne la même figure ; réinitialiser la vide           */
/* ------------------------------------------------------------------ */
if (!err.length) {
  H.chip('une canette').onclick(); H.jouer(3);
  var a = instantane();
  H.controle('principe').onClick(); H.jouer(4);
  H.chip('une canette').onclick(); H.jouer(3);
  if (a !== instantane()) ko('rejouer la canette ne redonne pas la même figure');
  H.controle('reset').onClick();
  if (H.steps) ko('réinitialiser doit annuler l\'animation');
  if (tableau() || traits() || enValeur()) ko('réinitialiser doit vider le tableau et recoller le cube');
  H.chips().forEach(function (c) { if (c.className.indexOf('active') >= 0) ko('réinitialisé, aucune pastille active'); });
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LE CUBE SE DÉCOUPE EN 10, 100, 1 000, LE TABLEAU DIT LE MÊME VOLUME DANS LES DEUX UNITÉS, LE LITRE SOUS LE dm³ (' + joues + ' ÉTAPES JOUÉES)');
