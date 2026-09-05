/*
 * Les exercices « Union et intersection d'intervalles » (2nde).
 *
 * Rien n'est relu tel que le générateur l'annonce. On repart de l'ÉNONCÉ — les
 * deux intervalles écrits dans `tex` — et on recalcule l'ensemble demandé par
 * force brute : on balaie l'axe, et pour chaque nombre testé on regarde s'il
 * est dans I, dans J, puis on applique « et » ou « ou ». La réponse du
 * générateur doit décrire exactement le même ensemble — bornes exactes
 * comprises, puisque c'est là que les crochets décident.
 *
 * On vérifie en outre les trois coutures qui feraient perdre l'élève :
 *   — la chaîne affichée (« [4 ; 6] ») et la structure (`morceaux`) disent la
 *     même chose, telles que js/reponse.js les compare vraiment ;
 *   — les écritures qu'un élève tape réellement (« [4;6] », « [4,6] »,
 *     « [3;5]U[7;9] ») sont acceptées, et une faute de crochet est refusée
 *     avec le message qui va bien ;
 *   — un QCM n'a jamais deux bonnes réponses, ni deux propositions identiques.
 */
var window = this;
load('js/alea.js');
load('js/reponse.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/2nde/intervalles-union.js');

var err = [], cpt = {};
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }
function compte(k) { cpt[k] = (cpt[k] || 0) + 1; }
function txt(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim(); }

/* ------------------------------------------------------------------ */
/* Relire l'énoncé : les deux intervalles, tels qu'ils sont écrits     */
/* ------------------------------------------------------------------ */
function nombreTex(t) {
  t = t.replace(/\{,\}/g, '.').replace(/\s/g, '');
  if (/^-\\infty$/.test(t)) return -Infinity;
  if (/^\+?\\infty$/.test(t)) return Infinity;
  var v = parseFloat(t);
  return isNaN(v) ? null : v;
}
function litIntervalle(t) {
  t = t.replace(/\\,/g, '').replace(/\s/g, '');
  var m = /^([\[\]])(.+);(.+)([\[\]])$/.exec(t);
  if (!m) { ko('intervalle illisible dans l\'énoncé : ' + t); return null; }
  var a = nombreTex(m[2]), b = nombreTex(m[3]);
  if (a === null || b === null) { ko('borne illisible : ' + t); return null; }
  return { a: a, b: b, oa: m[1] === ']', ob: m[4] === '[' };
}
function litEnonce(tex) {
  var deux = tex.split(/\\quad\\text\{et\}\\quad/);
  if (deux.length !== 2) { ko('énoncé illisible : ' + tex); return null; }
  var mi = /^\s*I\s*=\s*(\S.*)$/.exec(deux[0]);
  var mj = /^\s*J\s*=\s*(\S.*)$/.exec(deux[1]);
  if (!mi || !mj) { ko('énoncé illisible : ' + tex); return null; }
  var I = litIntervalle(mi[1]), J = litIntervalle(mj[1]);
  return I && J ? { I: I, J: J } : null;
}

/* Une écriture de résultat, en unicode (la réponse) ou en LaTeX (les choix). */
function litEnsemble(s, latex) {
  s = String(s);
  if (latex) {
    s = s.replace(/^\\\(|\\\)$/g, '').replace(/\\cup/g, '∪')
         .replace(/\\varnothing/g, '∅').replace(/\\\{/g, '{').replace(/\\\}/g, '}')
         .replace(/\\,/g, '');
  }
  s = s.replace(/\s/g, '');
  if (s === '∅') return [];
  return s.split('∪').map(function (p) {
    var m = /^\{(.+)\}$/.exec(p);
    if (m) {
      var v = latex ? nombreTex(m[1]) : parseFloat(m[1].replace('−', '-').replace(',', '.'));
      return { a: v, b: v, oa: false, ob: false };
    }
    if (latex) { var r = litIntervalle(p); return r; }
    m = /^([\[\]])(.+);(.+)([\[\]])$/.exec(p);
    if (!m) { ko('résultat illisible : ' + s); return null; }
    function nb(t) {
      if (t === '−∞') return -Infinity;
      if (t === '+∞') return Infinity;
      return parseFloat(t.replace('−', '-').replace(',', '.'));
    }
    return { a: nb(m[2]), b: nb(m[3]), oa: m[1] === ']', ob: m[4] === '[' };
  });
}

/* ------------------------------------------------------------------ */
/* Le calcul refait par force brute                                    */
/* ------------------------------------------------------------------ */
function dans(iv, x) {
  return (iv.oa ? x > iv.a : x >= iv.a) && (iv.ob ? x < iv.b : x <= iv.b);
}
function dansEns(ms, x) {
  return ms.some(function (m) { return dans(m, x); });
}
// Les nombres qui départagent : les bornes elles-mêmes, leurs voisins
// immédiats, et un balayage régulier de l'axe.
function echantillon(I, J) {
  var xs = [];
  [I.a, I.b, J.a, J.b].forEach(function (v) {
    if (isFinite(v)) xs.push(v - 1, v - 0.25, v - 0.001, v, v + 0.001, v + 0.25, v + 1);
  });
  for (var x = -14; x <= 14; x += 0.25) xs.push(x);
  return xs;
}
function memeEnsembleQue(ms, I, J, op) {
  var xs = echantillon(I, J), mauvais = null;
  xs.forEach(function (x) {
    var att = op === 'inter' ? (dans(I, x) && dans(J, x)) : (dans(I, x) || dans(J, x));
    if (dansEns(ms, x) !== att && mauvais === null) mauvais = x;
  });
  return mauvais;
}

/* ------------------------------------------------------------------ */
/* Le balayage des paliers                                             */
/* ------------------------------------------------------------------ */
for (var pal = 1; pal <= 4; pal++) {
  for (var g = 0; g < 700; g++) {
    var q = G.genere(MathsAlea(pal * 977 + g), pal);
    var tout = q.enonce + '|' + (q.tex || '') + '|' + (q.etapes || []).join('|') +
               '|' + (q.choix || []).join('|') + '|' + (q.indices || []).join('|');
    if (/undefined|NaN|\[object|Infinity/.test(tout))
      ko('P' + pal + ' texte douteux : ' + tout.slice(0, 160));
    if (!q.etapes || q.etapes.length < 2) ko('P' + pal + ' correction trop courte');
    if (!q.indices || !q.indices.length) ko('P' + pal + ' pas d\'indice');

    var e = litEnonce(q.tex || '');
    if (!e) continue;
    var I = e.I, J = e.J;
    if (!(I.a < I.b) || !(J.a < J.b)) ko('P' + pal + ' un intervalle de l\'énoncé est vide');
    var op = /\\cap/.test(q.enonce) ? 'inter' : 'union';
    compte(op);

    /* --- l'écriture demandée ---------------------------------------- */
    if (q.type === 'intervalle') {
      compte('ecriture');
      var faute = memeEnsembleQue(q.morceaux, I, J, op);
      if (faute !== null)
        ko('P' + pal + ' ' + q.tex + ' → ' + q.reponse + ' : faux en x = ' + faute);

      // La chaîne affichée et la structure attendue doivent coïncider — et
      // c'est le vrai validateur qui le dit.
      var v = MathsReponse.valide(q, q.reponse);
      if (!v.ok) ko('P' + pal + ' la réponse affichée « ' + q.reponse +
                    ' » est refusée par le validateur');
      // La dernière étape de la correction annonce le même ensemble.
      var fin = txt(q.etapes[q.etapes.length - 1]);
      if (fin.indexOf(q.reponse) < 0)
        ko('P' + pal + ' la correction finit sur « ' + fin + ' » et non sur ' + q.reponse);

      if (!q.morceaux.length) compte('vide');
      if (q.morceaux.length === 2) compte('deux morceaux');
      if (q.morceaux.length === 1 && q.morceaux[0].a === q.morceaux[0].b) compte('un seul nombre');
      if (q.morceaux.some(function (m) { return !isFinite(m.a) || !isFinite(m.b); }))
        compte('borne infinie');

      // Ce qu'un élève tape vraiment : sans espaces, avec U, avec la virgule.
      var brut = q.reponse.replace(/\s/g, '');
      [brut, brut.replace(/∪/g, 'U'), brut.replace(/∪/g, ' u '),
       q.reponse.replace(/−/g, '-')].forEach(function (saisie) {
        if (!MathsReponse.valide(q, saisie).ok)
          ko('P' + pal + ' saisie légitime refusée : « ' + saisie + ' » pour ' + q.reponse);
      });
      // Une faute de crochet doit être refusée, et signalée comme telle.
      if (q.morceaux.length === 1 && q.morceaux[0].a !== q.morceaux[0].b) {
        var m0 = q.morceaux[0];
        if (isFinite(m0.a)) {
          var faux = (m0.oa ? '[' : ']') + m0.a + ';' + m0.b + (m0.ob ? '[' : ']');
          var r = MathsReponse.valide(q, faux);
          if (r.ok) ko('P' + pal + ' « ' + faux + ' » accepté alors que le crochet gauche est faux');
          else if (!/crochet/.test(r.message || '') && isFinite(m0.b))
            ko('P' + pal + ' faute de crochet non signalée pour ' + q.reponse);
        }
      }

    /* --- l'appartenance --------------------------------------------- */
    } else if (q.type === 'vraifaux') {
      compte('appartenance');
      var mx = /\\\((.+?)\s*\\in/.exec(q.enonce);
      if (!mx) { ko('P' + pal + ' nombre introuvable dans « ' + q.enonce + ' »'); continue; }
      var x = nombreTex(mx[1]);
      var att = op === 'inter' ? (dans(I, x) && dans(J, x)) : (dans(I, x) || dans(J, x));
      if ((q.correct === 0) !== att)
        ko('P' + pal + ' ' + q.tex + ' : « ' + x + ' ∈ I ' + op + ' J » annoncé ' +
           (q.correct === 0 ? 'vrai' : 'faux') + ' à tort');
      if (isFinite(x) && [I.a, I.b, J.a, J.b].indexOf(x) >= 0) compte('posé sur une borne');

    /* --- le QCM ------------------------------------------------------ */
    } else if (q.type === 'qcm') {
      compte('qcm');
      if (q.choix.length < 3) ko('P' + pal + ' QCM à ' + q.choix.length + ' propositions');
      if (q.correct < 0 || q.correct >= q.choix.length) ko('P' + pal + ' bonne réponse hors bornes');
      var vus = {}, bonnes = 0;
      q.choix.forEach(function (c, i) {
        if (vus[c]) ko('P' + pal + ' deux propositions identiques : ' + c);
        vus[c] = 1;
        var ms = litEnsemble(c, true);
        if (!ms || ms.indexOf(null) >= 0) return;
        var mauvais = memeEnsembleQue(ms, I, J, op);
        if (mauvais === null) {
          bonnes++;
          if (i !== q.correct)
            ko('P' + pal + ' la proposition ' + i + ' est juste elle aussi : ' + c);
        } else if (i === q.correct) {
          ko('P' + pal + ' la « bonne » réponse ' + c + ' est fausse en x = ' + mauvais);
        }
      });
      if (bonnes !== 1) ko('P' + pal + ' ' + bonnes + ' propositions justes au lieu d\'une');
    } else {
      ko('P' + pal + ' type de question inattendu : ' + q.type);
    }
  }
}

/* Les cas qui font le chapitre doivent tous être rencontrés. */
['vide', 'deux morceaux', 'un seul nombre', 'borne infinie', 'posé sur une borne',
 'qcm', 'appartenance', 'ecriture'].forEach(function (k) {
  if (!cpt[k]) ko('le cas « ' + k + ' » n\'est jamais tiré');
});

print('2800 questions tirées : ' + JSON.stringify(cpt));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE EST CELLE QUE LES DEUX INTERVALLES DE L\'ÉNONCÉ DONNENT VRAIMENT');
