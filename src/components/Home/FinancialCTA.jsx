import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bubble = ({ size, delay, x, y }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-tr from-[#1687f1]/10 to-[#d4af37]/10 blur-xl"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

const FinancialCTA = () => {
  return (
    <section className="relative w-full py-25 md:pb-60 md:pt-35 bg-[white] overflow-hidden flex items-center justify-center">
      
      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Bubble size={300} x="10%" y="20%" delay={0} />
        <Bubble size={200} x="70%" y="10%" delay={2} />
        <Bubble size={150} x="40%" y="60%" delay={1} />
        <Bubble size={250} x="80%" y="70%" delay={3} />
      </div>

      
      
      <div className="container mx-auto px-6 max-w-5xl text-center z-10">
        <div className="space-y-12">
          
          {/* Main Heading with Spring Animation */}
          <div className="space-y-3">
            {/* Small tracking title above the main heading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-500 flex items-center justify-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-[#d4af37]" /> Get In Touch
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                delay: 0.2 
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.4]"
            >
              Unlock new opportunities with <br className="hidden md:block" />
              <motion.span 
                className="inline-block font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                strategic financial expertise.
              </motion.span>
            </motion.h2>
          </div>

          {/* Action Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            {/* Single Consultation Button with its original styles */}
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 cursor-pointer bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] backdrop-blur-md border border-slate-300 text-slate-900 flex items-center gap-2 transition-all hover:bg-white hover:border-[var(--primary-color)]"
            >
              <Calendar className="w-4 h-4 text-slate-900" />
              <span className="text-sm font-medium tracking-wide">Book a free Consultation</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default FinancialCTA;