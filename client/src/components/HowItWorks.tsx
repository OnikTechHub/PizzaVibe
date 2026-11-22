'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Sliders, MapPin, UtensilsCrossed, ArrowRight, Zap } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    step: 'STEP 01',
    title: 'Browse',
    description:
      'Explore authentic stone-baked pizzas handcrafted with 48-hour fermented sourdough and imported Italian toppings.',
    icon: Search,
  },
  {
    step: 'STEP 02',
    title: 'Customize',
    description:
      'Pick your favorite crust size, select San Marzano tomato sauce, fresh buffalo mozzarella, and tailor your toppings in seconds.',
    icon: Sliders,
  },
  {
    step: 'STEP 03',
    title: 'Track',
    description:
      'Watch real-time stone-oven baking telemetry from our 800°F hearth all the way to live rider doorstep delivery.',
    icon: MapPin,
  },
  {
    step: 'STEP 04',
    title: 'Enjoy',
    description:
      'Receive your piping-hot, crispy pizza guaranteed in under 30 minutes. Sit back, unbox freshness, and savor every bite.',
    icon: UtensilsCrossed,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-orange-50/25 to-white overflow-hidden border-t border-slate-100">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-orange-200/20 via-red-200/20 to-amber-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200/80 text-orange-700 shadow-xs mb-4">
            <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>How It Works</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Order in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
              4 Simple Steps
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Getting your favorite artisan pizza has never been easier. From browsing our sourdough menu to your first piping-hot bite — it&apos;s just a few taps away.
          </p>
        </div>

        {/* 4 Steps Container */}
        <div className="relative">
          {/* Animated Connecting Dashed Line (Visible on md+ screens) */}
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px] -translate-y-1/2 pointer-events-none z-0">
            <svg
              className="w-full h-4 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 2"
            >
              <line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                stroke="#fb923c"
                strokeWidth="2"
                strokeDasharray="3 3"
                className="animate-flow-dash"
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group flex flex-col items-center text-center p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Step Icon Node */}
                  <div className="relative mb-6">
                    {/* Pulsing ring on hover */}
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300" />
                    
                    {/* Circle Container */}
                    <div className="relative w-14 h-14 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white shadow-inner">
                        <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Step indicator dot on line */}
                    <div className="hidden md:block absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-400 border-2 border-white shadow-xs" />
                  </div>

                  {/* Step Label */}
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 mb-1.5">
                    {item.step}
                  </span>

                  {/* Step Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-red-600 transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-orange-600 hover:from-red-700 hover:via-orange-600 hover:to-orange-700 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 shadow-md shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 hover:scale-105 active:scale-95"
          >
            <span>Start Ordering Now</span>
            <UtensilsCrossed className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
          </Link>
        </div>
      </div>
    </section>
  );
}
