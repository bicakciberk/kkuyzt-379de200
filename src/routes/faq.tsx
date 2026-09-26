import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/extra-blocks";
import { PageIntro, SloganMark } from "@/components/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "Sık Sorulan Sorular — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "YZT üyeliği, ücretler, bölüm şartı ve etkinliklere katılım hakkında sık sorulan sorular." },
    { property: "og:title", content: "Sık Sorulan Sorular — YZT" },
    { property: "og:description", content: "Topluluğa katılmadan önce merak ettiklerinin kısa cevapları." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Faq,
});

function Faq() {
  return <>
    <PageIntro eyebrow="SSS · 01" title="Aklındaki sorular."><p>Katılmadan önce en çok sorulanları bir araya getirdik. Cevabını bulamazsan bize yaz.</p></PageIntro>
    <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="mb-8 flex justify-end"><span className="section-marker">02 / Sekiz soru</span></div>
      <FaqList />
      <div className="mt-12 flex flex-wrap gap-3"><Button asChild><Link to="/join">Bize Katıl <ArrowRight /></Link></Button><Button asChild variant="outline"><Link to="/contact">Soru sor</Link></Button></div>
    </section>
    <SloganMark />
  </>;
}
