import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { slugify } from '../../lib/slugify';

// Built-in resilient fallbacks so the component never breaks if the DB is empty


// Maps real-time data streaming back from your Supabase engine
function mapDbPost(p) {
  const rawDate = p.updated_date || p.created_at;
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    description: p.short_description || '',
    date: rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { month: 'SHORT', year: 'numeric' }).toUpperCase()
      : 'MAY 2026',
    category: p.category || 'Equity',
    img: p.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
  };
}

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquityStories() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('category', 'Equity')
          .or('status.eq.published,status.is.null')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          setStories(data.map(mapDbPost));
        } else {
          setStories(FALLBACK_EQUITY_DATA);
        }
      } catch (err) {
        console.error('Database connection failed, initializing static fallback layers:', err);
        setStories(FALLBACK_EQUITY_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchEquityStories();
  }, []);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
              Intelligence Portfolio
              <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Report</span>
            </h2>
            <p className="mt-4 text-slate-500 max-w-4xl text-[1rem]">
              Strategic insights and structured investment narratives framing modern equity solutions and market placements.
            </p>
          </div>
          
          <Link to="/blogs">
            <button className="group relative overflow-hidden px-10 py-4 bg-[var(--primary-color)] text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer">
              <span className="relative z-10">See All Stories</span>
            </button>
          </Link>
        </div>

        {/* Blog-Style Grid Layer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {loading ? (
            // Shimmering animation skeletal states keeping layouts secure and stable during transmission cycles
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="relative aspect-video mb-6 bg-zinc-100" />
                <div className="flex justify-between mb-4 border-b border-neutral-100 pb-4">
                  <div className="h-2 bg-zinc-200 w-1/4" />
                  <div className="h-2 bg-zinc-100 w-1/5" />
                </div>
                <div className="h-5 bg-zinc-200 w-3/4 mb-3" />
                <div className="h-3 bg-zinc-100 w-full mb-2" />
                <div className="h-3 bg-zinc-100 w-2/3 mb-6" />
                <div className="h-3 bg-zinc-200 w-1/3" />
              </div>
            ))
          ) : (
            stories.map((story) => (
              <Link to={`/blogs/${story.slug}`} key={story.id} className="group cursor-pointer flex flex-col">
                {/* Cinematic Image Frame Layout - Aspect Ratio (16:9) */}
                <div className="relative aspect-video mb-6 overflow-hidden bg-neutral-100">
                  <img 
                    src={story.img} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Metadata Integration Container Line */}
                <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-4">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#d4af37] uppercase">
                    {story.category}
                  </span>
                  <span className="text-[9px] font-medium text-neutral-400 tracking-widest uppercase">
                    {story.date}
                  </span>
                </div>
                
                {/* Title and Short Description Text Field Fields */}
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-neutral-950 mb-3 leading-snug transition-colors group-hover:text-[#1687f1]">
                    {story.title}
                  </h4>
                  <p className="text-neutral-500 font-normal text-sm leading-relaxed mb-6 line-clamp-2">
                    {story.description}
                  </p>
                </div>
                
                {/* Minimalist Micro-Interactive Core Arrow Anchor */}
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-900 group-hover:gap-4 transition-all">
                  Read Story <span className="text-[#d4af37]">→</span>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default SuccessStories;