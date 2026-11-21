'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pizza,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Edit2,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: 'email' (Step 1) | 'otp_reset' (Step 2)
  const [step, setStep] = useState<'email' | 'otp_reset'>('email');

  // Step 1: Email Form State
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 2: OTP & New Password Form State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Cooldown countdown for resend OTP
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp_reset' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Step 1: Submit email to receive 6-digit OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setEmailLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to dispatch reset code.');
      }

      toast.success('6-digit verification code sent to your email!');
      setStep('otp_reset');
      setResendCooldown(60);
      setCanResend(false);
    } catch (err: unknown) {
      console.error('[Forgot Password Error]:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send reset code';
      toast.error(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
    }
  };

  // Resend 6-Digit OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const res = await fetch(`${apiUrl}/auth/resend-forgot-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');

      toast.success('A fresh 6-digit code has been dispatched to your email.');
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60);
      setCanResend(false);
      otpInputsRef.current[0]?.focus();
    } catch (err: unknown) {
      console.error('[Resend OTP Error]:', err);
      const msg = err instanceof Error ? err.message : 'Failed to resend code';
      toast.error(msg);
    }
  };

  // Step 2: Submit OTP & New Password to reset
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify.');
      return;
    }

    setResetLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      toast.success('Your password has been updated! Please sign in with your new password.');
      router.push('/login');
    } catch (err: unknown) {
      console.error('[Reset Password Error]:', err);
      const msg = err instanceof Error ? err.message : 'Password reset failed';
      toast.error(msg);
    } finally {
      setResetLoading(false);
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
            {step === 'email' ? 'Forgot Password?' : 'Set New Password'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            {step === 'email'
              ? 'Enter your registered email address to receive a secure 6-digit OTP code.'
              : `Enter the 6-digit code sent to ${email} and choose your new password.`}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
          {step === 'email' ? (
            /* ========================================================
               STEP 1: SUBMIT EMAIL FOR 6-DIGIT OTP
               ======================================================== */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Account Email Address <span className="text-red-500">*</span>
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
                    disabled={emailLoading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-3.5 px-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending 6-Digit Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send 6-Digit OTP Code</span>
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
          ) : (
            /* ========================================================
               STEP 2: VERIFY OTP & ENTER NEW PASSWORD
               ======================================================== */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>

              <div className="mb-6 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-full py-1 px-3 text-xs text-slate-600 w-fit mx-auto">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-red-600 hover:underline flex items-center gap-0.5 ml-1 font-bold"
                  title="Change email address"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4 text-left">
                {/* 6-Digit OTP inputs */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2 text-center">
                    6-Digit Verification Code <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        disabled={resetLoading}
                        className="w-10 h-12 sm:w-11 sm:h-13 text-center font-bold text-xl text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-red-600 focus:bg-white focus:outline-none transition-all shadow-2xs"
                      />
                    ))}
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      disabled={resetLoading}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      required
                      disabled={resetLoading}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Reset Button */}
                <button
                  type="submit"
                  disabled={resetLoading || otp.join('').length !== 6 || password.length < 6}
                  className="w-full py-3.5 px-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reset Password &amp; Continue</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs sm:text-sm">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend 6-Digit Code</span>
                  </button>
                ) : (
                  <span className="text-slate-500">
                    Resend code in <strong className="text-slate-800">{resendCooldown}s</strong>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Need direct assistance? Contact <strong className="text-slate-700">onikdas.dev@gmail.com</strong></span>
          </p>
        </div>
      </div>
    </div>
  );
}
