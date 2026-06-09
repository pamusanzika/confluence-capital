import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTopDealBook = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-10 right-10 z-[9999]"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group relative cursor-pointer flex items-center justify-center w-12 h-12 bg-[var(--primary-color)] border border-neutral-800 transition-all duration-500 outline-none overflow-hidden"
          >
            {/* Architectural Grid Hover Borders (Sharp & Premium) */}
            <span className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#8a6b1f] to-[#d4af37] transition-all duration-300 group-hover:w-full" />
            <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-gradient-to-l from-[#8a6b1f] to-[#b8891a] transition-all duration-300 group-hover:w-full" />
            <span className="absolute top-0 right-0 w-[1px] h-0 bg-gradient-to-b from-[#d4af37] to-[#b8891a] transition-all duration-300 group-hover:h-full" />
            <span className="absolute bottom-0 left-0 w-[1px] h-0 bg-gradient-to-t from-[#8a6b1f] to-[#d4af37] transition-all duration-300 group-hover:h-full" />

            {/* Gold Gradient Chevron Fix using Mask */}
            <div 
              className="w-5 h-5 bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] transition-transform duration-500 group-hover:-translate-y-1 relative z-10"
              style={{
                WebkitMaskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='18 15 12 9 6 15'></polyline></svg>")`,
                maskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='18 15 12 9 6 15'></polyline></svg>")`,
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            />

            {/* Elegant Background Accent Shift on Hover */}
            <div className="absolute inset-0 bg-neutral-900 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Ambient Shard Glow */}
            <div className="absolute -inset-full bg-gradient-to-tr from-white/0 via-white/5 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopDealBook;