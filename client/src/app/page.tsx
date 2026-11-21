import React from 'react';
import Hero from '@/components/Hero';
import PizzaShowcase from '@/components/PizzaShowcase';
import Features from '@/components/Features';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Dual Lottie Animation Showcase */}
      <PizzaShowcase />

      {/* 3. Value Propositions / 3 Core Pillars */}
      <Features />
    </div>
  );
}
