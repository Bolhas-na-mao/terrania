export const APP_NAME = "Terrania";

export type ApiHealthResponse = {
  appName: string;
  status: "ok";
  timestamp: string;
};

export * from "./quiz/index.ts";
