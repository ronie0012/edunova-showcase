import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/courses" as const, label: "Courses" },
    ...(ready && user ? [{ to: "/student" as const, label: "Student" }] : []),
    ...(ready && user ? [{ to: "/instructor" as const, label: "Instructor" }] : []),
    ...(ready && user?.isAdmin ? [{ to: "/admin" as const, label: "Admin" }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    setMenu(false);
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((segment) => segment[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-display text-lg leading-none text-background">
            E
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-acid" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-tight">
              EduNova<span className="text-acid">.</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              est · 2026
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}

          {ready && user ? (
            <div className="relative ml-3">
              <button
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 transition hover:border-acid"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded bg-acid text-xs font-display text-acid-foreground">
                  {initials}
                </div>
                <span className="pr-1 text-sm font-medium">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              {menu ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-elegant">
                    <div className="border-b border-border px-4 py-3">
                      <div className="truncate text-sm font-medium">{user.name}</div>
                      <div className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      to="/student"
                      onClick={() => setMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent"
                    >
                      <UserIcon className="h-4 w-4" /> My Dashboard
                    </Link>
                    <button
                      onClick={() => void handleLogout()}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                search={{ redirect: "/" }}
                className="ml-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="group inline-flex items-center gap-1 rounded-md bg-acid px-4 py-2 text-sm font-semibold text-acid-foreground transition hover:opacity-90"
              >
                Get Started
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            </>
          )}
        </nav>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="space-y-1 border-t border-border bg-card px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          {ready && user ? (
            <button
              onClick={() => {
                setOpen(false);
                void handleLogout();
              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-accent"
            >
              Sign out ({user.name.split(" ")[0]})
            </button>
          ) : (
            <>
              <Link
                to="/login"
                search={{ redirect: "/" }}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-acid px-3 py-2 text-sm font-semibold text-acid-foreground"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      ) : null}
    </header>
  );
}
