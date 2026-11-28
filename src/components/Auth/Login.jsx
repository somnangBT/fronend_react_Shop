import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { API_BASE_URL } from '../../config/api';
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/';
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register' || location.state?.isSignUp || false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({
    email: '',
    code: '',
    password: '',
    password_confirmation: ''
  });
  const [resetNotice, setResetNotice] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [signupNotice, setSignupNotice] = useState('');
  const [channels, setChannels] = useState({ email_ready: null, sms_ready: null });
  const [signupData, setSignupData] = useState({
    name: '',
    contact: '',
    code: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/verification-channels`, {
      headers: { Accept: 'application/json' }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.email_ready === 'boolean') {
          setChannels({ email_ready: data.email_ready, sms_ready: Boolean(data.sms_ready) });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsSignUp(true);
      setIsForgotPassword(false);
    } else if (location.pathname === '/login' && !location.state?.isSignUp) {
      setIsSignUp(false);
    }
  }, [location.pathname, location.state]);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  // Handle input changes for login form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Handle input changes for signup form
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Detect whether contact input is email or phone number
  const detectContactType = (value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return 'invalid';
    if (validateEmail(trimmed)) return 'email';
    const compact = trimmed.replace(/[\s\-()]+/g, '');
    if (/^\+?[0-9]{8,15}$/.test(compact)) return 'phone';
    return 'invalid';
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (detectContactType(formData.email) === 'invalid') {
      setError('សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ។');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok || !data.user || !data.access_token) {
        const firstError = data.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data.message || 'Invalid credentials.');
      }

      // Create user data with role and real Sanctum token from backend
      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        saved_delivery: data.user.saved_delivery || null,
        name: data.user.name,
        role: data.user.role || 'user',
        token: data.access_token
      };

      if (data.user.saved_delivery) {
        try {
          const savedKey = `luckshop_saved_delivery_v1_${data.user.id || data.user.email || 'guest'}`;
          const existingRaw = localStorage.getItem(savedKey);
          const existing = existingRaw ? JSON.parse(existingRaw) : {};
          localStorage.setItem(savedKey, JSON.stringify({
            customerName: existing.customerName || data.user.saved_delivery.customer_name || data.user.name || '',
            phone: existing.phone || data.user.saved_delivery.phone || data.user.phone || '',
            shippingAddress: existing.shippingAddress || data.user.saved_delivery.shipping_address || data.user.address || '',
            notes: existing.notes || '',
            paymentMethod: existing.paymentMethod || (data.user.saved_delivery.payment_method === 'cash' ? 'cash' : 'khqr'),
            khqrProvider: existing.khqrProvider || (data.user.saved_delivery.payment_method === 'aba_khqr' ? 'aba' : 'bakong'),
          }));
        } catch (_) {}
      }

      login(userData);

      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('user');
      }

      if (userData.role === 'admin') {
        showNotification('Welcome Admin! Login successful!', 'success');
      } else {
        showNotification('Login successful!', 'success');
      }

      setTimeout(() => {
        navigate(from && from !== '/admin' ? from : '/', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Sign Up: Validate details and send 6-digit OTP to Gmail or Phone SMS
  const handleSendRegisterCode = async (e) => {
    e.preventDefault();
    setError('');
    setSignupNotice('');

    if (!signupData.name.trim()) {
      setError('សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។');
      return;
    }

    const contactType = detectContactType(signupData.contact);
    if (contactType === 'invalid') {
      setError('សូមបញ្ចូល Gmail ឬលេខទូរស័ព្ទ (ឧ. 012 345 678) ឱ្យបានត្រឹមត្រូវ។');
      return;
    }

    if (signupData.password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។');
      return;
    }

    if (signupData.password !== signupData.password_confirmation) {
      setError('ពាក្យសម្ងាត់ និងការបញ្ជាក់មិនត្រូវគ្នាទេ។');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          contact: signupData.contact.trim()
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      if (!response.ok) {
        const firstError = data.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data.message || 'មិនអាចផ្ញើលេខកូដផ្ទៀងផ្ទាត់បានទេ។');
      }

      setSignupNotice(data.message || 'លេខកូដ ៦ ខ្ទង់ត្រូវបានផ្ញើរួចរាល់!');
      setSignupData((prev) => ({ ...prev, code: '' }));
      setSignupStep(2);
    } catch (err) {
      setError(err.message || 'មានបញ្ហាក្នុងការផ្ញើលេខកូដផ្ទៀងផ្ទាត់។');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Sign Up: Verify OTP & Complete Account Creation
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupData.code.trim().length !== 6) {
      setError('សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់។');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: signupData.name.trim(),
          contact: signupData.contact.trim(),
          code: signupData.code.trim(),
          password: signupData.password,
          password_confirmation: signupData.password_confirmation
        })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      if (!response.ok || !data.user || !data.access_token) {
        const firstError = data.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstError || data.message || 'Registration failed');
      }

      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        phone: data.user.phone || '',
        name: data.user.name,
        role: data.user.role || 'user',
        token: data.access_token
      };

      login(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('user');

      showNotification('🎉 ចុះឈ្មោះ និងផ្ទៀងផ្ទាត់ជោគជ័យ!', 'success');
      setTimeout(() => {
        navigate(from && from !== '/admin' ? from : '/', { replace: true });
      }, 1400);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Forgot Password" click -> open recovery flow
  const handleForgotPassword = () => {
    setError('');
    setResetNotice('');
    setIsSignUp(false);
    setResetStep(1);
    setResetData({
      email: formData.email || '',
      code: '',
      password: '',
      password_confirmation: ''
    });
    setIsForgotPassword(true);
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setError('');
    setResetNotice('');

    if (!validateEmail(resetData.email.trim())) {
      setError('សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: resetData.email.trim() })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstErr = data.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstErr || data.message || 'មិនអាចផ្ញើលេខកូដបានទេ។');
      }

      setResetNotice(data.message || 'សំណើកូដ ៦ ខ្ទង់ត្រូវបានបញ្ជូនរួចរាល់!');
      setResetStep(2);
    } catch (err) {
      setError(err.message || 'មានបញ្ហាក្នុងការស្នើសុំលេខកូដ។');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetData.code.trim() || resetData.code.trim().length !== 6) {
      setError('សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់។');
      return;
    }
    if (resetData.password.length < 6) {
      setError('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ។');
      return;
    }
    if (resetData.password !== resetData.password_confirmation) {
      setError('ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់មិនត្រូវគ្នាទេ។');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: resetData.email.trim(),
          code: resetData.code.trim(),
          password: resetData.password,
          password_confirmation: resetData.password_confirmation
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstErr = data.errors ? Object.values(data.errors).flat()[0] : null;
        throw new Error(firstErr || data.message || 'មិនអាចកំណត់ពាក្យសម្ងាត់ថ្មីបានទេ។');
      }

      showNotification(data.message || 'បានផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!', 'success');
      setIsForgotPassword(false);
      setResetStep(1);
      setResetNotice('');
      setFormData({
        email: resetData.email.trim(),
        password: ''
      });
    } catch (err) {
      setError(err.message || 'មានបញ្ហាក្នុងការកំណត់ពាក្យសម្ងាត់។');
    } finally {
      setIsLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `login-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }, 100);
  };

  return (
    <section className="login-section">
      <div className="login-grid-overlay"></div>
      <div className="login-glow-orb login-glow-1"></div>
      <div className="login-glow-orb login-glow-2"></div>

      <div className="login-container">
        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">
              {isForgotPassword
                ? 'Reset Password'
                : isSignUp
                ? 'Create Account'
                : 'Welcome Back'}
            </h1>
            <p className="login-subtitle">
              {isForgotPassword
                ? resetStep === 1
                  ? 'Enter your email to receive a 6-digit verification code'
                  : 'Enter the 6-digit code and set your new password'
                : isSignUp
                ? 'Create your LuckShop account'
                : 'Login to access your account'}
            </p>
          </div>

          {error && (
            <div className="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isForgotPassword ? (
            resetStep === 1 ? (
              <form className="login-form" onSubmit={handleRequestResetCode}>
                <div className="form-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="reset-email"
                      name="email"
                      value={resetData.email}
                      onChange={handleResetChange}
                      required
                      placeholder="Enter your account email"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Sending Request...' : 'Send Reset Code'}
                  <div className="btn-glow"></div>
                </button>

                <div className="login-footer">
                  <p>
                    Remember your password?{' '}
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setError('');
                      }}
                      disabled={isLoading}
                    >
                      Back to Log In
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleResetPasswordSubmit}>
                {resetNotice && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(14, 165, 233, 0.14)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#bae6fd',
                      fontSize: '0.85rem',
                      marginBottom: '12px',
                      lineHeight: 1.5,
                    }}
                  >
                    {resetNotice}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="reset-code">6-Digit Verification Code</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="reset-code"
                      name="code"
                      maxLength={6}
                      value={resetData.code}
                      onChange={handleResetChange}
                      required
                      placeholder="123456"
                      disabled={isLoading}
                    />
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reset-password">New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reset-password"
                      name="password"
                      value={resetData.password}
                      onChange={handleResetChange}
                      required
                      placeholder="Create a new password (min 6)"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reset-password-confirm">Confirm New Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="reset-password-confirm"
                      name="password_confirmation"
                      value={resetData.password_confirmation}
                      onChange={handleResetChange}
                      required
                      placeholder="Confirm new password"
                      disabled={isLoading}
                    />
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                  <div className="btn-glow"></div>
                </button>

                <div className="login-footer">
                  <p>
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={() => {
                        setResetStep(1);
                        setError('');
                      }}
                      disabled={isLoading}
                    >
                      Resend Code
                    </button>{' '}
                    |{' '}
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setError('');
                      }}
                      disabled={isLoading}
                    >
                      Back to Log In
                    </button>
                  </p>
                </div>
              </form>
            )
          ) : isSignUp ? (
            signupStep === 1 ? (
              <form className="login-form" onSubmit={handleSendRegisterCode}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      required
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-contact">Gmail or Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="signup-contact"
                      name="contact"
                      value={signupData.contact}
                      onChange={handleSignupChange}
                      required
                      placeholder="example@gmail.com ឬ 012 345 678"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div className="input-focus-effect"></div>
                  </div>
                  {signupData.contact.trim() && (
                    <div style={{ fontSize: '0.78rem', marginTop: '6px', color: detectContactType(signupData.contact) === 'phone' && channels.sms_ready === false ? '#fbbf24' : '#94a3b8' }}>
                      {detectContactType(signupData.contact) === 'email'
                        ? '📧 លេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់នឹងផ្ញើទៅ Gmail របស់អ្នក'
                        : detectContactType(signupData.contact) === 'phone'
                        ? channels.sms_ready === false
                          ? '⚠️ សេវាកម្មផ្ញើ SMS មិនទាន់ភ្ជាប់ API Key ទេ — សូមប្រើ Gmail ដើម្បីចុះឈ្មោះសិន!'
                          : '📱 លេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់នឹងផ្ញើជា SMS ទៅលេខទូរស័ព្ទអ្នក'
                        : 'សូមបញ្ចូល Gmail ឬលេខទូរស័ព្ទត្រឹមត្រូវ (៨-១៥ ខ្ទង់)'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="signup-password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                      placeholder="Create a password (min 6)"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={signupData.password_confirmation}
                      onChange={handleSignupChange}
                      required
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-btn signup-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'កំពុងផ្ញើលេខកូដ...' : 'ផ្ញើលេខកូដផ្ទៀងផ្ទាត់ (Send Code)'}
                  <div className="btn-glow"></div>
                </button>

                <div className="login-footer">
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={() => {
                        setIsSignUp(false);
                        setSignupStep(1);
                        setError('');
                      }}
                      disabled={isLoading}
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleSignupSubmit}>
                {signupNotice && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(14, 165, 233, 0.14)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#bae6fd',
                      fontSize: '0.85rem',
                      marginBottom: '14px',
                      lineHeight: 1.5,
                    }}
                  >
                    {signupNotice}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="signup-code">លេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់ (Verification Code)</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="signup-code"
                      name="code"
                      maxLength={6}
                      value={signupData.code}
                      onChange={handleSignupChange}
                      required
                      placeholder="បញ្ចូលលេខកូដ ៦ ខ្ទង់ (ឧ. 123456)"
                      disabled={isLoading}
                    />
                    <div className="input-focus-effect"></div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-btn signup-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់ និងបង្កើតគណនី'}
                  <div className="btn-glow"></div>
                </button>

                <div className="login-footer">
                  <p>
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={handleSendRegisterCode}
                      disabled={isLoading}
                    >
                      ផ្ញើកូដម្ដងទៀត
                    </button>{' '}
                    |{' '}
                    <button
                      type="button"
                      className="switch-form-btn"
                      onClick={() => {
                        setSignupStep(1);
                        setError('');
                      }}
                      disabled={isLoading}
                    >
                      កែព័ត៌មាន
                    </button>
                  </p>
                </div>
              </form>
            )
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email or Phone Number</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your Gmail or phone number"
                    disabled={isLoading}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div className="input-focus-effect"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="input-icon">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                  <div className="input-focus-effect"></div>
                </div>
              </div>

              <div className="remember-me">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <span className="checkmark"></span>
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
                <div className="btn-glow"></div>
              </button>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="switch-form-btn"
                    onClick={() => {
                      setIsSignUp(true);
                      setSignupStep(1);
                      setSignupNotice('');
                      setError('');
                    }}
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="login-decoration">
          <div className="login-image-container">
            <div className="login-brand-showcase">
              <img
                src="/logo512.png"
                alt="LuckShop Logo"
                className="login-brand-logo"
              />
              <h2 className="login-brand-title">Luck<span>Shop</span></h2>
              <p className="login-brand-subtitle">ទំនិញគុណភាព • តម្លៃសមរម្យ • ទំនុកចិត្ត</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;