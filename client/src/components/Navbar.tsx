'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Pizza,
  Home,
  Utensils,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  LogIn,
  UserPlus,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Menu', href: '/#menu', icon: Utensils },
  { label: 'About', href: '/about', icon: Sparkles },
  { label: 'Contact', href: '/contact', icon: MessageSquare },
];

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on escape key and outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setCartDrawerOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when drawer or mobile menu is open
  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartDrawerOpen]);

  const handleCartTrigger = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setCartDrawerOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-4 w-full">
        <nav className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-md shadow-stone-900/5 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-stone-900 group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 group-hover:rotate-12 transition-transform duration-300">
                <Pizza className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight">
                Pizza<span className="text-red-600">Vibe</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium text-stone-600 hover:text-red-600 hover:bg-red-50/70 transition-colors duration-150"
                  >
                    <Icon className="w-4 h-4 opacity-75" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Area: Cart Icon Button + Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {/* Shopping Bag / Cart Icon Button with Badge */}
              <button
                type="button"
                onClick={handleCartTrigger}
                className="relative p-2 rounded-full text-stone-700 hover:text-red-600 hover:bg-red-50/80 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label={`Shopping Cart (${cartCount} items)`}
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white transition-transform scale-100">
                  {cartCount}
                </span>
              </button>

              <div className="h-5 w-px bg-stone-200 mx-1" aria-hidden="true" />

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  {/* User Profile Badge Trigger with Dropdown Arrow */}
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-800 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    title="User account menu"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200/60 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu (Exactly 3 Options: Profile, Dashboard, Logout) */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User Snapshot Header */}
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                          </span>
                        </div>
                      </div>

                      {/* 1. Profile Option */}
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/70 transition-colors rounded-xl mx-1"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>Profile</span>
                      </Link>

                      {/* 2. Dashboard Option (Role-Based Destination) */}
                      <Link
                        href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/70 transition-colors rounded-xl mx-1"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Dashboard</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {user.role === 'admin' ? 'Admin' : 'Overview'}
                        </span>
                      </Link>

                      {/* Divider */}
                      <div className="h-px bg-slate-100 my-1 mx-2" />

                      {/* 3. Logout Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-1 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-stone-50 transition-colors duration-150"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>

                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 lg:px-5 py-2 rounded-full transition-all duration-200 shadow-md shadow-red-600/20 hover:shadow-red-600/30 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Header Actions (Cart Trigger + Menu Toggle) */}
            <div className="md:hidden flex items-center gap-1.5">
              {/* Mobile Direct Cart Trigger */}
              <button
                type="button"
                onClick={handleCartTrigger}
                className="relative p-2 rounded-full text-stone-700 hover:text-red-600 hover:bg-stone-100 transition-colors focus:outline-none"
                aria-label={`Shopping Cart (${cartCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                  {cartCount}
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-stone-200/80 mt-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-red-600" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Menu Cart Link */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCartTrigger();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                  <span>Shopping Cart</span>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  {cartCount} items
                </span>
              </button>

              <div className="pt-2 mt-1 border-t border-stone-100 flex flex-col gap-2">
                {user ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </div>

                    {/* 1. Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </Link>

                    {/* 2. Dashboard Link */}
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Dashboard</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {user.role === 'admin' ? 'Admin Portal' : 'Overview'}
                      </span>
                    </Link>

                    {/* 3. Logout Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-stone-700 hover:text-red-600"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login to Account</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-full shadow-md shadow-red-600/20 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create an Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Slide-out Cart Drawer (Drawer-Trigger Ready) */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            onClick={() => setCartDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 border-l border-stone-200">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Your Order Cart</h2>
                    <p className="text-xs text-stone-500">
                      {cartCount === 0 ? 'No items selected' : `${cartCount} item${cartCount > 1 ? 's' : ''} in cart`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors focus:outline-none"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
                {cartCount === 0 ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                      Your Cart is Empty
                    </h3>
                    <p className="text-sm text-stone-600 max-w-xs mb-8 leading-relaxed">
                      Looks like you haven&apos;t added any pizzas yet. Check out our chef specials to start your order!
                    </p>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                      <Link
                        href="#menu"
                        onClick={() => setCartDrawerOpen(false)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 px-5 rounded-full transition-all shadow-md shadow-red-600/20"
                      >
                        <Utensils className="w-4 h-4" />
                        <span>Explore Menu</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-stone-600">Cart items ready for processing.</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-stone-200 bg-stone-50/40">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-stone-500">Estimated Dispatch Time</span>
                  <span className="font-semibold text-stone-800">&le; 30 Mins</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-stone-900 mb-4">
                  <span>Subtotal</span>
                  <span>₹0.00</span>
                </div>
                <button
                  type="button"
                  disabled={cartCount === 0}
                  className="w-full py-3.5 px-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 text-white shadow-md shadow-red-600/20 disabled:shadow-none transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
