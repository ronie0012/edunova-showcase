import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Award, Bell, Calendar, PlayCircle, Target, ArrowUpRight } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "Student Dashboard — EduNova" }, { name: "description", content: "Your courses, progress and upcoming sessions on EduNova." }] }),
  component: StudentDashboard,
});

const myCourses = [
  { id: 1, title: "Full-Stack Web Dev Bootcamp", progress: 68, next: "Module 12: REST APIs" },
  { id: 4, title: "Data Science with Python", progress: 32, next: "Module 4: Pandas Deep Dive" },
  { id: 6, title: "Public Speaking & Confidence", progress: 91, next: "Final Project Submission" },
];

const sessions = [
  { id: 1, title: "Live Q&A: Career in Tech", date: "Today, 7:00 PM", host: "Aarav Mehta" },
  { id: 2, title: "Workshop: Figma to Code", date: "Tomorrow, 6:30 PM", host: "Priya Sharma" },
  { id: 3, title: "Capstone Submission Deadline", date: "Apr 22, 11:59 PM", host: "Auto" },
];

const badges = [
  { name: "Fast Starter", icon: "⚡" },
  { name: "7-Day Streak", icon: "🔥" },
  { name: "Top 10% Quiz", icon: "🧠" },
  { name: "First Project", icon: "🚀" },
];

const notifications = [
  { text: "Your assignment 'Todo App in React' was graded — A+", time: "2h ago" },
  { text: "Aarav replied to your question in Module 11", time: "5h ago" },
  { text: "New course recommended: Advanced TypeScript Patterns", time: "1d ago" },
];

function StudentDashboard() {
  const [rsvp, setRsvp] = useState<Record<number, boolean>>({});
  return (
    <DashboardLayout role="student" title="Student dashboard">
      {/* Welcome */}
      <div className="relative rounded-xl bg-acid text-acid-foreground p-6 md:p-10 overflow-hidden grain">
        <div className="absolute inset-0 ring-grid opacity-20" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">[ APR 18 · TUESDAY ]</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl tracking-tighter leading-none">Welcome back, <span className="italic">Ananya</span>.</h2>
            <p className="mt-3 text-sm opacity-80 max-w-md">You're 68% through Full-Stack Bootcamp. Two modules to your first job-ready project.</p>
          </div>
          <div className="flex gap-8">
            <div><div className="font-display text-4xl"><LiveNumber value={42} /></div><div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Hours · this month</div></div>
            <div><div className="font-display text-4xl"><LiveNumber value={7} /></div><div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Day streak</div></div>
            <div><div className="font-display text-4xl">3</div><div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Active courses</div></div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* My courses */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl flex items-center gap-2"><PlayCircle className="h-5 w-5 text-acid" />My Courses</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">3 in progress</span>
          </div>
          <div className="space-y-4">
            {myCourses.map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-4 hover:border-acid/40 transition group">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-display text-lg">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">Up next · {c.next}</div>
                  </div>
                  <button
                    onClick={() => toast.success(`Resuming · ${c.title}`)}
                    className="group/r rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 hover:bg-acid hover:text-acid-foreground transition"
                  >
                    Resume <ArrowUpRight className="h-3 w-3 transition-transform group-hover/r:rotate-45" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-acid rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="font-mono text-xs w-10 text-right">{c.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-display text-xl flex items-center gap-2 mb-5"><Bell className="h-5 w-5 text-acid" />Notifications</h3>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="rounded-md bg-muted/40 border border-border/50 p-3">
                <div className="text-sm">{n.text}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">{n.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <h3 className="font-display text-xl flex items-center gap-2 mb-5"><Calendar className="h-5 w-5 text-acid" />Upcoming sessions & deadlines</h3>
          <div className="divide-y divide-border">
            {sessions.map((s) => {
              const going = rsvp[s.id];
              return (
                <div key={s.id} className="py-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-md bg-accent flex flex-col items-center justify-center text-acid">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.date} · {s.host}</div>
                  </div>
                  <button
                    onClick={() => {
                      setRsvp((p) => ({ ...p, [s.id]: !p[s.id] }));
                      toast.success(going ? "RSVP cancelled" : `You're in · ${s.title}`);
                    }}
                    className={`text-xs font-semibold rounded-md px-3 py-1.5 transition ${going ? "bg-acid text-acid-foreground" : "border border-border hover:border-acid/40"}`}
                  >
                    {going ? "Going ✓" : "RSVP"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-display text-xl flex items-center gap-2 mb-5"><Award className="h-5 w-5 text-acid" />Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div key={b.name} className="rounded-lg bg-gradient-soft border border-border p-4 text-center hover:border-acid/40 transition">
                <div className="text-3xl">{b.icon}</div>
                <div className="text-xs font-semibold mt-2">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-6 border-b border-border pb-4">
          <h3 className="font-display text-3xl flex items-center gap-2"><Target className="h-5 w-5 text-acid" />Recommended for you</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">[ Based on your progress ]</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => <CourseCard key={c.id} {...c} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
