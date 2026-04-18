import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const links = [
    { to: "/courses" as const, label: "Courses" },
    ...(user ? [{ to: "/student" as const, label: "Student" }] : []),
    ...(user ? [{ to: "/instructor" as const, label: "Instructor" }] : []),
    ...(user?.isAdmin ? [{ to: "/admin" as const, label: "Admin" }] : []),
  ];

  const handleLogout = () => {
    logout();
    setMenu(false);
    toast.success("Signed out");
    nav({ to: "/" });
  };

  const initials = user?.name?.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "?";

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
          {user ? (
            <div className="relative ml-3">
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 hover:border-acid transition"
              >
                <div className="h-7 w-7 rounded bg-acid text-acid-foreground flex items-center justify-center text-xs font-display">{initials}</div>
                <span className="text-sm font-medium pr-1">{user.name.split(" ")[0]}</span>
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-elegant z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-medium truncate">{user.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <Link to="/student" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent">
                      <UserIcon className="h-4 w-4" /> My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent text-left text-destructive">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" search={{ redirect: "/" }} className="ml-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Sign in
              </Link>
              <Link to="/signup" className="group inline-flex items-center gap-1 rounded-md bg-acid text-acid-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
                Get Started <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </>
          )}
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
          {user ? (
            <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-destructive">
              Sign out ({user.name.split(" ")[0]})
            </button>
          ) : (
            <>
              <Link to="/login" search={{ redirect: "/" }} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Sign in</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-semibold bg-acid text-acid-foreground">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
