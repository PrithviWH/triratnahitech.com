export interface Point2D {
  x: number;
  y: number;
}

export interface WordBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  wordIndex: number;
  tint: string;
}

export interface Shard {
  id: number;
  wordIndex: number;
  tint: string;
  /** Vertices in headline-local CSS coordinates */
  vertices: [Point2D, Point2D, Point2D];
  /** Centroid in headline-local CSS coordinates */
  cx: number;
  cy: number;
  /** Tight bounding box around the triangle in headline-local CSS coordinates */
  bx: number;
  by: number;
  bw: number;
  bh: number;
  /** Dynamic displacement relative to home centroid */
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  /** Rotation around (cx + dx, cy + dy) in radians */
  angle: number;
  vAngle: number;
  /** Fracture seam highlight intensity [0..1] */
  crack: number;
  /** Random variance factor per shard for organic scatter */
  mass: number;
}

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

export interface PhysicsConfig {
  springStiffness?: number;
  damping?: number;
  hoverRadius?: number;
  hoverRepulsion?: number;
  angularStiffness?: number;
  angularDamping?: number;
}

export const DEFAULT_PHYSICS_CONFIG: Required<PhysicsConfig> = {
  springStiffness: 210,
  damping: 16.5,
  hoverRadius: 118,
  hoverRepulsion: 18,
  angularStiffness: 190,
  angularDamping: 14,
};

/** Deterministic seeded PRNG (Mulberry32) */
export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generate crisp jittered polygonal triangle shards across a word's bounds */
export function generateTriangularShards(
  bounds: WordBounds,
  cellSize: number,
  seed = 1337,
  idStart = 0,
): Shard[] {
  const safeCell = Math.max(10, cellSize);
  const cols = Math.max(2, Math.round(bounds.width / safeCell));
  const rows = Math.max(2, Math.round(bounds.height / safeCell));
  const stepX = bounds.width / cols;
  const stepY = bounds.height / rows;
  const rng = createSeededRng(seed + bounds.wordIndex * 7919);

  // Build jittered vertex lattice; keep perimeter aligned so glyphs don't clip
  const grid: Point2D[][] = [];
  for (let r = 0; r <= rows; r++) {
    const rowPts: Point2D[] = [];
    for (let c = 0; c <= cols; c++) {
      const isEdgeX = c === 0 || c === cols;
      const isEdgeY = r === 0 || r === rows;
      const jitterX = isEdgeX ? 0 : (rng() - 0.5) * stepX * 0.68;
      const jitterY = isEdgeY ? 0 : (rng() - 0.5) * stepY * 0.68;
      rowPts.push({
        x: bounds.x + c * stepX + jitterX,
        y: bounds.y + r * stepY + jitterY,
      });
    }
    grid.push(rowPts);
  }

  const shards: Shard[] = [];
  let nextId = idStart;

  const pushTriangle = (p1: Point2D, p2: Point2D, p3: Point2D) => {
    const cx = (p1.x + p2.x + p3.x) / 3;
    const cy = (p1.y + p2.y + p3.y) / 3;
    const minX = Math.min(p1.x, p2.x, p3.x);
    const maxX = Math.max(p1.x, p2.x, p3.x);
    const minY = Math.min(p1.y, p2.y, p3.y);
    const maxY = Math.max(p1.y, p2.y, p3.y);

    shards.push({
      id: nextId++,
      wordIndex: bounds.wordIndex,
      tint: bounds.tint,
      vertices: [p1, p2, p3],
      cx,
      cy,
      bx: minX,
      by: minY,
      bw: Math.max(1, maxX - minX),
      bh: Math.max(1, maxY - minY),
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      vAngle: 0,
      crack: 0,
      mass: 0.8 + rng() * 0.45,
    });
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p00 = grid[r][c];
      const p10 = grid[r][c + 1];
      const p11 = grid[r + 1][c + 1];
      const p01 = grid[r + 1][c];

      if (rng() > 0.5) {
        pushTriangle(p00, p10, p11);
        pushTriangle(p00, p11, p01);
      } else {
        pushTriangle(p00, p10, p01);
        pushTriangle(p10, p11, p01);
      }
    }
  }

  return shards;
}

/** Scatter shards outward for the initial assemble-on-load entrance */
export function applyAssembleScatter(
  shards: Shard[],
  centerX: number,
  centerY: number,
  spread = 46,
  seed = 42,
): void {
  const rng = createSeededRng(seed);
  for (const shard of shards) {
    const rx = shard.cx - centerX;
    const ry = shard.cy - centerY;
    const dist = Math.hypot(rx, ry) || 1;
    const dirX = rx / dist;
    const dirY = ry / dist;
    const mag = spread * (0.45 + rng() * 0.85);

    shard.dx = dirX * mag + (rng() - 0.5) * spread * 0.55;
    shard.dy = dirY * mag + (rng() - 0.5) * spread * 0.55 - 10;
    shard.angle = (rng() - 0.5) * 0.65;
    shard.vx = 0;
    shard.vy = 0;
    shard.vAngle = 0;
    shard.crack = 0.7;
  }
}

/** Apply radial shatter velocity shockwave centered at (impactX, impactY) */
export function applyRadialShatter(
  shards: Shard[],
  impactX: number,
  impactY: number,
  strength = 620,
  seed = 99,
): void {
  const rng = createSeededRng(seed + Math.round(impactX * 13 + impactY * 7));
  const maxReach = 320;

  for (const shard of shards) {
    const rx = shard.cx - impactX;
    const ry = shard.cy - impactY;
    const dist = Math.hypot(rx, ry);
    const safeDist = Math.max(8, dist);
    const nx = dist < 1 ? (rng() - 0.5) * 2 : rx / safeDist;
    const ny = dist < 1 ? (rng() - 0.5) * 2 : ry / safeDist;

    const falloff = Math.max(0.28, 1 - Math.min(dist, maxReach) / (maxReach * 1.25));
    const jitter = 0.78 + rng() * 0.52;
    const impulse = (strength * falloff * jitter) / shard.mass;

    shard.vx += nx * impulse + (rng() - 0.5) * 140;
    shard.vy += ny * impulse + (rng() - 0.5) * 140 - 45 * falloff;
    shard.vAngle += (rng() - 0.5) * 14 * falloff;
    shard.crack = 1;
  }
}

/** Step spring-damper physics + pointer hover cracking forward by dt seconds */
export function stepShatterPhysics(
  shards: Shard[],
  dt: number,
  pointer: PointerState,
  config: PhysicsConfig = {},
): { isMoving: boolean } {
  const cfg = { ...DEFAULT_PHYSICS_CONFIG, ...config };
  const clampedDt = Math.min(0.033, Math.max(0.001, dt));

  let maxEnergy = 0;

  for (const shard of shards) {
    let targetDx = 0;
    let targetDy = 0;
    let targetAngle = 0;
    let targetCrack = 0;

    if (pointer.active) {
      const rx = shard.cx - pointer.x;
      const ry = shard.cy - pointer.y;
      const dist = Math.hypot(rx, ry);

      if (dist < cfg.hoverRadius) {
        const proximity = 1 - dist / cfg.hoverRadius;
        const smoothProx = proximity * proximity;
        const safeDist = Math.max(6, dist);
        const push = cfg.hoverRepulsion * smoothProx;

        targetDx = (rx / safeDist) * push;
        targetDy = (ry / safeDist) * push;
        const sign = (shard.id % 2 === 0 ? 1 : -1) * (0.5 + (shard.id % 5) * 0.12);
        targetAngle = sign * 0.14 * smoothProx;
        targetCrack = Math.min(1, proximity * 1.15);
      }
    }

    // Magnetic damped spring force toward target offset
    const fx = (targetDx - shard.dx) * cfg.springStiffness - shard.vx * cfg.damping;
    const fy = (targetDy - shard.dy) * cfg.springStiffness - shard.vy * cfg.damping;
    const fAng =
      (targetAngle - shard.angle) * cfg.angularStiffness - shard.vAngle * cfg.angularDamping;

    shard.vx += (fx / shard.mass) * clampedDt;
    shard.vy += (fy / shard.mass) * clampedDt;
    shard.vAngle += fAng * clampedDt;

    shard.dx += shard.vx * clampedDt;
    shard.dy += shard.vy * clampedDt;
    shard.angle += shard.vAngle * clampedDt;

    const motionCrack = Math.min(1, (Math.hypot(shard.dx, shard.dy) / 14) + Math.abs(shard.angle) * 2);
    const desiredCrack = Math.max(targetCrack, motionCrack);
    shard.crack += (desiredCrack - shard.crack) * Math.min(1, clampedDt * 14);

    // Snap cleanly to exact zero when settled and pointer is inactive or far
    const energy =
      Math.abs(shard.dx - targetDx) +
      Math.abs(shard.dy - targetDy) +
      Math.abs(shard.vx) * 0.05 +
      Math.abs(shard.vy) * 0.05 +
      Math.abs(shard.angle - targetAngle) * 10 +
      Math.abs(shard.vAngle) * 0.5 +
      (pointer.active ? 0 : shard.crack * 2);

    if (!pointer.active && energy < 0.04) {
      shard.dx = 0;
      shard.dy = 0;
      shard.vx = 0;
      shard.vy = 0;
      shard.angle = 0;
      shard.vAngle = 0;
      shard.crack = 0;
    } else {
      if (energy > maxEnergy) maxEnergy = energy;
    }
  }

  return { isMoving: maxEnergy >= 0.04 || pointer.active };
}
