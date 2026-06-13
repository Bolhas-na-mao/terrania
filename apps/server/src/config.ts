import { z } from "zod";

const serverEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("debug"),
  LOG_PRETTY: z
    .string()
    .optional()
    .transform((value) => value !== "false"),
  LOG_QUERIES: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  SERVER_HOST: z.string().default("0.0.0.0"),
  SERVER_PORT: z.coerce.number().int().positive().default(3001),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = serverEnvSchema.parse(process.env);
