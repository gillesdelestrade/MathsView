/*
 * Les exercices « Angles et droites parallèles » (5ème).
 *
 * La figure — deux parallèles et une sécante — est relue dans le SVG, et les
 * angles annoncés égaux le sont vraiment. On vérifie aussi que les invariants
 * de l'énoncé tiennent : angles nommés existants, valeurs cohérentes.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var GENS = [];
var MathsExos = { register: function (g) { GENS.push(g); } };
window.MathsExos = MathsExos;
load('exos/5eme/angles-paralleles.js');

/* ---- Modèle géométrique INDÉPENDANT : on calcule tout par les vecteurs ---- */
// G sur (AB) : y = 0, A à gauche, B à droite. H sur (CD) : y = −1, C à gauche,
// D à droite. Sécante d'angle al : E au-dessus, F en dessous.
function modele(al) {
  var u = [Math.cos(al*Math.PI/180), Math.sin(al*Math.PI/180)];
  var G = [0,0], H = [-u[0]/u[1], -1];
  return { A:[G[0]-1,0], B:[G[0]+1,0], C:[H[0]-1,-1], D:[H[0]+1,-1],
           E:[G[0]+u[0], G[1]+u[1]], F:[H[0]-u[0], H[1]-u[1]], G:G, H:H, u:u };
}
function sub(p,q){return [p[0]-q[0],p[1]-q[1]];}
function norm(p){var n=Math.hypot(p[0],p[1]);return [p[0]/n,p[1]/n];}
function mesureNom(nom, al) {            // « AGE » → mesure de l'angle en degrés
  var M = modele(al), X = M[nom[0]], S = M[nom[1]], Y = M[nom[2]];
  var a = norm(sub(X,S)), b = norm(sub(Y,S));
  return Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1])))*180/Math.PI;
}
function bissectrice(nom, al) {          // un point à l'intérieur de l'angle
  var M = modele(al), X = M[nom[0]], S = M[nom[1]], Y = M[nom[2]];
  var a = norm(sub(X,S)), b = norm(sub(Y,S)), d = norm([a[0]+b[0], a[1]+b[1]]);
  return [S[0]+0.05*d[0], S[1]+0.05*d[1]];
}
function interne(nom, al) { var p = bissectrice(nom, al); return p[1] < 0 && p[1] > -1; }
function coteSecante(nom, al) {          // signe : de quel côté de (EF)
  var M = modele(al), p = bissectrice(nom, al), d = sub(M.F, M.E), q = sub(p, M.E);
  return Math.sign(d[0]*q[1] - d[1]*q[0]);
}
function relationVraie(n1, n2, al) {
  if (n1[1] === n2[1]) {                 // même sommet
    return Math.abs(mesureNom(n1,al)-mesureNom(n2,al)) < 1e-9 ? 'opposés par le sommet'
                                                             : 'adjacents supplémentaires';
  }
  var meme = coteSecante(n1,al) === coteSecante(n2,al);
  var i1 = interne(n1,al), i2 = interne(n2,al);
  if (meme) return (i1 !== i2) ? 'correspondants' : 'aucune';
  return (i1 && i2) ? 'alternes-internes' : (!i1 && !i2) ? 'alternes-externes' : 'aucune';
}
var TOUS = ['AGE','EGB','AGF','FGB','CHE','EHD','CHF','FHD'];
var AL = 63;                             // un angle quelconque : les classes n'en dépendent pas
function classe(nom) {
  var m = mesureNom(nom, AL);
  return TOUS.filter(function(n){ return Math.abs(mesureNom(n,AL)-m) < 1e-9; });
}

/* ---- Vérification de tous les invariants sur un gros tirage ---- */
var G = GENS[0], err = [], nbq = {egaux:0,mesure:0,nom:0,reciproque:0};
function ko(m){ if (err.length < 12) err.push(m); }
function angles(s){ var r=[], m, re=/widehat\{([A-Z]{3})\}/g; while((m=re.exec(s)))r.push(m[1]); return r; }
function valeurs(s){ var r=[], m, re=/=\s*(\d+)°/g; while((m=re.exec(s)))r.push(+m[1]); return r; }

for (var p = 1; p <= 4; p++) for (var g = 0; g < 400; g++) {
  var rnd = MathsAlea(p*100000 + g), q = G.genere(rnd, p);
  var tout = q.enonce + '|' + (q.etapes||[]).join('|') + '|' + (q.choix||[]).join('|') +
             '|' + (q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : ' + tout.slice(0,120));
  if (!q.etapes || !q.etapes.length) ko('P'+p+' pas de correction');

  var noms = angles(q.enonce), vals = valeurs(q.enonce);

  if (q.type === 'qcm-multi') {                       /* --- lesquels sont égaux --- */
    nbq.egaux++;
    var donne = noms[0], attendu = classe(donne).filter(function(n){return n!==donne;});
    var coches = q.corrects.map(function(i){ return angles(q.choix[i])[0]; }).sort();
    if (coches.join() !== attendu.sort().join())
      ko('P'+p+' égaux ' + donne + ' : ' + coches + ' au lieu de ' + attendu);
    if (q.choix.length !== 7) ko('P'+p+' ' + q.choix.length + ' choix au lieu de 7');
    if (q.corrects.length !== 3) ko('P'+p+' ' + q.corrects.length + ' bonnes réponses');
    // la mesure annoncée doit être celle d'un angle possible (aiguë ou obtuse)
    if (!(vals[0] > 0 && vals[0] < 180)) ko('P'+p+' mesure ' + vals[0]);
  }
  else if (q.type === 'nombre') {                     /* --- combien mesure --- */
    nbq.mesure++;
    var d = noms[0], c = noms[1], m = vals[0];
    var att = classe(d).indexOf(c) >= 0 ? m : 180 - m;
    if (q.reponse !== att) ko('P'+p+' mesure ' + d + '=' + m + ' → ' + c + ' : ' +
                              q.reponse + ' au lieu de ' + att);
    if (q.unite !== '°') ko('P'+p+' unité manquante');
  }
  else if (q.type === 'qcm') {                        /* --- le nom de la paire --- */
    nbq.nom++;
    var rel = relationVraie(noms[0], noms[1], AL);
    var dit = q.choix[q.correct].replace('Des angles ', '');
    if (dit !== rel) ko('P'+p+' nom ' + noms[0] + '/' + noms[1] + ' : « ' + dit +
                        ' » au lieu de « ' + rel + ' »');
    if (q.choix.length !== 4) ko('P'+p+' qcm à ' + q.choix.length + ' choix');
  }
  else if (q.type === 'vraifaux') {                   /* --- la réciproque --- */
    nbq.reciproque++;
    var attendu2 = (vals[0] === vals[1]) ? 0 : 1;
    if (q.correct !== attendu2) ko('P'+p+' réciproque ' + vals[0] + '/' + vals[1] +
                                   ' → ' + q.correct);
    var rel2 = relationVraie(noms[0], noms[1], AL);
    if (q.etapes[0].indexOf(rel2) < 0) ko('P'+p+' réciproque : relation annoncée fausse (' +
                                          rel2 + ') — ' + q.etapes[0].slice(0,90));
    if (/couleur|codage/.test(q.enonce)) ko('fuite');
  }
  else ko('P'+p+' type inconnu : ' + q.type);

  // La figure doit tenir dans son cadre.
  var mm, re2 = /(?:x|y|cx|cy)\d?="(-?[\d.]+)"/g, hors = 0;
  while ((mm = re2.exec(q.enonce))) { var v = +mm[1]; if (v < -12 || v > 460) hors++; }
  if (hors) ko('P'+p+' ' + hors + ' coordonnées hors cadre');
  if ((q.enonce.match(/<svg/g)||[]).length !== 1) ko('P'+p+' figure absente ou en double');
}
print('questions : ' + JSON.stringify(nbq));
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ') : 'TOUS LES INVARIANTS SONT VÉRIFIÉS');
