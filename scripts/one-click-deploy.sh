#!/usr/bin/env bash
set -euo pipefail

: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"
: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}"
: "${DATABASE_URL:?Set DATABASE_URL to your PostgreSQL connection string}"

export CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN DATABASE_URL

npm ci
npm run cf:one-click:check
npm run cf:provision
npm run prisma:generate
npm run cf:build
npx wrangler deploy --config wrangler.jsonc
npx wrangler deploy --config queue-consumer.wrangler.jsonc

echo
echo 'MusicHub AI deployment completed. Configure production secrets and custom domain in Cloudflare if not already configured.'
