import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Value Propositions / 3 Core Pillars */}
      <Features />
    </div>
  );
}
