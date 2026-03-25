import React from "react";
import type { ProofOfWorkMeta } from "@/lib/proof-of-work-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Megaphone,
  GitPullRequest,
  Star,
  Calendar,
  Clock,
  Building,
  BarChart,
  CheckCircle2,
  CircleDot,
  Link as LinkIcon,
  Info,
} from "lucide-react";

export default function ProofOfWorkCard({ entry }: { entry: ProofOfWorkMeta }) {

  const typeIcon =
    entry.type === "bounty" ? (
      <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden />
    ) : entry.type === "mentions" ? (
      <Megaphone className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />
    ) : (
      <GitPullRequest className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
    );

  const mergeStatus = entry.mergeStatus ?? null;
  const mergeBadge =
    mergeStatus === "merged" ? (
      // Purple for merged (requested)
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-800 dark:text-indigo-300">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Merged
      </div>
    ) : mergeStatus === "open" ? (
      <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-800 dark:text-sky-300">
        <CircleDot className="h-4 w-4" aria-hidden />
        Open
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
        <Info className="h-4 w-4" aria-hidden />
        In review
      </div>
    );

  return (
    <Card
      className={[
        "relative overflow-hidden rounded-2xl",
        "min-h-[300px]",
        "bg-white/55 text-slate-900",
        "dark:bg-white/5 dark:text-white",
        "border-slate-200/70 dark:border-white/10",
        "backdrop-blur-xl shadow-none",
        "gap-0 py-0",
        "transition-all duration-300 hover:-translate-y-1",
        "hover:border-slate-300/90 dark:hover:border-white/20",
        "hover:shadow-none",
      ].join(" ")}
    >
      {/* Ambient card glow (no inline styles) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_10%_0%,rgba(99,102,241,0.14),transparent_62%)] dark:bg-[radial-gradient(520px_240px_at_10%_0%,rgba(99,102,241,0.22),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(420px_200px_at_90%_10%,rgba(148,163,184,0.10),transparent_65%)] dark:bg-[radial-gradient(420px_200px_at_90%_10%,rgba(148,163,184,0.14),transparent_65%)]" />
      </div>

      <div className="px-6 pt-6 pb-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/70 dark:border-white/10">
              {typeIcon}
            </div>

            <div className="min-w-0">
              <h2 className="mt-2 text-lg sm:text-xl font-bold tracking-tight leading-snug line-clamp-2">
                {entry.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {mergeBadge}
            {entry.featured && (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                <Star className="h-4 w-4" aria-hidden />
                Featured
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="inline-flex items-center gap-2 text-slate-700/80 dark:text-white/70">
            <Calendar className="h-4 w-4" aria-hidden />
            <span className="whitespace-nowrap">{entry.date}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-slate-700/80 dark:text-white/70">
            <Clock className="h-4 w-4" aria-hidden />
            <span className="whitespace-nowrap">{entry.readTime}</span>
          </div>
          {entry.organization && (
            <div className="inline-flex items-center gap-2 text-slate-700/80 dark:text-white/70 sm:col-span-2">
              <Building className="h-4 w-4" aria-hidden />
              <span className="truncate">{entry.organization}</span>
            </div>
          )}
          {entry.hardnessLevel && (
            <div className="inline-flex items-center gap-2 text-slate-700/80 dark:text-white/70 sm:col-span-2">
              <BarChart className="h-4 w-4" aria-hidden />
              <span className="truncate">{entry.hardnessLevel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200/70 dark:border-white/10 px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {entry.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/85 border-none"
            >
              {tag}
            </Badge>
          ))}
          {entry.tags.length > 4 && (
            <Badge
              variant="secondary"
              className="bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/85 border-none"
            >
              +{entry.tags.length - 4}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-slate-200/70 dark:border-white/10 hover:bg-indigo-500/10"
          >
            <a
              href={`/proof-of-work/${entry.slug}`}
              className="inline-flex items-center gap-2"
            >
              <Info className="h-4 w-4" aria-hidden />
              Details
            </a>
          </Button>

          {entry.liveLink && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200/70 dark:border-white/10 hover:bg-indigo-500/10"
            >
              <a
                href={entry.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" aria-hidden />
                Live
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

