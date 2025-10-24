## Quick Start

```
MY_PROJECT_NAME=myproject
```

```
git clone https://github.com/gubbai/cf-next-authjs-prisma-d1 $MY_PROJECT_NAME

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

## このリポジトリをクローンする

```
MY_PROJECT_NAME=myproject
```

```
git clone https://github.com/gubbai/cf-next-authjs-prisma-d1 $MY_PROJECT_NAME
```

## pnpm install

```
pnpm i
```

## `.dev.vars`, `.env`の作成

```
mv .dev.vars.example .dev.vars
mv .env.example .env
```

## D1を作成

```
pnpm wrangler d1 create $MY_PROJECT_NAME --use-remote false --update-config true --binding DB
```

## local dev 用のsqliteファイルを作成

```
pnpm wrangler d1 execute $MY_PROJECT_NAME --command "SELECT 1;"
```

### 生成されたファイルを .env に設定

```
echo -e "\nDATABASE_URL=\"file:../$(find . -path '*/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite' -printf '%P' -quit)\"" >> .env
```

## authjs secretの作成

```
echo -e "\nAUTH_SECRET=$(pnpm dlx auth secret --raw)" >> .dev.vars
```

## cf-typegen

```
pnpm cf-typegen
```

## Cloudflare 関連の設定

```.env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_DATABASE_ID=
CLOUDFLARE_D1_TOKEN=
```

### `CLOUDFLARE_ACCOUNT_ID`

`pnpm wrangler whoami`　で確認。

### `CLOUDFLARE_DATABASE_ID`

`wrangler.jsonc`で確認。

### `CLOUDFLARE_D1_TOKEN`

[https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) にアクセス。

1. `Create Token`
2. `Create Custom Token`
3. `Permissions`を`D1`, `Edit`にして作成

## prisma migration

```
pnpm prisma migrate resolve --applied 0_init
pnpm prisma migrate resolve --applied 0_init --config prisma-prod.config.ts
```

```
pnpm prisma migrate dev
pnpm prisma migrate deploy --config prisma-prod.config.ts
```