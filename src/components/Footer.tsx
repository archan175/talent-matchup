import { Briefcase } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ERUKA</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Where Talent Meets Opportunity. The modern platform connecting top freelancers with innovative businesses.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link>
            <Link to="/post-job" className="hover:text-foreground transition-colors">Post a Job</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © 2026 ERUKA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
