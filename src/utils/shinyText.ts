export type ShinyDirection = 'left' | 'right';

export interface ShinyTextOptions {
  speed?: number;
  spread?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  direction?: ShinyDirection;
  disabled?: boolean;
}

export interface ShinyTextComputedStyle {
  backgroundImage: string;
  backgroundSize: string;
  animationDuration: string;
  animationDelay: string;
  animationDirection: 'normal' | 'reverse';
  color: string;
}

export function buildShinyTextStyle({
  speed = 3,
  spread = 120,
  delay = 0,
  color = '#A1A1AA',
  shineColor = '#FFFFFF',
  direction = 'left',
  disabled = false,
}: ShinyTextOptions = {}): ShinyTextComputedStyle {
  const safeSpeed = Number.isFinite(speed) ? Math.max(0.5, speed) : 3;
  const safeSpread = Number.isFinite(spread) ? Math.min(170, Math.max(15, spread)) : 120;
  const safeDelay = Number.isFinite(delay) ? Math.max(0, delay) : 0;

  return {
    backgroundImage: `linear-gradient(${safeSpread}deg, ${color} 0%, ${color} 40%, ${shineColor} 48%, ${shineColor} 52%, ${color} 60%, ${color} 100%)`,
    backgroundSize: '250% 100%',
    animationDuration: `${safeSpeed}s`,
    animationDelay: `${safeDelay}s`,
    animationDirection: direction === 'right' ? 'reverse' : 'normal',
    color: disabled ? shineColor : 'transparent',
  };
}
