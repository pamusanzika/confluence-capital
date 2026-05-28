import React from 'react';
import { 
  TrendingUp, 
  Building2, 
  PieChart, 
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: "01",
    title: "Investment Banking",
    description: "Advising on mergers, acquisitions, and capital raising strategies to fuel corporate growth.",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: "02",
    title: "Project Finance",
    description: "Structuring and financing large-scale infrastructure and development projects with precision.",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: "03",
    title: "Equity Advisory",
    description: "Guiding businesses in equity investments, fundraising, and complex valuation models.",
    icon: <PieChart className="w-5 h-5" />,
  },
];

const WhatWeDo = () => {
  return (
    <section className="py-24 bg-[var(--primary-color)] text-white">
      <div className="max-w-full mx-auto px-4 lg:px-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-10 lg:gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-neutral-100 leading-tight">
              WHAT WE <br />
              <span className='font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent'>DO</span>
            </h2>
          </div>
          
          <div className="lg:w-1/2 flex flex-col items-start gap-8">
            <p className="text-neutral-400 font-light leading-relaxed max-w-md">
              We provide the technical precision and strategic depth required to navigate 
              the world's most complex financial landscapes through institutional-grade advisory.
            </p>

            <Link to="/deal-book">
              <button className="group cursor-pointer flex items-center gap-3 py-3 px-8 bg-gradient-to-r from-[#1687f1] to-[#d4af37] transition-all duration-500">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white">
                  Explore Our Deal Book
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#ffffff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* SERVICES GRID - Responsive 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-[#041520] border border-white/5 p-8 h-full flex flex-col justify-between hover:bg-[#031624] transition-all duration-500 overflow-hidden"
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#1687f1]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div className="p-3 bg-white/5 rounded-lg text-[#1687f1] group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                </div>
                
                <h4 className="text-xl font-medium bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent mb-3">
                  {service.title}
                </h4>
                
                <p className="text-sm bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-light leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* FINAL CONTACT US CARD - Styled to match grid height */}
          <Link to="/contact" className="h-full">
            <div className="h-full p-8 border border-dashed border-white/10 flex flex-col justify-center items-center text-center group hover:bg-[#1687f1]/5 transition-all duration-500 cursor-pointer">
              <div className="mb-4 p-3 rounded-full border border-white/5 text-neutral-500 group-hover:text-[#1687f1] group-hover:border-[#1687f1]/30 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Strategic Partnership</p>
              <h4 className="text-lg font-light text-white group-hover:text-[#1687f1] transition-colors">
                How can we help?
              </h4>
              
              <div className="mt-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#1687f1] group-hover:border-[#1687f1] transition-all duration-500">
                 <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default WhatWeDo;