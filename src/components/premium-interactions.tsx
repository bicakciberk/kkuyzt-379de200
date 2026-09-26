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

    const memory = "deviceMemory" in navigator ? Number(navigator.deviceMemory) : 8;
    const reducedPerformance = navigator.hardwareConcurrency <= 4 || memory <= 4;

    const makePoint = (column: number, row: number, gap: number) => {
      const seed = column * 41 + row * 67;
      return {
        x: 18 + column * gap + Math.sin(seed) * gap * .16,
        y: 18 + row * gap + Math.cos(seed * 1.37) * gap * .16,
      };
    };

    const draw = () => {
      frame.current = 0;
      const box = section.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, reducedPerformance ? 1.2 : 1.5);
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const interactive = pointer.matches && !reduced.matches && position.current.inside;
      const mobile = !pointer.matches;
      const gap = mobile ? 54 : reducedPerformance ? 42 : 36;
      const radius = reducedPerformance ? 185 : 235;
      const columns = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const styles = getComputedStyle(document.documentElement);
      const midBlue = styles.getPropertyValue("--brand-mid").trim();
      const lightBlue = styles.getPropertyValue("--brand-light").trim();
      const points = Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const point = makePoint(column, row, gap);
        const distance = interactive
          ? Math.hypot(point.x - position.current.x, point.y - position.current.y)
          : Number.POSITIVE_INFINITY;
        return { ...point, influence: Math.max(0, 1 - distance / radius) };
      });

      if (interactive && !reducedPerformance) {
        const neighborOffsets = [[1, 0], [0, 1], [1, 1], [-1, 1]] as const;
        context.strokeStyle = lightBlue;
        context.lineCap = "round";
        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const point = points[row * columns + column];
            if (!point || point.influence <= .04) continue;
            for (const [offsetX, offsetY] of neighborOffsets) {
              const nextColumn = column + offsetX;
              const nextRow = row + offsetY;
              if (nextColumn < 0 || nextColumn >= columns || nextRow >= rows) continue;
              const neighbor = points[nextRow * columns + nextColumn];
              if (!neighbor || neighbor.influence <= .04) continue;
              const proximity = Math.min(point.influence, neighbor.influence);
              const connectionDistance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y);
              const distanceStrength = Math.max(0, 1 - connectionDistance / (gap * 1.75));
              context.globalAlpha = proximity * distanceStrength * .48;
              context.lineWidth = .35 + proximity * distanceStrength * 1.15;
              context.beginPath();
              context.moveTo(point.x, point.y);
              context.lineTo(neighbor.x, neighbor.y);
              context.stroke();
            }
          }
        }
      }

      context.fillStyle = midBlue;
      for (const point of points) {
        const influence = point.influence;
        context.globalAlpha = mobile ? .12 : .13 + influence * .67;
        if (influence > .03 && !reducedPerformance) {
          context.shadowColor = lightBlue;
          context.shadowBlur = 4 + influence * 18;
        } else {
          context.shadowBlur = 0;
        }
        context.beginPath();
        context.arc(point.x, point.y, mobile ? .75 : .85 + influence * 2.55, 0, Math.PI * 2);
        context.fill();

        if (influence > .3 && !reducedPerformance) {
          context.globalAlpha = influence * .16;
          context.beginPath();
          context.arc(point.x, point.y, 4 + influence * 10, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.shadowBlur = 0;
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
