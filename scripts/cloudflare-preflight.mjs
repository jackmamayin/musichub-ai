import fs from "node:fs";
const required=["wrangler.jsonc","open-next.config.ts","package.json","prisma/schema.prisma"];
const missing=required.filter(x=>!fs.existsSync(x));
if(missing.length){console.error("Missing Cloudflare files:",missing.join(", "));process.exit(1)}
const w=fs.readFileSync("wrangler.jsonc","utf8");
for(const key of ["HYPERDRIVE","MUSICHUB_AUDIO","RATE_LIMIT_KV","MUSICHUB_ANALYTICS","MUSIC_GENERATION_QUEUE"]){if(!w.includes(key)) console.warn(`Warning: binding ${key} not found in wrangler.jsonc`)}
console.log("MusicHub AI v1.0 Cloudflare preflight OK");
