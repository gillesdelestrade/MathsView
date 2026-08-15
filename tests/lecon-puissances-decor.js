/* On exécute setup() avec un DOM simulé, puis on rejoue TOUTES les étapes de
   l'animation pour chacun des quatre cas, en relisant le tableau produit. */
var elements = [];
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', style: {}, children: [], dataset: {},
            classList: { toggle: function(){}, add: function(){}, remove: function(){} },
            appendChild: function (c) { this.children.push(c); },
            querySelector: function (sel) {
              var cls = sel.replace('.', '');
              function cherche(n) {
                if (n.className && n.className.split(' ').indexOf(cls) >= 0) return n;
                for (var i = 0; i < n.children.length; i++) {
                  var r = cherche(n.children[i]); if (r) return r;
                }
                // les enfants créés par innerHTML ne sont pas modélisés : on
                // retrouve les blocs par la classe grâce à `_sous`
                return null;
              }
              return this._sous && this._sous[cls] ? this._sous[cls] : cherche(this);
            } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v;
      e.children = [];          // comme dans un vrai DOM : innerHTML remplace tout
      // on recrée les sous-blocs déclarés par leur classe dans le gabarit
      // un élément peut porter PLUSIEURS classes : on les enregistre toutes
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
var steps = null, remiseAZero = null, extras = fauxEl('div');
var board = { update: function(){}, create: function(){ return {}; } };
var mv = {
  hideBoard: function(){}, typeset: function(){}, onCleanup: function(){},
  extras: extras, addControls: function(){ return {}; },
  createAnimator: function(){ return { cancel: function(){},
    runSteps: function(s, r){ steps = s; remiseAZero = r; } }; }
};
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/puissances.js');
LECON.setup(board, mv);

var ui = extras.children[0];
