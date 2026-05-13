import React from 'react';
import { motion } from 'framer-motion';
import { Network, Rocket, BarChart2, PieChart } from 'lucide-react';

const offerings = [
  {
    title: "M&A Advisory",
    description: "Maximize transactional value through strategic mergers & acquisitions with high-precision modeling.",
    icon: <Network className="w-6 h-6" />,
  },
  {
    title: "VC Funding",
    description: "Secure venture capital funding and navigate the startup ecosystem via our global investor network.",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    title: "Growth Equity",
    description: "Accelerate business growth with flexible equity capital designed for scale-up operations.",
    icon: <BarChart2 className="w-6 h-6" />,
  },
  {
    title: "Capital Markets",
    description: "Access global equity markets for public offerings through rigorous institutional preparation.",
    icon: <PieChart className="w-6 h-6" />,
  }
];

const WhatWeDoCredit = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Symmetrical Header */}
         <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
            Why Choose
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Us</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-md text-lg">
              Setting the standard for precision in financial consultancy and strategic execution.
            </p>
          </div>
          
        </div>

        {/* The Symmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 border border-neutral-200">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              // Changed h-[380px] to h-full to fit the grid row height naturally
              className="group relative h-full overflow-hidden border-r last:border-r-0 border-neutral-200 bg-[var(--primary-color)]"
            >
              {/* Animated Background Reveal */}
              <div className="absolute inset-0 bg-[var(--primary-color)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />

              <div className="relative z-10 p-10 flex flex-col h-full">
                {/* 1. Icon Section */}
                <div className="text-neutral-200 group-hover:text-[#d4af37] transition-colors duration-300 mb-6">
                  {item.icon}
                </div>

                {/* 2. Title Section - Aligned Baseline */}
                <div className="min-h-[50px] flex items-start">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent transition-colors duration-300 uppercase tracking-tight leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* 3. Accent Line */}
                <div className="w-8 h-[2px] bg-gradient-to-r from-[#1687f1] to-[#d4af37] my-6 group-hover:w-full transition-all duration-500" />

                {/* 4. Description Section - Consistent Alignment */}
                <div className="min-h-[80px]">
                  <p className="text-neutral-400 group-hover:text-slate-300 text-sm leading-relaxed transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoCredit;