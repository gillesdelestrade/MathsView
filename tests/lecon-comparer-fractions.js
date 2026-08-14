/*
 * La leçon « Comparer des fractions » (5ème).
 *
 * On rejoue toutes les étapes de l'animation dans un DOM simulé, on relit le
 * tableau produit, et on vérifie que les comparaisons annoncées sont exactes
 * et que rejouer donne exactement la même chose.
 */
load('tests/lecon-comparer-fractions-decor.js');
var ui2 = extras.children[0];
function txt(h){ return String(h).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function etat(){ return ['cmf-depart','cmf-dessin','cmf-etapes','cmf-apres','cmf-concl']
  .map(function(c){ return ui2._sous[c] ? ui2._sous[c].innerHTML : ''; }).join('§'); }
// les fractions écrites : [num, den] dans l'ordre d'apparition
function fracs(h) {
  var r=[],m,re=/<span class="num[^"]*">(\d+)<\/span><span class="den[^"]*">(\d+)<\/span>/g;
  while((m=re.exec(h))) r.push([+m[1],+m[2]]);
  return r;
}
// les barres du dessin : parts totales, parts coloriées (relues sur le SVG)
function barres(h) {
  var r=[],m;
  var reRect=/<rect x="4" y="(\d+)" width="([\d.]+)" height="34" fill="(#[0-9a-f]+)" fill-opacity="0.3"\/>/g;
  while((m=reRect.exec(h))) r.push({ y:+m[1], plein:+m[2], couleur:m[3], traits:0 });
  // on compte les traits de découpe par barre
  var reL=/<line x1="([\d.]+)" y1="(\d+)" x2="[\d.]+" y2="(\d+)" stroke="(#[0-9a-f]+)" stroke-width="([\d.]+)"\/>/g;
  while((m=reL.exec(h))) {
    var y=+m[2];
    r.forEach(function(b){ if (y === b.y) b.traits++; });
  }
  return r;
}
var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
var CAS=['meme','multiple','quelconque'];
for (var essai=0; essai<450; essai++) {
  var c = CAS[essai % 3];
  var b = elements.filter(function(e){ return e.tag==='button' && e.dataset.cas===c; })[0];
  b.onclick();
  cpt[c]=(cpt[c]||0)+1;

  // les deux fractions de départ, relues sur l'affichage
  var f0 = fracs(ui2._sous['cmf-depart'].innerHTML);
  if (f0.length !== 2) { ko(c+' : '+f0.length+' fractions au départ'); continue; }
  var a=f0[0][0], bb=f0[0][1], cc=f0[1][0], dd=f0[1][1];
  if (a<1 || a>=bb || cc<1 || cc>=dd) ko(c+' : fraction hors de ]0 ; 1[ — '+a+'/'+bb+' et '+cc+'/'+dd);
  if (a*dd === cc*bb) ko(c+' : les deux fractions sont égales, il n\'y a rien à comparer');
  if (c==='meme' && bb!==dd) ko('meme : dénominateurs différents ('+bb+', '+dd+')');
  if (c==='multiple' && !(bb!==dd && (dd%bb===0 || bb%dd===0)))
    ko('multiple : '+bb+' et '+dd+' ne sont pas l\'un multiple de l\'autre');
  if (c==='quelconque') {
    var x=bb,y=dd; while(y){var t=y;y=x%y;x=t;}
    if (x!==1) ko('quelconque : '+bb+' et '+dd+' ne sont pas premiers entre eux (pgcd '+x+')');
  }

  var refs=[];
  steps.forEach(function (s) {
    if (s.step) { s.step(0); s.step(0.5); s.step(1); }
    if (s.after) s.after();
    refs.push(etat());
    // à tout instant, la longueur coloriée d'une barre doit valoir a/b de la barre
    var bs = barres(ui2._sous['cmf-dessin'].innerHTML);
    if (bs.length !== 2) { ko(c+' : '+bs.length+' barres'); return; }
    if (Math.abs(bs[0].plein - 452*a/bb) > 0.15) ko(c+' : barre 1 coloriée à '+bs[0].plein+
      ' au lieu de '+(452*a/bb).toFixed(1)+' ('+a+'/'+bb+')');
    if (Math.abs(bs[1].plein - 452*cc/dd) > 0.15) ko(c+' : barre 2 coloriée à '+bs[1].plein+
      ' au lieu de '+(452*cc/dd).toFixed(1));
  });

  // état final : les fractions amplifiées ont le MÊME dénominateur, la même
  // valeur que les fractions de départ, et le signe est juste
  var fa = fracs(ui2._sous['cmf-apres'].innerHTML);
  if (fa.length === 2) {
    if (fa[0][1] !== fa[1][1]) ko(c+' : dénominateurs finaux différents ('+fa[0][1]+', '+fa[1][1]+')');
    if (fa[0][0]*bb !== a*fa[0][1]) ko(c+' : la 1re fraction a changé de valeur');
    if (fa[1][0]*dd !== cc*fa[1][1]) ko(c+' : la 2e fraction a changé de valeur');
    // le nombre de traits de découpe doit valoir dénominateur commun − 1
    var bs2 = barres(ui2._sous['cmf-dessin'].innerHTML);
    if (bs2[0].traits !== fa[0][1]-1 || bs2[1].traits !== fa[1][1]-1)
      ko(c+' : découpe des barres ('+bs2[0].traits+', '+bs2[1].traits+') pour un dénominateur '+fa[0][1]);
  } else if (c !== 'meme') ko(c+' : pas de ligne de fractions amplifiées');

  // la conclusion doit porter le bon signe, sur les fractions de départ
  var concl = ui2._sous['cmf-concl'].innerHTML;
  var fc = fracs(concl);
  // les signes sont écrits en entités : on les relit comme tels, et on
  // vérifie au passage qu'aucun « < » brut ne traîne dans le HTML produit
  if (/<(?![a-z\/!])/i.test(concl)) ko(c + ' : un « < » brut dans le HTML de la conclusion');
  // on lit le signe DANS sa balise : ailleurs, le « = » des attributs traîne
  var mS = concl.match(/<span class="cmf-signe[^"]*">([^<]*)<\/span>/);
  var signe = { '&lt;': '<', '&gt;': '>', '=': '=' }[mS ? mS[1] : ''];
  var vrai = a*dd > cc*bb ? '>' : (a*dd < cc*bb ? '<' : '=');
  if (!fc.length || fc[0][0]!==a || fc[0][1]!==bb || fc[1][0]!==cc || fc[1][1]!==dd)
    ko(c+' : la conclusion ne reprend pas les fractions de départ');
  if (signe !== vrai) ko(c+' : conclusion « '+a+'/'+bb+' '+signe+' '+cc+'/'+dd+' » au lieu de '+vrai);

  // aucune phrase répétée, et rejeu identique
  var ph = ui2._sous['cmf-etapes'].innerHTML.split('cmf-etape">').slice(1);
  var vus={}; ph.forEach(function(t){ if(vus[t]) ko(c+' : phrase répétée'); vus[t]=1; });
  for (var tour=0; tour<2; tour++) {
    steps.forEach(function (s, i) {
      if (s.step) { s.step(0); s.step(1); }
      if (s.after) s.after();
      if (etat() !== refs[i] && err.length < 12) ko(c+' : étape '+i+' non idempotente');
    });
  }
}
print('cas : ' + JSON.stringify(cpt));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ')
     : 'TOUT EST JUSTE : longueurs coloriées inchangées, dénominateurs communs,\n' +
       'comparaisons exactes et rejeu identique');
