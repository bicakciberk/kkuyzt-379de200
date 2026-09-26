import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SloganMark, PageIntro, PhotoPlaceholder } from "@/components/site";
import { siteDataQuery, toTeam } from "@/lib/site-data";

function Portrait({ name, photo, index }: { name: string; photo: string | null; index: number }) {
  return <div className="relative border border-foreground p-1">{photo ? <img src={photo} alt={`${name} portresi`} className="aspect-[4/5] w-full object-cover" loading="lazy" /> : <PhotoPlaceholder label={`${name} portresi`} portrait framed index={index} showTicket={false} />}<span className={`placeholder-ticket team-ticket team-ticket-${index % 3}`}>{String(index + 1).padStart(2, "0")} / Ekip</span></div>;
}

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Takımımız — YZT · Geleceği Birlikte Şekillendirelim" }, { name: "description", content: "YZT departmanları ve ekip üyeleri." }, { property: "og:title", content: "Takımımız — YZT" }, { property: "og:description", content: "YZT'yi birlikte büyüten öğrenci ekibi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  component: Team,
});

function Team() {
  const { data } = useSuspenseQuery(siteDataQuery);
  const { leaders, groups } = toTeam(data.team);
  let n = leaders.length;
  const starts = groups.map((g) => { const s = n; n += g.members.length; return s; });
  return <><PageIntro eyebrow="Takımımız · 01" title="Dört departman, ortak bir merak."><p>Dış ilişkilerden organizasyona, sosyal medyadan tanıtıma kadar her adımı gönüllü öğrenciler birlikte yürütüyor.</p></PageIntro>
    <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      {leaders.length > 0 && <section className="border-b-2 border-brand-mid pb-16"><div className="flex items-center gap-4"><p className="eyebrow">Topluluk Başkanı</p><span className="section-marker">02</span></div><div className="mt-8 flex flex-wrap gap-8">{leaders.map((l, i) => <article key={l.id} data-tilt="team" className="premium-tilt w-full max-w-[280px] border-l-4 border-primary pl-4"><Portrait name={l.name} photo={l.photo} index={i} /><h2 className="mt-5 font-display text-3xl">{l.name}</h2><p className="mt-1 text-sm font-bold text-brand-dark">{l.role}</p><p className="mt-1 text-sm text-muted-foreground">{l.program}</p></article>)}</div></section>}
      {groups.map((g, gi) => <section key={g.group} className="mt-24"><div className={`flex items-end justify-between border-b pb-5 ${gi % 2 ? "border-brand-mid flex-row-reverse text-right" : "border-foreground"}`}><h2 className="font-display text-3xl md:text-5xl">{g.group}</h2><span className={`section-marker marker-variant-${gi % 3 + 1}`}>{String(gi + 3).padStart(2, "0")}</span></div>
        <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{g.members.map((m, mi) => <article key={m.id} data-tilt="team" className={`premium-tilt ${mi % 2 ? "team-card-offset" : ""}`}><Portrait name={m.name} photo={m.photo} index={(starts[gi] ?? 0) + mi} /><h3 className="mt-5 font-display text-2xl">{m.name}</h3><p className="mt-1 text-sm font-bold text-primary">{m.role}</p><p className="mt-1 text-sm text-muted-foreground">{m.program}</p></article>)}</div></section>)}
    </div><SloganMark /></>;
}
