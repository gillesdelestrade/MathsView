/* La leçon « Les médiatrices et le cercle circonscrit » (5ème).
 *
 * Le tableau JSXGraph est simulé : on capture les objets créés et surtout les
 * FONCTIONS de coordonnées, qu'on rappelle après avoir déplacé les sommets. On
 * peut donc vérifier la figure pour n'importe quel triangle, y compris ceux
 * qu'aucun bouton ne propose.
 *
 * Ce qui doit tenir :
 *   — chaque médiatrice passe par le milieu de SON côté et lui est
 *     perpendiculaire. C'est la définition, et rien ne garantit a priori que le
 *     tracé la respecte ;
 *   — les trois passent par O, qui est à égale distance des trois sommets ;
 *   — le cercle tracé a bien O pour centre et passe par les trois sommets ;
 *   — le bandeau dit VRAI sur la position de O — dedans, dehors, ou au milieu
 *     de l'hypoténuse — et ne confond pas les cas particuliers.
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
load('lessons/5eme/mediatrices-triangle.js');

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

/* Les six courbes des médiatrices (deux demi-droites par côté), repérées par
   leur couleur et leur épaisseur. */
function mediatrices() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.strokeColor === '#7c3aed' &&
           o.attr.strokeWidth === 2.6;
  }).map(function (o) {
    return { a: [o.parents[0](0), o.parents[1](0)],
             b: [o.parents[0](1), o.parents[1](1)] };
  });
}
function pointNomme(n) {
  var o = objets.filter(function (x) { return x.type === 'point' && x.attr.name === n; })[0];
  return o ? [o.X(), o.Y()] : null;
}
function objetO() {
  return objets.filter(function (x) { return x.type === 'point' && x.attr.name === 'O'; })[0];
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

/* ------------------------------------------------------------------ */
var rnd = MathsAlea(20260816);
var essais = [
  [[-4.2, -2.6], [4.2, -2.6], [0.8, 3.2]],        // les cinq formes du bouton
  [[-4, -2.8], [3.8, -2.8], [-4, 3.2]],
  [[-5, -2], [5, -2], [-3.5, 0.8]],
  [[-3.4, -2.6], [3.4, -2.6], [0, 3.6]],
  [[-3.46, -2], [3.46, -2], [0, 3.99]],
  [[-3, -3], [3, -3], [3, 3]],                    // rectangle en B
  [[-1, -3], [5, 1], [-5, 2]]                     // obtusangle quelconque
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

  var A = P(0), B = P(1), C = P(2);
  var O = pointNomme('O');
  if (!O) { ko('le point O est introuvable'); return; }

  /* --- 1. O est-il à égale distance des trois sommets ? ------------- */
  var r = di(O, A);
  if (Math.abs(di(O, B) - r) > 1e-9 || Math.abs(di(O, C) - r) > 1e-9)
    ko('triangle ' + idx + ' : OA = ' + r.toFixed(3) + ' mais OB = ' + di(O, B).toFixed(3) +
       ' et OC = ' + di(O, C).toFixed(3));

  /* --- 2. chaque médiatrice tracée en est-elle bien une ? ----------- */
  var M = mediatrices();
  if (M.length !== 6) { ko('triangle ' + idx + ' : ' + M.length + ' demi-droites au lieu de 6'); return; }
  var cotes = [[B, C], [C, A], [A, B]];
  cotes.forEach(function (co, i) {
    var mil = [(co[0][0] + co[1][0]) / 2, (co[0][1] + co[1][1]) / 2];
    // les deux demi-droites du côté i partent du milieu
    var siennes = M.filter(function (m) { return di(m.a, mil) < 1e-9; });
    if (siennes.length !== 2) {
      ko('triangle ' + idx + ' : la médiatrice du côté ' + i + ' ne part pas de son milieu');
      return;
    }
    siennes.forEach(function (m) {
      // perpendiculaire au côté
      var d = sub(m.b, m.a), cc = sub(co[1], co[0]);
      var cos = dot(d, cc) / (Math.hypot(d[0], d[1]) * Math.hypot(cc[0], cc[1]));
      if (Math.abs(cos) > 1e-9)
        ko('triangle ' + idx + ' : la médiatrice du côté ' + i + ' n\'est pas perpendiculaire');
      // et O est dessus
      var e = Math.abs(d[0] * (O[1] - m.a[1]) - d[1] * (O[0] - m.a[0])) / Math.hypot(d[0], d[1]);
      if (e > 1e-9)
        ko('triangle ' + idx + ' : O n\'est pas sur la médiatrice du côté ' + i);
    });
    // les deux moitiés partent en sens opposés : c'est une droite, pas un coude
    var d1 = sub(siennes[0].b, siennes[0].a), d2 = sub(siennes[1].b, siennes[1].a);
    if (dot(d1, d2) > 0)
      ko('triangle ' + idx + ' : les deux moitiés de la médiatrice partent du même côté');
  });

  /* --- 3. le cercle tracé passe-t-il par les trois sommets ? -------- */
  var ce = cercleTrace();
  if (!ce) ko('le cercle circonscrit est introuvable');
  else {
    var deb = ce.parents[2](), fin = ce.parents[3]();
    if (Math.abs(fin - deb - 2 * Math.PI) > 1e-9)
      ko('triangle ' + idx + ' : le cercle n\'est pas refermé (' +
         ((fin - deb) * 180 / Math.PI).toFixed(1) + '°)');
    [0, 0.17, 0.4, 0.62, 0.83].forEach(function (k) {
      var a = deb + (fin - deb) * k;
      var p = [ce.parents[0](a), ce.parents[1](a)];
      if (Math.abs(di(p, O) - r) > 1e-9)
        ko('triangle ' + idx + ' : un point du cercle est à ' + di(p, O).toFixed(3) +
           ' de O au lieu de ' + r.toFixed(3));
    });
  }

  /* --- 4. le bandeau dit-il vrai ? --------------------------------- */
  var txt = bandeau();
  function angle(s, u2, v2) {
    var p = sub(u2, s), q = sub(v2, s);
    return Math.acos(Math.max(-1, Math.min(1,
      dot(p, q) / (Math.hypot(p[0], p[1]) * Math.hypot(q[0], q[1]))))) * 180 / Math.PI;
  }
  var ang = [angle(A, B, C), angle(B, A, C), angle(C, A, B)];
  var maxi = Math.max(ang[0], ang[1], ang[2]);
  // O est-il dans le triangle ? (coordonnées barycentriques de signe constant)
  function dedans(p) {
    function s(u2, v2, w) {
      return (u2[0] - w[0]) * (v2[1] - w[1]) - (v2[0] - w[0]) * (u2[1] - w[1]);
    }
    var d1 = s(p, A, B), d2 = s(p, B, C), d3 = s(p, C, A);
    var neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    var pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(neg && pos);
  }
  var cotesL = [di(B, C), di(C, A), di(A, B)];
  function eg(x, y) { return Math.abs(x - y) < 0.008 * (x + y); }
  var equi = eg(cotesL[0], cotesL[1]) && eg(cotesL[1], cotesL[2]);
  var iso = equi || eg(cotesL[0], cotesL[1]) || eg(cotesL[1], cotesL[2]) || eg(cotesL[0], cotesL[2]);

  if (Math.abs(maxi - 90) < 0.6) {
    if (!/rectangle/.test(txt))
      ko('triangle ' + idx + ' : angle droit non signalé → ' + txt);
    /* O est le milieu de l'hypoténuse — exactement, et seulement si l'angle est
       exactement droit. La leçon annonce « rectangle » dès 0,6° près (c'est ce
       qu'un élève voit) ; on ne peut donc exiger le milieu AU MILLIONIÈME que
       pour un angle vraiment droit, et on tolère sinon l'écart que ce demi-degré
       entraîne. */
    var iD = ang.indexOf(maxi);
    var hyp = [[B, C], [C, A], [A, B]][iD];
    var milH = [(hyp[0][0] + hyp[1][0]) / 2, (hyp[0][1] + hyp[1][1]) / 2];
    var marge = Math.abs(maxi - 90) < 1e-9
      ? 1e-9
      : di(hyp[0], hyp[1]) * Math.abs(maxi - 90) * Math.PI / 180;
    if (di(O, milH) > marge + 1e-9)
      ko('triangle ' + idx + ' : O est à ' + di(O, milH).toFixed(4) +
         ' du milieu de l\'hypoténuse');
  } else if (equi) {
    if (!/équilatéral/.test(txt)) ko('triangle ' + idx + ' : équilatéral non signalé → ' + txt);
  } else if (maxi > 90.6) {
    if (!iso && !/EXTÉRIEUR/.test(txt))
      ko('triangle ' + idx + ' : angle obtus, O est dehors, le bandeau dit → ' + txt);
    if (dedans(O)) ko('triangle ' + idx + ' : angle obtus mais O est dans le triangle');
  } else if (!iso) {
    if (!/INTÉRIEUR/.test(txt))
      ko('triangle ' + idx + ' : trois angles aigus, le bandeau dit → ' + txt);
    if (!dedans(O)) ko('triangle ' + idx + ' : trois angles aigus mais O est dehors');
  }
});

/* ------------------------------------------------------------------ */
/* Les couches hauteurs / médianes                                     */
/* ------------------------------------------------------------------ */
function couche(coul) {
  return objets.filter(function (o) {
    return (o.type === 'line' || o.type === 'segment') && o.attr.strokeColor === coul;
  });
}
placer([[-3.4, -2.6], [3.4, -2.6], [0, 3.6]]);        // isocèle en C
jouerTout();
var H = couche('#0891b2'), MD = couche('#65a30d');
if (H.length !== 3 || MD.length !== 3) ko('les couches hauteurs/médianes n\'ont pas 3 droites');
if (H.some(function (h) { return h.visible; })) ko('les hauteurs sont visibles sans être cochées');
controles.haut.onChange(true);
if (!H.every(function (h) { return h.visible; })) ko('cocher « Les hauteurs » ne les montre pas');
controles.medi.onChange(true);
if (!MD.every(function (m) { return m.visible; })) ko('cocher « Les médianes » ne les montre pas');

/* Dans l'isocèle, la hauteur issue du sommet principal doit être portée par la
   médiatrice de la base : c'est ce que la leçon fait constater. */
var Aa = P(0), Bb = P(1), Cc = P(2);
var milAB = [(Aa[0] + Bb[0]) / 2, (Aa[1] + Bb[1]) / 2];
var med = mediatrices().filter(function (m) { return di(m.a, milAB) < 1e-9; })[0];
if (!med) ko('la médiatrice de la base est introuvable');
else {
  var d = sub(med.b, med.a);
  var e = Math.abs(d[0] * (Cc[1] - med.a[1]) - d[1] * (Cc[0] - med.a[0])) / Math.hypot(d[0], d[1]);
  if (e > 1e-9)
    ko('isocèle : la médiatrice de la base ne passe pas par le sommet principal');
}
controles.haut.onChange(false);
controles.medi.onChange(false);
if (H.some(function (h) { return h.visible; })) ko('décocher ne masque pas les hauteurs');

/* ------------------------------------------------------------------ */
/* Rejeu et triangle aplati                                            */
/* ------------------------------------------------------------------ */
placer([[-4.2, -2.6], [4.2, -2.6], [0.8, 3.2]]);
jouerTout();
var avant = pointNomme('O').slice(), n0 = objets.length;
controles.play.onClick();
mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); if (s.after) s.after(); });
board.update();
if (di(avant, pointNomme('O')) > 1e-12) ko('rejouer l\'animation déplace O');
if (objets.length !== n0)
  ko('l\'animation crée ' + (objets.length - n0) + ' objets de plus à chaque tour');

controles.reset.onClick(); board.update();
if (objetO().visible) ko('O reste affiché après la remise à zéro');

placer([[-4, 0], [4, 0], [0, 0.02]]);
jouerTout();
if (!/align/.test(bandeau())) ko('un triangle aplati n\'est pas signalé');
if (objetO().visible) ko('un triangle aplati laisse O affiché');

print(nb + ' triangles vérifiés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LES TROIS MÉDIATRICES SE COUPENT EN O, ET LE CERCLE PASSE PAR LES TROIS SOMMETS');
