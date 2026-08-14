/* Les erreurs et les garde-fous : chaque script doit s'arrêter avec un message
   FRANÇAIS et une ligne, jamais figer la page ni lâcher une exception JS. */
var window = this;
load('js/python-mini.js');

var CAS = [
  ['while True:\n    x = 1', 'boucle infinie'],
  ['def f(n):\n    return f(n + 1)\nf(0)', 'récursion sans fin'],
  ['print(1 / 0)', 'division par zéro'],
  ['print(5 // 0)', 'division entière par zéro'],
  ['print(5 % 0)', 'reste par zéro'],
  ['print(x)', 'variable non définie'],
  ['print(f(2))', 'fonction non définie'],
  ['if x > 1\n    print(1)', 'deux-points manquant'],
  ['print(1 + )', 'expression incomplète'],
  ['print((1 + 2)', 'parenthèse non fermée'],
  ['print("bonjour)', 'guillemet non fermé'],
  ['x = 1\n  y = 2', 'indentation inattendue'],
  ['def f(x):\nreturn x', 'bloc non indenté'],
  ['class A:\n    pass', 'classe'],
  ['f = lambda x: x', 'lambda'],
  ['print(f"{x}")', 'f-string'],
  ['L = [x for x in range(3)]', 'compréhension'],
  ['d = {"a": 1}', 'dictionnaire'],
  ['a, b = 1, 2', 'tuple'],
  ['print(L[1:3])', 'tranche'],
  ['import numpy', 'module inconnu'],
  ['from math import racine', 'nom absent de math'],
  ['print(1, sep="")', 'argument nommé'],
  ['if 1 = 2:\n    print(1)', 'égal simple dans un test'],
  ['L = [1, 2]\nprint(L[5])', 'indice hors liste'],
  ['print("a" + 1)', 'chaîne + nombre'],
  ['print(len(3))', 'len sur un nombre'],
  ['for i in 5:\n    print(i)', 'boucle sur un nombre'],
  ['print(range(1.5))', 'range décimal'],
  ['def f(x):\n    return x\nprint(f(1, 2))', 'trop d\'arguments'],
  ['return 3', 'return hors fonction'],
  ['break', 'break hors boucle'],
  ['print(2 ** 5000)', 'entier trop grand'],
  ['import math\nprint(math.sqrt(-1))', 'racine d\'un négatif'],
  ['x = 1\n\tif x:\n\t\tprint(x)', 'tabulations'],
  ['print(3 @ 4)', 'caractère inconnu']
];

var ko = [];
var t0 = Date.now ? 0 : 0;
CAS.forEach(function (c) {
  var r;
  try { r = MathsPython.executer(c[0]); }
  catch (e) { ko.push(c[1] + ' → exception JS non rattrapée : ' + e); return; }
  if (!r.erreur) { ko.push(c[1] + ' → aucune erreur signalée'); return; }
  var m = MathsPython.messageErreur(r.erreur);
  if (/undefined|null|\[object|NaN/.test(m)) ko.push(c[1] + ' → message bancal : ' + m);
  if (m.length < 15) ko.push(c[1] + ' → message trop court : ' + m);
  print('  ' + (c[1] + '                         ').slice(0, 26) + m);
});

// la sortie déjà produite avant l'erreur doit être conservée
var r2 = MathsPython.executer('print("avant")\nprint(1/0)');
if (r2.lignes.length !== 1 || r2.lignes[0] !== 'avant')
  ko.push('la sortie produite avant l\'erreur est perdue');

// le plafond de lignes
var r3 = MathsPython.executer('for i in range(100000):\n    print(i)');
if (!r3.tronque) ko.push('la sortie n\'est pas tronquée');
if (r3.lignes.length > 3000) ko.push('plus de 3000 lignes conservées');

print('');
if (ko.length) { print('ÉCHECS :'); ko.forEach(function (m) { print('  - ' + m); }); }
else print('TOUTES LES ERREURS SONT CLAIRES ET RATTRAPÉES');
