import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { userAPI, orderAPI } from '../utils/api';
import { formatPrice } from '../utils/helpers';

export default function ProfilePage() {
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const statusColor = {
    placed:            'text-blue-400  bg-blue-400/10',
    confirmed:         'text-cyan-400  bg-cyan-400/10',
    packed:            'text-yellow-400 bg-yellow-400/10',
    shipped:           'text-purple-400 bg-purple-400/10',
    'out-for-delivery':'text-amber-400  bg-amber-400/10',
    delivered:         'text-green-400  bg-green-400/10',
    cancelled:         'text-red-400    bg-red-400/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 max-w-5xl mx-auto px-4 sm:px-6 py-10"
    >
      {/* Header */}
      <div className="glass rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white font-display font-bold text-3xl flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display font-bold text-3xl">{user?.name}</h1>
          <p className="text-white/40 mt-1">{user?.email}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="badge badge-new">{user?.role}</span>
            <span className="text-sm text-white/40">🏅 {user?.loyaltyPoints || 0} Loyalty Points</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-2xl p-1 w-fit mb-8">
        {['orders', 'addresses', 'settings'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-brand-500 text-white' : 'text-white/50 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)
          ) : orders.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-display font-bold text-xl mb-2">No orders yet</h3>
              <p className="text-white/40 text-sm">Your orders will appear here after you make a purchase.</p>
            </div>
          ) : orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-white/40">Order ID</p>
                  <p className="font-mono text-sm">{order._id.slice(-10).toUpperCase()}</p>
                </div>
                <span className={`badge px-3 py-1 text-xs font-semibold rounded-full ${statusColor[order.status] || 'text-white/60 bg-white/10'}`}>
                  {order.status?.toUpperCase()}
                </span>
                <div className="text-right">
                  <p className="text-xs text-white/40">Total</p>
                  <p className="font-bold gradient-text">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>
              {/* Tracking timeline */}
              {order.tracking?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {order.tracking.map((t, j) => (
                    <div key={j} className="flex flex-col items-center gap-1 min-w-fit">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                      <p className="text-xs text-white/40 whitespace-nowrap">{t.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'addresses' && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="font-display font-bold text-xl mb-2">Manage Addresses</h3>
          <p className="text-white/40 text-sm">Address management coming soon.</p>
        </div>
      )}

      {tab === 'settings' && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="font-display font-bold text-xl mb-2">Settings</h3>
          <p className="text-white/40 text-sm">Account settings coming soon.</p>
        </div>
      )}
    </motion.div>
  );
}
