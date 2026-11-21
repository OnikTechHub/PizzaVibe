'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Package,
  Flame,
  ExternalLink,
  Utensils,
  Loader2,
  RefreshCw,
  ArrowRight,
  Filter,
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

export default function CustomerOrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');

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
      console.error('[Orders Page Fetch Error]:', err);
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

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled';
    }
    if (filter === 'delivered') {
      return o.orderStatus === 'delivered';
    }
    return true;
  });

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
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 rounded-full px-3 py-1 mb-2 text-xs font-bold text-red-700 shadow-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
              <span>Order Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Orders &amp; Receipts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your real-time 30-minute stone oven dispatch and view detailed order invoices.
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
              className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-xs"
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-600'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'active'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-600'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active In-Baking ({orders.filter((o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'delivered'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-600'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Delivered ({orders.filter((o) => o.orderStatus === 'delivered').length})
          </button>
        </div>

        {/* Orders List Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Retrieving order history...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                No Orders in This View
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
                {filter === 'active'
                  ? 'You currently have no active orders in baking or delivery.'
                  : 'Start your artisan pizza experience by exploring our stone-baked sourdough menu!'}
              </p>
              <Link
                href="/#menu"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
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

                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}x
                          </span>
                          <span>{item.name}</span>
                          {item.size && <span className="text-slate-400 font-normal">({item.size})</span>}
                          {item.crust && <span className="text-slate-400 font-normal">&bull; {item.crust}</span>}
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                      <span>Delivery Address: <strong className="text-slate-700">{order.deliveryAddress.street}, {order.deliveryAddress.city}</strong></span>
                      <span>&bull;</span>
                      <span>Recipient: <strong className="text-slate-700">{order.deliveryAddress.fullName} ({order.deliveryAddress.phone})</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-slate-500">Grand Total</p>
                      <p className="text-lg sm:text-xl font-black text-slate-900">
                        ₹{order.pricing.total.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-slate-400 uppercase font-bold mt-0.5">
                        {order.payment.method} &bull; {order.payment.status}
                      </p>
                    </div>

                    <Link
                      href={`/contact?subject=Inquiry+regarding+Order+${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 transition-all shadow-xs"
                    >
                      <span>Kitchen Help</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
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
