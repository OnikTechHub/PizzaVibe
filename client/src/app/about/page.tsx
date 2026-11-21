import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  Clock,
  ShieldCheck,
  Wheat,
  MapPin,
  Utensils,
  ArrowRight,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Our Kitchen & Craft | PizzaVibe',
  description:
    'Discover PizzaVibe: authentic 48-hour slow-fermented Neapolitan sourdough, stone hearth baking at 800°F, and guaranteed 30-minute delivery in Chattogram, Bangladesh.',
};

const pillars = [
  {
    icon: Wheat,
    badge: '48-Hour Fermentation',
    title: 'Slow-Cold Fermented Sourdough',
    description:
      'We never rush dough. Our proprietary sourdough starter is aged and cold-fermented for a minimum of 48 hours. This natural breakdown of starches creates a blistered, airy cornicione (crust) that is deeply flavorful and remarkably light on the stomach.',
  },
  {
    icon: Sparkles,
    badge: '100% Artisan Sourcing',
    title: 'Pure Italian & Local Farm Ingredients',
    description:
      'Every single pie begins with certified San Marzano style plum tomatoes hand-crushed with fresh basil, creamy fior di latte mozzarella, and cold-pressed extra virgin olive oil—paired with fresh local herbs selected daily from vetted regional growers.',
  },
  {
    icon: Flame,
    badge: '800°F Stone Hearth',
    title: 'Blistered Volcanic Stone Baking',
    description:
      'Our pizzas are hand-stretched and launched onto 800°F refractory volcanic stone decks. In just 90 to 120 seconds, the intense radiant heat locks in juices, melts the cheese to bubbly gold, and produces our signature charred leopard spots.',
  },
  {
    icon: Clock,
    badge: 'Guaranteed Speed',
    title: '30-Minute Oven-to-Door Dispatch',
    description:
      'Great pizza must be eaten piping hot. From our kitchen at GEC Circle, CDA Avenue, our precision kitchen workflow and thermal-lock delivery boxes guarantee rapid doorstep arrival across Chattogram within 30 minutes of leaving the stone hearth.',
  },
];

const standards = [
  'Zero artificial preservatives, dough conditioners, or bleached flours',
  'Authentic Neapolitan hand-stretch technique—never roller pins or presses',
  'Custom thermal insulated delivery boxes engineered to prevent sogginess',
  '100% open-kitchen hygiene with live digital tracking from prep to delivery',
  'Locally owned & freshly baked right here in Chattogram, Bangladesh',
];

export default function AboutPage() {
  return (
    <div className="w-full bg-white text-slate-900 min-h-screen">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200/80 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-4 py-1.5 mb-6 text-xs sm:text-sm font-semibold text-red-700 shadow-xs">
            <span role="img" aria-label="pizza">🍕</span>
            <span>The PizzaVibe Kitchen Story</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.1] mb-6">
            Baking Authenticity Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
              Every Single Slice.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Founded on the belief that pizza is culinary art, PizzaVibe bridges the gap between mass-produced fast food and time-honored Neapolitan craftsmanship right here in Chattogram.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Chef Menu</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full border border-slate-200 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Find Our Kitchen</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The 4 Pillars */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Our Culinary Code
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Why PizzaVibe Tastes Different
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              No shortcuts, no compromise. We combine old-world fermentation patience with modern heat engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-red-200 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5 group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 text-red-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200/60">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Authentic Kitchen Story */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Local Roots &bull; Global Standard
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                From GEC Circle to Your Dining Table
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                PizzaVibe was founded in Chattogram with a clear mission: pizza shouldn&apos;t be heavy, overly greasy, or mass-manufactured. It should celebrate airy fermentation, fragrant crushed tomatoes, rich milk fats, and the blistered char of an 800°F hearth.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Operating out of our central kitchen on CDA Avenue, our pizzaiolos toss fresh dough batches daily. We monitor proofing humidity, calibrate stone temperatures, and time our couriers down to the second so you get oven-hot artisan pizza whenever cravings hit.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>CDA Avenue, GEC Circle, Chattogram</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>+880 1828347761</span>
                </div>
              </div>
            </div>

            {/* Quality Checklist Card */}
            <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
              <div className="flex items-center gap-2.5 mb-6 text-slate-900">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold">The PizzaVibe Guarantee</h3>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                {standards.map((standard) => (
                  <li key={standard} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Action Banner */}
      <section className="py-14 sm:py-16 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
            Taste the Difference Tonight
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-xl mx-auto">
            Order your freshly baked pie or connect with our kitchen team for party catering and custom orders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#menu"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md shadow-red-600/20 hover:scale-[1.02]"
            >
              <span>Order Artisan Pizza</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all"
            >
              <span>Contact Kitchen</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
