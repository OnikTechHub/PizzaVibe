import React from 'react';
import { Layers, Bike, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

interface FeatureItem {
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeColor: string;
  points: string[];
}

const features: FeatureItem[] = [
  {
    title: 'Fresh Artisan Hand-Tossed Crusts',
    badge: 'Artisan Dough',
    description:
      'We slow-ferment our sourdough for two full days to develop complex flavors, airy leopard-spotted bubbles, and effortless digestion with zero heaviness.',
    icon: Layers,
    accentColor: 'from-amber-500/10 to-orange-500/5 text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    points: [
      '48-hour cold sourdough fermentation',
      'Italian Tipo 00 milled grain flour',
      'Stone-baked in 800°F authentic ovens',
    ],
  },
  {
    title: '30-Minute Delivery Guarantee',
    badge: 'Express Fleet',
    description:
      'Stone-baked to order and immediately packed into heated thermal insulated bags. If our delivery rider is not at your door within 30 minutes, your next pizza is on us.',
    icon: Bike,
    accentColor: 'from-red-500/10 to-rose-500/5 text-red-700',
    badgeColor: 'bg-red-100 text-red-800',
    points: [
      'Dedicated temperature-controlled fleet',
      'Guaranteed crispy, hot crust on arrival',
      'Contactless doorstep drop option',
    ],
  },
  {
    title: 'Transparent Live Kitchen Tracking',
    badge: 'Live Telemetry',
    description:
      'Track every single milestone of your order in real-time: from dough stretching and topping placement to the oven fire and courier GPS transit.',
    icon: Activity,
    accentColor: 'from-emerald-500/10 to-teal-500/5 text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    points: [
      'Visual 5-stage progress indicator',
      'Direct courier contact & status updates',
      'Instant digital invoice and order receipt',
    ],
  },
];

export default function Features() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-100 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The PizzaVibe Difference</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Pinnacle of Artisan Craftsmanship
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineered from grain to doorstep for unforgettable flavor and blazing oven-to-door speed.
          </p>
        </div>

        {/* 3-Pillar Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
