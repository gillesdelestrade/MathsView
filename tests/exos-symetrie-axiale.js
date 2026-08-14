/*
 * Les exercices « Symétrie axiale » (6ème).
 *
 * On relit le repère quadrillé produit en SVG : le symétrique annoncé est bien
 * celui de l'axe DESSINÉ, aucun leurre ne l'est, et les trois figures proposées
 * sont superposables à celle de départ — une symétrie conserve les longueurs.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js'); load('exos/repere-outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/6eme/symetrie-axiale.js');

function coords(t){ var m=t.match(/\((−?-?[\d,]+) ; (−?-?[\d,]+)\)/);
  return m ? [m[1],m[2]].map(function(v){ return +v.replace('−','-').replace(',','.'); }) : null; }
function pointsDessines(svg){ var r=[],m,re=/<circle cx="([\d.]+)" cy="([\d.]+)" r="4.5" fill="([^"]+)"/g;
  while((m=re.exec(svg))) r.push({x:+m[1], y:+m[2], c:m[3]}); return r; }
function polygones(svg){ var r=[],m,re=/<polygon points="([^"]+)" fill="([^"]+)"/g;
  while((m=re.exec(svg))) r.push({pts:m[1].split(' ').map(function(p){return p.split(',').map(Number);}), c:m[2]});
  return r; }
function axeSvg(svg){
  var m = svg.match(/<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" stroke="#059669"/);
  if (!m) return null;
  return +m[1] === +m[3] ? { vertical: true, v: +m[1] } : { vertical: false, v: +m[2] };
}
var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }

for (var p=1;p<=4;p++) for (var g=0;g<800;g++) {
  var q = G.genere(MathsAlea(p*983+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques : '+c); vus[c]=1; }); }
  var svg = q.enonce.indexOf('<svg')>=0 ? q.enonce.slice(q.enonce.indexOf('<svg'), q.enonce.indexOf('</svg>')+6) : null;
  if (svg && (svg.match(/<svg/g)||[]).length!==1) ko('figure en double');

  // le TYPE d'abord : une affirmation vrai/faux peut contenir les mêmes mots
  // qu'une consigne (« axes de symétrie », « symétrique de M »)
  if (q.type === 'vraifaux') { compte('vraifaux'); continue; }
  if (/coordonnées du symétrique/.test(q.enonce)) {
    compte('coord');
    var vertical = /verticale/.test(q.enonce);
    var k = +(q.enonce.match(/[xy] = (−?-?[\d]+)/)||[])[1].replace('−','-');
    // M relu dans les étapes, et la réponse annoncée
    var etapeM = (q.etapes[1].match(/\((−?-?[\d,]+) ; (−?-?[\d,]+)\)/)||[]);
    var M = coords(q.etapes[1]);
    var rep = coords(q.choix[q.correct]);
    if (!M || !rep) { ko('coord : illisible'); continue; }
    var att = vertical ? [2*k - M[0], M[1]] : [M[0], 2*k - M[1]];
    if (rep[0]!==att[0] || rep[1]!==att[1])
      ko('coord : '+rep+' au lieu de '+att+' (M='+M+', axe '+(vertical?'x':'y')+'='+k+')');
    // aucun leurre ne doit être la bonne réponse
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      var f=coords(c); if (f && f[0]===att[0] && f[1]===att[1]) ko('coord : deux bonnes réponses'); });
    // M ne doit pas être SUR l'axe
    if (vertical ? M[0]===k : M[1]===k) ko('coord : M est sur l\'axe');
    // l'axe dessiné doit être du bon type
    var ax = axeSvg(svg);
    if (!ax) ko('coord : axe absent de la figure');
    else if (ax.vertical !== vertical) ko('coord : l\'axe dessiné n\'est pas du bon sens');
  }
  else if (/Laquelle des trois figures/.test(q.enonce)) {
    compte('image');
    var polys = polygones(svg).filter(function(x){ return x.c !== 'none'; });
    var dep = polys.filter(function(x){ return x.c === '#2563eb'; })[0];
    var autres = polys.filter(function(x){ return x.c !== '#2563eb'; });
    var ax2 = axeSvg(svg);
    if (!dep || !ax2 || autres.length !== 3) { ko('image : figure incomplète'); continue; }
    // en pixels : le symétrique par rapport à l'axe dessiné
    function sym(pt){ return ax2.vertical ? [2*ax2.v - pt[0], pt[1]] : [pt[0], 2*ax2.v - pt[1]]; }
    var bonne = autres[q.correct];
    var ok = dep.pts.every(function(s,i){
      var t = sym(s);
      return Math.abs(t[0]-bonne.pts[i][0])<0.6 && Math.abs(t[1]-bonne.pts[i][1])<0.6; });
    if (!ok) ko('image : la « bonne » figure n\'est pas le symétrique par rapport à l\'axe');
    autres.forEach(function(a,i2){ if (i2===q.correct) return;
      var faux = dep.pts.every(function(s,i){
        var t = sym(s);
        return Math.abs(t[0]-a.pts[i][0])<0.6 && Math.abs(t[1]-a.pts[i][1])<0.6; });
      if (faux) ko('image : un leurre est aussi le symétrique'); });
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

    // pas de chevauchement
    for (var a1=0;a1<polys.length;a1++) for (var b1=a1+1;b1<polys.length;b1++) {
      function bb(P){ return [Math.min.apply(null,P.map(function(z){return z[0];})),
                              Math.max.apply(null,P.map(function(z){return z[0];})),
                              Math.min.apply(null,P.map(function(z){return z[1];})),
                              Math.max.apply(null,P.map(function(z){return z[1];}))]; }
      var A=bb(polys[a1].pts), B=bb(polys[b1].pts);
      if (!(A[1]<B[0]||B[1]<A[0]||A[3]<B[2]||B[3]<A[2])) ko('image : deux figures se chevauchent');
    }
  }
  else if (/Quelle est cette droite/.test(q.enonce)) {
    compte('axe');
    var dess = pointsDessines(svg);
    var M2 = dess.filter(function(d){ return d.c==='#2563eb'; })[0];
    var Mp = dess.filter(function(d){ return d.c==='#7c3aed'; })[0];
    if (!M2 || !Mp) { ko('axe : points absents'); continue; }
    var dit = q.choix[q.correct].replace(/\\\(|\\\)/g,'');
    var estV = dit.charAt(0) === 'x';
    // [MM'] doit être perpendiculaire à l'axe annoncé
    var horiz = Math.abs(M2.y - Mp.y) < 0.5;
    if (estV !== horiz) ko('axe : « '+dit+' » alors que [MM\'] est '+(horiz?'horizontal':'vertical'));
    var kk = +dit.split('= ')[1].replace('−','-');
    // et passer par le milieu : on le vérifie via les étapes (milieu annoncé)
    var mil = coords(q.etapes[2]);
    if (mil && (estV ? mil[0] !== kk : mil[1] !== kk)) ko('axe : le milieu annoncé ne colle pas');
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      if (c === q.choix[q.correct]) ko('axe : doublon'); });
  }
  else if (/axes de symétrie/.test(q.enonce)) {
    compte('axesFigure');
    var ATT = { 'Le carré':4, 'Le rectangle':2, 'Le losange':2, 'Le triangle équilatéral':3,
                'Le triangle isocèle':1, 'Le parallélogramme quelconque':0,
                'Le triangle quelconque':0 };
    var nom = (q.enonce.match(/<b>([^<]+)<\/b>$/)||[])[1];
    if (!(nom in ATT)) { ko('axesFigure : figure inconnue « '+nom+' »'); continue; }
    if (+q.choix[q.correct] !== ATT[nom]) ko('axesFigure : '+nom+' → '+q.choix[q.correct]+
                                             ' au lieu de '+ATT[nom]);
    q.choix.forEach(function(c,i){ if(i!==q.correct && +c===ATT[nom]) ko('axesFigure : deux bonnes réponses'); });
    if (p<=2 && ATT[nom]===0) ko('axesFigure : une figure sans axe dès le palier '+p);
  }
  else if (/Combien mesure/.test(q.enonce)) {
    compte('longueur');
    var don = q.enonce.match(/= ([\d{},]+)\\\) cm/);
    var v = +don[1].replace('{,}','.').replace(',','.');
    var att2 = /MH = /.test(q.enonce.split('Combien')[0]) ? 2*v : v/2;
    if (Math.abs(q.reponse - att2) > 1e-9) ko('longueur : '+q.reponse+' au lieu de '+att2);
  }
  else ko('P'+p+' question non reconnue : '+q.enonce.slice(0,80));
}
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
