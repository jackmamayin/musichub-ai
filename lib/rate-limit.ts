import { getCloudflareContext } from "@opennextjs/cloudflare";
import { config } from "./config";

const mem = new Map<string, { n: number; until: number }>();

export async function rateLimit(key: string, limit = config.rateLimitPerMinute) {
  try {
    const { env } = getCloudflareContext();
    const kv = (env as any).RATE_LIMIT_KV as any;
    if (kv) {
      const k = `rl:${key}:${Math.floor(Date.now() / 60000)}`;
      const n = Number((await kv.get(k)) || 0) + 1;
      await kv.put(k, String(n), { expirationTtl: 70 });
      return n <= limit;
    }
  } catch {}

  const now = Date.now();
  const x = mem.get(key);
  if (!x || x.until < now) {
    mem.set(key, { n: 1, until: now + 60000 });
    return true;
  }
  x.n++;
  return x.n <= limit;
}
