import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- DATA PACKET COMMUNICATION BACKGROUND ---
// This replaces the TradingChartLattice with the requested concept.
const DataPacketNetwork = () => {
  const meshRef = useRef();
  const lineRef = useRef();
  const count = 80; // More particles for a network feel

  // Unified global speed for slow, elegant motion
  const globalSpeed = 0.1; 

  const networkData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Create random start and end points within a viewable volume
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      );
      
      // Calculate a midpoint slightly offset for curved paths
      const mid = start.clone().lerp(end, 0.5);
      mid.y += (Math.random() - 0.5) * 5; // Add some vertical curve
      mid.z += (Math.random() - 0.5) * 2; // Add some depth curve

      // Create a curve from these points
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      data.push({
        curve,
        offset: Math.random() * 100, // Random starting position on curve
        speed: 0.1 + Math.random() * 0.2, // Individual travel speed
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = new THREE.Color();
  const position = new THREE.Vector3();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    networkData.forEach((packet, i) => {
      // Calculate position along the curve based on time
      const u = (t * packet.speed * globalSpeed + packet.offset) % 1; // 0 to 1 loop
      packet.curve.getPointAt(u, position);

      // Update Particle (Packet) Body
      dummy.position.copy(position);
      
      // Slight scale pulsation for a glowing effect
      const scalePulse = 1 + Math.sin(t * 2 + packet.offset) * 0.1;
      dummy.scale.set(0.2 * scalePulse, 0.2 * scalePulse, 0.2 * scalePulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // --- Line Trails (Simplistic representation using same geometry for efficiency) ---
      // Reusing dummy Object3D for the lines, but scaling them differently
      const trailLength = 0.5; // Controls length of the trail
      for (let j = 1; j <= 3; j++) {
        const trailU = Math.max(0, u - (j * 0.05)); // Positions slightly behind the main packet
        packet.curve.getPointAt(trailU, position);
        dummy.position.copy(position);
        // Thin out the scale for trails
        const trailScale = 0.2 * (1 - (j/4));
        dummy.scale.set(trailScale, trailScale, trailScale);
        dummy.updateMatrix();
        lineRef.current.setMatrixAt(i * 3 + j - 1, dummy.matrix); // Offset index for lines
      }
      
      // --- Colors ---
      // Predominantly Soft Blue, with subtle Gold highlights
      const colorFactor = Math.sin(t * packet.speed + packet.offset);
      // isPositive logic from previous code adapted to shift color subtly
      const isShifted = colorFactor > 0.8; // Only highlight occasionally
      color.set(isShifted ? "#d4af37" : "#1687f1"); // Subtle Gold hint vs Soft Blue
      
      meshRef.current.setColorAt(i, color);
      // Make lines slightly more subtle/transparent via color/opacity
      const lineColor = color.clone().multiplyScalar(0.7); // Darken trail lines slightly
      lineRef.current.setColorAt(i * 3 + 0, lineColor);
      lineRef.current.setColorAt(i * 3 + 1, lineColor);
      lineRef.current.setColorAt(i * 3 + 2, lineColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
    
    lineRef.current.instanceMatrix.needsUpdate = true;
    lineRef.current.instanceColor.needsUpdate = true;

    // Slow group drift maintained from previous code
    meshRef.current.parent.rotation.y = Math.sin(t * 0.03) * 0.03;
    meshRef.current.parent.rotation.x = Math.cos(t * 0.02) * 0.02; // Added slight x drift
  });

  return (
    <group rotation={[0.1, -0.1, 0]}> {/* Subtle rotation adjustment */}
      {/* Main Packets */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <sphereGeometry args={[1, 16, 16]} /> {/* Sphere for packet look */}
        <meshBasicMaterial transparent opacity={0.7} />
      </instancedMesh>
      
      {/* Packet Trails (using smaller spheres for efficiency over complex lines) */}
      <instancedMesh ref={lineRef} args={[null, null, count * 3]}>
        <sphereGeometry args={[1, 8, 8]} /> {/* Lower detail for trails */}
        <meshBasicMaterial transparent opacity={0.2} /> {/* Much lower opacity for trails */}
      </instancedMesh>
    </group>
  );
};

const ContactHero = () => {
  const scrollToNextSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    // Structure, classes, and overlays remain identical
    <section className="relative min-h-screen w-full bg-[var(--primary-color)] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}> {/* Slightly adjusted camera */}
          <ambientLight intensity={0.5} />
          {/* Replaced TradingChartLattice with DataPacketNetwork */}
          <DataPacketNetwork />
        </Canvas>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050609_95%)]" />
      </div>

      <div className="absolute inset-0 z-[5] bg-black/50" />

      {/* Hero content section structure and text remains identical */}
      <div className="relative z-10 max-w-[75rem] w-full flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Specific request to keep "Credit Solutions..." text, perhaps unusual for a contact page, 
              but adhering strictly to the 'Do NOT change' instruction. */}
          <h1 className="text-4xl md:text-[5rem] text-center font-extralight text-white tracking-[0.1em] leading-[1.1] uppercase mb-10">
            Contact Us <br />
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">
              Page
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="max-w-xl text-neutral-400 text-xs md:text-sm font-normal leading-loose tracking-[0.2em] text-center mb-16"
        >
          {/* Subtext remains identical */}
          Strategic financial advisory powered by real-time data and institutional precision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {/* Scroll button remains identical */}
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

      {/* Grid overlay remains identical */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-[1] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>
    </section>
  );
};

export default ContactHero;