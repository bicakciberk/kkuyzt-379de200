import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/extra-content";
import type { Database } from "@/integrations/supabase/types";
import { useSiteText } from "@/lib/site-text";
import { cn } from "@/lib/utils";

export function FaqList({ limit }: { limit?: number }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return <Accordion type="single" collapsible className="faq-list border-t border-foreground">
    {list.map(([q, a], i) => <AccordionItem key={q} value={`q${i}`} className="border-b border-foreground">
      <AccordionTrigger className="gap-5 py-6 text-left text-base font-semibold hover:no-underline md:text-lg">
        <span>{q}</span>
      </AccordionTrigger>
      <AccordionContent className="max-w-3xl pb-6 text-base leading-7 text-muted-foreground">{a}</AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}

export function Timeline({ milestones }: { milestones: Pick<Database["public"]["Tables"]["timeline_milestones"]["Row"], "id" | "period" | "title" | "description">[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>(".timeline-item");
    if (!items) return;
    if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { threshold: 0.45, rootMargin: "0px 0px -10% 0px" });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [milestones]);
  return <ol ref={ref} className="timeline relative mt-14">
    {milestones.map((m, i) => <li key={m.id} className={cn("timeline-item", i % 2 ? "timeline-right" : "timeline-left")}>
      <span className={cn("timeline-marker", `timeline-marker-${i % 3}`)} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
      <div className="timeline-card">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-light">{m.period}</p>
        <h3 className="mt-2 font-sans text-3xl">{m.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{m.description}</p>
      </div>
    </li>)}
  </ol>;
}

export function SponsorCta() {
  const t = useSiteText();
  return <section className="border-t border-border bg-brand-pale">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
      <div><p className="text-sm font-semibold text-brand-dark">Kurumsal iş birlikleri</p><h2 className="mt-3 max-w-4xl font-display text-4xl leading-tight md:text-5xl">{t.about_stat1_value} üyeye ulaşın; {t.about_stat2_value} etkinliğin atölye, konuşmacı ve üretim ortağı olun.</h2><p className="mt-4 max-w-3xl leading-7 text-muted-foreground">Markanızı kampüs buluşmalarında, etkinlik iletişiminde ve öğrenci projelerinde görünür kılan ölçülebilir destek paketleri hazırlıyoruz.</p></div>
      <div className="flex flex-wrap gap-3"><Button asChild><Link to="/sponsor">Destek ol <ArrowRight /></Link></Button></div>
    </div>
  </section>;
}

export function ExternalTag() { return <ArrowUpRight className="size-4" aria-hidden="true" />; }
