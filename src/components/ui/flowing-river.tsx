'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

// This component contains the previous design that you liked for dark mode.
const DarkModeRiver = () => (
  <svg
    className="absolute bottom-0 left-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 200"
    preserveAspectRatio="xMidYMax meet"
  >
    <defs>
      <linearGradient id="riverGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" className="stop-cyan-400/50" />
        <stop offset="100%" className="stop-blue-600/70" />
      </linearGradient>
      <path
        id="wave1-dark"
        d="M-1000 120 Q-750 180 -500 120 T 0 120 T 500 120 T 1000 120 T 1500 120 V 200 H -1000 Z"
      />
      <path
        id="wave2-dark"
        d="M-1000 110 Q-750 140 -500 110 T 0 110 T 500 110 T 1000 110 T 1500 110 V 200 H -1000 Z"
      />
      <path
        id="shimmer-dark"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M-1000 115 Q-750 125 -500 115 T 0 115 T 500 115 T 1000 115 T 1500 115"
      />
    </defs>
    <g className="waves">
      <motion.use
        href="#wave1-dark"
        fill="url(#riverGradientDark)"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.use
        href="#wave2-dark"
        fill="url(#riverGradientDark)"
        className="opacity-70"
        animate={{ x: [0, 1000] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />
      <motion.use
        href="#shimmer-dark"
        className="stroke-orange-300/80"
        animate={{
          strokeDasharray: ['0, 20, 15, 5, 30, 200', '15, 5, 30, 20, 0, 200'],
          opacity: [0.8, 0.5, 0.8, 0.3, 1, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
    </g>
  </svg>
);

// This component contains the new, more vibrant design for light mode.
const LightModeRiver = () => (
  <svg
    className="absolute bottom-0 left-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 200"
    preserveAspectRatio="xMidYMax meet"
  >
    <defs>
      <path
        id="wave1-light"
        d="M-1000 120 Q-750 180 -500 120 T 0 120 T 500 120 T 1000 120 T 1500 120 V 200 H -1000 Z"
      />
      <path
        id="wave2-light"
        d="M-1000 110 Q-750 140 -500 110 T 0 110 T 500 110 T 1000 110 T 1500 110 V 200 H -1000 Z"
      />
      <path
        id="wave3-light"
        d="M-1000 115 Q-750 150 -500 115 T 0 115 T 500 115 T 1000 115 T 1500 115 V 200 H -1000 Z"
      />
      <path
        id="shimmer-light"
        strokeWidth="2"
        strokeLinecap="round"
        d="M-1000 115 Q-750 125 -500 115 T 0 115 T 500 115 T 1000 115 T 1500 115"
      />
    </defs>
    <g className="waves">
      <motion.use
        href="#wave3-light"
        className="fill-blue-600 opacity-90"
        animate={{ x: [0, 1000] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.use
        href="#wave2-light"
        className="fill-blue-500 opacity-90"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.use
        href="#wave1-light"
        className="fill-cyan-400 opacity-90"
        animate={{ x: [0, 1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.use
        href="#shimmer-light"
        className="stroke-orange-200/90"
        animate={{
          strokeDasharray: ['0, 20, 15, 5, 30, 200', '15, 5, 30, 20, 0, 200'],
          opacity: [0.9, 0.6, 0.9, 0.4, 1, 0.9, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      />
    </g>
  </svg>
);

const FlowingRiver = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // We need to wait for the component to mount to know the current theme.
  if (!mounted) {
    // Render a placeholder to avoid layout shift.
    return <div className="relative w-full h-48 md:h-64 -mt-16" />;
  }

  return (
    <div className="relative w-full h-48 md:h-64 -mt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent dark:from-blue-500/30 blur-xl" />
      {theme === 'dark' ? <DarkModeRiver /> : <LightModeRiver />}
    </div>
  );
};

export default FlowingRiver;
