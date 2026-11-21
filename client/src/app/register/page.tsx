'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pizza,
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const queryStep = searchParams.get('step');
  const queryEmail = searchParams.get('email');

  // Step 1: 'form', Step 2: 'otp'
  const [step, setStep] = useState<'form' | 'otp'>(() =>
    queryStep === 'otp' && queryEmail ? 'otp' : 'form'
  );

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: queryEmail || '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCooldown > 0) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Submit Registration Form & Dispatch OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      toast.success('Verification code sent to your email!');
      setStep('otp');
      setResendCooldown(60);
      setCanResend(false);
    } catch (err: unknown) {
      console.error('[Registration Error]:', err);
      let errorMsg = 'Failed to create account. Please try again.';
      if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
        errorMsg = 'Backend server is offline on port 5000. Please start the server (`cd server && npm run dev`).';
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // OTP Input handlers (auto-advance & paste support)
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input
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

  // Step 2: Submit 6-Digit OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }

    setOtpLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid or expired verification code.');
      }

      // Save token & user in auth context
      login(data.token, data.user);
      toast.success('Email verified successfully! Welcome to PizzaVibe.');
      router.push('/');
    } catch (err: unknown) {
      console.error('[OTP Verification Error]:', err);
      const msg = err instanceof Error ? err.message : 'OTP verification failed';
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');

      toast.success('A fresh 6-digit code has been sent to your email.');
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

  // Google Sign-In Simulation
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const promptEmail = prompt('Enter your Google email to simulate Google Sign-In:', formData.email || 'customer@gmail.com');
      if (!promptEmail) {
        setGoogleLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || promptEmail.split('@')[0],
          email: promptEmail.trim().toLowerCase(),
          googleId: `google_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google sign-in failed');

      login(data.token, data.user);
      toast.success(`Welcome to PizzaVibe, ${data.user.name}!`);
      router.push('/');
    } catch (err: unknown) {
      console.error('[Google Sign-In Error]:', err);
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed';
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50/70 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Top Brand Header */}
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
            {step === 'form' ? 'Create an Account' : 'Verify Your Email'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">
            {step === 'form'
              ? 'Join PizzaVibe for hot stone-baked artisan pizzas & instant kitchen dispatch.'
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5">
          {step === 'form' ? (
            /* ========================================================
               STEP 1: REGISTRATION FORM
               ======================================================== */
            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-sm font-semibold flex items-center justify-center gap-3 shadow-xs transition-all duration-200 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  or register with email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Onik Das"
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Phone / Contact Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Phone / Contact Number <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1800-000000"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      required
                      disabled={loading}
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
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat your password"
                      required
                      disabled={loading}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account &bull; Verify OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Redirect */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-red-600 hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* ========================================================
               STEP 2: 6-DIGIT OTP VERIFICATION VIEW
               ======================================================== */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">Check Your Email</h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                We sent a 6-digit confirmation code to{' '}
                <strong className="text-slate-900">{formData.email}</strong>.
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Inputs */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
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
                      disabled={otpLoading}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-xl sm:text-2xl text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-red-600 focus:bg-white focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={otpLoading || otp.join('').length !== 6}
                  className="w-full py-3.5 px-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Activate Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend OTP & Change Email Options */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-3 text-xs sm:text-sm">
                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Resend Verification Code</span>
                    </button>
                  ) : (
                    <span className="text-slate-500">
                      Resend code in <strong className="text-slate-800">{resendCooldown}s</strong>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Wrong email? Edit details</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Privacy Guarantee Link */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Default Role: Customer &bull; Read our{' '}</span>
            <Link href="/privacy-policy" className="text-slate-600 underline hover:text-red-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
