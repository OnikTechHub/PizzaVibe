'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  Loader2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface InventoryItem {
  _id: string;
  name: string;
  category: 'base' | 'sauce' | 'cheese' | 'veggie' | 'meat';
  stockQuantity: number;
  unit: string;
  threshold: number;
  isAvailable: boolean;
}

export default function AdminInventoryPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const fetchInventory = async () => {
    if (!token || user?.role !== 'admin') return;

    try {
      const response = await fetch(`${apiUrl}/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('[Inventory Fetch Error]:', err);
      toast.error('Failed to load inventory stock.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token, user]);

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

      setItems((prev) =>
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

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = items.filter((i) => i.stockQuantity <= i.threshold).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Stock &amp; Ingredients Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kitchen Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time tracking of sourdough bases, San Marzano sauce, fresh mozzarella, and safety alert thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              fetchInventory();
            }}
            disabled={refreshing}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stock Overview Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ingredients</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{items.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all recipe categories</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Alerts</p>
          <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {lowStockCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Below safe operating threshold</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automated Safeguard</p>
          <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Active Protection
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Depleted items hide from ordering</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredient by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'base', 'sauce', 'cheese', 'veggie', 'meat'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs capitalize transition-all ${
                categoryFilter === cat
                  ? 'bg-red-600 text-white font-bold border border-red-600 shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Loading ingredient quantities...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-center py-12 text-slate-500 text-sm">
            No ingredients found matching your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="pb-3 px-3">Ingredient</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Current Stock</th>
                  <th className="pb-3 px-3">Safety Line</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isLow = item.stockQuantity <= item.threshold;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-3 capitalize">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${isLow ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                          {item.stockQuantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {item.threshold} {item.unit}
                      </td>
                      <td className="py-3 px-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Good
                          </span>
                        )}
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
                            className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-colors"
                            title="Restock +5"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item._id, item.stockQuantity, 20)}
                            disabled={updatingId === item._id}
                            className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-colors"
                            title="Bulk Restock +20"
                          >
                            +20
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
    </div>
  );
}
