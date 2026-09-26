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
    type TrailParticle = { x: number; y: number; time: number; size: number; glow: number };
    let particles: TrailParticle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let lastPoint: { x: number; y: number } | null = null;
    let seed = 0;
    const lifetime = 420;

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
    const draw = (now: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      particles = particles.filter((particle) => now - particle.time < lifetime);
      const styles = getComputedStyle(document.documentElement);
      context.fillStyle = styles.getPropertyValue("--brand-light").trim();
      context.shadowColor = styles.getPropertyValue("--brand-mid").trim();
      for (const particle of particles) {
        const life = Math.max(0, 1 - (now - particle.time) / lifetime);
        const easedLife = life * life;
        context.globalAlpha = easedLife * particle.glow * .78;
        context.shadowBlur = 3 + particle.size * 3.5;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * (.55 + life * .45), 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.shadowBlur = 0;
      if (particles.length) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
      const box = section.getBoundingClientRect();
      const point = { x: event.clientX - box.left, y: event.clientY - box.top, time: performance.now() };
      const distance = lastPoint ? Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) : 0;
      const steps = lastPoint ? Math.min(18, Math.max(1, Math.ceil(distance / 6))) : 1;
      for (let index = 1; index <= steps; index += 1) {
        const progress = index / steps;
        seed += 1;
        const baseX = lastPoint ? lastPoint.x + (point.x - lastPoint.x) * progress : point.x;
        const baseY = lastPoint ? lastPoint.y + (point.y - lastPoint.y) * progress : point.y;
        const wave = Math.sin(seed * 1.73) * 1.4;
        const size = .65 + ((seed * 37) % 11) / 10;
        particles.push({
          x: baseX + Math.cos(seed * .91) * wave,
          y: baseY + Math.sin(seed * 1.17) * wave,
          time: point.time - (steps - index) * 2,
          size,
          glow: .55 + ((seed * 19) % 7) / 14,
        });
      }
      lastPoint = point;
      if (particles.length > 140) particles.splice(0, particles.length - 140);
      schedule();
    };
    const onLeave = () => { lastPoint = null; };

    const observer = new ResizeObserver(resize);
    observer.observe(section);
    resize();
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-cursor-trail" aria-hidden="true"/>;
}
