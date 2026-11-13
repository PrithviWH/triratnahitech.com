import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAssembleScatter,
  applyRadialShatter,
  generateTriangularShards,
  stepShatterPhysics,
} from './shatterPhysics';

test('generateTriangularShards produces deterministic paired triangles inside word bounds', () => {
  const bounds = { x: 10, y: 20, width: 120, height: 60, wordIndex: 0, tint: '#09090B' };
  const run1 = generateTriangularShards(bounds, 20, 101);
  const run2 = generateTriangularShards(bounds, 20, 101);

  assert.equal(run1.length, run2.length);
  assert.ok(run1.length >= 8);
  assert.deepEqual(run1[0].vertices, run2[0].vertices);

  for (const shard of run1) {
    assert.ok(shard.cx >= bounds.x && shard.cx <= bounds.x + bounds.width);
    assert.ok(shard.cy >= bounds.y && shard.cy <= bounds.y + bounds.height);
  }
});

test('applyAssembleScatter scatters shards and stepShatterPhysics converges cleanly to rest', () => {
  const shards = generateTriangularShards(
    { x: 0, y: 0, width: 140, height: 70, wordIndex: 1, tint: '#0F4C5C' },
    22,
    42,
  );
  applyAssembleScatter(shards, 70, 35, 48, 77);

  const scatteredSum = shards.reduce((acc, s) => acc + Math.hypot(s.dx, s.dy), 0);
  assert.ok(scatteredSum > 50, 'Shards should start scattered on assemble load');

  const idlePointer = { x: 0, y: 0, active: false };
  let isMoving = true;
  for (let i = 0; i < 240; i++) {
    isMoving = stepShatterPhysics(shards, 1 / 60, idlePointer).isMoving;
    if (!isMoving) break;
  }

  assert.equal(isMoving, false, 'Magnetic spring should settle completely within 4s');
  for (const shard of shards) {
    assert.equal(shard.dx, 0);
    assert.equal(shard.dy, 0);
    assert.equal(shard.angle, 0);
  }
});

test('applyRadialShatter blasts shards outward from impact point and hover cracks nearby shards', () => {
  const shards = generateTriangularShards(
    { x: 0, y: 0, width: 160, height: 80, wordIndex: 2, tint: '#C84B13' },
    20,
    55,
  );

  // Test hover cracking near center
  stepShatterPhysics(shards, 1 / 60, { x: 80, y: 40, active: true });
  const centerShards = shards.filter((s) => Math.hypot(s.cx - 80, s.cy - 40) < 40);
  assert.ok(centerShards.some((s) => s.crack > 0.1), 'Nearby shards should crack on hover');

  // Test radial shatter impulse
  applyRadialShatter(shards, 80, 40, 620, 12);
  const maxVel = Math.max(...shards.map((s) => Math.hypot(s.vx, s.vy)));
  assert.ok(maxVel > 200, 'Radial shatter should impart strong outward velocity');

  // Step a few frames without pointer and verify displacement then recovery
  for (let i = 0; i < 6; i++) {
    stepShatterPhysics(shards, 1 / 60, { x: 0, y: 0, active: false });
  }
  const displaced = shards.some((s) => Math.hypot(s.dx, s.dy) > 5);
  assert.equal(displaced, true, 'Shards should travel outward right after shatter');

  let settled = false;
  for (let i = 0; i < 240; i++) {
    const res = stepShatterPhysics(shards, 1 / 60, { x: 0, y: 0, active: false });
    if (!res.isMoving) {
      settled = true;
      break;
    }
  }
  assert.equal(settled, true, 'Shards should magnetically reassemble back to rest');
});
