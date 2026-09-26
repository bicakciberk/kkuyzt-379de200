import { queryOptions } from "@tanstack/react-query";
import { getSiteData } from "./site-data.functions";
import type { EventRow, TeamRow } from "./site-data.functions";

export const siteDataQuery = queryOptions({ queryKey: ["site-data"], queryFn: () => getSiteData() });

export const EVENT_CATEGORIES = ["Seminer", "Atölye", "Teknik Gezi", "Söyleşi", "Topluluk"] as const;
export const DEPARTMENTS = ["Organizasyon", "Dış İlişkiler", "Sosyal Medya", "Tanıtım"] as const;
export const ROLES = ["Topluluk Başkanı", "Departman Başkanı", "Üye"] as const;

export function formatTrDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export type UiEvent = { id: string; title: string; date: string; iso: string; time: string; location: string; tag: string; desc: string; status: "Yaklaşan" | "Geçmiş"; image: string | null; isNext: boolean };

export function toUiEvents(rows: EventRow[]): UiEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  return rows.map((e) => ({
    id: e.id, title: e.title, date: formatTrDate(e.event_date), iso: e.event_date, time: e.event_time, location: e.location,
    tag: e.category, desc: e.description, status: e.event_date >= today ? "Yaklaşan" : "Geçmiş", image: e.image_url, isNext: e.is_next,
  }));
}

export function nextEvent(events: UiEvent[]) {
  return events.find((e) => e.isNext) ?? [...events].filter((e) => e.status === "Yaklaşan").sort((a, b) => a.iso.localeCompare(b.iso))[0] ?? null;
}

export type UiMember = { id: string; name: string; role: string; program: string; photo: string | null };
export function toTeam(rows: TeamRow[]) {
  const map = (t: TeamRow): UiMember => ({ id: t.id, name: t.name, role: t.role, program: t.program, photo: t.photo_url });
  const leaders = rows.filter((t) => t.department === "Topluluk" || t.role === "Topluluk Başkanı").map(map);
  const groups = DEPARTMENTS.map((group) => ({ group, members: rows.filter((t) => t.department === group && t.role !== "Topluluk Başkanı").map(map) })).filter((g) => g.members.length);
  return { leaders, groups };
}
export const PANEL_PATH = "/yzt-yonetim-k7x2" as const;
