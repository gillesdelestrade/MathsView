/*
 * Les exercices « Découvrir les puissances » (5ème).
 *
 * Les puissances sont recalculées par multiplications successives, jamais par
 * Math.pow. On vérifie en outre que les carrés de 0 à 12 et les puissances de
 * 10 sont bien tous rencontrés, et qu'aucune proposition n'apparaît deux fois.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/5eme/puissances.js');
function pw(a,n){ var r=1; for(var i=0;i<n;i++) r*=a; return r; }
function txt(h){ return String(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,'')
  .replace(/\\,/g,'').replace(/\s+/g,' ').trim(); }

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
var carresVus = {}, dixVus = {};

for (var p=1;p<=4;p++) for (var g=0;g<900;g++) {
  var q = G.genere(MathsAlea(p*719+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques : '+c); vus[c]=1; }); }
  if (q.type==='qcm' && (q.correct<0 || q.correct>=q.choix.length)) ko('P'+p+' réponse hors bornes');
  var e = txt(q.enonce);

  if (/Combien vaut (\d+)\^\{2\}|Combien vaut \\\((\d+)\^\{2\}/.test(q.enonce)) {
    compte('carres');
    var n = +(q.enonce.match(/\((\d+)\^\{2\}\\\)/)||[])[1];
    if (!(n>=0 && n<=12)) ko('carres : '+n+' hors de 0..12');
    if (q.reponse !== n*n) ko('carres : '+q.reponse+' au lieu de '+(n*n));
    carresVus[n]=1;
  } else if (/carré<\/b> vaut/.test(q.enonce)) {
    compte('carres');
    var c2 = +(q.enonce.match(/vaut \\\((\d+)\\\)/)||[])[1];
    if (q.reponse*q.reponse !== c2) ko('carres inverse : '+q.reponse+'² ≠ '+c2);
    if (q.reponse < 0 || q.reponse > 12) ko('carres inverse : réponse hors 0..12');
    carresVus[q.reponse]=1;
  } else if (/sous forme d'un nombre entier/.test(e)) {
    compte('dix');
    var n2 = +(q.enonce.match(/10\^\{(\d+)\}/)||[])[1];
    if (q.reponse !== pw(10,n2)) ko('dix : '+q.reponse+' au lieu de '+pw(10,n2));
    if (String(q.reponse).replace(/0/g,'').length !== 1) ko('dix : '+q.reponse+' n\'est pas 1 suivi de zéros');
    if ((String(q.reponse).match(/0/g)||[]).length !== n2) ko('dix : mauvais nombre de zéros');
    dixVus[n2]=1;
  } else if (/Combien de <b>zéros/.test(q.enonce)) {
    compte('dix');
    var n3 = +(q.enonce.match(/10\^\{(\d+)\}/)||[])[1];
    if (+q.choix[q.correct] !== n3) ko('dix zéros : '+q.choix[q.correct]+' au lieu de '+n3);
    q.choix.forEach(function(c,i){ if(i!==q.correct && +c===n3) ko('dix zéros : deux bonnes réponses'); });
    dixVus[n3]=1;
  } else if (/s'écrit… \?/.test(e)) {
    compte('dix');
    var val = +txt(q.enonce.match(/\\\(([\d\\,]+)\\\)/)[1]).replace(/\s/g,'');
    var expo = +(q.choix[q.correct].match(/10\^\{(\d+)\}/)||[])[1];
    if (pw(10,expo) !== val) ko('dix inverse : 10^'+expo+' ≠ '+val);
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      var x=+(c.match(/10\^\{(\d+)\}/)||[])[1]; if (pw(10,x)===val) ko('dix inverse : deux bonnes réponses'); });
    dixVus[expo]=1;
  } else if (/plus simplement/.test(e)) {
    compte('ecrire');
    var facteurs = (q.enonce.match(/(\d+)(?: \\times (\d+))+/)||[])[0];
    var lst = facteurs.split(' \\times ').map(Number);
    var base = lst[0], nn = lst.length;
    lst.forEach(function(x){ if (x!==base) ko('ecrire : facteurs différents'); });
    var bon = q.choix[q.correct].match(/(\d+)\^\{(\d+)\}/);
    if (!bon || +bon[1]!==base || +bon[2]!==nn)
      ko('ecrire : '+q.choix[q.correct]+' pour un produit de '+nn+' fois '+base);
  } else if (/écrit sous forme de produit/.test(e)) {
    compte('ecrire');
    var mb = q.enonce.match(/(\d+)\^\{(\d+)\}/);
    var base2=+mb[1], nn2=+mb[2];
    var bonP = q.choix[q.correct].replace(/\\\(|\\\)/g,'').split(' \\times ').map(Number);
    if (bonP.length !== nn2) ko('ecrire dev : '+bonP.length+' facteurs au lieu de '+nn2);
    bonP.forEach(function(x){ if (x!==base2) ko('ecrire dev : facteur ≠ base'); });
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      var l=c.replace(/\\\(|\\\)/g,'').split(' \\times ').map(Number);
      if (l.length===nn2 && l.every(function(x){return x===base2;})) ko('ecrire dev : deux bonnes réponses'); });
  } else if (/^Calcule/.test(e)) {
    compte('calcul');
    var mc = q.enonce.match(/(\d+)\^\{(\d+)\}/);
    if (q.reponse !== pw(+mc[1],+mc[2])) ko('calcul : '+q.reponse+' au lieu de '+pw(+mc[1],+mc[2]));
  } else if (/^Combien vaut/.test(e)) {
    compte('piege');
    var mp = q.enonce.match(/(\d+)\^\{(\d+)\}/);
    var a3=+mp[1], n4=+mp[2];
    if (+q.choix[q.correct] !== pw(a3,n4)) ko('piege : '+q.choix[q.correct]+' au lieu de '+pw(a3,n4));
    // le leurre « a × n » doit être proposé : c'est l'erreur qu'on veut faire commettre
    if (q.choix.indexOf(String(a3*n4)) < 0 && a3*n4 !== pw(a3,n4))
      ko('piege : le leurre '+a3+'×'+n4+' n\'est pas proposé');
  } else if (/^Compare/.test(e)) {
    compte('piege');
    var mq = q.enonce.match(/(\d+)\^\{(\d+)\}.*?(\d+)\^\{(\d+)\}/);
    var v1=pw(+mq[1],+mq[2]), v2=pw(+mq[3],+mq[4]);
    if (v1===v2) ko('piege compare : les deux puissances sont égales');
    var attendu = v1>v2 ? mq[1]+'^{'+mq[2]+'}' : mq[3]+'^{'+mq[4]+'}';
    if (q.choix[q.correct].indexOf(attendu) < 0)
      ko('piege compare : « '+txt(q.choix[q.correct])+' » alors que '+v1+' contre '+v2);
  } else if (q.type==='vraifaux') compte('vraifaux');
  else ko('P'+p+' question non reconnue : '+e.slice(0,70));
}
print('familles : ' + JSON.stringify(cpt));
print('carrés rencontrés : ' + Object.keys(carresVus).sort(function(a,b){return a-b;}).join(', '));
print('exposants de 10 rencontrés : ' + Object.keys(dixVus).sort(function(a,b){return a-b;}).join(', '));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
