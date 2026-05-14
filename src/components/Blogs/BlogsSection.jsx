import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts, latestInsights } from './blogData';
import { supabase } from '../../lib/supabaseClient';
import { slugify } from '../../lib/slugify';

// Map a raw Supabase blog row to the shape the card template expects
function mapDbPost(p) {
  const rawDate = p.updated_date || p.created_at;
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    description: p.short_description || '',
    date: rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '',
    readTime: p.reading_time || '5 min read',
    category: p.category || 'Market Insights',
    img: p.image_url || '',
    content: p.description || '',
  };
}

const BlogsSection = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [posts, setPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState(latestInsights); // default to static
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const categories = ['All', 'Equity', 'Credit', 'Market Insights'];

  // ── Fetch posts from Supabase ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .or('status.eq.published,status.is.null')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(mapDbPost);
          setPosts(mapped);
          // Use the 4 most recent DB posts for "Latest Insights"
          setLatestPosts(mapped.slice(0, 4));
        } else {
          // Fallback to static data if DB is empty
          setPosts(Object.values(blogPosts).flat());
          setLatestPosts(latestInsights);
        }
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        // Fallback on error
        setPosts(Object.values(blogPosts).flat());
        setLatestPosts(latestInsights);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // ── Tab filtering ──────────────────────────────────────────────────────────
  const getVisiblePosts = () => {
    if (activeTab === 'All') return posts;
    return posts.filter((p) => p.category === activeTab);
  };

  // ── Infinite horizontal scroll (Latest Insights) ───────────────────────────
  const infiniteLatestPosts = [...latestPosts, ...latestPosts, ...latestPosts];

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, [latestPosts]);

  const handleInfiniteScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    if (scrollLeft <= 0) {
      container.scrollLeft = scrollWidth / 3;
    } else if (scrollLeft + clientWidth >= scrollWidth) {
      container.scrollLeft = (scrollWidth / 3) * 2 - clientWidth;
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 350 + 24;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white text-[#1a1a1a] py-24 px-6 md:px-16">
      <div className="max-w-[1400px] mx-auto">

        {/* Category Tab Filter */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex p-1.5 bg-white border border-neutral-300 rounded-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 cursor-pointer text-sm font-medium transition-all rounded-none ${
                  activeTab === cat
                    ? 'bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-white'
                    : 'text-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {loading ? (
            // Loading skeleton — keeps layout stable while fetching
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-8 bg-white border border-neutral-200 p-6 rounded-none animate-pulse"
              >
                <div className="w-full md:w-48 h-48 flex-shrink-0 bg-zinc-100 rounded-none" />
                <div className="flex flex-col justify-between flex-grow gap-4">
                  <div className="space-y-3">
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                    <div className="h-5 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-full" />
                    <div className="h-3 bg-zinc-100 rounded w-2/3" />
                  </div>
                  <div className="h-3 bg-zinc-100 rounded w-1/4 mt-4" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="wait">
              {getVisiblePosts().map((post, idx) => (
                <motion.div
                  key={`${activeTab}-${post.id}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group"
                >
                  <Link to={`/blogs/${post.slug}`} className="block h-full">
                    <div className="flex flex-col md:flex-row gap-8 bg-white border border-neutral-300 p-6 rounded-none hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500 h-full">
                      <div className="w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-none bg-zinc-100">
                        <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                          </div>
                          <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-black transition-colors">{post.title}</h3>
                          <p className="text-sm text-zinc-500 line-clamp-2">{post.description}</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-4">
                          <span className="text-xs font-semibold group-hover:underline underline-offset-4 decoration-zinc-300">Read Full Story</span>
                          <div className="bg-zinc-50 p-2.5 rounded-full text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowUpRight size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {!loading && getVisiblePosts().length === 0 && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 text-center py-24 text-zinc-400 text-sm"
                >
                  No posts in this category yet.
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Latest Insights Horizontal Scroll */}
        <div className="pt-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Latest Insights</h3>
              <p className="text-zinc-500 text-sm">Real-time market intelligence and analysis</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-3 bg-black text-white rounded-full cursor-pointer transition-all active:scale-95"><ChevronLeft size={20} /></button>
              <button onClick={() => scroll('right')} className="p-3 bg-black text-white cursor-pointer rounded-full transition-all active:scale-95"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleInfiniteScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {infiniteLatestPosts.map((post, idx) => (
              <Link to={`/blogs/${post.slug}`} key={`${post.id}-${idx}`} className="min-w-[350px] snap-start group block">
                <div className="aspect-[16/10] overflow-hidden rounded-none mb-4 bg-zinc-50 border border-zinc-100">
                  <img
                    src={post.img}
                    className="w-full h-full object-cover grayscale-0 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    alt={post.title}
                  />
                </div>
                <div className="px-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{post.category}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{post.date}</span>
                  </div>
                  <h4 className="font-bold text-lg leading-snug group-hover:text-black transition-colors">{post.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BlogsSection;