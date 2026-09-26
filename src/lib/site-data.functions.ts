import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type TeamRow = Database["public"]["Tables"]["team_members"]["Row"];
export type PostRow = Database["public"]["Tables"]["social_posts"]["Row"];

export const STORAGE_PREFIX = "storage://";

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const [ev, tm, ps, hp, tx, factsResult] = await Promise.all([
    sb.from("events").select("*").order("event_date", { ascending: false }),
    sb.from("team_members").select("*").order("sort_order").order("created_at"),
    sb.from("social_posts").select("*").order("sort_order").order("post_date", { ascending: false }),
    sb.from("hero_poster").select("*").eq("id", 1).maybeSingle(),
    sb.from("site_content").select("key, value"),
    sb.from("daily_facts").select("*").order("sort_order").order("created_at").order("id"),
  ]);
  if (ev.error || tm.error || ps.error) console.error("site data", ev.error ?? tm.error ?? ps.error);
  const events = ev.data ?? [];
  const team = tm.data ?? [];
  const posts = ps.data ?? [];
  // Resolve private storage paths into signed URLs.
  const paths = [...events.map((e) => e.image_url), ...team.map((t) => t.photo_url), ...posts.map((p) => p.image_url)]
    .filter((u): u is string => !!u && u.startsWith(STORAGE_PREFIX))
    .map((u) => u.slice(STORAGE_PREFIX.length));
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data } = await sb.storage.from("site-media").createSignedUrls([...new Set(paths)], 60 * 60 * 24 * 7);
    data?.forEach((d) => { if (d.path && d.signedUrl) signed[d.path] = d.signedUrl; });
  }
  const resolve = (u: string | null) => (u && u.startsWith(STORAGE_PREFIX) ? signed[u.slice(STORAGE_PREFIX.length)] ?? null : u);
  return {
    events: events.map((e) => ({ ...e, image_url: resolve(e.image_url) })),
    team: team.map((t) => ({ ...t, photo_url: resolve(t.photo_url) })),
    posts: posts.map((p) => ({ ...p, image_url: resolve(p.image_url) ?? "" })).filter((p) => p.image_url),
    poster: hp.data ?? null,
    texts: Object.fromEntries((tx.data ?? []).map((r) => [r.key, r.value])) as Record<string, string>,
    facts: factsResult.data ?? [],
    ok: !ev.error && !tm.error && !ps.error,
  };
});
