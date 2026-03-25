"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import GitHubActivityFooter from "./github-activity-footer";

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Scroll-triggered fade-in for the footer.
  const animationRange: [number, number] = [0.93, 1];
  const opacity = useTransform(scrollYProgress, animationRange, [0, 1]);
  const y = useTransform(scrollYProgress, animationRange, [50, 0]);

  if (!mounted) return null;

  return (
    <motion.footer style={{ opacity, y }} className="w-full">
      <GitHubActivityFooter />
    </motion.footer>
  );
};

export default Footer;
