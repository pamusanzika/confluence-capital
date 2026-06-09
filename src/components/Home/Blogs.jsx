import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { slugify } from '../../lib/slugify';
import { blogPosts } from '../Blogs/blogData';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800';

function mapDbPost(p) {
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    preview: p.short_description || '',
    category: p.category || 'Market Insights',
    img: p.image_url || FALLBACK_IMAGE,
    date: p.created_at 
      ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : ''
  };
}

const STATIC_SHADOW = "0 15px 40px rgba(0, 0, 0, 0.06)"; 
const HOVER_SHADOW = "0 30px 60px rgba(0, 0, 0, 0.12)";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // ── Fetch Latest 6 Market Insights Posts ───────────────────────────────────
  useEffect(() => {
    async function fetchLatestBlogs() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('category', 'Market Insights') // Restricts collection purely to market insight tags
          .or('status.eq.published,status.is.null')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        if (data && data.length > 0) {
          setBlogs(data.map(mapDbPost));
        } else {
          // Extracts localized structural data exclusively tagged as Market Insights
          const localMarketInsights = (blogPosts['Market Insights'] || [])
            .slice(0, 6)
            .map(p => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              preview: p.description || p.preview || '',
              category: 'Market Insights',
              img: p.img || FALLBACK_IMAGE,
              date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
            }));
          setBlogs(localMarketInsights);
        }
      } catch (err) {
        console.error('Failed to fetch home page insights:', err);
        const localMarketInsights = (blogPosts['Market Insights'] || [])
          .slice(0, 6)
          .map(p => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            preview: p.description || p.preview || '',
            category: 'Market Insights',
            img: p.img || FALLBACK_IMAGE,
            date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
          }));
        setBlogs(localMarketInsights);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestBlogs();
  }, []);

  // ── GSAP ScrollTrigger Animation Lifecycle ──────────────────────────────────
  useEffect(() => {
    if (loading || blogs.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".header-content", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".header-content",
          start: "top 85%",
        }
      });

      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".card-grid",
          start: "top 85%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, blogs]);

  // ── Premium Micro-Animations ───────────────────────────────────────────────
  const onMouseEnter = (index) => {
    if (cardsRef.current[index]) {
      gsap.to(cardsRef.current[index], {
        y: -10,
        boxShadow: HOVER_SHADOW,
        borderColor: "rgba(212, 175, 55, 0.5)",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const onMouseLeave = (index) => {
    if (cardsRef.current[index]) {
      gsap.to(cardsRef.current[index], {
        y: 0,
        boxShadow: STATIC_SHADOW,
        borderColor: "rgba(255, 255, 255, 0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  return (
    <section ref={sectionRef} className="bg-white py-24 lg:py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="header-content flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-500 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37]" /> Intelligence & Analysis
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
              Latest 
              <span className="font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> Insights</span>
            </h2>
          </div>

          <Link to="/blogs">
            <button className="group cursor-pointer relative px-8 py-4 bg-transparent text-neutral-900 border border-neutral-300 flex items-center gap-3 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-50 active:scale-95 rounded-none">
              <span className="text-xs font-bold uppercase tracking-widest">View All Insights</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#d4af37]" />
            </button>
          </Link>
        </div>

        {/* Card Grid Container */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-neutral-50 border border-neutral-200 h-[520px] flex flex-col justify-between animate-pulse rounded-none">
                <div className="w-full h-48 bg-neutral-200" />
                <div className="p-6 flex-grow space-y-4">
                  <div className="h-2 w-1/4 bg-neutral-200" />
                  <div className="h-5 w-3/4 bg-neutral-200" />
                  <div className="h-3 w-full bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {blogs.map((blog, index) => (
              <Link 
                to={`/blogs/${blog.slug}`} 
                key={blog.id}
                className="block h-full group/card relative"
              >
                <div
                  ref={el => cardsRef.current[index] = el}
                  onMouseEnter={() => onMouseEnter(index)}
                  onMouseLeave={() => onMouseLeave(index)}
                  className="relative bg-[var(--primary-color)] rounded-none h-full flex flex-col overflow-hidden cursor-pointer border border-white/15 transition-colors duration-300"
                  style={{ boxShadow: STATIC_SHADOW }}
                >
                  {/* Premium Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-900 flex-shrink-0">
                    <img 
                      src={blog.img} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                          {blog.category}
                        </span>
                        {blog.date && (
                          <span className="text-[9px] font-medium uppercase tracking-widest text-neutral-400">
                            {blog.date}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg md:text-xl font-bold leading-snug mb-3 text-white tracking-tight group-hover/card:text-[#1687f1] transition-colors duration-300">
                        {blog.title}
                      </h3>
                      
                      <p className="text-neutral-300/90 leading-relaxed text-xs line-clamp-4 font-normal">
                        {blog.preview}
                      </p>
                    </div>
                  </div>

                  {/* Centered Minimal Text Overlay */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] opacity-0 group-hover/card:opacity-100 transition-all duration-400 flex items-center justify-center z-10">
                    <div className="translate-y-3 group-hover/card:translate-y-0 transition-transform duration-500 flex items-center gap-1.5 text-white text-xs font-bold uppercase tracking-[0.2em]">
                      <span>Read Article</span>
                      <ArrowUpRight size={14} className="text-[#d4af37] transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;