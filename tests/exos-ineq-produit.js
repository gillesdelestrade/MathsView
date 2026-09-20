/*
 * Les exercices « Inéquations produit » (2nde).
 *
 * L'inéquation de l'énoncé est relue depuis son LaTeX — deux facteurs, un
 * sens — et l'ensemble annoncé n'est jamais cru : on évalue le produit sur une
 * grille qui passe par les zéros, juste à côté, entre eux et loin, et
 * l'appartenance à S doit coïncider partout. Le lecteur doit accepter la
 * réponse attendue (et « R », « ∅ » quand c'est la réponse), refuser les
 * crochets inversés en le disant. Les zéros demandés au palier 1 sont
 * recalculés, les QCM jugés proposition par proposition (intervalle de signe
 * d'un facteur, règle des signes d'une colonne, lecture inverse), les vrai/faux
 * contre une table indépendante. Les paliers tiennent leur promesse : pas de
 * produit au palier 1, des zéros entiers au palier 2, des zéros non entiers et
 * des zéros doubles au palier 4.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/inequations-produit.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function nb(t) {
  t = String(t).replace(/−/g, '-').replace(/\{,\}/g, '.').replace(',', '.').replace(/\\dfrac\{(-?\d+)\}\{(\d+)\}/, '$1/$2').replace(/\s/g, '');
  var m = /^(-?)(\d+)\/(\d+)$/.exec(t);
  if (m) return (m[1] ? -1 : 1) * +m[2] / +m[3];
  m = /^-\((\d+)\/(\d+)\)$/.exec(t);
  return m ? -m[1] / m[2] : parseFloat(t);
}
// « 2x - 4 » (TeX) → [a, b]
function coefs(f) {
  var s = f.replace(/\s/g, '').replace(/−/g, '-');
  var m = /^(-?\d*)x([+-]\d+)?$/.exec(s);
  if (!m) return null;
  var a = m[1] === '' ? 1 : m[1] === '-' ? -1 : +m[1];
  return [a, m[2] ? +m[2] : 0];
}
function litProduit(tex) {
  var m = /^\((.*?)\)\((.*?)\) (<|>|\\leqslant|\\geqslant) 0$/.exec(tex);
  if (!m) return null;
  var F1 = coefs(m[1]), F2 = coefs(m[2]);
  if (!F1 || !F2) return null;
  var rel = m[3];
  return { a: F1[0], b: F1[1], c: F2[0], d: F2[1], rel: rel, verite: function (x) {
    var v = (F1[0] * x + F1[1]) * (F2[0] * x + F2[1]), e = 1e-9;
    return rel === '<' ? v < -e : rel === '>' ? v > e : rel === '\\leqslant' ? v <= e : v >= -e;
  } };
}
function dans(morceaux, x) {
  return morceaux.some(function (p) {
    return (x > p.a + 1e-9 || (!p.oa && Math.abs(x - p.a) < 1e-9)) && (x < p.b - 1e-9 || (!p.ob && Math.abs(x - p.b) < 1e-9));
  });
}
function grille(I) {
  var z = [-I.b / I.a, -I.d / I.c], g = [-20, 20, (z[0] + z[1]) / 2];
  z.forEach(function (v) { g.push(v, v - 0.01, v + 0.01, v - 0.5, v + 0.5); });
  return g;
}
var TABLE = [
  [/ou \\\(x \+ 5 > 0/, false], [/produit nul|si et seulement si/, true], [/deux facteurs sont négatifs/, true],
  [/\(x - 4\) \\leqslant 0/, true], [/\(x - 4\) < 0/, false], [/diviser les deux membres/, false],
  [/-2x \+ 6/, false], [/\^2 \\leqslant 0/, true], [/\^2 > 0/, false], [/ordre croissant/, true]
];

var p4 = { fraction: 0, double: 0 };
for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 733 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|\[object|\+ -|- -|\+-|--/.test(tout.replace(/−∞/g, ''))) ko('P' + p + ' texte douteux : ' + tout.slice(0, 160));
  if (!q.etapes || !q.etapes.length) ko('P' + p + ' pas de correction');
  var nom = 'P' + p + ' ' + txt(q.tex || q.enonce).slice(0, 60), m;

  if (q.type === 'intervalle') {
    compte('produit');
    if (p === 1) ko(nom + ' : pas de produit au palier 1');
    var I = litProduit(q.tex);
    if (!I) { ko(nom + ' : énoncé illisible ' + q.tex); continue; }
    if (!q.morceaux) { ko(nom + ' : pas de morceaux'); continue; }
    grille(I).forEach(function (x) { if (dans(q.morceaux, x) !== I.verite(x)) ko(nom + ' : S = ' + q.reponse + ' dit ' + dans(q.morceaux, x) + ' en x = ' + x + ', le produit dit ' + I.verite(x)); });
    var lu = MathsReponse.intervalle(q.reponse, false);
    if (!lu || !MathsReponse.memeEnsemble(lu, q.morceaux)) ko(nom + ' : la réponse écrite « ' + q.reponse + ' » ne dit pas les morceaux');
    if (!MathsReponse.valide(q, q.reponse).ok) ko(nom + ' : la réponse attendue « ' + q.reponse + ' » est refusée');
    if (q.reponse === 'ℝ' && !MathsReponse.valide(q, 'R').ok) ko(nom + ' : « R » refusé');
    if (q.reponse === '∅' && !MathsReponse.valide(q, 'aucune solution').ok) ko(nom + ' : « aucune solution » refusé');
    if (!/∪/.test(q.reponse) && /\[|\]/.test(q.reponse)) {
      var inverse = q.reponse.replace(/[\[\]]/g, function (c) { return c === '[' ? ']' : '['; });
      var v = MathsReponse.valide(q, inverse);
      if (v.ok) ko(nom + ' : les crochets inversés « ' + inverse + ' » acceptés');
      else if (!/crochets/.test(v.message || '')) ko(nom + ' : les crochets inversés doivent être signalés, pas « ' + v.message + ' »');
    }
    var z1 = -I.b / I.a, z2 = -I.d / I.c;
    if (p === 2 && (z1 !== Math.round(z1) || z2 !== Math.round(z2))) ko(nom + ' : zéro non entier au palier 2');
    if (p === 4) { if (z1 !== Math.round(z1) || z2 !== Math.round(z2)) p4.fraction++; if (Math.abs(z1 - z2) < 1e-9) p4.double++; }
    if (!/sg-table/.test(q.etapes.join(''))) ko(nom + ' : la correction doit montrer le tableau de signes');
    if (!/S = /.test(txt(q.etapes[q.etapes.length - 1]))) ko(nom + ' : la correction doit finir par S');
  } else if ((m = /le facteur \\\((.*?)\\\) s'annule/.exec(q.enonce))) {
    compte('zéro');
    var F = coefs(m[1]);
    if (!F) { ko(nom + ' : facteur illisible ' + m[1]); continue; }
    if (Math.abs(F[0] * q.reponse + F[1]) > 1e-9) ko(nom + ' : ' + m[1] + ' ne s\'annule pas en ' + q.reponse);
    var z = -F[1] / F[0];
    if (!MathsReponse.valide(q, String(z).replace('.', ',')).ok && z !== Math.round(z * 10000) / 10000) { /* décimale infinie : normal */ }
    var num = -F[1], den = F[0]; if (den < 0) { num = -num; den = -den; }   // une élève écrit −3/2, pas 3/−2
    if (!MathsReponse.valide(q, num + '/' + den).ok) ko(nom + ' : la fraction ' + num + '/' + den + ' est refusée');
    if (z === Math.round(z) && !MathsReponse.valide(q, String(z)).ok) ko(nom + ' : ' + z + ' refusé');
  } else if ((m = /le facteur \\\((.*?)\\\) est-il strictement <strong>(positif|négatif)/.exec(q.enonce))) {
    compte('signe facteur');
    var F2 = coefs(m[1]), positif = m[2] === 'positif', bons = 0;
    q.choix.forEach(function (c, i) {
      var mo = MathsReponse.intervalle(c, false);
      if (!mo) return ko(nom + ' : choix illisible ' + c);
      // le choix convient s'il est exactement l'ensemble où le facteur a le signe voulu
      var zf = -F2[1] / F2[0], ok = true;
      [zf - 3, zf - 0.01, zf, zf + 0.01, zf + 3, -zf - 0.01, -zf + 0.01].forEach(function (x) {
        var s = F2[0] * x + F2[1], veut = positif ? s > 1e-9 : s < -1e-9;
        if (dans(mo, x) !== veut) ok = false;
      });
      if (ok) bons++;
      if (ok !== (i === q.correct)) ko(nom + ' : le choix ' + c + (ok ? ' convient' : ' ne convient pas') + ' mais ' + (i === q.correct ? 'est annoncé bon' : 'ne l\'est pas'));
    });
    if (bons !== 1) ko(nom + ' : ' + bons + ' bons choix');
  } else if ((m = /premier facteur est <b>(.)<\/b> et le second est <b>(.)<\/b>/.exec(q.enonce))) {
    compte('colonne');
    var s = (m[1] === '+' ? 1 : -1) * (m[2] === '+' ? 1 : -1);
    if (q.choix[q.correct] !== (s > 0 ? '+' : '−')) ko(nom + ' : ' + m[1] + ' × ' + m[2] + ' annoncé ' + q.choix[q.correct]);
  } else if (q.type === 'vraifaux') {
    compte('vrai/faux');
    var t = TABLE.filter(function (r) { return r[0].test(q.enonce); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + txt(q.enonce));
    else if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(q.enonce));
  } else if ((m = /solutions \\\(S = (.*?)\\\) \?$/.exec(q.enonce))) {
    compte('laquelle');
    var Stxt = m[1].replace(/\\infty/g, '∞').replace(/\\cup/g, '∪').replace(/\\,;/g, ';').replace(/\s/g, '');
    var mo2 = MathsReponse.intervalle(Stxt, false);
    if (!mo2) { ko(nom + ' : S illisible ' + Stxt); continue; }
    var bons2 = 0;
    q.choix.forEach(function (c, i) {
      var I3 = litProduit(c.replace(/^\\\(|\\\)$/g, ''));
      if (!I3) return ko(nom + ' : proposition illisible ' + c);
      var ok = grille(I3).concat(mo2.map(function (pc) { return pc.a; }), mo2.map(function (pc) { return pc.b; }))
        .filter(isFinite).every(function (x) { return dans(mo2, x) === I3.verite(x); });
      if (ok) bons2++;
      if (ok !== (i === q.correct)) ko(nom + ' : ' + c + (ok ? ' convient' : ' ne convient pas') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
    });
    if (bons2 !== 1) ko(nom + ' : ' + bons2 + ' propositions justes');
  } else {
    ko(nom + ' : énoncé non reconnu (' + q.type + ')');
  }
}
if (p4.fraction < 30) ko('palier 4 : seulement ' + p4.fraction + ' zéros non entiers');
if (p4.double < 30) ko('palier 4 : seulement ' + p4.double + ' zéros doubles');
['produit', 'zéro', 'signe facteur', 'colonne', 'vrai/faux', 'laquelle'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ENSEMBLE ANNONCÉ EST CELUI DU PRODUIT, ZÉROS, SENS, CROCHETS ET MORCEAUX COMPRIS');
