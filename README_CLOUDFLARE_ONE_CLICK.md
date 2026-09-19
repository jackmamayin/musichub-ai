# MusicHub AI — One-Click Cloudflare Deployment

## Fastest path

1. Put this repository on a **public GitHub or GitLab repository**.
2. Open the repository's Deploy to Cloudflare button from `README.md`.
3. Cloudflare clones the repo, provisions supported resources from `wrangler.jsonc`, configures Workers Builds, and deploys.
4. Enter the requested external-service secrets (ElevenLabs, Stripe, Resend, etc.).
5. Provide your PostgreSQL connection for Hyperdrive if the setup page requests it.

Cloudflare's Deploy to Cloudflare flow can automatically provision supported resources such as KV, R2, Hyperdrive and Queues based on the Wrangler configuration.

## API-token one-command path

For a fully non-interactive deployment from your own machine or CI:

```bash
export CLOUDFLARE_ACCOUNT_ID='...'
export CLOUDFLARE_API_TOKEN='...'
export DATABASE_URL='postgresql://...'
./scripts/one-click-deploy.sh
```

Never commit the token. For GitHub Actions, store `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as repository secrets.

## What gets deployed

- Next.js/OpenNext Worker
- Queue consumer Worker
- R2 audio bucket
- R2 Next cache bucket
- KV rate-limit namespace
- Music generation Queue + DLQ
- Hyperdrive PostgreSQL connection
- Observability/Analytics bindings from `wrangler.jsonc`

## External services still require your own credentials

- ElevenLabs API key
- Stripe secret + webhook secret + price IDs
- Resend API key
- PostgreSQL connection string

The package deliberately does not contain or request your secrets in source control.
