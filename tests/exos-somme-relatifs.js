/*
 * Les exercices « Additionner et soustraire des décimaux relatifs » (5ème).
 *
 * Tous les calculs sont refaits en centièmes entiers : la réponse annoncée ne
 * doit jamais dépendre d'un arrondi flottant.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/5eme/somme-relatifs.js');
var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
// relit les nombres LaTeX d'un texte : (+12{,}7) → 1270 centièmes
function nbs(t){ var r=[],m,re=/\(([+-])(\d+)(?:\{,\}(\d+))?\)/g;
  while((m=re.exec(t))) r.push((m[1]==='-'?-1:1)*(+m[2]*100 + (m[3]?+(m[3]+'0').slice(0,2):0)));
  return r; }
for (var p=1;p<=4;p++) for (var g=0;g<900;g++) {
  var q = G.genere(MathsAlea(p*911+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (/\d\.\d/.test(tout.replace(/\{,\}/g,''))) ko('P'+p+' un point décimal traîne : '+tout.slice(0,120));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques'); vus[c]=1; }); }

  var t = nbs(q.enonce.split('<br>')[1] || q.enonce);
  if (q.type === 'nombre') {
    var att;
    if (/\) - \(/.test(q.enonce)) { compte('difference'); att = t[0]-t[1]; }
    else if (t.length > 2) { compte('plusieurs'); att = t.reduce(function(x,y){return x+y;},0); }
    else { compte('somme'); att = t[0]+t[1]; }
    if (Math.abs(q.reponse - att/100) > 1e-9)
      ko('P'+p+' calcul : ' + q.reponse + ' au lieu de ' + att/100 + ' pour ' + q.enonce.slice(0,90));
    // la réponse doit être un décimal propre (2 décimales au plus)
    if (Math.abs(Math.round(q.reponse*100) - q.reponse*100) > 1e-9) ko('P'+p+' réponse non décimale');
  } else if (/quel sera le <b>signe<\/b>/.test(q.enonce)) {
    compte('signe');
    var s2 = t[0]+t[1];
    var dit = q.choix[q.correct];
    var vrai = s2>0?'Positif':s2<0?'Négatif':'Nul';
    if (dit !== vrai) ko('P'+p+' signe : « '+dit+' » alors que la somme vaut '+s2/100);
  } else if (/peut aussi s'écrire/.test(q.enonce)) {
    compte('opposee');
    var orig = nbs(q.enonce);
    var bon = nbs(q.choix[q.correct]);
    if (bon.length!==2 || bon[0]!==orig[0] || bon[1]!==-orig[1])
      ko('P'+p+' opposée : ' + q.choix[q.correct] + ' pour ' + q.enonce.slice(0,80));
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      var f = nbs(c);
      if (f.length===2 && f[0]===orig[0] && f[1]===-orig[1]) ko('P'+p+' opposée : deux bonnes réponses'); });
  } else if (/qu'écrit-on/.test(q.enonce)) {
    compte('poser');
    // le chiffre annoncé doit être celui des DIXIÈMES du second nombre
    var m2 = q.enonce.match(/\\\((\d+)\{,\}(\d+) \+ (\d+)\{,\}(\d+)\\\)/);
    if (!m2) { ko('poser : énoncé illisible'); continue; }
    var decB = m2[4];
    var attendu = decB.charAt(0);
    var dit2 = (q.choix[q.correct].match(/<b>(\d)<\/b>/)||[])[1];
    if (dit2 !== attendu) ko('poser : « '+dit2+' » au lieu de '+attendu+' (dixièmes de '+m2[3]+','+decB+')');
  } else if (q.type === 'vraifaux') compte('vraifaux');
}
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
