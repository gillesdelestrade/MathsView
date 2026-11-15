/*
 * Les exercices « Inverse et division de quotients » (2nde).
 *
 * Chaque calcul est relu depuis son LaTeX — fractions emboîtées (écriture à
 * étages), parenthèses, ÷ et × — et REFAIT ici, avec les priorités du
 * langage : la réponse annoncée doit être cette valeur. Pour un inverse, le
 * produit du nombre par la réponse doit valoir 1. La dernière ligne de la
 * correction porte le résultat en gras : il est relu, doit valoir la réponse
 * et être une fraction IRRÉDUCTIBLE à dénominateur positif. Chaque égalité
 * écrite dans la correction (« … = … = … ») est vérifiée membre à membre.
 * Les QCM sont jugés proposition par proposition (une seule juste), le
 * quotient littéral en plusieurs valeurs de x, les vrai/faux contre une table
 * indépendante. La validation doit accepter la fraction et refuser son
 * inverse et son opposé. Paliers : inverses au 1, divisions positives au 2,
 * signes au 3, étages / priorités / nombre manquant / lettres au 4.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/quotients-division.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

/* Du LaTeX à une fonction de x. Les \dfrac emboîtées sont dépliées de l'intérieur. */
function expr(t) {
  var s = String(t).replace(/\\left|\\right|\\;/g, ''), avant;
  do { avant = s; s = s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))'); } while (s !== avant);
  s = s.replace(/\\div/g, '/').replace(/\\times/g, '*').replace(/\s+/g, '').replace(/(\d)x/g, '$1*x');
  if (/[\\{}]/.test(s)) return null;
  try { var f = new Function('x', 'return (' + s + ');'); f(1.5); return f; } catch (e) { return null; }
}
function val(t) { var f = expr(t); return f ? f(1.5) : NaN; }
function proche(u, v) { return Math.abs(u - v) < 1e-9; }
// « -\dfrac{9}{8} » ou « 5 » → { n, d }
function fraction(t) {
  var m = /^(-?)\\dfrac\{(\d+)\}\{(\d+)\}$/.exec(t.trim());
  if (m) return { n: (m[1] ? -1 : 1) * +m[2], d: +m[3] };
  return /^-?\d+$/.test(t.trim()) ? { n: +t, d: 1 } : null;
}
function ecrit(v) {                       // la valeur telle qu'un élève la taperait
  for (var d = 1; d <= 400; d++) if (proche(v * d, Math.round(v * d))) return (d === 1 ? String(Math.round(v)) : Math.round(v * d) + '/' + d).replace('-', '−');
  return null;
}
/* Toutes les égalités « a = b = c » des blocs \( … \) d'une correction doivent être vraies. */
function egalites(nom, etapes) {
  etapes.forEach(function (e) {
    var re = /\\\((.*?)\\\)/g, m;
    while ((m = re.exec(e))) {
      if (/\\square|x/.test(m[1]) || m[1].indexOf('=') < 0) continue;
      var parts = m[1].split('=').map(val);
      if (parts.some(isNaN)) { ko(nom + ' : égalité illisible dans la correction : ' + m[1]); continue; }
      for (var i = 1; i < parts.length; i++) if (!proche(parts[i], parts[0])) ko(nom + ' : égalité fausse dans la correction : ' + m[1]);
    }
  });
}
var TABLE = [
  [/dfrac\{3\}\{5\}\\\) est \\\(-/, false], [/c'est multiplier par \\\(2\\\)/, true], [/dfrac\{3\}\{2\} \\times \\dfrac\{4\}\{5\}/, false], [/n'a pas d'inverse/, true],
  [/inverse de \\\(-4\\\)/, false], [/6 \\div \\dfrac\{1\}\{3\} = 2/, false], [/par son inverse vaut/, true], [/un nombre plus grand/, true],
  [/dfrac\{5\}\{7\} \\div 5/, true], [/inverse de l'inverse/, true], [/dfrac\{3\}\{4\} \\div \\dfrac\{3\}\{4\} = 0/, false], [/dfrac\{1\}\{6\}\\\) est \\\(6/, true]
];
var vfVus = {}, signes = { '-+': 0, '+-': 0, '--': 0 }, formes = { qq: 0, qe: 0, eq: 0 }, prio = { division: 0, parentheses: 0 }, reduits = 0;

for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 613 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  tout = tout.replace(/On écrit \\\((-?\d+) = -?\\dfrac\{\d+\}\{1\}\\\)/g, 'On écrit $1 sur 1');      // « 5 = 5/1 » est voulu
  if (/undefined|NaN|null|\[object|\+ -|- -|\+-|--|\{0\}|\b1x|1 \\times|\\times 1[^\d]|\}\{1\}/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 220));
  if (!q.etapes || q.etapes.length < 2) ko('P' + p + ' correction trop courte');
  if (!q.indices || !q.indices.length) ko('P' + p + ' pas d\'indice');
  var nom = 'P' + p + ' ' + txt(q.enonce).slice(0, 50) + ' ' + (q.tex || '');
  var fin = /<b>\\\((.*?)\\\)<\/b>/.exec(q.etapes[q.etapes.length - 1] || '');

  if (q.type === 'nombre') {
    var attendu;
    if (/inverse<\/strong> de/.test(q.enonce)) {
      compte('inverse');
      var x = val(/de \\\((.*?)\\\)/.exec(q.enonce)[1]);
      if ((x < 0) !== (p === 3)) ko(nom + ' : signe de l\'inverse au mauvais palier');
      if (!proche(x * q.reponse, 1)) ko(nom + ' : ' + x + ' × ' + q.reponse + ' ne vaut pas 1');
      if (proche(x, 1) || proche(x, -1)) ko(nom + ' : l\'inverse de ±1 est sans intérêt');
      attendu = 1 / x;
    } else if (/\\square/.test(q.tex || '')) {
      compte('nombre manquant');
      if (p !== 4) ko(nom + ' : réservé au palier 4');
      var ms = /^(.*) \\div \\square = (.*)$/.exec(q.tex);
      if (!ms) { ko(nom + ' : énoncé illisible'); continue; }
      attendu = val(ms[1]) / val(ms[2]);
      if (!proche(val(ms[1]) / q.reponse, val(ms[2]))) ko(nom + ' : la réponse mise dans la case ne donne pas le résultat');
    } else {
      attendu = val(q.tex);
      if (isNaN(attendu)) { ko(nom + ' : calcul illisible'); continue; }
      var etages = /^\\dfrac\{\\;/.test(q.tex), ops = (q.tex.match(/\\div|\+| - /g) || []).length;
      if (ops >= 2) {
        compte('priorité');
        if (p !== 4) ko(nom + ' : les priorités sont au palier 4');
        if (/\\left\(/.test(q.tex)) { prio.parentheses++; if (!/parenthèses d'abord/.test(txt(q.etapes[0]))) ko(nom + ' : la correction doit commencer par les parenthèses'); }
        else { prio.division++; if (!/division est prioritaire/.test(txt(q.etapes[0]))) ko(nom + ' : la correction doit dire que la division est prioritaire'); }
        if (attendu <= 0) ko(nom + ' : résultat négatif ou nul');
      } else {
        compte(etages ? 'étages' : 'division');
        if (etages !== (p === 4)) ko(nom + ' : l\'écriture à étages est au palier 4, et seulement là');
        if (etages && !/grand trait/.test(txt(q.etapes[0]))) ko(nom + ' : la correction doit lire le grand trait comme une division');
        var md = etages ? /^\\dfrac\{\\;(.*)\\;\}\{(.*)\}$/.exec(q.tex) : /^(.*) \\div (.*)$/.exec(q.tex);
        if (!md) { ko(nom + ' : division illisible'); continue; }
        var A = val(md[1]), B = val(md[2]);
        if (!proche(A / B, attendu)) ko(nom + ' : lecture incohérente');
        if (!etages) formes[Number.isInteger(A) ? 'eq' : Number.isInteger(B) ? 'qe' : 'qq']++;
        var sg = (A < 0 ? '-' : '+') + (B < 0 ? '-' : '+');
        if (sg !== '++') { signes[sg]++; if (p < 3) ko(nom + ' : pas de signe avant le palier 3'); if (B < 0 && !/\\left\(/.test(q.tex) && !etages) ko(nom + ' : un diviseur négatif s\'écrit entre parenthèses'); }
        else if (p === 3) ko(nom + ' : au palier 3, la division porte un signe');
        if (proche(Math.abs(attendu), 1)) ko(nom + ' : résultat ±1, sans intérêt');
        if (!/multiplier par son inverse/.test(txt(q.etapes.join(' ')))) ko(nom + ' : la correction doit dire « multiplier par son inverse »');
        var nb = (A < 0 ? 1 : 0) + (B < 0 ? 1 : 0), dit = txt(q.etapes.join(' '));
        if ((nb === 1) !== /Un seul signe/.test(dit) || (nb === 2) !== /Deux signes/.test(dit)) ko(nom + ' : la règle des signes est mal annoncée');
        if (/On simplifie par/.test(dit)) reduits++;
      }
    }
    if (!proche(q.reponse, attendu)) ko(nom + ' : réponse ' + q.reponse + ' au lieu de ' + attendu);
    // la dernière ligne : le résultat, en gras, irréductible
    var F = fin && fraction(fin[1]);
    if (!F) ko(nom + ' : la correction doit finir par le résultat en gras');
    else {
      if (!proche(F.n / F.d, q.reponse)) ko(nom + ' : le résultat écrit en correction (' + fin[1] + ') n\'est pas la réponse');
      if (pgcd(F.n, F.d) !== 1 || F.d < 1 || (F.d === 1 && /dfrac/.test(fin[1]))) ko(nom + ' : ' + fin[1] + ' n\'est pas irréductible');
    }
    egalites(nom, q.etapes);
    var e = ecrit(q.reponse);
    if (!e || !MathsReponse.valide(q, e).ok) ko(nom + ' : la réponse « ' + e + ' » est refusée');
    if (MathsReponse.valide(q, ecrit(-q.reponse)).ok) ko(nom + ' : l\'opposé de la réponse est accepté');
    if (!proche(Math.abs(q.reponse), 1) && MathsReponse.valide(q, ecrit(1 / q.reponse)).ok) ko(nom + ' : l\'inverse de la réponse est accepté');
  } else if (q.type === 'qcm') {
    if (q.choix.length !== 4 || q.choix.some(function (c, i) { return q.choix.indexOf(c) !== i; }) || !(q.correct >= 0 && q.correct < 4)) { ko(nom + ' : 4 propositions distinctes et une bonne réponse attendues'); continue; }
    if (/Lequel de ces nombres est l'/.test(txt(q.enonce))) {
      compte('inverse (qcm)');
      if (p !== 1) ko(nom + ' : au palier 1 seulement');
      var x0 = val(/de \\\((.*?)\\\)/.exec(q.enonce)[1]), bons = 0, opp = false;
      q.choix.forEach(function (c, i) {
        var v = val(c.replace(/^\\\(|\\\)$/g, '')), ok = proche(v * x0, 1);
        if (ok) bons++;
        if (proche(v, -x0)) opp = true;
        if (ok !== (i === q.correct)) ko(nom + ' : ' + c + ' mal jugé');
      });
      if (bons !== 1) ko(nom + ' : ' + bons + ' inverses proposés');
      if (!opp) ko(nom + ' : l\'opposé doit figurer parmi les leurres');
      egalites(nom, q.etapes);
    } else {
      compte('littéral');
      if (p !== 4) ko(nom + ' : au palier 4 seulement');
      var me = /expression \\\((.*?)\\\) est égale/.exec(q.enonce), E = me && expr(me[1]);
      if (!E) { ko(nom + ' : expression illisible'); continue; }
      var justes = 0;
      q.choix.forEach(function (c, i) {
        var f = expr(c.replace(/^\\\(|\\\)$/g, ''));
        if (!f) return ko(nom + ' : proposition illisible ' + c);
        var ok = [0.7, 2, -3, 5.5].every(function (x) { return proche(f(x), E(x)); });
        if (ok) justes++;
        if (ok !== (i === q.correct)) ko(nom + ' : ' + c + (ok ? ' est égale' : ' n\'est pas égale') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
      });
      if (justes !== 1) ko(nom + ' : ' + justes + ' propositions égales à l\'expression');
      var fl = fin && expr(fin[1]);
      if (!fl || ![0.7, 2, -3].every(function (x) { return proche(fl(x), E(x)); })) ko(nom + ' : le résultat écrit en correction n\'est pas égal à l\'expression');
    }
  } else if (q.type === 'vraifaux') {
    compte('vrai/faux');
    if (p !== 3) ko(nom + ' : les vrai/faux sont au palier 3');
    var t = TABLE.filter(function (r) { return r[0].test(q.enonce); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + txt(q.enonce));
    else { vfVus[TABLE.indexOf(t[0])] = 1; if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(q.enonce)); }
    egalites(nom, q.etapes.slice(0, 1));
  } else ko(nom + ' : type inattendu ' + q.type);
}
if (Object.keys(vfVus).length !== TABLE.length) ko('vrai/faux jamais tirés : ' + (TABLE.length - Object.keys(vfVus).length));
['-+', '+-', '--'].forEach(function (k) { if (signes[k] < 30) ko('signes ' + k + ' tirés ' + signes[k] + ' fois seulement'); });
['qq', 'qe', 'eq'].forEach(function (k) { if (formes[k] < 60) ko('forme ' + k + ' tirée ' + formes[k] + ' fois seulement'); });
['division', 'parentheses'].forEach(function (k) { if (prio[k] < 50) ko('priorité « ' + k + ' » tirée ' + prio[k] + ' fois seulement'); });
if (reduits < 100) ko('trop peu de résultats à simplifier : ' + reduits);
['inverse', 'inverse (qcm)', 'division', 'vrai/faux', 'étages', 'priorité', 'nombre manquant', 'littéral'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE CALCUL EST REFAIT DEPUIS SON LATEX, CHAQUE ÉGALITÉ DE CORRECTION VÉRIFIÉE, CHAQUE RÉSULTAT IRRÉDUCTIBLE');
