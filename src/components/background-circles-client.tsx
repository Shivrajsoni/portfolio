"use client";

import dynamic from "next/dynamic";

const BackgroundCircles = dynamic(
  () =>
    import("@/components/background-circle").then(
      (mod) => mod.BackgroundCircles
    ),
  {
    ssr: false,
    loading: () => <div className="relative h-screen w-full" />,
  }
);

export default BackgroundCircles;
