import cors from "@fastify/cors";
import Fastify from "fastify";

import { createDatabase } from "@terrania/db";

import type { ServerEnv } from "./config.ts";
import { createLogger } from "./logger.ts";
import { healthRoutes } from "./routes/health.ts";

export const buildApp = (env: ServerEnv) => {
  const logger = createLogger(env);

  const app = Fastify({
    loggerInstance: logger,
  });

  void app.register(cors, {
    credentials: true,
    origin: env.CORS_ORIGIN,
  });

  const database = createDatabase({
    connectionString: env.DATABASE_URL,
    logger,
    logQueries: env.LOG_QUERIES,
  });

  app.decorate("database", database);

  app.addHook("onRequest", async (request) => {
    request.log.debug(
      {
        method: request.method,
        params: request.params,
        query: request.query,
        url: request.url,
      },
      "request received",
    );
  });

  app.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        method: request.method,
        statusCode: reply.statusCode,
        url: request.url,
      },
      "request completed",
    );
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(
      {
        error,
        method: request.method,
        url: request.url,
      },
      "request failed",
    );

    if (!reply.sent) {
      void reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  });

  app.register(healthRoutes);

  return app;
};
