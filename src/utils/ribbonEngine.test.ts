import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSatinShade,
  RibbonMotionState,
  sampleRibbonGeometry,
  stepRibbonMotion,
  wrapScrollOffset,
} from './ribbonEngine';

test('sampleRibbonGeometry produces perspective cross-sections spanning container width', () => {
  const samples = sampleRibbonGeometry({
    width: 1440,
    height: 170,
    segments: 48,
    time: 0,
  });

  assert.equal(samples.length, 49);
  assert.ok(samples[0].topX < 0, 'Ribbon bleeds past left edge');
  assert.ok(samples[samples.length - 1].topX > 1440, 'Ribbon bleeds past right edge');
  for (const s of samples) {
    assert.ok(s.light >= 0 && s.light <= 1.1);
    if (s.facing > 0.2) {
      assert.ok(s.topY < s.botY, 'Front-facing ribbon topY must sit above botY so text renders upright');
    }
  }
});

test('twist pulse induces 3D backface flip along propagating front', () => {
  const flat = sampleRibbonGeometry({
    width: 1200,
    height: 170,
    segments: 80,
    time: 0,
    pulses: [],
  });

  const twisted = sampleRibbonGeometry({
    width: 1200,
    height: 170,
    segments: 80,
    time: 0,
    pulses: [{ originU: 0.5, elapsed: 0.35, duration: 1.2, direction: 1 }],
  });

  const hasDiff = twisted.some((s, i) => Math.abs(s.facing - flat[i].facing) > 0.4);
  assert.equal(hasDiff, true, 'Twist pulse must rotate local ribbon roll angle');
});

test('stepRibbonMotion applies hover slowdown, decays drag flick velocity, and expires pulses', () => {
  const state: RibbonMotionState = {
    scrollPx: 0,
    dragVelocity: 400,
    speedMultiplier: 1,
    hovering: true,
    dragging: false,
    pulses: [{ originU: 0.5, elapsed: 1.1, duration: 1.2, direction: 1 }],
  };

  for (let i = 0; i < 30; i++) {
    stepRibbonMotion(state, 1 / 60, 60, 0.3);
  }

  assert.ok(state.speedMultiplier < 0.45, 'Speed multiplier should ease toward hoverSlowdown 0.3');
  assert.ok(state.dragVelocity < 80, 'Drag flick velocity should smoothly damp down');
  assert.equal(state.pulses.length, 0, 'Completed twist pulses should be removed');
});

test('wrapScrollOffset wraps negative and large offsets cleanly and computeSatinShade differentiates fold direction', () => {
  assert.equal(wrapScrollOffset(-25, 200), 175);
  assert.equal(wrapScrollOffset(450, 200), 50);

  const front = computeSatinShade(0.9, 0.9, true);
  const back = computeSatinShade(-0.9, 0.9, true);
  assert.notEqual(front, back);
});
