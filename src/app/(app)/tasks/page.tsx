import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/get-user";
import { TaskBoard } from "@/tasks/components/task-board";

export const metadata: Metadata = {
  title: "Tasks | Quadra",
  description: "Manage your tasks and projects",
};

export default async function TasksPage() {
  const { data: { user } } = await getUser();

  if (!user) redirect("/login");

  return <TaskBoard userId={user.id} />;
}
