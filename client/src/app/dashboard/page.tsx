'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Package,
  ArrowRight,
  User as UserIcon,
  Phone,
  Mail,
  Utensils,
  ExternalLink,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Flame,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  name: string;
  size?: string;
  crust?: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: 'placed' | 'confirmed' | 'baking' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
  };
  deliveryAddress: {
    fullName: string;
    street: string;
    city: string;
    phone: string;
  };
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch customer orders
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/orders?userId=${user.id}&email=${encodeURIComponent(user.email)}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('[Dashboard Orders Fetch Error]:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Unauthenticated fallback
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Customer Dashboard</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with your PizzaVibe account to view your live orders, order history, and account settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-sm transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  );

  // Status badge styling helper
  const renderStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock3 className="w-3 h-3" />
            Order Placed
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'baking':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3 h-3 animate-pulse" />
            Baking in Stone Oven
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Package className="w-3 h-3" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Admin Switch Banner (if logged in as admin) */}
        {user.role === 'admin' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-amber-900">
                  You are currently logged in as an Administrator
                </p>
                <p className="text-xs text-amber-700">
                  Viewing customer overview. Switch to the Admin Portal to manage inventory &amp; orders.
                </p>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-900">Customer Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user.name.split(' ')[0]}! 🍕
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your real-time oven dispatch, order history, and account settings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              <UserIcon className="w-4 h-4 text-slate-500" />
              <span>Edit Profile</span>
            </Link>

            <Link
              href="/#menu"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 active:scale-95 transition-all"
            >
              <Utensils className="w-4 h-4" />
              <span>Order Pizza</span>
            </Link>
          </div>
        </div>

        {/* 4 Quick Stat / Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* 1. Active Orders */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Clock3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeOrders.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeOrders.length > 0 ? 'Piping hot and on the way' : 'No active orders in baking'}
            </p>
          </div>

          {/* 2. Total Orders Placed */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {orders.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Handcrafted artisan sourdough
            </p>
          </div>

          {/* 3. Account Status */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Account Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 capitalize">
              {user.role}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <span>● Verified &amp; Active</span>
            </p>
          </div>

          {/* 4. Delivery Guarantee */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Speed Guarantee
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              &lt; 30 Mins
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Stone oven 800° rapid dispatch
            </p>
          </div>
        </div>

        {/* Orders Overview Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Recent Orders &amp; Receipts
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Review your recent artisan pizza orders and live delivery status.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {orders.length} Total
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                No Orders Placed Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                You haven&apos;t ordered any stone-baked pizzas yet. Explore our handcrafted sourdough menu and place your first order!
              </p>
              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md shadow-red-600/20 transition-all"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-200 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                        #{order.orderNumber}
                      </span>
                      {renderStatusBadge(order.orderStatus)}
                      <span className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="text-xs sm:text-sm text-slate-700">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="font-medium">
                          {item.quantity}x {item.name}
                          {idx < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Delivery to: <strong>{order.deliveryAddress.street}, {order.deliveryAddress.city}</strong></span>
                      <span>&bull;</span>
                      <span>Payment: <strong className="uppercase">{order.payment.method}</strong> ({order.payment.status})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-slate-500">Total Amount</p>
                      <p className="text-base sm:text-lg font-black text-slate-900">
                        ₹{order.pricing.total.toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/contact?subject=Inquiry+for+Order+${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 transition-all"
                    >
                      <span>Need Help</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
