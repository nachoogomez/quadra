"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  /** Initials derived from fullName, used as avatar fallback */
  initials: string;
}

interface UserStore {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

function toProfile(user: User): UserProfile {
  const meta = user.user_metadata ?? {};
  const fullName: string =
    meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "User";
  const avatarUrl: string | null = meta.avatar_url ?? meta.picture ?? null;
  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    avatarUrl,
    initials,
  };
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  isLoading: true,
  setUser: (supabaseUser) =>
    set({
      user: supabaseUser ? toProfile(supabaseUser) : null,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ user: null, isLoading: false }),
}));
