import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingPage = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Minimalist Geometric Loader */}
            <div className="relative w-24 h-24 mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border-[0.5px] border-neutral-200"
              />
              <motion.div
                animate={{
                  scale: [1, 0.8, 1],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-4 border-[1px] border-neutral-800"
              />
            </div>

            {/* Typography Section */}
            <div className="overflow-hidden h-6">
              <motion.p
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[10px] tracking-[0.3em] uppercase font-light text-neutral-500"
              >
                Loading Experience
              </motion.p>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-48 h-[1px] bg-neutral-100 mt-6 relative overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-neutral-900 w-1/2"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;