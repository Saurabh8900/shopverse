import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/helpers';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart.items);
  const total = useSelector(selectCartTotal);
  const shipping = total > 499 ? 0 : 49;
  const grandTotal = total + shipping;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    // Simulate order creation (in real app, call orderAPI.create)
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to success page with order ID
      navigate(`/order-success?orderId=${orderId}`);
      setLoading(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen bg-dark-900 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Link to="/products" className="btn-glow px-6 py-3 rounded-xl inline-block">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark-900 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/60 text-sm block mb-1">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 input-dark rounded-xl"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 input-dark rounded-xl"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 input-dark rounded-xl"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-3 input-dark rounded-xl"
                  placeholder="Full delivery address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm block mb-1">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 input-dark rounded-xl"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm block mb-1">Pincode</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 input-dark rounded-xl"
                    placeholder="123456"
                  />
                </div>
              </div>

              <h3 className="text-white font-bold mt-6 mb-4">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover:bg-white/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-brand-500"
                  />
                  <span className="text-white">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover:bg-white/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="w-4 h-4 accent-brand-500"
                  />
                  <span className="text-white">Card Payment (Demo)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow py-4 rounded-xl text-white font-bold text-lg mt-6 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Place Order — ${formatPrice(grandTotal)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img
                      src={item.images?.[0]?.url || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm truncate">{item.name}</p>
                      <p className="text-white/40 text-xs">Qty: {item.qty}</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {formatPrice((item.discountPrice || item.price) * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-white/30">Add {formatPrice(499 - total)} more for free shipping</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            <Link to="/products" className="block text-center text-white/40 hover:text-white transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}