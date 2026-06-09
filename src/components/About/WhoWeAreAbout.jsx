import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhoWeAreAbout = () => {
  const sectionRef = useRef(null);
  const imgContainerRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Parallax & Scale
      gsap.fromTo(imgRef.current, 
        { scale: 1.2, y: -20 },
        {
          scale: 1,
          y: 20,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

      // Text Stagger Animation
      gsap.fromTo(".animate-item", 
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-[white] flex items-center justify-center py-20 px-4 md:px-10 overflow-hidden"
    >
      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden border border-stone-100">
        
        {/* Left Side: Image Container */}
        <div ref={imgContainerRef} className="relative h-[400px] lg:h-auto overflow-hidden bg-stone-200">
          <img
            ref={imgRef}
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Modern Corporate Architecture"
            className="w-full h-full object-cover"
          />
          {/* Subtle light overlay for luxury feel */}
          <div className="absolute inset-0 bg-stone-900/5 mix-blend-overlay" />
        </div>

        {/* Right Side: Content Container */}
        <div ref={textRef} className="flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white relative">
         

          <div className="relative z-10">
            <div className="animate-item flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-stone-300" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-semibold">
                Established Excellence
              </span>
            </div>

            

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-10 text-neutral-900 leading-[1.1]">
            Who We 
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Are</span>
          </h2>

            <div className="animate-item space-y-8">
              <p className="text-xl md:text-2xl text-stone-800 font-light leading-relaxed border-l-2 border-stone-100 ">
                <span className="font-semibold">Confluence Capital</span> is a financial advisory firm focused on delivering tailored solutions for complex financial challenges.
              </p>
              
              <p className="text-base md:text-lg text-stone-500 leading-relaxed font-light">
                We partner with businesses, investors, and institutions to provide strategic guidance across 
                investment banking, project finance, equity advisory, credit solutions, and 
                debt restructuring.
              </p>

              <p className="text-base md:text-lg text-stone-500 leading-relaxed font-light">
                Our approach combines deep industry expertise, analytical 
                rigor, and a strong understanding of market dynamics to help clients achieve 
                sustainable growth and long-term value.
              </p>
            </div>

            {/* Premium Button/CTA */}
            <div className="animate-item mt-12">
              <button className="px-10 py-4 cursor-pointer rounded-[0rem] bg-[var(--primary-color)] font-medium text-xs tracking-widest uppercase">
  <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">
    Explore Our Deal Book
  </span>
</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreAbout;