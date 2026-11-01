/* Les exercices « Les bissectrices et le cercle inscrit » (5ème).
 *
 * Comme pour les hauteurs, les médianes et les médiatrices, la question porte
 * sur une FIGURE : on relit donc le SVG produit — les sommets, les demi-droites
 * tracées, les codages, les arcs — et on refait la géométrie à côté.
 *
 * Le point délicat est la famille « choix » : les deux leurres sont une vraie
 * médiane et une vraie hauteur issues du même sommet, et la bissectrice doit
 * en être franchement écartée — sinon l'exercice devient un concours d'acuité
 * visuelle. Le contrôle mesure, au sommet nommé dans l'énoncé, l'angle de
 * chaque demi-droite avec les deux côtés.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/5eme/triangle-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/bissectrices.js');
if (!G || G.id !== 'bissectrices') { print('ÉCHEC : le générateur ne s\'enregistre pas'); throw new Error('register'); }

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
function angleEntre(u, v) {
  return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]))))) * 180 / Math.PI;
}
// L'angle balayé par un arc (moins de 180°) autour de son sommet : celui de
// ses deux bouts. Les coordonnées du SVG sont arrondies au dixième de pixel,
// sur un rayon d'une vingtaine de pixels : on ne juge pas au demi-degré près.
function balayage(pts, V) {
  return angleEntre(sub(pts[0], V), sub(pts[pts.length - 1], V));
}
var TOL_ARC = 1.2;   // degrés

/* ------------------------------------------------------------------ */
/* Relire la figure                                                    */
/* ------------------------------------------------------------------ */
function lire(svg) {
  var f = { traits: [], codes: [], equerre: null, arcs: [], marques: [], textes: [] };
  var m = /<polygon points="([^"]+)" fill="none" stroke="#334155"/.exec(svg);
  if (!m) return null;
  f.P = m[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); });
  if (f.P.length !== 3) return null;
  var re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="([^"]+)" stroke-width="([\d.]+)"/g, t;
  while ((t = re.exec(svg))) {
    var seg = { a: [+t[1], +t[2]], b: [+t[3], +t[4]], coul: t[5], ep: +t[6] };
    if (t[5] === '#7c3aed') f.traits.push(seg);
    else if (t[5] === '#ea580c' && +t[6] === 2.5) f.codes.push(seg);
    else if (t[5] === '#ea580c') f.ticks = (f.ticks || 0) + 1;
  }
  var e = /<polygon points="([^"]+)" fill="#ea580c"/.exec(svg);
  f.equerre = e ? e[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); })[0] : null;
  function pts(str) { return str.trim().split(/\s+/).map(function (s) { return s.split(',').map(Number); }); }
  var ra = /<polyline class="arc-code" points="([^"]+)"/g;
  while ((t = ra.exec(svg))) f.arcs.push(pts(t[1]));
  var rm = /<polyline points="([^"]+)" fill="none" stroke="#dc2626"/g;
  while ((t = rm.exec(svg))) f.marques.push(pts(t[1]));
  var rt = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([^<]+)<\/text>/g;
  while ((t = rt.exec(svg))) f.textes.push({ p: [+t[1], +t[2]], txt: t[3] });
  return f;
}
// Le sommet nommé dans l'énoncé : « sommet \(A\) », « issue de \(A\) », ou
// la lettre du milieu de « \widehat{BAC} ».
function sommetDeLEnonce(txt) {
  var m = /sommet \\\(([ABC])\\\)|issue de \\\(([ABC])\\\)|\\widehat\{[ABC]([ABC])[ABC]\}/.exec(txt);
  if (!m) return -1;
  return 'ABC'.indexOf(m[1] || m[2] || m[3]);
}
// Ce qu'une demi-droite partant du sommet i fait : ses angles avec les deux
// côtés, son écart au milieu du côté opposé, son écart à la perpendiculaire.
function analyse(seg, P, i) {
  var o1 = (i + 1) % 3, o2 = (i + 2) % 3, S = P[i];
  var d = sub(seg.b, seg.a);
  if (di(seg.a, S) > 1) d = sub(seg.a, seg.b);
  var a1 = angleEntre(d, sub(P[o1], S)), a2 = angleEntre(d, sub(P[o2], S));
  var mil = [(P[o1][0] + P[o2][0]) / 2, (P[o1][1] + P[o2][1]) / 2];
  var u = sub(P[o2], P[o1]);
  var ecartMil = Math.abs(u[0] * (mil[1] - S[1]) - u[1] * (mil[0] - S[0])) / 1;   // pas utilisé tel quel
  // distance du milieu à la droite portée par la demi-droite
  var distMil = Math.abs(d[0] * (mil[1] - S[1]) - d[1] * (mil[0] - S[0])) / Math.hypot(d[0], d[1]);
  var ecartPerp = Math.abs(90 - angleEntre(d, u));
  return { a1: a1, a2: a2, partage: Math.abs(a1 - a2), distMil: distMil, ecartPerp: ecartPerp, partDuSommet: di(seg.a, S) < 1 || di(seg.b, S) < 1 };
}
var TOL_ANGLE = 0.5, TOL_MIL = 0.8;

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 7013 + g), palier);
    nb++;
    var fam = /Laquelle est la <b>bissectrice/.test(q.enonce) ? 'choix'
            : /Qu'est-ce que cette demi-droite/.test(q.enonce) ? 'lire'
            : /Comment s'appelle ce point/.test(q.enonce) ? 'concours'
            : /où se trouve son <b>centre/.test(q.enonce) ? 'position'
            : /Combien mesure l'angle/.test(q.enonce) ? 'moitie'
            : / cm/.test(q.enonce) ? 'distance'
            : 'proprietes';
    vus[fam] = (vus[fam] || 0) + 1;
    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (!q.indices || !q.indices.length) ko(fam + ' : pas d\'indice');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) { if (deja[c]) ko(fam + ' : deux propositions identiques'); deja[c] = 1; });
    }
    var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);
    var f = svg ? lire(svg[0]) : null;

    /* --- choix : trois demi-droites depuis le sommet nommé ---------- */
    if (fam === 'choix') {
      if (!f || f.traits.length !== 3) { ko('choix : il faut trois demi-droites'); continue; }
      var i = sommetDeLEnonce(q.enonce);
      if (i < 0) { ko('choix : l\'énoncé ne nomme pas le sommet'); continue; }
      var infos = f.traits.map(function (s) { return analyse(s, f.P, i); });
      if (infos.some(function (x) { return !x.partDuSommet; })) ko('choix : une demi-droite ne part pas du sommet ' + 'ABC'[i]);
      var biss = infos.filter(function (x) { return x.partage < TOL_ANGLE; });
      var medi = infos.filter(function (x) { return x.distMil < TOL_MIL; });
      var haut = infos.filter(function (x) { return x.ecartPerp < TOL_ANGLE; });
      if (biss.length !== 1) ko('choix : ' + biss.length + ' demi-droite(s) partagent l\'angle en deux');
      if (medi.length !== 1 || haut.length !== 1) ko('choix : les leurres doivent être une médiane et une hauteur (' + medi.length + ' / ' + haut.length + ')');
      infos.forEach(function (x) {
        if (x.partage >= TOL_ANGLE && x.partage < 9) ko('choix : un leurre n\'est écarté de la bissectrice que de ' + x.partage.toFixed(1) + '° — indiscernable');
      });
      if (biss.length === 1 && infos.indexOf(biss[0]) !== q.correct) ko('choix : la droite ' + (infos.indexOf(biss[0]) + 1) + ' est la bissectrice, on coche la ' + (q.correct + 1));
      if (f.arcs.length || f.codes.length || f.equerre) ko('choix : un codage donnerait la réponse');
      var nums = f.textes.filter(function (t) { return /^[123]$/.test(t.txt); });
      if (nums.length !== 3) ko('choix : les trois numéros ne sont pas tous écrits');
      else for (var a1 = 0; a1 < 3; a1++) for (var b1 = a1 + 1; b1 < 3; b1++)
        if (di(nums[a1].p, nums[b1].p) < 18) ko('choix : deux numéros se chevauchent (' + di(nums[a1].p, nums[b1].p).toFixed(1) + ' px)');
      continue;
    }

    /* --- lire : le codage décide ----------------------------------- */
    if (fam === 'lire') {
      if (!f || f.traits.length !== 1) { ko('lire : il faut une seule demi-droite'); continue; }
      var i2 = sommetDeLEnonce(q.enonce);
      if (i2 < 0) { ko('lire : l\'énoncé ne nomme pas le sommet'); continue; }
      var info = analyse(f.traits[0], f.P, i2);
      if (!info.partDuSommet) ko('lire : la demi-droite ne part pas du sommet');
      var codage = f.arcs.length === 2 ? 'bissectrice' : f.equerre ? 'hauteur' : f.codes.length >= 2 ? 'médiane' : null;
      if (!codage) { ko('lire : aucun codage lisible (' + f.arcs.length + ' arcs, ' + f.codes.length + ' marques, carré ' + !!f.equerre + ')'); continue; }
      if ((f.arcs.length === 2) + (!!f.equerre) + (f.codes.length >= 2) !== 1) ko('lire : plusieurs codages à la fois');
      var coche = q.choix[q.correct];
      if (coche.indexOf(codage) < 0) ko('lire : le codage dit « ' + codage + ' », on coche « ' + coche + ' »');
      // la géométrie suit le codage
      var geo = info.partage < TOL_ANGLE ? 'bissectrice' : info.ecartPerp < TOL_ANGLE ? 'hauteur' : info.distMil < TOL_MIL ? 'médiane' : 'rien';
      if (geo !== codage) ko('lire : le trait est une ' + geo + ', le codage dit ' + codage);
      if (codage === 'bissectrice') {
        var S = f.P[i2], s1 = balayage(f.arcs[0], S), s2 = balayage(f.arcs[1], S);
        if (Math.abs(s1 - s2) > TOL_ARC) ko('lire : les deux arcs codés balayent ' + s1.toFixed(1) + '° et ' + s2.toFixed(1) + '°');
        if (Math.abs(s1 + s2 - angleEntre(sub(f.P[(i2 + 1) % 3], S), sub(f.P[(i2 + 2) % 3], S))) > TOL_ARC) ko('lire : les deux arcs ne font pas l\'angle entier');
        if (f.ticks !== 2) ko('lire : chaque arc doit porter un trait (' + f.ticks + ')');
      }
      continue;
    }

    /* --- moitié : l'angle écrit est celui du dessin ----------------- */
    if (fam === 'moitie') {
      if (!f) { ko('moitié : pas de figure'); continue; }
      var i3 = sommetDeLEnonce(q.enonce), S3 = f.P[i3];
      if (i3 < 0) { ko('moitié : sommet non nommé'); continue; }
      var entier = angleEntre(sub(f.P[(i3 + 1) % 3], S3), sub(f.P[(i3 + 2) % 3], S3));
      var inverse = /fait avec/.test(q.enonce);
      var donne = parseFloat(/mesure ([\d,]+)°|angle de ([\d,]+)°/.exec(q.enonce).slice(1).filter(Boolean)[0].replace(',', '.'));
      if (inverse) {
        vus['moitie-inverse'] = (vus['moitie-inverse'] || 0) + 1;
        if (Math.abs(q.reponse - 2 * donne) > 1e-9) ko('moitié (inverse) : demi-angle ' + donne + ' → ' + q.reponse);
        if (Math.abs(entier - 2 * donne) > 0.6) ko('moitié (inverse) : l\'angle dessiné (' + entier.toFixed(1) + ') n\'est pas ' + 2 * donne);
      } else {
        if (Math.abs(q.reponse - donne / 2) > 1e-9) ko('moitié : angle ' + donne + ' → ' + q.reponse);
        if (Math.abs(entier - donne) > 0.6) ko('moitié : l\'angle dessiné (' + entier.toFixed(1) + ') n\'est pas ' + donne);
        if (!Number.isInteger(q.reponse * 2)) ko('moitié : la réponse ' + q.reponse + ' ne tombe pas sur un demi-degré');
        if (palier <= 2 && !Number.isInteger(q.reponse)) ko('moitié : au palier ' + palier + ' la réponse doit être entière');
      }
      if (f.marques.length !== 1 || Math.abs(balayage(f.marques[0], S3) - entier) > TOL_ARC) ko('moitié : la marque de l\'angle entier ne le mesure pas');
      if (f.arcs.length !== 2) ko('moitié : les deux demi-arcs doivent être dessinés');
      else {
        var h1 = balayage(f.arcs[0], S3), h2 = balayage(f.arcs[1], S3);
        if (Math.abs(h1 - h2) > TOL_ARC || Math.abs(h1 - entier / 2) > TOL_ARC) ko('moitié : les demi-arcs ne font pas la moitié (' + h1.toFixed(1) + ', ' + h2.toFixed(1) + ')');
      }
      if (!f.textes.some(function (t) { return t.txt === '?'; })) ko('moitié : le « ? » doit être sur la figure');
      continue;
    }

    /* --- position : inscrit toujours dedans, circonscrit selon la forme */
    if (fam === 'position') {
      if (!f) { ko('position : pas de figure'); continue; }
      var A = f.P[0], B = f.P[1], C = f.P[2];
      var ang = [angleEntre(sub(B, A), sub(C, A)), angleEntre(sub(A, B), sub(C, B)), angleEntre(sub(A, C), sub(B, C))];
      var maxi = Math.max(ang[0], ang[1], ang[2]);
      var inscrit = /cercle inscrit/.test(q.enonce);
      vus[inscrit ? 'position-inscrit' : 'position-circonscrit'] = (vus[inscrit ? 'position-inscrit' : 'position-circonscrit'] || 0) + 1;
      var attendu = inscrit ? 'intérieur' : Math.abs(maxi - 90) < 0.6 ? 'hypoténuse' : maxi > 90 ? 'extérieur' : 'intérieur';
      var coche2 = q.choix[q.correct];
      if (coche2.indexOf(attendu) < 0) ko('position (' + (inscrit ? 'inscrit' : 'circonscrit') + ') : plus grand angle ' + maxi.toFixed(1) + '°, attendu « ' + attendu + ' », coché « ' + coche2 + ' »');
      if ((Math.abs(maxi - 90) < 0.6) !== !!f.equerre) ko('position : le petit carré doit être là exactement quand le triangle est rectangle');
      if (inscrit && !/toujours à l'intérieur/.test(q.etapes.join(' '))) ko('position (inscrit) : la correction doit dire « toujours à l\'intérieur »');
      continue;
    }

    /* --- distance ---------------------------------------------------- */
    if (fam === 'distance') {
      var nbs = (q.enonce.match(/([\d]+,\d|\d+) cm/g) || []).map(function (s) { return parseFloat(s.replace(',', '.')); });
      if (q.type === 'nombre') {
        vus[/cercle inscrit/.test(q.enonce) ? 'distance-rayon' : 'distance-point'] = (vus[/cercle inscrit/.test(q.enonce) ? 'distance-rayon' : 'distance-point'] || 0) + 1;
        if (nbs.length !== 1 || Math.abs(q.reponse - nbs[0]) > 1e-9) ko('distance : donnée ' + nbs.join('/') + ' → réponse ' + q.reponse);
      } else {
        vus['distance-faux'] = (vus['distance-faux'] || 0) + 1;
        if (nbs.length !== 2 || Math.abs(nbs[0] - nbs[1]) < 1e-9 || q.correct !== 1) ko('distance (vrai/faux) : deux distances différentes attendues et « faux »');
      }
      continue;
    }
  }
}

['choix', 'lire', 'concours', 'moitie', 'moitie-inverse', 'distance-point', 'distance-rayon', 'distance-faux',
 'position-inscrit', 'position-circonscrit', 'proprietes']
  .forEach(function (k) { if (!vus[k]) ko('jamais rencontré : ' + k); });

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE FIGURE PORTE BIEN LA BISSECTRICE QUE LA RÉPONSE DÉSIGNE, ET L\'ANGLE ÉCRIT EST CELUI DU DESSIN');
