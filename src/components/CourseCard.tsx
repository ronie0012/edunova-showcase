import { Star, Users } from "lucide-react";
import { inr } from "@/lib/data";

type Props = {
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  color: string;
  category: string;
};

export function CourseCard({ title, instructor, rating, students, price, color, category }: Props) {
  return (
    <div className="group rounded-2xl bg-card shadow-card overflow-hidden border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className={`h-36 bg-gradient-to-br ${color} relative flex items-end p-4`}>
        <span className="rounded-full bg-white/25 backdrop-blur px-3 py-1 text-xs font-semibold text-white">{category}</span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">by {instructor}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" />{rating}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" />{students.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gradient">{inr(price)}</span>
          <button className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-accent">Enroll</button>
        </div>
      </div>
    </div>
  );
}
