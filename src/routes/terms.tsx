import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — EduNova" }, { name: "description", content: "Rules for using EduNova, IP ownership, refunds and account termination." }] }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: April 12, 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Acceptance</h2>
            <p>By creating an account or purchasing a course on EduNova, you agree to these Terms. If you do not agree, do not use the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">2. Eligibility & Account</h2>
            <p>You must be at least 13 years old. You are responsible for keeping your password confidential and for all activity on your account. Notify us immediately at security@edunova.in of any unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">3. Acceptable Use</h2>
            <p>You agree not to: share your account credentials, download or redistribute course videos outside the platform, scrape content using automated tools, attempt to reverse-engineer the service, harass other users or instructors, or use the platform for any unlawful purpose.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">4. Intellectual Property</h2>
            <p>All course content (videos, slides, assignments, code) remains the intellectual property of the respective instructor or EduNova. You receive a personal, non-transferable, non-exclusive license to view the content for the duration of your access. Any redistribution, public performance, or commercial use is strictly prohibited and may result in immediate termination and legal action.</p>
            <p className="mt-2">Work you submit (assignments, projects, comments) remains yours, but you grant EduNova a worldwide license to host and display it within the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">5. Payments & Pricing</h2>
            <p>All prices are in Indian Rupees (₹) and inclusive of applicable GST. Payments are processed by Razorpay. Subscription plans renew automatically unless cancelled at least 24 hours before the renewal date.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">6. Refund Policy</h2>
            <p>You may request a full refund within 7 days of purchase, provided you have completed less than 25% of the course. Refunds are processed to the original payment method within 5–7 business days. Subscription plans can be cancelled anytime; remaining days remain active until the end of the billing period and are not refunded pro-rata.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">7. Certificates</h2>
            <p>Certificates of completion are issued upon completing 100% of a course and passing the final assessment with at least 60%. Certificates are issued by EduNova and are not formal academic qualifications.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">8. Account Termination</h2>
            <p>We may suspend or terminate your account if you violate these Terms, engage in fraud, or use the platform in a way that harms other users. You may close your account at any time from Settings → Delete Account. Upon termination, your access to purchased courses ends and outstanding subscription fees are non-refundable.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">9. Disclaimers & Limitation of Liability</h2>
            <p>EduNova is provided "as is". We do not guarantee specific career or income outcomes. To the maximum extent permitted by law, our total liability is limited to the amount you paid in the previous 12 months.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">10. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">11. Contact</h2>
            <p>EduNova Technologies Pvt. Ltd. — <a className="text-primary underline" href="mailto:legal@edunova.in">legal@edunova.in</a></p>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
}
