/*
 * La leçon « La masse volumique » (5ème, physique-chimie), montée avec le
 * VRAI JSXGraph (renderer « no »).
 *
 * La masse volumique de chaque matière est lue sur sa pastille, et tout le
 * reste est refait à côté : le côté du cube dessiné doit valoir ∛V, la
 * balance doit afficher ρ × V, le point rouge doit être en (V ; m) sur le
 * graphique — ses coordonnées sont retrouvées par les graduations des axes —,
 * la droite tracée doit passer par l'origine avec la pente ρ et ne pas bouger
 * quand V change, le quotient affiché doit valoir m ÷ V, le verdict « coule »
 * ou « flotte » doit suivre le signe de ρ − 1, et le panneau doit donner les
 * unités : le même nombre en g/mL et kg/L, mille fois plus en g/L et kg/m³.
 * Treize matières, trois volumes, et le rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var H = monter('lessons/pc/5eme/masse-volumique.js');
var L = H.lecon, board = H.board;
var err = [];
function ko(m) { if (err.length < 25 && err.indexOf(m) < 0) err.push(m); }

if (L.matiere !== 'pc' || L.category !== 'chimie' || L.level !== '5eme') ko('la leçon doit être en physique-chimie (pc), domaine chimie, niveau 5ème');
if (!L.exercices || L.exercices.indexOf('pc-masse-volumique') < 0) ko('la leçon doit mener aux exercices pc-masse-volumique');
if (avertissements.length) ko('le moteur se plaint de la déclaration : ' + avertissements[0]);
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);

var ECH = 0.42, CX = -4.6;
var chips = H.chips();
if (chips.length !== 13) ko('treize matières attendues, ' + chips.length + ' pastilles');
var MATIERES = {};
chips.forEach(function (c) {
  var m = /^(.+) \(([\d,]+)\)$/.exec(c.textContent || '');
  if (!m) ko('pastille illisible « ' + c.textContent + ' » : attendu « nom (ρ) »'); else MATIERES[m[1]] = lireNombre(m[2]);
});
['eau', 'huile', 'fer', 'or', 'liège', 'glace'].forEach(function (n) { if (!(n in MATIERES)) ko('pas de pastille « ' + n + ' »'); });
if (MATIERES.eau !== 1) ko('l\'eau doit faire 1 g/cm³');
var curseur = H.controle('volume');
if (!curseur || curseur.type !== 'slider' || curseur.min !== 10 || curseur.max !== 100 || curseur.step !== 10) ko('le curseur de volume doit aller de 10 à 100 cm³ par pas de 10');
if (!H.controle('mesurer') || !H.controle('reset')) ko('il manque un bouton (mesurer, reset)');
if (!H.steps || H.steps.length !== 4) ko('au chargement, quatre étapes attendues (volume, masse, quotient, eau), ' + (H.steps ? H.steps.length : 'aucune'));
if (!H.parClasse('props-panel').length) ko('le panneau manque');

/* ------------------------------------------------------------------ */
/* Lecture de la figure                                                */
/* ------------------------------------------------------------------ */
function vis(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
// Les échelles du graphique, d'après les graduations : les nombres sous l'axe (V) et à gauche (m).
function echelles() {
  var tx = [], ty = [];
  H.textes().forEach(function (t) {
    if (!/^[\d ]+$/.test(t.t)) return;
    if (t.x > 0.95 && t.y < -2.7) tx.push([lireNombre(t.t), t.x]);   // le « 0 » de l'origine, à gauche de l'axe, n'est pas une graduation
    else if (t.x < 1 && t.x > 0 && t.y > -2.7) ty.push([lireNombre(t.t), t.y]);
  });
  tx.sort(function (a, b) { return a[0] - b[0]; }); ty.sort(function (a, b) { return a[0] - b[0]; });
  if (tx.length < 3 || ty.length < 3) return null;
  var ax = (tx[tx.length - 1][1] - tx[0][1]) / (tx[tx.length - 1][0] - tx[0][0]), ox = tx[0][1] - ax * tx[0][0];
  var ay = (ty[ty.length - 1][1] - ty[0][1]) / (ty[ty.length - 1][0] - ty[0][0]), oy = ty[0][1] - ay * ty[0][0];
  return { V: function (x) { return (x - ox) / ax; }, m: function (y) { return (y - oy) / ay; }, ox: ox, oy: oy };
}
var E = echelles();
if (!E) ko('les graduations du graphique sont illisibles');
function point() {
  var p = null;
  board.objectsList.forEach(function (o) { if (o.elType === 'point' && vis(o) && o.visProp.size === 5) p = o; });
  return p ? { V: E.V(p.X()), m: E.m(p.Y()) } : null;
}
function droite() {
  var d = null;
  board.objectsList.forEach(function (o) {
    if (o.elType === 'curve' && o.dataX && o.dataX.length === 2 && !isNaN(o.dataX[0]) && o.dataX[0] > 0.5 && o.visProp.strokewidth === 2.2) d = o;
  });
  if (!d) return null;
  return { V0: E.V(d.dataX[0]), m0: E.m(d.dataY[0]), V1: E.V(d.dataX[1]), m1: E.m(d.dataY[1]) };
}
// Le cube : sa face avant est la courbe fermée la plus basse parmi les trois teintes de la matière.
function cube() {
  var faces = [];
  board.objectsList.forEach(function (o) {
    if (o.elType === 'curve' && vis(o) && o.dataX && o.dataX.length === 5 && o.dataX[0] < 0 && o.visProp.strokewidth === 1.2) faces.push(o);
  });
  if (faces.length !== 3) return null;
  var avant = faces[0];
  faces.forEach(function (f) { if (Math.min.apply(null, f.dataY) < Math.min.apply(null, avant.dataY) - 1e-9 || (Math.abs(Math.min.apply(null, f.dataY) - Math.min.apply(null, avant.dataY)) < 1e-9 && Math.min.apply(null, f.dataX) < Math.min.apply(null, avant.dataX))) avant = f; });
  var l = Math.max.apply(null, avant.dataX) - Math.min.apply(null, avant.dataX), h = Math.max.apply(null, avant.dataY) - Math.min.apply(null, avant.dataY);
  return { cote: l / ECH, carre: Math.abs(l - h) < 1e-9, fond: String(avant.visProp.fillcolor) };
}
function texte(re, filtre) { return H.textes().filter(function (t) { return re.test(t.t) && (!filtre || filtre(t)); }).map(function (t) { return t.t; }); }
function balance() { var t = texte(/ g$/, function (t) { return t.x < 0 && t.y < -2 && t.y > -3; }); return t.length ? lireNombre(t[0].replace(' g', '')) : null; }
function bilan() { return texte(/^ρ = /)[0] || ''; }
function titre() { return texte(/coule|flotte|proportionnels|c'est l'eau|en fonction du volume/, function (t) { return t.x > 0 && t.y > 5.5; })[0] || ''; }
function instantane() { return JSON.stringify(H.textes().map(function (t) { return [t.t, +t.x.toFixed(4), +t.y.toFixed(4)]; })); }
function fmtFr(v) { var p = String(v).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') + (p[1] ? ',' + p[1] : ''); }

/* ------------------------------------------------------------------ */
/* 1. Chaque matière, pour trois volumes                               */
/* ------------------------------------------------------------------ */
var joues = 0;
function controler(nom, rho, V) {
  var m = Math.round(rho * V * 100) / 100;
  if (!H.steps || H.steps.length !== 4) { ko(nom + ' : quatre étapes attendues'); return null; }
  try {
    H.jouer(0);
    if (point() || cube()) ko(nom + ' : au repos, ni cube ni point');
    if (bilan()) ko(nom + ' : au repos, pas de quotient');
    // 1. le volume
    H.remiseAZero(); H.steps[0].step(0.5); board.update(); H.sain(nom + ' (volume, mi-course)', ko);
    H.jouer(1);
    var c = cube();
    if (!c) ko(nom + ' : le cube manque après la mesure du volume');
    else {
      if (!c.carre) ko(nom + ' : la face avant du cube doit être un carré');
      if (Math.abs(c.cote - Math.cbrt(V)) > 1e-6) ko(nom + ' : le cube a ' + c.cote.toFixed(3) + ' cm de côté, attendu ∛' + V + ' = ' + Math.cbrt(V).toFixed(3));
    }
    if (!texte(new RegExp('^V = ' + V + ' cm³$')).length) ko(nom + ' : la cote « V = ' + V + ' cm³ » manque');
    if (balance() !== 0) ko(nom + ' : la balance doit afficher 0,00 g avant la pesée (' + balance() + ')');
    if (point()) ko(nom + ' : pas encore de point sur le graphique');
    if (!/Mesurer le volume/.test(H.panneau())) ko(nom + ' : le panneau doit titrer la mesure du volume');
    // 2. la masse
    H.remiseAZero(); H.steps[0].step(1); H.steps[0].after(); H.steps[1].step(0.5); board.update(); H.sain(nom + ' (pesée, mi-course)', ko);
    var mi = balance();
    if (mi === null || mi < 0 || mi > m + 1e-9) ko(nom + ' : pendant la pesée, l\'afficheur monte de 0 à m (' + mi + ')');
    H.jouer(2);
    var lu = balance();
    if (lu === null || Math.abs(lu - m) > 1e-9) ko(nom + ' : la balance affiche ' + lu + ' g, attendu ρ × V = ' + m + ' g');
    var p = point();
    if (!p) ko(nom + ' : le point (V ; m) manque');
    else if (Math.abs(p.V - V) > 0.2 || Math.abs(p.m - m) > 4) ko(nom + ' : le point est en (' + p.V.toFixed(1) + ' ; ' + p.m.toFixed(0) + '), attendu (' + V + ' ; ' + m + ')');
    if (droite()) ko(nom + ' : la droite attend l\'étape du quotient');
    if (!/Peser/.test(H.panneau()) || H.panneau().indexOf('m = ' + fmtFr(m) + ' g') < 0) ko(nom + ' : le panneau doit donner m = ' + fmtFr(m) + ' g');
    // 3. le quotient
    H.remiseAZero(); H.steps[0].step(1); H.steps[0].after(); H.steps[1].step(1); H.steps[1].after(); H.steps[2].step(0.5); board.update(); H.sain(nom + ' (quotient, mi-course)', ko);
    var dmi = droite();
    if (!dmi) ko(nom + ' : la droite se trace pendant l\'étape du quotient');
    else if (dmi.V1 > 51) ko(nom + ' : à mi-course la droite ne va pas plus loin que la moitié du graphique');
    H.jouer(3);
    var bi = /^ρ = ([\d ,]+) ÷ ([\d ,]+) = ([\d ,]+) g\/cm³$/.exec(bilan());
    if (!bi) ko(nom + ' : le quotient « ρ = m ÷ V = … g/cm³ » manque (' + bilan() + ')');
    else {
      if (Math.abs(lireNombre(bi[1]) - m) > 1e-9 || lireNombre(bi[2]) !== V) ko(nom + ' : le quotient divise ' + bi[1] + ' par ' + bi[2] + ', attendu ' + m + ' ÷ ' + V);
      if (Math.abs(lireNombre(bi[3]) - m / V) > 1e-6) ko(nom + ' : le quotient annonce ' + bi[3] + ', or ' + m + ' ÷ ' + V + ' = ' + (m / V));
      if (Math.abs(lireNombre(bi[3]) - rho) > 1e-9) ko(nom + ' : le quotient (' + bi[3] + ') n\'est pas la masse volumique de la pastille (' + rho + ')');
    }
    var d = droite();
    if (!d) ko(nom + ' : la droite manque');
    else {
      if (Math.abs(d.V0) > 0.2 || Math.abs(d.m0) > 4) ko(nom + ' : la droite doit partir de l\'origine (' + d.V0.toFixed(1) + ' ; ' + d.m0.toFixed(0) + ')');
      if (Math.abs(d.m1 / d.V1 - rho) > 0.02 * rho) ko(nom + ' : la pente de la droite vaut ' + (d.m1 / d.V1).toFixed(3) + ', attendu ρ = ' + rho);
      if (d.V1 < 99) ko(nom + ' : la droite doit aller jusqu\'au bord du graphique (V = 100)');
    }
    if (!/proportionnels/.test(titre())) ko(nom + ' : le titre du graphique doit parler de proportionnalité');
    if (!/proportionnels/.test(H.panneau()) || !/origine/.test(H.panneau())) ko(nom + ' : le panneau doit dire que m et V sont proportionnels, droite par l\'origine');
    // 4. l'eau et les unités
    H.jouer(4);
    var t = titre();
    if (rho > 1 && !/coule/.test(t)) ko(nom + ' : plus dense que l\'eau, ça coule (' + t + ')');
    if (rho < 1 && !/flotte/.test(t)) ko(nom + ' : moins dense que l\'eau, ça flotte (' + t + ')');
    if (rho === 1 && !/c'est l'eau/.test(t)) ko(nom + ' : l\'eau est la référence (' + t + ')');
    var pan = H.panneau(), r = fmtFr(rho), r1000 = fmtFr(Math.round(rho * 1000 * 1000) / 1000).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (pan.indexOf(r + ' g/cm³ = ' + r + ' g/mL = ' + r + ' kg/L') < 0) ko(nom + ' : le panneau doit dire ' + r + ' g/cm³ = ' + r + ' g/mL = ' + r + ' kg/L');
    if (pan.indexOf(r + ' g/mL = ' + r1000 + ' g/L') < 0) ko(nom + ' : le panneau doit dire ' + r + ' g/mL = ' + r1000 + ' g/L');
    if (pan.indexOf(r1000 + ' kg/m³') < 0) ko(nom + ' : le panneau doit donner ' + r1000 + ' kg/m³');
    if (!/mille fois trop léger/.test(pan)) ko(nom + ' : le panneau doit prévenir du piège g/L');
    if (rho > 1 && !/coule/.test(pan)) ko(nom + ' : le panneau doit dire que ça coule');
    if (rho < 1 && !/flotte/.test(pan)) ko(nom + ' : le panneau doit dire que ça flotte');
    var dr = droite();
    if (dr && Math.abs(dr.V1 - 100) > 0.2) ko(nom + ' : à la dernière étape la droite est entière');
    joues += 4;
    return { droite: dr, rho: bi ? lireNombre(bi[3]) : null };
  } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); return null; }
}
if (!err.length) {
  Object.keys(MATIERES).forEach(function (nom) {
    var resultats = [];
    [10, 50, 100].forEach(function (V) {
      H.chip(nom + ' (').onclick();
      curseur.onInput(V);
      var r = controler(nom + ', V = ' + V, MATIERES[nom], V);
      if (r) resultats.push(r);
      if (H.chip(nom + ' (').className.indexOf('active') < 0) ko('la pastille « ' + nom + ' » doit être active');
    });
    // la droite et le quotient ne dépendent pas du volume
    for (var i = 1; i < resultats.length; i++) {
      if (resultats[i].rho !== resultats[0].rho) ko(nom + ' : le quotient change avec le volume (' + resultats[0].rho + ' puis ' + resultats[i].rho + ')');
      if (resultats[i].droite && resultats[0].droite && (Math.abs(resultats[i].droite.m1 - resultats[0].droite.m1) > 1e-6)) ko(nom + ' : la droite doit être la même quel que soit le volume');
    }
  });
}

/* ------------------------------------------------------------------ */
/* 2. Rejouer redonne la même figure ; réinitialiser la vide           */
/* ------------------------------------------------------------------ */
if (!err.length) {
  H.chip('fer (').onclick(); curseur.onInput(30); H.jouer(4);
  var a = instantane();
  H.chip('huile (').onclick(); curseur.onInput(80); H.jouer(4);
  H.chip('fer (').onclick(); curseur.onInput(30); H.jouer(4);
  if (a !== instantane()) ko('rejouer le fer à 30 cm³ ne redonne pas la même figure');
  H.controle('reset').onClick();
  if (H.steps) ko('réinitialiser doit annuler l\'animation');
  if (cube() || point() || droite() || bilan()) ko('réinitialiser doit vider la figure');
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LE CUBE FAIT ∛V, LA BALANCE ρ × V, LE POINT EST SUR LA DROITE DE PENTE ρ PAR L\'ORIGINE, LES UNITÉS SONT DITES (' + joues + ' ÉTAPES JOUÉES)');
