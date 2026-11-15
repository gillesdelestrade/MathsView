/*
 * La leçon « La quantité de matière » (2nde, physique-chimie), montée avec le
 * VRAI JSXGraph (renderer « no »).
 *
 * Tout ce que la figure écrit est relu et REFAIT avec une table de masses
 * molaires atomiques indépendante de la leçon.
 *   Volet 1 — pour chaque espèce et chaque quantité : une entité seule
 *   d'abord, puis UN sac (une mole), puis autant de sacs que de moles — un
 *   demi-sac pour 0,5 mol, et les grains visibles sont proportionnels à n ;
 *   la ligne N = n × N_A est recalculée (écriture scientifique relue), le
 *   titre nomme la bonne sorte d'entité (atomes, ions, molécules).
 *   Volet 2 — la masse de l'entité affichée, multipliée par N_A, redonne la
 *   masse molaire lue sur la balance, elle-même recalculée depuis la
 *   formule ; la ligne « en pratique » est une somme juste pour une
 *   molécule, renvoie à l'atome pour un ion, au tableau périodique pour un
 *   atome.
 *   Volet 3 — pour chaque situation : la lettre cherchée est un « ? » dans le
 *   triangle tant que la formule n'est pas écrite ; la formule est celle de
 *   la lettre cherchée ; le calcul écrit est refait ; la suite (N = n × N_A)
 *   aussi ; la masse molaire en jeu est bien celle de l'espèce.
 * Rien de dessiné avant la première étape, rejeu à l'identique.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
var H = monter('lessons/pc/2nde/quantite-matiere.js');
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);
var board = H.board, NA = 6.02e23;
var TABLE = { H: 1.0, C: 12.0, O: 16.0, Na: 23.0, Cl: 35.5, Fe: 55.8 };
var SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function strip(h) { return String(h).replace(/<[^>]+>/g, '').replace(/N_A/g, 'NA').replace(/\s+/g, ' ').trim(); }
function nb(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }
function sci(s) {
  var m = /(\d,\d\d) × 10(⁻?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/.exec(s);
  if (!m) return NaN;
  var e = +m[3].split('').map(function (c) { return SUP.indexOf(c); }).join('');
  return nb(m[1]) * Math.pow(10, m[2] ? -e : e);
}
function scis(s) { var out = [], re = /\d,\d\d × 10⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m; while ((m = re.exec(s))) out.push(sci(m[0])); return out; }
function molaire(f) {
  var re = /([A-Z][a-z]?)([₀-₉]*)/g, m, M = 0;
  while ((m = re.exec(f))) { M += TABLE[m[1]] * (m[2] === '' ? 1 : +m[2].split('').map(function (c) { return SUB.indexOf(c); }).join('')); }
  return Math.round(M * 10) / 10;
}
function rel(u, v) { return Math.abs(u - v) / Math.abs(v); }
function role(r) { return board.objectsList.filter(function (o) { return o.mvRole === r; }); }
function vu(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
function lu(r) { var o = role(r)[0]; return o && vu(o) ? strip(o.plaintext) : null; }
function etat() {
  return [H.panneau(), board.objectsList.filter(function (o) { return o.mvRole; }).map(function (o) { return o.mvRole + ':' + vu(o); }).join(','),
          H.textes().map(function (t) { return t.t + '@' + t.x.toFixed(3) + ',' + t.y.toFixed(3); }).join('|')].join('§');
}
function rejeu(nom, n) { H.jouer(n); var e1 = etat(); H.jouer(n); if (etat() !== e1) ko(nom + 'le rejeu ne redonne pas le même écran'); }

var volets = H.parClasse('qm-volet'), especes = H.parClasse('qm-espece'), quantites = H.parClasse('qm-quantite'), situations = H.parClasse('qm-situation');
if (volets.length !== 3 || especes.length !== 6 || quantites.length !== 4 || situations.length !== 5) ko('3 volets, 6 espèces, 4 quantités et 5 situations attendus');
var FORMULES = ['C', 'Fe', 'Na⁺', 'Cl⁻', 'H₂O', 'CO₂'], SORTE = ['atomes', 'atomes', 'ions', 'ions', 'molécules', 'molécules'], NDISQUES = [1, 1, 1, 1, 3, 3];
var QTE = [0.5, 1, 2, 3], n1 = 0, n2 = 0, n3 = 0;

/* --- Volet 1 : la mole ------------------------------------------------- */
volets[0].onclick();
especes.forEach(function (bt, i) {
  if ((bt.textContent || '').indexOf(FORMULES[i]) !== 0) ko('pastille d\'espèce n° ' + i + ' : ' + bt.textContent);
  quantites.forEach(function (bq, j) {
    bt.onclick(); bq.onclick(); n1++;
    var nom = ' [mole, ' + FORMULES[i] + ', ' + QTE[j] + ' mol] ';
    if (!H.steps || H.steps.length !== 4) return ko(nom + '4 étapes attendues');
    H.remiseAZero(); board.update();
    if (role('sac').some(vu) || role('disque').some(vu) || role('grain').some(vu) || lu('ligne1') || lu('ligne2')) ko(nom + 'rien ne doit être dessiné avant la première étape');
    H.jouer(1);
    if (role('disque').filter(vu).length !== NDISQUES[i] || role('sac').some(vu)) ko(nom + 'd\'abord l\'entité seule (' + NDISQUES[i] + ' disque(s)), sans sac');
    H.jouer(2);
    if (role('sac').filter(vu).length !== 1 || role('grain').filter(vu).length !== 26) ko(nom + 'ensuite un seul sac plein : une mole');
    if (!/1 mole = 6,02 × 10²³/.test(lu('ligne2') || '')) ko(nom + 'la comparaison douzaine / mole manque');
    if (lu('titre').indexOf(SORTE[i]) < 0 && !(SORTE[i] === 'ions' && /ions/.test(lu('titre')))) ko(nom + 'le titre ne nomme pas des ' + SORTE[i] + ' : ' + lu('titre'));
    H.jouer(3);
    var q = QTE[j];
    if (role('sac').filter(vu).length !== Math.ceil(q)) ko(nom + role('sac').filter(vu).length + ' sac(s) pour ' + q + ' mol');
    if (role('grain').filter(vu).length !== Math.round(q * 26)) ko(nom + 'les grains ne sont pas proportionnels à n : ' + role('grain').filter(vu).length);
    var et = role('etiquette-sac').filter(vu).map(function (o) { return strip(o.plaintext); });
    if (q === 0.5 ? et.join() !== '0,5 mol' : et.some(function (t) { return t !== '1 mol'; })) ko(nom + 'étiquettes des sacs : ' + et.join(' | '));
    if (lu('ligne1')) ko(nom + 'le nombre d\'entités arrive trop tôt');
    H.jouer(4);
    var L = lu('ligne1') || '', v = scis(L), mq = /= ([\d,]+) × 6,02/.exec(L);
    if (!/^N = n × NA = /.test(L) || v.length !== 2 || !mq) return ko(nom + 'ligne du nombre d\'entités illisible : ' + L);
    if (nb(mq[1]) !== q || rel(v[0], NA) > 1e-9 || rel(v[1], q * NA) > 0.006) ko(nom + 'N = n × N_A faux : ' + L);
    if (L.indexOf(SORTE[i]) < 0) ko(nom + 'la ligne ne nomme pas les ' + SORTE[i]);
    if (!/constante d'Avogadro/.test(strip(H.panneau())) || rel(scis(strip(H.panneau())).pop(), q * NA) > 0.006) ko(nom + 'le panneau doit nommer la constante d\'Avogadro et donner N');
    if (i % 3 === 0 && j === 2) rejeu(nom, 4);
  });
});

/* --- Volet 2 : la masse molaire ----------------------------------------- */
volets[1].onclick();
especes.forEach(function (bt, i) {
  bt.onclick(); n2++;
  var nom = ' [masse molaire, ' + FORMULES[i] + '] ', M = molaire(FORMULES[i]);
  if (!H.steps || H.steps.length !== 4) return ko(nom + '4 étapes attendues');
  H.jouer(1);
  var mE = sci(lu('masse-entite') || '');
  if (rel(mE * NA, M) > 0.006) ko(nom + 'la masse de l\'entité (' + mE + ' g) × N_A ne redonne pas ' + M + ' g/mol');
  if (mE > 1e-21 || mE < 1e-24) ko(nom + 'ordre de grandeur de la masse d\'une entité : ' + mE);
  if (role('sac').some(vu) || lu('balance')) ko(nom + 'la balance arrive trop tôt');
  H.jouer(2);
  if (nb(lu('balance')) !== M || role('sac').filter(vu).length !== 1) ko(nom + 'la balance doit afficher ' + M + ' g sous un sac d\'une mole : ' + lu('balance'));
  H.jouer(3);
  var L = lu('ligne1') || '', v = scis(L), mm = /= ([\d,]+) g\/mol$/.exec(L);
  if (!/^M = m × NA = /.test(L) || v.length !== 2 || !mm || nb(mm[1]) !== M || rel(v[0] * v[1], M) > 0.006) ko(nom + 'M = m × N_A faux : ' + L);
  H.jouer(4);
  var P2 = lu('ligne2') || '';
  if (i < 2 && !(/Tableau périodique/.test(P2) && nb(/= ([\d,]+) g\/mol/.exec(P2)[1]) === M)) ko(nom + 'un atome renvoie au tableau périodique : ' + P2);
  if (i >= 2 && i < 4 && !(/^M\(\S+\) = M\((Na|Cl)\) = /.test(P2) && nb(/= ([\d,]+) g\/mol/.exec(P2)[1]) === M && /négligeable/.test(strip(H.panneau())))) ko(nom + 'un ion renvoie à son atome, électrons négligeables : ' + P2);
  if (i >= 4) {
    var s = /= ([\d,× +]+) = ([\d,]+) g\/mol$/.exec(P2);
    if (!s || Math.abs(eval(s[1].replace(/,/g, '.').replace(/×/g, '*')) - M) > 1e-6 || nb(s[2]) !== M) ko(nom + 'la somme des masses molaires atomiques est fausse : ' + P2);
  }
  rejeu(nom, 4);
});

/* --- Volet 3 : m, n et M ------------------------------------------------- */
volets[2].onclick();
var ATTENDU = [['n', 'H₂O', 'N'], ['m', 'Fe', null], ['M', 'CO₂', null], ['n', 'Na⁺', 'N'], ['m', 'C', 'depuisN']];
situations.forEach(function (bt, i) {
  bt.onclick(); n3++;
  var a = ATTENDU[i], nom = ' [relation, situation ' + (i + 1) + '] ', M = molaire(a[1]);
  if ((bt.textContent || '').indexOf(a[0] + ' = ?') !== 0) ko(nom + 'pastille : ' + bt.textContent);
  if (!H.steps || H.steps.length !== 4) return ko(nom + '4 étapes attendues');
  H.jouer(1);
  if (lu('lettre-' + a[0]) !== '?') ko(nom + 'la lettre cherchée doit être cachée dans le triangle');
  ['m', 'n', 'M'].forEach(function (l) { if (l !== a[0] && lu('lettre-' + l) !== l) ko(nom + 'la lettre ' + l + ' manque dans le triangle'); });
  if (lu('rel-formule') || lu('rel-calcul')) ko(nom + 'la formule arrive trop tôt');
  H.jouer(2);
  var F = { n: 'n = m ÷ M', m: 'm = n × M', M: 'M = m ÷ n' }[a[0]];
  if (lu('rel-formule') !== F) ko(nom + 'formule ' + lu('rel-formule') + ' au lieu de ' + F);
  if (lu('lettre-' + a[0]) !== a[0]) ko(nom + 'une fois la formule écrite, la lettre réapparaît');
  H.jouer(3);
  var C = lu('rel-calcul') || '', mc = /^(\w) = ([\d,]+) (÷|×) ([\d,]+) = ([\d,]+) (g\/mol|mol|g)$/.exec(C);
  if (!mc) return ko(nom + 'calcul illisible : ' + C);
  var x = nb(mc[2]), y = nb(mc[4]), r = nb(mc[5]), calc = mc[3] === '÷' ? x / y : x * y;
  if (mc[1] !== a[0] || rel(calc, r) > 0.002) ko(nom + 'calcul faux : ' + C);
  if (mc[6] !== { n: 'mol', m: 'g', M: 'g/mol' }[a[0]]) ko(nom + 'unité du résultat : ' + C);
  var Mjeu = a[0] === 'M' ? r : y;                       // la masse molaire qui intervient
  if (Math.abs(Mjeu - M) > 1e-9) ko(nom + 'la masse molaire en jeu (' + Mjeu + ') n\'est pas celle de ' + a[1] + ' (' + M + ')');
  H.jouer(4);
  var S = lu('rel-suite') || '', n = a[0] === 'n' ? r : a[0] === 'm' ? x : y;
  if (a[2] === 'N' && !(/^N = n × NA = /.test(S) && rel(scis(S)[1], n * NA) < 0.006)) ko(nom + 'N = n × N_A faux : ' + S);
  if (a[2] === 'depuisN' && rel(scis(lu('rel-donnees'))[0], n * NA) > 0.006) ko(nom + 'le nombre d\'atomes donné ne correspond pas à n : ' + lu('rel-donnees'));
  if (a[0] === 'M' && !/CO₂/.test(S)) ko(nom + 'la masse molaire trouvée doit être reconnue : ' + S);
  if (strip(H.panneau()).indexOf(C) < 0) ko(nom + 'le panneau ne reprend pas le calcul');
  rejeu(nom, 4);
});
H.sain('leçon', ko);
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Quantité de matière : ' + n1 + ' moles comptées (sacs, grains, N = n × N_A), ' + n2 + ' masses molaires recalculées, ' + n3 + ' situations m, n, M refaites, rejeu vérifié.');
