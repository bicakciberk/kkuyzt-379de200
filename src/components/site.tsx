import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Instagram, Mail, MapPin, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { launchJoinConfetti } from "@/components/join-confetti";
import { cn } from "@/lib/utils";
import { useSiteText } from "@/lib/site-text";

export const SLOGAN = "Geleceği birlikte şekillendirelim.";

export function Marquee() { const t=useSiteText(); const marqueeItems=["Merak","Üretim","Paylaşım",t.slogan.replace(/[.!]+$/,""),"Yapay zekâ","Kırıkkale"]; const items=[...marqueeItems,...marqueeItems]; return <div className="marquee border-y border-border bg-foreground py-3 text-background" aria-hidden="true"><div className="marquee-track">{items.map((x,i)=><span key={i} className="marquee-item">{x}<span className="marquee-dot">•</span></span>)}</div></div> }

export function SloganMark() { const {slogan:SLOGAN}=useSiteText(); return <div className="border-t border-border bg-background"><p className="mx-auto max-w-7xl px-5 py-7 text-center font-display text-sm italic text-muted-foreground lg:px-8">&ldquo;{SLOGAN}&rdquo;</p></div> }

const mainNav = [["/about", "Hakkımızda"], ["/team", "Takımımız"], ["/events", "Etkinlikler"], ["/resources", "Kaynaklar"], ["/contact", "İletişim"]] as const;
const moreNav = [["/games", "Mini Oyunlar"], ["/partners", "İş Ortakları"], ["/yzt-card", "YZT Kart"], ["/manifesto", "Manifesto"], ["/sponsor", "Destek Ol"], ["/faq", "SSS"]] as const;
const nav = [...mainNav.slice(0, 3), moreNav[0], mainNav[3], moreNav[1], moreNav[2], moreNav[3], moreNav[4], moreNav[5], mainNav[4]] as const;

function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { if (!open) return; const close = (e: MouseEvent | KeyboardEvent) => { if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false) }; document.addEventListener("mousedown", close); document.addEventListener("keydown", close); return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close) } }, [open]);
  const active = moreNav.some(([to]) => to === pathname);
  return <div ref={ref} className="relative"><button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true" className={cn("flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary", active ? "text-primary" : "text-foreground")}>Daha Fazla <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")}/></button>
    {open && <div className="absolute right-0 top-full mt-4 w-52 border border-foreground bg-background py-2 shadow-[6px_6px_0_var(--color-brand-pale)]">{moreNav.map(([to,label],i) => <Link key={to} to={to} className={cn("flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted hover:text-primary", pathname===to && "text-primary")}>{label}<span className="text-[10px] font-bold text-brand-light">{String(i+1).padStart(2,"0")}</span></Link>)}</div>}
  </div>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", scrolled || open ? "border-border bg-background/95 shadow-sm backdrop-blur" : "border-transparent bg-background/80")}>
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link to="/" className="group flex items-center gap-3" aria-label="YZT ana sayfa">
        <span className="grid size-10 place-items-center bg-foreground font-display text-lg font-bold text-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">YZT</span>
        <span className="hidden text-xs font-semibold leading-tight sm:block">Yapay Zeka<br/>Topluluğu</span>
      </Link>
      <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Ana menü">{mainNav.map(([to,label]) => <Link key={to} to={to} className={cn("text-sm font-medium transition-colors hover:text-primary", pathname===to ? "text-primary" : "text-foreground")}>{label}</Link>)}<MoreMenu pathname={pathname}/></nav>
      <div className="flex items-center gap-2">
        <Button asChild className="hidden sm:inline-flex"><Link to="/join" onClick={(event) => launchJoinConfetti(event.currentTarget)}>Bize Katıl <ArrowRight/></Link></Button>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menüyü kapat" : "Menüyü aç"}>{open ? <X/> : <Menu/>}</Button>
      </div>
    </div>
    {open && <div id="mobile-menu" className="border-t border-border bg-background px-5 py-5 lg:hidden"><nav className="flex flex-col" aria-label="Mobil menü">{nav.map(([to,label]) => <Link key={to} to={to} className="border-b border-border py-4 font-display text-2xl">{label}</Link>)}<Button asChild className="mt-5"><Link to="/join" onClick={(event) => launchJoinConfetti(event.currentTarget)}>Bize Katıl <ArrowRight/></Link></Button></nav></div>}
  </header>;
}

export function SiteFooter() { const t=useSiteText(); const SLOGAN=t.slogan; return <footer className="motif-section bg-foreground text-background">
  <DecorativeMotif variant="arrow" tone="cream" position="footer" size="small" speed={0.08}/>
  <div className="motif-content mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_.7fr_.8fr] lg:px-8">
    <div><span className="inline-grid size-12 place-items-center bg-primary font-display text-xl font-bold text-primary-foreground">YZT</span><h2 className="mt-5 max-w-sm font-display text-3xl">{t.footer_tagline}</h2><p className="mt-3 font-display text-lg italic text-primary">&ldquo;{SLOGAN}&rdquo;</p><p className="mt-4 max-w-md text-sm text-background/65">Kırıkkale Üniversitesi Yapay Zeka Topluluğu. Teknolojiyi birlikte anlamak ve dönüştürmek için.</p></div>
    <div><p className="text-xs font-bold uppercase text-primary">Hızlı bağlantılar</p><div className="mt-5 flex flex-col gap-3 text-sm">{nav.map(([to,label])=><Link key={to} to={to} className="hover:text-primary">{label}</Link>)}<Link to="/join" className="hover:text-primary">Üyelik</Link></div></div>
    <div><p className="text-xs font-bold uppercase text-primary">Bize ulaş</p><div className="mt-5 space-y-4 text-sm text-background/70"><a className="flex items-center gap-3 hover:text-primary" href={`mailto:${t.contact_email}`}><Mail className="size-4"/><span className="break-all">{t.contact_email}</span></a><a className="flex items-center gap-3 hover:text-primary" href={t.instagramUrl} target="_blank" rel="noreferrer"><Instagram className="size-4"/>@{t.instagram_handle}</a><p className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0"/>{t.address}</p></div></div>
  </div><div className="motif-content border-t border-background/15"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-background/50 sm:flex-row sm:justify-between lg:px-8"><p>© 2026 YZT. Tüm hakları saklıdır.</p><p>Öğrenciler tarafından, öğrenciler için.</p></div></div>
</footer> }

export function SketchArrow({ className }: { className?:string }) { return <svg viewBox="0 0 36 18" fill="none" aria-hidden="true" className={cn("w-9",className)}><path d="M2 10c8-1 17-1 29-2M24 3c3 2 6 4 8 5-3 2-6 5-9 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13c7-1 13-2 19-2" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".55"/></svg> }
export const detailLinkClass="group inline-flex h-auto items-center gap-3 border-b border-brand-light p-0 pb-1 text-sm font-bold text-brand-dark transition-colors hover:text-brand-light";
export function eventCategoryClass(tag:string){return `event-category-${tag.toLocaleLowerCase("tr-TR").replaceAll("ı","i").replaceAll("ö","o").replaceAll("ş","s").replaceAll("ü","u").replaceAll("ğ","g").replaceAll("ç","c").replaceAll(" ","-")}`}

type MotifVariant = "neuron" | "star" | "arrow" | "dots";
const introMotifs: Record<string, MotifVariant> = { "Hakkımızda":"neuron", "Takımımız":"dots", "Etkinlikler":"star", "Mini Oyunlar":"arrow", "İş Ortakları":"dots", "YZT Kart":"neuron", "Üyelik":"star", "İletişim":"neuron", "Kaynaklar":"star", "SSS":"dots", "Destek Ol":"arrow" };
export function DecorativeMotif({ variant, tone="blue", position="right", size="large", speed=.14 }: { variant:MotifVariant; tone?:"blue"|"cream"; position?:"left"|"right"|"footer"; size?:"large"|"small"; speed?:number }) { const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const element=ref.current;if(!element)return;const mobile=window.matchMedia("(max-width: 767px)");const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");let frame=0;const update=()=>{frame=0;if(mobile.matches||reduced.matches){element.style.setProperty("--motif-shift","0px");return}const sectionTop=element.parentElement?.offsetTop ?? 0;const shift=Math.max(-42,Math.min(42,(window.scrollY-sectionTop)*speed));element.style.setProperty("--motif-shift",`${shift}px`)};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};update();window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("resize",onScroll);if(frame)cancelAnimationFrame(frame)}},[speed]);return <div ref={ref} className={cn("decorative-motif",`motif-${variant}`,`motif-${tone}`,`motif-${position}`,`motif-${size}`)} aria-hidden="true"><svg viewBox="0 0 120 90" fill="none">{variant==="neuron"&&<><path d="M14 54c8-25 26-37 48-33 24 5 39 30 28 50-9 17-35 20-51 8-15-12-13-37 4-46 15-8 35 3 33 19-2 14-20 21-31 12-9-8-5-23 7-27"/><path d="M18 17l10 7M97 16l-9 9M99 72l-12-4"/></>}{variant==="star"&&<><path d="M60 12l8 25 26 1-21 15 8 25-21-15-21 15 8-25-21-15 26-1 8-25z"/><path d="M17 19l9 6M95 17l-8 8M17 72l11-5"/></>}{variant==="arrow"&&<><path d="M16 66c24-4 43-17 68-39M65 22l22 3-5 22"/><path d="M19 25c8 4 11 9 13 17M87 66c-7-1-13 2-18 8"/></>}{variant==="dots"&&<><circle cx="31" cy="28" r="3"/><circle cx="50" cy="28" r="3"/><circle cx="69" cy="28" r="3"/><circle cx="88" cy="28" r="3"/><circle cx="31" cy="47" r="3"/><circle cx="50" cy="47" r="3"/><circle cx="69" cy="47" r="3"/><circle cx="88" cy="47" r="3"/><circle cx="31" cy="66" r="3"/><circle cx="50" cy="66" r="3"/><circle cx="69" cy="66" r="3"/><circle cx="88" cy="66" r="3"/></>}</svg></div> }
export function PageIntro({ eyebrow, title, children }: { eyebrow:string; title:string; children:ReactNode }) { const key=eyebrow.split(" · ")[0] ?? "";const motif=introMotifs[key] ?? "arrow";return <section className="motif-section border-b border-border bg-background pt-36 pb-16 md:pt-44 md:pb-24"><DecorativeMotif variant={motif} position={motif==="neuron"||motif==="dots"?"right":"left"}/><div className="motif-content mx-auto max-w-7xl px-5 lg:px-8"><p className="eyebrow">{eyebrow}</p><div className="mt-5 grid gap-8 md:grid-cols-[1.25fr_.75fr] md:items-end"><h1 className="max-w-4xl font-display text-5xl leading-[.95] font-semibold sm:text-6xl lg:text-8xl">{title}</h1><div className="max-w-lg text-base leading-7 text-muted-foreground md:pb-2">{children}</div></div></div></section> }

const placeholderMarks = [
  <><path d="M14 54c8-25 26-37 48-33 24 5 39 30 28 50-9 17-35 20-51 8-15-12-13-37 4-46 15-8 35 3 33 19-2 14-20 21-31 12-9-8-5-23 7-27"/><path d="M18 17l10 7M97 16l-9 9M99 72l-12-4"/></>,
  <><path d="M60 12l8 25 26 1-21 15 8 25-21-15-21 15 8-25-21-15 26-1 8-25z"/><path d="M17 19l9 6M95 17l-8 8M17 72l11-5"/></>,
  <><path d="M16 66c24-4 43-17 68-39M65 22l22 3-5 22"/><path d="M19 25c8 4 11 9 13 17M87 66c-7-1-13 2-18 8"/></>,
  <><circle cx="31" cy="28" r="3"/><circle cx="50" cy="28" r="3"/><circle cx="69" cy="28" r="3"/><circle cx="88" cy="28" r="3"/><circle cx="31" cy="47" r="3"/><circle cx="50" cy="47" r="3"/><circle cx="69" cy="47" r="3"/><circle cx="88" cy="47" r="3"/><circle cx="31" cy="66" r="3"/><circle cx="50" cy="66" r="3"/><circle cx="69" cy="66" r="3"/><circle cx="88" cy="66" r="3"/></>,
] as const;
export function PhotoPlaceholder({ label, className, portrait=false, index=0, framed=false, showTicket=true }: { label:string; className?:string; portrait?:boolean; index?:number; framed?:boolean; showTicket?:boolean }) { const variant=Math.abs(index)%4;return <div role="img" aria-label={`${label} için fotoğraf alanı`} className={cn("editorial-placeholder relative grid overflow-hidden border border-foreground bg-placeholder text-placeholder-foreground",`placeholder-variant-${variant+1}`,portrait ? "aspect-[4/5]" : "aspect-[16/10]",framed&&"editorial-placeholder-framed",className)}><div className="absolute inset-0 placeholder-grid"/><svg viewBox="0 0 120 90" fill="none" className="placeholder-doodle" aria-hidden="true">{placeholderMarks[variant]}</svg>{showTicket&&<span className="placeholder-ticket">{String(index+1).padStart(2,"0")} / Kare</span>}<div className="relative mt-auto flex items-end justify-between gap-4 border-t border-foreground/25 p-4"><span className="max-w-[75%] text-xs font-semibold uppercase">{label}</span><span className="text-[10px] font-bold uppercase text-brand-mid">Fotoğraf yakında</span></div></div> }
export function LogoPlaceholder({ name }: {name:string}) { return <div role="img" aria-label={`${name} logo alanı`} className="grid aspect-[3/2] place-items-center border border-border bg-muted p-6 text-center"><span className="font-display text-xl font-semibold text-muted-foreground">{name}</span></div> }
export function SectionHeading({ eyebrow, title, copy, align="left", marker }: {eyebrow:string; title:string; copy?:string; align?:"left"|"right"; marker?:string}) {
  const box=useRef<HTMLDivElement>(null);
  const [drawn,setDrawn]=useState(false);
  useEffect(()=>{
    const el=box.current; if(!el) return;
    if(!("IntersectionObserver" in window)){ setDrawn(true); return; }
    const io=new IntersectionObserver((entries)=>{
      for(const entry of entries){ if(entry.isIntersecting){ setDrawn(true); io.disconnect(); } }
    },{ rootMargin:"0px 0px -10% 0px", threshold:.15 });
    io.observe(el);
    return ()=>io.disconnect();
  },[]);
  return <div ref={box} className={cn("relative grid gap-5 pt-5 md:grid-cols-[.35fr_1fr]",align==="right"&&"md:grid-cols-[1fr_.35fr]")}><span aria-hidden="true" className={cn("heading-rule",align==="right"&&"heading-rule-mid",drawn&&"is-drawn")}/><p className={cn("eyebrow",align==="right"&&"md:order-2 md:text-right")}>{eyebrow}</p><div className={cn(align==="right"&&"md:order-1 md:ml-auto md:text-right")}><div className={cn("flex items-start gap-4",align==="right"&&"md:justify-end")}>{marker&&<span className="section-marker">{marker}</span>}<h2 className="max-w-3xl font-display text-4xl leading-tight font-semibold md:text-6xl">{title}</h2></div>{copy && <p className={cn("mt-5 max-w-2xl leading-7 text-muted-foreground",align==="right"&&"md:ml-auto")}>{copy}</p>}</div></div>;
}
export function ArrowLink({to, children}:{to:"/about"|"/team"|"/events"|"/partners"|"/join"|"/contact"; children:ReactNode}) { return <Link to={to} className={detailLinkClass}>{children}<SketchArrow className="transition-transform group-hover:translate-x-1"/></Link> }
