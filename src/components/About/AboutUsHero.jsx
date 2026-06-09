import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- HIGH-VISIBILITY FINANCIAL TOPOGRAPHY ---
const FinanceLandscape = () => {
  const meshRef = useRef();
  
  // Grid settings
  const width = 50;
  const height = 50;
  
  // Create a plane geometry and extract its vertices
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, width, height);
    geo.rotateX(-Math.PI / 2); // Lay it flat
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttribute = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < posAttribute.count; i++) {
      // Get the X and Z coordinates
      const x = posAttribute.getX(i);
      const z = posAttribute.getZ(i);

      // Create a complex, visible wave movement
      // This mimics "Market Volatility" or "Data Flow"
      const y = Math.sin(x * 0.5 + time) * 0.4 + 
                Math.sin(z * 0.3 + time * 0.5) * 0.3;

      posAttribute.setY(i, y);
    }
    posAttribute.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1, 0]}>
      {/* Wireframe mode is what makes it look like a finance/tech grid.
          We use a subtle blue-gold mix for the lines.
      */}
      <meshBasicMaterial 
        wireframe 
        transparent 
        opacity={0.25} 
        color="#d4af37" // Gold lines
      />
      
      {/* Add a secondary glow layer for more "Pop" */}
      <mesh geometry={geometry}>
        <meshBasicMaterial 
          wireframe 
          transparent 
          opacity={0.1} 
          color="#1e40af" // Deep blue glow
        />
      </mesh>
    </mesh>
  );
};

// --- MAIN HERO COMPONENT ---
const AboutUsHero = () => {

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  }; 
  
  return (
    <section className="relative w-full bg-[var(--primary-color)] flex flex-col items-center justify-center overflow-hidden min-h-screen">
      
      {/* --- THREE.JS BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <FinanceLandscape />
        </Canvas>
        
        {/* Dark overlay to ensure text is the priority */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609] via-transparent to-[var(--primary-color)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050609_80%)]" />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-8 h-[1px] bg-neutral-700" />
          <span className="text-[10px] tracking-[0.5em] text-neutral-500 font-light uppercase text-center">
            London / Zurich / New York
          </span>
          <div className="w-8 h-[1px] bg-neutral-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10">
            Built Around Complex <br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">Financial Decisions</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="max-w-xl text-neutral-400 text-xs md:text-sm font-normal leading-loose tracking-[0.2em] text-center mb-16 px-6"
        >
          Delivering strategic financial advisory with precision, insight, and global expertise.
        </motion.p>

        {/* --- PREMIUM SCROLL BUTTON --- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <button
                    onClick={scrollToNextSection}
                    className="group flex flex-col items-center cursor-pointer"
                  >
                    <span className="text-[0.6rem] tracking-[0.4em] uppercase text-neutral-500 mb-4 group-hover:text-white transition-colors duration-300">
                      Scroll
                    </span>
                    <div className="w-[26px] h-[45px] rounded-full border border-neutral-700 flex justify-center p-1.5">
                      <motion.div
                        animate={{
                          y: [0, 15, 0],
                          opacity: [1, 0.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-1 h-2 bg-[#d4af37] rounded-full"
                      />
                    </div>
                  </button>
                </motion.div>
      </div>

      {/* Subtle Grain Texture to make it look "Physical/Paper-like" */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </section>
  );
};

export default AboutUsHero;