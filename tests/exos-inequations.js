/*
 * Les exercices « Inéquations du premier degré » (2nde).
 *
 * L'inéquation de l'énoncé est relue depuis son LaTeX et transformée en une
 * fonction de x ; l'ensemble annoncé n'est jamais cru sur parole : on évalue
 * l'inéquation juste à gauche de la borne, juste à droite, et sur la borne
 * elle-même — c'est là que le sens et le crochet se décident. La réponse
 * attendue doit être acceptée par le lecteur d'intervalles, la réponse « sens
 * oublié » refusée, et le mauvais crochet refusé avec le message qui parle des
 * crochets. Dans les QCM, chaque proposition est jugée à côté et une seule doit
 * être bonne ; les vrai/faux sont confrontés à une table indépendante. Enfin,
 * les paliers tiennent leur promesse : pas de division par un négatif au
 * palier 1, presque toujours au palier 2, des x des deux côtés au palier 3.
 */
var window = this;
load('js/alea.js'); load('js/reponse.js');
var G = null; var MathsExos = { register: function (g) { G = g; } }; window.MathsExos = MathsExos;
load('exos/2nde/inequations.js');

function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, '').replace(/\s+/g, ' ').replace(/−/g, '-').trim(); }
var err = [], cpt = {}; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }

/* Une inéquation en LaTeX → { rel, verite(x) }. */
function lit(tex) {
  var s = String(tex).replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
    .replace(/\\leqslant/g, '<=').replace(/\\geqslant/g, '>=').replace(/\\times/g, '*')
    .replace(/\{,\}/g, '.').replace(/−/g, '-').replace(/\s+/g, '');
  var m = /^(.*?)(<=|>=|<|>)(.*)$/.exec(s);
  if (!m) return null;
  function expr(e) {
    e = e.replace(/(\d)x/g, '$1*x').replace(/(^|[^\d*)])x/g, '$1(x)').replace(/\)\(/g, ')*(');
    try { return new Function('x', 'return (' + e + ');'); } catch (er) { return null; }
  }
  var g = expr(m[1]), d = expr(m[3]);
  if (!g || !d) return null;
  var rel = m[2];
  return { rel: rel, g: g, d: d, verite: function (x) {
    var u = g(x), v = d(x), e = 1e-9;   // 3 × 4/3 vaut 4,000000000000001 en flottant
    return rel === '<' ? u < v - e : rel === '>' ? u > v + e : rel === '<=' ? u <= v + e : u >= v - e;
  } };
}
/* L'ensemble annoncé → { borne, gauche, ferme } ; confronté à l'inéquation. */
function confronte(nom, I, morceaux, p) {
  if (!morceaux || morceaux.length !== 1) return ko(nom + ' : un seul morceau attendu');
  var mo = morceaux[0], gauche = mo.a === -Infinity, borne = gauche ? mo.b : mo.a, ferme = gauche ? !mo.ob : !mo.oa;
  if (!(gauche ? mo.b < Infinity : mo.b === Infinity)) return ko(nom + ' : morceau mal formé ' + JSON.stringify(mo));
  if (I.verite(borne - 0.01) !== gauche) ko(nom + ' : juste à gauche de ' + borne + ', l\'inéquation dit ' + I.verite(borne - 0.01));
  if (I.verite(borne + 0.01) !== !gauche) ko(nom + ' : juste à droite de ' + borne + ', l\'inéquation dit ' + I.verite(borne + 0.01));
  if (I.verite(borne) !== ferme) ko(nom + ' : sur la borne ' + borne + ', l\'inéquation dit ' + I.verite(borne) + ' mais le crochet est ' + (ferme ? 'fermé' : 'ouvert'));
  if (p <= 3 && borne !== Math.round(borne)) ko(nom + ' : borne non entière ' + borne + ' au palier ' + p);
  return { borne: borne, gauche: gauche, ferme: ferme };
}

var TABLE = [
  [/-2x > 6/, false], [/-x > 5/, true], [/3x \\leqslant 12/, true], [/x \+ 5 > 2/, false],
  [/^Ajouter/, true], [/^Multiplier/, false], [/2x - 3 \\leqslant 5/, true], [/2x - 3 < 5/, false],
  [/3x \+ 1 > 3x - 2/, false], [/-4x \\geqslant -8/, true]
];

var negatifs = { 1: 0, 2: 0 }, totaux = { 1: 0, 2: 0 };
for (var p = 1; p <= 4; p++) for (var g = 0; g < 700; g++) {
  var q = G.genere(MathsAlea(p * 611 + g), p);
  var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') + '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
  if (/undefined|NaN|\[object|\+ -|- -|\+-|--/.test(tout)) ko('P' + p + ' texte douteux : ' + tout.slice(0, 160));
  if (!q.etapes || !q.etapes.length) ko('P' + p + ' pas de correction');
  var nom = 'P' + p + ' ' + txt(q.tex || q.enonce).slice(0, 60);

  if (q.type === 'intervalle') {
    var I = lit(q.tex);
    if (!I) { ko(nom + ' : énoncé illisible'); continue; }
    var forme = /dfrac/.test(q.tex) ? 'fraction' : /x.*[<>t] .*x/.test(q.tex.replace(/\\[a-z]+/g, 't')) ? 'deux côtés' : 'simple';
    if (p === 4 && forme === 'simple') forme = 'borne fraction';
    compte(forme);
    var r = confronte(nom, I, q.morceaux, p);
    if (!r) continue;
    // Le sens : au palier 1 jamais de retournement, au palier 2 presque toujours.
    var k = (I.g(1) - I.g(0)) - (I.d(1) - I.d(0));
    if (p === 1 && k < 0) ko(nom + ' : division par un négatif au palier 1');
    if (p <= 2 && forme === 'simple') { totaux[p]++; if (k < 0) negatifs[p]++; }
    if (p === 3 && forme === 'deux côtés' && (I.d(1) - I.d(0)) === 0) ko(nom + ' : pas de x à droite au palier 3');
    // (sur le texte brut : « < » et « > » y sont des symboles, pas des balises)
    var brut = q.etapes.join(' ');
    if (k < 0 && !/négatif/.test(brut)) ko(nom + ' : diviser par un négatif sans le dire');
    if (k < 0 && !/Vérification/.test(brut)) ko(nom + ' : le retournement doit être vérifié par un test de chaque côté');
    if (k > 0 && k !== 1 && !/positif/.test(brut)) ko(nom + ' : diviser par un positif sans le dire');
    // Le lecteur : la réponse passe, le sens oublié et le mauvais crochet non.
    if (!MathsReponse.valide(q, q.reponse).ok) ko(nom + ' : la réponse attendue « ' + q.reponse + ' » est refusée');
    var b = String(r.borne).replace('.', ',');
    var bTxt = /\//.test(q.reponse) ? /(-?\d+\/\d+)/.exec(q.reponse.replace(/−/g, '-'))[1] : b;
    var bonne = r.gauche ? ']-inf;' + bTxt + (r.ferme ? ']' : '[') : (r.ferme ? '[' : ']') + bTxt + ';+inf[';
    var autreSens = r.gauche ? (r.ferme ? '[' : ']') + bTxt + ';+inf[' : ']-inf;' + bTxt + (r.ferme ? ']' : '[');
    var autreCrochet = r.gauche ? ']-inf;' + bTxt + (r.ferme ? '[' : ']') : (r.ferme ? ']' : '[') + bTxt + ';+inf[';
    if (!MathsReponse.valide(q, bonne).ok) ko(nom + ' : « ' + bonne + ' » refusé');
    if (!MathsReponse.valide(q, 'S=' + bonne.replace('inf', '∞')).ok) ko(nom + ' : « S=' + bonne + ' » refusé');
    if (MathsReponse.valide(q, autreSens).ok) ko(nom + ' : le sens oublié « ' + autreSens + ' » accepté');
    var v = MathsReponse.valide(q, autreCrochet);
    if (v.ok) ko(nom + ' : le mauvais crochet « ' + autreCrochet + ' » accepté');
    else if (!/crochets/.test(v.message || '')) ko(nom + ' : le mauvais crochet doit être signalé comme tel, pas « ' + v.message + ' »');
    // Une borne comme −1/3 n'a pas d'écriture décimale : l'arrondi doit être refusé
    // (−1/4 = −0,25 est exact, lui, et passe à bon droit).
    var arrondi = Math.round(r.borne * 100) / 100;
    if (Math.abs(arrondi - r.borne) > 1e-9 && MathsReponse.valide(q, bonne.replace(bTxt, String(arrondi).replace('.', ','))).ok)
      ko(nom + ' : une borne approchée acceptée');
  } else if (q.type === 'qcm' && /lequel est/.test(q.enonce)) {
    compte('lequel');
    var m = /\\\((.*?)\\\) \?$/.exec(q.enonce), I2 = m && lit(m[1]);
    if (!I2) { ko(nom + ' : inéquation du QCM illisible'); continue; }
    var bons = 0;
    q.choix.forEach(function (c, i) {
      var ok = I2.verite(parseFloat(String(c).replace(/−/g, '-').replace(',', '.')));
      if (ok) bons++;
      if (ok !== (i === q.correct)) ko(nom + ' : le choix ' + c + ' est ' + (ok ? 'solution' : 'faux') + ' mais ' + (i === q.correct ? 'annoncé bon' : 'pas annoncé'));
    });
    if (bons !== 1) ko(nom + ' : ' + bons + ' bonnes réponses');
    if (q.choix.length !== 4) ko(nom + ' : 4 choix attendus');
  } else if (q.type === 'qcm' && /Quelle inéquation/.test(q.enonce)) {
    compte('laquelle');
    var ms = /\\\((\\left.*?)\\\) \?$/.exec(q.enonce);
    var S = ms && /^\\left([\]\[])(.*?)\\,;\\ (.*?)\\right([\]\[])$/.exec(ms[1]);
    if (!S) { ko(nom + ' : ensemble illisible ' + q.enonce); continue; }
    var gauche = S[2] === '-\\infty', borne = parseFloat((gauche ? S[3] : S[2]).replace(/\{,\}/, '.'));
    var ferme = gauche ? S[4] === ']' : S[1] === '[';
    var bons2 = 0;
    q.choix.forEach(function (c, i) {
      var I3 = lit(c.replace(/^\\\(|\\\)$/g, ''));
      if (!I3) return ko(nom + ' : proposition illisible ' + c);
      var ok = I3.verite(borne - 0.01) === gauche && I3.verite(borne + 0.01) === !gauche && I3.verite(borne) === ferme;
      if (ok) bons2++;
      if (ok !== (i === q.correct)) ko(nom + ' : la proposition ' + c + (ok ? ' convient' : ' ne convient pas') + ' mais ' + (i === q.correct ? 'est annoncée bonne' : 'ne l\'est pas'));
    });
    if (bons2 !== 1) ko(nom + ' : ' + bons2 + ' propositions justes');
    var vus = {}; q.choix.forEach(function (c) { if (vus[c]) ko(nom + ' : deux choix identiques ' + c); vus[c] = 1; });
  } else if (q.type === 'vraifaux') {
    compte('vrai/faux');
    var t = TABLE.filter(function (r2) { return r2[0].test(txt(q.enonce).replace(/Vrai ou faux \? /, '')); });
    if (t.length !== 1) ko('vrai/faux non reconnu : ' + txt(q.enonce));
    else if ((q.correct === 0) !== t[0][1]) ko('vrai/faux mal jugé : ' + txt(q.enonce));
  } else {
    ko(nom + ' : type ou énoncé non reconnu (' + q.type + ')');
  }
}
if (negatifs[1] !== 0) ko('palier 1 : ' + negatifs[1] + ' divisions par un négatif');
if (negatifs[2] < 0.6 * totaux[2]) ko('palier 2 : seulement ' + negatifs[2] + ' divisions par un négatif sur ' + totaux[2]);

['simple', 'lequel', 'vrai/faux', 'deux côtés', 'laquelle', 'fraction', 'borne fraction'].forEach(function (k) { if (!cpt[k]) ko('forme jamais tirée : ' + k); });

print(Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', '));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ENSEMBLE ANNONCÉ EST CELUI DE L\'INÉQUATION, BORNE, SENS ET CROCHET COMPRIS');
