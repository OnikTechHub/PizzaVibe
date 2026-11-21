'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Flame,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Package,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  User as UserIcon,
  Search,
  Plus,
  Minus,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface AdminStats {
  totalOrders: number;
  activeOrders: number;
  lowStockCount: number;
  totalRevenue: number;
}

interface InventoryItem {
  _id: string;
  name: string;
  category: 'base' | 'sauce' | 'cheese' | 'veggie' | 'meat';
  stockQuantity: number;
  unit: string;
  threshold: number;
  isAvailable: boolean;
}

interface OrderItem {
  name: string;
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
    phone: string;
  };
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch all admin data
  const fetchAdminData = async () => {
    if (!token || user?.role !== 'admin') return;

    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Fetch Inventory
      const invRes = await fetch(`${apiUrl}/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const invData = await invRes.json();
      if (invData.success && Array.isArray(invData.items)) {
        setInventory(invData.items);
      }

      // 3. Fetch Orders
      const ordersRes = await fetch(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      }
    } catch (err) {
      console.error('[Admin Dashboard Fetch Error]:', err);
      toast.error('Unable to fetch live admin telemetry. Please check backend connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  // Quick stock quantity adjust
  const handleStockAdjust = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(id);

    try {
      const response = await fetch(`${apiUrl}/admin/inventory/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stockQuantity: newStock }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update stock');
      }

      setInventory((prev) =>
        prev.map((item) => (item._id === id ? { ...item, stockQuantity: newStock } : item))
      );
      toast.success(`Updated ${data.item.name} stock to ${newStock} ${data.item.unit}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Stock update failed';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick Order Status Changer
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
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order status update failed';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  // 1. Guard: If unauthenticated
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center shadow-lg shadow-slate-900/5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Administrator Sign-In Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Please log in with an administrator account to access the PizzaVibe kitchen control panel.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 px-5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-600/20"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    );
  }

  // 2. Guard: If user is logged in but role is NOT admin (Strict Role-Based Security)
  if (user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-md w-full bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center shadow-lg shadow-rose-900/5">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Access Denied (403)</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your account role is registered as <strong>{user.role}</strong>. You do not have permission to view the kitchen administration dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md"
          >
            <span>Return to Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Admin Snapshot */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-900">Admin Portal</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Kitchen Administration
              </h1>
              <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Database Role: Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor real-time kitchen orders, stone oven telemetry, and ingredient thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setRefreshing(true);
                fetchAdminData();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              <span>Customer View</span>
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 active:scale-95 transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span>Admin Profile</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Total Revenue */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{stats ? stats.totalRevenue.toLocaleString() : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">From completed &amp; active orders</p>
          </div>

          {/* 2. Total Orders */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats ? stats.totalOrders : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Lifetime customer orders</p>
          </div>

          {/* 3. Active in Oven / Kitchen */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active in Baking
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-700 animate-pulse" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats ? stats.activeOrders : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Pending dispatch (&lt; 30 mins)</p>
          </div>

          {/* 4. Low Stock Alerts */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Stock Alerts
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stats && stats.lowStockCount > 0
                    ? 'bg-rose-100 text-rose-700 animate-bounce'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats ? stats.lowStockCount : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats && stats.lowStockCount > 0 ? 'Ingredients below threshold' : 'All ingredients stocked'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview &amp; Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kitchen Inventory ({inventory.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview & Low Stock Alerts */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Low Stock Threshold Alerts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ingredients that require immediate restocking to prevent menu item deactivation.
                  </p>
                </div>
              </div>

              {inventory.filter((i) => i.stockQuantity <= i.threshold).length === 0 ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">Kitchen Fully Stocked</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No ingredient levels are currently below safety thresholds.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {inventory
                    .filter((i) => i.stockQuantity <= i.threshold)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="p-4 rounded-xl bg-white border border-rose-200 flex items-center justify-between shadow-xs"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs text-rose-600 font-semibold">
                            {item.stockQuantity} {item.unit} remaining (Threshold: {item.threshold})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStockAdjust(item._id, item.stockQuantity, 10)}
                          disabled={updatingId === item._id}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                        >
                          +10 Restock
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Operational Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800 mb-1">Stone Oven Timing</p>
                  <p>
                    Ensure pizzas transition from <code>confirmed</code> to <code>baking</code> within 5 minutes of order placement.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800 mb-1">Stock Threshold Logic</p>
                  <p>
                    When an ingredient reaches 0, any pizza dependent on that component is automatically hidden from customer carting.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800 mb-1">Database-Driven Roles</p>
                  <p>
                    All admin privileges are verified directly via the MongoDB <code>users</code> collection role attribute.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Live Orders Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update customer pizza delivery stages from stone oven to rider dispatch.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
                <p className="text-sm font-semibold">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center py-10 text-slate-500 text-sm">No orders found in database.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {order.deliveryAddress.fullName} &bull; {order.deliveryAddress.phone}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Address: {order.deliveryAddress.street}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Items: {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[11px] text-slate-500 text-left lg:text-right">Total: ₹{order.pricing.total}</p>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className="mt-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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
        )}

        {/* Tab 3: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Artisan Ingredients &amp; Stock
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust ingredient quantities and monitor safety levels.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
                <p className="text-sm font-semibold">Loading inventory...</p>
              </div>
            ) : inventory.length === 0 ? (
              <p className="text-center py-10 text-slate-500 text-sm">
                No inventory items found. Run database seed script to populate ingredients.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 px-3">Ingredient</th>
                      <th className="pb-3 px-3">Category</th>
                      <th className="pb-3 px-3">Current Stock</th>
                      <th className="pb-3 px-3">Threshold</th>
                      <th className="pb-3 px-3 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((item) => {
                      const isLow = item.stockQuantity <= item.threshold;
                      return (
                        <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3 px-3 capitalize text-slate-600">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-bold ${
                                isLow ? 'text-rose-600' : 'text-slate-900'
                              }`}
                            >
                              {item.stockQuantity} {item.unit}
                            </span>
                            {isLow && (
                              <span className="ml-2 text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                                Low
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {item.threshold} {item.unit}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStockAdjust(item._id, item.stockQuantity, -1)}
                                disabled={updatingId === item._id || item.stockQuantity <= 0}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40 transition-colors"
                                title="Decrease by 1"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStockAdjust(item._id, item.stockQuantity, 5)}
                                disabled={updatingId === item._id}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40 transition-colors"
                                title="Increase by 5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
