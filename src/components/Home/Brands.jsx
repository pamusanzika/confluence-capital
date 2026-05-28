import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  UtensilsCrossed, BedDouble, Factory, ShoppingCart,
  Cpu, Home, Leaf, Heart, BarChart2,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const CATEGORY_ICON = {
  'Food & Beverage': <UtensilsCrossed size={15} />,
  'Hospitality':     <BedDouble size={15} />,
  'Manufacturing':   <Factory size={15} />,
  'Retail':          <ShoppingCart size={15} />,
  'Technology':      <Cpu size={15} />,
  'Real Estate':     <Home size={15} />,
  'Agriculture':     <Leaf size={15} />,
  'Healthcare':      <Heart size={15} />,
};

const Brands = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase
        .from('deals')
        .select('category, title, tags')
        .order('created_at', { ascending: false });

      if (!data) return;

      const mapped = data
        .filter(d => d.tags?.dealValue)
        .map(d => ({
          label:   (d.category || '').toUpperCase(),
          title:   d.title || '',
          value:   d.tags.dealValue,
          irr:     d.tags.irr || '',
          moic:    d.tags.moic || '',
          payback: d.tags.payback || '',
          icon:    CATEGORY_ICON[d.category] || <BarChart2 size={15} />,
        }));

      setStats(mapped);
    }
    fetchStats();
  }, []);

  if (stats.length === 0) return null;

  const tripleStats = [...stats, ...stats, ...stats];

  return (
    <section className="w-full py-0 bg-white border-y-2 border-neutral-200 overflow-hidden shadow-md">
      <div className="relative flex items-center h-[50px]">
        <div className="flex animate-scroll-infinite hover:[animation-play-state:paused]">
          {tripleStats.map((item, index) => (
            <div
              key={index}
              className="group relative h-[50px] bg-[var(--primary-color)]/85 border-r-2 border-neutral-200 overflow-hidden px-6 flex items-center gap-5 shrink-0 transition-colors duration-300 "
            >
              {/* CATEGORY ICON & LABEL */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-blue-400 transition-colors duration-300">
                  {item.icon}
                </span>
                <span className="text-[12px] font-extrabold text-neutral-200 tracking-wide uppercase">
                  {item.label}
                </span>
              </div>

              {/* SEPARATOR DOT */}
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />

              {/* BRAND / PROJECT TITLE */}
              {item.title && (
                <span className="text-[13px] text-blue-400 font-bold max-w-[160px] truncate shrink-0">
                  {item.title}
                </span>
              )}

              {/* MAIN VALUE */}
              <span className="text-lg font-black bg-gradient-to-r from-[#1687f1] to-[#b3922e] bg-clip-text text-transparent tracking-tight shrink-0">
                {item.value}
              </span>

              {/* METRICS DIVISION (IRR & MOIC) */}
              <div className="flex items-center gap-4 shrink-0 bg-neutral-100/80 px-2.5 py-1 border border-neutral-200 rounded text-[12px]">
                {item.irr && (
                  <span className="flex items-center font-extrabold text-emerald-700">
                    <TrendingUp size={12} className="mr-1" />
                    {item.irr} 
                    <span className="text-[9px] text-neutral-500 font-bold ml-0.5">IRR</span>
                  </span>
                )}
                
                {item.moic && (
                  <span className="font-extrabold text-neutral-800">
                    {item.moic} 
                    <span className="text-[9px] text-[#b3922e] font-black ml-0.5">MOIC</span>
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite 35s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Brands;