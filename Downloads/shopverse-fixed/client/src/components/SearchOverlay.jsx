import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchOpen } from '../redux/slices/uiSlice';
import { productAPI } from '../utils/api';
import { debounce, formatPrice } from '../utils/helpers';

export default function SearchOverlay() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const isOpen    = useSelector(s => s.ui.searchOpen);
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); setQuery(''); setResults([]); }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') dispatch(setSearchOpen(false)); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [dispatch]);

  const search = debounce(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      // Use getAll with search param instead of search endpoint
      const { data } = await productAPI.getAll({ search: q, limit: 10 });
      setResults(data.products || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, 350);

  const handleChange = (e) => { setQuery(e.target.value); search(e.target.value); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/products?search=${encodeURIComponent(query)}`); dispatch(setSearchOpen(false)); }
  };

  const handleSelect = (id) => { navigate(`/products/${id}`); dispatch(setSearchOpen(false)); };

  const suggestions = ['Sony headphones', 'Nike shoes', 'iPhone 15', 'Yoga mat', 'Instant Pot'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          style={{ background: 'rgba(7,0,16,0.85)', backdropFilter: 'blur(20px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) dispatch(setSearchOpen(false)); }}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="w-full max-w-2xl"
          >
            {/* Search input */}
            <form onSubmit={handleSubmit} className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Search products, brands, categories…"
                className="w-full pl-12 pr-4 py-4 text-lg input-dark rounded-2xl font-body"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              )}
            </form>

            {/* Results */}
            <div className="mt-3 glass rounded-2xl overflow-hidden">
              {results.length > 0 ? (
                <>
                  <p className="px-4 pt-3 pb-1 text-xs text-white/30 uppercase tracking-wider">Products</p>
                  {results.map((p, i) => (
                    <motion.button
                      key={p._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelect(p._id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <img
                        src={p.images?.[0]?.url || 'https://via.placeholder.com/40'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-white/40">{p.brand}</p>
                      </div>
                      <span className="text-brand-400 text-sm font-semibold shrink-0">{formatPrice(p.discountPrice || p.price)}</span>
                    </motion.button>
                  ))}
                  <button onClick={handleSubmit} className="w-full py-3 text-sm text-accent-cyan hover:text-white transition-colors border-t border-white/8">
                    See all results for "{query}"
                  </button>
                </>
              ) : query && !loading ? (
                <p className="px-4 py-6 text-center text-white/40 text-sm">No results for "{query}"</p>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); search(s); }}
                        className="px-3 py-1.5 rounded-full glass text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
