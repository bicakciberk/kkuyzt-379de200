import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PageIntro, SloganMark } from "@/components/site";
import { sponsorReasons, sponsorTiers } from "@/lib/extra-content";

export const Route = createFileRoute("/sponsor")({
  head: () => ({ meta: [
    { title: "Topluluğa Destek Ol — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "Şirketler için YZT sponsorluk seviyeleri: Destekçi, Kurumsal Ortak ve Ana Sponsor. Genç yeteneklerle tanışın." },
    { property: "og:title", content: "Topluluğa Destek Ol — YZT" },
    { property: "og:description", content: "Kırıkkale Üniversitesi Yapay Zeka Topluluğu'na sponsor olun." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Sponsor,
});

function Sponsor() {
  return <>
    <PageIntro eyebrow="Destek Ol · 01" title="Topluluğa destek ol."><p>Şirketlere yönelik sponsorluk seçeneklerimiz. Katkınız atölyelere, konuklara ve öğrencilerin ilk projelerine dönüşür.</p></PageIntro>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <p className="eyebrow">Neden sponsor olmalı · 02</p>
      <div className="mt-10 grid border border-foreground md:grid-cols-2">
        {sponsorReasons.map(([t, d], i) => <div key={t} className={`p-8 ${i % 2 === 0 ? "md:border-r" : ""} ${i < 2 ? "border-b" : i === 2 ? "border-b md:border-b-0" : ""} border-foreground`}>
          <span className="font-display text-5xl text-brand-light">{String(i + 1).padStart(2, "0")}</span>
          <h2 className="mt-4 font-display text-3xl">{t}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{d}</p>
        </div>)}
      </div>
    </section>
    <section className="bg-muted py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Seviyeler · 03</p><h2 className="mt-4 font-display text-4xl md:text-6xl">Size uyan katkı.</h2></div><span className="section-marker hidden sm:inline-block">Üç paket</span></div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-start">
        {sponsorTiers.map((t) => <article key={t.name} className={`relative border border-foreground p-8 ${t.featured ? "bg-foreground text-background lg:-mt-4 lg:pb-12" : "bg-background"}`}>
          <span className={`absolute -top-3 right-6 px-2 py-1 text-[10px] font-bold uppercase ${t.featured ? "rotate-2 bg-brand-light text-background" : "-rotate-2 bg-brand-dark text-background"}`}>{t.tag} · {t.featured ? "Önerilen" : "Paket"}</span>
          <h3 className="font-display text-3xl">{t.name}</h3>
          <ul className="mt-6 space-y-3">{t.perks.map((p) => <li key={p} className="flex gap-3 text-sm leading-6"><Check className={`mt-0.5 size-4 shrink-0 ${t.featured ? "text-poster-accent" : "text-brand-light"}`} />{p}</li>)}</ul>
        </article>)}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Paket içerikleri ihtiyaca göre birlikte şekillendirilir; bütçe ve detaylar için bize yazın.</p>
    </div></section>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-28">
      <div className="border-l-2 border-primary pl-5"><p className="eyebrow">İletişim · 04</p><h2 className="mt-4 font-display text-4xl">Konuşmaya başlayalım.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Formu doldurun, Dış İlişkiler ekibimiz birkaç gün içinde size dönsün.</p></div>
      <ContactForm defaultSubject="Sponsorluk görüşmesi" />
    </section>
    <SloganMark />
  </>;
}
