/*
 * La leçon « Convertir des durées » (5ème), montée avec le VRAI JSXGraph.
 *
 * Le contrôle lecon-durees rejoue la logique dans un JSXGraph de fortune, qui
 * n'évalue ni les courbes (les graduations, les secteurs balayés) ni les
 * contenus fonctionnels des textes. Ici la leçon est montée pour de bon
 * (renderer « no » : toute la logique, aucun dessin), puis les neuf
 * préréglages, le principe des cadrans et vingt tirages sont joués jusqu'au
 * bout avec de vrais board.update(). Aucune coordonnée infinie ou NaN ne doit
 * atteindre le moteur — ni dans les points, ni dans les secteurs. La moindre
 * exception est un échec.
 */var window = this;
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
/* Un DOM de poche, juste assez fidèle pour JSXGraph et fiches.js      */
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

/* Le conteneur que fiches.js remplit. */
var conteneur = fauxEl('div'); conteneur.id = 'lesson-fiche';

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
load('lessons/5eme/durees.js');


var err = [];
function ko(m) { if (err.length < 15) err.push(m); }

var boardEl = fauxEl('div'); boardEl.id = 'board-test';
var extras = fauxEl('div'); extras.id = 'lesson-extras';
var opts = {}; for (var k in LECON.board) opts[k] = LECON.board[k];
var board = JXG.JSXGraph.initBoard('board-test', opts);

var steps = null, remiseAZero = null, controles = null;
var mv = {
  hideBoard: function () {}, typeset: function () {}, onCleanup: function () {},
  extras: extras, addControls: function (c) { controles = c; return {}; },
  createAnimator: function () { return { cancel: function () {},
    runSteps: function (s, r) { steps = s; remiseAZero = r; } }; }
};
try { LECON.setup(board, mv); }
catch (e) { ko('setup() plante : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }

function parClasse(cls) {
  var out = [];
  (function walk(e) { if (e.className && e.className.split(' ').indexOf(cls) >= 0) out.push(e); (e.children || []).forEach(walk); })(extras);
  return out;
}
var presets = parClasse('ineq-preset'), boutons = parClasse('eq-rand');
if (!steps) ko('runSteps jamais appelé : setup() s\'est arrêté avant l\'animation');
if (presets.length !== 9) ko('9 préréglages attendus, ' + presets.length);
if (boutons.length !== 2) ko('les deux boutons de la saisie manquent');
function bouton(id) { return (controles || []).filter(function (c) { return c.id === id; })[0]; }
if (!bouton('tout') || !bouton('principe') || !bouton('play')) ko('il manque un bouton de contrôle');

function sain(nom) {
  board.objectsList.forEach(function (o) {
    if (o.elType === 'point' && o.coords) {
      var u = o.coords.usrCoords;
      if (!isFinite(u[1]) || !isFinite(u[2])) ko(nom + ' : un point a des coordonnées ' + u[1] + ' ; ' + u[2]);
    }
    if (o.elType === 'curve' && o.dataX) {
      for (var i = 0; i < o.dataX.length; i++) {
        // NaN sépare volontairement les graduations ; l'infini, lui, n'a rien à faire là
        if (o.dataX[i] === Infinity || o.dataX[i] === -Infinity || o.dataY[i] === Infinity || o.dataY[i] === -Infinity)
          ko(nom + ' : une courbe a une coordonnée infinie');
      }
    }
  });
}
function jouer(nom) {
  try {
    remiseAZero(); board.update(); sain(nom + ' (départ)');
    steps.forEach(function (s, i) {
      s.step(0.3); board.update(); sain(nom + ' (étape ' + (i + 1) + ', en cours)');
      s.step(1); s.after(); board.update(); sain(nom + ' (étape ' + (i + 1) + ')');
    });
  } catch (e) { ko(nom + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
}
if (!err.length) {
  presets.forEach(function (bt, i) { bt.onclick(); jouer('préréglage ' + (i + 1)); });
  bouton('principe').onClick(); jouer('principe');
  if (steps.length !== 4) ko('le principe devrait tenir en 4 étapes');
  for (var t = 0; t < 20; t++) { boutons[1].onclick(); jouer('dé ' + t); }
  presets[0].onclick(); bouton('tout').onClick(); board.update(); sain('tout afficher');
  bouton('play').onClick(); jouer('rejouer');
}
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LA LEÇON SE MONTE AVEC LE VRAI JSXGRAPH ET SE JOUE JUSQU\'AU BOUT SANS EXCEPTION');
