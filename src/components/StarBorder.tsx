import React, { ComponentPropsWithoutRef, ElementType, useEffect, useRef } from 'react';
import {
  BorderOutline,
  BorderPoint,
  clamp,
  createBorderOutline,
  easeCubic,
  formatRgba,
  mixRgb,
  projectPointToBorder,
  sampleBorderPointAt,
  STAR_BORDER_TAU,
  STAR_BORDER_WHITE,
  wrap,
} from '../utils/starBorderGeometry';

const THEMES = {
  dark: {
    surface: '#0c0c0f',
    text: '#fafafa',
    track: 'rgba(255, 255, 255, 0.1)',
    light: '#ffffff',
  },
  light: {
    surface: '#ffffff',
    text: '#18181b',
    track: 'rgba(24, 24, 27, 0.12)',
    light: '#18181b',
  },
} as const;

const HOVERS = ['lap', 'brighten', 'reveal', 'none'] as const;
const BLEED = 48;
const LAP = 0.9;

type StarHoverMode = (typeof HOVERS)[number];
type StarDirection = 'clockwise' | 'counterclockwise';
type StarTheme = 'dark' | 'light';

export interface StarBorderOwnProps<T extends ElementType = 'button'> {
  as?: T;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  trailColor?: string;
  duration?: number;
  thickness?: number;
  radius?: number;
  trailLength?: number;
  stars?: number;
  glow?: number;
  sparkle?: boolean;
  direction?: StarDirection;
  hover?: StarHoverMode;
  clickPulse?: boolean;
  theme?: StarTheme;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export type StarBorderProps<T extends ElementType = 'button'> = StarBorderOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderOwnProps<T>>;

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  seed: number;
}

interface PulseWave {
  origin: number;
  age: number;
}

let colorContext: CanvasRenderingContext2D | null = null;

function toRgb(color: string): [number, number, number] {
  colorContext = colorContext ?? document.createElement('canvas').getContext('2d');
  if (!colorContext) return STAR_BORDER_WHITE;
  colorContext.fillStyle = '#000000';
  colorContext.fillStyle = color;
  const value = String(colorContext.fillStyle);
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1, 7), 16);
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
  }
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? [...STAR_BORDER_WHITE];
  return [
    parts[0] ?? 255,
    parts[1] ?? 255,
    parts[2] ?? 255,
  ];
}

export function StarBorder<T extends ElementType = 'button'>({
  as,
  children,
  className = '',
  style,
  color,
  trailColor,
  duration = 4,
  thickness = 1,
  radius = 12,
  trailLength = 0.3,
  stars = 1,
  glow = 0.6,
  sparkle = false,
  direction = 'clockwise',
  hover = 'lap',
  clickPulse = true,
  theme = 'dark',
  backgroundColor,
  textColor,
  borderColor,
  ...rest
}: StarBorderProps<T>) {
  const Component = (as || 'button') as ElementType;
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const palette = THEMES[theme] ?? THEMES.dark;
  const lightColor = color ?? palette.light;

  const settings = {
    light: theme === 'light',
    color: lightColor,
    trailColor: trailColor ?? lightColor,
    duration: Math.max(0.3, duration),
    thickness: Math.max(0.5, thickness),
    radius: Math.max(0, radius),
    trailLength: clamp(trailLength, 0, 1),
    stars: clamp(Math.round(stars), 1, 6),
    glow: clamp(glow, 0, 1),
    sparkle,
    direction: direction === 'counterclockwise' ? -1 : 1,
    hover: HOVERS.includes(hover) ? hover : 'lap',
    clickPulse,
  };

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !canvas || !ctx) return undefined;

    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const point: BorderPoint = { x: 0, y: 0, nx: 0, ny: -1 };
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      phase: 0,
      velocity: 0,
      motion: 0,
      lap: -1,
      time: 0,
      reveal: settingsRef.current.hover === 'reveal' ? 0 : 1,
      boost: 0,
      flash: 0,
      emit: 0,
      hovered: false,
      focused: false,
      pointerX: 0,
      pointerY: 0,
      visible: true,
    };

    const pulses: PulseWave[] = [];
    const dust: DustMote[] = [];
    const colors: {
      key: string;
      head: [number, number, number];
      tail: [number, number, number];
    } = {
      key: '',
      head: STAR_BORDER_WHITE,
      tail: STAR_BORDER_WHITE,
    };

    let raf = 0;
    let last = performance.now();
    let alive = true;
    let resizePending = false;

    const applyMeasure = () => {
      state.width = root.offsetWidth;
      state.height = root.offsetHeight;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round((state.width + BLEED * 2) * state.dpr));
      canvas.height = Math.max(1, Math.round((state.height + BLEED * 2) * state.dpr));
    };

    const measure = () => {
      resizePending = true;
      wake();
    };

    const localCoords = (event: PointerEvent): [number, number] => {
      const rect = root.getBoundingClientRect();
      const scaleX = rect.width ? state.width / rect.width : 1;
      const scaleY = rect.height ? state.height / rect.height : 1;
      return [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
    };

    const shapeFor = (s: typeof settings): BorderOutline =>
      createBorderOutline(
        Math.max(1, state.width - s.thickness),
        Math.max(1, state.height - s.thickness),
        s.radius - s.thickness / 2,
      );

    const strokeSegment = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      strokeStyle: string | CanvasGradient,
    ) => {
      ctx.lineWidth = width;
      ctx.strokeStyle = strokeStyle;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const drawTrail = (
      s: typeof settings,
      shape: BorderOutline,
      head: number,
      length: number,
      sign: number,
      intensity: number,
      tip = true,
    ) => {
      if (length < 0.5 || intensity <= 0) return;
      const steps = clamp(Math.ceil(length / 2), 2, 90);
      sampleBorderPointAt(shape, head, point);
      let px = point.x;
      let py = point.y;

      for (let i = 1; i <= steps; i++) {
        sampleBorderPointAt(shape, head - sign * length * (i / steps), point);
        const u = 1 - (i - 0.5) / steps;
        const fade = u * u * intensity;
        let tone = mixRgb(colors.tail, colors.head, u);
        if (!s.light) {
          tone = mixRgb(tone, STAR_BORDER_WHITE, u ** 6 * 0.65);
        }
        ctx.lineCap = tip && i === 1 ? 'round' : 'butt';
        strokeSegment(
          px,
          py,
          point.x,
          point.y,
          2 + 6 * s.glow,
          formatRgba(tone, fade * (s.light ? 0.1 : 0.2) * s.glow),
        );
        strokeSegment(
          px,
          py,
          point.x,
          point.y,
          s.thickness,
          formatRgba(tone, fade),
        );
        px = point.x;
        py = point.y;
      }
    };

    const drawHead = (
      s: typeof settings,
      x: number,
      y: number,
      intensity: number,
      twinkle: number,
    ) => {
      if (intensity <= 0) return;
      const tone = colors.head;
      const reach = (12 + 40 * s.glow) * (s.light ? 0.6 : 1);
      const bloom = ctx.createRadialGradient(x, y, 0, x, y, reach);
      const strength = (s.light ? 0.08 : 0.4) * s.glow * intensity;
      bloom.addColorStop(0, formatRgba(tone, strength));
      bloom.addColorStop(0.2, formatRgba(tone, strength * 0.4));
      bloom.addColorStop(0.5, formatRgba(tone, strength * 0.1));
      bloom.addColorStop(1, formatRgba(tone, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(x - reach, y - reach, reach * 2, reach * 2);

      if (!s.sparkle) return;

      const size = (1 + s.thickness * 0.6) * (s.light ? 0.85 : 1);
      const core = ctx.createRadialGradient(x, y, 0, x, y, size * 2.2);
      core.addColorStop(0, formatRgba(s.light ? tone : STAR_BORDER_WHITE, intensity));
      core.addColorStop(
        s.light ? 0.3 : 0.4,
        formatRgba(s.light ? tone : mixRgb(tone, STAR_BORDER_WHITE, 0.5), intensity * 0.9),
      );
      core.addColorStop(s.light ? 0.55 : 1, formatRgba(tone, s.light ? intensity * 0.12 : 0));
      core.addColorStop(1, formatRgba(tone, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.2, 0, STAR_BORDER_TAU);
      ctx.fill();

      const spike = (3 + 4 * s.glow + s.thickness * 1.5) * twinkle;
      const center = s.light ? tone : STAR_BORDER_WHITE;
      const horizontal = ctx.createLinearGradient(x - spike, y, x + spike, y);
      horizontal.addColorStop(0, formatRgba(tone, 0));
      horizontal.addColorStop(0.5, formatRgba(center, intensity * 0.95));
      horizontal.addColorStop(1, formatRgba(tone, 0));
      strokeSegment(x - spike, y, x + spike, y, s.light ? 0.75 : 1, horizontal);

      const vertical = ctx.createLinearGradient(x, y - spike, x, y + spike);
      vertical.addColorStop(0, formatRgba(tone, 0));
      vertical.addColorStop(0.5, formatRgba(center, intensity * 0.95));
      vertical.addColorStop(1, formatRgba(tone, 0));
      strokeSegment(x, y - spike, x, y + spike, s.light ? 0.75 : 1, vertical);
    };

    const spawnDust = (x: number, y: number, nx: number, ny: number, speed: number) => {
      if (dust.length > 48) return;
      const push = 3 + Math.random() * 10;
      const drift = (Math.random() - 0.5) * 8;
      dust.push({
        x: x + nx * (Math.random() * 3 - 1),
        y: y + ny * (Math.random() * 3 - 1),
        vx: nx * push - ny * drift - speed * -ny * 0.04,
        vy: ny * push + nx * drift - speed * nx * 0.04,
        age: 0,
        life: 0.35 + Math.random() * 0.5,
        size: 0.45 + Math.random() * 0.7,
        seed: Math.random() * STAR_BORDER_TAU,
      });
    };

    const draw = (base: typeof settings, shape: BorderOutline) => {
      const s =
        state.boost > 0.001
          ? { ...base, glow: Math.min(1.5, base.glow + 0.4 * state.boost) }
          : base;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.width < 2 || state.height < 2) return;

      const offset = (BLEED + s.thickness / 2) * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, offset, offset);
      ctx.globalCompositeOperation = s.light ? 'source-over' : 'lighter';
      ctx.lineCap = 'butt';

      const total = shape.total;
      const spacing = total / s.stars;
      const speed = Math.abs(state.motion);
      const sign = state.motion >= 0 ? 1 : -1;
      const span = s.trailLength * s.duration;
      const length = Math.min(speed * span, spacing * 0.92, total * 0.6);
      const intensity = state.reveal * (1 + 0.4 * state.boost + 0.6 * state.flash);

      const ring =
        state.flash * (s.light ? 0.18 : 0.32) +
        state.boost * state.reveal * (s.light ? 0.07 : 0.12);
      if (ring > 0.005) {
        ctx.lineWidth = s.thickness + 2 * s.glow;
        ctx.strokeStyle = formatRgba(colors.head, ring);
        ctx.beginPath();
        ctx.roundRect(
          0,
          0,
          Math.max(1, state.width - s.thickness),
          Math.max(1, state.height - s.thickness),
          Math.max(0, shape.r),
        );
        ctx.stroke();
      }

      const still =
        clamp(1 - speed / Math.max(1, (total / s.duration) * 0.6), 0, 1) *
        Math.min(1, intensity);
      const rest = (10 + 14 * s.glow + s.thickness * 2) * still;

      for (let i = 0; i < s.stars; i++) {
        const head = state.phase + i * spacing;
        drawTrail(s, shape, head, length, sign, Math.min(1, intensity));
        if (still > 0.01) {
          drawTrail(s, shape, head, rest, 1, still, false);
          drawTrail(s, shape, head, rest, -1, still, false);
        }
      }

      for (const p of pulses) {
        const progress = p.age / 0.65;
        const fade = (1 - progress) ** 2;
        const travel = (total / 2) * (1 - (1 - Math.min(1, p.age / 0.5)) ** 2);
        const tail = Math.min(travel, total * 0.16);
        for (const way of [1, -1] as const) {
          const front = p.origin + way * travel;
          drawTrail(s, shape, front, tail, way, fade);
          sampleBorderPointAt(shape, front, point);
          drawHead(s, point.x, point.y, fade * 0.8, 0.8);
        }
      }

      for (let i = 0; i < s.stars; i++) {
        sampleBorderPointAt(shape, state.phase + i * spacing, point);
        const twinkle =
          0.82 +
          0.18 *
            Math.sin(state.time * 6.1 + i * 2.3) *
            Math.sin(state.time * 2.7 + i);
        drawHead(s, point.x, point.y, Math.min(1.3, intensity), twinkle);
      }

      for (const mote of dust) {
        const left = 1 - mote.age / mote.life;
        const shimmer = 0.45 + 0.55 * Math.sin(state.time * 20 + mote.seed);
        const alpha = left * shimmer * state.reveal * (s.light ? 0.35 : 0.9);
        if (alpha <= 0.01) continue;
        ctx.fillStyle = formatRgba(
          s.light ? colors.head : mixRgb(colors.tail, STAR_BORDER_WHITE, 0.6),
          alpha,
        );
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size * (0.6 + 0.4 * left), 0, STAR_BORDER_TAU);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (resizePending) {
        resizePending = false;
        applyMeasure();
      }
      if (!alive) return;

      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      state.time += dt;

      const key = `${s.color}|${s.trailColor}`;
      if (key !== colors.key) {
        colors.key = key;
        colors.head = toRgb(s.color);
        colors.tail = toRgb(s.trailColor);
      }

      const shape = shapeFor(s);
      const total = shape.total;
      const spacing = total / s.stars;
      const engaged = state.hovered || state.focused;
      const cruise = reduce ? 0 : (s.direction * total) / s.duration;

      const revealTarget = s.hover === 'reveal' && !engaged ? 0 : 1;
      state.reveal +=
        (revealTarget - state.reveal) *
        (1 - Math.exp(-dt / (revealTarget > state.reveal ? 0.16 : 0.45)));

      const boostTarget = s.hover === 'brighten' && engaged ? 1 : 0;
      state.boost +=
        (boostTarget - state.boost) *
        (1 - Math.exp(-dt / (boostTarget > state.boost ? 0.18 : 0.5)));

      state.flash *= Math.exp(-dt / 0.22);
      state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / 0.45));

      let extra = 0;
      if (state.lap >= 0) {
        const before = easeCubic(Math.min(1, state.lap / LAP));
        state.lap += dt;
        extra =
          (easeCubic(Math.min(1, state.lap / LAP)) - before) * total * s.direction;
        if (state.lap >= LAP) state.lap = -1;
      }

      state.motion = state.velocity + extra / dt;
      state.phase = wrap(state.phase + state.velocity * dt + extra, total);

      const pace = Math.abs(state.motion) / Math.max(1, Math.abs(total / s.duration));
      if (s.sparkle && !reduce && state.reveal > 0.05) {
        state.emit += dt * (2 + 6 * Math.min(2, pace)) * s.stars;
        while (state.emit > 1) {
          state.emit -= 1;
          sampleBorderPointAt(
            shape,
            state.phase + Math.floor(Math.random() * s.stars) * spacing,
            point,
          );
          spawnDust(point.x, point.y, point.nx, point.ny, state.motion);
        }
      }

      for (let i = dust.length - 1; i >= 0; i--) {
        const mote = dust[i];
        mote.age += dt;
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        mote.vx *= Math.exp(-dt * 2.2);
        mote.vy *= Math.exp(-dt * 2.2);
        if (mote.age >= mote.life) dust.splice(i, 1);
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].age += dt;
        if (pulses[i].age >= 0.65) pulses.splice(i, 1);
      }

      draw(s, shape);

      const settling =
        Math.abs(revealTarget - state.reveal) > 0.002 ||
        Math.abs(boostTarget - state.boost) > 0.002 ||
        state.flash > 0.01 ||
        pulses.length > 0 ||
        dust.length > 0;
      const moving = Math.abs(state.motion) > 0.05 || cruise !== 0 || state.lap >= 0;
      const showing = state.reveal > 0.002 || revealTarget > 0;

      if (state.visible && (settling || (moving && showing) || state.hovered)) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (raf || !alive || !state.visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const onEnter = (event: PointerEvent) => {
      const s = settingsRef.current;
      [state.pointerX, state.pointerY] = localCoords(event);
      state.hovered = true;
      if (s.hover === 'reveal' && state.reveal < 0.15) {
        state.phase = projectPointToBorder(
          shapeFor(s),
          state.pointerX - s.thickness / 2,
          state.pointerY - s.thickness / 2,
        );
        state.velocity = 0;
      }
      if (s.hover === 'lap' && state.lap < 0 && !reduce) state.lap = 0;
      wake();
    };

    const onLeave = () => {
      state.hovered = false;
      wake();
    };

    const emitPulse = (origin: number) => {
      if (!settingsRef.current.clickPulse) return;
      pulses.push({ origin, age: 0 });
      if (pulses.length > 4) pulses.shift();
      state.flash = 1;
      wake();
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      const s = settingsRef.current;
      const [x, y] = localCoords(event);
      emitPulse(
        projectPointToBorder(
          shapeFor(s),
          x - s.thickness / 2,
          y - s.thickness / 2,
        ),
      );
    };

    const onClick = (event: MouseEvent) => {
      if (event.detail === 0) emitPulse(state.phase);
    };

    const onFocus = () => {
      state.focused = root.matches(':focus-visible');
      if (
        state.focused &&
        settingsRef.current.hover === 'lap' &&
        state.lap < 0 &&
        !reduce
      ) {
        state.lap = 0;
      }
      wake();
    };

    const onBlur = () => {
      state.focused = false;
      wake();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);

    const visibility = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (state.visible) wake();
    });
    visibility.observe(root);

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('click', onClick);
    root.addEventListener('focus', onFocus);
    root.addEventListener('blur', onBlur);
    measure();

    return () => {
      alive = false;
      wakeRef.current = null;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('click', onClick);
      root.removeEventListener('focus', onFocus);
      root.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  const restRecord = rest as Record<string, unknown>;
  const cssVars = {
    '--star-border-radius': `${settings.radius}px`,
    '--star-border-thickness': `${settings.thickness}px`,
    '--star-border-surface': backgroundColor ?? palette.surface,
    '--star-border-text': textColor ?? palette.text,
    '--star-border-track': borderColor ?? palette.track,
    ...style,
  } as React.CSSProperties;

  return (
    <Component
      ref={rootRef}
      data-star-border="true"
      className={`star-border${className ? ` ${className}` : ''}`}
      style={cssVars}
      {...(Component === 'button' && restRecord.type === undefined ? { type: 'button' } : {})}
      {...rest}
    >
      <canvas ref={canvasRef} className="star-border__light" aria-hidden="true" />
      {children}
    </Component>
  );
}
