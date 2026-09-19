import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type AnyDb = PrismaClient;
const g = globalThis as unknown as { dbByConnection?: Map<string, AnyDb> };
const dbByConnection = g.dbByConnection ?? new Map<string, AnyDb>();
g.dbByConnection = dbByConnection;

function connectionString(): string {
  try {
    const { env } = getCloudflareContext();
    const hd = (env as any).HYPERDRIVE;
    if (hd?.connectionString) return hd.connectionString;
  } catch {
    // Local Node/CLI context: use DATABASE_URL.
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL or HYPERDRIVE binding is required");
  return url;
}

function getClient(): AnyDb {
  const url = connectionString();
  const cached = dbByConnection.get(url);
  if (cached) return cached;
  const adapter = new PrismaPg({ connectionString: url });
  const client = new PrismaClient({ adapter, log: ["error"] });
  dbByConnection.set(url, client);
  return client;
}

// Defer Cloudflare binding lookup until a request actually touches Prisma.
// This is important because HYPERDRIVE is a Worker runtime binding, not a build-time env var.
export const db = new Proxy({} as AnyDb, {
  get(_target, prop, receiver) {
    const client = getClient() as any;
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
