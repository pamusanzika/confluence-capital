import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const Testimonials2 = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      setTestimonials(data || []);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  const duplicated = [...testimonials, ...testimonials];

  return (
    <section className="bg-[white] pt-2 pb-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative flex w-full"
      >
        <motion.div
          className="flex flex-nowrap gap-2"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {duplicated.map((item, idx) => (
            <motion.div
              key={idx}
              className="w-[330px] md:w-[400px] flex-shrink-0 bg-[var(--primary-color)] p-8 rounded-[0rem] shadow-sm flex flex-col justify-between"
            >
              <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent leading-relaxed text-base md:text-[.9rem] mb-8 font-light italic">
                "{item.quote}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1687f1] to-[#d4af37] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.customer_name} className="w-full h-full object-cover" />
                        : <span className="text-white font-bold text-base">{item.customer_name?.[0]?.toUpperCase() || '?'}</span>
                      }
                    </div>
                    <div className="absolute inset-0 rounded-full border border-black/5" />
                    
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-400 text-sm">{item.customer_name}</h4>
                    <p className="text-neutral-600 text-xs font-medium uppercase tracking-wider">{item.position}</p>
                  </div>
                </div>

                <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                  <span className="font-black bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent text-sm tracking-tighter uppercase">
                    {item.company}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonials2;
