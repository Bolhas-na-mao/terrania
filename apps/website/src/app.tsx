import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";

import { type ApiHealthResponse } from "@terrania/shared";

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
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium">Terrania</p>
          <Button disabled variant="secondary">
            Quiz catalog soon
          </Button>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Playable geography quizzes</h1>
            <p className="text-muted-foreground text-sm">
              The next slice is the homepage catalog and the first playable quiz loop.
            </p>
            <p className="text-muted-foreground text-sm">
              API status:{" "}
              {healthQuery.isSuccess ? (
                healthQuery.data.status
              ) : healthQuery.isError ? (
                "error"
              ) : (
                <span className="inline-flex items-center gap-1">
                  <LoaderCircle className="size-3 animate-spin" />
                  checking
                </span>
              )}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};
