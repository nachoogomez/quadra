"use client";

import { createContext, useContext } from "react";
import { useRoutineBlocks } from "./hooks/use-routine-blocks";
import type { IRoutineBlock } from "./types";

interface IRoutineContext {
  blocks: IRoutineBlock[];
  isLoading: boolean;
  error: string | null;
  addBlock: (block: Omit<IRoutineBlock, "id">) => Promise<IRoutineBlock>;
  updateBlock: (block: IRoutineBlock) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
}

const RoutineContext = createContext<IRoutineContext | null>(null);

interface IProps {
  children: React.ReactNode;
  userId: string;
}

export function RoutineProvider({ children, userId }: IProps) {
  const { blocks, isLoading, error, addBlock, updateBlock, deleteBlock } = useRoutineBlocks(userId);

  return (
    <RoutineContext.Provider value={{ blocks, isLoading, error, addBlock, updateBlock, deleteBlock }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const ctx = useContext(RoutineContext);
  if (!ctx) throw new Error("useRoutine must be used inside RoutineProvider");
  return ctx;
}
