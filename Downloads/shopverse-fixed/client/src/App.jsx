import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar        from './components/Navbar';
import CartDrawer    from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import HomePage      from './pages/HomePage';
import ProductsPage  from './pages/ProductsPage';
import ProductPage   from './pages/ProductPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import ProfilePage   from './pages/ProfilePage';
import WishlistPage  from './pages/WishlistPage';
import CheckoutPage  from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Footer        from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <SearchOverlay />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/products"  element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
            <Route path="/wishlist"  element={<WishlistPage />} />
            <Route path="/checkout"  element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
