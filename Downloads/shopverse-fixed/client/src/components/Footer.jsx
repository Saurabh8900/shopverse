import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = {
  Shop: [
    { label: 'Electronics', to: '/products?category=Electronics' },
    { label: 'Fashion', to: '/products?category=Fashion' },
    { label: 'Home & Living', to: '/products?category=Home%20%26%20Living' },
    { label: 'Sports', to: '/products?category=Sports' },
    { label: 'Beauty', to: '/products?category=Beauty' },
    { label: 'Books', to: '/products?category=Books' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '#' },
    { label: 'Press', to: '#' },
    { label: 'Blog', to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Returns', to: '/profile' },
    { label: 'Track Order', to: '/profile' },
    { label: 'Contact Us', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cookie Policy', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white font-display font-bold text-sm">SV</div>
              <span className="font-display font-bold text-xl gradient-text">ShopVerse</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Next-gen e-commerce with AI-powered shopping experiences.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: '🐦', url: 'https://twitter.com' },
                { icon: '📸', url: 'https://instagram.com' },
                { icon: '💼', url: 'https://linkedin.com' },
                { icon: '▶️', url: 'https://youtube.com' },
              ].map(({ icon, url }, i) => (
                <motion.a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-sm hover:border-brand-500/40 transition-colors"
                  aria-label={icon}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    {item.to.startsWith('http') ? (
                      <a href={item.to} target="_blank" rel="noopener noreferrer" className="text-white/40 text-sm hover:text-white transition-colors">{item.label}</a>
                    ) : (
                      <Link to={item.to} className="text-white/40 text-sm hover:text-white transition-colors">{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2024 ShopVerse. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {[
              { label: 'Visa' },
              { label: 'Mastercard' },
              { label: 'UPI' },
              { label: 'RuPay' },
            ].map(({ label }, i) => (
              <span key={label} className="px-3 py-1 rounded-full bg-white text-dark-800 font-bold text-xs shadow border border-white/20" style={{ letterSpacing: '0.04em' }}>{label}</span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
