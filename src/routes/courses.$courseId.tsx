import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { courses, courseCurriculum, courseReviews, instructorBios, inr } from "@/lib/data";
import { Star, Users, Clock, Award, CheckCircle2, PlayCircle, ArrowUpRight, Share2, Heart, ChevronDown, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useEnrollments } from "@/lib/enrollments";

export const Route = createFileRoute("/courses/$courseId")({
  head: ({ params }) => {
    const course = courses.find((c) => String(c.id) === params.courseId);
    const title = course ? `${course.title} — EduNova` : "Course — EduNova";
    const desc = course ? `${course.title} by ${course.instructor}. ${course.hours} hours · ${course.level}. Join ${course.students.toLocaleString("en-IN")}+ learners.` : "Course details on EduNova.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const course = courses.find((c) => String(c.id) === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ 404 ]</div>
        <h1 className="mt-3 font-display text-6xl tracking-tighter">Course not found.</h1>
        <p className="mt-4 text-muted-foreground">It may have been retired, or the link is wrong.</p>
        <Link to="/courses" className="mt-8 inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-3 text-sm font-semibold">
          Browse all courses <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const course = courses.find((item) => String(item.id) === courseId);
  if (!course) return null;
  const bio = instructorBios[course.instructor] ?? { tagline: "Industry expert", bio: "Senior practitioner with years of shipping real products.", stats: [{ label: "Students", value: course.students.toLocaleString("en-IN") }, { label: "Rating", value: String(course.rating) }] };
  const totalHours = courseCurriculum.reduce((s, m) => s + m.hours, 0);
  const totalLessons = courseCurriculum.reduce((s, m) => s + m.lessons.length, 0);

  const [open, setOpen] = useState<number | null>(0);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolled } = useEnrollments(user?.email);
  const enrolled = isEnrolled(course.id);

  const related = courses.filter((c) => c.id !== course.id && c.category === course.category).slice(0, 3);
  const fallbackRelated = related.length ? related : courses.filter((c) => c.id !== course.id).slice(0, 3);

  const buyNow = () => {
    if (enrolled) {
      toast.success("You're already enrolled");
      navigate({ to: "/student" });
      return;
    }
    if (!user) {
      toast.message("Sign in to continue to checkout");
      navigate({ to: "/login", search: { redirect: `/checkout/${course.id}` } as never });
      return;
    }
    navigate({ to: "/checkout/$courseId", params: { courseId: String(course.id) } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero grain border-b border-border">
        <div className="absolute inset-0 ring-grid opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Link to="/" className="hover:text-acid">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-acid">Courses</Link>
            <span>/</span>
            <span className="text-acid">{course.category}</span>
          </nav>

          <div className="mt-6 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-[11px] font-mono uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-acid blink" /> {course.category} · {course.level}
              </div>
              <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95]">
                {course.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                A no-fluff, project-first course taught by {course.instructor}. {totalLessons} lessons across {courseCurriculum.length} modules — built for people who want to ship.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-acid text-acid" /><b>{course.rating}</b><span className="text-muted-foreground">({courseReviews.length * 312} reviews)</span></span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" />{course.students.toLocaleString("en-IN")} enrolled</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" />{totalHours}h · self-paced + live</span>
                <span className="flex items-center gap-1.5 text-muted-foreground"><Award className="h-4 w-4" />Certificate</span>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-acid text-acid-foreground flex items-center justify-center font-display text-lg">{course.instructor[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{course.instructor}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{bio.tagline}</div>
                </div>
              </div>
            </div>

            {/* Hero preview */}
            <div className="lg:col-span-5">
              <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${course.color} overflow-hidden shadow-elegant flex items-center justify-center`}>
                <div className="absolute inset-0 ring-grid opacity-30 mix-blend-overlay" />
                <button onClick={() => toast.message("Preview will start shortly…")} className="relative z-10 group flex flex-col items-center gap-3 text-white">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition">
                    <PlayCircle className="h-8 w-8 fill-white" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Watch 90s preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main */}
          <div className="lg:col-span-8 space-y-16">
            {/* What you'll learn */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ OUTCOMES ]</div>
              <h2 className="mt-2 font-display text-4xl tracking-tighter">What you'll walk away with.</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {[
                  "Ship a portfolio-grade capstone project",
                  "Speak the language of senior practitioners",
                  "Confidence to interview at top product companies",
                  "Hands-on review from the instructor",
                  "Lifetime access + future updates",
                  "Verified certificate + alumni network",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-4">
                    <CheckCircle2 className="h-5 w-5 text-acid shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ CURRICULUM ]</div>
                  <h2 className="mt-2 font-display text-4xl tracking-tighter">{courseCurriculum.length} modules · {totalLessons} lessons.</h2>
                </div>
                <div className="text-sm text-muted-foreground font-mono">{totalHours}h total</div>
              </div>

              <div className="mt-6 divide-y divide-border border border-border rounded-xl overflow-hidden bg-card/30">
                {courseCurriculum.map((m, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={m.module}>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-card transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="font-mono text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                          <div>
                            <div className="font-display text-xl">{m.module}</div>
                            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-0.5">{m.lessons.length} lessons · {m.hours}h</div>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-acid" : ""}`} />
                      </button>
                      {isOpen && (
                        <ul className="px-5 pb-5 space-y-2 animate-fade-in">
                          {m.lessons.map((l, j) => (
                            <li key={l} className="flex items-center gap-3 pl-12 text-sm text-muted-foreground">
                              <PlayCircle className="h-4 w-4 text-acid/70" />
                              <span className="flex-1">{l}</span>
                              <span className="font-mono text-xs">{String(Math.round(m.hours * 60 / m.lessons.length)).padStart(2, "0")} min</span>
                              {j === 0 && i === 0 && <span className="text-[10px] font-mono uppercase tracking-wider text-acid">Free</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ YOUR INSTRUCTOR ]</div>
              <h2 className="mt-2 font-display text-4xl tracking-tighter">Taught by {course.instructor}.</h2>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-display text-3xl">{course.instructor[0]}</div>
                  <div className="flex-1">
                    <div className="font-display text-2xl">{course.instructor}</div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">{bio.tagline}</div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{bio.bio}</p>
                    <div className="mt-5 grid grid-cols-3 gap-4">
                      {bio.stats.map((s) => (
                        <div key={s.label} className="border-l-2 border-acid pl-3">
                          <div className="font-display text-2xl leading-none">{s.value}</div>
                          <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ REVIEWS ]</div>
                  <h2 className="mt-2 font-display text-4xl tracking-tighter">What learners say.</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-acid text-acid" />
                  <span className="font-display text-2xl">{course.rating}</span>
                  <span className="text-sm text-muted-foreground">/ 5</span>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {courseReviews.map((r) => (
                  <div key={r.name} className="rounded-xl border border-border bg-card/40 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-acid text-acid-foreground flex items-center justify-center font-display">{r.name[0]}</div>
                        <div>
                          <div className="text-sm font-semibold">{r.name}</div>
                          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{r.role}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">{r.date}</div>
                    </div>
                    <div className="mt-3 flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-acid text-acid" />)}</div>
                    <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky enroll panel */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-elegant">
                <div className={`h-32 bg-gradient-to-br ${course.color} relative`}>
                  <div className="absolute inset-0 ring-grid opacity-20 mix-blend-overlay" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from wishlist" : "Saved to wishlist"); }}
                      className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                    >
                      <Heart className={`h-4 w-4 ${saved ? "fill-acid text-acid" : ""}`} />
                    </button>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}
                      className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-end gap-2">
                    <div className="font-display text-5xl leading-none">{inr(course.price)}</div>
                    <div className="text-sm text-muted-foreground line-through pb-1">{inr(Math.round(course.price * 1.6))}</div>
                  </div>
                  <div className="mt-1 text-xs font-mono uppercase tracking-wider text-acid">37% off · Closes Apr 28</div>

                  <button
                    onClick={buyNow}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-3.5 text-sm font-semibold hover:opacity-90 transition"
                  >
                    {enrolled ? <>Go to course <ArrowUpRight className="h-4 w-4" /></> : <>Buy now · {inr(course.price)} <ArrowUpRight className="h-4 w-4" /></>}
                  </button>
                  {!enrolled && (
                    <button
                      onClick={buyNow}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card hover:border-acid/40 px-5 py-3 text-sm font-semibold transition"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to cart & checkout
                    </button>
                  )}

                  <div className="mt-6 space-y-3 text-sm">
                    {[
                      [Clock, `${totalHours} hours of content`],
                      [PlayCircle, `${totalLessons} on-demand lessons`],
                      [Users, "Live cohort sessions weekly"],
                      [Award, "Verified completion certificate"],
                      [CheckCircle2, "Lifetime access + updates"],
                    ].map(([Icon, label], i) => {
                      const I = Icon as typeof Clock;
                      return (
                        <div key={i} className="flex items-center gap-3 text-muted-foreground">
                          <I className="h-4 w-4 text-acid" />
                          <span>{label as string}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-5 border-t border-border text-center">
                    <div className="text-xs text-muted-foreground">30-day money-back guarantee</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-card/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">[ COHORT FILLING FAST ]</div>
                <div className="mt-2 font-display text-xl">42 of 60 seats taken</div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-acid" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border bg-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ KEEP LEARNING ]</div>
          <h2 className="mt-2 font-display text-4xl tracking-tighter mb-8">Students also took.</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((c) => <CourseCard key={c.id} {...c} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
