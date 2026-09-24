import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const BURST_EVENT = "yzt:join-confetti";
const PARTICLE_COUNT = 14;

type BurstPosition = {
  id: number;
  x: number;
  y: number;
};

export function launchJoinConfetti(element: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = element.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent<BurstPosition>(BURST_EVENT, {
    detail: {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    },
  }));
}

export function JoinConfettiLayer() {
  const [burst, setBurst] = useState<BurstPosition | null>(null);

  useEffect(() => {
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined;
    const handleBurst = (event: Event) => {
      const detail = (event as CustomEvent<BurstPosition>).detail;
      if (!detail) return;
      setBurst(detail);
      if (cleanupTimer) clearTimeout(cleanupTimer);
      cleanupTimer = setTimeout(() => setBurst(null), 1500);
    };

    window.addEventListener(BURST_EVENT, handleBurst);
    return () => {
      window.removeEventListener(BURST_EVENT, handleBurst);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, []);

  if (!burst) return null;

  return createPortal(
    <div
      key={burst.id}
      className="join-confetti-burst"
      style={{ left: burst.x, top: burst.y }}
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span key={index} className={`join-confetti-piece join-confetti-piece-${index + 1}`} />
      ))}
    </div>,
    document.body,
  );
}