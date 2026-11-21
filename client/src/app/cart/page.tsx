'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Utensils,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Flame,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout';

export default function CustomerCartPage() {
  return (
    <CustomerDashboardLayout>
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header Card (Clean White Bar matching Screenshot 3) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
              <ShoppingCart className="w-3.5 h-3.5 text-red-600" />
              <span>Checkout Staging</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Artisan Pizza Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review your customized stone-baked sourdough pizzas before dispatching to the stone oven.
            </p>
          </div>

          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-center"
          >
            <Utensils className="w-4 h-4" />
            <span>Add More Pizzas</span>
          </Link>
        </div>

        {/* Cart Main Content & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100 mb-6 flex items-center justify-between">
              <span>Your Selected Items</span>
              <span className="text-xs font-semibold text-slate-500">Order Stage</span>
            </h2>

            {/* Clean empty state / readiness banner */}
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Your Baking Cart is Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Add artisan stone-baked pizzas directly from our live menu or customize your toppings with slow-fermented 48-hour sourdough.
              </p>
              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Browse Artisan Pizzas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (5% GST)</span>
                <span className="font-semibold text-slate-900">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span>30-Min Rapid Delivery</span>
                <span className="font-semibold text-emerald-600">FREE over ₹600</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-xl font-black text-slate-900">₹0.00</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Pizzas enter our 800° stone hearth immediately upon checkout for rapid 30-minute delivery.
              </p>
            </div>

            <Link
              href="/#menu"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full font-semibold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Menu to Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Secure Checkout
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5 text-red-600" />
                30 Mins Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
