import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { submitForm } from "@/lib/forms";

type Field = { name: string; label: string; type?: string; placeholder: string; required?: boolean; max: number };
const base = "mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ContactForm({ membership = false, defaultSubject }: { membership?: boolean; defaultSubject?: string }) {
  const send = (args: { data: Parameters<typeof submitForm>[0] }) => submitForm(args.data);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields: Field[] = membership
    ? [
        { name: "name", label: "Ad soyad", placeholder: "Adınız ve soyadınız", required: true, max: 100 },
        { name: "studentNo", label: "Öğrenci numarası (isteğe bağlı)", placeholder: "Örn. 210206001", max: 30 },
        { name: "department", label: "Bölüm", placeholder: "Örn. Endüstri Mühendisliği", required: true, max: 120 },
        { name: "email", label: "E-posta", type: "email", placeholder: "ad.soyad@ogrenci.kku.edu.tr", required: true, max: 255 },
        { name: "phone", label: "Telefon (isteğe bağlı)", type: "tel", placeholder: "05xx xxx xx xx", max: 30 },
      ]
    : [
        { name: "name", label: "Ad soyad", placeholder: "Adınız ve soyadınız", required: true, max: 100 },
        { name: "email", label: "E-posta", type: "email", placeholder: "ornek@eposta.com", required: true, max: 255 },
        { name: "subject", label: "Konu", placeholder: "Örn. Etkinlik iş birliği", required: true, max: 150 },
      ];

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const form = new FormData(e.currentTarget);
    const v = (k: string) => String(form.get(k) || "").trim();
    const next: Record<string, string> = {};
    fields.forEach((f) => { if (f.required && !v(f.name)) next[f.name] = "Bu alanı doldurmalısın."; });
    if (v("email") && !/^\S+@\S+\.\S+$/.test(v("email"))) next["email"] = "Geçerli bir e-posta adresi yazmalısın.";
    if (!v("message")) next["message"] = "Birkaç cümle yazmalısın.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const payload = membership
        ? { kind: "membership" as const, name: v("name"), studentNo: v("studentNo"), department: v("department"), email: v("email"), phone: v("phone"), message: v("message") }
        : { kind: "contact" as const, name: v("name"), email: v("email"), subject: v("subject"), message: v("message") };
      const res = await send({ data: payload });
      if (res.ok) setSent(true); else setFormError(res.error);
    } catch {
      setFormError("Bir sorun oluştu. Bilgilerini kontrol edip tekrar dener misin?");
    } finally { setBusy(false); }
  }

  if (sent)
    return (
      <div className="border border-primary bg-primary/10 p-8" role="status">
        <CheckCircle2 className="size-8 text-primary" />
        <h2 className="mt-5 font-display text-3xl font-semibold">{membership ? "Başvurun alındı, teşekkürler!" : "Mesajın alındı, teşekkürler!"}</h2>
        <p className="mt-3 max-w-lg leading-7 text-muted-foreground">{membership ? "Ekibimiz başvurunu inceleyip kısa süre içinde seninle iletişime geçecek." : "En kısa sürede e-posta adresine dönüş yapacağız."}</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Yeni form doldur</Button>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className="text-sm font-semibold">{f.label}
            <input name={f.name} type={f.type || "text"} maxLength={f.max} placeholder={f.placeholder} defaultValue={f.name === "subject" ? defaultSubject : undefined} className={base} aria-invalid={!!errors[f.name]} aria-describedby={`${f.name}-error`} />
            {errors[f.name] && <span id={`${f.name}-error`} className="mt-1 block text-xs text-destructive">{errors[f.name]}</span>}
          </label>
        ))}
      </div>
      <label className="block text-sm font-semibold">{membership ? "Neden katılmak istiyorsun?" : "Mesajın"}
        <textarea name="message" rows={6} maxLength={membership ? 1500 : 3000} placeholder={membership ? "Merak ettiklerini, öğrenmek veya katkı sunmak istediğin alanları anlat." : "Nasıl yardımcı olabiliriz?"} className={base} aria-invalid={!!errors["message"]} />
        {errors["message"] && <span className="mt-1 block text-xs text-destructive">{errors["message"]}</span>}
      </label>
      {formError && <p role="alert" className="border-l-2 border-brand-dark bg-accent px-4 py-3 text-sm">{formError}</p>}
      <Button size="lg" type="submit" disabled={busy}>
        {busy ? "Gönderiliyor…" : membership ? "Başvuruyu gönder" : "Mesajı gönder"}
        {busy ? <Loader2 className="animate-spin" /> : <Send />}
      </Button>
    </form>
  );
}

export function YztCardForm({ onNameChange }: { onNameChange?: (value: string) => void } = {}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fields: Field[] = [
    { name: "name", label: "Ad soyad", placeholder: "Adınız ve soyadınız", required: true, max: 100 },
    { name: "studentNo", label: "Öğrenci numarası", placeholder: "Örn. 210206001", required: true, max: 30 },
    { name: "department", label: "Bölüm", placeholder: "Örn. Endüstri Mühendisliği", required: true, max: 120 },
    { name: "email", label: "E-posta", type: "email", placeholder: "ad.soyad@ogrenci.kku.edu.tr", required: true, max: 255 },
    { name: "phone", label: "Telefon", type: "tel", placeholder: "05xx xxx xx xx", required: true, max: 30 },
  ];
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setFormError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const v = (key: string) => String(form.get(key) || "").trim();
    const next: Record<string, string> = {};
    fields.forEach((item) => { if (!v(item.name)) next[item.name] = "Bu alanı doldurmalısın."; });
    if (v("email") && !/^\S+@\S+\.\S+$/.test(v("email"))) next["email"] = "Geçerli bir e-posta adresi yazmalısın.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const result = await submitForm({ kind: "yzt_card", name: v("name"), studentNo: v("studentNo"), department: v("department"), email: v("email"), phone: v("phone") });
      if (result.ok) { formEl.reset(); onNameChange?.(""); setSent(true); }
      else setFormError(result.error);
    } catch { setFormError("Başvuru gönderilirken bir sorun oluştu. Lütfen tekrar deneyin."); }
    finally { setBusy(false); }
  }
  if (sent) return <div className="border border-primary bg-primary/10 p-8" role="status"><CheckCircle2 className="size-8 text-primary"/><h2 className="mt-5 font-display text-3xl font-semibold">YZT Kart başvurun alındı!</h2><p className="mt-3 max-w-lg leading-7 text-muted-foreground">Başvurunu inceleyip kart süreciyle ilgili seninle iletişime geçeceğiz.</p><Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Yeni başvuru yap</Button></div>;
  return <form onSubmit={submit} noValidate className="space-y-5"><div className="grid gap-5 sm:grid-cols-2">{fields.map((item) => <label key={item.name} className="text-sm font-semibold">{item.label}<input name={item.name} type={item.type || "text"} maxLength={item.max} placeholder={item.placeholder} className={base} onChange={item.name === "name" ? (event) => onNameChange?.(event.target.value) : undefined} aria-invalid={!!errors[item.name]} aria-describedby={`${item.name}-card-error`}/>{errors[item.name] && <span id={`${item.name}-card-error`} className="mt-1 block text-xs text-destructive">{errors[item.name]}</span>}</label>)}</div>{formError && <p role="alert" className="border-l-2 border-brand-dark bg-accent px-4 py-3 text-sm">{formError}</p>}<Button size="lg" type="submit" disabled={busy}>{busy ? "Gönderiliyor…" : "YZT Kart başvurusu yap"}{busy ? <Loader2 className="animate-spin"/> : <Send/>}</Button></form>;
}
