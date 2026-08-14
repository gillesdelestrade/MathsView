/* L'invariant qui compte : le script produit par scriptPython(), EXÉCUTÉ, doit
   afficher exactement le tableau annoncé par tableauPython(). Si les deux
   divergent, l'exercice poserait des questions sur un tableau que l'élève ne
   verrait jamais. On le vérifie pour chaque fonction, chaque pas, chaque
   jeu de paramètres. */
var window = this;
var MathsView = { fonctions: null, register: function () {} };
window.MathsView = MathsView;
load('js/fonctions-base.js');
load('js/python-mini.js');
var POOL = MathsView.fonctions;

var err = [], nb = 0;
function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }

function frPy(v) {          // ce que print écrit pour cette valeur
  if (Number.isInteger(v) && String(v).indexOf('e') < 0) return String(v);
  return String(v);
}

POOL.liste().forEach(function (fn) {
  var jeux = [POOL.defauts(fn)];
  if (fn.params) {
    jeux.push({ a: -1.5, b: 3 }, { a: 0, b: 2 }, { a: 3, b: -5 }, { a: 1, b: 0 });
  }
  jeux.forEach(function (par) {
    [{ x1: -5, x2: 5, den: 1 }, { x1: -5, x2: 5, den: 2 },
     { x1: -3, x2: 3, den: 10 }, { x1: 0, x2: 4, den: 1 }].forEach(function (o) {
      nb++;
      var src = POOL.scriptPython(fn, par, o);
      var r = MathsPython.executer(src);
      if (r.erreur) {
        ko(fn.key + ' (pas 1/' + o.den + ') : le script ne tourne pas — ' +
           MathsPython.messageErreur(r.erreur) + '\n' + src);
        return;
      }
      var attendu = POOL.tableauPython(fn, par, o);
      if (r.lignes.length !== attendu.length) {
        ko(fn.key + ' (pas 1/' + o.den + ') : ' + r.lignes.length + ' lignes affichées ' +
           'contre ' + attendu.length + ' annoncées');
        return;
      }
      // chaque ligne « x y » doit redonner le couple annoncé
      for (var i = 0; i < attendu.length; i++) {
        var m = r.lignes[i].split(' ');
        var x = parseFloat(m[0]), y = parseFloat(m[1]);
        if (Math.abs(x - attendu[i].x) > 1e-9)
          { ko(fn.key + ' : x affiché ' + m[0] + ' ≠ ' + attendu[i].x); break; }
        if (Math.abs(y - attendu[i].y) > 1e-9)
          { ko(fn.key + ' (pas 1/' + o.den + ') : pour x = ' + m[0] + ', le script affiche ' +
               m[1] + ' alors que le tableau annonce ' + attendu[i].y); break; }
      }
      // et le domaine doit être respecté : aucune ligne interdite
      POOL.grille(fn, par, o).forEach(function () {});
      if (fn.trous) {
        fn.trous.forEach(function (t) {
          r.lignes.forEach(function (L) {
            if (Math.abs(parseFloat(L.split(' ')[0]) - t) < 1e-9)
              ko(fn.key + ' : le script affiche une valeur interdite (x = ' + t + ')');
          });
        });
      }
    });
  });
});

print(nb + ' scripts exécutés');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE SCRIPT AFFICHE EXACTEMENT LE TABLEAU ANNONCÉ');
