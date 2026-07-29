import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { App } from "./app.tsx";
import "./style.css";

const queryClient = new QueryClient();
const rootElement = document.querySelector("#app");

if (!rootElement) {
  throw new Error("App root element not found");
}

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
