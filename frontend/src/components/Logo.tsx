import React from 'react';
import logoImage from 'figma:asset/9372f1a600303487c54d78dcb4ec88961d3e3eef.png';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 200, height = 80 }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="El Patero Grow Shop"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
