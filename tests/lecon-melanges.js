/*
 * La leçon « Mélanges homogènes et hétérogènes » (5ème, physique-chimie),
 * montée avec le VRAI JSXGraph (renderer « no » : toute la logique, aucun
 * dessin).
 *
 * Le verdict écrit sur la figure n'a de valeur que si la figure le MONTRE.
 * On relit donc le dessin après chaque geste — les grains visibles et leur
 * position, les couches, la couleur de l'eau, le filtrat, le résidu — et on
 * en déduit soi-même « homogène » ou « hétérogène » : des grains ou une couche
 * visibles après le repos, c'est hétérogène ; sinon, homogène. Ce verdict
 * déduit doit coïncider avec le texte, et tous deux avec le programme : le sel
 * se dissout jusqu'à 36 g pour 100 mL, le sucre et le sirop donnent un
 * mélange homogène, le sel en trop, l'huile, le sable et la terre un mélange
 * hétérogène.
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
load('lessons/pc/5eme/melanges.js');

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

var steps = null, remiseAZero = null, controles = null, refs = {};
var mv = {
  hideBoard: function () {}, typeset: function () {}, onCleanup: function () {},
  extras: extras,
  addControls: function (c) {
    controles = c;
    c.forEach(function (s) { var e = fauxEl(s.type === 'button' ? 'button' : 'input'); e.value = s.value; refs[s.id] = e; });
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
var curseur = controle('quantite');

if (chips.length !== 6) ko('six substances attendues, ' + chips.length + ' pastilles');
if (!panneau) ko('le panneau manque');
if (!curseur || curseur.type !== 'slider' || curseur.min !== 0 || curseur.max !== 50) ko('le curseur de quantité doit aller de 0 à 50');
if (!controle('gestes') || !controle('reset')) ko('il manque un bouton (gestes, reset)');
if (!steps || steps.length !== 4) ko('quatre gestes attendus (verser, agiter, reposer, filtrer), ' + (steps ? steps.length : 'aucun'));

var X1 = -5.4, X2 = -1.6, HAUT_BECHER = 5.2, EAU = 3.0, OIL = '#facc15', BASE = '#60a5fa';
function vis(o) { var v = o.visProp.visible; return typeof v === 'function' ? v() : !!v; }
function figure() {
  var F = { grains: [], residus: [], gouttes: [], blocs: [], textes: {} };
  board.objectsList.forEach(function (o) {
    if (o.elType === 'point' && vis(o) && o.visProp.size > 0.2 && o.visProp.fillopacity > 0.02) {
      var g = { x: o.X(), y: o.Y(), taille: o.visProp.size, op: o.visProp.fillopacity };
      if (g.x < 0) { F.grains.push(g); if (g.taille > 4) F.gouttes.push(g); }
      else if (g.y > 4) F.residus.push(g);
    }
    if (o.elType === 'curve' && vis(o) && o.dataX && o.dataX.length === 5) {
      var b = { x1: Math.min.apply(null, o.dataX), x2: Math.max.apply(null, o.dataX),
                y1: Math.min.apply(null, o.dataY), y2: Math.max.apply(null, o.dataY),
                col: String(o.visProp.fillcolor).toLowerCase(), op: o.visProp.fillopacity };
      b.h = b.y2 - b.y1;
      if (b.h > 1e-6) F.blocs.push(b);
    }
    if (o.elType === 'text') {
      var t = String(o.plaintext || '');
      if (/corps pur|Mélange|on vient de verser/.test(t)) F.textes.verdict = t;
      else if (/^Eau \(100 mL\)/.test(t)) F.textes.legende = t;
      else if (/^Filtrat/.test(t)) F.textes.filtrat = t;
    }
  });
  F.gauche = F.blocs.filter(function (b) { return b.x1 < 0; });
  F.droite = F.blocs.filter(function (b) { return b.x1 > 0; });
  F.huile = F.gauche.filter(function (b) { return b.col === OIL; })[0] || null;
  F.eau = F.gauche.filter(function (b) { return b.col !== OIL && b.y2 >= 2.5; })[0] || null;
  F.coucheBas = F.gauche.filter(function (b) { return b.col !== OIL && b.y1 < 1e-6 && b.y2 < 2.5; })[0] || null;
  F.filtrat = F.droite.filter(function (b) { return b.col !== OIL; })[0] || null;
  F.filtratHuile = F.droite.filter(function (b) { return b.col === OIL; })[0] || null;
  return F;
}
function sain(nom) {
  board.objectsList.forEach(function (o) {
    if (o.elType === 'point' && o.coords) {
      var u = o.coords.usrCoords;
      if (!isFinite(u[1]) || !isFinite(u[2])) ko(nom + ' : un point a des coordonnées ' + u[1] + ' ; ' + u[2]);
    }
    if (o.elType === 'curve' && o.dataX) {
      for (var i = 0; i < o.dataX.length; i++) {
        if (!isFinite(o.dataX[i]) || !isFinite(o.dataY[i])) ko(nom + ' : une courbe a une coordonnée non finie');
      }
    }
  });
}
function chip(nom) { return chips.filter(function (c) { return c.textContent.indexOf(nom) >= 0; })[0]; }
function html() { return panneau ? panneau.innerHTML : ''; }
function contient(mots, nom) {
  mots.forEach(function (m) { if (html().indexOf(m) < 0) ko(nom + ' : le panneau devrait parler de « ' + m + ' »'); });
}

/* Le programme : ce qu'on attend après le repos. */
var SUBS = {
  Sel:   { type: 'soluble', sat: 36, unite: 'g' },
  Sucre: { type: 'soluble', sat: 200, unite: 'g' },
  Sirop: { type: 'miscible', unite: 'mL' },
  Huile: { type: 'nonmiscible', unite: 'mL' },
  Sable: { type: 'insoluble', unite: 'g' },
  Terre: { type: 'insoluble', fin: true, unite: 'g' }
};
function attenduHomogene(s, q) {
  var S = SUBS[s];
  if (S.type === 'soluble') return q <= S.sat;
  return S.type === 'miscible';
}
function nVis(q) { return Math.round(36 * q / 50); }
function nReste(s, q) { var S = SUBS[s]; return S.type === 'soluble' && q > 0 ? Math.round(nVis(q) * Math.max(0, q - S.sat) / q) : 0; }

/* ------------------------------------------------------------------ */
/* Les gestes, substance par substance, quantité par quantité          */
/* ------------------------------------------------------------------ */
var QUANTITES = [0, 10, 20, 36, 37, 50];
var joues = 0, verdictsDeduits = 0;

function jouer(s, q) {
  var nom = s + ' ' + q + ' ' + SUBS[s].unite;
  chip(s).onclick();
  curseur.onInput(q);
  if (!steps || steps.length !== 4) { ko(nom + ' : les quatre gestes ne sont pas rechargés'); return null; }
  var S = SUBS[s], nv = nVis(q), nr = nReste(s, q), F, i;
  try {
    remiseAZero(); board.update(); sain(nom + ' (départ)');
    F = figure();
    if (F.grains.length || F.huile || F.coucheBas) ko(nom + ' : au départ, l\'eau est seule');
    if (!/corps pur/.test(F.textes.verdict || '')) ko(nom + ' : au départ, « corps pur » attendu, lu « ' + F.textes.verdict + ' »');

    /* --- 1. verser ---------------------------------------------------- */
    steps[0].step(0.5); board.update(); sain(nom + ' (verser, en cours)');
    steps[0].step(1); steps[0].after(); board.update(); sain(nom + ' (versé)');
    F = figure();
    if (q === 0) {
      if (F.grains.length || F.huile || F.coucheBas) ko(nom + ' : rien à verser, rien ne doit apparaître');
    } else if (S.type === 'soluble' || S.type === 'insoluble') {
      if (F.grains.length !== nv) ko(nom + ' versé : ' + nv + ' grains attendus, ' + F.grains.length + ' visibles');
      F.grains.forEach(function (g) { if (g.y > 0.7) ko(nom + ' versé : un grain flotte à y = ' + g.y.toFixed(2)); });
    } else if (S.type === 'nonmiscible') {
      if (!F.huile) ko(nom + ' versé : la couche d\'huile manque');
      else {
        if (Math.abs(F.huile.h - q * 0.02) > 1e-6) ko(nom + ' versé : couche d\'huile de ' + F.huile.h.toFixed(3) + ', attendu ' + (q * 0.02));
        if (!F.eau || Math.abs(F.huile.y1 - F.eau.y2) > 1e-6) ko(nom + ' versé : l\'huile doit être posée sur l\'eau');
      }
      if (F.gouttes.length) ko(nom + ' versé : pas encore de gouttelettes');
    } else {
      if (!F.coucheBas) ko(nom + ' versé : le sirop doit former une couche au fond');
      else if (Math.abs(F.coucheBas.h - q * 0.02) > 1e-6) ko(nom + ' versé : couche de sirop de ' + F.coucheBas.h.toFixed(3));
    }
    if (q > 0 && !/on vient de verser/.test(F.textes.verdict || '')) ko(nom + ' versé : « on vient de verser » attendu, lu « ' + F.textes.verdict + ' »');
    var leg = F.textes.legende || '';
    if (q > 0 && leg.indexOf(q + ' ' + S.unite) < 0) ko(nom + ' : la légende « ' + leg + ' » devrait dire ' + q + ' ' + S.unite);
    if (!F.eau || F.eau.y2 > HAUT_BECHER) ko(nom + ' : le bécher déborde');

    /* --- 2. agiter ---------------------------------------------------- */
    steps[1].step(0.5); board.update(); sain(nom + ' (agiter, en cours)');
    steps[1].step(1); steps[1].after(); board.update(); sain(nom + ' (agité)');
    F = figure();
    if (q > 0) {
      if (S.type === 'soluble') {
        if (F.grains.length !== nr) ko(nom + ' agité : ' + nr + ' grain(s) non dissous attendus, ' + F.grains.length + ' visibles');
        F.grains.forEach(function (g) { if (g.y > 0.7) ko(nom + ' agité : le sel en trop doit rester au fond'); });
        if (F.eau.col !== BASE) ko(nom + ' agité : le ' + s.toLowerCase() + ' dissous ne colore pas l\'eau');
      } else if (S.type === 'insoluble') {
        if (F.grains.length !== nv) ko(nom + ' agité : ' + nv + ' grains attendus, ' + F.grains.length);
        var haut = 0; F.grains.forEach(function (g) { haut = Math.max(haut, g.y); });
        if (haut < 1.2) ko(nom + ' agité : les grains devraient être dispersés dans l\'eau (max y = ' + haut.toFixed(2) + ')');
        if (S.fin && F.eau.col === BASE) ko(nom + ' agité : la terre doit troubler l\'eau');
        if (!S.fin && F.eau.col !== BASE) ko(nom + ' agité : le sable ne colore pas l\'eau');
      } else if (S.type === 'nonmiscible') {
        if (F.huile) ko(nom + ' agité : plus de couche, des gouttelettes');
        if (F.gouttes.length !== nv) ko(nom + ' agité : ' + nv + ' gouttelettes attendues, ' + F.gouttes.length);
      } else {
        if (F.coucheBas) ko(nom + ' agité : le sirop ne doit plus former de couche');
        if (F.eau.col === BASE) ko(nom + ' agité : le sirop doit colorer l\'eau');
      }
      F.grains.forEach(function (g) {
        if (g.x < X1 || g.x > X2 || g.y < 0 || g.y > F.eau.y2 + 1e-6) ko(nom + ' agité : un grain hors du liquide (' + g.x.toFixed(2) + ' ; ' + g.y.toFixed(2) + ')');
      });
    }

    /* --- 3. laisser reposer : le verdict se lit sur la figure --------- */
    steps[2].step(0.5); board.update(); sain(nom + ' (reposer, en cours)');
    steps[2].step(1); steps[2].after(); board.update(); sain(nom + ' (au repos)');
    F = figure();
    var v = F.textes.verdict || '';
    if (q === 0) {
      if (!/corps pur/.test(v)) ko(nom + ' : « corps pur » attendu, lu « ' + v + ' »');
    } else {
      var heteroVu = F.grains.length > 0 || !!F.huile || !!F.coucheBas;
      var ditHomogene = /homogène/.test(v), ditHetero = /hétérogène/.test(v);
      if (ditHomogene === ditHetero) ko(nom + ' : le verdict doit trancher, lu « ' + v + ' »');
      if (ditHomogene === heteroVu) ko(nom + ' : la figure montre ' + (heteroVu ? 'des constituants distincts' : 'un seul aspect') + ' mais le texte dit « ' + v + ' »');
      if (ditHomogene !== attenduHomogene(s, q)) ko(nom + ' : le programme dit ' + (attenduHomogene(s, q) ? 'homogène' : 'hétérogène') + ', la leçon « ' + v + ' »');
      verdictsDeduits++;
      // Décantation : ce qui est solide est au fond ; l'huile est remontée en couche.
      F.grains.forEach(function (g) { if (g.y > 0.7) ko(nom + ' au repos : un grain n\'est pas déposé (y = ' + g.y.toFixed(2) + ')'); });
      if (S.type === 'insoluble' && F.grains.length !== nv) ko(nom + ' au repos : ' + nv + ' grains déposés attendus, ' + F.grains.length);
      if (S.type === 'soluble' && F.grains.length !== nr) ko(nom + ' au repos : ' + nr + ' grain(s) de surplus attendus, ' + F.grains.length);
      if (S.type === 'nonmiscible') {
        if (F.gouttes.length) ko(nom + ' au repos : les gouttelettes doivent avoir rejoint la couche');
        if (!F.huile) ko(nom + ' au repos : la couche d\'huile doit s\'être reformée');
        else if (Math.abs(F.huile.y1 - EAU) > 1e-6 || Math.abs(F.huile.h - q * 0.02) > 1e-6) ko(nom + ' au repos : couche d\'huile mal posée (' + F.huile.y1.toFixed(2) + ', ' + F.huile.h.toFixed(3) + ')');
      }
      if (S.type === 'miscible' && F.eau.col === BASE) ko(nom + ' au repos : le sirop reste dans l\'eau, colorée');
      if (S.fin && F.eau.col === BASE) ko(nom + ' au repos : l\'eau reste un peu trouble');
      // Le panneau met les mots.
      var motsAttendus = { soluble: q <= S.sat ? ['dissout', 'soluté', 'solvant', 'solution', 'homogène'] : ['saturer', 'hétérogène'],
                           miscible: ['miscibles', 'homogène'], nonmiscible: ['gouttelettes', 'miscibles', 'deux couches', 'hétérogène'],
                           insoluble: S.fin ? ['insoluble', 'trouble', 'décantation', 'hétérogène'] : ['insoluble', 'décantation', 'hétérogène'] }[S.type];
      contient(motsAttendus, nom + ' au repos');
      if (html().indexOf('melange-bilan ' + (attenduHomogene(s, q) ? 'homogene' : 'heterogene')) < 0) ko(nom + ' : le bilan du panneau n\'a pas la bonne couleur');
    }

    /* --- 4. filtrer --------------------------------------------------- */
    steps[3].step(0.5); board.update(); sain(nom + ' (filtrer, en cours)');
    var Fmi = figure();
    if (q > 0 && (!Fmi.filtrat || Fmi.filtrat.h >= 2.4 - 1e-6 || Fmi.filtrat.h <= 0)) ko(nom + ' : à mi-filtration, le filtrat doit monter');
    steps[3].step(1); steps[3].after(); board.update(); sain(nom + ' (filtré)');
    F = figure();
    if (q > 0) {
      if (!F.filtrat || Math.abs(F.filtrat.h - 2.4) > 1e-6) ko(nom + ' filtré : le filtrat doit remplir sa hauteur (' + (F.filtrat ? F.filtrat.h.toFixed(2) : 'absent') + ')');
      var retenus = S.type === 'insoluble' ? nv : nr;
      if (F.residus.length !== retenus) ko(nom + ' filtré : ' + retenus + ' grain(s) retenus dans le filtre attendus, ' + F.residus.length);
      if (S.type === 'miscible' && F.filtrat && F.filtrat.col === BASE) ko(nom + ' filtré : le sirop passe, le filtrat est coloré');
      if ((S.type === 'insoluble' || S.type === 'soluble') && F.filtrat && F.filtrat.col !== BASE) ko(nom + ' filtré : le filtrat doit être limpide');
      if (S.type === 'nonmiscible' && !F.filtratHuile) ko(nom + ' filtré : l\'huile passe aussi, deux couches dans le filtrat');
      if (S.type !== 'nonmiscible' && F.filtratHuile) ko(nom + ' filtré : pas d\'huile dans ce filtrat');
      if (!/^Filtrat/.test(F.textes.filtrat || '')) ko(nom + ' filtré : la légende du filtrat manque');
      if (S.type === 'soluble' && !/salé/.test(F.textes.filtrat || '')) ko(nom + ' filtré : le filtrat est toujours salé, la légende doit le dire');
      contient(['filtr'], nom + ' filtré');
      if (S.type === 'soluble' && q <= S.sat) contient(['évaporer'], nom + ' filtré');
      if (S.type === 'nonmiscible') contient(['décante'], nom + ' filtré');
      // Le mélange de gauche n'a pas bougé.
      if (F.grains.length !== (S.type === 'insoluble' ? nv : nr)) ko(nom + ' filtré : le bécher de gauche doit rester tel quel');
    } else if (F.filtrat) ko(nom + ' : rien à filtrer');
    joues++;
  } catch (e) { ko(nom + ' : ' + e + (e.stack ? ' — ' + String(e.stack).split('\n')[0] : '')); }
  return figure();
}

if (!err.length) {
  Object.keys(SUBS).forEach(function (s) { QUANTITES.forEach(function (q) { jouer(s, q); }); });
}

/* Le surplus de sel grandit avec la quantité, et seulement au-delà de 36 g. */
if (!err.length) {
  var depots = [36, 37, 40, 45, 50].map(function (q) { var F = jouer('Sel', q); return F ? F.grains.length : -1; });
  if (depots[0] !== 0) ko('à 36 g, le sel est tout juste dissous : aucun dépôt (' + depots[0] + ')');
  if (depots[1] < 1) ko('à 37 g, il doit rester au moins un grain');
  for (var i = 2; i < depots.length; i++) if (depots[i] < depots[i - 1]) ko('le dépôt de sel doit grandir avec la quantité : ' + depots.join(', '));
}

/* Rejouer redonne exactement la même figure (les grains à la même place). */
function instantane() {
  return JSON.stringify(board.objectsList.filter(function (o) { return o.elType === 'point'; }).map(function (o) {
    return [vis(o), +o.X().toFixed(6), +o.Y().toFixed(6), o.visProp.size, +Number(o.visProp.fillopacity).toFixed(4)];
  }));
}
if (!err.length) {
  jouer('Sable', 30); var a = instantane();
  jouer('Huile', 25);
  jouer('Sable', 30); var b = instantane();
  if (a !== b) ko('rejouer « sable, 30 g » ne redonne pas la même figure');
}

/* Réinitialiser : l'eau seule. */
if (!err.length) {
  remiseAZero(); board.update();
  var F0 = figure();
  if (F0.grains.length || F0.huile || F0.filtrat) ko('après remise à zéro, il ne doit rester que l\'eau');
  if (!/corps pur/.test(F0.textes.verdict || '')) ko('après remise à zéro, le verdict doit redire « corps pur »');
}

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('VERDICT LU SUR LA FIGURE POUR ' + verdictsDeduits + ' MÉLANGES (' + joues + ' SCÉNARIOS JOUÉS), CONFORME AU TEXTE ET AU PROGRAMME, SANS EXCEPTION');
