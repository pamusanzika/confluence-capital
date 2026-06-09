import React from 'react';
import { motion } from 'framer-motion';
import { FiLinkedin, FiFacebook, FiInstagram } from 'react-icons/fi'; 
import { RiTwitterXFill } from 'react-icons/ri'; // Official X icon
import logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // 1. Structural Links Data
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { name: "Equity", path: "/equity" },
        { name: "Credit", path: "/credit" },
        { name: "Investment Banking", path: "" },
        { name: "Project Finance", path: "" },
        { name: "Equity Advisory", path: "" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Blogs", path: "/blogs" },
        { name: "Deal Book", path: "/deal-book" },
        { name: "Contact Us", path: "/contact" }
      ]
    }
  ];

  // 2. Social Media Data with Permanent Real Colors (No hover trigger needed)
  const socialLinks = [
    { 
      name: 'X', 
      path: 'https://twitter.com/yourhandle',
      icon: <RiTwitterXFill className="w-4 h-4 text-white" />,
      style: 'bg-black border-neutral-800'
    },
    { 
      name: 'LinkedIn', 
      path: 'https://linkedin.com/company/yourcompany',
      icon: <FiLinkedin className="w-4 h-4 text-white" />,
      style: 'bg-[#0077B5] border-[#0077B5]'
    },
     { 
      name: 'Instagram', 
      path: 'https://instagram.com',
      icon: <FiInstagram className="w-4 h-4 text-white" />,
      style: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border-transparent'
    },
    { 
      name: 'Facebook', 
      path: 'https://facebook.com',
      icon: <FiFacebook className="w-4 h-4 text-white" />,
      style: 'bg-[#1877F2] border-[#1877F2]'
    },
   
  ];

  // 3. Legal / Bottom Bar Data
  const legalLinks = [
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of use', path: '/terms' }
  ];

  return (
    // Filled block frame with dark background base
    <footer className="bg-[var(--primary-color)] text-neutral-400 font-sans border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* Main Links & Brand Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
          
          {/* Brand & Identity Block */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src={logo} className="w-[5.5rem] lg:w-[6rem]" alt="logo" />
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-neutral-400 font-light">
                Providing bespoke financial architecture for the world's most ambitious institutions. 
                Precision, discretion, and unparalleled growth.
              </p>
            </div>

            {/* Styled Brand Buttons with Static Colors */}
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  whileHover={{ y: -2 }}
                  className={`border p-3 rounded-sm transition-transform duration-200 inline-flex items-center justify-center ${social.style}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Category Blocks */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-4 pb-2 border-b border-neutral-900">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.path} 
                        className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 font-normal inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar — Fully integrated with structure */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
          <div className="text-neutral-500 text-center md:text-left font-light">
            All website content @ {currentYear} Confluence Capital. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-neutral-400 font-normal">
            {legalLinks.map((legal) => (
              <a 
                key={legal.name}
                href={legal.path} 
                className="hover:text-white transition-colors duration-200"
              >
                {legal.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;