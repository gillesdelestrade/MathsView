/* Le mode « pas à pas » rejoue les étapes précédentes après un reset : on
   simule ce va-et-vient et on vérifie que l'affichage est IDENTIQUE. */
load('tests/site-pas-a-pas-decor.js');
var ui2 = extras.children[0];
function etat() {
  return ['som-calcul','som-recap','som-etapes','som-posewrap','som-final']
    .map(function (c) { return ui2._sous[c].innerHTML; }).join('§');
}
var err = [];
['meme','contraire','moins','plusieurs'].forEach(function (cas) {
  for (var essai = 0; essai < 40; essai++) {
    var b = elements.filter(function (e) { return e.tag === 'button' && e.dataset.cas === cas; })[0];
    b.onclick();
    var refs = [];
    steps.forEach(function (s) { if (s.step) s.step(1); if (s.after) s.after(); refs.push(etat()); });
    // on rembobine (comme « Précédent » : reset puis rejeu rapide) plusieurs fois
    for (var tour = 0; tour < 3; tour++) {
      steps.forEach(function (s, i) {
        if (s.step) { s.step(0); s.step(0.5); s.step(1); }
        if (s.after) s.after();
        if (etat() !== refs[i] && err.length < 6) {
          err.push(cas + ' : l\'étape ' + i + ' ne redonne pas le même affichage au rejeu');
        }
      });
    }
  }
});
print(err.length ? 'ÉCHECS :\n - ' + err.join('\n - ')
                 : 'REJEU IDENTIQUE : les étapes sont idempotentes (4 cas × 40 tirages × 4 passages)');
