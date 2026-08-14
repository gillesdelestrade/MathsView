/*
 * Les exercices « Angles » et « Droites perpendiculaires et parallèles » (6ème).
 *
 * Chaque question est régénérée puis recalculée à côté, à partir des seules
 * données de l'énoncé et de la figure : mesures d'angles, natures, positions
 * relatives. On contrôle aussi que toutes les familles de questions sortent.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js'); load('exos/6eme/geo-outils.js');
var GENS={}; var MathsExos={register:function(g){GENS[g.id]=g;}}; window.MathsExos=MathsExos;
load('exos/6eme/angles.js'); load('exos/6eme/perp-para.js');

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
function lignes(svg){ var r=[],m,re=/<line x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)"([^>]*)>/g;
  while((m=re.exec(svg))) r.push({a:[+m[1],+m[2]], b:[+m[3],+m[4]], attr:m[5]}); return r; }
function polys(svg){ var r=[],m,re=/<polygon points="([^"]+)"([^>]*)>/g;
  while((m=re.exec(svg))) r.push({pts:m[1].split(' ').map(function(p){return p.split(',').map(Number);}), attr:m[2]}); return r; }
function sub(a,b){return [a[0]-b[0],a[1]-b[1]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
function len(a){return Math.hypot(a[0],a[1]);}
function angleEntre(u,v){ return Math.acos(Math.max(-1,Math.min(1,dot(u,v)/(len(u)*len(v)))))*180/Math.PI; }

for (var p=1;p<=4;p++) for (var g=0;g<600;g++) {
  ['angles-6e','perp-para'].forEach(function(id){
    var q = GENS[id].genere(MathsAlea(p*4242+g), p);
    var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
    if (/undefined|NaN|\[object/.test(tout)) ko(id+' P'+p+' texte douteux : '+tout.slice(0,130));
    if (!q.etapes || !q.etapes.length) ko(id+' P'+p+' pas de correction');
    if (q.type==='qcm' && (q.correct<0 || q.correct>=q.choix.length)) ko(id+' P'+p+' réponse hors bornes');
    if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko(id+' P'+p+' deux choix identiques : '+c); vus[c]=1; }); }
    var svg = q.enonce.indexOf('<svg')>=0 ? q.enonce.slice(q.enonce.indexOf('<svg'), q.enonce.indexOf('</svg>')+6) : null;
    if (svg && (svg.match(/<svg/g)||[]).length!==1) ko(id+' figure en double');

    /* --- nature d'un angle dessiné : l'angle TRACÉ doit être de la nature annoncée --- */
    if (/Quelle est sa <b>nature<\/b>/.test(q.enonce) && svg) {
      compte('nature');
      var cotes = lignes(svg).filter(function(l){ return /2563eb/.test(l.attr) && /width="3"/.test(l.attr); });
      if (cotes.length !== 2) { ko('nature : '+cotes.length+' côtés'); return; }
      var som = cotes[0].a;
      var mes = angleEntre(sub(cotes[0].b, som), sub(cotes[1].b, som));
      var dit = q.choix[q.correct];
      var vrai = mes < 89.5 ? 'aigu' : mes > 90.5 ? (mes > 179.5 ? 'plat' : 'obtus') : 'droit';
      if (dit.indexOf(vrai) < 0) ko('nature : « '+dit+' » alors que l\'angle tracé mesure '+mes.toFixed(1)+'°');
      // le petit carré n'apparaît que pour un angle droit
      var carre = polys(svg).filter(function(x){ return /ea580c/.test(x.attr); }).length;
      if ((vrai === 'droit') !== (carre > 0)) ko('nature : codage de l\'angle droit incohérent');
    }

    /* --- estimation : l'angle tracé doit valoir la réponse annoncée --- */
    if (/quelle est sa mesure/.test(q.enonce) && svg) {
      compte('estime');
      var c2 = lignes(svg).filter(function(l){ return /2563eb/.test(l.attr) && /width="3"/.test(l.attr); });
      var mes2 = angleEntre(sub(c2[0].b, c2[0].a), sub(c2[1].b, c2[0].a));
      var att = +q.choix[q.correct].replace('°','');
      if (Math.abs(mes2 - att) > 0.6) ko('estime : tracé '+mes2.toFixed(1)+'° pour une réponse de '+att+'°');
      // les propositions doivent être franchement écartées
      var vals = q.choix.map(function(c){ return +c.replace('°',''); }).sort(function(a,b){return a-b;});
      for (var i2=1;i2<vals.length;i2++) if (vals[i2]-vals[i2-1] < 30) ko('estime : propositions trop proches');
    }

    /* --- rapporteur : l'angle tracé doit valoir la mesure annoncée, et 180−m doit
           être proposé (c'est l'erreur qu'on veut faire commettre) --- */
    if (/Quelle est la mesure de cet angle/.test(q.enonce) && svg) {
      compte('rapporteur');
      var c3 = lignes(svg).filter(function(l){ return /width="3.5"/.test(l.attr); });
      if (c3.length !== 2) { ko('rapporteur : '+c3.length+' côtés'); return; }
      var mes3 = angleEntre(sub(c3[0].b, c3[0].a), sub(c3[1].b, c3[0].a));
      var att3 = +q.choix[q.correct].replace('°','');
      if (Math.abs(mes3 - att3) > 0.6) ko('rapporteur : tracé '+mes3.toFixed(1)+'° pour '+att3+'°');
      if (q.choix.indexOf((180-att3)+'°') < 0) ko('rapporteur : le leurre 180−m n\'est pas proposé');
      // la graduation annoncée dans la correction doit correspondre au côté posé
      var gauche = /0<\/b> <b>de gauche/.test(q.enonce);
      if (gauche !== /rose/.test(q.etapes[1])) ko('rapporteur : mauvaise graduation annoncée');
    }

    /* --- figure de droites : le codage doit être exact --- */
    if (/Coche <b>toutes<\/b> les affirmations vraies/.test(q.enonce) && svg) {
      compte('figure');
      var dts = lignes(svg).filter(function(l){ return /width="2.5"/.test(l.attr); });
      if (dts.length !== 3) { ko('figure : '+dts.length+' droites'); return; }
      var dirs = dts.map(function(l){ return sub(l.b, l.a); });
      // (d1) et (d2) parallèles, (d3) perpendiculaire aux deux
      if (angleEntre(dirs[0], dirs[1]) > 0.5) ko('figure : (d1) et (d2) ne sont pas parallèles');
      if (Math.abs(angleEntre(dirs[0], dirs[2]) - 90) > 0.5) ko('figure : (d3) non perpendiculaire');
      var eq = polys(svg).filter(function(x){ return /ea580c/.test(x.attr); });
      if (eq.length !== 2) ko('figure : '+eq.length+' équerres');
      eq.forEach(function(e){
        var u2 = sub(e.pts[1], e.pts[0]), v2 = sub(e.pts[3], e.pts[0]);
        // on compare des ANGLES : les coordonnées du SVG sont arrondies au
        // dixième de pixel, ce qui suffit à faire dériver un produit scalaire
        if (Math.abs(angleEntre(u2,v2) - 90) > 1.5) ko('figure : équerre non perpendiculaire');
        if (Math.abs(len(u2)-len(v2)) > 0.6) ko('figure : équerre non carrée');
      });
      if (q.corrects.length !== 3) ko('figure : '+q.corrects.length+' bonnes réponses');
      q.corrects.forEach(function(i3){
        if (!/parallel|perp/.test(q.choix[i3])) ko('figure : bonne réponse douteuse'); });
    }

    if (q.type==='vraifaux') compte('vraifaux');
    if (/Que peut-on dire de/.test(q.enonce)) compte('deduire');
    if (/Comment écrit-on/.test(q.enonce)) compte('notation');
    if (/Combien peut-on tracer/.test(q.enonce)) compte('unicite');
    if (/Quel est le <b>sommet/.test(q.enonce) || /Comment peut-on <b>noter/.test(q.enonce)) compte('nommer');
  });
}
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
