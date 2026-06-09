import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800';

const DealCard = ({ deal, index }) => {
  function handleViewDeal() {
    if (deal.pdf_url) {
      window.open(deal.pdf_url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // ADDED: "flex flex-col h-full" ensures all cards match the height of the tallest card
      className="group relative bg-[var(--primary-color)] rounded-none border border-neutral-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={deal.image_url || FALLBACK_IMAGE}
          alt={deal.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" /> {deal.category}
          </span>
        </div>
      </div>

      {/* ADDED: "flex flex-col flex-grow" manages content spacing perfectly */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* MODIFIED: Separated Title and Description so title wraps don't affect descriptions */}
        <div className="mb-4 flex-grow">
          <h3 className="text-xs font-bold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent uppercase tracking-widest mb-2 min-h-[1rem]">
            {deal.title}
          </h3>
          <p className="text-sm text-neutral-200 line-clamp-2 leading-relaxed">
            {deal.short_description}
          </p>
        </div>

        {/* This block and the button will now always sit locked at the bottom level */}
        <div className="flex items-center justify-between py-4 mb-6 border-t border-neutral-100/10">
          <div>
            <p className="text-[10px] uppercase text-neutral-200 font-medium tracking-tight">
              {deal.tags?.invRange ? 'Investment Range' : deal.category}
            </p>
            <p className="text-xl font-semibold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent">
              {deal.tags?.invRange || deal.status}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-transparent flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-neutral-100" />
          </div>
        </div>

        <button
          onClick={handleViewDeal}
          disabled={!deal.pdf_url}
          className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 rounded-none bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] cursor-pointer text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
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
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('deals')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      setDeals(data || []);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  if (loading || deals.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
          <div className="title-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
              Featured
              <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Transactions</span>
            </h2>
          </div>
        </div>

        {/* MODIFIED: Added items-stretch to make sure flex elements match heights on the row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {deals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;