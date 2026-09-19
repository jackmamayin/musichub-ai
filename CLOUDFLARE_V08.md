# MusicHub AI v0.8 — Cloudflare Native Queue Edition

v0.8 removes BullMQ/Redis from the generation path and uses Cloudflare Queues for asynchronous generation. Audio writes use the native R2 binding. Login/generation rate limiting uses Workers KV.

## Architecture

Next.js/OpenNext Worker -> Cloudflare Queue -> generation consumer Worker -> internal generation endpoint -> AI provider -> R2 -> PostgreSQL

Cloudflare officially supports Queue producer/consumer bindings and retries/DLQ. R2 is directly accessible from Workers through an R2 binding. OpenNext exposes bindings through `getCloudflareContext`.

## One-time Cloudflare setup

1. Create the rate-limit KV namespace:

```bash
npx wrangler kv namespace create RATE_LIMIT_KV
```

Put the returned id into `wrangler.jsonc` replacing `REPLACE_WITH_KV_NAMESPACE_ID`.

2. Create the generation queue and DLQ:

```bash
npx wrangler queues create musichub-generation
npx wrangler queues create musichub-generation-dlq
```

3. Create the R2 buckets if they do not exist:

```bash
npx wrangler r2 bucket create musichub-audio
npx wrangler r2 bucket create musichub-next-cache
```

4. Set the queue secret:

```bash
npx wrangler secret put INTERNAL_QUEUE_SECRET
```

Use the same secret for the main Worker and the consumer Worker.

5. Configure the remaining secrets/vars from `.env.example` in the Cloudflare dashboard or with Wrangler. Keep Stripe, ElevenLabs, Resend and database credentials as secrets.

## PostgreSQL

For production Cloudflare deployments, use Hyperdrive with your existing PostgreSQL database. The existing Prisma schema is retained. Configure a Hyperdrive binding named `HYPERDRIVE` if you migrate the DB adapter to the Hyperdrive/Prisma driver-adapter path.

## Deploy

```bash
npm install
npm run cf:typegen
npm run cf:build
npm run cf:deploy
npm run cf:consumer:deploy
```

Or:

```bash
npm run cf:deploy:all
```

## Important

The queue consumer calls the main Worker through a service binding. The generation processor endpoint is protected by `INTERNAL_QUEUE_SECRET` and is not intended for public access.

Cloudflare's current documentation recommends vinext for new Next.js Workers apps, while OpenNext remains the documented migration path for existing OpenNext applications. v0.8 keeps OpenNext to minimize migration risk from v0.7.
