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
  '/': 'LuckShop (DeliciousEats) — ហាងលក់ទំនិញគ្រប់មុខអនឡាញកម្ពុជា',
  '/products': 'មុខទំនិញទាំងអស់ | LuckShop',
  '/about': 'អំពីយើង | LuckShop',
  '/features': 'លក្ខណៈពិសេស | LuckShop',
  '/cart': 'កន្ត្រកទំនិញ | LuckShop',
  '/checkout': 'ទូទាត់ប្រាក់ KHQR | LuckShop',
  '/account/orders': 'តាមដានការបញ្ជាទិញ | LuckShop',
  '/contact': 'ទំនាក់ទំនង | LuckShop',
  '/login': 'ចូលគណនី | LuckShop',
  '/register': 'ចុះឈ្មោះ | LuckShop',
  '/account': 'គណនីរបស់ខ្ញុំ | LuckShop',
};

function RouteTitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const matchedTitle = pathname.startsWith('/products/')
      ? 'ព័ត៌មានលម្អិតទំនិញ | LuckShop'
      : ROUTE_TITLES[pathname] || 'LuckShop (DeliciousEats) — ហាងលក់ទំនិញគ្រប់មុខអនឡាញ';
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
