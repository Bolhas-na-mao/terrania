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

dev:
  docker compose up -d postgres
  vp run --filter './apps/*' dev

check:
  vp check

test:
  vp test

build:
  vp run -r build
