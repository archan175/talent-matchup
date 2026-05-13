import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useEffect } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Browse Jobs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/post-job", label: "Post Job" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    function onAuth() {
      // force re-render to pick up updated getCurrentUser()
      setTick((t) => t + 1);
    }
    window.addEventListener('eruka:auth-changed', onAuth);
    return () => window.removeEventListener('eruka:auth-changed', onAuth);
  }, []);

  return (
    <header className="sticky top-4 z-[90] mx-4 md:mx-auto max-w-7xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] mt-4 mb-4 transition-all duration-300">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="text-xs font-black">E</span>
          </div>
          <span className="text-lg font-black tracking-tight text-foreground">ERUKA</span>
        </Link>

  <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

  <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  {currentUser.name}
                </Button>
              </Link>
              <Button
                variant="hero"
                size="sm"
                onClick={() => {
                  logoutUser();
                  void navigate({ to: "/" });
                }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 glass px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
            {currentUser ? (
              <div className="mt-2 flex gap-2">
                <Link to="/profile" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    {currentUser.name}
                  </Button>
                </Link>
                <Button
                  variant="hero"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setMobileOpen(false);
                    logoutUser();
                    void navigate({ to: "/" });
                  }}
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="hero" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
