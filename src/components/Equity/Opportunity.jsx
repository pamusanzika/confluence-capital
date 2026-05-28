import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Wind, BrainCircuit, Activity, BarChart2, DollarSign, Building2, Leaf, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ICON_MAP = {
  wind:     <Wind        className="w-5 h-5 text-white" />,
  brain:    <BrainCircuit className="w-5 h-5 text-white" />,
  activity: <Activity   className="w-5 h-5 text-white" />,
  chart:    <BarChart2  className="w-5 h-5 text-white" />,
  dollar:   <DollarSign className="w-5 h-5 text-white" />,
  building: <Building2  className="w-5 h-5 text-white" />,
  leaf:     <Leaf       className="w-5 h-5 text-white" />,
  trend:    <TrendingUp className="w-5 h-5 text-white" />,
};

const Opportunity = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    supabase
      .from('opportunity_cards')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOpportunities(data);
      });
  }, []);

  return (
    <section className="bg-white py-20 px-6 sm:px-12 lg:px-24 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
       


        {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
            Opportunity
            <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Available</span>
          </h2>
            <p className="mt-4 text-slate-500 max-w-4xl text-lg">
              Confluence Capital connects clients with high-growth potential businesses and impactful investment opportunities.
            </p>
          </div>
          
        </div>

        {/* Opportunity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[var(--primary-color)] border border-slate-100 p-8 rounded-none shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-amber-200/50"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gradient-to-r from-[#1687f1] to-[#d4af37] rounded-lg group-hover:bg-amber-50 transition-colors">
                  {ICON_MAP[item.icon] ?? ICON_MAP.chart}
                </div>
                <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-[#0B0F2A] transition-colors" />
              </div>

              <span className="inline-block text-[10px] font-bold tracking-[0.2em] bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent bg-amber-50 px-2 py-1 rounded mb-4">
                {item.category}
              </span>

              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent leading-tight">
                {item.title}
              </h3>

              <p className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent text-sm leading-relaxed mb-8 min-h-[60px]">
                {item.description}
              </p>

              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-100 uppercase tracking-wider">{item.metric1_label}</span>
                  <span className="text-sm font-semibold text-slate-100">{item.metric1_value}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-100 uppercase tracking-wider">{item.metric2_label}</span>
                  <span className="text-sm font-semibold text-slate-100">{item.metric2_value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] cursor-pointer font-bold py-4 px-10 rounded-none  transition-all duration-300 transform hover:scale-100 active:scale-95 uppercase tracking-widest text-xs">
            
            <span className='text-white'>Read Full Case Study</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Opportunity;