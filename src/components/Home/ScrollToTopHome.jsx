import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTopHome = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Logic: Hidden in Hero, appears after 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-10 right-10 z-[9999]"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group relative cursor-pointer flex items-center justify-center w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-full transition-all duration-500 hover:border-white/40 hover:bg-neutral-800 outline-none"
          >
            {/* Bold Curve Arrow Icon */}
            <ChevronUp 
              size={24} 
              strokeWidth={3} 
              className="text-white transition-transform duration-500 group-hover:-translate-y-1" 
            />

            {/* Subtle Inner Glow (Premium Touch) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopHome;