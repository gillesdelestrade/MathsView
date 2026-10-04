/*
 * Les exercices « Inéquations reliées par « et » ou « ou » » (2nde).
 *
 * Rien n'est relu tel que le générateur l'annonce. On repart de l'ÉNONCÉ — les
 * deux inéquations et le mot de liaison, écrits dans `tex` — et on recalcule
 * l'ensemble demandé par force brute : on balaie l'axe et, pour chaque nombre,
 * on teste les deux inéquations puis on applique « et » ou « ou » à la lettre.
 * La réponse du générateur doit décrire exactement le même ensemble — bornes
 * exactes comprises, puisque c'est là que les crochets décident.
 *
 * On vérifie en outre les coutures qui feraient perdre l'élève :
 *   — la chaîne affichée (« ]3 ; 5[ », « ∅ », « ℝ ») et la structure
 *     (`morceaux`) disent la même chose, telles que js/reponse.js les compare ;
 *   — ce qu'un élève tape vraiment (« ]3;5[ », « R », « ]-∞;2]U]5;+∞[ ») est
 *     accepté, et une faute de crochet est refusée avec son message ;
 *   — le vrai/faux sur un nombre est recalculé en remplaçant x ;
 *   — un QCM n'a jamais deux bonnes réponses, ni deux propositions identiques ;
 *   — les quatre réponses du chapitre — intervalle, ∅, deux morceaux, ℝ — et
 *     les bornes partagées sont toutes rencontrées.
 */
var window = this;
load('js/alea.js');
load('js/reponse.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/2nde/intervalles-et-ou.js');

var err = [], cpt = {};
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function txt(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim(); }

/* ------------------------------------------------------------------ */
/* Relire l'énoncé : deux inéquations et le mot                        */
/* ------------------------------------------------------------------ */
function nombreTex(t) {
  t = t.replace(/\{,\}/g, '.').replace(/\s/g, '');
  if (/^-\\infty$/.test(t)) return -Infinity;
  if (/^\+?\\infty$/.test(t)) return Infinity;
  var v = parseFloat(t);
  return isNaN(v) ? null : v;
}
var NB = '(-?\\d+(?:\\{,\\}\\d+)?)';
function litInegalite(t) {
  t = t.replace(/\s+/g, '');
  var r;
  if ((r = new RegExp('^x(<|>|\\\\leqslant|\\\\geqslant)' + NB + '$').exec(t))) {
    var v = nombreTex(r[2]);
    if (r[1] === '<') return { a: -Infinity, b: v, oa: true, ob: true };
    if (r[1] === '\\leqslant') return { a: -Infinity, b: v, oa: true, ob: false };
    if (r[1] === '>') return { a: v, b: Infinity, oa: true, ob: true };
    return { a: v, b: Infinity, oa: false, ob: true };
  }
  if ((r = new RegExp('^' + NB + '(<|\\\\leqslant)x(<|\\\\leqslant)' + NB + '$').exec(t)))
    return { a: nombreTex(r[1]), b: nombreTex(r[4]), oa: r[2] === '<', ob: r[3] === '<' };
  ko('inéquation illisible dans l\'énoncé : ' + t);
  return null;
}
function litEnonce(tex) {
  var m = /^(.*?)\\quad\\text\{(et|ou)\}\\quad(.*)$/.exec(tex);
  if (!m) { ko('énoncé illisible : ' + tex); return null; }
  var I = litInegalite(m[1]), J = litInegalite(m[3]);
  return I && J ? { I: I, J: J, lien: m[2] } : null;
}

/* Une écriture de résultat, en unicode (la réponse) ou en LaTeX (les choix). */
function litEnsemble(s, latex) {
  s = String(s);
  if (latex) {
    s = s.replace(/^\\\(|\\\)$/g, '').replace(/\\cup/g, '∪').replace(/\\mathbb\{R\}/g, 'ℝ')
         .replace(/\\varnothing/g, '∅').replace(/\\\{/g, '{').replace(/\\\}/g, '}')
         .replace(/\\,/g, '').replace(/-\\infty/g, '−∞').replace(/\+\\infty/g, '+∞')
         .replace(/\{,\}/g, ',');
  }
  s = s.replace(/\s/g, '');
  if (s === '∅') return [];
  if (s === 'ℝ') return [{ a: -Infinity, b: Infinity, oa: true, ob: true }];
  return s.split('∪').map(function (p) {
    function nb(t) {
      if (t === '−∞') return -Infinity;
      if (t === '+∞') return Infinity;
      return parseFloat(t.replace('−', '-').replace(',', '.'));
    }
    var m = /^\{(.+)\}$/.exec(p);
    if (m) { var v = nb(m[1]); return { a: v, b: v, oa: false, ob: false }; }
    m = /^([\[\]])(.+);(.+)([\[\]])$/.exec(p);
    if (!m) { ko('résultat illisible : ' + s); return null; }
    var r = { a: nb(m[2]), b: nb(m[3]), oa: m[1] === ']', ob: m[4] === '[' };
    if ((!isFinite(r.a) && !r.oa) || (!isFinite(r.b) && !r.ob)) ko('crochet fermé du côté de l\'infini : ' + s);
    return r;
  });
}

/* ------------------------------------------------------------------ */
/* Le calcul refait par force brute                                    */
/* ------------------------------------------------------------------ */
function dans(c, x) { return (c.oa ? x > c.a : x >= c.a) && (c.ob ? x < c.b : x <= c.b); }
function dansEns(ms, x) { return ms.some(function (m) { return dans(m, x); }); }
function attendu(e, x) {
  return e.lien === 'et' ? (dans(e.I, x) && dans(e.J, x)) : (dans(e.I, x) || dans(e.J, x));
}
function echantillon(e) {
  var xs = [];
  [e.I.a, e.I.b, e.J.a, e.J.b].forEach(function (v) {
    if (isFinite(v)) xs.push(v - 1, v - 0.25, v - 0.001, v, v + 0.001, v + 0.25, v + 1);
  });
  for (var x = -16; x <= 16; x += 0.25) xs.push(x);
  return xs;
}
function premiereFaute(ms, e) {
  var mauvais = null;
  echantillon(e).forEach(function (x) {
    if (dansEns(ms, x) !== attendu(e, x) && mauvais === null) mauvais = x;
  });
  return mauvais;
}

/* ------------------------------------------------------------------ */
/* Le balayage des paliers                                             */
/* ------------------------------------------------------------------ */
for (var pal = 1; pal <= 4; pal++) {
  for (var g = 0; g < 700; g++) {
    var q = G.genere(MathsAlea(pal * 613 + g), pal);
    var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') +
               '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
    if (/undefined|NaN|\[object|Infinity/.test(tout))
      ko('P' + pal + ' texte douteux : ' + tout.slice(0, 160));
    if (!q.etapes || q.etapes.length < 3) ko('P' + pal + ' correction trop courte');
    if (!q.indices || !q.indices.length) ko('P' + pal + ' pas d\'indice');

    var e = litEnonce(q.tex || '');
    if (!e) continue;
    if (!(e.I.a < e.I.b) || !(e.J.a < e.J.b)) ko('P' + pal + ' une inéquation de l\'énoncé est impossible : ' + q.tex);
    compte(e.lien);
    if (pal <= 2 && e.lien === 'ou') ko('P' + pal + ' « ou » apparaît avant le palier 3');
    if (e.I.a === e.J.a || e.I.b === e.J.b) compte('borne partagée');
    var finies = [e.I.a, e.I.b, e.J.a, e.J.b].filter(isFinite);
    if (finies.some(function (v) { return v !== Math.round(v); })) compte('demi-entier');
    if (pal <= 3 && finies.some(function (v) { return v !== Math.round(v); }))
      ko('P' + pal + ' un demi-entier apparaît avant le palier 4');

    /* --- l'écriture demandée ---------------------------------------- */
    if (q.type === 'intervalle') {
      compte('ecriture');
      var faute = premiereFaute(q.morceaux, e);
      if (faute !== null) ko('P' + pal + ' ' + q.tex + ' → ' + q.reponse + ' : faux en x = ' + faute);
      // La chaîne affichée dit la même chose que la structure.
      var relu = litEnsemble(q.reponse, false);
      if (relu && relu.indexOf(null) < 0 && premiereFaute(relu, e) !== null)
        ko('P' + pal + ' la chaîne « ' + q.reponse + ' » ne décrit pas le même ensemble que les morceaux');
      // Et c'est le vrai validateur qui le confirme.
      if (!MathsReponse.valide(q, q.reponse).ok)
        ko('P' + pal + ' la réponse affichée « ' + q.reponse + ' » est refusée par le validateur');
      var fin = txt(q.etapes[q.etapes.length - 1]);
      if (fin.indexOf(q.reponse) < 0)
        ko('P' + pal + ' la correction finit sur « ' + fin + ' » et non sur ' + q.reponse);
      // Les deux premières étapes traduisent les deux inéquations, dans l'ordre.
      if (String(q.etapes[0]).indexOf('\\(' + q.tex.split('\\quad')[0].trim() + '\\)') < 0)
        ko('P' + pal + ' la première étape ne part pas de la première inéquation : ' + txt(q.etapes[0]));

      if (!q.morceaux.length) compte('vide');
      else if (q.morceaux.length === 2) compte('deux morceaux');
      else if (q.morceaux[0].a === -Infinity && q.morceaux[0].b === Infinity) compte('ℝ');
      else if (q.morceaux[0].a === q.morceaux[0].b) compte('un seul nombre');
      else if (isFinite(q.morceaux[0].a) && isFinite(q.morceaux[0].b)) compte('intervalle borné');
      else compte('demi-droite');

      // Ce qu'un élève tape vraiment.
      var brut = q.reponse.replace(/\s/g, '');
      var formes = [brut, brut.replace(/∪/g, 'U'), brut.replace(/∪/g, ' u '), q.reponse.replace(/−/g, '-')];
      if (q.reponse === 'ℝ') formes.push('R', 'IR');
      if (q.reponse === '∅') formes.push('vide', '{}');
      formes.forEach(function (saisie) {
        if (!MathsReponse.valide(q, saisie).ok)
          ko('P' + pal + ' saisie légitime refusée : « ' + saisie + ' » pour ' + q.reponse);
      });
      // Une faute de crochet est refusée et signalée.
      if (q.morceaux.length === 1 && q.morceaux[0].a !== q.morceaux[0].b && isFinite(q.morceaux[0].a) &&
          isFinite(q.morceaux[0].b)) {
        var m0 = q.morceaux[0];
        var faux = (m0.oa ? '[' : ']') + m0.a + ';' + m0.b + (m0.ob ? '[' : ']');
        var r = MathsReponse.valide(q, faux);
        if (r.ok) ko('P' + pal + ' « ' + faux + ' » accepté alors que le crochet gauche est faux');
        else if (!/crochet/.test(r.message || '')) ko('P' + pal + ' faute de crochet non signalée pour ' + q.reponse);
      }
      // Les cas où confondre « et » et « ou » change la réponse doivent dominer.
      var eAutre = { I: e.I, J: e.J, lien: e.lien === 'et' ? 'ou' : 'et' };
      var xs = echantillon(e), differe = xs.some(function (x) { return attendu(e, x) !== attendu(eAutre, x); });
      if (differe) compte('et/ou discriminant');

    /* --- vrai / faux sur un nombre ---------------------------------- */
    } else if (q.type === 'vraifaux') {
      compte('vrai-faux');
      var mx = /\\\((.+?)\\\) est solution/.exec(q.enonce);
      if (!mx) { ko('P' + pal + ' nombre introuvable dans « ' + q.enonce + ' »'); continue; }
      var x = nombreTex(mx[1]);
      if ((q.correct === 0) !== attendu(e, x))
        ko('P' + pal + ' ' + q.tex + ' : « ' + x + ' est solution » annoncé ' +
           (q.correct === 0 ? 'vrai' : 'faux') + ' à tort');
      if (finies.indexOf(x) >= 0) compte('posé sur une borne');
      // La correction teste bien les deux inéquations avec le nombre.
      var corr = txt(q.etapes.join(' '));
      if (corr.indexOf(String(x).replace('.', ',').replace('-', '−')) < 0)
        ko('P' + pal + ' la correction ne remplace pas x par ' + x);

    /* --- le QCM ----------------------------------------------------- */
    } else if (q.type === 'qcm') {
      compte('qcm');
      if (pal < 3) ko('P' + pal + ' un QCM apparaît avant le palier 3');
      if (q.choix.length < 3) ko('P' + pal + ' QCM à ' + q.choix.length + ' propositions');
      if (q.correct < 0 || q.correct >= q.choix.length) ko('P' + pal + ' bonne réponse hors bornes');
      var vus = {}, bonnes = 0;
      q.choix.forEach(function (c, i) {
        if (vus[c]) ko('P' + pal + ' deux propositions identiques : ' + c);
        vus[c] = 1;
        var ms = litEnsemble(c, true);
        if (!ms || ms.indexOf(null) >= 0) return;
        var juste = premiereFaute(ms, e) === null;
        if (juste) bonnes++;
        if (juste !== (i === q.correct))
          ko('P' + pal + ' ' + q.tex + ' : la proposition « ' + c + '» est ' +
             (juste ? 'juste mais pas marquée bonne' : 'marquée bonne mais fausse'));
      });
      if (bonnes !== 1) ko('P' + pal + ' QCM à ' + bonnes + ' bonne(s) réponse(s)');
    } else {
      ko('P' + pal + ' type inattendu : ' + q.type);
    }
  }
}

['et', 'ou', 'ecriture', 'vrai-faux', 'qcm', 'vide', 'deux morceaux', 'ℝ', 'intervalle borné', 'demi-droite',
 'borne partagée', 'demi-entier', 'posé sur une borne', 'et/ou discriminant'].forEach(function (k) {
  if (!cpt[k]) ko('le cas « ' + k + ' » n\'a jamais été rencontré : le tirage ne couvre pas le chapitre');
});

print('2800 énoncés relus et recalculés — ' + Object.keys(cpt).map(function (k) { return cpt[k] + ' ' + k; }).join(', ') + '.');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE DÉCRIT EXACTEMENT L\'ENSEMBLE DES NOMBRES QUI VÉRIFIENT « ET » OU « OU »');
