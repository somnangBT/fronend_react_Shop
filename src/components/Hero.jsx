import React, { useState, useEffect } from 'react';
import './styles/Hero.css';
import { useNavigate } from 'react-router-dom';
import { KhmerDivider, KhmerCorner, KhmerStarLantern, KhmerTevada, KhmerPhkaChan, KhmerFestivalTong } from './KhmerOrnament';
import { API_BASE_URL as API_URL } from '../config/api';

const Hero = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/slide-heroes`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === 'success' && result.data.length > 0) {
          setHeroData(result.data[0]);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      }
    };

    fetchHeroData();
  }, []);

  const handleCategoryJump = (categoryKeyword) => {
    const productsElem = document.getElementById('products');
    if (productsElem) {
      window.dispatchEvent(new CustomEvent('filter-category', { detail: categoryKeyword }));
      productsElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/products?category=${encodeURIComponent(categoryKeyword)}`);
    }
  };

  const baseUrl = `${API_URL}/storage/`;

  return (
    <section className="hero-section khmer-bg-watermark">
      {/* Traditional Khmer New Year Hanging Lanterns & Festive Streamers */}
      <div className="hero-kny-lantern lantern-left" title="គោមផ្កាយ & ទង់បុណ្យចូលឆ្នាំថ្មី">
        <KhmerStarLantern size={52} />
        <KhmerFestivalTong />
      </div>
      <div className="hero-kny-lantern lantern-right" title="គោមផ្កាយ & ទង់បុណ្យចូលឆ្នាំថ្មី">
        <KhmerStarLantern size={52} />
        <KhmerFestivalTong />
      </div>

      <div className="hero-grid-overlay"></div>
      <div className="hero-glow-orb hero-glow-1"></div>
      <div className="hero-glow-orb hero-glow-2"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <KhmerTevada size={24} />
            <KhmerPhkaChan size={16} />
            <span>🛍️ ហាងលក់ទំនិញគ្រប់មុខតាមអនឡាញកម្ពុជា • គុណភាព &amp; តម្លៃសមរម្យ 🇰🇭</span>
            <KhmerPhkaChan size={16} />
          </div>
          <h1 className="hero-title">
            Luck<span className="hero-title-highlight">Shop</span>
            <span className="hero-title-accent">ទំនិញគ្រប់មុខ គុណភាពខ្ពស់ • ទូទាត់ KHQR &amp; ដឹកជញ្ជូនរហ័ស</span>
          </h1>
          <p className="hero-description">
            {heroData?.description || 'សូមស្វាគមន៍មកកាន់ LuckShop (DeliciousEats)! ទីផ្សារលក់ទំនិញគ្រប់ប្រភេទតាមអនឡាញ ងាយស្រួលជ្រើសរើស តម្លៃសមរម្យ ទូទាត់ងាយស្រួលតាម Bakong KHQR ឬ ABA KHQR ជាមួយការតាមដានដឹកជញ្ជូនច្បាស់លាស់ ៣ ដំណាក់កាល!'}
          </p>

          <KhmerDivider />

          {/* Quick Shop CTAs */}
          <div className="hero-cta-group">
            <button
              onClick={() => {
                const productsElem = document.getElementById('products');
                if (productsElem) {
                  productsElem.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/products');
                }
              }}
              className="hero-cta-primary hero-btn-fresh"
            >
              <span className="cta-icon">🛍️</span>
              <span className="cta-text">ទស្សនាទំនិញទាំងអស់</span>
              <span className="cta-pulse"></span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className="hero-cta-secondary hero-btn-cooked"
            >
              <span className="cta-icon">📦</span>
              <span className="cta-text">ប្រភេទទំនិញគ្រប់មុខ</span>
            </button>
            <button
              onClick={() => navigate('/account/orders')}
              className="hero-cta-kny"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                color: '#fff',
                border: '1px solid rgba(125, 211, 252, 0.55)',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.35)'
              }}
            >
              <span className="cta-icon">🛵</span>
              <span className="cta-text">តាមដានការបញ្ជាទិញ</span>
            </button>
          </div>

          <div className="hero-features">
            <div className="hero-feature-item">
              <div className="feature-icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-feature-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span>ដឹកជញ្ជូនរហ័សទាន់ចិត្ត</span>
            </div>
            <div className="hero-feature-item">
              <div className="feature-icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-feature-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span>គុណភាពល្អ ១០០%</span>
            </div>
            <div className="hero-feature-item">
              <div className="feature-icon-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-feature-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span>ទូទាត់ KHQR &amp; សុវត្ថិភាព</span>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-product-showcase">
            {/* Main Showcase Item */}
            <div className="hero-product-item hero-product-main">
              <KhmerCorner position="top-left" />
              <KhmerCorner position="bottom-right" />
              <div className="hero-product-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                🌟 ទំនិញពេញនិយមប្រចាំហាង
              </div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow"></div>
                <div className="hero-product-image">
                  <img
                    src={
                      heroData?.image1
                        ? (heroData.image1.startsWith('http') ? heroData.image1 : `${baseUrl}${heroData.image1}`)
                        : '/logo512.png'
                    }
                    alt="LuckShop Featured"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo512.png';
                    }}
                  />
                </div>
              </div>
              <div className="hero-product-info">
                <h3 className="hero-product-name">ទំនិញគុណភាពល្អ &amp; តម្លៃសមរម្យ</h3>
                <span className="hero-product-subtag">🛍️ លក់គ្រប់មុខ • ដឹកជញ្ជូនទូទាំងប្រទេស</span>
              </div>
            </div>

            {/* Secondary Showcase Card 1 */}
            <div
              className="hero-product-item hero-product-secondary hero-product-2"
              onClick={() => handleCategoryJump('all')}
              style={{ cursor: 'pointer' }}
              title="ចុចដើម្បីមើលមុខទំនិញទាំងអស់"
            >
              <div className="hero-subcard-badge fresh">🛍️ ទំនិញចម្រុះ</div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow small"></div>
                <img
                  src={
                    heroData?.image2
                      ? (heroData.image2.startsWith('http') ? heroData.image2 : `${baseUrl}${heroData.image2}`)
                      : '/logo512.png'
                  }
                  alt="LuckShop Products"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo512.png';
                  }}
                />
              </div>
              <div className="hero-subcard-label">ជ្រើសរើសទំនិញគ្រប់ប្រភេទ</div>
            </div>

            {/* Secondary Showcase Card 2 */}
            <div
              className="hero-product-item hero-product-secondary hero-product-3"
              onClick={() => navigate('/checkout')}
              style={{ cursor: 'pointer' }}
              title="ទូទាត់ងាយស្រួលតាម KHQR"
            >
              <div className="hero-subcard-badge cooked">⚡ KHQR Pay</div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow small"></div>
                <img
                  src={
                    heroData?.image3
                      ? (heroData.image3.startsWith('http') ? heroData.image3 : `${baseUrl}${heroData.image3}`)
                      : '/logo512.png'
                  }
                  alt="KHQR Fast Payment"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo512.png';
                  }}
                />
              </div>
              <div className="hero-subcard-label">Bakong &amp; ABA KHQR</div>
            </div>

            {/* Floating Icons */}
            <div className="hero-product-floating-elements">
              <div className="hero-floating-element hero-float-1">🛍️</div>
              <div className="hero-floating-element hero-float-2">📦</div>
              <div className="hero-floating-element hero-float-3">✨</div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-number">១០០%</span>
              <span className="hero-stat-label">គុណភាពពិត</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">១៥-២៥ នាទី</span>
              <span className="hero-stat-label">ដឹកជញ្ជូនរហ័ស</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">៤.៩ ★</span>
              <span className="hero-stat-label">ការពេញចិត្តអតិថិជន</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-shape-divider">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
