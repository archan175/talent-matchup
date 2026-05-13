import { Briefcase } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BUILD_COMMIT, BUILD_TIME } from "@/lib/buildInfo";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <span className="text-xl font-black text-white">E</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ERUKA</span>
            </div>
            <p className="max-w-sm text-slate-400 text-lg leading-relaxed font-light">
              Where Talent Meets Opportunity. The modern platform connecting top freelancers with innovative businesses.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Platform</h4>
            <div className="flex flex-col gap-4 font-medium">
              <Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link>
              <Link to="/post-job" className="hover:text-primary transition-colors">Post a Job</Link>
              <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Connect</h4>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 ERUKA. All rights reserved. 
          </p>
          <div className="text-xs opacity-50 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono tracking-wider">
            BUILD: {BUILD_COMMIT}
          </div>
        </div>
      </div>
    </footer>
  );
}
