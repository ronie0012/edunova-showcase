import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Award, Bell, BookOpen, Calendar, PlayCircle, Target, ArrowUpRight } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useEnrollments } from "@/lib/enrollments";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "Student Dashboard — EduNova" }, { name: "description", content: "Your courses, progress and upcoming sessions on EduNova." }] }),
  component: StudentDashboard,
});

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

/** Format today's date as "APR 18 · TUESDAY" */
function formatTodayLabel() {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = now.getDate();
  const weekday = now.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
  return `${month} ${day} · ${weekday}`;
}

function StudentDashboard() {
  const [rsvp, setRsvp] = useState<Record<number, boolean>>({});
  const { user } = useAuth();
  const { enrollments } = useEnrollments(user?.email);

  const myCourses = useMemo(() => {
    return enrollments
      .map((e) => {
        const c = courses.find((x) => x.id === e.courseId);
        if (!c) return null;
        return {
          id: c.id,
          title: c.title,
          progress: e.progress || 5,
          next: "Module 1: Get started",
        };
      })
      .filter(Boolean) as { id: number; title: string; progress: number; next: string }[];
  }, [enrollments]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const todayLabel = formatTodayLabel();

  return (
    <DashboardLayout role="student" title="Student dashboard">
      {/* Welcome banner */}
      <div className="relative rounded-xl bg-acid text-acid-foreground p-6 md:p-10 overflow-hidden grain">
        <div className="absolute inset-0 ring-grid opacity-20" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">[ {todayLabel} ]</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl tracking-tighter leading-none">
              Welcome back, <span className="italic">{firstName}</span>.
            </h2>
            <p className="mt-3 text-sm opacity-80 max-w-md">
              {myCourses.length > 0
                ? `You have ${myCourses.length} course${myCourses.length > 1 ? "s" : ""} in progress. Keep the momentum going!`
                : "You haven't enrolled in any courses yet. Browse our catalog to get started!"}
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="font-display text-4xl"><LiveNumber value={myCourses.length > 0 ? 42 : 0} /></div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Hours · this month</div>
            </div>
            <div>
              <div className="font-display text-4xl"><LiveNumber value={myCourses.length > 0 ? 7 : 0} /></div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Day streak</div>
            </div>
            <div>
              <div className="font-display text-4xl">{myCourses.length}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">Active courses</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* My courses */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-acid" />My Courses
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {myCourses.length} in progress
            </span>
          </div>

          {myCourses.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <div className="font-display text-xl">No courses yet</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our catalog and enroll in a course to start learning.
              </p>
              <Link
                to="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                Browse courses <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myCourses.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-4 hover:border-acid/40 transition group">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-display text-lg">{c.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">
                        Up next · {c.next}
                      </div>
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
          )}
        </div>

        {/* Notifications */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h3 className="font-display text-xl flex items-center gap-2 mb-5">
            <Bell className="h-5 w-5 text-acid" />Notifications
          </h3>
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
          <h3 className="font-display text-xl flex items-center gap-2 mb-5">
            <Calendar className="h-5 w-5 text-acid" />Upcoming sessions &amp; deadlines
          </h3>
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
          <h3 className="font-display text-xl flex items-center gap-2 mb-5">
            <Award className="h-5 w-5 text-acid" />Achievements
          </h3>
          {myCourses.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              <div className="text-3xl mb-2">🏆</div>
              Enroll in a course to start earning badges.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.name} className="rounded-lg bg-gradient-soft border border-border p-4 text-center hover:border-acid/40 transition">
                  <div className="text-3xl">{b.icon}</div>
                  <div className="text-xs font-semibold mt-2">{b.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-6 border-b border-border pb-4">
          <h3 className="font-display text-3xl flex items-center gap-2">
            <Target className="h-5 w-5 text-acid" />Recommended for you
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">[ Based on your profile ]</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => <CourseCard key={c.id} {...c} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
