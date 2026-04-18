import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Star, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { inr } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";
import { toast } from "sonner";

export const Route = createFileRoute("/instructor")({
  head: () => ({ meta: [{ title: "Instructor Dashboard — EduNova" }, { name: "description", content: "Manage your courses, students and earnings on EduNova." }] }),
  component: InstructorDashboard,
});

const myCourses = [
  { title: "Full-Stack Web Dev Bootcamp", students: 12480, revenue: 542000, rating: 4.9 },
  { title: "Advanced React Patterns", students: 4210, revenue: 198000, rating: 4.8 },
  { title: "Node.js Microservices", students: 2820, revenue: 142000, rating: 4.7 },
];

const earnings = [
  { month: "Nov", value: 380000 },
  { month: "Dec", value: 420000 },
  { month: "Jan", value: 510000 },
  { month: "Feb", value: 540000 },
  { month: "Mar", value: 620000 },
  { month: "Apr", value: 720000 },
];

const feedback = [
  { course: "Full-Stack Web Dev", positive: 92, themes: ["clear explanations", "great projects", "fast support"] },
  { course: "Advanced React Patterns", positive: 88, themes: ["deep content", "could use more exercises"] },
  { course: "Node.js Microservices", positive: 84, themes: ["practical", "needs updated dependencies"] },
];

function InstructorDashboard() {
  const [modal, setModal] = useState(false);
  return (
    <DashboardLayout role="instructor" title="Instructor dashboard">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students", value: 19510 },
          { label: "Avg Rating", value: 4.83, format: (n: number) => n.toFixed(2) },
          { label: "Active Courses", value: 3 },
          { label: "This Month", value: 720000, prefix: "₹" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-5">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-2xl font-bold"><LiveNumber value={s.value} prefix={s.prefix} format={s.format} drift={0.0015} /></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">My Courses</h3>
            <button onClick={() => setModal(true)} className="inline-flex items-center gap-1 rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1.5 text-sm font-semibold"><Plus className="h-4 w-4" />Upload Course</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr><th className="text-left py-2">Course</th><th className="text-right">Students</th><th className="text-right">Revenue</th><th className="text-right">Rating</th></tr>
              </thead>
              <tbody>
                {myCourses.map((c) => (
                  <tr key={c.title} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{c.title}</td>
                    <td className="text-right">{c.students.toLocaleString("en-IN")}</td>
                    <td className="text-right font-semibold">{inr(c.revenue)}</td>
                    <td className="text-right"><span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{c.rating}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant flex flex-col">
          <div className="flex items-center gap-2 text-sm opacity-90"><TrendingUp className="h-4 w-4" />Top Performer</div>
          <div className="mt-3 text-xl font-bold">Full-Stack Web Dev Bootcamp</div>
          <div className="mt-2 text-sm opacity-90">12,480 enrolled · 4.9 ★</div>
          <div className="mt-auto pt-6">
            <div className="text-3xl font-bold">{inr(542000)}</div>
            <div className="text-xs opacity-80">earned this month</div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Earnings (last 6 months)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={earnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => inr(Number(v))} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold mb-4">Student Feedback</h3>
          <div className="space-y-4">
            {feedback.map((f) => (
              <div key={f.course}>
                <div className="flex justify-between text-sm font-medium"><span>{f.course}</span><span className="text-success">{f.positive}% positive</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-success" style={{ width: `${f.positive}%` }} /></div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {f.themes.map((t) => <span key={t} className="text-[10px] rounded-full bg-secondary text-secondary-foreground px-2 py-0.5">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Upload New Course</h3><button onClick={() => setModal(false)}><X className="h-5 w-5" /></button></div>
            <div className="space-y-3">
              <input className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Course title" />
              <textarea className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm h-24" placeholder="Description" />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Category" />
                <input className="rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Price ₹" />
              </div>
              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground">Drag & drop course videos here</div>
              <button onClick={() => { setModal(false); toast.success("Course submitted for review", { description: "We'll get back within 48h." }); }} className="w-full rounded-md bg-acid text-acid-foreground py-2.5 font-semibold hover:opacity-90 transition">Submit for Review</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
