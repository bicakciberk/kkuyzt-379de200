import { useEffect, useRef } from "react";

const DESKTOP_POINTER = "(hover: hover) and (pointer: fine)";

export function TiltLayer() {
  const activeTiltRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const pointer = window.matchMedia(DESKTOP_POINTER);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getActiveTilt = () => activeTiltRef.current;

    const resetTilt = () => {
      const el = getActiveTilt();
      if (!el) return;
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--tilt-lift", "0px");
      activeTiltRef.current = null;
    };
    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tilt]") : null;
      if (target !== getActiveTilt()) resetTilt();
      if (!target) return;
      activeTiltRef.current = target;
      const box = target.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
      const py = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
      target.style.setProperty("--tilt-x", `${((.5 - py) * 4.5).toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${((px - .5) * 5).toFixed(2)}deg`);
      target.style.setProperty("--tilt-lift", "-2px");
    };
    const onLeave = () => resetTilt();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      resetTilt();
    };
  }, []);

  return null;
}

export function HeroDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const position = useRef({ x: -1000, y: -1000, inside: false });
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    const pointer = window.matchMedia(DESKTOP_POINTER);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      frame.current = 0;
      const box = section.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand-mid");
      const interactive = pointer.matches && !reduced.matches && position.current.inside;
      const gap = 34;
      for (let dotX = 18; dotX < width; dotX += gap) {
        for (let dotY = 18; dotY < height; dotY += gap) {
          const distance = interactive ? Math.hypot(dotX - position.current.x, dotY - position.current.y) : 999;
          const influence = Math.max(0, 1 - distance / 150);
          context.globalAlpha = .1 + influence * .22;
          context.beginPath();
          context.arc(dotX, dotY, .75 + influence * 1.35, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
    };
    const schedule = () => { if (!frame.current) frame.current = requestAnimationFrame(draw); };
    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches) return;
      const box = section.getBoundingClientRect();
      position.current = { x: event.clientX - box.left, y: event.clientY - box.top, inside: true };
      schedule();
    };
    const onLeave = () => { position.current.inside = false; schedule(); };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    pointer.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    draw();
    return () => {
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      pointer.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-dot-grid" aria-hidden="true"/>;
}
