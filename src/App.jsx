import React, { lazy, Suspense, useState, useEffect } from 'react';
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
import BlogDetail from './components/Blogs/BlogDetail';
import ContactPage from './components/Contact/ContactPage';
const AdminApp = lazy(() => import('./admin/AdminApp'));

const PublicLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleInitialLoad = () => {
      setTimeout(() => setIsLoading(false), 1800);
    };
    handleInitialLoad();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <SmoothScroll>
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
          <Route path='/blogs/:slug' element={<BlogDetail />} />
          <Route path='/contact' element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

const App = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<LoadingPage isVisible={true} />}>
        <AdminApp />
      </Suspense>
    );
  }
  return <PublicLayout />;
};

export default App;