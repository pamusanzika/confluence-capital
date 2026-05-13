import React from 'react';
import { Download, Mail, MapPin, Building2, TrendingUp, Clock, Wallet, MessageSquare } from 'lucide-react';
import dealBook1 from '../../assets/pdfs/dealBook2.pdf';

const DealBookCards = () => {
  const deals = [
    {
      id: 1,
      title: "Prime Commercial Property Investment",
      location: "Colombo, Sri Lanka",
      propertyType: "Commercial",
      range: "USD 1M – 2.5M",
      return: "12% – 15% p.a.",
      term: "5 – 7 Years",
      tag: "REAL ESTATE",
      status: "OPEN",
      description: "An excellent opportunity to acquire a premium commercial property in the heart of Colombo's business district with strong rental potential.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      pdfLink: dealBook1,
    },
    {
      id: 2,
      title: "Well-Established Restaurant Business",
      location: "Kandy, Sri Lanka",
      propertyType: "Food & Beverage",
      range: "USD 250K – 500K",
      return: "USD 80K – 120K",
      term: "2016 (Established)",
      tag: "BUSINESS SALE",
      status: "OPEN",
      description: "Acquire a profitable and well-known restaurant with a loyal customer base and strong brand presence in a prime location.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      pdfLink: dealBook1,
    },

     {
      id: 3,
      title: "Well-Established Restaurant Business",
      location: "Kandy, Sri Lanka",
      propertyType: "Food & Beverage",
      range: "USD 250K – 500K",
      return: "USD 80K – 120K",
      term: "2016 (Established)",
      tag: "BUSINESS SALE",
      status: "OPEN",
      description: "Acquire a profitable and well-known restaurant with a loyal customer base and strong brand presence in a prime location.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      pdfLink: dealBook1,
    },

     {
      id: 4,
      title: "Well-Established Restaurant Business",
      location: "Kandy, Sri Lanka",
      propertyType: "Food & Beverage",
      range: "USD 250K – 500K",
      return: "USD 80K – 120K",
      term: "2016 (Established)",
      tag: "BUSINESS SALE",
      status: "OPEN",
      description: "Acquire a profitable and well-known restaurant with a loyal customer base and strong brand presence in a prime location.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      pdfLink: dealBook1,
    },

     {
      id: 5,
      title: "Well-Established Restaurant Business",
      location: "Kandy, Sri Lanka",
      propertyType: "Food & Beverage",
      range: "USD 250K – 500K",
      return: "USD 80K – 120K",
      term: "2016 (Established)",
      tag: "BUSINESS SALE",
      status: "OPEN",
      description: "Acquire a profitable and well-known restaurant with a loyal customer base and strong brand presence in a prime location.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      pdfLink: dealBook1,
    },
  ];

  const handleDownload = (deal) => {
    const link = document.createElement('a');
    link.href = deal.pdfLink;
    link.download = `${deal.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = (pdfLink) => {
    window.open(pdfLink, '_blank');
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



     

      {/* Cards Grid: 1 Col Mobile, 2 Col Desktop */}
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

              {/* Data Table */}
              <div className="space-y-3 mb-8">
                <DataRow icon={<MapPin size={16}/>} label="Location" value={deal.location} />
                <DataRow icon={<Building2 size={16}/>} label="Property Type" value={deal.propertyType} />
                <DataRow icon={<Wallet size={16}/>} label="Investment Range" value={deal.range} />
                <DataRow icon={<TrendingUp size={16}/>} label="Expected Return" value={deal.return} />
                <DataRow icon={<Clock size={16}/>} label="Investment Term" value={deal.term} />
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                
                <button
                  onClick={() => handleDownload(deal)}
                  className="w-full cursor-pointer bg-white border border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare size={18} />
                  Inqure Now
                </button>

                <button
                  onClick={() => handleOpen(deal.pdfLink)}
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