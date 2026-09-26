import { RotateCcw, Trophy, Undo2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yzt-ai-evrimi-v1";
const SIZE = 4;
const WIN_VALUE = 2048;

export type Cell = number | null;

export const STAGES: Record<number, { name: string; note: string; tone: string }> = {
  2: { name: "Perceptron", note: "1957", tone: "evo-t2" },
  4: { name: "MLP", note: "1986", tone: "evo-t4" },
  8: { name: "CNN", note: "1989", tone: "evo-t8" },
  16: { name: "RNN", note: "1990", tone: "evo-t16" },
  32: { name: "LSTM", note: "1997", tone: "evo-t32" },
  64: { name: "Transformer", note: "2017", tone: "evo-t64" },
  128: { name: "BERT", note: "2018", tone: "evo-t128" },
  256: { name: "GPT-3", note: "2020", tone: "evo-t256" },
  512: { name: "Multimodal", note: "2023", tone: "evo-t512" },
  1024: { name: "Reasoning", note: "2024", tone: "evo-t1024" },
  2048: { name: "AGI", note: "Gelecek", tone: "evo-t2048" },
  4096: { name: "Süper Zekâ", note: "?", tone: "evo-t4096" },
  8192: { name: "Sınırsız", note: "?", tone: "evo-t4096" },
};

function stageFor(value: number) {
  return STAGES[value] ?? { name: `${value}`, note: "", tone: "evo-t4096" };
}

function emptyGrid(): Cell[] {
  return Array.from({ length: SIZE * SIZE }, () => null);
}

function spawn(grid: Cell[]): Cell[] {
  const free = grid.map((cell, index) => (cell === null ? index : -1)).filter((index) => index >= 0);
  if (!free.length) return grid;
  const target = free[Math.floor(Math.random() * free.length)] ?? 0;
  const next = [...grid];
  next[target] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function newGrid(): Cell[] {
  return spawn(spawn(emptyGrid()));
}

function lineOf(grid: Cell[], dir: "up" | "down" | "left" | "right", index: number) {
  const cells: number[] = [];
  for (let step = 0; step < SIZE; step += 1) {
    if (dir === "left") cells.push(index * SIZE + step);
    else if (dir === "right") cells.push(index * SIZE + (SIZE - 1 - step));
    else if (dir === "up") cells.push(step * SIZE + index);
    else cells.push((SIZE - 1 - step) * SIZE + index);
  }
  return cells;
}

function move(grid: Cell[], dir: "up" | "down" | "left" | "right") {
  const next = [...grid];
  let gained = 0;
  let moved = false;
  const merged: number[] = [];
  for (let index = 0; index < SIZE; index += 1) {
    const path = lineOf(grid, dir, index);
    const values = path.map((cell) => next[cell]).filter((value): value is number => value !== null);
    const result: number[] = [];
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i] ?? 0;
      const upcoming = values[i + 1];
      if (upcoming === value) {
        const combined = value * 2;
        result.push(combined);
        gained += combined;
        merged.push(path[result.length - 1] ?? 0);
        i += 1;
      } else result.push(value);
    }
    for (let slot = 0; slot < SIZE; slot += 1) {
      const cell = path[slot] ?? 0;
      const value = result[slot] ?? null;
      if (next[cell] !== value) moved = true;
      next[cell] = value;
    }
  }
  return { grid: next, gained, moved, merged };
}

function hasMoves(grid: Cell[]) {
  return (["up", "down", "left", "right"] as const).some((dir) => move(grid, dir).moved);
}

export function AiEvolution() {
  const [grid, setGrid] = useState<Cell[]>(emptyGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [merged, setMerged] = useState<number[]>([]);
  const [history, setHistory] = useState<Array<{ grid: Cell[]; score: number }>>([]);
  const [status, setStatus] = useState<"playing" | "won" | "over">("playing");
  const [keepGoing, setKeepGoing] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setGrid(newGrid());
    const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
    if (Number.isFinite(stored)) setBest(stored);
  }, []);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      window.localStorage.setItem(STORAGE_KEY, String(score));
    }
  }, [best, score]);

  const step = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      if (status === "over") return;
      setGrid((currentGrid) => {
        const outcome = move(currentGrid, dir);
        if (!outcome.moved) return currentGrid;
        const withSpawn = spawn(outcome.grid);
        setHistory((items) => [...items.slice(-9), { grid: currentGrid, score }]);
        setScore((value) => value + outcome.gained);
        setMerged(outcome.merged);
        window.setTimeout(() => setMerged([]), 220);
        if (!keepGoing && outcome.grid.includes(WIN_VALUE)) setStatus("won");
        else if (!hasMoves(withSpawn)) setStatus("over");
        return withSpawn;
      });
    },
    [keepGoing, score, status],
  );

  useEffect(() => {
    const keys: Record<string, "up" | "down" | "left" | "right"> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const dir = keys[event.key];
      if (!dir) return;
      event.preventDefault();
      step(dir);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step]);

  const reset = () => {
    setGrid(newGrid());
    setScore(0);
    setHistory([]);
    setMerged([]);
    setStatus("playing");
    setKeepGoing(false);
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setGrid(last.grid);
    setScore(last.score);
    setHistory((items) => items.slice(0, -1));
    setStatus("playing");
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const point = event.touches[0];
    if (point) touch.current = { x: point.clientX, y: point.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touch.current;
    const point = event.changedTouches[0];
    touch.current = null;
    if (!start || !point) return;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? "right" : "left");
    else step(dy > 0 ? "down" : "up");
  };

  const highest = grid.reduce<number>((max, cell) => Math.max(max, cell ?? 0), 0);
  const highestStage = highest ? stageFor(highest) : null;

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex gap-3">
            <div className="evo-score"><strong>{score}</strong><span>Skor</span></div>
            <div className="evo-score evo-score-alt"><strong>{best}</strong><span>Rekor</span></div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={undo} disabled={!history.length} aria-label="Son hamleyi geri al"><Undo2 />Geri al</Button>
            <Button type="button" onClick={reset} aria-label="Yeni oyun başlat"><RotateCcw />Yeni oyun</Button>
          </div>
        </div>

        <div
          className="evo-board mt-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="application"
          aria-label="AI Evrimi oyun tahtası. Yön tuşlarıyla oyna."
        >
          {grid.map((cell, index) => {
            const stage = cell ? stageFor(cell) : null;
            return (
              <div key={index} className={cn("evo-cell", stage && "evo-tile", stage?.tone, merged.includes(index) && "evo-merge")}>
                {stage && (
                  <>
                    <span className="evo-value">{cell}</span>
                    <span className="evo-name">{stage.name}</span>
                    <span className="evo-note">{stage.note}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="game-message" role="status" aria-live="polite">
          {status === "won"
            ? "AGI'ye ulaştın! Sonsuz modda devam edebilirsin."
            : status === "over"
              ? `Hamle kalmadı. En ileri modelin: ${highestStage?.name ?? "-"}.`
              : highestStage
                ? `Şu anki en ileri modelin: ${highestStage.name} · ${highestStage.note}`
                : "Aynı modelleri birleştirerek yapay zekâ tarihini ilerlet."}
        </div>

        {status === "won" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={() => { setKeepGoing(true); setStatus("playing"); }}>Devam et</Button>
            <Button type="button" variant="outline" onClick={reset}>Baştan başla</Button>
          </div>
        )}
        {status === "over" && (
          <div className="mt-4"><Button type="button" onClick={reset}><RotateCcw />Tekrar dene</Button></div>
        )}

        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          Bilgisayarda yön tuşları veya W-A-S-D; telefonda parmağını kaydır.
        </p>
      </div>

      <aside className="border-t-2 border-brand-mid pt-5 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-7">
        <p className="eyebrow">Evrim basamakları</p>
        <ol className="mt-6 space-y-2 text-sm">
          {Object.entries(STAGES).slice(0, 11).map(([value, stage]) => (
            <li key={value} className={cn("evo-legend", highest >= Number(value) && "evo-legend-reached")}>
              <span className="font-bold">{value}</span>
              <span>{stage.name}</span>
              <span className="text-xs text-muted-foreground">{stage.note}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex items-start gap-3 border border-foreground p-5 text-sm leading-6">
          <Trophy className="mt-0.5 size-5 shrink-0 text-brand-mid" />
          <p>2048'e, yani AGI'ye ulaşmak hedef. Sonrası sonsuz mod.</p>
        </div>
      </aside>
    </div>
  );
}
