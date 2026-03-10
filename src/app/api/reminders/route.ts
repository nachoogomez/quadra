import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import { EventReminder } from "@/emails/event-reminder";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Range: tomorrow 00:00:00 UTC → tomorrow 23:59:59 UTC
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  const tomorrowEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2) - 1
  );

  const { data: events, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .gte("start_date", tomorrow.toISOString())
    .lte("start_date", tomorrowEnd.toISOString())
    .is("reminder_sent_at", null);

  if (error) {
    console.error("[reminders] Failed to fetch events:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!events || events.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://quadra.app";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "reminders@quadra.app";

  let sent = 0;

  for (const event of events) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.admin.getUserById(event.user_id);

      if (userError || !user?.email) {
        console.warn(`[reminders] No email for user ${event.user_id}`);
        continue;
      }

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: `Recordatorio: ${event.title} mañana`,
        react: EventReminder({
          eventTitle: event.title,
          startDate: event.start_date,
          endDate: event.end_date,
          description: event.description || undefined,
          appUrl,
        }),
      });

      if (sendError) {
        console.error(`[reminders] Resend error for event ${event.id}:`, sendError);
        continue;
      }

      const { error: updateError } = await supabaseAdmin
        .from("events")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", event.id);

      if (updateError) {
        console.error(`[reminders] Failed to mark event ${event.id}:`, updateError.message);
      } else {
        sent++;
      }
    } catch (err) {
      console.error(`[reminders] Unexpected error for event ${event.id}:`, err);
    }
  }

  return NextResponse.json({ sent });
}
