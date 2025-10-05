"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { motion } from "framer-motion";
import { Container } from "lucide-react";
import { ContainerTextFlip } from "./ui/container-text-flip";
const Experience_Button = () => {
  return (
    <ContainerTextFlip words={["Experience", "Past Work", "Shivraj Soni"]} />
  )
}

export default Experience_Button 
