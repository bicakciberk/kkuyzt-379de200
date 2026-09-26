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
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    const section = trail?.parentElement;
    if (!trail || !section) return;
    const pointer = window.matchMedia(DESKTOP_POINTER);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let fadeTimer = 0;
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;

    const animate = () => {
      currentX += (targetX - currentX) * .2;
      currentY += (targetY - currentY) * .2;
      trail.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - currentX) > .2 || Math.abs(targetY - currentY) > .2) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    const hide = () => {
      window.clearTimeout(fadeTimer);
      trail.classList.remove("is-visible");
    };
    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
      const box = section.getBoundingClientRect();
      targetX = event.clientX - box.left;
      targetY = event.clientY - box.top;
      if (currentX < 0) {
        currentX = targetX;
        currentY = targetY;
      }
      trail.classList.add("is-visible");
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(hide, 520);
      if (!frame) frame = requestAnimationFrame(animate);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", hide);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", hide);
      window.clearTimeout(fadeTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={trailRef} className="hero-cursor-trail" aria-hidden="true"/>;
}
