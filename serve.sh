#!/usr/bin/env bash
# Lance le site MathsView en local, avec son stockage, sur http://localhost:8000
cd "$(dirname "$0")"
exec python3 serveur/dev.py
