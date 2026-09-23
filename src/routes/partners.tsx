import { createFileRoute } from "@tanstack/react-router";
import { Armchair, BadgePercent, BookOpen, Code2, Coffee, Pencil, Printer, type LucideIcon } from "lucide-react";
import { PageIntro } from "@/components/site";

export const Route=createFileRoute("/partners")({head:()=>({meta:[{title:"İş Ortakları — YZT"},{name:"description",content:"YZT üyelerine avantaj sağlayan iş ortakları."},{property:"og:title",content:"İş Ortakları — YZT"},{property:"og:description",content:"Topluluğumuzu destekleyen yerel iş ortakları."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Partners});

const partners:[string,string,string,LucideIcon][]=[
  ["Kampüs Kahve","Tüm içeceklerde %15 üye indirimi","Kahve",Coffee],
  ["Kitap Durağı","Teknik kitaplarda %10 indirim","Kitap",BookOpen],
  ["Piksel Baskı","Topluluk üyelerine özel baskı fiyatı","Baskı",Printer],
  ["Rota Kafe","Çalışma alanı ve menüde %12 indirim","Çalışma",Armchair],
  ["Kod Atölyesi","Seçili eğitimlerde %20 indirim","Kod",Code2],
  ["Kare Kırtasiye","Kırtasiye ürünlerinde %10 indirim","Kırtasiye",Pencil],
];
const accents=[
  {badge:"bg-brand-light text-background",line:"bg-brand-light",icon:"text-brand-light",position:"top-6 right-6 rotate-3"},
  {badge:"bg-brand-mid text-background",line:"bg-brand-mid",icon:"text-brand-mid",position:"top-6 left-6 -rotate-2"},
  {badge:"bg-brand-dark text-background",line:"bg-brand-dark",icon:"text-brand-dark",position:"top-6 right-6 rotate-2"},
  {badge:"bg-brand-pale text-brand-dark",line:"bg-brand-light",icon:"text-brand-light",position:"top-8 right-8 -rotate-3"},
  {badge:"bg-brand-light text-background",line:"bg-brand-dark",icon:"text-brand-dark",position:"top-6 left-6 rotate-3"},
  {badge:"bg-brand-dark text-background",line:"bg-brand-mid",icon:"text-brand-mid",position:"top-6 left-1/2 -translate-x-1/2 -rotate-2"},
] as const;

function PartnerMark({name,category,Icon,index}:{name:string;category:string;Icon:LucideIcon;index:number}){const accent=accents[index] ?? accents[0];return <div role="img" aria-label={`${name} logo alanı`} className={`relative grid aspect-[3/2] place-items-center overflow-hidden border border-foreground bg-muted p-6 text-center ${index%2?"border-b-4":"border-t-4"}`}><div className={`absolute ${index%2?"right-5 top-5":"bottom-5 left-5"} grid grid-cols-3 gap-1 opacity-35`} aria-hidden="true">{Array.from({length:9},(_,dot)=><i key={dot} className={`size-1 ${accent.line}`}/>)}</div><span className={`absolute z-10 px-2 py-1 text-[10px] font-bold uppercase ${accent.badge} ${accent.position}`}>{String(index+1).padStart(2,"0")} · {category}</span><Icon className={`size-12 ${accent.icon}`} strokeWidth={1.35}/><span className="absolute bottom-4 right-4 max-w-[55%] font-display text-lg font-semibold leading-tight text-muted-foreground">{name}</span></div>}

function Partners(){return <><PageIntro eyebrow="İş Ortakları · 01" title="Yerel destek, ortak değer."><p>Topluluğumuzun üretim alanını büyüten ve üyelerimize günlük hayatta küçük avantajlar sağlayan destekçilerimiz.</p></PageIntro><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 flex justify-end"><span className="section-marker">02 / Altı durak</span></div><div className="grid border border-foreground sm:grid-cols-2 lg:grid-cols-3">{partners.map(([name,description,category,Icon],index)=>{const accent=accents[index] ?? accents[0];return <article key={name} className={`relative bg-background p-6 ${index%3<2?'lg:border-r border-foreground':''} ${index<3?'border-b border-foreground':''}`}><PartnerMark name={name} category={category} Icon={Icon} index={index}/><div className={`mt-6 flex gap-3 ${index%2?"flex-row-reverse text-right":""}`}><BadgePercent className={`mt-0.5 size-5 shrink-0 ${accent.icon}`} strokeWidth={1.5}/><div><h2 className="font-display text-2xl">{name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p><span className={`mt-4 block h-px w-12 ${accent.line} ${index%2?"ml-auto":""}`}/></div></div></article>})}</div><p className="mt-8 max-w-2xl border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">Avantajlardan yararlanmak için güncel YZT üyeliğini göstermen yeterli. Koşullar işletmeye göre değişebilir.</p></section></>}