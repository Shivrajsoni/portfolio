"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { FileText, FolderGit2, Award, ChevronRight } from "lucide-react";
import type { BlogMeta } from "@/lib/blog-utils";
import type { ProjectMeta } from "@/lib/project-utils";
import type { ProofOfWorkMeta } from "@/lib/proof-of-work-utils";

type TabId = "blogs" | "projects" | "proof";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "blogs", label: "Featured Blogs", icon: FileText },
  { id: "projects", label: "Featured Projects", icon: FolderGit2 },
  { id: "proof", label: "Proof of Work", icon: Award },
];

interface FeaturesSectionProps {
  featuredBlogs: BlogMeta[];
  featuredProjects: ProjectMeta[];
  featuredProofOfWork: ProofOfWorkMeta[];
}

function ItemList({
  activeTab,
  featuredBlogs,
  featuredProjects,
  featuredProofOfWork,
}: FeaturesSectionProps & { activeTab: TabId }) {
  if (activeTab === "blogs") {
    if (featuredBlogs.length === 0) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
          No featured blogs yet.
        </p>
      );
    }
    return (
      <ul className="space-y-3">
        {featuredBlogs.map((blog) => (
          <li key={blog.slug}>
            <Link
              href={`/blog/${blog.slug}`}
              className="group flex items-start gap-2 rounded-lg px-3 py-2 -mx-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors block truncate">
                  {blog.title}
                </span>
                {blog.excerpt && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 block">
                    {blog.excerpt}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (activeTab === "projects") {
    if (featuredProjects.length === 0) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
          No featured projects yet.
        </p>
      );
    }
    return (
      <ul className="space-y-3">
        {featuredProjects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex items-start gap-2 rounded-lg px-3 py-2 -mx-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors block truncate">
                  {project.title}
                </span>
                {(project.excerpt || project.description) && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 block">
                    {project.excerpt || project.description}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (activeTab === "proof") {
    if (featuredProofOfWork.length === 0) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4">
          No featured proof of work yet.
        </p>
      );
    }
    return (
      <ul className="space-y-3">
        {featuredProofOfWork.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/proof-of-work/${entry.slug}`}
              className="group flex items-start gap-2 rounded-lg px-3 py-2 -mx-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors block truncate">
                  {entry.title}
                </span>
                {entry.excerpt && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 block">
                    {entry.excerpt}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export default function FeaturesSection({
  featuredBlogs,
  featuredProjects,
  featuredProofOfWork,
}: FeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("blogs");

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[320px] shrink-0 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg overflow-hidden"
    >
      {/* Tabs - tabular look */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-all duration-300
                ${
                  isActive
                    ? "text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900/80 shadow-sm border-b-2 border-orange-500 -mb-px"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {tab.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 min-h-[200px] max-h-[320px] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ItemList
              activeTab={activeTab}
              featuredBlogs={featuredBlogs}
              featuredProjects={featuredProjects}
              featuredProofOfWork={featuredProofOfWork}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
