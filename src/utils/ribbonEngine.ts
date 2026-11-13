export interface RibbonSample {
  u: number;
  topX: number;
  topY: number;
  botX: number;
  botY: number;
  centerZ: number;
  facing: number;
  light: number;
}

export interface TwistPulse {
  originU: number;
  elapsed: number;
  duration: number;
  direction: 1 | -1;
}

export interface RibbonMotionState {
  scrollPx: number;
  dragVelocity: number;
  speedMultiplier: number;
  hovering: boolean;
  dragging: boolean;
  pulses: TwistPulse[];
}

export interface RibbonGeometryConfig {
  width: number;
  height: number;
  segments?: number;
  ribbonHalfHeight?: number;
  waveAmplitude?: number;
  depthAmplitude?: number;
  focalLength?: number;
  time: number;
  pulses?: TwistPulse[];
  introProgress?: number;
}

/** Smooth hermite step for soft twist envelopes */
function smoothBell(distance: number, radius: number): number {
  if (Math.abs(distance) >= radius) return 0;
  const n = distance / radius;
  const inv = 1 - n * n;
  return inv * inv;
}

/** Interpolate front/folded satin RGB stops based on directional lighting [0.2..1] */
export function computeSatinShade(
  facing: number,
  light: number,
  darkTheme: boolean,
): string {
  const clampL = Math.max(0.15, Math.min(1, light));

  if (darkTheme) {
    // Burnished copper front face -> deep warm espresso-copper shadow fold
    if (facing >= 0) {
      const r = Math.round(145 + clampL * 92); // 159..237
      const g = Math.round(42 + clampL * 52);  // 50..94
      const b = Math.round(8 + clampL * 16);   // 10..24
      return `rgb(${r}, ${g}, ${b})`;
    }
    const r = Math.round(52 + clampL * 38);
    const g = Math.round(16 + clampL * 14);
    const b = Math.round(5 + clampL * 6);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Deep teal satin on light studio sections
  if (facing >= 0) {
    const r = Math.round(8 + clampL * 16);
    const g = Math.round(54 + clampL * 42);
    const b = Math.round(68 + clampL * 46);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const r = Math.round(5 + clampL * 8);
  const g = Math.round(28 + clampL * 18);
  const b = Math.round(36 + clampL * 22);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Generate 3D-projected ribbon spine cross-sections across the viewport width */
export function sampleRibbonGeometry(config: RibbonGeometryConfig): RibbonSample[] {
  const {
    width,
    height,
    segments = 92,
    ribbonHalfHeight = 25,
    waveAmplitude = Math.max(18, Math.min(34, height * 0.21)),
    depthAmplitude = 48,
    focalLength = 700,
    time,
    pulses = [],
    introProgress = 1,
  } = config;

  const spanX = width + 120;
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const samples: RibbonSample[] = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const worldX = (u - 0.5) * spanX;

    // Gentle dual-harmonic wave through 3D space
    const worldY =
      Math.sin(u * Math.PI * 2.15 + time * 0.55) * waveAmplitude +
      Math.cos(u * Math.PI * 1.1 - time * 0.3) * (waveAmplitude * 0.28);

    const baseZ = Math.cos(u * Math.PI * 2.15 + time * 0.48) * depthAmplitude;

    // Natural 3D satin roll with gentle edge curl plus propagating click-twist waves & intro wave
    const edgeCurl = Math.pow(Math.abs(u - 0.5) * 2, 2.4) * Math.sin(time * 0.45 + u * 6.2) * 1.15;
    let roll = Math.sin(u * Math.PI * 2.2 + time * 0.55) * 0.52 + edgeCurl;

    if (introProgress < 1) {
      const introFront = introProgress * 1.35 - 0.15;
      const dist = u - introFront;
      roll += smoothBell(dist, 0.35) * Math.PI * 1.6 * (1 - introProgress);
    }

    for (const p of pulses) {
      const progress = Math.min(1, p.elapsed / p.duration);
      const travelRadius = 0.95;
      const forwardFront = p.originU + progress * travelRadius * p.direction;
      const backFront = p.originU - progress * travelRadius * p.direction;
      const strength = Math.sin(progress * Math.PI); // smooth rise & decay
      const waveA = smoothBell(u - forwardFront, 0.18);
      const waveB = smoothBell(u - backFront, 0.18);
      roll += (waveA - waveB) * Math.PI * 2 * strength;
    }

    // Spine tangent derivative dY/dX for perpendicular ribbon thickness (Y-down screen coords: upward normal = (dYdu, -spanX))
    const dYdu =
      Math.cos(u * Math.PI * 2.15 + time * 0.55) * waveAmplitude * Math.PI * 2.15 -
      Math.sin(u * Math.PI * 1.1 - time * 0.3) * (waveAmplitude * 0.28) * Math.PI * 1.1;
    const tLen = Math.hypot(spanX, dYdu) || 1;
    const nx = dYdu / tLen;
    const ny = -spanX / tLen;

    const cosRoll = Math.cos(roll);
    const sinRoll = Math.sin(roll);

    // 3D top and bottom ribbon edges with perspective projection
    const topX3 = worldX + nx * ribbonHalfHeight * cosRoll;
    const topY3 = worldY + ny * ribbonHalfHeight * cosRoll;
    const topZ3 = baseZ + ribbonHalfHeight * sinRoll;

    const botX3 = worldX - nx * ribbonHalfHeight * cosRoll;
    const botY3 = worldY - ny * ribbonHalfHeight * cosRoll;
    const botZ3 = baseZ - ribbonHalfHeight * sinRoll;

    const topScale = focalLength / Math.max(120, focalLength - topZ3);
    const botScale = focalLength / Math.max(120, focalLength - botZ3);

    const light = 0.52 + 0.48 * Math.sin(u * Math.PI * 2.15 + time * 0.55 + 0.8) * Math.abs(cosRoll);

    samples.push({
      u,
      topX: centerX + topX3 * topScale,
      topY: centerY + topY3 * topScale,
      botX: centerX + botX3 * botScale,
      botY: centerY + botY3 * botScale,
      centerZ: baseZ,
      facing: cosRoll,
      light,
    });
  }

  return samples;
}

/** Step scrolling momentum, hover slowdown, and propagating twist pulses */
export function stepRibbonMotion(
  state: RibbonMotionState,
  dt: number,
  baseSpeed = 58,
  hoverSlowdown = 0.3,
): void {
  const clampedDt = Math.min(0.05, Math.max(0.001, dt));

  const targetMult = state.dragging ? 0 : state.hovering ? hoverSlowdown : 1;
  state.speedMultiplier += (targetMult - state.speedMultiplier) * Math.min(1, clampedDt * 8);

  if (!state.dragging) {
    state.scrollPx += (baseSpeed * state.speedMultiplier + state.dragVelocity) * clampedDt;
    // Exponential flick decay
    state.dragVelocity *= Math.exp(-5.2 * clampedDt);
    if (Math.abs(state.dragVelocity) < 0.5) state.dragVelocity = 0;
  }

  // Advance and expire active click twists
  for (let i = state.pulses.length - 1; i >= 0; i--) {
    state.pulses[i].elapsed += clampedDt;
    if (state.pulses[i].elapsed >= state.pulses[i].duration) {
      state.pulses.splice(i, 1);
    }
  }
}

/** Wrap texture offset cleanly into [0, patternWidth) */
export function wrapScrollOffset(offset: number, patternWidth: number): number {
  if (patternWidth <= 0) return 0;
  const mod = offset % patternWidth;
  return mod < 0 ? mod + patternWidth : mod;
}
