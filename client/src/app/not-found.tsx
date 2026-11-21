import React from 'react';
import Link from 'next/link';
import { Pizza, Home, Utensils } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-stone-50">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center mb-6 shadow-sm">
          <Pizza className="w-10 h-10 text-amber-600 rotate-12" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-100 text-red-800">
          404 &bull; Slice Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-4 mb-2 tracking-tight">
          Lost in the Kitchen?
        </h1>
        <p className="text-sm text-stone-600 mb-8 leading-relaxed">
          The page you are looking for seems to have been eaten or moved to a different oven. Let&apos;s get you back to the main counter.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-semibold text-sm transition-all shadow-xs"
          >
            <Utensils className="w-4 h-4 text-stone-500" />
            <span>Explore PizzaVibe</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
