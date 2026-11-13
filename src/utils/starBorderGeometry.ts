export const STAR_BORDER_TAU = Math.PI * 2;
export const STAR_BORDER_WHITE: [number, number, number] = [255, 255, 255];

export interface BorderSegment {
  length: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  angle: number | null;
}

export interface BorderOutline {
  r: number;
  segments: BorderSegment[];
  total: number;
}

export interface BorderPoint {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function wrap(value: number, total: number): number {
  return ((value % total) + total) % total;
}

export function easeCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2;
}

export function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function formatRgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

export function createBorderOutline(
  width: number,
  height: number,
  radius: number,
): BorderOutline {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const arc = (Math.PI * r) / 2;
  const across = Math.max(0, width - 2 * r);
  const down = Math.max(0, height - 2 * r);

  const segments: BorderSegment[] = [
    { length: across, x: r, y: 0, dx: 1, dy: 0, angle: null },
    { length: arc, x: width - r, y: r, dx: 0, dy: 0, angle: -Math.PI / 2 },
    { length: down, x: width, y: r, dx: 0, dy: 1, angle: null },
    { length: arc, x: width - r, y: height - r, dx: 0, dy: 0, angle: 0 },
    { length: across, x: width - r, y: height, dx: -1, dy: 0, angle: null },
    { length: arc, x: r, y: height - r, dx: 0, dy: 0, angle: Math.PI / 2 },
    { length: down, x: 0, y: height - r, dx: 0, dy: -1, angle: null },
    { length: arc, x: r, y: r, dx: 0, dy: 0, angle: Math.PI },
  ];

  return {
    r,
    segments,
    total: Math.max(
      1,
      segments.reduce((sum, segment) => sum + segment.length, 0),
    ),
  };
}

export function sampleBorderPointAt(
  shape: BorderOutline,
  distance: number,
  point: BorderPoint,
): BorderPoint {
  let s = wrap(distance, shape.total);
  for (const segment of shape.segments) {
    if (segment.length > 0 && s <= segment.length) {
      if (segment.angle === null) {
        point.x = segment.x + segment.dx * s;
        point.y = segment.y + segment.dy * s;
        point.nx = segment.dy;
        point.ny = -segment.dx;
      } else {
        const angle = segment.angle + s / shape.r;
        point.nx = Math.cos(angle);
        point.ny = Math.sin(angle);
        point.x = segment.x + point.nx * shape.r;
        point.y = segment.y + point.ny * shape.r;
      }
      return point;
    }
    s -= segment.length;
  }
  return point;
}

export function projectPointToBorder(
  shape: BorderOutline,
  px: number,
  py: number,
): number {
  let best = Infinity;
  let found = 0;
  let offset = 0;

  for (const segment of shape.segments) {
    if (segment.length > 0) {
      let s = 0;
      let x = 0;
      let y = 0;
      if (segment.angle === null) {
        s = clamp(
          (px - segment.x) * segment.dx + (py - segment.y) * segment.dy,
          0,
          segment.length,
        );
        x = segment.x + segment.dx * s;
        y = segment.y + segment.dy * s;
      } else {
        let angle = wrap(
          Math.atan2(py - segment.y, px - segment.x) - segment.angle,
          STAR_BORDER_TAU,
        );
        if (angle > Math.PI / 2) {
          angle = angle > Math.PI * 1.25 ? 0 : Math.PI / 2;
        }
        s = angle * shape.r;
        x = segment.x + Math.cos(segment.angle + angle) * shape.r;
        y = segment.y + Math.sin(segment.angle + angle) * shape.r;
      }
      const distance = (px - x) ** 2 + (py - y) ** 2;
      if (distance < best) {
        best = distance;
        found = offset + s;
      }
    }
    offset += segment.length;
  }

  return found;
}
