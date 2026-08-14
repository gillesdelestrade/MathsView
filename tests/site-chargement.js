/* Le contrôle qui manquait : la page charge-t-elle vraiment tous ses générateurs ?
 *
 * Un fichier d'exercices placé AVANT le module dont il dépend lève une
 * ReferenceError au chargement. Le navigateur ne dit rien de visible : le
 * fichier suivant se charge normalement, et le générateur, lui, ne s'enregistre
 * jamais. La leçon continue d'afficher son bouton « S'entraîner », qui renvoie
 * alors sur la page d'accueil des entraînements — sans message, sans erreur.
 *
 * C'est exactement ce qui est arrivé à `somme-angles.js`, chargé avant
 * `triangle-outils.js`. On rejoue donc ici ce que fait le navigateur : lire les
 * balises <script> de exercices.html DANS L'ORDRE, les exécuter, et vérifier
 * qu'à l'arrivée chaque compétence du catalogue a bien son générateur.
 */
var window = this;

/* Le décor minimal : de quoi qu'un fichier de générateur s'exécute. */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], style: {}, dataset: {},
            value: '', textContent: '', rows: 0, spellcheck: false, type: '',
            classList: { add: function () {}, remove: function () {}, toggle: function () {},
                         contains: function () { return false; } },
            appendChild: function (c) { this.children.push(c); return c; },
            setAttribute: function () {}, querySelector: function () { return null; },
            querySelectorAll: function () { return []; } };
  e.style.setProperty = function () {};
  Object.defineProperty(e, 'innerHTML',
    { get: function () { return e._html; }, set: function (v) { e._html = v; } });
  return e;
}
var document = { createElement: fauxEl, getElementById: function () { return null; } };
window.document = document;
var JXG = { COORDS_BY_USER: 1, JSXGraph: { initBoard: function () { return null; } } };
window.JXG = JXG;

var lecons = [];
var MathsView = { register: function (l) { lecons.push(l); }, fonctions: null };
window.MathsView = MathsView;

var enregistres = [];
var MathsExos = {
  catalogue: [],
  register: function (g) { enregistres.push(g); }
};
window.MathsExos = MathsExos;

/* ------------------------------------------------------------------ */
/* On rejoue les <script> de exercices.html, dans l'ordre              */
/* ------------------------------------------------------------------ */
var html = readFile('exercices.html');
var scripts = [];
var re = /<script src="([^"]+)"/g, m;
while ((m = re.exec(html))) scripts.push(m[1]);

/* Les fichiers de la page qui n'ont rien à voir avec les générateurs et qui
   réclameraient un vrai navigateur : on ne les rejoue pas. */
var HORS_SUJET = /^vendor\/|^js\/(app|reponse|profils|sync-ui|progression|profil-bandeau|exos-base|trophees|boutique|defis)\.js$/;

var err = [], charges = 0;
function ko(m) { if (err.indexOf(m) < 0) err.push(m); }

scripts.forEach(function (f) {
  if (HORS_SUJET.test(f)) return;
  var avant = enregistres.length;
  try {
    load(f);
    charges++;
  } catch (e) {
    ko('« ' + f +' » plante au chargement : ' + (e && e.message ? e.message : e) +
       '\n      → il est probablement placé AVANT le module dont il dépend, ' +
       'dans exercices.html');
    return;
  }
  // un fichier de générateur doit enregistrer quelque chose ; un module d'outils, non
  var estGenerateur = /^exos\/(?!.*outils|catalogue)/.test(f);
  if (estGenerateur && enregistres.length === avant)
    ko('« ' + f + ' » se charge mais n\'enregistre aucun générateur');
});

/* ------------------------------------------------------------------ */
/* Chaque compétence du catalogue a-t-elle son générateur ?            */
/* ------------------------------------------------------------------ */
var parCode = {};
enregistres.forEach(function (g) { parCode[g.competence] = (parCode[g.competence] || 0) + 1; });
MathsExos.catalogue.forEach(function (c) {
  if (!parCode[c.code])
    ko('la compétence « ' + c.code + ' » (' + c.libelle + ') n\'a aucun générateur chargé');
});
var parId = {};
enregistres.forEach(function (g) {
  if (parId[g.id]) ko('deux générateurs portent l\'identifiant « ' + g.id + ' »');
  parId[g.id] = 1;
  if (!MathsExos.catalogue.some(function (c) { return c.code === g.competence; }))
    ko('le générateur « ' + g.id + ' » vise une compétence absente du catalogue : ' +
       g.competence);
});

/* ------------------------------------------------------------------ */
/* Et le lien « S'entraîner » de chaque leçon tombe-t-il sur un id ?   */
/* ------------------------------------------------------------------ */
var htmlLecons = readFile('index.html');
var fichiers = [];
re = /<script src="(lessons\/[^"]+)"/g;
while ((m = re.exec(htmlLecons))) fichiers.push(m[1]);
fichiers.forEach(function (f) {
  var src = readFile(f);
  // la leçon doit d'abord se charger sans broncher
  var avant = lecons.length;
  try { load(f); } catch (e2) {
    ko('la leçon « ' + f + ' » plante au chargement : ' +
       (e2 && e2.message ? e2.message : e2));
    return;
  }
  if (lecons.length === avant) ko('la leçon « ' + f + ' » ne s\'enregistre pas');
  var e = /^\s*exercices:\s*\[([^\]]*)\]/m.exec(src);
  if (!e) return;
  var titre = (/^\s*title:\s*'((?:[^'\\]|\\.)*)'/m.exec(src) || [])[1] || f;
  e[1].split(',').forEach(function (x) {
    var id = x.trim().replace(/^'|'$/g, '');
    if (!id) return;
    if (!parId[id])
      ko('la leçon « ' + titre + ' » renvoie vers « ' + id +
         ' », qui n\'est le nom d\'aucun générateur chargé');
  });
});

print(charges + ' fichiers exécutés, ' + enregistres.length + ' générateurs enregistrés, ' +
      lecons.length + ' leçons chargées, ' + MathsExos.catalogue.length +
      ' compétences au catalogue');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LA PAGE CHARGE TOUS SES GÉNÉRATEURS, ET CHAQUE LIEN TOMBE JUSTE');
