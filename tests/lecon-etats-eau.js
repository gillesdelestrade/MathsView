/*
 * La leçon « Les trois états de l'eau » (5ème, physique-chimie), montée avec
 * le VRAI JSXGraph (renderer « no »).
 *
 * L'état de l'eau est LU sur les molécules dessinées, sans rien demander à la
 * leçon : serrées et rangées en grille, c'est un solide ; serrées mais en
 * désordre, un liquide ; dispersées dans toute la boîte, un gaz. Ce verdict
 * doit coïncider avec le titre de la boîte, le nœud surligné du triangle et
 * la flèche active — dont on vérifie qu'elle relie bien les deux bons états.
 * Le thermomètre est remesuré sur sa colonne : en chauffant il monte, puis
 * fait un palier à 0 °C pendant toute la fusion et à 100 °C pendant toute la
 * vaporisation ; en refroidissant, l'inverse. Le curseur reste sur la courbe.
 */
var window = this;
var tics = [];
window.setTimeout = function (f) { return 0; };
window.clearTimeout = function () {};
window.setInterval = function (f) { tics.push(f); return tics.length; };
window.clearInterval = function () {};
var setInterval = window.setInterval, clearInterval = window.clearInterval;
window.requestAnimationFrame = function (f) { return 0; };
window.addEventListener = function () {};
window.removeEventListener = function () {};
window.navigator = { userAgent: 'jsc', platform: 'mac' };
window.location = { hash: '', href: '' };
window.innerWidth = 1200; window.innerHeight = 800;
window.devicePixelRatio = 1;

/* ------------------------------------------------------------------ */
/* Un DOM de poche, juste assez fidèle pour JSXGraph                   */
/* ------------------------------------------------------------------ */
var parId = {};
function fauxEl(tag) {
  var e = {
    tagName: String(tag).toUpperCase(), nodeName: String(tag).toUpperCase(),
    className: '', _id: '', _html: '', children: [], childNodes: [], style: {},
    dataset: {}, attributes: {}, ownerDocument: null, parentNode: null,
    offsetWidth: 640, offsetHeight: 480, clientWidth: 640, clientHeight: 480,
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
    getBoundingClientRect: function () { return { left: 0, top: 0, width: 640, height: 480, right: 640, bottom: 480 }; },
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
body.classList.add = function () {};
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
var erreursConsole = [], avertissements = [];
var console = { log: function () {}, warn: function (m) { avertissements.push(String(m)); }, error: function (m) { erreursConsole.push(String(m)); } };
load('js/app.js');
var LECON = null;
var registerVrai = MathsView.register;
MathsView.register = function (l) { LECON = l; registerVrai(l); };
load('lessons/pc/5eme/etats-eau.js');

var err = [];
function ko(m) { if (err.length < 25) err.push(m); }

if (!LECON) { print('ÉCHEC : la leçon ne s\'enregistre pas'); throw new Error('register'); }
if (LECON.matiere !== 'pc' || LECON.category !== 'chimie' || LECON.level !== '5eme')
  ko('la leçon doit être en physique-chimie (pc), domaine chimie, niveau 5ème');
if (avertissements.length) ko('le moteur se plaint de la déclaration : ' + avertissements[0]);

var boardEl = fauxEl('div'); boardEl.id = 'board-test';
var extras = fauxEl('div'); extras.id = 'lesson-extras';
var opts = {}; for (var k in LECON.board) opts[k] = LECON.board[k];
var board = JXG.JSXGraph.initBoard('board-test', opts);

var steps = null, remiseAZero = null, controles = null, refs = {}, nettoyages = [];
var mv = {
  hideBoard: function () {}, typeset: function () {}, onCleanup: function (f) { nettoyages.push(f); },
  extras: extras,
  addControls: function (c) {
    controles = c;
    c.forEach(function (s) { var e = fauxEl(s.type === 'button' ? 'button' : 'input'); refs[s.id] = e; });
    return refs;
  },
  createAnimator: function () { return { cancel: function () { steps = null; },
    runSteps: function (s, r) { steps = s; remiseAZero = r; } }; }
};
try { LECON.setup(board, mv); }
catch (e) { ko('setup() plante : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }

/* ------------------------------------------------------------------ */
/* Lecture de l'interface et de la figure                              */
/* ------------------------------------------------------------------ */
function parClasse(cls) {
  var out = [];
  (function walk(e) { if (e.className && e.className.split(' ').indexOf(cls) >= 0) out.push(e); (e.children || []).forEach(walk); })(extras);
  return out;
}
var chips = parClasse('ineq-preset');
var panneau = parClasse('props-panel')[0];
function controle(id) { return (controles || []).filter(function (c) { return c.id === id; })[0]; }
function html() { return panneau ? panneau.innerHTML : ''; }
function chip(nom) { return chips.filter(function (c) { c.textContent = c.textContent || ''; return c.textContent.indexOf(nom) >= 0; })[0]; }

var NOMS = ['fusion', 'solidification', 'vaporisation', 'liquéfaction', 'sublimation', 'condensation'];
if (chips.length !== 6) ko('six changements d\'état attendus, ' + chips.length + ' pastilles');
NOMS.forEach(function (n) { if (!chip(n)) ko('pas de pastille « ' + n + ' »'); });
if (!panneau) ko('le panneau manque');
if (!controle('chauffer') || !controle('refroidir') || !controle('reset')) ko('il manque un bouton (chauffer, refroidir, reset)');
if (!steps || steps.length !== 5) ko('au chargement, les cinq étapes du chauffage doivent être prêtes (' + (steps ? steps.length : 'aucune') + ')');
if (tics.length !== 1) ko('une horloge de vibration attendue, ' + tics.length);
if (nettoyages.length !== 1) ko('l\'horloge doit être arrêtée au départ de la leçon (onCleanup)');

/* La géométrie, telle que la figure l'expose. */
var BOITE = { x1: 1.0, x2: 7.4, y1: 0.3, y2: 5.9 };
var NOEUD = { solide: [-6.3, -3.6], liquide: [-1.7, -3.6], gaz: [-4, 2.4] };
var THERMO = { y1: -0.6, y2: 5.6 };
function vis(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }

function figure() {
  var F = { molecules: [], fleches: [], noeuds: {}, textes: {} };
  board.objectsList.forEach(function (o) {
    if (o.elType === 'point' && vis(o)) {
      var x = o.X(), y = o.Y();
      if (x >= BOITE.x1 && x <= BOITE.x2 && y >= BOITE.y1 && y <= BOITE.y2 && o.visProp.size === 4) F.molecules.push({ x: x, y: y });
      else if (y < -0.5 && x > 1) F.curseur = { x: x, y: y };
    }
    if (o.elType === 'arrow' && o.point1 && o.point2) {
      var p1 = [o.point1.X(), o.point1.Y()], p2 = [o.point2.X(), o.point2.Y()];
      if (p1[0] < 0 && p2[0] < 0) F.fleches.push({ de: noeudPres(p1), a: noeudPres(p2), largeur: o.visProp.strokewidth, col: String(o.visProp.strokecolor) });
    }
    if (o.elType === 'circle' && o.center && o.center.X() < 0) {
      var n = noeudPres([o.center.X(), o.center.Y()]);
      if (n) F.noeuds[n] = o.visProp.strokewidth;
    }
    if (o.elType === 'curve' && o.dataX && o.dataX.length === 5 && o.dataX[0] > -0.2 && o.dataX[0] < 0.2 && vis(o)) {
      // la colonne du thermomètre : son sommet donne la température
      var haut = Math.max.apply(null, o.dataY);
      F.T = (haut - THERMO.y1) / (THERMO.y2 - THERMO.y1) * 140 - 20;
    }
    if (o.elType === 'curve' && o.dataX && o.dataX.length === 6 && o.dataX[0] > 1 && String(o.visProp.strokecolor) === '#dc2626') F.courbe = { X: o.dataX.slice(), Y: o.dataY.slice() };
    if (o.elType === 'text') {
      var t = String(o.plaintext || '');
      if (/^Molécules d'eau|^(fusion|solidification|vaporisation|liquéfaction|sublimation|condensation)( terminée)? : /.test(t)) F.textes.boite = t;
      else if (/°C$/.test(t) && o.X() > 7 && o.Y() < -1) F.textes.T = t;
    }
  });
  return F;
}
function noeudPres(p) {
  var best = null, d = 1.6;
  Object.keys(NOEUD).forEach(function (k) { var dd = Math.hypot(p[0] - NOEUD[k][0], p[1] - NOEUD[k][1]); if (dd < d) { d = dd; best = k; } });
  return best;
}
/* L'état, lu sur les molécules. */
function etatLu(F) {
  var M = F.molecules;
  if (M.length !== 36) return 'molécules : ' + M.length;
  var ys = M.map(function (m) { return m.y; });
  var etal = Math.max.apply(null, ys) - Math.min.apply(null, ys);
  var dists = M.map(function (m) {
    var best = 1e9;
    M.forEach(function (n) { if (n !== m) best = Math.min(best, Math.hypot(n.x - m.x, n.y - m.y)); });
    return best;
  });
  var moy = dists.reduce(function (s, d) { return s + d; }, 0) / dists.length;
  var ecart = Math.sqrt(dists.reduce(function (s, d) { return s + (d - moy) * (d - moy); }, 0) / dists.length);
  if (etal > 4.0) return 'gaz';
  if (ecart < 0.1) return 'solide';
  return 'liquide';
}
function flecheActive(F) {
  var act = F.fleches.filter(function (f) { return f.largeur >= 4; });
  if (act.length > 1) ko('plusieurs flèches actives à la fois');
  return act[0] || null;
}
function noeudActif(F) {
  var out = Object.keys(F.noeuds).filter(function (k) { return F.noeuds[k] >= 4; });
  return out.length === 1 ? out[0] : (out.length ? 'plusieurs' : null);
}
function surCourbe(F) {
  if (!F.curseur || !F.courbe) return false;
  for (var i = 0; i < 5; i++) {
    var x0 = F.courbe.X[i], x1 = F.courbe.X[i + 1], y0 = F.courbe.Y[i], y1 = F.courbe.Y[i + 1];
    if (F.curseur.x < x0 - 1e-6 || F.curseur.x > x1 + 1e-6) continue;
    var t = x1 === x0 ? 0 : (F.curseur.x - x0) / (x1 - x0);
    if (Math.abs(y0 + (y1 - y0) * t - F.curseur.y) < 1e-6) return true;
  }
  return false;
}
function sain(nom) {
  board.objectsList.forEach(function (o) {
    if (o.elType === 'point' && o.coords) {
      var u = o.coords.usrCoords;
      if (!isFinite(u[1]) || !isFinite(u[2])) ko(nom + ' : un point a des coordonnées ' + u[1] + ' ; ' + u[2]);
    }
  });
}
function fmtT(t) { return (t < 0 ? '−' : '') + Math.abs(Math.round(t)) + ' °C'; }

/* ------------------------------------------------------------------ */
/* 1. Chauffer, puis refroidir : les paliers                           */
/* ------------------------------------------------------------------ */
var joues = 0;
function courbe(nomMode, bouton, attendus) {
  var nom = nomMode;
  controle(bouton).onClick();
  if (!steps || steps.length !== 5) { ko(nom + ' : cinq étapes attendues'); return; }
  try {
    remiseAZero(); board.update(); sain(nom + ' (départ)');
    var F = figure(), e = etatLu(F);
    if (e !== attendus[0].avant) ko(nom + ' au départ : molécules en ' + e + ', attendu ' + attendus[0].avant);
    if (Math.abs(F.T - attendus[0].T0) > 0.5) ko(nom + ' au départ : thermomètre à ' + F.T.toFixed(1) + ', attendu ' + attendus[0].T0);
    if (!F.curseur) ko(nom + ' : le curseur de la courbe doit être visible');
    var xPrec = F.curseur ? F.curseur.x : 0;
    attendus.forEach(function (at, i) {
      var s = steps[i];
      s.step(0.5); board.update(); sain(nom + ' étape ' + (i + 1) + ' à mi-course');
      F = figure();
      if (!surCourbe(F)) ko(nom + ' étape ' + (i + 1) + ' : le curseur a quitté la courbe (' + (F.curseur ? F.curseur.x.toFixed(2) + ' ; ' + F.curseur.y.toFixed(2) : 'absent') + ')');
      if (at.palier) {
        // Pendant tout le changement d'état, le thermomètre ne bouge pas.
        if (Math.abs(F.T - at.T0) > 0.5) ko(nom + ' étape ' + (i + 1) + ' : pendant la ' + at.nom + ', le thermomètre devrait rester à ' + at.T0 + ' °C, il lit ' + F.T.toFixed(1));
        var fl = flecheActive(F);
        if (!fl) ko(nom + ' étape ' + (i + 1) + ' : la flèche « ' + at.nom + ' » devrait être active');
        else if (fl.de !== at.avant || fl.a !== at.apres) ko(nom + ' étape ' + (i + 1) + ' : la flèche active va de ' + fl.de + ' à ' + fl.a + ', attendu ' + at.avant + ' → ' + at.apres);
        if (!/18 en .* 18 en /.test(F.textes.boite || '')) ko(nom + ' étape ' + (i + 1) + ' : à mi-course, 18 molécules de chaque côté attendues, titre « ' + F.textes.boite + ' »');
        if (!/palier/i.test(html())) ko(nom + ' étape ' + (i + 1) + ' : le panneau doit parler de palier');
      } else {
        var Tmi = (at.T0 + at.T1) / 2;
        if (Math.abs(F.T - Tmi) > 0.5) ko(nom + ' étape ' + (i + 1) + ' : à mi-course le thermomètre devrait lire ' + Tmi + ' °C, il lit ' + F.T.toFixed(1));
        if (flecheActive(F)) ko(nom + ' étape ' + (i + 1) + ' : aucune flèche active quand on ne change pas d\'état');
      }
      s.step(1); s.after(); board.update(); sain(nom + ' étape ' + (i + 1));
      F = figure(); e = etatLu(F);
      if (e !== at.apres) ko(nom + ' étape ' + (i + 1) + ' : molécules en ' + e + ', attendu ' + at.apres);
      if (Math.abs(F.T - at.T1) > 0.5) ko(nom + ' étape ' + (i + 1) + ' : thermomètre à ' + F.T.toFixed(1) + ', attendu ' + at.T1);
      if ((F.textes.T || '') !== fmtT(at.T1)) ko(nom + ' étape ' + (i + 1) + ' : la lecture « ' + F.textes.T + ' » devrait être « ' + fmtT(at.T1) + ' »');
      if (noeudActif(F) !== at.apres) ko(nom + ' étape ' + (i + 1) + ' : le nœud surligné est ' + noeudActif(F) + ', attendu ' + at.apres);
      if (!surCourbe(F)) ko(nom + ' étape ' + (i + 1) + ' : le curseur a quitté la courbe');
      if (F.curseur) {
        if (nomMode === 'chauffer' ? F.curseur.x < xPrec - 1e-9 : F.curseur.x > xPrec + 1e-9) ko(nom + ' étape ' + (i + 1) + ' : le curseur recule');
        xPrec = F.curseur.x;
      }
      var lignes = (html().match(/<li/g) || []).length;
      if (lignes !== i + 1) ko(nom + ' étape ' + (i + 1) + ' : ' + lignes + ' ligne(s) au panneau, attendu ' + (i + 1));
      joues++;
    });
  } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
}
if (!err.length) {
  courbe('chauffer', 'chauffer', [
    { avant: 'solide', apres: 'solide', T0: -20, T1: 0 },
    { avant: 'solide', apres: 'liquide', T0: 0, T1: 0, palier: true, nom: 'fusion' },
    { avant: 'liquide', apres: 'liquide', T0: 0, T1: 100 },
    { avant: 'liquide', apres: 'gaz', T0: 100, T1: 100, palier: true, nom: 'vaporisation' },
    { avant: 'gaz', apres: 'gaz', T0: 100, T1: 120 }
  ]);
  courbe('refroidir', 'refroidir', [
    { avant: 'gaz', apres: 'gaz', T0: 120, T1: 100 },
    { avant: 'gaz', apres: 'liquide', T0: 100, T1: 100, palier: true, nom: 'liquéfaction' },
    { avant: 'liquide', apres: 'liquide', T0: 100, T1: 0 },
    { avant: 'liquide', apres: 'solide', T0: 0, T1: 0, palier: true, nom: 'solidification' },
    { avant: 'solide', apres: 'solide', T0: 0, T1: -20 }
  ]);
}

/* ------------------------------------------------------------------ */
/* 2. Chaque changement d'état, seul, à sa température                 */
/* ------------------------------------------------------------------ */
var TRANS = {
  'fusion': ['solide', 'liquide', 0, '0 °C'], 'solidification': ['liquide', 'solide', 0, '0 °C'],
  'vaporisation': ['liquide', 'gaz', 100, '100 °C'], 'liquéfaction': ['gaz', 'liquide', 100, '100 °C'],
  'sublimation': ['solide', 'gaz', -10, 'en dessous de 0 °C'], 'condensation': ['gaz', 'solide', -10, 'en dessous de 0 °C']
};
if (!err.length) {
  NOMS.forEach(function (n) {
    var at = TRANS[n], nom = n;
    chip(n).onclick();
    if (!steps || steps.length !== 1) { ko(nom + ' : une seule étape attendue'); return; }
    try {
      remiseAZero(); board.update();
      var F = figure(), e = etatLu(F);
      if (e !== at[0]) ko(nom + ' au départ : molécules en ' + e + ', attendu ' + at[0]);
      if (Math.abs(F.T - at[2]) > 0.5) ko(nom + ' : thermomètre à ' + F.T.toFixed(1) + ', attendu ' + at[2]);
      if (F.curseur) ko(nom + ' : pas de curseur sur la courbe pour un changement d\'état isolé');
      var fl = flecheActive(F);
      if (!fl) ko(nom + ' : la flèche doit être active dès le départ');
      else if (fl.de !== at[0] || fl.a !== at[1]) ko(nom + ' : la flèche active va de ' + fl.de + ' à ' + fl.a);
      steps[0].step(0.5); board.update();
      F = figure();
      if (Math.abs(F.T - at[2]) > 0.5) ko(nom + ' : la température ne doit pas bouger pendant le changement d\'état');
      if (!/18 en .* 18 en /.test(F.textes.boite || '')) ko(nom + ' à mi-course : 18 molécules de chaque côté attendues (« ' + F.textes.boite + ' »)');
      steps[0].step(1); steps[0].after(); board.update();
      F = figure(); e = etatLu(F);
      if (e !== at[1]) ko(nom + ' à la fin : molécules en ' + e + ', attendu ' + at[1]);
      if (noeudActif(F) !== at[1]) ko(nom + ' à la fin : nœud surligné ' + noeudActif(F));
      if (!/terminée/.test(F.textes.boite || '')) ko(nom + ' à la fin : le titre de la boîte devrait dire « terminée »');
      [n, at[3], 'ne change pas', 'Dans la vie'].forEach(function (m) { if (html().indexOf(m) < 0) ko(nom + ' : le panneau devrait contenir « ' + m + ' »'); });
      if (chip(n).className.indexOf('active') < 0) ko(nom + ' : sa pastille doit être active');
      joues++;
    } catch (ex) { ko(nom + ' : ' + ex + (ex.stack ? ' — ' + String(ex.stack).split('\n')[0] : '')); }
  });
}

/* ------------------------------------------------------------------ */
/* 3. Les vibrations : à peine en solide, beaucoup en gaz, dans la boîte */
/* ------------------------------------------------------------------ */
function bouge(nTics) {
  var avant = figure().molecules, total = 0;
  for (var k = 0; k < nTics; k++) tics[0]();
  var apres = figure().molecules;
  if (apres.length !== 36 || avant.length !== 36) { ko('vibrations : ' + apres.length + ' molécules visibles'); return 0; }
  for (var i = 0; i < 36; i++) total += Math.hypot(apres[i].x - avant[i].x, apres[i].y - avant[i].y);
  apres.forEach(function (m) { if (m.x < BOITE.x1 || m.x > BOITE.x2 || m.y < BOITE.y1 || m.y > BOITE.y2) ko('une molécule vibre hors de la boîte'); });
  return total / 36;
}
if (!err.length) {
  chip('sublimation').onclick(); remiseAZero(); steps[0].step(1); steps[0].after(); board.update();
  var dGaz = bouge(3);
  if (etatLu(figure()) !== 'gaz') ko('après vibrations, le gaz doit toujours se lire comme un gaz');
  controle('reset').onClick();
  var dSol = bouge(3);
  if (etatLu(figure()) !== 'solide') ko('après vibrations, le solide doit toujours se lire comme un solide');
  if (!(dSol > 0)) ko('en solide, les molécules vibrent quand même un peu');
  if (!(dGaz > 3 * dSol)) ko('en gaz, les molécules doivent bouger bien plus qu\'en solide (' + dGaz.toFixed(3) + ' contre ' + dSol.toFixed(3) + ')');
}

/* ------------------------------------------------------------------ */
/* 4. Rejouer redonne la même figure                                   */
/* ------------------------------------------------------------------ */
function instantane() {
  return JSON.stringify(figure().molecules.map(function (m) { return [+m.x.toFixed(6), +m.y.toFixed(6)]; }));
}
if (!err.length) {
  controle('chauffer').onClick(); remiseAZero();
  steps.forEach(function (s) { s.step(1); s.after(); }); board.update();
  var a = instantane();
  chip('condensation').onclick(); remiseAZero(); steps[0].step(1); steps[0].after(); board.update();
  controle('chauffer').onClick(); remiseAZero();
  steps.forEach(function (s) { s.step(1); s.after(); }); board.update();
  if (a !== instantane()) ko('rejouer le chauffage ne redonne pas la même figure');
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('L\'ÉTAT SE LIT SUR LES MOLÉCULES, LE THERMOMÈTRE FAIT SES DEUX PALIERS, LES SIX FLÈCHES RELIENT LES BONS ÉTATS (' + joues + ' ÉTAPES JOUÉES)');
