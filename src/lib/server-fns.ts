import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  AdminState,
  Enrollment,
  IncidentStatus,
  LeadStage,
  ReviewStatus,
  ServerStatus,
  TicketPriority,
  TicketStatus,
  User,
} from "@/lib/models";

export type AdminSnapshot = {
  users: User[];
  orders: Array<
    Enrollment & {
      email: string;
      courseTitle: string;
      price: number;
      category: string;
    }
  >;
  adminState: AdminState;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const enrollSchema = z.object({
  courseId: z.number().int().positive(),
});

async function requireUser() {
  const { getSessionUser } = await import("@/server/session");
  const user = await getSessionUser();
  if (!user) throw new Error("Please sign in to continue.");
  return user;
}

async function requireAdmin() {
  const user = await requireUser();
  if (!user.isAdmin) throw new Error("Admin access is required.");
  return user;
}

export const migrateLegacyState = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      users?: Record<string, { name: string; passwordHash: string; isAdmin: boolean }>;
      enrollments?: Record<string, Enrollment[]>;
      adminState?: AdminState | null;
      session?: User | null;
    }) => data
  )
  .handler(async ({ data }) => {
    const { mergeLegacyData, readDatabase, updateDatabase } = await import(
      "@/server/store"
    );
    const { setSessionUser } = await import("@/server/session");

    await updateDatabase((db) => {
      mergeLegacyData(db, data);
    });

    if (data.session) {
      const db = await readDatabase();
      const existingUser = db.users[data.session.email.toLowerCase()];
      if (existingUser) {
        await setSessionUser({
          email: existingUser.email,
          name: existingUser.name,
          isAdmin: existingUser.isAdmin,
        });
      }
    }

    return { ok: true };
  });

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getSessionUser } = await import("@/server/session");
    return getSessionUser();
  }
);

export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof loginSchema>) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { readDatabase, toPublicUser, verifyPassword } = await import(
      "@/server/store"
    );
    const { setSessionUser } = await import("@/server/session");

    const email = data.email.trim().toLowerCase();
    const db = await readDatabase();
    const user = db.users[email];

    if (!user) {
      throw new Error("No account found with that email. Please sign up.");
    }

    if (!verifyPassword(user, data.password)) {
      throw new Error("Incorrect password. Please try again.");
    }

    const publicUser = toPublicUser(user);
    await setSessionUser(publicUser);
    return publicUser;
  });

export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof signupSchema>) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const { createStoredUser, updateDatabase, toPublicUser } = await import(
      "@/server/store"
    );
    const { setSessionUser } = await import("@/server/session");

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    if (!name) {
      throw new Error("All fields are required.");
    }

    let createdUser: User | null = null;

    await updateDatabase((db) => {
      if (db.users[email]) {
        throw new Error(
          "An account with this email already exists. Please sign in."
        );
      }

      const user = createStoredUser({
        email,
        name,
        password: data.password,
      });

      db.users[email] = user;
      createdUser = toPublicUser(user);
    });

    if (!createdUser) {
      throw new Error("Unable to create account.");
    }

    await setSessionUser(createdUser);
    return createdUser;
  });

export const logoutUser = createServerFn({ method: "POST" }).handler(
  async () => {
    const { removeSessionUser } = await import("@/server/session");
    await removeSessionUser();
    return { ok: true };
  }
);

export const getEnrollmentsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await requireUser();
    const { readDatabase } = await import("@/server/store");
    const db = await readDatabase();
    return db.enrollments[user.email] ?? [];
  }
);

export const enrollInCourse = createServerFn({ method: "POST" })
  .inputValidator((data: z.input<typeof enrollSchema>) => enrollSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await requireUser();
    const { emptyEnrollment, updateDatabase } = await import("@/server/store");

    let added = false;

    await updateDatabase((db) => {
      const list = db.enrollments[user.email] ?? [];
      if (list.some((item) => item.courseId === data.courseId)) {
        db.enrollments[user.email] = list;
        return;
      }

      list.push(emptyEnrollment(data.courseId));
      db.enrollments[user.email] = list;
      added = true;
    });

    return { added };
  });

export const getAdminSnapshot = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { listOrders, listUsers, readDatabase } = await import("@/server/store");
    const db = await readDatabase();

    return {
      users: listUsers(db),
      orders: listOrders(db),
      adminState: db.adminState,
    } satisfies AdminSnapshot;
  }
);

export const createAdminTicket = createServerFn({ method: "POST" })
  .inputValidator(
    (
      data: {
        customerName: string;
        email: string;
        category: string;
        subject: string;
        priority: TicketPriority;
      }
    ) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createId, updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.tickets.unshift({
        id: createId("ticket"),
        customerName: data.customerName.trim(),
        email: data.email.trim().toLowerCase(),
        category: data.category,
        subject: data.subject.trim(),
        priority: data.priority,
        status: "open",
        createdAt: new Date().toISOString(),
        responseHours:
          data.priority === "critical"
            ? 1.5
            : data.priority === "high"
              ? 2.5
              : data.priority === "medium"
                ? 4
                : 6,
      });
    });

    return { ok: true };
  });

export const updateAdminTicketStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: TicketStatus }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.tickets = db.adminState.tickets.map((ticket) =>
        ticket.id === data.id ? { ...ticket, status: data.status } : ticket
      );
    });

    return { ok: true };
  });

export const updateAdminIncidentStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: IncidentStatus }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.incidents = db.adminState.incidents.map((incident) =>
        incident.id === data.id
          ? {
              ...incident,
              status: data.status,
              updatedAt: new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : incident
      );
    });

    return { ok: true };
  });

export const createFeedbackAction = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { trigger: string; action: string; outcome: string }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createId, updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.feedbackActions.unshift({
        id: createId("feedback"),
        trigger: data.trigger.trim(),
        action: data.action.trim(),
        outcome: data.outcome.trim(),
      });
    });

    return { ok: true };
  });

export const updateChurnActionServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; action: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.churnRisks = db.adminState.churnRisks.map((risk) =>
        risk.id === data.id ? { ...risk, action: data.action } : risk
      );
    });

    return { ok: true };
  });

export const createCampaignServer = createServerFn({ method: "POST" })
  .inputValidator(
    (
      data: {
        channel: string;
        spend: number;
        impressions: number;
        clicks: number;
        signups: number;
        conversions: number;
      }
    ) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createId, updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.campaigns.unshift({
        id: createId("campaign"),
        channel: data.channel.trim(),
        spend: data.spend,
        impressions: data.impressions,
        clicks: data.clicks,
        signups: data.signups,
        conversions: data.conversions,
        status: "active",
      });
    });

    return { ok: true };
  });

export const toggleCampaignServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.campaigns = db.adminState.campaigns.map((campaign) =>
        campaign.id === data.id
          ? {
              ...campaign,
              status: campaign.status === "active" ? "paused" : "active",
            }
          : campaign
      );
    });

    return { ok: true };
  });

export const bumpCampaignConversionsServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; amount?: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.campaigns = db.adminState.campaigns.map((campaign) =>
        campaign.id === data.id
          ? {
              ...campaign,
              conversions: campaign.conversions + (data.amount ?? 1),
            }
          : campaign
      );
    });

    return { ok: true };
  });

export const createInstructorLeadServer = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; expertise: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createId, updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.instructorLeads.unshift({
        id: createId("lead"),
        name: data.name.trim(),
        expertise: data.expertise.trim(),
        stage: "application",
      });
    });

    return { ok: true };
  });

export const moveInstructorLeadServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; stage: LeadStage }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.instructorLeads = db.adminState.instructorLeads.map((lead) =>
        lead.id === data.id ? { ...lead, stage: data.stage } : lead
      );
    });

    return { ok: true };
  });

export const createReviewQueueItemServer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { title: string; instructor: string; category: string }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { createId, updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.reviewQueue.unshift({
        id: createId("queue"),
        title: data.title.trim(),
        instructor: data.instructor.trim(),
        reviewer: "Unassigned",
        category: data.category.trim(),
        status: "pending",
        submittedAt: new Date().toISOString().slice(0, 10),
      });
    });

    return { ok: true };
  });

export const updateReviewStatusServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: ReviewStatus }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.reviewQueue = db.adminState.reviewQueue.map((item) =>
        item.id === data.id ? { ...item, status: data.status } : item
      );
    });

    return { ok: true };
  });

export const updateServerStatusServer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string; load: number; status: ServerStatus }) => data
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.servers = db.adminState.servers.map((server) =>
        server.id === data.id
          ? { ...server, load: data.load, status: data.status }
          : server
      );
    });

    return { ok: true };
  });

export const toggleSecurityEventServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.securityEvents = db.adminState.securityEvents.map((event) =>
        event.id === data.id
          ? { ...event, status: event.status === "ok" ? "blocked" : "ok" }
          : event
      );
    });

    return { ok: true };
  });

export const toggleSecurityControlServer = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { updateDatabase } = await import("@/server/store");

    await updateDatabase((db) => {
      db.adminState.securityControls = db.adminState.securityControls.map(
        (control) =>
          control.id === data.id
            ? { ...control, active: !control.active }
            : control
      );
    });

    return { ok: true };
  });
