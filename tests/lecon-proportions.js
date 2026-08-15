/* La leçon « Déterminer une proportion, un pourcentage » (5ème).
 *
 * Deux exigences.
 *
 * LES NOMBRES. Le pourcentage affiché doit être partie × 100 ÷ tout, la
 * fraction simplifiée doit être irréductible ET égale à la fraction de départ,
 * et le complément doit compléter à 100. Le test refait ces calculs de son côté,
 * pour les quatre situations et toutes les valeurs de la partie — de 0 au tout.
 *
 * LE DESSIN. Les deux grilles portent l'essentiel du sens : la première doit
 * avoir autant de carreaux que le tout et autant de coloriés que la partie ; la
 * seconde doit en avoir exactement CENT, dont autant de coloriés que le
 * pourcentage. Une grille qui ne dirait pas la même chose que le calcul serait
 * pire qu'inutile.
 *
 * Et le rejeu : chaque étape est rappelée à chaque image et le mode pas à pas
 * les rejoue — l'écran doit se reconstruire à l'identique, sans phrase empilée.
 */
var window = this;
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

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
load('lessons/5eme/proportions.js');

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
var elChoix = bloc._sous['pro-choix'], elCurseur = bloc._sous['pro-curseur'];
var elG1 = bloc._sous['pro-g1'], elG2 = bloc._sous['pro-g2'];
var elCalcul = bloc._sous['pro-calcul'], elComp = bloc._sous['pro-comparaison'];
var elEtapes = bloc._sous['pro-etapes'];
['pro-choix', 'pro-curseur', 'pro-g1', 'pro-g2', 'pro-calcul', 'pro-comparaison',
 'pro-etapes'].forEach(function (c) {
  if (!bloc._sous[c]) ko('le panneau n\'a pas de « ' + c + ' »');
});
if (!elChoix || elChoix.children.length !== 4) ko('les quatre situations ne sont pas proposées');

function jouerTout() {
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
}
function regle(v) {
  var input = elCurseur.children[0].children[1];
  input.value = String(v);
  input.oninput();
}
/* Une grille : combien de carreaux, combien de coloriés ? */
function grille(html, couleur) {
  var cases = html.match(/<rect [^>]*fill="([^"]+)"\/>/g) || [];
  return { total: cases.length,
           colories: cases.filter(function (c) { return c.indexOf(couleur) >= 0; }).length };
}
function lignes() {
  return (elCalcul.innerHTML.match(/<div class="pro-ligne[^"]*">([\s\S]*?)<\/div>/g) || [])
    .map(function (d) { return d.replace(/<[^>]+>/g, ''); });
}
function phrases() {
  return (elEtapes.innerHTML.match(/<p class="pro-dit">([\s\S]*?)<\/p>/g) || [])
    .map(function (p) { return p.replace(/<[^>]+>/g, ''); });
}
function lit(s) { return parseFloat(String(s).replace(',', '.')); }

/* ------------------------------------------------------------------ */
/* Les quatre situations, recalculées ici                              */
/* ------------------------------------------------------------------ */
function pgcd(a, b) { return b ? pgcd(b, a % b) : Math.abs(a); }
var TOTAUX = { 'Une classe': 25, 'Un panier de fruits': 40, 'Des tirs au but': 20,
               'Un sondage': 50 };

Object.keys(TOTAUX).forEach(function (nom) {
  var n = TOTAUX[nom];
  var b = elChoix.children.filter(function (x) { return x.innerHTML === nom; })[0];
  if (!b) { ko('la situation « ' + nom + ' » n\'est pas proposée'); return; }
  b.onclick();

  for (var p = 0; p <= n; p++) {
    regle(p);
    jouerTout();
    nb++;
    var pc = p * 100 / n;

    /* --- 1. la grille de la situation -------------------------------- */
    var g1 = grille(elG1.innerHTML, '#2563eb');
    if (g1.total !== n)
      ko(nom + ' : la grille a ' + g1.total + ' carreaux au lieu de ' + n);
    if (g1.colories !== p)
      ko(nom + ' (' + p + '/' + n + ') : ' + g1.colories + ' carreaux coloriés au lieu de ' + p);

    /* --- 2. la grille de cent ---------------------------------------- */
    var g2 = grille(elG2.innerHTML, '#16a34a');
    if (g2.total !== 100)
      ko(nom + ' : la grille « sur cent » a ' + g2.total + ' carreaux');
    if (g2.colories !== Math.round(pc))
      ko(nom + ' (' + p + '/' + n + ') : ' + g2.colories + ' carreaux sur cent au lieu de ' +
         Math.round(pc));

    /* --- 3. le pourcentage annoncé ----------------------------------- */
    var L = lignes();
    var ligneP = L.filter(function (l) { return /%$/.test(l.trim()); })[0];
    if (!ligneP) ko(nom + ' : aucune ligne ne donne le pourcentage');
    else if (Math.abs(lit(ligneP) - pc) > 1e-9)
      ko(nom + ' (' + p + '/' + n + ') : le pourcentage affiché est ' + ligneP +
         ' au lieu de ' + pc);

    /* --- 4. la fraction simplifiée ----------------------------------- */
    var simp = L.filter(function (l) { return /^\d+\/\d+ = \d+\/\d+$/.test(l.trim()); })[0];
    var g = pgcd(p, n) || 1;
    if (g > 1 && p > 0) {
      if (!simp) ko(nom + ' (' + p + '/' + n + ') : la simplification manque');
      else {
        var m = /(\d+)\/(\d+) = (\d+)\/(\d+)/.exec(simp);
        var a2 = +m[3], b2 = +m[4];
        if (a2 * n !== p * b2)
          ko(nom + ' (' + p + '/' + n + ') : ' + a2 + '/' + b2 + ' n\'est pas égal à ' +
             p + '/' + n);
        if (pgcd(a2, b2) !== 1)
          ko(nom + ' (' + p + '/' + n + ') : ' + a2 + '/' + b2 + ' n\'est pas irréductible');
      }
    }

    /* --- 5. le complément -------------------------------------------- */
    var ph = phrases();
    var comp = ph.filter(function (x) { return /reste/i.test(x); })[0];
    if (!comp) ko(nom + ' : le complément n\'est pas donné');
    else {
      var mc = /soit ([\d,]+) %/.exec(comp);
      if (!mc) ko(nom + ' : le complément est illisible → ' + comp);
      else if (Math.abs(lit(mc[1]) - (100 - pc)) > 1e-9)
        ko(nom + ' (' + p + '/' + n + ') : le complément annoncé est ' + mc[1] +
           ' % au lieu de ' + (100 - pc));
    }

    /* --- 6. aucune phrase répétée ------------------------------------ */
    var vues = {};
    ph.forEach(function (x) {
      if (vues[x]) ko(nom + ' : une phrase est affichée deux fois');
      vues[x] = 1;
    });
  }

  /* --- 7. rejouer redonne le même écran ----------------------------- */
  regle(Math.round(n / 3));
  jouerTout();
  var ecran = elG1.innerHTML + '|' + elG2.innerHTML + '|' + elCalcul.innerHTML + '|' +
              elEtapes.innerHTML;
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
  var ecran2 = elG1.innerHTML + '|' + elG2.innerHTML + '|' + elCalcul.innerHTML + '|' +
               elEtapes.innerHTML;
  if (ecran !== ecran2) ko(nom + ' : rejouer l\'animation ne redonne pas le même écran');
});

/* ------------------------------------------------------------------ */
/* La comparaison                                                      */
/* ------------------------------------------------------------------ */
elChoix.children[0].onclick();          // une classe, 25
regle(15);
jouerTout();
if (elComp.innerHTML) ko('la comparaison est affichée sans être demandée');
controles.comp.onChange(true);
var h = elComp.innerHTML;
if (!h) ko('cocher « Comparer » n\'affiche rien');
else {
  var vals = (h.match(/<div class="pro-comp-val">([\d,]+) %<\/div>/g) || []).map(function (d) {
    return lit(d.replace(/<[^>]+>/g, ''));
  });
  if (vals.length !== 2) ko('la comparaison ne montre pas deux pourcentages');
  else {
    if (Math.abs(vals[0] - 60) > 1e-9)
      ko('la comparaison annonce ' + vals[0] + ' % pour 15 sur 25');
    var labs = (h.match(/<div class="pro-comp-lab">(\d+) sur (\d+)<\/div>/g) || [])
      .map(function (d) {
        var m2 = /(\d+) sur (\d+)/.exec(d);
        return [+m2[1], +m2[2]];
      });
    if (labs.length !== 2) ko('la comparaison ne nomme pas les deux situations');
    else {
      if (labs[0][1] === labs[1][1])
        ko('les deux situations comparées ont le même total — il n\'y a rien à montrer');
      labs.forEach(function (l, k) {
        if (Math.abs(l[0] * 100 / l[1] - vals[k]) > 1e-9)
          ko('la comparaison annonce ' + vals[k] + ' % pour ' + l[0] + ' sur ' + l[1]);
      });
    }
  }
}
controles.comp.onChange(false);
if (elComp.innerHTML) ko('décocher « Comparer » ne masque pas la comparaison');

/* ------------------------------------------------------------------ */
/* Remise à zéro                                                       */
/* ------------------------------------------------------------------ */
controles.reset.onClick();
if (lignes().length || phrases().length || elG1.innerHTML || elG2.innerHTML)
  ko('la remise à zéro laisse quelque chose à l\'écran');

print(nb + ' proportions vérifiées');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES GRILLES, LES FRACTIONS ET LES POURCENTAGES DISENT TOUS LA MÊME CHOSE');
