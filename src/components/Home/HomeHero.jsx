import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import bgImage from '../../assets/homeherobg-desktop2.png';
import Stat from './Stat';
import { 
  ArrowRight, MapPin, Building2, TrendingUp, Percent, 
  Clock, Factory, Layers, RefreshCw, Flag, User 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// --- SCHEMA & DATA MAPPING ---
const TAG_SCHEMA = {
  location:    { label: 'Location',         Icon: MapPin },
  propType:    { label: 'Property Type',    Icon: Building2 },
  invRange:    { label: 'Investment Range', Icon: TrendingUp },
  expReturn:   { label: 'Expected Return',  Icon: Percent },
  term:        { label: 'Investment Term',  Icon: Clock },
  industry:    { label: 'Industry',         Icon: Factory },
  stage:       { label: 'Stage',            Icon: Layers },
  roiTimeline: { label: 'ROI Timeline',     Icon: RefreshCw },
  ownership:   { label: 'Ownership %',      Icon: Flag },
  contact:     { label: 'Contact Person',   Icon: User },
};

const STATUS_MAP = { Closed: 'Sold', Ongoing: 'Open' };

function mapLatestDeal(row) {
  if (!row) return null;
  const rawStatus = row.status || 'Open';
  return {
    id: row.id,
    title: row.title || 'Untitled Deal',
    description: row.short_description || '',
    tag: row.category || '',
    status: STATUS_MAP[rawStatus] ?? rawStatus,
    publicTags: row.public_tags || [],
    tags: row.tags || {},
  };
}

// --- CINEMATIC FLOATING DUST ANIMATION ---
const FloatingDust = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.002 + Math.random() * 0.008;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      const posArr = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += speeds[i];
        if (posArr[i * 3 + 1] > 6) {
          posArr[i * 3 + 1] = -6;
          posArr[i * 3] = (Math.random() - 0.5) * 15;
        }
        posArr[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.001;
      }
      geometry.attributes.position.needsUpdate = true;
      camera.position.x += (Math.sin(Date.now() * 0.0005) * 0.001);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-10 pointer-events-none" />;
};

// --- MAIN HERO COMPONENT ---
const HomeHero = () => {
  const heroContent = [
    {
      subtitle: "Precision in Capital Strategy",
      titleMain: "Equity Solutions For",
      titleAccent: "Sustainable Growth",
      description: "Confluence Capital provides bespoke financial advisory and investment solutions, guided by a commitment to integrity, innovation, and client success."
    },
    {
      subtitle: "Global Investment Insight",
      titleMain: "Empowering Your",
      titleAccent: "Financial Future",
      description: "Navigate complex markets with our expert team. We deliver strategic clarity and robust performance across diversified asset classes."
    },
    {
      subtitle: "Strategic Growth Partners",
      titleMain: "Building Resilient",
      titleAccent: "Market Leadership",
      description: "Transforming ambitious visions into market-leading realities through structured capital and long-term advisory excellence and client success.."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestDeal, setLatestDeal] = useState(null);
  const [loadingDeal, setLoadingDeal] = useState(true);

  useEffect(() => {
    async function fetchLatestDeal() {
      try {
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setLatestDeal(mapLatestDeal(data[0]));
        }
      } catch (err) {
        // silent fallback balance
      } finally {
        setLoadingDeal(false);
      }
    }
    fetchLatestDeal();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.215, 0.61, 0.355, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      x: -40, 
      transition: { duration: 0.4 } 
    }
  };

  return (
    <section className="relative px-3 md:px-10 lg:px-17 w-full overflow-hidden bg-[var(--primary-color)] text-white">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--primary-color)]" />
      </motion.div>

      <FloatingDust /> 

      <div className="relative z-20 w-full flex flex-col justify-between pb-12 pt-40 px-0">
        
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side Content Layer: Stripped left padding down to pl-0 for zero margin border placement */}
          <div className="w-full  lg:w-3/5 min-h-[420px] flex flex-col justify-start pl-0">
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={slideLeft}
                >
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] via-[#f7e7a1] to-[#b8891a] bg-clip-text text-transparent">
                    {heroContent[currentIndex].subtitle}
                    </p>

                    <h1 className="new-font uppercase mb-6 text-[2rem] font-semibold leading-[1.1] text-[#e0e0e0] tracking-tight md:text-[4rem] lg:text-[3.9rem]">
                    {heroContent[currentIndex].titleMain} <br /> 
                    <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">
                        {heroContent[currentIndex].titleAccent}
                    </span>
                    </h1>

                    <p className="mb-10 max-w-lg text-sm font-light leading-relaxed text-white/60 md:text-base">
                    {heroContent[currentIndex].description}
                    </p>
                </motion.div>
                </AnimatePresence>
            </div>
            
            <div>
              <a href='/about'>
                 <button className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] text-white flex items-center gap-2 transition-all hover:bg-[#0a0aaa] active:scale-95">
                <span className="text-sm font-medium tracking-wide">More About Us</span>
                <ArrowRight className="w-4 h-4 transition-all group-hover:scale-120" />
              </button>
              </a>
             
            </div>
          </div>

          {/* Right Side Showcase Panel: Pushed completely against the viewport edge */}
<div className="hidden lg:flex w-full lg:w-2/5 flex-col items-end justify-center pr-0">
  <motion.div 
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
    className="w-full max-w-[380px] ml-auto flex justify-end"
  >
    {!loadingDeal && latestDeal ? (
      /* Removed rounded corners on the absolute right side (rounded-r-none) so it merges beautifully into the screen edge */
      <div className="w-full border border-r-0 border-white/10 bg-[#0A1626]/75 p-6 backdrop-blur-xl shadow-2xl rounded-xl flex flex-col justify-between min-h-[380px]">
        
        <div className="flex justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <p className="text-[10px] uppercase font-semibold tracking-widest text-emerald-400">OUR LATEST DEAL</p>
          </div>
          {latestDeal.tag && (
            <span className="bg-[#00214d] border border-white/10 text-white text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              {latestDeal.tag}
            </span>
          )}
        </div>

        <div className="flex-grow flex flex-col justify-start mb-6">
          <h3 className="text-white text-xl font-bold tracking-tight mb-2 line-clamp-2">
            {latestDeal.title}
          </h3>
          <p className="text-white/60 text-xs font-light leading-relaxed line-clamp-3 mb-4">
            {latestDeal.description}
          </p>
          
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            {latestDeal.publicTags.slice(0, 3).map((key) => {
              const schema = TAG_SCHEMA[key];
              if (!schema) return null;
              const { label, Icon } = schema;
              return (
                <div key={key} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon size={14} className="text-white/40" />
                    <span>{label}</span>
                  </div>
                  <span className="font-medium text-white">{latestDeal.tags[key] || '—'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Status: <span className="text-emerald-400 font-semibold">{latestDeal.status}</span></span>
          <a href='/deal-book'>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-xs text-white/70 font-medium group-hover:text-white transition-colors">View DealBook</span>
              <div className="h-7 w-7 rounded-full border border-white/10 flex items-center justify-center bg-white/10 backdrop-blur-md transition-transform group-hover:translate-x-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </a>
        </div>

      </div>
    ) : (
      <div className="w-full aspect-square border border-r-0 border-white/10 bg-[#0A1626]/50 p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between max-w-[250px] rounded-l-xl rounded-r-none">
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
           <p className="text-[10px] uppercase font-medium tracking-widest text-white/40">Firm Presence</p>
        </div>

        <div className="flex-grow flex flex-col justify-center">
           <p className="text-white text-sm">Strategic Reach</p>
           <p className="new-font text-3xl font-medium tracking-tight mt-1 text-white">
             2 <span className="text-xl opacity-80">Global Hubs</span>
           </p>
           <p className="text-[10px] text-white/30 tracking-tight mt-1">Sri Lanka • Singapore</p>
        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
           <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-xs text-white/60">Our Expertise</span>
              <div className="h-7 w-7 rounded-full border border-white/10 flex items-center justify-center bg-white/10 backdrop-blur-md transition-transform group-hover:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
              </div>
           </div>
        </div>
      </div>
    )}
  </motion.div>
</div>
        </div>

        {/* Stat Component Wrapper Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
          className="mt-10 w-full mac-w-7xl pl-0"
        >
          <Stat />
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;