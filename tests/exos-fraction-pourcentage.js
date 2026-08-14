/*
 * Les exercices « Fraction et pourcentage d'une quantité » (5ème).
 *
 * Les calculs sont refaits en centièmes entiers, jamais en flottants, et les
 * situations concrètes doivent rester plausibles : un effectif de classe est
 * un nombre entier, un prix a au plus deux décimales.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/5eme/fraction-pourcentage.js');
function pgcd(x,y){ while(y){var t=y;y=x%y;x=t;} return x; }
function nb(t){ return parseFloat(String(t).replace('−','-').replace(/\s/g,'').replace(',','.')); }
function txt(h){ return String(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function fracs(t){ var r=[],m,re=/\\dfrac\{(\d+)\}\{(\d+)\}/g; while((m=re.exec(t))) r.push([+m[1],+m[2]]); return r; }

var err=[], cpt={}, formes={brut:0, situation:0}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
var UNITES = ['élèves','€','pages','billes','km','L'];

for (var p=1;p<=4;p++) for (var g=0;g<900;g++) {
  var q = G.genere(MathsAlea(p*457+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques : '+c); vus[c]=1; }); }
  if (q.type==='vraifaux') { compte('vraifaux'); continue; }

  // « 30 % » s'écrit \(30\,\%\) en LaTeX : on normalise avant de lire
  var e = txt(q.enonce.replace(/\\,\\%/g, ' %'));

  /* --- calcul brut : « Calcule 30 % de 48 » ou « Calcule 3/4 de 48 » --- */
  if (/^Calcule/.test(e)) {
    compte('calcul'); formes.brut++;
    var mp = q.enonce.match(/\\\((\d+)\\,\\%\s*\\text\{ de \}\s*(\d+)\\\)/);
    var mf = q.enonce.match(/\\dfrac\{(\d+)\}\{(\d+)\}\s*\\text\{ de \}\s*(\d+)/);
    var att;
    if (mp) att = (+mp[1]) * (+mp[2]) / 100;
    else if (mf) att = (+mf[1]) * (+mf[3]) / (+mf[2]);
    else { ko('calcul : énoncé illisible — '+e.slice(0,70)); continue; }
    if (Math.abs(q.reponse - att) > 1e-9) ko('calcul : '+q.reponse+' au lieu de '+att+' — '+e.slice(0,60));
    if (Math.abs(Math.round(att*100) - att*100) > 1e-9) ko('calcul : plus de deux décimales');
    if (q.unite) ko('calcul brut : une unité est affichée alors qu\'il n\'y a pas de contexte');
  }
  /* --- en situation --- */
  else if (UNITES.indexOf(q.unite) >= 0 && !/en tout/.test(e)) {
    compte('calcul'); formes.situation++;
    var tot = +(e.match(/(\d+) (?:élèves|€|pages|billes|km|L)/)||[])[1];
    var pc = (e.match(/(\d+) %/)||[])[1];
    var fq = fracs(q.enonce);
    var att2;
    if (pc) att2 = tot * (+pc) / 100;
    else if (fq.length) att2 = tot * fq[0][0] / fq[0][1];
    else { ko('situation : ni % ni fraction — '+e.slice(0,70)); continue; }
    if (Math.abs(q.reponse - att2) > 1e-9)
      ko('situation : '+q.reponse+' au lieu de '+att2+' — '+e.slice(0,70));
    // un effectif doit être entier
    if (['élèves','pages','billes'].indexOf(q.unite) >= 0 && q.reponse % 1 !== 0)
      ko('situation : '+q.reponse+' '+q.unite+' — un effectif doit être entier');
    if (Math.abs(Math.round(q.reponse*100) - q.reponse*100) > 1e-9)
      ko('situation : plus de deux décimales');
  }
  /* --- la question à l'envers : on cherche le total --- */
  else if (/en tout/.test(e)) {
    compte('inverse');
    var part = +(e.match(/représente ([\d,]+) /)||[])[1].replace(',','.');
    var pc2 = (e.match(/(\d+) %/)||[])[1];
    var fq2 = fracs(q.enonce);
    var att3 = pc2 ? part * 100 / (+pc2) : part * fq2[0][1] / fq2[0][0];
    if (Math.abs(q.reponse - att3) > 1e-9)
      ko('inverse : '+q.reponse+' au lieu de '+att3+' — '+e.slice(0,80));
    if (q.reponse % 1 !== 0) ko('inverse : total non entier');
  }
  /* --- pourcentage ↔ fraction --- */
  else if (/forme simplifiée|quel pourcentage/.test(e)) {
    compte('ecrire');
    if (/forme simplifiée/.test(e)) {
      var t2 = +(e.match(/(\d+) %/)||[])[1];
      var bonF = fracs(q.choix[q.correct])[0];
      if (!bonF || bonF[0]*100 !== t2*bonF[1]) ko('ecrire : '+q.choix[q.correct]+' pour '+t2+' %');
      if (bonF && pgcd(bonF[0],bonF[1]) !== 1) ko('ecrire : la « bonne » réponse n\'est pas simplifiée');
      q.choix.forEach(function(c,i){ if(i===q.correct) return;
        var f=fracs(c)[0]; if (f && f[0]*100 === t2*f[1]) ko('ecrire : deux bonnes réponses'); });
    } else {
      var fq3 = fracs(q.enonce)[0];
      var dit = +(q.choix[q.correct].match(/(\d+)/)||[])[1];
      if (fq3[0]*100 !== dit*fq3[1]) ko('ecrire : '+dit+' % pour '+fq3.join('/'));
    }
  }
  /* --- comparer deux remises --- */
  else if (/économiser le plus/.test(e)) {
    compte('comparer');
    var mm = e.match(/Le premier : (\d+) % sur un prix de (\d+) €.*Le second : (\d+) % sur un prix de (\d+) €/);
    if (!mm) { ko('comparer : énoncé illisible'); continue; }
    var r1 = (+mm[1])*(+mm[2])/100, r2 = (+mm[3])*(+mm[4])/100;
    if (r1 === r2) ko('comparer : les deux remises sont égales, la question n\'a pas de réponse');
    var attTxt = r1 > r2 ? 'La première' : 'La seconde';
    if (q.choix[q.correct].indexOf(attTxt) !== 0)
      ko('comparer : « '+q.choix[q.correct]+' » alors que '+r1+' € contre '+r2+' €');
    // la valeur annoncée dans chaque proposition doit être juste
    q.choix.forEach(function(c){
      var v = nb((c.match(/: ([\d,]+) €/)||[])[1]);
      if (Math.abs(v-r1)>1e-9 && Math.abs(v-r2)>1e-9) ko('comparer : montant faux dans « '+c+' »');
    });
  }
  else ko('P'+p+' question non reconnue : ' + e.slice(0, 80));
}
print('familles : ' + JSON.stringify(cpt) + '   formes : ' + JSON.stringify(formes));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
