import { toNodeHandler } from "better-auth/node";
import type { FastifyPluginAsync } from "fastify";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const authHandler = toNodeHandler(app.auth);

  app.route({
    handler: async (request, reply) => {
      reply.hijack();
      await authHandler(request.raw, reply.raw);
    },
    method: ["GET", "POST"],
    url: "/api/auth/*",
  });
};
