import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { productAPI } from '../utils/api';
import { addToCart, openCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice, discountPct, ecoConfig } from '../utils/helpers';
import CountdownTimer from '../components/CountdownTimer';

function StarRating({ rating, numReviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-400">
        {[1,2,3,4,5].map(s => (
          <svg key={s} className="w-4 h-4" fill={s <= Math.round(rating) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-white/50">{rating?.toFixed(1)} ({numReviews?.toLocaleString()} reviews)</span>
    </div>
  );
}

function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result,  setResult]  = useState(null);

  const check = () => {
    if (pincode.length === 6) {
      setResult({ available: true, days: Math.floor(Math.random() * 3) + 2, free: pincode.startsWith('1') || pincode.startsWith('4') });
    }
  };

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-sm font-semibold mb-3">📍 Check Delivery</p>
      <div className="flex gap-2">
        <input
          maxLength={6}
          value={pincode}
          onChange={e => { setPincode(e.target.value.replace(/\D/,'')); setResult(null); }}
          placeholder="Enter pincode"
          className="flex-1 px-3 py-2 input-dark text-sm rounded-xl"
        />
        <button onClick={check} disabled={pincode.length !== 6} className="px-4 py-2 btn-glow rounded-xl text-white text-sm font-semibold relative z-10 disabled:opacity-40">
          Check
        </button>
      </div>
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm"
          >
            {result.available ? (
              <p className="text-green-400">✅ Delivery in <strong>{result.days} days</strong> — {result.free ? <span className="text-green-300">Free Shipping!</span> : <span>₹49 shipping</span>}</p>
            ) : (
              <p className="text-red-400">❌ Delivery not available in this area</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPage() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector(s => s.wishlist.items);
  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [activeImg,    setActiveImg]    = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize,  setSelectedSize]  = useState('');
  const [qty,          setQty]          = useState(1);
  const [tab,          setTab]          = useState('description'); // description | reviews | qa
  const [tryBefore,    setTryBefore]    = useState(false);
  const [groupBuy,     setGroupBuy]     = useState(false);
  const [adding,       setAdding]       = useState(false);

  const isWished = wishlist.some(i => i._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productAPI.getById(id)
      .then(r => { setProduct(r.data); setSelectedColor(r.data.colors?.[0]?.name || ''); setSelectedSize(r.data.sizes?.[0] || ''); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length && !selectedSize) return toast.error('Please select a size');
    setAdding(true);
    dispatch(addToCart({ ...product, selectedColor, selectedSize, qty }));
    dispatch(openCart());
    toast.success('Added to cart! 🛒');
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast(isWished ? 'Removed from wishlist' : '❤️ Added to wishlist');
  };

  if (loading) return (
    <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {[0,1,2,3].map(i => <div key={i} className="skeleton aspect-square rounded-xl" />)}
          </div>
        </div>
        <div className="space-y-4">
          {[80,50,40,60,30].map((w,i) => <div key={i} className={`skeleton h-${i===0?8:4} rounded-xl`} style={{width:`${w}%`}} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="font-display font-bold text-2xl mb-2">Product not found</h2>
        <Link to="/products" className="text-brand-400 hover:text-brand-300">← Back to products</Link>
      </div>
    </div>
  );

  const eco  = ecoConfig[product.ecoScore] || ecoConfig.fair;
  const pct  = product.discountPrice ? discountPct(product.price, product.discountPrice) : 0;
  const imgs = product.images || [];
  const groupDiscount = groupBuy ? product.groupBuyDiscount || 10 : 0;
  const finalPrice = (product.discountPrice || product.price) * (1 - groupDiscount / 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden glass group"
            >
              <img
                src={imgs[activeImg]?.url || imgs[0] || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {pct > 0 && <span className="badge badge-sale text-sm px-3 py-1">{pct}% OFF</span>}
                {product.isFlashSale && <span className="badge badge-hot">⚡ Flash</span>}
              </div>
              {/* Wishlist */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-colors ${isWished ? 'text-brand-400' : 'text-white/60 hover:text-brand-400'}`}
              >
                <svg className="w-5 h-5" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </motion.div>
            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-500' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-6">
            <div>
              <p className="text-brand-400 text-sm font-semibold mb-1">{product.brand}</p>
              <h1 className="font-display font-bold text-3xl leading-tight mb-3">{product.name}</h1>
              <StarRating rating={product.ratings} numReviews={product.numReviews} />
            </div>

            {/* Flash sale countdown */}
            {product.isFlashSale && product.flashSaleEndsAt && (
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-3">⚡ Flash Sale Ends In</p>
                <CountdownTimer endDate={product.flashSaleEndsAt} />
              </div>
            )}

            {/* Price */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display font-bold text-4xl gradient-text">{formatPrice(finalPrice * qty)}</span>
                {product.discountPrice && <span className="text-white/30 line-through text-lg">{formatPrice(product.price * qty)}</span>}
                {pct > 0 && <span className="badge badge-sale">{pct}% OFF</span>}
              </div>
              {qty > 1 && <p className="text-xs text-white/30">{formatPrice(finalPrice)} × {qty}</p>}
              {groupBuy && <p className="text-xs text-accent-purple mt-1">👥 Extra {groupDiscount}% group buy discount applied!</p>}
              <p className="text-xs text-green-400 mt-2">
                {finalPrice * qty > 499 ? '🚚 Free delivery' : `🚚 Free delivery on orders above ₹499 (₹${(499 - finalPrice * qty).toFixed(0)} more)`}
              </p>
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Color: <span className="text-white/50 font-normal">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-8 h-8 rounded-full border-4 transition-all ${selectedColor === c.name ? 'border-white scale-110' : 'border-transparent hover:border-white/40'}`}
                      style={{ background: c.hex || '#888' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3">Size: <span className="text-white/50 font-normal">{selectedSize}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${selectedSize === s ? 'border-brand-500 bg-brand-500/15 text-brand-300' : 'border-white/15 hover:border-white/40 text-white/60'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div>
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center glass rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-white/10 transition-colors text-lg">−</button>
                  <span className="px-5 py-2.5 font-semibold min-w-12 text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2.5 hover:bg-white/10 transition-colors text-lg">+</button>
                </div>
                {product.stock <= 10 && <span className="text-amber-400 text-sm">Only {product.stock} left!</span>}
              </div>
            </div>

            {/* Unique features */}
            <div className="space-y-3">
              {/* Try before buy */}
              <label className="flex items-center gap-3 p-4 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-colors">
                <div onClick={() => setTryBefore(v => !v)} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${tryBefore ? 'bg-brand-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${tryBefore ? 'left-6' : 'left-1'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">🔄 Try Before You Buy</p>
                  <p className="text-xs text-white/40">Return within {product.returnDays || 30} days if not satisfied</p>
                </div>
              </label>

              {/* Group buy */}
              <label className="flex items-center gap-3 p-4 glass rounded-2xl cursor-pointer hover:bg-white/5 transition-colors">
                <div onClick={() => setGroupBuy(v => !v)} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${groupBuy ? 'bg-accent-purple' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${groupBuy ? 'left-6' : 'left-1'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">👥 Group Buy — Save {product.groupBuyDiscount || 10}%</p>
                  <p className="text-xs text-white/40">Get {product.groupBuyThreshold || 3}+ friends to buy and unlock a discount</p>
                </div>
              </label>
            </div>

            {/* Add to cart + Buy now */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-glow py-4 rounded-2xl text-white font-bold relative z-10 disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {adding ? (
                  <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Adding…</>
                ) : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </motion.button>
              <Link to="/checkout" className="px-6 py-4 rounded-2xl glass border border-white/20 font-bold hover:bg-white/10 transition-all text-sm text-center whitespace-nowrap">
                Buy Now
              </Link>
            </div>

            {/* Eco + delivery info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <span style={{ color: eco.color }} className="text-sm font-semibold">{eco.label}</span>
                <p className="text-xs text-white/30 mt-0.5">Eco Score</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <span className="text-sm font-semibold text-white">🚚 {product.deliveryDays}–{product.deliveryDays + 2} days</span>
                <p className="text-xs text-white/30 mt-0.5">Delivery</p>
              </div>
            </div>

            <PincodeChecker />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16">
          <div className="flex gap-1 glass rounded-2xl p-1 w-fit mb-8">
            {[
              { key: 'description', label: 'Description' },
              { key: 'reviews',     label: `Reviews (${product.numReviews || 0})` },
              { key: 'qa',          label: 'Q&A' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-white/50 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'description' && (
              <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8">
                <p className="text-white/70 leading-relaxed mb-6">{product.description}</p>
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 glass rounded-full text-xs text-white/50">#{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8">
                {/* Rating breakdown */}
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="font-display font-bold text-7xl gradient-text">{product.ratings?.toFixed(1) || '0'}</div>
                    <StarRating rating={product.ratings} numReviews={product.numReviews} />
                  </div>
                  <div className="space-y-2">
                    {[5,4,3,2,1].map(star => {
                      const count = product.reviews?.filter(r => Math.round(r.rating) === star).length || 0;
                      const pct = product.numReviews ? (count / product.numReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="text-amber-400 w-8">{star}★</span>
                          <div className="flex-1 h-2 glass rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: star * 0.1 }}
                              className="h-full bg-amber-400 rounded-full"
                            />
                          </div>
                          <span className="text-white/40 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-4">
                  {product.reviews?.length ? product.reviews.map((r, i) => (
                    <div key={i} className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-xs font-bold">
                            {r.name?.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm">{r.name}</span>
                        </div>
                        <div className="flex text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      </div>
                      <p className="text-white/60 text-sm">{r.comment}</p>
                    </div>
                  )) : (
                    <p className="text-white/40 text-center py-8">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'qa' && (
              <motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8">
                <p className="text-white/40 text-sm text-center py-8">Q&A coming soon. Ask questions on the product below.</p>
                <div className="flex gap-3">
                  <input placeholder="Ask a question about this product…" className="flex-1 input-dark px-4 py-3 rounded-xl text-sm" />
                  <button className="btn-glow px-6 py-3 rounded-xl text-white font-semibold relative z-10 text-sm">Ask</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
