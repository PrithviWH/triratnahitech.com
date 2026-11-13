import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  createInitialRibbonState,
  DEFAULT_RIBBON_CONFIG,
  RibbonSimulationState,
  sampleRibbonSlice,
  stepRibbonState,
  triggerRibbonTwist,
} from '../utils/ribbonPhysics';

interface RibbonTypeProps {
  items: string[];
  dark?: boolean;
  className?: string;
}

const SLICE_STEP_PX = 1.5;

function buildRibbonTexture(
  items: string[],
  backface: boolean,
  darkStage: boolean,
  dpr: number,
): { canvas: HTMLCanvasElement; tileWidth: number; ribbonHeight: number } {
  const ribbonHeight = 56;
  const fontPx = 13;
  const canvas = document.createElement('canvas');
  const measureCtx = canvas.getContext('2d');

  const fontSpec = `600 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
  const separatorGap = 36;
  const itemWidths: number[] = [];

  if (measureCtx) {
    measureCtx.font = fontSpec;
    if ('letterSpacing' in measureCtx) {
      (measureCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
        '2.2px';
    }
    for (const item of items) {
      itemWidths.push(measureCtx.measureText(item.toUpperCase()).width);
    }
  } else {
    for (const item of items) {
      itemWidths.push(item.length * 10);
    }
  }

  const cycleWidth = Math.max(
    360,
    Math.ceil(itemWidths.reduce((sum, w) => sum + w + separatorGap * 2, 0)),
  );

  canvas.width = Math.round(cycleWidth * dpr);
  canvas.height = Math.round(ribbonHeight * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { canvas, tileWidth: cycleWidth, ribbonHeight };
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Satin ribbon vertical gradient base
  const grad = ctx.createLinearGradient(0, 0, 0, ribbonHeight);
  if (backface) {
    grad.addColorStop(0, '#072A34');
    grad.addColorStop(0.25, '#0F4C5C');
    grad.addColorStop(0.5, '#135E70');
    grad.addColorStop(0.75, '#0F4C5C');
    grad.addColorStop(1, '#072A34');
  } else {
    grad.addColorStop(0, '#9A3412');
    grad.addColorStop(0.22, '#C84B13');
    grad.addColorStop(0.5, '#EA580C');
    grad.addColorStop(0.78, '#C84B13');
    grad.addColorStop(1, '#9A3412');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cycleWidth, ribbonHeight);

  // Crisp satin selvedge highlights along top & bottom edges
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.fillRect(0, 0, cycleWidth, 1.25);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.fillRect(0, ribbonHeight - 1.25, cycleWidth, 1.25);

  // Draw crisp tracked ribbon typography + diamond gem markers
  ctx.font = fontSpec;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  if ('letterSpacing' in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '2.2px';
  }

  let cursorX = separatorGap * 0.5;
  const centerY = ribbonHeight * 0.5 + 0.5;

  items.forEach((item, idx) => {
    const label = item.toUpperCase();
    ctx.fillStyle = backface ? '#FEF3C7' : '#FFFFFF';
    ctx.fillText(label, cursorX, centerY);

    const gemX = cursorX + itemWidths[idx] + separatorGap;
    ctx.save();
    ctx.translate(gemX, centerY - 0.5);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = backface ? '#F97316' : '#FDE68A';
    ctx.fillRect(-3.2, -3.2, 6.4, 6.4);
    ctx.restore();

    cursorX += itemWidths[idx] + separatorGap * 2;
  });

  return { canvas, tileWidth: cycleWidth, ribbonHeight };
}

export function RibbonType({
  items,
  dark: _dark = false,
  className = '',
}: RibbonTypeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<RibbonSimulationState>(createInitialRibbonState(true));
  const texturesRef = useRef<{
    front: HTMLCanvasElement;
    back: HTMLCanvasElement;
    tileWidth: number;
    ribbonHeight: number;
  } | null>(null);
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    lastX: number;
    lastTime: number;
    moved: boolean;
    flickVelocity: number;
  }>({
    active: false,
    pointerId: -1,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    moved: false,
    flickVelocity: 0,
  });

  const isVisibleRef = useRef(true);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const drawRibbon = useCallback(() => {
    const canvas = canvasRef.current;
    const textures = texturesRef.current;
    if (!canvas || !textures) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, dpr } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const { front, back, tileWidth, ribbonHeight } = textures;
    const state = stateRef.current;

    // Slice ribbon into smooth vertical columns for 3D wave + helical twist
    for (let x = 0; x < width; x += SLICE_STEP_PX) {
      const sliceW = Math.min(SLICE_STEP_PX, width - x);
      const xNorm = (x + sliceW * 0.5) / width;
      const sample = sampleRibbonSlice(xNorm, height, state, DEFAULT_RIBBON_CONFIG);

      const source = sample.isBackface ? back : front;
      const rawU = ((state.scrollPx + x) % tileWidth + tileWidth) % tileWidth;
      const drawY = sample.yCenter - sample.halfThickness;
      const drawH = sample.halfThickness * 2;

      // Guard seamless wrap across tile boundary
      if (rawU + sliceW <= tileWidth) {
        ctx.drawImage(
          source,
          rawU * dpr,
          0,
          sliceW * dpr,
          ribbonHeight * dpr,
          x,
          drawY,
          sliceW + 0.65,
          drawH,
        );
      } else {
        const part1 = tileWidth - rawU;
        const part2 = sliceW - part1;
        if (part1 > 0.05) {
          ctx.drawImage(
            source,
            rawU * dpr,
            0,
            part1 * dpr,
            ribbonHeight * dpr,
            x,
            drawY,
            part1 + 0.5,
            drawH,
          );
        }
        if (part2 > 0.05) {
          ctx.drawImage(
            source,
            0,
            0,
            part2 * dpr,
            ribbonHeight * dpr,
            x + part1,
            drawY,
            part2 + 0.5,
            drawH,
          );
        }
      }

      // Directional 3D satin specular / fold shading
      if (sample.shade > 0.04) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(sample.shade * 0.22).toFixed(3)})`;
        ctx.fillRect(x, drawY, sliceW + 0.65, drawH);
      } else if (sample.shade < -0.04) {
        ctx.fillStyle = `rgba(9, 9, 11, ${(-sample.shade * 0.28).toFixed(3)})`;
        ctx.fillRect(x, drawY, sliceW + 0.65, drawH);
      }
    }
  }, []);

  const rebuildTexturesAndSize = useCallback(async () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    sizeRef.current = { width, height, dpr };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const frontTex = buildRibbonTexture(items, false, false, dpr);
    const backTex = buildRibbonTexture(items, true, false, dpr);

    texturesRef.current = {
      front: frontTex.canvas,
      back: backTex.canvas,
      tileWidth: frontTex.tileWidth,
      ribbonHeight: frontTex.ribbonHeight,
    };

    drawRibbon();
  }, [drawRibbon, items]);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (!cancelled) {
        void rebuildTexturesAndSize();
      }
    };

    init();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => init())
        : null;
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const intersectionObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisibleRef.current = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0.01 },
          )
        : null;
    if (intersectionObserver && containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    if (!reducedMotion) {
      lastFrameRef.current = performance.now();
      const loop = (now: number) => {
        const dt = (now - lastFrameRef.current) / 1000;
        lastFrameRef.current = now;
        if (isVisibleRef.current) {
          stepRibbonState(stateRef.current, dt, DEFAULT_RIBBON_CONFIG);
          drawRibbon();
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [drawRibbon, rebuildTexturesAndSize, reducedMotion]);

  const handlePointerEnter = () => {
    stateRef.current.isHovered = true;
  };

  const handlePointerLeave = () => {
    stateRef.current.isHovered = false;
    if (dragRef.current.active) {
      dragRef.current.active = false;
      stateRef.current.isDragging = false;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const now = performance.now();
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: now,
      moved: false,
      flickVelocity: 0,
    };
    stateRef.current.isDragging = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic events without pointer capture support
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const now = performance.now();
    const dx = e.clientX - dragRef.current.lastX;
    const dt = Math.max(0.008, (now - dragRef.current.lastTime) / 1000);

    if (Math.abs(e.clientX - dragRef.current.startX) > 5) {
      dragRef.current.moved = true;
    }

    stateRef.current.scrollPx -= dx;
    dragRef.current.flickVelocity = -dx / dt;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;
  };

  const finishPointerInteraction = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const wasDrag = dragRef.current.moved;
    const flick = dragRef.current.flickVelocity;

    dragRef.current.active = false;
    stateRef.current.isDragging = false;

    if (wasDrag) {
      stateRef.current.velocityPx = Math.max(-750, Math.min(750, flick));
    } else if (containerRef.current && !reducedMotion) {
      const rect = containerRef.current.getBoundingClientRect();
      const norm = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
      triggerRibbonTwist(stateRef.current, norm, 1);
    }
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-ribbon-type="true"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      onPointerCancel={finishPointerInteraction}
      className={`relative w-full h-32 sm:h-40 overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing bg-transparent ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        }}
      />
    </div>
  );
}
