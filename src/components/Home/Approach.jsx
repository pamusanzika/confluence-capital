import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// YOU MUST REPLACE THESE PLACEHOLDERS WITH YOUR OWN IMAGES FROM ASSETS
const imgUnderstand = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop";
const imgStrategize = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop";
const imgExecute = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop";
const imgDeliver = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop";

gsap.registerPlugin(ScrollTrigger);

const Approach = () => {
  const mainRef = useRef(null);
  const rowRefs = useRef([]);

  const steps = [
    {
      id: "01",
      title: "Understand",
      subtitle: "The Foundation of Clarity",
      desc: "We initiate with an immersive discovery phase, dissecting your objectives, user ecosystem, and technical constraints. Through rigorous inquiry, we forge a definitive blueprint that aligns stakeholder vision with actionable requirements.",
      img: imgUnderstand,
    },
    {
      id: "02",
      title: "Strategize",
      subtitle: "Engineering the Roadmap",
      desc: "Strategy is architectural foresight. We design bespoke roadmaps that balance iterative progress with long-term scalability. This phase transforms raw requirements into a technological and logistical strategy designed for maximum efficiency.",
      img: imgStrategize,
    },
    {
      id: "03",
      title: "Execute",
      subtitle: "Precision Development",
      desc: "Our implementation phase is driven by meticulous engineering. Using agile methodologies, our elite developers and designers work in synchronized sprints, ensuring code quality, interface coherence, and functional integrity at every check-point.",
      img: imgExecute,
    },
    {
      id: "04",
      title: "Deliver",
      subtitle: "Deployment & Optimization",
      desc: "Deployment is the beginning of performance. We execute seamless product launches, validated by rigorous QA protocols. Following release, we transition into active monitoring and optimization, ensuring sustained stability and growth.",
      img: imgDeliver,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".approach-header", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".approach-header",
          start: "top 85%",
        },
      });

      // Rows Staggered Animation
      rowRefs.current.forEach((el, index) => {
        const isEven = index % 2 === 0;
        const textContent = el.querySelector('.text-content');
        const imageContent = el.querySelector('.image-content');

        // Text slide and fade
        gsap.from(textContent, {
          opacity: 0,
          x: isEven ? -50 : 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        });

        // Image reveal animation
        gsap.from(imageContent, {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="bg-[white] text-neutral-900 antialiased overflow-x-hidden">
      {/* Container - Large padding, very wide constraint */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        
        




        {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
           



          <h2 
         
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 leading-[1.1]"
          >
            Our Structred 
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Appraoch</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-full w-[80%] mx-auto text-center text-lg">
             A precise, iterative process designed to convert abstract vision into quantifiable, reliable results.
            </p>
          </div>
          
        </div>

        {/* Process Steps - Alternating, overlapping flow */}
        <div className="space-y-24 md:space-y-40">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={step.id}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 
                  ${isEven ? '' : 'md:flex-row-reverse'}
                `}
              >
                {/* 1. Text Content Panel */}
                <div className="text-content w-full md:w-1/2 flex flex-col space-y-6">
                  {/* Subtle Numbering System */}
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-extralight text-gray-300 tracking-tight">
                      {step.id}
                    </span>
                    <div className="h-[2px] w-8 bg-black"></div>
                  </div>

                  {/* Headings and Description */}
                  <div className="space-y-2">
                    <h2 className="text-3xl font-medium tracking-tight text-[var(--primary-color)]">
                      {step.title}
                    </h2>
                    <p className="text-sm bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-medium tracking-widest uppercase">
                      {step.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-base text-[var(--primary-color)] font-light leading-relaxed pr-6 max-w-lg">
                    {step.desc}
                  </p>
                </div>

                {/* 2. Image Panel - Premium, overlapping look */}
                <div className="image-content w-full md:w-1/2 relative group aspect-[4/3] md:aspect-[5/4] overflow-hidden">
                  {/* Background element for unique look */}
                  <div className={`absolute inset-0 bg-gray-50 transform 
                    ${isEven ? 'translate-x-4 translate-y-4' : '-translate-x-4 translate-y-4'}
                    group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`} 
                  />
                  
                  {/* The actual image */}
                  <img
                    src={step.img}
                    alt={step.title}
                    className="relative z-10 w-full h-full rounded-[0rem] object-cover shadow-[0_10px_40px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Approach;