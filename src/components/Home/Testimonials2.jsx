import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "As a marketing professional, I rely heavily on data to drive my campaigns. They have been instrumental in helping me analyze and visualize data effectively.",
    name: "Jennifer Lee",
    role: "Entrepreneur",
    company: "Loom",
    img: "https://i.pravatar.cc/150?u=jennifer"
  },
  {
    quote: "With its powerful help desk features and automation capabilities, we have been able to provide faster and more personalized support to our clients.",
    name: "Emily Johnson",
    role: "Business Manager",
    company: "Framer",
    img: "https://i.pravatar.cc/150?u=emily"
  },
  {
    quote: "The robust project management tools, integrated communication features, and customizable dashboards have made collaboration a breeze.",
    name: "John Smith",
    role: "Product Manager",
    company: "GitHub",
    img: "https://i.pravatar.cc/150?u=john"
  },
  {
    quote: "The feedback and insights we've received have also helped us identify areas for growth and continuously improve our services. It's like having our own consultant.",
    name: "David Brown",
    role: "Business Owner",
    company: "Notion",
    img: "https://i.pravatar.cc/150?u=david"
  }
];

const Testimonials2 = () => {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className=" bg-[#F3F4F6] pt-2 pb-20 overflow-hidden">
      

      {/* Infinite Scroll Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative flex w-full"
      >
        <motion.div
          className="flex flex-nowrap gap-2"
          animate={{
            x: ['-50%', '0%'],
          }}
          transition={{
            duration: 40, // Increased duration for a smoother, more premium speed
            ease: 'linear',
            repeat: Infinity,
          }}
          // Pause animation on hover
          whileHover={{ animationPlayState: 'paused' }}
        >
          {duplicatedTestimonials.map((item, idx) => (
            <motion.div
              key={idx}
              // Subtle tilt/scale on hover
              
              className="w-[330px] md:w-[400px] flex-shrink-0 bg-[var(--primary-color)] p-8 rounded-[0rem] shadow-sm  flex flex-col justify-between"
            >
              <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent leading-relaxed text-base md:text-[.9rem] mb-8 font-light italic">
                "{item.quote}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute inset-0 rounded-full border border-black/5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-400 text-sm">{item.name}</h4>
                    <p className="text-neutral-600 text-xs font-medium uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
                
                <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                  <span className="font-black bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent text-sm tracking-tighter uppercase">
                    {item.company}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Edge Fading Gradients 
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-gray-50 to-transparent z-10" />*/}
      </motion.div>
    </section>
  );
};

export default Testimonials2;