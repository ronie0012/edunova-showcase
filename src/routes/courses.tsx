import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { courses, categories } from "@/lib/data";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

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
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  const all = useMemo(() => [...courses, ...courses.map((c) => ({ ...c, id: c.id + 100 }))], []);

  const filtered = useMemo(() => {
    let list = all.filter((c) => (cat === "All" || c.category === cat) && (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase())));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list = [...list].sort((a, b) => b.students - a.students);
    return list;
  }, [all, cat, q, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-gradient-hero grain">
        <div className="absolute inset-0 ring-grid opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ THE LIBRARY ]</div>
          <h1 className="mt-3 font-display text-6xl md:text-7xl tracking-tighter leading-none">All <span className="italic">courses</span>.</h1>
          <p className="mt-4 text-muted-foreground max-w-md">{filtered.length} of 207 courses · taught by industry experts who've shipped real things.</p>

          <div className="mt-8 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search courses, instructors…"
                className="w-full rounded-md border border-input bg-card/60 backdrop-blur pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-acid"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-md border border-input bg-card/60 backdrop-blur px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-acid"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["All", ...categories.map((c) => c.name)].map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? "bg-acid text-acid-foreground" : "bg-card border border-border hover:border-acid/40"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-display text-3xl">Nothing matches that.</div>
            <div className="mt-2 text-muted-foreground text-sm">Try a different category or clear the search.</div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => <CourseCard key={c.id} {...c} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
