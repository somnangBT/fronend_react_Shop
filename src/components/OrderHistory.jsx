import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL as API_URL } from '../config/api';
import "./styles/OrderHistory.css";

const OrderHistory = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Get active user from context or storage
  const currentUser = authUser || (() => {
    try {
      const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    const userId = currentUser?.id || '';
    const userEmail = currentUser?.email || '';
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (userEmail) params.append('email', userEmail);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const headers = { 'Accept': 'application/json' };

    if (currentUser?.token && currentUser.token !== 'token_placeholder') {
      headers['Authorization'] = `Bearer ${currentUser.token}`;
    }

    try {
      const response = await fetch(`${API_URL}/api/orders${queryStr}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        const ordersArray = Array.isArray(result.data)
          ? result.data
          : (result.data?.data && Array.isArray(result.data.data) ? result.data.data : []);
        setOrders(ordersArray);
      } else {
        throw new Error(result.message || 'Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('មិនអាចទាញយកប្រវត្តិបញ្ជាទិញបានទេ។ សូមព្យាយាមម្តងទៀត។ (Failed to load orders)');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ថ្មីៗនេះ';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('តើអ្នកពិតជាចង់បោះបង់ការបញ្ជាទិញ #' + orderId + ' នេះមែនទេ? (Are you sure you want to cancel this order?)')) {
      return;
    }

    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (currentUser?.token && currentUser.token !== 'token_placeholder') {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        showNotification('បានបោះបង់ការបញ្ជាទិញជោគជ័យ! (Order cancelled)', 'success');
      } else {
        throw new Error(result.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      showNotification(err.message || 'មិនអាចបោះបង់ការបញ្ជាទិញបានទេ', 'error');
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `order-notification ${type}`;
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { label: '⏳ កំពុងរង់ចាំ (Pending)', cls: 'status-pending' };
      case 'preparing':
        return { label: '🍳 កំពុងចម្អិន (Preparing)', cls: 'status-processing' };
      case 'delivering':
        return { label: '🛵 កំពុងដឹកជញ្ជូន (Delivering)', cls: 'status-processing' };
      case 'completed':
        return { label: '✅ បានបញ្ចប់ (Completed)', cls: 'status-completed' };
      case 'cancelled':
        return { label: '❌ បានបោះបង់ (Cancelled)', cls: 'status-cancelled' };
      default:
        return { label: status || 'Pending', cls: 'status-pending' };
    }
  };

  return (
    <section className="order-history-section">
      <div className="order-history-grid-overlay"></div>
      <div className="order-history-glow-orb order-history-glow-1"></div>
      <div className="order-history-glow-orb order-history-glow-2"></div>

      <div className="order-history-container">
        <div className="order-history-header">
          <div className="order-history-badge">🛍️ ប្រវត្តិការទិញទំនិញ & ម្ហូបអាហារ</div>
          <h1 className="order-history-title">ប្រវត្តិការបញ្ជាទិញ (Your Orders)</h1>
          <p className="order-history-subtitle">
            តាមដាន ពិនិត្យមើល និងគ្រប់គ្រងរាល់ការកុម្ម៉ង់ទិញទំនិញរបស់អ្នកនៅ DeliciousEats
          </p>
        </div>

        {error && (
          <div className="order-history-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="order-history-loading">
            <div className="loading-spinner"></div>
            <p>កំពុងទាញយកប្រវត្តិការបញ្ជាទិញ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h2>មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</h2>
            <p>អ្នកមិនទាន់បានធ្វើការកុម្ម៉ង់ទិញអ្វីនៅឡើយទេ។ សូមចាប់ផ្តើមជ្រើសរើសអាហារស្រស់ៗ និងមុខម្ហូបឆ្ងាញ់ៗឥឡូវនេះ!</p>
            <button
              className="start-shopping-btn"
              onClick={() => navigate('/products')}
            >
              <span>ទៅកាន់បញ្ជីមុខម្ហូប (Start Shopping)</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const itemsCount = order.items?.length || 0;

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div className="order-id-date">
                      <div className="order-number">
                        <span className="order-tag">វិក្កយបត្រ</span> #{order.id}
                      </div>
                      <div className="order-date">កាលបរិច្ឆេទ៖ {formatDate(order.created_at)}</div>
                    </div>
                    <div className="order-status-actions">
                      <div className={`order-status ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </div>
                      {order.status === 'pending' && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => handleCancelOrder(order.id)}
                          title="បោះបង់ការបញ្ជាទិញនេះ"
                        >
                          បោះបង់
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="order-total-info">
                      <div className="order-total">
                        <span>សរុបទឹកប្រាក់៖</span> ${parseFloat(order.total || 0).toFixed(2)}
                      </div>
                      <div className="order-items-badge">
                        📦 {itemsCount} មុខទំនិញ • {order.payment_method === 'bakong_aba' ? 'Bakong / ABA' : order.payment_method?.toUpperCase()}
                      </div>
                    </div>
                    <button
                      className="toggle-details-btn"
                      onClick={() => toggleOrderDetails(order.id)}
                      aria-expanded={expandedOrderId === order.id}
                    >
                      {expandedOrderId === order.id ? 'លាក់ព័ត៌មានលម្អិត' : 'មើលព័ត៌មានលម្អិត'}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={expandedOrderId === order.id ? "rotate-180" : ""}>
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="order-details">
                      {/* Items List */}
                      <div className="order-items">
                        <h3 className="items-title">ទំនិញដែលបានទិញ (Order Items)</h3>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div className="order-item" key={item.id || idx}>
                              <div className="item-main-info">
                                {item.image && (
                                  <img
                                    src={item.image.startsWith('http') ? item.image : `${API_URL}/${item.image.replace(/^\//, '')}`}
                                    alt={item.product_name}
                                    className="item-thumbnail"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                                <div className="item-text-info">
                                  <span className="item-name">{item.product_name}</span>
                                  <span className="item-quantity">ចំនួន៖ {item.quantity}</span>
                                </div>
                              </div>
                              <div className="item-price">
                                ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-items-text">មិនមានទិន្នន័យមុខទំនិញលម្អិត</div>
                        )}
                      </div>

                      {/* Delivery and Cost Breakdown */}
                      <div className="order-cost-breakdown">
                        <h3 className="breakdown-title">ព័ត៌មានទូទាត់ & ដឹកជញ្ជូន</h3>
                        <div className="cost-row">
                          <span>តម្លៃទំនិញសរុប (Subtotal)</span>
                          <span>${parseFloat(order.subtotal || order.total || 0).toFixed(2)}</span>
                        </div>
                        <div className="cost-row">
                          <span>ថ្លៃដឹកជញ្ជូន (Shipping)</span>
                          <span>${parseFloat(order.shipping || 0).toFixed(2)}</span>
                        </div>
                        {parseFloat(order.tax || 0) > 0 && (
                          <div className="cost-row">
                            <span>ពន្ធ (Tax 10%)</span>
                            <span>${parseFloat(order.tax).toFixed(2)}</span>
                          </div>
                        )}
                        {parseFloat(order.discount || 0) > 0 && (
                          <div className="cost-row discount">
                            <span>បញ្ចុះតម្លៃ (Discount)</span>
                            <span>-${parseFloat(order.discount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="cost-row total">
                          <span>សរុបចុងក្រោយ (Total)</span>
                          <span>${parseFloat(order.total || 0).toFixed(2)}</span>
                        </div>

                        {order.shipping_address && (
                          <div className="order-shipping-meta">
                            <span className="meta-label">📍 អាសយដ្ឋានដឹកជញ្ជូន៖</span>
                            <span className="meta-value">{order.shipping_address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderHistory;
