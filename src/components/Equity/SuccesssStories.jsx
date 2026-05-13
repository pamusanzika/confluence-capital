import React from 'react';
import { Link } from 'react-router-dom';

const caseStudiesData = [
  {
    tag: 'FINTECH',
    amount: '$25M Series B for Unicorn',
    description: 'Facilitated digital banking expansion across emerging markets.',
    image: 'https://i.pinimg.com/1200x/7a/59/1c/7a591c57ae5e0d37b20e482b06788474.jpg',
    date: 'MAY 2026'
  },
  {
    tag: 'ESG COMMITMENT',
    amount: '$15M Green Bond',
    description: 'Preserving 10,000 hectares of critical ecosystem.',
    image: 'https://i.pinimg.com/1200x/de/3d/94/de3d9419e12775423c7e8e1bf7927190.jpg',
    date: 'APR 2026'
  },
  {
    tag: 'RENEWABLES',
    amount: '$50M Solar Funding',
    description: 'Next-gen solar array implementation for clean energy.',
    image: 'https://i.pinimg.com/1200x/59/13/ce/5913ceeba1308a7f76578a98526be543.jpg',
    date: 'MAR 2026'
  },
];

const SuccessStories = () => {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            
           

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
            Intelligence Portfolio
            <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Report</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-4xl text-[1rem]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Id enim minus ratione repellendus amet.
            </p>
          </div>
          
          <Link to= '/blogs'>
          <button className="group relative overflow-hidden px-10 py-4 bg-[var(--primary-color)] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer">
            <span className="relative z-10">See All Stories</span>
          </button>
          </Link>
          
        </div>

        {/* Blog-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {caseStudiesData.map((study, index) => (
            <div key={index} className="group cursor-pointer flex flex-col">
              {/* Cinematic Image - Wider Aspect Ratio (16:9) */}
              <div className="relative aspect-video mb-6 overflow-hidden bg-neutral-100">
                <img 
                  src={study.image} 
                  alt={study.amount} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Metadata Container */}
              <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-4">
                <span className="text-[9px] font-black tracking-[0.2em] text-[#d4af37] uppercase">
                  {study.tag}
                </span>
                <span className="text-[9px] font-medium text-neutral-400 tracking-widest uppercase">
                  {study.date}
                </span>
              </div>
              
              {/* Title & Description */}
              <div className="flex-grow">
                <h4 className="text-xl font-bold text-neutral-950 mb-3 leading-snug  transition-colors">
                  {study.amount}
                </h4>
                <p className="text-neutral-500 font-normal text-sm leading-relaxed mb-6">
                  {study.description}
                </p>
              </div>
              
              {/* Simple Arrow Link */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 group-hover:gap-4 transition-all">
                Read Story <span className="text-[#d4af37]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;