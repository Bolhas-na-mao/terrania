WITH ranked_users AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY lower(email)
      ORDER BY created_at ASC, id ASC
    ) AS position,
    FIRST_VALUE(id) OVER (
      PARTITION BY lower(email)
      ORDER BY created_at ASC, id ASC
    ) AS canonical_id
  FROM "user"
),
duplicate_users AS (
  SELECT id, canonical_id
  FROM ranked_users
  WHERE position > 1
)
UPDATE "account" AS account
SET "user_id" = duplicate_users.canonical_id
FROM duplicate_users
WHERE account."user_id" = duplicate_users.id;
--> statement-breakpoint
WITH ranked_users AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY lower(email)
      ORDER BY created_at ASC, id ASC
    ) AS position,
    FIRST_VALUE(id) OVER (
      PARTITION BY lower(email)
      ORDER BY created_at ASC, id ASC
    ) AS canonical_id
  FROM "user"
),
duplicate_users AS (
  SELECT id, canonical_id
  FROM ranked_users
  WHERE position > 1
)
UPDATE "session" AS session
SET "user_id" = duplicate_users.canonical_id
FROM duplicate_users
WHERE session."user_id" = duplicate_users.id;
--> statement-breakpoint
WITH ranked_users AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY lower(email)
      ORDER BY created_at ASC, id ASC
    ) AS position
  FROM "user"
)
DELETE FROM "user"
USING ranked_users
WHERE "user".id = ranked_users.id
  AND ranked_users.position > 1;
--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";
--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique_ci" ON "user" USING btree (lower("email"));
