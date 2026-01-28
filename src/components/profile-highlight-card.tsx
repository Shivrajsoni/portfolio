"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Flame, Linkedin, Github, Twitter, Code2 } from "lucide-react";

const PROFILE_LINKS = {
  linkedin: "https://www.linkedin.com/in/shivraj-soni-34572b226/",
  github: "https://github.com/Shivrajsoni",
  twitter: "https://x.com/_callmeXavier_",
  leetcode: "https://leetcode.com/u/Shivrajsoni/",
} as const;

const cardVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

interface ProfileHighlightCardProps {
  imageSrc?: string;
  imageHoverSrc?: string;
}

const HOVER_IMAGE = "/WhatsApp%20Image%202025-08-22%20at%2013.39.06%20(1).jpeg";

export default function ProfileHighlightCard({
  imageSrc = "/github_pfp.jpeg",
  imageHoverSrc = HOVER_IMAGE,
}: ProfileHighlightCardProps) {
  const { resolvedTheme } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLight = resolvedTheme === "light";
  const cardBorder = isLight
    ? "border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
    : "border border-slate-600/50 shadow-[0_20px_60px_rgba(0,0,0,0.35)]";
  const cardBg = isLight ? "bg-white" : "bg-white/95";

  useEffect(() => {
    audioRef.current = new Audio("/song.mp3");
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const hoverImage = imageHoverSrc ?? imageSrc;

  return (
    <motion.div
      layout={false}
      initial="initial"
      animate="animate"
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: isLight
          ? "0 20px 50px rgba(15,23,42,0.12)"
          : "0 26px 70px rgba(0,0,0,0.4)",
        transition: { type: "spring", stiffness: 220, damping: 18 },
      }}
      className={`relative flex min-h-[520px] w-[360px] shrink-0 flex-col overflow-hidden rounded-[40px] px-6 pb-8 pt-5 ${cardBg} ${cardBorder}`}
      style={{ transformOrigin: "center top" }}
    >
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top dashed arc */}
        <svg
          className="pointer-events-none absolute -left-6 -top-5 h-24 w-24 text-orange-500"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path
            d="M10,80 A70,70 0 0 1 80,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Portrait block - flip on hover */}
        <div
          className="relative mx-auto mb-5 mt-1 h-64 w-full max-w-[260px] cursor-pointer overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#c2410c] [perspective:800px]"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          role="img"
          aria-label="Profile photo"
        >
          <div
            className="relative h-full w-full transition-transform duration-500 ease-in-out"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front - default image */}
            <div
              className="absolute inset-0 rounded-[28px] overflow-hidden [backface-visibility:hidden]"
              style={{ transform: "rotateY(0deg)" }}
            >
              <Image
                src={imageSrc}
                alt=""
                width={260}
                height={256}
                className="h-full w-full object-cover"
                unoptimized={imageSrc.startsWith("/")}
              />
            </div>
            {/* Back - hover image */}
            <div
              className="absolute inset-0 rounded-[28px] overflow-hidden [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <Image
                src={hoverImage}
                alt=""
                width={260}
                height={256}
                className="h-full w-full object-cover"
                unoptimized={hoverImage.startsWith("/")}
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-10 text-center">
          <h2 className="text-xl font-black leading-tight tracking-tight text-black">
            Shivraj Soni
          </h2>
        </div>

        {/* Flame + dashed arc */}
        <div className="relative mb-4 flex items-center justify-center">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-20 w-full text-orange-500"
            viewBox="0 0 320 80"
            aria-hidden="true"
          >
            <path
              d="M0,60 C80,20 120,40 180,35 C240,30 280,25 320,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
          </svg>
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Stop music" : "Play music"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#ff7b18] text-white ${isPlaying ? "animate-pulse" : ""}`}
            >
              <Flame className="h-4 w-4" />
            </div>
          </button>
        </div>

        {/* Description */}
        <p className="mb-6 text-center text-sm font-medium leading-snug text-[#6E6E6E] flex-1">
          A Software Engineer who has developed countless innovative solutions.
        </p>

        {/* Social & profile links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-[#ff7b18]">
          <Link
            href={PROFILE_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-transform duration-200 hover:scale-110"
          >
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link
            href={PROFILE_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-transform duration-200 hover:scale-110"
          >
            <Github className="h-6 w-6" />
          </Link>
          <Link
            href={PROFILE_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="transition-transform duration-200 hover:scale-110"
          >
            <Twitter className="h-6 w-6" />
          </Link>
          <Link
            href={PROFILE_LINKS.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode"
            className="transition-transform duration-200 hover:scale-110"
          >
            <Code2 className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
