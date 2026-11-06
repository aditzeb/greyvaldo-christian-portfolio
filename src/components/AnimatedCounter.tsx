import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  prefix?: string;
  target: number;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  prefix = '',
  target,
  suffix = '',
  decimals = 0,
  durationMs = 1300,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
};

