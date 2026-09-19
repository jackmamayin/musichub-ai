interface CloudflareEnv {
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  MUSICHUB_AUDIO: R2Bucket;
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
  MUSIC_GENERATION_QUEUE: Queue;
  RATE_LIMIT_KV: KVNamespace;
  HYPERDRIVE: Hyperdrive;
  CLOUDFLARE_DEPLOYMENT: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_SITE_NAME: string;
  ELEVENLABS_API_KEY: string;
  ELEVENLABS_MODEL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  ADMIN_EMAIL: string;
}
