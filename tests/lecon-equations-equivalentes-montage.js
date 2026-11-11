/*
 * La leçon « Équations équivalentes » (2nde), montée avec le VRAI JSXGraph.
 *
 * Le contrôle lecon-equations-equivalentes rejoue la logique dans un JSXGraph
 * de fortune, qui n'évalue jamais les contenus fonctionnels. Ici la leçon est
 * montée pour de bon (renderer « no » : toute la logique, aucun dessin) : les
 * trois volets, chacun de leurs préréglages, le curseur d'un bout à l'autre
 * dans les deux genres d'opération (zéro compris : × 0 et ÷ 0), un tirage par
 * volet et le point déplacé, avec de vrais board.update(). La moindre
 * exception est un échec, et aucune coordonnée infinie ne doit atteindre le
 * moteur.
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
load('lessons/2nde/equations-equivalentes.js');

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
var volets = parClasse('eqv-volet'), cas = parClasse('eqv-cas'), genres = parClasse('eqv-genre');
var curseur = parClasse('eqv-k')[0], rands = parClasse('eq-rand');
if (!steps) ko('runSteps jamais appelé : setup() s\'est arrêté avant l\'animation');
if (volets.length !== 3) ko('3 volets attendus, ' + volets.length);
if (cas.length !== 13) ko('13 préréglages attendus (4 + 5 + 4), ' + cas.length);
if (genres.length !== 2 || !curseur || rands.length !== 1) ko('les deux genres, le curseur et le dé sont attendus');

function sain(nom) {
  board.objectsList.forEach(function (o) {
    if (o.elType !== 'point') return;
    if (!isFinite(o.X()) || !isFinite(o.Y())) ko(nom + ' : un point a une coordonnée infinie (' + o.X() + ' ; ' + o.Y() + ')');
  });
}
function jouer(nom) {
  try {
    remiseAZero(); board.update();
    steps.forEach(function (s) { s.step(0.4); board.update(); s.step(1); s.after(); board.update(); });
    sain(nom);
  } catch (e) { ko(nom + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
}
var pts = board.objectsList.filter(function (o) { return o.elType === 'point' && o.getAttribute('size') === 6 && o.getAttribute('fixed') === false; });
if (pts.length !== 1) ko('un seul point libre attendu, ' + pts.length);
var joues = 0;
if (!err.length) {
  var parVolet = [cas.slice(0, 4), cas.slice(4, 9), cas.slice(9, 13)];
  volets.forEach(function (v, iv) {
    try { v.onclick(); } catch (e) { ko('volet ' + (iv + 1) + ' : ' + e); return; }
    jouer('volet ' + (iv + 1));
    parVolet[iv].forEach(function (bt, i) {
      try { bt.onclick(); } catch (e) { ko('volet ' + (iv + 1) + ', préréglage ' + (i + 1) + ' : ' + e); return; }
      jouer('volet ' + (iv + 1) + ', préréglage ' + (i + 1)); joues++;
      if (iv === 2) return;
      // le curseur, d'un bout à l'autre, dans les deux genres
      genres.forEach(function (g, ig) {
        try {
          g.onclick(); board.update();
          for (var k = -6; k <= 6; k++) { curseur.value = String(k); curseur.oninput(); board.update(); sain('curseur ' + k); joues++; }
        } catch (e) { ko('volet ' + (iv + 1) + ', préréglage ' + (i + 1) + ', genre ' + (ig + 1) + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
      });
    });
    if (iv < 2) { try { rands[0].onclick(); } catch (e) { ko('dé du volet ' + (iv + 1) + ' : ' + e); } jouer('dé du volet ' + (iv + 1)); }
    try {
      pts[0].setPosition(JXG.COORDS_BY_USER, [1.5, 0]);
      pts[0].triggerEventHandlers(['drag'], [{}]);
      board.update();
    } catch (e) { ko('glissement du point, volet ' + (iv + 1) + ' : ' + e); }
  });
}
if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('LA LEÇON SE MONTE AVEC LE VRAI JSXGRAPH : 3 volets, ' + joues + ' états joués, curseur et dé compris, sans exception');
