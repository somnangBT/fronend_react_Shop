import React, { useState } from 'react';
import { KhmerDivider, KhmerPediment, KhmerPhkaChan } from './KhmerOrnament';
import "./styles/Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Create mailto link with form data
            const mailtoLink = `mailto:younsomnang4@gmail.com?subject=${encodeURIComponent(formData.subject || 'សារពីអតិថិជន DeliciousEats')}&body=${encodeURIComponent(
                `ឈ្មោះ: ${formData.name}\nអ៊ីមែល: ${formData.email}\n\nខ្លឹមសារសារ:\n${formData.message}`
            )}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            setSubmitStatus('success');
            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            // Clear status after 5 seconds
            setTimeout(() => {
                setSubmitStatus(null);
            }, 5000);
        }
    };
    
    return (
        <section className="contact-section khmer-bg-watermark">
            <div className="contact-grid-overlay"></div>
            <div className="contact-glow-orb contact-glow-1"></div>
            <div className="contact-glow-orb contact-glow-2"></div>
            
            <div className="contact-container">
                <div className="contact-header">
                    <KhmerPediment width={360} />
                    <div className="contact-badge-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
                        <div className="contact-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <KhmerPhkaChan size={15} />
                            <span>សេវាកម្មរហ័សទាន់ចិត្ត • ២៤/៧</span>
                            <KhmerPhkaChan size={15} />
                        </div>
                    </div>
                    <h2 className="contact-title">
                        ទំនាក់ទំនងមកកាន់
                        <span className="contact-title-accent" data-text="DeliciousEats"> DeliciousEats</span>
                    </h2>
                    <KhmerDivider />
                    <p className="contact-subtitle">
                        មានចម្ងល់អំពីការកុម្ម៉ង់មុខម្ហូប សេវាកម្មដឹកជញ្ជូន ឬការសហការផ្សេងៗ សូមផ្ញើសារមកកាន់យើងដោយរីករាយ
                    </p>
                </div>
                
                <div className="contact-content">
                    <div className="contact-form-container">
                        <div className="form-header">
                            <div className="form-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="form-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="form-title">ផ្ញើសារមកកាន់យើង</h3>
                        </div>
                        
                        {submitStatus === 'success' && (
                            <div className="form-status-message success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <p>សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ! យើងនឹងឆ្លើយតបឆាប់ៗនេះ។</p>
                            </div>
                        )}
                        
                        {submitStatus === 'error' && (
                            <div className="form-status-message error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p>មានបញ្ហាក្នុងការផ្ញើសារ។ សូមព្យាយាមម្តងទៀត ឬខលមកកាន់យើងផ្ទាល់។</p>
                            </div>
                        )}
                        
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="form-input" 
                                        placeholder=" " 
                                        required
                                        value={formData.name}
                                        onChange={handleChange} 
                                    />
                                    <label htmlFor="name" className="form-label">ឈ្មោះរបស់អ្នក</label>
                                    <div className="input-glow"></div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="form-input" 
                                        placeholder=" " 
                                        required
                                        value={formData.email}
                                        onChange={handleChange} 
                                    />
                                    <label htmlFor="email" className="form-label">អ៊ីមែលរបស់អ្នក</label>
                                    <div className="input-glow"></div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <select 
                                        id="subject" 
                                        className="form-input form-select" 
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>សូមជ្រើសរើសប្រធានបទ</option>
                                        <option value="ការកុម្ម៉ង់មុខម្ហូប">ការកុម្ម៉ង់មុខម្ហូប & អាហារស្រស់</option>
                                        <option value="សេវាកម្មដឹកជញ្ជូន">សេវាកម្មដឹកជញ្ជូន</option>
                                        <option value="កិច្ចសហការអាជីវកម្ម">កិច្ចសហការអាជីវកម្ម / ផ្គត់ផ្គង់</option>
                                        <option value="ការផ្តល់មតិកែលម្អ">ការផ្តល់មតិកែលម្អ ឬសំណូមពរ</option>
                                    </select>
                                    <div className="input-glow"></div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <textarea 
                                        id="message" 
                                        className="form-input form-textarea" 
                                        rows="5" 
                                        placeholder=" " 
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                    <label htmlFor="message" className="form-label">ខ្លឹមសារសាររបស់អ្នក...</label>
                                    <div className="input-glow"></div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`form-submit-btn ${isSubmitting ? 'submitting' : ''}`} 
                                disabled={isSubmitting}
                            >
                                <span className="btn-text">
                                    {isSubmitting ? 'កំពុងផ្ញើសារ...' : 'ផ្ញើសារឥឡូវនេះ ➔'}
                                </span>
                                {!isSubmitting && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                                <span className="btn-pulse"></span>
                            </button>
                        </form>
                    </div>
                    
                    <div className="contact-info-container">
                        <div className="info-card">
                            <div className="info-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <h4 className="info-title">ទីតាំងហាង</h4>
                                <p className="info-text">រាជធានីភ្នំពេញ, ប្រទេសកម្ពុជា</p>
                                <p className="info-text">សេវាដឹកជញ្ជូនរហ័សគ្រប់ខណ្ឌ</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <h4 className="info-title">ម៉ោងបើកបម្រើ</h4>
                                <p className="info-text">រៀងរាល់ថ្ងៃ: ៧:០០ ព្រឹក - ៩:០០ យប់</p>
                                <p className="info-text">កុម្ម៉ង់អនឡាញ: ២៤/៧</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon-container">
                                <svg xmlns="http://www.w3.org/2000/svg" className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="info-content">
                                <h4 className="info-title">ព័ត៌មានទំនាក់ទំនង</h4>
                                <p className="info-text">ទូរស័ព្ទ: +855 (0) 969 420 333 / 012 345 678</p>
                                <p className="info-text">អ៊ីមែល: younsomnang4@gmail.com</p>
                            </div>
                        </div>
                        
                        <div className="social-links">
                            <h4 className="social-title">តាមដានយើងតាមបណ្តាញសង្គម</h4>
                            <div className="social-icons">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-container" title="Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="social-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </a>
                                <a href="https://telegram.org" target="_blank" rel="noreferrer" className="social-icon-container" title="Telegram">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="social-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-container" title="Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="social-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    </svg>
                                </a>
                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon-container" title="TikTok">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="social-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="contact-map">
                    <div className="map-header">
                        <h3 className="map-title">ផែនទី <span className="map-title-accent">ទីតាំងរបស់យើង</span></h3>
                    </div>
                    <div className="map-container">
                        <div className="map-overlay">
                            <div className="map-marker"></div>
                            <div className="map-pulse"></div>
                        </div>
                        <iframe 
                            title="DeliciousEats Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250151.94732948628!2d104.7340319545897!3d11.552552384962324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1684930946039!5m2!1sen!2skh" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
            
            <div className="contact-shape-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default Contact;
