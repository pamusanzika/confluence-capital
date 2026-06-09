import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const teamData = [
  {
    name: "Alexander Vance",
    role: "Managing Director",
    experience: "Ex-Goldman Sachs, 15+ years in Private Equity.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Sarah Chen",
    role: "Chief Strategy Officer",
    experience: "Specialist in cross-border M&A and venture capital.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Marcus Thorne",
    role: "Head of Asset Management",
    experience: "Portfolio manager with $2B+ in managed assets.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Elena Rodriguez",
    role: "Lead Financial Analyst",
    experience: "Expert in quantitative risk and market volatility.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
];

const Team = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation for Header
      gsap.from(".team-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // 2. Infinite Horizontal Loop Logic
      const totalWidth = sliderRef.current.offsetWidth / 2;
      
      gsap.to(sliderRef.current, {
        x: `-${totalWidth}px`,
        duration: 20, // Speed of the scroll
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth)
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[white] overflow-hidden text-zinc-900">
      {/* Header - Styled like the reference image */}
      

      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
              Our 
              <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Leadership</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl text-lg">
             A group of industry veterans committed to delivering strategic financial growth and stability.
            </p>
          </div>
        </div>

      {/* Infinite Carousel */}
      <div className="relative flex whitespace-nowrap">
        <div ref={sliderRef} className="flex gap-5 pr-5">
          {/* Duplicating data for seamless infinite loop */}
          {[...teamData, ...teamData].map((member, index) => (
            <div 
              key={index} 
              className="w-[280px] md:w-[320px] flex-shrink-0 group cursor-pointer"
            >
              <div className="bg-white border border-zinc-100 rounded-[0rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200/50 group-hover:-translate-y-1">
                {/* Image Container - Smaller Scale */}
                <div className="h-64 md:h-72 overflow-hidden bg-zinc-100">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-0 group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                {/* Content Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <h3 className="text-lg font-bold text-zinc-900 truncate">{member.name}</h3>
                      <p className="text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-3">
                        {member.role}
                      </p>
                      <p className="text-zinc-500 text-sm whitespace-normal line-clamp-2 leading-relaxed">
                        {member.experience}
                      </p>
                    </div>
                    
                    {/* Arrow Icon Button */}
                    <div className="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center border border-zinc-200 rounded-full group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;