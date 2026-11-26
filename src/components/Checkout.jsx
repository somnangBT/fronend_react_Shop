import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { formatKHR } from '../utils/currency';
import { API_BASE_URL } from '../config/api';
import { KhmerDivider, KhmerAngkorCrest } from './KhmerOrnament';
import OrderProgressTracker from './OrderProgressTracker';
import {
  generateBakongApiKhqr,
  generateAbaKhqr,
  BAKONG_API_ACCOUNT_ID,
  BAKONG_API_MERCHANT_NAME,
  ABA_USD_ACCOUNT,
  ABA_USD_ACCOUNT_DISPLAY,
  ABA_DISPLAY_NAME,
} from '../utils/khqr';
import "./styles/Checkout.css";

const CHECKOUT_DRAFT_KEY = 'luckshop_checkout_draft_v1';
const CHECKOUT_COMPLETED_KEY = 'luckshop_checkout_completed_v1';

const readSessionState = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const Checkout = () => {
  const { cartItems, cartCount, clearCart, subtotal, taxes, shipping, discount, total, promoCode } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [restoredState] = useState(() => {
    const savedCompleted = readSessionState(CHECKOUT_COMPLETED_KEY);
    if (savedCompleted?.orderComplete && savedCompleted?.orderId && cartCount === 0) {
      return { completed: savedCompleted, draft: null };
    }
    return { completed: null, draft: readSessionState(CHECKOUT_DRAFT_KEY) };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderComplete, setOrderComplete] = useState(() => Boolean(restoredState.completed));
  const [orderId, setOrderId] = useState(() => restoredState.completed?.orderId ?? null);
  const [finalOrderStatus, setFinalOrderStatus] = useState(() => restoredState.completed?.finalOrderStatus ?? null);
  const [liveDeliveryStatus, setLiveDeliveryStatus] = useState(() => restoredState.completed?.liveDeliveryStatus ?? 'pending');

  // Payment method: 'khqr' (default) or 'cash'
  const [paymentMethod, setPaymentMethod] = useState(
    () => restoredState.completed?.paymentMethod || restoredState.draft?.paymentMethod || 'khqr'
  );
  // KHQR Sub-Provider: 'bakong' (Default Auto-Verify) or 'aba' (Direct ABA 007 842 694)
  const [khqrProvider, setKhqrProvider] = useState(
    () => restoredState.completed?.khqrProvider || restoredState.draft?.khqrProvider || 'bakong'
  );
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);

  // Real Bakong API + ABA KHQR State
  const [khqrData, setKhqrData] = useState(() => restoredState.draft?.khqrData || null);
  const [paidVerified, setPaidVerified] = useState(
    () => Boolean(restoredState.completed?.paidVerified ?? restoredState.draft?.paidVerified)
  );
  const [bakongRef, setBakongRef] = useState(
    () => restoredState.completed?.bakongRef || restoredState.draft?.bakongRef || null
  );
  const [bakongSender, setBakongSender] = useState(
    () => restoredState.completed?.bakongSender || restoredState.draft?.bakongSender || null
  );
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paidPopup, setPaidPopup] = useState(null);
  const [transferRef, setTransferRef] = useState(() => restoredState.draft?.transferRef || '');
  const [paidClaimed, setPaidClaimed] = useState(() => Boolean(restoredState.draft?.paidClaimed));
  const [customerName, setCustomerName] = useState(
    () => restoredState.draft?.customerName ?? (user?.name || user?.email?.split('@')[0] || '')
  );
  const [phone, setPhone] = useState(() => restoredState.draft?.phone ?? (user?.phone || ''));
  const [shippingAddress, setShippingAddress] = useState(
    () => restoredState.draft?.shippingAddress ?? (user?.address || '')
  );
  const [notes, setNotes] = useState(() => restoredState.draft?.notes ?? '');
  const autoSubmittedMd5Ref = useRef(null);

  // Fill empty delivery fields from user profile once available
  useEffect(() => {
    if (!user) return;
    setCustomerName((prev) => prev || user.name || user.email?.split('@')[0] || '');
    setPhone((prev) => prev || user.phone || '');
    setShippingAddress((prev) => prev || user.address || '');
  }, [user]);

  const cleanedPhone = phone.replace(/[^0-9+]/g, '');
  const isDeliveryValid = Boolean(
    customerName.trim() && cleanedPhone.length >= 8 && shippingAddress.trim().length >= 3
  );

  const playPaidChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.11 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.11);
        osc.stop(ctx.currentTime + idx * 0.11 + 0.26);
      });
    } catch (_) {}
  };

  // Persist active payment draft state across page reloads
  useEffect(() => {
    if (orderComplete || cartCount === 0) return;
    try {
      sessionStorage.setItem(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify({
          paymentMethod,
          khqrProvider,
          khqrData,
          paidVerified,
          bakongRef,
          bakongSender,
          transferRef,
          paidClaimed,
          customerName,
          phone,
          shippingAddress,
          notes,
        })
      );
    } catch (_) {}
  }, [
    orderComplete,
    cartCount,
    paymentMethod,
    khqrProvider,
    khqrData,
    paidVerified,
    bakongRef,
    bakongSender,
    transferRef,
    paidClaimed,
    customerName,
    phone,
    shippingAddress,
    notes,
  ]);

  // Persist completed order & live tracking status across page reloads
  useEffect(() => {
    if (!orderComplete || !orderId) return;
    try {
      sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
      sessionStorage.setItem(
        CHECKOUT_COMPLETED_KEY,
        JSON.stringify({
          orderComplete: true,
          orderId,
          liveDeliveryStatus,
          finalOrderStatus,
          paymentMethod,
          khqrProvider,
          bakongRef,
          bakongSender,
          paidVerified,
        })
      );
    } catch (_) {}
  }, [orderComplete, orderId, liveDeliveryStatus, finalOrderStatus, paymentMethod, khqrProvider, bakongRef, bakongSender, paidVerified]);

  // Generate KHQR whenever delivery info is valid and payment mode or total changes
  useEffect(() => {
    if (paymentMethod !== 'khqr' || !isDeliveryValid || total <= 0 || orderComplete || paidVerified) {
      return;
    }
    const targetAmount = parseFloat(total.toFixed(2));
    if (
      khqrData &&
      khqrData.provider === khqrProvider &&
      Number(khqrData.amount) === targetAmount &&
      (!khqrData.expiresAt || Date.now() < khqrData.expiresAt - 60000)
    ) {
      return;
    }
    if (khqrProvider === 'bakong') {
      const generated = generateBakongApiKhqr({
        amount: targetAmount,
        currency: 'USD',
      });
      setKhqrData({
        ...generated,
        provider: 'bakong',
        amount: targetAmount,
        expiresAt: Date.now() + 14 * 60 * 1000,
      });
      setBakongRef(null);
      setBakongSender(null);
    } else {
      const generated = generateAbaKhqr({ currency: 'USD' });
      setKhqrData({
        ...generated,
        provider: 'aba',
        amount: targetAmount,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });
    }
  }, [paymentMethod, khqrProvider, isDeliveryValid, total, orderComplete, paidVerified, khqrData]);

  const handleCopyText = (text, label) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification(`📋 បានចម្លង ${label}: ${text}`, 'success');
      }).catch(() => {});
    }
  };

  // Check Bakong API payment status in real-time via Laravel Backend -> NBC Bakong API
  const verifyBakongPayment = async (silent = false) => {
    if (
      paymentMethod !== 'khqr' ||
      khqrProvider !== 'bakong' ||
      !isDeliveryValid ||
      !khqrData?.md5 ||
      paidVerified ||
      orderComplete
    ) {
      return;
    }
    if (!silent) setCheckingPayment(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bakong/check-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ md5: khqrData.md5 }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.paid) {
          const resolvedRef = data.bakong_ref || khqrData.md5;
          setPaidVerified(true);
          setBakongRef(resolvedRef);
          setBakongSender(data.sender || null);
          setPaidClaimed(true);
          setPaidPopup({
            amount: data.amount ?? parseFloat(total.toFixed(2)),
            currency: data.currency || 'USD',
            ref: resolvedRef,
            sender: data.sender || null,
          });
          playPaidChime();
          showNotification('🎉 បានទូទាត់ប្រាក់តាម Bakong ជោគជ័យ! លុយចូលគណនីរួចរាល់!', 'success');

          // Auto-confirm order once so Admin & Telegram receive payment immediately
          if (autoSubmittedMd5Ref.current !== khqrData.md5) {
            autoSubmittedMd5Ref.current = khqrData.md5;
            setTimeout(() => {
              handleSubmitOrder({
                overridePaid: true,
                overrideRef: resolvedRef,
                overrideMd5: khqrData.md5,
                overrideMethod: 'khqr',
              });
            }, 1400);
          }
        } else if (!silent) {
          showNotification('⏳ មិនទាន់ឃើញប្រតិបត្តិការទូទាត់នៅឡើយទេ។ សូមរង់ចាំបន្តិច ឬភ្ជាប់វិក្កយបត្រ!', 'error');
        }
      }
    } catch (err) {
      if (!silent) console.warn('Bakong check failed:', err);
    } finally {
      if (!silent) setCheckingPayment(false);
    }
  };

  // Auto-poll NBC Bakong Open API every 3 seconds while Bakong KHQR is active
  useEffect(() => {
    if (
      paymentMethod !== 'khqr' ||
      khqrProvider !== 'bakong' ||
      !isDeliveryValid ||
      !khqrData?.md5 ||
      paidVerified ||
      orderComplete
    ) {
      return undefined;
    }
    const timer = setInterval(() => {
      verifyBakongPayment(true);
    }, 3000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, khqrProvider, isDeliveryValid, khqrData, paidVerified, orderComplete]);

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

  // Handle order submission (supports auto-submit on Bakong verified payment, ABA with slip, or Cash COD)
  const handleSubmitOrder = async (arg = {}) => {
    const opts = arg && typeof arg.preventDefault !== 'function' ? arg : {};
    const isBakongMode = paymentMethod === 'khqr' && khqrProvider === 'bakong';
    const resolvedMethod = opts.overrideMethod || (paymentMethod === 'khqr' ? (isBakongMode ? 'khqr' : 'aba_khqr') : 'cash');
    const resolvedMd5 = opts.overrideMd5 ?? (isBakongMode ? (khqrData?.md5 || null) : null);
    const resolvedRef = opts.overrideRef ?? (isBakongMode ? (bakongRef || transferRef.trim() || null) : (transferRef.trim() || null));
    const isPaidVerifiedFlag = Boolean(opts.overridePaid || paidVerified);

    if (!customerName.trim()) {
      setPaidPopup(null);
      setError('សូមបញ្ចូលឈ្មោះអ្នកទទួល!');
      return;
    }
    if (phone.replace(/[^0-9+]/g, '').length < 8) {
      setPaidPopup(null);
      setError('សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ (យ៉ាងតិច ៨ ខ្ទង់)!');
      return;
    }
    if (!shippingAddress.trim()) {
      setPaidPopup(null);
      setError('សូមបញ្ចូលអាសយដ្ឋានដឹកជញ្ជូន!');
      return;
    }

    // Block placing unpaid KHQR orders from UI
    if (resolvedMethod === 'khqr' && !isPaidVerifiedFlag) {
      setError('សូមស្កេនបង់ប្រាក់តាម Bakong KHQR ជាមុនសិន! ប្រព័ន្ធនឹងបញ្ជាក់ដោយស្វ័យប្រវត្តិពេលលុយចូល។');
      return;
    }
    if (resolvedMethod === 'aba_khqr' && !isPaidVerifiedFlag && !slipFile) {
      setError('សម្រាប់ការបង់តាម ABA សូមផ្ទេរប្រាក់ រួចភ្ជាប់រូបវិក្កយបត្របង់ប្រាក់ (Slip) ជាមុនសិន!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Upload payment slip via Backend ImgBB proxy if attached
      let paymentProofUrl = null;
      if (slipFile && paymentMethod === 'khqr') {
        try {
          const slipFormData = new FormData();
          slipFormData.append('image', slipFile);
          const uploadHeaders = { Accept: 'application/json' };
          if (user?.token && user.token !== 'token_placeholder') {
            uploadHeaders.Authorization = `Bearer ${user.token}`;
          }
          const uploadRes = await fetch(`${API_BASE_URL}/api/upload-slip`, {
            method: 'POST',
            headers: uploadHeaders,
            body: slipFormData
          });
          if (uploadRes.status === 401) {
            setError('សូម Logout រួច Login គណនីម្ដងទៀត ដើម្បីបង្ហោះរូបវិក្កយបត្រ (Slip)!');
            setLoading(false);
            return;
          }
          const uploadData = await uploadRes.json().catch(() => ({}));
          if (uploadRes.ok && uploadData?.url) {
            paymentProofUrl = uploadData.url;
          }
        } catch (imgbbErr) {
          console.warn('Slip upload failed:', imgbbErr);
        }

        if (resolvedMethod === 'aba_khqr' && !paymentProofUrl) {
          setError('មិនអាចបង្ហោះរូបវិក្កយបត្រ (Slip) បានទេ។ សូមពិនិត្យអ៊ីនធឺណិត រួចសាកល្បងម្ដងទៀត។');
          setLoading(false);
          return;
        }
      }

      // 2. Prepare Order Data
      const orderData = {
        name: customerName.trim(),
        customer_name: customerName.trim(),
        email: user?.email || '',
        phone: phone.trim(),
        address: shippingAddress.trim(),
        shipping_address: shippingAddress.trim(),
        notes: notes.trim() || null,
        promo_code: promoCode || null,
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
        payment_method: resolvedMethod,
        payment_proof: paymentProofUrl,
        khqr_md5: resolvedMd5,
        bakong_ref: paymentMethod === 'khqr' ? resolvedRef : null,
        paid_claimed: paymentMethod === 'khqr' ? (isPaidVerifiedFlag || paidClaimed || Boolean(paymentProofUrl) || Boolean(transferRef.trim())) : false,
        user_id: user?.id || null
      };

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (user?.token && user.token !== 'token_placeholder') {
        headers.Authorization = `Bearer ${user.token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok && (data.status === 'success' || data.success)) {
        const createdOrderId = data.order_id || data.order?.id;
        const resolvedLiveStatus = data.order?.status || 'pending';
        const resolvedPaymentStatus = data.payment_status || data.order?.payment_status || (isPaidVerifiedFlag ? 'paid' : 'awaiting_approval');
        const resolvedBakongRef = data.bakong_ref || data.order?.bakong_ref || bakongRef || null;

        try {
          sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
          sessionStorage.setItem(
            CHECKOUT_COMPLETED_KEY,
            JSON.stringify({
              orderComplete: true,
              orderId: createdOrderId,
              liveDeliveryStatus: resolvedLiveStatus,
              finalOrderStatus: resolvedPaymentStatus,
              paymentMethod,
              khqrProvider,
              bakongRef: resolvedBakongRef,
              bakongSender,
              paidVerified: isPaidVerifiedFlag || resolvedPaymentStatus === 'paid',
            })
          );
        } catch (_) {}

        setOrderId(createdOrderId);
        setLiveDeliveryStatus(resolvedLiveStatus);
        setFinalOrderStatus(resolvedPaymentStatus);
        if (resolvedBakongRef) {
          setBakongRef(resolvedBakongRef);
        }
        setPaidPopup(null);
        setOrderComplete(true);
        clearCart();
        showNotification('🎉 ការបញ្ជាទិញបានជោគជ័យ! សូមអរគុណ។', 'success');
      } else {
        setPaidPopup(null);
        setError(data.message || 'មានបញ្ហាក្នុងការបញ្ជាទិញ។ សូមព្យាយាមម្តងទៀត។');
      }
    } catch (err) {
      setPaidPopup(null);
      setError('មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើបានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។');
    } finally {
      setLoading(false);
    }
  };

  // Poll live order status (Admin Approve -> Delivery -> Done) after order is completed
  useEffect(() => {
    if (!orderComplete || !orderId || ['completed', 'cancelled'].includes(liveDeliveryStatus)) {
      return undefined;
    }

    const fetchLiveOrderStatus = async () => {
      try {
        const params = new URLSearchParams();
        if (user?.id) params.append('user_id', user.id);
        if (user?.email) params.append('email', user.email);
        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const headers = { Accept: 'application/json' };
        if (user?.token && user.token !== 'token_placeholder') {
          headers.Authorization = `Bearer ${user.token}`;
        }

        const res = await fetch(`${API_BASE_URL}/api/orders${queryStr}`, { headers });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        const matched = list.find((o) => Number(o.id) === Number(orderId));
        if (!matched) return;

        if (matched.payment_status && matched.payment_status !== finalOrderStatus) {
          setFinalOrderStatus(matched.payment_status);
        }
        if (matched.status && matched.status !== liveDeliveryStatus) {
          setLiveDeliveryStatus(matched.status);
          if (matched.status === 'delivering') {
            playPaidChime();
            showNotification('🛵 Admin បានអនុម័តហើយ! កំពុងដឹកជញ្ជូនជូនអ្នក!', 'success');
          } else if (matched.status === 'completed') {
            playPaidChime();
            showNotification('🎉 ការដឹកជញ្ជូនបានបញ្ចប់ជោគជ័យ! សូមអរគុណ!', 'success');
          }
        }
      } catch (_) {}
    };

    const timer = setInterval(fetchLiveOrderStatus, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderComplete, orderId, liveDeliveryStatus, finalOrderStatus, user]);

  if (orderComplete) {
    const isConfirmedPaid = finalOrderStatus === 'paid' || paidVerified;
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
            <h1 className="success-title">
              {isConfirmedPaid ? 'បានទូទាត់ & បញ្ជាទិញជោគជ័យ!' : 'ការបញ្ជាទិញទទួលបានជោគជ័យ!'}
            </h1>
            <KhmerDivider />
            <p className="success-message">
              សូមអរគុណសម្រាប់ការបញ្ជាទិញពី LuckShop! {orderId && `លេខកូដបញ្ជាទិញរបស់អ្នកគឺ #${orderId}។`}
            </p>
            {isConfirmedPaid && (
              <div style={{ margin: '12px auto', padding: '12px 16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.45)', color: '#6ee7b7', fontWeight: 700, fontSize: '0.92rem', maxWidth: '460px' }}>
                ✅ ធនាគារជាតិ (Bakong) បានបញ្ជាក់ការបង់ប្រាក់រួចរាល់!
                {bakongRef && <div style={{ fontSize: '0.82rem', marginTop: '4px', color: '#a7f3d0' }}>លេខយោង Ref: {bakongRef}</div>}
                {bakongSender && <div style={{ fontSize: '0.82rem', marginTop: '2px', color: '#a7f3d0' }}>អ្នកផ្ញើ: {bakongSender}</div>}
              </div>
            )}

            {/* 3-Stage Visual Tracker: Admin Approve -> Delivery -> Done */}
            <OrderProgressTracker
              status={liveDeliveryStatus}
              paymentStatus={finalOrderStatus || (paidVerified ? 'paid' : 'awaiting_approval')}
            />

            <p className="success-info">
              {liveDeliveryStatus === 'completed'
                ? '🎉 ការដឹកជញ្ជូនបានបញ្ចប់ដោយជោគជ័យ! អរគុណសម្រាប់ការគាំទ្រ LuckShop។'
                : liveDeliveryStatus === 'delivering'
                ? '🛵 Admin បានអនុម័តរួចរាល់ ហើយកំពុងដឹកជញ្ជូនទំនិញដល់ទីតាំងរបស់អ្នក!'
                : paymentMethod === 'khqr'
                ? 'ការបង់ប្រាក់តាម KHQR និងព័ត៌មានបញ្ជាទិញត្រូវបានផ្ញើទៅកាន់ប្រព័ន្ធ Admin និង Telegram Bot រួចរាល់ហើយ! កំពុងរង់ចាំ Admin អនុម័ត (Approve) ដើម្បីចេញដឹកជញ្ជូន។'
                : 'ព័ត៌មាននៃការបញ្ជាទិញត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធ Telegram របស់ហាងរួចរាល់ហើយ។ កំពុងរង់ចាំ Admin អនុម័ត និងដឹកជញ្ជូនជូនអ្នក។'}
            </p>
            <div className="success-actions">
              <button
                className="view-orders-btn"
                onClick={() => {
                  try { sessionStorage.removeItem(CHECKOUT_COMPLETED_KEY); } catch (_) {}
                  navigate('/account/orders');
                }}
              >
                មើលប្រវត្តិបញ្ជាទិញ ➔
              </button>
              <button
                className="continue-shopping-btn"
                onClick={() => {
                  try { sessionStorage.removeItem(CHECKOUT_COMPLETED_KEY); } catch (_) {}
                  navigate('/products');
                }}
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
              <div className="info-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                <label className="info-label" htmlFor="checkout-name">ឈ្មោះអ្នកទទួល *</label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={loading || paidVerified}
                  placeholder="បញ្ចូលឈ្មោះអ្នកទទួល"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: !customerName.trim() ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.16)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div className="info-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                <label className="info-label" htmlFor="checkout-phone">លេខទូរស័ព្ទ *</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading || paidVerified}
                  placeholder="ឧ. 012 345 678"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: cleanedPhone.length < 8 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.16)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div className="info-item full-width" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                <label className="info-label" htmlFor="checkout-address">អាសយដ្ឋានដឹកជញ្ជូន *</label>
                <input
                  id="checkout-address"
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={loading || paidVerified}
                  placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់/ខណ្ឌ, រាជធានី/ខេត្ត"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: shippingAddress.trim().length < 3 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.16)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div className="info-item full-width" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                <label className="info-label" htmlFor="checkout-notes">ចំណាំបន្ថែម (ស្រេចចិត្ត)</label>
                <input
                  id="checkout-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                  placeholder="ឧ. ហៅមកខ្ញុំពេលមកដល់មុខផ្ទះ..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    background: 'rgba(15, 23, 42, 0.55)',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
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
              {cartItems.map((item) => {
                const unitPrice = parseFloat(item.price || 0) * (1 - parseFloat(item.discount || 0) / 100);
                const lineTotal = unitPrice * item.quantity;
                return (
                  <div className="summary-item" key={item.id}>
                    <div className="item-info">
                      <span className="item-qty-badge">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="item-price-block">
                      <span className="price-usd">${lineTotal.toFixed(2)}</span>
                      <span className="price-eq"> = </span>
                      <span className="price-khr">({formatKHR(lineTotal)})</span>
                    </div>
                  </div>
                );
              })}
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
                  <span className="row-label">បញ្ចុះតម្លៃ{promoCode ? ` (${promoCode})` : ''}</span>
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
              <div className="khqr-card-container" style={{ flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                {/* Provider Selector: Bakong API (Default Auto-Check) vs ABA Direct Account */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '380px' }}>
                  <button
                    type="button"
                    onClick={() => setKhqrProvider('bakong')}
                    style={{
                      flex: 1,
                      minWidth: '155px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: khqrProvider === 'bakong' ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.18)',
                      background: khqrProvider === 'bakong' ? 'rgba(0, 240, 255, 0.14)' : 'rgba(15, 23, 42, 0.75)',
                      color: khqrProvider === 'bakong' ? '#00f0ff' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Bakong KHQR (លំនាំដើម • Auto-Check)
                  </button>
                  <button
                    type="button"
                    onClick={() => setKhqrProvider('aba')}
                    style={{
                      flex: 1,
                      minWidth: '155px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: khqrProvider === 'aba' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.18)',
                      background: khqrProvider === 'aba' ? 'rgba(56, 189, 248, 0.16)' : 'rgba(15, 23, 42, 0.75)',
                      color: khqrProvider === 'aba' ? '#38bdf8' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    🏦 ABA ({ABA_USD_ACCOUNT_DISPLAY})
                  </button>
                </div>

                <div className="khqr-card">
                  <div className="khqr-card-top">
                    <div className="khqr-brand-logo">KHQR</div>
                    <div className="khqr-bakong-tag">
                      {khqrProvider === 'bakong' ? 'Bakong Auto-Pay' : 'ABA Bank'}
                    </div>
                  </div>

                  <div className="khqr-merchant-info">
                    <div className="merchant-title">
                      {khqrProvider === 'bakong' ? BAKONG_API_MERCHANT_NAME : ABA_DISPLAY_NAME}
                    </div>
                    <div className="merchant-location">
                      {khqrProvider === 'bakong'
                        ? `Bakong ID: ${BAKONG_API_ACCOUNT_ID}`
                        : `គណនី ABA: ${ABA_USD_ACCOUNT_DISPLAY} (USD)`}
                    </div>
                  </div>

                  <div className="khqr-price-badge">
                    <span className="khqr-usd">${total.toFixed(2)}</span>
                    <span className="khqr-sep">≈</span>
                    <span className="khqr-khr">{formatKHR(total)}</span>
                  </div>

                  {!isDeliveryValid && !paidVerified ? (
                    <div
                      className="khqr-qr-frame"
                      style={{
                        padding: '24px 16px',
                        textAlign: 'center',
                        color: '#b45309',
                        background: '#fffbeb',
                        border: '1px dashed #f59e0b',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        lineHeight: 1.5,
                      }}
                    >
                      ⚠️ សូមបំពេញ ឈ្មោះ លេខទូរស័ព្ទ (យ៉ាងតិច ៨ខ្ទង់) និង អាសយដ្ឋានដឹកជញ្ជូន ខាងលើជាមុនសិន ដើម្បីបង្ហាញ QR កូដបង់ប្រាក់!
                    </div>
                  ) : (
                  <div className="khqr-qr-frame">
                    {khqrData?.qr && (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=230x230&data=${encodeURIComponent(khqrData.qr)}`} 
                        alt={khqrProvider === 'bakong' ? 'Bakong KHQR Code' : 'ABA KHQR Code - YORN SOMNANG'}
                        className="khqr-qr-image"
                      />
                    )}
                    <div className="khqr-scan-guide">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {khqrProvider === 'bakong'
                          ? `ស្កេនបាញ់ $${total.toFixed(2)} ដោយស្វ័យប្រវត្តិទៅ ${BAKONG_API_MERCHANT_NAME}`
                          : `ស្កេន KHQR រួចវាយ $${total.toFixed(2)} ផ្ទេរចូល ${ABA_DISPLAY_NAME}`}
                      </span>
                    </div>

                    {khqrProvider === 'bakong' ? (
                      <div style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', background: paidVerified ? '#dcfce7' : '#f1f5f9', border: `1px solid ${paidVerified ? '#22c55e' : '#cbd5e1'}`, fontSize: '0.78rem' }}>
                        {paidVerified ? (
                          <div style={{ color: '#15803d', fontWeight: 800 }}>
                            ✅ បានទូទាត់ប្រាក់ជោគជ័យ! (Ref: {bakongRef})
                            {bakongSender && <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>អ្នកផ្ញើ: {bakongSender}</div>}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
                            <span style={{ color: '#0369a1', fontWeight: 700 }}>
                              🔄 កំពុងរង់ចាំការទូទាត់ (ពិនិត្យស្វ័យប្រវត្តិរៀងរាល់ 3 វិនាទី)...
                            </span>
                            <button
                              type="button"
                              onClick={() => verifyBakongPayment(false)}
                              disabled={checkingPayment}
                              style={{
                                background: '#0284c7',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {checkingPayment ? '⏳ កំពុងឆែក NBC Bakong...' : '🔍 ពិនិត្យការទូទាត់ឥឡូវនេះ'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}>
                        <div style={{ color: '#0f172a', fontWeight: 700, marginBottom: '6px' }}>
                          🏦 ABA: {ABA_USD_ACCOUNT_DISPLAY} ({ABA_DISPLAY_NAME})
                        </div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleCopyText(ABA_USD_ACCOUNT, 'លេខកុង ABA')}
                            style={{
                              background: '#003d5b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            📋 Copy លេខកុង
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyText(total.toFixed(2), 'ទឹកប្រាក់ USD')}
                            style={{
                              background: '#0284c7',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            💵 Copy ${total.toFixed(2)}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  )}

                  <div className="khqr-banks-support">
                    <span>ABA</span>
                    <span>ACLEDA</span>
                    <span>Wing</span>
                    <span>Bakong</span>
                    <span>Canadia</span>
                  </div>

                  {/* Slip Upload Box + Sender Ref (Only for ABA Direct KHQR; Bakong Auto-Pay verifies live via NBC API) */}
                  {khqrProvider === 'aba' ? (
                    <div className="khqr-slip-box">
                      <label className="slip-upload-btn" style={{ border: !slipFile ? '1.5px dashed #38bdf8' : undefined }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>{slipFile ? '✓ បានភ្ជាប់រូបវិក្កយបត្រ (ចុចដើម្បីប្ដូរ)' : '📸 ភ្ជាប់រូបវិក្កយបត្របង់ប្រាក់ ABA (តម្រូវឱ្យភ្ជាប់)'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleSlipChange} 
                          style={{ display: 'none' }} 
                        />
                      </label>

                      <input
                        type="text"
                        value={transferRef}
                        onChange={(e) => setTransferRef(e.target.value)}
                        placeholder="ឈ្មោះគណនីអ្នកផ្ញើ ឬ លេខយោង ABA (ស្រេចចិត្ត)"
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem',
                          color: '#0f172a',
                          background: '#ffffff',
                          boxSizing: 'border-box'
                        }}
                      />

                      {slipPreview && (
                        <div className="slip-preview-item">
                          <img src={slipPreview} alt="Receipt preview" className="slip-img" />
                          <span className="slip-status">✓ បានភ្ជាប់រួចរាល់</span>
                          <button type="button" onClick={handleRemoveSlip} className="slip-remove">លុបចេញ</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#334155', textAlign: 'center', fontWeight: 600 }}>
                      ⚡ ស្កេនតាម Bakong KHQR ប្រព័ន្ធនឹងផ្ទៀងផ្ទាត់លុយចូល និងបញ្ជាក់ការទិញដោយស្វ័យប្រវត្តិ (មិនបាច់ថត Slip ទេ)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instant Real-Time Payment Received Popup Modal */}
            {paidPopup && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9999,
                  background: 'rgba(2, 6, 23, 0.82)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div
                  style={{
                    background: '#0f172a',
                    border: '2px solid #22c55e',
                    borderRadius: '18px',
                    padding: '28px 24px',
                    maxWidth: '380px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(34, 197, 94, 0.35)',
                    color: '#f8fafc',
                  }}
                >
                  <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '12px' }}>✅</div>
                  <h2 style={{ margin: '0 0 8px', color: '#4ade80', fontSize: '1.35rem', fontWeight: 800 }}>
                    បានទូទាត់ប្រាក់ជោគជ័យ!
                  </h2>
                  <p style={{ margin: '0 0 12px', color: '#cbd5e1', fontSize: '0.95rem' }}>
                    ធនាគារជាតិ (Bakong) បានបញ្ជាក់ការបាញ់ប្រាក់ចំនួន{' '}
                    <strong style={{ color: '#fff' }}>${Number(paidPopup.amount).toFixed(2)}</strong> រួចរាល់!
                  </p>
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '10px', fontSize: '0.82rem', color: '#a7f3d0', marginBottom: '14px' }}>
                    <div><strong>Ref:</strong> {paidPopup.ref}</div>
                    {paidPopup.sender && <div><strong>អ្នកផ្ញើ:</strong> {paidPopup.sender}</div>}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 700 }}>
                    ⏳ កំពុងបញ្ជាក់ការបញ្ជាទិញ & ផ្ញើទៅ Telegram Bot...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Action Buttons (Only show Confirm Order button for Cash, Bakong Verified, or ABA with Slip) */}
          <div className="checkout-actions">
            {(paymentMethod === 'cash' ||
              (paymentMethod === 'khqr' && khqrProvider === 'bakong' && paidVerified) ||
              (paymentMethod === 'khqr' && khqrProvider === 'aba' && Boolean(slipFile))) ? (
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
                      {paymentMethod === 'cash'
                        ? 'បញ្ជាក់ការបញ្ជាទិញ (ទូទាត់ពេលដឹក)'
                        : paidVerified
                        ? '✅ បានទូទាត់រួចរាល់ — បញ្ជាក់ការបញ្ជាទិញ'
                        : '✅ បញ្ជាក់ការបញ្ជាទិញ (បានភ្ជាប់វិក្កយបត្រ ABA)'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.13-.05-.18-.06-.05-.15-.03-.21-.02-.1.02-1.5.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.2.14.28-.01.07.01.23-.01.35z"/>
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <div
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(14, 165, 233, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#bae6fd',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {khqrProvider === 'bakong'
                  ? '⏳ សូមស្កេនបង់ប្រាក់តាម Bakong KHQR ខាងលើ — ប្រព័ន្ធនឹងបញ្ជាក់ការបញ្ជាទិញដោយស្វ័យប្រវត្តិពេលលុយចូល!'
                  : '📸 សូមផ្ទេរប្រាក់តាម ABA រួចភ្ជាប់រូបវិក្កយបត្រ (Slip) ខាងលើ ដើម្បីបើកប៊ូតុងបញ្ជាក់ការបញ្ជាទិញ'}
              </div>
            )}

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
              តាមរយៈការចុចបញ្ជាក់ការបញ្ជាទិញ ព័ត៌មានទំនិញ {slipFile ? 'និងរូបវិក្កយបត្រ ' : ''}នឹងត្រូវបញ្ជូនទៅកាន់ប្រព័ន្ធ Telegram របស់ហាង LuckShop ដោយស្វ័យប្រវត្តិ។
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
