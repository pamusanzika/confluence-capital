import React, { useState } from 'react';
import { Mail, Phone, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const INTERESTS = [
  'Equity Advisory',
  'Credit / Debit',
  'Investment Banking',
  'Project Finance',
  'Any Other Finance Solutions',
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Please fill in your name and email.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    const { error } = await supabase.from('deal_inquiries').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      interest: form.interest || null,
      message: form.message.trim() || null,
    });
    if (error) {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', interest: '', message: '' });
    }
  }

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
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg text-[#d4af37]">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">E-mail</p>
                <p className="text-lg font-medium text-slate-800">confluencecapital@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg text-[#d4af37] border border-gray-100">
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
        <div className="bg-white shadow-2xl p-8 md:p-12 border border-gray-50">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <CheckCircle size={48} className="text-green-500" />
              <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-gray-500 max-w-xs">
                Thank you for reaching out. Our team will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm font-semibold text-[#1687f1] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@market.com"
                  className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">What Are You Interested In?</label>
                <select
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className="w-full cursor-pointer bg-gray-100 border-none rounded-none p-4 text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                >
                  <option value="">Select...</option>
                  {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 ml-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Type your message"
                  className="w-full bg-gray-100 border-none rounded-none p-4 text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center w-full md:w-auto md:min-w-[200px] bg-[var(--primary-color)] cursor-pointer text-white rounded-none py-3 transition-all disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactForm;
