/* La leçon « Inéquations reliées par « et » ou « ou » » (2nde).
 *
 * Ce que la figure affiche — « S = ]3 ; 5[ », le verdict « 4 ∈ S », les deux
 * coches — n'est pas relu tel quel. On repart des DEUX INÉQUATIONS, telles
 * qu'elles sont tapées dans la saisie, et on recalcule l'appartenance à côté,
 * nombre par nombre, en appliquant « et » ou « ou » à la lettre. L'écriture de
 * S produite par la leçon est reparsée en morceaux, et les deux réponses
 * doivent coïncider en TOUT point testé — bornes exactes comprises, puisque
 * c'est là que les crochets décident. On passe ainsi en revue toutes les
 * formes de conditions (x > a, x ⩽ b, a < x < b, strictes ou larges) croisées
 * deux à deux, avec « et » puis avec « ou ».
 *
 * Les quatre réponses qui font le chapitre doivent toutes être rencontrées :
 * un intervalle, ∅, deux morceaux, ℝ — et la figure doit les écrire ainsi.
 *
 * Puis les trois étapes sont rejouées : rien avant la première (figure
 * vierge), une barre après la première, deux après la deuxième, S après la
 * troisième ; et « Précédent » (remise à zéro puis rejeu) redonne exactement
 * le même écran. Enfin la saisie refuse ce qu'elle ne sait pas lire, sans
 * toucher à la figure.
 */

/* ------------------------------------------------------------------ */
/* Un JSXGraph de fortune : on garde les objets et on sait les évaluer  */
/* ------------------------------------------------------------------ */
var JXG = { COORDS_BY_USER: 1 };
function val(v) { return typeof v === 'function' ? v() : v; }

var objets = [];
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
  if (type === 'segment') {
    o.x1 = function () { return parents[0].X(); };
    o.x2 = function () { return parents[1].X(); };
  }
  objets.push(o);
  return o;
}
var majs = 0;
var board = {
  create: function (type, parents, attrs) { return objet(type, parents, attrs); },
  on: function () {},
  update: function () { majs++; }
};
// Visible = l'attribut posé par la leçon, sinon celui de la création.
function visible(o) {
  if ('visible' in o._a) return o._a.visible === true;
  return o.attrs.visible !== false;
}

function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', textContent: '', value: '', checked: false,
            disabled: false, children: [], type: '', placeholder: '', attrs: {},
            appendChild: function (c) { this.children.push(c); return c; },
            setAttribute: function (k, v) { this.attrs[k] = v; } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; },
    set: function (v) { e._html = v; e.children = []; }
  });
  return e;
}
var document = { createElement: fauxEl };

var etapes = null, reset = null, specs = null;
var extras = fauxEl('div');
var mv = {
  extras: extras, typeset: function () {}, onCleanup: function () {},
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
load('lessons/2nde/intervalles-et-ou.js');
LECON.setup(board, mv);

/* ------------------------------------------------------------------ */
/* Les poignées                                                        */
/* ------------------------------------------------------------------ */
var err = [];
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }

function parClasse(cls) {
  var out = [];
  (function walk(e) {
    if (e.className && e.className.split(' ').indexOf(cls) >= 0) out.push(e);
    (e.children || []).forEach(walk);
  })(extras);
  return out;
}
function parTag(tag) {
  var out = [];
  (function walk(e) { if (e.tag === tag) out.push(e); (e.children || []).forEach(walk); })(extras);
  return out;
}
var presets = parClasse('ineq-preset');
var saisie = parClasse('ineq-saisie')[0];
var boutons = parClasse('eq-rand');
var tracer = boutons[0], de = boutons[1];
var note = parClasse('eq-note')[0];
var panneau = parClasse('props-panel')[0];
var PT = objets.filter(function (o) { return o.type === 'point' && o.attrs.size === 7; })[0];
var bornes = objets.filter(function (o) {
  return o.type === 'point' && o.attrs.size === 5 && o.attrs.strokeWidth === 2;
});
function bouton(id) { return specs.filter(function (s) { return s.id === id; })[0]; }
function texte(re) {
  var t = objets.filter(function (o) { return o.type === 'text' && re.test(o.valeur()); });
  return t.length ? t[t.length - 1] : null;
}
// Le texte posé à une hauteur donnée : la ligne des deux coches est à y = −2,5.
function texteEn(y) {
  return objets.filter(function (o) { return o.type === 'text' && o.parents[1] === y; })[0];
}
function sansBalises(h) {
  return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

if (presets.length !== 7) ko('7 préréglages attendus, ' + presets.length + ' trouvés');
if (!saisie) ko('la zone de saisie est introuvable');
if (!tracer || !de) ko('les boutons « Tracer » et « 🎲 » sont introuvables');
if (!PT) ko('le point de test est introuvable');
if (bornes.length !== 4) ko('4 bornes glissantes attendues, ' + bornes.length);
if (!etapes || etapes.length !== 3) ko('trois étapes attendues au chargement');
if (!bouton('lien') || !bouton('play') || !bouton('tout')) ko('il manque un bouton de contrôle');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); throw new Error('figure inattendue'); }

/* ------------------------------------------------------------------ */
/* Le calcul refait à côté, depuis les inéquations                    */
/* ------------------------------------------------------------------ */
var FORMES = [
  { s: function (a, b) { return 'x>' + a; },         f: function (a, b) { return { a: a, b: Infinity, oa: true, ob: true }; } },
  { s: function (a, b) { return 'x>=' + a; },        f: function (a, b) { return { a: a, b: Infinity, oa: false, ob: true }; } },
  { s: function (a, b) { return 'x<' + b; },         f: function (a, b) { return { a: -Infinity, b: b, oa: true, ob: true }; } },
  { s: function (a, b) { return 'x<=' + b; },        f: function (a, b) { return { a: -Infinity, b: b, oa: true, ob: false }; } },
  { s: function (a, b) { return a + '<x<' + b; },    f: function (a, b) { return { a: a, b: b, oa: true, ob: true }; } },
  { s: function (a, b) { return a + '<=x<' + b; },   f: function (a, b) { return { a: a, b: b, oa: false, ob: true }; } },
  { s: function (a, b) { return a + '<x<=' + b; },   f: function (a, b) { return { a: a, b: b, oa: true, ob: false }; } },
  { s: function (a, b) { return a + '<=x<=' + b; },  f: function (a, b) { return { a: a, b: b, oa: false, ob: false }; } }
];
function dans(c, x) { return (c.oa ? x > c.a : x >= c.a) && (c.ob ? x < c.b : x <= c.b); }
function attendu(c1, c2, lien, x) {
  return lien === 'et' ? (dans(c1, x) && dans(c2, x)) : (dans(c1, x) || dans(c2, x));
}
function nb(t) {
  t = String(t).trim().replace('−', '-').replace(',', '.');
  if (t === '-∞') return -Infinity;
  if (t === '+∞') return Infinity;
  return parseFloat(t);
}
// L'écriture de S affichée, relue comme une réunion de morceaux.
function relit(s) {
  s = sansBalises(s).replace(/^S = /, '');
  if (s === '∅') return [];
  if (s === 'ℝ') return [{ a: -Infinity, b: Infinity, oa: true, ob: true }];
  return s.split('∪').map(function (m) {
    var t = m.trim();
    if (t.charAt(0) === '{') {
      var v = nb(t.replace(/[{}]/g, ''));
      return { a: v, b: v, oa: false, ob: false };
    }
    var g = t.charAt(0), d = t.charAt(t.length - 1);
    if ((g !== '[' && g !== ']') || (d !== '[' && d !== ']')) throw new Error('écriture illisible : ' + s);
    var corps = t.slice(1, -1).split(';');
    if (corps.length !== 2) throw new Error('écriture illisible : ' + s);
    var m2 = { a: nb(corps[0]), b: nb(corps[1]), oa: g === ']', ob: d === '[' };
    if (!isFinite(m2.a) && !m2.oa) throw new Error('crochet fermé du côté de −∞ : ' + s);
    if (!isFinite(m2.b) && !m2.ob) throw new Error('crochet fermé du côté de +∞ : ' + s);
    return m2;
  });
}
function dansMorceaux(ms, x) { return ms.some(function (m) { return dans(m, x); }); }

function toutAfficher() { bouton('tout').onClick(); }
function placeX(x) { PT.setPosition(JXG.COORDS_BY_USER, [x, PT.Y()]); PT._ev.drag(); }
function tape(s) {
  saisie.value = s; tracer.onclick();
  // Le point de test est reposé à chaque exemple : jamais hors de l'axe, jamais NaN.
  if (!(PT.X() >= -8 && PT.X() <= 11)) ko('après « ' + s + ' », le point de test est en x = ' + PT.X());
  return !/color:#dc2626/.test(note.innerHTML);
}

/* ------------------------------------------------------------------ */
/* Le balayage : toutes les formes deux à deux, « et » puis « ou »      */
/* ------------------------------------------------------------------ */
var cas = 0, pointsTestes = 0, vus = { intervalle: 0, vide: 0, deux: 0, reels: 0, seul: 0 };
var JEUX = [[-4, 5, 3, 9], [1, 3, 1, 3], [-2, 2, 2, 6], [0, 4, 5, 8], [-6, -1, -1, 4]];
JEUX.forEach(function (j) {
  FORMES.forEach(function (F1) {
    FORMES.forEach(function (F2) {
      ['et', 'ou'].forEach(function (lien) {
        var s = F1.s(j[0], j[1]) + ' ' + lien + ' ' + F2.s(j[2], j[3]);
        if (!tape(s)) { ko('la saisie refuse « ' + s + ' » : ' + sansBalises(note.innerHTML)); return; }
        var c1 = F1.f(j[0], j[1]), c2 = F2.f(j[2], j[3]);
        toutAfficher();
        cas++;

        var labS = texte(/^S = /);
        if (!labS || !visible(labS)) { ko('S n\'est pas affiché après « Tout afficher » pour « ' + s + ' »'); return; }
        var ecrit;
        try { ecrit = relit(labS.valeur()); } catch (e) { ko(e.message + ' (' + s + ')'); return; }
        if (!ecrit.length) vus.vide++;
        else if (ecrit.length === 2) vus.deux++;
        else if (ecrit[0].a === -Infinity && ecrit[0].b === Infinity) vus.reels++;
        else if (ecrit[0].a === ecrit[0].b) vus.seul++;
        else vus.intervalle++;

        // L'écriture décrit-elle EXACTEMENT le bon ensemble ?
        var points = [];
        j.forEach(function (v) { points.push(v - 0.5, v - 0.001, v, v + 0.001, v + 0.5); });
        for (var x = -8; x <= 11; x += 0.5) points.push(x);
        points.forEach(function (x) {
          pointsTestes++;
          if (dansMorceaux(ecrit, x) !== attendu(c1, c2, lien, x))
            ko('« ' + s + ' » : S affiché « ' + sansBalises(labS.valeur()) + ' » se trompe en x = ' + x);
        });

        // Le verdict et les deux coches, pour quelques nombres — sur les bornes surtout.
        [j[0], j[1], j[2], j[3], -7.5, 10.5].forEach(function (x) {
          placeX(x);
          var att = attendu(c1, c2, lien, x);
          var v = texte(/[∈∉] S$/);
          if (!v) { ko('verdict introuvable'); return; }
          if ((sansBalises(v.valeur()).indexOf('∉') >= 0) === att)
            ko('« ' + s + ' » : verdict faux en x = ' + x + ' : « ' + sansBalises(v.valeur()) + ' »');
          var cond = texteEn(-2.5);
          var lus = (sansBalises(cond.valeur()).match(/[✓✗]/g) || []).join('');
          var voulu = (dans(c1, x) ? '✓' : '✗') + (dans(c2, x) ? '✓' : '✗');
          if (lus !== voulu) ko('« ' + s + ' » : les coches disent « ' + lus + ' » au lieu de « ' + voulu + ' » en x = ' + x);
          if (sansBalises(cond.valeur()).indexOf(' ' + lien + ' ') < 0) ko('le mot de liaison « ' + lien + ' » manque sous le point');
          // Le panneau conclut pareil.
          var p = sansBalises(panneau.innerHTML);
          if (p.indexOf(att ? 'est solution' : 'n\'est pas solution') < 0)
            ko('« ' + s + ' » : le panneau ne conclut pas comme la figure en x = ' + x);
        });
      });
    });
  });
});
['intervalle', 'vide', 'deux', 'reels', 'seul'].forEach(function (k) {
  if (!vus[k]) ko('le cas « ' + k + ' » n\'a jamais été rencontré : le balayage ne couvre pas le chapitre');
});

/* ------------------------------------------------------------------ */
/* Les préréglages : l'exemple de la leçon, et les quatre réponses      */
/* ------------------------------------------------------------------ */
var ATTENDUS = [']3;5[', ']-∞;2]∪]5;+∞[', '∅', 'ℝ', ']0;2[', '[4;+∞[', ']-∞;5]'];
presets.forEach(function (bt, i) {
  bt.onclick();
  toutAfficher();
  var lu = sansBalises(texte(/^S = /).valeur()).replace(/^S = /, '').replace(/\s/g, '').replace(/−/g, '-');
  if (lu !== ATTENDUS[i]) ko('préréglage « ' + bt.textContent + ' » : S = ' + lu + ' au lieu de ' + ATTENDUS[i]);
  if (bt.className.indexOf('active') < 0) ko('le préréglage cliqué n\'est pas marqué actif');
  // L'énoncé en haut de la figure reprend les deux inéquations et le mot.
  var haut = sansBalises(texteEn(7.0).valeur());
  var voulu = bt.textContent.replace(/\s+/g, ' ');
  if (haut.replace(/\s+/g, ' ') !== voulu) ko('l\'énoncé affiché « ' + haut + ' » n\'est pas « ' + voulu + ' »');
});

/* ------------------------------------------------------------------ */
/* Les trois étapes, et le rejeu                                       */
/* ------------------------------------------------------------------ */
presets[0].onclick();          // x > 3 et −4 < x < 5
var barresCond = objets.filter(function (o) {
  return o.type === 'segment' && o.attrs.strokeWidth === 6 && o.attrs.layer === 6;
});
var barresS = objets.filter(function (o) {
  return o.type === 'segment' && o.attrs.strokeWidth === 7 && o.attrs.layer === 6;
});
if (barresCond.length !== 2) ko('deux barres de condition attendues, ' + barresCond.length);
if (barresS.length !== 2) ko('deux barres de résultat attendues, ' + barresS.length);
function ecran() {
  return [barresCond.map(visible).join(''), barresS.map(visible).join(''),
          visible(texte(/^S = /)), sansBalises(panneau.innerHTML)].join('|');
}
function joue() {
  var ecrans = [];
  reset();
  ecrans.push(ecran());
  etapes.forEach(function (s) {
    s.step(0); s.step(0.4);
    // à mi-course, la barre grandit : elle est visible mais pas entière
    s.step(1); if (s.after) s.after();
    ecrans.push(ecran());
  });
  return ecrans;
}
var e1 = joue();
// Figure vierge au départ, une barre, deux barres, puis S.
reset();
if (barresCond.some(visible)) ko('les barres sont déjà là avant la première étape');
if (visible(texte(/^S = /))) ko('S est déjà affiché avant la première étape');
etapes[0].step(1); etapes[0].after();
if (!(visible(barresCond[0]) && !visible(barresCond[1]))) ko('après l\'étape 1, seule la première barre doit être visible');
function panneauCompact() { return sansBalises(panneau.innerHTML).replace(/\s/g, ''); }
if (panneauCompact().indexOf(']3;+∞[') < 0) ko('après l\'étape 1, le panneau ne traduit pas x > 3');
if (panneauCompact().indexOf(']−4;5[') >= 0) ko('après l\'étape 1, le panneau traduit déjà la seconde inéquation');
etapes[1].step(1); etapes[1].after();
if (!(visible(barresCond[0]) && visible(barresCond[1]))) ko('après l\'étape 2, les deux barres doivent être visibles');
if (visible(texte(/^S = /))) ko('S est affiché avant la troisième étape');
etapes[2].step(0.5);
if (!visible(barresS[0])) ko('pendant l\'étape 3, la barre de S doit grandir (être visible)');
var moitie = barresS[0].x2() - barresS[0].x1();
etapes[2].step(1); etapes[2].after();
var entiere = barresS[0].x2() - barresS[0].x1();
if (!(moitie > 0 && moitie < entiere)) ko('la barre de S ne grandit pas de gauche à droite (' + moitie + ' puis ' + entiere + ')');
if (Math.abs(barresS[0].x1() - 3) > 1e-9 || Math.abs(barresS[0].x2() - 5) > 1e-9)
  ko('la barre de S va de ' + barresS[0].x1() + ' à ' + barresS[0].x2() + ' au lieu de 3 à 5');
if (!visible(texte(/^S = /))) ko('S n\'est pas affiché après la troisième étape');
// Rejoué après remise à zéro : le même écran à chaque étape.
var e2 = joue();
if (e1.join('\n') !== e2.join('\n')) ko('rejouer les étapes ne redonne pas les mêmes écrans');

/* ------------------------------------------------------------------ */
/* Les bornes glissantes : le résultat suit                             */
/* ------------------------------------------------------------------ */
presets[0].onclick(); toutAfficher();
// La borne droite de −4 < x < 5 (la 4e poignée) glisse en 8 : S devient ]3 ; 8[.
var PB2 = bornes[3];
if (!visible(PB2)) ko('la borne droite de la seconde inéquation devrait être visible');
PB2.setPosition(JXG.COORDS_BY_USER, [8.3, PB2.Y()]); PB2._ev.drag();
if (PB2.X() !== 8) ko('la borne glissée ne s\'accroche pas à l\'entier : ' + PB2.X());
var apres = sansBalises(texte(/^S = /).valeur()).replace(/\s/g, '');
if (apres !== 'S=]3;8[') ko('après glissement de la borne en 8, S = ' + apres + ' au lieu de ]3;8[');
// Une borne infinie n'a pas de poignée.
if (visible(bornes[1])) ko('x > 3 n\'a pas de borne droite : la poignée ne doit pas se voir');
// Les bornes ne se croisent pas.
var PA2 = bornes[2];
PA2.setPosition(JXG.COORDS_BY_USER, [9.6, PA2.Y()]); PA2._ev.drag();
if (PA2.X() >= PB2.X()) ko('la borne gauche a dépassé la borne droite');

/* ------------------------------------------------------------------ */
/* Le bouton « et » ↔ « ou »                                            */
/* ------------------------------------------------------------------ */
presets[0].onclick(); toutAfficher();
bouton('lien').onClick();
var ou = sansBalises(texte(/^S = /).valeur()).replace(/\s/g, '');
if (ou !== 'S=]-∞;+∞[' && ou !== 'S=ℝ') {
  if (ou !== 'S=]−4;+∞[') ko('x > 3 ou −4 < x < 5 devrait donner ]−4 ; +∞[, pas ' + ou);
}
if (saisie.value.indexOf(' ou ') < 0) ko('la saisie ne suit pas le changement de mot');
bouton('lien').onClick();
if (sansBalises(texte(/^S = /).valeur()).replace(/\s/g, '') !== 'S=]3;5[') ko('revenir à « et » ne redonne pas ]3 ; 5[');

/* ------------------------------------------------------------------ */
/* La saisie : ce qu'elle lit, ce qu'elle refuse                        */
/* ------------------------------------------------------------------ */
[['X > 3 ET -4 < x < 5', ']3;5['], ['x ≥ 1 ou x ⩽ -2', ']-∞;-2]∪[1;+∞['], ['3<x et 5>x', ']3;5['],
 ['x>=2,5 et x<4', '[2,5;4['], ['9>x>2 ou x<=1', ']-∞;1]∪]2;9[']].forEach(function (t) {
  if (!tape(t[0])) { ko('la saisie refuse « ' + t[0] + ' » : ' + sansBalises(note.innerHTML)); return; }
  toutAfficher();
  var lu = sansBalises(texte(/^S = /).valeur()).replace(/^S = /, '').replace(/\s/g, '').replace(/−/g, '-');
  if (lu !== t[1]) ko('« ' + t[0] + ' » donne S = ' + lu + ' au lieu de ' + t[1]);
});
presets[0].onclick(); toutAfficher();
['x>3', 'x>3 et', 'x>3 et y<5', 'x>3 et 5<x<2', 'x>3 et x<40', 'x>3 ou 2<x>5', 'x>3 et x<2,3'].forEach(function (s) {
  if (tape(s)) ko('la saisie accepte « ' + s + ' », qu\'elle ne devrait pas lire');
  var lu = sansBalises(texte(/^S = /).valeur()).replace(/\s/g, '');
  if (lu !== 'S=]3;5[') ko('une saisie refusée (« ' + s + ' ») a modifié la figure : ' + lu);
});

/* ------------------------------------------------------------------ */
/* Le dé : des exemples toujours lisibles                               */
/* ------------------------------------------------------------------ */
for (var t = 0; t < 300; t++) {
  de.onclick();
  var s = saisie.value;
  if (!/ (et|ou) /.test(s)) ko('le dé écrit « ' + s + ' » sans mot de liaison');
  toutAfficher();
  var labS = texte(/^S = /);
  try { relit(labS.valeur()); } catch (e) { ko('après le dé : ' + e.message); }
  bornes.forEach(function (b) {
    if (visible(b) && (b.X() < -7 || b.X() > 10 || b.X() !== Math.round(b.X())))
      ko('le dé pose une borne hors de l\'axe ou non entière : ' + b.X());
  });
}

print(cas + ' couples d\'inéquations tapés, ' + pointsTestes + ' appartenances recalculées ; rencontrés : ' +
      vus.intervalle + ' intervalles, ' + vus.vide + ' ∅, ' + vus.deux + ' en deux morceaux, ' +
      vus.reels + ' ℝ, ' + vus.seul + ' singletons ; 7 préréglages, 3 étapes rejouées deux fois, 300 tirages.');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('S DIT VRAI EN TOUT POINT POUR « ET » COMME POUR « OU », ET LES TROIS ÉTAPES SE REJOUENT À L\'IDENTIQUE');
