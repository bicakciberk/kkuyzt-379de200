import { useQuery } from "@tanstack/react-query";
import { siteDataQuery } from "@/lib/site-data";

export const DEFAULT_TEXT = {
  home_hero_title: "Geleceği birlikte şekillendirelim.",
  home_hero_text: "Merak eden, üreten ve öğrendiğini paylaşan öğrenciler için açık bir topluluk.",
  home_features_title: "Bir kulüpten daha fazlası.",
  home_feat_about: "Neden varız, neye inanıyoruz?",
  home_feat_team: "Endüstri Mühendisliği'nden üretken bir ekip.",
  home_feat_events: "Seminer, atölye, gezi ve daha fazlası.",
  home_feat_partners: "Topluluğumuza değer katan destekçiler.",
  about_title: "Teknolojiyi uzaktan izlemiyoruz.",
  about_intro: "YZT, yapay zekâyı yalnızca konuşulan bir başlık olmaktan çıkarıp deneyimlenen bir alana dönüştüren öğrenci topluluğu.",
  about_story: "Bir soruyla başladı: “Neden birlikte öğrenmiyoruz?” Farklı bölümlerden öğrencileri aynı masada buluşturmak için yola çıktık, çünkü yapay zekânın geleceği tek bir disipline sığmıyor.\n\nBugün seminerler, teknik geziler ve uygulamalı atölyeler düzenliyor; öğrencilerin fikirlerini güvenle sınayabilecekleri bir alan kuruyoruz.",
  about_mission: "Merakı bilgiye, bilgiyi üretime, üretimi birlikte büyüyen bir kültüre dönüştürmek.",
  about_work_seminer: "Akademi ve sektörden konuklarla yeni fikirleri anlaşılır, samimi buluşmalara taşıyoruz.",
  about_work_atolye: "Sadece dinlemiyor; kodluyor, deniyor, bozuyor ve birlikte yeniden kuruyoruz.",
  about_work_gezi: "Teknolojinin üretildiği ekipleri yerinde tanıyor, çalışma kültürlerini gözlemliyoruz.",
  about_work_paylasim: "Öğrendiğimizi açık kaynaklarla, notlarla ve akran desteğiyle çoğaltıyoruz.",
  about_value_merak: "Bilmediğimizi saklamıyor, doğru soruyu birlikte arıyoruz.",
  about_value_paylasim: "Bilgiyi ayrıcalık değil, çoğaldıkça değerlenen bir kaynak görüyoruz.",
  about_value_sorumluluk: "Teknolojiyi etkileriyle birlikte düşünüyor, etik tartışmalara alan açıyoruz.",
  footer_tagline: "Merak eden, üreten ve paylaşan öğrenciler.",
  contact_email: "Kkuyapayzekatoplulugu71@gmail.com",
  instagram_handle: "kku_yzt",
  address: "Kırıkkale Üniversitesi, Yahşihan / Kırıkkale",
  slogan: "Geleceği birlikte şekillendirelim.",
};
export type TextKey = keyof typeof DEFAULT_TEXT;

/** Site texts from the database, falling back to defaults for empty/missing values. */
export function useSiteText() {
  const { data } = useQuery(siteDataQuery);
  const t = { ...DEFAULT_TEXT };
  for (const k of Object.keys(t) as TextKey[]) { const v = data?.texts?.[k]?.trim(); if (v) t[k] = v; }
  const handle = t.instagram_handle.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, "");
  return { ...t, instagram_handle: handle, instagramUrl: `https://instagram.com/${handle}`, paragraphs: (k: TextKey) => t[k].split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) };
}
