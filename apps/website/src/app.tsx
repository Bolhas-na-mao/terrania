import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { type ApiHealthResponse } from "@terrania/shared";

import { AuthDialog } from "./components/auth-dialog.tsx";
import { Button } from "./components/ui/button.tsx";
import { websiteConfig } from "./config.ts";
import { authClient } from "./lib/auth-client.ts";

const fetchHealth = async (): Promise<ApiHealthResponse> => {
  const response = await fetch(`${websiteConfig.apiUrl}/api/health`);

  if (!response.ok) {
    throw new Error("Health check request failed");
  }

  return response.json() as Promise<ApiHealthResponse>;
};

export const App = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const healthQuery = useQuery({
    queryFn: fetchHealth,
    queryKey: ["health"],
    retry: false,
  });
  const session = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await authClient.signOut();

      if (!result.error) {
        await session.refetch();
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AuthDialog onOpenChange={setAuthDialogOpen} open={authDialogOpen} />

      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            {session.isPending ? (
              <Button disabled variant="secondary">
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Checking session
              </Button>
            ) : session.data?.user ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{session.data.user.name}</span>
                <Button
                  disabled={isSigningOut || session.isRefetching}
                  onClick={handleSignOut}
                  variant="secondary"
                >
                  {isSigningOut ? (
                    <>
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                      Signing out
                    </>
                  ) : (
                    "Sign out"
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setAuthDialogOpen(true)}>Sign in</Button>
            )}
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Basic auth</h1>
            <p className="text-muted-foreground text-sm">
              {session.data?.user
                ? `Signed in as ${session.data.user.email}`
                : "Use the button above to sign in or create an account."}
            </p>
            <p className="text-muted-foreground text-sm">
              API status:{" "}
              {healthQuery.isSuccess
                ? healthQuery.data.status
                : healthQuery.isError
                  ? "error"
                  : "checking"}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};
