import { afterAll, describe, expect, it } from "vitest";

import { APP_NAME } from "@terrania/shared";

import { buildApp } from "../app.ts";
import type { ServerEnv } from "../config.ts";

const testEnv: ServerEnv = {
  CORS_ORIGIN: "http://localhost:3000",
  DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/terrania",
  LOG_LEVEL: "fatal",
  LOG_PRETTY: false,
  LOG_QUERIES: false,
  SERVER_HOST: "127.0.0.1",
  SERVER_PORT: 3001,
};

const app = buildApp(testEnv);

afterAll(async () => {
  await app.close();
});

describe("healthRoutes", () => {
  it("returns the shared app name and an ok status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      appName: APP_NAME,
      status: "ok",
      timestamp: expect.any(String),
    });
  });
});
