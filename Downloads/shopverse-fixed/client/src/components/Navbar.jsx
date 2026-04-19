import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toggleCart } from '../redux/slices/cartSlice';
import { setSearchOpen } from '../redux/slices/uiSlice';
import { selectCartItemCount } from '../redux/slices/cartSlice';

const NavLink = ({ to, children }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link to={to} className={`relative text-sm font-medium transition-colors duration-200 ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}>
      {children}
      {active && (
        <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan" />
      )}
    </Link>
  );
};

export default function Navbar() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { user }    = useSelector(s => s.auth);
  const cartCount   = useSelector(selectCartItemCount);
  const [scrolled,  setScrolled]  = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenu(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/90 backdrop-blur-2xl border-b border-white/8 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white font-display font-bold text-sm">SV</div>
          <span className="font-display font-bold text-xl gradient-text hidden sm:block">ShopVerse</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/products?category=Electronics">Electronics</NavLink>
          <NavLink to="/products?category=Fashion">Fashion</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(setSearchOpen(true))}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:border-glow transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </motion.button>

          {/* Wishlist */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link to="/wishlist" className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-brand-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </Link>
          </motion.div>

          {/* Cart */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleCart())}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors relative"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setUserMenu(v => !v)}
                className="w-9 h-9 rounded-full border-2 border-brand-500/50 overflow-hidden flex items-center justify-center text-xs font-bold bg-gradient-to-br from-brand-600 to-accent-purple text-white"
              >
                {user.name?.charAt(0).toUpperCase()}
              </motion.button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-48 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50"
                  >
                    <div className="p-3 border-b border-white/8">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>
                    {[
                      { label: 'My Profile',  path: '/profile' },
                      { label: 'My Orders',   path: '/orders' },
                      { label: 'Wishlist',    path: '/wishlist' },
                    ].map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 transition-colors border-t border-white/8"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-glow px-4 py-1.5 rounded-full text-sm font-semibold text-white z-10 relative"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
