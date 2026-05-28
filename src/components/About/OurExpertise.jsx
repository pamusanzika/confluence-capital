import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const expertiseItems = [
  {
    title: "Financial & Market Knowledge",
    subtitle: "Strategic Intelligence",
    description: "Our deep-rooted understanding of global markets allows us to identify unique opportunities and mitigate risks with precision. We don't just follow trends; we anticipate shifts before they happen.",
    image: "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Transaction Execution",
    subtitle: "Precision Performance",
    description: "We bring a disciplined approach to every deal, ensuring meticulous execution from initial strategy to final closing. Our track record is built on seamless, error-free transitions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Sector-Specific Expertise",
    subtitle: "Industry Mastery",
    description: "Specialized knowledge across key industries ensures our advisory services are grounded in real-world operational reality. We speak the language of your specific sector.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Global Perspective",
    subtitle: "Worldwide Reach",
    description: "With a network spanning multiple continents, we provide localized insights with a grand-scale international vision. Your growth knows no geographic boundaries.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800"
  }
];

const OurExpertise = () => {
  return (
    <section className="bg-white py-2 pb-30 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Centered Title Section */}
         {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
            What We 
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Bring</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-md text-lg">
              We combine technical expertise with strategic thinking to deliver impactful results.
            </p>
          </div>
          
        </div>

        {/* Dynamic List Section */}
        <div className="space-y-40">
          {expertiseItems.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-1/2 aspect-[4/3] bg-zinc-100 rounded-none overflow-hidden relative group"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover filter grayscale-0 hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-zinc-400 font-mono text-lg mb-2 block">
                    {String(index + 1).padStart(2, '0')} — {item.subtitle}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-semibold text-zinc-900 leading-tight mb-6">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                  
                  {/* Premium Subtle Button */}

                  <Link to='/about'>
                  
                  
                  
                               <button className="group cursor-pointer flex items-center gap-3 py-3 px-8 bg-[var(--primary-color)] transition-all duration-500 mt-8">
                  
                                           <span className="text-[10px] uppercase tracking-widest font-bold text-white">
                  
                                           View Imapct
                  
                                           </span>
                  
                                           <ArrowUpRight className="w-4 h-4 text-[#ffffff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  
                                         </button>
                  
                             
                  
                              </Link>
                  
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurExpertise;