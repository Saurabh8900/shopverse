import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login, clearError } from '../redux/slices/authSlice';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4">SV</div>
            <h1 className="font-display font-bold text-3xl mb-1">Welcome Back</h1>
            <p className="text-white/40 text-sm">Sign in to your ShopVerse account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className="w-full px-4 py-3 input-dark rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" required value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" className="w-full px-4 py-3 input-dark rounded-xl" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-glow py-3.5 rounded-2xl text-white font-bold relative z-10 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing In…</>
                : 'Sign In 🚀'}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl border border-white/8 text-xs text-white/40 text-center space-y-1">
            <p className="font-semibold text-white/60">Demo Credentials</p>
            <p>📧 admin@shopverse.com &nbsp;|&nbsp; 🔑 admin123</p>
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">Create one →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
