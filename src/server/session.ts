import {
  clearSession,
  getSession,
  updateSession,
} from "@tanstack/react-start/server";
import type { User } from "@/lib/models";

const DEFAULT_PASSWORD =
  "edunova-demo-session-password-2026-please-change-me";

export const sessionConfig = {
  password: process.env.EDUNOVA_SESSION_PASSWORD || DEFAULT_PASSWORD,
  name: "edunova_session",
  maxAge: 60 * 60 * 24 * 14,
  cookie: {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
  },
};

export async function getSessionUser() {
  const session = await getSession<{ user?: User }>(sessionConfig);
  return session.data.user ?? null;
}

export async function setSessionUser(user: User) {
  await updateSession<{ user?: User }>(sessionConfig, { user });
}

export async function removeSessionUser() {
  await clearSession(sessionConfig);
}
