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

export function HeroCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    const pointer = window.matchMedia(DESKTOP_POINTER);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = canvas.getContext("2d");
    if (!context) return;
    type TrailPoint = { x: number; y: number; time: number };
    let points: TrailPoint[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    const lifetime = 900;

    const resize = () => {
      const box = section.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.round(box.width);
      height = Math.round(box.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const drawSegment = (start: TrailPoint, control: TrailPoint, end: TrailPoint, alpha: number, glow: boolean) => {
      context.globalAlpha = alpha;
      context.lineWidth = glow ? 2.4 : 1.15;
      context.shadowBlur = glow ? 8 : 0;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.quadraticCurveTo(control.x, control.y, end.x, end.y);
      context.stroke();
    };
    const draw = (now: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      points = points.filter((point) => now - point.time < lifetime);
      if (points.length > 1) {
        context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand-light").trim();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.shadowColor = getComputedStyle(document.documentElement).getPropertyValue("--brand-mid").trim();
        for (let index = 0; index < points.length - 1; index += 1) {
          const current = points[index];
          const next = points[index + 1];
          if (!current || !next) continue;
          const previous = points[index - 1] ?? current;
          const start = { ...current, x: (previous.x + current.x) / 2, y: (previous.y + current.y) / 2 };
          const end = { ...next, x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
          const alpha = Math.max(0, 1 - (now - next.time) / lifetime);
          drawSegment(start, current, end, alpha * .2, true);
          drawSegment(start, current, end, alpha * .74, false);
        }
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (points.length) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
      const box = section.getBoundingClientRect();
      const point = { x: event.clientX - box.left, y: event.clientY - box.top, time: performance.now() };
      const last = points.at(-1);
      if (!last || Math.hypot(point.x - last.x, point.y - last.y) >= 2) points.push(point);
      schedule();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(section);
    resize();
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-cursor-trail" aria-hidden="true"/>;
}
