import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart, openCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { formatPrice, discountPct, ecoConfig, truncate } from '../utils/helpers';

export default function ProductCard({ product, index = 0 }) {
  const dispatch   = useDispatch();
  const wishlist   = useSelector(s => s.wishlist.items);
  const isWished   = wishlist.some(i => i._id === product._id);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [adding,   setAdding]   = useState(false);

  const eco   = ecoConfig[product.ecoScore] || ecoConfig.fair;
  const pct   = product.discountPrice ? discountPct(product.price, product.discountPrice) : 0;
  const imgs  = product.images || [];
  const price = product.discountPrice || product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success(`${truncate(product.name, 30)} added to cart!`, { icon: '🛒' });
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast(isWished ? 'Removed from wishlist' : '❤️ Added to wishlist', { duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/products/${product._id}`} className="block product-card group">

        {/* Image */}
        <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-dark-700">
          <img
            src={imgs[imgIdx]?.url || imgs[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            style={{ transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            onMouseEnter={() => imgs[1] && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {pct > 0         && <span className="badge badge-sale">{pct}% OFF</span>}
            {product.isFlashSale && <span className="badge badge-hot">⚡ Flash</span>}
            {product.isFeatured  && <span className="badge badge-new">★ Featured</span>}
          </div>

          {/* Stock warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 right-3 bg-dark-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-amber-400 text-center">
              Only {product.stock} left!
            </div>
          )}

          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className={`w-4 h-4 transition-colors ${isWished ? 'fill-brand-500 stroke-brand-500' : 'fill-none stroke-white'}`} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </motion.button>

          {/* Quick add */}
          {product.stock > 0 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="absolute bottom-3 inset-x-3 btn-glow py-2 rounded-xl text-white text-sm font-semibold translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 relative"
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Adding…
                </span>
              ) : '+ Add to Cart'}
            </motion.button>
          ) : (
            <button
              className="absolute bottom-3 inset-x-3 btn-glow py-2 rounded-xl text-white text-sm font-semibold translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 relative bg-gray-600 cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-white/40 mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium leading-snug mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-amber-400 text-xs">
              {'★'.repeat(Math.round(product.ratings || 0))}{'☆'.repeat(5 - Math.round(product.ratings || 0))}
            </div>
            <span className="text-xs text-white/30">({(product.numReviews || 0).toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-bold text-lg gradient-text">{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-xs text-white/30 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Eco + delivery */}
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: eco.bg, color: eco.color }}>
              {eco.label}
            </span>
            <span className="text-xs text-white/30">
              🚚 {product.deliveryDays}d
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
