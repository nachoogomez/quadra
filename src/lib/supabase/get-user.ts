import { cache } from "react";
import { createClient } from "./server";

/**
 * Cached getUser() — deduplicates the Supabase call within a single request.
 * Layout and pages sharing the same render tree call this once, not twice.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  return supabase.auth.getUser();
});
