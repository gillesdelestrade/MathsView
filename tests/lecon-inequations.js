/*
 * La leçon « Inéquations du premier degré » (2nde).
 *
 * Rien de ce que la leçon affirme n'est relu tel quel : chaque ligne écrite au
 * panneau est REPARSÉE puis évaluée en plusieurs x, et doit être vraie
 * exactement quand l'inéquation de départ l'est — c'est là qu'un sens oublié
 * (ou retourné à tort) se voit. Le symbole rouge « retourné » doit apparaître
 * une fois si, et seulement si, on divise par un négatif. Sur la droite
 * graduée, chaque marque ✓/✗ est confrontée à l'inéquation de départ, la
 * couleur des deux moitiés aussi, et le point de test à mi-parcours doit être
 * du bon côté et dire vrai. L'intervalle final est reparsé et vérifié aux
 * bornes exactes (crochet ouvert ou fermé). Les cas sans x (« toujours vrai »,
 * « jamais vrai ») sont exigés justes. Enfin, l'animation est rejouée après
 * une remise à zéro et doit redonner exactement le même écran.
 */
load('tests/lecon-inequations-decor.js');

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }

/* ------------------------------------------------------------------ */
/* Lecture du panneau                                                   */
/* ------------------------------------------------------------------ */
function strip(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function txt(h) {
  h = String(h).replace(/<span class="eq-frac[^"]*"[^>]*><span class="eq-num">([\s\S]*?)<\/span><span class="eq-den"[^>]*>([\s\S]*?)<\/span><\/span>/g,
    function (m, n, d) { return '(' + strip(n) + ')/' + strip(d); });
  h = h.replace(/<span class="eq-approx">[\s\S]*?<\/span>/g, '');
  return strip(h).replace(/−/g, '-').replace(/,/g, '.').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
var linesEl = parClasse('eq-lines')[0], noteEl = parClasse('eq-note')[0], panel = parClasse('props-panel')[0];
function lignes() {
  var out = [], re = /<div class="eq-line( eq-sol)?">([\s\S]*?)<\/div>/g, m;
  while ((m = re.exec(linesEl.innerHTML))) out.push(m[2]);
  return out;
}
var SYM = { '<': 'lt', '>': 'gt', '⩽': 'le', '⩾': 'ge' };
function cmp(rel, u, v) {
  var e = 1e-9;
  return rel === 'lt' ? u < v - e : rel === 'gt' ? u > v + e : rel === 'le' ? u <= v + e : u >= v - e;
}
// « -3x + 6 > 7 » ou « (4 - 5x)/2 + 7 > 13 » → fonction de x, vraie ou fausse.
function parseLigne(t) {
  var m = /^(.*?) ([<>⩽⩾]) (.*)$/.exec(t);
  if (!m) return null;
  function expr(s) {
    s = s.replace(/(\d)x/g, '$1*(x)').replace(/(^|[^\d*)])x/g, '$1(x)').replace(/\)\(/g, ')*(');
    return new Function('x', 'return (' + s + ');');
  }
  var g = expr(m[1]), dr = expr(m[3]), rel = SYM[m[2]];
  return { rel: rel, g: g, dr: dr, verite: function (x) { return cmp(rel, g(x), dr(x)); } };
}

/* ------------------------------------------------------------------ */
/* Lecture de la figure                                                 */
/* ------------------------------------------------------------------ */
var textes = objets.filter(function (o) { return o.type === 'text'; });
var marques = textes.filter(function (o) { return o.parents[1] === 0.75; });
var gradus = textes.filter(function (o) { return o.parents[1] === -0.58; });
var labP = textes.filter(function (o) { return o.parents[1] === 1.45; })[0];
var titre = textes.filter(function (o) { return o.parents[1] === 3.95; })[0];
var moities = objets.filter(function (o) { return o.type === 'polygon'; });
var PX = objets.filter(function (o) { return o.type === 'point' && o.attrs.fixed === false; })[0];
var sols = objets.filter(function (o) { return o.type === 'segment' && o.attrs.strokeWidth === 7; });
if (marques.length !== 15 || gradus.length !== 15) ko('15 graduations et 15 marques attendues');
if (moities.length !== 2) ko('deux moitiés attendues');
if (!PX || !labP || !titre || sols.length !== 2) ko('objets de la figure introuvables');

var inA = parClasse('eq-a')[0], inB = parClasse('eq-b')[0], inC = parClasse('eq-c')[0], inD = parClasse('eq-d')[0];
var sel = parClasse('ineq-sel')[0], presets = parClasse('ineq-preset'), rands = parClasse('eq-rand');
if (presets.length !== 5 || rands.length !== 2) ko('5 préréglages et 2 dés attendus');

function etat() {
  return [linesEl.innerHTML, noteEl.innerHTML, panel.innerHTML, PX.X(), titre.texte(), labP.texte(),
          objets.map(function (o) { return JSON.stringify(o.attrs); }).join('|')].join('§');
}

/* ------------------------------------------------------------------ */
/* Un cas : on rejoue tout et on confronte                              */
/* ------------------------------------------------------------------ */
var XS = [-7.3, -2, -0.5, 0, 0.4, 1, 3.5, 9];
function verifier(nom, orig, kNeg, kNul, aFraction) {
  // orig(x) : la vérité de l'inéquation de départ, calculée ICI.
  var pre = ' [' + nom + '] ';
  remiseAZero();
  if (lignes().length !== 1) ko(pre + 'au départ, une seule ligne');
  var l0 = parseLigne(txt(lignes()[0]));
  if (!l0) ko(pre + 'ligne de départ illisible : ' + txt(lignes()[0]));
  else XS.forEach(function (x) { if (l0.verite(x) !== orig(x)) ko(pre + 'la ligne de départ ne dit pas ' + orig(x) + ' en x = ' + x + ' : ' + txt(lignes()[0])); });

  var nbHot = 0, x0 = null, nLignes = 1, testLVu = false, testRVu = false;
  // La forme réduite k·x ⋈ R est atteinte : la frontière R/k suit.
  function detecteReduite(t) {
    var mr = /^-?\d*x [<>⩽⩾] -?\d+(\.\d+)?$/.exec(t);
    if (mr && x0 === null && !kNul) {
      var kx = t.split(' ')[0].replace('x', ''); var k = kx === '' ? 1 : kx === '-' ? -1 : parseInt(kx, 10);
      x0 = parseFloat(t.split(' ')[2]) / k;
    }
  }
  detecteReduite(txt(lignes()[0]));
  steps.forEach(function (s, i) {
    s.step(0.5);
    var lg = lignes();
    // À mi-course d'un test, le point est du bon côté et dit vrai.
    var lab = txt(labP.texte());
    var okLab = /✓/.test(lab) ? true : /✗/.test(lab) ? false : null;
    if (x0 !== null && !testLVu && PX.X() < x0 - 1e-9) {
      testLVu = true;
      if (okLab !== orig(PX.X())) ko(pre + 'à gauche, en x = ' + PX.X() + ', l\'étiquette dit ' + lab);
    } else if (x0 !== null && testLVu && !testRVu && PX.X() > x0 + 1e-9) {
      testRVu = true;
      if (okLab !== orig(PX.X())) ko(pre + 'à droite, en x = ' + PX.X() + ', l\'étiquette dit ' + lab);
    }
    s.step(1); s.after();
    lg = lignes();
    if (lg.length > nLignes) {
      if (lg.length !== nLignes + 1) ko(pre + 'une étape écrit plus d\'une ligne');
      nLignes = lg.length;
      var t = txt(lg[lg.length - 1]);
      if (/^S = /.test(t) || /Toujours|Jamais/.test(t)) return;
      var L = parseLigne(t);
      if (!L) { ko(pre + 'ligne illisible : ' + t); return; }
      XS.forEach(function (x) { if (L.verite(x) !== orig(x)) ko(pre + 'la ligne « ' + t + ' » ne dit pas ' + orig(x) + ' en x = ' + x); });
      if (/ineq-rel hot/.test(lg[lg.length - 1])) nbHot++;
      detecteReduite(t);
    }
  });
  var lg = lignes();
  var fin = txt(lg[lg.length - 1]);
  if (nbHot !== (kNeg ? 1 : 0)) ko(pre + nbHot + ' symbole(s) retourné(s), attendu ' + (kNeg ? 1 : 0));
  if (kNul) {
    var toujours = orig(-50) && orig(50);
    if (!(toujours ? /Toujours vrai/.test(fin) : /Jamais vrai/.test(fin))) ko(pre + 'cas sans x : ' + fin);
    return;
  }
  if (x0 === null) { ko(pre + 'forme réduite k·x ⋈ R jamais atteinte'); return; }
  if (!testLVu || !testRVu) ko(pre + 'le point n\'a pas testé les deux côtés');
  // L'intervalle final, reparsé, confronté aux bornes exactes.
  var mi = /^S = ([\]\[])(.*?) ; (.*?)([\]\[])$/.exec(fin);
  if (!mi) { ko(pre + 'intervalle final illisible : ' + fin); return; }
  var gauche = mi[2] === '-∞';
  var borne = gauche ? mi[3] : mi[2];
  var v = new Function('return (' + borne.replace(/\)\(/g, ')*(') + ');')();
  if (Math.abs(v - x0) > 1e-9) ko(pre + 'la borne ' + borne + ' n\'est pas la frontière ' + x0);
  var ferme = gauche ? mi[4] === ']' : mi[1] === '[';
  if (orig(v - 0.01) !== gauche) ko(pre + 'juste à gauche de la borne, l\'inéquation de départ dit ' + orig(v - 0.01) + ' : ' + fin);
  if (orig(v + 0.01) !== !gauche) ko(pre + 'juste à droite de la borne, l\'inéquation de départ dit ' + orig(v + 0.01) + ' : ' + fin);
  if (orig(v) !== ferme) ko(pre + 'à la borne, l\'inéquation de départ dit ' + orig(v) + ' mais le crochet est ' + (ferme ? 'fermé' : 'ouvert'));
  // Le titre final dit x ⋈ borne.
  var tt = txt(titre.texte());
  var Lt = parseLigne(tt);
  if (!Lt || !/^x /.test(tt)) { if (!(kNeg === false && /^x /.test(tt) === false && Lt && Lt.verite)) ko(pre + 'titre final : ' + tt); }
  if (Lt) XS.forEach(function (x) { if (Lt.verite(x) !== orig(x)) ko(pre + 'le titre « ' + tt + ' » ne dit pas ' + orig(x) + ' en x = ' + x); });
  // La figure : marques et moitiés.
  var XL = parseFloat(txt(gradus[0].texte()));
  if (Math.abs(XL - (Math.floor(x0) - 6)) > 1e-9) ko(pre + 'la graduation commence en ' + XL + ' pour une frontière en ' + x0);
  if (!bbox || bbox[0] !== XL - 0.9) ko(pre + 'la fenêtre ne suit pas la graduation');
  marques.forEach(function (m, i) {
    var x = XL + i;
    if (!visible(gradus[i])) { if (visible(m)) ko(pre + 'marque hors graduation visible'); return; }
    if (Math.abs(x - x0) < 1e-9) { if (visible(m)) ko(pre + 'une marque sur la frontière'); return; }
    if (!visible(m)) { ko(pre + 'marque absente en x = ' + x); return; }
    var mt = m.texte();
    if ((mt === '✓') !== orig(x)) ko(pre + 'marque ' + mt + ' en x = ' + x + ' alors que l\'inéquation dit ' + orig(x));
    if (m.attrs.color !== (orig(x) ? '#16a34a' : '#dc2626')) ko(pre + 'couleur de la marque en x = ' + x);
  });
  if (moities[0].attrs.fillColor !== (orig(x0 - 0.5) ? '#16a34a' : '#dc2626')) ko(pre + 'la moitié gauche n\'a pas la couleur de son verdict');
  if (moities[1].attrs.fillColor !== (orig(x0 + 0.5) ? '#16a34a' : '#dc2626')) ko(pre + 'la moitié droite n\'a pas la couleur de son verdict');
  if (visible(sols[0]) !== gauche || visible(sols[1]) !== !gauche) ko(pre + 'le trait des solutions n\'est pas du bon côté');
  // Le point de test à la souris : l'étiquette et le panneau disent vrai.
  [XL + 1, XL + 4.5, XL + 11].forEach(function (x) {
    PX.setPosition(1, [x, 0]); PX._ev.drag();
    var lab = txt(labP.texte());
    if ((/✓/.test(lab)) !== orig(PX.X())) ko(pre + 'après glissement en x = ' + PX.X() + ', l\'étiquette dit ' + lab);
    var pt = strip(panel.innerHTML);
    if ((/vrai/.test(pt)) !== orig(PX.X()) || (/faux/.test(pt)) === orig(PX.X())) ko(pre + 'le panneau contredit l\'inéquation en x = ' + PX.X());
    if ((/∈/.test(pt)) !== orig(PX.X())) ko(pre + 'le panneau ne dit pas si ' + PX.X() + ' est dans S');
  });
  if (aFraction && !/positif/.test(strip(linesEl.innerHTML))) ko(pre + 'le passage ×n doit dire que n est positif');
}

// Le rejeu : après remise à zéro, le même écran.
function rejouer(nom) {
  function tout() { remiseAZero(); steps.forEach(function (s) { s.step(0.3); s.step(1); s.after(); }); return etat(); }
  var e1 = tout(), e2 = tout();
  if (e1 !== e2) ko(' [' + nom + '] le rejeu ne redonne pas le même écran');
}

/* ------------------------------------------------------------------ */
/* Les préréglages, dans l'ordre des boutons                            */
/* ------------------------------------------------------------------ */
var PRE = [
  { nom: '6 > 3x + 7', f: function (x) { return 6 > 3 * x + 7; }, neg: true },
  { nom: '(4 − 5x)/2 + 7 > 13', f: function (x) { return (4 - 5 * x) / 2 + 7 > 13; }, neg: true, frac: true },
  { nom: '−x > 5', f: function (x) { return -x > 5; }, neg: true },
  { nom: '2x − 3 ⩽ 5', f: function (x) { return 2 * x - 3 <= 5; }, neg: false },
  { nom: '5x + 1 ⩾ 2x − 8', f: function (x) { return 5 * x + 1 >= 2 * x - 8; }, neg: false }
];
PRE.forEach(function (p, i) {
  presets[i].onclick();
  if (presets[i].className.indexOf('active') < 0) ko('le préréglage « ' + p.nom + ' » ne s\'allume pas');
  verifier(p.nom, p.f, p.neg, false, !!p.frac);
  rejouer(p.nom);
});
// Le premier exemple, en détail : le sens se retourne à la division par −3.
presets[0].onclick(); remiseAZero();
steps.forEach(function (s) { s.step(1); s.after(); });
var L = lignes().map(function (l) { return txt(l); });
var attendu = ['6 > 3x + 7', '-3x + 6 > 7', '-3x > 1', 'x < (1)/3', 'S = ]-∞ ; -(1)/3['];
if (L.length !== 5) ko('6 > 3x + 7 : ' + L.length + ' lignes au lieu de 5 : ' + L.join(' | '));
if (L[1] !== attendu[1] || L[2] !== attendu[2]) ko('6 > 3x + 7 : ' + L.join(' | '));
if (!/^x < -\(1\)\/3$/.test(L[3])) ko('6 > 3x + 7 : la solution doit être x < −1/3, lue « ' + L[3] + ' »');
if (L[4] !== attendu[4]) ko('6 > 3x + 7 : intervalle « ' + L[4] + ' »');
var notes = strip(linesEl.innerHTML);
if (!/négatif/.test(notes) || !/ouvert/.test(notes)) ko('6 > 3x + 7 : les notes doivent parler du négatif et du crochet ouvert');
if (strip(noteEl.innerHTML) !== '') ko('une fois la ligne écrite, la note volante doit être vide');
if (steps.length !== 7) ko('6 > 3x + 7 : 7 étapes attendues (2 lignes, frontière, 2 tests, division, intervalle), ' + steps.length);

/* ------------------------------------------------------------------ */
/* Balayage : a, c ∈ {−3, −1, 0, 1, 2}, b, d ∈ {−5, 0, 4}, les 4 sens    */
/* ------------------------------------------------------------------ */
var RELS = ['lt', 'le', 'gt', 'ge'], n = 0;
[-3, -1, 0, 1, 2].forEach(function (a) {
  [-3, -1, 0, 1, 2].forEach(function (c) {
    [-5, 0, 4].forEach(function (b) {
      [-5, 0, 4].forEach(function (d) {
        RELS.forEach(function (rel) {
          inA.value = a; inB.value = b; inC.value = c; inD.value = d; sel.value = rel;
          inA.onchange();
          var nom = a + 'x+' + b + ' ' + rel + ' ' + c + 'x+' + d;
          verifier(nom, function (x) { return cmp(rel, a * x + b, c * x + d); }, a - c < 0, a === c, false);
          n++;
        });
      });
    });
  });
});
// Rejeu sur quelques-uns du balayage.
inA.value = -2; inB.value = 3; inC.value = 1; inD.value = -4; sel.value = 'ge'; inA.onchange(); rejouer('-2x+3 ⩾ x-4');
inA.value = 1; inB.value = 0; inC.value = 0; inD.value = 2; sel.value = 'lt'; inA.onchange(); rejouer('x < 2');
inA.value = 3; inB.value = 1; inC.value = 3; inD.value = 0; sel.value = 'gt'; inA.onchange(); rejouer('3x+1 > 3x');

/* ------------------------------------------------------------------ */
/* Le dé « avec une fraction », tirage déterministe                     */
/* ------------------------------------------------------------------ */
var graine = 7;
Math.random = function () { graine = (graine * 1103515245 + 12345) % 2147483648; return graine / 2147483648; };
var nf = 0;
for (var t = 0; t < 60; t++) {
  rands[1].onclick();
  var t0 = txt(lignes()[0]);
  var m = /^\((.*)\)\/(\d+)( [-+] \d+)? ([<>⩽⩾]) (-?\d+)$/.exec(t0);
  if (!m) { ko('fraction : ligne de départ illisible : ' + t0); continue; }
  var L0 = parseLigne(t0), q = /(^|[-+]) ?(\d*)x/.exec(m[1]);
  var kq = (q[1] === '-' ? -1 : 1) * (q[2] === '' ? 1 : parseInt(q[2], 10));
  verifier('frac ' + t0, L0.verite, kq < 0, false, true);
  nf++;
}
rands[1].onclick(); rejouer('fraction');
rands[0].onclick(); var t1 = txt(lignes()[0]); var L1 = parseLigne(t1);
if (!L1) ko('dé : ' + t1); else { var ka = /^(-?\d*)x/.exec(t1), kc = /[<>⩽⩾] (-?\d*)x/.exec(t1);
  function coef(mm) { return !mm ? 0 : mm[1] === '' ? 1 : mm[1] === '-' ? -1 : parseInt(mm[1], 10); }
  verifier('dé ' + t1, L1.verite, coef(ka) - coef(kc) < 0, false, false); }

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Inéquations : ' + (5 + n + nf + 2) + ' inéquations rejouées, chaque ligne évaluée, marques, moitiés, intervalle et rejeu vérifiés.');
