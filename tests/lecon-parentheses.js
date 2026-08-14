/*
 * La leçon « Parenthèses indispensables » (5ème).
 *
 * On rejoue l'animation dans un DOM simulé et on vérifie que chaque verdict —
 * les parenthèses sont-elles nécessaires ? — est juste, et que le rejeu donne
 * le même écran.
 */
load('tests/lecon-parentheses-decor.js');
var ui2 = extras.children[0];
function txt(h){ return String(h).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim(); }
function etat(){ return ['ptn-expr','ptn-etapes','ptn-essai','ptn-verdict','ptn-bilan']
  .map(function(c){ return ui2._sous[c] ? ui2._sous[c].innerHTML : ''; }).join('§'); }

/* --- évaluateur de contrôle, écrit à part : on relit l'écriture AFFICHÉE --- */
function evalue(s) {
  // « 8 − (3 − 5) × 2 » → valeur, en repassant par des symboles usuels
  var e = s.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  if (!/^[-+*/()\d]+$/.test(e)) return NaN;
  // pas d'eval : petit analyseur récursif
  var i = 0;
  function facteur() {
    if (e[i] === '(') { i++; var v = somme(); i++; return v; }
    var s2 = 1;
    while (e[i] === '+' || e[i] === '-') { if (e[i] === '-') s2 = -s2; i++; }
    var n = '';
    while (i < e.length && /\d/.test(e[i])) n += e[i++];
    return s2 * parseInt(n, 10);
  }
  function produit() { var v = facteur();
    while (e[i] === '*' || e[i] === '/') { var o = e[i++]; var w = facteur(); v = o === '*' ? v*w : v/w; }
    return v; }
  function somme() { var v = produit();
    while (e[i] === '+' || e[i] === '-') { var o = e[i++]; var w = produit(); v = o === '+' ? v+w : v-w; }
    return v; }
  var r = somme();
  return i === e.length ? r : NaN;
}
// « deux symboles à la suite » : le critère du cours, écrit à part
function interdite(s) {
  var e = s.replace(/\s+/g, '');
  return /[+\-−×÷][+\-−]/.test(e.replace(/−/g,'-')) && !/^\(?-/.test(e);
}

var err=[], cpt={}, verdicts={};
function ko(m){ if(err.length<12) err.push(m); }
var CAS=['signe','priorite','melange'];
for (var essai=0; essai<450; essai++) {
  var c = CAS[essai % 3];
  var b = elements.filter(function(e){ return e.tag==='button' && e.dataset.cas===c; })[0];
  b.onclick();
  cpt[c]=(cpt[c]||0)+1;
  var refs=[];
  var expr0 = null, dernierEssai = null, dernierVerdict = null;
  steps.forEach(function (s, k) {
    if (s.step) { s.step(0); s.step(0.5); s.step(1); }
    if (s.after) s.after();
    refs.push(etat());
    if (k === 0) expr0 = txt(ui2._sous['ptn-expr'].innerHTML);
    var ess = txt(ui2._sous['ptn-essai'].innerHTML);
    var ver = txt(ui2._sous['ptn-verdict'].innerHTML);
    // à chaque verdict, on revérifie nous-mêmes
    if (ver && ver !== dernierVerdict + '|' + ess) {
      if (ess) {
        var vrai;
        if (interdite(ess)) vrai = 'INDISPENSABLES';
        else vrai = evalue(ess) === evalue(expr0) ? 'inutiles' : 'INDISPENSABLES';
        var dit = /INDISPENSABLES/.test(ver) ? 'INDISPENSABLES' : 'inutiles';
        verdicts[dit] = (verdicts[dit]||0)+1;
        if (dit !== vrai) ko(c + ' : « ' + expr0 + " » → « " + ess + ' » jugé ' + dit +
                             ' alors que ' + vrai + ' (' + evalue(expr0) + ' vs ' + evalue(ess) + ')');
        // une écriture jugée inutile doit vraiment donner le même nombre
        if (dit === 'inutiles' && evalue(ess) !== evalue(expr0))
          ko(c + ' : « inutiles » alors que le résultat change');
      }
      dernierVerdict = ver;
    }
  });
  // aucun trait d'union du clavier : le vrai signe moins, partout
  var tousTxt = txt(ui2._sous['ptn-etapes'].innerHTML) + ' ' + txt(ui2._sous['ptn-bilan'].innerHTML);
  if (/\d\s*-\s*\d|[\s(]-\d/.test(tousTxt)) ko(c + ' : trait d\'union au lieu du signe − — ' +
    tousTxt.slice(0, 70));
  // aucune parenthèse dont le contenu s'annule
  var e0 = txt(ui2._sous['ptn-expr'].innerHTML).match(/\(([^)]*)\)/g) || [];
  e0.forEach(function (p2) { if (/[−-]/.test(p2.slice(1,-1)) && evalue(p2) === 0)
    ko(c + ' : une parenthèse vaut 0 — ' + p2); });
  // aucune phrase répétée
  var ph = ui2._sous['ptn-etapes'].innerHTML.split('ptn-etape">').slice(1);
  var vus={}; ph.forEach(function(t){ if(vus[t]) ko(c+' : phrase répétée'); vus[t]=1; });
  // rejeu : l'affichage doit être identique
  for (var tour=0; tour<2; tour++) {
    steps.forEach(function (s, i) {
      if (s.step) { s.step(0); s.step(1); }
      if (s.after) s.after();
      if (etat() !== refs[i] && err.length < 12) ko(c + ' : étape ' + i + ' non idempotente');
    });
  }
}
print('cas : ' + JSON.stringify(cpt) + '   verdicts rendus : ' + JSON.stringify(verdicts));
print(err.length ? 'ÉCHECS :\n - '+err.join('\n - ') : 'TOUS LES VERDICTS SONT JUSTES ET LE REJEU EST IDENTIQUE');
