import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  LifeBuoy,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveNumber } from "@/components/LiveNumber";
import { type TicketPriority, useAdminWorkspace } from "@/lib/admin";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Control Center - EduNova" },
      {
        name: "description",
        content:
          "Live CRM, support, and learner operations workspace for EduNova admins.",
      },
    ],
  }),
  component: AdminControlCenter,
});

const categoryColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function AdminControlCenter() {
  const {
    users,
    state,
    ticketCategories,
    ticketMetrics,
    userMetrics,
    orderedIncidents,
    createTicket,
    updateTicketStatus,
    updateIncidentStatus,
    addFeedbackAction,
    updateChurnAction,
  } = useAdminWorkspace();

  const [ticketForm, setTicketForm] = useState({
    customerName: "",
    email: "",
    category: "Payment Issues",
    subject: "",
    priority: "medium" as TicketPriority,
  });
  const [feedbackForm, setFeedbackForm] = useState({
    trigger: "",
    action: "",
    outcome: "",
  });
  const [churnDrafts, setChurnDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(defaultChurnDrafts(state.churnRisks))
  );

  const recentUsers = useMemo(() => [...users].slice(-5).reverse(), [users]);
  const ticketTotal = ticketMetrics.total || 1;
  const activeChurnDrafts = Object.fromEntries(defaultChurnDrafts(state.churnRisks, churnDrafts));

  const runAdminAction = async (
    action: () => Promise<void>,
    successMessage: string,
    failureMessage: string
  ) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, failureMessage));
    }
  };

  return (
    <DashboardLayout role="admin" title="Admin control center">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Registered users",
            value: userMetrics.registeredUsers,
            icon: Users,
          },
          {
            label: "Paying learners",
            value: userMetrics.payingStudents,
            icon: ShieldCheck,
          },
          {
            label: "Open tickets",
            value: ticketMetrics.open,
            icon: LifeBuoy,
          },
          {
            label: "Admin accounts",
            value: userMetrics.admins,
            icon: UserPlus,
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 text-2xl font-bold">
                <LiveNumber value={stat.value} drift={0.0015} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Support health</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Live from the persisted admin workspace.
              </p>
            </div>
            <LifeBuoy className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricPill
              label="Resolution rate"
              value={`${ticketMetrics.resolutionRate.toFixed(0)}%`}
            />
            <MetricPill
              label="Avg response"
              value={`${ticketMetrics.averageResponseTime.toFixed(1)}h`}
            />
            <MetricPill label="CSAT" value={`${ticketMetrics.csat.toFixed(1)}/5`} />
            <MetricPill
              label="Registered to paid"
              value={`${userMetrics.conversionRate.toFixed(0)}%`}
            />
          </div>

          <div className="mt-6 h-64">
            {ticketCategories.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={ticketCategories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {ticketCategories.map((category, index) => (
                      <Cell
                        key={category.name}
                        fill={categoryColors[index % categoryColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `${value} (${((Number(value) / ticketTotal) * 100).toFixed(0)}%)`
                    }
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                No tickets yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">Support inbox</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Triage, resolve, and keep the queue moving.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {ticketMetrics.total} total tickets
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {state.tickets.length === 0 ? (
              <EmptyCard text="Create the first support ticket to start the workflow." />
            ) : (
              state.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {ticket.customerName} / {ticket.email} / {ticket.category}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone={ticket.priority}>{ticket.priority}</Pill>
                      <Pill tone={ticket.status}>{ticket.status}</Pill>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(["open", "pending", "resolved"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          void runAdminAction(
                            () => updateTicketStatus(ticket.id, status),
                            `Ticket moved to ${status}`,
                            "Unable to update ticket status."
                          );
                        }}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                          ticket.status === status
                            ? "bg-acid text-acid-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Create support ticket</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            This persists in the shared demo workspace, just like auth and enrollments.
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();

              if (
                !ticketForm.customerName.trim() ||
                !ticketForm.email.trim() ||
                !ticketForm.subject.trim()
              ) {
                toast.error("Fill in the customer, email, and subject.");
                return;
              }

              void runAdminAction(
                async () => {
                  await createTicket(ticketForm);
                  setTicketForm({
                    customerName: "",
                    email: "",
                    category: "Payment Issues",
                    subject: "",
                    priority: "medium",
                  });
                },
                "Support ticket created",
                "Unable to create support ticket."
              );
            }}
          >
            <Field
              label="Customer"
              value={ticketForm.customerName}
              onChange={(value) =>
                setTicketForm((current) => ({ ...current, customerName: value }))
              }
              placeholder="A learner name"
            />
            <Field
              label="Email"
              value={ticketForm.email}
              onChange={(value) =>
                setTicketForm((current) => ({ ...current, email: value }))
              }
              placeholder="learner@example.com"
              type="email"
            />
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <select
                value={ticketForm.category}
                onChange={(event) =>
                  setTicketForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
              >
                {[
                  "Payment Issues",
                  "Course Quality",
                  "Technical Bugs",
                  "Refund Requests",
                  "Other",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Priority
              </span>
              <select
                value={ticketForm.priority}
                onChange={(event) =>
                  setTicketForm((current) => ({
                    ...current,
                    priority: event.target.value as TicketPriority,
                  }))
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
              >
                {(["low", "medium", "high", "critical"] as const).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Subject"
              value={ticketForm.subject}
              onChange={(value) =>
                setTicketForm((current) => ({ ...current, subject: value }))
              }
              placeholder="Short description of the issue"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-acid px-4 py-2.5 text-sm font-semibold text-acid-foreground transition hover:opacity-90"
            >
              Add ticket
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Incident center
          </h3>
          <div className="mt-4 space-y-3">
            {orderedIncidents.map((incident) => (
              <div key={incident.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{incident.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {incident.reports} reports / owner: {incident.owner}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Updated {incident.updatedAt}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={incident.severity}>{incident.severity}</Pill>
                    <Pill tone={incident.status}>{incident.status}</Pill>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["in_progress", "monitoring", "resolved"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        void runAdminAction(
                          () => updateIncidentStatus(incident.id, status),
                          `Incident moved to ${status}`,
                          "Unable to update incident status."
                        );
                      }}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        incident.status === status
                          ? "bg-acid text-acid-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Feedback loop</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Capture what triggered the change and what happened next.
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();

              if (
                !feedbackForm.trigger.trim() ||
                !feedbackForm.action.trim() ||
                !feedbackForm.outcome.trim()
              ) {
                toast.error("Fill in trigger, action, and outcome.");
                return;
              }

              void runAdminAction(
                async () => {
                  await addFeedbackAction(feedbackForm);
                  setFeedbackForm({ trigger: "", action: "", outcome: "" });
                },
                "Feedback action logged",
                "Unable to log feedback action."
              );
            }}
          >
            <Field
              label="Trigger"
              value={feedbackForm.trigger}
              onChange={(value) =>
                setFeedbackForm((current) => ({ ...current, trigger: value }))
              }
              placeholder="What trend or complaint surfaced?"
            />
            <Field
              label="Action"
              value={feedbackForm.action}
              onChange={(value) =>
                setFeedbackForm((current) => ({ ...current, action: value }))
              }
              placeholder="What did the team ship?"
            />
            <Field
              label="Outcome"
              value={feedbackForm.outcome}
              onChange={(value) =>
                setFeedbackForm((current) => ({ ...current, outcome: value }))
              }
              placeholder="What changed afterwards?"
            />
            <button
              type="submit"
              className="w-full rounded-md border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-acid/40"
            >
              Add feedback action
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {state.feedbackActions.map((entry) => (
              <div key={entry.id} className="rounded-xl bg-muted/30 p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-destructive">
                  Trigger
                </div>
                <div className="mt-1">{entry.trigger}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  Action
                </div>
                <div className="mt-1">{entry.action}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-success">
                  Outcome
                </div>
                <div className="mt-1">{entry.outcome}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Churn watchlist</h3>
          <div className="mt-4 space-y-3">
            {state.churnRisks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-warning/30 bg-warning/10 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{risk.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {risk.email} / {risk.lastActive}
                    </div>
                  </div>
                  <Pill tone="warning">{risk.reason}</Pill>
                </div>
                <input
                  value={activeChurnDrafts[risk.id]}
                  onChange={(event) =>
                    setChurnDrafts((current) => ({
                      ...current,
                      [risk.id]: event.target.value,
                    }))
                  }
                  className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    void runAdminAction(
                      () => updateChurnAction(risk.id, activeChurnDrafts[risk.id]),
                      `${risk.name}'s retention action updated`,
                      "Unable to save the churn action."
                    );
                  }}
                  className="mt-3 rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition hover:bg-accent"
                >
                  Save action
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Recent users</h3>
          <div className="mt-4 space-y-3">
            {recentUsers.length === 0 ? (
              <EmptyCard text="No registered users yet." />
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Pill tone={user.isAdmin ? "resolved" : "open"}>
                    {user.isAdmin ? "admin" : "learner"}
                  </Pill>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function defaultChurnDrafts(
  risks: Array<{ id: string; action: string }>,
  drafts: Record<string, string> = {}
) {
  return risks.map((risk) => [risk.id, drafts[risk.id] ?? risk.action] as const);
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm"
      />
    </label>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: ReactNode;
  tone:
    | "low"
    | "medium"
    | "high"
    | "critical"
    | "open"
    | "pending"
    | "resolved"
    | "in_progress"
    | "monitoring"
    | "warning";
}) {
  const palette: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-primary/15 text-primary",
    high: "bg-warning/15 text-warning-foreground",
    critical: "bg-destructive/15 text-destructive",
    open: "bg-primary/15 text-primary",
    pending: "bg-warning/15 text-warning-foreground",
    resolved: "bg-success/15 text-success",
    in_progress: "bg-warning/15 text-warning-foreground",
    monitoring: "bg-secondary text-secondary-foreground",
    warning: "bg-warning/15 text-warning-foreground",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${palette[tone]}`}
    >
      {children}
    </span>
  );
}
