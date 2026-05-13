import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const CallToActionAbout = () => {
  return (
    <section className="px-4 py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto bg-[var(--primary-color)]  rounded-[0px] overflow-hidden relative border border-slate-800 shadow-2xl">
        
        {/* Subtle Dot Grid Background Pattern */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center pt-20 pb-32 px-6">
          

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
             <span className="text-blue-500"></span>
          </h2>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
              Ready to
              <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Get Started?</span>
            </h2>


          <p className="mt-4 text-slate-500 mb-7 max-w-2xl text-lg">
              Experience the future of business operations with AI automation—increased 
            speed, accuracy, and adaptability, driving overall productivity gains.
            </p>

          <button className="bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] cursor-pointer text-white px-8 py-4 rounded-none font-semibold transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-95">
            Book Your Free Audit Call
          </button>
        </div>

       
      </div>
    </section>
  );
};

export default CallToActionAbout;