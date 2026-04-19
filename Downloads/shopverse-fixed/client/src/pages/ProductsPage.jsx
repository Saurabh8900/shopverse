import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../utils/api';
import { debounce } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', "Levi's", 'Dyson', "L'Oreal", 'Penguin'];
const ECO    = [{ value: 'green', label: '🌿 Eco Friendly' }, { value: 'fair', label: '⚡ Fair Impact' }, { value: 'high-impact', label: '🔴 High Impact' }];

function FilterSidebar({ filters, setFilters, onClose }) {
  const [pendingFilters, setPendingFilters] = useState(filters);
  useEffect(() => { setPendingFilters(filters); }, [filters]);

  const handleBrand = (brand) => {
    const arr = pendingFilters.brand ? pendingFilters.brand.split(',') : [];
    const idx = arr.indexOf(brand);
    if (idx > -1) arr.splice(idx, 1); else arr.push(brand);
    setPendingFilters(f => ({ ...f, brand: arr.join(','), page: 1 }));
  };

  const handleApply = () => setFilters(pendingFilters);

  return (
    <div className="space-y-6">
      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-white/80">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={pendingFilters.minPrice || ''}
            onChange={e => setPendingFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 input-dark text-sm rounded-xl"
          />
          <span className="text-white/30">—</span>
          <input
            type="number"
            placeholder="Max"
            value={pendingFilters.maxPrice || ''}
            onChange={e => setPendingFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))}
            className="w-full px-3 py-2 input-dark text-sm rounded-xl"
          />
        </div>
        {/* Quick ranges */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[['0–999', 0, 999], ['1K–5K', 1000, 5000], ['5K–20K', 5000, 20000], ['20K+', 20000, '']].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => setPendingFilters(f => ({ ...f, minPrice: min, maxPrice: max, page: 1 }))}
              className="px-2.5 py-1 text-xs rounded-lg glass hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              ₹{label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-white/80">Brand</h3>
        <div className="space-y-2">
          {BRANDS.map(brand => {
            const selected = pendingFilters.brand?.split(',').includes(brand);
            return (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => handleBrand(brand)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selected ? 'bg-brand-500 border-brand-500' : 'border-white/20 group-hover:border-brand-500/50'}`}
                >
                  {selected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-sm transition-colors ${selected ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-white/80">Min Rating</h3>
        <div className="flex gap-2">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => setPendingFilters(f => ({ ...f, rating: f.rating === r ? '' : r, page: 1 }))}
              className={`px-3 py-1.5 rounded-xl text-sm transition-all ${pendingFilters.rating === r ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'glass text-white/50 hover:text-white'}`}
            >
              {'★'.repeat(r)}+ 
            </button>
          ))}
        </div>
      </div>

      {/* Eco score */}
      <div>
        <h3 className="font-semibold text-sm mb-3 text-white/80">Eco Score</h3>
        <div className="space-y-1.5">
          {ECO.map(e => (
            <button
              key={e.value}
              onClick={() => setPendingFilters(f => ({ ...f, ecoScore: f.ecoScore === e.value ? '' : e.value, page: 1 }))}
              className={`w-full px-3 py-2 rounded-xl text-sm text-left transition-all ${pendingFilters.ecoScore === e.value ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'glass text-white/50 hover:text-white'}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flash sale */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setPendingFilters(f => ({ ...f, flashSale: f.flashSale ? '' : 'true', page: 1 }))}
          className={`w-11 h-6 rounded-full transition-all relative ${pendingFilters.flashSale ? 'bg-brand-500' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pendingFilters.flashSale ? 'left-6' : 'left-1'}`} />
        </div>
        <span className="text-sm text-white/70">Flash Sale Only</span>
      </label>

      {/* Clear */}
      <button
        onClick={() => setPendingFilters({ sort: 'newest', page: 1 })}
        className="w-full py-2 rounded-xl border border-white/10 text-sm text-white/40 hover:text-white hover:border-white/30 transition-all"
      >
        Clear All Filters
      </button>

      {/* Apply Filters Button */}
      <button
        onClick={handleApply}
        className="w-full py-2 rounded-xl bg-brand-500 text-white font-semibold mt-2 hover:bg-brand-600 transition-all"
      >
        Apply Filters
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    setFilters({
      sort: 'newest',
      page: 1,
      search:    searchParams.get('search')    || '',
      category:  searchParams.get('category')  || '',
      featured:  searchParams.get('featured')  || '',
      flashSale: searchParams.get('flashSale') || '',
      ecoScore:  searchParams.get('ecoScore')  || '',
    });
  }, [searchParams]);
  
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);
  const [view,     setView]     = useState('grid'); // grid | list
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters,  setFilters]  = useState({
    sort:      'newest',
    page:      1,
    search:    '',
    category:  '',
    featured:  '',
    flashSale: '',
    mood:      '',
  });

  const fetchProducts = useCallback(async (isUpdate = false) => {
    if (isUpdate) setUpdating(true); else setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined));
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) { console.error(e); }
    finally { isUpdate ? setUpdating(false) : setLoading(false); }
  }, [filters]);

  // Live update on filter change
  useEffect(() => { fetchProducts(true); }, [filters]);
  useEffect(() => { setLoading(true); fetchProducts(false); }, []);

  const skeletons = Array(8).fill(0);

  // Filter chip tags
  const filterChips = [];
  if (filters.brand) filters.brand.split(',').forEach(b => filterChips.push({ label: `Brand: ${b}`, key: 'brand', value: b }));
  if (filters.minPrice || filters.maxPrice) filterChips.push({ label: `Price: ₹${filters.minPrice || 0}–${filters.maxPrice || '∞'}`, key: 'price' });
  if (filters.rating) filterChips.push({ label: `Rating: ${filters.rating}★+`, key: 'rating' });
  if (filters.ecoScore) filterChips.push({ label: `Eco: ${ECO.find(e => e.value === filters.ecoScore)?.label || filters.ecoScore}`, key: 'ecoScore' });
  if (filters.flashSale) filterChips.push({ label: 'Flash Sale', key: 'flashSale' });
  if (filters.featured) filterChips.push({ label: 'Featured', key: 'featured' });
  if (filters.category) filterChips.push({ label: `Category: ${filters.category}`, key: 'category' });
  if (filters.mood) filterChips.push({ label: `Mood: ${filters.mood}`, key: 'mood' });

  const removeChip = chip => {
    setFilters(f => {
      const next = { ...f, page: 1 };
      if (chip.key === 'brand') {
        const arr = (f.brand || '').split(',').filter(b => b && b !== chip.value);
        next.brand = arr.join(',');
      } else if (chip.key === 'price') {
        next.minPrice = '';
        next.maxPrice = '';
      } else if (chip.key === 'rating') next.rating = '';
      else if (chip.key === 'ecoScore') next.ecoScore = '';
      else if (chip.key === 'flashSale') next.flashSale = '';
      else if (chip.key === 'featured') next.featured = '';
      else if (chip.key === 'category') next.category = '';
      else if (chip.key === 'mood') next.mood = '';
      return next;
    });
  };

  // Count active filters for badge
  const filterCount = filterChips.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      {/* Header */}
      <div className="border-b border-white/8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl">
              {filters.search ? `Results for "${filters.search}"` : filters.category || 'All Products'}
            </h1>
            {!loading && <p className="text-white/40 text-sm mt-1">{total.toLocaleString()} products</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm relative"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Filters
              {filterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold shadow">{filterCount}</span>
              )}
            </button>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
              className="input-dark px-4 py-2 rounded-xl text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-dark-700">{o.label}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex rounded-xl glass overflow-hidden">
              {[
                { v: 'grid', icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
                { v: 'list', icon: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></> },
              ].map(({ v, icon }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 transition-colors ${view === v ? 'bg-brand-500/30 text-brand-300' : 'text-white/40 hover:text-white'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">{icon}</svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-6">Filters</h2>
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => {}} />
          </div>
        </aside>

        {/* Mobile sidebar drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                className="fixed left-0 top-0 bottom-0 w-80 z-50 overflow-y-auto p-6 lg:hidden"
                style={{ background: 'rgba(13,0,24,0.97)', backdropFilter: 'blur(40px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 glass rounded-full flex items-center justify-center text-white/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Filter chips row */}
          {filterChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filterChips.map((chip, i) => (
                <span key={chip.label + i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold shadow border border-white/10">
                  {chip.label}
                  <button onClick={() => removeChip(chip)} className="ml-1 text-white/40 hover:text-white text-lg leading-none">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Results updating spinner */}
          {updating && (
            <div className="flex items-center gap-2 mb-4 animate-pulse text-brand-400 font-semibold">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-20"/><path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round"/></svg>
              Results updating…
            </div>
          )}

          {loading ? (
            <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
              {skeletons.map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-2/3 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="text-6xl animate-bounce">🛒</div>
              <h3 className="font-display font-bold text-2xl">No products found</h3>
              <p className="text-white/40">Try different filters or explore categories:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Electronics','Fashion','Home & Living','Sports','Beauty','Books'].map(cat => (
                  <button key={cat} onClick={() => setFilters(f => ({ ...f, category: cat, page: 1 }))} className="px-4 py-1.5 rounded-xl bg-brand-500/10 text-brand-400 font-semibold hover:bg-brand-500/20 transition-all text-xs">
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => setFilters({ sort: 'newest', page: 1 })} className="btn-glow px-6 py-2 rounded-xl text-white font-semibold relative z-10 mt-2 text-sm">
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                <AnimatePresence>
                  {products.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <ProductCard product={p} index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setFilters(f => ({ ...f, page: p }))}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${filters.page === p ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'glass text-white/50 hover:text-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
