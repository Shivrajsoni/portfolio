"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/blogs", icon: Newspaper, label: "Manage Blogs" },
  { href: "/admin/projects", icon: Briefcase, label: "Manage Projects" },
  { href: "/admin/proof-of-work", icon: Trophy, label: "Proof of Work" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      //@ts-ignore
      className="relative bg-card border-r border-border min-h-screen p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              //@ts-ignore
              className="text-xl font-bold"
            >
              Admin Panel
            </motion.h1>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-muted"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
