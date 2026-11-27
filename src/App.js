import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Homepage from './components/pages/Homepage';
import Products from './components/pages/Products';
import DetailProduct from './components/DetailProduct';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
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
  '/': 'LuckShop — ហាងលក់ទំនិញគ្រប់មុខអនឡាញកម្ពុជា',
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
      : ROUTE_TITLES[pathname] || 'មិនមានទំព័រនេះទេ | LuckShop';
    document.title = matchedTitle;
  }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <section
      style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        color: '#f8fafc',
      }}
    >
      <div style={{ fontSize: '4rem', fontWeight: 800, color: '#ff6b35', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
        រកមិនឃើញទំព័រនេះទេ
      </h1>
      <p style={{ color: '#94a3b8', maxWidth: '420px', marginBottom: '1.5rem' }}>
        ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: '#ff6b35',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ត្រឡប់ទៅទំព័រដើម
        </Link>
        <Link
          to="/products"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#e2e8f0',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          មើលមុខទំនិញទាំងអស់
        </Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <RouteTitleUpdater />
          <div className="app">
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
                <Route path="*" element={<NotFoundPage />} />
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
