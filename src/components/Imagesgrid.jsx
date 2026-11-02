import React from 'react';
import { KhmerDivider, KhmerAngkorCrest, KhmerFrieze, KhmerPediment, KhmerPhkaChan } from './KhmerOrnament';
import "./styles/Imagesgrid.css";

const Imagesgrid = () => {
    return (
        <section className="images-section khmer-bg-watermark">
            <KhmerFrieze />
            <div className="images-grid-overlay"></div>
            <div className="images-glow-orb images-glow-1"></div>
            <div className="images-glow-orb images-glow-2"></div>
            
            <div className="images-container">
                <div className="images-header">
                    <KhmerPediment width={340} />
                    <div className="images-badge-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
                        <div className="images-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <KhmerPhkaChan size={15} />
                            <span>🌟 វិចិត្រសាលមុខម្ហូប & អាហារស្រស់ៗ 🌟</span>
                            <KhmerPhkaChan size={15} />
                        </div>
                    </div>
                    <h2 className="images-title">
                        ទស្សនាម្ហូបឆ្ងាញ់ៗ & 
                        <span className="images-title-accent" data-text="អាហារស្រស់ៗ"> អាហារស្រស់ៗ</span>
                    </h2>
                    <KhmerDivider />
                    <p className="images-subtitle">
                        បណ្តុំរូបភាពមុខម្ហូបចំអិនផ្ទាល់ក្តៅៗ និងគ្រឿងផ្សំអាហារស្រស់ៗធម្មជាតិប្រចាំហាង DeliciousEats
                    </p>
                </div>
                
                <div className="images-grid">
                    <div className="grid-item large">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" alt="Khmer Beef Lok Lak" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">ឡុកឡាក់សាច់គោបែបខ្មែរក្តៅៗ</h3>
                                <p className="image-description">សាច់គោទន់ៗឆាលើខ្ទះក្តៅៗ ជាមួយម្រេចកំពត និងបាយស</p>
                            </div>
                            <div className="image-badge">🍳 ចម្អិនក្តៅៗ</div>
                        </div>
                    </div>
                    
                    <div className="grid-item">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80" alt="Fresh Salmon" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">សាច់ត្រីសាល់ម៉ុនស្រស់</h3>
                            </div>
                            <div className="image-badge">🌿 ស្រស់ ១០០%</div>
                        </div>
                    </div>
                    
                    <div className="grid-item">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80" alt="Seafood Fried Rice" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">បាយឆាគ្រឿងសមុទ្រ</h3>
                            </div>
                            <div className="image-badge new">🍳 ថ្មីៗ</div>
                        </div>
                    </div>
                    
                    <div className="grid-item">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80" alt="Wagyu Beef" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">សាច់គោ Wagyu ស្រស់</h3>
                                <p className="image-description">សាច់គោ Wagyu អូស្ត្រាលីកាត់ស្រស់ៗ សាច់ទន់រលាយក្នុងមាត់</p>
                            </div>
                            <div className="image-badge">🌿 ស្រស់ ១០០%</div>
                        </div>
                    </div>
                    
                    <div className="grid-item">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&auto=format&fit=crop&q=80" alt="Tiger Prawns" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">បង្គាសមុទ្រស្រស់</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid-item">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80" alt="Fried Chicken" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">មាន់បំពងស្រួយក្តៅៗ</h3>
                            </div>
                            <div className="image-badge discount">-15% OFF</div>
                        </div>
                    </div>
                    
                    <div className="grid-item horizontal">
                        <div className="image-container">
                            <div className="image-glow"></div>
                            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80" alt="Organic Salad" className="grid-image" />
                            <div className="image-overlay">
                                <h3 className="image-title">បន្លែសាឡាដសរីរាង្គស្រស់ធម្មជាតិ</h3>
                                <p className="image-description">ដាំតាមកសិដ្ឋានសរីរាង្គ គ្មានជាតិគីមី ស្រួយស្រស់ និងផ្ដល់សុខភាពល្អ</p>
                            </div>
                            <div className="image-badge">🌿 Organic</div>
                        </div>
                    </div>
                </div>
                
                <div className="images-cta-container">
                    <a href="#products" className="images-cta-button">
                        <span className="cta-text">កុម្ម៉ង់មុខម្ហូបឥឡូវនេះ</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="cta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Imagesgrid;
