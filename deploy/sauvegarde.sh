#!/bin/bash
#
# Sauvegarde quotidienne de la progression.
#   sudo crontab -e
#   17 3 * * * /var/www/mathsview/deploy/sauvegarde.sh >> /var/log/mathsview-deploy.log 2>&1
#
# La progression ne vit plus que sur ce Pi : sa carte SD est désormais le seul
# point de panne du projet. Cette copie protège d'une base corrompue ou d'une
# fausse manœuvre — PAS d'une carte morte. Copie régulièrement /var/backups/
# ailleurs (le bouton « Sauvegarder » d'admin.html reste, lui aussi, valable).
set -u
BASE=${BASE:-/var/lib/mathsview/mathsview.sqlite3}
DEST=${DEST:-/var/backups/mathsview}
GARDE=${GARDE:-30}          # jours

[ -f "$BASE" ] || { echo "$(date '+%F %T')  base introuvable : $BASE"; exit 1; }
mkdir -p "$DEST" || exit 1
NOM="$DEST/progression-$(date +%F).sqlite3"

# .backup plutôt que cp : cohérent même si un enfant travaille en ce moment.
python3 - "$BASE" "$NOM" <<'PY' || exit 1
import sqlite3, sys
src = sqlite3.connect('file:%s?mode=ro' % sys.argv[1], uri=True)
dst = sqlite3.connect(sys.argv[2])
with dst:
    src.backup(dst)
dst.close(); src.close()
PY

gzip -f "$NOM"
find "$DEST" -name 'progression-*.sqlite3.gz' -mtime +"$GARDE" -delete
echo "$(date '+%F %T')  sauvegardé $NOM.gz ($(du -h "$NOM.gz" | cut -f1))"
