import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — EduNova" }, { name: "description", content: "Join EduNova and start learning today." }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success(`Welcome to EduNova, ${name}!`);
      nav({ to: "/student" });
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-16">
        <div className="hidden lg:flex flex-col justify-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">// Join 52,000+ learners</div>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight">
            Start learning <em className="text-acid not-italic">without limits</em>.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md">
            Free to start. Pick from 200+ expert-led courses across tech, design, business and more.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Create account</div>
            <h2 className="font-display text-3xl mt-2">Get started<span className="text-acid">.</span></h2>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Full name</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="Ada Lovelace" />
                </div>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="you@email.com" />
                </div>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Password</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="At least 4 characters" />
                </div>
              </label>
            </div>

            <button disabled={loading} type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-acid text-acid-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition">
              {loading ? "Creating..." : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-sm text-center text-muted-foreground">
              Already have an account? <Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
