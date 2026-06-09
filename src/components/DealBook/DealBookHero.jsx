import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- THE NARRATIVE PULSE (Topological Capital Flow) ---
const NarrativePulse = () => {
  const meshRef = useRef();
  
  // Create a large plane with many segments for smooth waves
  const size = 30;
  const segments = 65;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;

    // Distort the vertices to create a high-end "financial wave"
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Complex wave math: combining multiple frequencies for an organic look
      const wave1 = Math.sin(x * 0.3 + t * 0.8) * 0.5;
      const wave2 = Math.cos(y * 0.2 + t * 0.5) * 0.5;
      const ripple = Math.sin(Math.sqrt(x * x + y * y) * 0.4 - t * 1.2) * 0.3;

      pos.setZ(i, wave1 + wave2 + ripple);
    }
    pos.needsUpdate = true;

    // Slowly rotate the entire field for perspective shift
    meshRef.current.rotation.z = t * 0.05;
  });

  return (
    <group position={[0, -1, -5]} rotation={[-Math.PI / 2.5, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[size, size, segments, segments]} />
        <meshBasicMaterial 
          wireframe 
          transparent 
          opacity={0.15} 
          color="#d4af37" // Gold wireframe
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary Blue Glow layer for depth */}
      <mesh position={[0, 0, -0.1]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[size + 2, size + 2, segments / 2, segments / 2]} />
        <meshBasicMaterial 
          wireframe 
          transparent 
          opacity={0.05} 
          color="#1e40af" // Deep Blue accent
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// --- MAIN HERO COMPONENT ---
const DealBookHero = () => {
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
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          {/* Fog creates the "infinite horizon" look */}
          <fog attach="fog" args={["#050609", 8, 20]} />
          <NarrativePulse />
        </Canvas>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609] via-transparent to-[#080f25]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050609_90%)]" />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10">
            Credit Solutions for <br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">Deal Book</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="max-w-xl text-neutral-400 text-xs md:text-sm font-normal leading-loose tracking-[0.2em] text-center mb-16 px-6"
        >
          A testament to strategic capital deployment and the successful realization of value across global sectors.
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

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

    </section>
  );
};

export default DealBookHero;