import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 8, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground/90 selectable">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              AlgoBell ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Account Information:</strong> Email address, name, and authentication data when you sign up.</li>
              <li><strong className="text-foreground">Contest Preferences:</strong> Your platform selections, reminder settings, and contest subscriptions.</li>
              <li><strong className="text-foreground">Usage Data:</strong> How you interact with the app, including features used and pages visited.</li>
              <li><strong className="text-foreground">Device Information:</strong> Device type, operating system, and app version for optimization purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To send contest reminders via your chosen notification channels (in-app, email, WhatsApp).</li>
              <li>To personalize your experience and show relevant contests.</li>
              <li>To maintain and improve the app's functionality and performance.</li>
              <li>To communicate important updates about the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is securely stored using industry-standard encryption and cloud infrastructure. We use secure authentication protocols and do not store your passwords in plain text. Access to your data is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party services for authentication (Google Sign-In), notifications, and analytics. These services have their own privacy policies, and we encourage you to review them. We do not sell your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access, update, or delete your personal information at any time from your account settings.</li>
              <li>Opt out of non-essential notifications.</li>
              <li>Request a copy of your stored data.</li>
              <li>Delete your account and all associated data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes through the app or via email. Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@algobell.app" className="text-primary hover:underline">
                support@algobell.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
