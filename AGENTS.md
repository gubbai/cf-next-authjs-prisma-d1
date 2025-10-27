# Repository Guidelines

> **⚠️ Important**: When editing files outside of `./app` or `./lib`, always ask for explicit permission first. Even within `./app` and `./lib`, request permission before modifying `./app/globals.css`, `./app/layout.tsx`, or `./lib/db.ts`.

## Project Structure & Module Organization
The app follows the Next.js App Router. Place UI and route components under `app/`, keeping API handlers in `app/api/**/route.ts`; `auth.ts` exposes the Auth.js config consumed by `[...nextauth]/route.ts`. Shared utilities belong in `lib/` (e.g., `lib/db.ts` instantiates the Prisma D1 adapter). Database schema changes and migrations live in `prisma/`, with production overrides in `prisma-prod.config.ts`. Static assets stay in `public/`, and platform settings sit in `wrangler.jsonc` plus `open-next.config.ts`.

## Build, Test, and Development Commands
Use `pnpm dev` for the dev server with Turbopack and local Cloudflare bindings. `pnpm build` compiles production assets, and `pnpm start` serves them locally. Run `pnpm lint` before committing to catch ESLint and TypeScript issues. Apply schema updates with `pnpm prisma migrate dev`, and use `pnpm prisma migrate deploy --config prisma-prod.config.ts` for the remote D1 binding. Update Worker environment typings via `pnpm cf-typegen`. Deploy with `pnpm deploy` or request a staging build via `pnpm preview`.

## Coding Style & Naming Conventions
Write strict TypeScript, using React function components and hooks. Follow the two-space indentation and prefer single quotes in Prisma schema files. Import shared modules through the `@/` alias configured in `tsconfig.json`. Keep Auth.js and API routes inside `app/api` with the default `route.ts` naming so OpenNext detects them. Run `pnpm lint` and accept autofixes to stay aligned with the ESLint ruleset.

## Testing Guidelines
There is no automated test suite yet, so pair linting with manual verification and note the checks in pull requests. When adding coverage, define a script in `package.json` (for example, `"test": "vitest"`) and store specs in `tests/` or alongside source as `*.test.ts`. Provide seed data or fixtures for D1 whenever migrations alter persisted records.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`docs:`, `chore:`, `feat:`). Keep summaries imperative and under 72 characters, expanding in the body when needed. Pull requests must describe the change, link tracking issues, list required environment updates, and include any database commands to run (e.g., `pnpm prisma migrate deploy --config prisma-prod.config.ts`). Attach UI screenshots or CLI output when they clarify the change.

## Cloudflare & Prisma Notes
Secrets belong in `.dev.vars` (runtime) and `.env` (Prisma). After running `pnpm wrangler d1 create`, append the generated SQLite path to `DATABASE_URL` and regenerate bindings with `pnpm cf-typegen`. Keep migrations idempotent and document any manual Cloudflare steps so reviewers can reproduce them.
