import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const ORBITS = [
  { size: 'w-[500px] h-[500px] md:w-[700px] md:h-[700px]', opacity: 'border-gray-100' },
  { size: 'w-[800px] h-[800px] md:w-[1100px] md:h-[1100px]', opacity: 'border-gray-50' }
];

const AVATARS = [
  { id: 1, src: "https://i.pravatar.cc/150?u=a", top: '10%', left: '5%', delay: 0.1, msg: "Thank you so much!" },
  { id: 2, src: "https://i.pravatar.cc/150?u=x", top: '30%', left: '65%', delay: 0.3, msg: "Awesome!!!" },
  { id: 3, src: "https://i.pravatar.cc/150?u=c", top: '45%', left: '5%', delay: 0.5, msg: "✨" },
  { id: 4, src: "https://i.pravatar.cc/150?u=m", top: '25%', left: '10%', delay: 0.2 },
  { id: 5, src: "https://i.pravatar.cc/150?u=n", top: '5%', left: '70%', delay: 0.4 },
  { id: 6, src: "https://i.pravatar.cc/150?u=p", top: '40%', left: '90%', delay: 0.6 },
  { id: 7, src: "https://i.pravatar.cc/150?u=l", top: '20%', left: '85%', delay: 0.1, msg: "Exceptional service!" },
];

const Clients = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5);
      setTestimonials(data || []);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[index];

  return (
    <section className="relative min-h-screen w-full bg-[#F3F4F6] flex items-center justify-center overflow-hidden py-24">

      {/* --- BACKGROUND ORBITAL RINGS --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {ORBITS.map((orbit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute rounded-full border ${orbit.size} ${orbit.opacity}`}
          />
        ))}
      </div>

      {/* --- FLOATING AVATARS --- */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
        {AVATARS.map((avatar) => (
          <motion.div
            key={avatar.id}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: avatar.delay }}
            className="absolute z-20 pointer-events-auto"
            style={{ top: avatar.top, left: avatar.left }}
          >
            <div className="relative group cursor-pointer">
              <img
                src={avatar.src}
                alt="Client"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-xl hover:scale-110 transition-transform duration-300"
              />
              {avatar.msg && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: avatar.delay + 0.4 }}
                  className="absolute left-full ml-3 top-0 bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-white text-[10px] md:text-xs px-4 py-2 whitespace-nowrap shadow-lg font-medium"
                >
                  {avatar.msg}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1687f1] rotate-45" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
            Over 17k+ clients <br />
            trust <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">Confluence Capital</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="w-full max-w-3xl min-h-[500px] flex items-center justify-center">
          {loading && (
            <div className="text-gray-400 text-sm">Loading…</div>
          )}

          {!loading && testimonials.length === 0 && (
            <div className="w-full bg-[#F9F9FB] p-10 md:p-20 text-center shadow-sm border border-gray-100 text-gray-400 text-sm">
              No featured testimonials yet.
            </div>
          )}

          {!loading && testimonials.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-[#F9F9FB] p-10 md:p-20 text-center relative shadow-sm border border-gray-100"
              >
                {/* Central Avatar */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-gradient-to-br from-[#1687f1] to-[#d4af37] flex items-center justify-center">
                    {current.image_url
                      ? <img src={current.image_url} alt={current.customer_name} className="w-full h-full object-cover" />
                      : <span className="text-white font-bold text-4xl">{current.customer_name?.[0]?.toUpperCase() || '?'}</span>
                    }
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="mt-12 space-y-6">
                  <div>
                    {/* Star Rating */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-[#d4af37]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{current.customer_name}</h4>
                    {(current.position || current.company) && (
                      <p className="text-gray-500 text-sm mt-1">
                        {[current.position, current.company].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>

                  <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed italic">
                    "{current.quote}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default Clients;
