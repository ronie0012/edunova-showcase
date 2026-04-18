import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AlertTriangle, ArrowRight, MessageSquare, Star, TrendingDown, Users } from "lucide-react";
import { ticketCategories, criticalIssues, feedbackLoop } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "CRM Dashboard — EduNova Admin" }, { name: "description", content: "Customer relationship metrics, feedback loop, and support analytics for EduNova." }] }),
  component: CRM,
});

const reviews = [
  { name: "Riya M.", rating: 5, text: "Support resolved my refund in 2 hours. Impressed." },
  { name: "Aditya K.", rating: 4, text: "Great content but mobile app needs work." },
  { name: "Saanvi P.", rating: 5, text: "Best ₹2,499 I've spent on my career." },
];

const churnUsers = [
  { name: "Rahul J.", lastActive: "32 days ago", reason: "Hasn't opened the app since payment" },
  { name: "Meera S.", lastActive: "21 days ago", reason: "Started course, dropped after Module 2" },
  { name: "Arjun T.", lastActive: "18 days ago", reason: "3 failed login attempts, frustrated" },
];

function CRM() {
  return (
    <DashboardLayout role="admin" title="CRM Dashboard">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tickets Received", value: 1247, icon: MessageSquare },
          { label: "Resolution Rate", value: 84, suffix: "%", icon: TrendingDown },
          { label: "Avg Response Time", value: 3.2, suffix: "h", icon: Users, format: (n: number) => n.toFixed(1) },
          { label: "CSAT Score", value: 4.1, suffix: "/5", icon: Star, format: (n: number) => n.toFixed(1) },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex justify-between"><div className="text-xs text-muted-foreground">{s.label}</div><Icon className="h-4 w-4 text-primary" /></div>
              <div className="mt-2 text-2xl font-bold"><LiveNumber value={s.value} suffix={s.suffix} format={s.format} drift={0.002} /></div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donut */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-2">Auto-categorized tickets</h3>
          <p className="text-xs text-muted-foreground mb-4">NLP model classifies every incoming ticket into one of 5 buckets.</p>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ticketCategories} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2} animationDuration={900}>
                  {ticketCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical issues */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><AlertTriangle className="h-5 w-5 text-destructive" />Auto-flagged Critical Issues</h3>
          <div className="space-y-3">
            {criticalIssues.map((c) => (
              <div key={c.title} className="rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full ${c.severity === "CRITICAL" ? "bg-destructive animate-pulse" : c.severity === "HIGH" ? "bg-warning" : "bg-muted-foreground"}`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.reports} reports · {c.severity}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "Resolved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning-foreground"}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback loop */}
        <div className="lg:col-span-3 rounded-2xl bg-gradient-soft border border-border p-6">
          <h3 className="font-bold text-lg">📈 The Feedback Loop in Action</h3>
          <p className="text-sm text-muted-foreground mt-1">Customer data → auto-categorized → flagged → action → outcome measured.</p>
          <div className="mt-5 grid md:grid-cols-3 gap-4">
            {feedbackLoop.map((f, i) => (
              <div key={i} className="rounded-xl bg-card border border-border p-5">
                <div className="text-xs font-semibold text-destructive uppercase tracking-wide">Trigger</div>
                <div className="font-medium text-sm mt-1">{f.trigger}</div>
                <div className="my-3 flex items-center gap-2 text-primary"><ArrowRight className="h-4 w-4" /></div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">Action taken</div>
                <div className="font-medium text-sm mt-1">{f.action}</div>
                <div className="my-3 flex items-center gap-2 text-success"><ArrowRight className="h-4 w-4" /></div>
                <div className="text-xs font-semibold text-success uppercase tracking-wide">Outcome</div>
                <div className="font-semibold text-sm mt-1">{f.outcome}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Loyalty Program</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Points issued</span><span className="font-semibold">2,84,500</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Redemptions</span><span className="font-semibold">1,12,300</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Active members</span><span className="font-semibold">8,420</span></div>
            <div className="pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground mb-2">Top users</div>
              {["Ishita V. — 4,210 pts", "Karthik R. — 3,820 pts", "Sneha P. — 3,450 pts"].map((u) => (
                <div key={u} className="text-sm py-1">{u}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Churn */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><AlertTriangle className="h-5 w-5 text-warning" />Churn Risk Alerts</h3>
          <div className="space-y-3">
            {churnUsers.map((u) => (
              <div key={u.name} className="rounded-lg bg-warning/10 border border-warning/30 p-3">
                <div className="flex justify-between text-sm"><span className="font-semibold">{u.name}</span><span className="text-xs text-muted-foreground">{u.lastActive}</span></div>
                <div className="text-xs text-muted-foreground mt-1">{u.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.name}</span>
                  <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-warning text-warning" />)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
