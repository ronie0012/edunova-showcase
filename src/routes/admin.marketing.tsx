import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, MousePointerClick, Target, Wallet } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveNumber } from "@/components/LiveNumber";
import { getErrorMessage } from "@/lib/errors";
import { useAdminWorkspace } from "@/lib/admin";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({
    meta: [
      { title: "Marketing Dashboard - EduNova Admin" },
      {
        name: "description",
        content:
          "Campaign planning, funnel performance, and ROI tracking for EduNova.",
      },
    ],
  }),
  component: MarketingDashboard,
});

function MarketingDashboard() {
  const {
    state,
    marketingMetrics,
    createCampaign,
    toggleCampaign,
    bumpCampaignConversions,
  } = useAdminWorkspace();
  const [form, setForm] = useState({
    channel: "",
    spend: "",
    impressions: "",
    clicks: "",
    signups: "",
    conversions: "",
  });

  const maxFunnelValue = useMemo(
    () => Math.max(...marketingMetrics.funnel.map((item) => item.value), 1),
    [marketingMetrics.funnel]
  );

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
    <DashboardLayout role="admin" title="Marketing dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active campaigns"
          value={<LiveNumber value={marketingMetrics.activeCampaigns} />}
          icon={Megaphone}
        />
        <StatCard
          label="Spend"
          value={<LiveNumber value={marketingMetrics.spend} prefix="Rs " />}
          icon={Wallet}
        />
        <StatCard
          label="CAC"
          value={
            <LiveNumber
              value={marketingMetrics.cac}
              prefix="Rs "
              format={(value) => Math.round(value).toLocaleString("en-IN")}
            />
          }
          icon={Target}
        />
        <StatCard
          label="ROI"
          value={
            <LiveNumber
              value={marketingMetrics.roi}
              suffix="%"
              format={(value) => value.toFixed(0)}
            />
          }
          icon={MousePointerClick}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Campaign board</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Pause, resume, or record fresh conversions.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              {state.campaigns.length} tracked channels
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {state.campaigns.map((campaign) => {
              const ctr =
                campaign.impressions > 0
                  ? (campaign.clicks / campaign.impressions) * 100
                  : 0;
              const conversionRate =
                campaign.signups > 0
                  ? (campaign.conversions / campaign.signups) * 100
                  : 0;

              return (
                <div key={campaign.id} className="rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{campaign.channel}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Spend {formatCurrency(campaign.spend)}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        campaign.status === "active"
                          ? "bg-success/15 text-success"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <MiniMetric
                      label="Impressions"
                      value={campaign.impressions.toLocaleString("en-IN")}
                    />
                    <MiniMetric
                      label="Clicks"
                      value={campaign.clicks.toLocaleString("en-IN")}
                    />
                    <MiniMetric label="CTR" value={`${ctr.toFixed(1)}%`} />
                    <MiniMetric
                      label="Paid conversion"
                      value={`${conversionRate.toFixed(1)}%`}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        void runAdminAction(
                          () => toggleCampaign(campaign.id),
                          campaign.status === "active"
                            ? "Campaign paused"
                            : "Campaign reactivated",
                          "Unable to update campaign status."
                        );
                      }}
                      className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition hover:bg-accent"
                    >
                      {campaign.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => {
                        void runAdminAction(
                          () => bumpCampaignConversions(campaign.id),
                          "Recorded one more conversion",
                          "Unable to update campaign conversions."
                        );
                      }}
                      className="rounded-md bg-acid px-3 py-1.5 text-xs font-semibold text-acid-foreground transition hover:opacity-90"
                    >
                      Add conversion
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Create campaign</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a new channel and it will instantly affect ROI and funnel stats.
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();

              if (!form.channel.trim()) {
                toast.error("Channel name is required.");
                return;
              }

              void runAdminAction(
                async () => {
                  await createCampaign({
                    channel: form.channel,
                    spend: Number(form.spend) || 0,
                    impressions: Number(form.impressions) || 0,
                    clicks: Number(form.clicks) || 0,
                    signups: Number(form.signups) || 0,
                    conversions: Number(form.conversions) || 0,
                  });

                  setForm({
                    channel: "",
                    spend: "",
                    impressions: "",
                    clicks: "",
                    signups: "",
                    conversions: "",
                  });
                },
                "Campaign added to the board",
                "Unable to create campaign."
              );
            }}
          >
            <Field
              label="Channel"
              value={form.channel}
              onChange={(value) =>
                setForm((current) => ({ ...current, channel: value }))
              }
              placeholder="YouTube creators"
            />
            <Field
              label="Spend"
              value={form.spend}
              onChange={(value) =>
                setForm((current) => ({ ...current, spend: value }))
              }
              placeholder="15000"
              type="number"
            />
            <Field
              label="Impressions"
              value={form.impressions}
              onChange={(value) =>
                setForm((current) => ({ ...current, impressions: value }))
              }
              placeholder="42000"
              type="number"
            />
            <Field
              label="Clicks"
              value={form.clicks}
              onChange={(value) =>
                setForm((current) => ({ ...current, clicks: value }))
              }
              placeholder="2800"
              type="number"
            />
            <Field
              label="Signups"
              value={form.signups}
              onChange={(value) =>
                setForm((current) => ({ ...current, signups: value }))
              }
              placeholder="420"
              type="number"
            />
            <Field
              label="Conversions"
              value={form.conversions}
              onChange={(value) =>
                setForm((current) => ({ ...current, conversions: value }))
              }
              placeholder="95"
              type="number"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-acid px-4 py-2.5 text-sm font-semibold text-acid-foreground transition hover:opacity-90"
            >
              Add campaign
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Funnel</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Aggregated from every tracked campaign.
          </p>
          <div className="mt-5 space-y-3">
            {marketingMetrics.funnel.map((item, index) => {
              const percentage = (item.value / maxFunnelValue) * 100;
              const previous =
                index === 0 ? item.value : marketingMetrics.funnel[index - 1].value;
              const stageConversion = previous > 0 ? (item.value / previous) * 100 : 0;

              return (
                <div key={item.stage}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">
                      {item.value.toLocaleString("en-IN")} ({stageConversion.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-9 overflow-hidden rounded-lg bg-muted">
                    <div
                      className="flex h-full items-center justify-end rounded-lg bg-gradient-primary pr-3 text-xs font-semibold text-primary-foreground"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-semibold">Performance snapshot</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Snapshot
              label="CTR"
              value={`${marketingMetrics.clickThroughRate.toFixed(2)}%`}
            />
            <Snapshot
              label="Signup rate"
              value={`${marketingMetrics.signupRate.toFixed(2)}%`}
            />
            <Snapshot
              label="Paid conversion"
              value={`${marketingMetrics.conversionRate.toFixed(2)}%`}
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function formatCurrency(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: typeof Megaphone;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
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
