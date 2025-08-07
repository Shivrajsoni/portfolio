"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState } from "react";

export const BentoGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid w-full auto-rows-[15rem] grid-cols-2 md:grid-cols-2 gap-3",
        className
      )}
    >
      {React.Children.map(children, (child, i) => (
        <div
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="transition-all duration-300 ease-in-out"
        >
          <motion.div
            initial={{ opacity: 4 }}
            animate={{
              opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {child}
          </motion.div>
        </div>
      ))}
    </div>
  );
};
