/* Les exercices « Les médiatrices et le cercle circonscrit » (5ème).
 *
 * Comme pour les hauteurs et les médianes, la question porte sur une FIGURE :
 * on relit donc le SVG produit — les sommets du triangle, les droites tracées,
 * les codages — et on refait la géométrie à côté.
 *
 * Le point délicat de cette série est la famille « choix » : chacun des deux
 * leurres doit échouer sur UNE condition et une seule, franchement. Un leurre
 * qui serait perpendiculaire ET passerait par le milieu serait une seconde
 * bonne réponse ; un leurre penché de deux degrés, ou décalé de trois
 * millimètres, transformerait l'exercice en concours d'acuité visuelle. Le
 * contrôle mesure donc l'angle et le décalage de chaque droite tracée.
 */
var window = this;
load('js/alea.js');
load('exos/outils.js');
load('exos/5eme/triangle-outils.js');
var G = null;
var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/mediatrices.js');

var err = [], vus = {}, nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }

/* ------------------------------------------------------------------ */
/* Relire la figure                                                    */
/* ------------------------------------------------------------------ */
function lire(svg) {
  var f = { traits: [], codes: [], equerre: null, noms: {} };
  var m = /<polygon points="([^"]+)" fill="none" stroke="#334155"/.exec(svg);
  if (!m) return null;
  f.P = m[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); });
  if (f.P.length !== 3) return null;
  var re = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="([^"]+)" stroke-width="([\d.]+)"/g, t;
  while ((t = re.exec(svg))) {
    var seg = { a: [+t[1], +t[2]], b: [+t[3], +t[4]], coul: t[5], ep: +t[6] };
    if (t[5] === '#7c3aed') f.traits.push(seg);
    else if (t[5] === '#ea580c') f.codes.push(seg);
  }
  var e = /<polygon points="([^"]+)" fill="#ea580c"/.exec(svg);
  f.equerre = e ? e[1].trim().split(' ').map(function (p) { return p.split(',').map(Number); })[0]
                : null;
  var rt = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([ABC1-3])<\/text>/g;
  while ((t = rt.exec(svg))) f.noms[t[3]] = [+t[1], +t[2]];
  return f;
}
function sommetProche(f, p) {
  var best = 0;
  for (var i = 1; i < 3; i++) if (di(f.P[i], p) < di(f.P[best], p)) best = i;
  return best;
}
/* Le côté que coupe une droite tracée, et ce qu'elle en fait.
   On ne devine pas « le côté le plus probable » : une droite en croise souvent
   deux, et se tromper de côté fait dire n'importe quoi au contrôle. On analyse
   donc TOUS les croisements francs — ni sur un sommet, ni sur le prolongement —
   et c'est l'appelant qui dit lequel l'intéresse. */
function croisements(seg, P) {
  var cotes = [[1, 2], [2, 0], [0, 1]], out = [];
  cotes.forEach(function (c, ic) {
    var U = P[c[0]], V = P[c[1]];
    var r = sub(seg.b, seg.a), u = sub(V, U);
    var den = r[0] * u[1] - r[1] * u[0];
    if (Math.abs(den) < 1e-9) return;
    var w = sub(U, seg.a);
    var t = (w[0] * r[1] - w[1] * r[0]) / den;     // le long du côté
    var k = (w[0] * u[1] - w[1] * u[0]) / den;     // le long de la droite
    if (t < 0.02 || t > 0.98) return;              // sur un sommet : pas un croisement
    if (k < -0.05 || k > 1.05) return;             // hors du segment tracé
    var cos = Math.abs(dot(r, u)) / (Math.hypot(r[0], r[1]) * Math.hypot(u[0], u[1]));
    var L = Math.hypot(u[0], u[1]);
    out.push({ i: ic, cote: c, t: t,
               ecartAngle: Math.abs(90 - Math.acos(Math.min(1, cos)) * 180 / Math.PI),
               ecartMilieu: Math.abs(t - 0.5) * L, longueurCote: L,
               point: [U[0] + u[0] * t, U[1] + u[1] * t] });
  });
  return out;
}
/* Les coordonnées du SVG sont arrondies au dixième de pixel : « passe par le
   milieu » ne peut pas se juger au centième. Un demi-pixel est largement en
   dessous du décalage des leurres (un cinquième du côté, soit des dizaines de
   pixels) et largement au-dessus du bruit du dessin. */
var TOL_MILIEU = 0.6;      // pixels
var TOL_ANGLE = 0.5;       // degrés

/* Le côté dont parle l'énoncé — on le lit dans le texte plutôt que de le
   déduire du dessin : c'est une donnée, pas une conclusion. */
function coteDeLEnonce(txt) {
  var m = /côté \\\(\[([ABC])([ABC])\]/.exec(txt);
  if (!m) return -1;
  var i1 = 'ABC'.indexOf(m[1]), i2 = 'ABC'.indexOf(m[2]);
  var cotes = [[1, 2], [2, 0], [0, 1]];
  for (var i = 0; i < 3; i++) {
    if ((cotes[i][0] === i1 && cotes[i][1] === i2) ||
        (cotes[i][0] === i2 && cotes[i][1] === i1)) return i;
  }
  return -1;
}
/* Le côté désigné par le CODAGE : les deux marques encadrent son milieu, ou le
   petit carré est posé dessus. Indépendant de la réponse annoncée. */
function coteCode(f) {
  var cotes = [[1, 2], [2, 0], [0, 1]];
  for (var i = 0; i < 3; i++) {
    var U = f.P[cotes[i][0]], V = f.P[cotes[i][1]];
    if (f.codes.length >= 2) {
      var q1 = [(U[0] + (U[0] + V[0]) / 2) / 2, (U[1] + (U[1] + V[1]) / 2) / 2];
      var q2 = [(V[0] + (U[0] + V[0]) / 2) / 2, (V[1] + (U[1] + V[1]) / 2) / 2];
      var ok = [q1, q2].every(function (q) {
        return f.codes.some(function (c) {
          return di([(c.a[0] + c.b[0]) / 2, (c.a[1] + c.b[1]) / 2], q) < 6;
        });
      });
      if (ok) return i;
    } else if (f.equerre) {
      // le coin du petit carré est le point de la droite sur le côté
      var u = sub(V, U), w = sub(f.equerre, U);
      var t = dot(u, w) / dot(u, u);
      var d = Math.abs(u[0] * w[1] - u[1] * w[0]) / Math.hypot(u[0], u[1]);
      if (t > 0.02 && t < 0.98 && d < 12) return i;
    }
  }
  return -1;
}

for (var palier = 1; palier <= 4; palier++) {
  for (var g = 0; g < 600; g++) {
    var q = G.genere(MathsAlea(palier * 4517 + g), palier);
    nb++;
    var fam = /Laquelle est la <b>médiatrice/.test(q.enonce) ? 'choix'
            : /Qu'est-ce que cette droite/.test(q.enonce) ? 'lire'
            : /Comment s'appelle ce point/.test(q.enonce) ? 'concours'
            : /où se trouve son <b>centre/.test(q.enonce) ? 'position'
            : /rectangle en/.test(q.enonce) ? 'rayon'
            : /médiatrice/.test(q.enonce) && q.type !== 'vraifaux' ? 'equidistant'
            : /le point \\\(M\\\) est sur la médiatrice/.test(q.enonce) ? 'equidistant'
            : 'proprietes';
    vus[fam] = (vus[fam] || 0) + 1;

    if (!q.etapes || q.etapes.length < 2) ko(fam + ' : correction trop courte');
    if (q.type === 'qcm') {
      if (q.correct < 0) ko(fam + ' : la bonne réponse n\'est pas dans la liste');
      var deja = {};
      q.choix.forEach(function (c) {
        if (deja[c]) ko(fam + ' : deux propositions identiques');
        deja[c] = 1;
      });
    }

    var svg = /<svg[\s\S]*<\/svg>/.exec(q.enonce);

    /* --- la famille « choix » : les trois droites ------------------- */
    if (fam === 'choix') {
      if (!svg) { ko('choix : pas de figure'); continue; }
      var f = lire(svg[0]);
      if (!f || f.traits.length !== 3) { ko('choix : il n\'y a pas trois droites'); continue; }
      // le numéro de chaque droite est écrit à côté d'elle
      var ic = coteDeLEnonce(q.enonce);
      if (ic < 0) { ko('choix : l\'énoncé ne nomme pas le côté'); continue; }
      var infos = f.traits.map(function (s) {
        return croisements(s, f.P).filter(function (c) { return c.i === ic; })[0];
      });
      if (infos.some(function (x) { return !x; })) { ko('choix : une droite manque le côté'); continue; }
      // exactement une est une vraie médiatrice
      var vraies = infos.filter(function (x) {
        return x.ecartAngle < TOL_ANGLE && x.ecartMilieu < TOL_MILIEU;
      });
      if (vraies.length !== 1)
        ko('choix : ' + vraies.length + ' droite(s) vérifient les deux conditions');
      // et les deux autres échouent FRANCHEMENT, chacune sur une seule condition
      var penchees = infos.filter(function (x) {
        return x.ecartAngle > TOL_ANGLE && x.ecartMilieu < TOL_MILIEU;
      });
      var decalees = infos.filter(function (x) {
        return x.ecartAngle < TOL_ANGLE && x.ecartMilieu > TOL_MILIEU;
      });
      if (penchees.length !== 1 || decalees.length !== 1)
        ko('choix : les leurres ne sont pas un « penché » et un « décalé » (' +
           penchees.length + ' / ' + decalees.length + ')');
      penchees.forEach(function (x) {
        if (x.ecartAngle < 20)
          ko('choix : le leurre penché ne l\'est que de ' + x.ecartAngle.toFixed(1) +
             '° — indiscernable');
      });
      decalees.forEach(function (x) {
        if (x.ecartMilieu < 0.14 * x.longueurCote)
          ko('choix : le leurre décalé n\'est qu\'à ' +
             (100 * x.ecartMilieu / x.longueurCote).toFixed(1) + ' % du côté — indiscernable');
      });
      // les trois numéros doivent être lisibles séparément
      var nums = [];
      var rn = /<text x="([\d.-]+)" y="([\d.-]+)"[^>]*>([123])<\/text>/g, tn;
      while ((tn = rn.exec(svg[0]))) nums.push([+tn[1], +tn[2]]);
      if (nums.length !== 3) ko('choix : les trois numéros ne sont pas tous écrits');
      else {
        for (var a1 = 0; a1 < 3; a1++) {
          for (var b1 = a1 + 1; b1 < 3; b1++) {
            if (di(nums[a1], nums[b1]) < 18)
              ko('choix : deux numéros se chevauchent (' +
                 di(nums[a1], nums[b1]).toFixed(1) + ' px)');
          }
        }
      }
      // la bonne réponse annoncée est-elle bien la vraie médiatrice ?
      var iVraie = infos.indexOf(vraies[0]);
      if (iVraie !== q.correct)
        ko('choix : la droite ' + (iVraie + 1) + ' est la médiatrice, on coche la ' +
           (q.correct + 1));
      continue;
    }

    /* --- la famille « lire » : le codage décide --------------------- */
    if (fam === 'lire') {
      if (!svg) { ko('lire : pas de figure'); continue; }
      var f2 = lire(svg[0]);
      if (!f2 || f2.traits.length !== 1) { ko('lire : il faut une seule droite'); continue; }
      var seg = f2.traits[0];
      var ic2 = coteCode(f2);
      if (ic2 < 0) { ko('lire : aucun codage ne désigne de côté'); continue; }
      var info = croisements(seg, f2.P).filter(function (c) { return c.i === ic2; })[0];
      if (!info) { ko('lire : la droite ne coupe pas le côté codé'); continue; }
      var perp = info.ecartAngle < TOL_ANGLE;
      var milieu = info.ecartMilieu < TOL_MILIEU;
      var attendu = perp && milieu ? 'médiatrice' : perp ? 'hauteur' : 'médiane';
      var coche = q.choix[q.correct];
      if (coche.indexOf(attendu) < 0)
        ko('lire : la figure montre une ' + attendu + ' (perpendiculaire ' + perp +
           ', milieu ' + milieu + '), on coche « ' + coche + ' »');
      // le codage doit correspondre : petit carré ⇔ perpendiculaire, marques ⇔ milieu
      if (perp !== !!f2.equerre)
        ko('lire : l\'angle droit ' + (perp ? 'existe mais n\'est pas codé'
                                            : 'est codé alors qu\'il n\'y en a pas'));
      if (milieu !== (f2.codes.length >= 2))
        ko('lire : le milieu ' + (milieu ? 'n\'est pas codé' : 'est codé à tort'));
      // une médiatrice ne part d'aucun sommet ; les deux autres partent d'un sommet
      var partDunSommet = f2.P.some(function (p) {
        return di(p, seg.a) < 6 || di(p, seg.b) < 6;
      });
      if ((attendu === 'médiatrice') === partDunSommet)
        ko('lire : la ' + attendu + ' ' + (partDunSommet ? 'part' : 'ne part pas') +
           ' d\'un sommet — c\'est le contraire qu\'il faut');
      continue;
    }

    /* --- la famille « position » ----------------------------------- */
    if (fam === 'position') {
      if (!svg) { ko('position : pas de figure'); continue; }
      var f3 = lire(svg[0]);
      if (!f3) { ko('position : figure illisible'); continue; }
      var A = f3.P[0], B = f3.P[1], C = f3.P[2];
      function angle(s, u2, v2) {
        var p = sub(u2, s), r2 = sub(v2, s);
        return Math.acos(Math.max(-1, Math.min(1,
          dot(p, r2) / (Math.hypot(p[0], p[1]) * Math.hypot(r2[0], r2[1]))))) * 180 / Math.PI;
      }
      var ang = [angle(A, B, C), angle(B, A, C), angle(C, A, B)];
      var maxi = Math.max(ang[0], ang[1], ang[2]);
      var attendu2 = Math.abs(maxi - 90) < 0.6 ? 'hypoténuse'
                   : maxi > 90 ? 'extérieur' : 'intérieur';
      var coche2 = q.choix[q.correct];
      if (coche2.indexOf(attendu2) < 0)
        ko('position : le plus grand angle vaut ' + maxi.toFixed(1) + '°, on attend « ' +
           attendu2 + ' » et on coche « ' + coche2 + ' »');
      if (attendu2 === 'hypoténuse' && !f3.equerre)
        ko('position : triangle rectangle sans petit carré — la question devient un ' +
           'exercice de vue');
      if (attendu2 !== 'hypoténuse' && f3.equerre)
        ko('position : un angle droit est codé alors qu\'il n\'y en a pas');
      continue;
    }

    /* --- les familles numériques ----------------------------------- */
    if (fam === 'rayon') {
      var mh = /mesure <b>([\d,]+) cm<\/b>/.exec(q.enonce);
      var mr = /rayon <b>([\d,]+) cm<\/b>/.exec(q.enonce);
      function nb2(s) { return parseFloat(s.replace(',', '.')); }
      if (mh) {                                  // hypoténuse donnée → rayon
        if (Math.abs(q.reponse - nb2(mh[1]) / 2) > 1e-9)
          ko('rayon : hypoténuse ' + mh[1] + ' → rayon attendu ' + (nb2(mh[1]) / 2) +
             ', annoncé ' + q.reponse);
      } else if (mr) {                           // rayon donné → hypoténuse
        if (Math.abs(q.reponse - nb2(mr[1]) * 2) > 1e-9)
          ko('rayon : rayon ' + mr[1] + ' → hypoténuse attendue ' + (nb2(mr[1]) * 2) +
             ', annoncée ' + q.reponse);
      } else ko('rayon : l\'énoncé ne donne ni hypoténuse ni rayon');
      if (svg && !lire(svg[0]).equerre) ko('rayon : l\'angle droit n\'est pas codé');
      continue;
    }
    if (fam === 'equidistant' && q.type === 'nombre') {
      var ma = /MA = ([\d,]+)/.exec(q.enonce);
      if (!ma) ko('equidistant : MA n\'est pas donné');
      else if (Math.abs(q.reponse - parseFloat(ma[1].replace(',', '.'))) > 1e-9)
        ko('equidistant : MA = ' + ma[1] + ' donc MB = MA, or on attend ' + q.reponse);
      continue;
    }
    if (fam === 'equidistant' && q.type === 'vraifaux') {
      var d1 = /MA = ([\d,]+)/.exec(q.enonce), d2 = /MB = ([\d,]+)/.exec(q.enonce);
      if (!d1 || !d2) { ko('equidistant : distances illisibles'); continue; }
      var eg = Math.abs(parseFloat(d1[1].replace(',', '.')) -
                        parseFloat(d2[1].replace(',', '.'))) < 1e-9;
      if (eg !== (q.correct === 0))
        ko('equidistant : MA et MB ' + (eg ? 'sont égales' : 'diffèrent') +
           ', la réponse dit le contraire');
      continue;
    }
  }
}

print(nb + ' questions vérifiées — ' + JSON.stringify(vus));
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE FIGURE PORTE BIEN LA MÉDIATRICE QUE LA RÉPONSE DÉSIGNE');
