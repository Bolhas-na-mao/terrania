import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Radar } from "lucide-react";

import { APP_NAME, type ApiHealthResponse } from "@terrania/shared";

import { Button } from "./components/ui/button.tsx";
import { websiteConfig } from "./config.ts";

const fetchHealth = async (): Promise<ApiHealthResponse> => {
  const response = await fetch(`${websiteConfig.apiUrl}/api/health`);

  if (!response.ok) {
    throw new Error("Health check request failed");
  }

  return response.json() as Promise<ApiHealthResponse>;
};

export const App = () => {
  const healthQuery = useQuery({
    queryFn: fetchHealth,
    queryKey: ["health"],
    retry: false,
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-card px-4 py-2 text-card-foreground shadow-sm ring-1 ring-border backdrop-blur">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Radar className="size-4" />
            </span>
            <div>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.28em]">
                Setup Base
              </p>
              <p className="text-sm font-medium">{APP_NAME}</p>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-full px-4 py-2 text-sm shadow-sm ring-1 ring-border backdrop-blur">
            {healthQuery.isSuccess ? "API connected" : "API pending"}
          </div>
        </header>

        <div className="grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <section className="space-y-6">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.3em]">
              Maps. Flags. Play.
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                The monorepo is ready for the first real product slices.
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
                React, Fastify, PostGIS, shared package boundaries, structured logging, and a stable
                local development flow are now the baseline.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">Start building auth</Button>
              <Button asChild size="lg" variant="secondary">
                <a href="https://viteplus.dev/guide/" rel="noreferrer" target="_blank">
                  Vite+ docs
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--hero-panel-border)] bg-[var(--hero-panel)] p-6 text-[var(--hero-panel-foreground)] shadow-[0_30px_80px_color-mix(in_oklch,var(--foreground)_18%,transparent)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Health Snapshot
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[color-mix(in_oklch,var(--hero-panel-foreground)_6%,transparent)] p-4 ring-1 ring-[var(--hero-panel-border)]">
                <p className="text-sm text-[var(--hero-panel-muted)]">API status</p>
                <p className="mt-2 text-2xl font-semibold">
                  {healthQuery.isSuccess
                    ? healthQuery.data.status
                    : healthQuery.isError
                      ? "error"
                      : "checking"}
                </p>
              </div>
              <div className="rounded-2xl bg-[color-mix(in_oklch,var(--hero-panel-foreground)_6%,transparent)] p-4 ring-1 ring-[var(--hero-panel-border)]">
                <p className="text-sm text-[var(--hero-panel-muted)]">Timestamp</p>
                <p className="mt-2 text-sm font-medium text-[var(--hero-panel-foreground)]/90">
                  {healthQuery.data?.timestamp ?? "Waiting for server response"}
                </p>
              </div>
              <div className="rounded-2xl bg-[color-mix(in_oklch,var(--hero-panel-foreground)_6%,transparent)] p-4 ring-1 ring-[var(--hero-panel-border)]">
                <p className="text-sm text-[var(--hero-panel-muted)]">Local workflow</p>
                <p className="mt-2 text-sm leading-6 text-[var(--hero-panel-foreground)]/90">
                  `just dev` starts infrastructure and runs both apps.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};
