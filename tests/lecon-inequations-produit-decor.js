/* On exécute setup() avec un DOM et un JSXGraph simulés, puis on rejoue les
   étapes de l'animation en relisant le panneau ET la figure : les objets créés
   gardent leurs coordonnées (nombres ou fonctions), leur contenu et leurs
   attributs, pour que le contrôle puisse les relire. */
var elements = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', style: {}, children: [], dataset: {}, value: '',
            textContent: '', type: '', step: '', parentNode: null,
            classList: { toggle: function () {}, add: function () {}, remove: function () {} },
            appendChild: function (c) { c.parentNode = this; this.children.push(c); return c; },
            removeChild: function (c) { var i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
            querySelector: function () { return null; },
            querySelectorAll: function () { return []; },
            getBoundingClientRect: function () { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
            addEventListener: function () {} };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  elements.push(e); return e;
}
var document = { createElement: fauxEl };
function parClasse(cls) { return elements.filter(function (e) { return e.className.split(' ').indexOf(cls) >= 0; }); }

var JXG = { COORDS_BY_USER: 1 };
var objets = [];
function ev(v) { return typeof v === 'function' ? v() : v; }
function fauxObjet(type, parents, attrs) {
  var o = { type: type, parents: parents, attrs: attrs || {}, _ev: {},
            setAttribute: function (a) { for (var k in a) o.attrs[k] = a[k]; },
            on: function (evt, fn) { o._ev[evt] = fn; } };
  if (type === 'point') {
    o._x = parents[0]; o._y = parents[1];
    o.X = function () { return ev(o._x); };
    o.Y = function () { return ev(o._y); };
    o.setPosition = function (m, c) { o._x = c[0]; o._y = c[1]; };
  }
  if (type === 'text') o.texte = function () { return String(ev(parents[2])); };
  if (type === 'segment') {
    o.x1 = function () { return parents[0].X(); }; o.x2 = function () { return parents[1].X(); };
  }
  objets.push(o);
  return o;
}
var bbox = null;
var board = {
  create: fauxObjet,
  on: function () {},
  update: function () {},
  setBoundingBox: function (b) { bbox = b; }
};
function visible(o) { return ev(o.attrs.visible) === true; }

var steps = null, remiseAZero = null, extras = fauxEl('div'), controles = null;
var mv = {
  hideBoard: function () {}, typeset: function () {}, onCleanup: function () {},
  extras: extras, addControls: function (c) { controles = c; return {}; },
  createAnimator: function () { return { cancel: function () {},
    runSteps: function (s, r) { steps = s; remiseAZero = r; } }; }
};
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/2nde/inequations-produit.js');
LECON.setup(board, mv);
