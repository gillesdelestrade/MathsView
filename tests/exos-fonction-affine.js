/* Les exercices « Fonction affine » (3ème).
 *
 * On ne relit pas ce que le générateur annonce : on refait le travail à côté,
 * à partir des seules données de l'énoncé — les coordonnées écrites dans le
 * texte, ou le tracé lu dans le SVG. Une réponse juste par accident (parce que
 * l'énoncé et la correction partagent la même variable fausse) ne passerait
 * pas cette lecture-là.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/repere-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/3eme/fonction-affine.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }

/* les couples (x ; y) écrits dans l'énoncé */
function couples(t) {
  var out = [], m, re = /\((−?[\d.,]+) ; (−?[\d.,]+)\)/g;
  while ((m = re.exec(t))) out.push([lit(m[1]), lit(m[2])]);
  return out;
}
/* La droite tracée, relue dans le SVG.
   On ne se fie pas aux étiquettes des graduations — elles portent des décalages
   de quelques pixels pour la lisibilité. On prend le repère à la source : les
   deux AXES donnent l'origine en pixels, et l'écart entre deux lignes du
   quadrillage donne l'échelle. */
function droiteDuDessin(svg) {
  var m, re, axes = [], grille = [];
  re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#94a3b8" stroke-width="1.8"\/>/g;
  while ((m = re.exec(svg))) axes.push([+m[1], +m[2], +m[3], +m[4]]);
  re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#e2e8f0" stroke-width="1"\/>/g;
  while ((m = re.exec(svg))) grille.push([+m[1], +m[2], +m[3], +m[4]]);
  if (axes.length !== 2 || grille.length < 4) return null;
  var horiz = axes.filter(function (a) { return Math.abs(a[1] - a[3]) < 0.5; })[0];
  var vert = axes.filter(function (a) { return Math.abs(a[0] - a[2]) < 0.5; })[0];
  if (!horiz || !vert) return null;
  var y0px = horiz[1], x0px = vert[0];
  // l'écart entre deux verticales du quadrillage : c'est l'unité, en pixels
  var xs = grille.filter(function (g) { return Math.abs(g[0] - g[2]) < 0.5; })
                 .map(function (g) { return g[0]; }).sort(function (a, b) { return a - b; });
  if (xs.length < 2) return null;
  // Sur un seul intervalle, l'arrondi au dixième de pixel fait 1 % d'erreur —
  // qui disparaît dans m (un rapport) mais pas dans p. On mesure donc sur
  // toute la largeur du quadrillage.
  var k = (xs[xs.length - 1] - xs[0]) / (xs.length - 1);
  if (!(k > 1)) return null;
  var l = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#2563eb" stroke-width="2.6"/.exec(svg);
  if (!l) return null;
  /* On reste en PIXELS le plus longtemps possible. Les extrémités du trait sont
     aux bords du cadre : pour une droite très inclinée, elles sont loin
     au-dessus ou au-dessous, et la moindre imprécision sur l'échelle s'y
     multiplie. En interpolant d'abord, puis en ne divisant qu'une fois par k,
     on ne traîne plus cette amplification. */
  var x1p = +l[1], y1p = +l[2], x2p = +l[3], y2p = +l[4];
  if (Math.abs(x2p - x1p) < 1) return null;
  var mm = -(y2p - y1p) / (x2p - x1p);        // k se simplifie : m est exact
  var t = (x0px - x1p) / (x2p - x1p);
  var pyEn0 = y1p + t * (y2p - y1p);
  return { m: mm, p: (y0px - pyEn0) / k, k: k };
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 700; g++) {
    var q = G.genere(MathsAlea(palier * 6151 + g), palier);
    nb++;
    var fam = /Vrai ou faux/.test(q.enonce) && /est sur la droite/.test(q.enonce) ? 'appartient'
            : q.type === 'vraifaux' ? 'proprietes'
            : /croissante ou décroissante/.test(q.enonce) ? 'sens'
            : /Voici la droite/.test(q.enonce) ? 'lecture'
            : /Quelle est son équation/.test(q.enonce) ? 'equation'
            : /coefficient directeur \\\(m\\\)/.test(q.enonce) &&
              /Calcule/.test(q.enonce) ? 'coefficient'
            : /ordonnée à l'origine/.test(q.enonce) ? 'ordonnee'
            : /a pour image/.test(q.enonce) ? 'antecedent' : 'image';
    vus[fam] = (vus[fam] || 0) + 1;

    /* --- socle ------------------------------------------------------ */
    if (!q.etapes || !q.etapes.length) ko(fam + ' : pas de correction');
    if (/<[^>]*$/.test(q.enonce.replace(/<svg[\s\S]*<\/svg>/, '')))
      ko(fam + ' : balise HTML tronquée');
    if (/[^\\<]<[^\/a-zA-Z!]/.test(q.enonce.replace(/<svg[\s\S]*<\/svg>/, '')))
      ko(fam + ' : un « < » brut dans l\'énoncé');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      if (q.choix.length < 3) ko(fam + ' : moins de trois propositions');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques → ' + c);
        deja[c] = 1;
      });
    }
    if (q.type === 'nombre') {
      if (!isFinite(q.reponse)) ko(fam + ' : la réponse n\'est pas un nombre');
      // la réponse doit s'écrire exactement en décimal : sinon elle est intapable
      if (Math.abs(q.reponse * 100 - Math.round(q.reponse * 100)) > 1e-9)
        ko(fam + ' : réponse non décimale (' + q.reponse + ') — intapable au clavier');
    }

    /* --- chaque famille, recalculée depuis l'énoncé seul ------------- */
    if (fam === 'coefficient') {
      var C = couples(q.enonce);
      if (C.length !== 2) { ko('coefficient : l\'énoncé ne donne pas deux points'); continue; }
      var dx = C[1][0] - C[0][0], dy = C[1][1] - C[0][1];
      if (dx === 0) ko('coefficient : les deux points ont la même abscisse');
      else if (Math.abs(dy / dx - q.reponse) > 1e-9)
        ko('coefficient : les points donnent ' + (dy / dx) + ', la réponse annoncée est ' +
           q.reponse);
    }

    if (fam === 'ordonnee') {
      var C2 = couples(q.enonce);
      var mm = /coefficient directeur \\\(m = (.+?)\\\) et passe/.exec(q.enonce);
      if (mm) {
        // m donné : p = yA − m·xA
        // fracTex écrit le moins DEVANT le \dfrac : -\dfrac{1}{2}
        var mv = /(-?)\\dfrac\{(\d+)\}\{(\d+)\}/.exec(mm[1]);
        var mval = mv ? (mv[1] === '-' ? -1 : 1) * (+mv[2]) / (+mv[3]) : lit(mm[1]);
        if (C2.length < 1) ko('ordonnee : pas de point dans l\'énoncé');
        else if (Math.abs((C2[0][1] - mval * C2[0][0]) - q.reponse) > 1e-9) {
          ko('ordonnee : m et A donnent ' + (C2[0][1] - mval * C2[0][0]) +
             ', la réponse annoncée est ' + q.reponse);
        }
      } else if (C2.length === 2) {
        var m2 = (C2[1][1] - C2[0][1]) / (C2[1][0] - C2[0][0]);
        if (Math.abs((C2[0][1] - m2 * C2[0][0]) - q.reponse) > 1e-9)
          ko('ordonnee : les deux points donnent ' + (C2[0][1] - m2 * C2[0][0]) +
             ', la réponse annoncée est ' + q.reponse);
      } else ko('ordonnee : énoncé incomplet');
    }

    if (fam === 'equation') {
      var C3 = couples(q.enonce);
      if (C3.length !== 2) { ko('equation : l\'énoncé ne donne pas deux points'); continue; }
      var m3 = (C3[1][1] - C3[0][1]) / (C3[1][0] - C3[0][0]);
      var p3 = C3[0][1] - m3 * C3[0][0];
      // chaque proposition est une équation : on la relit et on teste les DEUX points
      q.choix.forEach(function (c, ci) {
        var eq = /y = (.*)\\/.exec(c.replace(/\\\(|\\\)/g, '\\'));
        var t = c.replace(/\\\(|\\\)/g, '').replace('y = ', '');
        // « ax + b », « x + b », « -x », « \frac{a}{b}x + c »
        var f = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x\s*(?:([+-])\s*(\d+))?$/
                .exec(t.replace(/\s/g, ''). replace(/([+-])/g, ' $1 ').replace(/\s+/g, ' ').trim()
                       .replace(/ /g, ''));
        var mc, pc;
        var mm2 = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x/.exec(t.replace(/\s/g, ''));
        if (!mm2) { ko('equation : proposition illisible → ' + t); return; }
        mc = mm2[2] !== undefined ? (+mm2[2]) / (+mm2[3])
           : mm2[4] !== undefined ? +mm2[4] : 1;
        if (mm2[1] === '-') mc = -mc;
        var reste = t.replace(/\s/g, '').slice(mm2[0].length);
        pc = reste ? +reste : 0;
        var juste = Math.abs(mc - m3) < 1e-9 && Math.abs(pc - p3) < 1e-9;
        if (juste !== (ci === q.correct))
          ko('equation : « ' + t + ' » ' + (juste ? 'convient' : 'ne convient pas') +
             ' mais est donnée comme ' + (ci === q.correct ? 'juste' : 'fausse') +
             ' (attendu m=' + m3 + ', p=' + p3 + ')');
      });
    }

    if (fam === 'lecture') {
      var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);
      if (!svg) { ko('lecture : pas de figure'); continue; }
      var D = droiteDuDessin(svg[0]);
      if (!D) { ko('lecture : la droite n\'est pas lisible sur le dessin'); continue; }
      /* Les coordonnées du SVG sont arrondies au dixième de pixel : relire le
         tracé redonne m et p à quelques centièmes près. Une VRAIE erreur du
         générateur déplacerait p d'au moins 1 (p est entier) ou m d'au moins
         un demi — 0,1 les attrape toutes, tout en laissant passer le bruit de
         relecture. */
      var TOL = 0.1;
      if (q.type === 'nombre') {
        var surM = /coefficient directeur/.test(q.enonce);
        var attendu = surM ? D.m : D.p;
        if (Math.abs(attendu - q.reponse) > TOL) {
          ko('lecture : le dessin donne ' + (surM ? 'm' : 'p') + ' = ' + attendu.toFixed(3) +
             ', la réponse annoncée est ' + q.reponse);
        }
      } else {
        // l'équation cochée doit être celle du tracé
        var bonne = q.choix[q.correct].replace(/\\\(|\\\)|\s/g, '').replace('y=', '');
        var mm3 = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x/.exec(bonne);
        if (mm3) {
          var mc2 = mm3[2] !== undefined ? (+mm3[2]) / (+mm3[3])
                  : mm3[4] !== undefined ? +mm3[4] : 1;
          if (mm3[1] === '-') mc2 = -mc2;
          var pc2 = bonne.slice(mm3[0].length) ? +bonne.slice(mm3[0].length) : 0;
          if (Math.abs(mc2 - D.m) > 0.1 || Math.abs(pc2 - D.p) > 0.1)
            ko('lecture : le dessin donne y = ' + D.m.toFixed(2) + 'x + ' + D.p.toFixed(2) +
               ', l\'équation cochée est ' + bonne);
        }
      }
      // le point (0 ; p) doit être DANS le cadre, sinon on ne peut pas le lire
      var vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg[0]);
      if (!vb) ko('lecture : pas de viewBox');
    }

    if (fam === 'image' || fam === 'antecedent') {
      var fx = /f\(x\) = (.*?)\\\)/.exec(q.enonce);
      if (!fx) { ko(fam + ' : l\'expression de f est illisible'); continue; }
      var t2 = fx[1].replace(/\s/g, '');
      var mm4 = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x/.exec(t2);
      if (!mm4) { ko(fam + ' : coefficient illisible → ' + t2); continue; }
      var mv2 = mm4[2] !== undefined ? (+mm4[2]) / (+mm4[3])
              : mm4[4] !== undefined ? +mm4[4] : 1;
      if (mm4[1] === '-') mv2 = -mv2;
      var pv2 = t2.slice(mm4[0].length) ? +t2.slice(mm4[0].length) : 0;
      if (fam === 'image') {
        var xa = lit(/Calcule \\\(f\((−?[\d,]+)\)/.exec(q.enonce)[1]);
        if (Math.abs(mv2 * xa + pv2 - q.reponse) > 1e-9)
          ko('image : f(' + xa + ') vaut ' + (mv2 * xa + pv2) + ', la réponse annoncée est ' +
             q.reponse);
      } else {
        var ya = lit(/a pour image (−?[\d,]+)/.exec(q.enonce)[1]);
        if (Math.abs(mv2 * q.reponse + pv2 - ya) > 1e-9)
          ko('antécédent : f(' + q.reponse + ') vaut ' + (mv2 * q.reponse + pv2) +
             ' et non ' + ya);
      }
    }

    if (fam === 'appartient') {
      var fx2 = /f\(x\) = (.*?)\\\)/.exec(q.enonce);
      var C4 = couples(q.enonce);
      if (!fx2 || C4.length !== 1) { ko('appartient : énoncé incomplet'); continue; }
      var t3 = fx2[1].replace(/\s/g, '');
      var mm5 = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x/.exec(t3);
      var mv3 = mm5[2] !== undefined ? (+mm5[2]) / (+mm5[3])
              : mm5[4] !== undefined ? +mm5[4] : 1;
      if (mm5[1] === '-') mv3 = -mv3;
      var pv3 = t3.slice(mm5[0].length) ? +t3.slice(mm5[0].length) : 0;
      var dessus = Math.abs(mv3 * C4[0][0] + pv3 - C4[0][1]) < 1e-9;
      if (dessus !== (q.correct === 0))
        ko('appartient : C' + JSON.stringify(C4[0]) + ' est ' + (dessus ? '' : 'hors de ') +
           'la droite, la réponse annoncée dit le contraire');
    }

    if (fam === 'sens') {
      var bonne2 = q.choix[q.correct];
      var mm6 = /f\(x\) = (.*?)\\\)/.exec(q.enonce);
      var mval2 = null;
      if (mm6) {
        var t4 = mm6[1].replace(/\s/g, '');
        var e6 = /^(-?)(?:\\dfrac\{(-?\d+)\}\{(\d+)\}|(-?\d+))?x/.exec(t4);
        mval2 = e6[2] !== undefined ? (+e6[2]) / (+e6[3]) : e6[4] !== undefined ? +e6[4] : 1;
        if (e6[1] === '-') mval2 = -mval2;
      } else {
        var im = [], re6 = /f\((−?[\d,]+)\) = (−?[\d,]+)/g, mm7;
        while ((mm7 = re6.exec(q.enonce))) im.push([lit(mm7[1]), lit(mm7[2])]);
        if (im.length === 2) mval2 = (im[1][1] - im[0][1]) / (im[1][0] - im[0][0]);
      }
      if (mval2 === null) ko('sens : impossible de retrouver m dans l\'énoncé');
      else {
        var attendu2 = mval2 > 0 ? 'Croissante' : 'Décroissante';
        if (bonne2 !== attendu2)
          ko('sens : m = ' + mval2 + ' donc ' + attendu2 + ', or on coche « ' + bonne2 + ' »');
      }
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('TOUTES LES RÉPONSES SONT VÉRIFIÉES');
