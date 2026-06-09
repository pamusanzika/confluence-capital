import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- THE INSIGHT HORIZON (Flowing Narrative Ribbons) ---
const InsightFlow = () => {
  const groupRef = useRef();

  // Create multiple ribbon "paths"
  const ribbonCount = 5;
  const ribbons = useMemo(() => {
    return Array.from({ length: ribbonCount }).map((_, i) => ({
      speed: 0.2 + i * 0.1,
      offset: i * Math.PI * 0.4,
      amplitude: 0.5 + i * 0.3,
      color: i % 2 === 0 ? "#d4af37" : "#ffffff", // Alternate Gold and White
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Tilt the whole group for a flat, expansive perspective
    groupRef.current.rotation.x = -0.4;
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {ribbons.map((config, idx) => (
        <Ribbon key={idx} {...config} index={idx} />
      ))}
    </group>
  );
};

const Ribbon = ({ speed, offset, amplitude, color, index }) => {
  const meshRef = useRef();
  const segments = 60;
  const width = 20;

  // Create a plane that we will distort into a wave
  const geometry = useMemo(() => new THREE.PlaneGeometry(30, 2, segments, 1), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i <= segments; i++) {
      const x = pos.getX(i);
      // Create a sophisticated wave pattern
      const wave = Math.sin(x * 0.3 + t * speed + offset) * amplitude;
      const subWave = Math.cos(x * 0.5 - t * 0.5) * 0.2;
      
      // Update the top and bottom vertices of the plane segment
      pos.setY(i, wave + subWave);
      pos.setY(i + segments + 1, wave + subWave - 0.5);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, (index - 2) * 1.2, -5]}>
      <meshBasicMaterial 
        wireframe 
        transparent 
        opacity={0.25 - index * 0.03} 
        color={color} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// --- MAIN HERO COMPONENT (Unchanged Structure) ---
const BlogsHero = () => {

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
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <InsightFlow />
        </Canvas>
        
        {/* Dark overlays to ensure text is the priority */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609] via-transparent to-[#080f25]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050609_90%)]" />
      </div>

      {/* --- CONTENT AREA (Unchanged) --- */}
      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        
        

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10">
            Stories That Drives<br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">Confluence Capital</span>
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

        {/* --- PREMIUM SCROLL BUTTON (Unchanged) --- */}
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

      {/* Subtle Grain Texture remains as requested */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </section>
  );
};

export default BlogsHero;