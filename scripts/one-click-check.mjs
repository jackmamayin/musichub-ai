import fs from 'node:fs';
import { execSync } from 'node:child_process';

const required = ['wrangler.jsonc','queue-consumer.wrangler.jsonc','open-next.config.ts','prisma/schema.prisma','package.json'];
const missing = required.filter(f => !fs.existsSync(f));
if (missing.length) throw new Error(`Missing required files: ${missing.join(', ')}`);
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.log('Cloudflare auth not present in this shell. That is OK for Deploy-to-Cloudflare; CI requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets.');
}
try { execSync('npx wrangler --version', {stdio:'inherit'}); } catch {}
console.log('MusicHub AI one-click preflight: OK');
