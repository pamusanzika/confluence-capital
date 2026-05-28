import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const blogData = [
  {
    id: 1,
    category: "Architecture",
    title: "Scalable Systems for Global Enterprise",
    preview: "Building the backbone of modern digital infrastructure with precision and speed.",
  },
  {
    id: 2,
    category: "Experience",
    title: "The Psychology of Minimalist Interfaces",
    preview: "How reduced cognitive load transforms user conversion for high-end digital products.",
  },
  {
    id: 3,
    category: "Intelligence",
    title: "Neural Integration in Modern Web Apps",
    preview: "Seamlessly weaving advanced logic into the fabric of user-facing components.",
  }
];

const STATIC_SHADOW = "0 20px 40px rgba(0, 0, 0, 0.1)"; 
const HOVER_SHADOW = "0 40px 70px rgba(0, 0, 0, 0.18)";

const Blogs = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".header-content", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".header-content",
          start: "top 85%",
        }
      });

      gsap.from(cardsRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".card-grid",
          start: "top 80%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onMouseEnter = (index) => {
    gsap.to(cardsRef.current[index], {
      y: -20,
      scale: 1.03,
      boxShadow: HOVER_SHADOW,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const onMouseLeave = (index) => {
    gsap.to(cardsRef.current[index], {
      y: 0,
      scale: 1,
      boxShadow: STATIC_SHADOW,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  return (
    <section ref={sectionRef} className="bg-[#F3F4F6] py-16 md:py-24 lg:pt-30 lg:pb-5 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Adjusted for tablet stacking */}
        <div className="header-content flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
              Latests 
              <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Insights</span>
            </h2>
          </div>

          <Link to='/blogs'>
            <button className="group cursor-pointer relative px-8 py-4 bg-[var(--primary-color)] text-white flex items-center gap-2 transition-all active:scale-95">
                        <span className="text-sm font-medium tracking-wide">View All Posts</span>
                        <ArrowRight className="w-4 h-4 transition-all group-hover:scale-120" />
                      </button>
          </Link>
          
          


                      
        </div>

        {/* Card Grid - Responsive breakpoints added here */}
        <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-12">
          {blogData.map((blog, index) => (
            <div
              key={blog.id}
              ref={el => cardsRef.current[index] = el}
              
              className="relative px-6 py-8 md:px-8 md:py-10 bg-[var(--primary-color)] rounded-[0rem] h-full flex flex-col justify-between cursor-pointer border border-white/50"
              style={{ boxShadow: STATIC_SHADOW }}
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-1 w-10 bg-gradient-to-r from-[#1687f1] to-[#d4af37]"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {blog.category}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold leading-[1.2] mb-4 text-[white] tracking-tighter">
                  {blog.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed font-medium text-[0.95rem] italic opacity-80">
                  "{blog.preview}"
                </p>
              </div>

              <div className="flex items-center bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] justify-between px-5 py-1">
                <span className="text-xs font-black uppercase tracking-widest text-[white]">
                  Read Article
                </span>
                <div className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-[var(--primary-color)]/0 flex items-center justify-center text-white transition-all duration-300">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;