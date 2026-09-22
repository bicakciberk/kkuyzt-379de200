import { CheckCircle2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type Field = {name:string; label:string; type?:string; placeholder:string; required?:boolean};
const base="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
export function ContactForm({membership=false}:{membership?:boolean}) {
 const [sent,setSent]=useState(false); const [errors,setErrors]=useState<Record<string,string>>({});
 const fields:Field[]=membership ? [
  {name:"name",label:"Ad soyad",placeholder:"Adınız ve soyadınız",required:true},
  {name:"department",label:"Bölüm",placeholder:"Örn. Bilgisayar Mühendisliği",required:true},
  {name:"email",label:"E-posta",type:"email",placeholder:"ad.soyad@ogrenci.kku.edu.tr",required:true},
  {name:"phone",label:"Telefon",type:"tel",placeholder:"05xx xxx xx xx",required:true},
 ] : [{name:"name",label:"Ad soyad",placeholder:"Adınız ve soyadınız",required:true},{name:"email",label:"E-posta",type:"email",placeholder:"ornek@eposta.com",required:true}];
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=new FormData(e.currentTarget);const next:Record<string,string>={};fields.forEach(f=>{if(f.required&&!String(form.get(f.name)||"").trim())next[f.name]="Bu alanı doldurmalısın."});const email=String(form.get("email")||"");if(email&&!/^\S+@\S+\.\S+$/.test(email))next["email"]="Geçerli bir e-posta adresi yazmalısın.";const message=String(form.get("message")||"").trim();if(!message)next["message"]="Birkaç cümle yazmalısın.";setErrors(next);if(Object.keys(next).length===0)setSent(true)}
 if(sent)return <div className="border border-primary bg-primary/10 p-8" role="status"><CheckCircle2 className="size-8 text-primary"/><h2 className="mt-5 font-display text-3xl font-semibold">{membership?"Başvurun hazır!":"Mesajın hazır!"}</h2><p className="mt-3 max-w-lg leading-7 text-muted-foreground">Bu demo formu veri göndermiyor. Gerçek bağlantı eklendiğinde aynı başarılı akışla bize ulaşacak.</p><Button variant="outline" className="mt-6" onClick={()=>setSent(false)}>Yeni form doldur</Button></div>;
 return <form onSubmit={submit} noValidate className="space-y-5"> <div className="grid gap-5 sm:grid-cols-2">{fields.map(f=><label key={f.name} className="text-sm font-semibold">{f.label}<input name={f.name} type={f.type||"text"} placeholder={f.placeholder} className={base} aria-invalid={!!errors[f.name]} aria-describedby={`${f.name}-error`}/>{errors[f.name]&&<span id={`${f.name}-error`} className="mt-1 block text-xs text-destructive">{errors[f.name]}</span>}</label>)}</div><label className="block text-sm font-semibold">{membership?"Neden YZT’ye katılmak istiyorsun?":"Mesajın"}<textarea name="message" rows={6} placeholder={membership?"Merak ettiklerini, öğrenmek veya katkı sunmak istediğin alanları anlat.":"Nasıl yardımcı olabiliriz?"} className={base} aria-invalid={!!errors["message"]}/>{errors["message"]&&<span className="mt-1 block text-xs text-destructive">{errors["message"]}</span>}</label><Button size="lg" type="submit">{membership?"Başvuruyu tamamla":"Mesajı hazırla"}<Send/></Button></form>
}
