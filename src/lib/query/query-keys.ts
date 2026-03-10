export const queryKeys = {
  tasks: (userId: string) => ["tasks", userId] as const,
  events: (userId: string) => ["events", userId] as const,
  notebooks: (userId: string) => ["notebooks", userId] as const,
  notes: (userId: string) => ["notes", userId] as const,
  routineBlocks: (userId: string) => ["routine_blocks", userId] as const,
};
