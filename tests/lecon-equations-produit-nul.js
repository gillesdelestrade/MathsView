/*
 * La leçon « Équations produit nul » (2nde).
 *
 * Les lignes écrites au panneau sont relues : la ligne « ou » doit poser les
 * deux facteurs = 0, la suivante donner les deux valeurs, et l'ensemble S
 * final — reparsé, fractions comprises — doit être exactement l'ensemble des
 * zéros recalculés à côté, chacun annulant bien le produit ; le même zéro en
 * haut et en bas ne doit être écrit qu'une fois. Le trinôme « développé »
 * montré pour dissuader est recalculé coefficient par coefficient. Sur la
 * figure, la courbe du produit doit passer par 0 aux zéros, les points verts
 * finaux être posés dessus, et le point de test dire « solution » exactement
 * là. Le piège de la simplification par x doit être signalé quand un facteur
 * est x, et seulement alors. Le rejeu redonne le même écran.
 */
load('tests/lecon-equations-produit-nul-decor.js');

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function strip(h) { return String(h).replace(/<span class="eq-frac"><span class="eq-num">([^<]*)<\/span><span class="eq-den">([^<]*)<\/span><\/span>/g, '$1/$2').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function nb(t) {
  t = String(t).replace(/−/g, '-').replace(',', '.').trim();
  var m = /^(-?)(\d+)\/(\d+)$/.exec(t);
  return m ? (m[1] ? -1 : 1) * +m[2] / +m[3] : parseFloat(t);
}
var linesEl = parClasse('eq-lines')[0], noteEl = parClasse('eq-note')[0], panel = parClasse('props-panel')[0];
var inA = parClasse('eq-a')[0], inB = parClasse('eq-b')[0], inC = parClasse('eq-c')[0], inD = parClasse('eq-d')[0];
var presets = parClasse('ineq-preset'), rands = parClasse('eq-rand');
if (presets.length !== 5 || rands.length !== 1) ko('5 préréglages et 1 dé attendus');
var PX = objets.filter(function (o) { return o.type === 'point' && o.attrs.fixed === false; })[0];
var SOL = objets.filter(function (o) { return o.type === 'point' && o.attrs.size === 6 && o.attrs.fixed === true; });
var courbes = objets.filter(function (o) { return o.type === 'functiongraph'; });
var labP = objets.filter(function (o) { return o.type === 'text' && typeof o.parents[2] === 'function' && /✓|✗/.test(o.texte()); })[0];
if (!PX || SOL.length !== 2 || courbes.length !== 3 || !labP) ko('objets de la figure introuvables');
function lignes() {
  var out = [], re = /<div class="eq-line( eq-sol)?">([\s\S]*?)<\/div>/g, m;
  while ((m = re.exec(linesEl.innerHTML))) out.push(strip(m[2]));
  return out;
}
function etat() {
  return [linesEl.innerHTML, noteEl.innerHTML, panel.innerHTML, PX.X(), labP.texte(),
          objets.map(function (o) { return JSON.stringify(o.attrs); }).join('|')].join('§');
}
// « -2x² + 10x - 12 » → [A, B, C]
function trinome(t) {
  t = t.replace(/−/g, '-').replace(/\s/g, '');
  var A = /^(-?\d*)x²/.exec(t), B = /([+-]\d*)x(?!²)/.exec(t), C = /([+-]\d+)$/.exec(t);
  function k(m, def) { if (!m) return 0; var v = m[1]; return v === '' || v === '+' ? 1 : v === '-' ? -1 : +v; }
  return [k(A), B ? k(B) : 0, C ? +C[1] : 0];
}

function verifier(a, b, c, d) {
  var nom = ' [(' + a + 'x+' + b + ')(' + c + 'x+' + d + ') = 0] ';
  function f1(x) { return a * x + b; } function f2(x) { return c * x + d; }
  var z1 = -b / a, z2 = -d / c, meme = Math.abs(z1 - z2) < 1e-9;
  var zs = meme ? [z1] : [Math.min(z1, z2), Math.max(z1, z2)];

  remiseAZero();
  if (lignes().length !== 1) ko(nom + 'au départ, une seule ligne');
  steps.forEach(function (s, i) {
    s.step(0.5); s.step(1); s.after();
    var L = lignes();
    if (i === 0) {
      if (L.length !== 2 || !/ ou /.test(L[1])) return ko(nom + 'après la règle, la ligne « ou » manque : ' + L.join(' | '));
      var deux = L[1].replace(/^⟺ /, '').split(' ou ');
      if (deux.length !== 2 || !/= 0$/.test(deux[0]) || !/= 0$/.test(deux[1])) ko(nom + 'la ligne « ou » doit poser deux facteurs = 0 : ' + L[1]);
      var pi = /simplifi/.test(strip(noteEl.innerHTML));
      if (pi !== (b === 0 || d === 0)) ko(nom + 'le piège de la simplification par x est ' + (pi ? 'signalé à tort' : 'oublié'));
    }
    if (i === 1 && !(L.length === 3 && /^⟺ x = .+ ou …$/.test(L[2]))) ko(nom + 'après le premier facteur : ' + L[2]);
    if (i === 2) {
      var mx = /^⟺ x = (.+?) ou x = (.+?)$/.exec(L[2]);
      if (!mx) return ko(nom + 'après le second facteur : ' + L[2]);
      if (Math.abs(nb(mx[1]) - z1) > 1e-9 || Math.abs(nb(mx[2]) - z2) > 1e-9) ko(nom + 'les valeurs ' + mx[1] + ' et ' + mx[2] + ' ne sont pas ' + z1 + ' et ' + z2);
    }
  });
  var L = lignes(), fin = L[L.length - 1];
  var mS = /^S = \{(.*)\}$/.exec(fin);
  if (!mS) return ko(nom + 'pas de S final : ' + fin);
  var vals = mS[1].split(' ; ').map(nb);
  if (vals.length !== zs.length || vals.some(function (v, i) { return Math.abs(v - zs[i]) > 1e-9; })) ko(nom + 'S = ' + fin + ' au lieu des zéros ' + zs.join(' ; '));
  vals.forEach(function (v) { if (Math.abs(f1(v) * f2(v)) > 1e-9) ko(nom + 'la solution annoncée ' + v + ' n\'annule pas le produit'); });
  // le trinôme développé
  var md = /Développé, cela donnerait (.*?) = 0/.exec(strip(panel.innerHTML));
  if (!md) ko(nom + 'le développé manque au panneau');
  else {
    var T = trinome(md[1]);
    if (T[0] !== a * c || T[1] !== a * d + b * c || T[2] !== b * d) ko(nom + 'développé faux : ' + md[1] + ' lu ' + T + ' au lieu de ' + [a * c, a * d + b * c, b * d]);
  }
  // la figure
  var LP = courbes[2];
  zs.forEach(function (z) { if (Math.abs(LP.parents[0](z)) > 1e-9) ko(nom + 'la courbe du produit ne passe pas par 0 en ' + z); });
  if (!visible(LP)) ko(nom + 'la courbe du produit est invisible à la fin');
  var vus = SOL.filter(visible);
  if (vus.length !== zs.length) ko(nom + vus.length + ' point(s) vert(s) pour ' + zs.length + ' solution(s)');
  vus.forEach(function (s, i) { if (Math.abs(s.X() - zs[i]) > 1e-9) ko(nom + 'point vert en ' + s.X() + ' au lieu de ' + zs[i]); });
  if ((b === 0 || d === 0) && !/perdre la solution/.test(strip(noteEl.innerHTML))) ko(nom + 'la note finale doit rappeler la solution 0 sauvée');
  // le point de test
  [zs[0], zs[0] + 0.5, zs[zs.length - 1], zs[zs.length - 1] - 1].forEach(function (x) {
    x = Math.round(x * 2) / 2;
    PX.setPosition(1, [x, 0]); PX._ev.drag();
    var sol = Math.abs(f1(PX.X()) * f2(PX.X())) < 1e-9;
    if ((/✓/.test(labP.texte())) !== sol) ko(nom + 'en x = ' + PX.X() + ', l\'étiquette dit ' + strip(labP.texte()));
    if ((/: solution/.test(strip(panel.innerHTML))) !== sol) ko(nom + 'en x = ' + PX.X() + ', le panneau se trompe');
  });
}
function rejouer(nom) {
  function tout() { remiseAZero(); steps.forEach(function (s) { s.step(0.3); s.step(1); s.after(); }); return etat(); }
  if (tout() !== tout()) ko(' [' + nom + '] le rejeu ne redonne pas le même écran');
}

var PRE = [[2, -4, -1, 3, '{2 ; 3}'], [1, 1, 3, -2, '{−1 ; 2/3}'], [1, 0, 1, -3, '{0 ; 3}'], [-2, 5, 1, 4, '{−4 ; 5/2}'], [1, -1, 2, -2, '{1}']];
PRE.forEach(function (p, i) {
  presets[i].onclick();
  if (presets[i].className.indexOf('active') < 0) ko('le préréglage ' + (i + 1) + ' ne s\'allume pas');
  verifier(p[0], p[1], p[2], p[3]);
  var L = lignes();
  if (L[L.length - 1] !== 'S = ' + p[4]) ko('préréglage ' + (i + 1) + ' : ' + L[L.length - 1] + ' au lieu de S = ' + p[4]);
  rejouer('préréglage ' + (i + 1));
});
var n = 0;
[-2, -1, 1, 3].forEach(function (a) { [-2, 1, 2].forEach(function (c) { [-4, -1, 0, 2, 5].forEach(function (b) { [-4, 0, 2, 3].forEach(function (d) {
  inA.value = a; inB.value = b; inC.value = c; inD.value = d; inA.onchange();
  verifier(a, b, c, d); n++;
}); }); }); });
inA.value = 0; inA.onchange();
if (parseInt(inA.value, 10) === 0) ko('un coefficient nul doit être refusé');

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Équations produit nul : ' + (5 + n) + ' résolutions relues, S confronté aux zéros, développé recalculé, figure et rejeu vérifiés.');
