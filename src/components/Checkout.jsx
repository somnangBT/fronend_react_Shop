import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { formatKHR } from '../utils/currency';
import { API_BASE_URL } from '../config/api';
import { KhmerDivider, KhmerAngkorCrest } from './KhmerOrnament';
import "./styles/Checkout.css";

const Checkout = () => {
  const { cartItems, cartCount, clearCart, subtotal, taxes, shipping, discount, total, promoCode } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartCount, navigate, orderComplete]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `checkout-notification ${type}`;
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

  // Handle order submission
  const handleSubmitOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        name: user.name || user.email.split('@')[0],
        email: user.email,
        phone: user.phone || '012345678',
        address: user.address || 'Phnom Penh, Cambodia',
        items: cartItems.map(item => ({
          pro_id: item.id,
          pro_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_method: 'Telegram/Cash',
        user_id: user.id || null
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setOrderId(data.order_id);
        setOrderComplete(true);
        clearCart();
        showNotification('ការបញ្ជាទិញបានជោគជ័យ! សូមអរគុណ។', 'success');
      } else {
        setError(data.message || 'មានបញ្ហាក្នុងការបញ្ជាទិញ។ សូមព្យាយាមម្តងទៀត។');
      }
    } catch (err) {
      setError('មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើបានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <section className="checkout-section khmer-bg-watermark">
        <div className="checkout-grid-overlay"></div>
        <div className="checkout-glow-orb checkout-glow-1"></div>
        <div className="checkout-glow-orb checkout-glow-2"></div>

        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="success-title">ការបញ្ជាទិញទទួលបានជោគជ័យ!</h1>
            <KhmerDivider />
            <p className="success-message">
              សូមអរគុណសម្រាប់ការបញ្ជាទិញពី DeliciousEats! {orderId && `លេខកូដបញ្ជាទិញរបស់អ្នកគឺ #${orderId}។`}
            </p>
            <p className="success-info">
              ព័ត៌មាននៃការបញ្ជាទិញត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធតេឡេក្រាមរបស់ហាងរួចរាល់ហើយ។ ក្រុមការងារយើងនឹងទាក់ទងរៀបចំដឹកជញ្ជូនជូនអ្នកភ្លាមៗ។
            </p>
            <div className="success-actions">
              <button
                className="view-orders-btn"
                onClick={() => navigate('/account/orders')}
              >
                មើលប្រវត្តិបញ្ជាទិញ ➔
              </button>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate('/products')}
              >
                បន្តទិញទំនិញបន្ថែម
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section khmer-bg-watermark">
      <div className="checkout-grid-overlay"></div>
      <div className="checkout-glow-orb checkout-glow-1"></div>
      <div className="checkout-glow-orb checkout-glow-2"></div>

      <div className="checkout-container">
        <div className="checkout-header">
          <div className="checkout-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <KhmerAngkorCrest size={20} />
            <span>ជំហានចុងក្រោយ</span>
          </div>
          <h1 className="checkout-title">ទូទាត់ប្រាក់ & បញ្ជាក់ការបញ្ជាទិញ</h1>
          <KhmerDivider />
          <p className="checkout-subtitle">
            សូមពិនិត្យព័ត៌មានមុខទំនិញ និងទិន្នន័យនៃការដឹកជញ្ជូនរបស់អ្នក
          </p>
        </div>

        {error && (
          <div className="checkout-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="checkout-content">
          <div className="order-summary">
            <h2 className="summary-title">សង្ខេបបញ្ជីមុខទំនិញ</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    <div style={{ fontSize: '0.78rem', color: '#f59e0b' }}>({formatKHR(item.price * item.quantity)})</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>តម្លៃសរុបរង</span>
                <span>${subtotal.toFixed(2)} ({formatKHR(subtotal)})</span>
              </div>
              <div className="summary-row">
                <span>ថ្លៃដឹកជញ្ជូន</span>
                <span>{shipping === 0 ? <span className="free-shipping" style={{ color: '#2ec4b6' }}>ឥតគិតថ្លៃ (Free)</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>បញ្ចុះតម្លៃ</span>
                  <span style={{ color: '#2ec4b6' }}>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-total" style={{ borderTop: '1px solid rgba(255, 107, 53, 0.25)', paddingTop: '1rem', marginTop: '0.8rem' }}>
                <span>តម្លៃសរុបចុងក្រោយ</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ff6b35' }}>${total.toFixed(2)}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b' }}>(~ {formatKHR(total)})</div>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-actions">
            <button
              className="place-order-btn"
              onClick={handleSubmitOrder}
              disabled={loading}
            >
              {loading ? 'កំពុងដំណើរការបញ្ជាទិញ...' : 'បញ្ជាក់ការបញ្ជាទិញឥឡូវនេះ'}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{marginLeft: '8px'}}>
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              )}
            </button>
            <button
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              ត្រឡប់ទៅកន្ត្រកទំនិញ
            </button>
          </div>

          <div className="checkout-note">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="info-icon">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
              តាមរយៈការចុចបញ្ជាក់ការបញ្ជាទិញ អ្នកបានយល់ព្រមលើគោលការណ៍សេវាកម្ម និងភាពឯកជនរបស់ DeliciousEats។
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
