# MusicHub AI v0.9 — Cloudflare Native Database Edition

v0.9 completes the Cloudflare-native data path by adding **Hyperdrive + Prisma driver adapters** on top of the v0.8 Workers + Queues + R2 + KV architecture.

## Architecture

```text
Browser
  -> Cloudflare Worker / OpenNext
      -> Prisma Client + @prisma/adapter-pg
          -> Cloudflare Hyperdrive
              -> PostgreSQL
      -> Cloudflare Queues
          -> generation consumer
              -> internal Worker service binding
                  -> AI provider
                  -> R2
```

Cloudflare documents Hyperdrive as the recommended way for Workers to access existing PostgreSQL/MySQL databases, and its Prisma integration uses `pg` + `@prisma/adapter-pg`. The application keeps `DATABASE_URL` for local development and automatically uses the `HYPERDRIVE` binding when running on Workers.

## One-time setup

### 1. PostgreSQL

Keep your existing PostgreSQL database. It can be hosted by a managed provider or self-hosted.

### 2. Create Hyperdrive

Set `DATABASE_URL` locally to the origin PostgreSQL URL, then run:

```bash
npx wrangler hyperdrive create musichub-db --connection-string="$DATABASE_URL"
```

Copy the returned ID into `wrangler.jsonc`:

```jsonc
"hyperdrive": [
  { "binding": "HYPERDRIVE", "id": "YOUR_HYPERDRIVE_ID" }
]
```

Do not commit the PostgreSQL password to Git.

### 3. Prisma migration

Run migrations against the origin database from a trusted Node environment:

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run seed
```

Hyperdrive is for runtime access; Prisma migrations should run against the origin database connection.

### 4. Cloudflare resources

Create or use:

- R2 `musichub-audio`
- R2 `musichub-next-cache`
- KV namespace `RATE_LIMIT_KV`
- Queue `musichub-generation`
- Queue `musichub-generation-dlq`
- Hyperdrive `musichub-db`

Wrangler can also automatically provision supported resource bindings in supported configurations; for production, explicitly creating resources and pinning IDs is recommended.

### 5. Secrets

Configure production secrets:

```bash
npx wrangler secret put INTERNAL_QUEUE_SECRET
npx wrangler secret put ELEVENLABS_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put RESEND_API_KEY
```

Configure the remaining application variables in Cloudflare.

## Deploy

```bash
npm install
npm run prisma:generate
npm run cf:build
npm run cf:deploy
npm run cf:consumer:deploy
```

Or:

```bash
npm run cf:deploy:all
```

## GitHub one-click CI/CD

Connect the repository to Cloudflare Workers Builds. Every push can trigger a build/deploy, with preview deployments for pull requests.

## Important production notes

1. Keep `DATABASE_URL` out of the Worker runtime in production when using Hyperdrive. It is used for local development/migrations.
2. Set a sensible Hyperdrive origin connection limit below the PostgreSQL provider's connection limit.
3. Keep `INTERNAL_QUEUE_SECRET` identical between the app Worker and queue consumer.
4. Use Cloudflare Secrets for provider/API credentials.
5. Keep Prisma migrations in CI or a controlled deployment job; do not run `prisma migrate dev` inside the Worker.
