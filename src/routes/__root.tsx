import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BUILD_COMMIT } from "@/lib/buildInfo";
import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupportChatWidget } from "@/components/SupportChatWidget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ERUKA — Where Talent Meets Opportunity" },
      {
        name: "description",
        content:
          "ERUKA is a modern freelancing platform connecting top freelancers with innovative businesses through a professional bidding system.",
      },
      { property: "og:title", content: "ERUKA — Where Talent Meets Opportunity" },
      {
        property: "og:description",
        content: "Find top freelancers or land your next project on ERUKA.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [, setTick] = useState(0);

  useEffect(() => {
    function onAuth() {
      // force a root re-render so all children re-read getCurrentUser()
      setTick((t) => t + 1);
    }
    window.addEventListener('eruka:auth-changed', onAuth);
    return () => window.removeEventListener('eruka:auth-changed', onAuth);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('eruka_build');
      const reloadedFlag = window.sessionStorage.getItem('eruka_reloaded_once');
      if (stored && stored !== BUILD_COMMIT && !reloadedFlag) {
        // another user agent or older assets were loaded previously — update and reload once
        window.localStorage.setItem('eruka_build', BUILD_COMMIT);
        // set a session flag so we only reload once per tab
        window.sessionStorage.setItem('eruka_reloaded_once', '1');
        // reload to fetch latest assets
        window.location.reload();
      } else if (!stored) {
        window.localStorage.setItem('eruka_build', BUILD_COMMIT);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative selection:bg-primary/20 selection:text-primary">
      {/* Global Grain Overlay for cinematic feel */}
      <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SupportChatWidget />
    </div>
  );
}
