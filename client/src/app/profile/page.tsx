'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Lock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
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

  return (
    <CustomerDashboardLayout>
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header Card (Clean White Bar matching Screenshot 3) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Personal Information</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Account Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Manage your personal credentials, contact phone, and review database roles.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-center"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {/* Profile Details Form Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm">
          {/* Avatar Snapshot Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md shadow-red-600/20 shrink-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">{user?.name}</h2>
                  {user?.role === 'admin' ? (
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
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>
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
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>{user?.name}</span>
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
                    <span className="truncate">{user?.email}</span>
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
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user?.phone ? user.phone : 'Not provided yet'}</span>
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
                    {user?.role === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="capitalize font-semibold">{user?.role}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {user?.role === 'admin' ? 'Full Kitchen Authority' : 'Standard Ordering Privileges'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save / Cancel Controls */}
            {isEditing && (
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                    });
                  }}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4" />
                    Cancel
                  </span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all"
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
      </div>
    </CustomerDashboardLayout>
  );
}
