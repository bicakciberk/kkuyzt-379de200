import { supabase } from "@/integrations/supabase/client";

const WEB3FORMS_KEY = "b5f97b2b-33dd-48d0-a471-8c1ca014bdaa";

export type FormPayload =
  | { kind: "membership"; name: string; studentNo: string; department: string; email: string; phone: string; message: string }
  | { kind: "contact"; name: string; email: string; subject: string; message: string }
  | { kind: "yzt_card"; name: string; studentNo: string; department: string; email: string; phone: string };

export async function submitForm(data: FormPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const validEmail = /^\S+@\S+\.\S+$/.test(data.email) && data.email.length <= 255;
  const validCommon = data.name.trim().length >= 2 && data.name.length <= 100 && validEmail;
  const valid = data.kind === "contact"
    ? validCommon && data.subject.trim().length > 0 && data.subject.length <= 150 && data.message.trim().length > 0 && data.message.length <= 3000
    : data.kind === "membership"
      ? validCommon && data.department.trim().length > 0 && data.department.length <= 120 && data.studentNo.length <= 30 && data.phone.length <= 30 && data.message.trim().length > 0 && data.message.length <= 1500
      : validCommon && data.studentNo.trim().length >= 2 && data.studentNo.length <= 30 && data.department.trim().length >= 2 && data.department.length <= 120 && data.phone.trim().length >= 5 && data.phone.length <= 30;
  if (!valid) return { ok: false, error: "Bilgilerini kontrol edip tekrar dener misin?" };
  const body =
    data.kind === "membership"
      ? {
          subject: `Yeni Topluluk Başvurusu - ${data.name}`,
          "Ad Soyad": data.name, "Öğrenci Numarası": data.studentNo || "—", "Bölüm": data.department,
          "E-posta": data.email, "Telefon": data.phone || "—", "Neden katılmak istiyorsun?": data.message,
        }
      : data.kind === "contact" ? {
          subject: `Yeni İletişim Mesajı - ${data.subject}`,
          "Ad Soyad": data.name, "E-posta": data.email, "Konu": data.subject, "Mesaj": data.message,
        } : {
          subject: `Yeni YZT Kart Başvurusu - ${data.name}`,
          "Ad Soyad": data.name, "Öğrenci Numarası": data.studentNo, "Bölüm": data.department,
          "E-posta": data.email, "Telefon": data.phone,
        };
  const fail = data.kind === "contact" ? "Mesaj gönderilirken bir sorun oluştu. Lütfen tekrar deneyin." : "Başvuru gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.";
  const saveRequest = data.kind === "membership"
    ? supabase.from("applications").insert({ name: data.name, student_no: data.studentNo, department: data.department, email: data.email, phone: data.phone, message: data.message })
    : data.kind === "contact"
      ? supabase.from("contact_messages").insert({ name: data.name, email: data.email, subject: data.subject, message: data.message })
      : supabase.from("yzt_card_applications").insert({ name: data.name, student_no: data.studentNo, department: data.department, email: data.email, phone: data.phone });
  const save = saveRequest.then((r) => !r.error, () => false);
  const mail = (async () => { try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, from_name: "YZT Web Sitesi", replyto: data.email, botcheck: "", ...body }),
    });
    const json = await res.json().catch(() => null);
    return Boolean(res.ok && json?.success);
  } catch {
    return false;
  } })();
  // Kayıt başarılıysa mail beklenmez; kayıt başarısızsa mail sonucuna (en fazla 12 sn) bakılır.
  const saved = await save;
  if (saved) return { ok: true };
  const timeout = new Promise<boolean>((r) => setTimeout(() => r(false), 12000));
  const mailed = await Promise.race([mail, timeout]);
  return mailed ? { ok: true } : { ok: false, error: fail };
}
