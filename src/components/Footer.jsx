import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Solutions",
      links: ["Wealth Management", "Asset Protection", "Equity Strategy", "Risk Analytics"]
    },
    {
      title: "Company",
      links: ["Home", "About Us", "Blogs", "Contact Us"]
    },
    {
      title: "Resources",
      links: ["Market Insights", "Annual Reports", "White Papers", "Regulatory News"]
    }
  ];

  return (
    <footer className="bg-[var(--primary-color)] text-neutral-400 pb-5 pt-10 px-6 md:px-12 border-t border-neutral-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Identity Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                        <img src={logo} className="w-[5.5rem] lg:w-[6rem]" alt="logo" />
                      </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Providing bespoke financial architecture for the world's most ambitious institutions. 
              Precision, discretion, and unparalleled growth.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Bloomberg'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -2, color: '#ffffff' }}
                  className="text-xs font-medium tracking-widest uppercase border-b border-neutral-800 pb-1"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors duration-300 ease-in-out font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: The "Bento" Micro-Details */}
        <div className="pt-4 border-t border-neutral-800/40 flex flex-col md:flex-row justify-between items-center gap-6">
          
          
          <div className="flex items-center gap-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
              © {currentYear} Confluence Capital
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;