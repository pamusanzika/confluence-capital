import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Discovery & Analysis",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "Step 01"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Growth Architecture",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "Step 02"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Action",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus?",
    tag: "Step 03"
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Longevity & Ethics",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque veritatis error sint quo consectetur tempora accusantium totam, adipisci voluptas nobis nesciunt natus commodi, sapiente nam inventore voluptates magnam officia accusamus.",
    tag: "Step 04"
  },
];

const HowWeDoIt = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // This moves the "Process Train" horizontally based on vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  // Opacity for the background heading
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[var(--primary-color)]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Background Large Heading */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h2 className="text-[15vw] font-black text-[white]/3 uppercase tracking-tighter">
            HOW WE DO 
            
          </h2>
        </motion.div>

        {/* The Horizontal Content */}
        <motion.div style={{ x }} className="flex gap-12 px-[10vw]">
          
          {/* Intro Slide */}
          <div className="group relative flex h-[500px] w-[500px] flex-col justify-center shrink-0">
             <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-bold tracking-[0.4em] text-xs uppercase mb-4">
               The Workflow
             </span>
             <h3 className="text-6xl font-light text-white leading-[1.1]">
               Our <br /> Strategic <br /> <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-semibold">Engine.</span>
             </h3>
             <p className="mt-8 text-zinc-400 text-lg max-w-sm leading-relaxed">
               Scroll to see how we transform concepts into market-leading products.
             </p>
          </div>

          {/* Step Cards */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative h-[500px] w-[450px] shrink-0 overflow-hidden rounded-[0] bg-zinc-900/40 border border-zinc-800 p-10 flex flex-col justify-between backdrop-blur-sm group"
            >
              {/* Card Glow Effect */}
              <div className="absolute -right-20 -top-20 h-64 w-64 bg-amber-500/10 blur-[100px] rounded-full group-hover:bg-amber-500/20 transition-colors duration-500" />
              
              <div>
                <div className="mb-8 inline-flex p-4 rounded-2xl bg-gradient-to-r from-[#1687f1] to-[#d4af37] border border-zinc-800 text-[var(--primary-color)]">
                  {step.icon}
                </div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent mb-4 tracking-tight">{step.title}</h4>
                <p className="text-zinc-500 text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
                  {step.tag}
                </span>
                <div className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent   transition-all">
                  0{index + 1}
                </div>
              </div>
            </div>
          ))}

          {/* End Slide */}
          <div className="flex h-[500px] w-[300px] items-center justify-center shrink-0">
            <a href='/contact'>
               <button className="cursor-pointer px-8 py-4 bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-black font-bold rounded-none hover:bg-amber-400 transition-colors">
              CONTACT US
             </button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Progress Bar at the bottom */}
      <div className="absolute bottom-10 left-[10vw] right-[10vw] h-[1px] bg-zinc-900">
        <motion.div 
          style={{ scaleX: scrollYProgress }} 
          className="h-full bg-gradient-to-r from-[#1687f1] to-[#d4af37] origin-left"
        />
      </div>
    </section>
  );
};

export default HowWeDoIt;