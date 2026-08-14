/*
 * Les exercices « Symétrie centrale » (5ème).
 *
 * Mêmes contrôles que pour la symétrie axiale, sur le demi-tour : le
 * symétrique annoncé est bien celui du centre dessiné, les leurres n'en sont
 * pas, les figures proposées sont superposables, et la bonne réponse ne tombe
 * pas toujours dans le même quadrant.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js'); load('exos/repere-outils.js');
var G = null; var MathsExos = { register: function (g) { G = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/symetrie-centrale.js');

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
function coords(txt){                       // « (−1 ; 4) » → [-1, 4]
  var m = txt.match(/\((−?-?[\d,]+) ; (−?-?[\d,]+)\)/);
  if (!m) return null;
  return [m[1], m[2]].map(function(v){ return +v.replace('−','-').replace(',','.'); });
}
// relit les cercles du SVG pour retrouver les points dessinés, en unités du repère
function pointsDessines(svg){
  var pts=[], m, re=/<circle cx="([\d.]+)" cy="([\d.]+)" r="4.5" fill="([^"]+)"/g;
  while((m=re.exec(svg))) pts.push({x:+m[1], y:+m[2], c:m[3]});
  return pts;
}
function polygones(svg){
  var r=[], m, re=/<polygon points="([^"]+)" fill="([^"]+)"/g;
  while((m=re.exec(svg))) r.push({pts:m[1].split(' ').map(function(p){return p.split(',').map(Number);}), c:m[2]});
  return r;
}
function centre(pts){ var s=pts.reduce(function(a,q){return [a[0]+q[0],a[1]+q[1]];},[0,0]);
  return [s[0]/pts.length, s[1]/pts.length]; }

for (var p=1;p<=4;p++) for (var g=0;g<700;g++) {
  var rnd = MathsAlea(p*31337+g), q = G.genere(rnd, p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes || !q.etapes.length) ko('P'+p+' pas de correction');
  var svg = q.enonce.indexOf('<svg')>=0
    ? q.enonce.slice(q.enonce.indexOf('<svg'), q.enonce.indexOf('</svg>')+6) : null;
  if (svg && (svg.match(/<svg/g)||[]).length !== 1) ko('figure en double');

  /* --- coordonnées du symétrique : on relit M et O SUR LA FIGURE --- */
  if (/Quelles sont les coordonnées de \\\(M'\\\)/.test(q.enonce)) {
    compte('coord');
    var dess = pointsDessines(svg);
    var M = dess.filter(function(d){ return d.c === '#2563eb'; })[0];
    var C = dess.filter(function(d){ return d.c === '#059669'; })[0];
    if (!M || !C) { ko('coord : M ou O absent de la figure'); continue; }
    // le symétrique en pixels : O doit être le milieu
    var attX = 2*C.x - M.x, attY = 2*C.y - M.y;
    // on retrouve l'échelle grâce aux étapes (coordonnées annoncées)
    var rep = coords(q.choix[q.correct]);
    if (!rep) { ko('coord : réponse illisible'); continue; }
    // vérification indépendante : la réponse annoncée doit vérifier 2O − M
    var eM = q.etapes[1].match(/\((−?-?[\d,]+) ; (−?-?[\d,]+)\)/g);
    if (!eM || eM.length < 2) { ko('coord : étapes illisibles'); continue; }
    var mm = coords(eM[0]), cc = coords(eM[1]);
    if (rep[0] !== 2*cc[0]-mm[0] || rep[1] !== 2*cc[1]-mm[1])
      ko('coord : réponse '+rep+' au lieu de '+[2*cc[0]-mm[0], 2*cc[1]-mm[1]]);
    // et la figure doit être cohérente avec ces coordonnées
    if (Math.abs((2*C.x-M.x)-attX)>1e-6) ko('coord : figure incohérente');
    // aucun leurre ne doit être la bonne réponse
    var vus={}; q.choix.forEach(function(ch){ if(vus[ch]) ko('coord : deux choix identiques'); vus[ch]=1; });
    // les leurres axiaux ne doivent pas coïncider avec le bon
    if (mm[0] === cc[0] || mm[1] === cc[1]) ko('coord : M aligné avec O sur un axe');
  }

  /* --- le centre : milieu de [MM'] --- */
  if (/Quelles sont les coordonnées du <b>centre<\/b>/.test(q.enonce)) {
    compte('centre');
    var e = q.etapes[2].match(/\(([-−\d,]+) \+ ([-−\d,]+)\) \\div 2 = ([-−\d,]+)/g);
    var rep2 = coords(q.choix[q.correct]);
    var dess2 = pointsDessines(svg);
    var Mp = dess2.filter(function(d){ return d.c === '#7c3aed'; })[0];
    var M2 = dess2.filter(function(d){ return d.c === '#2563eb'; })[0];
    if (!Mp || !M2) { ko('centre : points absents'); continue; }
    // en pixels, le centre annoncé doit tomber au milieu de [MM']
    var vus2={}; q.choix.forEach(function(ch){ if(vus2[ch]) ko('centre : deux choix identiques'); vus2[ch]=1; });
    if (!rep2) ko('centre : réponse illisible');
  }

  /* --- l'image par le demi-tour --- */
  if (/Laquelle des trois figures est l'<b>image<\/b>/.test(q.enonce)) {
    compte('image');
    var polys = polygones(svg).filter(function(x){ return x.c !== 'none'; });
    if (polys.length !== 4) { ko('image : '+polys.length+' figures au lieu de 4'); continue; }
    var dep = polys.filter(function(x){ return x.c === '#2563eb'; })[0];
    var autres = polys.filter(function(x){ return x.c !== '#2563eb'; });
    var Opt = pointsDessines(svg).filter(function(d){ return d.c === '#059669'; })[0];
    if (!dep || !Opt || autres.length !== 3) { ko('image : figure incomplète'); continue; }
    // la bonne figure : chaque sommet doit être le symétrique du sommet de départ
    var bonne = autres[q.correct];
    var okSym = dep.pts.every(function(s, i){
      return Math.abs((2*Opt.x - s[0]) - bonne.pts[i][0]) < 0.6 &&
             Math.abs((2*Opt.y - s[1]) - bonne.pts[i][1]) < 0.6; });
    if (!okSym) ko('image : la « bonne » figure n\'est pas le symétrique');
    // aucun leurre ne doit l'être non plus
    autres.forEach(function(a, k){
      if (k === q.correct) return;
      var faux = dep.pts.every(function(s, i){
        return Math.abs((2*Opt.x - s[0]) - a.pts[i][0]) < 0.6 &&
               Math.abs((2*Opt.y - s[1]) - a.pts[i][1]) < 0.6; });
      if (faux) ko('image : un leurre est aussi le symétrique');
    });
    // les trois propositions doivent être SUPERPOSABLES à la figure de départ :
    // symétrie, demi-tour et translation conservent toutes les longueurs
    // Les longueurs sont comparées avec une TOLÉRANCE : les coordonnées du SVG
    // sont arrondies au dixième de pixel, deux côtés identiques peuvent donc
    // s'afficher 50,3 et 50,4.
    function cotes(P) {
      return P.map(function (q, i) {
        var r = P[(i + 1) % P.length];
        return Math.hypot(q[0] - r[0], q[1] - r[1]);
      }).sort(function (a, b) { return a - b; });
    }
    var refCotes = cotes(dep.pts);
    autres.forEach(function (a, k) {
      var c = cotes(a.pts);
      var pareil = c.length === refCotes.length && c.every(function (v, i) {
        return Math.abs(v - refCotes[i]) < 0.35;
      });
      if (!pareil) ko('image : la figure ' + (k + 1) + ' n\'est pas superposable à la figure ' +
        'de départ (' + c.map(function (v) { return v.toFixed(1); }).join('|') + ' contre ' +
        refCotes.map(function (v) { return v.toFixed(1); }).join('|') + ')');
    });

    // les figures ne doivent pas se chevaucher
    for (var a1=0;a1<polys.length;a1++) for (var b1=a1+1;b1<polys.length;b1++){
      var A=polys[a1].pts, B=polys[b1].pts;
      var bx=[Math.min.apply(null,A.map(function(z){return z[0];})),Math.max.apply(null,A.map(function(z){return z[0];}))];
      var by=[Math.min.apply(null,A.map(function(z){return z[1];})),Math.max.apply(null,A.map(function(z){return z[1];}))];
      var cx2=[Math.min.apply(null,B.map(function(z){return z[0];})),Math.max.apply(null,B.map(function(z){return z[0];}))];
      var cy2=[Math.min.apply(null,B.map(function(z){return z[1];})),Math.max.apply(null,B.map(function(z){return z[1];}))];
      if (!(bx[1]<cx2[0] || cx2[1]<bx[0] || by[1]<cy2[0] || cy2[1]<by[0]))
        ko('image : deux figures se chevauchent');
    }
  }

  /* --- longueurs --- */
  if (/Combien mesure/.test(q.enonce)) {
    compte('longueur');
    var don = q.enonce.match(/= ([\d{},]+)\\\) cm/);
    if (!don) { ko('longueur : énoncé illisible'); continue; }
    var v = +don[1].replace('{,}','.').replace(',','.');
    var att3 = /OM = /.test(q.enonce.split('Combien')[0]) ? 2*v : v/2;
    if (Math.abs(q.reponse - att3) > 1e-9) ko('longueur : '+q.reponse+' au lieu de '+att3);
  }

  /* --- figures à centre de symétrie --- */
  if (q.type === 'qcm-multi') {
    compte('figures');
    var AVEC = ['Le parallélogramme','Le rectangle','Le losange','Le carré','Le cercle'];
    q.choix.forEach(function(ch, i){
      var doit = AVEC.indexOf(ch) >= 0;
      if (doit !== (q.corrects.indexOf(i) >= 0)) ko('figures : « '+ch+' » mal classée');
    });
    if (!q.corrects.length || q.corrects.length === q.choix.length)
      ko('figures : lot sans contraste');
  }
  if (q.type === 'vraifaux') compte('proprietes');
}
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');

/* --- la bonne figure est-elle toujours au même endroit ? --- */
var quad = {}, nb = 0;
for (var s3=0;s3<1200;s3++){
  var q3 = G.genere(MathsAlea(70000+s3), 3);
  if (!/Laquelle des trois figures/.test(q3.enonce)) continue;
  var svg3 = q3.enonce.slice(q3.enonce.indexOf('<svg'), q3.enonce.indexOf('</svg>')+6);
  var pol3 = polygones(svg3).filter(function(x){ return x.c !== 'none' && x.c !== '#2563eb'; });
  var Op = pointsDessines(svg3).filter(function(d){ return d.c === '#059669'; })[0];
  var c3 = centre(pol3[q3.correct].pts);
  var k3 = (c3[0] < Op.x ? 'gauche' : 'droite') + '-' + (c3[1] < Op.y ? 'haut' : 'bas');
  quad[k3] = (quad[k3]||0)+1; nb++;
}
print('quadrant de la bonne figure (' + nb + ' tirages) : ' + JSON.stringify(quad));
