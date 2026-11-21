'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Flame,
  Search,
  RefreshCw,
  Loader2,
  Phone,
  MapPin,
  Sparkles,
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
    total: number;
  };
  deliveryAddress: {
    fullName: string;
    street: string;
    city: string;
    phone: string;
  };
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchOrders = async () => {
    if (!token || user?.role !== 'admin') return;

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('[Admin Orders Fetch Error]:', err);
      toast.error('Unable to fetch live kitchen orders pipeline.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, user]);

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);

    try {
      const response = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update order status');
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
      );
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Status update failed';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
            <ShoppingBag className="w-3.5 h-3.5 text-red-600" />
            <span>Oven &amp; Dispatch Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Orders Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage incoming pizza orders, trigger stone oven baking, and assign rider handoffs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          disabled={refreshing}
          className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs self-start sm:self-center"
          title="Refresh Pipeline"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
        </button>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'placed', 'confirmed', 'baking', 'out_for_delivery', 'delivered'] as const).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-red-600 text-white font-bold border border-red-600 shadow-md shadow-red-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'
                }`}
              >
                {status === 'out_for_delivery' ? 'Out for Delivery' : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Loading orders pipeline...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-slate-500 text-sm">
            No orders found matching the selected filter.
          </p>
        ) : (
          <div className="space-y-3.5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-200 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
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

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{order.deliveryAddress.street}, {order.deliveryAddress.city}</strong>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{order.deliveryAddress.fullName} ({order.deliveryAddress.phone})</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                  <div className="text-left lg:text-right">
                    <p className="text-xs text-slate-500">Order Total</p>
                    <p className="text-lg sm:text-xl font-black text-slate-900">
                      ₹{order.pricing.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Stage Transition
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs disabled:opacity-50"
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="baking">Baking in Oven</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
