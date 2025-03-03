"use client";

import React, { useState, createContext, useContext } from 'react';

import { sectionName } from "../lib/types";
type ActiveStateContextProps = {
  children: React.ReactNode
}

type ActiveStateContextProp = {
  activeState: sectionName,
  setActiveState: React.Dispatch<React.SetStateAction<sectionName>>,
  lastTimeClick: number,
  setLastTimeClick: React.Dispatch<React.SetStateAction<number>>;
}

const ActiveStateContext = createContext<ActiveStateContextProp | null>(null);

export function UseActiveState({ children }: ActiveStateContextProps) {
  const [activeState, setActiveState] = useState<sectionName>("Home");
  const [lastTimeClick, setLastTimeClick] = useState(0);

  return <ActiveStateContext.Provider value={{
    activeState,
    setActiveState,
    lastTimeClick,
    setLastTimeClick
  }}>
    {children}
  </ActiveStateContext.Provider>;
}

export default function UseActiveSection() {
  const context = useContext(ActiveStateContext);

  if (context == null) {
    throw new Error(
      "useActiveSectionContext must be used within an ActiveSectionContextProvider"
    );

  }
  return context;
}
