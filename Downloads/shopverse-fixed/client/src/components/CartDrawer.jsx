import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { closeCart, removeFromCart, updateQty, selectCartTotal } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/helpers';

export default function CartDrawer() {
  const dispatch   = useDispatch();
  const { items, isOpen } = useSelector(s => s.cart);
  const total      = useSelector(selectCartTotal);
  const shipping   = total > 499 ? 0 : 49;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col"
            style={{ background: 'rgba(13,0,24,0.97)', backdropFilter: 'blur(40px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <h2 className="font-display font-bold text-lg">
                Shopping Cart
                {items.length > 0 && <span className="ml-2 text-sm font-normal text-white/40">({items.length})</span>}
              </h2>
              <button onClick={() => dispatch(closeCart())} className="w-8 h-8 rounded-full glass flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-3xl">🛒</div>
                  <p className="text-white/50 text-sm">Your cart is empty</p>
                  <button onClick={() => dispatch(closeCart())} className="btn-glow px-6 py-2 rounded-full text-sm font-semibold text-white relative z-10">Start Shopping</button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-3 p-3 glass rounded-2xl"
                    >
                      <img
                        src={item.images?.[0]?.url || item.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-18 h-18 object-cover rounded-xl flex-shrink-0"
                        style={{ width: 72, height: 72 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                        {item.selectedColor && <p className="text-xs text-white/40 mt-0.5">Color: {item.selectedColor}</p>}
                        {item.selectedSize  && <p className="text-xs text-white/40">Size: {item.selectedSize}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-brand-400 font-bold text-sm">{formatPrice(item.discountPrice || item.price)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dispatch(updateQty({ _id: item._id, selectedColor: item.selectedColor, selectedSize: item.selectedSize, qty: item.qty - 1 }))}
                              className="w-6 h-6 rounded-full glass flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
                            >−</button>
                            <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
                            <button
                              onClick={() => dispatch(updateQty({ _id: item._id, selectedColor: item.selectedColor, selectedSize: item.selectedSize, qty: item.qty + 1 }))}
                              className="w-6 h-6 rounded-full glass flex items-center justify-center text-xs hover:bg-white/10 transition-colors"
                            >+</button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item))}
                        className="text-white/20 hover:text-brand-400 transition-colors self-start mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/8 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && <p className="text-xs text-white/30">Add {formatPrice(499 - total)} more for free shipping</p>}
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-white/8">
                    <span>Total</span><span className="gradient-text">{formatPrice(total + shipping)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="btn-glow w-full py-3 rounded-2xl text-white font-semibold text-center block relative z-10 text-sm"
                >
                  Checkout — {formatPrice(total + shipping)}
                </Link>
                <button onClick={() => dispatch(closeCart())} className="w-full text-center text-sm text-white/40 hover:text-white/70 transition-colors">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
