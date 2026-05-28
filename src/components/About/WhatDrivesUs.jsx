import React from 'react';

const WhatDrivesUs = () => {
  const drivers = [
    {
      title: "Strategic Thinking",
      description: "Every decision is backed by market intelligence and financial insight.",
      icon: "◈"
    },
    {
      title: "Precision Execution",
      description: "From advisory to restructuring, we focus on disciplined delivery.",
      icon: "✧"
    },
    {
      title: "Long-Term Partnerships",
      description: "We build relationships that extend beyond transactions.",
      icon: "⌬"
    }
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        

        {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
            What Drives
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Us</span>
          </h2>
           
          </div>
          
        </div>

        {/* Card Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {drivers.map((item, index) => (
            <div
              key={index}
              className="group relative bg-[var(--primary-color)] p-10 rounded-xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden"
            >
              {/* Premium Gradient Top Border */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#1687f1] to-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Subtle Decorative Background Gradient on Hover */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#3838b3] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Icon / Decorator */}
              <div className="mb-6 text-2xl text-neutral-400 font-light">
                {item.icon}
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent mb-4 transition-colors">
                {item.title}
              </h3>
              
              <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent leading-relaxed relative z-10">
                {item.description}
              </p>

              {/* Bottom Gold Accent line that expands on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatDrivesUs;