import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyAssembleScatter,
  applyRadialShatter,
  generateTriangularShards,
  PointerState,
  Shard,
  stepShatterPhysics,
} from '../utils/shatterPhysics';

export interface ShatterSegment {
  text: string;
  className: string;
  tint: string;
}

interface ShatterTypeProps {
  segments: ShatterSegment[];
  className?: string;
  cellSize?: number;
  assembleOnMount?: boolean;
}

const CANVAS_PAD = 64;

export function ShatterType({
  segments,
  className = '',
  cellSize = 21,
  assembleOnMount = true,
}: ShatterTypeProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baselineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const atlasRef = useRef<HTMLCanvasElement | null>(null);
  const shardsRef = useRef<Shard[]>([]);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });
  const hasPlayedIntroRef = useRef(false);

  const [canvasReady, setCanvasReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect user's prefers-reduced-motion setting
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const drawFrame = useCallback((isIdle: boolean) => {
    const canvas = canvasRef.current;
    const atlas = atlasRef.current;
    if (!canvas || !atlas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, dpr } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width + CANVAS_PAD * 2, height + CANVAS_PAD * 2);

    // At full rest with no hover activity, draw the 1:1 rasterized typographic atlas
    // so there are zero sub-pixel seams between adjacent shards.
    if (isIdle && !pointerRef.current.active) {
      ctx.drawImage(
        atlas,
        0,
        0,
        width + CANVAS_PAD * 2,
        height + CANVAS_PAD * 2,
      );
      return;
    }

    const shards = shardsRef.current;
    for (let i = 0; i < shards.length; i++) {
      const s = shards[i];
      const [v0, v1, v2] = s.vertices;

      ctx.save();
      ctx.translate(s.cx + s.dx + CANVAS_PAD, s.cy + s.dy + CANVAS_PAD);
      if (s.angle !== 0) {
        ctx.rotate(s.angle);
      }

      // Slightly expand clip outward (~0.35px) around centroid to prevent subpixel gaps
      const expandVertex = (vx: number, vy: number) => {
        const lx = vx - s.cx;
        const ly = vy - s.cy;
        const len = Math.hypot(lx, ly) || 1;
        return [lx + (lx / len) * 0.4, ly + (ly / len) * 0.4] as const;
      };

      const [e0x, e0y] = expandVertex(v0.x, v0.y);
      const [e1x, e1y] = expandVertex(v1.x, v1.y);
      const [e2x, e2y] = expandVertex(v2.x, v2.y);

      ctx.beginPath();
      ctx.moveTo(e0x, e0y);
      ctx.lineTo(e1x, e1y);
      ctx.lineTo(e2x, e2y);
      ctx.closePath();

      ctx.save();
      ctx.clip();

      // Copy exact clipped glyph fragment from the HiDPI word atlas
      const padSrc = 2;
      const sx = Math.max(0, (s.bx - padSrc + CANVAS_PAD) * dpr);
      const sy = Math.max(0, (s.by - padSrc + CANVAS_PAD) * dpr);
      const sw = Math.min(atlas.width - sx, (s.bw + padSrc * 2) * dpr);
      const sh = Math.min(atlas.height - sy, (s.bh + padSrc * 2) * dpr);

      if (sw > 0 && sh > 0) {
        ctx.drawImage(
          atlas,
          sx,
          sy,
          sw,
          sh,
          s.bx - padSrc - s.cx,
          s.by - padSrc - s.cy,
          s.bw + padSrc * 2,
          s.bh + padSrc * 2,
        );
      }
      ctx.restore();

      // Crisp luminous crystal fracture glints across the letterform strokes
      // (stays invisible against empty background whitespace while slicing colored glyphs cleanly)
      if (s.crack > 0.05) {
        ctx.strokeStyle = `rgba(250, 250, 250, ${(0.88 * s.crack).toFixed(3)})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }

      ctx.restore();
    }
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const { isMoving } = stepShatterPhysics(
        shardsRef.current,
        dt,
        pointerRef.current,
      );

      drawFrame(!isMoving);

      if (isMoving) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  const rebuildMesh = useCallback(async () => {
    if (reducedMotion) {
      setCanvasReady(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width <= 0 || containerRect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.ceil(containerRect.width);
    const height = Math.ceil(containerRect.height);
    sizeRef.current = { width, height, dpr };

    const totalW = width + CANVAS_PAD * 2;
    const totalH = height + CANVAS_PAD * 2;

    canvas.width = Math.round(totalW * dpr);
    canvas.height = Math.round(totalH * dpr);

    // Offscreen HiDPI word atlas
    const atlas = document.createElement('canvas');
    atlas.width = Math.round(totalW * dpr);
    atlas.height = Math.round(totalH * dpr);
    const actx = atlas.getContext('2d', { willReadFrequently: true });
    if (!actx) return;

    actx.setTransform(dpr, 0, 0, dpr, 0, 0);
    actx.clearRect(0, 0, totalW, totalH);
    actx.textBaseline = 'alphabetic';
    actx.textAlign = 'left';

    const wordLayouts: {
      x: number;
      y: number;
      width: number;
      height: number;
      fontPx: number;
      idx: number;
    }[] = [];

    wordRefs.current.forEach((span, idx) => {
      const probe = baselineRefs.current[idx];
      if (!span || !probe) return;

      const wordRect = span.getBoundingClientRect();
      const probeRect = probe.getBoundingClientRect();
      const style = window.getComputedStyle(span);

      const x = wordRect.left - containerRect.left;
      const y = wordRect.top - containerRect.top;
      const baselineY = probeRect.bottom - containerRect.top;

      actx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      actx.fillStyle = style.color;

      if ('letterSpacing' in actx && style.letterSpacing !== 'normal') {
        (actx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          style.letterSpacing;
      }

      actx.fillText(segments[idx].text, x + CANVAS_PAD, baselineY + CANVAS_PAD);

      wordLayouts.push({
        x,
        y,
        width: wordRect.width,
        height: wordRect.height,
        fontPx: parseFloat(style.fontSize) || 64,
        idx,
      });
    });

    const imgData = actx.getImageData(0, 0, atlas.width, atlas.height);
    const data = imgData.data;

    const collectedShards: Shard[] = [];
    let nextId = 0;

    for (const wl of wordLayouts) {
      const adaptiveCell = Math.max(14, Math.min(26, Math.round(cellSize * (wl.fontPx / 78))));
      const candidates = generateTriangularShards(
        {
          x: wl.x - 8,
          y: wl.y - 4,
          width: wl.width + 18,
          height: wl.height + 8,
          wordIndex: wl.idx,
          tint: segments[wl.idx].tint,
        },
        adaptiveCell,
        1337,
        nextId,
      );
      nextId += candidates.length;

      for (const shard of candidates) {
        const startX = Math.max(0, Math.floor((shard.bx + CANVAS_PAD) * dpr));
        const endX = Math.min(atlas.width - 1, Math.ceil((shard.bx + shard.bw + CANVAS_PAD) * dpr));
        const startY = Math.max(0, Math.floor((shard.by + CANVAS_PAD) * dpr));
        const endY = Math.min(atlas.height - 1, Math.ceil((shard.by + shard.bh + CANVAS_PAD) * dpr));

        let hasInk = false;
        const step = Math.max(1, Math.floor(2 * dpr));
        for (let py = startY; py <= endY && !hasInk; py += step) {
          const rowOffset = py * atlas.width;
          for (let px = startX; px <= endX; px += step) {
            if (data[(rowOffset + px) * 4 + 3] > 12) {
              hasInk = true;
              break;
            }
          }
        }
        if (hasInk) {
          collectedShards.push(shard);
        }
      }
    }

    atlasRef.current = atlas;
    shardsRef.current = collectedShards;

    if (assembleOnMount && !hasPlayedIntroRef.current && collectedShards.length > 0) {
      hasPlayedIntroRef.current = true;
      applyAssembleScatter(collectedShards, width * 0.45, height * 0.5, 48, 42);
      setCanvasReady(true);
      startLoop();
    } else {
      setCanvasReady(true);
      drawFrame(true);
    }
  }, [assembleOnMount, cellSize, drawFrame, reducedMotion, segments, startLoop]);

  useEffect(() => {
    if (reducedMotion) {
      setCanvasReady(false);
      return;
    }

    let cancelled = false;
    const run = () => {
      if (!cancelled) {
        void rebuildMesh();
      }
    };

    run();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            run();
          })
        : null;

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [rebuildMesh, reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLHeadingElement>) => {
    if (reducedMotion || !canvasReady || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    startLoop();
  };

  const handlePointerLeave = () => {
    if (!pointerRef.current.active) return;
    pointerRef.current = { ...pointerRef.current, active: false };
    startLoop();
  };

  const triggerShatterAt = (x: number, y: number) => {
    if (reducedMotion || !canvasReady || shardsRef.current.length === 0) return;
    applyRadialShatter(shardsRef.current, x, y, 640, Date.now() % 10000);
    startLoop();
  };

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    triggerShatterAt(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const { width, height } = sizeRef.current;
    triggerShatterAt(width * 0.5, height * 0.5);
  };

  return (
    <h1
      ref={containerRef}
      tabIndex={reducedMotion ? undefined : 0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={segments.map((s) => s.text).join(' ')}
      className={`relative select-none ${
        reducedMotion ? '' : 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C84B13] focus-visible:ring-offset-4 rounded-lg'
      } ${className}`}
    >
      {/* Semantic & Layout-Aligned DOM Typography */}
      <span
        className={`block transition-opacity duration-150 ${
          canvasReady && !reducedMotion ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {segments.map((seg, idx) => (
          <span
            key={seg.text}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            className={`inline-block whitespace-nowrap ${
              idx < segments.length - 1 ? 'mr-[0.2em]' : ''
            } ${seg.className}`}
          >
            {seg.text}
            <span
              ref={(el) => {
                baselineRefs.current[idx] = el;
              }}
              aria-hidden="true"
              className="inline-block w-0 h-0 align-baseline"
            />
          </span>
        ))}
      </span>

      {/* HiDPI Interactive Glass-Shard Canvas */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-shatter-ready={canvasReady ? 'true' : 'false'}
          style={{
            position: 'absolute',
            left: `-${CANVAS_PAD}px`,
            top: `-${CANVAS_PAD}px`,
            width: `calc(100% + ${CANVAS_PAD * 2}px)`,
            height: `calc(100% + ${CANVAS_PAD * 2}px)`,
          }}
          className={`pointer-events-none ${canvasReady ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </h1>
  );
}
