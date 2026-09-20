/*
 * Les exercices « Équations produit nul » (2nde).
 *
 * L'équation de l'énoncé est relue depuis son LaTeX et transformée en un
 * polynôme — quelle que soit sa forme : produit factorisé, facteur constant,
 * x² = 3x, différence de carrés, facteur commun. Ses racines sont retrouvées
 * ICI par le discriminant, et l'ensemble annoncé doit être exactement cet
 * ensemble de racines — ni une de plus, ni une de moins, le même zéro écrit
 * une fois. Le lecteur doit accepter la réponse dans l'autre ordre et refuser
 * une réponse amputée d'une solution (le piège de la simplification par x).
 * Les QCM sont jugés proposition par proposition, les vrai/faux contre une
 * table indépendante, et les paliers tiennent leur promesse : rien à
 * factoriser avant le palier 3, les trois façons de factoriser au palier 3.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/equations-produit-nul.js');

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
/* L'équation → ses racines réelles, retrouvées par le discriminant. */
function racines(tex) {
  var m = /^(.*?) = (.*)$/.exec(tex);
  if (!m) return null;
  var L = expr(m[1]), R = expr(m[2]);
  if (!L || !R) return null;
  function P(x) { return L(x) - R(x); }
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
function nbTxt(v) { return String(Math.round(v * 1e6) / 1e6).replace('.', ','); }
var TABLE = [
  [/x\(x - 3\) = 0/, false], [/exactement deux solutions/, true], [/d'abord développer/, false], [/\(x - 2\)\(x - 2\)/, true],
  [/3\(x - 1\)/, false], [/A \\times B = 0/, true], [/A \\times B = 6/, false], [/^-2\\\) est solution|-2\\\) est solution/, true],
  [/x\^2 = 5x/, false], [/3x - 2\) = 0\\\) sont/, true]
];
var formes3 = { x2: 0, carre: 0, commun: 0 };

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
    if (pts.length !== R.length || pts.some(function (v, i) { return Math.abs(v - R[i]) > 1e-9; }))
      ko(nom + ' : S = ' + q.reponse + ' alors que les racines sont {' + R.map(nbTxt).join(' ; ') + '}');
    if (!MathsReponse.valide(q, q.reponse).ok) ko(nom + ' : la réponse attendue « ' + q.reponse + ' » est refusée');
    if (R.length === 2) {
      var inv = '{' + nbTxt(R[1]) + ';' + nbTxt(R[0]) + '}';
      if (Math.abs(Math.round(R[1] * 100) / 100 - R[1]) < 1e-9 && Math.abs(Math.round(R[0] * 100) / 100 - R[0]) < 1e-9 && !MathsReponse.valide(q, inv).ok)
        ko(nom + ' : « ' + inv + ' » (les mêmes solutions, dans l\'autre ordre) refusé');
      var amputee = '{' + nbTxt(R[1]) + '}';
      if (MathsReponse.valide(q, amputee).ok) ko(nom + ' : la réponse amputée « ' + amputee + ' » acceptée');
    }
    var factorise = /\^2|\) \+ /.test(q.tex);        // un carré, ou deux produits additionnés
    if (factorise) {
      compte('factoriser');
      if (/x\^2 = /.test(q.tex)) formes3.x2++; else if (/\)\^2 - /.test(q.tex)) formes3.carre++; else formes3.commun++;
      if (p < 3) ko(nom + ' : rien à factoriser avant le palier 3');
      if (!/factoris/.test(txt(q.etapes.join(' ')))) ko(nom + ' : la correction doit factoriser');
    } else {
      compte(R.length === 1 ? 'même zéro' : /^-?\d+\(/.test(q.tex) ? 'constante' : 'produit');
      if (p === 3) ko(nom + ' : au palier 3, on factorise');
    }
    if (/^x\(|\)x = 0$|\(x\)/.test(q.tex) && !/perdre la solution 0/.test(txt(q.etapes.join(' ')))) ko(nom + ' : le facteur x doit rappeler la solution 0');
    if (!/S = /.test(txt(q.etapes[q.etapes.length - 1]))) ko(nom + ' : la correction doit finir par S');
    if (!/produit est nul/.test(txt(q.etapes.join(' ')))) ko(nom + ' : la règle du produit nul doit être écrite');
  } else if (q.type === 'qcm' && /lequel est/.test(q.enonce)) {
    compte('lequel');
    var me = /\\\((.*?) = 0\\\) \?$/.exec(q.enonce), Pf = me && expr(me[1]);
    if (!Pf) { ko(nom + ' : équation du QCM illisible'); continue; }
    var bons = 0;
    q.choix.forEach(function (c, i) {
      var ok = Math.abs(Pf(parseFloat(String(c).replace(/−/g, '-').replace(',', '.')))) < 1e-9;
      if (ok) bons++;
      if (ok !== (i === q.correct)) ko(nom + ' : le choix ' + c + (ok ? ' annule le produit' : ' ne l\'annule pas') + ' mais ' + (i === q.correct ? 'est annoncé bon' : 'ne l\'est pas'));
    });
    if (bons !== 1 || q.choix.length !== 4) ko(nom + ' : ' + bons + ' bon(s) choix sur ' + q.choix.length);
  } else if (q.type === 'qcm' && /Quelle équation/.test(q.enonce)) {
    compte('laquelle');
    var ms = /S = \\\{(.*?)\\\}\\\)/.exec(q.enonce);
    if (!ms) { ko(nom + ' : S illisible'); continue; }
    var vals = ms[1].split('\\,;\\ ').map(function (t) { var f = expr(t); return f ? f(0) : NaN; });
    var bons2 = 0;
    q.choix.forEach(function (c, i) {
      var Rc = racines(c.replace(/^\\\(|\\\)$/g, ''));
      var ok = !!Rc && Rc.length === vals.length && vals.slice().sort(function (u, v) { return u - v; }).every(function (v, k) { return Math.abs(v - Rc[k]) < 1e-9; });
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
['x2', 'carre', 'commun'].forEach(function (k) { if (formes3[k] < 40) ko('factorisation « ' + k + ' » tirée ' + formes3[k] + ' fois seulement'); });
['produit', 'constante', 'même zéro', 'lequel', 'vrai/faux', 'factoriser', 'laquelle'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ENSEMBLE ANNONCÉ EST EXACTEMENT L\'ENSEMBLE DES RACINES, RETROUVÉES PAR LE DISCRIMINANT');
