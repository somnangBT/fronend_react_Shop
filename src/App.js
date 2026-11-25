import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Homepage from './components/pages/Homepage';
import Products from './components/pages/Products';
import DetailProduct from './components/DetailProduct';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import KhmerNewYearPetals from './components/KhmerNewYearPetals';
import './App.css';
import Features from './components/Feature';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import Login from './components/Auth/Login';
import Account from './components/Account';
import About from './components/About';
import Contactpage from './components/pages/Contactpage';

const ROUTE_TITLES = {
  '/': 'DeliciousEats — ហាងលក់ម្ហូបអាហារ & ទំនិញអនឡាញកម្ពុជា',
  '/products': 'មុខទំនិញទាំងអស់ | DeliciousEats',
  '/about': 'អំពីយើង | DeliciousEats',
  '/features': 'លក្ខណៈពិសេស | DeliciousEats',
  '/cart': 'កន្ត្រកទំនិញ | DeliciousEats',
  '/checkout': 'ទូទាត់ប្រាក់ KHQR | DeliciousEats',
  '/account/orders': 'តាមដានការបញ្ជាទិញ | DeliciousEats',
  '/contact': 'ទំនាក់ទំនង | DeliciousEats',
  '/login': 'ចូលគណនី | DeliciousEats',
  '/register': 'ចុះឈ្មោះ | DeliciousEats',
  '/account': 'គណនីរបស់ខ្ញុំ | DeliciousEats',
};

function RouteTitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const matchedTitle = pathname.startsWith('/products/')
      ? 'ព័ត៌មានលម្អិតទំនិញ | DeliciousEats'
      : ROUTE_TITLES[pathname] || 'DeliciousEats — ហាងលក់ម្ហូបអាហារ & ទំនិញអនឡាញ';
    document.title = matchedTitle;
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <RouteTitleUpdater />
          <div className="app">
            <KhmerNewYearPetals />
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/products/:id" element={<DetailProduct />} />
                <Route path="/features" element={<Features />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account/orders" element={<OrderHistory />} />
                <Route path="/contact" element={<Contactpage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </div>
            <Footer />
            <BackToTop />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
