"use client";

import { createContext, useContext, useState } from "react";
import type { IRoutineBlock } from "./types";
import { ROUTINE_BLOCKS_MOCK } from "./mocks";

interface IRoutineContext {
  blocks: IRoutineBlock[];
  addBlock: (block: IRoutineBlock) => void;
  updateBlock: (block: IRoutineBlock) => void;
  deleteBlock: (id: string) => void;
}

const RoutineContext = createContext<IRoutineContext | null>(null);

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const [blocks, setBlocks] = useState<IRoutineBlock[]>(ROUTINE_BLOCKS_MOCK);

  const addBlock = (block: IRoutineBlock) => {
    setBlocks(prev => [...prev, block]);
  };

  const updateBlock = (updated: IRoutineBlock) => {
    setBlocks(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <RoutineContext.Provider value={{ blocks, addBlock, updateBlock, deleteBlock }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const ctx = useContext(RoutineContext);
  if (!ctx) throw new Error("useRoutine must be used inside RoutineProvider");
  return ctx;
}
