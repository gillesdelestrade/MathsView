/*
 * Le jeu « Rendez-vous à Marseille » (2nde), monté avec le VRAI JSXGraph
 * (renderer « no ») et un hasard semé.
 *
 * Sur 240 missions, le point attendu est relu sur la figure et sa propriété
 * est REVÉRIFIÉE à côté, sans reprendre les formules du jeu : le centre de
 * gravité est la moyenne des sommets ; l'orthocentre voit chaque côté
 * perpendiculairement depuis le sommet opposé ; le centre du cercle
 * circonscrit est à égale distance de A, B, C ; celui du cercle inscrit à
 * égale distance des trois côtés (et dans le triangle). La formulation de la
 * mission doit désigner ce point-là — « à égale distance des points » pour O,
 * « des côtés » pour I — et les six formulations doivent toutes passer en
 * six missions. Le triangle est jouable : ni plat ni presque équilatéral,
 * les quatre points dans le plan et séparés. Rien de la correction n'est
 * visible avant de valider. Le verdict est rejoué : posé sur la cible, 3
 * étoiles (2 avec indice) et 0 m ; l'écart annoncé en mètres est recalculé
 * avec l'échelle du plan ; posé sur un autre point remarquable, le jeu nomme
 * la confusion. Les trois traits de la correction passent par la cible, le
 * cercle a le bon rayon. Les huit quartiers sortent, leurs douze tuiles sont
 * désignées, et le point ne bouge plus une fois la mission validée.
 *
 * Le triangle n'est jamais rectangle : aucun angle à moins de 10° de 90°.
 *
 * LES OUTILS. Une mission sur huit, le point est CONSTRUIT avec les outils du
 * jeu, par des clics imprécis de quelques pixels : deux médianes à la règle
 * graduée (qui marque le milieu), deux hauteurs à l'équerre, deux
 * médiatrices au compas (deux cercles de même écartement, règle par leurs
 * intersections), deux bissectrices au compas. Le point RDV, lâché à une
 * dizaine de pixels de l'intersection, doit s'y accrocher : 0 m, 3 étoiles.
 * Les tracés sont recomptés ; « annuler » retire le dernier, l'équerre refuse
 * un clic loin de toute droite, plus rien ne se trace après la validation et
 * la mission suivante repart d'un plan vierge.
 *
 * LE RAPPORTEUR. Une bissectrice sur deux est construite au rapporteur : on
 * mesure l'angle en visant les deux côtés (la mesure affichée est comparée à
 * l'angle réel), puis on en reporte la moitié — réglée au demi-degré — et
 * les deux demi-droites se coupent à quelques pixels du centre du cercle
 * inscrit.
 *
 * LES PIÈCES. Avec un faux magasin de profils : sans profil, aucune pièce et
 * le verdict invite à en choisir un ; avec profil, 2 pièces pour trois
 * étoiles, 1 pour deux, 0 en dessous, jamais plus de 6 par jour civil (le
 * verdict annonce alors le plafond) ; le lendemain le compteur repart. Le
 * solde du profil et le journal (« jeu ») sont recomptés à chaque mission.
 */
load('tests/lecon-pc-grandeurs-decor.js');
var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
// un hasard semé, pour rejouer les mêmes missions
var graine = 20261115;
Math.random = function () { graine = (graine * 1664525 + 1013904223) % 4294967296; return graine / 4294967296; };

// un faux magasin de profils : l'état d'un seul profil, et son journal
var profilCourant = null, ETAT = { xp: 0, pieces: 0 }, JOURNAL = [];
var MathsProfils = { courant: function () { return profilCourant; }, etat: function () { return ETAT; },
                     setEtat: function (id, e) { ETAT = e; }, ajouteJournal: function (id, ev) { JOURNAL.push(ev); } };
var soldeAttendu = 0, duJour = 0, gainsAttendus = 0, plafondVu = 0, sansProfilVu = 0;

var H = monter('lessons/2nde/rendez-vous-marseille.js');
if (H.erreurSetup) ko('setup() plante : ' + H.erreurSetup);
var board = H.board;
function strip(h) { return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); }
function role(r) { return board.objectsList.filter(function (o) { return o.mvRole === r; }); }
function vu(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
function P(o) { return [o.X(), o.Y()]; }
function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
function proche(u, v, eps) { return Math.abs(u - v) < (eps || 1e-6); }
// distance du point m à la droite (pq)
function dDroite(m, p, q) { return Math.abs((q[0] - p[0]) * (p[1] - m[1]) - (p[0] - m[0]) * (q[1] - p[1])) / dist(p, q); }
function clic(id) { H.controle(id).onClick(); board.update(); }
function texte(cls) { return strip(H.parClasse(cls)[0].innerHTML); }

var RDV = role('rdv')[0], tuiles = role('tuile'), traits = role('trait'), cercle = role('cercle')[0];
if (!RDV || tuiles.length !== 12 || traits.length !== 3 || !cercle) ko('figure incomplète');
['valider', 'indice', 'suivante'].forEach(function (id) { if (!H.controle(id)) ko('bouton manquant : ' + id); });
function poser(p) { RDV.setPosition(JXG.COORDS_BY_USER, p); RDV.triggerEventHandlers(['drag'], [{}]); board.update(); }

var formules = {}, quartiers = {}, sixDernieres = [], confusions = 0, construits = { G: 0, H: 0, O: 0, I: 0 };
var T = board.mvOutils;
if (!T) ko('la boîte à outils n\'est pas exposée');
if (H.parClasse('rdv-outil').length !== 5 || !H.parClasse('rdv-meme')[0] || !H.parClasse('rdv-annuler')[0] || !H.parClasse('rdv-effacer')[0]) ko('barre d\'outils incomplète');
function traces() { return role('trace-droite').length + role('trace-cercle').length; }
function vers(p, q, k) { return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; }
function flou(p, i) { return [p[0] + [3, -2, 2, -3][i % 4], p[1] + [2, 3, -3, -2][i % 4]]; }       // un clic imprécis
function dedans(p) { return p[0] > 5 && p[0] < 1019 && p[1] > 5 && p[1] < 763; }
var auRapporteur = false, tourRapporteur = 0, construitsRap = 0;
// Deux bissectrices au rapporteur : mesurer l'angle, puis en reporter la moitié.
function bissectricesAuRapporteur(A, B, C) {
  var bon = true;
  [[A, B, C], [B, C, A]].forEach(function (s, i) {
    var a0 = Math.atan2(s[1][1] - s[0][1], s[1][0] - s[0][0]), a1 = Math.atan2(s[2][1] - s[0][1], s[2][0] - s[0][0]), d = a1 - a0;
    while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
    var vrai = Math.abs(d) * 180 / Math.PI, sg = d < 0 ? -1 : 1;
    T.choisir('rapporteur'); T.clic(flou(s[0], i)); T.clic(flou(s[1], i + 1)); T.clic(flou(s[2], i + 2));       // viser le second côté : une mesure
    var mesure = T.etat.actions[T.etat.actions.length - 1];
    if (!mesure || Math.abs(mesure.angle - vrai) > 0.01) { ko('le rapporteur mesure ' + (mesure && mesure.angle) + '° au lieu de ' + vrai.toFixed(2) + '°'); bon = false; return; }
    var cotes = role('trace-angle').map(function (o) { return strip(o.plaintext); });
    if (cotes[cotes.length - 1] !== String(Math.round(vrai * 10) / 10).replace('.', ',') + '°') ko('cote de l\'angle : ' + cotes[cotes.length - 1] + ' pour ' + vrai.toFixed(2) + '°');
    // reporter la moitié : on vise à l'œil, loin de tout point d'accroche
    var g = a0 + sg * vrai / 2 * Math.PI / 180, vise = null;
    [150, 115, 190, 230, 90].forEach(function (r) {
      var q = [s[0][0] + r * Math.cos(g), s[0][1] + r * Math.sin(g)];
      if (!vise && dedans(q) && T.etat.accroches.every(function (k) { return dist(k, q) > 22; })) vise = q;
    });
    if (!vise) { bon = false; return; }
    T.clic(flou(s[0], i)); T.clic(flou(s[1], i + 1)); T.clic(vise);
    var moitie = T.etat.actions[T.etat.actions.length - 1];
    if (Math.abs(moitie.angle - Math.round(vrai) / 2) > 0.26 || (moitie.angle * 2) % 1 !== 0) ko('la moitié de ' + vrai.toFixed(2) + '° doit se régler au demi-degré : ' + moitie.angle);
  });
  return bon && role('trace-droite').length === 4 && role('trace-arc').length === 4;
}
// Construit le point `cle` avec les outils. Rend false si la construction sortirait du plan.
function construire(cle, A, B, C) {
  var S2 = [[A, B, C], [B, C, A]];                       // deux sommets suffisent : [sommet, côté opposé]
  if (cle === 'G') {
    T.choisir('regle');
    S2.forEach(function (s, i) { T.clic(flou(s[1], i)); T.clic(flou(s[2], i + 1)); T.clic(flou(s[0], i + 2)); T.clic(flou(vers(s[1], s[2], 0.5), i + 3)); });
    return role('trace-droite').length === 4 && role('trace-milieu').length === 4;
  }
  if (cle === 'H') {
    T.choisir('equerre');
    S2.forEach(function (s, i) { T.clic(flou(vers(s[1], s[2], 0.3), i)); T.clic(flou(s[0], i + 1)); });
    return role('trace-droite').length === 2;
  }
  if (cle === 'O') {
    var ok = true;
    [[A, B], [B, C]].forEach(function (s, i) {
      var d = dist(s[0], s[1]), m = vers(s[0], s[1], 0.5), h = Math.sqrt(0.62 * 0.62 - 0.25) * d;
      var nx = -(s[1][1] - s[0][1]) / d, ny = (s[1][0] - s[0][0]) / d;
      var I1 = [m[0] + nx * h, m[1] + ny * h], I2 = [m[0] - nx * h, m[1] - ny * h];
      if (!dedans(I1) || !dedans(I2)) { ok = false; return; }
      T.choisir('compas'); T.memeEcart(false);
      T.clic(flou(s[0], i)); T.clic(vers(s[0], s[1], 0.62));          // centre, puis un point du côté : l'écartement
      T.memeEcart(true); T.clic(flou(s[1], i + 1));                   // même écartement, depuis l'autre extrémité
      T.memeEcart(false);
      T.choisir('regle'); T.clic(flou(I1, i + 2)); T.clic(flou(I2, i + 3));
    });
    return ok && role('trace-cercle').length === 4 && role('trace-droite').length === 2;
  }
  if (auRapporteur) return bissectricesAuRapporteur(A, B, C);
  var bon = true;
  S2.forEach(function (s, i) {
    var r = 0.38 * Math.min(dist(s[0], s[1]), dist(s[0], s[2]));
    if (!dedans([s[0][0] + (vers(s[0], s[1], r / dist(s[0], s[1]))[0] - s[0][0]) * 2.2, s[0][1] + (vers(s[0], s[2], r / dist(s[0], s[2]))[1] - s[0][1]) * 2.2])) { bon = false; return; }
    T.choisir('compas'); T.memeEcart(false);
    T.clic(flou(s[0], i)); T.clic(vers(s[0], s[1], r / dist(s[0], s[1])));
    r = T.etat.ecart;                                       // l'écartement réellement pris (le clic a pu s'accrocher)
    var Pp = vers(s[0], s[1], r / dist(s[0], s[1])), Q = vers(s[0], s[2], r / dist(s[0], s[2]));
    var R = [Pp[0] + Q[0] - s[0][0], Pp[1] + Q[1] - s[0][1]];
    if (!dedans(R)) { bon = false; return; }
    // ici les clics sont exacts : autour de P, Q et R les cercles se croisent serré, et un clic
    // décalé de trois pixels peut légitimement s'accrocher à l'intersection voisine
    T.memeEcart(true); T.clic(Pp); T.clic(Q); T.memeEcart(false);
    T.choisir('regle'); T.clic(flou(s[0], i + 3)); T.clic(R);
  });
  return bon && role('trace-cercle').length === 6 && role('trace-droite').length === 2;
}
var MOTS = [
  [/centre de gravité/, 'G'], [/orthocentre/, 'H'], [/centre du cercle circonscrit/, 'O'], [/à égale distance des points A, B et C/, 'O'],
  [/centre du cercle inscrit/, 'I'], [/à égale distance des côtés/, 'I']
];

for (var n = 1; n <= 240; n++) {
  if (n > 1) clic('suivante');
  var nom = ' [mission ' + n + '] ';
  var A = P(role('sommet-A')[0]), B = P(role('sommet-B')[0]), C = P(role('sommet-C')[0]);
  var a = dist(B, C), b = dist(A, C), c = dist(A, B), L = Math.max(a, b, c);
  var mission = texte('rdv-mission'), score = texte('rdv-score');
  var m = MOTS.filter(function (q) { return q[0].test(mission); });
  if (m.length !== 1) { ko(nom + 'mission illisible : ' + mission); continue; }
  var cle = m[0][1], idx = MOTS.indexOf(m[0]);
  formules[idx] = (formules[idx] || 0) + 1;
  sixDernieres.push(idx);
  if (n % 6 === 0) { if (sixDernieres.slice().sort().join('') !== '012345') ko(nom + 'les six formulations ne sont pas toutes passées : ' + sixDernieres); sixDernieres = []; }
  var mq = /Mission (\d+) · (.+?) — score/.exec(score);
  if (!mq || +mq[1] !== n) ko(nom + 'compteur de missions : ' + score); else quartiers[mq[2]] = 1;
  var url = tuiles.map(function (t) { return typeof t.url === 'function' ? t.url() : t.url; });
  if (url.some(function (u, i) { return !/^cartes\/marseille\/[a-z-]+\/r[0-2]c[0-3]\.png$/.test(u) || url.indexOf(u) !== i; })) ko(nom + 'tuiles mal désignées : ' + url[0]);

  if (traces() || role('trace-milieu').length || T.etat.outil !== 'main') ko(nom + 'la mission ne repart pas d\'un plan vierge');
  [[a, b, c], [b, c, a], [c, a, b]].forEach(function (s) {
    var g = Math.acos((s[1] * s[1] + s[2] * s[2] - s[0] * s[0]) / (2 * s[1] * s[2])) * 180 / Math.PI;
    if (Math.abs(g - 90) < 9.99) ko(nom + 'triangle presque rectangle : un angle de ' + g.toFixed(1) + '°');
    if (g > 112.01) ko(nom + 'angle trop obtus : ' + g.toFixed(1) + '°');
  });
  // rien de la correction avant de valider
  if (traits.some(vu) || vu(cercle) || ['G', 'H', 'O', 'I'].some(function (k) { return vu(role('repere-' + k)[0]); })) ko(nom + 'la correction est visible avant la validation');
  if (texte('rdv-verdict') !== '' || texte('rdv-indice') !== '') ko(nom + 'verdict ou indice affiché trop tôt');

  // les quatre points, revérifiés
  var K = {}; ['G', 'H', 'O', 'I'].forEach(function (k) { K[k] = P(role('repere-' + k)[0]); });
  if (!proche(K.G[0], (A[0] + B[0] + C[0]) / 3) || !proche(K.G[1], (A[1] + B[1] + C[1]) / 3)) ko(nom + 'G n\'est pas la moyenne des sommets');
  [[A, B, C], [B, C, A], [C, A, B]].forEach(function (s) {
    var ps = (K.H[0] - s[0][0]) * (s[2][0] - s[1][0]) + (K.H[1] - s[0][1]) * (s[2][1] - s[1][1]);
    if (Math.abs(ps) > 1e-4 * L * L) ko(nom + 'H n\'est pas sur une hauteur');
  });
  if (!proche(dist(K.O, A), dist(K.O, B), 1e-6 * L) || !proche(dist(K.O, A), dist(K.O, C), 1e-6 * L)) ko(nom + 'O n\'est pas à égale distance des sommets');
  var dI = [dDroite(K.I, A, B), dDroite(K.I, B, C), dDroite(K.I, C, A)];
  if (!proche(dI[0], dI[1], 1e-6 * L) || !proche(dI[0], dI[2], 1e-6 * L)) ko(nom + 'I n\'est pas à égale distance des côtés');
  var aire = Math.abs(A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])) / 2;
  if (!proche(dI[0], 2 * aire / (a + b + c), 1e-6 * L)) ko(nom + 'I n\'est pas dans le triangle (ce serait un centre exinscrit)');
  // un triangle jouable
  var pts = [K.G, K.H, K.O, K.I];
  pts.forEach(function (p, i) {
    if (p[0] < 0 || p[0] > 1024 || p[1] < 0 || p[1] > 768) ko(nom + 'un point remarquable sort du plan');
    for (var j = i + 1; j < 4; j++) if (dist(p, pts[j]) < 0.1 * L) ko(nom + 'deux points remarquables sont presque confondus');
  });
  [A, B, C].forEach(function (p) { if (p[0] < 40 || p[0] > 984 || p[1] < 40 || p[1] > 728) ko(nom + 'un sommet est au bord du plan'); });
  if (2 * aire / L < 150) ko(nom + 'triangle trop plat');

  // on joue : quatre scénarios en alternance
  var cible = K[cle], sc = n % 4, avant = +/score : (\d+)/.exec(score)[1];
  var autre = ['G', 'H', 'O', 'I'].filter(function (k) { return k !== cle; })[n % 3];
  var pose = sc === 0 ? cible : sc === 1 ? [cible[0] + 0.06 * L, cible[1]] : sc === 2 ? K[autre] : [Math.min(1000, cible[0] + 0.5 * L), cible[1]];
  if (sc === 0 && n % 8 === 0) {
    clic('indice');
    if (!/💡/.test(texte('rdv-indice')) || traits.filter(vu).length !== 1) ko(nom + 'l\'indice doit rappeler la règle et tracer UNE droite');
    var mots = { G: 'médianes', H: 'hauteurs', O: 'médiatrices', I: 'bissectrices' };
    if (texte('rdv-indice').indexOf(mots[cle]) < 0) ko(nom + 'l\'indice ne nomme pas les ' + mots[cle]);
  }
  if (sc === 0 && n % 8 === 4) {
    if (n === 4) {                                        // l'équerre refuse un clic loin de toute droite ; annuler retire le dernier tracé
      T.choisir('equerre'); T.clic([K.G[0], K.G[1]]);
      if (T.etat.attente || !/sur/.test(texte('rdv-consigne'))) ko(nom + 'l\'équerre doit refuser un clic loin de toute droite');
      T.choisir('compas'); T.clic(A); T.clic(B);
      if (traces() !== 1) ko(nom + 'le compas ne trace pas son cercle');
      var ry = role('trace-rayon'), ct = role('trace-cote-rayon');
      if (ry.length !== 1 || ct.length !== 1) ko(nom + 'le cercle doit montrer son rayon et sa cote');
      else {
        if (dist(P(ry[0].point1), A) > 1e-6 || dist(P(ry[0].point2), B) > 1e-6) ko(nom + 'le rayon doit aller du centre au point qui a fixé l\'écartement');
        var mc = /^r = (\d+) m$/.exec(strip(ct[0].plaintext));
        if (!mc || Math.abs(+mc[1] - c * 200 / board.objectsList.filter(function (o) { return o.elType === 'segment' && o.visProp.strokewidth === 4; })[0].L()) > 0.51) ko(nom + 'cote du rayon fausse : ' + ct[0].plaintext);
      }
      T.annuler(); if (traces() !== 0 || role('trace-rayon').length || role('trace-cote-rayon').length) ko(nom + '« annuler » ne retire pas le dernier tracé, rayon compris');
    }
    auRapporteur = cle === 'I' && (tourRapporteur++ % 2 === 0);
    var fait = construire(cle, A, B, C);
    if (fait && auRapporteur) construitsRap++;
    // chaque cercle tracé montre un rayon de la bonne longueur, parti de son centre
    var cer = role('trace-cercle'), rys = role('trace-rayon');
    if (cer.length !== rys.length || role('trace-cote-rayon').length !== cer.length) ko(nom + cer.length + ' cercle(s) pour ' + rys.length + ' rayon(s)');
    else cer.forEach(function (k, i) {
      if (dist(P(rys[i].point1), P(k.center)) > 1e-6 || Math.abs(rys[i].L() - k.Radius()) > 1e-6) ko(nom + 'un rayon affiché n\'est pas celui de son cercle');
    });
    if (fait) {
      construits[cle]++;
      T.choisir('main');
      pose = cle === 'I' ? [cible[0] + 2, cible[1] - 2] : [cible[0] + 7, cible[1] - 6];   // lâché à côté : doit s'accrocher à l'intersection
    } else { T.effacer(); T.choisir('main'); }
  }
  poser(pose);
  var ou = P(RDV);
  var construit = sc === 0 && n % 8 === 4 && T.etat.actions.length > 0;
  // (une autre intersection des tracés peut se trouver à un ou deux pixels du point : le RDV s'y accroche aussi bien)
  var auRap = construit && cle === 'I' && auRapporteur;      // au demi-degré près : quelques pixels d'écart sont attendus
  if (sc === 0 && dist(ou, cible) > (auRap ? 6 : construit ? 2 : 1e-6 * L)) ko(nom + 'le RDV ne s\'accroche pas au point construit (' + cle + ', écart ' + dist(ou, cible).toFixed(3) + ')');
  // les pièces : sans profil d'abord, puis avec, et un « lendemain » à mi-parcours
  profilCourant = n <= 8 ? null : 'lea';
  if (n === 130 && ETAT.jeux) { ETAT.jeux.rdv.jour = 'hier'; duJour = 0; }
  clic('valider');
  var V = texte('rdv-verdict'), mm = /Tu es à (\d+) m/.exec(V), etoiles = (V.match(/★/g) || []).length;
  if (!mm) { ko(nom + 'verdict illisible : ' + V); continue; }
  var mpp = 200 / (board.objectsList.filter(function (o) { return o.elType === 'segment' && o.visProp.strokewidth === 4; })[0].L());
  if (Math.abs(+mm[1] - dist(ou, cible) * mpp) > 0.51) ko(nom + 'écart annoncé ' + mm[1] + ' m au lieu de ' + (dist(ou, cible) * mpp).toFixed(1));
  if (mpp < 1.6 || mpp > 1.9) ko(nom + 'échelle invraisemblable : ' + mpp + ' m par pixel');
  var rel = dist(ou, cible) / L, att = rel <= 0.04 ? 3 : rel <= 0.08 ? 2 : rel <= 0.14 ? 1 : 0;
  if (sc === 0 && n % 8 === 0) att = Math.max(0, att - 1);
  if (etoiles !== att) ko(nom + etoiles + ' étoile(s) au lieu de ' + att + ' (écart ' + rel.toFixed(3) + ' L)');
  var PV = strip(H.parClasse('rdv-verdict')[0].innerHTML.replace(/^[\s\S]*class="rdv-pieces"[^>]*>([\s\S]*?)<\/p>[\s\S]*$/, '$1'));
  if (!profilCourant) {
    sansProfilVu++;
    if (!/Choisis un profil/.test(PV) || ETAT.pieces !== 0 || JOURNAL.length) ko(nom + 'sans profil, aucune pièce et une invitation à en choisir un : ' + PV);
  } else {
    var voulu = etoiles === 3 ? 2 : etoiles === 2 ? 1 : 0, gain = Math.max(0, Math.min(voulu, 6 - duJour));
    duJour += gain; soldeAttendu += gain; if (gain) gainsAttendus++;
    if (ETAT.pieces !== soldeAttendu) ko(nom + 'solde ' + ETAT.pieces + ' au lieu de ' + soldeAttendu + ' (' + etoiles + ' étoiles)');
    if (JOURNAL.length !== gainsAttendus || JOURNAL.some(function (j) { return j.type !== 'jeu' || !(j.pieces > 0) || j.jeu !== 'rendez-vous-marseille'; })) ko(nom + 'journal incohérent');
    if (gain && PV.indexOf('+' + gain + ' pièce') < 0) ko(nom + 'le verdict doit annoncer +' + gain + ' : ' + PV);
    if (!gain && voulu) { plafondVu++; if (!/Plafond du jour/.test(PV)) ko(nom + 'le plafond doit être annoncé : ' + PV); }
    if (!voulu && !/Pas de pièce/.test(PV)) ko(nom + 'sans pièce, le verdict doit dire pourquoi : ' + PV);
    if (duJour > 6) ko(nom + 'plus de 6 pièces dans la journée');
  }
  if (sc === 0 && +mm[1] > (auRap ? 11 : construit ? 4 : 0)) ko(nom + 'posé sur la cible, l\'écart doit être 0 m');
  var apres = +/score : (\d+) ★ sur (\d+)/.exec(texte('rdv-score'))[1];
  if (apres !== avant + att) ko(nom + 'le score ne suit pas');
  if (sc === 2) { if (!/Ton point est plus près de/.test(V)) ko(nom + 'posé sur ' + autre + ', la confusion doit être nommée : ' + V); else confusions++; }
  if (sc === 0 && /plus près de/.test(V)) ko(nom + 'aucune confusion à signaler sur la cible');
  var noms = { G: 'le centre de gravité', H: 'l\'orthocentre', O: 'le centre du cercle circonscrit', I: 'le centre du cercle inscrit' };
  if (V.indexOf('Il fallait trouver ' + noms[cle]) < 0) ko(nom + 'le verdict ne nomme pas le bon point : ' + V);
  if (idx === 3 && !/égale distance des trois sommets/.test(V)) ko(nom + 'le verdict doit relier la formulation au cercle circonscrit');
  if (idx === 5 && !/égale distance des trois côtés/.test(V)) ko(nom + 'le verdict doit relier la formulation au cercle inscrit');

  // la correction tracée
  if (traits.filter(vu).length !== 3) ko(nom + 'les trois droites doivent être tracées');
  traits.forEach(function (t) {
    var p = P(t.point1), q = P(t.point2);
    if (dDroite(cible, p, q) > 1e-6 * L) ko(nom + 'un trait de la correction ne passe pas par le point attendu');
    var s = ((cible[0] - p[0]) * (q[0] - p[0]) + (cible[1] - p[1]) * (q[1] - p[1])) / (dist(p, q) * dist(p, q));
    if (s < -1e-9 || s > 1 + 1e-9) ko(nom + 'un trait de la correction s\'arrête avant le point attendu');
  });
  if (vu(cercle) !== (cle === 'O' || cle === 'I')) ko(nom + 'le cercle n\'est tracé que pour O et I');
  if (cle === 'O' && !proche(cercle.Radius(), dist(K.O, A), 1e-6 * L)) ko(nom + 'le cercle circonscrit ne passe pas par A');
  if (cle === 'I' && !proche(cercle.Radius(), dI[0], 1e-6 * L)) ko(nom + 'le cercle inscrit ne touche pas les côtés');
  // une fois validé, plus rien ne bouge ni ne se rejoue
  poser([500, 400]);
  if (dist(P(RDV), ou) > 1e-9) ko(nom + 'le point bouge encore après la validation');
  clic('valider');
  if (+/score : (\d+)/.exec(texte('rdv-score'))[1] !== apres) ko(nom + 'valider deux fois compte deux fois');
  var nt = traces(); T.choisir('regle'); T.clic(A); T.clic(B);
  if (traces() !== nt) ko(nom + 'on peut encore tracer après la validation');
}
for (var i = 0; i < 6; i++) if (!formules[i] || formules[i] !== 40) ko('formulation n° ' + i + ' tirée ' + (formules[i] || 0) + ' fois sur 240 au lieu de 40');
if (Object.keys(quartiers).length !== 8) ko('8 quartiers attendus, vus : ' + Object.keys(quartiers).join(', '));
if (!confusions) ko('aucune confusion testée');
if (!construitsRap) ko('aucune bissectrice construite au rapporteur');
if (!sansProfilVu || !plafondVu || soldeAttendu !== 12) ko('pièces : sans profil ' + sansProfilVu + ', plafonds ' + plafondVu + ', solde ' + soldeAttendu + ' (12 attendu : deux journées pleines)');
['G', 'H', 'O', 'I'].forEach(function (k) { if (construits[k] < 2) ko('le point ' + k + ' n\'a été construit aux outils que ' + construits[k] + ' fois'); });
H.sain('jeu', ko);
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('Rendez-vous à Marseille : 240 missions jouées sur 8 quartiers — points remarquables revérifiés, six formulations équilibrées, verdicts, étoiles, écarts en mètres, confusions et correction tracée ; ' + ['G', 'H', 'O', 'I'].map(function (k) { return construits[k] + ' ' + k; }).join(', ') + ' construits à la règle, à l\'équerre, au compas et au rapporteur (' + construitsRap + ' fois) ; pièces : ' + soldeAttendu + ' en deux journées, plafond tenu.');
