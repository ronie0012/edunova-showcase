import { Link } from "@tanstack/react-router";
import { Globe, Mail, MessageCircle, Share2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t border-border bg-card mt-24 relative overflow-hidden">
      {/* Big wordmark */}
      <div className="px-4 sm:px-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="font-display text-[18vw] leading-[0.85] tracking-tighter text-foreground/90 select-none">
            EduNova<span className="text-acid">.</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-2xl leading-snug max-w-md">
            India's career-first learning platform — built by people who've shipped, for people who want to.
          </p>
          <div className="mt-6 flex gap-2">
            {[Globe, Mail, MessageCircle, Share2].map((Icon, i) => (
              <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-accent hover:border-acid/50 transition"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Platform</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/courses" className="hover:text-acid transition">Courses</Link></li>
            <li><Link to="/student" className="hover:text-acid transition">Student</Link></li>
            <li><Link to="/instructor" className="hover:text-acid transition">Instructor</Link></li>
            <li><Link to="/admin" className="hover:text-acid transition">Admin</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Legal</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/privacy" className="hover:text-acid transition">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-acid transition">Terms</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Get the brief</h4>
          <p className="mt-4 text-sm text-muted-foreground">One email a week. Tactics, jobs, drops.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes("@")) return toast.error("Please enter a valid email");
              toast.success("You're in. Check your inbox.");
              setEmail("");
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-md border border-input bg-background/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-acid"
            />
            <button className="group rounded-md bg-foreground text-background px-3 py-2 text-sm font-semibold inline-flex items-center gap-1 hover:bg-acid hover:text-acid-foreground transition">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border py-5 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap justify-between gap-3 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <span>© 2026 EduNova Technologies Pvt. Ltd.</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
