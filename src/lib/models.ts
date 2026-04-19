export type User = {
  email: string;
  name: string;
  isAdmin: boolean;
};

export type Enrollment = {
  courseId: number;
  enrolledAt: string;
  progress: number;
};

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

export type AdminState = {
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

export const defaultAdminState: AdminState = {
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
    {
      id: "lead-1",
      name: "Neha Gupta",
      expertise: "Backend systems",
      stage: "application",
    },
    {
      id: "lead-2",
      name: "Rohan Bose",
      expertise: "Product design",
      stage: "demo",
    },
    {
      id: "lead-3",
      name: "Kunal Verma",
      expertise: "Growth marketing",
      stage: "interview",
    },
    {
      id: "lead-4",
      name: "Aditi Rao",
      expertise: "Finance",
      stage: "onboarding",
    },
    {
      id: "lead-5",
      name: "Samar Jain",
      expertise: "Frontend engineering",
      stage: "live",
    },
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
      name: "Secure Cookie Sessions",
      why: "HttpOnly session cookies protect admin access without exposing tokens to the browser runtime.",
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
