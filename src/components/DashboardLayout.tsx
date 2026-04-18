import { Link, useLocation, useNavigate, Navigate } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, BarChart3, Shield, Megaphone, Wallet, Settings, Bell, Search, Menu, LogOut, AlertTriangle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const navs: Record<string, NavItem[]> = {
  student: [
    { to: "/student", label: "Overview", icon: LayoutDashboard },
    { to: "/courses", label: "Browse Courses", icon: BookOpen },
  ],
  instructor: [
    { to: "/instructor", label: "Overview", icon: LayoutDashboard },
    { to: "/courses", label: "Catalog", icon: BookOpen },
  ],
  admin: [
    { to: "/admin", label: "CRM", icon: BarChart3 },
    { to: "/admin/revenue", label: "Revenue", icon: Wallet },
    { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
    { to: "/admin/security", label: "Security", icon: Shield },
    { to: "/admin/operations", label: "Operations", icon: Settings },
  ],
};

export function DashboardLayout({
  role,
  title,
  children,
}: {
  role: "student" | "instructor" | "admin";
  title: string;
  children: ReactNode;
}) {
  const items = navs[role];
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // ── Auth guard: must be logged in ──────────────────────────────────────────
  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }

  // ── Admin guard: only admins can access admin workspace ───────────────────
  if (role === "admin" && !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-display text-3xl tracking-tight">Access Denied</h1>
          <p className="mt-3 text-muted-foreground">
            The admin workspace is restricted to EduNova administrators. Your account ({user.email}) does not have admin privileges.
          </p>
          <Link
            to="/student"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 h-16 px-5 border-b border-sidebar-border">
          <div className="relative h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center font-display text-lg leading-none">
            E<span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-acid" />
          </div>
          <div className="font-display text-xl tracking-tight">
            EduNova<span className="text-acid">.</span>
          </div>
        </Link>

        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <div className="px-2 mb-3 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {role} workspace
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-acid rounded-r" />}
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Switch role
          </div>
          <div className="mt-2 space-y-1">
            {(["student", "instructor", "admin"] as const)
              .filter((r) => r !== role)
              .filter((r) => r !== "admin" || user.isAdmin)
              .map((r) => (
                <Link
                  key={r}
                  to={`/${r}`}
                  className="block rounded-md px-3 py-2 text-sm capitalize text-muted-foreground hover:bg-accent hover:text-foreground transition"
                >
                  {r} →
                </Link>
              ))}
          </div>
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <div className="rounded-md bg-accent/50 p-3 text-xs">
            <div className="font-mono text-[10px] uppercase tracking-wider text-acid">
              {user.isAdmin ? "Admin account" : "Pro tip"}
            </div>
            <div className="mt-1 text-muted-foreground leading-relaxed">
              {user.isAdmin
                ? `Logged in as ${user.email}`
                : "All metrics update live every few seconds."}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center px-4 sm:px-6 gap-3">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl tracking-tight">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground border border-border">
              <Search className="h-4 w-4" />
              <span className="font-mono text-xs">⌘K · search</span>
            </div>
            <button className="relative p-2 rounded-md hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-acid" />
            </button>
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <div className="text-xs font-medium">{user.name}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {user.email}
              </div>
            </div>
            <div className="h-9 w-9 rounded-md bg-acid text-acid-foreground flex items-center justify-center text-sm font-display">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
