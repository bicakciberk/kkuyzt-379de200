import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string; note: string };

/** Splits "450+" into prefix "", number 450, suffix "+" so the digits can count up. */
function parse(value: string) {
  const m = value.match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
  if (!m || !m[2]) return null;
  const digits = m[2].replace(/[.,]/g, "");
  const target = Number(digits);
  if (!Number.isFinite(target)) return null;
  return { prefix: m[1] ?? "", target, suffix: m[3] ?? "" };

}

function Counter({ value, run }: { value: string; run: boolean }) {
  const parsed = parse(value);
  const [n, setN] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!parsed || !run || reduce) return;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(parsed.target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value, reduce]);
  if (!parsed) return <>{value}</>;
  if (reduce || !run) return <>{value}</>;
  return <>{parsed.prefix}{n}{parsed.suffix}</>;
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setRun(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const items = stats.filter((s) => s.value.trim() && s.label.trim());
  if (!items.length) return null;
  return <div ref={ref} className="mt-12 grid border-t border-foreground sm:grid-cols-2 lg:grid-cols-4">
    {items.map((s, i) => <div key={s.label} className={`border-foreground px-5 py-8 lg:px-7 ${i < items.length - 1 ? "border-b sm:border-b-0 lg:border-r" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 2 ? "sm:border-b lg:border-b-0" : ""}`}>
      <p className="font-display text-5xl leading-none text-brand-dark md:text-6xl lg:text-7xl"><Counter value={s.value} run={run} /></p>
      <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.14em]">{s.label}</h3>
      {s.note && <p className="mt-3 text-sm leading-6 text-muted-foreground">{s.note}</p>}
    </div>)}
  </div>;
}
