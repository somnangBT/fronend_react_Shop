import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { KhmerAngkorCrest, KhmerFrieze, KhmerNewYearBanner } from './KhmerOrnament';
import { API_BASE_URL } from '../config/api';
import './styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Handle scroll event to change navbar style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountDropdownOpen(false);
  }, [location]);

  // Click outside to close Account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
    if (isAccountDropdownOpen) setIsAccountDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (isAccountDropdownOpen) setIsAccountDropdownOpen(false);
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen((prev) => !prev);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <KhmerNewYearBanner />
      <div className="nav-grid-overlay"></div>
      <div className="nav-glow-orb nav-glow-1"></div>
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/" className="brand-logo-link" title="DeliciousEats អាហារខ្មែរឆ្ងាញ់ៗ">
            <KhmerAngkorCrest size={28} className="brand-crest" />
            Delicious<span>Eats</span>
          </Link>
          <span className="nav-kny-badge" style={{
            fontSize: '0.72rem',
            background: 'linear-gradient(135deg, #f59e0b, #dc2626)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
            letterSpacing: 0,
            whiteSpace: 'nowrap'
          }}>
            🏮 ចូលឆ្នាំថ្មី
          </span>
        </div>

        {/* Main Nav Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'nav-active' : ''}`}>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                ទំព័រដើម
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products?category=fresh"
                className="nav-link nav-link-special nav-link-fresh"
              >
                🌿 អាហារស្រស់
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products?category=cooked"
                className="nav-link nav-link-special nav-link-cooked"
              >
                🍳 អាហារចំអិន
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className={`nav-link ${location.pathname === '/products' && !location.search ? 'active' : ''}`}
              >
                មុខទំនិញ
              </Link>
            </li>
            {/* Mobile Drawer Only Order History */}
            <li className="nav-item nav-item-drawer-only">
              <Link
                to="/account/orders"
                className={`nav-link ${location.pathname === '/account/orders' ? 'active' : ''}`}
              >
                📦 ប្រវត្តិបញ្ជាទិញ
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                អំពីយើង
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                ទំនាក់ទំនង
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Search */}
          <div className={`search-container ${isSearchOpen ? 'search-active' : ''}`}>
            <input
              type="text"
              placeholder="ស្វែងរកម្ហូប..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button className="search-button" onClick={toggleSearch} title="ស្វែងរក">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Account Dropdown Wrapper */}
          <div className="account-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`action-icon-wrapper ${isAccountDropdownOpen ? 'active' : ''}`}
              title="គណនី និងប្រវត្តិបញ្ជាទិញ (Dropdown Menu)"
              onClick={toggleAccountDropdown}
              aria-expanded={isAccountDropdownOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="action-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              {isAuthenticated && <span className="account-online-dot"></span>}
            </button>

            {/* Dropdown Menu Popup */}
            {isAccountDropdownOpen && (
              <div className="account-dropdown-menu">
                <div className="dropdown-arrow"></div>
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-header">
                      <div className="dropdown-user-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{user?.name || 'អតិថិជន'}</span>
                        <span className="dropdown-user-email">{user?.email || ''}</span>
                        {isAdmin && (
                          <span className="dropdown-role-badge">👑 Admin</span>
                        )}
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <ul className="dropdown-list">
                      <li>
                        <Link
                          to="/account"
                          className="dropdown-item"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <span className="dropdown-item-icon">👤</span>
                          <span className="dropdown-item-text">ព័ត៌មានគណនី (Profile)</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/account/orders"
                          className="dropdown-item highlight"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <span className="dropdown-item-icon">📦</span>
                          <span className="dropdown-item-text">ប្រវត្តិបញ្ជាទិញ (Order History)</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="dropdown-item"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <span className="dropdown-item-icon">🛒</span>
                          <span className="dropdown-item-text">កន្ត្រកទំនិញ ({cartCount})</span>
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <a
                            href={`${API_BASE_URL}/dashboard`}
                            className="dropdown-item admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsAccountDropdownOpen(false)}
                          >
                            <span className="dropdown-item-icon">⚙️</span>
                            <span className="dropdown-item-text">ផ្ទាំងគ្រប់គ្រង Admin</span>
                          </a>
                        </li>
                      )}
                    </ul>

                    <div className="dropdown-divider"></div>

                    <button
                      type="button"
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-item-icon">🚪</span>
                      <span className="dropdown-item-text">ចាកចេញ (Logout)</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header guest">
                      <span className="dropdown-welcome-title">✨ សូមស្វាគមន៍!</span>
                      <p className="dropdown-welcome-sub">ចូលគណនីដើម្បីពិនិត្យប្រវត្តិទិញ</p>
                    </div>

                    <div className="dropdown-actions-group">
                      <Link
                        to="/login"
                        className="dropdown-btn-primary"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        🔑 ចូលគណនី
                      </Link>
                      <Link
                        to="/register"
                        className="dropdown-btn-secondary"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        📝 ចុះឈ្មោះ
                      </Link>
                    </div>

                    <div className="dropdown-divider"></div>

                    <ul className="dropdown-list">
                      <li>
                        <Link
                          to="/account/orders"
                          className="dropdown-item highlight"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <span className="dropdown-item-icon">📦</span>
                          <span className="dropdown-item-text">ប្រវត្តិបញ្ជាទិញ (Order History)</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="dropdown-item"
                          onClick={() => setIsAccountDropdownOpen(false)}
                        >
                          <span className="dropdown-item-icon">🛒</span>
                          <span className="dropdown-item-text">កន្ត្រកទំនិញ ({cartCount})</span>
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="action-icon-wrapper" title="កន្ត្រកទំនិញ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="action-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {/* Mobile Drawer Toggle */}
          <button className="mobile-toggle" onClick={toggleMobileMenu} title="បញ្ជីម៉ឺនុយ (Menu)">
            <div className={`toggle-bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`toggle-bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`toggle-bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
          </button>
        </div>
      </div>

      <KhmerFrieze />
      <div className="nav-neon-border"></div>
    </header>
  );
};

export default Navbar;
