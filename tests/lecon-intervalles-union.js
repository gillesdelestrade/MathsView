/* La leçon « Union et intersection d'intervalles » (2nde).
 *
 * Ce que la figure affiche — I ∪ J = [3 ; 10], le verdict « 5 ∈ I ∩ J », les
 * deux cases cochées — n'est pas relu tel quel : on RECALCULE l'appartenance à
 * côté, à partir des seules bornes, puis on balaie l'axe. L'écriture produite
 * par la leçon est reparsée en intervalles, et les deux réponses doivent
 * coïncider en TOUT point testé — les bornes exactes comprises, puisque c'est
 * là que les crochets décident.
 *
 * On rejoue aussi le parcours : le point doit s'arrêter sur chaque borne, ne
 * jamais reculer, finir à droite de l'axe, et deux passages successifs doivent
 * donner exactement la même chose (le mode pas-à-pas rejoue les étapes).
 */

/* ------------------------------------------------------------------ */
/* Un JSXGraph de fortune : on garde les objets et on sait les évaluer  */
/* ------------------------------------------------------------------ */
var JXG = { COORDS_BY_USER: 1 };
function val(v) { return typeof v === 'function' ? v() : v; }

var objets = [], majs = [];
function objet(type, parents, attrs) {
  var o = { type: type, parents: parents || [], attrs: attrs || {}, _a: {} };
  o.setAttribute = function (t) { for (var k in t) o._a[k] = t[k]; };
  o.on = function (evt, fn) { (o._ev = o._ev || {})[evt] = fn; };
  if (type === 'point') {
    o._x = parents[0]; o._y = parents[1];
    o.X = function () { return val(o._x); };
    o.Y = function () { return val(o._y); };
    o.setPosition = function (m, c) { o._x = c[0]; o._y = c[1]; };
  }
  if (type === 'text') o.valeur = function () { return String(val(parents[2])); };
  objets.push(o);
  return o;
}
var board = {
  create: function (type, parents, attrs) { return objet(type, parents, attrs); },
  on: function (evt, fn) { if (evt === 'update') majs.push(fn); },
  update: function () { majs.forEach(function (f) { f(); }); }
};

function fauxEl(tag) {
  return { tag: tag, className: '', innerHTML: '', textContent: '', checked: false,
           disabled: false, children: [],
           appendChild: function (c) { this.children.push(c); } };
}
var document = { createElement: fauxEl };

var etapes = null, reset = null, specs = null;
var mv = {
  extras: fauxEl('div'), typeset: function () {}, onCleanup: function () {},
  addControls: function (s) {
    specs = s;
    var refs = {};
    s.forEach(function (c) { refs[c.id] = fauxEl(c.type); });
    return refs;
  },
  createAnimator: function () {
    return {
      cancel: function () {},
      runSteps: function (s, r) { etapes = s; reset = r; }
    };
  }
};

var LECON = null;
var MathsView = { register: function (l) { LECON = l; } };
load('lessons/2nde/intervalles-union-intersection.js');
LECON.setup(board, mv);

/* ------------------------------------------------------------------ */
/* Les poignées de la figure, retrouvées parmi les objets créés         */
/* ------------------------------------------------------------------ */
var bornes = objets.filter(function (o) {
  return o.type === 'point' && o.attrs.size === 5 && o.attrs.strokeWidth === 2;
});
var PT = objets.filter(function (o) {
  return o.type === 'point' && o.attrs.size === 7;
})[0];
var err = [];
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }

if (bornes.length !== 4) ko('on attendait 4 bornes glissantes, on en a trouvé ' + bornes.length);
if (!PT) ko('le point qui parcourt l\'axe est introuvable');
if (!etapes) ko('aucun parcours n\'a été armé au chargement');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); throw new Error('figure inattendue'); }

var PA = bornes[0], PB = bornes[1], QA = bornes[2], QB = bornes[3];
function bouton(id) { return specs.filter(function (s) { return s.id === id; })[0]; }
function texte(re) {
  var t = objets.filter(function (o) { return o.type === 'text' && re.test(o.valeur()); });
  return t.length ? t[t.length - 1].valeur() : null;
}
function sansBalises(h) {
  return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------------ */
/* Le calcul refait à côté                                             */
/* ------------------------------------------------------------------ */
function dans(iv, x) {
  return (iv.cl ? x >= iv.a : x > iv.a) && (iv.cr ? x <= iv.b : x < iv.b);
}
function attendu(I, J, mode, x) {
  return mode === 'union' ? (dans(I, x) || dans(J, x)) : (dans(I, x) && dans(J, x));
}
function nb(t) { return parseFloat(String(t).trim().replace('−', '-').replace(',', '.')); }

/* L'écriture affichée, relue comme une réunion de morceaux. */
function relit(s) {
  s = sansBalises(s);
  if (s === '∅') return [];
  if (s.charAt(0) === '{') return [{ a: nb(s.replace(/[{}]/g, '')), b: nb(s.replace(/[{}]/g, '')),
                                     cl: true, cr: true }];
  return s.split('∪').map(function (m) {
    var t = m.trim();
    var g = t.charAt(0), d = t.charAt(t.length - 1);
    if ((g !== '[' && g !== ']') || (d !== '[' && d !== ']')) throw new Error('écriture illisible : ' + s);
    var corps = t.slice(1, -1).split(';');
    if (corps.length !== 2) throw new Error('écriture illisible : ' + s);
    return { a: nb(corps[0]), b: nb(corps[1]), cl: g === '[', cr: d === ']' };
  });
}
function dansMorceaux(ms, x) {
  return ms.some(function (m) { return dans(m, x); });
}

/* ------------------------------------------------------------------ */
/* Le balayage                                                         */
/* ------------------------------------------------------------------ */
var mode = 'union';
function bascule() { bouton('mode').onClick(); mode = mode === 'union' ? 'inter' : 'union'; }
function pose(a1, b1, a2, b2, cl1, cr1, cl2, cr2) {
  PA.setPosition(JXG.COORDS_BY_USER, [a1, PA.Y()]);
  PB.setPosition(JXG.COORDS_BY_USER, [b1, PB.Y()]);
  QA.setPosition(JXG.COORDS_BY_USER, [a2, QA.Y()]);
  QB.setPosition(JXG.COORDS_BY_USER, [b2, QB.Y()]);
  bouton('cli').onChange(cl1); bouton('cri').onChange(cr1);
  bouton('clj').onChange(cl2); bouton('crj').onChange(cr2);
  return [{ a: a1, b: b1, cl: cl1, cr: cr1 }, { a: a2, b: b2, cl: cl2, cr: cr2 }];
}
function placeX(x) { PT.setPosition(JXG.COORDS_BY_USER, [x, PT.Y()]); board.update(); }

var casVus = 0, vides = 0, deuxMorceaux = 0, singletons = 0, pointsTestes = 0;

for (var a1 = -2; a1 <= 0; a1++) {
  for (var l1 = 2; l1 <= 4; l1 += 2) {
    for (var a2 = a1 - 2; a2 <= a1 + 6; a2 += 2) {
      for (var l2 = 1; l2 <= 5; l2 += 2) {
        for (var c = 0; c < 16; c++) {
          var b1 = a1 + l1, b2 = a2 + l2;
          var iv = pose(a1, b1, a2, b2,
                        !!(c & 1), !!(c & 2), !!(c & 4), !!(c & 8));
          var I = iv[0], J = iv[1];

          [0, 1].forEach(function () {
            casVus++;
            var ecrit;
            try { ecrit = relit(texte(/^I [∪∩] J = /).replace(/^I [∪∩] J = /, '')); }
            catch (e) { ko(e.message); return; }

            if (!ecrit.length) vides++;
            if (ecrit.length === 2) deuxMorceaux++;
            if (ecrit.length === 1 && ecrit[0].a === ecrit[0].b) singletons++;

            // L'écriture affichée décrit-elle EXACTEMENT le bon ensemble ?
            var points = [];
            [I.a, I.b, J.a, J.b].forEach(function (v) {
              points.push(v - 0.5, v - 0.001, v, v + 0.001, v + 0.5);
            });
            for (var x = -8; x <= 11; x += 0.5) points.push(x);
            points.forEach(function (x) {
              pointsTestes++;
              if (dansMorceaux(ecrit, x) !== attendu(I, J, mode, x)) {
                ko('l\'écriture « ' + texte(/^I [∪∩] J = /) + ' » se trompe en x = ' + x +
                   ' (I = ' + JSON.stringify(I) + ', J = ' + JSON.stringify(J) + ')');
              }
            });

            // Le verdict et les deux cases, sous le point
            [I.a, I.b, J.a, J.b, (I.a + J.b) / 2, -7.5, 10.5].forEach(function (x) {
              placeX(x);
              var att = attendu(I, J, mode, x);
              var v = sansBalises(texte(/[∈∉] I [∪∩] J$/));
              if (!v) { ko('verdict introuvable'); return; }
              if ((v.indexOf('∉') >= 0) === att) ko('verdict faux en x = ' + x + ' : « ' + v + ' »');
              var cond = sansBalises(texte(/✓|✗/));
              var voulu = (dans(I, x) ? '✓' : '✗') + (dans(J, x) ? '✓' : '✗');
              var lus = (cond.match(/[✓✗]/g) || []).join('');
              if (lus !== voulu) ko('les deux cases disent « ' + lus + ' » au lieu de « ' +
                                    voulu + ' » en x = ' + x);
              if (cond.indexOf(mode === 'union' ? 'ou' : 'et') < 0)
                ko('le mot de liaison ne correspond pas au mode ' + mode);
            });

            bascule();
          });
        }
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Le parcours : arrêts sur les bornes, sens unique, et rejouable      */
/* ------------------------------------------------------------------ */
function joue() {
  var arrets = [];
  etapes.forEach(function (s) {
    s.step(0); s.step(0.37); s.step(1);
    if (s.after) s.after();
    arrets.push(PT.X());
  });
  return arrets;
}

var CAS_PARCOURS = [
  [3, 6, 4, 10], [-5, -1, 2, 7], [0, 4, 4, 8], [-7, -3, -3, 10], [1, 3, 1, 3]
];
CAS_PARCOURS.forEach(function (k) {
  var iv = pose(k[0], k[1], k[2], k[3], true, true, true, true);
  bouton('play').onClick();
  var attendus = [k[0], k[1], k[2], k[3]]
    .filter(function (v) { return v > -8 && v < 11; })
    .sort(function (p, q) { return p - q; })
    .filter(function (v, i, t) { return i === 0 || v !== t[i - 1]; })
    .concat([11]);

  var arrets = joue();
  if (arrets.join(' ') !== attendus.join(' '))
    ko('le parcours s\'arrête en [' + arrets.join(', ') + '] au lieu de [' +
       attendus.join(', ') + '] pour I = [' + k[0] + ';' + k[1] + '], J = [' +
       k[2] + ';' + k[3] + ']');
  for (var i = 1; i < arrets.length; i++)
    if (arrets[i] < arrets[i - 1]) ko('le point recule pendant le parcours');
  if (PT.X() !== 11) ko('le parcours ne va pas jusqu\'au bout de l\'axe');

  // Rejoué après un retour à zéro, il doit refaire exactement le même chemin.
  reset();
  var bis = joue();
  if (bis.join(' ') !== arrets.join(' '))
    ko('rejouer le parcours ne donne pas le même chemin : [' + bis.join(', ') + ']');
});

/* ------------------------------------------------------------------ */
/* Le tirage : deux intervalles toujours lisibles                      */
/* ------------------------------------------------------------------ */
for (var t = 0; t < 300; t++) {
  bouton('dice').onClick();
  var A = PA.X(), B = PB.X(), C = QA.X(), D = QB.X();
  [A, B, C, D].forEach(function (v) {
    if (v < -7 || v > 10) ko('une borne tirée sort de l\'axe : ' + v);
    if (v !== Math.round(v)) ko('une borne tirée n\'est pas entière : ' + v);
  });
  if (B - A < 1 || D - C < 1) ko('un intervalle tiré est trop étroit : [' + A + ';' + B +
                                 '] et [' + C + ';' + D + ']');
}

/* ------------------------------------------------------------------ */
/* Le bouton « ∅ Intervalles disjoints » : un vrai trou, à chaque fois  */
/* ------------------------------------------------------------------ */
for (var d = 0; d < 300; d++) {
  bouton('gap').onClick();
  var A = PA.X(), B = PB.X(), C = QA.X(), D = QB.X();
  [A, B, C, D].forEach(function (v) {
    if (v < -7 || v > 10) ko('disjoints : une borne sort de l\'axe : ' + v);
    if (v !== Math.round(v)) ko('disjoints : une borne n\'est pas entière : ' + v);
  });
  if (C - B < 1) ko('disjoints : pas de vrai trou entre I et J (' +
                    '[' + A + ';' + B + '] et [' + C + ';' + D + '])');

  // Quel que soit le mode, l'affichage doit dire la disjonction : ∅ pour
  // l'intersection, deux morceaux (et le symbole ∪) pour l'union.
  [0, 1].forEach(function () {
    var ecrit = relit(texte(/^I [∪∩] J = /).replace(/^I [∪∩] J = /, ''));
    if (mode === 'inter' && ecrit.length !== 0)
      ko('disjoints : l\'intersection affichée n\'est pas vide pour ' +
         '[' + A + ';' + B + '] et [' + C + ';' + D + ']');
    if (mode === 'union' && ecrit.length !== 2)
      ko('disjoints : l\'union affichée n\'est pas en deux morceaux pour ' +
         '[' + A + ';' + B + '] et [' + C + ';' + D + ']');
    bascule();
  });
}

print(casVus + ' configurations (bornes et crochets), ' + pointsTestes +
      ' appartenances recalculées, dont ' + vides + ' intersections vides, ' +
      singletons + ' réduites à un point et ' + deuxMorceaux + ' unions en deux morceaux ; ' +
      CAS_PARCOURS.length + ' parcours rejoués deux fois, et 300 tirages disjoints.');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('L\'ÉCRITURE DE I ∪ J ET DE I ∩ J DIT VRAI EN TOUT POINT, ET LE PARCOURS S\'ARRÊTE SUR CHAQUE BORNE');
