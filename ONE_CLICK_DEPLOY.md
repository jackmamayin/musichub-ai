# MusicHub AI v1.0 — One-Click Deploy Pack

This release packages three deployment paths:

1. **Deploy to Cloudflare button** — recommended for first deployment from a public GitHub/GitLab repo.
2. **Cloudflare Workers Builds** — automatic deployment on pushes to `main`.
3. **API-token one-command deployment** — `./scripts/one-click-deploy.sh`.

Cloudflare's current Deploy to Cloudflare flow can clone a public Git repository, provision supported resources from Wrangler configuration, configure Workers Builds, and deploy the Worker. Supported resources include KV, R2, Hyperdrive and Queues.

### Important

A deployment package cannot safely contain your PostgreSQL, Stripe, ElevenLabs, Resend or Cloudflare credentials. These must be supplied through Cloudflare Secrets / deployment secrets.

For CI, use `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub repository secrets. Do not put the token in source code.
