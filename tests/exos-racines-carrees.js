/*
 * Les exercices « Racines carrées » (2nde).
 *
 * Tout est refait à côté : la racine annoncée est élevée au carré et confrontée
 * au nombre de l'énoncé ; √(a²) doit valoir |a| pour l'a relu dans l'énoncé ;
 * la forme a√b est recomposée (a²b doit redonner n) et b vérifié sans facteur
 * carré ; l'encadrement, le produit et les solutions de x² = k sont recalculés,
 * et chaque QCM n'a qu'une bonne réponse. Les vrai/faux sont confrontés à une
 * table indépendante. Enfin, le lecteur de réponses doit accepter « 2√3 » et
 * « 2*rac(3) » là où on les attend, et refuser une valeur approchée.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/racines-carrees.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').replace(/−/g, '-').trim(); }
function num(s) { return parseFloat(String(s).replace(/[{}]/g, '').replace(',', '.').replace(/−/g, '-').replace(/[()]/g, '')); }
function sansCarre(m) { for (var d = 2; d * d <= m; d++) if (m % (d * d) === 0) return false; return true; }

var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }

/* Les vrai/faux, jugés indépendamment du générateur. */
var TABLE = [
  [/a\^2\} = a\\\)\.$/, false], [/= \|a\|/, true], [/\\pm/, false], [/sqrt\{-4\}/, false],
  [/\(\\sqrt\{5\}\)\^2/, true], [/sqrt\{0\}/, true], [/9 \+ 16/, false], [/9 \\times 16/, true],
  [/n'existe pas, car/, false], [/= -a/, true]
];

for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 977 + g), p);
  var tout = q.enonce + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 140));
  if (!q.etapes || !q.etapes.length) ko('P' + p + ' pas de correction');
  if (q.choix) {
    var vus = {};
    q.choix.forEach(function (c) { if (vus[c]) ko('P' + p + ' deux choix identiques : ' + c); vus[c] = 1; });
    if (q.correct < 0 || q.correct >= q.choix.length) ko('P' + p + ' réponse hors bornes');
  }
  if (q.type === 'nombre' && !(q.reponse >= 0)) ko('P' + p + ' une racine carrée négative : ' + q.reponse + ' dans ' + txt(q.enonce));
  if (q.type === 'nombre' && !MathsReponse.valide(q, String(q.reponse).replace('.', ',')).ok)
    ko('P' + p + ' la bonne réponse ' + q.reponse + ' est refusée : ' + txt(q.enonce));
  var e = q.enonce, m;

  if ((m = /^Calcule \\\(\\sqrt\{(\d+)\}\\\)\.$/.exec(e))) {
    compte('carre parfait');
    if (q.reponse * q.reponse !== +m[1]) ko('√' + m[1] + ' = ' + q.reponse + ' ?');
    if (p === 1 && q.reponse > 12) ko('P1 : ' + m[1] + ' trop grand pour un premier palier');
  } else if (/n'a pas.*de racine carrée/.test(e)) {
    compte('existe');
    q.choix.forEach(function (c, i) {
      var v = num(c);
      if (i === q.correct && !(v < 0)) ko('existe : la bonne réponse ' + c + ' n\'est pas négative');
      if (i !== q.correct && v < 0) ko('existe : deux nombres négatifs proposés');
    });
  } else if ((m = /\\sqrt\{\(?(-?[\d{,}]+)\)?\^2\}\\\)\.$/.exec(e)) || (m = /a = (-?[\d{,}]+)\\\)\. Combien vaut/.exec(e))) {
    compte('√(a²)');
    var a = num(m[1]);
    if (Math.abs(q.reponse - Math.abs(a)) > 1e-9) ko('√(' + m[1] + ')² = ' + q.reponse + ' au lieu de ' + Math.abs(a));
    if (a < 0 && txt(q.etapes.join(' ')).indexOf('efface le signe') < 0) ko('√(a²) avec a < 0 : la correction doit parler du signe effacé');
    if (p === 2 && a > 0) ko('P2 : √(a²) doit être posé avec a négatif');
  } else if (/^Vrai ou faux/.test(e)) {
    compte('vrai/faux');
    var t = TABLE.filter(function (r) { return r[0].test(e); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + e);
    else if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(e));
  } else if ((m = /\\left\(\\sqrt\{([\d{,}]+)\}\\right\)\^2/.exec(e))) {
    compte('(√a)²');
    if (Math.abs(q.reponse - num(m[1])) > 1e-9) ko('(√' + m[1] + ')² = ' + q.reponse);
  } else if ((m = /\\sqrt\{(\d+)\} \\times \\sqrt\{(\d+)\}/.exec(e))) {
    compte('produit');
    if (q.reponse * q.reponse !== +m[1] * +m[2]) ko('√' + m[1] + ' × √' + m[2] + ' = ' + q.reponse + ' ?');
    if (q.reponse !== Math.round(q.reponse)) ko('produit : ' + q.reponse + ' n\'est pas entier');
  } else if ((m = /\\sqrt\{(\d+)\}\\\) sous la forme/.exec(e))) {
    compte('simplifie');
    var n = +m[1], f = /^(\d+)√(\d+)$/.exec(q.reponse[0]);
    if (q.type !== 'texte') ko('simplifie : le type doit être texte, pour refuser √' + n + ' tel quel');
    if (!f) ko('simplifie : forme attendue illisible ' + q.reponse[0]);
    else {
      var k = +f[1], b = +f[2];
      if (k * k * b !== n) ko('simplifie : ' + k + '√' + b + ' ≠ √' + n);
      if (!sansCarre(b)) ko('simplifie : ' + b + ' a encore un facteur carré');
      if (k < 2) ko('simplifie : rien à simplifier dans √' + n);
      [k + '√' + b, k + ' √' + b, k + '*rac(' + b + ')', k + '×√' + b, k + 'sqrt(' + b + ')'].forEach(function (s) {
        if (!MathsReponse.valide(q, s).ok) ko('simplifie : « ' + s + ' » refusé');
      });
      if (MathsReponse.valide(q, '√' + n).ok) ko('simplifie : √' + n + ' accepté sans simplification');
      if (MathsReponse.valide(q, String(Math.round(k * Math.sqrt(b) * 100) / 100).replace('.', ',')).ok) ko('simplifie : une valeur approchée acceptée');
    }
  } else if ((m = /\\sqrt\{(\d+)\}\\\) est compris entre/.exec(e))) {
    compte('encadre');
    var n2 = +m[1], bons = 0;
    q.choix.forEach(function (c, i) {
      var b2 = /^(\d+) et (\d+)$/.exec(c);
      if (!b2) return ko('encadre : choix illisible ' + c);
      var ok = +b2[1] * +b2[1] < n2 && n2 < +b2[2] * +b2[2] && +b2[2] === +b2[1] + 1;
      if (ok) bons++;
      if (ok !== (i === q.correct)) ko('encadre : √' + n2 + ' et le choix ' + c);
    });
    if (bons !== 1) ko('encadre : ' + bons + ' bonnes réponses pour √' + n2);
  } else if ((m = /\\sqrt\{\((\d+) - (\d+)\)\^2\}/.exec(e))) {
    compte('expression');
    if (q.reponse !== Math.abs(+m[1] - +m[2])) ko('√((' + m[1] + ' − ' + m[2] + ')²) = ' + q.reponse + ' ?');
  } else if ((m = /x\^2 = (\d+)\\\)/.exec(e))) {
    compte('equation');
    var k2 = +m[1], r = Math.sqrt(k2);
    if (r !== Math.round(r)) ko('equation : ' + k2 + ' n\'est pas un carré parfait');
    var attendu = '{−' + r + ' ; ' + r + '}';
    if (q.choix[q.correct] !== attendu) ko('equation : ' + q.choix[q.correct] + ' au lieu de ' + attendu);
    q.choix.forEach(function (c, i) { if (i !== q.correct && c === attendu) ko('equation : deux bonnes réponses'); });
  } else {
    ko('P' + p + ' énoncé non reconnu : ' + txt(e));
  }
}

/* Le lecteur de nombres, sur les formes nouvelles. */
var q3 = { type: 'nombre', reponse: 2 * Math.sqrt(3) };
if (!MathsReponse.valide(q3, '2√3').ok) ko('le lecteur refuse 2√3');
if (!MathsReponse.valide(q3, '−2√3').ok === false) ko('−2√3 accepté pour 2√3');
if (MathsReponse.valide(q3, '3,46').ok) ko('3,46 accepté pour 2√3');
if (MathsReponse.valide(q3, '3,46').forme !== 'approchee') ko('3,46 devrait être signalé comme valeur approchée');
if (!MathsReponse.valide({ type: 'nombre', reponse: 7 }, '√49').ok) ko('√49 refusé pour 7');

var attendus = ['carre parfait', 'existe', '√(a²)', 'vrai/faux', '(√a)²', 'produit', 'simplifie', 'encadre', 'expression', 'equation'];
attendus.forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RACINE EST POSITIVE ET SON CARRÉ REDONNE L\'ÉNONCÉ, √(a²) = |a|, ET 2√3 EST LU');
