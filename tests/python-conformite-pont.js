// Exécute UN script (lu sur l'entrée via la variable SRC) et imprime sa sortie.
var window = this;
load('js/python-mini.js');
var r = MathsPython.executer(SRC);
if (r.erreur) { print('@@ERREUR@@ ' + MathsPython.messageErreur(r.erreur)); }
else { print(r.lignes.join('\n')); }
