import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Briefcase } from "lucide-react";
import { signUpUser } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — ERUKA" },
      {
        name: "description",
        content: "Create your ERUKA account and start freelancing or hiring.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"freelancer" | "recruiter">("freelancer");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md gradient-card border-border/50">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-hero">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join ERUKA and start your journey</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              if (!name.trim() || !email.trim() || !password.trim()) {
                setError("Please fill in all fields.");
                return;
              }

              const result = await signUpUser({
                id: `user-${Date.now()}`,
                name: name.trim(),
                email: email.trim(),
                password,
                role,
              });

              if (!result.ok) {
                setError(result.message);
                return;
              }

              void navigate({ to: "/profile" });
            }}
          >
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("freelancer")}
                className={`rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                  role === "freelancer"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                🎯 Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`rounded-lg border p-3 text-center text-sm font-medium transition-colors ${
                  role === "recruiter"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                🏢 Recruiter
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-input/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input/50"
                />
              </div>
            </div>
            <Button variant="hero" className="w-full gap-2" type="submit">
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
