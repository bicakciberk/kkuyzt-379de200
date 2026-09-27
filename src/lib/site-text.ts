import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
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
  about_work_seminer_stat: "",
  about_work_atolye: "Sadece dinlemiyor; kodluyor, deniyor, bozuyor ve birlikte yeniden kuruyoruz.",
  about_work_atolye_stat: "",
  about_work_gezi: "Teknolojinin üretildiği ekipleri yerinde tanıyor, çalışma kültürlerini gözlemliyoruz.",
  about_work_gezi_stat: "",
  about_work_paylasim: "Öğrendiğimizi açık kaynaklarla, notlarla ve akran desteğiyle çoğaltıyoruz.",
  about_work_paylasim_stat: "",
  about_stats_title: "Rakamlarla YZT",
  about_stat1_value: "450+",
  about_stat1_label: "Topluluk üyesi",
  about_stat1_note: "Farklı bölümlerden, merak eden ve üreten öğrenciler.",
  about_stat2_value: "16",
  about_stat2_label: "Atölye & seminer",
  about_stat2_note: "Uygulamalı yapay zekâ oturumları ve konuk buluşmaları.",
  about_stat3_value: "4",
  about_stat3_label: "Teknik gezi",
  about_stat3_note: "Teknoloji ekiplerini ve AR-GE merkezlerini yerinde gördük.",
  about_stat4_value: "%100",
  about_stat4_label: "Açık katılım",
  about_stat4_note: "Tüm bölümlere ücretsiz ve ön koşulsuz.",

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
  // The shared footer renders outside the home route loader. Keep its first
  // client render identical to SSR before applying the hydrated query cache.
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const t = { ...DEFAULT_TEXT };
  for (const k of Object.keys(t) as TextKey[]) { const v = hydrated ? data?.texts?.[k]?.trim() : undefined; if (v) t[k] = v; }
  const handle = t.instagram_handle.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, "");
  return { ...t, instagram_handle: handle, instagramUrl: `https://instagram.com/${handle}`, paragraphs: (k: TextKey) => t[k].split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) };
}
