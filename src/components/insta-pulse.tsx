import { Instagram, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const FEED_URL = "https://feeds.behold.so/0ljmPNpOP6GlRdpiHIXz";

type Pulse = { text: string; when: string; link: string; image: string | null };

function cleanCaption(raw: string): string {
  const firstLine = raw
    .split("\n")
    .map(line =>
      line
        .replace(/\*\*/g, "")
        .replace(/#[^\s#]+/g, "")
        .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/gu, "")
        .trim(),
    )
    .find(line => line.length > 12);
  const text = (firstLine ?? raw.replace(/\*\*/g, "").trim()).replace(/\s+/g, " ");

  return text.length > 96 ? `${text.slice(0, 95).trimEnd()}…` : text;
}

function relativeTr(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "Yeni paylaşım";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "Bugün paylaşıldı";
  if (days === 1) return "Dün paylaşıldı";
  if (days < 7) return `${days} gün önce paylaşıldı`;
  if (days < 30) return `${Math.floor(days / 7)} hafta önce paylaşıldı`;
  return new Date(then).toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + " paylaşımı";
}

export function InstaPulse() {
  const [pulse, setPulse] = useState<Pulse | null>(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    fetch(FEED_URL, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : null))
      .then((data: { posts?: { caption?: string; prunedCaption?: string; permalink?: string; timestamp?: string; thumbnailUrl?: string; mediaUrl?: string; mediaType?: string; sizes?: { small?: { mediaUrl?: string } } }[] } | null) => {
        const post = data?.posts?.[0];
        if (!alive || !post) return;
        const caption = post.prunedCaption ?? post.caption ?? "";
        setPulse({
          text: caption ? cleanCaption(caption) : "Toplulukta yeni bir paylaşım var.",
          when: relativeTr(post.timestamp ?? ""),
          link: "https://www.instagram.com/kku_yzt/",
          image: post.sizes?.small?.mediaUrl ?? post.thumbnailUrl ?? (post.mediaType === "IMAGE" ? post.mediaUrl ?? null : null),
        });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  if (!pulse) return null;

  return (
    <a
      href={pulse.link}
      target="_blank"
      rel="noreferrer"
      className="insta-pulse group"
      aria-label={`Instagram'daki son paylaşım: ${pulse.text}`}
    >
      <span className="insta-pulse-live">
        <span className="insta-pulse-dot" aria-hidden="true" />
        Canlı akış
      </span>
      {pulse.image && (
        <img src={pulse.image} alt="" aria-hidden="true" className="insta-pulse-thumb" loading="lazy" />
      )}
      <span className="insta-pulse-when">{pulse.when}</span>
      <span className="insta-pulse-text">{pulse.text}</span>
      <span className="insta-pulse-cta">
        <Instagram className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">İncele</span>
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </span>
    </a>
  );
}
