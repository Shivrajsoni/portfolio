"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

interface ScrollSectionCard {
  title: string;
  description: string;
  tags?: string[];
  icon?: React.ReactNode;
  linkText?: string;
}

interface ScrollSectionProps {
  title: string;
  subtitle?: string;
  cards: ScrollSectionCard[];
}

export default function ScrollSection({
  title,
  subtitle,
  cards,
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Use viewport scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Background gradient opacity - controls the intensity of the gradient overlay
  const gradientOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 0.3, 0.6, 0.8, 0.7]
  );

  // Text opacity and position - fade in as you scroll
  const textOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);
  const textY = useTransform(smoothProgress, [0.2, 0.4], [50, 0]);
  const textScale = useTransform(smoothProgress, [0.2, 0.4], [0.95, 1]);

  // Cards animation - appear after text
  const cardsOpacity = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);
  const cardsY = useTransform(smoothProgress, [0.4, 0.6], [80, 0]);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky container with background transition */}
      <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden z-[15] bg-white dark:bg-black">
        {/* Base gradient background - deep blue to purple gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: gradientOpacity,
            background:
              resolvedTheme === "dark"
                ? "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(30, 58, 138, 0.5) 0%, rgba(59, 130, 246, 0.3) 20%, rgba(147, 51, 234, 0.25) 40%, rgba(30, 58, 138, 0.15) 60%, rgba(14, 165, 233, 0.1) 80%, transparent 100%)"
                : "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(200, 220, 255, 0.4) 0%, rgba(180, 210, 255, 0.3) 20%, rgba(230, 240, 255, 0.25) 40%, rgba(200, 220, 255, 0.15) 60%, rgba(224, 242, 254, 0.1) 80%, transparent 100%)",
          }}
        />

        {/* Horizontal light streak - main bright beam across the middle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(
              smoothProgress,
              [0.2, 0.5, 0.8],
              [0, 0.5, 0.3]
            ),
            background:
              resolvedTheme === "dark"
                ? "linear-gradient(90deg, rgba(59, 130, 246, 0.7) 0%, rgba(147, 51, 234, 0.5) 25%, rgba(14, 165, 233, 0.4) 50%, rgba(59, 130, 246, 0.3) 75%, transparent 100%)"
                : "linear-gradient(90deg, rgba(147, 197, 253, 0.5) 0%, rgba(186, 230, 253, 0.4) 25%, rgba(224, 242, 254, 0.3) 50%, rgba(147, 197, 253, 0.2) 75%, transparent 100%)",
            filter: "blur(80px)",
            top: "40%",
            height: "20%",
          }}
        />

        {/* Diagonal light ray from upper right - purple-blue sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(
              smoothProgress,
              [0.3, 0.6, 0.9],
              [0, 0.35, 0.2]
            ),
            background:
              resolvedTheme === "dark"
                ? "linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.25) 30%, transparent 60%)"
                : "linear-gradient(135deg, rgba(186, 230, 253, 0.25) 0%, rgba(147, 197, 253, 0.15) 30%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />

        {/* Diagonal light ray from upper left - blue sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(
              smoothProgress,
              [0.25, 0.55, 0.85],
              [0, 0.3, 0.15]
            ),
            background:
              resolvedTheme === "dark"
                ? "linear-gradient(225deg, rgba(59, 130, 246, 0.35) 0%, rgba(14, 165, 233, 0.2) 30%, transparent 60%)"
                : "linear-gradient(225deg, rgba(147, 197, 253, 0.2) 0%, rgba(186, 230, 253, 0.12) 30%, transparent 60%)",
            filter: "blur(90px)",
          }}
        />

        {/* Additional depth - purple-blue glow in upper right */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(smoothProgress, [0.4, 0.7], [0, 0.25]),
            background:
              resolvedTheme === "dark"
                ? "radial-gradient(ellipse 50% 35% at 75% 25%, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.15) 40%, transparent 70%)"
                : "radial-gradient(ellipse 50% 35% at 75% 25%, rgba(186, 230, 253, 0.2) 0%, rgba(147, 197, 253, 0.1) 40%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />

        {/* Subtle lower reflection */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(smoothProgress, [0.5, 0.8], [0, 0.15]),
            background:
              resolvedTheme === "dark"
                ? "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(30, 58, 138, 0.2) 70%, rgba(59, 130, 246, 0.15) 85%, transparent 100%)"
                : "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(200, 220, 255, 0.15) 70%, rgba(180, 210, 255, 0.1) 85%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* Content Container */}
        <div className="container mx-auto max-w-7xl relative z-10 px-4 py-32">
          {/* Title Section */}
          <motion.div
            style={{ opacity: textOpacity, y: textY, scale: textScale }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Cards Grid */}
          {cards.length > 0 && (
            <motion.div
              style={{ opacity: cardsOpacity, y: cardsY }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {cards.map((card, index) => (
                <motion.div
                  key={`${card.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-800 dark:border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 group rounded-2xl">
                    <CardHeader className="pb-4">
                      {card.icon && (
                        <div className="mb-6 flex justify-center text-blue-400">
                          {card.icon}
                        </div>
                      )}
                      <CardTitle className="text-2xl font-bold text-white mb-4 text-center">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                      <CardDescription className="text-slate-400 text-base leading-relaxed mb-6 flex-grow">
                        {card.description}
                      </CardDescription>
                      <div className="flex items-center text-blue-400 font-medium group-hover:gap-2 gap-1 transition-all cursor-pointer">
                        <span className="text-sm">
                          {card.linkText || "Read about this in docs"}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Spacer to create scroll height */}
      <div className="relative h-[200vh] z-[14]" />
    </div>
  );
}
