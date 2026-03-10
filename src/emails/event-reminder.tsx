import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventReminderProps {
  eventTitle: string;
  startDate: string;
  endDate: string;
  description?: string;
  appUrl: string;
}

export function EventReminder({
  eventTitle,
  startDate,
  endDate,
  description,
  appUrl,
}: EventReminderProps) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateLabel = format(start, "EEEE d 'de' MMMM yyyy", { locale: es });
  const timeLabel = `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Recordatorio: {eventTitle} mañana</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Recordatorio de evento</Heading>

          <Section style={card}>
            <Text style={eventName}>{eventTitle}</Text>
            <Text style={meta}>
              {dateLabel}
              <br />
              {timeLabel}
            </Text>
            {description && <Text style={desc}>{description}</Text>}
          </Section>

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <Button href={`${appUrl}/calendar/day`} style={button}>
              Ver en el calendario
            </Button>
          </Section>

          <Text style={footer}>
            Este recordatorio fue enviado porque tienes un evento programado para mañana.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#0f0f0f",
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 24px",
};

const heading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "24px",
};

const card: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  padding: "24px",
  border: "1px solid #2a2a2a",
};

const eventName: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const meta: React.CSSProperties = {
  color: "#a0a0a0",
  fontSize: "14px",
  margin: "0 0 12px",
  lineHeight: "1.6",
};

const desc: React.CSSProperties = {
  color: "#d0d0d0",
  fontSize: "14px",
  margin: "12px 0 0",
  lineHeight: "1.6",
};

const button: React.CSSProperties = {
  backgroundColor: "#6366f1",
  color: "#ffffff",
  borderRadius: "6px",
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
};

const footer: React.CSSProperties = {
  color: "#606060",
  fontSize: "12px",
  marginTop: "32px",
  textAlign: "center" as const,
};
