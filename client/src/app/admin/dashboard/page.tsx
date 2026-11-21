'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Flame,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Package,
  CheckCircle2,
  Layers,
  ArrowRight,
  Utensils,
  Sparkles,
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
}

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  pricing: { total: number };
  deliveryAddress: { fullName: string; street: string };
  createdAt: string;
}

export default function AdminDashboardOverviewPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchTelemetry = async () => {
    if (!token || user?.role !== 'admin') return;

    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
        if (Array.isArray(statsData.lowStockAlerts)) {
          setLowStockItems(statsData.lowStockAlerts);
        }
      }

      // 2. Fetch Recent Orders
      const ordersRes = await fetch(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch (err) {
      console.error('[Admin Telemetry Fetch Error]:', err);
      toast.error('Unable to fetch live kitchen telemetry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [user, token]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Kitchen Telemetry &amp; Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kitchen Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time monitoring of stone oven hearth performance, active delivery orders, and ingredient stock.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              fetchTelemetry();
            }}
            disabled={refreshing}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
          </button>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Total Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ₹{stats ? stats.totalRevenue.toLocaleString() : '0'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">From active &amp; completed orders</p>
        </div>

        {/* 2. Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {stats ? stats.totalOrders : '0'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lifetime customer orders</p>
        </div>

        {/* 3. Active in Oven */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active in Baking
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-700 animate-pulse" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {stats ? stats.activeOrders : '0'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Target dispatch &lt; 30 mins</p>
        </div>

        {/* 4. Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stock Alerts
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stats && stats.lowStockCount > 0
                  ? 'bg-rose-100 text-rose-700'
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
            {stats && stats.lowStockCount > 0 ? 'Ingredients below safety line' : 'All ingredients stocked'}
          </p>
        </div>
      </div>

      {/* 2-Column Split: Stock Alerts Preview & Quick Order Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* Left: Low Stock Ingredient Alerts */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ingredient Stock Alerts</h2>
              <p className="text-xs text-slate-500">Items below threshold that require restock</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Manage Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">Kitchen Fully Stocked</p>
              <p className="text-xs text-slate-500 mt-0.5">
                All 48-hr fermented bases, sauces, and artisanal toppings are within safe thresholds.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-rose-200/80 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-rose-600 font-semibold">
                      {item.stockQuantity} {item.unit} remaining (Safety Threshold: {item.threshold})
                    </p>
                  </div>
                  <Link
                    href="/admin/inventory"
                    className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Recent Orders Pipeline */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Kitchen Pipeline</h2>
              <p className="text-xs text-slate-500">Most recent customer orders</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>View All Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600 mb-2" />
              <p className="text-xs font-semibold">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-500">No recent orders in database.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[11px] font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-full">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {order.deliveryAddress.fullName} &bull; {order.deliveryAddress.street}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">₹{order.pricing.total}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
