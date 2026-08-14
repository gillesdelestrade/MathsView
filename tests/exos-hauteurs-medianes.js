/*
 * Les exercices « Les hauteurs » et « Les médianes d'un triangle » (5ème).
 *
 * On relit la figure produite : la droite annoncée comme hauteur est bien
 * perpendiculaire au côté opposé, celle annoncée comme médiane passe bien par
 * le milieu, et les leurres ne le font pas. On vérifie aussi que la bonne
 * réponse ne se trouve pas toujours à la même place.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js'); load('exos/5eme/triangle-outils.js');
var GENS = {}; var MathsExos = { register: function (g) { GENS[g.id] = g; } };
window.MathsExos = MathsExos;
load('exos/5eme/hauteurs.js'); load('exos/5eme/medianes.js');

/* --- géométrie de contrôle, écrite à part --- */
function sub(a,b){return [a[0]-b[0],a[1]-b[1]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
function len(a){return Math.hypot(a[0],a[1]);}
function cross(a,b){return a[0]*b[1]-a[1]*b[0];}

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }

// lit les segments d'une figure SVG : x1,y1,x2,y2 (en pixels, ça suffit pour
// tester des angles, des milieux et des alignements)
function lignes(svg){
  var r=[], m, re=/<line x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)"([^>]*)>/g;
  while((m=re.exec(svg))) r.push({a:[+m[1],+m[2]], b:[+m[3],+m[4]], attr:m[5]});
  return r;
}
function sommets(svg){
  var r=[], m, re=/<polygon points="([^"]+)" fill="none"/g;
  m = re.exec(svg);
  return m ? m[1].split(' ').map(function(p){ return p.split(',').map(Number); }) : [];
}
function numeros(svg){   // les étiquettes ①②③ et leur position
  var r=[], m, re=/<text x="(-?[\d.]+)" y="(-?[\d.]+)"[^>]*>([①②③])<\/text>/g;
  while((m=re.exec(svg))) r.push({p:[+m[1],+m[2]], n:m[3]});
  return r;
}

for (var p=1;p<=4;p++) for (var g=0;g<500;g++) {
  ['hauteurs','medianes'].forEach(function (id) {
    var rnd = MathsAlea(p*77777+g), q = GENS[id].genere(rnd, p);
    var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+
               (q.indices||[]).join('|');
    if (/undefined|NaN|\[object/.test(tout)) ko(id+' P'+p+' texte douteux');
    if (!q.etapes || !q.etapes.length) ko(id+' P'+p+' pas de correction');
    if (q.type==='qcm' && (q.correct<0 || q.correct>=q.choix.length)) ko(id+' P'+p+' indice de réponse hors bornes');

    var svg = q.enonce.indexOf('<svg')>=0
      ? q.enonce.slice(q.enonce.indexOf('<svg'), q.enonce.indexOf('</svg>')+6) : null;
    if (svg && (svg.match(/<svg/g)||[]).length !== 1) ko(id+' figure en double');

    // --- « laquelle de ces trois droites » : on vérifie la bonne ET les leurres
    if (/Laquelle est la <b>(hauteur|médiane)/.test(q.enonce)) {
      var estH = /hauteur/.test(q.enonce.split('Laquelle')[1]);
      compte(id+':choix');
      var P = sommets(svg), segs = lignes(svg).filter(function(l){ return /7c3aed/.test(l.attr); });
      if (P.length!==3) return ko(id+' figure sans triangle');
      if (segs.length!==3) return ko(id+' '+segs.length+' droites au lieu de 3');
      // le sommet commun aux trois droites
      var som = segs[0].a;
      segs.forEach(function(s){ if (len(sub(s.a,som))>0.6) ko(id+' droites non concourantes au sommet'); });
      // le côté opposé = les deux autres sommets
      var opp = P.filter(function(v){ return len(sub(v,som))>1; });
      if (opp.length!==2) return ko(id+' sommet introuvable');
      var cote = sub(opp[1],opp[0]);
      var bonneCible = segs[q.correct].b;
      if (estH) {
        if (Math.abs(dot(sub(bonneCible,som), cote))/(len(cote)*len(sub(bonneCible,som))) > 2e-3)
          ko(id+' la « bonne » droite n\'est pas perpendiculaire');
        segs.forEach(function(s,k){ if (k===q.correct) return;
          if (Math.abs(dot(sub(s.b,som),cote))/(len(cote)*len(sub(s.b,som))) < 2e-3)
            ko(id+' un leurre est aussi perpendiculaire'); });
      } else {
        var mi=[(opp[0][0]+opp[1][0])/2,(opp[0][1]+opp[1][1])/2];
        if (len(sub(bonneCible,mi))>0.6) ko(id+' la « bonne » droite ne vise pas le milieu');
        segs.forEach(function(s,k){ if (k===q.correct) return;
          if (len(sub(s.b,mi))<0.06*len(cote)) ko(id+' un leurre est trop près du milieu'); });
      }
      // les trois cibles sont bien sur le côté opposé (ou son prolongement)
      segs.forEach(function(s){ if (Math.abs(cross(cote, sub(s.b,opp[0])))/len(cote) > 0.6)
        ko(id+' une cible n\'est pas sur la droite du côté opposé'); });
    }

    // --- « médiane ou hauteur ? » : le codage doit correspondre à la réponse
    if (/De quelle droite s'agit-il/.test(q.enonce)) {
      compte(id+':lire');
      var carre = /<polygon points="[^"]+" fill="#ea580c"/.test(svg);
      var marques = (svg.match(/stroke="#ea580c" stroke-width="2.5"/g)||[]).length;
      var dit = q.choix[q.correct];
      if (/hauteur/.test(dit) && !carre) ko(id+' « hauteur » annoncée sans angle droit codé');
      if (/médiane/.test(dit) && marques < 2) ko(id+' « médiane » annoncée sans codage de milieu');
      if (/médiane/.test(dit) && carre) ko(id+' « médiane » annoncée avec un angle droit codé');
    }

    // --- les deux tiers
    if (/Combien vaut/.test(q.enonce) && /centre de gravité/.test(q.enonce)) {
      compte('medianes:deuxtiers');
      var v = q.enonce.match(/= ([\d,]+)\\\) cm/);
      var don = v ? +v[1].replace(',','.') : null;
      var qui = q.enonce.match(/On sait que \\\((\w+'?) =/);
      var cherche = q.enonce.match(/Combien vaut \\\((\w+'?)\\\)/);
      if (!don || !qui || !cherche) return ko('deuxtiers : énoncé illisible');
      // le tiers de la médiane, déduit de la donnée : AG → don/2, GA' → don,
      // AA' (la médiane entière) → don/3
      var t = qui[1] === 'AG' || qui[1] === 'BG' || qui[1] === 'CG' ? don/2
            : qui[1][0] === 'G' ? don : don/3;
      // t = le tiers de la médiane, déduit de la donnée
      var att = cherche[1].indexOf("G")<0 ? 3*t : (cherche[1][1]==='G' ? 2*t : t);
      if (Math.abs(q.reponse-att)>1e-9) ko('deuxtiers : '+qui[1]+'='+don+' → '+cherche[1]+
                                            ' vaut '+q.reponse+' au lieu de '+att);
      if (q.reponse !== Math.round(q.reponse)) ko('deuxtiers : réponse non entière');
    }

    // --- les aires
    if (/aire du triangle/.test(q.enonce)) {
      compte('medianes:aires');
      var nb = q.enonce.match(/est de ([\d,]+) cm²/);
      if (!nb) return ko('aires : énoncé illisible');
      var d2 = +nb[1].replace(',','.');
      var inverse = /aire du triangle \\\(\w{2}\w'\\\) est de/.test(q.enonce);
      var att2 = inverse ? 2*d2 : d2/2;
      if (Math.abs(q.reponse-att2)>1e-9) ko('aires : '+q.reponse+' au lieu de '+att2);
    }

    // --- où est l'orthocentre
    if (/où va-t-il se trouver/.test(q.enonce)) {
      compte('hauteurs:position');
      var P2 = sommets(svg);
      // en pixels, y descend : ça ne change ni les angles ni le verdict
      var ang = [0,1,2].map(function(i){
        var u=sub(P2[(i+1)%3],P2[i]), v=sub(P2[(i+2)%3],P2[i]);
        return Math.acos(dot(u,v)/(len(u)*len(v)))*180/Math.PI; });
      var max = Math.max.apply(null,ang);
      var vrai = Math.abs(max-90)<1 ? 'Sur un sommet' : max>90 ? 'À l\'extérieur' : 'À l\'intérieur';
      if (q.choix[q.correct].indexOf(vrai)!==0)
        ko('position : « '+q.choix[q.correct]+' » alors que l\'angle max vaut '+max.toFixed(1)+'°');
      // le triangle rectangle doit porter son codage
      if (Math.abs(max-90)<1 && !/fill="#ea580c"/.test(svg)) ko('rectangle sans angle droit codé');
    }
  });
}
print('familles tirées : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');

/* --- la bonne réponse est-elle devinable ? position de la médiane parmi les
       trois droites, et distribution du numéro de la bonne réponse --- */
var pos = {0:0,1:0,2:0}, num = {0:0,1:0,2:0};
for (var s2=0;s2<900;s2++){
  var q2 = GENS.medianes.genere(MathsAlea(9000+s2), 1);
  if (!/Laquelle est la <b>médiane/.test(q2.enonce)) continue;
  var svg2 = q2.enonce.slice(q2.enonce.indexOf('<svg'), q2.enonce.indexOf('</svg>')+6);
  var segs2 = lignes(svg2).filter(function(l){ return /7c3aed/.test(l.attr); });
  var som2 = segs2[0].a;
  var P3 = sommets(svg2), opp2 = P3.filter(function(v){ return len(sub(v,som2))>1; });
  var d2 = sub(opp2[1],opp2[0]);
  var ts = segs2.map(function(l){ return dot(sub(l.b,opp2[0]),d2)/dot(d2,d2); });
  var ordre2 = ts.map(function(x,i){ return i; }).sort(function(i,j){ return ts[i]-ts[j]; });
  pos[ordre2.indexOf(q2.correct)]++;
  num[q2.correct]++;
}
print('position de la bonne droite (gauche/milieu/droite) : ' + JSON.stringify(pos));
print('numéro de la bonne réponse (1/2/3)                 : ' + JSON.stringify(num));
