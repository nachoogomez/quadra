import { notFound } from "next/navigation";
import { CalendarProvider } from "@/calendar/contexts/calendar-context";
import { ClientContainer } from "@/calendar/components/client-container";
import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "@/calendar/mocks";
import type { TCalendarView } from "@/calendar/types";

const VALID_VIEWS: TCalendarView[] = ["day", "week", "month", "year", "agenda"];

export function generateStaticParams() {
  return VALID_VIEWS.map(view => ({ view }));
}

interface PageProps {
  params: Promise<{ view: string }>;
}

export default async function CalendarViewPage({ params }: PageProps) {
  const { view } = await params;

  if (!VALID_VIEWS.includes(view as TCalendarView)) notFound();

  return (
    <div className="flex flex-col gap-4 p-6 h-full">
      <div>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">Manage your events and schedule</p>
      </div>

      <CalendarProvider events={CALENDAR_ITEMS_MOCK} users={USERS_MOCK} currentUserId={USERS_MOCK[0].id}>
        <ClientContainer view={view as TCalendarView} />
      </CalendarProvider>
    </div>
  );
}
