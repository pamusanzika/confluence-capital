import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react'; // Using Lucide for the icons

const ContactForm = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content */}
        <div className="space-y-8">
          <div>
            <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-2">
              We're here to help you
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              <span className="block">Discuss Your</span>
              <span className="bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent">Financial</span>
              <span className="block text-slate-800 font-normal">Growth Needs</span>
            </h1>
            <p className="mt-6 text-gray-500 max-w-md leading-relaxed">
              Looking for strategic financial solutions tailored to your goals? Get in touch with our team today.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Info */}
            <div className="flex items-center gap-4">
              <div className=" p-3 rounded-lg text-[#d4af37]">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">E-mail</p>
                <p className="text-lg font-medium text-slate-800">confluencecapital@gmail.com</p>
              </div>
            </div>

            {/* Phone Info */}
            <div className="flex items-center gap-4">
              <div className=" p-3 rounded-lg text-[#d4af37] border border-gray-100">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Phone number</p>
                <p className="text-lg font-medium text-slate-800">+123 - 456 - 7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="bg-white rounded-[0px] shadow-2xl p-8 md:p-12 border border-gray-50">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Name</label>
              <input 
                type="text" 
                placeholder="Jane Smith"
                className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="jane@market.com"
                className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>

            {/* Industry Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">What Are You Interested In?</label>
              <select className="w-full cursor-pointer bg-gray-100 border-none rounded-none p-4 text-gray-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none">
                <option>Select...</option>
                <option>Equity Advisory</option>
                <option>Credit / Debit </option>
                <option>Investment Banking</option>
                <option>Project Finance</option>
                <option>Any Other Finance Solutions</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 ml-1">Message</label>
              <textarea 
                rows="4"
                placeholder="Type your message"
                className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button className="flex items-center justify-center w-full md:w-auto md:min-w-[200px] bg-[var(--primary-color)] cursor-pointer text-white rounded-none py-3 transition-all group">
              Send Message
                
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactForm;