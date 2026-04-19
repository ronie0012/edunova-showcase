import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { type ReactNode } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveNumber } from "@/components/LiveNumber";
import { useAdminWorkspace } from "@/lib/admin";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({
    meta: [
      { title: "Revenue Dashboard - EduNova Admin" },
      {
        name: "description",
        content:
          "Live enrollment revenue, course performance, and recent orders for EduNova.",
      },
    ],
  }),
  component: RevenueDashboard,
});

const colors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function RevenueDashboard() {
  const { revenueMetrics, userMetrics } = useAdminWorkspace();

  return (
    <DashboardLayout role="admin" title="Revenue dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RevenueCard
          label="Gross revenue"
          value={
            <LiveNumber
              value={revenueMetrics.grossRevenue}
              prefix="Rs "
              drift={0.001}
            />
          }
          icon={Banknote}
        />
        <RevenueCard
          label="Orders"
          value={<LiveNumber value={revenueMetrics.ordersCount} drift={0.002} />}
          icon={Receipt}
        />
        <RevenueCard
          label="Avg order value"
          value={
            <LiveNumber
              value={revenueMetrics.averageOrderValue}
              prefix="Rs "
              format={(value) => Math.round(value).toLocaleString("en-IN")}
              drift={0.001}
            />
          }
          icon={ShoppingBag}
        />
        <RevenueCard
          label="Paying learners"
          value={
            <LiveNumber value={userMetrics.payingStudents} drift={0.0015} />
          }
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Monthly revenue</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Derived directly from course enrollments stored in the app.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              Last 6 months
            </span>
          </div>

          {revenueMetrics.ordersCount > 0 ? (
            <div className="mt-5 h-80">
              <ResponsiveContainer>
                <LineChart data={revenueMetrics.monthlyRevenue}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `Rs ${Math.round(value).toLocaleString("en-IN")}`
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    dataKey="revenue"
                    type="monotone"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "var(--color-primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState text="No enrollments yet. Revenue charts will populate as learners purchase courses." />
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div>
            <h3 className="font-semibold">Revenue mix by category</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Which course categories are driving the current revenue.
            </p>
          </div>

          {revenueMetrics.categoryRevenue.length > 0 ? (
            <div className="mt-5 h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={revenueMetrics.categoryRevenue}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                  >
                    {revenueMetrics.categoryRevenue.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState text="Category mix appears after the first order lands." />
          )}
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Top selling courses</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Ranked by real revenue from completed enrollments.
              </p>
            </div>
          </div>

          {revenueMetrics.topCourses.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2 text-left">Course</th>
                    <th className="text-right">Sales</th>
                    <th className="text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueMetrics.topCourses.map((course) => (
                    <tr
                      key={course.courseId}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 font-medium">{course.title}</td>
                      <td className="text-right">{course.sales}</td>
                      <td className="text-right font-semibold">{formatCurrency(course.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState text="Top courses will appear once someone checks out successfully." />
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-semibold">Recent orders</h3>
          <div className="mt-4 space-y-3">
            {revenueMetrics.recentOrders.length > 0 ? (
              revenueMetrics.recentOrders.map((order) => (
                <div
                  key={`${order.email}-${order.courseId}-${order.enrolledAt}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="font-medium">{order.courseTitle}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {order.email}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.enrolledAt).toLocaleString("en-IN")}
                    </span>
                    <span className="font-semibold">{formatCurrency(order.price)}</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="No recent orders yet." />
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function formatCurrency(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function RevenueCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: typeof Banknote;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
      {text}
    </div>
  );
}
