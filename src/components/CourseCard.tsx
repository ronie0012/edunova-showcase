import { Star, Users, ArrowUpRight, Clock } from "lucide-react";
import { inr } from "@/lib/data";
import { toast } from "sonner";

type Props = {
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  color: string;
  category: string;
  level?: string;
  hours?: number;
};

export function CourseCard({ title, instructor, rating, students, price, color, category, level, hours }: Props) {
  return (
    <div className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-acid/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${color} overflow-hidden`}>
        <div className="absolute inset-0 ring-grid opacity-20 mix-blend-overlay" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />{category}
        </div>
        <div className="absolute bottom-3 right-3 font-display italic text-white/90 text-3xl drop-shadow">
          {rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl leading-tight line-clamp-2 group-hover:text-acid transition-colors">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">by {instructor}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-acid text-acid" />{rating}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{students.toLocaleString("en-IN")}</span>
          {hours && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{hours}h</span>}
        </div>
        {level && <div className="mt-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">{level}</div>}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="font-display text-2xl leading-none">{inr(price)}</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">one-time</div>
          </div>
          <button
            onClick={() => toast.success(`Enrolled in ${title}`, { description: "Check your email for access." })}
            className="group/btn inline-flex items-center gap-1 rounded-md bg-foreground text-background px-3 py-2 text-xs font-semibold hover:bg-acid hover:text-acid-foreground transition"
          >
            Enroll <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
