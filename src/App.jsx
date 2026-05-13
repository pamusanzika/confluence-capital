import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SmoothScroll from './components/SmoothScroll';
import HomePage from './components/Home/HomePage';
import Footer from './components/Footer';
import AboutUsPage from './components/About/AboutUsPage';
import EquityPage from './components/Equity/EquityPage';
import LoadingPage from './components/LoadingPage';
import CreditPage from './components/Credit/CreditPage';
import DealBookPage from './components/DealBook/DealBookPage';
import BlogsPage from './components/Blogs/BlogsPage';
import ContactPage from './components/Contact/ContactPage';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // 1. Handle the initial site load
  useEffect(() => {
    const handleInitialLoad = () => {
      setTimeout(() => setIsLoading(false), 1800);
    };
    handleInitialLoad();
  }, []);

  // 2. Handle loading state AND scroll reset when moving through pages
  useEffect(() => {
    // Start loading
    setIsLoading(true);

    /**
     * FIX: Reset scroll immediately. 
     * Since you use SmoothScroll, window.scrollTo(0,0) might be 
     * overridden, so we call it here and again after the timer.
     */
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Secondary reset to ensure we are at the top once content renders
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 1200); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <SmoothScroll>
      {/* The Loader stays outside the main div to cover everything */}
      <LoadingPage isVisible={isLoading} />

      <div className="relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/equity" element={<EquityPage />} />
          <Route path='/credit' element={<CreditPage />} />
          <Route path='/deal-book' element={<DealBookPage />} />
          <Route path='/blogs' element={<BlogsPage />} />
          <Route path='/contact' element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default App;