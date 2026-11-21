'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pizza, Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to dispatch reset instructions.');
      }

      setSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch (err: unknown) {
      console.error('[Forgot Password Error]:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send reset link';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/70 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-slate-900 group mb-4">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 group-hover:rotate-12 transition-transform duration-300">
              <Pizza className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              Pizza<span className="text-red-600">Vibe</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">
            Enter your email and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
          {submitted ? (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Instructions Dispatched</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                If an account exists with <strong className="text-slate-900">{email}</strong>, we have sent a secure password reset link valid for 1 hour.
              </p>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-5 rounded-full shadow-md shadow-red-600/20 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Didn&apos;t receive email? Try another address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-red-600"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer Privacy Guarantee Link */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need help? Contact <strong className="text-slate-700">onikdas.dev@gmail.com</strong></span>
          </p>
        </div>
      </div>
    </div>
  );
}
