'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import FlowingRiver from './ui/flowing-river';

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define the scroll range to trigger the animation (last 7% of the page)
  const animationRange: [number, number] = [0.93, 1];

  // Fade in the component
  const opacity = useTransform(scrollYProgress, animationRange, [0, 1]);

  // Slide up the component from 50px below its final position
  const y = useTransform(scrollYProgress, animationRange, [50, 0]);

  if (!mounted) {
    return null;
  }

  return (
    <motion.footer style={{ opacity, y }} className="w-full">
      <FlowingRiver />
    </motion.footer>
  );
};

export default Footer;