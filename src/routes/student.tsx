import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Award, Bell, Calendar, PlayCircle, Target } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/data";
import { LiveNumber } from "@/components/LiveNumber";

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
  { title: "Live Q&A: Career in Tech", date: "Today, 7:00 PM", host: "Aarav Mehta" },
  { title: "Workshop: Figma to Code", date: "Tomorrow, 6:30 PM", host: "Priya Sharma" },
  { title: "Capstone Submission Deadline", date: "Apr 22, 11:59 PM", host: "Auto" },
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
  return (
    <DashboardLayout role="student" title="Student Dashboard">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-primary p-6 md:p-8 text-primary-foreground shadow-elegant">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back, Ananya 👋</h2>
            <p className="opacity-90">You're 68% through Full-Stack Bootcamp. Keep going!</p>
          </div>
          <div className="flex gap-6">
            <div><div className="text-3xl font-bold"><LiveNumber value={42} /></div><div className="text-xs opacity-80">Hours this month</div></div>
            <div><div className="text-3xl font-bold"><LiveNumber value={7} /></div><div className="text-xs opacity-80">Day streak</div></div>
            <div><div className="text-3xl font-bold">3</div><div className="text-xs opacity-80">Active courses</div></div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* My courses */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" />My Courses</h3>
            <span className="text-xs text-muted-foreground">3 in progress</span>
          </div>
          <div className="space-y-4">
            {myCourses.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-4 hover:bg-muted/50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Up next: {c.next}</div>
                  </div>
                  <button className="rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold">Resume</button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="text-xs font-semibold w-10 text-right">{c.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-5"><Bell className="h-5 w-5 text-primary" />Notifications</h3>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-3">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-5"><Calendar className="h-5 w-5 text-primary" />Upcoming sessions & deadlines</h3>
          <div className="divide-y divide-border">
            {sessions.map((s, i) => (
              <div key={i} className="py-3 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.date} · {s.host}</div>
                </div>
                <button className="text-xs font-semibold text-primary">RSVP</button>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-5"><Award className="h-5 w-5 text-primary" />Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div key={b.name} className="rounded-xl bg-gradient-soft p-3 text-center">
                <div className="text-3xl">{b.icon}</div>
                <div className="text-xs font-semibold mt-1">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-8">
        <h3 className="font-semibold flex items-center gap-2 mb-4"><Target className="h-5 w-5 text-primary" />Recommended for you</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => <CourseCard key={c.id} {...c} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
