/* Les fiches bristol : chaque leçon qui en déclare une doit fournir une
   fiche complète, courte, et dont les figures se dessinent sans erreur.
 *
 * On rejoue ce que fait le navigateur, dans l'ordre : le moteur (js/app.js,
 * pour la liste des domaines), js/fiches.js, puis chaque leçon d'index.html.
 * Ensuite on MONTE réellement chaque fiche, avec le VRAI JSXGraph en renderer
 * « no » (toute la logique de création, sans dessin) et un DOM de poche : une
 * figure qui plante — un attribut mal nommé, un `board.create` sur un objet
 * inconnu — remonte ici, alors que dans la page elle ne laisserait qu'un
 * cadre vide et une ligne rouge en console.
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
/* Le moteur, le module des fiches, puis le catalogue d'index.html      */
/* ------------------------------------------------------------------ */
var console = { log: function () {}, warn: function () {}, error: function (m) { erreursConsole.push(String(m)); } };
var erreursConsole = [];
load('js/app.js');
load('js/fiches.js');

var lecons = [];
var registerVrai = MathsView.register;
MathsView.register = function (l) { lecons.push(l); registerVrai(l); };

var html = readFile('index.html');
var scripts = [];
var re = /<script src="(lessons\/[^"]+)"/g, m;
while ((m = re.exec(html))) scripts.push(m[1]);
scripts.forEach(function (f) { load(f); });

/* ------------------------------------------------------------------ */
/* Les contrôles                                                       */
/* ------------------------------------------------------------------ */
var err = [];
function ko(m) { err.push(m); }

var avecFiche = lecons.filter(function (l) { return l.fiche; });
if (!avecFiche.length) ko('aucune leçon ne déclare de fiche');

var domaines = Object.keys(MathsView.categories);
if (domaines.length < 2) ko('MathsView.categories doit exposer les domaines');

var LONGUEUR_MAX = 200;   // une phrase de fiche se recopie d'un trait

avecFiche.forEach(function (l) {
  var f = l.fiche, nom = '« ' + l.id + ' »';
  if (!Array.isArray(f.points) || f.points.length < 2) ko(nom + ' : il faut au moins deux phrases dans points');
  if (!Array.isArray(f.exemples) || !f.exemples.length) ko(nom + ' : il faut au moins un exemple');
  (f.points || []).forEach(function (p, i) {
    if (typeof p !== 'string' || !p.trim()) ko(nom + ' : point ' + (i + 1) + ' vide');
    var brut = String(p).replace(/<[^>]+>/g, '').replace(/\\\(.*?\\\)/g, 'F');
    if (brut.length > LONGUEUR_MAX)
      ko(nom + ' : point ' + (i + 1) + ' trop long (' + brut.length + ' > ' + LONGUEUR_MAX + ') — la fiche veut des phrases courtes');
    if (/\\\(.*\\\(/.test(p) && (p.match(/\\\(/g) || []).length !== (p.match(/\\\)/g) || []).length)
      ko(nom + ' : point ' + (i + 1) + ' : parenthèses \\( … \\) déséquilibrées');
  });
  (f.exemples || []).forEach(function (x, i) {
    if (typeof x !== 'string' || !x.trim()) ko(nom + ' : exemple ' + (i + 1) + ' vide');
    if ((x.match(/\\\(/g) || []).length !== (x.match(/\\\)/g) || []).length)
      ko(nom + ' : exemple ' + (i + 1) + ' : parenthèses \\( … \\) déséquilibrées');
  });
  (f.figures || []).forEach(function (fig, i) {
    if (typeof fig.dessine !== 'function') ko(nom + ' : figure ' + (i + 1) + ' sans fonction dessine');
    if (!Array.isArray(fig.boundingbox) || fig.boundingbox.length !== 4)
      ko(nom + ' : figure ' + (i + 1) + ' : boundingbox attendu [xmin, ymax, xmax, ymin]');
    else if (!(fig.boundingbox[0] < fig.boundingbox[2] && fig.boundingbox[3] < fig.boundingbox[1]))
      ko(nom + ' : figure ' + (i + 1) + ' : boundingbox mal ordonné (xmin < xmax et ymin < ymax)');
    if (!fig.legende) ko(nom + ' : figure ' + (i + 1) + ' sans légende');
  });
  if ((f.figures || []).length > 2) ko(nom + ' : plus de deux figures, la fiche ne les contient pas');
  if (domaines.indexOf(l.category) < 0) ko(nom + ' : domaine « ' + l.category + ' » inconnu, l\'intercalaire n\'aurait pas de place');
});

/* On monte chaque fiche pour de vrai. */
var nettoyages = [];
var ctx = { onCleanup: function (fn) { nettoyages.push(fn); } };
var figuresDessinees = 0, objetsTotal = 0;

avecFiche.forEach(function (l) {
  var nom = '« ' + l.id + ' »';
  erreursConsole = [];
  try {
    MathsFiches.monte(l, ctx);
  } catch (e) {
    ko(nom + ' : la fiche plante au montage : ' + (e && e.message ? e.message : e));
    return;
  }
  erreursConsole.forEach(function (m) { ko(nom + ' : ' + m); });

  /* Ce que le montage a produit : l'onglet du domaine à la bonne place… */
  var zone = conteneur.children[1];
  var fiche = zone && zone.children[0];
  if (!fiche || fiche.className.indexOf('fiche ' + l.category) !== 0)
    ko(nom + ' : la fiche ne porte pas la classe de son domaine');
  var onglets = fiche && fiche.children[0].children;
  var actifs = (onglets || []).filter(function (o) { return /actif/.test(o.className); });
  if (actifs.length !== 1) ko(nom + ' : il faut exactement un onglet plein (' + actifs.length + ')');
  else {
    var attendu = (domaines.indexOf(l.category) * 100 / domaines.length);
    if (Math.abs(parseFloat(actifs[0].style.left) - attendu) > 1e-6)
      ko(nom + ' : onglet à ' + actifs[0].style.left + ', attendu ' + attendu + '% (rang du domaine)');
  }
  /* … et des figures qui ont bien des objets dedans. */
  (l.fiche.figures || []).forEach(function (fig, i) {
    var el = parId['fiche-fig-' + l.id + '-' + i];
    if (!el) { ko(nom + ' : figure ' + (i + 1) + ' sans boîte dans la page'); return; }
    var b = JXG.boards[Object.keys(JXG.boards).filter(function (k) { return JXG.boards[k].container === el.id; })[0]];
    if (!b) { ko(nom + ' : figure ' + (i + 1) + ' sans tableau JSXGraph'); return; }
    var n = Object.keys(b.objects).length;
    if (n < 2) ko(nom + ' : figure ' + (i + 1) + ' vide (' + n + ' objet)');
    objetsTotal += n;
    figuresDessinees++;
  });
});
nettoyages.forEach(function (fn) { fn(); });
if (Object.keys(JXG.boards).length)
  ko('des tableaux de fiche restent en mémoire après nettoyage : ' + Object.keys(JXG.boards).length);

/* ------------------------------------------------------------------ */
if (err.length) {
  print('ÉCHEC — ' + err.length + ' problème(s) :');
  err.forEach(function (e) { print('  - ' + e); });
} else {
  print(avecFiche.length + ' fiches montées (' + avecFiche.map(function (l) { return l.id; }).join(', ') +
        '), ' + figuresDessinees + ' figures dessinées avec le vrai JSXGraph, ' + objetsTotal + ' objets.');
}
