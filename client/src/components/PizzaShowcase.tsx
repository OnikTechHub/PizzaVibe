'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Flame, Sparkles, Activity, ArrowRight, ShieldCheck, Clock3, Pizza } from 'lucide-react';
import pizzaProcessAnimation from '../../public/animations/pizza-process.json';
import artisanPizzaAnimation from '../../public/animations/artisan-pizza.json';

// Dynamically import Lottie from lottie-react to prevent SSR canvas/window hydration issues
const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.Lottie), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full aspect-[16/10] bg-transparent flex items-center justify-center">
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        Loading Animation...
      </span>
    </div>
  ),
});

export default function PizzaShowcase() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/70 border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 border border-red-200/80 text-red-700 mb-3 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span>Live Artisan Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Crafted with Passion,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
              Tracked Live.
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Witness the synchronized rhythm of our artisan kitchen: from slow-fermented hand-cut slices to stone-oven dispatch telemetry.
          </p>
        </div>

        {/* Dual Side-by-Side Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Live Kitchen & Order Flow */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      Live Kitchen &amp; Order Flow
                    </h3>
                    <p className="text-xs text-slate-500">Real-time baking telemetry</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Flow
                </span>
              </div>

              {/* Animation Viewport */}
              <div className="relative w-full aspect-[16/10] rounded-2xl flex items-center justify-center bg-transparent my-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-transparent mix-blend-multiply">
                  <Lottie
                    src={pizzaProcessAnimation}
                    autoplay={true}
                    loop={true}
                    className="w-full h-full object-contain bg-transparent"
                  />
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-[11px] font-semibold text-slate-700">&lt; 30 Mins Fast-Track</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Every customer order is tracked from sourdough stretching and ingredient topping to our 800°F stone hearth baking and contactless rider delivery.
              </p>
            </div>

            {/* Badges and CTA */}
            <div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mb-6 text-center">
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Ferment</p>
                  <p className="text-xs font-bold text-slate-800">48-Hr Slow</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Oven Hearth</p>
                  <p className="text-xs font-bold text-slate-800">800° Stone</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Telemetry</p>
                  <p className="text-xs font-bold text-slate-800">Live GPS</p>
                </div>
              </div>

              <Link
                href="/menu"
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-red-600/20 hover:shadow-md"
              >
                <span>Order from Live Kitchen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Artisan Full Pizza */}
          <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                    <Pizza className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      Artisan Full Pizza
                    </h3>
                    <p className="text-xs text-slate-500">Handcrafted stone-baked slice</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Artisan Cut
                </span>
              </div>

              {/* Animation Viewport */}
              <div className="relative w-full aspect-[16/10] rounded-2xl flex items-center justify-center bg-transparent my-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-transparent">
                  <Lottie
                    src={artisanPizzaAnimation}
                    autoplay={true}
                    loop={true}
                    className="w-full h-full object-contain bg-transparent scale-90"
                  />
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-slate-700">100% Neapolitan Sourdough</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Handcrafted with Italian Tipo 00 flour, fragrant wild basil, San Marzano plum tomatoes, and velvety melted buffalo mozzarella for an authentic Italian slice.
              </p>
            </div>

            {/* Badges and CTA */}
            <div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 mb-6 text-center">
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Flour</p>
                  <p className="text-xs font-bold text-slate-800">Tipo 00 Milled</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Sauce</p>
                  <p className="text-xs font-bold text-slate-800">San Marzano</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Cheese</p>
                  <p className="text-xs font-bold text-slate-800">Mozzarella</p>
                </div>
              </div>

              <Link
                href="/menu"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>Customize Artisan Pizzas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
