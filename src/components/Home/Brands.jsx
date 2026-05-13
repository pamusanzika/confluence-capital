import React from 'react';
import { GraduationCap, Landmark, ShoppingCart, Code2, Leaf, TrendingUp } from 'lucide-react';

const Brands = () => {
  // Updated data to match client's specific advisory verticals
  const stats = [
    { 
      label: 'INTERNATIONAL SCHOOLS', 
      value: '2B+', 
      growth: '+14%', 
      icon: <GraduationCap size={18} />,
      detail: 'Institutional Valuation'
    },
    { 
      label: 'BANKING & FINANCE', 
      value: '5B+', 
      growth: '+08%', 
      icon: <Landmark size={18} />,
      detail: 'Asset Restructuring'
    },
    { 
      label: 'RETAIL & MANUFACTURING', 
      value: '3B+', 
      growth: '+11%', 
      icon: <ShoppingCart size={18} />,
      detail: 'Capital Deployment'
    },
    { 
      label: 'TECH & FINTECH', 
      value: '4B+', 
      growth: '+24%', 
      icon: <Code2 size={18} />,
      detail: 'Equity Infusion'
    },
    { 
      label: 'GREEN FINANCE', 
      value: '1.5B', 
      growth: '+32%', 
      icon: <Leaf size={18} />,
      detail: 'Project Financing'
    }
  ];

  const tripleStats = [...stats, ...stats, ...stats];

  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="relative flex items-center">
        
        <div className="flex gap-5 animate-scroll-infinite hover:[animation-play-state:paused]">
          {tripleStats.map((item, index) => (
            <div
              key={index}
              className="group relative min-w-[280px] h-[180px] bg-[var(--primary-color)] border rounded-none overflow-hidden p-6 transition-all duration-500 border-blue-600/30 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
            >
              {/* Internal Grid/Structure Lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 rounded-full blur-3xl opacity-0 transition-opacity duration-700" />
              
              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                    <span className="text-[9px] font-black text-blue-600 tracking-[0.2em] uppercase">Confluence Data</span>
                  </div>
                  <h4 className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                    {item.label}
                  </h4>
                </div>
                <div className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-400 bg-blue-600 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
              </div>

              {/* Main Content */}
              <div className="mt-6 relative z-10">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent tracking-tighter transition-colors duration-500">
                  {item.value}
                </span>
                <p className="text-[11px] text-neutral-500 font-medium tracking-tight">
                  {item.detail}
                </p>
              </div>

              {/* Footer - Metric Bar */}
              <div className="absolute bottom-0 left-0 w-full px-6 py-4 flex items-center justify-between bg-[var(--primary-color)] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={10} className="mr-1" />
                    {item.growth}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Growth</span>
                </div>
                
                {/* Micro Visualizer */}
                <div className="flex gap-[2px] items-end h-3">
                  {[40, 70, 50, 90].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-[3px] bg-neutral-200 group-hover:bg-blue-500 transition-all duration-500 rounded-full" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Top Accent line on hover */}
              <div className="absolute top-0 left-0 h-[3px] w-0 bg-blue-600 group-hover:w-full transition-all duration-700 ease-in-out" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33% - 20px)); }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Brands;