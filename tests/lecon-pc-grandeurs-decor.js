/*
 * Le décor commun aux contrôles des leçons « masse », « volume » et « masse
 * volumique » (5ème, physique-chimie) : un DOM de poche juste assez fidèle
 * pour JSXGraph, le vrai JSXGraph sans dessin (renderer « no »), le moteur,
 * puis `monter(fichier)` qui enregistre la leçon, lance son setup() avec un
 * `mv` factice et rend ce qu'il faut pour la piloter : les étapes de
 * l'animateur, la remise à zéro, les contrôles, les pastilles et le panneau.
 *
 * Ce fichier n'est pas un contrôle : le lanceur saute les « -decor ».
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

load('vendor/jsxgraphcore.js');
if (typeof JXG === 'undefined') { print('ÉCHEC : JSXGraph ne se charge pas sous jsc.'); throw new Error('JSXGraph'); }
window.JXG = JXG;
var initBoardVrai = JXG.JSXGraph.initBoard;
JXG.JSXGraph.initBoard = function (id, opts) {
  opts = opts || {};
  opts.renderer = 'no';
  return initBoardVrai.call(JXG.JSXGraph, id, opts);
};

var erreursConsole = [], avertissements = [];
var console = { log: function () {}, warn: function (m) { avertissements.push(String(m)); }, error: function (m) { erreursConsole.push(String(m)); } };
load('js/app.js');

/* Enregistre la leçon, la monte, et rend les poignées pour la piloter. */
function monter(fichier) {
  var LECON = null;
  var registerVrai = MathsView.register;
  MathsView.register = function (l) { LECON = l; registerVrai(l); };
  load(fichier);
  MathsView.register = registerVrai;
  if (!LECON) { print('ÉCHEC : la leçon ne s\'enregistre pas'); throw new Error('register'); }

  var boardEl = fauxEl('div'); boardEl.id = 'board-test-' + LECON.id;
  var extras = fauxEl('div'); extras.id = 'lesson-extras';
  var opts = {}; for (var k in LECON.board) opts[k] = LECON.board[k];
  var board = JXG.JSXGraph.initBoard(boardEl.id, opts);

  var H = { lecon: LECON, board: board, extras: extras, steps: null, remiseAZero: null, controles: null, refs: {}, nettoyages: [], erreurSetup: null };
  var mv = {
    hideBoard: function () {}, typeset: function () {}, onCleanup: function (f) { H.nettoyages.push(f); },
    extras: extras,
    addControls: function (c) {
      H.controles = c;
      c.forEach(function (s) {
        var e = fauxEl(s.type === 'button' ? 'button' : 'input');
        if (s.type === 'slider') { e.value = String(s.value != null ? s.value : s.min); e.min = s.min; e.max = s.max; e.step = s.step || 1; }
        H.refs[s.id] = e;
      });
      return H.refs;
    },
    createAnimator: function () { return { cancel: function () { H.steps = null; },
      runSteps: function (s, r) { H.steps = s; H.remiseAZero = r; } }; }
  };
  try { LECON.setup(board, mv); }
  catch (e) { H.erreurSetup = String(e) + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : ''); }

  H.parClasse = function (cls) {
    var out = [];
    (function walk(e) { if (e.className && e.className.split(' ').indexOf(cls) >= 0) out.push(e); (e.children || []).forEach(walk); })(extras);
    return out;
  };
  H.chips = function () { return H.parClasse('ineq-preset'); };
  // La pastille dont le texte commence par `nom`, sinon celle qui le contient (« grammes » n'est pas « kilogrammes »).
  H.chip = function (nom) {
    var c = H.chips();
    return c.filter(function (x) { return (x.textContent || '').indexOf(nom) === 0; })[0] || c.filter(function (x) { return (x.textContent || '').indexOf(nom) >= 0; })[0];
  };
  H.panneau = function () { var p = H.parClasse('props-panel')[0]; return p ? p.innerHTML : ''; };
  H.controle = function (id) { return (H.controles || []).filter(function (c) { return c.id === id; })[0]; };
  // Joue toutes les étapes jusqu'à la n-ième incluse (après remise à zéro), comme « Précédent » le fait.
  H.jouer = function (n) {
    H.remiseAZero();
    for (var i = 0; i < n; i++) { H.steps[i].step(1); if (H.steps[i].after) H.steps[i].after(); }
    board.update();
  };
  // Les textes visibles de la figure : { t, x, y }.
  H.textes = function () {
    var out = [];
    board.objectsList.forEach(function (o) {
      if (o.elType !== 'text') return;
      var v = o.visProp.visible; if (typeof v === 'function') v = v();
      if (!v) return;
      var t = String(o.plaintext || '').trim();
      if (t) out.push({ t: t, x: o.X(), y: o.Y(), o: o });
    });
    return out;
  };
  // Aucun point à coordonnées infinies.
  H.sain = function (nom, ko) {
    board.objectsList.forEach(function (o) {
      if (o.elType === 'point' && o.coords) {
        var u = o.coords.usrCoords;
        if (!isFinite(u[1]) || !isFinite(u[2])) ko(nom + ' : un point a des coordonnées ' + u[1] + ' ; ' + u[2]);
      }
      if (o.elType === 'curve' && o.dataX) {
        for (var i = 0; i < o.dataX.length; i++) {
          if (isNaN(o.dataX[i]) !== isNaN(o.dataY[i])) ko(nom + ' : une courbe a un NaN sur une seule coordonnée');
          if (!isNaN(o.dataX[i]) && (!isFinite(o.dataX[i]) || !isFinite(o.dataY[i]))) ko(nom + ' : une courbe a une coordonnée infinie');
        }
      }
    });
  };
  return H;
}
// « 1 500,5 » → 1500.5 (espaces fines, virgule décimale, vrai signe moins).
function lireNombre(s) {
  return parseFloat(String(s).replace(/[\s  ]/g, '').replace(',', '.').replace('−', '-'));
}
