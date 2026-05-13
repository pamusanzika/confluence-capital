import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, Zap } from 'lucide-react';

const dealsData = [
  {
    id: 1,
    name: "Quantum Dynamics",
    type: "Equity",
    description: "Series B funding for next-generation satellite propulsion systems.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    metric: "$45M",
    label: "Investment Value"
  },
  {
    id: 2,
    name: "Stellar Logistics",
    type: "Debt",
    description: "Restructuring and financing for cross-border automated freight networks.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    metric: "128t",
    label: "Throughput Growth"
  },
  {
    id: 3,
    name: "Nexus Fintech",
    type: "Advisory",
    description: "Strategic advisory for the merger of two leading digital payment providers.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    metric: "12k+",
    label: "Daily Transactions"
  }
];

const DealCard = ({ deal, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[var(--primary-color)] rounded-none border border-neutral-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={deal.image} 
          alt={deal.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" /> {deal.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-widest mb-1">
              {deal.name}
            </h3>
            <p className="text-sm text-neutral-200 line-clamp-2 leading-relaxed">
              {deal.description}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-4 mb-6">
          <div>
            <p className="text-[10px] uppercase text-neutral-200 font-medium tracking-tight">{deal.label}</p>
            <p className="text-xl font-semibold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent">{deal.metric}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-neutral-100  transition-colors" />
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 rounded-none bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] cursor-pointer text-white  transition-all duration-300">
          <span className="text-xs font-bold uppercase tracking-widest">
            View Deal Book
          </span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
};

const Deals = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
          {/* Modern Minimal Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
            Featured
            <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Transactions</span>
          </h2>
            
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealsData.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;