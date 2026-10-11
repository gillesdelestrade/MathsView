/*
 * Les matières (js/app.js) : les maths et la physique-chimie dans le même site.
 *
 * Le moteur ne montre qu'une matière à la fois. Tant que seules des leçons de
 * maths sont enregistrées, RIEN ne doit changer : pas de pastille de matière,
 * les sept niveaux, les cinq domaines. Dès qu'une leçon de physique-chimie
 * arrive, les pastilles Maths / Physique-Chimie apparaissent, et chaque matière
 * n'affiche que ses leçons, ses niveaux (pas de physique-chimie en 6ème) et ses
 * domaines (les thèmes du programme). Une adresse directe vers une leçon de
 * l'autre matière fait suivre le menu. Les leçons mal déclarées (matière
 * inconnue, domaine inconnu, niveau que la matière n'a pas) restent visibles
 * et la console le dit.
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
['filters', 'menu', 'cards', 'search', 'home', 'lesson', 'lesson-level', 'lesson-cat',
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
/* 1. Rien que des maths : l'interface d'avant, à l'identique          */
/* ------------------------------------------------------------------ */
MathsView.register(lecon('m1', { level: '4eme', category: 'geometrie', subcategory: 'Triangles', title: 'Pythagore' }));
MathsView.register(lecon('m2', { level: '2nde', category: 'algebre', title: 'Équations' }));
MathsView.register(lecon('m6', { level: '6eme', category: 'calcul', title: 'Fractions' }));
MathsView.start();

if (pastilles('matiere').length) ko('sans leçon de physique-chimie, aucune pastille de matière ne doit apparaître');
if (textes(pastillesNiveau()).join(' ') !== 'Tout 6e 5e 4e 3e 2de 1re Tle')
  ko('niveaux en maths : ' + textes(pastillesNiveau()).join(' '));
if (textes(pastilles('cat')).join(' | ') !== 'Tous domaines | Nombres et calculs | Algèbre | Géométrie | Analyse | Données et hasard')
  ko('domaines en maths : ' + textes(pastilles('cat')).join(' | '));
if (liensMenu().join(',') !== 'Fractions,Pythagore,Équations') ko('menu maths : ' + liensMenu().join(','));
if (avertissements.length) ko('des leçons de maths bien déclarées ne doivent pas faire parler la console : ' + avertissements[0]);

/* ------------------------------------------------------------------ */
/* 2. La physique-chimie arrive                                        */
/* ------------------------------------------------------------------ */
MathsView.register(lecon('p1', { matiere: 'pc', level: '3eme', category: 'mouvement', title: 'Gravitation' }));
MathsView.register(lecon('p2', { matiere: 'pc', level: '2nde', category: 'ondes-bidon', title: 'Son' }));
MathsView.register(lecon('p6', { matiere: 'pc', level: '6eme', category: 'chimie', title: 'Trop tôt' }));
MathsView.register(lecon('z1', { matiere: 'svt', level: '5eme', category: 'calcul', title: 'Cellule' }));

var aPropos = function (id) { return avertissements.filter(function (a) { return a.indexOf(id) >= 0; }); };
if (!aPropos('z1').some(function (a) { return /matière inconnue/.test(a) && /svt/.test(a); }))
  ko('une matière inconnue (svt) doit être signalée en console');
if (!aPropos('p2').some(function (a) { return /catégorie inconnue/.test(a) && /chimie, mouvement, energie, signaux/.test(a); }))
  ko('un domaine inconnu en physique-chimie doit être signalé AVEC la liste des domaines de la matière');
if (!aPropos('p6').some(function (a) { return /6eme/.test(a) && /niveau/.test(a); }))
  ko('la physique-chimie en 6ème doit être signalée');
if (aPropos('p1').length || aPropos('m1').length) ko('une leçon bien déclarée ne doit pas faire parler la console');

cliquer(pastillesNiveau(), 'Tout');          // n'importe quel clic reconstruit les pastilles
var mat = pastilles('matiere');
if (textes(mat).join(' | ') !== 'Maths | Physique-Chimie') ko('pastilles de matière : ' + textes(mat).join(' | '));
if (textes(actives(mat)).join() !== 'Maths') ko('les maths doivent être la matière active au départ');
if (!mat[1] || !mat[1].classList.contains('pc')) ko('la pastille de physique-chimie doit porter la classe « pc »');
if (liensMenu().join(',') !== 'Fractions,Cellule,Pythagore,Équations')
  ko('en maths, le menu doit montrer les maths (et la leçon de matière inconnue, rangée là) : ' + liensMenu().join(','));
if (cartes().indexOf('Gravitation') >= 0) ko('la leçon de physique ne doit pas être sur l\'accueil des maths');

/* ------------------------------------------------------------------ */
/* 3. Côté physique-chimie                                             */
/* ------------------------------------------------------------------ */
cliquer(pastillesNiveau(), '6e');
cliquer(pastilles('cat'), 'Géométrie');
cliquer(pastilles('matiere'), 'Physique-Chimie');
mat = pastilles('matiere');
if (textes(actives(mat)).join() !== 'Physique-Chimie') ko('la pastille Physique-Chimie doit devenir active');
if (textes(pastillesNiveau()).join(' ') !== 'Tout 5e 4e 3e 2de 1re Tle')
  ko('niveaux en physique-chimie (pas de 6ème) : ' + textes(pastillesNiveau()).join(' '));
if (textes(actives(pastillesNiveau())).join() !== 'Tout')
  ko('le filtre « 6e », que la physique-chimie n\'a pas, doit être lâché au changement de matière');
if (textes(pastilles('cat')).join(' | ') !== 'Tous domaines | Matière et transformations | Mouvement et interactions | Énergie et conversions | Ondes et signaux')
  ko('domaines en physique-chimie : ' + textes(pastilles('cat')).join(' | '));
if (textes(actives(pastilles('cat'))).join() !== 'Tous domaines')
  ko('le domaine « Géométrie » doit être lâché au changement de matière');
var mvt = pastilles('cat').filter(function (b) { return b.textContent === 'Mouvement et interactions'; })[0];
if (mvt && !mvt.classList.contains('mouvement')) ko('la pastille du domaine doit porter sa clé en classe (couleur CSS)');

if (liensMenu().join(',') !== 'Trop tôt,Gravitation,Son')
  ko('menu physique-chimie : ' + liensMenu().join(',') + ' (attendu : la 6ème hors programme, puis 3ème, puis 2nde)');
var groupes = menuTextes('menu-group-title');
if (groupes.join(',') !== '6ème,3ème,2nde') ko('groupes de niveau du menu : ' + groupes.join(','));
var domainesMenu = menuTextes('menu-cat');
if (domainesMenu.join(' | ') !== 'Matière et transformations | Mouvement et interactions | Autres')
  ko('domaines du menu physique-chimie : ' + domainesMenu.join(' | ') + ' (le domaine inconnu va dans « Autres »)');
var dotMvt = parId.menu.children.filter(function (x) { return x.classList.contains('menu-cat') && /mouvement/.test(x.innerHTML); });
if (dotMvt.length !== 1) ko('le point de couleur du domaine « mouvement » manque dans le menu');
if (cartes().join(',') !== 'Trop tôt,Gravitation,Son') ko('cartes d\'accueil physique-chimie : ' + cartes().join(','));

/* Le filtre de niveau et la recherche restent dans la matière. */
cliquer(pastillesNiveau(), '3e');
if (liensMenu().join(',') !== 'Gravitation') ko('filtre 3e en physique : ' + liensMenu().join(','));
cliquer(pastillesNiveau(), 'Tout');
parId.search.value = 'gravit';
parId.search.oninput();
if (liensMenu().join(',') !== 'Gravitation') ko('recherche « gravit » en physique : ' + liensMenu().join(','));
cliquer(pastilles('matiere'), 'Maths');
if (liensMenu().length) ko('la recherche « gravit » ne doit rien trouver en maths, trouvé : ' + liensMenu().join(','));
parId.search.value = '';
parId.search.oninput();

/* Revenir aux maths garde le niveau s'il existe des deux côtés. */
cliquer(pastilles('matiere'), 'Physique-Chimie');
cliquer(pastillesNiveau(), '2de');
cliquer(pastilles('matiere'), 'Maths');
if (textes(actives(pastillesNiveau())).join() !== '2de') ko('le filtre « 2de » existe en maths : il doit être conservé');
if (liensMenu().join(',') !== 'Équations') ko('maths filtrées en 2de : ' + liensMenu().join(','));
cliquer(pastillesNiveau(), 'Tout');

/* ------------------------------------------------------------------ */
/* 4. Une adresse directe vers une leçon de l'autre matière            */
/* ------------------------------------------------------------------ */
location.hash = '#p1';
ecouteurs.hashchange();
if (textes(actives(pastilles('matiere'))).join() !== 'Physique-Chimie')
  ko('ouvrir #p1 depuis les maths doit basculer le menu en physique-chimie');
if (parId['lesson-cat'].className !== 'cat-chip mouvement' || parId['lesson-cat'].textContent !== 'Mouvement et interactions')
  ko('fil d\'Ariane de la leçon : « ' + parId['lesson-cat'].className + ' » / « ' + parId['lesson-cat'].textContent + ' »');
if (parId['lesson-level'].textContent !== '3ème') ko('badge de niveau : ' + parId['lesson-level'].textContent);
if (setupAppeles.join() !== 'p1') ko('setup de la leçon appelé : ' + setupAppeles.join());
if (parId.home.hidden !== true || parId.lesson.hidden !== false) ko('la leçon doit être affichée et l\'accueil masqué');
var actifs = document.querySelectorAll('#menu a').filter(function (a) { return a.classList.contains('active'); });
if (actifs.length !== 1 || actifs[0].textContent !== 'Gravitation') ko('le menu doit surligner la leçon ouverte');

location.hash = '#m2';
ecouteurs.hashchange();
if (textes(actives(pastilles('matiere'))).join() !== 'Maths') ko('ouvrir #m2 doit revenir aux maths');
if (parId['lesson-cat'].className !== 'cat-chip algebre') ko('fil d\'Ariane de m2 : ' + parId['lesson-cat'].className);

location.hash = '';
ecouteurs.hashchange();
if (parId.home.hidden !== false) ko('sans adresse, retour à l\'accueil');

/* ------------------------------------------------------------------ */
/* 5. Ce que le moteur expose aux autres modules                       */
/* ------------------------------------------------------------------ */
if (MathsView.domaines() !== MathsView.categories) ko('MathsView.domaines() sans matière doit rendre les domaines des maths');
if (MathsView.domaines('svt') !== MathsView.categories) ko('une matière inconnue retombe sur les domaines des maths');
if (Object.keys(MathsView.domaines('pc')).join() !== 'chimie,mouvement,energie,signaux')
  ko('MathsView.domaines(\'pc\') : ' + Object.keys(MathsView.domaines('pc')).join());
if (!MathsView.matieres || Object.keys(MathsView.matieres).join() !== 'maths,pc') ko('MathsView.matieres doit lister maths puis pc');
if (MathsView.matieres.pc.niveaux.indexOf('6eme') >= 0) ko('la physique-chimie ne doit pas avoir de 6ème');

if (erreursConsole.length) ko('console.error : ' + erreursConsole[0]);

if (err.length) { print('ÉCHEC'); err.forEach(function (e) { print('  ' + e); }); }
else print('DEUX MATIÈRES DANS LE MÊME SITE : INVISIBLE SANS PHYSIQUE, ÉTANCHE AVEC, ET LES ADRESSES DIRECTES SUIVENT');
