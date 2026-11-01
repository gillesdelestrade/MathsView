/* La leçon « Les bissectrices et le cercle inscrit » (5ème).
 *
 * Le tableau JSXGraph est simulé : on capture les objets créés et surtout les
 * FONCTIONS de coordonnées, qu'on rappelle après avoir déplacé les sommets. On
 * peut donc vérifier la figure pour n'importe quel triangle, y compris ceux
 * qu'aucun bouton ne propose.
 *
 * Ce qui doit tenir :
 *   — chaque bissectrice part de SON sommet, entre dans le triangle, et fait
 *     le même angle avec les deux côtés de l'angle. C'est la définition, et
 *     rien ne garantit a priori que le tracé la respecte ;
 *   — le codage des deux demi-angles balaye deux angles égaux, de part et
 *     d'autre de la bissectrice ;
 *   — les trois passent par I, qui est à égale distance des trois CÔTÉS (pas
 *     des sommets) ; les trois distances tracées sont perpendiculaires aux
 *     côtés et aboutissent sur le segment ;
 *   — le cercle tracé a I pour centre et ce rayon-là : il touche les côtés ;
 *   — le bandeau dit VRAI : I est toujours dedans, et les cas particuliers
 *     (isocèle, équilatéral, aplati) sont nommés.
 */
var window = this;
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [],
            appendChild: function (c) { this.children.push(c); return c; } };
  Object.defineProperty(e, 'innerHTML',
    { get: function () { return e._html; }, set: function (v) { e._html = v; } });
  return e;
}
var document = { createElement: fauxEl };
window.document = document;

var JXG = { COORDS_BY_USER: 1 };
window.JXG = JXG;
var objets = [];
function fauxBoard() {
  var surUpdate = [];
  return {
    create: function (type, parents, attr) {
      var o = { type: type, parents: parents, attr: attr || {},
                visible: !(attr && attr.visible === false) };
      if (type === 'point' && typeof parents[0] === 'number') {
        var x = parents[0], y = parents[1];
        o.X = function () { return x; };
        o.Y = function () { return y; };
        o.setPosition = function (m, p) { x = p[0]; y = p[1]; };
        o.moveTo = function (p) { x = p[0]; y = p[1]; };
      } else if (type === 'point') {
        o.X = function () { return parents[0](); };
        o.Y = function () { return parents[1](); };
      }
      o.on = function () {};
      o.setAttribute = function (a) {
        for (var k in a) o.attr[k] = a[k];
        if ('visible' in a) o.visible = a.visible;
      };
      o.setText = function () {};
      objets.push(o);
      return o;
    },
    on: function (ev, f) { if (ev === 'update') surUpdate.push(f); },
    update: function () { surUpdate.forEach(function (f) { f(); }); },
    getBoundingBox: function () { return [-8, 6, 8, -6]; },
    setBoundingBox: function () {}
  };
}

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/bissectrices-triangle.js');

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
function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
function unit(a) { var n = Math.hypot(a[0], a[1]); return [a[0] / n, a[1] / n]; }
function angleEntre(u, v) { return Math.acos(Math.max(-1, Math.min(1, dot(unit(u), unit(v))))) * 180 / Math.PI; }
// Distance d'un point à la droite (uv).
function distDroite(p, u, v) {
  var d = sub(v, u);
  return Math.abs(d[0] * (p[1] - u[1]) - d[1] * (p[0] - u[0])) / Math.hypot(d[0], d[1]);
}

var sommets = objets.filter(function (o) {
  return o.type === 'point' && ['A', 'B', 'C'].indexOf(o.attr.name) >= 0;
});
if (sommets.length !== 3) throw new Error('les trois sommets sont introuvables');
function P(i) { return [sommets[i].X(), sommets[i].Y()]; }
function placer(t) { t.forEach(function (p, i) { sommets[i].setPosition(1, p); }); }
function jouerTout() {
  controles.reset.onClick();
  mv._steps.forEach(function (s) { s.step(1); if (s.after) s.after(); });
  board.update();
}

/* Les trois bissectrices tracées (courbes violettes épaisses), repérées par
   leur couleur et leur épaisseur ; a = le départ, b = le bout. */
function bissectrices() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.strokeColor === '#7c3aed' && o.attr.strokeWidth === 2.6;
  }).map(function (o) {
    return { a: [o.parents[0](0), o.parents[1](0)], b: [o.parents[0](1), o.parents[1](1)], o: o };
  });
}
// Les arcs du codage : courbes orange de 13 points (deux par sommet).
function codages() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.strokeColor === '#ea580c' && o.attr.numberPointsHigh === 13;
  }).map(function (o) {
    var pts = [];
    for (var k = 0; k <= 12; k++) pts.push([o.parents[0](k), o.parents[1](k)]);
    return { pts: pts, o: o };
  });
}
// Les distances de I aux côtés : courbes orange en pointillé, 2 points.
function distancesTracees() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.strokeColor === '#ea580c' && o.attr.dash === 2 && o.attr.numberPointsHigh === 2;
  }).map(function (o) {
    return { a: [o.parents[0](0), o.parents[1](0)], b: [o.parents[0](1), o.parents[1](1)], o: o };
  });
}
function pointNomme(n) {
  var o = objets.filter(function (x) { return x.type === 'point' && x.attr.name === n; })[0];
  return o ? [o.X(), o.Y()] : null;
}
function objetNomme(n) {
  return objets.filter(function (x) { return x.type === 'point' && x.attr.name === n; })[0];
}
function cercleTrace() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.strokeColor === '#dc2626' && o.attr.strokeWidth === 2.6;
  })[0];
}
function bandeau() {
  var t = objets.filter(function (o) {
    return o.type === 'text' && typeof o.parents[2] === 'function' && o.parents[1] === 5.4;
  })[0];
  return t ? t.parents[2]() : '';
}
function noteRayons() {
  var t = objets.filter(function (o) {
    return o.type === 'text' && typeof o.parents[2] === 'function' && o.parents[1] === -5.3;
  })[0];
  return t ? t.parents[2]() : '';
}
function dedans(p, A, B, C) {
  function s(u2, v2, w) { return (u2[0] - w[0]) * (v2[1] - w[1]) - (v2[0] - w[0]) * (u2[1] - w[1]); }
  var d1 = s(p, A, B), d2 = s(p, B, C), d3 = s(p, C, A);
  return !(((d1 < 0) || (d2 < 0) || (d3 < 0)) && ((d1 > 0) || (d2 > 0) || (d3 > 0)));
}

/* ------------------------------------------------------------------ */
var rnd = MathsAlea(20261101);
var essais = [
  [[-4.2, -2.6], [4.2, -2.6], [0.8, 3.2]],        // les cinq formes du bouton
  [[-4, -2.8], [3.8, -2.8], [-4, 3.2]],
  [[-5, -2], [5, -2], [-3.5, 0.8]],
  [[-3.4, -2.6], [3.4, -2.6], [0, 3.6]],
  [[-3.46, -2], [3.46, -2], [0, 3.99]],
  [[-3, -3], [3, -3], [3, 3]],
  [[-1, -3], [5, 1], [-5, 2]]
];
for (var t = 0; t < 70; t++) {
  essais.push([0, 1, 2].map(function () {
    return [rnd.entier(-60, 60) / 10, rnd.entier(-45, 45) / 10];
  }));
}

essais.forEach(function (tri, idx) {
  var u = sub(tri[1], tri[0]), v = sub(tri[2], tri[0]);
  if (Math.abs(u[0] * v[1] - u[1] * v[0]) < 3) return;      // trop plat
  nb++;
  placer(tri);
  jouerTout();

  var A = P(0), B = P(1), C = P(2), PTS = [A, B, C];
  var I = pointNomme('I');
  if (!I) { ko('le point I est introuvable'); return; }
  var OPP = [[1, 2], [2, 0], [0, 1]];

  /* --- 1. I est-il à égale distance des trois CÔTÉS, et dedans ? ----- */
  var r = distDroite(I, B, C);
  if (Math.abs(distDroite(I, C, A) - r) > 1e-9 || Math.abs(distDroite(I, A, B) - r) > 1e-9)
    ko('triangle ' + idx + ' : I n\'est pas à égale distance des trois côtés (' + r.toFixed(3) + ', ' +
       distDroite(I, C, A).toFixed(3) + ', ' + distDroite(I, A, B).toFixed(3) + ')');
  if (!dedans(I, A, B, C)) ko('triangle ' + idx + ' : I est hors du triangle');
  // et pas à égale distance des sommets (sauf équilatéral) : ce n'est pas O
  var cotes = [di(B, C), di(C, A), di(A, B)];
  function eg(x, y) { return Math.abs(x - y) < 0.008 * (x + y); }
  var equi = eg(cotes[0], cotes[1]) && eg(cotes[1], cotes[2]);
  if (!equi && Math.abs(di(I, A) - di(I, B)) < 1e-6 && Math.abs(di(I, B) - di(I, C)) < 1e-6)
    ko('triangle ' + idx + ' : I est équidistant des sommets, ce serait O');

  /* --- 2. chaque bissectrice tracée en est-elle bien une ? ----------- */
  var BI = bissectrices();
  if (BI.length !== 3) { ko('triangle ' + idx + ' : ' + BI.length + ' bissectrices au lieu de 3'); return; }
  [0, 1, 2].forEach(function (i) {
    var S0 = PTS[i], o = OPP[i];
    var sienne = BI.filter(function (b) { return di(b.a, S0) < 1e-9; });
    if (sienne.length !== 1) { ko('triangle ' + idx + ' : la bissectrice du sommet ' + i + ' ne part pas de lui'); return; }
    var d = sub(sienne[0].b, sienne[0].a);
    var a1 = angleEntre(d, sub(PTS[o[0]], S0)), a2 = angleEntre(d, sub(PTS[o[1]], S0));
    if (Math.abs(a1 - a2) > 1e-9)
      ko('triangle ' + idx + ' : la bissectrice de ' + i + ' fait ' + a1.toFixed(4) + '° et ' + a2.toFixed(4) + '° avec les côtés');
    // elle entre dans le triangle : elle traverse le côté opposé
    var U = PTS[o[0]], V = PTS[o[1]], e = sub(V, U);
    var den = d[0] * e[1] - d[1] * e[0];
    var w = sub(U, S0), tt = (w[0] * d[1] - w[1] * d[0]) / den, k = (w[0] * e[1] - w[1] * e[0]) / den;
    if (!(tt > 0 && tt < 1 && k > 0 && k < 1)) ko('triangle ' + idx + ' : la bissectrice de ' + i + ' ne traverse pas le côté opposé');
    // et I est dessus
    if (distDroite(I, sienne[0].a, sienne[0].b) > 1e-9) ko('triangle ' + idx + ' : I n\'est pas sur la bissectrice de ' + i);
    if (!sienne[0].o.visible) ko('triangle ' + idx + ' : la bissectrice de ' + i + ' n\'est pas affichée à la fin');
  });

  /* --- 3. le codage : deux demi-angles égaux à chaque sommet ---------- */
  var CO = codages();
  if (CO.length !== 6) { ko('triangle ' + idx + ' : ' + CO.length + ' arcs de codage au lieu de 6'); }
  else {
    [0, 1, 2].forEach(function (i) {
      var S0 = PTS[i];
      var miens = CO.filter(function (c) { return Math.abs(di(c.pts[0], S0) - di(c.pts[12], S0)) < 1e-9 && di(c.pts[0], S0) < 1; });
      if (miens.length !== 2) { ko('triangle ' + idx + ' : le sommet ' + i + ' n\'a pas ses deux arcs'); return; }
      var s1 = angleEntre(sub(miens[0].pts[0], S0), sub(miens[0].pts[12], S0));
      var s2 = angleEntre(sub(miens[1].pts[0], S0), sub(miens[1].pts[12], S0));
      if (Math.abs(s1 - s2) > 1e-9) ko('triangle ' + idx + ' : les deux demi-angles codés en ' + i + ' diffèrent');
      var o = OPP[i], plein = angleEntre(sub(PTS[o[0]], S0), sub(PTS[o[1]], S0));
      if (Math.abs(s1 + s2 - plein) > 1e-9) ko('triangle ' + idx + ' : les deux demi-angles ne font pas l\'angle entier en ' + i);
      // l'un commence sur un côté, l'autre finit sur l'autre côté
      var surCote = miens.filter(function (c) {
        return distDroite(c.pts[0], S0, PTS[o[0]]) < 1e-9 || distDroite(c.pts[0], S0, PTS[o[1]]) < 1e-9 ||
               distDroite(c.pts[12], S0, PTS[o[0]]) < 1e-9 || distDroite(c.pts[12], S0, PTS[o[1]]) < 1e-9;
      });
      if (surCote.length !== 2) ko('triangle ' + idx + ' : les arcs de codage ne s\'appuient pas sur les côtés en ' + i);
    });
  }

  /* --- 4. les trois distances : perpendiculaires, sur le segment ------ */
  var DI = distancesTracees();
  if (DI.length !== 3) ko('triangle ' + idx + ' : ' + DI.length + ' distances tracées au lieu de 3');
  else {
    DI.forEach(function (dd) {
      if (di(dd.a, I) > 1e-9) ko('triangle ' + idx + ' : une distance ne part pas de I');
      var ok = false;
      OPP.forEach(function (o) {
        var U = PTS[o[0]], V = PTS[o[1]];
        if (distDroite(dd.b, U, V) > 1e-9) return;
        var e = sub(V, U), tt = dot(sub(dd.b, U), e) / dot(e, e);
        if (tt < 0 || tt > 1) ko('triangle ' + idx + ' : un point de contact est hors du côté');
        if (Math.abs(dot(sub(dd.b, dd.a), e)) > 1e-9) ko('triangle ' + idx + ' : la distance tracée n\'est pas perpendiculaire au côté');
        if (Math.abs(di(dd.a, dd.b) - r) > 1e-9) ko('triangle ' + idx + ' : la distance tracée ne vaut pas le rayon');
        ok = true;
      });
      if (!ok) ko('triangle ' + idx + ' : une distance n\'aboutit sur aucun côté');
    });
  }

  /* --- 5. le cercle tracé : centre I, rayon r, refermé --------------- */
  var ce = cercleTrace();
  if (!ce) ko('le cercle inscrit est introuvable');
  else {
    var deb = ce.parents[2](), fin = ce.parents[3]();
    if (Math.abs(fin - deb - 2 * Math.PI) > 1e-9) ko('triangle ' + idx + ' : le cercle n\'est pas refermé');
    [0, 0.17, 0.4, 0.62, 0.83].forEach(function (k) {
      var a = deb + (fin - deb) * k, p = [ce.parents[0](a), ce.parents[1](a)];
      if (Math.abs(di(p, I) - r) > 1e-9) ko('triangle ' + idx + ' : un point du cercle est à ' + di(p, I).toFixed(3) + ' de I au lieu de ' + r.toFixed(3));
      // il reste dans le triangle (il touche les côtés sans les traverser)
      if (!dedans(p, A, B, C) && Math.min(distDroite(p, B, C), distDroite(p, C, A), distDroite(p, A, B)) > 1e-6)
        ko('triangle ' + idx + ' : le cercle inscrit sort du triangle');
    });
  }
  var note = noteRayons();
  var nombres = (note.match(/\d+,\d+/g) || []).map(function (s) { return parseFloat(s.replace(',', '.')); });
  if (nombres.length !== 3 || nombres.some(function (x) { return Math.abs(x - r) > 0.006; }))
    ko('triangle ' + idx + ' : la note des distances devrait écrire trois fois ' + r.toFixed(2) + ' : ' + note);

  /* --- 6. le bandeau dit-il vrai ? ----------------------------------- */
  var txt = bandeau();
  var iso = equi || eg(cotes[0], cotes[1]) || eg(cotes[1], cotes[2]) || eg(cotes[0], cotes[2]);
  function angle(s, u2, v2) { return angleEntre(sub(u2, s), sub(v2, s)); }
  var ang = [angle(A, B, C), angle(B, A, C), angle(C, A, B)], maxi = Math.max(ang[0], ang[1], ang[2]);
  if (equi) { if (!/équilatéral/.test(txt) || !/CONFONDUS/.test(txt)) ko('triangle ' + idx + ' : équilatéral non signalé → ' + txt); }
  else if (iso) { if (!/isocèle/.test(txt)) ko('triangle ' + idx + ' : isocèle non signalé → ' + txt); }
  else if (Math.abs(maxi - 90) < 0.6) { if (!/rectangle/.test(txt) || !/INTÉRIEUR/.test(txt)) ko('triangle ' + idx + ' : rectangle → ' + txt); }
  else if (maxi > 90.6) { if (!/obtus/.test(txt) || !/INTÉRIEUR/.test(txt)) ko('triangle ' + idx + ' : obtus → ' + txt); }
  else if (!/aigus/.test(txt) || !/INTÉRIEUR/.test(txt)) ko('triangle ' + idx + ' : trois angles aigus → ' + txt);
  if (/EXTÉRIEUR/.test(txt)) ko('triangle ' + idx + ' : le bandeau ne doit jamais placer I dehors');
});

/* ------------------------------------------------------------------ */
/* Les couches cercle circonscrit / médianes                            */
/* ------------------------------------------------------------------ */
function couche(coul) {
  return objets.filter(function (o) {
    return (o.type === 'line' || o.type === 'segment') && o.attr.strokeColor === coul;
  });
}
placer([[-5, -2], [5, -2], [-3.5, 0.8]]);        // obtusangle : O sort, I reste
jouerTout();
var MT = couche('#0d9488'), MD = couche('#65a30d');
if (MT.length !== 3 || MD.length !== 3) ko('les couches médiatrices/médianes n\'ont pas 3 droites');
if (MT.some(function (h) { return h.visible; }) || objetNomme('O').visible) ko('le cercle circonscrit est visible sans être coché');
controles.circ.onChange(true);
if (!MT.every(function (h) { return h.visible; }) || !objetNomme('O').visible) ko('cocher « Cercle circonscrit » ne le montre pas');
var Oc = pointNomme('O'), A0 = P(0), B0 = P(1), C0 = P(2);
if (Math.abs(di(Oc, A0) - di(Oc, B0)) > 1e-9 || Math.abs(di(Oc, B0) - di(Oc, C0)) > 1e-9) ko('O affiché n\'est pas équidistant des sommets');
if (dedans(Oc, A0, B0, C0)) ko('obtusangle : O devrait être dehors');
if (!dedans(pointNomme('I'), A0, B0, C0)) ko('obtusangle : I devrait être dedans');
// chaque médiatrice affichée passe par O et par un milieu, perpendiculairement
MT.forEach(function (m) {
  var p1 = [m.parents[0].X(), m.parents[0].Y()], p2 = [m.parents[1].X(), m.parents[1].Y()];
  if (distDroite(Oc, p1, p2) > 1e-9) ko('une médiatrice affichée ne passe pas par O');
});
controles.medi.onChange(true);
if (!MD.every(function (m) { return m.visible; })) ko('cocher « Les médianes » ne les montre pas');
controles.circ.onChange(false); controles.medi.onChange(false);
if (MT.some(function (h) { return h.visible; }) || MD.some(function (m) { return m.visible; })) ko('décocher ne masque pas les couches');

/* Dans l'isocèle, la bissectrice du sommet principal passe par le milieu de
   la base et lui est perpendiculaire : hauteur, médiane, médiatrice. */
placer([[-3.4, -2.6], [3.4, -2.6], [0, 3.6]]);
jouerTout();
var Cc = P(2), milAB = [0, -2.6];
var bC = bissectrices().filter(function (b) { return di(b.a, Cc) < 1e-9; })[0];
if (!bC) ko('isocèle : la bissectrice de C est introuvable');
else if (distDroite(milAB, bC.a, bC.b) > 1e-9) ko('isocèle : la bissectrice de C ne passe pas par le milieu de la base');
if (!/isocèle en C/.test(bandeau())) ko('isocèle en C non signalé : ' + bandeau());

/* ------------------------------------------------------------------ */
/* Rejeu, remise à zéro, triangle aplati                               */
/* ------------------------------------------------------------------ */
placer([[-4.2, -2.6], [4.2, -2.6], [0.8, 3.2]]);
jouerTout();
var avant = pointNomme('I').slice(), n0 = objets.length;
controles.play.onClick();
mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); if (s.after) s.after(); });
board.update();
if (di(avant, pointNomme('I')) > 1e-12) ko('rejouer l\'animation déplace I');
if (objets.length !== n0) ko('l\'animation crée ' + (objets.length - n0) + ' objets de plus à chaque tour');
if (mv._steps.length !== 9) ko('neuf étapes attendues (3 × 2 + concours + distances + cercle), ' + mv._steps.length);
// pendant l'étape « angle allumé » du premier sommet, rien d'autre n'est visible
controles.reset.onClick(); mv._steps[0].step(0.5); board.update();
if (bissectrices().some(function (b) { return b.o.visible; })) ko('la première bissectrice apparaît avant son étape');
controles.all.onClick(); board.update();
if (!objetNomme('I').visible || !cercleTrace().visible) ko('« Tout afficher » doit montrer I et le cercle');
controles.reset.onClick(); board.update();
if (objetNomme('I').visible || cercleTrace().visible) ko('I ou le cercle restent affichés après la remise à zéro');

placer([[-4, 0], [4, 0], [0, 0.02]]);
jouerTout();
if (!/align/.test(bandeau())) ko('un triangle aplati n\'est pas signalé');
if (objetNomme('I').visible) ko('un triangle aplati laisse I affiché');

print(nb + ' triangles vérifiés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES TROIS BISSECTRICES SE COUPENT EN I, À ÉGALE DISTANCE DES TROIS CÔTÉS, ET LE CERCLE LES TOUCHE');
