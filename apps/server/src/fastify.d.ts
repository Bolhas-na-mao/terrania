import type { DatabaseClient } from "@terrania/db";

declare module "fastify" {
  interface FastifyInstance {
    database: DatabaseClient;
  }
}
