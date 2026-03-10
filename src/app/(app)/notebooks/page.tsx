import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/get-user";
import { NotebooksPage } from "@/notebooks/components/notebooks-page";

export const metadata: Metadata = {
  title: "Notebooks | Quadra",
  description: "Write and organize your notes",
};

export default async function Page() {
  const { data: { user } } = await getUser();

  if (!user) redirect("/login");

  return (
    <Suspense>
      <NotebooksPage userId={user.id} />
    </Suspense>
  );
}
