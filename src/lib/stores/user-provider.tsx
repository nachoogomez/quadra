"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "./user-store";
import type { User } from "@supabase/supabase-js";

interface Props {
  /** Serialized user from the server — used to hydrate the store instantly */
  initialUser: User | null;
  children: React.ReactNode;
}

/**
 * Hydrates the Zustand user store with the server-fetched user on mount,
 * then subscribes to Supabase auth state changes to keep it in sync
 * (sign-in, sign-out, token refresh, OAuth callbacks).
 */
export function UserProvider({ initialUser, children }: Props) {
  const setUser = useUserStore(s => s.setUser);

  useEffect(() => {
    // Hydrate immediately with the server value
    setUser(initialUser);

    const supabase = createClient();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [initialUser, setUser]);

  return <>{children}</>;
}
