"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import FlowingRiver from "./ui/flowing-river";
import LightModeFooter from "./light-mode-footer";

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Dark mode: river footer with scroll-triggered fade-in
  const animationRange: [number, number] = [0.93, 1];
  const opacity = useTransform(scrollYProgress, animationRange, [0, 1]);
  const y = useTransform(scrollYProgress, animationRange, [50, 0]);

  if (!mounted) return null;

  // Light mode: branding + rotating quotes (Harry Potter effect), minimal layout
  if (resolvedTheme === "light") {
    return <LightModeFooter />;
  }

  // Dark mode: flowing river footer
  return (
    <motion.footer style={{ opacity, y }} className="w-full">
      <FlowingRiver />
    </motion.footer>
  );
};

export default Footer;
