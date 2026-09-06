/* Le décor de la leçon « Simplifier une fraction » : un DOM et un JSXGraph
   simulés, assez fidèles pour relire les barres (leurs parts, leur coloriage)
   et les étiquettes posées sur la figure. */
var elements = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', style: {}, children: [], dataset: {},
            value: '', type: '',
            classList: { toggle: function(){}, add: function(){}, remove: function(){} },
            appendChild: function (c) { this.children.push(c); },
            querySelector: function (sel) {
              var cls = sel.replace('.', '');
              return this._sous && this._sous[cls] ? this._sous[cls] : null;
            } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v; e.children = [];
      var m, re = /class="([^"]+)"/g, sous = {};
      while ((m = re.exec(v))) {
        var f = fauxEl('div'); f.className = m[1];
        m[1].split(/\s+/).forEach(function (c) { if (c && !sous[c]) sous[c] = f; });
      }
      if (Object.keys(sous).length) e._sous = sous;
    }
  });
  Object.defineProperty(e, 'textContent', { get: function(){ return e._txt || ''; },
                                            set: function(v){ e._txt = v; } });
  elements.push(e); return e;
}
var document = { createElement: fauxEl };

/* JSXGraph de poche : on garde tout ce qui est créé, et update() rejoue les
   updateDataArray() comme le vrai tableau. */
var objets = [], bbox = null;
var board = {
  create: function (type, parents, attr) {
    var o = { type: type, parents: parents, attr: attr || {} };
    objets.push(o);
    return o;
  },
  update: function () {
    objets.forEach(function (o) { if (o.updateDataArray) o.updateDataArray(); });
    if (board._on) board._on();
  },
  on: function (ev, f) { board._on = f; },
  setBoundingBox: function (b) { bbox = b; }
};
var steps = null, remiseAZero = null, extras = fauxEl('div'), controls = [];
var mv = {
  typeset: function(){}, extras: extras,
  addControls: function (c) { controls = c; },
  createAnimator: function(){ return { cancel: function(){}, runSteps: function (s, r) { steps = s; remiseAZero = r; } }; }
};
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/6eme/simplifier-fractions.js');
LECON.setup(board, mv);

var form = extras.children[0], pick = extras.children[1], panel = extras.children[2];
var inA = form.querySelector('.frac-a'), inB = form.querySelector('.frac-b');

/* Ce qu'on lit sur la figure. */
function textes() {
  return objets.filter(function (o) { return o.type === 'text'; })
    .map(function (o) { var f = o.parents[2]; return typeof f === 'function' ? f() : f; });
}
// Les barres visibles : pour chacune, nombre de parts et parts coloriées.
function barres() {
  var parCase = {};
  objets.forEach(function (o) {
    if (o.type !== 'curve' || !o.updateDataArray || !o.attr.fillColor) return;
    if (!o.dataX || !o.dataX.length) return;
    var y = o.dataY[0];
    var col = typeof o.attr.fillColor === 'function' ? o.attr.fillColor() : o.attr.fillColor;
    parCase[y] = parCase[y] || { parts: 0, pleines: 0, xMax: 0 };
    parCase[y].parts++;
    if (col === '#0d9488') { parCase[y].pleines++; parCase[y].xMax = Math.max(parCase[y].xMax, o.dataX[1]); }
  });
  return Object.keys(parCase).map(Number).sort(function (u, v) { return v - u; })
    .map(function (y) { return parCase[y]; });
}
function fixe(a, b) { inA.value = String(a); inB.value = String(b); inA.oninput(); }
function joue(n) {          // rejoue les n premières étapes, depuis zéro
  remiseAZero();
  for (var i = 0; i < n; i++) { steps[i].step(0); steps[i].step(0.5); steps[i].step(1); if (steps[i].after) steps[i].after(); }
}
