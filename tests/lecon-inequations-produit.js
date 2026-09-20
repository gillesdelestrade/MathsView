/*
 * La leçon « Inéquations produit » (2nde).
 *
 * Le tableau de signes écrit au panneau est REFAIT à côté : les zéros de
 * l'en-tête sont recalculés, chaque signe de chaque ligne est confronté à la
 * valeur du facteur (ou du produit) au milieu de la colonne, et les 0 doivent
 * être exactement sous les zéros du bon facteur. L'ensemble S annoncé est
 * reparsé par le lecteur d'intervalles du site, puis confronté à l'inéquation
 * évaluée en une grille de points — sur les zéros, juste à côté, loin. Sur la
 * figure, les cellules des trois bandes ont la couleur de leur signe, et les
 * traits verts de l'axe couvrent exactement les morceaux de S. Le point de
 * test dit vrai. Le zéro double est balayé comme les autres. Et le rejeu
 * redonne le même écran.
 */
load('tests/lecon-inequations-produit-decor.js');
var window = this; load('js/reponse.js');

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function strip(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function nb(t) {
  t = String(t).replace(/−/g, '-').replace(',', '.').trim();
  var m = /^(-?\d+)\/(\d+)$/.exec(t);
  return m ? +m[1] / +m[2] : parseFloat(t);
}

var tableEl = parClasse('sg-wrap')[0], noteEl = parClasse('eq-note')[0], panel = parClasse('props-panel')[0];
var inA = parClasse('eq-a')[0], inB = parClasse('eq-b')[0], inC = parClasse('eq-c')[0], inD = parClasse('eq-d')[0];
var sel = parClasse('ineq-sel')[0], presets = parClasse('ineq-preset'), rands = parClasse('eq-rand');
if (presets.length !== 5 || rands.length !== 1) ko('5 préréglages et 1 dé attendus');
var PX = objets.filter(function (o) { return o.type === 'point' && o.attrs.fixed === false; })[0];
var labP = objets.filter(function (o) { return o.type === 'text' && o.attrs.fontSize === 12 && typeof o.parents[2] === 'function' && /✓|✗/.test(o.texte()); })[0];
var ROWS = { f1: -7.7, f2: -8.9, prod: -10.1 };
function cellules(key) {
  return objets.filter(function (o) { return o.type === 'text' && o.attrs.fontSize === 17 && o.parents[1] === ROWS[key]; });
}
function polys(key) {
  return objets.filter(function (o) { return o.type === 'polygon' && o.parents[0].Y && Math.abs(o.parents[0].Y() - (ROWS[key] - 0.42)) < 1e-9; });
}
function zerosBande(key) {
  return objets.filter(function (o) { return o.type === 'text' && o.attrs.fontSize === 15 && o.parents[1] === ROWS[key]; });
}
var segsSol = objets.filter(function (o) { return o.type === 'segment' && o.attrs.strokeWidth === 7; });
var dotsSol = objets.filter(function (o) { return o.type === 'point' && o.attrs.size === 5; });
if (!PX || !labP || segsSol.length !== 3 || dotsSol.length !== 3) ko('objets de la figure introuvables');
['f1', 'f2', 'prod'].forEach(function (k) { if (cellules(k).length !== 3 || polys(k).length !== 6 || zerosBande(k).length !== 2) ko('bande ' + k + ' incomplète'); });

function etat() {
  return [tableEl.innerHTML, noteEl.innerHTML, panel.innerHTML, PX.X(), labP.texte(),
          objets.map(function (o) { return JSON.stringify(o.attrs); }).join('|')].join('§');
}
function lignes() {
  var out = [], re = /<tr([^>]*)>([\s\S]*?)<\/tr>/g, m;
  while ((m = re.exec(tableEl.innerHTML))) {
    var row = (m[2].match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/g) || []).map(function (c) {
      return { cls: (/class="([^"]*)"/.exec(c) || [0, ''])[1], txt: strip(c.replace(/<span class="sg-trait"><\/span>/, '|')) };
    });
    row.cls = (/class="([^"]*)"/.exec(m[1]) || [0, ''])[1];   // la classe de la LIGNE
    out.push(row);
  }
  return out;
}
function dans(morceaux, x) {
  return morceaux.some(function (p) {
    var g = x > p.a + 1e-9 || (!p.oa && Math.abs(x - p.a) < 1e-9);
    var d = x < p.b - 1e-9 || (!p.ob && Math.abs(x - p.b) < 1e-9);
    return g && d;
  });
}

/* ------------------------------------------------------------------ */
/* Un cas                                                              */
/* ------------------------------------------------------------------ */
function verifier(a, b, c, d, rel) {
  var nom = ' [(' + a + 'x+' + b + ')(' + c + 'x+' + d + ') ' + rel + ' 0] ';
  function f1(x) { return a * x + b; } function f2(x) { return c * x + d; }
  function T(x) { var v = f1(x) * f2(x), e = 1e-9; return rel === 'lt' ? v < -e : rel === 'gt' ? v > e : rel === 'le' ? v <= e : v >= -e; }
  function sg(v) { return v > 1e-9 ? '+' : v < -1e-9 ? '−' : '0'; }
  var z1 = -b / a, z2 = -d / c;
  var zs = Math.abs(z1 - z2) < 1e-9 ? [z1] : [Math.min(z1, z2), Math.max(z1, z2)];
  var bornes = [-Infinity].concat(zs, [Infinity]), mids = [];
  for (var i = 0; i + 1 < bornes.length; i++) mids.push(bornes[i] === -Infinity ? bornes[i + 1] - 1 : bornes[i + 1] === Infinity ? bornes[i] + 1 : (bornes[i] + bornes[i + 1]) / 2);

  remiseAZero();
  var L0 = lignes();
  if (L0.length !== 4) { ko(nom + 'le tableau doit avoir 4 lignes, ' + L0.length); return; }
  if (!/off/.test(L0[1].cls) || !/off/.test(L0[3].cls)) ko(nom + 'au départ, les lignes des facteurs et du produit sont estompées');
  // les zéros de l'en-tête, dans l'ordre
  var tete = L0[0].filter(function (cel) { return /sg-bar/.test(cel.cls); }).map(function (cel) { return nb(cel.txt); });
  if (tete.length !== zs.length || tete.some(function (v, i) { return Math.abs(v - zs[i]) > 1e-9; })) ko(nom + 'en-tête : zéros ' + tete.join(',') + ' au lieu de ' + zs.join(','));

  steps.forEach(function (s, i) {
    s.step(0.5);
    if (i === 2) {
      // à mi-course, la ligne du produit n'est remplie qu'à moitié
      var Lp = lignes()[3].filter(function (cel) { return !/sg-bar/.test(cel.cls) && cel.cls !== '' ; });
      var pleines = lignes()[3].filter(function (cel) { return /sg-(plus|moins)/.test(cel.cls); }).length;
      if (pleines !== Math.floor(0.5 * mids.length)) ko(nom + 'à mi-course, ' + pleines + ' colonne(s) du produit remplie(s) au lieu de ' + Math.floor(0.5 * mids.length));
    }
    s.step(1); s.after();
  });
  var L = lignes();
  // chaque ligne du tableau, signe par signe
  [['f1', f1, z1], ['f2', f2, z2], ['prod', function (x) { return f1(x) * f2(x); }, null]].forEach(function (r, k) {
    var row = L[k + 1], j = 0, iz = 0;
    if (/off/.test(row.cls)) ko(nom + 'ligne ' + r[0] + ' encore estompée à la fin');
    row.slice(2, row.length - 1).forEach(function (cel) {
      if (/sg-bar/.test(cel.cls)) {
        var z = zs[iz++], nul = r[2] === null || Math.abs(z - r[2]) < 1e-9;
        if (cel.txt !== (nul ? '0' : '|')) ko(nom + 'ligne ' + r[0] + ' sous ' + z + ' : « ' + cel.txt + ' » au lieu de « ' + (nul ? '0' : '|') + ' »');
        if (r[0] === 'prod' && (/is-sol/.test(cel.cls)) !== (rel === 'le' || rel === 'ge')) ko(nom + 'le zéro ' + z + ' est ' + (/is-sol/.test(cel.cls) ? 'gardé' : 'exclu') + ' à tort');
      } else {
        var attendu = sg(r[1](mids[j]));
        if (cel.txt !== attendu) ko(nom + 'ligne ' + r[0] + ', colonne ' + j + ' : ' + cel.txt + ' au lieu de ' + attendu);
        if (r[0] === 'prod' && (/is-sol/.test(cel.cls)) !== T(mids[j])) ko(nom + 'colonne ' + j + ' du produit ' + (/is-sol/.test(cel.cls) ? 'gardée' : 'écartée') + ' à tort');
        j++;
      }
    });
    if (j !== mids.length) ko(nom + 'ligne ' + r[0] + ' : ' + j + ' colonnes de signe au lieu de ' + mids.length);
    // la bande de la figure dit la même chose
    var cells = cellules(r[0]), pl = polys(r[0]);   // par colonne : un polygone vert, puis un rouge
    mids.forEach(function (m, i) {
      var G = pl[2 * i], R = pl[2 * i + 1], plus = sg(r[1](m)) === '+';
      if (!visible(cells[i]) || !(visible(G) || visible(R))) return ko(nom + 'bande ' + r[0] + ' colonne ' + i + ' invisible à la fin');
      if (cells[i].texte() !== sg(r[1](m))) ko(nom + 'bande ' + r[0] + ' colonne ' + i + ' : ' + cells[i].texte());
      if (G.attrs.fillColor !== '#16a34a' || R.attrs.fillColor !== '#dc2626') ko(nom + 'bande ' + r[0] + ' : polygones mal colorés');
      if (visible(G) !== plus || visible(R) === plus) ko(nom + 'bande ' + r[0] + ' colonne ' + i + ' : la couleur affichée n\'est pas celle du signe ' + sg(r[1](m)));
    });
    if (mids.length === 2 && visible(cells[2])) ko(nom + 'zéro double : la troisième colonne ne doit pas exister');
    zerosBande(r[0]).forEach(function (z, i) {
      if (i >= zs.length) { if (visible(z)) ko(nom + 'bande ' + r[0] + ' : un zéro de trop'); return; }
      var nul = r[2] === null || Math.abs(zs[i] - r[2]) < 1e-9;
      if (!visible(z) || z.texte() !== (nul ? '0' : '|')) ko(nom + 'bande ' + r[0] + ' sous ' + zs[i] + ' : ' + z.texte());
    });
  });
  // S, reparsé, confronté à l'inéquation
  var mS = /S = (.*?)<\/p>/.exec(panel.innerHTML);
  var Stxt = mS && strip(mS[1]);
  if (!Stxt) { ko(nom + 'pas de S au panneau'); return; }
  var morceaux = MathsReponse.intervalle(Stxt, false);
  if (!morceaux) { ko(nom + 'S illisible : ' + Stxt); return; }
  var grille = [-10, 10];
  zs.forEach(function (z) { grille.push(z, z - 0.01, z + 0.01); });
  mids.forEach(function (m) { grille.push(m); });
  grille.forEach(function (x) { if (dans(morceaux, x) !== T(x)) ko(nom + 'S = ' + Stxt + ' dit ' + dans(morceaux, x) + ' en x = ' + x + ', l\'inéquation dit ' + T(x)); });
  if (!/S = /.test(strip(noteEl.innerHTML))) ko(nom + 'la note finale doit donner S');
  // les traits verts de l'axe : un par morceau non réduit à un point, aux bonnes bornes
  var XLv = nb(objets.filter(function (o) { return o.type === 'text' && o.attrs.fontSize === 10 && o.parents[1] === -0.62; })[0].texte());
  var pieces = morceaux.filter(function (p) { return p.a !== p.b; }), pts = morceaux.filter(function (p) { return p.a === p.b; });
  var vus = segsSol.filter(visible), vdots = dotsSol.filter(visible);
  if (vus.length !== pieces.length) ko(nom + vus.length + ' trait(s) sur l\'axe pour ' + pieces.length + ' morceau(x) : ' + Stxt);
  if (vdots.length !== pts.length) ko(nom + vdots.length + ' point(s) isolé(s) pour ' + pts.length + ' : ' + Stxt);
  pieces.forEach(function (p, i) {
    var s = vus[i]; if (!s) return;
    var lo = p.a === -Infinity ? XLv - 0.6 : p.a, hi = p.b === Infinity ? null : p.b;
    if (Math.abs(s.x1() - lo) > 1e-9 || (hi !== null && Math.abs(s.x2() - hi) > 1e-9)) ko(nom + 'trait ' + i + ' de ' + s.x1() + ' à ' + s.x2() + ' pour ' + Stxt);
  });
  // le point de test
  [zs[0], zs[0] - 1.5, zs[zs.length - 1] + 2, mids[0]].forEach(function (x) {
    x = Math.round(x * 2) / 2;
    PX.setPosition(1, [x, 0]); PX._ev.drag();
    if ((/✓/.test(labP.texte())) !== T(PX.X())) ko(nom + 'en x = ' + PX.X() + ', l\'étiquette dit ' + strip(labP.texte()));
    var pt = strip(panel.innerHTML);
    if ((/vrai/.test(pt)) !== T(PX.X())) ko(nom + 'en x = ' + PX.X() + ', le panneau contredit l\'inéquation');
  });
}
function rejouer(nom) {
  function tout() { remiseAZero(); steps.forEach(function (s) { s.step(0.3); s.step(1); s.after(); }); return etat(); }
  if (tout() !== tout()) ko(' [' + nom + '] le rejeu ne redonne pas le même écran');
}

/* Les préréglages, puis un balayage qui passe par le zéro double. */
var PRE = [[2, -4, -1, 3, 'ge', '[2 ; 3]'], [1, 1, 1, -3, 'lt', ']−1 ; 3['], [-3, 6, 2, 2, 'gt', ']−1 ; 2['],
           [2, -1, 1, 2, 'le', '[−2 ; 0,5]'], [-1, 1, 2, -2, 'ge', '{1}']];
PRE.forEach(function (p, i) {
  presets[i].onclick();
  if (presets[i].className.indexOf('active') < 0) ko('le préréglage ' + (i + 1) + ' ne s\'allume pas');
  verifier(p[0], p[1], p[2], p[3], p[4]);
  var mS = /S = (.*?)<\/p>/.exec(panel.innerHTML);
  if (!mS || strip(mS[1]) !== p[5]) ko('préréglage ' + (i + 1) + ' : S = ' + (mS && strip(mS[1])) + ' au lieu de ' + p[5]);
  rejouer('préréglage ' + (i + 1));
});
var n = 0;
[-2, -1, 1, 3].forEach(function (a) { [-2, 1, 2].forEach(function (c) { [-4, -1, 0, 2, 5].forEach(function (b) { [-4, 0, 2, 3].forEach(function (d) {
  ['lt', 'le', 'gt', 'ge'].forEach(function (rel) {
    inA.value = a; inB.value = b; inC.value = c; inD.value = d; sel.value = rel; inA.onchange();
    verifier(a, b, c, d, rel); n++;
  });
}); }); }); });
inA.value = 1; inB.value = -1; inC.value = 2; inD.value = -2; sel.value = 'gt'; inA.onchange(); rejouer('zéro double, stricte');
var mS2 = /S = (.*?)<\/p>/.exec(panel.innerHTML);
if (!mS2 || strip(mS2[1]) !== ']−∞ ; 1[ ∪ ]1 ; +∞[') ko('(x − 1)(2x − 2) > 0 : S = ' + (mS2 && strip(mS2[1])));
inA.value = 0; inA.onchange();
if (parseInt(inA.value, 10) === 0) ko('un coefficient nul doit être refusé');

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Inéquations produit : ' + (5 + n + 1) + ' tableaux refaits signe par signe, S reparsé et confronté, bandes, axe et rejeu vérifiés.');
