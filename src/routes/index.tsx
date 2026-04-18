import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users, BookOpen, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { LiveNumber } from "@/components/LiveNumber";
import { courses, categories, testimonials } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduNova — Learn Without Limits" },
      { name: "description", content: "Premium e-education platform with 200+ expert-led courses across tech, business, design, marketing, finance and personal development." },
      { property: "og:title", content: "EduNova — Learn Without Limits" },
      { property: "og:description", content: "Premium e-education platform built for India. 50,000+ learners, 200+ courses." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> India's #1 Career-First Learning Platform
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Master skills.<br />
              <span className="text-gradient">Land the career</span><br />you actually want.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              Live mentorship, real projects, hiring partners. Start learning in minutes — pay only when you're ready.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/student" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-95 transition">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/courses" className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent transition">
                Browse Courses
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <div className="rounded-3xl bg-card shadow-elegant border border-border p-6 rotate-1">
              <div className="aspect-video rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                <Sparkles className="h-16 w-16 opacity-80" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Live: Build a SaaS in 30 days</div>
                  <div className="text-xs text-muted-foreground">2,418 learners online now</div>
                </div>
                <div className="flex -space-x-2">
                  {["A","P","R","N"].map((c, i) => <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{c}</div>)}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card border border-border shadow-card p-4 -rotate-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-success/15 flex items-center justify-center"><Award className="h-5 w-5 text-success" /></div>
                <div>
                  <div className="text-sm font-semibold">Certificate earned</div>
                  <div className="text-xs text-muted-foreground">+ shared on LinkedIn</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Students", value: 50000, suffix: "+" },
            { icon: BookOpen, label: "Courses", value: 207, suffix: "+" },
            { icon: Award, label: "Instructors", value: 154, suffix: "+" },
            { icon: Star, label: "Avg. Rating", value: 4.8, suffix: "/5", format: (n: number) => n.toFixed(1) },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="text-center">
                <div className="mx-auto h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
                <div className="mt-3 text-3xl font-bold tracking-tight"><LiveNumber value={s.value} suffix={s.suffix} format={s.format} drift={0.001} /></div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Featured courses</h2>
            <p className="mt-2 text-muted-foreground">Handpicked by our learning team this month.</p>
          </div>
          <Link to="/courses" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <CourseCard key={c.id} {...c} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Explore by category</h2>
          <p className="mt-2 text-center text-muted-foreground">Find your next passion across 6 disciplines.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c.name} className="group rounded-2xl bg-card border border-border p-6 flex items-center gap-4 hover:shadow-elegant hover:-translate-y-0.5 transition-all">
                <div className="text-4xl">{c.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold group-hover:text-primary transition-colors">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{c.count} courses</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Loved by learners across India</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}</div>
              <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">{t.name[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
