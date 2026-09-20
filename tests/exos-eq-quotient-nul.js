/*
 * Les exercices « Équations quotient nul » (2nde).
 *
 * L'équation de l'énoncé est relue depuis son LaTeX : le numérateur devient
 * un polynôme dont les racines sont retrouvées ICI par le discriminant, le
 * dénominateur donne la valeur interdite, et l'ensemble annoncé doit être
 * exactement « racines du numérateur, privées de la valeur interdite » — ∅
 * compris. La valeur interdite demandée au palier 1 doit annuler le
 * dénominateur ; dans le QCM « lequel est solution ? », la valeur interdite
 * est parmi les leurres et ne doit jamais être la bonne réponse. Le lecteur
 * doit accepter la réponse (et « aucune solution » pour ∅) et refuser la
 * valeur interdite proposée comme solution. Les vrai/faux sont confrontés à
 * une table indépendante, et la correction commence par la valeur interdite.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/equations-quotient-nul.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }

/* Un membre en LaTeX → fonction de x (multiplications implicites rétablies). */
function expr(t) {
  var s = t.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\big\[/g, '(').replace(/\\big\]/g, ')')
    .replace(/\{,\}/g, '.').replace(/−/g, '-').replace(/\s+/g, '').replace(/\^2/g, '**2')
    .replace(/\\times/g, '*').replace(/(\d)x/g, '$1*x').replace(/(\d)\(/g, '$1*(').replace(/\)\(/g, ')*(').replace(/x\(/g, 'x*(').replace(/\)x/g, ')*x').replace(/\)(\d)/g, ')*$1')
    .replace(/(^|[^\d*)])x/g, '$1(x)').replace(/\)\(/g, ')*(');
  try { return new Function('x', 'return (' + s + ');'); } catch (e) { return null; }
}
/* Un polynôme (en LaTeX) → ses racines réelles, retrouvées par le discriminant. */
function racinesPoly(t) {
  var L = expr(t);
  if (!L) return null;
  function P(x) { return L(x); }
  var p0, p1, p2;
  try { p0 = P(0); p1 = P(1); p2 = P(-1); } catch (e) { ko('évaluation impossible : ' + tex + ' (' + e + ')'); return null; }
  var A = (p1 + p2) / 2 - p0, B = (p1 - p2) / 2, C = p0;
  // le polynôme est bien de degré ⩽ 2 : on vérifie en deux autres points
  if (Math.abs(A * 4 + B * 2 + C - P(2)) > 1e-9 || Math.abs(A * 9 - B * 3 + C - P(-3)) > 1e-9) return null;
  if (Math.abs(A) < 1e-12) return Math.abs(B) < 1e-12 ? null : [-C / B];
  var delta = B * B - 4 * A * C;
  if (delta < -1e-12) return [];
  if (delta < 1e-12) return [-B / (2 * A)];
  var r1 = (-B - Math.sqrt(delta)) / (2 * A), r2 = (-B + Math.sqrt(delta)) / (2 * A);
  return [Math.min(r1, r2), Math.max(r1, r2)];
}
/* \dfrac{N}{D} = 0 → { sols, interdite } */
function racines(tex) {
  var m = /^\\dfrac\{(.*)\}\{(.*)\} = 0$/.exec(tex);
  if (!m) return null;
  var N = racinesPoly(m[1]), Dr = racinesPoly(m[2]);
  if (!N || !Dr || Dr.length !== 1) return null;
  return { sols: N.filter(function (r) { return Math.abs(r - Dr[0]) > 1e-9; }), interdite: Dr[0] };
}
function nbTxt(v) { return String(Math.round(v * 1e6) / 1e6).replace('.', ','); }
var TABLE = [
  [/deux solutions, \\\(2/, false], [/x - 3\}\{x - 3\}/, false], [/si et seulement si son numérateur/, true], [/le quotient vaut \\\(0/, false],
  [/unique solution \\\(-1/, true], [/multiplier les deux membres/, true], [/n'est pas un nombre/, false],
  [/2x \+ 6\} = 0\\\), la valeur interdite est \\\(-3/, true], [/2x \+ 6\} = 0\\\), la valeur interdite est \\\(1/, false], [/x - 5\}\{x - 5\}/, false]
];
var vides = 0, produits = 0, interdits3 = 0;

for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 421 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|\[object|\+ -|- -|\+-|--/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 160));
  if (!q.etapes || !q.etapes.length) ko('P' + p + ' pas de correction');
  var nom = 'P' + p + ' ' + txt(q.tex || q.enonce).slice(0, 60), m;

  if (q.type === 'intervalle') {
    var R = racines(q.tex);
    if (!R) { ko(nom + ' : équation illisible ' + q.tex); continue; }
    var pts = (q.morceaux || []).map(function (mo) { if (mo.a !== mo.b || mo.oa || mo.ob) ko(nom + ' : S doit être un ensemble de points'); return mo.a; }).sort(function (u, v) { return u - v; });
    if (pts.length !== R.sols.length || pts.some(function (v, k) { return Math.abs(v - R.sols[k]) > 1e-9; }))
      ko(nom + ' : S = ' + q.reponse + ' alors que les solutions sont {' + R.sols.map(nbTxt).join(' ; ') + '} (interdite ' + nbTxt(R.interdite) + ')');
    if (!MathsReponse.valide(q, q.reponse).ok) ko(nom + ' : la réponse attendue « ' + q.reponse + ' » est refusée');
    if (q.reponse === '∅') { vides++; if (!MathsReponse.valide(q, 'aucune solution').ok) ko(nom + ' : « aucune solution » refusé pour ∅'); }
    if (MathsReponse.valide(q, '{' + nbTxt(R.interdite) + '}').ok) ko(nom + ' : la valeur interdite acceptée comme solution');
    if (R.sols.length === 1 && MathsReponse.valide(q, '{' + nbTxt(R.sols[0]) + ';' + nbTxt(R.interdite) + '}').ok) ko(nom + ' : S avec la valeur interdite en plus accepté');
    if (!/interdite/.test(txt(q.etapes[0]))) ko(nom + ' : la correction doit commencer par la valeur interdite');
    if (!/S = /.test(txt(q.etapes[q.etapes.length - 1]))) ko(nom + ' : la correction doit finir par S');
    var prodNum = /\)\(/.test(q.tex.split('}{')[0]);
    if (prodNum) { produits++; compte('numérateur produit'); if (p < 3) ko(nom + ' : numérateur produit avant le palier 3'); if (Math.abs(racinesPoly(/\\dfrac\{(.*)\}\{/.exec(q.tex)[1]).length - R.sols.length) === 1) interdits3++; }
    else compte(R.sols.length ? 'quotient' : 'vide');
  } else if ((m = /valeur interdite<\/strong> de l'équation \\\((.*?)\\\) \?/.exec(q.enonce))) {
    compte('interdite');
    var Ri = racines(m[1]);
    if (!Ri) { ko(nom + ' : équation illisible'); continue; }
    if (Math.abs(q.reponse - Ri.interdite) > 1e-9) ko(nom + ' : valeur interdite annoncée ' + q.reponse + ' au lieu de ' + Ri.interdite);
    if (!/dénominateur/.test(txt(q.etapes.join(' ')))) ko(nom + ' : la correction doit parler du dénominateur');
  } else if (q.type === 'qcm' && /lequel est/.test(q.enonce)) {
    compte('lequel');
    var me = /\\\((.*?)\\\) \?$/.exec(q.enonce), Rq = me && racines(me[1]);
    if (!Rq) { ko(nom + ' : équation du QCM illisible'); continue; }
    var bons = 0, interditeProposee = false;
    q.choix.forEach(function (c, i) {
      var v = parseFloat(String(c).replace(/−/g, '-').replace(',', '.'));
      if (Math.abs(v - Rq.interdite) < 1e-9) interditeProposee = true;
      var ok = Rq.sols.some(function (s) { return Math.abs(s - v) < 1e-9; });
      if (ok) bons++;
      if (ok !== (i === q.correct)) ko(nom + ' : le choix ' + c + (ok ? ' annule le produit' : ' ne l\'annule pas') + ' mais ' + (i === q.correct ? 'est annoncé bon' : 'ne l\'est pas'));
    });
    if (bons !== 1 || q.choix.length !== 4) ko(nom + ' : ' + bons + ' bon(s) choix sur ' + q.choix.length);
    if (!interditeProposee) ko(nom + ' : la valeur interdite doit être parmi les leurres');
  } else if (q.type === 'qcm' && /Quelle équation/.test(q.enonce)) {
    compte('laquelle');
    var ms = /S = \\\{(.*?)\\\}\\\)/.exec(q.enonce);
    if (!ms) { ko(nom + ' : S illisible'); continue; }
    var vals = ms[1].split('\\,;\\ ').map(function (t) { var f = expr(t); return f ? f(0) : NaN; });
    var bons2 = 0;
    q.choix.forEach(function (c, i) {
      var Rc = racines(c.replace(/^\\\(|\\\)$/g, ''));
      var ok = !!Rc && Rc.sols.length === vals.length && vals.slice().sort(function (u, v) { return u - v; }).every(function (v, k) { return Math.abs(v - Rc.sols[k]) < 1e-9; });
      if (ok) bons2++;
      if (ok !== (i === q.correct)) ko(nom + ' : ' + c + (ok ? ' convient' : ' ne convient pas') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
    });
    if (bons2 !== 1) ko(nom + ' : ' + bons2 + ' propositions justes');
  } else if (q.type === 'vraifaux') {
    compte('vrai/faux');
    var t = TABLE.filter(function (r) { return r[0].test(q.enonce); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + txt(q.enonce));
    else if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(q.enonce));
  } else {
    ko(nom + ' : énoncé non reconnu (' + q.type + ')');
  }
}
if (vides < 40) ko('le cas sans solution n\'est tiré que ' + vides + ' fois');
if (interdits3 < 60) ko('le numérateur produit avec un zéro interdit n\'est tiré que ' + interdits3 + ' fois');
['quotient', 'vide', 'interdite', 'lequel', 'vrai/faux', 'numérateur produit', 'laquelle'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ENSEMBLE ANNONCÉ EST LES RACINES DU NUMÉRATEUR PRIVÉES DE LA VALEUR INTERDITE');
