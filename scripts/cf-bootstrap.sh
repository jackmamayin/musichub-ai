#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to the PostgreSQL origin connection string first}"

if [[ "${DATABASE_URL}" == *"CHANGE_ME"* ]]; then
  echo "DATABASE_URL still contains CHANGE_ME" >&2
  exit 1
fi

echo "==> Creating Hyperdrive (if needed)"
npx wrangler hyperdrive create musichub-db --connection-string="$DATABASE_URL" || true

echo
cat <<'TXT'
Next steps:
1. Put the returned Hyperdrive ID into wrangler.jsonc.
2. Create RATE_LIMIT_KV and put its ID into wrangler.jsonc.
3. Create musichub-generation and musichub-generation-dlq queues.
4. Create the two R2 buckets if they do not exist.
5. Add Cloudflare secrets.
6. Run: npm run prisma:generate && npx prisma migrate deploy
7. Run: npm run cf:deploy:all
TXT
