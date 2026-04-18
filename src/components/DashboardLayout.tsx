import { Link, useLocation } from "@tanstack/react-router";
import { GraduationCap, LayoutDashboard, BookOpen, BarChart3, Shield, Megaphone, Wallet, Settings, Bell, Search, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

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

export function DashboardLayout({ role, title, children }: { role: "student" | "instructor" | "admin"; title: string; children: ReactNode }) {
  const items = navs[role];
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-card border-r border-border flex flex-col transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Link to="/" className="flex items-center gap-2 h-16 px-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary"><GraduationCap className="h-5 w-5 text-primary-foreground" /></div>
          <span className="font-bold">EduNova</span>
        </Link>
        <div className="px-3 py-4">
          <div className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{role}</div>
          <nav className="space-y-1">
            {items.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  <Icon className="h-4 w-4" />{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Switch Role</div>
          <div className="mt-2 space-y-1">
            {(["student", "instructor", "admin"] as const).filter((r) => r !== role).map((r) => (
              <Link key={r} to={`/${r}`} className="block rounded-lg px-3 py-2 text-sm capitalize text-muted-foreground hover:bg-accent">{r} dashboard</Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur border-b border-border flex items-center px-4 sm:px-6 gap-3">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}><Menu className="h-5 w-5" /></button>
          <h1 className="font-display text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground">
              <Search className="h-4 w-4" /> <span>Search…</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-accent"><Bell className="h-5 w-5" /><span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" /></button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">AN</div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
