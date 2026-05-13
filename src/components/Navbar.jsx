import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo2.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT US", href: "/about" },
    { name: "EQUITY", href: "/equity" },
    { name: "CREDIT", href: "/credit" },
    { name: "BLOGS", href: "/blogs" },
    { name: "DEAL BOOK", href: "/deal-book" },
  ];

  const goldText =
    "bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent";

  // Fix: Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 lg:top-2 lg:rounded-[10px] left-1/2 transform -translate-x-1/2
        w-full lg:w-[96%]
        rounded-none lg:rounded-[0rem]
        z-50 transition-all duration-500
        ${scrolled ? "bg-[#0F1C2E]/50 backdrop-blur-md shadow-lg" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-[5.5rem] lg:w-[8rem]" alt="logo" />
        </div>

        {/* DESKTOP / TABLET NAV (ONLY LG+) */}
        <div
          className={`
            hidden lg:flex items-center
            transition-all duration-300
            ${
              scrolled
                ? "border-none border-white/0 rounded-full px-6 xl:px-8 py-3"
                : "bg-white/0 backdrop-blur-none border border-white/0   px-6 xl:px-8 py-3"
            }
          `}
        >
          <ul className="flex items-center gap-6 xl:gap-12 text-sm xl:text-base">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;

              return (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`transition-all duration-300 font-medium
                      ${
                        isActive
                          ? goldText
                          : scrolled
                          ? "text-white font-medium uppercase hover:bg-gradient-to-r hover:from-[#8a6b1f] hover:via-[#d4af37] hover:to-[#b8891a] hover:bg-clip-text hover:text-transparent"
                          : "text-white/70 font-medium uppercase hover:bg-gradient-to-r  hover:from-[#8a6b1f] hover:via-[#d4af37] hover:to-[#b8891a] hover:bg-clip-text hover:text-transparent"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CONTACT BUTTON (LG+) */}
        <div className="hidden lg:block">
          <Link to='/contact'>
            <button className="bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] text-white px-5 xl:px-6 py-2.5 xl:py-3 rounded-[.4rem] text-sm cursor-pointer font-medium hover:opacity-90 transition-all">
            Contact us
          </button>
          </Link>
          
        </div>

        {/* MOBILE + TABLET MENU BUTTON */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>

          <ul className="flex flex-col items-center gap-8 mb-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;

              return (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-2xl font-light transition-all duration-300 ${
                      isActive ? goldText : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

            
            <a href='/contact'>
              <button className="bg-white text-black px-10 py-3 rounded-full text-lg font-medium">
            Contact us
          </button>
            </a>
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;