import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const PANEL_PATH = "/yzt-yonetim-k7x2" as const;

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Giriş — YZT Yönetim" }, { name: "robots", content: "noindex, nofollow" },
    { name: "description", content: "YZT yönetim paneli girişi." }, { property: "og:title", content: "Giriş — YZT Yönetim" },
    { property: "og:description", content: "YZT yönetim paneli girişi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

const input = "mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: PANEL_PATH, replace: true }); }); }, [navigate]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim(); const password = String(f.get("password") ?? "");
    if (!email || !password) { setError("E-posta ve şifreyi doldur."); return; }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) { setError("E-posta ya da şifre hatalı."); return; }
    navigate({ to: PANEL_PATH, replace: true });
  }
  return <section className="grid min-h-screen place-items-center bg-muted px-5 pt-24 pb-16">
    <form onSubmit={submit} className="w-full max-w-md border border-foreground bg-background p-8" noValidate>
      <span className="inline-grid size-11 place-items-center bg-primary text-primary-foreground"><LockKeyhole className="size-5" /></span>
      <h1 className="mt-5 font-display text-4xl">Yönetim girişi</h1>
      <p className="mt-2 text-sm text-muted-foreground">Yalnızca YZT ekibi için.</p>
      <label className="mt-6 block text-sm font-semibold">E-posta<input name="email" type="email" autoComplete="email" className={input} /></label>
      <label className="mt-4 block text-sm font-semibold">Şifre<input name="password" type="password" autoComplete="current-password" className={input} /></label>
      {error && <p role="alert" className="mt-4 border-l-2 border-brand-dark pl-3 text-sm text-brand-dark">{error}</p>}
      <Button type="submit" disabled={busy} className="mt-6 w-full">{busy ? <><Loader2 className="animate-spin" />Giriş yapılıyor...</> : "Giriş yap"}</Button>
    </form>
  </section>;
}
