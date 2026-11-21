'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side quick validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      toast.error('Please enter a subject (at least 3 characters).');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      toast.error('Please provide a descriptive message (at least 10 characters).');
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to deliver message. Please try again.');
      }

      toast.success('Your message has been sent to our kitchen team!');
      setSubmitted(true);
      setFormData(initialForm);
    } catch (err: unknown) {
      console.error('[Contact Form Error]:', err);
      let errorMsg = 'Unable to connect to the server. Please try again later.';
      if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
        errorMsg =
          'Backend server is offline or unreachable on port 5000. Please ensure the backend is running (`cd server && npm run dev`) or email us directly at onikdas.dev@gmail.com.';
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen">
      {/* 1. Header Banner */}
      <section className="bg-slate-50 border-b border-slate-200/80 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-4 py-1.5 mb-5 text-xs sm:text-sm font-semibold text-red-700 shadow-xs">
            <Mail className="w-4 h-4" />
            <span>Chattogram Kitchen Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Get in Touch with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
              PizzaVibe
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have a question about our 48-hour sourdough, bulk event catering, or feedback on an order? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Direct Contact Details & Operating Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  Kitchen Headquarters
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
                  Visit or Reach Us Directly
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our central stone oven hearth is located right in the heart of Chattogram. Drop by or reach out via phone or email anytime during kitchen hours.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                {/* Address Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 hover:border-red-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Kitchen Address</h3>
                    <p className="text-sm text-slate-600 leading-snug">
                      GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                      Primary Stone Oven Hub
                    </span>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 hover:border-red-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Direct Kitchen Hotlines</h3>
                    <p className="text-sm text-slate-600">
                      <a
                        href="tel:+8801828347761"
                        className="font-semibold text-slate-900 hover:text-red-600 transition-colors"
                      >
                        +880 1828347761
                      </a>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Available for live order inquiries &amp; rapid dispatch status.
                    </p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4 hover:border-red-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Official Email</h3>
                    <p className="text-sm text-slate-600">
                      <a
                        href="mailto:onikdas.dev@gmail.com"
                        className="font-semibold text-slate-900 hover:text-red-600 transition-colors break-all"
                      >
                        onikdas.dev@gmail.com
                      </a>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Replies sent within 24 hours by our culinary team.
                    </p>
                  </div>
                </div>

                {/* Operating Hours Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Baking Hours</h3>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Mon &ndash; Thu:</span>
                        <span className="font-semibold text-slate-800">11:00 AM &ndash; 11:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Friday:</span>
                        <span className="font-semibold text-slate-800">11:00 AM &ndash; 1:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday:</span>
                        <span className="font-semibold text-slate-800">10:30 AM &ndash; 1:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday:</span>
                        <span className="font-semibold text-slate-800">10:30 AM &ndash; 11:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-9 rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  Send a Message to the Kitchen
                </h3>
                <p className="text-sm text-slate-600">
                  Fill in the details below and your message will be forwarded directly to our inbox.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold">Thank you for reaching out!</p>
                    <p className="mt-0.5 text-emerald-700">
                      We have received your message and sent a confirmation receipt to your email. We will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tanvir Ahmed"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. tanvir@example.com"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                {/* Subject Selection / Input */}
                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Subject / Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Bulk Catering for Office Party / Dietary Question"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-y disabled:opacity-50"
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span>Minimum 10 characters</span>
                    <span>{formData.message.length} chars</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending to Kitchen...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
