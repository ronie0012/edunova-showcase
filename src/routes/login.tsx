import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/" }),
  head: () => ({ meta: [{ title: "Sign in — EduNova" }, { name: "description", content: "Sign in to your EduNova account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={redirect as any} />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(`Welcome back!`);
      nav({ to: redirect as any });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-16">
        <div className="hidden lg:flex flex-col justify-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">// Welcome back</div>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight">
            Continue your <em className="text-acid not-italic">learning</em> journey.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md">
            Pick up where you left off across 200+ courses, live sessions, and instructor mentorship.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[["52k+", "students"], ["200+", "courses"], ["4.9★", "rating"]].map(([n, l]) => (
              <div key={l} className="rounded-lg border border-border p-4 bg-card/50">
                <div className="font-display text-2xl">{n}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sign in</div>
            <h2 className="font-display text-3xl mt-2">Hello again<span className="text-acid">.</span></h2>
            <p className="text-sm text-muted-foreground mt-2">Sign in to continue to your dashboard.</p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="you@email.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Password</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </label>
            </div>

            <button
              id="login-submit"
              disabled={loading}
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-acid text-acid-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-sm text-center text-muted-foreground">
              New here? <Link to="/signup" className="text-foreground font-medium underline-offset-4 hover:underline">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
