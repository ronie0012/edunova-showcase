import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAdminWorkspace } from "@/lib/admin";

export const Route = createFileRoute("/admin/security")({
  head: () => ({
    meta: [
      { title: "Security Dashboard - EduNova Admin" },
      {
        name: "description",
        content:
          "Security events, controls, and privacy posture for the EduNova admin workspace.",
      },
    ],
  }),
  component: SecurityDashboard,
});

function SecurityDashboard() {
  const { state, securityMetrics, toggleSecurityEventStatus, toggleSecurityControl } =
    useAdminWorkspace();
  const [modal, setModal] = useState<null | "privacy" | "terms">(null);

  return (
    <DashboardLayout role="admin" title="Security dashboard">
      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-5">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-warning" />
          <div>
            <div className="font-semibold">
              {securityMetrics.suspiciousEvents} suspicious login events require attention
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Admins can block or re-allow events directly from the table below.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Login activity</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Toggle the current status of each security event.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {state.securityEvents.length} tracked events
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Time</th>
                  <th className="text-left">Device</th>
                  <th className="text-left">IP</th>
                  <th className="text-left">Location</th>
                  <th className="text-left">Reason</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.securityEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 whitespace-nowrap">{event.time}</td>
                    <td>{event.device}</td>
                    <td className="font-mono text-xs">{event.ip}</td>
                    <td>{event.location}</td>
                    <td className="text-muted-foreground">{event.reason}</td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          toggleSecurityEventStatus(event.id);
                          toast.success(
                            event.status === "ok"
                              ? "Event blocked"
                              : "Event marked safe"
                          );
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          event.status === "ok"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {event.status === "ok" ? "Allow" : "Blocked"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            Data privacy summary
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Collected
              </div>
              <div>Name, email, checkout metadata, progress, and device info.</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Storage
              </div>
              <div>Client-side demo storage with local-only admin persistence.</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Retention
              </div>
              <div>Admins can clear local state, while public policy pages explain the product contract.</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => setModal("privacy")}
              className="flex items-center justify-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-accent"
            >
              <FileText className="h-3.5 w-3.5" />
              Privacy
            </button>
            <button
              onClick={() => setModal("terms")}
              className="flex items-center justify-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-accent"
            >
              <FileText className="h-3.5 w-3.5" />
              Terms
            </button>
          </div>
          <Link
            to="/privacy"
            className="mt-3 block text-center text-xs text-primary hover:underline"
          >
            Open full privacy page
          </Link>
        </section>

        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Security controls</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Toggle active protections in the admin workspace.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {securityMetrics.activeControls} active
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {state.securityControls.map((control) => (
              <div
                key={control.id}
                className="rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{control.name}</div>
                  <button
                    onClick={() => {
                      toggleSecurityControl(control.id);
                      toast.success(
                        control.active ? "Control disabled" : "Control enabled"
                      );
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      control.active
                        ? "bg-success/15 text-success"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {control.active ? "Active" : "Paused"}
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{control.why}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-elegant"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-bold">
              {modal === "privacy" ? "Privacy Policy" : "Terms of Service"} summary
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              This admin workspace is currently a client-side demo. Public policy
              pages remain the canonical user-facing source of truth.
            </p>
            <Link
              to={modal === "privacy" ? "/privacy" : "/terms"}
              className="mt-5 inline-flex rounded-md bg-acid px-4 py-2 text-sm font-semibold text-acid-foreground"
            >
              Open full document
            </Link>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
