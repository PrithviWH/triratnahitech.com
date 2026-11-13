export interface RibbonTwistPulse {
  /** Normalized horizontal origin [0..1] where twist started */
  originNorm: number;
  /** Elapsed time in seconds */
  age: number;
  /** Total wave travel duration in seconds */
  duration: number;
  /** Twist amplitude multiplier (1 = full 360deg twist wave) */
  strength: number;
}

export interface RibbonSimulationState {
  /** Horizontal scroll offset in CSS pixels */
  scrollPx: number;
  /** Current scroll velocity (px/s), carries drag flick momentum */
  velocityPx: number;
  /** Wave phase in radians */
  phase: number;
  /** Blended hover factor [0 = away, 1 = hovered] for smooth slow-down */
  hoverBlend: number;
  /** Whether pointer is hovering */
  isHovered: boolean;
  /** Whether user is currently dragging horizontally */
  isDragging: boolean;
  /** Active click/intro helical twist waves */
  twists: RibbonTwistPulse[];
}

export interface RibbonConfig {
  baseSpeedPx: number;
  hoverSlowRatio: number;
  waveSpeed: number;
  waveAmplitudeRatio: number;
  ribbonHeightRatio: number;
}

export const DEFAULT_RIBBON_CONFIG: RibbonConfig = {
  baseSpeedPx: 68,
  hoverSlowRatio: 0.22,
  waveSpeed: 1.55,
  waveAmplitudeRatio: 0.21,
  ribbonHeightRatio: 0.35,
};

export interface RibbonSliceSample {
  /** Vertical center Y coordinate in CSS px */
  yCenter: number;
  /** Cosine of local helical twist angle [-1..1]; determines apparent ribbon thickness */
  pitchCos: number;
  /** Sine of local helical twist angle [-1..1]; determines specular normal tilt */
  pitchSin: number;
  /** True when the twist temporarily flips to the back surface */
  isBackface: boolean;
  /** Specular shading intensity [-1..1] */
  shade: number;
  /** Rendered half-height thickness at this horizontal slice */
  halfThickness: number;
}

export function createInitialRibbonState(withIntroTwist = true): RibbonSimulationState {
  return {
    scrollPx: 0,
    velocityPx: DEFAULT_RIBBON_CONFIG.baseSpeedPx,
    phase: 0,
    hoverBlend: 0,
    isHovered: false,
    isDragging: false,
    twists: withIntroTwist
      ? [{ originNorm: 0.15, age: 0, duration: 1.65, strength: 0.85 }]
      : [],
  };
}

export function triggerRibbonTwist(
  state: RibbonSimulationState,
  originNorm: number,
  strength = 1,
): void {
  const clamped = Math.max(0, Math.min(1, originNorm));
  state.twists.push({
    originNorm: clamped,
    age: 0,
    duration: 1.45,
    strength,
  });
  // Cap active twist waves cleanly
  if (state.twists.length > 5) {
    state.twists.shift();
  }
}

export function stepRibbonState(
  state: RibbonSimulationState,
  dt: number,
  config: RibbonConfig = DEFAULT_RIBBON_CONFIG,
): void {
  const safeDt = Math.min(0.05, Math.max(0.001, dt));

  const targetHover = state.isHovered && !state.isDragging ? 1 : 0;
  state.hoverBlend += (targetHover - state.hoverBlend) * Math.min(1, safeDt * 7.5);

  const targetSpeed =
    config.baseSpeedPx * (1 - state.hoverBlend * (1 - config.hoverSlowRatio));

  if (!state.isDragging) {
    // Exponentially settle flick velocity back to steady scroll speed
    state.velocityPx += (targetSpeed - state.velocityPx) * Math.min(1, safeDt * 3.8);
    state.scrollPx += state.velocityPx * safeDt;
  }

  // Slow wave undulation slightly on hover so text stays calm to read
  const waveTimeScale = 1 - state.hoverBlend * 0.45;
  state.phase += config.waveSpeed * waveTimeScale * safeDt;

  // Advance twist pulses and prune finished ones
  for (let i = state.twists.length - 1; i >= 0; i--) {
    state.twists[i].age += safeDt;
    if (state.twists[i].age >= state.twists[i].duration) {
      state.twists.splice(i, 1);
    }
  }
}

/** Sample 3D wave centerline, satin lighting, and helical twist for a horizontal position */
export function sampleRibbonSlice(
  xNorm: number,
  height: number,
  state: RibbonSimulationState,
  config: RibbonConfig = DEFAULT_RIBBON_CONFIG,
): RibbonSliceSample {
  const amp = height * config.waveAmplitudeRatio;
  const k1 = Math.PI * 2.15;
  const k2 = Math.PI * 4.3;

  const wave1 = Math.sin(xNorm * k1 - state.phase);
  const wave2 = Math.sin(xNorm * k2 + state.phase * 0.62) * 0.22;
  const yCenter = height * 0.5 + (wave1 + wave2) * amp;

  // Local curve slope derivative for directional satin highlight
  const slope =
    Math.cos(xNorm * k1 - state.phase) * 0.65 +
    Math.cos(xNorm * k2 + state.phase * 0.62) * 0.25;

  // Gentle ambient satin twist plus any propagating click twist pulses
  let twistAngle = Math.sin(xNorm * Math.PI * 2 - state.phase * 0.85) * 0.26;

  for (let i = 0; i < state.twists.length; i++) {
    const pulse = state.twists[i];
    const progress = pulse.age / pulse.duration;
    const dist = Math.abs(xNorm - pulse.originNorm);
    // Wavefront expands outward cleanly from click origin
    const frontRadius = progress * 1.15;
    const bandWidth = 0.24;
    const delta = dist - frontRadius;
    const envelope = Math.exp(-(delta * delta) / (2 * bandWidth * bandWidth));
    const fade = Math.sin(Math.min(1, progress) * Math.PI);
    twistAngle += envelope * fade * Math.PI * 2 * pulse.strength;
  }

  const pitchCos = Math.cos(twistAngle);
  const pitchSin = Math.sin(twistAngle);
  const isBackface = pitchCos < 0;

  const baseHalf = height * config.ribbonHeightRatio * 0.5;
  // Minimum visible ribbon thickness keeps crisp edge glint even at 90deg edge-on twist
  const halfThickness = Math.max(2.5, Math.abs(pitchCos) * baseHalf);

  // Satin shading combines curve slope and helical twist angle
  const shade = Math.max(-1, Math.min(1, slope * 0.55 + pitchSin * 0.55));

  return {
    yCenter,
    pitchCos,
    pitchSin,
    isBackface,
    shade,
    halfThickness,
  };
}
