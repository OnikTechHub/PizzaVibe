import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | PizzaVibe',
  description:
    'Read the PizzaVibe Privacy Policy to understand how we protect your personal information, handle secure Razorpay transactions, and maintain confidentiality.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-white text-slate-900 min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-4 py-1.5 mb-5 text-xs sm:text-sm font-semibold text-red-700 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparency &amp; Trust</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            PizzaVibe Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Your trust is our most important ingredient. Here is a clear, transparent breakdown of how we collect, protect, and respect your personal data.
          </p>

          <p className="text-xs text-slate-500 mt-4">
            Effective Date: <strong>November 2026</strong> &bull; Last Updated: <strong>November 21, 2026</strong>
          </p>
        </div>
      </section>

      {/* 2. Policy Content Sections */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          {/* Quick Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Encrypted Payments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Processed via PCI-DSS compliant Razorpay. We never store or view raw card or CVV details.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Zero Data Selling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never sell, rent, or trade your contact info to third-party ad networks or brokers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">You Are in Control</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can request account data review, export, or permanent profile deletion at any time.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When you interact with the PizzaVibe platform (visiting our website, creating an account, or placing an order for stone-baked pizza delivery), we collect necessary personal details, including:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>
                <strong>Contact &amp; Account Information:</strong> Your full name, email address, contact phone number, and encrypted password credentials.
              </li>
              <li>
                <strong>Order &amp; Delivery Details:</strong> Your designated delivery address within the Chattogram metropolitan area, order history, custom topping selections, and special culinary instructions.
              </li>
              <li>
                <strong>Technical &amp; Device Information:</strong> IP address, device type, browser user-agent, and session identifiers to safeguard our servers and prevent unauthorized access.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              2. How We Use Your Information
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We strictly utilize collected information to deliver authentic culinary experiences and maintain platform reliability:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>Processing, preparing, and packaging your custom pizza orders at our kitchen.</li>
              <li>Fulfilling our guaranteed 30-minute rapid doorstep dispatch to your address.</li>
              <li>Sending live order status alerts, email receipts, and kitchen customer service updates.</li>
              <li>Protecting users against fraudulent transactions, spam, and platform abuse.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              3. Payment Security &amp; Razorpay Gateway
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Your financial security is paramount. Online payments on PizzaVibe are processed through <strong>Razorpay</strong>, an internationally accredited, PCI-DSS Level 1 certified payment service provider.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When paying online via credit card, debit card, net banking, or digital wallet, your transaction data is encrypted directly via end-to-end TLS protocols. <strong>PizzaVibe never stores, processes, or has access to your full credit card number, CVV code, or banking passwords on our servers.</strong>
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              4. Cookies &amp; Authentication Sessions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              PizzaVibe utilizes industry-standard JSON Web Tokens (JWT) for secure, stateless user authentication. We also use functional browser cookies and local storage to:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>Keep you securely logged in across navigation sessions.</li>
              <li>Preserve items in your active shopping cart drawer while browsing our menu.</li>
              <li>Remember theme and localization preferences.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              5. Data Sharing &amp; Third-Party Disclosures
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We uphold a strict zero-selling policy. We do not sell or monetize personal customer records under any circumstances. Information is shared strictly on a need-to-know basis with:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>
                <strong>Authorized Delivery Riders:</strong> Providing your delivery address and contact number solely to execute the 30-minute delivery dispatch.
              </li>
              <li>
                <strong>Payment &amp; Communication Providers:</strong> Razorpay for payment authorization and Nodemailer / Gmail SMTP for transactional order confirmation emails.
              </li>
              <li>
                <strong>Legal Authorities:</strong> Only if required by applicable laws of Bangladesh or court order.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              6. Your Privacy Rights &amp; Data Control
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              As a PizzaVibe customer, you have full control over your personal records:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 pl-4 list-disc">
              <li>Request a complete copy of the data associated with your account.</li>
              <li>Update or correct outdated delivery addresses and contact information.</li>
              <li>Request permanent account deletion and purging of profile information from our database.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              7. Contacting Our Data Protection Team
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal information is handled, please contact our team:
            </p>
            <div className="pt-2 space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                <span>Email: <a href="mailto:onikdas.dev@gmail.com" className="font-semibold text-red-600 hover:underline">onikdas.dev@gmail.com</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Address: PizzaVibe Kitchen, GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
