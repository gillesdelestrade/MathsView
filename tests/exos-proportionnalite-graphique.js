/* Les exercices « Reconnaître la proportionnalité : tableau et graphique » (5ème).
 *
 * Deux sources de vérité, et le contrôle les confronte sans jamais croire le
 * générateur sur parole.
 *
 * LE TABLEAU. Les couples sont relus dans le HTML de l'énoncé, et le contrôle
 * recalcule : le coefficient, la valeur manquante, et — pour la famille
 * « intrus » — quelle ligne a un quotient différent des autres. Il exige que
 * cette ligne soit UNIQUE : deux intruses possibles, et la question n'aurait
 * pas de réponse.
 *
 * LE GRAPHIQUE. Les points sont relus dans le SVG produit, en pixels, puis
 * reconvertis en coordonnées grâce à la grille et aux graduations. La réponse
 * annoncée doit correspondre aux points RÉELLEMENT dessinés, pas à ceux que le
 * générateur croit avoir dessinés — c'est toute la différence.
 *
 * Enfin la couverture : la famille « graphique » doit produire les trois cas,
 * et en particulier « alignés mais pas par l'origine ». Sans lui, l'exercice
 * n'entraînerait jamais l'élève sur l'erreur que la leçon vise.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/graphique-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/proportionnalite-graphique.js');

var err = [], vus = {}, nb = 0, casGraphe = {};
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }

/* ------------------------------------------------------------------ */
/* Relire le tableau de l'énoncé                                       */
/* ------------------------------------------------------------------ */
function couples(txt) {
  var corps = /<tbody>([\s\S]*?)<\/tbody>/.exec(txt);
  if (!corps) return null;
  var out = [];
  (corps[1].match(/<tr>[\s\S]*?<\/tr>/g) || []).forEach(function (l) {
    var tds = (l.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || []).map(function (d) {
      return d.replace(/<[^>]+>/g, '').trim();
    });
    if (tds.length !== 2) return;
    function v(t) { var m = /^(−?[\d,]+)/.exec(t); return m ? lit(m[1]) : null; }
    out.push({ x: v(tds[0]), y: v(tds[1]), trou: tds.indexOf('?') });
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Relire le graphique : la grille donne l'échelle, les cercles les points */
/* ------------------------------------------------------------------ */
/* On ne fait confiance à rien : l'origine et le pas se retrouvent dans les
   graduations écrites le long des axes, et les points se convertissent avec.
   Un point dessiné un carreau trop haut serait donc vu. */
function graphique(svg) {
  var m, textes = [];
  var re = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]*)<\/text>/g;
  while ((m = re.exec(svg))) textes.push({ x: +m[1], y: +m[2], t: m[3] });

  /* L'ORIGINE se prend sur les axes eux-mêmes, jamais sur les étiquettes : une
     étiquette est posée sur sa ligne de base, à quelques pixels de la
     graduation, et ce décalage se retrouverait tel quel dans toutes les
     coordonnées relues — assez pour faire mentir le contrôle sans qu'il s'en
     aperçoive. Les ÉCHELLES, elles, se déduisent d'écarts entre étiquettes :
     un décalage constant s'y annule. */
  var axes = [], ma;
  var ra = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#94a3b8" stroke-width="1.8"\/>/g;
  while ((ma = ra.exec(svg))) axes.push([+ma[1], +ma[2], +ma[3], +ma[4]]);
  var horiz = axes.filter(function (a) { return Math.abs(a[1] - a[3]) < 0.5; })[0];
  var vert = axes.filter(function (a) { return Math.abs(a[0] - a[2]) < 0.5; })[0];
  if (!horiz || !vert) return null;
  var x0 = vert[0], y0 = horiz[1];

  var zero = textes.filter(function (t) { return t.t === '0'; })[0];
  if (!zero) return null;
  var gradX = textes.filter(function (t) {
    return Math.abs(t.y - zero.y) < 1 && /^[\d,]+$/.test(t.t) && t.t !== '0';
  }).map(function (t) { return { px: t.x, v: lit(t.t) }; });
  var gradY = textes.filter(function (t) {
    return Math.abs(t.x - (zero.x - 5)) < 12 && /^[\d,]+$/.test(t.t) && t.t !== '0' &&
           Math.abs(t.y - zero.y) > 1;
  }).map(function (t) { return { py: t.y, v: lit(t.t) }; });
  if (gradX.length < 2 || gradY.length < 2) return null;

  function echelle(g, cle) {
    var a = g[0], b = g[g.length - 1];
    return (b[cle] - a[cle]) / (b.v - a.v);
  }
  var ex = echelle(gradX, 'px'), ey = echelle(gradY, 'py');
  // et la cohérence des deux lectures : la graduation 1 doit tomber là où
  // l'origine et l'échelle la prédisent
  if (Math.abs(x0 + gradX[0].v * ex - gradX[0].px) > 1.5)
    return null;

  var pts = [];
  re = /<circle cx="([\d.-]+)" cy="([\d.-]+)"[^>]*\/>/g;
  while ((m = re.exec(svg))) {
    pts.push([Math.round((+m[1] - x0) / ex * 100) / 100,
              Math.round((+m[2] - y0) / ey * 100) / 100]);
  }
  // la droite tracée depuis l'origine, s'il y en a une
  var droite = null;
  var md = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#2563eb" stroke-width="2.4"\/>/
             .exec(svg);
  if (md) {
    var a = [(+md[1] - x0) / ex, (+md[2] - y0) / ey];
    var b = [(+md[3] - x0) / ex, (+md[4] - y0) / ey];
    droite = { de: a, a: b };
  }
  return { points: pts, droite: droite, zeroPx: [x0, y0] };
}

/* Le modèle du contrôle, écrit à part.
   Les coordonnées relues arrivent en pixels reconvertis, donc avec un bruit
   d'arrondi de l'ordre du centième. Comparer des produits en croix avec une
   tolérance absolue serait faux : le produit croît avec les ordonnées, et le
   seuil qui convient à des points sous 10 rejette à tort des points à 30. On
   vérifie donc d'abord que chaque coordonnée est bien celle d'un nœud du
   quadrillage, puis on ARRONDIT — après quoi l'arithmétique est exacte et ne
   demande plus aucune tolérance. */
function entiers(p) {
  return p.every(function (q) {
    return Math.abs(q[0] - Math.round(q[0])) < 0.05 &&
           Math.abs(q[1] - Math.round(q[1])) < 0.05;
  });
}
function arrondis(p) {
  return p.map(function (q) { return [Math.round(q[0]), Math.round(q[1])]; });
}
function alignes(p) {
  for (var i = 2; i < p.length; i++) {
    if ((p[1][0] - p[0][0]) * (p[i][1] - p[0][1]) !==
        (p[1][1] - p[0][1]) * (p[i][0] - p[0][0])) return false;
  }
  return true;
}
function proportionnel(p) {
  for (var i = 1; i < p.length; i++) {
    if (p[0][0] === 0 || p[i][1] * p[0][0] !== p[0][1] * p[i][0]) return false;
  }
  return true;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 4519 + g), palier);
    nb++;
    var fam = q.type === 'vraifaux' ? 'proprietes'
            : /Une seule ligne empêche/.test(q.enonce) ? 'intrus'
            : /Quel est son coefficient/.test(q.enonce) ? 'coefficient'
            : /Quelle valeur remplace/.test(q.enonce) ? 'completer'
            : /est-elle une situation de proportionnalité/.test(q.enonce) ? 'graphique'
            : /Lis sur le graphique/.test(q.enonce) ? 'lire'
            : 'point';
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
    if (q.type === 'nombre' && Math.abs(q.reponse * 100 - Math.round(q.reponse * 100)) > 1e-9)
      ko(fam + ' : réponse non décimale (' + q.reponse + ')');
    // un « = » ne doit jamais annoncer une valeur arrondie
    (q.etapes || []).forEach(function (e) {
      var mm, rq = /([\d,]+) ÷ ([\d,]+) = ([\d,]+)/g;
      while ((mm = rq.exec(e))) {
        if (Math.abs(lit(mm[1]) / lit(mm[2]) - lit(mm[3])) > 1e-9)
          ko(fam + ' : la correction écrit « ' + mm[0] +' », or le quotient ne tombe pas ' +
             'juste');
      }
    });
    if (fam === 'proprietes') continue;

    /* --- les familles à tableau --------------------------------------- */
    if (fam === 'intrus' || fam === 'coefficient' || fam === 'completer') {
      var T = couples(q.enonce);
      if (!T || T.length < 3) { ko(fam + ' : le tableau est illisible'); continue; }

      if (fam === 'coefficient') {
        var ks = T.map(function (r) { return r.y / r.x; });
        if (ks.some(function (v) { return Math.abs(v - ks[0]) > 1e-9; }))
          ko('coefficient : le tableau annoncé proportionnel ne l\'est pas');
        if (Math.abs(q.reponse - ks[0]) > 1e-9)
          ko('coefficient : le coefficient vaut ' + ks[0] + ', on attend ' + q.reponse);
        continue;
      }

      if (fam === 'completer') {
        var troues = T.filter(function (r) { return r.trou >= 0; });
        if (troues.length !== 1) {
          ko('completer : ' + troues.length + ' trou(s) dans le tableau'); continue;
        }
        var pleines = T.filter(function (r) { return r.trou < 0; });
        var k0 = pleines[0].y / pleines[0].x;
        if (pleines.some(function (r) { return Math.abs(r.y / r.x - k0) > 1e-9; }))
          ko('completer : les lignes complètes ne sont pas proportionnelles entre elles');
        var t = troues[0];
        var attendu = t.trou === 0 ? t.y / k0 : t.x * k0;
        if (Math.abs(q.reponse - attendu) > 1e-9)
          ko('completer : la valeur manquante est ' + attendu + ', on attend ' + q.reponse);
        continue;
      }

      // intrus : une ligne, et une seule, doit avoir un quotient à part
      var quots = T.map(function (r) { return r.y / r.x; });
      var horsJeu = [];
      quots.forEach(function (v, i) {
        var pareils = quots.filter(function (w) { return Math.abs(w - v) < 1e-9; }).length;
        if (pareils === 1) horsJeu.push(i);
      });
      if (horsJeu.length !== 1)
        ko('intrus : ' + horsJeu.length + ' ligne(s) à part — la réponse n\'est pas unique');
      else if (horsJeu[0] !== q.correct)
        ko('intrus : c\'est la ligne ' + (horsJeu[0] + 1) + ' qui est à part, on coche la ' +
           (q.correct + 1));
      // les propositions doivent être les lignes du tableau, dans l'ordre
      T.forEach(function (r, i) {
        var attendu = new RegExp('^' + String(r.x).replace('.', ',') + ' → ' +
                                 String(r.y).replace('.', ','));
        if (q.choix[i] && !attendu.test(q.choix[i]))
          ko('intrus : la proposition ' + (i + 1) + ' (« ' + q.choix[i] + ' ») ne reprend ' +
             'pas la ligne ' + (i + 1) + ' du tableau');
      });
      continue;
    }

    /* --- les familles à graphique -------------------------------------- */
    var svg = /<svg[\s\S]*?<\/svg>/.exec(q.enonce);
    if (!svg) { ko(fam + ' : pas de graphique'); continue; }
    var F = graphique(svg[0]);
    if (!F) { ko(fam + ' : le graphique est illisible'); continue; }

    if (fam === 'graphique') {
      var P = F.points;
      if (P.length < 4) { ko('graphique : moins de quatre points dessinés'); continue; }
      if (!entiers(P)) {
        ko('graphique : un point n\'est pas sur un nœud du quadrillage (' +
           JSON.stringify(P) + ')');
        continue;
      }
      P = arrondis(P);
      var ali = alignes(P), pro = proportionnel(P);
      var cas = pro ? 'oui' : ali ? 'origine' : 'alignes';
      casGraphe[cas] = (casGraphe[cas] || 0) + 1;

      var coche = q.choix[q.correct];
      var dit = /les points sont alignés, et la droite passe par l'origine/.test(coche) ? 'oui'
              : /mais la droite ne passe pas par l'origine/.test(coche) ? 'origine'
              : /les points ne sont pas alignés/.test(coche) ? 'alignes' : null;
      if (!dit) ko('graphique : la réponse cochée n\'est pas une des trois raisons');
      else if (dit !== cas)
        ko('graphique : les points dessinés sont « ' + cas + ' », on coche « ' + dit + ' »');
      if (q.choix.length !== 3) ko('graphique : il ne faut que les trois raisons');
      // aucune autre proposition ne doit décrire le même cas
      continue;
    }

    if (fam === 'lire' || fam === 'point') {
      if (!F.droite) { ko(fam + ' : la droite n\'est pas tracée'); continue; }
      if (Math.abs(F.droite.de[0]) > 0.03 || Math.abs(F.droite.de[1]) > 0.03)
        ko(fam + ' : la droite ne part pas de l\'origine (' + F.droite.de + ')');
      var kd = F.droite.a[1] / F.droite.a[0];

      if (fam === 'lire') {
        var mx = /correspond à ([\d,]+)/.exec(q.enonce);
        if (!mx) { ko('lire : l\'abscisse demandée est illisible'); continue; }
        var attendu2 = kd * lit(mx[1]);
        if (Math.abs(attendu2 - q.reponse) > 0.02)
          ko('lire : la droite dessinée donne ' + Math.round(attendu2 * 100) / 100 +
             ' pour ' + mx[1] + ', on attend ' + q.reponse);
        continue;
      }

      // point : un seul choix doit être sur la droite dessinée
      var sur = q.choix.filter(function (c) {
        var m2 = /\(([\d,]+) ; ([\d,]+)\)/.exec(c);
        return m2 && Math.abs(lit(m2[2]) - kd * lit(m2[1])) < 0.02;
      });
      if (sur.length !== 1)
        ko('point : ' + sur.length + ' proposition(s) sont sur la droite');
      else if (sur[0] !== q.choix[q.correct])
        ko('point : c\'est « ' + sur[0] + ' » qui est sur la droite, on coche « ' +
           q.choix[q.correct] + ' »');
    }
  }
}

/* Les trois cas graphiques doivent tous sortir — surtout celui qu'on rate. */
['oui', 'origine', 'alignes'].forEach(function (c) {
  if (!casGraphe[c]) ko('le cas graphique « ' + c + ' » n\'est jamais tiré');
});
if (casGraphe.origine && casGraphe.origine < (vus.graphique || 0) * 0.15)
  ko('le cas « alignés mais pas par l\'origine » est trop rare : ' + casGraphe.origine +
     ' sur ' + vus.graphique);

print(nb + ' questions vérifiées — ' + JSON.stringify(vus) + ' / graphiques ' +
      JSON.stringify(casGraphe));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE RÉPONSE EST CELLE DU TABLEAU ET DU GRAPHIQUE RÉELLEMENT PRODUITS');
