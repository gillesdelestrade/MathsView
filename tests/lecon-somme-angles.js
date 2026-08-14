/* La leçon « La somme des angles d'un triangle ».
 *
 * Ce qui doit être vrai n'est pas « ça a l'air de marcher » : les trois copies
 * doivent PAVER le demi-tour — même ouverture que dans le triangle, posées bout
 * à bout, sans trou ni chevauchement, et exactement jusqu'à 180°. On ne se fie
 * donc pas aux variables du script : on relit les secteurs RÉELLEMENT TRACÉS en
 * échantillonnant les courbes, comme on relirait un dessin, et on en déduit
 * centre, rayon, direction de départ et ouverture.
 *
 * Le même contrôle est fait sur la démonstration : les deux angles
 * alternes-internes tracés au sommet C doivent mesurer  et B̂, et les trois
 * angles qui se suivent le long de la parallèle doivent faire un angle plat.
 */
var window = this;
// jsc n'a pas les minuteurs du navigateur ; la leçon en pose un pour
// enchaîner changement de forme et relance de l'animation.
var clearTimeout = function () {};
var setTimeout = function (f) { f(); return 0; };

/* ---------------- DOM de poche ---------------- */
function fauxEl(tag) {
  var e = { tag: tag, className: '', _html: '', children: [],
            appendChild: function (c) { this.children.push(c); return c; } };
  Object.defineProperty(e, 'innerHTML',
    { get: function () { return e._html; }, set: function (v) { e._html = v; } });
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
      // Dans JSXGraph, un objet est VISIBLE par défaut : seul `visible: false`
      // le cache. Le faux tableau doit faire pareil, sinon le triangle et ses
      // sommets disparaîtraient du rendu.
      var o = { type: type, parents: parents, attr: attr || {},
                visible: !(attr && attr.visible === false) };
      if (type === 'point') {
        var x = parents[0], y = parents[1];
        o.X = function () { return x; };
        o.Y = function () { return y; };
        o.setPosition = function (m, p) { x = p[0]; y = p[1]; };
        o.moveTo = function (p) { x = p[0]; y = p[1]; };
        o.on = function (ev, f) { (o._h = o._h || {})[ev] = f; };
      }
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
    getBoundingBox: function () { return [-11.5, 6.4, 11.5, -6.4]; },
    setBoundingBox: function () {}
  };
}

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/somme-angles-triangle.js');
var lecon = MathsView.lecon;

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  addControls: function (specs) {
    specs.forEach(function (s) { controles[s.id] = s; });
    return controles;
  },
  createAnimator: function () {
    return { runSteps: function (steps, reset) { mv._steps = steps; mv._reset = reset; },
             cancel: function () {} };
  }
};
var board = fauxBoard();
lecon.setup(board, mv);

var err = [];
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }

/* les points du triangle, dans l'ordre de création */
var sommets = objets.filter(function (o) {
  return o.type === 'point' && ['A', 'B', 'C'].indexOf(o.attr.name) >= 0;
});
if (sommets.length !== 3) throw new Error('les trois sommets sont introuvables');

/* les courbes : 3 marques, 3 volants, la parallèle, 2 alternes-internes */
var courbes = objets.filter(function (o) { return o.type === 'curve'; });
var marques = courbes.slice(0, 3), volants = courbes.slice(3, 6);
var paraSeg = courbes[6], altA = courbes[7], altB = courbes[8];
if (courbes.length !== 9) ko('nombre de courbes inattendu : ' + courbes.length);

/* les textes, pour relire les mesures affichées */
var textes = objets.filter(function (o) { return o.type === 'text'; });
function contenu(t) {
  var c = t.parents[2];
  return typeof c === 'function' ? c() : c;
}

/* ------------------------------------------------------------------ */
/* Relire un secteur réellement tracé                                  */
/* ------------------------------------------------------------------ */
function relire(courbe) {
  function pt(u) { return [courbe.parents[0](u), courbe.parents[1](u)]; }
  var c = pt(0);                      // u = 0 : on est au centre
  var BORD = 0.14;
  var d = pt(BORD), f = pt(1 - BORD);
  var r = Math.hypot(d[0] - c[0], d[1] - c[1]);
  if (r < 1e-9) return { c: c, r: 0, a0: 0, ouv: 0 };
  var a0 = Math.atan2(d[1] - c[1], d[0] - c[0]);
  // l'ouverture se mesure en suivant l'arc, pas en comparant les extrémités :
  // un secteur de plus d'un demi-tour se lirait sinon à l'envers
  var ouv = 0, prec = a0;
  for (var k = 1; k <= 24; k++) {
    var p = pt(BORD + (1 - 2 * BORD) * k / 24);
    var a = Math.atan2(p[1] - c[1], p[0] - c[0]);
    var da = a - prec;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    ouv += da; prec = a;
    var rr = Math.hypot(p[0] - c[0], p[1] - c[1]);
    if (Math.abs(rr - r) > 1e-6) ko('un secteur n\'est pas de rayon constant');
  }
  return { c: c, r: r, a0: a0, ouv: ouv, fin: f };
}
function deg(a) { return a * 180 / Math.PI; }

/* ------------------------------------------------------------------ */
/* Rejouer l'animation jusqu'à un avancement donné                     */
/* ------------------------------------------------------------------ */
function jouerJusqu(n, q) {
  controles.reset.onClick();
  for (var i = 0; i < n; i++) mv._steps[i].step(1);
  if (q !== undefined && n < mv._steps.length) mv._steps[n].step(q);
  board.update();
}
function placer(A, B, C) {
  sommets[0].setPosition(1, A); sommets[1].setPosition(1, B); sommets[2].setPosition(1, C);
}

/* ------------------------------------------------------------------ */
var rnd = MathsAlea(20260814);
var essais = [
  [[-9.4, -3.4], [-2.2, -4.2], [-5.2, 3.4]],          // les quatre formes du bouton
  [[-9.2, -3.6], [-2.6, -3.6], [-9.2, 3.2]],
  [[-9.2, -3.4], [-2.6, -3.4], [-5.9, 2.31]],
  [[-2.0, -5.0], [-9.8, 1.0], [-3.0, 4.9]],           // très obtus
  [[-6.0, -5.2], [-5.6, 5.2], [-10.4, 0.1]]           // très étroit
];
for (var t = 0; t < 60; t++) {
  essais.push([0, 1, 2].map(function () {
    return [rnd.entier(-104, -16) / 10, rnd.entier(-52, 52) / 10];
  }));
}

var nb = 0;
essais.forEach(function (tri, idx) {
  // un triangle trop plat n'est pas un cas de test : la leçon le signale
  var ux = tri[1][0] - tri[0][0], uy = tri[1][1] - tri[0][1];
  var vx = tri[2][0] - tri[0][0], vy = tri[2][1] - tri[0][1];
  if (Math.abs(ux * vy - uy * vx) < 3) return;
  nb++;
  placer(tri[0], tri[1], tri[2]);

  /* --- 1. les angles marqués sur le triangle ---------------------- */
  jouerJusqu(1);
  var M = marques.map(relire);
  var somme = M.reduce(function (s, m) { return s + m.ouv; }, 0);
  if (Math.abs(somme - Math.PI) > 1e-9)
    ko('triangle ' + idx + ' : les trois angles marqués font ' + deg(somme).toFixed(3) +
       '° et non 180°');
  M.forEach(function (m, i) {
    if (m.ouv <= 0 || m.ouv >= Math.PI)
      ko('triangle ' + idx + ' : l\'angle ' + 'ABC'[i] + ' vaut ' + deg(m.ouv).toFixed(1) + '°');
    // le secteur doit être posé SUR le sommet, et balayer l'intérieur
    var S = tri[i];
    if (Math.hypot(m.c[0] - S[0], m.c[1] - S[1]) > 1e-9)
      ko('triangle ' + idx + ' : la marque de ' + 'ABC'[i] + ' n\'est pas sur le sommet');
    // la bissectrice du secteur doit pointer vers l'intérieur du triangle
    var mid = m.a0 + m.ouv / 2;
    var G = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3];
    var vers = Math.atan2(G[1] - S[1], G[0] - S[0]);
    var ec = Math.abs(((mid - vers + Math.PI) % (2 * Math.PI)) - Math.PI);
    if (ec > Math.PI / 2)
      ko('triangle ' + idx + ' : le secteur de ' + 'ABC'[i] + ' est tracé du mauvais côté ' +
         '(il vise dehors)');
  });

  /* --- 2. le voyage ne déforme jamais l'angle --------------------- */
  [0.2, 0.5, 0.8].forEach(function (q) {
    jouerJusqu(1, q);                       // la copie de  est en vol
    var v = relire(volants[0]);
    if (Math.abs(v.ouv - M[0].ouv) > 1e-9)
      ko('triangle ' + idx + ' : en vol, la copie de  mesure ' + deg(v.ouv).toFixed(3) +
         '° au lieu de ' + deg(M[0].ouv).toFixed(3) + '° — elle se déforme');
    if (Math.abs(v.r - M[0].r) > 1e-9)
      ko('triangle ' + idx + ' : la copie change de rayon en vol');
  });

  /* --- 3. arrivées, les trois copies pavent le demi-tour ---------- */
  jouerJusqu(4);
  var V = volants.map(relire);
  V.forEach(function (v, i) {
    if (Math.abs(v.ouv - M[i].ouv) > 1e-9)
      ko('triangle ' + idx + ' : la copie ' + i + ' n\'a pas l\'ouverture de son angle');
    if (Math.hypot(v.c[0] - V[0].c[0], v.c[1] - V[0].c[1]) > 1e-9)
      ko('triangle ' + idx + ' : les trois copies n\'ont pas le même sommet');
  });
  // elles doivent partir de la droite et se suivre exactement
  function norm(a) { var x = a % (2 * Math.PI); return x < 0 ? x + 2 * Math.PI : x; }
  if (Math.abs(norm(V[0].a0)) > 1e-9 && Math.abs(norm(V[0].a0) - 2 * Math.PI) > 1e-9)
    ko('triangle ' + idx + ' : la première copie ne part pas de la droite (' +
       deg(norm(V[0].a0)).toFixed(2) + '°)');
  for (var i = 1; i < 3; i++) {
    var finPrec = V[i - 1].a0 + V[i - 1].ouv;
    var ecart = norm(V[i].a0 - finPrec);
    if (ecart > 1e-9 && Math.abs(ecart - 2 * Math.PI) > 1e-9)
      ko('triangle ' + idx + ' : trou ou chevauchement entre les copies ' + (i - 1) +
         ' et ' + i + ' (' + deg(ecart).toFixed(3) + '°)');
  }
  var fin = V[2].a0 + V[2].ouv - V[0].a0;
  if (Math.abs(fin - Math.PI) > 1e-9)
    ko('triangle ' + idx + ' : l\'empilement couvre ' + deg(fin).toFixed(3) +
       '° au lieu de 180°');
  // et tout cela tient dans le cadre
  var bb = board.getBoundingBox();
  [0, 1, 2].forEach(function (k) {
    for (var a = V[k].a0; a <= V[k].a0 + V[k].ouv + 1e-9; a += 0.1) {
      var p = [V[k].c[0] + Math.cos(a) * V[k].r, V[k].c[1] + Math.sin(a) * V[k].r];
      if (p[0] < bb[0] || p[0] > bb[2] || p[1] > bb[1] || p[1] < bb[3])
        ko('triangle ' + idx + ' : l\'empilement déborde du cadre');
    }
  });

  /* --- 4. les mesures affichées ----------------------------------- */
  jouerJusqu(5);
  var lus = textes.filter(function (x) { return /°$/.test(String(contenu(x))); })
                  .map(function (x) { return parseInt(contenu(x), 10); });
  var troisPremiers = lus.slice(0, 3);
  if (troisPremiers.length === 3) {
    var s = troisPremiers[0] + troisPremiers[1] + troisPremiers[2];
    if (s !== 180)
      ko('triangle ' + idx + ' : les mesures affichées font ' + s + '° (' +
         troisPremiers.join(' + ') + ')');
    troisPremiers.forEach(function (v, i) {
      if (Math.abs(v - deg(M[i].ouv)) > 1.0)
        ko('triangle ' + idx + ' : ' + 'ABC'[i] + ' affiche ' + v + '° pour un angle de ' +
           deg(M[i].ouv).toFixed(2) + '°');
    });
  }
  var ligne = textes.map(contenu).filter(function (c) { return /= 180°$/.test(String(c)); })[0];
  if (!ligne) ko('triangle ' + idx + ' : la ligne « … = 180° » manque');

  /* --- 5. la démonstration ---------------------------------------- */
  jouerJusqu(7);
  var aA = relire(altA), aB = relire(altB);
  if (Math.abs(aA.ouv - M[0].ouv) > 1e-9)
    ko('triangle ' + idx + ' : l\'angle alterne-interne côté A mesure ' +
       deg(aA.ouv).toFixed(3) + '° au lieu de  = ' + deg(M[0].ouv).toFixed(3) + '°');
  if (Math.abs(aB.ouv - M[1].ouv) > 1e-9)
    ko('triangle ' + idx + ' : l\'angle alterne-interne côté B mesure ' +
       deg(aB.ouv).toFixed(3) + '° au lieu de B̂ = ' + deg(M[1].ouv).toFixed(3) + '°');
  // les deux sont au sommet C
  [aA, aB].forEach(function (a, k) {
    if (Math.hypot(a.c[0] - tri[2][0], a.c[1] - tri[2][1]) > 1e-9)
      ko('triangle ' + idx + ' : l\'angle alterne-interne ' + k + ' n\'est pas au sommet C');
  });
  // les TROIS angles au sommet C se suivent et font un angle plat
  var trois = [aA, M[2], aB].map(function (a) { return { a0: a.a0, ouv: a.ouv }; });
  var couvert = trois.reduce(function (s, a) { return s + a.ouv; }, 0);
  if (Math.abs(couvert - Math.PI) > 1e-9)
    ko('triangle ' + idx + ' : au sommet C, les trois angles couvrent ' +
       deg(couvert).toFixed(3) + '° au lieu de 180°');
  /* Se suivent-ils ? On ne peut pas simplement les trier par angle de départ :
     la file peut enjamber le zéro (350°, 20°, 90°). On compte donc les
     JONCTIONS — la fin de l'un tombant sur le début d'un autre. Trois secteurs
     bout à bout en ont exactement deux. */
  var jonctions = 0;
  trois.forEach(function (a, ia) {
    trois.forEach(function (b, ib) {
      if (ia === ib) return;
      var e2 = norm(a.a0 - (b.a0 + b.ouv));
      if (e2 < 1e-9 || Math.abs(e2 - 2 * Math.PI) < 1e-9) jonctions++;
    });
  });
  if (jonctions !== 2)
    ko('triangle ' + idx + ' : au sommet C, les trois angles ne se suivent pas ' +
       '(' + jonctions + ' jonction(s) au lieu de 2)');
  // la parallèle par C doit bien être parallèle à (AB)
  var p0 = [paraSeg.parents[0](0), paraSeg.parents[1](0)];
  var p1 = [paraSeg.parents[0](1), paraSeg.parents[1](1)];
  var dpx = p1[0] - p0[0], dpy = p1[1] - p0[1];
  if (Math.abs(dpx * uy - dpy * ux) > 1e-9)
    ko('triangle ' + idx + ' : la « parallèle » n\'est pas parallèle à (AB)');
  var mil = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
  if (Math.hypot(mil[0] - tri[2][0], mil[1] - tri[2][1]) > 1e-9)
    ko('triangle ' + idx + ' : la parallèle ne passe pas par C');
});

/* ------------------------------------------------------------------ */
/* Rejouer ne doit rien empiler : l'animation est idempotente          */
/* ------------------------------------------------------------------ */
placer([-9.4, -3.4], [-2.2, -4.2], [-5.2, 3.4]);
jouerJusqu(8);
var apres1 = volants.map(relire);
jouerJusqu(8);
var apres2 = volants.map(relire);
apres1.forEach(function (a, i) {
  if (Math.abs(a.a0 - apres2[i].a0) > 1e-12 || Math.abs(a.ouv - apres2[i].ouv) > 1e-12)
    ko('rejouer l\'animation ne redonne pas la même figure');
});
var nbObjets = objets.length;
controles.play.onClick();
mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
if (objets.length !== nbObjets)
  ko('l\'animation crée ' + (objets.length - nbObjets) + ' objets de plus à chaque tour');

/* le triangle aplati doit être signalé, pas dessiné n'importe comment */
placer([-9, 0], [-3, 0], [-6, 0.01]);
jouerJusqu(8);
var panneau = extras.children[0];
if (!/align/.test(panneau.innerHTML))
  ko('un triangle aplati n\'est pas signalé dans le bandeau');
if (volants.some(function (v) { return v.visible; }))
  ko('un triangle aplati laisse les secteurs affichés');

/* les sommets restent dans la moitié gauche */
placer([-9.4, -3.4], [-2.2, -4.2], [-5.2, 3.4]);
sommets[0].setPosition(1, [5, 2]);
sommets[0]._h.drag();
if (sommets[0].X() > -1.4) ko('un sommet peut passer dans la moitié droite (x = ' +
  sommets[0].X() + ')');

print(nb + ' triangles vérifiés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('L\'EMPILEMENT PAVE LE DEMI-TOUR ET LA DÉMONSTRATION TIENT');
