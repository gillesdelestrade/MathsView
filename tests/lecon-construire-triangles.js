/* La leçon « Construire un triangle » (5ème).
 *
 * Le sommet C n'est pas placé : il est CALCULÉ, différemment selon les données
 * connues. Le contrôle refait donc le chemin inverse — il relit la position de
 * C dans la figure construite et vérifie que les trois données de départ s'y
 * retrouvent : les longueurs demandées sont les bonnes, les angles demandés
 * aussi. Une erreur de trigonométrie donnerait un triangle parfaitement
 * dessiné, mais qui ne serait pas celui qu'on demandait.
 *
 * On vérifie aussi que les cas IMPOSSIBLES sont reconnus — inégalité
 * triangulaire, somme des angles — et que la figure ne dessine alors rien
 * qu'elle ne puisse justifier.
 */
var window = this;
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

/* ---------------- DOM de poche ---------------- */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], value: '', textContent: '',
            type: '', min: 0, max: 0, step: 0, onclick: null, oninput: null,
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); } },
            appendChild: function (c) { this.children.push(c); return c; } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; if (v === '') e.children = []; }
  });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

/* ---------------- JSXGraph de poche ---------------- */
var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;
var objets = [];
function fauxBoard() {
  var surUpdate = [];
  return {
    create: function (type, parents, attr) {
      var o = { type: type, parents: parents, attr: attr || {},
                visible: !(attr && attr.visible === false), txt: '' };
      o.setAttribute = function (a) {
        for (var k in a) o.attr[k] = a[k];
        if ('visible' in a) o.visible = a.visible;
      };
      o.setText = function (t) { o.txt = t; };
      o.setPosition = function () {};
      objets.push(o);
      return o;
    },
    on: function (ev, f) { if (ev === 'update') surUpdate.push(f); },
    update: function () { surUpdate.forEach(function (f) { f(); }); },
    getBoundingBox: function () { return [-3.4, 7.6, 12.6, -3.4]; },
    setBoundingBox: function () {}
  };
}

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/construire-triangles.js');

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  addControls: function (specs) { specs.forEach(function (s) { controles[s.id] = s; }); },
  createAnimator: function () {
    return { runSteps: function (steps) { mv._steps = steps; }, cancel: function () {} };
  }
};
var board = fauxBoard();
MathsView.lecon.setup(board, mv);

var err = [], nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function d2(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function angleEn(s, u, v) {
  var a = [u[0] - s[0], u[1] - s[1]], b = [v[0] - s[0], v[1] - s[1]];
  var c = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]));
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
}

var choix = extras.children[0], curseurs = extras.children[1], panneau = extras.children[2];
if (!choix || choix.children.length !== 3) ko('les trois cas ne sont pas proposés');

/* les points nommés, relus dans la figure */
function pointNomme(n) {
  var o = objets.filter(function (x) { return x.type === 'point' && x.attr.name === n; })[0];
  if (!o) return null;
  return [typeof o.parents[0] === 'function' ? o.parents[0]() : o.parents[0],
          typeof o.parents[1] === 'function' ? o.parents[1]() : o.parents[1]];
}
function ptC() {
  return objets.filter(function (x) { return x.type === 'point' && x.attr.name === 'C'; })[0];
}
function jouerTout() {
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
  board.update();
}
/* Régler un curseur, comme l'élève le ferait. */
function regle(i, v) {
  var lab = curseurs.children[i];
  var input = lab.children[1];
  input.value = String(v);
  input.oninput();
}

/* ------------------------------------------------------------------ */
/* Les trois cas, sur beaucoup de jeux de données                      */
/* ------------------------------------------------------------------ */
var rnd = MathsAlea(20260815);

for (var k = 0; k < 3; k++) {
  choix.children[k].onclick();                 // choisir le cas
  var nomCas = ['lll', 'lal', 'ala'][k];
  if (curseurs.children.length !== 3) { ko(nomCas + ' : il n\'y a pas trois curseurs'); continue; }

  for (var essai = 0; essai < 120; essai++) {
    // des données au hasard, dans les plages des curseurs
    var v = [];
    if (nomCas === 'lll') v = [rnd.entier(8, 18) / 2, rnd.entier(4, 16) / 2, rnd.entier(4, 16) / 2];
    if (nomCas === 'lal') v = [rnd.entier(8, 18) / 2, rnd.entier(4, 26) * 5, rnd.entier(4, 16) / 2];
    if (nomCas === 'ala') v = [rnd.entier(8, 18) / 2, rnd.entier(3, 28) * 5, rnd.entier(3, 28) * 5];
    if (nomCas === 'lal') v[1] = Math.max(20, Math.min(130, v[1]));
    if (nomCas === 'ala') { v[1] = Math.max(15, Math.min(140, v[1]));
                            v[2] = Math.max(15, Math.min(140, v[2])); }
    regle(0, v[0]); regle(1, v[1]); regle(2, v[2]);
    jouerTout();
    nb++;

    var A = pointNomme('A'), B = pointNomme('B'), C = pointNomme('C');
    var visible = ptC().visible;

    if (Math.abs(A[0]) > 1e-9 || Math.abs(A[1]) > 1e-9) ko(nomCas + ' : A n\'est pas à l\'origine');
    if (Math.abs(B[0] - v[0]) > 1e-9 || Math.abs(B[1]) > 1e-9)
      ko(nomCas + ' : B n\'est pas à ' + v[0] + ' cm de A sur l\'horizontale');

    /* -- le cas est-il possible ? on le sait indépendamment ---------- */
    var faisable;
    if (nomCas === 'lll') {
      faisable = v[1] + v[2] > v[0] && v[0] + v[2] > v[1] && v[0] + v[1] > v[2];
    } else if (nomCas === 'lal') {
      faisable = true;                         // deux côtés et l'angle entre eux : toujours
    } else {
      faisable = v[1] + v[2] < 180;
    }
    if (faisable !== visible)
      ko(nomCas + ' (' + v.join(' / ') + ') : le triangle est ' +
         (faisable ? 'constructible' : 'impossible') + ', or la figure ' +
         (visible ? 'le trace' : 'ne le trace pas'));

    if (!faisable) {
      // le bandeau doit EXPLIQUER, pas seulement se taire
      if (!/inégalité triangulaire|180°/.test(panneau.innerHTML))
        ko(nomCas + ' : le triangle est impossible, mais le bandeau ne dit pas pourquoi');
      continue;
    }

    /* -- les données de départ se retrouvent-elles sur la figure ? --- */
    var AB = d2(A, B), AC = d2(A, C), BC = d2(B, C);
    if (nomCas === 'lll') {
      if (Math.abs(AC - v[1]) > 1e-9)
        ko('lll : AC vaut ' + AC.toFixed(3) + ' au lieu de ' + v[1]);
      if (Math.abs(BC - v[2]) > 1e-9)
        ko('lll : BC vaut ' + BC.toFixed(3) + ' au lieu de ' + v[2]);
    }
    if (nomCas === 'lal') {
      if (Math.abs(AC - v[2]) > 1e-9)
        ko('lal : AC vaut ' + AC.toFixed(3) + ' au lieu de ' + v[2]);
      if (Math.abs(angleEn(A, B, C) - v[1]) > 1e-6)
        ko('lal : l\'angle en A vaut ' + angleEn(A, B, C).toFixed(2) + '° au lieu de ' + v[1]);
    }
    if (nomCas === 'ala') {
      if (Math.abs(angleEn(A, B, C) - v[1]) > 1e-6)
        ko('ala : l\'angle en A vaut ' + angleEn(A, B, C).toFixed(2) + '° au lieu de ' + v[1]);
      if (Math.abs(angleEn(B, A, C) - v[2]) > 1e-6)
        ko('ala : l\'angle en B vaut ' + angleEn(B, A, C).toFixed(2) + '° au lieu de ' + v[2]);
    }
    // C est toujours au-dessus de [AB] : la figure ne doit pas se retourner
    if (C[1] <= 0) ko(nomCas + ' : le sommet C est sous le côté [AB]');

    /* Les demi-droites TRACÉES doivent passer par C. Vérifier l'angle calculé
       ne suffit pas : le sommet peut être juste et le trait partir du mauvais
       côté — c'est exactement ce qui arrivait à la demi-droite issue de B. */
    objets.filter(function (o) {
      return o.type === 'curve' && o.visible && o.attr.strokeColor === '#ea580c' &&
             o.attr.strokeWidth === 2.2;
    }).forEach(function (o) {
      var p0 = [o.parents[0](0), o.parents[1](0)];
      var p1 = [o.parents[0](1), o.parents[1](1)];
      var dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      var ecart = Math.abs(dx * (C[1] - p0[1]) - dy * (C[0] - p0[0])) / Math.hypot(dx, dy);
      var sens = (C[0] - p0[0]) * dx + (C[1] - p0[1]) * dy;
      if (ecart > 1e-6 || sens < 0)
        ko(nomCas + ' : une demi-droite tracée depuis (' + p0.map(function (z) {
          return z.toFixed(1); }).join(' ; ') + ') ne passe pas par C');
    });

    /* -- le bilan affiché est-il celui de la figure ? ---------------- */
    var mesures = panneau.innerHTML.match(/<b>([\d,]+) cm<\/b>/g) || [];
    if (mesures.length >= 3) {
      var lues = mesures.slice(0, 3).map(function (x) {
        return parseFloat(x.replace(/<[^>]+>|\s|cm/g, '').replace(',', '.'));
      });
      [AB, AC, BC].forEach(function (vrai, i) {
        if (Math.abs(lues[i] - Math.round(vrai * 10) / 10) > 1e-9)
          ko(nomCas + ' : le bandeau annonce ' + lues[i] + ' cm là où la figure en mesure ' +
             (Math.round(vrai * 10) / 10));
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* Le programme de construction suit le cas choisi                     */
/* ------------------------------------------------------------------ */
[['lll', 'arc de cercle'], ['lal', 'rapporteur'], ['ala', 'rapporteur']]
  .forEach(function (c, i) {
    choix.children[i].onclick();
    jouerTout();
    if (panneau.innerHTML.indexOf(c[1]) < 0)
      ko(c[0] + ' : le programme de construction ne parle pas de « ' + c[1] + ' »');
    if ((panneau.innerHTML.match(/<li/g) || []).length < 4)
      ko(c[0] + ' : le programme a moins de quatre étapes');
  });
// le compas n'a rien à faire dans un cas sans longueur à reporter
choix.children[2].onclick(); jouerTout();
if (/arc de cercle/.test(panneau.innerHTML))
  ko('ala : le programme parle d\'un arc de cercle alors qu\'on n\'a que des angles');

/* ------------------------------------------------------------------ */
/* Rejouer ne change rien, et ne crée aucun objet                      */
/* ------------------------------------------------------------------ */
choix.children[0].onclick();
jouerTout();
var avantC = pointNomme('C').slice(), avantObjets = objets.length;
controles.play.onClick();
mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
board.update();
var apresC = pointNomme('C');
if (d2(avantC, apresC) > 1e-12) ko('rejouer l\'animation déplace le sommet C');
if (objets.length !== avantObjets)
  ko('l\'animation crée ' + (objets.length - avantObjets) + ' objets de plus à chaque tour');

/* Les étapes intermédiaires ne montrent pas la fin avant l'heure. */
controles.reset.onClick();
mv._steps[0].step(1); board.update();
if (ptC().visible) ko('le sommet C est montré avant d\'avoir été construit');

print(nb + ' jeux de données vérifiés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES TROIS CONSTRUCTIONS DONNENT LE TRIANGLE DEMANDÉ');
