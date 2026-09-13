/*
 * La leçon « Racine carrée : la fonction carré retournée » (2nde).
 *
 * On rejoue l'animation dans un DOM et un JSXGraph simulés, et on refait le
 * travail à côté : le tableau de x² doit contenir les carrés (calculés ici,
 * pas relus), les points copiés doivent finir exactement en (x² ; x) — la
 * symétrie par rapport à y = x — et les doublons venus des x négatifs doivent
 * être marqués, puis barrés, puis absents du tableau nettoyé, qui doit être
 * celui de √x sur les carrés parfaits de 0 à 25. Aucun point ne doit rester
 * à gauche de l'axe des ordonnées ; la chaîne a → a² → √(a²) doit valoir |a|
 * pour tous les a du curseur ; et le rejeu doit être identique.
 */
load('tests/lecon-racine-carree-decor.js');

var err = [];
function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/−/g, '-').trim(); }
function cellules(h, cls) {
  var re = new RegExp('<td[^>]*class="' + cls + '[^"]*"[^>]*>([^<]*)<', 'g'), m, out = [];
  while ((m = re.exec(h))) out.push(m[1].replace(/−/g, '-'));
  return out;
}
function nbClasse(h, cls) { return (h.match(new RegExp('class="[^"]*\\b' + cls + '\\b', 'g')) || []).length; }

var tables = extras.children[0], panel = extras.children[1];
var t1 = tables.children[0], t2 = tables.children[1], t3 = tables.children[2];
var XS = []; for (var k = -5; k <= 5; k++) XS.push(k);
var pts = objets.filter(function (o) { return o.type === 'point'; });
var origines = pts.slice(0, 11), copies = pts.slice(11, 22);
function vis(o) { return o.attrs.visible === true; }
function etat() {
  return [t1.innerHTML, t2.innerHTML, t2.style.transform, t3.innerHTML, panel.innerHTML,
          objets.map(function (o) { return JSON.stringify(o.attrs) + (o.X ? o.X() + ',' + o.Y() : ''); }).join('|')].join('§');
}

if (!steps || steps.length !== 7) ko('il faut 7 étapes, pas ' + (steps && steps.length));
if (steps.some(function (s) { return !s.step || !s.after; })) ko('chaque étape doit avoir step et after');

/* ------------------------------------------------------------------ */
/* 1. Le tableau de x², colonne par colonne                              */
/* ------------------------------------------------------------------ */
remiseAZero();
if (txt(t1.innerHTML).indexOf('25') >= 0) ko('au départ, aucun carré ne doit être écrit');
if (t2.innerHTML !== '' || t3.innerHTML !== '') ko('au départ, la copie et le tableau de √x sont vides');
steps[0].step(0.5); board.update();
var demi = cellules(t1.innerHTML, 'fx-fx').filter(function (c) { return c !== ''; }).length;
if (demi !== 5) ko('à mi-course, ' + demi + ' carrés écrits au lieu de 5');
if (nbClasse(t1.innerHTML, 'is-hot') !== 2) ko('la colonne en cours n\'est pas surlignée');
steps[0].step(1); steps[0].after();
var xs = cellules(t1.innerHTML, 'fx-x'), fs = cellules(t1.innerHTML, 'fx-fx');
if (xs.join(',') !== XS.join(',')) ko('ligne des x : ' + xs.join(','));
if (fs.join(',') !== XS.map(function (x) { return x * x; }).join(',')) ko('ligne des carrés : ' + fs.join(','));

/* ------------------------------------------------------------------ */
/* 2 et 3. Les points (x ; x²), puis la courbe                           */
/* ------------------------------------------------------------------ */
steps[1].step(0.5); board.update();
if (origines.filter(vis).length !== 5) ko('à mi-course, ' + origines.filter(vis).length + ' points placés au lieu de 5');
steps[1].step(1); steps[1].after();
origines.forEach(function (p, i) {
  if (!vis(p)) ko('point ' + i + ' invisible après placement');
  if (p.X() !== XS[i] || p.Y() !== XS[i] * XS[i]) ko('point ' + i + ' en (' + p.X() + ' ; ' + p.Y() + ')');
});
var courbes = objets.filter(function (o) { return o.type === 'curve'; });
if (courbes.length !== 4) ko('4 courbes attendues (x² et sa copie, en deux branches), ' + courbes.length + ' trouvées');
steps[2].step(0.5); board.update();
if (Math.abs(courbes[0].tmax() - 2.5) > 1e-9 || Math.abs(courbes[1].tmin() + 2.5) > 1e-9)
  ko('à mi-tracé, la courbe de x² doit aller de −2,5 à 2,5');
steps[2].step(1); steps[2].after();
if (!vis(courbes[0]) || !vis(courbes[1])) ko('la courbe de x² n\'est pas visible une fois tracée');
if (vis(courbes[2]) || vis(courbes[3])) ko('la copie de la courbe ne doit pas exister avant la duplication');
[[3, 9], [-4, 16], [0, 0]].forEach(function (p) {
  var c = p[0] >= 0 ? courbes[0] : courbes[1], at = c.at(p[0]);
  if (at[0] !== p[0] || at[1] !== p[1]) ko('la courbe de x² passe par (' + at + ') au lieu de (' + p + ')');
});

/* ------------------------------------------------------------------ */
/* 4. La copie, posée exactement sur l'original                          */
/* ------------------------------------------------------------------ */
steps[3].step(1); steps[3].after();
copies.forEach(function (p, i) {
  if (!vis(p)) ko('copie ' + i + ' invisible');
  if (p.X() !== XS[i] || p.Y() !== XS[i] * XS[i]) ko('copie ' + i + ' pas sur l\'original');
});
if (cellules(t2.innerHTML, 'fx-fx').join(',') !== fs.join(',')) ko('la copie du tableau n\'est pas le tableau de x²');
if (t2.style.opacity !== '1') ko('la copie n\'est pas opaque une fois apparue : ' + t2.style.opacity);

/* ------------------------------------------------------------------ */
/* 5. Le retournement : (x ; x²) → (x² ; x), symétrie par rapport à y = x */
/* ------------------------------------------------------------------ */
steps[4].step(0.5); board.update();
copies.forEach(function (p, i) {
  var x = XS[i], mx = (x + x * x) / 2;
  if (Math.abs(p.X() - mx) > 1e-9 || Math.abs(p.Y() - mx) > 1e-9)
    ko('à mi-retournement, la copie ' + i + ' doit être sur la diagonale, en (' + mx + ' ; ' + mx + ')');
});
if (cellules(t2.innerHTML, 'fx-x').join(',') !== fs.join(',')) ko('à mi-retournement, le verso du tableau doit déjà montrer les carrés en entrée');
if (t2.style.transform !== 'rotateX(-90.0deg)') ko('à mi-retournement, la copie doit être de profil : ' + t2.style.transform);
steps[4].step(1); steps[4].after();
copies.forEach(function (p, i) {
  var x = XS[i];
  if (p.X() !== x * x || p.Y() !== x) ko('copie ' + i + ' finit en (' + p.X() + ' ; ' + p.Y() + ') au lieu de (' + x * x + ' ; ' + x + ')');
  if (p.X() < 0) ko('un point retourné a une abscisse négative : un carré ne l\'est jamais');
  var ghost = p.attrs.fillColor === '#ea580c';
  if (ghost !== (x < 0)) ko('copie ' + i + ' : ' + (ghost ? 'marquée doublon à tort' : 'doublon non marqué'));
});
if (t2.style.transform !== 'rotateX(0.0deg)') ko('une fois retournée, la copie doit être à plat : ' + t2.style.transform);
var xr = cellules(t2.innerHTML, 'fx-x'), fr = cellules(t2.innerHTML, 'fx-fx');
if (xr.join(',') !== fs.join(',') || fr.join(',') !== xs.join(',')) ko('le tableau retourné n\'a pas ses lignes échangées');
if (nbClasse(t2.innerHTML, 'is-ghost') !== 10) ko('les 5 colonnes venues d\'un x négatif (2 cases chacune) doivent être marquées : ' + nbClasse(t2.innerHTML, 'is-ghost'));
if (nbClasse(t2.innerHTML, 'is-rejete')) ko('rien ne doit être barré avant le rejet');
var c4 = courbes[2].at(4), c4n = courbes[3].at(-4);
if (c4[0] !== 16 || c4[1] !== 4) ko('la copie de la courbe doit passer par (16 ; 4), pas (' + c4 + ')');
if (c4n[0] !== 16 || c4n[1] !== -4) ko('la branche doublon passe par (' + c4n + ') au lieu de (16 ; −4)');
if (txt(panel.innerHTML).indexOf('9 sort deux fois') < 0) ko('le panneau doit nommer le problème : 9 sort deux fois');

/* ------------------------------------------------------------------ */
/* 6. Le rejet des doublons                                              */
/* ------------------------------------------------------------------ */
steps[5].step(0.5); board.update();
copies.forEach(function (p, i) {
  if (XS[i] < 0 && Math.abs(p.attrs.fillOpacity - 0.5) > 1e-9) ko('à mi-rejet, un doublon doit être à demi effacé');
  if (XS[i] >= 0 && p.attrs.fillOpacity !== 1) ko('le rejet ne doit pas toucher les points venus de x ⩾ 0');
});
steps[5].step(1); steps[5].after();
copies.forEach(function (p, i) {
  if (XS[i] < 0 && vis(p)) ko('doublon ' + i + ' encore visible après le rejet');
  if (XS[i] >= 0 && !vis(p)) ko('point ' + i + ' disparu avec les doublons');
});
if (vis(courbes[3])) ko('la branche doublon de la courbe doit disparaître');
if (!vis(courbes[2])) ko('la branche √x doit rester');
if (nbClasse(t2.innerHTML, 'is-rejete') !== 10) ko('les 10 cases doublons doivent être barrées : ' + nbClasse(t2.innerHTML, 'is-rejete'));
var p6 = txt(panel.innerHTML);
if (p6.indexOf('√9 = 3') < 0) ko('le panneau doit conclure √9 = 3');
if (!/aucun nombre négatif n'a de racine carrée/.test(p6)) ko('le panneau doit dire qu\'aucun nombre négatif n\'a de racine carrée');
var textes = objets.filter(function (o) { return o.type === 'text'; });
var labNo = textes.filter(function (t) { return t.texte() === 'pas de racine carrée'; })[0];
if (!labNo || !vis(labNo)) ko('la figure doit afficher « pas de racine carrée » à gauche de 0');
if (labNo && labNo.parents[0] >= 0) ko('« pas de racine carrée » doit être placé sur les abscisses négatives');

/* ------------------------------------------------------------------ */
/* 7. Le tableau de √x, nettoyé, et la chaîne a → a² → √(a²) = |a|       */
/* ------------------------------------------------------------------ */
steps[6].step(1); steps[6].after();
var x3 = cellules(t3.innerHTML, 'fx-x'), f3 = cellules(t3.innerHTML, 'fx-fx');
if (x3.join(',') !== '0,1,4,9,16,25') ko('tableau de √x, entrées : ' + x3.join(','));
if (f3.join(',') !== '0,1,2,3,4,5') ko('tableau de √x, sorties : ' + f3.join(','));
x3.forEach(function (v, i) {
  if (Math.sqrt(+v) !== +f3[i]) ko('√' + v + ' ≠ ' + f3[i]);
});
if (t3.innerHTML.indexOf('√x') < 0) ko('le tableau nettoyé doit s\'appeler √x');
var slider = (controles || []).filter(function (c) { return c.type === 'slider'; })[0];
if (!slider) ko('pas de curseur a');
else for (var a = slider.min; a <= slider.max; a += slider.step) {
  slider.onInput(a);
  var p = txt(panel.innerHTML), abs = Math.abs(a);
  if (p.indexOf('a = ' + String(a).replace('-', '-')) < 0) ko('a = ' + a + ' absent du panneau');
  if (p.indexOf('a² = ' + a * a) < 0) ko('a = ' + a + ' : a² = ' + a * a + ' absent');
  if (p.indexOf('√(a²) = √' + a * a + ' = ' + abs) < 0) ko('a = ' + a + ' : √(a²) = ' + abs + ' absent');
  if (p.indexOf('|a| = |' + String(a).replace('-', '-') + '| = ' + abs) < 0) ko('a = ' + a + ' : |a| = ' + abs + ' absent');
  if (p.indexOf('= ' + (-abs) + ' ') >= 0 && a < 0 && p.indexOf('pas ' + a) < 0) ko('a = ' + a + ' : une racine carrée négative dans le panneau');
  if (a < 0 && p.indexOf('effacé le signe') < 0) ko('a = ' + a + ' : il faut dire que le signe est effacé');
  // les deux points rouges : (a ; a²) sur x², (a² ; |a|) sur √x
  var pA = pts[22], pR = pts[23];
  if (!vis(pA) || !vis(pR)) ko('a = ' + a + ' : les points du curseur ne sont pas visibles à la fin');
  if (pA.X() !== a || pA.Y() !== a * a) ko('a = ' + a + ' : (a ; a²) en (' + pA.X() + ' ; ' + pA.Y() + ')');
  if (pR.X() !== a * a || pR.Y() !== abs) ko('a = ' + a + ' : (a² ; √(a²)) en (' + pR.X() + ' ; ' + pR.Y() + ')');
  if (pR.Y() < 0) ko('a = ' + a + ' : une racine carrée négative sur la figure');
}
slider.onInput(-3);

/* ------------------------------------------------------------------ */
/* Le rejeu est identique : « Précédent » repart du reset puis rejoue    */
/* ------------------------------------------------------------------ */
var refs = [];
remiseAZero();
steps.forEach(function (s) { s.step(0.3); board.update(); s.step(1); s.after(); refs.push(etat()); });
for (var passage = 0; passage < 3; passage++) {
  remiseAZero();
  steps.forEach(function (s, i) {
    s.step(1); s.after();
    if (etat() !== refs[i]) ko('passage ' + (passage + 2) + ' : le rejeu de l\'étape ' + (i + 1) + ' diffère du premier');
  });
}
remiseAZero();
if (copies.some(vis) || vis(courbes[2]) || t2.innerHTML !== '') ko('après remise à zéro, la copie doit avoir disparu');

if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE TABLEAU RETOURNÉ EST CELUI DE √x, LES DOUBLONS SONT REJETÉS ET √(a²) = |a| POUR LES 11 VALEURS DE a');
