import { Link, Navigate, useLocation, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  Shield,
  Wallet,
} from "lucide-react";
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
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading workspace...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.pathname }} />;
  }

  if (role === "admin" && !user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-display text-3xl tracking-tight">Access Denied</h1>
          <p className="mt-3 text-muted-foreground">
            The admin workspace is restricted to EduNova administrators. Your
            account ({user.email}) does not have admin privileges.
          </p>
          <Link
            to="/student"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-acid px-5 py-2.5 text-sm font-semibold text-acid-foreground transition hover:opacity-90"
          >
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((segment) => segment[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:static ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Link
          to="/"
          className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-display text-lg leading-none text-background">
            E
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-acid" />
          </div>
          <div className="font-display text-xl tracking-tight">
            EduNova<span className="text-acid">.</span>
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
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
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  {active ? (
                    <span className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r bg-acid" />
                  ) : null}
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
              .filter((item) => item !== role)
              .filter((item) => item !== "admin" || user.isAdmin)
              .map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  className="block rounded-md px-3 py-2 text-sm capitalize text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  {item} →
                </Link>
              ))}
          </div>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-md bg-accent/50 p-3 text-xs">
            <div className="font-mono text-[10px] uppercase tracking-wider text-acid">
              {user.isAdmin ? "Admin account" : "Pro tip"}
            </div>
            <div className="mt-1 leading-relaxed text-muted-foreground">
              {user.isAdmin
                ? `Logged in as ${user.email}`
                : "All metrics update live every few seconds."}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl tracking-tight">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground sm:flex">
              <Search className="h-4 w-4" />
              <span className="font-mono text-xs">⌘K · search</span>
            </div>
            <button className="relative rounded-md p-2 hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-acid" />
            </button>
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <div className="text-xs font-medium">{user.name}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {user.email}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-acid text-sm font-display text-acid-foreground">
              {initials}
            </div>
            <button
              onClick={() => void handleLogout()}
              title="Sign out"
              className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-destructive"
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
