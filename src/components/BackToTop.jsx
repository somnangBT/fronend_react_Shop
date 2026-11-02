import React, { useState, useEffect } from 'react';
import './styles/BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      className="back-to-top-btn"
      onClick={scrollToTop}
      title="ត្រឡប់ឡើងលើ"
      aria-label="ត្រឡប់ឡើងលើ"
    >
      <div className="back-to-top-inner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="back-to-top-arrow"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
      <div className="back-to-top-glow"></div>
    </button>
  );
};

export default BackToTop;
