/* Les exercices « Lire et placer un point dans un repère » (5ème).
 *
 * Tout se joue sur le dessin : on relit donc le repère produit en SVG — les
 * axes, le quadrillage, les points nommés — on reconstitue l'échelle, et on
 * retrouve les coordonnées de chaque point tel qu'il est RÉELLEMENT tracé. La
 * réponse annoncée doit être celle-là.
 *
 * On vérifie aussi ce qui fait la leçon : le couple INVERSÉ doit figurer parmi
 * les propositions — c'est l'erreur qu'on veut débusquer — et il ne doit jamais
 * coïncider avec la bonne réponse, sans quoi la question n'aurait plus d'objet.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/repere-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/reperage.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }

/* ------------------------------------------------------------------ */
/* Relire le repère : l'origine et l'échelle, puis les points          */
/* ------------------------------------------------------------------ */
function repere(svg) {
  var m, axes = [], grille = [];
  var re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#94a3b8" stroke-width="1.8"\/>/g;
  while ((m = re.exec(svg))) axes.push([+m[1], +m[2], +m[3], +m[4]]);
  re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#e2e8f0" stroke-width="1"\/>/g;
  while ((m = re.exec(svg))) grille.push([+m[1], +m[2], +m[3], +m[4]]);
  if (axes.length !== 2 || grille.length < 4) return null;
  var horiz = axes.filter(function (a) { return Math.abs(a[1] - a[3]) < 0.5; })[0];
  var vert = axes.filter(function (a) { return Math.abs(a[0] - a[2]) < 0.5; })[0];
  if (!horiz || !vert) return null;
  // l'unité : l'écart moyen entre les verticales du quadrillage
  var xs = grille.filter(function (g) { return Math.abs(g[0] - g[2]) < 0.5; })
                 .map(function (g) { return g[0]; }).sort(function (a, b) { return a - b; });
  if (xs.length < 2) return null;
  var k = (xs[xs.length - 1] - xs[0]) / (xs.length - 1);
  if (!(k > 1)) return null;
  var f = { x0: vert[0], y0: horiz[1], k: k, points: {} };
  // les points : un cercle, et un nom écrit à côté
  var rp = /<circle cx="([\d.-]+)" cy="([\d.-]+)" r="[\d.]+" fill="([^"]+)"\/>/g;
  var cercles = [];
  while ((m = rp.exec(svg))) cercles.push({ x: +m[1], y: +m[2], c: m[3] });
  var rt = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([A-D])<\/text>/g;
  while ((m = rt.exec(svg))) {
    var px = +m[1], py = +m[2], nom = m[3];
    var best = null, bd = Infinity;
    cercles.forEach(function (c) {
      var d = Math.hypot(c.x - px, c.y - py);
      if (d < bd) { bd = d; best = c; }
    });
    if (best) {
      f.points[nom] = [Math.round((best.x - f.x0) / f.k * 100) / 100,
                       Math.round((f.y0 - best.y) / f.k * 100) / 100];
    }
  }
  return f;
}
function couples(txt) {
  // le moins peut être le vrai signe français ou celui d'un bloc LaTeX
  var out = [], m, re = /\(([−-]?[\d,]+) ; ([−-]?[\d,]+)\)/g;
  while ((m = re.exec(txt))) out.push([lit(m[1]), lit(m[2])]);
  return out;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 7237 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /Quelle est l'abscisse|Quelle est l'ordonnée/.test(q.enonce) ? 'coord'
            : /Lequel de ces points/.test(q.enonce) ? 'placer'
            : /Où arrive-t-on/.test(q.enonce) ? 'deplacement'
            : /posé <b>sur un axe/.test(q.enonce) ? 'axes' : 'paire';
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
    if (fam === 'proprietes') continue;

    var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);
    if (!svg) { ko(fam + ' : pas de repère'); continue; }
    var f = repere(svg[0]);
    if (!f) { ko(fam + ' : le repère est illisible'); continue; }
    var A = f.points.A;
    if (!A) { ko(fam + ' : le point A est introuvable sur le dessin'); continue; }
    // les coordonnées lues sur le dessin doivent être entières
    [A[0], A[1]].forEach(function (v) {
      if (Math.abs(v - Math.round(v)) > 0.03)
        ko(fam + ' : un point n\'est pas sur un nœud du quadrillage (' + v + ')');
    });
    var Ax = Math.round(A[0]), Ay = Math.round(A[1]);

    /* --- lire une coordonnée ---------------------------------------- */
    if (fam === 'coord') {
      var abscisse = /l'abscisse/.test(q.enonce);
      var attendu = abscisse ? Ax : Ay;
      if (Math.abs(attendu - q.reponse) > 1e-9)
        ko('coord : le point dessiné est (' + Ax + ' ; ' + Ay + '), on demande ' +
           (abscisse ? 'l\'abscisse' : 'l\'ordonnée') + ' et on attend ' + q.reponse);
      continue;
    }

    /* --- le couple complet ------------------------------------------ */
    if (fam === 'paire' || fam === 'axes') {
      var bonne = couples(q.choix[q.correct])[0];
      if (!bonne) { ko(fam + ' : la réponse cochée est illisible'); continue; }
      if (bonne[0] !== Ax || bonne[1] !== Ay)
        ko(fam + ' : le point dessiné est (' + Ax + ' ; ' + Ay + '), on coche ' +
           JSON.stringify(bonne));
      // le couple inversé doit être proposé, et ne pas être la bonne réponse
      var inverse = [Ay, Ax];
      var propose = q.choix.some(function (c) {
        var p = couples(c)[0];
        return p && p[0] === inverse[0] && p[1] === inverse[1];
      });
      if (Ax !== Ay && !propose)
        ko(fam + ' : le couple inversé (' + inverse + ') n\'est pas proposé — c\'est ' +
           'pourtant l\'erreur à débusquer');
      if (Ax === Ay) ko(fam + ' : abscisse et ordonnée égales — inverser ne change rien');
      if (fam === 'axes' && Ax !== 0 && Ay !== 0)
        ko('axes : le point annoncé sur un axe a deux coordonnées non nulles');
      continue;
    }

    /* --- placer : lequel de ces points ? ---------------------------- */
    if (fam === 'placer') {
      var cible = couples(q.enonce)[0];
      if (!cible) { ko('placer : les coordonnées demandées sont illisibles'); continue; }
      var noms = ['A', 'B', 'C', 'D'];
      var bons = noms.filter(function (n) {
        var p = f.points[n];
        return p && Math.round(p[0]) === cible[0] && Math.round(p[1]) === cible[1];
      });
      if (bons.length !== 1)
        ko('placer : ' + bons.length + ' point(s) ont les coordonnées demandées');
      else if (noms.indexOf(bons[0]) !== q.correct)
        ko('placer : c\'est ' + bons[0] + ' qui est en ' + JSON.stringify(cible) +
           ', on coche ' + noms[q.correct]);
      // les quatre points doivent être bien séparés
      noms.forEach(function (n1, i) {
        noms.forEach(function (n2, j) {
          if (i >= j || !f.points[n1] || !f.points[n2]) return;
          var d = Math.abs(f.points[n1][0] - f.points[n2][0]) +
                  Math.abs(f.points[n1][1] - f.points[n2][1]);
          if (d < 2.9) ko('placer : deux points sont trop proches pour être distingués');
        });
      });
      continue;
    }

    /* --- les bonds -------------------------------------------------- */
    if (fam === 'deplacement') {
      var dep = couples(q.enonce)[0];
      if (!dep) { ko('deplacement : le point de départ est illisible'); continue; }
      if (dep[0] !== Ax || dep[1] !== Ay)
        ko('deplacement : l\'énoncé annonce ' + JSON.stringify(dep) + ' mais le dessin ' +
           'montre (' + Ax + ' ; ' + Ay + ')');
      var mh = /<b>(?:(\d+) pas vers (la droite|la gauche)|aucun pas horizontal)<\/b>/.exec(q.enonce);
      var mv = /<b>(?:(\d+) pas vers (le haut|le bas)|aucun pas vertical)<\/b>/.exec(q.enonce);
      if (!mh || !mv) { ko('deplacement : les déplacements sont illisibles'); continue; }
      var dx = mh[1] ? (+mh[1]) * (mh[2] === 'la droite' ? 1 : -1) : 0;
      var dy = mv[1] ? (+mv[1]) * (mv[2] === 'le haut' ? 1 : -1) : 0;
      var arr = [dep[0] + dx, dep[1] + dy];
      var coche = couples(q.choix[q.correct])[0];
      if (!coche || coche[0] !== arr[0] || coche[1] !== arr[1])
        ko('deplacement : depuis ' + JSON.stringify(dep) + ' avec (' + dx + ' ; ' + dy +
           ') on arrive en ' + JSON.stringify(arr) + ', on coche ' + JSON.stringify(coche));
      // aucun leurre ne doit tomber juste
      var justes = q.choix.filter(function (c) {
        var p = couples(c)[0];
        return p && p[0] === arr[0] && p[1] === arr[1];
      }).length;
      if (justes !== 1) ko('deplacement : ' + justes + ' propositions donnent le bon point');
      continue;
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE EST CELLE DU POINT RÉELLEMENT DESSINÉ');
