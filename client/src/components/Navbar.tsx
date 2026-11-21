'use client';

import React, { useState, useEffect } from 'react';
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
  Menu as MenuIcon,
  X,
  ArrowRight,
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartDrawerOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
