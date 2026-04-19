import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { AdminState, Enrollment, User } from "@/lib/models";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  migrateLegacyState,
  signupUser,
} from "@/lib/server-fns";

type AuthCtx = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
};

const Ctx = createContext<AuthCtx | null>(null);

const MIGRATION_KEY = "edunova:backend-migrated";
const USERS_KEY = "edunova:users";
const SESSION_KEY = "edunova:session";
const ADMIN_KEY = "edunova:admin-state";
const ENROLLMENT_PREFIX = "edunova:enrollments:";

function safeParse<T>(value: string | null): T | undefined {
  if (!value) return undefined;

  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function readLegacyState() {
  if (typeof window === "undefined") return null;

  const users = safeParse<
    Record<string, { name: string; passwordHash: string; isAdmin: boolean }>
  >(localStorage.getItem(USERS_KEY));
  const session = safeParse<User>(localStorage.getItem(SESSION_KEY));
  const adminState = safeParse<AdminState>(localStorage.getItem(ADMIN_KEY));

  const enrollments: Record<string, Enrollment[]> = {};

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith(ENROLLMENT_PREFIX)) continue;

    const email = key.slice(ENROLLMENT_PREFIX.length);
    const value = safeParse<Enrollment[]>(localStorage.getItem(key));
    if (value) {
      enrollments[email] = value;
    }
  }

  const hasUsers = users && Object.keys(users).length > 0;
  const hasEnrollments = Object.keys(enrollments).length > 0;

  if (!hasUsers && !session && !adminState && !hasEnrollments) {
    return null;
  }

  return {
    users,
    session,
    adminState,
    enrollments,
  };
}

function dispatchAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("edunova:auth-changed"));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const getCurrentUserFn = useServerFn(getCurrentUser);
  const migrateLegacyStateFn = useServerFn(migrateLegacyState);
  const loginUserFn = useServerFn(loginUser);
  const signupUserFn = useServerFn(signupUser);
  const logoutUserFn = useServerFn(logoutUser);

  const refresh = async () => {
    const nextUser = await getCurrentUserFn();
    setUser(nextUser);
    return nextUser;
  };

  useEffect(() => {
    let active = true;

    const boot = async () => {
      try {
        if (
          typeof window !== "undefined" &&
          localStorage.getItem(MIGRATION_KEY) !== "done"
        ) {
          const legacyState = readLegacyState();
          if (legacyState) {
            await migrateLegacyStateFn({ data: legacyState });
          }
          localStorage.setItem(MIGRATION_KEY, "done");
        }

        const nextUser = await getCurrentUserFn();
        if (active) {
          setUser(nextUser);
        }
      } finally {
        if (active) {
          setReady(true);
        }
      }
    };

    void boot();

    return () => {
      active = false;
    };
  }, [getCurrentUserFn, migrateLegacyStateFn]);

  const login = async (email: string, password: string) => {
    const nextUser = await loginUserFn({
      data: { email, password },
    });
    setUser(nextUser);
    dispatchAuthChanged();
    return nextUser;
  };

  const signup = async (email: string, password: string, name: string) => {
    const nextUser = await signupUserFn({
      data: { email, password, name },
    });
    setUser(nextUser);
    dispatchAuthChanged();
    return nextUser;
  };

  const logout = async () => {
    await logoutUserFn();
    setUser(null);
    dispatchAuthChanged();
  };

  return (
    <Ctx.Provider value={{ user, ready, login, signup, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const context = useContext(Ctx);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export type { User } from "@/lib/models";
