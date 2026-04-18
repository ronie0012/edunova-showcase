import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { loginActivity, securityPractices } from "@/lib/data";
import { AlertTriangle, CheckCircle2, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/security")({
  head: () => ({ meta: [{ title: "Security Dashboard — EduNova Admin" }, { name: "description", content: "Login activity, security practices, and data privacy on EduNova." }] }),
  component: Security,
});

function Security() {
  const [modal, setModal] = useState<null | "privacy" | "terms">(null);
  return (
    <DashboardLayout role="admin" title="Security Dashboard">
      {/* Alert */}
      <div className="rounded-2xl bg-warning/10 border border-warning/40 p-5 flex items-start gap-4 mb-6">
        <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">3 suspicious login attempts blocked in the last 24h</div>
          <div className="text-sm text-muted-foreground mt-1">All attempts originated from flagged IPs and were auto-blocked by rate limiting.</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Login activity */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Login Activity (last 5)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">Time</th><th className="text-left">Device</th><th className="text-left">IP</th><th className="text-left">Location</th><th className="text-right">Status</th></tr>
              </thead>
              <tbody>
                {loginActivity.map((l, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3 whitespace-nowrap">{l.time}</td>
                    <td>{l.device}</td>
                    <td className="font-mono text-xs">{l.ip}</td>
                    <td>{l.location}</td>
                    <td className="text-right">
                      {l.status === "ok" ? <span className="rounded-full bg-success/15 text-success px-2 py-0.5 text-xs font-semibold">OK</span>
                      : <span className="rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-xs font-semibold">BLOCKED</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy summary */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-3"><Shield className="h-5 w-5 text-primary" />Data Privacy Summary</h3>
          <div className="space-y-3 text-sm">
            <div><div className="font-semibold text-xs uppercase text-muted-foreground">Collected</div><div>Name, email, payment metadata, course progress, device info.</div></div>
            <div><div className="font-semibold text-xs uppercase text-muted-foreground">Storage</div><div>AES-256 encrypted in Mumbai region. Backups retained 30 days.</div></div>
            <div><div className="font-semibold text-xs uppercase text-muted-foreground">Retention</div><div>Account data deleted within 30 days of user request.</div></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button onClick={() => setModal("privacy")} className="rounded-lg bg-secondary text-secondary-foreground px-3 py-2 text-xs font-semibold hover:bg-accent flex items-center justify-center gap-1"><FileText className="h-3.5 w-3.5" />Privacy</button>
            <button onClick={() => setModal("terms")} className="rounded-lg bg-secondary text-secondary-foreground px-3 py-2 text-xs font-semibold hover:bg-accent flex items-center justify-center gap-1"><FileText className="h-3.5 w-3.5" />Terms</button>
          </div>
          <Link to="/privacy" className="mt-2 block text-center text-xs text-primary hover:underline">Open full Privacy Policy page →</Link>
        </div>

        {/* Practices */}
        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-bold text-lg mb-4">Security practices — explained in context</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {securityPractices.map((p) => (
              <div key={p.name} className="rounded-xl border border-border p-4 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2"><span className="font-semibold text-sm">{p.name}</span><span className="rounded-full bg-success/15 text-success px-2 py-0.5 text-[10px] font-semibold">ACTIVE</span></div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{modal === "privacy" ? "Privacy Policy" : "Terms of Service"} (excerpt)</h3>
            <div className="prose prose-sm max-w-none text-sm text-muted-foreground">
              <p>For the complete document, see our dedicated page.</p>
              <p>This is a summary view. The full policy details data collection, third-party sharing, cookie usage, user rights under DPDP Act and GDPR, and contact channels for grievances.</p>
            </div>
            <Link to={modal === "privacy" ? "/privacy" : "/terms"} className="mt-4 inline-block rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open full document</Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
