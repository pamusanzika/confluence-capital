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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--primary-color)] border border-[var(--primary-color)] shadow-2xl shadow-zinc-200/50">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-10 flex flex-col justify-between min-h-[420px] transition-all duration-500 hover:bg-zinc-50"
            >
              <div>
                {/* Header within Card */}
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#1687f1] to-[#d4af37] border border-zinc-100 duration-500">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-zinc-100 group-hover:text-zinc-200 transition-colors duration-500">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-zinc-900 mb-6 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-zinc-500 text-sm leading-relaxed font-light group-hover:text-zinc-700">
                  {step.desc}
                </p>
              </div>

             
              
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowWeDoItCredit;