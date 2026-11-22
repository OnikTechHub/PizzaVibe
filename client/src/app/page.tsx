import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Order in 4 Simple Steps */}
      <HowItWorks />

      {/* 3. Value Propositions / 3 Core Pillars */}
      <Features />
    </div>
  );
}
