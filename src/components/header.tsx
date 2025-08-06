"use client";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Github,
  Twitter,
  Linkedin,
  Sun,
  Moon,
  PartyPopper,
  ArrowUpRight,
} from "lucide-react";

const GITHUB_USERNAME = "Shivrajsoni"; // Change if needed
const TWITTER_URL = "https://x.com/_callmeXavier_"; // Add your handle
const LINKEDIN_URL = "https://www.linkedin.com/in/shivraj-soni-34572b226/"; // Add your handle
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_PFP = `https://github.com/${GITHUB_USERNAME}.png`;

const socialLinks = [
  {
    href: GITHUB_URL,
    label: "GitHub",
    icon: Github,
  },
  {
    href: TWITTER_URL,
    label: "Twitter",
    icon: Twitter,
  },
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    icon: Linkedin,
  },
];

const navLinks = [
  //{ href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/proof-of-work", label: "Proof of Work" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <div className="sm:hidden w-full p-2.5 bg-white dark:bg-black/5">
        <Link
          href="#"
          target="_blank"
          className="flex items-center justify-center gap-2"
        >
          <span className="flex items-center gap-2">
            <PartyPopper className="w-3.5 h-3.5" />
            <span className="text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text font-semibold">
              Explore new components
            </span>
          </span>
          <div className="group relative inline-flex items-center gap-2 px-3 py-1 text-sm rounded-lg bg-zinc-900 dark:bg-zinc-100 transition-colors">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-40 group-hover:opacity-80 blur-sm transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-white dark:text-zinc-900">with xUI</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" />
            </div>
          </div>
        </Link>
      </div>
      <div className="sticky left-0 right-0 top-0 z-50">
        <div className="bg-white dark:bg-black/5 w-full">
          <div className="flex items-center justify-center w-full flex-col">
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`flex items-center justify-between 
                bg-background/80
                shadow-custom-light dark:shadow-custom-dark
                backdrop-blur-md
                border-x border-b
                border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]
                w-full sm:min-w-[800px] sm:max-w-[1200px]
                rounded-b-[28px]
                px-4 py-2.5
                relative
                transition-all duration-300 ease-in-out
                `}
            >
              <div className="relative z-10 flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-2">
                    <motion.img
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      src={GITHUB_PFP}
                      alt="Shivraj Soni GitHub profile"
                      className="w-9 h-9 rounded-full border border-border shadow-sm"
                    />
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                      }}
                      className="font-semibold text-lg md:text-xl text-foreground tracking-tight hidden sm:block"
                    >
                      Shivraj Soni
                    </motion.span>
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>

                  <nav className="hidden md:flex items-center gap-4">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 * (navLinks.length + index) }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground"
                      >
                        <link.icon className="h-5 w-5" />
                      </Button>
                    </motion.a>
                  ))}
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.1 * (navLinks.length + socialLinks.length),
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </Button>
                  </motion.div>
                </div>
                <div className="flex sm:hidden items-center gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[250px] sm:w-[300px]"
                    >
                      <nav className="flex flex-col gap-4 pt-8">
                        {navLinks.map((link, index) => (
                          <motion.div
                            key={link.href}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.05 * index }}
                          >
                            <Link
                              href={link.href}
                              className="text-lg font-medium hover:text-primary transition-colors"
                            >
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="flex items-center gap-4 mt-4">
                          {socialLinks.map((link, index) => (
                            <motion.a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={link.label}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{
                                delay: 0.05 * (navLinks.length + index),
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                              >
                                <link.icon className="h-5 w-5" />
                              </Button>
                            </motion.a>
                          ))}
                          <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{
                              delay:
                                0.05 * (navLinks.length + socialLinks.length),
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                              }
                              aria-label="Toggle theme"
                            >
                              {theme === "dark" ? (
                                <Moon className="h-5 w-5" />
                              ) : (
                                <Sun className="h-5 w-5" />
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </motion.header>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
