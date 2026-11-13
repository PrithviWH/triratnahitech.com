import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShinyTextStyle } from './shinyText';

test('buildShinyTextStyle produces valid 120deg metallic sweep gradient with transparent fill when enabled', () => {
  const style = buildShinyTextStyle({
    speed: 3.5,
    spread: 115,
    color: '#A1A1AA',
    shineColor: '#FFFFFF',
    direction: 'left',
    disabled: false,
  });

  assert.equal(style.color, 'transparent');
  assert.equal(style.backgroundSize, '250% 100%');
  assert.equal(style.animationDuration, '3.5s');
  assert.equal(style.animationDirection, 'normal');
  assert.ok(style.backgroundImage.includes('linear-gradient(115deg,'));
  assert.ok(style.backgroundImage.includes('#FFFFFF 48%'));
});

test('buildShinyTextStyle clamps invalid speed/spread and reverses direction cleanly', () => {
  const style = buildShinyTextStyle({
    speed: 0.1,
    spread: 300,
    delay: -2,
    direction: 'right',
    disabled: true,
    shineColor: '#FDE68A',
  });

  assert.equal(style.animationDuration, '0.5s');
  assert.equal(style.animationDelay, '0s');
  assert.equal(style.animationDirection, 'reverse');
  assert.equal(style.color, '#FDE68A');
  assert.ok(style.backgroundImage.includes('linear-gradient(170deg,'));
});
