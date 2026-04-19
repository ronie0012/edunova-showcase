import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import { DEMO_ADMIN } from "@/lib/demo-admin";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: (s.redirect as string) || "/",
  }),
  head: () => ({
    meta: [
      { title: "Sign in - EduNova" },
      { name: "description", content: "Sign in to your EduNova account." },
    ],
  }),
  component: LoginPage,
});

function getDestination(redirect: string, currentUser: { isAdmin: boolean }) {
  if (redirect && redirect !== "/") {
    return redirect;
  }

  return currentUser.isAdmin ? "/admin" : "/student";
}

function LoginPage() {
  const { login, user, ready } = useAuth();
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && user) {
    return <Navigate to={getDestination(redirect, user) as any} />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const nextUser = await login(email, password);
      toast.success("Welcome back!");
      nav({ to: getDestination(redirect, nextUser) as any });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            // Welcome back
          </div>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight">
            Continue your <em className="text-acid not-italic">learning</em> journey.
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Pick up where you left off across 200+ courses, live sessions, and
            instructor mentorship.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              ["52k+", "students"],
              ["200+", "courses"],
              ["4.9*", "rating"],
            ].map(([number, label]) => (
              <div key={label} className="rounded-lg border border-border bg-card/50 p-4">
                <div className="font-display text-2xl">{number}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Sign in
            </div>
            <h2 className="mt-2 font-display text-3xl">
              Hello again<span className="text-acid">.</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to your dashboard.
            </p>
            <div className="mt-4 rounded-xl border border-acid/30 bg-acid/5 p-4 text-sm">
              <div className="font-semibold text-foreground">Default admin login</div>
              <div className="mt-2 text-muted-foreground">
                Email: <span className="font-medium text-foreground">{DEMO_ADMIN.email}</span>
              </div>
              <div className="text-muted-foreground">
                Password: <span className="font-medium text-foreground">{DEMO_ADMIN.password}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="you@email.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </label>
            </div>

            <button
              id="login-submit"
              disabled={loading}
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-acid px-4 py-3 text-sm font-semibold text-acid-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
