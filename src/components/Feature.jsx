import React from 'react';
import { Link } from 'react-router-dom';
import { KhmerDivider, KhmerAngkorCrest, KhmerPediment } from './KhmerOrnament';
import './styles/Feature.css';

const Features = () => {
  return (
    <section className="features-section khmer-bg-watermark" id="features">
      <div className="features-container">
        <div className="features-header">
          <KhmerPediment width={340} />
          <div className="features-title-wrapper">
            <div className="features-subtitle-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
              <span className="features-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <KhmerAngkorCrest size={18} />
                <span>ហេតុអ្វីជ្រើសរើស DeliciousEats?</span>
              </span>
            </div>
            <h2 className="features-title">បទពិសោធន៍ម្ហូបឆ្ងាញ់ & អាហារស្រស់ៗកម្រិតខ្ពស់</h2>
            <KhmerDivider />
          </div>
          <p className="features-description">
            យើងប្តេជ្ញាផ្តល់ជូននូវអាហារស្រស់ៗធម្មជាតិ ១០០% និងមុខម្ហូបចំអិនផ្ទាល់ក្តៅៗប្រកបដោយអនាម័យខ្ពស់ រសជាតិខ្មែរពិតៗ ដឹកជញ្ជូនរហ័សដល់គេហដ្ឋាន។
          </p>
        </div>
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">ដឹកជញ្ជូនរហ័សទាន់ចិត្ត</h3>
            <p className="feature-text">
              ការកុម្ម៉ង់របស់អ្នកនឹងទៅដល់មាត់ទ្វារក្នុងរយៈពេល ១៥-៣០ នាទី ធានានូវភាពក្តៅស្រស់ និងឆ្ងាញ់ជានិច្ច។
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="feature-title">គ្រឿងផ្សំស្រស់ធម្មជាតិ ១០០%</h3>
            <p className="feature-text">
              យើងជ្រើសរើសតែបន្លែ សាច់ និងគ្រឿងផ្សំស្រស់ៗបំផុតពីកសិដ្ឋាន និងអ្នកផ្គត់ផ្គង់ក្នុងស្រុកដែលគួរឱ្យទុកចិត្ត។
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="feature-title">ប្រូម៉ូសិន & តម្លៃសមរម្យ</h3>
            <p className="feature-text">
              រីករាយជាមួយការបញ្ចុះតម្លៃពិសេសប្រចាំសប្តាហ៍ ឈុតមុខម្ហូបពិសេសៗ និងពិន្ទុរង្វាន់សម្រាប់អតិថិជនស្មោះត្រង់។
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="feature-title">អាចបញ្ជាក់រសជាតិបាន</h3>
            <p className="feature-text">
              អ្នកអាចកំណត់កម្រិតហិរ ផ្អែម ប្រៃ ឬគ្រឿងផ្សំតាមចំណង់ចំណូលចិត្តរបស់អ្នកបានយ៉ាងងាយស្រួល។
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="feature-title">ការទូទាត់ប្រាក់មានសុវត្ថិភាព</h3>
            <p className="feature-text">
              ជម្រើសទូទាត់ប្រាក់ច្រើនប្រភេទ រួមមាន ABA KHQR, វីង, ធនាគារក្នុងស្រុក និងការទូទាត់ជាសាច់ប្រាក់ពេលទទួលទំនិញ (COD)។
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="feature-title">សេវាកម្មរាក់ទាក់ ២៤/៧</h3>
            <p className="feature-text">
              ក្រុមការងារបម្រើអតិថិជនរបស់យើងរង់ចាំជួយ និងដោះស្រាយរាល់ចម្ងល់របស់អ្នកគ្រប់ពេលវេលាប្រកបដោយស្នាមញញឹម។
            </p>
          </div>
        </div>
        
        <div className="features-highlight">
          <div className="highlight-content">
            <h3 className="highlight-title">សាកល្បងមុខម្ហូបប្រចាំរដូវកាល</h3>
            <p className="highlight-text">
              ការផ្តល់ជូនពិសេសក្នុងរយៈពេលកំណត់ ជាមួយមុខម្ហូបផ្សំឡើងពីគ្រឿងស្រស់ៗប្រចាំខែ។ កុំរំលងស្នាដៃចុងភៅពិសេសរបស់យើង!
            </p>
            <Link to="/products?category=cooked" className="highlight-button">
              មើលមុខម្ហូបពិសេស ➔
            </Link>
          </div>
          <div className="highlight-image">
            <div className="highlight-circle">
              <img className="rounded-full" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80" alt="ម្ហូបពិសេស" />
            </div>
            <div className="highlight-badge">ប្រូម៉ូសិនពិសេស</div>
          </div>
        </div>
        
        <div className="features-testimonial">
          <div className="testimonial-quotes">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="quotes-icon">
              <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
            </svg>
          </div>
          <p className="testimonial-text">
            «គុណភាពម្ហូប និងភាពស្រស់នៃគ្រឿងផ្សំពិតជាល្អឥតខ្ចោះ ដឹកជញ្ជូនលឿនទាន់ចិត្តណាស់! ម្ហូបចំអិនក្តៅៗឈ្ងុយឆ្ងាញ់ដូចស្នាដៃម្តាយធ្វើនៅផ្ទះពិតៗ។ ខ្ញុំក្លាយជាម៉ូយប្រចាំរបស់ DeliciousEats ហើយ!»
          </p>
          <div className="testimonial-author">
            <div className="author-avatar">
              <img className="rounded-full" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="អតិថិជន" />
            </div>
            <div className="author-info">
              <h4 className="author-name">សុខ ដារ៉ា</h4>
              <p className="author-title">អតិថិជនប្រចាំ • រាជធានីភ្នំពេញ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
