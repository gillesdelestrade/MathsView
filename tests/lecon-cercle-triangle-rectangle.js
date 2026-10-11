/*
 * La leçon « Triangle inscrit dans un demi-cercle » (2nde), montée avec le
 * VRAI JSXGraph (renderer « no » : toute la logique, aucun dessin).
 *
 * Rien n'est relu tel quel : pour 5 diamètres et 36 positions de M sur le
 * cercle, l'angle AMB est recalculé à côté par le produit scalaire et doit
 * valoir 90° ; l'équerre tracée en M doit avoir ses deux bras sur [MA) et
 * [MB) et le verdict affiché dire « rectangle ». La démonstration est jouée :
 * les deux arcs α (en A et en M) doivent balayer le MÊME angle, les deux
 * arcs β aussi, et α + β doit faire 90° — c'est exactement ce que la leçon
 * affirme. Le tour de M laisse autant de triangles que de fraction parcourue
 * et revient au départ. En mode libre, le verdict doit dire « intérieur » et
 * mesurer un angle obtus dedans, « extérieur » et aigu dehors, et redevenir
 * « rectangle » pile sur le cercle. Rejeu après remise à zéro à l'identique.
 * Aucune coordonnée infinie ne doit atteindre le moteur.
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
load('lessons/2nde/cercle-triangle-rectangle.js');
if (!LECON || LECON.id !== 'cercle-triangle-rectangle') { print('ÉCHEC : la leçon ne s\'enregistre pas'); throw new Error('register'); }

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
if (!bouton('tour') || !bouton('pourquoi') || !bouton('reset') || !bouton('libre')) ko('il manque un contrôle (tour, pourquoi, reset, libre)');
if (!steps) ko('runSteps jamais appelé au chargement : la démonstration devrait être prête');

/* ------------------------------------------------------------------ */
/* Repérage des objets de la figure                                    */
/* ------------------------------------------------------------------ */
function points(nom) { return board.objectsList.filter(function (o) { return o.elType === 'point' && o.name === nom; }); }
function gliders(nom) { return board.objectsList.filter(function (o) { return o.elType === 'glider' && o.name === nom; }); }
var A = gliders('A')[0];
var Ms = gliders('M').concat(points('M'));           // M sur le cercle (glider) et M libre
var Mc = Ms.filter(function (o) { return o.elType === 'glider'; })[0];
var Ml = Ms.filter(function (o) { return o.elType === 'point'; })[0];
var B = points('B')[0];
if (!A || !B || !Mc || !Ml) ko('les points A, B, M (sur le cercle) et M (libre) doivent exister');
var courbes = board.objectsList.filter(function (o) { return o.elType === 'curve'; });
var textes = board.objectsList.filter(function (o) { return o.elType === 'text'; });
function couleur(c) { return String(c.visProp.strokecolor).toLowerCase(); }
var equerre = courbes.filter(function (c) { return couleur(c) === '#dc2626' && c.visProp.fillcolor && String(c.visProp.fillcolor).toLowerCase() === '#dc2626'; })[0];
var arcLibre = courbes.filter(function (c) { return couleur(c) === '#dc2626' && c !== equerre; })[0];
var alphas = courbes.filter(function (c) { return couleur(c) === '#7c3aed'; });
var betas = courbes.filter(function (c) { return couleur(c) === '#0d9488'; });
var trace = courbes.filter(function (c) { return couleur(c) === '#94a3b8'; })[0];
var verdict = textes.filter(function (t) { return String(t.plaintext).indexOf('AMB') >= 0 || String(t.plaintext).indexOf('confondu') >= 0; })[0];
if (!equerre || !arcLibre || alphas.length !== 2 || betas.length !== 2 || !trace || !verdict)
  ko('objets introuvables : équerre ' + !!equerre + ', arc libre ' + !!arcLibre + ', α ' + alphas.length + ', β ' + betas.length + ', trace ' + !!trace + ', verdict ' + !!verdict);

function M() { return Ml.visProp.visible ? Ml : Mc; }
function angleAMB() {
  var m = M(), ax = A.X() - m.X(), ay = A.Y() - m.Y(), bx = B.X() - m.X(), by = B.Y() - m.Y();
  return Math.acos((ax * bx + ay * by) / Math.hypot(ax, ay) / Math.hypot(bx, by)) * 180 / Math.PI;
}
// L'angle balayé par un arc tracé (premier et dernier point, vus du sommet V).
function balayage(c, V) {
  var X = c.dataX, Y = c.dataY, n = X.length;
  var fin = n - 1; while (fin >= 0 && isNaN(X[fin])) fin--;
  if (fin < 1) return NaN;
  var a1 = Math.atan2(Y[0] - V.Y(), X[0] - V.X());
  var a2 = Math.atan2(Y[fin] - V.Y(), X[fin] - V.X());
  var d = Math.abs(a2 - a1); if (d > Math.PI) d = 2 * Math.PI - d;
  return d * 180 / Math.PI;
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
function poser(P, x, y) { P.setPosition(JXG.COORDS_BY_USER, [x, y]); board.update(); }
function pres(a, b, eps) { return Math.abs(a - b) <= (eps || 1e-6); }

/* ------------------------------------------------------------------ */
/* 1. Sur le cercle : toujours rectangle, l'équerre sur les bras       */
/* ------------------------------------------------------------------ */
var R = 4, compte = 0;
if (!err.length) {
  for (var ia = 0; ia < 5; ia++) {
    var ta = ia * 0.7;
    poser(A, R * Math.cos(ta), R * Math.sin(ta));
    if (!pres(B.X(), -A.X(), 1e-9) || !pres(B.Y(), -A.Y(), 1e-9)) ko('B doit être le symétrique de A par rapport à O');
    for (var im = 0; im < 36; im++) {
      var tm = im / 36 * 2 * Math.PI + 0.123;
      poser(Mc, R * Math.cos(tm), R * Math.sin(tm));
      sain('cercle A' + ia + ' M' + im);
      if (!pres(Math.hypot(Mc.X(), Mc.Y()), R, 1e-6)) { ko('M a quitté le cercle'); break; }
      var deg = Math.min(Math.hypot(Mc.X() - A.X(), Mc.Y() - A.Y()), Math.hypot(Mc.X() - B.X(), Mc.Y() - B.Y())) < 0.05;
      var v = String(verdict.plaintext);
      if (deg) { if (v.indexOf('confondu') < 0) ko('M sur A ou B : le verdict devrait le dire (' + v + ')'); continue; }
      var a = angleAMB();
      if (!pres(a, 90, 1e-6)) ko('AMB devrait valoir 90° sur le cercle, trouvé ' + a);
      if (v.indexOf('rectangle') < 0 || v.indexOf('90') < 0) ko('verdict attendu « rectangle », lu : ' + v);
      // L'équerre : trois points, le premier sur [MA), le dernier sur [MB), le coin au bout des deux.
      var X = equerre.dataX, Y = equerre.dataY;
      if (X.length !== 3) { ko('l\'équerre devrait avoir 3 points, en a ' + X.length); continue; }
      var ua = [X[0] - Mc.X(), Y[0] - Mc.Y()], ub = [X[2] - Mc.X(), Y[2] - Mc.Y()];
      var va = [A.X() - Mc.X(), A.Y() - Mc.Y()], vb = [B.X() - Mc.X(), B.Y() - Mc.Y()];
      if (Math.abs(ua[0] * va[1] - ua[1] * va[0]) > 1e-6 || ua[0] * va[0] + ua[1] * va[1] <= 0) ko('le premier bras de l\'équerre n\'est pas sur [MA)');
      if (Math.abs(ub[0] * vb[1] - ub[1] * vb[0]) > 1e-6 || ub[0] * vb[0] + ub[1] * vb[1] <= 0) ko('le second bras de l\'équerre n\'est pas sur [MB)');
      if (!pres(X[1], Mc.X() + ua[0] + ub[0], 1e-9) || !pres(Y[1], Mc.Y() + ua[1] + ub[1], 1e-9)) ko('le coin de l\'équerre n\'est pas au bout des deux bras');
      if (arcLibre.dataX.length) ko('sur le cercle, l\'arc « angle non droit » ne doit pas être tracé');
      compte++;
    }
  }
}

/* ------------------------------------------------------------------ */
/* 2. La démonstration : α = α, β = β, α + β = 90                       */
/* ------------------------------------------------------------------ */
function jouerDemo(nom, pFin) {
  try {
    remiseAZero(); board.update(); sain(nom + ' (départ)');
    steps.forEach(function (s, i) {
      s.step(0.4); board.update(); sain(nom + ' (étape ' + (i + 1) + ', en cours)');
      s.step(1); if (s.after) s.after(); board.update(); sain(nom + ' (étape ' + (i + 1) + ')');
    });
  } catch (e) { ko(nom + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
}
function panneau() { return extras.children.map(function (c) { return c.innerHTML || ''; }).join(''); }
function lignesVisibles(html) {
  var n = 0, re = /<li class="cercle-ligne" style="([^"]*)" data-n="(\d)"/g, m;
  while ((m = re.exec(html))) if (m[1].indexOf('display:none') < 0 && m[2] !== '0') n++;
  return n;
}
if (!err.length) {
  poser(A, -R, 0);
  [0.6, 1.4, 2.0, 2.7, 4.0, 5.2].forEach(function (tm) {
    poser(Mc, R * Math.cos(tm), R * Math.sin(tm));
    bouton('pourquoi').onClick();
    if (!steps || steps.length !== 4) { ko('la démonstration devrait tenir en 4 étapes'); return; }
    remiseAZero(); board.update();
    if (lignesVisibles(panneau()) !== 0) ko('au départ, aucune ligne de la démonstration ne doit être visible');
    if (alphas[0].visProp.strokeopacity > 0 || betas[0].visProp.strokeopacity > 0) ko('au départ, les marques d\'angle doivent être invisibles');
    steps.forEach(function (s, i) {
      s.step(1); if (s.after) s.after(); board.update();
      var html = panneau();
      if (lignesVisibles(html) !== i + 1) ko('après l\'étape ' + (i + 1) + ', ' + (i + 1) + ' ligne(s) attendue(s), ' + lignesVisibles(html) + ' visible(s)');
    });
    // Les marques : α en A et en M balayent le même angle, β aussi, et α + β = 90.
    var aA = balayage(alphas[0], A), aM = balayage(alphas[1], Mc);
    var bB = balayage(betas[0], B), bM = balayage(betas[1], Mc);
    if (isNaN(aA) || isNaN(aM) || isNaN(bB) || isNaN(bM)) { ko('un arc d\'angle est vide après la démonstration'); return; }
    // alphas[0] et alphas[1] : lequel est en A ? Celui dont le premier point est à 0,85 de A.
    var enA = alphas.filter(function (c) { return pres(Math.hypot(c.dataX[0] - A.X(), c.dataY[0] - A.Y()), 0.85, 1e-6); });
    var enM = alphas.filter(function (c) { return pres(Math.hypot(c.dataX[0] - Mc.X(), c.dataY[0] - Mc.Y()), 0.85, 1e-6); });
    if (enA.length !== 1 || enM.length !== 1) { ko('les deux arcs α doivent être l\'un en A, l\'autre en M'); return; }
    var alpha = balayage(enA[0], A), alphaM = balayage(enM[0], Mc);
    var enB = betas.filter(function (c) { return pres(Math.hypot(c.dataX[0] - B.X(), c.dataY[0] - B.Y()), 0.75, 1e-6); });
    var enM2 = betas.filter(function (c) { return pres(Math.hypot(c.dataX[0] - Mc.X(), c.dataY[0] - Mc.Y()), 0.75, 1e-6); });
    if (enB.length !== 1 || enM2.length !== 1) { ko('les deux arcs β doivent être l\'un en B, l\'autre en M'); return; }
    var beta = balayage(enB[0], B), betaM = balayage(enM2[0], Mc);
    if (!pres(alpha, alphaM, 1e-6)) ko('α en A (' + alpha + ') ≠ α en M (' + alphaM + ') : OAM ne serait pas isocèle');
    if (!pres(beta, betaM, 1e-6)) ko('β en B (' + beta + ') ≠ β en M (' + betaM + ') : OBM ne serait pas isocèle');
    if (!pres(alpha + beta, 90, 1e-6)) ko('α + β devrait faire 90°, trouvé ' + (alpha + beta));
    // α est bien l'angle en A du triangle AMB, recalculé à côté.
    var vAB = [B.X() - A.X(), B.Y() - A.Y()], vAM = [Mc.X() - A.X(), Mc.Y() - A.Y()];
    var alphaVrai = Math.acos((vAB[0] * vAM[0] + vAB[1] * vAM[1]) / Math.hypot(vAB[0], vAB[1]) / Math.hypot(vAM[0], vAM[1])) * 180 / Math.PI;
    if (!pres(alpha, alphaVrai, 1e-6)) ko('l\'arc α ne mesure pas l\'angle MAB (' + alpha + ' vs ' + alphaVrai + ')');
    var html = panneau();
    if (html.indexOf('α + β = 90°') < 0 || html.indexOf('rectangle en M') < 0) ko('la conclusion doit être écrite au panneau');
    if (html.indexOf('OA = OB = OM = R') < 0) ko('le panneau doit rappeler l\'égalité des rayons');
    // Rejeu à l'identique après « Précédent » : remise à zéro puis trois étapes.
    remiseAZero(); steps[0].step(1); steps[0].after(); steps[1].step(1); steps[1].after(); steps[2].step(1); steps[2].after(); board.update();
    if (lignesVisibles(panneau()) !== 3) ko('« Précédent » depuis la fin devrait laisser 3 lignes');
    if (!pres(betas[0].visProp.strokeopacity, 1)) ko('après 3 étapes les arcs β doivent être pleins');
    jouerDemo('rejeu');
  });
}

/* ------------------------------------------------------------------ */
/* 3. Le tour de M : la trace garde chaque triangle, M revient         */
/* ------------------------------------------------------------------ */
if (!err.length) {
  poser(A, -R, 0);
  poser(Mc, R * Math.cos(1.0), R * Math.sin(1.0));
  var x0 = Mc.X(), y0 = Mc.Y();
  bouton('tour').onClick();
  if (!steps || steps.length !== 1) ko('le tour devrait être une seule étape');
  else {
    [0.25, 0.5, 0.75, 1].forEach(function (p) {
      steps[0].step(p); board.update(); sain('tour ' + p);
      var nTri = 0, X = trace.dataX;
      for (var i = 0; i + 3 < X.length; i += 4) { if (pres(X[i], A.X(), 1e-9)) nTri++; }   // chaque triangle commence en A
      var attendu = Math.floor(36 * p + 1e-9);
      if (nTri !== attendu) ko('à ' + p + ' du tour, ' + attendu + ' triangles attendus dans la trace, ' + nTri);
      if (!pres(Math.hypot(Mc.X(), Mc.Y()), R, 1e-6)) ko('pendant le tour M doit rester sur le cercle');
      var t = 1.0 + p * 2 * Math.PI;
      if (!pres(Mc.X(), R * Math.cos(t), 1e-6) || !pres(Mc.Y(), R * Math.sin(t), 1e-6)) ko('à ' + p + ' du tour, M n\'est pas à l\'angle attendu');
      if (!A.visProp.fixed && p < 1) ko('pendant le tour, A doit être bloqué');
      var v = String(verdict.plaintext);
      var deg = Math.min(Math.hypot(Mc.X() - A.X(), Mc.Y() - A.Y()), Math.hypot(Mc.X() - B.X(), Mc.Y() - B.Y())) < 0.05;
      if (!deg && v.indexOf('rectangle') < 0) ko('pendant le tour le verdict doit rester « rectangle » (' + v + ')');
    });
    steps[0].after(); board.update();
    if (A.visProp.fixed) ko('le tour fini, A doit redevenir déplaçable');
    remiseAZero(); board.update();
    if (trace.dataX.length) ko('après remise à zéro, la trace doit être vide');
    if (!pres(Mc.X(), x0, 1e-6) || !pres(Mc.Y(), y0, 1e-6)) ko('après remise à zéro, M doit être revenu au départ');
  }
}

/* ------------------------------------------------------------------ */
/* 4. M libre : obtus dedans, aigu dehors, droit sur le cercle         */
/* ------------------------------------------------------------------ */
if (!err.length) {
  poser(A, -R, 0);
  bouton('libre').onChange(true);
  board.update();
  if (!Ml.visProp.visible || Mc.visProp.visible) ko('en mode libre, c\'est M libre qui doit être visible');
  if (!refs.libre.checked) ko('la case « M libre » doit se cocher');
  if (steps) ko('passer en mode libre doit annuler l\'animation en cours');
  var cas = [
    { x: 0.5, y: 1.0, pos: 'intérieur', obtus: true },
    { x: -2, y: -1.5, pos: 'intérieur', obtus: true },
    { x: 0, y: 6, pos: 'extérieur', obtus: false },
    { x: 5, y: 3, pos: 'extérieur', obtus: false },
    { x: R * Math.cos(2.2), y: R * Math.sin(2.2), pos: 'rectangle', obtus: null },
    { x: R * Math.cos(-0.8), y: R * Math.sin(-0.8), pos: 'rectangle', obtus: null }
  ];
  cas.forEach(function (c) {
    poser(Ml, c.x, c.y); sain('libre ' + c.pos);
    var v = String(verdict.plaintext), a = angleAMB();
    if (v.indexOf(c.pos) < 0) ko('M en (' + c.x + ' ; ' + c.y + ') : verdict « ' + c.pos + ' » attendu, lu : ' + v);
    var affiche = parseFloat(v.replace(/^AMB = /, '').replace(',', '.'));
    if (!pres(affiche, a, 0.051)) ko('l\'angle affiché (' + affiche + ') ne colle pas à l\'angle recalculé (' + a + ')');
    if (c.obtus === true && !(a > 90)) ko('dedans, l\'angle devrait être obtus (' + a + ')');
    if (c.obtus === false && !(a < 90)) ko('dehors, l\'angle devrait être aigu (' + a + ')');
    if (c.obtus === null && !pres(a, 90, 1e-6)) ko('sur le cercle, l\'angle devrait être droit (' + a + ')');
    if (c.obtus === null) { if (equerre.dataX.length !== 3 || arcLibre.dataX.length) ko('sur le cercle : équerre oui, arc non'); }
    else { if (equerre.dataX.length || !arcLibre.dataX.length) ko('hors du cercle : arc oui, équerre non'); }
    var html = panneau();
    if (html.indexOf('Réciproque') < 0 || html.indexOf('milieu de l\'hypoténuse') < 0) ko('le panneau du mode libre doit énoncer la réciproque');
    if (alphas[0].visProp.strokeopacity > 0 || betas[0].visProp.strokeopacity > 0) ko('en mode libre, les marques de la démonstration doivent être cachées');
  });
  // Retour sur le cercle : la démonstration redevient jouable.
  bouton('libre').onChange(false); board.update();
  if (Ml.visProp.visible || !Mc.visProp.visible) ko('hors du mode libre, c\'est M sur le cercle qui doit être visible');
  bouton('pourquoi').onClick();
  if (!steps || steps.length !== 4) ko('après le mode libre, « Pourquoi ? » doit relancer la démonstration');
  else jouerDemo('après libre');
  // « Pourquoi ? » depuis le mode libre doit en sortir tout seul.
  bouton('libre').onChange(true); board.update();
  bouton('pourquoi').onClick();
  if (Ml.visProp.visible || !refs.libre.checked === true) { /* la case suit l'état */ }
  if (Ml.visProp.visible) ko('« Pourquoi ? » doit ramener M sur le cercle');
  if (refs.libre.checked) ko('« Pourquoi ? » doit décocher la case « M libre »');
  bouton('reset').onClick(); board.update(); sain('reset');
}
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('ANGLE DROIT VÉRIFIÉ SUR ' + compte + ' POSITIONS, α = α ET β = β AVEC α + β = 90°, TOUR ET RÉCIPROQUE CONFORMES, AUCUNE EXCEPTION');
