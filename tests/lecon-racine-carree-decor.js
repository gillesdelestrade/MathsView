/* On exécute setup() avec un DOM et un JSXGraph simulés, puis on rejoue les
   étapes de l'animation en relisant les tableaux ET la position des points :
   les objets créés gardent leurs coordonnées (nombres ou fonctions) et leurs
   attributs, pour que le contrôle puisse les relire. */
var elements = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', style: {}, children: [], dataset: {},
            classList: { toggle: function(){}, add: function(){}, remove: function(){} },
            appendChild: function (c) { this.children.push(c); },
            addEventListener: function () {} };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  elements.push(e); return e;
}
var document = { createElement: fauxEl };

var objets = [];
function fauxObjet(type, parents, attrs) {
  var o = { type: type, parents: parents, attrs: attrs || {},
            setAttribute: function (a) { for (var k in a) o.attrs[k] = a[k]; } };
  function ev(v) { return typeof v === 'function' ? v() : v; }
  if (type === 'point' || type === 'glider') {
    o.X = function () { return ev(parents[0]); };
    o.Y = function () { return ev(parents[1]); };
  }
  if (type === 'curve') {
    o.tmin = function () { return ev(parents[2]); };
    o.tmax = function () { return ev(parents[3]); };
    o.at = function (t) { return [parents[0](t), parents[1](t)]; };
  }
  if (type === 'text') o.texte = function () { return ev(parents[2]); };
  objets.push(o);
  return o;
}
var ecoute = null;
var board = {
  create: fauxObjet,
  on: function (ev, f) { if (ev === 'update') ecoute = f; },
  update: function () { if (ecoute) ecoute(); }
};
var steps = null, remiseAZero = null, extras = fauxEl('div'), controles = null;
var mv = {
  hideBoard: function(){}, typeset: function(){}, onCleanup: function(){},
  extras: extras, addControls: function (c) { controles = c; return {}; },
  createAnimator: function(){ return { cancel: function(){},
    runSteps: function(s, r){ steps = s; remiseAZero = r; } }; }
};
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/2nde/racine-carree.js');
LECON.setup(board, mv);
