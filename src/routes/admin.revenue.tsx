import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { revenueStreams, monthlyRevenue, topCourses, inr } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue Dashboard — EduNova Admin" }, { name: "description", content: "Revenue streams, monthly trend, and top courses across the 5 standard revenue models." }] }),
  component: Revenue,
});

function Revenue() {
  const total = revenueStreams.reduce((a, b) => a + b.amount, 0);
  return (
    <DashboardLayout role="admin" title="Revenue Dashboard">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
          <div className="text-sm opacity-90">Total Revenue · April 2026</div>
          <div className="mt-2 text-4xl md:text-5xl font-bold"><LiveNumber value={2845000} prefix="₹" drift={0.001} /></div>
          <div className="mt-2 text-sm opacity-90">▲ 8.6% vs last month</div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="text-xs text-muted-foreground">Annual Run Rate</div>
          <div className="mt-1 text-2xl font-bold">{inr(34140000)}</div>
          <div className="mt-4 text-xs text-muted-foreground">Paying customers</div>
          <div className="mt-1 text-2xl font-bold"><LiveNumber value={11420} drift={0.0008} /></div>
        </div>
      </div>

      {/* 5 revenue models */}
      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <h3 className="font-bold text-lg">Revenue Streams — 5 Standard Models</h3>
        <p className="text-sm text-muted-foreground mt-1">Each stream is mapped to a textbook revenue model and contributes to monthly revenue.</p>
        <div className="mt-5 grid lg:grid-cols-5 gap-4">
          {revenueStreams.map((r) => (
            <div key={r.model} className="rounded-xl border border-border p-4 hover:shadow-card transition">
              <div className="h-1.5 w-10 rounded-full" style={{ background: r.color }} />
              <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">{r.model}</div>
              <div className="mt-1 text-sm text-muted-foreground">{r.desc}</div>
              <div className="mt-3 text-xl font-bold">{inr(r.amount)}</div>
              <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full" style={{ width: `${(r.amount / total) * 100}%`, background: r.color }} /></div>
              <div className="text-[10px] text-muted-foreground mt-1">{((r.amount / total) * 100).toFixed(1)}% of total</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Monthly Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => inr(Number(v))} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-primary)" }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Stream Mix</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={revenueStreams} dataKey="amount" nameKey="model" outerRadius={90} animationDuration={900}>
                  {revenueStreams.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Top 5 Revenue-Generating Courses</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">#</th><th className="text-left">Course</th><th className="text-right">Sales</th><th className="text-right">Revenue</th><th className="text-right">% of total</th></tr>
              </thead>
              <tbody>
                {topCourses.map((c, i) => (
                  <tr key={c.title} className="border-b border-border last:border-0">
                    <td className="py-3 text-muted-foreground">{i + 1}</td>
                    <td className="font-medium">{c.title}</td>
                    <td className="text-right">{c.sales}</td>
                    <td className="text-right font-semibold">{inr(c.revenue)}</td>
                    <td className="text-right text-muted-foreground">{((c.revenue / 2845000) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
