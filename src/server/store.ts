import { randomUUID, createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { courses } from "@/lib/data";
import { DEMO_ADMIN, isDemoAdminEmail } from "@/lib/demo-admin";
import {
  defaultAdminState,
  type AdminState,
  type AdminUser,
  type Enrollment,
  type EnrollmentOrder,
  type User,
} from "@/lib/models";

export type PasswordAlgorithm = "sha256" | "legacy-base64";

export type StoredUser = {
  email: string;
  name: string;
  passwordHash: string;
  passwordAlgorithm: PasswordAlgorithm;
  isAdmin: boolean;
  createdAt: string;
};

type Database = {
  users: Record<string, StoredUser>;
  enrollments: Record<string, Enrollment[]>;
  adminState: AdminState;
};

const DEMO_LEARNERS = [
  {
    email: "riya.malhotra@example.com",
    name: "Riya Malhotra",
    createdAt: "2026-01-05T10:00:00.000Z",
  },
  {
    email: "arjun.mehta@example.com",
    name: "Arjun Mehta",
    createdAt: "2026-01-18T09:30:00.000Z",
  },
  {
    email: "sana.khan@example.com",
    name: "Sana Khan",
    createdAt: "2026-02-02T14:15:00.000Z",
  },
  {
    email: "kabir.singh@example.com",
    name: "Kabir Singh",
    createdAt: "2026-02-25T16:45:00.000Z",
  },
  {
    email: "meera.joshi@example.com",
    name: "Meera Joshi",
    createdAt: "2026-03-11T11:20:00.000Z",
  },
] as const;

const DEMO_ENROLLMENTS: Record<string, Enrollment[]> = {
  "riya.malhotra@example.com": [
    { courseId: 1, enrolledAt: "2026-01-10T09:45:00.000Z", progress: 62 },
    { courseId: 4, enrolledAt: "2026-03-14T11:30:00.000Z", progress: 34 },
  ],
  "arjun.mehta@example.com": [
    { courseId: 3, enrolledAt: "2026-01-22T13:10:00.000Z", progress: 88 },
    { courseId: 5, enrolledAt: "2026-04-05T16:40:00.000Z", progress: 21 },
  ],
  "sana.khan@example.com": [
    { courseId: 2, enrolledAt: "2026-02-07T10:25:00.000Z", progress: 53 },
    { courseId: 6, enrolledAt: "2026-03-19T18:05:00.000Z", progress: 77 },
  ],
  "kabir.singh@example.com": [
    { courseId: 4, enrolledAt: "2026-02-27T08:50:00.000Z", progress: 48 },
    { courseId: 1, enrolledAt: "2026-04-11T12:20:00.000Z", progress: 16 },
  ],
  "meera.joshi@example.com": [
    { courseId: 5, enrolledAt: "2026-03-08T15:35:00.000Z", progress: 65 },
    { courseId: 2, enrolledAt: "2026-04-15T09:05:00.000Z", progress: 12 },
  ],
};

const DB_DIR = path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "edunova-db.json");

const defaultDatabase: Database = {
  users: {
    [DEMO_ADMIN.email]: {
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      passwordHash: hashPassword(DEMO_ADMIN.password),
      passwordAlgorithm: "sha256",
      isAdmin: true,
      createdAt: new Date().toISOString(),
    },
  },
  enrollments: {},
  adminState: defaultAdminState,
};

let writeQueue = Promise.resolve();

function ensureDefaultAdminUser(db: Database) {
  const existing = db.users[DEMO_ADMIN.email];

  db.users[DEMO_ADMIN.email] = {
    email: DEMO_ADMIN.email,
    name: DEMO_ADMIN.name,
    passwordHash: hashPassword(DEMO_ADMIN.password),
    passwordAlgorithm: "sha256",
    isAdmin: true,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
}

function createSeededUser(input: {
  email: string;
  name: string;
  createdAt: string;
}): StoredUser {
  return {
    email: input.email,
    name: input.name,
    passwordHash: hashPassword("edunova-demo-learner"),
    passwordAlgorithm: "sha256",
    isAdmin: false,
    createdAt: input.createdAt,
  };
}

function ensureDemoRevenueData(db: Database) {
  const hasOrders = Object.values(db.enrollments).some((items) => items.length > 0);
  if (hasOrders) return;

  for (const learner of DEMO_LEARNERS) {
    if (!db.users[learner.email]) {
      db.users[learner.email] = createSeededUser(learner);
    }
  }

  for (const [email, enrollments] of Object.entries(DEMO_ENROLLMENTS)) {
    db.enrollments[email] = enrollments.map((enrollment) => ({ ...enrollment }));
  }
}

function normalizeDatabase(value: Partial<Database> | undefined): Database {
  const db: Database = {
    users: value?.users ?? {},
    enrollments: value?.enrollments ?? {},
    adminState: {
      ...defaultAdminState,
      ...value?.adminState,
      loyalty: {
        ...defaultAdminState.loyalty,
        ...value?.adminState?.loyalty,
      },
    },
  };

  ensureDefaultAdminUser(db);
  ensureDemoRevenueData(db);
  return db;
}

async function ensureDatabase() {
  await mkdir(DB_DIR, { recursive: true });

  try {
    await readFile(DB_PATH, "utf8");
  } catch {
    await writeFile(DB_PATH, JSON.stringify(defaultDatabase, null, 2), "utf8");
  }
}

export async function readDatabase() {
  await ensureDatabase();
  const raw = await readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as Partial<Database>;
  const missingDemoAdmin = !parsed.users?.[DEMO_ADMIN.email];
  const missingOrders = !Object.values(parsed.enrollments ?? {}).some(
    (items) => items.length > 0
  );
  const db = normalizeDatabase(parsed);

  if (missingDemoAdmin || missingOrders) {
    await writeDatabase(db);
  }

  return db;
}

async function writeDatabase(db: Database) {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function updateDatabase<T>(
  updater: (db: Database) => Promise<T> | T
) {
  const task = writeQueue.then(async () => {
    const db = await readDatabase();
    const result = await updater(db);
    await writeDatabase(db);
    return result;
  });

  writeQueue = task.then(
    () => undefined,
    () => undefined
  );

  return task;
}

export function isAdminEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail.endsWith("@edunova.io") || isDemoAdminEmail(normalizedEmail);
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function hashLegacyPassword(password: string) {
  return Buffer.from(encodeURIComponent(password), "utf8").toString("base64");
}

export function verifyPassword(user: StoredUser, password: string) {
  if (user.passwordAlgorithm === "legacy-base64") {
    return user.passwordHash === hashLegacyPassword(password);
  }

  return user.passwordHash === hashPassword(password);
}

export function toPublicUser(user: StoredUser): User {
  return {
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}

export function listUsers(db: Database): AdminUser[] {
  return Object.values(db.users)
    .map((user) => toPublicUser(user))
    .sort((left, right) => left.email.localeCompare(right.email));
}

export function listOrders(db: Database): EnrollmentOrder[] {
  const orders: EnrollmentOrder[] = [];

  for (const [email, enrollments] of Object.entries(db.enrollments)) {
    for (const enrollment of enrollments) {
      const course = courses.find((item) => item.id === enrollment.courseId);
      if (!course) continue;

      orders.push({
        ...enrollment,
        email,
        courseTitle: course.title,
        price: course.price,
        category: course.category,
      });
    }
  }

  return orders.sort(
    (left, right) =>
      new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime()
  );
}

export function emptyEnrollment(courseId: number): Enrollment {
  return {
    courseId,
    enrolledAt: new Date().toISOString(),
    progress: 0,
  };
}

export function createStoredUser(input: {
  email: string;
  name: string;
  password: string;
}): StoredUser {
  const email = input.email.trim().toLowerCase();

  return {
    email,
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    passwordAlgorithm: "sha256",
    isAdmin: isAdminEmail(email),
    createdAt: new Date().toISOString(),
  };
}

export function mergeLegacyData(
  db: Database,
  payload: {
    users?: Record<string, { name: string; passwordHash: string; isAdmin: boolean }>;
    enrollments?: Record<string, Enrollment[]>;
    adminState?: AdminState | null;
  }
) {
  if (payload.users) {
    for (const [email, user] of Object.entries(payload.users)) {
      const normalizedEmail = email.trim().toLowerCase();
      if (db.users[normalizedEmail]) continue;

      db.users[normalizedEmail] = {
        email: normalizedEmail,
        name: user.name,
        passwordHash: user.passwordHash,
        passwordAlgorithm: "legacy-base64",
        isAdmin: user.isAdmin || isAdminEmail(normalizedEmail),
        createdAt: new Date().toISOString(),
      };
    }
  }

  if (payload.enrollments) {
    for (const [email, list] of Object.entries(payload.enrollments)) {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = db.enrollments[normalizedEmail] ?? [];
      const seen = new Set(existing.map((item) => item.courseId));

      for (const enrollment of list) {
        if (seen.has(enrollment.courseId)) continue;
        existing.push(enrollment);
        seen.add(enrollment.courseId);
      }

      db.enrollments[normalizedEmail] = existing;
    }
  }

  if (payload.adminState) {
    db.adminState = {
      ...defaultAdminState,
      ...payload.adminState,
      loyalty: {
        ...defaultAdminState.loyalty,
        ...payload.adminState.loyalty,
      },
    };
  }
}

export function createId(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}
