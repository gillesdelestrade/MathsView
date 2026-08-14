/*
 * La leçon « Une médiane partage le triangle en deux aires égales » (5ème).
 *
 * On monte setup() dans un tableau JSXGraph simulé, on rejoue l'animation, et
 * on vérifie sur près de deux mille triangles que les deux moitiés ont bien la
 * même aire, que la hauteur est perpendiculaire au côté et que le bandeau dit
 * la même chose que la figure.
 */
var cree = [], steps = null, panneaux = [];
function elt(type, parents, attrs) {
  var o = { type: type, parents: parents || [], attrs: attrs || {},
            setAttribute: function (a) { for (var k in a) this.attrs[k] = a[k]; },
            on: function () {}, moveTo: function () {} };
  if (type === 'point') {
    if (typeof parents[0] === 'function') { o.X = parents[0]; o.Y = parents[1]; }
    else { o._x = parents[0]; o._y = parents[1];
           o.X = function () { return o._x; }; o.Y = function () { return o._y; }; }
  }
  if (type === 'polygon') o.borders = [{ setAttribute: function(){} },{ setAttribute: function(){} },{ setAttribute: function(){} }];
  cree.push(o); return o;
}
var document = { createElement: function () {
  var e = { className: '', innerHTML: '', appendChild: function(){}, querySelector: function(){ return null; } };
  panneaux.push(e); return e; } };
var board = { create: function (t,p,a) { return elt(t,p,a); }, update: function(){}, on: function(){} };
var mv = { createAnimator: function(){ return { cancel:function(){}, runSteps:function(s){ steps=s; } }; },
           addControls: function(){ return { sep: {} }; }, onCleanup: function(){},
           typeset: function(){}, extras: { appendChild: function(){} } };
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/mediane-aires.js');
LECON.setup(board, mv);
function nomme(n){ return cree.filter(function(o){ return o.attrs.name === n; })[0]; }
var A = nomme('A'), B = nomme('B'), C = nomme('C'), Apr = nomme("A'");
var polys = cree.filter(function(o){ return o.type==='polygon'; });
var textes = cree.filter(function(o){ return o.type==='text'; });
var lignes = cree.filter(function(o){ return o.type==='line'; });
var carres = cree.filter(function(o){ return o.type==='curve' && o.attrs.fillOpacity===0.35; });
print('objets : ' + polys.length + ' polygones, ' + lignes.length + ' droites, ' +
      carres.length + ' équerres, ' + textes.length + ' textes, ' + steps.length + ' étapes, ' +
      panneaux.length + ' panneau');
steps.forEach(function (s) { if (s.step) s.step(1); if (s.after) s.after(); });

function xy(o){ return [o.X(), o.Y()]; }
function sub(a,b){return [a[0]-b[0],a[1]-b[1]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
function len(a){return Math.hypot(a[0],a[1]);}
function cross(a,b){return a[0]*b[1]-a[1]*b[0];}
function aireDe(p,q,r){ return Math.abs(cross(sub(q,p),sub(r,p)))/2; }
function distDroite(p,u,v){ var d=sub(v,u); return Math.abs(cross(d,sub(p,u)))/len(d); }
// les sommets des deux morceaux, lus sur les polygones créés par la leçon
function sommets(poly){ return poly.parents.map(function(pt){ return [pt.X(), pt.Y()]; }); }

var err=[], n=0; function ko(m){ if(err.length<10) err.push(m); }
var graine=4242; function alea(){ graine=(graine*1103515245+12345)&0x7fffffff; return graine/0x7fffffff; }

for (var k=0;k<2000;k++){
  [A,B,C].forEach(function(p){ p._x=(alea()*2-1)*6; p._y=(alea()*2-1)*4.5; });
  var a=xy(A), b=xy(B), c=xy(C);
  if (aireDe(a,b,c) < 1) continue; n++;
  var ap=xy(Apr);
  // 1. A' est bien le milieu de [BC]
  if (len(sub(ap,[(b[0]+c[0])/2,(b[1]+c[1])/2]))>1e-12) ko('A\' n\'est pas le milieu');
  var t1=sommets(polys[1]), t2=sommets(polys[2]);
  // 2. LE point de la leçon : les deux morceaux ont la même aire, moitié du tout
  var S=aireDe(a,b,c), S1=aireDe(t1[0],t1[1],t1[2]), S2=aireDe(t2[0],t2[1],t2[2]);
  if (Math.abs(S1-S2)>1e-12) ko('S1 ≠ S2 : '+S1+' / '+S2);
  if (Math.abs(S1-S/2)>1e-12) ko('S1 ≠ S/2');
  // 3. la même hauteur dans les deux morceaux, égale à celle du grand triangle
  var h=distDroite(a,b,c), h1=distDroite(t1[0],t1[1],t1[2]), h2=distDroite(t2[0],t2[1],t2[2]);
  if (Math.abs(h1-h)>1e-12 || Math.abs(h2-h)>1e-12) ko('hauteurs différentes : '+[h,h1,h2]);
  // 4. les bases des deux morceaux sont égales, et valent BC/2
  var b1=len(sub(t1[1],t1[2])), b2=len(sub(t2[1],t2[2])), BC=len(sub(c,b));
  if (Math.abs(b1-BC/2)>1e-12 || Math.abs(b2-BC/2)>1e-12) ko('bases : '+[b1,b2,BC/2]);
  // 5. après écartement, les deux bases restent sur (BC) et les deux sommets
  //    sur une même parallèle : c'est ce qui fait tenir la démonstration
  [t1[1],t1[2],t2[1],t2[2]].forEach(function(p){
    if (distDroite(p,b,c)>1e-9) ko('une base a quitté la droite (BC)'); });
  if (Math.abs(distDroite(t1[0],b,c)-h)>1e-9 || Math.abs(distDroite(t2[0],b,c)-h)>1e-9)
    ko('un sommet a quitté la parallèle');
  // 6. les deux droites tracées sont bien parallèles à (BC) et bien placées
  var pb=[lignes[0].parents[0],lignes[0].parents[1]].map(xy);
  var ph=[lignes[1].parents[0],lignes[1].parents[1]].map(xy);
  if (Math.abs(cross(sub(pb[1],pb[0]), sub(c,b)))>1e-9) ko('parallèle du bas mal orientée');
  if (Math.abs(cross(sub(ph[1],ph[0]), sub(c,b)))>1e-9) ko('parallèle du haut mal orientée');
  if (distDroite(b,pb[0],pb[1])>1e-9) ko('la parallèle du bas ne porte pas [BC]');
  if (distDroite(t1[0],ph[0],ph[1])>1e-9 || distDroite(t2[0],ph[0],ph[1])>1e-9)
    ko('la parallèle du haut ne porte pas les deux sommets');
  // 7. les trois équerres : carrées, au pied, appuyées sur la base
  [[carres[1],t1],[carres[2],t2]].forEach(function(pair,j){
    var q=[0,1,2,3,4].map(function(t){ return [pair[0].parents[0](t), pair[0].parents[1](t)]; });
    var u=sub(q[1],q[0]), v=sub(q[3],q[0]);
    if (Math.abs(dot(u,v))>1e-9) ko('équerre '+j+' non perpendiculaire');
    if (Math.abs(len(u)-0.5)>1e-9 || Math.abs(len(v)-0.5)>1e-9) ko('équerre '+j+' mal dimensionnée');
    if (distDroite(q[0], pair[1][1], pair[1][2])>1e-9) ko('équerre '+j+' pas posée sur la base');
    if (Math.abs(Math.abs(dot(u, sub(c,b)))-0.5*len(sub(c,b)))>1e-9) ko('équerre '+j+' pas alignée sur la base');
  });
}
print(n + ' triangles testés');
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES PROPRIÉTÉS SONT VÉRIFIÉES');

/* --- le panneau, sur le triangle de départ --- */
[A,B,C].forEach(function(p,i){ var d=[[0.8,3],[-5,-2.6],[5,-2.6]]; p._x=d[i][0]; p._y=d[i][1]; });
steps.forEach(function (s) { if (s.step) s.step(1); if (s.after) s.after(); });
print('\n--- panneau ---');
print(panneaux[0].innerHTML.replace(/<\/div>/g,'\n').replace(/<[^>]+>/g,''));
