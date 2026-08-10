#!/bin/bash
#
# Déploiement : aligne le Pi sur origin/main. Appelé par cron chaque minute.
#   sudo crontab -e
#   * * * * * /var/www/mathsview/deploy/pull.sh >> /var/log/mathsview-deploy.log 2>&1
#
# Le dépôt est un miroir : toute modification faite sur le Pi est écrasée.
# La progression des enfants, elle, n'est pas dans le dépôt (/var/lib/mathsview).
set -u
DEPOT=${DEPOT:-/var/www/mathsview}

cd "$DEPOT" || exit 1
git fetch --quiet origin main || exit 0        # pas de réseau : on repassera

LOCAL=$(git rev-parse HEAD)
DISTANT=$(git rev-parse origin/main)
[ "$LOCAL" = "$DISTANT" ] && exit 0

MODIFIES=$(git diff --name-only "$LOCAL" "$DISTANT")
git reset --hard --quiet "$DISTANT" || exit 1
echo "$(date '+%F %T')  déployé $(git rev-parse --short HEAD)"

# Le code du service ne se recharge pas tout seul.
if echo "$MODIFIES" | grep -q '^serveur/'; then
    systemctl restart mathsview-api && echo "$(date '+%F %T')  service redémarré"
fi
