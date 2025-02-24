
"use client";

import react, { useEffect } from "react";
import type { sectionName } from "./types.ts";

import { useInView } from "react-intersection-observer";
import useActiveSection from "../context/use-active-state";


export function useSectionInView(sectionName: sectionName, threshold: 0.75) {
  const { ref, inView } = useInView({
    threshold
  });
  const { setActiveState, lastTimeClick } = useActiveSection();

  useEffect(() => {
    if (inView && Date.now() - lastTimeClick > 1000) {
      setActiveState(sectionName);
    }
  }, [inView, setActiveState, lastTimeClick, sectionName]);

  return {
    ref,
  }
}


