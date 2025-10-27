# CLAUDE.md

> **⚠️ Important**: When editing files outside of `./app` or `./lib`, always ask for explicit permission first. Even within `./app` and `./lib`, request permission before modifying `./app/globals.css`, `./app/layout.tsx`, or `./lib/db.ts`.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application deployed on Cloudflare Pages using OpenNext for Cloudflare, with Auth.js (NextAuth v5) for authentication and Prisma with D1 (Cloudflare's SQLite database) for data persistence.

## Key Architecture

### Database Layer (Dual Environment Setup)

The project uses **two separate database configurations**:

1. **Local Development**: Uses a local SQLite file via Wrangler's miniflare
   - File location: `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite`
   - Configured in `.env` as `DATABASE_URL`
   - Used by Prisma during development and migrations

2. **Production (Cloudflare)**: Uses Cloudflare D1 (remote SQLite)
   - Accessed via Cloudflare's D1 binding in `wrangler.jsonc`
   - Requires `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and `CLOUDFLARE_D1_TOKEN` in `.env`
   - Accessed through `prisma-prod.config.ts` for production migrations

### Prisma Client Initialization

The database client is initialized differently based on the execution context:

- **lib/db.ts** provides two functions:
  - `getDb()`: For server components (uses React's `cache()`)
  - `getDbAsync()`: For static routes (ISR/SSG)

Both use `@opennextjs/cloudflare`'s `getCloudflareContext()` to access the D1 binding at runtime. The PrismaD1 adapter bridges Prisma with Cloudflare D1.

### Authentication

Auth.js integration is configured in `auth.ts`:
- Uses `PrismaAdapter` to store sessions in D1
- Requires `AUTH_SECRET` environment variable (stored in `.dev.vars` for local dev)
- Auth handlers exported in `app/api/auth/[...nextauth]/route.ts`
- Schema includes User, Account, Session, VerificationToken, and Authenticator models

### Cloudflare Deployment

Uses OpenNext for Cloudflare to adapt Next.js for Cloudflare Pages:
- Build output goes to `.open-next/` directory
- Worker entry point: `.open-next/worker.js`
- Static assets: `.open-next/assets`
- Configuration in `open-next.config.ts` (R2 caching available but commented out)

## Development Commands

### Initial Setup

```bash
# Install dependencies
pnpm i

# Create environment files
mv .dev.vars.example .dev.vars
mv .env.example .env

# Create D1 database (updates wrangler.jsonc)
pnpm wrangler d1 create <database-name> --use-remote false --update-config true --binding DB

# Generate local SQLite file
pnpm wrangler d1 execute <database-name> --command "SELECT 1;"

# Add DATABASE_URL to .env (path to the generated SQLite file)
echo -e "\nDATABASE_URL=\"file:../$(find . -path '*/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite' -printf '%P' -quit)\"" >> .env

# Generate AUTH_SECRET
echo -e "\nAUTH_SECRET=$(pnpm dlx auth secret --raw)" >> .dev.vars

# Generate Cloudflare types
pnpm cf-typegen
```

### Database Migrations

```bash
# Mark initial migration as applied (both local and prod)
pnpm prisma migrate resolve --applied 0_init
pnpm prisma migrate resolve --applied 0_init --config prisma-prod.config.ts

# Create and apply new migration (local)
pnpm prisma migrate dev

# Deploy migration to production D1
pnpm prisma migrate deploy --config prisma-prod.config.ts
```

### Running the Application

```bash
# Local development with Turbopack
pnpm dev

# Build for production
pnpm build

# Build and deploy to Cloudflare
pnpm deploy

# Build and preview locally
pnpm preview

# Start production server (standard Next.js, not Cloudflare)
pnpm start

# Lint
pnpm lint

# Regenerate Cloudflare types after wrangler.jsonc changes
pnpm cf-typegen
```

## Important Configuration Files

- **wrangler.jsonc**: Cloudflare Workers configuration with D1 binding
- **prisma/schema.prisma**: Database schema (SQLite with driverAdapters preview feature)
- **prisma-prod.config.ts**: Production D1 configuration for migrations
- **auth.ts**: Auth.js configuration with Prisma adapter
- **lib/db.ts**: Database client initialization with Cloudflare context
- **next.config.ts**: Next.js config with Prisma external packages and OpenNext dev initialization
- **open-next.config.ts**: OpenNext for Cloudflare configuration

## Environment Variables

### .dev.vars (Cloudflare Worker secrets for local dev)
- `AUTH_SECRET`: Auth.js encryption secret

### .env (Development and deployment configuration)
- `DATABASE_URL`: Path to local SQLite file
- `CLOUDFLARE_ACCOUNT_ID`: Get with `pnpm wrangler whoami`
- `CLOUDFLARE_DATABASE_ID`: Found in `wrangler.jsonc`
- `CLOUDFLARE_D1_TOKEN`: D1 API token from Cloudflare dashboard (Permissions: D1, Edit)

## Critical Notes

1. **Always run migrations in both environments**: Local development uses the SQLite file, production uses D1. Run `prisma migrate dev` for local and `prisma migrate deploy --config prisma-prod.config.ts` for production.

2. **Type generation after config changes**: Run `pnpm cf-typegen` after modifying `wrangler.jsonc` to regenerate TypeScript types in `cloudflare-env.d.ts`.

3. **Prisma external packages**: The `serverExternalPackages` config in `next.config.ts` is required to prevent bundling Prisma client.

4. **OpenNext dev initialization**: The `initOpenNextCloudflareForDev()` call in `next.config.ts` enables `getCloudflareContext()` during local development.

5. **Database adapter configuration**: Uses `@prisma/adapter-d1` with the `driverAdapters` preview feature to connect Prisma to Cloudflare D1.
