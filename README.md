[English](README.md) | [Japanese](ja.README.md)

## Quick Start

```
MY_PROJECT_NAME=myproject
```

```
git clone https://github.com/gubbai/cf-next-authjs-prisma-d1 $MY_PROJECT_NAME

cd $MY_PROJECT_NAME
pnpm i

mv .dev.vars.example .dev.vars
mv .env.example .env

pnpm wrangler d1 create $MY_PROJECT_NAME --use-remote false --update-config true --binding DB

pnpm wrangler d1 execute $MY_PROJECT_NAME --command "SELECT 1;"

echo -e "\nDATABASE_URL=\"file:../$(find . -path '*/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite' -printf '%P' -quit)\"" >> .env

echo -e "\nAUTH_SECRET=$(pnpm dlx auth secret --raw)" >> .dev.vars

pnpm cf-typegen
```

```.env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
```

```
pnpm prisma migrate resolve --applied 0_init
pnpm prisma migrate resolve --applied 0_init --config prisma-prod.config.ts

pnpm prisma migrate dev
pnpm prisma migrate deploy --config prisma-prod.config.ts
```

---

## Clone the Repository

```
MY_PROJECT_NAME=myproject
```

```
git clone https://github.com/gubbai/cf-next-authjs-prisma-d1 $MY_PROJECT_NAME
```

## Install Dependencies

```
cd $MY_PROJECT_NAME
pnpm i
```

## Create `.dev.vars` and `.env`

```
mv .dev.vars.example .dev.vars
mv .env.example .env
```

## Create a D1 Database

```
pnpm wrangler d1 create $MY_PROJECT_NAME --use-remote false --update-config true --binding DB
```

## Create Local SQLite File for Development

```
pnpm wrangler d1 execute $MY_PROJECT_NAME --command "SELECT 1;"
```

### Add the Generated File Path to `.env`

```
echo -e "\nDATABASE_URL=\"file:../$(find . -path '*/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite' -printf '%P' -quit)\"" >> .env
```

## Generate Auth.js Secret

```
echo -e "\nAUTH_SECRET=$(pnpm dlx auth secret --raw)" >> .dev.vars
```

## cf-typegen

```
pnpm cf-typegen
```

## Cloudflare Configuration

```.env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
```

### `CLOUDFLARE_ACCOUNT_ID`

Check it with:

```
pnpm wrangler whoami
```

### `CLOUDFLARE_DATABASE_ID`

You can find it in `wrangler.jsonc`.

### `CLOUDFLARE_D1_TOKEN`

Visit [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)

1. Click **Create Token**
2. Choose **Create Custom Token**
3. Under **Permissions**, select **D1**, **Edit**, and create the token

## Prisma Migrations

```
pnpm prisma migrate resolve --applied 0_init
pnpm prisma migrate resolve --applied 0_init --config prisma-prod.config.ts
```

```
pnpm prisma migrate dev
pnpm prisma migrate deploy --config prisma-prod.config.ts
```
