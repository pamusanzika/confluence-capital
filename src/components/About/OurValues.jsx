import React from 'react';
import { ArrowUpRight, Shield, Star, Users, Lightbulb } from 'lucide-react';

const OurValues = () => {
  const values = [
    {
      id: "01",
      title: "Integrity",
      icon: <Shield className="w-6 h-6" />,
      description: "We uphold the highest ethical standards in every engagement, ensuring transparency and trust as our bedrock.",
      gridClass: "md:col-span-2 md:row-span-1"
    },
    {
      id: "02",
      title: "Excellence",
      icon: <Star className="w-6 h-6" />,
      description: "We deliver quality through precision and expertise, exceeding industry benchmarks.",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: "03",
      title: "Client Commitment",
      icon: <Users className="w-6 h-6" />,
      description: "We prioritize long-term partnerships, aligning our internal success metrics with your growth.",
      gridClass: "md:col-span-1 md:row-span-1"
    },
    {
      id: "04",
      title: "Innovation",
      icon: <Lightbulb className="w-6 h-6" />,
      description: "We adapt to evolving financial landscapes, leveraging modern strategies to navigate global challenges.",
      gridClass: "md:col-span-2 md:row-span-1"
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-bold tracking-[0.3em] uppercase text-xs mb-4">
              Our Principles
            </h2>
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 leading-[1.1] tracking-tight">
              Values that define <br /> 
              <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">our legacy</span>
            </h1>
          </div>
          <p className="text-slate-500 max-w-[30rem] text-sm leading-relaxed border-l-2 border-[#1687f1]/30 pl-4 mb-2">
            Built on a foundation of trust and precision, we navigate complexity with a clear moral compass.
          </p>
        </div>

        {/* Advanced Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((item, index) => (
            <div 
              key={index} 
              className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${item.gridClass} bg-gradient-to-r from-[#04121f] to-[#271917] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#1687f1]/10`}
            >
              {/* Subtle Background Glow - Using Primary Color */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#1687f1]/5 rounded-full blur-3xl group-hover:bg-[#1687f1]/10 transition-colors duration-500" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-[#000000] group-hover:bg-[#1687f1]  duration-500 shadow-inner">
                      {item.icon}
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent group-hover:text-[#1687f1]/10 transition-colors duration-500 font-mono">
                      {item.id}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4  bg-left-bottom bg-no-repeat duration-500 bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent pb-2 ">
                    {item.title}
                  </h3>
                  
                  <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent leading-relaxed transition-colors">
                    {item.description}
                  </p>
                </div>

                
              </div>

             
            </div>
          ))}
        </div>

      

      </div>
    </section>
  );
};

export default OurValues;