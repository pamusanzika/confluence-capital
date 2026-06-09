import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { TrendingUp, Briefcase, Clock, Users } from 'lucide-react';
import { supabase } from '../../admin/supabaseClient';

// Helper component for the counting logic
const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract the number and the suffix (e.g., "$10B+" -> number: 10, suffix: "B+", prefix: "$")
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]|\$/g, "");
  const prefix = value.startsWith("$") ? "$" : "";

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, numericValue, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, numericValue]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const STATS_TEMPLATE = [
  {
    key: "stat_years_experience",
    suffix: "+",
    label: "Years of Market Experience",
    description: "Decades of deep market mastery and expertise.",
    icon: <Clock className="w-5 h-5 text-blue-600" />,
    color: "bg-indigo-50",
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    key: "stat_active_projects",
    suffix: "+",
    label: "Active Projects Delivered",
    description: "Precision and excellence in every closing.",
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    color: "bg-purple-50",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    key: "stat_successful_exits",
    suffix: "+",
    label: "Proven Successful Exits",
    description: "Minimize risk, maximize returns.",
    icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    color: "bg-blue-50",
    gradient: "from-blue-500/20 to-indigo-500/20"
  },
  {
    key: "stat_project_pipeline",
    suffix: "M",
    label: "Project Pipeline (USD)",
    description: "Trusted by industry leaders globally.",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    color: "bg-violet-50",
    gradient: "from-violet-500/20 to-purple-500/20",
    featured: true
  }
];

const OurImpact = () => {
  const [numericValues, setNumericValues] = useState({
    stat_years_experience: 40,
    stat_active_projects: 30,
    stat_successful_exits: 7,
    stat_project_pipeline: 80,
  });

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (!data?.length) return;
      const map = Object.fromEntries(data.map((r) => [r.key, Number(r.value)]));
      setNumericValues((prev) => ({ ...prev, ...map }));
    });
  }, []);

  const stats = STATS_TEMPLATE.map((s) => ({
    ...s,
    value: `${numericValues[s.key]}${s.suffix}`,
  }));

  return (
    <section className="bg-[white] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
              Our Track
              <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Record</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl text-lg">
              We combine deep market intelligence with relentless execution to drive 
              superior financial outcomes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden p-8 rounded-[0rem] transition-all duration-300 shadow-sm
                ${stat.featured 
                  ? 'bg-[var(--primary-color)] text-white lg:scale-105 shadow-xl shadow-indigo-200' 
                  : 'bg-[var(--primary-color)] border border-zinc-100'
                }`}
              style={{
                clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)'
              }}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-8 
                ${stat.featured ? 'bg-white/20' : 'bg-white/20'}`}>
                {stat.icon}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent font-extrabold tracking-tighter">
                    {/* Replaced raw stat.value with Counter component */}
                    <Counter value={stat.value} />
                  </span>
                </div>
                <h3 className="text-lg bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent font-bold leading-tight">
                  {stat.label}
                </h3>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-white/80">
                {stat.description}
              </p>

              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10 rounded-tl-[0] bg-white" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurImpact;