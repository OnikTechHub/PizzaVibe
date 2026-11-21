'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User as UserIcon,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  ArrowRight,
  ExternalLink,
  Pizza,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CustomerDashboardLayoutProps {
  children: React.ReactNode;
}

interface CustomerNavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isExternal?: boolean;
}

export default function CustomerDashboardLayout({ children }: CustomerDashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on Escape or pathname change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clean, professional categorized navigation
  const navigationLinks: CustomerNavLink[] = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      label: 'My Orders',
      href: '/orders',
      icon: ShoppingBag,
      badge: 'Track',
    },
    {
      label: 'My Cart',
      href: '/cart',
      icon: ShoppingCart,
    },
    {
      label: 'Chef Menu',
      href: '/#menu',
      icon: Utensils,
    },
  ];

  const accountLinks: CustomerNavLink[] = [
    {
      label: 'Profile',
      href: '/profile',
      icon: UserIcon,
    },
    {
      label: 'View Storefront',
      href: '/',
      icon: Pizza,
      isExternal: true,
    },
  ];

  // Unauthenticated Guard
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Sign-In Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with your PizzaVibe account to access your customer dashboard, orders, and profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20 active:scale-95 text-center"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm transition-all text-center"
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
    <div className="relative min-h-screen bg-slate-50/60">
      {/* Desktop Full-Height Fixed Edge-to-Edge Customer Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/90 z-50 shadow-xs select-none">
        {/* Top Brand Identity Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Pizza className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">
                  Pizza<span className="text-red-600">Vibe</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-1.5 py-0.2 rounded-full shrink-0">
                  Customer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Artisan Sourdough Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Customer Delivery Status (FoodFlow Pattern) */}
        <div className="px-3 pt-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Live
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
              30m Delivery
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Section 1: CORE OPERATIONS */}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Core Operations
            </p>
            <div className="space-y-1">
              {navigationLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold border border-red-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-red-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-red-100 text-red-800 font-bold'
                            : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: ACCOUNT & SYSTEM */}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Account &amp; System
            </p>
            <div className="space-y-1">
              {accountLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold border border-red-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-red-600' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.isExternal && <ExternalLink className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />}
                  </Link>
                );
              })}

              {/* Admin Switch Link if user is admin */}
              {roleIsAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all mt-2"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Admin Panel</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Pinned FoodFlow Member Badge & Sign Out */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-white space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              ★ Gold Member
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded-full">
              240 Points
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area offset by Fixed Sidebar width (lg:pl-64) */}
      <div className="lg:pl-64 min-h-screen flex flex-col transition-all duration-200">
        {/* Mobile Header Bar (visible only on mobile/tablet) */}
        <div className="lg:hidden p-4 pb-0">
          <div className="flex items-center justify-between bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full">
                    Customer
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Customer Account</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              aria-label="Toggle Dashboard Menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Over Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />

            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-full">
                        Customer
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigationLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200/80 shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                            isActive ? 'bg-red-100 text-red-800 font-bold' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  <Pizza className="w-4 h-4 text-slate-400" />
                  <span>View Storefront</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Inner Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
