import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CheckCircle2, Clock, Server } from "lucide-react";
import { LiveNumber } from "@/components/LiveNumber";

export const Route = createFileRoute("/admin/operations")({
  head: () => ({ meta: [{ title: "Operations Dashboard — EduNova Admin" }, { name: "description", content: "Instructor onboarding, content review, uptime, and server health." }] }),
  component: Ops,
});

const pipeline = [
  { stage: "Application Received", count: 42 },
  { stage: "Demo Submitted", count: 28 },
  { stage: "Interview", count: 15 },
  { stage: "Onboarding", count: 9 },
  { stage: "Live", count: 6 },
];

const queue = [
  { title: "GraphQL Deep Dive — by R. Saxena", status: "Pending", reviewer: "—" },
  { title: "Brand Strategy 2026 — by P. Ghosh", status: "In Review", reviewer: "Anita" },
  { title: "Excel for PMs — by V. Joshi", status: "Approved", reviewer: "Manish" },
  { title: "Web3 Fundamentals — by S. Kapoor", status: "Changes Requested", reviewer: "Anita" },
];

const servers = [
  { name: "API Cluster (Mumbai)", load: 42, status: "Healthy" },
  { name: "Video CDN", load: 67, status: "Healthy" },
  { name: "Database Primary", load: 38, status: "Healthy" },
  { name: "Background Workers", load: 81, status: "Elevated" },
];

function Ops() {
  return (
    <DashboardLayout role="admin" title="Operations Dashboard">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
          <div className="flex items-center gap-2 text-sm opacity-90"><CheckCircle2 className="h-4 w-4" />Platform Uptime (30d)</div>
          <div className="mt-2 text-4xl font-bold"><LiveNumber value={99.94} suffix="%" format={(n) => n.toFixed(2)} drift={0.00005} /></div>
          <div className="mt-1 text-xs opacity-80">SLA target: 99.9%</div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />Avg API Latency</div>
          <div className="mt-2 text-3xl font-bold"><LiveNumber value={142} suffix="ms" drift={0.01} /></div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Server className="h-4 w-4" />Active Sessions</div>
          <div className="mt-2 text-3xl font-bold"><LiveNumber value={3284} drift={0.005} /></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Instructor Onboarding Pipeline</h3>
          <div className="space-y-3">
            {pipeline.map((p, i) => {
              const pct = (p.count / pipeline[0].count) * 100;
              return (
                <div key={p.stage}>
                  <div className="flex justify-between text-sm mb-1"><span>{i + 1}. {p.stage}</span><span className="font-semibold">{p.count}</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Server Health</h3>
          <div className="space-y-4">
            {servers.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className={`text-xs font-semibold ${s.status === "Healthy" ? "text-success" : "text-warning"}`}>{s.status} · {s.load}%</span>
                </div>
                <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.load > 75 ? "bg-warning" : "bg-success"}`} style={{ width: `${s.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Content Review Queue</h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2">Course</th><th className="text-left">Reviewer</th><th className="text-right">Status</th></tr>
            </thead>
            <tbody>
              {queue.map((q) => (
                <tr key={q.title} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{q.title}</td>
                  <td className="text-muted-foreground">{q.reviewer}</td>
                  <td className="text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      q.status === "Approved" ? "bg-success/15 text-success" :
                      q.status === "In Review" ? "bg-primary/15 text-primary" :
                      q.status === "Pending" ? "bg-muted text-muted-foreground" :
                      "bg-warning/15 text-warning-foreground"
                    }`}>{q.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
