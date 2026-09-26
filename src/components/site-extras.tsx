import { useRouterState } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setShow(window.scrollY > window.innerHeight)); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <button type="button" aria-label="Sayfa başına dön" tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`scroll-top-button fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover ${show ? "is-visible" : ""}`}>
      <ArrowUp className="size-5" />
    </button>
  );
}

export function PageLoadingBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const loading = useRouterState({ select: (s) => s.isLoading });
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const first = useRef(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.clearTimeout(timer.current);
    setState("running");
    if (!loading) timer.current = window.setTimeout(() => setState("done"), 180);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) { window.clearTimeout(timer.current); setState("running"); }
    else if (state === "running") timer.current = window.setTimeout(() => setState("done"), 120);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state !== "done") return;
    const t = window.setTimeout(() => setState("idle"), 420);
    return () => window.clearTimeout(t);
  }, [state]);

  return <div aria-hidden="true" className={`page-loading-bar is-${state}`} />;
}
