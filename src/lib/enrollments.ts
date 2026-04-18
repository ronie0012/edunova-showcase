import { useEffect, useState, useCallback } from "react";

const KEY = (email: string) => `edunova:enrollments:${email}`;

export type Enrollment = {
  courseId: number;
  enrolledAt: string;
  progress: number;
};

function read(email: string): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY(email));
    return raw ? (JSON.parse(raw) as Enrollment[]) : [];
  } catch {
    return [];
  }
}

function write(email: string, list: Enrollment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(email), JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("edunova:enrollments-changed"));
}

export function useEnrollments(email: string | null | undefined) {
  const [list, setList] = useState<Enrollment[]>([]);

  useEffect(() => {
    if (!email) {
      setList([]);
      return;
    }
    setList(read(email));
    const handler = () => setList(read(email));
    window.addEventListener("edunova:enrollments-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("edunova:enrollments-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [email]);

  const enroll = useCallback(
    (courseId: number) => {
      if (!email) return false;
      const current = read(email);
      if (current.some((e) => e.courseId === courseId)) return false;
      const next = [
        ...current,
        { courseId, enrolledAt: new Date().toISOString(), progress: 0 },
      ];
      write(email, next);
      return true;
    },
    [email]
  );

  const isEnrolled = useCallback(
    (courseId: number) => list.some((e) => e.courseId === courseId),
    [list]
  );

  return { enrollments: list, enroll, isEnrolled };
}

export function getEnrollments(email: string | null | undefined): Enrollment[] {
  if (!email) return [];
  return read(email);
}
