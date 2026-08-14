/* Les exercices « La somme des angles d'un triangle ».
 *
 * Ici, l'énoncé ne dit presque rien : c'est la FIGURE qui porte la question.
 * On ne peut donc pas se contenter de vérifier des nombres — il faut vérifier
 * le DESSIN. Le test relit donc le SVG : les trois sommets du polygone, les
 * mesures écrites et le sommet où chacune est posée, le petit carré de l'angle
 * droit, les traits de codage des côtés égaux. Puis il remesure les angles du
 * triangle tracé et confronte le tout.
 *
 * Ce qui serait indétectable autrement : une figure qui montre 52° là où
 * l'angle dessiné en mesure 61, un codage posé sur des côtés de longueurs
 * différentes, un petit carré à un sommet qui n'est pas droit.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/5eme/triangle-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/somme-angles.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function d2(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

/* ------------------------------------------------------------------ */
/* Relire la figure                                                    */
/* ------------------------------------------------------------------ */
function lire(svg) {
  var f = {};
  // le contour du triangle (celui qui n'est pas rempli)
  var m = /<polygon points="([^"]+)" fill="none" stroke="#334155"/.exec(svg);
  if (!m) return null;
  f.P = m[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); });
  if (f.P.length !== 3) return null;

  // les textes : les noms des sommets, les mesures, le point d'interrogation
  f.noms = {}; f.mesures = []; f.inconnu = null;
  var re = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*fill="([^"]+)"[^>]*>([^<]+)<\/text>/g, t;
  while ((t = re.exec(svg))) {
    var p = [+t[1], +t[2]], txt = t[4];
    if (/^[ABC]$/.test(txt)) f.noms[txt] = p;
    else if (/^\d+°$/.test(txt)) f.mesures.push({ p: p, v: parseInt(txt, 10) });
    else if (txt === '?') f.inconnu = p;
  }
  // le petit carré de l'angle droit
  var e = /<polygon points="([^"]+)" fill="#ea580c"/.exec(svg);
  f.equerre = e ? e[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); })[0]
                : null;
  // les traits de codage
  f.codes = [];
  var rc = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="#ea580c" stroke-width="2.5"\/>/g;
  while ((t = rc.exec(svg))) f.codes.push([(+t[1] + +t[3]) / 2, (+t[2] + +t[4]) / 2]);
  return f;
}
/* l'angle du triangle au sommet i, mesuré sur le dessin */
function angleDessine(P, i) {
  var V = P[i], A = P[(i + 1) % 3], B = P[(i + 2) % 3];
  var u = [A[0] - V[0], A[1] - V[1]], w = [B[0] - V[0], B[1] - V[1]];
  var c = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]));
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
}
/* À quel sommet ce texte est-il accroché ? Pas « le plus proche » : une
   étiquette d'angle se pose sur la BISSECTRICE de son sommet, et c'est cette
   direction qui l'identifie sans ambiguïté, quelle que soit la forme du
   triangle. Les noms de sommets, eux, se posent vers l'extérieur — c'est aussi
   une demi-droite issue du sommet, la règle vaut pour les deux. */
function sommetLePlusProche(f, p) {
  var best = 0, meilleur = Infinity;
  for (var i = 0; i < 3; i++) {
    var V = f.P[i], A = f.P[(i + 1) % 3], B = f.P[(i + 2) % 3];
    var u = [A[0] - V[0], A[1] - V[1]], w = [B[0] - V[0], B[1] - V[1]];
    var nu = Math.hypot(u[0], u[1]), nw = Math.hypot(w[0], w[1]);
    var bx = u[0] / nu + w[0] / nw, by = u[1] / nu + w[1] / nw;
    var vx = p[0] - V[0], vy = p[1] - V[1], nv = Math.hypot(vx, vy);
    if (nv < 1e-6) return i;
    // l'écart angulaire à la bissectrice (intérieure ou extérieure)
    var cos = Math.abs((bx * vx + by * vy) / (Math.hypot(bx, by) * nv));
    var score = (1 - cos) * 60 + nv / 40;      // l'alignement d'abord, la distance ensuite
    if (score < meilleur) { meilleur = score; best = i; }
  }
  return best;
}
/* Le nom d'un sommet, lui, est posé tout près (17 px) et VERS L'EXTÉRIEUR —
   direction qui n'a rien à voir avec la bissectrice dès que le triangle n'est
   pas isocèle. Pour les lettres, c'est donc bien le plus proche qui gagne. */
function indiceDe(f, lettre) {
  var p = f.noms[lettre];
  if (!p) return -1;
  var best = 0;
  for (var i = 1; i < 3; i++) if (d2(f.P[i], p) < d2(f.P[best], p)) best = i;
  return best;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 700; g++) {
    var q = G.genere(MathsAlea(palier * 3391 + g), palier);
    nb++;
    if (q.type === 'vraifaux') {
      vus.possible = (vus.possible || 0) + 1;
      if (q.correct !== 0 && q.correct !== 1) ko('possible : réponse hors [0,1]');
      if (!q.etapes || !q.etapes.length) ko('possible : pas de correction');
      continue;
    }

    var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);
    if (!svg) { ko('une question à figure n\'a pas de figure'); continue; }
    var f = lire(svg[0]);
    if (!f) { ko('la figure est illisible'); continue; }

    /* --- la famille se déduit de ce que porte la figure -------------- */
    var fam = f.equerre && f.codes.length ? 'rect-isocele'
            : f.equerre ? 'rectangle'
            : f.codes.length >= 3 ? 'equilateral'
            : f.codes.length ? 'isocele' : 'quelconque';
    vus[fam] = (vus[fam] || 0) + 1;

    /* --- 1. les angles DESSINÉS font-ils 180° ? --------------------- */
    var ang = [0, 1, 2].map(function (i) { return angleDessine(f.P, i); });
    var somme = ang[0] + ang[1] + ang[2];
    if (Math.abs(somme - 180) > 0.6)
      ko(fam + ' : le triangle dessiné a des angles qui font ' + somme.toFixed(1) + '°');
    if (Math.min.apply(null, ang) < 12)
      ko(fam + ' : le triangle dessiné a un angle de ' + Math.min.apply(null, ang).toFixed(1) +
         '° — trop pointu pour être lisible');

    /* --- 2. chaque mesure écrite est-elle celle de son angle ? ------- */
    f.mesures.forEach(function (m) {
      var i = sommetLePlusProche(f, m.p);
      if (Math.abs(ang[i] - m.v) > 0.8)
        ko(fam + ' : la figure affiche ' + m.v + '° à un sommet qui en mesure ' +
           ang[i].toFixed(1));
    });

    /* --- 3. le « ? » est-il sur l'angle demandé ? -------------------- */
    var mm = /l'angle \\\(\\widehat\{([ABC])\}\\\)/.exec(q.enonce);
    if (!mm) ko(fam + ' : l\'énoncé ne dit pas quel angle chercher');
    else {
      var iCh = indiceDe(f, mm[1]);
      if (iCh < 0) ko(fam + ' : le sommet ' + mm[1] + ' n\'est pas nommé sur la figure');
      else {
        if (Math.abs(ang[iCh] - q.reponse) > 0.8)
          ko(fam + ' : on demande ' + mm[1] + ', qui mesure ' + ang[iCh].toFixed(1) +
             '° sur le dessin, mais la réponse attendue est ' + q.reponse);
        // le point d'interrogation, s'il y en a un, doit être là
        if (f.inconnu && sommetLePlusProche(f, f.inconnu) !== iCh)
          ko(fam + ' : le « ? » n\'est pas posé sur l\'angle demandé');
        if (!f.inconnu && !(fam === 'rectangle' && f.equerre))
          ko(fam + ' : aucun « ? » ne montre l\'angle cherché');
        // et sa mesure ne doit PAS être déjà écrite
        f.mesures.forEach(function (m) {
          if (sommetLePlusProche(f, m.p) === iCh)
            ko(fam + ' : la mesure cherchée est déjà écrite sur la figure');
        });
      }
    }
    if (!Number.isInteger(q.reponse))
      ko(fam + ' : la réponse ' + q.reponse + ' n\'est pas un nombre entier de degrés');

    /* --- 4. le codage dit-il la vérité ? ---------------------------- */
    if (f.equerre) {
      var iD = sommetLePlusProche(f, f.equerre);
      if (Math.abs(ang[iD] - 90) > 0.6)
        ko(fam + ' : le petit carré est posé sur un angle de ' + ang[iD].toFixed(1) + '°');
    }
    if (f.codes.length) {
      // chaque trait de codage appartient à un côté : on regarde lesquels
      var cotes = [[0, 1], [1, 2], [2, 0]];
      var marques = cotes.map(function (c) {
        var mi = [(f.P[c[0]][0] + f.P[c[1]][0]) / 2, (f.P[c[0]][1] + f.P[c[1]][1]) / 2];
        return f.codes.filter(function (p) { return d2(p, mi) < 22; }).length;
      });
      var codes = cotes.filter(function (c, i) { return marques[i] > 0; });
      if (codes.length !== (fam === 'equilateral' ? 3 : 2))
        ko(fam + ' : ' + codes.length + ' côté(s) codé(s) — le codage n\'est pas lisible');
      // les côtés codés doivent VRAIMENT avoir la même longueur
      var L = codes.map(function (c) { return d2(f.P[c[0]], f.P[c[1]]); });
      L.forEach(function (l) {
        if (Math.abs(l - L[0]) > 0.02 * L[0])
          ko(fam + ' : deux côtés portent le même codage mais mesurent ' +
             L[0].toFixed(1) + ' et ' + l.toFixed(1) + ' pixels');
      });
    }

    /* --- 5. ce que chaque famille doit montrer, et rien de plus ----- */
    if (fam === 'quelconque') {
      if (f.mesures.length !== 2)
        ko('quelconque : ' + f.mesures.length + ' mesure(s) donnée(s) au lieu de 2');
      // aucun angle droit ni deux angles égaux : la figure serait trompeuse
      ang.forEach(function (a, i) {
        if (Math.abs(a - 90) < 0.6)
          ko('quelconque : un angle droit non codé (sommet ' + 'ABC'[i] + ')');
        for (var j = i + 1; j < 3; j++) {
          if (Math.abs(a - ang[j]) < 0.6)
            ko('quelconque : deux angles égaux sans codage — la figure semble isocèle');
        }
      });
    }
    if (fam === 'equilateral' || fam === 'rect-isocele') {
      if (f.mesures.length)
        ko(fam + ' : une mesure est donnée alors que le codage suffit');
      if (fam === 'equilateral' && q.reponse !== 60)
        ko('equilateral : la réponse est ' + q.reponse + ' et non 60');
      if (fam === 'rect-isocele' && q.reponse !== 45)
        ko('rect-isocele : la réponse est ' + q.reponse + ' et non 45');
    }
    if (fam === 'rectangle') {
      if (f.mesures.length !== 1)
        ko('rectangle : ' + f.mesures.length + ' mesure(s) au lieu d\'une seule');
      if (q.reponse === 45)
        ko('rectangle : la réponse 45 en ferait un rectangle isocèle non codé');
    }
    if (fam === 'isocele') {
      if (f.mesures.length !== 1)
        ko('isocele : ' + f.mesures.length + ' mesure(s) au lieu d\'une seule');
      // la question ne doit pas se répondre en recopiant l'angle donné :
      // l'angle donné et l'angle cherché ne sont jamais les deux angles égaux
      var donne = f.mesures[0];
      if (donne && Math.abs(donne.v - q.reponse) < 0.5)
        ko('isocele : l\'angle cherché est égal à l\'angle donné — il suffit de le ' +
           'recopier, la somme des angles ne sert à rien');
    }

    /* --- 6. l'énoncé ne trahit pas la nature du triangle ------------ */
    if (/isocèle|équilatéral|rectangle/.test(q.enonce))
      ko(fam + ' : l\'énoncé nomme la nature du triangle — la figure devait suffire');
    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    // la correction, elle, doit l'expliquer
    if (fam !== 'quelconque' &&
        !/isocèle|équilatéral|angle droit|complémentaires/.test(q.etapes.join(' ')))
      ko(fam + ' : la correction n\'explique pas ce que dit le codage');
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE FIGURE DIT EXACTEMENT CE QUE LA RÉPONSE SUPPOSE');
