import React, { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 40,
    suffix: "+",
    label: "Years of market experience",
  },
  {
    value: 30,
    suffix: "+",
    label: "Active projects delivered",
  },
  {
    value: 7,
    suffix: "+",
    label: "Proven successful exits",
  },
  {
    value: 80,
    suffix: "M",
    label: "Project pipeline (USD)",
  },
];

const StatItem = ({ value, suffix, label, start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startValue = 0;
    const duration = 1200; // animation speed
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      startValue += increment;

      if (startValue >= value) {
        startValue = value;
        clearInterval(counter);
      }

      setCount(Math.floor(startValue));
    }, 16);

    return () => clearInterval(counter);
  }, [start, value]);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[3rem] font-bold bg-gradient-to-r from-[#8a6b1f] via-[#d4af37] via-[#f7e7a1] to-[#b8891a] bg-clip-text text-transparent md:text-[4rem]">
        {count}
        {suffix}
      </span>
      <span className="text-[14px]  uppercase tracking-widest text-neutral-400">
        {label}
      </span>
    </div>
  );
};

const Stat = () => {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-12 flex justify-center border-t border-white/20 pt-10">
      <div className="grid w-full max-w-full grid-cols-2 gap-y-8 gap-x-6 md:grid-cols-4 md:gap-8">
        {stats.map((item, index) => (
          <StatItem key={index} {...item} start={start} />
        ))}
      </div>
    </div>
  );
};

export default Stat;