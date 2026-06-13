import { createAuthClient } from "better-auth/react";

import { websiteConfig } from "../config.ts";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  baseURL: websiteConfig.apiUrl,
  fetchOptions: {
    credentials: "include",
  },
});
