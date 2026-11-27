// About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { KhmerDivider, KhmerPediment, KhmerPhkaChan, KhmerTevada } from './KhmerOrnament';
import './styles/About.css';

const About = () => {
    return (
        <section className="about-section khmer-bg-watermark">
            <div className="about-grid-overlay"></div>
            <div className="about-glow-orb about-glow-1"></div>
            <div className="about-glow-orb about-glow-2"></div>
            
            <div className="about-container">
                <div className="about-header">
                    <KhmerPediment width={360} />
                    <div className="about-badge-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
                        <div className="about-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <KhmerTevada size={22} />
                            <KhmerPhkaChan size={15} />
                            <span>បង្កើតឡើងនៅឆ្នាំ ២០២៥ • រាជធានីភ្នំពេញ</span>
                            <KhmerPhkaChan size={15} />
                        </div>
                    </div>
                    <h2 className="about-title">
                        ចក្ខុវិស័យ & ដំណើរដើមទង
                        <span className="about-title-accent" data-text="LuckShop"> LuckShop</span>
                    </h2>
                    <KhmerDivider />
                    <p className="about-subtitle">
                        ហាងលក់ទំនិញគ្រប់មុខអនឡាញគុណភាពខ្ពស់ តម្លៃសមរម្យ និងការទូទាត់ទំនើបតាម Bakong / ABA KHQR
                    </p>
                </div>
                
                <div className="about-content">
                    <div className="about-image-container">
                        <div className="about-image-wrapper">
                            <div className="about-image-glow"></div>
                            <img src="/logo512.png" alt="LuckShop Cambodia" className="about-image" />
                            <div className="about-image-badge">គុណភាពល្អ &amp; ទំនុកចិត្ត ១០០%</div>
                        </div>
                    </div>
                    
                    <div className="about-text-container">
                        <p className="about-text">
                            <strong>LuckShop</strong> គឺជាហាងលក់ទំនិញគ្រប់មុខតាមអនឡាញនៅរាជធានីភ្នំពេញ ដែលនាំយកទំនិញចម្រុះមានគុណភាពខ្ពស់ និងតម្លៃសមរម្យជូនអតិថិជនគ្រប់រូប។
                        </p>
                        
                        <p className="about-text">
                            អតិថិជនអាចជ្រើសរើសបញ្ជាទិញទំនិញគ្រប់ប្រភេទ ទូទាត់ងាយស្រួលតាម Bakong KHQR / ABA KHQR និងតាមដានស្ថានភាពដឹកជញ្ជូនផ្ទាល់បានយ៉ាងរហ័ស។
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(255, 255, 255, 0.1)', margin: '0.5rem 0 1.25rem' }}>
                            <img
                                src="/images/yorn-somnang.jpg"
                                alt="YORN SOMNANG"
                                style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '2px solid rgba(245, 158, 11, 0.65)', flexShrink: 0 }}
                            />
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.4px' }}>YORN SOMNANG</div>
                                <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>ម្ចាស់ហាង &amp; អ្នកអភិវឌ្ឍន៍ LuckShop</div>
                            </div>
                        </div>
                        
                        <div className="about-highlights">
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="highlight-text">ទំនិញគ្រប់មុខ</span>
                            </div>
                            
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                                    </svg>
                                </div>
                                <span className="highlight-text">តម្លៃសមរម្យ</span>
                            </div>
                            
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="highlight-text">សុវត្ថិភាព &amp; ជឿជាក់</span>
                            </div>
                        </div>
                        
                        <div className="about-cta">
                            <Link to="/products" className="about-cta-button">
                                <span className="cta-text">ទស្សនាមុខទំនិញទាំងអស់ ➔</span>
                                <span className="cta-pulse"></span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="about-stats">
                    <div className="about-stat-card">
                        <div className="stat-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-number">ច្រើនប្រភេទ</span>
                            <span className="stat-label">ទំនិញគុណភាពល្អ</span>
                        </div>
                    </div>
                    
                    <div className="about-stat-card">
                        <div className="stat-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-number">១៥-២៥ នាទី</span>
                            <span className="stat-label">ដឹកជញ្ជូនរហ័ស</span>
                        </div>
                    </div>
                    
                    <div className="about-stat-card">
                        <div className="stat-icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <span className="stat-number">១០,០០០+</span>
                            <span className="stat-label">អតិថិជនពេញចិត្ត</span>
                        </div>
                    </div>
                </div>
                
                <div className="about-experience">
                    <h3 className="experience-title">សេវាកម្ម <span className="experience-title-accent">របស់ LuckShop</span></h3>
                    
                    <div className="experience-grid">
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>🛍️</span>
                            </div>
                            <h4 className="experience-name">ទំនិញចម្រុះគ្រប់មុខ</h4>
                            <p className="experience-description">
                                ប្រមូលផ្តុំទំនិញប្រើប្រាស់ គ្រឿងសម្អាង សម្ភារៈទូទៅ និងផលិតផលគុណភាពខ្ពស់ជាច្រើនមុខ។
                            </p>
                        </div>
                        
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>💳</span>
                            </div>
                            <h4 className="experience-name">ទូទាត់ KHQR សុវត្ថិភាព</h4>
                            <p className="experience-description">
                                គាំទ្រការស្កេន Bakong KHQR និង ABA Bank ផ្ទាល់ ជាមួយការផ្ទៀងផ្ទាត់រហ័សទាន់ចិត្ត។
                            </p>
                        </div>
                        
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>🚀</span>
                            </div>
                            <h4 className="experience-name">កុម្ម៉ង់ងាយស្រួល &amp; ដឹកលឿន</h4>
                            <p className="experience-description">
                                កុម្ម៉ង់តាមគេហទំព័ររហ័សទាន់ចិត្ត តាមដានស្ថានភាពបញ្ជាទិញបាន និងដឹកជញ្ជូនដល់ទីតាំង។
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="about-team">
                    <h3 className="team-title">ស្ថាបនិក &amp; អ្នកអភិវឌ្ឍន៍ <span className="team-title-accent">LuckShop</span></h3>
                    <KhmerDivider />
                    
                    <div className="team-members" style={{ gridTemplateColumns: 'minmax(280px, 380px)', justifyContent: 'center' }}>
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="/images/yorn-somnang.jpg" alt="YORN SOMNANG" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">YORN SOMNANG</h4>
                                <p className="member-role">Founder &amp; Full-Stack Developer</p>
                                <p className="member-bio">ម្ចាស់ហាង និងដឹកនាំការរចនា អភិវឌ្ឍន៍ប្រព័ន្ធ Backend / Frontend របស់ LuckShop</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="about-shape-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default About;
