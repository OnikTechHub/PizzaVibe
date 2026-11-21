import React from 'react';
import Link from 'next/link';
import { Pizza, Clock, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-50 text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12 sm:mb-14">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-slate-900 group">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 group-hover:rotate-12 transition-transform duration-300">
                <Pizza className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Pizza<span className="text-red-600">Vibe</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Artisan stone-baked pizzas handcrafted with 48-hour fermented sourdough dough, imported Italian San Marzano tomatoes, and guaranteed 30-minute doorstep dispatch.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Kitchen open for online orders</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-red-600 transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#menu" className="text-slate-600 hover:text-red-600 transition-colors inline-block">
                  Chef Signature Menu
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-slate-600 hover:text-red-600 transition-colors inline-block">
                  About Our Kitchen
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-slate-600 hover:text-red-600 transition-colors inline-block">
                  Contact &amp; Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Operating Hours</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span>Mon &ndash; Thu:</span>
                <span className="text-slate-900 font-semibold">11:00 AM &ndash; 11:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span>Friday:</span>
                <span className="text-slate-900 font-semibold">11:00 AM &ndash; 1:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span>Saturday:</span>
                <span className="text-slate-900 font-semibold">10:30 AM &ndash; 1:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-slate-900 font-semibold">10:30 AM &ndash; 11:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact Details (Chattogram, Bangladesh) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <a href="tel:+8801800000000" className="hover:text-red-600 transition-colors font-medium">
                  +880 1800-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href="mailto:support@pizzavibe.com.bd" className="hover:text-red-600 transition-colors font-medium break-all">
                  support@pizzavibe.com.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>
            &copy; 2026 PizzaVibe Delivery Technologies Inc. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>by <strong className="text-slate-900 font-semibold">Onik Das</strong> for Oasis Infobyte Internship &bull; Level 3 Task 1</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
