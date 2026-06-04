import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@127.0.0.1:5432/terrania",
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schema/*.ts",
});
