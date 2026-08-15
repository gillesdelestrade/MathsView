/* La leçon « Lire et placer un point dans un repère » (5ème).
 *
 * Le trajet est le cœur de la leçon : autant de bonds que la valeur absolue de
 * la coordonnée, dans le bon sens, et l'horizontale AVANT la verticale. On
 * relit donc les bonds réellement tracés — leurs extrémités, dans l'ordre — et
 * on vérifie qu'ils vont bien de l'origine au point, en passant par le pied de
 * la verticale.
 *
 * On vérifie aussi ce que le bandeau raconte : le nombre de bonds, leur sens
 * (« vers la gauche » quand l'abscisse est négative), et l'écriture des
 * coordonnées — l'abscisse en premier, avec le vrai signe moins.
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
      o.on = function (ev, f) { (o._h = o._h || {})[ev] = f; };
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
    getBoundingBox: function () { return [-7.5, 6.5, 7.5, -6.5]; },
    setBoundingBox: function () {}
  };
}

load('js/alea.js');
var MathsView = { lecon: null, register: function (l) { MathsView.lecon = l; }, fonctions: null };
window.MathsView = MathsView;
load('lessons/5eme/reperage.js');

var extras = fauxEl('div');
var controles = {};
var mv = {
  extras: extras,
  onCleanup: function () {},
  addControls: function (specs) { specs.forEach(function (s) { controles[s.id] = s; }); return controles; },
  createAnimator: function () {
    return { runSteps: function (steps) { mv._steps = steps; }, cancel: function () {} };
  }
};
var board = fauxBoard();
MathsView.lecon.setup(board, mv);

var err = [], nb = 0;
function ko(m) { if (err.length < 20 && err.indexOf(m) < 0) err.push(m); }
function di(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

var P = objets.filter(function (o) { return o.type === 'point' && o.attr.name === 'A'; })[0];
if (!P) throw new Error('le point A est introuvable');
var panneau = extras.children[0];

function placer(x, y) { P.setPosition(1, [x, y]); }
/* On passe par le bouton ▶ : c'est lui qui reconstruit les étapes à partir de
   la position courante. Rejouer les anciennes étapes reviendrait à animer le
   point précédent. */
function jouerTout() {
  controles.play.onClick();
  mv._steps.forEach(function (s) { s.step(1); });
  board.update();
}
/* Les bonds visibles, relus dans la figure : on prend leurs deux extrémités. */
function bonds(couleur) {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.visible && o.attr.strokeColor === couleur &&
           o.attr.strokeWidth === 2.6 && o.attr.numberPointsHigh === 26;
  }).map(function (o) {
    var u1 = typeof o.parents[3] === 'function' ? o.parents[3]() : o.parents[3];
    return { de: [o.parents[0](0), o.parents[1](0)],
             a: [o.parents[0](u1), o.parents[1](u1)], fin: u1 };
  });
}
function texte(n) { return panneau.innerHTML; }

/* ------------------------------------------------------------------ */
var rnd = MathsAlea(20260818);
var essais = [[3, -2], [0, 0], [4, 0], [0, -3], [-5, 4], [6, 5], [-6, -5], [1, 1]];
for (var t = 0; t < 60; t++) {
  essais.push([rnd.entier(-6, 6), rnd.entier(-5, 5)]);
}

essais.forEach(function (c) {
  var x = c[0], y = c[1];
  nb++;
  placer(x, y);
  jouerTout();

  /* --- 1. le bon nombre de bonds, dans le bon sens ----------------- */
  var bx = bonds('#2563eb'), by = bonds('#059669');
  if (bx.length !== Math.abs(x))
    ko('(' + x + ' ; ' + y + ') : ' + bx.length + ' bond(s) horizontaux au lieu de ' +
       Math.abs(x));
  if (by.length !== Math.abs(y))
    ko('(' + x + ' ; ' + y + ') : ' + by.length + ' bond(s) verticaux au lieu de ' +
       Math.abs(y));

  /* --- 2. ils s'enchaînent de l'origine au point ------------------- */
  var pos = [0, 0];
  bx.forEach(function (b, i) {
    if (di(b.de, pos) > 1e-9)
      ko('(' + x + ' ; ' + y + ') : le bond horizontal ' + (i + 1) + ' ne part pas d\'où le ' +
         'précédent est arrivé');
    if (Math.abs(b.a[0] - b.de[0]) - 1 > 1e-9 || Math.abs(b.a[1] - b.de[1]) > 1e-9)
      ko('(' + x + ' ; ' + y + ') : un bond horizontal ne fait pas exactement un carreau');
    if ((b.a[0] - b.de[0]) * (x >= 0 ? 1 : -1) < 0)
      ko('(' + x + ' ; ' + y + ') : un bond horizontal part du mauvais côté');
    pos = b.a;
  });
  if (di(pos, [x, 0]) > 1e-9)
    ko('(' + x + ' ; ' + y + ') : les bonds horizontaux n\'arrivent pas en (' + x + ' ; 0)');
  by.forEach(function (b, i) {
    if (di(b.de, pos) > 1e-9)
      ko('(' + x + ' ; ' + y + ') : le bond vertical ' + (i + 1) + ' ne part pas d\'où le ' +
         'précédent est arrivé');
    if (Math.abs(b.a[1] - b.de[1]) - 1 > 1e-9 || Math.abs(b.a[0] - b.de[0]) > 1e-9)
      ko('(' + x + ' ; ' + y + ') : un bond vertical ne fait pas exactement un carreau');
    if ((b.a[1] - b.de[1]) * (y >= 0 ? 1 : -1) < 0)
      ko('(' + x + ' ; ' + y + ') : un bond vertical part du mauvais côté');
    pos = b.a;
  });
  if (di(pos, [x, y]) > 1e-9)
    ko('(' + x + ' ; ' + y + ') : le trajet n\'arrive pas sur le point');

  /* --- 3. le bandeau dit la même chose ----------------------------- */
  var h = texte();
  var mx = /(\d+) bonds? ([^<]*)<\/b>/.exec(h);
  if (!mx) ko('(' + x + ' ; ' + y + ') : le bandeau ne dit pas le nombre de bonds');
  else {
    if (+mx[1] !== Math.abs(x))
      ko('(' + x + ' ; ' + y + ') : le bandeau annonce ' + mx[1] + ' bonds horizontaux');
    var attendu = x > 0 ? 'vers la droite' : x < 0 ? 'vers la gauche' : 'aucun bond';
    if (mx[2].indexOf(attendu) < 0)
      ko('(' + x + ' ; ' + y + ') : le sens horizontal annoncé est « ' + mx[2] + ' » au lieu ' +
         'de « ' + attendu + ' »');
  }
  var tous = h.match(/(\d+) bonds? ([^<]*)<\/b>/g) || [];
  if (tous.length === 2) {
    var m2 = /(\d+) bonds? ([^<]*)<\/b>/.exec(tous[1]);
    if (+m2[1] !== Math.abs(y))
      ko('(' + x + ' ; ' + y + ') : le bandeau annonce ' + m2[1] + ' bonds verticaux');
    var att2 = y > 0 ? 'vers le haut' : y < 0 ? 'vers le bas' : 'aucun bond';
    if (m2[2].indexOf(att2) < 0)
      ko('(' + x + ' ; ' + y + ') : le sens vertical annoncé est « ' + m2[2] + ' »');
  } else ko('(' + x + ' ; ' + y + ') : le bandeau ne donne pas les deux directions');

  /* --- 4. les coordonnées sont écrites dans le bon ordre ----------- */
  function nb2(v) { return String(v).replace('-', '−'); }
  if (h.indexOf('A(' + nb2(x) + ' ; ' + nb2(y) + ')') < 0)
    ko('(' + x + ' ; ' + y + ') : le bandeau n\'écrit pas A(' + nb2(x) + ' ; ' + nb2(y) + ')');
  if (x !== y && h.indexOf('A(' + nb2(y) + ' ; ' + nb2(x) + ')') >= 0)
    ko('(' + x + ' ; ' + y + ') : le bandeau écrit les coordonnées dans le mauvais ordre');
  if (/-\d/.test(h.replace(/style="[^"]*"/g, '')))
    ko('(' + x + ' ; ' + y + ') : un signe moins ASCII traîne dans le bandeau');
});

/* ------------------------------------------------------------------ */
/* Le mode « placer » : le point n'apparaît qu'à l'arrivée              */
/* ------------------------------------------------------------------ */
placer(3, -2);
controles.mode.onClick();                       // on passe en « placer »
controles.reset.onClick();
mv._steps[0].step(0.4); board.update();
if (P.visible) ko('en mode « placer », le point est montré avant la fin du trajet');
if (panneau.innerHTML.indexOf('Placer le point A(3 ; −2)') < 0)
  ko('en mode « placer », le bandeau n\'annonce pas les coordonnées données');
jouerTout();
if (!P.visible) ko('en mode « placer », le point n\'apparaît pas à l\'arrivée');
controles.mode.onClick();                       // retour en « lire »
jouerTout();
if (!P.visible) ko('en mode « lire », le point devrait être visible dès le départ');
if (panneau.innerHTML.indexOf('Lire les coordonnées') < 0)
  ko('en mode « lire », le bandeau n\'annonce pas la lecture');

/* ------------------------------------------------------------------ */
/* Le point inversé                                                    */
/* ------------------------------------------------------------------ */
placer(4, -1);
jouerTout();
var B = objets.filter(function (o) { return o.type === 'point' && o.attr.name === 'B'; })[0];
if (!B) ko('le point inversé B est introuvable');
else {
  if (B.visible) ko('le point inversé est montré sans être demandé');
  controles.inv.onChange(true);
  board.update();
  if (!B.visible) ko('cocher « Et si on inversait ? » ne montre pas le point B');
  if (Math.abs(B.X() - (-1)) > 1e-9 || Math.abs(B.Y() - 4) > 1e-9)
    ko('le point inversé n\'est pas en (−1 ; 4) mais en (' + B.X() + ' ; ' + B.Y() + ')');
  controles.inv.onChange(false);
}

/* ------------------------------------------------------------------ */
/* Les zones du plan                                                   */
/* ------------------------------------------------------------------ */
/* Quatre quadrants teintés, leurs signes, et quatre légendes le long des axes.
   Le bandeau doit en outre dire où tombe le point courant — c'est ce qui relie
   la règle générale au cas qu'on a sous les yeux. */
function zones() {
  return objets.filter(function (o) {
    return o.type === 'curve' && o.attr.fillOpacity === 0.07;
  });
}
placer(-4, 3);
jouerTout();
if (zones().length !== 4) ko('il n\'y a pas quatre quadrants');
if (zones().some(function (z) { return z.visible; }))
  ko('les zones sont montrées sans être demandées');
if (panneau.innerHTML.indexOf('à gauche') < 0 ||
    panneau.innerHTML.indexOf('au-dessus') < 0)
  ko('le bandeau ne dit pas dans quelle zone tombe le point');
if (panneau.innerHTML.indexOf('négatives') < 0 || panneau.innerHTML.indexOf('positives') < 0)
  ko('le bandeau ne relie pas la zone au signe des coordonnées');
controles.zones.onChange(true);
board.update();
if (!zones().every(function (z) { return z.visible; }))
  ko('cocher « Les signes dans le plan » ne montre pas les quatre zones');
var legendes = objets.filter(function (o) {
  return o.type === 'text' && o.visible &&
         /abscisses (positives|négatives)|ordonnées (positives|négatives)/
           .test(String(typeof o.parents[2] === 'function' ? o.parents[2]() : o.parents[2]));
});
if (legendes.length !== 4) ko('les quatre légendes des axes ne sont pas toutes affichées');
controles.zones.onChange(false);
board.update();
if (zones().some(function (z) { return z.visible; })) ko('décocher ne masque pas les zones');

// et le bandeau suit le point : sur un axe, il le dit
placer(0, -3);
jouerTout();
if (panneau.innerHTML.indexOf('sur l\'axe vertical') < 0)
  ko('un point d\'abscisse nulle n\'est pas signalé sur l\'axe vertical');
placer(5, 0);
jouerTout();
if (panneau.innerHTML.indexOf('sur l\'axe horizontal') < 0)
  ko('un point d\'ordonnée nulle n\'est pas signalé sur l\'axe horizontal');

/* ------------------------------------------------------------------ */
/* Rejeu et remise à zéro                                              */
/* ------------------------------------------------------------------ */
placer(-5, 3);
jouerTout();
var n0 = objets.length, ecran = panneau.innerHTML;
controles.play.onClick();
mv._steps.forEach(function (s) { s.step(0); s.step(0.5); s.step(1); });
board.update();
if (panneau.innerHTML !== ecran) ko('rejouer l\'animation ne redonne pas le même bandeau');
if (objets.length !== n0)
  ko('l\'animation crée ' + (objets.length - n0) + ' objets de plus à chaque tour');
controles.reset.onClick(); board.update();
if (bonds('#2563eb').length || bonds('#059669').length)
  ko('la remise à zéro laisse des bonds affichés');

print(nb + ' positions vérifiées');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('LE TRAJET VA DE L\'ORIGINE AU POINT, ET LE BANDEAU DIT LA MÊME CHOSE');
