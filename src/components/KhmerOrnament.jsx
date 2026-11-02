import React from 'react';
import './styles/KhmerOrnament.css';

/**
 * Traditional Khmer Ornamental Art Components (ក្បាច់រចនាខ្មែរបុរាណ)
 * Including:
 * - KhmerDivider: Centerpiece lotus with traditional flame-scrolling floral tendrils (ក្បាច់ភ្ញីផ្កាឈូក)
 * - KhmerAngkorCrest: Angkor Wat silhouette with traditional royal lotus base
 * - KhmerCorner: Traditional Kbach corner flourishes for cards
 * - KhmerBorder: Repeating lotus petal / temple frieze border
 */

export const KhmerDivider = ({ className = '', style = {}, title = '' }) => {
  return (
    <div className={`khmer-divider-wrapper ${className}`} style={style}>
      <div className="khmer-divider-line left-line"></div>
      <div className="khmer-divider-center">
        <svg
          viewBox="0 0 240 32"
          className="khmer-divider-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="khmerGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="30%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#fffbeb" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Khmer Lotus Blossom (ផ្កាឈូកខ្មែរ) */}
          <path
            d="M120 4 C116 11, 114 17, 120 25 C126 17, 124 11, 120 4 Z"
            fill="url(#khmerGold)"
            filter="url(#goldGlow)"
          />
          {/* Left inner petal */}
          <path
            d="M120 12 C114 14, 110 18, 112 24 C116 23, 119 19, 120 12 Z"
            fill="url(#khmerGold)"
          />
          {/* Right inner petal */}
          <path
            d="M120 12 C126 14, 130 18, 128 24 C124 23, 121 19, 120 12 Z"
            fill="url(#khmerGold)"
          />
          {/* Left outer petal */}
          <path
            d="M117 17 C109 18, 103 23, 106 27 C111 26, 115 22, 117 17 Z"
            fill="url(#khmerGold)"
          />
          {/* Right outer petal */}
          <path
            d="M123 17 C131 18, 137 23, 134 27 C129 26, 125 22, 123 17 Z"
            fill="url(#khmerGold)"
          />

          {/* Left Tendril / Kbach Phni Flame (ក្បាច់ភ្ញីភ្លើងខាងឆ្វេង) */}
          <path
            d="M104 25 C92 24, 82 17, 72 20 C64 23, 60 28, 52 24 C44 20, 36 21, 24 24"
            stroke="url(#khmerGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M86 21 C82 15, 75 13, 71 16 C68 19, 72 23, 79 22"
            fill="url(#khmerGold)"
          />
          <path
            d="M62 21 C58 16, 53 14, 49 17 C46 20, 50 24, 57 23"
            fill="url(#khmerGold)"
          />
          {/* Left curl ending */}
          <circle cx="20" cy="24" r="2.5" fill="url(#khmerGold)" />

          {/* Right Tendril / Kbach Phni Flame (ក្បាច់ភ្ញីភ្លើងខាងស្តាំ) */}
          <path
            d="M136 25 C148 24, 158 17, 168 20 C176 23, 180 28, 188 24 C196 20, 204 21, 216 24"
            stroke="url(#khmerGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M154 21 C158 15, 165 13, 169 16 C172 19, 168 23, 161 22"
            fill="url(#khmerGold)"
          />
          <path
            d="M178 21 C182 16, 187 14, 191 17 C194 20, 190 24, 183 23"
            fill="url(#khmerGold)"
          />
          {/* Right curl ending */}
          <circle cx="220" cy="24" r="2.5" fill="url(#khmerGold)" />
        </svg>
      </div>
      <div className="khmer-divider-line right-line"></div>
    </div>
  );
};

export const KhmerAngkorCrest = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`khmer-angkor-crest ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="angkorGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Angkor Central Tower (កំពូលកណ្តាល) */}
      <path
        d="M32 4 L33.5 12 L35 12 L36 18 L38 24 L39 36 L25 36 L26 24 L28 18 L29 12 L30.5 12 Z"
        fill="url(#angkorGoldGrad)"
      />
      {/* Central Tower Cap */}
      <path d="M32 2 L33 5 L31 5 Z" fill="#fef08a" />

      {/* Left Tower (កំពូលឆ្វេង) */}
      <path
        d="M20 14 L21 19 L22 23 L24 36 L15 36 L16 28 L18 20 L19 19 Z"
        fill="url(#angkorGoldGrad)"
      />
      <path d="M20 12 L21 15 L19 15 Z" fill="#fef08a" />

      {/* Right Tower (កំពូលស្តាំ) */}
      <path
        d="M44 14 L45 19 L46 20 L48 28 L49 36 L40 36 L42 23 L43 19 Z"
        fill="url(#angkorGoldGrad)"
      />
      <path d="M44 12 L45 15 L43 15 Z" fill="#fef08a" />

      {/* Far Left Outer Spire */}
      <path d="M12 24 L13 28 L14 36 L9 36 L10 30 L11 28 Z" fill="url(#angkorGoldGrad)" />

      {/* Far Right Outer Spire */}
      <path d="M52 24 L53 28 L54 30 L55 36 L50 36 L51 28 L52 28 Z" fill="url(#angkorGoldGrad)" />

      {/* Temple Base & Platforms (ខឿនប្រាសាទ) */}
      <rect x="6" y="36" width="52" height="4" rx="1" fill="url(#angkorGoldGrad)" />
      <rect x="4" y="42" width="56" height="4.5" rx="1.5" fill="url(#angkorGoldGrad)" />
      <rect x="2" y="48.5" width="60" height="5" rx="2" fill="url(#angkorGoldGrad)" />

      {/* Lotus Pedestal Petals (ត្របកឈូកទ្រខឿន) */}
      <path
        d="M8 56 C12 59, 16 59, 20 56 C24 59, 28 59, 32 56 C36 59, 40 59, 44 56 C48 59, 52 59, 56 56"
        stroke="url(#angkorGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const KhmerCorner = ({ position = 'top-left', className = '' }) => {
  return (
    <div className={`khmer-corner-ornament ${position} ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="khmer-corner-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 44 L4 12 C4 7.5, 7.5 4, 12 4 L44 4"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 36 L8 14 C8 10.7, 10.7 8, 14 8 L36 8"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        {/* Khmer Flame flourish curl in the corner */}
        <path
          d="M12 24 C14 18, 18 14, 24 12 C20 14, 17 18, 18 22 C19 26, 24 25, 23 20 C22 17, 18 16, 15 15"
          fill="#fbbf24"
        />
        <circle cx="10" cy="10" r="2" fill="#fef08a" />
      </svg>
    </div>
  );
};

export const KhmerFrieze = ({ className = '' }) => {
  return (
    <div className={`khmer-frieze-bar ${className}`}>
      <div className="khmer-frieze-pattern"></div>
    </div>
  );
};

export default KhmerDivider;


/**
 * KhmerStarLantern: Traditional Cambodian Paper Star Lantern (គោមផ្កាយប្រពៃណីខ្មែរ)
 * Distinctive 5-pointed star with colorful cellophane facets, central radiance & hanging tassels
 */
export const KhmerStarLantern = ({ size = 42, className = '' }) => {
  return (
    <div className={`khmer-lantern-wrapper ${className}`} style={{ width: size, height: size * 1.35, display: 'inline-block' }}>
      <svg
        viewBox="0 0 60 84"
        style={{ width: '100%', height: '100%' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lanternGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Top cord */}
        <line x1="30" y1="0" x2="30" y2="12" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="30" cy="12" r="2" fill="#fbbf24" />

        {/* 5-Point Star Body */}
        <polygon
          points="30,14 34.5,25 46,25 36.8,32 40.3,43 30,36.5 19.7,43 23.2,32 14,25 25.5,25"
          fill="url(#lanternGold)"
          stroke="#b45309"
          strokeWidth="1.2"
        />

        {/* Facet colors */}
        <polygon points="30,14 30,29 25.5,25" fill="#f43f5e" opacity="0.85" />
        <polygon points="30,14 30,29 34.5,25" fill="#06b6d4" opacity="0.85" />
        <polygon points="46,25 30,29 36.8,32" fill="#fbbf24" opacity="0.85" />
        <polygon points="40.3,43 30,29 30,36.5" fill="#10b981" opacity="0.85" />
        <polygon points="19.7,43 30,29 30,36.5" fill="#a855f7" opacity="0.85" />
        <polygon points="14,25 30,29 23.2,32" fill="#f97316" opacity="0.85" />

        {/* Center radiance */}
        <circle cx="30" cy="29" r="4.5" fill="#ffffff" />
        <circle cx="30" cy="29" r="2.8" fill="#fef08a" />

        {/* Hanging Tassels (រំយោលគោម) */}
        <line x1="30" y1="43" x2="30" y2="70" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="30" cy="70" r="2.5" fill="#f43f5e" />
        <line x1="22" y1="41" x2="20" y2="64" stroke="#fbbf24" strokeWidth="1.2" />
        <circle cx="20" cy="64" r="2" fill="#06b6d4" />
        <line x1="38" y1="41" x2="40" y2="64" stroke="#fbbf24" strokeWidth="1.2" />
        <circle cx="40" cy="64" r="2" fill="#10b981" />
      </svg>
    </div>
  );
};

/**
 * KhmerNewYearBanner: Top festive announcement bar
 */
export const KhmerNewYearBanner = () => {
  return (
    <div className="kny-top-banner">
      <div className="kny-banner-content">
        <span className="kny-banner-icon">🏮</span>
        <span className="kny-banner-pill">🇰🇭 សួស្តីឆ្នាំថ្មី!</span>
        <span className="kny-banner-text">
          អបអរសាទរពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ • បញ្ចុះតម្លៃពិសេស <strong>10% - 20%</strong> លើមុខម្ហូប & នំប្រពៃណីខ្មែរទាំងអស់! (កូដ: <strong>KHMER10</strong>)
        </span>
        <span className="kny-banner-icon">🏮</span>
      </div>
    </div>
  );
};


/**
 * KhmerPhkaChan: Traditional 8-Petal Celestial Flower Rosette (ក្បាច់ផ្កាចន្ទន៍មាស)
 * Symmetrical sacred royal flower used on Angkor carvings and traditional medallions
 */
export const KhmerPhkaChan = ({ size = 26, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={`khmer-phka-chan ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="phkaChanGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* 4 Cardinal Diamond Petals */}
      <path
        d="M24 2 C25 12, 28 15, 38 16 C28 17, 25 20, 24 30 C23 20, 20 17, 10 16 C20 15, 23 12, 24 2 Z"
        fill="url(#phkaChanGold)"
      />
      {/* 4 Diagonal Petals */}
      <path
        d="M32 8 C30 15, 32 18, 40 22 C33 21, 29 23, 26 31 C26 24, 23 20, 16 19 C23 19, 26 16, 32 8 Z"
        fill="url(#phkaChanGold)"
        opacity="0.8"
      />
      {/* Central Core Flower */}
      <circle cx="24" cy="20" r="4.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <circle cx="24" cy="20" r="2.2" fill="#ffffff" />
    </svg>
  );
};

/**
 * KhmerPediment: Traditional Temple Gable Arch with Chofa Finials (ក្បាច់ហោជាង & ផ្តែរប្រាសាទ)
 * Sweeping royal roofline seen on Angkor Wat, Banteay Srei & the Royal Palace
 */
export const KhmerPediment = ({ width = 340, className = '' }) => {
  return (
    <div className={`khmer-pediment-wrapper ${className}`} style={{ width, maxWidth: '100%', margin: '0 auto 0.8rem' }}>
      <svg
        viewBox="0 0 400 76"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pedimentGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="20%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Central Pinnacle Spire (កំពូលកណ្តាល) */}
        <path d="M200 2 L203 14 L207 20 L193 20 L197 14 Z" fill="url(#pedimentGoldGrad)" />
        <circle cx="200" cy="2" r="2" fill="#ffffff" />

        {/* Left Gable Roof Arch with Chofa finial (ជហ្វាឆ្វេង) */}
        <path
          d="M200 16 C155 18, 95 30, 42 62 C36 54, 26 44, 18 34 C24 41, 32 48, 44 52 C90 26, 150 16, 200 16 Z"
          fill="url(#pedimentGoldGrad)"
        />
        {/* Left Chofa Tip Curl */}
        <path d="M18 34 C14 26, 20 20, 27 22 C23 24, 21 28, 23 32 Z" fill="url(#pedimentGoldGrad)" />

        {/* Right Gable Roof Arch with Chofa finial (ជហ្វាស្តាំ) */}
        <path
          d="M200 16 C245 18, 305 30, 358 62 C364 54, 374 44, 382 34 C376 41, 368 48, 356 52 C310 26, 250 16, 200 16 Z"
          fill="url(#pedimentGoldGrad)"
        />
        {/* Right Chofa Tip Curl */}
        <path d="M382 34 C386 26, 380 20, 373 22 C377 24, 379 28, 377 32 Z" fill="url(#pedimentGoldGrad)" />

        {/* Lower Frieze Bar */}
        <path d="M50 66 L350 66" stroke="url(#pedimentGoldGrad)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M70 71 L330 71" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 4" />

        {/* Central Lotus Flame inside Tympanum */}
        <path d="M200 28 C194 36, 193 42, 200 50 C207 42, 206 36, 200 28 Z" fill="url(#pedimentGoldGrad)" />
        <path d="M192 38 C186 38, 182 42, 186 46 C190 44, 192 40, 192 38 Z" fill="url(#pedimentGoldGrad)" />
        <path d="M208 38 C214 38, 218 42, 214 46 C210 44, 208 40, 208 38 Z" fill="url(#pedimentGoldGrad)" />
      </svg>
    </div>
  );
};

/**
 * KhmerTevada: Traditional Cambodian Angel / Devata Blessing Silhouette (ទេវតាឆ្នាំថ្មីសំពះ)
 */
export const KhmerTevada = ({ size = 48, className = '' }) => {
  return (
    <div className={`khmer-tevada-container ${className}`} style={{ width: size, height: size * 1.25, display: 'inline-block' }}>
      <svg
        viewBox="0 0 64 80"
        style={{ width: '100%', height: '100%' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tevadaGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Halo / Aura of flame motifs (ពន្លឺរស្មីទេវតា) */}
        <circle cx="32" cy="24" r="16" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.7" />
        <path d="M32 4 L33 9 L31 9 Z" fill="#fef08a" />
        <path d="M48 20 L44 21 L45 19 Z" fill="#fef08a" />
        <path d="M16 20 L20 21 L19 19 Z" fill="#fef08a" />

        {/* Crown / Mokot (មកុដខ្មែរ) */}
        <path d="M32 8 L35 18 L29 18 Z" fill="url(#tevadaGold)" />
        <path d="M32 10 L37 18 L27 18 Z" fill="url(#tevadaGold)" opacity="0.6" />
        <circle cx="32" cy="7" r="1.5" fill="#ffffff" />
        <rect x="28" y="18" width="8" height="2" rx="1" fill="#fef08a" />

        {/* Face & Head */}
        <circle cx="32" cy="24" r="5" fill="url(#tevadaGold)" />
        {/* Traditional ear ornaments (កណ្ឌល) */}
        <path d="M26 23 C25 26, 26 28, 27 27" stroke="url(#tevadaGold)" strokeWidth="1" />
        <path d="M38 23 C39 26, 38 28, 37 27" stroke="url(#tevadaGold)" strokeWidth="1" />

        {/* Torso & Royal Neck Ornaments */}
        <path d="M30 29 L34 29 L36 40 L28 40 Z" fill="url(#tevadaGold)" />

        {/* Sampeah Hands (ដៃសំពះទេវតា) */}
        <path d="M32 32 L34 38 L30 38 Z" fill="#ffffff" />
        <path d="M28 34 C29 36, 31 38, 32 38 C33 38, 35 36, 36 34" stroke="#d97706" strokeWidth="1.2" />

        {/* Lower body & Royal Sbai / Sampot */}
        <path d="M28 40 L36 40 L40 64 L24 64 Z" fill="url(#tevadaGold)" />
        <path d="M24 64 C28 66, 36 66, 40 64 L42 70 L22 70 Z" fill="#b45309" />
        {/* Lotus base pedestal */}
        <path d="M18 72 C24 75, 40 75, 46 72 L48 76 L16 76 Z" fill="url(#tevadaGold)" />
      </svg>
    </div>
  );
};

/**
 * KhmerFestivalTong: Traditional Cambodian Festival Flag Streamer (ទង់ក្រពើ / ទង់ព្រលឹង)
 * Vibrantly colored ceremonial temple streamer seen across Cambodia during Khmer New Year
 */
export const KhmerFestivalTong = ({ className = '' }) => {
  return (
    <div className={`khmer-festival-tong ${className}`}>
      <div className="tong-cord"></div>
      <div className="tong-flag-panel tong-red">
        <KhmerPhkaChan size={14} />
      </div>
      <div className="tong-flag-panel tong-yellow">
        <span>🏮</span>
      </div>
      <div className="tong-flag-panel tong-blue">
        <span>✨</span>
      </div>
      <div className="tong-flag-panel tong-orange">
        <KhmerPhkaChan size={14} />
      </div>
      <div className="tong-tails">
        <div className="tong-tail left"></div>
        <div className="tong-tail center"></div>
        <div className="tong-tail right"></div>
      </div>
    </div>
  );
};
