import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Importing company logo from the assets folder
import logo from '../assets/logo4.png'; 

const LoadingPage = ({ isVisible }) => {
  // Split phrase into individual characters for an advanced staggered text reveal
  const statementText = "ESTABLISHING.SECURE.GATEWAY";
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--primary-color,#0a0a0a)] select-none overflow-hidden"
        >
          {/* Core Content Container */}
          <div className="relative flex flex-col items-center justify-center px-6">
            
            {/* ADVANCED ANIMATION 2: The Silent Focal Mask Reveal */}
            {/* Logo emerges through an elegant blur-to-focus and slight forward-scale animation */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.93 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-52 sm:w-64 md:w-72 h-auto mb-16 flex items-center justify-center"
            >
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-full h-auto object-contain max-h-[310px]"
                draggable="false"
              />
            </motion.div>

            {/* Premium Typographic Block */}
            <div className="flex flex-col items-center space-y-4">
              
              {/* ADVANCED ANIMATION 3: Staggered Letter Wave Reveal */}
              <div className="flex overflow-hidden py-1">
                {statementText.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04, 
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="text-[9px] text-center sm:text-[10px] tracking-[0.35em] uppercase font-light text-neutral-400 font-mono"
                  >
                    {char === "." ? "\u00A0\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              {/* ADVANCED ANIMATION 4: The Micro-Dot Rhythm Module */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-[3px] h-[3px] bg-neutral-200" 
                  />
                ))}
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;