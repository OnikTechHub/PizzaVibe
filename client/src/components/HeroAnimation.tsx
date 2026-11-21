'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Flame, Sparkles } from 'lucide-react';
import pizzaProcessAnimation from '../../public/animations/pizza-process.json';
import artisanPizzaAnimation from '../../public/animations/artisan-pizza.json';

// Dynamically import Lottie from lottie-react to prevent SSR canvas/window hydration errors
const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.Lottie), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full aspect-[4/3] bg-transparent flex items-center justify-center">
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        Loading Pizza Animation...
      </span>
    </div>
  ),
});

export default function HeroAnimation() {
  // Website enters with artisan pizza animation first, as requested
  const [activeAnim, setActiveAnim] = useState<'pizza' | 'process'>('pizza');
  const [cycleKey, setCycleKey] = useState<number>(0);
  const transitionFiredRef = useRef<boolean>(false);

  // Transition from Pizza -> Process
  const handlePizzaComplete = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setActiveAnim('process');
  }, []);

  // Transition from Process -> Pizza (increment cycleKey to ensure fresh playback from frame 0)
  const handleProcessComplete = useCallback(() => {
    if (transitionFiredRef.current) return;
    transitionFiredRef.current = true;
    setCycleKey((prev) => prev + 1);
    setActiveAnim('pizza');
  }, []);

  // Safety fallback timers in case subscriptions.complete is delayed by tab backgrounding or frame drops
  useEffect(() => {
    transitionFiredRef.current = false;

    // artisan-pizza: 360 frames / 60 fps = 6000ms
    // pizza-process: 961 frames / 60 fps = 16016ms
    const safetyDuration = activeAnim === 'pizza' ? 6200 : 16300;

    const timer = setTimeout(() => {
      if (activeAnim === 'pizza') {
        handlePizzaComplete();
      } else {
        handleProcessComplete();
      }
    }, safetyDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [activeAnim, cycleKey, handlePizzaComplete, handleProcessComplete]);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-[420px] xs:max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] mx-auto flex items-center justify-center select-none bg-transparent">
      {/* Dynamic Sequential Animation Viewport - Starts with Pizza, then Kitchen Process, then loops back */}
      {activeAnim === 'pizza' ? (
        <div
          key={`anim-pizza-${cycleKey}`}
          className="w-full h-full flex items-center justify-center relative z-10 bg-transparent transition-opacity duration-500 ease-in-out"
        >
          <Lottie
            src={artisanPizzaAnimation}
            autoplay={true}
            loop={false}
            subscriptions={{
              complete: handlePizzaComplete,
            }}
            className="w-full h-full object-contain bg-transparent scale-90"
          />
        </div>
      ) : (
        <div
          key={`anim-process-${cycleKey}`}
          className="w-full h-full flex items-center justify-center relative z-10 bg-transparent mix-blend-multiply transition-opacity duration-500 ease-in-out"
        >
          <Lottie
            src={pizzaProcessAnimation}
            autoplay={true}
            loop={false}
            subscriptions={{
              complete: handleProcessComplete,
            }}
            className="w-full h-full object-contain bg-transparent"
          />
        </div>
      )}

      {/* Floating Top-Left Badge (Adapts context based on current playing animation) */}
      <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-md flex items-center gap-1.5 sm:gap-2 scale-90 sm:scale-100 origin-top-left transition-all duration-300">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
        </div>
        <div>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {activeAnim === 'pizza' ? 'Tipo 00 Crust' : 'Artisan Kitchen'}
          </p>
          <p className="text-[11px] sm:text-xs font-bold text-slate-900">
            {activeAnim === 'pizza' ? 'Stone-Baked Slice' : '48-Hr Fermented'}
          </p>
        </div>
      </div>

      {/* Floating Bottom-Right Badge (Adapts context based on current playing animation) */}
      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-md flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100 origin-bottom-right transition-all duration-300">
        <div className="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-emerald-500" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-600" />
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {activeAnim === 'pizza' ? 'San Marzano Sauce' : 'Stone Oven 800°F'}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-900">
            {activeAnim === 'pizza' ? 'Fresh Buffalo Mozzarella' : 'Dispatch in < 30 Mins'}
          </p>
        </div>
      </div>
    </div>
  );
}
