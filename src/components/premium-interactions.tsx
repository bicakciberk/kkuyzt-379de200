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
      if (target) {
        activeTiltRef.current = target;
        const box = target.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
        const py = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
        target.style.setProperty("--tilt-x", `${((.5 - py) * 4.5).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${((px - .5) * 5).toFixed(2)}deg`);
        target.style.setProperty("--tilt-lift", "-2px");
      }
    };

    const onLeave = () => {
      resetTilt();
    };

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
