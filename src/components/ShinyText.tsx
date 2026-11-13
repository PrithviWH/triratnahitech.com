import React from 'react';
import { buildShinyTextStyle, ShinyDirection } from '../utils/shinyText';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  spread?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  direction?: ShinyDirection;
  pauseOnHover?: boolean;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  spread = 115,
  delay = 0,
  color = 'rgba(228, 228, 231, 0.68)',
  shineColor = '#FFFFFF',
  direction = 'left',
  pauseOnHover = true,
  className = '',
  as = 'span',
}: ShinyTextProps) {
  const Tag = as;
  const computed = buildShinyTextStyle({
    speed,
    spread,
    delay,
    color,
    shineColor,
    direction,
    disabled,
  });

  return (
    <Tag
      data-shiny-text="true"
      className={`shiny-text ${disabled ? 'shiny-text--disabled' : ''} ${
        pauseOnHover ? 'shiny-text--pause-on-hover' : ''
      } ${className}`}
      style={{
        backgroundImage: disabled ? 'none' : computed.backgroundImage,
        backgroundSize: computed.backgroundSize,
        animationDuration: computed.animationDuration,
        animationDelay: computed.animationDelay,
        animationDirection: computed.animationDirection,
        color: computed.color,
      }}
    >
      {text}
    </Tag>
  );
}
