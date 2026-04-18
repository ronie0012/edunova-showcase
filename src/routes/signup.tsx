import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — EduNova" }, { name: "description", content: "Join EduNova and start learning today." }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup, user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect
  if (user) {
    return <Navigate to={user.isAdmin ? "/admin" : "/student"} />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success(`Welcome to EduNova, ${name.split(" ")[0]}!`);
      nav({
        to: email.trim().toLowerCase().endsWith("@edunova.io")
          ? "/admin"
          : "/student",
      });
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
          <div className="mt-10 space-y-3">
            {["No experience required", "Learn at your own pace", "Real projects, real outcomes"].map((b) => (
              <div key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-acid" />
                {b}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Create account</div>
            <h2 className="font-display text-3xl mt-2">Get started<span className="text-acid">.</span></h2>

            <div className="mt-6 space-y-4">
              {/* Full name */}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Full name</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Ada Lovelace"
                  />
                </div>
              </label>

              {/* Email */}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="you@email.com"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Password</span>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-acid">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-password"
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-muted-foreground hover:text-foreground transition ml-1"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Confirm password */}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Confirm password</span>
                <div className={`mt-1 flex items-center gap-2 rounded-md border bg-background px-3 py-2.5 focus-within:border-acid ${confirm && confirm !== password ? "border-destructive" : "border-border"}`}>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-confirm"
                    type={showPwd ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Re-enter password"
                  />
                </div>
                {confirm && confirm !== password && (
                  <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
                )}
              </label>
            </div>

            <button
              id="signup-submit"
              disabled={loading}
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-acid text-acid-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Creating account..." : "Create account"} <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-sm text-center text-muted-foreground">
              Already have an account? <Link to="/login" search={{ redirect: "/" }} className="text-foreground font-medium underline-offset-4 hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
