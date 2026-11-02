import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { formatKHR } from '../utils/currency';
import { API_BASE_URL } from '../config/api';
import { KhmerDivider, KhmerAngkorCrest } from './KhmerOrnament';
import "./styles/Cart.css";

const Cart = () => {
  const { cartItems, cartCount, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0; // Friendly shop tax
  const taxes = subtotal * taxRate;
  const shippingCost = subtotal > 20 || subtotal === 0 ? 0 : 1.5; // $1.50 local shipping or free > $20
  const discountAmount = subtotal * (promoDiscount / 100);
  const total = subtotal + taxes + shippingCost - discountAmount;

  // Handle quantity change
  const handleQuantityChange = (item, change) => {
    if (item.quantity + change <= 0) {
      removeFromCart(item.id);
    } else {
      addToCart({
        pro_id: item.id,
        pro_name: item.name,
        price: item.price,
        image: item.image
      }, change);
    }
  };

  // Handle remove item
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Handle apply promo code
  const handleApplyPromo = () => {
    const promoCodes = {
      'KHMER10': 10,
      'DELICIOUS20': 20,
      'WELCOME15': 15
    };
    const trimmedCode = promoCode.trim().toUpperCase();

    if (promoCodes[trimmedCode]) {
      setPromoDiscount(promoCodes[trimmedCode]);
      setPromoApplied(true);
      showNotification(`បានអនុវត្តកូដ ${trimmedCode} បញ្ចុះ ${promoCodes[trimmedCode]}% ដោយជោគជ័យ!`, 'success');
    } else if (trimmedCode) {
      setPromoApplied(false);
      setPromoDiscount(0);
      showNotification('កូដប្រូម៉ូសិនមិនត្រឹមត្រូវឡើយ។ សូមសាកល្បងម្តងទៀត។', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `promo-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 400);
      }, 3000);
    }, 100);
  };

  // Handle checkout click
  const handleCheckoutClick = () => {
    if (!user) {
      showNotification('សូមចូលគណនី (Login) ដើម្បីបន្តការទូទាត់ប្រាក់', 'error');
      navigate('/login', { state: { from: '/checkout' } }); 
    } else {
      navigate('/checkout'); 
    }
  };

  return (
    <section className="cart-section khmer-bg-watermark">
      <div className="cart-grid-overlay"></div>
      <div className="cart-glow-orb cart-glow-1"></div>
      <div className="cart-glow-orb cart-glow-2"></div>

      <div className="cart-container">
        <div className="cart-header">
          <div className="cart-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <KhmerAngkorCrest size={20} />
            <span>កន្ត្រកទំនិញរបស់អ្នក</span>
          </div>
          <h1 className="cart-title">បញ្ជីមុខម្ហូប & អាហារដែលបានជ្រើសរើស</h1>
          <KhmerDivider />
          <p className="cart-subtitle">
            {cartCount > 0
              ? `អ្នកមាន ${cartCount} មុខទំនិញក្នុងកន្ត្រករបស់អ្នក`
              : 'កន្ត្រកទំនិញរបស់អ្នកមិនទាន់មានទំនិញនៅឡើយទេ'}
          </p>
        </div>

        {cartCount > 0 ? (
          <div className="cart-content">
            <div className="cart-items-container">
              <div className="cart-items-header">
                <div className="header-product">មុខទំនិញ</div>
                <div className="header-price">តម្លៃរាយ</div>
                <div className="header-quantity">ចំនួន</div>
                <div className="header-total">សរុប</div>
                <div className="header-actions"></div>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="item-product">
                      <div className="item-image">
                        <img
                          src={
                            item.image
                              ? (item.image.startsWith('http')
                                ? item.image
                                : `${API_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`)
                              : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150"
                          }
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <Link to={`/products/${item.id}`} className="view-product-link">មើលព័ត៌មានលម្អិត</Link>
                      </div>
                    </div>

                    <div className="item-price" data-label="តម្លៃ:">
                      <span className="primary-price">${item.price.toFixed(2)}</span>
                      <span className="khr-price">({formatKHR(item.price)})</span>
                    </div>

                    <div className="item-quantity">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, -1)}
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item, 1)}
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="item-total" data-label="សរុប:">
                      <span className="primary-price">${(item.price * item.quantity).toFixed(2)}</span>
                      <span className="khr-price">({formatKHR(item.price * item.quantity)})</span>
                    </div>

                    <div className="item-actions">
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="លុបចេញពីកន្ត្រក"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>សង្ខេបការបញ្ជាទិញ</h2>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <span>តម្លៃសរុបរង</span>
                  <span>${subtotal.toFixed(2)} ({formatKHR(subtotal)})</span>
                </div>
                <div className="summary-row">
                  <span>ថ្លៃដឹកជញ្ជូន</span>
                  <span>{shippingCost === 0 ? <span className="free-shipping" style={{ color: '#2ec4b6', fontWeight: 600 }}>ឥតគិតថ្លៃ (Free)</span> : `$${shippingCost.toFixed(2)} (~${formatKHR(shippingCost)})`}</span>
                </div>
                {promoApplied && (
                  <div className="summary-row discount">
                    <span>បញ្ចុះតម្លៃ ({promoDiscount}%)</span>
                    <span style={{ color: '#2ec4b6' }}>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="promo-code-container">
                  <input
                    type="text"
                    placeholder="កូដប្រូម៉ូសិន (ឧ. KHMER10)"
                    className="promo-input"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    className="apply-promo-btn"
                    onClick={handleApplyPromo}
                  >
                    ប្រើកូដ
                  </button>
                </div>
                <div className="summary-total" style={{ borderTop: '1px solid rgba(255, 107, 53, 0.25)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <span>តម្លៃសរុបទាំងអស់</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6b35' }}>${total.toFixed(2)}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b' }}>(~ {formatKHR(total)})</div>
                  </div>
                </div>
                <button
                  className="checkout-btn"
                  onClick={handleCheckoutClick}
                  disabled={cartCount === 0}
                >
                  <span>បន្តទៅការទូទាត់ប្រាក់</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <p className="security-note">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="security-icon">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>ការទូទាត់ប្រាក់មានសុវត្ថិភាព ១០០% និងរក្សាការសម្ងាត់ខ្ពស់។</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h2>កន្ត្រកទំនិញរបស់អ្នកនៅទទេ</h2>
            <p>អ្នកមិនទាន់បានបន្ថែមមុខម្ហូប ឬអាហារស្រស់ៗទៅក្នុងកន្ត្រកនៅឡើយទេ។</p>
            <Link to="/products" className="continue-shopping-btn">
              <span>ទស្សនាមុខម្ហូបដើម្បីកុម្ម៉ង់ ➔</span>
            </Link>
          </div>
        )}

        <div className="cart-cta">
          <Link to="/products" className="back-to-shopping">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>បន្តជ្រើសរើសមុខម្ហូបបន្ថែម</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
