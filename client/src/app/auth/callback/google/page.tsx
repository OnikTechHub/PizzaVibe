'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pizza, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const oauthError = searchParams.get('error');

    if (oauthError) {
      setError(oauthError || 'Google authentication was cancelled or failed.');
      toast.error('Google authentication was cancelled.');
      setTimeout(() => router.push('/login'), 2500);
      return;
    }

    if (!code) {
      setError('Authorization code missing from Google callback.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const exchangeCode = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const redirectUri = `${window.location.origin}/auth/callback/google`;

        const res = await fetch(`${apiUrl}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to authenticate with Google.');
        }

        // Store JWT token and user profile in AuthContext
        login(data.token, data.user);
        toast.success(`Welcome to PizzaVibe, ${data.user.name}!`);
        router.push('/');
      } catch (err: unknown) {
        console.error('[Google Callback Error]:', err);
        const msg = err instanceof Error ? err.message : 'Google authentication failed';
        setError(msg);
        toast.error(msg);
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    exchangeCode();
  }, [searchParams, login, router]);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Pizza className="w-7 h-7" />
        </div>

        {error ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Authentication Error</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign-In Failed</h2>
            <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
            <p className="text-xs text-slate-400">Redirecting to sign-in page...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Authenticating with Google...</h2>
            <p className="text-xs text-slate-500">
              Please wait while PizzaVibe verifies your Google account credentials and secures your session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
