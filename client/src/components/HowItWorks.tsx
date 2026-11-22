'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, MapPin, UtensilsCrossed, Zap } from 'lucide-react';

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
      'Explore authentic stone-baked pizzas handcrafted with 48-hour fermented sourdough and fresh toppings.',
    icon: Search,
  },
  {
    step: 'STEP 02',
    title: 'Choose',
    description:
      'Pick your favorite pizzas, customize crust & toppings, and add everything to your cart in seconds.',
    icon: ShoppingBag,
  },
  {
    step: 'STEP 03',
    title: 'Track',
    description:
      'Place your order and follow it in real time — from stone oven baking to live rider doorstep delivery.',
    icon: MapPin,
  },
  {
    step: 'STEP 04',
    title: 'Enjoy',
    description:
      'Receive your fresh, piping-hot meal at your door in under 30 minutes. Sit back, relax, and savor every bite.',
    icon: UtensilsCrossed,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-20 bg-white border-t border-slate-100 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-600 shadow-xs mb-3.5">
            <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>How It Works</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Order in{' '}
            <span className="text-orange-500">
              4 Simple Steps
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Getting your favorite food has never been easier. From browsing to biting — it&apos;s just a few taps away.
          </p>
        </div>

        {/* 4 Steps Container with Delicate Dashed Connector */}
        <div className="relative">
          {/* Thin, crisp dashed connector line behind the circles */}
          <div className="hidden md:block absolute top-[30px] left-[12%] right-[12%] h-0 border-t-2 border-dashed border-orange-300 z-0 pointer-events-none" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
                >
                  {/* Icon Node with White Mask to keep dashed line clean */}
                  <div className="relative mb-3 flex items-center justify-center">
                    <div className="p-1.5 bg-white rounded-full">
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:bg-orange-600 transition-all duration-200">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Step Label */}
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500 mb-1">
                    {item.step}
                  </span>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[210px]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clean Pill CTA Button */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span>Start Ordering Now</span>
            <UtensilsCrossed className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
