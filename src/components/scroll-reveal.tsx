import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Bölümler ilk kez ekrana girerken hafifçe yukarı kayarak belirir (tek sefer). */
export function ScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const done = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.dataset["sr"] = "in";
          window.setTimeout(() => {
            el.removeAttribute("data-sr");
            el.querySelectorAll<HTMLElement>("[data-sr-item]").forEach((item) => {
              item.removeAttribute("data-sr-item");
              item.style.removeProperty("--sr-delay");
            });
          }, 1100);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("main section").forEach((section) => {
        if (done.has(section)) return;
        done.add(section);
        if (section.parentElement?.closest("main section")) return;
        // Zaten görünür olan (ör. hero) bölümleri gizleme
        if (section.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        section.dataset["sr"] = "pending";
        section.querySelectorAll<HTMLElement>(".grid").forEach((grid) => {
          Array.from(grid.children).forEach((child, i) => {
            const c = child as HTMLElement;
            c.dataset["srItem"] = "";
            c.style.setProperty("--sr-delay", `${Math.min(i, 7) * 70}ms`);
          });
        });
        io.observe(section);
      });
    };

    // Hidrasyon bitene kadar DOM'a dokunmuyoruz: içerik 600 ms boyunca sabit kalınca tarıyoruz
    let timer = 0;
    const queueScan = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 600);
    };
    queueScan();
    const mo = new MutationObserver(queueScan);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(startTimer);
      mo.disconnect();
      io.disconnect();
      document.querySelectorAll("[data-sr]").forEach((el) => el.removeAttribute("data-sr"));
    };
  }, [pathname]);

  return null;
}
