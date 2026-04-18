import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Star, Play } from "lucide-react";
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
      { property: "og:description", content: "India's career-first learning platform. 50,000+ learners. 200+ courses. Real outcomes." },
    ],
  }),
  component: Landing,
});

const partners = ["RAZORPAY", "ZOMATO", "SWIGGY", "FLIPKART", "CRED", "MEESHO", "GROWW", "ZERODHA", "PHONEPE", "DREAM11"];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — editorial split */}
      <section className="relative overflow-hidden bg-gradient-hero grain">
        <div className="absolute inset-0 ring-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 md:pt-24 pb-20">
          {/* Top meta */}
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-acid blink" /> Cohort 14 · Live now</span>
            <span className="hidden sm:inline">Vol. 26 / Spring</span>
          </div>

          {/* Mega title */}
          <h1 className="mt-10 font-display text-[14vw] md:text-[10vw] leading-[0.86] tracking-tighter animate-fade-in">
            Learn the<br />
            <span className="italic text-acid">unteachable</span>.
          </h1>

          <div className="mt-12 grid md:grid-cols-12 gap-8 md:gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="md:col-span-5 md:col-start-1"
            >
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                A new kind of school for Indian creators, builders, and operators. Live cohorts, real projects, hiring partners — taught by people who actually shipped.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/student" className="group inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
                  Get Started <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <Link to="/courses" className="group inline-flex items-center gap-2 rounded-md border border-border bg-card/40 backdrop-blur px-5 py-3 text-sm font-semibold hover:border-acid/40 transition">
                  <Play className="h-3.5 w-3.5 fill-current" /> Browse 207 courses
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:col-span-6 md:col-start-7"
            >
              <div className="relative rounded-xl border border-border bg-card/60 backdrop-blur p-6 shadow-elegant">
                <div className="flex items-center justify-between mb-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> Recording · Live</span>
                  <span><LiveNumber value={2418} drift={0.003} /> watching</span>
                </div>
                <div className="aspect-video rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 ring-grid opacity-30 mix-blend-overlay" />
                  <div className="text-center text-white">
                    <div className="font-display italic text-4xl md:text-5xl leading-tight">Build a SaaS<br />in 30 days</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-mono">
                      <Play className="h-3 w-3 fill-current" /> EP. 04 / 30
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg leading-tight">Aarav Mehta</div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">ex-Razorpay · 12.4k students</div>
                  </div>
                  <div className="flex -space-x-2">
                    {["A","P","R","N","S"].map((c, i) => <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-semibold text-white">{c}</div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee partners */}
      <section className="border-y border-border bg-card/40 overflow-hidden py-6">
        <div className="flex gap-12 marquee whitespace-nowrap font-display text-3xl md:text-4xl text-muted-foreground/60">
          {[...partners, ...partners, ...partners].map((p, i) => (
            <span key={i} className="flex items-center gap-12">
              {p} <span className="text-acid">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Stats — big numbers */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {[
            { label: "Active learners", value: 50000, suffix: "+" },
            { label: "Courses live", value: 207, suffix: "" },
            { label: "Instructors", value: 154, suffix: "+" },
            { label: "Avg. rating", value: 4.8, suffix: "/5", format: (n: number) => n.toFixed(1) },
          ].map((s, i) => (
            <div key={i} className="border-l border-border pl-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">[ {String(i+1).padStart(2,"0")} ]</div>
              <div className="mt-2 font-display text-5xl md:text-6xl tracking-tight">
                <LiveNumber value={s.value} suffix={s.suffix} format={s.format} drift={0.001} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between gap-4 mb-12 border-b border-border pb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ FEATURED — APRIL ]</div>
            <h2 className="mt-3 font-display text-5xl md:text-6xl tracking-tighter">Hand-picked, this month.</h2>
          </div>
          <Link to="/courses" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold hover:text-acid transition group">
            View all <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => <CourseCard key={c.id} {...c} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ CATEGORIES ]</div>
              <h2 className="mt-3 font-display text-5xl tracking-tighter leading-none">Six worlds.<br /><span className="italic">One platform.</span></h2>
              <p className="mt-5 text-muted-foreground max-w-sm">Whatever you want to become, there's a track. Pick a discipline and we'll guide you from zero to hireable.</p>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-border">
              {categories.map((c) => (
                <Link
                  key={c.name}
                  to="/courses"
                  className="group relative bg-background p-6 hover:bg-card transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-acid text-2xl font-display">{c.icon}</div>
                    <div className="mt-3 font-display text-2xl tracking-tight group-hover:text-acid transition-colors">{c.name}</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">{c.count} courses</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-acid group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — pull-quote style */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid mb-3">[ FROM OUR LEARNERS ]</div>
        <h2 className="font-display text-5xl md:text-6xl tracking-tighter mb-14">Loved across India.</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-acid text-acid" />)}</div>
              <blockquote className="mt-5 font-display text-2xl leading-snug flex-1">"{t.text}"</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-acid text-acid-foreground flex items-center justify-center font-display">{t.name[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-acid text-acid-foreground p-10 md:p-16 grain">
          <div className="absolute inset-0 ring-grid opacity-20" />
          <div className="relative grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">[ ENROLLMENTS CLOSING APR 28 ]</div>
              <h2 className="mt-3 font-display text-5xl md:text-7xl leading-[0.88] tracking-tighter">Stop watching tutorials.<br /><span className="italic">Start shipping.</span></h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link to="/student" className="group inline-flex items-center gap-2 rounded-md bg-foreground text-background px-6 py-4 text-base font-semibold hover:opacity-90 transition">
                Claim your seat <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
