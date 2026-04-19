import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { Enrollment } from "@/lib/models";
import { enrollInCourse, getEnrollmentsServer } from "@/lib/server-fns";

export function useEnrollments(email: string | null | undefined) {
  const [list, setList] = useState<Enrollment[]>([]);
  const getEnrollmentsFn = useServerFn(getEnrollmentsServer);
  const enrollFn = useServerFn(enrollInCourse);

  const refresh = useCallback(async () => {
    if (!email) {
      setList([]);
      return [];
    }

    try {
      const next = await getEnrollmentsFn();
      setList(next);
      return next;
    } catch {
      setList([]);
      return [];
    }
  }, [email, getEnrollmentsFn]);

  useEffect(() => {
    if (!email) {
      setList([]);
      return;
    }

    void refresh();

    const handler = () => {
      void refresh();
    };

    window.addEventListener("edunova:enrollments-changed", handler);
    window.addEventListener("edunova:auth-changed", handler);

    return () => {
      window.removeEventListener("edunova:enrollments-changed", handler);
      window.removeEventListener("edunova:auth-changed", handler);
    };
  }, [email, refresh]);

  const enroll = useCallback(
    async (courseId: number) => {
      if (!email) return false;
      const result = await enrollFn({ data: { courseId } });
      await refresh();
      window.dispatchEvent(new CustomEvent("edunova:enrollments-changed"));
      return result.added;
    },
    [email, enrollFn, refresh]
  );

  const isEnrolled = useCallback(
    (courseId: number) => list.some((item) => item.courseId === courseId),
    [list]
  );

  return { enrollments: list, enroll, isEnrolled, refresh };
}

export type { Enrollment } from "@/lib/models";
