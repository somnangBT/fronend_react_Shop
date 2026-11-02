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
            <span>🏮 អបអរសាទរពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ • សួស្តីឆ្នាំថ្មី 🇰🇭</span>
            <KhmerPhkaChan size={16} />
          </div>
          <h1 className="hero-title">
            Delicious<span className="hero-title-highlight">Eats</span>
            <span className="hero-title-accent">ម្ហូបខ្មែរចូលឆ្នាំថ្មី នំប្រពៃណី & អាហារស្រស់ធម្មជាតិ</span>
          </h1>
          <p className="hero-description">
            {heroData?.description || 'អបអរសាទរពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ! រីករាយជាមួយមុខម្ហូបប្រពៃណីឈ្ងុយឆ្ងាញ់ នំអន្សមជ្រូក-ចេក ការីសាច់មាន់ ខសាច់ជ្រូកពងទា និងគ្រឿងផ្សំស្រស់ធម្មជាតិ ១០០% សម្រាប់សែនទេវតា និងជួបជុំក្រុមគ្រួសារ ដឹកជញ្ជូនរហ័សទាន់ចិត្តដល់គេហដ្ឋាន!'}
          </p>

          <KhmerDivider />

          {/* Quick Category CTAs */}
          <div className="hero-cta-group">
            <button
              onClick={() => handleCategoryJump('អាហារស្រស់ៗ')}
              className="hero-cta-primary hero-btn-fresh"
            >
              <span className="cta-icon">🥗</span>
              <span className="cta-text">អាហារស្រស់ៗ (Fresh Food)</span>
              <span className="cta-pulse"></span>
            </button>
            <button
              onClick={() => handleCategoryJump('អាហារចំអិនផ្ទាល់')}
              className="hero-cta-secondary hero-btn-cooked"
            >
              <span className="cta-icon">🍳</span>
              <span className="cta-text">អាហារចំអិនផ្ទាល់ (Cooked Fresh)</span>
            </button>
            <button
              onClick={() => handleCategoryJump('ចូលឆ្នាំ')}
              className="hero-cta-kny"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
                color: '#fff',
                border: '1px solid rgba(254, 240, 138, 0.6)',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
              }}
            >
              <span className="cta-icon">🏮</span>
              <span className="cta-text">ម្ហូបចូលឆ្នាំថ្មី</span>
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
              <span>ស្រស់ធម្មជាតិ ១០០%</span>
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
              <span>អនាម័យ & សុវត្ថិភាព</span>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-product-showcase">
            {/* Main Showcase Item */}
            <div className="hero-product-item hero-product-main">
              <KhmerCorner position="top-left" />
              <KhmerCorner position="bottom-right" />
              <div className="hero-product-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                🏮 ម្ហូបពិសេសចូលឆ្នាំថ្មី
              </div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow"></div>
                <div className="hero-product-image">
                  <img
                    src={
                      heroData?.image1
                        ? (heroData.image1.startsWith('http') ? heroData.image1 : `${baseUrl}${heroData.image1}`)
                        : 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
                    }
                    alt="Main dish"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              </div>
              <div className="hero-product-info">
                <h3 className="hero-product-name">ឡុកឡាក់សាច់គោ & អាម៉ុកត្រីបែបខ្មែរ</h3>
                <span className="hero-product-subtag">🍳 ចម្អិនផ្ទាល់ក្តៅៗភ្លាមៗ</span>
              </div>
            </div>

            {/* Fresh Food Showcase Card */}
            <div
              className="hero-product-item hero-product-secondary hero-product-2"
              onClick={() => handleCategoryJump('អាហារស្រស់ៗ')}
              style={{ cursor: 'pointer' }}
              title="ចុចដើម្បីមើល អាហារស្រស់ៗ"
            >
              <div className="hero-subcard-badge fresh">🥗 អាហារស្រស់ៗ</div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow small"></div>
                <img
                  src={
                    heroData?.image2
                      ? (heroData.image2.startsWith('http') ? heroData.image2 : `${baseUrl}${heroData.image2}`)
                      : 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="Fresh Salmon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="hero-subcard-label">ត្រីសាល់ម៉ុន & សាច់ស្រស់សែនទេវតា</div>
            </div>

            {/* Cooked Food Showcase Card */}
            <div
              className="hero-product-item hero-product-secondary hero-product-3"
              onClick={() => handleCategoryJump('អាហារចំអិនផ្ទាល់')}
              style={{ cursor: 'pointer' }}
              title="ចុចដើម្បីមើល អាហារចំអិនផ្ទាល់"
            >
              <div className="hero-subcard-badge cooked">🍳 ចម្អិនក្តៅៗ</div>
              <div className="hero-product-image-wrapper">
                <div className="hero-product-glow small"></div>
                <img
                  src={
                    heroData?.image3
                      ? (heroData.image3.startsWith('http') ? heroData.image3 : `${baseUrl}${heroData.image3}`)
                      : 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80'
                  }
                  alt="Cooked Fresh Seafood Rice"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="hero-subcard-label">នំអន្សមជ្រូក-ចេក & ម្ហូបក្តៅៗ</div>
            </div>

            {/* Floating Icons */}
            <div className="hero-product-floating-elements">
              <div className="hero-floating-element hero-float-1">🏮</div>
              <div className="hero-floating-element hero-float-2">🌸</div>
              <div className="hero-floating-element hero-float-3">✨</div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-number">១០០%</span>
              <span className="hero-stat-label">ស្រស់ធម្មជាតិ</span>
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
