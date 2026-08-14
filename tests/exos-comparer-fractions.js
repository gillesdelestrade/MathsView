/*
 * Les exercices « Comparer des fractions » (5ème).
 *
 * Chaque comparaison est refaite par produit en croix, sur des entiers : la
 * réponse annoncée doit s'accorder avec ce calcul exact, jamais avec un
 * quotient approché.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/5eme/comparer-fractions.js');

/* --- arithmétique de contrôle, écrite à part --- */
function cmp(a,b,c,d){ var g=a*d,h=c*b; return g>h?1:(g<h?-1:0); }
function pgcd(x,y){ while(y){var t=y;y=x%y;x=t;} return x; }
function ppcm(x,y){ return x/pgcd(x,y)*y; }
// toutes les fractions \dfrac{a}{b} d'un texte, dans l'ordre
function fracs(t){ var r=[],m,re=/\\dfrac\{(\d+)\}\{(\d+)\}/g;
  while((m=re.exec(t))) r.push([+m[1],+m[2]]); return r; }

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
function compte(k){ cpt[k]=(cpt[k]||0)+1; }

for (var p=1;p<=4;p++) for (var g=0;g<900;g++) {
  var q = G.genere(MathsAlea(p*337+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques : '+c); vus[c]=1; }); }
  // aucune fraction de dénominateur nul ou de numérateur nul
  fracs(tout).forEach(function(f){ if(f[1]===0) ko('P'+p+' dénominateur nul'); });

  if (q.type === 'vraifaux') { compte('vraifaux'); continue; }

  if (/dénominateur commun le plus simple/.test(q.enonce)) {
    compte('denominateur');
    var f2 = fracs(q.enonce);
    if (f2.length !== 2) { ko('denominateur : énoncé illisible'); continue; }
    var b1=f2[0][1], b2=f2[1][1];
    var att = b1===b2 ? b1 : (b2%b1===0 ? b2 : (b1%b2===0 ? b1 : ppcm(b1,b2)));
    var dit = +q.choix[q.correct].replace(/\\\(|\\\)/g,'');
    if (dit !== att) ko('denominateur : '+dit+' au lieu de '+att+' pour '+b1+' et '+b2);
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      if (+c.replace(/\\\(|\\\)/g,'') === att) ko('denominateur : deux bonnes réponses'); });
  }
  else if (/Quel numérateur/.test(q.enonce)) {
    compte('amplifier');
    var mm = q.enonce.match(/\\dfrac\{(\d+)\}\{(\d+)\} = \\dfrac\{\\ldots\}\{(\d+)\}/);
    if (!mm) { ko('amplifier : énoncé illisible'); continue; }
    var a=+mm[1], b=+mm[2], den=+mm[3];
    if (den % b) ko('amplifier : '+den+' n\'est pas un multiple de '+b);
    if (q.reponse !== a*den/b) ko('amplifier : '+q.reponse+' au lieu de '+(a*den/b));
    // la fraction obtenue doit valoir la même chose
    if (q.reponse*b !== a*den) ko('amplifier : la valeur a changé');
  }
  else if (/Compare ces deux fractions/.test(q.enonce)) {
    compte(/sans les réduire/.test(q.enonce) ? 'sansCalcul' : 'comparer');
    var fe = fracs(q.enonce);
    if (fe.length !== 2) { ko('comparer : énoncé illisible'); continue; }
    var vrai = cmp(fe[0][0],fe[0][1],fe[1][0],fe[1][1]);
    var bonTxt = q.choix[q.correct];
    var sg = (bonTxt.match(/\} ([<>=]) \\dfrac/)||[])[1];
    var attS = vrai>0?'>':(vrai<0?'<':'=');
    if (sg !== attS) ko('comparer : « '+sg+' » au lieu de « '+attS+' » pour '+
                        fe[0].join('/')+' et '+fe[1].join('/'));
    // les trois propositions doivent porter les MÊMES fractions, dans le même ordre
    q.choix.forEach(function(c){
      var fc = fracs(c);
      if (fc.length!==2 || fc[0][0]!==fe[0][0] || fc[0][1]!==fe[0][1] ||
          fc[1][0]!==fe[1][0] || fc[1][1]!==fe[1][1]) ko('comparer : une proposition change les fractions');
    });
    if (q.choix.length !== 3) ko('comparer : '+q.choix.length+' propositions');
  }
  else if (/ordre <b>croissant/.test(q.enonce)) {
    compte('ranger');
    var f3 = fracs(q.enonce);
    if (f3.length !== 3) { ko('ranger : '+f3.length+' fractions'); continue; }
    for (var i=0;i<3;i++) for (var j=i+1;j<3;j++)
      if (cmp(f3[i][0],f3[i][1],f3[j][0],f3[j][1])===0) ko('ranger : deux fractions égales');
    var bon = fracs(q.choix[q.correct]);
    if (bon.length !== 3) { ko('ranger : proposition illisible'); continue; }
    // la bonne réponse doit être croissante ET contenir les mêmes fractions
    for (var k2=0;k2<2;k2++)
      if (cmp(bon[k2][0],bon[k2][1],bon[k2+1][0],bon[k2+1][1]) >= 0)
        ko('ranger : la « bonne » réponse n\'est pas croissante');
    var cle=function(l){ return l.map(function(x){return x.join('/');}).sort().join(); };
    if (cle(bon) !== cle(f3)) ko('ranger : la réponse ne reprend pas les mêmes fractions');
    q.choix.forEach(function(c,i2){ if(i2===q.correct) return;
      var l=fracs(c), croissant=true;
      for (var k3=0;k3<2;k3++) if (cmp(l[k3][0],l[k3][1],l[k3+1][0],l[k3+1][1])>=0) croissant=false;
      if (croissant && cle(l)===cle(f3)) ko('ranger : deux réponses croissantes');
    });
  }
  else if (q.type === 'qcm-multi') {
    compte('unite');
    q.choix.forEach(function(c,i3){
      var f4 = fracs(c)[0];
      var doit = f4[0] > f4[1];
      if (doit !== (q.corrects.indexOf(i3) >= 0))
        ko('unite : '+f4.join('/')+' mal classée');
    });
    if (!q.corrects.length || q.corrects.length === q.choix.length)
      ko('unite : lot sans contraste');
  }
}
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
