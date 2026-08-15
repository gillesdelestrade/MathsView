/* Les exercices « Calculer une expression littérale » (5ème).
 *
 * Toute la valeur de ces exercices tient à une chose : la réponse annoncée doit
 * être celle de l'expression ÉCRITE DANS L'ÉNONCÉ. Le contrôle relit donc
 * l'expression dans le texte, l'évalue avec son propre petit évaluateur — qui
 * ne partage rien avec le générateur — et compare.
 *
 * Il vérifie en outre ce qui fait la leçon :
 *   — une valeur négative apparaît TOUJOURS entre parenthèses dans la ligne
 *     substituée, sans quoi x² changerait de signe ;
 *   — la « bonne écriture » proposée en QCM est la seule qui redonne la bonne
 *     valeur, et le leurre du × oublié (« 34 » pour 3x avec x = 4) en est bien
 *     un ;
 *   — dans le tableau de valeurs, les cases déjà remplies sont justes elles
 *     aussi : une case fausse ferait douter d'une bonne réponse.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/substitution.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }

/* ------------------------------------------------------------------ */
/* Un évaluateur maison, pour les trois formes d'expressions           */
/* ------------------------------------------------------------------ */
/* « 3x + 5 », « x² − 4x », « 5(x + 2) ». On ne réutilise rien du générateur :
   c'est tout l'intérêt — si les deux se trompaient de la même façon, le
   contrôle ne servirait à rien. */
function evalue(expr, x) {
  var t = expr.replace(/\s/g, '').replace(/−/g, '-');
  var m;
  // a(x ± b)
  m = /^(-?\d+)\((x)([+-]\d+)\)$/.exec(t);
  if (m) return (+m[1]) * (x + (+m[3]));
  // x² ± ax
  m = /^x²([+-])(\d+)x$/.exec(t);
  if (m) return x * x + (m[1] === '+' ? 1 : -1) * (+m[2]) * x;
  // ax ± b
  m = /^(-?\d+)x([+-]\d+)$/.exec(t);
  if (m) return (+m[1]) * x + (+m[2]);
  // ax
  m = /^(-?\d+)x$/.exec(t);
  if (m) return (+m[1]) * x;
  return null;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 6883 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /Quelle écriture obtient-on/.test(q.enonce) ? 'ecriture'
            : /tableau de valeurs/.test(q.enonce) ? 'tableau'
            : /La formule/.test(q.enonce) && /et \\\(/.test(q.enonce) ? 'deux'
            : /La formule/.test(q.enonce) ? 'formule' : 'calcule';
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
      // toute réponse doit s'écrire exactement, sinon elle est intapable
      if (Math.abs(q.reponse * 100 - Math.round(q.reponse * 100)) > 1e-9)
        ko(fam + ' : réponse non décimale (' + q.reponse + ')');
    }

    /* --- calculer une expression, positive ou négative -------------- */
    if (fam === 'calcule') {
      var me = /A = ([^\\]+)\\\)/.exec(q.enonce);
      var mx = /x = (−?[\d,]+)/.exec(q.enonce);
      if (!me || !mx) { ko('calcule : énoncé illisible'); continue; }
      var x = lit(mx[1]);
      var attendu = evalue(me[1], x);
      if (attendu === null) { ko('calcule : expression non reconnue → ' + me[1]); continue; }
      if (Math.abs(attendu - q.reponse) > 1e-9)
        ko('calcule : ' + me[1] + ' pour x = ' + x + ' vaut ' + attendu + ', on annonce ' +
           q.reponse);
      // la ligne substituée doit encadrer les valeurs négatives
      var sub = q.etapes.join(' ');
      if (x < 0 && sub.indexOf('(' + String(x).replace('-', '−') + ')') < 0)
        ko('calcule : la valeur négative n\'est pas entre parenthèses dans la correction');
      continue;
    }

    /* --- la bonne écriture après substitution ----------------------- */
    if (fam === 'ecriture') {
      var m2 = /A = (\d+)x \+ (\d+)/.exec(q.enonce);
      var mx2 = /x = (−?[\d,]+)/.exec(q.enonce);
      if (!m2 || !mx2) { ko('ecriture : énoncé illisible'); continue; }
      var a = +m2[1], b = +m2[2], xv = lit(mx2[1]);
      var vraie = a * xv + b;
      // chaque proposition est relue et calculée : une seule doit tomber juste
      var justes = 0;
      q.choix.forEach(function (c, ci) {
        var t = c.replace(/\\\(|\\\)/g, '').replace(/\s/g, '');
        var val = null;
        var mm = /^(-?\d+)×\((-?\d+)\)\+(\d+)$/.exec(t) ||
                 /^(-?\d+)×(-?\d+)\+(\d+)$/.exec(t);
        if (mm) val = (+mm[1]) * (+mm[2]) + (+mm[3]);
        else {
          var mp = /^(-?\d+)\+\((-?\d+)\)\+(\d+)$/.exec(t) || /^(-?\d+)\+(-?\d+)\+(\d+)$/.exec(t);
          if (mp) val = (+mp[1]) + (+mp[2]) + (+mp[3]);
          else {
            var mt = /^(-?\d+)×\((-?\d+)\)×(\d+)$/.exec(t) || /^(-?\d+)×(-?\d+)×(\d+)$/.exec(t);
            if (mt) val = (+mt[1]) * (+mt[2]) * (+mt[3]);
            else if (/^\d+$/.test(t.split('+')[0])) val = NaN;   // le « 34 » collé
          }
        }
        var bon = val !== null && Math.abs(val - vraie) < 1e-9;
        if (bon) justes++;
        if (bon !== (ci === q.correct))
          ko('ecriture : « ' + t + ' » vaut ' + val + ' (attendu ' + vraie + ') mais est ' +
             'donnée comme ' + (ci === q.correct ? 'juste' : 'fausse'));
      });
      if (justes !== 1) ko('ecriture : ' + justes + ' proposition(s) donnent la bonne valeur');
      continue;
    }

    /* --- le tableau de valeurs -------------------------------------- */
    if (fam === 'tableau') {
      var me3 = /A = ([^\\]+)\\\)/.exec(q.enonce);
      if (!me3) { ko('tableau : expression illisible'); continue; }
      var xs = (/<tr><th>x<\/th>([\s\S]*?)<\/tr>/.exec(q.enonce) || [])[1];
      var ys = (/<tr><th>A<\/th>([\s\S]*?)<\/tr>/.exec(q.enonce) || [])[1];
      if (!xs || !ys) { ko('tableau : le tableau est illisible'); continue; }
      var lx = (xs.match(/<td>([^<]*)<\/td>/g) || []).map(function (d) {
        return lit(d.replace(/<[^>]+>/g, ''));
      });
      var ly = (ys.match(/<td>([\s\S]*?)<\/td>/g) || []).map(function (d) {
        return d.replace(/<[^>]+>/g, '');
      });
      if (lx.length !== 3 || ly.length !== 3) { ko('tableau : il n\'y a pas trois colonnes'); continue; }
      var trous = ly.filter(function (v) { return v === '?'; });
      if (trous.length !== 1) ko('tableau : ' + trous.length + ' case(s) vide(s) au lieu d\'une');
      lx.forEach(function (xx, i) {
        var att = evalue(me3[1], xx);
        if (att === null) { ko('tableau : expression non reconnue → ' + me3[1]); return; }
        if (ly[i] === '?') {
          if (Math.abs(att - q.reponse) > 1e-9)
            ko('tableau : la case manquante vaut ' + att + ', on annonce ' + q.reponse);
        } else if (Math.abs(lit(ly[i]) - att) > 1e-9) {
          ko('tableau : la case déjà remplie annonce ' + ly[i] + ' pour x = ' + xx +
             ', le calcul donne ' + att);
        }
      });
      // les trois abscisses doivent être distinctes
      if (lx[0] === lx[1] || lx[1] === lx[2] || lx[0] === lx[2])
        ko('tableau : deux colonnes ont la même valeur de x');
      continue;
    }

    /* --- les vraies formules ---------------------------------------- */
    if (fam === 'formule' || fam === 'deux') {
      var ecrit = (/La formule \\\(([^\\]+)\\\)/.exec(q.enonce) || [])[1];
      if (!ecrit) { ko(fam + ' : la formule est illisible'); continue; }
      var vals = {};
      var rv = /\\\(([A-Za-z]) = (−?[\d,]+)\\\)/g, mv;
      while ((mv = rv.exec(q.enonce))) vals[mv[1]] = lit(mv[2]);
      var e2 = ecrit.replace(/\{,\}/g, ',');
      var att2 = null;
      if (/3,14 × r²/.test(e2)) att2 = 3.14 * vals.r * vals.r;
      else if (/9,81 × m/.test(e2)) att2 = 9.81 * vals.m;
      else if (/v × 3/.test(e2)) att2 = vals.v * 3;
      else if (/4 × c/.test(e2)) att2 = 4 * vals.c;
      else if (/2 × \(L \+ l\)/.test(e2)) att2 = 2 * (vals.L + vals.l);
      else if (/b × h ÷ 2/.test(e2)) att2 = vals.b * vals.h / 2;
      else if (/v × t/.test(e2)) att2 = vals.v * vals.t;
      if (att2 === null) { ko(fam + ' : formule non reconnue → ' + e2); continue; }
      if (Math.abs(Math.round(att2 * 100) / 100 - q.reponse) > 1e-9)
        ko(fam + ' : ' + e2 + ' avec ' + JSON.stringify(vals) + ' donne ' +
           (Math.round(att2 * 100) / 100) + ', on annonce ' + q.reponse);
      // l'unité doit figurer dans la correction
      if (fam === 'formule' && !/cm²|cm|N|km/.test(q.etapes.join(' ')))
        ko('formule : l\'unité n\'apparaît pas dans la correction');
      continue;
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE EST CELLE DE L\'EXPRESSION ÉCRITE DANS L\'ÉNONCÉ');
