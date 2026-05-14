import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, MessageSquare,
  MapPin, Building2, TrendingUp, Percent, Clock,
  Factory, Layers, RefreshCw, Flag, User, Wallet,
} from 'lucide-react';
import dealBook1 from '../../assets/pdfs/dealBook2.pdf';
import { supabase } from '../../lib/supabaseClient';

/** Mirrors the admin TAG_SCHEMA — key → { label, Icon } */
const TAG_SCHEMA = {
  location:    { label: 'Location',         Icon: MapPin },
  propType:    { label: 'Property Type',    Icon: Building2 },
  invRange:    { label: 'Investment Range', Icon: TrendingUp },
  expReturn:   { label: 'Expected Return',  Icon: Percent },
  term:        { label: 'Investment Term',  Icon: Clock },
  industry:    { label: 'Industry',         Icon: Factory },
  stage:       { label: 'Stage',            Icon: Layers },
  roiTimeline: { label: 'ROI Timeline',     Icon: RefreshCw },
  ownership:   { label: 'Ownership %',      Icon: Flag },
  contact:     { label: 'Contact Person',   Icon: User },
};

// Fallback image when a deal has no cover photo
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';

/** Map a Supabase deal row → the shape the card renders */
function mapDeal(row) {
  return {
    id: row.id,
    title: row.title || 'Untitled Deal',
    description: row.short_description || '',
    tag: row.category || '',
    status: row.status || 'Open',
    image: row.image_url || FALLBACK_IMAGE,
    pdfLink: row.pdf_url || dealBook1,
    // Only the tags the admin chose to make public (up to 5)
    publicTags: row.public_tags || [],
    tags: row.tags || {},
  };
}

const DealBookCards = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDeals(data.map(mapDeal));
      }
      setLoading(false);
    }
    fetchDeals();
  }, []);

  const handleDownload = (deal) => {
    const link = document.createElement('a');
    link.href = deal.pdfLink;
    link.download = `${deal.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = async (deal) => {
    window.open(deal.pdfLink, '_blank');
    try {
      await supabase.from('pdf_downloads').insert({
        deal_id: deal.id,
        deal_title: deal.title,
      });
    } catch {
      // silent — never block the user experience
    }
  };

  return (
    <section className="bg-gray-50 py-20 px-6 sm:px-12 lg:px-24">
      {/* Header */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-center text-center gap-6">
        <div className="title-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 leading-[1.1]">
            Our
            <span className="font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent"> DealBook</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl text-lg">
            Explore our curated selection of premium opportunities and detailed market insights.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <p className="text-gray-400 text-lg tracking-wide">Loading deals…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && deals.length === 0 && (
        <div className="flex justify-center items-center py-24">
          <p className="text-gray-400 text-lg tracking-wide">No deals available at the moment.</p>
        </div>
      )}

      {/* Cards Grid: 1 Col Mobile, 2 Col Desktop */}
      {!loading && deals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
            >
              {/* Image Section with Badges */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#00214d] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                  {deal.tag}
                </div>
                <div className="absolute top-4 right-4 bg-[#4caf50] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                  {deal.status}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                  {deal.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 border-b border-gray-100 pb-6">
                  {deal.description}
                </p>

                {/* Data Table — driven by public_tags chosen in the admin dashboard */}
                <div className="space-y-3 mb-8">
                  {deal.publicTags.map((key) => {
                    const schema = TAG_SCHEMA[key];
                    if (!schema) return null;
                    const { label, Icon } = schema;
                    return (
                      <DataRow
                        key={key}
                        icon={<Icon size={16} />}
                        label={label}
                        value={deal.tags[key] || '—'}
                      />
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <Link
                    to="/contact"
                    className="w-full cursor-pointer bg-white border border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare size={18} />
                    Inquire Now
                  </Link>

                  <button
                    onClick={() => handleOpen(deal)}
                    className="w-full cursor-pointer bg-[var(--primary-color)] text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#061e3f] transition-colors"
                  >
                    <Download size={18} />
                    Download Teaser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Helper Component for the list items
const DataRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-gray-400">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default DealBookCards;