import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const s = (max: number) => z.string().trim().max(max);
const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("membership"),
    name: s(100).min(1), studentNo: s(30).optional().default(""), department: s(120).min(1),
    email: s(255).email(), phone: s(30).optional().default(""), message: s(1500).min(1),
  }),
  z.object({
    kind: z.literal("contact"),
    name: s(100).min(1), email: s(255).email(), subject: s(150).min(1), message: s(3000).min(1),
  }),
]);

const hits = new Map<string, number[]>();

export const submitForm = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const now = Date.now();
    const key = data.email.toLowerCase();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
    if (recent.length >= 3) return { ok: false as const, error: "Çok kısa sürede fazla gönderim yaptın. Biraz sonra tekrar dene." };
    hits.set(key, [...recent, now]);

    const fields = data.kind === "membership"
      ? [
          { label: "Ad Soyad", value: data.name }, { label: "Öğrenci numarası", value: data.studentNo },
          { label: "Bölüm", value: data.department }, { label: "E-posta", value: data.email },
          { label: "Telefon", value: data.phone }, { label: "Neden katılmak istiyorsun?", value: data.message },
        ]
      : [
          { label: "Ad Soyad", value: data.name }, { label: "E-posta", value: data.email },
          { label: "Konu", value: data.subject }, { label: "Mesaj", value: data.message },
        ];
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("form-notification", "Kkuyapayzekatoplulugu71@gmail.com", {
        templateData: { kind: data.kind, name: data.name, subject: data.kind === "contact" ? data.subject : undefined, fields },
        idempotencyKey: `form-notification-${crypto.randomUUID()}`,
        replyTo: data.email,
      });
      return { ok: true as const };
    } catch (e) {
      console.error("form email failed", e);
      return { ok: false as const, error: "Şu an gönderemedik. Lütfen biraz sonra tekrar dene." };
    }
  });
