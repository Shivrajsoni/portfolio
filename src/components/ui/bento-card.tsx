import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Link as LinkIcon } from "lucide-react";

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  date,
  href,
  cta,
  liveLink,
}: {
  name: string;
  className: string;
  background: React.ReactNode;
  Icon: any;
  description: string;
  date: string;
  href: string;
  cta: string;
  liveLink?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl",
      "bg-black border border-neutral-800 [box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(0,0,0,.2),0_12px_24px_rgba(0,0,0,.2)]",
      "transform-gpu transition-all duration-300 ease-in-out",
      "hover:shadow-2xl hover:shadow-neutral-900 hover:-translate-y-2",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-8 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-300 transition-all duration-300 group-hover:scale-75" />
      <h3 className="text-3xl font-semibold text-neutral-100 leading-tight">{name}</h3>
      <p className="max-w-lg text-neutral-400 text-base leading-relaxed">{description}</p>
      <div className="flex items-center gap-2 text-sm text-neutral-500 mt-4">
        <Calendar className="w-5 h-5" />
        <span>{date}</span>
      </div>
    </div>
    <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <Link href={href} className="pointer-events-auto">
        <p className="text-primary font-semibold flex items-center gap-2">
          {cta} <ArrowRight className="w-4 h-4" />
        </p>
      </Link>
      {liveLink && (
        <Link href={liveLink} className="pointer-events-auto ml-auto">
          <p className="text-primary font-semibold flex items-center gap-2">
            Live Preview <LinkIcon className="w-4 h-4" />
          </p>
        </Link>
      )}
    </div>
  </motion.div>
);
