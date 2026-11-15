/*
 * Les exercices « La quantité de matière » (2nde, physique-chimie).
 *
 * Chaque énoncé est RELU et REFAIT avec une table de masses molaires
 * atomiques écrite ici, indépendante de celle du générateur : la formule
 * brute (H₂O, C₆H₁₂O₆…) est redécomposée atome par atome, les nombres en
 * écriture scientifique sont relus avec leurs exposants, et la réponse
 * annoncée doit sortir du calcul — n = N ÷ N_A, N = n × N_A, M par somme,
 * M = m_entité × N_A, n = m ÷ M, m = n × M, et les enchaînements à deux
 * étapes. QCM : la bonne proposition est la seule qui convienne (les leurres
 * en sont éloignés d'au moins 3 %). Identification : m ÷ n désigne une seule
 * espèce de la liste, et c'est celle déclarée. Vrai/faux : jugés contre une
 * table indépendante. Les divisions tombent juste, chaque réponse numérique
 * porte son unité (mol, g, g/mol), la dernière étape de la correction donne
 * la réponse. Paliers : la mole au 1, la masse molaire au 2, n = m ÷ M au 3,
 * les enchaînements au 4.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/pc/2nde/quantite-matiere.js');

var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
var NA = 6.02e23;
var TABLE = { H: 1.0, C: 12.0, N: 14.0, O: 16.0, Na: 23.0, S: 32.1, Cl: 35.5, Fe: 55.8, Cu: 63.5, Zn: 65.4, Al: 27.0, Mg: 24.3, Ca: 40.1, K: 39.1 };
var SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function nb(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }
// « 1,20 × 10²⁴ » → 1.2e24
function sci(s) {
  var m = /(\d,\d\d) × 10(⁻?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/.exec(s);
  if (!m) return NaN;
  var e = +m[3].split('').map(function (c) { return SUP.indexOf(c); }).join('');
  return nb(m[1]) * Math.pow(10, m[2] ? -e : e);
}
// « C₆H₁₂O₆ », « Na⁺ » → masse molaire, recalculée
function molaire(f) {
  var re = /([A-Z][a-z]?)([₀-₉]*)/g, m, M = 0, vu = false;
  while ((m = re.exec(f))) {
    if (!(m[1] in TABLE)) return NaN;
    var k = m[2] === '' ? 1 : +m[2].split('').map(function (c) { return SUB.indexOf(c); }).join('');
    M += TABLE[m[1]] * k; vu = true;
  }
  return vu ? Math.round(M * 10) / 10 : NaN;
}
function rel(u, v) { return Math.abs(u - v) / Math.abs(v); }
var VF = [
  [/le même nombre d'entités/, true], [/ont la même masse/, false], [/s'exprime en mol⁻¹/, true], [/quantité de matière s'exprime en grammes/, false],
  [/masse molaire s'exprime en g\/mol/, true], [/il y a 2 molécules/, false], [/pratiquement celle de son atome/, true], [/contient d'entités/, false],
  [/on additionne les masses molaires/, true], [/de l'ordre de 10⁻²³ g/, true]
];
var PALIERS = { 'n-depuis-N': [1], 'N-depuis-n': [1], 'notion-vf': [1, 2], 'M-molecule': [2], 'M-ion': [2], 'M-entite': [2], n: [3], m: [3],
                'm-vers-N': [4], 'N-vers-m': [4], 'n-M-a-calculer': [4], 'm-M-a-calculer': [4], identifier: [4] };
var UNITES = { 'n-depuis-N': 'mol', 'M-molecule': 'g/mol', 'M-ion': 'g/mol', 'M-entite': 'g/mol', n: 'mol', m: 'g', 'N-vers-m': 'g', 'n-M-a-calculer': 'mol', 'm-M-a-calculer': 'g' };
var vfVus = {}, types = { atome: 0, ion: 0, 'molécule': 0 };

for (var p = 1; p <= 4; p++) for (var g = 0; g < 800; g++) {
  var q = G.genere(MathsAlea(p * 757 + g), p), E = txt(q.enonce), C = (q.etapes || []).map(txt), fam = q.famille;
  var nom = 'P' + p + ' [' + fam + '] ' + E.slice(0, 90);
  var tout = E + '|' + C.join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|null|\[object|Infinity/.test(tout)) ko(nom + ' : texte douteux');
  if (!PALIERS[fam]) { ko(nom + ' : famille inconnue'); continue; }
  if (PALIERS[fam].indexOf(p) < 0) ko(nom + ' : famille au mauvais palier');
  if (!q.etapes || q.etapes.length < 2) ko(nom + ' : correction trop courte');
  if (!q.indices || !q.indices.length) ko(nom + ' : pas d\'indice');
  cpt[fam] = (cpt[fam] || 0) + 1;
  if (/atome/.test(E)) types.atome++; if (/\bions?\b/.test(E)) types.ion++; if (/molécule/.test(E)) types['molécule']++;
  if (q.type === 'nombre') {
    if (q.unite !== UNITES[fam]) ko(nom + ' : unité ' + q.unite + ' au lieu de ' + UNITES[fam]);
    if (!(q.reponse > 0)) ko(nom + ' : réponse non positive');
    var dit = String(q.reponse).replace('.', ',');
    if (C[C.length - 1].indexOf(fam === 'M-entite' ? q.reponse.toFixed(1).replace('.', ',') : dit) < 0 && C[C.length - 2].indexOf(dit) < 0 && C.join(' ').indexOf(q.reponse.toFixed(1).replace('.', ',')) < 0) ko(nom + ' : la correction ne donne pas la réponse ' + dit);
    if (!MathsReponse.valide(q, dit).ok) ko(nom + ' : la réponse « ' + dit + ' » est refusée');
    if (MathsReponse.valide(q, String(q.reponse * 10).replace('.', ',')).ok) ko(nom + ' : dix fois la réponse est acceptée');
  }
  // la formule entre parenthèses — « (II) » de « cuivre(II) » n'en est pas une
  var formule = (E.match(/\(([A-Z][A-Za-z₀-₉⁺⁻²]*)\)/g) || []).map(function (x) { return x.slice(1, -1); }).filter(function (x) { return !isNaN(molaire(x)); })[0] || null;

  if (fam === 'n-depuis-N') {
    var N = sci(E);
    if (rel(N / NA, q.reponse) > 0.006) ko(nom + ' : n = ' + q.reponse + ' pour N = ' + N);
    if (Math.abs(q.reponse * 100 - Math.round(q.reponse * 100)) > 1e-9) ko(nom + ' : la réponse ne tombe pas juste');
  } else if (fam === 'N-depuis-n' || fam === 'm-vers-N') {
    var att;
    if (fam === 'N-depuis-n') att = nb(/dans ([\d,]+) mol/.exec(E)[1]) * NA;
    else {
      var mm = nb(/dans ([\d,]+) g/.exec(E)[1]), M1 = nb(/\) = ([\d,]+) g\/mol/.exec(E)[1]), f1 = /M\(([^)]+)\) =/.exec(E)[1];
      if (Math.abs(molaire(f1) - M1) > 1e-9) ko(nom + ' : masse molaire donnée fausse pour ' + f1);
      att = mm / M1 * NA;
      if (Math.abs(mm / M1 * 100 - Math.round(mm / M1 * 100)) > 1e-6) ko(nom + ' : m ÷ M ne tombe pas juste');
    }
    if (q.choix.length !== 4 || q.choix.some(function (c, i) { return q.choix.indexOf(c) !== i; })) ko(nom + ' : 4 propositions distinctes attendues');
    q.choix.forEach(function (c, i) {
      var v = sci(c);
      if (isNaN(v)) return ko(nom + ' : proposition illisible ' + c);
      if (i === q.correct) { if (rel(v, att) > 0.006) ko(nom + ' : la proposition déclarée juste vaut ' + v + ' au lieu de ' + att); }
      else if (rel(v, att) < 0.03) ko(nom + ' : un leurre est trop proche de la bonne réponse');
    });
  } else if (fam === 'notion-vf') {
    var hit = VF.filter(function (t) { return t[0].test(E); });
    if (hit.length !== 1) ko(nom + ' : affirmation hors table');
    else { vfVus[VF.indexOf(hit[0])] = 1; if ((q.correct === 0) !== hit[0][1]) ko(nom + ' : verdict faux'); if ((/^Vrai/.test(C[0])) !== hit[0][1]) ko(nom + ' : la correction annonce le mauvais verdict'); }
  } else if (fam === 'M-molecule') {
    var f2 = /de formule ([^ .]+)/.exec(E)[1];
    if (Math.abs(molaire(f2) - q.reponse) > 1e-9) ko(nom + ' : M(' + f2 + ') = ' + q.reponse + ' au lieu de ' + molaire(f2));
    var donnes = (E.match(/M\(([A-Z][a-z]?)\) = ([\d,]+)/g) || []);
    donnes.forEach(function (d) { var x = /M\(([A-Z][a-z]?)\) = ([\d,]+)/.exec(d); if (TABLE[x[1]] !== nb(x[2])) ko(nom + ' : donnée atomique fausse ' + d); if (f2.indexOf(x[1]) < 0) ko(nom + ' : donnée inutile ' + d); });
    if (!donnes.length) ko(nom + ' : les masses molaires atomiques ne sont pas données');
    // la somme écrite dans la correction
    var s = /= ([\d,× +]+) = [\d,]+ g\/mol/.exec(C[1]);
    if (!s || Math.abs(eval(s[1].replace(/,/g, '.').replace(/×/g, '*')) - q.reponse) > 1e-6) ko(nom + ' : la somme de la correction est fausse : ' + C[1]);
  } else if (fam === 'M-ion') {
    var mi = /= ([\d,]+) g\/mol/.exec(E), fi = /(\S+) \?$/.exec(E)[1];
    if (nb(mi[1]) !== q.reponse || Math.abs(molaire(fi) - q.reponse) > 1e-9) ko(nom + ' : masse molaire de l\'ion ' + fi + ' fausse');
    if (!/négligeable/.test(C.join(' '))) ko(nom + ' : la correction doit dire que la masse des électrons est négligeable');
  } else if (fam === 'M-entite') {
    var mE = sci(E);
    if (Math.abs(mE * NA - q.reponse) > 0.051) ko(nom + ' : m × N_A = ' + (mE * NA) + ' et non ' + q.reponse);
    if (!(q.tolerance > 0)) ko(nom + ' : une valeur arrondie demande une tolérance');
  } else if (fam === 'n' || fam === 'm' || fam === 'n-M-a-calculer' || fam === 'm-M-a-calculer') {
    var Mx = molaire(formule), donneeM = /M = ([\d,]+) g\/mol/.exec(E), calc = /a-calculer/.test(fam);
    if (isNaN(Mx)) { ko(nom + ' : formule illisible'); continue; }
    if (calc === !!donneeM) ko(nom + ' : la masse molaire est ' + (calc ? 'donnée alors qu\'elle est à calculer' : 'absente'));
    if (donneeM && Math.abs(nb(donneeM[1]) - Mx) > 1e-9) ko(nom + ' : masse molaire donnée ' + donneeM[1] + ' au lieu de ' + Mx);
    if (calc && !/D'abord la masse molaire/.test(C[0])) ko(nom + ' : la correction doit commencer par la masse molaire');
    if (fam.charAt(0) === 'n') {
      var m3 = nb(/contient ([\d,]+) g/.exec(E)[1]);
      if (Math.abs(m3 / Mx - q.reponse) > 1e-6) ko(nom + ' : n = ' + q.reponse + ' au lieu de ' + (m3 / Mx));
    } else {
      var n3 = nb(/prélever ([\d,]+) mol/.exec(E)[1]);
      if (Math.abs(n3 * Mx - q.reponse) > 1e-6) ko(nom + ' : m = ' + q.reponse + ' au lieu de ' + (n3 * Mx));
    }
  } else if (fam === 'N-vers-m') {
    var N4 = sci(E), M4 = nb(/\) = ([\d,]+) g\/mol/.exec(E)[1]), f4 = /M\(([^)]+)\) =/.exec(E)[1];
    if (Math.abs(molaire(f4) - M4) > 1e-9) ko(nom + ' : masse molaire donnée fausse');
    if (rel(N4 / NA * M4, q.reponse) > 0.006) ko(nom + ' : m = ' + q.reponse + ' au lieu de ' + (N4 / NA * M4));
  } else if (fam === 'identifier') {
    var n5 = nb(/^([\d,]+) mol/.exec(E)[1]), m5 = nb(/masse de ([\d,]+) g/.exec(E)[1]), Mc = m5 / n5;
    var bons = q.choix.filter(function (c) { return Math.abs(molaire(c) - Mc) < 0.051; });
    if (bons.length !== 1 || bons[0] !== q.choix[q.correct]) ko(nom + ' : m ÷ n = ' + Mc + ' ne désigne pas ' + q.choix[q.correct]);
    q.choix.forEach(function (c) { if (E.indexOf(c + ' : ' + molaire(c).toFixed(1).replace('.', ',') + ' g/mol') < 0) ko(nom + ' : la liste ne donne pas la bonne masse molaire de ' + c); });
  }
}
Object.keys(PALIERS).forEach(function (k) { if (!cpt[k]) ko('famille jamais tirée : ' + k); });
if (Object.keys(vfVus).length !== VF.length) ko('vrai/faux : ' + Object.keys(vfVus).length + ' affirmations vues sur ' + VF.length);
if (!types.atome || !types.ion || !types['molécule']) ko('les trois sortes d\'entités doivent apparaître : ' + JSON.stringify(types));

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Quantité de matière : 3200 énoncés relus et refaits — ' + Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', ') + '.');
