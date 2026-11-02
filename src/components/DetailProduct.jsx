import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { formatKHR } from '../utils/currency';
import { API_BASE_URL } from '../config/api';
import { KhmerDivider, KhmerAngkorCrest } from './KhmerOrnament';
import './styles/DetailProduct.css';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
          setProduct(result.data);
          fetchRelatedProducts(result.data.category.cat_id);
        } else {
          throw new Error('ទិន្នន័យមិនត្រឹមត្រូវ');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };

    const fetchRelatedProducts = async (categoryId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?category=${categoryId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
          const filtered = result.data
            .filter((item) => item.pro_id !== parseInt(id))
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (id) {
      fetchProductDetail();
    }

    window.scrollTo(0, 0);
  }, [id]);

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || !discount) return price;
    const originalPrice = parseFloat(price);
    const discountPercent = parseFloat(discount);
    const discountAmount = originalPrice * (discountPercent / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && product && newQuantity <= product.qty) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && product.qty > 0) {
      addToCart(product, quantity);

      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.textContent = `បានបន្ថែម "${product.pro_name}" (${quantity}) ទៅកន្ត្រកទំនិញ!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 300);
        }, 2200);
      }, 100);
    }
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setQuantity(1);
    setActiveImage(0);
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-loading-spinner"></div>
        <p>កំពុងផ្ទុកព័ត៌មានមុខទំនិញ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <h3>មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យ</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/products')}>ត្រឡប់ទៅកាន់មុខទំនិញទាំងអស់</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-error">
        <h3>រកមិនឃើញមុខទំនិញនេះទេ</h3>
        <p>សូមអភ័យទោស មុខទំនិញដែលអ្នកកំពុងស្វែងរកមិនមាននៅក្នុងប្រព័ន្ធឡើយ។</p>
        <button onClick={() => navigate('/products')}>ត្រឡប់ទៅកាន់មុខទំនិញទាំងអស់</button>
      </div>
    );
  }

  const defaultImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
  const mainImgUrl = product.image
    ? (product.image.startsWith('http')
      ? product.image
      : `${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`)
    : defaultImg;

  const productImages = [mainImgUrl, mainImgUrl, mainImgUrl];

  const catName = product.category?.cat_name || 'ទូទៅ';
  const isFresh = catName.includes('ស្រស់') || catName.toLowerCase().includes('fresh');
  const isCooked = catName.includes('ចំអិន') || catName.toLowerCase().includes('cooked');

  const finalPrice = parseFloat(product.discount) > 0
    ? calculateDiscountedPrice(product.price, product.discount)
    : product.price;

  return (
    <section className="detail-section khmer-bg-watermark">
      <div className="detail-grid-overlay"></div>
      <div className="detail-glow-orb detail-glow-1"></div>
      <div className="detail-glow-orb detail-glow-2"></div>

      <div className="detail-container">
        <div className="detail-breadcrumb">
          <button onClick={() => navigate('/products')} className="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="back-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            ត្រឡប់ទៅមុខទំនិញទាំងអស់
          </button>
          <div className="breadcrumb-trail">
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>ទំព័រដើម</span>
            <span className="breadcrumb-separator">/</span>
            <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>មុខទំនិញ</span>
            <span className="breadcrumb-separator">/</span>
            <span>{catName}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{product.pro_name}</span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-gallery">
            <div className="detail-main-image-container">
              {parseFloat(product.discount) > 0 && (
                <div className="detail-badge discount-badge">{product.discount}% OFF</div>
              )}
              <div className="detail-main-image">
                <img
                  src={productImages[activeImage]}
                  alt={product.pro_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImg;
                  }}
                />
                <div className="image-glow"></div>
              </div>
            </div>

            <div className="detail-thumbnails">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`detail-thumbnail ${activeImage === index ? 'active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.pro_name} - view ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImg;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <div className="detail-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <KhmerAngkorCrest size={16} />
                <span>{isFresh ? '🌿 អាហារស្រស់ៗ' : isCooked ? '🍳 អាហារចំអិនផ្ទាល់' : catName}</span>
              </div>
              <h1 className="detail-title">{product.pro_name}</h1>

              <div className="detail-meta">
                <div className="detail-id">កូដទំនិញ: #{product.pro_id}</div>
                <div className="detail-stock">
                  {product.qty > 0 ? (
                    <span className="in-stock">✓ មានក្នុងស្តុក ({product.qty} ចំណែក)</span>
                  ) : (
                    <span className="out-of-stock">អស់ពីស្តុក</span>
                  )}
                </div>
              </div>

              <div className="detail-price-container">
                {parseFloat(product.discount) > 0 ? (
                  <>
                    <div className="detail-price-original">${parseFloat(product.price).toFixed(2)}</div>
                    <div className="detail-price discounted">
                      ${calculateDiscountedPrice(product.price, product.discount)}
                      <span className="price-riel-detail" style={{ color: '#f59e0b', fontSize: '1.05rem', marginLeft: '0.6rem', fontWeight: 600 }}>
                        (~{formatKHR(finalPrice)})
                      </span>
                      <span className="price-save">
                        ចំណេញ: ${(parseFloat(product.price) - parseFloat(calculateDiscountedPrice(product.price, product.discount))).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="detail-price">
                    ${parseFloat(product.price).toFixed(2)}
                    <span className="price-riel-detail" style={{ color: '#f59e0b', fontSize: '1.05rem', marginLeft: '0.6rem', fontWeight: 600 }}>
                      (~{formatKHR(finalPrice)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-description">
              <h3 className="description-title">ការពិពណ៌នាអំពីមុខទំនិញ</h3>
              <p className="description-text">
                {product.description ||
                  'មុខម្ហូបឆ្ងាញ់ប្រចាំហាង DeliciousEats ចម្អិនឡើងពីគ្រឿងផ្សំស្រស់ធម្មជាតិ ១០០% មានអនាម័យខ្ពស់ រសជាតិខ្មែរពិតៗ និងដឹកជញ្ជូនរហ័សទាន់ចិត្តដល់គេហដ្ឋាន។'}
              </p>
            </div>

            <div className="detail-features">
              <h3 className="features-title">គុណសម្បត្តិពិសេស & ស្តង់ដារ</h3>
              <ul className="features-list">
                <li className="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  គ្រឿងផ្សំស្រស់ធម្មជាតិ ១០០%
                </li>
                <li className="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  រសជាតិខ្មែរដើម អនាម័យខ្ពស់
                </li>
                <li className="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ដឹកជញ្ជូនរហ័ស (១៥-៣០ នាទី)
                </li>
                <li className="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  អាចបញ្ជាក់កម្រិតហិរ/ផ្អែមតាមចំណូលចិត្ត
                </li>
              </ul>
            </div>

            <div className="detail-actions">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!product.qty || quantity >= product.qty}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={!product.qty || product.qty <= 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                បន្ថែមទៅកន្ត្រក
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="related-title">មុខម្ហូប & អាហារស្រស់ៗដែលពាក់ព័ន្ធ</h2>
            <KhmerDivider />
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <div
                  className="related-product-card"
                  key={relatedProduct.pro_id}
                  onClick={() => handleRelatedProductClick(relatedProduct.pro_id)}
                >
                  <div className="related-image">
                    <img
                      src={
                        relatedProduct.image
                          ? (relatedProduct.image.startsWith('http')
                            ? relatedProduct.image
                            : `${API_BASE_URL}${relatedProduct.image.startsWith('/') ? '' : '/'}${relatedProduct.image}`)
                          : defaultImg
                      }
                      alt={relatedProduct.pro_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImg;
                      }}
                    />
                  </div>
                  <div className="related-info">
                    <h3 className="related-name">{relatedProduct.pro_name}</h3>
                    <div className="related-price">
                      {parseFloat(relatedProduct.discount) > 0 ? (
                        <>
                          ${calculateDiscountedPrice(relatedProduct.price, relatedProduct.discount)}
                          <span style={{ fontSize: '0.8rem', color: '#f59e0b', marginLeft: '0.4rem' }}>
                            ({formatKHR(calculateDiscountedPrice(relatedProduct.price, relatedProduct.discount))})
                          </span>
                        </>
                      ) : (
                        <>
                          ${parseFloat(relatedProduct.price).toFixed(2)}
                          <span style={{ fontSize: '0.8rem', color: '#f59e0b', marginLeft: '0.4rem' }}>
                            ({formatKHR(relatedProduct.price)})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="related-hover">មើលលម្អិត ➔</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailProduct;
