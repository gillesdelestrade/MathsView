/*
 * La leçon « Fraction et pourcentage d'une quantité » (5ème).
 *
 * On rejoue l'animation dans un DOM simulé : les effectifs annoncés doivent
 * rester entiers (on ne compte pas 12,5 élèves), les calculs être exacts, et
 * le rejeu identique.
 */
load('tests/lecon-fraction-pourcentage-decor.js');
var ui2 = extras.children[0];
function txt(h){ return String(h).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function etat(){ return ['qte-enonce','qte-dessin','qte-etapes','qte-calc','qte-concl','qte-autre']
  .map(function(c){ return ui2._sous[c] ? ui2._sous[c].innerHTML : ''; }).join('§'); }
function nb(t){ return parseFloat(String(t).replace('−','-').replace(',','.')); }

var err=[], cpt={}, decimaux=0; function ko(m){ if(err.length<12) err.push(m); }
var CAS=['fraction','pourcent','decimal'];
for (var essai=0; essai<450; essai++) {
  var c = CAS[essai % 3];
  var b = elements.filter(function(e){ return e.tag==='button' && e.dataset.cas===c; })[0];
  b.onclick();
  cpt[c]=(cpt[c]||0)+1;

  var en = txt(ui2._sous['qte-enonce'].innerHTML);
  // la quantité totale et la part demandée, relues sur l'énoncé
  var tot = nb((en.match(/(\d+(?:,\d+)?) (?:élèves|€|pages|billes|km)/)||[])[1]);
  var pct = (en.match(/(\d+) %/)||[])[1];
  var fra = (en.match(/les (\d+)\/(\d+)/)||[]);
  if (!tot) { ko(c+' : total illisible — '+en.slice(0,80)); continue; }
  if (!pct && !fra.length) { ko(c+' : ni fraction ni pourcentage — '+en.slice(0,80)); continue; }
  if (c==='pourcent' && !pct) ko('pourcent : l\'énoncé ne parle pas de %');
  if (c!=='pourcent' && pct) ko(c+' : un % dans un énoncé de fraction');

  var refs=[];
  steps.forEach(function (s) {
    if (s.step) { s.step(0); s.step(0.5); s.step(1); }
    if (s.after) s.after();
    refs.push(etat());
  });

  // la valeur attendue, calculée à part
  var a, bb;
  if (pct) { a = +pct; bb = 100; } else { a = +fra[1]; bb = +fra[2]; }
  var attendu = tot * a / bb;
  if (Math.abs(attendu*100 - Math.round(attendu*100)) > 1e-9)
    ko(c+' : résultat à plus de deux décimales — '+a+'/'+bb+' de '+tot);
  if (Math.round(attendu*100)/100 !== attendu) attendu = Math.round(attendu*100)/100;

  // la conclusion doit porter ce nombre
  var concl = txt(ui2._sous['qte-concl'].innerHTML);
  var dit = nb((concl.match(/= (−?[\d,]+)/)||[])[1]);
  if (Math.abs(dit - attendu) > 1e-9)
    ko(c+' : conclusion « '+concl+' » au lieu de '+attendu+' ('+a+'/'+bb+' de '+tot+')');
  if (attendu % 1 !== 0) decimaux++;

  // un effectif doit rester entier
  if (/élèves|pages|billes/.test(en) && attendu % 1 !== 0)
    ko(c+' : '+attendu+' '+(en.match(/élèves|pages|billes/)||[])[0]+' — un effectif doit être entier');

  // le dessin : autant de parts que le dénominateur simplifié, et la zone
  // coloriée doit valoir a/b de la barre
  var svg = ui2._sous['qte-dessin'].innerHTML;
  var traits = (svg.match(/stroke-width="1\.6"/g)||[]).length;
  var mRect = svg.match(/<rect x="6" y="34" width="([\d.]+)" height="44" fill="#7c3aed"/);
  var denAff = traits + 1;
  if (pct) {
    // le dénominateur affiché doit être 100 simplifié par le pgcd
    function pg(x,y){ while(y){var t=y;y=x%y;x=t;} return x; }
    var g = pg(+pct, 100);
    if (denAff !== 100/g) ko('pourcent : barre en '+denAff+' parts au lieu de '+(100/g));
  } else if (denAff !== bb) ko(c+' : barre en '+denAff+' parts au lieu de '+bb);
  if (mRect) {
    var partsPrises = pct ? (+pct)/pg2(+pct,100) : a;
    var attLarg = 458 * partsPrises / denAff;
    if (Math.abs(+mRect[1] - attLarg) > 0.15)
      ko(c+' : zone coloriée de '+mRect[1]+' au lieu de '+attLarg.toFixed(1));
  } else ko(c+' : rien n\'est colorié à la fin');

  // « × 1 » ne doit apparaître nulle part : quand on ne prend qu'une part, la
  // rédaction doit le CONSTATER, pas simuler un calcul
  var etapes = txt(ui2._sous['qte-etapes'].innerHTML);
  var toutTxt = etapes + ' ' + txt(ui2._sous['qte-calc'].innerHTML) + ' ' +
                txt(ui2._sous['qte-autre'].innerHTML);
  if (/× 1(?!\d)/.test(toutTxt)) ko(c + ' : « × 1 » écrit quelque part — ' +
    toutTxt.slice(Math.max(0, toutTxt.indexOf('× 1') - 40), toutTxt.indexOf('× 1') + 20));
  if (/On en prend 1 :/.test(etapes)) ko(c + ' : « on en prend 1 » au lieu de le constater');
  // et quand on en prend plusieurs, les deux chemins doivent être montrés
  var unePart = /qu'<?b?>?une<\/?b?>? part|qu'une part|qu'une<\/b> part/.test(etapes) ||
                /n'en prend qu'/.test(etapes);
  if (!unePart && !/deux chemins/.test(txt(ui2._sous['qte-autre'].innerHTML)))
    ko(c + ' : les deux ordres de calcul ne sont pas montrés');
  // aucune phrase répétée, rejeu identique
  var ph = ui2._sous['qte-etapes'].innerHTML.split('qte-etape">').slice(1);
  var vus={}; ph.forEach(function(t){ if(vus[t]) ko(c+' : phrase répétée'); vus[t]=1; });
  for (var tour=0; tour<2; tour++) {
    steps.forEach(function (s, i) {
      if (s.step) { s.step(0); s.step(1); }
      if (s.after) s.after();
      if (etat() !== refs[i] && err.length < 12) ko(c+' : étape '+i+' non idempotente');
    });
  }
}
function pg2(x,y){ while(y){var t=y;y=x%y;x=t;} return x; }
print('cas : ' + JSON.stringify(cpt) + '   résultats non entiers rencontrés : ' + decimaux);
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ')
     : 'TOUT EST JUSTE : résultats exacts, barres cohérentes avec la fraction,\n' +
       'effectifs entiers et rejeu identique');
