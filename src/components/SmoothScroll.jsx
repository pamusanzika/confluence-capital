// SmoothScroll.jsx
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Lenis from "lenis";

const SmoothScroll = forwardRef(({ children }, ref) => {
  const lenisRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 0 }); // instant
    },
  }));

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      smooth: true,
      wheelMultiplier: 0.50,
      touchMultiplier: 0.80,
      lerp: 0.12,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return children;
});

export default SmoothScroll;