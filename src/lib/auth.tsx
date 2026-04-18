import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = {
  email: string;
  name: string;
  isAdmin: boolean;
};

type StoredUser = {
  name: string;
  /** Simple base64 "hash" — good enough for a localStorage-only demo */
  passwordHash: string;
  isAdmin: boolean;
};

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

// ─── Storage keys ─────────────────────────────────────────────────────────────
const SESSION_KEY = "edunova:session";
const USERS_KEY = "edunova:users";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Deterministic role: any @edunova.io email is admin */
const checkAdmin = (email: string) =>
  email.toLowerCase().endsWith("@edunova.io");

/** Very simple hash — fine for localStorage-only storage */
const hashPassword = (pwd: string) => btoa(encodeURIComponent(pwd));

function readUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("edunova:auth-users-changed"));
}

function readSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeSession(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("edunova:auth-session-changed"));
}

// ─── Context / Provider ───────────────────────────────────────────────────────
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore session on mount
  useEffect(() => {
    const session = readSession();
    if (session) setUser(session);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    writeSession(u);
  };

  const login = async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    if (!e || !password) throw new Error("Email and password are required");

    const users = readUsers();
    const stored = users[e];

    if (!stored) {
      throw new Error("No account found with that email. Please sign up.");
    }
    if (stored.passwordHash !== hashPassword(password)) {
      throw new Error("Incorrect password. Please try again.");
    }

    persist({ email: e, name: stored.name, isAdmin: stored.isAdmin });
  };

  const signup = async (email: string, password: string, name: string) => {
    const e = email.trim().toLowerCase();
    const n = name.trim();
    if (!e || !password || !n) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const users = readUsers();
    if (users[e]) {
      throw new Error("An account with this email already exists. Please sign in.");
    }

    const isAdmin = checkAdmin(e);
    const newUser: StoredUser = {
      name: n,
      passwordHash: hashPassword(password),
      isAdmin,
    };
    writeUsers({ ...users, [e]: newUser });
    persist({ email: e, name: n, isAdmin });
  };

  const logout = () => persist(null);

  return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
