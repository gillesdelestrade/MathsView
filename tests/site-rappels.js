/*
 * Les rappels (js/app.js) : une leçon d'un niveau revue dans un autre.
 *
 * Une leçon qui déclare `rappels: ['2nde']` reste une leçon de 5ème — même
 * fichier, même figure, même badge — mais elle réapparaît dans la rubrique de
 * seconde, rangée dans une sous-rubrique « Rappels de 5ème » placée APRÈS les
 * leçons propres à la seconde, dans le menu comme à l'accueil. Le filtre
 * « 2de » la montre, le filtre « 5e » aussi, « Tout » la montre deux fois. Sa
 * page affiche « Rappel en 2nde » à côté de son niveau ; une leçon sans rappel
 * n'affiche rien. Un rappel vers un niveau inconnu, ou vers son propre
 * niveau, est ignoré et la console le dit. Les vraies leçons concernées
 * (hauteurs, médianes, médiatrices de 5ème) doivent déclarer ce rappel.
 *
 * Le moteur est monté sur un DOM de poche, sans JSXGraph (un faux initBoard).
 */
var window = this;
var ecouteurs = {};
window.addEventListener = function (ev, f) { ecouteurs[ev] = f; };
window.removeEventListener = function () {};
window.scrollTo = function () {};
window.location = { hash: '' };
var location = window.location;

var parId = {};
function fauxEl(tag) {
  var classes = [];
  var e = {
    tagName: String(tag).toUpperCase(), _id: '', _html: '', children: [], style: {}, dataset: {},
    value: '', href: '', hidden: false, textContent: '',
    classList: {
      add: function () { for (var i = 0; i < arguments.length; i++) if (classes.indexOf(arguments[i]) < 0) classes.push(arguments[i]); },
      remove: function (c) { var i = classes.indexOf(c); if (i >= 0) classes.splice(i, 1); },
      toggle: function (c, on) { if (on) this.add(c); else this.remove(c); },
      contains: function (c) { return classes.indexOf(c) >= 0; }
    },
    appendChild: function (c) { c.parentNode = this; this.children.push(c); return c; },
    remove: function () {
      var p = this.parentNode; if (!p) return;
      var i = p.children.indexOf(this); if (i >= 0) p.children.splice(i, 1);
    },
    insertAdjacentElement: function (ou, c) { this.parentNode.children.unshift(c); return c; },
    addEventListener: function (ev, f) { this['on' + ev] = f; },
    setAttribute: function () {}
  };
  Object.defineProperty(e, 'className', {
    get: function () { return classes.join(' '); },
    set: function (v) { classes = String(v).split(/\s+/).filter(Boolean); }
  });
  Object.defineProperty(e, 'id', {
    get: function () { return e._id; },
    set: function (v) { if (e._id) delete parId[e._id]; e._id = v; if (v) parId[v] = e; }
  });
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  return e;
}
function descendants(e, out) {
  out = out || [];
  (e.children || []).forEach(function (c) { out.push(c); descendants(c, out); });
  return out;
}
var document = {
  createElement: fauxEl,
  getElementById: function (id) { return parId[id] || null; },
  querySelectorAll: function (sel) {
    if (sel === '#menu a') return descendants(parId.menu).filter(function (x) { return x.tagName === 'A'; });
    return [];
  },
  body: fauxEl('body')
};
window.document = document;
['filters', 'menu', 'cards', 'search', 'home', 'lesson', 'lesson-level', 'lesson-rappel', 'lesson-cat',
 'lesson-title', 'lesson-desc', 'lesson-notes', 'lesson-extras', 'board', 'lesson-fiche']
  .forEach(function (id) { var e = fauxEl(id === 'search' ? 'input' : 'div'); e.id = id; });

/* Un JSXGraph de fortune : le moteur ne doit lui demander que initBoard et freeBoard. */
var tableaux = 0;
var JXG = { JSXGraph: { initBoard: function () { tableaux++; return { id: 'b' + tableaux }; }, freeBoard: function () {} } };
window.JXG = JXG;

var avertissements = [], erreursConsole = [];
var console = {
  log: function () {},
  warn: function () { avertissements.push(Array.prototype.join.call(arguments, ' ')); },
  error: function () { erreursConsole.push(Array.prototype.join.call(arguments, ' ')); }
};
load('js/app.js');

var err = [];
function ko(m) { if (err.length < 20) err.push(m); }

/* ------------------------------------------------------------------ */
/* Lecture de l'interface                                             */
/* ------------------------------------------------------------------ */
function pastilles(cls) {
  return parId.filters.children.filter(function (b) {
    return b.tagName === 'BUTTON' && (!cls || b.classList.contains(cls));
  });
}
function pastillesNiveau() {
  return pastilles().filter(function (b) { return !b.classList.contains('cat') && !b.classList.contains('matiere'); });
}
function textes(liste) { return liste.map(function (b) { return b.textContent; }); }
function actives(liste) { return liste.filter(function (b) { return b.classList.contains('active'); }); }
function cliquer(liste, texte) {
  var b = liste.filter(function (x) { return x.textContent === texte; })[0];
  if (!b) { ko('pas de pastille « ' + texte + ' » (il y a : ' + textes(liste).join(', ') + ')'); return; }
  b.onclick();
}
function liensMenu() { return document.querySelectorAll('#menu a').map(function (a) { return a.textContent; }); }
function menuTextes(cls) {
  return parId.menu.children.filter(function (x) { return x.classList.contains(cls); })
    .map(function (x) { return x.textContent || x.innerHTML.replace(/<[^>]+>/g, ''); });
}
function cartes() {
  return descendants(parId.cards).filter(function (x) { return x.classList.contains('card'); })
    .map(function (c) { return /<h3>([^<]*)<\/h3>/.exec(c.innerHTML)[1]; });
}
function montes() {
  return Object.keys(ecouteurs).length;
}

var setupAppeles = [];
function lecon(id, props) {
  var l = { id: id, title: 'Leçon ' + id, level: '4eme', category: 'geometrie',
            setup: function (board) { setupAppeles.push(id); if (!board) ko(id + ' : setup sans tableau'); } };
  for (var k in props) l[k] = props[k];
  return l;
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Les leçons                                                          */
/* ------------------------------------------------------------------ */
MathsView.register(lecon('h5', { level: '5eme', category: 'geometrie', subcategory: 'Figures planes', title: 'Hauteurs', rappels: ['2nde'] }));
MathsView.register(lecon('m5', { level: '5eme', category: 'geometrie', subcategory: 'Figures planes', title: 'Médianes', rappels: ['2nde'] }));
MathsView.register(lecon('a5', { level: '5eme', category: 'geometrie', subcategory: 'Angles', title: 'Angles' }));
MathsView.register(lecon('c2', { level: '2nde', category: 'geometrie', subcategory: 'Figures planes', title: 'Cercle' }));
MathsView.register(lecon('v2', { level: '2nde', category: 'geometrie', subcategory: 'Vecteurs', title: 'Vecteurs' }));
MathsView.register(lecon('e2', { level: '2nde', category: 'algebre', title: 'Équations' }));
MathsView.start();
if (avertissements.length) ko('des rappels bien déclarés ne doivent pas faire parler la console : ' + avertissements[0]);

function rubriques() {   // le menu, dans l'ordre : titres de classe, domaines, sous-rubriques, liens
  return parId.menu.children.map(function (x) {
    if (x.tagName === 'A') return (x.classList.contains('rappel') ? '*' : '') + x.textContent;
    if (x.classList.contains('menu-group-title')) return '[' + x.textContent + ']';
    if (x.classList.contains('menu-sub')) return '(' + x.textContent + ')';
    return '<' + x.innerHTML.replace(/<[^>]+>/g, '') + '>';
  }).join(' ');
}
function rubriquesAccueil() {
  return descendants(parId.cards).map(function (x) {
    if (x.classList.contains('home-level')) return '[' + x.innerHTML.replace(/<[^>]+>/g, '') + ']';
    if (x.classList.contains('home-sub')) return '(' + x.textContent + ')';
    if (x.classList.contains('card')) return (x.classList.contains('rappel') ? '*' : '') + /<h3>([^<]*)<\/h3>/.exec(x.innerHTML)[1];
    return null;
  }).filter(Boolean).join(' ');
}

/* --- 1. « Tout » : la leçon est dans sa classe ET dans la seconde ------- */
var attenduMenu = '[5ème] <Géométrie> (Figures planes) Hauteurs Médianes (Angles) Angles ' +
                  '[2nde] <Algèbre> Équations <Géométrie> (Figures planes) Cercle (Vecteurs) Vecteurs (Rappels de 5ème) *Hauteurs *Médianes';
if (rubriques() !== attenduMenu) ko('menu « Tout » :\n      ' + rubriques() + '\n      attendu :\n      ' + attenduMenu);
var attenduAccueil = '[5ème] (Figures planes) Hauteurs Médianes (Angles) Angles [2nde] Équations (Figures planes) Cercle (Vecteurs) Vecteurs (Rappels de 5ème) *Hauteurs *Médianes';
if (rubriquesAccueil() !== attenduAccueil) ko('accueil « Tout » :\n      ' + rubriquesAccueil() + '\n      attendu :\n      ' + attenduAccueil);
var lienRappel = document.querySelectorAll('#menu a').filter(function (a) { return a.classList.contains('rappel'); })[0];
if (!lienRappel || lienRappel.href !== '#h5' || lienRappel.dataset.id !== 'h5') ko('le lien de rappel doit pointer sur la leçon elle-même (#h5)');
var cartesRappel = descendants(parId.cards).filter(function (x) { return x.classList.contains('card') && x.classList.contains('rappel'); });
if (cartesRappel.length !== 2 || cartesRappel[0].innerHTML.indexOf('Géométrie › Rappels de 5ème') < 0) ko('la carte de rappel doit porter « Géométrie › Rappels de 5ème »');

/* --- 2. Les filtres de niveau ------------------------------------------- */
cliquer(pastillesNiveau(), '2de');
var attendu2 = '[2nde] <Algèbre> Équations <Géométrie> (Figures planes) Cercle (Vecteurs) Vecteurs (Rappels de 5ème) *Hauteurs *Médianes';
if (rubriques() !== attendu2) ko('menu filtré « 2de » : ' + rubriques());
cliquer(pastillesNiveau(), '5e');
var attendu5 = '[5ème] <Géométrie> (Figures planes) Hauteurs Médianes (Angles) Angles';
if (rubriques() !== attendu5) ko('menu filtré « 5e » : ' + rubriques() + ' — dans sa classe, la leçon n\'est pas un rappel');
cliquer(pastillesNiveau(), '4e');
if (liensMenu().length) ko('en 4e, rien : ' + liensMenu().join(','));
cliquer(pastillesNiveau(), 'Tout');
// Le filtre de domaine et la recherche suivent.
cliquer(pastilles('cat'), 'Algèbre');
if (liensMenu().join(',') !== 'Équations') ko('filtre Algèbre : ' + liensMenu().join(','));
cliquer(pastilles('cat'), 'Tous domaines');
parId.search.value = 'médi'; parId.search.oninput();
if (liensMenu().join(',') !== 'Médianes,Médianes') ko('recherche « médi » : ' + liensMenu().join(',') + ' (une fois en 5ème, une fois en rappel)');
parId.search.value = ''; parId.search.oninput();

/* --- 3. La page de la leçon : « Rappel en 2nde » ------------------------ */
location.hash = '#h5'; ecouteurs.hashchange();
if (parId['lesson-level'].textContent !== '5ème') ko('badge de niveau : ' + parId['lesson-level'].textContent + ' (une leçon rappelée garde son niveau)');
if (parId['lesson-rappel'].hidden || parId['lesson-rappel'].textContent !== 'Rappel en 2nde')
  ko('la page doit dire « Rappel en 2nde » : « ' + parId['lesson-rappel'].textContent + ' », caché : ' + parId['lesson-rappel'].hidden);
var actifs = document.querySelectorAll('#menu a').filter(function (a) { return a.classList.contains('active'); });
if (actifs.length !== 2) ko('la leçon ouverte doit être surlignée à ses deux places du menu (' + actifs.length + ')');
location.hash = '#c2'; ecouteurs.hashchange();
if (!parId['lesson-rappel'].hidden || parId['lesson-rappel'].textContent !== '') ko('une leçon sans rappel ne doit rien afficher : « ' + parId['lesson-rappel'].textContent + ' »');
if (setupAppeles.join(',') !== 'h5,c2') ko('setup appelés : ' + setupAppeles.join(','));

/* --- 4. Rappels mal déclarés : ignorés, et dits ------------------------- */
MathsView.register(lecon('x1', { level: '5eme', category: 'geometrie', title: 'Rappel vers nulle part', rappels: ['cm2', '5eme'] }));
MathsView.register(lecon('x2', { level: '5eme', category: 'geometrie', title: 'Rappel mal typé', rappels: '2nde' }));
if (avertissements.length !== 2) ko('deux avertissements attendus, ' + avertissements.length);
else {
  if (!/x1/.test(avertissements[0]) || !/cm2/.test(avertissements[0]) || !/5eme/.test(avertissements[0])) ko('l\'avertissement doit nommer la leçon et les niveaux fautifs : ' + avertissements[0]);
  if (!/x2/.test(avertissements[1])) ko('un rappel qui n\'est pas une liste doit être signalé : ' + avertissements[1]);
}
location.hash = ''; ecouteurs.hashchange();
cliquer(pastillesNiveau(), '2de');
if (liensMenu().indexOf('Rappel vers nulle part') >= 0 || liensMenu().indexOf('Rappel mal typé') >= 0) ko('un rappel mal déclaré ne doit rappeler nulle part');
cliquer(pastillesNiveau(), '5e');
if (liensMenu().indexOf('Rappel vers nulle part') < 0 || liensMenu().indexOf('Rappel mal typé') < 0) ko('une leçon au rappel mal déclaré reste visible dans sa classe');
if (erreursConsole.length) ko('erreurs console : ' + erreursConsole.join(' | '));

/* --- 5. Les vraies leçons de 5ème le déclarent -------------------------- */
['hauteurs-triangle', 'medianes-triangle', 'mediatrices-triangle', 'bissectrices-triangle'].forEach(function (f) {
  var src = readFile('lessons/5eme/' + f + '.js');
  if (!/rappels:\s*\['2nde'\]/.test(src)) ko(f + ' doit déclarer rappels: [\'2nde\']');
});

/* ------------------------------------------------------------------ */
if (err.length) { print('ÉCHEC — ' + err.length + ' problème(s) :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('Rappels : les leçons de 5ème réapparaissent en 2nde sous « Rappels de 5ème » (menu, accueil, filtres, recherche), la page dit « Rappel en 2nde », les rappels mal déclarés sont ignorés et signalés.');
