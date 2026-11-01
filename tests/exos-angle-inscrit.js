/*
 * Les exercices « Angle inscrit et angle au centre » (2nde).
 *
 * Rien n'est relu tel quel. La figure est reparsée dans son SVG : le cercle,
 * les points nommés, chaque marque d'angle (dont on retrouve le sommet et dont
 * on REMESURE le balayage, par somme des pas angulaires pour tenir les
 * rentrants) et le texte posé à côté. Le contrôle exige que chaque mesure
 * écrite soit celle de l'angle dessiné, que la marque « ? » balaye exactement
 * la réponse attendue — y compris quand elle dépasse 180° —, que l'arc rouge
 * aille de A à B sans passer par M, que M soit sur le petit ou le grand arc
 * selon la famille, et que N soit du bon côté de [AB]. Les réponses sont
 * refaites à côté depuis la mesure écrite dans l'énoncé (×2, ÷2, 90 − a,
 * 180 − a, 360 − 2a) et les sept familles doivent toutes être rencontrées.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/2nde/angle-inscrit-angle-centre.js');
if (!G || G.id !== 'angle-inscrit') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function vu(k) { vus[k] = (vus[k] || 0) + 1; }
function d2(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function angle(V, P, Q) {
  var u = [P[0] - V[0], P[1] - V[1]], w = [Q[0] - V[0], Q[1] - V[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]))))) * 180 / Math.PI;
}
// Balayage (degrés, non signé) d'une suite de points autour du sommet V : la
// somme des pas angulaires, qui tient les angles de plus de 180°.
function balayage(pts, V) {
  var tot = 0, prev = null;
  pts.forEach(function (p) {
    var a = Math.atan2(p[1] - V[1], p[0] - V[0]);
    if (prev !== null) { var d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; tot += d; }
    prev = a;
  });
  return Math.abs(tot) * 180 / Math.PI;
}
function cote(A, B, P) { return Math.sign((B[0] - A[0]) * (P[1] - A[1]) - (B[1] - A[1]) * (P[0] - A[0])); }

/* Relire la figure : le cercle, les points, les marques, les textes. */
function lire(enonce) {
  var m = /<svg[\s\S]*<\/svg>/.exec(enonce);
  if (!m) return null;
  var svg = m[0], f = { pts: {}, textes: [], marques: [] };
  var c = /<circle class="cercle" cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.]+)"/.exec(svg);
  if (!c) return null;
  f.O = [+c[1], +c[2]]; f.r = +c[3];
  var re = /<circle class="pt" data-nom="([A-Z])" cx="([\d.-]+)" cy="([\d.-]+)"/g, t;
  while ((t = re.exec(svg))) f.pts[t[1]] = [+t[2], +t[3]];
  var rt = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]+)<\/text>/g;
  while ((t = rt.exec(svg))) f.textes.push({ p: [+t[1], +t[2] - 6], txt: t[3] });
  function points(str) { return str.trim().split(/\s+/).map(function (s) { var xy = s.split(','); return [+xy[0], +xy[1]]; }); }
  var ra = /<polyline class="arc-intercepte" points="([^"]+)"/.exec(svg);
  if (ra) f.arc = points(ra[1]);
  var rm = /<polyline class="marque" points="([^"]+)"/g;
  while ((t = rm.exec(svg))) {
    var pts = points(t[1]);
    // Le sommet : le point nommé équidistant de tous les points de la marque.
    var sommet = null, nomSommet = null, rayon = 0;
    Object.keys(f.pts).forEach(function (nom) {
      var V = f.pts[nom], dmin = Infinity, dmax = 0;
      pts.forEach(function (p) { var d = d2(p, V); dmin = Math.min(dmin, d); dmax = Math.max(dmax, d); });
      if (dmax - dmin < 0.5 && dmax < 0.6 * f.r) { sommet = V; nomSommet = nom; rayon = (dmin + dmax) / 2; }
    });
    f.marques.push({ pts: pts, V: sommet, nom: nomSommet, rayon: rayon, balayage: sommet ? balayage(pts, sommet) : NaN,
                     txt: null, de: pts[0], a: pts[pts.length - 1] });
  }
  // Une mesure est écrite juste au-delà de l'arc de SA marque, à l'intérieur de
  // l'angle : on l'attribue à la marque dont l'arc est le plus proche, et on
  // exige que la seconde candidate soit nettement plus loin — sinon l'élève
  // non plus ne saurait pas à quel angle la mesure appartient.
  f.textes.forEach(function (tx) {
    if (/^[A-Z]$/.test(tx.txt)) return;
    var cands = f.marques.filter(function (m) { return m.V; }).map(function (m) {
      var au = d2(tx.p, m.V) - m.rayon;                       // au-delà de l'arc
      var dir = Math.atan2(tx.p[1] - m.V[1], tx.p[0] - m.V[0]);
      var a0 = Math.atan2(m.de[1] - m.V[1], m.de[0] - m.V[0]), a1 = Math.atan2(m.a[1] - m.V[1], m.a[0] - m.V[0]);
      var sens = ((a1 - a0 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;   // le court chemin, signé
      var sweep = m.balayage * Math.PI / 180; if (Math.abs(sweep) > Math.abs(sens) + 1e-6) sens = -sens; // rentrant : l'autre sens
      var pos = (dir - a0) * (sens >= 0 ? 1 : -1); pos = ((pos % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      var dedans = pos <= sweep + 0.05;
      return { m: m, au: au, dedans: dedans };
    }).filter(function (c) { return c.dedans && c.au > 0 && c.au < 60; }).sort(function (x, y) { return x.au - y.au; });
    if (!cands.length) { f.orphelins = (f.orphelins || 0) + 1; return; }
    if (cands.length > 1 && cands[1].au - cands[0].au < 12) f.ambigu = true;
    if (cands[0].m.txt) f.ambigu = true;   // deux textes pour une marque
    cands[0].m.txt = tx.txt; cands[0].m.pTxt = tx.p;
  });
  // Deux mesures écrites trop proches l'une de l'autre se liraient l'une pour l'autre.
  var mesures = f.textes.filter(function (tx) { return !/^[A-Z]$/.test(tx.txt); });
  f.chevauchement = false;
  mesures.forEach(function (t1, i) { mesures.forEach(function (t2, j) {
    if (j > i && Math.abs(t1.p[0] - t2.p[0]) < 40 && Math.abs(t1.p[1] - t2.p[1]) < 16) f.chevauchement = true;
  }); });
  f.texte = enonce.slice(enonce.indexOf('</svg>') + 6);
  return f;
}
function surCercle(f, P) { return Math.abs(d2(f.O, P) - f.r) < 0.02 * f.r; }
function nombre(re, s) { var m = re.exec(s); return m ? parseFloat(m[1].replace('{,}', '.').replace(',', '.')) : NaN; }
function pres(a, b, eps) { return Math.abs(a - b) <= eps; }
// La marque dont les bras partent vers P et Q (premier et dernier point).
function marqueEntre(f, V, P, Q) {
  return f.marques.filter(function (m) {
    if (!m.V || d2(m.V, V) > 0.5) return false;
    var vP = angle(V, m.de, P) < 2 && angle(V, m.a, Q) < 2;
    var vQ = angle(V, m.de, Q) < 2 && angle(V, m.a, P) < 2;
    return vP || vQ;
  })[0];
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 500; g++) {
    var q = G.genere(MathsAlea(palier * 104729 + g), palier);
    nb++;
    if (!q.etapes || q.etapes.length < 2) ko('palier ' + palier + ' : correction trop courte');
    if (!q.indices || !q.indices.length) ko('palier ' + palier + ' : pas d\'indice');
    var f = lire(q.enonce);
    if (!f) { ko('palier ' + palier + ' : pas de figure'); continue; }
    var s = f.texte;
    var P = f.pts;
    if (!P.O || !P.A || !P.B || !P.M) { ko('il manque un point nommé (O, A, B, M)'); continue; }
    if (d2(P.O, f.O) > 1) ko('O n\'est pas au centre du cercle');
    ['A', 'B', 'M', 'N'].forEach(function (n) { if (P[n] && !surCercle(f, P[n])) ko(n + ' n\'est pas sur le cercle'); });
    if (d2(P.M, P.A) < 0.3 * f.r || d2(P.M, P.B) < 0.3 * f.r) ko('M est collé à A ou B');
    if (P.N && (d2(P.N, P.A) < 0.3 * f.r || d2(P.N, P.B) < 0.3 * f.r || d2(P.N, P.M) < 0.3 * f.r)) ko('N est collé à A, B ou M');
    // L'arc rouge : de A à B, sans passer par M.
    if (!f.arc) ko('l\'arc intercepté n\'est pas tracé');
    else {
      if (!(pres(d2(f.arc[0], P.A), 0, 1) && pres(d2(f.arc[f.arc.length - 1], P.B), 0, 1)) &&
          !(pres(d2(f.arc[0], P.B), 0, 1) && pres(d2(f.arc[f.arc.length - 1], P.A), 0, 1))) ko('l\'arc rouge doit aller de A à B');
      var dM = Infinity; f.arc.forEach(function (p) { dM = Math.min(dM, d2(p, P.M)); });
      if (dM < 0.15 * f.r) ko('l\'arc rouge passe par M : il doit être de l\'autre côté');
      var arcDeg = balayage(f.arc, f.O), ins = angle(P.M, P.A, P.B);
      if (!pres(arcDeg, 2 * ins, 1.5)) ko('l\'arc rouge balaye ' + arcDeg.toFixed(1) + '° pour un angle inscrit dessiné de ' + ins.toFixed(1) + '°');
    }
    if (f.chevauchement) ko('deux mesures écrites se chevauchent sur la figure');
    if (f.ambigu) ko('une mesure écrite pourrait appartenir à deux angles');
    if (f.orphelins) ko('une mesure écrite n\'est près d\'aucune marque d\'angle');
    // Chaque marque a un sommet nommé et une étiquette ; une mesure écrite est celle de l'angle dessiné.
    f.marques.forEach(function (m) {
      if (!m.V) { ko('une marque d\'angle n\'a pas de sommet nommé'); return; }
      if (!m.txt && q.type === 'nombre') ko('une marque d\'angle en ' + m.nom + ' n\'a pas d\'étiquette à portée');
      if (m.txt && m.txt !== '?') {
        var v = parseFloat(m.txt.replace(',', '.'));
        if (!pres(v, m.balayage, 1.2)) ko('la marque en ' + m.nom + ' écrit ' + m.txt + ' mais balaye ' + m.balayage.toFixed(1) + '°');
      }
    });
    var interro = f.marques.filter(function (m) { return m.txt === '?'; });
    if (q.type === 'nombre') {
      if (interro.length !== 1) ko('une question numérique doit marquer un seul « ? » (' + interro.length + ')');
      else if (!pres(interro[0].balayage, q.reponse, 1.2)) ko('la marque « ? » en ' + interro[0].nom + ' balaye ' + interro[0].balayage.toFixed(1) + '°, la réponse annoncée est ' + q.reponse);
      if (q.unite !== '°') ko('réponse attendue en degrés');
      if (!Number.isInteger(q.reponse * 2)) ko('la réponse ' + q.reponse + ' ne tombe pas sur un demi-degré');
    }
    if (q.type === 'qcm') {
      if (q.correct < 0 || q.choix.indexOf(q.choix[q.correct]) !== q.correct) ko('QCM : la bonne réponse est absente ou en double');
      var uniques = {}; q.choix.forEach(function (c) { uniques[c] = 1; });
      if (Object.keys(uniques).length !== q.choix.length) ko('QCM : deux propositions identiques');
    }
    var corr = q.etapes.join(' ');
    var AMB = angle(P.M, P.A, P.B), AOB = angle(P.O, P.A, P.B);

    /* --- Associer ------------------------------------------------------ */
    if (/Quel <b>angle (au centre|inscrit)<\/b> intercepte/.test(s)) {
      var versCentre = /angle au centre<\/b> intercepte/.test(s);
      vu(versCentre ? 'associer-centre' : 'associer-inscrit');
      if (q.type !== 'qcm') { ko('associer : attendu un QCM'); continue; }
      if (q.choix[q.correct] !== (versCentre ? '\\(\\widehat{AOB}\\)' : '\\(\\widehat{AMB}\\)')) ko('associer : mauvaise bonne réponse ' + q.choix[q.correct]);
      if (AMB > 89) ko('associer : M doit être sur le grand arc pour une figure lisible');
      var mq = f.marques[0];
      if (!mq || mq.nom !== (versCentre ? 'M' : 'O')) ko('associer : l\'angle donné doit être marqué en ' + (versCentre ? 'M' : 'O'));
      continue;
    }

    /* --- Même arc ------------------------------------------------------ */
    if (/même côté/.test(s)) {
      var a1 = nombre(/mesure (\d+)°/, s);
      if (!P.N) { ko('même arc : il manque N'); continue; }
      if (cote(P.A, P.B, P.M) !== cote(P.A, P.B, P.N)) ko('même arc : M et N doivent être du même côté de [AB]');
      if (!pres(AMB, a1, 1.2)) ko('même arc : l\'angle AMB dessiné (' + AMB.toFixed(1) + ') n\'est pas ' + a1);
      if (/Calcule l'angle au centre/.test(s)) {
        vu('meme-arc-centre');
        if (q.reponse !== 2 * a1) ko('même arc (centre) : ' + a1 + ' → ' + q.reponse);
      } else {
        vu('meme-arc');
        if (q.reponse !== a1) ko('même arc : ANB devrait valoir ' + a1 + ', annoncé ' + q.reponse);
        if (!pres(angle(P.N, P.A, P.B), a1, 1.2)) ko('même arc : l\'angle ANB dessiné n\'est pas ' + a1);
        if (!/égaux/.test(corr)) ko('même arc : la correction doit dire que les angles sont égaux');
      }
      continue;
    }

    /* --- Opposés ------------------------------------------------------- */
    if (/part et d'autre/.test(s)) {
      vu('opposes');
      var a2 = nombre(/mesure (\d+)°/, s);
      if (!P.N) { ko('opposés : il manque N'); continue; }
      if (cote(P.A, P.B, P.M) === cote(P.A, P.B, P.N)) ko('opposés : M et N doivent être de part et d\'autre de [AB]');
      if (q.reponse !== 180 - a2) ko('opposés : ' + a2 + ' → ' + q.reponse + ' au lieu de ' + (180 - a2));
      if (!pres(angle(P.N, P.A, P.B), 180 - a2, 1.2)) ko('opposés : l\'angle ANB dessiné n\'est pas ' + (180 - a2));
      if (!/supplémentaires/.test(corr) || corr.indexOf('360 - ' + (2 * a2)) < 0) ko('opposés : la correction doit passer par 360 − 2a et conclure « supplémentaires »');
      continue;
    }

    /* --- Isocèle ------------------------------------------------------- */
    if (/OAB/.test(s)) {
      var v3 = nombre(/mesure (\d+)°/, s);
      var OAB = angle(P.A, P.O, P.B);
      if (/Calcule l'angle inscrit/.test(s)) {
        vu('isocele-inverse');
        if (q.reponse !== 90 - v3) ko('isocèle (inverse) : OAB = ' + v3 + ' → ' + q.reponse + ' au lieu de ' + (90 - v3));
        if (!pres(OAB, v3, 1.2)) ko('isocèle (inverse) : l\'angle OAB dessiné (' + OAB.toFixed(1) + ') n\'est pas ' + v3);
        if (!pres(AMB, 90 - v3, 1.2)) ko('isocèle (inverse) : l\'angle AMB dessiné n\'est pas ' + (90 - v3));
        if (corr.indexOf('180 - 2 \\times ' + v3) < 0) ko('isocèle (inverse) : la correction doit calculer 180 − 2 × ' + v3);
      } else {
        vu('isocele');
        if (q.reponse !== 90 - v3) ko('isocèle : AMB = ' + v3 + ' → ' + q.reponse + ' au lieu de ' + (90 - v3));
        if (!pres(AMB, v3, 1.2)) ko('isocèle : l\'angle AMB dessiné n\'est pas ' + v3);
        if (!pres(OAB, 90 - v3, 1.2)) ko('isocèle : l\'angle OAB dessiné (' + OAB.toFixed(1) + ') n\'est pas ' + (90 - v3));
        if (corr.indexOf('2 \\times ' + v3 + ' = ' + (2 * v3)) < 0 || !/isocèle/.test(corr)) ko('isocèle : la correction doit passer par l\'angle au centre et le triangle isocèle');
      }
      continue;
    }

    /* --- Rentrant : saillant ou rentrant demandé ----------------------- */
    if (/Calcule l'angle (saillant|rentrant)/.test(s)) {
      var saillant = /saillant/.test(s), a4 = nombre(/mesure (\d+)°/, s);
      vu(saillant ? 'rentrant-saillant' : 'rentrant-rentrant');
      if (a4 <= 90) ko('rentrant : l\'angle inscrit donné doit être obtus');
      if (!pres(AMB, a4, 1.2)) ko('rentrant : l\'angle AMB dessiné n\'est pas ' + a4);
      if (q.reponse !== (saillant ? 360 - 2 * a4 : 2 * a4)) ko('rentrant (' + (saillant ? 'saillant' : 'rentrant') + ') : ' + a4 + ' → ' + q.reponse);
      if (corr.indexOf('2 \\times ' + a4 + ' = ' + (2 * a4)) < 0) ko('rentrant : la correction doit doubler l\'angle inscrit');
      continue;
    }

    /* --- Du centre à l'inscrit (grand arc, petit arc, diamètre) -------- */
    if (/Calcule l'angle inscrit/.test(s)) {
      var diam = /diamètre/.test(s);
      var c5 = diam ? 180 : nombre(/mesure (\d+)°/, s);
      if (!pres(AOB, c5, 1.2)) ko('centre → inscrit : l\'angle AOB dessiné (' + AOB.toFixed(1) + ') n\'est pas ' + c5);
      if (AMB > 91) {
        vu('rentrant-inscrit');
        if (q.reponse !== 180 - c5 / 2) ko('rentrant : AOB = ' + c5 + ', M sur le petit arc → ' + q.reponse + ' au lieu de ' + (180 - c5 / 2));
        if (corr.indexOf('360 - ' + c5 + ' = ' + (360 - c5)) < 0 || !/petit<\/b> arc/.test(corr)) ko('rentrant : la correction doit expliquer le grand arc et 360 − ' + c5);
        if (palier < 3) ko('rentrant : pas avant le palier 3');
      } else {
        vu(diam ? 'centre-inscrit-diametre' : 'centre-inscrit');
        if (q.reponse !== c5 / 2) ko('centre → inscrit : ' + c5 + ' → ' + q.reponse);
        if (palier <= 2 && !Number.isInteger(q.reponse)) ko('centre → inscrit : au palier ' + palier + ' la réponse doit être entière');
        if (diam && !/rectangle en/.test(corr)) ko('diamètre : la correction doit retrouver le triangle rectangle');
      }
      continue;
    }

    /* --- De l'inscrit au centre ---------------------------------------- */
    if (/Calcule l'angle au centre/.test(s)) {
      vu('inscrit-centre');
      var a6 = nombre(/mesure (\d+)°/, s);
      if (!pres(AMB, a6, 1.2)) ko('inscrit → centre : l\'angle AMB dessiné n\'est pas ' + a6);
      if (q.reponse !== 2 * a6) ko('inscrit → centre : ' + a6 + ' → ' + q.reponse);
      if (!pres(AOB, 2 * a6, 1.2)) ko('inscrit → centre : l\'angle AOB dessiné n\'est pas ' + 2 * a6);
      continue;
    }
    ko('palier ' + palier + ' : énoncé non reconnu — ' + s.slice(0, 90));
  }
}

['associer-centre', 'associer-inscrit', 'inscrit-centre', 'centre-inscrit', 'centre-inscrit-diametre',
 'meme-arc', 'meme-arc-centre', 'rentrant-inscrit', 'rentrant-saillant', 'rentrant-rentrant',
 'isocele', 'isocele-inverse', 'opposes']
  .forEach(function (k) { if (!vus[k]) ko('jamais rencontré : ' + k); });

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES ANGLES DESSINÉS, LES MESURES ÉCRITES, LA MARQUE « ? » ET LES RÉPONSES SONT REMESURÉS À CÔTÉ ET COÏNCIDENT');
