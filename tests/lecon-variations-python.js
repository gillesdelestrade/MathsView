/* La leçon « Variations », côté Python.
 *
 * Ce qu'on vérifie n'est pas que le bloc s'affiche, mais qu'il DIT VRAI : pour
 * chacune des fonctions du pool, on exécute le script généré, on lit la colonne de
 * droite, on regarde où elle se retourne réellement — et on compare à la phrase
 * que la leçon écrit sous la console. Une phrase qui annoncerait un minimum là
 * où les nombres n'en montrent pas serait pire que pas de phrase du tout.
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
            setAttribute: function () {},
            querySelector: function (sel) { return this._sous[sel.replace('.', '')] || null; } };
  e.style.setProperty = function () {};
  e._sous = {};
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v; e.children = []; e._sous = {};
      var m, re = /class="([^"]+)"/g;
      while ((m = re.exec(v))) {
        m[1].split(' ').forEach(function (c) {
          if (!e._sous[c]) { var f = fauxEl('div'); f.className = c; e._sous[c] = f; }
        });
      }
    }
  });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

/* ---------------- JSXGraph de poche ---------------- */
var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;
function fauxBoard() {
  var bb = [-6.6, 6.6, 6.6, -6.6];
  return {
    create: function (type, parents, attr) {
      var o = { type: type, parents: parents, attr: attr || {}, _mv: {} };
      o.setAttribute = function (a) { for (var k in a) o.attr[k] = a[k]; };
      o.setText = function () {};
      o.setPosition = function () {};
      o.on = function () {};
      o.X = function () { return typeof parents[0] === 'number' ? parents[0] : 0; };
      return o;
    },
    on: function () {}, update: function () {},
    getBoundingBox: function () { return bb; },
    setBoundingBox: function (b) { bb = b; }
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
load('lessons/2nde/fonctions-variations.js');

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
function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }

try { lecon.setup(board, mv); }
catch (e) { print('setup() a échoué : ' + e + '\n' + (e.stack || '')); throw e; }

var pySection = extras.children[extras.children.length - 1];
if (!pySection || pySection.className !== 'py-section')
  ko('le bloc Python n\'est pas posé');
// on retrouve les morceaux de la console dans l'arbre réellement construit
function parClasse(n, cls, out) {
  out = out || [];
  if (n.className === cls) out.push(n);
  (n.children || []).forEach(function (c) { parClasse(c, cls, out); });
  return out;
}
var code = parClasse(pySection, 'py-code')[0];
var sortie = parClasse(pySection, 'py-sortie')[0];
var lecture = parClasse(pySection, 'py-lecture')[0];
var run = parClasse(pySection, 'py-run')[0];
var reset = parClasse(pySection, 'py-reset')[0];
['py-code', 'py-sortie', 'py-lecture', 'py-run', 'py-reset'].forEach(function (c) {
  if (!parClasse(pySection, c)[0]) ko('la console n\'a pas de « ' + c + ' »');
});

/* les boutons de choix de fonction, dans le premier bloc posé */
var pick = extras.children[0];
var FN = POOL.liste();

function executeEtLis() {
  run.onclick();
  return sortie.textContent.split('\n').filter(function (l) { return l.trim(); });
}

FN.forEach(function (f, i) {
  pick.children[i].onclick();          // choisir cette fonction
  var src = code.value;

  // 1. le script doit tourner
  var r = MathsPython.executer(src);
  if (r.erreur) {
    ko(f.key + ' : le script généré ne tourne pas — ' + MathsPython.messageErreur(r.erreur));
    return;
  }
  if (!r.lignes.length) { ko(f.key + ' : le script n\'affiche rien'); return; }

  // 2. il doit correspondre à la fonction affichée
  var attendu = POOL.tableauPython(f, POOL.defauts(f), { x1: -5, x2: 5, den: 2 });
  if (r.lignes.length !== attendu.length)
    ko(f.key + ' : ' + r.lignes.length + ' lignes contre ' + attendu.length + ' attendues');

  var lignes = executeEtLis();
  if (!lignes.length) ko(f.key + ' : la console reste vide');
  if (sortie.classList.contains('py-ko')) ko(f.key + ' : la console signale une erreur');

  // 3. LA PHRASE doit décrire ce que les nombres font vraiment
  var ys = r.lignes.map(function (L) { return parseFloat(L.split(' ')[1]); });
  var xs = r.lignes.map(function (L) { return parseFloat(L.split(' ')[0]); });
  var retours = [];                    // les x où la colonne change de sens
  for (var k = 1; k < ys.length - 1; k++) {
    var av = ys[k] - ys[k - 1], ap = ys[k + 1] - ys[k];
    if (av < 0 && ap > 0) retours.push({ x: xs[k], creux: true });
    if (av > 0 && ap < 0) retours.push({ x: xs[k], creux: false });
  }
  var txt = lecture.innerHTML || '';
  if (!txt) { ko(f.key + ' : aucune phrase de lecture'); return; }

  if (retours.length === 1) {
    var mot = retours[0].creux ? 'minimum' : 'maximum';
    if (txt.indexOf(mot) < 0)
      ko(f.key + ' : la colonne montre un ' + mot + ', la phrase ne le dit pas → ' + txt);
    var xr = retours[0].x;
    var joli = (Math.round(xr) === xr) ? String(xr) : String(xr).replace('.', ',');
    if (txt.indexOf('x = ' + joli) < 0)
      ko(f.key + ' : le retournement est en x = ' + joli + ', la phrase annonce autre chose → ' + txt);
    if (txt.indexOf(retours[0].creux ? 'diminue' : 'augmente') < 0)
      ko(f.key + ' : la phrase décrit le mauvais sens → ' + txt);
  } else if (retours.length === 0) {
    if (f.trous && f.trous.length) {
      if (txt.indexOf('saute') < 0)
        ko(f.key + ' : le script saute une valeur interdite, la phrase ne le dit pas → ' + txt);
    } else if (txt.indexOf('monotone') < 0) {
      ko(f.key + ' : la colonne ne se retourne pas, la phrase devrait parler de monotonie → ' + txt);
    }
  } else if (txt.indexOf('retourne') < 0) {
    ko(f.key + ' : ' + retours.length + ' retournements, la phrase ne les annonce pas → ' + txt);
  }

  // 4. le script doit sauter les valeurs sans image
  if (f.trous) {
    f.trous.forEach(function (t) {
      if (xs.some(function (x) { return Math.abs(x - t) < 1e-9; }))
        ko(f.key + ' : le script affiche x = ' + t + ', qui n\'a pas d\'image');
    });
  }
});

/* ---------------- le script modifié n'est pas écrasé ---------------- */
pick.children[4].onclick();                       // une fonction quelconque
var origine = code.value;
code.value = origine + '\nprint("mon essai")';
// bouger un paramètre ne doit rien effacer… (fonction sans paramètre : on
// vérifie plutôt via la fonction affine, qui en a)
var iAffine = -1;
FN.forEach(function (f, i) { if (f.params) iAffine = i; });
pick.children[iAffine].onclick();
var gen = code.value;
code.value = gen + '\nprint("mon essai")';
var champs = extras.children[1];                   // la boîte des paramètres
if (champs && champs.children.length) {
  var curseur = null;
  (function cherche(n) {
    if (n.tag === 'input') curseur = n;
    n.children.forEach(cherche);
  })(champs);
  if (curseur) {
    curseur.value = '1';
    curseur.oninput();
    if (code.value.indexOf('mon essai') < 0)
      ko('bouger un curseur efface le script que l\'élève a modifié');
  }
}
// …mais changer de fonction, oui : le script d'avant ne parle plus de rien
pick.children[0].onclick();
if (code.value.indexOf('mon essai') >= 0)
  ko('changer de fonction laisse en place le script de la fonction précédente');

/* ---------------- un script fautif ---------------- */
code.value = 'print(1/0)';
run.onclick();
if (!sortie.classList.contains('py-ko')) ko('un script fautif ne signale pas l\'erreur');
if (sortie.textContent.indexOf('division par zéro') < 0)
  ko('le message d\'erreur ne parvient pas à la console : ' + sortie.textContent);
if (lecture.innerHTML) ko('la phrase de lecture reste affichée après une erreur');

// et la sortie déjà produite est conservée
code.value = 'print("avant")\nprint(1/0)';
run.onclick();
if (sortie.textContent.indexOf('avant') < 0)
  ko('la sortie produite avant l\'erreur est perdue');

// un script qui n'est plus celui de la fonction : pas de phrase de lecture
code.value = 'print(3)';
run.onclick();
if (lecture.innerHTML)
  ko('la leçon commente un script qui n\'est plus le sien');

// le bouton « script d'origine » remet tout d'aplomb
reset.onclick();
if (code.value.indexOf('def f(x):') < 0) ko('le bouton « script d\'origine » ne remet rien');
run.onclick();
if (sortie.classList.contains('py-ko')) ko('le script remis d\'aplomb ne tourne pas');

print(FN.length + ' fonctions vérifiées');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE BLOC PYTHON DIT VRAI POUR TOUTES LES FONCTIONS');
