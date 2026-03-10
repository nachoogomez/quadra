import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/get-user";
import { RoutineView } from "@/routine/components/routine-view";

export const metadata: Metadata = {
  title: "Routine | Quadra",
  description: "Plan your weekly routine",
};

export default async function RoutinePage() {
  const { data: { user } } = await getUser();

  if (!user) redirect("/login");

  return <RoutineView userId={user.id} />;
}
