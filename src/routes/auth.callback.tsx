import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { completeSupabaseLogin } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Signing In — ERUKA" },
      { name: "description", content: "Completing your ERUKA sign in." },
    ],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    void completeSupabaseLogin().then((result) => {
      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      void navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md gradient-card border-border/50">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold">Signing you in</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
