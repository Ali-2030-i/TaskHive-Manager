import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = globalThis.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setDirection('down');
      } else {
        setDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
