import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register, clearError } from '../redux/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-8">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4">SV</div>
            <h1 className="font-display font-bold text-3xl mb-1">Join ShopVerse</h1>
            <p className="text-white/40 text-sm">Create your account in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',     label: 'Full Name',        type: 'text',     ph: 'Saurabh Singh' },
              { key: 'email',    label: 'Email',            type: 'email',    ph: 'you@example.com' },
              { key: 'password', label: 'Password',         type: 'password', ph: 'Min. 6 characters' },
              { key: 'confirm',  label: 'Confirm Password', type: 'password', ph: 'Re-enter password' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-2">{field.label}</label>
                <input
                  type={field.type}
                  required
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.ph}
                  className="w-full px-4 py-3 input-dark rounded-xl"
                  minLength={field.key === 'password' || field.key === 'confirm' ? 6 : undefined}
                />
              </div>
            ))}

            <p className="text-xs text-white/30">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow py-3.5 rounded-2xl text-white font-bold relative z-10 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating…</>
                : 'Create Account 🚀'
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
