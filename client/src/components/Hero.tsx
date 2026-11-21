import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import HeroAnimation from './HeroAnimation';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-10 pb-14 sm:pb-20 lg:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-8">
        {/* Left Column: Messaging & CTAs */}
        <div className="flex flex-col items-start text-left z-10">
          {/* Trendy Badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-6 text-xs sm:text-sm font-semibold text-red-700 shadow-xs">
            <span className="text-base" role="img" aria-label="pizza">
              🍕
            </span>
            <span>Hot &amp; Fresh Artisan Pizza Delivery</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.1] mb-5 sm:mb-6">
            Craft Your Slice, Track Every Bite{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
              in Real-Time.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
            Experience authentic stone-baked pizzas handcrafted with 48-hour slow-fermented sourdough and imported Italian ingredients.
            Enjoy piping-hot freshness backed by our guaranteed 30-minute rapid delivery right to your door.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
            {/* Primary Button */}
            <Link
              href="#about"
              className="group inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-full transition-all duration-200 shadow-md shadow-red-600/20 hover:shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore PizzaVibe</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full border border-slate-200 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Contact Kitchen</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-slate-200/80 w-full grid grid-cols-3 gap-2 sm:gap-4 text-left">
            <div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm sm:text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>4.9 / 5</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate sm:overflow-visible">
                2,500+ Reviews
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-red-600 font-bold text-sm sm:text-base">
                <Clock3 className="w-4 h-4 shrink-0" />
                <span>&lt; 30 Mins</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate sm:overflow-visible">
                Oven-to-Door Speed
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm sm:text-base">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Fresh</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate sm:overflow-visible">
                Artisan Ingredients
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Lottie Animation */}
        <div className="w-full flex items-center justify-center">
          <HeroAnimation />
        </div>
      </div>
    </section>
  );
}
