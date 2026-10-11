/*
 * Les exercices « Triangle inscrit dans un demi-cercle » (2nde).
 *
 * Rien n'est relu tel quel. La figure est reparsée dans son SVG (le cercle,
 * les points nommés) et c'est le contrôle qui décide si [AB] est un diamètre
 * et si M est sur le cercle ; le vrai/faux annoncé doit en découler. L'angle
 * écrit sur la figure est remesuré sur les points dessinés. Les longueurs sont
 * relues dans l'énoncé et Pythagore refait à côté. Pour « où est M ? », la
 * comparaison AM² + BM² ⋚ AB² est refaite et confrontée à la case annoncée.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/2nde/cercle-triangle-rectangle.js');
if (!G || G.id !== 'cercle-demi') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function d2(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function angle(V, P, Q) {
  var u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]))))) * 180 / Math.PI;
}

/* Relire la figure : le cercle, les points, les textes. */
function lire(enonce) {
  var m = /<svg[\s\S]*<\/svg>/.exec(enonce);
  if (!m) return null;
  var svg = m[0], f = { pts: {}, textes: [] };
  var c = /<circle class="cercle" cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.]+)"/.exec(svg);
  if (!c) return null;
  f.O = [+c[1], +c[2]]; f.r = +c[3];
  var re = /<circle class="pt" data-nom="([A-Z])" cx="([\d.-]+)" cy="([\d.-]+)"/g, t;
  while ((t = re.exec(svg))) f.pts[t[1]] = [+t[2], +t[3]];
  var rt = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]+)<\/text>/g;
  while ((t = rt.exec(svg))) f.textes.push({ p: [+t[1], +t[2] - 6], txt: t[3] });
  f.texte = enonce.slice(enonce.indexOf('</svg>') + 6);
  return f;
}
function surCercle(f, P) { return Math.abs(d2(f.O, P) - f.r) < 0.02 * f.r; }
// Distance de O à la droite (AB), en fraction du rayon.
function ecartO(f, A, B) {
  var dx = B[0] - A[0], dy = B[1] - A[1];
  return Math.abs(dx * (A[1] - f.O[1]) - dy * (A[0] - f.O[0])) / Math.hypot(dx, dy) / f.r;
}
function nombre(re, s) { var m = re.exec(s); return m ? parseFloat(m[1].replace('{,}', '.').replace(',', '.')) : NaN; }

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 7919 + g), palier);
    nb++;
    if (!q.etapes || q.etapes.length < 2) ko('palier ' + palier + ' : correction trop courte');
    if (q.type === 'qcm') {
      if (q.choix.indexOf(q.choix[q.correct]) !== q.correct || q.correct < 0) ko('QCM : la bonne réponse est absente ou en double');
      var uniques = {}; q.choix.forEach(function (c) { uniques[c] = 1; });
      if (Object.keys(uniques).length !== q.choix.length) ko('QCM : deux propositions identiques');
    }
    var f = lire(q.enonce);
    var s = f ? f.texte : q.enonce;

    /* --- Reconnaître : vrai/faux porté par la figure ------------------ */
    if (q.type === 'vraifaux') {
      if (!f) { ko('vrai/faux sans figure'); continue; }
      if (!f.pts.A || !f.pts.B || !f.pts.M || !f.pts.O) { ko('reconnaître : il manque un point nommé'); continue; }
      if (d2(f.pts.O, f.O) > 1) ko('reconnaître : O n\'est pas au centre du cercle');
      var diam = ecartO(f, f.pts.A, f.pts.B) < 0.02 && surCercle(f, f.pts.A) && surCercle(f, f.pts.B);
      var dessus = surCercle(f, f.pts.M);
      var cas = diam && dessus ? 'diametre' : !diam ? 'corde' : (d2(f.O, f.pts.M) < f.r ? 'dedans' : 'dehors');
      vu('reconnaitre-' + cas);
      var attendu = diam && dessus ? 0 : 1;
      if (q.correct !== attendu) ko('reconnaître (' + cas + ') : la figure dit ' + (attendu ? 'faux' : 'vrai') + ', le générateur annonce l\'inverse');
      // Les cas « faux » doivent l'être franchement : lisibles à l'œil.
      if (cas === 'corde' && ecartO(f, f.pts.A, f.pts.B) < 0.35) ko('corde : [AB] frôle le centre, la figure est ambiguë');
      if (cas === 'corde' && !surCercle(f, f.pts.M)) ko('corde : M devrait être sur le cercle');
      if ((cas === 'dedans' || cas === 'dehors') && Math.abs(d2(f.O, f.pts.M) - f.r) < 0.25 * f.r) ko(cas + ' : M frôle le cercle, la figure est ambiguë');
      if (cas === 'diametre' && Math.abs(angle(f.pts.M, f.pts.A, f.pts.B) - 90) > 1) ko('diamètre : le triangle dessiné n\'est pas rectangle en M');
      if (cas === 'corde' && Math.abs(angle(f.pts.M, f.pts.A, f.pts.B) - 90) < 15) ko('corde : l\'angle AMB dessiné est trop proche de 90°');
      // M lisible : pas collé à A ni à B.
      if (d2(f.pts.M, f.pts.A) < 0.4 * f.r || d2(f.pts.M, f.pts.B) < 0.4 * f.r) ko(cas + ' : M est collé à A ou B');
      // L'énoncé ne donne pas la réponse.
      if (/corde|n'est pas|intérieur|extérieur/.test(s)) ko('reconnaître : l\'énoncé trahit la réponse');
      if (cas === 'corde' && /diamètre/.test(s)) ko('corde : l\'énoncé parle de diamètre alors que [AB] n\'en est pas un');
      if (cas === 'diametre' && !/diamètre|trois points du cercle/.test(s)) ko('diamètre : l\'énoncé devrait situer A, B et M');
      var texteCorr = q.etapes.join(' ');
      if (cas === 'corde' && !/corde|pas un diamètre|ne passe/.test(texteCorr)) ko('corde : la correction doit dire que [AB] n\'est pas un diamètre');
      if ((cas === 'dedans' || cas === 'dehors') && !/n'est pas sur le cercle/.test(texteCorr)) ko(cas + ' : la correction doit dire que M n\'est pas sur le cercle');
      // L'angle approximatif annoncé dans la correction est celui du dessin.
      var ma = /environ (\d+)°/.exec(texteCorr);
      if (ma && Math.abs(+ma[1] - angle(f.pts.M, f.pts.A, f.pts.B)) > 1.5) ko(cas + ' : la correction annonce ' + ma[1] + '° mais le dessin montre ' + angle(f.pts.M, f.pts.A, f.pts.B).toFixed(1));
      continue;
    }

    /* --- Un angle ------------------------------------------------------ */
    if (/mesure (\d+)°/.test(s)) {
      vu('angle');
      if (!f) { ko('angle : pas de figure'); continue; }
      var val = +/mesure (\d+)°/.exec(s)[1];
      var mq = /Calcule l'angle \\\(\\widehat\{M([AB])[AB]\}\\\)/.exec(s);
      if (!mq) { ko('angle : l\'énoncé ne dit pas quel angle chercher'); continue; }
      var cherche = mq[1], donne = cherche === 'A' ? 'B' : 'A';
      if (q.type !== 'nombre' || q.unite !== '°') ko('angle : réponse attendue en degrés');
      if (q.reponse !== 90 - val) ko('angle : ' + val + '° donné, réponse ' + q.reponse + ' au lieu de ' + (90 - val));
      if (val === 45) ko('angle : 45° rend les deux angles égaux, la question se devine');
      // La figure : diamètre, M sur le cercle, l'angle écrit au bon sommet et vrai.
      if (ecartO(f, f.pts.A, f.pts.B) > 0.02) ko('angle : [AB] n\'est pas un diamètre sur la figure');
      if (!surCercle(f, f.pts.M)) ko('angle : M n\'est pas sur le cercle');
      var mesureDonnee = angle(f.pts[donne], f.pts[donne === 'A' ? 'B' : 'A'], f.pts.M);
      if (Math.abs(mesureDonnee - val) > 1) ko('angle : la figure écrit ' + val + '° en ' + donne + ' qui mesure ' + mesureDonnee.toFixed(1));
      var txtVal = f.textes.filter(function (t) { return t.txt === val + '°'; })[0];
      var txtQ = f.textes.filter(function (t) { return t.txt === '?'; })[0];
      if (!txtVal || !txtQ) ko('angle : il manque la mesure ou le « ? » sur la figure');
      else {
        if (d2(txtVal.p, f.pts[donne]) > d2(txtVal.p, f.pts[cherche])) ko('angle : la mesure est écrite au mauvais sommet');
        if (d2(txtQ.p, f.pts[cherche]) > d2(txtQ.p, f.pts[donne])) ko('angle : le « ? » est au mauvais sommet');
      }
      if (!/rectangle en \\\(M\\\)/.test(q.etapes[0])) ko('angle : la correction doit commencer par la nature du triangle');
      continue;
    }

    /* --- Une longueur -------------------------------------------------- */
    if (/Calcule (\\\(AB\\\)|le rayon du cercle|\\\(BM\\\))\./.test(s) && /diamètre/.test(s)) {
      var AM = nombre(/AM = ([\d{,}.]+)/, s), BM = nombre(/BM = ([\d{,}.]+)/, s), AB = nombre(/AB = ([\d{,}.]+)/, s);
      var ray = nombre(/rayon de \\\(([\d{,}.]+)\\\)/, s);
      if (!f) ko('longueur : pas de figure');
      else if (!surCercle(f, f.pts.M) || ecartO(f, f.pts.A, f.pts.B) > 0.02) ko('longueur : la figure ne montre pas un diamètre et M sur le cercle');
      if (/Calcule \\\(AB\\\)/.test(s)) {
        vu('longueur-AB');
        if (Math.abs(q.reponse - Math.hypot(AM, BM)) > 1e-9) ko('longueur AB : ' + AM + ', ' + BM + ' → ' + q.reponse);
      } else if (/le rayon du cercle/.test(s)) {
        vu('longueur-rayon');
        if (Math.abs(q.reponse - Math.hypot(AM, BM) / 2) > 1e-9) ko('rayon : ' + AM + ', ' + BM + ' → ' + q.reponse);
      } else {
        var hyp = isNaN(AB) ? 2 * ray : AB;
        vu(isNaN(AB) ? 'longueur-BM-via-rayon' : 'longueur-BM');
        if (isNaN(hyp) || isNaN(AM)) ko('longueur BM : données illisibles');
        else if (Math.abs(q.reponse - Math.sqrt(hyp * hyp - AM * AM)) > 1e-9) ko('longueur BM : AB = ' + hyp + ', AM = ' + AM + ' → ' + q.reponse);
        if (!/BM\^2 = AB\^2 - AM\^2/.test(q.etapes.join(' '))) ko('longueur BM : la correction doit soustraire');
      }
      if (!Number.isInteger(q.reponse * 2)) ko('longueur : la réponse ' + q.reponse + ' ne tombe pas juste');
      if (q.unite !== 'cm') ko('longueur : unité attendue cm');
      // La figure respecte les proportions annoncées.
      if (f && !isNaN(AM) && !isNaN(BM)) {
        var rapport = d2(f.pts.A, f.pts.M) / d2(f.pts.B, f.pts.M);
        if (Math.abs(rapport - AM / BM) > 0.03 * (AM / BM)) ko('longueur : la figure ne respecte pas AM/BM = ' + AM + '/' + BM);
      }
      continue;
    }

    /* --- Le cercle circonscrit ---------------------------------------- */
    if (/rectangle en \\\(C\\\)/.test(s)) {
      if (q.type === 'qcm') {
        vu('circonscrit-qcm');
        if (q.choix[q.correct] !== 'le milieu de l\'hypoténuse') ko('circonscrit QCM : mauvaise bonne réponse');
        continue;
      }
      var AC = nombre(/AC = ([\d{,}.]+)/, s), BC = nombre(/BC = ([\d{,}.]+)/, s), AB2 = nombre(/AB = ([\d{,}.]+)/, s);
      var hypo = isNaN(AB2) ? Math.hypot(AC, BC) : AB2;
      vu(isNaN(AB2) ? 'circonscrit-pythagore' : (/IC/.test(s) ? 'circonscrit-IC' : 'circonscrit-rayon'));
      if (isNaN(hypo)) ko('circonscrit : données illisibles');
      else if (Math.abs(q.reponse - hypo / 2) > 1e-9) ko('circonscrit : hypoténuse ' + hypo + ' → ' + q.reponse);
      if (!/milieu/.test(q.etapes.join(' '))) ko('circonscrit : la correction doit nommer le milieu de l\'hypoténuse');
      if (isNaN(AB2) && !/AB = \d+/.test(q.etapes.join(' '))) ko('circonscrit : la correction doit calculer l\'hypoténuse');
      continue;
    }

    /* --- Où est M ? ----------------------------------------------------- */
    if (/par rapport au cercle de diamètre/.test(s)) {
      var c3 = nombre(/AB = ([\d{,}.]+)/, s), a3 = nombre(/AM = ([\d{,}.]+)/, s), b3 = nombre(/BM = ([\d{,}.]+)/, s);
      if (q.type !== 'qcm') { ko('position : attendu un QCM'); continue; }
      var cmp = a3 * a3 + b3 * b3 - c3 * c3;
      var attenduTxt = cmp === 0 ? 'sur le cercle' : cmp < 0 ? 'à l\'intérieur du cercle' : 'à l\'extérieur du cercle';
      vu('position-' + (cmp === 0 ? 'sur' : cmp < 0 ? 'dedans' : 'dehors'));
      if (q.choix[q.correct] !== attenduTxt) ko('position : AB = ' + c3 + ', AM = ' + a3 + ', BM = ' + b3 + ' → « ' + attenduTxt + ' », annoncé « ' + q.choix[q.correct] + ' »');
      if (!(a3 + b3 > c3 && a3 + c3 > b3 && b3 + c3 > a3)) ko('position : le triangle ' + a3 + ', ' + b3 + ', ' + c3 + ' n\'existe pas');
      var corr = q.etapes.join(' ');
      if (cmp !== 0 && !/obtus|aigu/.test(corr)) ko('position : la correction doit parler d\'angle obtus ou aigu');
      if (!(new RegExp('= ' + (a3 * a3 + b3 * b3) + '\\\\')).test(corr) || !(new RegExp('= ' + (c3 * c3) + '\\\\')).test(corr)) ko('position : la correction ne calcule pas les bons carrés');
      continue;
    }
    ko('palier ' + palier + ' : énoncé non reconnu — ' + s.slice(0, 80));
  }
}

['reconnaitre-diametre', 'reconnaitre-corde', 'reconnaitre-dedans', 'reconnaitre-dehors', 'angle',
 'longueur-AB', 'longueur-rayon', 'longueur-BM', 'longueur-BM-via-rayon', 'circonscrit-qcm',
 'circonscrit-IC', 'circonscrit-rayon', 'circonscrit-pythagore', 'position-sur', 'position-dedans', 'position-dehors']
  .forEach(function (k) { if (!vus[k]) ko('jamais rencontré : ' + k); });
// Le palier 1 ne pose que « reconnaître » ; le palier 4 doit poser « où est M ? ».
var p1 = G.genere(MathsAlea(42), 1); if (p1.type !== 'vraifaux') ko('palier 1 : attendu un vrai/faux');

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LA FIGURE, L\'ANGLE, PYTHAGORE ET LA POSITION DE M SONT REFAITS À CÔTÉ ET COÏNCIDENT');
