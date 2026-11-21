'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Package,
  ArrowRight,
  User as UserIcon,
  Utensils,
  ExternalLink,
  Loader2,
  RefreshCw,
  Flame,
  Sparkles,
} from 'lucide-react';
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout';
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
    <CustomerDashboardLayout>
      <div className="space-y-4 sm:space-y-5">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Customer Portal Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}! 🍕
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Track your stone-baked artisan orders, delivery status, and account settings.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <Link
              href="/#menu"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Utensils className="w-4 h-4" />
              <span>Order Pizza</span>
            </Link>
          </div>
        </div>

        {/* 4 Quick Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* 1. Live Orders */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {activeOrders.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeOrders.length > 0 ? 'Piping hot and in baking' : 'No active orders in baking'}
            </p>
          </div>

          {/* 2. Total Orders */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
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
              Handcrafted sourdough meals
            </p>
          </div>

          {/* 3. Account Status */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Account Status
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900 capitalize">
              {user?.role}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
              <span>● Verified &amp; Active</span>
            </p>
          </div>

          {/* 4. Delivery Speed */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
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

        {/* Recent Orders Section */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Recent Orders &amp; Receipts
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Review your recent stone-baked pizza deliveries and track live baking stages.
              </p>
            </div>
            <Link
              href="/orders"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-14 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                No Orders Placed Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                You haven&apos;t ordered any stone-baked sourdough pizzas yet. Check out our chef specials to start your first order!
              </p>
              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md shadow-red-600/20 transition-all"
              >
                <span>Explore Artisan Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
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
                      <p className="text-xs text-slate-500">Total</p>
                      <p className="text-base sm:text-lg font-black text-slate-900">
                        ₹{order.pricing.total.toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/contact?subject=Inquiry+for+Order+${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 transition-all"
                    >
                      <span>Help</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
