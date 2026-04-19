import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  bumpCampaignConversionsServer,
  createAdminTicket,
  createCampaignServer,
  createFeedbackAction,
  createInstructorLeadServer,
  createReviewQueueItemServer,
  getAdminSnapshot,
  moveInstructorLeadServer,
  toggleCampaignServer,
  toggleSecurityControlServer,
  toggleSecurityEventServer,
  updateAdminIncidentStatus,
  updateAdminTicketStatus,
  updateChurnActionServer,
  updateReviewStatusServer,
  updateServerStatusServer,
} from "@/lib/server-fns";
import {
  defaultAdminState,
  type AdminIncident,
  type AdminState,
  type AdminUser,
  type EnrollmentOrder,
  type IncidentStatus,
  type LeadStage,
  type ReviewStatus,
  type ServerNode,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/models";

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

export function useAdminWorkspace() {
  const [state, setState] = useState<AdminState>(defaultAdminState);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<EnrollmentOrder[]>([]);

  const getAdminSnapshotFn = useServerFn(getAdminSnapshot);
  const createTicketFn = useServerFn(createAdminTicket);
  const updateTicketStatusFn = useServerFn(updateAdminTicketStatus);
  const updateIncidentStatusFn = useServerFn(updateAdminIncidentStatus);
  const addFeedbackActionFn = useServerFn(createFeedbackAction);
  const updateChurnActionFn = useServerFn(updateChurnActionServer);
  const createCampaignFn = useServerFn(createCampaignServer);
  const toggleCampaignFn = useServerFn(toggleCampaignServer);
  const bumpCampaignFn = useServerFn(bumpCampaignConversionsServer);
  const addInstructorLeadFn = useServerFn(createInstructorLeadServer);
  const moveInstructorLeadFn = useServerFn(moveInstructorLeadServer);
  const addReviewQueueItemFn = useServerFn(createReviewQueueItemServer);
  const updateReviewStatusFn = useServerFn(updateReviewStatusServer);
  const updateServerFn = useServerFn(updateServerStatusServer);
  const toggleSecurityEventFn = useServerFn(toggleSecurityEventServer);
  const toggleSecurityControlFn = useServerFn(toggleSecurityControlServer);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getAdminSnapshotFn();
      setUsers(snapshot.users);
      setOrders(snapshot.orders);
      setState(snapshot.adminState);
      return snapshot;
    } catch {
      setUsers([]);
      setOrders([]);
      setState(defaultAdminState);
      return null;
    }
  }, [getAdminSnapshotFn]);

  useEffect(() => {
    void refresh();

    const handler = () => {
      void refresh();
    };

    window.addEventListener("edunova:auth-changed", handler);
    window.addEventListener("edunova:admin-changed", handler);
    window.addEventListener("edunova:enrollments-changed", handler);

    return () => {
      window.removeEventListener("edunova:auth-changed", handler);
      window.removeEventListener("edunova:admin-changed", handler);
      window.removeEventListener("edunova:enrollments-changed", handler);
    };
  }, [refresh]);

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
        month: date.toLocaleString("en-US", { month: "short" }),
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const date = new Date(order.enrolledAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const target = months.find((month) => month.key === key);
      if (target) target.revenue += order.price;
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

  const finishMutation = useCallback(async () => {
    await refresh();
    window.dispatchEvent(new CustomEvent("edunova:admin-changed"));
  }, [refresh]);

  const createTicket = useCallback(
    async (input: {
      customerName: string;
      email: string;
      category: string;
      subject: string;
      priority: TicketPriority;
    }) => {
      await createTicketFn({ data: input });
      await finishMutation();
    },
    [createTicketFn, finishMutation]
  );

  const updateTicketStatus = useCallback(
    async (id: string, status: TicketStatus) => {
      await updateTicketStatusFn({ data: { id, status } });
      await finishMutation();
    },
    [finishMutation, updateTicketStatusFn]
  );

  const updateIncidentStatus = useCallback(
    async (id: string, status: IncidentStatus) => {
      await updateIncidentStatusFn({ data: { id, status } });
      await finishMutation();
    },
    [finishMutation, updateIncidentStatusFn]
  );

  const addFeedbackAction = useCallback(
    async (input: { trigger: string; action: string; outcome: string }) => {
      await addFeedbackActionFn({ data: input });
      await finishMutation();
    },
    [addFeedbackActionFn, finishMutation]
  );

  const updateChurnAction = useCallback(
    async (id: string, action: string) => {
      await updateChurnActionFn({ data: { id, action } });
      await finishMutation();
    },
    [finishMutation, updateChurnActionFn]
  );

  const createCampaign = useCallback(
    async (input: {
      channel: string;
      spend: number;
      impressions: number;
      clicks: number;
      signups: number;
      conversions: number;
    }) => {
      await createCampaignFn({ data: input });
      await finishMutation();
    },
    [createCampaignFn, finishMutation]
  );

  const toggleCampaign = useCallback(
    async (id: string) => {
      await toggleCampaignFn({ data: { id } });
      await finishMutation();
    },
    [finishMutation, toggleCampaignFn]
  );

  const bumpCampaignConversions = useCallback(
    async (id: string, amount = 1) => {
      await bumpCampaignFn({ data: { id, amount } });
      await finishMutation();
    },
    [bumpCampaignFn, finishMutation]
  );

  const addInstructorLead = useCallback(
    async (input: { name: string; expertise: string }) => {
      await addInstructorLeadFn({ data: input });
      await finishMutation();
    },
    [addInstructorLeadFn, finishMutation]
  );

  const moveInstructorLead = useCallback(
    async (id: string, stage: LeadStage) => {
      await moveInstructorLeadFn({ data: { id, stage } });
      await finishMutation();
    },
    [finishMutation, moveInstructorLeadFn]
  );

  const addReviewQueueItem = useCallback(
    async (input: { title: string; instructor: string; category: string }) => {
      await addReviewQueueItemFn({ data: input });
      await finishMutation();
    },
    [addReviewQueueItemFn, finishMutation]
  );

  const updateReviewStatus = useCallback(
    async (id: string, status: ReviewStatus) => {
      await updateReviewStatusFn({ data: { id, status } });
      await finishMutation();
    },
    [finishMutation, updateReviewStatusFn]
  );

  const updateServer = useCallback(
    async (id: string, patch: Partial<Pick<ServerNode, "load" | "status">>) => {
      const current = state.servers.find((server) => server.id === id);
      if (!current) return;

      await updateServerFn({
        data: {
          id,
          load: patch.load ?? current.load,
          status: patch.status ?? current.status,
        },
      });
      await finishMutation();
    },
    [finishMutation, state.servers, updateServerFn]
  );

  const toggleSecurityEventStatus = useCallback(
    async (id: string) => {
      await toggleSecurityEventFn({ data: { id } });
      await finishMutation();
    },
    [finishMutation, toggleSecurityEventFn]
  );

  const toggleSecurityControl = useCallback(
    async (id: string) => {
      await toggleSecurityControlFn({ data: { id } });
      await finishMutation();
    },
    [finishMutation, toggleSecurityControlFn]
  );

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
    refresh,
  };
}

export type {
  AdminState,
  AdminUser,
  EnrollmentOrder,
  IncidentStatus,
  LeadStage,
  ReviewStatus,
  TicketPriority,
  TicketStatus,
} from "@/lib/models";
