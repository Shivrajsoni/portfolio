"use client";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const GITHUB_USERNAME = "Shivrajsoni"; // Change if needed
const TWITTER_URL = "https://x.com/_callmeXavier_"; // Add your handle
const LINKEDIN_URL = "https://www.linkedin.com/in/shivraj-soni-34572b226/"; // Add your handle
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_PFP = `https://github.com/${GITHUB_USERNAME}.png`;

const socialLinks = [
  {
    href: GITHUB_URL,
    label: "GitHub",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z"
        />
      </svg>
    ),
  },
  {
    href: TWITTER_URL,
    label: "Twitter",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.15 2.97 4.05 3A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"
        />
      </svg>
    ),
  },
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
        />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src={GITHUB_PFP}
            alt="Shivraj Soni GitHub profile"
            className="w-10 h-10 rounded-full border border-border shadow-sm"
          />
          <span className="font-semibold text-lg md:text-xl text-foreground tracking-tight">
            Shivraj Soni
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/proof-of-work"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Proof of Work
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            // Moon icon
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          ) : (
            // Sun icon
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
