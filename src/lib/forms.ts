const WEB3FORMS_KEY = "b5f97b2b-33dd-48d0-a471-8c1ca014bdaa";

export type FormPayload =
  | { kind: "membership"; name: string; studentNo: string; department: string; email: string; phone: string; message: string }
  | { kind: "contact"; name: string; email: string; subject: string; message: string };

export async function submitForm(data: FormPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const body =
    data.kind === "membership"
      ? {
          subject: `Yeni Topluluk Başvurusu - ${data.name}`,
          "Ad Soyad": data.name, "Öğrenci Numarası": data.studentNo || "—", "Bölüm": data.department,
          "E-posta": data.email, "Telefon": data.phone || "—", "Neden katılmak istiyorsun?": data.message,
        }
      : {
          subject: `Yeni İletişim Mesajı - ${data.subject}`,
          "Ad Soyad": data.name, "E-posta": data.email, "Konu": data.subject, "Mesaj": data.message,
        };
  const fail = data.kind === "membership"
    ? "Başvuru gönderilirken bir sorun oluştu. Lütfen tekrar deneyin."
    : "Mesaj gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.";
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, from_name: "YZT Web Sitesi", replyto: data.email, botcheck: "", ...body }),
    });
    const json = await res.json().catch(() => null);
    return res.ok && json?.success ? { ok: true } : { ok: false, error: fail };
  } catch {
    return { ok: false, error: fail };
  }
}
