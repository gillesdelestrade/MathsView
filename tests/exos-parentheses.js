/*
 * Les exercices « Parenthèses indispensables » (5ème).
 *
 * Pour chaque écriture, on calcule la valeur AVEC et SANS les parenthèses : le
 * verdict annoncé — indispensables ou non — doit correspondre à l'égalité ou à
 * la différence des deux résultats.
 */
var window = this;
load('js/alea.js'); load('exos/outils.js');
var G=null; var MathsExos={register:function(g){G=g;}}; window.MathsExos=MathsExos;
load('exos/5eme/parentheses.js');

/* --- évaluateur de contrôle, écrit à part --- */
function evalue(e) {
  e = e.replace(/\\times/g,'*').replace(/\\div/g,'/').replace(/\s+/g,'');
  if (!/^[-+*/()\d]+$/.test(e)) return NaN;
  var i=0;
  function fac(){ if(e[i]==='('){i++;var v=som();i++;return v;}
    var s=1; while(e[i]==='+'||e[i]==='-'){ if(e[i]==='-')s=-s; i++; }
    var n=''; while(i<e.length&&/\d/.test(e[i]))n+=e[i++]; return s*parseInt(n,10); }
  function pro(){ var v=fac(); while(e[i]==='*'||e[i]==='/'){var o=e[i++],w=fac();v=o==='*'?v*w:v/w;} return v; }
  function som(){ var v=pro(); while(e[i]==='+'||e[i]==='-'){var o=e[i++],w=pro();v=o==='+'?v+w:v-w;} return v; }
  var r=som(); return i===e.length?r:NaN;
}
function licite(e) {
  var s = e.replace(/\\times/g,'*').replace(/\\div/g,'/').replace(/\s+/g,'');
  if (/[+*/-][+-]/.test(s)) return false;                 // deux symboles à la suite
  var d=0; for (var i=0;i<s.length;i++){ if(s[i]==='(')d++; if(s[i]===')')d--; if(d<0) return false; }
  return d===0;
}
// une formule peut contenir \times : on ne peut pas exclure les antislashs
function formules(t){ var r=[],m,re=/\\\(([\s\S]*?)\\\)/g;
  while((m=re.exec(t))) r.push(m[1]); return r; }

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
for (var p=1;p<=4;p++) for (var g=0;g<900;g++) {
  var q = G.genere(MathsAlea(p*613+g), p);
  var tout = q.enonce+'|'+(q.etapes||[]).join('|')+'|'+(q.choix||[]).join('|')+'|'+(q.indices||[]).join('|');
  if (/undefined|NaN|\[object/.test(tout)) ko('P'+p+' texte douteux : '+tout.slice(0,140));
  if (!q.etapes||!q.etapes.length) ko('P'+p+' pas de correction');
  if (q.choix){ var vus={}; q.choix.forEach(function(c){ if(vus[c]) ko('P'+p+' deux choix identiques : '+c); vus[c]=1; }); }

  // le type d'abord : une affirmation vrai/faux peut contenir les mêmes mots
  // qu'une consigne (« Simplifier … », « … indispensables »)
  if (q.type === 'vraifaux') {
    compte('vraifaux');
    // les formules d'une affirmation doivent toutes être licites
    formules(q.enonce).forEach(function (f) {
      if (!licite(f)) {
        // sauf celles qui illustrent justement une écriture interdite
        if (!/On peut écrire/.test(q.enonce)) ko('vraifaux : formule illicite — ' + f);
      }
    });
  } else if (/est <b>correcte<\/b>/.test(q.enonce)) {
    compte('correcte');
    // une seule proposition doit être licite, et c'est la bonne
    var lic = q.choix.map(function(c){ var f=formules(c)[0]; return f!==undefined && licite(f); });
    if (!lic[q.correct]) ko('correcte : la « bonne » écriture est illicite — '+q.choix[q.correct]);
    if (lic.filter(Boolean).length !== 1) ko('correcte : ' + lic.filter(Boolean).length +
      ' écritures licites parmi les propositions');
  } else if (/indispensables<\/b> \?/.test(q.enonce)) {
    compte('indispensable');
    var f0 = formules(q.enonce)[0];
    if (!licite(f0)) { ko('indispensable : énoncé illicite — '+f0); continue; }
    var sans = f0.replace('(','').replace(')','');
    var vrai = !licite(sans) || evalue(sans) !== evalue(f0);
    var dit = /Oui/.test(q.choix[q.correct]);
    if (dit !== vrai) ko('indispensable : « '+q.choix[q.correct]+' » pour '+f0+
                         ' (sans : '+sans+' → '+(licite(sans)?evalue(sans):'illicite')+
                         ' contre '+evalue(f0)+')');
  } else if (/Simplifie/.test(q.enonce)) {
    compte('simplifier');
    var src = formules(q.enonce)[0];
    var bon = formules(q.choix[q.correct])[0];
    if (!licite(bon) || evalue(bon) !== evalue(src))
      ko('simplifier : '+bon+' ('+evalue(bon)+') pour '+src+' ('+evalue(src)+')');
    if (/[()]/.test(bon)) ko('simplifier : la réponse garde des parenthèses');
    q.choix.forEach(function(c,i){ if(i===q.correct) return;
      var f=formules(c)[0];
      if (f && licite(f) && !/[()]/.test(f) && evalue(f)===evalue(src))
        ko('simplifier : deux bonnes réponses'); });
  } else if (q.type === 'nombre') {
    compte('valeur');
    var fv = formules(q.enonce)[0];
    if (evalue(fv) !== q.reponse) ko('valeur : '+q.reponse+' au lieu de '+evalue(fv)+' pour '+fv);
  }
}
function compte(k){ cpt[k]=(cpt[k]||0)+1; }
print('familles : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUTES LES RÉPONSES SONT VÉRIFIÉES');
