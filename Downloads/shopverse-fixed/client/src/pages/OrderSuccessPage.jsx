import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const cart = useSelector(state => state.cart.items);
  const [order] = useState({
    _id: orderId || 'ORD-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.qty, 0),
    shippingAddress: { name: 'User', address: 'Address not provided' }
  });

  const orderStatuses = [
    { key: 'confirmed', label: 'Order Confirmed', icon: '✅', desc: 'Your order has been placed' },
    { key: 'processing', label: 'Processing', icon: '📦', desc: 'We are preparing your order' },
    { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'On the way to you' },
    { key: 'delivered', label: 'Delivered', icon: '🏠', desc: 'Delivered to your address' }
  ];

  const currentStep = orderStatuses.findIndex(s => s.key === order.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark-900 py-12 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-white/60">Thank you for shopping with ShopVerse</p>
        </motion.div>

        {/* Order Details Card */}
        <div className="glass rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/40 text-sm">Order ID</p>
              <p className="text-white font-semibold text-lg">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-sm">Total Amount</p>
              <p className="text-brand-400 font-bold text-xl">₹{order.total?.toLocaleString()}</p>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-white/40 text-sm mb-3">Items Ordered:</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img 
                      src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-white/40 text-xs">Qty: {item.qty}</p>
                    </div>
                    <p className="text-white font-semibold">₹{((item.discountPrice || item.price) * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Tracking */}
        <div className="glass rounded-3xl p-6 mb-8">
          <h2 className="text-white font-bold text-xl mb-6">Track Your Order</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full">
              <motion.div 
                className="h-full bg-brand-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (orderStatuses.length - 1)) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            {/* Status Steps */}
            <div className="flex justify-between relative">
              {orderStatuses.map((status, idx) => (
                <div key={status.key} className="flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: idx <= currentStep ? 1 : 0.5 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      idx <= currentStep ? 'bg-brand-500' : 'bg-white/10'
                    }`}
                  >
                    {status.icon}
                  </motion.div>
                  <p className={`text-sm font-semibold ${idx <= currentStep ? 'text-white' : 'text-white/40'}`}>
                    {status.label}
                  </p>
                  <p className="text-xs text-white/40 text-center mt-1">{status.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/products" 
            className="flex-1 btn-glow py-3 rounded-xl text-center font-semibold"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/profile" 
            className="flex-1 glass py-3 rounded-xl text-center font-semibold text-white hover:bg-white/10 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </motion.div>
  );
}