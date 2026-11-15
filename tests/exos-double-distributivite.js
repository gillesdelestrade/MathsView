/*
 * Les exercices « Double distributivité » (2nde).
 *
 * Chaque expression est relue depuis son LaTeX et transformée en fonction de
 * x ; le résultat annoncé est confronté à cette fonction en plusieurs
 * valeurs. QCM : une proposition, et une seule, est égale à l'énoncé pour
 * tout x — et c'est celle qui est déclarée juste ; les leurres sont tous
 * différents. Coefficient demandé : il est recalculé à partir de trois
 * valeurs de l'expression (f(0), f(1), f(−1)). Vrai/faux : l'égalité montrée
 * est testée numériquement, le verdict doit suivre. Calcul astucieux : le
 * produit est refait, et la décomposition écrite dans la correction aussi.
 * Chaque égalité « … = … » de la correction est vérifiée, la dernière ligne
 * porte en gras le résultat. Paliers : tout positif et x seul au 1,
 * coefficients au 2, signes au 3 (et seulement là les vrai/faux), formes
 * composées au 4.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/double-distributivite.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function proche(u, v) { return Math.abs(u - v) < 1e-7; }

/* Du LaTeX à une fonction de x. */
function expr(t) {
  var s = String(t).replace(/\\times/g, '*').replace(/\s+/g, '')
    .replace(/x\^2/g, '(x*x)').replace(/(\d)x/g, '$1*x').replace(/(\d)\(/g, '$1*(').replace(/\)\(/g, ')*(').replace(/\)x/g, ')*x').replace(/^-\(/, '-1*(');
  if (/[\\{}^]/.test(s)) return null;
  try { var f = new Function('x', 'return (' + s + ');'); f(1.5); return f; } catch (e) { return null; }
}
var XS = [-2.5, -1, 0, 0.5, 1, 3, 7];
function egaux(f, g) { return XS.every(function (x) { return proche(f(x), g(x)); }); }
/* Toutes les égalités des blocs \( … \) d'une correction doivent être vraies pour tout x. */
function egalites(nom, etapes) {
  etapes.forEach(function (e) {
    var re = /\\\((.*?)\\\)/g, m;
    while ((m = re.exec(e))) {
      if (m[1].indexOf('=') < 0) continue;
      var parts = m[1].split('=').map(expr);
      if (parts.some(function (f) { return !f; })) { ko(nom + ' : égalité illisible dans la correction : ' + m[1]); continue; }
      for (var i = 1; i < parts.length; i++) if (!egaux(parts[i], parts[0])) ko(nom + ' : égalité fausse dans la correction : ' + m[1]);
    }
  });
}
function signes(tex) { return /-/.test(tex); }
var formesVues = {}, vf = { vrai: 0, faux: 0 }, annule = 0;

for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 911 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|null|\[object|\+ -|- -|\+-|--|\b1x|[^\d]0x|\(\)/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 240));
  if (!q.etapes || q.etapes.length < 3) ko('P' + p + ' correction trop courte');
  if (!q.indices || !q.indices.length) ko('P' + p + ' pas d\'indice');
  if (!q.tex) { ko('P' + p + ' pas d\'expression'); continue; }
  var nom = 'P' + p + ' ' + q.tex;
  var fin = /<b>\\\((.*?)\\\)<\/b>/.exec(q.etapes[q.etapes.length - 1] || '');
  if (!fin) ko(nom + ' : la dernière ligne ne porte pas le résultat en gras');
  egalites(nom, q.etapes);

  if (/\\times/.test(q.tex)) {
    /* --- calcul astucieux ------------------------------------------------ */
    compte('astuce'); if (p !== 4) ko(nom + ' : réservé au palier 4');
    var m = /^(\d+) \\times (\d+)$/.exec(q.tex);
    if (!m || q.type !== 'nombre') { ko(nom + ' : énoncé illisible'); continue; }
    if (q.reponse !== +m[1] * +m[2]) ko(nom + ' : ' + q.reponse + ' au lieu de ' + (+m[1] * +m[2]));
    if (+fin[1] !== q.reponse) ko(nom + ' : le résultat en gras n\'est pas la réponse');
    var m4 = /4 produits : \\\((.*?)\\\)/.exec(q.etapes[1]);
    if (!m4 || !proche(expr(m4[1])(0), q.reponse)) ko(nom + ' : les 4 produits ne redonnent pas le résultat');
    if (m4 && m4[1].split(/ [+-] /).length !== 4) ko(nom + ' : il faut 4 produits');
    if (!MathsReponse.valide(q, String(q.reponse)).ok || MathsReponse.valide(q, String(q.reponse + 10)).ok) ko(nom + ' : validation');
    continue;
  }
  var eqm = q.tex.split(' = '), F = expr(eqm[0]);
  if (!F) { ko(nom + ' : expression illisible'); continue; }
  var forme = /^-?\d*\(.*\)\(.*\) - \(/.test(q.tex) ? 'difference' : /^(-\d*|\d+)\(/.test(q.tex) ? 'devant' : 'simple';
  if ((forme !== 'simple') !== (p === 4)) ko(nom + ' : forme « ' + forme + ' » au mauvais palier');
  if (forme === 'simple') {
    var mm = /^\((-?\d*)x ([+-]) (\d+)\)\((-?\d*)x ([+-]) (\d+)\)$/.exec(eqm[0]);
    if (!mm) { ko(nom + ' : produit illisible'); continue; }
    var coefX = [mm[1], mm[4]].map(function (s) { return s === '' ? 1 : s === '-' ? -1 : +s; });
    if (p === 1 && (coefX[0] !== 1 || coefX[1] !== 1)) ko(nom + ' : au palier 1, x est seul');
    if (p <= 2 && signes(eqm[0])) ko(nom + ' : pas de signe « − » avant le palier 3');
    if (p === 2 && coefX[0] === 1 && coefX[1] === 1) ko(nom + ' : au palier 2, un coefficient devant x');
    if (p === 3 && !signes(eqm[0])) ko(nom + ' : au palier 3, au moins un signe « − »');
    if (mm[3] === '0' || mm[6] === '0') ko(nom + ' : terme nul');
    // la correction : 4 produits, puis leurs valeurs
    var e4 = /4 produits<\/b> : \\\(.*? = (.*?)\\\)/.exec(q.etapes.filter(function (e) { return /4 produits/.test(e); })[0] || '');
    if (!e4 || e4[1].split(' + ').length !== 4) ko(nom + ' : la correction doit écrire les 4 produits');
  }
  compte(forme + ' ' + q.type);

  if (q.type === 'qcm') {
    if (q.choix.length !== 4) ko(nom + ' : 4 propositions attendues');
    var justes = [];
    q.choix.forEach(function (c, i) {
      var f = expr(c.replace(/^\\\(|\\\)$/g, ''));
      if (!f) return ko(nom + ' : proposition illisible ' + c);
      if (egaux(f, F)) justes.push(i);
    });
    if (justes.length !== 1 || justes[0] !== q.correct) ko(nom + ' : ' + justes.length + ' proposition(s) juste(s), déclarée ' + q.correct);
    if (q.choix.some(function (c, i) { return q.choix.indexOf(c) !== i; })) ko(nom + ' : deux propositions identiques');
    if (fin && '\\(' + fin[1] + '\\)' !== q.choix[q.correct]) ko(nom + ' : le résultat en gras n\'est pas la bonne proposition');
  } else if (q.type === 'nombre') {
    var C = F(0), A = (F(1) + F(-1)) / 2 - C, B = (F(1) - F(-1)) / 2;
    var att = /coefficient de \\\(x\^2\\\)/.test(q.enonce) ? A : /coefficient de \\\(x\\\)/.test(q.enonce) ? B : /terme constant/.test(q.enonce) ? C : NaN;
    if (!proche(att, q.reponse)) ko(nom + ' : ' + txt(q.enonce).slice(0, 60) + ' → ' + q.reponse + ' au lieu de ' + att);
    if (p === 1 && /x\^2/.test(q.enonce)) ko(nom + ' : au palier 1 le coefficient de x² vaut toujours 1');
    if (+fin[1] !== q.reponse) ko(nom + ' : le résultat en gras n\'est pas la réponse');
    var red = q.etapes[q.etapes.length - 2].match(/<b>\\\((.*?)\\\)<\/b>/);
    if (!red || !egaux(expr(red[1]), F)) ko(nom + ' : la forme réduite de la correction est fausse');
    if (!MathsReponse.valide(q, String(q.reponse).replace('-', '−')).ok || MathsReponse.valide(q, String(q.reponse + 1)).ok) ko(nom + ' : validation');
  } else if (q.type === 'vraifaux') {
    if (p !== 3) ko(nom + ' : les vrai/faux sont au palier 3');
    var Gd = expr(eqm[1]);
    if (!Gd) { ko(nom + ' : second membre illisible'); continue; }
    var vrai = egaux(F, Gd);
    if ((q.correct === 0) !== vrai) ko(nom + ' : verdict faux');
    if ((/^<b>Vrai/.test(q.etapes[0])) !== vrai) ko(nom + ' : la correction annonce le mauvais verdict');
    vf[vrai ? 'vrai' : 'faux']++;
    if (fin && !egaux(expr(fin[1]), F)) ko(nom + ' : la forme réduite de la correction est fausse');
  } else ko(nom + ' : type inattendu ' + q.type);
  if (forme === 'difference' && /x\^2/.test(q.choix[q.correct])) ko(nom + ' : les x² doivent s\'annuler');
  if (/s'annulent/.test(q.etapes.join(' ')) && forme === 'simple') annule++;
}

['simple qcm', 'simple nombre', 'simple vraifaux', 'astuce', 'devant qcm', 'difference qcm'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });
if (!vf.vrai || !vf.faux) ko('vrai/faux déséquilibrés : ' + JSON.stringify(vf));

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Double distributivité : 2800 énoncés relus et recalculés — ' + Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', ') +
           ' ; vrai/faux ' + vf.vrai + '/' + vf.faux + '.');
