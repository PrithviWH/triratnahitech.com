import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BorderPoint,
  createBorderOutline,
  projectPointToBorder,
  sampleBorderPointAt,
  wrap,
} from './starBorderGeometry';

test('createBorderOutline computes exact rounded rectangle perimeter', () => {
  const shape = createBorderOutline(100, 40, 10);
  // Straight top/bottom = 2 * 80 = 160; left/right = 2 * 20 = 40; 4 quarter arcs = 2*pi*10
  const expectedTotal = 200 + Math.PI * 20;
  assert.ok(Math.abs(shape.total - expectedTotal) < 1e-6);
});

test('sampleBorderPointAt traverses top edge with outward upward normal and wraps seamlessly', () => {
  const shape = createBorderOutline(120, 40, 12);
  const pt: BorderPoint = { x: 0, y: 0, nx: 0, ny: -1 };

  sampleBorderPointAt(shape, 10, pt);
  assert.ok(Math.abs(pt.x - 22) < 1e-6);
  assert.ok(Math.abs(pt.y - 0) < 1e-6);
  assert.ok(Math.abs(pt.ny - -1) < 1e-6);

  const wrappedDistance = wrap(-10, shape.total);
  assert.ok(wrappedDistance > 0 && wrappedDistance < shape.total);
});

test('projectPointToBorder maps clicks to nearest perimeter arc distance', () => {
  const shape = createBorderOutline(120, 40, 10);
  const topMidDist = projectPointToBorder(shape, 60, 4);
  const expectedTopMid = 50; // x=60 minus corner radius 10
  assert.ok(Math.abs(topMidDist - expectedTopMid) < 1e-4);

  const bottomMidDist = projectPointToBorder(shape, 60, 38);
  assert.ok(bottomMidDist > shape.total * 0.45 && bottomMidDist < shape.total * 0.8);
});
