'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Utensils,
  Layers,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle,
  Lock,
  ExternalLink,
  User as UserIcon,
  LogOut,
  Menu as MenuIcon,
  X,
  ArrowRight,
  Pizza,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isExternal?: boolean;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Professional categorized navigation sections
  const operationsLinks: AdminNavLink[] = [
    {
      label: 'Overview',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      label: 'Orders Pipeline',
      href: '/admin/orders',
      icon: ShoppingBag,
      badge: 'Oven',
    },
  ];

  const catalogLinks: AdminNavLink[] = [
    {
      label: 'Menu & Pizzas',
      href: '/admin/menu',
      icon: Utensils,
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      icon: Layers,
    },
  ];

  const accountLinks: AdminNavLink[] = [
    {
      label: 'Admin Profile',
      href: '/profile',
      icon: UserIcon,
    },
    {
      label: 'Customer View',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'View Storefront',
      href: '/',
      icon: Pizza,
      isExternal: true,
    },
  ];

  // 1. Unauthenticated Guard
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Administrator Sign-In Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with an administrator account to access the PizzaVibe kitchen control panel.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  // 2. Strict Role-Based Security Guard: Must have user.role === 'admin'
  if (user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center shadow-lg shadow-rose-900/5">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Access Denied (403)</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your database role is registered as <strong>{user.role}</strong>. You do not have permission to access the kitchen administration portal.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            <span>Return to Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/60">
      {/* Desktop Full-Height Fixed Edge-to-Edge Admin Sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/90 z-30 shadow-xs select-none">
        {/* Top Clean User Profile Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200/90 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-sm tracking-tight text-slate-900 truncate">
                {user.name}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200/60 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5" />
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Kitchen Administration
            </p>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Section 1: OPERATIONS */}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Operations
            </p>
            <div className="space-y-1">
              {operationsLinks.map((item) => {
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

          {/* Section 2: CATALOG */}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Catalog
            </p>
            <div className="space-y-1">
              {catalogLinks.map((item) => {
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
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: ACCOUNT */}
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Account
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
                    {item.isExternal && <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Clean Sign Out Action */}
        <div className="p-3 border-t border-slate-100 shrink-0 bg-white">
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200/60 px-1.5 py-0.2 rounded-full">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Kitchen Administration</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              aria-label="Toggle Admin Sidebar"
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200/60 px-1.5 py-0.2 rounded-full">
                        Admin
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

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                      Operations
                    </p>
                    <nav className="space-y-1">
                      {[...operationsLinks, ...catalogLinks].map((item) => {
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
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
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
