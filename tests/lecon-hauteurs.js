/* Tableau JSXGraph simulé : on capture les objets créés et surtout les
   FONCTIONS de coordonnées, pour vérifier ensuite les propriétés de la figure. */
var cree = [], steps = null;
function elt(type, parents, attrs) {
  var o = { type: type, parents: parents || [], attrs: attrs || {},
            setAttribute: function (a) { for (var k in a) this.attrs[k] = a[k]; },
            on: function () {}, moveTo: function () {} };
  if (type === 'point') {
    if (typeof parents[0] === 'function') { o.X = parents[0]; o.Y = parents[1]; }
    else { o._x = parents[0]; o._y = parents[1];
           o.X = function () { return o._x; }; o.Y = function () { return o._y; }; }
  }
  cree.push(o); return o;
}
var board = { create: function (t, p, a) { return elt(t, p, a); },
              update: function () {}, on: function () {} };
var mv = {
  createAnimator: function () {
    return { cancel: function () {}, runSteps: function (s) { steps = s; } };
  },
  addControls: function () { return {}; }, onCleanup: function () {}, typeset: function () {}
};
var LECON = null;
var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/hauteurs-triangle.js');
LECON.setup(board, mv);

/* --- repérage des objets par leur rôle --- */
function nomme(n) { return cree.filter(function (o) { return o.attrs.name === n; })[0]; }
var A = nomme('A'), B = nomme('B'), C = nomme('C'), SOM = [A, B, C];
var Hpt = cree.filter(function (o) { return o.type === 'point' && o.attrs.name === 'H'; })[0];
var Opt = cree.filter(function (o) { return o.type === 'point' && o.attrs.name === 'O'; })[0];
var hLignes = cree.filter(function (o) { return o.type === 'line' && o.attrs.strokeColor === '#7c3aed'; });
var equerres = cree.filter(function (o) { return o.type === 'curve' && o.attrs.strokeColor === '#ea580c'; });
var medias = cree.filter(function (o) { return o.type === 'line' && o.attrs.strokeColor === '#0d9488'; });
var cercle = cree.filter(function (o) { return o.type === 'curve' && o.attrs.strokeColor === '#0d9488'; })[0];
print('objets : ' + hLignes.length + ' hauteurs, ' + equerres.length + ' équerres, ' +
      medias.length + ' médiatrices, orthocentre ' + !!Hpt + ', centre O ' + !!Opt +
      ', cercle ' + !!cercle + ', étapes d\'animation ' + (steps ? steps.length : 0));

/* --- on joue l'animation en entier (comme le ferait le moteur) --- */
steps.forEach(function (s) { if (s.step) s.step(1); if (s.after) s.after(); });

/* --- vérifications sur 2000 triangles tirés au hasard --- */
function xy(o) { return [o.X(), o.Y()]; }
function sub(a,b){return [a[0]-b[0],a[1]-b[1]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
function len(a){return Math.hypot(a[0],a[1]);}
var err = [], n = 0;
function ko(m){ if (err.length < 10) err.push(m); }
var graine = 12345;
function alea(){ graine = (graine*1103515245 + 12345) & 0x7fffffff; return graine/0x7fffffff; }

for (var k = 0; k < 2000; k++) {
  var P = [A,B,C];
  P.forEach(function (p) { p._x = (alea()*2-1)*6; p._y = (alea()*2-1)*4.5; });
  var a = xy(A), b = xy(B), c = xy(C);
  var aire = Math.abs((b[0]-a[0])*(c[1]-a[1]) - (c[0]-a[0])*(b[1]-a[1]));
  if (aire < 1) continue;                     // triangles trop plats : hors sujet
  n++;
  var h = xy(Hpt), o = xy(Opt);

  // 1. l'orthocentre est bien sur les TROIS hauteurs (donc elles concourent)
  var t1 = dot(sub(h,a), sub(c,b)), t2 = dot(sub(h,b), sub(c,a)), t3 = dot(sub(h,c), sub(b,a));
  if (Math.max(Math.abs(t1),Math.abs(t2),Math.abs(t3)) > 1e-7)
    ko('orthocentre hors d\'une hauteur : ' + [t1,t2,t3]);

  // 2. le centre du cercle circonscrit est à égale distance des trois sommets
  var r1 = len(sub(a,o)), r2 = len(sub(b,o)), r3 = len(sub(c,o));
  if (Math.max(Math.abs(r1-r2), Math.abs(r1-r3)) > 1e-7)
    ko('cercle circonscrit : rayons ' + [r1,r2,r3]);
  // et le cercle tracé a bien ce rayon-là
  var p0 = [cercle.parents[0](0), cercle.parents[1](0)];
  if (Math.abs(len(sub(p0,o)) - r1) > 1e-7) ko('rayon du cercle tracé');

  // 3. chaque pied est sur le côté opposé, et la hauteur y est perpendiculaire
  var OPP = [[b,c],[c,a],[a,b]], SOMM = [a,b,c];
  for (var i = 0; i < 3; i++) {
    var f = xy(hLignes[i].parents[1]);        // le second point de la droite est le pied
    var cote = sub(OPP[i][1], OPP[i][0]);
    var surCote = (f[0]-OPP[i][0][0])*cote[1] - (f[1]-OPP[i][0][1])*cote[0];
    if (Math.abs(surCote) > 1e-7) ko('pied ' + i + ' hors du côté opposé');
    if (Math.abs(dot(sub(SOMM[i], f), cote)) > 1e-7) ko('hauteur ' + i + ' non perpendiculaire');
    if (Math.abs(dot(sub(h, f), cote)) > 1e-7) ko('orthocentre hors de la hauteur ' + i);

    // 4. le codage de l'angle droit : un vrai carré FERMÉ, posé au pied
    var q = [0,1,2,3,4].map(function (t) { return [equerres[i].parents[0](t), equerres[i].parents[1](t)]; });
    var R = 0.52;
    if (len(sub(q[0], f)) > 1e-9 || len(sub(q[4], f)) > 1e-9)
      ko('équerre ' + i + ' : contour non fermé sur le pied');
    var u = sub(q[1], q[0]), v = sub(q[3], q[0]);
    if (Math.abs(dot(u,v)) > 1e-9) ko('équerre ' + i + ' non perpendiculaire');
    if (Math.abs(len(u) - R) > 1e-9 || Math.abs(len(v) - R) > 1e-9)
      ko('équerre ' + i + ' mal dimensionnée');
    // le quatrième sommet ferme bien le carré
    if (len(sub(q[2], [q[1][0]+v[0], q[1][1]+v[1]])) > 1e-9) ko('équerre ' + i + ' non carrée');
    // ses deux branches partent du pied, l'une le long du côté, l'autre vers le sommet
    if (Math.abs(dot(v, sub(SOMM[i],f)) - R*len(sub(SOMM[i],f))) > 1e-7)
      ko('équerre ' + i + ' : branche non dirigée vers le sommet');
    if (Math.abs(Math.abs(dot(u, cote)) - R*len(cote)) > 1e-7)
      ko('équerre ' + i + ' : branche non alignée sur le côté');
  }

  // 5. les médiatrices passent par O
  for (var j = 0; j < 3; j++) {
    var m1 = xy(medias[j].parents[0]), m2 = xy(medias[j].parents[1]);
    var d = sub(m2, m1);
    if (Math.abs((o[0]-m1[0])*d[1] - (o[1]-m1[1])*d[0]) > 1e-7) ko('médiatrice ' + j + ' rate O');
  }
}
print(n + ' triangles testés');
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ') : 'TOUTES LES PROPRIÉTÉS SONT VÉRIFIÉES');
