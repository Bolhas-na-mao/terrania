import type { DatabaseClient } from "@terrania/db";

import type { AppAuth } from "./auth.ts";

declare module "fastify" {
  interface FastifyInstance {
    auth: AppAuth;
    database: DatabaseClient;
  }
}
