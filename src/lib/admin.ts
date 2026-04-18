import { useCallback, useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/data";
import type { Enrollment } from "@/lib/enrollments";

const ADMIN_KEY = "edunova:admin-state";
const USERS_KEY = "edunova:users";
const ENROLLMENT_PREFIX = "edunova:enrollments:";

export type TicketStatus = "open" | "pending" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "resolved" | "in_progress" | "monitoring";
export type CampaignStatus = "active" | "paused";
export type ReviewStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "changes_requested";
export type LeadStage =
  | "application"
  | "demo"
  | "interview"
  | "onboarding"
  | "live";
export type SecurityEventStatus = "ok" | "blocked";
export type ServerStatus = "Healthy" | "Elevated" | "Critical";

export type AdminTicket = {
  id: string;
  customerName: string;
  email: string;
  category: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  responseHours: number;
};

export type AdminIncident = {
  id: string;
  title: string;
  reports: number;
  severity: "critical" | "high" | "medium";
  status: IncidentStatus;
  owner: string;
  updatedAt: string;
};

export type FeedbackAction = {
  id: string;
  trigger: string;
  action: string;
  outcome: string;
};

export type ChurnRisk = {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  reason: string;
  action: string;
};

export type CustomerReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
};

export type MarketingCampaign = {
  id: string;
  channel: string;
  spend: number;
  impressions: number;
  clicks: number;
  signups: number;
  conversions: number;
  status: CampaignStatus;
};

export type ReviewQueueItem = {
  id: string;
  title: string;
  instructor: string;
  reviewer: string;
  category: string;
  status: ReviewStatus;
  submittedAt: string;
};

export type InstructorLead = {
  id: string;
  name: string;
  expertise: string;
  stage: LeadStage;
};

export type ServerNode = {
  id: string;
  name: string;
  load: number;
  status: ServerStatus;
};

export type SecurityEvent = {
  id: string;
  time: string;
  ip: string;
  device: string;
  location: string;
  status: SecurityEventStatus;
  reason: string;
};

export type SecurityControl = {
  id: string;
  name: string;
  why: string;
  active: boolean;
};

type AdminState = {
  tickets: AdminTicket[];
  incidents: AdminIncident[];
  feedbackActions: FeedbackAction[];
  churnRisks: ChurnRisk[];
  reviews: CustomerReview[];
  campaigns: MarketingCampaign[];
  reviewQueue: ReviewQueueItem[];
  instructorLeads: InstructorLead[];
  servers: ServerNode[];
  securityEvents: SecurityEvent[];
  securityControls: SecurityControl[];
  loyalty: {
    pointsIssued: number;
    redemptions: number;
  };
};

type StoredUser = {
  name: string;
  isAdmin: boolean;
};

export type AdminUser = {
  email: string;
  name: string;
  isAdmin: boolean;
};

export type EnrollmentOrder = Enrollment & {
  email: string;
  courseTitle: string;
  price: number;
  category: string;
};

const severityWeight: Record<AdminIncident["severity"], number> = {
  critical: 1,
  high: 2,
  medium: 3,
};

const reviewWeight: Record<ReviewStatus, number> = {
  pending: 1,
  in_review: 2,
  changes_requested: 3,
  approved: 4,
};

const defaultState: AdminState = {
  tickets: [
    {
      id: "ticket-1",
      customerName: "Riya Malhotra",
      email: "riya@example.com",
      category: "Payment Issues",
      subject: "Payment timed out but amount was debited",
      priority: "critical",
      status: "resolved",
      createdAt: "2026-04-17T09:15:00.000Z",
      responseHours: 1.2,
    },
    {
      id: "ticket-2",
      customerName: "Aditya Khanna",
      email: "aditya@example.com",
      category: "Technical Bugs",
      subject: "Android app buffers on lesson 3",
      priority: "high",
      status: "pending",
      createdAt: "2026-04-17T12:45:00.000Z",
      responseHours: 3.8,
    },
    {
      id: "ticket-3",
      customerName: "Meera Shah",
      email: "meera@example.com",
      category: "Course Quality",
      subject: "Need more practice material in data science",
      priority: "medium",
      status: "open",
      createdAt: "2026-04-18T07:10:00.000Z",
      responseHours: 5.1,
    },
    {
      id: "ticket-4",
      customerName: "Rahul Jain",
      email: "rahul@example.com",
      category: "Refund Requests",
      subject: "Refund requested after duplicate purchase",
      priority: "high",
      status: "pending",
      createdAt: "2026-04-18T10:25:00.000Z",
      responseHours: 2.4,
    },
  ],
  incidents: [
    {
      id: "incident-1",
      title: "Payment gateway timeout",
      reports: 473,
      severity: "critical",
      status: "resolved",
      owner: "Finance Ops",
      updatedAt: "18 Apr 2026, 14:30",
    },
    {
      id: "incident-2",
      title: "Video buffering on Android",
      reports: 218,
      severity: "high",
      status: "in_progress",
      owner: "Platform",
      updatedAt: "18 Apr 2026, 13:05",
    },
    {
      id: "incident-3",
      title: "Certificate generation delay",
      reports: 91,
      severity: "medium",
      status: "monitoring",
      owner: "Learner Success",
      updatedAt: "18 Apr 2026, 11:50",
    },
  ],
  feedbackActions: [
    {
      id: "feedback-1",
      trigger: "Payment complaints spiked this week",
      action: "Added retry + webhook reconciliation to checkout flow",
      outcome: "Manual support load is already trending down",
    },
    {
      id: "feedback-2",
      trigger: "Android buffering reports from cohort learners",
      action: "Raised player quality defaults and CDN fallback",
      outcome: "Median lesson start time is improving",
    },
    {
      id: "feedback-3",
      trigger: "Learners wanted more hands-on assessments",
      action: "Added guided labs to analytics-heavy courses",
      outcome: "Higher completion in pilot cohort",
    },
  ],
  churnRisks: [
    {
      id: "risk-1",
      name: "Rahul Jain",
      email: "rahul@example.com",
      lastActive: "32 days ago",
      reason: "Paid but never started the first lesson",
      action: "Offer onboarding call",
    },
    {
      id: "risk-2",
      name: "Meera Shah",
      email: "meera@example.com",
      lastActive: "21 days ago",
      reason: "Dropped after module 2 in a flagship course",
      action: "Share accountability plan",
    },
    {
      id: "risk-3",
      name: "Arjun Tandon",
      email: "arjun@example.com",
      lastActive: "18 days ago",
      reason: "Multiple failed logins before churn",
      action: "Priority support outreach",
    },
  ],
  reviews: [
    {
      id: "review-1",
      name: "Riya M.",
      rating: 5,
      text: "Support resolved my refund in 2 hours.",
    },
    {
      id: "review-2",
      name: "Aditya K.",
      rating: 4,
      text: "Great course content, but mobile playback still needs polish.",
    },
    {
      id: "review-3",
      name: "Saanvi P.",
      rating: 5,
      text: "Fast responses and a noticeably better checkout experience.",
    },
  ],
  campaigns: [
    {
      id: "campaign-1",
      channel: "Google Ads",
      spend: 50000,
      impressions: 124000,
      clicks: 3970,
      signups: 812,
      conversions: 396,
      status: "active",
    },
    {
      id: "campaign-2",
      channel: "Instagram / Meta Ads",
      spend: 30000,
      impressions: 280000,
      clicks: 5880,
      signups: 520,
      conversions: 210,
      status: "active",
    },
    {
      id: "campaign-3",
      channel: "Email Marketing",
      spend: 8000,
      impressions: 15000,
      clicks: 1200,
      signups: 640,
      conversions: 408,
      status: "active",
    },
    {
      id: "campaign-4",
      channel: "Referral Program",
      spend: 0,
      impressions: 820,
      clicks: 620,
      signups: 390,
      conversions: 310,
      status: "active",
    },
  ],
  reviewQueue: [
    {
      id: "queue-1",
      title: "GraphQL Deep Dive",
      instructor: "R. Saxena",
      reviewer: "Aanya",
      category: "Tech",
      status: "pending",
      submittedAt: "2026-04-17",
    },
    {
      id: "queue-2",
      title: "Brand Strategy 2026",
      instructor: "P. Ghosh",
      reviewer: "Anita",
      category: "Marketing",
      status: "in_review",
      submittedAt: "2026-04-16",
    },
    {
      id: "queue-3",
      title: "Excel for PMs",
      instructor: "V. Joshi",
      reviewer: "Manish",
      category: "Business",
      status: "approved",
      submittedAt: "2026-04-14",
    },
    {
      id: "queue-4",
      title: "Web3 Fundamentals",
      instructor: "S. Kapoor",
      reviewer: "Anita",
      category: "Tech",
      status: "changes_requested",
      submittedAt: "2026-04-15",
    },
  ],
  instructorLeads: [
    { id: "lead-1", name: "Neha Gupta", expertise: "Backend systems", stage: "application" },
    { id: "lead-2", name: "Rohan Bose", expertise: "Product design", stage: "demo" },
    { id: "lead-3", name: "Kunal Verma", expertise: "Growth marketing", stage: "interview" },
    { id: "lead-4", name: "Aditi Rao", expertise: "Finance", stage: "onboarding" },
    { id: "lead-5", name: "Samar Jain", expertise: "Frontend engineering", stage: "live" },
  ],
  servers: [
    { id: "server-1", name: "API Cluster (Mumbai)", load: 42, status: "Healthy" },
    { id: "server-2", name: "Video CDN", load: 67, status: "Healthy" },
    { id: "server-3", name: "Database Primary", load: 38, status: "Healthy" },
    { id: "server-4", name: "Background Workers", load: 81, status: "Elevated" },
  ],
  securityEvents: [
    {
      id: "security-1",
      time: "Today, 09:14",
      ip: "103.21.45.12",
      device: "MacBook Pro / Chrome",
      location: "Bengaluru, IN",
      status: "ok",
      reason: "Known admin device",
    },
    {
      id: "security-2",
      time: "Today, 02:08",
      ip: "49.36.112.4",
      device: "iPhone 15 / Safari",
      location: "Bengaluru, IN",
      status: "ok",
      reason: "Trusted session",
    },
    {
      id: "security-3",
      time: "Yesterday, 03:21",
      ip: "45.227.255.91",
      device: "Unknown / curl",
      location: "Unknown",
      status: "blocked",
      reason: "Rate-limited after suspicious retry pattern",
    },
  ],
  securityControls: [
    {
      id: "control-1",
      name: "AES-256 Data Encryption",
      why: "Sensitive learner data stays encrypted at rest.",
      active: true,
    },
    {
      id: "control-2",
      name: "JWT Authentication",
      why: "Session integrity remains portable across the client app.",
      active: true,
    },
    {
      id: "control-3",
      name: "Two-Factor Authentication",
      why: "Extra friction protects administrator access.",
      active: true,
    },
    {
      id: "control-4",
      name: "Rate Limiting",
      why: "Automated abuse is throttled before it snowballs.",
      active: true,
    },
  ],
  loyalty: {
    pointsIssued: 284500,
    redemptions: 112300,
  },
};

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readUsers(): AdminUser[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(USERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};

    return Object.entries(parsed).map(([email, user]) => ({
      email,
      name: user.name,
      isAdmin: Boolean(user.isAdmin),
    }));
  } catch {
    return [];
  }
}

function readOrders(): EnrollmentOrder[] {
  const storage = getStorage();
  if (!storage) return [];

  const items: EnrollmentOrder[] = [];

  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key || !key.startsWith(ENROLLMENT_PREFIX)) continue;

      const email = key.slice(ENROLLMENT_PREFIX.length);
      const raw = storage.getItem(key);
      const entries = raw ? (JSON.parse(raw) as Enrollment[]) : [];

      entries.forEach((entry) => {
        const course = courses.find((item) => item.id === entry.courseId);
        if (!course) return;

        items.push({
          ...entry,
          email,
          courseTitle: course.title,
          price: course.price,
          category: course.category,
        });
      });
    }
  } catch {
    return [];
  }

  return items.sort(
    (left, right) =>
      new Date(right.enrolledAt).getTime() - new Date(left.enrolledAt).getTime()
  );
}

function readAdminState(): AdminState {
  const storage = getStorage();
  if (!storage) return defaultState;

  try {
    const raw = storage.getItem(ADMIN_KEY);
    if (!raw) {
      storage.setItem(ADMIN_KEY, JSON.stringify(defaultState));
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<AdminState>;
    return {
      ...defaultState,
      ...parsed,
      loyalty: {
        ...defaultState.loyalty,
        ...parsed.loyalty,
      },
    };
  } catch {
    return defaultState;
  }
}

function writeAdminState(state: AdminState) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(ADMIN_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("edunova:admin-changed"));
}

function updateAdminState(updater: (state: AdminState) => AdminState) {
  const next = updater(readAdminState());
  writeAdminState(next);
  return next;
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function responseHoursForPriority(priority: TicketPriority) {
  switch (priority) {
    case "critical":
      return 1.5;
    case "high":
      return 2.5;
    case "medium":
      return 4;
    default:
      return 6;
  }
}

export function useAdminWorkspace() {
  const [state, setState] = useState<AdminState>(defaultState);

  useEffect(() => {
    setState(readAdminState());

    const sync = () => setState(readAdminState());
    window.addEventListener("edunova:admin-changed", sync);
    window.addEventListener("edunova:auth-users-changed", sync);
    window.addEventListener("edunova:enrollments-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("edunova:admin-changed", sync);
      window.removeEventListener("edunova:auth-users-changed", sync);
      window.removeEventListener("edunova:enrollments-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const users = useMemo(() => readUsers(), [state]);
  const orders = useMemo(() => readOrders(), [state]);

  const ticketCategories = useMemo(() => {
    const counts = new Map<string, number>();
    state.tickets.forEach((ticket) => {
      counts.set(ticket.category, (counts.get(ticket.category) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [state.tickets]);

  const ticketMetrics = useMemo(() => {
    const total = state.tickets.length;
    const resolved = state.tickets.filter(
      (ticket) => ticket.status === "resolved"
    ).length;
    const averageResponseTime =
      total > 0
        ? state.tickets.reduce((sum, ticket) => sum + ticket.responseHours, 0) /
          total
        : 0;
    const csat =
      state.reviews.length > 0
        ? state.reviews.reduce((sum, review) => sum + review.rating, 0) /
          state.reviews.length
        : 0;

    return {
      total,
      resolved,
      open: state.tickets.filter((ticket) => ticket.status === "open").length,
      pending: state.tickets.filter((ticket) => ticket.status === "pending").length,
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
      averageResponseTime,
      csat,
    };
  }, [state.reviews, state.tickets]);

  const userMetrics = useMemo(() => {
    const payingStudents = new Set(orders.map((order) => order.email)).size;
    return {
      registeredUsers: users.length,
      admins: users.filter((user) => user.isAdmin).length,
      payingStudents,
      conversionRate:
        users.length > 0 ? (payingStudents / users.length) * 100 : 0,
    };
  }, [orders, users]);

  const revenueMetrics = useMemo(() => {
    const grossRevenue = orders.reduce((sum, order) => sum + order.price, 0);
    const averageOrderValue = orders.length > 0 ? grossRevenue / orders.length : 0;
    const topCourses = Array.from(
      orders.reduce((map, order) => {
        const current = map.get(order.courseId) ?? {
          courseId: order.courseId,
          title: order.courseTitle,
          sales: 0,
          revenue: 0,
        };

        current.sales += 1;
        current.revenue += order.price;
        map.set(order.courseId, current);
        return map;
      }, new Map<number, { courseId: number; title: string; sales: number; revenue: number }>())
    )
      .map((entry) => entry[1])
      .sort((left, right) => right.revenue - left.revenue);

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      date.setDate(1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: monthLabel(date),
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const date = new Date(order.enrolledAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const target = months.find((month) => month.key === key);
      if (target) {
        target.revenue += order.price;
      }
    });

    const categoryRevenue = Array.from(
      orders.reduce((map, order) => {
        map.set(order.category, (map.get(order.category) ?? 0) + order.price);
        return map;
      }, new Map<string, number>())
    )
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value);

    return {
      grossRevenue,
      averageOrderValue,
      ordersCount: orders.length,
      topCourses,
      monthlyRevenue: months,
      categoryRevenue,
      recentOrders: orders.slice(0, 6),
    };
  }, [orders]);

  const marketingMetrics = useMemo(() => {
    const activeCampaigns = state.campaigns.filter(
      (campaign) => campaign.status === "active"
    );
    const spend = state.campaigns.reduce(
      (sum, campaign) => sum + campaign.spend,
      0
    );
    const impressions = state.campaigns.reduce(
      (sum, campaign) => sum + campaign.impressions,
      0
    );
    const clicks = state.campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const signups = state.campaigns.reduce(
      (sum, campaign) => sum + campaign.signups,
      0
    );
    const conversions = state.campaigns.reduce(
      (sum, campaign) => sum + campaign.conversions,
      0
    );
    const ltv = revenueMetrics.averageOrderValue || 4200;

    return {
      activeCampaigns: activeCampaigns.length,
      spend,
      impressions,
      clicks,
      signups,
      conversions,
      clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0,
      signupRate: clicks > 0 ? (signups / clicks) * 100 : 0,
      conversionRate: signups > 0 ? (conversions / signups) * 100 : 0,
      cac: conversions > 0 ? spend / conversions : 0,
      roi: spend > 0 ? ((ltv * conversions - spend) / spend) * 100 : 0,
      funnel: [
        { stage: "Impressions", value: impressions },
        { stage: "Clicks", value: clicks },
        { stage: "Signups", value: signups },
        { stage: "Paid Conversions", value: conversions },
      ],
    };
  }, [revenueMetrics.averageOrderValue, state.campaigns]);

  const operationsMetrics = useMemo(() => {
    const stageOrder: LeadStage[] = [
      "application",
      "demo",
      "interview",
      "onboarding",
      "live",
    ];

    const pipeline = stageOrder.map((stage) => ({
      stage,
      count: state.instructorLeads.filter((lead) => lead.stage === stage).length,
    }));

    return {
      pipeline,
      approvedCourses: state.reviewQueue.filter(
        (item) => item.status === "approved"
      ).length,
      pendingReviews: state.reviewQueue.filter(
        (item) => item.status !== "approved"
      ).length,
      elevatedServers: state.servers.filter((server) => server.status !== "Healthy")
        .length,
    };
  }, [state.instructorLeads, state.reviewQueue, state.servers]);

  const securityMetrics = useMemo(() => {
    const blockedEvents = state.securityEvents.filter(
      (event) => event.status === "blocked"
    ).length;
    const activeControls = state.securityControls.filter(
      (control) => control.active
    ).length;

    return {
      blockedEvents,
      activeControls,
      suspiciousEvents: blockedEvents,
    };
  }, [state.securityControls, state.securityEvents]);

  const orderedIncidents = useMemo(
    () =>
      [...state.incidents].sort(
        (left, right) =>
          severityWeight[left.severity] - severityWeight[right.severity]
      ),
    [state.incidents]
  );

  const orderedReviewQueue = useMemo(
    () =>
      [...state.reviewQueue].sort(
        (left, right) => reviewWeight[left.status] - reviewWeight[right.status]
      ),
    [state.reviewQueue]
  );

  const createTicket = useCallback(
    (input: {
      customerName: string;
      email: string;
      category: string;
      subject: string;
      priority: TicketPriority;
    }) => {
      const next = updateAdminState((current) => ({
        ...current,
        tickets: [
          {
            id: createId("ticket"),
            customerName: input.customerName.trim(),
            email: input.email.trim().toLowerCase(),
            category: input.category,
            subject: input.subject.trim(),
            priority: input.priority,
            status: "open",
            createdAt: new Date().toISOString(),
            responseHours: responseHoursForPriority(input.priority),
          },
          ...current.tickets,
        ],
      }));

      setState(next);
    },
    []
  );

  const updateTicketStatus = useCallback((id: string, status: TicketStatus) => {
    const next = updateAdminState((current) => ({
      ...current,
      tickets: current.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      ),
    }));

    setState(next);
  }, []);

  const updateIncidentStatus = useCallback(
    (id: string, status: IncidentStatus) => {
      const next = updateAdminState((current) => ({
        ...current,
        incidents: current.incidents.map((incident) =>
          incident.id === id
            ? {
                ...incident,
                status,
                updatedAt: new Date().toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : incident
        ),
      }));

      setState(next);
    },
    []
  );

  const addFeedbackAction = useCallback(
    (input: { trigger: string; action: string; outcome: string }) => {
      const next = updateAdminState((current) => ({
        ...current,
        feedbackActions: [
          {
            id: createId("feedback"),
            trigger: input.trigger.trim(),
            action: input.action.trim(),
            outcome: input.outcome.trim(),
          },
          ...current.feedbackActions,
        ],
      }));

      setState(next);
    },
    []
  );

  const updateChurnAction = useCallback((id: string, action: string) => {
    const next = updateAdminState((current) => ({
      ...current,
      churnRisks: current.churnRisks.map((risk) =>
        risk.id === id ? { ...risk, action } : risk
      ),
    }));

    setState(next);
  }, []);

  const createCampaign = useCallback(
    (input: {
      channel: string;
      spend: number;
      impressions: number;
      clicks: number;
      signups: number;
      conversions: number;
    }) => {
      const next = updateAdminState((current) => ({
        ...current,
        campaigns: [
          {
            id: createId("campaign"),
            channel: input.channel.trim(),
            spend: input.spend,
            impressions: input.impressions,
            clicks: input.clicks,
            signups: input.signups,
            conversions: input.conversions,
            status: "active",
          },
          ...current.campaigns,
        ],
      }));

      setState(next);
    },
    []
  );

  const toggleCampaign = useCallback((id: string) => {
    const next = updateAdminState((current) => ({
      ...current,
      campaigns: current.campaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status: campaign.status === "active" ? "paused" : "active",
            }
          : campaign
      ),
    }));

    setState(next);
  }, []);

  const bumpCampaignConversions = useCallback((id: string, amount = 1) => {
    const next = updateAdminState((current) => ({
      ...current,
      campaigns: current.campaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              conversions: campaign.conversions + amount,
            }
          : campaign
      ),
    }));

    setState(next);
  }, []);

  const addInstructorLead = useCallback(
    (input: { name: string; expertise: string }) => {
      const next = updateAdminState((current) => ({
        ...current,
        instructorLeads: [
          {
            id: createId("lead"),
            name: input.name.trim(),
            expertise: input.expertise.trim(),
            stage: "application",
          },
          ...current.instructorLeads,
        ],
      }));

      setState(next);
    },
    []
  );

  const moveInstructorLead = useCallback((id: string, stage: LeadStage) => {
    const next = updateAdminState((current) => ({
      ...current,
      instructorLeads: current.instructorLeads.map((lead) =>
        lead.id === id ? { ...lead, stage } : lead
      ),
    }));

    setState(next);
  }, []);

  const addReviewQueueItem = useCallback(
    (input: { title: string; instructor: string; category: string }) => {
      const next = updateAdminState((current) => ({
        ...current,
        reviewQueue: [
          {
            id: createId("queue"),
            title: input.title.trim(),
            instructor: input.instructor.trim(),
            reviewer: "Unassigned",
            category: input.category.trim(),
            status: "pending",
            submittedAt: new Date().toISOString().slice(0, 10),
          },
          ...current.reviewQueue,
        ],
      }));

      setState(next);
    },
    []
  );

  const updateReviewStatus = useCallback((id: string, status: ReviewStatus) => {
    const next = updateAdminState((current) => ({
      ...current,
      reviewQueue: current.reviewQueue.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));

    setState(next);
  }, []);

  const updateServer = useCallback(
    (id: string, patch: Partial<Pick<ServerNode, "load" | "status">>) => {
      const next = updateAdminState((current) => ({
        ...current,
        servers: current.servers.map((server) =>
          server.id === id ? { ...server, ...patch } : server
        ),
      }));

      setState(next);
    },
    []
  );

  const toggleSecurityEventStatus = useCallback((id: string) => {
    const next = updateAdminState((current) => ({
      ...current,
      securityEvents: current.securityEvents.map((event) =>
        event.id === id
          ? { ...event, status: event.status === "ok" ? "blocked" : "ok" }
          : event
      ),
    }));

    setState(next);
  }, []);

  const toggleSecurityControl = useCallback((id: string) => {
    const next = updateAdminState((current) => ({
      ...current,
      securityControls: current.securityControls.map((control) =>
        control.id === id ? { ...control, active: !control.active } : control
      ),
    }));

    setState(next);
  }, []);

  return {
    users,
    orders,
    state,
    ticketCategories,
    ticketMetrics,
    userMetrics,
    revenueMetrics,
    marketingMetrics,
    operationsMetrics,
    securityMetrics,
    orderedIncidents,
    orderedReviewQueue,
    createTicket,
    updateTicketStatus,
    updateIncidentStatus,
    addFeedbackAction,
    updateChurnAction,
    createCampaign,
    toggleCampaign,
    bumpCampaignConversions,
    addInstructorLead,
    moveInstructorLead,
    addReviewQueueItem,
    updateReviewStatus,
    updateServer,
    toggleSecurityEventStatus,
    toggleSecurityControl,
  };
}
