import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const FloatingCoin = ({ position, rotation, speed, floatIntensity }) => {
  const coinTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 40;
    ctx.beginPath(); ctx.arc(512, 512, 480, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 80px serif'; ctx.textAlign = 'center';
    ctx.fillText("BRITANNIA", 512, 200); ctx.font = '200px serif'; ctx.fillText("♔", 512, 600);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={floatIntensity} position={position}>
      <mesh rotation={rotation} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.12, 32, 2]} />
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={1} 
          roughness={0.05}
          bumpMap={coinTexture}
          bumpScale={0.02}
          envMapIntensity={1.8} 
        />
      </mesh>
    </Float>
  );
};

const TreasureScene = () => {
  const coins = useMemo(() => {
    const count = 45; 
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 22, 
        (Math.random() - 0.5) * 14, 
        (Math.random() - 0.5) * 10 - 2 
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: 0.8 + Math.random() * 2,
      floatIntensity: 0.8 + Math.random() * 2,
    }));
  }, []);

  return <group>{coins.map((props, i) => <FloatingCoin key={i} {...props} />)}</group>;
};

const EquityHero = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative w-full bg-[var(--primary-color)] flex flex-col items-center justify-center overflow-hidden min-h-screen">
      
      {/* 1. THREE.JS LAYER */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 15], fov: 40 }} gl={{ antialias: true }}>
          <Environment preset="city" />
          <color attach="background" args={["#080f25"]} />
          <spotLight position={[10, 15, 10]} angle={0.25} penumbra={1} intensity={2500} color="#fff4d6" />
          <pointLight position={[-10, -10, -5]} intensity={1200} color="#d4af37" />
          <TreasureScene />
        </Canvas>
      </div>

      {/* 2. READABILITY OVERLAY */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.3)_100%)]" />

      {/* 3. CONTENT AREA */}
      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center backdrop-blur-[2px] rounded-2xl py-8"
        >
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10 drop-shadow-2xl">
            Equity Solutions for <br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">
              Stability
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="max-w-xl text-neutral-400 text-xs md:text-sm font-normal leading-loose tracking-[0.2em] text-center mb-16 px-6 drop-shadow-lg"
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
            className="group flex flex-col items-center cursor-pointer pointer-events-auto"
          >
            <span className="text-[0.6rem] tracking-[0.4em] uppercase text-neutral-500 mb-4 group-hover:text-[#d4af37] transition-colors duration-300">
              Scroll
            </span>
            <div className="w-[26px] h-[45px] rounded-full border border-neutral-700 flex justify-center p-1.5 backdrop-blur-md bg-white/5">
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
                className="w-1 h-2 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]"
              />
            </div>
          </button>
        </motion.div>
      </div>

      {/* 4. EDGE POLISH */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
    </section>
  );
};

export default EquityHero;