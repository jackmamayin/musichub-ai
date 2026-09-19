# MusicHub AI FINAL12 — Cloudflare Deploy

## Workers Builds

Root directory:

`/`

Build command:

`npm run cf:build`

Deploy command:

`npm run deploy`

Recommended Build variable:

`SKIP_DEPENDENCY_INSTALL=1`

FINAL12 intentionally does not ship a package-lock.json because the previous lock was incomplete and caused `npm clean-install` / `npm ci` to fail before the build step. FINAL12 installs dependencies explicitly with npm and does not write a lockfile in the build environment.

## Hyperdrive

Set `HYPERDRIVE_ID` as a build variable when you already have the production Hyperdrive ID.

Otherwise the deploy script will look for a Hyperdrive named `musichub-db`; if none exists and `DATABASE_URL` is available, it attempts to create it.


FINAL13 IMPORTANT: Workers Builds Build command should be `npm run build` (which now runs OpenNext directly) OR `npm run cf:build`. Deploy command must be `npm run deploy` so Hyperdrive resolution runs before deployment. Do not use plain `npx wrangler deploy` for production because this bypasses the project Hyperdrive bootstrap script.
