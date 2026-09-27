import type { UiEvent } from "./site-data";

/** Etkinliğin başlangıç/bitiş zamanını Istanbul saatine göre UTC damgasına çevirir. */
function stamps(event: UiEvent) {
  const raw = /^\d{1,2}[:.]\d{2}$/.test(event.time) ? event.time.replace(".", ":").padStart(5, "0") : "";
  const start = raw ? new Date(`${event.iso}T${raw}:00+03:00`) : new Date(`${event.iso}T09:00:00+03:00`);
  const end = new Date(start.getTime() + 2 * 3600000);
  const fmt = (d: Date) => `${d.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  return { start: fmt(start), end: fmt(end) };
}

function details(event: UiEvent) {
  return `${event.desc}\n\nKırıkkale Üniversitesi Yapay Zeka Topluluğu (YZT)\nhttps://kkuyzt.lovable.app/events`;
}

export function googleCalendarUrl(event: UiEvent) {
  const { start, end } = stamps(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — YZT`,
    dates: `${start}/${end}`,
    details: details(event),
    location: event.location || "Kırıkkale Üniversitesi",
    ctz: "Europe/Istanbul",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function downloadIcs(event: UiEvent) {
  const { start, end } = stamps(event);
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//YZT//Etkinlik//TR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@kkuyzt.lovable.app`,
    `DTSTAMP:${start}`, `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:${escapeIcs(`${event.title} — YZT`)}`,
    `DESCRIPTION:${escapeIcs(details(event))}`,
    `LOCATION:${escapeIcs(event.location || "Kırıkkale Üniversitesi")}`,
    "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:YZT etkinliği yaklaşıyor", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `yzt-${event.iso}.ics`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
