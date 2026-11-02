// About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { KhmerDivider, KhmerAngkorCrest, KhmerPediment, KhmerPhkaChan, KhmerTevada } from './KhmerOrnament';
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
                        <span className="about-title-accent" data-text="DeliciousEats"> DeliciousEats</span>
                    </h2>
                    <KhmerDivider />
                    <p className="about-subtitle">
                        ការរួមបញ្ចូលគ្នារវាងរសជាតិម្ហូបខ្មែរប្រពៃណីពិតៗ គ្រឿងផ្សំស្រស់ធម្មជាតិ និងបច្ចេកវិទ្យាបញ្ជាទិញទំនើប
                    </p>
                </div>
                
                <div className="about-content">
                    <div className="about-image-container">
                        <div className="about-image-wrapper">
                            <div className="about-image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80" alt="DeliciousEats Cambodia" className="about-image" />
                            <div className="about-image-badge">រសជាតិខ្មែរពិតៗ ១០០%</div>
                        </div>
                    </div>
                    
                    <div className="about-text-container">
                        <p className="about-text">
                            បង្កើតឡើងនៅរាជធានីភ្នំពេញ <strong>DeliciousEats</strong> ចាប់ផ្តើមឡើងដោយក្តីស្រឡាញ់ចំពោះម្ហូបខ្មែរ និងការចង់ឱ្យបងប្អូនទាំងអស់ទទួលបានអាហារដែលមានអនាម័យខ្ពស់ រសជាតិឆ្ងាញ់ពិតៗ ដូចស្នាដៃអ្នកម្តាយធ្វើនៅផ្ទះ ព្រមទាំងបន្លែសាច់ស្រស់ៗធម្មជាតិសម្រាប់ចម្អិនដោយផ្ទាល់ខ្លួន។
                        </p>
                        
                        <p className="about-text">
                            យើងសហការផ្ទាល់ជាមួយកសិករក្នុងស្រុក ដើម្បីនាំយកបន្លែ ផ្លែឈើ និងសាច់ស្រស់ៗគ្មានជាតិគីមី មកចម្អិនជាម្ហូបក្តៅៗភ្លាមៗតាមការកុម្ម៉ង់ ឬវេចខ្ចប់ដឹកជូនអ្នកយ៉ាងមានអនាម័យនិងសុវត្ថិភាពបំផុត។
                        </p>
                        
                        <div className="about-highlights">
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="highlight-text">រូបមន្តខ្មែរដើម</span>
                            </div>
                            
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                                    </svg>
                                </div>
                                <span className="highlight-text">កសិផលក្នុងស្រុក</span>
                            </div>
                            
                            <div className="about-highlight-item">
                                <div className="highlight-icon-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="highlight-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="highlight-text">អនាម័យស្តង់ដារ</span>
                            </div>
                        </div>
                        
                        <div className="about-cta">
                            <Link to="/products" className="about-cta-button">
                                <span className="cta-text">ទស្សនាមុខម្ហូបទាំងអស់ ➔</span>
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
                            <span className="stat-number">៥០+</span>
                            <span className="stat-label">មុខម្ហូប & គ្រឿងផ្សំ</span>
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
                    <h3 className="experience-title">សេវាកម្ម <span className="experience-title-accent">របស់ DeliciousEats</span></h3>
                    
                    <div className="experience-grid">
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>🌿</span>
                            </div>
                            <h4 className="experience-name">អាហារស្រស់ៗធម្មជាតិ</h4>
                            <p className="experience-description">
                                បន្លែ ផ្លែឈើ សាច់ស្រស់ និងគ្រឿងទេសប្រពៃណីខ្មែរ ដែលជ្រើសរើសយ៉ាងសម្រិតសម្រាំងសម្រាប់ចម្អិនខ្លួនឯង។
                            </p>
                        </div>
                        
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>🍳</span>
                            </div>
                            <h4 className="experience-name">ម្ហូបចំអិនផ្ទាល់ក្តៅៗ</h4>
                            <p className="experience-description">
                                មុខម្ហូបខ្មែរឆ្ងាញ់ៗ ចម្អិនភ្លាមៗក្រោយពេលកុម្ម៉ង់ ធានាភាពក្តៅឈ្ងុយឆ្ងាញ់ និងរក្សាបាននូវឱជារសដើម។
                            </p>
                        </div>
                        
                        <div className="experience-card">
                            <div className="experience-icon-container">
                                <span style={{ fontSize: '1.8rem' }}>🚀</span>
                            </div>
                            <h4 className="experience-name">កុម្ម៉ង់ងាយស្រួល & ដឹកលឿន</h4>
                            <p className="experience-description">
                                កុម្ម៉ង់តាមគេហទំព័ររហ័សទាន់ចិត្ត តាមដានស្ថានភាពបញ្ជាទិញបាន និងមានជម្រើសទូទាត់ប្រាក់ច្រើនបែប។
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="about-team">
                    <h3 className="team-title">ក្រុមការងារអភិវឌ្ឍន៍ <span className="team-title-accent">DeliciousEats</span></h3>
                    <KhmerDivider />
                    
                    <div className="team-members">
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="Yorn somnang" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Yorn Somnang</h4>
                                <p className="member-role">Full-Stack Developer</p>
                                <p className="member-bio">ដឹកនាំការរចនាប្រព័ន្ធ និងអភិវឌ្ឍន៍ Backend/Frontend</p>
                            </div>
                        </div>
                        
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="Un pheasa" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Un Pheasa</h4>
                                <p className="member-role">Frontend Developer</p>
                                <p className="member-bio">អភិវឌ្ឍន៍ផ្ទាំង UI/UX និងមុខងារទំនាក់ទំនងអ្នកប្រើប្រាស់</p>
                            </div>
                        </div>
                        
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="srouch srean" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Srouch Srean</h4>
                                <p className="member-role">Backend Developer</p>
                                <p className="member-bio">រៀបចំ API និង Database គ្រប់គ្រងទិន្នន័យផលិតផល</p>
                            </div>
                        </div>
                        
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="pan sothea" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Pan Sothea</h4>
                                <p className="member-role">UI/UX Designer</p>
                                <p className="member-bio">រចនារូបរាងទំព័រ និងការផ្សំក្បាច់រចនាបថខ្មែរ</p>
                            </div>
                        </div>
                        
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="prak porsann" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Prak Porsann</h4>
                                <p className="member-role">Quality Assurance</p>
                                <p className="member-bio">ត្រួតពិនិត្យមុខងារ និងគុណភាពកម្មវិធី</p>
                            </div>
                        </div>
                        
                        <div className="team-member-card">
                            <div className="member-image-container">
                                <div className="member-image-glow"></div>
                                <img src="https://i.pinimg.com/736x/ed/0a/1e/ed0a1e01f31048314bbb5320acf9e813.jpg" alt="Nhanh kimson" className="member-image" />
                            </div>
                            <div className="member-info">
                                <h4 className="member-name">Nhanh Kimson</h4>
                                <p className="member-role">Frontend Developer</p>
                                <p className="member-bio">អភិវឌ្ឍន៍មុខងារបញ្ជាទិញ និងប្រព័ន្ធ Cart/Checkout</p>
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
