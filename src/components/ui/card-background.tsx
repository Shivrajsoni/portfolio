"use client";

import { motion } from "framer-motion";

export const CardBackground = () => (
  <motion.div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url(/path/to/your/background-image.png)" }} // Add your background image path here
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  />
);
