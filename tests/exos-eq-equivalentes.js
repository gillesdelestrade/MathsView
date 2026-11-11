/*
 * Les exercices « Équations équivalentes » (2nde).
 *
 * Rien n'est cru sur parole : chaque équation est relue depuis son LaTeX et
 * transformée en fonctions de x, et ses solutions sont retrouvées ICI par le
 * discriminant.
 *   - « Quelle équation obtient-on ? » : l'opération est relue dans l'énoncé
 *     et appliquée ici aux deux membres ; la proposition annoncée bonne doit
 *     valoir exactement cela, et AUCUNE autre ne doit avoir les solutions de
 *     l'équation de départ (un leurre équivalent serait une seconde bonne
 *     réponse).
 *   - « Quelle opération ? » : chaque opération proposée est appliquée à la
 *     première équation ; une seule doit donner la seconde.
 *   - « Sont-elles équivalentes ? » : les solutions des deux équations sont
 *     comparées, et le verdict doit suivre.
 *   - « Laquelle est équivalente ? » : une seule proposition a les solutions
 *     de l'équation de départ, « simplifier par x » compris.
 *   - « Par quel nombre ? » : le nombre annoncé, appliqué ici, doit donner la
 *     seconde équation.
 * Les vrai/faux de règle sont jugés contre une table indépendante, et les
 * paliers tiennent leur promesse : addition au palier 1, multiplication au
 * palier 2, factorisation au palier 4 seulement.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/equations-equivalentes.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }

/* Un membre en LaTeX → fonction de x (multiplications implicites rétablies). */
function expr(t) {
  var s = t.replace(/\\left|\\right/g, '').replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
    .replace(/−/g, '-').replace(/\s+/g, '').replace(/\^2/g, '**2')
    .replace(/\\times/g, '*').replace(/(\d)x/g, '$1*x').replace(/(\d)\(/g, '$1*(').replace(/\)\(/g, ')*(').replace(/x\(/g, 'x*(').replace(/\)x/g, ')*x').replace(/\)(\d)/g, ')*$1')
    .replace(/(^|[^\d*)])x/g, '$1(x)').replace(/\)\(/g, ')*(').replace(/^-\(/, '-1*(');
  try { var f = new Function('x', 'return (' + s + ');'); f(1.5); return f; } catch (e) { return null; }
}
function equation(tex) {
  var m = /^(.*?) = (.*)$/.exec(tex.replace(/^\\\(|\\\)$/g, ''));
  if (!m) return null;
  var L = expr(m[1]), R = expr(m[2]);
  return L && R ? { L: L, R: R } : null;
}
var XS = [-2.5, -1, 0, 0.5, 2, 3.25];
function memes(f, g) { return XS.every(function (x) { return Math.abs(f(x) - g(x)) < 1e-9; }); }
function racines(E) {
  function P(x) { return E.L(x) - E.R(x); }
  var p0 = P(0), p1 = P(1), p2 = P(-1), A = (p1 + p2) / 2 - p0, B = (p1 - p2) / 2, C = p0;
  if (Math.abs(A * 4 + B * 2 + C - P(2)) > 1e-9) return null;
  if (Math.abs(A) < 1e-12) return Math.abs(B) < 1e-12 ? (Math.abs(C) < 1e-12 ? 'R' : []) : [-C / B];
  var dl = B * B - 4 * A * C;
  if (dl < -1e-12) return [];
  if (dl < 1e-12) return [-B / (2 * A)];
  var r1 = (-B - Math.sqrt(dl)) / (2 * A), r2 = (-B + Math.sqrt(dl)) / (2 * A);
  return [Math.min(r1, r2), Math.max(r1, r2)];
}
function pareils(u, v) { return !!u && !!v && u !== 'R' && v !== 'R' && u.length === v.length && u.every(function (x, i) { return Math.abs(x - v[i]) < 1e-9; }); }
/* « ajoute 3 », « soustrait 2x », « multiplie … par \(-2\) » → une fonction qui transforme un membre. */
function operation(t) {
  t = txt(t).replace(/\\\(|\\\)/g, '');
  var m = /(ajoute|soustrait) (\d*)(x?)( |$|\.)/.exec(t), k;
  if (m) {
    k = (m[2] === '' ? 1 : +m[2]) * (m[1] === 'soustrait' ? -1 : 1);
    if (m[2] === '' && !m[3]) return null;
    return { famille: 'add', f: m[3] ? function (f) { return function (x) { return f(x) + k * x; }; } : function (f) { return function (x) { return f(x) + k; }; } };
  }
  m = /(multiplie|divise) (?:les deux membres )?par (-?\d+)/.exec(t);
  if (!m) return null;
  k = +m[2];
  return { famille: 'mul', f: m[1] === 'multiplie' ? function (f) { return function (x) { return k * f(x); }; } : function (f) { return function (x) { return f(x) / k; }; } };
}
var TABLE = [
  [/Ajouter un même nombre/, true], [/par \\\(0\\\) donne/, false], [/3x = 12/, true], [/x \+ 5 = 8/, false], [/Développer un membre/, false],
  [/x\^2 = 2x/, false], [/exactement les mêmes solutions/, true], [/dfrac\{x\}\{3\} = 2/, true], [/2x \+ 1 = 7/, true], [/2\(x \+ 1\) = 6/, false],
  [/3x = x \+ 4/, true], [/-2x = 6/, false]
];
var vfVus = {}, formes = { dev: 0, red: 0, fac: 0 }, verdicts = { vrai: 0, faux: 0 }, quels = { multiplié: 0, ajouté: 0, divisé: 0 };

for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 977 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|null|\[object|\+ -|- -|\+-|--|\b1x|\b0x/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 200));
  if (!q.etapes || q.etapes.length < 2) ko('P' + p + ' correction trop courte');
  if (!q.indices || !q.indices.length) ko('P' + p + ' pas d\'indice');
  var nom = 'P' + p + ' ' + txt(q.enonce).slice(0, 90), eqs = [], re = /\\\((.*?)\\\)/g, m;
  while ((m = re.exec(q.enonce))) eqs.push(m[1]);

  if (q.type === 'qcm') {
    if (q.choix.length !== 4 || q.choix.some(function (c, i) { return q.choix.indexOf(c) !== i; })) { ko(nom + ' : 4 propositions distinctes attendues'); continue; }
    if (!(q.correct >= 0 && q.correct < 4)) { ko(nom + ' : bonne réponse absente des propositions'); continue; }
  }
  if (q.type === 'qcm' && /Quelle équation obtient-on/.test(q.enonce)) {
    compte('résultat');
    var op = operation(/On <strong>(.*?)<\/strong>/.exec(q.enonce)[1]), E = equation(eqs[eqs.length - 1]);
    if (!op || !E) { ko(nom + ' : énoncé illisible'); continue; }
    if ((op.famille === 'add') !== (p === 1)) ko(nom + ' : au palier ' + p + ', l\'opération n\'est pas de la bonne famille');
    var R0 = racines(E), attL = op.f(E.L), attR = op.f(E.R);
    q.choix.forEach(function (c, i) {
      var C = equation(c);
      if (!C) return ko(nom + ' : proposition illisible ' + c);
      var juste = memes(C.L, attL) && memes(C.R, attR);
      if (juste !== (i === q.correct)) ko(nom + ' : ' + c + (juste ? ' est le résultat' : ' n\'est pas le résultat') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
      if (i !== q.correct && pareils(racines(C), R0)) ko(nom + ' : le leurre ' + c + ' est équivalent à l\'équation de départ');
      if (i === q.correct && !pareils(racines(C), R0)) ko(nom + ' : la bonne réponse ' + c + ' n\'a pas les solutions de départ');
    });
    if (!/même opération des deux côtés/.test(txt(q.etapes[0])) || !/équivalentes/.test(txt(q.etapes.join(' ')))) ko(nom + ' : la correction doit dire la règle');
    var sol = /solution, x = (-?\d+)/.exec(txt(q.etapes.join(' ')).replace(/\\\(|\\\)/g, ''));
    if (!sol || !pareils([+sol[1]], R0)) ko(nom + ' : la solution donnée en correction n\'est pas celle de l\'équation');
  } else if (q.type === 'qcm' && /Quelle opération/.test(q.enonce)) {
    compte('opération');
    var E1 = equation(eqs[0]), E2 = equation(eqs[1]);
    if (!E1 || !E2) { ko(nom + ' : énoncé illisible'); continue; }
    var bonnes = 0;
    q.choix.forEach(function (c, i) {
      var o = operation(c);
      if (!o) return ko(nom + ' : opération illisible « ' + c + ' »');
      var juste = memes(o.f(E1.L), E2.L) && memes(o.f(E1.R), E2.R);
      if (juste) bonnes++;
      if (juste !== (i === q.correct)) ko(nom + ' : « ' + txt(c) + ' » ' + (juste ? 'convient' : 'ne convient pas') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
      if (i === q.correct && (o.famille === 'add') !== (p === 1)) ko(nom + ' : au palier ' + p + ', l\'opération n\'est pas de la bonne famille');
    });
    if (bonnes !== 1) ko(nom + ' : ' + bonnes + ' opérations conviennent');
    if (!pareils(racines(E1), racines(E2))) ko(nom + ' : les deux équations de l\'énoncé devraient être équivalentes');
  } else if (q.type === 'qcm' && /Laquelle de ces équations est/.test(q.enonce)) {
    var O = equation(eqs[0]);
    if (!O) { ko(nom + ' : équation illisible ' + eqs[0]); continue; }
    var f = /\^2/.test(eqs[0]) ? 'fac' : /^-?\d+\(/.test(eqs[0]) ? 'dev' : 'red';
    formes[f]++; compte('réécriture');
    if (p < 3) ko(nom + ' : pas de réécriture avant le palier 3');
    if (f === 'fac' && p !== 4) ko(nom + ' : la factorisation est réservée au palier 4');
    var RO = racines(O), nb = 0;
    q.choix.forEach(function (c, i) {
      var C = equation(c);
      if (!C) return ko(nom + ' : proposition illisible ' + c);
      var eqv = pareils(racines(C), RO);
      if (eqv) nb++;
      if (eqv !== (i === q.correct)) ko(nom + ' : ' + c + (eqv ? ' est équivalente' : ' n\'est pas équivalente') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
      // la bonne réponse réécrit le membre de gauche sans changer sa valeur, ni toucher à celui de droite
      if (i === q.correct && (!memes(C.L, O.L) || !memes(C.R, O.R))) ko(nom + ' : la bonne réponse ' + c + ' ne vaut pas l\'équation de départ membre à membre');
    });
    if (nb !== 1) ko(nom + ' : ' + nb + ' propositions équivalentes');
    if (f === 'fac' && (RO.length !== 2 || !/perdre la solution/.test(txt(q.etapes.join(' '))))) ko(nom + ' : la factorisation doit avoir deux solutions et rappeler le piège de la simplification par x');
    if (f === 'fac' && !q.choix.some(function (c) { var C = equation(c), r = C && racines(C); return r && r.length === 1 && Math.abs(r[0] - RO.filter(function (v) { return v !== 0; })[0]) < 1e-9; }))
      ko(nom + ' : le leurre « simplifié par x » manque');
  } else if (q.type === 'vraifaux' && /sont <strong>équivalentes/.test(q.enonce)) {
    compte('équivalentes ?');
    if (p < 3) ko(nom + ' : pas avant le palier 3');
    var A = equation(eqs[0]), B = equation(eqs[1]);
    if (!A || !B) { ko(nom + ' : énoncé illisible'); continue; }
    var ra = racines(A), rb = racines(B), eq = pareils(ra, rb);
    if (!ra || ra.length !== 1 || !rb || rb === 'R' || rb.length !== 1) ko(nom + ' : chaque équation doit avoir une solution');
    if (eqs[0] === eqs[1]) ko(nom + ' : deux fois la même équation');
    if ((q.correct === 0) !== eq) ko(nom + ' : annoncé ' + (q.correct === 0 ? 'vrai' : 'faux') + ' alors que les solutions sont ' + ra + ' et ' + rb);
    verdicts[eq ? 'vrai' : 'faux']++;
    // la correction donne les solutions : on les relit
    var cor = q.etapes.join(' '), sols = [], rs = /(?:solution|seconde) \\\(x = (-?\\dfrac\{\d+\}\{\d+\}|-?\d+)\\\)/g, ms;
    while ((ms = rs.exec(cor))) { var fs = expr(ms[1]); sols.push(fs ? fs(0) : NaN); }
    if (eq ? !(sols.length >= 1 && Math.abs(sols[0] - ra[0]) < 1e-9)
           : !(sols.length >= 2 && Math.abs(sols[sols.length - 2] - ra[0]) < 1e-9 && Math.abs(sols[sols.length - 1] - rb[0]) < 1e-9))
      ko(nom + ' : les solutions écrites en correction (' + sols + ') ne sont pas ' + ra + ' et ' + rb);
    if (!eq) {
      var mc = /aurait donné \\\((.*?)\\\)/.exec(cor), Cc = mc && equation(mc[1]);
      if (!Cc || !pareils(racines(Cc), ra)) ko(nom + ' : l\'équation « faite correctement » de la correction n\'est pas équivalente à la première');
    }
  } else if (q.type === 'vraifaux') {
    compte('vrai/faux');
    if (p === 1 || p === 4) ko(nom + ' : les vrai/faux de règle sont aux paliers 2 et 3');
    var t = TABLE.filter(function (r) { return r[0].test(q.enonce); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + txt(q.enonce));
    else { vfVus[TABLE.indexOf(t[0])] = 1; if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(q.enonce)); }
  } else if (q.type === 'nombre') {
    compte('par quel nombre');
    if (p !== 4) ko(nom + ' : réservé au palier 4');
    var F1 = equation(eqs[0]), F2 = equation(eqs[1]), v = /<strong>(multiplié|ajouté|divisé)<\/strong>/.exec(q.enonce);
    if (!F1 || !F2 || !v) { ko(nom + ' : énoncé illisible'); continue; }
    quels[v[1]]++;
    var k = q.reponse;
    if (typeof k !== 'number' || k === 0 || (v[1] !== 'ajouté' && k === 1)) ko(nom + ' : réponse sans intérêt ' + k);
    var tr = v[1] === 'multiplié' ? function (h) { return function (x) { return k * h(x); }; }
           : v[1] === 'ajouté' ? function (h) { return function (x) { return h(x) + k; }; }
           : function (h) { return function (x) { return h(x) / k; }; };
    if (!memes(tr(F1.L), F2.L) || !memes(tr(F1.R), F2.R)) ko(nom + ' : ' + k + ' ne fait pas passer de la première équation à la seconde');
    if (!MathsReponse.valide(q, String(k).replace('-', '−')).ok) ko(nom + ' : la réponse attendue « ' + k + ' » est refusée');
    if (MathsReponse.valide(q, String(-k)).ok) ko(nom + ' : la réponse de signe opposé est acceptée');
    if (v[1] === 'multiplié' && !/dfrac\{x\}/.test(eqs[0])) ko(nom + ' : la multiplication doit chasser un dénominateur');
  } else {
    ko(nom + ' : énoncé non reconnu (' + q.type + ')');
  }
}
if (Object.keys(vfVus).length !== TABLE.length) ko('vrai/faux jamais tirés : ' + (TABLE.length - Object.keys(vfVus).length));
['dev', 'red', 'fac'].forEach(function (k) { if (formes[k] < 40) ko('réécriture « ' + k + ' » tirée ' + formes[k] + ' fois seulement'); });
['vrai', 'faux'].forEach(function (k) { if (verdicts[k] < 100) ko('« équivalentes ? » : verdict ' + k + ' tiré ' + verdicts[k] + ' fois seulement'); });
['multiplié', 'ajouté', 'divisé'].forEach(function (k) { if (quels[k] < 20) ko('« par quel nombre » : ' + k + ' tiré ' + quels[k] + ' fois seulement'); });
['résultat', 'opération', 'vrai/faux', 'équivalentes ?', 'réécriture', 'par quel nombre'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE OPÉRATION EST REFAITE ICI, ET UNE SEULE PROPOSITION GARDE LES SOLUTIONS DE DÉPART');
