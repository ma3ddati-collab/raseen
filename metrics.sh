#!/bin/bash
# Daily metrics snapshot — append to metrics.log
# Setup: (crontab -l 2>/dev/null; echo "0 9 * * * /workspaces/raseen/metrics.sh") | crontab -

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TOKEN_FILE="$SCRIPT_DIR/.metrics-token"
LOG_FILE="$SCRIPT_DIR/metrics.log"

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "ERROR: $TOKEN_FILE not found. Put an ADMIN JWT token in that file." >&2
  exit 1
fi

TOKEN=$(cat "$TOKEN_FILE" | tr -d '[:space:]')
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

RESPONSE=$(curl -sf http://127.0.0.1:4000/metrics/overview \
  -H "Authorization: Bearer $TOKEN") || {
  echo "{\"timestamp\":\"$DATE\",\"error\":\"request failed\"}" >> "$LOG_FILE"
  exit 1
}

echo "$RESPONSE" | jq --arg ts "$DATE" '. + {timestamp: $ts}' >> "$LOG_FILE"
echo "[$DATE] metrics recorded"
