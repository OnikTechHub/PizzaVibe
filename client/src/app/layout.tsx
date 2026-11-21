import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'PizzaVibe | Artisan Pizza Delivery & Kitchen',
  description:
    'Craft your slice, track every bite in real-time, and enjoy authentic artisan stone-baked pizza with PizzaVibe. Guaranteed 30-minute delivery. OIBSIP Level 3 Task 1 by Onik Das.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased selection:bg-red-500 selection:text-white">
        <Toaster position="bottom-right" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
