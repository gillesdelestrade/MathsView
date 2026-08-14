#!/usr/bin/env python3
"""Le mini-Python dit-il exactement la même chose que le vrai ?

js/python-mini.js n'a d'intérêt que s'il ne ment jamais : un élève qui tape le
même script sur sa calculatrice doit voir la même sortie, au caractère près.
On ne peut pas le vérifier « à l'œil » — c'est justement là que se cachent les
pièges (7/2, -7//2, -2**2, round(2.5), l'écriture des flottants).

Ce script prend donc chaque programme de python-conformite-cas.py, le fait
tourner deux fois — par le python3 de la machine, puis par le mini-interpréteur —
et compare les deux sorties. Un écart est un défaut du mini-interpréteur.

Les programmes volontairement fautifs doivent échouer des DEUX côtés : c'est
compté à part, et le message du mini est affiché pour qu'on puisse le relire.
"""
import json
import os
import subprocess
import sys
import tempfile

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(ICI)
JSC = ("/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/"
       "Helpers/jsc")

if not os.path.exists(JSC):
    print("jsc est introuvable : ce contrôle a besoin de JavaScriptCore (macOS).")
    sys.exit(2)

src = open(os.path.join(ICI, "python-conformite-cas.py"), encoding="utf-8").read()
pont = open(os.path.join(ICI, "python-conformite-pont.js"), encoding="utf-8").read()
cas = [c.strip("\n") for c in src.split("#====#")]

ecarts, communes, ok = [], 0, 0
with tempfile.TemporaryDirectory() as tmp:
    for i, c in enumerate(cas):
        if not c.strip():
            continue
        vrai = subprocess.run([sys.executable, "-c", c],
                              capture_output=True, text=True)
        py_ok, py_out = (vrai.returncode == 0), vrai.stdout.rstrip("\n")

        f = os.path.join(tmp, "cas.js")
        open(f, "w", encoding="utf-8").write(
            "var SRC = " + json.dumps(c) + ";\n" + pont)
        mini = subprocess.run([JSC, f], capture_output=True, text=True, cwd=DEPOT)
        mo = mini.stdout.rstrip("\n")
        mini_ok = not mo.startswith("@@ERREUR@@")

        if py_ok and mini_ok:
            if py_out == mo:
                ok += 1
            else:
                ecarts.append((i, c, py_out, mo))
        elif not py_ok and not mini_ok:
            communes += 1
            print("  (erreur des deux côtés) " + mo.replace("@@ERREUR@@ ", ""))
        else:
            ecarts.append((i, c, "OK: " + py_out if py_ok else "ERREUR python", mo))

print("%d cas identiques au vrai Python, %d erreurs des deux côtés, %d écarts"
      % (ok, communes, len(ecarts)))
for i, c, a, b in ecarts:
    print("\n--- écart, cas %d ---\n%s\n  python3 → %r\n  mini    → %r"
          % (i, c, a, b))
sys.exit(1 if ecarts else 0)
