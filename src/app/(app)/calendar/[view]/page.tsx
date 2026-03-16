import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/get-user";
import { CalendarProvider } from "@/calendar/contexts/calendar-context";
import { ClientContainer } from "@/calendar/components/client-container";
import type { TCalendarView } from "@/calendar/types";
import type { IUser } from "@/calendar/interfaces";

const VALID_VIEWS: TCalendarView[] = ["day", "week", "month", "year", "agenda"];

interface PageProps {
  params: Promise<{ view: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { view } = await params;
  const label = view.charAt(0).toUpperCase() + view.slice(1);
  return {
    title: `Calendar (${label}) | Quadra`,
    description: `View your ${view} calendar`,
  };
}

export default async function CalendarViewPage({ params }: PageProps) {
  const { view } = await params;

  if (!VALID_VIEWS.includes(view as TCalendarView)) notFound();

  const {
    data: { user },
  } = await getUser();

  if (!user) redirect("/login");

  const currentUser: IUser = {
    id: user.id,
    name: user.user_metadata?.full_name ?? user.email ?? "User",
    picturePath: user.user_metadata?.avatar_url ?? null,
  };

  return (
    <div className="flex flex-col gap-4 p-6 h-full">
      <div>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">Manage your events and schedule</p>
      </div>

      <CalendarProvider users={[currentUser]} currentUser={currentUser}>
        <ClientContainer view={view as TCalendarView} />
      </CalendarProvider>
    </div>
  );
}
