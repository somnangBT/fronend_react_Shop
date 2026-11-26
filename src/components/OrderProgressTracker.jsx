import React, { useId } from 'react';
import './styles/OrderProgressTracker.css';

/**
 * Illustrated 3-stage order progress visual tracker:
 * Stage 1: Admin Approve (រង់ចាំ Admin អនុម័ត)
 * Stage 2: Delivery (កំពុងដឹកជញ្ជូន)
 * Stage 3: Done (រួចរាល់)
 */
const OrderProgressTracker = ({ status = 'pending', paymentStatus = 'pending', compact = false }) => {
  const gradId = useId();
  const normalized = (status || 'pending').toLowerCase();

  if (normalized === 'cancelled') {
    return (
      <div className={`opt-cancelled ${compact ? 'opt-compact' : ''}`}>
        <span className="opt-cancelled-icon">❌</span>
        <div>
          <div className="opt-cancelled-title">ការបញ្ជាទិញត្រូវបានបោះបង់ (Order Cancelled)</div>
          <div className="opt-cancelled-sub">សូមទាក់ទង Admin ប្រសិនបើមានបញ្ហាទូទាត់ប្រាក់</div>
        </div>
      </div>
    );
  }

  // Determine current step index (1 = Admin Approve, 2 = Delivery, 3 = Done)
  let currentStep = 1;
  if (normalized === 'delivering') {
    currentStep = 2;
  } else if (normalized === 'completed') {
    currentStep = 4; // All 3 stages done
  }

  const isPreparing = normalized === 'preparing';
  const isPaid = paymentStatus === 'paid';
  const isAwaiting = paymentStatus === 'awaiting_approval';

  const stage1State = currentStep > 1 ? 'done' : 'active';
  const stage2State = currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'upcoming';
  const stage3State = currentStep > 3 ? 'done' : 'upcoming';

  const stage1Sub =
    stage1State === 'done'
      ? '✅ Admin បានអនុម័ត'
      : isPreparing
      ? '📦 អនុម័ត • កំពុងវេចខ្ចប់'
      : isPaid
      ? '💳 បង់រួច • ចាំ Admin'
      : isAwaiting
      ? '🧾 ភ្ជាប់ Slip • ចាំ Admin'
      : '⏳ ចាំ Admin ពិនិត្យ';

  const stage2Sub =
    stage2State === 'done'
      ? '✅ បានដឹកដល់ទីតាំង'
      : stage2State === 'active'
      ? '🛵 កំពុងដឹកជញ្ជូន...'
      : 'រង់ចាំចេញដឹកជញ្ជូន';

  const stage3Sub =
    stage3State === 'done'
      ? '🎉 ទទួលទំនិញជោគជ័យ'
      : 'រង់ចាំការបញ្ចប់';

  const stages = [
    {
      id: 1,
      state: stage1State,
      badge: 'ដំណាក់កាល ១',
      title: 'Admin Approve',
      subtitle: stage1Sub,
      illustration: (
        <svg viewBox="0 0 80 80" className="opt-svg" aria-hidden="true">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Clipboard / Approval Card */}
          <rect x="18" y="14" width="40" height="50" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke={`url(#${gradId})`} strokeWidth="2.5" />
          <rect x="30" y="9" width="16" height="8" rx="4" fill="#38bdf8" />
          <line x1="27" y1="28" x2="49" y2="28" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="36" x2="45" y2="36" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="44" x2="39" y2="44" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Approval Stamp Shield */}
          <circle
            cx="54"
            cy="52"
            r="14"
            fill={stage1State === 'done' ? '#10b981' : '#f59e0b'}
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          {stage1State === 'done' ? (
            <path d="M48 52 L52.5 56.5 L60.5 47.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M54 45 V52 L58 55" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      ),
    },
    {
      id: 2,
      state: stage2State,
      badge: 'ដំណាក់កាល ២',
      title: 'Delivery',
      subtitle: stage2Sub,
      illustration: (
        <svg viewBox="0 0 80 80" className={`opt-svg ${stage2State === 'active' ? 'opt-bike-ride' : ''}`} aria-hidden="true">
          {/* Speed motion lines */}
          <line x1="6" y1="34" x2="18" y2="34" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <line x1="9" y1="42" x2="21" y2="42" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          {/* Road */}
          <line x1="10" y1="62" x2="70" y2="62" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 4" />
          {/* Delivery Box */}
          <rect x="20" y="25" width="18" height="15" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="29" y="36" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">DE</text>
          {/* Scooter Body */}
          <path
            d="M22 44 H42 L48 31 H57 L62 46 C64 46 66 49 66 52 H55 L49 52 H34 L21 52 C20 48 21 44 22 44 Z"
            fill={stage2State === 'upcoming' ? '#64748b' : '#00f0ff'}
          />
          {/* Handlebar & Windshield */}
          <path d="M51 31 L54 22 H59" fill="none" stroke="#e2e8f0" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="62" cy="40" r="2.2" fill="#fde047" />
          {/* Wheels */}
          <circle cx="27" cy="54" r="7.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
          <circle cx="27" cy="54" r="2.5" fill="#38bdf8" />
          <circle cx="57" cy="54" r="7.5" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2.5" />
          <circle cx="57" cy="54" r="2.5" fill="#38bdf8" />
        </svg>
      ),
    },
    {
      id: 3,
      state: stage3State,
      badge: 'ដំណាក់កាល ៣',
      title: 'Done',
      subtitle: stage3Sub,
      illustration: (
        <svg viewBox="0 0 80 80" className="opt-svg" aria-hidden="true">
          {/* Delivered Food Parcel */}
          <rect x="18" y="30" width="38" height="32" rx="6" fill={stage3State === 'done' ? '#059669' : '#334155'} stroke={stage3State === 'done' ? '#6ee7b7' : '#64748b'} strokeWidth="2.2" />
          <path d="M18 41 H56" stroke={stage3State === 'done' ? '#a7f3d0' : '#475569'} strokeWidth="2" />
          <rect x="33" y="30" width="8" height="32" fill={stage3State === 'done' ? '#34d399' : '#475569'} opacity="0.65" />
          {/* Celebration Check Circle */}
          <circle cx="56" cy="26" r="14" fill={stage3State === 'done' ? '#10b981' : '#475569'} stroke="#0f172a" strokeWidth="2.5" />
          <path d="M49.5 26 L54 30.5 L62.5 21.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Sparkles */}
          <circle cx="17" cy="21" r="2.5" fill={stage3State === 'done' ? '#fde047' : '#475569'} />
          <circle cx="67" cy="46" r="2" fill={stage3State === 'done' ? '#38bdf8' : '#475569'} />
        </svg>
      ),
    },
  ];

  return (
    <div className={`opt-wrapper ${compact ? 'opt-compact' : ''}`}>
      <div className="opt-header-row">
        <span className="opt-header-title">📦 តាមដានស្ថានភាពដឹកជញ្ជូន (៣ ដំណាក់កាល)</span>
        {currentStep < 4 && (
          <span className="opt-live-pill">
            <span className="opt-live-dot"></span>
            Live Update
          </span>
        )}
      </div>

      <div className="opt-stages-grid">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div className={`opt-stage-card opt-state-${stage.state}`}>
              <div className="opt-stage-top-badge">
                {stage.state === 'done' ? '✓ រួចរាល់' : stage.badge}
              </div>
              <div className="opt-illustration-box">
                {stage.illustration}
              </div>
              <div className="opt-stage-text">
                <div className="opt-stage-title">{stage.title}</div>
                <div className="opt-stage-sub">{stage.subtitle}</div>
              </div>
            </div>

            {idx < stages.length - 1 && (
              <div
                className={`opt-connector ${
                  stages[idx].state === 'done' ? 'opt-connector-done' : ''
                }`}
                aria-hidden="true"
              >
                <div className="opt-connector-line"></div>
                <span className="opt-connector-arrow">➔</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressTracker;
