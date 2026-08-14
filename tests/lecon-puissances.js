/*
 * La leçon « Découvrir les puissances » (5ème).
 *
 * On rejoue l'animation dans un DOM simulé et on vérifie les puissances
 * calculées, la cohérence du tableau des puissances de 10, et l'idempotence
 * du rejeu.
 */
load('tests/lecon-puissances-decor.js');
var ui2 = extras.children[0];
function txt(h){ return String(h).replace(/<sup[^>]*>(\d+)<\/sup>/g,'^$1')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,'').replace(/\s+/g,' ')
  .replace(/\s+\^/g,'^').trim(); }
// le contenu d'un bloc, isolé par sa classe
function bloc(h, cls) {
  var i = h.indexOf('class="' + cls);
  if (i < 0) return '';
  var d = h.indexOf('>', i) + 1, prof = 1, j = d;
  while (j < h.length && prof > 0) {
    if (h.slice(j, j + 5) === '<div ' || h.slice(j, j + 4) === '<div') prof++;
    else if (h.slice(j, j + 6) === '</div>') prof--;
    j++;
  }
  return h.slice(d, j - 1);
}
function etat(){ return ['pui-corps','pui-etapes','pui-concl']
  .map(function(c){ return ui2._sous[c] ? ui2._sous[c].innerHTML : ''; }).join('§'); }
function pow(a,n){ var r=1; for(var i=0;i<n;i++) r*=a; return r; }

var err=[], cpt={}; function ko(m){ if(err.length<12) err.push(m); }
var CAS=['parallele','lire','dix'];
for (var essai=0; essai<450; essai++) {
  var c = CAS[essai % 3];
  var b = elements.filter(function(e){ return e.tag==='button' && e.dataset.cas===c; })[0];
  b.onclick();
  cpt[c]=(cpt[c]||0)+1;
  var refs=[];
  steps.forEach(function (s) {
    if (s.step) { s.step(0); s.step(0.5); s.step(1); }
    if (s.after) s.after();
    refs.push(etat());
  });
  var corps = txt(ui2._sous['pui-corps'].innerHTML);
  var etapes = txt(ui2._sous['pui-etapes'].innerHTML);
  var concl = txt(ui2._sous['pui-concl'].innerHTML);

  if (c === 'parallele') {
    // les deux colonnes doivent porter le MÊME nombre répété, le même nombre de fois
    // chaque colonne est lue séparément : la colonne « addition » contient
    // elle aussi un « × » (la ligne 4 × 3), qui ferait dérailler une lecture
    // globale
    var brut = ui2._sous['pui-corps'].innerHTML;
    var cAdd = txt(bloc(brut, 'pui-col add')), cMul = txt(bloc(brut, 'pui-col mul'));
    var mAdd = cAdd.match(/((?:\d+ \+ )+\d+)/);
    var mMul = cMul.match(/((?:\d+ × )+\d+)/);
    if (!mAdd || !mMul) { ko('parallele : une des deux colonnes manque — '+corps.slice(0,70)); continue; }
    var tAdd = mAdd[1].split(' + ').map(Number), tMul = mMul[1].split(' × ').map(Number);
    if (tAdd.length !== tMul.length) ko('parallele : '+tAdd.length+' termes contre '+tMul.length+' facteurs');
    if (new Set(tAdd.concat(tMul)).size !== 1) ko('parallele : les deux colonnes ne répètent pas le même nombre');
    var a = tAdd[0], n = tAdd.length;
    // base et exposant doivent différer : sinon on ne distingue plus les rôles
    if (a === n) ko('parallele : base et exposant identiques (' + a + '), le parallèle ne montre rien');
    // les deux résultats affichés
    var tousRes = ((cAdd + ' ' + cMul).match(/= (\d+)/g)||[]).map(function(x){ return +x.slice(2); });
    if (tousRes.indexOf(a*n) < 0) ko('parallele : la somme '+a*n+' n\'apparaît pas');
    if (tousRes.indexOf(pow(a,n)) < 0) ko('parallele : la puissance '+pow(a,n)+' n\'apparaît pas');
    if (pow(a,n) > 1300) ko('parallele : résultat illisible ('+pow(a,n)+')');
    // le piège doit être nommé, avec les deux valeurs
    if (etapes.indexOf('n\'est pas') < 0 && etapes.indexOf("n'est pas") < 0)
      ko('parallele : le piège 3^4 ≠ 3×4 n\'est pas dit');
    if (a !== n && etapes.indexOf(String(a*n)) < 0) ko('parallele : le produit n\'est pas rappelé dans le piège');
    // la conclusion : a^n = a × … × a = valeur
    var mc = concl.match(/^(\d+)\^(\d+) = ((?:\d+ × )+\d+) = (\d+)$/);
    if (!mc) ko('parallele : conclusion mal formée — '+concl);
    else {
      if (+mc[1] !== a || +mc[2] !== n) ko('parallele : conclusion sur d\'autres nombres');
      if (mc[3].split(' × ').length !== n) ko('parallele : conclusion à '+mc[3].split(' × ').length+' facteurs');
      if (+mc[4] !== pow(a,n)) ko('parallele : conclusion '+mc[4]+' au lieu de '+pow(a,n));
    }
  }
  else if (c === 'lire') {
    var grand = txt(bloc(ui2._sous['pui-corps'].innerHTML, 'pui-grand'));
    var ml = grand.match(/^(\d+)\^(\d+) = ((?:\d+ × )+\d+) = (\d+)$/);
    if (!ml) { ko('lire : affichage final mal formé — '+grand.slice(0,70)); continue; }
    var a2=+ml[1], n2=+ml[2];
    if (a2 === n2) ko('lire : base et exposant identiques (' + a2 + ')');
    if (ml[3].split(' × ').length !== n2) ko('lire : '+ml[3].split(' × ').length+' facteurs au lieu de '+n2);
    ml[3].split(' × ').forEach(function(x){ if (+x !== a2) ko('lire : un facteur ≠ base'); });
    if (+ml[4] !== pow(a2,n2)) ko('lire : '+ml[4]+' au lieu de '+pow(a2,n2));
    // la lecture « au carré » / « au cube » doit correspondre à l'exposant
    if (/au carré/.test(etapes) && n2 !== 2) ko('lire : « au carré » pour un exposant '+n2);
    if (/au cube/.test(etapes) && n2 !== 3) ko('lire : « au cube » pour un exposant '+n2);
    if (n2 === 2 && !/au carré/.test(etapes)) ko('lire : « au carré » manquant');
    if (n2 === 3 && !/au cube/.test(etapes)) ko('lire : « au cube » manquant');
    // l'échange base/exposant doit annoncer la bonne valeur
    var me = etapes.match(/on obtiendrait (\d+)\^(\d+) = (\d+)/);
    if (!me) ko('lire : l\'échange base/exposant n\'est pas montré');
    else if (+me[1] !== n2 || +me[2] !== a2 || +me[3] !== pow(n2,a2))
      ko('lire : échange faux — '+me[0]+' (attendu '+n2+'^'+a2+' = '+pow(n2,a2)+')');
  }
  else {
    // le tableau des puissances de 10
    var lignes = ui2._sous['pui-corps'].innerHTML.match(/<tr>[\s\S]*?<\/tr>/g) || [];
    if (lignes.length !== 7) ko('dix : '+lignes.length+' lignes au lieu de 7');
    lignes.forEach(function (tr, i) {
      var k = i + 1;
      var cells = (tr.match(/<td[^>]*>([\s\S]*?)<\/td>/g)||[]).map(function(x){
        return txt(x); });
      if (cells.length !== 3) { ko('dix : ligne à '+cells.length+' cellules'); return; }
      if (cells[0] !== '10^'+k) ko('dix : en-tête « '+cells[0]+' » au lieu de 10^'+k);
      var attendu = String(pow(10,k));
      if (cells[1] !== attendu) ko('dix : 10^'+k+' affiché « '+cells[1]+' » au lieu de '+attendu);
      var zeros = (attendu.match(/0/g)||[]).length;
      if (zeros !== k) ko('dix : '+attendu+' n\'a pas '+k+' zéros');
      if (cells[2].indexOf('1 suivi de '+k+' z') !== 0) ko('dix : légende « '+cells[2]+' »');
    });
  }

  // aucune phrase répétée, rejeu identique
  var ph = ui2._sous['pui-etapes'].innerHTML.split('pui-etape">').slice(1);
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
     : 'TOUT EST JUSTE : les deux colonnes répètent le même nombre, les valeurs sont exactes,\n' +
       'le tableau des puissances de 10 est cohérent, et le rejeu est identique');
