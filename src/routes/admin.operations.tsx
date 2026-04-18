import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveNumber } from "@/components/LiveNumber";
import { type LeadStage, type ReviewStatus, useAdminWorkspace } from "@/lib/admin";

export const Route = createFileRoute("/admin/operations")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard - EduNova Admin" },
      {
        name: "description",
        content:
          "Instructor onboarding, review queue, and infrastructure controls for EduNova.",
      },
    ],
  }),
  component: OperationsDashboard,
});

const stageLabels: Record<LeadStage, string> = {
  application: "Application",
  demo: "Demo",
  interview: "Interview",
  onboarding: "Onboarding",
  live: "Live",
};

function OperationsDashboard() {
  const {
    state,
    operationsMetrics,
    orderedReviewQueue,
    addInstructorLead,
    moveInstructorLead,
    addReviewQueueItem,
    updateReviewStatus,
    updateServer,
  } = useAdminWorkspace();

  const [leadForm, setLeadForm] = useState({ name: "", expertise: "" });
  const [reviewForm, setReviewForm] = useState({
    title: "",
    instructor: "",
    category: "",
  });

  const estimatedUptime = Math.max(99.1, 99.98 - operationsMetrics.elevatedServers * 0.2);
  const averageLatency = 120 + operationsMetrics.pendingReviews * 4;
  const liveSessions = state.servers.reduce((sum, server) => sum + server.load, 0) * 8;

  return (
    <DashboardLayout role="admin" title="Operations dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <CheckCircle2 className="h-4 w-4" />
            Platform uptime
          </div>
          <div className="mt-2 text-4xl font-bold">
            <LiveNumber
              value={estimatedUptime}
              suffix="%"
              format={(value) => value.toFixed(2)}
            />
          </div>
          <div className="mt-1 text-xs opacity-80">
            Estimated from current server health states
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Avg API latency
          </div>
          <div className="mt-2 text-3xl font-bold">
            <LiveNumber value={averageLatency} suffix="ms" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            Session load estimate
          </div>
          <div className="mt-2 text-3xl font-bold">
            <LiveNumber value={liveSessions} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Add instructor lead</h3>
          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!leadForm.name.trim() || !leadForm.expertise.trim()) {
                toast.error("Name and expertise are required.");
                return;
              }

              addInstructorLead(leadForm);
              setLeadForm({ name: "", expertise: "" });
              toast.success("Instructor lead added");
            }}
          >
            <Field
              label="Name"
              value={leadForm.name}
              onChange={(value) =>
                setLeadForm((current) => ({ ...current, name: value }))
              }
              placeholder="Aarushi Kapoor"
            />
            <Field
              label="Expertise"
              value={leadForm.expertise}
              onChange={(value) =>
                setLeadForm((current) => ({ ...current, expertise: value }))
              }
              placeholder="Data engineering"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-acid px-4 py-2.5 text-sm font-semibold text-acid-foreground transition hover:opacity-90"
            >
              Add lead
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Instructor pipeline</h3>
          <div className="mt-5 space-y-5">
            {operationsMetrics.pipeline.map((stage) => {
              const max = Math.max(
                ...operationsMetrics.pipeline.map((item) => item.count),
                1
              );
              const width = (stage.count / max) * 100;

              return (
                <div key={stage.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{stageLabels[stage.stage]}</span>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
            {state.instructorLeads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {lead.expertise}
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
                    {stageLabels[lead.stage]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(Object.keys(stageLabels) as LeadStage[]).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        moveInstructorLead(lead.id, stage);
                        toast.success(`${lead.name} moved to ${stageLabels[stage]}`);
                      }}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        lead.stage === stage
                          ? "bg-acid text-acid-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {stageLabels[stage]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Queue new course</h3>
          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (
                !reviewForm.title.trim() ||
                !reviewForm.instructor.trim() ||
                !reviewForm.category.trim()
              ) {
                toast.error("All review fields are required.");
                return;
              }

              addReviewQueueItem(reviewForm);
              setReviewForm({ title: "", instructor: "", category: "" });
              toast.success("Course added to review queue");
            }}
          >
            <Field
              label="Course title"
              value={reviewForm.title}
              onChange={(value) =>
                setReviewForm((current) => ({ ...current, title: value }))
              }
              placeholder="Scaling React Apps"
            />
            <Field
              label="Instructor"
              value={reviewForm.instructor}
              onChange={(value) =>
                setReviewForm((current) => ({ ...current, instructor: value }))
              }
              placeholder="Nikita Rao"
            />
            <Field
              label="Category"
              value={reviewForm.category}
              onChange={(value) =>
                setReviewForm((current) => ({ ...current, category: value }))
              }
              placeholder="Tech"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-acid/40"
            >
              Add to queue
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Content review queue</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Course</th>
                  <th className="text-left">Reviewer</th>
                  <th className="text-left">Submitted</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderedReviewQueue.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border align-top last:border-0"
                  >
                    <td className="py-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.instructor} / {item.category}
                      </div>
                    </td>
                    <td>{item.reviewer}</td>
                    <td>{item.submittedAt}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {(["pending", "in_review", "approved", "changes_requested"] as const).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => {
                                updateReviewStatus(item.id, status);
                                toast.success(`Review moved to ${prettyStatus(status)}`);
                              }}
                              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                item.status === status
                                  ? "bg-acid text-acid-foreground"
                                  : "bg-secondary text-secondary-foreground hover:bg-accent"
                              }`}
                            >
                              {prettyStatus(status)}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Server health</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {state.servers.map((server) => (
              <div
                key={server.id}
                className="rounded-xl border border-border p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{server.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Load {server.load}%
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      server.status === "Healthy"
                        ? "bg-success/15 text-success"
                        : server.status === "Elevated"
                          ? "bg-warning/15 text-warning-foreground"
                          : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {server.status}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      server.status === "Healthy"
                        ? "bg-success"
                        : server.status === "Elevated"
                          ? "bg-warning"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${server.load}%` }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(["Healthy", "Elevated", "Critical"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateServer(server.id, {
                          status,
                          load:
                            status === "Healthy"
                              ? 42
                              : status === "Elevated"
                                ? 76
                                : 92,
                        });
                        toast.success(`${server.name} marked ${status}`);
                      }}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        server.status === status
                          ? "bg-acid text-acid-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function prettyStatus(status: ReviewStatus) {
  switch (status) {
    case "in_review":
      return "In review";
    case "changes_requested":
      return "Changes";
    case "approved":
      return "Approved";
    default:
      return "Pending";
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
      />
    </label>
  );
}
