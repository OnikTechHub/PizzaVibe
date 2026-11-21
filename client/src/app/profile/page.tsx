'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Loader2,
  LayoutDashboard,
  Utensils,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Profile Updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters long.');
      return;
    }

    setSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile information.');
      }

      // Update AuthContext & localStorage
      updateUser({
        name: data.user.name,
        phone: data.user.phone,
      });

      toast.success('Your profile has been successfully updated!');
      setIsEditing(false);
    } catch (err: unknown) {
      console.error('[Profile Update Error]:', err);
      const message = err instanceof Error ? err.message : 'Error updating profile. Please try again.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Account Sign-In Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with your PizzaVibe account credentials to view and manage your profile details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-sm transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const roleIsAdmin = user.role === 'admin';

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900">User Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                My Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage your personal details, contact preferences, and account permissions.
              </p>
            </div>

            {/* Quick Link to Dashboard */}
            <Link
              href={roleIsAdmin ? '/admin/dashboard' : '/dashboard'}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-slate-200 hover:border-red-200 transition-all shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-red-600" />
              <span>Go to {roleIsAdmin ? 'Admin Dashboard' : 'My Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-sm mb-8">
          {/* Avatar Snapshot Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md shadow-red-600/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{user.name}</h2>
                  {roleIsAdmin ? (
                    <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Customer
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            {/* Toggle Edit Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <Edit3 className="w-4 h-4 text-red-600" />
                <span>Edit Information</span>
              </button>
            )}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSaveProfile} className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
                >
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email Address (Read-Only) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-800">
                    Email Address
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-600">
                  <div className="flex items-center gap-2.5 truncate">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <span title="Email cannot be edited directly">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </span>
                </div>
              </div>

              {/* Contact Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5"
                >
                  Contact Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1828347761"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user.phone ? user.phone : 'Not provided yet'}</span>
                  </div>
                )}
              </div>

              {/* Database Role (Read-Only) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    Account Role
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Database Managed
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    {roleIsAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="capitalize font-semibold">{user.role}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {roleIsAdmin ? 'Full Kitchen & Order Authority' : 'Standard Ordering Privileges'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save / Cancel Controls */}
            {isEditing && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
                    });
                  }}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4" />
                    Cancel
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={roleIsAdmin ? '/admin/dashboard' : '/dashboard'}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
              {roleIsAdmin ? 'Admin Overview' : 'Order History'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {roleIsAdmin
                ? 'Manage orders, telemetry, and kitchen inventory.'
                : 'Track ongoing orders and review previous receipts.'}
            </p>
          </Link>

          <Link
            href="/#menu"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
              Artisan Menu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse stone-baked sourdough pizzas and customize your toppings.
            </p>
          </Link>

          <Link
            href="/contact"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
              Kitchen Support
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Contact our central Chattogram kitchen for catering or questions.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
