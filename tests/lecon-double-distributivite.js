/*
 * La leçon « Double distributivité » (2nde), montée avec le VRAI JSXGraph
 * (renderer « no »).
 *
 * Le développement est refait à côté : les quatre produits ac, ad, bc, bd
 * relus au panneau (dans cet ordre, facteurs négatifs entre parenthèses)
 * doivent être les bons, la ligne calculée et la ligne réduite — relues
 * comme des polynômes — doivent valoir (ax + b)(cx + d) en plusieurs x, et
 * la forme réduite ne garde qu'un terme par degré (aucun terme en x quand
 * les produits croisés s'annulent). Sur la figure, les quatre cases pavent
 * exactement le rectangle, sans trou ni chevauchement, et sont à l'échelle :
 * la longueur dessinée pour x est la même sur les deux côtés ; chaque case
 * porte la valeur de SON produit ; les quatre flèches ne sont tracées
 * qu'une à une, la case et le produit de la liste n'apparaissant qu'avec
 * leur flèche. Rien n'est rempli avant la première flèche. La vérification
 * numérique du panneau est refaite pour plusieurs x. Les notes font le lien
 * avec les identités remarquables exactement quand il le faut. Préréglages,
 * saisie bornée (aucun terme nul), dé, rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
var H = monter('lessons/2nde/double-distributivite.js');
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);
var board = H.board;

function strip(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); }
function proche(u, v) { return Math.abs(u - v) < 1e-6; }
function nb(t) { return parseFloat(String(t).replace(/−/g, '-').replace(/\s/g, '').replace(',', '.')); }
// « 6x² − 8x − 3x + 4 » → une fonction de x, et la liste des degrés
function poly(t) {
  var s = String(t).replace(/−/g, '-').replace(/\s/g, '');
  var re = /([+-]?)(\d*)(x²|x)?/g, m, ts = [];
  while ((m = re.exec(s)) && m[0] !== '') {
    var k = (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : +m[2]);
    ts.push([k, m[3] === 'x²' ? 2 : m[3] === 'x' ? 1 : 0]);
  }
  if (ts.map(function (q) { return (q[0] < 0 ? '-' : '+') + Math.abs(q[0]) + q[1]; }).join('').length === 0) return null;
  return { ts: ts, f: function (x) { return ts.reduce(function (acc, q) { return acc + q[0] * Math.pow(x, q[1]); }, 0); } };
}
// un facteur écrit : « 2x », « (−4) », « (−x) » → [k, deg]
function facteurLu(t) {
  var m = /^\(?(−?)(\d*)(x?)\)?$/.exec(t.trim());
  if (!m) return null;
  if ((t.trim().charAt(0) === '(') !== (m[1] === '−')) return null;          // parenthèses si, et seulement si, négatif
  return [(m[1] ? -1 : 1) * (m[2] === '' ? 1 : +m[2]), m[3] ? 1 : 0];
}
function lignes() {
  var out = [], re = /<div class="eq-line( eq-sol)?">([\s\S]*?)<\/div>/g, m, h = H.parClasse('eq-lines')[0].innerHTML;
  while ((m = re.exec(h))) out.push(strip(m[2]));
  return out;
}
function note() { return strip(H.parClasse('eq-note')[0].innerHTML); }
function role(r) { return board.objectsList.filter(function (o) { return o.mvRole === r; }); }
function vu(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
function boite(pg) {
  var X = pg.vertices.slice(0, 4).map(function (p) { return p.X(); }), Y = pg.vertices.slice(0, 4).map(function (p) { return p.Y(); });
  return { x0: Math.min.apply(null, X), x1: Math.max.apply(null, X), y0: Math.min.apply(null, Y), y1: Math.max.apply(null, Y) };
}
function pleine(pg) { return pg.visProp.fillopacity > 0; }
function etat() {
  return [H.parClasse('eq-lines')[0].innerHTML, H.panneau(), note(),
          role('case').map(function (p) { var q = boite(p); return [q.x0, q.x1, q.y0, q.y1, p.visProp.fillopacity].join(','); }).join('|'),
          role('fleche').map(vu).join(','),
          H.textes().map(function (t) { return t.t + '@' + t.x.toFixed(4) + ',' + t.y.toFixed(4); }).join('|')].join('§');
}

var presets = H.parClasse('ineq-preset'), rand = H.parClasse('eq-rand')[0];
var inA = H.parClasse('eq-a')[0], inB = H.parClasse('eq-b')[0], inC = H.parClasse('eq-c')[0], inD = H.parClasse('eq-d')[0], inX = H.parClasse('dd-x')[0];
if (presets.length !== 6 || !rand || !inA || !inB || !inC || !inD || !inX) ko('6 préréglages, 4 champs, la valeur de x et un dé attendus');
var n = 0, vus = { carre: 0, conj: 0, negatif: 0, positif: 0 };

function verifier(a, b, c, d) {
  var nom = ' [(' + a + 'x+' + b + ')(' + c + 'x+' + d + ')] ';
  function F(x) { return (a * x + b) * (c * x + d); }
  var PROD = [[a, 1, c, 1], [a, 1, d, 0], [b, 0, c, 1], [b, 0, d, 0]];
  n++;
  if (!H.steps || H.steps.length !== 7) return ko(nom + '7 étapes attendues');

  // avant la première étape : rien de rempli, aucune flèche, une seule ligne
  H.remiseAZero(); board.update();
  var cases = role('case'), fl = role('fleche');
  if (cases.length !== 4 || fl.length !== 4) return ko(nom + '4 cases et 4 flèches attendues');
  if (cases.some(pleine) || fl.some(vu)) ko(nom + 'rien ne doit être rempli ni fléché avant la première étape');
  if (lignes().length !== 1) ko(nom + 'au départ, une seule ligne');
  if (role('produit').some(vu) || vu(role('brut')[0]) || vu(role('reduit')[0])) ko(nom + 'la colonne de droite doit être vide au départ');

  // le pavage : quatre cases, à l'échelle
  var B = cases.map(boite);
  var W1 = B[0].x1 - B[0].x0, W2 = B[2].x1 - B[2].x0, H1 = B[0].y1 - B[0].y0, H2 = B[1].y1 - B[1].y0;
  if (!proche(B[1].x0, B[0].x0) || !proche(B[1].x1, B[0].x1) || !proche(B[3].x0, B[2].x0) || !proche(B[3].x1, B[2].x1)) ko(nom + 'les colonnes ne sont pas alignées');
  if (!proche(B[2].y0, B[0].y0) || !proche(B[2].y1, B[0].y1) || !proche(B[3].y0, B[1].y0) || !proche(B[3].y1, B[1].y1)) ko(nom + 'les rangées ne sont pas alignées');
  if (!proche(B[0].x1, B[2].x0) || !proche(B[0].y0, B[1].y1)) ko(nom + 'les cases ne se touchent pas : trou ou chevauchement');
  if (W1 <= 0 || W2 <= 0 || H1 <= 0 || H2 <= 0) ko(nom + 'une case est vide');
  var xLargeur = (W1 / Math.abs(a)) / (W2 / Math.abs(b)), xHauteur = (H1 / Math.abs(c)) / (H2 / Math.abs(d));
  if (!proche(xLargeur, xHauteur)) ko(nom + 'x n\'a pas la même longueur sur les deux côtés : ' + xLargeur + ' et ' + xHauteur);
  if (B[0].x0 < 0 || B[2].x1 > 640 || B[1].y0 < 0 || B[0].y1 > 480) ko(nom + 'le rectangle sort de la figure');

  // les quatre flèches, une à une
  for (var i = 0; i < 4; i++) {
    H.jouer(2 + i);
    if (fl.filter(vu).length !== i + 1 || cases.filter(pleine).length !== i + 1 || role('produit').filter(vu).length !== i + 1) ko(nom + 'à la flèche ' + (i + 1) + ', il faut ' + (i + 1) + ' flèche(s), case(s) et produit(s)');
    if (!pleine(cases[i])) ko(nom + 'la flèche ' + (i + 1) + ' ne remplit pas sa case');
    var L = lignes();
    if (L.length !== 2) { ko(nom + 'deux lignes pendant les flèches'); continue; }
    var ts = L[1].replace(/^= /, '').replace(/ \+ …$/, '').split(' + ');
    if (ts.length !== i + 1) ko(nom + 'la ligne des produits en compte ' + ts.length + ' au lieu de ' + (i + 1) + ' : ' + L[1]);
    if ((i < 3) !== / \+ …$/.test(L[1])) ko(nom + 'les points de suspension : ' + L[1]);
    ts.forEach(function (t, j) {
      var f = t.split(' × ').map(facteurLu), q = PROD[j];
      if (f.length !== 2 || !f[0] || !f[1]) return ko(nom + 'produit illisible : ' + t);
      if (f[0][0] !== q[0] || f[0][1] !== q[1] || f[1][0] !== q[2] || f[1][1] !== q[3]) ko(nom + 'le produit n° ' + (j + 1) + ' est ' + t);
    });
  }
  // chaque case porte la valeur de son produit
  var E = role('etiquette-case');
  E.forEach(function (e, i) {
    var q = PROD[i], k = q[0] * q[2], deg = q[1] + q[3], p = poly(e.plaintext), bx = B[i];
    if (!p || p.ts.length !== 1 || p.ts[0][0] !== k || p.ts[0][1] !== deg) ko(nom + 'la case ' + (i + 1) + ' affiche ' + e.plaintext);
    if (e.X() < bx.x0 || e.X() > bx.x1 || e.Y() < bx.y0 || e.Y() > bx.y1) ko(nom + 'l\'étiquette ' + (i + 1) + ' n\'est pas dans sa case');
  });

  // le calcul, puis la réduction
  H.jouer(6);
  var L = lignes();
  if (L.length !== 3) return ko(nom + 'après le calcul, trois lignes');
  var brut = poly(L[2].replace(/^= /, ''));
  if (!brut || brut.ts.length !== 4) return ko(nom + 'la ligne calculée doit avoir 4 termes : ' + L[2]);
  brut.ts.forEach(function (t, i) { var q = PROD[i]; if (t[0] !== q[0] * q[2] || t[1] !== q[1] + q[3]) ko(nom + 'terme n° ' + (i + 1) + ' faux : ' + L[2]); });
  if (strip(role('brut')[0].plaintext) !== L[2]) ko(nom + 'la somme de la figure n\'est pas celle du panneau');
  if (vu(role('reduit')[0])) ko(nom + 'la forme réduite arrive trop tôt');
  role('produit').forEach(function (t, i) { var q = PROD[i], m = / = (.+)$/.exec(t.plaintext), p = m && poly(m[1]); if (!p || p.ts[0][0] !== q[0] * q[2]) ko(nom + 'le produit de la liste n\'est pas calculé : ' + t.plaintext); });

  H.jouer(7);
  L = lignes();
  if (L.length !== 4) return ko(nom + 'à la fin, quatre lignes');
  var red = poly(L[3].replace(/^= /, ''));
  if (!red) return ko(nom + 'forme réduite illisible : ' + L[3]);
  [-3, -1, 0, 0.5, 2, 7].forEach(function (x) { if (!proche(red.f(x), F(x)) || !proche(brut.f(x), F(x))) ko(nom + 'en x = ' + x + ', le développement ne vaut pas le produit'); });
  var degs = red.ts.map(function (t) { return t[1]; });
  if (degs.some(function (g, i) { return degs.indexOf(g) !== i; })) ko(nom + 'la forme n\'est pas réduite : ' + L[3]);
  if (red.ts.some(function (t) { return t[0] === 0; })) ko(nom + 'un terme nul est écrit : ' + L[3]);
  if ((a * d + b * c === 0) !== (degs.indexOf(1) < 0)) ko(nom + 'le terme en x : ' + L[3]);
  if (strip(role('reduit')[0].plaintext) !== L[3] || !vu(role('reduit')[0])) ko(nom + 'la forme réduite de la figure n\'est pas celle du panneau');
  var carre = a === c && b === d, conj = a === c && b === -d, N = note();
  if ((/identité remarquable/.test(N)) !== (carre || conj)) ko(nom + 'le lien avec les identités remarquables : ' + N);
  if (carre && !/²/.test(N)) ko(nom + 'un carré doit être nommé');
  if (conj && !/a² − b²/.test(N)) ko(nom + 'a² − b² doit être nommé');
  if (carre) vus.carre++; if (conj) vus.conj++;
  if (a < 0 || b < 0 || c < 0 || d < 0) vus.negatif++; else vus.positif++;

  // la vérification numérique
  [2, -3, 0].forEach(function (x) {
    inX.value = String(x); inX.onchange();
    var P = strip(H.panneau()), m = /Forme factorisée : (.+?) × \(?(.+?)\)? = (.+?)\. ?Forme développée : .* = (.+?) : le même nombre/.exec(P);
    if (!m) return ko(nom + 'vérification illisible : ' + P.slice(-200));
    if (nb(m[1]) !== a * x + b || nb(m[2]) !== c * x + d || nb(m[3]) !== F(x) || nb(m[4]) !== F(x)) ko(nom + 'vérification fausse en x = ' + x + ' : ' + m[0]);
  });
  inX.value = '2'; inX.onchange();
  var e1 = etat(); H.jouer(7);
  if (etat() !== e1) ko(nom + 'le rejeu ne redonne pas le même écran');
  H.sain(nom, ko);
}

var PRE = [[2, 3, 1, 4, '2x² + 11x + 12'], [1, 3, 1, 2, 'x² + 5x + 6'], [2, -1, 3, -4, '6x² − 11x + 4'], [1, -3, 1, 5, 'x² + 2x − 15'],
           [-1, 2, 3, -1, '−3x² + 7x − 2'], [1, -3, 1, 3, 'x² − 9']];
PRE.forEach(function (p, i) {
  presets[i].onclick();
  if (presets[i].className.indexOf('active') < 0) ko('le préréglage ' + (i + 1) + ' ne s\'allume pas');
  verifier(p[0], p[1], p[2], p[3]);
  var L = lignes();
  if (L[L.length - 1] !== '= ' + p[4]) ko('préréglage ' + (i + 1) + ' : ' + L[L.length - 1] + ' au lieu de = ' + p[4]);
});
[-3, 1, 2].forEach(function (a) { [-2, 3].forEach(function (c) { [-6, -1, 5].forEach(function (b) { [-5, 1, 6].forEach(function (d) {
  inA.value = a; inB.value = b; inC.value = c; inD.value = d; inA.onchange();
  verifier(a, b, c, d);
}); }); }); });
// un carré saisi à la main
inA.value = 2; inB.value = -3; inC.value = 2; inD.value = -3; inA.onchange(); verifier(2, -3, 2, -3);
// aucun terme nul, et des bornes
inA.value = 0; inB.value = 0; inC.value = 9; inD.value = -40; inA.onchange();
if (+inA.value === 0 || +inB.value === 0 || +inC.value !== 3 || +inD.value !== -6) ko('la saisie doit refuser les termes nuls et borner les coefficients : ' + [inA.value, inB.value, inC.value, inD.value]);
for (var r = 0; r < 40; r++) {
  rand.onclick();
  var v = [+inA.value, +inB.value, +inC.value, +inD.value];
  if (v.some(function (q) { return q === 0 || isNaN(q); })) ko('le dé tire un terme nul');
  if (r < 3) verifier(v[0], v[1], v[2], v[3]);
}
if (!vus.carre || !vus.conj || !vus.negatif || !vus.positif) ko('cas non rencontrés : ' + JSON.stringify(vus));
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Double distributivité : ' + n + ' développements refaits (4 produits, calcul, réduction), pavage à l\'échelle, flèches une à une, vérification numérique et rejeu.');
