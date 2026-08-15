/* La leçon « Calculer une expression littérale » (5ème).
 *
 * Deux choses à tenir, et la seconde est celle qui a déjà mordu ailleurs.
 *
 * LES CALCULS. Le dernier nombre affiché doit être celui de la formule. Le test
 * recalcule les six formules DE SON CÔTÉ, sans rien emprunter à la leçon, et
 * compare — pour chaque formule et une trentaine de valeurs de la lettre, y
 * compris négatives.
 *
 * LE REJEU. Le moteur rappelle chaque étape à chaque image, et le mode pas à pas
 * rejoue les étapes précédentes. Une animation qui AJOUTE au DOM au lieu de le
 * reconstruire empile alors les phrases — c'est arrivé, quarante-cinq fois la
 * même ligne. On rejoue donc tout deux fois, à des avancements différents, et on
 * exige un écran identique et aucune phrase en double.
 */
var window = this;
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

/* ---------------- DOM de poche ---------------- */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [], value: '', textContent: '',
            type: '', min: 0, max: 0, step: 0, onclick: null, oninput: null, _sous: {},
            classList: { _l: [],
              add: function (c) { if (this._l.indexOf(c) < 0) this._l.push(c); },
              remove: function (c) { var i = this._l.indexOf(c); if (i >= 0) this._l.splice(i, 1); },
              contains: function (c) { return this._l.indexOf(c) >= 0; },
              toggle: function (c, v) { v ? this.add(c) : this.remove(c); } },
            appendChild: function (c) { this.children.push(c); return c; },
            querySelector: function (sel) { return this._sous[sel.replace('.', '')] || null; } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) {
      e._html = v;
      if (v === '') e.children = [];
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

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/substitution.js');

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  hideBoard: function () { mv._cache = true; },
  addControls: function (specs) { specs.forEach(function (s) { controles[s.id] = s; }); },
  createAnimator: function () {
    return { runSteps: function (steps) { mv._steps = steps; }, cancel: function () {} };
  }
};
MathsView.lecon.setup(null, mv);

var err = [], nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
if (!mv._cache) ko('la figure n\'est pas masquée : cette leçon n\'en a pas');

var bloc = extras.children[0];
var elChoix = bloc._sous['sub-choix'], elCurseurs = bloc._sous['sub-curseurs'];
var elCalcul = bloc._sous['sub-calcul'], elTableau = bloc._sous['sub-tableau'];
var elEtapes = bloc._sous['sub-etapes'];
['sub-choix', 'sub-curseurs', 'sub-calcul', 'sub-tableau', 'sub-etapes'].forEach(function (c) {
  if (!bloc._sous[c]) ko('le panneau n\'a pas de « ' + c + ' »');
});
if (!elChoix || elChoix.children.length !== 6) ko('les six formules ne sont pas proposées');

function jouerTout() {
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
}
function lit(s) { return parseFloat(String(s).replace(/−/g, '-').replace(',', '.')); }
function lignes() {
  return (elCalcul.innerHTML.match(/<div class="sub-ligne[^"]*">([^<]*)<\/div>/g) || [])
    .map(function (d) { return d.replace(/<[^>]+>/g, ''); });
}
function phrases() {
  return (elEtapes.innerHTML.match(/<p class="sub-dit">([\s\S]*?)<\/p>/g) || [])
    .map(function (p) { return p.replace(/<[^>]+>/g, ''); });
}
/* Régler la k-ième lettre. */
function regle(k, v) {
  var input = elCurseurs.children[k].children[1];
  input.value = String(v);
  input.oninput();
}

/* ------------------------------------------------------------------ */
/* Les six formules, recalculées ICI — sans rien emprunter à la leçon  */
/* ------------------------------------------------------------------ */
var PI = 3.14;
var ATTENDU = {
  'Aire d\'un disque': { lettres: ['r'], f: function (v) { return PI * v.r * v.r; },
                         unite: 'cm²', min: 1, max: 15 },
  'Poids d\'un objet': { lettres: ['m'], f: function (v) { return 9.81 * v.m; },
                         unite: 'N', min: 1, max: 50 },
  'Périmètre d\'un rectangle': { lettres: ['L', 'l'],
                                 f: function (v) { return 2 * (v.L + v.l); },
                                 unite: 'cm', min: 2, max: 20 },
  'Aire d\'un triangle': { lettres: ['b', 'h'], f: function (v) { return v.b * v.h / 2; },
                           unite: 'cm²', min: 1, max: 20 },
  'Distance parcourue': { lettres: ['v', 't'], f: function (v) { return v.v * v.t; },
                          unite: 'km', min: 10, max: 130 },
  'Une expression littérale': { lettres: ['x'],
                                f: function (v) { return v.x * v.x - 2 * v.x; },
                                unite: '', min: -5, max: 6 }
};
function arrondi(v) { return Math.round(v * 100) / 100; }

var rnd = MathsAlea(20260817);

Object.keys(ATTENDU).forEach(function (nom, iF) {
  var att = ATTENDU[nom];
  var b = elChoix.children.filter(function (x) { return x.innerHTML === nom; })[0];
  if (!b) { ko('la formule « ' + nom + ' » n\'est pas proposée'); return; }
  b.onclick();
  if (elCurseurs.children.length !== att.lettres.length)
    ko(nom + ' : ' + elCurseurs.children.length + ' curseur(s) au lieu de ' +
       att.lettres.length);

  for (var essai = 0; essai < 25; essai++) {
    var v = {};
    att.lettres.forEach(function (l, k) {
      var input = elCurseurs.children[k].children[1];
      var val = rnd.entier(Number(input.min), Number(input.max));
      v[l] = val;
      regle(k, val);
    });
    jouerTout();
    nb++;

    /* --- 1. le dernier nombre affiché est-il celui de la formule ? --- */
    var L = lignes();
    if (L.length < 3) { ko(nom + ' : seulement ' + L.length + ' lignes de calcul'); continue; }
    var dernier = lit(L[L.length - 1].split('=').pop());
    if (Math.abs(dernier - arrondi(att.f(v))) > 1e-9)
      ko(nom + ' (' + JSON.stringify(v) + ') : la dernière ligne donne ' + dernier +
         ', le calcul donne ' + arrondi(att.f(v)));

    /* --- 2. la phrase de résultat dit-elle la même chose ? ----------- */
    var ph = phrases();
    var res = ph.filter(function (p) { return /Résultat/.test(p); })[0];
    if (!res) ko(nom + ' : aucune phrase de résultat');
    else {
      var m = /Résultat : \w+ = (−?[\d,]+)/.exec(res);
      if (!m) ko(nom + ' : le résultat n\'est pas lisible → ' + res);
      else if (Math.abs(lit(m[1]) - arrondi(att.f(v))) > 1e-9)
        ko(nom + ' : la phrase annonce ' + m[1] + ', le calcul donne ' + arrondi(att.f(v)));
      if (att.unite && res.indexOf(att.unite) < 0)
        ko(nom + ' : l\'unité « ' + att.unite + ' » manque dans le résultat');
    }

    /* --- 3. la ligne de substitution contient bien les valeurs ------- */
    var subst = L[2];
    att.lettres.forEach(function (l) {
      if (subst.indexOf(String(v[l]).replace('-', '−')) < 0)
        ko(nom + ' : la valeur de ' + l + ' (' + v[l] + ') n\'apparaît pas dans la ' +
           'substitution → ' + subst);
      if (v[l] < 0 && subst.indexOf('(' + String(v[l]).replace('-', '−') + ')') < 0)
        ko(nom + ' : la valeur négative de ' + l + ' n\'est pas entre parenthèses → ' + subst);
    });
    // et plus aucune lettre ne traîne dans la ligne substituée
    att.lettres.forEach(function (l) {
      if (new RegExp('(^|[^a-zA-Z])' + l + '([^a-zA-Z]|$)').test(subst.split('=')[1] || ''))
        ko(nom + ' : la lettre ' + l + ' est encore là après substitution → ' + subst);
    });

    /* --- 4. le tableau de valeurs ------------------------------------ */
    var tab = elTableau.innerHTML;
    var cases = (tab.match(/<td>([^<]*)<\/td>/g) || []).map(function (d) {
      return d.replace(/<[^>]+>/g, '');
    });
    if (cases.length !== 6) ko(nom + ' : le tableau n\'a pas 3 colonnes');
    else {
      var xs = cases.slice(0, 3).map(lit), ys = cases.slice(3).map(lit);
      if (xs[0] !== xs[1] && xs[1] !== xs[2] && xs[0] !== xs[2]) {
        xs.forEach(function (x, k) {
          var vv = {};
          att.lettres.forEach(function (l) { vv[l] = v[l]; });
          vv[att.lettres[0]] = x;
          if (Math.abs(ys[k] - arrondi(att.f(vv))) > 1e-9)
            ko(nom + ' : le tableau annonce ' + ys[k] + ' pour ' + att.lettres[0] + ' = ' + x +
               ', le calcul donne ' + arrondi(att.f(vv)));
        });
      } else ko(nom + ' : deux colonnes du tableau ont la même valeur');
    }

    /* --- 5. aucune phrase répétée ------------------------------------ */
    var vues = {};
    ph.forEach(function (p) {
      if (vues[p]) ko(nom + ' : la phrase « ' + p.slice(0, 40) + '… » est affichée deux fois');
      vues[p] = 1;
    });
  }

  /* --- 6. rejouer redonne exactement le même écran ------------------- */
  jouerTout();
  var ecran1 = elCalcul.innerHTML + '|' + elTableau.innerHTML + '|' + elEtapes.innerHTML;
  // on rejoue en passant par des avancements intermédiaires, comme le pas à pas
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
  var ecran2 = elCalcul.innerHTML + '|' + elTableau.innerHTML + '|' + elEtapes.innerHTML;
  if (ecran1 !== ecran2) ko(nom + ' : rejouer l\'animation ne redonne pas le même écran');
  // et une troisième fois, sans remise à zéro entre-temps
  mv._steps.forEach(function (s) { s.step(1); });
  var ecran3 = elCalcul.innerHTML + '|' + elTableau.innerHTML + '|' + elEtapes.innerHTML;
  if (ecran1 !== ecran3) ko(nom + ' : rejouer sans remise à zéro empile quelque chose');
});

/* ------------------------------------------------------------------ */
/* La remise à zéro vide bien tout                                     */
/* ------------------------------------------------------------------ */
controles.reset.onClick();
if (lignes().length || phrases().length || elTableau.innerHTML)
  ko('la remise à zéro laisse quelque chose à l\'écran');

/* Le piège des parenthèses est-il bien montré au moins une fois ? */
elChoix.children.filter(function (x) {
  return x.innerHTML === 'Une expression littérale';
})[0].onclick();
regle(0, -3);
jouerTout();
var L3 = lignes();
if (L3[2].indexOf('(−3) × (−3)') < 0)
  ko('avec x = −3, la substitution n\'écrit pas (−3) × (−3) → ' + L3[2]);
if (Math.abs(lit(L3[L3.length - 1].split('=').pop()) - 15) > 1e-9)
  ko('avec x = −3, x² − 2x devrait valoir 15, or la leçon affiche ' + L3[L3.length - 1]);
if (!phrases().some(function (p) { return /parenthèses/.test(p); }))
  ko('les parenthèses ne sont jamais expliquées');
if (!phrases().some(function (p) { return /signes ×|sous-entendu/.test(p); }))
  ko('le signe × sous-entendu n\'est jamais expliqué');

print(nb + ' calculs vérifiés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE SUBSTITUTION DONNE LE BON NOMBRE, ET LE REJEU N\'EMPILE RIEN');
