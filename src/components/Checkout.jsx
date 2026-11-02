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

  // Payment method: 'khqr' or 'cash'
  const [paymentMethod, setPaymentMethod] = useState('khqr');
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);

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

  // Handle Slip File Selection
  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
  };

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
      // 1. Upload payment slip to ImgBB if attached
      let paymentProofUrl = null;
      if (slipFile && paymentMethod === 'khqr') {
        try {
          const formData = new FormData();
          formData.append('image', slipFile);
          const imgbbRes = await fetch('https://api.imgbb.com/1/upload?key=b15ed70ff4627048a2b01133f687a336', {
            method: 'POST',
            body: formData
          });
          const imgbbData = await imgbbRes.json();
          if (imgbbData?.data?.url) {
            paymentProofUrl = imgbbData.data.url;
          }
        } catch (imgbbErr) {
          console.warn('Slip upload skipped:', imgbbErr);
        }
      }

      // 2. Prepare Order Data
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
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          discount: parseFloat(item.discount) || 0
        })),
        payment_method: paymentMethod,
        payment_proof: paymentProofUrl,
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

      if (response.ok && (data.status === 'success' || data.success)) {
        setOrderId(data.order_id || data.order?.id);
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
              ព័ត៌មាននៃការបញ្ជាទិញត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធ Telegram របស់ហាងរួចរាល់ហើយ។ ក្រុមការងារយើងនឹងទាក់ទងរៀបចំដឹកជញ្ជូនជូនអ្នកភ្លាមៗ។
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
            សូមពិនិត្យព័ត៌មានមុខទំនិញ និងជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់របស់អ្នក
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

          {/* Section 3: Payment Method Selection (KHQR / Cash) */}
          <div className="payment-method-box">
            <div className="payment-box-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <h2>ជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់</h2>
            </div>

            <div className="payment-options-grid">
              {/* Option 1: KHQR */}
              <div 
                className={`payment-option-card ${paymentMethod === 'khqr' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('khqr')}
              >
                <div className="payment-radio">
                  <span className={`radio-dot ${paymentMethod === 'khqr' ? 'checked' : ''}`}></span>
                </div>
                <div className="payment-info">
                  <div className="payment-title-row">
                    <span className="payment-title">ស្កេនទូទាត់តាម KHQR</span>
                    <span className="khqr-badge">KHQR</span>
                  </div>
                  <p className="payment-desc">គាំទ្រគ្រប់ធនាគារ៖ ABA, Bakong, Wing, ACLEDA, Canadia...</p>
                </div>
              </div>

              {/* Option 2: Cash on Delivery */}
              <div 
                className={`payment-option-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="payment-radio">
                  <span className={`radio-dot ${paymentMethod === 'cash' ? 'checked' : ''}`}></span>
                </div>
                <div className="payment-info">
                  <div className="payment-title-row">
                    <span className="payment-title">ទូទាត់ជាសាច់ប្រាក់ (COD)</span>
                    <span className="cash-badge">លុយសុទ្ធ</span>
                  </div>
                  <p className="payment-desc">ទូទាត់ជាសាច់ប្រាក់សុទ្ធ ឬស្កេន QR ពេលអ្នកដឹកជញ្ជូនទៅដល់</p>
                </div>
              </div>
            </div>

            {/* KHQR Card Details when KHQR is selected */}
            {paymentMethod === 'khqr' && (
              <div className="khqr-card-container">
                <div className="khqr-card">
                  <div className="khqr-card-top">
                    <div className="khqr-brand-logo">KHQR</div>
                    <div className="khqr-bakong-tag">Bakong</div>
                  </div>

                  <div className="khqr-merchant-info">
                    <div className="merchant-title">DELICIOUS EATS SHOP</div>
                    <div className="merchant-location">Phnom Penh, Cambodia</div>
                  </div>

                  <div className="khqr-price-badge">
                    <span className="khqr-usd">${total.toFixed(2)}</span>
                    <span className="khqr-sep">≈</span>
                    <span className="khqr-khr">{formatKHR(total)}</span>
                  </div>

                  <div className="khqr-qr-frame">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://bakong.nbc.org.kh/pay?amount=${total.toFixed(2)}&currency=USD&merchant=DeliciousEatsShop`} 
                      alt="Bakong KHQR Code"
                      className="khqr-qr-image"
                    />
                    <div className="khqr-scan-guide">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                      </svg>
                      <span>ស្កេនជាមួយ Mobile Banking ណាក៏បាន</span>
                    </div>
                  </div>

                  <div className="khqr-banks-support">
                    <span>ABA</span>
                    <span>Bakong</span>
                    <span>Wing</span>
                    <span>ACLEDA</span>
                    <span>Canadia</span>
                  </div>

                  {/* Slip Upload Box */}
                  <div className="khqr-slip-box">
                    <label className="slip-upload-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      <span>{slipFile ? 'ប្ដូររូបវិក្កយបត្រ' : 'ភ្ជាប់រូបវិក្កយបត្រ (បើបានបង់រួច)'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleSlipChange} 
                        style={{ display: 'none' }} 
                      />
                    </label>

                    {slipPreview && (
                      <div className="slip-preview-item">
                        <img src={slipPreview} alt="Receipt preview" className="slip-img" />
                        <span className="slip-status">✓ បានភ្ជាប់រួចរាល់</span>
                        <button type="button" onClick={handleRemoveSlip} className="slip-remove">លុបចេញ</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Action Buttons */}
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
                  <span>
                    {paymentMethod === 'khqr' 
                      ? (slipFile ? 'បញ្ជាក់ការបញ្ជាទិញ (បានភ្ជាប់វិក្កយបត្រ)' : 'បញ្ជាក់ការបញ្ជាទិញ (បង់តាម KHQR)') 
                      : 'បញ្ជាក់ការបញ្ជាទិញ (ទូទាត់ពេលដឹក)'}
                  </span>
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

          {/* Section 5: Security Note */}
          <div className="checkout-note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="info-icon" width="20" height="20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <p>
              តាមរយៈការចុចបញ្ជាក់ការបញ្ជាទិញ ព័ត៌មានទំនិញ {slipFile ? 'និងរូបវិក្កយបត្រ ' : ''}នឹងត្រូវបញ្ជូនទៅកាន់ប្រព័ន្ធ Telegram របស់ហាង DeliciousEats ដោយស្វ័យប្រវត្តិ។
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
