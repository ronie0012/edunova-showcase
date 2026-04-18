import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { courses, categories } from "@/lib/data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "All Courses — EduNova" },
      { name: "description", content: "Browse 200+ expert-led courses across tech, business, design, marketing, finance and personal development." },
      { property: "og:title", content: "All Courses — EduNova" },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold">All Courses</h1>
          <p className="mt-2 text-muted-foreground">200+ courses · taught by industry experts</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="rounded-full bg-gradient-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold">All</button>
            {categories.map((c) => (
              <button key={c.name} className="rounded-full bg-card border border-border px-4 py-1.5 text-sm font-medium hover:bg-accent">{c.name}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...courses, ...courses].map((c, i) => <CourseCard key={i} {...c} />)}
      </section>
      <Footer />
    </div>
  );
}
