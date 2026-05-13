import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- TRADING CANDLE BACKGROUND ---
const TradingChartLattice = () => {
  const meshRef = useRef();
  const wickRef = useRef();
  const count = 60; 

  // Adjust this to change speed (0.1 is very slow, 1.0 is original)
  const globalSpeed = 0.2; 

  const candleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (i - count / 2) * 0.4,
        offset: Math.random() * 100, 
        // Lowered the base random speed for a more unified flow
        speed: 0.2 + Math.random() * 0.3, 
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = new THREE.Color();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    candleData.forEach((candle, i) => {
      // Applied globalSpeed here to slow down the time factor
      const noise = Math.sin(t * candle.speed * globalSpeed + candle.offset);
      const height = Math.max(0.1, Math.abs(noise) * 2.5);
      const isPositive = noise > 0;

      // Update Body
      dummy.position.set(candle.x, noise * 0.5, 0);
      dummy.scale.set(0.15, height, 0.15);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Update Wick
      dummy.scale.set(0.02, height * 1.8, 0.02);
      dummy.updateMatrix();
      wickRef.current.setMatrixAt(i, dummy.matrix);

      // Colors
      color.set(isPositive ? "#22c55e" : "#ef4444");
      meshRef.current.setColorAt(i, color);
      wickRef.current.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
    wickRef.current.instanceMatrix.needsUpdate = true;
    wickRef.current.instanceColor.needsUpdate = true;

    // Slowed down the group drift as well
    meshRef.current.parent.rotation.y = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <group rotation={[0, -0.2, 0]}>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.6} />
      </instancedMesh>
      
      <instancedMesh ref={wickRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0.3} />
      </instancedMesh>
    </group>
  );
};

const CreditHero = () => {
  const scrollToNextSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen w-full bg-[var(--primary-color)] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <TradingChartLattice />
        </Canvas>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050609_95%)]" />
      </div>

      {/* Adding a subtle dark overlay to improve text readability */}
      <div className="absolute inset-0 z-[5] bg-black/50" />

      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10">
            Credit Solutions for <br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">
              Stability
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="max-w-xl text-neutral-400 text-xs md:text-sm font-normal leading-loose tracking-[0.2em] text-center mb-16"
        >
          Strategic financial advisory powered by real-time data and institutional precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button onClick={scrollToNextSection} className="group flex flex-col items-center cursor-pointer">
            <span className="text-[0.6rem] tracking-[0.4em] uppercase text-neutral-500 mb-4 group-hover:text-white transition-colors duration-300">
              Scroll
            </span>
            <div className="w-[26px] h-[45px] rounded-full border border-neutral-800 flex justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 15, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-2 bg-[#d4af37] rounded-full"
              />
            </div>
          </button>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[1] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>
    </section>
  );
};

export default CreditHero;