#!/usr/bin/env bash
# Deploy the latest pushed commit on origin/main to the production server.
# Usage: ./deploy.sh
set -euo pipefail

SERVER_USER="root"
SERVER_HOST="172.237.120.80"
REMOTE_DIR="/root/digitalworld"
HEALTH_URL="http://172.237.120.80:3333/"

echo "==> Deploying to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}"

ssh "${SERVER_USER}@${SERVER_HOST}" bash -s <<EOF
set -euo pipefail
cd "${REMOTE_DIR}"

echo "==> Fetching latest from origin/main"
git fetch origin
git reset --hard origin/main

echo "==> Rebuilding and restarting container"
docker compose up -d --build
EOF

echo "==> Waiting for the app to come back up"
for i in $(seq 1 15); do
  if curl -s -o /dev/null -w "" "${HEALTH_URL}" 2>/dev/null; then
    code=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}")
    if [ "$code" = "200" ]; then
      echo "==> Deploy complete. ${HEALTH_URL} responded 200."
      exit 0
    fi
  fi
  sleep 2
done

echo "==> Warning: ${HEALTH_URL} did not return 200 after waiting. Check 'docker compose logs -f web' on the server."
exit 1
