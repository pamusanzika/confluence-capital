import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogsSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const scrollRef = useRef(null);

  const categories = ["All", "Equity", "Credit", "Market Insights"];

  const blogPosts = {
    "Equity": [
      {
        title: "Strategic Management Buyout for Global Logistics Firm",
        description: "How structured equity financing enabled a seamless transition and 40% growth in year one.",
        date: "May 10, 2026",
        readTime: "8 min read",
        img: "https://i.pinimg.com/736x/ea/7b/1b/ea7b1b90b3286634284d86652178ba8a.jpg"
      },
      {
        title: "Venture Capital Infusion: The Future of Fintech",
        description: "Exploring the Series B round that redefined digital banking in Southeast Asia.",
        date: "May 02, 2026",
        readTime: "6 min read",
        img: "https://i.pinimg.com/1200x/d6/96/34/d696346b33dcdbb4f29debb5aa7425c5.jpg"
      },
       {
        title: "Venture Capital Infusion: The Future of Fintech",
        description: "Exploring the Series B round that redefined digital banking in Southeast Asia.",
        date: "May 02, 2026",
        readTime: "6 min read",
        img: "https://i.pinimg.com/736x/ff/61/eb/ff61eb0e2ec5d87e331aa9d1f1e94a1f.jpg"
      },
       {
        title: "Venture Capital Infusion: The Future of Fintech",
        description: "Exploring the Series B round that redefined digital banking in Southeast Asia.",
        date: "May 02, 2026",
        readTime: "6 min read",
        img: "https://i.pinimg.com/736x/2f/7b/01/2f7b013ab6550697993db7dc4bd47062.jpg"
      },
       {
        title: "Venture Capital Infusion: The Future of Fintech",
        description: "Exploring the Series B round that redefined digital banking in Southeast Asia.",
        date: "May 02, 2026",
        readTime: "6 min read",
        img: "https://i.pinimg.com/736x/f1/29/db/f129dbe9e27866a210b3b8defc52ee49.jpg"
      },
       {
        title: "Venture Capital Infusion: The Future of Fintech",
        description: "Exploring the Series B round that redefined digital banking in Southeast Asia.",
        date: "May 02, 2026",
        readTime: "6 min read",
        img: "https://i.pinimg.com/736x/ca/51/33/ca513305eed647891fd9b83da54ce512.jpg"
      }
    ],
    "Credit": [
      {
        title: "Private Credit Solutions for Middle-Market Expansion",
        description: "Leveraging debt instruments to fund infrastructure without equity dilution.",
        date: "April 28, 2026",
        readTime: "10 min read",
        img: "https://i.pinimg.com/1200x/2a/5c/20/2a5c2063c82c004173fc44462997f8a7.jpg"
      },
      {
        title: "Navigating High-Yield Bond Markets in 2026",
        description: "Analysis of credit spreads and risk mitigation for institutional lenders.",
        date: "April 15, 2026",
        readTime: "7 min read",
        img: "https://i.pinimg.com/736x/48/ab/4a/48ab4a7d1071c07008e37bcb4dc46879.jpg"
      },
      {
        title: "Navigating High-Yield Bond Markets in 2026",
        description: "Analysis of credit spreads and risk mitigation for institutional lenders.",
        date: "April 15, 2026",
        readTime: "7 min read",
        img: "https://i.pinimg.com/1200x/b7/78/65/b778659d0b9199b90a13b4d7b26aca10.jpg"
      },
      {
        title: "Navigating High-Yield Bond Markets in 2026",
        description: "Analysis of credit spreads and risk mitigation for institutional lenders.",
        date: "April 15, 2026",
        readTime: "7 min read",
        img: "https://i.pinimg.com/736x/33/17/f9/3317f9c01ff00aa8a4ced4421c48eae0.jpg"
      },
      {
        title: "Navigating High-Yield Bond Markets in 2026",
        description: "Analysis of credit spreads and risk mitigation for institutional lenders.",
        date: "April 15, 2026",
        readTime: "7 min read",
        img: "https://i.pinimg.com/736x/0f/33/af/0f33af37e2c153ba13ba0073daf8151d.jpg"
      },
      {
        title: "Navigating High-Yield Bond Markets in 2026",
        description: "Analysis of credit spreads and risk mitigation for institutional lenders.",
        date: "April 15, 2026",
        readTime: "7 min read",
        img: "https://i.pinimg.com/736x/13/29/0c/13290c7853faba343263867975698eb8.jpg"
      }
    ],
    "Market Insights": [
      {
        title: "Global Economic Outlook: The Q3 Report",
        description: "Deep dive into interest rate trajectories and cross-border trade valuations.",
        date: "May 04, 2026",
        readTime: "12 min read",
        img: "https://i.pinimg.com/736x/0b/0d/64/0b0d64e27e2e6c384d3d86510b25f4c6.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/1200x/82/1d/e9/821de9c89df8a4c8cc1c15097916dbf6.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/1200x/38/4a/f5/384af58af886718f5f48c96c5a39e334.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/736x/78/4b/06/784b0638ee9fd5556c9c1227a878bcad.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/736x/e5/7e/cb/e57ecba65e77b591167f3dfda2ed01ed.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/736x/8e/37/43/8e37434701d265d2066457f8a83ba487.jpg"
      },
      {
        title: "The Shift Toward Sustainable Capital Allocation",
        description: "Why ESG metrics are becoming the primary driver for institutional portfolios.",
        date: "May 01, 2026",
        readTime: "9 min read",
        img: "https://i.pinimg.com/736x/2c/b3/7a/2cb37aabbf74b89865f38691a2c46e2a.jpg"
      }
    ]
  };

  // Helper to get posts based on active tab
  const getVisiblePosts = () => {
    if (activeTab === "All") {
      return Object.values(blogPosts).flat();
    }
    return blogPosts[activeTab];
  };

  const baseLatestPosts = [
    { title: "Quarterly Asset Allocation Strategy", date: "Aug 12", category: "Strategy", img: "https://i.pinimg.com/736x/91/1c/b9/911cb9b7f2bcd90159c2a4b278414110.jpg" },
    { title: "The Impact of AI on M&A Due Diligence", date: "Aug 10", category: "Tech", img: "https://i.pinimg.com/736x/8f/3a/f4/8f3af425b4efbcd88fea2b69fb1c9e10.jpg" },
    { title: "Renewable Energy: A New Credit Frontier", date: "Aug 08", category: "ESG", img: "https://i.pinimg.com/736x/4e/41/76/4e4176067e60bd7168ff435a2fc57847.jpg" },
    { title: "Stabilizing Volatility in Emerging Markets", date: "Aug 05", category: "Market", img: "https://i.pinimg.com/736x/a1/d1/ca/a1d1ca013b044fc72355930df4b7d324.jpg" },
  ];

  const infiniteLatestPosts = [...baseLatestPosts, ...baseLatestPosts, ...baseLatestPosts];

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, []);

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
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex p-1.5 bg-white border border-neutral-300 rounded-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 cursor-pointer text-sm font-medium transition-all rounded-none ${
                  activeTab === cat 
                  ? "bg-gradient-to-r from-[#1687f1] to-[#d4af37] text-white" 
                  : "text-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <AnimatePresence mode="wait">
            {getVisiblePosts().map((post, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group cursor-pointer"
              >
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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
              <div key={idx} className="min-w-[350px] snap-start group cursor-pointer">
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BlogsSection;