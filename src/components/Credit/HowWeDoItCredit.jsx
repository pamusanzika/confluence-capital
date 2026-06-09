import React from 'react';
import { Search, TrendingUp, Users, ShieldCheck, ArrowUpRight } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-6 h-6 text-neutral-200" />,
    title: "Discovery & Analysis",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "01"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-neutral-200" />,
    title: "Growth Architecture",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "02"
  },
  {
    icon: <Users className="w-6 h-6 text-neutral-200" />,
    title: "Collaborative Action",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "03"
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-neutral-200" />,
    title: "Longevity & Ethics",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus.",
    tag: "04"
  },
];

const HowWeDoItCredit = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Titles & Description */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          
         
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
            A high-performance
            <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> strategic engine</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-4xl text-[1rem]">
              We’ve refined our process into four distinct phases, designed to scale with your ambition.
            </p>
        </div>

        {/* The Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800/40 border border-slate-800">
  {steps.map((step, index) => (
    <div 
      key={index} 
      className="group relative bg-[var(--primary-color)] p-8 flex flex-col justify-between min-h-[420px] transition-all duration-500 hover:bg-[#0c1633] overflow-hidden"
    >
      {/* Subtle top accent line on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#d4af37] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div>
        {/* Header within Card */}
        <div className="flex justify-between items-start mb-16">
          {/* Sharp, clean icon container without rounded corners */}
          <div className="text-[#d4af37] transition-transform duration-500 group-hover:scale-110">
            {step.icon}
          </div>
          {/* Minimal, high-end step indicator */}
         
        </div>

        {/* Title - Sharp and clean */}
        <h3 className="text-[1.5rem] font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent mb-4 tracking-tight">
          {step.title}
        </h3>
        
        {/* Description - High contrast readability over navy */}
        <p className="text-slate-400 text-sm leading-relaxed font-light transition-colors duration-300 group-hover:text-slate-300">
          {step.desc}
        </p>
      </div>

      {/* Decorative Corner Accent to give it a premium, secure financial feel */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-800 group-hover:border-[#d4af37] transition-colors duration-500" />
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default HowWeDoItCredit;