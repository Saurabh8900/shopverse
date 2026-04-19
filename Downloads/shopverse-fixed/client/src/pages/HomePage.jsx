import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setActiveMood } from '../redux/slices/uiSlice';
import ProductCard   from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import { productAPI, categoryAPI } from '../utils/api';
import { formatPrice, moodConfig } from '../utils/helpers';

// ─── Animated gradient mesh bg ─────────────────────────
const MeshBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-20"
      style={{ background: 'radial-gradient(circle, #ff1a7f 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
    <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
      style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', filter: 'blur(50px)', animation: 'float 12s ease-in-out infinite' }} />
  </div>
);

// ─── Flash sale ─────────────────────────────────────────
function FlashSaleSection({ products }) {
  if (!products.length) return null;
  const endDate = products[0]?.flashSaleEndsAt || new Date(Date.now() + 12 * 3600000);

  return (
    <section className="bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl animate-bounce">⚡</span>
              <span className="badge badge-hot text-base px-4 py-1.5">Flash Sale</span>
            </div>
            <h2 className="font-display font-bold text-4xl">Deals End In</h2>
          </div>
          <CountdownTimer endDate={endDate} />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mood Shopping ──────────────────────────────────────
function MoodSection() {
  const dispatch   = useDispatch();
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Mood Shopping');

  // Mood API params - use category only as backend doesn't support tags filter
  const moodParams = {
    chill:      { category: 'Books', sort: 'rating' },
    party:      { category: 'Fashion', sort: 'rating' },
    work:       { category: 'Electronics', sort: 'popular' },
    'date-night': { category: 'Fashion', sort: 'newest' },
  };

  const handleMood = async (mood) => {
    alert(`Mood selected: ${mood}`);
    console.log('Mood selected:', mood);
    setSelected(mood);
    setLoading(true);
    setProducts([]);
    setTitle(() => {
      const moodObj = moodConfig.find(m => m.key === mood);
      return moodObj ? `${moodObj.emoji} ${moodObj.label} Picks for You` : 'Mood Shopping';
    });
    dispatch(setActiveMood(mood));
    try {
      const params = { ...moodParams[mood], limit: 6 };
      console.log('Fetching products with params:', params);
      const { data } = await productAPI.getAll(params);
      console.log('API response:', data);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log('Products state updated:', products);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-2">Unique Feature</p>
        <h2 className="font-display font-bold text-4xl mb-4">{title}</h2>
        <p className="text-white/40 max-w-lg mx-auto">Tell us how you're feeling and we'll curate products just for that vibe.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {moodConfig.map((mood, i) => (
          <motion.button
            key={mood.key}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleMood(mood.key)}
            className={`relative p-8 rounded-2xl glass border transition-all duration-300 group focus:outline-none ${
              selected === mood.key ? 'border-opacity-100 ring-2 ring-offset-2' : 'border-white/8 hover:border-white/20'
            }`}
            style={selected === mood.key ? { borderColor: mood.color, boxShadow: `0 0 30px ${mood.color}80`, zIndex: 2 } : {}}
          >
            <div className="text-5xl mb-4 group-hover:animate-bounce relative">
              {mood.emoji}
              {selected === mood.key && (
                <motion.span
                  className="absolute -inset-2 rounded-full border-4 border-opacity-60"
                  style={{ borderColor: mood.color, boxShadow: `0 0 0 8px ${mood.color}22` }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </div>
            <div className="font-display font-bold text-lg mb-1" style={{ color: selected === mood.key ? mood.color : '' }}>{mood.label}</div>
            <div className="w-8 h-0.5 rounded-full mx-auto transition-all duration-300 group-hover:w-full"
              style={{ background: mood.color, opacity: selected === mood.key ? 1 : 0.4 }} />
          </motion.button>
        ))}
      </div>

      {/* Animated product grid for mood */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="overflow-visible"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {loading
                ? Array(6).fill(0).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden">
                      <div className="skeleton aspect-square" />
                      <div className="p-4 space-y-2">
                        <div className="skeleton h-3 w-2/3 rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-3 w-1/2 rounded" />
                      </div>
                    </div>
                  ))
                : products.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <ProductCard product={p} index={i} />
                    </motion.div>
                  ))
              }
            </div>
            {!loading && products.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 text-white/40">
                <div className="text-4xl mb-2">😔</div>
                <div>No products found for this mood.<br />Try another mood!</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Price Drop Section ───────────────────────────────
function PriceDropSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on mount
  useEffect(() => {
    const fetchPriceDropProducts = async () => {
      try {
        // Fetch all products and filter client-side for price drop
        const { data } = await productAPI.getAll({ limit: 50 });
        const allProducts = data.products || [];
        // Filter: discountPrice exists and is less than price
        const priceDropProducts = allProducts.filter(p => 
          p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price
        ).slice(0, 12);
        setProducts(priceDropProducts);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceDropProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-4xl mb-2">🔥 Price Drop Products</h2>
        <p className="text-white/40">Products with a price drop from regular price.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-2/3 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
          : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
        }
      </div>
      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <div className="text-4xl mb-2">😔</div>
          <div>No price drop products found.</div>
        </div>
      )}
    </section>
  );
}

// ─── Featured Products ───────────────────────────────────
function FeaturedSection({ products, loading }) {
  const skeletons = Array(8).fill(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-2">Hand-picked</p>
          <h2 className="font-display font-bold text-4xl">Featured Products</h2>
        </div>
        <Link to="/products?featured=true" className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1">
          View all <span className="text-brand-400">→</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? skeletons.map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-2/3 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
          : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
        }
      </div>
    </section>
  );
}

// ─── Unique features banner ──────────────────────────────
function UniqueFeaturesBanner({ onPriceDropClick }) {
  // Feature card data with color and modal content
  const features = [
    {
      key: 'ai',
      color: '#00e5ff',
      title: 'AI Assistant',
      desc: 'Chat to find the perfect product',
      Illustration: () => (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ yoyo: Infinity, duration: 1.2 }} className="flex flex-col items-center justify-center">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="bg-cyan-400/20 rounded-full p-4 mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="16" width="32" height="20" rx="8" fill="#00e5ff" opacity="0.2"/><rect x="14" y="22" width="20" height="8" rx="4" fill="#00e5ff"/><circle cx="24" cy="26" r="2" fill="#fff"/></svg>
          </motion.div>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-cyan-300">Chat bubble</motion.div>
        </motion.div>
      ),
      Modal: ({ onClose }) => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
          <div className="font-bold text-lg mb-2">AI Style Assistant</div>
          <div className="bg-dark-700 rounded-xl p-4 mb-4">
            <div className="text-xs text-white/60 mb-2">Try: <span className="font-mono bg-dark-800 px-2 py-0.5 rounded">show me party outfits</span></div>
            <div className="flex flex-col gap-2">
              <div className="self-end bg-cyan-500/20 text-cyan-200 px-3 py-2 rounded-xl max-w-xs">show me party outfits</div>
              <div className="self-start bg-white/10 text-white/80 px-3 py-2 rounded-xl max-w-xs">Here are some trending party outfits for you! 🎉</div>
              <div className="self-start bg-white/10 text-white/80 px-3 py-2 rounded-xl max-w-xs">Sequin Dress, Velvet Blazer, Metallic Heels...</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-glow px-6 py-2 rounded-xl mt-2">Close</button>
        </motion.div>
      ),
    },
    {
      key: 'group',
      color: '#7c3aed',
      title: 'Group Buy',
      desc: 'Buy together, save together',
      Illustration: () => (
        <motion.div className="flex flex-col items-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="flex -space-x-2 mb-2">
            {[0,1,2].map(i => <div key={i} className="w-8 h-8 rounded-full bg-purple-400/30 border-2 border-purple-400/60" style={{ zIndex: 3-i, marginLeft: i ? -8 : 0 }} />)}
          </motion.div>
          <motion.div animate={{ width: [32, 64, 32] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-2 bg-purple-400/30 rounded-full" style={{ width: 32 }} />
        </motion.div>
      ),
      Modal: ({ onClose }) => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
          <div className="font-bold text-lg mb-2">Group Buy Demo</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {[0,1].map(i => <div key={i} className="w-8 h-8 rounded-full bg-purple-400/60 border-2 border-purple-400" />)}
              <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-purple-400 flex items-center justify-center text-purple-300">?</div>
            </div>
            <div className="text-sm">2 of 3 friends joined</div>
          </div>
          <div className="w-full bg-purple-400/20 rounded-full h-3 mb-2 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '66%' }} transition={{ duration: 1.2 }} className="h-3 bg-purple-400 rounded-full" />
          </div>
          <button onClick={onClose} className="btn-glow px-6 py-2 rounded-xl mt-2">Close</button>
        </motion.div>
      ),
    },
    {
      key: 'price',
      color: '#ffb300',
      title: 'Price Drop',
      desc: 'Get notified when prices fall',
      Illustration: () => (
        <motion.div className="flex flex-col items-center">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-4xl mb-1">₹</motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} className="w-8 h-2 bg-amber-400/40 rounded-full" />
        </motion.div>
      ),
      Modal: ({ onClose, onPriceDropClick }) => {
        const [email, setEmail] = useState('');
        const [price, setPrice] = useState('');
        const [set, setSet] = useState(false);
        return (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
            <div className="font-bold text-lg mb-2">Set a Price Drop Alert</div>
            {set ? (
              <div className="text-green-400 font-semibold mb-2">Alert Set!</div>
            ) : (
              <form className="flex flex-col gap-2 mb-2" onSubmit={e => { e.preventDefault(); setSet(true); }}>
                <input className="input-dark px-3 py-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="input-dark px-3 py-2 rounded" placeholder="Target Price" value={price} onChange={e => setPrice(e.target.value)} required />
                <button className="btn-glow px-4 py-2 rounded-xl mt-1">Set Alert</button>
              </form>
            )}
            <button onClick={() => { onClose(); onPriceDropClick(); }} className="btn-glow px-6 py-2 rounded-xl mt-2">Show Price Drop Products</button>
          </motion.div>
        );
      },
    },
    {
      key: 'eco',
      color: '#10b981',
      title: 'Eco Score',
      desc: 'Shop with a conscience',
      Illustration: () => (
        <motion.svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-2">
          <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="176" strokeDashoffset="44" style={{ filter: 'drop-shadow(0 0 8px #10b98188)' }}>
            <animate attributeName="stroke-dashoffset" values="44;0;44" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="32" y="38" textAnchor="middle" fontSize="18" fill="#10b981" fontWeight="bold">Green</text>
        </motion.svg>
      ),
      Modal: ({ onClose }) => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
          <div className="font-bold text-lg mb-2">Eco Score Breakdown</div>
          <div className="flex gap-6 mb-4">
            {[['Green', '#10b981', 80], ['Fair', '#fbbf24', 15], ['High', '#ef4444', 5]].map(([label, color, val]) => (
              <div key={label} className="flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="6" fill="none" opacity="0.2" />
                  <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="6" fill="none" strokeDasharray={126} strokeDashoffset={126 - (val/100)*126} style={{ transition: 'stroke-dashoffset 1s' }} />
                  <text x="24" y="29" textAnchor="middle" fontSize="12" fill={color} fontWeight="bold">{val}%</text>
                </svg>
                <div className="text-xs mt-1" style={{ color }}>{label}</div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="btn-glow px-6 py-2 rounded-xl mt-2">Close</button>
        </motion.div>
      ),
    },
    {
      key: 'try',
      color: '#ff1a7f',
      title: 'Try Before Buy',
      desc: 'Risk-free returns in 30 days',
      Illustration: () => (
        <motion.div className="flex flex-col items-center">
          <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-12 h-12 bg-pink-400/20 rounded-full flex items-center justify-center mb-2">
            <svg width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" fill="#ff1a7f" opacity="0.2"/><rect x="12" y="12" width="8" height="8" rx="2" fill="#ff1a7f"/><path d="M24 16h4m0 0l-2-2m2 2l-2 2" stroke="#ff1a7f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-pink-300">Return arrow</motion.div>
        </motion.div>
      ),
      Modal: ({ onClose }) => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
          <div className="font-bold text-lg mb-2">Try Before You Buy</div>
          <div className="flex flex-col gap-2 mb-4">
            {['Order', 'Try', 'Keep or Return'].map((step, i) => (
              <motion.div key={step} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold">{i+1}</div>
                <div>{step}</div>
                {i < 2 && <div className="w-8 h-1 bg-pink-400 rounded-full" />}
              </motion.div>
            ))}
          </div>
          <button onClick={onClose} className="btn-glow px-6 py-2 rounded-xl mt-2">Close</button>
        </motion.div>
      ),
    },
    {
      key: 'mood',
      color: '#f97316',
      title: 'Mood Shopping',
      desc: 'Products curated for your vibe',
      Illustration: () => (
        <motion.div className="flex flex-col items-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="flex gap-2 mb-2">
            {['😌','🎉','💼','💖'].map((m,i) => <span key={i} className="text-2xl" style={{ filter: 'drop-shadow(0 0 4px #f9731688)' }}>{m}</span>)}
          </motion.div>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-orange-300">Mood selector</motion.div>
        </motion.div>
      ),
      Modal: ({ onClose }) => (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="p-6">
          <div className="font-bold text-lg mb-2">Mood Shopping</div>
          <div className="flex gap-2 mb-4">
            {['Chill','Party','Work','Date Night'].map((mood, i) => (
              <button key={mood} className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 font-semibold hover:bg-orange-500/40 transition-all">{mood}</button>
            ))}
          </div>
          <div className="text-white/60 text-sm">Select a mood to see curated picks!</div>
          <button onClick={onClose} className="btn-glow px-6 py-2 rounded-xl mt-4">Close</button>
        </motion.div>
      ),
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-2">Why ShopVerse</p>
          <h2 className="font-display font-bold text-4xl">Beyond Shopping</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -8, boxShadow: `0 0 0 4px ${f.color}33, 0 8px 32px 0 ${f.color}22` }}
              className="relative glass p-8 rounded-3xl text-center cursor-pointer group transition-all duration-300"
              style={{ border: `2px solid ${f.color}33` }}
              onClick={() => setOpen(f.key)}
            >
              <div className="mb-4 flex items-center justify-center min-h-[64px]">{<f.Illustration />}</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: f.color }}>{f.title}</h3>
              <p className="text-white/50 text-sm mb-4 min-h-[40px]">{f.desc}</p>
              <button className="btn-glow px-5 py-2 rounded-xl text-white font-semibold mt-2" style={{ background: f.color, boxShadow: `0 0 12px ${f.color}88` }} onClick={e => { e.stopPropagation(); setOpen(f.key); }}>See Demo</button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setOpen(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="bg-dark-900 rounded-3xl shadow-2xl max-w-md w-full mx-4 relative"
                onClick={e => e.stopPropagation()}
              >
                <button className="absolute top-3 right-3 text-white/40 hover:text-white text-2xl" onClick={() => setOpen(null)}>&times;</button>
                {features.find(f => f.key === open)?.Modal({ onClose: () => setOpen(null), onPriceDropClick })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Sustainability section ──────────────────────────────
function SustainabilitySection() {
  // Animated count-up hook
  function useCountUp(target, duration = 1200) {
    const [val, setVal] = useState(0);
    useEffect(() => {
      let start = 0;
      let raf;
      const startTime = performance.now();
      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setVal(Math.floor(progress * target));
        if (progress < 1) raf = requestAnimationFrame(animate);
        else setVal(target);
      }
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return val;
  }

  const ecoStats = [
    { label: 'Eco Products', value: 2400, icon: '🌱', color: '#10b981' },
    { label: 'CO₂ Saved',   value: 15,   icon: '♻️', color: '#00e5ff', suffix: 'T' },
    { label: 'Green Brands', value: 80,  icon: '🏷️', color: '#7c3aed' },
    { label: 'Happy Planet', value: 100, icon: '🌍', color: '#ffb300', suffix: '%' },
  ];

  const [showEco, setShowEco] = useState(false);
  const [ecoProducts, setEcoProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch eco products when panel opens
  useEffect(() => {
    if (showEco && ecoProducts.length === 0) {
      setLoading(true);
      productAPI.getAll({ ecoScore: 'green', limit: 6 })
        .then(r => setEcoProducts(r.data.products || []))
        .catch(() => setEcoProducts([]))
        .finally(() => setLoading(false));
    }
  }, [showEco]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)', filter: 'blur(40px)' }} />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="badge badge-eco mb-4 text-sm">🌿 Sustainability First</span>
            <h2 className="font-display font-bold text-4xl mb-4">Shop Green,<br />Live Cleaner</h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Every product on ShopVerse carries an Eco Score — from carbon footprint to sustainable packaging.
              Make informed choices that matter to the planet.
            </p>
            <div className="flex gap-6 mb-8">
              {[['🌿 Green', 'Sustainable & low-impact'], ['⚡ Fair', 'Average footprint'], ['🔴 High', 'Review before buying']].map(([label, desc]) => (
                <div key={label}>
                  <div className="font-semibold text-sm mb-0.5">{label}</div>
                  <div className="text-white/40 text-xs">{desc}</div>
                </div>
              ))}
            </div>
            <button
              className="btn-glow px-6 py-3 rounded-xl text-white font-semibold inline-block relative z-10 text-sm"
              onClick={() => setShowEco(v => !v)}
            >
              Shop Eco Friendly
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ecoStats.map((stat, i) => {
              const count = useCountUp(stat.value);
              return (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center flex flex-col items-center relative">
                  <div className="absolute top-2 right-2">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="13" stroke={stat.color} strokeWidth="4" fill="none" opacity="0.15" />
                      <motion.circle
                        cx="16" cy="16" r="13" stroke={stat.color} strokeWidth="4" fill="none"
                        strokeDasharray={82}
                        strokeDashoffset={82 - (count/stat.value)*82}
                        initial={false}
                        animate={{ strokeDashoffset: 82 - (count/stat.value)*82 }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                  </div>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-display font-bold text-2xl gradient-text-gold">
                    {count}{stat.suffix || ''}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eco product panel */}
        <AnimatePresence>
          {showEco && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className="overflow-hidden mt-8"
            >
              <div className="bg-dark-800/80 rounded-2xl p-6 relative">
                <button
                  className="absolute top-3 right-3 text-white/40 hover:text-white text-2xl"
                  onClick={() => setShowEco(false)}
                  aria-label="Close"
                >×</button>
                <div className="font-bold text-lg mb-4 text-green-400 flex items-center gap-2">
                  <span>🌿</span> Eco Friendly Products
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {loading
                    ? Array(6).fill(0).map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden">
                          <div className="skeleton aspect-square" />
                          <div className="p-4 space-y-2">
                            <div className="skeleton h-3 w-2/3 rounded" />
                            <div className="skeleton h-4 w-full rounded" />
                            <div className="skeleton h-3 w-1/2 rounded" />
                          </div>
                        </div>
                      ))
                    : ecoProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
                  }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Newsletter ──────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail]   = useState('');
  const [sent,  setSent]    = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSent(true); setEmail(''); }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-brand-900/20 via-dark-800 to-accent-purple/10">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-6 animate-float inline-block">💌</div>
          <h2 className="font-display font-bold text-4xl mb-4">Stay in the Loop</h2>
          <p className="text-white/40 mb-8">Get exclusive deals, new arrivals, and price drop alerts — straight to your inbox.</p>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl">✅</div>
                <p className="text-green-400 font-semibold">You're subscribed! Welcome to the verse. 🎉</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 input-dark text-sm"
                  required
                />
                <button type="submit" className="btn-glow px-6 py-3 rounded-xl text-white font-semibold relative z-10 text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────
export default function HomePage() {
  const [featured,   setFeatured]   = useState([]);
  const [flashSale,  setFlashSale]  = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showPriceDrop, setShowPriceDrop] = useState(false);

  useEffect(() => {
    Promise.all([
      productAPI.getFeatured().then(r => setFeatured(r.data.products || [])),
      productAPI.getFlashSale().then(r => setFlashSale(r.data.products || [])),
      categoryAPI.getAll().then(r => setCategories(r.data.categories || r.data || [])),
    ])
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* <HeroSection /> Removed due to missing definition */}
      {/* <MarqueeStrip /> Removed due to missing definition */}
      {/* <CategoriesSection categories={categories} /> Removed due to missing definition */}
      <FlashSaleSection products={flashSale} />
      <MoodSection />
      <FeaturedSection products={featured} loading={loading} />
      <UniqueFeaturesBanner onPriceDropClick={() => setShowPriceDrop(true)} />
      {showPriceDrop && <PriceDropSection />}
      <SustainabilitySection />
      <NewsletterSection />
    </motion.div>
  );
}
