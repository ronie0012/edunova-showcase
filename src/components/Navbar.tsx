import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/courses", label: "Courses" },
    { to: "/student", label: "Student" },
    { to: "/instructor", label: "Instructor" },
    { to: "/admin", label: "Admin" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center font-display text-lg leading-none">
            E<span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-acid" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-tight">EduNova<span className="text-acid">.</span></div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">est · 2026</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/student"
            className="ml-3 group inline-flex items-center gap-1 rounded-md bg-acid text-acid-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            Get Started <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-1 bg-card">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">{l.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
