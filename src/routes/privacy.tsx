import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — EduNova" }, { name: "description", content: "How EduNova collects, stores, and protects your personal data." }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: April 12, 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
            <p>EduNova ("we", "us", "our") collects the following categories of data when you use our platform:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><b>Account information:</b> name, email address, phone number, profile photo.</li>
              <li><b>Payment information:</b> billing name, last 4 digits of card, payment method, transaction history. Full card numbers are processed by Razorpay and never touch our servers.</li>
              <li><b>Learning data:</b> courses enrolled, lesson progress, quiz scores, assignments submitted, time spent.</li>
              <li><b>Device & usage data:</b> IP address, browser type, OS, device identifiers, pages visited, referrer.</li>
              <li><b>Communications:</b> support tickets, in-app messages, course reviews.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. How We Use Your Data</h2>
            <p>We use this data to: deliver the courses you enroll in, personalize recommendations, process payments, send transactional emails, prevent fraud and abuse, comply with tax and legal obligations, and improve the platform based on aggregated analytics.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. Cookies & Tracking</h2>
            <p>We use essential cookies for authentication, analytics cookies (PostHog) to understand product usage, and advertising cookies (Meta, Google) when you visit pages that include them. You can disable non-essential cookies from the cookie banner.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. Third-Party Sharing</h2>
            <p>We share data only with the processors required to operate the service: Razorpay (payments), AWS Mumbai (hosting), Cloudflare (CDN), Postmark (transactional email), and Zendesk (support). We never sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. Your Rights</h2>
            <p>Under India's DPDP Act 2023 and the EU GDPR, you have the right to: access your data, correct inaccuracies, request deletion, export your data in a machine-readable format, withdraw consent, and lodge a complaint with the relevant Data Protection Authority. Email <a className="text-primary underline" href="mailto:privacy@edunova.in">privacy@edunova.in</a> to exercise any of these rights — we respond within 7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. Data Retention</h2>
            <p>Account data is retained for as long as your account is active. Upon deletion request, data is removed from production systems within 30 days and from encrypted backups within 90 days. Anonymized analytics may be retained indefinitely.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">7. Security</h2>
            <p>All data at rest is encrypted with AES-256. All traffic uses TLS 1.3. We enforce 2FA for staff accounts, conduct quarterly penetration tests, and maintain a public security disclosure program at security@edunova.in.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">8. Children's Privacy</h2>
            <p>EduNova is not intended for users under 13. Users between 13 and 18 require verifiable parental consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">9. Contact</h2>
            <p>EduNova Technologies Pvt. Ltd.<br />Grievance Officer: Mr. Rajesh Kumar<br />Email: <a className="text-primary underline" href="mailto:grievance@edunova.in">grievance@edunova.in</a><br />Address: 4th Floor, Prestige Tech Park, Bengaluru 560103, India</p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
