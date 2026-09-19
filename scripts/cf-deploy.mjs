import fs from "node:fs";
import { execFileSync } from "node:child_process";

const CONFIG = "wrangler.jsonc";
const HYPERDRIVE_NAME = "musichub-db";

function run(args, options = {}) {
  console.log(`$ npx wrangler ${args.join(" ")}`);
  return execFileSync("npx", ["wrangler", ...args], {
    stdio: "pipe",
    encoding: "utf8",
    env: process.env,
    ...options,
  });
}

function findId(text) {
  const match = text.match(/[0-9a-f]{32}/i);
  return match?.[0] ?? null;
}

function getExistingHyperdriveId() {
  try {
    const out = run(["hyperdrive", "list"]);
    const lines = out.split(/\r?\n/);
    for (const line of lines) {
      if (line.toLowerCase().includes(HYPERDRIVE_NAME.toLowerCase())) {
        const id = findId(line);
        if (id) return id;
      }
    }
  } catch (error) {
    const stdout = error?.stdout?.toString?.() ?? "";
    const stderr = error?.stderr?.toString?.() ?? "";
    const combined = `${stdout}\n${stderr}`;
    const lines = combined.split(/\r?\n/);
    for (const line of lines) {
      if (line.toLowerCase().includes(HYPERDRIVE_NAME.toLowerCase())) {
        const id = findId(line);
        if (id) return id;
      }
    }
  }
  return null;
}

function ensureHyperdriveId() {
  if (process.env.HYPERDRIVE_ID) return process.env.HYPERDRIVE_ID;

  const existing = getExistingHyperdriveId();
  if (existing) {
    console.log(`Found existing Hyperdrive ${HYPERDRIVE_NAME}: ${existing}`);
    return existing;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "HYPERDRIVE_ID is not set and no existing musichub-db Hyperdrive was found. " +
      "Set HYPERDRIVE_ID in Cloudflare, or set DATABASE_URL so the deploy can create the Hyperdrive."
    );
  }

  console.log(`Creating Hyperdrive ${HYPERDRIVE_NAME} from DATABASE_URL...`);
  const out = run([
    "hyperdrive",
    "create",
    HYPERDRIVE_NAME,
    `--connection-string=${process.env.DATABASE_URL}`,
  ]);
  const id = findId(out);
  if (!id) {
    throw new Error(`Hyperdrive was created but its ID could not be parsed from Wrangler output:\n${out}`);
  }
  return id;
}

function patchConfig(id) {
  const source = fs.readFileSync(CONFIG, "utf8");
  const parsed = JSON.parse(source);
  if (!Array.isArray(parsed.hyperdrive) || !parsed.hyperdrive[0]) {
    throw new Error("wrangler.jsonc is missing the HYPERDRIVE binding.");
  }
  parsed.hyperdrive[0].id = id;
  if (!parsed.hyperdrive[0].localConnectionString) {
    parsed.hyperdrive[0].localConnectionString = "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
  }
  fs.writeFileSync(CONFIG, `${JSON.stringify(parsed, null, 2)}\n`);
  console.log(`Using Hyperdrive ID ${id} in ${CONFIG}`);
}

const id = ensureHyperdriveId();
patchConfig(id);

run(["opennextjs-cloudflare", "deploy"], { stdio: "inherit" });
run(["deploy", "--config", "queue-consumer.wrangler.jsonc"], { stdio: "inherit" });

console.log("MusicHub AI main Worker and generation consumer deployed successfully.");
