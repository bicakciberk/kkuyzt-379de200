import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, LogOut, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { STORAGE_PREFIX, getSiteData } from "@/lib/site-data.functions";
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
    try { await fn(); await qc.invalidateQueries({ queryKey: siteDataQuery.queryKey }); done?.(); }
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
          </TabsList>
          <TabsContent value="events"><EventsTab events={data.events} /></TabsContent>
          <TabsContent value="team"><TeamTab team={data.team} /></TabsContent>
          <TabsContent value="social"><SocialTab posts={data.posts} /></TabsContent>
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
