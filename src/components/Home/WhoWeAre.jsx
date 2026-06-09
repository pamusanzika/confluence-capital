import React from "react";

import { ArrowRight, ArrowUpRight } from "lucide-react";



// Asset imports

import img1 from "../../assets/who11.png";

import img2 from "../../assets/who22.png";

import img3 from "../../assets/who33.png";

import { Link } from "react-router-dom";



const points = [

  {

    title: "Strategic Advisory",

    description: "Bespoke financial architecture designed for complex, high-stakes global environments.",

    image: img1,

  },

  {

    title: "Global Perspective",

    description: "Bridging international markets with localized intelligence and unrivaled access.",

    image: img2,

  },

  {

    title: "Execution Excellence",

    description: "Precision-led implementation where strategy meets institutional-grade results.",

    image: img3,

  },

];



const WhoWeAre = () => {

  return (

    <section className="w-full py-24 lg:pt-35 lg:pb-25 bg-white selection:bg-black selection:text-white">

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

       

        {/* UPDATED HEADER SECTION */}

        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-10 lg:gap-20">

          {/* Left Side: Title */}

          <div className="lg:w-1/2">

             <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-neutral-900 leading-tight">
              WHO WE <br />
              <span className='font-semibold bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent'>ARE</span>
            </h2>

          </div>

         

          {/* Right Side: Paragraph and Button */}

          <div className="lg:w-1/2 flex flex-col items-start gap-8">

            <p className="text-base md:text-lg text-neutral-500 font-light max-w-xl leading-relaxed">

              We define the new standard of private wealth and corporate finance through

              technical precision and a commitment to absolute discretion.

            </p>

           


             <Link to="/about">
                        <button className="group cursor-pointer relative px-8 py-4 bg-transparent text-neutral-900 border border-neutral-300 flex items-center gap-3 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-50 active:scale-95 rounded-none">
                          <span className="text-xs font-bold uppercase tracking-widest">More About Us</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#d4af37]" />
                        </button>
                      </Link>

           

          </div>

        </div>



        {/* CARDS GRID */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {points.map((point, i) => (

            <div

              key={i}

              className="group flex flex-col bg-[var(--primary-color)] border border-neutral-100 hover:border-neutral-200 transition-all duration-500"

            >

              {/* IMAGE CONTAINER */}

              <div className="relative aspect-video overflow-hidden bg-neutral-50">

                <img

                  src={point.image}

                  alt={point.title}

                  className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"

                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

              </div>



              {/* TEXT CONTENT */}

              <div className="p-8">

                <h3 className="text-lg font-medium bg-gradient-to-r from-[#1687f1] to-[#d4af37] bg-clip-text text-transparent mb-3 tracking-tight">

                  {point.title}

                </h3>

                <p className="bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] to-[#b8891a] bg-clip-text text-transparent text-sm leading-relaxed font-light min-h-[3rem]">

                  {point.description}

                </p>

                <div className="mt-6 w-8 h-[1px] bg-gradient-to-r from-[#1687f1] to-[#d4af37] group-hover:w-full transition-all duration-700 ease-in-out" />

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};



export default WhoWeAre;

