import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { campaigns, funnel, inr } from "@/lib/data";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";
import { LiveNumber } from "@/components/LiveNumber";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({ meta: [{ title: "Marketing Dashboard — EduNova Admin" }, { name: "description", content: "Active campaigns, funnel and ROI across Google Ads, Meta, Email, Referrals, and SEO." }] }),
  component: Marketing,
});

function Marketing() {
  const totalSpend = campaigns.reduce((a, c) => a + c.spend, 0);
  const totalConv = campaigns.reduce((a, c) => a + c.conversions, 0);
  const cac = totalSpend / totalConv;
  const ltv = 4200;
  const max = Math.max(...funnel.map((f) => f.value));

  return (
    <DashboardLayout role="admin" title="Marketing Dashboard">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Campaigns", value: 5 },
          { label: "Total Spend", value: totalSpend, prefix: "₹" },
          { label: "Conversions", value: totalConv },
          { label: "Marketing ROI", value: ((ltv * totalConv - totalSpend) / totalSpend) * 100, suffix: "%", format: (n: number) => n.toFixed(0) },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-2xl font-bold"><LiveNumber value={s.value} prefix={s.prefix} suffix={s.suffix} format={s.format} drift={0.002} /></div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Active Campaign Strategies (5)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div key={c.channel} className="rounded-xl border border-border overflow-hidden hover:shadow-card transition">
              <div className={`h-2 bg-gradient-to-r ${c.color}`} />
              <div className="p-5">
                <div className="font-semibold">{c.channel}</div>
                <div className="mt-3 text-2xl font-bold">{inr(c.spend)} <span className="text-xs font-normal text-muted-foreground">spend</span></div>
                <div className="mt-2 text-xs text-muted-foreground">{c.metric1}</div>
                <div className="text-xs text-muted-foreground">{c.metric2}</div>
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Conversions</span>
                  <span className="font-bold text-success">{c.conversions}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">CAC: {c.spend === 0 ? "₹0 (organic)" : inr(Math.round(c.spend / c.conversions))}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-gradient-soft border border-border p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground"><TrendingUp className="h-6 w-6" /></div>
          <div className="flex-1">
            <div className="font-semibold">Total Marketing ROI: {(((ltv * totalConv - totalSpend) / totalSpend) * 100).toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">{inr(totalSpend)} spend → {totalConv.toLocaleString("en-IN")} conversions → ~{inr(ltv * totalConv)} projected LTV revenue</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnel.map((f, i) => {
              const pct = (f.value / max) * 100;
              const conv = i > 0 ? ((f.value / funnel[i-1].value) * 100).toFixed(1) : "100";
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="font-medium">{f.stage}</span><span className="text-muted-foreground">{f.value.toLocaleString("en-IN")} <span className="text-success">({conv}%)</span></span></div>
                  <div className="h-9 rounded-lg bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-lg flex items-center justify-end pr-3 text-xs font-semibold text-primary-foreground transition-all duration-1000" style={{ width: `${pct}%` }}>{pct.toFixed(0)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social previews */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500" />
              <div><div className="font-semibold text-sm">@edunova.in</div><div className="text-xs text-muted-foreground">Sponsored · Instagram</div></div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-primary-foreground text-2xl font-bold p-6 text-center">Career switch in 90 days. Live cohort starts Apr 28.</div>
            <div className="p-3 flex items-center gap-4 text-muted-foreground text-sm"><Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Share2 className="h-5 w-5" /></div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">in</div>
              <div><div className="font-semibold text-sm">EduNova</div><div className="text-xs text-muted-foreground">Promoted · LinkedIn</div></div>
            </div>
            <p className="text-sm">"73% of our Bootcamp grads land roles within 90 days. Here's the playbook ↓" — Read the 2026 Career Report.</p>
            <div className="mt-3 rounded-lg bg-muted aspect-[1.91/1] flex items-center justify-center text-muted-foreground text-sm">2026 Career Report Preview</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
