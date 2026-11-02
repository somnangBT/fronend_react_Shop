import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { formatKHR } from '../utils/currency';
import { API_BASE_URL } from '../config/api';
import { KhmerDivider, KhmerAngkorCrest } from './KhmerOrnament';
import "./styles/Checkout.css";

const Checkout = () => {
  const { cartItems, cartCount, clearCart, subtotal, taxes, shipping, discount, total } = useCart();
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
        name: user?.name || user?.email?.split('@')[0] || 'Customer',
        customer_name: user?.name || user?.email?.split('@')[0] || 'Customer',
        email: user?.email || '',
        phone: user?.phone || '012345678',
        address: user?.address || 'Phnom Penh, Cambodia',
        shipping_address: user?.address || 'Phnom Penh, Cambodia',
        subtotal: parseFloat(subtotal) || parseFloat(total) || 0,
        total: parseFloat(total) || parseFloat(subtotal) || 0,
        total_amount: parseFloat(total) || parseFloat(subtotal) || 0,
        tax: parseFloat(taxes) || 0,
        shipping: parseFloat(shipping) || 0,
        discount: parseFloat(discount) || 0,
        items: cartItems.map(item => ({
          product_id: item.pro_id || item.id,
          pro_id: item.pro_id || item.id,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          discount: parseFloat(item.discount) || 0
        })),
        payment_method: 'Telegram/Cash',
        user_id: user?.id || null
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
          <div className="checkout-badge">
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

        <div className="checkout-card">
          {/* Section 1: Customer Delivery Info */}
          <div className="checkout-info-card">
            <div className="info-card-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>ព័ត៌មានអ្នកទទួល & ទីតាំងដឹកជញ្ជូន</span>
            </div>
            <div className="info-card-grid">
              <div className="info-item">
                <span className="info-label">ឈ្មោះអ្នកទទួល:</span>
                <span className="info-value">{user?.name || user?.email?.split('@')[0] || 'អតិថិជន'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">លេខទូរស័ព្ទ:</span>
                <span className="info-value">{user?.phone || '012 345 678'}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">អាសយដ្ឋានដឹក:</span>
                <span className="info-value">{user?.address || 'រាជធានីភ្នំពេញ, កម្ពុជា'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Order Summary */}
          <div className="order-summary-box">
            <div className="summary-box-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.24-1.2A1 1 0 005.06 1H3z" />
              </svg>
              <h2>សង្ខេបបញ្ជីមុខទំនិញ</h2>
            </div>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div className="summary-item" key={item.id}>
                  <div className="item-info">
                    <span className="item-qty-badge">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div className="item-price-block">
                    <span className="price-usd">${(item.price * item.quantity).toFixed(2)}</span>
                    <span className="price-eq"> = </span>
                    <span className="price-khr">({formatKHR(item.price * item.quantity)})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="summary-totals">
              <div className="summary-row">
                <span className="row-label">តម្លៃសរុបរង</span>
                <span className="row-value">
                  <span className="price-usd">${subtotal.toFixed(2)}</span>
                  <span className="price-eq"> = </span>
                  <span className="price-khr">({formatKHR(subtotal)})</span>
                </span>
              </div>

              <div className="summary-row">
                <span className="row-label">ថ្លៃដឹកជញ្ជូន</span>
                <span className="row-value">
                  {shipping === 0 ? (
                    <span className="free-shipping">ឥតគិតថ្លៃ (Free)</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span className="row-label">បញ្ចុះតម្លៃ</span>
                  <span className="row-value" style={{ color: '#2ec4b6' }}>-${discount.toFixed(2)}</span>
                </div>
              )}

              {/* Grand Total Bar */}
              <div className="summary-grand-total">
                <div className="total-label-box">
                  <span className="total-label">តម្លៃសរុបចុងក្រោយ</span>
                  <span className="total-hint">(រួមបញ្ចូលទាំងថ្លៃដឹក)</span>
                </div>
                <div className="total-price-box">
                  <span className="grand-usd">${total.toFixed(2)}</span>
                  <span className="price-eq"> = </span>
                  <span className="grand-khr">({formatKHR(total)})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Action Buttons */}
          <div className="checkout-actions">
            <button
              className="place-order-btn"
              onClick={handleSubmitOrder}
              disabled={loading}
            >
              {loading ? (
                <span>កំពុងដំណើរការបញ្ជាទិញ...</span>
              ) : (
                <>
                  <span>បញ្ជាក់ការបញ្ជាទិញឥឡូវនេះ</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.05-.18-.06-.05-.15-.03-.21-.02-.1.02-1.5.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.2.14.28-.01.07.01.23-.01.35z"/>
                  </svg>
                </>
              )}
            </button>

            <button
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>ត្រឡប់ទៅកន្ត្រកទំនិញ</span>
            </button>
          </div>

          {/* Section 4: Security Note */}
          <div className="checkout-note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="info-icon" width="20" height="20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <p>
              តាមរយៈការចុចបញ្ជាក់ការបញ្ជាទិញ ព័ត៌មានទំនិញនឹងត្រូវបញ្ជូនទៅកាន់ប្រព័ន្ធ Telegram របស់ហាង DeliciousEats ដោយស្វ័យប្រវត្តិ។
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
