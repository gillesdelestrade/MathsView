/*
 * La leçon « Les médianes d'un triangle » (5ème).
 *
 * Le tableau JSXGraph est simulé : on capture les objets créés et surtout les
 * FONCTIONS de coordonnées, qu'on rappelle après avoir déplacé les sommets.
 * On contrôle que les médianes joignent bien chaque sommet au milieu du côté
 * opposé, qu'elles sont concourantes au centre de gravité, et que le bandeau
 * ne confond pas ce point avec le centre du cercle inscrit.
 */
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
var board = { create: function (t,p,a) { return elt(t,p,a); }, update: function(){}, on: function(){} };
var mv = { createAnimator: function(){ return { cancel:function(){}, runSteps:function(s){ steps=s; } }; },
           addControls: function(){ return { tiers: {} }; }, onCleanup: function(){}, typeset: function(){} };
var LECON = null; var MathsView = { register: function (l) { LECON = l; } };
load('lessons/5eme/medianes-triangle.js');
LECON.setup(board, mv);
function nomme(n){ return cree.filter(function(o){ return o.attrs.name === n; })[0]; }

var A = nomme('A'), B = nomme('B'), C = nomme('C');
var Gpt = nomme('G'), Ipt = nomme('I');
var MIL = ["A'", "B'", "C'"].map(nomme);
var codes = cree.filter(function(o){ return o.type==='curve' && o.attrs.strokeColor==='#ea580c'; });
var bissecs = cree.filter(function(o){ return o.type==='line' && o.attrs.strokeColor==='#0d9488'; });
var cercle = cree.filter(function(o){ return o.type==='curve' && o.attrs.strokeColor==='#0d9488'; })[0];
var bandeau = cree.filter(function(o){ return o.type==='text' && o.parents[1]===5.4; })[0];
print('objets : ' + MIL.filter(Boolean).length + ' milieux, ' + codes.length + ' codages, ' +
      bissecs.length + ' bissectrices, G ' + !!Gpt + ', I ' + !!Ipt + ', cercle ' + !!cercle +
      ', étapes ' + steps.length);
steps.forEach(function (s) { if (s.step) s.step(1); if (s.after) s.after(); });

function xy(o){ return [o.X(), o.Y()]; }
function sub(a,b){return [a[0]-b[0],a[1]-b[1]];}
function add(a,b){return [a[0]+b[0],a[1]+b[1]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
function len(a){return Math.hypot(a[0],a[1]);}
function unit(a){var n=len(a);return [a[0]/n,a[1]/n];}
function distDroite(p, u, v){ var d=sub(v,u); return Math.abs((p[0]-u[0])*d[1]-(p[1]-u[1])*d[0])/len(d); }

var err=[], n=0; function ko(m){ if(err.length<10) err.push(m); }
var graine=999; function alea(){ graine=(graine*1103515245+12345)&0x7fffffff; return graine/0x7fffffff; }

for (var k=0;k<2000;k++){
  [A,B,C].forEach(function(p){ p._x=(alea()*2-1)*6; p._y=(alea()*2-1)*4.5; });
  var a=xy(A), b=xy(B), c=xy(C), SOMM=[a,b,c], OPP=[[b,c],[c,a],[a,b]];
  var aire=Math.abs((b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]));
  if (aire<1) continue; n++;
  var g=xy(Gpt), I=xy(Ipt);

  // 1. G est la moyenne des trois sommets
  var moy=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3];
  if (len(sub(g,moy))>1e-9) ko('G n\'est pas l\'isobarycentre');

  for (var i=0;i<3;i++){
    var m=xy(MIL[i]), mm=[(OPP[i][0][0]+OPP[i][1][0])/2,(OPP[i][0][1]+OPP[i][1][1])/2];
    // 2. le milieu est bien le milieu du côté opposé
    if (len(sub(m,mm))>1e-9) ko('milieu ' + i + ' faux');
    // 3. G est sur la médiane, et aux deux tiers en partant du sommet
    var d=sub(m,SOMM[i]);
    if (Math.abs((g[0]-SOMM[i][0])*d[1]-(g[1]-SOMM[i][1])*d[0])>1e-9) ko('G hors de la médiane '+i);
    var rap=len(sub(g,SOMM[i]))/len(sub(m,g));
    if (Math.abs(rap-2)>1e-9) ko('rapport AG/GA\' = '+rap);
    // 4. les deux codages : en travers du côté, au milieu de chaque demi-côté,
    //    et de même longueur des deux côtés
    var c1=[[codes[2*i].parents[0](0),codes[2*i].parents[1](0)],
            [codes[2*i].parents[0](1),codes[2*i].parents[1](1)]];
    var c2=[[codes[2*i+1].parents[0](0),codes[2*i+1].parents[1](0)],
            [codes[2*i+1].parents[0](1),codes[2*i+1].parents[1](1)]];
    if (Math.abs(len(sub(c1[0],c1[1]))-0.48)>1e-9 || Math.abs(len(sub(c2[0],c2[1]))-0.48)>1e-9)
      ko('codage '+i+' de mauvaise taille');
    var cote_i = sub(OPP[i][1], OPP[i][0]);
    if (Math.abs(dot(unit(sub(c1[1],c1[0])), unit(cote_i)))>1e-9 ||
        Math.abs(dot(unit(sub(c2[1],c2[0])), unit(cote_i)))>1e-9)
      ko('codage '+i+' pas perpendiculaire au côté');
    var mid1=[(c1[0][0]+c1[1][0])/2,(c1[0][1]+c1[1][1])/2];
    var att1=[(m[0]+OPP[i][0][0])/2,(m[1]+OPP[i][0][1])/2];
    if (len(sub(mid1,att1))>1e-9) ko('codage '+i+' mal placé');

    // 5. la bissectrice partage vraiment l'angle en deux
    var p0=xy(bissecs[i].parents[0]), p1=xy(bissecs[i].parents[1]);
    var u=unit(sub(p1,p0)), c1v=unit(sub(OPP[i][0],SOMM[i])), c2v=unit(sub(OPP[i][1],SOMM[i]));
    if (Math.abs(dot(u,c1v)-dot(u,c2v))>1e-9) ko('bissectrice '+i+' ne partage pas l\'angle');
    // et elle passe par I
    if (Math.abs((I[0]-p0[0])*u[1]-(I[1]-p0[1])*u[0])>1e-7) ko('bissectrice '+i+' rate I');
    // 6. I est à égale distance des trois côtés = rayon du cercle tracé
    var r=distDroite(I, OPP[i][0], OPP[i][1]);
    var p=[cercle.parents[0](0),cercle.parents[1](0)];
    if (Math.abs(r-len(sub(p,I)))>1e-9) ko('rayon du cercle inscrit : '+r);
  }
}
print(n + ' triangles testés');
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES PROPRIÉTÉS SONT VÉRIFIÉES');

/* --- les trois formes prêtes à l'emploi --- */
[['quelconque',[[-4.5,-2.5],[4,-3],[1,3.2]]],
 ['isocèle',[[-3.2,-2.5],[3.2,-2.5],[0,3.6]]],
 ['équilatéral',[[-3.46,-2],[3.46,-2],[0,4]]]].forEach(function(f){
  [A,B,C].forEach(function(p,i){ p._x=f[1][i][0]; p._y=f[1][i][1]; });
  var g=xy(Gpt), I=xy(Ipt);
  print(f[0].toUpperCase() + ' : G = (' + g[0].toFixed(2) + ' ; ' + g[1].toFixed(2) + ')' +
        '   I = (' + I[0].toFixed(2) + ' ; ' + I[1].toFixed(2) + ')   GI = ' +
        len(sub(g,I)).toFixed(3));
  print('   bandeau : ' + bandeau.parents[2]());
});
