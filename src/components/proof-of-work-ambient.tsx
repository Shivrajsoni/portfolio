import React from "react";

export default function ProofOfWorkAmbient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-neutral-950">
      {/* Base */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-neutral-950" />

      {/* Blurry, soft blobs (light mode) */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(650px 320px at 12% 8%, rgba(124,58,237,0.20), transparent 60%), radial-gradient(540px 280px at 82% 0%, rgba(16,185,129,0.16), transparent 60%), radial-gradient(680px 340px at 75% 65%, rgba(59,130,246,0.14), transparent 60%)",
          filter: "blur(22px)",
          opacity: 0.98,
        }}
      />

      {/* Blurry, soft blobs (dark mode stronger) */}
      <div className="absolute inset-0 -z-10 pointer-events-none hidden dark:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(620px 340px at 10% 0%, rgba(99,102,241,0.22), transparent 60%), radial-gradient(540px 280px at 85% 10%, rgba(16,185,129,0.18), transparent 60%), radial-gradient(700px 360px at 70% 70%, rgba(59,130,246,0.14), transparent 60%)",
            filter: "blur(22px)",
            opacity: 1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-35 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(60% 55% at 50% 10%, black 20%, transparent 80%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

