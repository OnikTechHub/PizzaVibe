'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Utensils,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Pizza,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface PizzaItem {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  category: 'artisan-signature' | 'classic' | 'spicy-special' | 'vegan-delight' | string;
  isAvailable: boolean;
  fermentation: string;
  rating?: number;
}

export default function AdminMenuPage() {
  const { token } = useAuth();
  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Pizza Form state
  const [newPizza, setNewPizza] = useState({
    name: '',
    description: '',
    price: '',
    category: 'artisan-signature',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch real pizzas from MongoDB
  const fetchPizzas = useCallback(async () => {
    setLoading(true);
    try {
      // Try admin endpoint first if authenticated, else fallback to public endpoint
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let res = await fetch(`${apiUrl}/admin/pizzas`, { headers });
      if (!res.ok && res.status !== 401 && res.status !== 403) {
        // Fallback to public pizzas endpoint
        res = await fetch(`${apiUrl}/pizzas`);
      }

      const data = await res.json();
      if (res.ok && data.pizzas) {
        const mapped: PizzaItem[] = data.pizzas.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          price: p.basePrice || p.price || 0,
          category: p.category || 'artisan-signature',
          isAvailable: p.isAvailable !== false,
          fermentation: '48 Hr',
          rating: p.rating || 4.8,
        }));
        setPizzas(mapped);
      } else {
        setPizzas([]);
      }
    } catch (err: unknown) {
      console.error('[Fetch Pizzas Error]:', err);
      setPizzas([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchPizzas();
  }, [fetchPizzas]);

  // Toggle pizza availability in MongoDB
  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/admin/pizzas/${id}/availability`, {
        method: 'PATCH',
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update pizza status');
      }

      setPizzas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isAvailable: !currentStatus } : p))
      );
      toast.success(
        `Pizza status updated to ${!currentStatus ? 'Available on Storefront' : 'Marked as Sold Out'}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(msg);
    }
  };

  // Add new pizza to MongoDB
  const handleAddPizza = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPizza.name.trim()) {
      toast.error('Please enter a pizza recipe name.');
      return;
    }

    const numPrice = parseFloat(newPizza.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.error('Please enter a valid positive price.');
      return;
    }

    setSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/admin/pizzas`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newPizza.name.trim(),
          description:
            newPizza.description.trim() ||
            'Handcrafted 48-hour slow fermented artisan sourdough pizza.',
          price: numPrice,
          category: newPizza.category,
          isAvailable: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save pizza to database.');
      }

      toast.success(`${newPizza.name} added to artisan menu!`);
      setIsModalOpen(false);
      setNewPizza({ name: '', description: '', price: '', category: 'artisan-signature' });
      fetchPizzas();
    } catch (err: unknown) {
      console.error('[Add Pizza Error]:', err);
      const msg = err instanceof Error ? err.message : 'Failed to create pizza';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete pizza from MongoDB
  const handleDeletePizza = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      return;
    }

    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/admin/pizzas/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete pizza');
      }

      setPizzas((prev) => prev.filter((p) => p.id !== id));
      toast.success(`${name} deleted from menu`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete pizza';
      toast.error(msg);
    }
  };

  const filteredPizzas = pizzas.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || p.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/80 rounded-full px-2.5 py-0.5 mb-1.5 text-xs font-bold text-red-700 shadow-xs">
            <Utensils className="w-3.5 h-3.5 text-red-600" />
            <span>Database-Driven Menu Master</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Menu &amp; Pizzas Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Configure stone-baked pizza variations, live menu pricing, dough sizes, and stock availability directly from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={fetchPizzas}
            disabled={loading}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pizza</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizza by name or topping ingredients..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'artisan-signature', label: 'Signature' },
            { id: 'classic', label: 'Classic' },
            { id: 'spicy-special', label: 'Spicy' },
            { id: 'vegan-delight', label: 'Vegan / Veg' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                category === cat.id
                  ? 'bg-red-600 text-white font-bold border border-red-600 shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area: Loading, Empty State, or Grid */}
      {loading ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-16 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading Artisan Pizzas from MongoDB...</p>
        </div>
      ) : pizzas.length === 0 ? (
        /* Empty State: Zero Pizzas in Database */
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 sm:p-16 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Pizza className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Artisan Pizzas in Menu Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            The pizza menu is currently empty. Click the button below to add your first stone-baked sourdough recipe to populate MongoDB and publish it live on the storefront.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md shadow-red-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Pizza Recipe</span>
          </button>
        </div>
      ) : filteredPizzas.length === 0 ? (
        /* Search Empty State */
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No Matching Pizzas Found</h3>
          <p className="text-xs text-slate-500 mb-4">
            No recipes matched &quot;{search}&quot;. Try adjusting your keywords or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Pizzas Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {pizza.category.replace('-', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      pizza.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {pizza.isAvailable ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : (
                      <XCircle className="w-2.5 h-2.5" />
                    )}
                    {pizza.isAvailable ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">{pizza.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {pizza.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Dough / Price</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-slate-900">₹{pizza.price}</span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {pizza.fermentation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(pizza.id, pizza.isAvailable)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      pizza.isAvailable
                        ? 'border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 bg-white'
                        : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {pizza.isAvailable ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePizza(pizza.id, pizza.name)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Pizza"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pizza Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => !submitting && setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Artisan Pizza</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter recipe information to persist a new pizza into MongoDB and publish it to the live store.
            </p>

            <form onSubmit={handleAddPizza} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Pizza Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gorgonzola &amp; Fig Glaze"
                  value={newPizza.name}
                  onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
                  disabled={submitting}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Toppings &amp; Description
                </label>
                <textarea
                  rows={2}
                  placeholder="San Marzano sauce, fresh mozzarella, dried figs..."
                  value={newPizza.description}
                  onChange={(e) => setNewPizza({ ...newPizza, description: e.target.value })}
                  disabled={submitting}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="549"
                    value={newPizza.price}
                    onChange={(e) => setNewPizza({ ...newPizza, price: e.target.value })}
                    disabled={submitting}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={newPizza.category}
                    onChange={(e) => setNewPizza({ ...newPizza, category: e.target.value })}
                    disabled={submitting}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <option value="artisan-signature">Signature</option>
                    <option value="classic">Classic</option>
                    <option value="spicy-special">Spicy Special</option>
                    <option value="vegan-delight">Vegan Delight</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save to MongoDB</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
