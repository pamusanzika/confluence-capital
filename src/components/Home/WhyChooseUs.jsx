import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const data = [
    {
      title: "Tailored Financial Solutions",
      desc: "Custom-fit strategies designed to align with your unique fiscal objectives and growth patterns.",
    },
    {
      title: "Deep Market Expertise",
      desc: "Leveraging decades of institutional knowledge to navigate complex global market volatility.",
    },
    {
      title: "Strong Execution Capability",
      desc: "Precision-driven implementation ensuring every transition and trade is handled seamlessly.",
    },
    {
      title: "Long-Term Partnerships",
      desc: "We grow with you, building a foundation of trust that spans across multiple generations.",
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".title-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // Advanced Staggered Card Animation
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card, 
          { 
            opacity: 0, 
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[white] py-24 px-6 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Minimal Header */}
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

        {/* Asymmetrical Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`group p-8 rounded-[0rem] transition-all duration-500 bg-[var(--primary-color)] shadow-[#a7a7a7] shadow-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 
                ${idx % 2 !== 0 ? 'lg:mt-12' : 'lg:mb-12'}`}
            >
              {/* Card Content */}
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 mb-8 rounded-full bg-white flex items-center justify-center border border-none text-sm font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent shadow-sm">
                    0{idx + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent mb-4 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom decorative accent */}
                <div className="mt-10 h-1 w-0 bg-gradient-to-r from-[#1687f1] to-[#6e6e6e] group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;