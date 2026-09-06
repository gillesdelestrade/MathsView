/*
 * La leçon « Simplifier une fraction » (6ème).
 *
 * Pour TOUTES les fractions a/b avec 1 ≤ a ≤ b ≤ 20, on rejoue l'animation et
 * on relit la figure : la chaîne des fractions affichées doit aboutir à la
 * fraction irréductible (calculée à part par le pgcd), chaque étape doit
 * diviser les deux termes par un diviseur commun premier, la longueur coloriée
 * doit être la même sur toutes les barres, et le rejeu doit être identique.
 */
load('tests/lecon-simplifier-fractions-decor.js');
var err = []; function ko(m) { if (err.length < 15 && err.indexOf(m) < 0) err.push(m); }
function pgcd(x, y) { while (y) { var t = y; y = x % y; x = t; } return x; }
function premier(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function txt(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

var nb = 0, maxBarres = 0, irreductibles = 0;
for (var b = 1; b <= 20; b++) for (var a = 1; a <= b; a++) {
  fixe(a, b); nb++;
  var g = pgcd(a, b), na = a / g, nbb = b / g;
  var nDiv = steps.length;                       // 2n+1 étapes pour n divisions
  if (nDiv % 2 !== 1) { ko(a + '/' + b + ' : ' + nDiv + ' étapes, il en faut un nombre impair'); continue; }
  var n = (nDiv - 1) / 2;
  if (n === 0) irreductibles++;

  // 1. Au départ : une seule barre, a parts coloriées sur b, rien d'autre.
  joue(0);
  var B = barres();
  if (B.length !== 1 || B[0].parts !== b || B[0].pleines !== a)
    ko(a + '/' + b + ' : au départ, ' + JSON.stringify(B) + ' au lieu d\'une barre ' + a + '/' + b);
  if (textes().indexOf('irréductible') >= 0) ko(a + '/' + b + ' : « irréductible » affiché avant la preuve');

  // 2. Étape par étape : après la division k, k+1 barres, la dernière = fraction divisée.
  var courant = [a, b];
  for (var k = 0; k < n; k++) {
    joue(2 * k + 1);
    if (barres().length !== k + 1) ko(a + '/' + b + ' : chercher un diviseur ne doit pas encore ajouter de barre');
    var ph = txt(panel.innerHTML);
    if (ph.indexOf('Diviseurs de ' + courant[0]) < 0 || ph.indexOf('Diviseurs de ' + courant[1]) < 0)
      ko(a + '/' + b + ' : les diviseurs de ' + courant.join('/') + ' ne sont pas listés');

    joue(2 * k + 2);
    B = barres();
    if (B.length !== k + 2) { ko(a + '/' + b + ' : ' + B.length + ' barres après la division ' + (k + 1)); break; }
    var der = B[B.length - 1];
    var d = courant[1] / der.parts;
    if (d !== Math.round(d) || !premier(d) || courant[0] % d !== 0 || courant[1] % d !== 0)
      ko(a + '/' + b + ' : division ' + (k + 1) + ' par ' + d + ', qui n\'est pas un diviseur commun premier de ' + courant.join('/'));
    if (der.pleines !== courant[0] / d)
      ko(a + '/' + b + ' : après ÷' + d + ', ' + der.pleines + ' parts coloriées au lieu de ' + courant[0] / d);
    if (textes().indexOf('÷' + d) < 0) ko(a + '/' + b + ' : « ÷' + d + ' » n\'est pas écrit sur la figure');
    // la longueur coloriée n'a pas bougé
    B.forEach(function (bar) {
      if (Math.abs(bar.xMax - B[0].xMax) > 1e-9)
        ko(a + '/' + b + ' : la longueur coloriée change d\'une barre à l\'autre (' + bar.xMax + ' vs ' + B[0].xMax + ')');
    });
    courant = [courant[0] / d, courant[1] / d];
  }

  // 3. À la fin : la fraction irréductible, et dit comme tel.
  joue(steps.length);
  if (courant[0] !== na || courant[1] !== nbb)
    ko(a + '/' + b + ' : la chaîne s\'arrête à ' + courant.join('/') + ' au lieu de ' + na + '/' + nbb);
  var T = textes();
  if (T.indexOf('irréductible') < 0) ko(a + '/' + b + ' : « irréductible » absent de la figure à la fin');
  if (T.indexOf(na + '/' + nbb) < 0) ko(a + '/' + b + ' : ' + na + '/' + nbb + ' n\'est pas écrit sur la figure');
  var fin = txt(panel.innerHTML);
  if (fin.indexOf('irréductible') < 0) ko(a + '/' + b + ' : le panneau ne conclut pas à l\'irréductibilité');
  if (fin.indexOf('\\frac{' + na + '}{' + nbb + '}') < 0) ko(a + '/' + b + ' : le panneau n\'écrit pas ' + na + '/' + nbb);
  if (n > 1 && !new RegExp('d\'un coup par\\s*' + g + '\\s*,').test(fin))
    ko(a + '/' + b + ' : le raccourci ÷' + g + ' n\'est pas donné');
  if (n <= 1 && fin.indexOf('Plus court') >= 0) ko(a + '/' + b + ' : un raccourci proposé alors qu\'il n\'y a qu\'une division');
  maxBarres = Math.max(maxBarres, barres().length);

  // 4. Le rejeu est identique (« Précédent » repart du reset).
  var avant = panel.innerHTML;
  joue(steps.length);
  if (panel.innerHTML !== avant) ko(a + '/' + b + ' : rejouer les étapes change le panneau');
  if (barres().length !== n + 1) ko(a + '/' + b + ' : rejouer change le nombre de barres');
}

// La saisie hors bornes est ramenée dans les clous.
fixe(30, 40);
if (inB.value !== '40' && parseInt(inB.value, 10) > 20) ko('un dénominateur > 20 n\'est pas borné');
if (barres()[0].parts !== 20) ko('un dénominateur > 20 devrait être ramené à 20 : ' + barres()[0].parts + ' parts');
fixe(9, 4);
if (barres()[0].pleines !== 4 || barres()[0].parts !== 4) ko('un numérateur > dénominateur n\'est pas ramené au dénominateur');

// Les exemples tout prêts lancent bien leur fraction.
pick.children.forEach(function (btn) {
  btn.onclick();
  joue(0);
  var B0 = barres()[0];
  if (B0.parts !== +btn.dataset.b || B0.pleines !== +btn.dataset.a)
    ko('l\'exemple ' + btn.dataset.a + '/' + btn.dataset.b + ' ne s\'affiche pas');
});

print(nb + ' fractions rejouées, ' + irreductibles + ' déjà irréductibles, jusqu\'à ' + maxBarres + ' barres');
if (err.length) { print('ÉCHECS :'); err.forEach(function (m) { print('  - ' + m); }); }
else print('CHAQUE FRACTION EST SIMPLIFIÉE JUSQU\'À L\'IRRÉDUCTIBLE, SANS BOUGER LA LONGUEUR COLORIÉE');
