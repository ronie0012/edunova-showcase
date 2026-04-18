import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { courses, inr } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useEnrollments } from "@/lib/enrollments";
import { useEffect, useState } from "react";
import { CheckCircle2, Lock, ArrowUpRight, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/$courseId")({
  head: ({ params }) => {
    const c = courses.find((x) => String(x.id) === params.courseId);
    return {
      meta: [
        { title: c ? `Checkout · ${c.title} — EduNova` : "Checkout — EduNova" },
        { name: "description", content: "Complete your purchase and unlock the course on EduNova." },
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
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl tracking-tighter">Course not found.</h1>
        <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-3 text-sm font-semibold">Browse courses <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
      <Footer />
    </div>
  ),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { course } = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enroll, isEnrolled } = useEnrollments(user?.email);

  const [method, setMethod] = useState<"card" | "upi">("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [upi, setUpi] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.message("Please sign in to complete checkout");
      navigate({ to: "/login", search: { redirect: `/checkout/${course.id}` } as never });
    }
  }, [user, navigate, course.id]);

  const subtotal = course.price;
  const tax = Math.round(subtotal * 0.18);
  const couponAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal + tax - couponAmt;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "EDU20") {
      setDiscount(20);
      toast.success("Coupon applied · 20% off");
    } else if (code === "WELCOME") {
      setDiscount(10);
      toast.success("Coupon applied · 10% off");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 12 || !card.name || !card.expiry || card.cvc.length < 3) {
        toast.error("Please fill all card details");
        return;
      }
    } else if (!upi.includes("@")) {
      toast.error("Enter a valid UPI ID");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const added = enroll(course.id);
      setLoading(false);
      setDone(true);
      toast.success(added ? "Payment successful · Course unlocked" : "Already enrolled · Redirecting");
    }, 1100);
  };

  if (!user) return null;

  if (done || isEnrolled(course.id) && !loading && done) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-acid/15 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-acid" />
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ ORDER #{Math.floor(Math.random() * 90000) + 10000} ]</div>
          <h1 className="mt-3 font-display text-5xl tracking-tighter">You're in.</h1>
          <p className="mt-4 text-muted-foreground">{course.title} has been added to your courses. We've emailed your receipt to {user.email}.</p>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-xl">{course.title}</div>
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">by {course.instructor}</div>
              </div>
              <div className="font-display text-2xl">{inr(total)}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/student" className="inline-flex items-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-3 text-sm font-semibold">
              Go to my courses <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:border-acid/40">
              Keep browsing
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <nav className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Link to="/courses" className="hover:text-acid">Courses</Link>
          <span>/</span>
          <Link to="/courses/$courseId" params={{ courseId: String(course.id) }} className="hover:text-acid">{course.title}</Link>
          <span>/</span>
          <span className="text-acid">Checkout</span>
        </nav>

        <h1 className="mt-4 font-display text-5xl md:text-6xl tracking-tighter">Secure checkout.</h1>
        <p className="mt-2 text-muted-foreground flex items-center gap-2 text-sm"><Lock className="h-4 w-4 text-acid" /> Demo only — no real charge will be made.</p>

        <div className="mt-10 grid lg:grid-cols-12 gap-8">
          <form onSubmit={submit} className="lg:col-span-7 space-y-8">
            {/* Account */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ 01 · ACCOUNT ]</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-xl">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <CheckCircle2 className="h-6 w-6 text-acid" />
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">[ 02 · PAYMENT METHOD ]</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(["card", "upi"] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-lg border p-4 text-left transition ${method === m ? "border-acid bg-acid/5" : "border-border hover:border-acid/40"}`}
                  >
                    <div className="font-display text-lg capitalize flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-acid" />{m === "card" ? "Card" : "UPI"}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                      {m === "card" ? "Visa · MC · Amex" : "GPay · PhonePe · Paytm"}
                    </div>
                  </button>
                ))}
              </div>

              {method === "card" ? (
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Card number</label>
                    <input
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })}
                      placeholder="4242 4242 4242 4242"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Name on card</label>
                    <input
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      placeholder="As printed on card"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Expiry</label>
                    <input
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value.replace(/[^\d/]/g, "").slice(0, 5) })}
                      placeholder="MM/YY"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">CVC</label>
                    <input
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">UPI ID</label>
                  <input
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="yourname@okhdfc"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-acid text-acid-foreground px-5 py-4 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Processing payment…" : <>Pay {inr(total)} & enroll <ArrowUpRight className="h-4 w-4" /></>}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-acid" /> Encrypted · 30-day money-back guarantee
            </div>
          </form>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 rounded-xl border border-border bg-card overflow-hidden">
              <div className={`h-28 bg-gradient-to-br ${course.color} relative`}>
                <div className="absolute inset-0 ring-grid opacity-20 mix-blend-overlay" />
                <div className="absolute bottom-3 left-4 text-white">
                  <div className="text-[10px] font-mono uppercase tracking-wider opacity-80">{course.category}</div>
                  <div className="font-display text-xl leading-tight">{course.title}</div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">by {course.instructor} · {course.hours}h · {course.level}</div>

                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Try EDU20 or WELCOME"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={applyCoupon} className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:border-acid/40">Apply</button>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <Row label="Subtotal" value={inr(subtotal)} />
                  <Row label="GST (18%)" value={inr(tax)} />
                  {discount > 0 && <Row label={`Coupon (-${discount}%)`} value={`- ${inr(couponAmt)}`} accent />}
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-border">
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Total</div>
                  <div className="font-display text-3xl">{inr(total)}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-acid font-mono" : "font-mono"}>{value}</span>
    </div>
  );
}
