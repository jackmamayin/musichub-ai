# Cloudflare Workers Builds — MusicHub AI FINAL12

## Dashboard settings

Set exactly:

- Root directory: `/`
- Build command: `npm run cf:build`
- Deploy command: `npm run deploy`

Do not use `npm run build` as the Deploy command. `npm run build` only builds Next.js.

## Dependency installation — FINAL12 fix

The previous FINAL11 package-lock.json was invalid/incomplete and caused Cloudflare to run `npm clean-install` / `npm ci`, which failed with `EUSAGE` and many `Missing: ... from lock file` errors.

FINAL12 removes the invalid `package-lock.json` and deliberately installs dependencies with:

`npm install --no-package-lock --no-audit --no-fund`

Recommended Cloudflare Build variable:

`SKIP_DEPENDENCY_INSTALL=1`

This prevents Workers Builds from doing its automatic dependency install. The `cf:build` script then performs the npm install explicitly before Prisma/OpenNext.

Cloudflare documents `SKIP_DEPENDENCY_INSTALL=1` / `true` as the supported way to disable automatic dependency installation. See the current Workers Builds build-image documentation.

If you do not set this variable, Cloudflare may perform its normal automatic npm install first, after which FINAL12 runs npm install again. That is slower but should not produce the old lock-file EUSAGE error because FINAL12 contains no package-lock.json.

## Versions

- `.nvmrc`: Node.js `24.18.0`
- `packageManager`: `npm@10.9.2`
- Wrangler: `4.135.0`
- OpenNext Cloudflare: `1.20.6`

## Hyperdrive

The deploy script resolves the production Hyperdrive ID in this order:

1. `HYPERDRIVE_ID` build environment variable, if provided.
2. Existing Hyperdrive named `musichub-db`.
3. Create `musichub-db` from `DATABASE_URL` if available to the deploy command.

`localConnectionString` in `wrangler.jsonc` is only a local fallback and is not the production database.


FINAL13 IMPORTANT: Workers Builds Build command should be `npm run build` (which now runs OpenNext directly) OR `npm run cf:build`. Deploy command must be `npm run deploy` so Hyperdrive resolution runs before deployment. Do not use plain `npx wrangler deploy` for production because this bypasses the project Hyperdrive bootstrap script.
