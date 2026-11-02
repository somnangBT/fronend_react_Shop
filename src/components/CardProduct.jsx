import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { KhmerDivider, KhmerCorner, KhmerFrieze, KhmerPediment, KhmerPhkaChan, KhmerTevada } from "./KhmerOrnament";
import { formatKHR } from "../utils/currency";
import { API_BASE_URL as API_URL } from "../config/api";
import "./styles/CardProduct.css";

const CardProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
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

  // Handle URL query parameters (?category=fresh or ?category=cooked or ?q=search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get("category");
    if (catParam) {
      const lower = catParam.toLowerCase();
      if (lower.includes("fresh") || lower.includes("ស្រស់")) {
        setActiveCategory("អាហារស្រស់ៗ (Fresh Food)");
      } else if (lower.includes("cooked") || lower.includes("ចំអិន")) {
        setActiveCategory("អាហារចំអិនផ្ទាល់ (Cooked Fresh)");
      } else {
        setActiveCategory(catParam);
      }
    }
  }, [location.search]);

  // Listen to custom 'filter-category' event dispatched from Hero or Navbar
  useEffect(() => {
    const handleCustomFilter = (e) => {
      const keyword = e.detail;
      if (!keyword) return;

      const target = categories.find((c) =>
        c.toLowerCase().includes(keyword.toLowerCase())
      );
      if (target) {
        setActiveCategory(target);
      } else {
        setActiveCategory(keyword);
      }
    };

    window.addEventListener("filter-category", handleCustomFilter);
    return () => {
      window.removeEventListener("filter-category", handleCustomFilter);
    };
  }, [categories]);

  // Filter products by active category or search query
  const filteredProducts = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const searchQ = params.get("q")?.toLowerCase();

    let list = products;

    if (searchQ) {
      list = list.filter(
        (p) =>
          p.pro_name?.toLowerCase().includes(searchQ) ||
          p.description?.toLowerCase().includes(searchQ) ||
          p.category?.cat_name?.toLowerCase().includes(searchQ)
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
  }, [products, activeCategory, location.search]);

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
    if (cat.includes("ស្រស់") || cat.toLowerCase().includes("fresh food")) {
      return "🌿 អាហារស្រស់ៗ (Fresh Food)";
    }
    if (cat.includes("ចំអិន") || cat.toLowerCase().includes("cooked")) {
      return "🍳 អាហារចំអិនផ្ទាល់ (Cooked Fresh)";
    }
    if (cat.includes("ភេសជ្ជៈ") || cat.toLowerCase().includes("drink")) {
      return "🥤 ភេសជ្ជៈ & បង្អែម (Drinks)";
    }
    return cat;
  };

  const isCategorySelected = (keyword) => {
    return activeCategory.toLowerCase().includes(keyword.toLowerCase());
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>កំពុងទាញយកមុខម្ហូប & អាហារស្រស់ៗ...</p>
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
              <span>ម្ហូបខ្មែរឆ្ងាញ់ៗ & អាហារស្រស់ៗធម្មជាតិ • អបអរសាទរចូលឆ្នាំថ្មី</span>
              <KhmerPhkaChan size={15} />
            </div>
          </div>
          <h2 className="products-title">បញ្ជីមុខម្ហូប & អាហារស្រស់ៗ</h2>
          <KhmerDivider />
          <p className="products-description">
            សូមជ្រើសរើសអាហារស្រស់ៗធម្មជាតិ 100% សម្រាប់ចម្អិនខ្លួនឯង ឬមុខម្ហូបចំអិនផ្ទាល់ក្តៅៗភ្លាមៗឈ្ងុយឆ្ងាញ់ មានអនាម័យខ្ពស់ ដឹកជញ្ជូនរហ័សដល់គេហដ្ឋាន។
          </p>
        </div>

        {/* ========================================================
            FEATURED SPOTLIGHT BANNERS (អាហារស្រស់ៗ vs អាហារចំអិនផ្ទាល់)
            ======================================================== */}
        <div className="food-spotlight-container">
          {/* Spotlight Card 1: អាហារស្រស់ៗ */}
          <div
            className={`food-spotlight-card fresh-card ${
              isCategorySelected("ស្រស់") ? "spotlight-active" : ""
            }`}
            onClick={() => {
              const freshCat = categories.find((c) => c.includes("ស្រស់")) || "អាហារស្រស់ៗ (Fresh Food)";
              setActiveCategory(freshCat);
            }}
          >
            <KhmerCorner position="top-left" />
            <KhmerCorner position="bottom-right" />
            <div className="spotlight-badge fresh-tag">🌿 ស្រស់ធម្មជាតិ ១០០%</div>
            <div className="spotlight-image-holder">
              <img
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80"
                alt="Fresh Food"
              />
              <div className="spotlight-gradient-overlay fresh-grad"></div>
            </div>
            <div className="spotlight-content">
              <h3 className="spotlight-title">🌿 អាហារស្រស់ៗ (Fresh Food)</h3>
              <p className="spotlight-desc">
                ត្រីសាល់ម៉ុនន័រវេសស្រស់ សាច់គោ Wagyu បង្គាសមុទ្រ និងបន្លែសរីរាង្គកាត់ស្រស់ៗរាល់ព្រឹក គុណភាពខ្ពស់ គ្មានជាតិគីមី។
              </p>
              <div className="spotlight-action">
                <span className="spotlight-btn-text">
                  {isCategorySelected("ស្រស់") ? "✓ កំពុងបង្ហាញ" : "មើលមុខទំនិញស្រស់ៗ →"}
                </span>
                <span className="spotlight-count">
                  {products.filter((p) => p.category?.cat_name?.includes("ស្រស់")).length} មុខទំនិញ
                </span>
              </div>
            </div>
          </div>

          {/* Spotlight Card 2: អាហារចំអិនផ្ទាល់ */}
          <div
            className={`food-spotlight-card cooked-card ${
              isCategorySelected("ចំអិន") ? "spotlight-active" : ""
            }`}
            onClick={() => {
              const cookedCat = categories.find((c) => c.includes("ចំអិន")) || "អាហារចំអិនផ្ទាល់ (Cooked Fresh)";
              setActiveCategory(cookedCat);
            }}
          >
            <KhmerCorner position="top-right" />
            <KhmerCorner position="bottom-left" />
            <div className="spotlight-badge cooked-tag">🍳 ចម្អិនក្តៅៗភ្លាមៗ</div>
            <div className="spotlight-image-holder">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80"
                alt="Cooked Fresh Food"
              />
              <div className="spotlight-gradient-overlay cooked-grad"></div>
            </div>
            <div className="spotlight-content">
              <h3 className="spotlight-title">🍳 អាហារចំអិនផ្ទាល់ (Cooked Fresh)</h3>
              <p className="spotlight-desc">
                ឡុកឡាក់សាច់គោបែបខ្មែរ បាយឆាគ្រឿងសមុទ្រ មាន់បំពងស្រួយ និងស៊ុបប្រហិតត្រីក្តៅៗ ចម្អិនផ្ទាល់ភ្លាមៗតាមការកុម្ម៉ង់។
              </p>
              <div className="spotlight-action">
                <span className="spotlight-btn-text">
                  {isCategorySelected("ចំអិន") ? "✓ កំពុងបង្ហាញ" : "មើលម្ហូបចំអិនផ្ទាល់ →"}
                </span>
                <span className="spotlight-count">
                  {products.filter((p) => p.category?.cat_name?.includes("ចំអិន")).length} មុខទំនិញ
                </span>
              </div>
            </div>
          </div>

          {/* Spotlight Card 3: ម្ហូប & នំចូលឆ្នាំថ្មី */}
          <div
            className={`food-spotlight-card kny-card ${
              isCategorySelected("ចូលឆ្នាំ") || isCategorySelected("អន្សម") ? "spotlight-active" : ""
            }`}
            onClick={() => {
              const knyCat = categories.find((c) => c.includes("ចូលឆ្នាំ") || c.includes("អន្សម")) || "all";
              setActiveCategory(knyCat);
            }}
          >
            <KhmerCorner position="top-right" />
            <KhmerCorner position="bottom-left" />
            <div className="spotlight-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #dc2626)', color: '#fff' }}>
              🏮 ពិសេសចូលឆ្នាំថ្មី
            </div>
            <div className="spotlight-image-holder">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80"
                alt="Khmer New Year Food"
              />
              <div className="spotlight-gradient-overlay" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(154, 52, 18, 0.95) 100%)' }}></div>
            </div>
            <div className="spotlight-content">
              <h3 className="spotlight-title">🏮 មុខម្ហូបចូលឆ្នាំថ្មី (KNY Specials)</h3>
              <p className="spotlight-desc">
                នំអន្សមជ្រូក-ចេក ការីសាច់មាន់នំប៉័ង ខសាច់ជ្រូកពងទា និងផ្លែឈើសែនទេវតា សម្រាប់អបអរពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ!
              </p>
              <div className="spotlight-action">
                <span className="spotlight-btn-text">
                  {isCategorySelected("ចូលឆ្នាំ") || isCategorySelected("អន្សម") ? "✓ កំពុងបង្ហាញ" : "មើលម្ហូបចូលឆ្នាំថ្មី →"}
                </span>
                <span className="spotlight-count">
                  ប្រូម៉ូសិន ២០%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ||
                (category.includes("ស្រស់") && isCategorySelected("ស្រស់")) ||
                (category.includes("ចំអិន") && isCategorySelected("ចំអិន"))
                  ? "active"
                  : ""
              }`}
              onClick={() => handleCategoryFilter(category)}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🍽️</div>
            <p>មិនមានមុខទំនិញនៅក្នុងប្រភេទនេះនៅឡើយទេ</p>
            <button className="category-btn active" onClick={() => setActiveCategory("all")}>
              បង្ហាញទាំងអស់
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const catName = product.category?.cat_name || "";
              const isFresh = catName.includes("ស្រស់") || catName.toLowerCase().includes("fresh");
              const isCooked = catName.includes("ចំអិន") || catName.toLowerCase().includes("cooked");
              const isDrink = catName.includes("ភេសជ្ជៈ") || catName.toLowerCase().includes("drink");

              return (
                <div
                  className={`product-card ${isFresh ? "card-fresh" : ""} ${isCooked ? "card-cooked" : ""}`}
                  key={product.pro_id}
                  data-id={product.pro_id}
                  onClick={() => handleViewDetails(product.pro_id)}
                >
                  <KhmerCorner position="top-right" />
                  {/* Category Pill Tag */}
                  <div
                    className={`product-type-pill ${
                      isFresh ? "type-fresh" : isCooked ? "type-cooked" : isDrink ? "type-drink" : ""
                    }`}
                  >
                    {isFresh && "🌿 អាហារស្រស់ៗ"}
                    {isCooked && "🍳 ចំអិនក្តៅៗ"}
                    {isDrink && "🥤 ភេសជ្ជៈ"}
                    {!isFresh && !isCooked && !isDrink && (catName || "General")}
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
                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
                        }
                        alt={product.pro_name || "Product Image"}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
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
