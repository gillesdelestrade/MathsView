/* La leçon « De x à f(x) », côté Python.
 *
 * Le bloc Python promet que « une ligne affichée, c'est une colonne du tableau ».
 * On le vérifie pour chaque fonction du pool et pour les DEUX écritures des x —
 * range(-5, 6) et la liste [-5, …, 5] : on exécute réellement le script généré,
 * on relit les lignes affichées, et on les confronte au tableau de valeurs que la
 * leçon montre (mêmes x, mêmes images, mêmes colonnes barrées). Les deux
 * écritures doivent afficher exactement la même chose : c'est tout leur intérêt.
 */
var window = this;

/* ---------------- DOM de poche ---------------- */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], style: {}, dataset: {},
            value: '', textContent: '', onclick: null, oninput: null, type: '',
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); } },
            appendChild: function (c) { this.children.push(c); return c; },
            addEventListener: function () {},
            setAttribute: function () {} };
  e.style.setProperty = function () {};
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

/* ---------------- JSXGraph de poche ---------------- */
var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;
function fauxBoard() {
  var bb = [-6.5, 6.5, 6.5, -6.5];
  return {
    create: function (type, parents, attr) {
      var o = { type: type, parents: parents, attr: attr || {}, _mv: {} };
      o.setAttribute = function (a) { for (var k in a) o.attr[k] = a[k]; };
      o.moveTo = function () {};
      o.on = function () {};
      o.X = function () { return typeof parents[0] === 'number' ? parents[0] : 3; };
      return o;
    },
    on: function () {}, update: function () {},
    getBoundingBox: function () { return bb; },
    setBoundingBox: function (b) { bb = b; },
    setAttribute: function () {}
  };
}

load('js/alea.js');
load('js/python-mini.js');
load('js/python-console.js');
var MathsView = {
  fonctions: null,
  lecon: null,
  register: function (l) { MathsView.lecon = l; }
};
window.MathsView = MathsView;
load('js/fonctions-base.js');
load('lessons/2nde/fonctions-correspondance.js');

var POOL = MathsView.fonctions;
var lecon = MathsView.lecon;

/* ---------------- montage ---------------- */
var extras = fauxEl('div'), controls = [];
var mv = {
  extras: extras,
  addControls: function (c) { controls = c; },
  createAnimator: function () {
    return { runSteps: function (steps) {
               steps.forEach(function (s) { s.step(1); if (s.after) s.after(); });
             }, cancel: function () {} };
  }
};
var board = fauxBoard();
var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }

try { lecon.setup(board, mv); }
catch (e) { print('setup() a échoué : ' + e + '\n' + (e.stack || '')); throw e; }

var pySection = extras.children[extras.children.length - 1];
if (!pySection || pySection.className !== 'py-section')
  ko('le bloc Python n\'est pas posé');
function parClasse(n, cls, out) {
  out = out || [];
  if (n.className === cls) out.push(n);
  (n.children || []).forEach(function (c) { parClasse(c, cls, out); });
  return out;
}
var code = parClasse(pySection, 'py-code')[0];
var sortie = parClasse(pySection, 'py-sortie')[0];
var lecture = parClasse(pySection, 'py-lecture')[0];
var aide = parClasse(pySection, 'py-aide')[0];
var run = parClasse(pySection, 'py-run')[0];
var reset = parClasse(pySection, 'py-reset')[0];
var choix = parClasse(pySection, 'py-choix')[0];
['py-code', 'py-sortie', 'py-lecture', 'py-aide', 'py-run', 'py-reset', 'py-choix']
  .forEach(function (c) {
    if (!parClasse(pySection, c)[0]) ko('le bloc n\'a pas de « ' + c + ' »');
  });
if (choix && choix.children.length !== 2) ko('il faut deux écritures au choix, range et liste');
var bRange = choix.children[0], bListe = choix.children[1];

/* les boutons de choix de fonction, dans le premier bloc posé */
var pick = extras.children[0];
var FN = POOL.liste();
var XS = [];
for (var k = -5; k <= 5; k++) XS.push(k);

function executeEtLis() {
  run.onclick();
  return sortie.textContent.split('\n').filter(function (l) { return l.trim(); });
}

// Ce que la leçon affiche dans une case f(x) — recalculé ici, à partir du pool.
function attenduPour(f) {
  var p = POOL.defauts(f), out = [];
  XS.forEach(function (x) {
    if (POOL.defini(f, x, p)) out.push({ x: x, y: POOL.valeur(f, x, p) });
  });
  return out;
}

var parEcriture = {};
[{ b: bRange, nom: 'range', motif: /^for x in range\(-5, 6\):$/m },
 { b: bListe, nom: 'liste', motif: /^for x in \[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5\]:$/m }]
.forEach(function (E) {
  E.b.onclick();
  if (!E.b.classList.contains('active')) ko(E.nom + ' : le bouton ne s\'allume pas');
  var attendMot = E.nom === 'liste' ? 'liste' : 'range';
  if ((aide.innerHTML || '').indexOf(attendMot) < 0)
    ko(E.nom + ' : l\'aide ne parle pas de ' + attendMot);
  parEcriture[E.nom] = {};

  FN.forEach(function (f, i) {
    pick.children[i].onclick();          // choisir cette fonction
    var src = code.value;
    if (!E.motif.test(src)) { ko(E.nom + '/' + f.key + ' : la boucle attendue manque dans\n' + src); return; }

    // 1. le script doit tourner
    var r = MathsPython.executer(src);
    if (r.erreur) {
      ko(E.nom + '/' + f.key + ' : le script ne tourne pas — ' + MathsPython.messageErreur(r.erreur));
      return;
    }
    var lignes = executeEtLis();
    if (sortie.classList.contains('py-ko')) ko(E.nom + '/' + f.key + ' : la console signale une erreur');
    parEcriture[E.nom][f.key] = lignes.join('\n');

    // 2. une ligne par colonne non barrée du tableau, mêmes x, mêmes images
    var att = attenduPour(f);
    if (lignes.length !== att.length) {
      ko(E.nom + '/' + f.key + ' : ' + lignes.length + ' lignes contre ' + att.length + ' colonnes');
      return;
    }
    lignes.forEach(function (L, j) {
      var m = L.split(' ');
      var x = parseFloat(m[0]), y = parseFloat(m[1]);
      if (x !== att[j].x) ko(E.nom + '/' + f.key + ' : ligne ' + j + ', x = ' + x + ' au lieu de ' + att[j].x);
      if (Math.abs(y - att[j].y) > 0.006)
        ko(E.nom + '/' + f.key + ' : f(' + x + ') affiché ' + y + ', attendu ' + att[j].y);
    });

    // 3. la phrase annonce le bon nombre de lignes, et les colonnes barrées
    var txt = lecture.innerHTML || '';
    if (!txt) { ko(E.nom + '/' + f.key + ' : aucune phrase de lecture'); return; }
    if (txt.indexOf('<b>' + lignes.length + ' ligne') < 0)
      ko(E.nom + '/' + f.key + ' : la phrase n\'annonce pas ' + lignes.length + ' lignes → ' + txt);
    var barres = XS.length - att.length;
    if (barres && txt.indexOf('saute') < 0)
      ko(E.nom + '/' + f.key + ' : ' + barres + ' colonne(s) barrée(s), la phrase ne le dit pas');
    if (!barres && txt.indexOf('saute') >= 0)
      ko(E.nom + '/' + f.key + ' : la phrase parle d\'une valeur sautée, il n\'y en a pas');
  });
});

/* les deux écritures affichent la même chose */
FN.forEach(function (f) {
  if (parEcriture.range[f.key] !== parEcriture.liste[f.key])
    ko(f.key + ' : range et liste n\'affichent pas la même chose');
});

/* ---------------- une liste, c'est pour choisir ses x ---------------- */
bListe.onclick();
pick.children[0].onclick();                       // l'identité : f(x) = x
code.value = code.value.replace(/for x in \[.*\]:/, 'for x in [-2, 0.5, 2.5]:');
var l2 = executeEtLis();
if (l2.join('|') !== '-2 -2|0.5 0.5|2.5 2.5')
  ko('une liste de x quelconques ne donne pas leurs images : ' + l2.join(' / '));
if (lecture.innerHTML) ko('la leçon commente un script qu\'elle n\'a pas écrit');

/* ---------------- le script modifié n'est pas écrasé ---------------- */
var iAffine = -1;
FN.forEach(function (f, i) { if (f.params) iAffine = i; });
pick.children[iAffine].onclick();
code.value = code.value + '\nprint("mon essai")';
var champs = extras.children[1];
var curseur = null;
(function cherche(n) {
  if (n.tag === 'input') curseur = n;
  n.children.forEach(cherche);
})(champs);
if (!curseur) ko('la fonction affine n\'a pas de curseur');
else {
  curseur.value = '1';
  curseur.oninput();
  if (code.value.indexOf('mon essai') < 0)
    ko('bouger un curseur efface le script que l\'élève a modifié');
  if (code.value.indexOf('1*x') >= 0) ko('le script écrit 1*x');
}
// …mais changer de fonction, oui — et changer d'écriture aussi
pick.children[0].onclick();
if (code.value.indexOf('mon essai') >= 0)
  ko('changer de fonction laisse en place le script de la fonction précédente');
code.value = code.value + '\nprint("mon essai")';
bRange.onclick();
if (code.value.indexOf('mon essai') >= 0)
  ko('changer d\'écriture laisse en place le script de l\'écriture précédente');
if (code.value.indexOf('range(-5, 6)') < 0) ko('le passage à range ne réécrit pas la boucle');
// re-cliquer l'écriture déjà choisie ne touche à rien
code.value = code.value + '\nprint("mon essai")';
bRange.onclick();
if (code.value.indexOf('mon essai') < 0)
  ko('re-choisir la même écriture efface le script modifié');

/* ---------------- un script fautif ---------------- */
code.value = 'print(1/0)';
run.onclick();
if (!sortie.classList.contains('py-ko')) ko('un script fautif ne signale pas l\'erreur');
if (lecture.innerHTML) ko('la phrase de lecture reste affichée après une erreur');

reset.onclick();
if (code.value.indexOf('def f(x):') < 0) ko('le bouton « script d\'origine » ne remet rien');
run.onclick();
if (sortie.classList.contains('py-ko')) ko('le script remis d\'aplomb ne tourne pas');

print(FN.length + ' fonctions × 2 écritures vérifiées');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE BLOC PYTHON DIT VRAI POUR LES DEUX ÉCRITURES');
