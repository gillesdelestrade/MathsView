/*
 * La leçon « Angle inscrit et angle au centre » (2nde), montée avec le VRAI
 * JSXGraph (renderer « no » : toute la logique, aucun dessin).
 *
 * Rien n'est relu tel quel. Pour des centaines de positions de A, B et M —
 * dont M sur le petit arc, où l'angle au centre dépasse 180° — l'angle
 * inscrit est recalculé à côté par le produit scalaire, l'angle au centre
 * est REMESURÉ sur le secteur tracé en O (somme des pas angulaires, pour
 * tenir le rentrant) et doit valoir exactement le double ; l'arc rouge doit
 * balayer le même angle sans passer par M ; le bandeau doit écrire ces deux
 * nombres, « 2 × », et « rentrant » exactement quand il le faut. La
 * démonstration est jouée : les deux arcs α balayent le même angle, les deux
 * arcs β aussi, l'arc 2α au centre vaut le double de α, 2β le double de β, et
 * 2α ± 2β retombe sur l'angle au centre, en additionnant quand O est dans
 * l'angle AMB et en soustrayant sinon — ce que le panneau doit dire. Les deux
 * animations sont rejouées étape par étape : M qui parcourt son arc laisse
 * l'angle inscrit constant et autant de positions dans la trace que de
 * fraction parcourue ; B qui ouvre l'arc garde l'angle au centre double à
 * chaque instant, passe par le rentrant, et chacun revient à sa place. Les
 * points glissés à la main s'accrochent au degré entier. Rejeu après remise
 * à zéro à l'identique, aucune coordonnée infinie.
 */
var window = this;
window.setTimeout = function (f) { return 0; };
window.clearTimeout = function () {};
window.requestAnimationFrame = function (f) { return 0; };
window.addEventListener = function () {};
window.removeEventListener = function () {};
window.navigator = { userAgent: 'jsc', platform: 'mac' };
window.location = { hash: '', href: '' };
window.innerWidth = 1200; window.innerHeight = 800;
window.devicePixelRatio = 1;

/* ------------------------------------------------------------------ */
/* Un DOM de poche, juste assez fidèle pour JSXGraph                    */
/* ------------------------------------------------------------------ */
var parId = {};
function fauxEl(tag) {
  var e = {
    tagName: String(tag).toUpperCase(), nodeName: String(tag).toUpperCase(),
    className: '', _id: '', _html: '', children: [], childNodes: [], style: {},
    dataset: {}, attributes: {}, ownerDocument: null, parentNode: null,
    offsetWidth: 220, offsetHeight: 170, clientWidth: 220, clientHeight: 170,
    scrollLeft: 0, scrollTop: 0, offsetLeft: 0, offsetTop: 0,
    classList: {
      add: function () {}, remove: function () {}, toggle: function () {},
      contains: function () { return false; }
    },
    appendChild: function (c) { c.parentNode = this; this.children.push(c); this.childNodes.push(c); return c; },
    removeChild: function (c) { var i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    insertBefore: function (c) { this.children.unshift(c); return c; },
    setAttribute: function (k, v) { this.attributes[k] = v; if (k === 'id') this.id = v; },
    getAttribute: function (k) { return this.attributes[k]; },
    removeAttribute: function (k) { delete this.attributes[k]; },
    setAttributeNS: function (ns, k, v) { this.attributes[k] = v; },
    hasAttribute: function (k) { return k in this.attributes; },
    getBoundingClientRect: function () { return { left: 0, top: 0, width: 220, height: 170, right: 220, bottom: 170 }; },
    getContext: function () { return { measureText: function () { return { width: 10 }; }, save: function () {}, restore: function () {} }; },
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    getElementsByTagName: function () { return []; },
    addEventListener: function () {}, removeEventListener: function () {},
    focus: function () {}, blur: function () {}
  };
  e.style.setProperty = function () {};
  Object.defineProperty(e, 'id', {
    get: function () { return e._id; },
    set: function (v) { if (e._id) delete parId[e._id]; e._id = v; if (v) parId[v] = e; }
  });
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; e.childNodes = []; }
  });
  Object.defineProperty(e, 'firstChild', { get: function () { return e.children[0] || null; } });
  Object.defineProperty(e, 'textContent', {
    get: function () { return e._txt || ''; }, set: function (v) { e._txt = v; }
  });
  return e;
}
var body = fauxEl('body');
var document = {
  createElement: fauxEl,
  createElementNS: function (ns, tag) { return fauxEl(tag); },
  createTextNode: function (t) { var e = fauxEl('#text'); e.textContent = t; return e; },
  getElementById: function (id) { return parId[id] || null; },
  getElementsByTagName: function () { return []; },
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  addEventListener: function () {}, removeEventListener: function () {},
  body: body, documentElement: fauxEl('html'),
  activeElement: null
};
window.document = document;

/* ------------------------------------------------------------------ */
/* Le vrai JSXGraph, sans dessin                                       */
/* ------------------------------------------------------------------ */
load('vendor/jsxgraphcore.js');
if (typeof JXG === 'undefined') { print('ÉCHEC : JSXGraph ne se charge pas sous jsc.'); throw new Error('JSXGraph'); }
window.JXG = JXG;
var initBoardVrai = JXG.JSXGraph.initBoard;
JXG.JSXGraph.initBoard = function (id, opts) {
  opts = opts || {};
  opts.renderer = 'no';
  return initBoardVrai.call(JXG.JSXGraph, id, opts);
};

/* ------------------------------------------------------------------ */
/* Le moteur, puis la leçon                                            */
/* ------------------------------------------------------------------ */
var erreursConsole = [];
var console = { log: function () {}, warn: function () {}, error: function (m) { erreursConsole.push(String(m)); } };
load('js/app.js');
var LECON = null;
var registerVrai = MathsView.register;
MathsView.register = function (l) { LECON = l; registerVrai(l); };
load('lessons/2nde/angle-inscrit-angle-centre.js');
if (!LECON || LECON.id !== 'angle-inscrit-angle-centre') { print('ÉCHEC : la leçon ne s\'enregistre pas'); throw new Error('register'); }
if (LECON.level !== '2nde' || LECON.category !== 'geometrie' || !LECON.fiche) print('ÉCHEC : niveau, domaine ou fiche manquants');

var err = [];
function ko(m) { if (err.length < 20) err.push(m); }

var boardEl = fauxEl('div'); boardEl.id = 'board-test';
var extras = fauxEl('div'); extras.id = 'lesson-extras';
var opts = {}; for (var k in LECON.board) opts[k] = LECON.board[k];
var board = JXG.JSXGraph.initBoard('board-test', opts);

var steps = null, remiseAZero = null, controles = null, refs = {};
var mv = {
  hideBoard: function () {}, typeset: function () {}, onCleanup: function () {},
  extras: extras,
  addControls: function (c) {
    controles = c;
    c.forEach(function (s) { var e = fauxEl(s.type === 'button' ? 'button' : 'input'); e.checked = !!s.checked; refs[s.id] = e; });
    return refs;
  },
  createAnimator: function () { return { cancel: function () { steps = null; },
    runSteps: function (s, r) { steps = s; remiseAZero = r; } }; }
};
try { LECON.setup(board, mv); }
catch (e) { ko('setup() plante : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
function bouton(id) { return (controles || []).filter(function (c) { return c.id === id; })[0]; }
['parcours', 'ouverture', 'pourquoi', 'reset'].forEach(function (id) { if (!bouton(id)) ko('il manque le contrôle « ' + id + ' »'); });
if (!steps) ko('runSteps jamais appelé au chargement : la démonstration devrait être prête');

/* ------------------------------------------------------------------ */
/* Repérage des objets de la figure                                    */
/* ------------------------------------------------------------------ */
function gliders(nom) { return board.objectsList.filter(function (o) { return o.elType === 'glider' && o.name === nom; }); }
function points(nom) { return board.objectsList.filter(function (o) { return o.elType === 'point' && o.name === nom; }); }
var A = gliders('A')[0], B = gliders('B')[0], M = gliders('M')[0], D = points('D')[0];
if (!A || !B || !M || !D) ko('les points A, B, M (glisseurs) et D doivent exister');
var courbes = board.objectsList.filter(function (o) { return o.elType === 'curve'; });
var textes = board.objectsList.filter(function (o) { return o.elType === 'text'; });
function couleur(c) { return String(c.visProp.strokecolor).toLowerCase(); }
function remplissage(c) { return String(c.visProp.fillcolor).toLowerCase(); }
var arcAB = courbes.filter(function (c) { return couleur(c) === '#dc2626'; })[0];
var secteurIns = courbes.filter(function (c) { return couleur(c) === '#1d4ed8' && remplissage(c) === '#1d4ed8'; })[0];
var secteurCen = courbes.filter(function (c) { return couleur(c) === '#d97706' && remplissage(c) === '#d97706'; })[0];
var alphas = courbes.filter(function (c) { return couleur(c) === '#7c3aed'; });
var betas = courbes.filter(function (c) { return couleur(c) === '#0d9488'; });
var trace = courbes.filter(function (c) { return couleur(c) === '#94a3b8'; })[0];
var bandeauIns = textes.filter(function (t) { return String(t.plaintext).indexOf('Angle inscrit') === 0 || String(t.plaintext).indexOf('confondu') >= 0; })[0];
var bandeauCen = textes.filter(function (t) { return String(t.plaintext).indexOf('Angle au centre') === 0; })[0];
if (!arcAB || !secteurIns || !secteurCen || alphas.length !== 3 || betas.length !== 3 || !trace || !bandeauIns || !bandeauCen)
  ko('objets introuvables : arc ' + !!arcAB + ', secteurs ' + !!secteurIns + '/' + !!secteurCen + ', α ' + alphas.length + ', β ' + betas.length + ', trace ' + !!trace + ', bandeaux ' + !!bandeauIns + '/' + !!bandeauCen);
// Les mesures près des angles : des textes de 13 px bleu et ambre dont le contenu finit par « ° ».
var mesureIns = textes.filter(function (t) { return t !== bandeauIns && String(t.visProp.strokecolor).toLowerCase() === '#1d4ed8' && /°$/.test(String(t.plaintext)); })[0];
var mesureCen = textes.filter(function (t) { return t !== bandeauCen && String(t.visProp.strokecolor).toLowerCase() === '#d97706' && /°$/.test(String(t.plaintext)); })[0];
if (!mesureIns || !mesureCen) ko('les mesures près des angles sont introuvables');

var R = 4, D2R = Math.PI / 180;
function pres(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-6); }
function mod360(x) { x = x % 360; if (x < 0) x += 360; return x; }
function poserDeg(P, deg) { P.setPosition(JXG.COORDS_BY_USER, [R * Math.cos(deg * D2R), R * Math.sin(deg * D2R)]); board.update(); }
function degDe(P) { return mod360(Math.atan2(P.Y(), P.X()) / D2R); }
function angleVrai(V, P, Q) {
  var px = P.X() - V.X(), py = P.Y() - V.Y(), qx = Q.X() - V.X(), qy = Q.Y() - V.Y();
  return Math.acos(Math.max(-1, Math.min(1, (px * qx + py * qy) / Math.hypot(px, py) / Math.hypot(qx, qy)))) / D2R;
}
function fmt(x) { return String(Math.round(x * 10) / 10).replace('.', ',') + '°'; }
// Balayage SIGNÉ (degrés) d'une courbe autour du sommet (cx, cy) : somme des
// pas angulaires entre points consécutifs, en ignorant le sommet lui-même et
// les NaN. Tient les angles rentrants, qu'un « premier − dernier » raterait.
function balayage(c, cx, cy) {
  var X = c.dataX || c.X, Y = c.dataY || c.Y, tot = 0, prev = null, i;
  for (i = 0; i < X.length; i++) {
    if (isNaN(X[i]) || Math.hypot(X[i] - cx, Y[i] - cy) < 1e-9) { prev = null; continue; }
    var a = Math.atan2(Y[i] - cy, X[i] - cx);
    if (prev !== null) { var d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; tot += d; }
    prev = a;
  }
  return tot / D2R;
}
// Les k arcs d'une marque : balayage de chaque morceau (séparés par NaN).
function morceaux(c) {
  var X = c.dataX, Y = c.dataY, res = [], cur = { X: [], Y: [] };
  for (var i = 0; i <= X.length; i++) {
    if (i === X.length || isNaN(X[i])) { if (cur.X.length) res.push(cur); cur = { X: [], Y: [] }; }
    else { cur.X.push(X[i]); cur.Y.push(Y[i]); }
  }
  return res;
}
function sain(nom) {
  board.objectsList.forEach(function (o) {
    if ((o.elType === 'point' || o.elType === 'glider') && o.coords) {
      var u = o.coords.usrCoords;
      if (!isFinite(u[1]) || !isFinite(u[2])) ko(nom + ' : ' + o.name + ' a des coordonnées ' + u[1] + ' ; ' + u[2]);
    }
    if (o.elType === 'curve' && o.dataX) {
      for (var i = 0; i < o.dataX.length; i++) {
        if (o.dataX[i] === Infinity || o.dataX[i] === -Infinity || o.dataY[i] === Infinity || o.dataY[i] === -Infinity)
          ko(nom + ' : une courbe a une coordonnée infinie');
      }
    }
  });
}
function panneau() { return extras.children.map(function (c) { return c.innerHTML || ''; }).join(''); }
function lignesVisibles(html) {
  var n = 0, re = /<li class="cercle-ligne" style="([^"]*)" data-n="(\d)"/g, m;
  while ((m = re.exec(html))) if (m[1].indexOf('display:none') < 0 && m[2] !== '0') n++;
  return n;
}
function depouille(html) { return String(html).replace(/<[^>]+>/g, ''); }

/* ------------------------------------------------------------------ */
/* 1. Les deux mesures, pour des centaines de positions                 */
/* ------------------------------------------------------------------ */
var compte = 0, rentrants = 0;
function verifierMesures(nom, exact) {
  sain(nom);
  var ins = angleVrai(M, A, B);
  var cen = Math.abs(balayage(secteurCen, 0, 0));
  var arc = Math.abs(balayage(arcAB, 0, 0));
  if (!pres(cen, 2 * ins, 1e-6)) ko(nom + ' : le secteur au centre balaye ' + cen + '°, attendu 2 × ' + ins + '°');
  if (!pres(arc, cen, 1e-6)) ko(nom + ' : l\'arc rouge balaye ' + arc + '°, le secteur au centre ' + cen + '°');
  if (!pres(Math.abs(balayage(secteurIns, M.X(), M.Y())), ins, 1e-6)) ko(nom + ' : le secteur en M ne mesure pas l\'angle inscrit');
  // L'arc rouge part de A, finit en B, et ne passe pas par M.
  var X = arcAB.dataX, Y = arcAB.dataY, n = X.length;
  if (!pres(X[0], A.X(), 1e-9) || !pres(Y[0], A.Y(), 1e-9) || !pres(X[n - 1], B.X(), 1e-9) || !pres(Y[n - 1], B.Y(), 1e-9)) ko(nom + ' : l\'arc rouge doit aller de A à B');
  var sens = balayage(arcAB, 0, 0) >= 0 ? 1 : -1, posM = mod360((degDe(M) - degDe(A)) * sens);
  if (posM < arc - 1e-6) ko(nom + ' : l\'arc rouge passe par M (M à ' + posM + '° de A, arc de ' + arc + '°)');
  // Le bandeau et les mesures près des angles écrivent ces nombres-là.
  var tIns = String(bandeauIns.plaintext), tCen = String(bandeauCen.plaintext);
  if (tIns !== 'Angle inscrit  AMB = ' + fmt(ins)) ko(nom + ' : bandeau inscrit « ' + tIns + ' », attendu AMB = ' + fmt(ins));
  var attendu = 'Angle au centre  AOB = ' + fmt(cen) + '  =  2 × ' + fmt(ins) + (cen > 180 + 1e-9 ? '   (angle rentrant)' : '');
  if (tCen !== attendu) ko(nom + ' : bandeau centre « ' + tCen + ' », attendu « ' + attendu + ' »');
  if (String(mesureIns.plaintext) !== fmt(ins) || String(mesureCen.plaintext) !== fmt(cen)) ko(nom + ' : mesures près des angles « ' + mesureIns.plaintext + ' » / « ' + mesureCen.plaintext + ' »');
  if (!mesureIns.visProp.visible || !mesureCen.visProp.visible) ko(nom + ' : hors démonstration, les mesures près des angles doivent être visibles');
  if (exact && (fmt(cen).indexOf(',') >= 0 || /,[1-46-9]/.test(fmt(ins)))) ko(nom + ' : avec des points aux degrés entiers, l\'angle au centre est entier et l\'inscrit au demi-degré (' + fmt(ins) + ', ' + fmt(cen) + ')');
  if (cen > 180 + 1e-9) rentrants++;
  compte++;
}
if (!err.length) {
  for (var ia = 0; ia < 360; ia += 37) {
    for (var ib = 10; ib < 360; ib += 53) {
      for (var im = 5; im < 360; im += 41) {
        var da = ia, db = mod360(ia + ib), dm = mod360(ia + im);
        if (Math.min(mod360(dm - da), mod360(da - dm)) < 1 || Math.min(mod360(dm - db), mod360(db - dm)) < 1) continue;
        poserDeg(A, da); poserDeg(B, db); poserDeg(M, dm);
        verifierMesures('A' + da + ' B' + db + ' M' + dm, true);
        if (err.length) break;
      }
      if (err.length) break;
    }
    if (err.length) break;
  }
  if (!rentrants) ko('aucun angle rentrant rencontré : le balayage ne couvre pas M sur le petit arc');
  // Le diamètre : [AB] diamètre → 180° au centre, 90° inscrit.
  poserDeg(A, 200); poserDeg(B, 20); poserDeg(M, 110);
  if (String(bandeauCen.plaintext).indexOf('AOB = 180°  =  2 × 90°') < 0) ko('[AB] diamètre : attendu 180° = 2 × 90°, lu ' + bandeauCen.plaintext);
  // M sur A : plus d'angle, pas de courbe folle.
  poserDeg(M, 200); sain('M sur A');
  if (String(bandeauIns.plaintext).indexOf('confondu') < 0) ko('M sur A : le bandeau devrait le dire');
  if (arcAB.dataX.length || secteurCen.dataX.length) ko('M sur A : l\'arc et le secteur doivent être vides');
}

/* ------------------------------------------------------------------ */
/* 2. L'accrochage aux degrés entiers quand on glisse à la main         */
/* ------------------------------------------------------------------ */
if (!err.length) {
  poserDeg(A, 210); poserDeg(B, 330);
  [[M, 97.4], [A, 213.6], [B, 329.5]].forEach(function (c) {
    poserDeg(c[0], c[1]);
    c[0].triggerEventHandlers(['drag'], [{}]); board.update();
    var d = degDe(c[0]);
    if (!pres(d, Math.round(d), 1e-9)) ko(c[0].name + ' glissé à ' + c[1] + '° devrait s\'accrocher au degré entier, lu ' + d);
    if (!pres(Math.hypot(c[0].X(), c[0].Y()), R, 1e-9)) ko(c[0].name + ' a quitté le cercle en s\'accrochant');
  });
}

/* ------------------------------------------------------------------ */
/* 3. La démonstration : α = α, β = β, 2α, 2β, et la somme (ou la      */
/*    différence) retombe sur l'angle au centre                         */
/* ------------------------------------------------------------------ */
var sommes = 0, differences = 0;
var O = { X: function () { return 0; }, Y: function () { return 0; } };
// La marque dont le premier arc est à la distance r du sommet P ; on ne
// mesure que son PREMIER arc (les marques β en ont deux, concentriques).
function arcEn(liste, P, r) {
  var c = liste.filter(function (c) { return c.dataX.length && pres(Math.hypot(c.dataX[0] - P.X(), c.dataY[0] - P.Y()), r, 1e-6); })[0];
  if (!c) return null;
  var m = morceaux(c)[0]; m.visProp = c.visProp; return m;
}
function jouerDemo(nom) {
  try {
    remiseAZero(); board.update(); sain(nom + ' (départ)');
    steps.forEach(function (s, i) {
      s.step(0.4); board.update(); sain(nom + ' (étape ' + (i + 1) + ', en cours)');
      s.step(1); if (s.after) s.after(); board.update(); sain(nom + ' (étape ' + (i + 1) + ')');
    });
  } catch (e) { ko(nom + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
}
if (!err.length) {
  var configs = [[210, 330, 100], [210, 330, 160], [210, 330, 30], [0, 100, 200], [0, 60, 30], [0, 300, 100], [40, 230, 300], [100, 140, 350]];
  configs.forEach(function (c) {
    poserDeg(A, c[0]); poserDeg(B, c[1]); poserDeg(M, c[2]);
    var nom = 'démo A' + c[0] + ' B' + c[1] + ' M' + c[2];
    bouton('pourquoi').onClick();
    if (!steps || steps.length !== 4) { ko(nom + ' : la démonstration devrait tenir en 4 étapes'); return; }
    remiseAZero(); board.update();
    if (lignesVisibles(panneau()) !== 0) ko(nom + ' : au départ, aucune ligne de la démonstration ne doit être visible');
    if (alphas[0].visProp.strokeopacity > 0 || betas[0].visProp.strokeopacity > 0 || D.visProp.visible) ko(nom + ' : au départ, marques et D doivent être invisibles');
    if (!mesureIns.visProp.visible) ko(nom + ' : au départ, la mesure près de M doit être visible');
    steps.forEach(function (s, i) {
      s.step(1); if (s.after) s.after(); board.update();
      if (lignesVisibles(panneau()) !== i + 1) ko(nom + ' : après l\'étape ' + (i + 1) + ', ' + (i + 1) + ' ligne(s) attendue(s), ' + lignesVisibles(panneau()) + ' visible(s)');
    });
    if (!D.visProp.visible || !pres(D.X(), -M.X(), 1e-9) || !pres(D.Y(), -M.Y(), 1e-9)) ko(nom + ' : D doit être visible, diamétralement opposé à M');
    if (mesureIns.visProp.visible || mesureCen.visProp.visible) ko(nom + ' : pendant la démonstration, les lettres remplacent les mesures près des angles');
    var bIns = String(bandeauIns.plaintext), bCen = String(bandeauCen.plaintext);
    if (bIns.indexOf('AMB = ') < 0 || bCen.indexOf('2 × ') < 0) ko(nom + ' : le bandeau garde les deux mesures pendant la démonstration');
    var aM = arcEn(alphas, M, 1.25), aA = arcEn(alphas, A, 0.85), a2 = arcEn(alphas, O, 1.55);
    var bM = arcEn(betas, M, 1.45), bB = arcEn(betas, B, 0.75), b2 = arcEn(betas, O, 1.85);
    if (!aM || !aA || !a2 || !bM || !bB || !b2) { ko(nom + ' : une marque est introuvable (α en M/A/O, β en M/B/O)'); return; }
    [aM, aA, a2, bM, bB, b2].forEach(function (c) { if (!pres(c.visProp.strokeopacity, 1)) ko(nom + ' : toutes les marques doivent être pleines à la fin'); });
    var alpha = Math.abs(balayage((aM), M.X(), M.Y())), alphaA = Math.abs(balayage((aA), A.X(), A.Y()));
    var beta = Math.abs(balayage((bM), M.X(), M.Y())), betaB = Math.abs(balayage((bB), B.X(), B.Y()));
    var deuxAlpha = Math.abs(balayage((a2), 0, 0)), deuxBeta = Math.abs(balayage((b2), 0, 0));
    if (!pres(alpha, alphaA, 1e-6)) ko(nom + ' : α en M (' + alpha + ') ≠ α en A (' + alphaA + ') : OMA ne serait pas isocèle');
    if (!pres(beta, betaB, 1e-6)) ko(nom + ' : β en M (' + beta + ') ≠ β en B (' + betaB + ') : OMB ne serait pas isocèle');
    if (!pres(alpha, angleVrai(M, A, O), 1e-6)) ko(nom + ' : α n\'est pas l\'angle OMA');
    if (!pres(deuxAlpha, 2 * alpha, 1e-6)) ko(nom + ' : AOD (' + deuxAlpha + ') devrait valoir 2α = ' + 2 * alpha);
    if (!pres(deuxBeta, 2 * beta, 1e-6)) ko(nom + ' : BOD (' + deuxBeta + ') devrait valoir 2β = ' + 2 * beta);
    var ins = angleVrai(M, A, B), cen = Math.abs(balayage(secteurCen, 0, 0));
    var dedans = pres(alpha + beta, ins, 1e-6);
    var html = depouille(panneau());
    if (dedans) {
      sommes++;
      if (!pres(deuxAlpha + deuxBeta, cen, 1e-6)) ko(nom + ' : 2α + 2β = ' + (deuxAlpha + deuxBeta) + ' ≠ AOB = ' + cen);
      if (html.indexOf('soustrait') >= 0 || html.indexOf('2α + 2β') < 0) ko(nom + ' : O est dans l\'angle, le panneau doit additionner');
      if (html.indexOf('2 × ' + fmt(alpha) + ' + 2 × ' + fmt(beta) + ' = ' + fmt(cen) + ' = 2 × ' + fmt(ins)) < 0) ko(nom + ' : le calcul numérique n\'est pas écrit (' + fmt(alpha) + ', ' + fmt(beta) + ', ' + fmt(cen) + ')');
    } else {
      differences++;
      if (!pres(Math.abs(beta - alpha), ins, 1e-6)) ko(nom + ' : hors de l\'angle, |β − α| devrait valoir AMB');
      if (!pres(Math.abs(deuxBeta - deuxAlpha), cen, 1e-6)) ko(nom + ' : |2β − 2α| = ' + Math.abs(deuxBeta - deuxAlpha) + ' ≠ AOB = ' + cen);
      if (html.indexOf('soustrait') < 0) ko(nom + ' : O est hors de l\'angle, le panneau doit soustraire');
      var grand = beta >= alpha ? beta : alpha, petit = beta >= alpha ? alpha : beta;
      if (html.indexOf('2 × ' + fmt(grand) + ' − 2 × ' + fmt(petit) + ' = ' + fmt(cen) + ' = 2 × ' + fmt(ins)) < 0) ko(nom + ' : le calcul numérique n\'est pas écrit');
    }
    if ((cen > 180 + 1e-9) !== (html.indexOf('rentrant') >= 0)) ko(nom + ' : « rentrant » doit apparaître exactement quand AOB > 180° (' + cen + ')');
    if (html.indexOf('OA = OB = OM = R') < 0 || html.indexOf('2 × AMB') < 0) ko(nom + ' : rayons et conclusion doivent être écrits au panneau');
    // « Précédent » depuis la fin : remise à zéro puis trois étapes.
    remiseAZero(); steps[0].step(1); steps[0].after(); steps[1].step(1); steps[1].after(); steps[2].step(1); steps[2].after(); board.update();
    if (lignesVisibles(panneau()) !== 3) ko(nom + ' : « Précédent » depuis la fin devrait laisser 3 lignes');
    if (!pres(betas[0].visProp.strokeopacity, 1)) ko(nom + ' : après 3 étapes les arcs β doivent être pleins');
    jouerDemo(nom + ' (rejeu)');
  });
  if (!sommes || !differences) ko('les deux cas de la démonstration (somme et différence) doivent être rencontrés : ' + sommes + ' / ' + differences);
}

/* ------------------------------------------------------------------ */
/* 4. « M parcourt son arc » : l'angle ne change pas, la trace suit    */
/* ------------------------------------------------------------------ */
if (!err.length) {
  [[210, 330, 100], [210, 330, 270], [0, 90, 300]].forEach(function (c) {
    poserDeg(A, c[0]); poserDeg(B, c[1]); poserDeg(M, c[2]);
    var nom = 'parcours A' + c[0] + ' B' + c[1] + ' M' + c[2];
    var ins0 = angleVrai(M, A, B), cen0 = Math.abs(balayage(secteurCen, 0, 0)), m0 = degDe(M);
    var arcM = mod360(degDe(M) - degDe(A)) < mod360(degDe(B) - degDe(A)) ? { de: degDe(A), span: mod360(degDe(B) - degDe(A)) } : { de: degDe(B), span: mod360(degDe(A) - degDe(B)) };
    bouton('parcours').onClick();
    if (!steps || steps.length !== 3) { ko(nom + ' : trois étapes attendues (aller au bout, traverser, revenir)'); return; }
    remiseAZero(); board.update();
    if (!A.visProp.fixed || !B.visProp.fixed || !M.visProp.fixed) ko(nom + ' : pendant le parcours, A, B et M sont bloqués');
    [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
      steps[0].step(1); steps[0].after();
      steps[1].step(p); board.update(); sain(nom + ' à ' + p);
      var u = mod360(degDe(M) - arcM.de);
      if (u < 3.5 || u > arcM.span - 3.5) ko(nom + ' à ' + p + ' : M (' + u + '° du bout) doit rester sur son arc, à l\'écart de A et B');
      verifierMesures(nom + ' à ' + p, true);
      if (!pres(angleVrai(M, A, B), ins0, 1e-6)) ko(nom + ' à ' + p + ' : l\'angle inscrit a changé (' + angleVrai(M, A, B) + ' pour ' + ins0 + ')');
      if (!pres(Math.abs(balayage(secteurCen, 0, 0)), cen0, 1e-6)) ko(nom + ' à ' + p + ' : l\'angle au centre a changé');
      var nGhosts = morceaux(trace).length / 2, attendu = Math.floor(12 * p + 1e-9);
      if (nGhosts !== attendu) ko(nom + ' à ' + p + ' : ' + attendu + ' positions attendues dans la trace, ' + nGhosts);
      var html = depouille(panneau());
      if (html.indexOf('AMB = ' + fmt(ins0)) < 0 || html.indexOf('AOB = ' + fmt(cen0)) < 0 || html.indexOf('ne change pas') < 0) ko(nom + ' : le panneau doit dire que les deux mesures ne changent pas');
    });
    // Chaque position gardée fait bien le même angle inscrit.
    morceaux(trace).forEach(function (mc, i) {
      if (i % 2) return;   // 0 : les deux côtés A–M–B ; 1 : l'arc en M
      var mx = mc.X[1], my = mc.Y[1];
      if (!pres(Math.hypot(mx, my), R, 1e-6)) ko(nom + ' : une position de la trace n\'est pas sur le cercle');
      var a = angleVrai({ X: function () { return mx; }, Y: function () { return my; } }, A, B);
      if (!pres(a, ins0, 1e-6)) ko(nom + ' : une position gardée en trace fait ' + a + '° au lieu de ' + ins0);
    });
    steps[1].after(); steps[2].step(1); steps[2].after(); board.update();
    if (!pres(degDe(M), m0, 1e-9)) ko(nom + ' : au bout, M doit être revenu à ' + m0 + '°, lu ' + degDe(M));
    if (A.visProp.fixed || M.visProp.fixed) ko(nom + ' : le parcours fini, les points redeviennent déplaçables');
    remiseAZero(); board.update();
    if (trace.dataX.length) ko(nom + ' : après remise à zéro, la trace doit être vide');
    if (!pres(degDe(M), m0, 1e-9)) ko(nom + ' : après remise à zéro, M doit être revenu au départ');
  });
}

/* ------------------------------------------------------------------ */
/* 5. « L'arc s'ouvre » : le double à chaque instant, rentrant compris  */
/* ------------------------------------------------------------------ */
if (!err.length) {
  [[210, 330, 100], [0, 300, 100], [100, 140, 350]].forEach(function (c) {
    poserDeg(A, c[0]); poserDeg(B, c[1]); poserDeg(M, c[2]);
    var nom = 'ouverture A' + c[0] + ' B' + c[1] + ' M' + c[2];
    var b0 = degDe(B), a0 = degDe(A), m0 = degDe(M), vuRentrant = false, vuAigu = false;
    bouton('ouverture').onClick();
    if (!steps || steps.length !== 3) { ko(nom + ' : trois étapes attendues (se referme, s\'ouvre, revient)'); return; }
    remiseAZero(); board.update();
    if (!A.visProp.fixed || !M.visProp.fixed || !B.visProp.fixed) ko(nom + ' : pendant l\'ouverture, les trois points sont bloqués');
    steps[0].step(1); steps[0].after(); board.update();
    var dA = Math.min(mod360(degDe(B) - a0), mod360(a0 - degDe(B)));
    if (dA > 4.5 || dA < 0.5) ko(nom + ' : refermé, B doit être tout près de A (' + dA + '°)');
    for (var p = 0; p <= 1; p += 1 / 16) {
      steps[1].step(p); board.update(); sain(nom + ' à ' + p);
      if (!pres(degDe(A), a0, 1e-9) || !pres(degDe(M), m0, 1e-9)) ko(nom + ' : A et M ne bougent pas pendant l\'ouverture');
      verifierMesures(nom + ' à ' + p, true);
      var cen = Math.abs(balayage(secteurCen, 0, 0)), html = depouille(panneau());
      if (cen > 180 + 1e-9) vuRentrant = true; else vuAigu = true;
      if ((cen > 180 + 1e-9) !== (html.indexOf('il est rentrant') >= 0)) ko(nom + ' à ' + p + ' : le panneau dit « rentrant » exactement quand AOB > 180° (' + cen + ')');
      if (html.indexOf('toujours le double') < 0) ko(nom + ' : le panneau doit rappeler « toujours le double »');
    }
    if (!vuRentrant || !vuAigu) ko(nom + ' : l\'ouverture doit passer par les deux régimes (aigu, rentrant)');
    var dM = Math.min(mod360(degDe(B) - m0), mod360(m0 - degDe(B)));
    if (dM > 4.5 || dM < 0.5) ko(nom + ' : grand ouvert, B doit être tout près de M (' + dM + '°)');
    steps[1].after(); steps[2].step(1); steps[2].after(); board.update();
    if (!pres(degDe(B), b0, 1e-9)) ko(nom + ' : au bout, B doit être revenu à ' + b0 + '°, lu ' + degDe(B));
    if (B.visProp.fixed) ko(nom + ' : l\'ouverture finie, B redevient déplaçable');
    remiseAZero(); board.update();
    if (!pres(degDe(B), b0, 1e-9)) ko(nom + ' : après remise à zéro, B doit être revenu au départ');
  });
}

/* ------------------------------------------------------------------ */
/* 6. Réinitialiser, puis rejouer : la même figure                      */
/* ------------------------------------------------------------------ */
if (!err.length) {
  poserDeg(A, 210); poserDeg(B, 330); poserDeg(M, 100);
  bouton('pourquoi').onClick(); jouerDemo('avant reset');
  bouton('reset').onClick(); board.update();
  if (alphas[0].visProp.strokeopacity > 0 || D.visProp.visible || trace.dataX.length) ko('après « Réinitialiser », marques, D et trace doivent avoir disparu');
  if (A.visProp.fixed || B.visProp.fixed || M.visProp.fixed) ko('après « Réinitialiser », les points sont déplaçables');
  verifierMesures('après reset', true);
  if (String(bandeauCen.plaintext) !== 'Angle au centre  AOB = 120°  =  2 × 60°') ko('la figure de départ devrait lire 120° = 2 × 60°, lu : ' + bandeauCen.plaintext);
  bouton('pourquoi').onClick(); jouerDemo('rejeu après reset');
  var html = depouille(panneau());
  if (html.indexOf('2 × 60°') < 0 || html.indexOf('= 120°') < 0) ko('le rejeu doit conclure 120° = 2 × 60°');
  if (erreursConsole.length) ko('la console a reçu des erreurs : ' + erreursConsole.join(' | '));
}

/* ------------------------------------------------------------------ */
if (err.length) {
  print('ÉCHEC — ' + err.length + ' problème(s) :');
  err.forEach(function (m) { print('  - ' + m); });
} else {
  print('Angle inscrit et angle au centre : ' + compte + ' positions remesurées (' + rentrants + ' rentrants), ' +
    sommes + ' démonstrations par somme et ' + differences + ' par différence, parcours et ouverture rejoués, accrochage au degré, rejeu à l\'identique.');
}
