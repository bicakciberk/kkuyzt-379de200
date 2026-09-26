import { useEffect, useRef } from "react";

const DESKTOP_POINTER = "(hover: hover) and (pointer: fine)";
const MAGNET_RADIUS = 34;
const MAGNET_PULL = 6;

export function TiltLayer() {
  const activeTiltRef = useRef<HTMLElement | null>(null);
  const magnetsRef = useRef<HTMLElement[]>([]);

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
      el.style.setProperty("--sheen-opacity", "0");
      activeTiltRef.current = null;
    };

    const resetMagnets = () => {
      for (const el of magnetsRef.current) {
        el.style.setProperty("--magnet-x", "0px");
        el.style.setProperty("--magnet-y", "0px");
      }
      magnetsRef.current = [];
    };

    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const updateMagnets = () => {
      frame = 0;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
      const active: HTMLElement[] = [];
      for (const el of nodes) {
        const box = el.getBoundingClientRect();
        if (!box.width) continue;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const dx = lastX - Math.max(box.left, Math.min(box.right, lastX));
        const dy = lastY - Math.max(box.top, Math.min(box.bottom, lastY));
        const distance = Math.hypot(dx, dy);
        if (distance > MAGNET_RADIUS) {
          el.style.setProperty("--magnet-x", "0px");
          el.style.setProperty("--magnet-y", "0px");
          continue;
        }
        const strength = 1 - distance / MAGNET_RADIUS;
        const vx = Math.max(-1, Math.min(1, (lastX - cx) / (box.width / 2 + MAGNET_RADIUS)));
        const vy = Math.max(-1, Math.min(1, (lastY - cy) / (box.height / 2 + MAGNET_RADIUS)));
        el.style.setProperty("--magnet-x", `${(vx * MAGNET_PULL * strength).toFixed(2)}px`);
        el.style.setProperty("--magnet-y", `${(vy * MAGNET_PULL * strength).toFixed(2)}px`);
        active.push(el);
      }
      magnetsRef.current = active;
    };

    const onMove = (event: globalThis.PointerEvent) => {
      if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tilt]") : null;
      if (target !== getActiveTilt()) resetTilt();
      if (target) {
        activeTiltRef.current = target;
        const box = target.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
        const py = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
        target.style.setProperty("--tilt-x", `${((.5 - py) * 4.5).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${((px - .5) * 5).toFixed(2)}deg`);
        target.style.setProperty("--tilt-lift", "-2px");
        target.style.setProperty("--sheen-x", `${(px * 100).toFixed(1)}%`);
        target.style.setProperty("--sheen-y", `${(py * 100).toFixed(1)}%`);
        target.style.setProperty("--sheen-opacity", "1");
      }
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updateMagnets);
    };

    const onLeave = () => {
      resetTilt();
      resetMagnets();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      resetTilt();
      resetMagnets();
    };
  }, []);

  return null;
}
