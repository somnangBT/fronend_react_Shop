import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../CartContext";
import { KhmerDivider, KhmerCorner, KhmerFrieze, KhmerPediment, KhmerPhkaChan, KhmerTevada } from "./KhmerOrnament";
import { formatKHR } from "../utils/currency";
import { API_BASE_URL as API_URL } from "../config/api";
import "./styles/CardProduct.css";

const CardProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(location.search).get("q") || "");
  const [categories, setCategories] = useState(["all"]);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        const categoryNames = ["all", ...result.data.map((cat) => cat.cat_name)];
        setCategories(categoryNames);
      } else if (Array.isArray(result)) {
        const categoryNames = ["all", ...result.map((cat) => cat.cat_name)];
        setCategories(categoryNames);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        throw new Error("Invalid data format received");
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Handle URL query parameters (?category=... and ?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    const qParam = params.get("q");
    if (catParam) {
      setActiveCategory(catParam);
    }
    if (qParam !== null) {
      setSearchTerm(qParam);
    } else if (location.pathname === "/products") {
      setSearchTerm("");
    }
  }, [location.search, location.pathname]);

  // Listen to custom 'filter-category' event dispatched from Hero or Navbar
  useEffect(() => {
    const handleCustomFilter = (e) => {
      const keyword = e.detail;
      if (!keyword) return;
      if (keyword === "all") {
        setActiveCategory("all");
        return;
      }

      const target = categories.find((c) =>
        c.toLowerCase().includes(keyword.toLowerCase())
      );
      setActiveCategory(target || keyword);
    };

    window.addEventListener("filter-category", handleCustomFilter);
    return () => {
      window.removeEventListener("filter-category", handleCustomFilter);
    };
  }, [categories]);

  // Instant auto-filter products by typed search text (name, code, price, category) and category pill
  const filteredProducts = useMemo(() => {
    const searchQ = searchTerm.trim().toLowerCase();

    let list = products;

    if (searchQ) {
      list = list.filter(
        (p) =>
          p.pro_name?.toLowerCase().includes(searchQ) ||
          p.pro_code?.toLowerCase().includes(searchQ) ||
          p.description?.toLowerCase().includes(searchQ) ||
          p.category?.cat_name?.toLowerCase().includes(searchQ) ||
          String(p.price ?? "").toLowerCase().includes(searchQ)
      );
    }

    if (activeCategory === "all") return list;

    const actLower = activeCategory.toLowerCase();
    return list.filter(({ category }) => {
      if (!category?.cat_name) return false;
      const catLower = category.cat_name.toLowerCase();
      return (
        catLower === actLower ||
        catLower.includes(actLower) ||
        actLower.includes(catLower)
      );
    });
  }, [products, activeCategory, searchTerm]);

  const calculateDiscountedPrice = (price, discount) => {
    const originalPrice = parseFloat(price);
    const discountPercent = parseFloat(discount);
    if (isNaN(originalPrice) || isNaN(discountPercent)) return price;
    const discountAmount = originalPrice * (discountPercent / 100);
    return (originalPrice - discountAmount).toFixed(2);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  const handleViewDetails = (productId) => {
    const productCard = document.querySelector(
      `.product-card[data-id="${productId}"]`
    );
    if (productCard) {
      productCard.classList.add("card-clicked");
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 250);
    } else {
      navigate(`/products/${productId}`);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product || product.qty <= 0) return;

    addToCart(product, 1);

    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = `បានបន្ថែម "${product.pro_name}" ទៅកន្ត្រក!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 2200);
    }, 100);
  };

  const getCategoryLabel = (cat) => {
    if (cat === "all") return "✨ ទាំងអស់ (All)";
    return cat;
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>កំពុងទាញយកបញ្ជីមុខទំនិញ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <h3>មានបញ្ហាក្នុងការទាញយកទិន្នន័យ</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>ព្យាយាមម្តងទៀត</button>
      </div>
    );
  }

  return (
    <section className="products-section khmer-bg-watermark" id="products">
      <KhmerFrieze />
      <div className="products-container">
        {/* Section Header */}
        <div className="products-header">
          <KhmerPediment width={360} />
          <div className="products-sub-badge-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
            <div className="products-sub-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <KhmerTevada size={22} />
              <KhmerPhkaChan size={15} />
              <span>🛍️ ហាងលក់ទំនិញគ្រប់មុខ • គុណភាពខ្ពស់ • តម្លៃសមរម្យ</span>
              <KhmerPhkaChan size={15} />
            </div>
          </div>
          <h2 className="products-title">បញ្ជីមុខទំនិញទាំងអស់ (All Products)</h2>
          <KhmerDivider />
          <p className="products-description">
            ជ្រើសរើសទំនិញគ្រប់ប្រភេទតាមតម្រូវការរបស់អ្នក គុណភាពខ្ពស់ តម្លៃសមរម្យ ទូទាត់ងាយស្រួលតាម Bakong KHQR / ABA និងដឹកជញ្ជូនរហ័សដល់ទីតាំង។
          </p>
        </div>

        {/* Instant Auto-Search Box (0ms client filter) */}
        <div style={{ maxWidth: '480px', margin: '0 auto 1.25rem', position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 វាយឈ្មោះ លេខកូដ ឬតម្លៃទំនិញ... (ស្វែងរកអូតូភ្លាមៗ)"
            aria-label="ស្វែងរកទំនិញ"
            style={{
              width: '100%',
              padding: '12px 42px 12px 18px',
              borderRadius: '999px',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#f8fafc',
              fontSize: '0.94rem',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                if (new URLSearchParams(location.search).get("q")) {
                  navigate("/products", { replace: true });
                }
              }}
              title="សម្អាតការស្វែងរក"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.14)',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                cursor: 'pointer',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <p>មិនមានមុខទំនិញត្រូវតាមការស្វែងរកនេះទេ</p>
            <button
              className="category-btn active"
              onClick={() => {
                setActiveCategory("all");
                setSearchTerm("");
                if (location.search) navigate("/products", { replace: true });
              }}
            >
              បង្ហាញទាំងអស់
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const catName = product.category?.cat_name || "ទំនិញ";

              return (
                <div
                  className="product-card"
                  key={product.pro_id}
                  data-id={product.pro_id}
                  onClick={() => handleViewDetails(product.pro_id)}
                >
                  <KhmerCorner position="top-right" />
                  {/* Category Pill Tag */}
                  <div className="product-type-pill">
                    {catName}
                  </div>

                  {parseFloat(product.discount) > 0 && (
                    <div className="product-badge discount-badge">
                      {product.discount}% OFF
                    </div>
                  )}

                  {product.qty > 0 && product.qty < 10 && (
                    <div className="product-badge limited-badge">នៅសល់តិច</div>
                  )}

                  {product.qty >= 50 && (
                    <div className="product-badge bestseller-badge">🔥 ដាច់ខ្លាំង</div>
                  )}

                  <div className="product-image-wrapper">
                    <div className="product-image">
                      <img
                        src={
                          product.image
                            ? product.image.startsWith("http")
                              ? product.image
                              : `${API_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
                            : "/logo512.png"
                        }
                        alt={product.pro_name || "Product Image"}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/logo512.png";
                        }}
                      />
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-category">
                      {catName || "Uncategorized"}
                    </div>
                    <h3 className="product-name">{product.pro_name}</h3>
                    {product.description && (
                      <p className="product-short-desc">
                        {product.description.length > 70
                          ? product.description.substring(0, 70) + "..."
                          : product.description}
                      </p>
                    )}

                    <div className="product-price-row">
                      {parseFloat(product.discount) > 0 ? (
                        <>
                          <div className="product-price discounted-price">
                            ${calculateDiscountedPrice(product.price, product.discount)}
                          </div>
                          <div className="product-price-original">
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div className="product-price">
                          ${parseFloat(product.price).toFixed(2)}
                        </div>
                      )}
                      <span className="product-price-riel">
                        ({formatKHR(parseFloat(product.discount) > 0 ? calculateDiscountedPrice(product.price, product.discount) : product.price)})
                      </span>
                    </div>
                  </div>

                  <div className="product-action-row">
                    <div className="product-quantity">
                      {product.qty > 0 ? (
                        <span className="in-stock">✓ មានក្នុងស្តុក ({product.qty})</span>
                      ) : (
                        <span className="out-of-stock">អស់ពីស្តុក</span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      disabled={product.qty <= 0}
                      onClick={(e) => handleAddToCart(e, product)}
                      title="បន្ថែមទៅកន្ត្រក"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="cart-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>

                  <div className="product-details-action">
                    <div className="view-details">មើលលម្អិត (View Details) →</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CardProduct;
