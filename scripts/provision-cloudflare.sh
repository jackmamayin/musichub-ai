#!/usr/bin/env bash
set -euo pipefail

command -v npx >/dev/null || { echo 'Node.js/npm is required.' >&2; exit 1; }
: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"
: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}"
: "${DATABASE_URL:?Set DATABASE_URL to your PostgreSQL connection string}"

export CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN

npx wrangler r2 bucket create musichub-audio || true
npx wrangler r2 bucket create musichub-next-cache || true
npx wrangler kv namespace create RATE_LIMIT_KV || true
npx wrangler queues create musichub-generation || true
npx wrangler queues create musichub-generation-dlq || true

if [[ -z "${HYPERDRIVE_ID:-}" ]]; then
  echo 'Creating Hyperdrive connection...'
  npx wrangler hyperdrive create musichub-db --connection-string="$DATABASE_URL" || true
  echo 'If Hyperdrive already exists, set HYPERDRIVE_ID manually in your environment/config.'
fi

echo
printf '%s\n' 'Cloudflare resources requested/provisioned. Review wrangler.jsonc bindings before production deploy.'
