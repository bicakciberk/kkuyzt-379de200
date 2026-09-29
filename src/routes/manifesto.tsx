import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader, SloganMark } from "@/components/site";
import { launchJoinConfetti } from "@/components/join-confetti";

export const Route = createFileRoute("/manifesto")({
  head: () => ({
    meta: [
      { title: "Manifesto — YZT Yapay Zeka Topluluğu" },
      { name: "description", content: "Merak ederiz, deneriz, üretiriz, paylaşırız. Kırıkkale Üniversitesi Yapay Zeka Topluluğu'nun kısa manifestosu." },
      { property: "og:title", content: "YZT Manifestosu" },
      { property: "og:description", content: "Merak ederiz, deneriz, üretiriz, paylaşırız — YZT'nin dört cümlelik duruşu." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Manifesto,
});

const LINES = [
  { no: "01", word: "Merak ederiz.", text: "Sorusu olan herkes buraya sığar. Bilmemek başlangıçtır, utanç değil." },
  { no: "02", word: "Deneriz.", text: "İlk model hatalı çalışır, ikincisi biraz daha iyi. Denemeyen öğrenmez." },
  { no: "03", word: "Üretiriz.", text: "İzlemekle yetinmeyiz; kodu yazar, veriyi toplar, projeyi bitiririz." },
  { no: "04", word: "Paylaşırız.", text: "Öğrendiğimiz şey anlatılmadıkça tamamlanmaz. Bildiğimizi masaya bırakırız." },
  { no: "05", word: "Birlikte büyürüz.", text: "Kimse tek başına iyi olmak zorunda değil. Beraber daha hızlı ilerliyoruz." },
] as const;

function Line({ item, index }: { item: (typeof LINES)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return }
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: .4, rootMargin: "-8% 0px -8% 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`manifesto-line ${seen ? "is-seen" : ""} ${index % 2 ? "manifesto-line-alt" : ""}`}>
    <span className="manifesto-no">{item.no}</span>
    <h2 className="manifesto-word font-display">{item.word}</h2>
    <p className="manifesto-text">{item.text}</p>
    <span className="manifesto-rule" aria-hidden="true" />
  </div>;
}

function Manifesto() {
  return <>
    <SiteHeader />
    <main className="bg-background pt-32">
      <section className="mx-auto max-w-5xl px-5 pb-10 lg:px-8">
        <p className="eyebrow">01 · Duruşumuz</p>
        <h1 className="mt-6 font-display text-5xl leading-[.95] sm:text-6xl lg:text-7xl">YZT Manifestosu</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Beş kısa cümle. Kaydırdıkça teker teker açılıyor.</p>
        <p className="mt-10 text-xs font-bold uppercase text-primary">Aşağı kaydır ↓</p>
      </section>
      <section className="mx-auto max-w-5xl px-5 pb-24 lg:px-8">
        {LINES.map((item, i) => <Line key={item.no} item={item} index={i} />)}
      </section>
      <section className="border-t border-border bg-muted py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <p className="eyebrow">02 · Sıra sende</p>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Bu cümlelerin bir parçası olmak ister misin?</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/join" onClick={(event) => launchJoinConfetti(event.currentTarget)}>Bize Katıl <ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/about">Hakkımızda</Link></Button>
          </div>
        </div>
      </section>
    </main>
    <SloganMark />
    <SiteFooter />
  </>;
}
