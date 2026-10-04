/* La leçon « Convertir des durées » (5ème).
 *
 * Ce que la figure affiche — « 1 000 000 s = 11 j 13 h 46 min 40 s », les
 * compteurs sous les cadrans, les angles des aiguilles — n'est pas relu tel
 * quel. On repart de la DURÉE SAISIE et du sens demandé, on refait la
 * conversion à côté (divisions successives par 60 puis 24 avec leurs restes,
 * ou multiplications), et chaque étape jouée doit coïncider : la division
 * posée écrite dans la ligne d'opération (« 1 000 000 = 60 × 16 666 + 40 »),
 * le résultat partiel, les compteurs, et les aiguilles — une aiguille est à
 * 6° par seconde, 6° par minute, 30° par heure, 360/365° par jour, et un
 * cadran qui déborde a la sienne estompée au zéro.
 *
 * Le total de secondes doit être conservé d'un bout à l'autre : c'est
 * l'invariant d'une conversion. Les étapes sont rejouées après une remise à
 * zéro et doivent redonner les mêmes écrans ; le « principe des cadrans » fait
 * exactement un tour (puis deux, puis un) et avance le cadran suivant d'un
 * cran ; la saisie refuse zéro et les durées trop longues sans toucher la
 * figure ; le dé reste dans les bornes.
 */

/* ------------------------------------------------------------------ */
/* Un JSXGraph de fortune                                               */
/* ------------------------------------------------------------------ */
var JXG = { COORDS_BY_USER: 1 };
function val(v) { return typeof v === 'function' ? v() : v; }
var objets = [];
function objet(type, parents, attrs) {
  var o = { type: type, parents: parents || [], attrs: attrs || {}, _a: {} };
  o.setAttribute = function (t) { for (var k in t) o._a[k] = t[k]; };
  o.on = function () {};
  if (type === 'point') {
    o.X = function () { return val(parents[0]); };
    o.Y = function () { return val(parents[1]); };
    o.setPosition = function (m, c) { parents = [c[0], c[1]]; };
  }
  if (type === 'text') o.valeur = function () { return String(val(parents[2])); };
  objets.push(o);
  return o;
}
var board = {
  create: function (type, parents, attrs) { return objet(type, parents, attrs); },
  on: function () {},
  update: function () {
    objets.forEach(function (o) { if (o.type === 'curve' && o.updateDataArray) o.updateDataArray(); });
  }
};
function visible(o) { return 'visible' in o._a ? o._a.visible === true : o.attrs.visible !== false; }

function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', textContent: '', value: '', children: [], type: '',
            attrs: {}, appendChild: function (c) { this.children.push(c); return c; },
            setAttribute: function (k, v) { this.attrs[k] = v; } };
  Object.defineProperty(e, 'innerHTML', {
    get: function () { return e._html; }, set: function (v) { e._html = v; e.children = []; }
  });
  return e;
}
var document = { createElement: fauxEl };
var etapes = null, reset = null, specs = null, extras = fauxEl('div');
var mv = {
  extras: extras, typeset: function () {}, onCleanup: function () {},
  addControls: function (s) { specs = s; var r = {}; s.forEach(function (c) { r[c.id] = fauxEl(c.type); }); return r; },
  createAnimator: function () { return { cancel: function () {}, runSteps: function (s, r) { etapes = s; reset = r; } }; }
};
var LECON = null;
var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/durees.js');
LECON.setup(board, mv);

/* ------------------------------------------------------------------ */
/* Les poignées                                                        */
/* ------------------------------------------------------------------ */
var err = [];
function ko(m) { if (err.indexOf(m) < 0 && err.length < 14) err.push(m); }
function parClasse(cls) {
  var out = [];
  (function walk(e) { if (e.className && e.className.split(' ').indexOf(cls) >= 0) out.push(e); (e.children || []).forEach(walk); })(extras);
  return out;
}
var presets = parClasse('ineq-preset'), inputs = {}, sel = parClasse('duree-sel')[0];
['j', 'h', 'm', 's'].forEach(function (u) { inputs[u] = parClasse('duree-' + u)[0]; });
var boutons = parClasse('eq-rand'), go = boutons[0], de = boutons[1];
var note = parClasse('eq-note')[0], panneau = parClasse('props-panel')[0];
function bouton(id) { return specs.filter(function (s) { return s.id === id; })[0]; }
function sansBalises(h) {
  return String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}
// Les textes du bas se déplacent (leur abscisse est une fonction) : on les retrouve par leur hauteur.
function texteEn(x, y) {
  return objets.filter(function (o) {
    return o.type === 'text' && Math.abs(o.parents[1] - y) < 1e-9 && (x === null || val(o.parents[0]) === x);
  })[0];
}
var CX = { s: 2.0, m: 6.0, h: 10.0, j: 14.0 }, CY = 5.55, R = 1.55;
var compteurs = {}, aiguilles = {}, secteurs = {};
['s', 'm', 'h', 'j'].forEach(function (u) {
  compteurs[u] = texteEn(CX[u], CY - R - 0.45);
  aiguilles[u] = objets.filter(function (o) {
    return o.type === 'segment' && o.attrs.strokeWidth === 4 && o.parents[0][0] === CX[u];
  })[0];
  secteurs[u] = objets.filter(function (o) { return o.type === 'curve' && o.attrs.fillOpacity === 0.18 && o.attrs.fillColor === o.attrs.strokeColor; })[['s', 'm', 'h', 'j'].indexOf(u)];
});
var lTitre = texteEn(8.0, 8.15), lA = texteEn(null, 1.45), lB = texteEn(null, -0.45), lDiv = texteEn(0.3, 2.35);

if (presets.length !== 9) ko('9 préréglages attendus, ' + presets.length);
if (!sel || !inputs.s || !inputs.j) ko('la saisie est incomplète');
if (!go || !de) ko('les boutons « Convertir » et « 🎲 » manquent');
['s', 'm', 'h', 'j'].forEach(function (u) {
  if (!compteurs[u]) ko('compteur introuvable sous le cadran ' + u);
  if (!aiguilles[u]) ko('aiguille introuvable sur le cadran ' + u);
  if (!secteurs[u]) ko('secteur introuvable sur le cadran ' + u);
});
if (!lTitre || !lA || !lB) ko('les lignes de texte sont introuvables');
if (!lDiv) ko('la division posée est introuvable');
if (!etapes) ko('aucune étape armée au chargement');
if (!bouton('principe') || !bouton('play') || !bouton('tout')) ko('il manque un bouton de contrôle');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); throw new Error('figure inattendue'); }

/* ------------------------------------------------------------------ */
/* La conversion refaite à côté                                        */
/* ------------------------------------------------------------------ */
var MOD = { s: 60, m: 60, h: 24 }, DEG = { s: 6, m: 6, h: 30, j: 360 / 365 }, NOM = { s: 's', m: 'min', h: 'h', j: 'j' };
var SUIV = { s: 'm', m: 'h', h: 'j' };
function total(v) { return v.s + 60 * v.m + 3600 * v.h + 86400 * v.j; }
function fmtN(n) {
  var s = String(Math.round(n)), out = '';
  while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
  return s + out;
}
function duree(v) {
  var p = [];
  ['j', 'h', 'm', 's'].forEach(function (u) { if (Math.round(v[u])) p.push(fmtN(v[u]) + ' ' + NOM[u]); });
  return p.length ? p.join(' ') : '0 s';
}
// Les étapes attendues : décomposition (divisions) ou vidage (multiplications).
function attenduDecomp(v) {
  var cur = { s: v.s, m: v.m, h: v.h, j: v.j }, out = [];
  ['s', 'm', 'h'].forEach(function (u) {
    if (cur[u] < MOD[u]) return;
    var q = Math.floor(cur[u] / MOD[u]), r = cur[u] % MOD[u];
    var av = cur[u];
    cur[u] = r; cur[SUIV[u]] += q;
    out.push({ u: u, op: fmtN(av) + ' = ' + MOD[u] + ' × ' + fmtN(q) + ' + ' + fmtN(r), apres: duree(cur), vals: { s: cur.s, m: cur.m, h: cur.h, j: cur.j } });
  });
  return { etapes: out, final: cur };
}
function attenduVide(v, cible) {
  var cur = { s: v.s, m: v.m, h: v.h, j: v.j }, out = [];
  var ordre = ['j', 'h', 'm'], rang = { s: 0, m: 1, h: 2, j: 3 }, bas = { j: 'h', h: 'm', m: 's' };
  ordre.forEach(function (u) {
    if (rang[u] <= rang[cible]) return;
    if (!cur[u]) return;
    var n = bas[u], prod = cur[u] * MOD[n], av = cur[u];
    cur[n] += prod; cur[u] = 0;
    out.push({ u: u, op: fmtN(av) + ' × ' + MOD[n], apres: duree(cur), vals: { s: cur.s, m: cur.m, h: cur.h, j: cur.j } });
  });
  return { etapes: out, final: cur };
}

/* La division posée, refaite comme à l'école : les lignes attendues, sans mise en forme. */
function divisionAttendue(D, d) {
  var ch = String(D), n = ch.length, i = 0, cur = 0, commence = false, lignes = [], quotient = '';
  function cale(t, col) { var pad = col + 1 - t.length; return (pad > 0 ? new Array(pad + 1).join(' ') : '') + t; }
  while (i < n) {
    cur = cur * 10 + (+ch.charAt(i));
    if (!commence && cur < d && i < n - 1) { i++; continue; }
    commence = true;
    var q = Math.floor(cur / d), r = cur - q * d;
    quotient += String(q);
    if (q > 0) lignes.push(cale('−' + String(q * d), i));
    if (i < n - 1) lignes.push(cale(String(r) + ch.charAt(i + 1), i + 1));
    else lignes.push(cale(String(r), i));
    cur = r; i++;
  }
  return { lignes: lignes, quotient: quotient, reste: cur };
}
// Les lignes affichées : la partie gauche de la potence, balises enlevées.
function divisionLue() {
  return String(lDiv.valeur()).replace(/<[^>]+>/g, '').split('\n').map(function (l) {
    return l.split(' │ ')[0].replace(/\s+$/, '');
  });
}
function quotientLu() {
  var l = String(lDiv.valeur()).replace(/<[^>]+>/g, '').split('\n');
  return l.length > 2 ? l[2].split(' │ ')[1] || '' : '';
}

function tape(v, mode) {
  ['j', 'h', 'm', 's'].forEach(function (u) { inputs[u].value = String(v[u]); });
  sel.value = mode;
  go.onclick();
  return !/color:#dc2626/.test(note.innerHTML);
}
function joueTout() {
  var ecrans = [];
  reset(); board.update();
  ecrans.push(ecran());
  etapes.forEach(function (s) {
    s.step(0); board.update(); verifieFini('p = 0');
    s.step(0.5); board.update(); verifieFini('p = 0,5');
    s.step(1); s.after(); board.update();
    ecrans.push(ecran());
  });
  return ecrans;
}
function ecran() {
  return ['s', 'm', 'h', 'j'].map(function (u) {
    return sansBalises(compteurs[u].valeur()) + '@' + Math.round(aiguilles[u].parents[1].X() * 1000) + ',' +
           Math.round(aiguilles[u].parents[1].Y() * 1000) + '/' + aiguilles[u]._a.strokeOpacity;
  }).join(' ') + ' | ' + sansBalises(lA.valeur()) + ' | ' + sansBalises(lB.valeur()) + ' | ' + sansBalises(panneau.innerHTML).slice(0, 400);
}
function verifieFini(ou) {
  ['s', 'm', 'h', 'j'].forEach(function (u) {
    var P = aiguilles[u].parents[1];
    if (!isFinite(P.X()) || !isFinite(P.Y())) ko('aiguille ' + u + ' hors du plan (' + ou + ')');
    (secteurs[u].dataX || []).forEach(function (x) { if (!isFinite(x)) ko('secteur ' + u + ' : coordonnée non finie (' + ou + ')'); });
  });
}
// L'angle lu sur une aiguille, en degrés, sens horaire depuis le haut.
function angleLu(u) {
  var P = aiguilles[u].parents[1];
  var a = Math.atan2(P.X() - CX[u], P.Y() - CY) * 180 / Math.PI;
  return (a + 360) % 360;
}
function memeAngle(a, b) { var d = Math.abs(((a - b) % 360 + 540) % 360 - 180); return d < 0.05; }

/* ------------------------------------------------------------------ */
/* Le balayage : décompositions et vidages                             */
/* ------------------------------------------------------------------ */
var cas = 0, etapesVues = 0;
var ENTREES = [
  { j: 0, h: 0, m: 0, s: 1000000 }, { j: 0, h: 0, m: 0, s: 10000 }, { j: 0, h: 0, m: 0, s: 86400 },
  { j: 0, h: 0, m: 0, s: 59 }, { j: 0, h: 0, m: 0, s: 60 }, { j: 0, h: 0, m: 250, s: 0 }, { j: 0, h: 100, m: 0, s: 0 },
  { j: 0, h: 1, m: 90, s: 125 }, { j: 2, h: 30, m: 0, s: 0 }, { j: 3, h: 5, m: 20, s: 7 }, { j: 0, h: 1, m: 30, s: 0 },
  { j: 7, h: 0, m: 0, s: 0 }, { j: 1, h: 0, m: 0, s: 1 }, { j: 0, h: 0, m: 1, s: 0 }, { j: 400, h: 23, m: 59, s: 59 }
];
ENTREES.forEach(function (v) {
  ['decomp', 'h', 'm', 's'].forEach(function (mode) {
    if (!tape(v, mode)) { ko('la saisie refuse ' + JSON.stringify(v) + ' : ' + sansBalises(note.innerHTML)); return; }
    cas++;
    var att = mode === 'decomp' ? attenduDecomp(v) : attenduVide(v, mode);
    if (etapes.length !== att.etapes.length) {
      ko(JSON.stringify(v) + ' → ' + mode + ' : ' + etapes.length + ' étapes au lieu de ' + att.etapes.length);
      return;
    }
    // Au départ : les compteurs disent la saisie, le total est le bon.
    reset(); board.update();
    ['s', 'm', 'h', 'j'].forEach(function (u) {
      if (sansBalises(compteurs[u].valeur()) !== fmtN(v[u]) + ' ' + NOM[u])
        ko('au départ, le compteur ' + u + ' dit « ' + sansBalises(compteurs[u].valeur()) + ' » pour ' + JSON.stringify(v));
      var deborde = u !== 'j' && v[u] >= MOD[u];
      if (deborde !== (aiguilles[u]._a.strokeOpacity < 1)) ko('au départ, l\'aiguille ' + u + ' devrait ' + (deborde ? '' : 'ne pas ') + 'être estompée pour ' + JSON.stringify(v));
      if (!deborde && !memeAngle(angleLu(u), DEG[u] * v[u])) ko('au départ, l\'aiguille ' + u + ' est à ' + angleLu(u) + '° au lieu de ' + (DEG[u] * v[u]) % 360);
    });
    if (String(lDiv.valeur()).trim()) ko('au départ, aucune division ne doit être posée');
    if (!att.etapes.length) {
      if (!/déjà/.test(sansBalises(lA.valeur()))) ko(JSON.stringify(v) + ' → ' + mode + ' : sans étape, la figure devrait dire que la durée est déjà écrite ainsi');
    }
    var e1 = joueTout();
    // Étape par étape : l'opération écrite, le résultat partiel, les compteurs, les angles.
    etapes.forEach(function (s, i) {
      etapesVues++;
      reset(); for (var k = 0; k <= i; k++) { etapes[k].step(1); etapes[k].after(); } board.update();
      var a = att.etapes[i];
      var opLue = sansBalises(lA.valeur());
      if (opLue.indexOf(a.op) < 0) ko(JSON.stringify(v) + ' → ' + mode + ', étape ' + (i + 1) + ' : « ' + opLue + ' » ne contient pas « ' + a.op + ' »');
      var resLu = sansBalises(lB.valeur());
      if (resLu.indexOf('= ' + a.apres) < 0) ko(JSON.stringify(v) + ' → ' + mode + ', étape ' + (i + 1) + ' : « ' + resLu + ' » devrait finir par « = ' + a.apres + ' »');
      if (resLu.indexOf(duree(v) + ' =') !== 0) ko('le résultat partiel ne commence pas par la durée saisie : « ' + resLu + ' »');
      var som = 0;
      ['s', 'm', 'h', 'j'].forEach(function (u) {
        var lu = sansBalises(compteurs[u].valeur());
        if (lu !== fmtN(a.vals[u]) + ' ' + NOM[u]) ko('étape ' + (i + 1) + ' de ' + JSON.stringify(v) + ' → ' + mode + ' : compteur ' + u + ' = « ' + lu + ' » au lieu de ' + fmtN(a.vals[u]) + ' ' + NOM[u]);
        var deborde = u !== 'j' && a.vals[u] >= MOD[u];
        if (deborde !== (aiguilles[u]._a.strokeOpacity < 1)) ko('étape ' + (i + 1) + ' : aiguille ' + u + (deborde ? ' devrait' : ' ne devrait pas') + ' être estompée (' + JSON.stringify(v) + ' → ' + mode + ')');
        if (!deborde && !memeAngle(angleLu(u), DEG[u] * a.vals[u])) ko('étape ' + (i + 1) + ' : aiguille ' + u + ' à ' + angleLu(u).toFixed(2) + '° au lieu de ' + ((DEG[u] * a.vals[u]) % 360).toFixed(2) + '° (' + JSON.stringify(v) + ' → ' + mode + ')');
        if (deborde && !memeAngle(angleLu(u), 0)) ko('étape ' + (i + 1) + ' : une aiguille estompée doit être au zéro');
      });
      // L'invariant : le total de secondes.
      if (total(a.vals) !== total(v)) ko('contrôle interne : le total attendu change');
      // La division posée : chaque ligne telle qu'on l'écrirait au tableau, le reste en bas.
      if (mode === 'decomp') {
        var MODS = { s: 60, m: 60, h: 24 }, u0 = a.u;
        var avant = i === 0 ? v[u0] : att.etapes[i - 1].vals[u0];
        var dA = divisionAttendue(avant, MODS[u0]);
        var lues = divisionLue();
        if (lues[0] !== String(avant)) ko('division posée : le dividende lu « ' + lues[0] + ' » n\'est pas ' + avant);
        dA.lignes.forEach(function (l, k) {
          if ((lues[k + 1] || '').replace(/\s+$/, '') !== l.replace(/\s+$/, ''))
            ko('division posée de ' + avant + ' ÷ ' + MODS[u0] + ' : ligne ' + (k + 2) + ' « ' + lues[k + 1] + ' » au lieu de « ' + l + ' »');
        });
        if (quotientLu() !== dA.quotient) ko('division posée de ' + avant + ' ÷ ' + MODS[u0] + ' : quotient « ' + quotientLu() + ' » au lieu de ' + dA.quotient);
        if (dA.reste !== a.vals[u0]) ko('contrôle interne : le reste de la division posée n\'est pas celui du cadran');
        if (!/text-decoration:underline/.test(lDiv.valeur())) ko('le reste n\'est pas souligné dans la division posée');
        // En cours d'étape, la division se découvre : moins de lignes qu'à la fin.
        reset(); for (var k2 = 0; k2 < i; k2++) { etapes[k2].step(1); etapes[k2].after(); }
        s.step(0.15); board.update();
        var partiel = divisionLue().filter(function (l) { return l.trim(); }).length;
        if (!(partiel < dA.lignes.length + 1)) ko('à 15 % de l\'étape, la division posée est déjà entière (' + avant + ' ÷ ' + MODS[u0] + ')');
        s.step(1); s.after(); board.update();
      } else if (String(lDiv.valeur()).trim()) {
        ko('une multiplication ne doit pas afficher de division posée');
      }
      var pan = sansBalises(panneau.innerHTML);
      if (pan.indexOf(mode === 'decomp' ? 'divise' : 'multiplie') < 0) ko('le panneau ne dit pas s\'il divise ou multiplie');
      if (mode === 'decomp' && pan.indexOf('│') < 0) ko('le panneau ne reprend pas la division posée');
      if (pan.indexOf('Donc ' + duree(v) + ' = ' + a.apres) < 0) ko('le panneau ne conclut pas l\'étape ' + (i + 1) + ' par « Donc ' + duree(v) + ' = ' + a.apres + ' »');
    });
    if (att.etapes.length) {
      var fin = sansBalises(lB.valeur());
      if (fin !== duree(v) + ' = ' + duree(att.final)) ko('résultat final « ' + fin + ' » au lieu de « ' + duree(v) + ' = ' + duree(att.final) + ' »');
      if (mode === 'decomp') ['s', 'm', 'h'].forEach(function (u) { if (att.final[u] >= MOD[u]) ko('contrôle interne : décomposition inachevée'); });
      if (mode !== 'decomp') ['j', 'h', 'm'].forEach(function (u) { if ({ s: 0, m: 1, h: 2, j: 3 }[u] > { s: 0, m: 1, h: 2, j: 3 }[mode] && att.final[u]) ko('contrôle interne : vidage inachevé'); });
    }
    // Rejoué après remise à zéro : les mêmes écrans.
    var e2 = joueTout();
    if (e1.join('\n') !== e2.join('\n')) ko('rejouer ' + JSON.stringify(v) + ' → ' + mode + ' ne redonne pas les mêmes écrans');
  });
});

/* ------------------------------------------------------------------ */
/* Les préréglages : le résultat annoncé                                */
/* ------------------------------------------------------------------ */
var ATTENDUS = ['11 j 13 h 46 min 40 s', '2 h 46 min 40 s', '1 j', '4 h 10 min', '4 j 4 h', '278 407 s', '5 400 s', '3 060 min', '168 h'];
presets.forEach(function (bt, i) {
  bt.onclick(); bouton('tout').onClick(); board.update();
  var lu = sansBalises(lB.valeur());
  if (lu.indexOf('= ' + ATTENDUS[i]) < 0 || lu.indexOf('= ' + ATTENDUS[i]) !== lu.length - ATTENDUS[i].length - 2)
    ko('préréglage « ' + bt.textContent + ' » : « ' + lu + ' » au lieu de « … = ' + ATTENDUS[i] + ' »');
  if (bt.className.indexOf('active') < 0) ko('le préréglage cliqué n\'est pas marqué actif');
});

/* ------------------------------------------------------------------ */
/* Le principe des cadrans                                              */
/* ------------------------------------------------------------------ */
bouton('principe').onClick();
if (etapes.length !== 4) ko('le principe devrait tenir en 4 étapes, ' + etapes.length);
reset(); board.update();
var ATT_ANG = [{ s: 360, m: 6, h: 0, j: 0 }, { s: 360, m: 360, h: 30, j: 0 }, { s: 360, m: 360, h: 720, j: 360 / 365 }, { s: 360, m: 360, h: 720, j: 360 }];
var ATT_VAL = [{ s: 60, m: 1, h: 0, j: 0 }, { s: 60, m: 60, h: 1, j: 0 }, { s: 60, m: 60, h: 24, j: 1 }, { s: 60, m: 60, h: 24, j: 365 }];
etapes.forEach(function (s, i) {
  s.step(0); s.step(0.5); board.update(); verifieFini('principe');
  // à mi-course de la première étape, la trotteuse est à mi-tour et les minutes à 3°
  if (i === 0 && !memeAngle(angleLu('s'), 180)) ko('à mi-étape, la trotteuse devrait être à 180°, elle est à ' + angleLu('s'));
  if (i === 0 && !memeAngle(angleLu('m'), 3)) ko('à mi-étape, les minutes devraient être à 3°, elles sont à ' + angleLu('m'));
  s.step(1); s.after(); board.update();
  ['s', 'm', 'h', 'j'].forEach(function (u) {
    if (!memeAngle(angleLu(u), ATT_ANG[i][u])) ko('principe, étape ' + (i + 1) + ' : aiguille ' + u + ' à ' + angleLu(u).toFixed(2) + '° au lieu de ' + (ATT_ANG[i][u] % 360).toFixed(2) + '°');
    if (sansBalises(compteurs[u].valeur()) !== fmtN(ATT_VAL[i][u]) + ' ' + NOM[u]) ko('principe, étape ' + (i + 1) + ' : compteur ' + u + ' = « ' + sansBalises(compteurs[u].valeur()) + ' »');
  });
});
var p1 = joueTout(), p2 = joueTout();
if (p1.join('\n') !== p2.join('\n')) ko('rejouer le principe ne redonne pas les mêmes écrans');
['6°', '30°', '365'].forEach(function (mot) {
  reset(); etapes.forEach(function (s) { s.step(1); s.after(); }); board.update();
  if (sansBalises(panneau.innerHTML).indexOf(mot) < 0) ko('le panneau du principe ne mentionne pas « ' + mot + ' »');
});

/* ------------------------------------------------------------------ */
/* La saisie refuse ce qui n'a pas de sens, sans toucher la figure      */
/* ------------------------------------------------------------------ */
tape({ j: 0, h: 0, m: 0, s: 10000 }, 'decomp'); bouton('tout').onClick(); board.update();
var avant = sansBalises(lB.valeur());
if (tape({ j: 0, h: 0, m: 0, s: 0 }, 'decomp')) ko('une durée nulle est acceptée');
if (tape({ j: 2000, h: 0, m: 0, s: 0 }, 's')) ko('2000 jours sont acceptés : trop long pour les cadrans');
if (sansBalises(lB.valeur()) !== avant) ko('une saisie refusée a modifié la figure');

/* ------------------------------------------------------------------ */
/* Le dé                                                                */
/* ------------------------------------------------------------------ */
for (var t = 0; t < 300; t++) {
  de.onclick();
  if (/color:#dc2626/.test(note.innerHTML)) ko('le dé a tiré une durée refusée par la saisie');
  var v = {}; ['j', 'h', 'm', 's'].forEach(function (u) { v[u] = parseInt(inputs[u].value, 10); });
  if (total(v) <= 0 || total(v) > 99999999) ko('le dé sort des bornes : ' + JSON.stringify(v));
  if (!etapes.length) ko('le dé a tiré une durée qui ne demande aucune conversion : ' + JSON.stringify(v) + ' → ' + sel.value);
  bouton('tout').onClick(); board.update(); verifieFini('dé');
}

print(cas + ' conversions rejouées (' + etapesVues + ' étapes, divisions posées relues ligne à ligne), chacune recalculée à côté et rejouée deux fois ; ' +
      '9 préréglages, le principe des cadrans en 4 étapes, 300 tirages.');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE ÉTAPE POSE LA BONNE DIVISION, LES AIGUILLES ET LES COMPTEURS SUIVENT, ET LE TOTAL DE SECONDES EST CONSERVÉ');
