/*
 * La leçon « Équations quotient nul » (2nde).
 *
 * Les lignes du panneau sont relues dans l'ordre de la méthode : la valeur
 * interdite d'abord (celle du dénominateur, recalculée à côté), puis
 * « numérateur = 0 et x ≠ interdite », puis la valeur, puis S — qui doit être
 * {zéro du numérateur}, ou ∅ quand ce zéro est la valeur interdite. Sur la
 * figure, la branche gauche de l'hyperbole passe par 0 au zéro du numérateur,
 * le point vert final est posé dessus (et absent quand S = ∅), le point de
 * test dit « solution » exactement là et « interdite » sur la valeur
 * interdite. Le rejeu redonne le même écran.
 */
load('tests/lecon-equations-quotient-nul-decor.js');

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
if (!PX || SOL.length !== 1 || courbes.length !== 4 || !labP) ko('objets de la figure introuvables');
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
  var nom = ' [(' + a + 'x+' + b + ')/(' + c + 'x+' + d + ') = 0] ';
  function f1(x) { return a * x + b; } function f2(x) { return c * x + d; }
  var z1 = -b / a, z2 = -d / c, meme = Math.abs(z1 - z2) < 1e-9;
  function sol(x) { return Math.abs(f1(x)) < 1e-9 && Math.abs(f2(x)) > 1e-9; }

  remiseAZero();
  if (lignes().length !== 1) ko(nom + 'au départ, une seule ligne');
  steps.forEach(function (s, i) {
    s.step(0.5); s.step(1); s.after();
    var L = lignes();
    if (i === 0) {
      var mv = /^valeur interdite : .+ = 0 ⟺ x = (.+)$/.exec(L[1] || '');
      if (L.length !== 2 || !mv) return ko(nom + 'la première ligne doit être la valeur interdite : ' + L.join(' | '));
      if (Math.abs(nb(mv[1]) - z2) > 1e-9) ko(nom + 'valeur interdite annoncée ' + mv[1] + ' au lieu de ' + z2);
    }
    if (i === 1) {
      var mn = /^⟺ (.+) = 0 et x ≠ (.+)$/.exec(L[2] || '');
      if (L.length !== 3 || !mn) return ko(nom + 'après le numérateur : ' + L.join(' | '));
      if (Math.abs(nb(mn[2]) - z2) > 1e-9) ko(nom + 'la condition x ≠ doit viser la valeur interdite');
    }
    if (i === 2) {
      var mx = /^⟺ x = (.+?) et (.+)$/.exec(L[3] || '');
      if (L.length !== 4 || !mx) return ko(nom + 'après la courbe : ' + L.join(' | '));
      if (Math.abs(nb(mx[1]) - z1) > 1e-9) ko(nom + 'valeur ' + mx[1] + ' au lieu de ' + z1);
      if ((/interdit/.test(mx[2])) !== meme) ko(nom + 'la ligne doit dire si la valeur est interdite : ' + L[3]);
    }
  });
  var L = lignes(), fin = L[L.length - 1];
  if (meme) { if (fin !== 'S = ∅') ko(nom + 'S = ∅ attendu, lu ' + fin); }
  else {
    var mS = /^S = \{(.+)\}$/.exec(fin);
    if (!mS) return ko(nom + 'pas de S final : ' + fin);
    if (Math.abs(nb(mS[1]) - z1) > 1e-9) ko(nom + 'S = ' + fin + ' au lieu de {' + z1 + '}');
    if (!sol(nb(mS[1]))) ko(nom + 'la solution annoncée n\'annule pas le numérateur, ou annule le dénominateur');
  }
  if (!/interdit/.test(strip(noteEl.innerHTML))) ko(nom + 'la note finale doit nommer la valeur interdite');
  // la figure : la branche gauche de l'hyperbole, le point vert
  var LPg = courbes[2], LPd = courbes[3];
  if (!meme) {
    var br = z1 < z2 ? LPg : LPd;
    if (Math.abs(br.parents[0](z1)) > 1e-9) ko(nom + 'la courbe du quotient ne passe pas par 0 en ' + z1);
  }
  if (!visible(LPg) || !visible(LPd)) ko(nom + 'les deux branches doivent être visibles à la fin');
  if (LPg.parents[2]() >= z2 || LPd.parents[1]() <= z2) ko(nom + 'une branche traverse la valeur interdite');
  if (visible(SOL[0]) !== !meme) ko(nom + 'le point vert ' + (meme ? 'ne doit pas exister (S = ∅)' : 'manque'));
  if (!meme && Math.abs(SOL[0].X() - z1) > 1e-9) ko(nom + 'point vert en ' + SOL[0].X() + ' au lieu de ' + z1);
  // le point de test
  [z1, z1 + 0.5, z2, z2 - 1].forEach(function (x) {
    x = Math.round(x * 2) / 2;
    PX.setPosition(1, [x, 0]); PX._ev.drag();
    if ((/✓/.test(labP.texte())) !== sol(PX.X())) ko(nom + 'en x = ' + PX.X() + ', l\'étiquette dit ' + strip(labP.texte()));
    if (Math.abs(PX.X() - z2) < 1e-9 && !/interdite/.test(labP.texte())) ko(nom + 'sur la valeur interdite, l\'étiquette doit le dire');
    if ((/: solution/.test(strip(panel.innerHTML))) !== sol(PX.X())) ko(nom + 'en x = ' + PX.X() + ', le panneau se trompe');
  });
}
function rejouer(nom) {
  function tout() { remiseAZero(); steps.forEach(function (s) { s.step(0.3); s.step(1); s.after(); }); return etat(); }
  if (tout() !== tout()) ko(' [' + nom + '] le rejeu ne redonne pas le même écran');
}

var PRE = [[2, -4, -1, 3, '{2}'], [1, 1, 3, -2, '{−1}'], [1, 0, 1, -3, '{0}'], [-2, 5, 1, 4, '{5/2}'], [1, -1, 2, -2, '∅']];
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
else print('Équations quotient nul : ' + (5 + n) + ' résolutions relues, valeur interdite d\'abord, S confronté au zéro du numérateur, figure et rejeu vérifiés.');
