import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialRibbonState,
  DEFAULT_RIBBON_CONFIG,
  sampleRibbonSlice,
  stepRibbonState,
  triggerRibbonTwist,
} from './ribbonPhysics';

test('stepRibbonState advances scroll and slows smoothly while hovered', () => {
  const state = createInitialRibbonState(false);
  stepRibbonState(state, 0.1);
  const normalOffset = state.scrollPx;
  assert.ok(normalOffset > 0);

  state.isHovered = true;
  for (let i = 0; i < 40; i++) {
    stepRibbonState(state, 1 / 60);
  }
  assert.ok(state.hoverBlend > 0.85, 'Hover blend should approach 1');
  assert.ok(
    state.velocityPx < DEFAULT_RIBBON_CONFIG.baseSpeedPx * 0.5,
    'Ribbon velocity should slow smoothly while hovered for readability',
  );
});

test('triggerRibbonTwist propagates helical twist across ribbon and expires cleanly', () => {
  const state = createInitialRibbonState(false);
  triggerRibbonTwist(state, 0.5, 1);
  assert.equal(state.twists.length, 1);

  // Step slightly forward so wave crest reaches ~0.5..0.6
  for (let i = 0; i < 18; i++) {
    stepRibbonState(state, 1 / 60);
  }
  const activeSample = sampleRibbonSlice(0.65, 150, state);
  const plainState = createInitialRibbonState(false);
  plainState.phase = state.phase;
  const plainSample = sampleRibbonSlice(0.65, 150, plainState);

  assert.notEqual(
    activeSample.pitchCos,
    plainSample.pitchCos,
    'Active twist wave should alter ribbon pitch angle',
  );

  // Step past duration (1.45s) and verify pulse cleans up
  for (let i = 0; i < 90; i++) {
    stepRibbonState(state, 1 / 60);
  }
  assert.equal(state.twists.length, 0);
});

test('sampleRibbonSlice respects vertical bounds and keeps valid halfThickness', () => {
  const state = createInitialRibbonState(false);
  for (let x = 0; x <= 1; x += 0.1) {
    const s = sampleRibbonSlice(x, 160, state);
    assert.ok(s.yCenter > 10 && s.yCenter < 150);
    assert.ok(s.halfThickness >= 2.5);
  }
});
