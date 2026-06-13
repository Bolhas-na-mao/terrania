import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import { AUTH_PASSWORD_MIN_LENGTH } from "@terrania/shared";
import { type DatabaseClient, databaseSchema } from "@terrania/db";

import type { ServerEnv } from "./config.ts";

export const buildAuth = (database: DatabaseClient, env: ServerEnv) =>
  betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: databaseSchema,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: AUTH_PASSWORD_MIN_LENGTH,
    },
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.CORS_ORIGIN],
  });

export type AppAuth = ReturnType<typeof buildAuth>;
