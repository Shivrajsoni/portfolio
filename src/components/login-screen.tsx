"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function LoginScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 text-slate-50">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-[-10%] h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/5 bg-gradient-to-br from-white/5 via-white/0 to-white/0 blur-2xl" />
      </div>

      {/* Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-white/10 bg-slate-950/60 shadow-[0_18px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
          <CardHeader className="space-y-3 pb-2">
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              Secure workspace access
            </motion.div>
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="space-y-2"
            >
              <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                Sign in to Sawad
              </CardTitle>
              <CardDescription className="text-sm text-slate-400">
                Enter your details to continue to your dashboard. Your data is
                encrypted end‑to‑end.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-[0.14em] text-slate-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="border-white/10 bg-slate-900/60 text-sm placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-[0.14em] text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-slate-100 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-white/10 bg-slate-900/60 text-sm placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <Checkbox className="border-white/25 data-[state=checked]:bg-sky-500" />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  2-step verification enabled
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="space-y-3"
            >
              <Button className="h-10 w-full rounded-lg bg-sky-500 text-sm font-medium text-slate-950 shadow-[0_14px_45px_rgba(56,189,248,0.5)] transition hover:bg-sky-400 hover:shadow-[0_18px_55px_rgba(56,189,248,0.7)]">
                Continue
              </Button>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />
                <span>or continue with</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-9 justify-center gap-2 border-white/10 bg-slate-950/60 text-xs font-medium text-slate-100 hover:border-white/20 hover:bg-slate-900"
                >
                  <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-slate-50 via-slate-200 to-slate-50" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-9 justify-center gap-2 border-white/10 bg-slate-950/60 text-xs font-medium text-slate-100 hover:border-white/20 hover:bg-slate-900"
                >
                  <span className="h-3 w-3 rounded-full bg-slate-50" />
                  GitHub
                </Button>
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center gap-1.5 border-t border-white/5 bg-slate-950/60 py-4 text-xs text-slate-500">
            <p>
              New to Sawad?{" "}
              <button
                type="button"
                className="font-medium text-slate-200 underline-offset-4 hover:text-white hover:underline"
              >
                Create an account
              </button>
            </p>
            <p className="text-[10px] text-slate-600">
              By continuing you agree to our Terms & Privacy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
