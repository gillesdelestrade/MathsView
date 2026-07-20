#!/usr/bin/env bash
# Lance le site MathsView en local sur http://localhost:8000
cd "$(dirname "$0")"
echo "MathsView en ligne sur  →  http://localhost:8000"
echo "(Ctrl+C pour arrêter)"
python3 -m http.server 8000
