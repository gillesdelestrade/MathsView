#!/bin/sh
#
# Lance les contrôles de MathsView.
#
#   ./tests/lancer.sh              tout
#   ./tests/lancer.sh compas       seulement ceux dont le nom contient « compas »
#   ./tests/lancer.sh lecon        toutes les leçons
#
# Rien à installer : les contrôles tournent sous `jsc`, le moteur JavaScript
# livré avec macOS, et le seul autre outil demandé est le python3 du système —
# et seulement pour python-conformite.py, qui confronte notre mini-interpréteur
# au vrai Python.
#
# Un contrôle est considéré en ÉCHEC si sa sortie contient le mot « ÉCHEC » ou
# une exception JavaScript. C'est la convention que suivent tous les fichiers de
# ce dossier : ils décrivent ce qu'ils ont vérifié, puis concluent.
#
# Les contrôles s'exécutent depuis la RACINE du dépôt : c'est de là qu'ils
# chargent js/, exos/ et lessons/, exactement comme le fait le navigateur.

set -u

RACINE=$(cd "$(dirname "$0")/.." && pwd)
cd "$RACINE" || exit 2

JSC="/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc"
if [ ! -x "$JSC" ]; then
  echo "jsc est introuvable."
  echo "Ces contrôles ont besoin de JavaScriptCore, livré avec macOS."
  exit 2
fi

FILTRE=${1:-}
TOTAL=0
RATES=0
NOMS_RATES=""

verdict() {           # $1 = nom, $2 = sortie, $3 = code de retour
  TOTAL=$((TOTAL + 1))
  derniere=$(printf '%s\n' "$2" | grep -v '^[[:space:]]*$' | tail -1)
  # -E partout : le sed et le grep de macOS ne connaissent pas le « \| » de GNU
  if printf '%s' "$2" | grep -qE 'ÉCHEC|Exception:' || [ "$3" -ne 0 ]; then
    RATES=$((RATES + 1))
    NOMS_RATES="$NOMS_RATES $1"
    printf '  ✗ %-34s\n' "$1"
    # en cas d'échec, on montre le détail : c'est ce qu'on veut lire
    printf '%s\n' "$2" | sed -n -E '/ÉCHEC|Exception:/,$p' | head -20 | sed 's/^/      /'
  else
    printf '  ✓ %-34s %s\n' "$1" "$derniere"
  fi
}

echo "MathsView — contrôles"
echo

# Le chargement d'abord : si la page n'enregistre pas ses générateurs, tout le
# reste ne dit plus grand-chose.
VUS=" "
# `tests/*.js` ferme la marche : un contrôle dont le nom ne colle à aucun motif
# ne serait jamais lancé, et un contrôle qui ne tourne pas est pire que pas de
# contrôle du tout — il donne l'illusion d'une vérification. Les motifs qui
# précèdent ne servent donc plus qu'à fixer l'ORDRE de passage.
for f in tests/site-chargement.js tests/site-*.js tests/python-*.js \
         tests/lecon-*.js tests/exos-*.js tests/*.js; do
  [ -f "$f" ] || continue
  nom=$(basename "$f" .js)
  # les fichiers « -decor » et « -pont » sont des accessoires, pas des contrôles
  case "$nom" in *-decor|*-pont) continue ;; esac
  # site-chargement est nommé deux fois pour passer en premier : on ne le
  # rejoue pas quand le motif tests/site-*.js le ramène
  case "$VUS" in *" $nom "*) continue ;; esac
  VUS="$VUS$nom "
  if [ -n "$FILTRE" ]; then
    printf '%s' "$nom" | grep -q "$FILTRE" || continue
  fi
  sortie=$("$JSC" "$f" 2>&1); code=$?
  verdict "$nom" "$sortie" "$code"
done

# La confrontation au vrai Python, qui a besoin de python3.
nom="python-conformite"
if [ -z "$FILTRE" ] || printf '%s' "$nom" | grep -q "$FILTRE"; then
  if command -v python3 > /dev/null 2>&1; then
    sortie=$(python3 tests/python-conformite.py 2>&1); code=$?
    verdict "$nom" "$sortie" "$code"
  else
    echo "  — $nom (ignoré : python3 est absent)"
  fi
fi

echo
[ "$TOTAL" -gt 1 ] && S="s" || S=""
if [ "$RATES" -eq 0 ]; then
  echo "$TOTAL contrôle$S, tous passés."
  exit 0
fi
echo "$TOTAL contrôle$S, $RATES en échec :$NOMS_RATES"
exit 1
