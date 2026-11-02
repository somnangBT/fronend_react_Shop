import React, { useState } from 'react';
import './styles/KhmerNewYearPetals.css';

/**
 * KhmerNewYearPetals: Gentle floating golden blossoms (ផ្កាអង្គាសីល & ផ្កាផ្ញីមាស)
 * Drifting peacefully in the background to celebrate Cambodian New Year!
 * Lightweight, CSS-only animations, pointer-events: none for petals.
 * Includes user-friendly toggle pill to enable/disable blossoms at will!
 */
const KhmerNewYearPetals = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('kny_petals_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const togglePetals = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('kny_petals_enabled', String(next));
      } catch {
        // Ignore localStorage error if cookies/storage disabled
      }
      return next;
    });
  };

  // 10 particle elements with staggered positions and delays
  const petals = [
    { id: 1, left: '5%', delay: '0s', duration: '9s', size: 18, emoji: '🌸' },
    { id: 2, left: '15%', delay: '2.5s', duration: '11s', size: 22, emoji: '✨' },
    { id: 3, left: '26%', delay: '5s', duration: '10s', size: 16, emoji: '🌺' },
    { id: 4, left: '38%', delay: '1.2s', duration: '12s', size: 20, emoji: '🌸' },
    { id: 5, left: '48%', delay: '4s', duration: '9.5s', size: 17, emoji: '✨' },
    { id: 6, left: '58%', delay: '6.5s', duration: '11.5s', size: 22, emoji: '🌼' },
    { id: 7, left: '69%', delay: '3.1s', duration: '10.5s', size: 19, emoji: '🌸' },
    { id: 8, left: '79%', delay: '0.8s', duration: '13s', size: 16, emoji: '✨' },
    { id: 9, left: '88%', delay: '4.8s', duration: '9.8s', size: 20, emoji: '🌺' },
    { id: 10, left: '95%', delay: '2.1s', duration: '11.2s', size: 17, emoji: '🌸' }
  ];

  return (
    <>
      {/* Blossom Particles Layer */}
      {isEnabled && (
        <div className="kny-petals-container" aria-hidden="true">
          {petals.map((p) => (
            <span
              key={p.id}
              className="kny-petal"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                fontSize: `${p.size}px`
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Floating Toggle Pill Button (Bottom Left) */}
      <button
        type="button"
        className={`kny-toggle-btn ${isEnabled ? 'active' : 'paused'}`}
        onClick={togglePetals}
        title={isEnabled ? 'ចុចដើម្បីបិទផ្កាធ្លាក់ចូលឆ្នាំ (Disable Blossom Animation)' : 'ចុចដើម្បីបើកផ្កាធ្លាក់ចូលឆ្នាំ (Enable Blossom Animation)'}
        aria-label="Toggle Khmer New Year Petals Animation"
      >
        <span className="kny-toggle-icon">{isEnabled ? '🌸' : '⏸️'}</span>
        <span className="kny-toggle-text">
          {isEnabled ? 'ផ្កាធ្លាក់: បើក' : 'ផ្កាធ្លាក់: បិទ'}
        </span>
      </button>
    </>
  );
};

export default KhmerNewYearPetals;
