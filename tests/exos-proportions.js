/* Les exercices « Proportions et pourcentages » (5ème).
 *
 * Les deux nombres de l'énoncé — la partie et le tout — suffisent à tout
 * recalculer. Le contrôle les relit dans le texte et refait les opérations de
 * son côté : pourcentage, fraction simplifiée, complément, comparaison.
 *
 * Il vérifie aussi ce qui fait la leçon :
 *   — la proportion INVERSÉE est proposée comme leurre partout où elle a un
 *     sens, et n'est jamais la bonne réponse ;
 *   — dans la famille « comparer », les deux totaux diffèrent (sinon il n'y a
 *     rien à convertir) et la plus grande QUANTITÉ n'est pas la meilleure
 *     proportion — sans quoi comparer les parties suffirait et le pourcentage
 *     ne servirait à rien ;
 *   — toutes les réponses tombent juste : un pourcentage avec trois décimales
 *     serait intapable.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/proportions.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }
function pgcd(a, b) { return b ? pgcd(b, a % b) : Math.abs(a); }

/* La partie et le tout, relus dans la phrase de l'énoncé. */
function donnees(t) {
  var m = /<b>(\d+) (?:élèves|fruits|tirs au but|personnes|places)<\/b>/.exec(t);
  var p = /<b>(\d+)(?: filles| pommes|<\/b> sont <b>réussis|<\/b> répondent|<\/b> sont <b>occupées)/
            .exec(t);
  if (!m || !p) return null;
  return { n: +m[1], p: +p[1] };
}
/* Une fraction écrite en LaTeX. */
function fraction(s) {
  var m = /\\dfrac\{([\d,]+)\}\{([\d,]+)\}/.exec(s);
  return m ? [lit(m[1]), lit(m[2])] : null;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 8123 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /Dans laquelle la proportion/.test(q.enonce) ? 'comparer'
            : /pour le reste/.test(q.enonce) ? 'complement'
            : /en nombre décimal|écriture décimale/.test(q.enonce) ? 'ecritures'
            : /Quelle fraction donne/.test(q.enonce) ? 'sens'
            : /fraction simplifiée/.test(q.enonce) ? 'fraction' : 'pourcentage';
    vus[fam] = (vus[fam] || 0) + 1;

    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
      if (q.choix.length < 3) ko(fam + ' : moins de trois propositions');
    }
    if (q.type === 'nombre') {
      if (!isFinite(q.reponse)) ko(fam + ' : la réponse n\'est pas un nombre');
      // au millième près : 12,5 % s'écrit 0,125, et cela reste tapable
      if (Math.abs(q.reponse * 1000 - Math.round(q.reponse * 1000)) > 1e-9)
        ko(fam + ' : réponse non décimale (' + q.reponse + ')');
    }
    if (fam === 'proprietes') continue;

    /* --- le pourcentage --------------------------------------------- */
    if (fam === 'pourcentage') {
      var d = donnees(q.enonce);
      if (!d) { ko('pourcentage : énoncé illisible'); continue; }
      if (d.p >= d.n) ko('pourcentage : la partie n\'est pas plus petite que le tout');
      if (Math.abs(d.p * 100 / d.n - q.reponse) > 1e-9)
        ko('pourcentage : ' + d.p + ' sur ' + d.n + ' fait ' + (d.p * 100 / d.n) +
           ' %, on annonce ' + q.reponse);
      continue;
    }

    /* --- la fraction simplifiée, et le sens -------------------------- */
    if (fam === 'fraction' || fam === 'sens') {
      var d2 = donnees(q.enonce);
      if (!d2) { ko(fam + ' : énoncé illisible'); continue; }
      var bonne = fraction(q.choix[q.correct]);
      if (!bonne) { ko(fam + ' : la réponse cochée est illisible'); continue; }
      // elle doit valoir la proportion, et l'ordre doit être le bon
      if (Math.abs(bonne[0] / bonne[1] - d2.p / d2.n) > 1e-9)
        ko(fam + ' : ' + bonne.join('/') + ' ne vaut pas ' + d2.p + '/' + d2.n);
      if (bonne[0] > bonne[1])
        ko(fam + ' : la réponse cochée dépasse 1 — ce n\'est pas une proportion');
      if (fam === 'fraction' && pgcd(bonne[0], bonne[1]) !== 1)
        ko('fraction : la réponse cochée n\'est pas simplifiée');
      // l'inversée doit être proposée, et fausse
      var inv = q.choix.filter(function (c) {
        var f = fraction(c);
        return f && f[0] === d2.n && f[1] === d2.p;
      });
      if (fam === 'sens' && !inv.length)
        ko('sens : la fraction inversée n\'est pas proposée — c\'est pourtant le piège visé');
      // aucune autre proposition ne doit valoir la bonne proportion
      var justes = q.choix.filter(function (c) {
        var f = fraction(c);
        return f && Math.abs(f[0] / f[1] - d2.p / d2.n) < 1e-9;
      }).length;
      if (justes !== 1) ko(fam + ' : ' + justes + ' propositions valent la bonne proportion');
      continue;
    }

    /* --- le complément ----------------------------------------------- */
    if (fam === 'complement') {
      var d3 = donnees(q.enonce);
      if (!d3) { ko('complement : énoncé illisible'); continue; }
      var pc = d3.p * 100 / d3.n;
      var annonce = /Cela représente <b>([\d,]+) %<\/b>/.exec(q.enonce);
      if (!annonce) ko('complement : le pourcentage de départ n\'est pas donné');
      else if (Math.abs(lit(annonce[1]) - pc) > 1e-9)
        ko('complement : l\'énoncé annonce ' + annonce[1] + ' % pour ' + d3.p + '/' + d3.n);
      if (Math.abs(100 - pc - q.reponse) > 1e-9)
        ko('complement : le reste vaut ' + (100 - pc) + ' %, on annonce ' + q.reponse);
      continue;
    }

    /* --- comparer ----------------------------------------------------- */
    if (fam === 'comparer') {
      var ma = /<b>A\.<\/b> (\d+) sur (\d+)/.exec(q.enonce);
      var mb = /<b>B\.<\/b> (\d+) sur (\d+)/.exec(q.enonce);
      if (!ma || !mb) { ko('comparer : les deux situations sont illisibles'); continue; }
      var a = { p: +ma[1], n: +ma[2] }, b = { p: +mb[1], n: +mb[2] };
      a.pc = a.p * 100 / a.n; b.pc = b.p * 100 / b.n;
      if (a.n === b.n)
        ko('comparer : les deux totaux sont égaux — il n\'y a rien à convertir');
      if (Math.abs(a.pc - b.pc) < 1e-9)
        ko('comparer : les deux proportions sont égales, mais on désigne un gagnant');
      // le piège doit être là : la plus grande partie n'est pas la meilleure proportion
      if ((a.p > b.p) === (a.pc > b.pc))
        ko('comparer : comparer les seules quantités suffirait — le pourcentage ne sert à rien');
      var attendu = a.pc > b.pc ? 'La situation A' : 'La situation B';
      if (q.choix[q.correct] !== attendu)
        ko('comparer : ' + a.p + '/' + a.n + ' = ' + a.pc + ' % et ' + b.p + '/' + b.n +
           ' = ' + b.pc + ' %, on coche « ' + q.choix[q.correct] + ' »');
      continue;
    }

    /* --- les écritures ------------------------------------------------ */
    if (fam === 'ecritures') {
      var vers = /en nombre décimal/.test(q.enonce);
      if (vers) {
        var mp = /([\d,]+) % en nombre décimal/.exec(q.enonce);
        if (!mp) { ko('ecritures : le pourcentage est illisible'); continue; }
        if (Math.abs(lit(mp[1]) / 100 - q.reponse) > 1e-9)
          ko('ecritures : ' + mp[1] + ' % vaut ' + (lit(mp[1]) / 100) + ', on annonce ' +
             q.reponse);
      } else {
        var md = /vaut <b>([\d,]+)<\/b>/.exec(q.enonce);
        if (!md) { ko('ecritures : le décimal est illisible'); continue; }
        if (Math.abs(lit(md[1]) * 100 - q.reponse) > 1e-9)
          ko('ecritures : ' + md[1] + ' vaut ' + (lit(md[1]) * 100) + ' %, on annonce ' +
             q.reponse);
      }
      continue;
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE PROPORTION EST CELLE DES DEUX NOMBRES DE L\'ÉNONCÉ');
