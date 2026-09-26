import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, milestones } from "@/lib/extra-content";
import { cn } from "@/lib/utils";

export function FaqList({ limit }: { limit?: number }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return <Accordion type="single" collapsible className="faq-list border-t-2 border-foreground">
    {list.map(([q, a], i) => <AccordionItem key={q} value={`q${i}`} className="border-b border-foreground">
      <AccordionTrigger className="gap-5 py-6 text-left font-display text-xl hover:no-underline md:text-2xl">
        <span className="flex items-baseline gap-4"><span className={cn("faq-tag", `faq-tag-${i % 3}`)}>{String(i + 1).padStart(2, "0")}</span>{q}</span>
      </AccordionTrigger>
      <AccordionContent className="max-w-3xl pb-6 pl-14 text-base leading-7 text-muted-foreground">{a}</AccordionContent>
    </AccordionItem>)}
  </Accordion>;
}

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>(".timeline-item");
    if (!items) return;
    if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { threshold: 0.45, rootMargin: "0px 0px -10% 0px" });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <ol ref={ref} className="timeline relative mt-14">
    {milestones.map((m, i) => <li key={m.title} className={cn("timeline-item", i % 2 ? "timeline-right" : "timeline-left")}>
      <span className={cn("timeline-marker", `timeline-marker-${i % 3}`)} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
      <div className="timeline-card">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-light">{m.date}</p>
        <h3 className="mt-2 font-display text-3xl">{m.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{m.desc}</p>
      </div>
    </li>)}
  </ol>;
}

export function SponsorCta() {
  return <section className="border-t border-border bg-brand-pale">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
      <div><p className="eyebrow">Bize sponsor olun</p><h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-5xl">Kampüsteki en meraklı ekiple aynı karede olun.</h2></div>
      <div className="flex flex-wrap gap-3"><Button asChild><Link to="/sponsor">Destek ol <ArrowRight /></Link></Button></div>
    </div>
  </section>;
}

export function ExternalTag() { return <ArrowUpRight className="size-4" aria-hidden="true" />; }
