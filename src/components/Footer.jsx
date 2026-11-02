import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KhmerAngkorCrest, KhmerFrieze } from './KhmerOrnament';
import "./styles/Footer.css";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-section" id="footer">
      <KhmerFrieze />
      <div className="footer-grid-overlay"></div>
      
      {/* Glow orbs for background effect */}
      <div className="footer-glow-orb footer-glow-1"></div>
      <div className="footer-glow-orb footer-glow-2"></div>
      
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <KhmerAngkorCrest size={28} />
              <span>Delicious<span>Eats</span></span>
            </h2>
            <p className="footer-tagline">
              ហាងម្ហូបខ្មែរឆ្ងាញ់ៗ & អាហារស្រស់ៗធម្មជាតិ ១០០% រសជាតិខ្មែរពិតៗ អនាម័យខ្ពស់ ដឹកជញ្ជូនរហ័សដល់គេហដ្ឋាន។
            </p>
            <div className="footer-contact-brief" style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#b2bec3', lineHeight: '1.6' }}>
              <div>📍 រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div>📞 012 345 678 / 098 765 432</div>
              <div>⏰ បើកបម្រើជារៀងរាល់ថ្ងៃ: ៧:០០ ព្រឹក - ៩:០០ យប់</div>
            </div>
            <div className="footer-social" style={{ marginTop: '1rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-link" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-link" title="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">មុខទំនិញ</h3>
              <ul className="footer-links-list">
                <li><Link to="/products?category=fresh" className="footer-link">🌿 អាហារស្រស់ៗ</Link></li>
                <li><Link to="/products?category=cooked" className="footer-link">🍳 អាហារចំអិនផ្ទាល់</Link></li>
                <li><Link to="/products" className="footer-link">📦 មុខទំនិញទាំងអស់</Link></li>
                <li><Link to="/#products" className="footer-link">🔥 មុខម្ហូបលក់ដាច់</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">អំពីយើង</h3>
              <ul className="footer-links-list">
                <li><Link to="/about" className="footer-link">អំពី DeliciousEats</Link></li>
                <li><Link to="/#features" className="footer-link">ហេតុអ្វីជ្រើសរើសយើង</Link></li>
                <li><Link to="/contact" className="footer-link">ទំនាក់ទំនងយើង</Link></li>
                <li><Link to="/about" className="footer-link">ស្តង់ដារអនាម័យ</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">គណនី & សេវាកម្ម</h3>
              <ul className="footer-links-list">
                <li><Link to="/cart" className="footer-link">កន្ត្រកទំនិញ</Link></li>
                <li><Link to="/account/orders" className="footer-link">ប្រវត្តិបញ្ជាទិញ</Link></li>
                <li><Link to="/account" className="footer-link">ព័ត៌មានគណនី</Link></li>
                <li><Link to="/checkout" className="footer-link">ទូទាត់ប្រាក់</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">ជំនួយ & សុវត្ថិភាព</h3>
              <ul className="footer-links-list">
                <li><Link to="/contact" className="footer-link">ផ្នែកជំនួយ ២៤/៧</Link></li>
                <li><Link to="/contact" className="footer-link">សំណួរញឹកញាប់ (FAQ)</Link></li>
                <li><Link to="/contact" className="footer-link">គោលការណ៍ដឹកជញ្ជូន</Link></li>
                <li><Link to="/contact" className="footer-link">គោលការណ៍រក្សាការសម្ងាត់</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-newsletter">
          <h3 className="newsletter-title">ទទួលព័ត៌មានប្រូម៉ូសិនពិសេស</h3>
          <p className="newsletter-text">ចុះឈ្មោះអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានប័ណ្ណបញ្ចុះតម្លៃ និងមុខម្ហូបថ្មីៗប្រចាំសប្តាហ៍មុនគេ។</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="form-input-wrapper">
              <input 
                type="email" 
                placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នកនៅទីនេះ..." 
                className="newsletter-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <div className="input-focus-effect"></div>
            </div>
            <button type="submit" className="newsletter-button">
              <span className="button-text">{subscribed ? '✓ បានចុះឈ្មោះ' : 'ចុះឈ្មោះ'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
          {subscribed && (
            <p style={{ color: '#2ec4b6', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              🎉 អរគុណសម្រាប់ការចុះឈ្មោះ! យើងនឹងផ្ញើប្រូម៉ូសិនពិសេសជូនអ្នកឆាប់ៗនេះ។
            </p>
          )}
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p className="copyright-text">&copy; {new Date().getFullYear()} DeliciousEats. រក្សាសិទ្ធិគ្រប់យ៉ាង។ រសជាតិខ្មែរពិតៗ គុណភាពខ្ពស់។</p>
          </div>
          <div className="footer-badges">
            <span className="footer-badge">🌿 ធម្មជាតិ ១០០%</span>
            <span className="footer-badge">⚡ ដឹកជញ្ជូនរហ័ស</span>
            <span className="footer-badge">🛡️ អនាម័យខ្ពស់</span>
          </div>
          <div className="scroll-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} title="ត្រឡប់ឡើងលើ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="scroll-icon">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Bottom neon border */}
      <div className="footer-neon-border"></div>
    </footer>
  );
};

export default Footer;
