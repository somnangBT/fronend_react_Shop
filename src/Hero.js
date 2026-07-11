import React from 'react';
import { ReactTyped } from "react-typed"; // Import Library
import './Hero.css'; // សម្រាប់ CSS របស់អ្នក

const Hero = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-title">
        {/* បិទអក្សរចាស់ ហើយដាក់កូដនេះជំនួស */}
        <ReactTyped
          strings={[
            "Build Business",
            "Build Success",
            "Build the Future"
          ]} // អក្សរដែលចង់ឱ្យវាលោតប្តូរគ្នា
          typeSpeed={80}      // ល្បឿនវាយអក្សរចេញ (ms)
          backSpeed={50}      // ល្បឿនលុបអក្សរវិញ (ms)
          loop={true}         // ឱ្យវាលោតវិលជុំមិនឈប់
          showCursor={true}   // បង្ហាញសញ្ញាគូស (_) ពេលវាយ
          cursorChar="|"      // កំណត់រូបរាង Cursor
        />
      </h1>
      
      {/* កន្លែងដាក់អក្សរ Accent ដដែល */}
      <p className="hero-subtitle">For E-commerce success</p>
    </div>
  );
};

export default Hero;