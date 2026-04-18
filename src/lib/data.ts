export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

export const courses = [
  { id: 1, title: "Full-Stack Web Development Bootcamp", instructor: "Aarav Mehta", rating: 4.9, students: 12480, price: 2499, color: "from-violet-500 to-fuchsia-500", category: "Tech" },
  { id: 2, title: "Product Design Masterclass", instructor: "Priya Sharma", rating: 4.8, students: 8120, price: 1899, color: "from-pink-500 to-rose-500", category: "Design" },
  { id: 3, title: "Digital Marketing 360", instructor: "Rohan Kapoor", rating: 4.7, students: 9540, price: 1499, color: "from-amber-500 to-orange-500", category: "Marketing" },
  { id: 4, title: "Data Science with Python", instructor: "Dr. Neha Iyer", rating: 4.9, students: 15670, price: 2999, color: "from-blue-500 to-cyan-500", category: "Tech" },
  { id: 5, title: "Startup Finance & Fundraising", instructor: "Vikram Singh", rating: 4.6, students: 5430, price: 1799, color: "from-emerald-500 to-teal-500", category: "Finance" },
  { id: 6, title: "Public Speaking & Confidence", instructor: "Ananya Rao", rating: 4.8, students: 7210, price: 999, color: "from-purple-500 to-indigo-500", category: "Personal Development" },
];

export const categories = [
  { name: "Tech", count: 64, icon: "💻" },
  { name: "Business", count: 41, icon: "📈" },
  { name: "Design", count: 33, icon: "🎨" },
  { name: "Marketing", count: 28, icon: "📣" },
  { name: "Finance", count: 22, icon: "💰" },
  { name: "Personal Development", count: 19, icon: "🌱" },
];

export const testimonials = [
  { name: "Ishita Verma", role: "Frontend Engineer @ Razorpay", text: "EduNova completely changed my career. The Web Dev Bootcamp landed me a job within 3 months.", rating: 5 },
  { name: "Karthik Reddy", role: "Product Designer @ Zomato", text: "Best UI/UX content I've seen in India. Real-world projects, real mentorship.", rating: 5 },
  { name: "Sneha Patil", role: "Founder, Bloomly", text: "The Startup Finance course gave me the confidence to raise our seed round. Worth every rupee.", rating: 5 },
];

// Admin: CRM
export const ticketCategories = [
  { name: "Payment Issues", value: 38, color: "var(--color-chart-1)" },
  { name: "Course Quality", value: 22, color: "var(--color-chart-2)" },
  { name: "Technical Bugs", value: 19, color: "var(--color-chart-3)" },
  { name: "Refund Requests", value: 13, color: "var(--color-chart-4)" },
  { name: "Other", value: 8, color: "var(--color-chart-5)" },
];

export const criticalIssues = [
  { title: "Payment gateway timeout", reports: 473, severity: "CRITICAL", status: "Resolved" },
  { title: "Video buffering on mobile (Android)", reports: 218, severity: "HIGH", status: "In Progress" },
  { title: "Certificate generation delay", reports: 91, severity: "MEDIUM", status: "Monitoring" },
];

export const feedbackLoop = [
  { trigger: "473 payment complaints", action: "Migrated payment processor to Razorpay", outcome: "Complaints dropped by 71%" },
  { trigger: "218 mobile buffering reports", action: "Switched video CDN to Cloudflare Stream", outcome: "Avg load time: 6.2s → 1.8s" },
  { trigger: "152 'too theoretical' reviews on DS course", action: "Added 12 hands-on Kaggle projects", outcome: "Course rating: 4.3 → 4.9" },
];

// Admin: Revenue
export const revenueStreams = [
  { model: "Sales Revenue", desc: "One-time course purchases", amount: 1200000, color: "var(--color-chart-1)" },
  { model: "Subscription Revenue", desc: "EduNova Pro monthly subscription", amount: 850000, color: "var(--color-chart-2)" },
  { model: "Transaction Fee Revenue", desc: "Certificate issuance fees", amount: 320000, color: "var(--color-chart-3)" },
  { model: "Affiliate Revenue", desc: "Partner & broker referrals", amount: 275000, color: "var(--color-chart-4)" },
  { model: "Advertising Revenue", desc: "Sponsored placements & ads", amount: 200000, color: "var(--color-chart-5)" },
];

export const monthlyRevenue = [
  { month: "Nov", revenue: 1820000 },
  { month: "Dec", revenue: 2010000 },
  { month: "Jan", revenue: 2240000 },
  { month: "Feb", revenue: 2380000 },
  { month: "Mar", revenue: 2620000 },
  { month: "Apr", revenue: 2845000 },
];

export const topCourses = [
  { title: "Full-Stack Web Dev Bootcamp", revenue: 542000, sales: 217 },
  { title: "Data Science with Python", revenue: 489000, sales: 163 },
  { title: "Product Design Masterclass", revenue: 312000, sales: 164 },
  { title: "Digital Marketing 360", revenue: 268000, sales: 179 },
  { title: "Startup Finance & Fundraising", revenue: 215000, sales: 119 },
];

// Admin: Marketing
export const campaigns = [
  { channel: "Google Ads", spend: 50000, metric1: "12,400 impressions", metric2: "3.2% CTR", conversions: 396, color: "from-blue-500 to-cyan-500" },
  { channel: "Instagram / Meta Ads", spend: 30000, metric1: "28,000 reach", metric2: "2.1% CTR", conversions: 210, color: "from-pink-500 to-rose-500" },
  { channel: "Email Marketing", spend: 8000, metric1: "15,000 sent · 34% open", metric2: "8% click rate", conversions: 408, color: "from-amber-500 to-orange-500" },
  { channel: "Referral Program", spend: 0, metric1: "820 referrals sent", metric2: "37.8% conversion", conversions: 310, color: "from-emerald-500 to-teal-500" },
  { channel: "SEO / Content Blog", spend: 12000, metric1: "22,000 organic visits", metric2: "0.8% conversion", conversions: 180, color: "from-violet-500 to-purple-500" },
];

export const funnel = [
  { stage: "Impressions", value: 410000 },
  { stage: "Clicks", value: 38400 },
  { stage: "Signups", value: 6820 },
  { stage: "Paid Conversions", value: 1504 },
];

// Security
export const loginActivity = [
  { time: "Today, 09:14", ip: "103.21.45.12", device: "MacBook Pro · Chrome", location: "Bengaluru, IN", status: "ok" },
  { time: "Today, 02:08", ip: "49.36.112.4", device: "iPhone 15 · Safari", location: "Bengaluru, IN", status: "ok" },
  { time: "Yesterday, 18:42", ip: "157.51.88.231", device: "Windows · Edge", location: "Mumbai, IN", status: "ok" },
  { time: "Yesterday, 03:21", ip: "45.227.255.91", device: "Unknown · curl", location: "Unknown", status: "blocked" },
  { time: "2 days ago, 11:05", ip: "103.21.45.12", device: "MacBook Pro · Chrome", location: "Bengaluru, IN", status: "ok" },
];

export const securityPractices = [
  { name: "AES-256 Data Encryption", why: "All sensitive data at rest is encrypted with industry-standard AES-256, ensuring even a database breach cannot expose user info." },
  { name: "JWT Authentication", why: "Stateless signed tokens prevent session hijacking and let us scale auth across services without shared session storage." },
  { name: "Two-Factor Authentication (2FA)", why: "TOTP-based 2FA blocks 99.9% of automated account takeover attempts even if a password leaks." },
  { name: "HTTPS / SSL Everywhere", why: "All traffic is encrypted in transit with TLS 1.3, preventing man-in-the-middle attacks on public Wi-Fi." },
  { name: "Input Validation & XSS Protection", why: "Every user input is sanitized server-side and CSP headers block injected scripts from running." },
  { name: "GDPR-Compliant Data Storage", why: "Data is stored in region-locked servers with documented retention, export and deletion workflows." },
  { name: "Rate Limiting", why: "Per-IP and per-user throttling stops brute-force, scraping, and credential-stuffing attacks before they succeed." },
];
