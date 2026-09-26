import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, LogOut, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_PREFIX, getSiteData } from "@/lib/site-data.functions";
import { DEFAULT_TEXT, type TextKey } from "@/lib/site-text";
import { DEPARTMENTS, EVENT_CATEGORIES, ROLES, formatTrDate, siteDataQuery } from "@/lib/site-data";

export const Route = createFileRoute("/_authenticated/yzt-yonetim-k7x2")({
  head: () => ({ meta: [
    { title: "Yönetim Paneli — YZT" }, { name: "robots", content: "noindex, nofollow" },
    { name: "description", content: "YZT içerik yönetimi." }, { property: "og:title", content: "Yönetim Paneli — YZT" },
    { property: "og:description", content: "YZT içerik yönetimi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Panel,
});

const field = "mt-1.5 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
type SiteData = Awaited<ReturnType<typeof getSiteData>>;
type Ev = SiteData["events"][number];
type Mem = SiteData["team"][number];
type Post = SiteData["posts"][number];

async function uploadImage(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, { contentType: file.type });
  if (error) throw new Error("Görsel yüklenemedi. Dosya 10 MB'tan küçük olmalı.");
  return STORAGE_PREFIX + path;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="block text-sm font-semibold">{label}{children}{hint && <span className="mt-1 block text-xs font-normal text-muted-foreground">{hint}</span>}</label>;
}

function ImageField({ current, onFile, onRemove }: { current: string | null; onFile: (f: File | null) => void; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(current);
  return <div className="text-sm font-semibold">Görsel
    <div className="mt-1.5 flex items-center gap-3">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden border border-input bg-muted">{preview ? <img src={preview} alt="" className="size-full object-cover" /> : <ImagePlus className="size-5 text-muted-foreground" />}</div>
      <div className="flex flex-col gap-2">
        <input type="file" accept="image/*" className="text-xs font-normal" onChange={(e) => { const f = e.target.files?.[0] ?? null; onFile(f); setPreview(f ? URL.createObjectURL(f) : current); }} />
        {preview && <button type="button" className="self-start text-xs font-normal underline" onClick={() => { setPreview(null); onRemove(); }}>Görseli kaldır</button>}
      </div>
    </div>
  </div>;
}

function useSaver() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true); setError("");
    try { await fn(); await qc.invalidateQueries({ queryKey: siteDataQuery.queryKey }); await qc.invalidateQueries({ queryKey: ["panel"] }); done?.(); }
    catch (e) { setError(e instanceof Error && e.message.startsWith("Görsel") ? e.message : "Kaydedilemedi. Lütfen alanları kontrol edip tekrar dene."); }
    finally { setBusy(false); }
  }
  return { busy, error, run };
}
function check<T>(r: { error: unknown; data?: T }) { if (r.error) throw r.error; return r.data; }

function Panel() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(siteDataQuery);
  async function signOut() { await qc.cancelQueries(); await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }
  return <section className="min-h-screen bg-muted px-4 pt-28 pb-20 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-5">
        <div><p className="eyebrow">YZT · Yönetim</p><h1 className="mt-2 font-display text-4xl md:text-5xl">İçerik paneli</h1><p className="mt-2 text-sm text-muted-foreground">Kaydettiğin her değişiklik sitede hemen görünür.</p></div>
        <Button variant="outline" onClick={signOut}><LogOut />Çıkış yap</Button>
      </div>
      {isLoading || !data ? <div className="grid place-items-center py-24"><Loader2 className="animate-spin" /></div> :
        <Tabs defaultValue="events" className="mt-8">
          <TabsList className="h-auto flex-wrap rounded-none border border-foreground bg-background p-1">
            <TabsTrigger value="events" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Etkinlikler ({data.events.length})</TabsTrigger>
            <TabsTrigger value="team" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Takım ({data.team.length})</TabsTrigger>
            <TabsTrigger value="social" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sosyal Medya ({data.posts.length})</TabsTrigger>
            <TabsTrigger value="poster" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Hero Posteri</TabsTrigger>
            <TabsTrigger value="texts" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sayfa Metinleri</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Site Ayarları</TabsTrigger>
            <TabsTrigger value="inbox" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Başvurular / Mesajlar</TabsTrigger>
            <TabsTrigger value="log" className="rounded-none px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Aktivite Geçmişi</TabsTrigger>
          </TabsList>
          <TabsContent value="events"><EventsTab events={data.events} /></TabsContent>
          <TabsContent value="team"><TeamTab team={data.team} /></TabsContent>
          <TabsContent value="social"><SocialTab posts={data.posts} /></TabsContent>
          <TabsContent value="poster"><PosterTab poster={data.poster} /></TabsContent>
          <TabsContent value="texts"><TextsTab texts={data.texts} groups={TEXT_GROUPS} title="Sayfa Metinleri" note="Boş bırakılan alanlarda sitenin varsayılan metni gösterilir. Paragrafları boş bir satırla ayırabilirsin." /></TabsContent>
          <TabsContent value="settings"><TextsTab texts={data.texts} groups={SETTING_GROUPS} title="Site Ayarları" note="Bu bilgiler header, footer, iletişim sayfası ve ana sayfadaki tüm ilgili yerlerde kullanılır." /></TabsContent>
          <TabsContent value="inbox"><InboxTab /></TabsContent>
          <TabsContent value="log"><LogTab /></TabsContent>
        </Tabs>}
    </div>
  </section>;
}

function Toolbar({ title, onAdd, addLabel }: { title: string; onAdd: () => void; addLabel: string }) {
  return <div className="mt-6 flex items-center justify-between gap-3"><h2 className="font-display text-2xl">{title}</h2><Button onClick={onAdd}><Plus />{addLabel}</Button></div>;
}
function RowActions({ onEdit, onDelete, extra }: { onEdit: () => void; onDelete: () => void; extra?: ReactNode }) {
  return <div className="flex shrink-0 items-center gap-1">{extra}<Button size="icon" variant="ghost" aria-label="Düzenle" onClick={onEdit}><Pencil /></Button><Button size="icon" variant="ghost" aria-label="Sil" onClick={onDelete}><Trash2 /></Button></div>;
}
function useDelete(table: "events" | "team_members" | "social_posts") {
  const s = useSaver();
  return (id: string, name: string) => { if (window.confirm(`“${name}” silinsin mi? Bu işlem geri alınamaz.`)) s.run(async () => check(await supabase.from(table).delete().eq("id", id))); };
}

/* ---------- Etkinlikler ---------- */
function EventsTab({ events }: { events: Ev[] }) {
  const [editing, setEditing] = useState<Ev | "new" | null>(null);
  const del = useDelete("events");
  const s = useSaver();
  const markNext = (id: string) => s.run(async () => { check(await supabase.from("events").update({ is_next: false }).neq("id", id)); check(await supabase.from("events").update({ is_next: true }).eq("id", id)); });
  return <>
    <Toolbar title="Etkinlikler" addLabel="Yeni Etkinlik Ekle" onAdd={() => setEditing("new")} />
    <p className="mt-2 text-sm text-muted-foreground">Yıldızlı etkinlik ana sayfadaki geri sayımda gösterilir.</p>
    <ul className="mt-4 divide-y divide-border border border-foreground bg-background">
      {events.map((e) => <li key={e.id} className="flex items-center gap-4 p-4">
        <div className="size-14 shrink-0 overflow-hidden border border-input bg-muted">{e.image_url && <img src={e.image_url} alt="" className="size-full object-cover" />}</div>
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{formatTrDate(e.event_date)}{e.event_time && ` · ${e.event_time}`} · {e.category}{e.location && ` · ${e.location}`}</p></div>
        {e.is_next && <span className="hidden bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground sm:inline">Sıradaki</span>}
        <RowActions onEdit={() => setEditing(e)} onDelete={() => del(e.id, e.title)} extra={!e.is_next && <Button size="icon" variant="ghost" aria-label="Sıradaki etkinlik yap" title="Sıradaki etkinlik yap" onClick={() => markNext(e.id)}><Star /></Button>} />
      </li>)}
      {!events.length && <li className="p-6 text-sm text-muted-foreground">Henüz etkinlik yok.</li>}
    </ul>
    {editing && <EventDialog item={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
  </>;
}
function EventDialog({ item, onClose }: { item: Ev | null; onClose: () => void }) {
  const s = useSaver();
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const v = (k: string) => String(f.get(k) ?? "").trim();
    if (!v("title") || !v("event_date")) { alert("Başlık ve tarih zorunlu."); return; }
    const isNext = f.get("is_next") === "on";
    s.run(async () => {
      const row: Record<string, unknown> = { title: v("title"), category: v("category"), event_date: v("event_date"), event_time: v("event_time"), location: v("location"), description: v("description"), is_next: isNext };
      if (file) row["image_url"] = await uploadImage(file, "events"); else if (removed) row["image_url"] = null;
      if (isNext) check(await supabase.from("events").update({ is_next: false }).eq("is_next", true));
      if (item) check(await supabase.from("events").update(row as never).eq("id", item.id));
      else check(await supabase.from("events").insert(row as never));
    }, onClose);
  }
  return <FormDialog title={item ? "Etkinliği düzenle" : "Yeni etkinlik"} onClose={onClose} onSubmit={submit} busy={s.busy} error={s.error}>
    <Field label="Başlık *"><input name="title" defaultValue={item?.title} className={field} maxLength={150} /></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Kategori"><select name="category" defaultValue={item?.category ?? "Seminer"} className={field}>{EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Tarih *"><input name="event_date" type="date" defaultValue={item?.event_date} className={field} /></Field>
      <Field label="Saat" hint="Örn. 19:00"><input name="event_time" defaultValue={item?.event_time} className={field} maxLength={20} /></Field>
      <Field label="Konum"><input name="location" defaultValue={item?.location} className={field} maxLength={150} /></Field>
    </div>
    <Field label="Açıklama"><textarea name="description" rows={4} defaultValue={item?.description} className={field} maxLength={1500} /></Field>
    <ImageField current={item?.image_url ?? null} onFile={(f) => { setFile(f); setRemoved(false); }} onRemove={() => { setFile(null); setRemoved(true); }} />
    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_next" defaultChecked={item?.is_next} className="size-4 accent-[var(--color-primary)]" />Sıradaki etkinlik olarak işaretle (geri sayım)</label>
  </FormDialog>;
}

/* ---------- Takım ---------- */
const TEAM_GROUPS = ["Topluluk", ...DEPARTMENTS] as const;
function TeamTab({ team }: { team: Mem[] }) {
  const [editing, setEditing] = useState<Mem | "new" | null>(null);
  const del = useDelete("team_members");
  return <>
    <Toolbar title="Takım" addLabel="Yeni Üye Ekle" onAdd={() => setEditing("new")} />
    {TEAM_GROUPS.map((g) => { const list = team.filter((m) => m.department === g); return <div key={g} className="mt-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">{g === "Topluluk" ? "Topluluk Başkanı" : g} · {list.length}</h3>
      <ul className="mt-2 divide-y divide-border border border-foreground bg-background">
        {list.map((m) => <li key={m.id} className="flex items-center gap-4 p-3">
          <div className="size-12 shrink-0 overflow-hidden border border-input bg-muted">{m.photo_url && <img src={m.photo_url} alt="" className="size-full object-cover" />}</div>
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.role} · {m.program || "—"} · Sıra {m.sort_order}</p></div>
          <RowActions onEdit={() => setEditing(m)} onDelete={() => del(m.id, m.name)} />
        </li>)}
        {!list.length && <li className="p-4 text-sm text-muted-foreground">Bu grupta kimse yok.</li>}
      </ul>
    </div>; })}
    {editing && <MemberDialog item={editing === "new" ? null : editing} nextOrder={team.reduce((m, t) => Math.max(m, t.sort_order), 0) + 1} onClose={() => setEditing(null)} />}
  </>;
}
function MemberDialog({ item, nextOrder, onClose }: { item: Mem | null; nextOrder: number; onClose: () => void }) {
  const s = useSaver();
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const v = (k: string) => String(f.get(k) ?? "").trim();
    if (!v("name")) { alert("Ad soyad zorunlu."); return; }
    s.run(async () => {
      const row: Record<string, unknown> = { name: v("name"), department: v("department"), role: v("role"), program: v("program"), sort_order: Number(v("sort_order")) || 0 };
      if (file) row["photo_url"] = await uploadImage(file, "team"); else if (removed) row["photo_url"] = null;
      if (item) check(await supabase.from("team_members").update(row as never).eq("id", item.id));
      else check(await supabase.from("team_members").insert(row as never));
    }, onClose);
  }
  return <FormDialog title={item ? "Üyeyi düzenle" : "Yeni üye"} onClose={onClose} onSubmit={submit} busy={s.busy} error={s.error}>
    <Field label="Ad soyad *"><input name="name" defaultValue={item?.name} className={field} maxLength={100} /></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Departman" hint="Topluluk başkanı için “Topluluk” seç."><select name="department" defaultValue={item?.department ?? "Organizasyon"} className={field}>{TEAM_GROUPS.map((d) => <option key={d}>{d}</option>)}</select></Field>
      <Field label="Rol"><select name="role" defaultValue={item?.role ?? "Üye"} className={field}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></Field>
      <Field label="Bölüm"><input name="program" defaultValue={item?.program ?? "Endüstri Mühendisliği"} className={field} maxLength={120} /></Field>
      <Field label="Sıra" hint="Küçük sayı önce gösterilir."><input name="sort_order" type="number" defaultValue={item?.sort_order ?? nextOrder} className={field} /></Field>
    </div>
    <ImageField current={item?.photo_url ?? null} onFile={(f) => { setFile(f); setRemoved(false); }} onRemove={() => { setFile(null); setRemoved(true); }} />
  </FormDialog>;
}

/* ---------- Sosyal medya ---------- */
function SocialTab({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<Post | "new" | null>(null);
  const del = useDelete("social_posts");
  const s = useSaver();
  const move = (i: number, dir: -1 | 1) => { const list = [...posts]; const j = i + dir; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j]!, list[i]!];
    s.run(async () => { for (const [k, p] of list.entries()) check(await supabase.from("social_posts").update({ sort_order: k }).eq("id", p.id)); }); };
  return <>
    <Toolbar title="Sosyal medya" addLabel="Yeni Paylaşım Ekle" onAdd={() => setEditing("new")} />
    <p className="mt-2 text-sm text-muted-foreground">Burada paylaşım varsa ana sayfadaki Instagram alanında bu görseller gösterilir; hiç yoksa otomatik Instagram akışı görünür.</p>
    <ul className="mt-4 divide-y divide-border border border-foreground bg-background">
      {posts.map((p, i) => <li key={p.id} className="flex items-center gap-4 p-3">
        <img src={p.image_url} alt="" className="size-14 shrink-0 border border-input object-cover" />
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.caption || "Başlıksız"}</p><p className="text-xs text-muted-foreground">{formatTrDate(p.post_date)}</p></div>
        <RowActions onEdit={() => setEditing(p)} onDelete={() => del(p.id, p.caption || "Paylaşım")} extra={<>
          <Button size="icon" variant="ghost" aria-label="Yukarı taşı" disabled={i === 0 || s.busy} onClick={() => move(i, -1)}><ArrowUp /></Button>
          <Button size="icon" variant="ghost" aria-label="Aşağı taşı" disabled={i === posts.length - 1 || s.busy} onClick={() => move(i, 1)}><ArrowDown /></Button></>} />
      </li>)}
      {!posts.length && <li className="p-6 text-sm text-muted-foreground">Henüz paylaşım yok.</li>}
    </ul>
    {editing && <PostDialog item={editing === "new" ? null : editing} nextOrder={posts.length} onClose={() => setEditing(null)} />}
  </>;
}
function PostDialog({ item, nextOrder, onClose }: { item: Post | null; nextOrder: number; onClose: () => void }) {
  const s = useSaver();
  const [file, setFile] = useState<File | null>(null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const v = (k: string) => String(f.get(k) ?? "").trim();
    if (!item && !file) { alert("Bir görsel seç."); return; }
    s.run(async () => {
      const row: Record<string, unknown> = { caption: v("caption"), post_date: v("post_date") || new Date().toISOString().slice(0, 10), link_url: v("link_url") || null };
      if (file) row["image_url"] = await uploadImage(file, "social");
      if (item) check(await supabase.from("social_posts").update(row as never).eq("id", item.id));
      else check(await supabase.from("social_posts").insert({ ...row, sort_order: nextOrder } as never));
    }, onClose);
  }
  return <FormDialog title={item ? "Paylaşımı düzenle" : "Yeni paylaşım"} onClose={onClose} onSubmit={submit} busy={s.busy} error={s.error}>
    <ImageField current={item?.image_url ?? null} onFile={setFile} onRemove={() => setFile(null)} />
    <Field label="Başlık"><input name="caption" defaultValue={item?.caption} className={field} maxLength={200} /></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Tarih"><input name="post_date" type="date" defaultValue={item?.post_date ?? new Date().toISOString().slice(0, 10)} className={field} /></Field>
      <Field label="Instagram bağlantısı" hint="İsteğe bağlı"><input name="link_url" type="url" defaultValue={item?.link_url ?? ""} placeholder="https://instagram.com/p/..." className={field} /></Field>
    </div>
  </FormDialog>;
}

function FormDialog({ title, children, onClose, onSubmit, busy, error }: { title: string; children: ReactNode; onClose: () => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void; busy: boolean; error: string }) {
  return <Dialog open onOpenChange={(o) => { if (!o && !busy) onClose(); }}>
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
      <DialogHeader><DialogTitle className="font-display text-3xl">{title}</DialogTitle></DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {children}
        {error && <p role="alert" className="border-l-2 border-brand-dark pl-3 text-sm text-brand-dark">{error}</p>}
        <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={onClose} disabled={busy}>Vazgeç</Button><Button type="submit" disabled={busy}>{busy ? <><Loader2 className="animate-spin" />Kaydediliyor...</> : "Kaydet"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}

/* ---------- Başvurular / Mesajlar ---------- */
const STATUSES = ["Bekliyor", "İncelendi", "Yanıtlandı"] as const;
const statusClass: Record<string, string> = { "Bekliyor": "bg-primary text-primary-foreground", "İncelendi": "bg-brand-pale text-foreground", "Yanıtlandı": "bg-muted text-muted-foreground" };
const fmtDateTime = (d: string) => new Date(d).toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

function InboxTab() {
  const [view, setView] = useState<"applications" | "contact_messages">("applications");
  const apps = useQuery({ queryKey: ["panel", "applications"], queryFn: async () => check(await supabase.from("applications").select("*").order("created_at", { ascending: false })) ?? [] });
  const msgs = useQuery({ queryKey: ["panel", "contact_messages"], queryFn: async () => check(await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })) ?? [] });
  const s = useSaver();
  const setStatus = (id: string, status: string) => s.run(async () => check(await supabase.from(view).update({ status }).eq("id", id)));
  const remove = (id: string, name: string) => { if (window.confirm(`“${name}” kaydı silinsin mi? Bu işlem geri alınamaz.`)) s.run(async () => check(await supabase.from(view).delete().eq("id", id))); };
  const q = view === "applications" ? apps : msgs;
  const btn = (v: typeof view, label: string, n?: number) => <Button variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>{label}{n !== undefined && ` (${n})`}</Button>;
  const Status = ({ id, value }: { id: string; value: string }) => <select aria-label="Durum" value={value} onChange={(e) => setStatus(id, e.target.value)} className={`border-0 px-2 py-1 text-xs font-bold ${statusClass[value] ?? ""}`}>{STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}</select>;
  return <>
    <div className="mt-6 flex flex-wrap gap-2">{btn("applications", "Üyelik Başvuruları", apps.data?.length)}{btn("contact_messages", "İletişim Mesajları", msgs.data?.length)}</div>
    {s.error && <p className="mt-3 text-sm text-destructive">{s.error}</p>}
    {q.isLoading ? <div className="grid place-items-center py-16"><Loader2 className="animate-spin" /></div> :
    <ul className="mt-4 divide-y divide-border border border-foreground bg-background">
      {view === "applications" ? (apps.data ?? []).map((a) => <li key={a.id} className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-semibold">{a.name}</p><p className="text-xs text-muted-foreground">{fmtDateTime(a.created_at)}</p></div>
          <div className="flex items-center gap-2"><Status id={a.id} value={a.status} /><Button size="icon" variant="ghost" aria-label="Sil" onClick={() => remove(a.id, a.name)}><Trash2 /></Button></div>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div><dt className="inline text-muted-foreground">Bölüm: </dt><dd className="inline">{a.department}</dd></div>
          <div><dt className="inline text-muted-foreground">Öğrenci no: </dt><dd className="inline">{a.student_no || "—"}</dd></div>
          <div><dt className="inline text-muted-foreground">E-posta: </dt><dd className="inline"><a className="underline" href={`mailto:${a.email}`}>{a.email}</a></dd></div>
          <div><dt className="inline text-muted-foreground">Telefon: </dt><dd className="inline">{a.phone || "—"}</dd></div>
        </dl>
        <p className="mt-3 whitespace-pre-wrap border-l-2 border-primary pl-3 text-sm"><span className="block text-xs font-semibold text-muted-foreground">Neden katılmak istiyor?</span>{a.message}</p>
      </li>) : (msgs.data ?? []).map((m) => <li key={m.id} className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-semibold">{m.subject}</p><p className="text-xs text-muted-foreground">{m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a> · {fmtDateTime(m.created_at)}</p></div>
          <div className="flex items-center gap-2"><Status id={m.id} value={m.status} /><Button size="icon" variant="ghost" aria-label="Sil" onClick={() => remove(m.id, m.subject)}><Trash2 /></Button></div>
        </div>
        <p className="mt-3 whitespace-pre-wrap border-l-2 border-primary pl-3 text-sm">{m.message}</p>
      </li>)}
      {!(q.data ?? []).length && <li className="p-6 text-sm text-muted-foreground">Henüz kayıt yok.</li>}
    </ul>}
  </>;
}

/* ---------- Aktivite Geçmişi ---------- */
function LogTab() {
  const q = useQuery({ queryKey: ["panel", "activity_log"], queryFn: async () => check(await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(300)) ?? [] });
  return <>
    <div className="mt-6"><h2 className="font-display text-2xl">Aktivite Geçmişi</h2><p className="mt-2 text-sm text-muted-foreground">Paneldeki işlemler otomatik kaydedilir. Bu kayıtlar silinemez ve değiştirilemez; son 300 işlem gösterilir.</p></div>
    {q.isLoading ? <div className="grid place-items-center py-16"><Loader2 className="animate-spin" /></div> :
    <ul className="mt-4 divide-y divide-border border border-foreground bg-background">
      {(q.data ?? []).map((l) => <li key={l.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 p-4 text-sm">
        <span className="w-44 shrink-0 text-xs text-muted-foreground">{fmtDateTime(l.created_at)}</span>
        <span className="bg-brand-pale px-2 py-0.5 text-[10px] font-bold uppercase">{l.section}</span>
        <span className="min-w-0 flex-1"><strong>{l.actor_email.split("@")[0] || "Bilinmeyen"}</strong> — {l.summary}</span>
      </li>)}
      {!(q.data ?? []).length && <li className="p-6 text-sm text-muted-foreground">Henüz kayıtlı işlem yok.</li>}
    </ul>}
  </>;
}

/* ---------- Hero Posteri ---------- */
const POSTER_FIELDS = [
  ["kicker", "Üst etiket", "Örn. YZT sunar"], ["season", "Sağ üst sezon / numara", "Örn. 26—27"],
  ["title", "Ana başlık", "Son kelime büyük yazılır. Örn. Topluluk Tanışması"], ["subtitle", "Alt başlık / dönem", "“/” ile satır bölünür. Örn. Yeni dönem / İlk buluşma"],
  ["date_text", "Tarih", "Örn. 15 Eylül"], ["time_text", "Saat", "Örn. 19.00"], ["door_text", "Saat altı not", "Örn. Kapılar 18.30 (boş bırakılabilir)"],
  ["place_text", "Yer", "Örn. Swallowe"], ["footer_left", "Alt sol metin", "Örn. Kırıkkale Üniversitesi"], ["footer_right", "Alt sağ metin", "Örn. 01 / Açılış"],
] as const;
function PosterTab({ poster }: { poster: SiteData["poster"] }) {
  const s = useSaver();
  const [saved, setSaved] = useState(false);
  if (!poster) return <p className="mt-6 text-sm text-muted-foreground">Poster bilgisi yüklenemedi.</p>;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaved(false);
    const f = new FormData(e.currentTarget);
    const row = Object.fromEntries(POSTER_FIELDS.map(([k]) => [k, String(f.get(k) ?? "").trim()]));
    s.run(async () => check(await supabase.from("hero_poster").update(row as never).eq("id", 1)), () => setSaved(true));
  }
  return <form onSubmit={submit} className="mt-6 border border-foreground bg-background p-5 sm:p-6">
    <h2 className="font-display text-2xl">Hero Posteri</h2>
    <p className="mt-2 text-sm text-muted-foreground">Ana sayfanın sağındaki poster kartı. Kaydedince hemen sitede görünür.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {POSTER_FIELDS.map(([k, label, hint]) => <Field key={k} label={label} hint={hint}><input name={k} defaultValue={poster[k]} maxLength={80} required={k !== "door_text"} className={field} /></Field>)}
    </div>
    {s.error && <p className="mt-4 text-sm text-destructive">{s.error}</p>}
    <div className="mt-5 flex items-center gap-3"><Button type="submit" disabled={s.busy}>{s.busy && <Loader2 className="animate-spin" />}Kaydet</Button>{saved && <span className="text-sm text-primary">Kaydedildi.</span>}</div>
  </form>;
}

/* ---------- Sayfa Metinleri / Site Ayarları ---------- */
type TextGroup = { title: string; fields: readonly (readonly [TextKey, string, boolean?])[] };
const TEXT_GROUPS: TextGroup[] = [
  { title: "Ana Sayfa", fields: [["home_hero_title", "Hero başlığı"], ["home_hero_text", "Hero alt açıklaması", true], ["home_features_title", "“Bir kulüpten daha fazlası” bölüm başlığı"], ["home_feat_about", "Kart: Hakkımızda"], ["home_feat_team", "Kart: Takımımız"], ["home_feat_events", "Kart: Etkinlikler"], ["home_feat_partners", "Kart: İş Ortakları"]] },
  { title: "Hakkımızda", fields: [["about_title", "Sayfa başlığı"], ["about_intro", "Başlık açıklaması", true], ["about_story", "Hikâyemiz metni", true], ["about_mission", "Misyonumuz metni", true], ["about_work_seminer", "Ne yapıyoruz: Seminerler", true], ["about_work_atolye", "Ne yapıyoruz: Atölyeler", true], ["about_work_gezi", "Ne yapıyoruz: Teknik geziler", true], ["about_work_paylasim", "Ne yapıyoruz: Paylaşım", true], ["about_value_merak", "Değer: Merak", true], ["about_value_paylasim", "Değer: Paylaşım", true], ["about_value_sorumluluk", "Değer: Sorumluluk", true]] },
  { title: "Footer", fields: [["footer_tagline", "Footer açıklaması"]] },
];
const SETTING_GROUPS: TextGroup[] = [
  { title: "Genel bilgiler", fields: [["contact_email", "İletişim e-posta adresi"], ["instagram_handle", "Instagram kullanıcı adı (örn. kku_yzt)"], ["address", "Adres"], ["slogan", "Slogan"]] },
];
function TextsTab({ texts, groups, title, note }: { texts: Record<string, string>; groups: TextGroup[]; title: string; note: string }) {
  const s = useSaver();
  const [saved, setSaved] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaved(false);
    const f = new FormData(e.currentTarget);
    const changed = groups.flatMap((g) => g.fields.map(([k]) => k)).map((k) => [k, String(f.get(k) ?? "").trim()] as const).filter(([k, v]) => v !== (texts[k] ?? ""));
    if (changed.some(([k, v]) => k === "contact_email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))) { window.alert("Geçerli bir e-posta adresi yaz."); return; }
    s.run(async () => { for (const [k, v] of changed) check(await supabase.from("site_content").update({ value: v }).eq("key", k)); }, () => setSaved(true));
  }
  return <form onSubmit={submit} className="mt-6 space-y-6">
    <div><h2 className="font-display text-2xl">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{note}</p></div>
    {groups.map((g) => <fieldset key={g.title} className="border border-foreground bg-background p-5 sm:p-6">
      <legend className="bg-primary px-2 py-1 text-xs font-bold uppercase text-primary-foreground">{g.title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {g.fields.map(([k, label, long]) => <div key={k} className={long ? "sm:col-span-2" : ""}><Field label={label}>{long
          ? <textarea name={k} defaultValue={texts[k] ?? ""} placeholder={DEFAULT_TEXT[k]} rows={k === "about_story" ? 6 : 3} maxLength={4000} className={field} />
          : <input name={k} defaultValue={texts[k] ?? ""} placeholder={DEFAULT_TEXT[k]} maxLength={300} className={field} />}</Field></div>)}
      </div>
    </fieldset>)}
    {s.error && <p className="text-sm text-destructive">{s.error}</p>}
    <div className="sticky bottom-4 flex items-center gap-3"><Button type="submit" disabled={s.busy}>{s.busy && <Loader2 className="animate-spin" />}Kaydet</Button>{saved && <span className="bg-background px-2 text-sm text-primary">Kaydedildi.</span>}</div>
  </form>;
}
