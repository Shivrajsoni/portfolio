"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const LABEL_CLASS = "text-sm font-medium text-zinc-500 dark:text-zinc-400";

const fieldClass = (isDark: boolean) =>
  cn(
    "rounded-xl border-0 font-medium focus-visible:ring-2 focus-visible:ring-orange-500/50",
    isDark
      ? "bg-zinc-800/90 text-white placeholder:text-zinc-500"
      : "bg-zinc-200/80 text-zinc-900 placeholder:text-zinc-500",
  );

export default function LetsWorkTogether() {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px 100px 0px",
  });
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  // Start fully off the right edge of the viewport so it feels like "from outside the page"
  const [slideDistance, setSlideDistance] = useState(1200);
  useEffect(() => {
    const update = () =>
      setSlideDistance(
        typeof window !== "undefined" ? window.innerWidth + 120 : 1200,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // Lock "landed" state once so scroll never re-triggers; animation is always horizontal from right only
  if (isInView && !hasAnimatedRef.current) hasAnimatedRef.current = true;
  const isLanded = hasAnimatedRef.current;
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isDark = resolvedTheme === "dark";
  const inputStyles = fieldClass(isDark);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string)?.trim();

    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter your email.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (formData.get("name") as string) ?? "",
          email,
          message: (formData.get("message") as string) ?? "",
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send. Please try again.");
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[320px] overflow-visible max-w-full"
    >
      <motion.section
        initial={
          prefersReducedMotion
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: slideDistance, scale: 0.96 }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1, x: 0, scale: 1 }
            : isLanded
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: slideDistance, scale: 0.96 }
        }
        transition={{
          duration: prefersReducedMotion ? 0 : 1.35,
          ease: [0.19, 1, 0.22, 1],
        }}
        className="relative w-full max-w-full"
        style={{
          willChange: prefersReducedMotion ? "auto" : isLanded ? "auto" : "transform",
          transformOrigin: "right center",
        }}
      >
        {/* Subtle highlight glow when in view - theme aware */}
        <motion.div
          className="pointer-events-none absolute -inset-4 rounded-2xl opacity-0"
          animate={
            isLanded
              ? {
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.6 },
                }
              : {}
          }
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)"
              : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 70%)",
          }}
        />

        <div
          className={cn(
            "relative rounded-2xl p-5 sm:p-6 md:p-8 max-w-full",
            isDark
              ? "bg-zinc-900/80 border border-zinc-800/80"
              : "bg-zinc-100/90 border border-zinc-200/90",
          )}
        >
          {/* Title - "LET'S WORK" white, "TOGETHER" muted */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
              <span className={isDark ? "text-white" : "text-zinc-900"}>
                LET&apos;S WORK
              </span>
              <br />
              <span className="text-zinc-500 dark:text-zinc-400">TOGETHER</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contact-name" className={LABEL_CLASS}>
                  Name
                </label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  className={cn("h-11", inputStyles)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className={LABEL_CLASS}>
                  Email
                </label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Your@email.com"
                  required
                  className={cn("h-11", inputStyles)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className={LABEL_CLASS}>
                Message
              </label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Message"
                rows={4}
                className={cn("min-h-[100px] resize-y", inputStyles)}
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {errorMessage}
              </p>
            )}
            {status === "success" && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Thanks! I&apos;ll get back to you soon.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-white transition-all duration-200",
                "bg-[#ea580c] hover:bg-[#c2410c] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 dark:focus:ring-offset-zinc-900",
                "disabled:opacity-70 disabled:cursor-not-allowed",
              )}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </motion.section>
    </div>
  );
}
