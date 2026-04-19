import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCart, openCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.wishlist);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success('Added to cart! 🛒');
  };

  const handleRemove = (product) => {
    dispatch(toggleWishlist(product));
    toast('Removed from wishlist', { duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display font-bold text-4xl">My Wishlist</h1>
          <p className="text-white/40 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => { items.forEach(p => dispatch(addToCart(p))); dispatch(openCart()); toast.success('All items added to cart!'); }}
            className="btn-glow px-5 py-2.5 rounded-xl text-white font-semibold relative z-10 text-sm"
          >
            Add All to Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-24 h-24 glass rounded-full flex items-center justify-center text-4xl">❤️</div>
          <h2 className="font-display font-bold text-2xl">Your wishlist is empty</h2>
          <p className="text-white/40">Save items you love — we'll let you know when prices drop.</p>
          <Link to="/products" className="btn-glow px-8 py-3 rounded-2xl text-white font-semibold relative z-10">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {items.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.06 }}
                className="product-card group"
              >
                <Link to={`/products/${product._id}`} className="block">
                  <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                    <img
                      src={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={e => { e.preventDefault(); handleRemove(product); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-white/40 mb-1">{product.brand}</p>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold gradient-text">{formatPrice(product.discountPrice || product.price)}</span>
                      {product.discountPrice && <span className="text-xs text-white/30 line-through">{formatPrice(product.price)}</span>}
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-glow py-2.5 rounded-xl text-white font-semibold text-sm relative z-10"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
