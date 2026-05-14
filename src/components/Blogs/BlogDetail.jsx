import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { blogPosts, latestInsights } from './blogData';
import { supabase } from '../../lib/supabaseClient';
import { slugify } from '../../lib/slugify';

// Map a raw Supabase blog row to the shape BlogDetail expects
function mapDbPost(p) {
  const rawDate = p.updated_date || p.created_at;
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    description: p.short_description || '',
    // In the DB, `description` is the full article body; `short_description` is the card summary
    content: p.description || '',
    date: rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '',
    readTime: p.reading_time || '5 min read',
    category: p.category || 'Market Insights',
    img: p.image_url || '',
    author: 'Confluence Editorial',
  };
}

// Map a DB row to the minimal shape needed for the related-post sidebar card
function mapDbRelated(p) {
  const rawDate = p.updated_date || p.created_at;
  return {
    id: p.id,
    slug: slugify(p.title),
    title: p.title,
    img: p.image_url || '',
    category: p.category || '',
    date: rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '',
  };
}

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [latestToShow, setLatestToShow] = useState(latestInsights);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findPost() {
      setLoading(true);

      // ── 1. Check static blogData first (existing named slugs) ──────────────
      const allStaticPosts = [...Object.values(blogPosts).flat(), ...latestInsights];
      const staticPost = allStaticPosts.find((p) => p.slug === slug);

      if (staticPost) {
        setPost(staticPost);
        const related = Object.values(blogPosts)
          .flat()
          .filter((p) => p.category === staticPost.category && p.id !== staticPost.id)
          .slice(0, 3);
        setRelatedBlogs(related);
        setLoading(false);
        return;
      }

      // ── 2. Not in static data — search Supabase by slugified title ──────────
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const dbPost = data.find((p) => slugify(p.title) === slug);

          if (dbPost) {
            setPost(mapDbPost(dbPost));

            // Track this page view
            supabase.from('blog_views').insert({
              blog_id: dbPost.id,
              blog_title: dbPost.title,
            }).then(() => {});

            // Related: same category, exclude current post, max 3
            const related = data
              .filter((p) => p.category === dbPost.category && p.id !== dbPost.id)
              .slice(0, 3)
              .map(mapDbRelated);
            setRelatedBlogs(related);

            // Latest Insights at bottom: most recent 3 from DB (excluding current)
            const latest = data
              .filter((p) => p.id !== dbPost.id)
              .slice(0, 3)
              .map(mapDbRelated);
            if (latest.length > 0) setLatestToShow(latest);
          }
        }
      } catch (err) {
        console.error('Error fetching blog post from Supabase:', err);
      }

      setLoading(false);
    }

    findPost();
  }, [slug]);

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-[#d4af37] rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm uppercase tracking-widest">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-color)] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Blog Post Not Found</h2>
          <Link to="/blogs" className="text-[#d4af37] hover:underline flex items-center justify-center gap-2">
            <ChevronLeft size={20} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] bg-[var(--primary-color)] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary-color)]/50 to-[var(--primary-color)]" />
        </div>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-medium uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Back to Insights
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-[#d4af37] text-white text-[10px] font-bold uppercase tracking-widest">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime || '5 min read'}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] max-w-4xl mb-8">
              {post.title}
            </h1>

            {post.author && (
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={20} className="text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">{post.author}</p>
                  <p className="text-[10px] text-white/50">Strategic Advisor</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-8"
          >
            <div className="blog-content text-zinc-700 leading-relaxed space-y-6">
              {post.content ? (
                <div
                  className="[&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-zinc-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#d4af37] [&>blockquote]:pl-6 [&>blockquote]:my-10 [&>blockquote]:italic [&>blockquote]:text-zinc-900 [&>blockquote]:text-xl"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <>
                  <p className="text-xl font-medium text-zinc-900 mb-8">
                    {post.description}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-6">Strategic Market Analysis</h2>
                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                  <blockquote className="border-l-4 border-[#d4af37] pl-6 my-10 italic text-zinc-900 text-xl">
                    "Innovation in capital markets requires not just vision, but the precision to execute on that vision in a rapidly changing global landscape."
                  </blockquote>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                  </p>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tags:</span>
                <span className="text-xs font-semibold text-zinc-600 px-3 py-1 bg-zinc-50 border border-zinc-100 uppercase tracking-tighter">Finance</span>
                <span className="text-xs font-semibold text-zinc-600 px-3 py-1 bg-zinc-50 border border-zinc-100 uppercase tracking-tighter">Growth</span>
                <span className="text-xs font-semibold text-zinc-600 px-3 py-1 bg-zinc-50 border border-zinc-100 uppercase tracking-tighter">Strategic</span>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="bg-zinc-50 border border-zinc-100 p-8">
                <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
                  Related Stories
                  <div className="w-8 h-[2px] bg-[#d4af37]" />
                </h3>
                <div className="space-y-8">
                  {relatedBlogs.map((blog) => (
                    <Link key={blog.id} to={`/blogs/${blog.slug}`} className="group block">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                          <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mb-1">{blog.date}</p>
                          <h4 className="text-sm font-bold leading-snug group-hover:text-[#1687f1] transition-colors line-clamp-2">{blog.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-[var(--primary-color)] text-white p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Stay Informed</h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">Get the latest market insights and strategic updates delivered to your inbox.</p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                  <button className="w-full bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-[#d4af37]/10 transition-all duration-700" />
            </div>
          </aside>

        </div>
      </section>

      {/* Explore More Insights Footer */}
      <section className="bg-zinc-50 py-20 px-6 md:px-16 border-t border-zinc-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore More Insights</h2>
              <p className="text-zinc-500">Dive deeper into our latest market analysis and reports.</p>
            </div>
            <Link to="/blogs" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#1687f1] transition-colors">
              View All Posts <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestToShow.slice(0, 3).map((insight) => (
              <Link key={insight.id} to={`/blogs/${insight.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden mb-6">
                  <img src={insight.img} alt={insight.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">{insight.category}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{insight.date}</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-[#1687f1] transition-colors">{insight.title}</h3>
              </Link>
            ))}
          </div>

          <Link to="/blogs" className="flex md:hidden items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest mt-12 hover:text-[#1687f1] transition-colors">
            View All Posts <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
