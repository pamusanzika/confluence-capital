import React from 'react';
import { motion } from 'framer-motion';
import { Network, Rocket, BarChart2, PieChart, ArrowUpRight } from 'lucide-react';

const offerings = [
  {
    title: "M&A Advisory",
    description: "Maximize transactional value through strategic mergers & acquisitions with high-precision modeling.",
    icon: <Network className="w-6 h-6" />,
    color: "from-blue-600 to-cyan-500",
    border: "group-hover:border-blue-500/50"
  },
  {
    title: "VC Funding",
    description: "Secure venture capital funding and navigate the startup ecosystem via our global investor network.",
    icon: <Rocket className="w-6 h-6" />,
    color: "from-purple-600 to-indigo-500",
    border: "group-hover:border-purple-500/50"
  },
  {
    title: "Growth Equity",
    description: "Accelerate business growth with flexible equity capital designed for scale-up operations.",
    icon: <BarChart2 className="w-6 h-6" />,
    color: "from-emerald-600 to-teal-500",
    border: "group-hover:border-emerald-500/50"
  },
  {
    title: "Capital Markets",
    description: "Access global equity markets for public offerings through rigorous institutional preparation.",
    icon: <PieChart className="w-6 h-6" />,
    color: "from-orange-600 to-amber-500",
    border: "group-hover:border-orange-500/50"
  }
];

const WhatWeDoEquity = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 relative overflow-hidden">
      

      <div className="max-w-7xl mx-auto relative z-10">
        
         {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
            Why Choose
            <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Us</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-md text-lg">
              Setting the standard for precision in financial consultancy and strategic execution.
            </p>
          </div>
          
        </div>

        {/* Hard Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-[0rem] bg-[var(--primary-color)] border  p-8  flex flex-col justify-between transition-all duration-500 ${item.border}`}
            >
              {/* Top Section */}
              <div>
                <div className={`w-12 h-12 flex rounded-[1rem] items-center justify-center bg-gradient-to-r from-[#1687f1] to-[#d4af37]  text-[#ffffff] mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent mb-4 transition-colors">
                  {item.title}
                </h3>
                <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent leading-relaxed text-sm transition-colors">
                  {item.description}
                </p>
              </div>

              

              {/* Hover Line Accent */}
              <div className="absolute top-0 left-0 w-[0%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoEquity;