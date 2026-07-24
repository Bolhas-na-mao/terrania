set dotenv-load := true

install:
  vp install

infra-up:
  docker compose up -d postgres

infra-down:
  docker compose down

infra-logs:
  docker compose logs -f postgres

db-shell:
  docker compose exec postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-terrania}

db-generate:
  pnpm --dir packages/db exec drizzle-kit generate

db-migrate:
  if test -f packages/db/drizzle/meta/_journal.json; then pnpm --dir packages/db exec drizzle-kit migrate; else echo "No database migrations to apply"; fi

dev:
  docker compose up -d --wait postgres
  just db-migrate
  vp run --filter './apps/*' dev

check:
  vp check

test:
  vp test

build:
  vp run -r build
